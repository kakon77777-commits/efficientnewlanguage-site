<!-- canonical: efficientnewlanguage.org/ai/examples/347-the-noisiest-check-is-relaxed-first | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 347 — The noisiest check is relaxed first — 7 of 7 defects caught, then 4

`the_noisiest_check_is_relaxed_first.eml` runs a threshold-tuning policy for several rounds and measures what the suite can still catch after each one.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Four checks, and
# a policy that always tunes the one making the most noise.
#
# The policy is reasonable in every individual application. A check that fires
# forty times a week is not being read, and a check that is not being read is
# worse than no check because it also consumes the attention that a real alarm
# would need. So the noisiest one gets its threshold raised, every time.
#
# Applied repeatedly, that policy has a direction. The check that fires most is
# usually the most SENSITIVE one, and sensitivity is the property the suite
# exists to have. Nothing in the policy ever raises a threshold on a check that
# rarely fires, so the ones that survive untouched are the ones that were
# already too blunt to notice anything.
#
# The program runs the policy for several rounds and measures the suite's
# ability to catch real defects after each one. Noise events are in the stream
# on purpose - without them the policy has nothing to react to, and the whole
# argument for the policy disappears.

def catches(threshold, magnitude):
    if magnitude >= threshold:
        return 1
    return 0

def alarms_for(threshold, events):
    0 => n
    for e in events:
        if catches(threshold, e[1]) == 1:
            n + 1 => n
    return n

def real_defects_caught(thresholds, events):
    0 => n
    for e in events:
        if e[0] == "defect":
            0 => hit
            for t in thresholds:
                if catches(t, e[1]) == 1:
                    1 => hit
            n + hit => n
    return n

def total_defects(events):
    0 => n
    for e in events:
        if e[0] == "defect":
            n + 1 => n
    return n

# magnitude 1-3 is noise, 4 and up is a real defect
[["noise", 1], ["noise", 2], ["defect", 4], ["noise", 1], ["noise", 3], ["defect", 9], ["noise", 2], ["defect", 5], ["noise", 1], ["defect", 16], ["noise", 2], ["defect", 7], ["noise", 3], ["defect", 30], ["noise", 1], ["defect", 12]] => events

[1, 4, 8, 20] => thresholds
["A", "B", "C", "D"] => check_names

total_defects(events) => defect_count
"real defects in the stream : " + str(defect_count) ^0
"noise events               : " + str(len(events) - defect_count) ^0
"" ^0

"round  thresholds        alarms per check     defects caught" ^0
for round_no in [0:4]:
    [] => alarms
    for t in thresholds:
        alarms + [alarms_for(t, events)] => alarms
    real_defects_caught(thresholds, events) => caught
    "  " + str(round_no) + "    " + repr(thresholds) + "   " + repr(alarms) + "   " + str(caught) + " of " + str(defect_count) ^0
    # the policy: double the threshold of whichever check alarmed most
    max(alarms) => loudest
    0 => i
    0 => done
    [] => next_thresholds
    for t in thresholds:
        if alarms[i] == loudest:
            if done == 0:
                next_thresholds + [t * 2] => next_thresholds
                1 => done
            else:
                next_thresholds + [t] => next_thresholds
        else:
            next_thresholds + [t] => next_thresholds
        i + 1 => i
    next_thresholds => thresholds
"" ^0

# ---- which checks were touched ----

[1, 4, 8, 20] => original
"threshold, start and end" ^0
0 => i
0 => raised
for t in original:
    if thresholds[i] != t:
        raised + 1 => raised
        "  check " + check_names[i] + " : " + str(t) + " -> " + str(thresholds[i]) + "  (raised)" ^0
    else:
        "  check " + check_names[i] + " : " + str(t) + " -> " + str(thresholds[i]) ^0
    i + 1 => i
"  checks raised : " + str(raised) + " of " + str(len(original)) ^0
"" ^0

# ---- the policy never touches a blunt check ----

"alarms raised by each check at the start" ^0
0 => i
for t in original:
    "  check " + check_names[i] + " (threshold " + str(t) + ") : " + str(alarms_for(t, events)) + " alarms, " ^0
    i + 1 => i
"" ^0

# ---- what the suite lost ----

real_defects_caught(original, events) => before
real_defects_caught(thresholds, events) => after
"defects the suite catches" ^0
"  before the policy ran : " + str(before) + " of " + str(defect_count) ^0
"  after                 : " + str(after) + " of " + str(defect_count) ^0
"  lost                  : " + str(before - after) ^0
"" ^0

# ---- the alarm count went where it was supposed to ----

0 => alarms_before
for t in original:
    alarms_before + alarms_for(t, events) => alarms_before
0 => alarms_after
for t in thresholds:
    alarms_after + alarms_for(t, events) => alarms_after
"total alarms across the suite" ^0
"  before : " + str(alarms_before) ^0
"  after  : " + str(alarms_after) ^0
"  the policy achieved exactly what it was asked to achieve" ^0
"" ^0

"Every application of the policy was justified on its own terms. The policy" ^0
"has a direction anyway, and the direction is toward a suite that is quiet" ^0
"because there is nothing left in it that can speak." ^0
```

## Python (deterministic transpilation)

```python
def catches(threshold, magnitude):
    if magnitude >= threshold:
        return 1
    return 0

def alarms_for(threshold, events):
    n = 0
    for e in events:
        if catches(threshold, e[1]) == 1:
            n = n + 1
    return n

def real_defects_caught(thresholds, events):
    n = 0
    for e in events:
        if e[0] == "defect":
            hit = 0
            for t in thresholds:
                if catches(t, e[1]) == 1:
                    hit = 1
            n = n + hit
    return n

def total_defects(events):
    n = 0
    for e in events:
        if e[0] == "defect":
            n = n + 1
    return n

events = [["noise", 1], ["noise", 2], ["defect", 4], ["noise", 1], ["noise", 3], ["defect", 9], ["noise", 2], ["defect", 5], ["noise", 1], ["defect", 16], ["noise", 2], ["defect", 7], ["noise", 3], ["defect", 30], ["noise", 1], ["defect", 12]]
thresholds = [1, 4, 8, 20]
check_names = ["A", "B", "C", "D"]
defect_count = total_defects(events)
print("real defects in the stream : " + str(defect_count))
print("noise events               : " + str(len(events) - defect_count))
print("")
print("round  thresholds        alarms per check     defects caught")
for round_no in range(0, 5):
    alarms = []
    for t in thresholds:
        alarms = alarms + [alarms_for(t, events)]
    caught = real_defects_caught(thresholds, events)
    print("  " + str(round_no) + "    " + repr(thresholds) + "   " + repr(alarms) + "   " + str(caught) + " of " + str(defect_count))
    loudest = max(alarms)
    i = 0
    done = 0
    next_thresholds = []
    for t in thresholds:
        if alarms[i] == loudest:
            if done == 0:
                next_thresholds = next_thresholds + [t * 2]
                done = 1
            else:
                next_thresholds = next_thresholds + [t]
        else:
            next_thresholds = next_thresholds + [t]
        i = i + 1
    thresholds = next_thresholds
print("")
original = [1, 4, 8, 20]
print("threshold, start and end")
i = 0
raised = 0
for t in original:
    if thresholds[i] != t:
        raised = raised + 1
        print("  check " + check_names[i] + " : " + str(t) + " -> " + str(thresholds[i]) + "  (raised)")
    else:
        print("  check " + check_names[i] + " : " + str(t) + " -> " + str(thresholds[i]))
    i = i + 1
print("  checks raised : " + str(raised) + " of " + str(len(original)))
print("")
print("alarms raised by each check at the start")
i = 0
for t in original:
    print("  check " + check_names[i] + " (threshold " + str(t) + ") : " + str(alarms_for(t, events)) + " alarms, ")
    i = i + 1
print("")
before = real_defects_caught(original, events)
after = real_defects_caught(thresholds, events)
print("defects the suite catches")
print("  before the policy ran : " + str(before) + " of " + str(defect_count))
print("  after                 : " + str(after) + " of " + str(defect_count))
print("  lost                  : " + str(before - after))
print("")
alarms_before = 0
for t in original:
    alarms_before = alarms_before + alarms_for(t, events)
alarms_after = 0
for t in thresholds:
    alarms_after = alarms_after + alarms_for(t, events)
print("total alarms across the suite")
print("  before : " + str(alarms_before))
print("  after  : " + str(alarms_after))
print("  the policy achieved exactly what it was asked to achieve")
print("")
print("Every application of the policy was justified on its own terms. The policy")
print("has a direction anyway, and the direction is toward a suite that is quiet")
print("because there is nothing left in it that can speak.")
```

## stdout (executed)

```text
real defects in the stream : 7
noise events               : 9

round  thresholds        alarms per check     defects caught
  0    [1, 4, 8, 20]   [16, 7, 4, 1]   7 of 7
  1    [2, 4, 8, 20]   [12, 7, 4, 1]   7 of 7
  2    [4, 4, 8, 20]   [7, 7, 4, 1]   7 of 7
  3    [8, 4, 8, 20]   [4, 7, 4, 1]   7 of 7
  4    [8, 8, 8, 20]   [4, 4, 4, 1]   4 of 7

threshold, start and end
  check A : 1 -> 16  (raised)
  check B : 4 -> 8  (raised)
  check C : 8 -> 8
  check D : 20 -> 20
  checks raised : 2 of 4

alarms raised by each check at the start
  check A (threshold 1) : 16 alarms, 
  check B (threshold 4) : 7 alarms, 
  check C (threshold 8) : 4 alarms, 
  check D (threshold 20) : 1 alarms, 

defects the suite catches
  before the policy ran : 7 of 7
  after                 : 4 of 7
  lost                  : 3

total alarms across the suite
  before : 28
  after  : 11
  the policy achieved exactly what it was asked to achieve

Every application of the policy was justified on its own terms. The policy
has a direction anyway, and the direction is toward a suite that is quiet
because there is nothing left in it that can speak.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
