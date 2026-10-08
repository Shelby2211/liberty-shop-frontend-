import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import Button from "./Button";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const detailPath = `/products/${product._id}`;

  return (
    <article className="product-card">
      <Link to={detailPath} className="product-media" aria-label={product.name}>
        <span className="product-badge">{product.badge || "LibertyShop"}</span>

        <img
          src={product.image}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />

        <span className="product-media__cta">Voir le produit</span>
      </Link>

      <div className="product-body">
        <div className="product-meta">
          <span>{product.brand}</span>

          {product.system && (
            <span className="product-system">{product.system}</span>
          )}
        </div>

        <h3>
          <Link to={detailPath}>{product.name}</Link>
        </h3>

        {product.type && <p className="product-type">{product.type}</p>}

        <div className="product-footer">
          <strong className="product-price">
            {product.price.toLocaleString("fr-FR")}
            <span className="product-price__cur">FCFA</span>
          </strong>

          <Button
            variant="primary"
            onClick={handleAdd}
            className={`add-cart ${added ? "btn-added" : ""}`}
            aria-label={`Ajouter ${product.name} au panier`}
          >
            {added ? "✓" : "+"}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
