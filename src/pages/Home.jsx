import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";

const CATEGORIES = [
  {
    icon: "📱",
    title: "Smartphones",
    description:
      "Découvrez les dernières générations d'iPhone et de smartphones Android.",
    to: "/products?category=Téléphones",
    cta: "Découvrir",
  },
  {
    icon: "🎧",
    title: "Accessoires",
    description:
      "Coques, écouteurs, protections et tous les essentiels du quotidien.",
    to: "/products?category=Accessoires",
    cta: "Découvrir",
  },
  {
    icon: "🔌",
    title: "Chargeurs",
    description:
      "Chargeurs rapides et câbles nouvelle génération pour tous vos appareils.",
    to: "/products?type=Chargeurs",
    cta: "Découvrir",
  },
];

const SYSTEMS = [
  {
    icon: "🍎",
    title: "iPhone & iOS",
    description:
      "Toute la sélection Apple, des modèles récents aux précédentes générations.",
    to: "/products?system=iOS",
    cta: "Voir les iPhone",
  },
  {
    icon: "🤖",
    title: "Android",
    description:
      "Samsung, Google Pixel, Xiaomi et les meilleures alternatives Android.",
    to: "/products?system=Android",
    cta: "Voir Android",
  },
];

const TRUST = [
  { strong: "Livraison 24/48h", span: "Partout au Sénégal" },
  { strong: "Produits vérifiés", span: "Testés avant expédition" },
  { strong: "Paiement flexible", span: "Wave, Orange Money" },
  { strong: "Support 7j/7", span: "Assistance par téléphone" },
];

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function CategoryCard({ icon, title, description, to, cta }) {
  return (
    <Link to={to} className="category-card">
      <div className="category-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className="category-cta">
        {cta}
        <ArrowIcon />
      </span>
    </Link>
  );
}

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const data = await getProducts();

        if (active) {
          setProducts(Array.isArray(data) ? data : data.products || []);
        }
      } catch (err) {
        if (active) {
          setError(
            "Impossible de charger les produits. Veuillez réessayer plus tard.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  const featured = products.slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero-content">
            <span className="eyebrow">Bienvenue chez LibertyShop</span>

            <h1>
              L&apos;élégance.
              <br />
              La technologie.
              <br />
              <span>LibertyShop.</span>
            </h1>

            <p className="hero-description">
              Smartphones, accessoires et équipements de dernière génération.
              Une sélection premium, des prix honnêtes et une livraison rapide
              partout au Sénégal.
            </p>

            <div className="hero-buttons">
              <Link to="/products" className="gold-button">
                Découvrir la collection
              </Link>

              <Link
                to="/products?category=Téléphones"
                className="outline-button"
              >
                Voir les smartphones
              </Link>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual__glow" />
            <div className="hero-visual__ring" />
            <div className="hero-visual__emoji">📱</div>
          </div>
        </div>
      </section>

      <section className="trust-strip" aria-label="Nos engagements">
        {TRUST.map((item) => (
          <div key={item.strong} className="trust-item">
            <strong>{item.strong}</strong>
            <span>{item.span}</span>
          </div>
        ))}
      </section>

      <section className="section section-alt">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Nos collections</span>
            <h2>Trouvez ce qu&apos;il vous faut</h2>
            <p>
              Une sélection pensée pour répondre à tous vos besoins, du
              smartphone aux accessoires.
            </p>
          </div>

          <div className="category-grid">
            {CATEGORIES.map((category) => (
              <CategoryCard key={category.title} {...category} />
            ))}
          </div>

          <div
            className="category-grid category-grid--split"
            style={{ marginTop: 20 }}
          >
            {SYSTEMS.map((system) => (
              <CategoryCard key={system.title} {...system} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Notre sélection</span>
            <h2>Produits populaires</h2>
            <p>Les produits les plus appréciés par nos clients.</p>
          </div>

          {loading ? (
            <p role="status">Chargement des produits...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : featured.length > 0 ? (
            <div className="products-grid">
              {featured.map((product) => (
                <ProductCard
                  key={product._id || product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <p>Aucun produit disponible pour le moment.</p>
          )}

          <div className="products-view-all">
            <Link to="/products" className="outline-button">
              Voir tous les produits
            </Link>
          </div>
        </div>
      </section>

      <section className="premium-banner">
        <div className="container premium-banner__inner">
          <div>
            <span className="eyebrow">Qualité • Style • Technologie</span>
            <h2>
              Votre technologie,
              <br />
              <span>votre style.</span>
            </h2>
          </div>

          <Link to="/products" className="gold-button">
            Explorer la boutique
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;
