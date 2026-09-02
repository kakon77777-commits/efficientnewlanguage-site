<!-- canonical: efficientnewlanguage.org/ai/examples/661-the-error-was-logged-and-the-caller-got-a-success-code | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 661 — The error was logged and the caller got a success code

`the_error_was_logged_and_the_caller_got_a_success_code.eml` - The enrichment failure is caught, logged with a stack trace, and does not fail the request. What the caller can tell is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The enrichment
# failure is caught, logged with a stack trace, and does not fail the request.
# What the caller can tell is computed below.
#
# The decision to swallow it is correct. Enrichment is optional: it adds a
# display name to a record that is complete without one, and letting a
# best-effort lookup fail a payment would be a much worse defect. The exception
# is caught narrowly, logged at error with the record identifier and a stack
# trace, and the logs are searchable and alerted above a rate threshold.
#
# The response is a two hundred with the field absent. Absent is also what the
# response carries when the field does not apply, and the schema has no third
# value.
#
# Nine downstream systems read the absence, and all nine read it the same way.

12400000 => requests_per_day
74000 => enrichment_failures
9 => downstream_systems
9 => systems_treating_absence_as_not_applicable
124000 => alert_threshold_per_day

requests_per_day => responses_with_a_success_code
enrichment_failures => errors_logged
downstream_systems - systems_treating_absence_as_not_applicable => systems_that_can_tell_the_difference

"requests per day             : " + str(requests_per_day) ^0
"enrichment failures          : " + str(enrichment_failures) ^0
"errors logged                : " + str(errors_logged) ^0
"responses with a success code: " + str(responses_with_a_success_code) ^0
"" ^0
"downstream systems           : " + str(downstream_systems) ^0
"  treating absence as not applicable : " + str(systems_treating_absence_as_not_applicable) ^0
"  able to tell the difference        : " + str(systems_that_can_tell_the_difference) ^0
"" ^0

# ---- what the handler does right ----

"the exception handler" ^0
"  scope             : the enrichment call only" ^0
"  logged at         : error, with the record id and a stack" ^0
"  logs searchable   : yes" ^0
"  rate alert        : above " + str(alert_threshold_per_day) + " a day" ^0
"  the request       : completes, which is correct for an" ^0
"    optional lookup" ^0
"  verdict           : HANDLED" ^0
"" ^0
"  letting this fail the request would be the worse bug and" ^0
"  the narrow catch is deliberate" ^0
"" ^0

# ---- what the response carries ----

"the two states, on the wire" ^0
"  the field does not apply : absent" ^0
"  we tried and it failed   : absent" ^0
"  status code in both cases: success" ^0
"  a third representation   : not in the schema" ^0
"" ^0
"  the information exists, in a log, on the server, keyed" ^0
"  by a record id the caller does not have" ^0
"" ^0

int(enrichment_failures * 10000 / requests_per_day) => failure_per_myriad
"share of responses missing it after a failure : " + str(failure_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- why the alert stays quiet ----

"the rate alert" ^0
"  threshold, per day : " + str(alert_threshold_per_day) ^0
"  failures, per day  : " + str(enrichment_failures) ^0
"  fires              : no" ^0
"  what the threshold was set from : the level at which" ^0
"    someone would want to know" ^0
"" ^0
alert_threshold_per_day - enrichment_failures => headroom_under_the_threshold
"  headroom before it fires : " + str(headroom_under_the_threshold) ^0
"  the number is below the line and the line is reasonable" ^0
"" ^0

# ---- null control ----

# The same handler, with the response carrying an explicit enrichment status
# rather than an absent field.
0 => nc_systems_unable_to_tell
downstream_systems => nc_systems_that_can_tell

"null control - the response states the enrichment status" ^0
"  requests failed by the handler : 0, unchanged" ^0
"  systems able to tell the difference : " + str(nc_systems_that_can_tell) ^0
"  systems unable to                   : " + str(nc_systems_unable_to_tell) ^0
"  the handler did not become stricter; the two outcomes" ^0
"  stopped sharing a representation" ^0
"" ^0

# ---- the rule ----

"what catching and logging guarantees" ^0
"  the caller is not failed by an optional step : exactly" ^0
"  the caller knows the step did not run        : not" ^0
"    addressed; the log is on the server and the response" ^0
"    is what the caller reads" ^0
"" ^0
"deciding not to fail a request is a decision about the status" ^0
"code; it is read as a decision about the whole response, and" ^0
"the body still has to say which of two things happened" ^0
"" ^0

"The handler is right to swallow it: a narrow catch around an optional lookup," ^0
"logged at error with a stack and a record id, searchable, with a rate alert set" ^0
"at a reasonable " + str(alert_threshold_per_day) + " a day and " + str(headroom_under_the_threshold) + " of headroom under it. " + str(enrichment_failures) + " responses" ^0
"a day - " + str(failure_per_myriad) + " per ten thousand - carry a success code and an absent field that" ^0
"all " + str(systems_treating_absence_as_not_applicable) + " downstream systems read as not applicable." ^0
```

## Python (deterministic transpilation)

```python
requests_per_day = 12400000
enrichment_failures = 74000
downstream_systems = 9
systems_treating_absence_as_not_applicable = 9
alert_threshold_per_day = 124000
responses_with_a_success_code = requests_per_day
errors_logged = enrichment_failures
systems_that_can_tell_the_difference = downstream_systems - systems_treating_absence_as_not_applicable
print("requests per day             : " + str(requests_per_day))
print("enrichment failures          : " + str(enrichment_failures))
print("errors logged                : " + str(errors_logged))
print("responses with a success code: " + str(responses_with_a_success_code))
print("")
print("downstream systems           : " + str(downstream_systems))
print("  treating absence as not applicable : " + str(systems_treating_absence_as_not_applicable))
print("  able to tell the difference        : " + str(systems_that_can_tell_the_difference))
print("")
print("the exception handler")
print("  scope             : the enrichment call only")
print("  logged at         : error, with the record id and a stack")
print("  logs searchable   : yes")
print("  rate alert        : above " + str(alert_threshold_per_day) + " a day")
print("  the request       : completes, which is correct for an")
print("    optional lookup")
print("  verdict           : HANDLED")
print("")
print("  letting this fail the request would be the worse bug and")
print("  the narrow catch is deliberate")
print("")
print("the two states, on the wire")
print("  the field does not apply : absent")
print("  we tried and it failed   : absent")
print("  status code in both cases: success")
print("  a third representation   : not in the schema")
print("")
print("  the information exists, in a log, on the server, keyed")
print("  by a record id the caller does not have")
print("")
failure_per_myriad = int(enrichment_failures * 10000 / requests_per_day)
print("share of responses missing it after a failure : " + str(failure_per_myriad) + " per ten thousand")
print("")
print("the rate alert")
print("  threshold, per day : " + str(alert_threshold_per_day))
print("  failures, per day  : " + str(enrichment_failures))
print("  fires              : no")
print("  what the threshold was set from : the level at which")
print("    someone would want to know")
print("")
headroom_under_the_threshold = alert_threshold_per_day - enrichment_failures
print("  headroom before it fires : " + str(headroom_under_the_threshold))
print("  the number is below the line and the line is reasonable")
print("")
nc_systems_unable_to_tell = 0
nc_systems_that_can_tell = downstream_systems
print("null control - the response states the enrichment status")
print("  requests failed by the handler : 0, unchanged")
print("  systems able to tell the difference : " + str(nc_systems_that_can_tell))
print("  systems unable to                   : " + str(nc_systems_unable_to_tell))
print("  the handler did not become stricter; the two outcomes")
print("  stopped sharing a representation")
print("")
print("what catching and logging guarantees")
print("  the caller is not failed by an optional step : exactly")
print("  the caller knows the step did not run        : not")
print("    addressed; the log is on the server and the response")
print("    is what the caller reads")
print("")
print("deciding not to fail a request is a decision about the status")
print("code; it is read as a decision about the whole response, and")
print("the body still has to say which of two things happened")
print("")
print("The handler is right to swallow it: a narrow catch around an optional lookup,")
print("logged at error with a stack and a record id, searchable, with a rate alert set")
print("at a reasonable " + str(alert_threshold_per_day) + " a day and " + str(headroom_under_the_threshold) + " of headroom under it. " + str(enrichment_failures) + " responses")
print("a day - " + str(failure_per_myriad) + " per ten thousand - carry a success code and an absent field that")
print("all " + str(systems_treating_absence_as_not_applicable) + " downstream systems read as not applicable.")
```

## stdout (executed)

```text
requests per day             : 12400000
enrichment failures          : 74000
errors logged                : 74000
responses with a success code: 12400000

downstream systems           : 9
  treating absence as not applicable : 9
  able to tell the difference        : 0

the exception handler
  scope             : the enrichment call only
  logged at         : error, with the record id and a stack
  logs searchable   : yes
  rate alert        : above 124000 a day
  the request       : completes, which is correct for an
    optional lookup
  verdict           : HANDLED

  letting this fail the request would be the worse bug and
  the narrow catch is deliberate

the two states, on the wire
  the field does not apply : absent
  we tried and it failed   : absent
  status code in both cases: success
  a third representation   : not in the schema

  the information exists, in a log, on the server, keyed
  by a record id the caller does not have

share of responses missing it after a failure : 59 per ten thousand

the rate alert
  threshold, per day : 124000
  failures, per day  : 74000
  fires              : no
  what the threshold was set from : the level at which
    someone would want to know

  headroom before it fires : 50000
  the number is below the line and the line is reasonable

null control - the response states the enrichment status
  requests failed by the handler : 0, unchanged
  systems able to tell the difference : 9
  systems unable to                   : 0
  the handler did not become stricter; the two outcomes
  stopped sharing a representation

what catching and logging guarantees
  the caller is not failed by an optional step : exactly
  the caller knows the step did not run        : not
    addressed; the log is on the server and the response
    is what the caller reads

deciding not to fail a request is a decision about the status
code; it is read as a decision about the whole response, and
the body still has to say which of two things happened

The handler is right to swallow it: a narrow catch around an optional lookup,
logged at error with a stack and a record id, searchable, with a rate alert set
at a reasonable 124000 a day and 50000 of headroom under it. 74000 responses
a day - 59 per ten thousand - carry a success code and an absent field that
all 9 downstream systems read as not applicable.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
