import init, { NedbWasm } from './wasm/nedb_wasm.js';

const $ = id => document.getElementById(id);
const con = $('console');
let db = null;

function log(msg, cls = '') {
  const t = new Date().toLocaleTimeString();
  const div = document.createElement('div');
  div.className = 'ln ' + cls;
  const ts = document.createElement('span'); ts.className = 't'; ts.textContent = t;
  const body = document.createElement('span'); body.textContent = msg;
  div.append(ts, body); con.prepend(div);
}
const ok = m => log(m, 'ok');
const err = m => log('ERROR: ' + m, 'err');
const info = m => log(m, 'inf');
const show = (label, obj) => {
  const s = typeof obj === 'string' ? obj : JSON.stringify(obj, null, 1);
  log(label + '\n' + s, 'qry');
};
const parse = s => { try { return JSON.parse(s); } catch { return s; } };

function refresh() {
  if (!db) return;
  try {
    const s = db.seq();
    $('seq').textContent = s;
    $('head').textContent = db.head().slice(0, 12) + '…';
    const v = db.verify();
    $('verify').textContent = v ? 'PASS ✓' : 'FAIL ✗';
    $('verify').style.color = v ? 'var(--ok)' : 'var(--bad)';
    const sl = $('slider');
    sl.max = s; if (+sl.value > s) sl.value = s;
    $('sliderval').textContent = sl.value;
    const tip = db.tip();
    $('tip').textContent = tip ? parse(tip)._id + ' @' + parse(tip)._seq : '–';
    try {
      const f = JSON.parse(db.since(0, 1));
      $('feed').textContent = 'head_seq ' + f.head_seq;
    } catch { $('feed').textContent = '–'; }
  } catch (e) { err(e.message || e); }
}

function op(label, fn) {
  try { const r = fn(); refresh(); return r; }
  catch (e) { err(label + ': ' + (e.message || e)); refresh(); }
}

async function boot() {
  try {
    await init();
    db = new NedbWasm();
    $('engine').textContent = 'engine live — in-memory';
    $('enginedot').className = 'dot ok';
    ok('nedb-wasm engine loaded in-browser. seq=' + db.seq());
    info('Tip: hit "Seed demo data", then try the time-travel slider and the TRACE buttons.');
    refresh();
  } catch (e) {
    $('engine').textContent = 'engine failed to load';
    $('enginedot').className = 'dot bad';
    err('wasm init failed: ' + (e.message || e));
  }
}

// ── demo controls ───────────────────────────────────────────────────────────
let aliceV1 = 0;
$('seed').onclick = () => op('seed', () => {
  db.create_index('users', 'age');
  aliceV1 = parse(db.put('users', 'alice', JSON.stringify({ age: 32, city: 'Winter Park' })))._seq;
  db.put('users', 'bob',   JSON.stringify({ age: 41, city: 'Orlando' }));
  db.put('users', 'carol', JSON.stringify({ age: 27, city: 'Maitland' }));
  const m1 = parse(db.put('inputs', 'msg_1', JSON.stringify({ text: 'user prefers dark mode' })));
  const belief = parse(db.put('beliefs', 'dark_mode', JSON.stringify({
    value: true, caused_by: [m1._hash],
    evidence: 'user_message', confidence: 0.95,
    valid_from: '2024-01-01', valid_to: '2024-12-31'
  })));
  $('causeby').textContent = (belief._caused_by || []).join(', ').slice(0, 40) + '…';
  db.link('alice', 'knows', 'bob');
  db.link('bob', 'knows', 'carol');
  db.put('users', 'alice', JSON.stringify({ age: 33, city: 'Winter Park' })); // v2 → time-travel demo
  const sl = $('slider'); sl.value = aliceV1; $('sliderval').textContent = aliceV1;
  $('slider').oninput();
  ok('seeded: 3 users (+1 update), 1 input, 1 causal belief, 2 graph links. seq=' + db.seq());
  show('beliefs/dark_mode', belief);
});

$('reset').onclick = () => op('reset', () => {
  db = new NedbWasm();
  aliceV1 = 0;
  $('causeby').textContent = '–';
  ok('database reset — fresh in-memory engine. seq=0');
});

$('verifybtn').onclick = () => op('verify', () => {
  const v = db.verify();
  v ? ok('verify() → true — hash chain intact, head ' + db.head().slice(0, 16) + '…')
    : err('verify() → FALSE — chain broken');
});

// ── write ───────────────────────────────────────────────────────────────────
$('put').onclick = () => op('put', () => {
  let doc; try { doc = JSON.parse($('wdoc').value); }
  catch { err('document is not valid JSON'); return; }
  const r = parse(db.put($('wcoll').value.trim(), $('wid').value.trim(), JSON.stringify(doc)));
  ok(`put ${$('wcoll').value}/${$('wid').value} → seq ${r._seq}`);
  show('stored', r);
});

$('del').onclick = () => op('delete', () => {
  db.delete($('dcoll').value.trim(), $('did').value.trim());
  ok(`delete ${$('dcoll').value}/${$('did').value} → tombstone (history preserved)`);
});

// ── read / time travel ──────────────────────────────────────────────────────
$('get').onclick = () => op('get', () => {
  const r = db.get($('rcoll').value.trim(), $('rid').value.trim());
  r === undefined ? info('get → (not found)') : show('get (now)', parse(r));
});

$('getasof').onclick = () => op('get_as_of', () => {
  const s = +$('slider').value;
  const r = db.get_as_of($('rcoll').value.trim(), $('rid').value.trim(), s);
  r === undefined ? info(`get_as_of @${s} → (no version live then)`) : show(`get_as_of @${s}`, parse(r));
});

$('slider').oninput = () => {
  $('sliderval').textContent = $('slider').value;
  if (!db) return;
  try {
    const r = db.get_as_of($('rcoll').value.trim(), $('rid').value.trim(), +$('slider').value);
    $('ttout').textContent = r === undefined ? '(no version)' : JSON.stringify(parse(r)).slice(0, 80);
  } catch (e) { $('ttout').textContent = 'err'; }
};

// ── query ───────────────────────────────────────────────────────────────────
function runQuery(stmt) {
  op('query', () => {
    $('q').value = stmt;
    $('dialect').textContent = db.nesql_dialect(stmt);
    const rows = db.query(stmt).map(parse);
    ok(`query (${$('dialect').textContent}) → ${rows.length} row(s)`);
    rows.slice(0, 25).forEach(r => show('', r));
    if (rows.length > 25) info(`…and ${rows.length - 25} more`);
  });
}
$('runq').onclick = () => runQuery($('q').value);
document.querySelectorAll('#examples .ex').forEach(el => {
  el.onclick = () => runQuery(el.textContent);
});

// ── provenance ──────────────────────────────────────────────────────────────
$('traceback').onclick = () => op('trace', () => {
  const rows = db.query('FROM beliefs WHERE _id = "dark_mode" TRACE caused_by').map(parse);
  ok(`TRACE caused_by → ${rows.length} ancestor(s) — why dark_mode exists:`);
  rows.forEach(r => show('', r));
});
$('tracefwd').onclick = () => op('trace', () => {
  const rows = db.query('FROM inputs WHERE _id = "msg_1" TRACE caused_by REVERSE').map(parse);
  ok(`TRACE caused_by REVERSE → ${rows.length} descendant(s) — what msg_1 caused:`);
  rows.forEach(r => show('', r));
});

// ── graph ───────────────────────────────────────────────────────────────────
$('link').onclick = () => op('link', () => {
  db.link($('gfrom').value.trim(), $('grel').value.trim(), $('gto').value.trim());
  ok(`linked ${$('gfrom').value} —${$('grel').value}→ ${$('gto').value}`);
});
$('unlink').onclick = () => op('unlink', () => {
  db.unlink($('gfrom').value.trim(), $('grel').value.trim(), $('gto').value.trim());
  ok('unlinked');
});
$('neighbors').onclick = () => op('neighbors', () => {
  const n = db.neighbors('alice', 'knows');
  show('neighbors(alice, knows)', n);
});
$('inbound').onclick = () => op('inbound', () => {
  const n = db.inbound('carol', 'knows');
  show('inbound(carol, knows)', n);
});

boot();
