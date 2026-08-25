<!-- canonical: efficientnewlanguage.org/ai/examples/542-the-counter-was-emptied-by-whoever-read-it-first | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 542 — The counter was emptied by whoever read it first

`the_counter_was_emptied_by_whoever_read_it_first.eml` - A counter that reports events since the last read, and a second collector added during a region migration. What each collector sees afterwards is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A counter that
# reports events since the last read, and a second collector added during a
# region migration. What each collector sees afterwards is computed below.
#
# A read-and-reset counter is a real design and a defensible one. The endpoint
# holds a small integer instead of a monotonic total that has to survive
# restarts, the collector does no subtraction and needs no memory of the
# previous value, and a missed scrape is visible as a larger number rather than
# invisible as a gap. Plenty of metrics protocols work exactly this way.
#
# Adding a second collector is the safest operation there is. It is a read. It
# takes no lock anyone can see, it changes no configuration on the instance,
# and it is how every other metric on the fleet is collected twice for
# redundancy. The migration runbook lists it under low risk and it belongs
# there for every metric except this one.
#
# A read that mutates is not a read. Two collectors on a normal counter both
# see the truth; two collectors on this one divide it, because the interval
# each of them measures is bounded by the other one's last visit rather than by
# its own.

100 => rate_per_s
30 => period_s
80 => alert_threshold

"true event rate    : " + str(rate_per_s) + " per second" ^0
"collector interval : " + str(period_s) + " seconds" ^0
"alert threshold    : " + str(alert_threshold) + " per second" ^0
"" ^0

# ---- the timeline with two collectors, offset by half a period ----

"the timeline, collectors A and B fifteen seconds apart" ^0
0 => last_read
for t in [15, 30, 45, 60, 75, 90]:
    "B" => who
    if t % period_s == 0:
        "A" => who
    (t - last_read) * rate_per_s => drained
    ("  t=%-4s %s reads, drains %s seconds of events, counter returns %s" % (str(t), who, str(t - last_read), str(drained)))^0
    t => last_read
"" ^0

# ---- what each collector reports, for one to four collectors ----

"collectors   seconds each read covers   events per read   reported rate   alert" ^0
for n in [1, 2, 3, 4]:
    int(period_s / n) => window
    window * rate_per_s => per_read
    int(per_read / period_s) => reported
    "silent" => fires
    if reported > alert_threshold:
        "fires" => fires
    ("  %-12s %-26s %-17s %-15s %s" % (str(n), str(window), str(per_read), str(reported), fires))^0
"" ^0

int(int(period_s / 2) * rate_per_s / period_s) => two_reported
("  with two collectors each reports %s per second against a true %s" % (str(two_reported), str(rate_per_s)))^0
("  the alert needs %s and the highest number anywhere in the system is %s" % (str(alert_threshold), str(two_reported)))^0
"" ^0

# ---- the control ----
#
# The same endpoint, the same two collectors, the same network. A gauge is
# read without being reset.

"control - a gauge on the same endpoint, read by the same two collectors" ^0
"  queue_depth reported by A : 412" ^0
"  queue_depth reported by B : 412" ^0
"  they agree, and they are right" ^0
"  so the endpoint, both collectors and the transport are all correct" ^0
"" ^0

"control - the same counter before the migration, one collector" ^0
("  seconds each read covers : %s" % str(period_s))^0
("  reported rate            : %s" % str(int(period_s * rate_per_s / period_s)))^0
("  true rate                : %s" % str(rate_per_s))^0
"  correct, for eleven months" ^0
"  so the counter is not wrong either, and nothing was edited" ^0
"" ^0

# ---- the aggregation that would fix it ----

"how to combine two collectors' readings" ^0
("  take either one    : %s, which is the rule for every other metric" % str(two_reported))^0
("  take the maximum   : %s, which is the rule for a counter that is not drained" % str(two_reported))^0
("  add them together  : %s, which is correct here and catastrophic anywhere else" % str(two_reported * 2))^0
"  the right aggregation for this metric is the one that is a bug for the" ^0
"  rest of them, and the collector cannot tell which kind it is holding" ^0
"" ^0

# ---- what the shape of the defect is ----

"why nothing looked broken" ^0
"  errors raised          : 0" ^0
"  scrapes failed         : 0" ^0
"  series missing         : 0" ^0
"  collectors disagreeing : 0, they both report the same wrong number" ^0
"  a disagreement would have been noticed within a day" ^0
"  agreement is what made it survive" ^0
"" ^0

"A read-and-reset counter is a real design and adding a second collector is" ^0
"a read. A read that resets is not one: each collector measures the interval" ^0
("since the other one's visit, so both report %s per second against a true %s," % (str(two_reported), str(rate_per_s)))^0
("they agree with each other, and the %s threshold is never crossed." % str(alert_threshold))^0
```

## Python (deterministic transpilation)

```python
rate_per_s = 100
period_s = 30
alert_threshold = 80
print("true event rate    : " + str(rate_per_s) + " per second")
print("collector interval : " + str(period_s) + " seconds")
print("alert threshold    : " + str(alert_threshold) + " per second")
print("")
print("the timeline, collectors A and B fifteen seconds apart")
last_read = 0
for t in [15, 30, 45, 60, 75, 90]:
    who = "B"
    if t % period_s == 0:
        who = "A"
    drained = (t - last_read) * rate_per_s
    print("  t=%-4s %s reads, drains %s seconds of events, counter returns %s" % (str(t), who, str(t - last_read), str(drained)))
    last_read = t
print("")
print("collectors   seconds each read covers   events per read   reported rate   alert")
for n in [1, 2, 3, 4]:
    window = int(period_s / n)
    per_read = window * rate_per_s
    reported = int(per_read / period_s)
    fires = "silent"
    if reported > alert_threshold:
        fires = "fires"
    print("  %-12s %-26s %-17s %-15s %s" % (str(n), str(window), str(per_read), str(reported), fires))
print("")
two_reported = int(int(period_s / 2) * rate_per_s / period_s)
print("  with two collectors each reports %s per second against a true %s" % (str(two_reported), str(rate_per_s)))
print("  the alert needs %s and the highest number anywhere in the system is %s" % (str(alert_threshold), str(two_reported)))
print("")
print("control - a gauge on the same endpoint, read by the same two collectors")
print("  queue_depth reported by A : 412")
print("  queue_depth reported by B : 412")
print("  they agree, and they are right")
print("  so the endpoint, both collectors and the transport are all correct")
print("")
print("control - the same counter before the migration, one collector")
print("  seconds each read covers : %s" % str(period_s))
print("  reported rate            : %s" % str(int(period_s * rate_per_s / period_s)))
print("  true rate                : %s" % str(rate_per_s))
print("  correct, for eleven months")
print("  so the counter is not wrong either, and nothing was edited")
print("")
print("how to combine two collectors' readings")
print("  take either one    : %s, which is the rule for every other metric" % str(two_reported))
print("  take the maximum   : %s, which is the rule for a counter that is not drained" % str(two_reported))
print("  add them together  : %s, which is correct here and catastrophic anywhere else" % str(two_reported * 2))
print("  the right aggregation for this metric is the one that is a bug for the")
print("  rest of them, and the collector cannot tell which kind it is holding")
print("")
print("why nothing looked broken")
print("  errors raised          : 0")
print("  scrapes failed         : 0")
print("  series missing         : 0")
print("  collectors disagreeing : 0, they both report the same wrong number")
print("  a disagreement would have been noticed within a day")
print("  agreement is what made it survive")
print("")
print("A read-and-reset counter is a real design and adding a second collector is")
print("a read. A read that resets is not one: each collector measures the interval")
print("since the other one's visit, so both report %s per second against a true %s," % (str(two_reported), str(rate_per_s)))
print("they agree with each other, and the %s threshold is never crossed." % str(alert_threshold))
```

## stdout (executed)

```text
true event rate    : 100 per second
collector interval : 30 seconds
alert threshold    : 80 per second

the timeline, collectors A and B fifteen seconds apart
  t=15   B reads, drains 15 seconds of events, counter returns 1500
  t=30   A reads, drains 15 seconds of events, counter returns 1500
  t=45   B reads, drains 15 seconds of events, counter returns 1500
  t=60   A reads, drains 15 seconds of events, counter returns 1500
  t=75   B reads, drains 15 seconds of events, counter returns 1500
  t=90   A reads, drains 15 seconds of events, counter returns 1500

collectors   seconds each read covers   events per read   reported rate   alert
  1            30                         3000              100             fires
  2            15                         1500              50              silent
  3            10                         1000              33              silent
  4            7                          700               23              silent

  with two collectors each reports 50 per second against a true 100
  the alert needs 80 and the highest number anywhere in the system is 50

control - a gauge on the same endpoint, read by the same two collectors
  queue_depth reported by A : 412
  queue_depth reported by B : 412
  they agree, and they are right
  so the endpoint, both collectors and the transport are all correct

control - the same counter before the migration, one collector
  seconds each read covers : 30
  reported rate            : 100
  true rate                : 100
  correct, for eleven months
  so the counter is not wrong either, and nothing was edited

how to combine two collectors' readings
  take either one    : 50, which is the rule for every other metric
  take the maximum   : 50, which is the rule for a counter that is not drained
  add them together  : 100, which is correct here and catastrophic anywhere else
  the right aggregation for this metric is the one that is a bug for the
  rest of them, and the collector cannot tell which kind it is holding

why nothing looked broken
  errors raised          : 0
  scrapes failed         : 0
  series missing         : 0
  collectors disagreeing : 0, they both report the same wrong number
  a disagreement would have been noticed within a day
  agreement is what made it survive

A read-and-reset counter is a real design and adding a second collector is
a read. A read that resets is not one: each collector measures the interval
since the other one's visit, so both report 50 per second against a true 100,
they agree with each other, and the 80 threshold is never crossed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
