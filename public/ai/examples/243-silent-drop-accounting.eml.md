<!-- canonical: efficientnewlanguage.org/ai/examples/243-silent-drop-accounting | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 243 — Same output, and only one can say what went missing

`silent_drop_accounting.eml` runs a four-stage pipeline twice — once plain, once with a ledger — and reconciles the counts.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A pipeline where
# fewer records come out than went in, and nothing says so.
#
# Every stage of a data pipeline filters, transforms or joins. Each is written
# and reviewed on its own, each is correct on its own, and the only place the
# loss is visible is a number nobody computes:
#
#     in - out - explained = 0
#
# `explained` is the part that has to be built deliberately. A stage that
# drops a record for a reason it RECORDS is doing its job. A stage that drops
# one for a reason it does not record is indistinguishable from a bug, and the
# pipeline reports success either way.
#
# Four stages here, all plausible:
#
#     parse      rejects malformed input and says so
#     enrich     joins a lookup table; a missing key drops the row SILENTLY
#     dedupe     removes repeats of (account, product, amount), intended
#                and unreported
#     window     keeps a time range, which is intended and unreported
#
# Only `parse` is accountable as written. The other three lose records for
# reasons that are individually correct and collectively invisible, and the
# end-to-end count is short by an amount no single stage can explain.
#
# The measurement is the reconciliation itself: run the pipeline twice, once
# without accounting and once with, and check that only the accounted version
# can close the books. The unaccounted version produces the SAME output - the
# difference is entirely in what can be said about it.

[
    ["2026-08-04T09:00", "a1", "widget", "10"],
    ["2026-08-04T09:01", "a2", "gadget", "5"],
    ["2026-08-04T09:02", "a1", "widget", "10"],
    ["2026-08-04T09:03", "zz", "widget", "7"],
    ["2026-08-04T09:04", "a3", "doohickey", "3"],
    ["2026-08-04T09:05", "a2", "gadget", "x"],
    ["2026-08-04T09:06", "a4", "widget", "2"],
    ["2026-08-04T09:07", "a1", "widget", "10"],
    ["2026-08-05T09:08", "a3", "gadget", "9"],
    ["2026-08-04T09:09", "a9", "gizmo", "4"]
] => raw

{"a1": "north", "a2": "south", "a3": "east", "a4": "north"} => accounts

def is_number(s):
    if len(s) == 0:
        return False
    for ch in s:
        if ch < "0" or ch > "9":
            return False
    return True

# ------------------------------------------------------ the unaccounted version
def run_plain(rows):
    [] => parsed
    for r in rows:
        if is_number(r[3]):
            parsed + [r] => parsed

    [] => enriched
    for r in parsed:
        if r[1] in accounts:
            enriched + [[r[0], r[1], accounts[r[1]], r[2], int(r[3])]] => enriched

    [] => deduped
    {} => seen
    for r in enriched:
        r[1] + "|" + r[3] + "|" + str(r[4]) => k
        if not (k in seen):
            1 => seen[k]
            deduped + [r] => deduped

    [] => windowed
    for r in deduped:
        if r[0][:10] == "2026-08-04":
            windowed + [r] => windowed
    return windowed

# -------------------------------------------------------- the accounted version
# Same logic, same output, plus a ledger. Every stage records WHY it dropped a
# row, and the totals must reconcile.
def run_accounted(rows, ledger):
    [] => parsed
    for r in rows:
        if is_number(r[3]):
            parsed + [r] => parsed
        else:
            ledger["parse:not-a-number"] + 1 => ledger["parse:not-a-number"]

    [] => enriched
    for r in parsed:
        if r[1] in accounts:
            enriched + [[r[0], r[1], accounts[r[1]], r[2], int(r[3])]] => enriched
        else:
            ledger["enrich:unknown-account"] + 1 => ledger["enrich:unknown-account"]

    [] => deduped
    {} => seen
    for r in enriched:
        r[1] + "|" + r[3] + "|" + str(r[4]) => k
        if k in seen:
            ledger["dedupe:repeat"] + 1 => ledger["dedupe:repeat"]
        else:
            1 => seen[k]
            deduped + [r] => deduped

    [] => windowed
    for r in deduped:
        if r[0][:10] == "2026-08-04":
            windowed + [r] => windowed
        else:
            ledger["window:out-of-range"] + 1 => ledger["window:out-of-range"]
    return windowed


{} => ledger
0 => ledger["parse:not-a-number"]
0 => ledger["enrich:unknown-account"]
0 => ledger["dedupe:repeat"]
0 => ledger["window:out-of-range"]

run_plain(raw) => out_plain
run_accounted(raw, ledger) => out_accounted

("records in:  " + str(len(raw)))^0
("records out: " + str(len(out_plain)))^0
("unexplained by the plain pipeline: " + str(len(raw) - len(out_plain)))^0

""^0
"the ledger the accounted version keeps:"^0
0 => explained
for k in ledger:
    ("  %-26s %d" % (k, ledger[k]))^0
    explained + ledger[k] => explained

""^0
("in - out           = " + str(len(raw) - len(out_accounted)))^0
("sum of the ledger  = " + str(explained))^0
("reconciles         = " + str(len(raw) - len(out_accounted) == explained))^0

# ---------------------------------------------- the two versions agree on output
0 => same
if len(out_plain) == len(out_accounted):
    1 => same
    for i in [0:len(out_plain) - 1]:
        if not (str(out_plain[i]) == str(out_accounted[i])):
            0 => same

""^0
("the two pipelines produce identical output: " + str(same == 1))^0
"...so no test comparing OUTPUT can tell them apart."^0

# ----------------------------------------- which losses were intended
# Intent is not derivable from the numbers. Three of these four are correct
# behaviour and one is a data-quality signal, and the ledger is what lets a
# human make that call at all.
""^0
"what each line means, which is a judgement the pipeline cannot make:"^0
("  parse:not-a-number       upstream sent bad data      - investigate")^0
("  enrich:unknown-account   a join key is missing       - investigate")^0
("  dedupe:repeat            intended                    - normal")^0
("  window:out-of-range      intended                    - normal")^0
("suspicious drops: " + str(ledger["parse:not-a-number"] + ledger["enrich:unknown-account"]))^0
("routine drops:    " + str(ledger["dedupe:repeat"] + ledger["window:out-of-range"]))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The books must close. This is the property.
checked + 1 => checked
if len(raw) - len(out_accounted) == explained:
    passed + 1 => passed

# The two pipelines must produce byte-identical output, or the accounting
# changed the behaviour and the comparison is meaningless.
checked + 1 => checked
if same == 1:
    passed + 1 => passed

# There must be real loss, or nothing is being reconciled.
checked + 1 => checked
if len(raw) - len(out_accounted) > 0:
    passed + 1 => passed

# Every stage must have dropped something, so no line of the ledger is
# untested.
checked + 1 => checked
0 => silent_stages
for k in ledger:
    if ledger[k] == 0:
        silent_stages + 1 => silent_stages
if silent_stages == 0:
    passed + 1 => passed

# And the suspicious and routine drops must both be non-zero - a ledger where
# every loss is routine would not need to distinguish them.
checked + 1 => checked
if ledger["parse:not-a-number"] + ledger["enrich:unknown-account"] > 0:
    if ledger["dedupe:repeat"] + ledger["window:out-of-range"] > 0:
        passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Same output, and only one of them can say where the missing records went." => verdict
else:
    "FAILED - the pipelines did not behave as the checks describe." => verdict
verdict^0

""^0
"The accounting changes nothing about what the pipeline COMPUTES, which is" => n1
n1^0
"why it is the first thing cut and the last thing added. Its whole value is" => n2
n2^0
"the subtraction at the end, and that subtraction is the only check able to" => n3
n3^0
"distinguish a filter working as designed from a join quietly failing." => n4
n4^0
```

## Python (deterministic transpilation)

```python
raw = [["2026-08-04T09:00", "a1", "widget", "10"], ["2026-08-04T09:01", "a2", "gadget", "5"], ["2026-08-04T09:02", "a1", "widget", "10"], ["2026-08-04T09:03", "zz", "widget", "7"], ["2026-08-04T09:04", "a3", "doohickey", "3"], ["2026-08-04T09:05", "a2", "gadget", "x"], ["2026-08-04T09:06", "a4", "widget", "2"], ["2026-08-04T09:07", "a1", "widget", "10"], ["2026-08-05T09:08", "a3", "gadget", "9"], ["2026-08-04T09:09", "a9", "gizmo", "4"]]
accounts = {"a1": "north", "a2": "south", "a3": "east", "a4": "north"}

def is_number(s):
    if len(s) == 0:
        return False
    for ch in s:
        if ch < "0" or ch > "9":
            return False
    return True

def run_plain(rows):
    parsed = []
    for r in rows:
        if is_number(r[3]):
            parsed = parsed + [r]
    enriched = []
    for r in parsed:
        if r[1] in accounts:
            enriched = enriched + [[r[0], r[1], accounts[r[1]], r[2], int(r[3])]]
    deduped = []
    seen = {}
    for r in enriched:
        k = r[1] + "|" + r[3] + "|" + str(r[4])
        if not k in seen:
            seen[k] = 1
            deduped = deduped + [r]
    windowed = []
    for r in deduped:
        if r[0][:10] == "2026-08-04":
            windowed = windowed + [r]
    return windowed

def run_accounted(rows, ledger):
    parsed = []
    for r in rows:
        if is_number(r[3]):
            parsed = parsed + [r]
        else:
            ledger["parse:not-a-number"] = ledger["parse:not-a-number"] + 1
    enriched = []
    for r in parsed:
        if r[1] in accounts:
            enriched = enriched + [[r[0], r[1], accounts[r[1]], r[2], int(r[3])]]
        else:
            ledger["enrich:unknown-account"] = ledger["enrich:unknown-account"] + 1
    deduped = []
    seen = {}
    for r in enriched:
        k = r[1] + "|" + r[3] + "|" + str(r[4])
        if k in seen:
            ledger["dedupe:repeat"] = ledger["dedupe:repeat"] + 1
        else:
            seen[k] = 1
            deduped = deduped + [r]
    windowed = []
    for r in deduped:
        if r[0][:10] == "2026-08-04":
            windowed = windowed + [r]
        else:
            ledger["window:out-of-range"] = ledger["window:out-of-range"] + 1
    return windowed

ledger = {}
ledger["parse:not-a-number"] = 0
ledger["enrich:unknown-account"] = 0
ledger["dedupe:repeat"] = 0
ledger["window:out-of-range"] = 0
out_plain = run_plain(raw)
out_accounted = run_accounted(raw, ledger)
print("records in:  " + str(len(raw)))
print("records out: " + str(len(out_plain)))
print("unexplained by the plain pipeline: " + str(len(raw) - len(out_plain)))
print("")
print("the ledger the accounted version keeps:")
explained = 0
for k in ledger:
    print("  %-26s %d" % (k, ledger[k]))
    explained = explained + ledger[k]
print("")
print("in - out           = " + str(len(raw) - len(out_accounted)))
print("sum of the ledger  = " + str(explained))
print("reconciles         = " + str(len(raw) - len(out_accounted) == explained))
same = 0
if len(out_plain) == len(out_accounted):
    same = 1
    for i in range(0, len(out_plain)):
        if not str(out_plain[i]) == str(out_accounted[i]):
            same = 0
print("")
print("the two pipelines produce identical output: " + str(same == 1))
print("...so no test comparing OUTPUT can tell them apart.")
print("")
print("what each line means, which is a judgement the pipeline cannot make:")
print("  parse:not-a-number       upstream sent bad data      - investigate")
print("  enrich:unknown-account   a join key is missing       - investigate")
print("  dedupe:repeat            intended                    - normal")
print("  window:out-of-range      intended                    - normal")
print("suspicious drops: " + str(ledger["parse:not-a-number"] + ledger["enrich:unknown-account"]))
print("routine drops:    " + str(ledger["dedupe:repeat"] + ledger["window:out-of-range"]))
passed = 0
checked = 0
checked = checked + 1
if len(raw) - len(out_accounted) == explained:
    passed = passed + 1
checked = checked + 1
if same == 1:
    passed = passed + 1
checked = checked + 1
if len(raw) - len(out_accounted) > 0:
    passed = passed + 1
checked = checked + 1
silent_stages = 0
for k in ledger:
    if ledger[k] == 0:
        silent_stages = silent_stages + 1
if silent_stages == 0:
    passed = passed + 1
checked = checked + 1
if ledger["parse:not-a-number"] + ledger["enrich:unknown-account"] > 0:
    if ledger["dedupe:repeat"] + ledger["window:out-of-range"] > 0:
        passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Same output, and only one of them can say where the missing records went."
else:
    verdict = "FAILED - the pipelines did not behave as the checks describe."
print(verdict)
print("")
n1 = "The accounting changes nothing about what the pipeline COMPUTES, which is"
print(n1)
n2 = "why it is the first thing cut and the last thing added. Its whole value is"
print(n2)
n3 = "the subtraction at the end, and that subtraction is the only check able to"
print(n3)
n4 = "distinguish a filter working as designed from a join quietly failing."
print(n4)
```

## stdout (executed)

```text
records in:  10
records out: 4
unexplained by the plain pipeline: 6

the ledger the accounted version keeps:
  parse:not-a-number         1
  enrich:unknown-account     2
  dedupe:repeat              2
  window:out-of-range        1

in - out           = 6
sum of the ledger  = 6
reconciles         = True

the two pipelines produce identical output: True
...so no test comparing OUTPUT can tell them apart.

what each line means, which is a judgement the pipeline cannot make:
  parse:not-a-number       upstream sent bad data      - investigate
  enrich:unknown-account   a join key is missing       - investigate
  dedupe:repeat            intended                    - normal
  window:out-of-range      intended                    - normal
suspicious drops: 3
routine drops:    3

checks passed: 5/5
Same output, and only one of them can say where the missing records went.

The accounting changes nothing about what the pipeline COMPUTES, which is
why it is the first thing cut and the last thing added. Its whole value is
the subtraction at the end, and that subtraction is the only check able to
distinguish a filter working as designed from a join quietly failing.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
