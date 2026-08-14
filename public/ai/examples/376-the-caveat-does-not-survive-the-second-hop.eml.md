<!-- canonical: efficientnewlanguage.org/ai/examples/376-the-caveat-does-not-survive-the-second-hop | ai_layer_version: 0.1.0 | updated: 2026-08-14 -->

# Example 376 — The caveat does not survive the second hop — 3 of 3 qualifiers gone, number unchanged

`the_caveat_does_not_survive_the_second_hop.eml` walks one payload through four consumers and asks what is left at each.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The qualifier was
# attached. It is dropped at the first consumer that has no field for it.
#
# "Carry the caveat with the number" is the standard fix, and it works at the
# first hop. What it does not survive is a consumer that reshapes the record -
# which every consumer does, because each one keeps the fields its own schema
# names and the caveat is not in that schema.
#
# The number is never altered. Every hop copies it exactly. What changes is how
# much of the record travels with it, and that is measured here by walking the
# same payload through each hop and asking what is left.

# The record as produced.
[["value", "59"], ["basis", "of those who reached the step"], ["window", "days 1-6"], ["excludes", "trial accounts"]] => origin

# Each hop keeps only the fields its schema names. This is not neglect; it is
# what a schema is for.
[["dashboard row", ["value", "basis", "window", "excludes"]], ["weekly rollup", ["value", "window"]], ["exec summary", ["value"]], ["press line", ["value"]]] => hops

def has_field(record, name):
    for f in record:
        if f[0] == name:
            return 1
    return 0

def project(record, keep):
    [] => out
    for f in record:
        for k in keep:
            if f[0] == k:
                out + [f] => out
    return out

def value_of(record):
    for f in record:
        if f[0] == "value":
            return f[1]
    return "?"

"the record as produced" ^0
for f in origin:
    "  " + f[0] + " : " + f[1] ^0
"  fields : " + str(len(origin)) ^0
"" ^0

"each hop" ^0
origin => cur
0 => first_loss
0 => hop_no
for h in hops:
    project(cur, h[1]) => cur
    hop_no + 1 => hop_no
    "  " + h[0] + " : value=" + value_of(cur) + ", fields=" + str(len(cur)) ^0
    if len(cur) < len(origin):
        if first_loss == 0:
            hop_no => first_loss
"" ^0

"  the value at the last hop : " + value_of(cur) ^0
"  the value at the source   : " + value_of(origin) ^0
if value_of(cur) == value_of(origin):
    "  the number survived every hop unchanged" ^0
"  fields at the last hop : " + str(len(cur)) + " of " + str(len(origin)) ^0
"  first hop that dropped something : " + str(first_loss) ^0
"" ^0

# ---- which fields are gone, and what they were for ----

"fields lost" ^0
0 => lost
for f in origin:
    if has_field(cur, f[0]) == 0:
        lost + 1 => lost
        "  " + f[0] + " (" + f[1] + ")" ^0
"  lost : " + str(lost) + " of " + str(len(origin) - 1) + " qualifiers" ^0
"" ^0

# ---- the reader at the end, asked what the number means ----

"what each hop can still answer" ^0
["is this of everyone or of those who got there", "which window", "who is excluded"] => questions
["basis", "window", "excludes"] => needed
origin => cur2
for h in hops:
    project(cur2, h[1]) => cur2
    0 => can
    0 => qi
    for n in needed:
        can + has_field(cur2, n) => can
        qi + 1 => qi
    "  " + h[0] + " : " + str(can) + " of " + str(len(needed)) ^0
"" ^0

# ---- the control: a hop whose schema does name the qualifiers ----
#
# The dashboard row keeps all four. So schemas do not lose things by nature -
# they lose the fields nobody put in them.

project(origin, hops[0][1]) => d0
"control - the first hop, whose schema names all four fields" ^0
"  fields kept : " + str(len(d0)) + " of " + str(len(origin)) ^0
if len(d0) == len(origin):
    "  nothing is lost where the schema has somewhere to put it" ^0
"" ^0

"Attaching the caveat is a fix at the boundary you can see. Past the first" ^0
"reshaping, the number travels alone and still reads as an answer." ^0
```

## Python (deterministic transpilation)

```python
origin = [["value", "59"], ["basis", "of those who reached the step"], ["window", "days 1-6"], ["excludes", "trial accounts"]]
hops = [["dashboard row", ["value", "basis", "window", "excludes"]], ["weekly rollup", ["value", "window"]], ["exec summary", ["value"]], ["press line", ["value"]]]

def has_field(record, name):
    for f in record:
        if f[0] == name:
            return 1
    return 0

def project(record, keep):
    out = []
    for f in record:
        for k in keep:
            if f[0] == k:
                out = out + [f]
    return out

def value_of(record):
    for f in record:
        if f[0] == "value":
            return f[1]
    return "?"

print("the record as produced")
for f in origin:
    print("  " + f[0] + " : " + f[1])
print("  fields : " + str(len(origin)))
print("")
print("each hop")
cur = origin
first_loss = 0
hop_no = 0
for h in hops:
    cur = project(cur, h[1])
    hop_no = hop_no + 1
    print("  " + h[0] + " : value=" + value_of(cur) + ", fields=" + str(len(cur)))
    if len(cur) < len(origin):
        if first_loss == 0:
            first_loss = hop_no
print("")
print("  the value at the last hop : " + value_of(cur))
print("  the value at the source   : " + value_of(origin))
if value_of(cur) == value_of(origin):
    print("  the number survived every hop unchanged")
print("  fields at the last hop : " + str(len(cur)) + " of " + str(len(origin)))
print("  first hop that dropped something : " + str(first_loss))
print("")
print("fields lost")
lost = 0
for f in origin:
    if has_field(cur, f[0]) == 0:
        lost = lost + 1
        print("  " + f[0] + " (" + f[1] + ")")
print("  lost : " + str(lost) + " of " + str(len(origin) - 1) + " qualifiers")
print("")
print("what each hop can still answer")
questions = ["is this of everyone or of those who got there", "which window", "who is excluded"]
needed = ["basis", "window", "excludes"]
cur2 = origin
for h in hops:
    cur2 = project(cur2, h[1])
    can = 0
    qi = 0
    for n in needed:
        can = can + has_field(cur2, n)
        qi = qi + 1
    print("  " + h[0] + " : " + str(can) + " of " + str(len(needed)))
print("")
d0 = project(origin, hops[0][1])
print("control - the first hop, whose schema names all four fields")
print("  fields kept : " + str(len(d0)) + " of " + str(len(origin)))
if len(d0) == len(origin):
    print("  nothing is lost where the schema has somewhere to put it")
print("")
print("Attaching the caveat is a fix at the boundary you can see. Past the first")
print("reshaping, the number travels alone and still reads as an answer.")
```

## stdout (executed)

```text
the record as produced
  value : 59
  basis : of those who reached the step
  window : days 1-6
  excludes : trial accounts
  fields : 4

each hop
  dashboard row : value=59, fields=4
  weekly rollup : value=59, fields=2
  exec summary : value=59, fields=1
  press line : value=59, fields=1

  the value at the last hop : 59
  the value at the source   : 59
  the number survived every hop unchanged
  fields at the last hop : 1 of 4
  first hop that dropped something : 2

fields lost
  basis (of those who reached the step)
  window (days 1-6)
  excludes (trial accounts)
  lost : 3 of 3 qualifiers

what each hop can still answer
  dashboard row : 3 of 3
  weekly rollup : 1 of 3
  exec summary : 0 of 3
  press line : 0 of 3

control - the first hop, whose schema names all four fields
  fields kept : 4 of 4
  nothing is lost where the schema has somewhere to put it

Attaching the caveat is a fix at the boundary you can see. Past the first
reshaping, the number travels alone and still reads as an answer.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
