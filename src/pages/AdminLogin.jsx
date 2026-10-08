import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AdminLogin() {
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

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          username,
          password,
        },
      );

      localStorage.setItem("admin", JSON.stringify(response.data.admin));

      localStorage.setItem("adminToken", response.data.token);

      navigate("/admin");
    } catch (error) {
      setError(error.response?.data?.message || "Impossible de se connecter.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <h1>LibertyShop</h1>

        <p>Connexion administrateur</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Identifiant</label>

            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Votre identifiant"
              required
            />
          </div>

          <div>
            <label>Mot de passe</label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>

          {error && <p className="admin-login-error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
