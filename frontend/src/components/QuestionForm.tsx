import { useState } from "react";
import type { QuestionInput } from "../types";
const empty: QuestionInput = {
  text: "",
  options: ["", "", "", ""],
  correctAnswerIndex: 0,
  keywords: [],
};
export default function QuestionForm({
  initial = empty,
  busy,
  onSave,
  onCancel,
}: {
  initial?: QuestionInput;
  busy: boolean;
  onSave: (data: QuestionInput) => void;
  onCancel?: () => void;
}) {
  const [text, setText] = useState(initial.text),
    [options, setOptions] = useState(initial.options),
    [correct, setCorrect] = useState(initial.correctAnswerIndex),
    [keywords, setKeywords] = useState(initial.keywords.join(", "));
  return (
    <form
      className="border rounded p-3 mb-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({
          text: text.trim(),
          options: options.map((value) => value.trim()),
          correctAnswerIndex: correct,
          keywords: keywords
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean),
        });
      }}
    >
      <fieldset disabled={busy}>
        <label className="form-label" htmlFor="question-text">
          Question
        </label>
        <input
          id="question-text"
          className="form-control mb-3"
          required
          pattern=".*\S.*"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <p className="small text-secondary">
          Enter the options and select the correct answer.
        </p>
        {options.map((option, index) => (
          <div className="d-flex align-items-center gap-2 mb-2" key={index}>
            <input
              type="radio"
              name="correct"
              aria-label={`Option ${index + 1} is correct`}
              checked={correct === index}
              onChange={() => setCorrect(index)}
            />
            <input
              className="form-control"
              aria-label={`Option ${index + 1}`}
              required
              pattern=".*\S.*"
              value={option}
              onChange={(e) =>
                setOptions(
                  options.map((value, i) =>
                    i === index ? e.target.value : value,
                  ),
                )
              }
            />
            <button
              type="button"
              className="btn btn-outline-danger"
              disabled={options.length <= 2}
              aria-label={`Remove option ${index + 1}`}
              onClick={() => {
                setOptions(options.filter((_, i) => i !== index));
                setCorrect(
                  correct === index
                    ? 0
                    : correct > index
                      ? correct - 1
                      : correct,
                );
              }}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary mb-3"
          onClick={() => setOptions([...options, ""])}
        >
          Add option
        </button>
        <label htmlFor="keywords" className="form-label d-block">
          Keywords (comma separated)
        </label>
        <input
          id="keywords"
          className="form-control mb-3"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <button
          className="btn btn-primary"
          disabled={!text.trim() || options.some((option) => !option.trim())}
        >
          {busy ? "Saving…" : "Save Question"}
        </button>
        {onCancel && (
          <button
            type="button"
            className="btn btn-outline-secondary ms-2"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </fieldset>
    </form>
  );
}
