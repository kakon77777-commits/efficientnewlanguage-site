<!-- canonical: efficientnewlanguage.org/ai/examples/290-status-field-conflation | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 290 — Status field conflation — the states that cannot be written down

`status_field_conflation.eml` enumerates an order's real state space as the product of two independent dimensions and marks which points a single status enum can name.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). One status
# column, two independent facts, and the states that cannot be written down.
#
# An order has a payment state and a fulfilment state. They move independently:
# a payment can be refunded after shipping, a shipment can fail after payment,
# an order can be cancelled before either. Modelled as one enum -
#
#     pending  paid  shipped  cancelled  refunded
#
# - the column is being asked to hold a PAIR in a single slot, and it cannot.
# The enum names five points in a nine-point space, so four real situations
# have no value to write, and the code that meets one of them picks whichever
# neighbour is least wrong.
#
# The give-away is not that some transition is missing. It is that the enum's
# values are not comparable: `shipped` and `refunded` are not two points on one
# line, they are answers to different questions, and an order can be both.
#
# The measurement enumerates the real state space as a product of the two
# dimensions, marks which points the enum can name, and reports the ones it
# cannot - then walks a real order history through both models and shows where
# the single column has to lie.

["unpaid", "paid", "refunded"] => PAYMENT
["none", "shipped", "returned"] => FULFILMENT
["pending", "paid", "shipped", "cancelled", "refunded"] => ENUM

def enum_for(pay, ship):
    # The value a single-column model would store for a real (payment,
    # fulfilment) pair. Empty string means: no value expresses this.
    if pay == "unpaid" and ship == "none":
        return "pending"
    if pay == "paid" and ship == "none":
        return "paid"
    if pay == "paid" and ship == "shipped":
        return "shipped"
    if pay == "refunded" and ship == "none":
        return "refunded"
    return ""

def pair_of(status):
    # Reading the single column back out. Which pair does each value claim?
    if status == "pending":
        return ["unpaid", "none"]
    if status == "paid":
        return ["paid", "none"]
    if status == "shipped":
        return ["paid", "shipped"]
    if status == "refunded":
        return ["refunded", "none"]
    return ["unpaid", "none"]


"payment    fulfilment   enum value"^0
0 => total
0 => nameable
[] => orphans
for pay in PAYMENT:
    for ship in FULFILMENT:
        total + 1 => total
        enum_for(pay, ship) => e
        if len(e) > 0:
            nameable + 1 => nameable
        else:
            orphans + [pay + "/" + ship] => orphans
        "-- none --" => shown
        if len(e) > 0:
            e => shown
        ("%-10s %-12s %s" % (pay, ship, shown))^0

""^0
("real states: " + str(len(PAYMENT)) + " payment x " + str(len(FULFILMENT)) + " fulfilment = " + str(total))^0
("enum values available: " + str(len(ENUM)))^0
("real states the enum can name: " + str(nameable) + "/" + str(total))^0
("real states with no value at all: " + str(len(orphans)))^0
for o in orphans:
    ("  " + o)^0

# ------------------------------- one enum value that names nothing real
""^0
0 => unreachable
for e in ENUM:
    0 => reachable
    for pay in PAYMENT:
        for ship in FULFILMENT:
            if enum_for(pay, ship) == e:
                reachable + 1 => reachable
    if reachable == 0:
        unreachable + 1 => unreachable
        ("enum value that no real state maps to: " + e)^0
("enum values with no real state behind them: " + str(unreachable))^0
"...cancelled is a THIRD dimension - whether the order was called off - and"^0
"it was folded into the same column because it also felt like a status."^0

# --------------------------------- an order history the column cannot hold
""^0
"a real order, event by event:"^0
[
    ["order placed", "unpaid", "none"],
    ["payment captured", "paid", "none"],
    ["parcel dispatched", "paid", "shipped"],
    ["customer refunded", "refunded", "shipped"],
    ["parcel returned", "refunded", "returned"]
] => history
0 => lost
for h in history:
    enum_for(h[1], h[2]) => e
    "     <- no value; the column must lie" => note
    if len(e) > 0:
        "" => note
    if len(e) == 0:
        lost + 1 => lost
    "-- none --" => shown
    if len(e) > 0:
        e => shown
    ("  %-20s (%s, %s) -> %s%s" % (h[0], h[1], h[2], shown, note))^0
("steps in this history the single column cannot represent: " + str(lost) + "/" + str(len(history)))^0

# ----------------------------- what the column loses on a round trip
""^0
0 => roundtrip_ok
0 => roundtrip_n
for pay in PAYMENT:
    for ship in FULFILMENT:
        enum_for(pay, ship) => e
        if len(e) > 0:
            roundtrip_n + 1 => roundtrip_n
            pair_of(e) => back
            if back[0] == pay and back[1] == ship:
                roundtrip_ok + 1 => roundtrip_ok
("nameable states that survive a write-then-read: " + str(roundtrip_ok) + "/" + str(roundtrip_n))^0
"...the states it CAN hold, it holds faithfully. The loss is at the states"^0
"it cannot hold, which is where no error is raised either."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The real state space must be larger than the enum. If it were not, the
# single column would be adequate and there would be nothing here.
checked + 1 => checked
if total > len(ENUM):
    passed + 1 => passed

# At least one real state must have no enum value.
checked + 1 => checked
if len(orphans) > 0:
    passed + 1 => passed

# And at least one enum value must correspond to no real state - the two
# failures point in opposite directions and both come from one column.
checked + 1 => checked
if unreachable > 0:
    passed + 1 => passed

# A plausible order history must contain a step the column cannot express.
checked + 1 => checked
if lost > 0:
    passed + 1 => passed

# The states the enum CAN name must round-trip perfectly, so the defect is
# the missing values and not a sloppy encoding of the present ones.
checked + 1 => checked
if roundtrip_ok == roundtrip_n and roundtrip_n > 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Refunded after shipping is an ordinary event with no value to store." => verdict
else:
    "FAILED - the state model did not behave as the checks describe." => verdict
verdict^0

""^0
"The question to ask an enum is not which values are missing - it is how" => n1
n1^0
"many independent facts the column is holding. One slot can hold one, and" => n2
n2^0
"each extra fact multiplies the space it would need. That is why the fix is" => n3
n3^0
"never another enum value: adding one names a single point in a space that" => n4
n4^0
"grew by a factor." => n5
n5^0
```

## Python (deterministic transpilation)

```python
PAYMENT = ["unpaid", "paid", "refunded"]
FULFILMENT = ["none", "shipped", "returned"]
ENUM = ["pending", "paid", "shipped", "cancelled", "refunded"]

def enum_for(pay, ship):
    if pay == "unpaid" and ship == "none":
        return "pending"
    if pay == "paid" and ship == "none":
        return "paid"
    if pay == "paid" and ship == "shipped":
        return "shipped"
    if pay == "refunded" and ship == "none":
        return "refunded"
    return ""

def pair_of(status):
    if status == "pending":
        return ["unpaid", "none"]
    if status == "paid":
        return ["paid", "none"]
    if status == "shipped":
        return ["paid", "shipped"]
    if status == "refunded":
        return ["refunded", "none"]
    return ["unpaid", "none"]

print("payment    fulfilment   enum value")
total = 0
nameable = 0
orphans = []
for pay in PAYMENT:
    for ship in FULFILMENT:
        total = total + 1
        e = enum_for(pay, ship)
        if len(e) > 0:
            nameable = nameable + 1
        else:
            orphans = orphans + [pay + "/" + ship]
        shown = "-- none --"
        if len(e) > 0:
            shown = e
        print("%-10s %-12s %s" % (pay, ship, shown))
print("")
print("real states: " + str(len(PAYMENT)) + " payment x " + str(len(FULFILMENT)) + " fulfilment = " + str(total))
print("enum values available: " + str(len(ENUM)))
print("real states the enum can name: " + str(nameable) + "/" + str(total))
print("real states with no value at all: " + str(len(orphans)))
for o in orphans:
    print("  " + o)
print("")
unreachable = 0
for e in ENUM:
    reachable = 0
    for pay in PAYMENT:
        for ship in FULFILMENT:
            if enum_for(pay, ship) == e:
                reachable = reachable + 1
    if reachable == 0:
        unreachable = unreachable + 1
        print("enum value that no real state maps to: " + e)
print("enum values with no real state behind them: " + str(unreachable))
print("...cancelled is a THIRD dimension - whether the order was called off - and")
print("it was folded into the same column because it also felt like a status.")
print("")
print("a real order, event by event:")
history = [["order placed", "unpaid", "none"], ["payment captured", "paid", "none"], ["parcel dispatched", "paid", "shipped"], ["customer refunded", "refunded", "shipped"], ["parcel returned", "refunded", "returned"]]
lost = 0
for h in history:
    e = enum_for(h[1], h[2])
    note = "     <- no value; the column must lie"
    if len(e) > 0:
        note = ""
    if len(e) == 0:
        lost = lost + 1
    shown = "-- none --"
    if len(e) > 0:
        shown = e
    print("  %-20s (%s, %s) -> %s%s" % (h[0], h[1], h[2], shown, note))
print("steps in this history the single column cannot represent: " + str(lost) + "/" + str(len(history)))
print("")
roundtrip_ok = 0
roundtrip_n = 0
for pay in PAYMENT:
    for ship in FULFILMENT:
        e = enum_for(pay, ship)
        if len(e) > 0:
            roundtrip_n = roundtrip_n + 1
            back = pair_of(e)
            if back[0] == pay and back[1] == ship:
                roundtrip_ok = roundtrip_ok + 1
print("nameable states that survive a write-then-read: " + str(roundtrip_ok) + "/" + str(roundtrip_n))
print("...the states it CAN hold, it holds faithfully. The loss is at the states")
print("it cannot hold, which is where no error is raised either.")
passed = 0
checked = 0
checked = checked + 1
if total > len(ENUM):
    passed = passed + 1
checked = checked + 1
if len(orphans) > 0:
    passed = passed + 1
checked = checked + 1
if unreachable > 0:
    passed = passed + 1
checked = checked + 1
if lost > 0:
    passed = passed + 1
checked = checked + 1
if roundtrip_ok == roundtrip_n and roundtrip_n > 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Refunded after shipping is an ordinary event with no value to store."
else:
    verdict = "FAILED - the state model did not behave as the checks describe."
print(verdict)
print("")
n1 = "The question to ask an enum is not which values are missing - it is how"
print(n1)
n2 = "many independent facts the column is holding. One slot can hold one, and"
print(n2)
n3 = "each extra fact multiplies the space it would need. That is why the fix is"
print(n3)
n4 = "never another enum value: adding one names a single point in a space that"
print(n4)
n5 = "grew by a factor."
print(n5)
```

## stdout (executed)

```text
payment    fulfilment   enum value
unpaid     none         pending
unpaid     shipped      -- none --
unpaid     returned     -- none --
paid       none         paid
paid       shipped      shipped
paid       returned     -- none --
refunded   none         refunded
refunded   shipped      -- none --
refunded   returned     -- none --

real states: 3 payment x 3 fulfilment = 9
enum values available: 5
real states the enum can name: 4/9
real states with no value at all: 5
  unpaid/shipped
  unpaid/returned
  paid/returned
  refunded/shipped
  refunded/returned

enum value that no real state maps to: cancelled
enum values with no real state behind them: 1
...cancelled is a THIRD dimension - whether the order was called off - and
it was folded into the same column because it also felt like a status.

a real order, event by event:
  order placed         (unpaid, none) -> pending
  payment captured     (paid, none) -> paid
  parcel dispatched    (paid, shipped) -> shipped
  customer refunded    (refunded, shipped) -> -- none --     <- no value; the column must lie
  parcel returned      (refunded, returned) -> -- none --     <- no value; the column must lie
steps in this history the single column cannot represent: 2/5

nameable states that survive a write-then-read: 4/4
...the states it CAN hold, it holds faithfully. The loss is at the states
it cannot hold, which is where no error is raised either.

checks passed: 5/5
Refunded after shipping is an ordinary event with no value to store.

The question to ask an enum is not which values are missing - it is how
many independent facts the column is holding. One slot can hold one, and
each extra fact multiplies the space it would need. That is why the fix is
never another enum value: adding one names a single point in a space that
grew by a factor.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
