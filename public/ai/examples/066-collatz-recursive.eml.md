<!-- canonical: efficientnewlanguage.org/ai/examples/066-collatz-recursive | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 066 — Collatz steps (recursive)

`collatz_recursive.eml` counts the number of Collatz-conjecture steps needed to reach `1`, for four sample starting numbers (`6, 11, 27, 1`).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Counts
# Collatz-conjecture steps to reach 1 via genuine self-recursion, returning
# only the step count — a deliberate contrast with the corpus's existing
# examples/collatz-sequence/, which is iterative and returns the full
# sequence. `27` is the classic short-input-long-sequence example (111
# steps), included to show the recursion handles real depth, not just toys.

def collatz_steps(n):
    if n == 1:
        return 0
    if n % 2 == 0:
        return 1 + collatz_steps(int(n / 2))
    return 1 + collatz_steps(3 * n + 1)

starting_numbers^+[6, 11, 27, 1]

for start in starting_numbers:
    collatz_steps(start) => steps
    str(start) + " reaches 1 in " + str(steps) + " steps" => line
    line^0
```

## Python (deterministic transpilation)

```python
def collatz_steps(n):
    if n == 1:
        return 0
    if n % 2 == 0:
        return 1 + collatz_steps(int(n / 2))
    return 1 + collatz_steps(3 * n + 1)

starting_numbers = [6, 11, 27, 1]
for start in starting_numbers:
    steps = collatz_steps(start)
    line = str(start) + " reaches 1 in " + str(steps) + " steps"
    print(line)
```

## stdout (executed)

```text
6 reaches 1 in 8 steps
11 reaches 1 in 14 steps
27 reaches 1 in 111 steps
1 reaches 1 in 0 steps
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
