/**
 * SEO utilities for meta descriptions and titles
 */

/**
 * Optimize meta description for SEO
 * - Ensures optimal length (150-160 characters)
 * - Ends with proper punctuation
 * - Includes key terms if missing
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
 * Generate SEO-optimized title
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
 * Extract keywords from tags and title
 */
export function extractKeywords(title: string, tags: string[]): string[] {
	const titleWords = title.toLowerCase()
		.split(/\s+/)
		.filter(word => word.length > 3)
		.slice(0, 3);
		
	return [...new Set([...tags, ...titleWords])];
}

/**
 * Generate category-specific meta description
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
 * Optimize H1 heading for SEO while keeping it natural
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
 * Generate SEO-friendly slug from title
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
 * Create SEO-optimized URL structure
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
 * Generate canonical URL for posts
 */
export function generateCanonicalUrl(baseUrl: string, post: {id: string, data: {title: string, tags: string[]}}): string {
	const seoUrl = createSEOUrl(post);
	return `${baseUrl}/posts/${seoUrl}/`;
}