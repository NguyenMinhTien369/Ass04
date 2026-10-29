import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { Provider } from "react-redux";
import {
  clearData,
  loadUser,
  signedOut,
  store,
  useAppDispatch,
  useAppSelector,
} from "./store";
import Layout from "./components/Layout";
import AuthPage from "./pages/AuthPage";
import QuizList from "./pages/QuizList";
import TakeQuiz from "./pages/TakeQuiz";
import ManageQuestions from "./pages/ManageQuestions";
import ManageQuizzes from "./pages/ManageQuizzes";
import "./App.css";

function Guard({ admin = false }: { admin?: boolean }) {
  const { user, ready } = useAppSelector((state) => state.auth);
  if (!ready) return <p className="container py-5">Loading account…</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && !user.admin) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
function Home() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <div className="py-4">
      <h2>Welcome, {user?.username}</h2>
      <p className="text-secondary">
        {user?.admin
          ? "Manage quizzes and questions using the menu above."
          : "Open Quiz to choose a quiz and test your knowledge."}
      </p>
    </div>
  );
}
function AppRoutes() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (sessionStorage.getItem("token")) void dispatch(loadUser());
    else dispatch(signedOut());
    const expire = () => {
      dispatch(signedOut());
      dispatch(clearData());
    };
    window.addEventListener("session-expired", expire);
    return () => window.removeEventListener("session-expired", expire);
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage register />} />
      <Route element={<Guard />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Home />} />
          <Route path="/quizzes" element={<QuizList />} />
          <Route path="/quizzes/:quizId" element={<TakeQuiz />} />
          <Route element={<Guard admin />}>
            <Route path="/admin" element={<Home />} />
            <Route path="/admin/questions" element={<ManageQuestions />} />
            <Route path="/admin/quizzes" element={<ManageQuizzes />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}
