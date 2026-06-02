import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/common/Button";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/my-tickets");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <img src="/logo-icon.png" alt="ScoreTicket" className="auth-logo-img" />

        <span className="auth-card__badge">Welcome back</span>
        <h1>Login to ScoreTicket</h1>
        <p>Access your tickets and manage your bookings.</p>

        {error && <div className="form-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="Your password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <Button type="submit">Login</Button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </section>
  );
}

export default Login;