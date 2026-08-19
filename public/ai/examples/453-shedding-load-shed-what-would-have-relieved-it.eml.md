<!-- canonical: efficientnewlanguage.org/ai/examples/453-shedding-load-shed-what-would-have-relieved-it | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 453 — Shedding load shed what would have relieved it

`shedding_load_shed_what_would_have_relieved_it.eml` - Under overload the requests nobody is waiting on are refused first. What that does to the next interval is simulated rather than assumed.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Under overload
# the requests nobody is waiting on are refused first. What that does to the
# next interval is simulated rather than assumed.
#
# Shedding by who is waiting is the right ranking for the question it answers.
# Under overload something has to go, and dropping traffic no user is blocked
# on protects the traffic they are blocked on. Every load-shedding guide says
# this and it is correct about the interval it is applied in.
#
# Some of that traffic is what keeps the next interval cheap: the request that
# refills a cache, the drain that keeps a queue short, the probe that keeps a
# node in the pool. Refusing it saves load now and buys load later, and a
# ranking by who is waiting does not contain the later term.
#
# Both rankings are run over the same overload.

# [name, load it contributes, cost of refusing it now, load it adds to the NEXT interval if refused]
[["health probe", 2, 0, 14], ["cache refill", 6, 0, 22], ["queue drain", 8, 0, 18], ["report job", 12, 1, 0], ["user read", 14, 8, 0], ["user write", 10, 14, 0]] => kinds

len(kinds) => n
40 => capacity
6 => intervals

0 => base_load
for k in kinds:
    base_load + k[1] => base_load

# Returns [total offered across the run, worst interval, total user pain, sheds]
def run(order):
    0 => extra
    0 => total
    0 => peak
    0 => pain
    0 => sheds
    0 => t
    while t < intervals:
        base_load + extra => offered
        total + offered => total
        if offered > peak:
            offered => peak
        offered => remaining
        0 => next_extra
        0 => j
        while j < n:
            if remaining > capacity:
                order[j] => idx
                remaining - kinds[idx][1] => remaining
                pain + kinds[idx][2] => pain
                next_extra + kinds[idx][3] => next_extra
                sheds + 1 => sheds
            j + 1 => j
        next_extra => extra
        t + 1 => t
    return [total, peak, pain, sheds]

"request kinds : " + str(n) ^0
"offered load with nothing shed : " + str(base_load) ^0
"capacity : " + str(capacity) + ", so " + str(base_load - capacity) + " must go" ^0
"intervals : " + str(intervals) ^0
"" ^0

"request        load   cost of refusing   adds to the next interval" ^0
for k in kinds:
    "  " + k[0] + "   " + str(k[1]) + "      " + str(k[2]) + "                  " + str(k[3]) ^0
"" ^0

[0, 1, 2, 3, 4, 5] => by_waiting
[3, 4, 5, 2, 1, 0] => by_effect

run(by_waiting) => waiting
run(by_effect) => aware

"ranking                          offered over the run   worst interval   user pain   sheds" ^0
"  refuse what nobody waits on    " + str(waiting[0]) + "                 " + str(waiting[1]) + "             " + str(waiting[2]) + "           " + str(waiting[3]) ^0
"  refuse what costs least later  " + str(aware[0]) + "                  " + str(aware[1]) + "              " + str(aware[2]) + "           " + str(aware[3]) ^0
"" ^0

if waiting[0] > aware[0]:
    "shedding by who is waiting carried " + str(waiting[0] - aware[0]) + " more offered load across the run" ^0
    "  and its worst interval was " + str(waiting[1] - aware[1]) + " above the other's" ^0
elif waiting[0] == aware[0]:
    "the two rankings carried the same load" ^0
else:
    "shedding by later cost carried " + str(aware[0] - waiting[0]) + " more offered load" ^0
if aware[2] > waiting[2]:
    "it bought that at " + str(aware[2] - waiting[2]) + " user pain against " + str(waiting[2] + 0) + ", which is the trade" ^0
"" ^0

# ---- interval by interval, under the ranking by who is waiting ----

"offered load each interval, refusing what nobody waits on" ^0
0 => extra
0 => t
while t < intervals:
    base_load + extra => offered
    offered => remaining
    0 => next_extra
    "" => dropped
    0 => j
    while j < n:
        if remaining > capacity:
            by_waiting[j] => idx
            remaining - kinds[idx][1] => remaining
            next_extra + kinds[idx][3] => next_extra
            dropped + kinds[idx][0] + " " => dropped
        j + 1 => j
    t + 1 => t
    "  interval " + str(t) + " : offered " + str(offered) + ", shed " + dropped ^0
    next_extra => extra
"" ^0

"offered load each interval, refusing what costs least later" ^0
0 => extra2
0 => t2
while t2 < intervals:
    base_load + extra2 => offered
    offered => remaining
    0 => next_extra
    "" => dropped
    0 => j
    while j < n:
        if remaining > capacity:
            by_effect[j] => idx
            remaining - kinds[idx][1] => remaining
            next_extra + kinds[idx][3] => next_extra
            dropped + kinds[idx][0] + " " => dropped
        j + 1 => j
    t2 + 1 => t2
    "  interval " + str(t2) + " : offered " + str(offered) + ", shed " + dropped ^0
    next_extra => extra2
"" ^0

# ---- which requests carry a later term ----

0 => with_tail
0 => tail_total
0 => tail_load
0 => tail_pain
for k in kinds:
    if k[3] > 0:
        with_tail + 1 => with_tail
        tail_total + k[3] => tail_total
        tail_load + k[1] => tail_load
        tail_pain + k[2] => tail_pain
"requests whose refusal costs something later : " + str(with_tail) + " of " + str(n) ^0
"  load they occupy now      : " + str(tail_load) ^0
"  cost of refusing them now : " + str(tail_pain) ^0
"  load they add back later  : " + str(tail_total) ^0
if tail_total > tail_load:
    "  refusing all three frees " + str(tail_load) + " and returns " + str(tail_total) + ", a net loss of " + str(tail_total - tail_load) ^0
if tail_pain == 0:
    "  every one of them costs nothing to refuse, which is exactly why a" ^0
    "  ranking on who is waiting puts them first" ^0
"" ^0

# ---- the control: an overload with no later term ----
#
# Where refusing a request costs nothing later, the two rankings differ only
# in user pain and refusing the unwatched traffic is simply correct.

[["read a", 14, 8, 0], ["read b", 12, 6, 0], ["report", 20, 1, 0]] => flat_kinds
0 => f_tail
for k in flat_kinds:
    f_tail + k[3] => f_tail
"control - three request kinds, none with a later term" ^0
"  total later cost across all of them : " + str(f_tail) ^0
if f_tail == 0:
    "  with no later term, refusing the unwatched traffic is simply correct" ^0
    "  and this overload cannot separate the two rankings" ^0
"" ^0

"Refusing what nobody is waiting on is the right ranking for the interval it" ^0
"is computed in. Being unwatched is also what maintenance traffic looks like," ^0
"so the sort puts the next interval's cost at the top of the list." ^0
```

## Python (deterministic transpilation)

```python
kinds = [["health probe", 2, 0, 14], ["cache refill", 6, 0, 22], ["queue drain", 8, 0, 18], ["report job", 12, 1, 0], ["user read", 14, 8, 0], ["user write", 10, 14, 0]]
n = len(kinds)
capacity = 40
intervals = 6
base_load = 0
for k in kinds:
    base_load = base_load + k[1]

def run(order):
    extra = 0
    total = 0
    peak = 0
    pain = 0
    sheds = 0
    t = 0
    while t < intervals:
        offered = base_load + extra
        total = total + offered
        if offered > peak:
            peak = offered
        remaining = offered
        next_extra = 0
        j = 0
        while j < n:
            if remaining > capacity:
                idx = order[j]
                remaining = remaining - kinds[idx][1]
                pain = pain + kinds[idx][2]
                next_extra = next_extra + kinds[idx][3]
                sheds = sheds + 1
            j = j + 1
        extra = next_extra
        t = t + 1
    return [total, peak, pain, sheds]

print("request kinds : " + str(n))
print("offered load with nothing shed : " + str(base_load))
print("capacity : " + str(capacity) + ", so " + str(base_load - capacity) + " must go")
print("intervals : " + str(intervals))
print("")
print("request        load   cost of refusing   adds to the next interval")
for k in kinds:
    print("  " + k[0] + "   " + str(k[1]) + "      " + str(k[2]) + "                  " + str(k[3]))
print("")
by_waiting = [0, 1, 2, 3, 4, 5]
by_effect = [3, 4, 5, 2, 1, 0]
waiting = run(by_waiting)
aware = run(by_effect)
print("ranking                          offered over the run   worst interval   user pain   sheds")
print("  refuse what nobody waits on    " + str(waiting[0]) + "                 " + str(waiting[1]) + "             " + str(waiting[2]) + "           " + str(waiting[3]))
print("  refuse what costs least later  " + str(aware[0]) + "                  " + str(aware[1]) + "              " + str(aware[2]) + "           " + str(aware[3]))
print("")
if waiting[0] > aware[0]:
    print("shedding by who is waiting carried " + str(waiting[0] - aware[0]) + " more offered load across the run")
    print("  and its worst interval was " + str(waiting[1] - aware[1]) + " above the other's")
elif waiting[0] == aware[0]:
    print("the two rankings carried the same load")
else:
    print("shedding by later cost carried " + str(aware[0] - waiting[0]) + " more offered load")
if aware[2] > waiting[2]:
    print("it bought that at " + str(aware[2] - waiting[2]) + " user pain against " + str(waiting[2] + 0) + ", which is the trade")
print("")
print("offered load each interval, refusing what nobody waits on")
extra = 0
t = 0
while t < intervals:
    offered = base_load + extra
    remaining = offered
    next_extra = 0
    dropped = ""
    j = 0
    while j < n:
        if remaining > capacity:
            idx = by_waiting[j]
            remaining = remaining - kinds[idx][1]
            next_extra = next_extra + kinds[idx][3]
            dropped = dropped + kinds[idx][0] + " "
        j = j + 1
    t = t + 1
    print("  interval " + str(t) + " : offered " + str(offered) + ", shed " + dropped)
    extra = next_extra
print("")
print("offered load each interval, refusing what costs least later")
extra2 = 0
t2 = 0
while t2 < intervals:
    offered = base_load + extra2
    remaining = offered
    next_extra = 0
    dropped = ""
    j = 0
    while j < n:
        if remaining > capacity:
            idx = by_effect[j]
            remaining = remaining - kinds[idx][1]
            next_extra = next_extra + kinds[idx][3]
            dropped = dropped + kinds[idx][0] + " "
        j = j + 1
    t2 = t2 + 1
    print("  interval " + str(t2) + " : offered " + str(offered) + ", shed " + dropped)
    extra2 = next_extra
print("")
with_tail = 0
tail_total = 0
tail_load = 0
tail_pain = 0
for k in kinds:
    if k[3] > 0:
        with_tail = with_tail + 1
        tail_total = tail_total + k[3]
        tail_load = tail_load + k[1]
        tail_pain = tail_pain + k[2]
print("requests whose refusal costs something later : " + str(with_tail) + " of " + str(n))
print("  load they occupy now      : " + str(tail_load))
print("  cost of refusing them now : " + str(tail_pain))
print("  load they add back later  : " + str(tail_total))
if tail_total > tail_load:
    print("  refusing all three frees " + str(tail_load) + " and returns " + str(tail_total) + ", a net loss of " + str(tail_total - tail_load))
if tail_pain == 0:
    print("  every one of them costs nothing to refuse, which is exactly why a")
    print("  ranking on who is waiting puts them first")
print("")
flat_kinds = [["read a", 14, 8, 0], ["read b", 12, 6, 0], ["report", 20, 1, 0]]
f_tail = 0
for k in flat_kinds:
    f_tail = f_tail + k[3]
print("control - three request kinds, none with a later term")
print("  total later cost across all of them : " + str(f_tail))
if f_tail == 0:
    print("  with no later term, refusing the unwatched traffic is simply correct")
    print("  and this overload cannot separate the two rankings")
print("")
print("Refusing what nobody is waiting on is the right ranking for the interval it")
print("is computed in. Being unwatched is also what maintenance traffic looks like,")
print("so the sort puts the next interval's cost at the top of the list.")
```

## stdout (executed)

```text
request kinds : 6
offered load with nothing shed : 52
capacity : 40, so 12 must go
intervals : 6

request        load   cost of refusing   adds to the next interval
  health probe   2      0                  14
  cache refill   6      0                  22
  queue drain   8      0                  18
  report job   12      1                  0
  user read   14      8                  0
  user write   10      14                  0

ranking                          offered over the run   worst interval   user pain   sheds
  refuse what nobody waits on    582                 106             115           33
  refuse what costs least later  312                  52              6           6

shedding by who is waiting carried 270 more offered load across the run
  and its worst interval was 54 above the other's

offered load each interval, refusing what nobody waits on
  interval 1 : offered 52, shed health probe cache refill queue drain 
  interval 2 : offered 106, shed health probe cache refill queue drain report job user read user write 
  interval 3 : offered 106, shed health probe cache refill queue drain report job user read user write 
  interval 4 : offered 106, shed health probe cache refill queue drain report job user read user write 
  interval 5 : offered 106, shed health probe cache refill queue drain report job user read user write 
  interval 6 : offered 106, shed health probe cache refill queue drain report job user read user write 

offered load each interval, refusing what costs least later
  interval 1 : offered 52, shed report job 
  interval 2 : offered 52, shed report job 
  interval 3 : offered 52, shed report job 
  interval 4 : offered 52, shed report job 
  interval 5 : offered 52, shed report job 
  interval 6 : offered 52, shed report job 

requests whose refusal costs something later : 3 of 6
  load they occupy now      : 16
  cost of refusing them now : 0
  load they add back later  : 54
  refusing all three frees 16 and returns 54, a net loss of 38
  every one of them costs nothing to refuse, which is exactly why a
  ranking on who is waiting puts them first

control - three request kinds, none with a later term
  total later cost across all of them : 0
  with no later term, refusing the unwatched traffic is simply correct
  and this overload cannot separate the two rankings

Refusing what nobody is waiting on is the right ranking for the interval it
is computed in. Being unwatched is also what maintenance traffic looks like,
so the sort puts the next interval's cost at the top of the list.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
