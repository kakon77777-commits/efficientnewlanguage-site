<!-- canonical: efficientnewlanguage.org/ai/examples/363-the-checker-inherits-the-builders-vocabulary | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 363 — The checker inherits the builder's vocabulary — 6 of 6 named, 0 of 6 unnamed

`the_checker_inherits_the_builders_vocabulary.eml` measures a doc-led search's recall, split by whether the defect's class has a name in the docs.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The checker read
# the documentation first, which is the right thing to do and costs something.
#
# Reading the builder's docs is how a new checker becomes useful in a day
# instead of a month. It also hands them the builder's list of concepts, and a
# search organised by a list of concepts cannot reach a defect whose class is
# not on the list.
#
# The docs are not wrong. They name every concept the builder has a word for.
# That is exactly the set of concepts the builder was already thinking about
# while writing the code.
#
# Nothing is declared. Each searcher is a rule over a defect's class, and the
# recall on named and unnamed classes is computed separately.

# [id, class]
[["d1", "parsing"], ["d2", "parsing"], ["d3", "rounding"], ["d4", "rounding"], ["d5", "caching"], ["d6", "ordering"], ["d7", "ordering"], ["d8", "aliasing"], ["d9", "aliasing"], ["d10", "encoding"], ["d11", "caching"], ["d12", "encoding"]] => defects

# the concepts the documentation has words for
["parsing", "rounding", "caching"] => documented

# a doc-led checker searches concept by concept
def doc_led_finds(d):
    for c in documented:
        if d[1] == c:
            return 1
    return 0

# a shape-led checker searches by input shape and reaches whatever those
# inputs happen to touch
["parsing", "encoding", "ordering"] => reached_by_shapes
def shape_led_finds(d):
    for c in reached_by_shapes:
        if d[1] == c:
            return 1
    return 0

def classes_present():
    [] => cs
    for d in defects:
        if not (d[1] in cs):
            cs + [d[1]] => cs
    return cs

classes_present() => all_classes

# ---- the vocabulary gap ----

"defect classes present in the system : " + str(len(all_classes)) ^0
"classes the documentation names       : " + str(len(documented)) ^0
[] => unnamed
for c in all_classes:
    if not (c in documented):
        unnamed + [c] => unnamed
"classes with no word in the docs      : " + str(len(unnamed)) + "  " + repr(unnamed) ^0
"" ^0

# ---- recall, split by whether the class has a name ----

0 => named_total
0 => named_found
0 => unnamed_total
0 => unnamed_found
for d in defects:
    0 => is_named
    for c in documented:
        if d[1] == c:
            1 => is_named
    if is_named == 1:
        named_total + 1 => named_total
        if doc_led_finds(d) == 1:
            named_found + 1 => named_found
    else:
        unnamed_total + 1 => unnamed_total
        if doc_led_finds(d) == 1:
            unnamed_found + 1 => unnamed_found
"the doc-led checker" ^0
"  defects in documented classes : " + str(named_found) + " of " + str(named_total) ^0
"  defects in undocumented classes : " + str(unnamed_found) + " of " + str(unnamed_total) ^0
"  overall : " + str(named_found + unnamed_found) + " of " + str(len(defects)) ^0
"" ^0

# ---- the same overall number, a different shape ----

0 => shape_found
for d in defects:
    if shape_led_finds(d) == 1:
        shape_found + 1 => shape_found
"the shape-led checker" ^0
"  overall : " + str(shape_found) + " of " + str(len(defects)) ^0
"" ^0

# ---- what each reaches that the other does not ----

0 => doc_only
0 => shape_only
0 => both_reach
0 => neither_reach
for d in defects:
    doc_led_finds(d) => a
    shape_led_finds(d) => b
    if a == 1:
        if b == 1:
            both_reach + 1 => both_reach
        else:
            doc_only + 1 => doc_only
    else:
        if b == 1:
            shape_only + 1 => shape_only
        else:
            neither_reach + 1 => neither_reach
"  reached by both        : " + str(both_reach) ^0
"  doc-led only           : " + str(doc_only) ^0
"  shape-led only         : " + str(shape_only) ^0
"  reached by neither     : " + str(neither_reach) ^0
"" ^0

# ---- a second doc-led checker ----

# A distinct searcher, with its own rule, who happens to have read the same
# docs. Comparing a function against itself would print 0 no matter what the
# code did, so the second checker is a separate rule.
def doc_led_2_finds(d):
    for c in documented:
        if d[1] == c:
            return 1
    return 0

0 => second_doc_new
for d in defects:
    if doc_led_2_finds(d) == 1:
        if doc_led_finds(d) == 0:
            second_doc_new + 1 => second_doc_new
"a second checker who also read the docs adds : " + str(second_doc_new) ^0
"a checker who searched by shape added        : " + str(shape_only) ^0
"" ^0

# ---- the class that neither vocabulary contains ----

"classes no searcher reached" ^0
[] => unreached
for d in defects:
    if doc_led_finds(d) == 0:
        if shape_led_finds(d) == 0:
            if not (d[1] in unreached):
                unreached + [d[1]] => unreached
"  " + repr(unreached) ^0
0 => in_docs
for c in unreached:
    if c in documented:
        in_docs + 1 => in_docs
"  of those, named in the docs : " + str(in_docs) ^0
"" ^0

"Handing a new checker the documentation is the fastest way to make them" ^0
"useful and the fastest way to give them the builder's blind spots. Both" ^0
"happen in the same afternoon and only one of them is visible." ^0
```

## Python (deterministic transpilation)

```python
defects = [["d1", "parsing"], ["d2", "parsing"], ["d3", "rounding"], ["d4", "rounding"], ["d5", "caching"], ["d6", "ordering"], ["d7", "ordering"], ["d8", "aliasing"], ["d9", "aliasing"], ["d10", "encoding"], ["d11", "caching"], ["d12", "encoding"]]
documented = ["parsing", "rounding", "caching"]

def doc_led_finds(d):
    for c in documented:
        if d[1] == c:
            return 1
    return 0

reached_by_shapes = ["parsing", "encoding", "ordering"]

def shape_led_finds(d):
    for c in reached_by_shapes:
        if d[1] == c:
            return 1
    return 0

def classes_present():
    cs = []
    for d in defects:
        if not d[1] in cs:
            cs = cs + [d[1]]
    return cs

all_classes = classes_present()
print("defect classes present in the system : " + str(len(all_classes)))
print("classes the documentation names       : " + str(len(documented)))
unnamed = []
for c in all_classes:
    if not c in documented:
        unnamed = unnamed + [c]
print("classes with no word in the docs      : " + str(len(unnamed)) + "  " + repr(unnamed))
print("")
named_total = 0
named_found = 0
unnamed_total = 0
unnamed_found = 0
for d in defects:
    is_named = 0
    for c in documented:
        if d[1] == c:
            is_named = 1
    if is_named == 1:
        named_total = named_total + 1
        if doc_led_finds(d) == 1:
            named_found = named_found + 1
    else:
        unnamed_total = unnamed_total + 1
        if doc_led_finds(d) == 1:
            unnamed_found = unnamed_found + 1
print("the doc-led checker")
print("  defects in documented classes : " + str(named_found) + " of " + str(named_total))
print("  defects in undocumented classes : " + str(unnamed_found) + " of " + str(unnamed_total))
print("  overall : " + str(named_found + unnamed_found) + " of " + str(len(defects)))
print("")
shape_found = 0
for d in defects:
    if shape_led_finds(d) == 1:
        shape_found = shape_found + 1
print("the shape-led checker")
print("  overall : " + str(shape_found) + " of " + str(len(defects)))
print("")
doc_only = 0
shape_only = 0
both_reach = 0
neither_reach = 0
for d in defects:
    a = doc_led_finds(d)
    b = shape_led_finds(d)
    if a == 1:
        if b == 1:
            both_reach = both_reach + 1
        else:
            doc_only = doc_only + 1
    elif b == 1:
        shape_only = shape_only + 1
    else:
        neither_reach = neither_reach + 1
print("  reached by both        : " + str(both_reach))
print("  doc-led only           : " + str(doc_only))
print("  shape-led only         : " + str(shape_only))
print("  reached by neither     : " + str(neither_reach))
print("")

def doc_led_2_finds(d):
    for c in documented:
        if d[1] == c:
            return 1
    return 0

second_doc_new = 0
for d in defects:
    if doc_led_2_finds(d) == 1:
        if doc_led_finds(d) == 0:
            second_doc_new = second_doc_new + 1
print("a second checker who also read the docs adds : " + str(second_doc_new))
print("a checker who searched by shape added        : " + str(shape_only))
print("")
print("classes no searcher reached")
unreached = []
for d in defects:
    if doc_led_finds(d) == 0:
        if shape_led_finds(d) == 0:
            if not d[1] in unreached:
                unreached = unreached + [d[1]]
print("  " + repr(unreached))
in_docs = 0
for c in unreached:
    if c in documented:
        in_docs = in_docs + 1
print("  of those, named in the docs : " + str(in_docs))
print("")
print("Handing a new checker the documentation is the fastest way to make them")
print("useful and the fastest way to give them the builder's blind spots. Both")
print("happen in the same afternoon and only one of them is visible.")
```

## stdout (executed)

```text
defect classes present in the system : 6
classes the documentation names       : 3
classes with no word in the docs      : 3  ['ordering', 'aliasing', 'encoding']

the doc-led checker
  defects in documented classes : 6 of 6
  defects in undocumented classes : 0 of 6
  overall : 6 of 12

the shape-led checker
  overall : 6 of 12

  reached by both        : 2
  doc-led only           : 4
  shape-led only         : 4
  reached by neither     : 2

a second checker who also read the docs adds : 0
a checker who searched by shape added        : 4

classes no searcher reached
  ['aliasing']
  of those, named in the docs : 0

Handing a new checker the documentation is the fastest way to make them
useful and the fastest way to give them the builder's blind spots. Both
happen in the same afternoon and only one of them is visible.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
