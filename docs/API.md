# API y Componentes - Documentación

## 🧩 Componentes Principales

### `SemanticChat.astro`

Componente de búsqueda semántica que permite consultas en lenguaje natural.

**Ubicación**: `src/components/SemanticChat.astro`

**Funcionalidad**:
- Búsqueda semántica usando embeddings
- Procesamiento local con @xenova/transformers
- Interfaz de chat responsive

**Uso**:
```astro
---
import SemanticChat from "@/components/SemanticChat.astro";
---

<SemanticChat />
```

### `PostPreview.astro`

Componente para mostrar previsualizaciones de posts.

**Props**:
- `post`: Objeto post con metadata
- `showDescription`: Boolean para mostrar descripción

### `SeriesPanel.astro`

Panel que muestra posts relacionados en una serie.

**Props**:
- `seriesId`: ID de la serie
- `currentSlug`: Slug del post actual

### `TOC.astro` 

Tabla de contenidos generada automáticamente.

**Props**:
- `headings`: Array de headings del post

## 🔧 Utilidades

### `content-analysis.ts`

Funciones para analizar contenido y generar metadatos SEO.

```typescript
// Analizar contenido de un post
export function analyzeContent(content: string): ContentAnalysis

// Extraer headings para TOC
export function extractHeadings(content: string): Heading[]

// Generar tiempo de lectura
export function calculateReadingTime(content: string): ReadingTime
```

### `seo.ts`

Utilidades para optimización SEO.

```typescript
// Generar structured data
export function generateArticleSchema(post: Post): string

// Optimizar meta description
export function optimizeMetaDescription(description: string): string

// Generar URL canónica
export function getCanonicalURL(slug: string): string
```

### `smart-internal-linking.ts`

Sistema de enlazado interno inteligente.

```typescript
// Encontrar posts relacionados
export function findRelatedPosts(currentPost: Post, allPosts: Post[]): Post[]

// Generar enlaces internos
export function generateInternalLinks(content: string, posts: Post[]): string
```

## 📊 Schemas de Contenido

### Post Schema

```typescript
const postSchema = z.object({
  title: z.string().max(120),
  description: z.string(),
  publishDate: z.date(),
  updatedDate: z.date().optional(),
  tags: z.array(z.string()),
  seriesId: z.string().optional(),
  orderInSeries: z.number().optional(),
  draft: z.boolean().default(false),
  coverImage: z.object({
    alt: z.string(),
    src: z.string(),
  }).optional(),
  ogImage: z.string().optional(),
});
```

### Series Schema

```typescript
const seriesSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  featured: z.boolean().default(false),
});
```

### Note Schema

```typescript
const noteSchema = z.object({
  title: z.string().max(120),
  description: z.string().optional(),
  publishDate: z.date(),
});
```

## 🔍 Sistema de Búsqueda

### Embeddings Generation

El script `scripts/generate-embeddings.js` procesa todos los posts y genera embeddings semánticos.

**Proceso**:
1. Lee todos los posts de `src/content/post/`
2. Extrae texto limpio de cada post
3. Genera embeddings usando multilingual-e5-small
4. Guarda resultado en `public/embeddings.json`

### Búsqueda Semántica

**Algoritmo**:
1. Usuario ingresa consulta en lenguaje natural
2. Se genera embedding de la consulta
3. Se calcula similitud coseno con todos los posts
4. Se devuelven los 5 más similares ordenados por score

## 🎨 Sistema de Temas

### CSS Variables

El sistema de temas usa CSS custom properties definidas en `src/styles/global.css`.

**Variables principales**:
```css
:root {
  --color-text: theme('colors.gray.900');
  --color-bg: theme('colors.white');
  --color-border: theme('colors.gray.200');
}

[data-theme="dark"] {
  --color-text: theme('colors.gray.100');
  --color-bg: theme('colors.gray.900');
  --color-border: theme('colors.gray.700');
}
```

### ThemeToggle Component

Componente para cambiar entre modo claro y oscuro con persistencia en localStorage.

## 📝 Plugins de Markdown

### remark-reading-time.ts

Calcula automáticamente el tiempo de lectura estimado para cada post.

### remark-admonitions.ts

Permite usar admoniciones estilo `::: tip`, `::: warning`, etc.

**Sintaxis**:
```markdown
::: tip
Contenido del tip
:::

::: warning
Contenido de la advertencia
:::
```

## 🌐 SEO y Performance

### Optimizaciones Implementadas

- **Meta tags** automáticos para cada página
- **Structured data** JSON-LD para artículos
- **Sitemap** XML generado automáticamente
- **Images** optimizadas con Sharp
- **Preloading** de recursos críticos
- **Service Worker** para PWA

### Métricas Core Web Vitals

El componente `CoreWebVitals.astro` monitorea automáticamente:
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)

## 🔗 Integraciones

### Webmentions

Integración opcional con webmention.io para comentarios sociales.

**Variables de entorno**:
```env
WEBMENTION_API_KEY=tu_api_key
WEBMENTION_URL=https://webmention.io/cristoto.dev/webmention
WEBMENTION_PINGBACK=https://webmention.io/cristoto.dev/xmlrpc
```

### Pagefind

Sistema de búsqueda estática que se ejecuta post-build.

**Configuración**: Se indexa automáticamente todo el contenido en `dist/` después del build.