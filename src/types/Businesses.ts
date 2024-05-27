type BusinessId =
	| "atecresa"
	| "dareplanet"
	| "devoteam"
	| "masmovil"
	| "masorange"
type BusinessName =
	| "Atecresa"
	| "DarePlanet"
	| "Devoteam"
	| "MasMovil"
	| "MasOrange"

export interface Businesses {
	id: BusinessId
	name: BusinessName
	url: string
	image: {
		width: number
		height: number
	}
}