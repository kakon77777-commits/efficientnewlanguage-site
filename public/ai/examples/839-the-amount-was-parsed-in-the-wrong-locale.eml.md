<!-- canonical: efficientnewlanguage.org/ai/examples/839-the-amount-was-parsed-in-the-wrong-locale | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 839 — The amount was parsed in the wrong locale

`the_amount_was_parsed_in_the_wrong_locale.eml` - The importer parses every amount in the vendor file and rejects anything unparseable, and the parser is correct. What locale it parses in is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The importer parses
# every amount in the vendor file and rejects anything unparseable, and the
# parser is correct. What locale it parses in is computed below.
#
# The importer is careful. It parses the real amount field, not a truncated
# preview; it rejects a value it cannot parse rather than defaulting it to zero;
# it processes every row; and the parsed totals reconcile against the row count.
#
# The parser uses the server locale, where '.' is the thousands separator and
# ',' is the decimal, and the vendor file uses the opposite convention.

40000 => rows_in_the_file
40000 => rows_that_parsed
0 => rows_rejected_as_unparseable
1234 => vendor_meant_one_point_two_three_four
1234000 => server_parsed_as_one_thousand_two_hundred_thirty_four

server_parsed_as_one_thousand_two_hundred_thirty_four - vendor_meant_one_point_two_three_four => overstatement_per_row_thousandths
int(server_parsed_as_one_thousand_two_hundred_thirty_four * 10000 / vendor_meant_one_point_two_three_four) => parsed_over_intended_per_myriad

"rows in the file                : " + str(rows_in_the_file) ^0
"  parsed                        : " + str(rows_that_parsed) ^0
"  rejected as unparseable       : " + str(rows_rejected_as_unparseable) ^0
"one amount, vendor meant        : 1.234 (one point two three four)" ^0
"the server parsed it as         : 1234 (one thousand two hundred thirty-four)" ^0
"  parsed over intended          : " + str(parsed_over_intended_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the importer verified ----

"the amount importer" ^0
"  parses : the real amount field, not a preview" ^0
"  on an unparseable value : rejects it, does not default" ^0
"    to zero" ^0
"  over : every row" ^0
"  reconciliation : parsed totals against the row count" ^0
"  rows rejected : " + str(rows_rejected_as_unparseable) ^0
"  verdict : ALL ROWS PARSED" ^0
"" ^0
"  rejecting rather than defaulting an unparseable value is" ^0
"  the part done right here, and it is why a garbled row" ^0
"  would not silently become zero" ^0
"" ^0

# ---- what locale it parsed in ----

"the parse, in the server locale" ^0
"  server convention : '.' groups thousands, ',' is the" ^0
"    decimal" ^0
"  vendor convention : '.' is the decimal, ',' groups" ^0
"    thousands" ^0
"  the token '1.234' under the server locale : the integer" ^0
"    1234, cleanly, no error" ^0
"  so it parses : successfully, to the wrong number" ^0
"  a well-formed value in one locale : is a well-formed" ^0
"    different value in the other" ^0
"" ^0

# ---- what reconciliation could not catch ----

"the reconciliation" ^0
"  what it checks : that every row produced a number" ^0
"  rows that produced a number : all " + str(rows_that_parsed) ^0
"  what it does not check : that the number means what the" ^0
"    vendor wrote" ^0
"  is the parser wrong : no; '1.234' is a valid server-" ^0
"    locale integer" ^0
"  did any row fail : no; that is why the error was silent" ^0
"" ^0

# ---- null control ----

# The same file, parsed with the vendor's declared locale (or a locale-
# independent format agreed in the interface contract).
1234000 => nc_value_under_server_locale
1234 => nc_value_under_vendor_locale
40000 => nc_rows_now_correct

"null control - parse in the vendor's locale" ^0
"  value under the server locale : " + str(nc_value_under_server_locale) + " (x1000)" ^0
"  value under the vendor locale : " + str(nc_value_under_vendor_locale) ^0
"  rows now correct : " + str(nc_rows_now_correct) ^0
"  no byte in the file changed; the separators stopped" ^0
"  being read by the wrong convention" ^0
"" ^0

# ---- the rule ----

"what an all-rows-parsed import guarantees" ^0
"  every amount parsed to a number and none was rejected :" ^0
"    exactly, real field, reject-not-default, reconciled" ^0
"  every amount means what the vendor wrote : not" ^0
"    addressed; the parser uses the server locale where '.'" ^0
"    groups thousands, so '1.234' parsed cleanly as 1234" ^0
"    instead of 1.234 - a silent 1000x on every such value" ^0
"" ^0

"a number's text is meaningless without the locale that reads it, and two" ^0
"locales read the same separators oppositely; a value that parses without error" ^0
"in the wrong locale is not a parse failure, it is a wrong number" ^0
"" ^0

"It parses the real field, rejects the unparseable, and reconciles the count -" ^0
"all rows parsed. It parses in the server locale, where '.' groups thousands, so" ^0
"the vendor's '1.234' became 1234 - " + str(parsed_over_intended_per_myriad) + " per ten thousand of intended - with" ^0
"" + str(rows_rejected_as_unparseable) + " rejections, because a wrong-locale amount is well-formed, not an error." ^0
```

## Python (deterministic transpilation)

```python
rows_in_the_file = 40000
rows_that_parsed = 40000
rows_rejected_as_unparseable = 0
vendor_meant_one_point_two_three_four = 1234
server_parsed_as_one_thousand_two_hundred_thirty_four = 1234000
overstatement_per_row_thousandths = server_parsed_as_one_thousand_two_hundred_thirty_four - vendor_meant_one_point_two_three_four
parsed_over_intended_per_myriad = int(server_parsed_as_one_thousand_two_hundred_thirty_four * 10000 / vendor_meant_one_point_two_three_four)
print("rows in the file                : " + str(rows_in_the_file))
print("  parsed                        : " + str(rows_that_parsed))
print("  rejected as unparseable       : " + str(rows_rejected_as_unparseable))
print("one amount, vendor meant        : 1.234 (one point two three four)")
print("the server parsed it as         : 1234 (one thousand two hundred thirty-four)")
print("  parsed over intended          : " + str(parsed_over_intended_per_myriad) + " per ten thousand")
print("")
print("the amount importer")
print("  parses : the real amount field, not a preview")
print("  on an unparseable value : rejects it, does not default")
print("    to zero")
print("  over : every row")
print("  reconciliation : parsed totals against the row count")
print("  rows rejected : " + str(rows_rejected_as_unparseable))
print("  verdict : ALL ROWS PARSED")
print("")
print("  rejecting rather than defaulting an unparseable value is")
print("  the part done right here, and it is why a garbled row")
print("  would not silently become zero")
print("")
print("the parse, in the server locale")
print("  server convention : '.' groups thousands, ',' is the")
print("    decimal")
print("  vendor convention : '.' is the decimal, ',' groups")
print("    thousands")
print("  the token '1.234' under the server locale : the integer")
print("    1234, cleanly, no error")
print("  so it parses : successfully, to the wrong number")
print("  a well-formed value in one locale : is a well-formed")
print("    different value in the other")
print("")
print("the reconciliation")
print("  what it checks : that every row produced a number")
print("  rows that produced a number : all " + str(rows_that_parsed))
print("  what it does not check : that the number means what the")
print("    vendor wrote")
print("  is the parser wrong : no; '1.234' is a valid server-")
print("    locale integer")
print("  did any row fail : no; that is why the error was silent")
print("")
nc_value_under_server_locale = 1234000
nc_value_under_vendor_locale = 1234
nc_rows_now_correct = 40000
print("null control - parse in the vendor's locale")
print("  value under the server locale : " + str(nc_value_under_server_locale) + " (x1000)")
print("  value under the vendor locale : " + str(nc_value_under_vendor_locale))
print("  rows now correct : " + str(nc_rows_now_correct))
print("  no byte in the file changed; the separators stopped")
print("  being read by the wrong convention")
print("")
print("what an all-rows-parsed import guarantees")
print("  every amount parsed to a number and none was rejected :")
print("    exactly, real field, reject-not-default, reconciled")
print("  every amount means what the vendor wrote : not")
print("    addressed; the parser uses the server locale where '.'")
print("    groups thousands, so '1.234' parsed cleanly as 1234")
print("    instead of 1.234 - a silent 1000x on every such value")
print("")
print("a number's text is meaningless without the locale that reads it, and two")
print("locales read the same separators oppositely; a value that parses without error")
print("in the wrong locale is not a parse failure, it is a wrong number")
print("")
print("It parses the real field, rejects the unparseable, and reconciles the count -")
print("all rows parsed. It parses in the server locale, where '.' groups thousands, so")
print("the vendor's '1.234' became 1234 - " + str(parsed_over_intended_per_myriad) + " per ten thousand of intended - with")
print("" + str(rows_rejected_as_unparseable) + " rejections, because a wrong-locale amount is well-formed, not an error.")
```

## stdout (executed)

```text
rows in the file                : 40000
  parsed                        : 40000
  rejected as unparseable       : 0
one amount, vendor meant        : 1.234 (one point two three four)
the server parsed it as         : 1234 (one thousand two hundred thirty-four)
  parsed over intended          : 10000000 per ten thousand

the amount importer
  parses : the real amount field, not a preview
  on an unparseable value : rejects it, does not default
    to zero
  over : every row
  reconciliation : parsed totals against the row count
  rows rejected : 0
  verdict : ALL ROWS PARSED

  rejecting rather than defaulting an unparseable value is
  the part done right here, and it is why a garbled row
  would not silently become zero

the parse, in the server locale
  server convention : '.' groups thousands, ',' is the
    decimal
  vendor convention : '.' is the decimal, ',' groups
    thousands
  the token '1.234' under the server locale : the integer
    1234, cleanly, no error
  so it parses : successfully, to the wrong number
  a well-formed value in one locale : is a well-formed
    different value in the other

the reconciliation
  what it checks : that every row produced a number
  rows that produced a number : all 40000
  what it does not check : that the number means what the
    vendor wrote
  is the parser wrong : no; '1.234' is a valid server-
    locale integer
  did any row fail : no; that is why the error was silent

null control - parse in the vendor's locale
  value under the server locale : 1234000 (x1000)
  value under the vendor locale : 1234
  rows now correct : 40000
  no byte in the file changed; the separators stopped
  being read by the wrong convention

what an all-rows-parsed import guarantees
  every amount parsed to a number and none was rejected :
    exactly, real field, reject-not-default, reconciled
  every amount means what the vendor wrote : not
    addressed; the parser uses the server locale where '.'
    groups thousands, so '1.234' parsed cleanly as 1234
    instead of 1.234 - a silent 1000x on every such value

a number's text is meaningless without the locale that reads it, and two
locales read the same separators oppositely; a value that parses without error
in the wrong locale is not a parse failure, it is a wrong number

It parses the real field, rejects the unparseable, and reconciles the count -
all rows parsed. It parses in the server locale, where '.' groups thousands, so
the vendor's '1.234' became 1234 - 10000000 per ten thousand of intended - with
0 rejections, because a wrong-locale amount is well-formed, not an error.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
