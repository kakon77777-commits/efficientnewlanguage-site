<!-- canonical: efficientnewlanguage.org/ai/examples/070-euclidean-gcd-recursive | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 070 — Euclidean GCD (recursive)

`euclidean_gcd_recursive.eml` computes the greatest common divisor of five sample pairs (`(48,18)`, `(1071,462)`, `(17,5)`, `(100,75)`, `(0,9)`) via Euclid's algorithm.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Computes the
# greatest common divisor via Euclid's algorithm through genuine
# self-recursion — distinct from the corpus's earlier gcd-lcm-calculator,
# whose gcd/lcm turned out iterative on inspection (the same distinction
# factorial-recursive's own header comment makes).

def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

pairs^+[[48, 18], [1071, 462], [17, 5], [100, 75], [0, 9]]

for pair in pairs:
    pair[0] => a
    pair[1] => b
    gcd(a, b) => result
    str(a) + ", " + str(b) + " -> gcd = " + str(result) => line
    line^0
```

## Python (deterministic transpilation)

```python
def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

pairs = [[48, 18], [1071, 462], [17, 5], [100, 75], [0, 9]]
for pair in pairs:
    a = pair[0]
    b = pair[1]
    result = gcd(a, b)
    line = str(a) + ", " + str(b) + " -> gcd = " + str(result)
    print(line)
```

## stdout (executed)

```text
48, 18 -> gcd = 6
1071, 462 -> gcd = 21
17, 5 -> gcd = 1
100, 75 -> gcd = 25
0, 9 -> gcd = 9
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
