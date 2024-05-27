import { defineCollection, z } from 'astro:content';

const tagSchema = z.object({
		name: z.string(),
		bgColorHex: z.string(),
		fontColorHex: z.string()
})

const blog = defineCollection({
	type: 'content',
	// Type-check frontmatter using a schema
	schema: z.object({
		title: z.string(),
		description: z.string(),
		// Transform string to Date object
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		tags: tagSchema.array().optional()
	}),
});

export const collections = { blog };
