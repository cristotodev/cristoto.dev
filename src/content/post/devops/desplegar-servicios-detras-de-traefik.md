---
title: "Montando servicios detrás de Traefik"
description: "Cómo desplegar aplicaciones detrás de Traefik y exponer múltiples servicios con rutas personalizadas."
publishDate: "21 May 2025"
tags: ["podman", "traefik", "contenedores", "devops", "infraestructura", "microservicios", "proxy"]
coverImage:
  src: "https://res.cloudinary.com/cristotodev/image/upload/v1745659667/cristotodev/blog/podman-traefik_saoofc.webp"
  alt: "Podman y traefik"
seriesId: "podman-traefik"
orderInSeries: 5
draft: false
---

En esta parte de nuestra serie vamos a aprender a desplegar múltiples servicios detrás de **Traefik** usando **Podman Compose**. Esto nos permitirá crear aplicaciones de prueba y exponerlas usando rutas personalizadas con diferentes middlewares.

## Requisitos previos

-   Haber completado la configuración de Traefik con autenticación básica y Let's Encrypt.
    
-   Conocer los conceptos básicos de rutas y middlewares en Traefik.
    

## Paso 1: Crear un servicio de prueba

Primero, vamos a crear un servicio sencillo para probar nuestra configuración.

Crea un archivo `podman-compose.yml` en una nueva carpeta llamada `servicios`:

```bash
mkdir -p ~/infraestructura/traefik/servicios
nano ~/infraestructura/traefik/servicios/podman-compose.yml
```

Agrega el siguiente contenido:

```yml
version: "3.8"

services:
  app1:
    image: nginx:latest
    container_name: app1
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app1.rule=Host(`app1.tudominio.com`)"
      - "traefik.http.routers.app1.entrypoints=websecure"
      - "traefik.http.routers.app1.tls.certresolver=myresolver"
      - "traefik.http.services.app1.loadbalancer.server.port=80"
    networks:
      - traefik
    restart: always

  app2:
    image: httpd:latest
    container_name: app2
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app2.rule=Host(`app2.tudominio.com`)"
      - "traefik.http.routers.app2.entrypoints=websecure"
      - "traefik.http.routers.app2.tls.certresolver=myresolver"
      - "traefik.http.services.app2.loadbalancer.server.port=80"
    networks:
      - traefik
    restart: always

networks:
  traefik:
    external: true
```

### Detalles importantes:

-   Los servicios **app1** y **app2** están configurados para ser descubiertos automáticamente por Traefik.
    
-   Estamos usando **labels** para definir rutas y certificados.
    
-   Ambos servicios se conectan a la red externa **traefik**, que ya creamos.
    

## Paso 2: Crear registros DNS para pruebas locales

Si no tienes dominios reales, puedes usar entradas en `**/etc/hosts**` para probar:

```text
127.0.0.1 app1.tudominio.com
127.0.0.1 app2.tudominio.com
```

Esto permitirá que tu máquina resuelva los nombres de los servicios correctamente.

## Paso 3: Levantar los servicios

Inicia los contenedores:

```bash
cd ~/infraestructura/traefik/servicios
podman-compose up -d
```

Verifica que los servicios están en funcionamiento:

```bash
podman ps
```

Deberías ver **app1** y **app2** corriendo junto con Traefik.

## Paso 4: Prueba los servicios

Abre tu navegador y prueba los siguientes enlaces:

-   **App 1:**  https://app1.tudominio.com
    
-   **App 2:**  https://app2.tudominio.com
    

Ambos deberían estar protegidos con certificados de Let's Encrypt si todo está configurado correctamente.

## Problemas comunes

-   **No carga la página:** Verifica que tus dominios apuntan correctamente a tu servidor.
    
-   **Certificados no válidos:** Revisa los logs para errores de Let's Encrypt.
    
-   **Errores 404 o 502:** Revisa las reglas de enrutamiento en las etiquetas del `podman-compose.yml`.

----------

En el próximo post, exploraremos cómo añadir middlewares avanzados como rate limiting y redirecciones automáticas para mejorar la seguridad y rendimiento.

¡Seguimos construyendo una infraestructura segura y moderna!
