<!-- canonical: efficientnewlanguage.org/ai/examples/022-fizzbuzz | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 022 — Case corpus: a self-authored FizzBuzz

`fizzbuzz.eml` is one of a six-case self-authored batch of deterministic simulations and pattern generators (see [`examples/multiplication-table-generator/`](../multiplication-table-generator/), [`examples/triangle-pattern-printer/`](../triangle-pattern-printer/), [`examples/simple-calculator/`](../simple-calculator/), [`examples/rock-paper-scissors-simulator/`](../rock-paper-scissors-simulator/), and [`examples/dice-roll-tally/`](../dice-roll-tally/) for the other five) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Classic
# FizzBuzz over a fixed 1-30 range using EML's native inclusive range
# literal [a:b] (never Python's range(...) call, which is not
# round-trip-stable), `%` modulo comparisons, and if/elif/else dispatch.

for n in [1:30]:
    if n % 15 == 0:
        "FizzBuzz" => line
    elif n % 3 == 0:
        "Fizz" => line
    elif n % 5 == 0:
        "Buzz" => line
    else:
        str(n) => line
    line^0
```

## Python (deterministic transpilation)

```python
for n in range(1, 31):
    if n % 15 == 0:
        line = "FizzBuzz"
    elif n % 3 == 0:
        line = "Fizz"
    elif n % 5 == 0:
        line = "Buzz"
    else:
        line = str(n)
    print(line)
```

## stdout (executed)

```text
1
2
Fizz
4
Buzz
Fizz
7
8
Fizz
Buzz
11
Fizz
13
14
FizzBuzz
16
17
Fizz
19
Buzz
Fizz
22
23
Fizz
Buzz
26
Fizz
28
29
FizzBuzz
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
