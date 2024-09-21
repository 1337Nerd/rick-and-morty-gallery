import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ApiResponse, Character } from '../types'
import './index.css'
import Card from './Card'
import descendingIcon from './assets/descendingIcon'
import ascendingIcon from './assets/ascendingIcon'
import icon from './assets/icon'
import sun from './assets/sun'
import moon from './assets/moon'
import funnel from './assets/funnel'
import chevron from './assets/chevronDown'

const useFetchData = () => {
	const [data, setData] = useState<ApiResponse | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		const fetchData = async () => {
			try {
				let nextUrl = 'https://rickandmortyapi.com/api/character'
				let allResults: Character[] = []
				let info
				while (nextUrl) {
					const res = await fetch(nextUrl)
					if (!res.ok)
						throw new Error('Failed to fetch')
					const result = await res.json()
					info = result.info
					allResults = [...allResults, ...result.results]
					nextUrl = result.info.next
				}
				setData({ info, results: allResults })
			}
			catch (e) {
				setError(e.message)
			}
			finally {
				setLoading(false)
			}
		}
		fetchData()
	}, [])

	return { data, error, loading }
}

const useSortedAndFilteredData = (data: Character[] | undefined, sortOption: 'name' | 'created', sortDirection: 'asc' | 'desc', statusFilters: Record<string, boolean>) => {
	return useMemo(() => {
		if (!data)
			return []
		const sorted = data.filter(character => statusFilters[character.status]).sort((a, b) => {
			if (sortOption === 'created')
				return new Date(a.created).getTime() - new Date(b.created).getTime()
			return a.name.localeCompare(b.name)
		})
		return sortDirection === 'asc' ? sorted : sorted.reverse()
	}, [data, sortOption, sortDirection, statusFilters])
}

const useTheme = () => {
	const [isDarkMode, setIsDarkMode] = useState(() => {
		const savedTheme = localStorage.getItem('theme')
		return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
	})

	useEffect(() => {
		document.documentElement.classList.toggle('dark', isDarkMode)
		localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
	}, [isDarkMode])

	const toggleTheme = () => setIsDarkMode(!isDarkMode)

	return { isDarkMode, toggleTheme }
}

const FetchComponent: React.FC = () => {
	const { data, error, loading } = useFetchData()
	const [sortOption, setSortOption] = useState<'name' | 'created'>('name')
	const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
	const [statusFilters, setStatusFilters] = useState<Record<string, boolean>>({ Alive: true, Dead: true, unknown: true })
	const [visibleCount, setVisibleCount] = useState<number>(20)
	const [filterOpen, setFilterOpen] = useState<boolean>(false)
	const loadMoreRef = useRef(null)
	const { isDarkMode, toggleTheme } = useTheme()

	const sortedData = useSortedAndFilteredData(data?.results, sortOption, sortDirection, statusFilters)

	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting)
					setVisibleCount((prev) => prev + 20)
			},
			{ rootMargin: '-10% 0px 10% 0px' }
		)
		if (loadMoreRef.current)
			observer.observe(loadMoreRef.current)

		return () => observer.disconnect()
	}, [data])

	const handleSortChange = useCallback((option: 'name' | 'created') => {
		setSortOption(prev => {
			if (prev === option) {
				setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
				return prev
			}
			return option
		})
	}, [])
	
	const handleFilterChange = useCallback((status: string) => {
		setStatusFilters(prev => ({
			...prev,
			[status]: !prev[status]
		}))
	}, [])


	const handleFilterOpen = () => setFilterOpen(prev => !prev)

	const renderSortIcon = useCallback((option: 'name' | 'created') => {
		if (sortOption === option)
			return sortDirection === 'asc' ? ascendingIcon : descendingIcon
		return icon
	}, [sortOption, sortDirection])

	if (loading)
		return <h1 className="text-3xl font-bold py-6 text-center text-gray-800 dark:text-gray-100">Loading...</h1>
	if (error)
		return <h1 className="text-3xl font-bold py-6 text-center text-gray-800 dark:text-gray-100">{error}</h1>
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="flex flex-col md:flex-row items-center justify-between py-4">
				<div className="flex flex-row items-center space-x-4 mb-4 md:mb-0">
					<button type="button" onClick={() => handleSortChange('name')} className={`text-xl md:text-3xl font-bold transition-colors ${sortOption === 'name' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-100'}`}>
						Name {renderSortIcon('name')}
					</button>
					<button type="button" onClick={() => handleSortChange('created')} className={`text-xl md:text-3xl font-bold transition-colors ${sortOption === 'created' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-100'}`}>
						Created {renderSortIcon('created')}
					</button>
				</div>
				<h1 className="text-xl md:text-3xl font-bold mb-4 md:mb-0 text-center text-gray-800 dark:text-gray-100">
					Character Gallery
				</h1>
				<div className="flex flex-row items-center space-x-4 mb-4 md:mb-0">
					<div className="relative">
						<button type="button" onClick={handleFilterOpen} className="text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
							{funnel} Filters {chevron}
						</button>
						<div id="dropdown" className={`z-10 absolute origin-top-right mt-2 right-0 shadow-xl w-56 p-3 bg-white rounded-lg dark:bg-gray-700 ${filterOpen ? '' : 'hidden'}`}>
							<h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
								Status
							</h6>
							<ul className="space-y-2 text-sm">
								{['Alive', 'Dead', 'unknown'].map((status) => (
									<li className="flex items-center">
										<input id={status} type="checkbox" checked={statusFilters[status]} onChange={() => handleFilterChange(status)} value="" className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500 appearance-none p-0 inline-block checked:bg-blue-500 checked:bg-[url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9IiNmZmYiIHZpZXdCb3g9IjAgMCAxNiAxNiI+PHBhdGggZD0iTTEyLjIwNyA0Ljc5M2ExIDEgMCAwIDEgMCAxLjQxNGwtNSA1YTEgMSAwIDAgMS0xLjQxNCAwbC0yLTJhMSAxIDAgMCAxIDEuNDE0LTEuNDE0TDYuNSA5LjA4Nmw0LjI5My00LjI5M2ExIDEgMCAwIDEgMS40MTQgMHoiLz48L3N2Zz4=)]" />
										<label htmlFor={status} className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100 capitalize">
											{status}
										</label>
									</li>
								))}
							</ul>
						</div>
					</div>
					<button type="button" onClick={toggleTheme} className="text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-100">
						{isDarkMode ? sun : moon}
					</button>
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
				{sortedData.slice(0, visibleCount).map((character) => (
					<Card key={character.id} character={character} />
				))}
				{sortedData.length <= 0 && (
					<h1 className="text-3xl font-bold py-6 text-center pl-24 sm:col-span-2 md:col-span-3 lg:col-span-4 text-gray-800 dark:text-gray-100">No characters found</h1>
				)}
	      </div>
		  <div ref={loadMoreRef} className="h-10 w-full flex justify-center items-center">
			{visibleCount < sortedData.length && (
				<svg xmlns="http://www.w3.org/2000/svg" className="animate-spin !duration-200 size-7 text-white fill-none" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="10" className="opacity-25 stroke-current stroke-[4]"/>
					<path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75 fill-current"/>
				</svg>
			)}
		  </div>
	    </div>
	)
}

const root = document.getElementById('root')
if (root) {
	createRoot(root).render(
		<div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
			<FetchComponent />
		</div>
	)
}
else {
	console.error('Root element not found')
}