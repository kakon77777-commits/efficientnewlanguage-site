<!-- canonical: efficientnewlanguage.org/ai/examples/334-upstream-changed-scale-downstream-kept-thresholds | ai_layer_version: 0.1.0 | updated: 2026-08-10 -->

# Example 334 — Upstream changed scale, downstream kept thresholds — both test suites green, the report worthless

`upstream_changed_scale_downstream_kept_thresholds.eml` scores twelve inputs on the old scale and the new one, buckets both with the *same unchanged* code, and compares the distributions.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). One stage changes
# the scale of the number it produces. The stage after it keeps thresholds that
# were written against the old scale. Nothing raises, every record still gets a
# label, and the report is worthless.
#
# The contract between the two stages was never written down, because it was
# never a decision - it was an artefact of how the first version happened to
# compute the number. "Scores are 0 to 100" lived in the thresholds of the
# second stage and nowhere else, which means the first stage was free to change
# it without breaking anything it could see.
#
# Both sides keep their own tests, and both sets pass. Scoring's tests check
# the new numbers are computed correctly, and they are. Bucketing's tests use
# fixtures written when the scale was 0-100, and they still pass, because
# bucketing did not change. What no test holds is the pair.
#
# The failure is quiet in the way that matters: total records is right, no
# bucket is negative, every record is classified, and the numbers are ordered
# the same way they always were. Only the distribution is wrong, and a
# distribution has no obviously-correct value to compare against.

def score_old(raw):
    return raw

def score_new(raw):
    return raw * 10

def bucket(s):
    if s > 80:
        return "high"
    if s > 50:
        return "medium"
    return "low"

def distribution(raws, scorer):
    0 => hi
    0 => mid
    0 => lo
    for r in raws:
        if scorer == "old":
            score_old(r) => s
        else:
            score_new(r) => s
        bucket(s) => b
        if b == "high":
            hi + 1 => hi
        if b == "medium":
            mid + 1 => mid
        if b == "low":
            lo + 1 => lo
    return [hi, mid, lo]

def show(name, d, n):
    "  " + name + ": high " + str(d[0]) + "  medium " + str(d[1]) + "  low " + str(d[2]) + "  (total " + str(d[0] + d[1] + d[2]) + " of " + str(n) + ")" ^0

[3, 12, 25, 40, 47, 55, 61, 72, 84, 91, 96, 99] => raws

"the same twelve inputs, scored two ways, bucketed by the SAME unchanged code" ^0
distribution(raws, "old") => d_old
distribution(raws, "new") => d_new
show("scale 0-100  ", d_old, len(raws))
show("scale 0-1000 ", d_new, len(raws))
"" ^0

# ---- bucketing's own tests still pass ----

"bucketing's own fixtures, written when the scale was 0-100" ^0
[[10, "low"], [55, "medium"], [90, "high"], [80, "medium"], [81, "high"], [50, "low"]] => fixtures
0 => failing
for f in fixtures:
    if bucket(f[0]) != f[1]:
        failing + 1 => failing
"  fixtures failing: " + str(failing) + " of " + str(len(fixtures)) ^0
"  bucketing was not edited, so this could not have gone any other way" ^0
"" ^0

# ---- scoring's own tests pass too ----

"scoring's own fixtures, written for the new scale" ^0
[[3, 30], [47, 470], [99, 990]] => score_fixtures
0 => sfail
for f in score_fixtures:
    if score_new(f[0]) != f[1]:
        sfail + 1 => sfail
"  fixtures failing: " + str(sfail) + " of " + str(len(score_fixtures)) ^0
"" ^0

# ---- everything a downstream sanity check would look at is still fine ----

"properties that survive the change, and so cannot report it" ^0
"  every record classified : " + str(d_new[0] + d_new[1] + d_new[2] == len(raws)) ^0
"  no negative counts      : " + str(min(d_new) >= 0) ^0
0 => inversions
for i in [0:len(raws) - 2]:
    if raws[i] < raws[i + 1]:
        if score_new(raws[i]) > score_new(raws[i + 1]):
            inversions + 1 => inversions
"  order preserved by score: " + str(inversions == 0) ^0
"" ^0

# ---- what does change ----

0 => moved
for r in raws:
    if bucket(score_old(r)) != bucket(score_new(r)):
        moved + 1 => moved
"records that changed bucket: " + str(moved) + " of " + str(len(raws)) ^0
"buckets that ended up empty: " + str(3 - len([x for x in d_new if x > 0])) ^0
"" ^0

# ---- the check that would have caught it, at the seam ----

"a range assertion at the seam, which nobody wrote" ^0
0 => out_of_range
for r in raws:
    if score_new(r) > 100:
        out_of_range + 1 => out_of_range
"  scores outside the 0-100 the thresholds assume: " + str(out_of_range) + " of " + str(len(raws)) ^0
"" ^0
"That check belongs to neither stage. Scoring has no reason to bound its own" ^0
"output at 100, and bucketing has no reason to reject an input it can classify." ^0
"The assumption lived in the thresholds and nowhere a change could reach it." ^0
```

## Python (deterministic transpilation)

```python
def score_old(raw):
    return raw

def score_new(raw):
    return raw * 10

def bucket(s):
    if s > 80:
        return "high"
    if s > 50:
        return "medium"
    return "low"

def distribution(raws, scorer):
    hi = 0
    mid = 0
    lo = 0
    for r in raws:
        if scorer == "old":
            s = score_old(r)
        else:
            s = score_new(r)
        b = bucket(s)
        if b == "high":
            hi = hi + 1
        if b == "medium":
            mid = mid + 1
        if b == "low":
            lo = lo + 1
    return [hi, mid, lo]

def show(name, d, n):
    print("  " + name + ": high " + str(d[0]) + "  medium " + str(d[1]) + "  low " + str(d[2]) + "  (total " + str(d[0] + d[1] + d[2]) + " of " + str(n) + ")")

raws = [3, 12, 25, 40, 47, 55, 61, 72, 84, 91, 96, 99]
print("the same twelve inputs, scored two ways, bucketed by the SAME unchanged code")
d_old = distribution(raws, "old")
d_new = distribution(raws, "new")
show("scale 0-100  ", d_old, len(raws))
show("scale 0-1000 ", d_new, len(raws))
print("")
print("bucketing's own fixtures, written when the scale was 0-100")
fixtures = [[10, "low"], [55, "medium"], [90, "high"], [80, "medium"], [81, "high"], [50, "low"]]
failing = 0
for f in fixtures:
    if bucket(f[0]) != f[1]:
        failing = failing + 1
print("  fixtures failing: " + str(failing) + " of " + str(len(fixtures)))
print("  bucketing was not edited, so this could not have gone any other way")
print("")
print("scoring's own fixtures, written for the new scale")
score_fixtures = [[3, 30], [47, 470], [99, 990]]
sfail = 0
for f in score_fixtures:
    if score_new(f[0]) != f[1]:
        sfail = sfail + 1
print("  fixtures failing: " + str(sfail) + " of " + str(len(score_fixtures)))
print("")
print("properties that survive the change, and so cannot report it")
print("  every record classified : " + str(d_new[0] + d_new[1] + d_new[2] == len(raws)))
print("  no negative counts      : " + str(min(d_new) >= 0))
inversions = 0
for i in range(0, len(raws) - 2+1):
    if raws[i] < raws[i + 1]:
        if score_new(raws[i]) > score_new(raws[i + 1]):
            inversions = inversions + 1
print("  order preserved by score: " + str(inversions == 0))
print("")
moved = 0
for r in raws:
    if bucket(score_old(r)) != bucket(score_new(r)):
        moved = moved + 1
print("records that changed bucket: " + str(moved) + " of " + str(len(raws)))
print("buckets that ended up empty: " + str(3 - len([x for x in d_new if x > 0])))
print("")
print("a range assertion at the seam, which nobody wrote")
out_of_range = 0
for r in raws:
    if score_new(r) > 100:
        out_of_range = out_of_range + 1
print("  scores outside the 0-100 the thresholds assume: " + str(out_of_range) + " of " + str(len(raws)))
print("")
print("That check belongs to neither stage. Scoring has no reason to bound its own")
print("output at 100, and bucketing has no reason to reject an input it can classify.")
print("The assumption lived in the thresholds and nowhere a change could reach it.")
```

## stdout (executed)

```text
the same twelve inputs, scored two ways, bucketed by the SAME unchanged code
  scale 0-100  : high 4  medium 3  low 5  (total 12 of 12)
  scale 0-1000 : high 11  medium 0  low 1  (total 12 of 12)

bucketing's own fixtures, written when the scale was 0-100
  fixtures failing: 0 of 6
  bucketing was not edited, so this could not have gone any other way

scoring's own fixtures, written for the new scale
  fixtures failing: 0 of 3

properties that survive the change, and so cannot report it
  every record classified : True
  no negative counts      : True
  order preserved by score: True

records that changed bucket: 7 of 12
buckets that ended up empty: 1

a range assertion at the seam, which nobody wrote
  scores outside the 0-100 the thresholds assume: 11 of 12

That check belongs to neither stage. Scoring has no reason to bound its own
output at 100, and bucketing has no reason to reject an input it can classify.
The assumption lived in the thresholds and nowhere a change could reach it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
