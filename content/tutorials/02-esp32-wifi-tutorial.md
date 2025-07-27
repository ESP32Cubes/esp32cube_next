---
slug: "esp32-wifi-tutorial"
title: "ESP32 WiFi Configuration Tutorial"
cover: 
date: "2025-01-25"
author: "ESP32Cube Team"
tags: 
  - ESP32
  - WiFi
  - Network
---

# ESP32 WiFi Configuration Tutorial

This tutorial will detail how to configure WiFi connections on ESP32, including basic connections, automatic reconnection, and network management features.

## Hardware Requirements

- ESP32 development board
- USB data cable
- Computer or mobile hotspot

## Basic WiFi Connection

### 1. Basic Connection Code

```cpp
#include <WiFi.h>

const char* ssid = "Your WiFi Name";
const char* password = "Your WiFi Password";

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  
  Serial.println("WiFi connected successfully!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Main program loop
}
```

### 2. Connection Status Check

```cpp
void checkWiFiStatus() {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi is connected");
    Serial.print("Signal strength: ");
    Serial.println(WiFi.RSSI());
  } else {
    Serial.println("WiFi connection lost");
  }
}
```

## Advanced Features

### Automatic Reconnection Mechanism

```cpp
#include <WiFi.h>

const char* ssid = "Your WiFi Name";
const char* password = "Your WiFi Password";

void setupWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi connected successfully!");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connection lost, reconnecting...");
    setupWiFi();
  }
  
  delay(5000); // Check every 5 seconds
}
```

### WiFi Scanning Function

```cpp
void scanWiFiNetworks() {
  int n = WiFi.scanNetworks();
  
  Serial.println("Scan completed");
  if (n == 0) {
    Serial.println("No networks found");
  } else {
    Serial.print(n);
    Serial.println(" networks found");
    
    for (int i = 0; i < n; ++i) {
      Serial.print(i + 1);
      Serial.print(": ");
      Serial.print(WiFi.SSID(i));
      Serial.print(" (");
      Serial.print(WiFi.RSSI(i));
      Serial.print(")");
      Serial.println((WiFi.encryptionType(i) == WIFI_AUTH_OPEN)?" ":"*");
      delay(10);
    }
  }
}
```

## Common Problem Solutions

### 1. Connection Timeout

If WiFi connections frequently timeout, you can try the following solutions:

- Check WiFi signal strength
- Confirm password correctness
- Increase connection timeout

### 2. Unstable Signal

```cpp
// Set WiFi power
WiFi.setTxPower(WIFI_POWER_19_5dBm);

// Set WiFi mode
WiFi.mode(WIFI_STA);
```

## Summary

Through this tutorial, you should be able to:

- ✅ Configure basic WiFi connections
- ✅ Implement automatic reconnection functionality
- ✅ Scan available networks
- ✅ Handle connection issues

These skills are the foundation for ESP32 IoT projects. After mastering them, you will be able to develop more complex network applications. 