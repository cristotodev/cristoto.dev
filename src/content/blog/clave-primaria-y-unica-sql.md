---
title: "Claves Primarias y Únicas en Bases de Datos Relacionales"
description: "Descubre el propósito y uso de las claves primarias y únicas en SQL, con ejemplos prácticos. Aprende cómo estas claves son fundamentales para la organización y seguridad de tus datos."
pubDate: 1717407400000
heroImage: 'https://res.cloudinary.com/cristotodev/image/upload/v1716969914/cristotodev/blog/sql_cfui24.webp'
tags: [{
        name: "SQL",
        bgColorHex: "#D3D3D3",
        fontColorHex: '#000000'
    }]
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

### Ejemplo de eliminación Clave Primaria
Para borrar una clave primaría dispones de `DROP PRIMARY KEY`.

``` sql
ALTER TABLE empleados DROP PRIMARY KEY;
```

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

### Ejemplo de eliminación Clave Única
Para este hay que indicar que queremos borrar el índice que está creado sobre la columna que deseamos borrar con `DROP INDEX`.

``` sql
ALTER TABLE productos DROP INDEX codigo_sku;
```

## Cuando Deberías Usar Cada Una

- **Clave Primaria**: Usa una clave primaria cuando necesites identificar de forma única cada registro en una tabla. Es esencial para establecer relaciones entre tablas.
- **Clave Única**: Usa una clave única cuando necesites asegurarte de que ciertos datos sean únicos dentro de una tabla, pero no necesariamente para identificar de forma única cada registro.

## Relaciones de Clave Foránea

Las relaciones de clave foránea se suelen hacer sobre la clave primaria de otra tabla. Esto permite vincular datos entre tablas y mantener la integridad referencial de la base de datos.

## Conclusión

Entender las claves primarias y únicas es fundamental para diseñar y trabajar con bases de datos relacionales. Cada una tiene su propósito específico, y conocer cuándo usar cada una te ayudará a crear bases de datos más eficientes y organizadas.```

## Más Ejemplos y Videos

Te animo a seguir mis videos en YouTube, cada video viene acompañado de ejemplos de código y explicaciones claras, diseñados para ayudarte a mejorar tus habilidades en SQL y la gestión de bases de datos.

Visita mi [repositorio de GitHub](https://github.com/cristotodev/Apuntes-SQL) y suscríbete a mi canal de [YouTube](https://www.youtube.com/@cristotodev) para comenzar tu viaje hacia la maestría en SQL y bases de datos hoy mismo.