<!-- canonical: efficientnewlanguage.org/ai/examples/427-the-incident-everyone-remembers | ai_layer_version: 0.1.0 | updated: 2026-08-17 -->

# Example 427 — The incident everyone remembers

`the_incident_everyone_remembers.eml` - The outage nobody will forget cost less than the class nobody can name.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The outage nobody
# will forget cost less than the class nobody can name.
#
# Remembering it is not irrational. It was long, it happened during the day, it
# was visible to customers, and everyone was in the room for it - all of which
# are real features of a serious incident, and all of which are also features
# that make an event memorable independently of what it cost.
#
# The other class arrives in fifteen-minute pieces, at night, one team at a
# time. Nobody was ever in a room for it, so there is no shared memory of it to
# be weighed against anything.
#
# Both totals are computed from the same incident list.

# [class, occurrences, minutes each, daytime, everyone paged]
[["the big one", 1, 380, 1, 1], ["slow checkout", 41, 14, 0, 0], ["stale cache", 22, 9, 0, 0], ["auth flap", 7, 25, 1, 0]] => classes

def minutes(c):
    return c[1] * c[2]

def total_minutes():
    0 => t
    for c in classes:
        t + minutes(c) => t
    return t

"class            times   each   total   daytime   all-hands" ^0
for c in classes:
    "" => d
    if c[3] == 1:
        d + "yes" => d
    else:
        d + "no " => d
    "" => e
    if c[4] == 1:
        e + "yes" => e
    else:
        e + "no " => e
    "  " + c[0] + "   " + str(c[1]) + "     " + str(c[2]) + "    " + str(minutes(c)) + "     " + d + "     " + e ^0
"  total minutes : " + str(total_minutes()) ^0
"" ^0

# ---- which class costs the most ----

0 => worst
0 => worst_at
0 => i
for c in classes:
    if minutes(c) > worst:
        minutes(c) => worst
        i => worst_at
    i + 1 => i
"the costliest class" ^0
"  " + classes[worst_at][0] + " : " + str(worst) + " minutes  (" + str(int(worst * 100 / total_minutes())) + "%)" ^0
"" ^0

# ---- which one is memorable ----

0 => memorable_at
0 => j
for c in classes:
    if c[3] == 1:
        if c[4] == 1:
            j => memorable_at
    j + 1 => j
"the memorable one" ^0
"  " + classes[memorable_at][0] + " : " + str(minutes(classes[memorable_at])) + " minutes  (" + str(int(minutes(classes[memorable_at]) * 100 / total_minutes())) + "%)" ^0
if not (memorable_at == worst_at):
    "  it is not the costliest" ^0
"" ^0

# ---- where the engineering went ----

# [class index, engineer-days spent on prevention afterwards]
[[0, 30], [1, 2], [2, 0], [3, 1]] => effort

def days(idx):
    for e in effort:
        if e[0] == idx:
            return e[1]
    return 0

0 => total_days
for e in effort:
    total_days + e[1] => total_days

"prevention effort against cost" ^0
0 => k
for c in classes:
    "  " + c[0] + " : " + str(int(minutes(c) * 100 / total_minutes())) + "% of the cost, " + str(int(days(k) * 100 / total_days)) + "% of the effort" ^0
    k + 1 => k
"" ^0

# ---- what a proportional allocation would look like ----

"if effort followed cost" ^0
0 => m
for c in classes:
    int(minutes(c) * total_days / total_minutes()) => want
    "  " + c[0] + " : " + str(days(m)) + " days spent, " + str(want) + " proportional" ^0
    m + 1 => m
"" ^0

# ---- the class nobody can name ----

0 => nameless_minutes
0 => nameless_days
0 => n
for c in classes:
    if c[4] == 0:
        nameless_minutes + minutes(c) => nameless_minutes
        nameless_days + days(n) => nameless_days
    n + 1 => n
"incidents nobody was all paged for" ^0
"  their share of downtime : " + str(int(nameless_minutes * 100 / total_minutes())) + "%" ^0
"  their share of effort   : " + str(int(nameless_days * 100 / total_days)) + "%" ^0
"" ^0

# ---- the control: a memorable incident that IS the costliest ----
#
# Memorability is not the defect. It is a good heuristic exactly when the
# dramatic event is also the expensive one, which is often.

[["the big one", 1, 900, 1, 1], ["small stuff", 20, 5, 0, 0]] => aligned
0 => at
for c in aligned:
    at + c[1] * c[2] => at
"control - a year where the dramatic incident really is the expensive one" ^0
"  the big one : " + str(int(aligned[0][1] * aligned[0][2] * 100 / at)) + "% of downtime" ^0
if aligned[0][1] * aligned[0][2] * 100 / at > 50:
    "  here memory and cost point the same way" ^0
"" ^0

"Every property that made the outage memorable is a real property of a serious" ^0
"incident. None of them is duration times frequency, and that is the quantity" ^0
"the year is made of." ^0
```

## Python (deterministic transpilation)

```python
classes = [["the big one", 1, 380, 1, 1], ["slow checkout", 41, 14, 0, 0], ["stale cache", 22, 9, 0, 0], ["auth flap", 7, 25, 1, 0]]

def minutes(c):
    return c[1] * c[2]

def total_minutes():
    t = 0
    for c in classes:
        t = t + minutes(c)
    return t

print("class            times   each   total   daytime   all-hands")
for c in classes:
    d = ""
    if c[3] == 1:
        d = d + "yes"
    else:
        d = d + "no "
    e = ""
    if c[4] == 1:
        e = e + "yes"
    else:
        e = e + "no "
    print("  " + c[0] + "   " + str(c[1]) + "     " + str(c[2]) + "    " + str(minutes(c)) + "     " + d + "     " + e)
print("  total minutes : " + str(total_minutes()))
print("")
worst = 0
worst_at = 0
i = 0
for c in classes:
    if minutes(c) > worst:
        worst = minutes(c)
        worst_at = i
    i = i + 1
print("the costliest class")
print("  " + classes[worst_at][0] + " : " + str(worst) + " minutes  (" + str(int(worst * 100 / total_minutes())) + "%)")
print("")
memorable_at = 0
j = 0
for c in classes:
    if c[3] == 1:
        if c[4] == 1:
            memorable_at = j
    j = j + 1
print("the memorable one")
print("  " + classes[memorable_at][0] + " : " + str(minutes(classes[memorable_at])) + " minutes  (" + str(int(minutes(classes[memorable_at]) * 100 / total_minutes())) + "%)")
if not memorable_at == worst_at:
    print("  it is not the costliest")
print("")
effort = [[0, 30], [1, 2], [2, 0], [3, 1]]

def days(idx):
    for e in effort:
        if e[0] == idx:
            return e[1]
    return 0

total_days = 0
for e in effort:
    total_days = total_days + e[1]
print("prevention effort against cost")
k = 0
for c in classes:
    print("  " + c[0] + " : " + str(int(minutes(c) * 100 / total_minutes())) + "% of the cost, " + str(int(days(k) * 100 / total_days)) + "% of the effort")
    k = k + 1
print("")
print("if effort followed cost")
m = 0
for c in classes:
    want = int(minutes(c) * total_days / total_minutes())
    print("  " + c[0] + " : " + str(days(m)) + " days spent, " + str(want) + " proportional")
    m = m + 1
print("")
nameless_minutes = 0
nameless_days = 0
n = 0
for c in classes:
    if c[4] == 0:
        nameless_minutes = nameless_minutes + minutes(c)
        nameless_days = nameless_days + days(n)
    n = n + 1
print("incidents nobody was all paged for")
print("  their share of downtime : " + str(int(nameless_minutes * 100 / total_minutes())) + "%")
print("  their share of effort   : " + str(int(nameless_days * 100 / total_days)) + "%")
print("")
aligned = [["the big one", 1, 900, 1, 1], ["small stuff", 20, 5, 0, 0]]
at = 0
for c in aligned:
    at = at + c[1] * c[2]
print("control - a year where the dramatic incident really is the expensive one")
print("  the big one : " + str(int(aligned[0][1] * aligned[0][2] * 100 / at)) + "% of downtime")
if aligned[0][1] * aligned[0][2] * 100 / at > 50:
    print("  here memory and cost point the same way")
print("")
print("Every property that made the outage memorable is a real property of a serious")
print("incident. None of them is duration times frequency, and that is the quantity")
print("the year is made of.")
```

## stdout (executed)

```text
class            times   each   total   daytime   all-hands
  the big one   1     380    380     yes     yes
  slow checkout   41     14    574     no      no 
  stale cache   22     9    198     no      no 
  auth flap   7     25    175     yes     no 
  total minutes : 1327

the costliest class
  slow checkout : 574 minutes  (43%)

the memorable one
  the big one : 380 minutes  (28%)
  it is not the costliest

prevention effort against cost
  the big one : 28% of the cost, 90% of the effort
  slow checkout : 43% of the cost, 6% of the effort
  stale cache : 14% of the cost, 0% of the effort
  auth flap : 13% of the cost, 3% of the effort

if effort followed cost
  the big one : 30 days spent, 9 proportional
  slow checkout : 2 days spent, 14 proportional
  stale cache : 0 days spent, 4 proportional
  auth flap : 1 days spent, 4 proportional

incidents nobody was all paged for
  their share of downtime : 71%
  their share of effort   : 9%

control - a year where the dramatic incident really is the expensive one
  the big one : 90% of downtime
  here memory and cost point the same way

Every property that made the outage memorable is a real property of a serious
incident. None of them is duration times frequency, and that is the quantity
the year is made of.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
