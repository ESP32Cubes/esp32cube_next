---
slug: esp32arduino-scan-device-i2c-address
title: ESP32/Arduino Scan Device I2C Address
created_at: 2024-11-25 12:45:53
updated_at: 2025-07-28 00:21:06
author: ESP32Cube Team
summary: 
cover:
tags:
  - LED
  - AI
views: 704
likes: 0
category: tutorials
---

# ESP32/Arduino finds the address of I2C device

When uses I2C devices, it often needs to check whether the I2C device communicates rightly, or the device's I2C address is set wrong.

This code will scan the I2C bus from address 1 to address 127 and will print out the address of any devices that respond.

``` Arduino
#include <Wire.h>

void setup() {
  Wire.begin();
  Serial.begin(115200);
  Serial.println("I2C device scanner.");
}

void loop() {
  byte error, address;
  int nDevices;

  Serial.println("Scanning...");

  nDevices = 0;
  for(address = 1; address < 127; address++ )
  {
    // The i2c_scanner uses the return value of
    // the Write.endTransmisstion to see if
    // a device did acknowledge to the address.
    Wire.beginTransmission(address);
    error = Wire.endTransmission();

    if (error == 0)
    {
      Serial.print("I2C device found at address 0x");
      if (address<16)
        Serial.print("0");
      Serial.print(address,HEX);
      Serial.println("  !");

      nDevices++;
    }
    else if (error==4)
    {
      Serial.print("Unknow error at address 0x");
      if (address<16)
        Serial.print("0");
      Serial.println(address,HEX);
    }    
  }
  if (nDevices == 0)
    Serial.println("No I2C devices found\n");
  else
    Serial.println("done\n");

  delay(5000);           // wait 5 seconds for next scan
}
```
