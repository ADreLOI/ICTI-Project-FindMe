<a id="top"></a>

# FindMe - True Presence Detection

<p align="center">
  <img src="assets/cover/findme-prototype.jpg" alt="FindMe bedside-lamp prototype and sensor enclosure" width="900" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-2563EB?style=flat-square" alt="Version 1.0.0" />
  <img src="https://img.shields.io/badge/course-ICT%20Innovation-0F766E?style=flat-square" alt="ICT Innovation course" />
  <img src="https://img.shields.io/badge/partner-VDA%20Telkonet-0891B2?style=flat-square" alt="VDA Telkonet" />
  <img src="https://img.shields.io/badge/hardware-ESP32--S3%20%7C%20ESP32-EA580C?style=flat-square" alt="ESP32 hardware" />
</p>

> A privacy-preserving, multi-sensor occupancy prototype for hospitality rooms and care environments. FindMe detects real guest presence, including quiet activities such as sleeping or reading, without cameras or microphones.

<p align="center"><em>Cover: FindMe's final lamp-integrated prototype concept, created by the project team.</em></p>

## Table of contents

- [The problem](#the-problem)
- [The solution](#the-solution)
- [System architecture](#system-architecture)
- [Evaluation](#evaluation)
- [Repository guide](#repository-guide)
- [Run the prototypes](#run-the-prototypes)
- [Media and documentation](#media-and-documentation)
- [Privacy and security](#privacy-and-security)
- [Course and partner](#course-and-partner)
- [Team](#team)
- [Repository topics](#repository-topics)

## The problem

Traditional hotel room-management systems commonly rely on keycards and PIR motion sensors. They can classify a still guest as absent, causing false negatives that affect comfort, energy management, and safety.

FindMe addresses this gap for luxury hospitality, assisted living, and rehabilitation scenarios, where true presence matters even when a person is not moving.

<p align="right"><a href="#top">Back to top</a></p>

## The solution

FindMe is designed as a plug-and-play bedside-lamp concept with sensing integrated in a discrete enclosure. It combines:

- 24 GHz mmWave radar for micro-movements such as breathing
- PIR sensing for motion events
- CO2 / TVOC context from an SGP30 environmental sensor
- BLE badges for staff and janitor context
- ESP-NOW communication between nodes and MQTT integration with the room-management mockup
- DOWA and Dempster-Shafer Theory fusion to combine evidence and represent uncertainty

No camera or microphone is used.

<p align="right"><a href="#top">Back to top</a></p>

## System architecture

```text
PIR node + BLE badge ------ ESP-NOW ------+
                                             \
mmWave radar + CO2 / TVOC --- UART / I2C ---- ESP32-S3 master --- MQTT --- Room-control mockup
                                              /
                              DOWA / DST evidence fusion
```

The fusion model produces **Occupied**, **Empty**, or **Unknown** evidence states. Sensor weights can be reduced when a sensor is inactive or reports an error, preventing one weak input from dominating the decision.

<p align="right"><a href="#top">Back to top</a></p>

## Evaluation

The final prototype evaluation used **250 samples**. It reported **zero false negatives**, **100% recall**, **71.6% precision**, **83.5% F1 score**, and **76.4% accuracy**. These results prioritise reliable presence detection, which is the core safety requirement of the concept.

The project was discussed with **VDA Telkonet** and demonstrated with hospitality stakeholders at **Best Western Hotel Adige**.

<p align="right"><a href="#top">Back to top</a></p>

## Repository guide

```text
src/                         # ESP32-S3 firmware and sensor integration
src/tests/                   # Isolated tests for mmWave, PIR, BLE, MQTT, ESP-NOW, and fusion
mockup/                      # Vite + React room-control interface
Slides/                      # Project presentation material
MOD_DOWA_Fusion_Model.pdf    # Fusion-model reference
sessione_completa.csv        # Evaluation-session data
platformio.ini               # ESP32-S3 PlatformIO configuration
```

<p align="right"><a href="#top">Back to top</a></p>

## Run the prototypes

### Firmware

Install [PlatformIO](https://platformio.org/), then create a local configuration file before connecting to any network:

```bash
cp src/config.example.h src/config.h
# Edit src/config.h with your isolated demo Wi-Fi and MQTT values.
pio run -e esp32s3_n16r8
pio run -e esp32s3_n16r8 -t upload
pio device monitor -b 115200
```

`src/config.h` is ignored by Git. Never commit a Wi-Fi password, MQTT credential, room identifier, or production endpoint.

### Room-control mockup

```bash
cd mockup
cp .env.example .env
npm install
npm run dev
```

The mockup is a demonstrator: its technician password must be configured locally, and production authentication belongs on a server rather than in browser code.

<p align="right"><a href="#top">Back to top</a></p>

## Media and documentation

- [DOWA fusion-model reference](./MOD_DOWA_Fusion_Model.pdf)
- [Presentation material](./Slides)
- Final presentation videos, including the demo, lamp hardware mockup, interface mockup, and failure-model overview, are retained with the course project material.

<p align="right"><a href="#top">Back to top</a></p>

## Privacy and security

- The design avoids cameras and microphones.
- Network and mockup credentials are intentionally local-only and ignored by Git.
- The prototype's client-side UI guard is demo-only; real deployments require server-side authentication, TLS, access control, and credential rotation.

<p align="right"><a href="#top">Back to top</a></p>

## Course and partner

Developed for the **ICT Innovation** course at the University of Trento in collaboration with **VDA Telkonet**.

<p align="right"><a href="#top">Back to top</a></p>

## Team

**Team 7**

| Member | GitHub | LinkedIn | Email |
| --- | --- | --- | --- |
| Andrea Lo Iacono | [ADreLOI](https://github.com/ADreLOI) | [andreloi](https://www.linkedin.com/in/adreloi) | [andrea.loiacono@studenti.unitn.it](mailto:andrea.loiacono@studenti.unitn.it) |
| Jago Revrenna | [jagorev](https://github.com/jagorev) | [jagorevrenna](https://www.linkedin.com/in/jagorevrenna) | [jago.revrenna@studenti.unitn.it](mailto:jago.revrenna@studenti.unitn.it) |
| Matthew De Marco | [MattDema](https://github.com/MattDema) | Profile link pending confirmation | [matthew.demarco@studenti.unitn.it](mailto:matthew.demarco@studenti.unitn.it) |
| Sophia Sau | Profile link pending confirmation | [sophia-sau-200034348](https://www.linkedin.com/in/sophia-sau-200034348) | [sophia.sau@studenti.unitn.it](mailto:sophia.sau@studenti.unitn.it) |
| Alessio Leonardi | Profile link pending confirmation | [alessio-leonardi2](https://www.linkedin.com/in/alessio-leonardi2) | [alessio.leonardi@studenti.unitn.it](mailto:alessio.leonardi@studenti.unitn.it) |

Profile links are included only where they were already publicly provided in project material or verified from repository history; no profile has been guessed.

<p align="right"><a href="#top">Back to top</a></p>

## Repository topics

`internet-of-things` `smart-hospitality` `occupancy-detection` `embedded-systems` `esp32` `mmwave-radar` `mqtt` `react` `vite` `privacy-by-design` `university-of-trento`

<p align="right"><a href="#top">Back to top</a></p>
