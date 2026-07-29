<!-- canonical: efficientnewlanguage.org/ai/examples/146-multiline-help-text | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 146 — Triple-quoted strings, and the whitespace they capture

`multiline_help_text.eml` uses triple-quoted string literals, which EML has supported since Phase 9 and which no corpus program had used.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Triple-quoted
# strings, which EML has supported since Phase 9 and which no corpus program
# had used.
#
# The reason to have a case rather than take it on trust: a triple-quoted
# literal is the one place where the SOURCE LAYOUT is part of the value. The
# leading newline after the opening quotes is real, the indentation of the
# continuation lines is real, and both end up in the string whether the author
# meant them or not. That is the entire reason `textwrap.dedent` exists in
# Python's standard library.
#
# EML has no dedent helper, so this program writes one - which is a better
# demonstration anyway, because it has to reason about exactly the whitespace
# that got captured. The check at the end counts the characters rather than
# eyeballing the output: a dedent that removed one space too many or too few
# would still LOOK fine.

"""
Usage: report [options] <file>

Options:
  -v, --verbose   explain what is being done
  -q, --quiet     suppress non-error output
  -o <path>       write the report to <path>
""" => HELP

("raw length: " + str(len(HELP)) + " characters")^0
("starts with a newline: " + str(HELP[0:1] == "\n"))^0
("ends with a newline:   " + str(HELP[len(HELP) - 1:] == "\n"))^0

""^0
"Split into lines by hand (EML has no .split()):" => h1
h1^0

def split_lines(text):
    [] => out
    "" => current
    for ch in text:
        if ch == "\n":
            out + [current] => out
            "" => current
        else:
            current + ch => current
    out + [current] => out
    return out

split_lines(HELP) => lines
("  " + str(len(lines)) + " pieces (a leading and a trailing empty one)")^0
("  first piece: \"" + lines[0] + "\"")^0
("  last piece:  \"" + lines[len(lines) - 1] + "\"")^0

""^0
"Common leading whitespace across the non-empty lines:" => h2
h2^0

def leading_spaces(line):
    0 => n
    for ch in line:
        if ch != " ":
            return n
        n + 1 => n
    return n

999 => common
for line in lines:
    if len(line) > 0:
        leading_spaces(line) => n
        if n < common:
            n => common
("  " + str(common) + " (the Usage line is flush left, so nothing to strip)")^0

""^0
"An indented literal, where dedent has real work to do:" => h3
h3^0

"""
    alpha
      beta
    gamma
""" => BLOCK

split_lines(BLOCK) => blines
999 => bcommon
for line in blines:
    if len(line) > 0:
        leading_spaces(line) => n
        if n < bcommon:
            n => bcommon
("  common indent: " + str(bcommon))^0

[] => dedented
for line in blines:
    if len(line) > 0:
        dedented + [line[bcommon:]] => dedented
    else:
        dedented + [line] => dedented

for line in dedented:
    ("  |" + line)^0

len(BLOCK) => before
0 => after
for line in dedented:
    after + len(line) => after
after + len(dedented) - 1 => after
("  " + str(before) + " characters before, " + str(after) + " after")^0
("  removed " + str(before - after) + " = " + str(bcommon) + " x 3 indented lines")^0

if before - after == bcommon * 3:
    "  The arithmetic checks out: exactly the common indent, three times." => v
else:
    "  MISMATCH - the dedent removed the wrong amount." => v
v^0
```

## Python (deterministic transpilation)

```python
HELP = "\nUsage: report [options] <file>\n\nOptions:\n  -v, --verbose   explain what is being done\n  -q, --quiet     suppress non-error output\n  -o <path>       write the report to <path>\n"
print("raw length: " + str(len(HELP)) + " characters")
print("starts with a newline: " + str(HELP[0:1] == "\n"))
print("ends with a newline:   " + str(HELP[len(HELP) - 1:] == "\n"))
print("")
h1 = "Split into lines by hand (EML has no .split()):"
print(h1)

def split_lines(text):
    out = []
    current = ""
    for ch in text:
        if ch == "\n":
            out = out + [current]
            current = ""
        else:
            current = current + ch
    out = out + [current]
    return out

lines = split_lines(HELP)
print("  " + str(len(lines)) + " pieces (a leading and a trailing empty one)")
print("  first piece: \"" + lines[0] + "\"")
print("  last piece:  \"" + lines[len(lines) - 1] + "\"")
print("")
h2 = "Common leading whitespace across the non-empty lines:"
print(h2)

def leading_spaces(line):
    n = 0
    for ch in line:
        if ch != " ":
            return n
        n = n + 1
    return n

common = 999
for line in lines:
    if len(line) > 0:
        n = leading_spaces(line)
        if n < common:
            common = n
print("  " + str(common) + " (the Usage line is flush left, so nothing to strip)")
print("")
h3 = "An indented literal, where dedent has real work to do:"
print(h3)
BLOCK = "\n    alpha\n      beta\n    gamma\n"
blines = split_lines(BLOCK)
bcommon = 999
for line in blines:
    if len(line) > 0:
        n = leading_spaces(line)
        if n < bcommon:
            bcommon = n
print("  common indent: " + str(bcommon))
dedented = []
for line in blines:
    if len(line) > 0:
        dedented = dedented + [line[bcommon:]]
    else:
        dedented = dedented + [line]
for line in dedented:
    print("  |" + line)
before = len(BLOCK)
after = 0
for line in dedented:
    after = after + len(line)
after = after + len(dedented) - 1
print("  " + str(before) + " characters before, " + str(after) + " after")
print("  removed " + str(before - after) + " = " + str(bcommon) + " x 3 indented lines")
if before - after == bcommon * 3:
    v = "  The arithmetic checks out: exactly the common indent, three times."
else:
    v = "  MISMATCH - the dedent removed the wrong amount."
print(v)
```

## stdout (executed)

```text
raw length: 176 characters
starts with a newline: True
ends with a newline:   True

Split into lines by hand (EML has no .split()):
  8 pieces (a leading and a trailing empty one)
  first piece: ""
  last piece:  ""

Common leading whitespace across the non-empty lines:
  0 (the Usage line is flush left, so nothing to strip)

An indented literal, where dedent has real work to do:
  common indent: 4
  |
  |alpha
  |  beta
  |gamma
  |
  32 characters before, 20 after
  removed 12 = 4 x 3 indented lines
  The arithmetic checks out: exactly the common indent, three times.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:def · eml:call · eml:return · eml:run:done
