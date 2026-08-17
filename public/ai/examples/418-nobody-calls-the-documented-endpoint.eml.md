<!-- canonical: efficientnewlanguage.org/ai/examples/418-nobody-calls-the-documented-endpoint | ai_layer_version: 0.1.0 | updated: 2026-08-17 -->

# Example 418 — Nobody calls the documented endpoint

`nobody_calls_the_documented_endpoint.eml` - The documented endpoint carries 3% of the traffic. The one nobody wrote down carries most of it.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The documented
# endpoint carries 3% of the traffic. The one nobody wrote down carries most
# of it.
#
# The documented one is better in every way it was designed to be: versioned,
# validated, rate-limited, and the only one with a stability guarantee. It was
# announced, it has a tutorial, and it is the one the team maintains.
#
# The other one exists because the web client needs it, and the web client is
# public, so its requests are visible to anyone who opens a browser console.
# Nothing was leaked; it was simply observable, and observable beats documented
# when someone needs to ship today.
#
# Traffic and guarantees are counted per endpoint, so which one is load-bearing
# is measured rather than assumed.

# [endpoint, documented, versioned, calls per day, distinct callers]
[["/api/v2/orders", 1, 1, 300, 4], ["/internal/orders.json", 0, 0, 6200, 19], ["/api/v2/customers", 1, 1, 210, 3], ["/_next/data/orders", 0, 0, 2400, 11]] => endpoints

def total(col):
    0 => t
    for e in endpoints:
        t + e[col] => t
    return t

"endpoints : " + str(len(endpoints)) ^0
"" ^0
"endpoint                  documented   calls/day   callers" ^0
for e in endpoints:
    "" => d
    if e[1] == 1:
        d + "yes" => d
    else:
        d + "no " => d
    "  " + e[0] + "   " + d + "        " + str(e[3]) + "      " + str(e[4]) ^0
"" ^0

0 => doc_calls
0 => doc_callers
0 => undoc_calls
0 => undoc_callers
for e in endpoints:
    if e[1] == 1:
        doc_calls + e[3] => doc_calls
        doc_callers + e[4] => doc_callers
    else:
        undoc_calls + e[3] => undoc_calls
        undoc_callers + e[4] => undoc_callers

"documented endpoints" ^0
"  calls   : " + str(doc_calls) + "  (" + str(int(doc_calls * 100 / total(3))) + "%)" ^0
"  callers : " + str(doc_callers) + "  (" + str(int(doc_callers * 100 / total(4))) + "%)" ^0
"" ^0
"undocumented endpoints" ^0
"  calls   : " + str(undoc_calls) + "  (" + str(int(undoc_calls * 100 / total(3))) + "%)" ^0
"  callers : " + str(undoc_callers) + "  (" + str(int(undoc_callers * 100 / total(4))) + "%)" ^0
"" ^0

# ---- what a change to each one costs ----

"changing the documented endpoint" ^0
"  callers affected : " + str(doc_callers) ^0
"  they were told it is versioned, so a v3 costs them a migration they expect" ^0
"" ^0
"changing the undocumented one" ^0
"  callers affected : " + str(undoc_callers) ^0
"  they were told nothing, so they find out when it breaks" ^0
"" ^0

# ---- where the guarantees are ----

0 => guarded_calls
for e in endpoints:
    if e[2] == 1:
        guarded_calls + e[3] => guarded_calls
"share of traffic that is versioned, validated and rate-limited" ^0
"  " + str(int(guarded_calls * 100 / total(3))) + "%" ^0
"  the other " + str(100 - int(guarded_calls * 100 / total(3))) + "% has none of those, and is most of the load" ^0
"" ^0

# ---- what documenting the observed one would change ----
#
# Not the traffic, which is already there. What it changes is whether the
# callers are known, and whether a change to it can be announced.

"if the observed endpoint were documented tomorrow" ^0
"  traffic moved : 0" ^0
"  callers who become announceable : " + str(undoc_callers) ^0
"  guarantees the team then owes : the ones it already effectively provides" ^0
"" ^0

# ---- the control: a service whose documented path carries the load ----

[["/v1/pay", 1, 1, 5000, 12], ["/internal/debug", 0, 0, 20, 1]] => healthy
0 => ht
0 => hd
for e in healthy:
    ht + e[3] => ht
    if e[1] == 1:
        hd + e[3] => hd
"control - a service where the documented path carries the traffic" ^0
"  documented share : " + str(int(hd * 100 / ht)) + "%" ^0
if int(hd * 100 / ht) > 90:
    "  here the contract and the load are the same surface" ^0
"" ^0

"The documented endpoint is better and is maintained. Callers build against" ^0
"what they can see working, and a public client makes its own requests" ^0
"visible to everyone who reads them." ^0
```

## Python (deterministic transpilation)

```python
endpoints = [["/api/v2/orders", 1, 1, 300, 4], ["/internal/orders.json", 0, 0, 6200, 19], ["/api/v2/customers", 1, 1, 210, 3], ["/_next/data/orders", 0, 0, 2400, 11]]

def total(col):
    t = 0
    for e in endpoints:
        t = t + e[col]
    return t

print("endpoints : " + str(len(endpoints)))
print("")
print("endpoint                  documented   calls/day   callers")
for e in endpoints:
    d = ""
    if e[1] == 1:
        d = d + "yes"
    else:
        d = d + "no "
    print("  " + e[0] + "   " + d + "        " + str(e[3]) + "      " + str(e[4]))
print("")
doc_calls = 0
doc_callers = 0
undoc_calls = 0
undoc_callers = 0
for e in endpoints:
    if e[1] == 1:
        doc_calls = doc_calls + e[3]
        doc_callers = doc_callers + e[4]
    else:
        undoc_calls = undoc_calls + e[3]
        undoc_callers = undoc_callers + e[4]
print("documented endpoints")
print("  calls   : " + str(doc_calls) + "  (" + str(int(doc_calls * 100 / total(3))) + "%)")
print("  callers : " + str(doc_callers) + "  (" + str(int(doc_callers * 100 / total(4))) + "%)")
print("")
print("undocumented endpoints")
print("  calls   : " + str(undoc_calls) + "  (" + str(int(undoc_calls * 100 / total(3))) + "%)")
print("  callers : " + str(undoc_callers) + "  (" + str(int(undoc_callers * 100 / total(4))) + "%)")
print("")
print("changing the documented endpoint")
print("  callers affected : " + str(doc_callers))
print("  they were told it is versioned, so a v3 costs them a migration they expect")
print("")
print("changing the undocumented one")
print("  callers affected : " + str(undoc_callers))
print("  they were told nothing, so they find out when it breaks")
print("")
guarded_calls = 0
for e in endpoints:
    if e[2] == 1:
        guarded_calls = guarded_calls + e[3]
print("share of traffic that is versioned, validated and rate-limited")
print("  " + str(int(guarded_calls * 100 / total(3))) + "%")
print("  the other " + str(100 - int(guarded_calls * 100 / total(3))) + "% has none of those, and is most of the load")
print("")
print("if the observed endpoint were documented tomorrow")
print("  traffic moved : 0")
print("  callers who become announceable : " + str(undoc_callers))
print("  guarantees the team then owes : the ones it already effectively provides")
print("")
healthy = [["/v1/pay", 1, 1, 5000, 12], ["/internal/debug", 0, 0, 20, 1]]
ht = 0
hd = 0
for e in healthy:
    ht = ht + e[3]
    if e[1] == 1:
        hd = hd + e[3]
print("control - a service where the documented path carries the traffic")
print("  documented share : " + str(int(hd * 100 / ht)) + "%")
if int(hd * 100 / ht) > 90:
    print("  here the contract and the load are the same surface")
print("")
print("The documented endpoint is better and is maintained. Callers build against")
print("what they can see working, and a public client makes its own requests")
print("visible to everyone who reads them.")
```

## stdout (executed)

```text
endpoints : 4

endpoint                  documented   calls/day   callers
  /api/v2/orders   yes        300      4
  /internal/orders.json   no         6200      19
  /api/v2/customers   yes        210      3
  /_next/data/orders   no         2400      11

documented endpoints
  calls   : 510  (5%)
  callers : 7  (18%)

undocumented endpoints
  calls   : 8600  (94%)
  callers : 30  (81%)

changing the documented endpoint
  callers affected : 7
  they were told it is versioned, so a v3 costs them a migration they expect

changing the undocumented one
  callers affected : 30
  they were told nothing, so they find out when it breaks

share of traffic that is versioned, validated and rate-limited
  5%
  the other 95% has none of those, and is most of the load

if the observed endpoint were documented tomorrow
  traffic moved : 0
  callers who become announceable : 30
  guarantees the team then owes : the ones it already effectively provides

control - a service where the documented path carries the traffic
  documented share : 99%
  here the contract and the load are the same surface

The documented endpoint is better and is maintained. Callers build against
what they can see working, and a public client makes its own requests
visible to everyone who reads them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
