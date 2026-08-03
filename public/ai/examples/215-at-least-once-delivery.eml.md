<!-- canonical: efficientnewlanguage.org/ai/examples/215-at-least-once-delivery | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 215 — Duplicates are a property of the handler

`at_least_once_delivery.eml` replays a delivery log with known redeliveries through three handlers and compares each against the answer computed from the distinct messages alone.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A queue that
# promises delivery and cannot promise it happened once.
#
# "At least once" is the delivery guarantee almost every queue actually
# provides. It means: if the consumer does not acknowledge, the message comes
# back. It does NOT mean the consumer failed to process it - only that the
# acknowledgement did not arrive, which happens for reasons that have nothing
# to do with whether the work was done:
#
#     process, then crash before acking       redelivered, work repeated
#     process, ack, ack lost in transit       redelivered, work repeated
#
# So a consumer receives duplicates. Whether that matters is entirely a
# property of the HANDLER, and the two obvious handlers differ:
#
#     add the amount        duplicates accumulate; the total is wrong
#     set the balance       duplicates are harmless; the value is the same
#     add with a seen-set   duplicates are detected and skipped
#
# The measurement is a delivery log with a known number of DISTINCT messages
# and a known number of redeliveries, replayed through each handler, compared
# against the answer computed from the distinct messages alone.
#
# The seen-set handler is where the interesting cost shows up. It is correct,
# and it needs storage proportional to the number of messages ever seen, which
# is the part nobody budgets for. The program reports that size alongside the
# correctness, because "correct" without it is only half an answer.

# message id -> amount
[
    ["m1", 100],
    ["m2", 50],
    ["m1", 100],
    ["m3", 25],
    ["m2", 50],
    ["m1", 100],
    ["m4", 200],
    ["m3", 25]
] => deliveries

# The truth, computed from the DISTINCT messages only.
{} => distinct
for d in deliveries:
    d[1] => distinct[d[0]]
0 => truth
for k in distinct:
    truth + distinct[k] => truth

# ------------------------------------------------------------- handler 1
0 => additive
for d in deliveries:
    additive + d[1] => additive

# ------------------------------------------------------------- handler 2
# "Set the balance to this value" - the message carries the resulting state
# rather than a delta, which makes reprocessing a no-op.
{} => absolute
for d in deliveries:
    d[1] => absolute[d[0]]
0 => absolute_total
for k in absolute:
    absolute_total + absolute[k] => absolute_total

# ------------------------------------------------------------- handler 3
{} => seen
0 => deduped
0 => skipped
for d in deliveries:
    if d[0] in seen:
        skipped + 1 => skipped
    else:
        1 => seen[d[0]]
        deduped + d[1] => deduped

"handler          total   correct"^0
("%-16s %-7d %s" % ("additive", additive, str(additive == truth)))^0
("%-16s %-7d %s" % ("absolute", absolute_total, str(absolute_total == truth)))^0
("%-16s %-7d %s" % ("dedup by id", deduped, str(deduped == truth)))^0

""^0
("deliveries received:     " + str(len(deliveries)))^0
("distinct messages:       " + str(len(distinct)))^0
("redeliveries:            " + str(len(deliveries) - len(distinct)))^0
("the correct total:       " + str(truth))^0
("additive overcounted by: " + str(additive - truth))^0

# ------------------------------------------------ the cost of being correct
""^0
("seen-set entries retained: " + str(len(seen)) + " for " + str(len(deliveries)) + " deliveries")^0
("duplicates skipped:        " + str(skipped))^0
"The set grows with every distinct message ever processed and is never"^0
"safe to trim without a rule about how late a redelivery can be."^0

# -------------------------------------- a bounded seen-set is not the same
# The usual mitigation is to keep only the last K ids. It is correct exactly
# when no redelivery arrives more than K messages late, which is an assumption
# about the queue rather than about the handler.
def replay_bounded_real(k):
    # Bounded window with real eviction: the map is rebuilt from the window,
    # which is what a fixed-size cache actually does.
    [] => window
    0 => total
    for d in deliveries:
        0 => found
        for w in window:
            if w == d[0]:
                1 => found
        if found == 0:
            total + d[1] => total
            window + [d[0]] => window
            if len(window) > k:
                window[1:] => window
    return total

""^0
"bounded seen-set, by window size:"^0
for k in [1, 2, 3, 4, 8]:
    replay_bounded_real(k) => t
    ("  window " + str(k) + ": total " + str(t) + "   correct " + str(t == truth))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

checked + 1 => checked
if deduped == truth and absolute_total == truth:
    passed + 1 => passed

# The additive handler must visibly overcount, or nothing is demonstrated.
checked + 1 => checked
if additive > truth:
    passed + 1 => passed

# There must be real redeliveries in the log.
checked + 1 => checked
if len(deliveries) > len(distinct) and skipped == len(deliveries) - len(distinct):
    passed + 1 => passed

# A window large enough to hold every distinct id must be correct, and a
# window of one must not be - that gap is the assumption being bought.
checked + 1 => checked
if replay_bounded_real(len(distinct)) == truth and not (replay_bounded_real(1) == truth):
    passed + 1 => passed

# The absolute handler must be correct WITHOUT any bookkeeping - it carries
# no seen-set at all, which is the reason to prefer it when the message can
# be written that way.
checked + 1 => checked
if absolute_total == truth and len(absolute) == len(distinct):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Duplicates are free for a handler that sets, and cost storage for one that adds." => verdict
else:
    "FAILED - a handler did not behave as the checks describe." => verdict
verdict^0

""^0
"The queue's guarantee cannot be strengthened, so the fix is always on the" => n1
n1^0
"handler side, and there are only two kinds. Make the operation idempotent -" => n2
n2^0
"which usually means sending the resulting STATE rather than a delta - or" => n3
n3^0
"remember what you have seen, which is correct and unbounded. Bounding the" => n4
n4^0
"memory turns correctness back into an assumption about how late a" => n5
n5^0
"redelivery can be." => n6
n6^0
```

## Python (deterministic transpilation)

```python
deliveries = [["m1", 100], ["m2", 50], ["m1", 100], ["m3", 25], ["m2", 50], ["m1", 100], ["m4", 200], ["m3", 25]]
distinct = {}
for d in deliveries:
    distinct[d[0]] = d[1]
truth = 0
for k in distinct:
    truth = truth + distinct[k]
additive = 0
for d in deliveries:
    additive = additive + d[1]
absolute = {}
for d in deliveries:
    absolute[d[0]] = d[1]
absolute_total = 0
for k in absolute:
    absolute_total = absolute_total + absolute[k]
seen = {}
deduped = 0
skipped = 0
for d in deliveries:
    if d[0] in seen:
        skipped = skipped + 1
    else:
        seen[d[0]] = 1
        deduped = deduped + d[1]
print("handler          total   correct")
print("%-16s %-7d %s" % ("additive", additive, str(additive == truth)))
print("%-16s %-7d %s" % ("absolute", absolute_total, str(absolute_total == truth)))
print("%-16s %-7d %s" % ("dedup by id", deduped, str(deduped == truth)))
print("")
print("deliveries received:     " + str(len(deliveries)))
print("distinct messages:       " + str(len(distinct)))
print("redeliveries:            " + str(len(deliveries) - len(distinct)))
print("the correct total:       " + str(truth))
print("additive overcounted by: " + str(additive - truth))
print("")
print("seen-set entries retained: " + str(len(seen)) + " for " + str(len(deliveries)) + " deliveries")
print("duplicates skipped:        " + str(skipped))
print("The set grows with every distinct message ever processed and is never")
print("safe to trim without a rule about how late a redelivery can be.")

def replay_bounded_real(k):
    window = []
    total = 0
    for d in deliveries:
        found = 0
        for w in window:
            if w == d[0]:
                found = 1
        if found == 0:
            total = total + d[1]
            window = window + [d[0]]
            if len(window) > k:
                window = window[1:]
    return total

print("")
print("bounded seen-set, by window size:")
for k in [1, 2, 3, 4, 8]:
    t = replay_bounded_real(k)
    print("  window " + str(k) + ": total " + str(t) + "   correct " + str(t == truth))
passed = 0
checked = 0
checked = checked + 1
if deduped == truth and absolute_total == truth:
    passed = passed + 1
checked = checked + 1
if additive > truth:
    passed = passed + 1
checked = checked + 1
if len(deliveries) > len(distinct) and skipped == len(deliveries) - len(distinct):
    passed = passed + 1
checked = checked + 1
if replay_bounded_real(len(distinct)) == truth and not replay_bounded_real(1) == truth:
    passed = passed + 1
checked = checked + 1
if absolute_total == truth and len(absolute) == len(distinct):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Duplicates are free for a handler that sets, and cost storage for one that adds."
else:
    verdict = "FAILED - a handler did not behave as the checks describe."
print(verdict)
print("")
n1 = "The queue's guarantee cannot be strengthened, so the fix is always on the"
print(n1)
n2 = "handler side, and there are only two kinds. Make the operation idempotent -"
print(n2)
n3 = "which usually means sending the resulting STATE rather than a delta - or"
print(n3)
n4 = "remember what you have seen, which is correct and unbounded. Bounding the"
print(n4)
n5 = "memory turns correctness back into an assumption about how late a"
print(n5)
n6 = "redelivery can be."
print(n6)
```

## stdout (executed)

```text
handler          total   correct
additive         650     False
absolute         375     True
dedup by id      375     True

deliveries received:     8
distinct messages:       4
redeliveries:            4
the correct total:       375
additive overcounted by: 275

seen-set entries retained: 4 for 8 deliveries
duplicates skipped:        4
The set grows with every distinct message ever processed and is never
safe to trim without a rule about how late a redelivery can be.

bounded seen-set, by window size:
  window 1: total 650   correct False
  window 2: total 500   correct False
  window 3: total 375   correct True
  window 4: total 375   correct True
  window 8: total 375   correct True

checks passed: 5/5
Duplicates are free for a handler that sets, and cost storage for one that adds.

The queue's guarantee cannot be strengthened, so the fix is always on the
handler side, and there are only two kinds. Make the operation idempotent -
which usually means sending the resulting STATE rather than a delta - or
remember what you have seen, which is correct and unbounded. Bounding the
memory turns correctness back into an assumption about how late a
redelivery can be.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:def · eml:call · eml:return · eml:run:done
