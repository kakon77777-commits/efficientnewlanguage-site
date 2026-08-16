<!-- canonical: efficientnewlanguage.org/ai/examples/407-the-average-describes-no-one | ai_layer_version: 0.1.0 | updated: 2026-08-16 -->

# Example 407 — The average describes no one - 0 customers within any tolerance of both means

`the_average_describes_no_one.eml` counts how many records sit near the mean on both dimensions at four tolerances, and computes the median on the same data.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The typical
# customer uses 5 seats and 60 GB. No customer does.
#
# The mean is the right summary for the questions it was built for - capacity
# planning, unit economics, total load - and it answers all of those correctly.
# It was never claimed to describe an individual, and yet the sentence "our
# typical customer" is the one that gets built on.
#
# Whether any record resembles the mean is a separate question with a separate
# answer, and it is computed here rather than assumed.

# [customer, seats, gigabytes]
[["c1", 1, 2], ["c2", 1, 3], ["c3", 2, 4], ["c4", 1, 2], ["c5", 2, 5], ["c6", 1, 3], ["c7", 30, 400], ["c8", 1, 2], ["c9", 2, 4], ["c10", 1, 3]] => customers

def mean(col):
    0 => t
    for c in customers:
        t + c[col] => t
    return int(t / len(customers))

mean(1) => m_seats
mean(2) => m_gb

"customers : " + str(len(customers)) ^0
"  mean seats : " + str(m_seats) ^0
"  mean GB    : " + str(m_gb) ^0
"" ^0

# ---- how many customers are near the mean ----

def near(v, m, tol):
    if v > m + tol:
        return 0
    if v < m - tol:
        return 0
    return 1

"customers within a tolerance of the mean on BOTH numbers" ^0
for tol in [0, 1, 2, 3]:
    0 => c
    for cu in customers:
        if near(cu[1], m_seats, tol) == 1:
            if near(cu[2], m_gb, tol) == 1:
                c + 1 => c
    "  tolerance " + str(tol) + " : " + str(c) + " of " + str(len(customers)) ^0
"" ^0

# ---- what the population actually looks like ----

"every customer" ^0
for cu in customers:
    "  " + cu[0] + " : " + str(cu[1]) + " seats, " + str(cu[2]) + " GB" ^0
"" ^0

0 => below
0 => above
for cu in customers:
    if cu[1] < m_seats:
        below + 1 => below
    else:
        above + 1 => above
"  below the mean seat count : " + str(below) ^0
"  at or above               : " + str(above) ^0
if below > above:
    "  most of the population is below the mean, which is what one large" ^0
    "  member does to it" ^0
"" ^0

# ---- the median, on the same data ----

def median(col):
    [] => vals
    for c in customers:
        vals + [c[col]] => vals
    [] => sorted_vals
    [] => used
    for k in [1:len(vals)]:
        99999 => best
        -1 => at
        0 => i
        for v in vals:
            0 => taken
            for u in used:
                if u == i:
                    1 => taken
            if taken == 0:
                if v < best:
                    v => best
                    i => at
            i + 1 => i
        used + [at] => used
        sorted_vals + [best] => sorted_vals
    return sorted_vals[int(len(sorted_vals) / 2)]

"the median, same data" ^0
"  seats : " + str(median(1)) ^0
"  GB    : " + str(median(2)) ^0
0 => at_median
for cu in customers:
    if cu[1] == median(1):
        if cu[2] == median(2):
            at_median + 1 => at_median
"  customers matching the median exactly : " + str(at_median) ^0
"" ^0

# ---- which questions each answers ----

0 => total_gb
for cu in customers:
    total_gb + cu[2] => total_gb
"which question each summary answers" ^0
"  how much storage to buy : the mean, " + str(m_gb) + " x " + str(len(customers)) + " = " + str(m_gb * len(customers)) ^0
"  actual total            : " + str(total_gb) ^0
"  what to build the UI for: the median, " + str(median(2)) + " GB" ^0
"  who to design onboarding for : neither - it is a bimodal population" ^0
"" ^0

# ---- the control: a population with no large member ----

[["d1", 4, 50], ["d2", 5, 60], ["d3", 6, 70], ["d4", 5, 55], ["d5", 5, 65]] => tight
0 => tm
for c in tight:
    tm + c[1] => tm
int(tm / len(tight)) => tight_mean
0 => tight_near
for c in tight:
    if near(c[1], tight_mean, 1) == 1:
        tight_near + 1 => tight_near
"control - a population with no outlier" ^0
"  mean seats : " + str(tight_mean) ^0
"  customers within 1 of it : " + str(tight_near) + " of " + str(len(tight)) ^0
if tight_near == len(tight):
    "  here the mean does describe the members, and the sentence is safe" ^0
"" ^0

"The mean is correct and answers the question it was computed for. Whether it" ^0
"describes anybody is a different question, and the word 'typical' answers it" ^0
"without being asked." ^0
```

## Python (deterministic transpilation)

```python
customers = [["c1", 1, 2], ["c2", 1, 3], ["c3", 2, 4], ["c4", 1, 2], ["c5", 2, 5], ["c6", 1, 3], ["c7", 30, 400], ["c8", 1, 2], ["c9", 2, 4], ["c10", 1, 3]]

def mean(col):
    t = 0
    for c in customers:
        t = t + c[col]
    return int(t / len(customers))

m_seats = mean(1)
m_gb = mean(2)
print("customers : " + str(len(customers)))
print("  mean seats : " + str(m_seats))
print("  mean GB    : " + str(m_gb))
print("")

def near(v, m, tol):
    if v > m + tol:
        return 0
    if v < m - tol:
        return 0
    return 1

print("customers within a tolerance of the mean on BOTH numbers")
for tol in [0, 1, 2, 3]:
    c = 0
    for cu in customers:
        if near(cu[1], m_seats, tol) == 1:
            if near(cu[2], m_gb, tol) == 1:
                c = c + 1
    print("  tolerance " + str(tol) + " : " + str(c) + " of " + str(len(customers)))
print("")
print("every customer")
for cu in customers:
    print("  " + cu[0] + " : " + str(cu[1]) + " seats, " + str(cu[2]) + " GB")
print("")
below = 0
above = 0
for cu in customers:
    if cu[1] < m_seats:
        below = below + 1
    else:
        above = above + 1
print("  below the mean seat count : " + str(below))
print("  at or above               : " + str(above))
if below > above:
    print("  most of the population is below the mean, which is what one large")
    print("  member does to it")
print("")

def median(col):
    vals = []
    for c in customers:
        vals = vals + [c[col]]
    sorted_vals = []
    used = []
    for k in range(1, len(vals)+1):
        best = 99999
        at = -1
        i = 0
        for v in vals:
            taken = 0
            for u in used:
                if u == i:
                    taken = 1
            if taken == 0:
                if v < best:
                    best = v
                    at = i
            i = i + 1
        used = used + [at]
        sorted_vals = sorted_vals + [best]
    return sorted_vals[int(len(sorted_vals) / 2)]

print("the median, same data")
print("  seats : " + str(median(1)))
print("  GB    : " + str(median(2)))
at_median = 0
for cu in customers:
    if cu[1] == median(1):
        if cu[2] == median(2):
            at_median = at_median + 1
print("  customers matching the median exactly : " + str(at_median))
print("")
total_gb = 0
for cu in customers:
    total_gb = total_gb + cu[2]
print("which question each summary answers")
print("  how much storage to buy : the mean, " + str(m_gb) + " x " + str(len(customers)) + " = " + str(m_gb * len(customers)))
print("  actual total            : " + str(total_gb))
print("  what to build the UI for: the median, " + str(median(2)) + " GB")
print("  who to design onboarding for : neither - it is a bimodal population")
print("")
tight = [["d1", 4, 50], ["d2", 5, 60], ["d3", 6, 70], ["d4", 5, 55], ["d5", 5, 65]]
tm = 0
for c in tight:
    tm = tm + c[1]
tight_mean = int(tm / len(tight))
tight_near = 0
for c in tight:
    if near(c[1], tight_mean, 1) == 1:
        tight_near = tight_near + 1
print("control - a population with no outlier")
print("  mean seats : " + str(tight_mean))
print("  customers within 1 of it : " + str(tight_near) + " of " + str(len(tight)))
if tight_near == len(tight):
    print("  here the mean does describe the members, and the sentence is safe")
print("")
print("The mean is correct and answers the question it was computed for. Whether it")
print("describes anybody is a different question, and the word 'typical' answers it")
print("without being asked.")
```

## stdout (executed)

```text
customers : 10
  mean seats : 4
  mean GB    : 42

customers within a tolerance of the mean on BOTH numbers
  tolerance 0 : 0 of 10
  tolerance 1 : 0 of 10
  tolerance 2 : 0 of 10
  tolerance 3 : 0 of 10

every customer
  c1 : 1 seats, 2 GB
  c2 : 1 seats, 3 GB
  c3 : 2 seats, 4 GB
  c4 : 1 seats, 2 GB
  c5 : 2 seats, 5 GB
  c6 : 1 seats, 3 GB
  c7 : 30 seats, 400 GB
  c8 : 1 seats, 2 GB
  c9 : 2 seats, 4 GB
  c10 : 1 seats, 3 GB

  below the mean seat count : 9
  at or above               : 1
  most of the population is below the mean, which is what one large
  member does to it

the median, same data
  seats : 1
  GB    : 3
  customers matching the median exactly : 3

which question each summary answers
  how much storage to buy : the mean, 42 x 10 = 420
  actual total            : 428
  what to build the UI for: the median, 3 GB
  who to design onboarding for : neither - it is a bimodal population

control - a population with no outlier
  mean seats : 5
  customers within 1 of it : 5 of 5
  here the mean does describe the members, and the sentence is safe

The mean is correct and answers the question it was computed for. Whether it
describes anybody is a different question, and the word 'typical' answers it
without being asked.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
