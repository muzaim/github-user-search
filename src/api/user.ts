import axios from "axios";
import { GITHUB_TOKEN, GITHUB_URL } from "./config";

export interface GitHubUser {
	id: number;
	login: string;
	avatar_url: string;
	company: string | null;
	blog: string | null;
}

interface GitHubUserSearchResponse {
	items: GitHubUser[];
	total_count: number;
}

export interface FetchGitHubUsersResult {
	users: GitHubUser[];
	totalCount: number;
	error: unknown | null;
}

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

export interface GitHubRepo {
	id: number;
	name: string;
	html_url: string;
	description: string | null;
}

export const fetchUserRepos = async (
	username: string
): Promise<GitHubRepo[]> => {
	try {
		const res = await axios.get<GitHubRepo[]>(
			`${GITHUB_URL}/users/${username}/repos`,
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

export interface UserFollower {
	followers: number;
	following: number;
}

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
