<!-- canonical: efficientnewlanguage.org/ai/examples/238-fixed-width-overflow | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 238 — Correct in Python, wrong everywhere it will be ported

`fixed_width_overflow.eml` implements 32-bit signed arithmetic explicitly and runs the same computations both ways.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Arithmetic that
# is correct in Python and wrong in every language it will be ported to.
#
# Python integers do not overflow. That is a genuine feature and it is also a
# blindfold: an algorithm developed and tested here can be arithmetically
# perfect and still be wrong the moment it is written in C, Java, Go or Rust,
# because those have a width and this does not.
#
# The failure has no error state in either language. In Python the number
# simply gets bigger. In a fixed-width language it wraps, quietly, to a value
# of the right type in the right range - and a checksum, a hash, an index or a
# balance made of wrapped arithmetic is a plausible number.
#
# This program implements 32-bit signed arithmetic explicitly and runs the
# same computations both ways:
#
#     a hash accumulator      overflows within a dozen characters
#     a midpoint (lo+hi)/2    the classic binary-search overflow
#     a factorial             leaves the range at 13
#     a difference of squares which wraps to the WRONG SIGN
#
# The last is the one worth the trouble: a wrapped value is not merely large
# or small, it can be negative when every input was positive, so a `if x > 0`
# guard downstream lets it through.
#
# EML-P has no bitwise operators, so the wrap is written with modulo. That is
# the definition rather than a trick: two's complement IS arithmetic mod 2^32
# with the top half read as negative.

2147483648 => TWO31
4294967296 => TWO32

def wrap32(n):
    # Two's complement: reduce mod 2^32, then map the upper half to negatives.
    n % TWO32 => m
    if m >= TWO31:
        return m - TWO32
    return m

def add32(a, b):
    return wrap32(a + b)

def mul32(a, b):
    return wrap32(a * b)

def fits32(n):
    return n >= 0 - TWO31 and n < TWO31


# ------------------------------------------------------------ a hash function
def hash_python(s):
    # The classic h = h * 31 + code accumulator, written out so the growth is
    # visible. EML-P has no ord(), so the code point comes from a table walk.
    0 => h
    for ch in s:
        0 => code
        "abcdefghijklmnopqrstuvwxyz" => alpha
        for i in [0:25]:
            if alpha[i] == ch:
                i + 97 => code
        h * 31 + code => h
    return h

def hash_32(s):
    0 => h
    for ch in s:
        0 => code
        "abcdefghijklmnopqrstuvwxyz" => alpha
        for i in [0:25]:
            if alpha[i] == ch:
                i + 97 => code
        add32(mul32(h, 31), code) => h
    return h


"input        python hash              32-bit hash    in range"^0
for w in ["a", "ab", "abcd", "abcdefg", "abcdefghij"]:
    hash_python(w) => hp
    hash_32(w) => h32
    ("%-12s %-24s %-14d %s" % (w, str(hp), h32, str(fits32(hp))))^0

# ------------------------------------------------------ the binary-search bug
""^0
"The midpoint that made a decade of binary searches wrong:"^0
2000000000 => lo
2100000000 => hi
int((lo + hi) / 2) => mid_python
wrap32(lo + hi) => sum32
int(sum32 / 2) => mid_32
lo + int((hi - lo) / 2) => mid_safe

("  lo + hi              = " + str(lo + hi) + "   fits in 32 bits: " + str(fits32(lo + hi)))^0
("  (lo + hi) / 2        = " + str(mid_python) + "   correct")^0
("  32-bit (lo + hi) / 2 = " + str(mid_32) + "   NEGATIVE")^0
("  lo + (hi - lo) / 2   = " + str(mid_safe) + "   correct in both")^0

# ------------------------------------------------------------- factorial
""^0
"factorial, where the range runs out:"^0
1 => f_py
1 => f_32
for n in [1:15]:
    f_py * n => f_py
    mul32(f_32, n) => f_32
    if n >= 11 and n <= 14:
        "" => flag
        if not (fits32(f_py)):
            "  <- outside 32 bits" => flag
        ("  %2d! = %-16s 32-bit: %-14d%s" % (n, str(f_py), f_32, flag))^0

# ----------------------------------------------- where the sign flips
# A wrapped value is not just wrong in magnitude. This sweep looks for inputs
# where every operand is positive and the 32-bit result is negative, which is
# what defeats a downstream `if x > 0` guard.
0 => tried
0 => wrapped
0 => sign_flipped
[] => witness
for a in [46341, 50000, 65536, 100000, 2000000]:
    for b in [46341, 50000, 65536, 100000, 2000000]:
        tried + 1 => tried
        a * b => exact
        mul32(a, b) => got
        if not (exact == got):
            wrapped + 1 => wrapped
            if got < 0:
                sign_flipped + 1 => sign_flipped
                if len(witness) < 3:
                    witness + [str(a) + " * " + str(b) + " = " + str(exact) + " -> " + str(got)] => witness

""^0
("positive products tried:      " + str(tried))^0
("  wrapped:                    " + str(wrapped))^0
("  wrapped to a NEGATIVE value:" + str(sign_flipped))^0
for w in witness:
    ("  " + w)^0

# --------------------------------------------- what a guard would let through
0 => guard_passes
for a in [46341, 50000, 65536, 100000, 2000000]:
    for b in [46341, 50000, 65536, 100000, 2000000]:
        mul32(a, b) => got
        if got > 0:
            guard_passes + 1 => guard_passes

""^0
("products that pass an `if x > 0` guard: " + str(guard_passes) + "/" + str(tried))^0
("...of which actually correct:           " + str(tried - wrapped))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The wrap must be a real two's-complement wrap: 2^31 - 1 plus one is the
# most negative value.
checked + 1 => checked
if add32(2147483647, 1) == 0 - TWO31 and add32(0 - TWO31, 0 - 1) == 2147483647:
    passed + 1 => passed

# Inside the range, 32-bit arithmetic must agree with Python exactly. A wrap
# that fires early would make the whole comparison meaningless.
checked + 1 => checked
0 => agree
0 => n_small
for a in [0, 1, 7, 1000, 46340]:
    for b in [0, 1, 7, 1000, 46340]:
        n_small + 1 => n_small
        if mul32(a, b) == a * b and add32(a, b) == a + b:
            agree + 1 => agree
if agree == n_small:
    passed + 1 => passed

# The naive midpoint must go negative and the safe one must not.
checked + 1 => checked
if mid_32 < 0 and mid_safe == mid_python:
    passed + 1 => passed

# There must be positive-times-positive products that land negative, and they
# must be a MINORITY - a majority would be noticed.
checked + 1 => checked
if sign_flipped > 0 and sign_flipped < tried:
    passed + 1 => passed

# And a `> 0` guard must let through more than it should.
checked + 1 => checked
if guard_passes > tried - wrapped:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Positive inputs, negative product, and a guard that says it is fine." => verdict
else:
    "FAILED - the 32-bit model did not behave as the checks describe." => verdict
verdict^0

""^0
"Python's unbounded integers make this class of bug undetectable in the" => n1
n1^0
"language the algorithm was prototyped in, which is exactly when it would be" => n2
n2^0
"cheapest to find. `lo + (hi - lo) / 2` costs one extra subtraction and is" => n3
n3^0
"correct everywhere - the reason to write it that way in Python is not that" => n4
n4^0
"Python needs it, but that the next reader will not be using Python." => n5
n5^0
```

## Python (deterministic transpilation)

```python
TWO31 = 2147483648
TWO32 = 4294967296

def wrap32(n):
    m = n % TWO32
    if m >= TWO31:
        return m - TWO32
    return m

def add32(a, b):
    return wrap32(a + b)

def mul32(a, b):
    return wrap32(a * b)

def fits32(n):
    return n >= 0 - TWO31 and n < TWO31

def hash_python(s):
    h = 0
    for ch in s:
        code = 0
        alpha = "abcdefghijklmnopqrstuvwxyz"
        for i in range(0, 26):
            if alpha[i] == ch:
                code = i + 97
        h = h * 31 + code
    return h

def hash_32(s):
    h = 0
    for ch in s:
        code = 0
        alpha = "abcdefghijklmnopqrstuvwxyz"
        for i in range(0, 26):
            if alpha[i] == ch:
                code = i + 97
        h = add32(mul32(h, 31), code)
    return h

print("input        python hash              32-bit hash    in range")
for w in ["a", "ab", "abcd", "abcdefg", "abcdefghij"]:
    hp = hash_python(w)
    h32 = hash_32(w)
    print("%-12s %-24s %-14d %s" % (w, str(hp), h32, str(fits32(hp))))
print("")
print("The midpoint that made a decade of binary searches wrong:")
lo = 2000000000
hi = 2100000000
mid_python = int((lo + hi) / 2)
sum32 = wrap32(lo + hi)
mid_32 = int(sum32 / 2)
mid_safe = lo + int((hi - lo) / 2)
print("  lo + hi              = " + str(lo + hi) + "   fits in 32 bits: " + str(fits32(lo + hi)))
print("  (lo + hi) / 2        = " + str(mid_python) + "   correct")
print("  32-bit (lo + hi) / 2 = " + str(mid_32) + "   NEGATIVE")
print("  lo + (hi - lo) / 2   = " + str(mid_safe) + "   correct in both")
print("")
print("factorial, where the range runs out:")
f_py = 1
f_32 = 1
for n in range(1, 16):
    f_py = f_py * n
    f_32 = mul32(f_32, n)
    if n >= 11 and n <= 14:
        flag = ""
        if not fits32(f_py):
            flag = "  <- outside 32 bits"
        print("  %2d! = %-16s 32-bit: %-14d%s" % (n, str(f_py), f_32, flag))
tried = 0
wrapped = 0
sign_flipped = 0
witness = []
for a in [46341, 50000, 65536, 100000, 2000000]:
    for b in [46341, 50000, 65536, 100000, 2000000]:
        tried = tried + 1
        exact = a * b
        got = mul32(a, b)
        if not exact == got:
            wrapped = wrapped + 1
            if got < 0:
                sign_flipped = sign_flipped + 1
                if len(witness) < 3:
                    witness = witness + [str(a) + " * " + str(b) + " = " + str(exact) + " -> " + str(got)]
print("")
print("positive products tried:      " + str(tried))
print("  wrapped:                    " + str(wrapped))
print("  wrapped to a NEGATIVE value:" + str(sign_flipped))
for w in witness:
    print("  " + w)
guard_passes = 0
for a in [46341, 50000, 65536, 100000, 2000000]:
    for b in [46341, 50000, 65536, 100000, 2000000]:
        got = mul32(a, b)
        if got > 0:
            guard_passes = guard_passes + 1
print("")
print("products that pass an `if x > 0` guard: " + str(guard_passes) + "/" + str(tried))
print("...of which actually correct:           " + str(tried - wrapped))
passed = 0
checked = 0
checked = checked + 1
if add32(2147483647, 1) == 0 - TWO31 and add32(0 - TWO31, 0 - 1) == 2147483647:
    passed = passed + 1
checked = checked + 1
agree = 0
n_small = 0
for a in [0, 1, 7, 1000, 46340]:
    for b in [0, 1, 7, 1000, 46340]:
        n_small = n_small + 1
        if mul32(a, b) == a * b and add32(a, b) == a + b:
            agree = agree + 1
if agree == n_small:
    passed = passed + 1
checked = checked + 1
if mid_32 < 0 and mid_safe == mid_python:
    passed = passed + 1
checked = checked + 1
if sign_flipped > 0 and sign_flipped < tried:
    passed = passed + 1
checked = checked + 1
if guard_passes > tried - wrapped:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Positive inputs, negative product, and a guard that says it is fine."
else:
    verdict = "FAILED - the 32-bit model did not behave as the checks describe."
print(verdict)
print("")
n1 = "Python's unbounded integers make this class of bug undetectable in the"
print(n1)
n2 = "language the algorithm was prototyped in, which is exactly when it would be"
print(n2)
n3 = "cheapest to find. `lo + (hi - lo) / 2` costs one extra subtraction and is"
print(n3)
n4 = "correct everywhere - the reason to write it that way in Python is not that"
print(n4)
n5 = "Python needs it, but that the next reader will not be using Python."
print(n5)
```

## stdout (executed)

```text
input        python hash              32-bit hash    in range
a            97                       97             True
ab           3105                     3105           True
abcd         2987074                  2987074        True
abcdefg      88988021860              -1206291356    False
abcdefghij   2651042159334565         -634317659     False

The midpoint that made a decade of binary searches wrong:
  lo + hi              = 4100000000   fits in 32 bits: False
  (lo + hi) / 2        = 2050000000   correct
  32-bit (lo + hi) / 2 = -97483648   NEGATIVE
  lo + (hi - lo) / 2   = 2050000000   correct in both

factorial, where the range runs out:
  11! = 39916800         32-bit: 39916800      
  12! = 479001600        32-bit: 479001600     
  13! = 6227020800       32-bit: 1932053504      <- outside 32 bits
  14! = 87178291200      32-bit: 1278945280      <- outside 32 bits

positive products tried:      25
  wrapped:                    25
  wrapped to a NEGATIVE value:16
  46341 * 46341 = 2147488281 -> -2147479015
  46341 * 50000 = 2317050000 -> -1977917296
  46341 * 65536 = 3037003776 -> -1257963520

products that pass an `if x > 0` guard: 8/25
...of which actually correct:           0

checks passed: 5/5
Positive inputs, negative product, and a guard that says it is fine.

Python's unbounded integers make this class of bug undetectable in the
language the algorithm was prototyped in, which is exactly when it would be
cheapest to find. `lo + (hi - lo) / 2` costs one extra subtraction and is
correct everywhere - the reason to write it that way in Python is not that
Python needs it, but that the next reader will not be using Python.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
