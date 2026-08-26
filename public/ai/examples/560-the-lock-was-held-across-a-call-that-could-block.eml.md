<!-- canonical: efficientnewlanguage.org/ai/examples/560-the-lock-was-held-across-a-call-that-could-block | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 560 — The lock was held across a call that could block

`the_lock_was_held_across_a_call_that_could_block.eml` - A cache refresh is guarded by a mutex. The thread pool was raised from 8 to 32 and throughput did not move. What the pool size can and cannot change is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A cache refresh is
# guarded by a mutex. The thread pool was raised from 8 to 32 and throughput did
# not move. What the pool size can and cannot change is computed below.
#
# The lock is correct and its scope was chosen deliberately. The refresh reads
# the current entry, calls the upstream service for a new value, and writes the
# result back. Holding the lock across all three makes the whole operation
# atomic: no two threads can fetch the same key at once, so the upstream sees
# one request per key instead of thirty-two, and no thread can observe the entry
# half-updated. Narrowing the lock to just the write would reintroduce both
# problems. The wide lock is not laziness; it is the only scope that gives the
# guarantee that was wanted.
#
# Inside the critical section there is 1 ms of local work and a 40 ms network
# call. A mutex serialises everything it covers. So the covered region runs one
# at a time, at 41 ms each, and the number of threads waiting to enter it does
# not appear anywhere in that sentence.
#
# Throughput under a lock is one over the critical section duration. It is not
# a function of the pool size. Raising the pool raises the number of threads
# blocked on the mutex and nothing else.

1 => local_ms
40 => network_ms
1000 => ms_per_second

local_ms + network_ms => critical_section_ms

"critical section: " + str(local_ms) + " ms local + " + str(network_ms) + " ms network = " + str(critical_section_ms) + " ms" ^0
"" ^0

# ---- what the pool size buys ----

[["before", 8], ["after", 32], ["absurd", 512]] => pools

"pool     threads   throughput   threads waiting on the mutex" ^0
for p in pools:
    int(ms_per_second / critical_section_ms) => throughput
    p[1] - 1 => waiting
    "  " + p[0] + "     " + str(p[1]) + "         " + str(throughput) + "/s          " + str(waiting) ^0
"" ^0
"  throughput is " + str(int(ms_per_second / critical_section_ms)) + "/s in every row, including the row with 512 threads" ^0
"  the only column that responds to the pool size is the last one" ^0
"" ^0

# ---- the same lock, narrowed to the part that needs it ----
#
# Hold the lock for the local work only. The network call happens outside it.
# Now the serialised region is 1 ms, so the lock permits 1000/s, and the real
# limit becomes how many 41 ms operations the pool can have in flight at once.

"the lock narrowed to the local work" ^0
"pool     threads   lock permits   pool permits   throughput" ^0
for p in pools:
    int(ms_per_second / local_ms) => lock_limit
    int(p[1] * ms_per_second / critical_section_ms) => pool_limit
    if lock_limit < pool_limit:
        lock_limit => narrow_throughput
    else:
        pool_limit => narrow_throughput
    "  " + p[0] + "     " + str(p[1]) + "         " + str(lock_limit) + "/s        " + str(pool_limit) + "/s         " + str(narrow_throughput) + "/s" ^0
"" ^0

int(ms_per_second / critical_section_ms) => wide_throughput
int(32 * ms_per_second / critical_section_ms) => narrow_at_32

"  at 32 threads: " + str(wide_throughput) + "/s wide, " + str(narrow_at_32) + "/s narrow, a factor of " + str(int(narrow_at_32 / wide_throughput)) ^0
"  the factor is the thread count, exactly" ^0
"" ^0

# ---- what the narrow lock gives up ----
#
# The wide lock was not chosen by accident. Narrowing it means N threads can
# miss the same key at once and all call upstream. This is a real cost and it
# has to be paid somewhere.

32 => threads
"what the wide lock was buying, and what it costs to give up" ^0
"  wide lock  : upstream sees 1 request per key, throughput " + str(wide_throughput) + "/s" ^0
"  narrow lock: upstream sees up to " + str(threads) + " requests per key, throughput " + str(narrow_at_32) + "/s" ^0
"  the fix is not 'narrow the lock', it is 'keep the guarantee without the wait'" ^0
"  one per-key in-flight marker gives both: upstream still sees 1, and" ^0
"  threads on OTHER keys are not serialised behind this one" ^0
"" ^0

# ---- the control ----
#
# Single-threaded, the two designs are identical. Both do 1 ms of local work and
# one 40 ms call, one at a time. Every benchmark that ran one request at a time
# saw no difference, because at a concurrency of one there is no difference.

"control - the same two designs at a concurrency of one" ^0
"  wide lock, 1 thread  : " + str(int(ms_per_second / critical_section_ms)) + "/s" ^0
"  narrow lock, 1 thread: " + str(int(1 * ms_per_second / critical_section_ms)) + "/s" ^0
"  difference           : " + str(int(1 * ms_per_second / critical_section_ms) - int(ms_per_second / critical_section_ms)) + "/s" ^0
"  the defect is invisible to any test that does not run two threads" ^0
"" ^0

# ---- the null control ----
#
# The same wide lock with no network call inside it - all 41 ms is local work
# that the lock genuinely has to cover. Now the wide scope is not a defect,
# because there is nothing inside it that could have been left outside.

41 => all_local_ms
"null control - the same wide lock over 41 ms of work that is all local" ^0
"  critical section    : " + str(all_local_ms) + " ms, none of it a blocking call" ^0
"  wide lock, 32 threads : " + str(int(ms_per_second / all_local_ms)) + "/s" ^0
"  narrowest possible    : " + str(int(ms_per_second / all_local_ms)) + "/s" ^0
"  difference            : 0/s" ^0
"  the scope is identical and now costs nothing" ^0
"  so the rule is not 'wide locks are slow'" ^0
"  it is 'a lock costs the duration of what it covers, and a network call has" ^0
"  a duration nobody on your side controls'" ^0
"" ^0

# ---- the rule ----

"what raising a thread pool can move" ^0
"  work bounded by CPU          yes, up to the core count" ^0
"  work bounded by waiting      yes, that is what pools are for" ^0
"  work inside one mutex        no, at any pool size" ^0
"  the refresh path was the third kind and the pool was raised twice" ^0
"" ^0
"one over the critical section is a ceiling, and a ceiling does not care how" ^0
"many threads are underneath it" ^0
"" ^0

"Holding the lock across the whole refresh is what makes upstream see one" ^0
"request per key instead of " + str(threads) + ", and it is the only scope that gives that" ^0
"guarantee. It also puts a " + str(network_ms) + " ms network call inside a mutex, which fixes" ^0
"throughput at " + str(wide_throughput) + "/s. The pool went from 8 to " + str(threads) + " and then to 512, and the" ^0
"answer was " + str(wide_throughput) + "/s every time." ^0
```

## Python (deterministic transpilation)

```python
local_ms = 1
network_ms = 40
ms_per_second = 1000
critical_section_ms = local_ms + network_ms
print("critical section: " + str(local_ms) + " ms local + " + str(network_ms) + " ms network = " + str(critical_section_ms) + " ms")
print("")
pools = [["before", 8], ["after", 32], ["absurd", 512]]
print("pool     threads   throughput   threads waiting on the mutex")
for p in pools:
    throughput = int(ms_per_second / critical_section_ms)
    waiting = p[1] - 1
    print("  " + p[0] + "     " + str(p[1]) + "         " + str(throughput) + "/s          " + str(waiting))
print("")
print("  throughput is " + str(int(ms_per_second / critical_section_ms)) + "/s in every row, including the row with 512 threads")
print("  the only column that responds to the pool size is the last one")
print("")
print("the lock narrowed to the local work")
print("pool     threads   lock permits   pool permits   throughput")
for p in pools:
    lock_limit = int(ms_per_second / local_ms)
    pool_limit = int(p[1] * ms_per_second / critical_section_ms)
    if lock_limit < pool_limit:
        narrow_throughput = lock_limit
    else:
        narrow_throughput = pool_limit
    print("  " + p[0] + "     " + str(p[1]) + "         " + str(lock_limit) + "/s        " + str(pool_limit) + "/s         " + str(narrow_throughput) + "/s")
print("")
wide_throughput = int(ms_per_second / critical_section_ms)
narrow_at_32 = int(32 * ms_per_second / critical_section_ms)
print("  at 32 threads: " + str(wide_throughput) + "/s wide, " + str(narrow_at_32) + "/s narrow, a factor of " + str(int(narrow_at_32 / wide_throughput)))
print("  the factor is the thread count, exactly")
print("")
threads = 32
print("what the wide lock was buying, and what it costs to give up")
print("  wide lock  : upstream sees 1 request per key, throughput " + str(wide_throughput) + "/s")
print("  narrow lock: upstream sees up to " + str(threads) + " requests per key, throughput " + str(narrow_at_32) + "/s")
print("  the fix is not 'narrow the lock', it is 'keep the guarantee without the wait'")
print("  one per-key in-flight marker gives both: upstream still sees 1, and")
print("  threads on OTHER keys are not serialised behind this one")
print("")
print("control - the same two designs at a concurrency of one")
print("  wide lock, 1 thread  : " + str(int(ms_per_second / critical_section_ms)) + "/s")
print("  narrow lock, 1 thread: " + str(int(1 * ms_per_second / critical_section_ms)) + "/s")
print("  difference           : " + str(int(1 * ms_per_second / critical_section_ms) - int(ms_per_second / critical_section_ms)) + "/s")
print("  the defect is invisible to any test that does not run two threads")
print("")
all_local_ms = 41
print("null control - the same wide lock over 41 ms of work that is all local")
print("  critical section    : " + str(all_local_ms) + " ms, none of it a blocking call")
print("  wide lock, 32 threads : " + str(int(ms_per_second / all_local_ms)) + "/s")
print("  narrowest possible    : " + str(int(ms_per_second / all_local_ms)) + "/s")
print("  difference            : 0/s")
print("  the scope is identical and now costs nothing")
print("  so the rule is not 'wide locks are slow'")
print("  it is 'a lock costs the duration of what it covers, and a network call has")
print("  a duration nobody on your side controls'")
print("")
print("what raising a thread pool can move")
print("  work bounded by CPU          yes, up to the core count")
print("  work bounded by waiting      yes, that is what pools are for")
print("  work inside one mutex        no, at any pool size")
print("  the refresh path was the third kind and the pool was raised twice")
print("")
print("one over the critical section is a ceiling, and a ceiling does not care how")
print("many threads are underneath it")
print("")
print("Holding the lock across the whole refresh is what makes upstream see one")
print("request per key instead of " + str(threads) + ", and it is the only scope that gives that")
print("guarantee. It also puts a " + str(network_ms) + " ms network call inside a mutex, which fixes")
print("throughput at " + str(wide_throughput) + "/s. The pool went from 8 to " + str(threads) + " and then to 512, and the")
print("answer was " + str(wide_throughput) + "/s every time.")
```

## stdout (executed)

```text
critical section: 1 ms local + 40 ms network = 41 ms

pool     threads   throughput   threads waiting on the mutex
  before     8         24/s          7
  after     32         24/s          31
  absurd     512         24/s          511

  throughput is 24/s in every row, including the row with 512 threads
  the only column that responds to the pool size is the last one

the lock narrowed to the local work
pool     threads   lock permits   pool permits   throughput
  before     8         1000/s        195/s         195/s
  after     32         1000/s        780/s         780/s
  absurd     512         1000/s        12487/s         1000/s

  at 32 threads: 24/s wide, 780/s narrow, a factor of 32
  the factor is the thread count, exactly

what the wide lock was buying, and what it costs to give up
  wide lock  : upstream sees 1 request per key, throughput 24/s
  narrow lock: upstream sees up to 32 requests per key, throughput 780/s
  the fix is not 'narrow the lock', it is 'keep the guarantee without the wait'
  one per-key in-flight marker gives both: upstream still sees 1, and
  threads on OTHER keys are not serialised behind this one

control - the same two designs at a concurrency of one
  wide lock, 1 thread  : 24/s
  narrow lock, 1 thread: 24/s
  difference           : 0/s
  the defect is invisible to any test that does not run two threads

null control - the same wide lock over 41 ms of work that is all local
  critical section    : 41 ms, none of it a blocking call
  wide lock, 32 threads : 24/s
  narrowest possible    : 24/s
  difference            : 0/s
  the scope is identical and now costs nothing
  so the rule is not 'wide locks are slow'
  it is 'a lock costs the duration of what it covers, and a network call has
  a duration nobody on your side controls'

what raising a thread pool can move
  work bounded by CPU          yes, up to the core count
  work bounded by waiting      yes, that is what pools are for
  work inside one mutex        no, at any pool size
  the refresh path was the third kind and the pool was raised twice

one over the critical section is a ceiling, and a ceiling does not care how
many threads are underneath it

Holding the lock across the whole refresh is what makes upstream see one
request per key instead of 32, and it is the only scope that gives that
guarantee. It also puts a 40 ms network call inside a mutex, which fixes
throughput at 24/s. The pool went from 8 to 32 and then to 512, and the
answer was 24/s every time.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
