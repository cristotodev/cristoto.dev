const { pipeline } = require('@xenova/transformers');
const fs = require('fs/promises');
const path = require('path');
const { glob } = require('glob');
const matter = require('gray-matter');

// Función para extraer contenido de un post
async function extractPostContent(filePath) {
	try {
		const content = await fs.readFile(filePath, 'utf-8');
		const { data: frontmatter, content: body } = matter(content);
		
		// Extraer texto limpio del markdown
		const cleanContent = body
			.replace(/```[\s\S]*?```/g, '') // Remover bloques de código
			.replace(/`[^`]+`/g, '') // Remover código inline
			.replace(/!\[.*?\]\(.*?\)/g, '') // Remover imágenes
			.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Mantener solo texto de enlaces
			.replace(/#{1,6}\s+/g, '') // Remover headers markdown
			.replace(/\*\*([^*]+)\*\*/g, '$1') // Remover bold
			.replace(/\*([^*]+)\*/g, '$1') // Remover italic
			.replace(/\n+/g, ' ') // Unir líneas
			.trim();

		const searchableText = `${frontmatter.title} ${frontmatter.description || ''} ${cleanContent}`;
		
		// Extract the relative path from src/content/post/ to match Astro's slug generation
		const relativePath = path.relative(path.join(__dirname, '..', 'src', 'content', 'post'), filePath);
		const slug = relativePath.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/');

		return {
			slug: slug,
			title: frontmatter.title,
			description: frontmatter.description || '',
			content: searchableText,
			tags: frontmatter.tags || [],
			publishDate: frontmatter.publishDate
		};
	} catch (error) {
		return null;
	}
}

async function generateEmbeddings() {
	// Inicializar el pipeline de embeddings
	const extractor = await pipeline('feature-extraction', 'Xenova/multilingual-e5-small');
	
	// Obtener todos los posts
	const postFiles = await glob('src/content/post/**/*.{md,mdx}', { cwd: path.join(__dirname, '..') });
	
	const embeddings = [];
	
	for (const filePath of postFiles) {
		const fullPath = path.join(__dirname, '..', filePath);
		
		const postData = await extractPostContent(fullPath);
		if (!postData) continue;
		
		// Generar embedding para el contenido del post
		const output = await extractor(postData.content, {
			pooling: 'mean',
			normalize: true,
		});
		
		embeddings.push({
			...postData,
			embedding: Array.from(output.data)
		});
	}
	
	// Guardar embeddings en archivo JSON
	const outputPath = path.join(__dirname, '..', 'public', 'embeddings.json');
	await fs.writeFile(outputPath, JSON.stringify(embeddings, null, 2));
	
}

// Ejecutar si se llama directamente
if (require.main === module) {
	generateEmbeddings().catch(() => {});
}

module.exports = { generateEmbeddings };