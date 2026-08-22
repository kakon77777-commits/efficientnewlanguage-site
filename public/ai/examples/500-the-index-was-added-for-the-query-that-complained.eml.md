<!-- canonical: efficientnewlanguage.org/ai/examples/500-the-index-was-added-for-the-query-that-complained | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 500 — The index was added for the query that complained

`the_index_was_added_for_the_query_that_complained.eml` - Nine indexes, each added after somebody reported a slow query. What they cost and what they save is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Nine indexes, each
# added after somebody reported a slow query. What they cost and what they save
# is computed below.
#
# Adding an index when a query is reported slow is right and it works. The
# report names a real query, the index makes it fast, and the person who
# reported it confirms the fix. Every one of these was a correct response to a
# correct observation.
#
# An index is paid for on every write to the table, by everybody. A report is
# made by whoever is blocked enough to write one. So the indexes accumulate
# where the complaints are, and the write cost accumulates on the tables, and
# those are two different distributions.
#
# Both are computed per index.

# [index, ms saved per read, reads per day, ms added per write, writes per day, was it reported]
[["orders_status", 40, 900, 3, 12000, 1], ["orders_created", 25, 400, 3, 12000, 1], ["orders_customer", 60, 15000, 3, 12000, 1], ["events_type", 12, 200, 4, 90000, 1], ["events_actor", 18, 350, 4, 90000, 1], ["events_session", 9, 80, 4, 90000, 1], ["users_email", 80, 22000, 2, 800, 1], ["audit_actor", 15, 40, 5, 40000, 1], ["audit_target", 15, 25, 5, 40000, 1]] => indexes

len(indexes) => n

def saves(i):
    return i[1] * i[2]

def costs(i):
    return i[3] * i[4]

0 => total_save
0 => total_cost
0 => net_negative
for i in indexes:
    total_save + saves(i) => total_save
    total_cost + costs(i) => total_cost
    if costs(i) > saves(i):
        net_negative + 1 => net_negative

"indexes : " + str(n) + ", every one added after a report" ^0
"ms saved on reads per day : " + str(total_save) ^0
"ms added to writes per day: " + str(total_cost) ^0
if total_cost > total_save:
    "  net : " + str(total_cost - total_save) + " ms a day worse" ^0
else:
    "  net : " + str(total_save - total_cost) + " ms a day better" ^0
"" ^0

"index              saves/day   costs/day   net" ^0
for i in indexes:
    saves(i) - costs(i) => net
    "" => sign
    if net >= 0:
        sign + "+" => sign
    "  " + i[0] + "   " + str(saves(i)) + "        " + str(costs(i)) + "      " + sign + str(net) ^0
"" ^0
"indexes that cost more than they save : " + str(net_negative) + " of " + str(n) ^0
"" ^0

# ---- who pays and who reported ----

0 => badly_negative
for i in indexes:
    if costs(i) - saves(i) > 100000:
        badly_negative + 1 => badly_negative
"the " + str(badly_negative) + " that cost more than 100000 ms a day net" ^0
for i in indexes:
    if costs(i) - saves(i) > 100000:
        "  " + i[0] + " : " + str(i[2]) + " reads a day against " + str(i[4]) + " writes" ^0
"  each of these serves a low-traffic read on a high-traffic table, which is" ^0
"  exactly the shape a person notices - the query is slow BECAUSE it is rare" ^0
"  enough to miss the cache" ^0
"" ^0

# ---- the ones nobody reported ----
#
# A query nobody reported is either fast or run by something that does not
# complain. The second kind never generates an index request.

0 => reported
for i in indexes:
    reported + i[5] => reported
"indexes added on a report : " + str(reported) + " of " + str(n) ^0
"indexes added on measured cost : " + str(n - reported) ^0
if n - reported == 0:
    "  none, so the entire index set is a record of who complained" ^0
"" ^0

# ---- what a cost-ordered list would pick ----

"the same nine, ordered by net benefit" ^0
0 => keep
0 => drop
0 => recovered
for i in indexes:
    if saves(i) >= costs(i):
        keep + 1 => keep
    else:
        drop + 1 => drop
        recovered + costs(i) - saves(i) => recovered
"  worth keeping : " + str(keep) ^0
"  worth dropping: " + str(drop) ^0
if recovered > 0:
    "  write time recovered by dropping them : " + str(recovered) + " ms a day" ^0
    "  and the " + str(drop) + " reports that produced them were all correct about their query" ^0
"" ^0

# ---- what dropping one does to the reporter ----

"what the reporter of a dropped index experiences" ^0
for i in indexes:
    if costs(i) - saves(i) > 300000:
        "  " + i[0] + " : their query goes back to +" + str(i[1]) + " ms, " + str(i[2]) + " times a day" ^0
"  that is a real regression for a real person, and it is the cost of the" ^0
"  write time everybody else is paying" ^0
"" ^0

# ---- the control: an index on a read-heavy table ----
#
# Where reads dominate writes, the report and the cost point the same way and
# responding to the complaint is simply correct.

for i in indexes:
    if i[2] > i[4]:
        "control - " + i[0] + ", " + str(i[2]) + " reads against " + str(i[4]) + " writes" ^0
        "  saves " + str(saves(i)) + ", costs " + str(costs(i)) + ", net +" + str(saves(i) - costs(i)) ^0
        "  here the complaint-driven method and a cost-driven one agree, and" ^0
        "  most indexes are like this - which is why the method is trusted" ^0
"" ^0

"Every index was a correct response to a real report, and the reporter" ^0
"confirmed the fix each time. A report is made by someone blocked; the write" ^0
"cost is paid by everybody, and nobody is blocked enough by three milliseconds" ^0
"to write it up." ^0
```

## Python (deterministic transpilation)

```python
indexes = [["orders_status", 40, 900, 3, 12000, 1], ["orders_created", 25, 400, 3, 12000, 1], ["orders_customer", 60, 15000, 3, 12000, 1], ["events_type", 12, 200, 4, 90000, 1], ["events_actor", 18, 350, 4, 90000, 1], ["events_session", 9, 80, 4, 90000, 1], ["users_email", 80, 22000, 2, 800, 1], ["audit_actor", 15, 40, 5, 40000, 1], ["audit_target", 15, 25, 5, 40000, 1]]
n = len(indexes)

def saves(i):
    return i[1] * i[2]

def costs(i):
    return i[3] * i[4]

total_save = 0
total_cost = 0
net_negative = 0
for i in indexes:
    total_save = total_save + saves(i)
    total_cost = total_cost + costs(i)
    if costs(i) > saves(i):
        net_negative = net_negative + 1
print("indexes : " + str(n) + ", every one added after a report")
print("ms saved on reads per day : " + str(total_save))
print("ms added to writes per day: " + str(total_cost))
if total_cost > total_save:
    print("  net : " + str(total_cost - total_save) + " ms a day worse")
else:
    print("  net : " + str(total_save - total_cost) + " ms a day better")
print("")
print("index              saves/day   costs/day   net")
for i in indexes:
    net = saves(i) - costs(i)
    sign = ""
    if net >= 0:
        sign = sign + "+"
    print("  " + i[0] + "   " + str(saves(i)) + "        " + str(costs(i)) + "      " + sign + str(net))
print("")
print("indexes that cost more than they save : " + str(net_negative) + " of " + str(n))
print("")
badly_negative = 0
for i in indexes:
    if costs(i) - saves(i) > 100000:
        badly_negative = badly_negative + 1
print("the " + str(badly_negative) + " that cost more than 100000 ms a day net")
for i in indexes:
    if costs(i) - saves(i) > 100000:
        print("  " + i[0] + " : " + str(i[2]) + " reads a day against " + str(i[4]) + " writes")
print("  each of these serves a low-traffic read on a high-traffic table, which is")
print("  exactly the shape a person notices - the query is slow BECAUSE it is rare")
print("  enough to miss the cache")
print("")
reported = 0
for i in indexes:
    reported = reported + i[5]
print("indexes added on a report : " + str(reported) + " of " + str(n))
print("indexes added on measured cost : " + str(n - reported))
if n - reported == 0:
    print("  none, so the entire index set is a record of who complained")
print("")
print("the same nine, ordered by net benefit")
keep = 0
drop = 0
recovered = 0
for i in indexes:
    if saves(i) >= costs(i):
        keep = keep + 1
    else:
        drop = drop + 1
        recovered = recovered + costs(i) - saves(i)
print("  worth keeping : " + str(keep))
print("  worth dropping: " + str(drop))
if recovered > 0:
    print("  write time recovered by dropping them : " + str(recovered) + " ms a day")
    print("  and the " + str(drop) + " reports that produced them were all correct about their query")
print("")
print("what the reporter of a dropped index experiences")
for i in indexes:
    if costs(i) - saves(i) > 300000:
        print("  " + i[0] + " : their query goes back to +" + str(i[1]) + " ms, " + str(i[2]) + " times a day")
print("  that is a real regression for a real person, and it is the cost of the")
print("  write time everybody else is paying")
print("")
for i in indexes:
    if i[2] > i[4]:
        print("control - " + i[0] + ", " + str(i[2]) + " reads against " + str(i[4]) + " writes")
        print("  saves " + str(saves(i)) + ", costs " + str(costs(i)) + ", net +" + str(saves(i) - costs(i)))
        print("  here the complaint-driven method and a cost-driven one agree, and")
        print("  most indexes are like this - which is why the method is trusted")
print("")
print("Every index was a correct response to a real report, and the reporter")
print("confirmed the fix each time. A report is made by someone blocked; the write")
print("cost is paid by everybody, and nobody is blocked enough by three milliseconds")
print("to write it up.")
```

## stdout (executed)

```text
indexes : 9, every one added after a report
ms saved on reads per day : 2716395
ms added to writes per day: 1589600
  net : 1126795 ms a day better

index              saves/day   costs/day   net
  orders_status   36000        36000      +0
  orders_created   10000        36000      -26000
  orders_customer   900000        36000      +864000
  events_type   2400        360000      -357600
  events_actor   6300        360000      -353700
  events_session   720        360000      -359280
  users_email   1760000        1600      +1758400
  audit_actor   600        200000      -199400
  audit_target   375        200000      -199625

indexes that cost more than they save : 6 of 9

the 5 that cost more than 100000 ms a day net
  events_type : 200 reads a day against 90000 writes
  events_actor : 350 reads a day against 90000 writes
  events_session : 80 reads a day against 90000 writes
  audit_actor : 40 reads a day against 40000 writes
  audit_target : 25 reads a day against 40000 writes
  each of these serves a low-traffic read on a high-traffic table, which is
  exactly the shape a person notices - the query is slow BECAUSE it is rare
  enough to miss the cache

indexes added on a report : 9 of 9
indexes added on measured cost : 0
  none, so the entire index set is a record of who complained

the same nine, ordered by net benefit
  worth keeping : 3
  worth dropping: 6
  write time recovered by dropping them : 1495605 ms a day
  and the 6 reports that produced them were all correct about their query

what the reporter of a dropped index experiences
  events_type : their query goes back to +12 ms, 200 times a day
  events_actor : their query goes back to +18 ms, 350 times a day
  events_session : their query goes back to +9 ms, 80 times a day
  that is a real regression for a real person, and it is the cost of the
  write time everybody else is paying

control - orders_customer, 15000 reads against 12000 writes
  saves 900000, costs 36000, net +864000
  here the complaint-driven method and a cost-driven one agree, and
  most indexes are like this - which is why the method is trusted
control - users_email, 22000 reads against 800 writes
  saves 1760000, costs 1600, net +1758400
  here the complaint-driven method and a cost-driven one agree, and
  most indexes are like this - which is why the method is trusted

Every index was a correct response to a real report, and the reporter
confirmed the fix each time. A report is made by someone blocked; the write
cost is paid by everybody, and nobody is blocked enough by three milliseconds
to write it up.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
