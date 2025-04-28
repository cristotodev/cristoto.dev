---
title: "Primeros pasos: Montando Traefik como Reverse Proxy con Podman Compose"
description: "Primeros pasos de nuestra infraestructura moderna: desplegamos Traefik como proxy inverso utilizando Podman Compose en Debian."
publishDate: "28 Apr 2025"
tags: ["podman", "traefik", "contenedores", "devops", "infraestructura", "proxy"]
coverImage:
  src: "https://res.cloudinary.com/cristotodev/image/upload/v1745659667/cristotodev/blog/podman-traefik_saoofc.webp"
  alt: "Podman y traefik"
seriesId: "podman-traefik"
orderInSeries: 2
---

En esta primera parte vamos a preparar nuestro entorno sobre **Debian** y a desplegar **Traefik** usando **Podman Compose**. Nuestro objetivo es levantar el dashboard de Traefik de manera insegura para asegurarnos que todo funciona correctamente.

## Requisitos previos

-   Sistema operativo: **Debian**.
    
-   Podman instalado.
    
-   Podman Compose instalado.
    

## Instalación de Podman y Podman Compose

Primero, actualizamos nuestro sistema y añadimos Podman:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install podman -y
```

Instalamos `podman-compose`:

```bash
sudo apt install podman-compose -y
```

Verificamos las versiones:

```bash
podman --version
podman-compose --version
```

## ¿Qué es Podman Compose?

**Podman Compose** es una herramienta que permite definir y orquestar múltiples contenedores utilizando archivos YAML compatibles con Docker Compose. Su función principal es interpretar los servicios definidos en el YAML y lanzar los contenedores de forma coordinada, gestionando redes, volúmenes y dependencias entre ellos, pero utilizando **Podman** en lugar de Docker.

Esta herramienta es ideal para estructurar aplicaciones complejas formadas por varios servicios, manteniendo una experiencia muy similar a la que ya conocemos con Docker Compose.

## Creación de la estructura del proyecto

Creamos una carpeta para nuestro proyecto:

```bash
mkdir -p ~/infraestructura/traefik
cd ~/infraestructura/traefik
```

## Definiendo el `podman-compose.yml`

Creamos un archivo llamado `podman-compose.yml` con el siguiente contenido:

```yaml
version: "3.8"

services:
  traefik:
    image: docker.io/library/traefik:v2.10
    command:
      - "--api.insecure=true"
      - "--providers.docker"
      - "--entrypoints.web.address=:80"
    ports:
      - "8081:80"
      - "8080:8080"
    volumes:
      - "/var/run/podman/podman.sock:/var/run/docker.sock:ro"
    restart: always
```

### Detalles importantes:

-   `--api.insecure=true` activa el dashboard **sin autenticación** (solo para pruebas).
    
-   Mapeamos el socket de Podman como si fuera el de Docker.
    
-   Publicamos el puerto `8080` para acceder al dashboard y `8081` para futuras apps (mapeando `80` en el contenedor).
    

> **Nota:** Inicialmente intentamos utilizar `image: traefik:v2.10`, pero encontramos el siguiente error:
> 
> ```bash
> Error: short-name "traefik:v2.10" did not resolve to an alias and no unqualified-search registries are defined in "/etc/containers/registries.conf"
> ```
> 
> Esto sucede porque Podman no sabe a qué registro acudir para descargar la imagen. Para solucionarlo hay dos opciones:
> 
> -   Especificar el nombre completo de la imagen en el `podman-compose.yml`, por ejemplo `docker.io/library/traefik:v2.10`.
>     
> -   Configurar `/etc/containers/registries.conf` para que incluya una búsqueda por defecto en `docker.io`.
>     

## Lanzando Traefik

Ejecutamos:

```bash
podman-compose up -d
```

Puede ocurrir un error al intentar levantar el servicio:

> **Error:**
> 
> ```bash
> rootlessport cannot expose privileged port 80, you can add 'net.ipv4.ip_unprivileged_port_start=80' to /etc/sysctl.conf (currently 1024), or choose a larger port number (>= 1024): listen tcp 0.0.0.0:80: bind: permission denied
> ```
> 
> Esto sucede porque los usuarios sin permisos de root no pueden usar puertos por debajo del 1024.
> 
> **Soluciones:**
> 
> -   **Opción 1:** Editar `/etc/sysctl.conf` y añadir:
>     
>     ```bash
>     net.ipv4.ip_unprivileged_port_start=80
>     ```
>     
>     Luego recargar la configuración con:
>     
>     ```bash
>     sudo sysctl --system
>     ```
>     
> -   **Opción 2:** Modificar el `podman-compose.yml` para usar un puerto mayor a 1024, como hemos hecho en este proyecto, utilizando el puerto `8081`.
>     
> 
> Hemos optado por esta segunda opción para avanzar más rápido. Más adelante mejoraremos esta configuración para producción.

Verificamos que el contenedor esté corriendo:

```bash
podman ps
```

Deberías ver algo como:

```bash
CONTAINER ID  IMAGE                           COMMAND               CREATED         STATUS             PORTS
abcdef12345   docker.io/library/traefik:v2.10  traefik --api.insecure...  10 seconds ago  Up 10 seconds   0.0.0.0:8081->80/tcp, 0.0.0.0:8080->8080/tcp
```

## Accediendo al Dashboard

Abre tu navegador y visita:

```text
http://TU_IP:8080/dashboard/
```

Deberías ver el panel de control de Traefik en funcionamiento.

## Resolución de problemas comunes

-   **Error con el socket**: Asegúrate que el socket `/var/run/podman/podman.sock` existe y que tu usuario tiene permisos para leerlo.
    
-   **No abre el puerto 8080**: Verifica que tu firewall permite conexiones a ese puerto.


## ¿Y ahora qué sigue?

Ahora que tenemos Traefik corriendo, en el siguiente post protegeremos el dashboard con autenticación básica para que no esté expuesto públicamente.

¡Nos vemos en la siguiente entrada!


## Cambios aplicados en GitHub

> Puedes consultar el commit relacionado a este post en el siguiente enlace:  
> [🔗 Ver commit en GitHub](https://github.com/cristotodev/infraestructura-podman-traefik/commit/003a586924b1bbe222284cf8a57309ead990203c)

**Resumen del commit:**

-   Montaje inicial de Traefik usando Podman Compose.
    
-   Corrección del error de imagen (short-name resolution en Podman).
    
-   Adaptación del puerto a `8081` para entornos rootless.
    
-   Creación del archivo `.gitignore` y estructura inicial de proyecto.