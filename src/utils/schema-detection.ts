/**
 * Schema detection utilities for automatic SEO markup
 */

export interface DetectedSchema {
	type: 'faq' | 'howto' | 'code' | 'none';
	confidence: number;
	data?: any;
}

/**
 * Detect FAQ content in a post
 */
export function detectFAQ(content: string): { questions: Array<{question: string, answer: string}>, confidence: number } {
	const faqPatterns = [
		/¿([^?]+\?)\s*\n?([^¿]*?)(?=¿|$)/g,
		/(?:Q|Pregunta):\s*([^?]+\?)\s*\n?(?:A|Respuesta):\s*([^\n\r]*)/gi,
		/(?:^|\n)#+\s*¿([^?]+\?)\s*\n([^#]*?)(?=\n#|$)/gm
	];
	
	let questions: Array<{question: string, answer: string}> = [];
	let maxConfidence = 0;
	
	for (const pattern of faqPatterns) {
		const matches = [...content.matchAll(pattern)];
		if (matches.length > 0) {
			const confidence = Math.min(matches.length * 0.3, 1);
			if (confidence > maxConfidence) {
				maxConfidence = confidence;
				questions = matches.map(match => ({
					question: match[1]?.trim() || 'Sin pregunta',
					answer: match[2]?.trim().replace(/\n+/g, ' ').substring(0, 300) || 'Sin respuesta'
				}));
			}
		}
	}
	
	return { questions: questions.slice(0, 5), confidence: maxConfidence };
}

/**
 * Detect HowTo/Tutorial content in a post
 */
export function detectHowTo(content: string, title: string): { steps: Array<{name: string, text: string}>, confidence: number } {
	const howToIndicators = [
		/cómo|como|tutorial|guía|paso a paso|instrucciones/i,
		/\b(?:step|paso)\s*\d+/gi,
		/(?:^|\n)#+\s*(?:paso|step)\s*\d+/gim,
		/(?:^|\n)\d+\.\s+([^\n]+)/gm
	];
	
	let confidence = 0;
	let steps: Array<{name: string, text: string}> = [];
	
	// Check title for HowTo indicators
	if (howToIndicators[0] && howToIndicators[0].test(title)) {
		confidence += 0.4;
	}
	
	// Check for numbered steps
	const stepPattern = howToIndicators[3];
	if (stepPattern) {
		const stepMatches = [...content.matchAll(stepPattern)];
		if (stepMatches.length >= 2) {
			confidence += Math.min(stepMatches.length * 0.2, 0.6);
			steps = stepMatches.slice(0, 8).map((match, index) => {
				const fullText = match[1]?.trim() || '';
				// Extract title from text (text before first colon or period)
				const titleMatch = fullText.match(/^([^:.]+)[:.]/);
				const stepTitle = titleMatch ? titleMatch[1]?.trim() : `Paso ${index + 1}`;
				// Extract description (text after first colon or the full text if no colon)
				const description = titleMatch ? fullText.replace(titleMatch[0], '').trim() : fullText;
				
				return {
					name: stepTitle || `Paso ${index + 1}`,
					text: description || fullText
				};
			});
		}
	}
	
	// Check for step headers
	const headerPattern = howToIndicators[2];
	if (headerPattern) {
		const headerSteps = [...content.matchAll(headerPattern)];
		if (headerSteps.length > 0 && headerSteps.length > steps.length) {
			steps = headerSteps.slice(0, 8).map((match) => {
				const fullText = match[0]?.replace(/#+\s*/, '').trim() || '';
				// Extract title from text (text before first colon)
				const titleMatch = fullText.match(/^([^:]+):/);
				const stepTitle = titleMatch ? titleMatch[1]?.trim() : fullText;
				// Extract description (text after first colon)
				const description = titleMatch ? fullText.replace(titleMatch[0], '').trim() : '';
				
				return {
					name: stepTitle || 'Paso',
					text: description || `Detalles del ${stepTitle?.toLowerCase() || 'paso'}`
				};
			});
			confidence = Math.max(confidence, Math.min(headerSteps.length * 0.25, 0.8));
		}
	}
	
	return { steps, confidence };
}

/**
 * Detect code-heavy content
 */
export function detectCode(content: string, tags: string[] = []): { 
	programmingLanguage: string, 
	codeBlocks: number, 
	confidence: number 
} {
	const codeBlockPattern = /```(\w+)?\n([\s\S]*?)```/g;
	const codeBlocks = [...content.matchAll(codeBlockPattern)];
	
	const programmingLanguages = [
		'javascript', 'typescript', 'python', 'java', 'csharp', 'cpp', 'c',
		'rust', 'go', 'php', 'ruby', 'swift', 'kotlin', 'sql', 'html', 'css',
		'bash', 'shell', 'json', 'xml', 'yaml', 'dockerfile'
	];
	
	let detectedLang = 'javascript'; // default
	let confidence = 0;
	
	// Check tags for programming languages
	const langFromTags = tags.find(tag => 
		programmingLanguages.some(lang => 
			tag.toLowerCase().includes(lang) || lang.includes(tag.toLowerCase())
		)
	);
	
	if (langFromTags) {
		detectedLang = langFromTags.toLowerCase();
		confidence += 0.3;
	}
	
	// Check code block languages
	if (codeBlocks.length > 0) {
		confidence += Math.min(codeBlocks.length * 0.2, 0.6);
		
		const languages = codeBlocks
			.map(match => match[1])
			.filter(Boolean)
			.filter((lang): lang is string => typeof lang === 'string')
			.reduce((acc, lang) => {
				acc[lang] = (acc[lang] || 0) + 1;
				return acc;
			}, {} as Record<string, number>);
			
		const mostCommon = Object.entries(languages)
			.sort(([,a], [,b]) => b - a)[0];
			
		if (mostCommon) {
			detectedLang = mostCommon[0];
		}
	}
	
	// Check inline code frequency
	const inlineCodeCount = (content.match(/`[^`]+`/g) || []).length;
	if (inlineCodeCount > 5) {
		confidence += 0.1;
	}
	
	return {
		programmingLanguage: detectedLang,
		codeBlocks: codeBlocks.length,
		confidence: Math.min(confidence, 1)
	};
}

/**
 * Main schema detection function
 */
export function detectSchema(content: string, title: string, tags: string[] = []): DetectedSchema {
	// FAQ detection disabled by user request
	// const faqResult = detectFAQ(content);
	const howToResult = detectHowTo(content, title);
	const codeResult = detectCode(content, tags);
	
	const results = [
		// { type: 'faq' as const, confidence: faqResult.confidence, data: faqResult.questions },
		{ type: 'howto' as const, confidence: howToResult.confidence, data: howToResult.steps },
		{ type: 'code' as const, confidence: codeResult.confidence, data: codeResult }
	];
	
	// Return the schema type with highest confidence (minimum threshold: 0.3)
	const bestMatch = results
		.filter(r => r.confidence >= 0.3)
		.sort((a, b) => b.confidence - a.confidence)[0];
	
	return bestMatch || { type: 'none', confidence: 0 };
}