<!-- canonical: efficientnewlanguage.org/ai/examples/502-the-quota-went-to-whoever-was-in-the-room | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 502 — The quota went to whoever was in the room

`the_quota_went_to_whoever_was_in_the_room.eml` - The quarter's compute budget was divided in a planning meeting. How the shares compare to what each team runs is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The quarter's
# compute budget was divided in a planning meeting. How the shares compare to
# what each team runs is computed below.
#
# Dividing it in a meeting is the right method for the problem as posed. The
# budget is fixed, the claims exceed it, and a room where the trade-offs are
# argued out loud produces a better allocation than a spreadsheet formula
# nobody agrees with. Everyone who spoke made a real case.
#
# The room is the sample. A team that was not there made no case, and a team
# that sends a person who argues well makes a better one - and neither
# attendance nor argument is the quantity the budget is supposed to track.
#
# Allocation and usage are computed side by side.

# [team, sent someone to the meeting, share of actual compute used in tenths of a percent, share allocated in tenths]
[["ranking", 1, 210, 300], ["ingest", 1, 180, 260], ["billing", 0, 150, 40], ["search", 1, 120, 200], ["reporting", 0, 190, 50], ["mobile api", 1, 60, 110], ["ml training", 0, 90, 40]] => teams

len(teams) => n
0 => attended
0 => used_total
0 => alloc_total
for t in teams:
    attended + t[1] => attended
    used_total + t[2] => used_total
    alloc_total + t[3] => alloc_total

"teams : " + str(n) + ", sent someone : " + str(attended) ^0
"" ^0
"team          in the room   uses   allocated   difference" ^0
for t in teams:
    "" => r
    if t[1] == 1:
        r + "yes" => r
    else:
        r + "no " => r
    t[3] - t[2] => d
    "" => sign
    if d >= 0:
        sign + "+" => sign
    "  " + t[0] + "   " + r + "           " + str(int(t[2] / 10)) + "." + str(t[2] % 10) + "%   " + str(int(t[3] / 10)) + "." + str(t[3] % 10) + "%       " + sign + str(int(d / 10)) + "." + str(int(d % 10)) + " points" ^0
"" ^0

# ---- the split by attendance ----

0 => in_used
0 => in_alloc
0 => out_used
0 => out_alloc
for t in teams:
    if t[1] == 1:
        in_used + t[2] => in_used
        in_alloc + t[3] => in_alloc
    else:
        out_used + t[2] => out_used
        out_alloc + t[3] => out_alloc

"teams in the room : " + str(attended) ^0
"  they use      : " + str(int(in_used / 10)) + "% of compute" ^0
"  they received : " + str(int(in_alloc / 10)) + "% of the budget" ^0
"teams not in the room : " + str(n - attended) ^0
"  they use      : " + str(int(out_used / 10)) + "%" ^0
"  they received : " + str(int(out_alloc / 10)) + "%" ^0
if in_alloc > in_used:
    "  the room took " + str(int((in_alloc - in_used) / 10)) + " points more than it uses" ^0
"" ^0

# ---- what happens to the teams that were not there ----

"teams allocated less than they use" ^0
0 => short
for t in teams:
    if t[3] < t[2]:
        short + 1 => short
        "  " + t[0] + " : uses " + str(int(t[2] / 10)) + "%, allocated " + str(int(t[3] / 10)) + "%" ^0
"  count : " + str(short) ^0
0 => short_absent
for t in teams:
    if t[3] < t[2]:
        if t[1] == 0:
            short_absent + 1 => short_absent
if short > 0:
    "  of those, absent from the meeting : " + str(short_absent) + " of " + str(short) ^0
"" ^0

# ---- what a shortfall costs ----

"what a team does when its allocation is under its usage" ^0
"  stop running the work : rarely, the work is why the team exists" ^0
"  run it anyway         : the usual outcome, charged somewhere else" ^0
"  escalate next quarter : which is attending the meeting, one quarter late" ^0
"  so the allocation does not bind the usage; it decides who has to argue" ^0
"" ^0

# ---- the meeting's own record ----

"what the meeting minutes contain" ^0
"  claims made      : " + str(attended) ^0
"  claims evaluated : " + str(attended) ^0
"  claims not made  : " + str(n - attended) + ", and these appear nowhere" ^0
"  every decision in the minutes is defensible and the minutes are complete" ^0
"  for the room" ^0
"" ^0

# ---- what the usage data would have given for free ----

"allocating on last quarter's measured usage instead" ^0
0 => moved
for t in teams:
    t[2] - t[3] => d
    if d < 0:
        0 - d => d
    moved + d => moved
"  points that would move : " + str(int(moved / 20)) + " (half the total absolute change)" ^0
"  meetings needed        : 0, the numbers are already collected" ^0
"  what is lost           : the argument about what SHOULD change, which is" ^0
"  the thing a meeting is actually good at" ^0
"  so the fix is not to cancel the meeting but to start it from the usage" ^0
"" ^0

# ---- the control: a meeting everybody attends ----
#
# Where every team sends someone, attendance is constant and the allocation
# varies only with the arguments, which is what the method intends.

[["a", 1, 300, 320], ["b", 1, 400, 380], ["c", 1, 300, 300]] => full
0 => f_att
for t in full:
    f_att + t[1] => f_att
"control - a meeting with every team present" ^0
"  attendance : " + str(f_att) + " of " + str(len(full)) ^0
if f_att == len(full):
    "  attendance cannot explain any difference here, so what remains is the" ^0
    "  arguments - which is the method working as designed" ^0
"" ^0

"A room where the trade-offs are argued beats a formula nobody agrees with," ^0
"and every case made in it was real. The cases that were not made are absent" ^0
"from the minutes and from the budget, and absence is not evidence of not" ^0
"needing any." ^0
```

## Python (deterministic transpilation)

```python
teams = [["ranking", 1, 210, 300], ["ingest", 1, 180, 260], ["billing", 0, 150, 40], ["search", 1, 120, 200], ["reporting", 0, 190, 50], ["mobile api", 1, 60, 110], ["ml training", 0, 90, 40]]
n = len(teams)
attended = 0
used_total = 0
alloc_total = 0
for t in teams:
    attended = attended + t[1]
    used_total = used_total + t[2]
    alloc_total = alloc_total + t[3]
print("teams : " + str(n) + ", sent someone : " + str(attended))
print("")
print("team          in the room   uses   allocated   difference")
for t in teams:
    r = ""
    if t[1] == 1:
        r = r + "yes"
    else:
        r = r + "no "
    d = t[3] - t[2]
    sign = ""
    if d >= 0:
        sign = sign + "+"
    print("  " + t[0] + "   " + r + "           " + str(int(t[2] / 10)) + "." + str(t[2] % 10) + "%   " + str(int(t[3] / 10)) + "." + str(t[3] % 10) + "%       " + sign + str(int(d / 10)) + "." + str(int(d % 10)) + " points")
print("")
in_used = 0
in_alloc = 0
out_used = 0
out_alloc = 0
for t in teams:
    if t[1] == 1:
        in_used = in_used + t[2]
        in_alloc = in_alloc + t[3]
    else:
        out_used = out_used + t[2]
        out_alloc = out_alloc + t[3]
print("teams in the room : " + str(attended))
print("  they use      : " + str(int(in_used / 10)) + "% of compute")
print("  they received : " + str(int(in_alloc / 10)) + "% of the budget")
print("teams not in the room : " + str(n - attended))
print("  they use      : " + str(int(out_used / 10)) + "%")
print("  they received : " + str(int(out_alloc / 10)) + "%")
if in_alloc > in_used:
    print("  the room took " + str(int((in_alloc - in_used) / 10)) + " points more than it uses")
print("")
print("teams allocated less than they use")
short = 0
for t in teams:
    if t[3] < t[2]:
        short = short + 1
        print("  " + t[0] + " : uses " + str(int(t[2] / 10)) + "%, allocated " + str(int(t[3] / 10)) + "%")
print("  count : " + str(short))
short_absent = 0
for t in teams:
    if t[3] < t[2]:
        if t[1] == 0:
            short_absent = short_absent + 1
if short > 0:
    print("  of those, absent from the meeting : " + str(short_absent) + " of " + str(short))
print("")
print("what a team does when its allocation is under its usage")
print("  stop running the work : rarely, the work is why the team exists")
print("  run it anyway         : the usual outcome, charged somewhere else")
print("  escalate next quarter : which is attending the meeting, one quarter late")
print("  so the allocation does not bind the usage; it decides who has to argue")
print("")
print("what the meeting minutes contain")
print("  claims made      : " + str(attended))
print("  claims evaluated : " + str(attended))
print("  claims not made  : " + str(n - attended) + ", and these appear nowhere")
print("  every decision in the minutes is defensible and the minutes are complete")
print("  for the room")
print("")
print("allocating on last quarter's measured usage instead")
moved = 0
for t in teams:
    d = t[2] - t[3]
    if d < 0:
        d = 0 - d
    moved = moved + d
print("  points that would move : " + str(int(moved / 20)) + " (half the total absolute change)")
print("  meetings needed        : 0, the numbers are already collected")
print("  what is lost           : the argument about what SHOULD change, which is")
print("  the thing a meeting is actually good at")
print("  so the fix is not to cancel the meeting but to start it from the usage")
print("")
full = [["a", 1, 300, 320], ["b", 1, 400, 380], ["c", 1, 300, 300]]
f_att = 0
for t in full:
    f_att = f_att + t[1]
print("control - a meeting with every team present")
print("  attendance : " + str(f_att) + " of " + str(len(full)))
if f_att == len(full):
    print("  attendance cannot explain any difference here, so what remains is the")
    print("  arguments - which is the method working as designed")
print("")
print("A room where the trade-offs are argued beats a formula nobody agrees with,")
print("and every case made in it was real. The cases that were not made are absent")
print("from the minutes and from the budget, and absence is not evidence of not")
print("needing any.")
```

## stdout (executed)

```text
teams : 7, sent someone : 4

team          in the room   uses   allocated   difference
  ranking   yes           21.0%   30.0%       +9.0 points
  ingest   yes           18.0%   26.0%       +8.0 points
  billing   no            15.0%   4.0%       -11.0 points
  search   yes           12.0%   20.0%       +8.0 points
  reporting   no            19.0%   5.0%       -14.0 points
  mobile api   yes           6.0%   11.0%       +5.0 points
  ml training   no            9.0%   4.0%       -5.0 points

teams in the room : 4
  they use      : 57% of compute
  they received : 87% of the budget
teams not in the room : 3
  they use      : 43%
  they received : 13%
  the room took 30 points more than it uses

teams allocated less than they use
  billing : uses 15%, allocated 4%
  reporting : uses 19%, allocated 5%
  ml training : uses 9%, allocated 4%
  count : 3
  of those, absent from the meeting : 3 of 3

what a team does when its allocation is under its usage
  stop running the work : rarely, the work is why the team exists
  run it anyway         : the usual outcome, charged somewhere else
  escalate next quarter : which is attending the meeting, one quarter late
  so the allocation does not bind the usage; it decides who has to argue

what the meeting minutes contain
  claims made      : 4
  claims evaluated : 4
  claims not made  : 3, and these appear nowhere
  every decision in the minutes is defensible and the minutes are complete
  for the room

allocating on last quarter's measured usage instead
  points that would move : 30 (half the total absolute change)
  meetings needed        : 0, the numbers are already collected
  what is lost           : the argument about what SHOULD change, which is
  the thing a meeting is actually good at
  so the fix is not to cancel the meeting but to start it from the usage

control - a meeting with every team present
  attendance : 3 of 3
  attendance cannot explain any difference here, so what remains is the
  arguments - which is the method working as designed

A room where the trade-offs are argued beats a formula nobody agrees with,
and every case made in it was real. The cases that were not made are absent
from the minutes and from the budget, and absence is not evidence of not
needing any.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
