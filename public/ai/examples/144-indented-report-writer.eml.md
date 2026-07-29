<!-- canonical: efficientnewlanguage.org/ai/examples/144-indented-report-writer | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 144 — A context manager that isn't about resources

`indented_report_writer.eml` uses `with` to manage the *shape of output* rather than to release anything.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A context manager
# used for something other than releasing a resource: managing the shape of
# nested output.
#
# The idea is that indentation is exactly the kind of state a `with` block is
# good at - it must go up on the way in and back down on the way out, on every
# path, and a stray early exit that forgot to un-indent would corrupt every
# line printed afterwards. Writing it as a manager makes that impossible to get
# wrong rather than merely easy to get right.
#
# The report below is generated from a nested data structure, so the depth is
# not hardcoded anywhere: it comes purely from how deep the recursion happens
# to be, and the manager tracks it. The final check re-derives the expected
# leading-space count for every line straight from the tree and compares it to
# what was actually printed, which is what makes this a test rather than a
# picture.

class Indent:
    def __init__(self, writer):
        writer => self.writer
    def __enter__(self):
        self.writer.depth + 1 => self.writer.depth
        return self.writer
    def __exit__(self, exc_type, exc_value, tb):
        self.writer.depth - 1 => self.writer.depth
        return False

class Writer:
    def __init__(self):
        0 => self.depth
        [] => self.widths
    def line(self, text):
        "  " * self.depth => pad
        (pad + text)^0
        self.widths + [len(pad)] => self.widths
    def block(self):
        return Indent(self)

# [label, children] - depth is a property of the tree, never written down
tree^+["report", [
    ["summary", []],
    ["details", [
        ["inputs", []],
        ["outputs", [
            ["primary", []],
            ["secondary", []]]]]],
    ["appendix", []]]]

Writer() => w
expected^+[]

def emit(node, writer, depth):
    node[0] => label
    node[1] => children
    writer.line(label)
    for child in children:
        with writer.block() as inner:
            emit(child, inner, depth + 1)

def expected_pads(node, depth, acc):
    acc + [depth * 2] => acc
    for child in node[1]:
        expected_pads(child, depth + 1, acc) => acc
    return acc

emit(tree, w, 0)

""^0
expected_pads(tree, 0, []) => want
("printed pads:  " + str(w.widths))^0
("expected pads: " + str(want))^0

if w.widths == want:
    "  Every line's indentation matches the tree depth it came from." => v
else:
    "  MISMATCH - the indent state leaked across a block boundary." => v
v^0

("Deepest nesting reached: " + str(int(max(want) / 2)) + " levels.")^0
("Writer depth after all blocks closed: " + str(w.depth) + " (must be 0).")^0
""^0
"That last number is the point. Every `with` that raised the depth lowered" => n1
n1^0
"it again on the way out, including the ones several frames deep in the" => n2
n2^0
"recursion, so the writer ends exactly where it started." => n3
n3^0
```

## Python (deterministic transpilation)

```python
class Indent:
    def __init__(self, writer):
        self.writer = writer
    def __enter__(self):
        self.writer.depth = self.writer.depth + 1
        return self.writer
    def __exit__(self, exc_type, exc_value, tb):
        self.writer.depth = self.writer.depth - 1
        return False

class Writer:
    def __init__(self):
        self.depth = 0
        self.widths = []
    def line(self, text):
        pad = "  " * self.depth
        print(pad + text)
        self.widths = self.widths + [len(pad)]
    def block(self):
        return Indent(self)

tree = ["report", [["summary", []], ["details", [["inputs", []], ["outputs", [["primary", []], ["secondary", []]]]]], ["appendix", []]]]
w = Writer()
expected = []

def emit(node, writer, depth):
    label = node[0]
    children = node[1]
    writer.line(label)
    for child in children:
        with writer.block() as inner:
            emit(child, inner, depth + 1)

def expected_pads(node, depth, acc):
    acc = acc + [depth * 2]
    for child in node[1]:
        acc = expected_pads(child, depth + 1, acc)
    return acc

emit(tree, w, 0)
print("")
want = expected_pads(tree, 0, [])
print("printed pads:  " + str(w.widths))
print("expected pads: " + str(want))
if w.widths == want:
    v = "  Every line's indentation matches the tree depth it came from."
else:
    v = "  MISMATCH - the indent state leaked across a block boundary."
print(v)
print("Deepest nesting reached: " + str(int(max(want) / 2)) + " levels.")
print("Writer depth after all blocks closed: " + str(w.depth) + " (must be 0).")
print("")
n1 = "That last number is the point. Every `with` that raised the depth lowered"
print(n1)
n2 = "it again on the way out, including the ones several frames deep in the"
print(n2)
n3 = "recursion, so the writer ends exactly where it started."
print(n3)
```

## stdout (executed)

```text
report
  summary
  details
    inputs
    outputs
      primary
      secondary
  appendix

printed pads:  [0, 2, 2, 4, 4, 6, 6, 2]
expected pads: [0, 2, 2, 4, 4, 6, 6, 2]
  Every line's indentation matches the tree depth it came from.
Deepest nesting reached: 3 levels.
Writer depth after all blocks closed: 0 (must be 0).

That last number is the point. Every `with` that raised the depth lowered
it again on the way out, including the ones several frames deep in the
recursion, so the writer ends exactly where it started.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:assign · eml:call · eml:return · eml:def · eml:output · eml:run:done
