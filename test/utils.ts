export async function requireThrow(
	fn: () => Promise<unknown>
): Promise<unknown> {
	try {
		await fn();
	} catch (err) {
		return err;
	}
	throw new Error("expected throw");
}
