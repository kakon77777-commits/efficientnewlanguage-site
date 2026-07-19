<!-- canonical: efficientnewlanguage.org/ai/examples/034-quadratic-solver | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 034 — Quadratic equation solver

`quadratic_solver.eml` solves `ax^2 + bx + c = 0` via the quadratic formula for three sample coefficient triples that all have real roots — `(1, -3, 2)` -> roots 1 and 2, `(2, -7, 3)` -> roots 0.5 and 3, `(1, -5, 6)` -> roots 2 and 3. The discriminant-negative (complex-root) case is deliberately skipped, as scoped for this case.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Solves
# ax^2 + bx + c = 0 via the quadratic formula for a few sample coefficient
# triples with real roots, using EML's own native fractional-exponent power
# operator (`discriminant^0.5` -> `discriminant ** 0.5`, normative per
# eml-v1.md section 6: "float exponent permitted") instead of importing
# `math.sqrt` — keeps the case fully interpreter-computable (an unbound
# `math.sqrt` call defers to real Python in the browser interpreter, which
# would break the execution-truth gate). Unary minus on an identifier
# (`-b`) is not supported by the parser (only on numeric literals), so
# `0 - b` is used instead. The pair of roots is returned as a list, not a
# bare tuple literal — assigning a bare tuple straight to a fresh variable
# round-trips through `ident^+(a, b)`, which collides with EML's call-bind
# grammar (`f^+(args)` means "call and bind"), so the fixpoint never
# re-converges; a list literal has its own dedicated round-trip-safe
# grammar production and avoids the collision.

def solve_quadratic(a, b, c):
    b * b - 4 * a * c => discriminant
    discriminant^0.5 => root
    (0 - b + root) / (2 * a) => x1
    (0 - b - root) / (2 * a) => x2
    [x1, x2] => roots
    return roots

coefficients^+[(1, -3, 2), (2, -7, 3), (1, -5, 6)]

for triple in coefficients:
    triple[0] => a
    triple[1] => b
    triple[2] => c
    solve_quadratic(a, b, c) => roots
    roots[0] => root1
    roots[1] => root2
    str(a) + "x^2 + " + str(b) + "x + " + str(c) + " = 0  ->  x1=" + str(root1) + ", x2=" + str(root2) => line
    line^0
```

## Python (deterministic transpilation)

```python
def solve_quadratic(a, b, c):
    discriminant = b * b - 4 * a * c
    root = discriminant**0.5
    x1 = (0 - b + root) / (2 * a)
    x2 = (0 - b - root) / (2 * a)
    roots = [x1, x2]
    return roots

coefficients = [(1, -3, 2), (2, -7, 3), (1, -5, 6)]
for triple in coefficients:
    a = triple[0]
    b = triple[1]
    c = triple[2]
    roots = solve_quadratic(a, b, c)
    root1 = roots[0]
    root2 = roots[1]
    line = str(a) + "x^2 + " + str(b) + "x + " + str(c) + " = 0  ->  x1=" + str(root1) + ", x2=" + str(root2)
    print(line)
```

## stdout (executed)

```text
1x^2 + -3x + 2 = 0  ->  x1=2.0, x2=1.0
2x^2 + -7x + 3 = 0  ->  x1=3.0, x2=0.5
1x^2 + -5x + 6 = 0  ->  x1=3.0, x2=2.0
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
