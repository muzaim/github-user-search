import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchForm from "./SearchForm";

test("menampilkan hasil pencarian setelah tombol Search ditekan", () => {
	render(<SearchForm />);

	const input = screen.getByPlaceholderText("Type to search...");
	const button = screen.getByRole("button", { name: /search/i });

	fireEvent.change(input, { target: { value: "John Doe" } });
	fireEvent.click(button);

	const result = screen.getByTestId("search-result");
	expect(result).toHaveTextContent("Search: John Doe");
});
