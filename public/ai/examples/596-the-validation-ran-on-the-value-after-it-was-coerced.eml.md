<!-- canonical: efficientnewlanguage.org/ai/examples/596-the-validation-ran-on-the-value-after-it-was-coerced | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 596 — The validation ran on the value after it was coerced

`the_validation_ran_on_the_value_after_it_was_coerced.eml` - Quantity must be an integer between 1 and 999. The validator has never accepted a value outside that range. How many orders ship a quantity the customer did not choose is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Quantity must be
# an integer between 1 and 999. The validator has never accepted a value
# outside that range. How many orders ship a quantity the customer did not
# choose is computed below.
#
# Coercing before validating is the right order and it is what makes the
# validator simple. A form submits strings; a database column holds an integer.
# Something has to turn one into the other, and doing it once at the edge means
# the validator, the business rules and every later reader all work with a
# number instead of each re-parsing a string and disagreeing about how.
# Normalising early is standard advice and it is good advice.
#
# The coercion also has a default, because a parse that can fail needs an
# answer for the failing case, and returning 1 for a missing quantity is
# friendlier than an error page. Quantity 1 is the most common value on the
# form, so it is also the best guess.
#
# The validator sees what the coercion produced. It never sees a missing field,
# because a missing field is not what reaches it - a 1 does. The rule is
# enforced perfectly against a population the coercion has already made legal.

12000 => orders_per_day
30 => empty_field_per_thousand
90 => days_per_quarter

# [raw input, what coercion produces, does the validator accept it, was it chosen]
[["42", "42", 1, 1], ["0042", "42", 1, 1], ["abc", "parse error", 0, 0], ["0", "0", 0, 0], ["(empty)", "1", 1, 0], ["(absent)", "1", 1, 0]] => inputs

"rule : quantity must be an integer from 1 to 999" ^0
"coercion : parse to integer, and use 1 when there is nothing to parse" ^0
"" ^0

"raw input    coercion gives   validator   customer chose it" ^0
0 => accepted
0 => accepted_unchosen
for i in inputs:
    if i[2] == 1:
        accepted + 1 => accepted
        if i[3] == 1:
            "  " + i[0] + "        " + i[1] + "              accepts     yes" ^0
        else:
            accepted_unchosen + 1 => accepted_unchosen
            "  " + i[0] + "    " + i[1] + "               accepts     NO" ^0
    else:
        "  " + i[0] + "        " + i[1] + "     rejects     -" ^0
"" ^0

"  values the validator accepts        : " + str(accepted) ^0
"  of those, values nobody chose       : " + str(accepted_unchosen) ^0
"  values outside 1..999 that got through : 0" ^0
"" ^0

# ---- what the validator is right about ----

"the validator's own record" ^0
"  values it has seen outside 1..999 : 0" ^0
"  values it has wrongly accepted    : 0" ^0
"  values it has wrongly rejected    : 0" ^0
"  its accuracy against its input    : 100 percent" ^0
"" ^0
"  it is a correct rule about integers" ^0
"  the thing that decides what integer arrives is upstream of it" ^0
"" ^0

# ---- how often the default fires ----

int(orders_per_day * empty_field_per_thousand / 1000) => defaulted_per_day
defaulted_per_day * days_per_quarter => defaulted_per_quarter

"orders per day                 : " + str(orders_per_day) ^0
"quantity field left empty      : " + str(empty_field_per_thousand) + " per thousand" ^0
"orders defaulted to 1 per day  : " + str(defaulted_per_day) ^0
"orders defaulted per quarter   : " + str(defaulted_per_quarter) ^0
"" ^0
"  every one of them is a valid order for one unit" ^0
"  none of them is an order the customer placed for one unit" ^0
"" ^0

# ---- what each layer sees ----

"layer                what it receives          can it tell the difference" ^0
"  form                 empty field               yes, it is empty" ^0
"  coercion             empty field               yes, that is why it defaults" ^0
"  validator            the integer 1             no" ^0
"  business rules       the integer 1             no" ^0
"  warehouse            the integer 1             no" ^0
"  customer             one item                  yes, on arrival" ^0
"" ^0
"  the information exists at exactly two points and neither of them is" ^0
"  a place where anything is decided" ^0
"" ^0

# ---- the same coercion with no default ----
#
# Failing the parse instead of guessing sends the empty case to the validator
# as an absence, which the validator can then refuse. The rule does not change;
# what reaches it does.

"coercion that fails instead of defaulting" ^0
"  empty field           -> parse error -> rejected" ^0
"  absent field          -> parse error -> rejected" ^0
"  orders defaulted per quarter : 0" ^0
"  orders rejected per quarter  : " + str(defaulted_per_quarter) ^0
"  and each rejection is a form the customer can correct" ^0
"" ^0

# ---- the control ----
#
# The validator's rule, against every value that has ever reached it. It is
# right on all of them, and it would be right on any value anyone could
# construct. There is no test that finds a defect in it.

"control - is the rule itself correct" ^0
"  lower bound  : 1, correct" ^0
"  upper bound  : 999, correct" ^0
"  integer check: correct" ^0
"  off-by-one   : none, both bounds tested" ^0
"  defects in the rule : 0" ^0
"" ^0
"  a test suite for a validator supplies values TO it" ^0
"  and every value it can supply has already been through the coercion" ^0
"" ^0

# ---- the null control ----
#
# The same coercion and the same validator, on a field with no default. Nothing
# is invented, the validator sees absence as absence, and the ordering is
# harmless. It is not 'coerce then validate' that is wrong; it is coercing with
# a value the validator will accept.

0 => nc_default_fires

"null control - the same order of operations, coercion with no default" ^0
"  coercion runs first        : yes, unchanged" ^0
"  validation runs second     : yes, unchanged" ^0
"  values invented by coercion: " + str(nc_default_fires) ^0
"  orders defaulted           : " + str(nc_default_fires) ^0
"  same two steps in the same order, and nothing gets through" ^0
"  the defect is not the order; it is that one step produces values the" ^0
"  next step is designed to approve" ^0
"" ^0

# ---- the rule ----

"a normalising step in front of a check" ^0
"  makes the check simpler        yes, and that is why it is there" ^0
"  narrows what the check sees    yes, necessarily" ^0
"  can it manufacture a value the check accepts   this is the question" ^0
"  and a default is exactly such a manufacture" ^0
"" ^0
"the test for it is not a value; it is an ABSENCE" ^0
"feed the pipeline a missing field and ask which layer first sees a number" ^0
"" ^0

"Parsing once at the edge is why the validator can be three lines instead of" ^0
"thirty, and defaulting a missing quantity to 1 is friendlier than an error" ^0
"page for the most common value on the form. The validator has never accepted" ^0
"anything outside 1 to 999 and never will. " + str(defaulted_per_quarter) + " orders a quarter ship a" ^0
"quantity of one that the customer never entered, and the validator was right" ^0
"about every one of them." ^0
```

## Python (deterministic transpilation)

```python
orders_per_day = 12000
empty_field_per_thousand = 30
days_per_quarter = 90
inputs = [["42", "42", 1, 1], ["0042", "42", 1, 1], ["abc", "parse error", 0, 0], ["0", "0", 0, 0], ["(empty)", "1", 1, 0], ["(absent)", "1", 1, 0]]
print("rule : quantity must be an integer from 1 to 999")
print("coercion : parse to integer, and use 1 when there is nothing to parse")
print("")
print("raw input    coercion gives   validator   customer chose it")
accepted = 0
accepted_unchosen = 0
for i in inputs:
    if i[2] == 1:
        accepted = accepted + 1
        if i[3] == 1:
            print("  " + i[0] + "        " + i[1] + "              accepts     yes")
        else:
            accepted_unchosen = accepted_unchosen + 1
            print("  " + i[0] + "    " + i[1] + "               accepts     NO")
    else:
        print("  " + i[0] + "        " + i[1] + "     rejects     -")
print("")
print("  values the validator accepts        : " + str(accepted))
print("  of those, values nobody chose       : " + str(accepted_unchosen))
print("  values outside 1..999 that got through : 0")
print("")
print("the validator's own record")
print("  values it has seen outside 1..999 : 0")
print("  values it has wrongly accepted    : 0")
print("  values it has wrongly rejected    : 0")
print("  its accuracy against its input    : 100 percent")
print("")
print("  it is a correct rule about integers")
print("  the thing that decides what integer arrives is upstream of it")
print("")
defaulted_per_day = int(orders_per_day * empty_field_per_thousand / 1000)
defaulted_per_quarter = defaulted_per_day * days_per_quarter
print("orders per day                 : " + str(orders_per_day))
print("quantity field left empty      : " + str(empty_field_per_thousand) + " per thousand")
print("orders defaulted to 1 per day  : " + str(defaulted_per_day))
print("orders defaulted per quarter   : " + str(defaulted_per_quarter))
print("")
print("  every one of them is a valid order for one unit")
print("  none of them is an order the customer placed for one unit")
print("")
print("layer                what it receives          can it tell the difference")
print("  form                 empty field               yes, it is empty")
print("  coercion             empty field               yes, that is why it defaults")
print("  validator            the integer 1             no")
print("  business rules       the integer 1             no")
print("  warehouse            the integer 1             no")
print("  customer             one item                  yes, on arrival")
print("")
print("  the information exists at exactly two points and neither of them is")
print("  a place where anything is decided")
print("")
print("coercion that fails instead of defaulting")
print("  empty field           -> parse error -> rejected")
print("  absent field          -> parse error -> rejected")
print("  orders defaulted per quarter : 0")
print("  orders rejected per quarter  : " + str(defaulted_per_quarter))
print("  and each rejection is a form the customer can correct")
print("")
print("control - is the rule itself correct")
print("  lower bound  : 1, correct")
print("  upper bound  : 999, correct")
print("  integer check: correct")
print("  off-by-one   : none, both bounds tested")
print("  defects in the rule : 0")
print("")
print("  a test suite for a validator supplies values TO it")
print("  and every value it can supply has already been through the coercion")
print("")
nc_default_fires = 0
print("null control - the same order of operations, coercion with no default")
print("  coercion runs first        : yes, unchanged")
print("  validation runs second     : yes, unchanged")
print("  values invented by coercion: " + str(nc_default_fires))
print("  orders defaulted           : " + str(nc_default_fires))
print("  same two steps in the same order, and nothing gets through")
print("  the defect is not the order; it is that one step produces values the")
print("  next step is designed to approve")
print("")
print("a normalising step in front of a check")
print("  makes the check simpler        yes, and that is why it is there")
print("  narrows what the check sees    yes, necessarily")
print("  can it manufacture a value the check accepts   this is the question")
print("  and a default is exactly such a manufacture")
print("")
print("the test for it is not a value; it is an ABSENCE")
print("feed the pipeline a missing field and ask which layer first sees a number")
print("")
print("Parsing once at the edge is why the validator can be three lines instead of")
print("thirty, and defaulting a missing quantity to 1 is friendlier than an error")
print("page for the most common value on the form. The validator has never accepted")
print("anything outside 1 to 999 and never will. " + str(defaulted_per_quarter) + " orders a quarter ship a")
print("quantity of one that the customer never entered, and the validator was right")
print("about every one of them.")
```

## stdout (executed)

```text
rule : quantity must be an integer from 1 to 999
coercion : parse to integer, and use 1 when there is nothing to parse

raw input    coercion gives   validator   customer chose it
  42        42              accepts     yes
  0042        42              accepts     yes
  abc        parse error     rejects     -
  0        0     rejects     -
  (empty)    1               accepts     NO
  (absent)    1               accepts     NO

  values the validator accepts        : 4
  of those, values nobody chose       : 2
  values outside 1..999 that got through : 0

the validator's own record
  values it has seen outside 1..999 : 0
  values it has wrongly accepted    : 0
  values it has wrongly rejected    : 0
  its accuracy against its input    : 100 percent

  it is a correct rule about integers
  the thing that decides what integer arrives is upstream of it

orders per day                 : 12000
quantity field left empty      : 30 per thousand
orders defaulted to 1 per day  : 360
orders defaulted per quarter   : 32400

  every one of them is a valid order for one unit
  none of them is an order the customer placed for one unit

layer                what it receives          can it tell the difference
  form                 empty field               yes, it is empty
  coercion             empty field               yes, that is why it defaults
  validator            the integer 1             no
  business rules       the integer 1             no
  warehouse            the integer 1             no
  customer             one item                  yes, on arrival

  the information exists at exactly two points and neither of them is
  a place where anything is decided

coercion that fails instead of defaulting
  empty field           -> parse error -> rejected
  absent field          -> parse error -> rejected
  orders defaulted per quarter : 0
  orders rejected per quarter  : 32400
  and each rejection is a form the customer can correct

control - is the rule itself correct
  lower bound  : 1, correct
  upper bound  : 999, correct
  integer check: correct
  off-by-one   : none, both bounds tested
  defects in the rule : 0

  a test suite for a validator supplies values TO it
  and every value it can supply has already been through the coercion

null control - the same order of operations, coercion with no default
  coercion runs first        : yes, unchanged
  validation runs second     : yes, unchanged
  values invented by coercion: 0
  orders defaulted           : 0
  same two steps in the same order, and nothing gets through
  the defect is not the order; it is that one step produces values the
  next step is designed to approve

a normalising step in front of a check
  makes the check simpler        yes, and that is why it is there
  narrows what the check sees    yes, necessarily
  can it manufacture a value the check accepts   this is the question
  and a default is exactly such a manufacture

the test for it is not a value; it is an ABSENCE
feed the pipeline a missing field and ask which layer first sees a number

Parsing once at the edge is why the validator can be three lines instead of
thirty, and defaulting a missing quantity to 1 is friendlier than an error
page for the most common value on the form. The validator has never accepted
anything outside 1 to 999 and never will. 32400 orders a quarter ship a
quantity of one that the customer never entered, and the validator was right
about every one of them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
