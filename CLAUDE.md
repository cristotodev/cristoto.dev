# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
pnpm install

# Development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview

# Linting and formatting
pnpm run lint
pnpm run format

# Type checking
pnpm run check
```

## Project Architecture

This is an Astro-based Spanish blog (cristoto.dev) with content collections for posts, notes, and series. The site uses TypeScript, Tailwind CSS, and MDX for content.

### Content System

- **Posts** in `src/content/post/` organized by topic folders (sql/, devops/, temporal/)
- **Series** in `src/content/series/` to group related posts via `seriesId`
- **Notes** in `src/content/note/` for shorter content
- Content validation via Zod schemas in `src/content.config.ts`

### Key Configuration

- `src/site.config.ts`: Site metadata, menu links, author info (Spanish locale)
- `astro.config.ts`: Astro config with custom markdown plugins
- `biome.json`: Code formatting (tabs, 100 char width)

### Custom Features

- Custom remark plugins for reading time and admonitions
- Webmentions integration with optional API keys
- Dynamic OG images with Satori
- Pagefind search (post-build indexing)
- Dark/light theme toggle

The build process includes Astro SSG followed by Pagefind indexing for search functionality.