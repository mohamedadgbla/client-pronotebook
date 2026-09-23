import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Notebooks from "./pages/Notebooks";
import NotebookNotes from "./pages/NotebookNotes";
import NoteEditor from "./pages/NoteEditor";
import Trash from "./pages/Trash";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/notebooks" element={<Notebooks />} />
        <Route path="/notebooks/:id" element={<NotebookNotes />} />
        <Route path="/notes/:id" element={<NoteEditor />} />
        <Route path="/trash" element={<Trash />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
