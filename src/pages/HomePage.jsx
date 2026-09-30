import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import './HomePage.css'

const STATUS_ICONS = {
  Watched: '✅',
  Watching: '▶️',
  'Want to Watch': '🔖',
  Dropped: '❌',
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="stat-card" style={{ borderColor: color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <span className="stat-value" style={{ color }}>{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  )
}

function HomePage({ movies }) {
  const stats = useMemo(() => {
    const watched = movies.filter((m) => m.status === 'Watched').length
    const watching = movies.filter((m) => m.status === 'Watching').length
    const wantToWatch = movies.filter((m) => m.status === 'Want to Watch').length
    const avgRating =
      movies.length > 0
        ? (movies.reduce((sum, m) => sum + m.rating, 0) / movies.length).toFixed(1)
        : 0
    return { watched, watching, wantToWatch, avgRating }
  }, [movies])

  const recentMovies = useMemo(
    () => [...movies].sort((a, b) => b.id - a.id).slice(0, 3),
    [movies]
  )

  const topRated = useMemo(
    () =>
      [...movies]
        .filter((m) => m.status === 'Watched')
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3),
    [movies]
  )

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🎬 Your Personal Movie Tracker</h1>
          <p>Organize your watchlist, rate movies, and track your viewing journey.</p>
          <div className="hero-buttons">
            <Link to="/add" className="cta-btn primary">➕ Add Movie</Link>
            <Link to="/movies" className="cta-btn secondary">🎥 Browse Library</Link>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="film-strip">
            {['🎭','🎬','🎥','🌟','🍿','🎞️'].map((e, i) => (
              <span key={i} style={{ animationDelay: `${i * 0.3}s` }}>{e}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="section">
        <h2 className="section-title">📊 Library Overview</h2>
        <div className="stats-grid">
          <StatCard icon="🎬" label="Total Movies" value={movies.length} color="#e94560" />
          <StatCard icon="✅" label="Watched" value={stats.watched} color="#27ae60" />
          <StatCard icon="▶️" label="Watching" value={stats.watching} color="#f39c12" />
          <StatCard icon="🔖" label="Want to Watch" value={stats.wantToWatch} color="#3498db" />
          <StatCard icon="⭐" label="Avg Rating" value={`${stats.avgRating}/10`} color="#f5a623" />
        </div>
      </section>

      {/* Recently Added */}
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">🆕 Recently Added</h2>
          <Link to="/movies" className="view-all">View All →</Link>
        </div>
        <div className="movie-list">
          {recentMovies.map((movie) => (
            <div key={movie.id} className="mini-movie-card">
              <div className="mini-card-left">
                <span className="mini-status">{STATUS_ICONS[movie.status]}</span>
                <div>
                  <h4>{movie.title}</h4>
                  <p>{movie.genre} • {movie.year}</p>
                </div>
              </div>
              <div className="mini-card-right">
                <span className="mini-rating">⭐ {movie.rating}/10</span>
                <span
                  className="mini-badge"
                  style={{
                    background:
                      movie.status === 'Watched' ? '#27ae6022' :
                      movie.status === 'Watching' ? '#f39c1222' : '#3498db22',
                    color:
                      movie.status === 'Watched' ? '#27ae60' :
                      movie.status === 'Watching' ? '#f39c12' : '#3498db',
                  }}
                >
                  {movie.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Rated */}
      {topRated.length > 0 && (
        <section className="section">
          <h2 className="section-title">🏆 Top Rated</h2>
          <div className="top-rated-list">
            {topRated.map((movie, idx) => (
              <div key={movie.id} className="top-rated-item">
                <span className="rank">#{idx + 1}</span>
                <div className="top-rated-info">
                  <h4>{movie.title}</h4>
                  <p>{movie.director} • {movie.year}</p>
                </div>
                <div className="top-rated-stars">
                  {'★'.repeat(Math.floor(movie.rating / 2))}{'☆'.repeat(5 - Math.floor(movie.rating / 2))}
                  <span className="top-rating-val">{movie.rating}/10</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default HomePage
