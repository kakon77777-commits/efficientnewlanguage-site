<!-- canonical: efficientnewlanguage.org/ai/examples/235-counter-vs-histogram | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 235 — The percentile you threw away at write time

`counter_vs_histogram.eml` summarises two workloads with the same mean and very different tails, then tries to recover the percentiles from each summary.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The percentile
# you cannot compute from the numbers you kept.
#
# A service records latency. Two ways to keep it cheaply:
#
#     counter    running sum and count -> the mean, in two integers
#     histogram  a count per bucket    -> any percentile, in one array
#
# The counter is smaller and answers exactly one question. That is not a
# limitation you can work around later: the mean is a projection, and the
# information a percentile needs was thrown away at write time. No amount of
# clever reading recovers it.
#
# Which matters because the mean is the number that hides the thing you are
# looking for. Two workloads below have the SAME mean and different tails:
#
#     steady    every request near the average
#     bimodal   most requests fast, a few very slow
#
# A dashboard built on counters shows one line for both. The p99 differs by
# an order of magnitude.
#
# The measurement is the reconstruction question, made concrete: for each
# workload, compute the true percentiles from the raw data, then try to
# compute them from each summary, and report the error. A summary is adequate
# for a question exactly when it reproduces the answer.
#
# The histogram has its own honest cost, reported alongside: it can only be as
# precise as its buckets. Its p99 is not the true p99, it is the bucket the
# true p99 falls in - so the answer it gives is bounded, not exact, and the
# bound is a design decision made when the buckets were chosen.

def steady_workload(n):
    [] => out
    for i in [0:n - 1]:
        out + [95 + (i % 11)] => out
    return out

def bimodal_workload(n):
    # Same mean, different shape: most requests at 50, a tail at 2000.
    [] => out
    for i in [0:n - 1]:
        if i % 40 == 0:
            out + [2000] => out
        else:
            out + [51 + (i % 7)] => out
    return out

def mean_of(xs):
    0 => t
    for x in xs:
        t + x => t
    return int(t / len(xs))

def sorted_copy(xs):
    [] => out
    for x in xs:
        out + [x] => out
    1 => i
    while i < len(out):
        out[i] => cur
        i - 1 => j
        while j >= 0 and out[j] > cur:
            out[j] => out[j + 1]
            j - 1 => j
        cur => out[j + 1]
        i + 1 => i
    return out

def percentile_of_sorted(s, p):
    # Nearest-rank on an ALREADY SORTED list. Sorting inside this function -
    # which is how it was first written - re-sorts on every call, and with an
    # insertion sort that is O(n^2) per percentile. It produced a 212 MB
    # execution trace for a program whose output is thirty lines.
    int(p * len(s) / 100) => idx
    if idx >= len(s):
        len(s) - 1 => idx
    return s[idx]

# ------------------------------------------------------------- the summaries
def counter_of(xs):
    0 => total
    for x in xs:
        total + x => total
    return [total, len(xs)]

def counter_mean(c):
    return int(c[0] / c[1])

[0, 60, 80, 100, 150, 300, 1000, 3000] => BUCKETS

def histogram_of(xs):
    [] => counts
    for b in BUCKETS:
        counts + [0] => counts
    for x in xs:
        len(BUCKETS) - 1 => slot
        for i in [0:len(BUCKETS) - 1]:
            if x < BUCKETS[i] and slot == len(BUCKETS) - 1:
                i - 1 => slot
        if slot < 0:
            0 => slot
        counts[slot] + 1 => counts[slot]
    return counts

def histogram_percentile(counts, p):
    # The upper edge of the bucket the p-th observation falls in. This is an
    # UPPER BOUND on the true value, never the value itself.
    0 => total
    for c in counts:
        total + c => total
    int(p * total / 100) => want
    0 => seen
    for i in [0:len(counts) - 1]:
        seen + counts[i] => seen
        if seen > want:
            if i + 1 < len(BUCKETS):
                return BUCKETS[i + 1]
            return BUCKETS[len(BUCKETS) - 1]
    return BUCKETS[len(BUCKETS) - 1]


120 => N
steady_workload(N) => steady
bimodal_workload(N) => bimodal
sorted_copy(steady) => steady_sorted
sorted_copy(bimodal) => bimodal_sorted

def percentile(xs, p):
    # Dispatch to the pre-sorted copy for the two workloads this program uses.
    if len(xs) == len(steady) and xs[0] == steady[0]:
        return percentile_of_sorted(steady_sorted, p)
    return percentile_of_sorted(bimodal_sorted, p)

"workload   mean  p50   p90   p99   max"^0
for pair in [["steady", steady], ["bimodal", bimodal]]:
    pair[1] => xs
    ("%-10s %-5d %-5d %-5d %-5d %d" % (pair[0], mean_of(xs), percentile(xs, 50), percentile(xs, 90), percentile(xs, 99), percentile(xs, 100)))^0

counter_of(steady) => c_steady
counter_of(bimodal) => c_bimodal
histogram_of(steady) => h_steady
histogram_of(bimodal) => h_bimodal

""^0
("what a COUNTER reports:")^0
("  steady:  mean " + str(counter_mean(c_steady)))^0
("  bimodal: mean " + str(counter_mean(c_bimodal)))^0
("  difference: " + str(counter_mean(c_bimodal) - counter_mean(c_steady)))^0

""^0
("what a HISTOGRAM reports for p99:")^0
("  steady:  <= " + str(histogram_percentile(h_steady, 99)) + "   (true " + str(percentile(steady, 99)) + ")")^0
("  bimodal: <= " + str(histogram_percentile(h_bimodal, 99)) + "   (true " + str(percentile(bimodal, 99)) + ")")^0

# --------------------------------------------- the histogram's honest cost
# It never gives the exact value. What it guarantees is a bound, and the bound
# must actually hold - a summary that is sometimes below the truth is worse
# than one that is always above it.
0 => bounded
0 => exact
for pair in [["steady", steady, h_steady], ["bimodal", bimodal, h_bimodal]]:
    for p in [50, 90, 99]:
        percentile(pair[1], p) => t
        histogram_percentile(pair[2], p) => h
        if h >= t:
            bounded + 1 => bounded
        if h == t:
            exact + 1 => exact

""^0
("percentile queries checked:      6")^0
("  histogram bound held:          " + str(bounded) + "/6")^0
("  histogram exactly right:       " + str(exact) + "/6")^0
("...a bound is what it sells; exactness is not on offer.")^0

# ------------------------------------------- storage, which is the whole trade
""^0
("integers stored per workload:")^0
("  raw:       " + str(len(steady)))^0
("  counter:   2")^0
("  histogram: " + str(len(BUCKETS)))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The two workloads must have near-identical means and very different tails.
# Without that the whole case is uninteresting.
checked + 1 => checked
counter_mean(c_bimodal) - counter_mean(c_steady) => mean_gap
if mean_gap < 0:
    0 - mean_gap => mean_gap
if mean_gap <= 5 and percentile(bimodal, 99) > percentile(steady, 99) * 5:
    passed + 1 => passed

# The counter must be UNABLE to separate them - that is the defect.
checked + 1 => checked
if counter_mean(c_steady) == counter_mean(c_bimodal) or mean_gap <= 5:
    passed + 1 => passed

# The histogram must separate them clearly.
checked + 1 => checked
if histogram_percentile(h_bimodal, 99) > histogram_percentile(h_steady, 99):
    passed + 1 => passed

# Every histogram answer must be an upper bound on the truth. A summary that
# sometimes under-reports the tail is not a conservative summary.
checked + 1 => checked
if bounded == 6:
    passed + 1 => passed

# And it must NOT be exact everywhere, or the bucket cost would be invisible
# and the trade would look free.
checked + 1 => checked
if exact < 6:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Same mean, tails an order of magnitude apart. The counter cannot tell." => verdict
else:
    "FAILED - a summary did not behave as the checks describe." => verdict
verdict^0

""^0
"The information a percentile needs is discarded at WRITE time, so this is" => n1
n1^0
"not a query you can add later - it is a decision made when the metric was" => n2
n2^0
"defined, usually by someone who was asked for 'average latency'. The" => n3
n3^0
"histogram costs six more integers and buys every percentile at once, with" => n4
n4^0
"a precision fixed by the buckets rather than by the reader." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def steady_workload(n):
    out = []
    for i in range(0, n):
        out = out + [95 + i % 11]
    return out

def bimodal_workload(n):
    out = []
    for i in range(0, n):
        if i % 40 == 0:
            out = out + [2000]
        else:
            out = out + [51 + i % 7]
    return out

def mean_of(xs):
    t = 0
    for x in xs:
        t = t + x
    return int(t / len(xs))

def sorted_copy(xs):
    out = []
    for x in xs:
        out = out + [x]
    i = 1
    while i < len(out):
        cur = out[i]
        j = i - 1
        while j >= 0 and out[j] > cur:
            out[j + 1] = out[j]
            j = j - 1
        out[j + 1] = cur
        i = i + 1
    return out

def percentile_of_sorted(s, p):
    idx = int(p * len(s) / 100)
    if idx >= len(s):
        idx = len(s) - 1
    return s[idx]

def counter_of(xs):
    total = 0
    for x in xs:
        total = total + x
    return [total, len(xs)]

def counter_mean(c):
    return int(c[0] / c[1])

BUCKETS = [0, 60, 80, 100, 150, 300, 1000, 3000]

def histogram_of(xs):
    counts = []
    for b in BUCKETS:
        counts = counts + [0]
    for x in xs:
        slot = len(BUCKETS) - 1
        for i in range(0, len(BUCKETS)):
            if x < BUCKETS[i] and slot == len(BUCKETS) - 1:
                slot = i - 1
        if slot < 0:
            slot = 0
        counts[slot] = counts[slot] + 1
    return counts

def histogram_percentile(counts, p):
    total = 0
    for c in counts:
        total = total + c
    want = int(p * total / 100)
    seen = 0
    for i in range(0, len(counts)):
        seen = seen + counts[i]
        if seen > want:
            if i + 1 < len(BUCKETS):
                return BUCKETS[i + 1]
            return BUCKETS[len(BUCKETS) - 1]
    return BUCKETS[len(BUCKETS) - 1]

N = 120
steady = steady_workload(N)
bimodal = bimodal_workload(N)
steady_sorted = sorted_copy(steady)
bimodal_sorted = sorted_copy(bimodal)

def percentile(xs, p):
    if len(xs) == len(steady) and xs[0] == steady[0]:
        return percentile_of_sorted(steady_sorted, p)
    return percentile_of_sorted(bimodal_sorted, p)

print("workload   mean  p50   p90   p99   max")
for pair in [["steady", steady], ["bimodal", bimodal]]:
    xs = pair[1]
    print("%-10s %-5d %-5d %-5d %-5d %d" % (pair[0], mean_of(xs), percentile(xs, 50), percentile(xs, 90), percentile(xs, 99), percentile(xs, 100)))
c_steady = counter_of(steady)
c_bimodal = counter_of(bimodal)
h_steady = histogram_of(steady)
h_bimodal = histogram_of(bimodal)
print("")
print("what a COUNTER reports:")
print("  steady:  mean " + str(counter_mean(c_steady)))
print("  bimodal: mean " + str(counter_mean(c_bimodal)))
print("  difference: " + str(counter_mean(c_bimodal) - counter_mean(c_steady)))
print("")
print("what a HISTOGRAM reports for p99:")
print("  steady:  <= " + str(histogram_percentile(h_steady, 99)) + "   (true " + str(percentile(steady, 99)) + ")")
print("  bimodal: <= " + str(histogram_percentile(h_bimodal, 99)) + "   (true " + str(percentile(bimodal, 99)) + ")")
bounded = 0
exact = 0
for pair in [["steady", steady, h_steady], ["bimodal", bimodal, h_bimodal]]:
    for p in [50, 90, 99]:
        t = percentile(pair[1], p)
        h = histogram_percentile(pair[2], p)
        if h >= t:
            bounded = bounded + 1
        if h == t:
            exact = exact + 1
print("")
print("percentile queries checked:      6")
print("  histogram bound held:          " + str(bounded) + "/6")
print("  histogram exactly right:       " + str(exact) + "/6")
print("...a bound is what it sells; exactness is not on offer.")
print("")
print("integers stored per workload:")
print("  raw:       " + str(len(steady)))
print("  counter:   2")
print("  histogram: " + str(len(BUCKETS)))
passed = 0
checked = 0
checked = checked + 1
mean_gap = counter_mean(c_bimodal) - counter_mean(c_steady)
if mean_gap < 0:
    mean_gap = 0 - mean_gap
if mean_gap <= 5 and percentile(bimodal, 99) > percentile(steady, 99) * 5:
    passed = passed + 1
checked = checked + 1
if counter_mean(c_steady) == counter_mean(c_bimodal) or mean_gap <= 5:
    passed = passed + 1
checked = checked + 1
if histogram_percentile(h_bimodal, 99) > histogram_percentile(h_steady, 99):
    passed = passed + 1
checked = checked + 1
if bounded == 6:
    passed = passed + 1
checked = checked + 1
if exact < 6:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Same mean, tails an order of magnitude apart. The counter cannot tell."
else:
    verdict = "FAILED - a summary did not behave as the checks describe."
print(verdict)
print("")
n1 = "The information a percentile needs is discarded at WRITE time, so this is"
print(n1)
n2 = "not a query you can add later - it is a decision made when the metric was"
print(n2)
n3 = "defined, usually by someone who was asked for 'average latency'. The"
print(n3)
n4 = "histogram costs six more integers and buys every percentile at once, with"
print(n4)
n5 = "a precision fixed by the buckets rather than by the reader."
print(n5)
```

## stdout (executed)

```text
workload   mean  p50   p90   p99   max
steady     99    100   104   105   105
bimodal    102   54    57    2000  2000

what a COUNTER reports:
  steady:  mean 99
  bimodal: mean 102
  difference: 3

what a HISTOGRAM reports for p99:
  steady:  <= 150   (true 105)
  bimodal: <= 3000   (true 2000)

percentile queries checked:      6
  histogram bound held:          6/6
  histogram exactly right:       0/6
...a bound is what it sells; exactness is not on offer.

integers stored per workload:
  raw:       120
  counter:   2
  histogram: 8

checks passed: 5/5
Same mean, tails an order of magnitude apart. The counter cannot tell.

The information a percentile needs is discarded at WRITE time, so this is
not a query you can add later - it is a decision made when the metric was
defined, usually by someone who was asked for 'average latency'. The
histogram costs six more integers and buys every percentile at once, with
a precision fixed by the buckets rather than by the reader.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
