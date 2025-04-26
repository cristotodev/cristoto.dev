---
title: "JOINs en SQL: Un Puente entre Tablas"
description: "Explora los diferentes tipos de JOINs en SQL con ejemplos prácticos. Aprende cómo conectar tablas para obtener datos completos."
publishDate: "10 Jun 2024"
#coverImage:
#  src: "https://res.cloudinary.com/cristotodev/image/upload/v1716969914/cristotodev/blog/sql_cfui24.webp"
#  alt: "JOINs en SQL"
tags: ["sql"]
---


Los JOINs en SQL son fundamentales para combinar filas de dos o más tablas basándose en una columna relacionada entre ellas. Permiten extraer información valiosa al unir datos dispersos en diferentes tablas. Existen varios tipos de JOINs, cada uno adecuado para situaciones específicas. En este artículo, exploraremos los diferentes tipos de JOINs disponibles en SQL, incluyendo ejemplos de código para ilustrar su uso.

## Tipos de JOINs en SQL
### INNER JOIN

El `INNER JOIN` devuelve las filas cuando hay una coincidencia en ambas tablas. Es decir, solo se muestran las filas que tienen valores coincidentes en ambas tablas.

<img class="mb-10 m-auto" src="https://res.cloudinary.com/cristotodev/image/upload/v1718004480/cristotodev/blog/inner-join_rofhl4.jpg" alt="Inner Join" />

**Ejemplo:**
Supongamos que tenemos dos tablas, `empleados` y `departamentos`, y queremos encontrar todos los empleados junto con sus departamentos.

``` sql
SELECT empleados.nombre, departamentos.nombre_departamento FROM empleados 
INNER JOIN departamentos ON empleados.id_departamento = departamentos.id;
```

### LEFT (OUTER) JOIN

El `LEFT JOIN` (también conocido como LEFT OUTER JOIN) devuelve todas las filas de la tabla izquierda, y las filas coincidentes de la tabla derecha. Si no hay coincidencia, el resultado es NULL en el lado derecho.


<img class="mb-10 m-auto" src="https://res.cloudinary.com/cristotodev/image/upload/v1718004480/cristotodev/blog/left-join_wilkyt.jpg" alt="Left Join" />

**Ejemplo:**

Si queremos listar todos los empleados, incluso aquellos sin asignar a ningún departamento, usaríamos un `LEFT JOIN`.

``` sql
SELECT empleados.nombre, departamentos.nombre_departamento FROM empleados 
LEFT JOIN departamentos ON empleados.id_departamento = departamentos.id;
```

### RIGHT (OUTER) JOIN

El `RIGHT JOIN` (también conocido como RIGHT OUTER JOIN) es el opuesto al `LEFT JOIN`. Devuelve todas las filas de la tabla derecha y las filas coincidentes de la tabla izquierda. Si no hay coincidencia, el resultado es NULL en el lado izquierdo.

<img class="mb-10 m-auto" src="https://res.cloudinary.com/cristotodev/image/upload/v1718004480/cristotodev/blog/right-join_ftrgwu.jpg" alt="Right Join" />


**Ejemplo:**

Para listar todos los departamentos, incluso si no tienen empleados asignados, usaríamos un `RIGHT JOIN`.

``` sql
SELECT empleados.nombre, departamentos.nombre_departamento FROM empleados 
RIGHT JOIN departamentos ON empleados.id_departamento = departamentos.id;
```

### FULL (OUTER) JOIN

El `FULL JOIN` (también conocido como FULL OUTER JOIN) devuelve todas las filas cuando hay una coincidencia en una de las tablas. Es decir, muestra todas las filas de ambas tablas, y cuando no hay coincidencias, el resultado es NULL en ambos lados.

<img class="mb-10 m-auto" src="https://res.cloudinary.com/cristotodev/image/upload/v1718004480/cristotodev/blog/Full_Join_wqgzno.png" alt="Full Join" />

**Ejemplo:**

Si queremos listar todos los empleados y departamentos, independientemente de si están asignados o no, usaríamos un `FULL JOIN`.

``` sql
SELECT empleados.nombre, departamentos.nombre_departamento FROM empleados 
FULL JOIN departamentos ON empleados.id_departamento = departamentos.id;
```

> No todos los gestores de Base de Datos soportan `FULL JOIN`. Algunos gestores de base de datos que lo soportan son: `PostgreSQL`, `SQL Server`, `Oracle`, `SQLite`, `IBM DB2` y `MariaDB`. Antes de usar cualquier JOIN recomiendo que visites su documentación para ver si lo soportan.

### CROSS JOIN

El `CROSS JOIN` permite unir cada fila de una tabla con cada fila de otra tabla, creando así el [producto cartesiano](https://es.wikipedia.org/wiki/Producto_cartesiano) de ambas. No requiere una condición de coincidencia específica, simplemente combina todas las posibles combinaciones de filas.

<img class="mb-10 m-auto" src="https://res.cloudinary.com/cristotodev/image/upload/v1718005234/cristotodev/blog/cross-join_atg8um.jpg" alt="Cross Join" />

**Ejemplo:**

``` sql
SELECT productos.nombre AS nombre_producto, colores.color AS color, tallas.talla AS talla 
FROM productos CROSS JOIN colores CROSS JOIN tallas;
```


### SELF JOIN

Un `SELF JOIN` ocurre cuando una tabla se une consigo misma. Es útil para comparar datos dentro de la misma tabla, por ejemplo, para mostrar relaciones jerárquicas o recursivas dentro de una tabla.

<img class="mb-10 m-auto" src="https://res.cloudinary.com/cristotodev/image/upload/v1718005234/cristotodev/blog/self-join_cp22qw.png" alt="Self Join" />

**Ejemplo:**

``` sql
SELECT e.nombre_empleado, m.nombre_empleado AS jefe FROM empleados e 
JOIN empleados m ON e.jefe_id = m.id;
```

## Conclusión

Los JOINs en SQL son herramientas poderosas para combinar datos de múltiples tablas. Al entender y aplicar correctamente los diferentes tipos de JOINs (`INNER JOIN`, `LEFT JOIN`, `RIGHT JOIN`, `FULL JOIN`, `CROSS JOIN`, `SELF JOIN`), puedes realizar consultas más complejas y obtener insights valiosos de tus bases de datos. Experimenta con estos ejemplos y adapta los JOINs a tus necesidades específicas para mejorar tu eficiencia y precisión en la extracción de datos.


## Más Ejemplos y Videos

Te animo a seguir mis videos en YouTube, cada video viene acompañado de ejemplos de código y explicaciones claras, diseñados para ayudarte a mejorar tus habilidades en SQL y la gestión de bases de datos.

Visita mi [repositorio de GitHub](https://github.com/cristotodev/Apuntes-SQL) y suscríbete a mi canal de [YouTube](https://www.youtube.com/@cristotodev) para comenzar tu viaje hacia la maestría en SQL y bases de datos hoy mismo.