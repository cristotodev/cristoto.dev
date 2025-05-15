---
title: "Protegiendo el Dashboard y Traefik con Autenticación Básica"
description: "Segunda parte de nuestra serie: implementamos autenticación básica para proteger el acceso al dashboard de Traefik en nuestro entorno rootless."
publishDate: "15 May 2025"
tags: ["podman", "traefik", "contenedores", "devops", "infraestructura", "proxy", "seguridad"]
coverImage:
  src: "https://res.cloudinary.com/cristotodev/image/upload/v1745659667/cristotodev/blog/podman-traefik_saoofc.webp"
  alt: "Podman y traefik"
seriesId: "podman-traefik"
orderInSeries: 3
---

En esta parte de nuestra serie vamos a proteger el acceso al dashboard de **Traefik** mediante **autenticación básica** usando un middleware de Traefik.

Hasta ahora, el dashboard estaba accesible de forma insegura y sin control de acceso, lo cual no es adecuado para entornos públicos.

## Requisitos previos

-   Haber completado el despliegue inicial de Traefik con Podman Compose.
    
-   Tener acceso al fichero `podman-compose.yml` donde configuramos el servicio Traefik.
    

## Generar las credenciales de autenticación

Primero, necesitamos generar un par `usuario:contraseña` cifrado en formato **htpasswd**.

Instalamos `apache2-utils` para usar la herramienta `htpasswd`:

```bash
sudo apt install apache2-utils -y
```

Generamos una contraseña cifrada (cambia `admin` por tu nombre de usuario deseado):

```bash
htpasswd -nb admin MiContraseñaSegura
```

El comando devolverá algo como:

```bash
admin:$apr1$...$...
```

Copiaremos ese valor cifrado.

## Modificando la configuración de Traefik

Vamos a crear un archivo `dynamic.yml` para definir el middleware de autenticación y un router que proteja el acceso al dashboard.

Crea un nuevo directorio para configuraciones dinámicas:

```bash
mkdir ~/infraestructura/traefik/config
```

Dentro de `~/infraestructura/traefik/config/`, crea un archivo llamado `dynamic.yml`:

```yml
http:
  middlewares:
    auth:
      basicAuth:
        users:
          - "admin:$apr1$...$..."  # Tu usuario y contraseña cifrada aquí

  routers:
    traefik-dashboard:
      rule: "PathPrefix(`/dashboard`) || PathPrefix(`/api`)"
      entryPoints:
        - web
      service: api@internal
      middlewares:
        - auth
```

Ahora, debemos montar este archivo en nuestro contenedor Traefik y decirle que lo cargue.

Edita el `podman-compose.yml`:

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
    ports:
      - "8081:80"
    volumes:
      - "/var/run/podman/podman.sock:/var/run/docker.sock:ro"
      - "./config:/etc/traefik/config:ro"
    restart: always
```

**Importante:** Hemos eliminado también la exposición del puerto `8080`.

### ¿Por qué ya no usamos el puerto 8080?

Inicialmente pensábamos que el dashboard se accedería por el puerto 8080, pero ahora que hemos creado un router personalizado sobre el `entrypoint web` (puerto 80 dentro del contenedor, expuesto como `8081` en el host), todo el tráfico al dashboard pasa por ahí. El puerto 8080 ha quedado sin uso real, así que lo hemos limpiado para evitar dejar puertos abiertos innecesariamente.

Así mantenemos la configuración más segura y sencilla.

### ¿Es normal acceder al dashboard de Traefik por el puerto 80?

Sí, es completamente normal en este tipo de configuración. Al desactivar `--api.insecure=true` y proteger el dashboard mediante un router y middleware personalizado, ahora exponemos el dashboard dentro del flujo normal de tráfico HTTP en el `entrypoint web` (puerto 80). Esto nos permite aplicar reglas de seguridad (como la autenticación) de forma flexible y centralizada. Además, mantiene la arquitectura limpia y lista para aplicar HTTPS más adelante sobre el mismo flujo.

Accedemos en el navegador usando el puerto 8081 porque hemos redirigido el puerto 80 del contenedor al 8081 del host.

## Levantando de nuevo los servicios

Ahora reiniciamos Traefik para aplicar los cambios:

```bash
podman-compose down
podman-compose up -d
```

## Probando el acceso

Cuando accedas de nuevo a:

```text
http://TU_IP:8081/dashboard/
```

Te pedirá usuario y contraseña. Si introduces las correctas, podrás ver el panel. ¡Ya está protegido!

## Problemas comunes

-   **No carga el dashboard:** Verifica que `dynamic.yml` está montado correctamente en el contenedor y no contiene errores de sintaxis.
    
-   **No pide autenticación:** Asegúrate de que el router `traefik-dashboard` está correctamente definido en `dynamic.yml`.
    
-   **Error de conexión al socket Docker:** Si ves errores relacionados al acceso al socket Docker, asegúrate de haber eliminado `--providers.docker` del `command:`.
    

----------

## Cambios aplicados en GitHub

> Puedes consultar el commit relacionado a este post en el siguiente enlace:  
> [🔗 Ver commit en GitHub](https://github.com/cristotodev/infraestructura-podman-traefik/commit/48ec50e4d6d074c1e2c6b306edab860fd4394824)

**Resumen del commit:**

-   Creación de configuración dinámica (`dynamic.yml`) para autenticar el acceso.
    
-   Definición de un router específico para proteger `/dashboard` y `/api`.
    
-   Eliminación del proveedor Docker para compatibilidad con entorno Podman rootless.
    
-   Eliminación del puerto 8080 no utilizado.
    
-   Modificación de `podman-compose.yml` para montar configuraciones dinámicas correctamente.
    

----------

En el próximo post avanzaremos en la configuración de HTTPS automático usando Let's Encrypt en Traefik.

¡Seguimos construyendo una infraestructura segura y moderna!
