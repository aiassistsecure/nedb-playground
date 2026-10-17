# NEDB Playground

**NEDB running entirely in a browser tab** — a proof of concept for
[`nedb-wasm`](https://crates.io/crates/nedb-wasm) (the WebAssembly build of
[NEDB](https://github.com/aiassistsecure/nedb)).

Open https://aiassistsecure.github.io/nedb-playground/ — no server, no backend.
The page loads a ~1.3 MB `.wasm` module (Rust → wasm-bindgen) exposing the real
in-memory NEDB engine: hash-chained writes, time-travel reads (`AS OF`),
bi-temporal validity windows, causal provenance (`TRACE caused_by`), a typed
graph layer, and NQL + neSQL query consoles.

## Files

- `index.html` — the single-page app (vanilla JS + CSS, zero dependencies)
- `app.js` — UI logic, ES module
- `wasm/` — wasm-bindgen output (`--target web`): `nedb_wasm.js`,
  `nedb_wasm_bg.wasm`, type definitions

## Rebuild the wasm

From a checkout of `aiassistsecure/nedb` (master, includes the wasm-spike):

```sh
cargo build -p nedb-wasm --target wasm32-unknown-unknown --release
wasm-bindgen --target web --out-dir <this-repo>/wasm --out-name nedb_wasm \
  rust/target/wasm32-unknown-unknown/release/nedb_wasm.wasm
```

Needs `wasm-bindgen-cli` matching the `wasm-bindgen` version in `rust/Cargo.lock`.

## Honest footnote

The database lives in the tab's memory — reloading the page resets it. Durable
browser storage (OPFS-backed) is Phase 2 of the NEDB WASM roadmap.

© 2026 INTERCHAINED LLC · BUSL-1.1
