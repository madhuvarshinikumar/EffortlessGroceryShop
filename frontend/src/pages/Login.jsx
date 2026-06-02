import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { AuthContext } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.access_token);
      window.dispatchEvent(new Event("storage"));

      navigate("/products");
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        "Invalid credentials";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">

      {/* CARD */}
      <div className="auth-card">

        <div className="auth-header">
          <p className="eyebrow">Welcome back 👋</p>
          <h2>Login to your account</h2>
          <p className="auth-subtext">
            Continue your fresh grocery shopping experience
          </p>
        </div>

        <div className="auth-form">

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />

          <button
            className="login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <p className="error-text">{error}</p>
          )}

          <p className="auth-footer">
            Don’t have an account?{" "}
            <Link to="/signup">Sign up</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;