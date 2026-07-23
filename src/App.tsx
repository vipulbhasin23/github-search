import { useState, useEffect } from 'react'
import useDebounce from './hooks/useDebounce'
import './App.css'

interface GitHubUser {
  id: number
  login: string
  avatar_url: string
  html_url: string
}

function App() {
  const [query, setQuery] = useState<string>('')
  const debouncedQuery = useDebounce(query, 300)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<GitHubUser[]>([])

  useEffect(() => {
    if (debouncedQuery.trim() === '') {
      setResults([])
      return
    }

    const controller = new AbortController()

    async function fetchUsers() {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(
          `https://api.github.com/search/users?q=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal },
        )
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }
        const data: { items: GitHubUser[] } = await response.json()
        setResults(data.items)
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()

    return () => controller.abort()
  }, [debouncedQuery])

  return (
    <main id="search">
      <h1>GitHub Search</h1>
      <input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search GitHub users..."
      />

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <ul className="results">
        {results.map((user) => (
          <li key={user.id}>
            <img src={user.avatar_url} width="32" height="32" alt="" />
            <a href={user.html_url} target="_blank" rel="noreferrer">
              {user.login}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}
export default App
