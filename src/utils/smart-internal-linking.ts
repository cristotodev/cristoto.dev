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
 * Analyze content for internal linking opportunities
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
 * Extract current internal links from content
 */
function extractCurrentLinks(content: string): string[] {
	const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
	const links: string[] = [];
	let match;
	
	while ((match = linkPattern.exec(content)) !== null) {
		const [fullMatch, anchor, url] = match;
		if (url.startsWith('/') || url.startsWith('./')) {
			links.push(fullMatch);
		}
	}
	
	return links;
}

/**
 * Extract anchor text from markdown link
 */
function extractAnchorText(link: string): string {
	const match = link.match(/\[([^\]]+)\]/);
	return match ? match[1] : '';
}

/**
 * Find internal linking suggestions
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
 * Calculate relevance score between current content and target post
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
	const titleWords = new Set(currentTitle.split(/\s+/).filter(word => word.length > 3));
	const targetWords = new Set(targetTitle.split(/\s+/).filter(word => word.length > 3));
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
 * Generate specific link suggestions for a post
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
 * Extract keywords from title and tags
 */
function extractKeywords(title: string, tags: string[]): string[] {
	const titleWords = title.split(/\s+/)
		.filter(word => word.length > 3)
		.filter(word => !['como', 'para', 'con', 'una', 'del', 'las', 'los', 'por', 'que'].includes(word.toLowerCase()));
	
	return [...titleWords, ...tags].map(keyword => keyword.trim());
}

/**
 * Generate semantic phrases for linking
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
 * Extract context around a position in text
 */
function extractContext(text: string, position: number, radius: number): string {
	const start = Math.max(0, position - radius);
	const end = Math.min(text.length, position + radius);
	return text.substring(start, end).trim();
}

/**
 * Extract category from post ID
 */
function extractCategory(id: string): string | null {
	const parts = id.split('/');
	return parts.length > 1 ? parts[0] : null;
}

/**
 * Escape regex special characters
 */
function escapeRegex(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Set intersection helper
 */
function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
	return new Set([...setA].filter(x => setB.has(x)));
}

/**
 * Set union helper
 */
function union<T>(setA: Set<T>, setB: Set<T>): Set<T> {
	return new Set([...setA, ...setB]);
}

/**
 * Generate linking opportunities and recommendations
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