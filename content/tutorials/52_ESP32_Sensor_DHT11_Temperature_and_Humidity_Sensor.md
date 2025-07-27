---
title: ESP32 Sensor DHT11 Temperature and Humidity Sensor
tags: 
summary: 
slug: esp32-sensor-dht11-temperature-and-humidity-sensor
date: 2024-11-25
author: ESP32Cube Team
---

# DHT11 Temperature and Humidity Sensor

DHT11 can measure both temperature and humidity, it is a popular, cost-effective sensor. In this article we will discuss how to read temperature and humidity with ESP32 and DHT11.

![[../images/aea7154f82a4235eb82421097f297927_MD5.jpg]]

## Hardware Required

- ESP32 development board
- DHT11 temperature and humidity sensor
- Jumper wires

## Wire Connection

- Connect V of DHT11 to the 3.3V or 5V pin on the ESP32.
- Connect G of DHT11 to one of the GND pins on the ESP32.
- Connect S pin of DHT11 to a GPIO pin on the ESP32 (e.g., GPIO 5).

The supply voltage for the DHT11 is 3~5.5V.
![[../images/fa0f63c6db65330d1d3da64c96f08177_MD5.jpg]]

## Installing the DHT Library

We will use the DHT library to read temperature and humidity from the DHT11 sensor.

Search for DHT library in the PlatformIO Library Manager and install it.

![[../images/a9d1d4e032ea9a1d3448904e16ed06d2_MD5.png]]

Library installation, click on the "Add to Project" button.

![[../images/f6f0506e2756ee930071ad6f5c471eec_MD5.png]]

Then choose the project we defined earlier and click on the "Add" button.

![[../images/d28d7f2afd97ef65ef676956ae8dc418_MD5.png]]

## Code

Here is the example code to read temperature and humidity from the DHT11 sensor and print it to the serial monitor.

```c++
#include <Arduino.h>
#include "DHT.h"

#define DHTPIN 5     // GPIO pin the sensor is connected to
#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  // Reading temperature and humidity
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }

  // Print the results to the serial monitor
  Serial.print("Humidity: ");
  Serial.print(h);
  Serial.print("%  Temperature: ");
  Serial.print(t);
  Serial.println("°C ");

  delay(2000); // Delay between measurements
}
```

Upload the code to the ESP32 and then open the serial monitor.

![[../images/f532c5feeca586db8e20684ccb3e8cb4_MD5.png]]

We can see the temperature and humidity readings, shows as below:

![[../images/821ea0deddc5c5b387ca242aa0cae55f_MD5.png]]

The project upload to github, link: [ESP32-Tutorials/01_DHT11 at main · ESP32Cubes/ESP32-Tutorials (github.com)](https://github.com/ESP32Cubes/ESP32-Tutorials/tree/main/01_DHT11)
