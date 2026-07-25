<!-- canonical: efficientnewlanguage.org/ai/examples/087-happy-number | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 087 — Happy number

`happy_number.eml` tests six numbers for "happiness": repeatedly replace a number with the sum of the squares of its digits, and it is happy if that process reaches 1 (`19 -> 82 -> 68 -> 100 -> 1`).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Tests
# whether a number is "happy": repeatedly replace it with the sum of the
# squares of its digits, and it is happy if that process reaches 1.
# Unhappy numbers instead fall into a cycle forever, so the loop needs
# genuine cycle detection — a dict-as-set of already-seen values, the same
# idiom as examples/duplicate-remover/. Without it this program would not
# terminate on any unhappy input, which makes the `seen` check the most
# load-bearing line in the file.

def sum_of_digit_squares(n):
    0 => total
    n => remaining
    while remaining > 0:
        remaining % 10 => digit
        total + digit * digit => total
        int(remaining / 10) => remaining
    return total

def is_happy(n):
    seen^+{}
    n => current
    while current != 1:
        if current in seen:
            return False
        True => seen[current]
        sum_of_digit_squares(current) => current
    return True

numbers^+[1, 7, 19, 4, 20, 100]

for number in numbers:
    is_happy(number) => happy
    str(number) + " -> happy: " + str(happy) => line
    line^0
```

## Python (deterministic transpilation)

```python
def sum_of_digit_squares(n):
    total = 0
    remaining = n
    while remaining > 0:
        digit = remaining % 10
        total = total + digit * digit
        remaining = int(remaining / 10)
    return total

def is_happy(n):
    seen = {}
    current = n
    while current != 1:
        if current in seen:
            return False
        seen[current] = True
        current = sum_of_digit_squares(current)
    return True

numbers = [1, 7, 19, 4, 20, 100]
for number in numbers:
    happy = is_happy(number)
    line = str(number) + " -> happy: " + str(happy)
    print(line)
```

## stdout (executed)

```text
1 -> happy: True
7 -> happy: True
19 -> happy: True
4 -> happy: False
20 -> happy: False
100 -> happy: True
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
