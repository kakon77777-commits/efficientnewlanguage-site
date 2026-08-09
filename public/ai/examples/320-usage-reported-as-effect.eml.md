<!-- canonical: efficientnewlanguage.org/ai/examples/320-usage-reported-as-effect | ai_layer_version: 0.1.0 | updated: 2026-08-09 -->

# Example 320 — Usage reported as effect — the metric was largest where the effect was zero

`usage_reported_as_effect.eml` carries a hidden per-user field saying what each user would have done *without* the feature, computes the reported metric and the true lift side by side, and sweeps the rollout to show which of the two moves.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The feature
# reports how often it was used, and the number is read as how much it helped.
#
# "Conversions assisted by the recommender", "revenue through the new flow",
# "tickets resolved by the assistant" - all of them count events that PASSED
# THROUGH the thing. That is the only quantity the thing can observe: it sees
# its own invocations and their outcomes, and it cannot see what would have
# happened without it.
#
# The number is not wrong. It is an honest count of a real set. What it does
# not carry is a counterfactual, and every sentence built on it - "the
# recommender drove 40% of conversions" - is a counterfactual claim.
#
# The trap has a shape: features are used most by the people most likely to
# convert anyway, because those are the engaged users. So the metric is
# largest exactly where the effect is smallest, and it rises when the feature
# is shown to MORE people regardless of whether it changes any decision.
#
# The measurement carries a hidden per-user field saying what that user would
# have done WITHOUT the feature, computes the reported metric and the true
# lift side by side, and then re-runs after widening exposure to show which of
# the two moves.

def exposed(user, rollout):
    # rollout is the share (out of 10) of users shown the feature, applied to
    # the user's bucket. Engaged users are bucketed low, so a partial rollout
    # reaches them first - which is what a real gradual rollout does.
    return user[1] < rollout

def converts(user, rollout):
    # baseline: would they convert without the feature. lift: does the feature
    # change THIS user's decision.
    if exposed(user, rollout) == 1:
        if user[3] == 1:
            return 1
        return user[2]
    return user[2]

def report(rollout):
    # What the feature can observe: conversions among users it was shown to.
    0 => assisted
    0 => total_conversions
    for u in USERS:
        converts(u, rollout) => c
        total_conversions + c => total_conversions
        if exposed(u, rollout) == 1:
            assisted + c => assisted
    return [assisted, total_conversions]

def truth(rollout):
    # What actually changed: conversions with the feature minus conversions in
    # the same population without it.
    0 => with_f
    0 => without_f
    for u in USERS:
        with_f + converts(u, rollout) => with_f
        without_f + u[2] => without_f
    return with_f - without_f

# id, bucket 0-9, baseline conversion, feature flips this user
[["u0", 0, 1, 0], ["u1", 1, 1, 0], ["u2", 2, 1, 0], ["u3", 3, 1, 0],
 ["u4", 4, 0, 1], ["u5", 5, 0, 0], ["u6", 6, 0, 0], ["u7", 7, 0, 1],
 ["u8", 8, 0, 0], ["u9", 9, 0, 0]] => USERS

"rollout  exposed  assisted conversions  total conversions  share reported  true lift"^0
"-------  -------  --------------------  -----------------  --------------  ---------"^0

{} => rows
for rollout in [2, 4, 6, 8, 10]:
    0 => n_exposed
    for u in USERS:
        if exposed(u, rollout) == 1:
            n_exposed + 1 => n_exposed
    report(rollout) => r
    truth(rollout) => lift
    [r[0], r[1], lift, n_exposed] => rows[str(rollout)]
    0 => share
    if r[1] > 0:
        int(r[0] * 1000 / r[1]) / 10 => share
    ((str(rollout) + "        ")[0:9] + (str(n_exposed) + "         ")[0:9] + (str(r[0]) + "                      ")[0:22] + (str(r[1]) + "                   ")[0:19] + (str(share) + "%               ")[0:16] + str(lift))^0

""^0
("users: " + str(len(USERS)))^0

""^0
"what moves when exposure widens"^0
rows["2"] => a
rows["10"] => b
("assisted conversions: " + str(a[0]) + " -> " + str(b[0]))^0
("true lift:            " + str(a[2]) + " -> " + str(b[2]))^0

""^0
"who the feature reaches first"^0
0 => early_baseline
0 => early_flipped
for u in USERS:
    if u[1] < 4:
        early_baseline + u[2] => early_baseline
        early_flipped + u[3] => early_flipped
("of the first 4 users reached: " + str(early_baseline) + " would have converted anyway, " + str(early_flipped) + " are changed by the feature")^0
0 => late_baseline
0 => late_flipped
for u in USERS:
    if u[1] >= 4:
        late_baseline + u[2] => late_baseline
        late_flipped + u[3] => late_flipped
("of the last 6 users reached:  " + str(late_baseline) + " would have converted anyway, " + str(late_flipped) + " are changed by the feature")^0

""^0
"the sentence the metric is used to support"^0
rows["4"] => r4
0 => share4
if r4[1] > 0:
    int(r4[0] * 1000 / r4[1]) / 10 => share4
("at 40% rollout: 'the feature drove " + str(share4) + "% of conversions'")^0
("               true conversions caused: " + str(r4[2]) + " of " + str(r4[1]))^0

""^0
0 => checked
0 => passed

# The reported share must be much larger than the true contribution at some
# rollout - that gap is the whole case.
checked + 1 => checked
0 => inflated
for rollout in [2, 4, 6, 8, 10]:
    rows[str(rollout)] => r
    if r[0] > r[2]:
        inflated + 1 => inflated
if inflated == 5:
    passed + 1 => passed

# Assisted conversions must rise as exposure widens.
checked + 1 => checked
0 => rises
0 => prev
for rollout in [2, 4, 6, 8, 10]:
    rows[str(rollout)] => r
    if r[0] >= prev:
        rises + 1 => rises
    r[0] => prev
if rises == 5:
    passed + 1 => passed

# The true lift must be zero at the earliest rollout - the feature reaches the
# people it cannot help first, and the metric is already non-zero there.
checked + 1 => checked
if rows["2"][2] == 0:
    if rows["2"][0] > 0:
        passed + 1 => passed

# The feature must genuinely help somebody, or the case would be about a
# useless feature rather than about the wrong metric.
checked + 1 => checked
if rows["10"][2] > 0:
    passed + 1 => passed

# The reported metric must never DECREASE while the true lift is flat - a
# metric that only goes up is a metric that cannot report a disappointment.
checked + 1 => checked
0 => reported_fell
0 => prev_rep
for rollout in [2, 4, 6, 8, 10]:
    rows[str(rollout)] => r
    if r[0] < prev_rep:
        reported_fell + 1 => reported_fell
    r[0] => prev_rep
if reported_fell == 0:
    passed + 1 => passed

# The early users must be the ones who would have converted anyway - that is
# why the metric starts high, and it is a property of how rollouts are
# ordered rather than of the feature.
checked + 1 => checked
if early_baseline > late_baseline:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The metric was largest where the effect was zero." => verdict
else:
    "FAILED - the rollout did not behave as the checks describe." => verdict
verdict^0

""^0
"A feature can observe its own invocations and their outcomes. It cannot"^0
"observe the world in which it was not invoked, so the counterfactual has to"^0
"come from somewhere else - a holdout, a staged rollout compared against"^0
"itself, anything at all. Without one, the number that gets reported is"^0
"USAGE, and usage is maximised by showing the feature to people who did not"^0
"need it."^0
```

## Python (deterministic transpilation)

```python
def exposed(user, rollout):
    return user[1] < rollout

def converts(user, rollout):
    if exposed(user, rollout) == 1:
        if user[3] == 1:
            return 1
        return user[2]
    return user[2]

def report(rollout):
    assisted = 0
    total_conversions = 0
    for u in USERS:
        c = converts(u, rollout)
        total_conversions = total_conversions + c
        if exposed(u, rollout) == 1:
            assisted = assisted + c
    return [assisted, total_conversions]

def truth(rollout):
    with_f = 0
    without_f = 0
    for u in USERS:
        with_f = with_f + converts(u, rollout)
        without_f = without_f + u[2]
    return with_f - without_f

USERS = [["u0", 0, 1, 0], ["u1", 1, 1, 0], ["u2", 2, 1, 0], ["u3", 3, 1, 0], ["u4", 4, 0, 1], ["u5", 5, 0, 0], ["u6", 6, 0, 0], ["u7", 7, 0, 1], ["u8", 8, 0, 0], ["u9", 9, 0, 0]]
print("rollout  exposed  assisted conversions  total conversions  share reported  true lift")
print("-------  -------  --------------------  -----------------  --------------  ---------")
rows = {}
for rollout in [2, 4, 6, 8, 10]:
    n_exposed = 0
    for u in USERS:
        if exposed(u, rollout) == 1:
            n_exposed = n_exposed + 1
    r = report(rollout)
    lift = truth(rollout)
    rows[str(rollout)] = [r[0], r[1], lift, n_exposed]
    share = 0
    if r[1] > 0:
        share = int(r[0] * 1000 / r[1]) / 10
    print((str(rollout) + "        ")[0:9] + (str(n_exposed) + "         ")[0:9] + (str(r[0]) + "                      ")[0:22] + (str(r[1]) + "                   ")[0:19] + (str(share) + "%               ")[0:16] + str(lift))
print("")
print("users: " + str(len(USERS)))
print("")
print("what moves when exposure widens")
a = rows["2"]
b = rows["10"]
print("assisted conversions: " + str(a[0]) + " -> " + str(b[0]))
print("true lift:            " + str(a[2]) + " -> " + str(b[2]))
print("")
print("who the feature reaches first")
early_baseline = 0
early_flipped = 0
for u in USERS:
    if u[1] < 4:
        early_baseline = early_baseline + u[2]
        early_flipped = early_flipped + u[3]
print("of the first 4 users reached: " + str(early_baseline) + " would have converted anyway, " + str(early_flipped) + " are changed by the feature")
late_baseline = 0
late_flipped = 0
for u in USERS:
    if u[1] >= 4:
        late_baseline = late_baseline + u[2]
        late_flipped = late_flipped + u[3]
print("of the last 6 users reached:  " + str(late_baseline) + " would have converted anyway, " + str(late_flipped) + " are changed by the feature")
print("")
print("the sentence the metric is used to support")
r4 = rows["4"]
share4 = 0
if r4[1] > 0:
    share4 = int(r4[0] * 1000 / r4[1]) / 10
print("at 40% rollout: 'the feature drove " + str(share4) + "% of conversions'")
print("               true conversions caused: " + str(r4[2]) + " of " + str(r4[1]))
print("")
checked = 0
passed = 0
checked = checked + 1
inflated = 0
for rollout in [2, 4, 6, 8, 10]:
    r = rows[str(rollout)]
    if r[0] > r[2]:
        inflated = inflated + 1
if inflated == 5:
    passed = passed + 1
checked = checked + 1
rises = 0
prev = 0
for rollout in [2, 4, 6, 8, 10]:
    r = rows[str(rollout)]
    if r[0] >= prev:
        rises = rises + 1
    prev = r[0]
if rises == 5:
    passed = passed + 1
checked = checked + 1
if rows["2"][2] == 0:
    if rows["2"][0] > 0:
        passed = passed + 1
checked = checked + 1
if rows["10"][2] > 0:
    passed = passed + 1
checked = checked + 1
reported_fell = 0
prev_rep = 0
for rollout in [2, 4, 6, 8, 10]:
    r = rows[str(rollout)]
    if r[0] < prev_rep:
        reported_fell = reported_fell + 1
    prev_rep = r[0]
if reported_fell == 0:
    passed = passed + 1
checked = checked + 1
if early_baseline > late_baseline:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The metric was largest where the effect was zero."
else:
    verdict = "FAILED - the rollout did not behave as the checks describe."
print(verdict)
print("")
print("A feature can observe its own invocations and their outcomes. It cannot")
print("observe the world in which it was not invoked, so the counterfactual has to")
print("come from somewhere else - a holdout, a staged rollout compared against")
print("itself, anything at all. Without one, the number that gets reported is")
print("USAGE, and usage is maximised by showing the feature to people who did not")
print("need it.")
```

## stdout (executed)

```text
rollout  exposed  assisted conversions  total conversions  share reported  true lift
-------  -------  --------------------  -----------------  --------------  ---------
2        2        2                     4                  50.0%           0
4        4        4                     4                  100.0%          0
6        6        5                     5                  100.0%          1
8        8        6                     6                  100.0%          2
10       10       6                     6                  100.0%          2

users: 10

what moves when exposure widens
assisted conversions: 2 -> 6
true lift:            0 -> 2

who the feature reaches first
of the first 4 users reached: 4 would have converted anyway, 0 are changed by the feature
of the last 6 users reached:  0 would have converted anyway, 2 are changed by the feature

the sentence the metric is used to support
at 40% rollout: 'the feature drove 100.0% of conversions'
               true conversions caused: 0 of 4

checks passed: 6/6
The metric was largest where the effect was zero.

A feature can observe its own invocations and their outcomes. It cannot
observe the world in which it was not invoked, so the counterfactual has to
come from somewhere else - a holdout, a staged rollout compared against
itself, anything at all. Without one, the number that gets reported is
USAGE, and usage is maximised by showing the feature to people who did not
need it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
