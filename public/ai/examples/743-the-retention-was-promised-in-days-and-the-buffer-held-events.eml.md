<!-- canonical: efficientnewlanguage.org/ai/examples/743-the-retention-was-promised-in-days-and-the-buffer-held-events | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 743 — The retention was promised in days and the buffer held events

`the_retention_was_promised_in_days_and_the_buffer_held_events.eml` - The log retention policy says thirty days, is written down, is cited in three audits, and the store enforces it. What the store enforces is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The log retention
# policy says thirty days, is written down, is cited in three audits, and the
# store enforces it. What the store enforces is computed below.
#
# The policy is a real policy. It is not folklore: it is written, it names the
# period rather than saying reasonable, it was chosen against the investigation
# needs rather than against the storage bill, it is cited in three audit
# responses, and the store is genuinely configured to delete records older than
# thirty days rather than keeping them forever.
#
# The store is a fixed-size ring. It deletes at thirty days OR when it is full,
# whichever comes first, and at today's write rate it is full in four.
#
# Nothing alerts when the oldest record is younger than the policy.

30 => retention_days_promised
24 => hours_in_a_day
4000 => store_gigabytes
1000 => gigabytes_written_per_day
3 => audits_citing_the_policy
0 => alerts_when_the_oldest_record_is_younger_than_the_policy
6 => investigations_needing_a_window_older_than_the_store

retention_days_promised * hours_in_a_day => promised_hours
int(store_gigabytes / gigabytes_written_per_day) => actual_days
actual_days * hours_in_a_day => actual_hours
int(actual_hours * 10000 / promised_hours) => actual_per_myriad_of_promised
retention_days_promised - actual_days => days_the_policy_promises_beyond_the_store

"retention promised, days        : " + str(retention_days_promised) ^0
"  in hours                      : " + str(promised_hours) ^0
"audits citing the policy        : " + str(audits_citing_the_policy) ^0
"" ^0
"store, GB                       : " + str(store_gigabytes) ^0
"written per day, GB             : " + str(gigabytes_written_per_day) ^0
"  the store therefore holds, days : " + str(actual_days) ^0
"  in hours                      : " + str(actual_hours) ^0
"  as a share of the promise     : " + str(actual_per_myriad_of_promised) + " per ten thousand" ^0
"  days promised beyond the store: " + str(days_the_policy_promises_beyond_the_store) ^0
"" ^0
"alerts on the oldest record     : " + str(alerts_when_the_oldest_record_is_younger_than_the_policy) ^0
"investigations needing an older window : " + str(investigations_needing_a_window_older_than_the_store) ^0
"" ^0

# ---- what the policy verified ----

"the retention policy" ^0
"  written down : yes, not folklore" ^0
"  names a period : " + str(retention_days_promised) + " days, not `reasonable`" ^0
"  chosen against : the investigation needs, not the bill" ^0
"  cited in audit responses : " + str(audits_citing_the_policy) ^0
"  is the store configured to enforce it : yes, it deletes" ^0
"    at " + str(retention_days_promised) + " days rather than keeping forever" ^0
"  verdict : POLICY ENFORCED" ^0
"" ^0
"  naming the period and choosing it against the need is" ^0
"  what makes this a policy instead of a default" ^0
"" ^0

# ---- the second deletion rule ----

"what the store does" ^0
"  rule one : delete records older than " + str(retention_days_promised) + " days" ^0
"  rule two : delete the oldest when the ring is full" ^0
"  which one fires : whichever comes first" ^0
"  at " + str(gigabytes_written_per_day) + " GB a day into " + str(store_gigabytes) + " GB, that is : rule two" ^0
"  hours actually held : " + str(actual_hours) ^0
"  hours promised       : " + str(promised_hours) ^0
"" ^0
"  both rules are correctly implemented; the policy names" ^0
"  one of them and the capacity decides" ^0
"" ^0
# ---- the promise is in one unit and the store in another ----

"the two denominations" ^0
"  the policy is stated in : days" ^0
"  the store is sized in   : gigabytes" ^0
"  what converts between them : the write rate" ^0
"  who controls the write rate : every team that logs" ^0
"  who reviews the conversion : nobody; it is not a" ^0
"    number either document contains" ^0
"  days promised beyond what the store holds : " ^0
"    " + str(days_the_policy_promises_beyond_the_store) ^0
"" ^0

# ---- how it got here without a decision ----

# The rate grew because more services started logging, each addition small and
# each obviously correct. No change was ever made to the retention policy and
# none was ever made to the store size, so no review was ever triggered.
"the drift" ^0
"  changes to the policy : none" ^0
"  changes to the store size : none" ^0
"  changes to the write rate : many, each small" ^0
"  was any of them wrong : no" ^0
"  which of the three has a review process : the first" ^0
"    two" ^0
"  which one moved : the third" ^0
"" ^0

# ---- what the audits were told ----

"the audit answer" ^0
"  question asked : how long are logs retained" ^0
"  answer given   : " + str(retention_days_promised) + " days, with the policy attached" ^0
"  is the policy real : yes" ^0
"  is the store configured to it : yes" ^0
"  what nobody queried : the timestamp of the oldest" ^0
"    record in the store" ^0
"  what that query returns : " + str(actual_hours) + " hours" ^0
"  audits given the " + str(retention_days_promised) + "-day answer : " + str(audits_citing_the_policy) ^0
"" ^0

# ---- null control ----

# The same policy, with a check that reads the oldest record's age and alerts
# when it is younger than the policy period.
1 => nc_alerts_when_the_oldest_record_is_younger_than_the_policy
0 => nc_investigations_that_would_be_surprised

"null control - alert on the age of the oldest record" ^0
"  policy : " + str(retention_days_promised) + " days, unchanged" ^0
"  alerts on the oldest record : " + str(nc_alerts_when_the_oldest_record_is_younger_than_the_policy) ^0
"  investigations surprised by an empty window : " ^0
"    " + str(nc_investigations_that_would_be_surprised) ^0
"  the store did not get bigger; the gap between the" ^0
"  promise and the contents became a thing that reports" ^0
"" ^0

# ---- the rule ----

"what an enforced retention policy guarantees" ^0
"  nothing older than the period is kept : exactly, and" ^0
"    that is the direction the policy was written to bound" ^0
"  everything inside the period is kept : not addressed;" ^0
"    the policy states an upper bound in time and the" ^0
"    store enforces an upper bound in bytes" ^0
"" ^0
"a policy expressed in one unit and a mechanism sized in" ^0
"another are joined by a rate nobody owns; the policy stays" ^0
"true, the store stays correct, and the quantity between them" ^0
"moves without either document changing" ^0
"" ^0

"The policy is written, names " + str(retention_days_promised) + " days rather than saying reasonable, was chosen" ^0
"against the investigation needs, is cited in " + str(audits_citing_the_policy) + " audits, and the store deletes" ^0
"at that age rather than keeping forever. The store is " + str(store_gigabytes) + " GB and " + str(gigabytes_written_per_day) + " GB" ^0
"arrive a day, so it holds " + str(actual_hours) + " hours against " + str(promised_hours) + " promised - " + str(actual_per_myriad_of_promised) + " per ten" ^0
"thousand - with " + str(alerts_when_the_oldest_record_is_younger_than_the_policy) + " alerts and " + str(investigations_needing_a_window_older_than_the_store) + " investigations that found it empty." ^0
```

## Python (deterministic transpilation)

```python
retention_days_promised = 30
hours_in_a_day = 24
store_gigabytes = 4000
gigabytes_written_per_day = 1000
audits_citing_the_policy = 3
alerts_when_the_oldest_record_is_younger_than_the_policy = 0
investigations_needing_a_window_older_than_the_store = 6
promised_hours = retention_days_promised * hours_in_a_day
actual_days = int(store_gigabytes / gigabytes_written_per_day)
actual_hours = actual_days * hours_in_a_day
actual_per_myriad_of_promised = int(actual_hours * 10000 / promised_hours)
days_the_policy_promises_beyond_the_store = retention_days_promised - actual_days
print("retention promised, days        : " + str(retention_days_promised))
print("  in hours                      : " + str(promised_hours))
print("audits citing the policy        : " + str(audits_citing_the_policy))
print("")
print("store, GB                       : " + str(store_gigabytes))
print("written per day, GB             : " + str(gigabytes_written_per_day))
print("  the store therefore holds, days : " + str(actual_days))
print("  in hours                      : " + str(actual_hours))
print("  as a share of the promise     : " + str(actual_per_myriad_of_promised) + " per ten thousand")
print("  days promised beyond the store: " + str(days_the_policy_promises_beyond_the_store))
print("")
print("alerts on the oldest record     : " + str(alerts_when_the_oldest_record_is_younger_than_the_policy))
print("investigations needing an older window : " + str(investigations_needing_a_window_older_than_the_store))
print("")
print("the retention policy")
print("  written down : yes, not folklore")
print("  names a period : " + str(retention_days_promised) + " days, not `reasonable`")
print("  chosen against : the investigation needs, not the bill")
print("  cited in audit responses : " + str(audits_citing_the_policy))
print("  is the store configured to enforce it : yes, it deletes")
print("    at " + str(retention_days_promised) + " days rather than keeping forever")
print("  verdict : POLICY ENFORCED")
print("")
print("  naming the period and choosing it against the need is")
print("  what makes this a policy instead of a default")
print("")
print("what the store does")
print("  rule one : delete records older than " + str(retention_days_promised) + " days")
print("  rule two : delete the oldest when the ring is full")
print("  which one fires : whichever comes first")
print("  at " + str(gigabytes_written_per_day) + " GB a day into " + str(store_gigabytes) + " GB, that is : rule two")
print("  hours actually held : " + str(actual_hours))
print("  hours promised       : " + str(promised_hours))
print("")
print("  both rules are correctly implemented; the policy names")
print("  one of them and the capacity decides")
print("")
print("the two denominations")
print("  the policy is stated in : days")
print("  the store is sized in   : gigabytes")
print("  what converts between them : the write rate")
print("  who controls the write rate : every team that logs")
print("  who reviews the conversion : nobody; it is not a")
print("    number either document contains")
print("  days promised beyond what the store holds : ")
print("    " + str(days_the_policy_promises_beyond_the_store))
print("")
print("the drift")
print("  changes to the policy : none")
print("  changes to the store size : none")
print("  changes to the write rate : many, each small")
print("  was any of them wrong : no")
print("  which of the three has a review process : the first")
print("    two")
print("  which one moved : the third")
print("")
print("the audit answer")
print("  question asked : how long are logs retained")
print("  answer given   : " + str(retention_days_promised) + " days, with the policy attached")
print("  is the policy real : yes")
print("  is the store configured to it : yes")
print("  what nobody queried : the timestamp of the oldest")
print("    record in the store")
print("  what that query returns : " + str(actual_hours) + " hours")
print("  audits given the " + str(retention_days_promised) + "-day answer : " + str(audits_citing_the_policy))
print("")
nc_alerts_when_the_oldest_record_is_younger_than_the_policy = 1
nc_investigations_that_would_be_surprised = 0
print("null control - alert on the age of the oldest record")
print("  policy : " + str(retention_days_promised) + " days, unchanged")
print("  alerts on the oldest record : " + str(nc_alerts_when_the_oldest_record_is_younger_than_the_policy))
print("  investigations surprised by an empty window : ")
print("    " + str(nc_investigations_that_would_be_surprised))
print("  the store did not get bigger; the gap between the")
print("  promise and the contents became a thing that reports")
print("")
print("what an enforced retention policy guarantees")
print("  nothing older than the period is kept : exactly, and")
print("    that is the direction the policy was written to bound")
print("  everything inside the period is kept : not addressed;")
print("    the policy states an upper bound in time and the")
print("    store enforces an upper bound in bytes")
print("")
print("a policy expressed in one unit and a mechanism sized in")
print("another are joined by a rate nobody owns; the policy stays")
print("true, the store stays correct, and the quantity between them")
print("moves without either document changing")
print("")
print("The policy is written, names " + str(retention_days_promised) + " days rather than saying reasonable, was chosen")
print("against the investigation needs, is cited in " + str(audits_citing_the_policy) + " audits, and the store deletes")
print("at that age rather than keeping forever. The store is " + str(store_gigabytes) + " GB and " + str(gigabytes_written_per_day) + " GB")
print("arrive a day, so it holds " + str(actual_hours) + " hours against " + str(promised_hours) + " promised - " + str(actual_per_myriad_of_promised) + " per ten")
print("thousand - with " + str(alerts_when_the_oldest_record_is_younger_than_the_policy) + " alerts and " + str(investigations_needing_a_window_older_than_the_store) + " investigations that found it empty.")
```

## stdout (executed)

```text
retention promised, days        : 30
  in hours                      : 720
audits citing the policy        : 3

store, GB                       : 4000
written per day, GB             : 1000
  the store therefore holds, days : 4
  in hours                      : 96
  as a share of the promise     : 1333 per ten thousand
  days promised beyond the store: 26

alerts on the oldest record     : 0
investigations needing an older window : 6

the retention policy
  written down : yes, not folklore
  names a period : 30 days, not `reasonable`
  chosen against : the investigation needs, not the bill
  cited in audit responses : 3
  is the store configured to enforce it : yes, it deletes
    at 30 days rather than keeping forever
  verdict : POLICY ENFORCED

  naming the period and choosing it against the need is
  what makes this a policy instead of a default

what the store does
  rule one : delete records older than 30 days
  rule two : delete the oldest when the ring is full
  which one fires : whichever comes first
  at 1000 GB a day into 4000 GB, that is : rule two
  hours actually held : 96
  hours promised       : 720

  both rules are correctly implemented; the policy names
  one of them and the capacity decides

the two denominations
  the policy is stated in : days
  the store is sized in   : gigabytes
  what converts between them : the write rate
  who controls the write rate : every team that logs
  who reviews the conversion : nobody; it is not a
    number either document contains
  days promised beyond what the store holds : 
    26

the drift
  changes to the policy : none
  changes to the store size : none
  changes to the write rate : many, each small
  was any of them wrong : no
  which of the three has a review process : the first
    two
  which one moved : the third

the audit answer
  question asked : how long are logs retained
  answer given   : 30 days, with the policy attached
  is the policy real : yes
  is the store configured to it : yes
  what nobody queried : the timestamp of the oldest
    record in the store
  what that query returns : 96 hours
  audits given the 30-day answer : 3

null control - alert on the age of the oldest record
  policy : 30 days, unchanged
  alerts on the oldest record : 1
  investigations surprised by an empty window : 
    0
  the store did not get bigger; the gap between the
  promise and the contents became a thing that reports

what an enforced retention policy guarantees
  nothing older than the period is kept : exactly, and
    that is the direction the policy was written to bound
  everything inside the period is kept : not addressed;
    the policy states an upper bound in time and the
    store enforces an upper bound in bytes

a policy expressed in one unit and a mechanism sized in
another are joined by a rate nobody owns; the policy stays
true, the store stays correct, and the quantity between them
moves without either document changing

The policy is written, names 30 days rather than saying reasonable, was chosen
against the investigation needs, is cited in 3 audits, and the store deletes
at that age rather than keeping forever. The store is 4000 GB and 1000 GB
arrive a day, so it holds 96 hours against 720 promised - 1333 per ten
thousand - with 0 alerts and 6 investigations that found it empty.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
