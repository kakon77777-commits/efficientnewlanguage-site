<!-- canonical: efficientnewlanguage.org/ai/examples/375-the-absence-was-created-by-the-filter | ai_layer_version: 0.1.0 | updated: 2026-08-14 -->

# Example 375 — The absence was created by the filter — same loss, one keeps the answer

`the_absence_was_created_by_the_filter.eml` runs two pipelines with comparable drop rates over the same 40 records and compares each reported rate against the true one.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The error rate is
# zero because the errors could not be parsed, and unparseable records are
# dropped before the rate is computed.
#
# Dropping records is not the defect. Every pipeline drops something, and the
# drop is usually harmless: it costs a little precision and leaves the estimate
# where it was. The failure needs one extra property - that whatever is being
# counted is also what makes a record undroppable.
#
# So the program runs two worlds with the SAME drop rate. In one, the dropped
# records are picked by a rule unrelated to the fault. In the other, the fault
# itself truncates the record, and truncation is the drop rule.
#
# The comparison is the case. A reader who sees only the correlated world can
# blame "we lose 25% of records" and be wrong about which part hurt.

40 => n

def faulty(i):
    if i % 5 == 0:
        return 1
    return 0

# drop rule 1: unrelated to the fault - every fourth record is lost in transit
def dropped_independent(i):
    if i % 4 == 0:
        return 1
    return 0

# drop rule 2: the fault truncates the record, and truncated records cannot be
# parsed, so the parser discards them
def dropped_correlated(i):
    return faulty(i)

def truth_faulty():
    0 => c
    for i in [1:n]:
        c + faulty(i) => c
    return c

def parsed_count(rule):
    0 => c
    for i in [1:n]:
        if rule == 1:
            if dropped_independent(i) == 0:
                c + 1 => c
        else:
            if dropped_correlated(i) == 0:
                c + 1 => c
    return c

def faulty_among_parsed(rule):
    0 => c
    for i in [1:n]:
        if rule == 1:
            if dropped_independent(i) == 0:
                c + faulty(i) => c
        else:
            if dropped_correlated(i) == 0:
                c + faulty(i) => c
    return c

def pct(a, b):
    if b == 0:
        return 0
    return int(a * 100 / b)

# ---- what is actually true of the world ----

truth_faulty() => truth
"the world" ^0
"  records produced : " + str(n) ^0
"  faulty           : " + str(truth) ^0
"  true rate        : " + str(pct(truth, n)) + "%" ^0
"" ^0

# ---- drop rule 1: independent of the fault ----

parsed_count(1) => p1
faulty_among_parsed(1) => f1
"pipeline A - drops every fourth record, for reasons of its own" ^0
"  parsed   : " + str(p1) ^0
"  dropped  : " + str(n - p1) ^0
"  faulty among parsed : " + str(f1) ^0
"  reported rate       : " + str(pct(f1, p1)) + "%" ^0
"" ^0

# ---- drop rule 2: the fault is the drop rule ----

parsed_count(2) => p2
faulty_among_parsed(2) => f2
"pipeline B - the fault truncates the record, so the parser discards it" ^0
"  parsed   : " + str(p2) ^0
"  dropped  : " + str(n - p2) ^0
"  faulty among parsed : " + str(f2) ^0
"  reported rate       : " + str(pct(f2, p2)) + "%" ^0
"" ^0

# ---- the two pipelines lose comparable amounts ----

"loss" ^0
"  A dropped : " + str(n - p1) ^0
"  B dropped : " + str(n - p2) ^0
"  A reported rate vs truth : " + str(pct(f1, p1)) + "% vs " + str(pct(truth, n)) + "%" ^0
"  B reported rate vs truth : " + str(pct(f2, p2)) + "% vs " + str(pct(truth, n)) + "%" ^0
if pct(f1, p1) == pct(truth, n):
    "  A loses records and keeps the answer" ^0
if pct(f2, p2) < pct(truth, n):
    "  B loses records and loses the answer" ^0
"" ^0

# ---- what B's dropped set is made of ----

0 => b_dropped_faulty
0 => b_dropped_clean
for i in [1:n]:
    if dropped_correlated(i) == 1:
        if faulty(i) == 1:
            b_dropped_faulty + 1 => b_dropped_faulty
        else:
            b_dropped_clean + 1 => b_dropped_clean

0 => a_dropped_faulty
0 => a_dropped_clean
for i in [1:n]:
    if dropped_independent(i) == 1:
        if faulty(i) == 1:
            a_dropped_faulty + 1 => a_dropped_faulty
        else:
            a_dropped_clean + 1 => a_dropped_clean

"what each pipeline threw away" ^0
"  A : " + str(a_dropped_faulty) + " faulty, " + str(a_dropped_clean) + " clean" ^0
"  B : " + str(b_dropped_faulty) + " faulty, " + str(b_dropped_clean) + " clean" ^0
if b_dropped_clean == 0:
    if b_dropped_faulty == truth:
        "  B threw away every faulty record and nothing else" ^0
"" ^0

"Both pipelines can say 'we drop some records'. Only one of them is reporting" ^0
"a number about the world. A count is only as good as the independence between" ^0
"what got counted and what got kept." ^0
```

## Python (deterministic transpilation)

```python
n = 40

def faulty(i):
    if i % 5 == 0:
        return 1
    return 0

def dropped_independent(i):
    if i % 4 == 0:
        return 1
    return 0

def dropped_correlated(i):
    return faulty(i)

def truth_faulty():
    c = 0
    for i in range(1, n+1):
        c = c + faulty(i)
    return c

def parsed_count(rule):
    c = 0
    for i in range(1, n+1):
        if rule == 1:
            if dropped_independent(i) == 0:
                c = c + 1
        elif dropped_correlated(i) == 0:
            c = c + 1
    return c

def faulty_among_parsed(rule):
    c = 0
    for i in range(1, n+1):
        if rule == 1:
            if dropped_independent(i) == 0:
                c = c + faulty(i)
        elif dropped_correlated(i) == 0:
            c = c + faulty(i)
    return c

def pct(a, b):
    if b == 0:
        return 0
    return int(a * 100 / b)

truth = truth_faulty()
print("the world")
print("  records produced : " + str(n))
print("  faulty           : " + str(truth))
print("  true rate        : " + str(pct(truth, n)) + "%")
print("")
p1 = parsed_count(1)
f1 = faulty_among_parsed(1)
print("pipeline A - drops every fourth record, for reasons of its own")
print("  parsed   : " + str(p1))
print("  dropped  : " + str(n - p1))
print("  faulty among parsed : " + str(f1))
print("  reported rate       : " + str(pct(f1, p1)) + "%")
print("")
p2 = parsed_count(2)
f2 = faulty_among_parsed(2)
print("pipeline B - the fault truncates the record, so the parser discards it")
print("  parsed   : " + str(p2))
print("  dropped  : " + str(n - p2))
print("  faulty among parsed : " + str(f2))
print("  reported rate       : " + str(pct(f2, p2)) + "%")
print("")
print("loss")
print("  A dropped : " + str(n - p1))
print("  B dropped : " + str(n - p2))
print("  A reported rate vs truth : " + str(pct(f1, p1)) + "% vs " + str(pct(truth, n)) + "%")
print("  B reported rate vs truth : " + str(pct(f2, p2)) + "% vs " + str(pct(truth, n)) + "%")
if pct(f1, p1) == pct(truth, n):
    print("  A loses records and keeps the answer")
if pct(f2, p2) < pct(truth, n):
    print("  B loses records and loses the answer")
print("")
b_dropped_faulty = 0
b_dropped_clean = 0
for i in range(1, n+1):
    if dropped_correlated(i) == 1:
        if faulty(i) == 1:
            b_dropped_faulty = b_dropped_faulty + 1
        else:
            b_dropped_clean = b_dropped_clean + 1
a_dropped_faulty = 0
a_dropped_clean = 0
for i in range(1, n+1):
    if dropped_independent(i) == 1:
        if faulty(i) == 1:
            a_dropped_faulty = a_dropped_faulty + 1
        else:
            a_dropped_clean = a_dropped_clean + 1
print("what each pipeline threw away")
print("  A : " + str(a_dropped_faulty) + " faulty, " + str(a_dropped_clean) + " clean")
print("  B : " + str(b_dropped_faulty) + " faulty, " + str(b_dropped_clean) + " clean")
if b_dropped_clean == 0:
    if b_dropped_faulty == truth:
        print("  B threw away every faulty record and nothing else")
print("")
print("Both pipelines can say 'we drop some records'. Only one of them is reporting")
print("a number about the world. A count is only as good as the independence between")
print("what got counted and what got kept.")
```

## stdout (executed)

```text
the world
  records produced : 40
  faulty           : 8
  true rate        : 20%

pipeline A - drops every fourth record, for reasons of its own
  parsed   : 30
  dropped  : 10
  faulty among parsed : 6
  reported rate       : 20%

pipeline B - the fault truncates the record, so the parser discards it
  parsed   : 32
  dropped  : 8
  faulty among parsed : 0
  reported rate       : 0%

loss
  A dropped : 10
  B dropped : 8
  A reported rate vs truth : 20% vs 20%
  B reported rate vs truth : 0% vs 20%
  A loses records and keeps the answer
  B loses records and loses the answer

what each pipeline threw away
  A : 2 faulty, 8 clean
  B : 8 faulty, 0 clean
  B threw away every faulty record and nothing else

Both pipelines can say 'we drop some records'. Only one of them is reporting
a number about the world. A count is only as good as the independence between
what got counted and what got kept.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
