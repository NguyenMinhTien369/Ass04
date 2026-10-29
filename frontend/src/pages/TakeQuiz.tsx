import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, errorMessage } from "../services/api";
import type { Quiz } from "../types";
export default function TakeQuiz() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null),
    [error, setError] = useState("");
  const [current, setCurrent] = useState(0),
    [selected, setSelected] = useState<number | null>(null),
    [score, setScore] = useState(0);
  useEffect(() => {
    let active = true;
    api
      .get<Quiz>(`/quizzes/${quizId}`)
      .then(({ data }) => {
        if (active)
          setQuiz({ ...data, questions: data.questions.filter(Boolean) });
      })
      .catch((error) => {
        if (active) setError(errorMessage(error));
      });
    return () => {
      active = false;
    };
  }, [quizId]);
  if (error)
    return (
      <div role="alert" className="alert alert-danger">
        {error} <Link to="/quizzes">Back to quizzes</Link>
      </div>
    );
  if (!quiz) return <p role="status">Loading quiz…</p>;
  if (!quiz.questions.length)
    return (
      <p>
        This quiz has no questions yet.{" "}
        <Link to="/quizzes">Back to quizzes</Link>
      </p>
    );
  if (current >= quiz.questions.length)
    return (
      <section className="quiz-panel text-center">
        <h2>Quiz Completed</h2>
        <p>
          Your score: {score} / {quiz.questions.length}
        </p>
        <button
          className="btn btn-primary me-2"
          onClick={() => {
            setCurrent(0);
            setScore(0);
            setSelected(null);
          }}
        >
          Restart Quiz
        </button>
        <Link className="btn btn-outline-secondary" to="/quizzes">
          Back to Quizzes
        </Link>
        <p className="small text-secondary mt-3">
          Results are not saved after leaving this page.
        </p>
      </section>
    );
  const question = quiz.questions[current];
  return (
    <section className="quiz-panel">
      <h2 className="text-center">Quiz</h2>
      <p className="text-secondary text-center">
        {quiz.title} · Question {current + 1} / {quiz.questions.length}
      </p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (selected === null) return;
          if (selected === question.correctAnswerIndex) setScore(score + 1);
          setCurrent(current + 1);
          setSelected(null);
        }}
      >
        <fieldset>
          <legend className="h4">{question.text}</legend>
          {question.options.map((option, index) => (
            <label className="d-block mb-2" key={index}>
              <input
                className="form-check-input me-2"
                type="radio"
                name="answer"
                checked={selected === index}
                onChange={() => setSelected(index)}
              />
              {option}
            </label>
          ))}
        </fieldset>
        <button className="btn btn-primary mt-3" disabled={selected === null}>
          Submit Answer
        </button>
      </form>
    </section>
  );
}
