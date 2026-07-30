<!-- canonical: efficientnewlanguage.org/ai/examples/163-numeric-string-parser | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 163 — What `int()` and `float()` actually accept

`numeric_string_parser.eml` walks fourteen candidate strings and reports, for each, what `int()` and `float()` do with it.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Turning text into
# a number is the most common thing a program does with input, and int() and
# float() are stricter than they look. This walks a list of candidate strings
# and reports, for each, what Python actually does.
#
# The rules that surprise people:
#
#   "  42  "   accepted - surrounding whitespace is stripped
#   "1_000"    accepted - underscores are legal BETWEEN digits, as in literals
#   "2.5"      rejected by int() - int() does not round or truncate text
#   "0x10"     rejected by float() - hex is a literal form, not a float string
#   ""         rejected - the empty string is not zero
#   "inf"      accepted by float() - and so are "-Infinity" and "nan"
#
# This case exists because that list is exactly where the interpreter was wrong.
# It had been delegating to JavaScript's Number(), which disagrees with Python
# on every one of those rows: Number("") is 0, Number("0x10") is 16, and
# underscores and "inf" both come back NaN. The error guard made it worse - it
# skipped raising for any string CONTAINING "nan", so float("banana") returned
# nan instead of failing. The corpus never caught it because float() was called
# by ZERO of the 149 programs before this one.

def describe_int(text):
    try:
        int(text) => value
        return "int -> " + repr(value)
    except ValueError:
        return "int -> ValueError"

def describe_float(text):
    try:
        float(text) => value
        return "float -> " + repr(value)
    except ValueError:
        return "float -> ValueError"

["42", "  42  ", "1_000", "-7", "+7", "2.5", "1e3", "0x10", "", "abc", "banana", "inf", "-Infinity", "nan"] => candidates

"text                 int()              float()" => header
header^0
"-------------------- ------------------ ------------------" => rule
rule^0
for text in candidates:
    repr(text) => shown
    describe_int(text) => as_int
    describe_float(text) => as_float
    # Pad to columns by hand: EML-P has no str.ljust, and building the padding
    # with `" " * n` keeps the table readable without one.
    20 - len(shown) => pad1
    if pad1 < 1:
        1 => pad1
    19 - len(as_int) => pad2
    if pad2 < 1:
        1 => pad2
    (shown + " " * pad1 + as_int + " " * pad2 + as_float)^0

""^0
"Two rules worth remembering" => f1
f1^0
"  int() never truncates TEXT - int(\"2.5\") is an error, int(2.5) is 2." => f2
f2^0
"  The empty string is not zero. Nothing in Python treats it as a number." => f3
f3^0
("  int(2.5) = " + str(int(2.5)) + ", int(-2.5) = " + str(int(0.0 - 2.5)) + "   <- toward zero, not down")^0
```

## Python (deterministic transpilation)

```python
def describe_int(text):
    try:
        value = int(text)
        return "int -> " + repr(value)
    except ValueError:
        return "int -> ValueError"

def describe_float(text):
    try:
        value = float(text)
        return "float -> " + repr(value)
    except ValueError:
        return "float -> ValueError"

candidates = ["42", "  42  ", "1_000", "-7", "+7", "2.5", "1e3", "0x10", "", "abc", "banana", "inf", "-Infinity", "nan"]
header = "text                 int()              float()"
print(header)
rule = "-------------------- ------------------ ------------------"
print(rule)
for text in candidates:
    shown = repr(text)
    as_int = describe_int(text)
    as_float = describe_float(text)
    pad1 = 20 - len(shown)
    if pad1 < 1:
        pad1 = 1
    pad2 = 19 - len(as_int)
    if pad2 < 1:
        pad2 = 1
    print(shown + " " * pad1 + as_int + " " * pad2 + as_float)
print("")
f1 = "Two rules worth remembering"
print(f1)
f2 = "  int() never truncates TEXT - int(\"2.5\") is an error, int(2.5) is 2."
print(f2)
f3 = "  The empty string is not zero. Nothing in Python treats it as a number."
print(f3)
print("  int(2.5) = " + str(int(2.5)) + ", int(-2.5) = " + str(int(0.0 - 2.5)) + "   <- toward zero, not down")
```

## stdout (executed)

```text
text                 int()              float()
-------------------- ------------------ ------------------
'42'                int -> 42          float -> 42.0
'  42  '            int -> 42          float -> 42.0
'1_000'             int -> 1000        float -> 1000.0
'-7'                int -> -7          float -> -7.0
'+7'                int -> 7           float -> 7.0
'2.5'               int -> ValueError  float -> 2.5
'1e3'               int -> ValueError  float -> 1000.0
'0x10'              int -> ValueError  float -> ValueError
''                  int -> ValueError  float -> ValueError
'abc'               int -> ValueError  float -> ValueError
'banana'            int -> ValueError  float -> ValueError
'inf'               int -> ValueError  float -> inf
'-Infinity'         int -> ValueError  float -> -inf
'nan'               int -> ValueError  float -> nan

Two rules worth remembering
  int() never truncates TEXT - int("2.5") is an error, int(2.5) is 2.
  The empty string is not zero. Nothing in Python treats it as a number.
  int(2.5) = 2, int(-2.5) = -2   <- toward zero, not down
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
