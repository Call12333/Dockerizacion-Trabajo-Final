# 🔐 CyberBlue Security Portal

CyberBlue Security Portal es una aplicación web diseñada para simular un entorno de **Security Cloud**, permitiendo la gestión de usuarios, interacción con APIs y pruebas de seguridad en un entorno moderno.
<img width="1920" height="1080" alt="Captura de pantalla (3136)" src="https://github.com/user-attachments/assets/e27cce6c-0a05-4029-8a4b-e5241d656701" />

## 🚀 Tecnologías

* React + Vite
* Node.js + Express
* SQLite
* Docker

## 🧠 Propósito

Esta aplicación sirve como un laboratorio práctico para:

* Despliegue de aplicaciones en contenedores
* Pruebas de seguridad (SAST, DAST)
* Análisis de vulnerabilidades
* Simulación de entornos cloud

## ⚙️ Ejecución

```bash
npm install
npm run dev
```

## 🐳 Docker

```bash
docker build -t cyberblue-app .
docker run -p 3000:3000 --env-file .env cyberblue-app
```

## 🌐 Acceso

http://localhost:3000

## ⚠️ Nota

Proyecto desarrollado con fines educativos enfocados en ciberseguridad y análisis de aplicaciones.

---
Imagen Docker:
  https://hub.docker.com/r/aggelosx/cyberblue-app
