<!-- canonical: efficientnewlanguage.org/ai/examples/114-manual-csv-parser | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 114 — Manual CSV parser

`manual_csv_parser.eml` splits CSV lines into fields one character at a time, tracking whether the scan is currently inside a quoted region.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Splits CSV
# lines into fields one character at a time, tracking whether the scan is
# currently inside a quoted region. The corpus's first PARSER — small, but
# a real one: it has state, and the meaning of a character depends on it.
#
# This is deliberately not a split-on-comma. A comma inside quotes is
# ordinary text, so `Smith, John` stays ONE field; that is exactly the
# case a naive split gets wrong while still looking like it works on
# simple rows. The samples below include a plain row (which a split would
# handle), a quoted-comma row (which it would not), an empty field, and a
# row that is only separators.
#
# A doubled quote inside a quoted field is an ESCAPED quote, not a close
# followed by an open — so `"with ""inner"" marks"` yields the single
# field `with "inner" marks`. A plain toggle gets the field boundaries
# right here but silently eats the quote characters, which is why the
# lookahead below exists; the last sample is what caught it.
#
# EML has no `.split()` — it is interpreter-deferred — so this is written
# out rather than delegated. That constraint is what makes the case worth
# having: the state machine has to be visible.

def parse_csv_line(line):
    fields^+[]
    "" => current
    0 => inside_quotes
    0 => i
    len(line) => n
    while i < n:
        line[i] => ch
        if ch == "\"":
            if inside_quotes == 1 and i + 1 < n and line[i + 1] == "\"":
                current + "\"" => current
                i + 1 => i
            elif inside_quotes == 1:
                0 => inside_quotes
            else:
                1 => inside_quotes
        elif ch == "," and inside_quotes == 0:
            fields + [current] => fields
            "" => current
        else:
            current + ch => current
        i + 1 => i
    fields + [current] => fields
    return fields

lines^+["name,age,city",
        "\"Smith, John\",42,Taipei",
        "Ada,,London",
        ",,",
        "\"quoted\",plain,\"with \"\"inner\"\" marks\""]

for line in lines:
    parse_csv_line(line) => fields
    "input:  " + line => shown
    shown^0
    "fields: " + str(len(fields)) + " -> " + str(fields) => parsed
    parsed^0
    "" => blank
    blank^0
```

## Python (deterministic transpilation)

```python
def parse_csv_line(line):
    fields = []
    current = ""
    inside_quotes = 0
    i = 0
    n = len(line)
    while i < n:
        ch = line[i]
        if ch == "\"":
            if inside_quotes == 1 and i + 1 < n and line[i + 1] == "\"":
                current = current + "\""
                i = i + 1
            elif inside_quotes == 1:
                inside_quotes = 0
            else:
                inside_quotes = 1
        elif ch == "," and inside_quotes == 0:
            fields = fields + [current]
            current = ""
        else:
            current = current + ch
        i = i + 1
    fields = fields + [current]
    return fields

lines = ["name,age,city", "\"Smith, John\",42,Taipei", "Ada,,London", ",,", "\"quoted\",plain,\"with \"\"inner\"\" marks\""]
for line in lines:
    fields = parse_csv_line(line)
    shown = "input:  " + line
    print(shown)
    parsed = "fields: " + str(len(fields)) + " -> " + str(fields)
    print(parsed)
    blank = ""
    print(blank)
```

## stdout (executed)

```text
input:  name,age,city
fields: 3 -> ['name', 'age', 'city']

input:  "Smith, John",42,Taipei
fields: 3 -> ['Smith, John', '42', 'Taipei']

input:  Ada,,London
fields: 3 -> ['Ada', '', 'London']

input:  ,,
fields: 3 -> ['', '', '']

input:  "quoted",plain,"with ""inner"" marks"
fields: 3 -> ['quoted', 'plain', 'with "inner" marks']
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
