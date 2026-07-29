<!-- canonical: efficientnewlanguage.org/ai/examples/154-word-wrap | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 154 — Greedy word wrap

`word_wrap.eml` implements the algorithm behind every terminal that reflows text, using the string tools EML actually has.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Greedy word wrap
# - the algorithm behind every terminal that reflows text - written with the
# string tools EML actually has.
#
# The rule is simple: put a word on the current line if it fits, otherwise
# start a new line. What makes it worth a case is that "if it fits" is easy to
# get wrong by exactly one character, and an off-by-one here is invisible in
# casual reading: the paragraph still looks like a paragraph.
#
# So the program checks the two properties that define a correct wrap, over
# every width from 8 to 40 rather than the one width in the demo:
#
#   1. no output line exceeds the width  (unless a single word is longer than
#      the width, which no wrap can fix - that case is counted separately)
#   2. the words come back out in the same order, with nothing lost or added
#
# Property 2 is the one people forget to check. A wrap that silently drops the
# last word of each line still satisfies property 1 perfectly.

def split_words(text):
    [] => out
    "" => current
    for ch in text:
        if ch == " ":
            if len(current) > 0:
                out + [current] => out
                "" => current
        else:
            current + ch => current
    if len(current) > 0:
        out + [current] => out
    return out

def wrap(words, width):
    [] => lines
    "" => line
    for word in words:
        if len(line) == 0:
            word => line
        else:
            if len(line) + 1 + len(word) <= width:
                line + " " + word => line
            else:
                lines + [line] => lines
                word => line
    if len(line) > 0:
        lines + [line] => lines
    return lines

"the quick brown fox jumps over the lazy dog while a supercalifragilistic word waits" => text
split_words(text) => words
("input: " + str(len(words)) + " words, " + str(len(text)) + " characters")^0
""^0

"Wrapped to 24 columns:" => h1
h1^0
("+" + "-" * 24 + "+")^0
wrap(words, 24) => demo
for line in demo:
    ("|" + line + " " * (24 - len(line)) + "|")^0
("+" + "-" * 24 + "+")^0

""^0
"Checked across every width from 8 to 40:" => h2
h2^0

0 => widths_ok
0 => order_ok
0 => unavoidable
0 => checked

for width in [8:40]:
    checked + 1 => checked
    wrap(words, width) => lines

    True => fits
    for line in lines:
        if len(line) > width:
            # only forgivable when the line is a single over-long word
            if len(split_words(line)) > 1:
                False => fits
            else:
                unavoidable + 1 => unavoidable
    if fits:
        widths_ok + 1 => widths_ok

    [] => back
    for line in lines:
        for w in split_words(line):
            back + [w] => back
    if back == words:
        order_ok + 1 => order_ok

("  widths checked:            " + str(checked))^0
("  no over-long line:         " + str(widths_ok))^0
("  words preserved in order:  " + str(order_ok))^0
("  unavoidable overflows:     " + str(unavoidable) + " (a single word longer than the width)")^0

""^0
if widths_ok == checked and order_ok == checked:
    "Both properties hold at every width." => v
else:
    "FAILED - the wrap is wrong at some width." => v
v^0
"The long word is 'supercalifragilistic' at 20 characters, so every width" => n1
n1^0
"below 20 has one line that cannot fit. Counting those separately is the" => n2
n2^0
"difference between a real check and one that had to be loosened to pass." => n3
n3^0
```

## Python (deterministic transpilation)

```python
def split_words(text):
    out = []
    current = ""
    for ch in text:
        if ch == " ":
            if len(current) > 0:
                out = out + [current]
                current = ""
        else:
            current = current + ch
    if len(current) > 0:
        out = out + [current]
    return out

def wrap(words, width):
    lines = []
    line = ""
    for word in words:
        if len(line) == 0:
            line = word
        elif len(line) + 1 + len(word) <= width:
            line = line + " " + word
        else:
            lines = lines + [line]
            line = word
    if len(line) > 0:
        lines = lines + [line]
    return lines

text = "the quick brown fox jumps over the lazy dog while a supercalifragilistic word waits"
words = split_words(text)
print("input: " + str(len(words)) + " words, " + str(len(text)) + " characters")
print("")
h1 = "Wrapped to 24 columns:"
print(h1)
print("+" + "-" * 24 + "+")
demo = wrap(words, 24)
for line in demo:
    print("|" + line + " " * (24 - len(line)) + "|")
print("+" + "-" * 24 + "+")
print("")
h2 = "Checked across every width from 8 to 40:"
print(h2)
widths_ok = 0
order_ok = 0
unavoidable = 0
checked = 0
for width in range(8, 41):
    checked = checked + 1
    lines = wrap(words, width)
    fits = True
    for line in lines:
        if len(line) > width:
            if len(split_words(line)) > 1:
                fits = False
            else:
                unavoidable = unavoidable + 1
    if fits:
        widths_ok = widths_ok + 1
    back = []
    for line in lines:
        for w in split_words(line):
            back = back + [w]
    if back == words:
        order_ok = order_ok + 1
print("  widths checked:            " + str(checked))
print("  no over-long line:         " + str(widths_ok))
print("  words preserved in order:  " + str(order_ok))
print("  unavoidable overflows:     " + str(unavoidable) + " (a single word longer than the width)")
print("")
if widths_ok == checked and order_ok == checked:
    v = "Both properties hold at every width."
else:
    v = "FAILED - the wrap is wrong at some width."
print(v)
n1 = "The long word is 'supercalifragilistic' at 20 characters, so every width"
print(n1)
n2 = "below 20 has one line that cannot fit. Counting those separately is the"
print(n2)
n3 = "difference between a real check and one that had to be loosened to pass."
print(n3)
```

## stdout (executed)

```text
input: 14 words, 83 characters

Wrapped to 24 columns:
+------------------------+
|the quick brown fox     |
|jumps over the lazy dog |
|while a                 |
|supercalifragilistic    |
|word waits              |
+------------------------+

Checked across every width from 8 to 40:
  widths checked:            33
  no over-long line:         33
  words preserved in order:  33
  unavoidable overflows:     12 (a single word longer than the width)

Both properties hold at every width.
The long word is 'supercalifragilistic' at 20 characters, so every width
below 20 has one line that cannot fit. Counting those separately is the
difference between a real check and one that had to be loosened to pass.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
