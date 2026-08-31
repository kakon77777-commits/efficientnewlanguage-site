<!-- canonical: efficientnewlanguage.org/ai/examples/636-the-limit-was-checked-on-entry-and-the-work-grew-after | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 636 — The limit was checked on entry and the work grew after

`the_limit_was_checked_on_entry_and_the_work_grew_after.eml` - The request body limit is enforced on every request and no oversized body has ever got through. What one accepted body costs is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The request body
# limit is enforced on every request and no oversized body has ever got through.
# What one accepted body costs is computed below.
#
# The limit is real and correctly applied. It is checked before the body is
# read into memory, it is checked against the actual byte count rather than a
# declared header, and the rejection is counted. Nothing about its enforcement
# is sloppy, and it has rejected genuine oversized uploads.
#
# What it bounds is the WIRE. The service's cost is not the wire; it is the
# structure the wire expands into, and between those two sits a factor the
# admission check has no view of.
#
# A body under the limit expands four hundred and twelve times. The concurrency
# the limit implies and the concurrency the memory allows differ by more than
# two orders of magnitude.

1048576 => limit_bytes
918000 => accepted_body_bytes
412 => expansion_factor
2147483648 => worker_memory_bytes
0 => oversized_bodies_admitted

accepted_body_bytes * expansion_factor => expanded_bytes
# What the limit implies if you size concurrency on the number it bounds.
int(worker_memory_bytes / accepted_body_bytes) => concurrency_the_limit_implies
# What actually fits.
int(worker_memory_bytes / expanded_bytes) => concurrency_that_fits

"limit, bytes                 : " + str(limit_bytes) ^0
"an accepted body, bytes      : " + str(accepted_body_bytes) ^0
"what it expands to, bytes    : " + str(expanded_bytes) ^0
"" ^0
"worker memory, bytes         : " + str(worker_memory_bytes) ^0
"concurrency the limit implies: " + str(concurrency_the_limit_implies) ^0
"concurrency that fits        : " + str(concurrency_that_fits) ^0
"" ^0

# ---- what the check verified ----

"the admission check" ^0
"  measured             : actual bytes read, not a header" ^0
"  checked before       : the body reaches memory" ^0
"  oversized admitted   : " + str(oversized_bodies_admitted) ^0
"  genuine oversized uploads rejected this month : 1840" ^0
"  verdict              : ENFORCED" ^0
"" ^0
"  the check is not a formality and it is not bypassable;" ^0
"  it does exactly what it says" ^0
"" ^0

# ---- what it did not bound ----

int(accepted_body_bytes * 10000 / limit_bytes) => share_of_limit_used_per_myriad
"the accepted body" ^0
"  share of the limit it used : " + str(share_of_limit_used_per_myriad) + " per ten thousand" ^0
"  under the limit            : yes, comfortably" ^0
"  expansion factor           : " + str(expansion_factor) ^0
"" ^0
"  the factor is a property of the CONTENT - nesting depth" ^0
"  and repeat counts - and the check reads a length" ^0
"" ^0

# ---- the gap ----

int(concurrency_the_limit_implies / concurrency_that_fits) => how_far_out_the_estimate_is

"sizing the fleet on the limit" ^0
"  workers provisioned for     : " + str(concurrency_the_limit_implies) + " concurrent" ^0
"  workers survive             : " + str(concurrency_that_fits) + " concurrent" ^0
"  the estimate is out by      : " + str(how_far_out_the_estimate_is) + " times" ^0
"" ^0
"  every request in the overshoot is individually legal" ^0
"" ^0

# ---- null control ----

# The same limit, applied after expansion instead of before.
int(limit_bytes / expansion_factor) => nc_admissible_body_bytes
0 => nc_workers_lost

"null control - the limit applied to the expanded form" ^0
"  body admissible, bytes : " + str(nc_admissible_body_bytes) ^0
"  workers lost to a legal request : " + str(nc_workers_lost) ^0
"  the limit did not change; the quantity it is measured" ^0
"  against became the one that costs something" ^0
"" ^0

# ---- the rule ----

"what an entry limit guarantees" ^0
"  no request larger than this arrives : exactly" ^0
"  no request costs more than this     : not addressed, for" ^0
"    any input whose processing is not linear in its length" ^0
"" ^0
"a limit binds the quantity it is measured against; put it on" ^0
"the wire and it bounds bandwidth, and the resource that runs" ^0
"out is whichever one the expansion multiplies" ^0
"" ^0

"The limit is enforced on every request and " + str(oversized_bodies_admitted) + " oversized bodies have got" ^0
"through. A body of " + str(accepted_body_bytes) + " bytes - " + str(share_of_limit_used_per_myriad) + " per ten thousand of the limit -" ^0
"expands " + str(expansion_factor) + " times to " + str(expanded_bytes) + " bytes, so a worker sized on the number the" ^0
"limit bounds expects " + str(concurrency_the_limit_implies) + " concurrent requests and survives " + str(concurrency_that_fits) + "," ^0
"an estimate out by " + str(how_far_out_the_estimate_is) + " times made entirely of individually legal requests." ^0
```

## Python (deterministic transpilation)

```python
limit_bytes = 1048576
accepted_body_bytes = 918000
expansion_factor = 412
worker_memory_bytes = 2147483648
oversized_bodies_admitted = 0
expanded_bytes = accepted_body_bytes * expansion_factor
concurrency_the_limit_implies = int(worker_memory_bytes / accepted_body_bytes)
concurrency_that_fits = int(worker_memory_bytes / expanded_bytes)
print("limit, bytes                 : " + str(limit_bytes))
print("an accepted body, bytes      : " + str(accepted_body_bytes))
print("what it expands to, bytes    : " + str(expanded_bytes))
print("")
print("worker memory, bytes         : " + str(worker_memory_bytes))
print("concurrency the limit implies: " + str(concurrency_the_limit_implies))
print("concurrency that fits        : " + str(concurrency_that_fits))
print("")
print("the admission check")
print("  measured             : actual bytes read, not a header")
print("  checked before       : the body reaches memory")
print("  oversized admitted   : " + str(oversized_bodies_admitted))
print("  genuine oversized uploads rejected this month : 1840")
print("  verdict              : ENFORCED")
print("")
print("  the check is not a formality and it is not bypassable;")
print("  it does exactly what it says")
print("")
share_of_limit_used_per_myriad = int(accepted_body_bytes * 10000 / limit_bytes)
print("the accepted body")
print("  share of the limit it used : " + str(share_of_limit_used_per_myriad) + " per ten thousand")
print("  under the limit            : yes, comfortably")
print("  expansion factor           : " + str(expansion_factor))
print("")
print("  the factor is a property of the CONTENT - nesting depth")
print("  and repeat counts - and the check reads a length")
print("")
how_far_out_the_estimate_is = int(concurrency_the_limit_implies / concurrency_that_fits)
print("sizing the fleet on the limit")
print("  workers provisioned for     : " + str(concurrency_the_limit_implies) + " concurrent")
print("  workers survive             : " + str(concurrency_that_fits) + " concurrent")
print("  the estimate is out by      : " + str(how_far_out_the_estimate_is) + " times")
print("")
print("  every request in the overshoot is individually legal")
print("")
nc_admissible_body_bytes = int(limit_bytes / expansion_factor)
nc_workers_lost = 0
print("null control - the limit applied to the expanded form")
print("  body admissible, bytes : " + str(nc_admissible_body_bytes))
print("  workers lost to a legal request : " + str(nc_workers_lost))
print("  the limit did not change; the quantity it is measured")
print("  against became the one that costs something")
print("")
print("what an entry limit guarantees")
print("  no request larger than this arrives : exactly")
print("  no request costs more than this     : not addressed, for")
print("    any input whose processing is not linear in its length")
print("")
print("a limit binds the quantity it is measured against; put it on")
print("the wire and it bounds bandwidth, and the resource that runs")
print("out is whichever one the expansion multiplies")
print("")
print("The limit is enforced on every request and " + str(oversized_bodies_admitted) + " oversized bodies have got")
print("through. A body of " + str(accepted_body_bytes) + " bytes - " + str(share_of_limit_used_per_myriad) + " per ten thousand of the limit -")
print("expands " + str(expansion_factor) + " times to " + str(expanded_bytes) + " bytes, so a worker sized on the number the")
print("limit bounds expects " + str(concurrency_the_limit_implies) + " concurrent requests and survives " + str(concurrency_that_fits) + ",")
print("an estimate out by " + str(how_far_out_the_estimate_is) + " times made entirely of individually legal requests.")
```

## stdout (executed)

```text
limit, bytes                 : 1048576
an accepted body, bytes      : 918000
what it expands to, bytes    : 378216000

worker memory, bytes         : 2147483648
concurrency the limit implies: 2339
concurrency that fits        : 5

the admission check
  measured             : actual bytes read, not a header
  checked before       : the body reaches memory
  oversized admitted   : 0
  genuine oversized uploads rejected this month : 1840
  verdict              : ENFORCED

  the check is not a formality and it is not bypassable;
  it does exactly what it says

the accepted body
  share of the limit it used : 8754 per ten thousand
  under the limit            : yes, comfortably
  expansion factor           : 412

  the factor is a property of the CONTENT - nesting depth
  and repeat counts - and the check reads a length

sizing the fleet on the limit
  workers provisioned for     : 2339 concurrent
  workers survive             : 5 concurrent
  the estimate is out by      : 467 times

  every request in the overshoot is individually legal

null control - the limit applied to the expanded form
  body admissible, bytes : 2545
  workers lost to a legal request : 0
  the limit did not change; the quantity it is measured
  against became the one that costs something

what an entry limit guarantees
  no request larger than this arrives : exactly
  no request costs more than this     : not addressed, for
    any input whose processing is not linear in its length

a limit binds the quantity it is measured against; put it on
the wire and it bounds bandwidth, and the resource that runs
out is whichever one the expansion multiplies

The limit is enforced on every request and 0 oversized bodies have got
through. A body of 918000 bytes - 8754 per ten thousand of the limit -
expands 412 times to 378216000 bytes, so a worker sized on the number the
limit bounds expects 2339 concurrent requests and survives 5,
an estimate out by 467 times made entirely of individually legal requests.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
