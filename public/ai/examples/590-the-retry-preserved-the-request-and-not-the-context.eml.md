<!-- canonical: efficientnewlanguage.org/ai/examples/590-the-retry-preserved-the-request-and-not-the-context | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 590 — The retry preserved the request and not the context

`the_retry_preserved_the_request_and_not_the_context.eml` - A caller gives the service 5 seconds. The service retries a failing downstream call up to four times. How long the caller waits is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A caller gives the
# service 5 seconds. The service retries a failing downstream call up to four
# times. How long the caller waits is computed below.
#
# Replaying the request body on retry is correct and it is what makes a retry a
# retry. The body is the thing that must not change: a retry that sent different
# bytes would be a different request, and the whole point is to give the same
# operation another chance at a transport that failed for reasons unrelated to
# it. The retry code copies the body exactly, and it is right to.
#
# A deadline is not part of the body. It arrives as a header, it is consumed by
# the client library at the point of the call, and the retry loop sits ABOVE
# that library - so each attempt constructs a fresh call, and a fresh call is
# given the full timeout again.
#
# Every individual attempt is inside its deadline. The caller's deadline is not
# a property of any attempt; it is a property of the whole operation, and no
# layer in this chain is holding it.

5000 => caller_budget_ms
4 => max_attempts

"caller's deadline        : " + str(caller_budget_ms) + " ms" ^0
"attempts the service makes: up to " + str(max_attempts) ^0
"" ^0

# ---- what each attempt sees ----

"attempt   budget it is given   elapsed when it ends   inside its deadline" ^0
0 => elapsed
for a in [1:4]:
    elapsed + caller_budget_ms => elapsed
    "  " + str(a) + "         " + str(caller_budget_ms) + " ms              " + str(elapsed) + " ms              yes" ^0
"" ^0

"  server-side elapsed after " + str(max_attempts) + " attempts : " + str(elapsed) + " ms" ^0
"  caller's budget                     : " + str(caller_budget_ms) + " ms" ^0
"  overrun                             : " + str(int(elapsed / caller_budget_ms)) + " times" ^0
"" ^0
"  and every attempt was inside its own deadline, which is what each one" ^0
"  was checked against" ^0
"" ^0

# ---- what the caller does meanwhile ----
#
# The caller gave up at its own deadline. Everything after that is work with no
# reader, and the retries are the largest part of it.

caller_budget_ms => caller_waits
elapsed - caller_waits => ownerless_ms

"  caller waits           : " + str(caller_waits) + " ms, then gives up" ^0
"  service keeps working  : " + str(ownerless_ms) + " ms more" ^0
"  attempts made after the caller left : " + str(max_attempts - 1) ^0
"  the first attempt is the only one anybody is waiting for" ^0
"" ^0

# ---- what a carried deadline would do ----
#
# Passing the REMAINING budget rather than a fresh one makes each attempt
# smaller, and makes the loop stop when there is no time left to try again.

"if the remaining budget were carried instead" ^0
"attempt   remaining before   given   remaining after" ^0
caller_budget_ms => remaining
0 => attempts_that_fit
for a in [1:4]:
    if remaining > 0:
        attempts_that_fit + 1 => attempts_that_fit
        int(remaining / 2) => this_attempt
        remaining - this_attempt => after
        "  " + str(a) + "         " + str(remaining) + " ms          " + str(this_attempt) + " ms    " + str(after) + " ms" ^0
        after => remaining
    else:
        "  " + str(a) + "         0 ms             not attempted" ^0
"" ^0
"  attempts that fit inside the budget : " + str(attempts_that_fit) ^0
"  total elapsed                       : " + str(caller_budget_ms - remaining) + " ms" ^0
"  overrun                             : 0 ms" ^0
"" ^0

# ---- what else the retry dropped ----
#
# The deadline is the expensive one, but it is not the only thing that lives
# outside the body.

"carried by the retry, or not" ^0
"  request body        carried, byte for byte" ^0
"  idempotency key     carried, it is in the body" ^0
"  remaining deadline  NOT carried, recomputed" ^0
"  trace id            NOT carried, a new span is opened" ^0
"  attempt number      NOT carried, downstream cannot see it is a retry" ^0
"" ^0
"  the three that are lost are the three that describe the operation" ^0
"  rather than the message, and an operation has no representation here" ^0
"" ^0

# ---- what the lost trace id costs ----
#
# Without it, the four attempts appear as four unrelated requests. The
# downstream service's own dashboard shows its load rising and no cause.

"downstream, per caller request" ^0
"  requests it receives      : " + str(max_attempts) ^0
"  requests it can link      : 1, they share no trace" ^0
"  its measured request rate : " + str(max_attempts) + " times the caller's" ^0
"  its measured error rate   : unchanged, each failure is a separate request" ^0
"" ^0

# ---- the control ----
#
# The body. It is carried exactly, it has never been corrupted, and a test that
# compares the retried body against the original passes every time. The part of
# the retry that was tested is the part that works.

"control - is the retried request itself correct" ^0
"  body identical to the original : yes, byte for byte" ^0
"  idempotency key preserved      : yes" ^0
"  method and path preserved      : yes" ^0
"  fields that differ             : 0" ^0
"  the retry is a faithful replay of the message" ^0
"" ^0
"  and a message is not an operation" ^0
"" ^0

# ---- the null control ----
#
# The same retry loop where the downstream call succeeds first time. No second
# attempt, no overrun, and the missing deadline propagation costs nothing. The
# defect is only visible on the path that the retry exists for.

1 => nc_attempts

"null control - the same loop when the first attempt succeeds" ^0
"  attempts        : " + str(nc_attempts) ^0
"  elapsed         : " + str(nc_attempts * caller_budget_ms) + " ms at worst" ^0
"  overrun         : 0" ^0
"  deadline carried: still not, and it does not matter" ^0
"  every test that exercises the happy path is this case" ^0
"" ^0

# ---- the rule ----

"what a retry must carry, and where each thing lives" ^0
"  the message           in the body, and it is carried" ^0
"  the deadline          in a header, consumed one layer down" ^0
"  the trace             in a header, regenerated per call" ^0
"  the attempt count     nowhere, it exists only in the loop variable" ^0
"  a retry loop above the client library cannot see any of the last three" ^0
"" ^0
"the deadline is the one that turns a local decision into a global one:" ^0
"a budget that is not decremented is not a budget" ^0
"" ^0

"Replaying the body byte for byte is what makes a retry a retry, and this one" ^0
"does it exactly. The deadline arrives as a header and is consumed by the layer" ^0
"below the retry loop, so each attempt is handed the full " + str(caller_budget_ms) + " ms again. Four" ^0
"attempts spend " + str(elapsed) + " ms against a " + str(caller_budget_ms) + " ms budget, " + str(max_attempts - 1) + " of them after the caller" ^0
"has gone, and every single attempt was inside the deadline it was checked" ^0
"against." ^0
```

## Python (deterministic transpilation)

```python
caller_budget_ms = 5000
max_attempts = 4
print("caller's deadline        : " + str(caller_budget_ms) + " ms")
print("attempts the service makes: up to " + str(max_attempts))
print("")
print("attempt   budget it is given   elapsed when it ends   inside its deadline")
elapsed = 0
for a in range(1, 5):
    elapsed = elapsed + caller_budget_ms
    print("  " + str(a) + "         " + str(caller_budget_ms) + " ms              " + str(elapsed) + " ms              yes")
print("")
print("  server-side elapsed after " + str(max_attempts) + " attempts : " + str(elapsed) + " ms")
print("  caller's budget                     : " + str(caller_budget_ms) + " ms")
print("  overrun                             : " + str(int(elapsed / caller_budget_ms)) + " times")
print("")
print("  and every attempt was inside its own deadline, which is what each one")
print("  was checked against")
print("")
caller_waits = caller_budget_ms
ownerless_ms = elapsed - caller_waits
print("  caller waits           : " + str(caller_waits) + " ms, then gives up")
print("  service keeps working  : " + str(ownerless_ms) + " ms more")
print("  attempts made after the caller left : " + str(max_attempts - 1))
print("  the first attempt is the only one anybody is waiting for")
print("")
print("if the remaining budget were carried instead")
print("attempt   remaining before   given   remaining after")
remaining = caller_budget_ms
attempts_that_fit = 0
for a in range(1, 5):
    if remaining > 0:
        attempts_that_fit = attempts_that_fit + 1
        this_attempt = int(remaining / 2)
        after = remaining - this_attempt
        print("  " + str(a) + "         " + str(remaining) + " ms          " + str(this_attempt) + " ms    " + str(after) + " ms")
        remaining = after
    else:
        print("  " + str(a) + "         0 ms             not attempted")
print("")
print("  attempts that fit inside the budget : " + str(attempts_that_fit))
print("  total elapsed                       : " + str(caller_budget_ms - remaining) + " ms")
print("  overrun                             : 0 ms")
print("")
print("carried by the retry, or not")
print("  request body        carried, byte for byte")
print("  idempotency key     carried, it is in the body")
print("  remaining deadline  NOT carried, recomputed")
print("  trace id            NOT carried, a new span is opened")
print("  attempt number      NOT carried, downstream cannot see it is a retry")
print("")
print("  the three that are lost are the three that describe the operation")
print("  rather than the message, and an operation has no representation here")
print("")
print("downstream, per caller request")
print("  requests it receives      : " + str(max_attempts))
print("  requests it can link      : 1, they share no trace")
print("  its measured request rate : " + str(max_attempts) + " times the caller's")
print("  its measured error rate   : unchanged, each failure is a separate request")
print("")
print("control - is the retried request itself correct")
print("  body identical to the original : yes, byte for byte")
print("  idempotency key preserved      : yes")
print("  method and path preserved      : yes")
print("  fields that differ             : 0")
print("  the retry is a faithful replay of the message")
print("")
print("  and a message is not an operation")
print("")
nc_attempts = 1
print("null control - the same loop when the first attempt succeeds")
print("  attempts        : " + str(nc_attempts))
print("  elapsed         : " + str(nc_attempts * caller_budget_ms) + " ms at worst")
print("  overrun         : 0")
print("  deadline carried: still not, and it does not matter")
print("  every test that exercises the happy path is this case")
print("")
print("what a retry must carry, and where each thing lives")
print("  the message           in the body, and it is carried")
print("  the deadline          in a header, consumed one layer down")
print("  the trace             in a header, regenerated per call")
print("  the attempt count     nowhere, it exists only in the loop variable")
print("  a retry loop above the client library cannot see any of the last three")
print("")
print("the deadline is the one that turns a local decision into a global one:")
print("a budget that is not decremented is not a budget")
print("")
print("Replaying the body byte for byte is what makes a retry a retry, and this one")
print("does it exactly. The deadline arrives as a header and is consumed by the layer")
print("below the retry loop, so each attempt is handed the full " + str(caller_budget_ms) + " ms again. Four")
print("attempts spend " + str(elapsed) + " ms against a " + str(caller_budget_ms) + " ms budget, " + str(max_attempts - 1) + " of them after the caller")
print("has gone, and every single attempt was inside the deadline it was checked")
print("against.")
```

## stdout (executed)

```text
caller's deadline        : 5000 ms
attempts the service makes: up to 4

attempt   budget it is given   elapsed when it ends   inside its deadline
  1         5000 ms              5000 ms              yes
  2         5000 ms              10000 ms              yes
  3         5000 ms              15000 ms              yes
  4         5000 ms              20000 ms              yes

  server-side elapsed after 4 attempts : 20000 ms
  caller's budget                     : 5000 ms
  overrun                             : 4 times

  and every attempt was inside its own deadline, which is what each one
  was checked against

  caller waits           : 5000 ms, then gives up
  service keeps working  : 15000 ms more
  attempts made after the caller left : 3
  the first attempt is the only one anybody is waiting for

if the remaining budget were carried instead
attempt   remaining before   given   remaining after
  1         5000 ms          2500 ms    2500 ms
  2         2500 ms          1250 ms    1250 ms
  3         1250 ms          625 ms    625 ms
  4         625 ms          312 ms    313 ms

  attempts that fit inside the budget : 4
  total elapsed                       : 4687 ms
  overrun                             : 0 ms

carried by the retry, or not
  request body        carried, byte for byte
  idempotency key     carried, it is in the body
  remaining deadline  NOT carried, recomputed
  trace id            NOT carried, a new span is opened
  attempt number      NOT carried, downstream cannot see it is a retry

  the three that are lost are the three that describe the operation
  rather than the message, and an operation has no representation here

downstream, per caller request
  requests it receives      : 4
  requests it can link      : 1, they share no trace
  its measured request rate : 4 times the caller's
  its measured error rate   : unchanged, each failure is a separate request

control - is the retried request itself correct
  body identical to the original : yes, byte for byte
  idempotency key preserved      : yes
  method and path preserved      : yes
  fields that differ             : 0
  the retry is a faithful replay of the message

  and a message is not an operation

null control - the same loop when the first attempt succeeds
  attempts        : 1
  elapsed         : 5000 ms at worst
  overrun         : 0
  deadline carried: still not, and it does not matter
  every test that exercises the happy path is this case

what a retry must carry, and where each thing lives
  the message           in the body, and it is carried
  the deadline          in a header, consumed one layer down
  the trace             in a header, regenerated per call
  the attempt count     nowhere, it exists only in the loop variable
  a retry loop above the client library cannot see any of the last three

the deadline is the one that turns a local decision into a global one:
a budget that is not decremented is not a budget

Replaying the body byte for byte is what makes a retry a retry, and this one
does it exactly. The deadline arrives as a header and is consumed by the layer
below the retry loop, so each attempt is handed the full 5000 ms again. Four
attempts spend 20000 ms against a 5000 ms budget, 3 of them after the caller
has gone, and every single attempt was inside the deadline it was checked
against.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
