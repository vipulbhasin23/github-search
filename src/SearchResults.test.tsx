import { render, screen } from "@testing-library/react";
import SearchResults from "./SearchResults";
import type { GitHubRepo } from "./types";

describe("SearchResults", () => {
  it("renders an error message when err is set", () => {
    render(
      <SearchResults err="Something broke" loading={false} results={[]} />,
    );
    expect(screen.getByText(/Error: Something broke/)).toBeInTheDocument();
  });

  it("renders a loading message when loading is true", () => {
    render(<SearchResults err={null} loading={true} results={[]} />);
    expect(screen.getByText(/Loading\.\.\./)).toBeInTheDocument();
  });

  it("renders 'No results found' when results are empty", () => {
    render(<SearchResults err={null} loading={false} results={[]} />);
    expect(screen.getByText(/No results found\./)).toBeInTheDocument();
  });

  it("renders the list of results when populated", () => {
    const mockResults: GitHubRepo[] = [
      {
        id: 1,
        full_name: "octocat/Hello-World",
        html_url: "https://github.com/octocat/Hello-World",
        description: "My first repo",
        language: "TypeScript",
        stargazers_count: 42,
      },
      {
        id: 2,
        full_name: "octocat/Second-Repo",
        html_url: "https://github.com/octocat/Second-Repo",
        description: "Another one",
        language: "JavaScript",
        stargazers_count: 7,
      },
    ];

    render(<SearchResults err={null} loading={false} results={mockResults} />);

    expect(screen.getByText("octocat/Hello-World")).toBeInTheDocument();
    expect(screen.getByText(/My first repo/)).toBeInTheDocument();
    expect(screen.getByText(/TypeScript/)).toBeInTheDocument();
    expect(screen.getByText(/Stars: 42/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "octocat/Hello-World" }),
    ).toHaveAttribute("href", "https://github.com/octocat/Hello-World");

    expect(screen.getByText("octocat/Second-Repo")).toBeInTheDocument();
    expect(screen.getByText(/Another one/)).toBeInTheDocument();
    expect(screen.getByText(/JavaScript/)).toBeInTheDocument();
    expect(screen.getByText(/Stars: 7/)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "octocat/Second-Repo" }),
    ).toHaveAttribute("href", "https://github.com/octocat/Second-Repo");

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders fallback text when description and language are missing", () => {
    const mockResults: GitHubRepo[] = [
      {
        id: 2,
        full_name: "someuser/no-description-repo",
        html_url: "https://github.com/someuser/no-description-repo",
        description: null,
        stargazers_count: 0,
        language: null,
      },
    ];
    render(<SearchResults err={null} loading={false} results={mockResults} />);

    expect(screen.getByText(/No description/)).toBeInTheDocument();
    expect(screen.getByText(/Not specified/)).toBeInTheDocument();
  });

  it("prioritizes the error state over loading", () => {
    render(
      <SearchResults err="An error occurred" loading={true} results={[]} />,
    );
    expect(screen.getByText(/Error: An error occurred/)).toBeInTheDocument();
    expect(screen.queryByText(/Loading\.\.\./)).not.toBeInTheDocument();
  });
});
