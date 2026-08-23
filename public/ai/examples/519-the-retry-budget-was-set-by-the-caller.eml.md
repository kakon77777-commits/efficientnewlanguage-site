<!-- canonical: efficientnewlanguage.org/ai/examples/519-the-retry-budget-was-set-by-the-caller | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 519 — The retry budget was set by the caller

`the_retry_budget_was_set_by_the_caller.eml` - Every caller configures its own retry count. What each caller pays and what each caller costs are computed below, and they are not the same number.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every caller
# configures its own retry count. What each caller pays and what each caller
# costs are computed below, and they are not the same number.
#
# Retrying is correct. A transient failure that succeeds on the second attempt
# is a request the user never saw fail, and every one of these teams picked
# their retry count after a real incident. Nobody here is careless and no
# single setting is wrong on its own.
#
# A retry is decided by the caller and executed against the callee. The caller
# watches its own error rate fall. The shared service watches its load rise.
# Those are the same event measured from two ends, and the two ends have
# different dashboards, different budgets and different on-call rotas.
#
# Both ends of every retry are counted below.

# [caller, retries configured, base requests per day, per-attempt failure percent]
[["checkout", 4, 120000, 2], ["search", 1, 900000, 2], ["reporting", 6, 8000, 2], ["mobile", 2, 400000, 2], ["admin", 0, 3000, 2]] => callers

len(callers) => n

def attempts(base, retries, pct):
    # each round retries only what failed in the previous round
    base => total
    base => failing
    if retries == 0:
        return base
    for i in [1:retries]:
        int(failing * pct / 100) => failing
        total + failing => total
    return total

def escapes(base, retries, pct):
    # requests that fail every attempt and reach the user as an error
    base => failing
    for i in [0:retries]:
        int(failing * pct / 100) => failing
    return failing

0 => base_total
0 => sent_total
for c in callers:
    base_total + c[2] => base_total
    sent_total + attempts(c[2], c[1], c[3]) => sent_total

"callers                       : " + str(n) ^0
"requests the users made       : " + str(base_total) ^0
"requests the service received : " + str(sent_total) ^0
"added by retries              : " + str(sent_total - base_total) ^0
"" ^0

"caller       retries   user requests   service receives   added" ^0
for c in callers:
    attempts(c[2], c[1], c[3]) => sent
    "  " + c[0] + "     " + str(c[1]) + "        " + str(c[2]) + "          " + str(sent) + "        " + str(sent - c[2]) ^0
"" ^0

# ---- what the caller sees ----

"errors that still reach the user, per day" ^0
for c in callers:
    "  " + c[0] + " : " + str(escapes(c[2], c[1], c[3])) + " of " + str(c[2]) ^0
"  each caller reports this number, and each one is correct" ^0
"" ^0

# ---- what the service sees ----

"load each caller adds to the shared service, per day" ^0
0 => worst_add
"" => worst_name
for c in callers:
    attempts(c[2], c[1], c[3]) - c[2] => added
    if added > worst_add:
        added => worst_add
        c[0] => worst_name
    "  " + c[0] + " : " + str(added) ^0
"  largest addition : " + worst_name + " at " + str(worst_add) ^0
"" ^0

# ---- the two rankings do not agree ----

0 => most_retries
"" => retry_name
for c in callers:
    if c[1] > most_retries:
        c[1] => most_retries
        c[0] => retry_name
"ranked two ways" ^0
"  most retries configured : " + retry_name + " at " + str(most_retries) ^0
"  most load added         : " + worst_name + " at " + str(worst_add) ^0
if not (retry_name == worst_name):
    "  different callers, so the retry setting alone does not find the cost" ^0
for c in callers:
    if c[0] == retry_name:
        "  " + retry_name + " adds " + str(attempts(c[2], c[1], c[3]) - c[2]) + ", because it is small" ^0
    if c[0] == worst_name:
        "  " + worst_name + " adds " + str(worst_add) + " on " + str(c[1]) + " retry, because it is large" ^0
"" ^0

# ---- what a shared retry budget would actually save ----

2 => cap
0 => capped_total
0 => changed
for c in callers:
    if c[1] > cap:
        capped_total + attempts(c[2], cap, c[3]) => capped_total
        changed + 1 => changed
    else:
        capped_total + attempts(c[2], c[1], c[3]) => capped_total

"capping every caller at " + str(cap) + " retries" ^0
"  callers whose setting changes : " + str(changed) + " of " + str(n) ^0
"  requests the service receives : " + str(sent_total) + " -> " + str(capped_total) ^0
"  saved                         : " + str(sent_total - capped_total) ^0
if sent_total - capped_total == 0:
    "  the cap saves nothing at all, because at " + str(callers[0][3]) + "% per attempt the third" ^0
    "  retry onward is already rounding to nothing" ^0
"" ^0

"where the added load actually is" ^0
0 => first_round
for c in callers:
    if c[1] > 0:
        first_round + int(c[2] * c[3] / 100) => first_round
"  requests added by the FIRST retry only : " + str(first_round) ^0
"  requests added by every retry          : " + str(sent_total - base_total) ^0
"  so the first retry is " + str(int(first_round * 100 / (sent_total - base_total))) + "% of the cost" ^0
"  and it is the one retry nobody would propose removing" ^0
"" ^0

# ---- the control: a caller that retries nothing ----
#
# Where a caller sets no retries, what it sends and what its users asked for
# are the same number, and there is nothing to attribute to anybody.

for c in callers:
    if c[1] == 0:
        "control - " + c[0] + ", " + str(c[1]) + " retries" ^0
        "  user requests : " + str(c[2]) + ", service receives : " + str(attempts(c[2], c[1], c[3])) ^0
        "  added : " + str(attempts(c[2], c[1], c[3]) - c[2]) ^0
        "  errors reaching its users : " + str(escapes(c[2], c[1], c[3])) ^0
        "  it imposes no load it did not receive, and its error rate is the" ^0
        "  untreated one" ^0
"" ^0

"Every retry setting here was chosen for a real incident and each one works." ^0
"A retry is decided at one end and paid at the other, so a caller's error" ^0
"rate and the service's load are one event with two owners." ^0
```

## Python (deterministic transpilation)

```python
callers = [["checkout", 4, 120000, 2], ["search", 1, 900000, 2], ["reporting", 6, 8000, 2], ["mobile", 2, 400000, 2], ["admin", 0, 3000, 2]]
n = len(callers)

def attempts(base, retries, pct):
    total = base
    failing = base
    if retries == 0:
        return base
    for i in range(1, retries+1):
        failing = int(failing * pct / 100)
        total = total + failing
    return total

def escapes(base, retries, pct):
    failing = base
    for i in range(0, retries+1):
        failing = int(failing * pct / 100)
    return failing

base_total = 0
sent_total = 0
for c in callers:
    base_total = base_total + c[2]
    sent_total = sent_total + attempts(c[2], c[1], c[3])
print("callers                       : " + str(n))
print("requests the users made       : " + str(base_total))
print("requests the service received : " + str(sent_total))
print("added by retries              : " + str(sent_total - base_total))
print("")
print("caller       retries   user requests   service receives   added")
for c in callers:
    sent = attempts(c[2], c[1], c[3])
    print("  " + c[0] + "     " + str(c[1]) + "        " + str(c[2]) + "          " + str(sent) + "        " + str(sent - c[2]))
print("")
print("errors that still reach the user, per day")
for c in callers:
    print("  " + c[0] + " : " + str(escapes(c[2], c[1], c[3])) + " of " + str(c[2]))
print("  each caller reports this number, and each one is correct")
print("")
print("load each caller adds to the shared service, per day")
worst_add = 0
worst_name = ""
for c in callers:
    added = attempts(c[2], c[1], c[3]) - c[2]
    if added > worst_add:
        worst_add = added
        worst_name = c[0]
    print("  " + c[0] + " : " + str(added))
print("  largest addition : " + worst_name + " at " + str(worst_add))
print("")
most_retries = 0
retry_name = ""
for c in callers:
    if c[1] > most_retries:
        most_retries = c[1]
        retry_name = c[0]
print("ranked two ways")
print("  most retries configured : " + retry_name + " at " + str(most_retries))
print("  most load added         : " + worst_name + " at " + str(worst_add))
if not retry_name == worst_name:
    print("  different callers, so the retry setting alone does not find the cost")
for c in callers:
    if c[0] == retry_name:
        print("  " + retry_name + " adds " + str(attempts(c[2], c[1], c[3]) - c[2]) + ", because it is small")
    if c[0] == worst_name:
        print("  " + worst_name + " adds " + str(worst_add) + " on " + str(c[1]) + " retry, because it is large")
print("")
cap = 2
capped_total = 0
changed = 0
for c in callers:
    if c[1] > cap:
        capped_total = capped_total + attempts(c[2], cap, c[3])
        changed = changed + 1
    else:
        capped_total = capped_total + attempts(c[2], c[1], c[3])
print("capping every caller at " + str(cap) + " retries")
print("  callers whose setting changes : " + str(changed) + " of " + str(n))
print("  requests the service receives : " + str(sent_total) + " -> " + str(capped_total))
print("  saved                         : " + str(sent_total - capped_total))
if sent_total - capped_total == 0:
    print("  the cap saves nothing at all, because at " + str(callers[0][3]) + "% per attempt the third")
    print("  retry onward is already rounding to nothing")
print("")
print("where the added load actually is")
first_round = 0
for c in callers:
    if c[1] > 0:
        first_round = first_round + int(c[2] * c[3] / 100)
print("  requests added by the FIRST retry only : " + str(first_round))
print("  requests added by every retry          : " + str(sent_total - base_total))
print("  so the first retry is " + str(int(first_round * 100 / (sent_total - base_total))) + "% of the cost")
print("  and it is the one retry nobody would propose removing")
print("")
for c in callers:
    if c[1] == 0:
        print("control - " + c[0] + ", " + str(c[1]) + " retries")
        print("  user requests : " + str(c[2]) + ", service receives : " + str(attempts(c[2], c[1], c[3])))
        print("  added : " + str(attempts(c[2], c[1], c[3]) - c[2]))
        print("  errors reaching its users : " + str(escapes(c[2], c[1], c[3])))
        print("  it imposes no load it did not receive, and its error rate is the")
        print("  untreated one")
print("")
print("Every retry setting here was chosen for a real incident and each one works.")
print("A retry is decided at one end and paid at the other, so a caller's error")
print("rate and the service's load are one event with two owners.")
```

## stdout (executed)

```text
callers                       : 5
requests the users made       : 1431000
requests the service received : 1459771
added by retries              : 28771

caller       retries   user requests   service receives   added
  checkout     4        120000          122448        2448
  search     1        900000          918000        18000
  reporting     6        8000          8163        163
  mobile     2        400000          408160        8160
  admin     0        3000          3000        0

errors that still reach the user, per day
  checkout : 0 of 120000
  search : 360 of 900000
  reporting : 0 of 8000
  mobile : 3 of 400000
  admin : 60 of 3000
  each caller reports this number, and each one is correct

load each caller adds to the shared service, per day
  checkout : 2448
  search : 18000
  reporting : 163
  mobile : 8160
  admin : 0
  largest addition : search at 18000

ranked two ways
  most retries configured : reporting at 6
  most load added         : search at 18000
  different callers, so the retry setting alone does not find the cost
  search adds 18000 on 1 retry, because it is large
  reporting adds 163, because it is small

capping every caller at 2 retries
  callers whose setting changes : 2 of 5
  requests the service receives : 1459771 -> 1459771
  saved                         : 0
  the cap saves nothing at all, because at 2% per attempt the third
  retry onward is already rounding to nothing

where the added load actually is
  requests added by the FIRST retry only : 28560
  requests added by every retry          : 28771
  so the first retry is 99% of the cost
  and it is the one retry nobody would propose removing

control - admin, 0 retries
  user requests : 3000, service receives : 3000
  added : 0
  errors reaching its users : 60
  it imposes no load it did not receive, and its error rate is the
  untreated one

Every retry setting here was chosen for a real incident and each one works.
A retry is decided at one end and paid at the other, so a caller's error
rate and the service's load are one event with two owners.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
