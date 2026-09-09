<!-- canonical: efficientnewlanguage.org/ai/examples/764-the-count-was-of-users-and-the-identity-was-the-device | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 764 — The count was of users and the identity was the device

`the_count_was_of_users_and_the_identity_was_the_device.eml` - The daily active user figure is deduplicated, bot-filtered, timezone-corrected and reconciled against billing every month, and it has been computed the same way for thirty-four months. What it counts one of is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The daily active
# user figure is deduplicated, bot-filtered, timezone-corrected and reconciled
# against billing every month, and it has been computed the same way for
# thirty-four months. What it counts one of is computed below.
#
# The pipeline is careful. Bot traffic is removed by a classifier that is
# retrained quarterly and audited by hand; a day is the user's local day rather
# than the server's; the same identity appearing twice in a day is counted once;
# and the monthly reconciliation against billing has never drifted more than a
# few parts in ten thousand.
#
# The identity it deduplicates on is the install. A person with a phone and a
# laptop is two, and a tablet in a clinic waiting room is one.

184000 => daily_active_identities
34 => months_the_metric_has_run
9200 => bot_identities_removed_a_day
34 => monthly_reconciliations_against_billing
51000 => identities_signed_in
38000 => distinct_people_behind_them
620 => shared_devices_identified
24800 => people_behind_the_shared_devices
0 => identities_resolved_to_a_person_by_the_pipeline

daily_active_identities - identities_signed_in => identities_never_signed_in
int(identities_signed_in * 10000 / daily_active_identities) => signed_in_per_myriad
int(identities_signed_in * 10000 / distinct_people_behind_them) => identities_per_person_myriad
int(identities_never_signed_in * 10000 / identities_per_person_myriad) => people_the_same_rate_would_imply
people_the_same_rate_would_imply + distinct_people_behind_them => people_the_rate_would_imply_in_total
# The subtraction below is only meaningful once the reported figure is read as
# a count of people, which is what the sentence around it does and what this
# case is about. Naming that step is the point: identities minus people is not
# a quantity, and the line becomes one only by asserting they are the same
# kind of thing.
daily_active_identities => the_figure_reported_as_people
the_figure_reported_as_people - people_the_rate_would_imply_in_total => the_gap_that_rate_would_open
int(people_behind_the_shared_devices / shared_devices_identified) => people_per_shared_device

"daily active identities         : " + str(daily_active_identities) ^0
"bot identities removed a day    : " + str(bot_identities_removed_a_day) ^0
"months computed the same way    : " + str(months_the_metric_has_run) ^0
"reconciliations against billing : " + str(monthly_reconciliations_against_billing) ^0
"identities resolved to a person : " + str(identities_resolved_to_a_person_by_the_pipeline) ^0
"" ^0
"identities signed in            : " + str(identities_signed_in) ^0
"  distinct people behind them   : " + str(distinct_people_behind_them) ^0
"  identities per person         : " + str(identities_per_person_myriad) + " per ten thousand" ^0
"  signed-in share               : " + str(signed_in_per_myriad) + " per ten thousand" ^0
"identities never signed in      : " + str(identities_never_signed_in) ^0
"" ^0
"shared devices identified       : " + str(shared_devices_identified) ^0
"  people behind them            : " + str(people_behind_the_shared_devices) ^0
"  people per shared device      : " + str(people_per_shared_device) ^0
"" ^0

# ---- what the pipeline verified ----

"the active-user pipeline" ^0
"  bots : removed by a classifier retrained quarterly and" ^0
"    audited by hand, " + str(bot_identities_removed_a_day) + " a day" ^0
"  a day : the user's local day, not the server's" ^0
"  an identity seen twice : counted once" ^0
"  reconciliation against billing : monthly, " + str(monthly_reconciliations_against_billing) + " of them," ^0
"    never off by more than a few parts in ten thousand" ^0
"  verdict : DEDUPLICATED" ^0
"" ^0
"  reconciling against billing every month is the part" ^0
"  almost nobody does, and it is why the deduplication is" ^0
"  known to work rather than assumed to" ^0
"" ^0

# ---- which object carries the answer ----

"two objects" ^0
"  what the pipeline deduplicates : the install" ^0
"  what the sentence says : users" ^0
"  a person with a phone and a laptop : two" ^0
"  a tablet in a clinic waiting room : one, shared by" ^0
"    " + str(people_per_shared_device) ^0
"  identities the pipeline resolves to a person : " + str(identities_resolved_to_a_person_by_the_pipeline) ^0
"" ^0
"  deduplication is exact on the object it is given, and" ^0
"  the object it is given is a device" ^0
"" ^0

# ---- what the signed-in part shows ----

"where a person can be seen" ^0
"  identities signed in : " + str(identities_signed_in) ^0
"  distinct people behind them : " + str(distinct_people_behind_them) ^0
"  so identities per person, here : " + str(identities_per_person_myriad) + " per ten" ^0
"    thousand" ^0
"  identities never signed in : " + str(identities_never_signed_in) ^0
"  what the same rate would imply for them : " + str(people_the_same_rate_would_imply) ^0
"  and in total : " + str(people_the_rate_would_imply_in_total) ^0
"  read as people, the reported figure is : " + str(the_figure_reported_as_people) ^0
"  distance between the two : " + str(the_gap_that_rate_would_open) ^0
"" ^0
"  that last figure is an extrapolation, not a" ^0
"  measurement; the signed-in group is the part that could" ^0
"  be checked and it is the part that chose to sign in" ^0
"" ^0
"  and the subtraction only parses because the reported" ^0
"  figure was read as a count of people; identities minus" ^0
"  people is not a quantity until somebody equates them," ^0
"  which is the error this case is about" ^0
"" ^0

# ---- null control ----

# The same pipeline, over a period when an account was required to open the app
# at all, so every identity carries a person.
184000 => nc_identities_resolved_to_a_person
9200 => nc_bot_identities_removed_a_day
141900 => nc_distinct_people_a_day

"null control - require an account, resolve every identity" ^0
"  bots removed a day : " + str(nc_bot_identities_removed_a_day) + ", unchanged" ^0
"  identities resolved to a person : " + str(nc_identities_resolved_to_a_person) ^0
"  distinct people a day : " + str(nc_distinct_people_a_day) ^0
"  the deduplication did not improve; it was handed the" ^0
"  object the sentence had been about all along" ^0
"" ^0

# ---- the rule ----

"what a clean active-user figure guarantees" ^0
"  each active install is counted once : exactly, bots" ^0
"    removed, local days, " + str(months_the_metric_has_run) + " months of the same method" ^0
"  each active person is counted once : not addressed;" ^0
"    the pipeline never holds a person, so it can neither" ^0
"    merge two devices nor split one" ^0
"" ^0
"an exact count of one kind of thing is not an approximate" ^0
"count of another kind; the error is not noise around the" ^0
"figure, it is the figure being about something else" ^0
"" ^0

"Bots are removed by an audited classifier, days are local, repeats are merged," ^0
"and " + str(monthly_reconciliations_against_billing) + " monthly reconciliations against billing agree. The identity is the" ^0
"install, so " + str(identities_signed_in) + " signed-in identities stand for " + str(distinct_people_behind_them) + " people - " + str(identities_per_person_myriad) + " per" ^0
"ten thousand - " + str(shared_devices_identified) + " shared devices stand for " + str(people_behind_the_shared_devices) + ", and " + str(identities_resolved_to_a_person_by_the_pipeline) + " of the " + str(daily_active_identities) ^0
"are resolved to a person." ^0
```

## Python (deterministic transpilation)

```python
daily_active_identities = 184000
months_the_metric_has_run = 34
bot_identities_removed_a_day = 9200
monthly_reconciliations_against_billing = 34
identities_signed_in = 51000
distinct_people_behind_them = 38000
shared_devices_identified = 620
people_behind_the_shared_devices = 24800
identities_resolved_to_a_person_by_the_pipeline = 0
identities_never_signed_in = daily_active_identities - identities_signed_in
signed_in_per_myriad = int(identities_signed_in * 10000 / daily_active_identities)
identities_per_person_myriad = int(identities_signed_in * 10000 / distinct_people_behind_them)
people_the_same_rate_would_imply = int(identities_never_signed_in * 10000 / identities_per_person_myriad)
people_the_rate_would_imply_in_total = people_the_same_rate_would_imply + distinct_people_behind_them
the_figure_reported_as_people = daily_active_identities
the_gap_that_rate_would_open = the_figure_reported_as_people - people_the_rate_would_imply_in_total
people_per_shared_device = int(people_behind_the_shared_devices / shared_devices_identified)
print("daily active identities         : " + str(daily_active_identities))
print("bot identities removed a day    : " + str(bot_identities_removed_a_day))
print("months computed the same way    : " + str(months_the_metric_has_run))
print("reconciliations against billing : " + str(monthly_reconciliations_against_billing))
print("identities resolved to a person : " + str(identities_resolved_to_a_person_by_the_pipeline))
print("")
print("identities signed in            : " + str(identities_signed_in))
print("  distinct people behind them   : " + str(distinct_people_behind_them))
print("  identities per person         : " + str(identities_per_person_myriad) + " per ten thousand")
print("  signed-in share               : " + str(signed_in_per_myriad) + " per ten thousand")
print("identities never signed in      : " + str(identities_never_signed_in))
print("")
print("shared devices identified       : " + str(shared_devices_identified))
print("  people behind them            : " + str(people_behind_the_shared_devices))
print("  people per shared device      : " + str(people_per_shared_device))
print("")
print("the active-user pipeline")
print("  bots : removed by a classifier retrained quarterly and")
print("    audited by hand, " + str(bot_identities_removed_a_day) + " a day")
print("  a day : the user's local day, not the server's")
print("  an identity seen twice : counted once")
print("  reconciliation against billing : monthly, " + str(monthly_reconciliations_against_billing) + " of them,")
print("    never off by more than a few parts in ten thousand")
print("  verdict : DEDUPLICATED")
print("")
print("  reconciling against billing every month is the part")
print("  almost nobody does, and it is why the deduplication is")
print("  known to work rather than assumed to")
print("")
print("two objects")
print("  what the pipeline deduplicates : the install")
print("  what the sentence says : users")
print("  a person with a phone and a laptop : two")
print("  a tablet in a clinic waiting room : one, shared by")
print("    " + str(people_per_shared_device))
print("  identities the pipeline resolves to a person : " + str(identities_resolved_to_a_person_by_the_pipeline))
print("")
print("  deduplication is exact on the object it is given, and")
print("  the object it is given is a device")
print("")
print("where a person can be seen")
print("  identities signed in : " + str(identities_signed_in))
print("  distinct people behind them : " + str(distinct_people_behind_them))
print("  so identities per person, here : " + str(identities_per_person_myriad) + " per ten")
print("    thousand")
print("  identities never signed in : " + str(identities_never_signed_in))
print("  what the same rate would imply for them : " + str(people_the_same_rate_would_imply))
print("  and in total : " + str(people_the_rate_would_imply_in_total))
print("  read as people, the reported figure is : " + str(the_figure_reported_as_people))
print("  distance between the two : " + str(the_gap_that_rate_would_open))
print("")
print("  that last figure is an extrapolation, not a")
print("  measurement; the signed-in group is the part that could")
print("  be checked and it is the part that chose to sign in")
print("")
print("  and the subtraction only parses because the reported")
print("  figure was read as a count of people; identities minus")
print("  people is not a quantity until somebody equates them,")
print("  which is the error this case is about")
print("")
nc_identities_resolved_to_a_person = 184000
nc_bot_identities_removed_a_day = 9200
nc_distinct_people_a_day = 141900
print("null control - require an account, resolve every identity")
print("  bots removed a day : " + str(nc_bot_identities_removed_a_day) + ", unchanged")
print("  identities resolved to a person : " + str(nc_identities_resolved_to_a_person))
print("  distinct people a day : " + str(nc_distinct_people_a_day))
print("  the deduplication did not improve; it was handed the")
print("  object the sentence had been about all along")
print("")
print("what a clean active-user figure guarantees")
print("  each active install is counted once : exactly, bots")
print("    removed, local days, " + str(months_the_metric_has_run) + " months of the same method")
print("  each active person is counted once : not addressed;")
print("    the pipeline never holds a person, so it can neither")
print("    merge two devices nor split one")
print("")
print("an exact count of one kind of thing is not an approximate")
print("count of another kind; the error is not noise around the")
print("figure, it is the figure being about something else")
print("")
print("Bots are removed by an audited classifier, days are local, repeats are merged,")
print("and " + str(monthly_reconciliations_against_billing) + " monthly reconciliations against billing agree. The identity is the")
print("install, so " + str(identities_signed_in) + " signed-in identities stand for " + str(distinct_people_behind_them) + " people - " + str(identities_per_person_myriad) + " per")
print("ten thousand - " + str(shared_devices_identified) + " shared devices stand for " + str(people_behind_the_shared_devices) + ", and " + str(identities_resolved_to_a_person_by_the_pipeline) + " of the " + str(daily_active_identities))
print("are resolved to a person.")
```

## stdout (executed)

```text
daily active identities         : 184000
bot identities removed a day    : 9200
months computed the same way    : 34
reconciliations against billing : 34
identities resolved to a person : 0

identities signed in            : 51000
  distinct people behind them   : 38000
  identities per person         : 13421 per ten thousand
  signed-in share               : 2771 per ten thousand
identities never signed in      : 133000

shared devices identified       : 620
  people behind them            : 24800
  people per shared device      : 40

the active-user pipeline
  bots : removed by a classifier retrained quarterly and
    audited by hand, 9200 a day
  a day : the user's local day, not the server's
  an identity seen twice : counted once
  reconciliation against billing : monthly, 34 of them,
    never off by more than a few parts in ten thousand
  verdict : DEDUPLICATED

  reconciling against billing every month is the part
  almost nobody does, and it is why the deduplication is
  known to work rather than assumed to

two objects
  what the pipeline deduplicates : the install
  what the sentence says : users
  a person with a phone and a laptop : two
  a tablet in a clinic waiting room : one, shared by
    40
  identities the pipeline resolves to a person : 0

  deduplication is exact on the object it is given, and
  the object it is given is a device

where a person can be seen
  identities signed in : 51000
  distinct people behind them : 38000
  so identities per person, here : 13421 per ten
    thousand
  identities never signed in : 133000
  what the same rate would imply for them : 99098
  and in total : 137098
  read as people, the reported figure is : 184000
  distance between the two : 46902

  that last figure is an extrapolation, not a
  measurement; the signed-in group is the part that could
  be checked and it is the part that chose to sign in

  and the subtraction only parses because the reported
  figure was read as a count of people; identities minus
  people is not a quantity until somebody equates them,
  which is the error this case is about

null control - require an account, resolve every identity
  bots removed a day : 9200, unchanged
  identities resolved to a person : 184000
  distinct people a day : 141900
  the deduplication did not improve; it was handed the
  object the sentence had been about all along

what a clean active-user figure guarantees
  each active install is counted once : exactly, bots
    removed, local days, 34 months of the same method
  each active person is counted once : not addressed;
    the pipeline never holds a person, so it can neither
    merge two devices nor split one

an exact count of one kind of thing is not an approximate
count of another kind; the error is not noise around the
figure, it is the figure being about something else

Bots are removed by an audited classifier, days are local, repeats are merged,
and 34 monthly reconciliations against billing agree. The identity is the
install, so 51000 signed-in identities stand for 38000 people - 13421 per
ten thousand - 620 shared devices stand for 24800, and 0 of the 184000
are resolved to a person.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
