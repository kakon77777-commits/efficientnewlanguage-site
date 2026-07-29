<!-- canonical: efficientnewlanguage.org/ai/examples/148-resource-guard-with | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 148 — Cleanup that cannot be skipped (`with`)

`resource_guard_with.eml` is the corpus's **first use of `with`**. EML has had context managers with a real `__enter__`/`__exit__` protocol since Phase 9, and in 134 programs not one of them used it.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The corpus's
# first use of `with` - EML has had context managers with a real
# __enter__/__exit__ protocol since Phase 9, and in 134 programs not one of
# them used it.
#
# The promise of `with` is a cleanup that cannot be skipped. A program that
# only ever exercises the happy path never tests that promise, so this one
# leaves the block three different ways and prints the cleanup each time:
#
#   1. normally, off the end of the block
#   2. by raising, with the exception continuing outward afterwards
#   3. by RETURNING from inside the block, out of the enclosing function
#
# The third is the one people mis-predict. `return` inside a `with` does not
# skip __exit__ and it does not run it late: the return value is computed, then
# __exit__ runs, then the caller receives the value. The transcript below shows
# the release line landing before the caller's line, which is only true if that
# ordering holds.
#
# Nesting is LIFO, like a stack. Two managers entered outer-then-inner are
# released inner-then-outer, and the indentation in the output tracks it.

class Resource:
    def __init__(self, name):
        name => self.name
        [] => self.events

    def __enter__(self):
        ("  acquire " + self.name)^0
        return self

    def __exit__(self, exc_type, exc_value, tb):
        ("  release " + self.name)^0
        return False

"1. leaving normally" => h1
h1^0
with Resource("db") as db:
    ("    using " + db.name)^0
""^0

"2. leaving by raising" => h2
h2^0
try:
    with Resource("socket") as sock:
        ("    using " + sock.name)^0
        raise ValueError("connection lost")
except ValueError:
    "  handler ran AFTER the release above" => note2
    note2^0
""^0

"3. leaving by returning from inside the block" => h3
h3^0

def read_first(resource_name):
    with Resource(resource_name) as r:
        ("    computing the return value")^0
        return r.name + ":ok"
    return "unreachable"

read_first("file") => result
("  caller received " + result)^0
"  the release printed BEFORE this line - __exit__ runs between the return" => note3
note3^0
"  value being computed and the caller receiving it" => note3b
note3b^0
""^0

"4. nesting is LIFO" => h4
h4^0
with Resource("outer") as a:
    with Resource("middle") as b:
        with Resource("inner") as c:
            ("      innermost body, holding " + a.name + " + " + b.name + " + " + c.name)^0

""^0
"Read the acquire/release pairs above: outer, middle, inner acquired in that" => n1
n1^0
"order and released in the reverse. Three exits, three releases, no leaks." => n2
n2^0
```

## Python (deterministic transpilation)

```python
class Resource:
    def __init__(self, name):
        self.name = name
        self.events = []
    def __enter__(self):
        print("  acquire " + self.name)
        return self
    def __exit__(self, exc_type, exc_value, tb):
        print("  release " + self.name)
        return False

h1 = "1. leaving normally"
print(h1)
with Resource("db") as db:
    print("    using " + db.name)
print("")
h2 = "2. leaving by raising"
print(h2)
try:
    with Resource("socket") as sock:
        print("    using " + sock.name)
        raise ValueError("connection lost")
except ValueError:
    note2 = "  handler ran AFTER the release above"
    print(note2)
print("")
h3 = "3. leaving by returning from inside the block"
print(h3)

def read_first(resource_name):
    with Resource(resource_name) as r:
        print("    computing the return value")
        return r.name + ":ok"
    return "unreachable"

result = read_first("file")
print("  caller received " + result)
note3 = "  the release printed BEFORE this line - __exit__ runs between the return"
print(note3)
note3b = "  value being computed and the caller receiving it"
print(note3b)
print("")
h4 = "4. nesting is LIFO"
print(h4)
with Resource("outer") as a:
    with Resource("middle") as b:
        with Resource("inner") as c:
            print("      innermost body, holding " + a.name + " + " + b.name + " + " + c.name)
print("")
n1 = "Read the acquire/release pairs above: outer, middle, inner acquired in that"
print(n1)
n2 = "order and released in the reverse. Three exits, three releases, no leaks."
print(n2)
```

## stdout (executed)

```text
1. leaving normally
  acquire db
    using db
  release db

2. leaving by raising
  acquire socket
    using socket
  release socket
  handler ran AFTER the release above

3. leaving by returning from inside the block
  acquire file
    computing the return value
  release file
  caller received file:ok
  the release printed BEFORE this line - __exit__ runs between the return
  value being computed and the caller receiving it

4. nesting is LIFO
  acquire outer
  acquire middle
  acquire inner
      innermost body, holding outer + middle + inner
  release inner
  release middle
  release outer

Read the acquire/release pairs above: outer, middle, inner acquired in that
order and released in the reverse. Three exits, three releases, no leaks.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:assign · eml:output · eml:call · eml:return · eml:def · eml:run:done
