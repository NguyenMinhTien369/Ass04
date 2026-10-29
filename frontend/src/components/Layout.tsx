import { NavLink, Outlet } from "react-router-dom";
import { clearData, signedOut, useAppDispatch, useAppSelector } from "../store";
export default function Layout() {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  function logout() {
    sessionStorage.removeItem("token");
    dispatch(signedOut());
    dispatch(clearData());
  }
  return (
    <div className="container app-container">
      <header className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
        <h1>{user?.admin ? "Admin Dashboard" : "Dashboard"}</h1>
        <span>Welcome, {user?.username}</span>
      </header>
      <nav className="nav bg-light p-2 mb-4" aria-label="Main navigation">
        <NavLink
          className="nav-link"
          to={user?.admin ? "/admin" : "/dashboard"}
          end
        >
          Home
        </NavLink>
        {user?.admin ? (
          <>
            <NavLink className="nav-link" to="/admin/questions">
              Manage Questions
            </NavLink>
            <NavLink className="nav-link" to="/admin/quizzes">
              Manage Quizzes
            </NavLink>
          </>
        ) : (
          <NavLink className="nav-link" to="/quizzes">
            Quiz
          </NavLink>
        )}
        <button className="nav-link" onClick={logout}>
          Logout
        </button>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
