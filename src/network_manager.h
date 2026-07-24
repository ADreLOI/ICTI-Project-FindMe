#ifndef NETWORK_MANAGER_H
#define NETWORK_MANAGER_H

#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <esp_now.h>
#include <Preferences.h>
#include <ArduinoJson.h>

#if __has_include("config.h")
#include "config.h"
#endif

#ifndef FINDME_WIFI_SSID
#define FINDME_WIFI_SSID "YOUR_WIFI_SSID"
#endif
#ifndef FINDME_WIFI_PASSWORD
#define FINDME_WIFI_PASSWORD "YOUR_WIFI_PASSWORD"
#endif
#ifndef FINDME_MQTT_SERVER
#define FINDME_MQTT_SERVER "192.0.2.10"
#endif
#ifndef FINDME_MQTT_DATA_TOPIC
#define FINDME_MQTT_DATA_TOPIC "findme/demo/room"
#endif
#ifndef FINDME_MQTT_SETUP_TOPIC
#define FINDME_MQTT_SETUP_TOPIC "findme/demo/setup"
#endif

const char* ssid = FINDME_WIFI_SSID;
const char* password = FINDME_WIFI_PASSWORD;
const char* mqtt_server = FINDME_MQTT_SERVER;
const char* mqtt_data_topic = FINDME_MQTT_DATA_TOPIC;
const char* mqtt_setup_topic = FINDME_MQTT_SETUP_TOPIC;

WiFiClient espClient;
PubSubClient mqttClient(espClient);
Preferences preferences; 

String currentRoomID = "UNASSIGNED";
unsigned long lastMqttAttempt = 0; 

// Slave (PIR) State & Health
bool pirPresence = false;
unsigned long lastPIRUpdate = 0;
bool isSlaveOnline = false;

// ESP-NOW Strict Format
typedef struct struct_message { 
  uint8_t room_id; 
  bool isMotionDetected; 
} struct_message;
struct_message incomingData;

// Catch ESP-NOW Packets
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingDataBytes, int len) {
  Serial.printf("[ESP-NOW] Packet from %02X:%02X:%02X:%02X:%02X:%02X | len: %d (expected %d)\n",
                 mac[0], mac[1], mac[2], mac[3], mac[4], mac[5], len, sizeof(incomingData));
                 
  if (len == sizeof(incomingData)) {
    memcpy(&incomingData, incomingDataBytes, sizeof(incomingData));
    pirPresence = incomingData.isMotionDetected;
    lastPIRUpdate = millis(); 
    isSlaveOnline = true;
    Serial.printf("[ESP-NOW] SUCCESS! PIR Status: %s | Room ID: %d\n", pirPresence ? "MOTION" : "STILL", incomingData.room_id);
  } else {
    Serial.println("[ESP-NOW] ERROR: Payload size mismatch. Packet dropped.");
  }
}

// Catch Technician Room Setups via MQTT
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  String message;
  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }
  
  if (String(topic) == mqtt_setup_topic) {
    currentRoomID = message;
    preferences.putString("room_id", currentRoomID); // Save to Permanent Memory
    Serial.println(">>> TECH UPDATE: Room ID permanently set to: " + currentRoomID);
  }
}

void setup_network_and_memory() {
  // Load Room ID from Memory
  preferences.begin("vda-config", false);
  currentRoomID = preferences.getString("room_id", "UNASSIGNED");
  Serial.println("Booting up... Room Assigned: " + currentRoomID);

  WiFi.mode(WIFI_STA);
  Serial.print("MASTER MAC ADDRESS: ");
  Serial.println(WiFi.macAddress());
  WiFi.begin(ssid, password);
  
  // Wait a bit to connect so we can log the channel
  unsigned long startAttempt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startAttempt < 5000) {
    delay(100);
  }
  Serial.printf("[NETWORK] Connected to Wi-Fi. Channel: %d\n", WiFi.channel());
  
  mqttClient.setServer(mqtt_server, 1883);
  mqttClient.setCallback(mqttCallback);

  if (esp_now_init() == ESP_OK) {
    esp_now_register_recv_cb(OnDataRecv);
  }
}

void loop_network() {
  // Background Reconnect Logic
  if (WiFi.status() == WL_CONNECTED) {
    if (!mqttClient.connected()) {
      if (millis() - lastMqttAttempt > 5000) {
        lastMqttAttempt = millis();
        if (mqttClient.connect("VDA_MasterHub_77X")) {
          Serial.println("[NETWORK] MQTT Connected!");
          mqttClient.subscribe(mqtt_setup_topic); // Listen for React Mockup config
        }
      }
    } else {
      mqttClient.loop();
    }
  }

  // Slave Health Monitor
  if (isSlaveOnline && (millis() - lastPIRUpdate > 10000)) {
    isSlaveOnline = false;
    pirPresence = false;
    Serial.println("[ESP-NOW] WARNING: PIR Slave Node has gone OFFLINE! (No packets for 10s)");
  }
}

// Data Publisher
void publish_data_to_mqtt(bool isOccupied, String roomStatus, bool bleJanitorPresent = false, int bleJanitorRssi = -100) {
    if (mqttClient.connected()) {
      StaticJsonDocument<256> doc;
      doc["room_id"] = currentRoomID;
      doc["status"] = roomStatus;      
      doc["is_occupied"] = isOccupied; 
      doc["pir_node_status"] = isSlaveOnline ? "ONLINE" : "OFFLINE";
      doc["pir_motion"] = pirPresence;
      doc["ble_janitor_present"] = bleJanitorPresent;
      doc["ble_janitor_rssi"] = bleJanitorRssi;

      char jsonBuffer[256];
      serializeJson(doc, jsonBuffer);
      mqttClient.publish(mqtt_data_topic, jsonBuffer);
      
      Serial.print("Published MQTT: ");
      Serial.println(jsonBuffer);
    }
}
#endif
