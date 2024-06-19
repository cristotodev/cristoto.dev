export interface Project {
    id: string
	title: string
    description: string
	url: string
	img: string
	tags: Array<{
		name: string,
		bgColorHex: string,
		fontColorHex: string
	}>
}