import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "./Register.css";

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
        const message =
          err.response.data.detail ||
          "Unable to create account.";

        setError(`Signup Failed: ${message}`);
      } else if (err.request) {
        setError(
          "Network Error: Could not connect to the server. Is it running?"
        );
      } else {
        setError(
          "An unexpected error occurred during signup."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* Brand */}
        <div className="register-brand">
          <div className="brand-icon">🛒</div>
          <span>Effortless Grocery</span>
        </div>

        {/* Header */}
        <div className="register-header">
          <p className="register-eyebrow">
            Fresh shopping starts here
          </p>

          <h1>Create your account</h1>

          <p className="register-description">
            Join Effortless Grocery and make your everyday
            grocery shopping simple and convenient.
          </p>
        </div>

        {/* Form */}
        <div className="register-form">

          <div className="input-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="button"
            className="register-button"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

          {error && (
            <p className="register-error">
              {error}
            </p>
          )}

        </div>

        {/* Login link */}
        <div className="register-footer">
          <span>Already have an account?</span>{" "}
          <Link to="/login">Login</Link>
        </div>

      </div>

    </div>
  );
}

export default Register;
