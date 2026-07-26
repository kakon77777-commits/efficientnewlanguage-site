<!-- canonical: efficientnewlanguage.org/ai/examples/101-linked-list-operations | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 101 — Linked list operations

`linked_list_operations.eml` builds a four-node singly linked list, prints it, reverses it in place, and prints it again — showing the internal link array before and after.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A singly
# linked list built from two parallel lists — `values` holds the payloads,
# `nexts` holds the index of each node's successor (-1 for "end of list")
# — plus a `head` index. The same index-as-pointer representation as
# examples/binary-search-tree/, one link per node instead of two.
#
# The point of the case is `reverse_list`: the classic three-pointer walk
# that re-aims every link backwards in a single pass, without allocating
# anything. It mutates `nexts` in place and returns only the NEW head,
# because that is the one thing the caller cannot recompute for itself.
#
# `append_node` has to return all three of values/nexts/head, because
# growing the two lists rebinds them rather than mutating in place.

def to_list(values, nexts, head):
    out^+[]
    head => current
    while current != -1:
        out + [values[current]] => out
        nexts[current] => current
    return out

def append_node(values, nexts, head, value):
    len(values) => new_index
    values + [value] => values
    nexts + [-1] => nexts
    if head == -1:
        return [values, nexts, new_index]
    head => current
    while nexts[current] != -1:
        nexts[current] => current
    new_index => nexts[current]
    return [values, nexts, head]

def reverse_list(nexts, head):
    -1 => previous
    head => current
    while current != -1:
        nexts[current] => following
        previous => nexts[current]
        current => previous
        following => current
    return previous

values^+[]
nexts^+[]
-1 => head

for word in ["alpha", "beta", "gamma", "delta"]:
    append_node(values, nexts, head, word) => state
    state[0] => values
    state[1] => nexts
    state[2] => head

"Built:    " + str(to_list(values, nexts, head)) => msg1
msg1^0
"head index " + str(head) + ", nexts " + str(nexts) => msg2
msg2^0

reverse_list(nexts, head) => head

"Reversed: " + str(to_list(values, nexts, head)) => msg3
msg3^0
"head index " + str(head) + ", nexts " + str(nexts) => msg4
msg4^0
"values untouched: " + str(values) => msg5
msg5^0
```

## Python (deterministic transpilation)

```python
def to_list(values, nexts, head):
    out = []
    current = head
    while current != -1:
        out = out + [values[current]]
        current = nexts[current]
    return out

def append_node(values, nexts, head, value):
    new_index = len(values)
    values = values + [value]
    nexts = nexts + [-1]
    if head == -1:
        return [values, nexts, new_index]
    current = head
    while nexts[current] != -1:
        current = nexts[current]
    nexts[current] = new_index
    return [values, nexts, head]

def reverse_list(nexts, head):
    previous = -1
    current = head
    while current != -1:
        following = nexts[current]
        nexts[current] = previous
        previous = current
        current = following
    return previous

values = []
nexts = []
head = -1
for word in ["alpha", "beta", "gamma", "delta"]:
    state = append_node(values, nexts, head, word)
    values = state[0]
    nexts = state[1]
    head = state[2]
msg1 = "Built:    " + str(to_list(values, nexts, head))
print(msg1)
msg2 = "head index " + str(head) + ", nexts " + str(nexts)
print(msg2)
head = reverse_list(nexts, head)
msg3 = "Reversed: " + str(to_list(values, nexts, head))
print(msg3)
msg4 = "head index " + str(head) + ", nexts " + str(nexts)
print(msg4)
msg5 = "values untouched: " + str(values)
print(msg5)
```

## stdout (executed)

```text
Built:    ['alpha', 'beta', 'gamma', 'delta']
head index 0, nexts [1, 2, 3, -1]
Reversed: ['delta', 'gamma', 'beta', 'alpha']
head index 3, nexts [-1, 0, 1, 2]
values untouched: ['alpha', 'beta', 'gamma', 'delta']
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
