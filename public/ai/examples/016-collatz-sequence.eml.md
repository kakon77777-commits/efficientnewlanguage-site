<!-- canonical: efficientnewlanguage.org/ai/examples/016-collatz-sequence | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 016 — Collatz sequence

`collatz_sequence.eml` runs the Collatz conjecture step (halve if even, `3n + 1` if odd) from three starting numbers — 6, 11, and the famously long-running 27 (111 steps) — until each reaches 1, printing the full sequence and step count for every run.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Runs the
# Collatz conjecture step (n/2 if even, 3n+1 if odd) until reaching 1, for a
# few starting numbers, printing the full sequence and step count for each.

def collatz_sequence(start):
    start => n
    [start] => sequence
    while n != 1:
        if n % 2 == 0:
            int(n / 2) => n
        else:
            3 * n + 1 => n
        sequence + [n] => sequence
    return sequence

starting_numbers^+[6, 11, 27]

for start in starting_numbers:
    collatz_sequence(start) => seq
    len(seq) - 1 => step_count
    "Start " + str(start) + ": " + str(step_count) + " steps" => summary
    summary^0
    "  Sequence: " + str(seq) => sequence_line
    sequence_line^0
```

## Python (deterministic transpilation)

```python
def collatz_sequence(start):
    n = start
    sequence = [start]
    while n != 1:
        if n % 2 == 0:
            n = int(n / 2)
        else:
            n = 3 * n + 1
        sequence = sequence + [n]
    return sequence

starting_numbers = [6, 11, 27]
for start in starting_numbers:
    seq = collatz_sequence(start)
    step_count = len(seq) - 1
    summary = "Start " + str(start) + ": " + str(step_count) + " steps"
    print(summary)
    sequence_line = "  Sequence: " + str(seq)
    print(sequence_line)
```

## stdout (executed)

```text
Start 6: 8 steps
  Sequence: [6, 3, 10, 5, 16, 8, 4, 2, 1]
Start 11: 14 steps
  Sequence: [11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1]
Start 27: 111 steps
  Sequence: [27, 82, 41, 124, 62, 31, 94, 47, 142, 71, 214, 107, 322, 161, 484, 242, 121, 364, 182, 91, 274, 137, 412, 206, 103, 310, 155, 466, 233, 700, 350, 175, 526, 263, 790, 395, 1186, 593, 1780, 890, 445, 1336, 668, 334, 167, 502, 251, 754, 377, 1132, 566, 283, 850, 425, 1276, 638, 319, 958, 479, 1438, 719, 2158, 1079, 3238, 1619, 4858, 2429, 7288, 3644, 1822, 911, 2734, 1367, 4102, 2051, 6154, 3077, 9232, 4616, 2308, 1154, 577, 1732, 866, 433, 1300, 650, 325, 976, 488, 244, 122, 61, 184, 92, 46, 23, 70, 35, 106, 53, 160, 80, 40, 20, 10, 5, 16, 8, 4, 2, 1]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
