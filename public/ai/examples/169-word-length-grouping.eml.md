<!-- canonical: efficientnewlanguage.org/ai/examples/169-word-length-grouping | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 169 — Grouping into lists, not counters

`word_length_grouping.eml` buckets words by length — the other half of the dict-as-accumulator pattern, where the values are lists that grow rather than numbers that increment.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Grouping items
# by a computed key is the other half of the dict-as-accumulator pattern: the
# values are LISTS that grow, rather than counters that increment.
#
# The detail worth seeing is that the group order and the within-group order
# come from two different places. Groups appear in the order their key was
# first needed; members appear in the order they were read. Both fall out of
# insertion order, and neither requires sorting anything.

def group_by_length(words):
    {} => groups
    for w in words:
        len(w) => k
        if k in groups:
            groups[k] + [w] => groups[k]
        else:
            [w] => groups[k]
    return groups

["fig", "apple", "kiwi", "plum", "cherry", "date", "pear", "banana"] => words
group_by_length(words) => groups

("Words: " + str(len(words)) + ", distinct lengths: " + str(len(groups)))^0
""^0

"length  count  members" => header
header^0
"------  -----  ------------------------------" => rule
rule^0
for k in groups:
    groups[k] => members
    "" => joined
    for w in members:
        if joined == "":
            w => joined
        else:
            joined + ", " + w => joined
    str(k) => shown
    8 - len(shown) => pad
    if pad < 1:
        1 => pad
    (shown + " " * pad + str(len(members)) + "      " + joined)^0

""^0
# Cross-check: every word landed in exactly one group.
[] => sizes
for k in groups:
    sizes + [len(groups[k])] => sizes
("Group sizes " + str(sizes) + " sum to " + str(sum(sizes)) + " of " + str(len(words)) + " words")^0
("Largest group has " + str(max(sizes)) + " members, smallest has " + str(min(sizes)))^0

""^0
"Group order is first-need order: 3 comes first because \"fig\" was read" => n1
n1^0
"first, and 6 comes last because no six-letter word appeared until \"cherry\"." => n2
n2^0
```

## Python (deterministic transpilation)

```python
def group_by_length(words):
    groups = {}
    for w in words:
        k = len(w)
        if k in groups:
            groups[k] = groups[k] + [w]
        else:
            groups[k] = [w]
    return groups

words = ["fig", "apple", "kiwi", "plum", "cherry", "date", "pear", "banana"]
groups = group_by_length(words)
print("Words: " + str(len(words)) + ", distinct lengths: " + str(len(groups)))
print("")
header = "length  count  members"
print(header)
rule = "------  -----  ------------------------------"
print(rule)
for k in groups:
    members = groups[k]
    joined = ""
    for w in members:
        if joined == "":
            joined = w
        else:
            joined = joined + ", " + w
    shown = str(k)
    pad = 8 - len(shown)
    if pad < 1:
        pad = 1
    print(shown + " " * pad + str(len(members)) + "      " + joined)
print("")
sizes = []
for k in groups:
    sizes = sizes + [len(groups[k])]
print("Group sizes " + str(sizes) + " sum to " + str(sum(sizes)) + " of " + str(len(words)) + " words")
print("Largest group has " + str(max(sizes)) + " members, smallest has " + str(min(sizes)))
print("")
n1 = "Group order is first-need order: 3 comes first because \"fig\" was read"
print(n1)
n2 = "first, and 6 comes last because no six-letter word appeared until \"cherry\"."
print(n2)
```

## stdout (executed)

```text
Words: 8, distinct lengths: 4

length  count  members
------  -----  ------------------------------
3       1      fig
5       1      apple
4       4      kiwi, plum, date, pear
6       2      cherry, banana

Group sizes [1, 1, 4, 2] sum to 8 of 8 words
Largest group has 4 members, smallest has 1

Group order is first-need order: 3 comes first because "fig" was read
first, and 6 comes last because no six-letter word appeared until "cherry".
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
