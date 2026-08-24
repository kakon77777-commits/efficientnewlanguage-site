<!-- canonical: efficientnewlanguage.org/ai/examples/526-the-enum-grew-and-the-else-branch-absorbed-it | ai_layer_version: 0.1.0 | updated: 2026-08-24 -->

# Example 526 — The enum grew and the else branch absorbed it

`the_enum_grew_and_the_else_branch_absorbed_it.eml` - A status field gained three new values. The field name, the type and the wire format did not change. What each consumer now does with those values is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A status field
# gained three new values. The field name, the type and the wire format did not
# change. What each consumer now does with those values is computed below.
#
# Adding the values was right. The three new states describe real situations
# that were previously being crushed into "failed", and support could not tell
# a card decline from a network timeout from a fraud hold. Splitting them was
# asked for by the people who answer the phone.
#
# Every consumer that reads a status has an else branch, because that is what
# you write when you enumerate the cases you know. An else branch is a promise
# about values that do not exist yet, made by somebody who could not see them.
# The producer widened the range and each consumer's promise was kept exactly
# as written.
#
# Records are counted by value and by what each consumer does with them.

# [status value, records per day, age in releases, in the original enum]
[["settled", 812000, 40, "yes"], ["pending", 96000, 40, "yes"], ["failed", 21000, 40, "yes"], ["declined", 9400, 3, "no"], ["timed_out", 3100, 3, "no"], ["fraud_hold", 240, 3, "no"]] => values

len(values) => n
0 => total
0 => new_total
for v in values:
    total + v[1] => total
    if v[3] == "no":
        new_total + v[1] => new_total

"status value   records/day   releases old   in the original enum" ^0
for v in values:
    "  " + v[0] + "     " + str(v[1]) + "        " + str(v[2]) + "             " + v[3] ^0
"" ^0
"records a day          : " + str(total) ^0
"carrying a new value   : " + str(new_total) + ", " + str(int(new_total * 10000 / total)) + " per 10000" ^0
"" ^0

# ---- what each consumer's else branch does ----

# [consumer, updated for the new values, what its else branch does, records a day it reads]
[["ledger", "yes", "rejects unknown", 940000], ["support console", "yes", "shows the raw value", 12000], ["retry scheduler", "no", "treats it as pending and retries", 940000], ["weekly report", "no", "counts it as settled", 940000], ["fraud export", "no", "drops the row", 940000]] => consumers

"consumer            updated   else branch does" ^0
0 => updated
0 => stale
for c in consumers:
    if c[1] == "yes":
        updated + 1 => updated
    else:
        stale + 1 => stale
    "  " + c[0] + "     " + c[1] + "       " + c[2] ^0
"  updated : " + str(updated) + " of " + str(len(consumers)) ^0
"" ^0

# ---- what the stale consumers do with the new values ----

"the three new values, per stale consumer, per day" ^0
for c in consumers:
    if c[1] == "no":
        "  " + c[0] + " : " + str(new_total) + " records -> " + c[2] ^0
"  none of them errors, none of them logs, and none of them is wrong about" ^0
"  the values it was written for" ^0
"" ^0

# ---- the retry scheduler ----

for c in consumers:
    if c[0] == "retry scheduler":
        "the retry scheduler in detail" ^0
        "  it retries anything it reads as pending" ^0
        "  genuinely pending a day : " + str(values[1][1]) ^0
        "  new values it also retries : " + str(new_total) ^0
        "  so its retry volume rose by " + str(int(new_total * 100 / values[1][1])) + "%" ^0
        "  and a fraud_hold is a state that must not be retried, " + str(values[5][1]) + " a day" ^0
"" ^0

# ---- the weekly report ----

0 => reported_settled
for v in values:
    if v[0] == "settled":
        v[1] => reported_settled
"the weekly report" ^0
"  settled, truly            : " + str(reported_settled) ^0
"  settled, as reported      : " + str(reported_settled + new_total) ^0
"  overstatement             : " + str(new_total) + " a day, " + str(int(new_total * 10000 / reported_settled)) + " per 10000" ^0
"  the report has no error, no gap and no anomaly, and it is wrong by" ^0
"  exactly the volume of the new values" ^0
"" ^0

# ---- what changed and what did not ----

"the contract, before and after" ^0
"  field name   : status, unchanged" ^0
"  wire type    : string, unchanged" ^0
"  serialisation: unchanged" ^0
"  schema version : unchanged" ^0
"  set of values it can take : widened by " + str(n - 3) + " members" ^0
"  every automated compatibility check reads the first four lines" ^0
"" ^0

# ---- what would have caught it ----

"checks that would separate the two kinds of change" ^0
"  a declared value set, versioned with the field : does not exist" ^0
"  a consumer test asserting on an unknown value  : 0 across " + str(len(consumers)) + " consumers" ^0
"  a producer-side list of who reads this field   : does not exist" ^0
"  the widening is visible in the producer's own diff and invisible in" ^0
"  everything downstream of it" ^0
"" ^0

# ---- the control: a change that moves the type ----
#
# Where the same intent is expressed as a type change, every consumer fails to
# compile or fails to parse, and the breakage arrives at build time.

[["amount", "integer cents", "decimal string", 5]] => typed
for t in typed:
    "control - " + t[0] + " changed from " + t[1] + " to " + t[2] ^0
    "  consumers affected : " + str(t[3]) ^0
    "  consumers that failed loudly : " + str(t[3]) ^0
    "  consumers that silently continued : 0" ^0
    "  the same size of change to meaning, and the difference is whether the" ^0
    "  wire representation moved with it" ^0
"" ^0

"Splitting failed into three real states was asked for by the people who" ^0
"answer the phone, and it is a better contract. An else branch is a promise" ^0
"about values that did not exist, and " + str(stale) + " of " + str(len(consumers)) + " consumers kept theirs." ^0
```

## Python (deterministic transpilation)

```python
values = [["settled", 812000, 40, "yes"], ["pending", 96000, 40, "yes"], ["failed", 21000, 40, "yes"], ["declined", 9400, 3, "no"], ["timed_out", 3100, 3, "no"], ["fraud_hold", 240, 3, "no"]]
n = len(values)
total = 0
new_total = 0
for v in values:
    total = total + v[1]
    if v[3] == "no":
        new_total = new_total + v[1]
print("status value   records/day   releases old   in the original enum")
for v in values:
    print("  " + v[0] + "     " + str(v[1]) + "        " + str(v[2]) + "             " + v[3])
print("")
print("records a day          : " + str(total))
print("carrying a new value   : " + str(new_total) + ", " + str(int(new_total * 10000 / total)) + " per 10000")
print("")
consumers = [["ledger", "yes", "rejects unknown", 940000], ["support console", "yes", "shows the raw value", 12000], ["retry scheduler", "no", "treats it as pending and retries", 940000], ["weekly report", "no", "counts it as settled", 940000], ["fraud export", "no", "drops the row", 940000]]
print("consumer            updated   else branch does")
updated = 0
stale = 0
for c in consumers:
    if c[1] == "yes":
        updated = updated + 1
    else:
        stale = stale + 1
    print("  " + c[0] + "     " + c[1] + "       " + c[2])
print("  updated : " + str(updated) + " of " + str(len(consumers)))
print("")
print("the three new values, per stale consumer, per day")
for c in consumers:
    if c[1] == "no":
        print("  " + c[0] + " : " + str(new_total) + " records -> " + c[2])
print("  none of them errors, none of them logs, and none of them is wrong about")
print("  the values it was written for")
print("")
for c in consumers:
    if c[0] == "retry scheduler":
        print("the retry scheduler in detail")
        print("  it retries anything it reads as pending")
        print("  genuinely pending a day : " + str(values[1][1]))
        print("  new values it also retries : " + str(new_total))
        print("  so its retry volume rose by " + str(int(new_total * 100 / values[1][1])) + "%")
        print("  and a fraud_hold is a state that must not be retried, " + str(values[5][1]) + " a day")
print("")
reported_settled = 0
for v in values:
    if v[0] == "settled":
        reported_settled = v[1]
print("the weekly report")
print("  settled, truly            : " + str(reported_settled))
print("  settled, as reported      : " + str(reported_settled + new_total))
print("  overstatement             : " + str(new_total) + " a day, " + str(int(new_total * 10000 / reported_settled)) + " per 10000")
print("  the report has no error, no gap and no anomaly, and it is wrong by")
print("  exactly the volume of the new values")
print("")
print("the contract, before and after")
print("  field name   : status, unchanged")
print("  wire type    : string, unchanged")
print("  serialisation: unchanged")
print("  schema version : unchanged")
print("  set of values it can take : widened by " + str(n - 3) + " members")
print("  every automated compatibility check reads the first four lines")
print("")
print("checks that would separate the two kinds of change")
print("  a declared value set, versioned with the field : does not exist")
print("  a consumer test asserting on an unknown value  : 0 across " + str(len(consumers)) + " consumers")
print("  a producer-side list of who reads this field   : does not exist")
print("  the widening is visible in the producer's own diff and invisible in")
print("  everything downstream of it")
print("")
typed = [["amount", "integer cents", "decimal string", 5]]
for t in typed:
    print("control - " + t[0] + " changed from " + t[1] + " to " + t[2])
    print("  consumers affected : " + str(t[3]))
    print("  consumers that failed loudly : " + str(t[3]))
    print("  consumers that silently continued : 0")
    print("  the same size of change to meaning, and the difference is whether the")
    print("  wire representation moved with it")
print("")
print("Splitting failed into three real states was asked for by the people who")
print("answer the phone, and it is a better contract. An else branch is a promise")
print("about values that did not exist, and " + str(stale) + " of " + str(len(consumers)) + " consumers kept theirs.")
```

## stdout (executed)

```text
status value   records/day   releases old   in the original enum
  settled     812000        40             yes
  pending     96000        40             yes
  failed     21000        40             yes
  declined     9400        3             no
  timed_out     3100        3             no
  fraud_hold     240        3             no

records a day          : 941740
carrying a new value   : 12740, 135 per 10000

consumer            updated   else branch does
  ledger     yes       rejects unknown
  support console     yes       shows the raw value
  retry scheduler     no       treats it as pending and retries
  weekly report     no       counts it as settled
  fraud export     no       drops the row
  updated : 2 of 5

the three new values, per stale consumer, per day
  retry scheduler : 12740 records -> treats it as pending and retries
  weekly report : 12740 records -> counts it as settled
  fraud export : 12740 records -> drops the row
  none of them errors, none of them logs, and none of them is wrong about
  the values it was written for

the retry scheduler in detail
  it retries anything it reads as pending
  genuinely pending a day : 96000
  new values it also retries : 12740
  so its retry volume rose by 13%
  and a fraud_hold is a state that must not be retried, 240 a day

the weekly report
  settled, truly            : 812000
  settled, as reported      : 824740
  overstatement             : 12740 a day, 156 per 10000
  the report has no error, no gap and no anomaly, and it is wrong by
  exactly the volume of the new values

the contract, before and after
  field name   : status, unchanged
  wire type    : string, unchanged
  serialisation: unchanged
  schema version : unchanged
  set of values it can take : widened by 3 members
  every automated compatibility check reads the first four lines

checks that would separate the two kinds of change
  a declared value set, versioned with the field : does not exist
  a consumer test asserting on an unknown value  : 0 across 5 consumers
  a producer-side list of who reads this field   : does not exist
  the widening is visible in the producer's own diff and invisible in
  everything downstream of it

control - amount changed from integer cents to decimal string
  consumers affected : 5
  consumers that failed loudly : 5
  consumers that silently continued : 0
  the same size of change to meaning, and the difference is whether the
  wire representation moved with it

Splitting failed into three real states was asked for by the people who
answer the phone, and it is a better contract. An else branch is a promise
about values that did not exist, and 3 of 5 consumers kept theirs.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
