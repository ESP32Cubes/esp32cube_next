---
slug: crafting-a-best-selling-solar-e-ink-weather-station
title: Crafting a Best-Selling Solar E-Ink Weather Station
created_at: 2024-11-25 12:45:52
updated_at: 2025-07-28 02:02:56
author: ESP32Cube Team
summary: 
cover:
tags:
  - Display
  - LED
  - AI
views: 625
likes: 0
category: projects
---

## Introduction

With the increasing severity of climate change, people are paying more attention to the weather. As a result, more individuals are starting to install weather displays at home to stay informed about local meteorological conditions. This solar-powered electronic paper weather station perfectly meets this need. Its compact size allows for seamless integration into window frames, and its extremely low power consumption, coupled with solar charging capabilities, ensures long-term operation even without a stable power supply, making it a potential best-seller.

![[Pasted image 20240614190526.png]]

## Features and Characteristics

The concept of this weather station is to power the energy collection module with a solar cell. When the solar cell generates electricity, the energy collection module will charge. This energy collection method works even under very low solar input conditions, making it highly suitable for indoor energy collection. To reduce power consumption, the display can be turned off after updating, ensuring the battery lasts for a long time.

![[Pasted image 20240614190554.png]]

The weather station uses the ESP32 S3 Mini as the control core, paired with a Tri-Color ePaper 2.13 (SSD1680) shield display, which offers a clear display with extremely low power consumption. Its three monocrystalline silicon solar cells provide reliable charging capabilities, and with the SPV1050 micro solar power manager, ample power supply is ensured. The TPS73733DCQR low-dropout voltage regulator, a 1000uF 10V electrolytic capacitor, and the SPV1050 micro solar power manager enable efficient battery charging and energy management.

![[Pasted image 20240614190607.png]]

## Bill of Materials

- **Hardware Components**:
  - ESP32 S3 Mini: 1
  - Tri-Color ePaper 2.13 (SSD1680) Shield: 1
  - MONOCRYST SOLAR CELL 147MW 4.15V - SM111K06L: 3
  - SPV1050 Micro Solar Power Manager: 1
  - TPS73733DCQR Low-Dropout Voltage Regulator: 1
  - 1000uF 10V Electrolytic Capacitor: 1
  - 3D Printed Case: 1
  - M2*4 Flat Head Self-Tapping Screws: 2
  - M2*20 Flat Head Self-Tapping Screws: 4

- **Software Applications and Online Services**:
  - Arduino IDE

- **Hand Tools and Machinery**:
  - 3D Printer

## Production Process

Firstly, some modifications to the ESP 32 S3 Mini module are required, including removing the integrated RGB LED and replacing the voltage regulator.

![[Pasted image 20240614190623.png]]

Next, install the solar cells, micro solar power manager, and other components, and connect them according to the schematic diagram.

![[Pasted image 20240614190638.png]]

During installation, consider the cable length to ensure accurate connections between components.

![[Pasted image 20240614190653.png]]
## Advantages

- Solar-powered, energy-saving, and environmentally friendly
- Compact size, can be embedded in window frames
- Clear display effect, extremely low power consumption, capable of working under very low solar input conditions, and can operate for a long time

![[Pasted image 20240614190708.png]]
## Summary

The solar electronic paper weather station has the advantages of being compact, energy-saving, and easy to make and install. By utilizing solar charging and low-power design, this weather station is not only suitable for home use but also suitable for commercial and school settings. Although this is a quick prototype design, it can be further optimized for power consumption and functionality to meet the needs of different users in the future.

Project Address: [Solar E-Ink Weather Station on GitHub](https://github.com/rsappia/Solar_E-Ink_Weather_Station)
