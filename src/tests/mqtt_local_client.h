#include <Arduino.h>
#include <WiFi.h>
#include <PubSubClient.h>

// ==========================================
// SELETTORE DEL TEST (Imposta 1 o 2)
// 1 = Test Latenza (RTT)
// 2 = Stress Test (Packet Loss)
// ==========================================
#define TEST_TYPE 2  // <--- CAMBIA QUESTO NUMERO PER CAMBIARE TEST

// Credenziali della rete creata dalla ESP Centrale
const char* ssid = "FINDME_DEMO_AP";
const char* password = "change-me-before-use";
const char* mqtt_server = "192.168.4.1"; // L'IP della ESP Centrale
const char* topic_echo = "hotel/local/benchmark";

WiFiClient espClient;
PubSubClient client(espClient);
void finishTest();

unsigned long startTime = 0;
int msgCount = 0;

// Variabili per Test 1
unsigned long totalRTT = 0;
bool waitingForEcho = false;

// Variabili per Test 2
const int TOTAL_PACKETS = 20000;
int packetsAttempted = 0;
int publishSuccess = 0;
int publishFail = 0;
volatile int echoesReceived = 0;
bool testCompleted = false;

// ==========================================
// CALLBACK RICEZIONE
// ==========================================
void callback(char* topic, byte* payload, unsigned int length) {
  if (TEST_TYPE == 1) {
    unsigned long rtt = millis() - startTime;
    totalRTT += rtt;
    msgCount++;
    waitingForEcho = false;

    Serial.print("Pacchetto "); Serial.print(msgCount);
    Serial.print(" | Ritorno dal Broker: ✅ | Latenza: ");
    Serial.print(rtt); Serial.println(" ms");

    if (msgCount % 50 == 0) {
      Serial.print("\n---> STATISTICHE LATENZA LOCALE: Media su ");
      Serial.print(msgCount); Serial.print(" pkg: ");
      Serial.print(totalRTT / msgCount); Serial.println(" ms <---\n");
    }
  } 
  else if (TEST_TYPE == 2) {
    echoesReceived++;
  }
}

// ==========================================
// SETUP
// ==========================================
void setup() {
  Serial.begin(115200);
  delay(3000);

  Serial.println("\n=========================================");
  Serial.print("  ESP PERIFERICA (MAC: "); Serial.print(WiFi.macAddress()); Serial.println(")");
  if (TEST_TYPE == 1) Serial.println("  MODALITÀ: TEST 1 (LATENZA LOCALE)");
  else Serial.println("  MODALITÀ: TEST 2 (STRESS TEST LOCALE)");
  Serial.println("=========================================");

  // Connessione al Wi-Fi della ESP Centrale
  WiFi.begin(ssid, password);
  Serial.print("Connessione a 'Hotel_Rete_Locale'");
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println(" ✅");

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  while (!client.connected()) {
    Serial.print("Connessione al Broker Centrale...");
    String clientId = "ESP32-Node-" + String(random(0xffff), HEX);
    if (client.connect(clientId.c_str())) {
      Serial.println(" ✅");
      client.subscribe(topic_echo);
    } else { delay(3000); }
  }
  
  if (TEST_TYPE == 2) startTime = millis(); // Avvia cronometro Test 2
}

// ==========================================
// LOOP E TEST LOGIC
// ==========================================
void loop() {
  client.loop();

  if (TEST_TYPE == 1) {
    // TEST 1: LATENZA (Ping-Pong)
    if (!waitingForEcho) {
      delay(200); // Pausa di respiro (più veloce del cloud!)
      String payload = "LocalPing_" + String(msgCount);
      startTime = millis();
      waitingForEcho = true;
      client.publish(topic_echo, payload.c_str());
    }
  } 
  else if (TEST_TYPE == 2) {
    // TEST 2: STRESS TEST
    if (!testCompleted) {
      if (packetsAttempted < TOTAL_PACKETS) {
        String payload = "Stress_" + String(packetsAttempted);
        if (client.publish(topic_echo, payload.c_str())) publishSuccess++;
        else publishFail++;
        
        packetsAttempted++;
        delay(5); // In locale possiamo osare un delay minuscolo di 5ms!
      } 
      else if (packetsAttempted == TOTAL_PACKETS && (millis() - startTime < 10000)) {
         if (echoesReceived == publishSuccess) finishTest();
      } 
      else {
        finishTest();
      }
    }
  }
}

void finishTest() {
  testCompleted = true;
  float lossRate = 100.0 - (((float)echoesReceived / TOTAL_PACKETS) * 100.0);
  Serial.println("\n📊 === RISULTATI STRESS TEST MQTT LOCALE ===");
  Serial.print("Tempo totale:      \t"); Serial.print(millis() - startTime); Serial.println(" ms");
  Serial.print("Usciti (TX):       \t"); Serial.println(publishSuccess);
  Serial.print("Tornati (RX):      \t"); Serial.println(echoesReceived);
  Serial.print("📉 PACKET LOSS:    \t"); Serial.print(lossRate); Serial.println("%");
  Serial.println("============================================\n");
}
