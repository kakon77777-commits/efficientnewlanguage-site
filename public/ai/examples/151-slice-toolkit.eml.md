<!-- canonical: efficientnewlanguage.org/ai/examples/151-slice-toolkit | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 151 — Slicing is half-open, and that's the whole story

`slice_toolkit.eml` works through slicing, which five corpus programs had touched only in passing.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Slicing, which
# five corpus programs had touched only in passing.
#
# The rule worth internalising is that a slice is HALF-OPEN: `s[a:b]` includes
# a and excludes b. Everything convenient about slices follows from that one
# choice, and the program demonstrates each consequence rather than asserting
# it:
#
#   len(s[a:b]) == b - a               the length is the difference, no +-1
#   s[:k] + s[k:] == s                 any split point reassembles exactly
#   s[a:a] == ""                       an empty slice is legal, not an error
#   s[5:2] == ""                       a backwards range is empty, not an error
#   s[:99] on a short string is fine   out-of-range bounds CLAMP, they do not
#                                      raise the way s[99] would
#
# That last pair is the real reason slices are pleasant: the bounds are a
# request, not an assertion. The final section leans on it to write a windowing
# function with no boundary arithmetic at all.
#
# EML note: negative indices and a step (`s[::2]`) are outside the supported
# slice grammar, so everything here is expressed with non-negative bounds -
# which is also why the reversal below is written as an explicit loop.

"abcdefghij" => s
("s = \"" + s + "\"  (length " + str(len(s)) + ")")^0
""^0

"Half-open bounds:" => h1
h1^0
("  s[0:3] = \"" + s[0:3] + "\"   len " + str(len(s[0:3])) + " = 3 - 0")^0
("  s[3:7] = \"" + s[3:7] + "\"   len " + str(len(s[3:7])) + " = 7 - 3")^0
("  s[7:]  = \"" + s[7:] + "\"")^0
("  s[:4]  = \"" + s[:4] + "\"")^0
("  s[:]   = \"" + s[:] + "\"  (a full copy)")^0

""^0
"Every split point reassembles:" => h2
h2^0
0 => rejoined
for k in [0:10]:
    if s[:k] + s[k:] == s:
        rejoined + 1 => rejoined
("  " + str(rejoined) + " of 11 split points satisfy s[:k] + s[k:] == s")^0

""^0
"Degenerate ranges are empty, not errors:" => h3
h3^0
("  s[4:4]  = \"" + s[4:4] + "\"   (empty)")^0
("  s[7:2]  = \"" + s[7:2] + "\"   (backwards -> empty)")^0
("  s[:99]  = \"" + s[:99] + "\"  (clamped to the end)")^0
("  s[99:]  = \"" + s[99:] + "\"   (clamped -> empty)")^0
"  s[99] on its own would raise IndexError; the slice just clamps." => n3
n3^0

""^0
"Lists slice the same way:" => h4
h4^0
xs^+[10, 20, 30, 40, 50, 60]
("  xs[1:4] = " + str(xs[1:4]))^0
("  xs[:2]  = " + str(xs[:2]))^0
("  xs[4:]  = " + str(xs[4:]))^0

""^0
"Sliding windows, with no boundary arithmetic:" => h5
h5^0

def windows(seq, size):
    [] => out
    0 => i
    while i + size <= len(seq):
        out + [seq[i:i + size]] => out
        i + 1 => i
    return out

windows(xs, 3) => w3
for win in w3:
    ("  " + str(win))^0
("  " + str(len(w3)) + " windows of 3 over " + str(len(xs)) + " items = 6 - 3 + 1")^0

""^0
"A window larger than the sequence yields nothing at all:" => h6
h6^0
("  windows(xs, 99) -> " + str(windows(xs, 99)) + "   (the while never runs)")^0
"  No special case was written for that; the half-open bound handles it." => n6
n6^0
```

## Python (deterministic transpilation)

```python
s = "abcdefghij"
print("s = \"" + s + "\"  (length " + str(len(s)) + ")")
print("")
h1 = "Half-open bounds:"
print(h1)
print("  s[0:3] = \"" + s[0:3] + "\"   len " + str(len(s[0:3])) + " = 3 - 0")
print("  s[3:7] = \"" + s[3:7] + "\"   len " + str(len(s[3:7])) + " = 7 - 3")
print("  s[7:]  = \"" + s[7:] + "\"")
print("  s[:4]  = \"" + s[:4] + "\"")
print("  s[:]   = \"" + s[:] + "\"  (a full copy)")
print("")
h2 = "Every split point reassembles:"
print(h2)
rejoined = 0
for k in range(0, 11):
    if s[:k] + s[k:] == s:
        rejoined = rejoined + 1
print("  " + str(rejoined) + " of 11 split points satisfy s[:k] + s[k:] == s")
print("")
h3 = "Degenerate ranges are empty, not errors:"
print(h3)
print("  s[4:4]  = \"" + s[4:4] + "\"   (empty)")
print("  s[7:2]  = \"" + s[7:2] + "\"   (backwards -> empty)")
print("  s[:99]  = \"" + s[:99] + "\"  (clamped to the end)")
print("  s[99:]  = \"" + s[99:] + "\"   (clamped -> empty)")
n3 = "  s[99] on its own would raise IndexError; the slice just clamps."
print(n3)
print("")
h4 = "Lists slice the same way:"
print(h4)
xs = [10, 20, 30, 40, 50, 60]
print("  xs[1:4] = " + str(xs[1:4]))
print("  xs[:2]  = " + str(xs[:2]))
print("  xs[4:]  = " + str(xs[4:]))
print("")
h5 = "Sliding windows, with no boundary arithmetic:"
print(h5)

def windows(seq, size):
    out = []
    i = 0
    while i + size <= len(seq):
        out = out + [seq[i:i + size]]
        i = i + 1
    return out

w3 = windows(xs, 3)
for win in w3:
    print("  " + str(win))
print("  " + str(len(w3)) + " windows of 3 over " + str(len(xs)) + " items = 6 - 3 + 1")
print("")
h6 = "A window larger than the sequence yields nothing at all:"
print(h6)
print("  windows(xs, 99) -> " + str(windows(xs, 99)) + "   (the while never runs)")
n6 = "  No special case was written for that; the half-open bound handles it."
print(n6)
```

## stdout (executed)

```text
s = "abcdefghij"  (length 10)

Half-open bounds:
  s[0:3] = "abc"   len 3 = 3 - 0
  s[3:7] = "defg"   len 4 = 7 - 3
  s[7:]  = "hij"
  s[:4]  = "abcd"
  s[:]   = "abcdefghij"  (a full copy)

Every split point reassembles:
  11 of 11 split points satisfy s[:k] + s[k:] == s

Degenerate ranges are empty, not errors:
  s[4:4]  = ""   (empty)
  s[7:2]  = ""   (backwards -> empty)
  s[:99]  = "abcdefghij"  (clamped to the end)
  s[99:]  = ""   (clamped -> empty)
  s[99] on its own would raise IndexError; the slice just clamps.

Lists slice the same way:
  xs[1:4] = [20, 30, 40]
  xs[:2]  = [10, 20]
  xs[4:]  = [50, 60]

Sliding windows, with no boundary arithmetic:
  [10, 20, 30]
  [20, 30, 40]
  [30, 40, 50]
  [40, 50, 60]
  4 windows of 3 over 6 items = 6 - 3 + 1

A window larger than the sequence yields nothing at all:
  windows(xs, 99) -> []   (the while never runs)
  No special case was written for that; the half-open bound handles it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:def · eml:call · eml:return · eml:run:done
