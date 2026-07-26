<!-- canonical: efficientnewlanguage.org/ai/examples/095-bin-packing-first-fit | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 095 — Bin packing (first-fit)

`bin_packing_first_fit.eml` packs seven items into bins of capacity 10 by dropping each item into the first bin it still fits in, printing the resulting contents of every bin.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). First-fit
# bin packing: walk the items in order and drop each one into the first
# bin it still fits in, opening a new bin only when none has room.
#
# The sample is chosen to make the greedy strategy visibly FAIL to be
# optimal. Seven items totalling 30 units into bins of capacity 10 need at
# least 3 bins, and 3 is genuinely achievable — {8,2}, {7,3}, {5,4,1} all
# fill a bin exactly. First-fit uses 4, because early items settle into
# bins in a way that strands capacity the later large items cannot use.
#
# Same lesson as examples/coin-change-dp/, from the opposite direction:
# there the DP found what greedy missed, here nothing corrects the greedy
# choice at all — it is simply reported honestly, which is what a packing
# heuristic actually does in practice.

def first_fit(sizes, capacity):
    remaining^+[]
    assignment^+[]
    for size in sizes:
        0 - 1 => chosen
        0 => b
        while b < len(remaining):
            if remaining[b] >= size:
                b => chosen
                break
            b + 1 => b
        if chosen < 0:
            len(remaining) => chosen
            remaining + [capacity] => remaining
        remaining[chosen] - size => remaining[chosen]
        assignment + [chosen] => assignment
    return [remaining, assignment]

sizes^+[2, 5, 4, 7, 1, 3, 8]
10 => capacity

first_fit(sizes, capacity) => result
result[0] => remaining
result[1] => assignment

0 => total
for size in sizes:
    total + size => total

"Items:    " + str(sizes) => msg1
msg1^0
"Capacity: " + str(capacity) + " per bin, " + str(total) + " units total" => msg2
msg2^0

0 => b
while b < len(remaining):
    contents^+[]
    0 => i
    while i < len(sizes):
        if assignment[i] == b:
            contents + [sizes[i]] => contents
        i + 1 => i
    "  bin " + str(b) + ": " + str(contents) + " (" + str(remaining[b]) + " unused)" => line
    line^0
    b + 1 => b

"First-fit used " + str(len(remaining)) + " bins" => msg3
msg3^0
int((total + capacity - 1) / capacity) => lower_bound
"Lower bound is " + str(lower_bound) + " bins, and 3 is actually achievable: {8,2}, {7,3}, {5,4,1}" => msg4
msg4^0
```

## Python (deterministic transpilation)

```python
def first_fit(sizes, capacity):
    remaining = []
    assignment = []
    for size in sizes:
        chosen = 0 - 1
        b = 0
        while b < len(remaining):
            if remaining[b] >= size:
                chosen = b
                break
            b = b + 1
        if chosen < 0:
            chosen = len(remaining)
            remaining = remaining + [capacity]
        remaining[chosen] = remaining[chosen] - size
        assignment = assignment + [chosen]
    return [remaining, assignment]

sizes = [2, 5, 4, 7, 1, 3, 8]
capacity = 10
result = first_fit(sizes, capacity)
remaining = result[0]
assignment = result[1]
total = 0
for size in sizes:
    total = total + size
msg1 = "Items:    " + str(sizes)
print(msg1)
msg2 = "Capacity: " + str(capacity) + " per bin, " + str(total) + " units total"
print(msg2)
b = 0
while b < len(remaining):
    contents = []
    i = 0
    while i < len(sizes):
        if assignment[i] == b:
            contents = contents + [sizes[i]]
        i = i + 1
    line = "  bin " + str(b) + ": " + str(contents) + " (" + str(remaining[b]) + " unused)"
    print(line)
    b = b + 1
msg3 = "First-fit used " + str(len(remaining)) + " bins"
print(msg3)
lower_bound = int((total + capacity - 1) / capacity)
msg4 = "Lower bound is " + str(lower_bound) + " bins, and 3 is actually achievable: {8,2}, {7,3}, {5,4,1}"
print(msg4)
```

## stdout (executed)

```text
Items:    [2, 5, 4, 7, 1, 3, 8]
Capacity: 10 per bin, 30 units total
  bin 0: [2, 5, 1] (2 unused)
  bin 1: [4, 3] (3 unused)
  bin 2: [7] (3 unused)
  bin 3: [8] (2 unused)
First-fit used 4 bins
Lower bound is 3 bins, and 3 is actually achievable: {8,2}, {7,3}, {5,4,1}
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
