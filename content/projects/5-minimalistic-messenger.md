---
slug: minimalistic-messenger
title: Minimalistic Messenger
created_at: 2024-11-25 12:45:52
updated_at: 2025-07-28 00:08:26
author: ESP32Cube Team
summary: 
cover:
tags:
  - Display
  - LED
  - AI
views: 786
likes: 0
category: projects
---

**Original Project Title**: ESP32 - Minimalistic Messenger

**Project Author**: Volos Projects

## Introduction

Hello everyone! This time, we're sharing a project that uses ESP-NOW for bidirectional communication.

![[0e76b7e1092b51c42c656e2601f2fd6f_MD5.png]]

The author has crafted these simple devices capable of sending brief text messages to each other using the ESP-NOW protocol. The operation is handled by the M5Stack Atom S3 development board.

![[d64e8a957cf040513aced6038eab822e_MD5.png]]

## Device Functionality Overview

The author demonstrates how to use these two devices for simple text communication. By inputting a message, such as "hello how are you," and sending it to the other device, the recipient can receive and reply with a message like "I'm great, thanks." These messages are displayed in different colors on both devices to differentiate between received and sent messages.

## Technical Implementation and Challenges

This project utilizes two devices connected via ESP to send simple messages. The author learned how to implement bidirectional ESP communication by reading online tutorials. The challenge of this project was to use a compact M5 Stack Atom S3 development board equipped with a built-in 128x128 display, infrared LED, buttons, accelerometer, gyroscope, and other functionalities of the ESP32 device. To meet the project requirements, a simple PCB board was designed.

![[c9237f3ec7ed5792adf623594c62d934_MD5.png]]

The author aimed to make the device as small as possible, opting for the M5 Atom development board. Although a larger development board with a touchscreen or an M5 card computer might have been better options, the author preferred the current design. The display part of the device can only show the four most recent messages, with each message limited to 20 characters, and there is no scrolling system. The keyboard design is also very simple but sufficient for basic communication.

The device can serve as a great learning tool or a children's toy, while also offering some entertainment value to the project creators. The author also mentioned a comment emphasizing that the joy of the journey and learning process surpasses the destination itself.

## Resources

**GitHub Code Link**: [Messenger](https://github.com/VolosR/Messenger/)

**Author's PCB Material**: [Mini ESP32 Comunicactors](https://www.pcbway.com/project/shareproject/Mini_ESP32_Comunicactors_46e3a05a.html)
