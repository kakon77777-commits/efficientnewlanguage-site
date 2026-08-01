<!-- canonical: efficientnewlanguage.org/ai/examples/191-money-in-cents | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 191 — The same invoice, in floats and in cents

`money_in_cents.eml` totals one invoice twice — in floating-point dollars and in integer cents — and reconciles both against a bank that only accepts whole cents.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The same invoice
# totalled twice - once in floating-point dollars, once in integer cents - and
# reconciled against a bank that only accepts whole cents.
#
# 0.1 + 0.2 is not 0.3. It is 0.30000000000000004, because tenths are not
# representable in binary any more than a third is in decimal. Everyone knows
# this and it still ships, because a single line item is fine, ten line items
# are fine, and the error only becomes visible when something downstream
# demands that the parts equal the whole.
#
# So the program builds an invoice, totals it both ways, and then asks the
# question a payment processor asks:
#
#   does the sum of the line items equal the invoice total, to the cent?
#
# The float column and the integer column disagree, and the program says by how
# much and on which line rather than just declaring one of them wrong.

def to_cents(dollars, cents):
    return dollars * 100 + cents

def render(cents):
    # Whole-cent rendering without float formatting: split with % and int(),
    # both exact here because the values are small.
    int(cents / 100) => whole
    cents % 100 => rest
    if rest < 10:
        return str(whole) + ".0" + str(rest)
    return str(whole) + "." + str(rest)


# (description, dollars, cents, quantity)
[
    ["widget", 0, 10, 3],
    ["grommet", 0, 20, 3],
    ["flange", 1, 15, 2],
    ["shim", 0, 5, 7],
    ["bracket", 12, 99, 1],
    ["fastener", 0, 1, 33],
] => lines

"Invoice"^0
("  %-10s %8s %4s %10s %12s" % ("item", "unit", "qty", "float", "cents"))^0

0.0 => float_total
0 => cent_total
[] => float_lines
[] => cent_lines

for line in lines:
    line[0] => name
    to_cents(line[1], line[2]) => unit_cents
    line[3] => qty

    # The float column: dollars as a decimal number, the way a spreadsheet
    # would hold it.
    unit_cents / 100 => unit_dollars
    unit_dollars * qty => line_float
    float_total + line_float => float_total
    float_lines + [line_float] => float_lines

    # The integer column: whole cents, multiplied.
    unit_cents * qty => line_cents
    cent_total + line_cents => cent_total
    cent_lines + [line_cents] => cent_lines

    ("  %-10s %8s %4d %10s %12s" % (name, render(unit_cents), qty, str(line_float), render(line_cents)))^0

""^0
("float total: " + str(float_total))^0
("cent total:  " + render(cent_total) + "  (" + str(cent_total) + " cents)")^0

# Convert the float total to cents the way a payment gateway would, and see
# whether it lands on the same integer.
int(float_total * 100 + 0.5) => float_as_cents
("float total, rounded to cents: " + str(float_as_cents))^0
("integer total, in cents:       " + str(cent_total))^0
("they agree: " + str(float_as_cents == cent_total))^0

# The stricter test, and the one that actually fails: does the float total
# equal the exact decimal sum, with no rounding allowed?
cent_total / 100 => exact_as_float
""^0
("float total  == exact total?  " + str(float_total == exact_as_float))^0
("float total  - exact total =  " + str(float_total - exact_as_float))^0

# Per-line residues, so the error is attributed rather than just observed.
""^0
"Per-line residue (float line total minus its exact value):"^0
0 => drifting
0 => i
while i < len(lines):
    cent_lines[i] / 100 => exact_line
    float_lines[i] - exact_line => residue
    if not (residue == 0.0):
        drifting + 1 => drifting
        ("  " + lines[i][0] + ": " + str(residue))^0
    i + 1 => i
if drifting == 0:
    "  (none)"^0

""^0
("lines that drift: " + str(drifting) + "/" + str(len(lines)))^0

if float_as_cents == cent_total and drifting > 0:
    "Rounding rescues the total; the individual lines were never exact." => verdict
elif float_as_cents == cent_total:
    "Both columns agree, and no line drifted." => verdict
else:
    "The float column does not reconcile - the integer column is the ledger." => verdict
""^0
verdict^0

""^0
"The lesson is not that floats are broken. It is that a total which needs" => n1
n1^0
"a round() to match is a total that was already wrong, and the round is" => n2
n2^0
"hiding it. Cents are integers; integers here are exact at any size." => n3
n3^0
```

## Python (deterministic transpilation)

```python
def to_cents(dollars, cents):
    return dollars * 100 + cents

def render(cents):
    whole = int(cents / 100)
    rest = cents % 100
    if rest < 10:
        return str(whole) + ".0" + str(rest)
    return str(whole) + "." + str(rest)

lines = [["widget", 0, 10, 3], ["grommet", 0, 20, 3], ["flange", 1, 15, 2], ["shim", 0, 5, 7], ["bracket", 12, 99, 1], ["fastener", 0, 1, 33]]
print("Invoice")
print("  %-10s %8s %4s %10s %12s" % ("item", "unit", "qty", "float", "cents"))
float_total = 0.0
cent_total = 0
float_lines = []
cent_lines = []
for line in lines:
    name = line[0]
    unit_cents = to_cents(line[1], line[2])
    qty = line[3]
    unit_dollars = unit_cents / 100
    line_float = unit_dollars * qty
    float_total = float_total + line_float
    float_lines = float_lines + [line_float]
    line_cents = unit_cents * qty
    cent_total = cent_total + line_cents
    cent_lines = cent_lines + [line_cents]
    print("  %-10s %8s %4d %10s %12s" % (name, render(unit_cents), qty, str(line_float), render(line_cents)))
print("")
print("float total: " + str(float_total))
print("cent total:  " + render(cent_total) + "  (" + str(cent_total) + " cents)")
float_as_cents = int(float_total * 100 + 0.5)
print("float total, rounded to cents: " + str(float_as_cents))
print("integer total, in cents:       " + str(cent_total))
print("they agree: " + str(float_as_cents == cent_total))
exact_as_float = cent_total / 100
print("")
print("float total  == exact total?  " + str(float_total == exact_as_float))
print("float total  - exact total =  " + str(float_total - exact_as_float))
print("")
print("Per-line residue (float line total minus its exact value):")
drifting = 0
i = 0
while i < len(lines):
    exact_line = cent_lines[i] / 100
    residue = float_lines[i] - exact_line
    if not residue == 0.0:
        drifting = drifting + 1
        print("  " + lines[i][0] + ": " + str(residue))
    i = i + 1
if drifting == 0:
    print("  (none)")
print("")
print("lines that drift: " + str(drifting) + "/" + str(len(lines)))
if float_as_cents == cent_total and drifting > 0:
    verdict = "Rounding rescues the total; the individual lines were never exact."
elif float_as_cents == cent_total:
    verdict = "Both columns agree, and no line drifted."
else:
    verdict = "The float column does not reconcile - the integer column is the ledger."
print("")
print(verdict)
print("")
n1 = "The lesson is not that floats are broken. It is that a total which needs"
print(n1)
n2 = "a round() to match is a total that was already wrong, and the round is"
print(n2)
n3 = "hiding it. Cents are integers; integers here are exact at any size."
print(n3)
```

## stdout (executed)

```text
Invoice
  item           unit  qty      float        cents
  widget         0.10    3 0.30000000000000004         0.30
  grommet        0.20    3 0.6000000000000001         0.60
  flange         1.15    2        2.3         2.30
  shim           0.05    7 0.35000000000000003         0.35
  bracket       12.99    1      12.99        12.99
  fastener       0.01   33       0.33         0.33

float total: 16.869999999999997
cent total:  16.87  (1687 cents)
float total, rounded to cents: 1687
integer total, in cents:       1687
they agree: True

float total  == exact total?  False
float total  - exact total =  -3.552713678800501e-15

Per-line residue (float line total minus its exact value):
  widget: 5.551115123125783e-17
  grommet: 1.1102230246251565e-16
  shim: 5.551115123125783e-17

lines that drift: 3/6

Rounding rescues the total; the individual lines were never exact.

The lesson is not that floats are broken. It is that a total which needs
a round() to match is a total that was already wrong, and the round is
hiding it. Cents are integers; integers here are exact at any size.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
