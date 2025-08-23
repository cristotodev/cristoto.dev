# Cristoto.dev - Blog Técnico

[![Deploy Status](https://api.netlify.com/api/v1/badges/your-badge/deploy-status)](https://app.netlify.com/sites/your-site/deploys)

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
- **Deployment**: Netlify

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
pnpm run preview      # Preview del build

# Calidad de código
pnpm run lint         # Linting con Biome
pnpm run format       # Formateo de código
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
└── styles/             # Estilos globales
```

## 🎯 Sistema de Contenido

### Posts

Los posts se organizan en carpetas temáticas dentro de `src/content/post/`:

- **SQL**: Tutoriales completos sobre bases de datos
- **DevOps**: Infraestructura con Podman y Traefik  
- **Temporal**: Workflows y orquestación
- **IA**: Inteligencia artificial aplicada

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

El proyecto incluye búsqueda semántica usando embeddings generados automáticamente:

- Los embeddings se generan en build time
- Búsqueda disponible en `/busqueda-semantica/`
- Utiliza Xenova Transformers para procesamiento local

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

El proyecto está configurado para Netlify:

```bash
# Build automático en cada push a main
pnpm run build

# El comando postbuild genera el índice de búsqueda
pnpm run postbuild
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'feat: nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

### Convenciones

- Usa commits semánticos (feat, fix, docs, etc.)
- Sigue el formato de código existente
- Ejecuta `pnpm run lint` antes de hacer commit
- Asegúrate de que `pnpm run check` pase sin errores

## 📞 Contacto

**Cristo Manuel Estévez Hernández**

- 🌐 Web: [cristoto.dev](https://cristoto.dev)
- 📺 YouTube: [@cristotodev](https://www.youtube.com/@cristotodev)
- 🐦 Twitter: [@cristotodev](https://twitter.com/cristotodev)
- 📸 Instagram: [@cristoto.dev](https://www.instagram.com/cristoto.dev/)
- 🐙 GitHub: [@cristotodev](https://github.com/cristotodev)

## 📄 Licencia

Ver archivo [LICENSE](LICENSE) para más detalles.