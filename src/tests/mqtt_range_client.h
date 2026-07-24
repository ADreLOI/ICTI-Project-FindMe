#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

WiFiClient espClient;
PubSubClient client(espClient);
int msgCount = 0;

void setup() {
  Serial.begin(115200);
  delay(2000);
  WiFi.begin("FINDME_DEMO_AP", "change-me-before-use");
  Serial.print("Connessione Wi-Fi...");
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println(" ✅");

  client.setServer("192.168.4.1", 1883);
  while (!client.connected()) {
    if (client.connect("ESP32-RangeTester")) {
      Serial.println("🚶 CLIENT MQTT: Inizio Test Range...");
    } else { delay(2000); }
  }
}

void loop() {
  client.loop();
  delay(500);
  
  if (WiFi.status() == WL_CONNECTED) {
    String payload = "Ping_" + String(msgCount++);
    client.publish("hotel/range", payload.c_str());
    long rssi = WiFi.RSSI();
    Serial.print("✅ MQTT Ping | Segnale Wi-Fi (RSSI): ");
    Serial.print(rssi); Serial.println(" dBm");
  } else {
    Serial.println("❌ MQTT Disconnesso (Wi-Fi Fuori Portata!)");
  }
}
