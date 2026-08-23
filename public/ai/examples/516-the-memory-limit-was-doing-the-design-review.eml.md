<!-- canonical: efficientnewlanguage.org/ai/examples/516-the-memory-limit-was-doing-the-design-review | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 516 — The memory limit was doing the design review

`the_memory_limit_was_doing_the_design_review.eml` - A query memory limit was raised from 4 GB to 16 GB. What the analysts wrote afterwards is computed below, along with what the old limit had been doing.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A query memory
# limit was raised from 4 GB to 16 GB. What the analysts wrote afterwards is
# computed below, along with what the old limit had been doing.
#
# Raising the limit was correct. Three legitimate quarterly reports could not
# run at all, the workarounds were worse than the queries - one of them wrote
# a temporary table and read it back - and the machine had 400 GB sitting
# idle. Refusing to run a correct report on hardware that can afford it is not
# a virtue.
#
# The limit was also the only thing anybody consulted about how a query should
# be shaped. A kill at 4 GB is a review comment delivered by the scheduler:
# it arrives every time, it cannot be argued with, and it is free. Raising the
# ceiling removed the report failures and it removed the review.
#
# Queries are counted by the memory they need, before and after.

# [bucket GB, queries per month before, queries per month after]
[[1, 210, 190], [2, 90, 84], [4, 31, 40], [8, 0, 46], [16, 3, 22], [32, 0, 9]] => buckets

len(buckets) => n
4 => limit_before
16 => limit_after

"memory needed   attempts/month before   after" ^0
for b in buckets:
    "  " + str(b[0]) + " GB              " + str(b[1]) + "                    " + str(b[2]) ^0
"" ^0

0 => before_total
0 => after_total
for b in buckets:
    before_total + b[1] => before_total
    after_total + b[2] => after_total
"queries attempted a month : " + str(before_total) + " -> " + str(after_total) + ", " + str(int(after_total * 100 / before_total)) + " per 100" ^0
"limit           : " + str(limit_before) + " GB -> " + str(limit_after) + " GB" ^0
"" ^0

# ---- what gets killed at each limit ----

def killed_at(limit, which):
    0 => k
    for b in buckets:
        if b[0] > limit:
            if which == "before":
                k + b[1] => k
            else:
                k + b[2] => k
    return k

"queries killed per month" ^0
"  old workload against the old " + str(limit_before) + " GB limit : " + str(killed_at(limit_before, "before")) ^0
"  new workload against the new " + str(limit_after) + " GB limit : " + str(killed_at(limit_after, "after")) ^0
"  new workload against the old " + str(limit_before) + " GB limit : " + str(killed_at(limit_before, "after")) ^0
"  the kill count came back, against a ceiling four times higher" ^0
"" ^0

# ---- what the distribution did ----

0 => weighted_before
0 => weighted_after
for b in buckets:
    weighted_before + b[0] * b[1] => weighted_before
    weighted_after + b[0] * b[2] => weighted_after
"average memory per query" ^0
"  before : " + str(int(weighted_before * 10 / before_total)) + " tenths of a GB" ^0
"  after  : " + str(int(weighted_after * 10 / after_total)) + " tenths of a GB" ^0
"  multiplied by " + str(int(weighted_after * before_total * 10 / (weighted_before * after_total))) + " tenths" ^0
"total memory demanded per month" ^0
"  before : " + str(weighted_before) + " GB" ^0
"  after  : " + str(weighted_after) + " GB" ^0
"  attempts rose " + str(int((after_total - before_total) * 100 / before_total)) + "% and memory demanded rose " + str(int((weighted_after - weighted_before) * 100 / weighted_before)) + "%" ^0
"" ^0

# ---- the three reports the change was made for ----

# [report, GB it needs, ran before?, the workaround it was using]
[["quarterly cohort", 9, "no", "a temporary table read back in two passes"], ["margin by region", 11, "no", "sampling to a tenth and scaling up"], ["retention curve", 14, "no", "three separate queries joined by hand"]] => blocked
"the reports that could not run" ^0
0 => blocked_gb
for r in blocked:
    blocked_gb + r[1] => blocked_gb
    "  " + r[0] + " : " + str(r[1]) + " GB, workaround was " + r[3] ^0
"  they run now, correctly, in one pass each" ^0
"  memory they use : " + str(blocked_gb) + " GB a month between them" ^0
"  that is " + str(int(blocked_gb * 100 / (weighted_after - weighted_before))) + "% of the increase in memory demanded" ^0
"" ^0

# ---- what the rest of the increase is ----

weighted_after - weighted_before => increase
"the increase, apportioned" ^0
"  the three reports the change was for : " + str(blocked_gb) + " GB" ^0
"  everything else                      : " + str(increase - blocked_gb) + " GB" ^0
"  ratio : " + str(int((increase - blocked_gb) / blocked_gb)) + " to 1" ^0
"  none of the second group was blocked before, so none of it was waiting" ^0
"  for the change - it is queries that would have been written smaller" ^0
"" ^0

# ---- what a kill used to do ----

"what happened when a query was killed at " + str(limit_before) + " GB" ^0
"  the analyst rewrote it     : every time, there was no other option" ^0
"  time to rewrite            : under an hour, usually a narrower date range" ^0
"  reviews that comment on query memory : 0" ^0
"  so the scheduler was the only reviewer, and it reviewed every query" ^0
"  the same way for free" ^0
"" ^0

# ---- where the ceiling is now ----

"queries above each candidate ceiling, on the current workload" ^0
[4, 8, 16, 32] => ceilings
for c in ceilings:
    "  " + str(c) + " GB : " + str(killed_at(c, "after")) + " killed a month" ^0
"  the workload reshapes itself around whichever of these is chosen, so the" ^0
"  kill count is a property of the ceiling and not of the analysis" ^0
"" ^0

# ---- the control: memory set by the data, not by the query ----
#
# Where a job's memory is a function of how much data exists rather than of
# how the query was written, raising the ceiling changes nothing about it.

[["nightly rollup", 6, 6], ["index rebuild", 12, 12], ["export", 3, 3]] => bounded
"control - jobs whose memory is fixed by the input size" ^0
0 => moved
for j in bounded:
    "  " + j[0] + " : " + str(j[1]) + " GB before, " + str(j[2]) + " GB after" ^0
    if not (j[1] == j[2]):
        moved + 1 => moved
"  jobs whose memory changed when the ceiling rose : " + str(moved) + " of " + str(len(bounded)) ^0
if moved == 0:
    "  none, because nobody chooses these numbers - the data does" ^0
    "  here the ceiling is a safety limit rather than a design constraint," ^0
    "  and raising it is purely an improvement" ^0
"" ^0

"The three reports really were blocked and their workarounds really were" ^0
"worse than the queries. The limit was also the only review any query got," ^0
"so " + str(increase - blocked_gb) + " GB of the " + str(increase) + " GB increase came from queries nobody had blocked." ^0
```

## Python (deterministic transpilation)

```python
buckets = [[1, 210, 190], [2, 90, 84], [4, 31, 40], [8, 0, 46], [16, 3, 22], [32, 0, 9]]
n = len(buckets)
limit_before = 4
limit_after = 16
print("memory needed   attempts/month before   after")
for b in buckets:
    print("  " + str(b[0]) + " GB              " + str(b[1]) + "                    " + str(b[2]))
print("")
before_total = 0
after_total = 0
for b in buckets:
    before_total = before_total + b[1]
    after_total = after_total + b[2]
print("queries attempted a month : " + str(before_total) + " -> " + str(after_total) + ", " + str(int(after_total * 100 / before_total)) + " per 100")
print("limit           : " + str(limit_before) + " GB -> " + str(limit_after) + " GB")
print("")

def killed_at(limit, which):
    k = 0
    for b in buckets:
        if b[0] > limit:
            if which == "before":
                k = k + b[1]
            else:
                k = k + b[2]
    return k

print("queries killed per month")
print("  old workload against the old " + str(limit_before) + " GB limit : " + str(killed_at(limit_before, "before")))
print("  new workload against the new " + str(limit_after) + " GB limit : " + str(killed_at(limit_after, "after")))
print("  new workload against the old " + str(limit_before) + " GB limit : " + str(killed_at(limit_before, "after")))
print("  the kill count came back, against a ceiling four times higher")
print("")
weighted_before = 0
weighted_after = 0
for b in buckets:
    weighted_before = weighted_before + b[0] * b[1]
    weighted_after = weighted_after + b[0] * b[2]
print("average memory per query")
print("  before : " + str(int(weighted_before * 10 / before_total)) + " tenths of a GB")
print("  after  : " + str(int(weighted_after * 10 / after_total)) + " tenths of a GB")
print("  multiplied by " + str(int(weighted_after * before_total * 10 / (weighted_before * after_total))) + " tenths")
print("total memory demanded per month")
print("  before : " + str(weighted_before) + " GB")
print("  after  : " + str(weighted_after) + " GB")
print("  attempts rose " + str(int((after_total - before_total) * 100 / before_total)) + "% and memory demanded rose " + str(int((weighted_after - weighted_before) * 100 / weighted_before)) + "%")
print("")
blocked = [["quarterly cohort", 9, "no", "a temporary table read back in two passes"], ["margin by region", 11, "no", "sampling to a tenth and scaling up"], ["retention curve", 14, "no", "three separate queries joined by hand"]]
print("the reports that could not run")
blocked_gb = 0
for r in blocked:
    blocked_gb = blocked_gb + r[1]
    print("  " + r[0] + " : " + str(r[1]) + " GB, workaround was " + r[3])
print("  they run now, correctly, in one pass each")
print("  memory they use : " + str(blocked_gb) + " GB a month between them")
print("  that is " + str(int(blocked_gb * 100 / (weighted_after - weighted_before))) + "% of the increase in memory demanded")
print("")
increase = weighted_after - weighted_before
print("the increase, apportioned")
print("  the three reports the change was for : " + str(blocked_gb) + " GB")
print("  everything else                      : " + str(increase - blocked_gb) + " GB")
print("  ratio : " + str(int((increase - blocked_gb) / blocked_gb)) + " to 1")
print("  none of the second group was blocked before, so none of it was waiting")
print("  for the change - it is queries that would have been written smaller")
print("")
print("what happened when a query was killed at " + str(limit_before) + " GB")
print("  the analyst rewrote it     : every time, there was no other option")
print("  time to rewrite            : under an hour, usually a narrower date range")
print("  reviews that comment on query memory : 0")
print("  so the scheduler was the only reviewer, and it reviewed every query")
print("  the same way for free")
print("")
print("queries above each candidate ceiling, on the current workload")
ceilings = [4, 8, 16, 32]
for c in ceilings:
    print("  " + str(c) + " GB : " + str(killed_at(c, "after")) + " killed a month")
print("  the workload reshapes itself around whichever of these is chosen, so the")
print("  kill count is a property of the ceiling and not of the analysis")
print("")
bounded = [["nightly rollup", 6, 6], ["index rebuild", 12, 12], ["export", 3, 3]]
print("control - jobs whose memory is fixed by the input size")
moved = 0
for j in bounded:
    print("  " + j[0] + " : " + str(j[1]) + " GB before, " + str(j[2]) + " GB after")
    if not j[1] == j[2]:
        moved = moved + 1
print("  jobs whose memory changed when the ceiling rose : " + str(moved) + " of " + str(len(bounded)))
if moved == 0:
    print("  none, because nobody chooses these numbers - the data does")
    print("  here the ceiling is a safety limit rather than a design constraint,")
    print("  and raising it is purely an improvement")
print("")
print("The three reports really were blocked and their workarounds really were")
print("worse than the queries. The limit was also the only review any query got,")
print("so " + str(increase - blocked_gb) + " GB of the " + str(increase) + " GB increase came from queries nobody had blocked.")
```

## stdout (executed)

```text
memory needed   attempts/month before   after
  1 GB              210                    190
  2 GB              90                    84
  4 GB              31                    40
  8 GB              0                    46
  16 GB              3                    22
  32 GB              0                    9

queries attempted a month : 334 -> 391, 117 per 100
limit           : 4 GB -> 16 GB

queries killed per month
  old workload against the old 4 GB limit : 3
  new workload against the new 16 GB limit : 9
  new workload against the old 4 GB limit : 77
  the kill count came back, against a ceiling four times higher

average memory per query
  before : 16 tenths of a GB
  after  : 39 tenths of a GB
  multiplied by 23 tenths
total memory demanded per month
  before : 562 GB
  after  : 1526 GB
  attempts rose 17% and memory demanded rose 171%

the reports that could not run
  quarterly cohort : 9 GB, workaround was a temporary table read back in two passes
  margin by region : 11 GB, workaround was sampling to a tenth and scaling up
  retention curve : 14 GB, workaround was three separate queries joined by hand
  they run now, correctly, in one pass each
  memory they use : 34 GB a month between them
  that is 3% of the increase in memory demanded

the increase, apportioned
  the three reports the change was for : 34 GB
  everything else                      : 930 GB
  ratio : 27 to 1
  none of the second group was blocked before, so none of it was waiting
  for the change - it is queries that would have been written smaller

what happened when a query was killed at 4 GB
  the analyst rewrote it     : every time, there was no other option
  time to rewrite            : under an hour, usually a narrower date range
  reviews that comment on query memory : 0
  so the scheduler was the only reviewer, and it reviewed every query
  the same way for free

queries above each candidate ceiling, on the current workload
  4 GB : 77 killed a month
  8 GB : 31 killed a month
  16 GB : 9 killed a month
  32 GB : 0 killed a month
  the workload reshapes itself around whichever of these is chosen, so the
  kill count is a property of the ceiling and not of the analysis

control - jobs whose memory is fixed by the input size
  nightly rollup : 6 GB before, 6 GB after
  index rebuild : 12 GB before, 12 GB after
  export : 3 GB before, 3 GB after
  jobs whose memory changed when the ceiling rose : 0 of 3
  none, because nobody chooses these numbers - the data does
  here the ceiling is a safety limit rather than a design constraint,
  and raising it is purely an improvement

The three reports really were blocked and their workarounds really were
worse than the queries. The limit was also the only review any query got,
so 930 GB of the 964 GB increase came from queries nobody had blocked.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:def · eml:call · eml:return · eml:run:done
