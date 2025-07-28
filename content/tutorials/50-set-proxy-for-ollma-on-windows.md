---
slug: set-proxy-for-ollma-on-windows
title: Set Proxy for Ollma on Windows
created_at: 2025-02-08 09:02:14
updated_at: 2025-07-27 21:43:57
author: ESP32Cube Team
summary: Set proxy for ollama on Windows
cover:
tags:
  - Web
views: 3320
likes: 0
category: tutorials
---

If you are work behind a proxy, Ollama will unable to pull models behind the proxy on windows. Here is the solution for it.

Actually, it's very simple to set proxy for Ollama on windows. Just need to add a new environment variable named `HTTPS_PROXY` with your proxy address.

Show as below figure

![[Pasted image 20250208165154.jpeg]]

Then open PowerShell and type: 

```
ollama run deepseek-r1:7b
```

It will pull the model from the proxy.

![[Pasted image 20250208165718.jpeg]]

That all.

There are several discussions about this issue on the web, but no one can provide a clear solution. And please note that no need to add environment variable `HTTP_PROXY`, it may interrupt client connections to the server.
