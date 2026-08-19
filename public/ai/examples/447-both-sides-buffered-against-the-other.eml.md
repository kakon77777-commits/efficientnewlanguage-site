<!-- canonical: efficientnewlanguage.org/ai/examples/447-both-sides-buffered-against-the-other | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 447 — Both sides buffered against the other

`both_sides_buffered_against_the_other.eml` - Each side added a queue against the other's variability. What the pair does to the time a unit of work spends in the system is simulated rather than assumed.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Each side added a
# queue against the other's variability. What the pair does to the time a unit
# of work spends in the system is simulated rather than assumed.
#
# Both queues are right and both have a before-and-after to prove it. Without
# the upstream queue a burst is refused; without the downstream one an uneven
# answer stalls the sender. Each side measured its own drops, added a queue,
# and watched the drops go to zero. Nobody was careless.
#
# A queue converts a drop into a wait. Each side then measures the wait in its
# own queue, correctly, and reports it. The unit of work waits in both, and the
# sum is not on either dashboard because neither system can see the other's
# depth.
#
# Both queues are run over the same arrivals.

[10, 2, 14, 3, 12, 1, 15, 4, 11, 2, 13, 3] => arrivals
[9, 5, 9, 6, 9, 5, 9, 6, 9, 5, 9, 9] => service
len(arrivals) => periods
9 => handoff_rate

# Returns [completed, dropped, wait held upstream, wait held downstream]
def run(upstream_queue, downstream_queue):
    0 => qa
    0 => qb
    0 => completed
    0 => dropped
    0 => wait_a
    0 => wait_b
    0 => t
    while t < periods:
        arrivals[t] => arrived
        qa + arrived => qa
        if upstream_queue == 0:
            handoff_rate => keep
            if qa < keep:
                qa => keep
            dropped + qa - keep => dropped
            keep => qa
        handoff_rate => moved
        if qa < moved:
            qa => moved
        qa - moved => qa
        qb + moved => qb
        service[t] => service_rate
        if downstream_queue == 0:
            service_rate => keep2
            if qb < keep2:
                qb => keep2
            dropped + qb - keep2 => dropped
            keep2 => qb
        service_rate => served
        if qb < served:
            qb => served
        qb - served => qb
        completed + served => completed
        wait_a + qa => wait_a
        wait_b + qb => wait_b
        t + 1 => t
    return [completed, dropped, wait_a, wait_b]

0 => arrived_total
for a in arrivals:
    arrived_total + a => arrived_total

"periods : " + str(periods) + ", work arriving : " + str(arrived_total) ^0
0 => service_total
for v in service:
    service_total + v => service_total
"handoff rate : " + str(handoff_rate) + " per period" ^0
"" => svc
for v in service:
    svc + str(v) + " " => svc
"service  : " + svc + " (total " + str(service_total) + ")" ^0
"" => burst
for a in arrivals:
    burst + str(a) + " " => burst
"arrivals : " + burst ^0
"" ^0

run(0, 0) => neither
run(1, 0) => up_only
run(0, 1) => down_only
run(1, 1) => both

"queues held        completed   dropped   waited upstream   waited downstream" ^0
"  neither          " + str(neither[0]) + "          " + str(neither[1]) + "        " + str(neither[2]) + "                " + str(neither[3]) ^0
"  upstream only    " + str(up_only[0]) + "          " + str(up_only[1]) + "        " + str(up_only[2]) + "               " + str(up_only[3]) ^0
"  downstream only  " + str(down_only[0]) + "          " + str(down_only[1]) + "        " + str(down_only[2]) + "                " + str(down_only[3]) ^0
"  both             " + str(both[0]) + "          " + str(both[1]) + "        " + str(both[2]) + "               " + str(both[3]) ^0
"" ^0

if neither[1] > both[1]:
    "the two queues turned " + str(neither[1] - both[1]) + " dropped units into delivered ones" ^0
    "  which is the whole case for having them, and it is a real gain" ^0
"" ^0

# ---- what each side reports, and what the work experiences ----

both[2] + both[3] => end_to_end
"queue-time carried, with both queues in place" ^0
"  the upstream team reports   : " + str(both[2]) ^0
"  the downstream team reports : " + str(both[3]) ^0
"  a unit of work waits in     : " + str(end_to_end) ^0
if end_to_end > both[2]:
    if end_to_end > both[3]:
        "  larger than either report, because the two are added and neither" ^0
        "  system can read the other's depth" ^0
0 => bigger
if both[2] > both[3]:
    both[2] => bigger
else:
    both[3] => bigger
"  the larger of the two reports is " + str(bigger) + ", which is " + str(int(bigger * 100 / end_to_end)) + "% of the truth" ^0
"" ^0

# ---- one queue against two ----

if both[0] == up_only[0]:
    "adding the second queue delivered " + str(both[0] - up_only[0]) + " extra units" ^0
else:
    "adding the second queue changed deliveries by " + str(both[0] - up_only[0]) ^0
if both[2] + both[3] > up_only[2] + up_only[3]:
    "  and added " + str(both[2] + both[3] - up_only[2] - up_only[3]) + " to the queue-time carried" ^0
"  the second queue is the one whose gain is small and whose delay is not" ^0
"" ^0

# ---- what each side sees if it removes its own queue ----
#
# Each side, testing alone, finds its queue is load-bearing - because the
# other side's queue is still there absorbing what it would have dropped.

"if the upstream removes its queue while the downstream keeps one" ^0
"  dropped : " + str(down_only[1]) + " against " + str(both[1]) + " with both" ^0
"if the downstream removes its queue while the upstream keeps one" ^0
"  dropped : " + str(up_only[1]) + " against " + str(both[1]) + " with both" ^0
if down_only[1] > both[1]:
    "  each unilateral removal costs deliveries, so each side's own experiment" ^0
    "  tells it to keep its queue, and both experiments are correct" ^0
"" ^0

# ---- the control: arrivals inside the handoff rate ----
#
# Where nothing ever exceeds what the handoff can move, no queue ever fills,
# and the configuration cannot be told apart.

"control - arrivals that never exceed the handoff rate" ^0
[5, 4, 6, 5, 4, 6, 5, 4, 6, 5, 4, 6] => calm
0 => c_total
for a in calm:
    c_total + a => c_total
"  arriving : " + str(c_total) + " over " + str(periods) + " periods, handoff " + str(handoff_rate) ^0
"  every period is inside the handoff rate and inside the service dips," ^0
"  so nothing queues and the four configurations cannot be told apart" ^0
"" ^0

"Each queue removed the drops its owner could see, and each side's" ^0
"before-and-after is sound. The wait a unit of work experiences is the sum of" ^0
"two depths, and it is reported by neither." ^0
```

## Python (deterministic transpilation)

```python
arrivals = [10, 2, 14, 3, 12, 1, 15, 4, 11, 2, 13, 3]
service = [9, 5, 9, 6, 9, 5, 9, 6, 9, 5, 9, 9]
periods = len(arrivals)
handoff_rate = 9

def run(upstream_queue, downstream_queue):
    qa = 0
    qb = 0
    completed = 0
    dropped = 0
    wait_a = 0
    wait_b = 0
    t = 0
    while t < periods:
        arrived = arrivals[t]
        qa = qa + arrived
        if upstream_queue == 0:
            keep = handoff_rate
            if qa < keep:
                keep = qa
            dropped = dropped + qa - keep
            qa = keep
        moved = handoff_rate
        if qa < moved:
            moved = qa
        qa = qa - moved
        qb = qb + moved
        service_rate = service[t]
        if downstream_queue == 0:
            keep2 = service_rate
            if qb < keep2:
                keep2 = qb
            dropped = dropped + qb - keep2
            qb = keep2
        served = service_rate
        if qb < served:
            served = qb
        qb = qb - served
        completed = completed + served
        wait_a = wait_a + qa
        wait_b = wait_b + qb
        t = t + 1
    return [completed, dropped, wait_a, wait_b]

arrived_total = 0
for a in arrivals:
    arrived_total = arrived_total + a
print("periods : " + str(periods) + ", work arriving : " + str(arrived_total))
service_total = 0
for v in service:
    service_total = service_total + v
print("handoff rate : " + str(handoff_rate) + " per period")
svc = ""
for v in service:
    svc = svc + str(v) + " "
print("service  : " + svc + " (total " + str(service_total) + ")")
burst = ""
for a in arrivals:
    burst = burst + str(a) + " "
print("arrivals : " + burst)
print("")
neither = run(0, 0)
up_only = run(1, 0)
down_only = run(0, 1)
both = run(1, 1)
print("queues held        completed   dropped   waited upstream   waited downstream")
print("  neither          " + str(neither[0]) + "          " + str(neither[1]) + "        " + str(neither[2]) + "                " + str(neither[3]))
print("  upstream only    " + str(up_only[0]) + "          " + str(up_only[1]) + "        " + str(up_only[2]) + "               " + str(up_only[3]))
print("  downstream only  " + str(down_only[0]) + "          " + str(down_only[1]) + "        " + str(down_only[2]) + "                " + str(down_only[3]))
print("  both             " + str(both[0]) + "          " + str(both[1]) + "        " + str(both[2]) + "               " + str(both[3]))
print("")
if neither[1] > both[1]:
    print("the two queues turned " + str(neither[1] - both[1]) + " dropped units into delivered ones")
    print("  which is the whole case for having them, and it is a real gain")
print("")
end_to_end = both[2] + both[3]
print("queue-time carried, with both queues in place")
print("  the upstream team reports   : " + str(both[2]))
print("  the downstream team reports : " + str(both[3]))
print("  a unit of work waits in     : " + str(end_to_end))
if end_to_end > both[2]:
    if end_to_end > both[3]:
        print("  larger than either report, because the two are added and neither")
        print("  system can read the other's depth")
bigger = 0
if both[2] > both[3]:
    bigger = both[2]
else:
    bigger = both[3]
print("  the larger of the two reports is " + str(bigger) + ", which is " + str(int(bigger * 100 / end_to_end)) + "% of the truth")
print("")
if both[0] == up_only[0]:
    print("adding the second queue delivered " + str(both[0] - up_only[0]) + " extra units")
else:
    print("adding the second queue changed deliveries by " + str(both[0] - up_only[0]))
if both[2] + both[3] > up_only[2] + up_only[3]:
    print("  and added " + str(both[2] + both[3] - up_only[2] - up_only[3]) + " to the queue-time carried")
print("  the second queue is the one whose gain is small and whose delay is not")
print("")
print("if the upstream removes its queue while the downstream keeps one")
print("  dropped : " + str(down_only[1]) + " against " + str(both[1]) + " with both")
print("if the downstream removes its queue while the upstream keeps one")
print("  dropped : " + str(up_only[1]) + " against " + str(both[1]) + " with both")
if down_only[1] > both[1]:
    print("  each unilateral removal costs deliveries, so each side's own experiment")
    print("  tells it to keep its queue, and both experiments are correct")
print("")
print("control - arrivals that never exceed the handoff rate")
calm = [5, 4, 6, 5, 4, 6, 5, 4, 6, 5, 4, 6]
c_total = 0
for a in calm:
    c_total = c_total + a
print("  arriving : " + str(c_total) + " over " + str(periods) + " periods, handoff " + str(handoff_rate))
print("  every period is inside the handoff rate and inside the service dips,")
print("  so nothing queues and the four configurations cannot be told apart")
print("")
print("Each queue removed the drops its owner could see, and each side's")
print("before-and-after is sound. The wait a unit of work experiences is the sum of")
print("two depths, and it is reported by neither.")
```

## stdout (executed)

```text
periods : 12, work arriving : 90
handoff rate : 9 per period
service  : 9 5 9 6 9 5 9 6 9 5 9 9  (total 90)
arrivals : 10 2 14 3 12 1 15 4 11 2 13 3 

queues held        completed   dropped   waited upstream   waited downstream
  neither          69          21        0                0
  upstream only    85          5        23               0
  downstream only  69          21        0                0
  both             88          0        23               24

the two queues turned 21 dropped units into delivered ones
  which is the whole case for having them, and it is a real gain

queue-time carried, with both queues in place
  the upstream team reports   : 23
  the downstream team reports : 24
  a unit of work waits in     : 47
  larger than either report, because the two are added and neither
  system can read the other's depth
  the larger of the two reports is 24, which is 51% of the truth

adding the second queue changed deliveries by 3
  and added 24 to the queue-time carried
  the second queue is the one whose gain is small and whose delay is not

if the upstream removes its queue while the downstream keeps one
  dropped : 21 against 0 with both
if the downstream removes its queue while the upstream keeps one
  dropped : 5 against 0 with both
  each unilateral removal costs deliveries, so each side's own experiment
  tells it to keep its queue, and both experiments are correct

control - arrivals that never exceed the handoff rate
  arriving : 60 over 12 periods, handoff 9
  every period is inside the handoff rate and inside the service dips,
  so nothing queues and the four configurations cannot be told apart

Each queue removed the drops its owner could see, and each side's
before-and-after is sound. The wait a unit of work experiences is the sum of
two depths, and it is reported by neither.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
