export declare interface Character {
	created: string,
	episode: string[],
	gender: string,
	id: number,
	image: string,
	location: {
		name: string,
		url: string
	},
	name: string,
	origin: {
		name: string,
		url: string
	},
	species: string,
	status: string,
	type: string,
	url: string
}

export declare interface ApiResponse {
	info: {
		count: number,
		next: string | null,
		pages: number,
		prev: string | null
	},
	results: Character[]
}