export interface GitHubRepo {
  id: number;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
}

export interface GitHubSearchResponse {
  total_count: number;
  items: GitHubRepo[];
}
