import { fireEvent, render, screen, act } from "@testing-library/react";
import { vi } from "vitest";
import App from "./App";

describe("App", () => {
  it("renders the search input", () => {
    render(<App />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});

describe("request cancellation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("aborts the in-flight request when a new search supersedes it, and only the latest result is reflected", async () => {
    function deferred<T>() {
      let resolve!: (value: T) => void;
      let reject!: (reason: unknown) => void;
      const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
      });
      return { promise, resolve, reject };
    }

    const deferredA = deferred<Response>();
    const deferredB = deferred<Response>();
    const signals: AbortSignal[] = [];

    let callCount = 0;
    globalThis.fetch = vi.fn((_url, options) => {
      callCount++;
      const current = callCount == 1 ? deferredA : deferredB;
      signals.push(options.signal);

      options.signal.addEventListener("abort", () => {
        const abortError = new Error("The operation was aborted");
        abortError.name = "AbortError";
        current.reject(abortError);
      });

      return current.promise;
    });

    render(<App />);
    const input = screen.getByRole("textbox");

    // First search: "react"
    fireEvent.change(input, { target: { value: "react" } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    // Second search, before A resolves: clear and type "redux"
    fireEvent.change(input, { target: { value: "redux" } });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(signals[0].aborted).toBe(true);

    // Now resolve OUT OF ORDER: B first, then A (late arrival)
    deferredB.resolve({
      ok: true,
      json: async () => ({
        items: [
          {
            id: 2,
            full_name: "redux/repo",
            html_url: "https://github.com/redux/repo",
            description: null,
            language: null,
            stargazers_count: 1,
          },
        ],
      }),
    } as Response);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    deferredA.resolve({
      ok: true,
      json: async () => ({
        items: [
          {
            id: 1,
            full_name: "react/repo",
            html_url: "https://github.com/react/repo",
            description: null,
            language: null,
            stargazers_count: 1,
          },
        ],
      }),
    } as Response);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(screen.getByText("redux/repo")).toBeInTheDocument();
    expect(screen.queryByText("react/repo")).not.toBeInTheDocument();
  });
});
