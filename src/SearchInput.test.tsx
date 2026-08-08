import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import SearchInput from "./SearchInput";

describe("SearchInput", () => {
  it("renders the search input with a query", () => {
    render(<SearchInput query="test" onQueryChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("test");
  });

  it("calls onQueryChange with new value", async () => {
    const user = userEvent.setup();
    const onQueryChange = vi.fn();

    render(<SearchInput query="" onQueryChange={onQueryChange} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "a");

    expect(onQueryChange).toHaveBeenCalledTimes(1);
    expect(onQueryChange).toHaveBeenCalledWith("a");
  });
});
