<!-- canonical: efficientnewlanguage.org/ai/examples/041-simple-quiz-grader | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 041 — Simple quiz grader

`simple_quiz_grader.eml` grades a 5-question quiz from `(question, correct_answer, given_answer)` tuples, printing per-question feedback and a final percentage score.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Grades a
# 5-question quiz from (question, correct_answer, given_answer) tuples
# using `and`/`or`/`not` boolean logic (a skipped/blank answer and a
# non-blank mismatch both count as incorrect via `or`; only a non-blank
# exact match counts as correct via `not`), prints per-question feedback,
# and computes a final percentage via true `/` division (no floor-mod
# involved).

quiz^+[("Capital of France", "Paris", "Paris"),
       ("Largest planet in the solar system", "Jupiter", "Saturn"),
       ("Result of 6 times 7", "42", "42"),
       ("Chemical symbol for gold", "Au", ""),
       ("Year World War II ended", "1945", "1945")]

correct_count^+0
total^+0

for entry in quiz:
    entry[0] => question
    entry[1] => correct_answer
    entry[2] => given_answer
    total^+1

    given_answer == "" => is_blank
    (not is_blank) and (given_answer != correct_answer) => is_wrong_answer
    is_blank or is_wrong_answer => is_incorrect
    not is_incorrect => is_correct

    if is_correct:
        correct_count^+1
        "correct" => result
    else:
        "incorrect (expected " + correct_answer + ")" => result

    question + ": " + result => line
    line^0

(correct_count / total) * 100 => percentage
"Final score: " + str(correct_count) + "/" + str(total) + " (" + str(percentage) + "%)" => summary
summary^0
```

## Python (deterministic transpilation)

```python
quiz = [("Capital of France", "Paris", "Paris"), ("Largest planet in the solar system", "Jupiter", "Saturn"), ("Result of 6 times 7", "42", "42"), ("Chemical symbol for gold", "Au", ""), ("Year World War II ended", "1945", "1945")]
correct_count = 0
total = 0
for entry in quiz:
    question = entry[0]
    correct_answer = entry[1]
    given_answer = entry[2]
    total += 1
    is_blank = given_answer == ""
    is_wrong_answer = not is_blank and given_answer != correct_answer
    is_incorrect = is_blank or is_wrong_answer
    is_correct = not is_incorrect
    if is_correct:
        correct_count += 1
        result = "correct"
    else:
        result = "incorrect (expected " + correct_answer + ")"
    line = question + ": " + result
    print(line)
percentage = correct_count / total * 100
summary = "Final score: " + str(correct_count) + "/" + str(total) + " (" + str(percentage) + "%)"
print(summary)
```

## stdout (executed)

```text
Capital of France: correct
Largest planet in the solar system: incorrect (expected Jupiter)
Result of 6 times 7: correct
Chemical symbol for gold: incorrect (expected Au)
Year World War II ended: correct
Final score: 3/5 (60.0%)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:augment · eml:output · eml:run:done
