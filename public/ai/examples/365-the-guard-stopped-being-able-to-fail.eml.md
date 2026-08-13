<!-- canonical: efficientnewlanguage.org/ai/examples/365-the-guard-stopped-being-able-to-fail | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 365 — The guard stopped being able to fail — same green, 1 guard alive, then 0

`the_guard_stopped_being_able_to_fail.eml` drills every test in a suite by breaking the code it guards and re-running it.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A guard test that
# was correct when written, has never been touched, and can no longer fail.
#
# The test checks that the discount cap is enforced. When it was written its
# fixture order was above the cap, so removing the cap made the test go red -
# it was a real guard. Later somebody refreshed the fixtures to smaller, more
# typical amounts. Nothing about the test changed. Nothing about the cap
# changed. The test still passes.
#
# It now passes whether or not the cap exists, which means it has stopped being
# a statement about the cap and become a statement about arithmetic.
#
# The only way to find this is to break the thing the test guards and check
# that it goes red. That is not something a passing suite tells you, because a
# guard that cannot fail and a guard with nothing to catch look identical from
# the outside.
#
# Nothing is declared. Each test is drilled - the code it guards is broken and
# the test re-run - and its ability to fail is measured.

def apply_discount(amount, pct, cap_enforced):
    int(amount * pct / 100) => raw
    if cap_enforced == 1:
        if raw > 50:
            return 50
    return raw

# [name, amount, pct, expected]
[["small order", 100, 10, 10], ["medium order", 300, 15, 45], ["round number", 200, 20, 40]] => fixtures_now
[["small order", 100, 10, 10], ["large order", 900, 30, 50], ["round number", 200, 20, 40]] => fixtures_then

def run(fixtures, cap_enforced):
    0 => passed
    for f in fixtures:
        if apply_discount(f[1], f[2], cap_enforced) == f[3]:
            passed + 1 => passed
    return passed

def drill(fixtures):
    # a test can fail if it passes with the cap and fails without it
    0 => alive
    for f in fixtures:
        0 => with_cap
        0 => without_cap
        if apply_discount(f[1], f[2], 1) == f[3]:
            1 => with_cap
        if apply_discount(f[1], f[2], 0) == f[3]:
            1 => without_cap
        if with_cap == 1:
            if without_cap == 0:
                alive + 1 => alive
    return alive

# ---- both suites, both states ----

"the suite as it was when the guard was written" ^0
"  with the cap enforced : " + str(run(fixtures_then, 1)) + " of " + str(len(fixtures_then)) + " pass" ^0
"  with the cap removed  : " + str(run(fixtures_then, 0)) + " of " + str(len(fixtures_then)) + " pass" ^0
"  tests that can still fail if the cap is removed : " + str(drill(fixtures_then)) ^0
"" ^0

"the same suite after the fixtures were refreshed" ^0
"  with the cap enforced : " + str(run(fixtures_now, 1)) + " of " + str(len(fixtures_now)) + " pass" ^0
"  with the cap removed  : " + str(run(fixtures_now, 0)) + " of " + str(len(fixtures_now)) + " pass" ^0
"  tests that can still fail if the cap is removed : " + str(drill(fixtures_now)) ^0
"" ^0

# ---- what changed and what did not ----

"what changed between the two suites" ^0
0 => same_names
0 => same_expected
0 => changed_amount
0 => i
for f in fixtures_now:
    if f[0] == fixtures_then[i][0]:
        same_names + 1 => same_names
    if f[3] == fixtures_then[i][3]:
        same_expected + 1 => same_expected
    if f[1] != fixtures_then[i][1]:
        changed_amount + 1 => changed_amount
    i + 1 => i
"  test names unchanged  : " + str(same_names) + " of " + str(len(fixtures_now)) ^0
"  assertions unchanged  : " + str(same_expected) + " of " + str(len(fixtures_now)) ^0
"  fixture amounts changed : " + str(changed_amount) ^0
"  (premise, not measured here: no test code was edited - only fixture data)" ^0
"" ^0

# ---- the cap itself is untouched and still wrong to remove ----

[100, 300, 200, 900, 1000, 400] => real_orders
"orders on which removing the cap changes the answer" ^0
0 => affected
for a in real_orders:
    if apply_discount(a, 30, 1) != apply_discount(a, 30, 0):
        affected + 1 => affected
        "  amount " + str(a) + " : capped " + str(apply_discount(a, 30, 1)) + ", uncapped " + str(apply_discount(a, 30, 0)) ^0
"  affected : " + str(affected) + " of " + str(len(real_orders)) ^0
"" ^0

# ---- the two suites are indistinguishable from a green run ----

"what a green run reports, in each suite" ^0
if run(fixtures_then, 1) == len(fixtures_then):
    "  original fixtures : all pass" ^0
if run(fixtures_now, 1) == len(fixtures_now):
    "  refreshed fixtures : all pass" ^0
"  guards alive, original  : " + str(drill(fixtures_then)) ^0
"  guards alive, refreshed : " + str(drill(fixtures_now)) ^0
if drill(fixtures_now) == 0:
    "  the refreshed suite is green and guards nothing" ^0
"" ^0

# ---- a fixture that restores the guard ----

[["small order", 100, 10, 10], ["large order", 900, 30, 50], ["round number", 200, 20, 40], ["at the cap", 500, 30, 50]] => fixtures_repaired
"after adding one fixture above the cap" ^0
"  with the cap enforced : " + str(run(fixtures_repaired, 1)) + " of " + str(len(fixtures_repaired)) ^0
"  with the cap removed  : " + str(run(fixtures_repaired, 0)) + " of " + str(len(fixtures_repaired)) ^0
"  guards alive          : " + str(drill(fixtures_repaired)) ^0
"" ^0

"A guard that cannot fail and a guard with nothing to catch produce the same" ^0
"green. Telling them apart costs one deliberate break, and nothing in a" ^0
"passing run will ever prompt you to spend it." ^0
```

## Python (deterministic transpilation)

```python
def apply_discount(amount, pct, cap_enforced):
    raw = int(amount * pct / 100)
    if cap_enforced == 1:
        if raw > 50:
            return 50
    return raw

fixtures_now = [["small order", 100, 10, 10], ["medium order", 300, 15, 45], ["round number", 200, 20, 40]]
fixtures_then = [["small order", 100, 10, 10], ["large order", 900, 30, 50], ["round number", 200, 20, 40]]

def run(fixtures, cap_enforced):
    passed = 0
    for f in fixtures:
        if apply_discount(f[1], f[2], cap_enforced) == f[3]:
            passed = passed + 1
    return passed

def drill(fixtures):
    alive = 0
    for f in fixtures:
        with_cap = 0
        without_cap = 0
        if apply_discount(f[1], f[2], 1) == f[3]:
            with_cap = 1
        if apply_discount(f[1], f[2], 0) == f[3]:
            without_cap = 1
        if with_cap == 1:
            if without_cap == 0:
                alive = alive + 1
    return alive

print("the suite as it was when the guard was written")
print("  with the cap enforced : " + str(run(fixtures_then, 1)) + " of " + str(len(fixtures_then)) + " pass")
print("  with the cap removed  : " + str(run(fixtures_then, 0)) + " of " + str(len(fixtures_then)) + " pass")
print("  tests that can still fail if the cap is removed : " + str(drill(fixtures_then)))
print("")
print("the same suite after the fixtures were refreshed")
print("  with the cap enforced : " + str(run(fixtures_now, 1)) + " of " + str(len(fixtures_now)) + " pass")
print("  with the cap removed  : " + str(run(fixtures_now, 0)) + " of " + str(len(fixtures_now)) + " pass")
print("  tests that can still fail if the cap is removed : " + str(drill(fixtures_now)))
print("")
print("what changed between the two suites")
same_names = 0
same_expected = 0
changed_amount = 0
i = 0
for f in fixtures_now:
    if f[0] == fixtures_then[i][0]:
        same_names = same_names + 1
    if f[3] == fixtures_then[i][3]:
        same_expected = same_expected + 1
    if f[1] != fixtures_then[i][1]:
        changed_amount = changed_amount + 1
    i = i + 1
print("  test names unchanged  : " + str(same_names) + " of " + str(len(fixtures_now)))
print("  assertions unchanged  : " + str(same_expected) + " of " + str(len(fixtures_now)))
print("  fixture amounts changed : " + str(changed_amount))
print("  (premise, not measured here: no test code was edited - only fixture data)")
print("")
real_orders = [100, 300, 200, 900, 1000, 400]
print("orders on which removing the cap changes the answer")
affected = 0
for a in real_orders:
    if apply_discount(a, 30, 1) != apply_discount(a, 30, 0):
        affected = affected + 1
        print("  amount " + str(a) + " : capped " + str(apply_discount(a, 30, 1)) + ", uncapped " + str(apply_discount(a, 30, 0)))
print("  affected : " + str(affected) + " of " + str(len(real_orders)))
print("")
print("what a green run reports, in each suite")
if run(fixtures_then, 1) == len(fixtures_then):
    print("  original fixtures : all pass")
if run(fixtures_now, 1) == len(fixtures_now):
    print("  refreshed fixtures : all pass")
print("  guards alive, original  : " + str(drill(fixtures_then)))
print("  guards alive, refreshed : " + str(drill(fixtures_now)))
if drill(fixtures_now) == 0:
    print("  the refreshed suite is green and guards nothing")
print("")
fixtures_repaired = [["small order", 100, 10, 10], ["large order", 900, 30, 50], ["round number", 200, 20, 40], ["at the cap", 500, 30, 50]]
print("after adding one fixture above the cap")
print("  with the cap enforced : " + str(run(fixtures_repaired, 1)) + " of " + str(len(fixtures_repaired)))
print("  with the cap removed  : " + str(run(fixtures_repaired, 0)) + " of " + str(len(fixtures_repaired)))
print("  guards alive          : " + str(drill(fixtures_repaired)))
print("")
print("A guard that cannot fail and a guard with nothing to catch produce the same")
print("green. Telling them apart costs one deliberate break, and nothing in a")
print("passing run will ever prompt you to spend it.")
```

## stdout (executed)

```text
the suite as it was when the guard was written
  with the cap enforced : 3 of 3 pass
  with the cap removed  : 2 of 3 pass
  tests that can still fail if the cap is removed : 1

the same suite after the fixtures were refreshed
  with the cap enforced : 3 of 3 pass
  with the cap removed  : 3 of 3 pass
  tests that can still fail if the cap is removed : 0

what changed between the two suites
  test names unchanged  : 2 of 3
  assertions unchanged  : 2 of 3
  fixture amounts changed : 1
  (premise, not measured here: no test code was edited - only fixture data)

orders on which removing the cap changes the answer
  amount 300 : capped 50, uncapped 90
  amount 200 : capped 50, uncapped 60
  amount 900 : capped 50, uncapped 270
  amount 1000 : capped 50, uncapped 300
  amount 400 : capped 50, uncapped 120
  affected : 5 of 6

what a green run reports, in each suite
  original fixtures : all pass
  refreshed fixtures : all pass
  guards alive, original  : 1
  guards alive, refreshed : 0
  the refreshed suite is green and guards nothing

after adding one fixture above the cap
  with the cap enforced : 4 of 4
  with the cap removed  : 2 of 4
  guards alive          : 2

A guard that cannot fail and a guard with nothing to catch produce the same
green. Telling them apart costs one deliberate break, and nothing in a
passing run will ever prompt you to spend it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
