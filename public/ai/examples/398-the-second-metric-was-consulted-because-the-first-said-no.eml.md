<!-- canonical: efficientnewlanguage.org/ai/examples/398-the-second-metric-was-consulted-because-the-first-said-no | ai_layer_version: 0.1.0 | updated: 2026-08-15 -->

# Example 398 — The second metric was consulted because the first said no - 7 of 8 launches have something to report, with no effect anywhere

`the_second_metric_was_consulted_because_the_first_said_no.eml` runs eight hypothetical launches in which the true effect is zero on every metric, and counts how often each rule finds something.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Five metrics, no
# effect at all, and something to report in seven launches out of eight.
#
# Consulting a second metric is not cheating. The first one is a proxy, it has
# known weaknesses, and a team that stopped at one number would be criticised
# for it - correctly. Looking at engagement when conversion is flat is exactly
# what a careful person does.
#
# The rule that emerges is "ship if any of them moved", and it is never written
# down as that. Here the world has NO effect in it: every movement below is
# ordinary variation. The question is how often that rule finds something.

# Eight hypothetical launches, five metrics each, all pure variation.
# Positive numbers are not effects; there is no effect in this data.
[[2, -3, -1, -4, -2], [-1, -2, 4, -3, -1], [-2, -1, -3, -2, 3], [1, -4, -2, -1, -3], [-3, 5, -1, -2, -4], [-2, -3, -4, 2, -1], [-1, -2, -3, -4, -5], [3, -1, -2, -5, -2]] => launches

["conversion", "engagement", "retention", "revenue", "referrals"] => metric_names

def any_positive(row):
    for v in row:
        if v > 0:
            return 1
    return 0

def first_positive(row):
    if row[0] > 0:
        return 1
    return 0

def which_positive(row):
    "" => s
    0 => i
    for v in row:
        if v > 0:
            if len(s) > 0:
                s + ", " => s
            s + metric_names[i] => s
        i + 1 => i
    if len(s) == 0:
        return "none"
    return s

"launches : " + str(len(launches)) + ", metrics each : " + str(len(metric_names)) ^0
"  true effect in this data : 0 on every metric" ^0
"" ^0

"launch   something to report" ^0
0 => idx
for row in launches:
    idx + 1 => idx
    "  " + str(idx) + "      " + which_positive(row) ^0
"" ^0

0 => any_c
0 => first_c
for row in launches:
    any_c + any_positive(row) => any_c
    first_c + first_positive(row) => first_c

"how often each rule says ship" ^0
"  pre-registered, conversion only : " + str(first_c) + " of " + str(len(launches)) ^0
"  ship if any metric moved        : " + str(any_c) + " of " + str(len(launches)) ^0
"" ^0
"  in a world with no effect anywhere" ^0
"" ^0

# ---- what each extra metric buys ----

def any_of_first_k(row, k):
    0 => i
    for v in row:
        if i < k:
            if v > 0:
                return 1
        i + 1 => i
    return 0

"how the rule grows with each metric added" ^0
for k in [1:len(metric_names)]:
    0 => c
    for row in launches:
        c + any_of_first_k(row, k) => c
    "  first " + str(k) + " metric(s) : ships " + str(c) + " of " + str(len(launches)) ^0
"" ^0

# ---- the launches where the rule finds nothing ----

"launches where every metric was flat or down" ^0
0 => quiet
0 => idx2
for row in launches:
    idx2 + 1 => idx2
    if any_positive(row) == 0:
        quiet + 1 => quiet
        "  launch " + str(idx2) ^0
"  count : " + str(quiet) ^0
"" ^0

# ---- the control: the same rule where one metric really moved ----
#
# Consulting several metrics is not the defect. Reporting whichever one
# happened to be positive, without saying how many were looked at, is.

[[8, -3, -1, -4, -2], [7, -2, 4, -3, -1], [9, -1, -3, -2, 3]] => real
0 => real_first
for row in real:
    real_first + first_positive(row) => real_first
"control - a world where conversion really moved" ^0
"  pre-registered rule ships : " + str(real_first) + " of " + str(len(real)) ^0
if real_first == len(real):
    "  the single pre-registered metric catches it every time, with no help" ^0
"" ^0

"Each metric is real, each look is reasonable, and none of them is the one" ^0
"that was promised. The number of metrics consulted is the fact that decides" ^0
"what the rule means, and it is the fact that does not appear in the writeup." ^0
```

## Python (deterministic transpilation)

```python
launches = [[2, -3, -1, -4, -2], [-1, -2, 4, -3, -1], [-2, -1, -3, -2, 3], [1, -4, -2, -1, -3], [-3, 5, -1, -2, -4], [-2, -3, -4, 2, -1], [-1, -2, -3, -4, -5], [3, -1, -2, -5, -2]]
metric_names = ["conversion", "engagement", "retention", "revenue", "referrals"]

def any_positive(row):
    for v in row:
        if v > 0:
            return 1
    return 0

def first_positive(row):
    if row[0] > 0:
        return 1
    return 0

def which_positive(row):
    s = ""
    i = 0
    for v in row:
        if v > 0:
            if len(s) > 0:
                s = s + ", "
            s = s + metric_names[i]
        i = i + 1
    if len(s) == 0:
        return "none"
    return s

print("launches : " + str(len(launches)) + ", metrics each : " + str(len(metric_names)))
print("  true effect in this data : 0 on every metric")
print("")
print("launch   something to report")
idx = 0
for row in launches:
    idx = idx + 1
    print("  " + str(idx) + "      " + which_positive(row))
print("")
any_c = 0
first_c = 0
for row in launches:
    any_c = any_c + any_positive(row)
    first_c = first_c + first_positive(row)
print("how often each rule says ship")
print("  pre-registered, conversion only : " + str(first_c) + " of " + str(len(launches)))
print("  ship if any metric moved        : " + str(any_c) + " of " + str(len(launches)))
print("")
print("  in a world with no effect anywhere")
print("")

def any_of_first_k(row, k):
    i = 0
    for v in row:
        if i < k:
            if v > 0:
                return 1
        i = i + 1
    return 0

print("how the rule grows with each metric added")
for k in range(1, len(metric_names)+1):
    c = 0
    for row in launches:
        c = c + any_of_first_k(row, k)
    print("  first " + str(k) + " metric(s) : ships " + str(c) + " of " + str(len(launches)))
print("")
print("launches where every metric was flat or down")
quiet = 0
idx2 = 0
for row in launches:
    idx2 = idx2 + 1
    if any_positive(row) == 0:
        quiet = quiet + 1
        print("  launch " + str(idx2))
print("  count : " + str(quiet))
print("")
real = [[8, -3, -1, -4, -2], [7, -2, 4, -3, -1], [9, -1, -3, -2, 3]]
real_first = 0
for row in real:
    real_first = real_first + first_positive(row)
print("control - a world where conversion really moved")
print("  pre-registered rule ships : " + str(real_first) + " of " + str(len(real)))
if real_first == len(real):
    print("  the single pre-registered metric catches it every time, with no help")
print("")
print("Each metric is real, each look is reasonable, and none of them is the one")
print("that was promised. The number of metrics consulted is the fact that decides")
print("what the rule means, and it is the fact that does not appear in the writeup.")
```

## stdout (executed)

```text
launches : 8, metrics each : 5
  true effect in this data : 0 on every metric

launch   something to report
  1      conversion
  2      retention
  3      referrals
  4      conversion
  5      engagement
  6      revenue
  7      none
  8      conversion

how often each rule says ship
  pre-registered, conversion only : 3 of 8
  ship if any metric moved        : 7 of 8

  in a world with no effect anywhere

how the rule grows with each metric added
  first 1 metric(s) : ships 3 of 8
  first 2 metric(s) : ships 4 of 8
  first 3 metric(s) : ships 5 of 8
  first 4 metric(s) : ships 6 of 8
  first 5 metric(s) : ships 7 of 8

launches where every metric was flat or down
  launch 7
  count : 1

control - a world where conversion really moved
  pre-registered rule ships : 3 of 3
  the single pre-registered metric catches it every time, with no help

Each metric is real, each look is reasonable, and none of them is the one
that was promised. The number of metrics consulted is the fact that decides
what the rule means, and it is the fact that does not appear in the writeup.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
