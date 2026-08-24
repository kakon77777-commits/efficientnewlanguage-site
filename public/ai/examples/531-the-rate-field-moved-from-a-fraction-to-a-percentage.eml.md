<!-- canonical: efficientnewlanguage.org/ai/examples/531-the-rate-field-moved-from-a-fraction-to-a-percentage | ai_layer_version: 0.1.0 | updated: 2026-08-24 -->

# Example 531 — The rate field moved from a fraction to a percentage

`the_rate_field_moved_from_a_fraction_to_a_percentage.eml` - A discount_rate field carried 0.15 and now carries 15. Same name, same numeric type. Which consumers noticed is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A discount_rate
# field carried 0.15 and now carries 15. Same name, same numeric type. Which
# consumers noticed is computed below.
#
# The change was a reasonable one. Every human-facing surface was multiplying
# by 100 before display, three of them had rounded differently, and one had
# shown 14.999999999999998 to a customer. Storing the number people actually
# say removes a conversion from five places.
#
# A fraction and a percentage are the same type. Nothing rejects 15 where 0.15
# was expected. A consumer that was already multiplying by 100 now produces a
# number a hundred times too large, and a consumer that multiplies the rate by
# an amount now charges a hundred times too much - and both are running code
# that was correct the day before.
#
# Consumers are listed with what they do to the value.

# [consumer, what it does with the rate, records per day, correct after the change]
[["invoice display", "multiplies by 100 and formats", 21000, "no"], ["discount engine", "multiplies by the amount", 96000, "no"], ["partner export", "writes it out unchanged", 4000, "no"], ["audit log", "stores it as text", 96000, "yes"], ["rate editor", "reads and writes it", 300, "yes"]] => consumers

len(consumers) => n
0 => total
0 => wrong_records
0 => wrong_consumers
for c in consumers:
    total + c[2] => total
    if c[3] == "no":
        wrong_consumers + 1 => wrong_consumers
        wrong_records + c[2] => wrong_records

"consumer            what it does                      records/day   correct after" ^0
for c in consumers:
    "  " + c[0] + "   " + c[1] + "   " + str(c[2]) + "        " + c[3] ^0
"" ^0
"records a day handled      : " + str(total) ^0
"handled by a wrong consumer: " + str(wrong_records) + ", " + str(int(wrong_records * 100 / total)) + "%" ^0
"consumers now wrong        : " + str(wrong_consumers) + " of " + str(n) ^0
"consumers edited           : 0" ^0
"" ^0

# ---- the size of each error ----

15 => stored_now
"one discount of " + str(stored_now) + " percent on an amount of 20000" ^0
"  intended discount        : " + str(int(20000 * stored_now / 100)) ^0
"  discount engine computes : " + str(20000 * stored_now) ^0
"  overcharge factor        : " + str(int(20000 * stored_now / (20000 * stored_now / 100))) ^0
"  the engine is doing exactly the arithmetic it always did" ^0
"" ^0
"the same rate on the invoice display" ^0
"  intended display : " + str(stored_now) + "%" ^0
"  it displays      : " + str(stored_now * 100) + "%" ^0
"  a discount above 100% is visibly absurd, so this one is found in a day" ^0
"" ^0

# ---- which errors are self-announcing ----

"how each wrong consumer fails" ^0
"  invoice display : shows " + str(stored_now * 100) + "%, absurd on sight, reported within a day" ^0
"  discount engine : produces a number, no bound is violated, silent" ^0
"  partner export  : writes 15 where the partner expects 0.15, silent until" ^0
"    the partner reconciles at month end" ^0
"  of the " + str(wrong_consumers) + " wrong consumers, 1 announces itself" ^0
"" ^0

# ---- the range that would have caught it ----

"values the field can hold under each meaning" ^0
"  as a fraction   : 0 to 1" ^0
"  as a percentage : 0 to 100" ^0
"  the two ranges overlap on 0 to 1, which is where every test fixture sits" ^0
"  a test using 0.15 passes under both meanings" ^0
"  a test using 15 fails under the old meaning and would have caught this" ^0
"  fixtures in the suite using a value above 1 : 0" ^0
"" ^0

# ---- what the type system saw ----

"the contract, before and after" ^0
"  field name  : discount_rate, unchanged" ^0
"  type        : number, unchanged" ^0
"  precision   : unchanged" ^0
"  unit        : fraction -> percent" ^0
"  the last line has no representation in the schema, and the first three" ^0
"  are what the compatibility check compares" ^0
"" ^0

# ---- the two ways to ship it safely ----

"alternatives that cannot be silently misread" ^0
"  rename to discount_percent : every consumer fails to find the field" ^0
"    consumers forced to make a decision : " + str(n) ^0
"    consumers silently changed : 0" ^0
"  keep the fraction and fix the display rounding centrally" ^0
"    consumers touched : 1" ^0
"    the original complaint - 14.999999999999998 - is a formatting defect" ^0
"    in one place, and it was solved by changing the unit everywhere" ^0
"" ^0

# ---- the control: a consumer that never interprets the value ----
#
# Where a consumer moves the number without doing arithmetic on it, a change
# of unit passes through it unchanged and it is right either way.

for c in consumers:
    if c[3] == "yes":
        "control - " + c[0] + " : " + c[1] ^0
"  these two are correct under both meanings" ^0
"  what protects them is that neither one knows what the number means," ^0
"  which is also why neither one could have warned anybody" ^0
"" ^0

"Removing a conversion from five places was reasonable and it fixed a real" ^0
"rounding defect. A fraction and a percentage are the same type, so " + str(wrong_consumers) + " of " + str(n) ^0
"consumers changed behaviour and none of them changed." ^0
```

## Python (deterministic transpilation)

```python
consumers = [["invoice display", "multiplies by 100 and formats", 21000, "no"], ["discount engine", "multiplies by the amount", 96000, "no"], ["partner export", "writes it out unchanged", 4000, "no"], ["audit log", "stores it as text", 96000, "yes"], ["rate editor", "reads and writes it", 300, "yes"]]
n = len(consumers)
total = 0
wrong_records = 0
wrong_consumers = 0
for c in consumers:
    total = total + c[2]
    if c[3] == "no":
        wrong_consumers = wrong_consumers + 1
        wrong_records = wrong_records + c[2]
print("consumer            what it does                      records/day   correct after")
for c in consumers:
    print("  " + c[0] + "   " + c[1] + "   " + str(c[2]) + "        " + c[3])
print("")
print("records a day handled      : " + str(total))
print("handled by a wrong consumer: " + str(wrong_records) + ", " + str(int(wrong_records * 100 / total)) + "%")
print("consumers now wrong        : " + str(wrong_consumers) + " of " + str(n))
print("consumers edited           : 0")
print("")
stored_now = 15
print("one discount of " + str(stored_now) + " percent on an amount of 20000")
print("  intended discount        : " + str(int(20000 * stored_now / 100)))
print("  discount engine computes : " + str(20000 * stored_now))
print("  overcharge factor        : " + str(int(20000 * stored_now / (20000 * stored_now / 100))))
print("  the engine is doing exactly the arithmetic it always did")
print("")
print("the same rate on the invoice display")
print("  intended display : " + str(stored_now) + "%")
print("  it displays      : " + str(stored_now * 100) + "%")
print("  a discount above 100% is visibly absurd, so this one is found in a day")
print("")
print("how each wrong consumer fails")
print("  invoice display : shows " + str(stored_now * 100) + "%, absurd on sight, reported within a day")
print("  discount engine : produces a number, no bound is violated, silent")
print("  partner export  : writes 15 where the partner expects 0.15, silent until")
print("    the partner reconciles at month end")
print("  of the " + str(wrong_consumers) + " wrong consumers, 1 announces itself")
print("")
print("values the field can hold under each meaning")
print("  as a fraction   : 0 to 1")
print("  as a percentage : 0 to 100")
print("  the two ranges overlap on 0 to 1, which is where every test fixture sits")
print("  a test using 0.15 passes under both meanings")
print("  a test using 15 fails under the old meaning and would have caught this")
print("  fixtures in the suite using a value above 1 : 0")
print("")
print("the contract, before and after")
print("  field name  : discount_rate, unchanged")
print("  type        : number, unchanged")
print("  precision   : unchanged")
print("  unit        : fraction -> percent")
print("  the last line has no representation in the schema, and the first three")
print("  are what the compatibility check compares")
print("")
print("alternatives that cannot be silently misread")
print("  rename to discount_percent : every consumer fails to find the field")
print("    consumers forced to make a decision : " + str(n))
print("    consumers silently changed : 0")
print("  keep the fraction and fix the display rounding centrally")
print("    consumers touched : 1")
print("    the original complaint - 14.999999999999998 - is a formatting defect")
print("    in one place, and it was solved by changing the unit everywhere")
print("")
for c in consumers:
    if c[3] == "yes":
        print("control - " + c[0] + " : " + c[1])
print("  these two are correct under both meanings")
print("  what protects them is that neither one knows what the number means,")
print("  which is also why neither one could have warned anybody")
print("")
print("Removing a conversion from five places was reasonable and it fixed a real")
print("rounding defect. A fraction and a percentage are the same type, so " + str(wrong_consumers) + " of " + str(n))
print("consumers changed behaviour and none of them changed.")
```

## stdout (executed)

```text
consumer            what it does                      records/day   correct after
  invoice display   multiplies by 100 and formats   21000        no
  discount engine   multiplies by the amount   96000        no
  partner export   writes it out unchanged   4000        no
  audit log   stores it as text   96000        yes
  rate editor   reads and writes it   300        yes

records a day handled      : 217300
handled by a wrong consumer: 121000, 55%
consumers now wrong        : 3 of 5
consumers edited           : 0

one discount of 15 percent on an amount of 20000
  intended discount        : 3000
  discount engine computes : 300000
  overcharge factor        : 100
  the engine is doing exactly the arithmetic it always did

the same rate on the invoice display
  intended display : 15%
  it displays      : 1500%
  a discount above 100% is visibly absurd, so this one is found in a day

how each wrong consumer fails
  invoice display : shows 1500%, absurd on sight, reported within a day
  discount engine : produces a number, no bound is violated, silent
  partner export  : writes 15 where the partner expects 0.15, silent until
    the partner reconciles at month end
  of the 3 wrong consumers, 1 announces itself

values the field can hold under each meaning
  as a fraction   : 0 to 1
  as a percentage : 0 to 100
  the two ranges overlap on 0 to 1, which is where every test fixture sits
  a test using 0.15 passes under both meanings
  a test using 15 fails under the old meaning and would have caught this
  fixtures in the suite using a value above 1 : 0

the contract, before and after
  field name  : discount_rate, unchanged
  type        : number, unchanged
  precision   : unchanged
  unit        : fraction -> percent
  the last line has no representation in the schema, and the first three
  are what the compatibility check compares

alternatives that cannot be silently misread
  rename to discount_percent : every consumer fails to find the field
    consumers forced to make a decision : 5
    consumers silently changed : 0
  keep the fraction and fix the display rounding centrally
    consumers touched : 1
    the original complaint - 14.999999999999998 - is a formatting defect
    in one place, and it was solved by changing the unit everywhere

control - audit log : stores it as text
control - rate editor : reads and writes it
  these two are correct under both meanings
  what protects them is that neither one knows what the number means,
  which is also why neither one could have warned anybody

Removing a conversion from five places was reasonable and it fixed a real
rounding defect. A fraction and a percentage are the same type, so 3 of 5
consumers changed behaviour and none of them changed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
