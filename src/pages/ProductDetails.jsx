import { useState, useContext, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { getProductById, getProducts } from "../services/api";
import "./ProductDetails.css";

const FEATURES = [
  "Produit disponible immédiatement",
  "Vérifié et testé avant expédition",
  "Livraison disponible partout au Sénégal",
];

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);
        setRelated([]);
        setQuantity(1);

        const data = await getProductById(id);

        if (!data) {
          setError("Ce produit n'existe pas ou n'est plus disponible.");
          return;
        }

        // On conserve _id de MongoDB et on ajoute id
        // pour rester compatible avec le panier existant.
        const currentProduct = {
          ...data,
          id: data._id,
        };

        setProduct(currentProduct);

        const allProducts = await getProducts();

        const similarProducts = allProducts
          .filter(
            (item) =>
              String(item._id) !== String(data._id) &&
              item.category === data.category,
          )
          .slice(0, 4)
          .map((item) => ({
            ...item,
            id: item._id,
          }));

        setRelated(similarProducts);
      } catch (err) {
        console.error("Erreur lors du chargement du produit :", err);
        setError(
          "Impossible de charger ce produit. Vérifie que le serveur LibertyShop fonctionne.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((current) => (current > 1 ? current - 1 : 1));
  };

  const handleAddToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="empty-state">
          <h2>Chargement du produit...</h2>
          <p>Nous récupérons les informations depuis LibertyShop.</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="empty-state__icon">📦</div>
          <h2>Produit introuvable</h2>
          <p>{error || "Ce produit n'existe pas ou n'est plus disponible."}</p>

          <Link to="/products" className="btn btn-primary">
            Retour aux produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="container">
        {/* FIL D'ARIANE */}
        <nav className="breadcrumb" aria-label="Fil d'Ariane">
          <Link to="/">Accueil</Link>
          <span aria-hidden="true">/</span>
          <Link to="/products">Produits</Link>
          <span aria-hidden="true">/</span>
          <strong>{product.name}</strong>
        </nav>

        {/* PRODUIT */}
        <section className="product-details">
          <div className="product-details-media">
            {product.badge && (
              <span className="details-badge">{product.badge}</span>
            )}

            <img src={product.image} alt={product.name} />
          </div>

          <div className="product-details-info">
            <span className="eyebrow">{product.brand}</span>

            <h1>{product.name}</h1>

            <div className="details-meta">
              {product.system && <span>{product.system}</span>}
              {product.category && <span>{product.category}</span>}
              {product.type && <span>{product.type}</span>}
            </div>

            <div className="details-price">
              {product.price.toLocaleString("fr-FR")}
              <span className="details-price__cur">FCFA</span>
            </div>

            <p className="details-description">
              {product.description ||
                `Découvrez le ${product.name}, disponible chez LibertyShop. Un produit soigneusement sélectionné, vérifié par nos équipes et livré avec un service adapté à vos besoins.`}
            </p>

            <ul className="details-features">
              {FEATURES.map((feature) => (
                <li key={feature}>
                  <span className="details-features__check">✓</span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* QUANTITÉ */}
            <div className="details-buy">
              <div className="details-quantity">
                <button
                  onClick={decreaseQuantity}
                  aria-label="Diminuer la quantité"
                >
                  −
                </button>

                <span>{quantity}</span>

                <button
                  onClick={increaseQuantity}
                  aria-label="Augmenter la quantité"
                >
                  +
                </button>
              </div>

              <button
                className={`btn btn-primary btn-lg ${added ? "btn-added" : ""}`}
                onClick={handleAddToCart}
                disabled={product.available === false || product.stock === 0}
              >
                {product.available === false || product.stock === 0
                  ? "Indisponible"
                  : added
                    ? "✓ Ajouté au panier"
                    : `Ajouter — ${(product.price * quantity).toLocaleString(
                        "fr-FR",
                      )} FCFA`}
              </button>
            </div>

            <Link to="/cart" className="details-cart-link">
              Voir mon panier →
            </Link>

            {/* INFORMATIONS */}
            <dl className="details-specs">
              <div>
                <dt>Marque</dt>
                <dd>{product.brand}</dd>
              </div>

              <div>
                <dt>Système</dt>
                <dd>{product.system || "Non précisé"}</dd>
              </div>

              <div>
                <dt>Catégorie</dt>
                <dd>{product.category}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* PRODUITS SIMILAIRES */}
        {related.length > 0 && (
          <section className="details-related">
            <div className="section-head">
              <span className="eyebrow">Dans la même catégorie</span>
              <h2>Vous aimerez aussi</h2>
            </div>

            <div className="products-grid">
              {related.map((item) => (
                <Link
                  key={item._id}
                  to={`/products/${item._id}`}
                  className="related-card"
                >
                  <div className="related-card__media">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="related-card__body">
                    <span>{item.brand}</span>
                    <h3>{item.name}</h3>
                    <strong>{item.price.toLocaleString("fr-FR")} FCFA</strong>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="back-products">
          <Link to="/products" className="btn btn-outline">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
