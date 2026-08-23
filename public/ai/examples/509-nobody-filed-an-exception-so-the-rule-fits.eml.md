<!-- canonical: efficientnewlanguage.org/ai/examples/509-nobody-filed-an-exception-so-the-rule-fits | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 509 — Nobody filed an exception so the rule fits

`nobody_filed_an_exception_so_the_rule_fits.eml` - A coding standard has drawn two exception requests in eighteen months, and both were granted. What that low number measures is computed below, against what it is being read as measuring.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A coding
# standard has drawn two exception requests in eighteen months, and both were
# granted. What that low number measures is computed below, against what it is
# being read as measuring.
#
# The standard is good. It was written after a real class of bug, it is
# specific, it has a rationale document, and the team that wrote it converted
# the existing code themselves rather than leaving it to everyone else. Two
# requests across eighteen months is what a well-fitted rule looks like, and
# granting both is what a reasonable owner looks like.
#
# It is also what an expensive exception process looks like. An exception is
# filed by somebody weighing the cost of filing against the cost of complying,
# and where filing costs more, the rule fits by construction. The request
# count is a measurement of that threshold, not of the rule.
#
# The cost of each path is computed below, per case.

# [case, hours to comply, hours to file an exception, filed?, what complying cost]
[["batch importer", 3, 14, "no", "a second parse of the same file"], ["legacy adapter", 20, 14, "yes", "nothing, it was granted"], ["report builder", 6, 14, "no", "a duplicated struct"], ["stream joiner", 40, 14, "yes", "nothing, it was granted"], ["config loader", 2, 14, "no", "an extra allocation"], ["metrics shim", 9, 14, "no", "a wrapper nobody reads"], ["mail templater", 5, 14, "no", "two copies of one string table"], ["auth cache", 11, 14, "no", "a lock held longer"]] => cases

len(cases) => n
cases[0][2] => file_cost

"cases where the rule applied : " + str(n) ^0
"cost of filing an exception  : " + str(file_cost) + " hours" ^0
"" ^0

"case              comply (h)   file (h)   cheaper      filed?" ^0
0 => filed
0 => comply_cheaper
for c in cases:
    "" => cheaper
    if c[1] < c[2]:
        "comply" => cheaper
        comply_cheaper + 1 => comply_cheaper
    else:
        "file" => cheaper
    if c[3] == "yes":
        filed + 1 => filed
    "  " + c[0] + "   " + str(c[1]) + "           " + str(c[2]) + "        " + cheaper + "       " + c[3] ^0
"" ^0

"exceptions filed : " + str(filed) + " of " + str(n) ^0
"cases where filing was the cheaper path : " + str(n - comply_cheaper) ^0
if filed == n - comply_cheaper:
    "  every case where filing was cheaper was filed, and no case where it" ^0
    "  was dearer was filed" ^0
    "  so the filing decision is fully explained by the " + str(file_cost) + "-hour threshold" ^0
"" ^0

# ---- what the zero is measuring ----

"the cases that complied without filing" ^0
0 => silent_cost
for c in cases:
    if c[3] == "no":
        silent_cost + c[1] => silent_cost
        "  " + c[0] + " : " + str(c[1]) + " hours, and it left " + c[4] ^0
"  total complied cost : " + str(silent_cost) + " hours" ^0
"  exception requests these generated : 0" ^0
"  the rule's record shows zero friction and the codebase shows " + str(silent_cost) + " hours" ^0
"  of it" ^0
"" ^0

# ---- what a cheaper process would surface ----

3 => cheap_file
0 => would_file
0 => would_hours
for c in cases:
    if c[1] > cheap_file:
        would_file + 1 => would_file
        would_hours + c[1] => would_hours
"the same eight cases with a " + str(cheap_file) + "-hour filing cost" ^0
"  cases where filing becomes the cheaper path : " + str(would_file) + " of " + str(n) ^0
"  hours of compliance work they represent    : " + str(would_hours) ^0
"  requests the rule's owners would see       : " + str(would_file) + ", against " + str(filed) + " today" ^0
"  none of those cases changed, and none of them are new" ^0
"" ^0

# ---- the threshold decides the evidence ----

"how many cases file, as the filing cost moves" ^0
[2, 6, 10, 14, 20, 40] => thresholds
0 => at_cheapest
0 => at_dearest
for t in thresholds:
    0 => k
    for c in cases:
        if c[1] > t:
            k + 1 => k
    "  filing costs " + str(t) + "h : " + str(k) + " of " + str(n) + " would file" ^0
    if t == thresholds[0]:
        k => at_cheapest
    if t == thresholds[len(thresholds) - 1]:
        k => at_dearest
"  the rule did not change anywhere across that range" ^0
"  the evidence about it moved from " + str(at_cheapest) + " requests to " + str(at_dearest) ^0
"  a rule is called well fitted on the strength of this number" ^0
"" ^0

# ---- what the two exceptions had in common ----

"the two that were filed" ^0
for c in cases:
    if c[3] == "yes":
        "  " + c[0] + " : " + str(c[1]) + " hours to comply, " + str(c[1] - c[2]) + " hours above the filing cost" ^0
"  both were granted, so the rule's owners agreed the rule did not fit" ^0
"  they are the two most expensive cases here, and the process selected" ^0
"  them by expense rather than by fit" ^0
"" ^0

# ---- the control: a rule with no compliance cost ----
#
# Where complying is free, nobody files regardless of what filing costs, and
# zero requests really does mean the rule fits.

[["import ordering", 0, 14, "no", "nothing"]] => free
for f in free:
    "control - " + f[0] + ", " + str(f[1]) + " hours to comply" ^0
    "  filing cost : " + str(f[2]) + " hours" ^0
    "  cases where filing is cheaper : 0" ^0
    "  requests : 0" ^0
    "  here the zero is the same zero at any filing cost, so it carries" ^0
    "  information about the rule" ^0
"" ^0

"The standard is well written and two requests in eighteen months is what a" ^0
"fitted rule looks like. It is also what a " + str(file_cost) + "-hour filing cost looks like," ^0
"and the " + str(silent_cost) + " hours that complied quietly are in neither number." ^0
```

## Python (deterministic transpilation)

```python
cases = [["batch importer", 3, 14, "no", "a second parse of the same file"], ["legacy adapter", 20, 14, "yes", "nothing, it was granted"], ["report builder", 6, 14, "no", "a duplicated struct"], ["stream joiner", 40, 14, "yes", "nothing, it was granted"], ["config loader", 2, 14, "no", "an extra allocation"], ["metrics shim", 9, 14, "no", "a wrapper nobody reads"], ["mail templater", 5, 14, "no", "two copies of one string table"], ["auth cache", 11, 14, "no", "a lock held longer"]]
n = len(cases)
file_cost = cases[0][2]
print("cases where the rule applied : " + str(n))
print("cost of filing an exception  : " + str(file_cost) + " hours")
print("")
print("case              comply (h)   file (h)   cheaper      filed?")
filed = 0
comply_cheaper = 0
for c in cases:
    cheaper = ""
    if c[1] < c[2]:
        cheaper = "comply"
        comply_cheaper = comply_cheaper + 1
    else:
        cheaper = "file"
    if c[3] == "yes":
        filed = filed + 1
    print("  " + c[0] + "   " + str(c[1]) + "           " + str(c[2]) + "        " + cheaper + "       " + c[3])
print("")
print("exceptions filed : " + str(filed) + " of " + str(n))
print("cases where filing was the cheaper path : " + str(n - comply_cheaper))
if filed == n - comply_cheaper:
    print("  every case where filing was cheaper was filed, and no case where it")
    print("  was dearer was filed")
    print("  so the filing decision is fully explained by the " + str(file_cost) + "-hour threshold")
print("")
print("the cases that complied without filing")
silent_cost = 0
for c in cases:
    if c[3] == "no":
        silent_cost = silent_cost + c[1]
        print("  " + c[0] + " : " + str(c[1]) + " hours, and it left " + c[4])
print("  total complied cost : " + str(silent_cost) + " hours")
print("  exception requests these generated : 0")
print("  the rule's record shows zero friction and the codebase shows " + str(silent_cost) + " hours")
print("  of it")
print("")
cheap_file = 3
would_file = 0
would_hours = 0
for c in cases:
    if c[1] > cheap_file:
        would_file = would_file + 1
        would_hours = would_hours + c[1]
print("the same eight cases with a " + str(cheap_file) + "-hour filing cost")
print("  cases where filing becomes the cheaper path : " + str(would_file) + " of " + str(n))
print("  hours of compliance work they represent    : " + str(would_hours))
print("  requests the rule's owners would see       : " + str(would_file) + ", against " + str(filed) + " today")
print("  none of those cases changed, and none of them are new")
print("")
print("how many cases file, as the filing cost moves")
thresholds = [2, 6, 10, 14, 20, 40]
at_cheapest = 0
at_dearest = 0
for t in thresholds:
    k = 0
    for c in cases:
        if c[1] > t:
            k = k + 1
    print("  filing costs " + str(t) + "h : " + str(k) + " of " + str(n) + " would file")
    if t == thresholds[0]:
        at_cheapest = k
    if t == thresholds[len(thresholds) - 1]:
        at_dearest = k
print("  the rule did not change anywhere across that range")
print("  the evidence about it moved from " + str(at_cheapest) + " requests to " + str(at_dearest))
print("  a rule is called well fitted on the strength of this number")
print("")
print("the two that were filed")
for c in cases:
    if c[3] == "yes":
        print("  " + c[0] + " : " + str(c[1]) + " hours to comply, " + str(c[1] - c[2]) + " hours above the filing cost")
print("  both were granted, so the rule's owners agreed the rule did not fit")
print("  they are the two most expensive cases here, and the process selected")
print("  them by expense rather than by fit")
print("")
free = [["import ordering", 0, 14, "no", "nothing"]]
for f in free:
    print("control - " + f[0] + ", " + str(f[1]) + " hours to comply")
    print("  filing cost : " + str(f[2]) + " hours")
    print("  cases where filing is cheaper : 0")
    print("  requests : 0")
    print("  here the zero is the same zero at any filing cost, so it carries")
    print("  information about the rule")
print("")
print("The standard is well written and two requests in eighteen months is what a")
print("fitted rule looks like. It is also what a " + str(file_cost) + "-hour filing cost looks like,")
print("and the " + str(silent_cost) + " hours that complied quietly are in neither number.")
```

## stdout (executed)

```text
cases where the rule applied : 8
cost of filing an exception  : 14 hours

case              comply (h)   file (h)   cheaper      filed?
  batch importer   3           14        comply       no
  legacy adapter   20           14        file       yes
  report builder   6           14        comply       no
  stream joiner   40           14        file       yes
  config loader   2           14        comply       no
  metrics shim   9           14        comply       no
  mail templater   5           14        comply       no
  auth cache   11           14        comply       no

exceptions filed : 2 of 8
cases where filing was the cheaper path : 2
  every case where filing was cheaper was filed, and no case where it
  was dearer was filed
  so the filing decision is fully explained by the 14-hour threshold

the cases that complied without filing
  batch importer : 3 hours, and it left a second parse of the same file
  report builder : 6 hours, and it left a duplicated struct
  config loader : 2 hours, and it left an extra allocation
  metrics shim : 9 hours, and it left a wrapper nobody reads
  mail templater : 5 hours, and it left two copies of one string table
  auth cache : 11 hours, and it left a lock held longer
  total complied cost : 36 hours
  exception requests these generated : 0
  the rule's record shows zero friction and the codebase shows 36 hours
  of it

the same eight cases with a 3-hour filing cost
  cases where filing becomes the cheaper path : 6 of 8
  hours of compliance work they represent    : 91
  requests the rule's owners would see       : 6, against 2 today
  none of those cases changed, and none of them are new

how many cases file, as the filing cost moves
  filing costs 2h : 7 of 8 would file
  filing costs 6h : 4 of 8 would file
  filing costs 10h : 3 of 8 would file
  filing costs 14h : 2 of 8 would file
  filing costs 20h : 1 of 8 would file
  filing costs 40h : 0 of 8 would file
  the rule did not change anywhere across that range
  the evidence about it moved from 7 requests to 0
  a rule is called well fitted on the strength of this number

the two that were filed
  legacy adapter : 20 hours to comply, 6 hours above the filing cost
  stream joiner : 40 hours to comply, 26 hours above the filing cost
  both were granted, so the rule's owners agreed the rule did not fit
  they are the two most expensive cases here, and the process selected
  them by expense rather than by fit

control - import ordering, 0 hours to comply
  filing cost : 14 hours
  cases where filing is cheaper : 0
  requests : 0
  here the zero is the same zero at any filing cost, so it carries
  information about the rule

The standard is well written and two requests in eighteen months is what a
fitted rule looks like. It is also what a 14-hour filing cost looks like,
and the 36 hours that complied quietly are in neither number.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
