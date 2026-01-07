import { describe, expect, test } from "bun:test";
import { ethers } from "ethers5";
import "../src/v5.js";
import { RPC_URL, NAME, ADDR } from "./constants.js";
import { COIN_TYPE_DEFAULT } from "../src/shared.js";

describe("v5", () => {
	const provider = new ethers.providers.JsonRpcProvider(RPC_URL, 1);

	test("resolveName (old)", async () => {
		expect(provider.resolveName(NAME)).resolves.toStrictEqual(ADDR);
	});

	test("resolveName (default)", async () => {
		expect(
			provider.resolveName(NAME, COIN_TYPE_DEFAULT)
		).resolves.toStrictEqual(ADDR);
	});

	test("lookupAddress (old)", async () => {
		expect(provider.lookupAddress(ADDR)).resolves.toStrictEqual(NAME);
	});

	test("lookupAddress (default)", async () => {
		expect(
			provider.lookupAddress(ADDR, COIN_TYPE_DEFAULT)
		).resolves.toStrictEqual(NAME);
	});
});
