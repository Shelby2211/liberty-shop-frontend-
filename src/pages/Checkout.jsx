import { useContext, useState } from "react";
import { createOrder } from "../services/api";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import "./Checkout.css";

const DELIVERY_OPTIONS = [
  {
    value: "standard",
    label: "Livraison standard",
    detail: "24 à 48h — 5 000 FCFA",
    cost: 5000,
  },
  {
    value: "express",
    label: "Livraison express",
    detail: "Dans la journée — 10 000 FCFA",
    cost: 10000,
  },
];

const PAYMENT_OPTIONS = [
  {
    value: "delivery",
    label: "Paiement à la livraison",
    detail: "Payez à la réception de votre commande",
  },
  { value: "wave", label: "Wave", detail: "Mobile Money" },
  { value: "orange-money", label: "Orange Money", detail: "Mobile Money" },
];

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  phone: "",
  city: "",
  address: "",
  delivery: "standard",
  payment: "delivery",
};

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useContext(CartContext);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const shipping =
    DELIVERY_OPTIONS.find((option) => option.value === formData.delivery)
      ?.cost ?? 0;
  const shippingIsFree = cartTotal >= 300000;
  const finalShipping = shippingIsFree ? 0 : shipping;

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const validate = () => {
    const next = {};

    if (!formData.firstName.trim()) next.firstName = "Requis";
    if (!formData.lastName.trim()) next.lastName = "Requis";
    if (!/^[0-9+\s]{8,}$/.test(formData.phone.trim()))
      next.phone = "Numéro invalide";
    if (!formData.city.trim()) next.city = "Requis";
    if (!formData.address.trim()) next.address = "Requis";

    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const next = validate();

    setErrors(next);
    setSubmitError("");

    if (Object.keys(next).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const orderData = {
        customer: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          phone: formData.phone.trim(),
          city: formData.city.trim(),
          address: formData.address.trim(),
        },

        items: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),

        delivery: formData.delivery,
        shippingCost: finalShipping,
        payment: formData.payment,
        subtotal: cartTotal,
        total: cartTotal + finalShipping,
      };

      await createOrder(orderData);

      clearCart();
      setOrderConfirmed(true);
    } catch (error) {
      console.error("Erreur lors de la création de la commande :", error);

      setSubmitError(
        error.response?.data?.message ||
          "Impossible d'enregistrer votre commande. Veuillez réessayer.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderConfirmed) {
    return (
      <div className="checkout-page">
        <div className="container empty-state">
          <div className="checkout-success__icon">✓</div>

          <span className="eyebrow">Commande confirmée</span>

          <h2>Merci pour votre commande</h2>

          <p>
            Notre équipe vous contactera prochainement au{" "}
            <strong>{formData.phone}</strong> pour confirmer la livraison à{" "}
            {formData.city}.
          </p>

          <Link to="/products" className="btn btn-primary">
            Continuer mes achats
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container empty-state">
          <div className="empty-state__icon">🛒</div>

          <h2>Votre panier est vide</h2>

          <p>Ajoutez des produits au panier avant de passer votre commande.</p>

          <Link to="/products" className="btn btn-primary">
            Découvrir nos produits
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <section className="page-head">
        <div className="container page-head__inner">
          <span className="eyebrow">Liberty Shop</span>

          <h1>
            Finaliser la <span>commande</span>
          </h1>

          <p>
            Renseignez vos informations pour recevoir votre commande. Aucun
            paiement n&apos;est exigé à cette étape.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container checkout-container">
          {/* FORMULAIRE */}
          <form onSubmit={handleSubmit} className="checkout-form" noValidate>
            <div className="checkout-block">
              <div className="checkout-block__head">
                <span className="checkout-step">01</span>

                <h2>Informations de livraison</h2>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="firstName">Prénom</label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    aria-invalid={Boolean(errors.firstName)}
                    className={errors.firstName ? "has-error" : ""}
                  />
                  {errors.firstName && (
                    <span className="form-error">{errors.firstName}</span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="lastName">Nom</label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    aria-invalid={Boolean(errors.lastName)}
                    className={errors.lastName ? "has-error" : ""}
                  />
                  {errors.lastName && (
                    <span className="form-error">{errors.lastName}</span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="phone">Téléphone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="77 000 00 00"
                    aria-invalid={Boolean(errors.phone)}
                    className={errors.phone ? "has-error" : ""}
                  />
                  {errors.phone && (
                    <span className="form-error">{errors.phone}</span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="city">Ville</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Dakar, Thiès, Saint-Louis..."
                    aria-invalid={Boolean(errors.city)}
                    className={errors.city ? "has-error" : ""}
                  />
                  {errors.city && (
                    <span className="form-error">{errors.city}</span>
                  )}
                </div>

                <div className="form-field form-field--full">
                  <label htmlFor="address">Adresse / Quartier</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Indiquez votre adresse ou votre quartier"
                    rows="3"
                    aria-invalid={Boolean(errors.address)}
                    className={errors.address ? "has-error" : ""}
                  />
                  {errors.address && (
                    <span className="form-error">{errors.address}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="checkout-block">
              <div className="checkout-block__head">
                <span className="checkout-step">02</span>

                <h2>Mode de livraison</h2>
              </div>

              <div className="option-list">
                {DELIVERY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`option-card ${
                      formData.delivery === option.value ? "is-selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={option.value}
                      checked={formData.delivery === option.value}
                      onChange={handleChange}
                    />

                    <div>
                      <strong>{option.label}</strong>
                      <span>
                        {shippingIsFree && option.value === "standard"
                          ? "Offerte pour votre commande"
                          : option.detail}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="checkout-block">
              <div className="checkout-block__head">
                <span className="checkout-step">03</span>

                <h2>Mode de paiement</h2>
              </div>

              <div className="option-list">
                {PAYMENT_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`option-card ${
                      formData.payment === option.value ? "is-selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={option.value}
                      checked={formData.payment === option.value}
                      onChange={handleChange}
                    />

                    <div>
                      <strong>{option.label}</strong>
                      <span>{option.detail}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {submitError && (
              <p className="form-error" role="alert">
                {submitError}
              </p>
            )}
            <button
              type="submit"
              className="btn btn-gold btn-block btn-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Enregistrement..." : "Confirmer la commande"}
            </button>
          </form>

          {/* RÉSUMÉ */}
          <aside className="checkout-summary">
            <span className="eyebrow">Récapitulatif</span>

            <h2>Votre commande</h2>

            <div className="checkout-products">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-product">
                  <div className="checkout-product__media">
                    <img src={item.image} alt={item.name} />
                    <span>{item.quantity}</span>
                  </div>

                  <div className="checkout-product__info">
                    <strong>{item.name}</strong>
                    <span>{item.brand}</span>
                  </div>

                  <strong className="checkout-product__price">
                    {(item.price * item.quantity).toLocaleString("fr-FR")}
                  </strong>
                </div>
              ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>Sous-total</span>
              <strong>{cartTotal.toLocaleString("fr-FR")} FCFA</strong>
            </div>

            <div className="summary-row">
              <span>Livraison</span>
              <strong className={finalShipping === 0 ? "is-free" : ""}>
                {finalShipping === 0
                  ? "Offerte"
                  : `${finalShipping.toLocaleString("fr-FR")} FCFA`}
              </strong>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-row--total">
              <span>Total</span>
              <strong>
                {(cartTotal + finalShipping).toLocaleString("fr-FR")} FCFA
              </strong>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default Checkout;
