type BusinessName =
	| "Atecresa"
	| "DarePlanet"
	| "Devoteam"
	| "MasMovil"
	| "MasOrange"

export interface Businesses {
	name: BusinessName
	url: string
	imageUrl: string
	image: {
		width: number
		height: number
	}
}