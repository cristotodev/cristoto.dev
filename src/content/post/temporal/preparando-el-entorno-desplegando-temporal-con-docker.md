---
title: "Preparando el entorno - Desplegando Temporal con Docker"
description: "Aprende a configurar Temporal usando Docker para desarrollar flujos de trabajo distribuidos, desde la instalación hasta la gestión de servicios. Documentaremos paso a paso cómo desplegar Temporal y sus dependencias en un entorno moderno."
publishDate: "26 May 2025"
updatedDate: "26 May 2025"
tags: ["temporal", "orquestación", "microservicios", "automatización", "procesos", "docker"]
coverImage:
  src: "https://res.cloudinary.com/cristotodev/image/upload/v1718791686/cristotodev/blog/temporal_vyztn8.png"
  alt: "Temporal"
seriesId: "temporal"
orderInSeries: 2
draft: false
---


Una vez que entendemos qué es Temporal y por qué es una herramienta esencial para desarrollar aplicaciones distribuidas, el siguiente paso es configurar nuestro entorno para poder empezar a construir workflows reales.

## 🚀 Requisitos Previos

Para seguir este capítulo, asegúrate de tener los siguientes elementos instalados:

-   **Docker** (versión 20+)
    
-   **Docker Compose** (versión 2.0+)
    
-   **Node.js** (recomendado v18+)
    
-   **Git** (opcional pero recomendado para clonar repositorios)
    

## 📂 Clonando el Repositorio Oficial de Temporal

En lugar de crear el archivo `docker-compose.yml` desde cero, vamos a usar el repositorio oficial de Temporal para asegurarnos de tener la última configuración disponible.

```bash
git clone https://github.com/temporalio/docker-compose.git
cd  docker-compose
docker-compose up
```

Esto descargará el proyecto oficial de Temporal con todos los servicios necesarios para levantar Temporal, PostgreSQL, Temporal Web y otros componentes adicionales.

## 🚀 Levantando los Servicios

Con el repositorio clonado, podemos levantar los servicios:

```bash
docker compose up -d
```

Esto debería levantar los siguientes servicios:

-   **Temporal Server** (puerto 7233) - El core de Temporal para gestionar workflows.
    
-   **PostgreSQL** (puerto 5432) - Base de datos para almacenar el estado de los workflows.
    
-   **Temporal Web** (puerto 8080) - Interfaz gráfica para monitorear los workflows.
    

## ✅ Verificando que Todo Funcione

Puedes verificar que los servicios estén corriendo correctamente usando:

```bash
docker ps
```

Y accediendo a Temporal Web en `http://localhost:8080` para confirmar que puedes interactuar con el servidor Temporal.

## 🔄 Deteniendo y Eliminando los Servicios

Para detener y eliminar los contenedores, usa:

```bash
docker compose down
```

## 🔧 Solución de Problemas

-   **Error de conexión a PostgreSQL:** Verifica que el contenedor `temporal-db` esté corriendo correctamente.
    
-   **Problemas de permisos:** Asegúrate de que Docker tenga los permisos correctos para leer los archivos de configuración.
    
-   **Fallo al conectar a Temporal Web:** Verifica que `TEMPORAL_GRPC_ENDPOINT` esté correctamente configurado en `docker-compose.yml`.
    

## 🛠️ Próximos Pasos

En el próximo capítulo, vamos a crear nuestro primer workflow con Temporal usando TypeScript. Configuraremos nuestro entorno de desarrollo y crearemos un flujo básico para entender cómo funciona Temporal desde dentro.

¡Nos vemos en el próximo capítulo!
