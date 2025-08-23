import { toString as mdastToString } from "mdast-util-to-string";
import getReadingTime from "reading-time";

/**
 * Remark plugin that calculates and adds reading time estimation to frontmatter.
 * Uses the reading-time library to estimate how long it takes to read the content.
 * 
 * @returns Unified plugin function that processes the markdown AST and adds reading time
 * 
 * @example
 * ```typescript
 * // In astro.config.ts:
 * remarkPlugins: [remarkReadingTime]
 * 
 * // Adds readingTime to frontmatter:
 * // frontmatter.readingTime = "5 min read"
 * ```
 */
export function remarkReadingTime() {
	/**
	 * Plugin transformer function that processes the AST and calculates reading time.
	 * 
	 * @param tree - The markdown AST tree
	 * @param param1 - Remark processor context containing frontmatter data
	 * @param param1.data - Data object with Astro frontmatter access
	 */
	// @ts-expect-error:next-line
	return (tree, { data }) => {
		const textOnPage = mdastToString(tree);
		const readingTime = getReadingTime(textOnPage);
		data.astro.frontmatter.readingTime = readingTime.text;
	};
}
