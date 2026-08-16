<!-- canonical: efficientnewlanguage.org/ai/examples/416-two-taxonomies-that-do-not-partition | ai_layer_version: 0.1.0 | updated: 2026-08-16 -->

# Example 416 — Two taxonomies that do not partition - both totals are 12 and their numbers cannot be added

`two_taxonomies_that_do_not_partition.eml` labels every defect under both schemes, so what each can and cannot say about one population is measured rather than argued.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Both teams
# classify every defect. Their totals cannot be added and their rates cannot be
# compared.
#
# Neither scheme is worse. One team asks where the defect was introduced -
# design, implementation, integration - because that is what they can act on.
# The other asks what the user lost - data, availability, correctness - because
# that is what they report upward. Both are complete, both are unambiguous
# within themselves, and both were chosen well.
#
# The trouble starts when a number from one appears next to a number from the
# other. Here every defect carries both labels, so what each scheme can and
# cannot say about the same population is measured rather than argued.

# [defect, where introduced, what the user lost]
[["d1", "design", "correctness"], ["d2", "design", "availability"], ["d3", "implementation", "correctness"], ["d4", "implementation", "correctness"], ["d5", "implementation", "data"], ["d6", "integration", "availability"], ["d7", "integration", "availability"], ["d8", "integration", "data"], ["d9", "design", "correctness"], ["d10", "implementation", "availability"], ["d11", "integration", "correctness"], ["d12", "implementation", "data"]] => defects

["design", "implementation", "integration"] => scheme_a
["correctness", "availability", "data"] => scheme_b

def count_a(k):
    0 => c
    for d in defects:
        if d[1] == k:
            c + 1 => c
    return c

def count_b(k):
    0 => c
    for d in defects:
        if d[2] == k:
            c + 1 => c
    return c

def cross(a, b):
    0 => c
    for d in defects:
        if d[1] == a:
            if d[2] == b:
                c + 1 => c
    return c

"defects : " + str(len(defects)) ^0
"" ^0

"scheme A - where it was introduced" ^0
for k in scheme_a:
    "  " + k + " : " + str(count_a(k)) ^0
"scheme B - what the user lost" ^0
for k in scheme_b:
    "  " + k + " : " + str(count_b(k)) ^0
"" ^0

0 => ta
for k in scheme_a:
    ta + count_a(k) => ta
0 => tb
for k in scheme_b:
    tb + count_b(k) => tb
"  scheme A totals : " + str(ta) ^0
"  scheme B totals : " + str(tb) ^0
if ta == tb:
    "  both partition the population exactly - neither is sloppy" ^0
"" ^0

# ---- the cross-tabulation, which is the fact both schemes hide ----

"the same defects, both labels at once" ^0
"              correctness  availability  data" ^0
for a in scheme_a:
    "" => row
    for b in scheme_b:
        row + "    " + str(cross(a, b)) + "        " => row
    "  " + a + "   " + row ^0
"" ^0

# ---- what happens when a number from each is put side by side ----

"a report that quotes one number from each" ^0
"  'implementation defects : " + str(count_a("implementation")) + "'" ^0
"  'correctness defects    : " + str(count_b("correctness")) + "'" ^0
count_a("implementation") + count_b("correctness") => naive_sum
"  read as a total : " + str(naive_sum) ^0
"  defects that exist : " + str(len(defects)) ^0
if naive_sum > len(defects):
    "  the sum exceeds the population, because the two counts overlap" ^0
"  the overlap : " + str(cross("implementation", "correctness")) ^0
"" ^0

# ---- what each scheme can answer about the other's question ----

"can scheme A answer 'how much correctness damage came from integration'" ^0
"  scheme A alone : no - it has no correctness axis" ^0
"  scheme B alone : no - it has no origin axis" ^0
"  both together  : yes - " + str(cross("integration", "correctness")) ^0
"" ^0

# ---- the cell that is empty, and what it would take to notice ----

0 => empties
for a in scheme_a:
    for b in scheme_b:
        if cross(a, b) == 0:
            empties + 1 => empties
            "  no defect is both " + a + " and " + b ^0
"  empty cells : " + str(empties) + " of " + str(len(scheme_a) * len(scheme_b)) ^0
if empties > 0:
    "  neither scheme's own table shows this, because each sums the cell away" ^0
"" ^0

# ---- the control: two schemes that refine one another ----
#
# Cross-scheme arithmetic is not always wrong. Where one scheme is a refinement
# of the other, the counts nest and the sums are exact.

["blocking", "non-blocking"] => coarse
def severity_of(d):
    if d[2] == "availability":
        return "blocking"
    return "non-blocking"
def count_coarse(k):
    0 => c
    for d in defects:
        if severity_of(d) == k:
            c + 1 => c
    return c

"control - a coarse scheme that groups scheme B's classes" ^0
for k in coarse:
    "  " + k + " : " + str(count_coarse(k)) ^0
if count_coarse("blocking") == count_b("availability"):
    "  blocking is exactly availability, so the two nest and can be compared" ^0
"" ^0

"Both schemes are complete and unambiguous. What neither carries is the other" ^0
"axis, and a number is quoted without the scheme it came from." ^0
```

## Python (deterministic transpilation)

```python
defects = [["d1", "design", "correctness"], ["d2", "design", "availability"], ["d3", "implementation", "correctness"], ["d4", "implementation", "correctness"], ["d5", "implementation", "data"], ["d6", "integration", "availability"], ["d7", "integration", "availability"], ["d8", "integration", "data"], ["d9", "design", "correctness"], ["d10", "implementation", "availability"], ["d11", "integration", "correctness"], ["d12", "implementation", "data"]]
scheme_a = ["design", "implementation", "integration"]
scheme_b = ["correctness", "availability", "data"]

def count_a(k):
    c = 0
    for d in defects:
        if d[1] == k:
            c = c + 1
    return c

def count_b(k):
    c = 0
    for d in defects:
        if d[2] == k:
            c = c + 1
    return c

def cross(a, b):
    c = 0
    for d in defects:
        if d[1] == a:
            if d[2] == b:
                c = c + 1
    return c

print("defects : " + str(len(defects)))
print("")
print("scheme A - where it was introduced")
for k in scheme_a:
    print("  " + k + " : " + str(count_a(k)))
print("scheme B - what the user lost")
for k in scheme_b:
    print("  " + k + " : " + str(count_b(k)))
print("")
ta = 0
for k in scheme_a:
    ta = ta + count_a(k)
tb = 0
for k in scheme_b:
    tb = tb + count_b(k)
print("  scheme A totals : " + str(ta))
print("  scheme B totals : " + str(tb))
if ta == tb:
    print("  both partition the population exactly - neither is sloppy")
print("")
print("the same defects, both labels at once")
print("              correctness  availability  data")
for a in scheme_a:
    row = ""
    for b in scheme_b:
        row = row + "    " + str(cross(a, b)) + "        "
    print("  " + a + "   " + row)
print("")
print("a report that quotes one number from each")
print("  'implementation defects : " + str(count_a("implementation")) + "'")
print("  'correctness defects    : " + str(count_b("correctness")) + "'")
naive_sum = count_a("implementation") + count_b("correctness")
print("  read as a total : " + str(naive_sum))
print("  defects that exist : " + str(len(defects)))
if naive_sum > len(defects):
    print("  the sum exceeds the population, because the two counts overlap")
print("  the overlap : " + str(cross("implementation", "correctness")))
print("")
print("can scheme A answer 'how much correctness damage came from integration'")
print("  scheme A alone : no - it has no correctness axis")
print("  scheme B alone : no - it has no origin axis")
print("  both together  : yes - " + str(cross("integration", "correctness")))
print("")
empties = 0
for a in scheme_a:
    for b in scheme_b:
        if cross(a, b) == 0:
            empties = empties + 1
            print("  no defect is both " + a + " and " + b)
print("  empty cells : " + str(empties) + " of " + str(len(scheme_a) * len(scheme_b)))
if empties > 0:
    print("  neither scheme's own table shows this, because each sums the cell away")
print("")
coarse = ["blocking", "non-blocking"]

def severity_of(d):
    if d[2] == "availability":
        return "blocking"
    return "non-blocking"

def count_coarse(k):
    c = 0
    for d in defects:
        if severity_of(d) == k:
            c = c + 1
    return c

print("control - a coarse scheme that groups scheme B's classes")
for k in coarse:
    print("  " + k + " : " + str(count_coarse(k)))
if count_coarse("blocking") == count_b("availability"):
    print("  blocking is exactly availability, so the two nest and can be compared")
print("")
print("Both schemes are complete and unambiguous. What neither carries is the other")
print("axis, and a number is quoted without the scheme it came from.")
```

## stdout (executed)

```text
defects : 12

scheme A - where it was introduced
  design : 3
  implementation : 5
  integration : 4
scheme B - what the user lost
  correctness : 5
  availability : 4
  data : 3

  scheme A totals : 12
  scheme B totals : 12
  both partition the population exactly - neither is sloppy

the same defects, both labels at once
              correctness  availability  data
  design       2            1            0        
  implementation       2            1            2        
  integration       1            2            1        

a report that quotes one number from each
  'implementation defects : 5'
  'correctness defects    : 5'
  read as a total : 10
  defects that exist : 12
  the overlap : 2

can scheme A answer 'how much correctness damage came from integration'
  scheme A alone : no - it has no correctness axis
  scheme B alone : no - it has no origin axis
  both together  : yes - 1

  no defect is both design and data
  empty cells : 1 of 9
  neither scheme's own table shows this, because each sums the cell away

control - a coarse scheme that groups scheme B's classes
  blocking : 4
  non-blocking : 8
  blocking is exactly availability, so the two nest and can be compared

Both schemes are complete and unambiguous. What neither carries is the other
axis, and a number is quoted without the scheme it came from.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
