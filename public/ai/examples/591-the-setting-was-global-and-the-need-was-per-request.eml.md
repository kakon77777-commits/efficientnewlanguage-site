<!-- canonical: efficientnewlanguage.org/ai/examples/591-the-setting-was-global-and-the-need-was-per-request | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 591 — The setting was global and the need was per request

`the_setting_was_global_and_the_need_was_per_request.eml` - A formatting library reads its decimal separator from a process-wide setting. Requests arrive from locales that use different ones. How many requests are formatting against someone else's setting is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A formatting
# library reads its decimal separator from a process-wide setting. Requests
# arrive from locales that use different ones. How many requests are formatting
# against someone else's setting is computed below.
#
# A process-wide setting is the library's design and it is a reasonable one for
# the world the library was written in. It was written for a desktop
# application: one process, one user, one locale, set once at startup and never
# touched again. In that world a global is simpler than threading a locale
# through every call, and simpler is better.
#
# The service adapts it correctly: set the separator from the request's locale,
# format, then restore it. Read as a sequence of three steps for one request,
# that is exactly right, and it is what a careful engineer writes.
#
# The process runs 32 requests at once. "Set, use, restore" is a sequence in one
# request's story and an interleaving in the process's. The setting has one
# value for all 32 threads, and the last writer decides it for everyone.

900 => requests_per_second
40 => mean_latency_ms
32 => worker_threads
18 => foreign_locale_percent
86400 => seconds_per_day

int(requests_per_second * mean_latency_ms / 1000) => concurrent
int(concurrent * foreign_locale_percent / 100) => concurrent_foreign

"requests per second   : " + str(requests_per_second) ^0
"mean latency          : " + str(mean_latency_ms) + " ms" ^0
"worker threads        : " + str(worker_threads) ^0
"requests from a non-default locale : " + str(foreign_locale_percent) + " percent" ^0
"" ^0

"  requests in flight at any instant : " + str(concurrent) ^0
"  of those, wanting a different separator : " + str(concurrent_foreign) ^0
"  separators the process can hold at once : 1" ^0
"" ^0
"  so at any instant " + str(concurrent_foreign) + " requests are formatting against a separator" ^0
"  that was set for a different request" ^0
"" ^0

# ---- the sequence, read two ways ----

"one request's view" ^0
"  1. set separator to this request's locale" ^0
"  2. format" ^0
"  3. restore the previous value" ^0
"  correct, and it restores rather than leaking - which is the careful part" ^0
"" ^0
"the process's view, two requests overlapping" ^0
"  A sets separator to comma" ^0
"  B sets separator to period" ^0
"  A formats, and reads period" ^0
"  A restores what it saw before it wrote, which is not what it wrote" ^0
"  B formats, and reads whatever A restored" ^0
"  neither request did anything wrong and both got the wrong answer" ^0
"" ^0

# ---- the restore makes it worse ----
#
# Restoring the PREVIOUS value is the right thing for a single thread and the
# wrong thing for several: the value it saw before writing belonged to another
# request, so the restore propagates that request's locale forward.

"what restore does under concurrency" ^0
"  single thread : puts back the process default, correctly" ^0
"  two threads   : puts back whatever the other thread had set" ^0
"  so a wrong value can outlive both requests that produced it" ^0
"  and the next request inherits it without any locale of its own" ^0
"" ^0

# ---- how much output is affected ----

requests_per_second * seconds_per_day => requests_per_day
int(requests_per_day * foreign_locale_percent / 100) => foreign_per_day

"  requests per day                    : " + str(requests_per_day) ^0
"  from a non-default locale           : " + str(foreign_per_day) ^0
"  requests whose formatting is decided by another request's setting :" ^0
"  all of them that overlap one, which at " + str(concurrent) + " in flight is effectively" ^0
"  every request in the system" ^0
"" ^0

# ---- what the tests saw ----
#
# Every test runs one request at a time. With one thread the sequence is a
# sequence, the restore is correct, and the code is right.

1 => test_threads
int(requests_per_second * mean_latency_ms / 1000) => prod_concurrent

"the test suite" ^0
"  threads in the test harness : " + str(test_threads) ^0
"  requests in flight          : " + str(test_threads) ^0
"  interleavings possible      : 0" ^0
"  tests covering the locale logic : 41, all passing" ^0
"  and none of them can fail, because the defect needs two requests" ^0
"" ^0
"  threads in production : " + str(worker_threads) ^0
"  requests in flight    : " + str(prod_concurrent) ^0
"" ^0

# ---- the control ----
#
# The set-use-restore code, read as one request. It is correct, it does not
# leak, and it is better than the version that forgets to restore. Reviewing it
# finds a careful implementation.

"control - is the per-request code correct" ^0
"  sets the right value for its locale : yes" ^0
"  formats after setting               : yes" ^0
"  restores afterwards                 : yes, which most such code omits" ^0
"  defects visible in one request      : 0" ^0
"  it is more careful than average, and the care is what propagates the" ^0
"  wrong value in step 3" ^0
"" ^0

# ---- the null control ----
#
# The same global, the same set-use-restore, on a process that handles one
# request at a time. Correct, forever. The library's design and the service's
# adaptation are both right; the mismatch is the concurrency.

1 => nc_concurrent
int(nc_concurrent * foreign_locale_percent / 100) => nc_affected

"null control - the same code in a single-request process" ^0
"  requests in flight       : " + str(nc_concurrent) ^0
"  requests reading another's setting : " + str(nc_affected) ^0
"  same library, same global, same three steps" ^0
"  the setting is per-process and the process serves one request, so" ^0
"  per-process and per-request are the same scope" ^0
"" ^0

# ---- the rule ----

"a setting's scope, against the scope of the thing that needs it" ^0
"  per-process setting, per-process need   fine" ^0
"  per-process setting, per-request need   wrong for every concurrent request" ^0
"  and the wrongness is invisible at a concurrency of one" ^0
"  which is the concurrency of every test" ^0
"" ^0
"save-set-restore does not create a critical section" ^0
"it creates a race with a longer window and a value that survives it" ^0
"" ^0

"A process-wide separator is right for the desktop application this library was" ^0
"written for, and set-use-restore is the careful way to adapt it - most such" ^0
"code forgets the restore. The process serves " + str(concurrent) + " requests at once against one" ^0
"separator, " + str(concurrent_foreign) + " of them wanting a different one at any instant, and the restore" ^0
"in step 3 puts back a value that belonged to whichever request happened to be" ^0
"running. All 41 locale tests pass at a concurrency of one." ^0
```

## Python (deterministic transpilation)

```python
requests_per_second = 900
mean_latency_ms = 40
worker_threads = 32
foreign_locale_percent = 18
seconds_per_day = 86400
concurrent = int(requests_per_second * mean_latency_ms / 1000)
concurrent_foreign = int(concurrent * foreign_locale_percent / 100)
print("requests per second   : " + str(requests_per_second))
print("mean latency          : " + str(mean_latency_ms) + " ms")
print("worker threads        : " + str(worker_threads))
print("requests from a non-default locale : " + str(foreign_locale_percent) + " percent")
print("")
print("  requests in flight at any instant : " + str(concurrent))
print("  of those, wanting a different separator : " + str(concurrent_foreign))
print("  separators the process can hold at once : 1")
print("")
print("  so at any instant " + str(concurrent_foreign) + " requests are formatting against a separator")
print("  that was set for a different request")
print("")
print("one request's view")
print("  1. set separator to this request's locale")
print("  2. format")
print("  3. restore the previous value")
print("  correct, and it restores rather than leaking - which is the careful part")
print("")
print("the process's view, two requests overlapping")
print("  A sets separator to comma")
print("  B sets separator to period")
print("  A formats, and reads period")
print("  A restores what it saw before it wrote, which is not what it wrote")
print("  B formats, and reads whatever A restored")
print("  neither request did anything wrong and both got the wrong answer")
print("")
print("what restore does under concurrency")
print("  single thread : puts back the process default, correctly")
print("  two threads   : puts back whatever the other thread had set")
print("  so a wrong value can outlive both requests that produced it")
print("  and the next request inherits it without any locale of its own")
print("")
requests_per_day = requests_per_second * seconds_per_day
foreign_per_day = int(requests_per_day * foreign_locale_percent / 100)
print("  requests per day                    : " + str(requests_per_day))
print("  from a non-default locale           : " + str(foreign_per_day))
print("  requests whose formatting is decided by another request's setting :")
print("  all of them that overlap one, which at " + str(concurrent) + " in flight is effectively")
print("  every request in the system")
print("")
test_threads = 1
prod_concurrent = int(requests_per_second * mean_latency_ms / 1000)
print("the test suite")
print("  threads in the test harness : " + str(test_threads))
print("  requests in flight          : " + str(test_threads))
print("  interleavings possible      : 0")
print("  tests covering the locale logic : 41, all passing")
print("  and none of them can fail, because the defect needs two requests")
print("")
print("  threads in production : " + str(worker_threads))
print("  requests in flight    : " + str(prod_concurrent))
print("")
print("control - is the per-request code correct")
print("  sets the right value for its locale : yes")
print("  formats after setting               : yes")
print("  restores afterwards                 : yes, which most such code omits")
print("  defects visible in one request      : 0")
print("  it is more careful than average, and the care is what propagates the")
print("  wrong value in step 3")
print("")
nc_concurrent = 1
nc_affected = int(nc_concurrent * foreign_locale_percent / 100)
print("null control - the same code in a single-request process")
print("  requests in flight       : " + str(nc_concurrent))
print("  requests reading another's setting : " + str(nc_affected))
print("  same library, same global, same three steps")
print("  the setting is per-process and the process serves one request, so")
print("  per-process and per-request are the same scope")
print("")
print("a setting's scope, against the scope of the thing that needs it")
print("  per-process setting, per-process need   fine")
print("  per-process setting, per-request need   wrong for every concurrent request")
print("  and the wrongness is invisible at a concurrency of one")
print("  which is the concurrency of every test")
print("")
print("save-set-restore does not create a critical section")
print("it creates a race with a longer window and a value that survives it")
print("")
print("A process-wide separator is right for the desktop application this library was")
print("written for, and set-use-restore is the careful way to adapt it - most such")
print("code forgets the restore. The process serves " + str(concurrent) + " requests at once against one")
print("separator, " + str(concurrent_foreign) + " of them wanting a different one at any instant, and the restore")
print("in step 3 puts back a value that belonged to whichever request happened to be")
print("running. All 41 locale tests pass at a concurrency of one.")
```

## stdout (executed)

```text
requests per second   : 900
mean latency          : 40 ms
worker threads        : 32
requests from a non-default locale : 18 percent

  requests in flight at any instant : 36
  of those, wanting a different separator : 6
  separators the process can hold at once : 1

  so at any instant 6 requests are formatting against a separator
  that was set for a different request

one request's view
  1. set separator to this request's locale
  2. format
  3. restore the previous value
  correct, and it restores rather than leaking - which is the careful part

the process's view, two requests overlapping
  A sets separator to comma
  B sets separator to period
  A formats, and reads period
  A restores what it saw before it wrote, which is not what it wrote
  B formats, and reads whatever A restored
  neither request did anything wrong and both got the wrong answer

what restore does under concurrency
  single thread : puts back the process default, correctly
  two threads   : puts back whatever the other thread had set
  so a wrong value can outlive both requests that produced it
  and the next request inherits it without any locale of its own

  requests per day                    : 77760000
  from a non-default locale           : 13996800
  requests whose formatting is decided by another request's setting :
  all of them that overlap one, which at 36 in flight is effectively
  every request in the system

the test suite
  threads in the test harness : 1
  requests in flight          : 1
  interleavings possible      : 0
  tests covering the locale logic : 41, all passing
  and none of them can fail, because the defect needs two requests

  threads in production : 32
  requests in flight    : 36

control - is the per-request code correct
  sets the right value for its locale : yes
  formats after setting               : yes
  restores afterwards                 : yes, which most such code omits
  defects visible in one request      : 0
  it is more careful than average, and the care is what propagates the
  wrong value in step 3

null control - the same code in a single-request process
  requests in flight       : 1
  requests reading another's setting : 0
  same library, same global, same three steps
  the setting is per-process and the process serves one request, so
  per-process and per-request are the same scope

a setting's scope, against the scope of the thing that needs it
  per-process setting, per-process need   fine
  per-process setting, per-request need   wrong for every concurrent request
  and the wrongness is invisible at a concurrency of one
  which is the concurrency of every test

save-set-restore does not create a critical section
it creates a race with a longer window and a value that survives it

A process-wide separator is right for the desktop application this library was
written for, and set-use-restore is the careful way to adapt it - most such
code forgets the restore. The process serves 36 requests at once against one
separator, 6 of them wanting a different one at any instant, and the restore
in step 3 puts back a value that belonged to whichever request happened to be
running. All 41 locale tests pass at a concurrency of one.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
