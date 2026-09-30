import { useMemo } from 'react'
import './StatsPage.css'

const STATUS_COLORS = {
  Watched: '#27ae60',
  Watching: '#f39c12',
  'Want to Watch': '#3498db',
  Dropped: '#e74c3c',
}

const GENRE_COLORS = [
  '#e94560', '#f5a623', '#27ae60', '#3498db', '#9b59b6',
  '#1abc9c', '#e67e22', '#e74c3c', '#2ecc71', '#0084ff'
]

function ProgressBar({ value, max, color, label }) {
  const pct = max > 0 ? (value / max) * 100 : 0
  return (
    <div className="progress-row">
      <span className="progress-label">{label}</span>
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="progress-value">{value}</span>
    </div>
  )
}

function StatsPage({ movies }) {
  const stats = useMemo(() => {
    if (movies.length === 0) return null

    const statusCounts = movies.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1
      return acc
    }, {})

    const genreCounts = movies.reduce((acc, m) => {
      acc[m.genre] = (acc[m.genre] || 0) + 1
      return acc
    }, {})

    const ratingDist = Array.from({ length: 10 }, (_, i) => ({
      rating: i + 1,
      count: movies.filter((m) => m.rating === i + 1).length,
    }))

    const avgRating = (movies.reduce((s, m) => s + m.rating, 0) / movies.length).toFixed(2)
    const highestRated = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5)
    const lowestRated = [...movies].filter(m => m.status === 'Watched').sort((a, b) => a.rating - b.rating).slice(0, 3)

    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])
    const topGenre = sortedGenres[0]?.[0] || 'N/A'

    const watchedPct = ((statusCounts['Watched'] || 0) / movies.length * 100).toFixed(1)

    // Year distribution
    const yearCounts = movies.reduce((acc, m) => {
      const decade = `${Math.floor(m.year / 10) * 10}s`
      acc[decade] = (acc[decade] || 0) + 1
      return acc
    }, {})
    const sortedDecades = Object.entries(yearCounts).sort((a, b) => a[0].localeCompare(b[0]))

    return {
      statusCounts,
      genreCounts,
      ratingDist,
      avgRating,
      highestRated,
      lowestRated,
      sortedGenres,
      topGenre,
      watchedPct,
      sortedDecades,
    }
  }, [movies])

  if (movies.length === 0) {
    return (
      <div className="stats-page">
        <div className="empty-stats">
          <div className="empty-icon">📊</div>
          <h2>No Data Yet</h2>
          <p>Add some movies to see your statistics!</p>
        </div>
      </div>
    )
  }

  const maxRatingCount = Math.max(...stats.ratingDist.map((r) => r.count), 1)
  const maxGenreCount = Math.max(...Object.values(stats.genreCounts), 1)
  const maxDecadeCount = Math.max(...stats.sortedDecades.map(d => d[1]), 1)

  return (
    <div className="stats-page">
      <h1 className="page-title">📊 Statistics</h1>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card" style={{ borderColor: '#e94560' }}>
          <span className="summary-num" style={{ color: '#e94560' }}>{movies.length}</span>
          <span className="summary-lbl">Total Movies</span>
        </div>
        <div className="summary-card" style={{ borderColor: '#f5a623' }}>
          <span className="summary-num" style={{ color: '#f5a623' }}>{stats.avgRating}</span>
          <span className="summary-lbl">Avg Rating</span>
        </div>
        <div className="summary-card" style={{ borderColor: '#27ae60' }}>
          <span className="summary-num" style={{ color: '#27ae60' }}>{stats.watchedPct}%</span>
          <span className="summary-lbl">Completed</span>
        </div>
        <div className="summary-card" style={{ borderColor: '#9b59b6' }}>
          <span className="summary-num" style={{ color: '#9b59b6' }}>{stats.topGenre}</span>
          <span className="summary-lbl">Top Genre</span>
        </div>
      </div>

      <div className="stats-grid-2col">
        {/* Viewing Status */}
        <div className="stats-panel">
          <h2>📌 Viewing Status</h2>
          <div className="donut-container">
            <svg viewBox="0 0 36 36" className="donut-chart">
              {(() => {
                let offset = 0
                return Object.entries(stats.statusCounts).map(([status, count]) => {
                  const pct = (count / movies.length) * 100
                  const color = STATUS_COLORS[status] || '#888'
                  const dash = `${pct} ${100 - pct}`
                  const el = (
                    <circle
                      key={status}
                      cx="18" cy="18" r="15.9"
                      fill="none"
                      stroke={color}
                      strokeWidth="3.5"
                      strokeDasharray={dash}
                      strokeDashoffset={-offset}
                      transform="rotate(-90 18 18)"
                    />
                  )
                  offset += pct
                  return el
                })
              })()}
              <text x="18" y="19.5" textAnchor="middle" className="donut-center">
                {movies.length}
              </text>
            </svg>
            <div className="donut-legend">
              {Object.entries(stats.statusCounts).map(([status, count]) => (
                <div key={status} className="legend-item">
                  <span className="legend-dot" style={{ background: STATUS_COLORS[status] }} />
                  <span className="legend-label">{status}</span>
                  <span className="legend-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Genre Breakdown */}
        <div className="stats-panel">
          <h2>🎭 Genre Breakdown</h2>
          <div className="progress-list">
            {stats.sortedGenres.map(([genre, count], i) => (
              <ProgressBar
                key={genre}
                label={genre}
                value={count}
                max={maxGenreCount}
                color={GENRE_COLORS[i % GENRE_COLORS.length]}
              />
            ))}
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="stats-panel full-width">
          <h2>⭐ Rating Distribution</h2>
          <div className="bar-chart">
            {stats.ratingDist.map(({ rating, count }) => (
              <div key={rating} className="bar-col">
                <span className="bar-count">{count > 0 ? count : ''}</span>
                <div
                  className="bar-fill"
                  style={{
                    height: `${(count / maxRatingCount) * 120}px`,
                    background:
                      rating >= 8 ? '#27ae60' :
                      rating >= 5 ? '#f5a623' : '#e74c3c',
                    minHeight: count > 0 ? '4px' : '0',
                  }}
                />
                <span className="bar-label">{rating}</span>
              </div>
            ))}
          </div>
          <div className="bar-chart-legend">
            <span style={{ color: '#e74c3c' }}>● 1-4 Poor</span>
            <span style={{ color: '#f5a623' }}>● 5-7 Average</span>
            <span style={{ color: '#27ae60' }}>● 8-10 Great</span>
          </div>
        </div>

        {/* Decade Distribution */}
        <div className="stats-panel">
          <h2>📆 By Decade</h2>
          <div className="progress-list">
            {stats.sortedDecades.map(([decade, count], i) => (
              <ProgressBar
                key={decade}
                label={decade}
                value={count}
                max={maxDecadeCount}
                color={GENRE_COLORS[i % GENRE_COLORS.length]}
              />
            ))}
          </div>
        </div>

        {/* Top Rated */}
        <div className="stats-panel">
          <h2>🏆 Highest Rated</h2>
          <div className="ranked-list">
            {stats.highestRated.map((m, i) => (
              <div key={m.id} className="ranked-item">
                <span className="rank-num" style={{ color: i === 0 ? '#f5a623' : i === 1 ? '#a0aec0' : i === 2 ? '#cd7f32' : '#556a80' }}>
                  #{i + 1}
                </span>
                <div className="ranked-info">
                  <span className="ranked-title">{m.title}</span>
                  <span className="ranked-genre">{m.genre} • {m.year}</span>
                </div>
                <span className="ranked-rating">{'★'.repeat(Math.round(m.rating / 2))} {m.rating}/10</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPage
