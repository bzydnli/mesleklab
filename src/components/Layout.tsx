import { Link, NavLink, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to="/" aria-label="MeslekLab ana sayfa">
          <span className="brand-mark">M</span>
          <span>
            <strong>MeslekLab</strong>
            <small>öğren · dene · keşfet</small>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Ana menü">
          <NavLink to="/bilisim">💻 Bilişim</NavLink>
          <NavLink to="/elektrik-elektronik">⚡ Elektrik-Elektronik</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="footer">
        <span>MeslekLab</span>
        <span>Mesleki ve teknik eğitim için interaktif öğrenme ortamı</span>
      </footer>
    </div>
  )
}
