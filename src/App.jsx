import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import MoviesPage from './pages/MoviesPage'
import AddMoviePage from './pages/AddMoviePage'
import StatsPage from './pages/StatsPage'
import './App.css'

const SAMPLE_MOVIES = [
  {
    id: 1,
    title: 'Inception',
    genre: 'Sci-Fi',
    rating: 9,
    status: 'Watched',
    year: 2010,
    director: 'Christopher Nolan',
    description: 'A thief who steals corporate secrets through dreams.',
    dateAdded: '2024-01-15',
  },
  {
    id: 2,
    title: 'The Dark Knight',
    genre: 'Action',
    rating: 10,
    status: 'Watched',
    year: 2008,
    director: 'Christopher Nolan',
    description: 'Batman faces the Joker, a criminal mastermind.',
    dateAdded: '2024-01-20',
  },
  {
    id: 3,
    title: 'Interstellar',
    genre: 'Sci-Fi',
    rating: 8,
    status: 'Watching',
    year: 2014,
    director: 'Christopher Nolan',
    description: 'Astronauts travel through a wormhole near Saturn.',
    dateAdded: '2024-02-01',
  },
  {
    id: 4,
    title: 'Parasite',
    genre: 'Thriller',
    rating: 9,
    status: 'Watched',
    year: 2019,
    director: 'Bong Joon-ho',
    description: 'A poor family schemes to become employed by a wealthy family.',
    dateAdded: '2024-02-10',
  },
  {
    id: 5,
    title: 'Dune',
    genre: 'Sci-Fi',
    rating: 8,
    status: 'Want to Watch',
    year: 2021,
    director: 'Denis Villeneuve',
    description: 'A noble family becomes embroiled in a war for a desert planet.',
    dateAdded: '2024-02-15',
  },
  {
    id: 6,
    title: 'The Godfather',
    genre: 'Drama',
    rating: 10,
    status: 'Watched',
    year: 1972,
    director: 'Francis Ford Coppola',
    description: 'The aging patriarch of an organized crime dynasty.',
    dateAdded: '2024-03-01',
  },
]

function App() {
  const [movies, setMovies] = useState(() => {
    const saved = localStorage.getItem('movieTrackerMovies')
    return saved ? JSON.parse(saved) : SAMPLE_MOVIES
  })

  useEffect(() => {
    localStorage.setItem('movieTrackerMovies', JSON.stringify(movies))
  }, [movies])

  const addMovie = (movie) => {
    const newMovie = {
      ...movie,
      id: Date.now(),
      dateAdded: new Date().toISOString().split('T')[0],
    }
    setMovies((prev) => [newMovie, ...prev])
  }

  const updateMovie = (updatedMovie) => {
    setMovies((prev) =>
      prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m))
    )
  }

  const deleteMovie = (id) => {
    setMovies((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage movies={movies} />} />
          <Route
            path="/movies"
            element={
              <MoviesPage
                movies={movies}
                onUpdate={updateMovie}
                onDelete={deleteMovie}
              />
            }
          />
          <Route
            path="/add"
            element={<AddMoviePage onAdd={addMovie} />}
          />
          <Route path="/stats" element={<StatsPage movies={movies} />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
