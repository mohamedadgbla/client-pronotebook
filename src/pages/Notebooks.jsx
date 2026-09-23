import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function Notebooks() {
  const [notebooks, setNotebooks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const load = () =>
    api.get("/notebooks").then((res) => setNotebooks(res.data.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post("/notebooks", { title });
      setTitle("");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create notebook");
    }
  };

  const remove = async (id) => {
    if (!confirm("Move this notebook (and its notes) to trash?")) return;
    await api.delete(`/notebooks/${id}`);
    load();
  };

  return (
    <div>
      <div className="page-head">
        <h1>Notebooks</h1>
      </div>

      <form className="inline-form" onSubmit={create}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New notebook title…"
        />
        <button className="btn primary">Create</button>
      </form>
      {error && <div className="alert">{error}</div>}

      <div className="card-grid">
        {notebooks.map((nb) => (
          <div className="notebook-card" key={nb._id} style={{ borderTopColor: nb.color }}>
            <Link to={`/notebooks/${nb._id}`} className="notebook-title">
              {nb.isPinned && "📌 "}
              {nb.title}
            </Link>
            <p className="muted small">{nb.description || "No description"}</p>
            <div className="row-actions">
              <Link to={`/notebooks/${nb._id}`} className="btn ghost small">Open</Link>
              <button className="btn ghost small danger" onClick={() => remove(nb._id)}>
                Trash
              </button>
            </div>
          </div>
        ))}
        {notebooks.length === 0 && <p className="muted">No notebooks yet.</p>}
      </div>
    </div>
  );
}
