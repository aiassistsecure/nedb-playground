/* tslint:disable */
/* eslint-disable */

export class NedbWasm {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * Create a sorted index on `field` (all kinds map to sorted, napi parity).
     */
    create_index(coll: string, field: string): void;
    /**
     * Delete a document (tombstone — history is preserved, napi parity).
     */
    delete(coll: string, id: string): void;
    /**
     * No-op on in-memory (nothing to flush); present for napi API parity.
     */
    flush(): void;
    /**
     * Get the current version of a document, or `undefined` when missing.
     */
    get(coll: string, id: string): string | undefined;
    /**
     * Get the version of a document live at sequence `as_of` (time travel).
     */
    get_as_of(coll: string, id: string, as_of: number): string | undefined;
    /**
     * Current Merkle head (64-char hex).
     */
    head(): string;
    /**
     * Inbound neighbors of `to` via relation `rel`.
     */
    inbound(to: string, rel: string): string[];
    /**
     * Inbound neighbors live at sequence `as_of`.
     */
    inbound_as_of(to: string, rel: string, as_of: number): string[];
    /**
     * Link: stored as a doc in the `__links__` collection for NQL traversal.
     */
    link(frm: string, rel: string, to: string): void;
    /**
     * Outbound neighbors of `frm` via relation `rel`.
     */
    neighbors(frm: string, rel: string): string[];
    /**
     * Outbound neighbors live at sequence `as_of` (time-travel the DAG).
     */
    neighbors_as_of(frm: string, rel: string, as_of: number): string[];
    /**
     * `query()` under the language's own name.
     */
    nesql(statement: string): string[];
    /**
     * Which half of neSQL a statement is written in: `"nql"` or `"sql"`.
     */
    nesql_dialect(statement: string): string;
    /**
     * Create an in-memory v2 DAG database — zero disk I/O. This is the only
     * constructor: the browser build has no durable file mode (that's the
     * Phase-2 OPFS/VFS work).
     */
    constructor();
    /**
     * Put a document. `doc_json` is a JSON string; returns the stored doc
     * (with `_id`/`_hash`/`_seq`/… lanes) as a JSON string.
     */
    put(coll: string, id: string, doc_json: string): string;
    /**
     * Run neSQL — PostgreSQL SQL or NQL, routed structurally like the napi
     * binding and the `nesql` CLI. Returns an array of JSON strings.
     */
    query(statement: string): string[];
    /**
     * Replication readiness as a JSON string.
     */
    scan_status(): string;
    /**
     * Current sequence number.
     */
    seq(): number;
    /**
     * Changefeed page after `after_seq` (exclusive) as a JSON envelope:
     * `{nodes, from_seq, to_seq, head_seq, has_more}`.
     */
    since(after_seq: number, limit: number): string;
    /**
     * The most recent write as a JSON string, or `undefined` when empty.
     */
    tip(): string | undefined;
    /**
     * Most recent write into `coll`, or `undefined` when empty.
     */
    tip_collection(coll: string): string | undefined;
    /**
     * Remove a link.
     */
    unlink(frm: string, rel: string, to: string): void;
    /**
     * Re-walk the hash chain; `true` = untampered.
     */
    verify(): boolean;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_nedbwasm_free: (a: number, b: number) => void;
    readonly nedbwasm_create_index: (a: number, b: number, c: number, d: number, e: number) => void;
    readonly nedbwasm_delete: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly nedbwasm_flush: (a: number) => void;
    readonly nedbwasm_get: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly nedbwasm_get_as_of: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
    readonly nedbwasm_head: (a: number) => [number, number];
    readonly nedbwasm_inbound: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly nedbwasm_inbound_as_of: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
    readonly nedbwasm_link: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly nedbwasm_neighbors: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly nedbwasm_neighbors_as_of: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
    readonly nedbwasm_nesql: (a: number, b: number, c: number) => [number, number, number, number];
    readonly nedbwasm_nesql_dialect: (a: number, b: number, c: number) => [number, number, number, number];
    readonly nedbwasm_new: () => number;
    readonly nedbwasm_put: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number, number, number];
    readonly nedbwasm_query: (a: number, b: number, c: number) => [number, number, number, number];
    readonly nedbwasm_scan_status: (a: number) => [number, number];
    readonly nedbwasm_seq: (a: number) => number;
    readonly nedbwasm_since: (a: number, b: number, c: number) => [number, number];
    readonly nedbwasm_tip: (a: number) => [number, number];
    readonly nedbwasm_tip_collection: (a: number, b: number, c: number) => [number, number];
    readonly nedbwasm_unlink: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly nedbwasm_verify: (a: number) => number;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
