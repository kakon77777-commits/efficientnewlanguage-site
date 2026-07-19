<!-- canonical: efficientnewlanguage.org/ai/examples/045-task-priority-bucketer | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 045 — Task priority bucketer

`task_priority_bucketer.eml` takes a sample task list — `(task_name, priority_number)` tuples on a 1-10 scale — and sorts them into high/medium/low priority buckets for a simple daily triage report.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Buckets a
# sample task list — (task_name, priority_number) tuples on a 1-10 scale —
# into high/medium/low priority lists using three separate list
# comprehensions, each filtering on `entry[1]` with its own threshold `if`
# condition (a single `for` + at most one `if` per comprehension, EML's
# comprehension limit).

tasks^+[("Deploy hotfix to production", 9), ("Write quarterly report", 4),
        ("Reply to client email", 6), ("Refactor auth module", 8),
        ("Water the office plants", 1), ("Update API documentation", 5),
        ("Fix flaky CI test", 7), ("Archive old support tickets", 2)]

[entry for entry in tasks if entry[1] >= 8] => high_priority
[entry for entry in tasks if entry[1] >= 4 and entry[1] < 8] => medium_priority
[entry for entry in tasks if entry[1] < 4] => low_priority

"High priority:"^0
for entry in high_priority:
    entry[0]^0

"Medium priority:"^0
for entry in medium_priority:
    entry[0]^0

"Low priority:"^0
for entry in low_priority:
    entry[0]^0
```

## Python (deterministic transpilation)

```python
tasks = [("Deploy hotfix to production", 9), ("Write quarterly report", 4), ("Reply to client email", 6), ("Refactor auth module", 8), ("Water the office plants", 1), ("Update API documentation", 5), ("Fix flaky CI test", 7), ("Archive old support tickets", 2)]
high_priority = [entry for entry in tasks if entry[1] >= 8]
medium_priority = [entry for entry in tasks if entry[1] >= 4 and entry[1] < 8]
low_priority = [entry for entry in tasks if entry[1] < 4]
print("High priority:")
for entry in high_priority:
    print(entry[0])
print("Medium priority:")
for entry in medium_priority:
    print(entry[0])
print("Low priority:")
for entry in low_priority:
    print(entry[0])
```

## stdout (executed)

```text
High priority:
Deploy hotfix to production
Refactor auth module
Medium priority:
Write quarterly report
Reply to client email
Update API documentation
Fix flaky CI test
Low priority:
Water the office plants
Archive old support tickets
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
