<!-- canonical: efficientnewlanguage.org/ai/examples/359-filed-against-where-it-surfaced | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 359 — Filed against where it surfaced — 1 site named, 4 affected

`filed_against_where_it_surfaced.eml` applies two fixes to the same pipeline — one at the reported location, one at the source — and measures every consumer.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A finding filed
# against the line where the wrong value came out, not the line that made it
# wrong.
#
# An outside reporter locates a defect by following the value backwards until
# it stops being visible. That lands on the last place the value was handled,
# which is a surfacing site. Whether it is also the cause depends on something
# the reporter cannot see: how many other surfacing sites read the same source.
#
# Fixing at the surfacing site works - the reported symptom goes away, the
# reported test passes. It works exactly once per site, and the number of sites
# is not in the report.
#
# Nothing is declared. Both fixes are applied to the same pipeline and every
# consumer is measured.

def normalise(name, fixed_at_source):
    "" => out
    for ch in name:
        if ch == " ":
            pass
        else:
            out + ch => out
    if fixed_at_source == 1:
        return out
    # the cause: the trailing marker is not removed
    return out + "#"

def label_report(name, fixed_at_source, fixed_here):
    normalise(name, fixed_at_source) => n
    if fixed_here == 1:
        "" => t
        for ch in n:
            if ch == "#":
                pass
            else:
                t + ch => t
        return t
    return n

def label_invoice(name, fixed_at_source):
    return normalise(name, fixed_at_source)

def label_export(name, fixed_at_source):
    return normalise(name, fixed_at_source)

def label_search_key(name, fixed_at_source):
    return normalise(name, fixed_at_source)

def truth(name):
    "" => out
    for ch in name:
        if ch == " ":
            pass
        else:
            out + ch => out
    return out

["ana lee", "bo", "cy tan", "di wu"] => names

# ---- the report ----

"the report" ^0
"  seen on : the report screen" ^0
"  input   : " + names[0] ^0
"  actual  : " + label_report(names[0], 0, 0) ^0
"  correct : " + truth(names[0]) ^0
"  filed against : the report screen's label code" ^0
"" ^0

# ---- fix at the reported location ----

"after fixing at the reported location" ^0
0 => report_wrong
0 => other_wrong
for n in names:
    if label_report(n, 0, 1) != truth(n):
        report_wrong + 1 => report_wrong
    if label_invoice(n, 0) != truth(n):
        other_wrong + 1 => other_wrong
    if label_export(n, 0) != truth(n):
        other_wrong + 1 => other_wrong
    if label_search_key(n, 0) != truth(n):
        other_wrong + 1 => other_wrong
"  report screen wrong : " + str(report_wrong) + " of " + str(len(names)) ^0
"  other consumers wrong : " + str(other_wrong) ^0
"" ^0

# ---- fix at the source ----

"after fixing at the source instead" ^0
0 => all_wrong
for n in names:
    if label_report(n, 1, 0) != truth(n):
        all_wrong + 1 => all_wrong
    if label_invoice(n, 1) != truth(n):
        all_wrong + 1 => all_wrong
    if label_export(n, 1) != truth(n):
        all_wrong + 1 => all_wrong
    if label_search_key(n, 1) != truth(n):
        all_wrong + 1 => all_wrong
"  consumers wrong across all sites : " + str(all_wrong) ^0
"" ^0

# ---- how many surfacing sites read the same source ----

"consumers of the normaliser, and whether each shows the defect" ^0
["report", "invoice", "export", "search key"] => sites
["report"] => reported_sites
names[0] => probe
[label_report(probe, 0, 0), label_invoice(probe, 0), label_export(probe, 0), label_search_key(probe, 0)] => before
0 => si
0 => showing
for s in sites:
    if before[si] != truth(probe):
        showing + 1 => showing
        "  " + s + " : " + before[si] + "  (correct " + truth(probe) + ")" ^0
    else:
        "  " + s + " : " + before[si] ^0
    si + 1 => si
"  sites showing the defect : " + str(showing) + " of " + str(len(sites)) ^0
"  sites named in the report : " + str(len(reported_sites)) ^0
"" ^0

# ---- the same probe after each fix ----

[label_report(probe, 0, 1), label_invoice(probe, 0), label_export(probe, 0), label_search_key(probe, 0)] => after_local
[label_report(probe, 1, 0), label_invoice(probe, 1), label_export(probe, 1), label_search_key(probe, 1)] => after_source

"sites still showing the defect" ^0
0 => left_local
0 => left_source
0 => qi
for s in sites:
    if after_local[qi] != truth(probe):
        left_local + 1 => left_local
    if after_source[qi] != truth(probe):
        left_source + 1 => left_source
    qi + 1 => qi
"  after fixing the reported site : " + str(left_local) + " of " + str(len(sites)) ^0
"  after fixing the source        : " + str(left_source) + " of " + str(len(sites)) ^0
"" ^0

# ---- and the two fixes are not equivalent even where they agree ----
#
# Fixing at the surfacing site strips the marker after the fact. Fixing at the
# source never produces it. On a name that legitimately contains the marker
# character, the two disagree.

"a name that legitimately contains the marker" ^0
"c# dev" => tricky
"  correct                : " + truth(tricky) ^0
"  fixed at reported site : " + label_report(tricky, 0, 1) ^0
"  fixed at source        : " + label_report(tricky, 1, 0) ^0
if label_report(tricky, 0, 1) != truth(tricky):
    "  the local fix is wrong here, and the source fix is right" ^0
"" ^0

"A reporter locates a defect by following the value backwards until it stops" ^0
"being visible. That is a surfacing site by construction. Whether it is also" ^0
"the cause is decided by how many other sites read the same source, and that" ^0
"number is on the inside." ^0
```

## Python (deterministic transpilation)

```python
def normalise(name, fixed_at_source):
    out = ""
    for ch in name:
        if ch == " ":
            pass
        else:
            out = out + ch
    if fixed_at_source == 1:
        return out
    return out + "#"

def label_report(name, fixed_at_source, fixed_here):
    n = normalise(name, fixed_at_source)
    if fixed_here == 1:
        t = ""
        for ch in n:
            if ch == "#":
                pass
            else:
                t = t + ch
        return t
    return n

def label_invoice(name, fixed_at_source):
    return normalise(name, fixed_at_source)

def label_export(name, fixed_at_source):
    return normalise(name, fixed_at_source)

def label_search_key(name, fixed_at_source):
    return normalise(name, fixed_at_source)

def truth(name):
    out = ""
    for ch in name:
        if ch == " ":
            pass
        else:
            out = out + ch
    return out

names = ["ana lee", "bo", "cy tan", "di wu"]
print("the report")
print("  seen on : the report screen")
print("  input   : " + names[0])
print("  actual  : " + label_report(names[0], 0, 0))
print("  correct : " + truth(names[0]))
print("  filed against : the report screen's label code")
print("")
print("after fixing at the reported location")
report_wrong = 0
other_wrong = 0
for n in names:
    if label_report(n, 0, 1) != truth(n):
        report_wrong = report_wrong + 1
    if label_invoice(n, 0) != truth(n):
        other_wrong = other_wrong + 1
    if label_export(n, 0) != truth(n):
        other_wrong = other_wrong + 1
    if label_search_key(n, 0) != truth(n):
        other_wrong = other_wrong + 1
print("  report screen wrong : " + str(report_wrong) + " of " + str(len(names)))
print("  other consumers wrong : " + str(other_wrong))
print("")
print("after fixing at the source instead")
all_wrong = 0
for n in names:
    if label_report(n, 1, 0) != truth(n):
        all_wrong = all_wrong + 1
    if label_invoice(n, 1) != truth(n):
        all_wrong = all_wrong + 1
    if label_export(n, 1) != truth(n):
        all_wrong = all_wrong + 1
    if label_search_key(n, 1) != truth(n):
        all_wrong = all_wrong + 1
print("  consumers wrong across all sites : " + str(all_wrong))
print("")
print("consumers of the normaliser, and whether each shows the defect")
sites = ["report", "invoice", "export", "search key"]
reported_sites = ["report"]
probe = names[0]
before = [label_report(probe, 0, 0), label_invoice(probe, 0), label_export(probe, 0), label_search_key(probe, 0)]
si = 0
showing = 0
for s in sites:
    if before[si] != truth(probe):
        showing = showing + 1
        print("  " + s + " : " + before[si] + "  (correct " + truth(probe) + ")")
    else:
        print("  " + s + " : " + before[si])
    si = si + 1
print("  sites showing the defect : " + str(showing) + " of " + str(len(sites)))
print("  sites named in the report : " + str(len(reported_sites)))
print("")
after_local = [label_report(probe, 0, 1), label_invoice(probe, 0), label_export(probe, 0), label_search_key(probe, 0)]
after_source = [label_report(probe, 1, 0), label_invoice(probe, 1), label_export(probe, 1), label_search_key(probe, 1)]
print("sites still showing the defect")
left_local = 0
left_source = 0
qi = 0
for s in sites:
    if after_local[qi] != truth(probe):
        left_local = left_local + 1
    if after_source[qi] != truth(probe):
        left_source = left_source + 1
    qi = qi + 1
print("  after fixing the reported site : " + str(left_local) + " of " + str(len(sites)))
print("  after fixing the source        : " + str(left_source) + " of " + str(len(sites)))
print("")
print("a name that legitimately contains the marker")
tricky = "c# dev"
print("  correct                : " + truth(tricky))
print("  fixed at reported site : " + label_report(tricky, 0, 1))
print("  fixed at source        : " + label_report(tricky, 1, 0))
if label_report(tricky, 0, 1) != truth(tricky):
    print("  the local fix is wrong here, and the source fix is right")
print("")
print("A reporter locates a defect by following the value backwards until it stops")
print("being visible. That is a surfacing site by construction. Whether it is also")
print("the cause is decided by how many other sites read the same source, and that")
print("number is on the inside.")
```

## stdout (executed)

```text
the report
  seen on : the report screen
  input   : ana lee
  actual  : analee#
  correct : analee
  filed against : the report screen's label code

after fixing at the reported location
  report screen wrong : 0 of 4
  other consumers wrong : 12

after fixing at the source instead
  consumers wrong across all sites : 0

consumers of the normaliser, and whether each shows the defect
  report : analee#  (correct analee)
  invoice : analee#  (correct analee)
  export : analee#  (correct analee)
  search key : analee#  (correct analee)
  sites showing the defect : 4 of 4
  sites named in the report : 1

sites still showing the defect
  after fixing the reported site : 3 of 4
  after fixing the source        : 0 of 4

a name that legitimately contains the marker
  correct                : c#dev
  fixed at reported site : cdev
  fixed at source        : c#dev
  the local fix is wrong here, and the source fix is right

A reporter locates a defect by following the value backwards until it stops
being visible. That is a surfacing site by construction. Whether it is also
the cause is decided by how many other sites read the same source, and that
number is on the inside.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
