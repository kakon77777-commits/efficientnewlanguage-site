<!-- canonical: efficientnewlanguage.org/ai/examples/023-gcd-lcm-calculator | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 023 — GCD/LCM calculator

`gcd_lcm_calculator.eml` computes the greatest common divisor of two numbers via the classic iterative Euclidean algorithm, then derives the least common multiple from the GCD, for three realistic number pairs (e.g. two recurring events on 48-day and 18-day cycles next line up on their LCM).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Computes the
# greatest common divisor via the iterative Euclidean algorithm (a `while`
# loop, not recursion — recursion is already covered elsewhere in this
# corpus) and derives the least common multiple from the GCD, for a few
# realistic number pairs (e.g. scheduling: two events recurring every 48 and
# 18 days next coincide on their LCM).

def gcd(a, b):
    a => x
    b => y
    while y != 0:
        x % y => remainder
        y => x
        remainder => y
    return x

def lcm(a, b):
    gcd(a, b) => shared
    int((a * b) / shared) => result
    return result

pairs^+[(48, 18), (252, 105), (17, 5)]

for pair in pairs:
    pair[0] => a
    pair[1] => b
    gcd(a, b) => g
    lcm(a, b) => l
    "gcd(" + str(a) + ", " + str(b) + ") = " + str(g) => gcd_line
    gcd_line^0
    "lcm(" + str(a) + ", " + str(b) + ") = " + str(l) => lcm_line
    lcm_line^0
```

## Python (deterministic transpilation)

```python
def gcd(a, b):
    x = a
    y = b
    while y != 0:
        remainder = x % y
        x = y
        y = remainder
    return x

def lcm(a, b):
    shared = gcd(a, b)
    result = int(a * b / shared)
    return result

pairs = [(48, 18), (252, 105), (17, 5)]
for pair in pairs:
    a = pair[0]
    b = pair[1]
    g = gcd(a, b)
    l = lcm(a, b)
    gcd_line = "gcd(" + str(a) + ", " + str(b) + ") = " + str(g)
    print(gcd_line)
    lcm_line = "lcm(" + str(a) + ", " + str(b) + ") = " + str(l)
    print(lcm_line)
```

## stdout (executed)

```text
gcd(48, 18) = 6
lcm(48, 18) = 144
gcd(252, 105) = 21
lcm(252, 105) = 1260
gcd(17, 5) = 1
lcm(17, 5) = 85
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
