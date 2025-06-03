import { Config } from "jest";

const config: Config = {
	testEnvironment: "jsdom",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};

export default config;
