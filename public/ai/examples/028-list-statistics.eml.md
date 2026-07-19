<!-- canonical: efficientnewlanguage.org/ai/examples/028-list-statistics | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 028 — List statistics

`list_statistics.eml` computes the minimum, maximum, sum, and average of a sample list of hourly temperature readings — one of a seven-case self-authored batch of list/collection utilities for the EML case corpus (see [`examples/duplicate-remover/`](../duplicate-remover/), [`examples/list-rotator/`](../list-rotator/), [`examples/matrix-transpose-manual/`](../matrix-transpose-manual/), [`examples/intersection-union-finder/`](../intersection-union-finder/), [`examples/second-largest-finder/`](../second-largest-finder/), and [`examples/shopping-cart-total/`](../shopping-cart-total/) for the other six).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Computes the
# minimum, maximum, sum, and average of a sample list of numbers, entirely
# via a manual single-pass loop (deliberately avoiding `min()`/`max()`/`sum()`
# builtins — `sum()` in particular was verified to break EML's reverse
# transpiler, which expects a generator-expression argument). The average is
# then rounded to 2 decimal places by hand (`int(x * 100 + 0.5)` then divide
# by 100), since `%.2f`-style precision specs are not modeled by the
# interpreter's own `%` formatter.

temperatures^+[68, 72, 65, 90, 58, 77, 81, 63]

total^+0
count^+0
temperatures[0] => minimum
temperatures[0] => maximum

for reading in temperatures:
    total^+reading
    count^+1
    if reading < minimum:
        reading => minimum
    if reading > maximum:
        reading => maximum

total / count => raw_average
int(raw_average * 100 + 0.5) => scaled
scaled / 100 => average

"Readings: " + str(temperatures) => msg1
msg1^0
"Minimum: " + str(minimum) => msg2
msg2^0
"Maximum: " + str(maximum) => msg3
msg3^0
"Sum: " + str(total) => msg4
msg4^0
"Average: " + str(average) => msg5
msg5^0
```

## Python (deterministic transpilation)

```python
temperatures = [68, 72, 65, 90, 58, 77, 81, 63]
total = 0
count = 0
minimum = temperatures[0]
maximum = temperatures[0]
for reading in temperatures:
    total += reading
    count += 1
    if reading < minimum:
        minimum = reading
    if reading > maximum:
        maximum = reading
raw_average = total / count
scaled = int(raw_average * 100 + 0.5)
average = scaled / 100
msg1 = "Readings: " + str(temperatures)
print(msg1)
msg2 = "Minimum: " + str(minimum)
print(msg2)
msg3 = "Maximum: " + str(maximum)
print(msg3)
msg4 = "Sum: " + str(total)
print(msg4)
msg5 = "Average: " + str(average)
print(msg5)
```

## stdout (executed)

```text
Readings: [68, 72, 65, 90, 58, 77, 81, 63]
Minimum: 58
Maximum: 90
Sum: 574
Average: 71.75
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:augment · eml:output · eml:run:done
