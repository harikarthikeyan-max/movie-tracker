import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StarRating } from '../components/MovieCard'
import './AddMoviePage.css'

const GENRES = ['Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Thriller', 'Romance', 'Animation', 'Documentary', 'Fantasy']
const STATUSES = ['Want to Watch', 'Watching', 'Watched', 'Dropped']

const INITIAL_FORM = {
  title: '',
  director: '',
  genre: 'Action',
  year: new Date().getFullYear(),
  status: 'Want to Watch',
  rating: 5,
  description: '',
}

function AddMoviePage({ onAdd }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!form.title.trim()) newErrors.title = 'Title is required.'
    if (form.title.trim().length > 100) newErrors.title = 'Title must be under 100 characters.'
    if (!form.director.trim()) newErrors.director = 'Director name is required.'
    if (!form.year || form.year < 1888 || form.year > new Date().getFullYear() + 5)
      newErrors.year = `Year must be between 1888 and ${new Date().getFullYear() + 5}.`
    if (form.description.length > 500) newErrors.description = 'Description must be under 500 characters.'
    return newErrors
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === 'year' || name === 'rating' ? Number(value) : value,
    }))
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onAdd(form)
    setSubmitted(true)
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setErrors({})
  }

  const handleAddAnother = () => {
    setForm(INITIAL_FORM)
    setErrors({})
    setSubmitted(false)
  }

  if (submitted) {
    return (
      <div className="add-page">
        <div className="success-card">
          <div className="success-icon">🎉</div>
          <h2>Movie Added!</h2>
          <p>
            <strong>"{form.title}"</strong> has been added to your library.
          </p>
          <div className="success-actions">
            <button className="btn-action primary" onClick={handleAddAnother}>➕ Add Another</button>
            <button className="btn-action secondary" onClick={() => navigate('/movies')}>🎥 View Library</button>
            <button className="btn-action ghost" onClick={() => navigate('/')}>🏠 Home</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="add-page">
      <div className="form-container">
        <div className="form-header">
          <h1>➕ Add New Movie</h1>
          <p>Fill in the details to add a movie to your library.</p>
        </div>

        <form onSubmit={handleSubmit} className="movie-form" noValidate>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              🎬 Movie Title <span className="required">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. The Matrix"
              className={errors.title ? 'error' : ''}
              maxLength={100}
            />
            {errors.title && <span className="error-msg">{errors.title}</span>}
            <span className="char-count">{form.title.length}/100</span>
          </div>

          {/* Director */}
          <div className="form-group">
            <label htmlFor="director">
              🎥 Director <span className="required">*</span>
            </label>
            <input
              id="director"
              name="director"
              type="text"
              value={form.director}
              onChange={handleChange}
              placeholder="e.g. Christopher Nolan"
              className={errors.director ? 'error' : ''}
            />
            {errors.director && <span className="error-msg">{errors.director}</span>}
          </div>

          {/* Genre & Year */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="genre">🎭 Genre</label>
              <select id="genre" name="genre" value={form.genre} onChange={handleChange}>
                {GENRES.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="year">
                📅 Release Year <span className="required">*</span>
              </label>
              <input
                id="year"
                name="year"
                type="number"
                value={form.year}
                onChange={handleChange}
                min="1888"
                max={new Date().getFullYear() + 5}
                className={errors.year ? 'error' : ''}
              />
              {errors.year && <span className="error-msg">{errors.year}</span>}
            </div>
          </div>

          {/* Status */}
          <div className="form-group">
            <label>📌 Viewing Status</label>
            <div className="status-buttons">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`status-btn ${form.status === s ? 'active' : ''}`}
                  onClick={() => setForm((prev) => ({ ...prev, status: s }))}
                >
                  {s === 'Watched' && '✅ '}
                  {s === 'Watching' && '▶️ '}
                  {s === 'Want to Watch' && '🔖 '}
                  {s === 'Dropped' && '❌ '}
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="form-group">
            <label>⭐ Your Rating</label>
            <div className="rating-container">
              <StarRating
                rating={form.rating}
                onChange={(r) => setForm((prev) => ({ ...prev, rating: r }))}
              />
            </div>
            <input
              name="rating"
              type="range"
              min="1"
              max="10"
              value={form.rating}
              onChange={handleChange}
              className="rating-slider"
            />
            <div className="rating-labels">
              <span>1 - Terrible</span>
              <span>5 - Average</span>
              <span>10 - Masterpiece</span>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">📝 Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Brief description or your thoughts about this movie..."
              rows="4"
              maxLength={500}
              className={errors.description ? 'error' : ''}
            />
            {errors.description && <span className="error-msg">{errors.description}</span>}
            <span className="char-count">{form.description.length}/500</span>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-action primary">🎬 Add to Library</button>
            <button type="button" className="btn-action ghost" onClick={handleReset}>↺ Reset</button>
            <button type="button" className="btn-action secondary" onClick={() => navigate('/movies')}>✕ Cancel</button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="preview-panel">
        <h3>👁️ Preview</h3>
        <div className="preview-card">
          <div className="preview-header">
            <span className="preview-genre">{form.genre}</span>
            <span className="preview-year">{form.year}</span>
          </div>
          <h2 className="preview-title">{form.title || 'Movie Title'}</h2>
          <p className="preview-director">🎥 {form.director || 'Director'}</p>
          <p className="preview-desc">{form.description || 'No description provided.'}</p>
          <StarRating rating={form.rating} />
          <div
            className="preview-status"
            style={{
              background:
                form.status === 'Watched' ? '#27ae6022' :
                form.status === 'Watching' ? '#f39c1222' :
                form.status === 'Want to Watch' ? '#3498db22' : '#e74c3c22',
              color:
                form.status === 'Watched' ? '#27ae60' :
                form.status === 'Watching' ? '#f39c12' :
                form.status === 'Want to Watch' ? '#3498db' : '#e74c3c',
            }}
          >
            {form.status}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMoviePage
