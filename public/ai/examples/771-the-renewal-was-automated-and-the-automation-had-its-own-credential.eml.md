<!-- canonical: efficientnewlanguage.org/ai/examples/771-the-renewal-was-automated-and-the-automation-had-its-own-credential | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 771 — The renewal was automated and the automation had its own credential

`the_renewal_was_automated_and_the_automation_had_its_own_credential.eml` - Certificate renewal is fully automated across two thousand one hundred certificates, runs thirty days before expiry, and has gone four years without an expiry incident. What the automation needs in order to run is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Certificate
# renewal is fully automated across two thousand one hundred certificates, runs
# thirty days before expiry, and has gone four years without an expiry incident.
# What the automation needs in order to run is computed below.
#
# The automation is good. It renews on a schedule rather than on an alert, so
# there is a month of slack rather than an emergency; a renewal that fails is
# itself alerted on and sixty-one such failures have been caught and fixed; the
# monitor watches the certificate that is actually served rather than the one in
# the store; and nothing about it depends on a person remembering.
#
# It authenticates to the certificate authority with a credential of its own.
# That credential is issued by hand.

2100 => certificates_under_automation
175 => renewals_a_month
48 => months_of_operation
30 => days_before_expiry_a_renewal_runs
61 => renewal_failures_caught_by_the_monitor
0 => expiry_incidents
24 => agent_credential_lifetime_months
2 => times_the_agent_credential_has_been_renewed
1 => people_who_have_ever_renewed_it
0 => runbook_steps_written_for_that_renewal
0 => monitors_watching_the_agent_credential
0 => days_of_notice_the_last_time

renewals_a_month * months_of_operation => automated_renewals_so_far
int(months_of_operation / agent_credential_lifetime_months) => agent_credential_renewals_due_so_far
int(automated_renewals_so_far / times_the_agent_credential_has_been_renewed) => automated_runs_per_manual_run
certificates_under_automation => certificates_that_depend_on_the_manual_path

"certificates under automation   : " + str(certificates_under_automation) ^0
"renewals a month                : " + str(renewals_a_month) ^0
"months of operation             : " + str(months_of_operation) ^0
"automated renewals so far       : " + str(automated_renewals_so_far) ^0
"days before expiry a renewal runs : " + str(days_before_expiry_a_renewal_runs) ^0
"renewal failures caught         : " + str(renewal_failures_caught_by_the_monitor) ^0
"expiry incidents                : " + str(expiry_incidents) ^0
"" ^0
"the agent's own credential" ^0
"  lifetime, months              : " + str(agent_credential_lifetime_months) ^0
"  renewals due so far           : " + str(agent_credential_renewals_due_so_far) ^0
"  renewals performed            : " + str(times_the_agent_credential_has_been_renewed) ^0
"  people who have ever done it  : " + str(people_who_have_ever_renewed_it) ^0
"  runbook steps written for it  : " + str(runbook_steps_written_for_that_renewal) ^0
"  monitors watching its expiry  : " + str(monitors_watching_the_agent_credential) ^0
"  days of notice last time      : " + str(days_of_notice_the_last_time) ^0
"" ^0
"automated runs per manual run   : " + str(automated_runs_per_manual_run) ^0
"certificates depending on the manual path : " + str(certificates_that_depend_on_the_manual_path) ^0
"" ^0

# ---- what the automation verified ----

"the renewal automation" ^0
"  when it runs : " + str(days_before_expiry_a_renewal_runs) + " days before expiry, on a" ^0
"    schedule, so a failure has a month of slack" ^0
"  what the monitor reads : the certificate the server" ^0
"    actually presents, not the one in the store" ^0
"  failures caught and fixed : " + str(renewal_failures_caught_by_the_monitor) ^0
"  expiry incidents in " + str(months_of_operation) + " months : " + str(expiry_incidents) ^0
"  dependence on a person remembering : none" ^0
"  verdict : AUTOMATED" ^0
"" ^0
"  monitoring the served certificate rather than the" ^0
"  stored one is the part almost nobody does, and it is" ^0
"  why the " + str(renewal_failures_caught_by_the_monitor) + " failures never became incidents" ^0
"" ^0

# ---- the path underneath ----

"two paths, and how often each runs" ^0
"  the renewal of a certificate : " + str(automated_renewals_so_far) + " times" ^0
"  the renewal of the credential that permits it : " ^0
"    " + str(times_the_agent_credential_has_been_renewed) + " times" ^0
"  so automated runs per manual run : " ^0
"    " + str(automated_runs_per_manual_run) ^0
"  runbook for the manual one : " + str(runbook_steps_written_for_that_renewal) + " steps" ^0
"  people who have done it : " + str(people_who_have_ever_renewed_it) ^0
"" ^0
"  the exercised path stands on an unexercised one, and" ^0
"  the unexercised one is the only path to the exercised" ^0
"  one" ^0
"" ^0

# ---- what the last renewal looked like ----

"the credential renewal, two years ago" ^0
"  how it was noticed : renewals began failing" ^0
"  days of notice before that : " + str(days_of_notice_the_last_time) ^0
"  what the monitor said : that the certificates were" ^0
"    fine, which they were, for another " ^0
"    " + str(days_before_expiry_a_renewal_runs) + " days" ^0
"  who fixed it : the " + str(people_who_have_ever_renewed_it) + " person who had done it before" ^0
"  what was written down afterwards : " ^0
"    " + str(runbook_steps_written_for_that_renewal) + " steps" ^0
"" ^0

# ---- null control ----

# The same automation, with the agent's own credential monitored on the same
# dashboard and its renewal rehearsed once between expiries.
1 => nc_monitors_watching_the_agent_credential
45 => nc_days_of_notice
4 => nc_times_the_credential_path_has_been_exercised

"null control - monitor and rehearse the credential too" ^0
"  expiry incidents : " + str(expiry_incidents) + ", unchanged" ^0
"  monitors watching the agent credential : " ^0
"    " + str(nc_monitors_watching_the_agent_credential) ^0
"  days of notice : " + str(nc_days_of_notice) ^0
"  times that path has been exercised : " ^0
"    " + str(nc_times_the_credential_path_has_been_exercised) ^0
"  the automation did not change; the path it stands on" ^0
"  was given the same treatment as the path it runs" ^0
"" ^0

# ---- the rule ----

"what four years without an expiry guarantees" ^0
"  a certificate is renewed before it expires : exactly," ^0
"    " + str(automated_renewals_so_far) + " times, " + str(days_before_expiry_a_renewal_runs) + " days early, " + str(renewal_failures_caught_by_the_monitor) + " failures caught" ^0
"  the renewal will happen next time : not addressed; it" ^0
"    requires a credential issued by hand, watched by " ^0
"    " + str(monitors_watching_the_agent_credential) + " monitors, renewed by " + str(people_who_have_ever_renewed_it) + " person" ^0
"" ^0
"the frequency of a path is not the strength of the system" ^0
"that contains it; a path run four thousand times for every" ^0
"one run of its prerequisite has been tested four thousand" ^0
"times and its prerequisite twice" ^0
"" ^0

"Renewal runs " + str(days_before_expiry_a_renewal_runs) + " days early on a schedule, the monitor reads the served" ^0
"certificate, and " + str(renewal_failures_caught_by_the_monitor) + " failures were caught across " + str(automated_renewals_so_far) + " renewals with " + str(expiry_incidents) ^0
"expiry incidents. It authenticates with a hand-issued credential renewed " ^0
"" + str(times_the_agent_credential_has_been_renewed) + " times by " + str(people_who_have_ever_renewed_it) + " person - " + str(automated_runs_per_manual_run) + " automated runs per manual one - under " ^0
"" + str(monitors_watching_the_agent_credential) + " monitors and " + str(runbook_steps_written_for_that_renewal) + " written steps." ^0
```

## Python (deterministic transpilation)

```python
certificates_under_automation = 2100
renewals_a_month = 175
months_of_operation = 48
days_before_expiry_a_renewal_runs = 30
renewal_failures_caught_by_the_monitor = 61
expiry_incidents = 0
agent_credential_lifetime_months = 24
times_the_agent_credential_has_been_renewed = 2
people_who_have_ever_renewed_it = 1
runbook_steps_written_for_that_renewal = 0
monitors_watching_the_agent_credential = 0
days_of_notice_the_last_time = 0
automated_renewals_so_far = renewals_a_month * months_of_operation
agent_credential_renewals_due_so_far = int(months_of_operation / agent_credential_lifetime_months)
automated_runs_per_manual_run = int(automated_renewals_so_far / times_the_agent_credential_has_been_renewed)
certificates_that_depend_on_the_manual_path = certificates_under_automation
print("certificates under automation   : " + str(certificates_under_automation))
print("renewals a month                : " + str(renewals_a_month))
print("months of operation             : " + str(months_of_operation))
print("automated renewals so far       : " + str(automated_renewals_so_far))
print("days before expiry a renewal runs : " + str(days_before_expiry_a_renewal_runs))
print("renewal failures caught         : " + str(renewal_failures_caught_by_the_monitor))
print("expiry incidents                : " + str(expiry_incidents))
print("")
print("the agent's own credential")
print("  lifetime, months              : " + str(agent_credential_lifetime_months))
print("  renewals due so far           : " + str(agent_credential_renewals_due_so_far))
print("  renewals performed            : " + str(times_the_agent_credential_has_been_renewed))
print("  people who have ever done it  : " + str(people_who_have_ever_renewed_it))
print("  runbook steps written for it  : " + str(runbook_steps_written_for_that_renewal))
print("  monitors watching its expiry  : " + str(monitors_watching_the_agent_credential))
print("  days of notice last time      : " + str(days_of_notice_the_last_time))
print("")
print("automated runs per manual run   : " + str(automated_runs_per_manual_run))
print("certificates depending on the manual path : " + str(certificates_that_depend_on_the_manual_path))
print("")
print("the renewal automation")
print("  when it runs : " + str(days_before_expiry_a_renewal_runs) + " days before expiry, on a")
print("    schedule, so a failure has a month of slack")
print("  what the monitor reads : the certificate the server")
print("    actually presents, not the one in the store")
print("  failures caught and fixed : " + str(renewal_failures_caught_by_the_monitor))
print("  expiry incidents in " + str(months_of_operation) + " months : " + str(expiry_incidents))
print("  dependence on a person remembering : none")
print("  verdict : AUTOMATED")
print("")
print("  monitoring the served certificate rather than the")
print("  stored one is the part almost nobody does, and it is")
print("  why the " + str(renewal_failures_caught_by_the_monitor) + " failures never became incidents")
print("")
print("two paths, and how often each runs")
print("  the renewal of a certificate : " + str(automated_renewals_so_far) + " times")
print("  the renewal of the credential that permits it : ")
print("    " + str(times_the_agent_credential_has_been_renewed) + " times")
print("  so automated runs per manual run : ")
print("    " + str(automated_runs_per_manual_run))
print("  runbook for the manual one : " + str(runbook_steps_written_for_that_renewal) + " steps")
print("  people who have done it : " + str(people_who_have_ever_renewed_it))
print("")
print("  the exercised path stands on an unexercised one, and")
print("  the unexercised one is the only path to the exercised")
print("  one")
print("")
print("the credential renewal, two years ago")
print("  how it was noticed : renewals began failing")
print("  days of notice before that : " + str(days_of_notice_the_last_time))
print("  what the monitor said : that the certificates were")
print("    fine, which they were, for another ")
print("    " + str(days_before_expiry_a_renewal_runs) + " days")
print("  who fixed it : the " + str(people_who_have_ever_renewed_it) + " person who had done it before")
print("  what was written down afterwards : ")
print("    " + str(runbook_steps_written_for_that_renewal) + " steps")
print("")
nc_monitors_watching_the_agent_credential = 1
nc_days_of_notice = 45
nc_times_the_credential_path_has_been_exercised = 4
print("null control - monitor and rehearse the credential too")
print("  expiry incidents : " + str(expiry_incidents) + ", unchanged")
print("  monitors watching the agent credential : ")
print("    " + str(nc_monitors_watching_the_agent_credential))
print("  days of notice : " + str(nc_days_of_notice))
print("  times that path has been exercised : ")
print("    " + str(nc_times_the_credential_path_has_been_exercised))
print("  the automation did not change; the path it stands on")
print("  was given the same treatment as the path it runs")
print("")
print("what four years without an expiry guarantees")
print("  a certificate is renewed before it expires : exactly,")
print("    " + str(automated_renewals_so_far) + " times, " + str(days_before_expiry_a_renewal_runs) + " days early, " + str(renewal_failures_caught_by_the_monitor) + " failures caught")
print("  the renewal will happen next time : not addressed; it")
print("    requires a credential issued by hand, watched by ")
print("    " + str(monitors_watching_the_agent_credential) + " monitors, renewed by " + str(people_who_have_ever_renewed_it) + " person")
print("")
print("the frequency of a path is not the strength of the system")
print("that contains it; a path run four thousand times for every")
print("one run of its prerequisite has been tested four thousand")
print("times and its prerequisite twice")
print("")
print("Renewal runs " + str(days_before_expiry_a_renewal_runs) + " days early on a schedule, the monitor reads the served")
print("certificate, and " + str(renewal_failures_caught_by_the_monitor) + " failures were caught across " + str(automated_renewals_so_far) + " renewals with " + str(expiry_incidents))
print("expiry incidents. It authenticates with a hand-issued credential renewed ")
print("" + str(times_the_agent_credential_has_been_renewed) + " times by " + str(people_who_have_ever_renewed_it) + " person - " + str(automated_runs_per_manual_run) + " automated runs per manual one - under ")
print("" + str(monitors_watching_the_agent_credential) + " monitors and " + str(runbook_steps_written_for_that_renewal) + " written steps.")
```

## stdout (executed)

```text
certificates under automation   : 2100
renewals a month                : 175
months of operation             : 48
automated renewals so far       : 8400
days before expiry a renewal runs : 30
renewal failures caught         : 61
expiry incidents                : 0

the agent's own credential
  lifetime, months              : 24
  renewals due so far           : 2
  renewals performed            : 2
  people who have ever done it  : 1
  runbook steps written for it  : 0
  monitors watching its expiry  : 0
  days of notice last time      : 0

automated runs per manual run   : 4200
certificates depending on the manual path : 2100

the renewal automation
  when it runs : 30 days before expiry, on a
    schedule, so a failure has a month of slack
  what the monitor reads : the certificate the server
    actually presents, not the one in the store
  failures caught and fixed : 61
  expiry incidents in 48 months : 0
  dependence on a person remembering : none
  verdict : AUTOMATED

  monitoring the served certificate rather than the
  stored one is the part almost nobody does, and it is
  why the 61 failures never became incidents

two paths, and how often each runs
  the renewal of a certificate : 8400 times
  the renewal of the credential that permits it : 
    2 times
  so automated runs per manual run : 
    4200
  runbook for the manual one : 0 steps
  people who have done it : 1

  the exercised path stands on an unexercised one, and
  the unexercised one is the only path to the exercised
  one

the credential renewal, two years ago
  how it was noticed : renewals began failing
  days of notice before that : 0
  what the monitor said : that the certificates were
    fine, which they were, for another 
    30 days
  who fixed it : the 1 person who had done it before
  what was written down afterwards : 
    0 steps

null control - monitor and rehearse the credential too
  expiry incidents : 0, unchanged
  monitors watching the agent credential : 
    1
  days of notice : 45
  times that path has been exercised : 
    4
  the automation did not change; the path it stands on
  was given the same treatment as the path it runs

what four years without an expiry guarantees
  a certificate is renewed before it expires : exactly,
    8400 times, 30 days early, 61 failures caught
  the renewal will happen next time : not addressed; it
    requires a credential issued by hand, watched by 
    0 monitors, renewed by 1 person

the frequency of a path is not the strength of the system
that contains it; a path run four thousand times for every
one run of its prerequisite has been tested four thousand
times and its prerequisite twice

Renewal runs 30 days early on a schedule, the monitor reads the served
certificate, and 61 failures were caught across 8400 renewals with 0
expiry incidents. It authenticates with a hand-issued credential renewed 
2 times by 1 person - 4200 automated runs per manual one - under 
0 monitors and 0 written steps.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
