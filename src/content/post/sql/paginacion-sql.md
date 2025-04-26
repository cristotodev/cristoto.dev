---
title:  "Paginando con LIMIT y OFFSET en SQL"
description: "Descubre cómo usar LIMIT y OFFSET en SQL para controlar la cantidad de filas retornadas por tus consultas. Explora ejemplos sencillos y luego aprende sobre paginación avanzada."
publishDate: "5 Jun 2024"
tags: ["sql"]
---

En SQL, `LIMIT` y `OFFSET` son cláusulas poderosas que te permiten controlar la cantidad de filas que se devuelven en los resultados de una consulta. Estas cláusulas son fundamentales para la paginación de datos, especialmente en aplicaciones web que muestran grandes conjuntos de datos. A continuación, te introduciré a estas cláusulas con ejemplos sencillos y luego expandiré sobre cómo implementar paginación avanzada.

## ¿Qué Son LIMIT y OFFSET?

- **LIMIT**: Restringe el número de filas que se devuelven en los resultados de una consulta. Es útil cuando solo necesitas un subconjunto de registros para análisis o visualización.
- **OFFSET**: Salta un número especificado de filas antes de comenzar a devolver el conjunto de resultados. Es útil para paginación, donde deseas saltar ciertas filas para mostrar diferentes segmentos de datos.

### Sintaxis Básica

La sintaxis básica para usar `LIMIT` y `OFFSET` es la siguiente:

``` sql
SELECT column_list FROM table_name 
ORDER BY column_list 
LIMIT row_count OFFSET offset;
```

Donde:
- `column_list`: Las columnas que deseas seleccionar.
- `table_name`: El nombre de la tabla de la cual deseas seleccionar.
- `column_list`: Las columnas por las cuales deseas ordenar los resultados.
- `row_count`: El número máximo de filas que deseas devolver.
- `offset`: El número de filas a saltar antes de comenzar a devolver filas.


### Ejemplo 1: Usando SOLO LIMIT

Si deseas seleccionar solo las primeras 5 filas de una tabla `empleados`, ordenadas por `nombre`, usarías:

``` sql
SELECT empleado_id, nombre, apellido 
FROM empleados ORDER BY nombre 
LIMIT 5;
```

### Ejemplo 2: Usando OFFSET con LIMIT para saltarnos las n primeras filas

Para saltar las primeras 10 filas y luego seleccionar las siguientes 5, usarías:

``` sql
SELECT empleado_id, nombre, apellido 
FROM empleados ORDER BY nombre 
LIMIT 5 OFFSET 10 ;
```

## Implementando Paginación Avanzada

Para implementar paginación avanzada, puedes calcular el valor de `OFFSET` basado en el número de página y el número de filas por página. Por ejemplo, si deseas mostrar 10 filas por página y estás en la página 3, el `OFFSET` sería `(10 * 2) - 10`, lo que equivale a 20.

``` sql
SELECT empleado_id, nombre, apellido 
FROM empleados ORDER BY nombre 
LIMIT 10 OFFSET 20;
```

Esta consulta muestra las primeras 10 filas de la tercera página, saltando las primeras 20 filas.

## Nota Importante

Es importante destacar que `OFFSET` debe usarse siempre en combinación con `LIMIT`. No es posible ni recomendable usar `OFFSET` sin `LIMIT`, ya que podría llevar a errores de sintaxis o comportamientos inesperados en la ejecución de la consulta.

El siguiente ejemplo dará error de sintaxis ya que no dispone de `LIMIT`.

``` sql
SELECT empleado_id, nombre, apellido 
FROM empleados ORDER BY nombre 
OFFSET 10 ;
```

## Conclusión

`LIMIT` y `OFFSET` son herramientas esenciales para controlar la cantidad de datos devueltos por tus consultas SQL. Estas cláusulas son cruciales para implementar paginación efectiva, mejorando la experiencia del usuario al navegar a través de grandes conjuntos de datos.

## Recursos Adicionales

Te invito a visitar mi [repositorio de GitHub](https://github.com/cristotodev/Apuntes-SQL) y suscribirte a mi canal de [YouTube](https://www.youtube.com/@cristotodev) para encontrar más ejemplos de código y explicaciones detalladas sobre SQL y bases de datos relacionales.
