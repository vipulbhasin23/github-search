import { useState, useEffect } from "react";
import { useDebounce } from "./hooks/useDebounce.ts";
import SearchInput from "./SearchInput.tsx";
import SearchResults from "./SearchResults.tsx";
import type { GitHubRepo, GitHubSearchResponse } from "./types.ts";

function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const [results, setResults] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!debouncedQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- naive fetch-in-effect is deliberate for now
      setResults([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);

    const controller = new AbortController();

    fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(debouncedQuery)}`,
      { signal: controller.signal },
    )
      .then((response) => {
        if (!response.ok)
          throw new Error(`GitHub API error: ${response.status}`);
        return response.json() as Promise<GitHubSearchResponse>;
      })
      .then((data) => setResults(data.items))
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
      })
      .finally(() => {
        if (controller.signal.aborted) return;
        setLoading(false);
      });

    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <>
      <SearchInput query={query} onQueryChange={setQuery} />
      {query.trim() !== "" && (
        <SearchResults results={results} loading={loading} err={error} />
      )}
    </>
  );
}

export default App;
