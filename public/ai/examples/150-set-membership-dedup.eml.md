<!-- canonical: efficientnewlanguage.org/ai/examples/150-set-membership-dedup | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 150 — What a set is for, and what it costs

`set_membership_dedup.eml` covers set literals — used incidentally by the corpus, never examined — and the one thing they are unambiguously for: asking *have I seen this before* without scanning.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Set literals,
# which the corpus used only incidentally, and the one thing they are
# unambiguously for: asking "have I seen this before" without scanning.
#
# Two properties get checked rather than assumed:
#
#   membership ignores ORDER and COUNT - {1,2,2,3} and {3,2,1} are the same
#   set, which is exactly why a set is the right tool for dedup and exactly
#   why it is the wrong tool when you needed the order back
#
#   set keys collapse the same way dict keys do: 1, 1.0 and True are one
#   element, because they are equal and hash alike. That surprises people, and
#   it means a set of "IDs" that mixes ints and bools silently merges them.
#
# The dedup below therefore keeps a set for the seen-check AND a list for the
# order, which is the honest shape - a set alone would lose the sequence, and
# a list alone would make every check a scan. The final comparison against a
# quadratic scan-based dedup proves the two agree.

visits^+["ana", "raj", "ana", "kim", "raj", "ana", "lee", "kim", "ana"]
("visit log (" + str(len(visits)) + " entries): " + str(visits))^0
""^0

"First-seen order, set for the check + list for the order:" => h1
h1^0
{} => seen
[] => first_seen
for name in visits:
    if not name in seen:
        1 => seen[name]
        first_seen + [name] => first_seen
("  " + str(first_seen))^0
("  " + str(len(first_seen)) + " distinct visitors out of " + str(len(visits)) + " visits")^0

""^0
"Cross-checked against a scan-based dedup (no set at all):" => h2
h2^0
[] => by_scan
for name in visits:
    False => already
    for kept in by_scan:
        if kept == name:
            True => already
    if not already:
        by_scan + [name] => by_scan
("  " + str(by_scan))^0
if by_scan == first_seen:
    "  Identical. The set version is the same answer, without the inner loop." => v1
else:
    "  DIFFER - the set version lost or reordered something." => v1
v1^0

""^0
"Order and repetition do not affect a set:" => h3
h3^0
{1, 2, 2, 3} => a
{3, 2, 1} => b
("  {1, 2, 2, 3} has " + str(len(a)) + " elements")^0
("  {3, 2, 1}    has " + str(len(b)) + " elements")^0
("  equal as sets: " + str(a == b))^0
"  The duplicate 2 never existed as far as the set is concerned." => n3
n3^0

""^0
"Numeric keys collapse, exactly as dict keys do:" => h4
h4^0
{1, 1.0, True} => collapsed
("  {1, 1.0, True} -> " + str(len(collapsed)) + " element")^0
{0, False} => zeros
("  {0, False}     -> " + str(len(zeros)) + " element")^0
{1, 2} => small
("  1 in {1, 2}     -> " + str(1 in small))^0
("  1.0 in {1, 2}   -> " + str(1.0 in small))^0
("  True in {1, 2}  -> " + str(True in small))^0
"  A set of IDs that mixes ints and booleans silently merges them." => n4
n4^0

""^0
"What a set costs you:" => h5
h5^0
"  the order. first_seen above is a list precisely because the set could" => n5
n5^0
"  not have told us who arrived first." => n5b
n5b^0
```

## Python (deterministic transpilation)

```python
visits = ["ana", "raj", "ana", "kim", "raj", "ana", "lee", "kim", "ana"]
print("visit log (" + str(len(visits)) + " entries): " + str(visits))
print("")
h1 = "First-seen order, set for the check + list for the order:"
print(h1)
seen = {}
first_seen = []
for name in visits:
    if not name in seen:
        seen[name] = 1
        first_seen = first_seen + [name]
print("  " + str(first_seen))
print("  " + str(len(first_seen)) + " distinct visitors out of " + str(len(visits)) + " visits")
print("")
h2 = "Cross-checked against a scan-based dedup (no set at all):"
print(h2)
by_scan = []
for name in visits:
    already = False
    for kept in by_scan:
        if kept == name:
            already = True
    if not already:
        by_scan = by_scan + [name]
print("  " + str(by_scan))
if by_scan == first_seen:
    v1 = "  Identical. The set version is the same answer, without the inner loop."
else:
    v1 = "  DIFFER - the set version lost or reordered something."
print(v1)
print("")
h3 = "Order and repetition do not affect a set:"
print(h3)
a = {1, 2, 2, 3}
b = {3, 2, 1}
print("  {1, 2, 2, 3} has " + str(len(a)) + " elements")
print("  {3, 2, 1}    has " + str(len(b)) + " elements")
print("  equal as sets: " + str(a == b))
n3 = "  The duplicate 2 never existed as far as the set is concerned."
print(n3)
print("")
h4 = "Numeric keys collapse, exactly as dict keys do:"
print(h4)
collapsed = {1, 1.0, True}
print("  {1, 1.0, True} -> " + str(len(collapsed)) + " element")
zeros = {0, False}
print("  {0, False}     -> " + str(len(zeros)) + " element")
small = {1, 2}
print("  1 in {1, 2}     -> " + str(1 in small))
print("  1.0 in {1, 2}   -> " + str(1.0 in small))
print("  True in {1, 2}  -> " + str(True in small))
n4 = "  A set of IDs that mixes ints and booleans silently merges them."
print(n4)
print("")
h5 = "What a set costs you:"
print(h5)
n5 = "  the order. first_seen above is a list precisely because the set could"
print(n5)
n5b = "  not have told us who arrived first."
print(n5b)
```

## stdout (executed)

```text
visit log (9 entries): ['ana', 'raj', 'ana', 'kim', 'raj', 'ana', 'lee', 'kim', 'ana']

First-seen order, set for the check + list for the order:
  ['ana', 'raj', 'kim', 'lee']
  4 distinct visitors out of 9 visits

Cross-checked against a scan-based dedup (no set at all):
  ['ana', 'raj', 'kim', 'lee']
  Identical. The set version is the same answer, without the inner loop.

Order and repetition do not affect a set:
  {1, 2, 2, 3} has 3 elements
  {3, 2, 1}    has 3 elements
  equal as sets: True
  The duplicate 2 never existed as far as the set is concerned.

Numeric keys collapse, exactly as dict keys do:
  {1, 1.0, True} -> 1 element
  {0, False}     -> 1 element
  1 in {1, 2}     -> True
  1.0 in {1, 2}   -> True
  True in {1, 2}  -> True
  A set of IDs that mixes ints and booleans silently merges them.

What a set costs you:
  the order. first_seen above is a list precisely because the set could
  not have told us who arrived first.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
