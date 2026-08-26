<!-- canonical: efficientnewlanguage.org/ai/examples/558-the-error-rate-fell-because-the-errors-moved | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 558 — The error rate fell because the errors moved

`the_error_rate_fell_because_the_errors_moved.eml` - Service A's error rate went from 3 percent to 0.2 percent after one change. Where the errors went is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Service A's error
# rate went from 3 percent to 0.2 percent after one change. Where the errors
# went is computed below.
#
# The change was right and was argued for well. Service A was rejecting records
# on rules it had no business owning: it knew the wire format but not the
# domain, so it was guessing at what "valid" meant and getting it wrong in both
# directions. Records that were fine were being bounced because A's copy of the
# rules was six months behind B's, and support was fielding those. Moving
# validation to B, which owns the rules, removed a duplicate implementation and
# put the decision where the knowledge is. This is textbook, and it is correct.
#
# A rejected record and a failed record are both one bad record. What separates
# them is where in the pipeline the badness is discovered, and therefore how
# much work has already been done that must now be undone. A rejects before
# anything is written. B fails after a partial write, which means a rollback, an
# orphaned row somewhere, and a support ticket.
#
# The error rate on A's dashboard measures A. The change moved the errors out of
# A. The dashboard did exactly what it was built to do.

10000 => records
300 => bad_records

# after the change, A still rejects the genuinely malformed - it owns the wire
# format - and passes everything else through
20 => still_rejected_by_a

bad_records - still_rejected_by_a => passed_to_b

"records per batch : " + str(records) ^0
"bad records       : " + str(bad_records) ^0
"" ^0

# ---- before ----

"before the change" ^0
"  A rejects            : " + str(bad_records) ^0
"  A error rate         : " + str(int(bad_records * 1000 / records)) + " per mille" ^0
"  B receives           : " + str(records - bad_records) ^0
"  B errors             : 0" ^0
"  B error rate         : 0 per mille" ^0
"" ^0

# ---- after ----

records - still_rejected_by_a => b_receives

"after the change" ^0
"  A rejects            : " + str(still_rejected_by_a) ^0
"  A error rate         : " + str(int(still_rejected_by_a * 1000 / records)) + " per mille" ^0
"  B receives           : " + str(b_receives) ^0
"  B errors             : " + str(passed_to_b) ^0
"  B error rate         : " + str(int(passed_to_b * 1000 / b_receives)) + " per mille" ^0
"" ^0

"  A improved from " + str(int(bad_records * 1000 / records)) + " to " + str(int(still_rejected_by_a * 1000 / records)) + " per mille, a factor of " + str(int(bad_records / still_rejected_by_a)) ^0
"  the dashboard tracked A" ^0
"" ^0

# ---- the conserved quantity ----

still_rejected_by_a + passed_to_b => total_after

"bad records before : " + str(bad_records) ^0
"bad records after  : " + str(total_after) ^0
"difference         : " + str(total_after - bad_records) ^0
"nothing was fixed, and nothing was broken; the same records are still bad" ^0
"" ^0

# ---- what changed is where they are found ----
#
# Cost per bad record, in units of support-minutes. A rejection at the edge is
# a 400 response. A failure inside B is a partial write: rollback, an orphaned
# row, a ticket, and a human reading a log.

1 => cost_at_a
12 => cost_at_b

bad_records * cost_at_a => cost_before
(still_rejected_by_a * cost_at_a) + (passed_to_b * cost_at_b) => cost_after

"cost of a bad record" ^0
"  caught at A : " + str(cost_at_a) + " unit  - a 400 response, nothing written" ^0
"  caught at B : " + str(cost_at_b) + " units - partial write, rollback, orphan row, ticket" ^0
"" ^0
"  total cost before : " + str(cost_before) + " units" ^0
"  total cost after  : " + str(cost_after) + " units" ^0
"  change            : " + str(int(cost_after * 100 / cost_before)) + " hundredths of what it was" ^0
"" ^0
"  the tracked error rate fell " + str(int(bad_records * 100 / still_rejected_by_a)) + " hundredths" ^0
"  the total cost rose " + str(int(cost_after * 100 / cost_before)) + " hundredths" ^0
"  both numbers describe the same change and neither is wrong" ^0
"" ^0

# ---- why moving a check downstream costs more ----
#
# Work done before a failure is work that must be undone. The further down the
# pipeline a check sits, the more has been done.

"stage at which a bad record is caught, and what is already done" ^0
"  at the edge        nothing written                    " + str(cost_at_a) + " unit" ^0
"  after parse        buffer allocated                   2 units" ^0
"  after enrichment   two upstream calls made            5 units" ^0
"  inside the write   partial row, rollback, orphan     " + str(cost_at_b) + " units" ^0
"  the rules did belong to B; the check did not have to run where they live" ^0
"" ^0

# ---- the control ----
#
# If the change had genuinely improved data quality, the count of bad records
# would have fallen. It is identical, because a validation rule does not make
# records good - it decides where they stop.

"control - a count no relocation can move" ^0
bad_records => before_count
total_after => after_count
"  bad records, before : " + str(before_count) ^0
"  bad records, after  : " + str(after_count) ^0
"  difference          : " + str(after_count - before_count) ^0
"  this is the number that would move if quality had changed" ^0
"  it did not move, so quality did not change" ^0
"" ^0

# ---- the null control ----
#
# The same relocation, to a stage that costs the SAME as the edge. The tracked
# rate on A falls by exactly as much, and total cost does not move at all. So
# the defect is not "the check moved" - it is "the check moved to a more
# expensive place, and only the cheap place was instrumented".

1 => cost_at_cheap_b
(still_rejected_by_a * cost_at_a) + (passed_to_b * cost_at_cheap_b) => cost_cheap

"null control - the same move, to a stage that costs the same as the edge" ^0
"  A error rate after  : " + str(int(still_rejected_by_a * 1000 / records)) + " per mille, identical to the real case" ^0
"  total cost before   : " + str(cost_before) + " units" ^0
"  total cost after    : " + str(cost_cheap) + " units" ^0
"  difference          : " + str(cost_cheap - cost_before) + " units" ^0
"  the same dashboard improvement, and this time it is free" ^0
"  so the dashboard cannot tell these two cases apart, and they are not the same" ^0
"" ^0

# ---- the rule ----

"what a per-service error rate can and cannot see" ^0
"  errors inside the service        yes" ^0
"  errors this service caused elsewhere   no" ^0
"  errors this service stopped catching   no, they leave the numerator" ^0
"  total errors in the pipeline     no, there is no such dashboard" ^0
"  every service can improve its own rate by declining to look" ^0
"" ^0

"Moving validation to the service that owns the rules removed a duplicate" ^0
"implementation and stopped bouncing good records against a six-month-old copy" ^0
"of the rules. It was the right change. " + str(bad_records) + " records were bad before and" ^0
str(total_after) + " are bad after. A's error rate fell from " + str(int(bad_records * 1000 / records)) + " to " + str(int(still_rejected_by_a * 1000 / records)) + " per mille and the cost of" ^0
"handling those records went from " + str(cost_before) + " to " + str(cost_after) + " units." ^0
```

## Python (deterministic transpilation)

```python
records = 10000
bad_records = 300
still_rejected_by_a = 20
passed_to_b = bad_records - still_rejected_by_a
print("records per batch : " + str(records))
print("bad records       : " + str(bad_records))
print("")
print("before the change")
print("  A rejects            : " + str(bad_records))
print("  A error rate         : " + str(int(bad_records * 1000 / records)) + " per mille")
print("  B receives           : " + str(records - bad_records))
print("  B errors             : 0")
print("  B error rate         : 0 per mille")
print("")
b_receives = records - still_rejected_by_a
print("after the change")
print("  A rejects            : " + str(still_rejected_by_a))
print("  A error rate         : " + str(int(still_rejected_by_a * 1000 / records)) + " per mille")
print("  B receives           : " + str(b_receives))
print("  B errors             : " + str(passed_to_b))
print("  B error rate         : " + str(int(passed_to_b * 1000 / b_receives)) + " per mille")
print("")
print("  A improved from " + str(int(bad_records * 1000 / records)) + " to " + str(int(still_rejected_by_a * 1000 / records)) + " per mille, a factor of " + str(int(bad_records / still_rejected_by_a)))
print("  the dashboard tracked A")
print("")
total_after = still_rejected_by_a + passed_to_b
print("bad records before : " + str(bad_records))
print("bad records after  : " + str(total_after))
print("difference         : " + str(total_after - bad_records))
print("nothing was fixed, and nothing was broken; the same records are still bad")
print("")
cost_at_a = 1
cost_at_b = 12
cost_before = bad_records * cost_at_a
cost_after = still_rejected_by_a * cost_at_a + passed_to_b * cost_at_b
print("cost of a bad record")
print("  caught at A : " + str(cost_at_a) + " unit  - a 400 response, nothing written")
print("  caught at B : " + str(cost_at_b) + " units - partial write, rollback, orphan row, ticket")
print("")
print("  total cost before : " + str(cost_before) + " units")
print("  total cost after  : " + str(cost_after) + " units")
print("  change            : " + str(int(cost_after * 100 / cost_before)) + " hundredths of what it was")
print("")
print("  the tracked error rate fell " + str(int(bad_records * 100 / still_rejected_by_a)) + " hundredths")
print("  the total cost rose " + str(int(cost_after * 100 / cost_before)) + " hundredths")
print("  both numbers describe the same change and neither is wrong")
print("")
print("stage at which a bad record is caught, and what is already done")
print("  at the edge        nothing written                    " + str(cost_at_a) + " unit")
print("  after parse        buffer allocated                   2 units")
print("  after enrichment   two upstream calls made            5 units")
print("  inside the write   partial row, rollback, orphan     " + str(cost_at_b) + " units")
print("  the rules did belong to B; the check did not have to run where they live")
print("")
print("control - a count no relocation can move")
before_count = bad_records
after_count = total_after
print("  bad records, before : " + str(before_count))
print("  bad records, after  : " + str(after_count))
print("  difference          : " + str(after_count - before_count))
print("  this is the number that would move if quality had changed")
print("  it did not move, so quality did not change")
print("")
cost_at_cheap_b = 1
cost_cheap = still_rejected_by_a * cost_at_a + passed_to_b * cost_at_cheap_b
print("null control - the same move, to a stage that costs the same as the edge")
print("  A error rate after  : " + str(int(still_rejected_by_a * 1000 / records)) + " per mille, identical to the real case")
print("  total cost before   : " + str(cost_before) + " units")
print("  total cost after    : " + str(cost_cheap) + " units")
print("  difference          : " + str(cost_cheap - cost_before) + " units")
print("  the same dashboard improvement, and this time it is free")
print("  so the dashboard cannot tell these two cases apart, and they are not the same")
print("")
print("what a per-service error rate can and cannot see")
print("  errors inside the service        yes")
print("  errors this service caused elsewhere   no")
print("  errors this service stopped catching   no, they leave the numerator")
print("  total errors in the pipeline     no, there is no such dashboard")
print("  every service can improve its own rate by declining to look")
print("")
print("Moving validation to the service that owns the rules removed a duplicate")
print("implementation and stopped bouncing good records against a six-month-old copy")
print("of the rules. It was the right change. " + str(bad_records) + " records were bad before and")
print(str(total_after) + " are bad after. A's error rate fell from " + str(int(bad_records * 1000 / records)) + " to " + str(int(still_rejected_by_a * 1000 / records)) + " per mille and the cost of")
print("handling those records went from " + str(cost_before) + " to " + str(cost_after) + " units.")
```

## stdout (executed)

```text
records per batch : 10000
bad records       : 300

before the change
  A rejects            : 300
  A error rate         : 30 per mille
  B receives           : 9700
  B errors             : 0
  B error rate         : 0 per mille

after the change
  A rejects            : 20
  A error rate         : 2 per mille
  B receives           : 9980
  B errors             : 280
  B error rate         : 28 per mille

  A improved from 30 to 2 per mille, a factor of 15
  the dashboard tracked A

bad records before : 300
bad records after  : 300
difference         : 0
nothing was fixed, and nothing was broken; the same records are still bad

cost of a bad record
  caught at A : 1 unit  - a 400 response, nothing written
  caught at B : 12 units - partial write, rollback, orphan row, ticket

  total cost before : 300 units
  total cost after  : 3380 units
  change            : 1126 hundredths of what it was

  the tracked error rate fell 1500 hundredths
  the total cost rose 1126 hundredths
  both numbers describe the same change and neither is wrong

stage at which a bad record is caught, and what is already done
  at the edge        nothing written                    1 unit
  after parse        buffer allocated                   2 units
  after enrichment   two upstream calls made            5 units
  inside the write   partial row, rollback, orphan     12 units
  the rules did belong to B; the check did not have to run where they live

control - a count no relocation can move
  bad records, before : 300
  bad records, after  : 300
  difference          : 0
  this is the number that would move if quality had changed
  it did not move, so quality did not change

null control - the same move, to a stage that costs the same as the edge
  A error rate after  : 2 per mille, identical to the real case
  total cost before   : 300 units
  total cost after    : 300 units
  difference          : 0 units
  the same dashboard improvement, and this time it is free
  so the dashboard cannot tell these two cases apart, and they are not the same

what a per-service error rate can and cannot see
  errors inside the service        yes
  errors this service caused elsewhere   no
  errors this service stopped catching   no, they leave the numerator
  total errors in the pipeline     no, there is no such dashboard
  every service can improve its own rate by declining to look

Moving validation to the service that owns the rules removed a duplicate
implementation and stopped bouncing good records against a six-month-old copy
of the rules. It was the right change. 300 records were bad before and
300 are bad after. A's error rate fell from 30 to 2 per mille and the cost of
handling those records went from 300 to 3380 units.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
