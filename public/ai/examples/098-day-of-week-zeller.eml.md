<!-- canonical: efficientnewlanguage.org/ai/examples/098-day-of-week-zeller | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 098 — Day of week (Zeller's congruence)

`day_of_week_zeller.eml` computes which weekday a calendar date falls on, arithmetically, with no date library — and checks all five results against independently known answers.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Zeller's
# congruence: which weekday a given calendar date falls on, computed
# arithmetically with no date library at all. The corpus's first calendar
# computation.
#
# The strange part of the formula is real, not a transcription slip:
# January and February are treated as months 13 and 14 of the PREVIOUS
# year. That shift puts the leap day at the end of the year, so the
# century terms stay correct without a special case for February 29 — the
# 2024-02-29 sample below is included to exercise exactly that.
#
# Every date is checked against an independently known weekday, so this
# case fails loudly rather than confidently reporting a wrong day.

NAMES^+["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

def day_of_week(year, month, day):
    year => y
    month => m
    if m < 3:
        m + 12 => m
        y - 1 => y
    y % 100 => k
    int(y / 100) => j
    int(13 * (m + 1) / 5) => month_term
    (day + month_term + k + int(k / 4) + int(j / 4) + 5 * j) % 7 => h
    return h

dates^+[[2000, 1, 1], [1970, 1, 1], [1969, 7, 20], [2024, 2, 29], [1900, 1, 1]]
expected^+["Saturday", "Thursday", "Sunday", "Thursday", "Monday"]
labels^+["start of the millennium", "the Unix epoch", "the moon landing", "a leap day", "start of the 20th century"]

0 => matches
for i in [0:4]:
    dates[i] => date
    day_of_week(date[0], date[1], date[2]) => h
    NAMES[h] => name
    expected[i] => known
    str(date[0]) + "-" + str(date[1]) + "-" + str(date[2]) + " (" + labels[i] + ") -> " + name => line
    if name == known:
        matches + 1 => matches
        line + " (matches)" => line
    else:
        line + " (EXPECTED " + known + ")" => line
    line^0

str(matches) + " of " + str(len(dates)) + " dates match their known weekday" => summary
summary^0
```

## Python (deterministic transpilation)

```python
NAMES = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

def day_of_week(year, month, day):
    y = year
    m = month
    if m < 3:
        m = m + 12
        y = y - 1
    k = y % 100
    j = int(y / 100)
    month_term = int(13 * (m + 1) / 5)
    h = (day + month_term + k + int(k / 4) + int(j / 4) + 5 * j) % 7
    return h

dates = [[2000, 1, 1], [1970, 1, 1], [1969, 7, 20], [2024, 2, 29], [1900, 1, 1]]
expected = ["Saturday", "Thursday", "Sunday", "Thursday", "Monday"]
labels = ["start of the millennium", "the Unix epoch", "the moon landing", "a leap day", "start of the 20th century"]
matches = 0
for i in range(0, 5):
    date = dates[i]
    h = day_of_week(date[0], date[1], date[2])
    name = NAMES[h]
    known = expected[i]
    line = str(date[0]) + "-" + str(date[1]) + "-" + str(date[2]) + " (" + labels[i] + ") -> " + name
    if name == known:
        matches = matches + 1
        line = line + " (matches)"
    else:
        line = line + " (EXPECTED " + known + ")"
    print(line)
summary = str(matches) + " of " + str(len(dates)) + " dates match their known weekday"
print(summary)
```

## stdout (executed)

```text
2000-1-1 (start of the millennium) -> Saturday (matches)
1970-1-1 (the Unix epoch) -> Thursday (matches)
1969-7-20 (the moon landing) -> Sunday (matches)
2024-2-29 (a leap day) -> Thursday (matches)
1900-1-1 (start of the 20th century) -> Monday (matches)
5 of 5 dates match their known weekday
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
