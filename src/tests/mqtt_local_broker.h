#include <Arduino.h>
#include <WiFi.h>
#include <PicoMQTT.h>

// Creiamo l'istanza del Broker MQTT direttamente dentro la ESP32
PicoMQTT::Server mqtt;

void setup() {
  Serial.begin(115200);
  delay(3000);

  Serial.println("\n=========================================");
  Serial.println("  ESP CENTRALE: ROUTER Wi-Fi + BROKER    ");
  Serial.print("  MAC Address: "); Serial.println(WiFi.macAddress());
  Serial.println("=========================================");

  // 1. Accendiamo l'Antenna in modalità Access Point (Router)
  WiFi.softAP("FINDME_DEMO_AP", "change-me-before-use");
  
  // L'indirizzo IP standard di una ESP32 in modalità SoftAP è sempre 192.168.4.1
  Serial.print("✅ Rete Wi-Fi creata! IP del Broker: ");
  Serial.println(WiFi.softAPIP());

  // 2. Avviamo il Broker MQTT
  mqtt.begin();
  Serial.println("✅ Broker MQTT Locale in ascolto sulla porta 1883...\n");
}

void loop() {
  // Lasciamo girare il broker in background per gestire il traffico
  mqtt.loop();
}
