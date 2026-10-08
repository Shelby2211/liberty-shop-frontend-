import { Link } from "react-router-dom";
import "./Footer.css";

const COLUMNS = [
  {
    title: "Boutique",
    links: [
      { label: "Nos produits", to: "/products" },
      { label: "Smartphones", to: "/products?category=Téléphones" },
      { label: "Accessoires", to: "/products?category=Accessoires" },
      { label: "Mon panier", to: "/cart" },
    ],
  },
  {
    title: "Systèmes",
    links: [
      { label: "iPhone & iOS", to: "/products?system=iOS" },
      { label: "Android", to: "/products?system=Android" },
      { label: "Chargeurs", to: "/products?type=Chargeurs" },
    ],
  },
  {
    title: "Aide",
    links: [
      { label: "Nous contacter", to: "/contact" },
      { label: "Livraison", to: "/contact" },
      { label: "Retours", to: "/contact" },
    ],
  },
];

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            LIBERTY<span>SHOP</span>
          </Link>

          <p className="footer__tagline">
            Smartphones, accessoires et équipements de dernière génération.
            Sélection vérifiée, prix honnêtes, livraison partout au Sénégal.
          </p>

          <div className="footer__contact">
            <a href="tel:+221770000000">📞 +221 77 000 00 00</a>
            <a href="mailto:contact@libertyshop.sn">
              ✉️ contact@libertyshop.sn
            </a>
            <span>📍 Dakar, Sénégal</span>
          </div>
        </div>

        <div className="footer__columns">
          {COLUMNS.map((column) => (
            <div key={column.title} className="footer__col">
              <h4>{column.title}</h4>

              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} LibertyShop — Tous droits réservés.</span>

        <div className="footer__pay">
          <span className="footer__pay-label">Paiement</span>
          <span className="footer__pay-chip">Wave</span>
          <span className="footer__pay-chip">Orange Money</span>
          <span className="footer__pay-chip">À la livraison</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;