import { Link, useLocation } from "react-router";

export const Navbar = () => {
  const userLocation = useLocation();
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link className="brand-link" to="/">
          Reproductor
        </Link>
      </div>

      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-link ${userLocation.pathname === "/" ? "active" : ""}`}
        >
          Todas las canciones
        </Link>
        <Link
          to="/playlists"
          className={`nav-link ${userLocation.pathname === "/playlists" ? "active" : ""}`}
        >
          Playlists
        </Link>
      </div>
    </nav>
  );
};
