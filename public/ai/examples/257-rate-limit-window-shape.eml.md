<!-- canonical: efficientnewlanguage.org/ai/examples/257-rate-limit-window-shape | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 257 — Rate limit window shape — three limiters, three actual limits

`rate_limit_window_shape.eml` replays a boundary-exploiting client through a fixed window, a sliding window and two token buckets, and reports the largest number of requests admitted in **any** 60-tick span.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). "100 requests per
# minute", enforced three ways with three different actual limits.
#
# A fixed window counts requests per calendar minute and resets at the
# boundary. That allows a client to send the full quota at 0:59 and the full
# quota again at 1:00 - twice the stated rate, inside one second, and every
# individual minute is within limit.
#
# A sliding window counts the last 60 seconds from now, which has no boundary
# to exploit. A token bucket refills continuously and additionally bounds the
# BURST, which is the quantity a downstream service actually cares about.
#
# The measurement is a worst-case client - one that sends exactly at the
# boundary - replayed through each limiter, reporting the largest number of
# requests admitted in ANY 60-tick window. That number is the real limit, and
# it is not the configured one for two of the three.

60 => WINDOW
10 => LIMIT

def fixed_window(times):
    # Admit while the count within the current calendar window is under LIMIT.
    [] => admitted
    {} => count
    for t in times:
        int(t / WINDOW) => w
        0 => c
        if w in count:
            count[w] => c
        if c < LIMIT:
            c + 1 => count[w]
            admitted + [t] => admitted
    return admitted

def sliding_window(times):
    [] => admitted
    for t in times:
        0 => recent
        for a in admitted:
            if a > t - WINDOW and a <= t:
                recent + 1 => recent
        if recent < LIMIT:
            admitted + [t] => admitted
    return admitted

def token_bucket(times, capacity):
    # Refills at LIMIT per WINDOW; `capacity` bounds the burst. Tokens are
    # tracked in thousandths so the refill is integer arithmetic.
    [] => admitted
    capacity * 1000 => tokens
    0 => last
    for t in times:
        t - last => elapsed
        t => last
        tokens + int(elapsed * LIMIT * 1000 / WINDOW) => tokens
        if tokens > capacity * 1000:
            capacity * 1000 => tokens
        if tokens >= 1000:
            tokens - 1000 => tokens
            admitted + [t] => admitted
    return admitted

def worst_window(admitted):
    # The largest number admitted in any 60-tick span.
    0 => worst
    for a in admitted:
        0 => c
        for b in admitted:
            if b >= a and b < a + WINDOW:
                c + 1 => c
        if c > worst:
            c => worst
    return worst


# A client that has learned where the boundary is: everything at 55..59 and
# again at 60..64.
[] => burst_client
for t in [55:59]:
    for k in [1:4]:
        burst_client + [t] => burst_client
for t in [60:64]:
    for k in [1:4]:
        burst_client + [t] => burst_client

# A steady client at one request per seven ticks - about 8.5 per window,
# which is UNDER the configured limit. The first version used one per three
# ticks, i.e. 20 per window, and then asserted a correct limiter would admit
# all of them: a compliant-client check whose client was not compliant.
[] => steady_client
for k in [0:39]:
    steady_client + [k * 7] => steady_client

"limiter          burst client: admitted / worst 60-tick   steady client"^0
{} => res
for pair in [["fixed", 0], ["sliding", 0], ["bucket-10", 10], ["bucket-3", 3]]:
    pair[0] => nm
    pair[1] => cap
    if nm == "fixed":
        fixed_window(burst_client) => ab
        fixed_window(steady_client) => as_
    elif nm == "sliding":
        sliding_window(burst_client) => ab
        sliding_window(steady_client) => as_
    else:
        token_bucket(burst_client, cap) => ab
        token_bucket(steady_client, cap) => as_
    [len(ab), worst_window(ab), len(as_)] => res[nm]
    ("%-16s %-12d %-15d %d" % (nm, len(ab), worst_window(ab), len(as_)))^0

""^0
("configured limit: " + str(LIMIT) + " per " + str(WINDOW) + " ticks")^0
("burst client sent: " + str(len(burst_client)) + " requests")^0
("steady client sent: " + str(len(steady_client)) + " requests")^0

# ------------------------------------------ the boundary exploit, in numbers
""^0
("the real limit each one enforces, in the worst 60-tick window:")^0
for nm in ["fixed", "sliding", "bucket-10", "bucket-3"]:
    "" => note
    if res[nm][1] > LIMIT:
        " <- above the configured limit" => note
    ("  %-11s %d%s" % (nm, res[nm][1], note))^0

# ----------------------------------------- what the burst bound costs
""^0
("a tighter burst bound also admits fewer from the steady client:")^0
("  bucket-10 steady admitted: " + str(res["bucket-10"][2]) + "/" + str(len(steady_client)))^0
("  bucket-3  steady admitted: " + str(res["bucket-3"][2]) + "/" + str(len(steady_client)))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The fixed window must admit more than the configured limit in some 60-tick
# span. That is the boundary exploit.
checked + 1 => checked
if res["fixed"][1] > LIMIT:
    passed + 1 => passed

# The sliding window must not.
checked + 1 => checked
if res["sliding"][1] <= LIMIT:
    passed + 1 => passed

# Every limiter must admit at most as many as were sent, and at least one.
checked + 1 => checked
0 => sane
for nm in ["fixed", "sliding", "bucket-10", "bucket-3"]:
    if res[nm][0] > 0 and res[nm][0] <= len(burst_client):
        sane + 1 => sane
if sane == 4:
    passed + 1 => passed

# A tighter burst bound must admit strictly fewer of the burst client.
checked + 1 => checked
if res["bucket-3"][0] < res["bucket-10"][0]:
    passed + 1 => passed

# And the steady client must be admitted in full by the sliding window - a
# limiter that throttles a compliant client is not enforcing the stated rate.
checked + 1 => checked
if res["sliding"][2] == len(steady_client):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "A fixed window enforces twice its stated rate for one second per minute." => verdict
else:
    "FAILED - a limiter did not behave as the checks describe." => verdict
verdict^0

""^0
"Every individual minute is within limit, which is what the limiter checks" => n1
n1^0
"and what a dashboard shows. The quantity the downstream service feels is" => n2
n2^0
"the worst window across the boundary, and no fixed-window implementation" => n3
n3^0
"ever computes it." => n4
n4^0
```

## Python (deterministic transpilation)

```python
WINDOW = 60
LIMIT = 10

def fixed_window(times):
    admitted = []
    count = {}
    for t in times:
        w = int(t / WINDOW)
        c = 0
        if w in count:
            c = count[w]
        if c < LIMIT:
            count[w] = c + 1
            admitted = admitted + [t]
    return admitted

def sliding_window(times):
    admitted = []
    for t in times:
        recent = 0
        for a in admitted:
            if a > t - WINDOW and a <= t:
                recent = recent + 1
        if recent < LIMIT:
            admitted = admitted + [t]
    return admitted

def token_bucket(times, capacity):
    admitted = []
    tokens = capacity * 1000
    last = 0
    for t in times:
        elapsed = t - last
        last = t
        tokens = tokens + int(elapsed * LIMIT * 1000 / WINDOW)
        if tokens > capacity * 1000:
            tokens = capacity * 1000
        if tokens >= 1000:
            tokens = tokens - 1000
            admitted = admitted + [t]
    return admitted

def worst_window(admitted):
    worst = 0
    for a in admitted:
        c = 0
        for b in admitted:
            if b >= a and b < a + WINDOW:
                c = c + 1
        if c > worst:
            worst = c
    return worst

burst_client = []
for t in range(55, 60):
    for k in range(1, 5):
        burst_client = burst_client + [t]
for t in range(60, 65):
    for k in range(1, 5):
        burst_client = burst_client + [t]
steady_client = []
for k in range(0, 40):
    steady_client = steady_client + [k * 7]
print("limiter          burst client: admitted / worst 60-tick   steady client")
res = {}
for pair in [["fixed", 0], ["sliding", 0], ["bucket-10", 10], ["bucket-3", 3]]:
    nm = pair[0]
    cap = pair[1]
    if nm == "fixed":
        ab = fixed_window(burst_client)
        as_ = fixed_window(steady_client)
    elif nm == "sliding":
        ab = sliding_window(burst_client)
        as_ = sliding_window(steady_client)
    else:
        ab = token_bucket(burst_client, cap)
        as_ = token_bucket(steady_client, cap)
    res[nm] = [len(ab), worst_window(ab), len(as_)]
    print("%-16s %-12d %-15d %d" % (nm, len(ab), worst_window(ab), len(as_)))
print("")
print("configured limit: " + str(LIMIT) + " per " + str(WINDOW) + " ticks")
print("burst client sent: " + str(len(burst_client)) + " requests")
print("steady client sent: " + str(len(steady_client)) + " requests")
print("")
print("the real limit each one enforces, in the worst 60-tick window:")
for nm in ["fixed", "sliding", "bucket-10", "bucket-3"]:
    note = ""
    if res[nm][1] > LIMIT:
        note = " <- above the configured limit"
    print("  %-11s %d%s" % (nm, res[nm][1], note))
print("")
print("a tighter burst bound also admits fewer from the steady client:")
print("  bucket-10 steady admitted: " + str(res["bucket-10"][2]) + "/" + str(len(steady_client)))
print("  bucket-3  steady admitted: " + str(res["bucket-3"][2]) + "/" + str(len(steady_client)))
passed = 0
checked = 0
checked = checked + 1
if res["fixed"][1] > LIMIT:
    passed = passed + 1
checked = checked + 1
if res["sliding"][1] <= LIMIT:
    passed = passed + 1
checked = checked + 1
sane = 0
for nm in ["fixed", "sliding", "bucket-10", "bucket-3"]:
    if res[nm][0] > 0 and res[nm][0] <= len(burst_client):
        sane = sane + 1
if sane == 4:
    passed = passed + 1
checked = checked + 1
if res["bucket-3"][0] < res["bucket-10"][0]:
    passed = passed + 1
checked = checked + 1
if res["sliding"][2] == len(steady_client):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "A fixed window enforces twice its stated rate for one second per minute."
else:
    verdict = "FAILED - a limiter did not behave as the checks describe."
print(verdict)
print("")
n1 = "Every individual minute is within limit, which is what the limiter checks"
print(n1)
n2 = "and what a dashboard shows. The quantity the downstream service feels is"
print(n2)
n3 = "the worst window across the boundary, and no fixed-window implementation"
print(n3)
n4 = "ever computes it."
print(n4)
```

## stdout (executed)

```text
limiter          burst client: admitted / worst 60-tick   steady client
fixed            20           20              40
sliding          10           10              40
bucket-10        11           11              40
bucket-3         4            4               40

configured limit: 10 per 60 ticks
burst client sent: 40 requests
steady client sent: 40 requests

the real limit each one enforces, in the worst 60-tick window:
  fixed       20 <- above the configured limit
  sliding     10
  bucket-10   11 <- above the configured limit
  bucket-3    4

a tighter burst bound also admits fewer from the steady client:
  bucket-10 steady admitted: 40/40
  bucket-3  steady admitted: 40/40

checks passed: 5/5
A fixed window enforces twice its stated rate for one second per minute.

Every individual minute is within limit, which is what the limiter checks
and what a dashboard shows. The quantity the downstream service feels is
the worst window across the boundary, and no fixed-window implementation
ever computes it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
