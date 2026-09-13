<!-- canonical: efficientnewlanguage.org/ai/examples/823-the-constraint-was-added-going-forward | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 823 — The constraint was added going forward

`the_constraint_was_added_going_forward.eml` - The column has a NOT NULL constraint and every write since it was added has honored it. What the constraint applies to is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The column has a
# NOT NULL constraint and every write since it was added has honored it. What the
# constraint applies to is computed below.
#
# The constraint was added properly. It is a real database constraint, not an
# application-layer hope; every insert and update since is checked by the engine;
# a violating write is rejected outright; and the migration that added it is in
# version control.
#
# The engine applied it going forward, to new writes, and did not validate the
# rows already there.

4000000 => rows_total
380000 => rows_written_before_the_constraint
5200 => old_rows_that_are_null
0 => writes_since_that_violated

rows_total - rows_written_before_the_constraint => rows_written_under_the_constraint
int(old_rows_that_are_null * 10000 / rows_total) => violating_rows_share_per_myriad
old_rows_that_are_null - writes_since_that_violated => rows_the_constraint_never_checked_and_that_violate_it

"rows total                      : " + str(rows_total) ^0
"  written before the constraint : " + str(rows_written_before_the_constraint) ^0
"  written under it              : " + str(rows_written_under_the_constraint) ^0
"writes since that violated it   : " + str(writes_since_that_violated) ^0
"old rows that are null          : " + str(old_rows_that_are_null) ^0
"  that the constraint never checked : " ^0
"    " + str(rows_the_constraint_never_checked_and_that_violate_it) ^0
"violating rows                  : " + str(violating_rows_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the constraint verified ----

"the NOT NULL constraint" ^0
"  kind : a real database constraint, engine-enforced" ^0
"  checks : every insert and update since it was added" ^0
"  on a violating write : rejects it outright" ^0
"  migration : in version control" ^0
"  writes since that slipped a null through : " ^0
"    " + str(writes_since_that_violated) ^0
"  verdict : CONSTRAINT HOLDING" ^0
"" ^0
"  engine enforcement rather than an application-layer hope" ^0
"  is the part done right here, and it is why no new write" ^0
"  can insert a null" ^0
"" ^0

# ---- what it applies to ----

"the scope of the constraint" ^0
"  when added : after 380000 rows already existed" ^0
"  what the engine checked on adding it : new writes only" ^0
"  what it did NOT do : scan and validate the existing" ^0
"    rows" ^0
"  so the guarantee : is prospective, not total" ^0
"  rows predating it that are null : " + str(old_rows_that_are_null) ^0
"" ^0

# ---- what a trusting reader hits ----

"a reader that trusts the constraint" ^0
"  what it assumes : the column is never null" ^0
"  what it dropped : the null-check, now that the" ^0
"    constraint exists" ^0
"  rows that break it : " + str(old_rows_that_are_null) + ", the pre-existing nulls" ^0
"  is the constraint wrong : no; it holds for every row it" ^0
"    was allowed to check" ^0
"  were the old rows ever checked : no" ^0
"" ^0

# ---- null control ----

# The same constraint, added in the mode that validates existing rows before it
# is trusted, so the guarantee covers the whole table.
0 => nc_new_writes_that_violate
5200 => nc_old_rows_the_validation_would_reject
1 => nc_migrations_that_would_have_failed_until_fixed

"null control - validate existing rows on add" ^0
"  new writes that violate : " + str(nc_new_writes_that_violate) ^0
"  old rows the validation would reject : " ^0
"    " + str(nc_old_rows_the_validation_would_reject) ^0
"  migrations that would fail until the data is fixed : " ^0
"    " + str(nc_migrations_that_would_have_failed_until_fixed) ^0
"  no row and no constraint text changed; adding it stopped" ^0
"  being a promise only about the future" ^0
"" ^0

# ---- the rule ----

"what an enforced constraint guarantees" ^0
"  every write since it was added satisfies it : exactly," ^0
"    engine-checked, violations rejected" ^0
"  every row satisfies the constraint : not addressed; the" ^0
"    constraint was added going forward and applies to new" ^0
"    writes - " + str(old_rows_that_are_null) + " pre-existing rows violate it, and a reader" ^0
"    that trusts it breaks on them" ^0
"" ^0

"a constraint added to a table is a promise about writes, and a promise about" ^0
"writes is not a fact about rows; the history the constraint never read is" ^0
"exactly where the values it forbids still live" ^0
"" ^0

"It is engine-enforced and rejects every violating write - no new null slips" ^0
"through. It was added going forward and never validated the existing rows, so " ^0
"" + str(old_rows_that_are_null) + " pre-existing nulls remain, " + str(violating_rows_share_per_myriad) + " per ten thousand, and break any reader that" ^0
"trusts the column, under " + str(writes_since_that_violated) + " new violations." ^0
```

## Python (deterministic transpilation)

```python
rows_total = 4000000
rows_written_before_the_constraint = 380000
old_rows_that_are_null = 5200
writes_since_that_violated = 0
rows_written_under_the_constraint = rows_total - rows_written_before_the_constraint
violating_rows_share_per_myriad = int(old_rows_that_are_null * 10000 / rows_total)
rows_the_constraint_never_checked_and_that_violate_it = old_rows_that_are_null - writes_since_that_violated
print("rows total                      : " + str(rows_total))
print("  written before the constraint : " + str(rows_written_before_the_constraint))
print("  written under it              : " + str(rows_written_under_the_constraint))
print("writes since that violated it   : " + str(writes_since_that_violated))
print("old rows that are null          : " + str(old_rows_that_are_null))
print("  that the constraint never checked : ")
print("    " + str(rows_the_constraint_never_checked_and_that_violate_it))
print("violating rows                  : " + str(violating_rows_share_per_myriad) + " per ten thousand")
print("")
print("the NOT NULL constraint")
print("  kind : a real database constraint, engine-enforced")
print("  checks : every insert and update since it was added")
print("  on a violating write : rejects it outright")
print("  migration : in version control")
print("  writes since that slipped a null through : ")
print("    " + str(writes_since_that_violated))
print("  verdict : CONSTRAINT HOLDING")
print("")
print("  engine enforcement rather than an application-layer hope")
print("  is the part done right here, and it is why no new write")
print("  can insert a null")
print("")
print("the scope of the constraint")
print("  when added : after 380000 rows already existed")
print("  what the engine checked on adding it : new writes only")
print("  what it did NOT do : scan and validate the existing")
print("    rows")
print("  so the guarantee : is prospective, not total")
print("  rows predating it that are null : " + str(old_rows_that_are_null))
print("")
print("a reader that trusts the constraint")
print("  what it assumes : the column is never null")
print("  what it dropped : the null-check, now that the")
print("    constraint exists")
print("  rows that break it : " + str(old_rows_that_are_null) + ", the pre-existing nulls")
print("  is the constraint wrong : no; it holds for every row it")
print("    was allowed to check")
print("  were the old rows ever checked : no")
print("")
nc_new_writes_that_violate = 0
nc_old_rows_the_validation_would_reject = 5200
nc_migrations_that_would_have_failed_until_fixed = 1
print("null control - validate existing rows on add")
print("  new writes that violate : " + str(nc_new_writes_that_violate))
print("  old rows the validation would reject : ")
print("    " + str(nc_old_rows_the_validation_would_reject))
print("  migrations that would fail until the data is fixed : ")
print("    " + str(nc_migrations_that_would_have_failed_until_fixed))
print("  no row and no constraint text changed; adding it stopped")
print("  being a promise only about the future")
print("")
print("what an enforced constraint guarantees")
print("  every write since it was added satisfies it : exactly,")
print("    engine-checked, violations rejected")
print("  every row satisfies the constraint : not addressed; the")
print("    constraint was added going forward and applies to new")
print("    writes - " + str(old_rows_that_are_null) + " pre-existing rows violate it, and a reader")
print("    that trusts it breaks on them")
print("")
print("a constraint added to a table is a promise about writes, and a promise about")
print("writes is not a fact about rows; the history the constraint never read is")
print("exactly where the values it forbids still live")
print("")
print("It is engine-enforced and rejects every violating write - no new null slips")
print("through. It was added going forward and never validated the existing rows, so ")
print("" + str(old_rows_that_are_null) + " pre-existing nulls remain, " + str(violating_rows_share_per_myriad) + " per ten thousand, and break any reader that")
print("trusts the column, under " + str(writes_since_that_violated) + " new violations.")
```

## stdout (executed)

```text
rows total                      : 4000000
  written before the constraint : 380000
  written under it              : 3620000
writes since that violated it   : 0
old rows that are null          : 5200
  that the constraint never checked : 
    5200
violating rows                  : 13 per ten thousand

the NOT NULL constraint
  kind : a real database constraint, engine-enforced
  checks : every insert and update since it was added
  on a violating write : rejects it outright
  migration : in version control
  writes since that slipped a null through : 
    0
  verdict : CONSTRAINT HOLDING

  engine enforcement rather than an application-layer hope
  is the part done right here, and it is why no new write
  can insert a null

the scope of the constraint
  when added : after 380000 rows already existed
  what the engine checked on adding it : new writes only
  what it did NOT do : scan and validate the existing
    rows
  so the guarantee : is prospective, not total
  rows predating it that are null : 5200

a reader that trusts the constraint
  what it assumes : the column is never null
  what it dropped : the null-check, now that the
    constraint exists
  rows that break it : 5200, the pre-existing nulls
  is the constraint wrong : no; it holds for every row it
    was allowed to check
  were the old rows ever checked : no

null control - validate existing rows on add
  new writes that violate : 0
  old rows the validation would reject : 
    5200
  migrations that would fail until the data is fixed : 
    1
  no row and no constraint text changed; adding it stopped
  being a promise only about the future

what an enforced constraint guarantees
  every write since it was added satisfies it : exactly,
    engine-checked, violations rejected
  every row satisfies the constraint : not addressed; the
    constraint was added going forward and applies to new
    writes - 5200 pre-existing rows violate it, and a reader
    that trusts it breaks on them

a constraint added to a table is a promise about writes, and a promise about
writes is not a fact about rows; the history the constraint never read is
exactly where the values it forbids still live

It is engine-enforced and rejects every violating write - no new null slips
through. It was added going forward and never validated the existing rows, so 
5200 pre-existing nulls remain, 13 per ten thousand, and break any reader that
trusts the column, under 0 new violations.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
