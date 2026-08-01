<!-- canonical: efficientnewlanguage.org/ai/examples/185-bracket-tree-outline | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 185 — Bracket tree: the round trip is the proof

`bracket_tree_outline.eml` parses a bracketed string into a tree, renders it as an indented outline, and serialises it back.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Parse a bracketed
# string into a tree, render it as an indented outline, and then flatten it
# back - so the round trip proves the tree, not the renderer.
#
#     root[alpha[one,two],beta[three[deep[deeper]],four],gamma]
#
# A renderer alone proves nothing: an outline is just text, and a tree that
# lost a branch still produces a perfectly well-formed outline of what is left.
# The only cheap way to know the parse was right is to serialise the tree back
# into the original grammar and compare strings.
#
# The three checks:
#
#   1. re-serialising the tree reproduces the input EXACTLY
#   2. the node count from the tree matches the node count from the raw string
#      (commas and brackets, counted without parsing)
#   3. the deepest indentation in the outline matches the maximum bracket depth
#      of the input, also counted from the raw string
#
# All three witnesses come from the input text rather than from the tree, so a
# parser that drops or duplicates a branch fails at least one of them.

def parse(text, pos):
    # A node is [name, children]. `pos` is a one-element list used as a cursor,
    # because EML has no reference parameters.
    "" => name
    while pos[0] < len(text) and not (text[pos[0]] == "[" or text[pos[0]] == "]" or text[pos[0]] == ","):
        name + text[pos[0]] => name
        pos[0] + 1 => pos[0]
    [] => children
    if pos[0] < len(text) and text[pos[0]] == "[":
        pos[0] + 1 => pos[0]
        True => reading
        while reading:
            children + [parse(text, pos)] => children
            if pos[0] < len(text) and text[pos[0]] == ",":
                pos[0] + 1 => pos[0]
            else:
                False => reading
        if pos[0] < len(text) and text[pos[0]] == "]":
            pos[0] + 1 => pos[0]
        else:
            raise ValueError("unclosed bracket at " + str(pos[0]))
    return [name, children]

def serialize(node):
    node[0] => out
    node[1] => children
    if len(children) > 0:
        out + "[" => out
        0 => i
        while i < len(children):
            if i > 0:
                out + "," => out
            out + serialize(children[i]) => out
            i + 1 => i
        out + "]" => out
    return out

def outline(node, depth, lines):
    lines + ["  " * depth + node[0]] => lines
    for child in node[1]:
        outline(child, depth + 1, lines) => lines
    return lines

def count_nodes(node):
    1 => total
    for child in node[1]:
        total + count_nodes(child) => total
    return total

def max_depth(node):
    0 => deepest
    for child in node[1]:
        max_depth(child) + 1 => d
        if d > deepest:
            deepest => unused
            d => deepest
    return deepest


"root[alpha[one,two],beta[three[deep[deeper]],four],gamma]" => text
("input: " + text)^0
""^0

[0] => cursor
parse(text, cursor) => tree

"outline:"^0
outline(tree, 0, []) => lines
for line in lines:
    ("  " + line)^0

# --------------------------------------------------- witnesses from the TEXT
# Node count from the raw string: one node per name, and names are separated by
# brackets and commas. Counting separators avoids re-parsing.
1 => text_nodes
for ch in text:
    if ch == "," or ch == "[":
        text_nodes + 1 => text_nodes

# Maximum bracket depth, counted by scanning.
0 => text_depth
0 => depth_now
for ch in text:
    if ch == "[":
        depth_now + 1 => depth_now
        if depth_now > text_depth:
            depth_now => text_depth
    elif ch == "]":
        depth_now - 1 => depth_now

# Deepest indentation actually rendered.
0 => rendered_depth
for line in lines:
    0 => spaces
    while spaces < len(line) and line[spaces] == " ":
        spaces + 1 => spaces
    int(spaces / 2) => d
    if d > rendered_depth:
        d => rendered_depth

serialize(tree) => round_tripped

""^0
("re-serialised:  " + round_tripped)^0
("matches input:  " + str(round_tripped == text))^0
("nodes from tree: " + str(count_nodes(tree)) + ", from raw text: " + str(text_nodes))^0
("depth from tree: " + str(max_depth(tree)) + ", from raw text: " + str(text_depth) + ", rendered: " + str(rendered_depth))^0

# --------------------------------------------------------------- malformed
""^0
"Unclosed input must raise:"^0
0 => rejected
["root[a", "root[a[b]", "root[a,b"] => broken
for bad in broken:
    try:
        [0] => c
        parse(bad, c) => t
        ("  " + bad + " -> parsed as " + serialize(t) + "  (SHOULD HAVE RAISED)")^0
    except ValueError as e:
        rejected + 1 => rejected
        ("  %-10s -> %s" % (bad, str(e)))^0

""^0
if round_tripped == text and count_nodes(tree) == text_nodes and max_depth(tree) == text_depth and rendered_depth == text_depth and rejected == len(broken):
    "The tree is exactly the input: round-trips, counts, and depths agree." => verdict
else:
    "FAILED - the parse lost or invented structure." => verdict
verdict^0

""^0
"An outline is only evidence about the outline. Serialising back to the" => n1
n1^0
"original grammar and comparing strings is what makes a dropped branch" => n2
n2^0
"impossible to miss - a missing subtree still renders beautifully." => n3
n3^0
```

## Python (deterministic transpilation)

```python
def parse(text, pos):
    name = ""
    while pos[0] < len(text) and not (text[pos[0]] == "[" or text[pos[0]] == "]" or text[pos[0]] == ","):
        name = name + text[pos[0]]
        pos[0] = pos[0] + 1
    children = []
    if pos[0] < len(text) and text[pos[0]] == "[":
        pos[0] = pos[0] + 1
        reading = True
        while reading:
            children = children + [parse(text, pos)]
            if pos[0] < len(text) and text[pos[0]] == ",":
                pos[0] = pos[0] + 1
            else:
                reading = False
        if pos[0] < len(text) and text[pos[0]] == "]":
            pos[0] = pos[0] + 1
        else:
            raise ValueError("unclosed bracket at " + str(pos[0]))
    return [name, children]

def serialize(node):
    out = node[0]
    children = node[1]
    if len(children) > 0:
        out = out + "["
        i = 0
        while i < len(children):
            if i > 0:
                out = out + ","
            out = out + serialize(children[i])
            i = i + 1
        out = out + "]"
    return out

def outline(node, depth, lines):
    lines = lines + ["  " * depth + node[0]]
    for child in node[1]:
        lines = outline(child, depth + 1, lines)
    return lines

def count_nodes(node):
    total = 1
    for child in node[1]:
        total = total + count_nodes(child)
    return total

def max_depth(node):
    deepest = 0
    for child in node[1]:
        d = max_depth(child) + 1
        if d > deepest:
            unused = deepest
            deepest = d
    return deepest

text = "root[alpha[one,two],beta[three[deep[deeper]],four],gamma]"
print("input: " + text)
print("")
cursor = [0]
tree = parse(text, cursor)
print("outline:")
lines = outline(tree, 0, [])
for line in lines:
    print("  " + line)
text_nodes = 1
for ch in text:
    if ch == "," or ch == "[":
        text_nodes = text_nodes + 1
text_depth = 0
depth_now = 0
for ch in text:
    if ch == "[":
        depth_now = depth_now + 1
        if depth_now > text_depth:
            text_depth = depth_now
    elif ch == "]":
        depth_now = depth_now - 1
rendered_depth = 0
for line in lines:
    spaces = 0
    while spaces < len(line) and line[spaces] == " ":
        spaces = spaces + 1
    d = int(spaces / 2)
    if d > rendered_depth:
        rendered_depth = d
round_tripped = serialize(tree)
print("")
print("re-serialised:  " + round_tripped)
print("matches input:  " + str(round_tripped == text))
print("nodes from tree: " + str(count_nodes(tree)) + ", from raw text: " + str(text_nodes))
print("depth from tree: " + str(max_depth(tree)) + ", from raw text: " + str(text_depth) + ", rendered: " + str(rendered_depth))
print("")
print("Unclosed input must raise:")
rejected = 0
broken = ["root[a", "root[a[b]", "root[a,b"]
for bad in broken:
    try:
        c = [0]
        t = parse(bad, c)
        print("  " + bad + " -> parsed as " + serialize(t) + "  (SHOULD HAVE RAISED)")
    except ValueError as e:
        rejected = rejected + 1
        print("  %-10s -> %s" % (bad, str(e)))
print("")
if round_tripped == text and count_nodes(tree) == text_nodes and max_depth(tree) == text_depth and rendered_depth == text_depth and rejected == len(broken):
    verdict = "The tree is exactly the input: round-trips, counts, and depths agree."
else:
    verdict = "FAILED - the parse lost or invented structure."
print(verdict)
print("")
n1 = "An outline is only evidence about the outline. Serialising back to the"
print(n1)
n2 = "original grammar and comparing strings is what makes a dropped branch"
print(n2)
n3 = "impossible to miss - a missing subtree still renders beautifully."
print(n3)
```

## stdout (executed)

```text
input: root[alpha[one,two],beta[three[deep[deeper]],four],gamma]

outline:
  root
    alpha
      one
      two
    beta
      three
        deep
          deeper
      four
    gamma

re-serialised:  root[alpha[one,two],beta[three[deep[deeper]],four],gamma]
matches input:  True
nodes from tree: 10, from raw text: 10
depth from tree: 4, from raw text: 4, rendered: 4

Unclosed input must raise:
  root[a     -> unclosed bracket at 6
  root[a[b]  -> unclosed bracket at 9
  root[a,b   -> unclosed bracket at 8

The tree is exactly the input: round-trips, counts, and depths agree.

An outline is only evidence about the outline. Serialising back to the
original grammar and comparing strings is what makes a dropped branch
impossible to miss - a missing subtree still renders beautifully.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
