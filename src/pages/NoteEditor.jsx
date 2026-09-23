import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../api/client";

export default function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    api.get(`/notes/${id}`).then((res) => {
      setNote(res.data.data);
      setTitle(res.data.data.title);
      setContent(res.data.data.content || "");
    });
  }, [id]);

  const save = useCallback(async () => {
    setStatus("Saving…");
    try {
      await api.patch(`/notes/${id}`, { title, content });
      setStatus("Saved ✓");
      setTimeout(() => setStatus(""), 1500);
    } catch (err) {
      setStatus(err.response?.data?.message || "Save failed");
    }
  }, [id, title, content]);

  const toggle = async (field) => {
    const { data } = await api.patch(`/notes/${id}`, { [field]: !note[field] });
    setNote(data.data);
  };

  const trash = async () => {
    if (!confirm("Move this note to trash?")) return;
    await api.delete(`/notes/${id}`);
    navigate(-1);
  };

  if (!note) return <div className="muted">Loading note…</div>;

  return (
    <div className="editor">
      <div className="page-head">
        <button className="btn ghost small" onClick={() => navigate(-1)}>← Back</button>
        <div className="row-actions">
          <span className="muted small">{status}</span>
          <button className="btn ghost small" onClick={() => toggle("isFavorite")}>
            {note.isFavorite ? "★ Favorited" : "☆ Favorite"}
          </button>
          <button className="btn ghost small" onClick={() => toggle("isPinned")}>
            {note.isPinned ? "📌 Pinned" : "Pin"}
          </button>
          <button className="btn ghost small" onClick={() => setPreview((p) => !p)}>
            {preview ? "Edit" : "Preview"}
          </button>
          <button className="btn primary small" onClick={save}>Save</button>
          <button className="btn ghost small danger" onClick={trash}>Trash</button>
        </div>
      </div>

      <input
        className="title-input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
      />

      {preview ? (
        <div className="markdown">
          <ReactMarkdown>{content || "*Nothing to preview*"}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          className="content-input"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write in Markdown…  # Heading, **bold**, - list"
        />
      )}
    </div>
  );
}
