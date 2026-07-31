<!-- canonical: efficientnewlanguage.org/ai/examples/178-pattern-tiler | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 178 — Repetition preserves the type

`pattern_tiler.eml` — tiles a pattern to fill a width.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Repeating a
# pattern to fill a width. The point of interest is that repetition PRESERVES
# THE TYPE: a repeated list is a list, a repeated tuple is a tuple, a repeated
# string is a string. It is not a generic "make a sequence" operation.
#
# That mattered here because the repeat branch built its result with LIST()
# unconditionally, so it could not have returned a tuple even if tuple had
# been allowed through - which it was not. `(1, 2) * 3` raised TypeError.

def tile(pattern, times):
    return pattern * times

def fill_to(pattern, width):
    len(pattern) => unit
    if unit == 0:
        return pattern
    width / unit => exact
    int(exact) => whole
    return pattern * whole

"Repetition preserves the type" => h
h^0
("  \"ab\" * 3      -> " + repr("ab" * 3))^0
("  [1, 2] * 3    -> " + repr([1, 2] * 3))^0
("  (1, 2) * 3    -> " + repr((1, 2) * 3))^0
("  3 * (1, 2)    -> " + repr(3 * (1, 2)) + "   (either side works)")^0
""^0

"Zero and negative counts give an EMPTY sequence, not an error" => h2
h2^0
("  (1, 2) * 0    -> " + repr((1, 2) * 0))^0
("  (1, 2) * -1   -> " + repr((1, 2) * (0 - 1)))^0
("  True is 1, so (1, 2) * True -> " + repr((1, 2) * True))^0
""^0

"Tiling a border to a width" => h3
h3^0
("-=",) => unit
for width in [4, 8, 12]:
    fill_to("-=", width) => bar
    ("  width " + str(width) + ": " + bar + "  (" + str(len(bar)) + " chars)")^0

""^0
"Tiling a repeating colour cycle" => h4
h4^0
("red", "amber", "green") => cycle
tile(cycle, 2) => two_cycles
("  one cycle : " + str(cycle))^0
("  two cycles: " + str(two_cycles))^0
("  length " + str(len(cycle)) + " -> " + str(len(two_cycles)))^0
("  still a tuple, so it is still hashable: " + str(len({two_cycles: "seen"})))^0
```

## Python (deterministic transpilation)

```python
def tile(pattern, times):
    return pattern * times

def fill_to(pattern, width):
    unit = len(pattern)
    if unit == 0:
        return pattern
    exact = width / unit
    whole = int(exact)
    return pattern * whole

h = "Repetition preserves the type"
print(h)
print("  \"ab\" * 3      -> " + repr("ab" * 3))
print("  [1, 2] * 3    -> " + repr([1, 2] * 3))
print("  (1, 2) * 3    -> " + repr((1, 2) * 3))
print("  3 * (1, 2)    -> " + repr(3 * (1, 2)) + "   (either side works)")
print("")
h2 = "Zero and negative counts give an EMPTY sequence, not an error"
print(h2)
print("  (1, 2) * 0    -> " + repr((1, 2) * 0))
print("  (1, 2) * -1   -> " + repr((1, 2) * (0 - 1)))
print("  True is 1, so (1, 2) * True -> " + repr((1, 2) * True))
print("")
h3 = "Tiling a border to a width"
print(h3)
unit = ("-=",)
for width in [4, 8, 12]:
    bar = fill_to("-=", width)
    print("  width " + str(width) + ": " + bar + "  (" + str(len(bar)) + " chars)")
print("")
h4 = "Tiling a repeating colour cycle"
print(h4)
cycle = ("red", "amber", "green")
two_cycles = tile(cycle, 2)
print("  one cycle : " + str(cycle))
print("  two cycles: " + str(two_cycles))
print("  length " + str(len(cycle)) + " -> " + str(len(two_cycles)))
print("  still a tuple, so it is still hashable: " + str(len({two_cycles: "seen"})))
```

## stdout (executed)

```text
Repetition preserves the type
  "ab" * 3      -> 'ababab'
  [1, 2] * 3    -> [1, 2, 1, 2, 1, 2]
  (1, 2) * 3    -> (1, 2, 1, 2, 1, 2)
  3 * (1, 2)    -> (1, 2, 1, 2, 1, 2)   (either side works)

Zero and negative counts give an EMPTY sequence, not an error
  (1, 2) * 0    -> ()
  (1, 2) * -1   -> ()
  True is 1, so (1, 2) * True -> (1, 2)

Tiling a border to a width
  width 4: -=-=  (4 chars)
  width 8: -=-=-=-=  (8 chars)
  width 12: -=-=-=-=-=-=  (12 chars)

Tiling a repeating colour cycle
  one cycle : ('red', 'amber', 'green')
  two cycles: ('red', 'amber', 'green', 'red', 'amber', 'green')
  length 3 -> 6
  still a tuple, so it is still hashable: 1
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
