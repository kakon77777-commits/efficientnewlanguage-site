<!-- canonical: efficientnewlanguage.org/ai/examples/746-the-sla-counted-responses-and-the-answers-were-wrong | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 746 — The sla counted responses and the answers were wrong

`the_sla_counted_responses_and_the_answers_were_wrong.eml` - Availability is measured from twelve regions every thirty seconds and from the real error rate, and credits were paid the two times it was missed. What counts as available is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Availability is
# measured from twelve regions every thirty seconds and from the real error
# rate, and credits were paid the two times it was missed. What counts as
# available is computed below.
#
# The measurement is honest, which is rarer than having an SLA. It is not
# self-reported from the load balancer alone: synthetic probes run from twelve
# regions on a thirty second interval, the real request stream is counted
# alongside them, the two are reconciled, and when the target was missed the
# credits were paid without the customer having to ask.
#
# Available means a response with a success status inside the timeout. A
# response that returns quickly, with the right shape, and an empty list where
# there should be rows, is a success status inside the timeout.
#
# One point nine million responses a day come from the degraded path.

9995 => availability_target_per_myriad
12 => probe_regions
30 => probe_interval_seconds
2 => times_the_target_was_missed
2 => times_credits_were_paid
84000000 => responses_per_day
1900000 => responses_from_the_degraded_path
0 => checks_in_the_sla_definition_about_the_body
0 => degraded_responses_counted_as_unavailable

responses_per_day - responses_from_the_degraded_path => responses_carrying_a_real_answer
int(responses_from_the_degraded_path * 10000 / responses_per_day) => degraded_per_myriad
10000 => a_whole_per_myriad
a_whole_per_myriad - availability_target_per_myriad => error_budget_per_myriad
int(degraded_per_myriad / error_budget_per_myriad) => degraded_share_in_error_budgets

"availability target             : " + str(availability_target_per_myriad) + " per ten thousand" ^0
"probe regions                   : " + str(probe_regions) ^0
"probe interval, seconds         : " + str(probe_interval_seconds) ^0
"times the target was missed     : " + str(times_the_target_was_missed) ^0
"times credits were paid         : " + str(times_credits_were_paid) ^0
"" ^0
"responses per day               : " + str(responses_per_day) ^0
"  carrying a real answer        : " + str(responses_carrying_a_real_answer) ^0
"  from the degraded path        : " + str(responses_from_the_degraded_path) ^0
"  share                         : " + str(degraded_per_myriad) + " per ten thousand" ^0
"  counted as unavailable        : " + str(degraded_responses_counted_as_unavailable) ^0
"" ^0
"checks in the SLA about the body: " + str(checks_in_the_sla_definition_about_the_body) ^0
"error budget                    : " + str(error_budget_per_myriad) + " per ten thousand" ^0
"  the degraded share is         : " + str(degraded_share_in_error_budgets) + " whole error budgets" ^0
"" ^0

# ---- what the measurement verified ----

"the availability measurement" ^0
"  source : synthetic probes plus the real request stream" ^0
"  probe regions : " + str(probe_regions) + ", not one" ^0
"  interval, seconds : " + str(probe_interval_seconds) ^0
"  are the two sources reconciled : yes" ^0
"  self-reported from the load balancer alone : no" ^0
"  credits paid without being asked : " + str(times_credits_were_paid) + " of " + str(times_the_target_was_missed) ^0
"  verdict : MEASURED HONESTLY" ^0
"" ^0
"  paying before being asked is the part that makes the" ^0
"  number trustworthy, and it was done" ^0
"" ^0

# ---- what available is defined as ----

"the definition" ^0
"  a response with a success status : available" ^0
"  inside the timeout : available" ^0
"  with the right shape : not part of the definition" ^0
"  with the right contents : not part of the definition" ^0
"  clauses about the body : " + str(checks_in_the_sla_definition_about_the_body) ^0
"  what a probe asserts : that a response came back" ^0
"" ^0
"  the definition is precise and it is a definition about" ^0
"  the envelope" ^0
"" ^0
# ---- the degraded path is deliberate ----

# When a downstream is unhealthy the service returns an empty result rather than
# an error, and that was argued for and chosen. An error propagates a partial
# outage into a page that will not render; an empty list renders. The decision
# was right and it is also what makes the outage invisible.
"the degraded path" ^0
"  when it engages : a downstream is unhealthy" ^0
"  what it returns : an empty result, quickly" ^0
"  why that was chosen : an error would break the render" ^0
"    for a partial outage" ^0
"  is that the wrong choice : no" ^0
"  what status it carries : success" ^0
"  what the SLA counts it as : available" ^0
"" ^0

# ---- what a probe would have to do ----

"the probe" ^0
"  asserts : a response, a status, a latency" ^0
"  what it would need to catch this : a known fixture whose" ^0
"    expected contents it can compare against" ^0
"  does the probe have one : no; it requests a real path" ^0
"    and reads the status" ^0
"  is that a defect in the probe : it answers the question" ^0
"    the SLA asks" ^0
"  regions running it : " + str(probe_regions) + ", all reading the same field" ^0
"" ^0

# ---- what the customer counts ----

"the two ledgers" ^0
"  ours   : responses returned, " + str(responses_per_day) + " a day" ^0
"  theirs : answers that were right" ^0
"  responses from the degraded path : " + str(responses_from_the_degraded_path) ^0
"  counted against the target : " + str(degraded_responses_counted_as_unavailable) ^0
"  the error budget : " + str(error_budget_per_myriad) + " per ten thousand" ^0
"  the degraded share : " + str(degraded_per_myriad) + " per ten thousand, which is" ^0
"    " + str(degraded_share_in_error_budgets) + " whole error budgets" ^0
"" ^0

# ---- null control ----

# The same measurement, with the probe requesting a fixture whose contents are
# known and asserting them, and the degraded path setting a header the counter
# reads.
responses_from_the_degraded_path => nc_degraded_responses_counted_as_unavailable
1 => nc_checks_in_the_sla_definition_about_the_body

"null control - the probe asserts a known answer" ^0
"  probe regions : " + str(probe_regions) + ", unchanged" ^0
"  checks about the body : " + str(nc_checks_in_the_sla_definition_about_the_body) ^0
"  degraded responses counted as unavailable : " + str(nc_degraded_responses_counted_as_unavailable) ^0
"  the measurement did not get more honest; it started" ^0
"  ranging over the thing the customer receives" ^0
"" ^0

# ---- the rule ----

"what an availability number guarantees" ^0
"  a response came back, in time, from " + str(probe_regions) + " regions :" ^0
"    exactly, measured independently and paid out on" ^0
"  the service worked : not addressed; availability is" ^0
"    denominated in responses and the customer's question" ^0
"    is denominated in answers" ^0
"" ^0
"a service level is a promise about a measurable quantity, so" ^0
"choosing the quantity is the whole design; a status code is" ^0
"measurable everywhere and correctness is measurable only" ^0
"where someone wrote down what the answer should be" ^0
"" ^0

"The measurement is honest: synthetic probes from " + str(probe_regions) + " regions every " + str(probe_interval_seconds) + " seconds" ^0
"reconciled against the real request stream, and credits paid " + str(times_credits_were_paid) + " of " + str(times_the_target_was_missed) + " times" ^0
"without being asked. Available means a success status inside the timeout, with" ^0
str(checks_in_the_sla_definition_about_the_body) + " clauses about the body, so " + str(responses_from_the_degraded_path) + " responses a day carrying an empty result -" ^0
str(degraded_per_myriad) + " per ten thousand, or " + str(degraded_share_in_error_budgets) + " whole error budgets - count as available." ^0
```

## Python (deterministic transpilation)

```python
availability_target_per_myriad = 9995
probe_regions = 12
probe_interval_seconds = 30
times_the_target_was_missed = 2
times_credits_were_paid = 2
responses_per_day = 84000000
responses_from_the_degraded_path = 1900000
checks_in_the_sla_definition_about_the_body = 0
degraded_responses_counted_as_unavailable = 0
responses_carrying_a_real_answer = responses_per_day - responses_from_the_degraded_path
degraded_per_myriad = int(responses_from_the_degraded_path * 10000 / responses_per_day)
a_whole_per_myriad = 10000
error_budget_per_myriad = a_whole_per_myriad - availability_target_per_myriad
degraded_share_in_error_budgets = int(degraded_per_myriad / error_budget_per_myriad)
print("availability target             : " + str(availability_target_per_myriad) + " per ten thousand")
print("probe regions                   : " + str(probe_regions))
print("probe interval, seconds         : " + str(probe_interval_seconds))
print("times the target was missed     : " + str(times_the_target_was_missed))
print("times credits were paid         : " + str(times_credits_were_paid))
print("")
print("responses per day               : " + str(responses_per_day))
print("  carrying a real answer        : " + str(responses_carrying_a_real_answer))
print("  from the degraded path        : " + str(responses_from_the_degraded_path))
print("  share                         : " + str(degraded_per_myriad) + " per ten thousand")
print("  counted as unavailable        : " + str(degraded_responses_counted_as_unavailable))
print("")
print("checks in the SLA about the body: " + str(checks_in_the_sla_definition_about_the_body))
print("error budget                    : " + str(error_budget_per_myriad) + " per ten thousand")
print("  the degraded share is         : " + str(degraded_share_in_error_budgets) + " whole error budgets")
print("")
print("the availability measurement")
print("  source : synthetic probes plus the real request stream")
print("  probe regions : " + str(probe_regions) + ", not one")
print("  interval, seconds : " + str(probe_interval_seconds))
print("  are the two sources reconciled : yes")
print("  self-reported from the load balancer alone : no")
print("  credits paid without being asked : " + str(times_credits_were_paid) + " of " + str(times_the_target_was_missed))
print("  verdict : MEASURED HONESTLY")
print("")
print("  paying before being asked is the part that makes the")
print("  number trustworthy, and it was done")
print("")
print("the definition")
print("  a response with a success status : available")
print("  inside the timeout : available")
print("  with the right shape : not part of the definition")
print("  with the right contents : not part of the definition")
print("  clauses about the body : " + str(checks_in_the_sla_definition_about_the_body))
print("  what a probe asserts : that a response came back")
print("")
print("  the definition is precise and it is a definition about")
print("  the envelope")
print("")
print("the degraded path")
print("  when it engages : a downstream is unhealthy")
print("  what it returns : an empty result, quickly")
print("  why that was chosen : an error would break the render")
print("    for a partial outage")
print("  is that the wrong choice : no")
print("  what status it carries : success")
print("  what the SLA counts it as : available")
print("")
print("the probe")
print("  asserts : a response, a status, a latency")
print("  what it would need to catch this : a known fixture whose")
print("    expected contents it can compare against")
print("  does the probe have one : no; it requests a real path")
print("    and reads the status")
print("  is that a defect in the probe : it answers the question")
print("    the SLA asks")
print("  regions running it : " + str(probe_regions) + ", all reading the same field")
print("")
print("the two ledgers")
print("  ours   : responses returned, " + str(responses_per_day) + " a day")
print("  theirs : answers that were right")
print("  responses from the degraded path : " + str(responses_from_the_degraded_path))
print("  counted against the target : " + str(degraded_responses_counted_as_unavailable))
print("  the error budget : " + str(error_budget_per_myriad) + " per ten thousand")
print("  the degraded share : " + str(degraded_per_myriad) + " per ten thousand, which is")
print("    " + str(degraded_share_in_error_budgets) + " whole error budgets")
print("")
nc_degraded_responses_counted_as_unavailable = responses_from_the_degraded_path
nc_checks_in_the_sla_definition_about_the_body = 1
print("null control - the probe asserts a known answer")
print("  probe regions : " + str(probe_regions) + ", unchanged")
print("  checks about the body : " + str(nc_checks_in_the_sla_definition_about_the_body))
print("  degraded responses counted as unavailable : " + str(nc_degraded_responses_counted_as_unavailable))
print("  the measurement did not get more honest; it started")
print("  ranging over the thing the customer receives")
print("")
print("what an availability number guarantees")
print("  a response came back, in time, from " + str(probe_regions) + " regions :")
print("    exactly, measured independently and paid out on")
print("  the service worked : not addressed; availability is")
print("    denominated in responses and the customer's question")
print("    is denominated in answers")
print("")
print("a service level is a promise about a measurable quantity, so")
print("choosing the quantity is the whole design; a status code is")
print("measurable everywhere and correctness is measurable only")
print("where someone wrote down what the answer should be")
print("")
print("The measurement is honest: synthetic probes from " + str(probe_regions) + " regions every " + str(probe_interval_seconds) + " seconds")
print("reconciled against the real request stream, and credits paid " + str(times_credits_were_paid) + " of " + str(times_the_target_was_missed) + " times")
print("without being asked. Available means a success status inside the timeout, with")
print(str(checks_in_the_sla_definition_about_the_body) + " clauses about the body, so " + str(responses_from_the_degraded_path) + " responses a day carrying an empty result -")
print(str(degraded_per_myriad) + " per ten thousand, or " + str(degraded_share_in_error_budgets) + " whole error budgets - count as available.")
```

## stdout (executed)

```text
availability target             : 9995 per ten thousand
probe regions                   : 12
probe interval, seconds         : 30
times the target was missed     : 2
times credits were paid         : 2

responses per day               : 84000000
  carrying a real answer        : 82100000
  from the degraded path        : 1900000
  share                         : 226 per ten thousand
  counted as unavailable        : 0

checks in the SLA about the body: 0
error budget                    : 5 per ten thousand
  the degraded share is         : 45 whole error budgets

the availability measurement
  source : synthetic probes plus the real request stream
  probe regions : 12, not one
  interval, seconds : 30
  are the two sources reconciled : yes
  self-reported from the load balancer alone : no
  credits paid without being asked : 2 of 2
  verdict : MEASURED HONESTLY

  paying before being asked is the part that makes the
  number trustworthy, and it was done

the definition
  a response with a success status : available
  inside the timeout : available
  with the right shape : not part of the definition
  with the right contents : not part of the definition
  clauses about the body : 0
  what a probe asserts : that a response came back

  the definition is precise and it is a definition about
  the envelope

the degraded path
  when it engages : a downstream is unhealthy
  what it returns : an empty result, quickly
  why that was chosen : an error would break the render
    for a partial outage
  is that the wrong choice : no
  what status it carries : success
  what the SLA counts it as : available

the probe
  asserts : a response, a status, a latency
  what it would need to catch this : a known fixture whose
    expected contents it can compare against
  does the probe have one : no; it requests a real path
    and reads the status
  is that a defect in the probe : it answers the question
    the SLA asks
  regions running it : 12, all reading the same field

the two ledgers
  ours   : responses returned, 84000000 a day
  theirs : answers that were right
  responses from the degraded path : 1900000
  counted against the target : 0
  the error budget : 5 per ten thousand
  the degraded share : 226 per ten thousand, which is
    45 whole error budgets

null control - the probe asserts a known answer
  probe regions : 12, unchanged
  checks about the body : 1
  degraded responses counted as unavailable : 1900000
  the measurement did not get more honest; it started
  ranging over the thing the customer receives

what an availability number guarantees
  a response came back, in time, from 12 regions :
    exactly, measured independently and paid out on
  the service worked : not addressed; availability is
    denominated in responses and the customer's question
    is denominated in answers

a service level is a promise about a measurable quantity, so
choosing the quantity is the whole design; a status code is
measurable everywhere and correctness is measurable only
where someone wrote down what the answer should be

The measurement is honest: synthetic probes from 12 regions every 30 seconds
reconciled against the real request stream, and credits paid 2 of 2 times
without being asked. Available means a success status inside the timeout, with
0 clauses about the body, so 1900000 responses a day carrying an empty result -
226 per ten thousand, or 45 whole error budgets - count as available.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
