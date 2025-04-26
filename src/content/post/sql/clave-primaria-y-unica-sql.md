---
title:  "Claves Primarias y Únicas en Bases de Datos Relacionales"
description: "Descubre el propósito y uso de las claves primarias y únicas en SQL, con ejemplos prácticos. Aprende cómo estas claves son fundamentales para la organización y seguridad de tus datos."
publishDate: "3 Jun 2024"
updatedDate: "3 Jun 2024"
tags: ["sql"]
---

En el ámbito de las bases de datos, las claves primarias y únicas son fundamentales para la organización y seguridad de los datos. En este post, profundizaremos en lo que representan estas claves, cuándo utilizarlas y cómo interactúan con las relaciones de clave foránea.


## ¿Qué es una Clave Primaria?

Una clave primaria es una columna o conjunto de columnas en una tabla que identifica de forma única a cada registro en esa tabla. Es el primer paso hacia la creación de relaciones entre tablas en una base de datos relacional.

### Características de una Clave Primaria:
- **Unicidad**: Cada valor en la columna o combinación de columnas debe ser único.
- **Identidad**: Ninguna fila puede estar vacía en la columna o combinación de columnas designada como clave primaria.
- **Indisponibilidad**: Los valores de la clave primaria no pueden ser nulos.

### Ejemplo de creación Clave Primaria

Imagina una tabla `usuarios` con la siguiente estructura:

``` sql
CREATE TABLE usuarios ( 
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(50), 
    email VARCHAR(100) 
);
```

Aquí, `id` es la clave primaria porque garantiza que cada usuario tiene un identificador único.

También podemos darle un nombre específico a la calve primaria (Constraint) con el siguiente comando una vez creada la tabla.

``` sql
ALTER TABLE usuarios 
ADD CONSTRAINT usuarios_pk PRIMARY KEY (id);
```
Aquí, la clave primaria se crea sobre la columna `id` con el nombre `usuarios_pk`

### Ejemplo de eliminación Clave Primaria
Para borrar una clave primaría dispones de `DROP PRIMARY KEY`.

``` sql
ALTER TABLE empleados DROP PRIMARY KEY;
```

### Clave Primaria Compuesta
Una clave primaria compuesta es un conjunto de dos o más columnas que juntas identifican de manera única a cada registro en una tabla. Es especialmente útil cuando no hay una sola columna que pueda servir como identificador único.

``` sql
CREATE TABLE empleados ( 
    id_empleado INT, 
    departamento_id INT, 
    PRIMARY KEY (id_empleado, departamento_id) 
);
```
Aquí, la combinación de `id_empleado` y `departamento_id` constituye la clave primaria compuesta, asegurando la unicidad de cada empleado en su departamento.

## ¿Qué es una Clave Única?

Una clave única es similar a una clave primaria, pero permite valores nulos y permite múltiples filas con el mismo valor. Se utiliza para garantizar que ciertos datos sean únicos dentro de una tabla, pero no necesariamente para identificar de forma única cada registro.

### Diferencia Principal entre Clave Primaria y Clave Única:
- **Nulabilidad**: Las claves únicas pueden aceptar valores nulos, mientras que las claves primarias no.
- **Uso**: Las claves primarias se utilizan principalmente para identificación única, mientras que las claves únicas se utilizan para asegurar la unicidad de ciertos datos sin necesidad de identificar de forma única cada registro.

### Ejemplo de creación  Clave Única

Considera una tabla `productos` con la siguiente estructura:

``` sql
CREATE TABLE productos ( 
    id INT AUTO_INCREMENT PRIMARY KEY, 
    nombre VARCHAR(50), 
    sku VARCHAR(20) UNIQUE 
);
```

Aquí, `sku` es una clave única que garantiza que ningún producto tenga el mismo código de identificación de stock.

Al igual que la clave primaria pordemos crear la clave única con un nombre específico.

``` sql
ALTER TABLE productos
ADD CONSTRAINT productos_uq UNIQUE(sku);
```
Aquí, estamos haciendo lo mismo que arriba pero dandole el nombre `productos_uq` a la clave única.

### Ejemplo de eliminación Clave Única
Para este hay que indicar que queremos borrar el índice que está creado sobre la columna que deseamos borrar con `DROP INDEX`.

``` sql
ALTER TABLE productos DROP INDEX codigo_sku;
```

### Clave Única Compuesta
Similar a la clave primaria, una clave única compuesta utiliza un conjunto de columnas para garantizar la unicidad de los datos, permitiendo valores nulos en cualquiera de las columnas.

``` sql
CREATE TABLE proyectos ( 
    proyecto_id INT, 
    empleado_id INT, 
    fecha_inicio DATE, 
    PRIMARY KEY (proyecto_id), 
    UNIQUE KEY (empleado_id, fecha_inicio) 
);
```

En este ejemplo, la combinación de `empleado_id` y `fecha_inicio` es una clave única compuesta, asegurando que ningún empleado pueda iniciar más de un proyecto en la misma fecha.

## Cuando Deberías Usar Cada Una

- **Clave Primaria**: Usa una clave primaria cuando necesites identificar de forma única cada registro en una tabla. Es esencial para establecer relaciones entre tablas.
- **Clave Única**: Usa una clave única cuando necesites asegurarte de que ciertos datos sean únicos dentro de una tabla, pero no necesariamente para identificar de forma única cada registro.

## Relaciones de Clave Foránea

Las relaciones de clave foránea se suelen hacer sobre la clave primaria de otra tabla. Esto permite vincular datos entre tablas y mantener la integridad referencial de la base de datos.

## Preguntas
### ¿Una clave primaria puede ser NULL?
No, una clave primaria no puede ser NULL. Esto se debe a que la clave primaria tiene la función de identificar de manera única cada fila en una tabla de una base de datos.

Cuando creas una tabla y defines una columna como clave primaria, esa columna automáticamente se convierte en NOT NULL, aunque no lo especifiques explícitamente. Es decir, incluso si olvidas añadir la restricción NOT NULL, la base de datos se asegurará de que la columna de la clave primaria no contenga valores nulos.

Esto es importante porque un valor nulo significa "desconocido" o "sin valor", y no puede haber algo desconocido en la columna que utilizamos para identificar de manera única cada registro. Por eso, las bases de datos relacionales siempre hacen que las claves primarias no permitan valores nulos para mantener la integridad y consistencia de los datos.

## Conclusión

Entender las claves primarias y únicas es fundamental para diseñar y trabajar con bases de datos relacionales. Cada una tiene su propósito específico, y conocer cuándo usar cada una te ayudará a crear bases de datos más eficientes y organizadas.```

## Más Ejemplos y Videos

Te animo a seguir mis videos en YouTube, cada video viene acompañado de ejemplos de código y explicaciones claras, diseñados para ayudarte a mejorar tus habilidades en SQL y la gestión de bases de datos.

Visita mi [repositorio de GitHub](https://github.com/cristotodev/Apuntes-SQL) y suscríbete a mi canal de [YouTube](https://www.youtube.com/@cristotodev) para comenzar tu viaje hacia la maestría en SQL y bases de datos hoy mismo.