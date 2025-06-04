import axios from "axios";
import { fetchGitHubUsers } from "../api/User";

jest.mock("axios");

describe("fetchGitHubUsers", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should return users and totalCount on success", async () => {
		const mockData = {
			data: {
				items: [
					{ id: 1, login: "user1" },
					{ id: 2, login: "user2" },
				],
				total_count: 2,
			},
		};

		(axios.get as jest.Mock).mockResolvedValue(mockData);

		const result = await fetchGitHubUsers("testquery", 1);

		expect(axios.get).toHaveBeenCalledWith(
			expect.stringContaining("/search/users"),
			expect.objectContaining({
				params: { q: "testquery", per_page: 6, page: 1 },
				headers: expect.any(Object),
			})
		);

		expect(result.users).toEqual(mockData.data.items);
		expect(result.totalCount).toBe(2);
		expect(result.error).toBeNull();
	});

	it("should return empty array and error on failure", async () => {
		const mockError = new Error("Network Error");

		(axios.get as jest.Mock).mockRejectedValue(mockError);

		const result = await fetchGitHubUsers("testquery", 1);

		expect(result.users).toEqual([]);
		expect(result.totalCount).toBe(0);
		expect(result.error).toBe(mockError);
	});
});
