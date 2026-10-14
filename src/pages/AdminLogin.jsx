
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const API_URL = (
        import.meta.env.VITE_API_URL ||
        "http://localhost:5000/api"
      ).replace(/\/+$/, "");

      const response = await axios.post(
        API_URL + "/auth/login",
        {
          username,
          password,
        }
      );

      if (!response.data?.token || !response.data?.admin) {
        throw new Error("Réponse de connexion invalide.");
      }

      localStorage.setItem(
        "admin",
        JSON.stringify(response.data.admin)
      );

      localStorage.setItem("adminToken", response.data.token);

      navigate("/admin");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Impossible de se connecter."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <h1>LibertyShop</h1>
      <h2>Connexion administrateur</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Identifiant</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="Votre identifiant"
            autoComplete="username"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Votre mot de passe"
            autoComplete="current-password"
            required
          />
        </div>

        {error && <p role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </main>
  );
}
