<!-- canonical: efficientnewlanguage.org/ai/examples/373-each-step-is-of-those-who-reached-it | ai_layer_version: 0.1.0 | updated: 2026-08-14 -->

# Example 373 — Each step is of those who reached it — five 90% steps make 59%, and fixing any one gains the same

`each_step_is_of_those_who_reached_it.eml` computes the end-to-end rate and the per-step losses from the same five rates, then tries improving each step in turn.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Each step reports
# a pass rate of those who reached it. The reader wants a number about everyone.
#
# Per-step rates are the right thing to instrument. They are stable when traffic
# moves, they are comparable between steps, and they are what a team owning one
# step can act on. Every one of them is correct.
#
# Two things do not follow from them, and both are computed here rather than
# reasoned about: what fraction of the original population comes out the end,
# and which step is costing the most people.

[["sign up", 90], ["verify email", 90], ["add details", 90], ["choose plan", 90], ["pay", 90]] => steps
1000 => arrivals

def reaching(k):
    arrivals => n
    0 => i
    for s in steps:
        if i < k:
            int(n * s[1] / 100) => n
        i + 1 => i
    return n

def leaving(k):
    reaching(k) => before
    int(before * steps[k][1] / 100) => after
    return before - after

"per-step rates, all correct" ^0
0 => i
for s in steps:
    "  " + s[0] + " : " + str(s[1]) + "% of those who reached it" ^0
    i + 1 => i
"" ^0

"how many are left after each step" ^0
"  arrived        : " + str(arrivals) ^0
0 => i
for s in steps:
    "  after " + s[0] + " : " + str(reaching(i + 1)) ^0
    i + 1 => i
"" ^0

reaching(len(steps)) => finished
"end to end : " + str(finished) + " of " + str(arrivals) + " = " + str(int(finished * 100 / arrivals)) + "%" ^0
"lowest per-step rate : " ^0
100 => worst_rate
for s in steps:
    if s[1] < worst_rate:
        s[1] => worst_rate
"  " + str(worst_rate) + "%" ^0
if int(finished * 100 / arrivals) < worst_rate:
    "  the end-to-end number is below every single step's rate" ^0
"" ^0

# ---- which step costs the most people ----
#
# Every rate is identical here on purpose. If the rates differ, the reader can
# tell themselves the worst rate is the worst step and be accidentally right.

"people lost at each step" ^0
0 => i
0 => biggest
0 => biggest_at
for s in steps:
    leaving(i) => lost
    "  " + s[0] + " : " + str(lost) ^0
    if lost > biggest:
        lost => biggest
        i => biggest_at
    i + 1 => i
"  largest loss : " + steps[biggest_at][0] + ", " + str(biggest) + " people" ^0
"  its rate     : " + str(steps[biggest_at][1]) + "%, the same as every other step" ^0
"" ^0

# ---- improving the worst-looking step versus the earliest step ----

def finished_with(better_at, better_rate):
    arrivals => n
    0 => i
    for s in steps:
        if i == better_at:
            int(n * better_rate / 100) => n
        else:
            int(n * s[1] / 100) => n
        i + 1 => i
    return n

"raise one step from 90% to 95%" ^0
0 => i
for s in steps:
    finished_with(i, 95) => f
    "  at " + s[0] + " : " + str(f) + " finish (" + str(f - finished) + " more)" ^0
    i + 1 => i
"" ^0

# ---- the control: a funnel with one genuinely bad step ----

[["sign up", 99], ["verify email", 50], ["add details", 99], ["choose plan", 99], ["pay", 99]] => steps2

def reaching2(k):
    arrivals => n
    0 => i
    for s in steps2:
        if i < k:
            int(n * s[1] / 100) => n
        i + 1 => i
    return n

"control - a funnel where one step really is the problem" ^0
0 => i
0 => big2
0 => big2_at
for s in steps2:
    reaching2(i) => before
    before - int(before * s[1] / 100) => lost
    if lost > big2:
        lost => big2
        i => big2_at
    i + 1 => i
"  largest loss : " + steps2[big2_at][0] + ", " + str(big2) + " people" ^0
"  its rate     : " + str(steps2[big2_at][1]) + "%, the lowest in the funnel" ^0
if steps2[big2_at][1] == 50:
    "  here the worst rate and the worst loss are the same step" ^0
"" ^0

"Every per-step rate is a true statement about the people who got there." ^0
"Neither the end-to-end rate nor the ranking of steps by cost can be read" ^0
"off them without doing this arithmetic." ^0
```

## Python (deterministic transpilation)

```python
steps = [["sign up", 90], ["verify email", 90], ["add details", 90], ["choose plan", 90], ["pay", 90]]
arrivals = 1000

def reaching(k):
    n = arrivals
    i = 0
    for s in steps:
        if i < k:
            n = int(n * s[1] / 100)
        i = i + 1
    return n

def leaving(k):
    before = reaching(k)
    after = int(before * steps[k][1] / 100)
    return before - after

print("per-step rates, all correct")
i = 0
for s in steps:
    print("  " + s[0] + " : " + str(s[1]) + "% of those who reached it")
    i = i + 1
print("")
print("how many are left after each step")
print("  arrived        : " + str(arrivals))
i = 0
for s in steps:
    print("  after " + s[0] + " : " + str(reaching(i + 1)))
    i = i + 1
print("")
finished = reaching(len(steps))
print("end to end : " + str(finished) + " of " + str(arrivals) + " = " + str(int(finished * 100 / arrivals)) + "%")
print("lowest per-step rate : ")
worst_rate = 100
for s in steps:
    if s[1] < worst_rate:
        worst_rate = s[1]
print("  " + str(worst_rate) + "%")
if int(finished * 100 / arrivals) < worst_rate:
    print("  the end-to-end number is below every single step's rate")
print("")
print("people lost at each step")
i = 0
biggest = 0
biggest_at = 0
for s in steps:
    lost = leaving(i)
    print("  " + s[0] + " : " + str(lost))
    if lost > biggest:
        biggest = lost
        biggest_at = i
    i = i + 1
print("  largest loss : " + steps[biggest_at][0] + ", " + str(biggest) + " people")
print("  its rate     : " + str(steps[biggest_at][1]) + "%, the same as every other step")
print("")

def finished_with(better_at, better_rate):
    n = arrivals
    i = 0
    for s in steps:
        if i == better_at:
            n = int(n * better_rate / 100)
        else:
            n = int(n * s[1] / 100)
        i = i + 1
    return n

print("raise one step from 90% to 95%")
i = 0
for s in steps:
    f = finished_with(i, 95)
    print("  at " + s[0] + " : " + str(f) + " finish (" + str(f - finished) + " more)")
    i = i + 1
print("")
steps2 = [["sign up", 99], ["verify email", 50], ["add details", 99], ["choose plan", 99], ["pay", 99]]

def reaching2(k):
    n = arrivals
    i = 0
    for s in steps2:
        if i < k:
            n = int(n * s[1] / 100)
        i = i + 1
    return n

print("control - a funnel where one step really is the problem")
i = 0
big2 = 0
big2_at = 0
for s in steps2:
    before = reaching2(i)
    lost = before - int(before * s[1] / 100)
    if lost > big2:
        big2 = lost
        big2_at = i
    i = i + 1
print("  largest loss : " + steps2[big2_at][0] + ", " + str(big2) + " people")
print("  its rate     : " + str(steps2[big2_at][1]) + "%, the lowest in the funnel")
if steps2[big2_at][1] == 50:
    print("  here the worst rate and the worst loss are the same step")
print("")
print("Every per-step rate is a true statement about the people who got there.")
print("Neither the end-to-end rate nor the ranking of steps by cost can be read")
print("off them without doing this arithmetic.")
```

## stdout (executed)

```text
per-step rates, all correct
  sign up : 90% of those who reached it
  verify email : 90% of those who reached it
  add details : 90% of those who reached it
  choose plan : 90% of those who reached it
  pay : 90% of those who reached it

how many are left after each step
  arrived        : 1000
  after sign up : 900
  after verify email : 810
  after add details : 729
  after choose plan : 656
  after pay : 590

end to end : 590 of 1000 = 59%
lowest per-step rate : 
  90%
  the end-to-end number is below every single step's rate

people lost at each step
  sign up : 100
  verify email : 90
  add details : 81
  choose plan : 73
  pay : 66
  largest loss : sign up, 100 people
  its rate     : 90%, the same as every other step

raise one step from 90% to 95%
  at sign up : 622 finish (32 more)
  at verify email : 622 finish (32 more)
  at add details : 622 finish (32 more)
  at choose plan : 622 finish (32 more)
  at pay : 623 finish (33 more)

control - a funnel where one step really is the problem
  largest loss : verify email, 495 people
  its rate     : 50%, the lowest in the funnel
  here the worst rate and the worst loss are the same step

Every per-step rate is a true statement about the people who got there.
Neither the end-to-end rate nor the ranking of steps by cost can be read
off them without doing this arithmetic.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
