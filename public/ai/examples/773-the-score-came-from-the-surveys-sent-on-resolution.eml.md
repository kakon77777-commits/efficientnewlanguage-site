<!-- canonical: efficientnewlanguage.org/ai/examples/773-the-score-came-from-the-surveys-sent-on-resolution | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 773 — The score came from the surveys sent on resolution

`the_score_came_from_the_surveys_sent_on_resolution.eml` - The support satisfaction score has sat at 4.72 out of 5 for three years, and the survey behind it is carefully run. When it is sent is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The support
# satisfaction score has sat at 4.72 out of 5 for three years, and the survey
# behind it is carefully run. When it is sent is computed below.
#
# The survey is well made. It is two questions long; the scale is unlabelled at
# the midpoint so the wording cannot lean; no agent can see who answered what,
# so nobody can chase a score; there is no incentive to answer; and the team ran
# a non-response study to check that the people who reply are not systematically
# happier than the people who do not.
#
# It is sent when a ticket moves to Resolved. A ticket that ends any other way
# does not send one.

86000 => tickets_a_quarter
61400 => tickets_that_reached_resolved
19000 => surveys_answered
472 => mean_score_times_one_hundred
15800 => tickets_closed_with_no_response_from_the_customer
5100 => tickets_closed_as_duplicate
3700 => tickets_withdrawn_by_the_customer
3 => years_at_the_same_score
1 => non_response_studies_run
0 => surveys_sent_for_a_ticket_that_did_not_resolve

tickets_a_quarter - tickets_that_reached_resolved => tickets_that_ended_another_way
tickets_closed_with_no_response_from_the_customer + tickets_closed_as_duplicate => tickets_closed_without_the_customer_agreeing
tickets_closed_without_the_customer_agreeing + tickets_withdrawn_by_the_customer => tickets_that_sent_no_survey
int(surveys_answered * 10000 / tickets_that_reached_resolved) => response_rate_per_myriad
int(tickets_that_reached_resolved * 10000 / tickets_a_quarter) => tickets_that_could_be_surveyed_myriad

"tickets a quarter               : " + str(tickets_a_quarter) ^0
"  that reached Resolved         : " + str(tickets_that_reached_resolved) ^0
"  that ended another way        : " + str(tickets_that_ended_another_way) ^0
"  reachable by the survey       : " + str(tickets_that_could_be_surveyed_myriad) + " per ten thousand" ^0
"" ^0
"surveys answered                : " + str(surveys_answered) ^0
"  response rate                 : " + str(response_rate_per_myriad) + " per ten thousand" ^0
"  mean score, times one hundred : " + str(mean_score_times_one_hundred) ^0
"years at the same score         : " + str(years_at_the_same_score) ^0
"non-response studies run        : " + str(non_response_studies_run) ^0
"" ^0
"tickets that sent no survey     : " + str(tickets_that_sent_no_survey) ^0
"  no response from the customer : " + str(tickets_closed_with_no_response_from_the_customer) ^0
"  closed as duplicate           : " + str(tickets_closed_as_duplicate) ^0
"  withdrawn by the customer     : " + str(tickets_withdrawn_by_the_customer) ^0
"surveys sent for those          : " + str(surveys_sent_for_a_ticket_that_did_not_resolve) ^0
"" ^0

# ---- what the survey verified ----

"the satisfaction survey" ^0
"  length : two questions" ^0
"  scale : unlabelled at the midpoint, so the wording" ^0
"    cannot lean" ^0
"  attribution : no agent can see who answered what, so" ^0
"    nobody can chase a score" ^0
"  incentive to answer : none" ^0
"  non-response study : " + str(non_response_studies_run) + ", checking that repliers are not" ^0
"    systematically happier than non-repliers" ^0
"  verdict : WELL RUN" ^0
"" ^0
"  hiding the responses from the agents is the part almost" ^0
"  nobody does, and it is why the " + str(mean_score_times_one_hundred) + " is not a number" ^0
"  anyone was able to manage" ^0
"" ^0

# ---- what the trigger selects ----

"when the survey is sent" ^0
"  the trigger : the ticket moving to Resolved" ^0
"  what Resolved means : the agent believes the customer" ^0
"    has what they asked for" ^0
"  what the survey then asks : whether they are satisfied" ^0
"  so the population asked : the ones an agent judged" ^0
"    served" ^0
"  tickets that never met the trigger : " + str(tickets_that_sent_no_survey) ^0
"" ^0
"  the condition for being asked and the thing being" ^0
"  asked about are the same judgement, made twice" ^0
"" ^0

# ---- what the non-response study covered ----

"the study's own population" ^0
"  who it compared : people who answered against people" ^0
"    who did not" ^0
"  where both groups came from : tickets that reached" ^0
"    Resolved" ^0
"  people whose ticket never resolved : outside it" ^0
"  how many : " + str(tickets_that_sent_no_survey) ^0
"  what the study says about them : nothing, correctly;" ^0
"    it was not asked to" ^0
"" ^0

# ---- null control ----

# The same survey, sent when a ticket closes for any reason rather than when it
# resolves.
86000 => nc_surveys_sent
22400 => nc_surveys_answered
449 => nc_mean_score_times_one_hundred

"null control - send it on close, whatever the reason" ^0
"  survey design : unchanged, two questions, no incentive" ^0
"  surveys sent : " + str(nc_surveys_sent) ^0
"  surveys answered : " + str(nc_surveys_answered) ^0
"  mean score, times one hundred : " + str(nc_mean_score_times_one_hundred) ^0
"  the instrument did not get worse; it was pointed at" ^0
"  the people who had been unable to answer it" ^0
"" ^0

# ---- the rule ----

"what a high satisfaction score guarantees" ^0
"  people whose problem was resolved are satisfied :" ^0
"    exactly, " + str(mean_score_times_one_hundred) + " out of 500, " + str(years_at_the_same_score) + " years, no incentive" ^0
"    and no agent able to see a reply" ^0
"  people who asked for help are satisfied : not" ^0
"    addressed; the survey is sent by the resolution and" ^0
"    " + str(tickets_that_sent_no_survey) + " tickets a quarter never reach one" ^0
"" ^0
"when the event that triggers the measurement is the" ^0
"outcome being measured, the score is a description of the" ^0
"trigger; the dissatisfied case is the one that cannot fire" ^0
"it" ^0
"" ^0

"The survey is two questions, unincentivised, unattributable to an agent, and a" ^0
"non-response study checked the repliers against the non-repliers. It is sent by" ^0
"the move to Resolved, so " + str(tickets_that_sent_no_survey) + " of " + str(tickets_a_quarter) + " tickets a quarter send none - the" ^0
"score covers " + str(tickets_that_could_be_surveyed_myriad) + " per ten thousand of tickets at a " + str(response_rate_per_myriad) + " per ten thousand" ^0
"response rate - and the study's own population was the resolved ones too." ^0
```

## Python (deterministic transpilation)

```python
tickets_a_quarter = 86000
tickets_that_reached_resolved = 61400
surveys_answered = 19000
mean_score_times_one_hundred = 472
tickets_closed_with_no_response_from_the_customer = 15800
tickets_closed_as_duplicate = 5100
tickets_withdrawn_by_the_customer = 3700
years_at_the_same_score = 3
non_response_studies_run = 1
surveys_sent_for_a_ticket_that_did_not_resolve = 0
tickets_that_ended_another_way = tickets_a_quarter - tickets_that_reached_resolved
tickets_closed_without_the_customer_agreeing = tickets_closed_with_no_response_from_the_customer + tickets_closed_as_duplicate
tickets_that_sent_no_survey = tickets_closed_without_the_customer_agreeing + tickets_withdrawn_by_the_customer
response_rate_per_myriad = int(surveys_answered * 10000 / tickets_that_reached_resolved)
tickets_that_could_be_surveyed_myriad = int(tickets_that_reached_resolved * 10000 / tickets_a_quarter)
print("tickets a quarter               : " + str(tickets_a_quarter))
print("  that reached Resolved         : " + str(tickets_that_reached_resolved))
print("  that ended another way        : " + str(tickets_that_ended_another_way))
print("  reachable by the survey       : " + str(tickets_that_could_be_surveyed_myriad) + " per ten thousand")
print("")
print("surveys answered                : " + str(surveys_answered))
print("  response rate                 : " + str(response_rate_per_myriad) + " per ten thousand")
print("  mean score, times one hundred : " + str(mean_score_times_one_hundred))
print("years at the same score         : " + str(years_at_the_same_score))
print("non-response studies run        : " + str(non_response_studies_run))
print("")
print("tickets that sent no survey     : " + str(tickets_that_sent_no_survey))
print("  no response from the customer : " + str(tickets_closed_with_no_response_from_the_customer))
print("  closed as duplicate           : " + str(tickets_closed_as_duplicate))
print("  withdrawn by the customer     : " + str(tickets_withdrawn_by_the_customer))
print("surveys sent for those          : " + str(surveys_sent_for_a_ticket_that_did_not_resolve))
print("")
print("the satisfaction survey")
print("  length : two questions")
print("  scale : unlabelled at the midpoint, so the wording")
print("    cannot lean")
print("  attribution : no agent can see who answered what, so")
print("    nobody can chase a score")
print("  incentive to answer : none")
print("  non-response study : " + str(non_response_studies_run) + ", checking that repliers are not")
print("    systematically happier than non-repliers")
print("  verdict : WELL RUN")
print("")
print("  hiding the responses from the agents is the part almost")
print("  nobody does, and it is why the " + str(mean_score_times_one_hundred) + " is not a number")
print("  anyone was able to manage")
print("")
print("when the survey is sent")
print("  the trigger : the ticket moving to Resolved")
print("  what Resolved means : the agent believes the customer")
print("    has what they asked for")
print("  what the survey then asks : whether they are satisfied")
print("  so the population asked : the ones an agent judged")
print("    served")
print("  tickets that never met the trigger : " + str(tickets_that_sent_no_survey))
print("")
print("  the condition for being asked and the thing being")
print("  asked about are the same judgement, made twice")
print("")
print("the study's own population")
print("  who it compared : people who answered against people")
print("    who did not")
print("  where both groups came from : tickets that reached")
print("    Resolved")
print("  people whose ticket never resolved : outside it")
print("  how many : " + str(tickets_that_sent_no_survey))
print("  what the study says about them : nothing, correctly;")
print("    it was not asked to")
print("")
nc_surveys_sent = 86000
nc_surveys_answered = 22400
nc_mean_score_times_one_hundred = 449
print("null control - send it on close, whatever the reason")
print("  survey design : unchanged, two questions, no incentive")
print("  surveys sent : " + str(nc_surveys_sent))
print("  surveys answered : " + str(nc_surveys_answered))
print("  mean score, times one hundred : " + str(nc_mean_score_times_one_hundred))
print("  the instrument did not get worse; it was pointed at")
print("  the people who had been unable to answer it")
print("")
print("what a high satisfaction score guarantees")
print("  people whose problem was resolved are satisfied :")
print("    exactly, " + str(mean_score_times_one_hundred) + " out of 500, " + str(years_at_the_same_score) + " years, no incentive")
print("    and no agent able to see a reply")
print("  people who asked for help are satisfied : not")
print("    addressed; the survey is sent by the resolution and")
print("    " + str(tickets_that_sent_no_survey) + " tickets a quarter never reach one")
print("")
print("when the event that triggers the measurement is the")
print("outcome being measured, the score is a description of the")
print("trigger; the dissatisfied case is the one that cannot fire")
print("it")
print("")
print("The survey is two questions, unincentivised, unattributable to an agent, and a")
print("non-response study checked the repliers against the non-repliers. It is sent by")
print("the move to Resolved, so " + str(tickets_that_sent_no_survey) + " of " + str(tickets_a_quarter) + " tickets a quarter send none - the")
print("score covers " + str(tickets_that_could_be_surveyed_myriad) + " per ten thousand of tickets at a " + str(response_rate_per_myriad) + " per ten thousand")
print("response rate - and the study's own population was the resolved ones too.")
```

## stdout (executed)

```text
tickets a quarter               : 86000
  that reached Resolved         : 61400
  that ended another way        : 24600
  reachable by the survey       : 7139 per ten thousand

surveys answered                : 19000
  response rate                 : 3094 per ten thousand
  mean score, times one hundred : 472
years at the same score         : 3
non-response studies run        : 1

tickets that sent no survey     : 24600
  no response from the customer : 15800
  closed as duplicate           : 5100
  withdrawn by the customer     : 3700
surveys sent for those          : 0

the satisfaction survey
  length : two questions
  scale : unlabelled at the midpoint, so the wording
    cannot lean
  attribution : no agent can see who answered what, so
    nobody can chase a score
  incentive to answer : none
  non-response study : 1, checking that repliers are not
    systematically happier than non-repliers
  verdict : WELL RUN

  hiding the responses from the agents is the part almost
  nobody does, and it is why the 472 is not a number
  anyone was able to manage

when the survey is sent
  the trigger : the ticket moving to Resolved
  what Resolved means : the agent believes the customer
    has what they asked for
  what the survey then asks : whether they are satisfied
  so the population asked : the ones an agent judged
    served
  tickets that never met the trigger : 24600

  the condition for being asked and the thing being
  asked about are the same judgement, made twice

the study's own population
  who it compared : people who answered against people
    who did not
  where both groups came from : tickets that reached
    Resolved
  people whose ticket never resolved : outside it
  how many : 24600
  what the study says about them : nothing, correctly;
    it was not asked to

null control - send it on close, whatever the reason
  survey design : unchanged, two questions, no incentive
  surveys sent : 86000
  surveys answered : 22400
  mean score, times one hundred : 449
  the instrument did not get worse; it was pointed at
  the people who had been unable to answer it

what a high satisfaction score guarantees
  people whose problem was resolved are satisfied :
    exactly, 472 out of 500, 3 years, no incentive
    and no agent able to see a reply
  people who asked for help are satisfied : not
    addressed; the survey is sent by the resolution and
    24600 tickets a quarter never reach one

when the event that triggers the measurement is the
outcome being measured, the score is a description of the
trigger; the dissatisfied case is the one that cannot fire
it

The survey is two questions, unincentivised, unattributable to an agent, and a
non-response study checked the repliers against the non-repliers. It is sent by
the move to Resolved, so 24600 of 86000 tickets a quarter send none - the
score covers 7139 per ten thousand of tickets at a 3094 per ten thousand
response rate - and the study's own population was the resolved ones too.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
