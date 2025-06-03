export type UserDetail = {
	followers: number;
	following: number;
};

export type GitHubUser = {
	id: number;
	login: string;
	avatar_url: string;
};

export type Repo = {
	id: number;
	name: string;
	html_url: string;
	description: string | null;
};
