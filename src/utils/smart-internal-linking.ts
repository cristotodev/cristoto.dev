/**
 * Smart internal linking utilities for improved SEO
 */

export interface InternalLinkSuggestion {
	anchor: string;
	targetUrl: string;
	targetTitle: string;
	relevanceScore: number;
	context: string;
	linkType: 'exact' | 'semantic' | 'topical';
	position: number;
}

export interface LinkingAnalysis {
	suggestions: InternalLinkSuggestion[];
	currentLinks: string[];
	linkDensity: number;
	anchorTextVariety: number;
	opportunities: string[];
}

/**
 * Analyzes content for smart internal linking opportunities using relevance scoring.
 * Finds related posts and suggests anchor text with context for optimal internal linking.
 * 
 * @param content - The markdown content to analyze for linking opportunities
 * @param currentPost - The current post object being analyzed
 * @param allPosts - Array of all available posts for linking
 * @param maxSuggestions - Maximum number of link suggestions to return (default: 5)
 * @returns Complete analysis with suggestions, current links, and optimization opportunities
 * 
 * @example
 * ```typescript
 * const analysis = analyzeInternalLinking(
 *   'This React tutorial covers hooks...',
 *   currentPost,
 *   allPosts,
 *   3
 * );
 * console.log(analysis.suggestions.length); // Up to 3 suggestions
 * console.log(analysis.linkDensity); // 2.5 (percentage)
 * ```
 */
export function analyzeInternalLinking(
	content: string,
	currentPost: any,
	allPosts: any[],
	maxSuggestions: number = 5
): LinkingAnalysis {
	const cleanContent = content.toLowerCase();
	const currentLinks = extractCurrentLinks(content);
	const words = cleanContent.split(/\s+/).length;
	const linkDensity = (currentLinks.length / words) * 100;
	
	// Find linking opportunities
	const suggestions = findLinkingSuggestions(cleanContent, currentPost, allPosts, currentLinks, maxSuggestions);
	
	// Analyze anchor text variety
	const anchorTexts = currentLinks.map(link => extractAnchorText(link));
	const uniqueAnchors = new Set(anchorTexts).size;
	const anchorTextVariety = anchorTexts.length > 0 ? (uniqueAnchors / anchorTexts.length) * 100 : 0;
	
	// Generate opportunities
	const opportunities = generateLinkingOpportunities(suggestions, linkDensity, anchorTextVariety);
	
	return {
		suggestions,
		currentLinks,
		linkDensity: Number(linkDensity.toFixed(2)),
		anchorTextVariety: Number(anchorTextVariety.toFixed(2)),
		opportunities
	};
}

/**
 * Extracts existing internal links from markdown content using regex pattern matching.
 * Only captures links that are internal (starting with / or ./) to avoid external links.
 * 
 * @param content - Markdown content to scan for links
 * @returns Array of markdown link strings found in content
 * 
 * @example
 * ```typescript
 * const links = extractCurrentLinks('[Guide](/posts/guide/) and [Tutorial](./tutorial.md)');
 * // Returns: ['[Guide](/posts/guide/)', '[Tutorial](./tutorial.md)']
 * ```
 */
function extractCurrentLinks(content: string): string[] {
	const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
	const links: string[] = [];
	let match;
	
	while ((match = linkPattern.exec(content)) !== null) {
		const [fullMatch, anchor, url] = match;
		if (url && (url.startsWith('/') || url.startsWith('./'))) {
			links.push(fullMatch);
		}
	}
	
	return links;
}

/**
 * Extracts the anchor text portion from a markdown link string.
 * Parses the link format [anchor](url) to return just the anchor text.
 * 
 * @param link - Complete markdown link string
 * @returns The anchor text or empty string if no match
 * 
 * @example
 * ```typescript
 * const anchor = extractAnchorText('[React Guide](/posts/react-guide/)');
 * // Returns: 'React Guide'
 * ```
 */
function extractAnchorText(link: string): string {
	const match = link.match(/\[([^\]]+)\]/);
	return match?.[1] ?? '';
}

/**
 * Finds relevant posts for internal linking based on content analysis and relevance scoring.
 * Filters out current post and already linked posts, then generates suggestions for top matches.
 * 
 * @param content - Content to analyze for linking opportunities
 * @param currentPost - Current post to exclude from suggestions
 * @param allPosts - All available posts to consider for linking
 * @param existingLinks - Array of existing link strings to avoid duplicates
 * @param maxSuggestions - Maximum number of suggestions to return
 * @returns Array of internal link suggestions sorted by relevance score
 * 
 * @example
 * ```typescript
 * const suggestions = findLinkingSuggestions(
 *   'React hooks tutorial content...',
 *   currentPost,
 *   allPosts,
 *   ['[existing](/link/)'],
 *   5
 * );
 * // Returns top 5 most relevant internal link suggestions
 * ```
 */
function findLinkingSuggestions(
	content: string,
	currentPost: any,
	allPosts: any[],
	existingLinks: string[],
	maxSuggestions: number
): InternalLinkSuggestion[] {
	const suggestions: InternalLinkSuggestion[] = [];
	const existingUrls = existingLinks.map(link => {
		const match = link.match(/\]\(([^)]+)\)/);
		return match ? match[1] : '';
	});
	
	// Filter out current post and already linked posts
	const candidatePosts = allPosts.filter(post => 
		post.slug !== currentPost.slug && 
		!existingUrls.includes(`/posts/${post.slug}/`)
	);
	
	candidatePosts.forEach(post => {
		const relevanceScore = calculateRelevanceScore(content, currentPost, post);
		
		if (relevanceScore > 0.3) { // Minimum relevance threshold
			const linkSuggestions = generateLinkSuggestionsForPost(content, post, relevanceScore);
			suggestions.push(...linkSuggestions);
		}
	});
	
	// Sort by relevance and return top suggestions
	return suggestions
		.sort((a, b) => b.relevanceScore - a.relevanceScore)
		.slice(0, maxSuggestions);
}

/**
 * Calculates relevance score between current content and a target post for internal linking.
 * Uses weighted algorithm considering tag overlap, category match, title keywords, and content mentions.
 * 
 * @param content - Current post content to analyze
 * @param currentPost - Current post object with metadata
 * @param targetPost - Target post to calculate relevance against
 * @returns Relevance score between 0 and 1, where 1 is most relevant
 * 
 * @example
 * ```typescript
 * const score = calculateRelevanceScore(
 *   'React hooks are powerful...',
 *   { data: { tags: ['react'], title: 'Hooks Guide' } },
 *   { data: { tags: ['react', 'hooks'], title: 'Advanced React' } }
 * );
 * // Returns: ~0.85 (high relevance due to tag overlap)
 * ```
 */
function calculateRelevanceScore(content: string, currentPost: any, targetPost: any): number {
	let score = 0;
	
	// Tag overlap (40% weight)
	const currentTags = new Set(currentPost.data.tags?.map((tag: string) => tag.toLowerCase()) || []);
	const targetTags = new Set(targetPost.data.tags?.map((tag: string) => tag.toLowerCase()) || []);
	const tagOverlap = intersection(currentTags, targetTags).size;
	const tagUnion = union(currentTags, targetTags).size;
	
	if (tagUnion > 0) {
		score += (tagOverlap / tagUnion) * 0.4;
	}
	
	// Category match (20% weight)
	const currentCategory = extractCategory(currentPost.id);
	const targetCategory = extractCategory(targetPost.id);
	
	if (currentCategory && targetCategory && currentCategory === targetCategory) {
		score += 0.2;
	}
	
	// Title keyword overlap (20% weight)
	const currentTitle = currentPost.data.title.toLowerCase();
	const targetTitle = targetPost.data.title.toLowerCase();
	const titleWords = new Set(currentTitle.split(/\s+/).filter((word: string) => word.length > 3));
	const targetWords = new Set(targetTitle.split(/\s+/).filter((word: string) => word.length > 3));
	const titleOverlap = intersection(titleWords, targetWords).size;
	
	if (titleWords.size > 0) {
		score += (titleOverlap / titleWords.size) * 0.2;
	}
	
	// Content keyword mentions (20% weight)
	const targetKeywords = extractKeywords(targetPost.data.title, targetPost.data.tags || []);
	const keywordMentions = targetKeywords.filter(keyword => 
		content.includes(keyword.toLowerCase())
	).length;
	
	if (targetKeywords.length > 0) {
		score += (keywordMentions / targetKeywords.length) * 0.2;
	}
	
	return Math.min(score, 1); // Cap at 1.0
}

/**
 * Generates specific anchor text suggestions for linking to a target post.
 * Creates both exact keyword matches and semantic phrase suggestions with context.
 * 
 * @param content - Content to find linking opportunities in
 * @param targetPost - Post to generate link suggestions for
 * @param relevanceScore - Calculated relevance score for the target post
 * @returns Array of specific link suggestions with anchor text and context
 * 
 * @example
 * ```typescript
 * const suggestions = generateLinkSuggestionsForPost(
 *   'Learn about React hooks in our guide...',
 *   { slug: 'react-hooks', data: { title: 'React Hooks Guide', tags: ['react'] } },
 *   0.8
 * );
 * // Returns suggestions for linking 'React hooks' to the target post
 * ```
 */
function generateLinkSuggestionsForPost(
	content: string,
	targetPost: any,
	relevanceScore: number
): InternalLinkSuggestion[] {
	const suggestions: InternalLinkSuggestion[] = [];
	const targetUrl = `/posts/${targetPost.slug}/`;
	const targetTitle = targetPost.data.title;
	const targetKeywords = extractKeywords(targetTitle, targetPost.data.tags || []);
	
	// Find exact keyword matches
	targetKeywords.forEach(keyword => {
		const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'gi');
		let match;
		
		while ((match = regex.exec(content)) !== null) {
			const position = match.index;
			const context = extractContext(content, position, 100);
			
			suggestions.push({
				anchor: keyword,
				targetUrl,
				targetTitle,
				relevanceScore,
				context,
				linkType: 'exact',
				position
			});
		}
	});
	
	// Generate semantic suggestions
	const semanticPhrases = generateSemanticPhrases(targetTitle, targetPost.data.tags || []);
	semanticPhrases.forEach(phrase => {
		if (content.toLowerCase().includes(phrase.toLowerCase())) {
			const position = content.toLowerCase().indexOf(phrase.toLowerCase());
			const context = extractContext(content, position, 100);
			
			suggestions.push({
				anchor: phrase,
				targetUrl,
				targetTitle,
				relevanceScore: relevanceScore * 0.8, // Lower score for semantic matches
				context,
				linkType: 'semantic',
				position
			});
		}
	});
	
	// Return unique suggestions (avoid duplicates)
	const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
		index === self.findIndex(s => s.anchor === suggestion.anchor && s.position === suggestion.position)
	);
	
	return uniqueSuggestions.slice(0, 2); // Max 2 suggestions per post
}

/**
 * Extracts meaningful keywords from title and tags for internal linking analysis.
 * Filters out common Spanish stop words and short words that aren't useful for linking.
 * 
 * @param title - Post title to extract keywords from
 * @param tags - Array of post tags
 * @returns Array of cleaned keywords suitable for link anchor text
 * 
 * @example
 * ```typescript
 * const keywords = extractKeywords('Cómo usar React Hooks', ['react', 'tutorial']);
 * // Returns: ['usar', 'React', 'Hooks', 'react', 'tutorial']
 * ```
 */
function extractKeywords(title: string, tags: string[]): string[] {
	const titleWords = title.split(/\s+/)
		.filter(word => word.length > 3)
		.filter(word => !['como', 'para', 'con', 'una', 'del', 'las', 'los', 'por', 'que'].includes(word.toLowerCase()));
	
	return [...titleWords, ...tags].map(keyword => keyword.trim());
}

/**
 * Generates semantic phrases for more natural internal linking opportunities.
 * Creates variations like 'tutorial de X', 'guía de Y', etc. based on title and tags.
 * 
 * @param title - Post title to base phrases on
 * @param tags - Post tags to create semantic variations
 * @returns Array of natural language phrases suitable for link anchor text
 * 
 * @example
 * ```typescript
 * const phrases = generateSemanticPhrases('React Hooks Guide', ['react', 'hooks']);
 * // Returns: ['React Hooks Guide', 'tutorial de react', 'guía de hooks', ...]
 * ```
 */
function generateSemanticPhrases(title: string, tags: string[]): string[] {
	const phrases: string[] = [];
	
	// Add variations of the title
	phrases.push(title);
	
	// Add tag-based phrases
	tags.forEach(tag => {
		phrases.push(`tutorial de ${tag}`);
		phrases.push(`guía de ${tag}`);
		phrases.push(`cómo usar ${tag}`);
		phrases.push(`${tag} paso a paso`);
	});
	
	return phrases;
}

/**
 * Extracts surrounding context from text around a specific position for link suggestions.
 * Provides context to help understand where a link would be placed in the content.
 * 
 * @param text - The full text content
 * @param position - Character position to center the context around
 * @param radius - Number of characters to include before and after position
 * @returns Trimmed context string around the specified position
 * 
 * @example
 * ```typescript
 * const context = extractContext('This is a long text with React hooks example', 25, 10);
 * // Returns: 'xt with React hooks ex' (centered around position 25)
 * ```
 */
function extractContext(text: string, position: number, radius: number): string {
	const start = Math.max(0, position - radius);
	const end = Math.min(text.length, position + radius);
	return text.substring(start, end).trim();
}

/**
 * Extracts category information from a post ID path structure.
 * Assumes post IDs follow the pattern 'category/post-name' format.
 * 
 * @param id - Post ID string that may contain category information
 * @returns Category name if found, null if post is not in a category
 * 
 * @example
 * ```typescript
 * const category = extractCategory('sql/advanced-queries.md');
 * // Returns: 'sql'
 * 
 * const noCategory = extractCategory('standalone-post.md');
 * // Returns: null
 * ```
 */
function extractCategory(id: string): string | null {
	const parts = id.split('/');
	return parts.length > 1 ? parts[0] ?? null : null;
}

/**
 * Escapes special regex characters in a string to make it safe for use in RegExp.
 * Prevents regex injection and ensures literal string matching.
 * 
 * @param string - String that may contain regex special characters
 * @returns String with regex special characters escaped
 * 
 * @example
 * ```typescript
 * const escaped = escapeRegex('React (hooks)');
 * // Returns: 'React \\(hooks\\)'
 * ```
 */
function escapeRegex(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Calculates the intersection of two sets (elements present in both sets).
 * Helper function for tag overlap calculations in relevance scoring.
 * 
 * @param setA - First set
 * @param setB - Second set
 * @returns New set containing elements present in both input sets
 * 
 * @example
 * ```typescript
 * const set1 = new Set(['react', 'hooks']);
 * const set2 = new Set(['react', 'javascript']);
 * const common = intersection(set1, set2);
 * // Returns: Set(['react'])
 * ```
 */
function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
	return new Set([...setA].filter(x => setB.has(x)));
}

/**
 * Calculates the union of two sets (all unique elements from both sets).
 * Helper function for tag analysis calculations in relevance scoring.
 * 
 * @param setA - First set
 * @param setB - Second set
 * @returns New set containing all unique elements from both input sets
 * 
 * @example
 * ```typescript
 * const set1 = new Set(['react', 'hooks']);
 * const set2 = new Set(['react', 'javascript']);
 * const all = union(set1, set2);
 * // Returns: Set(['react', 'hooks', 'javascript'])
 * ```
 */
function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
	return new Set([...setA, ...setB]);
}

/**
 * Generates actionable recommendations for improving internal linking strategy.
 * Analyzes current link density, anchor text variety, and available suggestions.
 * 
 * @param suggestions - Array of available internal link suggestions
 * @param linkDensity - Current link density percentage in content
 * @param anchorTextVariety - Percentage of unique anchor texts used
 * @returns Array of actionable recommendations for link optimization
 * 
 * @example
 * ```typescript
 * const opportunities = generateLinkingOpportunities(
 *   suggestions,
 *   0.5,  // Low link density
 *   60    // Moderate anchor variety
 * );
 * // Returns: ['🔗 Densidad de enlaces baja: considera añadir más enlaces internos']
 * ```
 */
function generateLinkingOpportunities(
	suggestions: InternalLinkSuggestion[],
	linkDensity: number,
	anchorTextVariety: number
): string[] {
	const opportunities: string[] = [];
	
	// Link density analysis
	if (linkDensity < 1) {
		opportunities.push('🔗 Densidad de enlaces baja: considera añadir más enlaces internos (objetivo: 1-3%)');
	} else if (linkDensity > 5) {
		opportunities.push('⚠️ Demasiados enlaces internos: reduce la densidad para evitar spam');
	}
	
	// Anchor text variety
	if (anchorTextVariety < 70) {
		opportunities.push('📝 Varía más el texto ancla de los enlaces para mejor SEO');
	}
	
	// Suggestion-based opportunities
	if (suggestions.length === 0) {
		opportunities.push('🔍 No se encontraron oportunidades de enlaces internos automáticas');
	} else {
		opportunities.push(`💡 ${suggestions.length} oportunidades de enlaces internos detectadas`);
	}
	
	// Quality suggestions
	const highQualitySuggestions = suggestions.filter(s => s.relevanceScore > 0.7);
	if (highQualitySuggestions.length > 0) {
		opportunities.push(`⭐ ${highQualitySuggestions.length} oportunidades de alta relevancia encontradas`);
	}
	
	return opportunities;
}