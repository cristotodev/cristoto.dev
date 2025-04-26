---
title: "Claves Foráneas (Foreign Keys) en SQL"
description: "Descubre cómo usar claves foráneas en SQL para establecer relaciones entre tablas. Aprende sobre los tipos de claves foráneas y las reglas de configuración."
publishDate: "5 Jun 2024"
updatedDate: "5 Jun 2024"
tags: ["sql"]
---

En SQL, las **claves foráneas** son fundamentales para establecer relaciones entre tablas. Una clave foránea es una columna (o combinación de columnas) que vincula datos de una tabla secundaria con una tabla principal o referenciada. Veamos los detalles:

## ¿Qué es una Clave Foránea?

- Una **clave foránea** garantiza la **integridad referencial** entre dos tablas.
- La tabla que lleva una clave foránea se conoce como **tabla secundaria**.
- La tabla que lleva la clave principal se conoce como **tabla principal** o **referenciada**.

## Tipos de Claves Foráneas

### Uno a Uno (1:1)
   - En este tipo de relación, una fila en la tabla secundaria se relaciona con **exactamente una fila** en la tabla principal.
   - Ejemplo: Una tabla de "Empleados" con una clave foránea que se relaciona con una tabla de "Direcciones".

### Uno a Muchos (1:N)
   - En esta relación, una fila en la tabla secundaria se relaciona con **varias filas** en la tabla principal.
   - Ejemplo: Una tabla de "Clientes" con una clave foránea que se relaciona con una tabla de "Pedidos".

### Muchos a Muchos (N:M)
   - En este caso, varias filas en la tabla secundaria se relacionan con **varias filas** en la tabla principal.
   - Se logra mediante una **tabla intermedia** que contiene las claves foráneas de ambas tablas.
   - Ejemplo: Una tabla de "Estudiantes" y una tabla de "Cursos", con una tabla intermedia "Inscripciones".

## Reglas de Configuración

Al crear una clave foránea, puedes configurar reglas para el comportamiento de los datos:

- **CASCADE**: Si se actualiza o elimina una fila en la tabla principal, se aplican los mismos cambios en la tabla secundaria.
- **SET NULL**: Si se actualiza o elimina una fila en la tabla principal, la clave foránea en la tabla secundaria se establece en NULL.
- **RESTRICT**: Evita que se realicen cambios en la tabla principal si hay filas relacionadas en la tabla secundaria.
- **NO ACTION**: Similar a RESTRICT, pero no se aplica en todas las bases de datos.

## Ejemplos según el tipo de relación

### Uno a Uno (1:1)
Supongamos que tenemos dos tablas: “Empleados” y “Licencias”. Cada empleado puede tener una única licencia. La clave foránea en la tabla “Empleados” se relaciona con la tabla “Licencias”.

```sql
CREATE TABLE Empleados (
    empleado_id INT PRIMARY KEY,
    nombre VARCHAR(50),
    licencia_id INT,
    FOREIGN KEY (licencia_id) REFERENCES Licencias(licencia_id)
);

CREATE TABLE Licencias (
    licencia_id INT PRIMARY KEY,
    tipo VARCHAR(20)
);
```
En este caso hemos agregado el id de la licencia (`licencia_id`) dentro de la tabla `Empleados` pero se podría hacer al revés también. Meter el id del empleado (`empleado_id`) dentro de la tabla `Licencias`.

### Uno a Muchos (1:N)
Consideremos las tablas “Clientes” y “Pedidos”. Cada cliente puede realizar varios pedidos. La clave foránea en la tabla “Pedidos” se relaciona con la tabla “Clientes”.

```sql
CREATE TABLE Clientes (
    cliente_id INT PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE Pedidos (
    pedido_id INT PRIMARY KEY,
    cliente_id INT,
    total DECIMAL(10, 2),
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id)
);
```

Fíjate como el id del cliente `cliente_id` está dentro de la tabla `Pedidos` ya que un cliente puede estar en varios pedidos. Si lo metemos dentro de la tabla `Clientes` entonces el cliente solo puede tener 1 pedido.

### Muchos a Muchos (N:M)
Imaginemos las tablas “Estudiantes” y “Cursos”. Varios estudiantes pueden inscribirse en varios cursos. Utilizaremos una tabla intermedia llamada “Inscripciones” para establecer la relación.

```sql
CREATE TABLE Estudiantes (
    estudiante_id INT PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE Cursos (
    curso_id INT PRIMARY KEY,
    nombre VARCHAR(50)
);

CREATE TABLE Inscripciones (
    inscripcion_id INT PRIMARY KEY,
    estudiante_id INT,
    curso_id INT,
    FOREIGN KEY (estudiante_id) REFERENCES Estudiantes(estudiante_id),
    FOREIGN KEY (curso_id) REFERENCES Cursos(curso_id)
);

```
Fíjate que la tabla intermedia (`Inscripciones`) contiene las claves primarias de ambas tablas (`estudiante_id` y `curso_id`)

## Conclusión

Las claves foráneas son una parte esencial del diseño de bases de datos relacionales. Al comprender los diferentes tipos de relaciones y las reglas de configuración, puedes construir sistemas más robustos y coherentes. Recuerda aplicar estas prácticas en tus proyectos y explorar más a fondo las posibilidades que ofrecen las claves foráneas.

## Recursos Adicionales

Te invito a visitar mi [repositorio de GitHub](https://github.com/cristotodev/Apuntes-SQL) y suscribirte a mi canal de [YouTube](https://www.youtube.com/@cristotodev) para encontrar más ejemplos de código y explicaciones detalladas sobre SQL y bases de datos relacionales.