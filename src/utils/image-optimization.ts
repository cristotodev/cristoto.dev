/**
 * Image optimization utilities for better SEO and performance
 */

/**
 * Generate SEO-optimized alt text
 */
export function optimizeAltText(
	originalAlt: string, 
	context: { 
		postTitle?: string;
		category?: string;
		tags?: string[];
		isHero?: boolean;
	} = {}
): string {
	let optimized = originalAlt.trim();
	
	// If alt text is too short or generic, enhance it
	const genericTerms = ['image', 'foto', 'picture', 'img', 'captura', 'screenshot'];
	const isGeneric = genericTerms.some(term => 
		optimized.toLowerCase().includes(term) && optimized.length < 20
	);
	
	if (optimized.length < 10 || isGeneric) {
		const { postTitle, category, tags = [] } = context;
		
		// Add context from post title
		if (postTitle && !optimized.toLowerCase().includes(postTitle.toLowerCase().substring(0, 20))) {
			optimized = `${optimized} - ${postTitle}`;
		}
		
		// Add category context
		if (category && !optimized.toLowerCase().includes(category)) {
			optimized = `${optimized} (${category})`;
		}
		
		// Add main tag if not present
		const mainTag = tags[0];
		if (mainTag && !optimized.toLowerCase().includes(mainTag.toLowerCase())) {
			optimized = `${optimized} sobre ${mainTag}`;
		}
		
		// Add site context for better SEO
		if (!optimized.toLowerCase().includes('cristotodev')) {
			optimized = `${optimized} - Cristotodev`;
		}
	}
	
	// Clean up and ensure proper length (max 125 characters for SEO)
	optimized = optimized
		.replace(/\s+/g, ' ')
		.trim();
		
	if (optimized.length > 125) {
		optimized = optimized.substring(0, 122) + '...';
	}
	
	return optimized;
}

/**
 * Generate responsive image sizes attribute
 */
export function generateSizes(breakpoints: {
	mobile?: string;
	tablet?: string;
	desktop?: string;
} = {}): string {
	const defaults = {
		mobile: '100vw',
		tablet: '50vw', 
		desktop: '33vw'
	};
	
	const sizes = { ...defaults, ...breakpoints };
	
	return `(max-width: 768px) ${sizes.mobile}, (max-width: 1024px) ${sizes.tablet}, ${sizes.desktop}`;
}

/**
 * Detect images in markdown content and suggest optimizations
 */
export function analyzeImageUsage(content: string): {
	imageCount: number;
	missingAltTexts: number;
	largeImages: string[];
	suggestions: string[];
} {
	const imagePattern = /!\[(.*?)\]\((.*?)\)/g;
	const images = [...content.matchAll(imagePattern)];
	
	let missingAltTexts = 0;
	const largeImages: string[] = [];
	const suggestions: string[] = [];
	
	images.forEach(([full, alt, src]) => {
		if (!src) return;
		
		// Check for missing or poor alt text
		if (!alt || alt.length < 5) {
			missingAltTexts++;
			suggestions.push(`Imagen "${src}" necesita mejor texto alternativo`);
		}
		
		// Check for potentially large images
		if (src.includes('screenshot') || src.includes('capture') || src.endsWith('.png')) {
			largeImages.push(src);
			suggestions.push(`Imagen "${src}" podría optimizarse a WebP/AVIF`);
		}
		
		// Check for external images without lazy loading
		if (src.startsWith('http') && !full.includes('loading="lazy"')) {
			suggestions.push(`Imagen externa "${src}" debería usar lazy loading`);
		}
	});
	
	// General suggestions based on image count
	if (images.length > 5) {
		suggestions.push('Considera usar lazy loading para mejorar Core Web Vitals');
	}
	
	if (images.length > 10) {
		suggestions.push('Muchas imágenes detectadas: considera galería optimizada');
	}
	
	return {
		imageCount: images.length,
		missingAltTexts,
		largeImages,
		suggestions
	};
}

/**
 * Generate structured data for images
 */
export function generateImageSchema(
	src: string,
	alt: string,
	context: {
		caption?: string;
		author?: string;
		datePublished?: string;
		representativeOfPage?: boolean;
	} = {}
): object {
	return {
		"@context": "https://schema.org",
		"@type": "ImageObject",
		"url": src,
		"description": alt,
		...(context.caption && { "caption": context.caption }),
		...(context.author && { 
			"author": {
				"@type": "Person",
				"name": context.author
			}
		}),
		...(context.datePublished && { "datePublished": context.datePublished }),
		...(context.representativeOfPage && { "representativeOfPage": true }),
		"inLanguage": "es-ES"
	};
}

/**
 * Lazy loading intersection observer setup
 */
export const lazyLoadScript = `
	// Lazy loading with intersection observer
	document.addEventListener('DOMContentLoaded', () => {
		const images = document.querySelectorAll('img[data-src]');
		
		const imageObserver = new IntersectionObserver((entries, observer) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					const img = entry.target;
					img.src = img.dataset.src;
					img.classList.remove('lazy');
					imageObserver.unobserve(img);
				}
			});
		}, {
			rootMargin: '50px 0px',
			threshold: 0.01
		});
		
		images.forEach(img => imageObserver.observe(img));
	});
`;

/**
 * WebP fallback detection
 */
export const webpSupportScript = `
	// WebP support detection and fallback
	function supportsWebP() {
		return new Promise(resolve => {
			const webP = new Image();
			webP.onload = webP.onerror = () => resolve(webP.height === 2);
			webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
		});
	}
	
	supportsWebP().then(supported => {
		if (!supported) {
			document.querySelectorAll('img[data-webp]').forEach(img => {
				img.src = img.dataset.fallback || img.src.replace(/\\.webp$/, '.jpg');
			});
		}
	});
`;