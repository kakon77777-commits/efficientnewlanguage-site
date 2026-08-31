<!-- canonical: efficientnewlanguage.org/ai/examples/640-the-replica-was-consistent-and-the-clock-was-ahead | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 640 — The replica was consistent and the clock was ahead

`the_replica_was_consistent_and_the_clock_was_ahead.eml` - The replica has never diverged from the primary by a single row. How many sessions it ends early is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The replica has
# never diverged from the primary by a single row. How many sessions it ends
# early is computed below.
#
# Replication consistency is checked properly here: the replica applies the
# primary's log in order, a nightly job compares every row of every table by
# checksum, and it has reported zero divergence for the life of the cluster.
# There is no stale read, no lost update, no row that says one thing here and
# another there.
#
# Consistency is a statement about the STORED VALUES. Every query that compares
# a stored value to the current time introduces a second operand the replication
# stream never carried, and that one comes from whichever machine is answering.
#
# The replica's clock is three hundred and forty milliseconds ahead. Tokens are
# thirty seconds long. For the last three hundred and forty milliseconds of its
# life, a token is valid on the primary and expired here.

62400000 => validations_per_day
30000 => token_ttl_ms
340 => replica_clock_ahead_ms
0 => rows_diverged

# Arrivals are uniform across the token's life, so the share landing in the
# disputed window is the share of the life the window occupies.
int(validations_per_day * replica_clock_ahead_ms / token_ttl_ms) => rejected_while_still_valid
# Clients that retry land on the primary through the writer endpoint.
604000 => retried_and_succeeded
rejected_while_still_valid - retried_and_succeeded => surfaced_to_a_person

"validations per day             : " + str(validations_per_day) ^0
"token lifetime, ms              : " + str(token_ttl_ms) ^0
"replica clock ahead by, ms      : " + str(replica_clock_ahead_ms) ^0
"rejected while still valid      : " + str(rejected_while_still_valid) ^0
"  recovered by a retry          : " + str(retried_and_succeeded) ^0
"  reached a person              : " + str(surfaced_to_a_person) ^0
"" ^0

# ---- what the consistency check verified ----

"the nightly row comparison" ^0
"  tables compared      : all" ^0
"  rows compared        : all" ^0
"  rows diverged        : " + str(rows_diverged) ^0
"  replication lag, rows: 0" ^0
"  verdict              : CONSISTENT" ^0
"" ^0
"  the check is exhaustive and its answer is correct; the" ^0
"  replica holds exactly the primary's bytes" ^0
"" ^0

# ---- what the query compares ----

"validating a token here" ^0
"  expires_at : replicated, byte-identical to the primary" ^0
"  now()      : read from this machine's clock" ^0
"  the comparison mixes a value the log carried with one" ^0
"  it did not" ^0
"" ^0
"  no amount of replication correctness constrains the" ^0
"  second operand" ^0
"" ^0

int(rejected_while_still_valid * 10000 / validations_per_day) => rejected_per_myriad
"share rejected early : " + str(rejected_per_myriad) + " per ten thousand of validations" ^0
"" ^0

# ---- why it reads as flaky ----

# A retry usually works, because the writer endpoint answers from the primary
# and the primary's clock says the token is alive. The same token, the same
# second, two answers.
"the shape a user sees" ^0
"  first attempt  : rejected, session ended" ^0
"  retry          : accepted, same token, same second" ^0
"  logged as      : transient" ^0
"  reproduced in staging : no, the staging clock agrees" ^0
"" ^0

# ---- null control ----

# The same cluster with the replica's clock disciplined to within two
# milliseconds. The mechanism does not disappear; it shrinks to the accuracy.
2 => nc_clock_ahead_ms
int(validations_per_day * nc_clock_ahead_ms / token_ttl_ms) => nc_rejected_while_still_valid

"null control - the same replica, clock within two ms" ^0
"  rows diverged              : " + str(rows_diverged) + ", unchanged" ^0
"  rejected while still valid : " + str(nc_rejected_while_still_valid) ^0
"  it does not reach zero; the window is the clock error," ^0
"  and disciplining a clock bounds that error rather than" ^0
"  removing it" ^0
"" ^0

# ---- the rule ----

"what a consistent replica guarantees" ^0
"  the values here equal the values there : exactly" ^0
"  a query here answers as it would there : not addressed," ^0
"    for any query whose operands are not all values" ^0
"" ^0
"replication carries data, and a comparison against the" ^0
"current time is not data; the fix is to compare against a" ^0
"time the primary stamped, not to replicate harder" ^0
"" ^0

"The replica is consistent and the nightly comparison is right to say so:" ^0
"every table, every row, " + str(rows_diverged) + " diverged. Its clock is " + str(replica_clock_ahead_ms) + " ms ahead of a" ^0
str(token_ttl_ms) + " ms token, so " + str(rejected_while_still_valid) + " validations a day - " + str(rejected_per_myriad) + " per ten thousand -" ^0
"are rejected while the primary would accept them; " + str(retried_and_succeeded) + " recover on a retry that" ^0
"reaches the primary, and " + str(surfaced_to_a_person) + " end a session that had not expired." ^0
```

## Python (deterministic transpilation)

```python
validations_per_day = 62400000
token_ttl_ms = 30000
replica_clock_ahead_ms = 340
rows_diverged = 0
rejected_while_still_valid = int(validations_per_day * replica_clock_ahead_ms / token_ttl_ms)
retried_and_succeeded = 604000
surfaced_to_a_person = rejected_while_still_valid - retried_and_succeeded
print("validations per day             : " + str(validations_per_day))
print("token lifetime, ms              : " + str(token_ttl_ms))
print("replica clock ahead by, ms      : " + str(replica_clock_ahead_ms))
print("rejected while still valid      : " + str(rejected_while_still_valid))
print("  recovered by a retry          : " + str(retried_and_succeeded))
print("  reached a person              : " + str(surfaced_to_a_person))
print("")
print("the nightly row comparison")
print("  tables compared      : all")
print("  rows compared        : all")
print("  rows diverged        : " + str(rows_diverged))
print("  replication lag, rows: 0")
print("  verdict              : CONSISTENT")
print("")
print("  the check is exhaustive and its answer is correct; the")
print("  replica holds exactly the primary's bytes")
print("")
print("validating a token here")
print("  expires_at : replicated, byte-identical to the primary")
print("  now()      : read from this machine's clock")
print("  the comparison mixes a value the log carried with one")
print("  it did not")
print("")
print("  no amount of replication correctness constrains the")
print("  second operand")
print("")
rejected_per_myriad = int(rejected_while_still_valid * 10000 / validations_per_day)
print("share rejected early : " + str(rejected_per_myriad) + " per ten thousand of validations")
print("")
print("the shape a user sees")
print("  first attempt  : rejected, session ended")
print("  retry          : accepted, same token, same second")
print("  logged as      : transient")
print("  reproduced in staging : no, the staging clock agrees")
print("")
nc_clock_ahead_ms = 2
nc_rejected_while_still_valid = int(validations_per_day * nc_clock_ahead_ms / token_ttl_ms)
print("null control - the same replica, clock within two ms")
print("  rows diverged              : " + str(rows_diverged) + ", unchanged")
print("  rejected while still valid : " + str(nc_rejected_while_still_valid))
print("  it does not reach zero; the window is the clock error,")
print("  and disciplining a clock bounds that error rather than")
print("  removing it")
print("")
print("what a consistent replica guarantees")
print("  the values here equal the values there : exactly")
print("  a query here answers as it would there : not addressed,")
print("    for any query whose operands are not all values")
print("")
print("replication carries data, and a comparison against the")
print("current time is not data; the fix is to compare against a")
print("time the primary stamped, not to replicate harder")
print("")
print("The replica is consistent and the nightly comparison is right to say so:")
print("every table, every row, " + str(rows_diverged) + " diverged. Its clock is " + str(replica_clock_ahead_ms) + " ms ahead of a")
print(str(token_ttl_ms) + " ms token, so " + str(rejected_while_still_valid) + " validations a day - " + str(rejected_per_myriad) + " per ten thousand -")
print("are rejected while the primary would accept them; " + str(retried_and_succeeded) + " recover on a retry that")
print("reaches the primary, and " + str(surfaced_to_a_person) + " end a session that had not expired.")
```

## stdout (executed)

```text
validations per day             : 62400000
token lifetime, ms              : 30000
replica clock ahead by, ms      : 340
rejected while still valid      : 707200
  recovered by a retry          : 604000
  reached a person              : 103200

the nightly row comparison
  tables compared      : all
  rows compared        : all
  rows diverged        : 0
  replication lag, rows: 0
  verdict              : CONSISTENT

  the check is exhaustive and its answer is correct; the
  replica holds exactly the primary's bytes

validating a token here
  expires_at : replicated, byte-identical to the primary
  now()      : read from this machine's clock
  the comparison mixes a value the log carried with one
  it did not

  no amount of replication correctness constrains the
  second operand

share rejected early : 113 per ten thousand of validations

the shape a user sees
  first attempt  : rejected, session ended
  retry          : accepted, same token, same second
  logged as      : transient
  reproduced in staging : no, the staging clock agrees

null control - the same replica, clock within two ms
  rows diverged              : 0, unchanged
  rejected while still valid : 4160
  it does not reach zero; the window is the clock error,
  and disciplining a clock bounds that error rather than
  removing it

what a consistent replica guarantees
  the values here equal the values there : exactly
  a query here answers as it would there : not addressed,
    for any query whose operands are not all values

replication carries data, and a comparison against the
current time is not data; the fix is to compare against a
time the primary stamped, not to replicate harder

The replica is consistent and the nightly comparison is right to say so:
every table, every row, 0 diverged. Its clock is 340 ms ahead of a
30000 ms token, so 707200 validations a day - 113 per ten thousand -
are rejected while the primary would accept them; 604000 recover on a retry that
reaches the primary, and 103200 end a session that had not expired.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
