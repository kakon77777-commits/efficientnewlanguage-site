<!-- canonical: efficientnewlanguage.org/ai/examples/081-binary-search-tree | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 081 — Binary search tree

`binary_search_tree.eml` inserts `[50, 30, 70, 20, 40, 60, 80, 35]` into a BST, then walks it in-order to recover `[20, 30, 35, 40, 50, 60, 70, 80]` — the tree's defining property, demonstrated rather than asserted.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Builds a
# binary search tree by insertion, then recovers the values in sorted order
# via recursive in-order traversal — the corpus's first tree structure.
#
# The tree is three parallel lists indexed by node number (`values`,
# `lefts`, `rights`, with -1 meaning "no child") rather than linked node
# objects. That keeps every write a single-level subscript assignment
# (`new_index => lefts[current]`), which is the shape EML's assignment
# targets model directly.

def in_order(values, lefts, rights, node, out):
    if node == -1:
        return out
    in_order(values, lefts, rights, lefts[node], out) => out
    out + [values[node]] => out
    in_order(values, lefts, rights, rights[node], out) => out
    return out

values^+[]
lefts^+[]
rights^+[]

items^+[50, 30, 70, 20, 40, 60, 80, 35]

for item in items:
    len(values) => new_index
    values + [item] => values
    lefts + [-1] => lefts
    rights + [-1] => rights
    if new_index > 0:
        0 => current
        1 => searching
        while searching == 1:
            if item < values[current]:
                if lefts[current] == -1:
                    new_index => lefts[current]
                    0 => searching
                else:
                    lefts[current] => current
            else:
                if rights[current] == -1:
                    new_index => rights[current]
                    0 => searching
                else:
                    rights[current] => current

in_order(values, lefts, rights, 0, []) => sorted_values

"Inserted:  " + str(items) => msg1
msg1^0
"In-order:  " + str(sorted_values) => msg2
msg2^0
"Root " + str(values[0]) + ", left child " + str(values[lefts[0]]) + ", right child " + str(values[rights[0]]) => msg3
msg3^0
```

## Python (deterministic transpilation)

```python
def in_order(values, lefts, rights, node, out):
    if node == -1:
        return out
    out = in_order(values, lefts, rights, lefts[node], out)
    out = out + [values[node]]
    out = in_order(values, lefts, rights, rights[node], out)
    return out

values = []
lefts = []
rights = []
items = [50, 30, 70, 20, 40, 60, 80, 35]
for item in items:
    new_index = len(values)
    values = values + [item]
    lefts = lefts + [-1]
    rights = rights + [-1]
    if new_index > 0:
        current = 0
        searching = 1
        while searching == 1:
            if item < values[current]:
                if lefts[current] == -1:
                    lefts[current] = new_index
                    searching = 0
                else:
                    current = lefts[current]
            elif rights[current] == -1:
                rights[current] = new_index
                searching = 0
            else:
                current = rights[current]
sorted_values = in_order(values, lefts, rights, 0, [])
msg1 = "Inserted:  " + str(items)
print(msg1)
msg2 = "In-order:  " + str(sorted_values)
print(msg2)
msg3 = "Root " + str(values[0]) + ", left child " + str(values[lefts[0]]) + ", right child " + str(values[rights[0]])
print(msg3)
```

## stdout (executed)

```text
Inserted:  [50, 30, 70, 20, 40, 60, 80, 35]
In-order:  [20, 30, 35, 40, 50, 60, 70, 80]
Root 50, left child 30, right child 70
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
