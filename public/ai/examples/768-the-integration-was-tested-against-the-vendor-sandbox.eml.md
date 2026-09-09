<!-- canonical: efficientnewlanguage.org/ai/examples/768-the-integration-was-tested-against-the-vendor-sandbox | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 768 — The integration was tested against the vendor sandbox

`the_integration_was_tested_against_the_vendor_sandbox.eml` - The payment integration has three hundred and forty tests that run against the vendor's sandbox on every commit, and they cover the vendor's documented error codes rather than our own wrapper. Which counterparty answers them is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The payment
# integration has three hundred and forty tests that run against the vendor's
# sandbox on every commit, and they cover the vendor's documented error codes
# rather than our own wrapper. Which counterparty answers them is computed
# below.
#
# The suite is well built. It asserts on the vendor's own error codes rather
# than on the exception types our client library invents; it runs on every
# commit rather than nightly, so a break is attributed to one change; it covers
# the failure codes and not only the success path; and it has been maintained
# for twenty-nine months rather than written once.
#
# It talks to the sandbox. The sandbox is operated by the vendor and is not the
# vendor.

340 => tests_against_the_sandbox
610 => suite_runs_a_month
29 => months_of_the_practice
46 => documented_error_codes
44 => documented_codes_the_sandbox_can_produce
4 => undocumented_codes_production_returned_last_year
0 => sandbox_rate_limit_per_second
25 => production_rate_limit_per_second
12 => id_characters_in_the_sandbox
26 => id_characters_in_production
20 => id_column_width_in_our_store
3 => incidents_from_a_response_the_sandbox_never_sends
0 => tests_that_run_against_the_vendor

documented_error_codes + undocumented_codes_production_returned_last_year => codes_production_can_return
documented_error_codes - documented_codes_the_sandbox_can_produce => documented_codes_the_sandbox_cannot_produce
codes_production_can_return - documented_codes_the_sandbox_can_produce => codes_no_test_has_ever_seen
id_characters_in_production - id_column_width_in_our_store => characters_the_real_id_overflows_by
id_column_width_in_our_store - id_characters_in_the_sandbox => characters_of_headroom_the_sandbox_showed
int(documented_codes_the_sandbox_can_produce * 10000 / codes_production_can_return) => codes_covered_per_myriad

"tests against the sandbox       : " + str(tests_against_the_sandbox) ^0
"suite runs a month              : " + str(suite_runs_a_month) ^0
"months of the practice          : " + str(months_of_the_practice) ^0
"tests that run against the vendor : " + str(tests_that_run_against_the_vendor) ^0
"" ^0
"documented error codes          : " + str(documented_error_codes) ^0
"  the sandbox can produce       : " + str(documented_codes_the_sandbox_can_produce) ^0
"  it cannot                     : " + str(documented_codes_the_sandbox_cannot_produce) ^0
"undocumented codes production sent : " + str(undocumented_codes_production_returned_last_year) ^0
"codes production can return     : " + str(codes_production_can_return) ^0
"  no test has ever seen         : " + str(codes_no_test_has_ever_seen) ^0
"  covered                       : " + str(codes_covered_per_myriad) + " per ten thousand" ^0
"" ^0
"rate limit, sandbox, per second : " + str(sandbox_rate_limit_per_second) ^0
"rate limit, production          : " + str(production_rate_limit_per_second) ^0
"id characters, sandbox          : " + str(id_characters_in_the_sandbox) ^0
"id characters, production       : " + str(id_characters_in_production) ^0
"our column width                : " + str(id_column_width_in_our_store) ^0
"  headroom the sandbox showed   : " + str(characters_of_headroom_the_sandbox_showed) ^0
"  overflow the vendor sends     : " + str(characters_the_real_id_overflows_by) ^0
"incidents from an unseen response : " + str(incidents_from_a_response_the_sandbox_never_sends) ^0
"" ^0

# ---- what the suite verified ----

"the integration suite" ^0
"  what it asserts on : the vendor's own error codes, not" ^0
"    the exception types our client library invents" ^0
"  when it runs : every commit, so a break belongs to one" ^0
"    change" ^0
"  what it covers : the failure codes, not only the" ^0
"    success path" ^0
"  runs a month : " + str(suite_runs_a_month) + ", for " + str(months_of_the_practice) + " months" ^0
"  verdict : COVERED" ^0
"" ^0
"  asserting on the vendor's codes rather than on our own" ^0
"  wrapper is the part almost nobody does, and it is why" ^0
"  the " + str(tests_against_the_sandbox) + " tests survive a client-library upgrade" ^0
"" ^0

# ---- which counterparty answers ----

"two counterparties" ^0
"  who the tests talk to : the sandbox, operated by the" ^0
"    vendor" ^0
"  who production talks to : the vendor" ^0
"  codes the sandbox can produce : " ^0
"    " + str(documented_codes_the_sandbox_can_produce) ^0
"  codes production can return : " + str(codes_production_can_return) ^0
"  so codes no test has ever seen : " ^0
"    " + str(codes_no_test_has_ever_seen) ^0
"  tests that talk to the vendor : " ^0
"    " + str(tests_that_run_against_the_vendor) ^0
"" ^0
"  the suite is complete against the thing it questions," ^0
"  and the thing it questions was built to be easy to" ^0
"  question" ^0
"" ^0

# ---- what differs besides the codes ----

"the shape of an answer" ^0
"  identifier length, sandbox : " ^0
"    " + str(id_characters_in_the_sandbox) + " characters" ^0
"  our column : " + str(id_column_width_in_our_store) + " characters, " ^0
"    " + str(characters_of_headroom_the_sandbox_showed) + " to spare against the sandbox" ^0
"  identifier length, production : " ^0
"    " + str(id_characters_in_production) + " characters" ^0
"  so the real identifier overflows by : " ^0
"    " + str(characters_the_real_id_overflows_by) + " characters" ^0
"  rate limit the tests ever met : " ^0
"    " + str(sandbox_rate_limit_per_second) + " per second" ^0
"  incidents from a response no test can produce : " ^0
"    " + str(incidents_from_a_response_the_sandbox_never_sends) ^0
"" ^0

# ---- null control ----

# The same suite, pointed at a real vendor account with small real amounts, run
# once a night alongside the sandbox runs.
50 => nc_codes_a_test_can_now_see
26 => nc_id_characters_the_tests_see
25 => nc_rate_limit_the_tests_meet

"null control - run it against the vendor, with real money" ^0
"  tests : " + str(tests_against_the_sandbox) + ", unchanged" ^0
"  codes a test can now see : " + str(nc_codes_a_test_can_now_see) ^0
"  id characters the tests see : " + str(nc_id_characters_the_tests_see) ^0
"  rate limit the tests meet : " + str(nc_rate_limit_the_tests_meet) + " per second" ^0
"  the assertions did not improve; they were pointed at" ^0
"  the counterparty the promise is about" ^0
"" ^0

# ---- the rule ----

"what a green integration suite guarantees" ^0
"  every documented error the sandbox can produce is" ^0
"    handled : exactly, " + str(tests_against_the_sandbox) + " tests, " + str(suite_runs_a_month) + " runs a month," ^0
"    " + str(months_of_the_practice) + " months" ^0
"  every response the vendor sends is handled : not" ^0
"    addressed; " + str(codes_no_test_has_ever_seen) + " codes, one identifier length and one" ^0
"    rate limit have never reached a test" ^0
"" ^0
"a test double built by the counterparty is still a test" ^0
"double; it is easier to answer than the thing it stands" ^0
"for, and the ways it is easier are the ways nothing is" ^0
"checked" ^0
"" ^0

"The suite asserts on the vendor's own codes, runs on every commit, and has been" ^0
"maintained " + str(months_of_the_practice) + " months at " + str(suite_runs_a_month) + " runs a month. It talks to the sandbox, which can" ^0
"produce " + str(documented_codes_the_sandbox_can_produce) + " of the " + str(codes_production_can_return) + " codes production returns - " + str(codes_covered_per_myriad) + " per ten thousand -" ^0
"and returns identifiers " + str(id_characters_in_the_sandbox) + " characters long against " + str(id_characters_in_production) + ", which overflows our" ^0
"column by " + str(characters_the_real_id_overflows_by) + " across " + str(tests_that_run_against_the_vendor) + " tests that ask the vendor." ^0
```

## Python (deterministic transpilation)

```python
tests_against_the_sandbox = 340
suite_runs_a_month = 610
months_of_the_practice = 29
documented_error_codes = 46
documented_codes_the_sandbox_can_produce = 44
undocumented_codes_production_returned_last_year = 4
sandbox_rate_limit_per_second = 0
production_rate_limit_per_second = 25
id_characters_in_the_sandbox = 12
id_characters_in_production = 26
id_column_width_in_our_store = 20
incidents_from_a_response_the_sandbox_never_sends = 3
tests_that_run_against_the_vendor = 0
codes_production_can_return = documented_error_codes + undocumented_codes_production_returned_last_year
documented_codes_the_sandbox_cannot_produce = documented_error_codes - documented_codes_the_sandbox_can_produce
codes_no_test_has_ever_seen = codes_production_can_return - documented_codes_the_sandbox_can_produce
characters_the_real_id_overflows_by = id_characters_in_production - id_column_width_in_our_store
characters_of_headroom_the_sandbox_showed = id_column_width_in_our_store - id_characters_in_the_sandbox
codes_covered_per_myriad = int(documented_codes_the_sandbox_can_produce * 10000 / codes_production_can_return)
print("tests against the sandbox       : " + str(tests_against_the_sandbox))
print("suite runs a month              : " + str(suite_runs_a_month))
print("months of the practice          : " + str(months_of_the_practice))
print("tests that run against the vendor : " + str(tests_that_run_against_the_vendor))
print("")
print("documented error codes          : " + str(documented_error_codes))
print("  the sandbox can produce       : " + str(documented_codes_the_sandbox_can_produce))
print("  it cannot                     : " + str(documented_codes_the_sandbox_cannot_produce))
print("undocumented codes production sent : " + str(undocumented_codes_production_returned_last_year))
print("codes production can return     : " + str(codes_production_can_return))
print("  no test has ever seen         : " + str(codes_no_test_has_ever_seen))
print("  covered                       : " + str(codes_covered_per_myriad) + " per ten thousand")
print("")
print("rate limit, sandbox, per second : " + str(sandbox_rate_limit_per_second))
print("rate limit, production          : " + str(production_rate_limit_per_second))
print("id characters, sandbox          : " + str(id_characters_in_the_sandbox))
print("id characters, production       : " + str(id_characters_in_production))
print("our column width                : " + str(id_column_width_in_our_store))
print("  headroom the sandbox showed   : " + str(characters_of_headroom_the_sandbox_showed))
print("  overflow the vendor sends     : " + str(characters_the_real_id_overflows_by))
print("incidents from an unseen response : " + str(incidents_from_a_response_the_sandbox_never_sends))
print("")
print("the integration suite")
print("  what it asserts on : the vendor's own error codes, not")
print("    the exception types our client library invents")
print("  when it runs : every commit, so a break belongs to one")
print("    change")
print("  what it covers : the failure codes, not only the")
print("    success path")
print("  runs a month : " + str(suite_runs_a_month) + ", for " + str(months_of_the_practice) + " months")
print("  verdict : COVERED")
print("")
print("  asserting on the vendor's codes rather than on our own")
print("  wrapper is the part almost nobody does, and it is why")
print("  the " + str(tests_against_the_sandbox) + " tests survive a client-library upgrade")
print("")
print("two counterparties")
print("  who the tests talk to : the sandbox, operated by the")
print("    vendor")
print("  who production talks to : the vendor")
print("  codes the sandbox can produce : ")
print("    " + str(documented_codes_the_sandbox_can_produce))
print("  codes production can return : " + str(codes_production_can_return))
print("  so codes no test has ever seen : ")
print("    " + str(codes_no_test_has_ever_seen))
print("  tests that talk to the vendor : ")
print("    " + str(tests_that_run_against_the_vendor))
print("")
print("  the suite is complete against the thing it questions,")
print("  and the thing it questions was built to be easy to")
print("  question")
print("")
print("the shape of an answer")
print("  identifier length, sandbox : ")
print("    " + str(id_characters_in_the_sandbox) + " characters")
print("  our column : " + str(id_column_width_in_our_store) + " characters, ")
print("    " + str(characters_of_headroom_the_sandbox_showed) + " to spare against the sandbox")
print("  identifier length, production : ")
print("    " + str(id_characters_in_production) + " characters")
print("  so the real identifier overflows by : ")
print("    " + str(characters_the_real_id_overflows_by) + " characters")
print("  rate limit the tests ever met : ")
print("    " + str(sandbox_rate_limit_per_second) + " per second")
print("  incidents from a response no test can produce : ")
print("    " + str(incidents_from_a_response_the_sandbox_never_sends))
print("")
nc_codes_a_test_can_now_see = 50
nc_id_characters_the_tests_see = 26
nc_rate_limit_the_tests_meet = 25
print("null control - run it against the vendor, with real money")
print("  tests : " + str(tests_against_the_sandbox) + ", unchanged")
print("  codes a test can now see : " + str(nc_codes_a_test_can_now_see))
print("  id characters the tests see : " + str(nc_id_characters_the_tests_see))
print("  rate limit the tests meet : " + str(nc_rate_limit_the_tests_meet) + " per second")
print("  the assertions did not improve; they were pointed at")
print("  the counterparty the promise is about")
print("")
print("what a green integration suite guarantees")
print("  every documented error the sandbox can produce is")
print("    handled : exactly, " + str(tests_against_the_sandbox) + " tests, " + str(suite_runs_a_month) + " runs a month,")
print("    " + str(months_of_the_practice) + " months")
print("  every response the vendor sends is handled : not")
print("    addressed; " + str(codes_no_test_has_ever_seen) + " codes, one identifier length and one")
print("    rate limit have never reached a test")
print("")
print("a test double built by the counterparty is still a test")
print("double; it is easier to answer than the thing it stands")
print("for, and the ways it is easier are the ways nothing is")
print("checked")
print("")
print("The suite asserts on the vendor's own codes, runs on every commit, and has been")
print("maintained " + str(months_of_the_practice) + " months at " + str(suite_runs_a_month) + " runs a month. It talks to the sandbox, which can")
print("produce " + str(documented_codes_the_sandbox_can_produce) + " of the " + str(codes_production_can_return) + " codes production returns - " + str(codes_covered_per_myriad) + " per ten thousand -")
print("and returns identifiers " + str(id_characters_in_the_sandbox) + " characters long against " + str(id_characters_in_production) + ", which overflows our")
print("column by " + str(characters_the_real_id_overflows_by) + " across " + str(tests_that_run_against_the_vendor) + " tests that ask the vendor.")
```

## stdout (executed)

```text
tests against the sandbox       : 340
suite runs a month              : 610
months of the practice          : 29
tests that run against the vendor : 0

documented error codes          : 46
  the sandbox can produce       : 44
  it cannot                     : 2
undocumented codes production sent : 4
codes production can return     : 50
  no test has ever seen         : 6
  covered                       : 8800 per ten thousand

rate limit, sandbox, per second : 0
rate limit, production          : 25
id characters, sandbox          : 12
id characters, production       : 26
our column width                : 20
  headroom the sandbox showed   : 8
  overflow the vendor sends     : 6
incidents from an unseen response : 3

the integration suite
  what it asserts on : the vendor's own error codes, not
    the exception types our client library invents
  when it runs : every commit, so a break belongs to one
    change
  what it covers : the failure codes, not only the
    success path
  runs a month : 610, for 29 months
  verdict : COVERED

  asserting on the vendor's codes rather than on our own
  wrapper is the part almost nobody does, and it is why
  the 340 tests survive a client-library upgrade

two counterparties
  who the tests talk to : the sandbox, operated by the
    vendor
  who production talks to : the vendor
  codes the sandbox can produce : 
    44
  codes production can return : 50
  so codes no test has ever seen : 
    6
  tests that talk to the vendor : 
    0

  the suite is complete against the thing it questions,
  and the thing it questions was built to be easy to
  question

the shape of an answer
  identifier length, sandbox : 
    12 characters
  our column : 20 characters, 
    8 to spare against the sandbox
  identifier length, production : 
    26 characters
  so the real identifier overflows by : 
    6 characters
  rate limit the tests ever met : 
    0 per second
  incidents from a response no test can produce : 
    3

null control - run it against the vendor, with real money
  tests : 340, unchanged
  codes a test can now see : 50
  id characters the tests see : 26
  rate limit the tests meet : 25 per second
  the assertions did not improve; they were pointed at
  the counterparty the promise is about

what a green integration suite guarantees
  every documented error the sandbox can produce is
    handled : exactly, 340 tests, 610 runs a month,
    29 months
  every response the vendor sends is handled : not
    addressed; 6 codes, one identifier length and one
    rate limit have never reached a test

a test double built by the counterparty is still a test
double; it is easier to answer than the thing it stands
for, and the ways it is easier are the ways nothing is
checked

The suite asserts on the vendor's own codes, runs on every commit, and has been
maintained 29 months at 610 runs a month. It talks to the sandbox, which can
produce 44 of the 50 codes production returns - 8800 per ten thousand -
and returns identifiers 12 characters long against 26, which overflows our
column by 6 across 0 tests that ask the vendor.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
