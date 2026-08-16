<!-- canonical: efficientnewlanguage.org/ai/examples/405-renaming-the-category-changed-the-trend | ai_layer_version: 0.1.0 | updated: 2026-08-16 -->

# Example 405 — Renaming the category changed the trend - a 50% drop that is entirely definitional

`renaming_the_category_changed_the_trend.eml` counts every month under both rules, so the definitional part of the step separates from the real part.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Critical incidents
# fell by half in month 4. The definition of critical changed in month 4.
#
# Tightening the definition was the right call. "Critical" had drifted to mean
# anything an engineer was paged for, the label had stopped carrying weight,
# and requiring customer impact restored it. The new rule is better than the
# old one and everybody agreed.
#
# The series it feeds was not restated. Months 1 to 3 are counted by the old
# rule and months 4 onward by the new one, so the chart contains a step that
# is a change of definition and reads as a change in the world.
#
# Every month is counted under both rules here, so the definitional part of
# the step can be separated from the real part.

# [month, incident, paged, customer impact]
[[1, "a", 1, 1], [1, "b", 1, 0], [1, "c", 1, 0], [1, "d", 1, 1], [2, "e", 1, 1], [2, "f", 1, 0], [2, "g", 1, 0], [2, "h", 1, 1], [3, "i", 1, 1], [3, "j", 1, 0], [3, "k", 1, 0], [3, "l", 1, 1], [4, "m", 1, 1], [4, "n", 1, 0], [4, "o", 1, 0], [4, "p", 1, 1], [5, "q", 1, 1], [5, "r", 1, 0], [6, "t", 1, 1], [6, "u", 1, 0]] => incidents

4 => rule_changed_in

def old_rule(i):
    return i[2]

def new_rule(i):
    return i[3]

def count(month, rule):
    0 => c
    for i in incidents:
        if i[0] == month:
            if rule == 0:
                c + old_rule(i) => c
            else:
                c + new_rule(i) => c
    return c

def as_reported(month):
    if month < rule_changed_in:
        return count(month, 0)
    return count(month, 1)

"month   old rule   new rule   as reported" ^0
for m in [1:6]:
    "  " + str(m) + "        " + str(count(m, 0)) + "          " + str(count(m, 1)) + "          " + str(as_reported(m)) ^0
"" ^0

# ---- the step in the reported series ----

as_reported(3) => before
as_reported(4) => after
"the step everyone sees" ^0
"  month 3 : " + str(before) ^0
"  month 4 : " + str(after) ^0
"  drop : " + str(int((before - after) * 100 / before)) + "%" ^0
"" ^0

"the same two months under one rule" ^0
"  old rule : " + str(count(3, 0)) + " -> " + str(count(4, 0)) ^0
"  new rule : " + str(count(3, 1)) + " -> " + str(count(4, 1)) ^0
if count(3, 0) == count(4, 0):
    if count(3, 1) == count(4, 1):
        "  under either rule, nothing changed between those months" ^0
"" ^0

# ---- the whole step is definitional ----

count(4, 0) - count(4, 1) => definitional
before - after => observed_drop
"  observed drop      : " + str(observed_drop) ^0
"  definitional part  : " + str(definitional) ^0
"  real part          : " + str(observed_drop - definitional) ^0
if observed_drop == definitional:
    "  the entire step is the definition" ^0
"" ^0

# ---- what the consistent series say ----

"the series, restated under one rule throughout" ^0
"" => o
"" => n
for m in [1:6]:
    o + str(count(m, 0)) + " " => o
    n + str(count(m, 1)) + " " => n
"  old rule throughout : " + o ^0
"  new rule throughout : " + n ^0
"" => r
for m in [1:6]:
    r + str(as_reported(m)) + " " => r
"  as reported         : " + r ^0
"" ^0

# ---- and the real change, which the step hides ----
#
# There IS a change in this data. It happens in month 5, it is visible under
# both consistent rules, and it is smaller than the definitional step.

"the real change" ^0
"  old rule, month 4 -> 5 : " + str(count(4, 0)) + " -> " + str(count(5, 0)) ^0
"  new rule, month 4 -> 5 : " + str(count(4, 1)) + " -> " + str(count(5, 1)) ^0
count(4, 0) - count(5, 0) => real_drop_old
count(4, 1) - count(5, 1) => real_drop_new
if real_drop_old > 0:
    if real_drop_new > 0:
        "  a real drop, visible under BOTH rules" ^0
    else:
        "  a drop the old rule sees and the new one does not" ^0
if definitional > real_drop_old:
    "  the definitional step is larger than the real one, and comes first" ^0
elif definitional == real_drop_old:
    "  the definitional step and the real one are the same size, and the" ^0
    "  definitional one comes first" ^0
"" ^0

# ---- the control: a definition change with the series restated ----
#
# Changing a definition is not the defect. Not restating the history is, and
# restating costs one pass over data that already exists.

"control - the same change with months 1-3 recounted under the new rule" ^0
"" => c2
for m in [1:6]:
    c2 + str(count(m, 1)) + " " => c2
"  restated series : " + c2 ^0
if count(3, 1) == count(4, 1):
    "  no step at month 4" ^0
if count(5, 1) < count(4, 1):
    "  and the month 5 change is still visible" ^0
else:
    "  and the month 5 change is NOT visible under this rule" ^0
"" ^0

"The new definition is better than the old one. The chart splices two rules" ^0
"end to end, and a splice looks exactly like an event." ^0
```

## Python (deterministic transpilation)

```python
incidents = [[1, "a", 1, 1], [1, "b", 1, 0], [1, "c", 1, 0], [1, "d", 1, 1], [2, "e", 1, 1], [2, "f", 1, 0], [2, "g", 1, 0], [2, "h", 1, 1], [3, "i", 1, 1], [3, "j", 1, 0], [3, "k", 1, 0], [3, "l", 1, 1], [4, "m", 1, 1], [4, "n", 1, 0], [4, "o", 1, 0], [4, "p", 1, 1], [5, "q", 1, 1], [5, "r", 1, 0], [6, "t", 1, 1], [6, "u", 1, 0]]
rule_changed_in = 4

def old_rule(i):
    return i[2]

def new_rule(i):
    return i[3]

def count(month, rule):
    c = 0
    for i in incidents:
        if i[0] == month:
            if rule == 0:
                c = c + old_rule(i)
            else:
                c = c + new_rule(i)
    return c

def as_reported(month):
    if month < rule_changed_in:
        return count(month, 0)
    return count(month, 1)

print("month   old rule   new rule   as reported")
for m in range(1, 7):
    print("  " + str(m) + "        " + str(count(m, 0)) + "          " + str(count(m, 1)) + "          " + str(as_reported(m)))
print("")
before = as_reported(3)
after = as_reported(4)
print("the step everyone sees")
print("  month 3 : " + str(before))
print("  month 4 : " + str(after))
print("  drop : " + str(int((before - after) * 100 / before)) + "%")
print("")
print("the same two months under one rule")
print("  old rule : " + str(count(3, 0)) + " -> " + str(count(4, 0)))
print("  new rule : " + str(count(3, 1)) + " -> " + str(count(4, 1)))
if count(3, 0) == count(4, 0):
    if count(3, 1) == count(4, 1):
        print("  under either rule, nothing changed between those months")
print("")
definitional = count(4, 0) - count(4, 1)
observed_drop = before - after
print("  observed drop      : " + str(observed_drop))
print("  definitional part  : " + str(definitional))
print("  real part          : " + str(observed_drop - definitional))
if observed_drop == definitional:
    print("  the entire step is the definition")
print("")
print("the series, restated under one rule throughout")
o = ""
n = ""
for m in range(1, 7):
    o = o + str(count(m, 0)) + " "
    n = n + str(count(m, 1)) + " "
print("  old rule throughout : " + o)
print("  new rule throughout : " + n)
r = ""
for m in range(1, 7):
    r = r + str(as_reported(m)) + " "
print("  as reported         : " + r)
print("")
print("the real change")
print("  old rule, month 4 -> 5 : " + str(count(4, 0)) + " -> " + str(count(5, 0)))
print("  new rule, month 4 -> 5 : " + str(count(4, 1)) + " -> " + str(count(5, 1)))
real_drop_old = count(4, 0) - count(5, 0)
real_drop_new = count(4, 1) - count(5, 1)
if real_drop_old > 0:
    if real_drop_new > 0:
        print("  a real drop, visible under BOTH rules")
    else:
        print("  a drop the old rule sees and the new one does not")
if definitional > real_drop_old:
    print("  the definitional step is larger than the real one, and comes first")
elif definitional == real_drop_old:
    print("  the definitional step and the real one are the same size, and the")
    print("  definitional one comes first")
print("")
print("control - the same change with months 1-3 recounted under the new rule")
c2 = ""
for m in range(1, 7):
    c2 = c2 + str(count(m, 1)) + " "
print("  restated series : " + c2)
if count(3, 1) == count(4, 1):
    print("  no step at month 4")
if count(5, 1) < count(4, 1):
    print("  and the month 5 change is still visible")
else:
    print("  and the month 5 change is NOT visible under this rule")
print("")
print("The new definition is better than the old one. The chart splices two rules")
print("end to end, and a splice looks exactly like an event.")
```

## stdout (executed)

```text
month   old rule   new rule   as reported
  1        4          2          4
  2        4          2          4
  3        4          2          4
  4        4          2          2
  5        2          1          1
  6        2          1          1

the step everyone sees
  month 3 : 4
  month 4 : 2
  drop : 50%

the same two months under one rule
  old rule : 4 -> 4
  new rule : 2 -> 2
  under either rule, nothing changed between those months

  observed drop      : 2
  definitional part  : 2
  real part          : 0
  the entire step is the definition

the series, restated under one rule throughout
  old rule throughout : 4 4 4 4 2 2 
  new rule throughout : 2 2 2 2 1 1 
  as reported         : 4 4 4 2 1 1 

the real change
  old rule, month 4 -> 5 : 4 -> 2
  new rule, month 4 -> 5 : 2 -> 1
  a real drop, visible under BOTH rules
  the definitional step and the real one are the same size, and the
  definitional one comes first

control - the same change with months 1-3 recounted under the new rule
  restated series : 2 2 2 2 1 1 
  no step at month 4
  and the month 5 change is still visible

The new definition is better than the old one. The chart splices two rules
end to end, and a splice looks exactly like an event.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
