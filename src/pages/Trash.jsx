import { useEffect, useState } from "react";
import api from "../api/client";

export default function Trash() {
  const [notes, setNotes] = useState([]);

  const load = () =>
    api.get("/notes/trash").then((res) => setNotes(res.data.data)).catch(() => {});

  useEffect(() => {
    load();
  }, []);

  const restore = async (id) => {
    await api.post(`/notes/${id}/restore`);
    load();
  };
  const destroy = async (id) => {
    if (!confirm("Permanently delete this note? This cannot be undone.")) return;
    await api.delete(`/notes/${id}/permanent`);
    load();
  };
  const empty = async () => {
    if (!confirm("Empty the entire trash permanently?")) return;
    await api.delete("/notes/trash/empty");
    load();
  };

  return (
    <div>
      <div className="page-head">
        <h1>Trash</h1>
        {notes.length > 0 && (
          <button className="btn ghost small danger" onClick={empty}>Empty trash</button>
        )}
      </div>

      <ul className="list">
        {notes.map((n) => (
          <li key={n._id} className="list-row">
            <span>{n.title}</span>
            <span className="row-actions">
              <button className="btn ghost small" onClick={() => restore(n._id)}>Restore</button>
              <button className="btn ghost small danger" onClick={() => destroy(n._id)}>Delete</button>
            </span>
          </li>
        ))}
        {notes.length === 0 && <p className="muted">Trash is empty.</p>}
      </ul>
    </div>
  );
}
