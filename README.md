# Cristoto.dev - Blog Técnico

[![Vercel Deploy](https://img.shields.io/badge/Deployed%20on-Vercel-000000.svg?logo=vercel)](https://cristoto.dev)

Blog especializado en desarrollo de software con contenido técnico en español. Incluye tutoriales de SQL, DevOps con Podman y Traefik, workflows con Temporal, e inteligencia artificial aplicada.

## 🚀 Características

- **Astro SSG**: Generación estática para máximo rendimiento
- **Búsqueda semántica**: Búsqueda inteligente con IA integrada
- **Series de contenido**: Organización de posts relacionados
- **Optimización SEO**: Meta tags, structured data y sitemap automático
- **Modo oscuro/claro**: Toggle de tema con persistencia
- **Webmentions**: Integración con comentarios sociales
- **PWA**: Aplicación web progresiva
- **Responsive**: Diseño adaptable a todos los dispositivos

## 🛠️ Stack Tecnológico

- **Framework**: Astro 5.x
- **Estilos**: Tailwind CSS
- **Contenido**: MDX con colecciones tipadas
- **Búsqueda**: Pagefind + búsqueda semántica con embeddings
- **Linting**: Biome + Prettier
- **Deployment**: Vercel (adaptador SSR)

## 📋 Requisitos

- Node.js 18+ 
- pnpm 8+

## 🔧 Instalación y Desarrollo

```bash
# Clonar el repositorio
git clone https://github.com/cristotodev/cristoto.dev.git
cd cristoto.dev

# Instalar dependencias
pnpm install

# Ejecutar en modo desarrollo
pnpm run dev

# Servidor de desarrollo disponible en http://localhost:4321
```

## 📜 Comandos Disponibles

```bash
# Desarrollo
pnpm run dev          # Servidor de desarrollo
pnpm run start        # Alias para dev

# Construcción
pnpm run build        # Build de producción (incluye embeddings)
pnpm run postbuild    # Genera índice de búsqueda con Pagefind
pnpm run preview      # Preview del build

# Calidad de código
pnpm run lint         # Linting con Biome
pnpm run format       # Formateo completo (código + imports)
pnpm run format:code  # Formateo solo de código (Biome + Prettier)
pnpm run format:imports # Formateo solo de imports (Biome)
pnpm run check        # Type checking con Astro
```

## 📁 Estructura del Proyecto

```
src/
├── content/              # Contenido del blog
│   ├── post/            # Posts organizados por tema
│   │   ├── sql/         # Tutoriales de SQL
│   │   ├── devops/      # DevOps y infraestructura
│   │   └── temporal/    # Temporal workflows
│   ├── series/          # Definición de series
│   └── note/            # Notas cortas
├── components/          # Componentes Astro
│   ├── blog/           # Componentes específicos del blog
│   ├── seo/            # Componentes de SEO
│   └── layout/         # Layout components
├── pages/              # Rutas de la aplicación
├── utils/              # Utilidades y helpers
├── plugins/            # Plugins personalizados de Markdown
├── styles/             # Estilos globales
└── types/              # Definiciones de tipos TypeScript
```

## 🎯 Sistema de Contenido

### Posts

Los posts se organizan en carpetas temáticas dentro de `src/content/post/`:

- **SQL**: Tutoriales completos sobre bases de datos y gestión de datos
- **DevOps**: Infraestructura moderna con Podman y Traefik  
- **Temporal**: Workflows distribuidos y orquestación
- **IA**: Inteligencia artificial aplicada al desarrollo
- **Desarrollo**: Mejores prácticas y metodologías

### Series

Las series permiten agrupar posts relacionados mediante `seriesId` y `orderInSeries`.

### Metadata Requerida

```yaml
---
title: "Título del post"
description: "Descripción SEO"
publishDate: "2024-01-01"
tags: ["sql", "tutorial"]
seriesId: "sql-basico" # Opcional
orderInSeries: 1       # Opcional
---
```

## 🔍 Búsqueda Semántica

El proyecto incluye dos sistemas de búsqueda:

### Búsqueda Tradicional (Pagefind)
- Búsqueda textual rápida y precisa
- Índice generado automáticamente post-build
- Disponible en toda la aplicación

### Búsqueda Semántica con IA
- Embeddings generados automáticamente durante el build
- Utiliza `@xenova/transformers` para procesamiento local
- Búsqueda inteligente disponible en `/busqueda-semantica/`
- Comprende el contexto y significado del contenido

## ⚙️ Configuración Técnica

### Plugins de Markdown Personalizados

El proyecto incluye plugins personalizados desarrollados específicamente para mejorar la experiencia de escritura:

- **remarkReadingTime**: Calcula automáticamente el tiempo de lectura
- **remarkAdmonitions**: Permite crear admoniciones con sintaxis `:::`
- **rehypeExternalLinks**: Configura enlaces externos automáticamente

### Themes de Código

- **Tema claro**: Rose Pine Dawn
- **Tema oscuro**: Rose Pine
- Syntax highlighting con Shiki y transformadores personalizados

### PWA (Progressive Web App)

- Configuración completa de manifest
- Service worker automático
- Iconos optimizados para diferentes dispositivos
- Soporte offline básico

## 🎨 Personalización

### Configuración del sitio

Edita `src/site.config.ts` para personalizar:

- Información del autor
- Descripción del sitio
- Enlaces del menú
- Configuración de idioma

### Temas y estilos

- Los estilos se definen en `src/styles/global.css`
- Usa Tailwind CSS para el diseño
- Tema oscuro/claro implementado con CSS variables

## 🚀 Deployment

El proyecto está configurado para Vercel mediante el adaptador `@astrojs/vercel`:

```bash
# Build automático en cada push a main
pnpm run build

# El comando postbuild genera el índice de búsqueda
pnpm run postbuild
```

### Variables de Entorno (Opcionales)

Para funcionalidades adicionales, configura estas variables de entorno:

```env
# Webmentions (opcional)
WEBMENTION_API_KEY=tu_api_key
WEBMENTION_URL=https://webmention.io/tu-sitio.com/webmention
WEBMENTION_PINGBACK=https://webmention.io/tu-sitio.com/xmlrpc
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'feat: nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

### Convenciones

- Usa commits semánticos (feat, fix, docs, etc.)
- Sigue el formato de código existente (configurado con Biome)
- Ejecuta `pnpm run lint` antes de hacer commit
- Asegúrate de que `pnpm run check` pase sin errores
- Usa `pnpm run format` para formatear el código automáticamente

### Estructura de Commits

```
tipo(ámbito): descripción breve

Descripción más detallada del cambio

- Cambio específico 1
- Cambio específico 2
```

**Tipos de commit:**
- `feat`: Nueva característica
- `fix`: Corrección de errores
- `docs`: Cambios en documentación
- `style`: Cambios de formato sin afectar funcionalidad
- `refactor`: Refactorización de código
- `test`: Añadir o corregir tests
- `chore`: Tareas de mantenimiento

## 📞 Contacto

**Cristo Manuel Estévez Hernández**

- 🌐 Web: [cristoto.dev](https://cristoto.dev)
- 📺 YouTube: [@cristotodev](https://www.youtube.com/@cristotodev)
- 🐦 Twitter: [@cristotodev](https://twitter.com/cristotodev)
- 📸 Instagram: [@cristoto.dev](https://www.instagram.com/cristoto.dev/)
- 🐙 GitHub: [@cristotodev](https://github.com/cristotodev)

## 🔧 Desarrollo Local

### Configuración Inicial

1. **Requisitos del sistema:**
   - Node.js 18 o superior
   - pnpm 8 o superior (recomendado sobre npm/yarn)

2. **Instalación:**
   ```bash
   git clone https://github.com/cristotodev/cristoto.dev.git
   cd cristoto.dev
   pnpm install
   ```

3. **Variables de entorno (opcionales):**
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   WEBMENTION_API_KEY=tu_api_key_opcional
   WEBMENTION_URL=https://webmention.io/tu-dominio/webmention
   WEBMENTION_PINGBACK=https://webmention.io/tu-dominio/xmlrpc
   ```

### Flujo de Desarrollo

1. **Desarrollo:** `pnpm run dev` - Inicia el servidor de desarrollo
2. **Linting:** `pnpm run lint` - Verifica el código
3. **Formateo:** `pnpm run format` - Formatea automáticamente
4. **Type checking:** `pnpm run check` - Verifica tipos TypeScript
5. **Build:** `pnpm run build` - Construye para producción

### Arquitectura del Build

```
1. generate-embeddings.js  → Genera embeddings de IA
2. astro build            → Construye el sitio estático
3. pagefind --site dist   → Genera índice de búsqueda
```

## 📄 Licencia

Ver archivo [LICENSE](LICENSE) para más detalles.