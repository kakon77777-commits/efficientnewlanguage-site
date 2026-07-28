<!-- canonical: efficientnewlanguage.org/ai/examples/139-variance-with-sigma | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 139 — Variance two ways (Σ)

`variance_with_sigma.eml` computes population variance with two algebraically identical summations, and shows them disagreeing.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Population
# variance computed two ways, both expressed as summations:
#
#   definitional    Sigma((x - mean)^2) / n
#   computational   Sigma(x^2) / n - mean^2
#
# They are algebraically identical, and on ordinary data they agree
# exactly. On the second sample below they do not: the definitional form
# gives 1.25 and the computational form gives 0.0. Not a rounding wobble
# in the last digit - the entire answer is gone.
#
# The cause is worth being precise about, because the usual telling of
# this story does not quite apply to EML. The summation itself is FINE:
# Sigma(x^2) over those integers is 4000000020000000030, an exact
# nineteen-digit integer, because EML's integers are arbitrary-precision
# and never overflow. The loss happens afterwards, when that total is
# divided into a float and then has mean^2 subtracted from it. Both
# quantities are about 1e18, a float carries roughly sixteen significant
# digits, and the true difference is 1.25 - so it falls off the end and
# zero is what remains.
#
# So the moral is not "big numbers overflow". It is that an exact
# intermediate does not protect a computation whose final step subtracts
# two nearly-equal floats. The definitional form never forms those large
# quantities at all: it subtracts the mean FIRST, while the numbers are
# still small, and stays accurate.
#
# The sample [2,4,4,4,5,5,7,9] is the standard teaching set because it
# comes out clean by hand - mean 5, squared deviations 9,1,1,1,0,0,4,16
# summing to 32, variance 4, standard deviation exactly 2 - so the
# agreeing case is checkable without trusting either formula.

def mean_of(values):
    len(values) => n
    Σ(values[i], i in [0:n - 1]) => total
    return total / n

def variance_definitional(values):
    len(values) => n
    mean_of(values) => mean
    Σ((values[i] - mean)^2, i in [0:n - 1]) => total
    return total / n

def variance_computational(values):
    len(values) => n
    mean_of(values) => mean
    Σ(values[i]^2, i in [0:n - 1]) => total
    return total / n - mean^2

def absolute(x):
    if x < 0:
        return 0 - x
    return x

samples^+[[2, 4, 4, 4, 5, 5, 7, 9], [1000000001, 1000000002, 1000000003, 1000000004]]
labels^+["standard teaching set, mean 5", "values near 1e9, true variance 1.25"]

0 => i
while i < len(samples):
    samples[i] => data
    labels[i] => label
    mean_of(data) => mean
    variance_definitional(data) => definitional
    variance_computational(data) => computational
    absolute(definitional - computational) => gap

    "Data: " + str(data) => line1
    line1^0
    "  (" + label + ")" => line2
    line2^0
    "  mean          = " + str(mean) => line3
    line3^0
    "  definitional  = " + str(definitional) => line4
    line4^0
    "  computational = " + str(computational) => line5
    line5^0
    if gap < 0.000000001:
        "  the two forms agree" => line6
    else:
        "  they DISAGREE by " + str(gap) + " - trust the definitional one" => line6
    line6^0
    "" => blank
    blank^0
    i + 1 => i

variance_definitional(samples[0]) => v
"First set: variance " + str(v) + ", standard deviation " + str(v^0.5) => check
check^0

samples[1] => big
len(big) => bn
Σ(big[i]^2, i in [0:bn - 1]) => exact_squares
"Second set: the summation was exact all along - Sigma(x^2) = " + str(exact_squares) => note1
note1^0
"The precision was lost converting that to a float and subtracting, not in the sum." => note2
note2^0
```

## Python (deterministic transpilation)

```python
def mean_of(values):
    n = len(values)
    total = sum(values[i] for i in range(0, n))
    return total / n

def variance_definitional(values):
    n = len(values)
    mean = mean_of(values)
    total = sum((values[i] - mean)**2 for i in range(0, n))
    return total / n

def variance_computational(values):
    n = len(values)
    mean = mean_of(values)
    total = sum(values[i]**2 for i in range(0, n))
    return total / n - mean**2

def absolute(x):
    if x < 0:
        return 0 - x
    return x

samples = [[2, 4, 4, 4, 5, 5, 7, 9], [1000000001, 1000000002, 1000000003, 1000000004]]
labels = ["standard teaching set, mean 5", "values near 1e9, true variance 1.25"]
i = 0
while i < len(samples):
    data = samples[i]
    label = labels[i]
    mean = mean_of(data)
    definitional = variance_definitional(data)
    computational = variance_computational(data)
    gap = absolute(definitional - computational)
    line1 = "Data: " + str(data)
    print(line1)
    line2 = "  (" + label + ")"
    print(line2)
    line3 = "  mean          = " + str(mean)
    print(line3)
    line4 = "  definitional  = " + str(definitional)
    print(line4)
    line5 = "  computational = " + str(computational)
    print(line5)
    if gap < 0.000000001:
        line6 = "  the two forms agree"
    else:
        line6 = "  they DISAGREE by " + str(gap) + " - trust the definitional one"
    print(line6)
    blank = ""
    print(blank)
    i = i + 1
v = variance_definitional(samples[0])
check = "First set: variance " + str(v) + ", standard deviation " + str(v**0.5)
print(check)
big = samples[1]
bn = len(big)
exact_squares = sum(big[i]**2 for i in range(0, bn))
note1 = "Second set: the summation was exact all along - Sigma(x^2) = " + str(exact_squares)
print(note1)
note2 = "The precision was lost converting that to a float and subtracting, not in the sum."
print(note2)
```

## stdout (executed)

```text
Data: [2, 4, 4, 4, 5, 5, 7, 9]
  (standard teaching set, mean 5)
  mean          = 5.0
  definitional  = 4.0
  computational = 4.0
  the two forms agree

Data: [1000000001, 1000000002, 1000000003, 1000000004]
  (values near 1e9, true variance 1.25)
  mean          = 1000000002.5
  definitional  = 1.25
  computational = 0.0
  they DISAGREE by 1.25 - trust the definitional one

First set: variance 4.0, standard deviation 2.0
Second set: the summation was exact all along - Sigma(x^2) = 4000000020000000030
The precision was lost converting that to a float and subtracting, not in the sum.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:sum · eml:return · eml:output · eml:run:done
