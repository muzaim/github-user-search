import axios from "axios";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const GITHUB_URL = import.meta.env.VITE_GITHUB_URL;

export const fetchUserDetails = async (
	username: string
): Promise<{ followers: number; following: number }> => {
	try {
		const res = await axios.get(`${GITHUB_URL}/users/${username}`, {
			headers: {
				Authorization: `${GITHUB_TOKEN}`,
			},
		});
		return {
			followers: res.data.followers,
			following: res.data.following,
		};
	} catch {
		return {
			followers: 0,
			following: 0,
		};
	}
};
