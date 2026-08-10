<!-- canonical: efficientnewlanguage.org/ai/examples/335-upstream-guard-makes-the-downstream-guard-dead | ai_layer_version: 0.1.0 | updated: 2026-08-10 -->

# Example 335 — The upstream guard makes the downstream guard dead — and the dead one is wrong

`upstream_guard_makes_the_downstream_guard_dead.eml` runs six orders through two validators in series, then through the second one alone.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two validators in
# series. The second one is wrong, and has been since it was written, and the
# first one is why nobody found out.
#
# Both check the same rule: a line must have a positive quantity. The first
# uses `quantity <= 0`. The second uses `quantity < 0`, so it lets a zero
# through. In the pipeline that never matters, because nothing with quantity
# zero survives the first check to reach the second. The second validator's
# reject branch has never run against real data.
#
# That is not an argument for deleting it. It is an argument for noticing that
# its correctness has never been observed. The day the first check moves, is
# replaced by a schema, or stops running for one code path, the second becomes
# load-bearing for the first time - and it is wrong.
#
# The measurement runs the same orders through the pipeline with and without
# the upstream guard, and counts what each validator actually rejects.

def validate_upstream(order):
    if order[1] <= 0:
        return 0
    return 1

def validate_downstream(order):
    if order[1] < 0:
        return 0
    return 1

def truly_valid(order):
    if order[1] <= 0:
        return 0
    return 1

[["a", 3], ["b", 0], ["c", 5], ["d", 0 - 2], ["e", 0], ["f", 1]] => orders

# ---- both validators in series, the way the system is wired ----

0 => up_rejects
0 => down_rejects
0 => accepted
0 => bad_accepted
for o in orders:
    if validate_upstream(o) == 0:
        up_rejects + 1 => up_rejects
    else:
        if validate_downstream(o) == 0:
            down_rejects + 1 => down_rejects
        else:
            accepted + 1 => accepted
            if truly_valid(o) == 0:
                bad_accepted + 1 => bad_accepted

"with the upstream guard in place" ^0
"  upstream rejected   : " + str(up_rejects) ^0
"  downstream rejected : " + str(down_rejects) ^0
"  accepted            : " + str(accepted) ^0
"  invalid accepted    : " + str(bad_accepted) ^0
"" ^0

# ---- the same orders, upstream removed ----

0 => d_rejects
0 => d_accepted
0 => d_bad
for o in orders:
    if validate_downstream(o) == 0:
        d_rejects + 1 => d_rejects
    else:
        d_accepted + 1 => d_accepted
        if truly_valid(o) == 0:
            d_bad + 1 => d_bad

"with the upstream guard removed" ^0
"  downstream rejected : " + str(d_rejects) ^0
"  accepted            : " + str(d_accepted) ^0
"  invalid accepted    : " + str(d_bad) ^0
"" ^0

# ---- which of the downstream validator's outcomes are reachable at all ----

"downstream validator, outcomes reachable through the pipeline" ^0
0 => reject_reachable
0 => accept_reachable
for o in orders:
    if validate_upstream(o) == 1:
        if validate_downstream(o) == 0:
            reject_reachable + 1 => reject_reachable
        else:
            accept_reachable + 1 => accept_reachable
"  reject branch reached : " + str(reject_reachable) + " times" ^0
"  accept branch reached : " + str(accept_reachable) + " times" ^0
"" ^0

"downstream validator, outcomes reachable when called directly" ^0
0 => dr
0 => da
for o in orders:
    if validate_downstream(o) == 0:
        dr + 1 => dr
    else:
        da + 1 => da
"  reject branch reached : " + str(dr) + " times" ^0
"  accept branch reached : " + str(da) + " times" ^0
"" ^0

# ---- the disagreement between the two validators, on this data ----

"orders the two validators disagree about" ^0
0 => disagreements
for o in orders:
    if validate_upstream(o) != validate_downstream(o):
        disagreements + 1 => disagreements
        "  " + o[0] + " qty " + str(o[1]) + ": upstream " + str(validate_upstream(o)) + " downstream " + str(validate_downstream(o)) ^0
"  total: " + str(disagreements) ^0
"" ^0
"Every one of those disagreements is invisible while the upstream guard runs" ^0
"first, because the upstream guard removes exactly the orders they disagree" ^0
"about. Composition did not hide a bug behind a bug - it made the second" ^0
"check's answer unobservable, which is a different and quieter thing." ^0
```

## Python (deterministic transpilation)

```python
def validate_upstream(order):
    if order[1] <= 0:
        return 0
    return 1

def validate_downstream(order):
    if order[1] < 0:
        return 0
    return 1

def truly_valid(order):
    if order[1] <= 0:
        return 0
    return 1

orders = [["a", 3], ["b", 0], ["c", 5], ["d", 0 - 2], ["e", 0], ["f", 1]]
up_rejects = 0
down_rejects = 0
accepted = 0
bad_accepted = 0
for o in orders:
    if validate_upstream(o) == 0:
        up_rejects = up_rejects + 1
    elif validate_downstream(o) == 0:
        down_rejects = down_rejects + 1
    else:
        accepted = accepted + 1
        if truly_valid(o) == 0:
            bad_accepted = bad_accepted + 1
print("with the upstream guard in place")
print("  upstream rejected   : " + str(up_rejects))
print("  downstream rejected : " + str(down_rejects))
print("  accepted            : " + str(accepted))
print("  invalid accepted    : " + str(bad_accepted))
print("")
d_rejects = 0
d_accepted = 0
d_bad = 0
for o in orders:
    if validate_downstream(o) == 0:
        d_rejects = d_rejects + 1
    else:
        d_accepted = d_accepted + 1
        if truly_valid(o) == 0:
            d_bad = d_bad + 1
print("with the upstream guard removed")
print("  downstream rejected : " + str(d_rejects))
print("  accepted            : " + str(d_accepted))
print("  invalid accepted    : " + str(d_bad))
print("")
print("downstream validator, outcomes reachable through the pipeline")
reject_reachable = 0
accept_reachable = 0
for o in orders:
    if validate_upstream(o) == 1:
        if validate_downstream(o) == 0:
            reject_reachable = reject_reachable + 1
        else:
            accept_reachable = accept_reachable + 1
print("  reject branch reached : " + str(reject_reachable) + " times")
print("  accept branch reached : " + str(accept_reachable) + " times")
print("")
print("downstream validator, outcomes reachable when called directly")
dr = 0
da = 0
for o in orders:
    if validate_downstream(o) == 0:
        dr = dr + 1
    else:
        da = da + 1
print("  reject branch reached : " + str(dr) + " times")
print("  accept branch reached : " + str(da) + " times")
print("")
print("orders the two validators disagree about")
disagreements = 0
for o in orders:
    if validate_upstream(o) != validate_downstream(o):
        disagreements = disagreements + 1
        print("  " + o[0] + " qty " + str(o[1]) + ": upstream " + str(validate_upstream(o)) + " downstream " + str(validate_downstream(o)))
print("  total: " + str(disagreements))
print("")
print("Every one of those disagreements is invisible while the upstream guard runs")
print("first, because the upstream guard removes exactly the orders they disagree")
print("about. Composition did not hide a bug behind a bug - it made the second")
print("check's answer unobservable, which is a different and quieter thing.")
```

## stdout (executed)

```text
with the upstream guard in place
  upstream rejected   : 3
  downstream rejected : 0
  accepted            : 3
  invalid accepted    : 0

with the upstream guard removed
  downstream rejected : 1
  accepted            : 5
  invalid accepted    : 2

downstream validator, outcomes reachable through the pipeline
  reject branch reached : 0 times
  accept branch reached : 3 times

downstream validator, outcomes reachable when called directly
  reject branch reached : 1 times
  accept branch reached : 5 times

orders the two validators disagree about
  b qty 0: upstream 0 downstream 1
  e qty 0: upstream 0 downstream 1
  total: 2

Every one of those disagreements is invisible while the upstream guard runs
first, because the upstream guard removes exactly the orders they disagree
about. Composition did not hide a bug behind a bug - it made the second
check's answer unobservable, which is a different and quieter thing.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
