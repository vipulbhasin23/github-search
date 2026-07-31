## Basic search with useState / useEffect:

- Naive fetch-in-effect: Built basic search with no debounce or request
  cancellation. Typing quickly fires overlapping requests - since network
  responses can arrive out of order, an older request's response can arrive
  after a newer one's, overwriting correct results with stale
  ones. Will be fixed in the next issue (debounce + AbortController).
- Used `??` fallback for null description/language fields from the GitHub API.
- Extracted shared types (GitHubRepo/GitHubSearchResponse) into types.ts,
  imported in App.tsx and SearchResults.tsx.
