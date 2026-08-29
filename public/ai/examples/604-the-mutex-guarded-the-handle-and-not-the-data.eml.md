<!-- canonical: efficientnewlanguage.org/ai/examples/604-the-mutex-guarded-the-handle-and-not-the-data | ai_layer_version: 0.1.0 | updated: 2026-08-29 -->

# Example 604 — The mutex guarded the handle and not the data

`the_mutex_guarded_the_handle_and_not_the_data.eml` - A cache maps keys to entry handles, and a mutex guards the map. Thirty-two threads run against it without a crash, without a corrupt map, and without a single lost entry. What the mutex is protecting is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A cache maps keys
# to entry handles, and a mutex guards the map. Thirty-two threads run against
# it without a crash, without a corrupt map, and without a single lost entry.
# What the mutex is protecting is computed below.
#
# The lock is correct and its scope was chosen with care. It covers every
# operation on the container: insert, lookup, evict, resize. That is the part
# of the structure the standard library documents as unsafe to share, and it is
# the part that produces a segfault rather than a wrong number when it is
# wrong. Nobody has argued the lock should be wider, and the reason is good:
# holding it across the work would serialise the pool.
#
# A handle is a name for a thing, not the thing. Two threads can take the same
# handle out of the map, entirely correctly, entirely under the lock, and then
# both hold a way to reach one object that nothing is guarding.
#
# The map never breaks. Its invariants are the ones being enforced.

32 => threads
500 => increments_per_thread
418 => collisions_per_thousand

threads * increments_per_thread => increments_issued
int(increments_issued * collisions_per_thousand / 1000) => increments_lost
increments_issued - increments_lost => counter_final

"threads                 : " + str(threads) ^0
"increments per thread   : " + str(increments_per_thread) ^0
"increments issued       : " + str(increments_issued) ^0
"" ^0

# ---- what the lock is measured on ----

increments_issued => map_operations

"the map, under the lock" ^0
"  operations performed  : " + str(map_operations) ^0
"  corrupt map states    : 0" ^0
"  crashes               : 0" ^0
"  entries lost or torn  : 0" ^0
"  lookups returning the wrong handle : 0" ^0
"" ^0
"  every invariant the mutex was placed to protect held, " + str(map_operations) + " times" ^0
"" ^0

"the object each handle points at" ^0
"  read-modify-write cycles issued : " + str(increments_issued) ^0
"  cycles that overlapped another  : " + str(increments_lost) ^0
"  updates visible at the end      : " + str(counter_final) ^0
"  updates lost                    : " + str(increments_lost) ^0
"" ^0

# ---- the sequence, two threads, one handle ----

"step                                   thread A   thread B" ^0
"  lock the map                           held        -" ^0
"  look up the key                        ok          -" ^0
"  unlock the map                         -           -" ^0
"  lock the map                           -          held" ^0
"  look up the key                        -           ok" ^0
"  unlock the map                         -           -" ^0
"  read the value through the handle      n           n" ^0
"  add one                                n+1         n+1" ^0
"  write it back                          n+1         n+1" ^0
"" ^0
"  every lock operation above is correct and every one is honoured" ^0
"  the two rows that collide are the three that never take the lock" ^0
"" ^0

# ---- what each side would have to measure to see it ----

"who can see the lost update" ^0
"  the mutex            : no, it was never asked about the value" ^0
"  the map's invariants : no, they are all intact" ^0
"  a data race detector : only if it watches the pointed-at object" ^0
"  the final count      : yes, and only by comparing it to " + str(increments_issued) ^0
"" ^0
"  expected : " + str(increments_issued) ^0
"  observed : " + str(counter_final) ^0
"  the gap  : " + str(increments_lost) ^0
"" ^0

# ---- the control ----
#
# The mutex, against the thing it was placed to do. It has been asked to keep
# the container consistent under thirty-two threads, and it has, without one
# exception, for every operation.

"control - is the mutex doing its job" ^0
"  container operations : " + str(map_operations) ^0
"  container failures   : 0" ^0
"  lock ordering bugs   : 0" ^0
"  deadlocks            : 0" ^0
"  defects in the lock  : 0" ^0
"" ^0
"  widening the lock to cover the work would fix the count and" ^0
"  serialise the pool, which is the tradeoff it was placed to avoid" ^0
"" ^0

# ---- the null control ----
#
# The same map, the same mutex, the same thirty-two threads, when the entry is
# immutable and an update replaces the handle instead of mutating through it.
# Now the only shared thing is the map, and the map is what the lock guards.

0 => nc_increments_lost
increments_issued - nc_increments_lost => nc_counter_final

"null control - the same lock over immutable entries" ^0
"  increments issued : " + str(increments_issued) ^0
"  updates lost      : " + str(nc_increments_lost) ^0
"  final count       : " + str(nc_counter_final) ^0
"  same mutex, same scope, same threads, same map" ^0
"  the lock did not become correct; the data moved inside it" ^0
"" ^0

# ---- the rule ----

"what a lock's scope actually names" ^0
"  the region of code it covers      : stated, and enforced" ^0
"  the memory that region touches    : not stated anywhere" ^0
"  a handle carries reachability out of the region for free" ^0
"  and nothing in the type or the lock records that it did" ^0
"" ^0
"the question is not whether the critical section is correct" ^0
"it is which bytes are still reachable after it ends" ^0
"" ^0

"The mutex handled " + str(map_operations) + " container operations with 0 failures, 0 deadlocks" ^0
"and 0 lock-ordering bugs, which is the entire job it was given. Of the" ^0
str(increments_issued) + " read-modify-write cycles run through the handles it hands out," ^0
str(increments_lost) + " were lost, leaving " + str(counter_final) + ", because the three steps that touch the" ^0
"value are the three that hold no lock at all." ^0
```

## Python (deterministic transpilation)

```python
threads = 32
increments_per_thread = 500
collisions_per_thousand = 418
increments_issued = threads * increments_per_thread
increments_lost = int(increments_issued * collisions_per_thousand / 1000)
counter_final = increments_issued - increments_lost
print("threads                 : " + str(threads))
print("increments per thread   : " + str(increments_per_thread))
print("increments issued       : " + str(increments_issued))
print("")
map_operations = increments_issued
print("the map, under the lock")
print("  operations performed  : " + str(map_operations))
print("  corrupt map states    : 0")
print("  crashes               : 0")
print("  entries lost or torn  : 0")
print("  lookups returning the wrong handle : 0")
print("")
print("  every invariant the mutex was placed to protect held, " + str(map_operations) + " times")
print("")
print("the object each handle points at")
print("  read-modify-write cycles issued : " + str(increments_issued))
print("  cycles that overlapped another  : " + str(increments_lost))
print("  updates visible at the end      : " + str(counter_final))
print("  updates lost                    : " + str(increments_lost))
print("")
print("step                                   thread A   thread B")
print("  lock the map                           held        -")
print("  look up the key                        ok          -")
print("  unlock the map                         -           -")
print("  lock the map                           -          held")
print("  look up the key                        -           ok")
print("  unlock the map                         -           -")
print("  read the value through the handle      n           n")
print("  add one                                n+1         n+1")
print("  write it back                          n+1         n+1")
print("")
print("  every lock operation above is correct and every one is honoured")
print("  the two rows that collide are the three that never take the lock")
print("")
print("who can see the lost update")
print("  the mutex            : no, it was never asked about the value")
print("  the map's invariants : no, they are all intact")
print("  a data race detector : only if it watches the pointed-at object")
print("  the final count      : yes, and only by comparing it to " + str(increments_issued))
print("")
print("  expected : " + str(increments_issued))
print("  observed : " + str(counter_final))
print("  the gap  : " + str(increments_lost))
print("")
print("control - is the mutex doing its job")
print("  container operations : " + str(map_operations))
print("  container failures   : 0")
print("  lock ordering bugs   : 0")
print("  deadlocks            : 0")
print("  defects in the lock  : 0")
print("")
print("  widening the lock to cover the work would fix the count and")
print("  serialise the pool, which is the tradeoff it was placed to avoid")
print("")
nc_increments_lost = 0
nc_counter_final = increments_issued - nc_increments_lost
print("null control - the same lock over immutable entries")
print("  increments issued : " + str(increments_issued))
print("  updates lost      : " + str(nc_increments_lost))
print("  final count       : " + str(nc_counter_final))
print("  same mutex, same scope, same threads, same map")
print("  the lock did not become correct; the data moved inside it")
print("")
print("what a lock's scope actually names")
print("  the region of code it covers      : stated, and enforced")
print("  the memory that region touches    : not stated anywhere")
print("  a handle carries reachability out of the region for free")
print("  and nothing in the type or the lock records that it did")
print("")
print("the question is not whether the critical section is correct")
print("it is which bytes are still reachable after it ends")
print("")
print("The mutex handled " + str(map_operations) + " container operations with 0 failures, 0 deadlocks")
print("and 0 lock-ordering bugs, which is the entire job it was given. Of the")
print(str(increments_issued) + " read-modify-write cycles run through the handles it hands out,")
print(str(increments_lost) + " were lost, leaving " + str(counter_final) + ", because the three steps that touch the")
print("value are the three that hold no lock at all.")
```

## stdout (executed)

```text
threads                 : 32
increments per thread   : 500
increments issued       : 16000

the map, under the lock
  operations performed  : 16000
  corrupt map states    : 0
  crashes               : 0
  entries lost or torn  : 0
  lookups returning the wrong handle : 0

  every invariant the mutex was placed to protect held, 16000 times

the object each handle points at
  read-modify-write cycles issued : 16000
  cycles that overlapped another  : 6688
  updates visible at the end      : 9312
  updates lost                    : 6688

step                                   thread A   thread B
  lock the map                           held        -
  look up the key                        ok          -
  unlock the map                         -           -
  lock the map                           -          held
  look up the key                        -           ok
  unlock the map                         -           -
  read the value through the handle      n           n
  add one                                n+1         n+1
  write it back                          n+1         n+1

  every lock operation above is correct and every one is honoured
  the two rows that collide are the three that never take the lock

who can see the lost update
  the mutex            : no, it was never asked about the value
  the map's invariants : no, they are all intact
  a data race detector : only if it watches the pointed-at object
  the final count      : yes, and only by comparing it to 16000

  expected : 16000
  observed : 9312
  the gap  : 6688

control - is the mutex doing its job
  container operations : 16000
  container failures   : 0
  lock ordering bugs   : 0
  deadlocks            : 0
  defects in the lock  : 0

  widening the lock to cover the work would fix the count and
  serialise the pool, which is the tradeoff it was placed to avoid

null control - the same lock over immutable entries
  increments issued : 16000
  updates lost      : 0
  final count       : 16000
  same mutex, same scope, same threads, same map
  the lock did not become correct; the data moved inside it

what a lock's scope actually names
  the region of code it covers      : stated, and enforced
  the memory that region touches    : not stated anywhere
  a handle carries reachability out of the region for free
  and nothing in the type or the lock records that it did

the question is not whether the critical section is correct
it is which bytes are still reachable after it ends

The mutex handled 16000 container operations with 0 failures, 0 deadlocks
and 0 lock-ordering bugs, which is the entire job it was given. Of the
16000 read-modify-write cycles run through the handles it hands out,
6688 were lost, leaving 9312, because the three steps that touch the
value are the three that hold no lock at all.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
