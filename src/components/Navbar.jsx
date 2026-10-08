import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import useTheme from "../hooks/useTheme";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Accueil" },
  { to: "/products", label: "Nos produits" },
  { to: "/contact", label: "Contact" },
];

function BagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 7h12l1 13H5L6 7Z" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

function Navbar() {
  const { cartCount } = useContext(CartContext);
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => setOpen(false);
  const toggleMenu = () => setOpen((v) => !v);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="announce">
        <div className="container announce__inner">
          <span>🚚 Livraison offerte dès 300 000 FCFA</span>
          <span className="announce__sep" />
          <span>Paiement à la livraison • Wave • Orange Money</span>
        </div>
      </div>

      <header className={`navbar ${scrolled ? "is-scrolled" : ""}`}>
        <div className="container navbar__inner">
          <Link to="/" className="navbar-logo" aria-label="LibertyShop">
            LIBERTY<span>SHOP</span>
          </Link>

          <nav className="navbar-menu" aria-label="Navigation principale">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                className={({ isActive }) =>
                  isActive ? "navbar-link is-active" : "navbar-link"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="navbar-actions">
            <button
              onClick={toggle}
              aria-label={
                theme === "dark" ? "Activer le thème clair" : "Activer le thème sombre"
              }
              className="icon-btn"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            <Link to="/cart" className="cart-btn" aria-label="Voir le panier">
              <BagIcon />
              <span className="cart-btn__label">Panier</span>
              {cartCount > 0 && <span className="cart-btn__count">{cartCount}</span>}
            </Link>

            <button
              onClick={toggleMenu}
              aria-label="Ouvrir le menu"
              aria-expanded={open}
              className="icon-btn navbar-burger"
            >
              <span className={`burger ${open ? "is-open" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`mobile-menu ${open ? "is-open" : ""}`}
        hidden={!open}
      >
        <nav aria-label="Navigation mobile">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? "mobile-link is-active" : "mobile-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/cart" onClick={closeMenu} className="btn btn-gold btn-block">
          Voir mon panier ({cartCount})
        </Link>
      </div>

      {open && (
        <button
          className="menu-overlay"
          onClick={closeMenu}
          aria-label="Fermer le menu"
        />
      )}
    </>
  );
}

export default Navbar;