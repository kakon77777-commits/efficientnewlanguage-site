<!-- canonical: efficientnewlanguage.org/ai/examples/040-simple-queue | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 040 — Case corpus: a self-authored FIFO queue

`simple_queue.eml` is a class-based case in a self-authored batch of six OOP utilities (alongside `examples/bank-account-simulator/`, `examples/simple-stack/`, `examples/inventory-tracker/`, `examples/library-catalog/`, and `examples/parking-lot-tracker/`) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A class-based
# FIFO queue exercising `self.items` list state grown via `existing +
# [item] => existing` (no `.append()` builtin) and shrunk from the front
# manually: `dequeue` reads index 0, then reassigns
# `self.items[1 : len(self.items)] => self.items` to drop it (no `.pop(0)`
# builtin).

class Queue:
    def __init__(self):
        [] => self.items

    def enqueue(self, item):
        self.items + [item] => self.items

    def dequeue(self):
        self.items[0] => front
        self.items[1 : len(self.items)] => self.items
        return front

    def is_empty(self):
        return len(self.items) == 0

Queue() => line_queue
line_queue.enqueue("Maria")
line_queue.enqueue("Tomas")
line_queue.enqueue("Wei")
"Queue after enqueuing 3 people: " + str(line_queue.items) => line1
line1^0

line_queue.dequeue() => served1
"Now serving: " + served1 => line2
line2^0

line_queue.dequeue() => served2
"Now serving: " + served2 => line3
line3^0

"Remaining in queue: " + str(line_queue.items) => line4
line4^0

line_queue.dequeue() => served3
"Now serving: " + served3 => line5
line5^0

"Is empty now? " + str(line_queue.is_empty()) => line6
line6^0
```

## Python (deterministic transpilation)

```python
class Queue:
    def __init__(self):
        self.items = []
    def enqueue(self, item):
        self.items = self.items + [item]
    def dequeue(self):
        front = self.items[0]
        self.items = self.items[1:len(self.items)]
        return front
    def is_empty(self):
        return len(self.items) == 0

line_queue = Queue()
line_queue.enqueue("Maria")
line_queue.enqueue("Tomas")
line_queue.enqueue("Wei")
line1 = "Queue after enqueuing 3 people: " + str(line_queue.items)
print(line1)
served1 = line_queue.dequeue()
line2 = "Now serving: " + served1
print(line2)
served2 = line_queue.dequeue()
line3 = "Now serving: " + served2
print(line3)
line4 = "Remaining in queue: " + str(line_queue.items)
print(line4)
served3 = line_queue.dequeue()
line5 = "Now serving: " + served3
print(line5)
line6 = "Is empty now? " + str(line_queue.is_empty())
print(line6)
```

## stdout (executed)

```text
Queue after enqueuing 3 people: ['Maria', 'Tomas', 'Wei']
Now serving: Maria
Now serving: Tomas
Remaining in queue: ['Wei']
Now serving: Wei
Is empty now? True
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:run:done
