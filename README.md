# github-search

A GitHub repository search UI built from scratch in React/TypeScript -
debounced search, request cancellation, and a favorites system.

## Status

- [x] Project scaffolding (Vite + React + TS + ESLint)
- [x] Basic search (fetch + display results)
- [x] Test infrastructure (Vitest + React Testing Library)
- [x] Debounce hook
- [x] Request cancellation (AbortController)
- [ ] Performance optimization (useMemo/useCallback)
- [ ] Favorites (Context)

## Running

```bash
git clone https://github.com/vipulbhasin23/github-search.git
cd github-search
npm install
npm run dev
```

## Design notes

See [DECISIONS.md](./DECISIONS.md) for tradeoffs and reasoning as they come up.
