import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import ConfirmModal from "../components/ConfirmModal";
import { api, errorMessage } from "../services/api";
import {
  loadQuestions,
  loadQuizzes,
  useAppDispatch,
  useAppSelector,
} from "../store";
import QuestionForm from "../components/QuestionForm";
import type { QuestionInput, Quiz } from "../types";

interface QuizChanges {
  title: string;
  description: string;
  questions: string[];
}

export default function ManageQuizzes() {
  const dispatch = useAppDispatch(),
    { quizzes, questions } = useAppSelector((state) => state.data);
  const [editing, setEditing] = useState<Quiz | null>(null),
    [title, setTitle] = useState(""),
    [description, setDescription] = useState("");
  const [ids, setIds] = useState<string[]>([]),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [version, setVersion] = useState(0),
    [pendingEdit, setPendingEdit] = useState<QuizChanges | null>(null),
    [pendingDelete, setPendingDelete] = useState<Quiz | null>(null);
  useEffect(() => {
    Promise.all([
      dispatch(loadQuizzes()).unwrap(),
      dispatch(loadQuestions()).unwrap(),
    ])
      .catch((error) => setError(error.message))
      .finally(() => setLoading(false));
  }, [dispatch]);
  function reset() {
    setEditing(null);
    setTitle("");
    setDescription("");
    setIds([]);
  }
  function edit(quiz: Quiz) {
    setEditing(quiz);
    setTitle(quiz.title);
    setDescription(quiz.description);
    setIds(quiz.questions.filter(Boolean).map((q) => q._id));
    setNotice("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function refresh() {
    await Promise.all([
      dispatch(loadQuizzes()).unwrap(),
      dispatch(loadQuestions()).unwrap(),
    ]);
  }
  async function save(event: FormEvent) {
    event.preventDefault();
    const changes = {
      title: title.trim(),
      description: description.trim(),
      questions: ids,
    };

    if (editing) {
      setPendingEdit(changes);
      return;
    }

    await persistQuiz(changes);
  }
  async function persistQuiz(changes: QuizChanges) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      if (editing)
        await api.put(`/quizzes/${editing._id}`, changes);
      else await api.post("/quizzes", changes);
      reset();
      await refresh();
      setNotice("Quiz saved. Use Edit to manage its questions.");
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  async function remove(quiz: Quiz) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await api.delete(`/quizzes/${quiz._id}`);
      if (editing?._id === quiz._id) reset();
      await refresh();
      setNotice("Quiz deleted.");
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  async function confirmEdit() {
    if (!pendingEdit) return;
    await persistQuiz(pendingEdit);
    setPendingEdit(null);
  }
  async function confirmDelete() {
    if (!pendingDelete) return;
    await remove(pendingDelete);
    setPendingDelete(null);
  }
  async function addQuestion(data: QuestionInput) {
    if (!editing) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await api.post(`/quizzes/${editing._id}/question`, data);
      setIds((previous) => [...previous, response.data._id]);
      setVersion(version + 1);
      await refresh();
      setNotice(
        "New question created and added to this quiz. Save Quiz to apply any other changes.",
      );
    } catch (error) {
      setError(errorMessage(error));
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <h2>Manage Quizzes</h2>
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
      <form className="border rounded p-3 mb-4" onSubmit={save}>
        <fieldset disabled={busy}>
          <h3 className="h5">{editing ? "Edit Quiz" : "Add Quiz"}</h3>
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className="form-control mb-3"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="form-label" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="form-control mb-3"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {editing && (
            <fieldset className="mb-3">
              <legend className="h6">Questions in this quiz</legend>
              <p className="small text-secondary">
                Select questions to include. Unchecking only removes the
                question from this quiz. Click Save Quiz to apply.
              </p>
              {questions.length === 0 ? (
                <p>No questions available.</p>
              ) : (
                questions.map((question) => (
                  <label className="d-block mb-2" key={question._id}>
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      checked={ids.includes(question._id)}
                      onChange={(e) =>
                        setIds(
                          e.target.checked
                            ? [...ids, question._id]
                            : ids.filter((id) => id !== question._id),
                        )
                      }
                    />
                    {question.text}
                  </label>
                ))
              )}
            </fieldset>
          )}
          <button
            className="btn btn-primary"
            disabled={!title.trim() || !description.trim()}
          >
            {busy ? "Saving…" : "Save Quiz"}
          </button>
          {editing && (
            <button
              type="button"
              className="btn btn-outline-secondary ms-2"
              onClick={reset}
            >
              Cancel
            </button>
          )}
        </fieldset>
      </form>
      {editing && (
        <>
          <h3 className="h5">Create a new question for this quiz</h3>
          <QuestionForm
            key={`${editing._id}-${version}`}
            busy={busy}
            onSave={addQuestion}
          />
        </>
      )}
      {loading ? (
        <p>Loading quizzes…</p>
      ) : quizzes.length === 0 ? (
        <p>No quizzes yet.</p>
      ) : (
        quizzes.map((quiz) => (
          <article className="border-bottom py-3" key={quiz._id}>
            <h3 className="h5">{quiz.title}</h3>
            <p>{quiz.description}</p>
            <p className="small text-secondary">
              {quiz.questions.filter(Boolean).length} questions
            </p>
            <button
              className="btn btn-warning btn-sm me-2"
              disabled={busy}
              onClick={() => edit(quiz)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger btn-sm"
              disabled={busy}
              onClick={() => setPendingDelete(quiz)}
            >
              Delete
            </button>
          </article>
        ))
      )}
      <ConfirmModal
        open={pendingEdit !== null}
        title="Confirm changes"
        message="Do you want to save the changes to this quiz?"
        confirmLabel="Save Changes"
        busy={busy}
        onConfirm={() => void confirmEdit()}
        onCancel={() => setPendingEdit(null)}
      />
      <ConfirmModal
        open={pendingDelete !== null}
        title="Delete quiz"
        message={`Delete "${pendingDelete?.title || "this quiz"}"? Its questions will remain in the question bank.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        busy={busy}
        onConfirm={() => void confirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}
