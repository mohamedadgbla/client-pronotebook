import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      const errs = err.response?.data?.errors;
      setError(errs?.[0]?.message || err.response?.data?.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <h1>Create your account</h1>
        <p className="muted">Start organising your notes professionally</p>
        {error && <div className="alert">{error}</div>}
        <label>Full name</label>
        <input value={form.name} onChange={set("name")} required />
        <label>Username</label>
        <input value={form.username} onChange={set("username")} required />
        <label>Email</label>
        <input type="email" value={form.email} onChange={set("email")} required />
        <label>Password</label>
        <input type="password" value={form.password} onChange={set("password")} minLength={6} required />
        <button className="btn primary full" disabled={busy}>
          {busy ? "Creating…" : "Create account"}
        </button>
        <p className="muted center">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
