<!-- canonical: efficientnewlanguage.org/ai/examples/152-text-banner-builder | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 152 — Sequence repetition

`text_banner_builder.eml` covers `"-" * n` and `[0] * n` — which no corpus program had used, and which is the workhorse behind every box, rule, bar chart and padded column.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Sequence
# repetition - `"-" * n` and `[0] * n` - which no corpus program had used, and
# which is the workhorse behind every box, rule, bar chart and padded column.
#
# Repetition looks trivial until the edge cases, and every one below is
# checked rather than avoided:
#
#   n = 0   gives an EMPTY sequence, not a one-element one
#   n < 0   also gives empty - it does NOT raise, and does not count backwards
#   the result of `[x] * n` is a NEW list; repeating a list of lists would
#   share the inner list n times, which is the classic grid-building bug, so
#   the grid below is built row by row instead
#
# The banner is drawn to a width derived from the longest line rather than a
# hardcoded number, so the box closes exactly regardless of content - which is
# also what makes a wrong repetition count visible as a ragged edge instead of
# an invisible off-by-one.

def box(lines, pad):
    0 => widest
    for line in lines:
        if len(line) > widest:
            len(line) => widest
    widest + pad * 2 => inner
    ("+" + "-" * inner + "+")^0
    for line in lines:
        inner - pad - len(line) => right
        ("|" + " " * pad + line + " " * right + "|")^0
    ("+" + "-" * inner + "+")^0
    return inner + 2

box(["EML", "case corpus", "sequence repetition"], 2) => drawn
("box outer width: " + str(drawn))^0

""^0
"Edge cases:" => h1
h1^0
("  \"ab\" * 3  = " + "\"" + "ab" * 3 + "\"")^0
("  \"ab\" * 1  = " + "\"" + "ab" * 1 + "\"")^0
("  \"ab\" * 0  = " + "\"" + "ab" * 0 + "\"   (empty, length " + str(len("ab" * 0)) + ")")^0
("  \"ab\" * -4 = " + "\"" + "ab" * (0 - 4) + "\"   (also empty - negative does not raise)")^0
("  [7] * 4    = " + str([7] * 4))^0
("  [7] * 0    = " + str([7] * 0))^0

""^0
"A bar chart, where the repetition count IS the data:" => h2
h2^0
labels^+["mon", "tue", "wed", "thu", "fri"]
counts^+[3, 7, 0, 12, 5]
0 => i
while i < len(labels):
    counts[i] => n
    ("  %-4s |%s %d" % (labels[i], "#" * n, n))^0
    i + 1 => i
"  wednesday is a zero-length bar, not a missing row" => n1
n1^0

""^0
"The shared-inner-list trap:" => h3
h3^0
[[0] * 3] * 2 => shared
[] => independent
for r in [1:2]:
    independent + [[0] * 3] => independent
9 => shared[0][0]
9 => independent[0][0]
("  [[0]*3]*2   after setting [0][0]=9 -> " + str(shared))^0
("  built row by row                    -> " + str(independent))^0
"  The first has TWO nines: both rows are the same list object." => n2
n2^0
```

## Python (deterministic transpilation)

```python
def box(lines, pad):
    widest = 0
    for line in lines:
        if len(line) > widest:
            widest = len(line)
    inner = widest + pad * 2
    print("+" + "-" * inner + "+")
    for line in lines:
        right = inner - pad - len(line)
        print("|" + " " * pad + line + " " * right + "|")
    print("+" + "-" * inner + "+")
    return inner + 2

drawn = box(["EML", "case corpus", "sequence repetition"], 2)
print("box outer width: " + str(drawn))
print("")
h1 = "Edge cases:"
print(h1)
print("  \"ab\" * 3  = " + "\"" + "ab" * 3 + "\"")
print("  \"ab\" * 1  = " + "\"" + "ab" * 1 + "\"")
print("  \"ab\" * 0  = " + "\"" + "ab" * 0 + "\"   (empty, length " + str(len("ab" * 0)) + ")")
print("  \"ab\" * -4 = " + "\"" + "ab" * (0 - 4) + "\"   (also empty - negative does not raise)")
print("  [7] * 4    = " + str([7] * 4))
print("  [7] * 0    = " + str([7] * 0))
print("")
h2 = "A bar chart, where the repetition count IS the data:"
print(h2)
labels = ["mon", "tue", "wed", "thu", "fri"]
counts = [3, 7, 0, 12, 5]
i = 0
while i < len(labels):
    n = counts[i]
    print("  %-4s |%s %d" % (labels[i], "#" * n, n))
    i = i + 1
n1 = "  wednesday is a zero-length bar, not a missing row"
print(n1)
print("")
h3 = "The shared-inner-list trap:"
print(h3)
shared = [[0] * 3] * 2
independent = []
for r in range(1, 3):
    independent = independent + [[0] * 3]
shared[0][0] = 9
independent[0][0] = 9
print("  [[0]*3]*2   after setting [0][0]=9 -> " + str(shared))
print("  built row by row                    -> " + str(independent))
n2 = "  The first has TWO nines: both rows are the same list object."
print(n2)
```

## stdout (executed)

```text
+-----------------------+
|  EML                  |
|  case corpus          |
|  sequence repetition  |
+-----------------------+
box outer width: 25

Edge cases:
  "ab" * 3  = "ababab"
  "ab" * 1  = "ab"
  "ab" * 0  = ""   (empty, length 0)
  "ab" * -4 = ""   (also empty - negative does not raise)
  [7] * 4    = [7, 7, 7, 7]
  [7] * 0    = []

A bar chart, where the repetition count IS the data:
  mon  |### 3
  tue  |####### 7
  wed  | 0
  thu  |############ 12
  fri  |##### 5
  wednesday is a zero-length bar, not a missing row

The shared-inner-list trap:
  [[0]*3]*2   after setting [0][0]=9 -> [[9, 0, 0], [9, 0, 0]]
  built row by row                    -> [[9, 0, 0], [0, 0, 0]]
  The first has TWO nines: both rows are the same list object.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:call · eml:assign · eml:output · eml:return · eml:run:done
