<!-- canonical: efficientnewlanguage.org/ai/examples/260-week-numbering-conventions | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 260 — Week numbering conventions — "week 1" is at least three weeks

`week_numbering_conventions.eml` sweeps a year day by day under ISO, "simple" (week 1 starts 1 January) and US (weeks start Sunday) numbering, and checks the properties a week number needs to work as a grouping key.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). "Week 1", which
# is at least three different weeks.
#
# A weekly report is grouped by week number, and the number depends on a
# convention nobody states:
#
#     ISO       week 1 contains the first Thursday; weeks start Monday
#     simple    week 1 starts 1 January; weeks start whenever that was
#     US        week 1 contains 1 January; weeks start Sunday
#
# They disagree at both ends of the year, which is exactly where an annual
# report is read. Under ISO, 1 January can be in week 52 or 53 of the
# PREVIOUS year, and 31 December can be in week 1 of the NEXT - so a naive
# grouping by (year, week) puts December revenue in next year's first week or
# loses it entirely.
#
# The measurement is a year swept day by day under each convention, checking
# the properties a week numbering needs if it is to be used as a grouping key:
#
#     every day gets exactly one (year, week)
#     every week has exactly seven days, or is a boundary week
#     the sequence is contiguous - no gaps, no repeats within a year
#
# ISO satisfies the first and third and the second only in the interior; the
# simple scheme fails the second badly and the third not at all. Which one is
# right depends on the report, and the point is that the choice is a choice.

[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] => DAYS

def is_leap(y):
    if y % 400 == 0:
        return True
    if y % 100 == 0:
        return False
    return y % 4 == 0

def days_in_year(y):
    if is_leap(y):
        return 366
    return 365

def day_of_year(y, m, d):
    0 => n
    for mm in [1:m - 1]:
        n + DAYS[mm - 1] => n
        if mm == 2 and is_leap(y):
            n + 1 => n
    return n + d

def weekday_of(y, doy):
    # 0 = Monday. 2026-01-01 is a Thursday, which is index 3.
    # Anchored on that and stepped by whole years so the arithmetic is visible.
    3 => anchor
    y - 2026 => dy
    anchor => w
    if dy >= 0:
        for k in [0:dy - 1]:
            w + days_in_year(2026 + k) => w
    else:
        for k in [1:0 - dy]:
            w - days_in_year(2026 - k) => w
    return (w + doy - 1) % 7

def iso_week(y, m, d):
    # Week 1 is the week containing the first Thursday, i.e. the week
    # containing 4 January. Returns [year, week].
    day_of_year(y, m, d) => doy
    weekday_of(y, doy) => wd
    doy - wd + 3 => thursday_doy
    if thursday_doy < 1:
        # Belongs to the last week of the previous year.
        y - 1 => py
        thursday_doy + days_in_year(py) => t2
        return [py, int((t2 - 1) / 7) + 1]
    if thursday_doy > days_in_year(y):
        return [y + 1, 1]
    return [y, int((thursday_doy - 1) / 7) + 1]

def simple_week(y, m, d):
    day_of_year(y, m, d) => doy
    return [y, int((doy - 1) / 7) + 1]

def us_week(y, m, d):
    # Weeks start Sunday; week 1 is the week containing 1 January.
    day_of_year(y, m, d) => doy
    weekday_of(y, doy) => wd
    (wd + 1) % 7 => sun_index
    weekday_of(y, 1) => jan1
    (jan1 + 1) % 7 => jan1_sun
    return [y, int((doy + jan1_sun - 1) / 7) + 1]


"date          ISO        simple     US"^0
for row in [[2026, 1, 1], [2026, 1, 4], [2026, 1, 5], [2026, 6, 15], [2026, 12, 28], [2026, 12, 31]]:
    row[0] => y
    row[1] => m
    row[2] => d
    iso_week(y, m, d) => i
    simple_week(y, m, d) => s
    us_week(y, m, d) => u
    ("%-13s %-10s %-10s %s" % (str(y) + "-" + str(m) + "-" + str(d), str(i[0]) + "w" + str(i[1]), str(s[0]) + "w" + str(s[1]), str(u[0]) + "w" + str(u[1])))^0

# ---------------------------------------------- sweep the year
{} => iso_sizes
{} => simple_sizes
0 => days
0 => iso_other_year
for m in [1:12]:
    for d in [1:DAYS[m - 1]]:
        days + 1 => days
        iso_week(2026, m, d) => i
        simple_week(2026, m, d) => s
        str(i[0]) + "w" + str(i[1]) => ik
        if ik in iso_sizes:
            iso_sizes[ik] + 1 => iso_sizes[ik]
        else:
            1 => iso_sizes[ik]
        if not (i[0] == 2026):
            iso_other_year + 1 => iso_other_year
        str(s[0]) + "w" + str(s[1]) => sk
        if sk in simple_sizes:
            simple_sizes[sk] + 1 => simple_sizes[sk]
        else:
            1 => simple_sizes[sk]

0 => iso_full
0 => iso_short
for k in iso_sizes:
    if iso_sizes[k] == 7:
        iso_full + 1 => iso_full
    else:
        iso_short + 1 => iso_short
0 => simple_full
0 => simple_short
for k in simple_sizes:
    if simple_sizes[k] == 7:
        simple_full + 1 => simple_full
    else:
        simple_short + 1 => simple_short

""^0
("days in 2026: " + str(days))^0
("ISO:    " + str(len(iso_sizes)) + " distinct weeks, " + str(iso_full) + " full, " + str(iso_short) + " partial")^0
("simple: " + str(len(simple_sizes)) + " distinct weeks, " + str(simple_full) + " full, " + str(simple_short) + " partial")^0
("days ISO assigns to another YEAR: " + str(iso_other_year))^0

# ---------------------------------------- where the conventions disagree
0 => disagree
0 => first_shown
for m in [1:12]:
    for d in [1:DAYS[m - 1]]:
        iso_week(2026, m, d) => i
        us_week(2026, m, d) => u
        if not (i[1] == u[1]) or not (i[0] == u[0]):
            disagree + 1 => disagree
            if first_shown == 0 and m > 5:
                1 => first_shown
                ("  mid-year disagreement: 2026-" + str(m) + "-" + str(d) + " is ISO w" + str(i[1]) + " and US w" + str(u[1]))^0

""^0
("days where ISO and US disagree on the week number: " + str(disagree) + "/" + str(days))^0

# ------------------------------------- a report grouped by week
""^0
"revenue booked on 2026-12-31, grouped by week:"^0
iso_week(2026, 12, 31) => dec_iso
simple_week(2026, 12, 31) => dec_simple
("  ISO:    " + str(dec_iso[0]) + " week " + str(dec_iso[1]))^0
("  simple: " + str(dec_simple[0]) + " week " + str(dec_simple[1]))^0
if not (dec_iso[0] == 2026):
    "  ...so an annual report filtered on year 2026 loses it under ISO."^0
else:
    "  ...both keep it inside 2026 this year, which is not true every year."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Every day must get exactly one week under each scheme - the counts must sum
# back to the length of the year.
checked + 1 => checked
0 => iso_total
for k in iso_sizes:
    iso_total + iso_sizes[k] => iso_total
0 => simple_total
for k in simple_sizes:
    simple_total + simple_sizes[k] => simple_total
if iso_total == days and simple_total == days:
    passed + 1 => passed

# ISO must have mostly full weeks; the simple scheme must end with a short one
# because 365 is not a multiple of 7.
checked + 1 => checked
if simple_short >= 1 and iso_full >= 50:
    passed + 1 => passed

# The simple scheme must produce a 53rd bucket, since 365/7 is 52 and a bit.
checked + 1 => checked
if len(simple_sizes) == 53:
    passed + 1 => passed

# ISO and US must agree in the interior and differ somewhere - if they never
# differed the convention would not matter.
checked + 1 => checked
if disagree > 0 and disagree < days:
    passed + 1 => passed

# The weekday anchor must be right: 2026-01-01 is a Thursday.
checked + 1 => checked
if weekday_of(2026, 1) == 3 and weekday_of(2026, 5) == 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Three conventions, one phrase, and they part at both ends of the year." => verdict
else:
    "FAILED - a week numbering did not behave as the checks describe." => verdict
verdict^0

""^0
"A week number is only a grouping key if the convention is written down" => n1
n1^0
"next to it, because the three schemes agree through the middle of the year" => n2
n2^0
"and part exactly where an annual report is read. Under ISO a week can even" => n3
n3^0
"belong to a different YEAR than its days, which is the part that surprises" => n4
n4^0
"a filter written as `year = 2026`." => n5
n5^0
```

## Python (deterministic transpilation)

```python
DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

def is_leap(y):
    if y % 400 == 0:
        return True
    if y % 100 == 0:
        return False
    return y % 4 == 0

def days_in_year(y):
    if is_leap(y):
        return 366
    return 365

def day_of_year(y, m, d):
    n = 0
    for mm in range(1, m):
        n = n + DAYS[mm - 1]
        if mm == 2 and is_leap(y):
            n = n + 1
    return n + d

def weekday_of(y, doy):
    anchor = 3
    dy = y - 2026
    w = anchor
    if dy >= 0:
        for k in range(0, dy):
            w = w + days_in_year(2026 + k)
    else:
        for k in range(1, 0 - dy+1):
            w = w - days_in_year(2026 - k)
    return (w + doy - 1) % 7

def iso_week(y, m, d):
    doy = day_of_year(y, m, d)
    wd = weekday_of(y, doy)
    thursday_doy = doy - wd + 3
    if thursday_doy < 1:
        py = y - 1
        t2 = thursday_doy + days_in_year(py)
        return [py, int((t2 - 1) / 7) + 1]
    if thursday_doy > days_in_year(y):
        return [y + 1, 1]
    return [y, int((thursday_doy - 1) / 7) + 1]

def simple_week(y, m, d):
    doy = day_of_year(y, m, d)
    return [y, int((doy - 1) / 7) + 1]

def us_week(y, m, d):
    doy = day_of_year(y, m, d)
    wd = weekday_of(y, doy)
    sun_index = (wd + 1) % 7
    jan1 = weekday_of(y, 1)
    jan1_sun = (jan1 + 1) % 7
    return [y, int((doy + jan1_sun - 1) / 7) + 1]

print("date          ISO        simple     US")
for row in [[2026, 1, 1], [2026, 1, 4], [2026, 1, 5], [2026, 6, 15], [2026, 12, 28], [2026, 12, 31]]:
    y = row[0]
    m = row[1]
    d = row[2]
    i = iso_week(y, m, d)
    s = simple_week(y, m, d)
    u = us_week(y, m, d)
    print("%-13s %-10s %-10s %s" % (str(y) + "-" + str(m) + "-" + str(d), str(i[0]) + "w" + str(i[1]), str(s[0]) + "w" + str(s[1]), str(u[0]) + "w" + str(u[1])))
iso_sizes = {}
simple_sizes = {}
days = 0
iso_other_year = 0
for m in range(1, 13):
    for d in range(1, DAYS[m - 1]+1):
        days = days + 1
        i = iso_week(2026, m, d)
        s = simple_week(2026, m, d)
        ik = str(i[0]) + "w" + str(i[1])
        if ik in iso_sizes:
            iso_sizes[ik] = iso_sizes[ik] + 1
        else:
            iso_sizes[ik] = 1
        if not i[0] == 2026:
            iso_other_year = iso_other_year + 1
        sk = str(s[0]) + "w" + str(s[1])
        if sk in simple_sizes:
            simple_sizes[sk] = simple_sizes[sk] + 1
        else:
            simple_sizes[sk] = 1
iso_full = 0
iso_short = 0
for k in iso_sizes:
    if iso_sizes[k] == 7:
        iso_full = iso_full + 1
    else:
        iso_short = iso_short + 1
simple_full = 0
simple_short = 0
for k in simple_sizes:
    if simple_sizes[k] == 7:
        simple_full = simple_full + 1
    else:
        simple_short = simple_short + 1
print("")
print("days in 2026: " + str(days))
print("ISO:    " + str(len(iso_sizes)) + " distinct weeks, " + str(iso_full) + " full, " + str(iso_short) + " partial")
print("simple: " + str(len(simple_sizes)) + " distinct weeks, " + str(simple_full) + " full, " + str(simple_short) + " partial")
print("days ISO assigns to another YEAR: " + str(iso_other_year))
disagree = 0
first_shown = 0
for m in range(1, 13):
    for d in range(1, DAYS[m - 1]+1):
        i = iso_week(2026, m, d)
        u = us_week(2026, m, d)
        if not i[1] == u[1] or not i[0] == u[0]:
            disagree = disagree + 1
            if first_shown == 0 and m > 5:
                first_shown = 1
                print("  mid-year disagreement: 2026-" + str(m) + "-" + str(d) + " is ISO w" + str(i[1]) + " and US w" + str(u[1]))
print("")
print("days where ISO and US disagree on the week number: " + str(disagree) + "/" + str(days))
print("")
print("revenue booked on 2026-12-31, grouped by week:")
dec_iso = iso_week(2026, 12, 31)
dec_simple = simple_week(2026, 12, 31)
print("  ISO:    " + str(dec_iso[0]) + " week " + str(dec_iso[1]))
print("  simple: " + str(dec_simple[0]) + " week " + str(dec_simple[1]))
if not dec_iso[0] == 2026:
    print("  ...so an annual report filtered on year 2026 loses it under ISO.")
else:
    print("  ...both keep it inside 2026 this year, which is not true every year.")
passed = 0
checked = 0
checked = checked + 1
iso_total = 0
for k in iso_sizes:
    iso_total = iso_total + iso_sizes[k]
simple_total = 0
for k in simple_sizes:
    simple_total = simple_total + simple_sizes[k]
if iso_total == days and simple_total == days:
    passed = passed + 1
checked = checked + 1
if simple_short >= 1 and iso_full >= 50:
    passed = passed + 1
checked = checked + 1
if len(simple_sizes) == 53:
    passed = passed + 1
checked = checked + 1
if disagree > 0 and disagree < days:
    passed = passed + 1
checked = checked + 1
if weekday_of(2026, 1) == 3 and weekday_of(2026, 5) == 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Three conventions, one phrase, and they part at both ends of the year."
else:
    verdict = "FAILED - a week numbering did not behave as the checks describe."
print(verdict)
print("")
n1 = "A week number is only a grouping key if the convention is written down"
print(n1)
n2 = "next to it, because the three schemes agree through the middle of the year"
print(n2)
n3 = "and part exactly where an annual report is read. Under ISO a week can even"
print(n3)
n4 = "belong to a different YEAR than its days, which is the part that surprises"
print(n4)
n5 = "a filter written as `year = 2026`."
print(n5)
```

## stdout (executed)

```text
date          ISO        simple     US
2026-1-1      2026w1     2026w1     2026w1
2026-1-4      2026w1     2026w1     2026w2
2026-1-5      2026w2     2026w1     2026w2
2026-6-15     2026w25    2026w24    2026w25
2026-12-28    2026w53    2026w52    2026w53
2026-12-31    2026w53    2026w53    2026w53

days in 2026: 365
ISO:    53 distinct weeks, 51 full, 2 partial
simple: 53 distinct weeks, 52 full, 1 partial
days ISO assigns to another YEAR: 0
  mid-year disagreement: 2026-6-7 is ISO w23 and US w24

days where ISO and US disagree on the week number: 52/365

revenue booked on 2026-12-31, grouped by week:
  ISO:    2026 week 53
  simple: 2026 week 53
  ...both keep it inside 2026 this year, which is not true every year.

checks passed: 5/5
Three conventions, one phrase, and they part at both ends of the year.

A week number is only a grouping key if the convention is written down
next to it, because the three schemes agree through the middle of the year
and part exactly where an annual report is read. Under ISO a week can even
belong to a different YEAR than its days, which is the part that surprises
a filter written as `year = 2026`.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
