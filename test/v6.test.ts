import { describe, expect, test } from "bun:test";
import { ethers } from "ethers6";
import "../src/v6.js";
import { RPC_URL, NAME, ADDR } from "./constants.js";
import { COIN_TYPE_DEFAULT } from "../src/shared.js";

describe("v6", () => {
	const provider = new ethers.JsonRpcProvider(RPC_URL, 1, {
		staticNetwork: true,
	});

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
