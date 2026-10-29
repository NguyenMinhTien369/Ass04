# Quiz frontend

React + TypeScript, Redux Toolkit, React Router, Axios and Bootstrap 5.

## Run

Start the backend and MongoDB first. The backend defaults to port 3000.

From the frontend directory:

```sh
npm install
npm run dev
```

Open the URL printed by Vite. During development, `/api` requests are proxied to `http://localhost:3000`.
For a separate API host, set `VITE_API_URL` in `.env.local` (for example `http://localhost:3000/api`). Production hosting must forward `/api` to the backend or provide this variable at build time, and serve index.html for client-side routes.

```sh
npm run build
npm run lint
```

## Organization

- `pages/`: login, quiz flow and administration screens.
- `components/`: shared layout and question form.
- `store/authSlice.ts`: authentication state and actions.
- `store/quizSlice.ts`: quiz and question state and actions.
- `store/store.ts`: Redux store setup and typed hooks.
- `store/index.ts`: short public exports used by components and pages.
- `services/api.ts`: API URL, bearer token and errors.
- `types.ts`: basic API data types.

Tokens are kept in sessionStorage. Reloading restores the account through `/auth/me`; logout clears session data. Signup defaults to a regular user. Enable "Register as admin" to create an admin account for this assignment.

Quiz answers and scores stay in component state. Scores are calculated locally using the answer index already returned by the backend; there is no server-side submission or result history. Refreshing restarts a quiz.

## Manual checks with a running backend

1. Register a user; verify duplicate username and mismatched password feedback.
2. Log in; view quizzes; select answers; finish and restart a quiz.
3. Confirm empty quizzes show a helpful message.
4. Log out; confirm protected routes redirect to login.
5. Register with "Register as admin" enabled, then log in; create, edit and delete questions and quizzes.
6. Edit a quiz; select several bank questions; save and reopen it.
7. Create a new question inside a quiz; verify it appears in the bank and quiz.
8. Uncheck a quiz question and save; verify it remains in the question bank.
9. Check expired-token behavior, unavailable API feedback and narrow-screen layouts.

The existing backend accepts `admin` during signup and retains quiz references when questions are deleted. These backend behaviors were not changed. The UI filters missing questions before rendering.
