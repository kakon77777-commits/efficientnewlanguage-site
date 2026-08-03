<!-- canonical: efficientnewlanguage.org/ai/examples/217-cache-staleness-witness | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 217 — Evicting the key you wrote is not enough

`cache_staleness_witness.eml` replays a write history against three cache-invalidation strategies and asks every question after every write.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A cache that is
# correct at the moment it is filled and wrong from then on.
#
# Memoization is only sound for a PURE function. The moment the thing being
# cached depends on state that can change, the cache stops being an
# optimization and becomes a second, divergent copy of the truth:
#
#     total_for("north")   -> 300     cached
#     ... a sale is recorded in "north" ...
#     total_for("north")   -> 300     still. It is a cache hit.
#
# There is no error here to catch. The cache returns a number that was true,
# is the right type, is in the right range, and is stale. The only way to see
# it is to compute the answer twice - once through the cache and once from
# scratch - and compare, which is exactly what nobody does in production
# because the whole point of the cache was to not compute it twice.
#
# Three strategies, all cheap, all commonly written, and only one correct:
#
#     never invalidate         wrong after the first write
#     invalidate the key       right for that key, wrong for anything derived
#     version the whole store  right, at the cost of dropping unrelated entries
#
# The middle one is the interesting failure. Evicting the key you wrote to
# feels sufficient and is not: an aggregate like "the region with the largest
# total" is derived from EVERY key, so writing to "north" invalidates the
# answer for a cache entry whose name does not mention "north" at all.
#
# The check is a replay: after every single write, all three caches are asked
# every question, and the answers are compared against a freshly computed
# truth. A strategy is correct only if it never disagrees, at any point in the
# history - not just at the end.
#
# One EML-P note, because writing this program hit it immediately. There is no
# `global`, so assigning to a module-level name inside a function creates a
# LOCAL - Python's rule, faithfully carried over. Mutating through a subscript
# (`store[r] + n => store[r]`) reaches the module-level dict; rebinding a bare
# name (`version + 1 => version`) does not. Counters that have to survive a
# call therefore live in one-element lists, which is what `version` is here.
#
# A second boundary showed up in the same place, and it is sharper. EML-P has
# no `del` statement, and `c_key.pop(region)` - which does compile, and emits
# correct Python - makes the interpreter defer, so the program runs and loses
# its equivalence guarantee. Between the two, a function in EML-P cannot
# REMOVE an entry from a module-level dictionary at all. Eviction here is
# therefore a written-down absence: a sentinel value that lookups treat as a
# miss. That is what a cache looks like in a language without deletion, and it
# is worth knowing that the resulting cache never shrinks.

"#evicted" => GONE

{"north": 100, "south": 50, "east": 70} => store
[0] => version

def record(region, amount):
    store[region] + amount => store[region]
    version[0] + 1 => version[0]

def truth_total(region):
    return store[region]

def truth_leader():
    # The region with the largest total. Derived from every key, which is what
    # makes per-key invalidation insufficient.
    "" => best
    0 - 1 => best_v
    for r in ["north", "south", "east"]:
        if store[r] > best_v:
            store[r] => best_v
            r => best
    return best

# --------------------------------------------------------------- strategy 1
{} => c_never

def total_never(region):
    if region in c_never:
        return c_never[region]
    truth_total(region) => v
    v => c_never[region]
    return v

def leader_never():
    if "#leader" in c_never:
        return c_never["#leader"]
    truth_leader() => v
    v => c_never["#leader"]
    return v

# --------------------------------------------------------------- strategy 2
{} => c_key

def total_key(region):
    if region in c_key and not (c_key[region] == GONE):
        return c_key[region]
    truth_total(region) => v
    v => c_key[region]
    return v

def leader_key():
    if "#leader" in c_key and not (c_key["#leader"] == GONE):
        return c_key["#leader"]
    truth_leader() => v
    v => c_key["#leader"]
    return v

def evict_key(region):
    # Evict exactly what was written. Feels complete; is not.
    # Written as a sentinel because EML-P cannot delete - see the note above.
    GONE => c_key[region]

# --------------------------------------------------------------- strategy 3
{} => c_ver
[0] => c_ver_stamp

def drop_versioned():
    # Clearing has to MUTATE the dict, not rebind the name - see the note at
    # the top. Rebinding would leave the module-level cache untouched and the
    # strategy would look correct while doing nothing.
    [] => keys
    for k in c_ver:
        keys + [k] => keys
    for k in keys:
        GONE => c_ver[k]
    version[0] => c_ver_stamp[0]

def total_versioned(region):
    if not (c_ver_stamp[0] == version[0]):
        drop_versioned()
    if region in c_ver and not (c_ver[region] == GONE):
        return c_ver[region]
    truth_total(region) => v
    v => c_ver[region]
    return v

def leader_versioned():
    if not (c_ver_stamp[0] == version[0]):
        drop_versioned()
    if "#leader" in c_ver and not (c_ver["#leader"] == GONE):
        return c_ver["#leader"]
    truth_leader() => v
    v => c_ver["#leader"]
    return v


# --------------------------------------------------------------- the replay
[["north", 30], ["south", 90], ["east", 5], ["south", 200], ["north", 400]] => writes

"after     truth      never      per-key    versioned  leader(truth/never/key/ver)"^0

def probe_all(label):
    # Ask every question through every cache and compare with a fresh answer.
    # Returns tallies rather than accumulating into module-level counters,
    # which a function in EML-P cannot do without a mutable cell.
    0 => n_probes
    0 => n_never
    0 => n_key
    0 => n_ver
    for r in ["north", "south", "east"]:
        n_probes + 1 => n_probes
        truth_total(r) => t
        if total_never(r) == t:
            n_never + 1 => n_never
        if total_key(r) == t:
            n_key + 1 => n_key
        if total_versioned(r) == t:
            n_ver + 1 => n_ver

    truth_leader() => lt
    0 => l_never
    0 => l_key
    0 => l_ver
    if leader_never() == lt:
        1 => l_never
    if leader_key() == lt:
        1 => l_key
    if leader_versioned() == lt:
        1 => l_ver

    ("%-9s %-10d %-10d %-10d %-10d %s/%s/%s/%s" % (label, truth_total("north"), total_never("north"), total_key("north"), total_versioned("north"), lt, leader_never(), leader_key(), leader_versioned()))^0
    return [n_probes, n_never, n_key, n_ver, l_never, l_key, l_ver]

def tally(acc, row):
    [] => out
    for i in [0:len(acc) - 1]:
        out + [acc[i] + row[i]] => out
    return out

[0, 0, 0, 0, 0, 0, 0] => acc
1 => leader_probes
tally(acc, probe_all("start")) => acc
for w in writes:
    record(w[0], w[1])
    evict_key(w[0])
    leader_probes + 1 => leader_probes
    tally(acc, probe_all(w[0] + "+" + str(w[1]))) => acc

acc[0] => probes
acc[1] => never_ok
acc[2] => key_ok
acc[3] => ver_ok
acc[4] => never_leader_ok
acc[5] => key_leader_ok
acc[6] => ver_leader_ok

""^0
("per-region probes:        " + str(probes))^0
("  never-invalidate right: " + str(never_ok) + "/" + str(probes))^0
("  per-key evict right:    " + str(key_ok) + "/" + str(probes))^0
("  versioned right:        " + str(ver_ok) + "/" + str(probes))^0
""^0
("leader probes:            " + str(leader_probes))^0
("  never-invalidate right: " + str(never_leader_ok) + "/" + str(leader_probes))^0
("  per-key evict right:    " + str(key_leader_ok) + "/" + str(leader_probes))^0
("  versioned right:        " + str(ver_leader_ok) + "/" + str(leader_probes))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The versioned cache must be right about everything, always.
checked + 1 => checked
if ver_ok == probes and ver_leader_ok == leader_probes:
    passed + 1 => passed

# Never-invalidate must be visibly wrong, or this program proves nothing.
checked + 1 => checked
if never_ok < probes:
    passed + 1 => passed

# Per-key eviction must be RIGHT on the per-region question...
checked + 1 => checked
if key_ok == probes:
    passed + 1 => passed

# ...and WRONG on the derived one. That gap is the whole case.
checked + 1 => checked
if key_leader_ok < leader_probes:
    passed + 1 => passed

# And the versioned cache must actually be caching, not just recomputing
# behind a dictionary that is always empty.
checked + 1 => checked
0 => live_entries
for k in c_ver:
    if not (c_ver[k] == GONE):
        live_entries + 1 => live_entries
if live_entries > 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Per-key eviction is right about the key it evicted and wrong about the aggregate." => verdict
else:
    "FAILED - a strategy did not behave as the checks describe." => verdict
verdict^0

""^0
"Evicting the key you just wrote to is the fix that looks complete. It is" => n1
n1^0
"complete for reads NAMED by that key, and an aggregate is not named by any" => n2
n2^0
"of the keys it depends on - so the entry that goes stale is the one whose" => n3
n3^0
"name gives no hint that the write touched it. Correctness here is a" => n4
n4^0
"property of the dependency graph, not of the write." => n5
n5^0
```

## Python (deterministic transpilation)

```python
GONE = "#evicted"
store = {"north": 100, "south": 50, "east": 70}
version = [0]

def record(region, amount):
    store[region] = store[region] + amount
    version[0] = version[0] + 1

def truth_total(region):
    return store[region]

def truth_leader():
    best = ""
    best_v = 0 - 1
    for r in ["north", "south", "east"]:
        if store[r] > best_v:
            best_v = store[r]
            best = r
    return best

c_never = {}

def total_never(region):
    if region in c_never:
        return c_never[region]
    v = truth_total(region)
    c_never[region] = v
    return v

def leader_never():
    if "#leader" in c_never:
        return c_never["#leader"]
    v = truth_leader()
    c_never["#leader"] = v
    return v

c_key = {}

def total_key(region):
    if region in c_key and not c_key[region] == GONE:
        return c_key[region]
    v = truth_total(region)
    c_key[region] = v
    return v

def leader_key():
    if "#leader" in c_key and not c_key["#leader"] == GONE:
        return c_key["#leader"]
    v = truth_leader()
    c_key["#leader"] = v
    return v

def evict_key(region):
    c_key[region] = GONE

c_ver = {}
c_ver_stamp = [0]

def drop_versioned():
    keys = []
    for k in c_ver:
        keys = keys + [k]
    for k in keys:
        c_ver[k] = GONE
    c_ver_stamp[0] = version[0]

def total_versioned(region):
    if not c_ver_stamp[0] == version[0]:
        drop_versioned()
    if region in c_ver and not c_ver[region] == GONE:
        return c_ver[region]
    v = truth_total(region)
    c_ver[region] = v
    return v

def leader_versioned():
    if not c_ver_stamp[0] == version[0]:
        drop_versioned()
    if "#leader" in c_ver and not c_ver["#leader"] == GONE:
        return c_ver["#leader"]
    v = truth_leader()
    c_ver["#leader"] = v
    return v

writes = [["north", 30], ["south", 90], ["east", 5], ["south", 200], ["north", 400]]
print("after     truth      never      per-key    versioned  leader(truth/never/key/ver)")

def probe_all(label):
    n_probes = 0
    n_never = 0
    n_key = 0
    n_ver = 0
    for r in ["north", "south", "east"]:
        n_probes = n_probes + 1
        t = truth_total(r)
        if total_never(r) == t:
            n_never = n_never + 1
        if total_key(r) == t:
            n_key = n_key + 1
        if total_versioned(r) == t:
            n_ver = n_ver + 1
    lt = truth_leader()
    l_never = 0
    l_key = 0
    l_ver = 0
    if leader_never() == lt:
        l_never = 1
    if leader_key() == lt:
        l_key = 1
    if leader_versioned() == lt:
        l_ver = 1
    print("%-9s %-10d %-10d %-10d %-10d %s/%s/%s/%s" % (label, truth_total("north"), total_never("north"), total_key("north"), total_versioned("north"), lt, leader_never(), leader_key(), leader_versioned()))
    return [n_probes, n_never, n_key, n_ver, l_never, l_key, l_ver]

def tally(acc, row):
    out = []
    for i in range(0, len(acc)):
        out = out + [acc[i] + row[i]]
    return out

acc = [0, 0, 0, 0, 0, 0, 0]
leader_probes = 1
acc = tally(acc, probe_all("start"))
for w in writes:
    record(w[0], w[1])
    evict_key(w[0])
    leader_probes = leader_probes + 1
    acc = tally(acc, probe_all(w[0] + "+" + str(w[1])))
probes = acc[0]
never_ok = acc[1]
key_ok = acc[2]
ver_ok = acc[3]
never_leader_ok = acc[4]
key_leader_ok = acc[5]
ver_leader_ok = acc[6]
print("")
print("per-region probes:        " + str(probes))
print("  never-invalidate right: " + str(never_ok) + "/" + str(probes))
print("  per-key evict right:    " + str(key_ok) + "/" + str(probes))
print("  versioned right:        " + str(ver_ok) + "/" + str(probes))
print("")
print("leader probes:            " + str(leader_probes))
print("  never-invalidate right: " + str(never_leader_ok) + "/" + str(leader_probes))
print("  per-key evict right:    " + str(key_leader_ok) + "/" + str(leader_probes))
print("  versioned right:        " + str(ver_leader_ok) + "/" + str(leader_probes))
passed = 0
checked = 0
checked = checked + 1
if ver_ok == probes and ver_leader_ok == leader_probes:
    passed = passed + 1
checked = checked + 1
if never_ok < probes:
    passed = passed + 1
checked = checked + 1
if key_ok == probes:
    passed = passed + 1
checked = checked + 1
if key_leader_ok < leader_probes:
    passed = passed + 1
checked = checked + 1
live_entries = 0
for k in c_ver:
    if not c_ver[k] == GONE:
        live_entries = live_entries + 1
if live_entries > 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Per-key eviction is right about the key it evicted and wrong about the aggregate."
else:
    verdict = "FAILED - a strategy did not behave as the checks describe."
print(verdict)
print("")
n1 = "Evicting the key you just wrote to is the fix that looks complete. It is"
print(n1)
n2 = "complete for reads NAMED by that key, and an aggregate is not named by any"
print(n2)
n3 = "of the keys it depends on - so the entry that goes stale is the one whose"
print(n3)
n4 = "name gives no hint that the write touched it. Correctness here is a"
print(n4)
n5 = "property of the dependency graph, not of the write."
print(n5)
```

## stdout (executed)

```text
after     truth      never      per-key    versioned  leader(truth/never/key/ver)
start     100        100        100        100        north/north/north/north
north+30  130        100        130        130        north/north/north/north
south+90  130        100        130        130        south/north/north/south
east+5    130        100        130        130        south/north/north/south
south+200 130        100        130        130        south/north/north/south
north+400 530        100        530        530        north/north/north/north

per-region probes:        18
  never-invalidate right: 6/18
  per-key evict right:    18/18
  versioned right:        18/18

leader probes:            6
  never-invalidate right: 3/6
  per-key evict right:    3/6
  versioned right:        6/6

checks passed: 5/5
Per-key eviction is right about the key it evicted and wrong about the aggregate.

Evicting the key you just wrote to is the fix that looks complete. It is
complete for reads NAMED by that key, and an aggregate is not named by any
of the keys it depends on - so the entry that goes stale is the one whose
name gives no hint that the write touched it. Correctness here is a
property of the dependency graph, not of the write.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
