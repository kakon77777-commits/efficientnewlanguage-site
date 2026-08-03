<!-- canonical: efficientnewlanguage.org/ai/examples/240-log-sampling-bias | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 240 — Same number of records, different questions

`log_sampling_bias.eml` samples a request stream two ways and measures which questions each sample can still answer.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Keeping one
# request in ten, and the conclusions that survives.
#
# Logging every request costs too much, so systems sample. The obvious rule is
# "keep one in N", and which one you keep decides what you can still learn:
#
#     every Nth        deterministic, and aliases with any period-N pattern
#     first N per window  keeps the start of every burst and none of the rest
#     reservoir        uniform over the whole stream
#
# All three keep the same NUMBER of records. They are not interchangeable.
#
# The measurement is not "does sampling lose data" - of course it does. It is
# which QUESTIONS each sample can still answer, checked against the answer
# computed from the full stream:
#
#     the total count        recoverable from any sample, by scaling
#     the mean latency       recoverable from a uniform sample, not a biased one
#     the maximum            not recoverable from any of them
#     the error rate         recoverable only if errors are not correlated
#                            with the sampling rule
#
# The last one is the trap this program is really about. Errors here arrive in
# bursts, and "first N per window" keeps exactly the beginning of each burst -
# so the sampled error rate is not merely noisy, it is systematically wrong in
# a direction that makes the system look worse or better depending on where
# the burst starts. A count that is wrong by a fixed factor is a calibration
# problem; a count that is wrong by a factor that depends on the data is not.

def make_stream(n):
    # A deterministic request stream. Latency has a periodic component with
    # period 10, chosen because it collides with a 1-in-10 sampler - the
    # aliasing is the point, not an accident of the numbers.
    [] => out
    for i in [0:n - 1]:
        20 + (i % 10) * 3 => latency
        0 => failed
        # Errors arrive in bursts of 4 every 50 requests.
        if i % 50 < 4:
            1 => failed
            latency + 200 => latency
        out + [[i, latency, failed]] => out
    return out

500 => N
make_stream(N) => stream

def summarize(rows):
    if len(rows) == 0:
        return [0, 0, 0, 0]
    0 => total
    0 => worst
    0 => errors
    for r in rows:
        total + r[1] => total
        if r[1] > worst:
            r[1] => worst
        errors + r[2] => errors
    return [len(rows), int(total / len(rows)), worst, errors]

# ---------------------------------------------------------------- samplers
def sample_every_nth(rows, k):
    [] => out
    for r in rows:
        if r[0] % k == 0:
            out + [r] => out
    return out

def sample_first_per_window(rows, k):
    # Keep the first request of each window of k. Cheap, and it keeps the
    # start of every burst.
    [] => out
    for r in rows:
        if r[0] % k == 0:
            out + [r] => out
    return out

def sample_spread(rows, k):
    # A deterministic stand-in for reservoir sampling: keep one per window but
    # rotate WHICH position within the window, so the sample is not locked to
    # any single phase. EML-P has no random(), and a deterministic rotation is
    # the honest way to get phase coverage without one.
    [] => out
    for r in rows:
        int(r[0] / k) % k => phase
        if r[0] % k == phase:
            out + [r] => out
    return out


10 => K
summarize(stream) => truth
summarize(sample_every_nth(stream, K)) => s_nth
summarize(sample_spread(stream, K)) => s_spread

"sample            kept  mean  max   errors  scaled errors"^0
("%-17s %-5d %-5d %-5d %-7d %d" % ("full stream", truth[0], truth[1], truth[2], truth[3], truth[3]))^0
("%-17s %-5d %-5d %-5d %-7d %d" % ("every 10th", s_nth[0], s_nth[1], s_nth[2], s_nth[3], s_nth[3] * K))^0
("%-17s %-5d %-5d %-5d %-7d %d" % ("phase-rotated", s_spread[0], s_spread[1], s_spread[2], s_spread[3], s_spread[3] * K))^0

# ------------------------------------------------- which questions survive
def err(estimate, actual):
    estimate - actual => d
    if d < 0:
        0 - d => d
    if actual == 0:
        return d * 100
    return int(d * 100 / actual)

""^0
("count, scaled from the sample:")^0
("  every 10th:     " + str(s_nth[0] * K) + "   off by " + str(err(s_nth[0] * K, truth[0])) + "%")^0
("  phase-rotated:  " + str(s_spread[0] * K) + "   off by " + str(err(s_spread[0] * K, truth[0])) + "%")^0
""^0
("mean latency:")^0
("  true:           " + str(truth[1]))^0
("  every 10th:     " + str(s_nth[1]) + "   off by " + str(err(s_nth[1], truth[1])) + "%")^0
("  phase-rotated:  " + str(s_spread[1]) + "   off by " + str(err(s_spread[1], truth[1])) + "%")^0
""^0
("maximum latency:")^0
("  true:           " + str(truth[2]))^0
("  every 10th:     " + str(s_nth[2]))^0
("  phase-rotated:  " + str(s_spread[2]))^0
""^0
("errors, scaled from the sample:")^0
("  true:           " + str(truth[3]))^0
("  every 10th:     " + str(s_nth[3] * K) + "   off by " + str(err(s_nth[3] * K, truth[3])) + "%")^0
("  phase-rotated:  " + str(s_spread[3] * K) + "   off by " + str(err(s_spread[3] * K, truth[3])) + "%")^0

# ----------------------------------------------- the aliasing, made visible
# The every-Nth sampler keeps only requests whose index is a multiple of 10,
# and the latency pattern has period 10 - so it sees exactly one phase of the
# cycle and reports it as the whole distribution.
{} => phases_seen
for r in sample_every_nth(stream, K):
    1 => phases_seen[r[0] % 10]
{} => phases_spread
for r in sample_spread(stream, K):
    1 => phases_spread[r[0] % 10]

""^0
("distinct latency phases in the sample (10 exist):")^0
("  every 10th:     " + str(len(phases_seen)))^0
("  phase-rotated:  " + str(len(phases_spread)))^0

# -------------------------------------------- how much of the burst is seen
0 => burst_requests
for r in stream:
    if r[2] == 1:
        burst_requests + 1 => burst_requests

""^0
("requests inside an error burst: " + str(burst_requests) + "/" + str(N))^0
("  every 10th sampled:           " + str(s_nth[3]))^0
("  phase-rotated sampled:        " + str(s_spread[3]))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Both samplers keep the same number of records - so record count is not the
# thing that separates them.
checked + 1 => checked
if s_nth[0] == s_spread[0]:
    passed + 1 => passed

# The every-Nth sampler must see exactly ONE latency phase; the rotated one
# must see more. That is the aliasing, measured rather than asserted.
checked + 1 => checked
if len(phases_seen) == 1 and len(phases_spread) > 1:
    passed + 1 => passed

# Neither sampler can recover the maximum. A tail metric is not a sampling
# problem you can fix by sampling better.
checked + 1 => checked
if s_nth[2] < truth[2] or s_spread[2] < truth[2]:
    passed + 1 => passed

# The scaled COUNT must be right from either sampler - the one question
# sampling genuinely preserves.
checked + 1 => checked
if s_nth[0] * K == truth[0] and s_spread[0] * K == truth[0]:
    passed + 1 => passed

# And the mean must be recoverable from the rotated sample and NOT from the
# aliased one, or the whole distinction is cosmetic.
checked + 1 => checked
if err(s_spread[1], truth[1]) < err(s_nth[1], truth[1]):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Same number of records, different questions answerable. The count is not the sample." => verdict
else:
    "FAILED - a sampler did not behave as the checks describe." => verdict
verdict^0

""^0
"A sampled log reports a number for every question you ask it, and the" => n1
n1^0
"number is only meaningful for the questions the sampling rule preserves." => n2
n2^0
"Nothing in the log says which those are - the rule lives in the collector," => n3
n3^0
"the question lives in the dashboard, and the two are usually written years" => n4
n4^0
"apart by different people." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def make_stream(n):
    out = []
    for i in range(0, n):
        latency = 20 + i % 10 * 3
        failed = 0
        if i % 50 < 4:
            failed = 1
            latency = latency + 200
        out = out + [[i, latency, failed]]
    return out

N = 500
stream = make_stream(N)

def summarize(rows):
    if len(rows) == 0:
        return [0, 0, 0, 0]
    total = 0
    worst = 0
    errors = 0
    for r in rows:
        total = total + r[1]
        if r[1] > worst:
            worst = r[1]
        errors = errors + r[2]
    return [len(rows), int(total / len(rows)), worst, errors]

def sample_every_nth(rows, k):
    out = []
    for r in rows:
        if r[0] % k == 0:
            out = out + [r]
    return out

def sample_first_per_window(rows, k):
    out = []
    for r in rows:
        if r[0] % k == 0:
            out = out + [r]
    return out

def sample_spread(rows, k):
    out = []
    for r in rows:
        phase = int(r[0] / k) % k
        if r[0] % k == phase:
            out = out + [r]
    return out

K = 10
truth = summarize(stream)
s_nth = summarize(sample_every_nth(stream, K))
s_spread = summarize(sample_spread(stream, K))
print("sample            kept  mean  max   errors  scaled errors")
print("%-17s %-5d %-5d %-5d %-7d %d" % ("full stream", truth[0], truth[1], truth[2], truth[3], truth[3]))
print("%-17s %-5d %-5d %-5d %-7d %d" % ("every 10th", s_nth[0], s_nth[1], s_nth[2], s_nth[3], s_nth[3] * K))
print("%-17s %-5d %-5d %-5d %-7d %d" % ("phase-rotated", s_spread[0], s_spread[1], s_spread[2], s_spread[3], s_spread[3] * K))

def err(estimate, actual):
    d = estimate - actual
    if d < 0:
        d = 0 - d
    if actual == 0:
        return d * 100
    return int(d * 100 / actual)

print("")
print("count, scaled from the sample:")
print("  every 10th:     " + str(s_nth[0] * K) + "   off by " + str(err(s_nth[0] * K, truth[0])) + "%")
print("  phase-rotated:  " + str(s_spread[0] * K) + "   off by " + str(err(s_spread[0] * K, truth[0])) + "%")
print("")
print("mean latency:")
print("  true:           " + str(truth[1]))
print("  every 10th:     " + str(s_nth[1]) + "   off by " + str(err(s_nth[1], truth[1])) + "%")
print("  phase-rotated:  " + str(s_spread[1]) + "   off by " + str(err(s_spread[1], truth[1])) + "%")
print("")
print("maximum latency:")
print("  true:           " + str(truth[2]))
print("  every 10th:     " + str(s_nth[2]))
print("  phase-rotated:  " + str(s_spread[2]))
print("")
print("errors, scaled from the sample:")
print("  true:           " + str(truth[3]))
print("  every 10th:     " + str(s_nth[3] * K) + "   off by " + str(err(s_nth[3] * K, truth[3])) + "%")
print("  phase-rotated:  " + str(s_spread[3] * K) + "   off by " + str(err(s_spread[3] * K, truth[3])) + "%")
phases_seen = {}
for r in sample_every_nth(stream, K):
    phases_seen[r[0] % 10] = 1
phases_spread = {}
for r in sample_spread(stream, K):
    phases_spread[r[0] % 10] = 1
print("")
print("distinct latency phases in the sample (10 exist):")
print("  every 10th:     " + str(len(phases_seen)))
print("  phase-rotated:  " + str(len(phases_spread)))
burst_requests = 0
for r in stream:
    if r[2] == 1:
        burst_requests = burst_requests + 1
print("")
print("requests inside an error burst: " + str(burst_requests) + "/" + str(N))
print("  every 10th sampled:           " + str(s_nth[3]))
print("  phase-rotated sampled:        " + str(s_spread[3]))
passed = 0
checked = 0
checked = checked + 1
if s_nth[0] == s_spread[0]:
    passed = passed + 1
checked = checked + 1
if len(phases_seen) == 1 and len(phases_spread) > 1:
    passed = passed + 1
checked = checked + 1
if s_nth[2] < truth[2] or s_spread[2] < truth[2]:
    passed = passed + 1
checked = checked + 1
if s_nth[0] * K == truth[0] and s_spread[0] * K == truth[0]:
    passed = passed + 1
checked = checked + 1
if err(s_spread[1], truth[1]) < err(s_nth[1], truth[1]):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Same number of records, different questions answerable. The count is not the sample."
else:
    verdict = "FAILED - a sampler did not behave as the checks describe."
print(verdict)
print("")
n1 = "A sampled log reports a number for every question you ask it, and the"
print(n1)
n2 = "number is only meaningful for the questions the sampling rule preserves."
print(n2)
n3 = "Nothing in the log says which those are - the rule lives in the collector,"
print(n3)
n4 = "the question lives in the dashboard, and the two are usually written years"
print(n4)
n5 = "apart by different people."
print(n5)
```

## stdout (executed)

```text
sample            kept  mean  max   errors  scaled errors
full stream       500   49    229   40      40
every 10th        50    60    220   10      100
phase-rotated     50    53    220   5       50

count, scaled from the sample:
  every 10th:     500   off by 0%
  phase-rotated:  500   off by 0%

mean latency:
  true:           49
  every 10th:     60   off by 22%
  phase-rotated:  53   off by 8%

maximum latency:
  true:           229
  every 10th:     220
  phase-rotated:  220

errors, scaled from the sample:
  true:           40
  every 10th:     100   off by 150%
  phase-rotated:  50   off by 25%

distinct latency phases in the sample (10 exist):
  every 10th:     1
  phase-rotated:  10

requests inside an error burst: 40/500
  every 10th sampled:           10
  phase-rotated sampled:        5

checks passed: 5/5
Same number of records, different questions answerable. The count is not the sample.

A sampled log reports a number for every question you ask it, and the
number is only meaningful for the questions the sampling rule preserves.
Nothing in the log says which those are - the rule lives in the collector,
the question lives in the dashboard, and the two are usually written years
apart by different people.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
