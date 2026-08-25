<!-- canonical: efficientnewlanguage.org/ai/examples/538-the-boost-was-a-loan-and-nobody-counted-the-lenders | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 538 — The boost was a loan and nobody counted the lenders

`the_boost_was_a_loan_and_nobody_counted_the_lenders.eml` - A low-priority task held a lock that a high-priority task needed, and medium-priority work ran ahead of both. Priority inheritance fixed it. What the fix cost over the following twelve weeks is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A low-priority
# task held a lock that a high-priority task needed, and medium-priority work
# ran ahead of both. Priority inheritance fixed it. What the fix cost over the
# following twelve weeks is computed below.
#
# Priority inheritance is the correct fix and it was applied correctly. When a
# task blocks on a lock, the holder is raised to the waiter's priority so it
# can finish and release. This is the textbook answer, it is what the
# literature recommends, and here it worked: the inversion was measured before
# and after, and afterwards there were none. That measurement is real and it
# stays true for every week below.
#
# A boost is a loan. It is taken out on behalf of a particular waiter and it is
# owed back when that waiter is gone. Giving it back means knowing when the
# last waiter has left, and knowing that means keeping a count. The
# implementation kept a flag, because a flag answers the question the acquire
# path asks - is this task boosted - and it was the acquire path that was being
# written.
#
# A flag can say boosted. It cannot say boosted on behalf of how many, so there
# is no moment at which it can say: not any more.

300 => tasks
6 => genuinely_high
18 => boosted_per_week
4 => service_ms
3 => medium_tasks_ahead
40 => medium_service_ms

medium_tasks_ahead * medium_service_ms => inversion_cost_ms

"the system" ^0
"  tasks                          : " + str(tasks) ^0
"  genuinely high priority        : " + str(genuinely_high) ^0
"  cost of the original inversion : " + str(inversion_cost_ms) + " ms, " + str(medium_tasks_ahead) + " medium tasks at " + str(medium_service_ms) + " ms" ^0
"" ^0

def boosted_after(week):
    week * boosted_per_week => n
    if n > tasks - genuinely_high:
        return tasks - genuinely_high
    return n

def top_priority_after(week):
    return genuinely_high + boosted_after(week)

def high_wait_after(week):
    return int((top_priority_after(week) - 1) / 2) * service_ms

# ---- twelve weeks after the fix ----

"week   permanently boosted   at top priority   high-priority wait ms   inversions" ^0
0 => crossover
for w in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]:
    high_wait_after(w) => wait
    if crossover == 0:
        if wait > inversion_cost_ms:
            w => crossover
    "  w" + str(w) + "     " + str(boosted_after(w)) + "                  " + str(top_priority_after(w)) + "               " + str(wait) + "                    0" ^0
"" ^0

# ---- the control ----
#
# The inversion counter is the measurement that justified the fix, and it is
# the measurement the team kept watching. It is correct. There are no
# inversions, in week 1 and in week 12, because the holder is always boosted.

"control - the metric the fix was judged by" ^0
"  priority inversions before the fix : " + str(medium_tasks_ahead) + " per contended acquire" ^0
"  priority inversions in week 1      : 0" ^0
"  priority inversions in week 12     : 0" ^0
"  the fix works, and it goes on working while everything below happens" ^0
"" ^0

# ---- the second control ----
#
# If priorities were drifting for some general reason, a task that never
# touches a contended lock would drift too.

"control - a task that never takes a contended lock" ^0
"  priority in week 1  : low" ^0
"  priority in week 12 : low" ^0
"  so this is not drift, it is the lock path and only the lock path" ^0
"" ^0

# ---- what happened to the high-priority tasks ----

high_wait_after(1) => wait_first
high_wait_after(12) => wait_last

"the tasks the priority system exists for" ^0
"  wait before the fix : " + str(inversion_cost_ms) + " ms" ^0
"  wait in week 1      : " + str(wait_first) + " ms" ^0
"  wait in week 12     : " + str(wait_last) + " ms" ^0
"  the fix was better than the inversion until week " + str(crossover) ^0
"  after week " + str(crossover) + " it is worse than the problem it removed" ^0
"  and it is worse by " + str(wait_last - inversion_cost_ms) + " ms by week 12" ^0
"" ^0

"what priority means at each end" ^0
"  week 1  : " + str(top_priority_after(1)) + " of " + str(tasks) + " tasks at top priority, " + str(int(top_priority_after(1) * 100 / tasks)) + " percent" ^0
"  week 12 : " + str(top_priority_after(12)) + " of " + str(tasks) + " tasks at top priority, " + str(int(top_priority_after(12) * 100 / tasks)) + " percent" ^0
"  a priority that " + str(int(top_priority_after(12) * 100 / tasks)) + " percent of tasks hold does not order anything," ^0
"  so the scheduler is running arrival order with extra steps" ^0
"" ^0

# ---- what a count would have cost ----

"flag against count" ^0
"  flag  : one bit, answers is this task boosted, which is what acquire asks" ^0
"  count : one integer, answers how many waiters, which is what release asks" ^0
"  the release path was written second and reused the field it found" ^0
"  tasks that would be at top priority in week 12 with a count : " + str(genuinely_high) ^0
"  tasks at top priority in week 12 with a flag                : " + str(top_priority_after(12)) ^0
"" ^0

# ---- what nobody was watching ----

"quantities on the dashboard" ^0
"  priority inversions per hour : yes, and it reads 0" ^0
"  lock wait time               : yes, and it improved" ^0
"  tasks currently boosted      : no such metric exists" ^0
"  the number that was rising is the one the system had no name for" ^0
"" ^0

"Priority inheritance is the right fix, it was applied correctly, and the" ^0
"inversion count has been 0 every week since. A boost is owed back to a" ^0
"specific waiter, and a flag cannot say how many, so " + str(boosted_after(12)) + " tasks now hold a" ^0
"priority they borrowed: high-priority work waits " + str(wait_last) + " ms against " + str(inversion_cost_ms) + " ms before." ^0
```

## Python (deterministic transpilation)

```python
tasks = 300
genuinely_high = 6
boosted_per_week = 18
service_ms = 4
medium_tasks_ahead = 3
medium_service_ms = 40
inversion_cost_ms = medium_tasks_ahead * medium_service_ms
print("the system")
print("  tasks                          : " + str(tasks))
print("  genuinely high priority        : " + str(genuinely_high))
print("  cost of the original inversion : " + str(inversion_cost_ms) + " ms, " + str(medium_tasks_ahead) + " medium tasks at " + str(medium_service_ms) + " ms")
print("")

def boosted_after(week):
    n = week * boosted_per_week
    if n > tasks - genuinely_high:
        return tasks - genuinely_high
    return n

def top_priority_after(week):
    return genuinely_high + boosted_after(week)

def high_wait_after(week):
    return int((top_priority_after(week) - 1) / 2) * service_ms

print("week   permanently boosted   at top priority   high-priority wait ms   inversions")
crossover = 0
for w in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]:
    wait = high_wait_after(w)
    if crossover == 0:
        if wait > inversion_cost_ms:
            crossover = w
    print("  w" + str(w) + "     " + str(boosted_after(w)) + "                  " + str(top_priority_after(w)) + "               " + str(wait) + "                    0")
print("")
print("control - the metric the fix was judged by")
print("  priority inversions before the fix : " + str(medium_tasks_ahead) + " per contended acquire")
print("  priority inversions in week 1      : 0")
print("  priority inversions in week 12     : 0")
print("  the fix works, and it goes on working while everything below happens")
print("")
print("control - a task that never takes a contended lock")
print("  priority in week 1  : low")
print("  priority in week 12 : low")
print("  so this is not drift, it is the lock path and only the lock path")
print("")
wait_first = high_wait_after(1)
wait_last = high_wait_after(12)
print("the tasks the priority system exists for")
print("  wait before the fix : " + str(inversion_cost_ms) + " ms")
print("  wait in week 1      : " + str(wait_first) + " ms")
print("  wait in week 12     : " + str(wait_last) + " ms")
print("  the fix was better than the inversion until week " + str(crossover))
print("  after week " + str(crossover) + " it is worse than the problem it removed")
print("  and it is worse by " + str(wait_last - inversion_cost_ms) + " ms by week 12")
print("")
print("what priority means at each end")
print("  week 1  : " + str(top_priority_after(1)) + " of " + str(tasks) + " tasks at top priority, " + str(int(top_priority_after(1) * 100 / tasks)) + " percent")
print("  week 12 : " + str(top_priority_after(12)) + " of " + str(tasks) + " tasks at top priority, " + str(int(top_priority_after(12) * 100 / tasks)) + " percent")
print("  a priority that " + str(int(top_priority_after(12) * 100 / tasks)) + " percent of tasks hold does not order anything,")
print("  so the scheduler is running arrival order with extra steps")
print("")
print("flag against count")
print("  flag  : one bit, answers is this task boosted, which is what acquire asks")
print("  count : one integer, answers how many waiters, which is what release asks")
print("  the release path was written second and reused the field it found")
print("  tasks that would be at top priority in week 12 with a count : " + str(genuinely_high))
print("  tasks at top priority in week 12 with a flag                : " + str(top_priority_after(12)))
print("")
print("quantities on the dashboard")
print("  priority inversions per hour : yes, and it reads 0")
print("  lock wait time               : yes, and it improved")
print("  tasks currently boosted      : no such metric exists")
print("  the number that was rising is the one the system had no name for")
print("")
print("Priority inheritance is the right fix, it was applied correctly, and the")
print("inversion count has been 0 every week since. A boost is owed back to a")
print("specific waiter, and a flag cannot say how many, so " + str(boosted_after(12)) + " tasks now hold a")
print("priority they borrowed: high-priority work waits " + str(wait_last) + " ms against " + str(inversion_cost_ms) + " ms before.")
```

## stdout (executed)

```text
the system
  tasks                          : 300
  genuinely high priority        : 6
  cost of the original inversion : 120 ms, 3 medium tasks at 40 ms

week   permanently boosted   at top priority   high-priority wait ms   inversions
  w1     18                  24               44                    0
  w2     36                  42               80                    0
  w3     54                  60               116                    0
  w4     72                  78               152                    0
  w5     90                  96               188                    0
  w6     108                  114               224                    0
  w7     126                  132               260                    0
  w8     144                  150               296                    0
  w9     162                  168               332                    0
  w10     180                  186               368                    0
  w11     198                  204               404                    0
  w12     216                  222               440                    0

control - the metric the fix was judged by
  priority inversions before the fix : 3 per contended acquire
  priority inversions in week 1      : 0
  priority inversions in week 12     : 0
  the fix works, and it goes on working while everything below happens

control - a task that never takes a contended lock
  priority in week 1  : low
  priority in week 12 : low
  so this is not drift, it is the lock path and only the lock path

the tasks the priority system exists for
  wait before the fix : 120 ms
  wait in week 1      : 44 ms
  wait in week 12     : 440 ms
  the fix was better than the inversion until week 4
  after week 4 it is worse than the problem it removed
  and it is worse by 320 ms by week 12

what priority means at each end
  week 1  : 24 of 300 tasks at top priority, 8 percent
  week 12 : 222 of 300 tasks at top priority, 74 percent
  a priority that 74 percent of tasks hold does not order anything,
  so the scheduler is running arrival order with extra steps

flag against count
  flag  : one bit, answers is this task boosted, which is what acquire asks
  count : one integer, answers how many waiters, which is what release asks
  the release path was written second and reused the field it found
  tasks that would be at top priority in week 12 with a count : 6
  tasks at top priority in week 12 with a flag                : 222

quantities on the dashboard
  priority inversions per hour : yes, and it reads 0
  lock wait time               : yes, and it improved
  tasks currently boosted      : no such metric exists
  the number that was rising is the one the system had no name for

Priority inheritance is the right fix, it was applied correctly, and the
inversion count has been 0 every week since. A boost is owed back to a
specific waiter, and a flag cannot say how many, so 216 tasks now hold a
priority they borrowed: high-priority work waits 440 ms against 120 ms before.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:def · eml:call · eml:return · eml:run:done
