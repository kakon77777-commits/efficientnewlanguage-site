<!-- canonical: efficientnewlanguage.org/ai/examples/224-memo-key-collision | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 224 — The cache key that answers the wrong question

`memo_key_collision.eml` memoizes a two-argument function three ways and measures which of the three keys is a key at all.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Memoization, and
# the cache key that quietly answers the wrong question.
#
# Memoizing a two-argument function needs one key per argument PAIR. The
# obvious way to build one is to glue the arguments together:
#
#     key = str(a) + str(b)
#
# and it is wrong for a reason that never announces itself:
#
#     f(1, 23)  -> key "123"
#     f(12, 3)  -> key "123"     the SAME entry
#
# The second call is a cache hit. It returns the first call's answer, which is
# a perfectly ordinary number for a perfectly ordinary input. Nothing raises,
# nothing looks wrong, and the memoized function is now a different function
# from the one it was memoizing.
#
# The usual fix is a separator:
#
#     key = str(a) + "|" + str(b)
#
# which fixes integers and breaks the moment an argument is a string that
# contains the separator:
#
#     f("1", "2|3")  -> "1|2|3"
#     f("1|2", "3")  -> "1|2|3"     the SAME entry again
#
# A separator is a convention, not a boundary - the same lesson the run-length
# codec in this corpus learned. What actually works is a key that cannot be
# ambiguous by construction: prefix each part with its own length.
#
#     key = "2:12" + "1:3"     vs     "1:1" + "2:23"
#
# The property that decides whether a memo cache is a memo cache at all:
#
#     memoized(a, b) == plain(a, b)    for EVERY (a, b)
#
# checked over a full grid of argument pairs, not a handful. The result is
# stated up front: the naive key gets answers wrong, the separator key gets
# answers wrong on string arguments, and only the length-prefixed key agrees
# with the unmemoized function everywhere.

def plain(a, b):
    # The function being memoized. Deliberately asymmetric so that swapping
    # digits between the arguments produces a DIFFERENT answer - otherwise a
    # colliding key would return the right number by luck and the whole bug
    # would be invisible.
    return len(str(a)) * 1000 + int(str(a) + str(b)) % 997


def key_naive(a, b):
    return str(a) + str(b)

def key_separator(a, b):
    return str(a) + "|" + str(b)

def key_length_prefixed(a, b):
    str(a) => sa
    str(b) => sb
    return str(len(sa)) + ":" + sa + str(len(sb)) + ":" + sb


{} => cache_naive
{} => cache_sep
{} => cache_len

def memo_naive(a, b):
    key_naive(a, b) => k
    if k in cache_naive:
        return cache_naive[k]
    plain(a, b) => v
    v => cache_naive[k]
    return v

def memo_sep(a, b):
    key_separator(a, b) => k
    if k in cache_sep:
        return cache_sep[k]
    plain(a, b) => v
    v => cache_sep[k]
    return v

def memo_len(a, b):
    key_length_prefixed(a, b) => k
    if k in cache_len:
        return cache_len[k]
    plain(a, b) => v
    v => cache_len[k]
    return v


"The two calls that share a key:"^0
("  key_naive(1, 23)  = " + key_naive(1, 23))^0
("  key_naive(12, 3)  = " + key_naive(12, 3))^0
("  plain(1, 23)      = " + str(plain(1, 23)))^0
("  plain(12, 3)      = " + str(plain(12, 3)))^0
("  memo_naive(1, 23) = " + str(memo_naive(1, 23)))^0
("  memo_naive(12, 3) = " + str(memo_naive(12, 3)) + "   <- should be " + str(plain(12, 3)))^0

# --------------------------------------------------- exhaustive integer grid
# Every ordered pair from a set chosen so that concatenations overlap: 1..3
# are one digit, 11..33 are two, so a+b and b+a collide across the boundary.
[1, 2, 3, 11, 12, 23, 123, 1, 12] => left
[1, 2, 3, 11, 12, 23, 123] => right

0 => pairs
0 => naive_ok
0 => sep_ok
0 => len_ok
for a in left:
    for b in right:
        pairs + 1 => pairs
        plain(a, b) => truth
        if memo_naive(a, b) == truth:
            naive_ok + 1 => naive_ok
        if memo_sep(a, b) == truth:
            sep_ok + 1 => sep_ok
        if memo_len(a, b) == truth:
            len_ok + 1 => len_ok

""^0
("integer pairs checked:        " + str(pairs))^0
("  naive key agreed:           " + str(naive_ok) + "/" + str(pairs))^0
("  separator key agreed:       " + str(sep_ok) + "/" + str(pairs))^0
("  length-prefixed key agreed: " + str(len_ok) + "/" + str(pairs))^0

# ---------------------------------------------------- the separator's own bug
# The separator survives integers and dies on strings that contain it. A key
# scheme that is correct only for the argument types you happened to test is
# not a key scheme.
{} => cache_sep2
{} => cache_len2

def plain_s(a, b):
    return len(a) * 100 + len(b) * 10 + len(a + b)

def memo_sep_s(a, b):
    a + "|" + b => k
    if k in cache_sep2:
        return cache_sep2[k]
    plain_s(a, b) => v
    v => cache_sep2[k]
    return v

def memo_len_s(a, b):
    str(len(a)) + ":" + a + str(len(b)) + ":" + b => k
    if k in cache_len2:
        return cache_len2[k]
    plain_s(a, b) => v
    v => cache_len2[k]
    return v

["1", "1|2", "2|3", "3", "a", "a|b|c"] => words
0 => spairs
0 => sep_s_ok
0 => len_s_ok
for a in words:
    for b in words:
        spairs + 1 => spairs
        plain_s(a, b) => truth
        if memo_sep_s(a, b) == truth:
            sep_s_ok + 1 => sep_s_ok
        if memo_len_s(a, b) == truth:
            len_s_ok + 1 => len_s_ok

""^0
("string pairs checked:         " + str(spairs))^0
("  separator key agreed:       " + str(sep_s_ok) + "/" + str(spairs))^0
("  length-prefixed key agreed: " + str(len_s_ok) + "/" + str(spairs))^0

""^0
"The pair that breaks the separator:"^0
('  "1" + "|" + "2|3"  = ' + "1" + "|" + "2|3")^0
('  "1|2" + "|" + "3"  = ' + "1|2" + "|" + "3")^0
('  length-prefixed:     ' + str(len("1")) + ":1" + str(len("2|3")) + ":2|3" + "   and   " + str(len("1|2")) + ":1|2" + str(len("3")) + ":3")^0

# ------------------------------------------------------------------ checks
pairs - naive_ok => naive_wrong
spairs - sep_s_ok => sep_wrong

0 => passed
0 => checked

checked + 1 => checked
if len_ok == pairs and len_s_ok == spairs:
    passed + 1 => passed

checked + 1 => checked
if naive_wrong > 0:
    passed + 1 => passed

checked + 1 => checked
if sep_ok == pairs:
    passed + 1 => passed

checked + 1 => checked
if sep_wrong > 0:
    passed + 1 => passed

# A cache that never hits is trivially correct and useless. This is the check
# that stops the "fix" from being "disable the cache".
checked + 1 => checked
if len(cache_len) < pairs and len(cache_len) > 0:
    passed + 1 => passed

""^0
("wrong answers from the naive key:      " + str(naive_wrong) + "/" + str(pairs))^0
("wrong answers from the separator key:  " + str(sep_wrong) + "/" + str(spairs) + " (strings only)")^0
("distinct length-prefixed entries:      " + str(len(cache_len)) + " for " + str(pairs) + " calls")^0

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Only the length-prefixed key agrees with the unmemoized function everywhere." => verdict
else:
    "FAILED - a key scheme did not behave as the checks describe." => verdict
verdict^0

""^0
"A memo cache has no error state. When the key is wrong the second caller" => n1
n1^0
"receives the first caller's answer, which is a well-formed value of the" => n2
n2^0
"right type, and the function has quietly become a different function. The" => n3
n3^0
"separator is the instructive part: it is correct for every integer and" => n4
n4^0
"wrong for strings, so the type you tested with decides whether you ship it." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def plain(a, b):
    return len(str(a)) * 1000 + int(str(a) + str(b)) % 997

def key_naive(a, b):
    return str(a) + str(b)

def key_separator(a, b):
    return str(a) + "|" + str(b)

def key_length_prefixed(a, b):
    sa = str(a)
    sb = str(b)
    return str(len(sa)) + ":" + sa + str(len(sb)) + ":" + sb

cache_naive = {}
cache_sep = {}
cache_len = {}

def memo_naive(a, b):
    k = key_naive(a, b)
    if k in cache_naive:
        return cache_naive[k]
    v = plain(a, b)
    cache_naive[k] = v
    return v

def memo_sep(a, b):
    k = key_separator(a, b)
    if k in cache_sep:
        return cache_sep[k]
    v = plain(a, b)
    cache_sep[k] = v
    return v

def memo_len(a, b):
    k = key_length_prefixed(a, b)
    if k in cache_len:
        return cache_len[k]
    v = plain(a, b)
    cache_len[k] = v
    return v

print("The two calls that share a key:")
print("  key_naive(1, 23)  = " + key_naive(1, 23))
print("  key_naive(12, 3)  = " + key_naive(12, 3))
print("  plain(1, 23)      = " + str(plain(1, 23)))
print("  plain(12, 3)      = " + str(plain(12, 3)))
print("  memo_naive(1, 23) = " + str(memo_naive(1, 23)))
print("  memo_naive(12, 3) = " + str(memo_naive(12, 3)) + "   <- should be " + str(plain(12, 3)))
left = [1, 2, 3, 11, 12, 23, 123, 1, 12]
right = [1, 2, 3, 11, 12, 23, 123]
pairs = 0
naive_ok = 0
sep_ok = 0
len_ok = 0
for a in left:
    for b in right:
        pairs = pairs + 1
        truth = plain(a, b)
        if memo_naive(a, b) == truth:
            naive_ok = naive_ok + 1
        if memo_sep(a, b) == truth:
            sep_ok = sep_ok + 1
        if memo_len(a, b) == truth:
            len_ok = len_ok + 1
print("")
print("integer pairs checked:        " + str(pairs))
print("  naive key agreed:           " + str(naive_ok) + "/" + str(pairs))
print("  separator key agreed:       " + str(sep_ok) + "/" + str(pairs))
print("  length-prefixed key agreed: " + str(len_ok) + "/" + str(pairs))
cache_sep2 = {}
cache_len2 = {}

def plain_s(a, b):
    return len(a) * 100 + len(b) * 10 + len(a + b)

def memo_sep_s(a, b):
    k = a + "|" + b
    if k in cache_sep2:
        return cache_sep2[k]
    v = plain_s(a, b)
    cache_sep2[k] = v
    return v

def memo_len_s(a, b):
    k = str(len(a)) + ":" + a + str(len(b)) + ":" + b
    if k in cache_len2:
        return cache_len2[k]
    v = plain_s(a, b)
    cache_len2[k] = v
    return v

words = ["1", "1|2", "2|3", "3", "a", "a|b|c"]
spairs = 0
sep_s_ok = 0
len_s_ok = 0
for a in words:
    for b in words:
        spairs = spairs + 1
        truth = plain_s(a, b)
        if memo_sep_s(a, b) == truth:
            sep_s_ok = sep_s_ok + 1
        if memo_len_s(a, b) == truth:
            len_s_ok = len_s_ok + 1
print("")
print("string pairs checked:         " + str(spairs))
print("  separator key agreed:       " + str(sep_s_ok) + "/" + str(spairs))
print("  length-prefixed key agreed: " + str(len_s_ok) + "/" + str(spairs))
print("")
print("The pair that breaks the separator:")
print("  \"1\" + \"|\" + \"2|3\"  = " + "1" + "|" + "2|3")
print("  \"1|2\" + \"|\" + \"3\"  = " + "1|2" + "|" + "3")
print("  length-prefixed:     " + str(len("1")) + ":1" + str(len("2|3")) + ":2|3" + "   and   " + str(len("1|2")) + ":1|2" + str(len("3")) + ":3")
naive_wrong = pairs - naive_ok
sep_wrong = spairs - sep_s_ok
passed = 0
checked = 0
checked = checked + 1
if len_ok == pairs and len_s_ok == spairs:
    passed = passed + 1
checked = checked + 1
if naive_wrong > 0:
    passed = passed + 1
checked = checked + 1
if sep_ok == pairs:
    passed = passed + 1
checked = checked + 1
if sep_wrong > 0:
    passed = passed + 1
checked = checked + 1
if len(cache_len) < pairs and len(cache_len) > 0:
    passed = passed + 1
print("")
print("wrong answers from the naive key:      " + str(naive_wrong) + "/" + str(pairs))
print("wrong answers from the separator key:  " + str(sep_wrong) + "/" + str(spairs) + " (strings only)")
print("distinct length-prefixed entries:      " + str(len(cache_len)) + " for " + str(pairs) + " calls")
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Only the length-prefixed key agrees with the unmemoized function everywhere."
else:
    verdict = "FAILED - a key scheme did not behave as the checks describe."
print(verdict)
print("")
n1 = "A memo cache has no error state. When the key is wrong the second caller"
print(n1)
n2 = "receives the first caller's answer, which is a well-formed value of the"
print(n2)
n3 = "right type, and the function has quietly become a different function. The"
print(n3)
n4 = "separator is the instructive part: it is correct for every integer and"
print(n4)
n5 = "wrong for strings, so the type you tested with decides whether you ship it."
print(n5)
```

## stdout (executed)

```text
The two calls that share a key:
  key_naive(1, 23)  = 123
  key_naive(12, 3)  = 123
  plain(1, 23)      = 1123
  plain(12, 3)      = 2123
  memo_naive(1, 23) = 1123
  memo_naive(12, 3) = 1123   <- should be 2123

integer pairs checked:        63
  naive key agreed:           58/63
  separator key agreed:       63/63
  length-prefixed key agreed: 63/63

string pairs checked:         36
  separator key agreed:       35/36
  length-prefixed key agreed: 36/36

The pair that breaks the separator:
  "1" + "|" + "2|3"  = 1|2|3
  "1|2" + "|" + "3"  = 1|2|3
  length-prefixed:     1:13:2|3   and   3:1|21:3

wrong answers from the naive key:      5/63
wrong answers from the separator key:  1/36 (strings only)
distinct length-prefixed entries:      49 for 63 calls

checks passed: 5/5
Only the length-prefixed key agrees with the unmemoized function everywhere.

A memo cache has no error state. When the key is wrong the second caller
receives the first caller's answer, which is a well-formed value of the
right type, and the function has quietly become a different function. The
separator is the instructive part: it is correct for every integer and
wrong for strings, so the type you tested with decides whether you ship it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
