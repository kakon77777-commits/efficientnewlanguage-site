<!-- canonical: efficientnewlanguage.org/ai/examples/478-the-column-nobody-queried | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 478 — The column nobody queried

`the_column_nobody_queried.eml` - The column has been in the table for three years and no report has ever selected it. What is in it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The column has
# been in the table for three years and no report has ever selected it. What is
# in it is computed below.
#
# Adding the column was right. It was cheap, it captures something the domain
# really has, and a column that exists from the start is far easier than a
# backfill later. Nobody was wrong to add it.
#
# A column nobody reads is also a column nobody checks. Whether the writer ever
# populated it, whether it means the same thing in rows written by different
# versions, and whether it is null for whole eras are all questions that only a
# reader asks - and there has not been one.
#
# The rows are counted by era rather than in total.

# [era, rows written, rows with the column populated, what the writer meant by it]
[["v1 2023", 410000, 0, "not written at all"], ["v2 2024 H1", 260000, 260000, "seconds"], ["v2 2024 H2", 300000, 300000, "seconds"], ["v3 2025", 520000, 520000, "milliseconds"], ["v3 2026", 180000, 0, "dropped from the writer"]] => eras

len(eras) => n
0 => total_rows
0 => populated
for e in eras:
    total_rows + e[1] => total_rows
    populated + e[2] => populated

"rows in the table : " + str(total_rows) ^0
"rows with the column populated : " + str(populated) + ", which is " + str(int(populated * 100 / total_rows)) + "%" ^0
"reports that select it : 0" ^0
"" ^0

"era            rows      populated   meaning" ^0
for e in eras:
    "  " + e[0] + "   " + str(e[1]) + "    " + str(e[2]) + "     " + e[3] ^0
"" ^0

# ---- what a first query would return ----

"a report written today, averaging the column" ^0
0 => rows_it_sees
for e in eras:
    rows_it_sees + e[2] => rows_it_sees
"  rows it would average over : " + str(rows_it_sees) ^0
"  rows silently excluded     : " + str(total_rows - rows_it_sees) + ", which is " + str(int((total_rows - rows_it_sees) * 100 / total_rows)) + "%" ^0
"  and nothing in the query says so, because a null is not an error" ^0
"" ^0

# ---- the units changed and nobody noticed ----

[] => units
for e in eras:
    if e[2] > 0:
        if not (e[3] in units):
            units + [e[3]] => units
"distinct meanings among the populated rows : " + str(len(units)) ^0
"" => u
for x in units:
    u + x + ", " => u
"  " + u ^0
if len(units) > 1:
    "  the same column holds two units, and the change was invisible because" ^0
    "  no reader was comparing one era to another" ^0
"" ^0

0 => ms_rows
0 => s_rows
for e in eras:
    if e[3] == "milliseconds":
        ms_rows + e[2] => ms_rows
    if e[3] == "seconds":
        s_rows + e[2] => s_rows
"  rows in seconds      : " + str(s_rows) ^0
"  rows in milliseconds : " + str(ms_rows) ^0
if ms_rows > 0:
    if s_rows > 0:
        "  an average over both is a number in neither unit" ^0
"" ^0

# ---- what a reader would have caught, and when ----

"what a single report, written in each era, would have caught" ^0
"  in v1  : the column is empty, caught on the first run" ^0
"  in v2  : nothing to catch, it was populated and consistent" ^0
"  in v3  : the unit change, on the first comparison to a v2 figure" ^0
"  in 2026: the writer dropping it, when the latest rows came back null" ^0
"  three of the four eras had something a reader would have found, and the" ^0
"  reader is the part that was never added" ^0
"" ^0

# ---- what the column is worth now ----

"the column, three years on" ^0
"  rows usable without a unit decision : " + str(s_rows) + " or " + str(ms_rows) + ", not both" ^0
"  rows usable with one               : " + str(populated) ^0
"  rows that will never be recoverable : " + str(total_rows - populated) ^0
if total_rows - populated > 0:
    "  the backfill the column was added to avoid is now required anyway, for" ^0
    "  the eras where nothing was written" ^0
"" ^0

# ---- the control: a column with a reader from day one ----
#
# Where something selects the column in every release, an empty era or a unit
# change is a broken report rather than a discovery three years later.

"control - a column a dashboard has selected since it was added" ^0
"  eras in which it was unpopulated : 0, because the dashboard broke" ^0
"  unit changes that shipped        : 0, for the same reason" ^0
"  the dashboard is not a better check than a reviewer; it is a check that" ^0
"  runs, which is the property the unread column is missing" ^0
"" ^0

"Adding the column was cheap and correct and the domain really has this" ^0
"field. Nothing has ever read it, so what it contains has been decided by" ^0
"three years of writers and checked by nobody." ^0
```

## Python (deterministic transpilation)

```python
eras = [["v1 2023", 410000, 0, "not written at all"], ["v2 2024 H1", 260000, 260000, "seconds"], ["v2 2024 H2", 300000, 300000, "seconds"], ["v3 2025", 520000, 520000, "milliseconds"], ["v3 2026", 180000, 0, "dropped from the writer"]]
n = len(eras)
total_rows = 0
populated = 0
for e in eras:
    total_rows = total_rows + e[1]
    populated = populated + e[2]
print("rows in the table : " + str(total_rows))
print("rows with the column populated : " + str(populated) + ", which is " + str(int(populated * 100 / total_rows)) + "%")
print("reports that select it : 0")
print("")
print("era            rows      populated   meaning")
for e in eras:
    print("  " + e[0] + "   " + str(e[1]) + "    " + str(e[2]) + "     " + e[3])
print("")
print("a report written today, averaging the column")
rows_it_sees = 0
for e in eras:
    rows_it_sees = rows_it_sees + e[2]
print("  rows it would average over : " + str(rows_it_sees))
print("  rows silently excluded     : " + str(total_rows - rows_it_sees) + ", which is " + str(int((total_rows - rows_it_sees) * 100 / total_rows)) + "%")
print("  and nothing in the query says so, because a null is not an error")
print("")
units = []
for e in eras:
    if e[2] > 0:
        if not e[3] in units:
            units = units + [e[3]]
print("distinct meanings among the populated rows : " + str(len(units)))
u = ""
for x in units:
    u = u + x + ", "
print("  " + u)
if len(units) > 1:
    print("  the same column holds two units, and the change was invisible because")
    print("  no reader was comparing one era to another")
print("")
ms_rows = 0
s_rows = 0
for e in eras:
    if e[3] == "milliseconds":
        ms_rows = ms_rows + e[2]
    if e[3] == "seconds":
        s_rows = s_rows + e[2]
print("  rows in seconds      : " + str(s_rows))
print("  rows in milliseconds : " + str(ms_rows))
if ms_rows > 0:
    if s_rows > 0:
        print("  an average over both is a number in neither unit")
print("")
print("what a single report, written in each era, would have caught")
print("  in v1  : the column is empty, caught on the first run")
print("  in v2  : nothing to catch, it was populated and consistent")
print("  in v3  : the unit change, on the first comparison to a v2 figure")
print("  in 2026: the writer dropping it, when the latest rows came back null")
print("  three of the four eras had something a reader would have found, and the")
print("  reader is the part that was never added")
print("")
print("the column, three years on")
print("  rows usable without a unit decision : " + str(s_rows) + " or " + str(ms_rows) + ", not both")
print("  rows usable with one               : " + str(populated))
print("  rows that will never be recoverable : " + str(total_rows - populated))
if total_rows - populated > 0:
    print("  the backfill the column was added to avoid is now required anyway, for")
    print("  the eras where nothing was written")
print("")
print("control - a column a dashboard has selected since it was added")
print("  eras in which it was unpopulated : 0, because the dashboard broke")
print("  unit changes that shipped        : 0, for the same reason")
print("  the dashboard is not a better check than a reviewer; it is a check that")
print("  runs, which is the property the unread column is missing")
print("")
print("Adding the column was cheap and correct and the domain really has this")
print("field. Nothing has ever read it, so what it contains has been decided by")
print("three years of writers and checked by nobody.")
```

## stdout (executed)

```text
rows in the table : 1670000
rows with the column populated : 1080000, which is 64%
reports that select it : 0

era            rows      populated   meaning
  v1 2023   410000    0     not written at all
  v2 2024 H1   260000    260000     seconds
  v2 2024 H2   300000    300000     seconds
  v3 2025   520000    520000     milliseconds
  v3 2026   180000    0     dropped from the writer

a report written today, averaging the column
  rows it would average over : 1080000
  rows silently excluded     : 590000, which is 35%
  and nothing in the query says so, because a null is not an error

distinct meanings among the populated rows : 2
  seconds, milliseconds, 
  the same column holds two units, and the change was invisible because
  no reader was comparing one era to another

  rows in seconds      : 560000
  rows in milliseconds : 520000
  an average over both is a number in neither unit

what a single report, written in each era, would have caught
  in v1  : the column is empty, caught on the first run
  in v2  : nothing to catch, it was populated and consistent
  in v3  : the unit change, on the first comparison to a v2 figure
  in 2026: the writer dropping it, when the latest rows came back null
  three of the four eras had something a reader would have found, and the
  reader is the part that was never added

the column, three years on
  rows usable without a unit decision : 560000 or 520000, not both
  rows usable with one               : 1080000
  rows that will never be recoverable : 590000
  the backfill the column was added to avoid is now required anyway, for
  the eras where nothing was written

control - a column a dashboard has selected since it was added
  eras in which it was unpopulated : 0, because the dashboard broke
  unit changes that shipped        : 0, for the same reason
  the dashboard is not a better check than a reviewer; it is a check that
  runs, which is the property the unread column is missing

Adding the column was cheap and correct and the domain really has this
field. Nothing has ever read it, so what it contains has been decided by
three years of writers and checked by nobody.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
