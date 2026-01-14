# ethers-patch

Monkeypatch for [ENSIP-19](https://docs.ens.domains/ensip/19) (Multichain Primary) and [ENSIP-23](https://docs.ens.domains/ensip/23) (UniversalResolver) support in [ethers.js](https://github.com/ethers-io/ethers.js/).
* [v5](./packages/v5/index.ts)
* [v6](./packages/v5/index.ts)

### Features

* `resolveName()` supports optional `coinType`
    * use `"old"` for old implementation
* `lookupAddress()` supports optional `coinType`
    * use `"old"` for old implementation
* [ENSIP-10](https://docs.ens.domains/ensip/10) implementation uses `UniversalResolver.requireResolver()`
* `{Ens}Resolver.supportsWildcard()` is noop
* v6
    * use `fromNameOld()` for old implementation
* v5
    * use `getResolverOld()` for old implementation
    * updated normalization to [@adraffy/ens-normalize](https://github.com/adraffy/ens-normalize.js)
    * `namehash()` is patched
    * `dnsEncode()` is patched and uses 255-byte limit
    * `ensNormalize()` is exposed

#### Roadmap 

* ☑︎ Downgrade versions to lowest supported
* ☑︎ Explore normalization options for v5
* ☑︎ Separate libraries
* ☑︎ Add tests for checking patched return types
* ☑︎ Add tests for failures
* ☑︎ Script to apply `name/version` to `package.json`

---

### Setup

1. `bun i`

### Test

1. `bun test`

### Build

1. `bun run build`
