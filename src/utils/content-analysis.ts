/**
 * Content analysis utilities for SEO optimization
 */

export interface ContentAnalysis {
	wordCount: number;
	readingTime: number;
	readabilityScore: number;
	keywordDensity: KeywordDensity[];
	headingStructure: HeadingAnalysis;
	contentQuality: ContentQuality;
	seoSuggestions: string[];
	warnings: string[];
}

export interface KeywordDensity {
	keyword: string;
	count: number;
	density: number;
	isOptimal: boolean;
	suggestion?: string;
}

export interface HeadingAnalysis {
	h1Count: number;
	h2Count: number;
	h3Count: number;
	structure: string[];
	issues: string[];
}

export interface ContentQuality {
	score: number;
	factors: {
		length: { score: number; message: string };
		keywords: { score: number; message: string };
		headings: { score: number; message: string };
		readability: { score: number; message: string };
		images: { score: number; message: string };
	};
}

/**
 * Analyzes content for comprehensive SEO optimization including readability, keyword density, and structure.
 * 
 * @param content - The markdown/HTML content to analyze
 * @param title - The page/post title for keyword extraction
 * @param description - The meta description for analysis
 * @param tags - Array of tags associated with the content
 * @returns Complete analysis including word count, reading time, SEO suggestions, and quality metrics
 * 
 * @example
 * ```typescript
 * const analysis = analyzeContent(
 *   '# My Post\n\nThis is great content...', 
 *   'SEO Guide', 
 *   'Learn SEO optimization', 
 *   ['seo', 'guide']
 * );
 * // analysis.wordCount - 234
 * // analysis.seoSuggestions - ['Add more H2 headings...']
 * ```
 */
export function analyzeContent(
	content: string, 
	title: string, 
	description: string, 
	tags: string[] = []
): ContentAnalysis {
	// Clean content (remove HTML/markdown)
	const cleanContent = cleanTextContent(content);
	const words = cleanContent.split(/\s+/).filter(word => word.length > 0);
	const wordCount = words.length;
	
	// Calculate reading time (average 200 words per minute)
	const readingTime = Math.ceil(wordCount / 200);
	
	// Analyze keyword density
	const keywordDensity = analyzeKeywordDensity(cleanContent, title, tags);
	
	// Analyze heading structure
	const headingStructure = analyzeHeadingStructure(content);
	
	// Calculate readability score
	const readabilityScore = calculateReadabilityScore(cleanContent);
	
	// Analyze content quality
	const contentQuality = evaluateContentQuality({
		wordCount,
		keywordDensity,
		headingStructure,
		readabilityScore,
		content,
		title,
		description
	});
	
	// Generate SEO suggestions
	const { suggestions, warnings } = generateSEOSuggestions({
		wordCount,
		keywordDensity,
		headingStructure,
		readabilityScore,
		contentQuality,
		title,
		description,
		tags
	});
	
	return {
		wordCount,
		readingTime,
		readabilityScore,
		keywordDensity,
		headingStructure,
		contentQuality,
		seoSuggestions: suggestions,
		warnings
	};
}

/**
 * Removes HTML tags, markdown formatting, and code blocks from content for text analysis.
 * 
 * @param content - Raw content with HTML/markdown formatting
 * @returns Clean, lowercase text suitable for word counting and keyword analysis
 * 
 * @example
 * ```typescript
 * const clean = cleanTextContent('# Title\n\n**Bold** text `code`');
 * // Returns: 'title bold text'
 * ```
 */
function cleanTextContent(content: string): string {
	return content
		// Remove HTML tags
		.replace(/<[^>]*>/g, ' ')
		// Remove markdown links
		.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
		// Remove markdown images
		.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
		// Remove markdown formatting
		.replace(/[*_`#\-]/g, ' ')
		// Remove code blocks
		.replace(/```[\s\S]*?```/g, ' ')
		// Remove inline code
		.replace(/`[^`]+`/g, ' ')
		// Normalize whitespace
		.replace(/\s+/g, ' ')
		.trim()
		.toLowerCase();
}

/**
 * Analyzes keyword density in content and provides optimization recommendations.
 * Extracts keywords from title, tags, and content to calculate density percentages.
 * 
 * @param content - Clean text content for analysis
 * @param title - Page title to extract keywords from
 * @param tags - Array of content tags
 * @returns Array of keyword density objects with optimization status and suggestions
 * 
 * @example
 * ```typescript
 * const density = analyzeKeywordDensity('react tutorial guide', 'React Guide', ['react']);
 * // Returns: [{ keyword: 'react', count: 2, density: 66.67, isOptimal: false, ... }]
 * ```
 */
function analyzeKeywordDensity(content: string, title: string, tags: string[]): KeywordDensity[] {
	const words = content.split(/\s+/).filter(word => word.length > 2);
	const totalWords = words.length;
	
	// Get potential keywords from title and tags
	const potentialKeywords = [
		...title.toLowerCase().split(/\s+/).filter(word => word.length > 3),
		...tags.map(tag => tag.toLowerCase()),
		// Common Spanish tech keywords
		'javascript', 'typescript', 'react', 'nodejs', 'python', 'sql', 'devops',
		'tutorial', 'guía', 'código', 'programación', 'desarrollo', 'web'
	];
	
	const keywordCounts = new Map<string, number>();
	
	// Count keyword occurrences
	potentialKeywords.forEach(keyword => {
		// Escape special regex characters
		const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const count = (content.match(new RegExp(`\\b${escapedKeyword}\\b`, 'gi')) || []).length;
		if (count > 0) {
			keywordCounts.set(keyword, count);
		}
	});
	
	// Also analyze 2-word phrases
	const phrases = extractPhrases(content, 2);
	phrases.forEach(phrase => {
		if (phrase.count > 2 && phrase.phrase.length > 8) {
			keywordCounts.set(phrase.phrase, phrase.count);
		}
	});
	
	// Calculate density and optimization status
	return Array.from(keywordCounts.entries())
		.map(([keyword, count]) => {
			const density = (count / totalWords) * 100;
			const isOptimal = density >= 0.5 && density <= 3.0; // Optimal range: 0.5-3%
			
			let suggestion = '';
			if (density < 0.5) {
				suggestion = `Considera usar más "${keyword}" (densidad actual: ${density.toFixed(2)}%)`;
			} else if (density > 3.0) {
				suggestion = `Reduce el uso de "${keyword}" para evitar keyword stuffing (densidad actual: ${density.toFixed(2)}%)`;
			}
			
			return {
				keyword,
				count,
				density: Number(density.toFixed(2)),
				isOptimal,
				suggestion
			};
		})
		.sort((a, b) => b.density - a.density)
		.slice(0, 10); // Top 10 keywords
}

/**
 * Extracts recurring phrases of specified word count from content for keyword analysis.
 * Filters out short phrases and sorts by frequency to identify important phrases.
 * 
 * @param content - Text content to analyze
 * @param wordCount - Number of words per phrase to extract
 * @returns Array of phrases with their occurrence counts, sorted by frequency
 * 
 * @example
 * ```typescript
 * const phrases = extractPhrases('react tutorial react guide tutorial guide', 2);
 * // Returns: [{ phrase: 'react tutorial', count: 1 }, { phrase: 'tutorial guide', count: 1 }]
 * ```
 */
function extractPhrases(content: string, wordCount: number): Array<{phrase: string, count: number}> {
	const words = content.split(/\s+/);
	const phrases = new Map<string, number>();
	
	for (let i = 0; i <= words.length - wordCount; i++) {
		const phrase = words.slice(i, i + wordCount).join(' ');
		if (phrase.length > 6) { // Minimum phrase length
			phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
		}
	}
	
	return Array.from(phrases.entries())
		.map(([phrase, count]) => ({ phrase, count }))
		.filter(item => item.count > 1)
		.sort((a, b) => b.count - a.count);
}

/**
 * Analyzes the heading structure (H1, H2, H3) in markdown content for SEO optimization.
 * Checks for proper hierarchy, missing headings, and structural issues.
 * 
 * @param content - Markdown content with heading tags
 * @returns Analysis of heading counts, structure hierarchy, and identified issues
 * 
 * @example
 * ```typescript
 * const structure = analyzeHeadingStructure('# Main\n## Sub\n### Detail');
 * // Returns: { h1Count: 1, h2Count: 1, h3Count: 1, structure: [...], issues: [] }
 * ```
 */
function analyzeHeadingStructure(content: string): HeadingAnalysis {
	const h1Matches = content.match(/^#{1}\s+.+$/gm) || [];
	const h2Matches = content.match(/^#{2}\s+.+$/gm) || [];
	const h3Matches = content.match(/^#{3}\s+.+$/gm) || [];
	
	const h1Count = h1Matches.length;
	const h2Count = h2Matches.length;
	const h3Count = h3Matches.length;
	
	const structure = [
		...h1Matches.map(h => 'H1: ' + h.replace(/^#+\s*/, '')),
		...h2Matches.map(h => 'H2: ' + h.replace(/^#+\s*/, '')),
		...h3Matches.map(h => 'H3: ' + h.replace(/^#+\s*/, ''))
	];
	
	const issues: string[] = [];
	
	if (h1Count === 0) {
		issues.push('Falta un título principal (H1) en el contenido');
	} else if (h1Count > 1) {
		issues.push('Múltiples H1 detectados, debería haber solo uno');
	}
	
	if (h2Count === 0 && content.length > 1000) {
		issues.push('Contenido largo sin subtítulos (H2) para mejorar estructura');
	}
	
	if (h2Count > 0 && h3Count / h2Count > 4) {
		issues.push('Demasiados H3 por H2, considera reestructurar');
	}
	
	return {
		h1Count,
		h2Count,
		h3Count,
		structure,
		issues
	};
}

/**
 * Calculates content readability using a simplified Flesch-Kincaid formula adapted for Spanish.
 * Higher scores indicate easier reading, with 100 being most readable.
 * 
 * @param content - Clean text content to analyze
 * @returns Readability score from 0 (very difficult) to 100 (very easy)
 * 
 * @example
 * ```typescript
 * const score = calculateReadabilityScore('Simple short sentences. Easy to read.');
 * // Returns: ~75 (relatively easy to read)
 * ```
 */
function calculateReadabilityScore(content: string): number {
	const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
	const words = content.split(/\s+/).filter(w => w.length > 0);
	const syllables = words.reduce((count, word) => count + countSyllables(word), 0);
	
	if (sentences.length === 0 || words.length === 0) return 0;
	
	const avgWordsPerSentence = words.length / sentences.length;
	const avgSyllablesPerWord = syllables / words.length;
	
	// Simplified Flesch Reading Ease (adapted for Spanish)
	const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
	
	return Math.max(0, Math.min(100, score));
}

/**
 * Counts syllables in a Spanish word by counting vowel groups.
 * Simplified algorithm that treats consecutive vowels as single syllables.
 * 
 * @param word - The word to count syllables for
 * @returns Number of syllables (minimum 1)
 * 
 * @example
 * ```typescript
 * const syllables = countSyllables('hola'); // Returns: 2
 * const syllables2 = countSyllables('programación'); // Returns: 5
 * ```
 */
function countSyllables(word: string): number {
	word = word.toLowerCase();
	const vowels = 'aeiouáéíóúü';
	let count = 0;
	let prevWasVowel = false;
	
	for (let i = 0; i < word.length; i++) {
		const isVowel = vowels.includes(word[i] ?? '');
		if (isVowel && !prevWasVowel) {
			count++;
		}
		prevWasVowel = isVowel;
	}
	
	return Math.max(1, count);
}

/**
 * Evaluates overall content quality based on multiple SEO and readability factors.
 * Combines length, keyword optimization, heading structure, readability, and media usage.
 * 
 * @param params - Object containing all analysis data
 * @param params.wordCount - Total word count of the content
 * @param params.keywordDensity - Array of keyword density analysis
 * @param params.headingStructure - Heading structure analysis
 * @param params.readabilityScore - Content readability score
 * @param params.content - Original content for image analysis
 * @param params.title - Content title
 * @param params.description - Meta description
 * @returns Quality score (0-100) with detailed factor breakdown and messages
 * 
 * @example
 * ```typescript
 * const quality = evaluateContentQuality({
 *   wordCount: 800,
 *   keywordDensity: [...],
 *   headingStructure: {...},
 *   readabilityScore: 65,
 *   content: '...',
 *   title: 'Guide',
 *   description: 'Learn...'
 * });
 * // quality.score - 85
 * ```
 */
function evaluateContentQuality(params: {
	wordCount: number;
	keywordDensity: KeywordDensity[];
	headingStructure: HeadingAnalysis;
	readabilityScore: number;
	content: string;
	title: string;
	description: string;
}): ContentQuality {
	const { wordCount, keywordDensity, headingStructure, readabilityScore, content } = params;
	
	// Length scoring
	const lengthScore = wordCount < 300 ? 20 : 
					   wordCount < 600 ? 60 :
					   wordCount < 1200 ? 90 :
					   wordCount < 2500 ? 100 : 80;
	
	const lengthMessage = wordCount < 300 ? 'Contenido demasiado corto para SEO' :
						  wordCount < 600 ? 'Contenido corto, considera expandir' :
						  wordCount > 2500 ? 'Contenido muy largo, considera dividir' :
						  'Longitud de contenido óptima';
	
	// Keywords scoring
	const optimalKeywords = keywordDensity.filter(k => k.isOptimal).length;
	const keywordsScore = optimalKeywords === 0 ? 20 :
						  optimalKeywords < 3 ? 60 :
						  optimalKeywords < 5 ? 80 : 100;
	
	const keywordsMessage = optimalKeywords === 0 ? 'Sin keywords optimizados' :
							optimalKeywords < 3 ? 'Pocos keywords optimizados' :
							'Densidad de keywords óptima';
	
	// Headings scoring
	const headingsScore = headingStructure.issues.length === 0 ? 100 :
						  headingStructure.issues.length === 1 ? 70 :
						  headingStructure.h2Count > 0 ? 50 : 20;
	
	const headingsMessage = headingStructure.issues.length === 0 ? 'Estructura de títulos óptima' :
							`${headingStructure.issues.length} problemas en estructura`;
	
	// Readability scoring
	const readabilityScoreNormalized = readabilityScore >= 60 ? 100 :
									   readabilityScore >= 30 ? 70 :
									   readabilityScore >= 10 ? 40 : 20;
	
	const readabilityMessage = readabilityScore >= 60 ? 'Texto fácil de leer' :
							   readabilityScore >= 30 ? 'Legibilidad aceptable' :
							   'Texto difícil de leer, simplifica';
	
	// Images scoring
	const imageCount = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
	const imagesScore = imageCount === 0 ? 30 :
						imageCount < 3 ? 70 :
						imageCount < 8 ? 100 : 90;
	
	const imagesMessage = imageCount === 0 ? 'Sin imágenes, añade contenido visual' :
						  imageCount < 3 ? 'Pocas imágenes, considera añadir más' :
						  'Cantidad de imágenes adecuada';
	
	// Overall score
	const overallScore = Math.round(
		(lengthScore * 0.25) +
		(keywordsScore * 0.25) +
		(headingsScore * 0.2) +
		(readabilityScoreNormalized * 0.15) +
		(imagesScore * 0.15)
	);
	
	return {
		score: overallScore,
		factors: {
			length: { score: lengthScore, message: lengthMessage },
			keywords: { score: keywordsScore, message: keywordsMessage },
			headings: { score: headingsScore, message: headingsMessage },
			readability: { score: readabilityScoreNormalized, message: readabilityMessage },
			images: { score: imagesScore, message: imagesMessage }
		}
	};
}

/**
 * Generates actionable SEO suggestions and critical warnings based on content analysis.
 * Provides specific recommendations for improving search engine optimization.
 * 
 * @param params - Complete content analysis data
 * @param params.wordCount - Total word count
 * @param params.keywordDensity - Keyword analysis results
 * @param params.headingStructure - Heading structure analysis
 * @param params.readabilityScore - Content readability score
 * @param params.contentQuality - Overall quality assessment
 * @param params.title - Page title
 * @param params.description - Meta description
 * @param params.tags - Content tags
 * @returns Object with actionable suggestions and critical warnings arrays
 * 
 * @example
 * ```typescript
 * const { suggestions, warnings } = generateSEOSuggestions({
 *   wordCount: 250,
 *   // ... other params
 * });
 * // warnings - ['📏 Content too short for SEO (minimum 300 words)']
 * ```
 */
function generateSEOSuggestions(params: {
	wordCount: number;
	keywordDensity: KeywordDensity[];
	headingStructure: HeadingAnalysis;
	readabilityScore: number;
	contentQuality: ContentQuality;
	title: string;
	description: string;
	tags: string[];
}): { suggestions: string[], warnings: string[] } {
	const { wordCount, keywordDensity, headingStructure, readabilityScore, title, description, tags } = params;
	
	const suggestions: string[] = [];
	const warnings: string[] = [];
	
	// Content length suggestions
	if (wordCount < 300) {
		warnings.push('📏 Contenido demasiado corto para SEO (mínimo 300 palabras)');
		suggestions.push('Expande el contenido con más detalles, ejemplos o explicaciones');
	} else if (wordCount < 600) {
		suggestions.push('📏 Considera expandir el contenido para mejor SEO (objetivo: 600+ palabras)');
	}
	
	// Keyword suggestions
	const problemKeywords = keywordDensity.filter(k => !k.isOptimal);
	if (problemKeywords.length > 0) {
		problemKeywords.slice(0, 3).forEach(keyword => {
			if (keyword.suggestion) {
				suggestions.push(`🔑 ${keyword.suggestion}`);
			}
		});
	}
	
	// Title and description suggestions
	if (title.length < 30) {
		suggestions.push('📝 Título demasiado corto, considera expandirlo (30-60 caracteres)');
	} else if (title.length > 60) {
		warnings.push('📝 Título demasiado largo, puede cortarse en resultados de búsqueda');
	}
	
	if (description.length < 120) {
		suggestions.push('📝 Meta descripción corta, expándela (120-160 caracteres)');
	} else if (description.length > 160) {
		warnings.push('📝 Meta descripción larga, puede cortarse en resultados');
	}
	
	// Tags suggestions
	if (tags.length === 0) {
		suggestions.push('🏷️ Añade tags relevantes para mejor categorización');
	} else if (tags.length > 8) {
		suggestions.push('🏷️ Demasiados tags, considera reducir a 5-8 más relevantes');
	}
	
	// Heading structure suggestions
	headingStructure.issues.forEach(issue => {
		suggestions.push(`📋 ${issue}`);
	});
	
	// Readability suggestions
	if (readabilityScore < 30) {
		suggestions.push('📖 Simplifica el texto: usa frases más cortas y palabras comunes');
	} else if (readabilityScore < 60) {
		suggestions.push('📖 Mejora la legibilidad: revisa frases largas y términos técnicos');
	}
	
	// General SEO suggestions
	if (keywordDensity.length === 0) {
		warnings.push('🔍 No se detectaron keywords relevantes en el contenido');
	}
	
	const h2Count = headingStructure.h2Count;
	if (wordCount > 800 && h2Count < 2) {
		suggestions.push('📋 Añade más subtítulos (H2) para mejorar la estructura');
	}
	
	return { suggestions, warnings };
}