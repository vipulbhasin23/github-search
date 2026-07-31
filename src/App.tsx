import { useState, useEffect } from "react";
import SearchInput from "./SearchInput.tsx";
import SearchResults from "./SearchResults.tsx";
import type { GitHubRepo, GitHubSearchResponse } from "./types.ts";

function App() {
  const [query, setQuery] = useState("");

  const [results, setResults] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (query.trim() === "") return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- naive fetch-in-effect is deliberate for now
    setLoading(true);
    setError(null);

    fetch(
      `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}`,
    )
      .then((response) => {
        if (!response.ok)
          throw new Error(`GitHub API error: ${response.status}`);
        return response.json() as Promise<GitHubSearchResponse>;
      })
      .then((data) => setResults(data.items))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query]);

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
