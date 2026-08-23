<!-- canonical: efficientnewlanguage.org/ai/examples/518-the-pool-doubled-and-the-backlog-did-not-move | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 518 — The pool doubled and the backlog did not move

`the_pool_doubled_and_the_backlog_did_not_move.eml` - The worker pool was doubled and the overnight backlog is the same length it was. What changed and what did not are computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The worker pool
# was doubled and the overnight backlog is the same length it was. What
# changed and what did not are computed below.
#
# Doubling the pool was correct and it worked. February overran the window by
# six minutes, the request was made on that measurement, throughput really did
# double, and in March the run finished in less than half the time. Nobody was
# mistaken about the capacity.
#
# The batch that feeds the pool is sized by the operator to whatever finishes
# in the window. That rule is sensible - it is how you avoid a batch still
# running at nine in the morning - and it means the batch grows whenever the
# window stops binding. Capacity added to a system whose input is sized by its
# own output does not shorten the queue, it enlarges the work.
#
# Times are computed in minutes, because at hourly resolution an overrun and
# an on-time finish round to the same number.

# [month, workers, jobs submitted, seconds per job, window minutes, backlog at 09:00]
[["Jan", 20, 40000, 16, 540, 0], ["Feb", 20, 41000, 16, 540, 0], ["Mar", 40, 41000, 16, 540, 0], ["Apr", 40, 62000, 16, 540, 0], ["May", 40, 78000, 16, 540, 0], ["Jun", 40, 81000, 16, 540, 0]] => months

len(months) => n

def runtime(jobs, workers, secs):
    return int(jobs * secs / (workers * 60))

"month   workers   jobs      minutes to finish   window   slack   backlog" ^0
for m in months:
    "  " + m[0] + "     " + str(m[1]) + "        " + str(m[2]) + "     " + str(runtime(m[2], m[1], m[3])) + "                " + str(m[4]) + "      " + str(m[4] - runtime(m[2], m[1], m[3])) + "      " + str(m[5]) ^0
"" ^0

months[0] => first
months[n - 1] => last
"capacity : " + str(first[1]) + " -> " + str(last[1]) + " workers, multiplied by " + str(int(last[1] / first[1])) ^0
"jobs     : " + str(first[2]) + " -> " + str(last[2]) + ", " + str(int(last[2] * 100 / first[2])) + " per 100" ^0
"runtime  : " + str(runtime(first[2], first[1], first[3])) + " -> " + str(runtime(last[2], last[1], last[3])) + " minutes" ^0
"backlog  : " + str(first[5]) + " -> " + str(last[5]) ^0
"" ^0

# ---- the month that motivated the request ----

"the month the window was breached" ^0
0 => over
for m in months:
    if runtime(m[2], m[1], m[3]) > m[4]:
        over + 1 => over
        "  " + m[0] + " : ran " + str(runtime(m[2], m[1], m[3])) + " minutes into a " + str(m[4]) + "-minute window, over by " + str(runtime(m[2], m[1], m[3]) - m[4]) ^0
"  months over the window : " + str(over) + " of " + str(n) ^0
"  at hourly resolution that month reads as 9 hours against a 9-hour window," ^0
"  which is the same number an on-time finish produces" ^0
"" ^0

# ---- either side of the change ----

"the three months around the doubling" ^0
for m in months:
    if m[0] == "Feb":
        "  " + m[0] + " : " + str(m[1]) + " workers, " + str(m[2]) + " jobs, " + str(runtime(m[2], m[1], m[3])) + " minutes" ^0
    if m[0] == "Mar":
        "  " + m[0] + " : " + str(m[1]) + " workers, " + str(m[2]) + " jobs, " + str(runtime(m[2], m[1], m[3])) + " minutes" ^0
    if m[0] == "Apr":
        "  " + m[0] + " : " + str(m[1]) + " workers, " + str(m[2]) + " jobs, " + str(runtime(m[2], m[1], m[3])) + " minutes" ^0
"  March doubled the pool with the batch unchanged, and the runtime halved" ^0
"  April resized the batch to a window that had stopped binding" ^0
"" ^0

# ---- what happened to the slack ----

"slack, month by month" ^0
0 => peak_slack
"" => peak_month
for m in months:
    m[4] - runtime(m[2], m[1], m[3]) => sl
    "  " + m[0] + " : " + str(sl) + " minutes" ^0
    if sl > peak_slack:
        sl => peak_slack
        m[0] => peak_month
"" => spent
0 => seen_peak
for m in months:
    if m[0] == peak_month:
        1 => seen_peak
    if seen_peak == 1:
        if spent == "":
            if not (m[0] == peak_month):
                if m[4] - runtime(m[2], m[1], m[3]) < 1:
                    m[0] => spent
"  peak slack : " + str(peak_slack) + " minutes in " + peak_month ^0
if not (spent == ""):
    "  back to nothing by : " + spent ^0
    "  so the headroom the doubling bought lasted from " + peak_month + " to " + spent ^0
"  it was not consumed by demand, it was consumed by a batch size that is a" ^0
"  decision rather than an input" ^0
"" ^0

# ---- what actually grew ----

"jobs per worker, which takes the capacity change out" ^0
for m in months:
    "  " + m[0] + " : " + str(int(m[2] / m[1])) + " jobs per worker" ^0
int(first[2] / first[1]) => per_first
int(last[2] / last[1]) => per_last
int((per_last - per_first) * 100 / per_first) => drift
"  " + first[0] + " " + str(per_first) + " -> " + last[0] + " " + str(per_last) + ", a change of " + str(drift) + "%" ^0
if drift < 5:
    "  per-worker load is back within " + str(drift) + "% of where it was before the pool" ^0
    "  doubled, which is what it means for demand to have absorbed the" ^0
    "  capacity completely" ^0
"" ^0

# ---- the case that was made ----

"the request for more capacity, checked step by step" ^0
for m in months:
    if m[0] == "Feb":
        "  measured  : the run overran by " + str(runtime(m[2], m[1], m[3]) - m[4]) + " minutes" ^0
    if m[0] == "Mar":
        "  predicted : " + str(runtime(m[2], m[1], m[3])) + " minutes at double the pool" ^0
        "  observed  : " + str(runtime(m[2], m[1], m[3])) + " minutes, in the first month" ^0
"  observed now : " + str(runtime(last[2], last[1], last[3])) + " minutes" ^0
"  every step of that reasoning was correct and the prediction held for" ^0
"  exactly as long as the batch size was held" ^0
"" ^0

# ---- the quantity nobody has ----

"what would settle it" ^0
"  jobs the business needs run : not measured anywhere" ^0
"  jobs submitted              : " + str(last[2]) ^0
"  rule setting that number    : whatever finishes before morning" ^0
"  under that rule capacity and demand are one variable, so a request for" ^0
"  more of the first is a request for more of the second" ^0
"" ^0

# ---- the control: a batch whose size is fixed elsewhere ----
#
# Where the input is a fixed daily export that exists whatever the pool does,
# doubling the pool halves the time and it stays halved.

[["Jan", 20, 12000, 16, 540], ["Jun", 40, 12300, 16, 540]] => fixed
"control - a second pipeline fed by a fixed daily export" ^0
for f in fixed:
    "  " + f[0] + " : " + str(f[1]) + " workers, " + str(f[2]) + " jobs, " + str(runtime(f[2], f[1], f[3])) + " minutes, slack " + str(f[4] - runtime(f[2], f[1], f[3])) ^0
fixed[0] => c_first
fixed[1] => c_last
"  jobs grew " + str(int((c_last[2] - c_first[2]) * 100 / c_first[2])) + "%, capacity grew " + str(int((c_last[1] - c_first[1]) * 100 / c_first[1])) + "%" ^0
"  runtime " + str(runtime(c_first[2], c_first[1], c_first[3])) + " -> " + str(runtime(c_last[2], c_last[1], c_last[3])) + " minutes, and it stayed there" ^0
"  the input is a fact about the world rather than a decision about the" ^0
"  window, so the extra capacity is still extra capacity six months on" ^0
"" ^0

"Doubling the pool worked and the throughput measurement was correct." ^0
"The batch is sized to whatever finishes before morning, so the window fills" ^0
"by construction and the backlog is " + str(last[5]) + " either way." ^0
```

## Python (deterministic transpilation)

```python
months = [["Jan", 20, 40000, 16, 540, 0], ["Feb", 20, 41000, 16, 540, 0], ["Mar", 40, 41000, 16, 540, 0], ["Apr", 40, 62000, 16, 540, 0], ["May", 40, 78000, 16, 540, 0], ["Jun", 40, 81000, 16, 540, 0]]
n = len(months)

def runtime(jobs, workers, secs):
    return int(jobs * secs / (workers * 60))

print("month   workers   jobs      minutes to finish   window   slack   backlog")
for m in months:
    print("  " + m[0] + "     " + str(m[1]) + "        " + str(m[2]) + "     " + str(runtime(m[2], m[1], m[3])) + "                " + str(m[4]) + "      " + str(m[4] - runtime(m[2], m[1], m[3])) + "      " + str(m[5]))
print("")
first = months[0]
last = months[n - 1]
print("capacity : " + str(first[1]) + " -> " + str(last[1]) + " workers, multiplied by " + str(int(last[1] / first[1])))
print("jobs     : " + str(first[2]) + " -> " + str(last[2]) + ", " + str(int(last[2] * 100 / first[2])) + " per 100")
print("runtime  : " + str(runtime(first[2], first[1], first[3])) + " -> " + str(runtime(last[2], last[1], last[3])) + " minutes")
print("backlog  : " + str(first[5]) + " -> " + str(last[5]))
print("")
print("the month the window was breached")
over = 0
for m in months:
    if runtime(m[2], m[1], m[3]) > m[4]:
        over = over + 1
        print("  " + m[0] + " : ran " + str(runtime(m[2], m[1], m[3])) + " minutes into a " + str(m[4]) + "-minute window, over by " + str(runtime(m[2], m[1], m[3]) - m[4]))
print("  months over the window : " + str(over) + " of " + str(n))
print("  at hourly resolution that month reads as 9 hours against a 9-hour window,")
print("  which is the same number an on-time finish produces")
print("")
print("the three months around the doubling")
for m in months:
    if m[0] == "Feb":
        print("  " + m[0] + " : " + str(m[1]) + " workers, " + str(m[2]) + " jobs, " + str(runtime(m[2], m[1], m[3])) + " minutes")
    if m[0] == "Mar":
        print("  " + m[0] + " : " + str(m[1]) + " workers, " + str(m[2]) + " jobs, " + str(runtime(m[2], m[1], m[3])) + " minutes")
    if m[0] == "Apr":
        print("  " + m[0] + " : " + str(m[1]) + " workers, " + str(m[2]) + " jobs, " + str(runtime(m[2], m[1], m[3])) + " minutes")
print("  March doubled the pool with the batch unchanged, and the runtime halved")
print("  April resized the batch to a window that had stopped binding")
print("")
print("slack, month by month")
peak_slack = 0
peak_month = ""
for m in months:
    sl = m[4] - runtime(m[2], m[1], m[3])
    print("  " + m[0] + " : " + str(sl) + " minutes")
    if sl > peak_slack:
        peak_slack = sl
        peak_month = m[0]
spent = ""
seen_peak = 0
for m in months:
    if m[0] == peak_month:
        seen_peak = 1
    if seen_peak == 1:
        if spent == "":
            if not m[0] == peak_month:
                if m[4] - runtime(m[2], m[1], m[3]) < 1:
                    spent = m[0]
print("  peak slack : " + str(peak_slack) + " minutes in " + peak_month)
if not spent == "":
    print("  back to nothing by : " + spent)
    print("  so the headroom the doubling bought lasted from " + peak_month + " to " + spent)
print("  it was not consumed by demand, it was consumed by a batch size that is a")
print("  decision rather than an input")
print("")
print("jobs per worker, which takes the capacity change out")
for m in months:
    print("  " + m[0] + " : " + str(int(m[2] / m[1])) + " jobs per worker")
per_first = int(first[2] / first[1])
per_last = int(last[2] / last[1])
drift = int((per_last - per_first) * 100 / per_first)
print("  " + first[0] + " " + str(per_first) + " -> " + last[0] + " " + str(per_last) + ", a change of " + str(drift) + "%")
if drift < 5:
    print("  per-worker load is back within " + str(drift) + "% of where it was before the pool")
    print("  doubled, which is what it means for demand to have absorbed the")
    print("  capacity completely")
print("")
print("the request for more capacity, checked step by step")
for m in months:
    if m[0] == "Feb":
        print("  measured  : the run overran by " + str(runtime(m[2], m[1], m[3]) - m[4]) + " minutes")
    if m[0] == "Mar":
        print("  predicted : " + str(runtime(m[2], m[1], m[3])) + " minutes at double the pool")
        print("  observed  : " + str(runtime(m[2], m[1], m[3])) + " minutes, in the first month")
print("  observed now : " + str(runtime(last[2], last[1], last[3])) + " minutes")
print("  every step of that reasoning was correct and the prediction held for")
print("  exactly as long as the batch size was held")
print("")
print("what would settle it")
print("  jobs the business needs run : not measured anywhere")
print("  jobs submitted              : " + str(last[2]))
print("  rule setting that number    : whatever finishes before morning")
print("  under that rule capacity and demand are one variable, so a request for")
print("  more of the first is a request for more of the second")
print("")
fixed = [["Jan", 20, 12000, 16, 540], ["Jun", 40, 12300, 16, 540]]
print("control - a second pipeline fed by a fixed daily export")
for f in fixed:
    print("  " + f[0] + " : " + str(f[1]) + " workers, " + str(f[2]) + " jobs, " + str(runtime(f[2], f[1], f[3])) + " minutes, slack " + str(f[4] - runtime(f[2], f[1], f[3])))
c_first = fixed[0]
c_last = fixed[1]
print("  jobs grew " + str(int((c_last[2] - c_first[2]) * 100 / c_first[2])) + "%, capacity grew " + str(int((c_last[1] - c_first[1]) * 100 / c_first[1])) + "%")
print("  runtime " + str(runtime(c_first[2], c_first[1], c_first[3])) + " -> " + str(runtime(c_last[2], c_last[1], c_last[3])) + " minutes, and it stayed there")
print("  the input is a fact about the world rather than a decision about the")
print("  window, so the extra capacity is still extra capacity six months on")
print("")
print("Doubling the pool worked and the throughput measurement was correct.")
print("The batch is sized to whatever finishes before morning, so the window fills")
print("by construction and the backlog is " + str(last[5]) + " either way.")
```

## stdout (executed)

```text
month   workers   jobs      minutes to finish   window   slack   backlog
  Jan     20        40000     533                540      7      0
  Feb     20        41000     546                540      -6      0
  Mar     40        41000     273                540      267      0
  Apr     40        62000     413                540      127      0
  May     40        78000     520                540      20      0
  Jun     40        81000     540                540      0      0

capacity : 20 -> 40 workers, multiplied by 2
jobs     : 40000 -> 81000, 202 per 100
runtime  : 533 -> 540 minutes
backlog  : 0 -> 0

the month the window was breached
  Feb : ran 546 minutes into a 540-minute window, over by 6
  months over the window : 1 of 6
  at hourly resolution that month reads as 9 hours against a 9-hour window,
  which is the same number an on-time finish produces

the three months around the doubling
  Feb : 20 workers, 41000 jobs, 546 minutes
  Mar : 40 workers, 41000 jobs, 273 minutes
  Apr : 40 workers, 62000 jobs, 413 minutes
  March doubled the pool with the batch unchanged, and the runtime halved
  April resized the batch to a window that had stopped binding

slack, month by month
  Jan : 7 minutes
  Feb : -6 minutes
  Mar : 267 minutes
  Apr : 127 minutes
  May : 20 minutes
  Jun : 0 minutes
  peak slack : 267 minutes in Mar
  back to nothing by : Jun
  so the headroom the doubling bought lasted from Mar to Jun
  it was not consumed by demand, it was consumed by a batch size that is a
  decision rather than an input

jobs per worker, which takes the capacity change out
  Jan : 2000 jobs per worker
  Feb : 2050 jobs per worker
  Mar : 1025 jobs per worker
  Apr : 1550 jobs per worker
  May : 1950 jobs per worker
  Jun : 2025 jobs per worker
  Jan 2000 -> Jun 2025, a change of 1%
  per-worker load is back within 1% of where it was before the pool
  doubled, which is what it means for demand to have absorbed the
  capacity completely

the request for more capacity, checked step by step
  measured  : the run overran by 6 minutes
  predicted : 273 minutes at double the pool
  observed  : 273 minutes, in the first month
  observed now : 540 minutes
  every step of that reasoning was correct and the prediction held for
  exactly as long as the batch size was held

what would settle it
  jobs the business needs run : not measured anywhere
  jobs submitted              : 81000
  rule setting that number    : whatever finishes before morning
  under that rule capacity and demand are one variable, so a request for
  more of the first is a request for more of the second

control - a second pipeline fed by a fixed daily export
  Jan : 20 workers, 12000 jobs, 160 minutes, slack 380
  Jun : 40 workers, 12300 jobs, 82 minutes, slack 458
  jobs grew 2%, capacity grew 100%
  runtime 160 -> 82 minutes, and it stayed there
  the input is a fact about the world rather than a decision about the
  window, so the extra capacity is still extra capacity six months on

Doubling the pool worked and the throughput measurement was correct.
The batch is sized to whatever finishes before morning, so the window fills
by construction and the backlog is 0 either way.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
