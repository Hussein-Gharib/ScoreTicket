import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/common/Button";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
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
      const response = await api.post("/auth/register", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/my-tickets");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <img src="/logo-icon.png" alt="ScoreTicket" className="auth-logo-img" />

        <span className="auth-card__badge">Join ScoreTicket</span>
        <h1>Create your account</h1>
        <p>Start booking football tickets in a few clicks.</p>

        {error && <div className="form-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              name="full_name"
              placeholder="Hussein Gharib"
              value={formData.full_name}
              onChange={handleChange}
            />
          </label>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <Button type="submit">Create Account</Button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </section>
  );
}

export default Register;