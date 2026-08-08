import { renderHook, act } from "@testing-library/react";
import { vi } from "vitest";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the value immediately", () => {
    const { result } = renderHook(() => useDebounce("a", 300));
    expect(result.current).toBe("a");
  });

  it("updates to the new value after the delay elapses", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "a" } },
    );

    rerender({ value: "b" });
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("b");
  });

  it("rapid changes reset the timer, only the last value survives", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: "" } },
    );

    rerender({ value: "r" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("");

    rerender({ value: "re" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("");

    rerender({ value: "rea" });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe("");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("rea");
  });
});
