<!-- canonical: efficientnewlanguage.org/ai/examples/424-the-error-metric-has-no-sign | ai_layer_version: 0.1.0 | updated: 2026-08-17 -->

# Example 424 — The error metric has no sign

`the_error_metric_has_no_sign.eml` - Two forecasting models are scored by absolute error. The score ranks them equal. They are not the same model.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two forecasting
# models are scored by absolute error. The score ranks them equal. They are not
# the same model.
#
# Absolute error is the right default. It refuses to let a miss of +5 cancel a
# miss of -5, which is exactly what a plain average of errors would do, and
# cancellation is the worse failure - it reports a model as perfect when every
# single prediction was wrong.
#
# `abs()` buys that by throwing away the sign, and the sign is the part that
# says which way the model is wrong. A model that is always high and a model
# that is high and low by turns score identically, and only one of them can be
# corrected by subtracting a constant.
#
# Both scores are computed from the same predictions.

[40, 55, 60, 45, 70, 50] => actual
[43, 52, 62, 43, 74, 46] => model_a
[43, 58, 62, 47, 74, 54] => model_b
[46, 55, 60, 45, 70, 44] => model_c

len(actual) => n

def abs_error(f):
    0 => t
    for i in [0:n - 1]:
        t + abs(f[i] - actual[i]) => t
    return t

def signed_error(f):
    0 => t
    for i in [0:n - 1]:
        t + f[i] - actual[i] => t
    return t

def worst_miss(f):
    0 => w
    for i in [0:n - 1]:
        if abs(f[i] - actual[i]) > w:
            abs(f[i] - actual[i]) => w
    return w

"periods : " + str(n) ^0
"" ^0
"model   total |error|   total error   worst miss" ^0
"  A       " + str(abs_error(model_a)) + "           " + str(signed_error(model_a)) + "            " + str(worst_miss(model_a)) ^0
"  B       " + str(abs_error(model_b)) + "           " + str(signed_error(model_b)) + "           " + str(worst_miss(model_b)) ^0
"  C       " + str(abs_error(model_c)) + "           " + str(signed_error(model_c)) + "            " + str(worst_miss(model_c)) ^0
"" ^0

if abs_error(model_a) == abs_error(model_b):
    "A and B score identically on absolute error : " + str(abs_error(model_a)) ^0
else:
    "A and B differ on absolute error : " + str(abs_error(model_a)) + " and " + str(abs_error(model_b)) ^0
if not (signed_error(model_a) == signed_error(model_b)):
    "and differ on signed error by " + str(abs(signed_error(model_b) - signed_error(model_a))) ^0
"" ^0

# ---- what the sign was carrying ----
#
# A model with a constant offset can be fixed by subtracting the offset. The
# absolute score cannot say whether there is one, because it removed the
# direction before averaging.

def errors_all_one_way(f):
    0 => high
    0 => low
    for i in [0:n - 1]:
        if f[i] > actual[i]:
            high + 1 => high
        if f[i] < actual[i]:
            low + 1 => low
    if low == 0:
        return 1
    if high == 0:
        return 1
    return 0

0 => a_high
0 => a_low
for i in [0:n - 1]:
    if model_a[i] > actual[i]:
        a_high + 1 => a_high
    if model_a[i] < actual[i]:
        a_low + 1 => a_low
0 => b_high
0 => b_low
for i in [0:n - 1]:
    if model_b[i] > actual[i]:
        b_high + 1 => b_high
    if model_b[i] < actual[i]:
        b_low + 1 => b_low
"direction of the misses" ^0
"  A : " + str(a_high) + " high, " + str(a_low) + " low" ^0
"  B : " + str(b_high) + " high, " + str(b_low) + " low" ^0
if errors_all_one_way(model_b) == 1:
    if errors_all_one_way(model_a) == 0:
        "  B misses in one direction only, so a constant correction applies to it" ^0
"" ^0

# ---- correcting the biased model ----
#
# Subtracting the mean signed error from every prediction is a one-line change
# that the absolute score gave no reason to try.

int(signed_error(model_b) / n) => offset
[] => model_b_fixed
for i in [0:n - 1]:
    model_b_fixed + [model_b[i] - offset] => model_b_fixed
"correcting B by its mean signed error of " + str(offset) ^0
"  B before : " + str(abs_error(model_b)) ^0
"  B after  : " + str(abs_error(model_b_fixed)) ^0
if abs_error(model_b_fixed) < abs_error(model_b):
    "  improved by " + str(abs_error(model_b) - abs_error(model_b_fixed)) + " with no new information" ^0

int(signed_error(model_a) / n) => a_offset
[] => model_a_fixed
for i in [0:n - 1]:
    model_a_fixed + [model_a[i] - a_offset] => model_a_fixed
"the same correction applied to A, whose offset is " + str(a_offset) ^0
"  A before : " + str(abs_error(model_a)) ^0
"  A after  : " + str(abs_error(model_a_fixed)) ^0
if abs_error(model_a_fixed) == abs_error(model_a):
    "  unchanged, because there was no constant offset to remove" ^0
"" ^0

# ---- where the direction is the whole cost ----
#
# Over-forecasting stocks a warehouse. Under-forecasting turns a customer away.
# The two are not the same price, and a metric with no sign cannot tell them
# apart at any exchange rate.

2 => cost_over
5 => cost_under

def money(f):
    0 => c
    for i in [0:n - 1]:
        if f[i] > actual[i]:
            c + (f[i] - actual[i]) * cost_over => c
        else:
            c + (actual[i] - f[i]) * cost_under => c
    return c

"cost at " + str(cost_over) + " per unit over and " + str(cost_under) + " per unit short" ^0
"  A : " + str(money(model_a)) ^0
"  B : " + str(money(model_b)) ^0
"  C : " + str(money(model_c)) ^0
if not (money(model_a) == money(model_b)):
    "  A and B scored equal on absolute error and differ here by " + str(abs(money(model_a) - money(model_b))) ^0
if money(model_b) < money(model_a):
    "  the biased model is the cheaper one, because it is biased in the" ^0
    "  direction that costs " + str(cost_over) + " rather than " + str(cost_under) ^0
else:
    "  the unbiased model is the cheaper one" ^0
"" ^0

# ---- and where absolute error is the metric that is right ----
#
# C has the lowest absolute total and the largest single miss. Which of those
# matters is a property of the thing being forecast, not of the metric.

"C against A" ^0
"  absolute total : " + str(abs_error(model_c)) + " versus " + str(abs_error(model_a)) ^0
"  worst miss     : " + str(worst_miss(model_c)) + " versus " + str(worst_miss(model_a)) ^0
if abs_error(model_c) < abs_error(model_a):
    if worst_miss(model_c) > worst_miss(model_a):
        "  C is better on the total and worse on the worst case, and both are true" ^0
"" ^0

# ---- the control: models the two metrics rank the same ----
#
# Where one model is better in both direction and magnitude, the choice of
# metric decides nothing, and an evaluation on this pair proves nothing about
# the metric.

[41, 54, 61, 46, 69, 51] => tight
"control - a model that is closer on every period" ^0
"  |error| : " + str(abs_error(tight)) + " versus A's " + str(abs_error(model_a)) ^0
"  cost    : " + str(money(tight)) + " versus A's " + str(money(model_a)) ^0
if abs_error(tight) < abs_error(model_a):
    if money(tight) < money(model_a):
        "  both metrics agree, so this comparison cannot tell them apart" ^0
"" ^0

"Absolute error is the right default and the cancellation it prevents is a" ^0
"real failure. The sign it discards is the part that says whether the model" ^0
"can be corrected, and what being wrong costs." ^0
```

## Python (deterministic transpilation)

```python
actual = [40, 55, 60, 45, 70, 50]
model_a = [43, 52, 62, 43, 74, 46]
model_b = [43, 58, 62, 47, 74, 54]
model_c = [46, 55, 60, 45, 70, 44]
n = len(actual)

def abs_error(f):
    t = 0
    for i in range(0, n):
        t = t + abs(f[i] - actual[i])
    return t

def signed_error(f):
    t = 0
    for i in range(0, n):
        t = t + f[i] - actual[i]
    return t

def worst_miss(f):
    w = 0
    for i in range(0, n):
        if abs(f[i] - actual[i]) > w:
            w = abs(f[i] - actual[i])
    return w

print("periods : " + str(n))
print("")
print("model   total |error|   total error   worst miss")
print("  A       " + str(abs_error(model_a)) + "           " + str(signed_error(model_a)) + "            " + str(worst_miss(model_a)))
print("  B       " + str(abs_error(model_b)) + "           " + str(signed_error(model_b)) + "           " + str(worst_miss(model_b)))
print("  C       " + str(abs_error(model_c)) + "           " + str(signed_error(model_c)) + "            " + str(worst_miss(model_c)))
print("")
if abs_error(model_a) == abs_error(model_b):
    print("A and B score identically on absolute error : " + str(abs_error(model_a)))
else:
    print("A and B differ on absolute error : " + str(abs_error(model_a)) + " and " + str(abs_error(model_b)))
if not signed_error(model_a) == signed_error(model_b):
    print("and differ on signed error by " + str(abs(signed_error(model_b) - signed_error(model_a))))
print("")

def errors_all_one_way(f):
    high = 0
    low = 0
    for i in range(0, n):
        if f[i] > actual[i]:
            high = high + 1
        if f[i] < actual[i]:
            low = low + 1
    if low == 0:
        return 1
    if high == 0:
        return 1
    return 0

a_high = 0
a_low = 0
for i in range(0, n):
    if model_a[i] > actual[i]:
        a_high = a_high + 1
    if model_a[i] < actual[i]:
        a_low = a_low + 1
b_high = 0
b_low = 0
for i in range(0, n):
    if model_b[i] > actual[i]:
        b_high = b_high + 1
    if model_b[i] < actual[i]:
        b_low = b_low + 1
print("direction of the misses")
print("  A : " + str(a_high) + " high, " + str(a_low) + " low")
print("  B : " + str(b_high) + " high, " + str(b_low) + " low")
if errors_all_one_way(model_b) == 1:
    if errors_all_one_way(model_a) == 0:
        print("  B misses in one direction only, so a constant correction applies to it")
print("")
offset = int(signed_error(model_b) / n)
model_b_fixed = []
for i in range(0, n):
    model_b_fixed = model_b_fixed + [model_b[i] - offset]
print("correcting B by its mean signed error of " + str(offset))
print("  B before : " + str(abs_error(model_b)))
print("  B after  : " + str(abs_error(model_b_fixed)))
if abs_error(model_b_fixed) < abs_error(model_b):
    print("  improved by " + str(abs_error(model_b) - abs_error(model_b_fixed)) + " with no new information")
a_offset = int(signed_error(model_a) / n)
model_a_fixed = []
for i in range(0, n):
    model_a_fixed = model_a_fixed + [model_a[i] - a_offset]
print("the same correction applied to A, whose offset is " + str(a_offset))
print("  A before : " + str(abs_error(model_a)))
print("  A after  : " + str(abs_error(model_a_fixed)))
if abs_error(model_a_fixed) == abs_error(model_a):
    print("  unchanged, because there was no constant offset to remove")
print("")
cost_over = 2
cost_under = 5

def money(f):
    c = 0
    for i in range(0, n):
        if f[i] > actual[i]:
            c = c + (f[i] - actual[i]) * cost_over
        else:
            c = c + (actual[i] - f[i]) * cost_under
    return c

print("cost at " + str(cost_over) + " per unit over and " + str(cost_under) + " per unit short")
print("  A : " + str(money(model_a)))
print("  B : " + str(money(model_b)))
print("  C : " + str(money(model_c)))
if not money(model_a) == money(model_b):
    print("  A and B scored equal on absolute error and differ here by " + str(abs(money(model_a) - money(model_b))))
if money(model_b) < money(model_a):
    print("  the biased model is the cheaper one, because it is biased in the")
    print("  direction that costs " + str(cost_over) + " rather than " + str(cost_under))
else:
    print("  the unbiased model is the cheaper one")
print("")
print("C against A")
print("  absolute total : " + str(abs_error(model_c)) + " versus " + str(abs_error(model_a)))
print("  worst miss     : " + str(worst_miss(model_c)) + " versus " + str(worst_miss(model_a)))
if abs_error(model_c) < abs_error(model_a):
    if worst_miss(model_c) > worst_miss(model_a):
        print("  C is better on the total and worse on the worst case, and both are true")
print("")
tight = [41, 54, 61, 46, 69, 51]
print("control - a model that is closer on every period")
print("  |error| : " + str(abs_error(tight)) + " versus A's " + str(abs_error(model_a)))
print("  cost    : " + str(money(tight)) + " versus A's " + str(money(model_a)))
if abs_error(tight) < abs_error(model_a):
    if money(tight) < money(model_a):
        print("  both metrics agree, so this comparison cannot tell them apart")
print("")
print("Absolute error is the right default and the cancellation it prevents is a")
print("real failure. The sign it discards is the part that says whether the model")
print("can be corrected, and what being wrong costs.")
```

## stdout (executed)

```text
periods : 6

model   total |error|   total error   worst miss
  A       18           0            4
  B       18           18           4
  C       12           0            6

A and B score identically on absolute error : 18
and differ on signed error by 18

direction of the misses
  A : 3 high, 3 low
  B : 6 high, 0 low
  B misses in one direction only, so a constant correction applies to it

correcting B by its mean signed error of 3
  B before : 18
  B after  : 4
  improved by 14 with no new information
the same correction applied to A, whose offset is 0
  A before : 18
  A after  : 18
  unchanged, because there was no constant offset to remove

cost at 2 per unit over and 5 per unit short
  A : 63
  B : 36
  C : 42
  A and B scored equal on absolute error and differ here by 27
  the biased model is the cheaper one, because it is biased in the
  direction that costs 2 rather than 5

C against A
  absolute total : 12 versus 18
  worst miss     : 6 versus 4
  C is better on the total and worse on the worst case, and both are true

control - a model that is closer on every period
  |error| : 6 versus A's 18
  cost    : 18 versus A's 63
  both metrics agree, so this comparison cannot tell them apart

Absolute error is the right default and the cancellation it prevents is a
real failure. The sign it discards is the part that says whether the model
can be corrected, and what being wrong costs.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
