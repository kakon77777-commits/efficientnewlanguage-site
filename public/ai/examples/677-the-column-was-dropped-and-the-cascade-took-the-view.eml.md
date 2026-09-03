<!-- canonical: efficientnewlanguage.org/ai/examples/677-the-column-was-dropped-and-the-cascade-took-the-view | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 677 — The column was dropped and the cascade took the view

`the_column_was_dropped_and_the_cascade_took_the_view.eml` - Thirty-four repositories were searched for references to the column and none was found. What the drop removed is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Thirty-four
# repositories were searched for references to the column and none was found.
# What the drop removed is computed below.
#
# The search was done properly. Every repository the organisation owns, not just
# the obvious ones; the column name and its camel-case and snake-case spellings;
# generated clients as well as hand-written ones; and the two hits it did find
# were in a changelog and a migration that had already run. Zero live references
# is a real zero and finding it took an afternoon.
#
# It searched CODE. The database holds objects of its own that reference the
# column, and the drop refused until it was told to proceed anyway.
#
# `CASCADE` is not a force flag. It is a request to drop whatever depends on
# this, and the statement does not say what that turned out to be.

34 => repositories_searched
0 => live_code_references_found
2 => hits_in_a_changelog_or_a_spent_migration
3 => database_objects_dropped_by_the_cascade
11 => dashboards_reading_the_view
9 => days_until_it_was_noticed

"repositories searched          : " + str(repositories_searched) ^0
"live code references found     : " + str(live_code_references_found) ^0
"hits in a changelog or a spent migration : " + str(hits_in_a_changelog_or_a_spent_migration) ^0
"" ^0
"database objects the cascade dropped : " + str(database_objects_dropped_by_the_cascade) ^0
"dashboards reading the view    : " + str(dashboards_reading_the_view) ^0
"days until it was noticed      : " + str(days_until_it_was_noticed) ^0
"" ^0

# ---- what the search verified ----

"the reference search" ^0
"  repositories        : " + str(repositories_searched) + ", every one the organisation owns" ^0
"  spellings           : the column name, camel case, snake case" ^0
"  generated clients   : searched as well as hand-written code" ^0
"  live references     : " + str(live_code_references_found) ^0
"  hits, both dead     : " + str(hits_in_a_changelog_or_a_spent_migration) ^0
"  verdict             : UNREFERENCED" ^0
"" ^0
"  this took an afternoon and it is the right way to do it" ^0
"" ^0

# ---- what it did not search ----

"the objects the search cannot see" ^0
"  a view selecting the column : in the database" ^0
"  an index on it              : in the database" ^0
"  a constraint mentioning it  : in the database" ^0
"  where their definitions live : the catalog, not a" ^0
"    repository" ^0
"  what the drop did when it met them : refused" ^0
"" ^0
"  the refusal was the system reporting exactly this, and" ^0
"  the response to a refusal is what turned it off" ^0
"" ^0

# ---- what CASCADE says ----

"the second attempt" ^0
"  statement           : the same drop, with CASCADE" ^0
"  what CASCADE means  : drop whatever depends on this too" ^0
"  what it printed     : that it had done so" ^0
"  what it named       : nothing" ^0
"  objects removed     : " + str(database_objects_dropped_by_the_cascade) ^0
"" ^0
"  the flag reads as 'yes, I am sure about the column' and" ^0
"  means 'and about everything downstream of it'" ^0
"" ^0

"dashboards on the dropped view : " + str(dashboards_reading_the_view) + ", all of them" ^0
"" ^0

# ---- why nine days ----

# The dashboards did not error. The view was gone, the query returned an
# object-does-not-exist, and the panel rendered its empty state, which is what
# it renders for a quiet week.
"how a dropped view looks on a dashboard" ^0
"  the query errors    : yes" ^0
"  the panel shows     : its empty state" ^0
"  what an empty state means the rest of the time : a quiet" ^0
"    period" ^0
"  an alert on no-data : not configured, because no-data is" ^0
"    normal at night" ^0
"" ^0

# ---- null control ----

# The same drop, run without CASCADE, and the refusal read as a list.
0 => nc_objects_dropped_unknowingly
database_objects_dropped_by_the_cascade => nc_objects_the_refusal_names

"null control - the refusal read instead of overridden" ^0
"  live code references : " + str(live_code_references_found) + ", unchanged" ^0
"  objects the refusal names : " + str(nc_objects_the_refusal_names) ^0
"  objects dropped unknowingly : " + str(nc_objects_dropped_unknowingly) ^0
"  the search did not need to be better; the database had" ^0
"  already produced the list the search could not" ^0
"" ^0

# ---- the rule ----

"what an exhaustive code search guarantees" ^0
"  no code refers to this : exactly, and thoroughly" ^0
"  nothing refers to this : not addressed; a database holds" ^0
"    definitions of its own, and they are not in any" ^0
"    repository" ^0
"" ^0
"a search covers the corpus it is run over; the objects most" ^0
"likely to be missed are the ones stored somewhere that is" ^0
"not a file, and the system that holds them will say so if" ^0
"the refusal is read rather than overridden" ^0
"" ^0

"The search covered all " + str(repositories_searched) + " repositories, three spellings and the generated" ^0
"clients, found " + str(live_code_references_found) + " live references and " + str(hits_in_a_changelog_or_a_spent_migration) + " dead ones, and took an afternoon." ^0
"The drop refused, CASCADE was added, and " + str(database_objects_dropped_by_the_cascade) + " database objects went with the column -" ^0
"including a view " + str(dashboards_reading_the_view) + " dashboards read, which showed their empty state for" ^0
str(days_until_it_was_noticed) + " days because an empty state is what a quiet period looks like." ^0
```

## Python (deterministic transpilation)

```python
repositories_searched = 34
live_code_references_found = 0
hits_in_a_changelog_or_a_spent_migration = 2
database_objects_dropped_by_the_cascade = 3
dashboards_reading_the_view = 11
days_until_it_was_noticed = 9
print("repositories searched          : " + str(repositories_searched))
print("live code references found     : " + str(live_code_references_found))
print("hits in a changelog or a spent migration : " + str(hits_in_a_changelog_or_a_spent_migration))
print("")
print("database objects the cascade dropped : " + str(database_objects_dropped_by_the_cascade))
print("dashboards reading the view    : " + str(dashboards_reading_the_view))
print("days until it was noticed      : " + str(days_until_it_was_noticed))
print("")
print("the reference search")
print("  repositories        : " + str(repositories_searched) + ", every one the organisation owns")
print("  spellings           : the column name, camel case, snake case")
print("  generated clients   : searched as well as hand-written code")
print("  live references     : " + str(live_code_references_found))
print("  hits, both dead     : " + str(hits_in_a_changelog_or_a_spent_migration))
print("  verdict             : UNREFERENCED")
print("")
print("  this took an afternoon and it is the right way to do it")
print("")
print("the objects the search cannot see")
print("  a view selecting the column : in the database")
print("  an index on it              : in the database")
print("  a constraint mentioning it  : in the database")
print("  where their definitions live : the catalog, not a")
print("    repository")
print("  what the drop did when it met them : refused")
print("")
print("  the refusal was the system reporting exactly this, and")
print("  the response to a refusal is what turned it off")
print("")
print("the second attempt")
print("  statement           : the same drop, with CASCADE")
print("  what CASCADE means  : drop whatever depends on this too")
print("  what it printed     : that it had done so")
print("  what it named       : nothing")
print("  objects removed     : " + str(database_objects_dropped_by_the_cascade))
print("")
print("  the flag reads as 'yes, I am sure about the column' and")
print("  means 'and about everything downstream of it'")
print("")
print("dashboards on the dropped view : " + str(dashboards_reading_the_view) + ", all of them")
print("")
print("how a dropped view looks on a dashboard")
print("  the query errors    : yes")
print("  the panel shows     : its empty state")
print("  what an empty state means the rest of the time : a quiet")
print("    period")
print("  an alert on no-data : not configured, because no-data is")
print("    normal at night")
print("")
nc_objects_dropped_unknowingly = 0
nc_objects_the_refusal_names = database_objects_dropped_by_the_cascade
print("null control - the refusal read instead of overridden")
print("  live code references : " + str(live_code_references_found) + ", unchanged")
print("  objects the refusal names : " + str(nc_objects_the_refusal_names))
print("  objects dropped unknowingly : " + str(nc_objects_dropped_unknowingly))
print("  the search did not need to be better; the database had")
print("  already produced the list the search could not")
print("")
print("what an exhaustive code search guarantees")
print("  no code refers to this : exactly, and thoroughly")
print("  nothing refers to this : not addressed; a database holds")
print("    definitions of its own, and they are not in any")
print("    repository")
print("")
print("a search covers the corpus it is run over; the objects most")
print("likely to be missed are the ones stored somewhere that is")
print("not a file, and the system that holds them will say so if")
print("the refusal is read rather than overridden")
print("")
print("The search covered all " + str(repositories_searched) + " repositories, three spellings and the generated")
print("clients, found " + str(live_code_references_found) + " live references and " + str(hits_in_a_changelog_or_a_spent_migration) + " dead ones, and took an afternoon.")
print("The drop refused, CASCADE was added, and " + str(database_objects_dropped_by_the_cascade) + " database objects went with the column -")
print("including a view " + str(dashboards_reading_the_view) + " dashboards read, which showed their empty state for")
print(str(days_until_it_was_noticed) + " days because an empty state is what a quiet period looks like.")
```

## stdout (executed)

```text
repositories searched          : 34
live code references found     : 0
hits in a changelog or a spent migration : 2

database objects the cascade dropped : 3
dashboards reading the view    : 11
days until it was noticed      : 9

the reference search
  repositories        : 34, every one the organisation owns
  spellings           : the column name, camel case, snake case
  generated clients   : searched as well as hand-written code
  live references     : 0
  hits, both dead     : 2
  verdict             : UNREFERENCED

  this took an afternoon and it is the right way to do it

the objects the search cannot see
  a view selecting the column : in the database
  an index on it              : in the database
  a constraint mentioning it  : in the database
  where their definitions live : the catalog, not a
    repository
  what the drop did when it met them : refused

  the refusal was the system reporting exactly this, and
  the response to a refusal is what turned it off

the second attempt
  statement           : the same drop, with CASCADE
  what CASCADE means  : drop whatever depends on this too
  what it printed     : that it had done so
  what it named       : nothing
  objects removed     : 3

  the flag reads as 'yes, I am sure about the column' and
  means 'and about everything downstream of it'

dashboards on the dropped view : 11, all of them

how a dropped view looks on a dashboard
  the query errors    : yes
  the panel shows     : its empty state
  what an empty state means the rest of the time : a quiet
    period
  an alert on no-data : not configured, because no-data is
    normal at night

null control - the refusal read instead of overridden
  live code references : 0, unchanged
  objects the refusal names : 3
  objects dropped unknowingly : 0
  the search did not need to be better; the database had
  already produced the list the search could not

what an exhaustive code search guarantees
  no code refers to this : exactly, and thoroughly
  nothing refers to this : not addressed; a database holds
    definitions of its own, and they are not in any
    repository

a search covers the corpus it is run over; the objects most
likely to be missed are the ones stored somewhere that is
not a file, and the system that holds them will say so if
the refusal is read rather than overridden

The search covered all 34 repositories, three spellings and the generated
clients, found 0 live references and 2 dead ones, and took an afternoon.
The drop refused, CASCADE was added, and 3 database objects went with the column -
including a view 11 dashboards read, which showed their empty state for
9 days because an empty state is what a quiet period looks like.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
