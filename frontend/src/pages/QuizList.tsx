import { useEffect } from "react";
import { Link } from "react-router-dom";
import { loadQuizzes, useAppDispatch, useAppSelector } from "../store";
export default function QuizList() {
  const dispatch = useAppDispatch(),
    { quizzes, loading, error } = useAppSelector((state) => state.data);
  useEffect(() => {
    void dispatch(loadQuizzes());
  }, [dispatch]);
  return (
    <>
      <h2 className="mb-4">Quizzes</h2>
      {loading ? (
        <p role="status">Loading quizzes…</p>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}{" "}
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => dispatch(loadQuizzes())}
          >
            Retry
          </button>
        </div>
      ) : quizzes.length === 0 ? (
        <p>No quizzes available yet.</p>
      ) : (
        <div className="row g-3">
          {quizzes.map((quiz) => (
            <div className="col-md-6" key={quiz._id}>
              <article className="card h-100">
                <div className="card-body">
                  <h3 className="h5">{quiz.title}</h3>
                  <p>{quiz.description}</p>
                  <p className="text-secondary">
                    {quiz.questions.filter(Boolean).length} questions
                  </p>
                  <Link className="btn btn-primary" to={`/quizzes/${quiz._id}`}>
                    Start Quiz
                  </Link>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
