<!-- canonical: efficientnewlanguage.org/ai/examples/846-the-not-in-list-had-a-null | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 846 — The not in list had a null

`the_not_in_list_had_a_null.eml` - The query returns the accounts that are not on the block list, and the SQL is correct. What one NULL in that list does is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The query returns
# the accounts that are not on the block list, and the SQL is correct. What one
# NULL in that list does is computed below.
#
# The query is careful. The block list comes from a real column, not a
# hard-coded array; the NOT IN is the database's own, not a hand-built loop; it
# runs over every account; and the intent is exactly 'accounts not blocked'.
#
# One value in the block list is NULL, and `id NOT IN (..., NULL)` is UNKNOWN for
# every id.

100000 => accounts
40 => blocked_ids_that_are_real
1 => blocked_ids_that_are_null

accounts - blocked_ids_that_are_real => accounts_that_should_be_allowed
0 => accounts_the_query_returned
accounts_that_should_be_allowed - accounts_the_query_returned => accounts_wrongly_excluded
int(accounts_wrongly_excluded * 10000 / accounts_that_should_be_allowed) => wrongly_excluded_per_myriad

"accounts                        : " + str(accounts) ^0
"blocked ids that are real       : " + str(blocked_ids_that_are_real) ^0
"blocked ids that are null       : " + str(blocked_ids_that_are_null) ^0
"" ^0
"accounts that should be allowed : " + str(accounts_that_should_be_allowed) ^0
"accounts the query returned     : " + str(accounts_the_query_returned) ^0
"  wrongly excluded              : " + str(accounts_wrongly_excluded) ^0
"wrongly excluded                : " + str(wrongly_excluded_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the query verified ----

"the not-blocked query" ^0
"  block list source : a real column, not a hard-coded" ^0
"    array" ^0
"  operator : the database's own NOT IN" ^0
"  over : every account" ^0
"  intent : accounts not on the block list" ^0
"  hand-built loops that could differ : 0" ^0
"  verdict : returns the allowed accounts" ^0
"" ^0
"  using the engine's NOT IN rather than a hand-built loop" ^0
"  is the part done right here, and it is why a real listed" ^0
"  id is reliably excluded" ^0
"" ^0

# ---- what a NULL in the list does ----

"id NOT IN (..., NULL)" ^0
"  what NOT IN expands to : id <> a AND id <> b AND ... AND" ^0
"    id <> NULL" ^0
"  what id <> NULL yields : UNKNOWN" ^0
"  what TRUE AND UNKNOWN yields : UNKNOWN" ^0
"  so the whole predicate : UNKNOWN for every id" ^0
"  rows a WHERE keeps when the predicate is UNKNOWN : none" ^0
"" ^0

# ---- what the caller got ----

"the result of the not-blocked query" ^0
"  accounts that should pass : " + str(accounts_that_should_be_allowed) ^0
"  accounts returned : " + str(accounts_the_query_returned) ^0
"  the one NULL responsible : a single null id in the list" ^0
"  is the query wrong : no; NOT IN with a NULL is UNKNOWN" ^0
"    by the standard" ^0
"  did a whole feature return empty : yes, from one null" ^0
"" ^0

# ---- null control ----

# The same list, filtered to non-null ids before the NOT IN (or written as a
# NOT EXISTS anti-join, which is null-safe).
0 => nc_returned_with_null_in_list
99960 => nc_returned_with_null_filtered
99960 => nc_accounts_it_recovers

"null control - drop the null before NOT IN (or NOT EXISTS)" ^0
"  returned, null in the list : " + str(nc_returned_with_null_in_list) ^0
"  returned, null filtered out : " + str(nc_returned_with_null_filtered) ^0
"  accounts it recovers : " + str(nc_accounts_it_recovers) ^0
"  no account and no block entry changed; the NULL stopped" ^0
"  turning every comparison unknown" ^0
"" ^0

# ---- the rule ----

"what a NOT IN block-list query guarantees" ^0
"  no returned account equals a listed id : exactly, the" ^0
"    engine's own NOT IN" ^0
"  the allowed accounts are returned : not addressed; the" ^0
"    list contains a NULL, and id NOT IN (..., NULL) is" ^0
"    UNKNOWN for every id, so the query returns 0 of " ^0
"    " + str(accounts_that_should_be_allowed) + " accounts that should have passed" ^0
"" ^0

"NOT IN is a chain of not-equals joined by AND, and one not-equal against NULL" ^0
"makes the whole chain unknown; the list that was meant to exclude a few ends up" ^0
"excluding everything, from a single missing value in it" ^0
"" ^0

"It uses the engine's NOT IN over a real block-list column for every account -" ^0
"correct SQL. One id in the list is NULL, so id NOT IN (..., NULL) is UNKNOWN for" ^0
"every row and the query returns " + str(accounts_the_query_returned) + " of " + str(accounts_that_should_be_allowed) + " allowed accounts, " ^0
"" + str(wrongly_excluded_per_myriad) + " per ten thousand wrongly excluded." ^0
```

## Python (deterministic transpilation)

```python
accounts = 100000
blocked_ids_that_are_real = 40
blocked_ids_that_are_null = 1
accounts_that_should_be_allowed = accounts - blocked_ids_that_are_real
accounts_the_query_returned = 0
accounts_wrongly_excluded = accounts_that_should_be_allowed - accounts_the_query_returned
wrongly_excluded_per_myriad = int(accounts_wrongly_excluded * 10000 / accounts_that_should_be_allowed)
print("accounts                        : " + str(accounts))
print("blocked ids that are real       : " + str(blocked_ids_that_are_real))
print("blocked ids that are null       : " + str(blocked_ids_that_are_null))
print("")
print("accounts that should be allowed : " + str(accounts_that_should_be_allowed))
print("accounts the query returned     : " + str(accounts_the_query_returned))
print("  wrongly excluded              : " + str(accounts_wrongly_excluded))
print("wrongly excluded                : " + str(wrongly_excluded_per_myriad) + " per ten thousand")
print("")
print("the not-blocked query")
print("  block list source : a real column, not a hard-coded")
print("    array")
print("  operator : the database's own NOT IN")
print("  over : every account")
print("  intent : accounts not on the block list")
print("  hand-built loops that could differ : 0")
print("  verdict : returns the allowed accounts")
print("")
print("  using the engine's NOT IN rather than a hand-built loop")
print("  is the part done right here, and it is why a real listed")
print("  id is reliably excluded")
print("")
print("id NOT IN (..., NULL)")
print("  what NOT IN expands to : id <> a AND id <> b AND ... AND")
print("    id <> NULL")
print("  what id <> NULL yields : UNKNOWN")
print("  what TRUE AND UNKNOWN yields : UNKNOWN")
print("  so the whole predicate : UNKNOWN for every id")
print("  rows a WHERE keeps when the predicate is UNKNOWN : none")
print("")
print("the result of the not-blocked query")
print("  accounts that should pass : " + str(accounts_that_should_be_allowed))
print("  accounts returned : " + str(accounts_the_query_returned))
print("  the one NULL responsible : a single null id in the list")
print("  is the query wrong : no; NOT IN with a NULL is UNKNOWN")
print("    by the standard")
print("  did a whole feature return empty : yes, from one null")
print("")
nc_returned_with_null_in_list = 0
nc_returned_with_null_filtered = 99960
nc_accounts_it_recovers = 99960
print("null control - drop the null before NOT IN (or NOT EXISTS)")
print("  returned, null in the list : " + str(nc_returned_with_null_in_list))
print("  returned, null filtered out : " + str(nc_returned_with_null_filtered))
print("  accounts it recovers : " + str(nc_accounts_it_recovers))
print("  no account and no block entry changed; the NULL stopped")
print("  turning every comparison unknown")
print("")
print("what a NOT IN block-list query guarantees")
print("  no returned account equals a listed id : exactly, the")
print("    engine's own NOT IN")
print("  the allowed accounts are returned : not addressed; the")
print("    list contains a NULL, and id NOT IN (..., NULL) is")
print("    UNKNOWN for every id, so the query returns 0 of ")
print("    " + str(accounts_that_should_be_allowed) + " accounts that should have passed")
print("")
print("NOT IN is a chain of not-equals joined by AND, and one not-equal against NULL")
print("makes the whole chain unknown; the list that was meant to exclude a few ends up")
print("excluding everything, from a single missing value in it")
print("")
print("It uses the engine's NOT IN over a real block-list column for every account -")
print("correct SQL. One id in the list is NULL, so id NOT IN (..., NULL) is UNKNOWN for")
print("every row and the query returns " + str(accounts_the_query_returned) + " of " + str(accounts_that_should_be_allowed) + " allowed accounts, ")
print("" + str(wrongly_excluded_per_myriad) + " per ten thousand wrongly excluded.")
```

## stdout (executed)

```text
accounts                        : 100000
blocked ids that are real       : 40
blocked ids that are null       : 1

accounts that should be allowed : 99960
accounts the query returned     : 0
  wrongly excluded              : 99960
wrongly excluded                : 10000 per ten thousand

the not-blocked query
  block list source : a real column, not a hard-coded
    array
  operator : the database's own NOT IN
  over : every account
  intent : accounts not on the block list
  hand-built loops that could differ : 0
  verdict : returns the allowed accounts

  using the engine's NOT IN rather than a hand-built loop
  is the part done right here, and it is why a real listed
  id is reliably excluded

id NOT IN (..., NULL)
  what NOT IN expands to : id <> a AND id <> b AND ... AND
    id <> NULL
  what id <> NULL yields : UNKNOWN
  what TRUE AND UNKNOWN yields : UNKNOWN
  so the whole predicate : UNKNOWN for every id
  rows a WHERE keeps when the predicate is UNKNOWN : none

the result of the not-blocked query
  accounts that should pass : 99960
  accounts returned : 0
  the one NULL responsible : a single null id in the list
  is the query wrong : no; NOT IN with a NULL is UNKNOWN
    by the standard
  did a whole feature return empty : yes, from one null

null control - drop the null before NOT IN (or NOT EXISTS)
  returned, null in the list : 0
  returned, null filtered out : 99960
  accounts it recovers : 99960
  no account and no block entry changed; the NULL stopped
  turning every comparison unknown

what a NOT IN block-list query guarantees
  no returned account equals a listed id : exactly, the
    engine's own NOT IN
  the allowed accounts are returned : not addressed; the
    list contains a NULL, and id NOT IN (..., NULL) is
    UNKNOWN for every id, so the query returns 0 of 
    99960 accounts that should have passed

NOT IN is a chain of not-equals joined by AND, and one not-equal against NULL
makes the whole chain unknown; the list that was meant to exclude a few ends up
excluding everything, from a single missing value in it

It uses the engine's NOT IN over a real block-list column for every account -
correct SQL. One id in the list is NULL, so id NOT IN (..., NULL) is UNKNOWN for
every row and the query returns 0 of 99960 allowed accounts, 
10000 per ten thousand wrongly excluded.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
