<!-- canonical: efficientnewlanguage.org/ai/examples/068-digital-root-recursive | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 068 — Digital root (recursive)

`digital_root_recursive.eml` computes the digital root (repeated digit-sum until one digit remains) of five sample numbers (`12345, 999, 8, 0, 132189`).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Repeatedly
# sums a number's digits, recursively, until a single digit remains (its
# "digital root") — a deliberate contrast with the corpus's existing
# examples/sum-of-digits-recursive/, which sums digits only once.

def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(int(n / 10))

def digital_root(n):
    sum_digits(n) => total
    if total < 10:
        return total
    return digital_root(total)

numbers^+[12345, 999, 8, 0, 132189]

for n in numbers:
    digital_root(n) => root
    str(n) + " -> digital root " + str(root) => line
    line^0
```

## Python (deterministic transpilation)

```python
def sum_digits(n):
    if n < 10:
        return n
    return n % 10 + sum_digits(int(n / 10))

def digital_root(n):
    total = sum_digits(n)
    if total < 10:
        return total
    return digital_root(total)

numbers = [12345, 999, 8, 0, 132189]
for n in numbers:
    root = digital_root(n)
    line = str(n) + " -> digital root " + str(root)
    print(line)
```

## stdout (executed)

```text
12345 -> digital root 6
999 -> digital root 9
8 -> digital root 8
0 -> digital root 0
132189 -> digital root 6
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
