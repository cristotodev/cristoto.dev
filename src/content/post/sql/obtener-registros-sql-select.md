---
title:   "Obteniendo Registros con SELECT en SQL"
description: "Aprende a consultar datos en SQL utilizando SELECT y WHERE con ejemplos prácticos. Desde los filtros más básicos hasta algunos más complejos."
publishDate: "29 May 2024"
tags: ["sql"]
---

Aprende a cómo extraer información de una base de datos utilizando la sentencia `SELECT` en SQL, centrando nuestra atención en la tabla `clientes`. Exploraremos varios métodos para filtrar y ordenar los resultados, haciéndolos accesibles y comprensibles.

## Tabla de Ejemplo: Clientes

Primero, definamos nuestra tabla `clientes`:

``` sql
CREATE TABLE clientes (
    id int AUTO_INCREMENT PRIMARY KEY, 
    nombre varchar(50) NOT NULL, 
    email varchar(100) NOT NULL, 
    fecha_nacimiento DATE NULL, 
    sueldo DECIMAL(10,2) NULL
);
```

Esta tabla contiene información vital sobre nuestros clientes, incluyendo ID único, nombre, correo electrónico, fecha de nacimiento opcional y sueldo.

***Si necesitas insertar datos y no sabes o recuerdas como es, tengo un [post que te puede ayudar.](/blog/insertar-registros-sql)***

## Usando SELECT

La sentencia `SELECT` nos permite seleccionar datos de una o más columnas de una tabla. Es la base para cualquier consulta en SQL.

### Ejemplo Básico de SELECT

Para ver todos los registros de la tabla `clientes`, simplemente ejecutamos:

``` sql
SELECT * FROM clientes;
```

Este comando muestra todos los datos de la tabla `clientes`.

### Filtrando Datos con WHERE

Podemos agregar condiciones a nuestras consultas con la cláusula `WHERE`. Por ejemplo, para encontrar clientes cuyo sueldo sea mayor a $2000:

``` sql
SELECT * FROM clientes 
WHERE sueldo > 2000;
```

### Usando Operadores Comparativos

Los operadores comparativos (`=`, `<>`, `<`, `>`, `<=`, `>=`) nos permiten filtrar resultados basados en condiciones específicas. Por ejemplo, para encontrar clientes menores de 30 años:

``` sql
SELECT * FROM clientes 
WHERE YEAR(fecha_nacimiento) >= 1995;
```

### Buscando Patrones con LIKE

La cláusula `LIKE` es útil para buscar patrones en cadenas de texto. Por ejemplo, para encontrar clientes cuyo nombre contenga la letra "a":

``` sql
SELECT * FROM clientes 
WHERE nombre LIKE '%a%';
```

### Rango de Valores con BETWEEN

`BETWEEN` nos permite seleccionar valores dentro de un rango específico. Por ejemplo, para encontrar clientes cuyo sueldo esté entre $1500 y $2500:

``` sql
SELECT * FROM clientes 
WHERE sueldo BETWEEN 1500 AND 2500;
```

## Ordenando Resultados con ORDER BY

Finalmente, podemos ordenar nuestros resultados con `ORDER BY`. Por ejemplo, para listar a los clientes por sueldo de menor a mayor:

``` sql
SELECT * FROM clientes 
ORDER BY sueldo ASC;
```

O de mayor a menor:

``` sql
SELECT * FROM clientes 
ORDER BY sueldo DESC;
```


## Más Filtros y Explicaciones

Hay muchos más filtros disponibles en SQL para ayudarte a extraer exactamente la información que necesitas. Para explorar más filtros y su explicación, visita [este recurso](https://docs.data.world/documentation/sql/concepts/basic/WHERE.html).

## Conclusión

El uso de `SELECT` junto con cláusulas como `WHERE`, `LIKE`, `BETWEEN`, y `ORDER BY` nos ofrece una gran flexibilidad para extraer y organizar información de nuestras bases de datos. Estas herramientas son esenciales para cualquier desarrollador o profesional de TI que trabaje con SQL, ya que permiten realizar consultas detalladas y precisas para satisfacer diversas necesidades de análisis de datos. Hay mucho más que explorar, y los recursos mencionados anteriormente son excelentes lugares para comenzar.


## Más Ejemplos y Videos

Te animo a seguir mis videos en YouTube, cada video viene acompañado de ejemplos de código y explicaciones claras, diseñados para ayudarte a mejorar tus habilidades en SQL y la gestión de bases de datos.

Visita mi [repositorio de GitHub](https://github.com/cristotodev/Apuntes-SQL) y suscríbete a mi canal de [YouTube](https://www.youtube.com/@cristotodev) para comenzar tu viaje hacia la maestría en SQL y bases de datos hoy mismo.