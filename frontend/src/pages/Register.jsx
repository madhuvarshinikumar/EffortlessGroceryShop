import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

function Register() {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      await API.post("/signup", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response) {
        const message = err.response.data.detail || "Unable to create account.";
        setError(`Signup Failed: ${message}`);
      } else if (err.request) {
        setError("Network Error: Could not connect to the server. Is it running?");
      } else {
        setError("An unexpected error occurred during signup.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="page-card page-card-narrow">
        <div className="page-header">
          <p className="eyebrow">Create your account</p>
          <h1>Signup for Effortless Shop</h1>
          <p className="page-subtitle">Register quickly and start browsing the store with an elegant fullscreen dashboard.</p>
        </div>

        <div className="form-container">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <input
            placeholder="Email"
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

          <button onClick={handleSignup} disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
          {error && <p className="error-message">{error}</p>}
          <p className="small-text">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
