---
title: "Automatizando certificados SSL con Let's Encrypt en Traefik"
description: "Implementación de HTTPS automático usando Let's Encrypt para asegurar nuestros servicios con Traefik y Podman."
publishDate: "19 May 2025"
tags: ["podman", "traefik", "contenedores", "devops", "infraestructura", "https", "letsencrypt"]
coverImage:
  src: "https://res.cloudinary.com/cristotodev/image/upload/v1745659667/cristotodev/blog/podman-traefik_saoofc.webp"
  alt: "Podman y traefik"
seriesId: "podman-traefik"
orderInSeries: 4
draft: true
---


En esta parte de nuestra serie vamos a automatizar los certificados SSL usando **Let's Encrypt** para asegurar nuestras conexiones HTTPS con **Traefik**.

Hasta ahora, nuestro dashboard y servicios están expuestos vía HTTP, lo cual no es seguro para producción. Con Let's Encrypt, podremos obtener certificados automáticamente sin necesidad de renovarlos manualmente.

## Requisitos previos

-   Tener el despliegue inicial de Traefik con autenticación básica funcionando.
    
-   Un dominio o subdominio apuntando a tu servidor.
    
-   Puertos **80** y **443** abiertos en el firewall del servidor.
    

## Paso 1: Crear un archivo de configuración para Let's Encrypt

Vamos a crear un archivo de configuración adicional para Let's Encrypt.

Crea un archivo llamado `dynamic-https.yml` en tu carpeta de configuración:

```bash
mkdir -p ~/infraestructura/traefik/config
nano ~/infraestructura/traefik/config/dynamic-https.yml
```

Agrega el siguiente contenido:

```yml
http:
  routers:
    traefik-secure:
      rule: "Host(`tudominio.com`)"
      entryPoints:
        - websecure
      service: api@internal
      middlewares:
        - auth

tls:
  certificatesResolvers:
    myresolver:
      acme:
        email: "tu-email@tudominio.com"
        storage: "/etc/traefik/acme.json"
        httpChallenge:
          entryPoint: web
```

Ajusta `tudominio.com` y `tu-email@tudominio.com` según tu dominio real.

## Paso 2: Crear el archivo de almacenamiento para certificados

Traefik necesita un archivo para almacenar los certificados obtenidos. Crea el archivo y ajusta los permisos:

```bash
touch ~/infraestructura/traefik/config/acme.json
chmod 600 ~/infraestructura/traefik/config/acme.json
```

Esto asegura que solo Traefik pueda leer y escribir en ese archivo.

## Paso 3: Actualizar el `podman-compose.yml`

Vamos a actualizar el `podman-compose.yml` para habilitar el entrypoint `websecure` en el puerto 443.

Edita tu `podman-compose.yml`:

```yml
version: "3.8"

services:
  traefik:
    image: docker.io/library/traefik:v2.10
    command:
      - "--api.dashboard=true"
      - "--api.insecure=false"
      - "--providers.file.directory=/etc/traefik/config"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.myresolver.acme.email=tu-email@tudominio.com"
      - "--certificatesresolvers.myresolver.acme.storage=/etc/traefik/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/podman/podman.sock:/var/run/docker.sock:ro"
      - "./config:/etc/traefik/config:ro"
    restart: always
```

Asegúrate de reemplazar `tu-email@tudominio.com` con tu correo real.

## Paso 4: Reiniciar los servicios

Ahora aplicamos los cambios:

```bash
podman-compose down
podman-compose up -d
```

Verifica que no hay errores en los logs:

```bash
podman logs NOMBRE_DEL_CONTENEDOR
```

Deberías ver algo como **"Certificates obtained successfully"** si todo ha salido bien.

## Paso 5: Probar el acceso seguro

Ahora intenta acceder a tu dominio:

```text
https://tudominio.com
```

Deberías ver el dashboard protegido con HTTPS.

## Pruebas locales sin dominio comprado

Si no tienes un dominio real, puedes probar en local usando uno de los siguientes métodos:

### Opción 1: Usar un dominio local en `/etc/hosts`

1.  Añade una línea en tu archivo `/etc/hosts`:
    

```text
127.0.0.1       traefik.local
```

2.  Ajusta tu `dynamic-https.yml` para usar este dominio:
    

```yml
http:
  routers:
    traefik-secure:
      rule: "Host(`traefik.local`)"
      entryPoints:
        - websecure
      service: api@internal
      middlewares:
        - auth

tls:
  certificatesResolvers:
    myresolver:
      acme:
        email: "tu-email@ejemplo.com"
        storage: "/etc/traefik/acme.json"
        httpChallenge:
          entryPoint: web
```

### Opción 2: Usar un dominio gratuito con DuckDNS

1.  Regístrate en [DuckDNS](https://www.duckdns.org/) y crea un subdominio gratuito.
    
2.  Apunta el subdominio a tu IP pública.
    
3.  Usa el subdominio en tu configuración para pruebas más realistas.
    

## Problemas comunes

-   **Error 403 Forbidden:** Asegúrate de que el archivo `acme.json` tiene los permisos correctos.
    
-   **No se puede conectar:** Verifica que los puertos 80 y 443 están abiertos y que tu dominio apunta correctamente al servidor.
    
-   **Certificados no generados:** Revisa los logs para errores de ACME o problemas de dominio.
    

----------

## Cambios aplicados en GitHub

> Puedes consultar el commit relacionado a este post en el siguiente enlace:  
> [🔗 Ver commit en GitHub](https://github.com/cristotodev/infraestructura-podman-traefik/commit/9be25cec4d86db462c0cd60293d712c855366cf2)

**Resumen del commit:**

-   Creación de archivo de configuración para HTTPS automático (`dynamic-https.yml`).
    
-   Modificación de `podman-compose.yml` para habilitar el entrypoint `websecure`.
    
-   Configuración de almacenamiento seguro para certificados.
    
-   Añadido soporte para pruebas locales sin dominio real.
    

----------

En el próximo post, exploraremos cómo añadir servicios adicionales detrás de nuestro proxy Traefik.

¡Seguimos construyendo una infraestructura segura y moderna!
