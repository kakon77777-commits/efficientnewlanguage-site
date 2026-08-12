<!-- canonical: efficientnewlanguage.org/ai/examples/346-the-more-precise-answer-wins | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 346 — The more precise answer wins — precision is printed, accuracy is not

`the_more_precise_answer_wins.eml` puts a four-decimal estimate and a whole-number estimate against a computed truth.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two estimates of
# the same quantity, and the tie-breaker nobody says out loud.
#
# One reports four decimal places. The other reports a whole number. When they
# disagree the four-decimal one is believed, and the reason given is never
# "it is more accurate" - it is "it is more precise", or more often just the
# way the two numbers look side by side.
#
# Precision is visible in the output. Accuracy is only visible against a truth
# that the output does not contain. So the reviewer is reading the one property
# that is legible and treating it as the one that matters.
#
# All arithmetic is in ten-thousandths of a unit, so the "decimals" are integers
# and nothing here depends on floating point. Truncation in the conversion is at
# most 1 ten-thousandth, which is far below every difference reported.
#
# Nothing is declared: both estimators run, the truth is computed from all the
# readings, and the errors are compared.

def mean_scaled(xs):
    if len(xs) == 0:
        return 0
    0 => total
    for x in xs:
        total + x => total
    return int(total * 10000 / len(xs))

# reports four decimals, and discards a warm-up reading
def estimator_precise(readings):
    [] => used
    0 => i
    for r in readings:
        if i > 0:
            used + [r] => used
        i + 1 => i
    return mean_scaled(used)

# reports whole units, uses every reading
def estimator_coarse(readings):
    mean_scaled(readings) => m
    return int((m + 5000) / 10000) * 10000

def truth(readings):
    return mean_scaled(readings)

def gap(a, b):
    if a > b:
        return a - b
    return b - a

[[20, 14, 15, 16, 14], [8, 30, 31, 29, 30], [50, 41, 40, 39, 41], [12, 12, 12, 12, 13], [3, 22, 21, 23, 22], [60, 55, 56, 54, 53]] => sets

# ---- the two estimates, and the truth ----

"set        precise      coarse       truth" ^0
0 => coarse_closer
0 => precise_closer
0 => equal_error
for s in sets:
    estimator_precise(s) => p
    estimator_coarse(s) => c
    truth(s) => t
    gap(p, t) => pe
    gap(c, t) => ce
    if ce < pe:
        coarse_closer + 1 => coarse_closer
    if pe < ce:
        precise_closer + 1 => precise_closer
    if pe == ce:
        equal_error + 1 => equal_error
    "  " + repr(s) + " : " + str(p) + "  " + str(c) + "  " + str(t) ^0
"" ^0
"  (all values in ten-thousandths of a unit)" ^0
"" ^0

"which estimate is closer to the truth" ^0
"  the four-decimal one : " + str(precise_closer) + " of " + str(len(sets)) ^0
"  the whole-number one : " + str(coarse_closer) + " of " + str(len(sets)) ^0
"  tied                 : " + str(equal_error) ^0
"" ^0

# ---- the size of the error each one makes ----

0 => worst_p
0 => worst_c
0 => total_p
0 => total_c
for s in sets:
    gap(estimator_precise(s), truth(s)) => pe
    gap(estimator_coarse(s), truth(s)) => ce
    total_p + pe => total_p
    total_c + ce => total_c
    if pe > worst_p:
        pe => worst_p
    if ce > worst_c:
        ce => worst_c
"error, in ten-thousandths" ^0
"  four-decimal : total " + str(total_p) + ", worst " + str(worst_p) ^0
"  whole-number : total " + str(total_c) + ", worst " + str(worst_c) ^0
"" ^0

# ---- resolution, which is a real property and still not accuracy ----
#
# Readings are whole units, so the smallest change the world can present is
# one unit in one reading. Bump the SECOND reading - one that both estimators
# use - and see how far each reported value moves. That step size is the
# estimator's resolution: no variation finer than it carries any information.

"movement under a one-unit change in a reading both estimators use" ^0
0 => si
0 => finest_p
0 => finest_c
for s in sets:
    [] => bumped
    0 => i
    for r in s:
        if i == 1:
            bumped + [r + 1] => bumped
        else:
            bumped + [r] => bumped
        i + 1 => i
    gap(estimator_precise(s), estimator_precise(bumped)) => dp
    gap(estimator_coarse(s), estimator_coarse(bumped)) => dc
    if dp > 0:
        if finest_p == 0:
            dp => finest_p
        else:
            if dp < finest_p:
                dp => finest_p
    if dc > 0:
        if finest_c == 0:
            dc => finest_c
        else:
            if dc < finest_c:
                dc => finest_c
    "  set " + str(si) + " : four-decimal moves " + str(dp) + ", whole-number moves " + str(dc) ^0
    si + 1 => si
0 => moved_p
0 => moved_c
for s in sets:
    [] => bumped
    0 => i
    for r in s:
        if i == 1:
            bumped + [r + 1] => bumped
        else:
            bumped + [r] => bumped
        i + 1 => i
    if estimator_precise(s) != estimator_precise(bumped):
        moved_p + 1 => moved_p
    if estimator_coarse(s) != estimator_coarse(bumped):
        moved_c + 1 => moved_c
"  bumps the four-decimal estimate registered : " + str(moved_p) + " of " + str(len(sets)) ^0
"  bumps the whole-number estimate registered : " + str(moved_c) + " of " + str(len(sets)) ^0
if finest_p > 0:
    "  its smallest non-zero move : " + str(finest_p) ^0
if moved_c == 0:
    "  the whole-number estimate did not move at all - rounding absorbed every bump" ^0
"" ^0
"So the extra resolution is REAL: the four-decimal estimate registers changes" ^0
"the whole-number one cannot see. It is also worse, by " + str(worst_p) + " against " + str(worst_c) + "" ^0
"at the worst set, which is more than " + str(finest_p) + " - the estimate resolves finely" ^0
"and points somewhere else." ^0
"" ^0

# ---- and the discarded reading is the whole difference ----

"the effect of discarding the first reading" ^0
0 => changed
0 => biggest
for s in sets:
    mean_scaled(s) => with_all
    estimator_precise(s) => without_first
    gap(with_all, without_first) => d
    if d > 0:
        changed + 1 => changed
    if d > biggest:
        d => biggest
"  sets where discarding it moves the answer : " + str(changed) + " of " + str(len(sets)) ^0
"  largest move                              : " + str(biggest) ^0
"" ^0

"Precision and accuracy are both real properties and only one of them is" ^0
"printed. The reviewer comparing two numbers side by side is reading the" ^0
"one that is on the page." ^0
```

## Python (deterministic transpilation)

```python
def mean_scaled(xs):
    if len(xs) == 0:
        return 0
    total = 0
    for x in xs:
        total = total + x
    return int(total * 10000 / len(xs))

def estimator_precise(readings):
    used = []
    i = 0
    for r in readings:
        if i > 0:
            used = used + [r]
        i = i + 1
    return mean_scaled(used)

def estimator_coarse(readings):
    m = mean_scaled(readings)
    return int((m + 5000) / 10000) * 10000

def truth(readings):
    return mean_scaled(readings)

def gap(a, b):
    if a > b:
        return a - b
    return b - a

sets = [[20, 14, 15, 16, 14], [8, 30, 31, 29, 30], [50, 41, 40, 39, 41], [12, 12, 12, 12, 13], [3, 22, 21, 23, 22], [60, 55, 56, 54, 53]]
print("set        precise      coarse       truth")
coarse_closer = 0
precise_closer = 0
equal_error = 0
for s in sets:
    p = estimator_precise(s)
    c = estimator_coarse(s)
    t = truth(s)
    pe = gap(p, t)
    ce = gap(c, t)
    if ce < pe:
        coarse_closer = coarse_closer + 1
    if pe < ce:
        precise_closer = precise_closer + 1
    if pe == ce:
        equal_error = equal_error + 1
    print("  " + repr(s) + " : " + str(p) + "  " + str(c) + "  " + str(t))
print("")
print("  (all values in ten-thousandths of a unit)")
print("")
print("which estimate is closer to the truth")
print("  the four-decimal one : " + str(precise_closer) + " of " + str(len(sets)))
print("  the whole-number one : " + str(coarse_closer) + " of " + str(len(sets)))
print("  tied                 : " + str(equal_error))
print("")
worst_p = 0
worst_c = 0
total_p = 0
total_c = 0
for s in sets:
    pe = gap(estimator_precise(s), truth(s))
    ce = gap(estimator_coarse(s), truth(s))
    total_p = total_p + pe
    total_c = total_c + ce
    if pe > worst_p:
        worst_p = pe
    if ce > worst_c:
        worst_c = ce
print("error, in ten-thousandths")
print("  four-decimal : total " + str(total_p) + ", worst " + str(worst_p))
print("  whole-number : total " + str(total_c) + ", worst " + str(worst_c))
print("")
print("movement under a one-unit change in a reading both estimators use")
si = 0
finest_p = 0
finest_c = 0
for s in sets:
    bumped = []
    i = 0
    for r in s:
        if i == 1:
            bumped = bumped + [r + 1]
        else:
            bumped = bumped + [r]
        i = i + 1
    dp = gap(estimator_precise(s), estimator_precise(bumped))
    dc = gap(estimator_coarse(s), estimator_coarse(bumped))
    if dp > 0:
        if finest_p == 0:
            finest_p = dp
        elif dp < finest_p:
            finest_p = dp
    if dc > 0:
        if finest_c == 0:
            finest_c = dc
        elif dc < finest_c:
            finest_c = dc
    print("  set " + str(si) + " : four-decimal moves " + str(dp) + ", whole-number moves " + str(dc))
    si = si + 1
moved_p = 0
moved_c = 0
for s in sets:
    bumped = []
    i = 0
    for r in s:
        if i == 1:
            bumped = bumped + [r + 1]
        else:
            bumped = bumped + [r]
        i = i + 1
    if estimator_precise(s) != estimator_precise(bumped):
        moved_p = moved_p + 1
    if estimator_coarse(s) != estimator_coarse(bumped):
        moved_c = moved_c + 1
print("  bumps the four-decimal estimate registered : " + str(moved_p) + " of " + str(len(sets)))
print("  bumps the whole-number estimate registered : " + str(moved_c) + " of " + str(len(sets)))
if finest_p > 0:
    print("  its smallest non-zero move : " + str(finest_p))
if moved_c == 0:
    print("  the whole-number estimate did not move at all - rounding absorbed every bump")
print("")
print("So the extra resolution is REAL: the four-decimal estimate registers changes")
print("the whole-number one cannot see. It is also worse, by " + str(worst_p) + " against " + str(worst_c) + "")
print("at the worst set, which is more than " + str(finest_p) + " - the estimate resolves finely")
print("and points somewhere else.")
print("")
print("the effect of discarding the first reading")
changed = 0
biggest = 0
for s in sets:
    with_all = mean_scaled(s)
    without_first = estimator_precise(s)
    d = gap(with_all, without_first)
    if d > 0:
        changed = changed + 1
    if d > biggest:
        biggest = d
print("  sets where discarding it moves the answer : " + str(changed) + " of " + str(len(sets)))
print("  largest move                              : " + str(biggest))
print("")
print("Precision and accuracy are both real properties and only one of them is")
print("printed. The reviewer comparing two numbers side by side is reading the")
print("one that is on the page.")
```

## stdout (executed)

```text
set        precise      coarse       truth
  [20, 14, 15, 16, 14] : 147500  160000  158000
  [8, 30, 31, 29, 30] : 300000  260000  256000
  [50, 41, 40, 39, 41] : 402500  420000  422000
  [12, 12, 12, 12, 13] : 122500  120000  122000
  [3, 22, 21, 23, 22] : 220000  180000  182000
  [60, 55, 56, 54, 53] : 545000  560000  556000

  (all values in ten-thousandths of a unit)

which estimate is closer to the truth
  the four-decimal one : 1 of 6
  the whole-number one : 5 of 6
  tied                 : 0

error, in ten-thousandths
  four-decimal : total 123500, worst 44000
  whole-number : total 16000, worst 4000

movement under a one-unit change in a reading both estimators use
  set 0 : four-decimal moves 2500, whole-number moves 0
  set 1 : four-decimal moves 2500, whole-number moves 0
  set 2 : four-decimal moves 2500, whole-number moves 0
  set 3 : four-decimal moves 2500, whole-number moves 0
  set 4 : four-decimal moves 2500, whole-number moves 0
  set 5 : four-decimal moves 2500, whole-number moves 0
  bumps the four-decimal estimate registered : 6 of 6
  bumps the whole-number estimate registered : 0 of 6
  its smallest non-zero move : 2500
  the whole-number estimate did not move at all - rounding absorbed every bump

So the extra resolution is REAL: the four-decimal estimate registers changes
the whole-number one cannot see. It is also worse, by 44000 against 4000
at the worst set, which is more than 2500 - the estimate resolves finely
and points somewhere else.

the effect of discarding the first reading
  sets where discarding it moves the answer : 6 of 6
  largest move                              : 44000

Precision and accuracy are both real properties and only one of them is
printed. The reviewer comparing two numbers side by side is reading the
one that is on the page.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
