export type UserFollower = {
	followers: number;
	following: number;
};

export type GitHubUser = {
	id: number;
	login: string;
	avatar_url: string;
	company: string | null;
	blog: string | null;
};

export type Repo = {
	id: number;
	name: string;
	html_url: string;
	description: string | null;
	language: string | null;
};

export type UserDetail = {
	avatar_url: string;
	login: string;
	name: string;
	company: string | null;
	blog: string | null;
	location: string | null;
	bio: string | null;
};

export interface FetchGitHubUsersResult {
	users: GitHubUser[];
	totalCount: number;
	error: unknown | null;
}

export interface GitHubUserSearchResponse {
	items: GitHubUser[];
	total_count: number;
}
