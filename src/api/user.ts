import axios from "axios";
import { GITHUB_TOKEN, GITHUB_URL } from "./config";
import type {
	Repo,
	UserFollower,
	FetchGitHubUsersResult,
	GitHubUserSearchResponse,
} from "../types/user";

export const fetchGitHubUsers = async (
	query: string,
	page = 1
): Promise<FetchGitHubUsersResult> => {
	try {
		const response = await axios.get<GitHubUserSearchResponse>(
			`${GITHUB_URL}/search/users`,
			{
				params: {
					q: query,
					per_page: 6,
					page,
				},
				headers: {
					Authorization: GITHUB_TOKEN,
				},
			}
		);

		return {
			users: response?.data?.items || [],
			totalCount: response?.data?.total_count || 0,
			error: null,
		};
	} catch (error) {
		return {
			users: [],
			totalCount: 0,
			error,
		};
	}
};

export const fetchUserRepos = async (username: string): Promise<Repo[]> => {
	try {
		const res = await axios.get<Repo[]>(
			`${GITHUB_URL}/users/${username}/repos?sort=updated&direction=desc`,
			{
				headers: {
					Authorization: `${GITHUB_TOKEN}`,
				},
			}
		);
		return res.data || [];
	} catch (error) {
		console.error("Failed to fetch repos:", error);
		return [];
	}
};

export const fetchUserDetails = async (
	username: string
): Promise<UserFollower> => {
	try {
		const res = await axios.get<UserFollower>(
			`${GITHUB_URL}/users/${username}`,
			{
				headers: {
					Authorization: `${GITHUB_TOKEN}`,
				},
			}
		);
		return {
			followers: res?.data?.followers || 0,
			following: res?.data?.following || 0,
		};
	} catch {
		return {
			followers: 0,
			following: 0,
		};
	}
};
