<!-- canonical: efficientnewlanguage.org/ai/examples/808-the-balance-was-non-negative-at-every-commit | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 808 — The balance was non negative at every commit

`the_balance_was_non_negative_at_every_commit.eml` - Every committed transaction left the account non-negative, and each check is real. What two concurrent withdrawals each validated against is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every committed
# transaction left the account non-negative, and each check is real. What two
# concurrent withdrawals each validated against is computed below.
#
# The invariant is enforced properly per transaction. Each withdrawal reads the
# balance, refuses if the debit would take it below zero, and only then commits;
# the check and the debit are in one transaction; and every committed state on
# record is non-negative.
#
# Two withdrawals ran concurrently, and each read the balance before either
# committed.

100 => starting_balance
80 => withdrawal_one
80 => withdrawal_two
100 => balance_each_withdrawal_read
0 => committed_states_that_were_negative

balance_each_withdrawal_read - withdrawal_one => balance_one_validated_against
balance_each_withdrawal_read - withdrawal_two => balance_two_validated_against
starting_balance - withdrawal_one - withdrawal_two => final_balance
0 - final_balance => the_overdraft

"starting balance                : " + str(starting_balance) ^0
"withdrawal one                  : " + str(withdrawal_one) ^0
"withdrawal two                  : " + str(withdrawal_two) ^0
"balance each withdrawal read    : " + str(balance_each_withdrawal_read) ^0
"" ^0
"one validated against           : " + str(balance_one_validated_against) + " remaining, allowed" ^0
"two validated against           : " + str(balance_two_validated_against) + " remaining, allowed" ^0
"committed states that were negative : " + str(committed_states_that_were_negative) ^0
"final balance                   : " + str(final_balance) ^0
"the overdraft                   : " + str(the_overdraft) ^0
"" ^0

# ---- what each transaction verified ----

"the non-negative check" ^0
"  each withdrawal : reads the balance first" ^0
"  refuses if : the debit would go below zero" ^0
"  check and debit : in one transaction" ^0
"  committed states on record : all non-negative" ^0
"  transactions that each passed the check : both" ^0
"  verdict : NEVER NEGATIVE, PER COMMIT" ^0
"" ^0
"  putting the check and the debit in one transaction is" ^0
"  the part done right here, and it is why no single" ^0
"  transaction leaves a bad state" ^0
"" ^0

# ---- what the two read ----

"the two concurrent withdrawals" ^0
"  what one read : " + str(balance_each_withdrawal_read) + ", enough for " + str(withdrawal_one) ^0
"  what two read : " + str(balance_each_withdrawal_read) + ", enough for " + str(withdrawal_two) ^0
"  when they read it : before either had committed" ^0
"  so each validated against : a balance the other was" ^0
"    about to spend" ^0
"  the check each passed : true of the state it saw," ^0
"    false of the state it made" ^0
"" ^0

# ---- what the account ends at ----

"the account after both commit" ^0
"  what each commit left, in isolation : non-negative" ^0
"  what the two together left : " + str(final_balance) ^0
"  the overdraft : " + str(the_overdraft) ^0
"  did any transaction break its own check : no" ^0
"  what was violated : a property of the pair, which" ^0
"    neither transaction was checking" ^0
"" ^0

# ---- null control ----

# The same two withdrawals, serialized by a lock on the balance so the second
# reads what the first committed.
0 => nc_overdraft_when_serialized
60 => nc_overdraft_when_concurrent
1 => nc_withdrawals_the_second_check_would_refuse

"null control - serialize on the balance" ^0
"  overdraft when serialized : " + str(nc_overdraft_when_serialized) ^0
"  overdraft when concurrent : " + str(nc_overdraft_when_concurrent) ^0
"  withdrawals the second check would now refuse : " ^0
"    " + str(nc_withdrawals_the_second_check_would_refuse) ^0
"  no amount and no check changed; the second read stopped" ^0
"  seeing a balance the first was about to spend" ^0
"" ^0

# ---- the rule ----

"what a per-commit non-negative invariant guarantees" ^0
"  every committed state is non-negative : exactly, check" ^0
"    and debit in one transaction, all commits clean" ^0
"  the balance never goes negative : not addressed; each" ^0
"    withdrawal validated against the balance it read, and" ^0
"    two interleaved reads both saw " + str(balance_each_withdrawal_read) + ", so both committed" ^0
"    and left " + str(final_balance) ^0
"" ^0

"an invariant checked per transaction holds for each transaction against the" ^0
"state it saw; concurrency means the state it saw is not the state it commits" ^0
"into, and the property of the sequence is not the property of any step" ^0
"" ^0

"Each withdrawal checks and debits in one transaction and every committed state" ^0
"is non-negative - no step breaks the rule. Two ran concurrently and both read " ^0
"" + str(balance_each_withdrawal_read) + " before either committed, so both were allowed and the account ended at " ^0
"" + str(final_balance) + ", an overdraft of " + str(the_overdraft) + " no single commit created." ^0
```

## Python (deterministic transpilation)

```python
starting_balance = 100
withdrawal_one = 80
withdrawal_two = 80
balance_each_withdrawal_read = 100
committed_states_that_were_negative = 0
balance_one_validated_against = balance_each_withdrawal_read - withdrawal_one
balance_two_validated_against = balance_each_withdrawal_read - withdrawal_two
final_balance = starting_balance - withdrawal_one - withdrawal_two
the_overdraft = 0 - final_balance
print("starting balance                : " + str(starting_balance))
print("withdrawal one                  : " + str(withdrawal_one))
print("withdrawal two                  : " + str(withdrawal_two))
print("balance each withdrawal read    : " + str(balance_each_withdrawal_read))
print("")
print("one validated against           : " + str(balance_one_validated_against) + " remaining, allowed")
print("two validated against           : " + str(balance_two_validated_against) + " remaining, allowed")
print("committed states that were negative : " + str(committed_states_that_were_negative))
print("final balance                   : " + str(final_balance))
print("the overdraft                   : " + str(the_overdraft))
print("")
print("the non-negative check")
print("  each withdrawal : reads the balance first")
print("  refuses if : the debit would go below zero")
print("  check and debit : in one transaction")
print("  committed states on record : all non-negative")
print("  transactions that each passed the check : both")
print("  verdict : NEVER NEGATIVE, PER COMMIT")
print("")
print("  putting the check and the debit in one transaction is")
print("  the part done right here, and it is why no single")
print("  transaction leaves a bad state")
print("")
print("the two concurrent withdrawals")
print("  what one read : " + str(balance_each_withdrawal_read) + ", enough for " + str(withdrawal_one))
print("  what two read : " + str(balance_each_withdrawal_read) + ", enough for " + str(withdrawal_two))
print("  when they read it : before either had committed")
print("  so each validated against : a balance the other was")
print("    about to spend")
print("  the check each passed : true of the state it saw,")
print("    false of the state it made")
print("")
print("the account after both commit")
print("  what each commit left, in isolation : non-negative")
print("  what the two together left : " + str(final_balance))
print("  the overdraft : " + str(the_overdraft))
print("  did any transaction break its own check : no")
print("  what was violated : a property of the pair, which")
print("    neither transaction was checking")
print("")
nc_overdraft_when_serialized = 0
nc_overdraft_when_concurrent = 60
nc_withdrawals_the_second_check_would_refuse = 1
print("null control - serialize on the balance")
print("  overdraft when serialized : " + str(nc_overdraft_when_serialized))
print("  overdraft when concurrent : " + str(nc_overdraft_when_concurrent))
print("  withdrawals the second check would now refuse : ")
print("    " + str(nc_withdrawals_the_second_check_would_refuse))
print("  no amount and no check changed; the second read stopped")
print("  seeing a balance the first was about to spend")
print("")
print("what a per-commit non-negative invariant guarantees")
print("  every committed state is non-negative : exactly, check")
print("    and debit in one transaction, all commits clean")
print("  the balance never goes negative : not addressed; each")
print("    withdrawal validated against the balance it read, and")
print("    two interleaved reads both saw " + str(balance_each_withdrawal_read) + ", so both committed")
print("    and left " + str(final_balance))
print("")
print("an invariant checked per transaction holds for each transaction against the")
print("state it saw; concurrency means the state it saw is not the state it commits")
print("into, and the property of the sequence is not the property of any step")
print("")
print("Each withdrawal checks and debits in one transaction and every committed state")
print("is non-negative - no step breaks the rule. Two ran concurrently and both read ")
print("" + str(balance_each_withdrawal_read) + " before either committed, so both were allowed and the account ended at ")
print("" + str(final_balance) + ", an overdraft of " + str(the_overdraft) + " no single commit created.")
```

## stdout (executed)

```text
starting balance                : 100
withdrawal one                  : 80
withdrawal two                  : 80
balance each withdrawal read    : 100

one validated against           : 20 remaining, allowed
two validated against           : 20 remaining, allowed
committed states that were negative : 0
final balance                   : -60
the overdraft                   : 60

the non-negative check
  each withdrawal : reads the balance first
  refuses if : the debit would go below zero
  check and debit : in one transaction
  committed states on record : all non-negative
  transactions that each passed the check : both
  verdict : NEVER NEGATIVE, PER COMMIT

  putting the check and the debit in one transaction is
  the part done right here, and it is why no single
  transaction leaves a bad state

the two concurrent withdrawals
  what one read : 100, enough for 80
  what two read : 100, enough for 80
  when they read it : before either had committed
  so each validated against : a balance the other was
    about to spend
  the check each passed : true of the state it saw,
    false of the state it made

the account after both commit
  what each commit left, in isolation : non-negative
  what the two together left : -60
  the overdraft : 60
  did any transaction break its own check : no
  what was violated : a property of the pair, which
    neither transaction was checking

null control - serialize on the balance
  overdraft when serialized : 0
  overdraft when concurrent : 60
  withdrawals the second check would now refuse : 
    1
  no amount and no check changed; the second read stopped
  seeing a balance the first was about to spend

what a per-commit non-negative invariant guarantees
  every committed state is non-negative : exactly, check
    and debit in one transaction, all commits clean
  the balance never goes negative : not addressed; each
    withdrawal validated against the balance it read, and
    two interleaved reads both saw 100, so both committed
    and left -60

an invariant checked per transaction holds for each transaction against the
state it saw; concurrency means the state it saw is not the state it commits
into, and the property of the sequence is not the property of any step

Each withdrawal checks and debits in one transaction and every committed state
is non-negative - no step breaks the rule. Two ran concurrently and both read 
100 before either committed, so both were allowed and the account ended at 
-60, an overdraft of 60 no single commit created.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
