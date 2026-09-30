import { useState } from 'react'
import './MovieCard.css'

const STATUS_COLORS = {
  Watched: '#27ae60',
  Watching: '#f39c12',
  'Want to Watch': '#3498db',
  Dropped: '#e74c3c',
}

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Documentary', 'Fantasy']
const STATUSES = ['Want to Watch', 'Watching', 'Watched', 'Dropped']

function StarRating({ rating, onChange }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="star-rating">
      {[...Array(10)].map((_, i) => (
        <span
          key={i}
          className={`star ${i < (hovered || rating) ? 'filled' : ''}`}
          onMouseEnter={() => onChange && setHovered(i + 1)}
          onMouseLeave={() => onChange && setHovered(0)}
          onClick={() => onChange && onChange(i + 1)}
          style={{ cursor: onChange ? 'pointer' : 'default' }}
        >
          ★
        </span>
      ))}
      <span className="rating-value">{rating}/10</span>
    </div>
  )
}

function MovieCard({ movie, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [editData, setEditData] = useState({ ...movie })

  const handleSave = () => {
    if (!editData.title.trim()) return
    onUpdate(editData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditData({ ...movie })
    setIsEditing(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditData((prev) => ({ ...prev, [name]: name === 'rating' || name === 'year' ? Number(value) : value }))
  }

  const statusColor = STATUS_COLORS[movie.status] || '#888'

  return (
    <div className="movie-card">
      <div className="card-header">
        <span className="status-badge" style={{ background: statusColor }}>
          {movie.status}
        </span>
        <span className="genre-tag">{movie.genre}</span>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <input
            className="edit-input"
            name="title"
            value={editData.title}
            onChange={handleChange}
            placeholder="Movie title *"
          />
          <input
            className="edit-input"
            name="director"
            value={editData.director}
            onChange={handleChange}
            placeholder="Director"
          />
          <div className="edit-row">
            <select className="edit-select" name="genre" value={editData.genre} onChange={handleChange}>
              {GENRES.map((g) => <option key={g}>{g}</option>)}
            </select>
            <input
              className="edit-input"
              name="year"
              type="number"
              value={editData.year}
              onChange={handleChange}
              min="1900"
              max="2030"
              placeholder="Year"
            />
          </div>
          <select className="edit-select" name="status" value={editData.status} onChange={handleChange}>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <textarea
            className="edit-textarea"
            name="description"
            value={editData.description}
            onChange={handleChange}
            placeholder="Description"
            rows="2"
          />
          <div className="rating-edit">
            <label>Rating:</label>
            <StarRating
              rating={editData.rating}
              onChange={(r) => setEditData((prev) => ({ ...prev, rating: r }))}
            />
          </div>
          <div className="edit-actions">
            <button className="btn btn-save" onClick={handleSave}>💾 Save</button>
            <button className="btn btn-cancel" onClick={handleCancel}>✕ Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3 className="movie-title">{movie.title}</h3>
          <p className="movie-meta">
            <span>🎬 {movie.director || 'Unknown'}</span>
            <span>📅 {movie.year}</span>
          </p>
          <p className="movie-desc">{movie.description}</p>
          <StarRating rating={movie.rating} />
          <p className="date-added">Added: {movie.dateAdded}</p>
          <div className="card-actions">
            <button className="btn btn-edit" onClick={() => setIsEditing(true)}>✏️ Edit</button>
            <button className="btn btn-delete" onClick={() => setShowConfirm(true)}>🗑️ Delete</button>
          </div>
        </>
      )}

      {showConfirm && (
        <div className="confirm-overlay">
          <div className="confirm-box">
            <p>Delete <strong>{movie.title}</strong>?</p>
            <div className="confirm-actions">
              <button className="btn btn-delete" onClick={() => { onDelete(movie.id); setShowConfirm(false) }}>Yes, Delete</button>
              <button className="btn btn-cancel" onClick={() => setShowConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export { StarRating }
export default MovieCard
