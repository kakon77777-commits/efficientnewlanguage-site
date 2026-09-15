<!-- canonical: efficientnewlanguage.org/ai/examples/856-the-first-seen-was-read-as-the-first-time | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 856 — The first seen was read as the first time

`the_first_seen_was_read_as_the_first_time.eml` - A cohort report counts accounts acquired in the first month, and it reads the earliest recorded activity for every account correctly. What the earliest record actually marks is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A cohort report
# counts accounts acquired in the first month, and it reads the earliest recorded
# activity for every account correctly. What the earliest record actually marks is
# computed below.
#
# The measurement is careful. It reads the real earliest recorded timestamp, not
# an estimate; it covers every account; it takes the true minimum; and the intent
# is exactly 'when did the account first become active'.
#
# Logging began on the window's first day, and any activity before then was never
# recorded, so a pre-existing account's earliest record is the window start, not
# its real first activity.

500000 => accounts
40000 => truly_first_active_in_month_one
200000 => pre_existing_clamped_to_window_start

truly_first_active_in_month_one + pre_existing_clamped_to_window_start => counted_as_new_by_first_seen
truly_first_active_in_month_one => truly_new_in_month_one
counted_as_new_by_first_seen - truly_new_in_month_one => spurious_new_accounts
int(spurious_new_accounts * 10000 / counted_as_new_by_first_seen) => spurious_share_per_myriad

"accounts                        : " + str(accounts) ^0
"  truly first active in month 1 : " + str(truly_first_active_in_month_one) ^0
"  pre-existing, clamped to day 1 : " + str(pre_existing_clamped_to_window_start) ^0
"" ^0
"counted as new by first-seen    : " + str(counted_as_new_by_first_seen) ^0
"truly new in month 1            : " + str(truly_new_in_month_one) ^0
"spurious new accounts           : " + str(spurious_new_accounts) ^0
"spurious share of the count     : " + str(spurious_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the measurement verified ----

"the acquisition count" ^0
"  reads : the real earliest recorded timestamp" ^0
"  covers : every account" ^0
"  takes : the true minimum of the recorded times" ^0
"  intent : when did the account first become active" ^0
"  accounts omitted : 0" ^0
"  verdict : 240000 ACCOUNTS FIRST SEEN IN MONTH 1" ^0
"" ^0
"  taking the real minimum recorded time over every account" ^0
"  is the part done right here, and it is why a genuinely" ^0
"  new account's first-seen is exact" ^0
"" ^0

# ---- what the earliest record marks ----

"the earliest recorded activity" ^0
"  when logging began : the window's first day" ^0
"  activity before that : happened, but was never recorded" ^0
"  so a pre-existing account's minimum record : is the" ^0
"    window start, not its real first activity" ^0
"  what first-seen therefore marks : the observation" ^0
"    boundary, for anyone older than it" ^0
"  the tell : 200000 accounts share the exact first-day" ^0
"    timestamp" ^0
"" ^0

# ---- what the caller got ----

"the result of the cohort report" ^0
"  accounts it calls new : " + str(counted_as_new_by_first_seen) ^0
"  accounts that are actually new : " + str(truly_new_in_month_one) ^0
"  pre-existing accounts counted as new : " + str(spurious_new_accounts) ^0
"  is the minimum computed wrong : no; it is the true min of" ^0
"    what was recorded" ^0
"  is first-seen the first time : no; the record starts at" ^0
"    the window, and everything earlier is left-censored" ^0
"" ^0

# ---- null control ----

# The same data, with accounts whose first-seen equals the window start treated as
# left-censored (true start unknown), or joined to an out-of-window creation date.
200000 => nc_clamped_accounts_counted_as_new_before
0 => nc_clamped_accounts_counted_as_new_after
40000 => nc_accounts_that_remain_genuinely_new

"null control - treat first-seen on day 1 as censored, not as new" ^0
"  clamped accounts counted as new, before : " + str(nc_clamped_accounts_counted_as_new_before) ^0
"  clamped accounts counted as new, after : " + str(nc_clamped_accounts_counted_as_new_after) ^0
"  accounts that remain genuinely new : " + str(nc_accounts_that_remain_genuinely_new) ^0
"  no account and no timestamp changed; the first-day pile-up" ^0
"  stopped being read as an acquisition date and started" ^0
"  being read as the edge of the record" ^0
"" ^0

# ---- the rule ----

"what an earliest-recorded-activity count guarantees" ^0
"  it is the true minimum of the recorded timestamps :" ^0
"    exactly, real times, every account, honest min" ^0
"  it is when the account first became active : not" ^0
"    addressed; logging began at the window start, so a pre-" ^0
"    existing account's minimum is that boundary - " + str(spurious_new_accounts) + " old" ^0
"    accounts are counted as new" ^0
"" ^0

"the first record is the first time you were watching, not the first time it" ^0
"happened; everything before the window collapses onto the window's edge, and a" ^0
"minimum taken there measures when observation started, not when the thing did" ^0
"" ^0

"It takes the true minimum recorded time over every account - a genuinely new" ^0
"account is dated exactly. But logging began at the window start, so " + str(pre_existing_clamped_to_window_start) ^0
"pre-existing accounts pile onto day 1 and are counted as new; " + str(spurious_share_per_myriad) + " per ten" ^0
"thousand of the acquisition count is left-censoring, until day-1 is read as censored." ^0
```

## Python (deterministic transpilation)

```python
accounts = 500000
truly_first_active_in_month_one = 40000
pre_existing_clamped_to_window_start = 200000
counted_as_new_by_first_seen = truly_first_active_in_month_one + pre_existing_clamped_to_window_start
truly_new_in_month_one = truly_first_active_in_month_one
spurious_new_accounts = counted_as_new_by_first_seen - truly_new_in_month_one
spurious_share_per_myriad = int(spurious_new_accounts * 10000 / counted_as_new_by_first_seen)
print("accounts                        : " + str(accounts))
print("  truly first active in month 1 : " + str(truly_first_active_in_month_one))
print("  pre-existing, clamped to day 1 : " + str(pre_existing_clamped_to_window_start))
print("")
print("counted as new by first-seen    : " + str(counted_as_new_by_first_seen))
print("truly new in month 1            : " + str(truly_new_in_month_one))
print("spurious new accounts           : " + str(spurious_new_accounts))
print("spurious share of the count     : " + str(spurious_share_per_myriad) + " per ten thousand")
print("")
print("the acquisition count")
print("  reads : the real earliest recorded timestamp")
print("  covers : every account")
print("  takes : the true minimum of the recorded times")
print("  intent : when did the account first become active")
print("  accounts omitted : 0")
print("  verdict : 240000 ACCOUNTS FIRST SEEN IN MONTH 1")
print("")
print("  taking the real minimum recorded time over every account")
print("  is the part done right here, and it is why a genuinely")
print("  new account's first-seen is exact")
print("")
print("the earliest recorded activity")
print("  when logging began : the window's first day")
print("  activity before that : happened, but was never recorded")
print("  so a pre-existing account's minimum record : is the")
print("    window start, not its real first activity")
print("  what first-seen therefore marks : the observation")
print("    boundary, for anyone older than it")
print("  the tell : 200000 accounts share the exact first-day")
print("    timestamp")
print("")
print("the result of the cohort report")
print("  accounts it calls new : " + str(counted_as_new_by_first_seen))
print("  accounts that are actually new : " + str(truly_new_in_month_one))
print("  pre-existing accounts counted as new : " + str(spurious_new_accounts))
print("  is the minimum computed wrong : no; it is the true min of")
print("    what was recorded")
print("  is first-seen the first time : no; the record starts at")
print("    the window, and everything earlier is left-censored")
print("")
nc_clamped_accounts_counted_as_new_before = 200000
nc_clamped_accounts_counted_as_new_after = 0
nc_accounts_that_remain_genuinely_new = 40000
print("null control - treat first-seen on day 1 as censored, not as new")
print("  clamped accounts counted as new, before : " + str(nc_clamped_accounts_counted_as_new_before))
print("  clamped accounts counted as new, after : " + str(nc_clamped_accounts_counted_as_new_after))
print("  accounts that remain genuinely new : " + str(nc_accounts_that_remain_genuinely_new))
print("  no account and no timestamp changed; the first-day pile-up")
print("  stopped being read as an acquisition date and started")
print("  being read as the edge of the record")
print("")
print("what an earliest-recorded-activity count guarantees")
print("  it is the true minimum of the recorded timestamps :")
print("    exactly, real times, every account, honest min")
print("  it is when the account first became active : not")
print("    addressed; logging began at the window start, so a pre-")
print("    existing account's minimum is that boundary - " + str(spurious_new_accounts) + " old")
print("    accounts are counted as new")
print("")
print("the first record is the first time you were watching, not the first time it")
print("happened; everything before the window collapses onto the window's edge, and a")
print("minimum taken there measures when observation started, not when the thing did")
print("")
print("It takes the true minimum recorded time over every account - a genuinely new")
print("account is dated exactly. But logging began at the window start, so " + str(pre_existing_clamped_to_window_start))
print("pre-existing accounts pile onto day 1 and are counted as new; " + str(spurious_share_per_myriad) + " per ten")
print("thousand of the acquisition count is left-censoring, until day-1 is read as censored.")
```

## stdout (executed)

```text
accounts                        : 500000
  truly first active in month 1 : 40000
  pre-existing, clamped to day 1 : 200000

counted as new by first-seen    : 240000
truly new in month 1            : 40000
spurious new accounts           : 200000
spurious share of the count     : 8333 per ten thousand

the acquisition count
  reads : the real earliest recorded timestamp
  covers : every account
  takes : the true minimum of the recorded times
  intent : when did the account first become active
  accounts omitted : 0
  verdict : 240000 ACCOUNTS FIRST SEEN IN MONTH 1

  taking the real minimum recorded time over every account
  is the part done right here, and it is why a genuinely
  new account's first-seen is exact

the earliest recorded activity
  when logging began : the window's first day
  activity before that : happened, but was never recorded
  so a pre-existing account's minimum record : is the
    window start, not its real first activity
  what first-seen therefore marks : the observation
    boundary, for anyone older than it
  the tell : 200000 accounts share the exact first-day
    timestamp

the result of the cohort report
  accounts it calls new : 240000
  accounts that are actually new : 40000
  pre-existing accounts counted as new : 200000
  is the minimum computed wrong : no; it is the true min of
    what was recorded
  is first-seen the first time : no; the record starts at
    the window, and everything earlier is left-censored

null control - treat first-seen on day 1 as censored, not as new
  clamped accounts counted as new, before : 200000
  clamped accounts counted as new, after : 0
  accounts that remain genuinely new : 40000
  no account and no timestamp changed; the first-day pile-up
  stopped being read as an acquisition date and started
  being read as the edge of the record

what an earliest-recorded-activity count guarantees
  it is the true minimum of the recorded timestamps :
    exactly, real times, every account, honest min
  it is when the account first became active : not
    addressed; logging began at the window start, so a pre-
    existing account's minimum is that boundary - 200000 old
    accounts are counted as new

the first record is the first time you were watching, not the first time it
happened; everything before the window collapses onto the window's edge, and a
minimum taken there measures when observation started, not when the thing did

It takes the true minimum recorded time over every account - a genuinely new
account is dated exactly. But logging began at the window start, so 200000
pre-existing accounts pile onto day 1 and are counted as new; 8333 per ten
thousand of the acquisition count is left-censoring, until day-1 is read as censored.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
