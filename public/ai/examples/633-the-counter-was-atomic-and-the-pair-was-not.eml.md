<!-- canonical: efficientnewlanguage.org/ai/examples/633-the-counter-was-atomic-and-the-pair-was-not | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 633 — The counter was atomic and the pair was not

`the_counter_was_atomic_and_the_pair_was_not.eml` - Every increment of the seat counter is atomic and no increment has ever been lost. How many seats were sold is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every increment
# of the seat counter is atomic and no increment has ever been lost. How many
# seats were sold is computed below.
#
# The counter is correct. It is a hardware atomic, every increment is a single
# uninterruptible operation, and a stress test running sixteen workers for an
# hour ends with a count exactly equal to the number of increments issued. Not
# one is lost. Reading it is atomic too.
#
# The booking is not one operation. It reads the counter, compares it to the
# limit, and increments — three atomics, and nothing holds between them. Every
# step is indivisible and the sequence is not.
#
# Sixteen workers claim the last seats at once. Each reads a number below the
# limit, each is right about what it read, and each increments.

500 => seat_limit
2400 => claim_attempts
16 => workers
# Measured over the contended window: claims that passed the check and
# incremented.
523 => seats_granted
0 => increments_lost

seats_granted - seat_limit => seats_beyond_the_limit
claim_attempts - seats_granted => claims_correctly_refused

"seat limit               : " + str(seat_limit) ^0
"claim attempts           : " + str(claim_attempts) ^0
"concurrent workers       : " + str(workers) ^0
"seats granted            : " + str(seats_granted) ^0
"granted beyond the limit : " + str(seats_beyond_the_limit) ^0
"claims refused           : " + str(claims_correctly_refused) ^0
"" ^0

# ---- what atomicity verified ----

"the counter under the stress test" ^0
"  increments issued : " + str(claim_attempts) ^0
"  increments lost   : " + str(increments_lost) ^0
"  torn reads        : 0" ^0
"  final value equals the number issued : yes" ^0
"  verdict           : ATOMIC" ^0
"" ^0
"  every claim in this test is true, and the counter would" ^0
"  survive a far harsher one" ^0
"" ^0

# ---- what the booking does ----

"one booking, in operations" ^0
"  1. read the counter    : atomic" ^0
"  2. compare to the limit: on the value read in step 1" ^0
"  3. increment           : atomic" ^0
"  held across 1 to 3     : nothing" ^0
"" ^0
"  the limit is enforced against a value that was true when" ^0
"  it was read and need not be true when step 3 runs" ^0
"" ^0

int(seats_beyond_the_limit * 10000 / seat_limit) => overshoot_per_myriad
"overshoot against the limit : " + str(overshoot_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- why it is bounded by the workers ----

# The overshoot cannot exceed the number of threads that can be between step 1
# and step 3 at once, which is why it looks small and why it is invisible at
# low concurrency and grows with the fleet.
"the size of the window" ^0
"  workers that can sit between read and increment : " + str(workers) ^0
"  overshoot observed                              : " + str(seats_beyond_the_limit) ^0
"  overshoot at one worker                         : 0" ^0
"" ^0
"  the bug is a function of the fleet size, so it arrives" ^0
"  when the service is scaled and not when it is written" ^0
"" ^0

# ---- null control ----

# The same atomic counter, claimed with a compare-and-swap loop so the check and
# the increment are one operation.
seat_limit => nc_seats_granted
0 => nc_seats_beyond_the_limit

"null control - compare-and-swap instead of read then add" ^0
"  increments lost          : " + str(increments_lost) + ", unchanged" ^0
"  seats granted            : " + str(nc_seats_granted) ^0
"  granted beyond the limit : " + str(nc_seats_beyond_the_limit) ^0
"  the counter did not become more atomic; the check and" ^0
"  the increment became one operation instead of two" ^0
"" ^0

# ---- the rule ----

"what an atomic counter guarantees" ^0
"  no increment is lost                 : exactly" ^0
"  a limit tested against it is honoured: not addressed;" ^0
"    atomicity is a property of one operation and a limit" ^0
"    is a relation between two" ^0
"" ^0
"composing atomics does not compose their atomicity; the" ^0
"question is never whether each step is indivisible but" ^0
"whether anything can change between them" ^0
"" ^0

"The counter is atomic and the stress test is right to say so: " + str(claim_attempts) + " increments" ^0
"issued, " + str(increments_lost) + " lost, 0 torn reads, final value exact. " + str(seats_granted) + " seats were granted" ^0
"against a limit of " + str(seat_limit) + " - " + str(seats_beyond_the_limit) + " beyond it, " + str(overshoot_per_myriad) + " per ten thousand - because" ^0
"the read, the comparison and the increment are three atomic operations with" ^0
"nothing held across them, and " + str(workers) + " workers can stand between the first and last." ^0
```

## Python (deterministic transpilation)

```python
seat_limit = 500
claim_attempts = 2400
workers = 16
seats_granted = 523
increments_lost = 0
seats_beyond_the_limit = seats_granted - seat_limit
claims_correctly_refused = claim_attempts - seats_granted
print("seat limit               : " + str(seat_limit))
print("claim attempts           : " + str(claim_attempts))
print("concurrent workers       : " + str(workers))
print("seats granted            : " + str(seats_granted))
print("granted beyond the limit : " + str(seats_beyond_the_limit))
print("claims refused           : " + str(claims_correctly_refused))
print("")
print("the counter under the stress test")
print("  increments issued : " + str(claim_attempts))
print("  increments lost   : " + str(increments_lost))
print("  torn reads        : 0")
print("  final value equals the number issued : yes")
print("  verdict           : ATOMIC")
print("")
print("  every claim in this test is true, and the counter would")
print("  survive a far harsher one")
print("")
print("one booking, in operations")
print("  1. read the counter    : atomic")
print("  2. compare to the limit: on the value read in step 1")
print("  3. increment           : atomic")
print("  held across 1 to 3     : nothing")
print("")
print("  the limit is enforced against a value that was true when")
print("  it was read and need not be true when step 3 runs")
print("")
overshoot_per_myriad = int(seats_beyond_the_limit * 10000 / seat_limit)
print("overshoot against the limit : " + str(overshoot_per_myriad) + " per ten thousand")
print("")
print("the size of the window")
print("  workers that can sit between read and increment : " + str(workers))
print("  overshoot observed                              : " + str(seats_beyond_the_limit))
print("  overshoot at one worker                         : 0")
print("")
print("  the bug is a function of the fleet size, so it arrives")
print("  when the service is scaled and not when it is written")
print("")
nc_seats_granted = seat_limit
nc_seats_beyond_the_limit = 0
print("null control - compare-and-swap instead of read then add")
print("  increments lost          : " + str(increments_lost) + ", unchanged")
print("  seats granted            : " + str(nc_seats_granted))
print("  granted beyond the limit : " + str(nc_seats_beyond_the_limit))
print("  the counter did not become more atomic; the check and")
print("  the increment became one operation instead of two")
print("")
print("what an atomic counter guarantees")
print("  no increment is lost                 : exactly")
print("  a limit tested against it is honoured: not addressed;")
print("    atomicity is a property of one operation and a limit")
print("    is a relation between two")
print("")
print("composing atomics does not compose their atomicity; the")
print("question is never whether each step is indivisible but")
print("whether anything can change between them")
print("")
print("The counter is atomic and the stress test is right to say so: " + str(claim_attempts) + " increments")
print("issued, " + str(increments_lost) + " lost, 0 torn reads, final value exact. " + str(seats_granted) + " seats were granted")
print("against a limit of " + str(seat_limit) + " - " + str(seats_beyond_the_limit) + " beyond it, " + str(overshoot_per_myriad) + " per ten thousand - because")
print("the read, the comparison and the increment are three atomic operations with")
print("nothing held across them, and " + str(workers) + " workers can stand between the first and last.")
```

## stdout (executed)

```text
seat limit               : 500
claim attempts           : 2400
concurrent workers       : 16
seats granted            : 523
granted beyond the limit : 23
claims refused           : 1877

the counter under the stress test
  increments issued : 2400
  increments lost   : 0
  torn reads        : 0
  final value equals the number issued : yes
  verdict           : ATOMIC

  every claim in this test is true, and the counter would
  survive a far harsher one

one booking, in operations
  1. read the counter    : atomic
  2. compare to the limit: on the value read in step 1
  3. increment           : atomic
  held across 1 to 3     : nothing

  the limit is enforced against a value that was true when
  it was read and need not be true when step 3 runs

overshoot against the limit : 460 per ten thousand

the size of the window
  workers that can sit between read and increment : 16
  overshoot observed                              : 23
  overshoot at one worker                         : 0

  the bug is a function of the fleet size, so it arrives
  when the service is scaled and not when it is written

null control - compare-and-swap instead of read then add
  increments lost          : 0, unchanged
  seats granted            : 500
  granted beyond the limit : 0
  the counter did not become more atomic; the check and
  the increment became one operation instead of two

what an atomic counter guarantees
  no increment is lost                 : exactly
  a limit tested against it is honoured: not addressed;
    atomicity is a property of one operation and a limit
    is a relation between two

composing atomics does not compose their atomicity; the
question is never whether each step is indivisible but
whether anything can change between them

The counter is atomic and the stress test is right to say so: 2400 increments
issued, 0 lost, 0 torn reads, final value exact. 523 seats were granted
against a limit of 500 - 23 beyond it, 460 per ten thousand - because
the read, the comparison and the increment are three atomic operations with
nothing held across them, and 16 workers can stand between the first and last.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
