<!-- canonical: efficientnewlanguage.org/ai/examples/383-the-test-asserts-the-format-not-the-value | ai_layer_version: 0.1.0 | updated: 2026-08-14 -->

# Example 383 — The test asserts the format, not the value — 5 false alarms and 2 blind pairs

`the_test_asserts_the_format_not_the_value.eml` measures the two failure directions of a rendered-output assertion separately, on the same function at the same time.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The assertion
# compares the rendered string. The caller depends on the fields.
#
# Comparing the rendered output is the cheapest assertion there is and it looks
# like the strongest one: it constrains everything the function produces. The
# trouble is that it constrains the rendering as well, and the rendering is a
# presentation decision that nobody promised to keep.
#
# So the assertion is wrong in both directions at once, and the two directions
# are measured separately here. It goes red for changes that alter no value.
# It stays green for changes that alter a value the renderer cannot show.

# [code, suffix] - rendered by joining with nothing between them
[["AB", "C"], ["A", "BC"], ["XY", "Z"], ["X", "YZ"], ["Q", "R"]] => records

def render(r):
    return r[0] + r[1]

def render_v2(r):
    return r[0] + "-" + r[1]

def same_value(a, b):
    if a[0] == b[0]:
        if a[1] == b[1]:
            return 1
    return 0

# ---- direction one: values differ, the string does not ----

"pairs of records" ^0
0 => pairs
0 => value_differs
0 => string_differs
0 => hidden
0 => i
for a in records:
    0 => j
    for b in records:
        if j > i:
            pairs + 1 => pairs
            same_value(a, b) => sv
            if sv == 0:
                value_differs + 1 => value_differs
                if render(a) == render(b):
                    hidden + 1 => hidden
                else:
                    string_differs + 1 => string_differs
        j + 1 => j
    i + 1 => i

"  pairs compared        : " + str(pairs) ^0
"  pairs differing in value : " + str(value_differs) ^0
"  the string separates  : " + str(string_differs) ^0
"  the string cannot     : " + str(hidden) ^0
"" ^0

"the pairs the rendering hides" ^0
0 => i
for a in records:
    0 => j
    for b in records:
        if j > i:
            if same_value(a, b) == 0:
                if render(a) == render(b):
                    "  [" + a[0] + "|" + a[1] + "] and [" + b[0] + "|" + b[1] + "] both render as " + render(a) ^0
        j + 1 => j
    i + 1 => i
"" ^0

# ---- direction two: the string differs, no value does ----

"a rendering change, with every field left alone" ^0
0 => red
0 => value_changed
for r in records:
    if not (render(r) == render_v2(r)):
        red + 1 => red
    if same_value(r, r) == 0:
        value_changed + 1 => value_changed
"  records            : " + str(len(records)) ^0
"  string assertions that go red : " + str(red) ^0
"  values that changed           : " + str(value_changed) ^0
"" ^0

# ---- what a field-wise assertion does on the same two changes ----

def fieldwise_flags_pair(a, b):
    if same_value(a, b) == 0:
        return 1
    return 0

0 => fw_catches
0 => i
for a in records:
    0 => j
    for b in records:
        if j > i:
            if same_value(a, b) == 0:
                fw_catches + fieldwise_flags_pair(a, b) => fw_catches
        j + 1 => j
    i + 1 => i

"the same two questions, asked of the fields" ^0
"  value-differing pairs it separates : " + str(fw_catches) + " of " + str(value_differs) ^0
"  red on the rendering change        : 0" ^0
"" ^0

if hidden > 0:
    if red > 0:
        "The string assertion is both too strict and too loose, on the same" ^0
        "function, at the same time - " + str(red) + " false alarms and " + str(hidden) + " blind pairs." ^0
"" ^0

# ---- the control: a rendering that is injective on this data ----
#
# Without this the reader could conclude that rendered comparisons are always
# blind. They are blind exactly when the rendering loses a boundary.

0 => hidden_v2
0 => i
for a in records:
    0 => j
    for b in records:
        if j > i:
            if same_value(a, b) == 0:
                if render_v2(a) == render_v2(b):
                    hidden_v2 + 1 => hidden_v2
        j + 1 => j
    i + 1 => i
"control - the separated rendering, same comparison" ^0
"  blind pairs : " + str(hidden_v2) ^0
if hidden_v2 == 0:
    "  with a separator the rendering loses nothing, and the blindness is gone" ^0
"" ^0

"An assertion answers a question about whatever it compares. Comparing the" ^0
"output answers a question about the output." ^0
```

## Python (deterministic transpilation)

```python
records = [["AB", "C"], ["A", "BC"], ["XY", "Z"], ["X", "YZ"], ["Q", "R"]]

def render(r):
    return r[0] + r[1]

def render_v2(r):
    return r[0] + "-" + r[1]

def same_value(a, b):
    if a[0] == b[0]:
        if a[1] == b[1]:
            return 1
    return 0

print("pairs of records")
pairs = 0
value_differs = 0
string_differs = 0
hidden = 0
i = 0
for a in records:
    j = 0
    for b in records:
        if j > i:
            pairs = pairs + 1
            sv = same_value(a, b)
            if sv == 0:
                value_differs = value_differs + 1
                if render(a) == render(b):
                    hidden = hidden + 1
                else:
                    string_differs = string_differs + 1
        j = j + 1
    i = i + 1
print("  pairs compared        : " + str(pairs))
print("  pairs differing in value : " + str(value_differs))
print("  the string separates  : " + str(string_differs))
print("  the string cannot     : " + str(hidden))
print("")
print("the pairs the rendering hides")
i = 0
for a in records:
    j = 0
    for b in records:
        if j > i:
            if same_value(a, b) == 0:
                if render(a) == render(b):
                    print("  [" + a[0] + "|" + a[1] + "] and [" + b[0] + "|" + b[1] + "] both render as " + render(a))
        j = j + 1
    i = i + 1
print("")
print("a rendering change, with every field left alone")
red = 0
value_changed = 0
for r in records:
    if not render(r) == render_v2(r):
        red = red + 1
    if same_value(r, r) == 0:
        value_changed = value_changed + 1
print("  records            : " + str(len(records)))
print("  string assertions that go red : " + str(red))
print("  values that changed           : " + str(value_changed))
print("")

def fieldwise_flags_pair(a, b):
    if same_value(a, b) == 0:
        return 1
    return 0

fw_catches = 0
i = 0
for a in records:
    j = 0
    for b in records:
        if j > i:
            if same_value(a, b) == 0:
                fw_catches = fw_catches + fieldwise_flags_pair(a, b)
        j = j + 1
    i = i + 1
print("the same two questions, asked of the fields")
print("  value-differing pairs it separates : " + str(fw_catches) + " of " + str(value_differs))
print("  red on the rendering change        : 0")
print("")
if hidden > 0:
    if red > 0:
        print("The string assertion is both too strict and too loose, on the same")
        print("function, at the same time - " + str(red) + " false alarms and " + str(hidden) + " blind pairs.")
print("")
hidden_v2 = 0
i = 0
for a in records:
    j = 0
    for b in records:
        if j > i:
            if same_value(a, b) == 0:
                if render_v2(a) == render_v2(b):
                    hidden_v2 = hidden_v2 + 1
        j = j + 1
    i = i + 1
print("control - the separated rendering, same comparison")
print("  blind pairs : " + str(hidden_v2))
if hidden_v2 == 0:
    print("  with a separator the rendering loses nothing, and the blindness is gone")
print("")
print("An assertion answers a question about whatever it compares. Comparing the")
print("output answers a question about the output.")
```

## stdout (executed)

```text
pairs of records
  pairs compared        : 10
  pairs differing in value : 10
  the string separates  : 8
  the string cannot     : 2

the pairs the rendering hides
  [AB|C] and [A|BC] both render as ABC
  [XY|Z] and [X|YZ] both render as XYZ

a rendering change, with every field left alone
  records            : 5
  string assertions that go red : 5
  values that changed           : 0

the same two questions, asked of the fields
  value-differing pairs it separates : 10 of 10
  red on the rendering change        : 0

The string assertion is both too strict and too loose, on the same
function, at the same time - 5 false alarms and 2 blind pairs.

control - the separated rendering, same comparison
  blind pairs : 0
  with a separator the rendering loses nothing, and the blindness is gone

An assertion answers a question about whatever it compares. Comparing the
output answers a question about the output.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
