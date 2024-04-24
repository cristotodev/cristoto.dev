type ProjectId =
	| "speed"

type ProjectTags = 
	| "javascript"
	| "typescript"
	| "vue"
	| "astro"

export interface Project {
    id: ProjectId
	title: string
    description: string
	url: string
	tags: Array<{
		name: ProjectTags,
		bgColorHex: string,
		fontColorHex: string
	}>
}