import React from "react";
import { useFormik } from "formik";

export default function SearchForm() {
	const formik = useFormik({
		initialValues: { query: "" },
		onSubmit: (values, { setSubmitting }) => {
			setSubmitting(false);
			alert(`Search: ${values.query}`);
		},
	});

	return (
		<form onSubmit={formik.handleSubmit}>
			<div className="relative w-full flex">
				<input
					type="text"
					name="query"
					value={formik.values.query}
					onChange={formik.handleChange}
					onBlur={formik.handleBlur}
					placeholder="Type to search..."
					className="flex-1 px-4 py-2"
				/>

				<button
					type="submit"
					className="px-4 py-2 bg-blue-600 text-white"
				>
					Search
				</button>
			</div>

			{formik.submitCount > 0 && (
				<p data-testid="search-result">Search: {formik.values.query}</p>
			)}
		</form>
	);
}
