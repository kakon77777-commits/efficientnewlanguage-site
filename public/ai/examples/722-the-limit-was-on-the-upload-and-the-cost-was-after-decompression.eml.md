<!-- canonical: efficientnewlanguage.org/ai/examples/722-the-limit-was-on-the-upload-and-the-cost-was-after-decompression | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 722 — The limit was on the upload and the cost was after decompression

`the_limit_was_on_the_upload_and_the_cost_was_after_decompression.eml` - The upload limit is enforced at the edge while the body streams, so an oversized request is refused without being buffered. What the limit is a limit on is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The upload limit
# is enforced at the edge while the body streams, so an oversized request is
# refused without being buffered. What the limit is a limit on is computed
# below.
#
# The enforcement is done the right way round. The limit is applied to the
# stream rather than after the body is read, so a large upload costs the edge
# a counter and not a buffer; it returns a documented status with a message
# that says the actual limit rather than a generic error; it is applied before
# authentication so an unauthenticated caller cannot spend memory; and in two
# years nothing has got past it.
#
# The limit counts bytes that ARRIVE. The endpoint accepts gzip and the work is
# done on the decompressed content, so ten megabytes on the wire is bounded and
# what it expands to is not.
#
# Nothing in the request path bounds the decompressed size.

10 => upload_limit_mb
0 => bypasses_of_the_upload_limit
8 => typical_compression_ratio
1000 => achievable_compression_ratio
2048 => worker_memory_mb
240000 => requests_per_day
34 => worker_restarts_from_memory_exhaustion_last_month
0 => limits_on_decompressed_size

upload_limit_mb * typical_compression_ratio => typical_decompressed_mb
upload_limit_mb * achievable_compression_ratio => worst_case_decompressed_mb
int(upload_limit_mb * 10000 / worst_case_decompressed_mb) => bounded_share_per_myriad
int(worst_case_decompressed_mb / worker_memory_mb) => worst_case_as_multiples_of_worker_memory

"upload limit, MB                : " + str(upload_limit_mb) ^0
"bypasses in two years           : " + str(bypasses_of_the_upload_limit) ^0
"limits on decompressed size     : " + str(limits_on_decompressed_size) ^0
"" ^0
"typical compression ratio       : " + str(typical_compression_ratio) ^0
"  typical decompressed, MB      : " + str(typical_decompressed_mb) ^0
"achievable compression ratio    : " + str(achievable_compression_ratio) ^0
"  worst case decompressed, MB   : " + str(worst_case_decompressed_mb) ^0
"" ^0
"worker memory, MB               : " + str(worker_memory_mb) ^0
"  worst case as multiples of it : " + str(worst_case_as_multiples_of_worker_memory) ^0
"the enforced limit bounds       : " + str(bounded_share_per_myriad) + " per ten thousand of it" ^0
"" ^0
"requests per day                : " + str(requests_per_day) ^0
"worker restarts from memory exhaustion : " + str(worker_restarts_from_memory_exhaustion_last_month) ^0
"" ^0

# ---- what the enforcement verified ----

"the upload limit" ^0
"  applied to : the stream, while it arrives" ^0
"  cost of an oversized request : a counter, not a buffer" ^0
"  applied before authentication : yes, so an anonymous" ^0
"    caller cannot spend memory" ^0
"  the error : a documented status naming the real limit" ^0
"  bypasses in two years : " + str(bypasses_of_the_upload_limit) ^0
"  verdict : ENFORCED" ^0
"" ^0
"  counting the stream rather than the buffered body is the" ^0
"  difference between a limit and a slower way to run out" ^0
"  of memory, and this one counts the stream" ^0
"" ^0

# ---- what it counts ----

"the quantity bounded" ^0
"  what the counter measures : bytes received" ^0
"  what the handler allocates for : bytes after inflation" ^0
"  what relates the two : a ratio chosen by the sender" ^0
"  typical ratio : " + str(typical_compression_ratio) ^0
"  achievable ratio : " + str(achievable_compression_ratio) ^0
"  limits on the second quantity : " + str(limits_on_decompressed_size) ^0
"" ^0
"  the bounded quantity is real, is the one the network" ^0
"  cares about, and is not the one the process spends" ^0
"" ^0
# ---- who picks the ratio ----

# The ratio is not a property of the system; it is a property of the payload,
# and the payload comes from the caller. The limit is enforced against a
# quantity the caller does not choose, and the cost is set by one they do.
"the two quantities" ^0
"  bytes on the wire : bounded at " + str(upload_limit_mb) + " MB, by us" ^0
"  bytes after inflation : chosen by the sender" ^0
"  typical, MB       : " + str(typical_decompressed_mb) ^0
"  worst case, MB    : " + str(worst_case_decompressed_mb) ^0
"  worker memory, MB : " + str(worker_memory_mb) ^0
"  worst case in units of worker memory : " + str(worst_case_as_multiples_of_worker_memory) ^0
"" ^0

# ---- accepting gzip is right ----

# The endpoint accepts compressed bodies because clients upload text and the
# saving is large and real. Refusing compression would be a worse system. The
# decision that is missing is not whether to accept it but what to bound.
"accepting compression" ^0
"  why : the payloads are text and the saving is real" ^0
"  typical ratio seen : " + str(typical_compression_ratio) ^0
"  should the endpoint stop accepting it : no" ^0
"  what is missing : a bound on the second quantity" ^0
"  bounds that exist on it : " + str(limits_on_decompressed_size) ^0
"" ^0

# ---- what the restarts look like ----

# A worker that exhausts memory is killed and replaced, the request fails, the
# caller retries, and the restart is counted against capacity rather than
# against any request.
"the thirty-four restarts" ^0
"  attributed to : memory pressure, in the capacity" ^0
"    dashboard" ^0
"  attributed to a request : none; the process is gone" ^0
"    before it can log which one" ^0
"  what the upload limit metric shows : every request" ^0
"    under " + str(upload_limit_mb) + " MB, which is true" ^0
"  requests a day : " + str(requests_per_day) ^0
"  what a reader concludes : the service needs more memory" ^0
"" ^0

# ---- null control ----

# The same streaming enforcement, with the decompressor given a byte budget so
# it stops and errors rather than inflating past it.
worst_case_decompressed_mb => nc_worst_case_without_the_budget_mb
1 => nc_limits_on_decompressed_size
0 => nc_worker_restarts_from_memory_exhaustion

"null control - the decompressor has a budget too" ^0
"  bypasses of the upload limit : " + str(bypasses_of_the_upload_limit) + ", unchanged" ^0
"  limits on decompressed size : " + str(nc_limits_on_decompressed_size) ^0
"  worst case without it, MB : " + str(nc_worst_case_without_the_budget_mb) ^0
"  worker restarts from memory exhaustion : " + str(nc_worker_restarts_from_memory_exhaustion) ^0
"  the edge limit did not change; a second bound appeared" ^0
"  on the quantity that is actually spent" ^0
"" ^0

# ---- the rule ----

"what a streaming upload limit guarantees" ^0
"  no request body larger than the limit is read : exactly," ^0
"    without buffering, before authentication, for two" ^0
"    years" ^0
"  no request costs more than the limit : not addressed;" ^0
"    the limit is denominated in received bytes and the" ^0
"    work is denominated in something else" ^0
"" ^0
"a resource limit protects the resource it is denominated in;" ^0
"where a transformation sits between the measured quantity and" ^0
"the spent one, the caller chooses the exchange rate, and a" ^0
"limit on one side is a limit on one side" ^0
"" ^0

"The limit is enforced the right way round: on the stream rather than the" ^0
"buffered body, before authentication, returning a documented status naming the" ^0
"real limit, with " + str(bypasses_of_the_upload_limit) + " bypasses in two years. It counts received bytes, and the" ^0
"work happens after inflation at a ratio the sender picks, so " + str(upload_limit_mb) + " MB becomes" ^0
str(typical_decompressed_mb) + " MB typically and " + str(worst_case_decompressed_mb) + " at " + str(achievable_compression_ratio) + " to one - " + str(worst_case_as_multiples_of_worker_memory) + " times a worker's memory," ^0
"with the enforced bound covering " + str(bounded_share_per_myriad) + " per ten thousand of it." ^0
```

## Python (deterministic transpilation)

```python
upload_limit_mb = 10
bypasses_of_the_upload_limit = 0
typical_compression_ratio = 8
achievable_compression_ratio = 1000
worker_memory_mb = 2048
requests_per_day = 240000
worker_restarts_from_memory_exhaustion_last_month = 34
limits_on_decompressed_size = 0
typical_decompressed_mb = upload_limit_mb * typical_compression_ratio
worst_case_decompressed_mb = upload_limit_mb * achievable_compression_ratio
bounded_share_per_myriad = int(upload_limit_mb * 10000 / worst_case_decompressed_mb)
worst_case_as_multiples_of_worker_memory = int(worst_case_decompressed_mb / worker_memory_mb)
print("upload limit, MB                : " + str(upload_limit_mb))
print("bypasses in two years           : " + str(bypasses_of_the_upload_limit))
print("limits on decompressed size     : " + str(limits_on_decompressed_size))
print("")
print("typical compression ratio       : " + str(typical_compression_ratio))
print("  typical decompressed, MB      : " + str(typical_decompressed_mb))
print("achievable compression ratio    : " + str(achievable_compression_ratio))
print("  worst case decompressed, MB   : " + str(worst_case_decompressed_mb))
print("")
print("worker memory, MB               : " + str(worker_memory_mb))
print("  worst case as multiples of it : " + str(worst_case_as_multiples_of_worker_memory))
print("the enforced limit bounds       : " + str(bounded_share_per_myriad) + " per ten thousand of it")
print("")
print("requests per day                : " + str(requests_per_day))
print("worker restarts from memory exhaustion : " + str(worker_restarts_from_memory_exhaustion_last_month))
print("")
print("the upload limit")
print("  applied to : the stream, while it arrives")
print("  cost of an oversized request : a counter, not a buffer")
print("  applied before authentication : yes, so an anonymous")
print("    caller cannot spend memory")
print("  the error : a documented status naming the real limit")
print("  bypasses in two years : " + str(bypasses_of_the_upload_limit))
print("  verdict : ENFORCED")
print("")
print("  counting the stream rather than the buffered body is the")
print("  difference between a limit and a slower way to run out")
print("  of memory, and this one counts the stream")
print("")
print("the quantity bounded")
print("  what the counter measures : bytes received")
print("  what the handler allocates for : bytes after inflation")
print("  what relates the two : a ratio chosen by the sender")
print("  typical ratio : " + str(typical_compression_ratio))
print("  achievable ratio : " + str(achievable_compression_ratio))
print("  limits on the second quantity : " + str(limits_on_decompressed_size))
print("")
print("  the bounded quantity is real, is the one the network")
print("  cares about, and is not the one the process spends")
print("")
print("the two quantities")
print("  bytes on the wire : bounded at " + str(upload_limit_mb) + " MB, by us")
print("  bytes after inflation : chosen by the sender")
print("  typical, MB       : " + str(typical_decompressed_mb))
print("  worst case, MB    : " + str(worst_case_decompressed_mb))
print("  worker memory, MB : " + str(worker_memory_mb))
print("  worst case in units of worker memory : " + str(worst_case_as_multiples_of_worker_memory))
print("")
print("accepting compression")
print("  why : the payloads are text and the saving is real")
print("  typical ratio seen : " + str(typical_compression_ratio))
print("  should the endpoint stop accepting it : no")
print("  what is missing : a bound on the second quantity")
print("  bounds that exist on it : " + str(limits_on_decompressed_size))
print("")
print("the thirty-four restarts")
print("  attributed to : memory pressure, in the capacity")
print("    dashboard")
print("  attributed to a request : none; the process is gone")
print("    before it can log which one")
print("  what the upload limit metric shows : every request")
print("    under " + str(upload_limit_mb) + " MB, which is true")
print("  requests a day : " + str(requests_per_day))
print("  what a reader concludes : the service needs more memory")
print("")
nc_worst_case_without_the_budget_mb = worst_case_decompressed_mb
nc_limits_on_decompressed_size = 1
nc_worker_restarts_from_memory_exhaustion = 0
print("null control - the decompressor has a budget too")
print("  bypasses of the upload limit : " + str(bypasses_of_the_upload_limit) + ", unchanged")
print("  limits on decompressed size : " + str(nc_limits_on_decompressed_size))
print("  worst case without it, MB : " + str(nc_worst_case_without_the_budget_mb))
print("  worker restarts from memory exhaustion : " + str(nc_worker_restarts_from_memory_exhaustion))
print("  the edge limit did not change; a second bound appeared")
print("  on the quantity that is actually spent")
print("")
print("what a streaming upload limit guarantees")
print("  no request body larger than the limit is read : exactly,")
print("    without buffering, before authentication, for two")
print("    years")
print("  no request costs more than the limit : not addressed;")
print("    the limit is denominated in received bytes and the")
print("    work is denominated in something else")
print("")
print("a resource limit protects the resource it is denominated in;")
print("where a transformation sits between the measured quantity and")
print("the spent one, the caller chooses the exchange rate, and a")
print("limit on one side is a limit on one side")
print("")
print("The limit is enforced the right way round: on the stream rather than the")
print("buffered body, before authentication, returning a documented status naming the")
print("real limit, with " + str(bypasses_of_the_upload_limit) + " bypasses in two years. It counts received bytes, and the")
print("work happens after inflation at a ratio the sender picks, so " + str(upload_limit_mb) + " MB becomes")
print(str(typical_decompressed_mb) + " MB typically and " + str(worst_case_decompressed_mb) + " at " + str(achievable_compression_ratio) + " to one - " + str(worst_case_as_multiples_of_worker_memory) + " times a worker's memory,")
print("with the enforced bound covering " + str(bounded_share_per_myriad) + " per ten thousand of it.")
```

## stdout (executed)

```text
upload limit, MB                : 10
bypasses in two years           : 0
limits on decompressed size     : 0

typical compression ratio       : 8
  typical decompressed, MB      : 80
achievable compression ratio    : 1000
  worst case decompressed, MB   : 10000

worker memory, MB               : 2048
  worst case as multiples of it : 4
the enforced limit bounds       : 10 per ten thousand of it

requests per day                : 240000
worker restarts from memory exhaustion : 34

the upload limit
  applied to : the stream, while it arrives
  cost of an oversized request : a counter, not a buffer
  applied before authentication : yes, so an anonymous
    caller cannot spend memory
  the error : a documented status naming the real limit
  bypasses in two years : 0
  verdict : ENFORCED

  counting the stream rather than the buffered body is the
  difference between a limit and a slower way to run out
  of memory, and this one counts the stream

the quantity bounded
  what the counter measures : bytes received
  what the handler allocates for : bytes after inflation
  what relates the two : a ratio chosen by the sender
  typical ratio : 8
  achievable ratio : 1000
  limits on the second quantity : 0

  the bounded quantity is real, is the one the network
  cares about, and is not the one the process spends

the two quantities
  bytes on the wire : bounded at 10 MB, by us
  bytes after inflation : chosen by the sender
  typical, MB       : 80
  worst case, MB    : 10000
  worker memory, MB : 2048
  worst case in units of worker memory : 4

accepting compression
  why : the payloads are text and the saving is real
  typical ratio seen : 8
  should the endpoint stop accepting it : no
  what is missing : a bound on the second quantity
  bounds that exist on it : 0

the thirty-four restarts
  attributed to : memory pressure, in the capacity
    dashboard
  attributed to a request : none; the process is gone
    before it can log which one
  what the upload limit metric shows : every request
    under 10 MB, which is true
  requests a day : 240000
  what a reader concludes : the service needs more memory

null control - the decompressor has a budget too
  bypasses of the upload limit : 0, unchanged
  limits on decompressed size : 1
  worst case without it, MB : 10000
  worker restarts from memory exhaustion : 0
  the edge limit did not change; a second bound appeared
  on the quantity that is actually spent

what a streaming upload limit guarantees
  no request body larger than the limit is read : exactly,
    without buffering, before authentication, for two
    years
  no request costs more than the limit : not addressed;
    the limit is denominated in received bytes and the
    work is denominated in something else

a resource limit protects the resource it is denominated in;
where a transformation sits between the measured quantity and
the spent one, the caller chooses the exchange rate, and a
limit on one side is a limit on one side

The limit is enforced the right way round: on the stream rather than the
buffered body, before authentication, returning a documented status naming the
real limit, with 0 bypasses in two years. It counts received bytes, and the
work happens after inflation at a ratio the sender picks, so 10 MB becomes
80 MB typically and 10000 at 1000 to one - 4 times a worker's memory,
with the enforced bound covering 10 per ten thousand of it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
