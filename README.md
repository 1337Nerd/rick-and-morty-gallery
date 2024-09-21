# Rick and Morty Character Gallery

This project is a React-based web application that displays characters from the Rick and Morty TV show using the [Rick and Morty API](https://rickandmortyapi.com/). Users can sort, filter, and view character information in an interactive gallery.

## Features

- Fetches and displays character data from the Rick and Morty API
- Sorting functionality:
	- Sort by name (alphabetically)
	- Sort by creation date
- Filtering options:
	- Filter by character status (Alive, Dead, Unknown)
- Responsive card layout for character display
- Dark mode toggle with localStorage persistence
- Infinite scroll for loading more characters

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/1337Nerd/rick-and-morty-gallery.git
   ```

2. Navigate to the project directory:
   ```
   cd rick-and-morty-gallery
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and visit `http://localhost:5173` to view the application.

## Usage

- Use the "Name" and "Created" buttons at the top of the page to sort characters.
- Click the filter icon to open the filter menu and select character statuses to display.
- Toggle between light and dark mode using the sun/moon icon.
- Scroll down to load more characters automatically.

## Technologies Used

- React
- Vite
- TypeScript
- Tailwind CSS
- Rick and Morty API

## Approach and Implementation

1. **Data Fetching**: Implemented a custom hook `useFetchData` to fetch all character data from the API, handling pagination on the client-side for better performance and user experience.

2. **Sorting and Filtering**: Created a `useSortedAndFilteredData` hook to efficiently manage sorting and filtering operations using `useMemo` for optimization.

3. **Infinite Scroll**: Utilized the Intersection Observer API to implement infinite scrolling, loading more characters as the user scrolls down the page.

4. **Theme Toggle**: Implemented a dark mode toggle using a custom `useTheme` hook, persisting the user's preference in localStorage.

5. **Responsive Design**: Used Tailwind CSS to create a responsive layout that adapts to different screen sizes.

## Challenges Faced

1. **API Pagination**: The Rick and Morty API uses pagination, which required implementing a solution to fetch all data before displaying it to the user, especially needed for implementing sorting.

2. **Infinite Scroll Implementation**: Balancing between loading new data and maintaining smooth scrolling required fine-tuning the Intersection Observer setup.

## Future Improvements

- Implement caching mechanisms to reduce API calls and improve load times.
- Add more detailed character information and possibly link to episode data.
- Enhance accessibility features for better usability.
- Implement unit and integration tests to ensure reliability.