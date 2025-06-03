import axios from "axios";
import { fetchUserDetails } from "@/api/user";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("fetchUserDetails", () => {
	it("should fetch users data", async () => {
		const fakeData = { items: [{ login: "user1" }], total_count: 1 };
		mockedAxios.get.mockResolvedValue({ data: fakeData });

		const result = await fetchUserDetails("test", 1);
		expect(result).toEqual(fakeData);
		expect(mockedAxios.get).toHaveBeenCalledTimes(1);
	});

	it("should throw error when fetch fails", async () => {
		mockedAxios.get.mockRejectedValue(new Error("Network error"));
		await expect(fetchUserDetails("test", 1)).rejects.toThrow(
			"Network error"
		);
	});
});
