<!-- canonical: efficientnewlanguage.org/ai/examples/325-each-stage-verified-nobody-verified-the-seam | ai_layer_version: 0.1.0 | updated: 2026-08-10 -->

# Example 325 — Each stage verified, nobody verified the seam — three green checks and 130 units of missing money

`each_stage_verified_nobody_verified_the_seam.eml` runs a three-stage pipeline over six billing rows, evaluates each stage's own check, and then asks what happened to the money.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three stages, each
# shipping a check that passes, and a pipeline that loses money.
#
# This is the shape of most real pipelines. Normalisation owns a check about
# COUNT. Deduplication owns a check about NAMES. Totalling owns a check about
# THE NUMBERS IT WAS HANDED. Every one of those checks is true, every one is
# about the thing its own stage was written to do, and the union of the three
# is not a check on the pipeline.
#
# The property that fails is money conservation from end to end, and it is
# owned by nobody, because no single stage is where it lives.
#
# The composition detail that makes it survive review: deduplication run
# against the RAW input drops nothing at all, because raw names are distinct.
# It only starts dropping once normalisation has run in front of it - and a
# fixture for "dedup" written by the person who wrote dedup contains raw names.
# Its test is honest, passing, and blind to the only input it will meet in
# production.
#
# Nothing here declares which stage loses the money. The per-stage ledger is
# measured by running the stages one at a time and summing what comes out.

def canonical(name, alias):
    if name in alias:
        return alias[name]
    return name

def stage_normalise(rows, alias):
    [] => out
    for r in rows:
        out + [[r[0], canonical(r[1], alias), r[2]]] => out
    return out

def stage_dedup(rows):
    [] => out
    [] => seen
    for r in rows:
        if r[1] in seen:
            pass
        else:
            seen + [r[1]] => seen
            out + [r] => out
    return out

def stage_dedup_merging(rows):
    [] => out
    [] => seen
    for r in rows:
        if r[1] in seen:
            [] => nxt
            for o in out:
                if o[1] == r[1]:
                    nxt + [[o[0], o[1], o[2] + r[2]]] => nxt
                else:
                    nxt + [o] => nxt
            nxt => out
        else:
            seen + [r[1]] => seen
            out + [r] => out
    return out

def stage_total(rows):
    0 => t
    for r in rows:
        t + r[2] => t
    return t

# ---- each stage's own check, written by whoever wrote that stage ----

def check_normalise_keeps_count(rows, alias):
    stage_normalise(rows, alias) => out
    if len(out) == len(rows):
        return 1
    return 0

def check_dedup_names_are_distinct(rows):
    stage_dedup(rows) => out
    [] => seen
    1 => ok
    for r in out:
        if r[1] in seen:
            0 => ok
        seen + [r[1]] => seen
    return ok

def check_total_sums_what_it_was_given(rows):
    0 => manual
    for r in rows:
        manual + r[2] => manual
    if stage_total(rows) == manual:
        return 1
    return 0

# ---- the data ----

[[1, "Ann M.", 120], [2, "Ross", 80], [3, "Ann", 45], [4, "A. Ross", 60], [5, "Kim", 30], [6, "Kim K.", 25]] => rows
{"Ann M.": "Ann", "A. Ross": "Ross", "Kim K.": "Kim"} => alias

"stage checks, each written by the stage's own author" ^0
"  normalise keeps the row count : " + str(check_normalise_keeps_count(rows, alias)) ^0
"  dedup output names distinct   : " + str(check_dedup_names_are_distinct(stage_normalise(rows, alias))) ^0
"  total sums what it was given  : " + str(check_total_sums_what_it_was_given(rows)) ^0
"" ^0

# ---- the seam ----

stage_total(rows) => money_in
stage_normalise(rows, alias) => a_out
stage_dedup(a_out) => b_out
stage_total(b_out) => money_out

"per-stage ledger (money carried out of each stage)" ^0
"  into the pipeline   : " + str(money_in) ^0
"  after normalise     : " + str(stage_total(a_out)) ^0
"  after dedup         : " + str(money_out) ^0
"" ^0
"end to end, money lost: " + str(money_in - money_out) ^0
"" ^0

# ---- dedup is innocent when tested alone ----

stage_dedup(rows) => raw_dedup
"dedup run on the RAW input, which is what its own fixture holds" ^0
"  rows in  : " + str(len(rows)) ^0
"  rows out : " + str(len(raw_dedup)) ^0
"  money out: " + str(stage_total(raw_dedup)) ^0
"  lost     : " + str(money_in - stage_total(raw_dedup)) ^0
"" ^0

# ---- what each check would have had to say ----

len(rows) - len(b_out) => rows_dropped
"rows dropped by the composition: " + str(rows_dropped) ^0
"checks that mention money at all:" ^0
"  normalise's check is about count : 0" ^0
"  dedup's check is about names     : 0" ^0
"  total's check is about its input : 0" ^0
"" ^0

# ---- the fix is a different dedup, not a fourth check ----

stage_dedup_merging(a_out) => merged
stage_total(merged) => merged_money
"dedup that MERGES instead of dropping" ^0
"  rows out : " + str(len(merged)) ^0
"  money out: " + str(merged_money) ^0
"  lost     : " + str(money_in - merged_money) ^0
"" ^0

if merged_money == money_in:
    "merging dedup conserves money; dropping dedup does not" ^0
else:
    "merging dedup ALSO loses money" ^0

if len(merged) == len(b_out):
    "both dedups return the same number of rows, so a row-count check cannot tell them apart" ^0
else:
    "the two dedups differ in row count as well" ^0
```

## Python (deterministic transpilation)

```python
def canonical(name, alias):
    if name in alias:
        return alias[name]
    return name

def stage_normalise(rows, alias):
    out = []
    for r in rows:
        out = out + [[r[0], canonical(r[1], alias), r[2]]]
    return out

def stage_dedup(rows):
    out = []
    seen = []
    for r in rows:
        if r[1] in seen:
            pass
        else:
            seen = seen + [r[1]]
            out = out + [r]
    return out

def stage_dedup_merging(rows):
    out = []
    seen = []
    for r in rows:
        if r[1] in seen:
            nxt = []
            for o in out:
                if o[1] == r[1]:
                    nxt = nxt + [[o[0], o[1], o[2] + r[2]]]
                else:
                    nxt = nxt + [o]
            out = nxt
        else:
            seen = seen + [r[1]]
            out = out + [r]
    return out

def stage_total(rows):
    t = 0
    for r in rows:
        t = t + r[2]
    return t

def check_normalise_keeps_count(rows, alias):
    out = stage_normalise(rows, alias)
    if len(out) == len(rows):
        return 1
    return 0

def check_dedup_names_are_distinct(rows):
    out = stage_dedup(rows)
    seen = []
    ok = 1
    for r in out:
        if r[1] in seen:
            ok = 0
        seen = seen + [r[1]]
    return ok

def check_total_sums_what_it_was_given(rows):
    manual = 0
    for r in rows:
        manual = manual + r[2]
    if stage_total(rows) == manual:
        return 1
    return 0

rows = [[1, "Ann M.", 120], [2, "Ross", 80], [3, "Ann", 45], [4, "A. Ross", 60], [5, "Kim", 30], [6, "Kim K.", 25]]
alias = {"Ann M.": "Ann", "A. Ross": "Ross", "Kim K.": "Kim"}
print("stage checks, each written by the stage's own author")
print("  normalise keeps the row count : " + str(check_normalise_keeps_count(rows, alias)))
print("  dedup output names distinct   : " + str(check_dedup_names_are_distinct(stage_normalise(rows, alias))))
print("  total sums what it was given  : " + str(check_total_sums_what_it_was_given(rows)))
print("")
money_in = stage_total(rows)
a_out = stage_normalise(rows, alias)
b_out = stage_dedup(a_out)
money_out = stage_total(b_out)
print("per-stage ledger (money carried out of each stage)")
print("  into the pipeline   : " + str(money_in))
print("  after normalise     : " + str(stage_total(a_out)))
print("  after dedup         : " + str(money_out))
print("")
print("end to end, money lost: " + str(money_in - money_out))
print("")
raw_dedup = stage_dedup(rows)
print("dedup run on the RAW input, which is what its own fixture holds")
print("  rows in  : " + str(len(rows)))
print("  rows out : " + str(len(raw_dedup)))
print("  money out: " + str(stage_total(raw_dedup)))
print("  lost     : " + str(money_in - stage_total(raw_dedup)))
print("")
rows_dropped = len(rows) - len(b_out)
print("rows dropped by the composition: " + str(rows_dropped))
print("checks that mention money at all:")
print("  normalise's check is about count : 0")
print("  dedup's check is about names     : 0")
print("  total's check is about its input : 0")
print("")
merged = stage_dedup_merging(a_out)
merged_money = stage_total(merged)
print("dedup that MERGES instead of dropping")
print("  rows out : " + str(len(merged)))
print("  money out: " + str(merged_money))
print("  lost     : " + str(money_in - merged_money))
print("")
if merged_money == money_in:
    print("merging dedup conserves money; dropping dedup does not")
else:
    print("merging dedup ALSO loses money")
if len(merged) == len(b_out):
    print("both dedups return the same number of rows, so a row-count check cannot tell them apart")
else:
    print("the two dedups differ in row count as well")
```

## stdout (executed)

```text
stage checks, each written by the stage's own author
  normalise keeps the row count : 1
  dedup output names distinct   : 1
  total sums what it was given  : 1

per-stage ledger (money carried out of each stage)
  into the pipeline   : 360
  after normalise     : 360
  after dedup         : 230

end to end, money lost: 130

dedup run on the RAW input, which is what its own fixture holds
  rows in  : 6
  rows out : 6
  money out: 360
  lost     : 0

rows dropped by the composition: 3
checks that mention money at all:
  normalise's check is about count : 0
  dedup's check is about names     : 0
  total's check is about its input : 0

dedup that MERGES instead of dropping
  rows out : 3
  money out: 360
  lost     : 0

merging dedup conserves money; dropping dedup does not
both dedups return the same number of rows, so a row-count check cannot tell them apart
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
