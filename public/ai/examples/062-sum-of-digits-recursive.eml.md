<!-- canonical: efficientnewlanguage.org/ai/examples/062-sum-of-digits-recursive | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 062 — Sum of digits (recursive)

`sum_of_digits_recursive.eml` computes the digit sum of five sample numbers (`4527, 918273, 60, 999999, 7`) via genuine recursion — a `digit_sum` function that calls itself on the number with its last digit stripped off.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Computes the
# digit sum of sample numbers via genuine recursion — the recursive
# counterpart to examples/digit-sum-calculator/'s iterative `while`-loop
# version. `int(n / 10)` stands in for floor division (EML has no `//`
# token, same idiom as digit-sum-calculator).

def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(int(n / 10))

numbers^+[4527, 918273, 60, 999999, 7]
for number in numbers:
    digit_sum(number) => result
    "Digit sum of " + str(number) + " = " + str(result) => line
    line^0
```

## Python (deterministic transpilation)

```python
def digit_sum(n):
    if n < 10:
        return n
    return n % 10 + digit_sum(int(n / 10))

numbers = [4527, 918273, 60, 999999, 7]
for number in numbers:
    result = digit_sum(number)
    line = "Digit sum of " + str(number) + " = " + str(result)
    print(line)
```

## stdout (executed)

```text
Digit sum of 4527 = 18
Digit sum of 918273 = 30
Digit sum of 60 = 6
Digit sum of 999999 = 54
Digit sum of 7 = 7
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
