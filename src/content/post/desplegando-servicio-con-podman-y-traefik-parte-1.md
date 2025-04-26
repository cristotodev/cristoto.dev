---
title: "Desplegando Servicios con Podman y Traefik (Parte 1)"
description: "Primera parte de una serie donde desplegamos servicios usando Podman y Traefik. Preparación del entorno, configuración inicial y resolución de problemas."
publishDate: "26 Apr 2025"
updatedDate: "26 Apr 2025"
tags: ["podman", "traefik", "server"]
coverImage:
  src: "https://res.cloudinary.com/cristotodev/image/upload/v1745659667/cristotodev/blog/podman-traefik_saoofc.webp"
  alt: "Podman y traefik"
---

## 📅 Introducción

En esta serie de entradas quiero documentar mi proceso de aprendizaje y puesta en marcha de una infraestructura ligera basada en **Podman** y **Traefik**. La idea es exponer Traefik a Internet para que orqueste las peticiones entrantes hacia los diferentes contenedores, dependiendo del dominio solicitado.

Este proyecto no solo me permite mejorar mis conocimientos en contenedores sin demonio (_daemonless containers_) usando Podman, sino también aprender a gestionar tráfico de red, certificados SSL automáticos, y configurar un proxy inverso moderno como Traefik.

Cada entrada estará dividida en partes, donde iré profundizando en la configuración, resolución de problemas y ampliaciones futuras.

----------

# Parte 1: Preparación del Entorno

## 🔬 Requisitos

- Un sistema con acceso a Internet y puertos 80, 443 y 8080 abiertos.  
- Sistema operativo basado en Linux (Debian, Ubuntu, Fedora, CentOS, etc.).
- Podman instalado.
- Podman-compose instalado.
    

----------

# 🚿 Qué vamos a hacer

- Crear una red en Podman para los contenedores.
- Lanzar Traefik como contenedor conectado a esa red.
- Configurar Traefik para que maneje HTTP, HTTPS y genere certificados automáticos con Let's Encrypt.   
- Exponer el panel de control de Traefik (“Dashboard”).
- Solucionar problemas típicos de la primera configuración.
  
----------

# 🔀 Procedimiento

## 1. Crear la red en Podman

```bash
podman network create web
```

Creamos una red llamada `web` que usarán todos los contenedores.

## 2. Preparar carpetas de configuración

```bash
mkdir -p ~/traefik/{config,acme}
```

Estructura de carpetas:
```
~/traefik/
├── config/
├── acme/
```

## 3. Crear el archivo de configuración `traefik.yml`

Dentro de `~/traefik/config/traefik.yml`:

```yaml
entryPoints:
  web:
    address: ":80"
  websecure:
    address: ":443"
  traefik:
    address: ":8080"

providers:
  docker:
    exposedByDefault: false
    watch: true
    network: web

api:
  dashboard: true
  insecure: true

certificatesResolvers:
  letsencrypt:
    acme:
      email: tunombre@tudominio.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web
```

## 4. Crear el archivo `docker-compose.yml`

Dentro de `~/traefik/docker-compose.yml`:

```yaml
version: '3.8'

services:
  traefik:
    image: docker.io/library/traefik:v2.11
    container_name: traefik
    restart: unless-stopped
    networks:
      - web
    ports:
      - "80:80"
      - "443:443"
      - "8080:8080"
    volumes:
      - /var/run/podman/podman.sock:/var/run/docker.sock:ro
      - ./config/traefik.yml:/etc/traefik/traefik.yml:ro
      - ./acme:/letsencrypt

networks:
  web:
    driver: bridge
```

## 5. Lanzar Traefik

Desde el directorio `~/traefik/`:

```bash
podman-compose up -d
```

----------

# 🚧 Problemas encontrados y soluciones

## Problema 1: Error al lanzar la imagen `traefik`

**Error:**

```
Error: short-name "traefik" did not resolve to an alias and no unqualified-search registries are defined
```

**Causa:** Podman no encuentra la imagen porque no tiene registries configurados.

**Solución:** Especificar explícitamente la imagen completa desde Docker Hub:

```
image: docker.io/library/traefik:v2.11
```

## Problema 2: No se puede acceder al dashboard en el puerto 8080

**Error:**

```
localhost [127.0.0.1] 8080 (http-alt) : Connection refused
```

**Causa:** El dashboard de Traefik estaba activado, pero no estaba expuesto correctamente en un EntryPoint.

**Solución:**

Definir un `entryPoint` llamado `traefik` en el archivo `traefik.yml`.
    
Asegurar que el dashboard esté habilitado con `insecure: true` mientras desarrollamos.
    

## Problema 3: Firewall bloqueando el acceso externo

**Solución:** Abrir el puerto 8080 en el firewall:

```bash
sudo ufw allow 8080/tcp
sudo ufw reload
```
> En mi caso no tengo el firewall todavía configurado. Pero si estás usando alguno como ufw debes tenerlo en cuenta.

----------

# 📍 Estado actual del proyecto

- Traefik desplegado correctamente usando Podman.  
- Dashboard accesible desde el navegador en `http://<IP>:8080/dashboard/`.
- Preparado para gestionar rutas de dominios a contenedores automáticamente.
    

----------
# 📊 Siguiente parte

En la próxima entrada veremos cómo:
- Lanzar servicios detrás de Traefik (ejemplo, un Nginx).  
- Configurar rutas basadas en dominios y subdominios.  
- Activar SSL automático con Let's Encrypt para servicios reales.
    

**¡Seguimos construyendo!** 🚀