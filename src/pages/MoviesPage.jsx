import { useState, useMemo } from 'react'
import MovieCard from '../components/MovieCard'
import './MoviesPage.css'

const GENRES = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Documentary', 'Fantasy']
const STATUSES = ['All', 'Want to Watch', 'Watching', 'Watched', 'Dropped']
const SORT_OPTIONS = [
  { value: 'newest', label: '🆕 Newest First' },
  { value: 'oldest', label: '📅 Oldest First' },
  { value: 'rating-high', label: '⭐ Rating (High→Low)' },
  { value: 'rating-low', label: '⭐ Rating (Low→High)' },
  { value: 'title-az', label: '🔤 Title (A→Z)' },
  { value: 'title-za', label: '🔤 Title (Z→A)' },
  { value: 'year-new', label: '📆 Year (Newest)' },
  { value: 'year-old', label: '📆 Year (Oldest)' },
]

function MoviesPage({ movies, onUpdate, onDelete }) {
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState('grid')

  const filtered = useMemo(() => {
    let result = [...movies]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.director && m.director.toLowerCase().includes(q)) ||
          (m.description && m.description.toLowerCase().includes(q))
      )
    }

    // Genre filter
    if (genreFilter !== 'All') {
      result = result.filter((m) => m.genre === genreFilter)
    }

    // Status filter
    if (statusFilter !== 'All') {
      result = result.filter((m) => m.status === statusFilter)
    }

    // Sort
    switch (sortBy) {
      case 'newest': result.sort((a, b) => b.id - a.id); break
      case 'oldest': result.sort((a, b) => a.id - b.id); break
      case 'rating-high': result.sort((a, b) => b.rating - a.rating); break
      case 'rating-low': result.sort((a, b) => a.rating - b.rating); break
      case 'title-az': result.sort((a, b) => a.title.localeCompare(b.title)); break
      case 'title-za': result.sort((a, b) => b.title.localeCompare(a.title)); break
      case 'year-new': result.sort((a, b) => b.year - a.year); break
      case 'year-old': result.sort((a, b) => a.year - b.year); break
      default: break
    }

    return result
  }, [movies, search, genreFilter, statusFilter, sortBy])

  const clearFilters = () => {
    setSearch('')
    setGenreFilter('All')
    setStatusFilter('All')
    setSortBy('newest')
  }

  const hasFilters = search || genreFilter !== 'All' || statusFilter !== 'All'

  return (
    <div className="movies-page">
      <div className="page-header">
        <h1>🎥 My Movie Library</h1>
        <span className="movie-count">{filtered.length} of {movies.length} movies</span>
      </div>

      {/* Search bar */}
      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search by title, director, or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        {search && (
          <button className="clear-search" onClick={() => setSearch('')}>✕</button>
        )}
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Genre:</label>
          <div className="filter-pills">
            {GENRES.map((g) => (
              <button
                key={g}
                className={`pill ${genreFilter === g ? 'active' : ''}`}
                onClick={() => setGenreFilter(g)}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <div className="filter-pills">
            {STATUSES.map((s) => (
              <button
                key={s}
                className={`pill ${statusFilter === s ? 'active' : ''}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group sort-group">
            <label>Sort:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="view-toggle">
            <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>⊞</button>
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>☰</button>
          </div>

          {hasFilters && (
            <button className="clear-btn" onClick={clearFilters}>✕ Clear Filters</button>
          )}
        </div>
      </div>

      {/* Movie Grid / List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <h3>No movies found</h3>
          <p>
            {movies.length === 0
              ? 'Start by adding your first movie!'
              : 'Try adjusting your search or filters.'}
          </p>
          {hasFilters && (
            <button className="clear-btn" onClick={clearFilters}>Clear Filters</button>
          )}
        </div>
      ) : (
        <div className={`movies-container ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
          {filtered.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default MoviesPage
