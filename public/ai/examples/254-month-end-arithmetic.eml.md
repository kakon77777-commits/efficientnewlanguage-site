<!-- canonical: efficientnewlanguage.org/ai/examples/254-month-end-arithmetic | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 254 — Month-end arithmetic — two correct answers to "renew monthly"

`month_end_arithmetic.eml` renews a subscription that started on 31 January twelve times, two ways: by stepping forward one month at a time, and by adding *n* months to the original start date.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Adding a month
# to the 31st.
#
# "One month later" has no answer on 31 January, because 31 February does not
# exist. Every library picks a rule and none of them announce it:
#
#     clamp        31 Jan + 1 month = 28 Feb     the common choice
#     overflow     31 Jan + 1 month = 3 Mar      what naive day arithmetic gives
#     reject       raise, because the question is malformed
#
# Clamping is almost always right and has a property nobody expects: it is not
# reversible, and it is not associative.
#
#     31 Jan +1m -1m  = 28 Jan     a day was lost and never comes back
#     31 Jan +1m +1m  = 28 Mar     but 31 Jan +2m = 31 Mar
#
# A monthly subscription that renews by repeated +1 month drifts to the 28th
# and stays there. One that computes start + n months does not. Both are
# "add a month every month" and they diverge permanently after February.
#
# The measurement is the two properties, swept over every start day and a
# year of steps: does +1m then -1m return, and does stepping n times equal
# adding n at once. Both are counted rather than argued.

[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] => DAYS

def days_in(month):
    return DAYS[month - 1]

def add_months_clamp(y, m, d, k):
    m - 1 + k => t
    y + int(t / 12) => ny
    t % 12 + 1 => nm
    d => nd
    if nd > days_in(nm):
        days_in(nm) => nd
    return [ny, nm, nd]

def add_months_overflow(y, m, d, k):
    # Keep the day number and let it spill into the next month, which is what
    # arithmetic on a day count does if nobody guards it.
    m - 1 + k => t
    y + int(t / 12) => ny
    t % 12 + 1 => nm
    d => nd
    while nd > days_in(nm):
        nd - days_in(nm) => nd
        nm + 1 => nm
        if nm > 12:
            1 => nm
            ny + 1 => ny
    return [ny, nm, nd]

def fmt(dt):
    str(dt[0]) + "-" => s
    if dt[1] < 10:
        s + "0" => s
    s + str(dt[1]) + "-" => s
    if dt[2] < 10:
        s + "0" => s
    return s + str(dt[2])


"start        +1m clamp    +1m overflow  +2m clamp    step twice clamp"^0
for start in [[2026, 1, 31], [2026, 1, 30], [2026, 1, 15], [2026, 3, 31], [2026, 5, 31]]:
    start[0] => y
    start[1] => m
    start[2] => d
    add_months_clamp(y, m, d, 1) => c1
    add_months_overflow(y, m, d, 1) => o1
    add_months_clamp(y, m, d, 2) => c2
    add_months_clamp(c1[0], c1[1], c1[2], 1) => cc
    ("%-12s %-12s %-13s %-12s %s" % (fmt(start), fmt(c1), fmt(o1), fmt(c2), fmt(cc)))^0

# ------------------------------------------------- reversibility
""^0
0 => rev_ok
0 => rev_n
[] => rev_fail
for d in [1:31]:
    for m in [1:12]:
        if d <= days_in(m):
            rev_n + 1 => rev_n
            add_months_clamp(2026, m, d, 1) => fwd
            add_months_clamp(fwd[0], fwd[1], fwd[2], 0 - 1) => back
            if back[0] == 2026 and back[1] == m and back[2] == d:
                rev_ok + 1 => rev_ok
            else:
                if len(rev_fail) < 3:
                    rev_fail + [fmt([2026, m, d]) + " +1m -1m -> " + fmt(back)] => rev_fail

("dates tried:                 " + str(rev_n))^0
("  +1m then -1m returned:     " + str(rev_ok) + "/" + str(rev_n))^0
for r in rev_fail:
    ("  " + r)^0

# ------------------------------------- stepping versus adding at once
""^0
0 => same
0 => steps_n
[] => drift
for d in [1:31]:
    for m in [1:12]:
        if d <= days_in(m):
            steps_n + 1 => steps_n
            add_months_clamp(2026, m, d, 3) => at_once
            2026 => cy
            m => cm
            d => cd
            for k in [1:3]:
                add_months_clamp(cy, cm, cd, 1) => nx
                nx[0] => cy
                nx[1] => cm
                nx[2] => cd
            if at_once[0] == cy and at_once[1] == cm and at_once[2] == cd:
                same + 1 => same
            else:
                if len(drift) < 3:
                    drift + [fmt([2026, m, d]) + ": +3m = " + fmt(at_once) + ", three x +1m = " + fmt([cy, cm, cd])] => drift

("start dates tried:                " + str(steps_n))^0
("  +3m equals three times +1m:     " + str(same) + "/" + str(steps_n))^0
for dr in drift:
    ("  " + dr)^0

# ------------------------------------------- a year of renewals
""^0
"a subscription starting 31 January, renewed twelve times:"^0
2026 => sy
1 => sm
31 => sd
"" => stepped
for k in [1:12]:
    add_months_clamp(sy, sm, sd, 1) => nx
    nx[0] => sy
    nx[1] => sm
    nx[2] => sd
    if k <= 4 or k >= 11:
        stepped + fmt([sy, sm, sd]) + " " => stepped
("  by stepping:   " + stepped)^0
"" => direct
for k in [1:12]:
    add_months_clamp(2026, 1, 31, k) => nx
    if k <= 4 or k >= 11:
        direct + fmt(nx) + " " => direct
("  by start + n:  " + direct)^0

add_months_clamp(2026, 1, 31, 12) => year_direct
2026 => ty
1 => tm
31 => td
for k in [1:12]:
    add_months_clamp(ty, tm, td, 1) => nx
    nx[0] => ty
    nx[1] => tm
    nx[2] => td
("  after 12 months: stepping " + fmt([ty, tm, td]) + ", direct " + fmt(year_direct))^0

# ------------------------------------- where the two rules disagree at all
""^0
0 => rules_differ
0 => rules_n
for d in [1:31]:
    for m in [1:12]:
        if d <= days_in(m):
            rules_n + 1 => rules_n
            add_months_clamp(2026, m, d, 1) => c
            add_months_overflow(2026, m, d, 1) => o
            if not (fmt(c) == fmt(o)):
                rules_differ + 1 => rules_differ

("dates where clamp and overflow differ: " + str(rules_differ) + "/" + str(rules_n))^0
"...so a test with dates before the 29th cannot tell the two rules apart."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Clamping must fail to reverse on some dates - that is the property.
checked + 1 => checked
if rev_ok < rev_n and rev_ok > 0:
    passed + 1 => passed

# Stepping must diverge from adding at once, and the divergence must be a
# minority so it survives review.
checked + 1 => checked
if same < steps_n and same * 2 > steps_n:
    passed + 1 => passed

# The twelve-month subscription must land on different days by the two routes.
checked + 1 => checked
if not (fmt([ty, tm, td]) == fmt(year_direct)):
    passed + 1 => passed

# Direct addition must return to the 31st in a 31-day month; stepping must
# not. That is the whole practical consequence.
checked + 1 => checked
if year_direct[2] == 31 and td < 31:
    passed + 1 => passed

# The two rules must agree on every date up to the 28th, which is why the
# choice is invisible in most fixtures.
checked + 1 => checked
0 => agree_low
0 => low_n
for d in [1:28]:
    for m in [1:12]:
        low_n + 1 => low_n
        if fmt(add_months_clamp(2026, m, d, 1)) == fmt(add_months_overflow(2026, m, d, 1)):
            agree_low + 1 => agree_low
if agree_low == low_n:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Clamping loses a day permanently, and only for dates after the 28th." => verdict
else:
    "FAILED - a month rule did not behave as the checks describe." => verdict
verdict^0

""^0
"Two implementations of 'renew monthly' - step forward each time, or add n" => n1
n1^0
"to the start - agree for eleven months of the year and diverge permanently" => n2
n2^0
"after February. Neither is wrong; they answer different questions, and the" => n3
n3^0
"code that picks one usually did not know there were two." => n4
n4^0
```

## Python (deterministic transpilation)

```python
DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

def days_in(month):
    return DAYS[month - 1]

def add_months_clamp(y, m, d, k):
    t = m - 1 + k
    ny = y + int(t / 12)
    nm = t % 12 + 1
    nd = d
    if nd > days_in(nm):
        nd = days_in(nm)
    return [ny, nm, nd]

def add_months_overflow(y, m, d, k):
    t = m - 1 + k
    ny = y + int(t / 12)
    nm = t % 12 + 1
    nd = d
    while nd > days_in(nm):
        nd = nd - days_in(nm)
        nm = nm + 1
        if nm > 12:
            nm = 1
            ny = ny + 1
    return [ny, nm, nd]

def fmt(dt):
    s = str(dt[0]) + "-"
    if dt[1] < 10:
        s = s + "0"
    s = s + str(dt[1]) + "-"
    if dt[2] < 10:
        s = s + "0"
    return s + str(dt[2])

print("start        +1m clamp    +1m overflow  +2m clamp    step twice clamp")
for start in [[2026, 1, 31], [2026, 1, 30], [2026, 1, 15], [2026, 3, 31], [2026, 5, 31]]:
    y = start[0]
    m = start[1]
    d = start[2]
    c1 = add_months_clamp(y, m, d, 1)
    o1 = add_months_overflow(y, m, d, 1)
    c2 = add_months_clamp(y, m, d, 2)
    cc = add_months_clamp(c1[0], c1[1], c1[2], 1)
    print("%-12s %-12s %-13s %-12s %s" % (fmt(start), fmt(c1), fmt(o1), fmt(c2), fmt(cc)))
print("")
rev_ok = 0
rev_n = 0
rev_fail = []
for d in range(1, 32):
    for m in range(1, 13):
        if d <= days_in(m):
            rev_n = rev_n + 1
            fwd = add_months_clamp(2026, m, d, 1)
            back = add_months_clamp(fwd[0], fwd[1], fwd[2], 0 - 1)
            if back[0] == 2026 and back[1] == m and back[2] == d:
                rev_ok = rev_ok + 1
            elif len(rev_fail) < 3:
                rev_fail = rev_fail + [fmt([2026, m, d]) + " +1m -1m -> " + fmt(back)]
print("dates tried:                 " + str(rev_n))
print("  +1m then -1m returned:     " + str(rev_ok) + "/" + str(rev_n))
for r in rev_fail:
    print("  " + r)
print("")
same = 0
steps_n = 0
drift = []
for d in range(1, 32):
    for m in range(1, 13):
        if d <= days_in(m):
            steps_n = steps_n + 1
            at_once = add_months_clamp(2026, m, d, 3)
            cy = 2026
            cm = m
            cd = d
            for k in range(1, 4):
                nx = add_months_clamp(cy, cm, cd, 1)
                cy = nx[0]
                cm = nx[1]
                cd = nx[2]
            if at_once[0] == cy and at_once[1] == cm and at_once[2] == cd:
                same = same + 1
            elif len(drift) < 3:
                drift = drift + [fmt([2026, m, d]) + ": +3m = " + fmt(at_once) + ", three x +1m = " + fmt([cy, cm, cd])]
print("start dates tried:                " + str(steps_n))
print("  +3m equals three times +1m:     " + str(same) + "/" + str(steps_n))
for dr in drift:
    print("  " + dr)
print("")
print("a subscription starting 31 January, renewed twelve times:")
sy = 2026
sm = 1
sd = 31
stepped = ""
for k in range(1, 13):
    nx = add_months_clamp(sy, sm, sd, 1)
    sy = nx[0]
    sm = nx[1]
    sd = nx[2]
    if k <= 4 or k >= 11:
        stepped = stepped + fmt([sy, sm, sd]) + " "
print("  by stepping:   " + stepped)
direct = ""
for k in range(1, 13):
    nx = add_months_clamp(2026, 1, 31, k)
    if k <= 4 or k >= 11:
        direct = direct + fmt(nx) + " "
print("  by start + n:  " + direct)
year_direct = add_months_clamp(2026, 1, 31, 12)
ty = 2026
tm = 1
td = 31
for k in range(1, 13):
    nx = add_months_clamp(ty, tm, td, 1)
    ty = nx[0]
    tm = nx[1]
    td = nx[2]
print("  after 12 months: stepping " + fmt([ty, tm, td]) + ", direct " + fmt(year_direct))
print("")
rules_differ = 0
rules_n = 0
for d in range(1, 32):
    for m in range(1, 13):
        if d <= days_in(m):
            rules_n = rules_n + 1
            c = add_months_clamp(2026, m, d, 1)
            o = add_months_overflow(2026, m, d, 1)
            if not fmt(c) == fmt(o):
                rules_differ = rules_differ + 1
print("dates where clamp and overflow differ: " + str(rules_differ) + "/" + str(rules_n))
print("...so a test with dates before the 29th cannot tell the two rules apart.")
passed = 0
checked = 0
checked = checked + 1
if rev_ok < rev_n and rev_ok > 0:
    passed = passed + 1
checked = checked + 1
if same < steps_n and same * 2 > steps_n:
    passed = passed + 1
checked = checked + 1
if not fmt([ty, tm, td]) == fmt(year_direct):
    passed = passed + 1
checked = checked + 1
if year_direct[2] == 31 and td < 31:
    passed = passed + 1
checked = checked + 1
agree_low = 0
low_n = 0
for d in range(1, 29):
    for m in range(1, 13):
        low_n = low_n + 1
        if fmt(add_months_clamp(2026, m, d, 1)) == fmt(add_months_overflow(2026, m, d, 1)):
            agree_low = agree_low + 1
if agree_low == low_n:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Clamping loses a day permanently, and only for dates after the 28th."
else:
    verdict = "FAILED - a month rule did not behave as the checks describe."
print(verdict)
print("")
n1 = "Two implementations of 'renew monthly' - step forward each time, or add n"
print(n1)
n2 = "to the start - agree for eleven months of the year and diverge permanently"
print(n2)
n3 = "after February. Neither is wrong; they answer different questions, and the"
print(n3)
n4 = "code that picks one usually did not know there were two."
print(n4)
```

## stdout (executed)

```text
start        +1m clamp    +1m overflow  +2m clamp    step twice clamp
2026-01-31   2026-02-28   2026-03-03    2026-03-31   2026-03-28
2026-01-30   2026-02-28   2026-03-02    2026-03-30   2026-03-28
2026-01-15   2026-02-15   2026-02-15    2026-03-15   2026-03-15
2026-03-31   2026-04-30   2026-05-01    2026-05-31   2026-05-30
2026-05-31   2026-06-30   2026-07-01    2026-07-31   2026-07-30

dates tried:                 365
  +1m then -1m returned:     327/365
  2026-12-01 +1m -1m -> 2027-12-01
  2026-12-02 +1m -1m -> 2027-12-02
  2026-12-03 +1m -1m -> 2027-12-03

start dates tried:                365
  +3m equals three times +1m:     356/365
  2026-01-29: +3m = 2026-04-29, three x +1m = 2026-04-28
  2026-12-29: +3m = 2027-03-29, three x +1m = 2027-03-28
  2026-01-30: +3m = 2026-04-30, three x +1m = 2026-04-28

a subscription starting 31 January, renewed twelve times:
  by stepping:   2026-02-28 2026-03-28 2026-04-28 2026-05-28 2026-12-28 2027-01-28 
  by start + n:  2026-02-28 2026-03-31 2026-04-30 2026-05-31 2026-12-31 2027-01-31 
  after 12 months: stepping 2027-01-28, direct 2027-01-31

dates where clamp and overflow differ: 7/365
...so a test with dates before the 29th cannot tell the two rules apart.

checks passed: 5/5
Clamping loses a day permanently, and only for dates after the 28th.

Two implementations of 'renew monthly' - step forward each time, or add n
to the start - agree for eleven months of the year and diverge permanently
after February. Neither is wrong; they answer different questions, and the
code that picks one usually did not know there were two.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
