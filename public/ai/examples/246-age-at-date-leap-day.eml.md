<!-- canonical: efficientnewlanguage.org/ai/examples/246-age-at-date-leap-day | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 246 — Age at a date — three defensible answers on 29 February

`age_at_date_leap_day.eml` computes age four ways and compares them against a reference table written from the definition rather than from any of the implementations.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). How old someone
# is, which is three different answers on 29 February.
#
# Age in years is not a division. `(days_elapsed) / 365` drifts by a day every
# four years and is wrong for about a quarter of all people on any given day.
# The correct rule is a comparison:
#
#     age = year difference, minus one if the birthday has not occurred yet
#
# and "has the birthday occurred" is exactly where 29 February has no answer.
# A person born on 29 February 2004 has a birthday in 2024 and not in 2025,
# so on 28 February 2025 they are either 20 or 21 depending on a rule nobody
# wrote down. Both are used in real law and real software.
#
# The measurement compares four implementations against a rule stated
# independently - a table of (birth, on, expected) pairs written from the
# definition rather than from any of the implementations - and then sweeps a
# range of dates to count where they disagree.

[31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] => DAYS

def is_leap(y):
    if y % 400 == 0:
        return True
    if y % 100 == 0:
        return False
    return y % 4 == 0

def days_in(y, m):
    if m == 2 and is_leap(y):
        return 29
    return DAYS[m - 1]

def day_number(y, m, d):
    # Days since 0001-01-01, good enough for differences.
    #
    # The leap count is arithmetic rather than a loop. Looping over every year
    # since year 1 is two thousand iterations PER CALL, and this function is
    # called inside two sweeps - it produced a 234 MB execution trace for a
    # program whose output is thirty lines. The closed form is also the
    # definition of the Gregorian rule, so it is clearer as well as smaller.
    y - 1 => py
    365 * py + int(py / 4) - int(py / 100) + int(py / 400) => n
    for mm in [1:m - 1]:
        n + days_in(y, mm) => n
    return n + d

def age_divide(by, bm, bd, y, m, d):
    # The wrong one, and the one that gets written first.
    return int((day_number(y, m, d) - day_number(by, bm, bd)) / 365)

def age_compare_march(by, bm, bd, y, m, d):
    # A 29 Feb birthday is treated as 1 March in non-leap years.
    y - by => a
    bm => em
    bd => ed
    if bm == 2 and bd == 29 and not (is_leap(y)):
        3 => em
        1 => ed
    if m < em or (m == em and d < ed):
        a - 1 => a
    return a

def age_compare_feb(by, bm, bd, y, m, d):
    # A 29 Feb birthday is treated as 28 February in non-leap years.
    y - by => a
    bm => em
    bd => ed
    if bm == 2 and bd == 29 and not (is_leap(y)):
        2 => em
        28 => ed
    if m < em or (m == em and d < ed):
        a - 1 => a
    return a

def age_compare_exact(by, bm, bd, y, m, d):
    # No accommodation: the birthday simply does not occur in a non-leap year,
    # so the age increments on the next 29 February. Legally used in some
    # places and startling everywhere.
    y - by => a
    if m < bm or (m == bm and d < bd):
        a - 1 => a
    return a


# Expected ages, written from the definition rather than from any function.
[
    [2000, 6, 15, 2026, 6, 14, 25],
    [2000, 6, 15, 2026, 6, 15, 26],
    [2000, 6, 15, 2026, 6, 16, 26],
    [2004, 2, 29, 2024, 2, 29, 20],
    [2004, 2, 29, 2024, 3, 1, 20],
    [1990, 1, 1, 2026, 1, 1, 36],
    [1990, 12, 31, 2026, 1, 1, 35]
] => expected

"birth        on           expected  divide  march  feb   exact"^0
0 => n
{} => wrong
for nm in ["divide", "march", "feb", "exact"]:
    0 => wrong[nm]
for row in expected:
    n + 1 => n
    row[0] => by
    row[1] => bm
    row[2] => bd
    row[3] => y
    row[4] => m
    row[5] => d
    row[6] => want
    age_divide(by, bm, bd, y, m, d) => a1
    age_compare_march(by, bm, bd, y, m, d) => a2
    age_compare_feb(by, bm, bd, y, m, d) => a3
    age_compare_exact(by, bm, bd, y, m, d) => a4
    if not (a1 == want):
        wrong["divide"] + 1 => wrong["divide"]
    if not (a2 == want):
        wrong["march"] + 1 => wrong["march"]
    if not (a3 == want):
        wrong["feb"] + 1 => wrong["feb"]
    if not (a4 == want):
        wrong["exact"] + 1 => wrong["exact"]
    ("%-12s %-12s %-9d %-7d %-6d %-5d %d" % (str(by) + "-" + str(bm) + "-" + str(bd), str(y) + "-" + str(m) + "-" + str(d), want, a1, a2, a3, a4))^0

""^0
("reference rows: " + str(n))^0
for nm in ["divide", "march", "feb", "exact"]:
    ("  " + nm + " wrong on: " + str(wrong[nm]) + "/" + str(n))^0

# ------------------------------------------ 28 February in a non-leap year
""^0
"someone born 2004-02-29, on 2025-02-28 and 2025-03-01:"^0
for pair in [[2025, 2, 28], [2025, 3, 1]]:
    pair[0] => y
    pair[1] => m
    pair[2] => d
    ("  " + str(y) + "-" + str(m) + "-" + str(d) + ": march-rule " + str(age_compare_march(2004, 2, 29, y, m, d)) + ", feb-rule " + str(age_compare_feb(2004, 2, 29, y, m, d)) + ", exact-rule " + str(age_compare_exact(2004, 2, 29, y, m, d)))^0

# --------------------------------- how often the divide rule is wrong
0 => sweep_n
0 => divide_wrong
0 => rules_differ
for by in [1990, 2000, 2004]:
    for m in [1:12]:
        for d in [1, 15, 28]:
            sweep_n + 1 => sweep_n
            age_compare_march(by, 6, 15, 2026, m, d) => truth
            if not (age_divide(by, 6, 15, 2026, m, d) == truth):
                divide_wrong + 1 => divide_wrong
            if not (age_compare_feb(by, 2, 29, 2026, m, d) == age_compare_exact(by, 2, 29, 2026, m, d)):
                rules_differ + 1 => rules_differ

""^0
("dates swept:                              " + str(sweep_n))^0
("  divide rule disagreed with compare:     " + str(divide_wrong))^0
("  feb-rule and exact-rule disagreed:      " + str(rules_differ))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Both accommodating compare rules must match the reference table exactly.
checked + 1 => checked
if wrong["march"] == 0 and wrong["feb"] == 0:
    passed + 1 => passed

# The divide rule must be wrong somewhere, or there is nothing to demonstrate.
checked + 1 => checked
if wrong["divide"] > 0 or divide_wrong > 0:
    passed + 1 => passed

# The three leap-day rules must agree on a leap year and disagree in a
# non-leap year - that is the whole ambiguity, measured.
checked + 1 => checked
if age_compare_march(2004, 2, 29, 2024, 2, 29) == age_compare_feb(2004, 2, 29, 2024, 2, 29):
    if not (age_compare_feb(2004, 2, 29, 2025, 2, 28) == age_compare_exact(2004, 2, 29, 2025, 2, 28)):
        passed + 1 => passed

# A non-leap birthday must be unaffected by which rule is chosen.
checked + 1 => checked
0 => same_for_ordinary
0 => ord_n
for m in [1:12]:
    for d in [1, 15, 28]:
        ord_n + 1 => ord_n
        if age_compare_march(2000, 6, 15, 2026, m, d) == age_compare_feb(2000, 6, 15, 2026, m, d):
            if age_compare_march(2000, 6, 15, 2026, m, d) == age_compare_exact(2000, 6, 15, 2026, m, d):
                same_for_ordinary + 1 => same_for_ordinary
if same_for_ordinary == ord_n:
    passed + 1 => passed

# And the leap rule itself must be right at the century boundaries.
checked + 1 => checked
if is_leap(2000) and not is_leap(1900) and is_leap(2024) and not is_leap(2023):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Three defensible rules agree in leap years and disagree on 28 February." => verdict
else:
    "FAILED - an age rule did not behave as the checks describe." => verdict
verdict^0

""^0
"Dividing by 365 is wrong for a reason that has nothing to do with leap" => n1
n1^0
"days: age is a comparison, not a quotient. The leap-day question is" => n2
n2^0
"separate and has no computable answer - it is a legal choice, and a" => n3
n3^0
"codebase that never wrote it down has still made it." => n4
n4^0
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

def days_in(y, m):
    if m == 2 and is_leap(y):
        return 29
    return DAYS[m - 1]

def day_number(y, m, d):
    py = y - 1
    n = 365 * py + int(py / 4) - int(py / 100) + int(py / 400)
    for mm in range(1, m):
        n = n + days_in(y, mm)
    return n + d

def age_divide(by, bm, bd, y, m, d):
    return int((day_number(y, m, d) - day_number(by, bm, bd)) / 365)

def age_compare_march(by, bm, bd, y, m, d):
    a = y - by
    em = bm
    ed = bd
    if bm == 2 and bd == 29 and not is_leap(y):
        em = 3
        ed = 1
    if m < em or m == em and d < ed:
        a = a - 1
    return a

def age_compare_feb(by, bm, bd, y, m, d):
    a = y - by
    em = bm
    ed = bd
    if bm == 2 and bd == 29 and not is_leap(y):
        em = 2
        ed = 28
    if m < em or m == em and d < ed:
        a = a - 1
    return a

def age_compare_exact(by, bm, bd, y, m, d):
    a = y - by
    if m < bm or m == bm and d < bd:
        a = a - 1
    return a

expected = [[2000, 6, 15, 2026, 6, 14, 25], [2000, 6, 15, 2026, 6, 15, 26], [2000, 6, 15, 2026, 6, 16, 26], [2004, 2, 29, 2024, 2, 29, 20], [2004, 2, 29, 2024, 3, 1, 20], [1990, 1, 1, 2026, 1, 1, 36], [1990, 12, 31, 2026, 1, 1, 35]]
print("birth        on           expected  divide  march  feb   exact")
n = 0
wrong = {}
for nm in ["divide", "march", "feb", "exact"]:
    wrong[nm] = 0
for row in expected:
    n = n + 1
    by = row[0]
    bm = row[1]
    bd = row[2]
    y = row[3]
    m = row[4]
    d = row[5]
    want = row[6]
    a1 = age_divide(by, bm, bd, y, m, d)
    a2 = age_compare_march(by, bm, bd, y, m, d)
    a3 = age_compare_feb(by, bm, bd, y, m, d)
    a4 = age_compare_exact(by, bm, bd, y, m, d)
    if not a1 == want:
        wrong["divide"] = wrong["divide"] + 1
    if not a2 == want:
        wrong["march"] = wrong["march"] + 1
    if not a3 == want:
        wrong["feb"] = wrong["feb"] + 1
    if not a4 == want:
        wrong["exact"] = wrong["exact"] + 1
    print("%-12s %-12s %-9d %-7d %-6d %-5d %d" % (str(by) + "-" + str(bm) + "-" + str(bd), str(y) + "-" + str(m) + "-" + str(d), want, a1, a2, a3, a4))
print("")
print("reference rows: " + str(n))
for nm in ["divide", "march", "feb", "exact"]:
    print("  " + nm + " wrong on: " + str(wrong[nm]) + "/" + str(n))
print("")
print("someone born 2004-02-29, on 2025-02-28 and 2025-03-01:")
for pair in [[2025, 2, 28], [2025, 3, 1]]:
    y = pair[0]
    m = pair[1]
    d = pair[2]
    print("  " + str(y) + "-" + str(m) + "-" + str(d) + ": march-rule " + str(age_compare_march(2004, 2, 29, y, m, d)) + ", feb-rule " + str(age_compare_feb(2004, 2, 29, y, m, d)) + ", exact-rule " + str(age_compare_exact(2004, 2, 29, y, m, d)))
sweep_n = 0
divide_wrong = 0
rules_differ = 0
for by in [1990, 2000, 2004]:
    for m in range(1, 13):
        for d in [1, 15, 28]:
            sweep_n = sweep_n + 1
            truth = age_compare_march(by, 6, 15, 2026, m, d)
            if not age_divide(by, 6, 15, 2026, m, d) == truth:
                divide_wrong = divide_wrong + 1
            if not age_compare_feb(by, 2, 29, 2026, m, d) == age_compare_exact(by, 2, 29, 2026, m, d):
                rules_differ = rules_differ + 1
print("")
print("dates swept:                              " + str(sweep_n))
print("  divide rule disagreed with compare:     " + str(divide_wrong))
print("  feb-rule and exact-rule disagreed:      " + str(rules_differ))
passed = 0
checked = 0
checked = checked + 1
if wrong["march"] == 0 and wrong["feb"] == 0:
    passed = passed + 1
checked = checked + 1
if wrong["divide"] > 0 or divide_wrong > 0:
    passed = passed + 1
checked = checked + 1
if age_compare_march(2004, 2, 29, 2024, 2, 29) == age_compare_feb(2004, 2, 29, 2024, 2, 29):
    if not age_compare_feb(2004, 2, 29, 2025, 2, 28) == age_compare_exact(2004, 2, 29, 2025, 2, 28):
        passed = passed + 1
checked = checked + 1
same_for_ordinary = 0
ord_n = 0
for m in range(1, 13):
    for d in [1, 15, 28]:
        ord_n = ord_n + 1
        if age_compare_march(2000, 6, 15, 2026, m, d) == age_compare_feb(2000, 6, 15, 2026, m, d):
            if age_compare_march(2000, 6, 15, 2026, m, d) == age_compare_exact(2000, 6, 15, 2026, m, d):
                same_for_ordinary = same_for_ordinary + 1
if same_for_ordinary == ord_n:
    passed = passed + 1
checked = checked + 1
if is_leap(2000) and not is_leap(1900) and is_leap(2024) and not is_leap(2023):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Three defensible rules agree in leap years and disagree on 28 February."
else:
    verdict = "FAILED - an age rule did not behave as the checks describe."
print(verdict)
print("")
n1 = "Dividing by 365 is wrong for a reason that has nothing to do with leap"
print(n1)
n2 = "days: age is a comparison, not a quotient. The leap-day question is"
print(n2)
n3 = "separate and has no computable answer - it is a legal choice, and a"
print(n3)
n4 = "codebase that never wrote it down has still made it."
print(n4)
```

## stdout (executed)

```text
birth        on           expected  divide  march  feb   exact
2000-6-15    2026-6-14    25        26      25     25    25
2000-6-15    2026-6-15    26        26      26     26    26
2000-6-15    2026-6-16    26        26      26     26    26
2004-2-29    2024-2-29    20        20      20     20    20
2004-2-29    2024-3-1     20        20      20     20    20
1990-1-1     2026-1-1     36        36      36     36    36
1990-12-31   2026-1-1     35        35      35     35    35

reference rows: 7
  divide wrong on: 1/7
  march wrong on: 0/7
  feb wrong on: 0/7
  exact wrong on: 0/7

someone born 2004-02-29, on 2025-02-28 and 2025-03-01:
  2025-2-28: march-rule 20, feb-rule 21, exact-rule 20
  2025-3-1: march-rule 21, feb-rule 21, exact-rule 21

dates swept:                              108
  divide rule disagreed with compare:     0
  feb-rule and exact-rule disagreed:      3

checks passed: 5/5
Three defensible rules agree in leap years and disagree on 28 February.

Dividing by 365 is wrong for a reason that has nothing to do with leap
days: age is a comparison, not a quotient. The leap-day question is
separate and has no computable answer - it is a legal choice, and a
codebase that never wrote it down has still made it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
