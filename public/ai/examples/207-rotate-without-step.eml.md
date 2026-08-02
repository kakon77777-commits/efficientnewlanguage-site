<!-- canonical: efficientnewlanguage.org/ai/examples/207-rotate-without-step | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 207 — Rotation: the two-slice idiom, and why it needs a modulo

`rotate_without_step.eml` rotates a sequence with two slices and reverses one without a step — because EML-P slices take two parts and `xs[::-1]` does not parse.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Rotating a
# sequence with two slices, and reversing one without a step - because EML-P
# slices take two parts and `xs[::-1]` does not parse.
#
# Rotation is the textbook two-slice idiom:
#
#     rotate_left(xs, k)  ==  xs[k:] + xs[:k]
#
# It is correct, elegant, and wrong the moment k is not already in [0, len).
# The reason is exactly the property that makes slices convenient: they clamp.
#
#     k = 12 on a 5-element list  ->  xs[12:] is []  and  xs[:12] is all of it
#                                     so the result is the input, UNROTATED
#     k = -1                      ->  xs[-1:] is the last element
#                                     and xs[:-1] is the rest, which happens to
#                                     be rotate_RIGHT by 1
#
# The first is a silent no-op. The second is a rotation in the wrong
# direction that looks right for k = -1 and is wrong for k = -7. Neither
# raises, so the only way to notice is to check a property.
#
# The three properties a rotation must satisfy:
#
#   1. rotating by k and by k + len(xs) give the same result
#   2. rotating by k then by len(xs) - k gives the original back
#   3. the multiset of elements never changes - only the order does
#
# Property 1 is the one that catches the clamping bug immediately: without the
# modulo, rotate(xs, 3) and rotate(xs, 8) differ on a 5-element list.

def rotate_left(xs, k):
    # The modulo is the entire fix. `k % len(xs)` is always in [0, len), so
    # both slices are in range and the clamp never gets a chance to fire.
    if len(xs) == 0:
        return xs
    k % len(xs) => shift
    return xs[shift:] + xs[:shift]

def rotate_left_naive(xs, k):
    # Kept so the program can SHOW the failure instead of describing it.
    return xs[k:] + xs[:k]

def reverse(xs):
    # `xs[::-1]` is `E_PARSE: Unexpected token COLON` here - EML-P slices have
    # no step - so the reversal is built by walking backwards.
    [] => out
    len(xs) - 1 => i
    while i >= 0:
        out + [xs[i]] => out
        i - 1 => i
    return out

def same_multiset(a, b):
    if not (len(a) == len(b)):
        return False
    a => remaining
    for item in b:
        [] => next_remaining
        False => removed
        for r in remaining:
            if r == item and not removed:
                True => removed
            else:
                next_remaining + [r] => next_remaining
        if not removed:
            return False
        next_remaining => remaining
    return len(remaining) == 0


[10, 20, 30, 40, 50] => xs
len(xs) => n
("input: " + str(xs))^0

""^0
"rotate_left, k = 0..7:"^0
for k in [0:7]:
    ("  k=%d  correct=%-22s naive=%s" % (k, str(rotate_left(xs, k)), str(rotate_left_naive(xs, k))))^0

""^0
"Negative k:"^0
for k in [1:3]:
    0 - k => neg
    ("  k=%-3d correct=%-22s naive=%s" % (neg, str(rotate_left(xs, neg)), str(rotate_left_naive(xs, neg))))^0

""^0
("reverse(xs) = " + str(reverse(xs)))^0
("reverse twice is the identity: " + str(reverse(reverse(xs)) == xs))^0

# ------------------------------------------------------------------- checks
0 => wraps_ok
0 => inverse_ok
0 => multiset_ok
0 => checked
0 => naive_wrong

for k in [0:20]:
    checked + 1 => checked
    rotate_left(xs, k) => r

    # 1. k and k + n agree
    if r == rotate_left(xs, k + n):
        wraps_ok + 1 => wraps_ok

    # 2. rotating back returns the original
    if rotate_left(r, n - (k % n)) == xs:
        inverse_ok + 1 => inverse_ok

    # 3. same elements, different order
    if same_multiset(r, xs):
        multiset_ok + 1 => multiset_ok

    # how often the naive version disagrees
    if not (rotate_left_naive(xs, k) == r):
        naive_wrong + 1 => naive_wrong

""^0
("rotations checked:            " + str(checked))^0
("k and k+n agree:              " + str(wraps_ok) + "/" + str(checked))^0
("rotating back restores:       " + str(inverse_ok) + "/" + str(checked))^0
("elements preserved:           " + str(multiset_ok) + "/" + str(checked))^0
("naive version disagreed:      " + str(naive_wrong) + " times")^0

# The reversal, checked separately - it is the piece the missing step forced.
reverse(xs) => rev
0 => rev_ok
0 => rev_checked
for i in [0:n - 1]:
    rev_checked + 1 => rev_checked
    if rev[i] == xs[n - 1 - i]:
        rev_ok + 1 => rev_ok
("reverse positions correct:    " + str(rev_ok) + "/" + str(rev_checked))^0

""^0
if wraps_ok == checked and inverse_ok == checked and multiset_ok == checked and rev_ok == rev_checked and naive_wrong > 0:
    "Rotation holds for every k, and the naive two-slice version does not." => verdict
else:
    "FAILED - a rotation lost elements or did not wrap." => verdict
verdict^0

""^0
"`xs[k:] + xs[:k]` is the idiom everyone reaches for, and for k >= len it" => n1
n1^0
"quietly returns the input unrotated: the first slice clamps to empty and" => n2
n2^0
"the second clamps to everything. A single `% len(xs)` fixes it, and the" => n3
n3^0
"only way to notice it was missing is to compare k against k + len." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def rotate_left(xs, k):
    if len(xs) == 0:
        return xs
    shift = k % len(xs)
    return xs[shift:] + xs[:shift]

def rotate_left_naive(xs, k):
    return xs[k:] + xs[:k]

def reverse(xs):
    out = []
    i = len(xs) - 1
    while i >= 0:
        out = out + [xs[i]]
        i = i - 1
    return out

def same_multiset(a, b):
    if not len(a) == len(b):
        return False
    remaining = a
    for item in b:
        next_remaining = []
        removed = False
        for r in remaining:
            if r == item and not removed:
                removed = True
            else:
                next_remaining = next_remaining + [r]
        if not removed:
            return False
        remaining = next_remaining
    return len(remaining) == 0

xs = [10, 20, 30, 40, 50]
n = len(xs)
print("input: " + str(xs))
print("")
print("rotate_left, k = 0..7:")
for k in range(0, 8):
    print("  k=%d  correct=%-22s naive=%s" % (k, str(rotate_left(xs, k)), str(rotate_left_naive(xs, k))))
print("")
print("Negative k:")
for k in range(1, 4):
    neg = 0 - k
    print("  k=%-3d correct=%-22s naive=%s" % (neg, str(rotate_left(xs, neg)), str(rotate_left_naive(xs, neg))))
print("")
print("reverse(xs) = " + str(reverse(xs)))
print("reverse twice is the identity: " + str(reverse(reverse(xs)) == xs))
wraps_ok = 0
inverse_ok = 0
multiset_ok = 0
checked = 0
naive_wrong = 0
for k in range(0, 21):
    checked = checked + 1
    r = rotate_left(xs, k)
    if r == rotate_left(xs, k + n):
        wraps_ok = wraps_ok + 1
    if rotate_left(r, n - k % n) == xs:
        inverse_ok = inverse_ok + 1
    if same_multiset(r, xs):
        multiset_ok = multiset_ok + 1
    if not rotate_left_naive(xs, k) == r:
        naive_wrong = naive_wrong + 1
print("")
print("rotations checked:            " + str(checked))
print("k and k+n agree:              " + str(wraps_ok) + "/" + str(checked))
print("rotating back restores:       " + str(inverse_ok) + "/" + str(checked))
print("elements preserved:           " + str(multiset_ok) + "/" + str(checked))
print("naive version disagreed:      " + str(naive_wrong) + " times")
rev = reverse(xs)
rev_ok = 0
rev_checked = 0
for i in range(0, n):
    rev_checked = rev_checked + 1
    if rev[i] == xs[n - 1 - i]:
        rev_ok = rev_ok + 1
print("reverse positions correct:    " + str(rev_ok) + "/" + str(rev_checked))
print("")
if wraps_ok == checked and inverse_ok == checked and multiset_ok == checked and rev_ok == rev_checked and naive_wrong > 0:
    verdict = "Rotation holds for every k, and the naive two-slice version does not."
else:
    verdict = "FAILED - a rotation lost elements or did not wrap."
print(verdict)
print("")
n1 = "`xs[k:] + xs[:k]` is the idiom everyone reaches for, and for k >= len it"
print(n1)
n2 = "quietly returns the input unrotated: the first slice clamps to empty and"
print(n2)
n3 = "the second clamps to everything. A single `% len(xs)` fixes it, and the"
print(n3)
n4 = "only way to notice it was missing is to compare k against k + len."
print(n4)
```

## stdout (executed)

```text
input: [10, 20, 30, 40, 50]

rotate_left, k = 0..7:
  k=0  correct=[10, 20, 30, 40, 50]   naive=[10, 20, 30, 40, 50]
  k=1  correct=[20, 30, 40, 50, 10]   naive=[20, 30, 40, 50, 10]
  k=2  correct=[30, 40, 50, 10, 20]   naive=[30, 40, 50, 10, 20]
  k=3  correct=[40, 50, 10, 20, 30]   naive=[40, 50, 10, 20, 30]
  k=4  correct=[50, 10, 20, 30, 40]   naive=[50, 10, 20, 30, 40]
  k=5  correct=[10, 20, 30, 40, 50]   naive=[10, 20, 30, 40, 50]
  k=6  correct=[20, 30, 40, 50, 10]   naive=[10, 20, 30, 40, 50]
  k=7  correct=[30, 40, 50, 10, 20]   naive=[10, 20, 30, 40, 50]

Negative k:
  k=-1  correct=[50, 10, 20, 30, 40]   naive=[50, 10, 20, 30, 40]
  k=-2  correct=[40, 50, 10, 20, 30]   naive=[40, 50, 10, 20, 30]
  k=-3  correct=[30, 40, 50, 10, 20]   naive=[30, 40, 50, 10, 20]

reverse(xs) = [50, 40, 30, 20, 10]
reverse twice is the identity: True

rotations checked:            21
k and k+n agree:              21/21
rotating back restores:       21/21
elements preserved:           21/21
naive version disagreed:      12 times
reverse positions correct:    5/5

Rotation holds for every k, and the naive two-slice version does not.

`xs[k:] + xs[:k]` is the idiom everyone reaches for, and for k >= len it
quietly returns the input unrotated: the first slice clamps to empty and
the second clamps to everything. A single `% len(xs)` fixes it, and the
only way to notice it was missing is to compare k against k + len.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
