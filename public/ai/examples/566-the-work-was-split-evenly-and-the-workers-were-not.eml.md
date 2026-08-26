<!-- canonical: efficientnewlanguage.org/ai/examples/566-the-work-was-split-evenly-and-the-workers-were-not | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 566 — The work was split evenly and the workers were not

`the_work_was_split_evenly_and_the_workers_were_not.eml` - A batch of 2400 documents is split across 8 workers. Every worker gets exactly 300. How long the batch takes, and how long the report says it takes, are computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A batch of 2400
# documents is split across 8 workers. Every worker gets exactly 300. How long
# the batch takes, and how long the report says it takes, are computed below.
#
# An equal split is the right default and was chosen deliberately. It is the
# only allocation that needs no information about the workers, so it cannot go
# stale when a machine is replaced, it cannot be gamed, it is one line of code,
# and it is defensible to anyone who asks why they got the share they got. Every
# scheduler that has to run before it knows anything starts here.
#
# The fleet is not uniform. Four machines are current generation, two are a
# generation behind, one is the old box nobody has decommissioned, and one is a
# VM on shared hardware. Nobody chose this; it accumulated.
#
# A batch is not finished when the average worker is finished. It is finished
# when the last worker is finished. An equal split across unequal workers
# maximises the gap between those two numbers, because it gives the slowest
# machine exactly as much work as the fastest.

2400 => documents
8 => workers

# [worker, documents per minute]
[["w0", 100], ["w1", 100], ["w2", 100], ["w3", 100], ["w4", 60], ["w5", 60], ["w6", 40], ["w7", 25]] => fleet

int(documents / workers) => each

"documents: " + str(documents) + " split " + str(workers) + " ways = " + str(each) + " each" ^0
"" ^0

"worker   rate/min   assigned   seconds to finish" ^0
0 => makespan
0 => total_seconds
0 => capacity
for w in fleet:
    int(each * 60 / w[1]) => secs
    total_seconds + secs => total_seconds
    capacity + w[1] => capacity
    if secs > makespan:
        secs => makespan
    "  " + w[0] + "        " + str(w[1]) + "         " + str(each) + "         " + str(secs) ^0
"" ^0

int(total_seconds / workers) => mean_seconds

"  batch finishes when the LAST worker finishes : " + str(makespan) + " seconds" ^0
"  mean worker completion time                  : " + str(mean_seconds) + " seconds" ^0
"  the status page reported the mean" ^0
"" ^0

# ---- what the fleet could have done ----
#
# Allocation proportional to rate finishes every worker at the same moment,
# which is the shortest possible makespan for a fixed total.

int(documents * 60 / capacity) => ideal_seconds

"  fleet capacity                     : " + str(capacity) + " documents per minute" ^0
"  shortest possible batch time       : " + str(ideal_seconds) + " seconds" ^0
"  actual batch time                  : " + str(makespan) + " seconds" ^0
"  cost of the equal split            : " + str(makespan - ideal_seconds) + " seconds" ^0
"  that is " + str(int((makespan - ideal_seconds) * 100 / makespan)) + " percent of the wall clock" ^0
"" ^0

# ---- where the fleet was during those seconds ----

workers * makespan => worker_seconds_paid
worker_seconds_paid - total_seconds => idle_seconds

"  worker-seconds paid for   : " + str(worker_seconds_paid) ^0
"  worker-seconds working    : " + str(total_seconds) ^0
"  worker-seconds idle       : " + str(idle_seconds) ^0
"  utilisation               : " + str(int(total_seconds * 100 / worker_seconds_paid)) + " percent" ^0
"" ^0
"  the four fastest machines finished in " + str(int(each * 60 / 100)) + " seconds and waited " + str(makespan - int(each * 60 / 100)) + " more" ^0
"" ^0

# ---- the shape of the error ----

"quantity                      does the split shape it" ^0
"  documents processed         no, it is a sum" ^0
"  documents per worker        no, that is what was equalised" ^0
"  total worker-seconds        no, work is conserved" ^0
"  batch completion time       YES, it is a maximum" ^0
"  utilisation                 YES, it is a ratio against a maximum" ^0
"  the dashboard showed the first three" ^0
"" ^0
"a maximum is the only statistic an equal split gets wrong, and it is the" ^0
"only statistic the customer experiences" ^0
"" ^0

# ---- the control ----
#
# If the equal split were harming throughput, total documents would drop. It
# does not: every document is processed exactly once under any allocation. The
# allocation moves WHEN the work happens, never HOW MUCH. This is why the
# throughput graph looked fine for a year.

"control - a quantity no allocation can move" ^0
0 => done_equal
0 => shares_truncated
for w in fleet:
    done_equal + each => done_equal
    int(documents * w[1] / capacity) => share
    shares_truncated + share => shares_truncated
documents - shares_truncated => leftover
shares_truncated + leftover => done_proportional
"  documents completed, equal split      : " + str(done_equal) ^0
"  proportional shares before remainder  : " + str(shares_truncated) ^0
"  documents lost to truncation          : " + str(leftover) ^0
"  a real scheduler assigns the remainder, so it must hand out those " + str(leftover) ^0
"  documents completed, proportional     : " + str(done_proportional) ^0
"  difference                            : " + str(done_equal - done_proportional) ^0
"  work is conserved, so this cannot detect the problem" ^0
"" ^0

# ---- the null control ----
#
# A uniform fleet. Same equal split, same code path, and now the split is
# optimal. The split was never the defect on its own.

[["u0", 73], ["u1", 73], ["u2", 73], ["u3", 73], ["u4", 73], ["u5", 73], ["u6", 73], ["u7", 73]] => uniform_fleet

"null control - the same equal split across a uniform fleet" ^0
0 => u_makespan
0 => u_total
0 => u_capacity
for u in uniform_fleet:
    int(each * 60 / u[1]) => usecs
    u_total + usecs => u_total
    u_capacity + u[1] => u_capacity
    if usecs > u_makespan:
        usecs => u_makespan
"  batch time            : " + str(u_makespan) + " seconds" ^0
"  shortest possible     : " + str(int(documents * 60 / u_capacity)) + " seconds" ^0
"  cost of the split     : " + str(u_makespan - int(documents * 60 / u_capacity)) + " seconds" ^0
"  utilisation           : " + str(int(u_total * 100 / (workers * u_makespan))) + " percent" ^0
"  the same allocation is optimal here, so the rule is not 'equal is wrong'" ^0
"  it is 'equal is wrong exactly as far as the fleet is unequal'" ^0
"" ^0

"An equal split needs no information about the workers, which is what makes it" ^0
"safe to write and impossible to get stale. It is also what makes it assign the" ^0
"25-a-minute box the same 300 documents as the 100-a-minute box. The batch took" ^0
str(makespan) + " seconds against a possible " + str(ideal_seconds) + ", the fleet was idle for " + str(idle_seconds) ^0
"worker-seconds of the " + str(worker_seconds_paid) + " paid for, and every document was processed." ^0
```

## Python (deterministic transpilation)

```python
documents = 2400
workers = 8
fleet = [["w0", 100], ["w1", 100], ["w2", 100], ["w3", 100], ["w4", 60], ["w5", 60], ["w6", 40], ["w7", 25]]
each = int(documents / workers)
print("documents: " + str(documents) + " split " + str(workers) + " ways = " + str(each) + " each")
print("")
print("worker   rate/min   assigned   seconds to finish")
makespan = 0
total_seconds = 0
capacity = 0
for w in fleet:
    secs = int(each * 60 / w[1])
    total_seconds = total_seconds + secs
    capacity = capacity + w[1]
    if secs > makespan:
        makespan = secs
    print("  " + w[0] + "        " + str(w[1]) + "         " + str(each) + "         " + str(secs))
print("")
mean_seconds = int(total_seconds / workers)
print("  batch finishes when the LAST worker finishes : " + str(makespan) + " seconds")
print("  mean worker completion time                  : " + str(mean_seconds) + " seconds")
print("  the status page reported the mean")
print("")
ideal_seconds = int(documents * 60 / capacity)
print("  fleet capacity                     : " + str(capacity) + " documents per minute")
print("  shortest possible batch time       : " + str(ideal_seconds) + " seconds")
print("  actual batch time                  : " + str(makespan) + " seconds")
print("  cost of the equal split            : " + str(makespan - ideal_seconds) + " seconds")
print("  that is " + str(int((makespan - ideal_seconds) * 100 / makespan)) + " percent of the wall clock")
print("")
worker_seconds_paid = workers * makespan
idle_seconds = worker_seconds_paid - total_seconds
print("  worker-seconds paid for   : " + str(worker_seconds_paid))
print("  worker-seconds working    : " + str(total_seconds))
print("  worker-seconds idle       : " + str(idle_seconds))
print("  utilisation               : " + str(int(total_seconds * 100 / worker_seconds_paid)) + " percent")
print("")
print("  the four fastest machines finished in " + str(int(each * 60 / 100)) + " seconds and waited " + str(makespan - int(each * 60 / 100)) + " more")
print("")
print("quantity                      does the split shape it")
print("  documents processed         no, it is a sum")
print("  documents per worker        no, that is what was equalised")
print("  total worker-seconds        no, work is conserved")
print("  batch completion time       YES, it is a maximum")
print("  utilisation                 YES, it is a ratio against a maximum")
print("  the dashboard showed the first three")
print("")
print("a maximum is the only statistic an equal split gets wrong, and it is the")
print("only statistic the customer experiences")
print("")
print("control - a quantity no allocation can move")
done_equal = 0
shares_truncated = 0
for w in fleet:
    done_equal = done_equal + each
    share = int(documents * w[1] / capacity)
    shares_truncated = shares_truncated + share
leftover = documents - shares_truncated
done_proportional = shares_truncated + leftover
print("  documents completed, equal split      : " + str(done_equal))
print("  proportional shares before remainder  : " + str(shares_truncated))
print("  documents lost to truncation          : " + str(leftover))
print("  a real scheduler assigns the remainder, so it must hand out those " + str(leftover))
print("  documents completed, proportional     : " + str(done_proportional))
print("  difference                            : " + str(done_equal - done_proportional))
print("  work is conserved, so this cannot detect the problem")
print("")
uniform_fleet = [["u0", 73], ["u1", 73], ["u2", 73], ["u3", 73], ["u4", 73], ["u5", 73], ["u6", 73], ["u7", 73]]
print("null control - the same equal split across a uniform fleet")
u_makespan = 0
u_total = 0
u_capacity = 0
for u in uniform_fleet:
    usecs = int(each * 60 / u[1])
    u_total = u_total + usecs
    u_capacity = u_capacity + u[1]
    if usecs > u_makespan:
        u_makespan = usecs
print("  batch time            : " + str(u_makespan) + " seconds")
print("  shortest possible     : " + str(int(documents * 60 / u_capacity)) + " seconds")
print("  cost of the split     : " + str(u_makespan - int(documents * 60 / u_capacity)) + " seconds")
print("  utilisation           : " + str(int(u_total * 100 / (workers * u_makespan))) + " percent")
print("  the same allocation is optimal here, so the rule is not 'equal is wrong'")
print("  it is 'equal is wrong exactly as far as the fleet is unequal'")
print("")
print("An equal split needs no information about the workers, which is what makes it")
print("safe to write and impossible to get stale. It is also what makes it assign the")
print("25-a-minute box the same 300 documents as the 100-a-minute box. The batch took")
print(str(makespan) + " seconds against a possible " + str(ideal_seconds) + ", the fleet was idle for " + str(idle_seconds))
print("worker-seconds of the " + str(worker_seconds_paid) + " paid for, and every document was processed.")
```

## stdout (executed)

```text
documents: 2400 split 8 ways = 300 each

worker   rate/min   assigned   seconds to finish
  w0        100         300         180
  w1        100         300         180
  w2        100         300         180
  w3        100         300         180
  w4        60         300         300
  w5        60         300         300
  w6        40         300         450
  w7        25         300         720

  batch finishes when the LAST worker finishes : 720 seconds
  mean worker completion time                  : 311 seconds
  the status page reported the mean

  fleet capacity                     : 585 documents per minute
  shortest possible batch time       : 246 seconds
  actual batch time                  : 720 seconds
  cost of the equal split            : 474 seconds
  that is 65 percent of the wall clock

  worker-seconds paid for   : 5760
  worker-seconds working    : 2490
  worker-seconds idle       : 3270
  utilisation               : 43 percent

  the four fastest machines finished in 180 seconds and waited 540 more

quantity                      does the split shape it
  documents processed         no, it is a sum
  documents per worker        no, that is what was equalised
  total worker-seconds        no, work is conserved
  batch completion time       YES, it is a maximum
  utilisation                 YES, it is a ratio against a maximum
  the dashboard showed the first three

a maximum is the only statistic an equal split gets wrong, and it is the
only statistic the customer experiences

control - a quantity no allocation can move
  documents completed, equal split      : 2400
  proportional shares before remainder  : 2398
  documents lost to truncation          : 2
  a real scheduler assigns the remainder, so it must hand out those 2
  documents completed, proportional     : 2400
  difference                            : 0
  work is conserved, so this cannot detect the problem

null control - the same equal split across a uniform fleet
  batch time            : 246 seconds
  shortest possible     : 246 seconds
  cost of the split     : 0 seconds
  utilisation           : 100 percent
  the same allocation is optimal here, so the rule is not 'equal is wrong'
  it is 'equal is wrong exactly as far as the fleet is unequal'

An equal split needs no information about the workers, which is what makes it
safe to write and impossible to get stale. It is also what makes it assign the
25-a-minute box the same 300 documents as the 100-a-minute box. The batch took
720 seconds against a possible 246, the fleet was idle for 3270
worker-seconds of the 5760 paid for, and every document was processed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
