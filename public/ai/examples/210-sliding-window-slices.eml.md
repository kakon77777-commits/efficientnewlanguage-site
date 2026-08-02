<!-- canonical: efficientnewlanguage.org/ai/examples/210-sliding-window-slices | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 210 — Sliding windows: the bug is always at the ends

`sliding_window_slices.eml` builds sliding windows over a sequence entirely from slices, and checks them where every windowing bug lives — at the two boundaries.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Sliding windows
# over a sequence, built entirely from slices - and checked at the two ends,
# where every windowing bug lives.
#
# A window function is four lines and three off-by-ones. The middle of the
# sequence is easy and always right; the failures are all at the boundaries:
#
#   - the last window runs past the end, and a slice CLAMPS instead of raising,
#     so a short final window looks like a correct one
#   - a window size larger than the sequence produces one short window, or
#     none, depending on what you meant - and both are silent
#   - a negative or zero step is a caller error that a slice will happily
#     absorb into an empty list
#
# None of those raise. That is the whole problem: `xs[i:i+k]` is defined for
# every i and every k, so a windowing loop that is wrong produces well-formed
# output of the wrong length and keeps going.
#
# So the checks are on the SHAPE of the result, computed independently:
#
#   1. a full-window pass yields exactly len(xs) - k + 1 windows, each of
#      length exactly k
#   2. a padded pass (allowing a short tail) yields ceil(len/step) windows and
#      covers every element exactly once
#   3. concatenating the padded windows reproduces the input

def windows_full(xs, k):
    # Only windows that are completely inside the sequence. The guard is
    # `i + k <= len(xs)`, NOT `i < len(xs)` - the second one is the bug, and
    # it produces a short final window that looks fine.
    [] => out
    0 => i
    while i + k <= len(xs):
        out + [xs[i:i + k]] => out
        i + 1 => i
    return out

def windows_stepped(xs, k, step):
    # Non-overlapping-ish chunks; the LAST one is allowed to be short, which is
    # what the slice's clamping gives for free.
    [] => out
    0 => i
    while i < len(xs):
        out + [xs[i:i + k]] => out
        i + step => i
    return out


[3, 1, 4, 1, 5, 9, 2, 6] => data
len(data) => n
("data:   " + str(data))^0
("length: " + str(n))^0

# ------------------------------------------------------- full windows, k = 3
""^0
3 => k
windows_full(data, k) => full
("full windows of " + str(k) + ":")^0
for w in full:
    ("  " + str(w))^0

n - k + 1 => expected_count
0 => right_length
for w in full:
    if len(w) == k:
        right_length + 1 => right_length

("  count: " + str(len(full)) + " (expected " + str(expected_count) + ")")^0
("  all exactly " + str(k) + " long: " + str(right_length) + "/" + str(len(full)))^0

# ----------------------------------------------------- stepped chunks, k = 3
""^0
3 => step
windows_stepped(data, k, step) => chunks
("chunks of " + str(k) + " stepping " + str(step) + ":")^0
for c in chunks:
    ("  " + str(c))^0

# Rebuild the input by concatenating - this is what catches a chunker that
# drops or duplicates the tail.
[] => rebuilt
for c in chunks:
    rebuilt + c => rebuilt
("  rebuilt: " + str(rebuilt))^0
("  matches input: " + str(rebuilt == data))^0

# ------------------------------------------------- windows larger than input
""^0
"A window larger than the sequence:"^0
windows_full(data, 99) => none_fit
("  windows_full(data, 99) -> " + str(none_fit) + "  (none fit, so none produced)")^0
windows_stepped(data, 99, 99) => one_short
("  windows_stepped(data, 99, 99) -> " + str(one_short))^0
("  the single window is the whole input: " + str(one_short[0] == data))^0

# ------------------------------------------------------ the clamping itself
""^0
"What the slice does past the end, directly:"^0
("  data[6:99]  = " + str(data[6:99]))^0
("  data[8:99]  = " + str(data[8:99]) + "   (start AT the end)")^0
("  data[99:99] = " + str(data[99:99]) + "   (both past the end)")^0
("  data[5:2]   = " + str(data[5:2]) + "   (start past stop)")^0

# ------------------------------------------------------------------- checks
0 => passed
0 => checked

checked + 1 => checked
if len(full) == expected_count:
    passed + 1 => passed

checked + 1 => checked
if right_length == len(full):
    passed + 1 => passed

checked + 1 => checked
if rebuilt == data:
    passed + 1 => passed

checked + 1 => checked
if len(none_fit) == 0 and len(one_short) == 1:
    passed + 1 => passed

# Every out-of-range slice must be empty or clamped, never an error - proven
# by the fact that we got here at all, but stated so it is checked.
checked + 1 => checked
if len(data[99:99]) == 0 and len(data[5:2]) == 0 and data[6:99] == [2, 6]:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Window counts and lengths are right at both ends." => verdict
else:
    "FAILED - a boundary window is the wrong length or missing." => verdict
verdict^0

""^0
"The guard `i + k <= len(xs)` is the whole case. Write `i < len(xs)` and the" => n1
n1^0
"last window comes back short instead of not coming back at all - and since" => n2
n2^0
"a slice past the end never raises, the only symptom is a count that is one" => n3
n3^0
"too high and a final window nobody looked at." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def windows_full(xs, k):
    out = []
    i = 0
    while i + k <= len(xs):
        out = out + [xs[i:i + k]]
        i = i + 1
    return out

def windows_stepped(xs, k, step):
    out = []
    i = 0
    while i < len(xs):
        out = out + [xs[i:i + k]]
        i = i + step
    return out

data = [3, 1, 4, 1, 5, 9, 2, 6]
n = len(data)
print("data:   " + str(data))
print("length: " + str(n))
print("")
k = 3
full = windows_full(data, k)
print("full windows of " + str(k) + ":")
for w in full:
    print("  " + str(w))
expected_count = n - k + 1
right_length = 0
for w in full:
    if len(w) == k:
        right_length = right_length + 1
print("  count: " + str(len(full)) + " (expected " + str(expected_count) + ")")
print("  all exactly " + str(k) + " long: " + str(right_length) + "/" + str(len(full)))
print("")
step = 3
chunks = windows_stepped(data, k, step)
print("chunks of " + str(k) + " stepping " + str(step) + ":")
for c in chunks:
    print("  " + str(c))
rebuilt = []
for c in chunks:
    rebuilt = rebuilt + c
print("  rebuilt: " + str(rebuilt))
print("  matches input: " + str(rebuilt == data))
print("")
print("A window larger than the sequence:")
none_fit = windows_full(data, 99)
print("  windows_full(data, 99) -> " + str(none_fit) + "  (none fit, so none produced)")
one_short = windows_stepped(data, 99, 99)
print("  windows_stepped(data, 99, 99) -> " + str(one_short))
print("  the single window is the whole input: " + str(one_short[0] == data))
print("")
print("What the slice does past the end, directly:")
print("  data[6:99]  = " + str(data[6:99]))
print("  data[8:99]  = " + str(data[8:99]) + "   (start AT the end)")
print("  data[99:99] = " + str(data[99:99]) + "   (both past the end)")
print("  data[5:2]   = " + str(data[5:2]) + "   (start past stop)")
passed = 0
checked = 0
checked = checked + 1
if len(full) == expected_count:
    passed = passed + 1
checked = checked + 1
if right_length == len(full):
    passed = passed + 1
checked = checked + 1
if rebuilt == data:
    passed = passed + 1
checked = checked + 1
if len(none_fit) == 0 and len(one_short) == 1:
    passed = passed + 1
checked = checked + 1
if len(data[99:99]) == 0 and len(data[5:2]) == 0 and data[6:99] == [2, 6]:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Window counts and lengths are right at both ends."
else:
    verdict = "FAILED - a boundary window is the wrong length or missing."
print(verdict)
print("")
n1 = "The guard `i + k <= len(xs)` is the whole case. Write `i < len(xs)` and the"
print(n1)
n2 = "last window comes back short instead of not coming back at all - and since"
print(n2)
n3 = "a slice past the end never raises, the only symptom is a count that is one"
print(n3)
n4 = "too high and a final window nobody looked at."
print(n4)
```

## stdout (executed)

```text
data:   [3, 1, 4, 1, 5, 9, 2, 6]
length: 8

full windows of 3:
  [3, 1, 4]
  [1, 4, 1]
  [4, 1, 5]
  [1, 5, 9]
  [5, 9, 2]
  [9, 2, 6]
  count: 6 (expected 6)
  all exactly 3 long: 6/6

chunks of 3 stepping 3:
  [3, 1, 4]
  [1, 5, 9]
  [2, 6]
  rebuilt: [3, 1, 4, 1, 5, 9, 2, 6]
  matches input: True

A window larger than the sequence:
  windows_full(data, 99) -> []  (none fit, so none produced)
  windows_stepped(data, 99, 99) -> [[3, 1, 4, 1, 5, 9, 2, 6]]
  the single window is the whole input: True

What the slice does past the end, directly:
  data[6:99]  = [2, 6]
  data[8:99]  = []   (start AT the end)
  data[99:99] = []   (both past the end)
  data[5:2]   = []   (start past stop)

checks passed: 5/5
Window counts and lengths are right at both ends.

The guard `i + k <= len(xs)` is the whole case. Write `i < len(xs)` and the
last window comes back short instead of not coming back at all - and since
a slice past the end never raises, the only symptom is a count that is one
too high and a final window nobody looked at.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
