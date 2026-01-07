export const UR_PROXY = "0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEe";

export const ABI_FRAGMENTS = [
	// AbstractUniversalResolver
	"function requireResolver(bytes name) view returns ((bytes name, uint256 offset, bytes32 node, address resolver, bool extended))",
	// IExtendedResolver
	"function resolve(bytes, bytes) view returns (bytes)",
	// INameResolver
	"function name(bytes32) view returns (string)",
	// IAddrResolver
	"function addr(bytes32) view returns (address)",
	// IAddressResolver
	"function addr(bytes32, uint256) view returns (bytes)",
];

export const COIN_TYPE_ETH = 60n;
export const COIN_TYPE_DEFAULT = 1n << 31n;

export function isEVMCoinType(coinType: bigint) {
	return (
		coinType === COIN_TYPE_ETH ||
		(coinType >= 0n && (coinType ^ COIN_TYPE_DEFAULT) < COIN_TYPE_DEFAULT)
	);
}

export function getReverseName(lowerAddress: string, coinType: bigint) {
	return `${lowerAddress.slice(2)}.${
		coinType === COIN_TYPE_ETH
			? "addr"
			: coinType === COIN_TYPE_DEFAULT
			? "default"
			: coinType.toString(16)
	}.reverse`;
}
