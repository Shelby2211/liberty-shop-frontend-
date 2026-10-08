import { useState } from "react";
import "./Contact.css";

const CONTACT_METHODS = [
  {
    icon: "📞",
    title: "Téléphone",
    lines: ["+221 77 000 00 00", "+221 70 123 45 67"],
    note: "Lun – Sam, 9h – 20h",
  },
  {
    icon: "✉️",
    title: "Email",
    lines: ["contact@libertyshop.sn", "support@libertyshop.sn"],
    note: "Réponse sous 24h",
  },
  {
    icon: "📍",
    title: "Boutique",
    lines: ["Rue 12, Dakar", "Dakar, Sénégal"],
    note: "Ouvert 7j/7",
  },
];

const FAQS = [
  {
    q: "Quels sont les délais de livraison ?",
    a: "La livraison standard prend 24 à 48h à Dakar et 2 à 4 jours pour les autres villes. L'option express est disponible à Dakar.",
  },
  {
    q: "Comment puis-je payer ma commande ?",
    a: "Vous pouvez payer à la livraison, par Wave ou par Orange Money. Aucun paiement en ligne n'est demandé lors de la commande.",
  },
  {
    q: "Les produits sont-ils garantis ?",
    a: "Tous nos produits sont vérifiés et testés avant expédition. Les appareils incluent la garantie constructeur.",
  },
  {
    q: "Puis-je retourner un produit ?",
    a: "Oui, vous disposez de 7 jours pour demander un retour, sous réserve que le produit soit dans son état d'origine.",
  },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const next = {};

    if (!formData.name.trim()) next.name = "Requis";
    if (!/^\S+@\S+\.\S+$/.test(formData.email.trim()))
      next.email = "Email invalide";
    if (!formData.message.trim()) next.message = "Requis";

    setErrors(next);

    if (Object.keys(next).length === 0) {
      setSent(true);
      setFormData(EMPTY_FORM);
    }
  };

  return (
    <div className="contact-page">
      <section className="page-head">
        <div className="container page-head__inner">
          <span className="eyebrow">Service client</span>

          <h1>
            Parlons de votre <span>commande</span>
          </h1>

          <p>
            Une question sur un produit, une commande ou une livraison ? Notre
            équipe est disponible pour vous aider.
          </p>
        </div>
      </section>

      {/* MÉTHODES */}
      <section className="section">
        <div className="container">
          <div className="contact-methods">
            {CONTACT_METHODS.map((method) => (
              <div key={method.title} className="contact-method">
                <div className="contact-method__icon">{method.icon}</div>

                <h3>{method.title}</h3>

                <div className="contact-method__lines">
                  {method.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </div>

                <p>{method.note}</p>
              </div>
            ))}
          </div>

          {/* FORMULAIRE + FAQ */}
          <div className="contact-body">
            <div className="contact-form-wrap">
              <span className="eyebrow">Écrivez-nous</span>

              <h2>Envoyez-nous un message</h2>

              <p className="contact-intro">
                Remplissez le formulaire et nous vous répondrons dans les
                meilleurs délais.
              </p>

              {sent && (
                <div className="contact-success" role="status">
                  ✓ Message envoyé. Notre équipe vous répondra très
                  bientôt.
                </div>
              )}

              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name">Nom complet</label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className={errors.name ? "has-error" : ""}
                    />
                    {errors.name && (
                      <span className="form-error">{errors.name}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vous@exemple.com"
                      className={errors.email ? "has-error" : ""}
                    />
                    {errors.email && (
                      <span className="form-error">{errors.email}</span>
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
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="subject">Sujet</label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Objet de votre message"
                    />
                  </div>

                  <div className="form-field form-field--full">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre demande..."
                      rows="5"
                      className={errors.message ? "has-error" : ""}
                    />
                    {errors.message && (
                      <span className="form-error">{errors.message}</span>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-lg">
                  Envoyer le message
                </button>
              </form>
            </div>

            <div className="contact-faq">
              <span className="eyebrow">Questions fréquentes</span>

              <h2>Ce qu&apos;on nous demande souvent</h2>

              <div className="faq-list">
                {FAQS.map((faq) => (
                  <details key={faq.q} className="faq-item">
                    <summary>
                      {faq.q}
                      <span aria-hidden="true">+</span>
                    </summary>

                    <p>{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;