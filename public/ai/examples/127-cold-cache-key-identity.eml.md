<!-- canonical: efficientnewlanguage.org/ai/examples/127-cold-cache-key-identity | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 127 — What counts as "the same arguments"

`cold_cache_key_identity.eml` measures which argument values share a `@cold` cache entry. The obvious guess — Python equality, so `1 == 1.0 == True` is one entry — is wrong, and wrong in a way that depends on **how many arguments the function takes**.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). What counts as
# "the same arguments" for a @cold cache.
#
# The obvious guess is Python equality: 1 == 1.0 == True, so all three should be
# one cache entry. The real answer is stranger, and this program measures it
# rather than asserting it:
#
#   with ONE argument   1 is its own entry; 1.0 and True SHARE a second one
#   with TWO arguments  all three are ONE entry
#
# The same function, the same three values, and how they group depends on how
# many arguments the function takes.
#
# The cause is in functools, which @cold compiles to. Its key builder has a fast
# path: a single argument whose type is exactly int or str becomes the key
# itself. So one_arg(1) is keyed by the bare int 1, while 1.0 (a float) and True
# (type bool, not int) both fall through to a tuple key - and those tuple keys
# compare equal to each other, so 1.0 and True collide while 1 sits apart. With
# two arguments the fast path never applies, all three build tuple keys, and
# (1, 0) == (1.0, 0) == (True, 0) - so everything collides.
#
# EML's interpreter reproduces this asymmetry exactly, which is the reason the
# case is in the corpus: an in-browser run and the transpiled Python agree on a
# behaviour that most people would predict wrongly.
#
# It did not, when this case was first written. The interpreter keyed its cache
# on a repr of the arguments, so True and 1.0 - which produce different text but
# are the same dict key - landed in different entries, and the in-browser run
# printed True where real Python printed 1.0. That is precisely the kind of
# detail an "approximate" interpreter gets quietly wrong and nobody notices, so
# it is now keyed the way Python keys a dict, fast path included. This case is
# what caught it and is what keeps it caught.
#
# The practical reading: do not rely on @cold treating numerically-equal
# arguments of different types as the same call. Normalise types at the boundary
# if it matters.

@cold
def one_arg(x):
    ("    [computing one_arg(" + str(x) + ")]")^0
    return x

@cold
def two_args(x, y):
    ("    [computing two_args(" + str(x) + ", " + str(y) + ")]")^0
    return x

"One argument - 1, 1.0, True:" => h1
h1^0
("  one_arg(1)    -> " + str(one_arg(1)))^0
("  one_arg(1.0)  -> " + str(one_arg(1.0)))^0
("  one_arg(True) -> " + str(one_arg(True)))^0

""^0
"Two arguments - (1, 0), (1.0, 0), (True, 0):" => h2
h2^0
("  two_args(1, 0)    -> " + str(two_args(1, 0)))^0
("  two_args(1.0, 0)  -> " + str(two_args(1.0, 0)))^0
("  two_args(True, 0) -> " + str(two_args(True, 0)))^0

""^0
"Read the [computing] lines: two in the first block, one in the second." => n1
n1^0
"Block 1 grouped the three values as {1} and {1.0, True} - note that True" => n2
n2^0
"was served from the 1.0 entry, which is why it printed 1.0 and not True." => n3
n3^0
"Block 2 grouped all three together, so only (1, 0) was ever computed." => n4
n4^0

""^0
"Same values, same equality between them, different grouping - decided by" => n5
n5^0
"nothing but the number of arguments." => n6
n6^0
```

## Python (deterministic transpilation)

```python
import functools

@functools.cache
def one_arg(x):
    print("    [computing one_arg(" + str(x) + ")]")
    return x

@functools.cache
def two_args(x, y):
    print("    [computing two_args(" + str(x) + ", " + str(y) + ")]")
    return x

h1 = "One argument - 1, 1.0, True:"
print(h1)
print("  one_arg(1)    -> " + str(one_arg(1)))
print("  one_arg(1.0)  -> " + str(one_arg(1.0)))
print("  one_arg(True) -> " + str(one_arg(True)))
print("")
h2 = "Two arguments - (1, 0), (1.0, 0), (True, 0):"
print(h2)
print("  two_args(1, 0)    -> " + str(two_args(1, 0)))
print("  two_args(1.0, 0)  -> " + str(two_args(1.0, 0)))
print("  two_args(True, 0) -> " + str(two_args(True, 0)))
print("")
n1 = "Read the [computing] lines: two in the first block, one in the second."
print(n1)
n2 = "Block 1 grouped the three values as {1} and {1.0, True} - note that True"
print(n2)
n3 = "was served from the 1.0 entry, which is why it printed 1.0 and not True."
print(n3)
n4 = "Block 2 grouped all three together, so only (1, 0) was ever computed."
print(n4)
print("")
n5 = "Same values, same equality between them, different grouping - decided by"
print(n5)
n6 = "nothing but the number of arguments."
print(n6)
```

## stdout (executed)

```text
One argument - 1, 1.0, True:
    [computing one_arg(1)]
  one_arg(1)    -> 1
    [computing one_arg(1.0)]
  one_arg(1.0)  -> 1.0
  one_arg(True) -> 1.0

Two arguments - (1, 0), (1.0, 0), (True, 0):
    [computing two_args(1, 0)]
  two_args(1, 0)    -> 1
  two_args(1.0, 0)  -> 1
  two_args(True, 0) -> 1

Read the [computing] lines: two in the first block, one in the second.
Block 1 grouped the three values as {1} and {1.0, True} - note that True
was served from the 1.0 entry, which is why it printed 1.0 and not True.
Block 2 grouped all three together, so only (1, 0) was ever computed.

Same values, same equality between them, different grouping - decided by
nothing but the number of arguments.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:cache:miss · eml:return · eml:cache:hit · eml:run:done
