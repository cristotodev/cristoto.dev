import type { AdmonitionType } from "@/types";
import { type Properties, h as _h } from "hastscript";
import type { Node, Paragraph as P, Parent, PhrasingContent, Root } from "mdast";
import type { Directives, LeafDirective, TextDirective } from "mdast-util-directive";
import { directiveToMarkdown } from "mdast-util-directive";
import { toMarkdown } from "mdast-util-to-markdown";
import { toString as mdastToString } from "mdast-util-to-string";
import type { Plugin } from "unified";
import { visit } from "unist-util-visit";

// Supported admonition types
const Admonitions = new Set<AdmonitionType>(["tip", "note", "important", "caution", "warning"]);

/**
 * Type guard function that checks if a string matches one of the supported admonition types.
 * 
 * @param s - String to check against supported admonition types
 * @returns True if the string is a valid admonition type, false otherwise
 * 
 * @example
 * ```typescript
 * isAdmonition('tip'); // Returns: true
 * isAdmonition('invalid'); // Returns: false
 * ```
 */
function isAdmonition(s: string): s is AdmonitionType {
	return Admonitions.has(s as AdmonitionType);
}

/**
 * Type guard function that determines if a markdown AST node is a directive node.
 * Checks for container, leaf, or text directive types used for admonitions.
 * 
 * @param node - Markdown AST node to check
 * @returns True if the node is any type of directive, false otherwise
 * 
 * @example
 * ```typescript
 * const node = { type: 'containerDirective', name: 'tip' };
 * isNodeDirective(node); // Returns: true
 * ```
 */
function isNodeDirective(node: Node): node is Directives {
	return (
		node.type === "containerDirective" ||
		node.type === "leafDirective" ||
		node.type === "textDirective"
	);
}

/**
 * Transforms unsupported directive nodes back to their original markdown form.
 * Prevents breaking user content when encountering unknown directive types.
 * Based on implementation from Astro Starlight.
 * 
 * @param node - The directive node to transform back to markdown
 * @param index - Position of the node in the parent's children array
 * @param parent - Parent AST node containing the directive
 * 
 * @example
 * ```typescript
 * // Converts unsupported directive back to original text like:
 * // ::unsupported[title] -> ::unsupported[title] (as text node)
 * ```
 */
function transformUnhandledDirective(
	node: LeafDirective | TextDirective,
	index: number,
	parent: Parent,
) {
	const textNode = {
		type: "text",
		value: toMarkdown(node, { extensions: [directiveToMarkdown()] }),
	} as const;
	if (node.type === "textDirective") {
		parent.children[index] = textNode;
	} else {
		parent.children[index] = {
			children: [textNode],
			type: "paragraph",
		};
	}
}

/**
 * Creates an mdast HTML tree node that will be converted to HTML by rehype.
 * Helper function for generating structured HTML elements in the AST.
 * Based on implementation from Astro Starlight.
 * 
 * @param el - HTML element tag name
 * @param attrs - HTML attributes and properties for the element
 * @param children - Array of child nodes to include in the element
 * @returns Paragraph node with HTML data for rehype processing
 * 
 * @example
 * ```typescript
 * const asideNode = h('aside', { class: 'admonition' }, [titleNode, contentNode]);
 * // Creates an aside element with class and children
 * ```
 */
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function h(el: string, attrs: Properties = {}, children: any[] = []): P {
	const { properties, tagName } = _h(el, attrs);
	return {
		children,
		data: { hName: tagName, hProperties: properties },
		type: "paragraph",
	};
}

/**
 * Remark plugin that transforms directive syntax into styled admonition blocks.
 * Converts container directives like `:::tip` into HTML aside elements with appropriate styling.
 * Supports tip, note, important, caution, and warning admonition types.
 * 
 * @returns Unified plugin function that processes the markdown AST
 * 
 * @example
 * ```markdown
 * :::tip[Custom Title]
 * This is a tip admonition with custom title
 * :::
 * 
 * // Becomes:
 * <aside class="aside aside-tip">
 *   <p class="aside-title">Custom Title</p>
 *   <div class="aside-content">This is a tip admonition with custom title</div>
 * </aside>
 * ```
 */
export const remarkAdmonitions: Plugin<[], Root> = () => (tree) => {
	visit(tree, (node, index, parent) => {
		if (!parent || index === undefined || !isNodeDirective(node)) return;
		if (node.type === "textDirective" || node.type === "leafDirective") {
			transformUnhandledDirective(node, index, parent);
			return;
		}

		const admonitionType = node.name;
		if (!isAdmonition(admonitionType)) return;

		let title: string = admonitionType;
		let titleNode: PhrasingContent[] = [{ type: "text", value: title }];

		// Check if there's a custom title
		const firstChild = node.children[0];
		if (
			firstChild?.type === "paragraph" &&
			firstChild.data &&
			"directiveLabel" in firstChild.data &&
			firstChild.children.length > 0
		) {
			titleNode = firstChild.children;
			title = mdastToString(firstChild.children);
			// The first paragraph contains a custom title, we can safely remove it.
			node.children.splice(0, 1);
		}

		// Do not change prefix to AD, ADM, or similar, adblocks will block the content inside.
		const aside = h("aside", { "aria-label": title, class: `aside aside-${admonitionType}` }, [
			h("p", { class: "aside-title", "aria-hidden": "true" }, [...titleNode]),
			h("div", { class: "aside-content" }, node.children),
		]);

		parent.children[index] = aside;
	});
};
