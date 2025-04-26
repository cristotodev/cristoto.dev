---
title: "Dolos: Mi Primera Aplicación de Escritorio GNOME para Generar Datos Sintéticos en Python"
description: "Descubre Dolos, una innovadora aplicación de escritorio para GNOME que permite generar datos sintéticos y exportarlos en diversos formatos como JSON, CSV y XML. Desarrollada en Python y publicad"
publishDate: "21 Jul 2024"
updatedDate: "21 Jul 2024"
tags: ["python", "gtk", "adwaita"]
---

Estoy emocionado de presentar [Dolos](https://github.com/cristotodev/Dolos), mi primera aplicación de escritorio para [GNOME](https://developer.gnome.org/documentation/index.html). Dolos es una aplicación revolucionaria que busca simplificar la generación de datos sintéticos. Basada en tecnologías modernas como GTK4, Adwaita 1.5 y el lenguaje de diseño Blueprint, Dolos ofrece una interfaz intuitiva y poderosa para generar datos como correos electrónicos, nombres, números, entre otros. Estos datos pueden ser exportados en varios formatos, incluyendo JSON, CSV, y XML, lo que facilita su integración en diversos flujos de trabajo.

## Filosofía y Licencia de Dolos

Dolos es una aplicación publicada bajo los términos de la licencia GPL 3.0 o posterior, lo que la convierte en software libre bajo una de las licencias más abiertas y puras ofrecidas por la Free Software Foundation. Este enfoque garantiza que el código de Dolos permanecerá libre y accesible para todos, evitando cualquier intento de privatización o uso indebido.

Una característica destacada de Dolos es la ausencia de asignación o transferencia de copyright. Cada contribución al repositorio de Dolos pertenece a la persona que la escribió, siempre y cuando sea una contribución legítima. Esto se alinea con la filosofía de software libre y abierto, donde la colaboración y la transparencia son primordiales.

Aunque existen herramientas como el DCO (Developer Certificate of Origin) para asegurar que las contribuciones son legítimas y no infringes derechos de autor, en Dolos no se considera necesario implementarlas por el momento. Este enfoque facilita la colaboración y fomenta una comunidad más abierta y participativa.

## Por Qué Python

Elegí Python como el lenguaje de programación principal para Dolos por dos razones fundamentales. Primero, deseo seguir aprendiendo y perfeccionando mis habilidades en Python. Segundo, Python es uno de los lenguajes más utilizados para el desarrollo de aplicaciones GNOME, con bindings actualizados y una comunidad activa que facilita el desarrollo y el soporte.

## Uso de Meson en Dolos

Dolos utiliza [Meson](https://mesonbuild.com/index.html) como su sistema de compilación. Meson es una herramienta de compilación moderna que facilita el proceso de configuración, construcción y prueba de aplicaciones. GNOME recomienda el uso de Meson por varias razones:

- **Simplicidad y Rapidez:** Meson está diseñado para ser rápido y fácil de usar, con una sintaxis clara y concisa que reduce la complejidad en el proceso de compilación.
- **Compatibilidad Multiplataforma:** Meson soporta múltiples plataformas y lenguajes de programación, lo que lo convierte en una herramienta versátil para proyectos diversos.
- **Integración con Ninja:** Meson utiliza Ninja como su backend de construcción, lo que mejora significativamente la velocidad de compilación.
- **Facilidad de Uso:** Meson simplifica tareas comunes de compilación, como la detección de dependencias y la configuración de opciones de compilación, facilitando el trabajo de los desarrolladores.

## Cosas que Faltan por Hacer

### Terminar el Visualizador de JSON
Aún falta completar el visualizador de JSON que permitirá a los usuarios editar los datos generados de una forma cómoda y eficiente.

### Visualizar logo
Agregar el logo de Dolos a la aplicación en la sección de about y como icono de la aplicación.

### Agregar Traducciones
Es necesario agregar traducciones a la aplicación para que pueda ser utilizada por personas que hablen diferentes idiomas, mejorando así la accesibilidad y el alcance de Dolos.

### Permitir Exportar el JSON en Diferentes Formatos
La funcionalidad para exportar datos JSON en diferentes formatos como CSV y XML está en desarrollo, y será crucial para facilitar la integración de los datos generados en diversos flujos de trabajo.

### Empaquetar la Aplicación en Flatpak y Publicarla
Empaquetar Dolos en Flatpak permitirá una instalación más sencilla y segura en varias distribuciones de Linux. La publicación de la aplicación en repositorios populares aumentará su accesibilidad y uso.

### Permitir estructuras recursivas
Agregar un nuevo tipo JSON que al seleccionarla habilite configurar una estructura recursiva para crear JSON dentro de una key.

## Conclusión

Dolos es más que una simple herramienta para la generación de datos sintéticos; es una manifestación del poder del software libre y la colaboración abierta. Al utilizar tecnologías modernas y adherirse a principios de licenciamiento abierto, Dolos no solo facilita la creación de datos, sino que también fomenta una comunidad de desarrolladores y usuarios comprometidos con la libertad y la transparencia.

Te invito a unirte a la comunidad de Dolos, contribuir al proyecto y aprovechar las capacidades de esta herramienta innovadora. Juntos, podemos seguir construyendo software que respete la libertad del usuario y promueva el conocimiento compartido.

¡Explora, contribuye y disfruta de Dolos!