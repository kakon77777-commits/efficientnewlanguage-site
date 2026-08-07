<!-- canonical: efficientnewlanguage.org/ai/examples/287-retry-masked-flakiness | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 287 — Retry-masked flakiness — one failure in five reports as 99.2%

`retry_masked_flakiness.eml` sweeps true failure rates against attempt counts and computes the observed pass rate exactly, in integer per-mille arithmetic.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A test that fails
# one run in five, retried three times, reports a 99.2% pass rate.
#
# Retrying a failed test in CI is a reasonable operational choice and a
# catastrophic measurement choice. The observed pass rate after r attempts is
#
#     1 - (failure_rate ^ r)
#
# so a test failing 20% of the time passes 99.2% of CI runs at three attempts.
# The dashboard is not lying - that IS how often the pipeline goes green - but
# the number it reports is a function of the retry policy, and the underlying
# rate is not recoverable from it unless the retries are counted too.
#
# Worse, the transformation is steepest exactly where it matters. A test at 50%
# looks like 87.5%; a test at 5% looks like 99.99%. So the metric compresses
# every unhealthy test into the same narrow band just below 100%, which is also
# where all the healthy tests are.
#
# The measurement sweeps true failure rates against attempt counts, computes
# the observed pass rate exactly in integer per-mille arithmetic, and reports
# how many distinct true rates become indistinguishable at a reporting
# precision of one decimal place.

1000 => SCALE

def ipow(base, n):
    1 => r
    for k in [1:n]:
        r * base => r
    return r

def observed_permille(fail_permille, attempts):
    # 1 - f^attempts, in per mille, exactly.
    ipow(fail_permille, attempts) => num
    ipow(SCALE, attempts) => den
    return SCALE - int(num * SCALE / den)

def show(pm):
    return str(int(pm / 10)) + "." + str(pm % 10) + "%"


[500, 200, 100, 50, 10] => TRUE_FAIL
[1, 2, 3, 5] => ATTEMPTS

"true failure rate   1 attempt   2 attempts   3 attempts   5 attempts"^0
{} => res
for f in TRUE_FAIL:
    {} => row
    "" => cells
    for a in ATTEMPTS:
        observed_permille(f, a) => o
        o => row[str(a)]
        cells + ("%-12s" % show(o)) => cells
    row => res[str(f)]
    ("%-19s %s" % (show(f) + " fail", cells))^0

""^0
("true failure rates swept: " + str(len(TRUE_FAIL)))^0

# ------------------------------- how many become indistinguishable
""^0
"observed pass rates rounded to one decimal place, at 3 attempts:"^0
{} => distinct1
{} => distinct3
for f in TRUE_FAIL:
    1 => distinct1[show(res[str(f)]["1"])]
    1 => distinct3[show(res[str(f)]["3"])]
    ("  true " + show(f) + " fail -> observed " + show(res[str(f)]["3"]))^0
("distinct observed values at 1 attempt: " + str(len(distinct1)) + "/" + str(len(TRUE_FAIL)))^0
("distinct observed values at 3 attempts: " + str(len(distinct3)) + "/" + str(len(TRUE_FAIL)))^0

# --------------------------- everything unhealthy lands above 99%
""^0
0 => above99
for f in TRUE_FAIL:
    if res[str(f)]["3"] >= 990:
        above99 + 1 => above99
("true rates that report above 99% at 3 attempts: " + str(above99) + "/" + str(len(TRUE_FAIL)))^0
("  including a test that genuinely fails " + show(TRUE_FAIL[1]) + " of the time")^0

# ------------------------------ the number that IS recoverable
""^0
"the retry count is the missing information, and it is already available:"^0
0 => recoverable
for f in TRUE_FAIL:
    # Expected extra attempts per run = f + f^2 + ... which is monotone in f,
    # so the retry count identifies the true rate where the pass rate cannot.
    0 => extra
    for a in [1:2]:
        extra + int(ipow(f, a) * SCALE / ipow(SCALE, a)) => extra
    ("  true " + show(f) + " fail -> " + show(extra) + " extra attempts per run")^0
    recoverable + 1 => recoverable
("rates distinguishable by retry count: " + str(recoverable) + "/" + str(len(TRUE_FAIL)))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# With one attempt the observed rate must be the true rate, so the distortion
# is entirely the retry policy's.
checked + 1 => checked
0 => exact
for f in TRUE_FAIL:
    if res[str(f)]["1"] == SCALE - f:
        exact + 1 => exact
if exact == len(TRUE_FAIL):
    passed + 1 => passed

# A 20% failure rate must report above 99% at three attempts.
checked + 1 => checked
if res["200"]["3"] >= 990:
    passed + 1 => passed

# All five true rates must be distinguishable at one attempt.
checked + 1 => checked
if len(distinct1) == len(TRUE_FAIL):
    passed + 1 => passed

# And most of them must land above 99% at three - the compression that puts
# unhealthy tests in the same band as healthy ones.
checked + 1 => checked
if above99 >= 3:
    passed + 1 => passed

# The observed rate must rise monotonically with attempts for every true rate,
# so more retries always look better and never worse.
checked + 1 => checked
0 => monotone
0 => steps
for f in TRUE_FAIL:
    for i in [0:len(ATTEMPTS) - 2]:
        steps + 1 => steps
        if res[str(f)][str(ATTEMPTS[i + 1])] >= res[str(f)][str(ATTEMPTS[i])]:
            monotone + 1 => monotone
if monotone == steps:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Three attempts turns one failure in five into a 99.2% pass rate." => verdict
else:
    "FAILED - the arithmetic did not behave as the checks describe." => verdict
verdict^0

""^0
"Retrying is an operational decision and the pass rate is a measurement," => n1
n1^0
"and the retry silently makes the second a function of the first. What is" => n2
n2^0
"lost is not precision but ORDER: after three attempts a test failing half" => n3
n3^0
"the time and one failing one time in twenty report numbers a reader would" => n4
n4^0
"call the same. The retry count is the part worth putting on the dashboard." => n5
n5^0
```

## Python (deterministic transpilation)

```python
SCALE = 1000

def ipow(base, n):
    r = 1
    for k in range(1, n+1):
        r = r * base
    return r

def observed_permille(fail_permille, attempts):
    num = ipow(fail_permille, attempts)
    den = ipow(SCALE, attempts)
    return SCALE - int(num * SCALE / den)

def show(pm):
    return str(int(pm / 10)) + "." + str(pm % 10) + "%"

TRUE_FAIL = [500, 200, 100, 50, 10]
ATTEMPTS = [1, 2, 3, 5]
print("true failure rate   1 attempt   2 attempts   3 attempts   5 attempts")
res = {}
for f in TRUE_FAIL:
    row = {}
    cells = ""
    for a in ATTEMPTS:
        o = observed_permille(f, a)
        row[str(a)] = o
        cells = cells + "%-12s" % show(o)
    res[str(f)] = row
    print("%-19s %s" % (show(f) + " fail", cells))
print("")
print("true failure rates swept: " + str(len(TRUE_FAIL)))
print("")
print("observed pass rates rounded to one decimal place, at 3 attempts:")
distinct1 = {}
distinct3 = {}
for f in TRUE_FAIL:
    distinct1[show(res[str(f)]["1"])] = 1
    distinct3[show(res[str(f)]["3"])] = 1
    print("  true " + show(f) + " fail -> observed " + show(res[str(f)]["3"]))
print("distinct observed values at 1 attempt: " + str(len(distinct1)) + "/" + str(len(TRUE_FAIL)))
print("distinct observed values at 3 attempts: " + str(len(distinct3)) + "/" + str(len(TRUE_FAIL)))
print("")
above99 = 0
for f in TRUE_FAIL:
    if res[str(f)]["3"] >= 990:
        above99 = above99 + 1
print("true rates that report above 99% at 3 attempts: " + str(above99) + "/" + str(len(TRUE_FAIL)))
print("  including a test that genuinely fails " + show(TRUE_FAIL[1]) + " of the time")
print("")
print("the retry count is the missing information, and it is already available:")
recoverable = 0
for f in TRUE_FAIL:
    extra = 0
    for a in range(1, 3):
        extra = extra + int(ipow(f, a) * SCALE / ipow(SCALE, a))
    print("  true " + show(f) + " fail -> " + show(extra) + " extra attempts per run")
    recoverable = recoverable + 1
print("rates distinguishable by retry count: " + str(recoverable) + "/" + str(len(TRUE_FAIL)))
passed = 0
checked = 0
checked = checked + 1
exact = 0
for f in TRUE_FAIL:
    if res[str(f)]["1"] == SCALE - f:
        exact = exact + 1
if exact == len(TRUE_FAIL):
    passed = passed + 1
checked = checked + 1
if res["200"]["3"] >= 990:
    passed = passed + 1
checked = checked + 1
if len(distinct1) == len(TRUE_FAIL):
    passed = passed + 1
checked = checked + 1
if above99 >= 3:
    passed = passed + 1
checked = checked + 1
monotone = 0
steps = 0
for f in TRUE_FAIL:
    for i in range(0, len(ATTEMPTS) - 2+1):
        steps = steps + 1
        if res[str(f)][str(ATTEMPTS[i + 1])] >= res[str(f)][str(ATTEMPTS[i])]:
            monotone = monotone + 1
if monotone == steps:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Three attempts turns one failure in five into a 99.2% pass rate."
else:
    verdict = "FAILED - the arithmetic did not behave as the checks describe."
print(verdict)
print("")
n1 = "Retrying is an operational decision and the pass rate is a measurement,"
print(n1)
n2 = "and the retry silently makes the second a function of the first. What is"
print(n2)
n3 = "lost is not precision but ORDER: after three attempts a test failing half"
print(n3)
n4 = "the time and one failing one time in twenty report numbers a reader would"
print(n4)
n5 = "call the same. The retry count is the part worth putting on the dashboard."
print(n5)
```

## stdout (executed)

```text
true failure rate   1 attempt   2 attempts   3 attempts   5 attempts
50.0% fail          50.0%       75.0%       87.5%       96.9%       
20.0% fail          80.0%       96.0%       99.2%       100.0%      
10.0% fail          90.0%       99.0%       99.9%       100.0%      
5.0% fail           95.0%       99.8%       100.0%      100.0%      
1.0% fail           99.0%       100.0%      100.0%      100.0%      

true failure rates swept: 5

observed pass rates rounded to one decimal place, at 3 attempts:
  true 50.0% fail -> observed 87.5%
  true 20.0% fail -> observed 99.2%
  true 10.0% fail -> observed 99.9%
  true 5.0% fail -> observed 100.0%
  true 1.0% fail -> observed 100.0%
distinct observed values at 1 attempt: 5/5
distinct observed values at 3 attempts: 4/5

true rates that report above 99% at 3 attempts: 4/5
  including a test that genuinely fails 20.0% of the time

the retry count is the missing information, and it is already available:
  true 50.0% fail -> 75.0% extra attempts per run
  true 20.0% fail -> 24.0% extra attempts per run
  true 10.0% fail -> 11.0% extra attempts per run
  true 5.0% fail -> 5.2% extra attempts per run
  true 1.0% fail -> 1.0% extra attempts per run
rates distinguishable by retry count: 5/5

checks passed: 5/5
Three attempts turns one failure in five into a 99.2% pass rate.

Retrying is an operational decision and the pass rate is a measurement,
and the retry silently makes the second a function of the first. What is
lost is not precision but ORDER: after three attempts a test failing half
the time and one failing one time in twenty report numbers a reader would
call the same. The retry count is the part worth putting on the dashboard.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
