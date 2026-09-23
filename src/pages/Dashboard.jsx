import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/dashboard")
      .then((res) => setData(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load dashboard"));
  }, []);

  if (error) return <div className="alert">{error}</div>;
  if (!data) return <div className="muted">Loading dashboard…</div>;

  const cards = [
    { label: "Notes", value: data.totals.totalNotes },
    { label: "Notebooks", value: data.totals.totalNotebooks },
    { label: "Folders", value: data.totals.totalFolders },
    { label: "Favorites", value: data.notes.favoriteNotes },
    { label: "Pinned", value: data.notes.pinnedNotes },
    { label: "In Trash", value: data.notes.trashedNotes },
  ];

  return (
    <div>
      <div className="page-head">
        <h1>Dashboard</h1>
      </div>

      <div className="stat-grid">
        {cards.map((c) => (
          <div className="stat-card" key={c.label}>
            <div className="stat-value">{c.value}</div>
            <div className="stat-label">{c.label}</div>
          </div>
        ))}
      </div>

      <h2 className="section-title">Recently edited</h2>
      {data.recentNotes.length === 0 ? (
        <p className="muted">No notes yet. Create your first notebook.</p>
      ) : (
        <ul className="list">
          {data.recentNotes.map((n) => (
            <li key={n._id} className="list-row">
              <Link to={`/notes/${n._id}`}>{n.title}</Link>
              <span className="muted small">
                {n.notebook?.title} · {new Date(n.updatedAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
