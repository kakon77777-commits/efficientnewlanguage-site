<!-- canonical: efficientnewlanguage.org/ai/examples/021-fibonacci-sequence | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 021 — Fibonacci sequence (iterative)

`fibonacci_sequence.eml` generates the first 15 Fibonacci numbers using a `while` loop with two running variables (`a`, `b`) that are swapped and advanced each iteration — deliberately iterative, since recursion is already covered elsewhere in this corpus (`examples/phase6-control-flow/` covers a similar iterative shape for a single Fibonacci value; this case generates the whole sequence as a list and prints both the full sequence and its last term).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Generates the
# first N Fibonacci numbers iteratively — two running variables updated in a
# `while` loop — not via recursion, which is already covered elsewhere in
# this corpus.

def first_n_fibonacci(n):
    sequence^+[]
    a^+0
    b^+1
    count^+0
    while count < n:
        sequence + [a] => sequence
        a + b => next_value
        b => a
        next_value => b
        count^+1
    return sequence

first_n_fibonacci(15) => fib_sequence
"First 15 Fibonacci numbers: " + str(fib_sequence) => sequence_message
sequence_message^0

fib_sequence[len(fib_sequence) - 1] => last_value
"15th Fibonacci number: " + str(last_value) => last_message
last_message^0
```

## Python (deterministic transpilation)

```python
def first_n_fibonacci(n):
    sequence = []
    a = 0
    b = 1
    count = 0
    while count < n:
        sequence = sequence + [a]
        next_value = a + b
        a = b
        b = next_value
        count += 1
    return sequence

fib_sequence = first_n_fibonacci(15)
sequence_message = "First 15 Fibonacci numbers: " + str(fib_sequence)
print(sequence_message)
last_value = fib_sequence[len(fib_sequence) - 1]
last_message = "15th Fibonacci number: " + str(last_value)
print(last_message)
```

## stdout (executed)

```text
First 15 Fibonacci numbers: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377]
15th Fibonacci number: 377
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:call · eml:assign · eml:augment · eml:return · eml:output · eml:run:done
