## Debounce

1. **`useDebounce` is a value-debouncing hook, not a callback-debouncing one.**
   It takes a raw value and returns a delayed copy that only updates once
   the value has stopped changing for the delay period, rather than wrapping
   a function call. This is the more idiomatic React pattern: `SearchInput`
   keeps updating `query` immediately on every keystroke (so typing stays
   responsive), while a separate `debouncedQuery` lags behind and drives the
   actual search effect.
2. **300ms delay,** chosen as a reasonable default for search-as-you-type
   UX - not benchmarked against this specific API, just a common baseline;
   revisit if it feels too slow/fast in practice.
3. **On an empty `debouncedQuery`, `results` and `error` are explicitly reset, but `loading` is deliberately left alone.**
   Without an explicit reset, `results`/`error` would remain stale from the
   last search - they only ever update on a **new** successful/failed fetch, so
   nothing else clears them naturally. `loading` doesn't have this problem:
   it always gets reset back to `false` by the in-flight fetch's own `.finally()`
   regardless, so an explicit reset here would only shave a few hundred ms off
   a state that isn't visibly rendered anyway (`SearchResults` isn't shown
   while the query is empty).

## Testing

1. **jsdom + `@testing-library/user-event`, not a real browser test runner (Vitest Browser Mode / PlayWright).**
   `user-event`'s own docs recommend real-browser testing when available,
   since jsdom doesn't perfectly replicate browser behavior. Chosen anyway:
   reconfiguring test infrastructure was out of scope for what #5 needed, and
   jsdom + RTL is sufficient for testing these components' actual logic
   (prop rendering, callback firing) rather than browser-specific rendering
   quirks.
2. **Tested beyond #5's stated acceptance criteria:** state-priority
   (error takes precedence over loading when both are true) and
   null-fallback rendering (description/language) weren't explicitly listed,
   but are real behavior in `SearchResults` worth locking in against
   regression.

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
