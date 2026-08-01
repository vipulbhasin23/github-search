## Testing setup: Vitest + React Testing Library

- Chose Vitest over Jest because it pairs natively with Vite's config - Jest would
  need extra setup (ts-jest or babel-jest) to work with this project's tooling.
- Chose React Testing Library because it's the current standard the React docs
  point to, and it tests user-facing behavior (what renders, what a user can click/
  type) than component internals.
- jsdom configured as the test environment so tests can render components in a
  fake DOM without a real browser.
- Wrote a minimal smoke test first (renders a simple component, asserts it's in
  the DOM) to confirm the whole pipeline - Vitest finding the test, jsdom faking
  the DOM, RTL rendering into it - actually works, before writing real component
  tests on top of it.

## Basic search with useState / useEffect:

- Naive fetch-in-effect: Built basic search with no debounce or request
  cancellation. Typing quickly fires overlapping requests - since network
  responses can arrive out of order, an older request's response can arrive
  after a newer one's, overwriting correct results with stale
  ones. Will be fixed in the next issue (debounce + AbortController).
- Used `??` fallback for null description/language fields from the GitHub API.
- Extracted shared types (GitHubRepo/GitHubSearchResponse) into types.ts,
  imported in App.tsx and SearchResults.tsx.
