import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import './Navbar.css'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        🎬 <span>MovieTracker</span>
      </div>
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        ☰
      </button>
      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>
            🏠 Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/movies" onClick={() => setMenuOpen(false)}>
            🎥 My Movies
          </NavLink>
        </li>
        <li>
          <NavLink to="/add" onClick={() => setMenuOpen(false)}>
            ➕ Add Movie
          </NavLink>
        </li>
        <li>
          <NavLink to="/stats" onClick={() => setMenuOpen(false)}>
            📊 Statistics
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
