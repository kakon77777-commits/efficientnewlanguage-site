<!-- canonical: efficientnewlanguage.org/ai/examples/513-the-field-was-made-required-by-one-team | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 513 — The field was made required by one team

`the_field_was_made_required_by_one_team.eml` - A producer added one required field to a shared event. What that cost the producer and what it cost everybody else are computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A producer added
# one required field to a shared event. What that cost the producer and what it
# cost everybody else are computed below.
#
# The field should be required. It carries the tenant id, half the downstream
# bugs that quarter came from events that could not be attributed to a tenant,
# and making it optional would have meant every consumer writing the same
# defensive branch. The producer is right on the merits and the review approved
# it in an afternoon.
#
# The producer's cost is one line and one deploy. The consumers' cost is a
# migration each, and the number of consumers is not a number the producer's
# change had to state anywhere. A change is approved against the cost visible
# in the change.
#
# Both costs are counted below.

# [consumer, records per day, parser strictness, days to migrate, days until they noticed]
[["billing", 900000, "strict", 3, 0], ["search index", 400000, "lenient", 1, 4], ["fraud", 120000, "strict", 5, 0], ["data warehouse", 900000, "strict", 4, 1], ["partner export", 40000, "lenient", 2, 9], ["mobile sync", 300000, "strict", 2, 0]] => consumers

len(consumers) => n
1 => producer_days

0 => consumer_days
0 => broke
0 => lag_total
for c in consumers:
    consumer_days + c[3] => consumer_days
    lag_total + c[4] => lag_total
    if c[2] == "strict":
        broke + 1 => broke

"the change            : one field, from optional to required" ^0
"producer effort       : " + str(producer_days) + " day" ^0
"consumers of the event: " + str(n) ^0
"consumer effort       : " + str(consumer_days) + " days" ^0
"ratio                 : " + str(int(consumer_days / producer_days)) + " to 1" ^0
"" ^0

"consumer          records/day   parser    days to migrate   days until noticed" ^0
for c in consumers:
    "  " + c[0] + "   " + str(c[1]) + "     " + c[2] + "     " + str(c[3]) + "                 " + str(c[4]) ^0
"" ^0

# ---- who broke and who did not ----

"what happened at the deploy" ^0
"  consumers that rejected the event outright : " + str(broke) + " of " + str(n) ^0
"  consumers that kept running on the old shape : " + str(n - broke) ^0
for c in consumers:
    if c[2] == "strict":
        "    broke  : " + c[0] + " (" + str(c[1]) + " records a day stopped)" ^0
for c in consumers:
    if c[2] == "lenient":
        "    survived: " + c[0] + ", and carried a null tenant for " + str(c[4]) + " days" ^0
"  the lenient parsers did not break, which is why they noticed last" ^0
"" ^0

# ---- the records that went nowhere ----

0 => stopped
for c in consumers:
    if c[2] == "strict":
        stopped + c[1] => stopped
0 => wrong
for c in consumers:
    if c[2] == "lenient":
        wrong + c[1] * c[4] => wrong
"records affected on day one" ^0
"  rejected outright : " + str(stopped) + " a day" ^0
"  accepted with no tenant, across the days before anyone looked : " + str(wrong) ^0
"  the first number produced pages, the second produced rows" ^0
"" ^0

# ---- what the producer's tests said ----

"the producer's own suite at the moment of the change" ^0
"  tests over the producer's code : green" ^0
"  tests over the event contract  : green, the field is now required" ^0
"  consumers exercised by that suite : 0" ^0
"  a producer's suite tests what the producer does with the event, and the" ^0
"  cost of this change is entirely in what other people do with it" ^0
"" ^0

# ---- discovery lag against blast radius ----

"how long each consumer ran wrong before anyone knew" ^0
0 => worst_lag
"" => lag_name
for c in consumers:
    if c[4] > worst_lag:
        c[4] => worst_lag
        c[0] => lag_name
"  longest lag : " + lag_name + " at " + str(worst_lag) + " days" ^0
consumers[0][1] => smallest
for c in consumers:
    if c[1] < smallest:
        c[1] => smallest
for c in consumers:
    if c[0] == lag_name:
        "  its volume  : " + str(c[1]) + " records a day" ^0
        if c[1] == smallest:
            "  which is the smallest of the " + str(n) + ", and the least watched" ^0
"  average lag across all consumers : " + str(int(lag_total / n)) + " days" ^0
"  the lag is longest where the volume is lowest, because a consumer is" ^0
"  noticed when it is missed" ^0
"" ^0

# ---- what the change would have cost with a deprecation window ----

"the same field, required after a two-release window" ^0
"  producer effort : " + str(producer_days + 1) + " days, one extra deploy" ^0
"  consumer effort : " + str(consumer_days) + " days, unchanged" ^0
"  consumers broken at any moment : 0" ^0
"  records rejected : 0" ^0
"  the total work is " + str(producer_days + 1 + consumer_days) + " days against " + str(producer_days + consumer_days) + ", so the window costs" ^0
"  one producer day and removes every rejected record" ^0
"" ^0

# ---- the control: a field nobody consumes ----
#
# Where the producer adds a required field to an event with no external
# consumers, the cost of the change is entirely inside the change.

[["internal audit trail", 5000, "strict", 1, 0]] => private
for c in private:
    "control - a required field on " + c[0] + ", consumers outside the team: 0" ^0
    "  producer effort : " + str(c[3]) + " day" ^0
    "  consumer effort : 0 days" ^0
    "  ratio : " + str(c[3]) + " to " + str(c[3]) ^0
    "  here the person deciding and the person paying are the same person," ^0
    "  and the review sees the whole cost" ^0
"" ^0

"Requiring the tenant id was the right call and the review was not careless." ^0
"The cost of a contract change is carried by the contract's consumers, and" ^0
"how many of those there are is not written anywhere in the change." ^0
```

## Python (deterministic transpilation)

```python
consumers = [["billing", 900000, "strict", 3, 0], ["search index", 400000, "lenient", 1, 4], ["fraud", 120000, "strict", 5, 0], ["data warehouse", 900000, "strict", 4, 1], ["partner export", 40000, "lenient", 2, 9], ["mobile sync", 300000, "strict", 2, 0]]
n = len(consumers)
producer_days = 1
consumer_days = 0
broke = 0
lag_total = 0
for c in consumers:
    consumer_days = consumer_days + c[3]
    lag_total = lag_total + c[4]
    if c[2] == "strict":
        broke = broke + 1
print("the change            : one field, from optional to required")
print("producer effort       : " + str(producer_days) + " day")
print("consumers of the event: " + str(n))
print("consumer effort       : " + str(consumer_days) + " days")
print("ratio                 : " + str(int(consumer_days / producer_days)) + " to 1")
print("")
print("consumer          records/day   parser    days to migrate   days until noticed")
for c in consumers:
    print("  " + c[0] + "   " + str(c[1]) + "     " + c[2] + "     " + str(c[3]) + "                 " + str(c[4]))
print("")
print("what happened at the deploy")
print("  consumers that rejected the event outright : " + str(broke) + " of " + str(n))
print("  consumers that kept running on the old shape : " + str(n - broke))
for c in consumers:
    if c[2] == "strict":
        print("    broke  : " + c[0] + " (" + str(c[1]) + " records a day stopped)")
for c in consumers:
    if c[2] == "lenient":
        print("    survived: " + c[0] + ", and carried a null tenant for " + str(c[4]) + " days")
print("  the lenient parsers did not break, which is why they noticed last")
print("")
stopped = 0
for c in consumers:
    if c[2] == "strict":
        stopped = stopped + c[1]
wrong = 0
for c in consumers:
    if c[2] == "lenient":
        wrong = wrong + c[1] * c[4]
print("records affected on day one")
print("  rejected outright : " + str(stopped) + " a day")
print("  accepted with no tenant, across the days before anyone looked : " + str(wrong))
print("  the first number produced pages, the second produced rows")
print("")
print("the producer's own suite at the moment of the change")
print("  tests over the producer's code : green")
print("  tests over the event contract  : green, the field is now required")
print("  consumers exercised by that suite : 0")
print("  a producer's suite tests what the producer does with the event, and the")
print("  cost of this change is entirely in what other people do with it")
print("")
print("how long each consumer ran wrong before anyone knew")
worst_lag = 0
lag_name = ""
for c in consumers:
    if c[4] > worst_lag:
        worst_lag = c[4]
        lag_name = c[0]
print("  longest lag : " + lag_name + " at " + str(worst_lag) + " days")
smallest = consumers[0][1]
for c in consumers:
    if c[1] < smallest:
        smallest = c[1]
for c in consumers:
    if c[0] == lag_name:
        print("  its volume  : " + str(c[1]) + " records a day")
        if c[1] == smallest:
            print("  which is the smallest of the " + str(n) + ", and the least watched")
print("  average lag across all consumers : " + str(int(lag_total / n)) + " days")
print("  the lag is longest where the volume is lowest, because a consumer is")
print("  noticed when it is missed")
print("")
print("the same field, required after a two-release window")
print("  producer effort : " + str(producer_days + 1) + " days, one extra deploy")
print("  consumer effort : " + str(consumer_days) + " days, unchanged")
print("  consumers broken at any moment : 0")
print("  records rejected : 0")
print("  the total work is " + str(producer_days + 1 + consumer_days) + " days against " + str(producer_days + consumer_days) + ", so the window costs")
print("  one producer day and removes every rejected record")
print("")
private = [["internal audit trail", 5000, "strict", 1, 0]]
for c in private:
    print("control - a required field on " + c[0] + ", consumers outside the team: 0")
    print("  producer effort : " + str(c[3]) + " day")
    print("  consumer effort : 0 days")
    print("  ratio : " + str(c[3]) + " to " + str(c[3]))
    print("  here the person deciding and the person paying are the same person,")
    print("  and the review sees the whole cost")
print("")
print("Requiring the tenant id was the right call and the review was not careless.")
print("The cost of a contract change is carried by the contract's consumers, and")
print("how many of those there are is not written anywhere in the change.")
```

## stdout (executed)

```text
the change            : one field, from optional to required
producer effort       : 1 day
consumers of the event: 6
consumer effort       : 17 days
ratio                 : 17 to 1

consumer          records/day   parser    days to migrate   days until noticed
  billing   900000     strict     3                 0
  search index   400000     lenient     1                 4
  fraud   120000     strict     5                 0
  data warehouse   900000     strict     4                 1
  partner export   40000     lenient     2                 9
  mobile sync   300000     strict     2                 0

what happened at the deploy
  consumers that rejected the event outright : 4 of 6
  consumers that kept running on the old shape : 2
    broke  : billing (900000 records a day stopped)
    broke  : fraud (120000 records a day stopped)
    broke  : data warehouse (900000 records a day stopped)
    broke  : mobile sync (300000 records a day stopped)
    survived: search index, and carried a null tenant for 4 days
    survived: partner export, and carried a null tenant for 9 days
  the lenient parsers did not break, which is why they noticed last

records affected on day one
  rejected outright : 2220000 a day
  accepted with no tenant, across the days before anyone looked : 1960000
  the first number produced pages, the second produced rows

the producer's own suite at the moment of the change
  tests over the producer's code : green
  tests over the event contract  : green, the field is now required
  consumers exercised by that suite : 0
  a producer's suite tests what the producer does with the event, and the
  cost of this change is entirely in what other people do with it

how long each consumer ran wrong before anyone knew
  longest lag : partner export at 9 days
  its volume  : 40000 records a day
  which is the smallest of the 6, and the least watched
  average lag across all consumers : 2 days
  the lag is longest where the volume is lowest, because a consumer is
  noticed when it is missed

the same field, required after a two-release window
  producer effort : 2 days, one extra deploy
  consumer effort : 17 days, unchanged
  consumers broken at any moment : 0
  records rejected : 0
  the total work is 19 days against 18, so the window costs
  one producer day and removes every rejected record

control - a required field on internal audit trail, consumers outside the team: 0
  producer effort : 1 day
  consumer effort : 0 days
  ratio : 1 to 1
  here the person deciding and the person paying are the same person,
  and the review sees the whole cost

Requiring the tenant id was the right call and the review was not careless.
The cost of a contract change is carried by the contract's consumers, and
how many of those there are is not written anywhere in the change.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
