<!-- canonical: efficientnewlanguage.org/ai/examples/044-survey-score-analyzer | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 044 — Survey score analyzer

`survey_score_analyzer.eml` analyzes a small customer-satisfaction survey — `(respondent_name, score)` tuples on a 1-10 scale — splitting respondents into satisfied/unsatisfied groups, averaging all scores, and previewing the first couple of responses.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Analyzes a
# small customer-satisfaction survey — (respondent_name, score) tuples on a
# 1-10 scale — by splitting respondents into satisfied/unsatisfied via two
# list comprehensions, averaging all scores with a plain `^+` accumulation
# loop, and previewing the first two respondents with EML's native
# `[0:2]` slice literal (not a `range()` call).

responses^+[("Grace Liu", 9), ("Marcus Webb", 4), ("Priya Anand", 8),
            ("Tomas Alvarez", 6), ("Nadia Hussein", 10), ("Ben Okafor", 3)]

[entry for entry in responses if entry[1] >= 7] => satisfied
[entry for entry in responses if entry[1] < 7] => unsatisfied

total^+0
for entry in responses:
    entry[1] => score
    total^+score

total / len(responses) => average

"Survey results from " + str(len(responses)) + " respondents" => header
header^0
"Satisfied: " + str(len(satisfied)) + ", Unsatisfied: " + str(len(unsatisfied)) => tally
tally^0
"Average score: " + str(average) => avg_line
avg_line^0

responses[0:2] => preview
"First two respondents: " + str(preview) => preview_line
preview_line^0
```

## Python (deterministic transpilation)

```python
responses = [("Grace Liu", 9), ("Marcus Webb", 4), ("Priya Anand", 8), ("Tomas Alvarez", 6), ("Nadia Hussein", 10), ("Ben Okafor", 3)]
satisfied = [entry for entry in responses if entry[1] >= 7]
unsatisfied = [entry for entry in responses if entry[1] < 7]
total = 0
for entry in responses:
    score = entry[1]
    total += score
average = total / len(responses)
header = "Survey results from " + str(len(responses)) + " respondents"
print(header)
tally = "Satisfied: " + str(len(satisfied)) + ", Unsatisfied: " + str(len(unsatisfied))
print(tally)
avg_line = "Average score: " + str(average)
print(avg_line)
preview = responses[0:2]
preview_line = "First two respondents: " + str(preview)
print(preview_line)
```

## stdout (executed)

```text
Survey results from 6 respondents
Satisfied: 3, Unsatisfied: 3
Average score: 6.666666666666667
First two respondents: [('Grace Liu', 9), ('Marcus Webb', 4)]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:augment · eml:output · eml:run:done
