---
title: "Insertando Registros usando SQL"
description: "Descubre cómo insertar registros en MySQL y otros gestores de bases de datos con ejemplos prácticos usando SQL. Desde inserciones individuales hasta masivas, aprende a manipular tus datos de manera eficiente."
pubDate: 1716903496000
heroImage: '/img/blog/sql.webp'
tags: [{
        name: "SQL",
        bgColorHex: "#D3D3D3",
        fontColorHex: '#000000'
    }]
---

En este artículo, te guiaré a través de diversas formas de insertar registros en una base de datos MySQL, utilizando ejemplos prácticos de tu repositorio. Comenzaremos seleccionando la base de datos correcta, luego procederemos a insertar registros de varias maneras, incluyendo el uso de nombres de columnas, inserciones masivas, inserciones con valores predeterminados, y mucho más.

## Preparando el Entorno

Antes de comenzar, asegúrate de tener seleccionada la base de datos correcta. En nuestro caso, vamos a trabajar con la base de datos `empresa`.
Aquí tienes la creación de la BD, como seleccionarla y el script para crear la tabla que te permitirá lanzar todos los ejemplos.

``` sql
CREATE DATABASE empresa; --Crear Base de datos
USE empresa; --Seleccionar la Base de datos
CREATE TABLE IF NOT EXISTS clientes ( --Creación de la tabla clientes
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(255) NOT NULL, 
    email VARCHAR(255) UNIQUE NOT NULL, 
    fecha_nacimiento DATE, 
    sueldo DECIMAL(10, 2) 
);
```

## Insertando Un Registro Usando Nombres de Columnas

Cuando insertas un registro, puedes especificar los nombres de las columnas para clarificar a qué campo corresponde cada valor. Esto mejora la legibilidad del código.

``` sql
INSERT INTO clientes (nombre, email, fecha_nacimiento, sueldo) 
VALUES ('Cristotodev', 'cristotodev@dev.com', now(), 4500.00);
```

## Insertando Varios Registros a la Vez

Puedes insertar múltiples registros a la vez, separando cada conjunto de valores con una coma.

``` sql
INSERT INTO clientes (nombre, email, fecha_nacimiento, sueldo) VALUES 
('Carlos López', 'carlos.lopez@example.com', '1995-06-15', 6000.00), 
('María Rodríguez', 'maria.rodriguez@example.com', '1978-09-22', 5500.00);
```

## Insertando un Registro Sin Especificar Las Columnas

Si prefieres no especificar los nombres de las columnas, puedes insertar un registro en el orden en que fueron creadas la tabla.

``` sql
INSERT INTO clientes VALUES ('Juan Pérez', 'juan.perez@example.com', now(), 5000.00);
```

## Insertando Varios Registros Sin Especificar Las Columnas

De manera similar, puedes insertar múltiples registros a la vez sin especificar las columnas, siempre y cuando los valores sigan el orden de las columnas en la tabla.

``` sql
INSERT INTO clientes VALUES 
('Carlos López', 'carlos.lopez@example.com', '1995-06-15', 6000.00), 
('María Rodríguez', 'maria.rodriguez@example.com', '1978-09-22', 5500.00);
```

## Insertando Un Registro Usando Valores Predeterminados

Si tienes columnas con valores predeterminados, puedes omitirlas en la sentencia `INSERT INTO`.

``` sql
INSERT INTO clientes (nombre, email) 
VALUES ('Pedro Martínez', 'pedro.martinez@example.com');
```

## Insertando Un Registro Usando Valores NULL

Para columnas que permiten valores NULL, simplemente omite el valor en la sentencia `INSERT INTO`.

``` sql
INSERT INTO clientes (nombre, email, fecha_nacimiento, sueldo) 
VALUES ('Laura Fernández', 'laura.fernandez@example.com', NULL, NULL);
```

## Insertando Un Registro Usando Valores Escapados

Los valores que contienen caracteres especiales deben ser escapados con una barra invertida (`\`).

``` sql
INSERT INTO clientes (nombre, email, fecha_nacimiento, sueldo) 
VALUES ('Oscar "El Gato" González', 'oscar.gonzalez@example.com', '2000-03-04', 7000.00);
```

## Insertando Un Registro Usando Valores Con Fuentes Externas

MySQL permite insertar datos desde otras tablas o archivos. Aquí te mostramos cómo hacerlo tanto desde otra tabla como desde un archivo CSV.

### Insertando desde otra tabla

``` sql
INSERT INTO clientes (nombre, email, fecha_nacimiento, sueldo) 
SELECT nombre, email, fecha_nacimiento, sueldo FROM otros_clientes;
```

### Insertando desde un archivo CSV

``` sql
LOAD DATA INFILE '/ruta/al/archivo.csv' INTO TABLE clientes FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n';
```

Estos ejemplos cubren una amplia gama de situaciones en las que podrías necesitar insertar datos en MySQL. Experimenta con ellos y adapta tus consultas según tus necesidades específicas.

## Conclusión
La capacidad de insertar registros en una base de datos es fundamental para cualquier desarrollador o administrador de bases de datos. Los ejemplos presentados en este artículo muestran cómo, independientemente del gestor de base de datos que estés utilizando, las operaciones básicas de inserción son bastante consistentes entre ellos. Esto facilita la movilidad entre diferentes sistemas de gestión de bases de datos, ya que las habilidades adquiridas en uno pueden aplicarse directamente en otro.

Desde la inserción de un único registro hasta la inserción masiva de datos, comprendemos la flexibilidad que ofrece SQL para manejar diversos escenarios. La inclusión de valores predeterminados, el manejo de valores NULL, y la inserción de datos desde fuentes externas como otras tablas o archivos CSV, son características que hacen de MySQL una herramienta versátil y potente para la gestión de datos.

Además, la seguridad en las operaciones de inserción es crucial. El uso de consultas preparadas ayuda a prevenir inyecciones SQL, protegiendo así tus aplicaciones y datos contra amenazas. Este aspecto es especialmente relevante en el contexto actual, donde la seguridad de la información es una prioridad máxima.

Finalmente, la inserción de datos en MySQL desde archivos o mediante consultas SELECT refleja la capacidad de MySQL para integrarse con otros sistemas y procesos, permitiendo la automatización y optimización de flujos de trabajo de datos.

En resumen, aprender a insertar registros en MySQL es esencial para cualquier profesional que trabaje con bases de datos. La comprensión de las diferentes técnicas y consideraciones de seguridad asociadas a estas operaciones es fundamental para el manejo eficiente y seguro de los datos.

## Más Ejemplos y Videos

Te animo a seguir mis videos en YouTube, cada video viene acompañado de ejemplos de código y explicaciones claras, diseñados para ayudarte a mejorar tus habilidades en SQL y la gestión de bases de datos.

Visita mi [repositorio de GitHub](https://github.com/cristotodev/Apuntes-SQL) y suscríbete a mi canal de [YouTube](https://www.youtube.com/@cristotodev) para comenzar tu viaje hacia la maestría en SQL y bases de datos hoy mismo.