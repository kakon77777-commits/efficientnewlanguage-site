<!-- canonical: efficientnewlanguage.org/ai/examples/729-the-tests-were-parallel-and-the-fixture-was-shared | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 729 — The tests were parallel and the fixture was shared

`the_tests_were_parallel_and_the_fixture_was_shared.eml` - Every test runs inside a transaction that is rolled back afterwards, so no test can see another's rows. What a rollback restores is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every test runs
# inside a transaction that is rolled back afterwards, so no test can see
# another's rows. What a rollback restores is computed below.
#
# The isolation is the real thing, not a convention. Each test opens a
# transaction before its first line and rolls it back after its last, so a test
# that writes a thousand rows leaves none; the suite has been run in randomised
# order for a year; and the number of failures caused by one test seeing
# another's database rows is zero. Four thousand two hundred tests across eight
# workers.
#
# A rollback restores the DATABASE. Three caches live in the worker process and
# a transaction has no opinion about process memory, so a test that changes one
# of them changes it for every later test in that worker.
#
# Twenty-six tests mutate one of the three.

4200 => tests
8 => workers
4200 => tests_wrapped_in_a_rolled_back_transaction
0 => rows_leaking_between_tests
365 => days_of_randomised_order_runs
3 => process_caches_that_survive_a_rollback
26 => tests_that_mutate_one_of_them
140 => tests_whose_result_depends_on_whether_one_ran_first
212 => retried_infra_failures_last_quarter
148 => retried_failures_traced_to_the_shared_cache
0 => rollback_hooks_that_reset_a_process_cache

int(tests_whose_result_depends_on_whether_one_ran_first * 10000 / tests) => order_dependent_per_myriad
retried_infra_failures_last_quarter - retried_failures_traced_to_the_shared_cache => retries_with_another_cause

"tests                           : " + str(tests) ^0
"workers                         : " + str(workers) ^0
"wrapped in a rolled-back transaction : " + str(tests_wrapped_in_a_rolled_back_transaction) ^0
"rows leaking between tests      : " + str(rows_leaking_between_tests) ^0
"days of randomised-order runs   : " + str(days_of_randomised_order_runs) ^0
"" ^0
"process caches surviving a rollback : " + str(process_caches_that_survive_a_rollback) ^0
"rollback hooks that reset one   : " + str(rollback_hooks_that_reset_a_process_cache) ^0
"tests that mutate one           : " + str(tests_that_mutate_one_of_them) ^0
"tests whose result depends on order : " + str(tests_whose_result_depends_on_whether_one_ran_first) ^0
"  share of the suite            : " + str(order_dependent_per_myriad) + " per ten thousand" ^0
"" ^0
"retried infra failures last quarter : " + str(retried_infra_failures_last_quarter) ^0
"  traced to the shared cache    : " + str(retried_failures_traced_to_the_shared_cache) ^0
"  with another cause            : " + str(retries_with_another_cause) ^0
"" ^0

# ---- what the transaction verified ----

"the isolation" ^0
"  where the transaction opens : before the test's first" ^0
"    line" ^0
"  where it rolls back         : after its last, always" ^0
"  a test writing a thousand rows leaves : none" ^0
"  randomised order runs        : " + str(days_of_randomised_order_runs) + " days of them" ^0
"  failures from one test seeing another's rows : " + str(rows_leaking_between_tests) ^0
"  verdict : ISOLATED" ^0
"" ^0
"  a rollback per test is stronger than truncating between" ^0
"  files and it is why the database is genuinely clean" ^0
"" ^0

# ---- what a rollback is about ----

"the rollback" ^0
"  restores : everything the transaction wrote" ^0
"  which is : rows" ^0
"  what else the test changed : an in-process cache of" ^0
"    feature flags, of the tenant record, of the currency" ^0
"    table" ^0
"  what a transaction knows about those : nothing; they" ^0
"    are variables in a process" ^0
"  hooks that reset them : " + str(rollback_hooks_that_reset_a_process_cache) ^0
"" ^0
"  the boundary is drawn around the database and the test" ^0
"  runs in a process that outlives it" ^0
"" ^0
# ---- why randomised order did not find it ----

# Randomising the order is the right instrument for order dependence and it has
# run for a year. It shuffles tests within a worker, and a shuffle changes
# which pairs occur, so a failure appears in some runs and not others - which
# is the definition the team already has for an infra flake.
"the randomisation" ^0
"  what it shuffles : the order within each worker" ^0
"  what that produces : a different set of pairs each run" ^0
"  so a dependent test fails : sometimes" ^0
"  what a sometimes-failing test is called here : a flake" ^0
"  what a flake gets : a retry, which runs it alone or" ^0
"    after a different neighbour, and it passes" ^0
"  retried infra failures last quarter : " + str(retried_infra_failures_last_quarter) ^0
"" ^0

# ---- the retry is the thing that hides it ----

# A retry re-runs the test in a new position. The property that made it fail
# was its position, so the retry is very likely to pass, and a test that fails
# then passes is filed as environmental.
"one retried failure" ^0
"  first run  : after a test that mutated the flag cache" ^0
"  retry      : in a different position" ^0
"  result     : passes" ^0
"  conclusion recorded : environment" ^0
"  what would distinguish it : re-running in the SAME" ^0
"    position with the same neighbours, which the retry" ^0
"    does not do" ^0
"  tests whose result depends on a neighbour : " + str(tests_whose_result_depends_on_whether_one_ran_first) ^0
"" ^0

# ---- what the clean-database number means ----

"the zero" ^0
"  failures from one test seeing another's rows : " + str(rows_leaking_between_tests) ^0
"  is that number right : yes, and it was worth building" ^0
"  what it counts : leakage through the database" ^0
"  what it does not count : leakage through the " + str(process_caches_that_survive_a_rollback) ^0
"    caches, which no counter watches" ^0
"  tests in the suite : " + str(tests) + ", of which " + str(tests_whose_result_depends_on_whether_one_ran_first) + " are exposed" ^0
"" ^0

# ---- null control ----

# The same suite, with the rollback hook also clearing the three process caches
# it cannot roll back.
process_caches_that_survive_a_rollback => nc_rollback_hooks_that_reset_a_process_cache
0 => nc_tests_whose_result_depends_on_order

"null control - the hook clears what it cannot roll back" ^0
"  rows leaking between tests : " + str(rows_leaking_between_tests) + ", unchanged" ^0
"  hooks resetting a process cache : " + str(nc_rollback_hooks_that_reset_a_process_cache) ^0
"  tests whose result depends on order : " + str(nc_tests_whose_result_depends_on_order) ^0
"  the isolation did not get stronger; the boundary moved" ^0
"  from the transaction to the test" ^0
"" ^0

# ---- the rule ----

"what a per-test transaction guarantees" ^0
"  no test sees another test's rows : exactly, for all" ^0
"    " + str(tests) + " of them, for " + str(days_of_randomised_order_runs) + " days of randomised order" ^0
"  no test sees another test's effects : not addressed;" ^0
"    the transaction bounds a database session, and a test" ^0
"    also runs code" ^0
"" ^0
"isolation is scoped to the store the mechanism understands;" ^0
"randomising the order is the right instrument and it turns a" ^0
"dependency into an intermittent failure, which a retry then" ^0
"converts into an environmental one" ^0
"" ^0

"Every one of " + str(tests) + " tests runs inside a transaction that is rolled back, so rows" ^0
"leaking between tests number " + str(rows_leaking_between_tests) + " across " + str(days_of_randomised_order_runs) + " days of randomised order. A" ^0
"rollback restores the database and not the " + str(process_caches_that_survive_a_rollback) + " caches in the worker process," ^0
"reset by " + str(rollback_hooks_that_reset_a_process_cache) + " hooks, so " + str(tests_that_mutate_one_of_them) + " tests change what " + str(tests_whose_result_depends_on_whether_one_ran_first) + " others see -" ^0
str(order_dependent_per_myriad) + " per ten thousand of the suite - inside " + str(retried_infra_failures_last_quarter) + " retried infra failures." ^0
```

## Python (deterministic transpilation)

```python
tests = 4200
workers = 8
tests_wrapped_in_a_rolled_back_transaction = 4200
rows_leaking_between_tests = 0
days_of_randomised_order_runs = 365
process_caches_that_survive_a_rollback = 3
tests_that_mutate_one_of_them = 26
tests_whose_result_depends_on_whether_one_ran_first = 140
retried_infra_failures_last_quarter = 212
retried_failures_traced_to_the_shared_cache = 148
rollback_hooks_that_reset_a_process_cache = 0
order_dependent_per_myriad = int(tests_whose_result_depends_on_whether_one_ran_first * 10000 / tests)
retries_with_another_cause = retried_infra_failures_last_quarter - retried_failures_traced_to_the_shared_cache
print("tests                           : " + str(tests))
print("workers                         : " + str(workers))
print("wrapped in a rolled-back transaction : " + str(tests_wrapped_in_a_rolled_back_transaction))
print("rows leaking between tests      : " + str(rows_leaking_between_tests))
print("days of randomised-order runs   : " + str(days_of_randomised_order_runs))
print("")
print("process caches surviving a rollback : " + str(process_caches_that_survive_a_rollback))
print("rollback hooks that reset one   : " + str(rollback_hooks_that_reset_a_process_cache))
print("tests that mutate one           : " + str(tests_that_mutate_one_of_them))
print("tests whose result depends on order : " + str(tests_whose_result_depends_on_whether_one_ran_first))
print("  share of the suite            : " + str(order_dependent_per_myriad) + " per ten thousand")
print("")
print("retried infra failures last quarter : " + str(retried_infra_failures_last_quarter))
print("  traced to the shared cache    : " + str(retried_failures_traced_to_the_shared_cache))
print("  with another cause            : " + str(retries_with_another_cause))
print("")
print("the isolation")
print("  where the transaction opens : before the test's first")
print("    line")
print("  where it rolls back         : after its last, always")
print("  a test writing a thousand rows leaves : none")
print("  randomised order runs        : " + str(days_of_randomised_order_runs) + " days of them")
print("  failures from one test seeing another's rows : " + str(rows_leaking_between_tests))
print("  verdict : ISOLATED")
print("")
print("  a rollback per test is stronger than truncating between")
print("  files and it is why the database is genuinely clean")
print("")
print("the rollback")
print("  restores : everything the transaction wrote")
print("  which is : rows")
print("  what else the test changed : an in-process cache of")
print("    feature flags, of the tenant record, of the currency")
print("    table")
print("  what a transaction knows about those : nothing; they")
print("    are variables in a process")
print("  hooks that reset them : " + str(rollback_hooks_that_reset_a_process_cache))
print("")
print("  the boundary is drawn around the database and the test")
print("  runs in a process that outlives it")
print("")
print("the randomisation")
print("  what it shuffles : the order within each worker")
print("  what that produces : a different set of pairs each run")
print("  so a dependent test fails : sometimes")
print("  what a sometimes-failing test is called here : a flake")
print("  what a flake gets : a retry, which runs it alone or")
print("    after a different neighbour, and it passes")
print("  retried infra failures last quarter : " + str(retried_infra_failures_last_quarter))
print("")
print("one retried failure")
print("  first run  : after a test that mutated the flag cache")
print("  retry      : in a different position")
print("  result     : passes")
print("  conclusion recorded : environment")
print("  what would distinguish it : re-running in the SAME")
print("    position with the same neighbours, which the retry")
print("    does not do")
print("  tests whose result depends on a neighbour : " + str(tests_whose_result_depends_on_whether_one_ran_first))
print("")
print("the zero")
print("  failures from one test seeing another's rows : " + str(rows_leaking_between_tests))
print("  is that number right : yes, and it was worth building")
print("  what it counts : leakage through the database")
print("  what it does not count : leakage through the " + str(process_caches_that_survive_a_rollback))
print("    caches, which no counter watches")
print("  tests in the suite : " + str(tests) + ", of which " + str(tests_whose_result_depends_on_whether_one_ran_first) + " are exposed")
print("")
nc_rollback_hooks_that_reset_a_process_cache = process_caches_that_survive_a_rollback
nc_tests_whose_result_depends_on_order = 0
print("null control - the hook clears what it cannot roll back")
print("  rows leaking between tests : " + str(rows_leaking_between_tests) + ", unchanged")
print("  hooks resetting a process cache : " + str(nc_rollback_hooks_that_reset_a_process_cache))
print("  tests whose result depends on order : " + str(nc_tests_whose_result_depends_on_order))
print("  the isolation did not get stronger; the boundary moved")
print("  from the transaction to the test")
print("")
print("what a per-test transaction guarantees")
print("  no test sees another test's rows : exactly, for all")
print("    " + str(tests) + " of them, for " + str(days_of_randomised_order_runs) + " days of randomised order")
print("  no test sees another test's effects : not addressed;")
print("    the transaction bounds a database session, and a test")
print("    also runs code")
print("")
print("isolation is scoped to the store the mechanism understands;")
print("randomising the order is the right instrument and it turns a")
print("dependency into an intermittent failure, which a retry then")
print("converts into an environmental one")
print("")
print("Every one of " + str(tests) + " tests runs inside a transaction that is rolled back, so rows")
print("leaking between tests number " + str(rows_leaking_between_tests) + " across " + str(days_of_randomised_order_runs) + " days of randomised order. A")
print("rollback restores the database and not the " + str(process_caches_that_survive_a_rollback) + " caches in the worker process,")
print("reset by " + str(rollback_hooks_that_reset_a_process_cache) + " hooks, so " + str(tests_that_mutate_one_of_them) + " tests change what " + str(tests_whose_result_depends_on_whether_one_ran_first) + " others see -")
print(str(order_dependent_per_myriad) + " per ten thousand of the suite - inside " + str(retried_infra_failures_last_quarter) + " retried infra failures.")
```

## stdout (executed)

```text
tests                           : 4200
workers                         : 8
wrapped in a rolled-back transaction : 4200
rows leaking between tests      : 0
days of randomised-order runs   : 365

process caches surviving a rollback : 3
rollback hooks that reset one   : 0
tests that mutate one           : 26
tests whose result depends on order : 140
  share of the suite            : 333 per ten thousand

retried infra failures last quarter : 212
  traced to the shared cache    : 148
  with another cause            : 64

the isolation
  where the transaction opens : before the test's first
    line
  where it rolls back         : after its last, always
  a test writing a thousand rows leaves : none
  randomised order runs        : 365 days of them
  failures from one test seeing another's rows : 0
  verdict : ISOLATED

  a rollback per test is stronger than truncating between
  files and it is why the database is genuinely clean

the rollback
  restores : everything the transaction wrote
  which is : rows
  what else the test changed : an in-process cache of
    feature flags, of the tenant record, of the currency
    table
  what a transaction knows about those : nothing; they
    are variables in a process
  hooks that reset them : 0

  the boundary is drawn around the database and the test
  runs in a process that outlives it

the randomisation
  what it shuffles : the order within each worker
  what that produces : a different set of pairs each run
  so a dependent test fails : sometimes
  what a sometimes-failing test is called here : a flake
  what a flake gets : a retry, which runs it alone or
    after a different neighbour, and it passes
  retried infra failures last quarter : 212

one retried failure
  first run  : after a test that mutated the flag cache
  retry      : in a different position
  result     : passes
  conclusion recorded : environment
  what would distinguish it : re-running in the SAME
    position with the same neighbours, which the retry
    does not do
  tests whose result depends on a neighbour : 140

the zero
  failures from one test seeing another's rows : 0
  is that number right : yes, and it was worth building
  what it counts : leakage through the database
  what it does not count : leakage through the 3
    caches, which no counter watches
  tests in the suite : 4200, of which 140 are exposed

null control - the hook clears what it cannot roll back
  rows leaking between tests : 0, unchanged
  hooks resetting a process cache : 3
  tests whose result depends on order : 0
  the isolation did not get stronger; the boundary moved
  from the transaction to the test

what a per-test transaction guarantees
  no test sees another test's rows : exactly, for all
    4200 of them, for 365 days of randomised order
  no test sees another test's effects : not addressed;
    the transaction bounds a database session, and a test
    also runs code

isolation is scoped to the store the mechanism understands;
randomising the order is the right instrument and it turns a
dependency into an intermittent failure, which a retry then
converts into an environmental one

Every one of 4200 tests runs inside a transaction that is rolled back, so rows
leaking between tests number 0 across 365 days of randomised order. A
rollback restores the database and not the 3 caches in the worker process,
reset by 0 hooks, so 26 tests change what 140 others see -
333 per ten thousand of the suite - inside 212 retried infra failures.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
