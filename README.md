[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://vipulbhasin23.github.io/github-search/)

# GitHub User Search

A small React + TypeScript app for searching GitHub users, built as a hands-on refresher project after several years away from front-end development — rebuilding core patterns from scratch, from `useState`/`useEffect` through custom hooks, memoization, and Context, committed incrementally rather than generated all at once.

## Status: in progress

This repo is being built step by step, with each stage adding a specific concept. Commit history reflects that progression rather than a single finished drop.

- [x] Basic search with `useState` + `useEffect` (fetch GitHub users on input change), typed from the start
- [x] Debounced input via a custom `useDebounce` hook
- [x] Request cancellation / race-condition handling with `AbortController` in an effect cleanup
- [ ] Client-side filtering with `useMemo`, callback stability with `useCallback`
- [ ] Global "favorites" state via React Context + a custom `useFavorites` hook

## Tech stack

- React (function components + hooks)
- Vite
- TypeScript (used throughout, from the first commit)
- [GitHub Search API](https://docs.github.com/en/rest/search) — no auth required for basic usage

## What this demonstrates

- Modern hook-based state and side-effect management, replacing class-component lifecycle methods
- Writing and reasoning about custom hooks
- Handling real-world async pitfalls (race conditions, cleanup, debouncing) rather than a naive fetch-on-every-keystroke implementation
- Sensible use of memoization — and where it isn't necessary
- Context for shared state without prop drilling
- TypeScript used throughout — typed API responses, props, and hooks from the first line of code, not bolted on afterward

## Running locally

```bash
git clone https://github.com/vipulbhasin23/github-search.git
cd github-search
npm install
npm run dev
```

Then open the local URL Vite prints (typically `http://localhost:5173`).

---

Vipul Bhasin · [LinkedIn](https://www.linkedin.com/in/bhasinvipul)
