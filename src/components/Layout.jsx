import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">📓 ProNotebook</div>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/notebooks">Notebooks</NavLink>
          <NavLink to="/trash">Trash</NavLink>
        </nav>
        <div className="sidebar-footer">
          <div className="user">
            <div className="avatar">{user?.name?.[0]?.toUpperCase() || "U"}</div>
            <div>
              <div className="user-name">{user?.name}</div>
              <div className="muted small">{user?.email}</div>
            </div>
          </div>
          <button className="btn ghost full" onClick={handleLogout}>Log out</button>
        </div>
      </aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
