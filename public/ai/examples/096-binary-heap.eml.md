<!-- canonical: efficientnewlanguage.org/ai/examples/096-binary-heap | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 096 — Binary heap (min-heap priority queue)

`binary_heap.eml` pushes `[5, 3, 8, 1, 9, 2, 7]` into a min-heap one at a time (printing the array after each push, so the heap property is visible) then drains it, recovering `[1, 2, 3, 5, 7, 8, 9]`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A binary
# min-heap used as a priority queue: push sifts the new value UP toward the
# root while it beats its parent, pop takes the root and sifts the last
# element back DOWN. The corpus's first heap — and its first structure
# where the tree is implicit: there are no child pointers at all, a node at
# index i simply has children at 2i+1 and 2i+2, which is what
# examples/binary-search-tree/ needs two explicit index lists to express.
#
# `heap_pop` returns [value, heap] because it must hand back two things:
# the extracted minimum and the shrunken heap (shrinking rebuilds the list
# by slice, which rebinds rather than mutating in place).

def heap_push(heap, value):
    heap + [value] => heap
    len(heap) - 1 => child
    while child > 0:
        int((child - 1) / 2) => parent
        if heap[child] < heap[parent]:
            heap[child] => tmp
            heap[parent] => heap[child]
            tmp => heap[parent]
            parent => child
        else:
            break
    return heap

def heap_pop(heap):
    len(heap) => n
    heap[0] => smallest
    heap[n - 1] => moved
    heap[0:n - 1] => heap
    len(heap) => m
    if m > 0:
        moved => heap[0]
        0 => parent
        1 => sinking
        while sinking == 1:
            parent * 2 + 1 => left
            parent * 2 + 2 => right
            parent => target
            if left < m and heap[left] < heap[target]:
                left => target
            if right < m and heap[right] < heap[target]:
                right => target
            if target == parent:
                0 => sinking
            else:
                heap[parent] => tmp
                heap[target] => heap[parent]
                tmp => heap[target]
                target => parent
    return [smallest, heap]

heap^+[]
inputs^+[5, 3, 8, 1, 9, 2, 7]

for value in inputs:
    heap_push(heap, value) => heap
    "push " + str(value) + " -> " + str(heap) => line
    line^0

drained^+[]
while len(heap) > 0:
    heap_pop(heap) => result
    result[0] => smallest
    result[1] => heap
    drained + [smallest] => drained

"Pushed:  " + str(inputs) => msg1
msg1^0
"Popped:  " + str(drained) => msg2
msg2^0
```

## Python (deterministic transpilation)

```python
def heap_push(heap, value):
    heap = heap + [value]
    child = len(heap) - 1
    while child > 0:
        parent = int((child - 1) / 2)
        if heap[child] < heap[parent]:
            tmp = heap[child]
            heap[child] = heap[parent]
            heap[parent] = tmp
            child = parent
        else:
            break
    return heap

def heap_pop(heap):
    n = len(heap)
    smallest = heap[0]
    moved = heap[n - 1]
    heap = heap[0:n - 1]
    m = len(heap)
    if m > 0:
        heap[0] = moved
        parent = 0
        sinking = 1
        while sinking == 1:
            left = parent * 2 + 1
            right = parent * 2 + 2
            target = parent
            if left < m and heap[left] < heap[target]:
                target = left
            if right < m and heap[right] < heap[target]:
                target = right
            if target == parent:
                sinking = 0
            else:
                tmp = heap[parent]
                heap[parent] = heap[target]
                heap[target] = tmp
                parent = target
    return [smallest, heap]

heap = []
inputs = [5, 3, 8, 1, 9, 2, 7]
for value in inputs:
    heap = heap_push(heap, value)
    line = "push " + str(value) + " -> " + str(heap)
    print(line)
drained = []
while len(heap) > 0:
    result = heap_pop(heap)
    smallest = result[0]
    heap = result[1]
    drained = drained + [smallest]
msg1 = "Pushed:  " + str(inputs)
print(msg1)
msg2 = "Popped:  " + str(drained)
print(msg2)
```

## stdout (executed)

```text
push 5 -> [5]
push 3 -> [3, 5]
push 8 -> [3, 5, 8]
push 1 -> [1, 3, 8, 5]
push 9 -> [1, 3, 8, 5, 9]
push 2 -> [1, 3, 2, 5, 9, 8]
push 7 -> [1, 3, 2, 5, 9, 8, 7]
Pushed:  [5, 3, 8, 1, 9, 2, 7]
Popped:  [1, 2, 3, 5, 7, 8, 9]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
