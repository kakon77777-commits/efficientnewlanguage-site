<!-- canonical: efficientnewlanguage.org/ai/examples/402-filed-under-the-first-category-that-matched | ai_layer_version: 0.1.0 | updated: 2026-08-16 -->

# Example 402 — Filed under the first category that matched - every count ranges from 1 to 6 on rule order alone

`filed_under_the_first_category_that_matched.eml` runs the same items under all six orderings of the same three rules.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The classifier is
# a list of rules checked in order. The order is not part of the taxonomy.
#
# Checking rules in order is how every classifier of this kind works, and it
# has to stop somewhere - an item gets one label because downstream wants one
# label. Each rule is correct about what it matches; none of them is wrong.
#
# What the order encodes is a precedence between categories that nobody wrote
# down, because it was never a decision - it is the sequence someone happened
# to type. Here every item is run under several orderings, so how much of the
# distribution is the data and how much is the sequence is measured.

# [item, matches security, matches performance, matches usability]
[["t1", 1, 1, 0], ["t2", 0, 1, 1], ["t3", 1, 0, 1], ["t4", 1, 1, 1], ["t5", 0, 1, 0], ["t6", 1, 0, 0], ["t7", 0, 0, 1], ["t8", 1, 1, 0], ["t9", 0, 1, 1], ["t10", 1, 0, 1]] => items

["security", "performance", "usability"] => names

def matches(it, cat):
    if cat == 0:
        return it[1]
    if cat == 1:
        return it[2]
    return it[3]

def classify(it, order):
    for c in order:
        if matches(it, c) == 1:
            return c
    return -1

def counts(order):
    [0, 0, 0] => c
    [] => out
    for n in names:
        out + [0] => out
    for it in items:
        classify(it, order) => k
        [] => nb
        0 => i
        for v in out:
            if i == k:
                nb + [v + 1] => nb
            else:
                nb + [v] => nb
            i + 1 => i
        nb => out
    return out

def show_counts(order):
    counts(order) => c
    "" => s
    0 => i
    for n in names:
        s + n + "=" + str(c[i]) + "  " => s
        i + 1 => i
    return s

"items : " + str(len(items)) ^0
0 => multi
for it in items:
    it[1] + it[2] + it[3] => m
    if m > 1:
        multi + 1 => multi
"  items matching more than one category : " + str(multi) ^0
"" ^0

"the same items under every ordering of the same three rules" ^0
"  security, performance, usability : " + show_counts([0, 1, 2]) ^0
"  security, usability, performance : " + show_counts([0, 2, 1]) ^0
"  performance, security, usability : " + show_counts([1, 0, 2]) ^0
"  performance, usability, security : " + show_counts([1, 2, 0]) ^0
"  usability, security, performance : " + show_counts([2, 0, 1]) ^0
"  usability, performance, security : " + show_counts([2, 1, 0]) ^0
"" ^0

# ---- the range each category's count can take ----

"the range of each count, across the six orderings" ^0
[[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]] => orders
0 => i
for n in names:
    99 => lo
    -1 => hi
    for o in orders:
        counts(o) => c
        if c[i] < lo:
            c[i] => lo
        if c[i] > hi:
            c[i] => hi
    "  " + n + " : " + str(lo) + " to " + str(hi) + "   (spread " + str(hi - lo) + ")" ^0
    i + 1 => i
"" ^0

# ---- which items move ----

"items whose label depends on the ordering" ^0
0 => movers
for it in items:
    classify(it, [0, 1, 2]) => a
    0 => moved
    for o in orders:
        if not (classify(it, o) == a):
            1 => moved
    if moved == 1:
        movers + 1 => movers
        "  " + it[0] ^0
"  count : " + str(movers) + " of " + str(len(items)) ^0
if movers == multi:
    "  exactly the items that match more than one rule" ^0
"" ^0

# ---- what a report built on one ordering can say ----

counts([0, 1, 2]) => first
counts([2, 1, 0]) => last
"the headline under two orderings" ^0
"  'our biggest category is security, at " + str(first[0]) + "'" ^0
"  'our biggest category is usability, at " + str(last[2]) + "'" ^0
"  same items, same rules, different sequence" ^0
"" ^0

# ---- the control: items that match at most one rule ----
#
# Order-dependence is not inherent to first-match classification. It appears
# exactly where the categories overlap, and vanishes where they do not.

[["s1", 1, 0, 0], ["s2", 0, 1, 0], ["s3", 0, 0, 1], ["s4", 1, 0, 0]] => clean
def classify_clean(it, order):
    for c in order:
        if c == 0:
            if it[1] == 1:
                return c
        elif c == 1:
            if it[2] == 1:
                return c
        else:
            if it[3] == 1:
                return c
    return -1
0 => clean_movers
for it in clean:
    classify_clean(it, [0, 1, 2]) => a
    for o in orders:
        if not (classify_clean(it, o) == a):
            clean_movers + 1 => clean_movers
"control - items matching at most one rule" ^0
"  items whose label depends on ordering : " + str(clean_movers) ^0
if clean_movers == 0:
    "  here the sequence carries nothing, and first-match is exact" ^0
"" ^0

"Each rule is right about what it matches. The distribution is a fact about" ^0
"the sequence they were typed in, and the sequence is not in the taxonomy." ^0
```

## Python (deterministic transpilation)

```python
items = [["t1", 1, 1, 0], ["t2", 0, 1, 1], ["t3", 1, 0, 1], ["t4", 1, 1, 1], ["t5", 0, 1, 0], ["t6", 1, 0, 0], ["t7", 0, 0, 1], ["t8", 1, 1, 0], ["t9", 0, 1, 1], ["t10", 1, 0, 1]]
names = ["security", "performance", "usability"]

def matches(it, cat):
    if cat == 0:
        return it[1]
    if cat == 1:
        return it[2]
    return it[3]

def classify(it, order):
    for c in order:
        if matches(it, c) == 1:
            return c
    return -1

def counts(order):
    c = [0, 0, 0]
    out = []
    for n in names:
        out = out + [0]
    for it in items:
        k = classify(it, order)
        nb = []
        i = 0
        for v in out:
            if i == k:
                nb = nb + [v + 1]
            else:
                nb = nb + [v]
            i = i + 1
        out = nb
    return out

def show_counts(order):
    c = counts(order)
    s = ""
    i = 0
    for n in names:
        s = s + n + "=" + str(c[i]) + "  "
        i = i + 1
    return s

print("items : " + str(len(items)))
multi = 0
for it in items:
    m = it[1] + it[2] + it[3]
    if m > 1:
        multi = multi + 1
print("  items matching more than one category : " + str(multi))
print("")
print("the same items under every ordering of the same three rules")
print("  security, performance, usability : " + show_counts([0, 1, 2]))
print("  security, usability, performance : " + show_counts([0, 2, 1]))
print("  performance, security, usability : " + show_counts([1, 0, 2]))
print("  performance, usability, security : " + show_counts([1, 2, 0]))
print("  usability, security, performance : " + show_counts([2, 0, 1]))
print("  usability, performance, security : " + show_counts([2, 1, 0]))
print("")
print("the range of each count, across the six orderings")
orders = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]]
i = 0
for n in names:
    lo = 99
    hi = -1
    for o in orders:
        c = counts(o)
        if c[i] < lo:
            lo = c[i]
        if c[i] > hi:
            hi = c[i]
    print("  " + n + " : " + str(lo) + " to " + str(hi) + "   (spread " + str(hi - lo) + ")")
    i = i + 1
print("")
print("items whose label depends on the ordering")
movers = 0
for it in items:
    a = classify(it, [0, 1, 2])
    moved = 0
    for o in orders:
        if not classify(it, o) == a:
            moved = 1
    if moved == 1:
        movers = movers + 1
        print("  " + it[0])
print("  count : " + str(movers) + " of " + str(len(items)))
if movers == multi:
    print("  exactly the items that match more than one rule")
print("")
first = counts([0, 1, 2])
last = counts([2, 1, 0])
print("the headline under two orderings")
print("  'our biggest category is security, at " + str(first[0]) + "'")
print("  'our biggest category is usability, at " + str(last[2]) + "'")
print("  same items, same rules, different sequence")
print("")
clean = [["s1", 1, 0, 0], ["s2", 0, 1, 0], ["s3", 0, 0, 1], ["s4", 1, 0, 0]]

def classify_clean(it, order):
    for c in order:
        if c == 0:
            if it[1] == 1:
                return c
        elif c == 1:
            if it[2] == 1:
                return c
        elif it[3] == 1:
            return c
    return -1

clean_movers = 0
for it in clean:
    a = classify_clean(it, [0, 1, 2])
    for o in orders:
        if not classify_clean(it, o) == a:
            clean_movers = clean_movers + 1
print("control - items matching at most one rule")
print("  items whose label depends on ordering : " + str(clean_movers))
if clean_movers == 0:
    print("  here the sequence carries nothing, and first-match is exact")
print("")
print("Each rule is right about what it matches. The distribution is a fact about")
print("the sequence they were typed in, and the sequence is not in the taxonomy.")
```

## stdout (executed)

```text
items : 10
  items matching more than one category : 7

the same items under every ordering of the same three rules
  security, performance, usability : security=6  performance=3  usability=1  
  security, usability, performance : security=6  performance=1  usability=3  
  performance, security, usability : security=3  performance=6  usability=1  
  performance, usability, security : security=1  performance=6  usability=3  
  usability, security, performance : security=3  performance=1  usability=6  
  usability, performance, security : security=1  performance=3  usability=6  

the range of each count, across the six orderings
  security : 1 to 6   (spread 5)
  performance : 1 to 6   (spread 5)
  usability : 1 to 6   (spread 5)

items whose label depends on the ordering
  t1
  t2
  t3
  t4
  t8
  t9
  t10
  count : 7 of 10
  exactly the items that match more than one rule

the headline under two orderings
  'our biggest category is security, at 6'
  'our biggest category is usability, at 6'
  same items, same rules, different sequence

control - items matching at most one rule
  items whose label depends on ordering : 0
  here the sequence carries nothing, and first-match is exact

Each rule is right about what it matches. The distribution is a fact about
the sequence they were typed in, and the sequence is not in the taxonomy.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
