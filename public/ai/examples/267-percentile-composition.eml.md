<!-- canonical: efficientnewlanguage.org/ai/examples/267-percentile-composition | ai_layer_version: 0.1.0 | updated: 2026-08-06 -->

# Example 267 — Percentile composition — every backend meets its p99, one request in ten is slow

`percentile_composition.eml` computes the p99 of a request that fans out to N backends and waits for all of them, exactly, with no simulation.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every service
# meets its p99, and one request in ten is slow.
#
# A request that fans out to N backends and waits for all of them takes the
# MAXIMUM of N latencies, not one of them. If each backend is slow with
# probability 1%, the request is fast only when all N are fast, which happens
# with probability 0.99^N. At N = 10 that is 90.4% - so about one request in
# ten exceeds the backend p99, while every backend is inside its budget.
#
# Stated the other way round, which is the useful direction: the p99 of a
# ten-way fan-out is set by the backend's p99.9, not its p99. The tail a
# service must control is deeper than the tail anyone reports, by a factor
# that grows with the fan-out.
#
# The measurement is EXACT rather than simulated. The backend latency
# distribution is 1000 quantiles given by a formula, so the k-th smallest value
# is available directly, and P(max of N <= the k-th value) is (k/1000)^N. The
# smallest k satisfying a target is found by binary search over integers, with
# the comparison done as k^N * 1000 >= target * 1000^N so that no floating
# point enters the decision at all.

1000 => Q

def quantile(k):
    # The k-th smallest of 1000 backend latencies, in milliseconds. Monotone
    # in k by construction, so the list is already its own sorted order and
    # never has to be materialised.
    #
    # The shape matters. A polynomial tail is nearly flat at the top, which
    # makes the fan-out cost look like one percent even while the required
    # quantile moves from p99 to p99.9 - the index moves and the milliseconds
    # do not, so the table would understate its own finding. A real latency
    # tail grows like 1/(1-p), which is what this is.
    return 20 + int(10000 / (1001 - k))

def ipow(base, n):
    1 => r
    for k in [1:n]:
        r * base => r
    return r

def smallest_k(n, target_permille):
    # Smallest k in 1..Q with (k/Q)^n >= target/1000, decided in integers.
    ipow(Q, n) => denom
    target_permille * denom => rhs
    1 => lo
    Q => hi
    while lo < hi:
        int((lo + hi) / 2) => mid
        ipow(mid, n) * 1000 => lhs
        if lhs >= rhs:
            mid => hi
        else:
            mid + 1 => lo
    return lo

def fast_permille(n, k):
    # P(all n backends land at or below the k-th quantile), in per mille.
    return int(ipow(k, n) * 1000 / ipow(Q, n))


990 => TARGET

"fan-out   request p99 comes from   backend quantile   latency ms   backend p99 ms"^0
{} => res
for n in [1, 2, 5, 10, 20]:
    smallest_k(n, TARGET) => k
    quantile(k) => ms
    quantile(990) => base_ms
    [k, ms, base_ms] => res[str(n)]
    ("%-9d %-24s p%-17s %-12d %d" % (n, "the max of " + str(n), str(int(k / 10)) + "." + str(k % 10), ms, base_ms))^0

""^0
("backend p99 latency: " + str(quantile(990)) + " ms")^0
("backend p99.9 latency: " + str(quantile(999)) + " ms")^0
("worst backend latency: " + str(quantile(1000)) + " ms")^0

# --------------------------- how often a fan-out exceeds the backend p99
""^0
"if every backend is inside its p99, how often is the REQUEST inside it?"^0
for n in [1, 2, 5, 10, 20]:
    fast_permille(n, 990) => f
    ("  fan-out %-4d request within the backend p99: %d.%d%%   slow: %d.%d%%" % (n, int(f / 10), f % 10, int((1000 - f) / 10), (1000 - f) % 10))^0
"...every backend meets its stated target in all of these rows."^0

# ------------------------------ what the fan-out costs in latency terms
""^0
"the p99 of the whole request, against the p99 of one backend:"^0
quantile(990) => one
for n in [1, 2, 5, 10, 20]:
    res[str(n)] => r
    ("  fan-out %-4d p99 = %-5d ms   (%d%% of the single-backend p99)" % (n, r[1], int(r[1] * 100 / one)))^0

# ------------------------------------- the tail that has to be controlled
""^0
res["10"][0] => k10
("to hold a ten-way fan-out at p99, the backend must be controlled at p" + str(int(k10 / 10)) + "." + str(k10 % 10))^0
("  which is the backend's " + str(1000 - k10) + "-in-1000 tail, not its 10-in-1000 tail")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# With a single backend the request p99 must BE the backend p99. If it were
# not, the model is wrong before the interesting part starts.
checked + 1 => checked
if res["1"][0] == 990:
    passed + 1 => passed

# The required backend quantile must rise with fan-out, strictly, at every
# step. A flat step would mean the effect saturates, and it does not.
checked + 1 => checked
0 => rising
0 => steps
[1, 2, 5, 10, 20] => NS
for i in [0:len(NS) - 2]:
    steps + 1 => steps
    if res[str(NS[i])][0] < res[str(NS[i + 1])][0]:
        rising + 1 => rising
if rising == steps:
    passed + 1 => passed

# A ten-way fan-out must need the backend's p99.9 or deeper - the headline
# claim, as an integer comparison rather than a rounded probability.
checked + 1 => checked
if res["10"][0] >= 999:
    passed + 1 => passed

# With every backend inside its p99, a ten-way request must be outside it
# more than 5% of the time.
checked + 1 => checked
if 1000 - fast_permille(10, 990) > 50:
    passed + 1 => passed

# And the binary search must agree with a direct scan, so the exactness claim
# rests on two implementations rather than on one being clever.
checked + 1 => checked
0 => agree
0 => scanned
for n in [1, 2, 5]:
    scanned + 1 => scanned
    0 => found
    # The right-hand side does not depend on k. Recomputing it inside the loop
    # is a thousand big-integer powers per fan-out and shows up as megabytes of
    # execution trace, which is how it was noticed.
    TARGET * ipow(Q, n) => rhs
    for k in [1:Q]:
        if found == 0 and ipow(k, n) * 1000 >= rhs:
            k => found
        if found > 0:
            break
    if found == smallest_k(n, TARGET):
        agree + 1 => agree
if agree == scanned:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Ten backends inside their p99 make a request that misses it one time in ten." => verdict
else:
    "FAILED - a tail did not compose as the checks describe." => verdict
verdict^0

""^0
"A percentile is not a budget that can be handed out and added up. Waiting" => n1
n1^0
"for N things takes the maximum, and the maximum of N tails is a deeper" => n2
n2^0
"tail - so a service-level objective written per backend does not compose" => n3
n3^0
"into one for the request. The number that has to be agreed is the fan-out" => n4
n4^0
"first, and only then the quantile." => n5
n5^0
```

## Python (deterministic transpilation)

```python
Q = 1000

def quantile(k):
    return 20 + int(10000 / (1001 - k))

def ipow(base, n):
    r = 1
    for k in range(1, n+1):
        r = r * base
    return r

def smallest_k(n, target_permille):
    denom = ipow(Q, n)
    rhs = target_permille * denom
    lo = 1
    hi = Q
    while lo < hi:
        mid = int((lo + hi) / 2)
        lhs = ipow(mid, n) * 1000
        if lhs >= rhs:
            hi = mid
        else:
            lo = mid + 1
    return lo

def fast_permille(n, k):
    return int(ipow(k, n) * 1000 / ipow(Q, n))

TARGET = 990
print("fan-out   request p99 comes from   backend quantile   latency ms   backend p99 ms")
res = {}
for n in [1, 2, 5, 10, 20]:
    k = smallest_k(n, TARGET)
    ms = quantile(k)
    base_ms = quantile(990)
    res[str(n)] = [k, ms, base_ms]
    print("%-9d %-24s p%-17s %-12d %d" % (n, "the max of " + str(n), str(int(k / 10)) + "." + str(k % 10), ms, base_ms))
print("")
print("backend p99 latency: " + str(quantile(990)) + " ms")
print("backend p99.9 latency: " + str(quantile(999)) + " ms")
print("worst backend latency: " + str(quantile(1000)) + " ms")
print("")
print("if every backend is inside its p99, how often is the REQUEST inside it?")
for n in [1, 2, 5, 10, 20]:
    f = fast_permille(n, 990)
    print("  fan-out %-4d request within the backend p99: %d.%d%%   slow: %d.%d%%" % (n, int(f / 10), f % 10, int((1000 - f) / 10), (1000 - f) % 10))
print("...every backend meets its stated target in all of these rows.")
print("")
print("the p99 of the whole request, against the p99 of one backend:")
one = quantile(990)
for n in [1, 2, 5, 10, 20]:
    r = res[str(n)]
    print("  fan-out %-4d p99 = %-5d ms   (%d%% of the single-backend p99)" % (n, r[1], int(r[1] * 100 / one)))
print("")
k10 = res["10"][0]
print("to hold a ten-way fan-out at p99, the backend must be controlled at p" + str(int(k10 / 10)) + "." + str(k10 % 10))
print("  which is the backend's " + str(1000 - k10) + "-in-1000 tail, not its 10-in-1000 tail")
passed = 0
checked = 0
checked = checked + 1
if res["1"][0] == 990:
    passed = passed + 1
checked = checked + 1
rising = 0
steps = 0
NS = [1, 2, 5, 10, 20]
for i in range(0, len(NS) - 2+1):
    steps = steps + 1
    if res[str(NS[i])][0] < res[str(NS[i + 1])][0]:
        rising = rising + 1
if rising == steps:
    passed = passed + 1
checked = checked + 1
if res["10"][0] >= 999:
    passed = passed + 1
checked = checked + 1
if 1000 - fast_permille(10, 990) > 50:
    passed = passed + 1
checked = checked + 1
agree = 0
scanned = 0
for n in [1, 2, 5]:
    scanned = scanned + 1
    found = 0
    rhs = TARGET * ipow(Q, n)
    for k in range(1, Q+1):
        if found == 0 and ipow(k, n) * 1000 >= rhs:
            found = k
        if found > 0:
            break
    if found == smallest_k(n, TARGET):
        agree = agree + 1
if agree == scanned:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Ten backends inside their p99 make a request that misses it one time in ten."
else:
    verdict = "FAILED - a tail did not compose as the checks describe."
print(verdict)
print("")
n1 = "A percentile is not a budget that can be handed out and added up. Waiting"
print(n1)
n2 = "for N things takes the maximum, and the maximum of N tails is a deeper"
print(n2)
n3 = "tail - so a service-level objective written per backend does not compose"
print(n3)
n4 = "into one for the request. The number that has to be agreed is the fan-out"
print(n4)
n5 = "first, and only then the quantile."
print(n5)
```

## stdout (executed)

```text
fan-out   request p99 comes from   backend quantile   latency ms   backend p99 ms
1         the max of 1             p99.0              929          929
2         the max of 2             p99.5              1686         929
5         the max of 5             p99.8              3353         929
10        the max of 10            p99.9              5020         929
20        the max of 20            p100.0             10020        929

backend p99 latency: 929 ms
backend p99.9 latency: 5020 ms
worst backend latency: 10020 ms

if every backend is inside its p99, how often is the REQUEST inside it?
  fan-out 1    request within the backend p99: 99.0%   slow: 1.0%
  fan-out 2    request within the backend p99: 98.0%   slow: 2.0%
  fan-out 5    request within the backend p99: 95.0%   slow: 5.0%
  fan-out 10   request within the backend p99: 90.4%   slow: 9.6%
  fan-out 20   request within the backend p99: 81.7%   slow: 18.3%
...every backend meets its stated target in all of these rows.

the p99 of the whole request, against the p99 of one backend:
  fan-out 1    p99 = 929   ms   (100% of the single-backend p99)
  fan-out 2    p99 = 1686  ms   (181% of the single-backend p99)
  fan-out 5    p99 = 3353  ms   (360% of the single-backend p99)
  fan-out 10   p99 = 5020  ms   (540% of the single-backend p99)
  fan-out 20   p99 = 10020 ms   (1078% of the single-backend p99)

to hold a ten-way fan-out at p99, the backend must be controlled at p99.9
  which is the backend's 1-in-1000 tail, not its 10-in-1000 tail

checks passed: 5/5
Ten backends inside their p99 make a request that misses it one time in ten.

A percentile is not a budget that can be handed out and added up. Waiting
for N things takes the maximum, and the maximum of N tails is a deeper
tail - so a service-level objective written per backend does not compose
into one for the request. The number that has to be agreed is the fan-out
first, and only then the quantile.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
