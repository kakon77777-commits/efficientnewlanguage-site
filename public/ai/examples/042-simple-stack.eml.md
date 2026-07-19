<!-- canonical: efficientnewlanguage.org/ai/examples/042-simple-stack | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 042 — Case corpus: a self-authored LIFO stack

`simple_stack.eml` is a class-based case in a self-authored batch of six OOP utilities (alongside `examples/bank-account-simulator/`, `examples/simple-queue/`, `examples/inventory-tracker/`, `examples/library-catalog/`, and `examples/parking-lot-tracker/`) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A class-based
# LIFO stack exercising `self.items` list state grown via `existing + [item]
# => existing` (no `.append()` builtin) and shrunk manually: `pop` reads the
# last element via `self.items[len(self.items) - 1]`, then reassigns
# `self.items[0 : len(self.items) - 1] => self.items` to drop it (no `.pop()`
# builtin).

class Stack:
    def __init__(self):
        [] => self.items

    def push(self, item):
        self.items + [item] => self.items

    def pop(self):
        self.items[len(self.items) - 1] => top
        self.items[0 : len(self.items) - 1] => self.items
        return top

    def peek(self):
        return self.items[len(self.items) - 1]

    def is_empty(self):
        return len(self.items) == 0

Stack() => stack
stack.push("dinner plate")
stack.push("soup bowl")
stack.push("saucer")
"Stack after pushing 3 items: " + str(stack.items) => line1
line1^0

stack.peek() => top_item
"Current top: " + top_item => line2
line2^0

stack.pop() => popped1
"Popped: " + popped1 => line3
line3^0

stack.pop() => popped2
"Popped: " + popped2 => line4
line4^0

"Remaining stack: " + str(stack.items) => line5
line5^0

stack.pop() => popped3
"Popped: " + popped3 => line6
line6^0

"Is empty now? " + str(stack.is_empty()) => line7
line7^0
```

## Python (deterministic transpilation)

```python
class Stack:
    def __init__(self):
        self.items = []
    def push(self, item):
        self.items = self.items + [item]
    def pop(self):
        top = self.items[len(self.items) - 1]
        self.items = self.items[0:len(self.items) - 1]
        return top
    def peek(self):
        return self.items[len(self.items) - 1]
    def is_empty(self):
        return len(self.items) == 0

stack = Stack()
stack.push("dinner plate")
stack.push("soup bowl")
stack.push("saucer")
line1 = "Stack after pushing 3 items: " + str(stack.items)
print(line1)
top_item = stack.peek()
line2 = "Current top: " + top_item
print(line2)
popped1 = stack.pop()
line3 = "Popped: " + popped1
print(line3)
popped2 = stack.pop()
line4 = "Popped: " + popped2
print(line4)
line5 = "Remaining stack: " + str(stack.items)
print(line5)
popped3 = stack.pop()
line6 = "Popped: " + popped3
print(line6)
line7 = "Is empty now? " + str(stack.is_empty())
print(line7)
```

## stdout (executed)

```text
Stack after pushing 3 items: ['dinner plate', 'soup bowl', 'saucer']
Current top: saucer
Popped: saucer
Popped: soup bowl
Remaining stack: ['dinner plate']
Popped: dinner plate
Is empty now? True
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:run:done
