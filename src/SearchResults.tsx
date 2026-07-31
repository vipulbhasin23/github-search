import type { GitHubRepo } from "./types";

interface SearchResultsProps {
  results: GitHubRepo[];
  loading: boolean;
  err: string | null;
}

export default function SearchResults({
  results,
  loading,
  err,
}: SearchResultsProps) {
  if (err) return <p>Error: {err}</p>;
  if (loading) return <p>Loading...</p>;
  if (results.length === 0) return <p>No results found.</p>;
  return (
    <ul>
      {results.map((r) => (
        <li key={r.id}>
          <a href={r.html_url}>{r.full_name}</a>
          <p>Description: {r.description}</p>
          <p>Language: {r.language}</p>
          <p>Stars: {r.stargazers_count}</p>
        </li>
      ))}
    </ul>
  );
}
