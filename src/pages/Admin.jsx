import { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getOrders,
  getProducts,
  updateOrderStatus,
  updateProduct,
  updateProductStock,
} from "../services/api";
import "./Admin.css";

function Admin() {
  // ==============================
  // ÉTATS
  // ==============================

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stockInputs, setStockInputs] = useState({});
  const [savingStock, setSavingStock] = useState({});

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProduct, setSavingProduct] = useState(false);

  const [productError, setProductError] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    category: "Téléphones",
    system: "iOS",
    type: "",
    price: "",
    image: "",
    description: "",
    stock: 0,
    badge: "",
    available: true,
  });

  // ==============================
  // CHARGEMENT DES DONNÉES
  // ==============================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [ordersData, productsData] = await Promise.all([
          getOrders(),
          getProducts(),
        ]);

        setOrders(ordersData);
        setProducts(productsData);
      } catch (error) {
        console.error("Erreur récupération données :", error);

        setError(
          "Impossible de récupérer les données. Vérifie que le serveur LibertyShop fonctionne.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ==============================
  // DÉCONNEXION
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");

    window.location.href = "/admin/login";
  };

  // ==============================
  // STOCK
  // ==============================

  const handleStockInputChange = (productId, value) => {
    setStockInputs((current) => ({
      ...current,
      [productId]: value,
    }));
  };

  const handleSaveStock = async (productId, currentStock) => {
    const value =
      stockInputs[productId] !== undefined
        ? stockInputs[productId]
        : currentStock;

    const stock = Number(value);

    if (!Number.isInteger(stock) || stock < 0) {
      alert("Le stock doit être un nombre entier positif ou égal à zéro.");
      return;
    }

    try {
      setSavingStock((current) => ({
        ...current,
        [productId]: true,
      }));

      const data = await updateProductStock(productId, stock);

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === productId ? data.product : product,
        ),
      );

      setStockInputs((current) => {
        const updated = { ...current };
        delete updated[productId];
        return updated;
      });
    } catch (error) {
      console.error("Erreur modification stock :", error);

      alert(
        error.response?.data?.message ||
          "Impossible de modifier le stock du produit.",
      );
    } finally {
      setSavingStock((current) => ({
        ...current,
        [productId]: false,
      }));
    }
  };

  // ==============================
  // FORMULAIRE PRODUIT
  // ==============================

  const resetProductForm = () => {
    setProductForm({
      name: "",
      brand: "",
      category: "Téléphones",
      system: "iOS",
      type: "",
      price: "",
      image: "",
      description: "",
      stock: 0,
      badge: "",
      available: true,
    });

    setEditingProduct(null);
    setProductError("");
  };

  const handleProductInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setProductForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpenAddProduct = () => {
    resetProductForm();
    setShowProductForm(true);
  };

  const handleOpenEditProduct = (product) => {
    setEditingProduct(product);

    setProductForm({
      name: product.name || "",
      brand: product.brand || "",
      category: product.category || "Téléphones",
      system: product.system || "iOS",
      type: product.type || "",
      price: product.price ?? "",
      image: product.image || "",
      description: product.description || "",
      stock: product.stock ?? 0,
      badge: product.badge || "",
      available: product.available !== false,
    });

    setProductError("");
    setShowProductForm(true);
  };

  const handleCloseProductForm = () => {
    if (savingProduct) {
      return;
    }

    setShowProductForm(false);
    resetProductForm();
  };

  // ==============================
  // AJOUT / MODIFICATION PRODUIT
  // ==============================

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    setProductError("");

    if (!productForm.name.trim()) {
      setProductError("Le nom du produit est obligatoire.");
      return;
    }

    if (!productForm.brand.trim()) {
      setProductError("La marque est obligatoire.");
      return;
    }

    const price = Number(productForm.price);
    const stock = Number(productForm.stock);

    if (!Number.isFinite(price) || price < 0) {
      setProductError("Le prix doit être un nombre valide.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setProductError(
        "Le stock doit être un nombre entier positif ou égal à zéro.",
      );
      return;
    }

    const productData = {
      name: productForm.name.trim(),
      brand: productForm.brand.trim(),
      category: productForm.category,
      system: productForm.system,
      type: productForm.type.trim(),
      price,
      image: productForm.image.trim(),
      description: productForm.description.trim(),
      stock,
      badge: productForm.badge.trim(),
      available: stock > 0 && productForm.available,
    };

    try {
      setSavingProduct(true);

      if (editingProduct) {
        const data = await updateProduct(editingProduct._id, productData);

        setProducts((currentProducts) =>
          currentProducts.map((product) =>
            product._id === editingProduct._id ? data.product : product,
          ),
        );

        alert("Produit modifié avec succès.");
      } else {
        const data = await createProduct(productData);

        setProducts((currentProducts) => [data.product, ...currentProducts]);

        alert("Produit ajouté avec succès.");
      }

      setShowProductForm(false);
      resetProductForm();
    } catch (error) {
      console.error("Erreur sauvegarde produit :", error);

      setProductError(
        error.response?.data?.message || "Impossible d'enregistrer le produit.",
      );
    } finally {
      setSavingProduct(false);
    }
  };

  // ==============================
  // SUPPRIMER UN PRODUIT
  // ==============================

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Voulez-vous vraiment supprimer "${product.name}" ?\n\nCette action est irréversible.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(product._id);

      setProducts((currentProducts) =>
        currentProducts.filter((item) => item._id !== product._id),
      );

      alert("Produit supprimé avec succès.");
    } catch (error) {
      console.error("Erreur suppression produit :", error);

      alert(
        error.response?.data?.message || "Impossible de supprimer le produit.",
      );
    }
  };

  // ==============================
  // STATUT COMMANDE
  // ==============================

  const handleStatusChange = async (orderId, status) => {
    try {
      const data = await updateOrderStatus(orderId, status);

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId ? data.order : order,
        ),
      );
    } catch (error) {
      console.error("Erreur modification statut :", error);

      alert(
        error.response?.data?.message || "Impossible de modifier le statut.",
      );
    }
  };

  // ==============================
  // FORMATAGE
  // ==============================

  const formatPrice = (price) => {
    return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // ==============================
  // STATISTIQUES
  // ==============================

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending",
  ).length;

  const confirmedOrders = orders.filter(
    (order) => order.status === "confirmed",
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered",
  ).length;

  const productsInStock = products.filter(
    (product) => product.stock > 0,
  ).length;

  const totalRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + Number(order.total || 0), 0);

  // ==============================
  // CHARGEMENT
  // ==============================

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-container">
          <div className="admin-loading">Chargement du tableau de bord...</div>
        </div>
      </main>
    );
  }

  // ==============================
  // AFFICHAGE
  // ==============================

  return (
    <main className="admin-page">
      <div className="admin-container">
        {/* ==========================
            HEADER
        ========================== */}

        <div className="admin-header">
          <div>
            <span className="eyebrow">Administration</span>

            <h1>Tableau de bord</h1>

            <p>Gérez les produits, les stocks et les commandes LibertyShop.</p>
          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleLogout}
          >
            Se déconnecter
          </button>
        </div>

        {/* ==========================
            ERREUR GÉNÉRALE
        ========================== */}

        {error && <div className="admin-error">{error}</div>}

        {/* ==========================
            STATISTIQUES
        ========================== */}

        <section className="admin-stats">
          <article className="admin-stat-card">
            <span>Total commandes</span>
            <strong>{totalOrders}</strong>
          </article>

          <article className="admin-stat-card">
            <span>En attente</span>
            <strong>{pendingOrders}</strong>
          </article>

          <article className="admin-stat-card">
            <span>Confirmées</span>
            <strong>{confirmedOrders}</strong>
          </article>

          <article className="admin-stat-card">
            <span>Livrées</span>
            <strong>{deliveredOrders}</strong>
          </article>

          <article className="admin-stat-card">
            <span>Produits en stock</span>
            <strong>{productsInStock}</strong>
          </article>

          <article className="admin-stat-card">
            <span>Chiffre d'affaires</span>
            <strong>{formatPrice(totalRevenue)}</strong>
          </article>
        </section>

        {/* ==========================
            GESTION PRODUITS
        ========================== */}

        <section className="admin-products">
          <div className="admin-products-header">
            <div>
              <span className="eyebrow">Catalogue</span>

              <h2>Gestion des produits</h2>

              <p>Ajoutez, modifiez ou supprimez les produits de LibertyShop.</p>
            </div>

            <button
              type="button"
              className="admin-primary-button"
              onClick={handleOpenAddProduct}
            >
              + Ajouter un produit
            </button>
          </div>

          <div className="admin-products-list">
            {products.length === 0 ? (
              <div className="admin-empty">
                Aucun produit dans le catalogue.
              </div>
            ) : (
              products.map((product) => (
                <article className="admin-product-card" key={product._id}>
                  <div className="admin-product-image">
                    {product.image ? (
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <span>Sans image</span>
                    )}
                  </div>

                  <div className="admin-product-info">
                    <strong>{product.name}</strong>

                    <span>{product.brand}</span>

                    <small>
                      {product.category}
                      {product.system && ` • ${product.system}`}
                    </small>

                    <b>{formatPrice(product.price)}</b>
                  </div>

                  <div className="admin-product-stock">
                    <span>Stock</span>

                    <input
                      type="number"
                      min="0"
                      value={
                        stockInputs[product._id] !== undefined
                          ? stockInputs[product._id]
                          : product.stock || 0
                      }
                      onChange={(event) =>
                        handleStockInputChange(product._id, event.target.value)
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleSaveStock(product._id, product.stock || 0)
                      }
                      disabled={savingStock[product._id]}
                    >
                      {savingStock[product._id]
                        ? "Enregistrement..."
                        : "Enregistrer"}
                    </button>
                  </div>

                  <div className="admin-product-availability">
                    {product.stock > 5 ? (
                      <span className="stock-status stock-status--available">
                        Disponible
                      </span>
                    ) : product.stock > 0 ? (
                      <span className="stock-status stock-status--low">
                        Stock faible
                      </span>
                    ) : (
                      <span className="stock-status stock-status--empty">
                        Rupture
                      </span>
                    )}
                  </div>

                  <div className="admin-product-actions">
                    <button
                      type="button"
                      className="admin-edit-button"
                      onClick={() => handleOpenEditProduct(product)}
                    >
                      Modifier
                    </button>

                    <button
                      type="button"
                      className="admin-delete-button"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      Supprimer
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* ==========================
            COMMANDES
        ========================== */}

        <section className="admin-orders">
          <div className="admin-orders-header">
            <div>
              <span className="eyebrow">Ventes</span>

              <h2>Gestion des commandes</h2>

              <p>Consultez et gérez les commandes des clients.</p>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="admin-empty">Aucune commande pour le moment.</div>
          ) : (
            <div className="admin-orders-list">
              {orders.map((order) => (
                <article className="admin-order-card" key={order._id}>
                  <div className="admin-order-main">
                    <strong>
                      Commande #{order._id.slice(-6).toUpperCase()}
                    </strong>

                    <span>{formatDate(order.createdAt)}</span>

                    <span>
                      {order.customer?.firstName} {order.customer?.lastName}
                    </span>

                    <span>{order.customer?.phone}</span>
                  </div>

                  <div className="admin-order-summary">
                    <strong>{formatPrice(order.total)}</strong>

                    <span>{order.items?.length || 0} produit(s)</span>
                  </div>

                  <div className="admin-order-status">
                    <select
                      value={order.status}
                      onChange={(event) =>
                        handleStatusChange(order._id, event.target.value)
                      }
                    >
                      <option value="pending">En attente</option>

                      <option value="confirmed">Confirmée</option>

                      <option value="shipped">Expédiée</option>

                      <option value="delivered">Livrée</option>

                      <option value="cancelled">Annulée</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => setSelectedOrder(order)}
                    >
                      Voir détails
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ==========================
          MODAL PRODUIT
      ========================== */}

      {showProductForm && (
        <div className="admin-modal-overlay">
          <div className="admin-modal admin-product-modal">
            <div className="admin-modal-header">
              <div>
                <span className="eyebrow">Catalogue</span>

                <h2>
                  {editingProduct
                    ? "Modifier le produit"
                    : "Ajouter un produit"}
                </h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={handleCloseProductForm}
              >
                ×
              </button>
            </div>

            <form className="admin-product-form" onSubmit={handleProductSubmit}>
              {productError && (
                <div className="admin-error">{productError}</div>
              )}

              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label htmlFor="name">Nom du produit</label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={productForm.name}
                    onChange={handleProductInputChange}
                    placeholder="Ex : iPhone 16 Pro"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="brand">Marque</label>

                  <input
                    id="brand"
                    name="brand"
                    type="text"
                    value={productForm.brand}
                    onChange={handleProductInputChange}
                    placeholder="Ex : Apple"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="category">Catégorie</label>

                  <select
                    id="category"
                    name="category"
                    value={productForm.category}
                    onChange={handleProductInputChange}
                  >
                    <option value="Téléphones">Téléphones</option>

                    <option value="Accessoires">Accessoires</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="system">Système</label>

                  <select
                    id="system"
                    name="system"
                    value={productForm.system}
                    onChange={handleProductInputChange}
                  >
                    <option value="iOS">iOS</option>
                    <option value="Android">Android</option>
                    <option value="Tous">Tous</option>
                  </select>
                </div>

                <div className="admin-form-group">
                  <label htmlFor="type">Type</label>

                  <input
                    id="type"
                    name="type"
                    type="text"
                    value={productForm.type}
                    onChange={handleProductInputChange}
                    placeholder="Ex : Chargeurs"
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="price">Prix (FCFA)</label>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    value={productForm.price}
                    onChange={handleProductInputChange}
                    placeholder="300000"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="stock">Stock</label>

                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={handleProductInputChange}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label htmlFor="badge">Badge</label>

                  <input
                    id="badge"
                    name="badge"
                    type="text"
                    value={productForm.badge}
                    onChange={handleProductInputChange}
                    placeholder="Ex : Populaire"
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="image">Chemin de l'image</label>

                <input
                  id="image"
                  name="image"
                  type="text"
                  value={productForm.image}
                  onChange={handleProductInputChange}
                  placeholder="/images/iphone-16-pro.png"
                />

                <small>Exemple : /images/12.png</small>
              </div>

              <div className="admin-form-group">
                <label htmlFor="description">Description</label>

                <textarea
                  id="description"
                  name="description"
                  rows="4"
                  value={productForm.description}
                  onChange={handleProductInputChange}
                  placeholder="Description du produit..."
                />
              </div>

              <label className="admin-checkbox">
                <input
                  type="checkbox"
                  name="available"
                  checked={productForm.available}
                  onChange={handleProductInputChange}
                />

                <span>Produit disponible à la vente</span>
              </label>

              <div className="admin-form-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={handleCloseProductForm}
                  disabled={savingProduct}
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={savingProduct}
                >
                  {savingProduct
                    ? "Enregistrement..."
                    : editingProduct
                      ? "Enregistrer les modifications"
                      : "Ajouter le produit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==========================
          MODAL COMMANDE
      ========================== */}

      {selectedOrder && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <div>
                <span className="eyebrow">Commande</span>

                <h2>#{selectedOrder._id.slice(-6).toUpperCase()}</h2>
              </div>

              <button
                type="button"
                className="admin-modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <div className="admin-order-details">
              <div>
                <strong>Client</strong>

                <p>
                  {selectedOrder.customer?.firstName}{" "}
                  {selectedOrder.customer?.lastName}
                </p>

                <p>{selectedOrder.customer?.phone}</p>

                <p>{selectedOrder.customer?.city}</p>

                <p>{selectedOrder.customer?.address}</p>
              </div>

              <div>
                <strong>Livraison</strong>

                <p>
                  {selectedOrder.delivery === "express"
                    ? "Express"
                    : "Standard"}
                </p>

                <p>{formatPrice(selectedOrder.shippingCost)}</p>
              </div>

              <div>
                <strong>Paiement</strong>

                <p>
                  {selectedOrder.payment === "delivery"
                    ? "Paiement à la livraison"
                    : selectedOrder.payment === "wave"
                      ? "Wave"
                      : "Orange Money"}
                </p>
              </div>
            </div>

            <div className="admin-order-items">
              <h3>Produits commandés</h3>

              {selectedOrder.items?.map((item, index) => (
                <div
                  className="admin-order-item"
                  key={`${item.product}-${index}`}
                >
                  <div>
                    <strong>{item.name}</strong>

                    <span>Quantité : {item.quantity}</span>
                  </div>

                  <strong>{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <div className="admin-order-total">
              <span>Sous-total</span>

              <strong>{formatPrice(selectedOrder.subtotal)}</strong>

              <span>Livraison</span>

              <strong>{formatPrice(selectedOrder.shippingCost)}</strong>

              <span>Total</span>

              <strong>{formatPrice(selectedOrder.total)}</strong>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Admin;
