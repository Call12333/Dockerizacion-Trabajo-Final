# 🔐 CyberBlue Security Portal

CyberBlue Security Portal es una aplicación web diseñada para simular un entorno de **Security Cloud**, permitiendo la gestión de usuarios, interacción con APIs y pruebas de seguridad en un entorno moderno.

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
