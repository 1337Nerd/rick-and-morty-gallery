import React from "react"
import { Character } from "../types"

const CardComponent = ({ character }: { character: Character }) => {
	const getStatusColor = (status) => {
		if (status === 'Alive')
			return 'text-green-600 dark:text-green-400'
		if (status === 'Dead')
			return 'text-red-600 dark:text-red-400'
		return 'text-yellow-600 dark:text-yellow-400'
	}
	return (
		<div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 will-change-transform max-w-sm w-full mx-auto">
			<img
				src={character.image}
				alt={character.name} 
		        className="w-full h-48 object-cover"
				loading="lazy"
				decoding="async"
			/>
			<div className="p-4">
				<h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">{character.name}</h2>
				<div className="space-y-2">
					<p className="text-sm">
						<span className="font-semibold text-gray-600 dark:text-gray-400">Species:</span>
						<span className="ml-1 text-gray-700 dark:text-gray-300">{character.species}</span>
					</p>
					<p className="text-sm">
						<span className="font-semibold text-gray-600 dark:text-gray-400">Status:</span>
						<span className={`ml-1 capitalize ${getStatusColor(character.status)}`}>
							{character.status}
						</span>
					</p>
					<p className="text-sm">
						<span className="font-semibold text-gray-600 dark:text-gray-400">Gender:</span>
						<span className="ml-1 text-gray-700 dark:text-gray-300">{character.gender}</span>
					</p>
					<p className="text-sm">
						<span className="font-semibold text-gray-600 dark:text-gray-400">Created:</span>
						<span className="ml-1 text-gray-700 dark:text-gray-300">
							{new Date(character.created).toLocaleString(navigator.language, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
						</span>
					</p>
				</div>
			</div>
		</div>
	)
}
export default CardComponent