<!-- canonical: efficientnewlanguage.org/ai/examples/203-fixed-width-record-parser | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 203 — Fixed-width records: where clamping does the most damage

`fixed_width_record_parser.eml` parses column-offset records — the format in which a truncated line and a valid line are indistinguishable after the slices have run.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Parsing
# fixed-width records - the format where slice clamping does the most damage,
# because a truncated line and a valid line are indistinguishable afterwards.
#
# Fixed-width is still everywhere: bank statements, mainframe exports, legacy
# EDI. A record is defined by column offsets:
#
#     id     columns  0..5
#     name   columns  6..25
#     amount columns 26..35
#
# and each field is `line[start:end]`. That is the whole parser, and it is why
# the format is treacherous: if a line is short - trailing spaces stripped by
# an editor, a truncated transfer, a final line without a newline - every
# slice past the end returns "" or a short string instead of raising. The
# record parses. The fields are wrong. Nothing says so.
#
# A parser for this format is only trustworthy if it validates the LINE before
# trusting the slices. So this one:
#
#   1. checks the line length against the schema before extracting anything
#   2. extracts fields only from lines that pass
#   3. reports rejected lines with the reason, instead of parsing them anyway
#
# and then proves the point by parsing the same damaged lines both ways.

# (name, start, end) - end is exclusive, as a slice bound
[
    ["id", 0, 6],
    ["name", 6, 26],
    ["amount", 26, 36],
] => schema

def schema_width(sch):
    0 => widest
    for field in sch:
        if field[2] > widest:
            field[2] => widest
    return widest

def strip_right(s):
    len(s) => end
    while end > 0 and s[end - 1] == " ":
        end - 1 => end
    return s[:end]

def parse_unchecked(line, sch):
    # What everyone writes. Every slice is legal, so nothing ever fails.
    [] => out
    for field in sch:
        out + [strip_right(line[field[1]:field[2]])] => out
    return out

def parse_checked(line, sch):
    # Returns [ok, fields_or_reason].
    schema_width(sch) => need
    if len(line) < need:
        return [False, "short line: " + str(len(line)) + " chars, need " + str(need)]
    for field in sch:
        strip_right(line[field[1]:field[2]]) => value
        if len(value) == 0:
            return [False, "empty field: " + field[0]]
    return [True, parse_unchecked(line, sch)]


schema_width(schema) => width
("schema width: " + str(width) + " columns")^0
"columns: "^0
for field in schema:
    ("  %-8s %2d..%-2d" % (field[0], field[1], field[2]))^0

[
    "A1001 Widget assembly      0000125.50",
    "A1002 Grommet pack         0000007.25",
    "A1003 Flange",
    "A1004 Bracket, heavy duty  0000342.00",
    "A1005",
    "",
] => lines

""^0
"Unchecked parse - every line 'succeeds':"^0
for line in lines:
    parse_unchecked(line, schema) => f
    ("  %-40s -> %s" % ('"' + line + '"', str(f)))^0

""^0
"Checked parse:"^0
0 => accepted
0 => rejected
[] => records
for line in lines:
    parse_checked(line, schema) => result
    if result[0]:
        accepted + 1 => accepted
        records + [result[1]] => records
        ("  OK      " + str(result[1]))^0
    else:
        rejected + 1 => rejected
        ("  REJECT  " + result[1])^0

# ------------------------------------------------------------------- checks
""^0
"What the unchecked parser produced for the damaged lines:"^0
0 => silently_wrong
for line in lines:
    parse_checked(line, schema) => checked_result
    parse_unchecked(line, schema) => unchecked
    if not checked_result[0]:
        silently_wrong + 1 => silently_wrong
        # Every field the unchecked parser invented out of clamping
        0 => invented
        for f in unchecked:
            if len(f) == 0:
                invented + 1 => invented
        ("  " + str(unchecked) + "  (" + str(invented) + " of " + str(len(schema)) + " fields empty, no error raised)")^0

# The accepted records must reconstruct: id + name + amount all non-empty,
# and the amount must parse as a number.
0 => sound
for rec in records:
    True => ok
    for f in rec:
        if len(f) == 0:
            False => ok
    if ok:
        try:
            float(rec[2]) => amount
        except ValueError:
            False => ok
    if ok:
        sound + 1 => sound

# Totals, from the accepted records only.
0.0 => total
for rec in records:
    total + float(rec[2]) => total

""^0
("lines in:            " + str(len(lines)))^0
("accepted:            " + str(accepted))^0
("rejected:            " + str(rejected))^0
("accepted + rejected: " + str(accepted + rejected))^0
("sound records:       " + str(sound) + "/" + str(len(records)))^0
("total amount:        " + str(total))^0
("damaged lines the unchecked parser accepted: " + str(silently_wrong))^0

""^0
if accepted + rejected == len(lines) and sound == len(records) and silently_wrong == rejected and rejected > 0:
    "Every line accounted for; the length check caught what slicing could not." => verdict
else:
    "FAILED - a line was lost, or a damaged record was accepted." => verdict
verdict^0

""^0
"Line 5 is 'A1005' - five characters against a 36-column schema. Sliced" => n1
n1^0
"blindly it yields an id and two empty strings, which is a record. It has" => n2
n2^0
"the right shape, the right field count, and no error attached to it. The" => n3
n3^0
"only thing that distinguishes it from a real record is its length, and" => n4
n4^0
"that has to be checked BEFORE the slices, because afterwards it is gone." => n5
n5^0
```

## Python (deterministic transpilation)

```python
schema = [["id", 0, 6], ["name", 6, 26], ["amount", 26, 36]]

def schema_width(sch):
    widest = 0
    for field in sch:
        if field[2] > widest:
            widest = field[2]
    return widest

def strip_right(s):
    end = len(s)
    while end > 0 and s[end - 1] == " ":
        end = end - 1
    return s[:end]

def parse_unchecked(line, sch):
    out = []
    for field in sch:
        out = out + [strip_right(line[field[1]:field[2]])]
    return out

def parse_checked(line, sch):
    need = schema_width(sch)
    if len(line) < need:
        return [False, "short line: " + str(len(line)) + " chars, need " + str(need)]
    for field in sch:
        value = strip_right(line[field[1]:field[2]])
        if len(value) == 0:
            return [False, "empty field: " + field[0]]
    return [True, parse_unchecked(line, sch)]

width = schema_width(schema)
print("schema width: " + str(width) + " columns")
print("columns: ")
for field in schema:
    print("  %-8s %2d..%-2d" % (field[0], field[1], field[2]))
lines = ["A1001 Widget assembly      0000125.50", "A1002 Grommet pack         0000007.25", "A1003 Flange", "A1004 Bracket, heavy duty  0000342.00", "A1005", ""]
print("")
print("Unchecked parse - every line 'succeeds':")
for line in lines:
    f = parse_unchecked(line, schema)
    print("  %-40s -> %s" % ("\"" + line + "\"", str(f)))
print("")
print("Checked parse:")
accepted = 0
rejected = 0
records = []
for line in lines:
    result = parse_checked(line, schema)
    if result[0]:
        accepted = accepted + 1
        records = records + [result[1]]
        print("  OK      " + str(result[1]))
    else:
        rejected = rejected + 1
        print("  REJECT  " + result[1])
print("")
print("What the unchecked parser produced for the damaged lines:")
silently_wrong = 0
for line in lines:
    checked_result = parse_checked(line, schema)
    unchecked = parse_unchecked(line, schema)
    if not checked_result[0]:
        silently_wrong = silently_wrong + 1
        invented = 0
        for f in unchecked:
            if len(f) == 0:
                invented = invented + 1
        print("  " + str(unchecked) + "  (" + str(invented) + " of " + str(len(schema)) + " fields empty, no error raised)")
sound = 0
for rec in records:
    ok = True
    for f in rec:
        if len(f) == 0:
            ok = False
    if ok:
        try:
            amount = float(rec[2])
        except ValueError:
            ok = False
    if ok:
        sound = sound + 1
total = 0.0
for rec in records:
    total = total + float(rec[2])
print("")
print("lines in:            " + str(len(lines)))
print("accepted:            " + str(accepted))
print("rejected:            " + str(rejected))
print("accepted + rejected: " + str(accepted + rejected))
print("sound records:       " + str(sound) + "/" + str(len(records)))
print("total amount:        " + str(total))
print("damaged lines the unchecked parser accepted: " + str(silently_wrong))
print("")
if accepted + rejected == len(lines) and sound == len(records) and silently_wrong == rejected and rejected > 0:
    verdict = "Every line accounted for; the length check caught what slicing could not."
else:
    verdict = "FAILED - a line was lost, or a damaged record was accepted."
print(verdict)
print("")
n1 = "Line 5 is 'A1005' - five characters against a 36-column schema. Sliced"
print(n1)
n2 = "blindly it yields an id and two empty strings, which is a record. It has"
print(n2)
n3 = "the right shape, the right field count, and no error attached to it. The"
print(n3)
n4 = "only thing that distinguishes it from a real record is its length, and"
print(n4)
n5 = "that has to be checked BEFORE the slices, because afterwards it is gone."
print(n5)
```

## stdout (executed)

```text
schema width: 36 columns
columns: 
  id        0..6 
  name      6..26
  amount   26..36

Unchecked parse - every line 'succeeds':
  "A1001 Widget assembly      0000125.50"  -> ['A1001', 'Widget assembly', ' 0000125.5']
  "A1002 Grommet pack         0000007.25"  -> ['A1002', 'Grommet pack', ' 0000007.2']
  "A1003 Flange"                           -> ['A1003', 'Flange', '']
  "A1004 Bracket, heavy duty  0000342.00"  -> ['A1004', 'Bracket, heavy duty', ' 0000342.0']
  "A1005"                                  -> ['A1005', '', '']
  ""                                       -> ['', '', '']

Checked parse:
  OK      ['A1001', 'Widget assembly', ' 0000125.5']
  OK      ['A1002', 'Grommet pack', ' 0000007.2']
  REJECT  short line: 12 chars, need 36
  OK      ['A1004', 'Bracket, heavy duty', ' 0000342.0']
  REJECT  short line: 5 chars, need 36
  REJECT  short line: 0 chars, need 36

What the unchecked parser produced for the damaged lines:
  ['A1003', 'Flange', '']  (1 of 3 fields empty, no error raised)
  ['A1005', '', '']  (2 of 3 fields empty, no error raised)
  ['', '', '']  (3 of 3 fields empty, no error raised)

lines in:            6
accepted:            3
rejected:            3
accepted + rejected: 6
sound records:       3/3
total amount:        474.7
damaged lines the unchecked parser accepted: 3

Every line accounted for; the length check caught what slicing could not.

Line 5 is 'A1005' - five characters against a 36-column schema. Sliced
blindly it yields an id and two empty strings, which is a record. It has
the right shape, the right field count, and no error attached to it. The
only thing that distinguishes it from a real record is its length, and
that has to be checked BEFORE the slices, because afterwards it is gone.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
