<!-- canonical: efficientnewlanguage.org/ai/examples/644-the-column-was-not-null-and-the-value-was-an-empty-string | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 644 — The column was not null and the value was an empty string

`the_column_was_not_null_and_the_value_was_an_empty_string.eml` - The column is NOT NULL, the constraint has never been violated, and the database enforces it. How many rows carry a value is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The column is NOT
# NULL, the constraint has never been violated, and the database enforces it.
# How many rows carry a value is computed below.
#
# The constraint is doing real work. It was added after a release where a
# nullable column reached a report as the word "None" in front of a customer, it
# has rejected fourteen thousand malformed inserts since, and the migration that
# added it took a maintenance window because the back-fill was careful. Zero
# violations is a true and hard-won number.
#
# NOT NULL constrains the ABSENCE MARKER, and there is more than one way to
# write nothing down. The loader receives an empty field from the upstream feed
# and writes an empty string, which satisfies the constraint completely.
#
# Every report that counts rows where the column is not null counts them.

14200000 => rows
0 => not_null_violations
4860000 => rows_holding_an_empty_string
14000 => malformed_inserts_rejected

rows - rows_holding_an_empty_string => rows_holding_a_value

"rows                        : " + str(rows) ^0
"holding an empty string     : " + str(rows_holding_an_empty_string) ^0
"holding a value             : " + str(rows_holding_a_value) ^0
"not null violations         : " + str(not_null_violations) ^0
"" ^0

# ---- what the constraint verified ----

"the NOT NULL constraint" ^0
"  enforced by            : the database" ^0
"  violations ever        : " + str(not_null_violations) ^0
"  malformed inserts rejected since : " + str(malformed_inserts_rejected) ^0
"  added after            : a null reaching a customer report" ^0
"  verdict                : ENFORCED" ^0
"" ^0
"  it was added for a real reason and it prevents that" ^0
"  reason from recurring" ^0
"" ^0

# ---- the two ways to write nothing ----

"what the loader does with a missing upstream field" ^0
"  writes null          : rejected by the constraint" ^0
"  writes empty string  : accepted" ^0
"  which it does        : the second, since the constraint" ^0
"    was added, because the first stopped working" ^0
"" ^0
"  the constraint did not remove the absent values; it" ^0
"  selected the spelling they are written in" ^0
"" ^0

int(rows_holding_an_empty_string * 10000 / rows) => empty_per_myriad
"share of rows with nothing in them : " + str(empty_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the reports count ----

"three counts of the same column" ^0
"  rows where it is not null  : " + str(rows) ^0
"  rows where it is non-empty : " + str(rows_holding_a_value) ^0
"  rows a person would call filled : " + str(rows_holding_a_value) ^0
"" ^0
rows - rows_holding_a_value => overcount
"  the first exceeds the third by : " + str(overcount) ^0
"  which query the dashboards use : the first" ^0
"" ^0

# ---- why the fix made it worse ----

# Before the constraint the same rows held null, and every count of "not null"
# excluded them correctly. Adding the constraint moved them from a value the
# reports understood into one they do not.
rows_holding_an_empty_string => rows_that_used_to_be_excluded

"before the constraint" ^0
"  these rows held        : null" ^0
"  counted as filled      : no" ^0
"  reports were           : correct about them" ^0
"after the constraint" ^0
"  these rows hold        : an empty string" ^0
"  counted as filled      : yes, " + str(rows_that_used_to_be_excluded) + " of them" ^0
"" ^0

# ---- null control ----

# The same constraint, plus a check that the value has length.
0 => nc_rows_holding_an_empty_string
rows_holding_a_value => nc_rows_accepted

"null control - NOT NULL plus a length check" ^0
"  violations of NOT NULL : " + str(not_null_violations) + ", unchanged" ^0
"  rows holding an empty string : " + str(nc_rows_holding_an_empty_string) ^0
"  rows accepted          : " + str(nc_rows_accepted) ^0
"  the constraint did not get stricter about nulls; a" ^0
"  second spelling of nothing stopped being accepted" ^0
"" ^0

# ---- the rule ----

"what NOT NULL guarantees" ^0
"  no row holds the null marker : exactly" ^0
"  every row holds information  : not addressed; the" ^0
"    constraint names one representation of absence and" ^0
"    every type has others" ^0
"" ^0
"constraining a representation redirects the values it" ^0
"forbids; the ones that used to be visibly missing become" ^0
"invisibly missing, and the reports get worse" ^0
"" ^0

"The constraint is enforced and its zero is real: " + str(not_null_violations) + " violations ever and" ^0
str(malformed_inserts_rejected) + " malformed inserts rejected since it was added, after a null reached a" ^0
"customer report. " + str(rows_holding_an_empty_string) + " of " + str(rows) + " rows hold an empty string - " + str(empty_per_myriad) + " per ten" ^0
"thousand - so every dashboard counting not-null rows overcounts by " + str(overcount) + ", and" ^0
"before the constraint existed those same rows were counted correctly." ^0
```

## Python (deterministic transpilation)

```python
rows = 14200000
not_null_violations = 0
rows_holding_an_empty_string = 4860000
malformed_inserts_rejected = 14000
rows_holding_a_value = rows - rows_holding_an_empty_string
print("rows                        : " + str(rows))
print("holding an empty string     : " + str(rows_holding_an_empty_string))
print("holding a value             : " + str(rows_holding_a_value))
print("not null violations         : " + str(not_null_violations))
print("")
print("the NOT NULL constraint")
print("  enforced by            : the database")
print("  violations ever        : " + str(not_null_violations))
print("  malformed inserts rejected since : " + str(malformed_inserts_rejected))
print("  added after            : a null reaching a customer report")
print("  verdict                : ENFORCED")
print("")
print("  it was added for a real reason and it prevents that")
print("  reason from recurring")
print("")
print("what the loader does with a missing upstream field")
print("  writes null          : rejected by the constraint")
print("  writes empty string  : accepted")
print("  which it does        : the second, since the constraint")
print("    was added, because the first stopped working")
print("")
print("  the constraint did not remove the absent values; it")
print("  selected the spelling they are written in")
print("")
empty_per_myriad = int(rows_holding_an_empty_string * 10000 / rows)
print("share of rows with nothing in them : " + str(empty_per_myriad) + " per ten thousand")
print("")
print("three counts of the same column")
print("  rows where it is not null  : " + str(rows))
print("  rows where it is non-empty : " + str(rows_holding_a_value))
print("  rows a person would call filled : " + str(rows_holding_a_value))
print("")
overcount = rows - rows_holding_a_value
print("  the first exceeds the third by : " + str(overcount))
print("  which query the dashboards use : the first")
print("")
rows_that_used_to_be_excluded = rows_holding_an_empty_string
print("before the constraint")
print("  these rows held        : null")
print("  counted as filled      : no")
print("  reports were           : correct about them")
print("after the constraint")
print("  these rows hold        : an empty string")
print("  counted as filled      : yes, " + str(rows_that_used_to_be_excluded) + " of them")
print("")
nc_rows_holding_an_empty_string = 0
nc_rows_accepted = rows_holding_a_value
print("null control - NOT NULL plus a length check")
print("  violations of NOT NULL : " + str(not_null_violations) + ", unchanged")
print("  rows holding an empty string : " + str(nc_rows_holding_an_empty_string))
print("  rows accepted          : " + str(nc_rows_accepted))
print("  the constraint did not get stricter about nulls; a")
print("  second spelling of nothing stopped being accepted")
print("")
print("what NOT NULL guarantees")
print("  no row holds the null marker : exactly")
print("  every row holds information  : not addressed; the")
print("    constraint names one representation of absence and")
print("    every type has others")
print("")
print("constraining a representation redirects the values it")
print("forbids; the ones that used to be visibly missing become")
print("invisibly missing, and the reports get worse")
print("")
print("The constraint is enforced and its zero is real: " + str(not_null_violations) + " violations ever and")
print(str(malformed_inserts_rejected) + " malformed inserts rejected since it was added, after a null reached a")
print("customer report. " + str(rows_holding_an_empty_string) + " of " + str(rows) + " rows hold an empty string - " + str(empty_per_myriad) + " per ten")
print("thousand - so every dashboard counting not-null rows overcounts by " + str(overcount) + ", and")
print("before the constraint existed those same rows were counted correctly.")
```

## stdout (executed)

```text
rows                        : 14200000
holding an empty string     : 4860000
holding a value             : 9340000
not null violations         : 0

the NOT NULL constraint
  enforced by            : the database
  violations ever        : 0
  malformed inserts rejected since : 14000
  added after            : a null reaching a customer report
  verdict                : ENFORCED

  it was added for a real reason and it prevents that
  reason from recurring

what the loader does with a missing upstream field
  writes null          : rejected by the constraint
  writes empty string  : accepted
  which it does        : the second, since the constraint
    was added, because the first stopped working

  the constraint did not remove the absent values; it
  selected the spelling they are written in

share of rows with nothing in them : 3422 per ten thousand

three counts of the same column
  rows where it is not null  : 14200000
  rows where it is non-empty : 9340000
  rows a person would call filled : 9340000

  the first exceeds the third by : 4860000
  which query the dashboards use : the first

before the constraint
  these rows held        : null
  counted as filled      : no
  reports were           : correct about them
after the constraint
  these rows hold        : an empty string
  counted as filled      : yes, 4860000 of them

null control - NOT NULL plus a length check
  violations of NOT NULL : 0, unchanged
  rows holding an empty string : 0
  rows accepted          : 9340000
  the constraint did not get stricter about nulls; a
  second spelling of nothing stopped being accepted

what NOT NULL guarantees
  no row holds the null marker : exactly
  every row holds information  : not addressed; the
    constraint names one representation of absence and
    every type has others

constraining a representation redirects the values it
forbids; the ones that used to be visibly missing become
invisibly missing, and the reports get worse

The constraint is enforced and its zero is real: 0 violations ever and
14000 malformed inserts rejected since it was added, after a null reached a
customer report. 4860000 of 14200000 rows hold an empty string - 3422 per ten
thousand - so every dashboard counting not-null rows overcounts by 4860000, and
before the constraint existed those same rows were counted correctly.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
