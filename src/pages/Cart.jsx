import { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const {
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  } = useContext(CartContext);

  const shipping = cartTotal >= 300000 ? 0 : 5000;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-state">
          <div className="empty-state__icon">🛒</div>

          <h2>Votre panier est vide</h2>

          <p>
            Parcourez notre collection et ajoutez vos produits préférés à votre
            panier.
          </p>

          <Link to="/products" className="btn btn-primary">
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  const remainingForFreeShipping = 300000 - cartTotal;

  return (
    <div className="cart-page">
      {/* HEADER */}
      <section className="page-head">
        <div className="container page-head__inner">
          <span className="eyebrow">Liberty Shop</span>

          <h1>
            Mon <span>panier</span>
          </h1>

          <p>
            {cartCount} article{cartCount > 1 ? "s" : ""} — vérifiez votre
            sélection avant de confirmer votre commande.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container cart-container">
          {/* PRODUITS */}
          <div className="cart-products">
            {remainingForFreeShipping > 0 && (
              <div className="shipping-note">
                <span>
                  Plus que{" "}
                  <strong>
                    {remainingForFreeShipping.toLocaleString("fr-FR")} FCFA
                  </strong>{" "}
                  pour la livraison offerte.
                </span>

                <div className="shipping-note__track">
                  <div
                    className="shipping-note__bar"
                    style={{ width: `${Math.min((cartTotal / 300000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            <div className="cart-items">
              {cartItems.map((item) => (
                <article className="cart-item" key={item.id}>
                  <Link to={`/produit/${item.id}`} className="cart-item__media">
                    <img src={item.image} alt={item.name} />
                  </Link>

                  <div className="cart-item__info">
                    <span className="cart-item__brand">{item.brand}</span>

                    <h3>
                      <Link to={`/produit/${item.id}`}>{item.name}</Link>
                    </h3>

                    {item.type && <p className="cart-item__type">{item.type}</p>}

                    <span className="cart-item__unit">
                      {(item.price).toLocaleString("fr-FR")} FCFA / unité
                    </span>
                  </div>

                  <div className="quantity-control">
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      aria-label={`Retirer une unité de ${item.name}`}
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => addToCart(item)}
                      aria-label={`Ajouter une unité de ${item.name}`}
                    >
                      +
                    </button>
                  </div>

                  <strong className="cart-item__total">
                    {(item.price * item.quantity).toLocaleString("fr-FR")} FCFA
                  </strong>

                  <button
                    className="cart-item__remove"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Supprimer ${item.name}`}
                  >
                    Supprimer
                  </button>
                </article>
              ))}
            </div>

            <div className="cart-actions">
              <Link to="/products" className="btn btn-outline">
                ← Continuer mes achats
              </Link>

              <button onClick={clearCart} className="cart-clear">
                Vider le panier
              </button>
            </div>
          </div>

          {/* RÉSUMÉ */}
          <aside className="cart-summary">
            <span className="eyebrow">Récapitulatif</span>

            <h2>Total de la commande</h2>

            <div className="summary-row">
              <span>Sous-total</span>
              <strong>{cartTotal.toLocaleString("fr-FR")} FCFA</strong>
            </div>

            <div className="summary-row">
              <span>Livraison</span>
              <strong className={shipping === 0 ? "is-free" : ""}>
                {shipping === 0 ? "Offerte" : `${shipping.toLocaleString("fr-FR")} FCFA`}
              </strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-row--total">
              <span>Total</span>
              <strong>{(cartTotal + shipping).toLocaleString("fr-FR")} FCFA</strong>
            </div>

            <Link to="/checkout" className="btn btn-gold btn-block">
              Passer la commande
            </Link>

            <p className="summary-foot">
              Paiement à la livraison • Wave • Orange Money
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default Cart;