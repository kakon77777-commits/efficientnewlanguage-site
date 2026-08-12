<!-- canonical: efficientnewlanguage.org/ai/examples/350-two-off-by-ones-preserve-the-count | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 350 — Two off-by-ones preserve the count — so the length check goes quiet

`two_off_by_ones_preserve_the_count.eml` slides a window whose start is one late and whose end is one late, and reports what a length check can see.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A sliding window
# whose start is one late and whose end is one late, and a test suite that
# checks the window's length.
#
# Either off-by-one alone changes the length, so the length check finds it.
# Both together restore the length exactly, and the check goes quiet. The
# suite can catch half of this defect and not the whole of it - which is the
# mirror image of a fix that must be applied whole or not at all.
#
# There is a second dependency here, on the DATA rather than the code: a
# shifted window over constant values has the same sum as an unshifted one, so
# a suite whose fixture happens to be flat cannot see the contents move either.
# The program runs both fixtures and reports which states each one can tell
# apart. Nothing is declared - every window is built and compared.

def window(xs, i, k, shift_start, shift_end):
    i + shift_start => lo
    i + k - 1 + shift_end => hi
    [] => out
    for j in [lo:hi]:
        out + [xs[j]] => out
    return out

def same_list(a, b):
    if len(a) != len(b):
        return 0
    0 => idx
    1 => ok
    for x in a:
        if x != b[idx]:
            0 => ok
        idx + 1 => idx
    return ok

[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8] => varied

[] => flat
for _step in [1:12]:
    flat + [7] => flat

4 => k
[[0, 0], [1, 0], [0, 1], [1, 1]] => states
["correct", "start late", "end late", "both late"] => labels

# ---- what a length-only check sees ----

"windows whose length is not " + str(k) ^0
0 => si
[] => length_ok
for s in states:
    0 => bad_len
    for i in [0:7]:
        window(varied, i, k, s[0], s[1]) => w
        if len(w) != k:
            bad_len + 1 => bad_len
    "  " + labels[si] + " : " + str(bad_len) + " of 8" ^0
    if bad_len == 0:
        length_ok + [si] => length_ok
    si + 1 => si
"  states a length check accepts: " + str(len(length_ok)) + " of " + str(len(states)) ^0
"" ^0

# ---- what those same states actually produce ----

"windows whose CONTENTS differ from the correct window (varied data)" ^0
0 => si
[] => content_ok
for s in states:
    0 => bad
    for i in [0:7]:
        window(varied, i, k, 0, 0) => truth
        window(varied, i, k, s[0], s[1]) => got
        if same_list(truth, got) == 0:
            bad + 1 => bad
    "  " + labels[si] + " : " + str(bad) + " of 8" ^0
    if bad == 0:
        content_ok + [si] => content_ok
    si + 1 => si
"  states that are actually correct: " + str(len(content_ok)) + " of " + str(len(states)) ^0
"" ^0

# ---- a state the length check accepts and the contents reject ----

"states accepted by the length check but wrong in contents" ^0
0 => hidden
for si in length_ok:
    if not (si in content_ok):
        hidden + 1 => hidden
        "  " + labels[si] ^0
"  total: " + str(hidden) ^0
"" ^0

[] => witness
for i in [0:7]:
    window(varied, i, k, 0, 0) => truth
    window(varied, i, k, 1, 1) => got
    if same_list(truth, got) == 0:
        if len(witness) == 0:
            [i, repr(truth), repr(got), str(sum(truth)), str(sum(got))] => witness
if len(witness) > 0:
    "first window where both-late differs" ^0
    "  at index  : " + str(witness[0]) ^0
    "  correct   : " + witness[1] + "  sum " + witness[3] ^0
    "  both late : " + witness[2] + "  sum " + witness[4] ^0
    "" ^0

# ---- the same four states over a flat fixture ----

"windows whose SUM differs from the correct window" ^0
0 => si
for s in states:
    0 => bad_v
    0 => bad_f
    for i in [0:7]:
        if sum(window(varied, i, k, s[0], s[1])) != sum(window(varied, i, k, 0, 0)):
            bad_v + 1 => bad_v
        if sum(window(flat, i, k, s[0], s[1])) != sum(window(flat, i, k, 0, 0)):
            bad_f + 1 => bad_f
    "  " + labels[si] + " : varied " + str(bad_v) + " of 8, flat " + str(bad_f) + " of 8" ^0
    si + 1 => si
"" ^0

"A defect that must be present twice to hide is not rarer than one that hides" ^0
"alone. It is more common, because the second one is usually written by the" ^0
"same hand, on the same day, from the same misreading." ^0
```

## Python (deterministic transpilation)

```python
def window(xs, i, k, shift_start, shift_end):
    lo = i + shift_start
    hi = i + k - 1 + shift_end
    out = []
    for j in range(lo, hi+1):
        out = out + [xs[j]]
    return out

def same_list(a, b):
    if len(a) != len(b):
        return 0
    idx = 0
    ok = 1
    for x in a:
        if x != b[idx]:
            ok = 0
        idx = idx + 1
    return ok

varied = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5, 8]
flat = []
for _step in range(1, 13):
    flat = flat + [7]
k = 4
states = [[0, 0], [1, 0], [0, 1], [1, 1]]
labels = ["correct", "start late", "end late", "both late"]
print("windows whose length is not " + str(k))
si = 0
length_ok = []
for s in states:
    bad_len = 0
    for i in range(0, 8):
        w = window(varied, i, k, s[0], s[1])
        if len(w) != k:
            bad_len = bad_len + 1
    print("  " + labels[si] + " : " + str(bad_len) + " of 8")
    if bad_len == 0:
        length_ok = length_ok + [si]
    si = si + 1
print("  states a length check accepts: " + str(len(length_ok)) + " of " + str(len(states)))
print("")
print("windows whose CONTENTS differ from the correct window (varied data)")
si = 0
content_ok = []
for s in states:
    bad = 0
    for i in range(0, 8):
        truth = window(varied, i, k, 0, 0)
        got = window(varied, i, k, s[0], s[1])
        if same_list(truth, got) == 0:
            bad = bad + 1
    print("  " + labels[si] + " : " + str(bad) + " of 8")
    if bad == 0:
        content_ok = content_ok + [si]
    si = si + 1
print("  states that are actually correct: " + str(len(content_ok)) + " of " + str(len(states)))
print("")
print("states accepted by the length check but wrong in contents")
hidden = 0
for si in length_ok:
    if not si in content_ok:
        hidden = hidden + 1
        print("  " + labels[si])
print("  total: " + str(hidden))
print("")
witness = []
for i in range(0, 8):
    truth = window(varied, i, k, 0, 0)
    got = window(varied, i, k, 1, 1)
    if same_list(truth, got) == 0:
        if len(witness) == 0:
            witness = [i, repr(truth), repr(got), str(sum(truth)), str(sum(got))]
if len(witness) > 0:
    print("first window where both-late differs")
    print("  at index  : " + str(witness[0]))
    print("  correct   : " + witness[1] + "  sum " + witness[3])
    print("  both late : " + witness[2] + "  sum " + witness[4])
    print("")
print("windows whose SUM differs from the correct window")
si = 0
for s in states:
    bad_v = 0
    bad_f = 0
    for i in range(0, 8):
        if sum(window(varied, i, k, s[0], s[1])) != sum(window(varied, i, k, 0, 0)):
            bad_v = bad_v + 1
        if sum(window(flat, i, k, s[0], s[1])) != sum(window(flat, i, k, 0, 0)):
            bad_f = bad_f + 1
    print("  " + labels[si] + " : varied " + str(bad_v) + " of 8, flat " + str(bad_f) + " of 8")
    si = si + 1
print("")
print("A defect that must be present twice to hide is not rarer than one that hides")
print("alone. It is more common, because the second one is usually written by the")
print("same hand, on the same day, from the same misreading.")
```

## stdout (executed)

```text
windows whose length is not 4
  correct : 0 of 8
  start late : 8 of 8
  end late : 8 of 8
  both late : 0 of 8
  states a length check accepts: 2 of 4

windows whose CONTENTS differ from the correct window (varied data)
  correct : 0 of 8
  start late : 8 of 8
  end late : 8 of 8
  both late : 8 of 8
  states that are actually correct: 1 of 4

states accepted by the length check but wrong in contents
  both late
  total: 1

first window where both-late differs
  at index  : 0
  correct   : [3, 1, 4, 1]  sum 9
  both late : [1, 4, 1, 5]  sum 11

windows whose SUM differs from the correct window
  correct : varied 0 of 8, flat 0 of 8
  start late : varied 8 of 8, flat 8 of 8
  end late : varied 8 of 8, flat 8 of 8
  both late : varied 7 of 8, flat 0 of 8

A defect that must be present twice to hide is not rarer than one that hides
alone. It is more common, because the second one is usually written by the
same hand, on the same day, from the same misreading.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
