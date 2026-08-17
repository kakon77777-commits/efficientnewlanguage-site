<!-- canonical: efficientnewlanguage.org/ai/examples/430-the-reading-and-the-number-are-not-the-same-record | ai_layer_version: 0.1.0 | updated: 2026-08-17 -->

# Example 430 — The reading and the number are not the same record

`the_reading_and_the_number_are_not_the_same_record.eml` - The log stores readings as text. The report parses them with `float()`. One of those two holds a fact the other cannot.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The log stores
# readings as text. The report parses them with `float()`. One of those two
# holds a fact the other cannot.
#
# Parsing is the right thing to do. Text will not average, will not compare by
# magnitude, and will sort "10" before "9". Every question the report asks is
# a question about numbers, so it converts once at the edge and works in
# numbers after that, which is the shape everyone recommends.
#
# What the conversion drops is the trailing zero. "3.10" and "3.1" are one
# number and two readings: the first says the instrument resolved to a
# hundredth, the second says it resolved to a tenth. After `float()` there is
# no way back, because there is nothing left to go back to.
#
# Both counts are computed from the same log.

["3.10", "3.1", "3.100", "2.5", "2.50", "4.0", "4", "3.10"] => log

len(log) => n
"readings : " + str(n) ^0
"" ^0

# ---- how many distinct readings, counted two ways ----

[] => seen_text
for r in log:
    if not (r in seen_text):
        seen_text + [r] => seen_text

[] => seen_value
for r in log:
    if not (float(r) in seen_value):
        seen_value + [float(r)] => seen_value

"distinct as text   : " + str(len(seen_text)) ^0
"distinct as number : " + str(len(seen_value)) ^0
if len(seen_text) > len(seen_value):
    "  parsing merged " + str(len(seen_text) - len(seen_value)) + " readings the log had kept apart" ^0
"" ^0

"the distinct numbers" ^0
"" => vs
for v in seen_value:
    vs + str(v) + "  " => vs
"  " + vs ^0
"" ^0

# ---- what the text was carrying ----
#
# The digits after the point are a claim about the instrument, and the claim
# is made by writing them, not by their value.

def places(s):
    len(s) => L
    0 => at
    0 => found
    for i in [0:L - 1]:
        if s[i:i + 1] == ".":
            i => at
            1 => found
    if found == 0:
        return 0
    return L - at - 1

"value   decimal places   reading as written" ^0
for r in log:
    "  " + str(float(r)) + "        " + str(places(r)) + "             " + r ^0
"" ^0

0 => coarse
0 => fine
for r in log:
    if places(r) >= 2:
        fine + 1 => fine
    else:
        coarse + 1 => coarse
"resolved to a hundredth or better : " + str(fine) + " of " + str(n) ^0
"resolved more coarsely            : " + str(coarse) + " of " + str(n) ^0
"  that split is computable from the text and from nothing else" ^0
"" ^0

# ---- the same question asked of the parsed values ----
#
# Every reading that parses to 3.1 is the same float, so a rule about
# resolution cannot be evaluated after the parse. What it can do is agree with
# itself, which is not the same as being answerable.

0 => same_float
for r in log:
    if float(r) == 3.1:
        same_float + 1 => same_float
"readings that parse to 3.1 : " + str(same_float) ^0
[] => texts_31
for r in log:
    if float(r) == 3.1:
        if not (r in texts_31):
            texts_31 + [r] => texts_31
"  written as " + str(len(texts_31)) + " different readings" ^0
if len(texts_31) > 1:
    "  which the parsed value cannot distinguish, because it is one value" ^0
"" ^0

# ---- and the arithmetic the parse makes exact-looking ----
#
# Two readings that add to a third in decimal do not add to it in binary. The
# text says the sum is 0.3; the parsed values say otherwise.

float("0.1") + float("0.2") => parsed_sum
"0.1 + 0.2, parsed" ^0
"  sum      : " + str(parsed_sum) ^0
"  0.3      : " + str(float("0.3")) ^0
if parsed_sum == float("0.3"):
    "  equal" ^0
else:
    "  not equal, and the difference is below any tolerance anyone would set" ^0
"" ^0

# The same addition in the unit the readings were taken in.

int(float("0.1") * 10) => t1
int(float("0.2") * 10) => t2
int(float("0.3") * 10) => t3
"the same addition counted in tenths" ^0
"  " + str(t1) + " + " + str(t2) + " = " + str(t1 + t2) + ", target " + str(t3) ^0
if t1 + t2 == t3:
    "  exact, because the unit is the one the instrument reports in" ^0
"" ^0

# ---- the control: a log with no trailing zeros ----
#
# The two counts agree wherever no reading spends a digit on precision, so a
# check run on this log would report the parse as lossless.

["1.5", "2.25", "3", "1.5", "7.125"] => plain
[] => p_text
for r in plain:
    if not (r in p_text):
        p_text + [r] => p_text
[] => p_value
for r in plain:
    if not (float(r) in p_value):
        p_value + [float(r)] => p_value
"control - a log written without trailing zeros" ^0
"  distinct as text   : " + str(len(p_text)) ^0
"  distinct as number : " + str(len(p_value)) ^0
if len(p_text) == len(p_value):
    "  identical, so this log cannot show that parsing loses anything" ^0
"" ^0

"Parsing at the edge is correct and the report needs numbers. The trailing" ^0
"zero is a statement about the instrument, and it is written in the only" ^0
"place the parse does not keep." ^0
```

## Python (deterministic transpilation)

```python
log = ["3.10", "3.1", "3.100", "2.5", "2.50", "4.0", "4", "3.10"]
n = len(log)
print("readings : " + str(n))
print("")
seen_text = []
for r in log:
    if not r in seen_text:
        seen_text = seen_text + [r]
seen_value = []
for r in log:
    if not float(r) in seen_value:
        seen_value = seen_value + [float(r)]
print("distinct as text   : " + str(len(seen_text)))
print("distinct as number : " + str(len(seen_value)))
if len(seen_text) > len(seen_value):
    print("  parsing merged " + str(len(seen_text) - len(seen_value)) + " readings the log had kept apart")
print("")
print("the distinct numbers")
vs = ""
for v in seen_value:
    vs = vs + str(v) + "  "
print("  " + vs)
print("")

def places(s):
    L = len(s)
    at = 0
    found = 0
    for i in range(0, L):
        if s[i:i + 1] == ".":
            at = i
            found = 1
    if found == 0:
        return 0
    return L - at - 1

print("value   decimal places   reading as written")
for r in log:
    print("  " + str(float(r)) + "        " + str(places(r)) + "             " + r)
print("")
coarse = 0
fine = 0
for r in log:
    if places(r) >= 2:
        fine = fine + 1
    else:
        coarse = coarse + 1
print("resolved to a hundredth or better : " + str(fine) + " of " + str(n))
print("resolved more coarsely            : " + str(coarse) + " of " + str(n))
print("  that split is computable from the text and from nothing else")
print("")
same_float = 0
for r in log:
    if float(r) == 3.1:
        same_float = same_float + 1
print("readings that parse to 3.1 : " + str(same_float))
texts_31 = []
for r in log:
    if float(r) == 3.1:
        if not r in texts_31:
            texts_31 = texts_31 + [r]
print("  written as " + str(len(texts_31)) + " different readings")
if len(texts_31) > 1:
    print("  which the parsed value cannot distinguish, because it is one value")
print("")
parsed_sum = float("0.1") + float("0.2")
print("0.1 + 0.2, parsed")
print("  sum      : " + str(parsed_sum))
print("  0.3      : " + str(float("0.3")))
if parsed_sum == float("0.3"):
    print("  equal")
else:
    print("  not equal, and the difference is below any tolerance anyone would set")
print("")
t1 = int(float("0.1") * 10)
t2 = int(float("0.2") * 10)
t3 = int(float("0.3") * 10)
print("the same addition counted in tenths")
print("  " + str(t1) + " + " + str(t2) + " = " + str(t1 + t2) + ", target " + str(t3))
if t1 + t2 == t3:
    print("  exact, because the unit is the one the instrument reports in")
print("")
plain = ["1.5", "2.25", "3", "1.5", "7.125"]
p_text = []
for r in plain:
    if not r in p_text:
        p_text = p_text + [r]
p_value = []
for r in plain:
    if not float(r) in p_value:
        p_value = p_value + [float(r)]
print("control - a log written without trailing zeros")
print("  distinct as text   : " + str(len(p_text)))
print("  distinct as number : " + str(len(p_value)))
if len(p_text) == len(p_value):
    print("  identical, so this log cannot show that parsing loses anything")
print("")
print("Parsing at the edge is correct and the report needs numbers. The trailing")
print("zero is a statement about the instrument, and it is written in the only")
print("place the parse does not keep.")
```

## stdout (executed)

```text
readings : 8

distinct as text   : 7
distinct as number : 3
  parsing merged 4 readings the log had kept apart

the distinct numbers
  3.1  2.5  4.0  

value   decimal places   reading as written
  3.1        2             3.10
  3.1        1             3.1
  3.1        3             3.100
  2.5        1             2.5
  2.5        2             2.50
  4.0        1             4.0
  4.0        0             4
  3.1        2             3.10

resolved to a hundredth or better : 4 of 8
resolved more coarsely            : 4 of 8
  that split is computable from the text and from nothing else

readings that parse to 3.1 : 4
  written as 3 different readings
  which the parsed value cannot distinguish, because it is one value

0.1 + 0.2, parsed
  sum      : 0.30000000000000004
  0.3      : 0.3
  not equal, and the difference is below any tolerance anyone would set

the same addition counted in tenths
  1 + 2 = 3, target 3
  exact, because the unit is the one the instrument reports in

control - a log written without trailing zeros
  distinct as text   : 4
  distinct as number : 4
  identical, so this log cannot show that parsing loses anything

Parsing at the edge is correct and the report needs numbers. The trailing
zero is a statement about the instrument, and it is written in the only
place the parse does not keep.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:def · eml:call · eml:return · eml:run:done
