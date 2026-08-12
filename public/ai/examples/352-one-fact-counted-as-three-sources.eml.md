<!-- canonical: efficientnewlanguage.org/ai/examples/352-one-fact-counted-as-three-sources | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 352 — One fact counted as three sources — 4 systems agree, 2 origins exist

`one_fact_counted_as_three_sources.eml` traces each system's answer back to where it came from and counts distinct origins rather than distinct systems.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three systems
# agree, and there is one observation.
#
# The value was measured once and written into the master record. Two other
# services copied it, at different times, for different reasons, and both now
# serve it as their own field. A reviewer querying all three gets three
# agreeing answers and reports high confidence.
#
# Nobody lied and nothing was duplicated by mistake. Copying a value into the
# system that needs it is correct engineering. The defect is in the COUNTING:
# an agreement rate is only evidence when the things agreeing were able to
# disagree.
#
# The program traces each answer back to where it came from and counts distinct
# ORIGINS rather than distinct systems. Nothing is declared - provenance is
# followed link by link.

def origin_of(sources, name):
    name => cur
    0 => hops
    for _step in sources:
        0 => moved
        for s in sources:
            if s[0] == cur:
                if s[2] != "":
                    s[2] => cur
                    hops + 1 => hops
                    1 => moved
        if moved == 0:
            return [cur, hops]
    return [cur, hops]

# [system, value, copied_from]
[["master", 4200, ""], ["billing", 4200, "master"], ["reporting", 4200, "billing"], ["audit", 4190, ""], ["support", 4200, "reporting"]] => sources

4190 => truth

# ---- what a reviewer sees ----

"systems queried" ^0
for s in sources:
    "  " + s[0] + " reports " + str(s[1]) ^0
"" ^0

0 => agree_4200
0 => agree_other
for s in sources:
    if s[1] == 4200:
        agree_4200 + 1 => agree_4200
    else:
        agree_other + 1 => agree_other
"  systems reporting 4200 : " + str(agree_4200) ^0
"  systems reporting else : " + str(agree_other) ^0
"" ^0

# ---- where each answer actually comes from ----

"provenance" ^0
[] => origins
for s in sources:
    origin_of(sources, s[0]) => o
    "  " + s[0] + " -> " + o[0] + "  (" + str(o[1]) + " hops)" ^0
    if not (o[0] in origins):
        origins + [o[0]] => origins
"  distinct origins across " + str(len(sources)) + " systems : " + str(len(origins)) ^0
"" ^0

# ---- the same count, done properly ----

0 => origin_4200
0 => origin_other
for o in origins:
    for s in sources:
        if s[0] == o:
            if s[1] == 4200:
                origin_4200 + 1 => origin_4200
            else:
                origin_other + 1 => origin_other
"one vote per origin" ^0
"  origins reporting 4200 : " + str(origin_4200) ^0
"  origins reporting else : " + str(origin_other) ^0
"" ^0

# ---- which of them is right ----

0 => correct_systems
for s in sources:
    if s[1] == truth:
        correct_systems + 1 => correct_systems
"  systems that match the true value : " + str(correct_systems) + " of " + str(len(sources)) ^0
"" ^0

# ---- correcting the master ----
#
# The copies do not update themselves. Fixing the origin leaves every derived
# system reporting the old value, and the agreement rate is UNCHANGED.

[] => after
for s in sources:
    if s[0] == "master":
        after + [[s[0], truth, s[2]]] => after
    else:
        after + [[s[0], s[1], s[2]]] => after

0 => after_agree
0 => after_correct
for s in after:
    if s[1] == 4200:
        after_agree + 1 => after_agree
    if s[1] == truth:
        after_correct + 1 => after_correct
"after correcting the master record" ^0
"  systems still reporting 4200 : " + str(after_agree) ^0
"  systems matching the truth   : " + str(after_correct) ^0
"" ^0

# ---- the one system that could ever have disagreed ----

"systems with no upstream, which are the only ones that can carry news" ^0
0 => independent
for s in sources:
    if s[2] == "":
        independent + 1 => independent
        "  " + s[0] + " reports " + str(s[1]) ^0
"  total: " + str(independent) + " of " + str(len(sources)) ^0
"" ^0

"An agreement rate is evidence only when the things agreeing were able to" ^0
"disagree. Four of these five could not, and the one that could is the one" ^0
"the reviewer treated as the outlier." ^0
```

## Python (deterministic transpilation)

```python
def origin_of(sources, name):
    cur = name
    hops = 0
    for _step in sources:
        moved = 0
        for s in sources:
            if s[0] == cur:
                if s[2] != "":
                    cur = s[2]
                    hops = hops + 1
                    moved = 1
        if moved == 0:
            return [cur, hops]
    return [cur, hops]

sources = [["master", 4200, ""], ["billing", 4200, "master"], ["reporting", 4200, "billing"], ["audit", 4190, ""], ["support", 4200, "reporting"]]
truth = 4190
print("systems queried")
for s in sources:
    print("  " + s[0] + " reports " + str(s[1]))
print("")
agree_4200 = 0
agree_other = 0
for s in sources:
    if s[1] == 4200:
        agree_4200 = agree_4200 + 1
    else:
        agree_other = agree_other + 1
print("  systems reporting 4200 : " + str(agree_4200))
print("  systems reporting else : " + str(agree_other))
print("")
print("provenance")
origins = []
for s in sources:
    o = origin_of(sources, s[0])
    print("  " + s[0] + " -> " + o[0] + "  (" + str(o[1]) + " hops)")
    if not o[0] in origins:
        origins = origins + [o[0]]
print("  distinct origins across " + str(len(sources)) + " systems : " + str(len(origins)))
print("")
origin_4200 = 0
origin_other = 0
for o in origins:
    for s in sources:
        if s[0] == o:
            if s[1] == 4200:
                origin_4200 = origin_4200 + 1
            else:
                origin_other = origin_other + 1
print("one vote per origin")
print("  origins reporting 4200 : " + str(origin_4200))
print("  origins reporting else : " + str(origin_other))
print("")
correct_systems = 0
for s in sources:
    if s[1] == truth:
        correct_systems = correct_systems + 1
print("  systems that match the true value : " + str(correct_systems) + " of " + str(len(sources)))
print("")
after = []
for s in sources:
    if s[0] == "master":
        after = after + [[s[0], truth, s[2]]]
    else:
        after = after + [[s[0], s[1], s[2]]]
after_agree = 0
after_correct = 0
for s in after:
    if s[1] == 4200:
        after_agree = after_agree + 1
    if s[1] == truth:
        after_correct = after_correct + 1
print("after correcting the master record")
print("  systems still reporting 4200 : " + str(after_agree))
print("  systems matching the truth   : " + str(after_correct))
print("")
print("systems with no upstream, which are the only ones that can carry news")
independent = 0
for s in sources:
    if s[2] == "":
        independent = independent + 1
        print("  " + s[0] + " reports " + str(s[1]))
print("  total: " + str(independent) + " of " + str(len(sources)))
print("")
print("An agreement rate is evidence only when the things agreeing were able to")
print("disagree. Four of these five could not, and the one that could is the one")
print("the reviewer treated as the outlier.")
```

## stdout (executed)

```text
systems queried
  master reports 4200
  billing reports 4200
  reporting reports 4200
  audit reports 4190
  support reports 4200

  systems reporting 4200 : 4
  systems reporting else : 1

provenance
  master -> master  (0 hops)
  billing -> master  (1 hops)
  reporting -> master  (2 hops)
  audit -> audit  (0 hops)
  support -> master  (3 hops)
  distinct origins across 5 systems : 2

one vote per origin
  origins reporting 4200 : 1
  origins reporting else : 1

  systems that match the true value : 1 of 5

after correcting the master record
  systems still reporting 4200 : 3
  systems matching the truth   : 2

systems with no upstream, which are the only ones that can carry news
  master reports 4200
  audit reports 4190
  total: 2 of 5

An agreement rate is evidence only when the things agreeing were able to
disagree. Four of these five could not, and the one that could is the one
the reviewer treated as the outlier.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
