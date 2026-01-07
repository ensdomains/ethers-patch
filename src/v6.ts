import {
	EnsResolver,
	AbstractProvider,
	Contract,
	dnsEncode,
	assert,
	isHexString,
	assertArgument,
	type BigNumberish,
	getBigInt,
	Interface,
	isError,
	namehash,
	getAddress,
} from "ethers6";
import {
	ABI_FRAGMENTS,
	COIN_TYPE_ETH,
	getReverseName,
	isEVMCoinType,
	UR_PROXY,
} from "./shared.js";

declare module "ethers6" {
	interface AbstractProvider {
		resolveName(name: string, coinType?: BigNumberish): Promise<string | null>;
		lookupAddress(
			address: string,
			coinType?: BigNumberish
		): Promise<string | null>;
	}
}

const ABI = new Interface(ABI_FRAGMENTS);

EnsResolver.fromName = async function (provider, name) {
	const UR = new Contract(UR_PROXY, ABI, provider);
	try {
		const result = await UR.requireResolver(dnsEncode(name, 255));
		const resolver = new EnsResolver(provider, result.resolver, name);
		const extended = Promise.resolve(result.extended);
		resolver.supportsWildcard = () => extended;
		return resolver;
	} catch (err) {
		return null;
	}
};

AbstractProvider.prototype.resolveName = async function (
	name,
	coinType: BigNumberish = COIN_TYPE_ETH
) {
	coinType = getBigInt(coinType, "coinType");
	const fwd = await this.getResolver(name);
	if (!fwd) return null;
	try {
		return fetchAddress(fwd, coinType);
	} catch {
		return null;
	}
};

AbstractProvider.prototype.lookupAddress = async function (
	address,
	coinType: BigNumberish = COIN_TYPE_ETH
) {
	assertArgument(
		address.length > 2 && isHexString(address),
		"address must be non-empty hex string",
		"address",
		address
	);
	address = address.toLowerCase();
	coinType = getBigInt(coinType, "coinType");
	const reverseName = getReverseName(address, coinType);
	try {
		const rev = await this.getResolver(reverseName);
		if (rev) {
			const name = await callResolver<string>(rev, "name");
			if (name) {
				const fwd = await this.getResolver(name);
				if (fwd) {
					const checked = await fetchAddress(fwd, coinType).then(
						(x) => x.toLowerCase(),
						() => {}
					);
					if (checked) {
						assert(
							address === checked,
							"address->name->address mismatch",
							"BAD_DATA",
							{ value: [address, checked] }
						);
						return name;
					}
				}
			}
		}
		return null;
	} catch (error) {
		if (isError(error, "BAD_DATA") && error.value === "0x") {
			return null;
		}
		if (isError(error, "CALL_EXCEPTION")) {
			return null;
		}
		throw error;
	}
};

async function fetchAddress(resolver: EnsResolver, coinType: bigint) {
	if (coinType === COIN_TYPE_ETH) {
		return callResolver<string>(resolver, "addr(bytes32)");
	} else {
		const a = await callResolver<string>(
			resolver,
			"addr(bytes32,uint256)",
			coinType
		);
		return isEVMCoinType(coinType)
			? a === "0x"
				? a.padEnd(42)
				: getAddress(a)
			: a;
	}
}

async function callResolver<T>(
	resolver: EnsResolver,
	fragment: string,
	...args: any[]
): Promise<T> {
	const f = ABI.getFunction(fragment)!;
	const r = new Contract(resolver.address, ABI, resolver.provider);
	if (await resolver.supportsWildcard()) {
		const res: any = ABI.decodeFunctionResult(
			f,
			await r.resolve(
				dnsEncode(resolver.name, 255),
				ABI.encodeFunctionData(f, [namehash(resolver.name), ...args]),
				{ enableCcipRead: true }
			)
		);
		return f.outputs.length === 1 ? res[0] : res;
	} else {
		return r[f.format()](namehash(resolver.name), ...args, {
			enableCcipRead: true,
		});
	}
}
