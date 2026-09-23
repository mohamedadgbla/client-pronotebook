import { useEffect, useState, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function NotebookNotes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notebook, setNotebook] = useState(null);
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    const params = { notebook: id, page, limit: 10 };
    if (search) params.search = search;
    const [nb, list] = await Promise.all([
      api.get(`/notebooks/${id}`),
      api.get("/notes", { params }),
    ]);
    setNotebook(nb.data.data);
    setNotes(list.data.data);
    setPagination(list.data.pagination);
  }, [id, page, search]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  const createNote = async () => {
    const { data } = await api.post("/notes", {
      title: "Untitled note",
      content: "",
      notebook: id,
    });
    navigate(`/notes/${data.data._id}`);
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <Link to="/notebooks" className="muted small">← Notebooks</Link>
          <h1>{notebook?.title || "Notebook"}</h1>
        </div>
        <button className="btn primary" onClick={createNote}>+ New note</button>
      </div>

      <input
        className="search"
        placeholder="Search notes in this notebook…"
        value={search}
        onChange={(e) => { setPage(1); setSearch(e.target.value); }}
      />

      <ul className="list">
        {notes.map((n) => (
          <li key={n._id} className="list-row">
            <Link to={`/notes/${n._id}`}>
              {n.isPinned && "📌 "}{n.isFavorite && "⭐ "}{n.title}
            </Link>
            <span className="muted small">
              {new Date(n.updatedAt).toLocaleString()}
            </span>
          </li>
        ))}
        {notes.length === 0 && <p className="muted">No notes found.</p>}
      </ul>

      {pagination && pagination.totalPages > 1 && (
        <div className="pager">
          <button className="btn ghost small" disabled={!pagination.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}>Prev</button>
          <span className="muted small">Page {pagination.page} / {pagination.totalPages}</span>
          <button className="btn ghost small" disabled={!pagination.hasNextPage}
            onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
