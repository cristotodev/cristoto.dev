---
title: "Actualizando Registros en SQL: Una Guía Práctica"
description: "Descubre cómo actualizar registros en SQL utilizando la sentencia UPDATE, con ejemplos prácticos."
publishDate: "29 Jun 2024"
tags: ["sql"]
---
Cómo actualizar registros en una base de datos utilizando la sentencia `UPDATE` en SQL, centrándonos en la tabla `clientes`. Descubriremos cómo modificar datos existentes y aplicaremos técnicas para hacerlo de manera eficiente.

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

Esta tabla contiene información crucial sobre nuestros clientes, incluyendo ID único, nombre, correo electrónico, fecha de nacimiento opcional y sueldo.

## Usando UPDATE

La sentencia `UPDATE` nos permite modificar los valores de las columnas existentes en una tabla. Es fundamental para mantener actualizada la información en nuestras bases de datos.

### Ejemplo Básico de UPDATE con WHERE

Imaginemos que queremos actualizar el sueldo del cliente con ID 5 a $5000. La consulta sería así:

``` sql
UPDATE clientes SET sueldo = 5000 WHERE id = 5;
```

Este comando cambia el sueldo del cliente con ID 5 a $5000, manteniendo intactos los demás registros.

### Ejemplo Avanzado: Actualización Basada en Condición

Supongamos que queremos aumentar el sueldo de todos los clientes mayores de 30 años en un 10%. Podríamos hacerlo así:

``` sql
UPDATE clientes SET sueldo = sueldo * 1.10 
WHERE fecha_nacimiento IS NOT NULL 
AND EXTRACT(YEAR FROM fecha_nacimiento) <= 1994;
```

Este comando busca a todos los clientes que tienen una fecha de nacimiento registrada y cuya edad es mayor de 30 años, y les aumenta su sueldo en un 10%.

## Ejemplo Con JOIN

Ahora, veamos cómo podemos usar `UPDATE` junto con `JOIN` para actualizar registros en una tabla relacionada. Supongamos que tenemos una tabla `pedidos` que necesita ser actualizada con el nuevo sueldo de los clientes.

``` sql
UPDATE pedidos INNER JOIN clientes 
ON pedidos.cliente_id = clientes.id 
SET pedidos.precio_total = pedidos.precio_total * 0.9 
WHERE clientes.sueldo > 3000;
```

Este comando actualiza el precio total de los pedidos de los clientes cuyo sueldo es superior a $3000, reduciéndolo en un 10%.

## Conclusión

Actualizar registros es una operación común en cualquier sistema de gestión de bases de datos. La sentencia `UPDATE` es una herramienta poderosa para modificar datos existentes, pero siempre debemos proceder con cautela para evitar cambios accidentales. Al combinar `UPDATE` con cláusulas `WHERE` precisas, podemos realizar modificaciones específicas y eficientes en nuestros datos. Además, la capacidad de `UPDATE` para trabajar con `JOIN` abre puertas para consultas más complejas y actualizaciones basadas en relaciones entre tablas.

![Recuerda usar el WHERE en los UPDATE](https://cdn.memegenerator.es/imagenes/memes/full/30/78/30789253.jpg)

## Más Ejemplos y Videos

Te animo a seguir mis videos en YouTube, cada video viene acompañado de ejemplos de código y explicaciones claras, diseñados para ayudarte a mejorar tus habilidades en SQL y la gestión de bases de datos.

Visita mi [repositorio de GitHub](https://github.com/cristotodev/Apuntes-SQL) y suscríbete a mi canal de [YouTube](https://www.youtube.com/@cristotodev) para comenzar tu viaje hacia la maestría en SQL y bases de datos hoy mismo.