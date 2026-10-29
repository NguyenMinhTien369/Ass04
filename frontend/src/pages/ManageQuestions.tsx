import { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import QuestionForm from "../components/QuestionForm";
import { api, errorMessage } from "../services/api";
import { loadQuestions, useAppDispatch, useAppSelector } from "../store";
import type { Question, QuestionInput } from "../types";
export default function ManageQuestions() {
  const dispatch = useAppDispatch(),
    questions = useAppSelector((state) => state.data.questions);
  const [editing, setEditing] = useState<Question | null>(null),
    [version, setVersion] = useState(0),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [pendingEdit, setPendingEdit] = useState<QuestionInput | null>(null),
    [pendingDelete, setPendingDelete] = useState<Question | null>(null);
  useEffect(() => {
    dispatch(loadQuestions())
      .unwrap()
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [dispatch]);
  async function save(data: QuestionInput) {
    if (editing) {
      setPendingEdit(data);
      return;
    }

    await persistQuestion(data);
  }
  async function persistQuestion(data: QuestionInput) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (editing) await api.put(`/questions/${editing._id}`, data);
      else await api.post("/questions", data);
      await dispatch(loadQuestions()).unwrap();
      setEditing(null);
      setVersion(version + 1);
      setNotice("Question saved.");
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  async function remove(question: Question) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.delete(`/questions/${question._id}`);
      await dispatch(loadQuestions()).unwrap();
      if (editing?._id === question._id) setEditing(null);
      setNotice("Question deleted.");
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  async function confirmEdit() {
    if (!pendingEdit) return;
    await persistQuestion(pendingEdit);
    setPendingEdit(null);
  }
  async function confirmDelete() {
    if (!pendingDelete) return;
    await remove(pendingDelete);
    setPendingDelete(null);
  }
  return (
    <>
      <h2>Questions</h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {notice && (
        <div className="alert alert-success" role="status">
          {notice}
        </div>
      )}
      <h3 className="h5">{editing ? "Edit Question" : "Add Question"}</h3>
      <QuestionForm
        key={`${editing?._id || "new"}-${version}`}
        initial={editing || undefined}
        busy={busy}
        onSave={save}
        onCancel={editing ? () => setEditing(null) : undefined}
      />
      {loading ? (
        <p>Loading questions…</p>
      ) : questions.length === 0 ? (
        <p>No questions yet.</p>
      ) : (
        questions.map((question) => (
          <article key={question._id} className="border-bottom py-3">
            <h3 className="h5">{question.text}</h3>
            <ul>
              {question.options.map((option, i) => (
                <li key={i}>
                  {option}
                  {i === question.correctAnswerIndex && (
                    <span className="text-success"> — Correct answer</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="small text-secondary">
              {question.keywords.join(", ")}
            </p>
            <button
              className="btn btn-warning btn-sm me-2"
              disabled={busy}
              onClick={() => {
                setEditing(question);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              disabled={busy}
              onClick={() => setPendingDelete(question)}
            >
              Delete
            </button>
          </article>
        ))
      )}
      <ConfirmModal
        open={pendingEdit !== null}
        title="Confirm changes"
        message="Do you want to save the changes to this question?"
        confirmLabel="Save Changes"
        busy={busy}
        onConfirm={() => void confirmEdit()}
        onCancel={() => setPendingEdit(null)}
      />
      <ConfirmModal
        open={pendingDelete !== null}
        title="Delete question"
        message={`Delete "${pendingDelete?.text || "this question"}"? This may affect quizzes using it.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        busy={busy}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
