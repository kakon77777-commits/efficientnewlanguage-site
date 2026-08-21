<!-- canonical: efficientnewlanguage.org/ai/examples/491-the-two-teams-never-see-the-same-error | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 491 — The two teams never see the same error

`the_two_teams_never_see_the_same_error.eml` - The client team sees failures the server team cannot find. Both dashboards are correct, and what each one can contain is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The client team
# sees failures the server team cannot find. Both dashboards are correct, and
# what each one can contain is computed below.
#
# Neither instrument is broken. The client counts what the client experienced;
# the server counts what the server did. Each is complete about its own side and
# neither is hiding anything.
#
# A request can end in a state that only one side has a row for. A client
# timeout that the server completed after the deadline is a success on one
# dashboard and a failure on the other, and it is not a disagreement - it is two
# correct records of two different events.
#
# Every outcome class is scored against what each side records.

# [outcome, count, client records a failure, server records a failure]
[["server 500", 120, 1, 1], ["client timeout, server finished late", 340, 1, 0], ["connection reset in transit", 90, 1, 0], ["client cancelled after send", 210, 0, 0], ["server 200, client parse error", 60, 1, 0], ["server rejected, client retried and won", 150, 0, 1]] => outcomes

len(outcomes) => n
0 => total
0 => client_fail
0 => server_fail
0 => both
0 => neither
for o in outcomes:
    total + o[1] => total
    client_fail + o[1] * o[2] => client_fail
    server_fail + o[1] * o[3] => server_fail
    if o[2] == 1:
        if o[3] == 1:
            both + o[1] => both
    if o[2] == 0:
        if o[3] == 0:
            neither + o[1] => neither

"requests in the window : " + str(total) ^0
"  failures on the client dashboard : " + str(client_fail) ^0
"  failures on the server dashboard : " + str(server_fail) ^0
"  counted as a failure by both     : " + str(both) ^0
"  counted by neither               : " + str(neither) ^0
"" ^0

"outcome                              count   client   server" ^0
for o in outcomes:
    "" => c
    if o[2] == 1:
        c + "fail" => c
    else:
        c + "ok  " => c
    "" => s
    if o[3] == 1:
        s + "fail" => s
    else:
        s + "ok  " => s
    "  " + o[0] + "   " + str(o[1]) + "     " + c + "     " + s ^0
"" ^0

# ---- the overlap is the small part ----

if client_fail > 0:
    "of the client's " + str(client_fail) + " failures, the server also recorded " + str(both) ^0
    "  which is " + str(int(both * 100 / client_fail)) + "%" ^0
    "  the other " + str(client_fail - both) + " have no server row that says anything went wrong" ^0
"" ^0

# ---- what each team can honestly say ----

"what each team can say, truthfully" ^0
"  server team : our error rate is " + str(int(server_fail * 1000 / total)) + " per 1000, and it is" ^0
"  server team : we cannot reproduce the client's numbers" ^0
"  client team : our failure rate is " + str(int(client_fail * 1000 / total)) + " per 1000, and it is" ^0
"  client team : the server says these requests succeeded" ^0
"  both statements are correct and they are about different events" ^0
"" ^0

# ---- the class nobody counts ----

if neither > 0:
    "requests neither side counts as a failure : " + str(neither) ^0
    for o in outcomes:
        if o[2] == 0:
            if o[3] == 0:
                "  " + o[0] + " : " + str(o[1]) ^0
    "  a user who cancels after sending got no result, and no dashboard has a" ^0
    "  row that says so" ^0
"" ^0

# ---- what would join them ----
#
# Not a better dashboard on either side. One identifier carried through the
# request, so the two rows can be put next to each other.

"what a shared request id changes" ^0
"  new instrumentation on the server : none, it already logs per request" ^0
"  new instrumentation on the client : none, it already logs per request" ^0
"  what becomes possible : joining the two, which turns " + str(client_fail - both) + " unexplained" ^0
"  client failures into rows with a server side" ^0
"  the missing thing is not a measurement, it is a key" ^0
"" ^0

# ---- the asymmetry in who gets believed ----

"how the disagreement is usually settled" ^0
"  the server's data is centralised, complete and queryable" ^0
"  the client's data is sampled, from devices, and arrives late" ^0
"  so the better-instrumented side wins the argument, and it is the side" ^0
"  with no row for " + str(client_fail - both) + " of the failures" ^0
"" ^0

# ---- the control: a failure mode both sides record ----
#
# Where the failure happens at a point both sides observe, the two dashboards
# agree and the join adds nothing.

for o in outcomes:
    if o[2] == 1:
        if o[3] == 1:
            "control - " + o[0] + ", " + str(o[1]) + " requests" ^0
            "  both sides record it, both counts agree, and neither team needs the" ^0
            "  other's data to see it" ^0
"" ^0

"Both dashboards are complete about their own side and neither is hiding" ^0
"anything. A request can end in a state only one side has a row for, and the" ^0
"argument is settled by whichever side has the better rows." ^0
```

## Python (deterministic transpilation)

```python
outcomes = [["server 500", 120, 1, 1], ["client timeout, server finished late", 340, 1, 0], ["connection reset in transit", 90, 1, 0], ["client cancelled after send", 210, 0, 0], ["server 200, client parse error", 60, 1, 0], ["server rejected, client retried and won", 150, 0, 1]]
n = len(outcomes)
total = 0
client_fail = 0
server_fail = 0
both = 0
neither = 0
for o in outcomes:
    total = total + o[1]
    client_fail = client_fail + o[1] * o[2]
    server_fail = server_fail + o[1] * o[3]
    if o[2] == 1:
        if o[3] == 1:
            both = both + o[1]
    if o[2] == 0:
        if o[3] == 0:
            neither = neither + o[1]
print("requests in the window : " + str(total))
print("  failures on the client dashboard : " + str(client_fail))
print("  failures on the server dashboard : " + str(server_fail))
print("  counted as a failure by both     : " + str(both))
print("  counted by neither               : " + str(neither))
print("")
print("outcome                              count   client   server")
for o in outcomes:
    c = ""
    if o[2] == 1:
        c = c + "fail"
    else:
        c = c + "ok  "
    s = ""
    if o[3] == 1:
        s = s + "fail"
    else:
        s = s + "ok  "
    print("  " + o[0] + "   " + str(o[1]) + "     " + c + "     " + s)
print("")
if client_fail > 0:
    print("of the client's " + str(client_fail) + " failures, the server also recorded " + str(both))
    print("  which is " + str(int(both * 100 / client_fail)) + "%")
    print("  the other " + str(client_fail - both) + " have no server row that says anything went wrong")
print("")
print("what each team can say, truthfully")
print("  server team : our error rate is " + str(int(server_fail * 1000 / total)) + " per 1000, and it is")
print("  server team : we cannot reproduce the client's numbers")
print("  client team : our failure rate is " + str(int(client_fail * 1000 / total)) + " per 1000, and it is")
print("  client team : the server says these requests succeeded")
print("  both statements are correct and they are about different events")
print("")
if neither > 0:
    print("requests neither side counts as a failure : " + str(neither))
    for o in outcomes:
        if o[2] == 0:
            if o[3] == 0:
                print("  " + o[0] + " : " + str(o[1]))
    print("  a user who cancels after sending got no result, and no dashboard has a")
    print("  row that says so")
print("")
print("what a shared request id changes")
print("  new instrumentation on the server : none, it already logs per request")
print("  new instrumentation on the client : none, it already logs per request")
print("  what becomes possible : joining the two, which turns " + str(client_fail - both) + " unexplained")
print("  client failures into rows with a server side")
print("  the missing thing is not a measurement, it is a key")
print("")
print("how the disagreement is usually settled")
print("  the server's data is centralised, complete and queryable")
print("  the client's data is sampled, from devices, and arrives late")
print("  so the better-instrumented side wins the argument, and it is the side")
print("  with no row for " + str(client_fail - both) + " of the failures")
print("")
for o in outcomes:
    if o[2] == 1:
        if o[3] == 1:
            print("control - " + o[0] + ", " + str(o[1]) + " requests")
            print("  both sides record it, both counts agree, and neither team needs the")
            print("  other's data to see it")
print("")
print("Both dashboards are complete about their own side and neither is hiding")
print("anything. A request can end in a state only one side has a row for, and the")
print("argument is settled by whichever side has the better rows.")
```

## stdout (executed)

```text
requests in the window : 970
  failures on the client dashboard : 610
  failures on the server dashboard : 270
  counted as a failure by both     : 120
  counted by neither               : 210

outcome                              count   client   server
  server 500   120     fail     fail
  client timeout, server finished late   340     fail     ok  
  connection reset in transit   90     fail     ok  
  client cancelled after send   210     ok       ok  
  server 200, client parse error   60     fail     ok  
  server rejected, client retried and won   150     ok       fail

of the client's 610 failures, the server also recorded 120
  which is 19%
  the other 490 have no server row that says anything went wrong

what each team can say, truthfully
  server team : our error rate is 278 per 1000, and it is
  server team : we cannot reproduce the client's numbers
  client team : our failure rate is 628 per 1000, and it is
  client team : the server says these requests succeeded
  both statements are correct and they are about different events

requests neither side counts as a failure : 210
  client cancelled after send : 210
  a user who cancels after sending got no result, and no dashboard has a
  row that says so

what a shared request id changes
  new instrumentation on the server : none, it already logs per request
  new instrumentation on the client : none, it already logs per request
  what becomes possible : joining the two, which turns 490 unexplained
  client failures into rows with a server side
  the missing thing is not a measurement, it is a key

how the disagreement is usually settled
  the server's data is centralised, complete and queryable
  the client's data is sampled, from devices, and arrives late
  so the better-instrumented side wins the argument, and it is the side
  with no row for 490 of the failures

control - server 500, 120 requests
  both sides record it, both counts agree, and neither team needs the
  other's data to see it

Both dashboards are complete about their own side and neither is hiding
anything. A request can end in a state only one side has a row for, and the
argument is settled by whichever side has the better rows.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
