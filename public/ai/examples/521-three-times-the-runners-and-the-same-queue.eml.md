<!-- canonical: efficientnewlanguage.org/ai/examples/521-three-times-the-runners-and-the-same-queue | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 521 — Three times the runners and the same queue

`three_times_the_runners_and_the_same_queue.eml` - CI runners went from 8 to 24 and the median wait is back where it started. What changed in between is computed below, and it is not the amount of code.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). CI runners went
# from 8 to 24 and the median wait is back where it started. What changed in
# between is computed below, and it is not the amount of code.
#
# Tripling the runners was correct. The wait was eleven minutes, engineers
# were batching unrelated changes into one push to avoid paying it twice, and
# that batching was making review harder and bisection worse. Buying runners
# to remove a queue that is distorting how people work is a good use of money,
# and the wait did drop to a minute immediately.
#
# Pushing is a decision and the cost of pushing was the queue. Removing the
# cost removed the reason to batch, so the same work now arrives as more,
# smaller pushes. That is the outcome the purchase was arguing for. It is also
# what consumes the capacity that produced it.
#
# The queue is measured, not modelled - it is the observed median from the CI
# logs, in the data below. Utilisation is computed from it.

# [month, runners, pushes/day, commits per 10 pushes, minutes per run, observed median queue]
[["Jan", 8, 210, 40, 17, 11], ["Feb", 8, 220, 40, 17, 13], ["Mar", 24, 225, 40, 17, 1], ["Apr", 24, 390, 22, 17, 3], ["May", 24, 560, 15, 17, 8], ["Jun", 24, 630, 14, 17, 12]] => months

len(months) => n
months[0] => first
months[n - 1] => last
480 => minutes_open

def utilisation(pushes, mins, runners):
    return int(pushes * mins * 100 / (runners * minutes_open))

"month   runners   pushes/day   commits/10 pushes   commits/day   queue min   utilisation" ^0
for m in months:
    "  " + m[0] + "     " + str(m[1]) + "        " + str(m[2]) + "          " + str(m[3]) + "              " + str(int(m[2] * m[3] / 10)) + "          " + str(m[5]) + "          " + str(utilisation(m[2], m[4], m[1])) + "%" ^0
"" ^0

"runners     : " + str(first[1]) + " -> " + str(last[1]) + ", multiplied by " + str(int(last[1] / first[1])) ^0
"pushes/day  : " + str(first[2]) + " -> " + str(last[2]) + ", " + str(int(last[2] * 100 / first[2])) + " per 100" ^0
"commits/day : " + str(int(first[2] * first[3] / 10)) + " -> " + str(int(last[2] * last[3] / 10)) + ", " + str(int(int(last[2] * last[3] / 10) * 100 / (int(first[2] * first[3] / 10)))) + " per 100" ^0
"queue       : " + str(first[5]) + " -> " + str(last[5]) + " minutes" ^0
"utilisation : " + str(utilisation(first[2], first[4], first[1])) + "% -> " + str(utilisation(last[2], last[4], last[1])) + "%" ^0
"" ^0

# ---- what grew and what did not ----

int((int(last[2] * last[3] / 10) - int(first[2] * first[3] / 10)) * 100 / (int(first[2] * first[3] / 10))) => commit_growth
int((last[2] - first[2]) * 100 / first[2]) => push_growth
"the two demand measures" ^0
for m in months:
    "  " + m[0] + " : " + str(m[2]) + " pushes carrying " + str(int(m[2] * m[3] / 10)) + " commits" ^0
"  pushes grew  : " + str(push_growth) + "%" ^0
"  commits grew : " + str(commit_growth) + "%" ^0
if commit_growth < push_growth:
    "  the work moved by " + str(commit_growth) + "% and the number of submissions by " + str(push_growth) + "%," ^0
    "  which is the batching coming apart rather than the team writing more" ^0
"" ^0

# ---- the batch size was a price signal ----

"commits per push against the queue in the same month" ^0
for m in months:
    "  " + m[0] + " : queue " + str(m[5]) + " min, batch " + str(m[3]) + " commits per 10 pushes" ^0
"  the batch falls as the queue falls and does not recover when it returns," ^0
"  because by then pushing small is the habit" ^0
"" ^0

# ---- what the smaller pushes bought ----

"what the change of shape is worth, and it is not nothing" ^0
"  commits per push : " + str(int(first[3] / 10)) + " -> " + str(int(last[3] * 10 / 100)) + " (" + str(last[3]) + " per 10 pushes)" ^0
"  a red run now implicates " + str(int(last[3] / 10)) + " commit rather than " + str(int(first[3] / 10)) ^0
"  commits a reviewer sees at once : " + str(int(first[3] / 10)) + " -> " + str(int(last[3] / 10)) ^0
"  this is exactly the improvement the purchase argued for, and it is real" ^0
"  and permanent, unlike the queue time" ^0
"" ^0

# ---- what it costs to hold ----

"runner-minutes" ^0
for m in months:
    "  " + m[0] + " : demand " + str(m[2] * m[4]) + ", capacity " + str(m[1] * minutes_open) ^0
"  " + last[0] + " utilisation : " + str(utilisation(last[2], last[4], last[1])) + "%" ^0
"  " + first[0] + " utilisation : " + str(utilisation(first[2], first[4], first[1])) + "%" ^0
"  three times the runners are running at close to the load the original" ^0
"  eight were running at" ^0
"" ^0

# ---- what the next request would cite ----

"if the queue is used as the trigger a second time" ^0
"  queue then : " + str(first[5]) + " minutes on " + str(first[1]) + " runners serving " + str(first[2]) + " pushes" ^0
"  queue now  : " + str(last[5]) + " minutes on " + str(last[1]) + " runners serving " + str(last[2]) + " pushes" ^0
"  the queue differs by " + str(first[5] - last[5]) + " minute and the system differs by " + str(last[1] - first[1]) + " runners" ^0
"  and " + str(last[2] - first[2]) + " pushes a day" ^0
"  a request citing only the queue cites a number that came back, from a" ^0
"  system that did not go back" ^0
"" ^0

# ---- the control: pushes that are not discretionary ----
#
# Where every run is a release cut on a fixed calendar, capacity cannot change
# the arrival rate, and the headroom stays where it was put.

[["Jan", 4, 20, 1, 22, 6], ["Jun", 12, 21, 1, 22, 0]] => scheduled
"control - a release repository cut on a fixed calendar" ^0
for s in scheduled:
    "  " + s[0] + " : " + str(s[1]) + " runners, " + str(s[2]) + " runs, queue " + str(s[5]) + " min, utilisation " + str(utilisation(s[2], s[4], s[1])) + "%" ^0
"  runs grew " + str(int((scheduled[1][2] - scheduled[0][2]) * 100 / scheduled[0][2])) + "% while runners grew " + str(int((scheduled[1][1] - scheduled[0][1]) * 100 / scheduled[0][1])) + "%" ^0
"  the arrival rate is set by the release calendar rather than by what it" ^0
"  costs to push, so the extra runners are still spare six months later" ^0
"" ^0

"Tripling the runners was right and the batching it removed was a real cost" ^0
"that has stayed removed. The queue was the price of pushing, so removing it" ^0
"changed how often people push: " + str(commit_growth) + "% more work in " + str(push_growth) + "% more runs." ^0
```

## Python (deterministic transpilation)

```python
months = [["Jan", 8, 210, 40, 17, 11], ["Feb", 8, 220, 40, 17, 13], ["Mar", 24, 225, 40, 17, 1], ["Apr", 24, 390, 22, 17, 3], ["May", 24, 560, 15, 17, 8], ["Jun", 24, 630, 14, 17, 12]]
n = len(months)
first = months[0]
last = months[n - 1]
minutes_open = 480

def utilisation(pushes, mins, runners):
    return int(pushes * mins * 100 / (runners * minutes_open))

print("month   runners   pushes/day   commits/10 pushes   commits/day   queue min   utilisation")
for m in months:
    print("  " + m[0] + "     " + str(m[1]) + "        " + str(m[2]) + "          " + str(m[3]) + "              " + str(int(m[2] * m[3] / 10)) + "          " + str(m[5]) + "          " + str(utilisation(m[2], m[4], m[1])) + "%")
print("")
print("runners     : " + str(first[1]) + " -> " + str(last[1]) + ", multiplied by " + str(int(last[1] / first[1])))
print("pushes/day  : " + str(first[2]) + " -> " + str(last[2]) + ", " + str(int(last[2] * 100 / first[2])) + " per 100")
print("commits/day : " + str(int(first[2] * first[3] / 10)) + " -> " + str(int(last[2] * last[3] / 10)) + ", " + str(int(int(last[2] * last[3] / 10) * 100 / int(first[2] * first[3] / 10))) + " per 100")
print("queue       : " + str(first[5]) + " -> " + str(last[5]) + " minutes")
print("utilisation : " + str(utilisation(first[2], first[4], first[1])) + "% -> " + str(utilisation(last[2], last[4], last[1])) + "%")
print("")
commit_growth = int((int(last[2] * last[3] / 10) - int(first[2] * first[3] / 10)) * 100 / int(first[2] * first[3] / 10))
push_growth = int((last[2] - first[2]) * 100 / first[2])
print("the two demand measures")
for m in months:
    print("  " + m[0] + " : " + str(m[2]) + " pushes carrying " + str(int(m[2] * m[3] / 10)) + " commits")
print("  pushes grew  : " + str(push_growth) + "%")
print("  commits grew : " + str(commit_growth) + "%")
if commit_growth < push_growth:
    print("  the work moved by " + str(commit_growth) + "% and the number of submissions by " + str(push_growth) + "%,")
    print("  which is the batching coming apart rather than the team writing more")
print("")
print("commits per push against the queue in the same month")
for m in months:
    print("  " + m[0] + " : queue " + str(m[5]) + " min, batch " + str(m[3]) + " commits per 10 pushes")
print("  the batch falls as the queue falls and does not recover when it returns,")
print("  because by then pushing small is the habit")
print("")
print("what the change of shape is worth, and it is not nothing")
print("  commits per push : " + str(int(first[3] / 10)) + " -> " + str(int(last[3] * 10 / 100)) + " (" + str(last[3]) + " per 10 pushes)")
print("  a red run now implicates " + str(int(last[3] / 10)) + " commit rather than " + str(int(first[3] / 10)))
print("  commits a reviewer sees at once : " + str(int(first[3] / 10)) + " -> " + str(int(last[3] / 10)))
print("  this is exactly the improvement the purchase argued for, and it is real")
print("  and permanent, unlike the queue time")
print("")
print("runner-minutes")
for m in months:
    print("  " + m[0] + " : demand " + str(m[2] * m[4]) + ", capacity " + str(m[1] * minutes_open))
print("  " + last[0] + " utilisation : " + str(utilisation(last[2], last[4], last[1])) + "%")
print("  " + first[0] + " utilisation : " + str(utilisation(first[2], first[4], first[1])) + "%")
print("  three times the runners are running at close to the load the original")
print("  eight were running at")
print("")
print("if the queue is used as the trigger a second time")
print("  queue then : " + str(first[5]) + " minutes on " + str(first[1]) + " runners serving " + str(first[2]) + " pushes")
print("  queue now  : " + str(last[5]) + " minutes on " + str(last[1]) + " runners serving " + str(last[2]) + " pushes")
print("  the queue differs by " + str(first[5] - last[5]) + " minute and the system differs by " + str(last[1] - first[1]) + " runners")
print("  and " + str(last[2] - first[2]) + " pushes a day")
print("  a request citing only the queue cites a number that came back, from a")
print("  system that did not go back")
print("")
scheduled = [["Jan", 4, 20, 1, 22, 6], ["Jun", 12, 21, 1, 22, 0]]
print("control - a release repository cut on a fixed calendar")
for s in scheduled:
    print("  " + s[0] + " : " + str(s[1]) + " runners, " + str(s[2]) + " runs, queue " + str(s[5]) + " min, utilisation " + str(utilisation(s[2], s[4], s[1])) + "%")
print("  runs grew " + str(int((scheduled[1][2] - scheduled[0][2]) * 100 / scheduled[0][2])) + "% while runners grew " + str(int((scheduled[1][1] - scheduled[0][1]) * 100 / scheduled[0][1])) + "%")
print("  the arrival rate is set by the release calendar rather than by what it")
print("  costs to push, so the extra runners are still spare six months later")
print("")
print("Tripling the runners was right and the batching it removed was a real cost")
print("that has stayed removed. The queue was the price of pushing, so removing it")
print("changed how often people push: " + str(commit_growth) + "% more work in " + str(push_growth) + "% more runs.")
```

## stdout (executed)

```text
month   runners   pushes/day   commits/10 pushes   commits/day   queue min   utilisation
  Jan     8        210          40              840          11          92%
  Feb     8        220          40              880          13          97%
  Mar     24        225          40              900          1          33%
  Apr     24        390          22              858          3          57%
  May     24        560          15              840          8          82%
  Jun     24        630          14              882          12          92%

runners     : 8 -> 24, multiplied by 3
pushes/day  : 210 -> 630, 300 per 100
commits/day : 840 -> 882, 105 per 100
queue       : 11 -> 12 minutes
utilisation : 92% -> 92%

the two demand measures
  Jan : 210 pushes carrying 840 commits
  Feb : 220 pushes carrying 880 commits
  Mar : 225 pushes carrying 900 commits
  Apr : 390 pushes carrying 858 commits
  May : 560 pushes carrying 840 commits
  Jun : 630 pushes carrying 882 commits
  pushes grew  : 200%
  commits grew : 5%
  the work moved by 5% and the number of submissions by 200%,
  which is the batching coming apart rather than the team writing more

commits per push against the queue in the same month
  Jan : queue 11 min, batch 40 commits per 10 pushes
  Feb : queue 13 min, batch 40 commits per 10 pushes
  Mar : queue 1 min, batch 40 commits per 10 pushes
  Apr : queue 3 min, batch 22 commits per 10 pushes
  May : queue 8 min, batch 15 commits per 10 pushes
  Jun : queue 12 min, batch 14 commits per 10 pushes
  the batch falls as the queue falls and does not recover when it returns,
  because by then pushing small is the habit

what the change of shape is worth, and it is not nothing
  commits per push : 4 -> 1 (14 per 10 pushes)
  a red run now implicates 1 commit rather than 4
  commits a reviewer sees at once : 4 -> 1
  this is exactly the improvement the purchase argued for, and it is real
  and permanent, unlike the queue time

runner-minutes
  Jan : demand 3570, capacity 3840
  Feb : demand 3740, capacity 3840
  Mar : demand 3825, capacity 11520
  Apr : demand 6630, capacity 11520
  May : demand 9520, capacity 11520
  Jun : demand 10710, capacity 11520
  Jun utilisation : 92%
  Jan utilisation : 92%
  three times the runners are running at close to the load the original
  eight were running at

if the queue is used as the trigger a second time
  queue then : 11 minutes on 8 runners serving 210 pushes
  queue now  : 12 minutes on 24 runners serving 630 pushes
  the queue differs by -1 minute and the system differs by 16 runners
  and 420 pushes a day
  a request citing only the queue cites a number that came back, from a
  system that did not go back

control - a release repository cut on a fixed calendar
  Jan : 4 runners, 20 runs, queue 6 min, utilisation 22%
  Jun : 12 runners, 21 runs, queue 0 min, utilisation 8%
  runs grew 5% while runners grew 200%
  the arrival rate is set by the release calendar rather than by what it
  costs to push, so the extra runners are still spare six months later

Tripling the runners was right and the batching it removed was a real cost
that has stayed removed. The queue was the price of pushing, so removing it
changed how often people push: 5% more work in 200% more runs.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
