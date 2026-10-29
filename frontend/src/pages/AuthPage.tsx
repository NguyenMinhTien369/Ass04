import { useState } from "react";
import type { FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api, errorMessage } from "../services/api";
import { signedIn, useAppDispatch, useAppSelector } from "../store";
export default function AuthPage({ register = false }: { register?: boolean }) {
  const [admin, setAdmin] = useState(false);
  const [username, setUsername] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const user = useAppSelector((state) => state.auth.user),
    dispatch = useAppDispatch(),
    navigate = useNavigate();
  if (user)
    return <Navigate to={user.admin ? "/admin" : "/dashboard"} replace />;
  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setNotice("");
    if (register && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      if (register) {
        await api.post("/auth/signup", { username: username.trim(), password, admin });
        setAdmin(false);
        setPassword("");
        setConfirm("");
        setNotice("Account created. Please log in.");
        navigate("/login");
      } else {
        const { data } = await api.post("/auth/login", {
          username: username.trim(),
          password,
        });
        sessionStorage.setItem("token", data.token);
        dispatch(signedIn(data.user));
        navigate(data.user.admin ? "/admin" : "/dashboard");
      }
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <form className="auth-card border rounded p-4" onSubmit={submit}>
        <h1 className="h4 text-center mb-4">
          {register ? "Register" : "Login"}
        </h1>
        {error && (
          <div role="alert" className="alert alert-danger">
            {error}
          </div>
        )}
        {notice && (
          <div role="status" className="alert alert-success">
            {notice}
          </div>
        )}
        <label className="form-label" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          className="form-control mb-3"
          autoComplete="username"
          required
          minLength={3}
          maxLength={50}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label className="form-label" htmlFor="password">
          Password
        </label>
        <div className="input-group mb-3">
          <input
            id="password"
            className="form-control"
            autoComplete={register ? "new-password" : "current-password"}
            type={show ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            aria-label={show ? "Hide password" : "Show password"}
            onClick={() => setShow(!show)}
          >
            {show ? "Hide" : "Show"}
          </button>
        </div>
        {register && (
          <>
            <label className="form-label" htmlFor="confirm">
              Confirm password
            </label>
            <input
              id="confirm"
              className="form-control mb-3"
              type="password"
              autoComplete="new-password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <div className="form-check form-switch mb-3">
              <input
                id="admin"
                className="form-check-input"
                type="checkbox"
                role="switch"
                checked={admin}
                disabled={busy}
                onChange={(e) => setAdmin(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="admin">
                Register as admin
              </label>
            </div>
          </>
        )}
        <button disabled={busy} className="btn btn-primary w-100">
          {busy ? "Please wait…" : register ? "Register" : "Login"}
        </button>
        <p className="small text-center mt-3 mb-0">
          <Link
            to={register ? "/login" : "/register"}
            onClick={() => {
              setError("");
              setNotice("");
              setAdmin(false);
            }}
          >
            {register
              ? "Already have an account? Login here"
              : "Don't have an account? Register here"}
          </Link>
        </p>
      </form>
    </main>
  );
}
