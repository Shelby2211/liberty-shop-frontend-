import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import "./Products.css";

const CATEGORIES = ["Tous", "Téléphones", "Accessoires"];
const SYSTEMS = ["Tous", "iOS", "Android"];

const SYSTEM_ICONS = {
  Tous: "✦",
  iOS: "🍎",
  Android: "🤖",
};

const CATEGORY_LABELS = {
  Tous: { eyebrow: "Tout le catalogue", title: "Tous nos produits" },
  Téléphones: { eyebrow: "Smartphones", title: "Téléphones" },
  Accessoires: { eyebrow: "Essentiels", title: "Accessoires" },
};

function FilterGroup({ label, options, value, onChange, withIcons }) {
  return (
    <div className="filter-group">
      <span className="filter-group__label">{label}</span>

      <div className="filter-group__options">
        {options.map((option) => (
          <button
            key={option}
            className={
              value === option ? "filter-chip is-active" : "filter-chip"
            }
            onClick={() => onChange(option)}
            aria-pressed={value === option}
          >
            {withIcons && option !== "Tous" && (
              <span aria-hidden="true">{SYSTEM_ICONS[option]}</span>
            )}
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits :", error);
        setError("Impossible de charger les produits.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categoryParam = searchParams.get("category");
  const systemParam = searchParams.get("system");
  const typeParam = searchParams.get("type");

  const initialCategory = CATEGORIES.includes(categoryParam)
    ? categoryParam
    : "Tous";
  const initialSystem = SYSTEMS.includes(systemParam) ? systemParam : "Tous";

  const [category, setCategory] = useState(initialCategory);
  const [system, setSystem] = useState(initialSystem);

  if (loading) {
    return (
      <div className="products-page">
        <div className="container">
          <p>Chargement des produits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-page">
        <div className="container">
          <p>{error}</p>
        </div>
      </div>
    );
  }
  const filteredProducts = products.filter((product) => {
    const categoryMatch = category === "Tous" || product.category === category;
    const systemMatch = system === "Tous" || product.system === system;
    const typeMatch = !typeParam || product.type === typeParam;

    return categoryMatch && systemMatch && typeMatch;
  });

  const label = CATEGORY_LABELS[category];

  return (
    <div className="products-page">
      {/* HEADER */}
      <section className="page-head">
        <div className="container page-head__inner">
          <span className="eyebrow">{label.eyebrow}</span>

          <h1>
            Notre <span>Collection</span>
          </h1>

          <p>
            Découvrez nos smartphones et accessoires soigneusement sélectionnés,
            testés et garantis.
          </p>
        </div>
      </section>

      {/* FILTRES */}
      <section className="section">
        <div className="container">
          <div className="catalogue-bar">
            <div className="catalogue-bar__info">
              <h2>{label.title}</h2>
              <span>
                {filteredProducts.length} produit
                {filteredProducts.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="filters">
              <FilterGroup
                label="Catégorie"
                options={CATEGORIES}
                value={category}
                onChange={setCategory}
              />

              <FilterGroup
                label="Système"
                options={SYSTEMS}
                value={system}
                onChange={setSystem}
                withIcons
              />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state__icon">🔍</div>

              <h2>Aucun produit trouvé</h2>

              <p>Aucun produit ne correspond aux filtres sélectionnés.</p>

              <button
                className="btn btn-primary"
                onClick={() => {
                  setCategory("Tous");
                  setSystem("Tous");
                }}
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Products;
