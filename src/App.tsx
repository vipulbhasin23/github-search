import { useState, useEffect } from "react";
import SearchInput from "./SearchInput.tsx";

interface GitHubRepo {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
}

interface GitHubSearchResponse {
  total_count: number;
  items: GitHubRepo[];
}

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

  return <SearchInput query={query} onQueryChange={setQuery} />;
}

export default App;
