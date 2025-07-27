---
slug: "esp32-wifi-tutorial"
title: "ESP32 WiFi Configuration Tutorial"
cover: 
date: "2025-01-25"
author: "ESP32Cube Team"
tags: ["ESP32", "WiFi", "网络"]
---

# ESP32 WiFi Configuration Tutorial

本教程将详细介绍如何在ESP32上配置WiFi连接，包括基础连接、自动重连和网络管理功能。

## 硬件要求

- ESP32开发板
- USB数据线
- 电脑或手机热点

## 基础WiFi连接

### 1. 基本连接代码

```cpp
#include <WiFi.h>

const char* ssid = "你的WiFi名称";
const char* password = "你的WiFi密码";

void setup() {
  Serial.begin(115200);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("正在连接WiFi...");
  }
  
  Serial.println("WiFi连接成功!");
  Serial.print("IP地址: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // 主程序循环
}
```

### 2. 连接状态检查

```cpp
void checkWiFiStatus() {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi已连接");
    Serial.print("信号强度: ");
    Serial.println(WiFi.RSSI());
  } else {
    Serial.println("WiFi连接断开");
  }
}
```

## 高级功能

### 自动重连机制

```cpp
#include <WiFi.h>

const char* ssid = "你的WiFi名称";
const char* password = "你的WiFi密码";

void setupWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\nWiFi连接成功!");
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi连接丢失，正在重连...");
    setupWiFi();
  }
  
  delay(5000); // 每5秒检查一次
}
```

### WiFi扫描功能

```cpp
void scanWiFiNetworks() {
  int n = WiFi.scanNetworks();
  
  Serial.println("扫描完成");
  if (n == 0) {
    Serial.println("未找到网络");
  } else {
    Serial.print(n);
    Serial.println(" 个网络 found");
    
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

## 常见问题解决

### 1. 连接超时

如果WiFi连接经常超时，可以尝试以下解决方案：

- 检查WiFi信号强度
- 确认密码正确性
- 增加连接超时时间

### 2. 信号不稳定

```cpp
// 设置WiFi功率
WiFi.setTxPower(WIFI_POWER_19_5dBm);

// 设置WiFi模式
WiFi.mode(WIFI_STA);
```

## 总结

通过本教程，您应该能够：

- ✅ 配置基本的WiFi连接
- ✅ 实现自动重连功能
- ✅ 扫描可用网络
- ✅ 处理连接问题

这些技能是ESP32物联网项目的基础，掌握后将能够开发更复杂的网络应用。 