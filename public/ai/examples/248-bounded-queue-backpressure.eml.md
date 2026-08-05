<!-- canonical: efficientnewlanguage.org/ai/examples/248-bounded-queue-backpressure | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 248 — Bounded queue backpressure — a bigger buffer is not more capacity

`bounded_queue_backpressure.eml` runs one burst arrival pattern through three full-queue policies — drop-newest, drop-oldest, block — at three queue sizes, and reports loss, stalls, and the age of what was served.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A queue that is
# full, and the three things a system can do about it.
#
# A bounded queue between a fast producer and a slow consumer will fill. What
# happens then is a design decision, and it is usually made by whichever
# library was imported:
#
#     drop-newest   reject the arriving item - the queue keeps the OLDEST
#                   data, which for a metrics stream is the stalest
#     drop-oldest   evict the front to make room - freshest data survives,
#                   and the loss is invisible to the producer
#     block         make the producer wait - nothing is lost, and the
#                   backpressure travels UPSTREAM to whoever called the
#                   producer
#
# Every one of them loses something. The unbounded fourth option loses the
# process.
#
# The measurement runs one arrival pattern through all three at several queue
# sizes and reports what each one costs: items lost, items delayed, and the
# AGE of what the consumer finally saw - because a queue that never drops
# anything can still deliver data too late to be worth having.

def run_queue(arrivals, service_every, cap, policy, horizon):
    # `arrivals` is one entry per tick: how many items appear at that tick.
    # The consumer takes one item every `service_every` ticks.
    #
    # Returns [served, dropped, blocked_ticks, max_age, total_age].
    [] => q
    0 => served
    0 => dropped
    0 => blocked
    0 => max_age
    0 => total_age
    [] => pending
    for t in [0:horizon - 1]:
        0 => n
        if t < len(arrivals):
            arrivals[t] => n
        # Under `block`, anything the producer could not hand over earlier is
        # still waiting and goes in first.
        len(pending) + n => want
        [] => carry
        for k in [1:want]:
            if len(q) < cap:
                q + [t] => q
            else:
                if policy == "drop-newest":
                    dropped + 1 => dropped
                elif policy == "drop-oldest":
                    q[1:len(q)] => q
                    q + [t] => q
                    dropped + 1 => dropped
                else:
                    carry + [t] => carry
        if policy == "block":
            carry => pending
            if len(carry) > 0:
                blocked + 1 => blocked
        if t % service_every == 0 and len(q) > 0:
            q[0] => arrived
            q[1:len(q)] => q
            served + 1 => served
            t - arrived => age
            total_age + age => total_age
            if age > max_age:
                age => max_age
    return [served, dropped, blocked, max_age, total_age]


# A burst pattern: quiet, then a spike, then quiet. The consumer is slower
# than the spike but faster than the average, which is the case where the
# queue is supposed to help.
[] => arrivals
for t in [0:59]:
    0 => n
    if t < 10:
        1 => n
    elif t < 20:
        4 => n
    elif t < 30:
        0 => n
    else:
        1 => n
    arrivals + [n] => arrivals

0 => sent
for n in arrivals:
    sent + n => sent

2 => SERVICE
120 => HORIZON

"policy        cap  served  dropped  blocked  max age  mean age"^0
{} => res
for policy in ["drop-newest", "drop-oldest", "block"]:
    for cap in [4, 16, 64]:
        run_queue(arrivals, SERVICE, cap, policy, HORIZON) => r
        policy + "/" + str(cap) => k
        r => res[k]
        0 => mean
        if r[0] > 0:
            int(r[4] / r[0]) => mean
        ("%-13s %-4d %-7d %-8d %-8d %-8d %d" % (policy, cap, r[0], r[1], r[2], r[3], mean))^0

""^0
("items the producer wanted to send: " + str(sent))^0
("consumer rate: one item every " + str(SERVICE) + " ticks over " + str(HORIZON) + " ticks")^0
int(HORIZON / SERVICE) + 1 => capacity_total
("so the consumer can serve at most:  " + str(capacity_total))^0

# ------------------------------------------ what a bigger queue buys
""^0
"a bigger queue does not create service capacity, it converts loss into delay:"^0
for policy in ["drop-newest", "block"]:
    res[policy + "/4"] => small
    res[policy + "/64"] => big
    ("  %-12s cap 4 -> 64: dropped %d -> %d, max age %d -> %d" % (policy, small[1], big[1], small[3], big[3]))^0

# ------------------------------------- which data survives a drop
""^0
# The two drop policies are indistinguishable by drop COUNT and by max age -
# the observable that separates them is the mean age of what was served,
# because they keep opposite ends of the queue.
"drop-newest and drop-oldest at cap 4:"^0
0 => mean_new
0 => mean_old
if res["drop-newest/4"][0] > 0:
    int(res["drop-newest/4"][4] / res["drop-newest/4"][0]) => mean_new
if res["drop-oldest/4"][0] > 0:
    int(res["drop-oldest/4"][4] / res["drop-oldest/4"][0]) => mean_old
("  drop-newest dropped " + str(res["drop-newest/4"][1]) + ", max age " + str(res["drop-newest/4"][3]) + ", mean age " + str(mean_new))^0
("  drop-oldest dropped " + str(res["drop-oldest/4"][1]) + ", max age " + str(res["drop-oldest/4"][3]) + ", mean age " + str(mean_old))^0
"...same count, same worst case, different data: an alert on drop rate or on"^0
"peak latency cannot tell these two apart at all."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# No policy may serve more than the consumer's physical capacity. If one does,
# the model is wrong rather than the policy being good.
checked + 1 => checked
0 => within
0 => n_pol
for policy in ["drop-newest", "drop-oldest", "block"]:
    for cap in [4, 16, 64]:
        n_pol + 1 => n_pol
        if res[policy + "/" + str(cap)][0] <= capacity_total:
            within + 1 => within
if within == n_pol:
    passed + 1 => passed

# Blocking must never drop anything - that is the entire point of blocking.
checked + 1 => checked
0 => block_lossless
for cap in [4, 16, 64]:
    if res["block/" + str(cap)][1] == 0:
        block_lossless + 1 => block_lossless
if block_lossless == 3:
    passed + 1 => passed

# And blocking must therefore stall the producer at the small size.
checked + 1 => checked
if res["block/4"][2] > 0:
    passed + 1 => passed

# A larger queue must drop strictly less under drop-newest. If a bigger buffer
# did not reduce loss, the buffer is not doing anything.
checked + 1 => checked
if res["drop-newest/64"][1] < res["drop-newest/4"][1]:
    passed + 1 => passed

# And the larger queue must pay for it in latency: max age must rise.
checked + 1 => checked
if res["drop-newest/64"][3] > res["drop-newest/4"][3]:
    passed + 1 => passed

# The two drop policies must be indistinguishable by count and by worst case,
# and distinguishable by mean age. If they differed on count, the comparison
# above would be measuring the wrong thing.
checked + 1 => checked
if res["drop-newest/4"][1] == res["drop-oldest/4"][1]:
    if res["drop-newest/4"][3] == res["drop-oldest/4"][3] and not (mean_new == mean_old):
        passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "A bigger queue does not add capacity - it trades loss for latency." => verdict
else:
    "FAILED - a queue policy did not behave as the checks describe." => verdict
verdict^0

""^0
"The queue size is not a tuning knob for throughput, because throughput is" => n1
n1^0
"set by the consumer. It is a knob that chooses between two failures: data" => n2
n2^0
"that never arrives and data that arrives too late. A system that has not" => n3
n3^0
"chosen has still chosen, by whatever the default was." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def run_queue(arrivals, service_every, cap, policy, horizon):
    q = []
    served = 0
    dropped = 0
    blocked = 0
    max_age = 0
    total_age = 0
    pending = []
    for t in range(0, horizon):
        n = 0
        if t < len(arrivals):
            n = arrivals[t]
        want = len(pending) + n
        carry = []
        for k in range(1, want+1):
            if len(q) < cap:
                q = q + [t]
            elif policy == "drop-newest":
                dropped = dropped + 1
            elif policy == "drop-oldest":
                q = q[1:len(q)]
                q = q + [t]
                dropped = dropped + 1
            else:
                carry = carry + [t]
        if policy == "block":
            pending = carry
            if len(carry) > 0:
                blocked = blocked + 1
        if t % service_every == 0 and len(q) > 0:
            arrived = q[0]
            q = q[1:len(q)]
            served = served + 1
            age = t - arrived
            total_age = total_age + age
            if age > max_age:
                max_age = age
    return [served, dropped, blocked, max_age, total_age]

arrivals = []
for t in range(0, 60):
    n = 0
    if t < 10:
        n = 1
    elif t < 20:
        n = 4
    elif t < 30:
        n = 0
    else:
        n = 1
    arrivals = arrivals + [n]
sent = 0
for n in arrivals:
    sent = sent + n
SERVICE = 2
HORIZON = 120
print("policy        cap  served  dropped  blocked  max age  mean age")
res = {}
for policy in ["drop-newest", "drop-oldest", "block"]:
    for cap in [4, 16, 64]:
        r = run_queue(arrivals, SERVICE, cap, policy, HORIZON)
        k = policy + "/" + str(cap)
        res[k] = r
        mean = 0
        if r[0] > 0:
            mean = int(r[4] / r[0])
        print("%-13s %-4d %-7d %-8d %-8d %-8d %d" % (policy, cap, r[0], r[1], r[2], r[3], mean))
print("")
print("items the producer wanted to send: " + str(sent))
print("consumer rate: one item every " + str(SERVICE) + " ticks over " + str(HORIZON) + " ticks")
capacity_total = int(HORIZON / SERVICE) + 1
print("so the consumer can serve at most:  " + str(capacity_total))
print("")
print("a bigger queue does not create service capacity, it converts loss into delay:")
for policy in ["drop-newest", "block"]:
    small = res[policy + "/4"]
    big = res[policy + "/64"]
    print("  %-12s cap 4 -> 64: dropped %d -> %d, max age %d -> %d" % (policy, small[1], big[1], small[3], big[3]))
print("")
print("drop-newest and drop-oldest at cap 4:")
mean_new = 0
mean_old = 0
if res["drop-newest/4"][0] > 0:
    mean_new = int(res["drop-newest/4"][4] / res["drop-newest/4"][0])
if res["drop-oldest/4"][0] > 0:
    mean_old = int(res["drop-oldest/4"][4] / res["drop-oldest/4"][0])
print("  drop-newest dropped " + str(res["drop-newest/4"][1]) + ", max age " + str(res["drop-newest/4"][3]) + ", mean age " + str(mean_new))
print("  drop-oldest dropped " + str(res["drop-oldest/4"][1]) + ", max age " + str(res["drop-oldest/4"][3]) + ", mean age " + str(mean_old))
print("...same count, same worst case, different data: an alert on drop rate or on")
print("peak latency cannot tell these two apart at all.")
passed = 0
checked = 0
checked = checked + 1
within = 0
n_pol = 0
for policy in ["drop-newest", "drop-oldest", "block"]:
    for cap in [4, 16, 64]:
        n_pol = n_pol + 1
        if res[policy + "/" + str(cap)][0] <= capacity_total:
            within = within + 1
if within == n_pol:
    passed = passed + 1
checked = checked + 1
block_lossless = 0
for cap in [4, 16, 64]:
    if res["block/" + str(cap)][1] == 0:
        block_lossless = block_lossless + 1
if block_lossless == 3:
    passed = passed + 1
checked = checked + 1
if res["block/4"][2] > 0:
    passed = passed + 1
checked = checked + 1
if res["drop-newest/64"][1] < res["drop-newest/4"][1]:
    passed = passed + 1
checked = checked + 1
if res["drop-newest/64"][3] > res["drop-newest/4"][3]:
    passed = passed + 1
checked = checked + 1
if res["drop-newest/4"][1] == res["drop-oldest/4"][1]:
    if res["drop-newest/4"][3] == res["drop-oldest/4"][3] and not mean_new == mean_old:
        passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "A bigger queue does not add capacity - it trades loss for latency."
else:
    verdict = "FAILED - a queue policy did not behave as the checks describe."
print(verdict)
print("")
n1 = "The queue size is not a tuning knob for throughput, because throughput is"
print(n1)
n2 = "set by the consumer. It is a knob that chooses between two failures: data"
print(n2)
n3 = "that never arrives and data that arrives too late. A system that has not"
print(n3)
n4 = "chosen has still chosen, by whatever the default was."
print(n4)
```

## stdout (executed)

```text
policy        cap  served  dropped  blocked  max age  mean age
drop-newest   4    33      47       0        7        5
drop-newest   16   46      34       0        31       21
drop-newest   64   60      0        0        79       42
drop-oldest   4    33      47       0        7        2
drop-oldest   16   46      34       0        31       15
drop-oldest   64   60      0        0        79       42
block         4    60      0        112      7        6
block         16   60      0        107      31       24
block         64   60      0        0        79       42

items the producer wanted to send: 80
consumer rate: one item every 2 ticks over 120 ticks
so the consumer can serve at most:  61

a bigger queue does not create service capacity, it converts loss into delay:
  drop-newest  cap 4 -> 64: dropped 47 -> 0, max age 7 -> 79
  block        cap 4 -> 64: dropped 0 -> 0, max age 7 -> 79

drop-newest and drop-oldest at cap 4:
  drop-newest dropped 47, max age 7, mean age 5
  drop-oldest dropped 47, max age 7, mean age 2
...same count, same worst case, different data: an alert on drop rate or on
peak latency cannot tell these two apart at all.

checks passed: 6/6
A bigger queue does not add capacity - it trades loss for latency.

The queue size is not a tuning knob for throughput, because throughput is
set by the consumer. It is a knob that chooses between two failures: data
that never arrives and data that arrives too late. A system that has not
chosen has still chosen, by whatever the default was.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
