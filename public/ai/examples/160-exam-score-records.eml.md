<!-- canonical: efficientnewlanguage.org/ai/examples/160-exam-score-records | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 160 — A list of tuples is a table

`exam_score_records.eml` holds `(name, score, attempts)` rows and reports on them.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Each record is a
# (name, score, attempts) tuple - a small fixed shape where position means
# something, and where nothing should ever be appended to an individual row.
#
# The list holds the records; each record is a tuple. That pairing is the
# usual shape of tabular data, and it is worth writing out because the two
# containers are doing genuinely different jobs: the LIST is what grows, the
# TUPLE is what stays the same size forever.

def name_of(rec):
    return rec[0]

def score_of(rec):
    return rec[1]

def attempts_of(rec):
    return rec[2]

def passed(rec, mark):
    if score_of(rec) >= mark:
        return 1
    return 0

[("ana", 88, 1), ("brit", 54, 2), ("chen", 91, 1), ("dev", 47, 3), ("eve", 72, 1)] => records
60 => pass_mark

("Records: " + str(len(records)) + ", each with " + str(len(records[0])) + " fields")^0
("Pass mark: " + str(pass_mark))^0
""^0

"name   score  attempts  result" => header
header^0
"-----  -----  --------  ------" => rule
rule^0
0 => passes
[] => scores
for rec in records:
    name_of(rec) => n
    if passed(rec, pass_mark) == 1:
        "pass" => verdict
    else:
        "fail" => verdict
    passes + passed(rec, pass_mark) => passes
    scores + [score_of(rec)] => scores
    7 - len(n) => pad
    if pad < 1:
        1 => pad
    (n + " " * pad + str(score_of(rec)) + "     " + str(attempts_of(rec)) + "         " + verdict)^0

""^0
("Passed: " + str(passes) + " of " + str(len(records)))^0
("Highest " + str(max(scores)) + ", lowest " + str(min(scores)) + ", mean " + str(sum(scores) / len(scores)))^0
""^0

# Retaking is expensive: total attempts across everyone.
[] => tries
for rec in records:
    tries + [attempts_of(rec)] => tries
("Total sittings: " + str(sum(tries)) + " for " + str(len(records)) + " candidates")^0
("Most attempts by one candidate: " + str(max(tries)))^0
""^0

# A record is compared as a whole, field by field, left to right.
("(\"ana\", 88, 1) == (\"ana\", 88, 1) is " + str(("ana", 88, 1) == ("ana", 88, 1)))^0
("A row has a fixed width of " + str(len(records[0])) + "; the TABLE is what grows, not the row.")^0
```

## Python (deterministic transpilation)

```python
def name_of(rec):
    return rec[0]

def score_of(rec):
    return rec[1]

def attempts_of(rec):
    return rec[2]

def passed(rec, mark):
    if score_of(rec) >= mark:
        return 1
    return 0

records = [("ana", 88, 1), ("brit", 54, 2), ("chen", 91, 1), ("dev", 47, 3), ("eve", 72, 1)]
pass_mark = 60
print("Records: " + str(len(records)) + ", each with " + str(len(records[0])) + " fields")
print("Pass mark: " + str(pass_mark))
print("")
header = "name   score  attempts  result"
print(header)
rule = "-----  -----  --------  ------"
print(rule)
passes = 0
scores = []
for rec in records:
    n = name_of(rec)
    if passed(rec, pass_mark) == 1:
        verdict = "pass"
    else:
        verdict = "fail"
    passes = passes + passed(rec, pass_mark)
    scores = scores + [score_of(rec)]
    pad = 7 - len(n)
    if pad < 1:
        pad = 1
    print(n + " " * pad + str(score_of(rec)) + "     " + str(attempts_of(rec)) + "         " + verdict)
print("")
print("Passed: " + str(passes) + " of " + str(len(records)))
print("Highest " + str(max(scores)) + ", lowest " + str(min(scores)) + ", mean " + str(sum(scores) / len(scores)))
print("")
tries = []
for rec in records:
    tries = tries + [attempts_of(rec)]
print("Total sittings: " + str(sum(tries)) + " for " + str(len(records)) + " candidates")
print("Most attempts by one candidate: " + str(max(tries)))
print("")
print("(\"ana\", 88, 1) == (\"ana\", 88, 1) is " + str(("ana", 88, 1) == ("ana", 88, 1)))
print("A row has a fixed width of " + str(len(records[0])) + "; the TABLE is what grows, not the row.")
```

## stdout (executed)

```text
Records: 5, each with 3 fields
Pass mark: 60

name   score  attempts  result
-----  -----  --------  ------
ana    88     1         pass
brit   54     2         fail
chen   91     1         pass
dev    47     3         fail
eve    72     1         pass

Passed: 3 of 5
Highest 91, lowest 47, mean 70.4

Total sittings: 8 for 5 candidates
Most attempts by one candidate: 3

("ana", 88, 1) == ("ana", 88, 1) is True
A row has a fixed width of 3; the TABLE is what grows, not the row.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
