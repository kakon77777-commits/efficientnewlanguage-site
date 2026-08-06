<!-- canonical: efficientnewlanguage.org/ai/examples/268-rounding-rule-drift | ai_layer_version: 0.1.0 | updated: 2026-08-06 -->

# Example 268 — Rounding rule drift — why banks use the rule that looks arbitrary

`rounding_rule_drift.eml` rounds every half from 0 to 20 under four tie-breaking rules and measures the drift each one introduces into the total.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Four rounding
# rules, one of which is why banks use the one that looks arbitrary.
#
# "Round to the nearest" is unambiguous except at exactly one half, and half is
# where every rule differs:
#
#     half-up      1.5 -> 2, 2.5 -> 3    the one taught in school
#     half-even    1.5 -> 2, 2.5 -> 2    ties go to the even neighbour
#     half-down    1.5 -> 1, 2.5 -> 2
#     truncate     1.5 -> 1, 2.5 -> 2    not rounding at all, but common
#
# On any single value the difference is at most one unit and looks like a
# detail. Over a column of values it is not a detail, because half-up moves
# EVERY tie in the same direction, so the error does not cancel - it
# accumulates linearly in the number of ties. Half-even sends half the ties up
# and half down, so it does cancel.
#
# Everything here is exact integer arithmetic on rationals n/d, so the
# measurement is of the RULES and not of floating point. Values are
# non-negative, which is the case where all four rules are at their most
# similar; negatives make truncate and half-down diverge further.

def floor_div(n, d):
    # n and d non-negative, so truncation is floor.
    return int(n / d)

def round_rule(n, d, rule):
    # Round n/d to an integer under `rule`.
    floor_div(n, d) => q
    n - q * d => r
    if 2 * r > d:
        return q + 1
    if 2 * r < d:
        return q
    # Exactly a tie.
    if rule == "half-up":
        return q + 1
    if rule == "half-down":
        return q
    if rule == "trunc":
        return q
    if q % 2 == 0:
        return q
    return q + 1

def is_tie(n, d):
    floor_div(n, d) => q
    n - q * d => r
    return 2 * r == d


["half-up", "half-even", "half-down", "trunc"] => RULES

# Every half from 0/2 to 40/2, which is 21 whole numbers and 20 ties.
2 => D
40 => TOP

"rule        sum of rounded   exact sum   drift   ties sent up"^0
0 => exact_n
0 => ties
for n in [0:TOP]:
    exact_n + n => exact_n
    if is_tie(n, D):
        ties + 1 => ties
exact_n / D => exact_sum

{} => res
for rule in RULES:
    0 => total
    0 => up
    for n in [0:TOP]:
        round_rule(n, D, rule) => v
        total + v => total
        if is_tie(n, D) and v * D > n:
            up + 1 => up
    total - exact_sum => drift
    [total, drift, up] => res[rule]
    ("%-11s %-16d %-11s %-7s %d" % (rule, total, str(exact_sum), str(drift), up))^0

""^0
("values rounded: " + str(TOP + 1) + " (every half from 0 to " + str(TOP / D) + ")")^0
("of which exact ties: " + str(ties))^0

# -------------------------------- the drift a tie-breaking rule must have
""^0
"a rule that sends every tie the same way must drift by half a unit per tie:"^0
ties / 2 => predicted
("  ties: " + str(ties) + ", so predicted drift for a one-directional rule: " + str(predicted))^0
for rule in RULES:
    res[rule] => r
    "" => note
    if r[1] == predicted:
        " = predicted" => note
    if r[1] == 0 - predicted:
        " = minus predicted" => note
    if r[1] == 0:
        " = no drift" => note
    ("  %-11s drift %s%s" % (rule, str(r[1]), note))^0

# ------------------------------------- sum of rounded vs round of sum
""^0
"summing then rounding is not rounding then summing:"^0
0 => disagree
for rule in RULES:
    round_rule(exact_n, D, rule) => round_of_sum
    res[rule] => r
    if not (r[0] == round_of_sum):
        disagree + 1 => disagree
    ("  %-11s sum of rounded %-6d round of sum %d" % (rule, r[0], round_of_sum))^0
("rules where the two orders disagree: " + str(disagree) + "/" + str(len(RULES)))^0

# --------------------------------- where the rules cannot be told apart
""^0
0 => non_tie_same
0 => non_tie_n
for n in [0:TOP]:
    if not is_tie(n, D):
        non_tie_n + 1 => non_tie_n
        round_rule(n, D, "half-up") => a
        1 => same
        for rule in RULES:
            if not (round_rule(n, D, rule) == a):
                0 => same
        if same == 1:
            non_tie_same + 1 => non_tie_same
("values that are NOT ties: " + str(non_tie_n) + ", on which all four rules agree: " + str(non_tie_same))^0
"...so a test whose fixtures avoid exact halves cannot distinguish the rules."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# All four rules must agree on every non-tie. If they differed anywhere else
# the comparison would not be about tie-breaking.
checked + 1 => checked
if non_tie_same == non_tie_n:
    passed + 1 => passed

# Half-up must drift by exactly half a unit per tie - the predicted value,
# computed from the tie count rather than written down.
checked + 1 => checked
if res["half-up"][1] == predicted:
    passed + 1 => passed

# Half-even must not drift at all over this range. That is the entire reason
# it exists, and it is a measurement rather than a claim.
checked + 1 => checked
if res["half-even"][1] == 0:
    passed + 1 => passed

# Half-up must send every tie up, and half-even exactly half of them.
checked + 1 => checked
if res["half-up"][2] == ties and res["half-even"][2] * 2 == ties:
    passed + 1 => passed

# And the two orders of summing and rounding must disagree for at least one
# rule, or 'sum of rounded' would be a safe substitution.
checked + 1 => checked
if disagree > 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Half-even looks arbitrary because its purpose only appears in a column." => verdict
else:
    "FAILED - a rounding rule did not behave as the checks describe." => verdict
verdict^0

""^0
"The rule that looks strange on one value is the one that is correct on a" => n1
n1^0
"thousand, because the question a rounding rule answers is not 'which way" => n2
n2^0
"does this go' but 'what happens to the total'. Any rule that resolves ties" => n3
n3^0
"in a fixed direction has a bias proportional to the number of ties, and a" => n4
n4^0
"test suite whose fixtures are not exact halves will never see it." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def floor_div(n, d):
    return int(n / d)

def round_rule(n, d, rule):
    q = floor_div(n, d)
    r = n - q * d
    if 2 * r > d:
        return q + 1
    if 2 * r < d:
        return q
    if rule == "half-up":
        return q + 1
    if rule == "half-down":
        return q
    if rule == "trunc":
        return q
    if q % 2 == 0:
        return q
    return q + 1

def is_tie(n, d):
    q = floor_div(n, d)
    r = n - q * d
    return 2 * r == d

RULES = ["half-up", "half-even", "half-down", "trunc"]
D = 2
TOP = 40
print("rule        sum of rounded   exact sum   drift   ties sent up")
exact_n = 0
ties = 0
for n in range(0, TOP+1):
    exact_n = exact_n + n
    if is_tie(n, D):
        ties = ties + 1
exact_sum = exact_n / D
res = {}
for rule in RULES:
    total = 0
    up = 0
    for n in range(0, TOP+1):
        v = round_rule(n, D, rule)
        total = total + v
        if is_tie(n, D) and v * D > n:
            up = up + 1
    drift = total - exact_sum
    res[rule] = [total, drift, up]
    print("%-11s %-16d %-11s %-7s %d" % (rule, total, str(exact_sum), str(drift), up))
print("")
print("values rounded: " + str(TOP + 1) + " (every half from 0 to " + str(TOP / D) + ")")
print("of which exact ties: " + str(ties))
print("")
print("a rule that sends every tie the same way must drift by half a unit per tie:")
predicted = ties / 2
print("  ties: " + str(ties) + ", so predicted drift for a one-directional rule: " + str(predicted))
for rule in RULES:
    r = res[rule]
    note = ""
    if r[1] == predicted:
        note = " = predicted"
    if r[1] == 0 - predicted:
        note = " = minus predicted"
    if r[1] == 0:
        note = " = no drift"
    print("  %-11s drift %s%s" % (rule, str(r[1]), note))
print("")
print("summing then rounding is not rounding then summing:")
disagree = 0
for rule in RULES:
    round_of_sum = round_rule(exact_n, D, rule)
    r = res[rule]
    if not r[0] == round_of_sum:
        disagree = disagree + 1
    print("  %-11s sum of rounded %-6d round of sum %d" % (rule, r[0], round_of_sum))
print("rules where the two orders disagree: " + str(disagree) + "/" + str(len(RULES)))
print("")
non_tie_same = 0
non_tie_n = 0
for n in range(0, TOP+1):
    if not is_tie(n, D):
        non_tie_n = non_tie_n + 1
        a = round_rule(n, D, "half-up")
        same = 1
        for rule in RULES:
            if not round_rule(n, D, rule) == a:
                same = 0
        if same == 1:
            non_tie_same = non_tie_same + 1
print("values that are NOT ties: " + str(non_tie_n) + ", on which all four rules agree: " + str(non_tie_same))
print("...so a test whose fixtures avoid exact halves cannot distinguish the rules.")
passed = 0
checked = 0
checked = checked + 1
if non_tie_same == non_tie_n:
    passed = passed + 1
checked = checked + 1
if res["half-up"][1] == predicted:
    passed = passed + 1
checked = checked + 1
if res["half-even"][1] == 0:
    passed = passed + 1
checked = checked + 1
if res["half-up"][2] == ties and res["half-even"][2] * 2 == ties:
    passed = passed + 1
checked = checked + 1
if disagree > 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Half-even looks arbitrary because its purpose only appears in a column."
else:
    verdict = "FAILED - a rounding rule did not behave as the checks describe."
print(verdict)
print("")
n1 = "The rule that looks strange on one value is the one that is correct on a"
print(n1)
n2 = "thousand, because the question a rounding rule answers is not 'which way"
print(n2)
n3 = "does this go' but 'what happens to the total'. Any rule that resolves ties"
print(n3)
n4 = "in a fixed direction has a bias proportional to the number of ties, and a"
print(n4)
n5 = "test suite whose fixtures are not exact halves will never see it."
print(n5)
```

## stdout (executed)

```text
rule        sum of rounded   exact sum   drift   ties sent up
half-up     420              410.0       10.0    20
half-even   410              410.0       0.0     10
half-down   400              410.0       -10.0   0
trunc       400              410.0       -10.0   0

values rounded: 41 (every half from 0 to 20.0)
of which exact ties: 20

a rule that sends every tie the same way must drift by half a unit per tie:
  ties: 20, so predicted drift for a one-directional rule: 10.0
  half-up     drift 10.0 = predicted
  half-even   drift 0.0 = no drift
  half-down   drift -10.0 = minus predicted
  trunc       drift -10.0 = minus predicted

summing then rounding is not rounding then summing:
  half-up     sum of rounded 420    round of sum 410
  half-even   sum of rounded 410    round of sum 410
  half-down   sum of rounded 400    round of sum 410
  trunc       sum of rounded 400    round of sum 410
rules where the two orders disagree: 3/4

values that are NOT ties: 21, on which all four rules agree: 21
...so a test whose fixtures avoid exact halves cannot distinguish the rules.

checks passed: 5/5
Half-even looks arbitrary because its purpose only appears in a column.

The rule that looks strange on one value is the one that is correct on a
thousand, because the question a rounding rule answers is not 'which way
does this go' but 'what happens to the total'. Any rule that resolves ties
in a fixed direction has a bias proportional to the number of ties, and a
test suite whose fixtures are not exact halves will never see it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
