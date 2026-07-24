<div align="center">
  # FindMe

  **Privacy-first true-presence detection for luxury hospitality and care environments**

  ![Version](https://img.shields.io/badge/version-1.0.0-0f766e?style=for-the-badge)
  ![ESP32](https://img.shields.io/badge/ESP32-S3-000000?style=for-the-badge&logo=espressif&logoColor=white)
  ![IoT](https://img.shields.io/badge/IoT-Sensor_Fusion-2563eb?style=for-the-badge)
  ![Privacy](https://img.shields.io/badge/privacy-no_cameras_or_microphones-0f766e?style=for-the-badge)

  **A smart-room prototype that detects true occupancy without cameras or microphones, even when a guest is sleeping or otherwise still.**
</div>

## The problem

Conventional hospitality presence systems depend on keycards and PIR motion sensors. They often classify a motionless guest as absent, which can cut lighting or HVAC unexpectedly; they also waste energy when a keycard is bypassed. The problem is similarly relevant in residential-care and rehabilitation settings, where staff need a trustworthy and privacy-respecting occupancy signal.

## The solution

FindMe packages a multi-sensor occupancy system inside an elegant bedside-lamp concept. Its local sensing and evidence-fusion pipeline combines:

- **24 GHz mmWave radar** to detect micro-movements such as breathing.
- **PIR sensing** for movement events.
- **CO2, temperature and humidity signals** for complementary room context.
- **BLE staff badges** to distinguish staff activity from guest presence.
- **ESP32-S3 edge processing** so raw sensing data remains in the room.

The prototype communicates its final decision to a dashboard through MQTT, with ESP-NOW used between microcontrollers. The proposed architecture applies mTLS, short-lived JWTs, MQTT QoS 1 and topic isolation.

## Decision model

The core of FindMe is a weighted Dempster-Shafer evidence-fusion model:

1. Each sensor assigns belief to `OCCUPIED`, `EMPTY` or `UNKNOWN`.
2. DOWA weights reflect expected sensor reliability and degrade when a sensor is unavailable or inconsistent.
3. Dempster-Shafer combination exposes cross-sensor conflict instead of hiding it.
4. Asymmetric hysteresis prioritises avoiding false-empty decisions, which is important when a guest may be asleep.

In the final test set of 250 samples, the prototype recorded **zero false negatives** (100% recall) while making the remaining radar-clutter limitation visible in its precision and conflict metrics.

## Prototype architecture

```text
Bedroom ESP32-S3: mmWave + fusion + MQTT
         ^ ESP-NOW                     | Wi-Fi / MQTT over TLS
         |                             v
Entrance ESP32: PIR + BLE       Hotel dashboard / EMS-GRMS integration
Bathroom ESP32: PIR + environmental sensors
```

## Business and deployment proposition

- Designed for hotel rooms, residential care and rehabilitation facilities.
- Plug-and-play bedside-lamp form factor: no room drilling or invasive installation.
- Target prototype bill of materials: approximately EUR70; target selling price: EUR180.
- Validated with VDA Telkonet and the management of Best Western Hotel Adige.

## Project media

The project materials include a final presentation, a working demonstration, interface mock-ups, the room and hardware mock-up, and a failure-mode walkthrough. These are ideal media items for a project portfolio or LinkedIn entry.

## Team and context

Developed for the **ICT Innovation** course at the University of Trento in collaboration with **VDA Telkonet**.

- Andrea Lo Iacono
- Jago Revrenna
- Matthew De Marco
- Sophia Sau
- Alessio Leonardi

## Notes on the repository

This repository documents an academic prototype. It deliberately omits customer credentials, production MQTT certificates and any hotel-identifying operational data.
