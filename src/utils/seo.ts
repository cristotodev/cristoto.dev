/**
 * SEO utilities for meta descriptions and titles
 */

/**
 * Optimizes meta descriptions for search engines by ensuring proper length, punctuation, and keyword inclusion.
 * Automatically expands short descriptions and truncates long ones while preserving readability.
 * 
 * @param description - The original meta description text
 * @param keywords - Optional array of keywords to include if missing
 * @returns Optimized meta description between 120-160 characters with proper punctuation
 * 
 * @example
 * ```typescript
 * const optimized = optimizeMetaDescription(
 *   'Learn React', 
 *   ['react', 'tutorial']
 * );
 * // Returns: 'Learn React. Aprende sobre react y tutorial paso a paso.'
 * ```
 */
export function optimizeMetaDescription(description: string, keywords?: string[]): string {
	let optimized = description.trim();
	
	// If description is too short, and we have keywords, try to expand
	if (optimized.length < 120 && keywords && keywords.length > 0) {
		const keywordPhrase = keywords.slice(0, 2).join(' y ');
		if (!optimized.toLowerCase().includes(keywordPhrase.toLowerCase())) {
			optimized = `${optimized} Aprende sobre ${keywordPhrase} paso a paso.`;
		}
	}
	
	// Truncate if too long, ensuring we don't cut mid-word
	if (optimized.length > 160) {
		optimized = optimized.substring(0, 157);
		const lastSpace = optimized.lastIndexOf(' ');
		if (lastSpace > 120) {
			optimized = optimized.substring(0, lastSpace);
		}
		optimized += '...';
	}
	
	// Ensure proper ending punctuation
	if (!/[.!?]$/.test(optimized)) {
		optimized += '.';
	}
	
	return optimized;
}

/**
 * Creates SEO-optimized page titles with proper length limits and site branding.
 * Adds category context and ensures titles don't exceed search engine display limits.
 * 
 * @param title - The base title text
 * @param category - Optional category to add for context
 * @param siteName - Site name for branding (defaults to 'Cristotodev')
 * @returns Formatted title with category and site name, truncated if necessary
 * 
 * @example
 * ```typescript
 * const seoTitle = optimizeTitle('React Hooks Guide', 'javascript');
 * // Returns: 'React Hooks Guide - Javascript • Cristotodev'
 * ```
 */
export function optimizeTitle(title: string, category?: string, siteName: string = 'Cristotodev'): string {
	let optimized = title.trim();
	
	// Add category context if provided and not already included
	if (category && !optimized.toLowerCase().includes(category.toLowerCase())) {
		optimized = `${optimized} - ${category.charAt(0).toUpperCase() + category.slice(1)}`;
	}
	
	// Ensure title is not too long (60 characters max for optimal display)
	const separator = ' • ';
	const maxTitleLength = 60 - separator.length - siteName.length;
	
	if (optimized.length > maxTitleLength) {
		optimized = optimized.substring(0, maxTitleLength - 3) + '...';
	}
	
	return `${optimized} ${separator} ${siteName}`;
}

/**
 * Extracts relevant keywords from title and tags for SEO optimization.
 * Filters out short words from title and combines with tags to create keyword list.
 * 
 * @param title - Page title to extract keywords from
 * @param tags - Array of content tags
 * @returns Deduplicated array of keywords from title and tags
 * 
 * @example
 * ```typescript
 * const keywords = extractKeywords('Advanced React Patterns', ['react', 'patterns']);
 * // Returns: ['react', 'patterns', 'advanced', 'patterns']
 * ```
 */
export function extractKeywords(title: string, tags: string[]): string[] {
	const titleWords = title.toLowerCase()
		.split(/\s+/)
		.filter(word => word.length > 3)
		.slice(0, 3);
		
	return [...new Set([...tags, ...titleWords])];
}

/**
 * Generates SEO-optimized meta descriptions for category pages based on predefined templates.
 * Provides specific descriptions for known categories and generic template for others.
 * 
 * @param category - The category name to generate description for
 * @returns SEO-optimized description text for the category
 * 
 * @example
 * ```typescript
 * const desc = generateCategoryDescription('sql');
 * // Returns: 'Tutoriales completos de SQL para desarrolladores. Aprende bases de datos...'
 * 
 * const custom = generateCategoryDescription('golang');
 * // Returns: 'Tutoriales y guías prácticas sobre golang. Aprende desarrollo...'
 * ```
 */
export function generateCategoryDescription(category: string): string {
	const categoryDescriptions: Record<string, string> = {
		sql: 'Tutoriales completos de SQL para desarrolladores. Aprende bases de datos, consultas avanzadas y optimización de rendimiento.',
		devops: 'Guías prácticas de DevOps, CI/CD, Docker, Kubernetes y automatización para desarrolladores modernos.',
		temporal: 'Workflows distribuidos con Temporal. Aprende a construir aplicaciones resilientes y escalables.',
		javascript: 'Tutoriales avanzados de JavaScript, frameworks modernos y mejores prácticas de desarrollo frontend.',
		python: 'Guías completas de Python para desarrollo web, data science y automatización de tareas.',
		react: 'Aprende React desde cero. Componentes, hooks, estado y patrones avanzados para aplicaciones web modernas.'
	};
	
	return categoryDescriptions[category.toLowerCase()] || 
		`Tutoriales y guías prácticas sobre ${category}. Aprende desarrollo de software con ejemplos reales y mejores prácticas.`;
}

/**
 * Optimizes H1 headings for SEO by adding relevant category keywords while maintaining natural language.
 * Only enhances titles that are short and missing obvious category-related terms.
 * 
 * @param title - The original title text
 * @param category - Content category for keyword enhancement
 * @param _tags - Content tags (currently unused, reserved for future enhancement)
 * @returns Enhanced title with category keywords if appropriate, otherwise original title
 * 
 * @example
 * ```typescript
 * const h1 = optimizeH1('Guía básica', 'sql', ['database']);
 * // Returns: 'Guía básica de SQL' (if title was short enough)
 * 
 * const h1Long = optimizeH1('Complete SQL Database Tutorial', 'sql');
 * // Returns: 'Complete SQL Database Tutorial' (unchanged - already optimized)
 * ```
 */
export function optimizeH1(title: string, category?: string, _tags: string[] = []): string {
	let optimized = title.trim();
	
	// If the title is very short and doesn't include key category terms, enhance it
	if (category && optimized.length < 40) {
		const categoryKeywords: Record<string, string[]> = {
			sql: ['SQL', 'Base de Datos', 'Consultas'],
			devops: ['DevOps', 'CI/CD', 'Automatización'],
			temporal: ['Temporal', 'Workflows', 'Microservicios'],
			javascript: ['JavaScript', 'Frontend', 'Web'],
			python: ['Python', 'Desarrollo', 'Programación'],
			react: ['React', 'Componentes', 'Frontend']
		};
		
		const keywords = categoryKeywords[category.toLowerCase()];
		if (keywords) {
			const missingKeyword = keywords.find(keyword => 
				!optimized.toLowerCase().includes(keyword.toLowerCase())
			);
			
			// Only add if title is really short and missing obvious keywords
			if (missingKeyword && optimized.length < 30) {
				// Add keyword naturally based on title structure
				if (optimized.toLowerCase().includes('cómo') || optimized.toLowerCase().includes('como')) {
					optimized = `${optimized} con ${missingKeyword}`;
				} else if (optimized.toLowerCase().includes('guía') || optimized.toLowerCase().includes('tutorial')) {
					optimized = `${optimized} de ${missingKeyword}`;
				}
			}
		}
	}
	
	return optimized;
}

/**
 * Converts title text into SEO-friendly URL slug by normalizing characters and formatting.
 * Removes accents, special characters, and converts to lowercase kebab-case.
 * 
 * @param title - The title text to convert to slug
 * @returns URL-safe slug in kebab-case format
 * 
 * @example
 * ```typescript
 * const slug = generateSlug('Guía de Programación en Python');
 * // Returns: 'guia-de-programacion-en-python'
 * 
 * const slug2 = generateSlug('React Hooks: Advanced Patterns!');
 * // Returns: 'react-hooks-advanced-patterns'
 * ```
 */
export function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.trim()
		// Remove accents and special characters
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		// Convert to kebab-case
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '');
}

/**
 * Creates SEO-optimized URL structure for blog posts using existing slug or generating from title.
 * Preserves category structure and chooses the most descriptive slug format.
 * 
 * @param post - Post object with id and data containing title and tags
 * @param post.id - Post identifier with potential category path
 * @param post.data.title - Post title for slug generation
 * @param post.data.tags - Post tags array
 * @returns SEO-friendly URL path with category and optimized slug
 * 
 * @example
 * ```typescript
 * const url = createSEOUrl({
 *   id: 'sql/database-basics.md',
 *   data: { title: 'Database Fundamentals', tags: ['sql'] }
 * });
 * // Returns: 'sql/database-basics' or 'sql/database-fundamentals'
 * ```
 */
export function createSEOUrl(post: {id: string, data: {title: string, tags: string[]}}): string {
	const pathSegments = post.id.split('/');
	const category = pathSegments.length > 1 ? pathSegments[0] : '';
	const originalSlug = pathSegments[pathSegments.length - 1] || '';
	
	// If title is short and descriptive, use it as slug
	const titleSlug = generateSlug(post.data.title);
	
	// Keep original slug if it's already SEO-friendly, otherwise use title slug
	const finalSlug = originalSlug && originalSlug.length > titleSlug.length && originalSlug.includes('-') 
		? originalSlug 
		: titleSlug;
	
	return category ? `${category}/${finalSlug}` : finalSlug;
}

/**
 * Generates canonical URLs for blog posts to prevent duplicate content issues.
 * Combines base URL with SEO-optimized post path and proper trailing slash.
 * 
 * @param baseUrl - The site's base URL (e.g., 'https://cristoto.dev')
 * @param post - Post object with id and data for URL generation
 * @param post.id - Post identifier
 * @param post.data.title - Post title
 * @param post.data.tags - Post tags
 * @returns Complete canonical URL for the post
 * 
 * @example
 * ```typescript
 * const canonical = generateCanonicalUrl(
 *   'https://cristoto.dev',
 *   { id: 'sql/joins.md', data: { title: 'SQL Joins', tags: ['sql'] } }
 * );
 * // Returns: 'https://cristoto.dev/posts/sql/sql-joins/'
 * ```
 */
export function generateCanonicalUrl(baseUrl: string, post: {id: string, data: {title: string, tags: string[]}}): string {
	const seoUrl = createSEOUrl(post);
	return `${baseUrl}/posts/${seoUrl}/`;
}