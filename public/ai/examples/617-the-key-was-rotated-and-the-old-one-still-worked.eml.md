<!-- canonical: efficientnewlanguage.org/ai/examples/617-the-key-was-rotated-and-the-old-one-still-worked | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 617 — The key was rotated and the old one still worked

`the_key_was_rotated_and_the_old_one_still_worked.eml` - Fourteen signing keys were rotated on schedule. Every rotation is recorded as complete. What the old keys can still do is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Fourteen signing
# keys were rotated on schedule. Every rotation is recorded as complete. What
# the old keys can still do is computed below.
#
# The overlap is correct and it is why rotation is possible at all. A key
# cannot be replaced instantaneously across services that deploy on their own
# cadence: accept both for a window, let each consumer move when it can, then
# retire the old one. Cutting straight over means an outage for whoever had not
# redeployed, which is how a security improvement becomes an incident and then
# becomes something nobody schedules again.
#
# The window has two ends. Issuing the new key is a dated event with an owner;
# retiring the old one is a deletion that breaks whoever has not moved, and it
# has no deadline that anything enforces.
#
# So the first half completes on time, fourteen times, and the second half is
# the step that gets deferred once and then stops being tracked.

14 => keys_rotated
7 => intended_overlap_days
143 => mean_age_of_old_keys_days
27 => consumers
24 => consumers_migrated

"keys rotated                   : " + str(keys_rotated) ^0
"intended overlap               : " + str(intended_overlap_days) + " days" ^0
"consumers of these keys        : " + str(consumers) ^0
"" ^0

# ---- what the rotation did ----

"the rotation, against what it promises" ^0
"  new keys issued              : " + str(keys_rotated) + " of " + str(keys_rotated) ^0
"  distributed to every consumer: yes" ^0
"  failed authentications after : 0" ^0
"  rotations recorded complete  : " + str(keys_rotated) ^0
"  defects in the rotation      : 0" ^0
"" ^0
"  everything on that list is about the NEW key" ^0
"" ^0

# ---- the other end of the window ----

keys_rotated => old_keys_still_accepted
mean_age_of_old_keys_days - intended_overlap_days => days_past_the_window

"the old keys" ^0
"  still accepted          : " + str(old_keys_still_accepted) + " of " + str(keys_rotated) ^0
"  mean age                : " + str(mean_age_of_old_keys_days) + " days" ^0
"  intended overlap        : " + str(intended_overlap_days) + " days" ^0
"  days past the window    : " + str(days_past_the_window) ^0
"  revocations performed   : 0" ^0
"" ^0
int(mean_age_of_old_keys_days * 10 / intended_overlap_days) => overrun_tenths
"  the overlap is " + str(int(overrun_tenths / 10)) + " point " + str(overrun_tenths % 10) + " times as long as designed" ^0
"" ^0

# ---- why nobody closes it ----

consumers - consumers_migrated => consumers_not_migrated

"who the deletion would break" ^0
"  consumers migrated       : " + str(consumers_migrated) + " of " + str(consumers) ^0
"  consumers not migrated   : " + str(consumers_not_migrated) ^0
"  services owned by other teams : " + str(consumers_not_migrated) ^0
"" ^0
int(consumers_migrated * 100 / consumers) => migrated_share
"  " + str(migrated_share) + " percent of consumers are ready" ^0
# 100 minus a truncated share is not the other share: 24 of 27 floors to 88
# and 3 of 27 floors to 11, so the pair would print 88 and 12 and neither
# number would be the count. The count is the informative form anyway.
"  and the retirement is blocked by the other " + str(consumers_not_migrated) + " of " + str(consumers) + "," ^0
"  none of them owned by the team" ^0
"  holding the delete button" ^0
"" ^0

# ---- what rotation was supposed to buy ----
#
# The point of rotating is that a key which leaked before the rotation stops
# working after it. That property is the deletion, not the issuance.

"a key that leaked the day before rotation" ^0
"  still valid after the new key was issued : yes" ^0
"  still valid " + str(mean_age_of_old_keys_days) + " days later            : yes" ^0
"  window during which it is useful         : unbounded" ^0
"" ^0
"  the leak is contained by the retirement, and the retirement" ^0
"  is the half that did not happen" ^0
"" ^0

# ---- the register ----

"key   rotated   old key retired   status recorded" ^0
for k in [1:4]:
    k * 47 => age
    "  " + str(k) + "     yes       no                complete" ^0
"" ^0
"  the status column is reporting the issuance, truthfully" ^0
"" ^0

# ---- the control ----
#
# The overlap, against what it prevents. Without it, every rotation is an
# outage for whichever consumer had not redeployed, and there are three of
# those today.

"control - is the overlap earning its place" ^0
"  consumers that would break on a hard cutover : " + str(consumers_not_migrated) ^0
"  outages caused by rotation so far            : 0" ^0
"  rotations abandoned midway                   : 0" ^0
"  defects in the overlap mechanism             : 0" ^0
"" ^0
"  removing the overlap does not retire the old keys," ^0
"  it breaks " + str(consumers_not_migrated) + " services and stops the next rotation happening" ^0
"" ^0

# ---- the null control ----
#
# The same rotation, same overlap, same consumers, with the old key carrying an
# expiry set at issuance rather than a deletion scheduled by hand. Nothing about
# the window changes.

intended_overlap_days => nc_max_age_days
0 => nc_old_keys_accepted

"null control - the old key given an expiry when the new one is issued" ^0
"  overlap                  : " + str(nc_max_age_days) + " days, as designed" ^0
"  old keys still accepted  : " + str(nc_old_keys_accepted) ^0
"  consumers that break     : " + str(consumers_not_migrated) + ", on day " + str(nc_max_age_days) + ", loudly" ^0
"  the deadline did not become easier to meet" ^0
"  it stopped depending on somebody choosing a day to delete" ^0
"" ^0

# ---- the rule ----

"what a completed rotation records" ^0
"  a new key exists and is trusted   : yes, dated, owned" ^0
"  the old key no longer works       : a separate act, undated" ^0
"  and only the second one is the security property" ^0
"" ^0
"an overlap with an end date somebody must choose is not an" ^0
"overlap, it is a permanent second key; the expiry has to be" ^0
"set by the same event that issues the replacement" ^0
"" ^0

"All " + str(keys_rotated) + " rotations completed on schedule with 0 failed authentications and 0" ^0
"outages, which is what the overlap was for: " + str(consumers_not_migrated) + " of " + str(consumers) + " consumers would break on" ^0
"a hard cutover. All " + str(old_keys_still_accepted) + " old keys are still accepted at a mean age of " + str(mean_age_of_old_keys_days) ^0
"days - " + str(int(overrun_tenths / 10)) + " point " + str(overrun_tenths % 10) + " times the designed window, " + str(days_past_the_window) + " days past it - and the number of" ^0
"revocations is 0, because issuing has an owner and deleting has a blocker." ^0
```

## Python (deterministic transpilation)

```python
keys_rotated = 14
intended_overlap_days = 7
mean_age_of_old_keys_days = 143
consumers = 27
consumers_migrated = 24
print("keys rotated                   : " + str(keys_rotated))
print("intended overlap               : " + str(intended_overlap_days) + " days")
print("consumers of these keys        : " + str(consumers))
print("")
print("the rotation, against what it promises")
print("  new keys issued              : " + str(keys_rotated) + " of " + str(keys_rotated))
print("  distributed to every consumer: yes")
print("  failed authentications after : 0")
print("  rotations recorded complete  : " + str(keys_rotated))
print("  defects in the rotation      : 0")
print("")
print("  everything on that list is about the NEW key")
print("")
old_keys_still_accepted = keys_rotated
days_past_the_window = mean_age_of_old_keys_days - intended_overlap_days
print("the old keys")
print("  still accepted          : " + str(old_keys_still_accepted) + " of " + str(keys_rotated))
print("  mean age                : " + str(mean_age_of_old_keys_days) + " days")
print("  intended overlap        : " + str(intended_overlap_days) + " days")
print("  days past the window    : " + str(days_past_the_window))
print("  revocations performed   : 0")
print("")
overrun_tenths = int(mean_age_of_old_keys_days * 10 / intended_overlap_days)
print("  the overlap is " + str(int(overrun_tenths / 10)) + " point " + str(overrun_tenths % 10) + " times as long as designed")
print("")
consumers_not_migrated = consumers - consumers_migrated
print("who the deletion would break")
print("  consumers migrated       : " + str(consumers_migrated) + " of " + str(consumers))
print("  consumers not migrated   : " + str(consumers_not_migrated))
print("  services owned by other teams : " + str(consumers_not_migrated))
print("")
migrated_share = int(consumers_migrated * 100 / consumers)
print("  " + str(migrated_share) + " percent of consumers are ready")
print("  and the retirement is blocked by the other " + str(consumers_not_migrated) + " of " + str(consumers) + ",")
print("  none of them owned by the team")
print("  holding the delete button")
print("")
print("a key that leaked the day before rotation")
print("  still valid after the new key was issued : yes")
print("  still valid " + str(mean_age_of_old_keys_days) + " days later            : yes")
print("  window during which it is useful         : unbounded")
print("")
print("  the leak is contained by the retirement, and the retirement")
print("  is the half that did not happen")
print("")
print("key   rotated   old key retired   status recorded")
for k in range(1, 5):
    age = k * 47
    print("  " + str(k) + "     yes       no                complete")
print("")
print("  the status column is reporting the issuance, truthfully")
print("")
print("control - is the overlap earning its place")
print("  consumers that would break on a hard cutover : " + str(consumers_not_migrated))
print("  outages caused by rotation so far            : 0")
print("  rotations abandoned midway                   : 0")
print("  defects in the overlap mechanism             : 0")
print("")
print("  removing the overlap does not retire the old keys,")
print("  it breaks " + str(consumers_not_migrated) + " services and stops the next rotation happening")
print("")
nc_max_age_days = intended_overlap_days
nc_old_keys_accepted = 0
print("null control - the old key given an expiry when the new one is issued")
print("  overlap                  : " + str(nc_max_age_days) + " days, as designed")
print("  old keys still accepted  : " + str(nc_old_keys_accepted))
print("  consumers that break     : " + str(consumers_not_migrated) + ", on day " + str(nc_max_age_days) + ", loudly")
print("  the deadline did not become easier to meet")
print("  it stopped depending on somebody choosing a day to delete")
print("")
print("what a completed rotation records")
print("  a new key exists and is trusted   : yes, dated, owned")
print("  the old key no longer works       : a separate act, undated")
print("  and only the second one is the security property")
print("")
print("an overlap with an end date somebody must choose is not an")
print("overlap, it is a permanent second key; the expiry has to be")
print("set by the same event that issues the replacement")
print("")
print("All " + str(keys_rotated) + " rotations completed on schedule with 0 failed authentications and 0")
print("outages, which is what the overlap was for: " + str(consumers_not_migrated) + " of " + str(consumers) + " consumers would break on")
print("a hard cutover. All " + str(old_keys_still_accepted) + " old keys are still accepted at a mean age of " + str(mean_age_of_old_keys_days))
print("days - " + str(int(overrun_tenths / 10)) + " point " + str(overrun_tenths % 10) + " times the designed window, " + str(days_past_the_window) + " days past it - and the number of")
print("revocations is 0, because issuing has an owner and deleting has a blocker.")
```

## stdout (executed)

```text
keys rotated                   : 14
intended overlap               : 7 days
consumers of these keys        : 27

the rotation, against what it promises
  new keys issued              : 14 of 14
  distributed to every consumer: yes
  failed authentications after : 0
  rotations recorded complete  : 14
  defects in the rotation      : 0

  everything on that list is about the NEW key

the old keys
  still accepted          : 14 of 14
  mean age                : 143 days
  intended overlap        : 7 days
  days past the window    : 136
  revocations performed   : 0

  the overlap is 20 point 4 times as long as designed

who the deletion would break
  consumers migrated       : 24 of 27
  consumers not migrated   : 3
  services owned by other teams : 3

  88 percent of consumers are ready
  and the retirement is blocked by the other 3 of 27,
  none of them owned by the team
  holding the delete button

a key that leaked the day before rotation
  still valid after the new key was issued : yes
  still valid 143 days later            : yes
  window during which it is useful         : unbounded

  the leak is contained by the retirement, and the retirement
  is the half that did not happen

key   rotated   old key retired   status recorded
  1     yes       no                complete
  2     yes       no                complete
  3     yes       no                complete
  4     yes       no                complete

  the status column is reporting the issuance, truthfully

control - is the overlap earning its place
  consumers that would break on a hard cutover : 3
  outages caused by rotation so far            : 0
  rotations abandoned midway                   : 0
  defects in the overlap mechanism             : 0

  removing the overlap does not retire the old keys,
  it breaks 3 services and stops the next rotation happening

null control - the old key given an expiry when the new one is issued
  overlap                  : 7 days, as designed
  old keys still accepted  : 0
  consumers that break     : 3, on day 7, loudly
  the deadline did not become easier to meet
  it stopped depending on somebody choosing a day to delete

what a completed rotation records
  a new key exists and is trusted   : yes, dated, owned
  the old key no longer works       : a separate act, undated
  and only the second one is the security property

an overlap with an end date somebody must choose is not an
overlap, it is a permanent second key; the expiry has to be
set by the same event that issues the replacement

All 14 rotations completed on schedule with 0 failed authentications and 0
outages, which is what the overlap was for: 3 of 27 consumers would break on
a hard cutover. All 14 old keys are still accepted at a mean age of 143
days - 20 point 4 times the designed window, 136 days past it - and the number of
revocations is 0, because issuing has an owner and deleting has a blocker.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
