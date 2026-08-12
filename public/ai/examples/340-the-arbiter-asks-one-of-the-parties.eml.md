<!-- canonical: efficientnewlanguage.org/ai/examples/340-the-arbiter-asks-one-of-the-parties | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 340 — The arbiter asks one of the parties — A wins 4 of 4, and is right once

`the_arbiter_asks_one_of_the_parties.eml` resolves disputes between two services three ways and grades each against the event log.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two services
# disagree about an order's status, and the tie-breaker calls one of them.
#
# The resolver does not know it is doing this. It calls the status endpoint,
# which is the documented source of truth, and the status endpoint is served by
# service A. From the resolver's side that is a neutral third source; from the
# outside it is asking one party to adjudicate its own dispute.
#
# The metric this produces is the part that keeps the design alive: A wins
# every dispute, which reads as A being the more reliable service, which is the
# reason given for continuing to treat A as authoritative.
#
# The event log is the actual independent record. The program grades all three
# against it. Nothing is declared - each order's true status is derived by
# replaying its events.

def replay(events):
    "new" => status
    for e in events:
        if e == "pay":
            "paid" => status
        if e == "ship":
            "shipped" => status
        if e == "cancel":
            "cancelled" => status
    return status

def service_a(order):
    # A misses cancellations that arrive after shipping
    "new" => status
    for e in order[1]:
        if e == "pay":
            "paid" => status
        if e == "ship":
            "shipped" => status
        if e == "cancel":
            if status != "shipped":
                "cancelled" => status
    return status

def service_b(order):
    # B misses payments that arrive in the same batch as a shipment
    "new" => status
    0 => shipped_seen
    for e in order[1]:
        if e == "ship":
            1 => shipped_seen
        if e == "pay":
            if shipped_seen == 0:
                "paid" => status
        if e == "ship":
            "shipped" => status
        if e == "cancel":
            "cancelled" => status
    return status

# the shipped resolver: calls the status endpoint, which A serves
def resolve_via_endpoint(order):
    return service_a(order)

# a resolver that replays the event log
def resolve_via_log(order):
    return replay(order[1])

[["o1", ["pay", "ship"]], ["o2", ["pay", "ship", "cancel"]], ["o3", ["ship", "pay"]], ["o4", ["pay", "cancel"]], ["o5", ["ship", "pay", "cancel"]], ["o6", ["pay"]], ["o7", ["ship", "cancel"]], ["o8", ["pay", "ship", "cancel"]]] => orders

# ---- the disputes ----

"order  A          B          truth" ^0
0 => disputes
for o in orders:
    service_a(o) => a
    service_b(o) => b
    replay(o[1]) => t
    if a != b:
        disputes + 1 => disputes
        "  " + o[0] + " : " + a + "  " + b + "  " + t + "   <- dispute" ^0
    else:
        "  " + o[0] + " : " + a + "  " + b + "  " + t ^0
"  disputes : " + str(disputes) + " of " + str(len(orders)) ^0
"" ^0

# ---- who wins, and who was right ----

0 => a_wins
0 => b_wins
0 => endpoint_right
0 => log_right
for o in orders:
    service_a(o) => a
    service_b(o) => b
    replay(o[1]) => t
    if a != b:
        resolve_via_endpoint(o) => decided
        if decided == a:
            a_wins + 1 => a_wins
        if decided == b:
            b_wins + 1 => b_wins
        if decided == t:
            endpoint_right + 1 => endpoint_right
        if resolve_via_log(o) == t:
            log_right + 1 => log_right
"resolution of the " + str(disputes) + " disputes" ^0
"  A's answer chosen : " + str(a_wins) ^0
"  B's answer chosen : " + str(b_wins) ^0
"  the choice was correct : " + str(endpoint_right) + " of " + str(disputes) ^0
"  replaying the log is correct : " + str(log_right) + " of " + str(disputes) ^0
"" ^0

# ---- the metric that defends the design ----

"each service's accuracy, measured against the event log" ^0
0 => a_right
0 => b_right
for o in orders:
    if service_a(o) == replay(o[1]):
        a_right + 1 => a_right
    if service_b(o) == replay(o[1]):
        b_right + 1 => b_right
"  A correct : " + str(a_right) + " of " + str(len(orders)) ^0
"  B correct : " + str(b_right) + " of " + str(len(orders)) ^0
"" ^0
"the same two services, ranked by the dispute record instead" ^0
"  A won " + str(a_wins) + " disputes, B won " + str(b_wins) ^0
if b_wins == 0:
    "  a perfect record, produced by the arbiter rather than by A" ^0
"" ^0

# ---- what each service is actually wrong about ----

"orders each service gets wrong" ^0
for o in orders:
    replay(o[1]) => t
    if service_a(o) != t:
        "  A : " + o[0] + " says " + service_a(o) + ", log says " + t ^0
    if service_b(o) != t:
        "  B : " + o[0] + " says " + service_b(o) + ", log says " + t ^0
"" ^0

"An arbiter is defined by what it is independent OF. The resolver here is" ^0
"independent of B, and its record shows it: every dispute resolved, none of" ^0
"them by looking at anything neither party already said." ^0
```

## Python (deterministic transpilation)

```python
def replay(events):
    status = "new"
    for e in events:
        if e == "pay":
            status = "paid"
        if e == "ship":
            status = "shipped"
        if e == "cancel":
            status = "cancelled"
    return status

def service_a(order):
    status = "new"
    for e in order[1]:
        if e == "pay":
            status = "paid"
        if e == "ship":
            status = "shipped"
        if e == "cancel":
            if status != "shipped":
                status = "cancelled"
    return status

def service_b(order):
    status = "new"
    shipped_seen = 0
    for e in order[1]:
        if e == "ship":
            shipped_seen = 1
        if e == "pay":
            if shipped_seen == 0:
                status = "paid"
        if e == "ship":
            status = "shipped"
        if e == "cancel":
            status = "cancelled"
    return status

def resolve_via_endpoint(order):
    return service_a(order)

def resolve_via_log(order):
    return replay(order[1])

orders = [["o1", ["pay", "ship"]], ["o2", ["pay", "ship", "cancel"]], ["o3", ["ship", "pay"]], ["o4", ["pay", "cancel"]], ["o5", ["ship", "pay", "cancel"]], ["o6", ["pay"]], ["o7", ["ship", "cancel"]], ["o8", ["pay", "ship", "cancel"]]]
print("order  A          B          truth")
disputes = 0
for o in orders:
    a = service_a(o)
    b = service_b(o)
    t = replay(o[1])
    if a != b:
        disputes = disputes + 1
        print("  " + o[0] + " : " + a + "  " + b + "  " + t + "   <- dispute")
    else:
        print("  " + o[0] + " : " + a + "  " + b + "  " + t)
print("  disputes : " + str(disputes) + " of " + str(len(orders)))
print("")
a_wins = 0
b_wins = 0
endpoint_right = 0
log_right = 0
for o in orders:
    a = service_a(o)
    b = service_b(o)
    t = replay(o[1])
    if a != b:
        decided = resolve_via_endpoint(o)
        if decided == a:
            a_wins = a_wins + 1
        if decided == b:
            b_wins = b_wins + 1
        if decided == t:
            endpoint_right = endpoint_right + 1
        if resolve_via_log(o) == t:
            log_right = log_right + 1
print("resolution of the " + str(disputes) + " disputes")
print("  A's answer chosen : " + str(a_wins))
print("  B's answer chosen : " + str(b_wins))
print("  the choice was correct : " + str(endpoint_right) + " of " + str(disputes))
print("  replaying the log is correct : " + str(log_right) + " of " + str(disputes))
print("")
print("each service's accuracy, measured against the event log")
a_right = 0
b_right = 0
for o in orders:
    if service_a(o) == replay(o[1]):
        a_right = a_right + 1
    if service_b(o) == replay(o[1]):
        b_right = b_right + 1
print("  A correct : " + str(a_right) + " of " + str(len(orders)))
print("  B correct : " + str(b_right) + " of " + str(len(orders)))
print("")
print("the same two services, ranked by the dispute record instead")
print("  A won " + str(a_wins) + " disputes, B won " + str(b_wins))
if b_wins == 0:
    print("  a perfect record, produced by the arbiter rather than by A")
print("")
print("orders each service gets wrong")
for o in orders:
    t = replay(o[1])
    if service_a(o) != t:
        print("  A : " + o[0] + " says " + service_a(o) + ", log says " + t)
    if service_b(o) != t:
        print("  B : " + o[0] + " says " + service_b(o) + ", log says " + t)
print("")
print("An arbiter is defined by what it is independent OF. The resolver here is")
print("independent of B, and its record shows it: every dispute resolved, none of")
print("them by looking at anything neither party already said.")
```

## stdout (executed)

```text
order  A          B          truth
  o1 : shipped  shipped  shipped
  o2 : shipped  cancelled  cancelled   <- dispute
  o3 : paid  shipped  paid   <- dispute
  o4 : cancelled  cancelled  cancelled
  o5 : cancelled  cancelled  cancelled
  o6 : paid  paid  paid
  o7 : shipped  cancelled  cancelled   <- dispute
  o8 : shipped  cancelled  cancelled   <- dispute
  disputes : 4 of 8

resolution of the 4 disputes
  A's answer chosen : 4
  B's answer chosen : 0
  the choice was correct : 1 of 4
  replaying the log is correct : 4 of 4

each service's accuracy, measured against the event log
  A correct : 5 of 8
  B correct : 7 of 8

the same two services, ranked by the dispute record instead
  A won 4 disputes, B won 0
  a perfect record, produced by the arbiter rather than by A

orders each service gets wrong
  A : o2 says shipped, log says cancelled
  B : o3 says shipped, log says paid
  A : o7 says shipped, log says cancelled
  A : o8 says shipped, log says cancelled

An arbiter is defined by what it is independent OF. The resolver here is
independent of B, and its record shows it: every dispute resolved, none of
them by looking at anything neither party already said.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
