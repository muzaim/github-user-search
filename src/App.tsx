import { useState, useEffect } from "react";
import type { UserFollower, GitHubUser, Repo } from "./types/user";
import { fetchGitHubUsers, fetchUserRepos, fetchUserDetails } from "./api/user";
import { GrPrevious, GrNext } from "react-icons/gr";
import Modal from "./components/UserModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GoRepoForked } from "react-icons/go";
import { CiStar } from "react-icons/ci";
import { CiClock1 } from "react-icons/ci";


export default function App() {
	const [query] = useState("");
	const [users, setUsers] = useState<GitHubUser[]>([]);
	const [selectedUser, setSelectedUser] = useState<string>("");
	const [repos, setRepos] = useState<Repo[]>([]);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const [loadingRepos, setLoadingRepos] = useState(false);
	const [modalOpen, setModalOpen] = useState(false);
	const [userDetails, setUserDetails] = useState<
		Record<string, UserFollower>
	>({});
	const [page, setPage] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	const formik = useFormik({
		initialValues: {
			query: "",
		},
		validationSchema: Yup.object({
			query: Yup.string().required("Github username is required!"),
		}),
		onSubmit: (values) => {
			setPage(1);
			handleSearch(values.query, 1);
		},
	});

	const getUserDetails = async (username: string) => {
		const details = await fetchUserDetails(username);
		return details;
	};

	const getLanguageColor = (language: string | null): string => {
		if (!language) return "language-gray";

		const normalizedLang = language.toLowerCase();
		const languageClass = `language-${normalizedLang}`;

		const validClasses = [
			"language-javascript",
			"language-typescript",
			"language-python",
			"language-java",
			"language-html",
			"language-css",
			"language-ruby",
			"language-go",
			"language-rust",
			"language-php",
			"language-c",
			"language-csharp",
			"language-cpp",
			"language-shell",
			"language-swift",
			"language-kotlin",
			"language-dart",
			"language-vue",
		];

		return validClasses.includes(languageClass)
			? languageClass
			: "language-gray";
	};

	const handleSearch = async (query: string, page: number) => {
		setLoadingUsers(true);
		const { users, totalCount } = await fetchGitHubUsers(query, page);
		setUsers(users);
		setTotalCount(totalCount);
		setLoadingUsers(false);
	};

	useEffect(() => {
		if (formik.values.query.trim()) {
			handleSearch(formik.values.query, page);
		}
	}, [page]);

	const openModalWithRepos = async (username: string) => {
		setSelectedUser(username);
		setModalOpen(true);
		setLoadingRepos(true);

		const repos = await fetchUserRepos(username);
		console.log(`dandi`, repos);
		setRepos(repos);
		setLoadingRepos(false);
	};

	const closeModal = () => {
		setModalOpen(false);
		setSelectedUser("");
		setRepos([]);
	};

	const totalPages = Math.ceil(totalCount / 5);

	useEffect(() => {
		if (users.length === 0) return;

		users.forEach(async (user) => {
			if (!userDetails[user.login]) {
				const details = await getUserDetails(user.login);
				setUserDetails((prev) => ({ ...prev, [user.login]: details }));
			}
		});
	}, [users]);

	return (
		<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
			<div className="w-full max-w-3xl bg-gray-800 p-8 rounded-2xl shadow-xl">
				<h1 className="text-2xl font-semibold mb-6 text-center">
					GitHub User Search
				</h1>

				<form
					onSubmit={formik.handleSubmit}
					className="w-full max-w-lg mx-auto flex flex-col gap-1"
				>
					<div className="relative flex rounded-lg shadow-sm overflow-hidden bg-white">
						<input
							type="text"
							name="query"
							value={formik.values.query}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
							placeholder="Search github username..."
							className={`flex-1 px-4 py-2 text-sm bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all
        ${formik.touched.query && formik.errors.query ? "ring-red-500 ring-2" : ""}`}
						/>

						{formik.values.query && (
							<button
								type="button"
								aria-label="Clear search input"
								className="absolute right-[96px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
								onClick={(e) => {
									e.preventDefault();
									formik.setFieldValue("query", "");
									formik.setTouched({ query: false });
									setUsers([]);
								}}
							>
								✕
							</button>
						)}

						<button
							type="submit"
							className="bg-blue-600 text-white px-4 py-2 text-sm font-semibold hover:bg-blue-700 transition-colors"
						>
							Search
						</button>
					</div>

					{/* Error Text */}
					{formik.touched.query && formik.errors.query && (
						<p className="text-red-500 text-sm mt-1 ml-1">{formik.errors.query}</p>
					)}
				</form>



				<div className="mt-6 space-y-4">
					{loadingUsers && (
						<div
							role="status"
							className="flex items-center justify-center"
						>
							<svg
								aria-hidden="true"
								className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
							<span className="sr-only">Loading...</span>
						</div>
					)}

					{!loadingUsers && users.length > 0 && (
						<>
							<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
								{users.map((user) => {
									const details = userDetails[user.login] || {
										followers: 0,
										following: 0,
									};

									return (
										<li
											key={user.id}
											onClick={() =>
												openModalWithRepos(user.login)
											}
											className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 cursor-pointer shadow-lg border border-gray-600 hover:scale-[1.02] transition transform duration-300"
										>
											<div className="flex flex-col items-center text-center">
												<img
													src={user.avatar_url}
													alt={user.login}
													className="w-24 h-24 rounded-full border-4 border-white shadow-md"
												/>
												<h3 className="mt-4 text-xl font-semibold text-white">
													{user.login} {user.company}
												</h3>

												<div className="flex justify-center gap-6 mt-3 text-sm text-gray-300">
													<div className="flex flex-col items-center">
														<span className="font-bold text-white">
															{details.followers}
														</span>
														<span className="text-xs">
															Followers
														</span>
													</div>
													<div className="flex flex-col items-center">
														<span className="font-bold text-white">
															{details.following}
														</span>
														<span className="text-xs">
															Following
														</span>
													</div>
												</div>

												<button className="mt-4 px-4 py-1 rounded-full bg-blue-500 text-white text-sm hover:bg-blue-600 transition cursor-pointer">
													View Profile
												</button>
											</div>
										</li>
									);
								})}
							</ul>

							{/* Pagination Controls */}
							<div className="flex justify-center gap-4 mt-6">
								<button
									onClick={() =>
										setPage((p) => Math.max(p - 1, 1))
									}
									disabled={page === 1}
									className={`px-4 py-2 rounded bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed`}
								>
									<GrPrevious />
								</button>

								<span className="flex items-center text-gray-300">
									Page {page} of {totalPages || 1}
								</span>

								<button
									onClick={() =>
										setPage((p) =>
											p < totalPages ? p + 1 : p
										)
									}
									disabled={
										page === totalPages || totalPages === 0
									}
									className={`px-4 py-2 rounded bg-blue-600 cursor-pointer hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed`}
								>
									<GrNext />
								</button>
							</div>
						</>
					)}

					{!loadingUsers && query && users.length === 0 && (
						<p className="text-gray-400 text-center mt-4">
							No results for "<strong>{query}</strong>"
						</p>
					)}
				</div>

				<Modal
					show={modalOpen}
					username={selectedUser}
					onClose={closeModal}
				>
					{loadingRepos ? (
						<div
							role="status"
							className="flex items-center justify-center"
						>
							<svg
								aria-hidden="true"
								className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
							<span className="sr-only">Loading...</span>
						</div>
					) : repos.length > 0 ? (
						<>
							<ul className="space-y-2">
								{repos.map((repo) => (
									<li
										key={repo.id}
										className="bg-gray-800 border border-gray-700 rounded-lg p-5 hover:shadow transition-shadow duration-200"
									>
										<div className="flex items-center justify-between flex-wrap gap-2">
											<div className="flex items-center gap-2">
												<a
													href={repo.html_url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-400 hover:underline font-semibold text-lg flex items-center gap-1"
												>
													{repo.name}
												</a>
												<span
													className={`px-2 py-0.5 text-gray-700 text-xs font-semibold rounded-full capitalize ${repo.visibility === 'public'
														? 'bg-green-100 '
														: 'bg-gray-200'
														}`}
												>
													{repo.visibility}
												</span>

											</div>

											<div className="flex items-center gap-3">
												<div className="flex items-center text-sm bg-gray-700 text-yellow-300 px-2 py-1 rounded-md">
													<CiStar className="w-4 h-4 mr-1" />
													<span className="text-white">
														{repo.stargazers_count}
													</span>
												</div>

												<div className="flex items-center text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded-md">
													<GoRepoForked className="w-4 h-4 mr-1" />
													<span className="text-white">
														{repo.forks_count}
													</span>
												</div>
											</div>
										</div>

										{repo.language && (
											<div className="flex items-center justify-between mt-4 text-sm text-gray-400 flex-wrap gap-2">
												<div className="flex items-center gap-2">
													<span
														className={`w-3 h-3 rounded-full ${getLanguageColor(
															repo.language
														)}`}
													></span>
													<span className="text-white">
														{repo.language}
													</span>
												</div>

												<div className="flex items-center gap-1">
													<CiClock1 className="w-4 h-4 text-gray-400" />
													<span>
														Updated{" "}
														{new Date(
															repo.updated_at
														).toLocaleDateString(
															undefined,
															{
																year: "numeric",
																month: "short",
																day: "numeric",
															}
														)}
													</span>
												</div>
											</div>
										)}
									</li>
								))}
							</ul>
						</>
					) : (
						<p className="text-center text-gray-400">
							No repos found
						</p>
					)}
				</Modal>
			</div>
		</div>
	);
}
