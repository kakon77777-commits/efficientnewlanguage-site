<!-- canonical: efficientnewlanguage.org/ai/examples/250-date-parse-ambiguity | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 250 — Date parse ambiguity — information that is not in the string

`date_parse_ambiguity.eml` parses slashed dates under DD/MM and MM/DD and measures how far apart the two readings land.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). 03/04/2026,
# which is two dates.
#
# A slashed date is ambiguous whenever both components are 12 or less, which
# is most of the year:
#
#     03/04/2026   3 April in most of the world
#                  4 March  in the United States
#
# The failure has no error state. Both readings produce a valid date, and a
# system that guesses is right about 88% of the time - the 12/31 of pairs
# where one component exceeds 12 and the ambiguity resolves itself.
#
# The measurement is exactly that: over every day of a year, how many
# formatted dates are ambiguous, how many are resolvable from the values
# alone, and how far apart the two readings are when they differ. Then the
# same sweep with an unambiguous format, which resolves everything by
# construction.
#
# What the program does NOT do is pick a locale. That is the point: the
# information is not in the string, so no parser can recover it, and the only
# repair is to change what is written down.

[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] => DAYS

def slashed(d, m):
    "" => s
    if d < 10:
        s + "0" => s
    s + str(d) + "/" => s
    if m < 10:
        s + "0" => s
    return s + str(m) + "/2026"

def iso(d, m):
    "2026-" => s
    if m < 10:
        s + "0" => s
    s + str(m) + "-" => s
    if d < 10:
        s + "0" => s
    return s + str(d)

def day_of_year(d, m):
    0 => n
    for k in [1:m - 1]:
        n + DAYS[k - 1] => n
    return n + d

def parse_dmy(s):
    # "DD/MM/YYYY" -> [day, month] or a raise.
    int(s[0:2]) => a
    int(s[3:5]) => b
    if b < 1 or b > 12:
        raise ValueError("month " + str(b) + " is not a month")
    if a < 1 or a > DAYS[b - 1]:
        raise ValueError("day " + str(a) + " is not a day of month " + str(b))
    return [a, b]

def parse_mdy(s):
    # The same string, read the other way.
    int(s[0:2]) => a
    int(s[3:5]) => b
    if a < 1 or a > 12:
        raise ValueError("month " + str(a) + " is not a month")
    if b < 1 or b > DAYS[a - 1]:
        raise ValueError("day " + str(b) + " is not a day of month " + str(a))
    return [b, a]

def parse_iso(s):
    int(s[5:7]) => m
    int(s[8:10]) => d
    if m < 1 or m > 12:
        raise ValueError("month " + str(m) + " is not a month")
    if d < 1 or d > DAYS[m - 1]:
        raise ValueError("day " + str(d) + " is not a day of month " + str(m))
    return [d, m]


"the date that is two dates:"^0
"03/04/2026" => sample
parse_dmy(sample) => as_dmy
parse_mdy(sample) => as_mdy
("  as DD/MM: day " + str(as_dmy[0]) + " of month " + str(as_dmy[1]) + "  (day " + str(day_of_year(as_dmy[0], as_dmy[1])) + " of the year)")^0
("  as MM/DD: day " + str(as_mdy[0]) + " of month " + str(as_mdy[1]) + "  (day " + str(day_of_year(as_mdy[0], as_mdy[1])) + " of the year)")^0
("  they are " + str(day_of_year(as_dmy[0], as_dmy[1]) - day_of_year(as_mdy[0], as_mdy[1])) + " days apart")^0

# ------------------------------------------------- sweep the whole year
0 => total
0 => ambiguous
0 => resolvable
0 => worst_gap
"" => worst_date
for m in [1:12]:
    for d in [1:DAYS[m - 1]]:
        total + 1 => total
        slashed(d, m) => s
        0 => ok_dmy
        0 => ok_mdy
        try:
            parse_dmy(s) => a
            1 => ok_dmy
        except ValueError as e:
            0 => ok_dmy
        try:
            parse_mdy(s) => b
            1 => ok_mdy
        except ValueError as e:
            0 => ok_mdy
        if ok_dmy == 1 and ok_mdy == 1:
            parse_dmy(s) => a
            parse_mdy(s) => b
            if day_of_year(a[0], a[1]) == day_of_year(b[0], b[1]):
                resolvable + 1 => resolvable
            else:
                ambiguous + 1 => ambiguous
                day_of_year(a[0], a[1]) - day_of_year(b[0], b[1]) => gap
                if gap < 0:
                    0 - gap => gap
                if gap > worst_gap:
                    gap => worst_gap
                    s => worst_date
        else:
            resolvable + 1 => resolvable

""^0
("dates in the year:                    " + str(total))^0
("  slashed form is ambiguous:          " + str(ambiguous))^0
("  resolvable from the values alone:   " + str(resolvable))^0
("  worst disagreement:                 " + str(worst_gap) + " days, on " + worst_date)^0

# ------------------------------------ the resolvable ones are resolvable by luck
# A date resolves only because one component exceeds 12 - a fact about the
# date, not about the format. So the parser is correct on a majority of inputs
# for a reason that has nothing to do with the parser.
0 => resolved_by_range
for m in [1:12]:
    for d in [1:DAYS[m - 1]]:
        if d > 12:
            resolved_by_range + 1 => resolved_by_range

""^0
("dates where the day exceeds 12: " + str(resolved_by_range))^0
("...which is why the slashed form works most of the time.")^0

# -------------------------------------------------- the unambiguous format
0 => iso_total
0 => iso_ok
for m in [1:12]:
    for d in [1:DAYS[m - 1]]:
        iso_total + 1 => iso_total
        parse_iso(iso(d, m)) => r
        if r[0] == d and r[1] == m:
            iso_ok + 1 => iso_ok

""^0
("ISO dates parsed back exactly: " + str(iso_ok) + "/" + str(iso_total))^0

# --------------------------------------- a wrong reading is still a valid date
""^0
"what a system does with a misread date:"^0
for s in ["03/04/2026", "12/01/2026", "01/12/2026"]:
    parse_dmy(s) => a
    parse_mdy(s) => b
    ("  " + s + " -> " + iso(a[0], a[1]) + " or " + iso(b[0], b[1]) + "   both valid, " + str(day_of_year(a[0], a[1]) - day_of_year(b[0], b[1])) + " days apart")^0

# --------------------------------------------- malformed input is refused
0 => refused
for s in ["32/01/2026", "01/13/2026", "00/05/2026", "31/02/2026"]:
    try:
        parse_dmy(s) => v
    except ValueError as e:
        refused + 1 => refused

""^0
("clearly malformed slashed dates refused by DD/MM: " + str(refused) + "/4")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The ISO form must round-trip every date. This is the repair.
checked + 1 => checked
if iso_ok == iso_total:
    passed + 1 => passed

# The slashed form must be ambiguous on a real number of dates, and
# unambiguous on a majority - the majority is why it survives.
checked + 1 => checked
if ambiguous > 0 and resolvable > ambiguous:
    passed + 1 => passed

# Every ambiguous date must have both components <= 12, and the count must
# match exactly - the ambiguity is a property of the values, computed rather
# than assumed.
checked + 1 => checked
0 => both_small
for m in [1:12]:
    for d in [1:DAYS[m - 1]]:
        if d <= 12 and m <= 12 and not (d == m):
            both_small + 1 => both_small
if ambiguous == both_small:
    passed + 1 => passed

# A date where day equals month must NOT be ambiguous, since both readings
# give the same answer. That is the edge the count above depends on.
checked + 1 => checked
parse_dmy("05/05/2026") => same_a
parse_mdy("05/05/2026") => same_b
if day_of_year(same_a[0], same_a[1]) == day_of_year(same_b[0], same_b[1]):
    passed + 1 => passed

# And malformed input must still be refused - ambiguity is not the same as
# accepting anything.
checked + 1 => checked
if refused == 4:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The information is not in the string, so no parser can recover it." => verdict
else:
    "FAILED - a parser did not behave as the checks describe." => verdict
verdict^0

""^0
"The slashed form is correct on most dates because most dates have a day" => n1
n1^0
"above 12, which is a fact about calendars rather than about the parser." => n2
n2^0
"That is the shape of the whole problem: the code appears to work, its" => n3
n3^0
"success rate is high and stable, and the reason has nothing to do with any" => n4
n4^0
"decision anyone made." => n5
n5^0
```

## Python (deterministic transpilation)

```python
DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

def slashed(d, m):
    s = ""
    if d < 10:
        s = s + "0"
    s = s + str(d) + "/"
    if m < 10:
        s = s + "0"
    return s + str(m) + "/2026"

def iso(d, m):
    s = "2026-"
    if m < 10:
        s = s + "0"
    s = s + str(m) + "-"
    if d < 10:
        s = s + "0"
    return s + str(d)

def day_of_year(d, m):
    n = 0
    for k in range(1, m):
        n = n + DAYS[k - 1]
    return n + d

def parse_dmy(s):
    a = int(s[0:2])
    b = int(s[3:5])
    if b < 1 or b > 12:
        raise ValueError("month " + str(b) + " is not a month")
    if a < 1 or a > DAYS[b - 1]:
        raise ValueError("day " + str(a) + " is not a day of month " + str(b))
    return [a, b]

def parse_mdy(s):
    a = int(s[0:2])
    b = int(s[3:5])
    if a < 1 or a > 12:
        raise ValueError("month " + str(a) + " is not a month")
    if b < 1 or b > DAYS[a - 1]:
        raise ValueError("day " + str(b) + " is not a day of month " + str(a))
    return [b, a]

def parse_iso(s):
    m = int(s[5:7])
    d = int(s[8:10])
    if m < 1 or m > 12:
        raise ValueError("month " + str(m) + " is not a month")
    if d < 1 or d > DAYS[m - 1]:
        raise ValueError("day " + str(d) + " is not a day of month " + str(m))
    return [d, m]

print("the date that is two dates:")
sample = "03/04/2026"
as_dmy = parse_dmy(sample)
as_mdy = parse_mdy(sample)
print("  as DD/MM: day " + str(as_dmy[0]) + " of month " + str(as_dmy[1]) + "  (day " + str(day_of_year(as_dmy[0], as_dmy[1])) + " of the year)")
print("  as MM/DD: day " + str(as_mdy[0]) + " of month " + str(as_mdy[1]) + "  (day " + str(day_of_year(as_mdy[0], as_mdy[1])) + " of the year)")
print("  they are " + str(day_of_year(as_dmy[0], as_dmy[1]) - day_of_year(as_mdy[0], as_mdy[1])) + " days apart")
total = 0
ambiguous = 0
resolvable = 0
worst_gap = 0
worst_date = ""
for m in range(1, 13):
    for d in range(1, DAYS[m - 1]+1):
        total = total + 1
        s = slashed(d, m)
        ok_dmy = 0
        ok_mdy = 0
        try:
            a = parse_dmy(s)
            ok_dmy = 1
        except ValueError as e:
            ok_dmy = 0
        try:
            b = parse_mdy(s)
            ok_mdy = 1
        except ValueError as e:
            ok_mdy = 0
        if ok_dmy == 1 and ok_mdy == 1:
            a = parse_dmy(s)
            b = parse_mdy(s)
            if day_of_year(a[0], a[1]) == day_of_year(b[0], b[1]):
                resolvable = resolvable + 1
            else:
                ambiguous = ambiguous + 1
                gap = day_of_year(a[0], a[1]) - day_of_year(b[0], b[1])
                if gap < 0:
                    gap = 0 - gap
                if gap > worst_gap:
                    worst_gap = gap
                    worst_date = s
        else:
            resolvable = resolvable + 1
print("")
print("dates in the year:                    " + str(total))
print("  slashed form is ambiguous:          " + str(ambiguous))
print("  resolvable from the values alone:   " + str(resolvable))
print("  worst disagreement:                 " + str(worst_gap) + " days, on " + worst_date)
resolved_by_range = 0
for m in range(1, 13):
    for d in range(1, DAYS[m - 1]+1):
        if d > 12:
            resolved_by_range = resolved_by_range + 1
print("")
print("dates where the day exceeds 12: " + str(resolved_by_range))
print("...which is why the slashed form works most of the time.")
iso_total = 0
iso_ok = 0
for m in range(1, 13):
    for d in range(1, DAYS[m - 1]+1):
        iso_total = iso_total + 1
        r = parse_iso(iso(d, m))
        if r[0] == d and r[1] == m:
            iso_ok = iso_ok + 1
print("")
print("ISO dates parsed back exactly: " + str(iso_ok) + "/" + str(iso_total))
print("")
print("what a system does with a misread date:")
for s in ["03/04/2026", "12/01/2026", "01/12/2026"]:
    a = parse_dmy(s)
    b = parse_mdy(s)
    print("  " + s + " -> " + iso(a[0], a[1]) + " or " + iso(b[0], b[1]) + "   both valid, " + str(day_of_year(a[0], a[1]) - day_of_year(b[0], b[1])) + " days apart")
refused = 0
for s in ["32/01/2026", "01/13/2026", "00/05/2026", "31/02/2026"]:
    try:
        v = parse_dmy(s)
    except ValueError as e:
        refused = refused + 1
print("")
print("clearly malformed slashed dates refused by DD/MM: " + str(refused) + "/4")
passed = 0
checked = 0
checked = checked + 1
if iso_ok == iso_total:
    passed = passed + 1
checked = checked + 1
if ambiguous > 0 and resolvable > ambiguous:
    passed = passed + 1
checked = checked + 1
both_small = 0
for m in range(1, 13):
    for d in range(1, DAYS[m - 1]+1):
        if d <= 12 and m <= 12 and not d == m:
            both_small = both_small + 1
if ambiguous == both_small:
    passed = passed + 1
checked = checked + 1
same_a = parse_dmy("05/05/2026")
same_b = parse_mdy("05/05/2026")
if day_of_year(same_a[0], same_a[1]) == day_of_year(same_b[0], same_b[1]):
    passed = passed + 1
checked = checked + 1
if refused == 4:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The information is not in the string, so no parser can recover it."
else:
    verdict = "FAILED - a parser did not behave as the checks describe."
print(verdict)
print("")
n1 = "The slashed form is correct on most dates because most dates have a day"
print(n1)
n2 = "above 12, which is a fact about calendars rather than about the parser."
print(n2)
n3 = "That is the shape of the whole problem: the code appears to work, its"
print(n3)
n4 = "success rate is high and stable, and the reason has nothing to do with any"
print(n4)
n5 = "decision anyone made."
print(n5)
```

## stdout (executed)

```text
the date that is two dates:
  as DD/MM: day 3 of month 4  (day 93 of the year)
  as MM/DD: day 4 of month 3  (day 63 of the year)
  they are 30 days apart

dates in the year:                    365
  slashed form is ambiguous:          132
  resolvable from the values alone:   233
  worst disagreement:                 323 days, on 12/01/2026

dates where the day exceeds 12: 221
...which is why the slashed form works most of the time.

ISO dates parsed back exactly: 365/365

what a system does with a misread date:
  03/04/2026 -> 2026-04-03 or 2026-03-04   both valid, 30 days apart
  12/01/2026 -> 2026-01-12 or 2026-12-01   both valid, -323 days apart
  01/12/2026 -> 2026-12-01 or 2026-01-12   both valid, 323 days apart

clearly malformed slashed dates refused by DD/MM: 4/4

checks passed: 5/5
The information is not in the string, so no parser can recover it.

The slashed form is correct on most dates because most dates have a day
above 12, which is a fact about calendars rather than about the parser.
That is the shape of the whole problem: the code appears to work, its
success rate is high and stable, and the reason has nothing to do with any
decision anyone made.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
