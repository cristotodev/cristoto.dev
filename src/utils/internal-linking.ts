/**
 * Internal linking utilities for better SEO and user experience
 */

export interface RelatedPost {
	id: string;
	title: string;
	description: string;
	tags: string[];
	url: string;
	relevanceScore: number;
}

export interface LinkSuggestion {
	anchor: string;
	targetPost: RelatedPost;
	position: number;
	confidence: number;
}

/**
 * Calculate relevance score between posts
 */
export function calculateRelevance(
	currentPost: { tags: string[]; title: string; id: string },
	otherPost: { tags: string[]; title: string; id: string }
): number {
	if (currentPost.id === otherPost.id) return 0;
	
	let score = 0;
	
	// Tag overlap (highest weight)
	const commonTags = currentPost.tags.filter(tag => 
		otherPost.tags.some(otherTag => otherTag.toLowerCase() === tag.toLowerCase())
	);
	score += commonTags.length * 0.4;
	
	// Category similarity (same first folder)
	const currentCategory = currentPost.id.split('/')[0];
	const otherCategory = otherPost.id.split('/')[0];
	if (currentCategory === otherCategory) {
		score += 0.3;
	}
	
	// Title keyword similarity
	const currentWords = currentPost.title.toLowerCase().split(/\s+/)
		.filter(word => word.length > 3)
		.filter(word => !['para', 'con', 'una', 'del', 'las', 'los', 'como', 'que'].includes(word));
	
	const otherWords = otherPost.title.toLowerCase().split(/\s+/)
		.filter(word => word.length > 3)
		.filter(word => !['para', 'con', 'una', 'del', 'las', 'los', 'como', 'que'].includes(word));
	
	const commonWords = currentWords.filter(word => otherWords.includes(word));
	score += commonWords.length * 0.2;
	
	// Boost for sequential content (part 1, part 2, etc.)
	const currentMatch = currentPost.title.match(/parte?\s*(\d+)/i);
	const otherMatch = otherPost.title.match(/parte?\s*(\d+)/i);
	if (currentMatch?.[1] && otherMatch?.[1]) {
		const diff = Math.abs(parseInt(currentMatch[1]) - parseInt(otherMatch[1]));
		if (diff === 1) score += 0.5; // Adjacent parts
		if (diff <= 3) score += 0.2;  // Nearby parts
	}
	
	return Math.min(score, 1); // Cap at 1.0
}

/**
 * Find related posts for a given post
 */
export function findRelatedPosts(
	currentPost: { tags: string[]; title: string; id: string; description?: string },
	allPosts: Array<{ tags: string[]; title: string; id: string; data: any }>,
	maxResults: number = 5
): RelatedPost[] {
	return allPosts
		.map(post => ({
			id: post.id,
			title: post.data.title,
			description: post.data.description || '',
			tags: post.data.tags || [],
			url: `/posts/${post.id}/`,
			relevanceScore: calculateRelevance(currentPost, {
				id: post.id,
				title: post.data.title,
				tags: post.data.tags || []
			})
		}))
		.filter(post => post.relevanceScore > 0.2)
		.sort((a, b) => b.relevanceScore - a.relevanceScore)
		.slice(0, maxResults);
}

/**
 * Suggest internal links within content
 */
export function suggestInternalLinks(
	content: string,
	currentPost: { tags: string[]; title: string; id: string },
	allPosts: Array<{ tags: string[]; title: string; id: string; data: any }>,
	maxSuggestions: number = 3
): LinkSuggestion[] {
	const suggestions: LinkSuggestion[] = [];
	const relatedPosts = findRelatedPosts(currentPost, allPosts, 10);
	
	// Look for potential anchor texts in content
	for (const relatedPost of relatedPosts) {
		// Check for exact title matches
		const titleRegex = new RegExp(`\\b${escapeRegExp(relatedPost.title)}\\b`, 'gi');
		let match;
		
		while ((match = titleRegex.exec(content)) !== null) {
			suggestions.push({
				anchor: match[0],
				targetPost: relatedPost,
				position: match.index,
				confidence: 0.9
			});
		}
		
		// Check for tag-based anchor opportunities
		for (const tag of relatedPost.tags) {
			if (tag.length < 4) continue; // Skip short tags
			
			const tagRegex = new RegExp(`\\b${escapeRegExp(tag)}\\b`, 'gi');
			let tagMatch;
			
			while ((tagMatch = tagRegex.exec(content)) !== null) {
				// Avoid duplicating anchors too close to each other
				const tooClose = suggestions.some(s => 
					Math.abs(s.position - tagMatch!.index) < 100
				);
				
				if (!tooClose) {
					suggestions.push({
						anchor: tagMatch[0],
						targetPost: relatedPost,
						position: tagMatch.index,
						confidence: 0.6 * relatedPost.relevanceScore
					});
				}
			}
		}
		
		// Check for keyword phrases
		const keywords = extractKeywords(relatedPost.title);
		for (const keyword of keywords) {
			if (keyword.length < 5) continue;
			
			const keywordRegex = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, 'gi');
			let keywordMatch;
			
			while ((keywordMatch = keywordRegex.exec(content)) !== null) {
				const tooClose = suggestions.some(s => 
					Math.abs(s.position - keywordMatch!.index) < 80
				);
				
				if (!tooClose) {
					suggestions.push({
						anchor: keywordMatch[0],
						targetPost: relatedPost,
						position: keywordMatch.index,
						confidence: 0.4 * relatedPost.relevanceScore
					});
				}
			}
		}
	}
	
	// Sort by confidence and position, then take top suggestions
	return suggestions
		.sort((a, b) => {
			if (Math.abs(a.confidence - b.confidence) > 0.1) {
				return b.confidence - a.confidence;
			}
			return a.position - b.position; // Prefer earlier in content
		})
		.slice(0, maxSuggestions);
}

/**
 * Extract keywords from title for linking opportunities
 */
function extractKeywords(title: string): string[] {
	const stopWords = [
		'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'es', 'se', 'no', 'te', 'lo', 'le',
		'da', 'su', 'por', 'son', 'con', 'para', 'al', 'del', 'los', 'las', 'una', 'como',
		'más', 'pero', 'sus', 'me', 'ya', 'muy', 'mi', 'sin', 'sobre', 'este', 'ser', 'todo'
	];
	
	return title
		.toLowerCase()
		.split(/\s+/)
		.filter(word => word.length > 3)
		.filter(word => !stopWords.includes(word))
		.filter(word => !/^\d+$/.test(word)); // No numbers
}

/**
 * Escape regex special characters
 */
function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate contextual anchor text suggestions
 */
export function generateAnchorText(
	originalText: string,
	targetPost: RelatedPost,
	context: 'exact' | 'descriptive' | 'call-to-action' = 'descriptive'
): string {
	switch (context) {
		case 'exact':
			return originalText;
			
		case 'call-to-action':
			return `Aprende más sobre ${originalText.toLowerCase()}`;
			
		case 'descriptive':
		default:
			// If original text is very short, enhance it
			if (originalText.length < 10) {
				const category = targetPost.url.split('/')[2] || '';
				return `${originalText} en ${category}`;
			}
			return originalText;
	}
}

/**
 * Generate related posts recommendation text
 */
export function generateRelatedPostsSection(relatedPosts: RelatedPost[]): string {
	if (relatedPosts.length === 0) return '';
	
	const recommendations = relatedPosts
		.slice(0, 3)
		.map(post => `- [${post.title}](${post.url})`)
		.join('\n');
		
	return `## Posts Relacionados\n\n${recommendations}`;
}