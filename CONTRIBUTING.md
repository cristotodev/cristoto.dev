# Guía de Contribución

¡Gracias por tu interés en contribuir a cristoto.dev! Esta guía te ayudará a configurar el entorno y entender el proceso de contribución.

## 🚀 Configuración del Entorno

### Requisitos Previos

- Node.js 18 o superior
- pnpm 8 o superior
- Git

### Configuración Local

```bash
# 1. Fork el repositorio en GitHub

# 2. Clona tu fork
git clone https://github.com/TU_USUARIO/cristoto.dev.git
cd cristoto.dev

# 3. Configura el upstream
git remote add upstream https://github.com/cristotodev/cristoto.dev.git

# 4. Instala dependencias
pnpm install

# 5. Ejecuta el servidor de desarrollo
pnpm run dev
```

## 📝 Proceso de Contribución

### 1. Antes de Empezar

- Revisa los [issues existentes](https://github.com/cristotodev/cristoto.dev/issues)
- Comenta en el issue que quieres trabajar o crea uno nuevo
- Espera confirmación antes de empezar el trabajo

### 2. Creando una Rama

```bash
# Actualiza main
git checkout main
git pull upstream main

# Crea una nueva rama
git checkout -b tipo/descripcion-corta

# Ejemplos:
git checkout -b feat/busqueda-avanzada
git checkout -b fix/error-seo-tags
git checkout -b docs/api-documentation
```

### 3. Desarrollando

```bash
# Ejecuta el servidor de desarrollo
pnpm run dev

# Ejecuta linting mientras desarrollas
pnpm run lint

# Verifica tipos
pnpm run check
```

### 4. Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Tipos de commit
feat:     # Nueva funcionalidad
fix:      # Corrección de bugs
docs:     # Documentación
style:    # Formateo, sin cambios de lógica
refactor: # Refactoring de código
test:     # Añadir o modificar tests
chore:    # Tareas de mantenimiento

# Ejemplos
git commit -m "feat: agregar búsqueda por categorías"
git commit -m "fix: corregir error en navegación móvil"
git commit -m "docs: actualizar guía de instalación"
```

### 5. Pull Request

```bash
# Push a tu fork
git push origin tu-rama

# Crea un PR desde GitHub con:
# - Título descriptivo
# - Descripción detallada de los cambios
# - Referencias a issues relacionados
# - Screenshots si es relevante
```

## 📋 Estándares de Código

### Linting y Formateo

```bash
# Antes de hacer commit, siempre ejecuta:
pnpm run lint      # Revisa el código
pnpm run format    # Formatea automáticamente
pnpm run check     # Verifica tipos TypeScript
```

### Convenciones de Código

- **TypeScript**: Usa tipos explícitos cuando sea necesario
- **Componentes**: Nombra archivos en PascalCase (`MyComponent.astro`)
- **Utilidades**: Nombra archivos en kebab-case (`my-utility.ts`)
- **Indentación**: Usa tabs (configurado en biome.json)
- **Líneas**: Máximo 100 caracteres por línea

### Estructura de Archivos

```
src/
├── components/
│   ├── [ComponentName].astro     # Componentes generales
│   ├── blog/                     # Componentes específicos del blog
│   ├── seo/                      # Componentes de SEO
│   └── layout/                   # Componentes de layout
├── pages/
│   └── [page-name].astro         # Páginas en kebab-case
├── utils/
│   └── [utility-name].ts         # Utilidades en kebab-case
└── content/
    ├── post/[category]/          # Posts organizados por categoría
    └── series/                   # Definiciones de series
```

## 🎯 Tipos de Contribución

### 📝 Contenido

#### Escribir Posts

```bash
# Crea un nuevo post
mkdir -p src/content/post/categoria
touch src/content/post/categoria/mi-post.md
```

**Template de Post:**

```yaml
---
title: "Título del Post"
description: "Descripción SEO de 150-160 caracteres"
publishDate: "2024-01-01"
tags: ["tag1", "tag2"]
seriesId: "mi-serie" # Opcional
orderInSeries: 1     # Opcional
draft: false         # true para borradores
---

# Mi Post

Contenido del post en Markdown/MDX...
```

#### Series

Para crear una serie:

1. Crea el archivo de definición en `src/content/series/`:

```yaml
---
id: "mi-serie"
title: "Mi Serie"
description: "Descripción de la serie"
featured: true
---

Contenido descriptivo de la serie...
```

2. Vincula posts a la serie usando `seriesId` y `orderInSeries`

### 🛠️ Código

#### Componentes

- Sigue las convenciones de Astro
- Usa TypeScript para props
- Incluye JSDoc para funciones complejas
- Asegúrate de que sean responsive

#### Utilidades

- Funciones puras cuando sea posible
- Tests unitarios para lógica compleja
- Documentación JSDoc completa

### 🎨 Diseño

- Mantén consistencia con el diseño existente
- Usa las clases de Tailwind ya definidas
- Asegúrate de que funcione en modo oscuro/claro
- Testa en móvil y desktop

## 🧪 Testing

```bash
# Ejecuta el build para verificar que todo funciona
pnpm run build

# Verifica que el sitio se vea bien
pnpm run preview
```

### Checklist Antes del PR

- [ ] El código pasa `pnpm run lint`
- [ ] El código pasa `pnpm run check`
- [ ] El build funciona correctamente (`pnpm run build`)
- [ ] Los cambios se ven bien en desarrollo y preview
- [ ] Se han añadido tests si es necesario
- [ ] La documentación se ha actualizado si es relevante

## ❓ Preguntas Frecuentes

### ¿Cómo funciona la búsqueda semántica?

La búsqueda semántica usa embeddings generados en build time. El script `scripts/generate-embeddings.js` procesa todo el contenido y genera `public/embeddings.json`.

### ¿Cómo añado una nueva página?

Crea un archivo `.astro` en `src/pages/` y se generará automáticamente la ruta correspondiente.

### ¿Cómo personalizo el SEO?

Edita `src/site.config.ts` para configuración global y usa los componentes en `src/components/seo/` para SEO específico por página.

### ¿Cómo funciona el sistema de temas?

El tema se maneja con CSS variables definidas en `src/styles/global.css` y el toggle en `src/components/ThemeToggle.astro`.

## 📞 Obtener Ayuda

- **Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas generales
- **Twitter**: [@cristotodev](https://twitter.com/cristotodev) para contacto directo

¡Gracias por contribuir! 🎉