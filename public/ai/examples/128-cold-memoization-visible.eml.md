<!-- canonical: efficientnewlanguage.org/ai/examples/128-cold-memoization-visible | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 128 — @cold, made visible

`cold_memoization_visible.eml` is the corpus's **first use of EML's temperature model**. The 124 programs before it used neither `@cold` nor `@hot`, despite those being among EML's most distinctive features.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). @cold is EML's
# "cold logic" annotation - pure, cacheable, precompilable. It is the corpus's
# first use of the temperature model: the 124 programs before this one used
# neither @cold nor @hot, even though they are among EML's most distinctive
# features.
#
# The point this case makes is that @cold is NOT a hint. It transpiles to
# @functools.cache, and EML's interpreter emulates that same cache, so the
# annotation changes how many times the body runs. Deleting the @cold line
# below changes this program's output.
#
# Making that visible needs an observation instrument, and the only honest one
# is a print inside the cached function. That is deliberately the thing EML
# warns about:
#
#   [warning] W_COLD_SIDE_EFFECT: @cold function 'collatz_length' has side
#   effects; it is not safely cacheable as pure logic.
#
# The warning is correct, and this case is a demonstration of WHY it exists
# rather than a counterexample to it. A cached function's side effects happen
# once per distinct argument, not once per call - which is exactly what makes
# them unsafe, and exactly what makes them useful here as a counter. In real
# code the print would be the bug; here it is the measuring device.
#
# The requests below repeat on purpose: six calls over three distinct values.
# A correct cache computes three times. No cache computes six times.

@cold
def collatz_length(n):
    ("    [computing collatz_length(" + str(n) + ")]")^0
    0 => steps
    n => cur
    while cur != 1:
        if cur % 2 == 0:
            int(cur / 2) => cur
        else:
            3 * cur + 1 => cur
        steps + 1 => steps
    return steps

requests^+[27, 6, 27, 9, 6, 27]

"Six requests over three distinct values: [27, 6, 27, 9, 6, 27]" => header
header^0
""^0

0 => served
for r in requests:
    collatz_length(r) => length
    ("  request " + str(r) + " -> " + str(length))^0
    served + 1 => served

""^0

{} => seen
0 => distinct
for r in requests:
    if not r in seen:
        1 => seen[r]
        distinct + 1 => distinct

("Served " + str(served) + " requests from " + str(distinct) + " computations.")^0
"Count the [computing] lines above: there are exactly that many." => note
note^0
"Remove the @cold line and there would be one per request instead." => note2
note2^0
```

## Python (deterministic transpilation)

```python
import functools

@functools.cache
def collatz_length(n):
    print("    [computing collatz_length(" + str(n) + ")]")
    steps = 0
    cur = n
    while cur != 1:
        if cur % 2 == 0:
            cur = int(cur / 2)
        else:
            cur = 3 * cur + 1
        steps = steps + 1
    return steps

requests = [27, 6, 27, 9, 6, 27]
header = "Six requests over three distinct values: [27, 6, 27, 9, 6, 27]"
print(header)
print("")
served = 0
for r in requests:
    length = collatz_length(r)
    print("  request " + str(r) + " -> " + str(length))
    served = served + 1
print("")
seen = {}
distinct = 0
for r in requests:
    if not r in seen:
        seen[r] = 1
        distinct = distinct + 1
print("Served " + str(served) + " requests from " + str(distinct) + " computations.")
note = "Count the [computing] lines above: there are exactly that many."
print(note)
note2 = "Remove the @cold line and there would be one per request instead."
print(note2)
```

## stdout (executed)

```text
Six requests over three distinct values: [27, 6, 27, 9, 6, 27]

    [computing collatz_length(27)]
  request 27 -> 111
    [computing collatz_length(6)]
  request 6 -> 8
  request 27 -> 111
    [computing collatz_length(9)]
  request 9 -> 19
  request 6 -> 8
  request 27 -> 111

Served 6 requests from 3 computations.
Count the [computing] lines above: there are exactly that many.
Remove the @cold line and there would be one per request instead.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:cache:miss · eml:return · eml:cache:hit · eml:run:done
