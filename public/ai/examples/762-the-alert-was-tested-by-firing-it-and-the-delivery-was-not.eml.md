<!-- canonical: efficientnewlanguage.org/ai/examples/762-the-alert-was-tested-by-firing-it-and-the-delivery-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 762 — The alert was tested by firing it and the delivery was not

`the_alert_was_tested_by_firing_it_and_the_delivery_was_not.eml` - Alert rules are tested rather than trusted: a synthetic metric is injected, the rule is expected to fire, and a rule that does not fire fails the build. Where the test stops is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Alert rules are
# tested rather than trusted: a synthetic metric is injected, the rule is
# expected to fire, and a rule that does not fire fails the build. Where the
# test stops is computed below.
#
# The practice is a real one. The test injects a series through the same
# evaluation engine production uses rather than a mock of it; it asserts the
# firing rather than the absence of an error; it runs on every change to a rule
# and nightly besides; and seventy-four rules have been fixed because it went
# red on them.
#
# It asserts that the rule fires. Between a rule firing and a person waking up
# there are three more hops, and the test does not cross them.

640 => alert_rules
612 => rules_with_an_automated_firing_test
1224 => test_firings_a_month
18 => months_the_practice_has_run
74 => rules_fixed_because_the_test_failed
5 => steps_between_the_condition_and_a_person
2 => steps_the_test_exercises
318 => pages_raised_last_quarter
296 => pages_that_reached_a_phone
9 => pages_where_nobody_was_rostered
5 => pages_lost_to_an_expired_integration_token
8 => pages_silenced_by_do_not_disturb
0 => tests_that_page_a_real_device

alert_rules - rules_with_an_automated_firing_test => rules_without_a_firing_test
pages_raised_last_quarter - pages_that_reached_a_phone => pages_that_reached_nobody
pages_where_nobody_was_rostered + pages_lost_to_an_expired_integration_token => pages_lost_before_the_device
pages_lost_before_the_device + pages_silenced_by_do_not_disturb => pages_lost_in_total
steps_between_the_condition_and_a_person - steps_the_test_exercises => steps_nothing_exercises
int(rules_with_an_automated_firing_test * 10000 / alert_rules) => rules_tested_per_myriad
int(pages_that_reached_a_phone * 10000 / pages_raised_last_quarter) => pages_delivered_per_myriad
int(steps_the_test_exercises * 10000 / steps_between_the_condition_and_a_person) => path_covered_per_myriad

"alert rules                     : " + str(alert_rules) ^0
"  with an automated firing test : " + str(rules_with_an_automated_firing_test) ^0
"  without one                   : " + str(rules_without_a_firing_test) ^0
"  tested share                  : " + str(rules_tested_per_myriad) + " per ten thousand" ^0
"test firings a month            : " + str(test_firings_a_month) ^0
"months the practice has run     : " + str(months_the_practice_has_run) ^0
"rules fixed because it went red : " + str(rules_fixed_because_the_test_failed) ^0
"" ^0
"steps from condition to a person: " + str(steps_between_the_condition_and_a_person) ^0
"  the test exercises            : " + str(steps_the_test_exercises) ^0
"  nothing exercises             : " + str(steps_nothing_exercises) ^0
"  path covered                  : " + str(path_covered_per_myriad) + " per ten thousand" ^0
"tests that page a real device   : " + str(tests_that_page_a_real_device) ^0
"" ^0
"pages raised last quarter       : " + str(pages_raised_last_quarter) ^0
"  that reached a phone          : " + str(pages_that_reached_a_phone) ^0
"  that reached nobody           : " + str(pages_that_reached_nobody) ^0
"  delivered                     : " + str(pages_delivered_per_myriad) + " per ten thousand" ^0
"    nobody rostered             : " + str(pages_where_nobody_was_rostered) ^0
"    integration token expired   : " + str(pages_lost_to_an_expired_integration_token) ^0
"    silenced by do not disturb  : " + str(pages_silenced_by_do_not_disturb) ^0
"" ^0

# ---- what the test verified ----

"the alert-rule test" ^0
"  engine : the same evaluation engine production uses," ^0
"    not a mock of it" ^0
"  assertion : that the rule fires, not that nothing" ^0
"    errored" ^0
"  cadence : on every change to a rule, and nightly" ^0
"  rules fixed because it went red : " + str(rules_fixed_because_the_test_failed) ^0
"  months in place : " + str(months_the_practice_has_run) ^0
"  verdict : FIRES" ^0
"" ^0
"  asserting the firing rather than the absence of an" ^0
"  error is the part almost nobody does, and it is why" ^0
"  the " + str(rules_fixed_because_the_test_failed) + " were found before an incident" ^0
"" ^0

# ---- where the test stops ----

"the path from a condition to a person" ^0
"  1 the condition holds : exercised" ^0
"  2 the rule fires : exercised" ^0
"  3 the notifier accepts it : not exercised" ^0
"  4 the schedule says who : not exercised" ^0
"  5 the device rings : not exercised" ^0
"  steps covered : " + str(steps_the_test_exercises) + " of " + str(steps_between_the_condition_and_a_person) + ", " + str(path_covered_per_myriad) + " per ten" ^0
"    thousand" ^0
"" ^0
"  the boundary of the test is the boundary of the system" ^0
"  it was written for, and the question crosses it" ^0
"" ^0

# ---- what a lost page looks like ----

"a page that woke nobody" ^0
"  did the condition hold : yes" ^0
"  did the rule fire : yes, and the test says it always" ^0
"    will" ^0
"  did anything record a failure : no; delivery is" ^0
"    accepted asynchronously and nothing reads the result" ^0
"  where it stopped : " + str(pages_where_nobody_was_rostered) + " at an empty rota, " ^0
"    " + str(pages_lost_to_an_expired_integration_token) + " at an expired token, " + str(pages_silenced_by_do_not_disturb) + " at a silent phone" ^0
"  pages in that state : " + str(pages_lost_in_total) + " of " + str(pages_raised_last_quarter) ^0
"" ^0

# ---- null control ----

# The same practice, with one rule per hour paging a device that is expected to
# acknowledge, and the acknowledgement asserted.
5 => nc_steps_the_test_exercises
22 => nc_delivery_failures_found_before_an_incident
74 => nc_rules_fixed_because_the_test_failed

"null control - page a real device and require the ack" ^0
"  rules fixed by the firing test : " + str(nc_rules_fixed_because_the_test_failed) + ", unchanged" ^0
"  steps the test exercises : " + str(nc_steps_the_test_exercises) ^0
"  delivery failures found before an incident : " + str(nc_delivery_failures_found_before_an_incident) ^0
"  the rules did not get better; the assertion was moved" ^0
"  to the end of the path instead of the end of the" ^0
"  component" ^0
"" ^0

# ---- the rule ----

"what a fully tested alert set guarantees" ^0
"  every rule fires when its condition holds : exactly," ^0
"    " + str(rules_with_an_automated_firing_test) + " of " + str(alert_rules) + " rules, " + str(test_firings_a_month) + " firings a month, " + str(months_the_practice_has_run) + " months" ^0
"  somebody is woken : not addressed; the test ends where" ^0
"    the alerting system does, " + str(steps_nothing_exercises) + " hops short of a phone" ^0
"" ^0
"a test that ends at a component boundary is evidence about" ^0
"that component; the promise is about a person, and the" ^0
"part between them is exercised only by real incidents" ^0
"" ^0

"The firing test runs the production evaluation engine, asserts the firing" ^0
"rather than the absence of an error, and has fixed " + str(rules_fixed_because_the_test_failed) + " rules in " + str(months_the_practice_has_run) + " months." ^0
"It covers " + str(steps_the_test_exercises) + " of the " + str(steps_between_the_condition_and_a_person) + " steps to a person - " + str(path_covered_per_myriad) + " per ten thousand - so " + str(pages_lost_in_total) ^0
"of " + str(pages_raised_last_quarter) + " pages last quarter reached nobody, across " + str(tests_that_page_a_real_device) + " tests that page a" ^0
"device." ^0
```

## Python (deterministic transpilation)

```python
alert_rules = 640
rules_with_an_automated_firing_test = 612
test_firings_a_month = 1224
months_the_practice_has_run = 18
rules_fixed_because_the_test_failed = 74
steps_between_the_condition_and_a_person = 5
steps_the_test_exercises = 2
pages_raised_last_quarter = 318
pages_that_reached_a_phone = 296
pages_where_nobody_was_rostered = 9
pages_lost_to_an_expired_integration_token = 5
pages_silenced_by_do_not_disturb = 8
tests_that_page_a_real_device = 0
rules_without_a_firing_test = alert_rules - rules_with_an_automated_firing_test
pages_that_reached_nobody = pages_raised_last_quarter - pages_that_reached_a_phone
pages_lost_before_the_device = pages_where_nobody_was_rostered + pages_lost_to_an_expired_integration_token
pages_lost_in_total = pages_lost_before_the_device + pages_silenced_by_do_not_disturb
steps_nothing_exercises = steps_between_the_condition_and_a_person - steps_the_test_exercises
rules_tested_per_myriad = int(rules_with_an_automated_firing_test * 10000 / alert_rules)
pages_delivered_per_myriad = int(pages_that_reached_a_phone * 10000 / pages_raised_last_quarter)
path_covered_per_myriad = int(steps_the_test_exercises * 10000 / steps_between_the_condition_and_a_person)
print("alert rules                     : " + str(alert_rules))
print("  with an automated firing test : " + str(rules_with_an_automated_firing_test))
print("  without one                   : " + str(rules_without_a_firing_test))
print("  tested share                  : " + str(rules_tested_per_myriad) + " per ten thousand")
print("test firings a month            : " + str(test_firings_a_month))
print("months the practice has run     : " + str(months_the_practice_has_run))
print("rules fixed because it went red : " + str(rules_fixed_because_the_test_failed))
print("")
print("steps from condition to a person: " + str(steps_between_the_condition_and_a_person))
print("  the test exercises            : " + str(steps_the_test_exercises))
print("  nothing exercises             : " + str(steps_nothing_exercises))
print("  path covered                  : " + str(path_covered_per_myriad) + " per ten thousand")
print("tests that page a real device   : " + str(tests_that_page_a_real_device))
print("")
print("pages raised last quarter       : " + str(pages_raised_last_quarter))
print("  that reached a phone          : " + str(pages_that_reached_a_phone))
print("  that reached nobody           : " + str(pages_that_reached_nobody))
print("  delivered                     : " + str(pages_delivered_per_myriad) + " per ten thousand")
print("    nobody rostered             : " + str(pages_where_nobody_was_rostered))
print("    integration token expired   : " + str(pages_lost_to_an_expired_integration_token))
print("    silenced by do not disturb  : " + str(pages_silenced_by_do_not_disturb))
print("")
print("the alert-rule test")
print("  engine : the same evaluation engine production uses,")
print("    not a mock of it")
print("  assertion : that the rule fires, not that nothing")
print("    errored")
print("  cadence : on every change to a rule, and nightly")
print("  rules fixed because it went red : " + str(rules_fixed_because_the_test_failed))
print("  months in place : " + str(months_the_practice_has_run))
print("  verdict : FIRES")
print("")
print("  asserting the firing rather than the absence of an")
print("  error is the part almost nobody does, and it is why")
print("  the " + str(rules_fixed_because_the_test_failed) + " were found before an incident")
print("")
print("the path from a condition to a person")
print("  1 the condition holds : exercised")
print("  2 the rule fires : exercised")
print("  3 the notifier accepts it : not exercised")
print("  4 the schedule says who : not exercised")
print("  5 the device rings : not exercised")
print("  steps covered : " + str(steps_the_test_exercises) + " of " + str(steps_between_the_condition_and_a_person) + ", " + str(path_covered_per_myriad) + " per ten")
print("    thousand")
print("")
print("  the boundary of the test is the boundary of the system")
print("  it was written for, and the question crosses it")
print("")
print("a page that woke nobody")
print("  did the condition hold : yes")
print("  did the rule fire : yes, and the test says it always")
print("    will")
print("  did anything record a failure : no; delivery is")
print("    accepted asynchronously and nothing reads the result")
print("  where it stopped : " + str(pages_where_nobody_was_rostered) + " at an empty rota, ")
print("    " + str(pages_lost_to_an_expired_integration_token) + " at an expired token, " + str(pages_silenced_by_do_not_disturb) + " at a silent phone")
print("  pages in that state : " + str(pages_lost_in_total) + " of " + str(pages_raised_last_quarter))
print("")
nc_steps_the_test_exercises = 5
nc_delivery_failures_found_before_an_incident = 22
nc_rules_fixed_because_the_test_failed = 74
print("null control - page a real device and require the ack")
print("  rules fixed by the firing test : " + str(nc_rules_fixed_because_the_test_failed) + ", unchanged")
print("  steps the test exercises : " + str(nc_steps_the_test_exercises))
print("  delivery failures found before an incident : " + str(nc_delivery_failures_found_before_an_incident))
print("  the rules did not get better; the assertion was moved")
print("  to the end of the path instead of the end of the")
print("  component")
print("")
print("what a fully tested alert set guarantees")
print("  every rule fires when its condition holds : exactly,")
print("    " + str(rules_with_an_automated_firing_test) + " of " + str(alert_rules) + " rules, " + str(test_firings_a_month) + " firings a month, " + str(months_the_practice_has_run) + " months")
print("  somebody is woken : not addressed; the test ends where")
print("    the alerting system does, " + str(steps_nothing_exercises) + " hops short of a phone")
print("")
print("a test that ends at a component boundary is evidence about")
print("that component; the promise is about a person, and the")
print("part between them is exercised only by real incidents")
print("")
print("The firing test runs the production evaluation engine, asserts the firing")
print("rather than the absence of an error, and has fixed " + str(rules_fixed_because_the_test_failed) + " rules in " + str(months_the_practice_has_run) + " months.")
print("It covers " + str(steps_the_test_exercises) + " of the " + str(steps_between_the_condition_and_a_person) + " steps to a person - " + str(path_covered_per_myriad) + " per ten thousand - so " + str(pages_lost_in_total))
print("of " + str(pages_raised_last_quarter) + " pages last quarter reached nobody, across " + str(tests_that_page_a_real_device) + " tests that page a")
print("device.")
```

## stdout (executed)

```text
alert rules                     : 640
  with an automated firing test : 612
  without one                   : 28
  tested share                  : 9562 per ten thousand
test firings a month            : 1224
months the practice has run     : 18
rules fixed because it went red : 74

steps from condition to a person: 5
  the test exercises            : 2
  nothing exercises             : 3
  path covered                  : 4000 per ten thousand
tests that page a real device   : 0

pages raised last quarter       : 318
  that reached a phone          : 296
  that reached nobody           : 22
  delivered                     : 9308 per ten thousand
    nobody rostered             : 9
    integration token expired   : 5
    silenced by do not disturb  : 8

the alert-rule test
  engine : the same evaluation engine production uses,
    not a mock of it
  assertion : that the rule fires, not that nothing
    errored
  cadence : on every change to a rule, and nightly
  rules fixed because it went red : 74
  months in place : 18
  verdict : FIRES

  asserting the firing rather than the absence of an
  error is the part almost nobody does, and it is why
  the 74 were found before an incident

the path from a condition to a person
  1 the condition holds : exercised
  2 the rule fires : exercised
  3 the notifier accepts it : not exercised
  4 the schedule says who : not exercised
  5 the device rings : not exercised
  steps covered : 2 of 5, 4000 per ten
    thousand

  the boundary of the test is the boundary of the system
  it was written for, and the question crosses it

a page that woke nobody
  did the condition hold : yes
  did the rule fire : yes, and the test says it always
    will
  did anything record a failure : no; delivery is
    accepted asynchronously and nothing reads the result
  where it stopped : 9 at an empty rota, 
    5 at an expired token, 8 at a silent phone
  pages in that state : 22 of 318

null control - page a real device and require the ack
  rules fixed by the firing test : 74, unchanged
  steps the test exercises : 5
  delivery failures found before an incident : 22
  the rules did not get better; the assertion was moved
  to the end of the path instead of the end of the
  component

what a fully tested alert set guarantees
  every rule fires when its condition holds : exactly,
    612 of 640 rules, 1224 firings a month, 18 months
  somebody is woken : not addressed; the test ends where
    the alerting system does, 3 hops short of a phone

a test that ends at a component boundary is evidence about
that component; the promise is about a person, and the
part between them is exercised only by real incidents

The firing test runs the production evaluation engine, asserts the firing
rather than the absence of an error, and has fixed 74 rules in 18 months.
It covers 2 of the 5 steps to a person - 4000 per ten thousand - so 22
of 318 pages last quarter reached nobody, across 0 tests that page a
device.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
