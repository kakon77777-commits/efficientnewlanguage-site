<!-- canonical: efficientnewlanguage.org/ai/examples/120-newton-sqrt | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 120 — Newton's method for square roots

`newton_sqrt.eml` computes square roots by repeatedly averaging a guess with `value / guess`, and prints the convergence step by step:

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Newton's
# method for square roots: guess, then repeatedly replace the guess with
# the average of it and value/guess. The corpus's first NUMERICAL METHOD —
# an algorithm that converges toward an answer rather than computing one
# exactly, which makes "is it right" a question about tolerance rather
# than equality.
#
# Results are checked against EML's own fractional-power operator
# (`value^0.5`), an independent computation rather than the method
# checking itself. Comparison uses a tolerance, not `==`: two float
# computations that agree to every printed digit can still differ in the
# last bit, and a case asserting exact equality would be fragile for
# reasons that have nothing to do with the algorithm.
#
# The per-iteration trace for sqrt(2) shows why this method is worth
# knowing: the number of correct digits roughly DOUBLES each step, so it
# reaches full float precision in about five iterations.

def newton_sqrt(value, iterations):
    if value == 0:
        return 0.0
    value => guess
    0 => i
    while i < iterations:
        (guess + value / guess) / 2 => guess
        i + 1 => i
    return guess

def absolute(x):
    if x < 0:
        return 0 - x
    return x

"Convergence for sqrt(2), one line per iteration:" => header
header^0
2 => target
target => guess
for step in [1:6]:
    (guess + target / guess) / 2 => guess
    "  step " + str(step) + ": " + str(guess) => line
    line^0

"" => blank
blank^0

values^+[2, 9, 16, 100, 0.25]
0 => agreements
for value in values:
    newton_sqrt(value, 20) => approx
    value^0.5 => builtin
    absolute(approx - builtin) => difference
    if difference < 0.0000001:
        agreements + 1 => agreements
        "sqrt(" + str(value) + ") = " + str(approx) + " (agrees with ^0.5)" => line
    else:
        "sqrt(" + str(value) + ") = " + str(approx) + " (DISAGREES with " + str(builtin) + ")" => line
    line^0

str(agreements) + " of " + str(len(values)) + " agree with the built-in power operator" => summary
summary^0
```

## Python (deterministic transpilation)

```python
def newton_sqrt(value, iterations):
    if value == 0:
        return 0.0
    guess = value
    i = 0
    while i < iterations:
        guess = (guess + value / guess) / 2
        i = i + 1
    return guess

def absolute(x):
    if x < 0:
        return 0 - x
    return x

header = "Convergence for sqrt(2), one line per iteration:"
print(header)
target = 2
guess = target
for step in range(1, 7):
    guess = (guess + target / guess) / 2
    line = "  step " + str(step) + ": " + str(guess)
    print(line)
blank = ""
print(blank)
values = [2, 9, 16, 100, 0.25]
agreements = 0
for value in values:
    approx = newton_sqrt(value, 20)
    builtin = value**0.5
    difference = absolute(approx - builtin)
    if difference < 0.0000001:
        agreements = agreements + 1
        line = "sqrt(" + str(value) + ") = " + str(approx) + " (agrees with ^0.5)"
    else:
        line = "sqrt(" + str(value) + ") = " + str(approx) + " (DISAGREES with " + str(builtin) + ")"
    print(line)
summary = str(agreements) + " of " + str(len(values)) + " agree with the built-in power operator"
print(summary)
```

## stdout (executed)

```text
Convergence for sqrt(2), one line per iteration:
  step 1: 1.5
  step 2: 1.4166666666666665
  step 3: 1.4142156862745097
  step 4: 1.4142135623746899
  step 5: 1.414213562373095
  step 6: 1.414213562373095

sqrt(2) = 1.414213562373095 (agrees with ^0.5)
sqrt(9) = 3.0 (agrees with ^0.5)
sqrt(16) = 4.0 (agrees with ^0.5)
sqrt(100) = 10.0 (agrees with ^0.5)
sqrt(0.25) = 0.5 (agrees with ^0.5)
5 of 5 agree with the built-in power operator
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
