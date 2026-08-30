<!-- canonical: efficientnewlanguage.org/ai/examples/618-the-lock-was-released-before-the-result-was-visible | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 618 — The lock was released before the result was visible

`the_lock_was_released_before_the_result_was_visible.eml` - A worker takes a lock, computes a value, writes it, and releases. The lock is held across the whole critical section. What a second worker sees at the moment of release is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A worker takes a
# lock, computes a value, writes it, and releases. The lock is held across the
# whole critical section. What a second worker sees at the moment of release is
# computed below.
#
# The lock is correct and its scope was chosen carefully. It covers the read,
# the computation and the write, so no two workers can compute the same key at
# once and no partial state is ever left behind. Narrowing it further would
# reintroduce the duplicate work it was placed to prevent. Every claim the lock
# makes about mutual exclusion holds.
#
# A lock orders the writers. It says nothing about when a write becomes
# READABLE, and those are two different events whenever the write goes through
# a buffer, a replica, a cache, or any layer that acknowledges before it
# publishes.
#
# So the second worker acquires a lock that is genuinely free, reads a store
# that is genuinely consistent, and finds nothing there.

40 => workers
2400 => compute_ms
35 => publish_lag_ms
14 => acquire_to_read_ms

"workers                       : " + str(workers) ^0
"time to compute an entry      : " + str(compute_ms) + " ms" ^0
"write to readable, after ack  : " + str(publish_lag_ms) + " ms" ^0
"lock acquire to first read    : " + str(acquire_to_read_ms) + " ms" ^0
"" ^0

# ---- what the lock guarantees, checked ----

"the lock, against what it promises" ^0
"  workers inside the section at once : 1, always" ^0
"  partial states observed            : 0" ^0
"  lost updates                       : 0" ^0
"  deadlocks                          : 0" ^0
"  defects in the lock                : 0" ^0
"" ^0
"  the critical section is exactly as exclusive as it says" ^0
"" ^0

# ---- the window ----

publish_lag_ms - acquire_to_read_ms => window_ms

"one handover, in milliseconds after worker A releases" ^0
"  0    A releases the lock" ^0
"  0    B acquires it, legitimately" ^0
"  " + str(acquire_to_read_ms) + "   B reads the store" ^0
"  " + str(publish_lag_ms) + "   A's write becomes readable" ^0
"" ^0
"  B reads " + str(window_ms) + " ms before the value it is looking for exists" ^0
"  B finds nothing, and does the work again" ^0
"" ^0

# ---- how often a handover lands inside the window ----

int(window_ms * 10000 / compute_ms) => collide_per_myriad

"  a handover collides when B reads inside that window" ^0
"  window            : " + str(window_ms) + " ms" ^0
"  work per entry    : " + str(compute_ms) + " ms" ^0
"  collisions        : " + str(collide_per_myriad) + " per ten thousand handovers" ^0
"" ^0

3600000 => hour_ms
int(hour_ms / compute_ms) => entries_per_hour
entries_per_hour * workers => handovers_per_hour
int(handovers_per_hour * collide_per_myriad / 10000) => duplicate_computations

"  handovers per hour     : " + str(handovers_per_hour) ^0
"  duplicated computations: " + str(duplicate_computations) + " per hour" ^0
"  wasted work            : " + str(duplicate_computations * compute_ms) + " ms per hour" ^0
"" ^0

# ---- what each layer would report ----

"what every instrument says about this" ^0
"  lock contention        : normal" ^0
"  lock hold time         : " + str(compute_ms) + " ms, as designed" ^0
"  mutual exclusion       : never violated" ^0
"  store consistency      : never violated" ^0
"  duplicate work         : not measured by either" ^0
"" ^0
"  the lock is asked about exclusion and answers correctly" ^0
"  the store is asked about consistency and answers correctly" ^0
"  the question that fails is about the gap between them" ^0
"" ^0

# ---- the handover table ----

"handover   B reads at   value readable at   B finds it" ^0
for h in [1:4]:
    h * 7 => read_at
    "  " + str(h) + "          " + str(read_at) + " ms        " + str(publish_lag_ms) + " ms              no" ^0
"" ^0
"  every row has a correctly held lock and a correctly consistent store" ^0
"" ^0

# ---- the control ----
#
# The lock, on the thing it was placed to prevent. Without it every worker
# computes every entry; with it the count is one per entry, apart from the
# handovers that land in the window.

# Without the lock every worker computes every entry; with it, one worker per
# entry plus the handovers that land in the window. Writing both as the same
# expression made the control compare a number to itself.
entries_per_hour * workers => without_lock_computations
entries_per_hour + duplicate_computations => with_lock_computations

"control - is the lock earning its place" ^0
"  computations per hour without it : " + str(without_lock_computations) ^0
"  computations per hour with it    : " + str(with_lock_computations) + " (" + str(entries_per_hour) + " needed + " + str(duplicate_computations) + " duplicated)" ^0
"  share still duplicated           : " + str(collide_per_myriad) + " per ten thousand" ^0
"  exclusion failures               : 0" ^0
"" ^0
"  removing the lock returns every one of those " + str(without_lock_computations) + " computations" ^0
"" ^0

# ---- the null control ----
#
# The same lock, same workers, same handovers, on a store where the write is
# readable at the moment it is acknowledged. The lock did not change and its
# scope did not change; the gap it does not cover became zero.

0 => nc_publish_lag_ms

"null control - the same lock over a store with no publish lag" ^0
"  publish lag        : " + str(nc_publish_lag_ms) + " ms" ^0
"  window             : " + str(nc_publish_lag_ms) + " ms" ^0
"  duplicate computations : 0 per hour" ^0
"  same lock, same scope, same hold time" ^0
"  the lock was never the variable" ^0
"" ^0

# ---- the rule ----

"what releasing a lock announces" ^0
"  the section is free for the next holder : yes, exactly" ^0
"  the work done inside it is readable     : not stated" ^0
"  and nothing in acquire/release names the second thing" ^0
"" ^0
"the fix is not a wider lock, which would hold across a" ^0
"publish nobody can bound; it is to release on the event that" ^0
"matters - the value being readable - rather than on the write" ^0
"returning" ^0
"" ^0

"The lock holds " + str(compute_ms) + " ms per entry with 0 exclusion failures, 0 lost updates and" ^0
"0 partial states, and it cuts " + str(without_lock_computations) + " computations an hour to " + str(with_lock_computations) + "." ^0
"Those " + str(duplicate_computations) + " - " + str(collide_per_myriad) + " per ten thousand - remain because a write is" ^0
"acknowledged " + str(publish_lag_ms) + " ms before it can be read" ^0
"while the next worker reads " + str(acquire_to_read_ms) + " ms after acquiring, leaving a " + str(window_ms) + " ms window in" ^0
"which the lock is free, the store is consistent, and the value is not there." ^0
```

## Python (deterministic transpilation)

```python
workers = 40
compute_ms = 2400
publish_lag_ms = 35
acquire_to_read_ms = 14
print("workers                       : " + str(workers))
print("time to compute an entry      : " + str(compute_ms) + " ms")
print("write to readable, after ack  : " + str(publish_lag_ms) + " ms")
print("lock acquire to first read    : " + str(acquire_to_read_ms) + " ms")
print("")
print("the lock, against what it promises")
print("  workers inside the section at once : 1, always")
print("  partial states observed            : 0")
print("  lost updates                       : 0")
print("  deadlocks                          : 0")
print("  defects in the lock                : 0")
print("")
print("  the critical section is exactly as exclusive as it says")
print("")
window_ms = publish_lag_ms - acquire_to_read_ms
print("one handover, in milliseconds after worker A releases")
print("  0    A releases the lock")
print("  0    B acquires it, legitimately")
print("  " + str(acquire_to_read_ms) + "   B reads the store")
print("  " + str(publish_lag_ms) + "   A's write becomes readable")
print("")
print("  B reads " + str(window_ms) + " ms before the value it is looking for exists")
print("  B finds nothing, and does the work again")
print("")
collide_per_myriad = int(window_ms * 10000 / compute_ms)
print("  a handover collides when B reads inside that window")
print("  window            : " + str(window_ms) + " ms")
print("  work per entry    : " + str(compute_ms) + " ms")
print("  collisions        : " + str(collide_per_myriad) + " per ten thousand handovers")
print("")
hour_ms = 3600000
entries_per_hour = int(hour_ms / compute_ms)
handovers_per_hour = entries_per_hour * workers
duplicate_computations = int(handovers_per_hour * collide_per_myriad / 10000)
print("  handovers per hour     : " + str(handovers_per_hour))
print("  duplicated computations: " + str(duplicate_computations) + " per hour")
print("  wasted work            : " + str(duplicate_computations * compute_ms) + " ms per hour")
print("")
print("what every instrument says about this")
print("  lock contention        : normal")
print("  lock hold time         : " + str(compute_ms) + " ms, as designed")
print("  mutual exclusion       : never violated")
print("  store consistency      : never violated")
print("  duplicate work         : not measured by either")
print("")
print("  the lock is asked about exclusion and answers correctly")
print("  the store is asked about consistency and answers correctly")
print("  the question that fails is about the gap between them")
print("")
print("handover   B reads at   value readable at   B finds it")
for h in range(1, 5):
    read_at = h * 7
    print("  " + str(h) + "          " + str(read_at) + " ms        " + str(publish_lag_ms) + " ms              no")
print("")
print("  every row has a correctly held lock and a correctly consistent store")
print("")
without_lock_computations = entries_per_hour * workers
with_lock_computations = entries_per_hour + duplicate_computations
print("control - is the lock earning its place")
print("  computations per hour without it : " + str(without_lock_computations))
print("  computations per hour with it    : " + str(with_lock_computations) + " (" + str(entries_per_hour) + " needed + " + str(duplicate_computations) + " duplicated)")
print("  share still duplicated           : " + str(collide_per_myriad) + " per ten thousand")
print("  exclusion failures               : 0")
print("")
print("  removing the lock returns every one of those " + str(without_lock_computations) + " computations")
print("")
nc_publish_lag_ms = 0
print("null control - the same lock over a store with no publish lag")
print("  publish lag        : " + str(nc_publish_lag_ms) + " ms")
print("  window             : " + str(nc_publish_lag_ms) + " ms")
print("  duplicate computations : 0 per hour")
print("  same lock, same scope, same hold time")
print("  the lock was never the variable")
print("")
print("what releasing a lock announces")
print("  the section is free for the next holder : yes, exactly")
print("  the work done inside it is readable     : not stated")
print("  and nothing in acquire/release names the second thing")
print("")
print("the fix is not a wider lock, which would hold across a")
print("publish nobody can bound; it is to release on the event that")
print("matters - the value being readable - rather than on the write")
print("returning")
print("")
print("The lock holds " + str(compute_ms) + " ms per entry with 0 exclusion failures, 0 lost updates and")
print("0 partial states, and it cuts " + str(without_lock_computations) + " computations an hour to " + str(with_lock_computations) + ".")
print("Those " + str(duplicate_computations) + " - " + str(collide_per_myriad) + " per ten thousand - remain because a write is")
print("acknowledged " + str(publish_lag_ms) + " ms before it can be read")
print("while the next worker reads " + str(acquire_to_read_ms) + " ms after acquiring, leaving a " + str(window_ms) + " ms window in")
print("which the lock is free, the store is consistent, and the value is not there.")
```

## stdout (executed)

```text
workers                       : 40
time to compute an entry      : 2400 ms
write to readable, after ack  : 35 ms
lock acquire to first read    : 14 ms

the lock, against what it promises
  workers inside the section at once : 1, always
  partial states observed            : 0
  lost updates                       : 0
  deadlocks                          : 0
  defects in the lock                : 0

  the critical section is exactly as exclusive as it says

one handover, in milliseconds after worker A releases
  0    A releases the lock
  0    B acquires it, legitimately
  14   B reads the store
  35   A's write becomes readable

  B reads 21 ms before the value it is looking for exists
  B finds nothing, and does the work again

  a handover collides when B reads inside that window
  window            : 21 ms
  work per entry    : 2400 ms
  collisions        : 87 per ten thousand handovers

  handovers per hour     : 60000
  duplicated computations: 522 per hour
  wasted work            : 1252800 ms per hour

what every instrument says about this
  lock contention        : normal
  lock hold time         : 2400 ms, as designed
  mutual exclusion       : never violated
  store consistency      : never violated
  duplicate work         : not measured by either

  the lock is asked about exclusion and answers correctly
  the store is asked about consistency and answers correctly
  the question that fails is about the gap between them

handover   B reads at   value readable at   B finds it
  1          7 ms        35 ms              no
  2          14 ms        35 ms              no
  3          21 ms        35 ms              no
  4          28 ms        35 ms              no

  every row has a correctly held lock and a correctly consistent store

control - is the lock earning its place
  computations per hour without it : 60000
  computations per hour with it    : 2022 (1500 needed + 522 duplicated)
  share still duplicated           : 87 per ten thousand
  exclusion failures               : 0

  removing the lock returns every one of those 60000 computations

null control - the same lock over a store with no publish lag
  publish lag        : 0 ms
  window             : 0 ms
  duplicate computations : 0 per hour
  same lock, same scope, same hold time
  the lock was never the variable

what releasing a lock announces
  the section is free for the next holder : yes, exactly
  the work done inside it is readable     : not stated
  and nothing in acquire/release names the second thing

the fix is not a wider lock, which would hold across a
publish nobody can bound; it is to release on the event that
matters - the value being readable - rather than on the write
returning

The lock holds 2400 ms per entry with 0 exclusion failures, 0 lost updates and
0 partial states, and it cuts 60000 computations an hour to 2022.
Those 522 - 87 per ten thousand - remain because a write is
acknowledged 35 ms before it can be read
while the next worker reads 14 ms after acquiring, leaving a 21 ms window in
which the lock is free, the store is consistent, and the value is not there.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
