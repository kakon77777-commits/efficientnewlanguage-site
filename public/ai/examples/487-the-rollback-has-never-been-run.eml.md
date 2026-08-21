<!-- canonical: efficientnewlanguage.org/ai/examples/487-the-rollback-has-never-been-run | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 487 — The rollback has never been run

`the_rollback_has_never_been_run.eml` - Every migration ships with a rollback. How much of the data a rollback would return is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every migration
# ships with a rollback. How much of the data a rollback would return is
# computed below.
#
# Writing the down migration is right and the review requires it. It is written
# at the same time as the up migration, by the person who understands the change
# best, and it is the difference between a bad deploy costing minutes and
# costing a night.
#
# It is also the only part of the change that is never run. The up migration is
# exercised on every environment; the down one is exercised when something has
# already gone wrong, against a database that has been taking writes since.
#
# Both the step rot and the data written since are computed per migration.

# [migration, days since applied, down-steps that still resolve, down-steps total, rows written since]
[["add_status_column", 420, 3, 3, 0], ["split_name_field", 310, 2, 4, 88000], ["drop_legacy_index", 260, 1, 2, 0], ["add_audit_table", 150, 4, 5, 240000], ["widen_amount", 40, 3, 3, 51000]] => migrations

len(migrations) => n

"migrations with a down step : " + str(n) + " of " + str(n) ^0
"down steps ever run in production : 0" ^0
"" ^0

"migration            days   steps resolving   rows written since" ^0
0 => fully_ok
0 => rotted
for m in migrations:
    "  " + m[0] + "   " + str(m[1]) + "    " + str(m[2]) + " of " + str(m[3]) + "           " + str(m[4]) ^0
    if m[2] == m[3]:
        fully_ok + 1 => fully_ok
    else:
        rotted + 1 => rotted
"" ^0
"migrations whose down steps all still resolve : " + str(fully_ok) + " of " + str(n) ^0
if rotted > 0:
    "migrations with at least one step that does not : " + str(rotted) ^0
"" ^0

# ---- the part that is not about the steps ----
#
# A down migration undoes a schema change. It does not know about the rows
# written into that schema after it was applied.

0 => at_risk
0 => rows_at_risk
for m in migrations:
    if m[4] > 0:
        at_risk + 1 => at_risk
        rows_at_risk + m[4] => rows_at_risk
"migrations with data written since they were applied : " + str(at_risk) ^0
"rows that arrived after the schema changed : " + str(rows_at_risk) ^0
if rows_at_risk > 0:
    "  a down migration returns the schema and not those rows, and the number" ^0
    "  grows every day the migration stays applied" ^0
"" ^0

"per migration, rows arriving per day since it was applied" ^0
for m in migrations:
    if m[4] > 0:
        int(m[4] / m[1]) => per_day
        "  " + m[0] + " : " + str(per_day) + " a day, " + str(m[4]) + " so far" ^0
"" ^0

# ---- what a rollback is worth at each age ----

"a rollback run today, per migration" ^0
0 => clean_rollbacks
for m in migrations:
    "" => verdict
    if m[2] < m[3]:
        "fails at step " + str(m[2] + 1) => verdict
    elif m[4] > 0:
        "runs, drops " + str(m[4]) + " rows" => verdict
    else:
        "runs cleanly" => verdict
        clean_rollbacks + 1 => clean_rollbacks
    "  " + m[0] + " : " + verdict ^0
"  rollbacks that would run cleanly : " + str(clean_rollbacks) + " of " + str(n) ^0
"" ^0

# ---- the one that is newest ----
#
# The youngest migration is the one most likely to need rolling back and the
# one whose rollback is most likely to work. Those two move together, which is
# the only reason this ever appears to be fine.

0 => youngest
"" => youngest_name
for m in migrations:
    if youngest == 0:
        m[1] => youngest
        m[0] => youngest_name
    if m[1] < youngest:
        m[1] => youngest
        m[0] => youngest_name
"the youngest migration : " + youngest_name + ", " + str(youngest) + " days old" ^0
for m in migrations:
    if m[0] == youngest_name:
        "  its down steps : " + str(m[2]) + " of " + str(m[3]) + " resolve" ^0
        "  rows written since : " + str(m[4]) ^0
"  a rollback is almost always of the newest change, so the rot is almost" ^0
"  never met - and the rot is still there for the day it is" ^0
"" ^0

# ---- the control: a migration whose down step is exercised ----
#
# Where the down migration runs on every developer machine as part of the test
# cycle, its steps cannot rot silently.

"control - a down migration run by the test suite on every branch" ^0
"  runs per week : many" ^0
"  steps that can rot unnoticed : 0, because a broken step fails a build" ^0
"  what it still cannot test : the rows written in production since, which" ^0
"  exist in no test database" ^0
"" ^0

"Every migration has a rollback and every one was written by the right" ^0
"person. It is the only step that runs when something is already wrong, and" ^0
"what it returns is the schema rather than the rows." ^0
```

## Python (deterministic transpilation)

```python
migrations = [["add_status_column", 420, 3, 3, 0], ["split_name_field", 310, 2, 4, 88000], ["drop_legacy_index", 260, 1, 2, 0], ["add_audit_table", 150, 4, 5, 240000], ["widen_amount", 40, 3, 3, 51000]]
n = len(migrations)
print("migrations with a down step : " + str(n) + " of " + str(n))
print("down steps ever run in production : 0")
print("")
print("migration            days   steps resolving   rows written since")
fully_ok = 0
rotted = 0
for m in migrations:
    print("  " + m[0] + "   " + str(m[1]) + "    " + str(m[2]) + " of " + str(m[3]) + "           " + str(m[4]))
    if m[2] == m[3]:
        fully_ok = fully_ok + 1
    else:
        rotted = rotted + 1
print("")
print("migrations whose down steps all still resolve : " + str(fully_ok) + " of " + str(n))
if rotted > 0:
    print("migrations with at least one step that does not : " + str(rotted))
print("")
at_risk = 0
rows_at_risk = 0
for m in migrations:
    if m[4] > 0:
        at_risk = at_risk + 1
        rows_at_risk = rows_at_risk + m[4]
print("migrations with data written since they were applied : " + str(at_risk))
print("rows that arrived after the schema changed : " + str(rows_at_risk))
if rows_at_risk > 0:
    print("  a down migration returns the schema and not those rows, and the number")
    print("  grows every day the migration stays applied")
print("")
print("per migration, rows arriving per day since it was applied")
for m in migrations:
    if m[4] > 0:
        per_day = int(m[4] / m[1])
        print("  " + m[0] + " : " + str(per_day) + " a day, " + str(m[4]) + " so far")
print("")
print("a rollback run today, per migration")
clean_rollbacks = 0
for m in migrations:
    verdict = ""
    if m[2] < m[3]:
        verdict = "fails at step " + str(m[2] + 1)
    elif m[4] > 0:
        verdict = "runs, drops " + str(m[4]) + " rows"
    else:
        verdict = "runs cleanly"
        clean_rollbacks = clean_rollbacks + 1
    print("  " + m[0] + " : " + verdict)
print("  rollbacks that would run cleanly : " + str(clean_rollbacks) + " of " + str(n))
print("")
youngest = 0
youngest_name = ""
for m in migrations:
    if youngest == 0:
        youngest = m[1]
        youngest_name = m[0]
    if m[1] < youngest:
        youngest = m[1]
        youngest_name = m[0]
print("the youngest migration : " + youngest_name + ", " + str(youngest) + " days old")
for m in migrations:
    if m[0] == youngest_name:
        print("  its down steps : " + str(m[2]) + " of " + str(m[3]) + " resolve")
        print("  rows written since : " + str(m[4]))
print("  a rollback is almost always of the newest change, so the rot is almost")
print("  never met - and the rot is still there for the day it is")
print("")
print("control - a down migration run by the test suite on every branch")
print("  runs per week : many")
print("  steps that can rot unnoticed : 0, because a broken step fails a build")
print("  what it still cannot test : the rows written in production since, which")
print("  exist in no test database")
print("")
print("Every migration has a rollback and every one was written by the right")
print("person. It is the only step that runs when something is already wrong, and")
print("what it returns is the schema rather than the rows.")
```

## stdout (executed)

```text
migrations with a down step : 5 of 5
down steps ever run in production : 0

migration            days   steps resolving   rows written since
  add_status_column   420    3 of 3           0
  split_name_field   310    2 of 4           88000
  drop_legacy_index   260    1 of 2           0
  add_audit_table   150    4 of 5           240000
  widen_amount   40    3 of 3           51000

migrations whose down steps all still resolve : 2 of 5
migrations with at least one step that does not : 3

migrations with data written since they were applied : 3
rows that arrived after the schema changed : 379000
  a down migration returns the schema and not those rows, and the number
  grows every day the migration stays applied

per migration, rows arriving per day since it was applied
  split_name_field : 283 a day, 88000 so far
  add_audit_table : 1600 a day, 240000 so far
  widen_amount : 1275 a day, 51000 so far

a rollback run today, per migration
  add_status_column : runs cleanly
  split_name_field : fails at step 3
  drop_legacy_index : fails at step 2
  add_audit_table : fails at step 5
  widen_amount : runs, drops 51000 rows
  rollbacks that would run cleanly : 1 of 5

the youngest migration : widen_amount, 40 days old
  its down steps : 3 of 3 resolve
  rows written since : 51000
  a rollback is almost always of the newest change, so the rot is almost
  never met - and the rot is still there for the day it is

control - a down migration run by the test suite on every branch
  runs per week : many
  steps that can rot unnoticed : 0, because a broken step fails a build
  what it still cannot test : the rows written in production since, which
  exist in no test database

Every migration has a rollback and every one was written by the right
person. It is the only step that runs when something is already wrong, and
what it returns is the schema rather than the rows.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
