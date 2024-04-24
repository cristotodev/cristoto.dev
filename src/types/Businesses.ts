type BusinessId =
	| "atecresa"
	| "dareplanet"
	| "devoteam"
	| "masmovil"
type BusinessName =
	| "Atecresa"
	| "DarePlanet"
	| "Devoteam"
	| "MasMovil"

export interface Businesses {
	id: BusinessId
	name: BusinessName
	url: string
	image: {
		width: number
		height: number
	}
}