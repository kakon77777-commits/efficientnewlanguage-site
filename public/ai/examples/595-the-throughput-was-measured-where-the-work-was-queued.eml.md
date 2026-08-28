<!-- canonical: efficientnewlanguage.org/ai/examples/595-the-throughput-was-measured-where-the-work-was-queued | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 595 — The throughput was measured where the work was queued

`the_throughput_was_measured_where_the_work_was_queued.eml` - The throughput graph has read a steady 1200 per second all shift. What the system finished in that shift is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The throughput
# graph has read a steady 1200 per second all shift. What the system finished in
# that shift is computed below.
#
# Instrumenting at the ingress is the right place to start and the reasons are
# good. It is one point in the code rather than one per worker, it cannot be
# skipped by a worker that crashes before reporting, it needs no coordination
# between processes, and it is the only place where a request is guaranteed to
# exist exactly once. Everything about the counter's placement is defensible.
#
# What it counts is arrivals. A request that is accepted has not been done; it
# has been promised. When the consumer keeps up, the two rates are equal and
# the distinction has no consequence, which is why it survived design review.
#
# The distinction becomes the entire story exactly when the consumer stops
# keeping up, which is the situation the graph exists to reveal.

1200 => accepted_per_second
900 => completed_per_second
8 => shift_hours

accepted_per_second - completed_per_second => backlog_per_second
shift_hours * 3600 => shift_seconds

"accepted per second  : " + str(accepted_per_second) + "   <- this is the throughput graph" ^0
"completed per second : " + str(completed_per_second) ^0
"backlog per second   : " + str(backlog_per_second) ^0
"" ^0

shift_seconds * accepted_per_second => accepted_total
shift_seconds * completed_per_second => completed_total
shift_seconds * backlog_per_second => backlog_total

"over one " + str(shift_hours) + "-hour shift" ^0
"  accepted  : " + str(accepted_total) ^0
"  completed : " + str(completed_total) ^0
"  waiting   : " + str(backlog_total) ^0
"" ^0
"  the graph is flat at " + str(accepted_per_second) + " for the whole shift" ^0
"  it is flat because arrivals are steady, which they are" ^0
"" ^0

# ---- what the graph would look like if it counted completions ----

"hour   accepted   completed   backlog after" ^0
0 => running_backlog
for h in [1:8]:
    3600 * accepted_per_second => acc_h
    3600 * completed_per_second => done_h
    running_backlog + (acc_h - done_h) => running_backlog
    if h % 2 == 0:
        "  " + str(h) + "      " + str(acc_h) + "    " + str(done_h) + "     " + str(running_backlog) ^0
"" ^0
"  the accepted column is constant and the backlog column is not" ^0
"  only one of them is on a dashboard" ^0
"" ^0

# ---- how long the backlog takes to clear ----
#
# It clears only while arrivals are below capacity. At the shift's own rate it
# never clears, and the queue depth at the end of the shift is the debt carried
# into the next one.

500 => overnight_arrival_rate

completed_per_second - overnight_arrival_rate => drain_per_second
int(backlog_total / drain_per_second) => seconds_to_drain

"clearing the backlog after the shift" ^0
"  overnight arrival rate : " + str(overnight_arrival_rate) + " per second" ^0
"  drain rate             : " + str(drain_per_second) + " per second" ^0
"  backlog to clear       : " + str(backlog_total) ^0
"  seconds to clear       : " + str(seconds_to_drain) ^0
"  hours to clear         : " + str(int(seconds_to_drain / 3600)) ^0
"  the next shift starts before it finishes" ^0
"" ^0

# ---- what each placement can and cannot see ----

"counter placement   what it measures   what it misses" ^0
"  at ingress          arrivals           whether the work was done" ^0
"  at egress           completions        requests that never reach a worker" ^0
"  both                everything         nothing, and the difference IS the" ^0
"                                         quantity that matters" ^0
"" ^0
"  the difference needs two counters and one subtraction" ^0
"  neither counter alone can produce it, which is why one counter was enough" ^0
"  for as long as the two were equal" ^0
"" ^0

# ---- the control ----
#
# The ingress counter, judged against arrivals. It has never missed a request,
# never double-counted, and never gone stale. It is a correct measurement of
# exactly what it names.

"control - is the ingress counter accurate" ^0
"  requests that arrived : " + str(accepted_total) ^0
"  requests it counted   : " + str(accepted_total) ^0
"  missed                : 0" ^0
"  double-counted        : 0" ^0
"  errors in the counter : 0" ^0
"  it measures arrivals exactly, and its label says throughput" ^0
"" ^0

# ---- the null control ----
#
# The same counter in the same place when the consumer keeps up. Arrivals equal
# completions, the graph is a true throughput graph, and its placement costs
# nothing. The design is right for the regime it was designed in.

1200 => nc_completed_per_second

"null control - the same counter when the consumer keeps up" ^0
"  accepted per second  : " + str(accepted_per_second) ^0
"  completed per second : " + str(nc_completed_per_second) ^0
"  backlog per second   : " + str(accepted_per_second - nc_completed_per_second) ^0
"  graph reads          : " + str(accepted_per_second) + ", and it is true" ^0
"  same counter, same placement, same label" ^0
"  the label becomes false exactly when the two rates separate, which is" ^0
"  the only time anyone reads the graph carefully" ^0
"" ^0

# ---- the rule ----

"a rate measured at the front of a pipeline" ^0
"  equals the completion rate      while nothing accumulates" ^0
"  exceeds it                      while something does" ^0
"  never falls below it            over any interval" ^0
"  so it is an upper bound reported as a measurement" ^0
"  and it is highest exactly when the system is worst" ^0
"" ^0
"a queue depth graph beside it would have told the whole story," ^0
"and a queue depth is not a rate, so it did not belong to the same panel" ^0
"" ^0

"Counting at the ingress needs one instrumentation point instead of one per" ^0
"worker, cannot be skipped by a worker that dies, and sees every request exactly" ^0
"once - all true. It counts arrivals. Over one shift " + str(accepted_total) + " arrived and" ^0
str(completed_total) + " finished, leaving " + str(backlog_total) + " waiting and " + str(int(seconds_to_drain / 3600)) + " hours of drain that the" ^0
"next shift starts on top of, while the graph held flat at " + str(accepted_per_second) + " throughout." ^0
```

## Python (deterministic transpilation)

```python
accepted_per_second = 1200
completed_per_second = 900
shift_hours = 8
backlog_per_second = accepted_per_second - completed_per_second
shift_seconds = shift_hours * 3600
print("accepted per second  : " + str(accepted_per_second) + "   <- this is the throughput graph")
print("completed per second : " + str(completed_per_second))
print("backlog per second   : " + str(backlog_per_second))
print("")
accepted_total = shift_seconds * accepted_per_second
completed_total = shift_seconds * completed_per_second
backlog_total = shift_seconds * backlog_per_second
print("over one " + str(shift_hours) + "-hour shift")
print("  accepted  : " + str(accepted_total))
print("  completed : " + str(completed_total))
print("  waiting   : " + str(backlog_total))
print("")
print("  the graph is flat at " + str(accepted_per_second) + " for the whole shift")
print("  it is flat because arrivals are steady, which they are")
print("")
print("hour   accepted   completed   backlog after")
running_backlog = 0
for h in range(1, 9):
    acc_h = 3600 * accepted_per_second
    done_h = 3600 * completed_per_second
    running_backlog = running_backlog + (acc_h - done_h)
    if h % 2 == 0:
        print("  " + str(h) + "      " + str(acc_h) + "    " + str(done_h) + "     " + str(running_backlog))
print("")
print("  the accepted column is constant and the backlog column is not")
print("  only one of them is on a dashboard")
print("")
overnight_arrival_rate = 500
drain_per_second = completed_per_second - overnight_arrival_rate
seconds_to_drain = int(backlog_total / drain_per_second)
print("clearing the backlog after the shift")
print("  overnight arrival rate : " + str(overnight_arrival_rate) + " per second")
print("  drain rate             : " + str(drain_per_second) + " per second")
print("  backlog to clear       : " + str(backlog_total))
print("  seconds to clear       : " + str(seconds_to_drain))
print("  hours to clear         : " + str(int(seconds_to_drain / 3600)))
print("  the next shift starts before it finishes")
print("")
print("counter placement   what it measures   what it misses")
print("  at ingress          arrivals           whether the work was done")
print("  at egress           completions        requests that never reach a worker")
print("  both                everything         nothing, and the difference IS the")
print("                                         quantity that matters")
print("")
print("  the difference needs two counters and one subtraction")
print("  neither counter alone can produce it, which is why one counter was enough")
print("  for as long as the two were equal")
print("")
print("control - is the ingress counter accurate")
print("  requests that arrived : " + str(accepted_total))
print("  requests it counted   : " + str(accepted_total))
print("  missed                : 0")
print("  double-counted        : 0")
print("  errors in the counter : 0")
print("  it measures arrivals exactly, and its label says throughput")
print("")
nc_completed_per_second = 1200
print("null control - the same counter when the consumer keeps up")
print("  accepted per second  : " + str(accepted_per_second))
print("  completed per second : " + str(nc_completed_per_second))
print("  backlog per second   : " + str(accepted_per_second - nc_completed_per_second))
print("  graph reads          : " + str(accepted_per_second) + ", and it is true")
print("  same counter, same placement, same label")
print("  the label becomes false exactly when the two rates separate, which is")
print("  the only time anyone reads the graph carefully")
print("")
print("a rate measured at the front of a pipeline")
print("  equals the completion rate      while nothing accumulates")
print("  exceeds it                      while something does")
print("  never falls below it            over any interval")
print("  so it is an upper bound reported as a measurement")
print("  and it is highest exactly when the system is worst")
print("")
print("a queue depth graph beside it would have told the whole story,")
print("and a queue depth is not a rate, so it did not belong to the same panel")
print("")
print("Counting at the ingress needs one instrumentation point instead of one per")
print("worker, cannot be skipped by a worker that dies, and sees every request exactly")
print("once - all true. It counts arrivals. Over one shift " + str(accepted_total) + " arrived and")
print(str(completed_total) + " finished, leaving " + str(backlog_total) + " waiting and " + str(int(seconds_to_drain / 3600)) + " hours of drain that the")
print("next shift starts on top of, while the graph held flat at " + str(accepted_per_second) + " throughout.")
```

## stdout (executed)

```text
accepted per second  : 1200   <- this is the throughput graph
completed per second : 900
backlog per second   : 300

over one 8-hour shift
  accepted  : 34560000
  completed : 25920000
  waiting   : 8640000

  the graph is flat at 1200 for the whole shift
  it is flat because arrivals are steady, which they are

hour   accepted   completed   backlog after
  2      4320000    3240000     2160000
  4      4320000    3240000     4320000
  6      4320000    3240000     6480000
  8      4320000    3240000     8640000

  the accepted column is constant and the backlog column is not
  only one of them is on a dashboard

clearing the backlog after the shift
  overnight arrival rate : 500 per second
  drain rate             : 400 per second
  backlog to clear       : 8640000
  seconds to clear       : 21600
  hours to clear         : 6
  the next shift starts before it finishes

counter placement   what it measures   what it misses
  at ingress          arrivals           whether the work was done
  at egress           completions        requests that never reach a worker
  both                everything         nothing, and the difference IS the
                                         quantity that matters

  the difference needs two counters and one subtraction
  neither counter alone can produce it, which is why one counter was enough
  for as long as the two were equal

control - is the ingress counter accurate
  requests that arrived : 34560000
  requests it counted   : 34560000
  missed                : 0
  double-counted        : 0
  errors in the counter : 0
  it measures arrivals exactly, and its label says throughput

null control - the same counter when the consumer keeps up
  accepted per second  : 1200
  completed per second : 1200
  backlog per second   : 0
  graph reads          : 1200, and it is true
  same counter, same placement, same label
  the label becomes false exactly when the two rates separate, which is
  the only time anyone reads the graph carefully

a rate measured at the front of a pipeline
  equals the completion rate      while nothing accumulates
  exceeds it                      while something does
  never falls below it            over any interval
  so it is an upper bound reported as a measurement
  and it is highest exactly when the system is worst

a queue depth graph beside it would have told the whole story,
and a queue depth is not a rate, so it did not belong to the same panel

Counting at the ingress needs one instrumentation point instead of one per
worker, cannot be skipped by a worker that dies, and sees every request exactly
once - all true. It counts arrivals. Over one shift 34560000 arrived and
25920000 finished, leaving 8640000 waiting and 6 hours of drain that the
next shift starts on top of, while the graph held flat at 1200 throughout.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
