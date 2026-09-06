<!-- canonical: efficientnewlanguage.org/ai/examples/728-the-span-was-traced-and-the-async-boundary-lost-the-context | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 728 — The span was traced and the async boundary lost the context

`the_span_was_traced_and_the_async_boundary_lost_the_context.eml` - Every service is instrumented, trace context crosses every HTTP hop, errors are sampled at a hundred percent, and the traces have found real latency problems. What a trace covers is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every service is
# instrumented, trace context crosses every HTTP hop, errors are sampled at a
# hundred percent, and the traces have found real latency problems. What a
# trace covers is computed below.
#
# The tracing is properly deployed, which is rarer than having it at all. All
# forty-one services emit spans rather than the six that were easy; the context
# is propagated on every outbound HTTP call instead of each service starting
# its own; sampling is head-based at a low rate but forced to a hundred percent
# for anything that errors, so the interesting traces are complete; and the
# team has used it to find and fix real tail-latency problems.
#
# The context lives in a task-local and is carried by the HTTP client. Work
# handed to a background executor gets a fresh task, so its spans have no
# parent, and a span with no parent starts a new trace.
#
# Every request hands off twice.

41 => services
41 => services_emitting_spans
84000000 => spans_per_day
6400000 => root_spans_per_day
2900000 => root_spans_that_are_orphaned_handoffs
2 => handoffs_per_request_that_do_not_propagate
0 => metrics_on_whether_a_trace_covers_a_whole_request
0 => hops_where_http_context_is_dropped

services - services_emitting_spans => services_not_instrumented
root_spans_per_day - root_spans_that_are_orphaned_handoffs => traces_covering_a_whole_request
int(root_spans_that_are_orphaned_handoffs * 10000 / root_spans_per_day) => orphaned_per_myriad

"services                        : " + str(services) ^0
"  emitting spans                : " + str(services_emitting_spans) ^0
"  not instrumented              : " + str(services_not_instrumented) ^0
"HTTP hops dropping context      : " + str(hops_where_http_context_is_dropped) ^0
"" ^0
"spans per day                   : " + str(spans_per_day) ^0
"root spans per day              : " + str(root_spans_per_day) ^0
"  covering a whole request      : " + str(traces_covering_a_whole_request) ^0
"  orphaned handoffs             : " + str(root_spans_that_are_orphaned_handoffs) ^0
"  share                         : " + str(orphaned_per_myriad) + " per ten thousand" ^0
"" ^0
"handoffs per request that do not propagate : " + str(handoffs_per_request_that_do_not_propagate) ^0
"metrics on whole-request coverage : " + str(metrics_on_whether_a_trace_covers_a_whole_request) ^0
"" ^0

# ---- what the deployment verified ----

"the instrumentation" ^0
"  services emitting spans : " + str(services_emitting_spans) + " of " + str(services) ^0
"  context propagated on outbound HTTP : every call" ^0
"  hops that drop it : " + str(hops_where_http_context_is_dropped) ^0
"  sampling : head-based, forced to 100 percent on errors" ^0
"  used to find real latency problems : yes" ^0
"  verdict : PROPAGATED" ^0
"" ^0
"  instrumenting all " + str(services) + " rather than the easy ones is the" ^0
"  work most teams stop short of" ^0
"" ^0

# ---- where the context is carried ----

"the context" ^0
"  lives in : a task-local" ^0
"  crosses an HTTP call : yes, the client injects it" ^0
"  crosses a submit to a background executor : no; the" ^0
"    executor task is a new task with a new local" ^0
"  what the spans in that work do : start without a parent" ^0
"  what a span without a parent is : the root of a trace" ^0
"" ^0
"  the propagation is complete over the boundary it was" ^0
"  written for, and a process has more than one boundary" ^0
"" ^0
# ---- what an orphan looks like in the UI ----

# It is not a broken trace with a gap. It is a well-formed trace with a root
# span, children, timings and service names - a complete, valid, small trace of
# the second half of a request, and nothing marks it as a fragment.
"one orphaned trace" ^0
"  has a root span : yes" ^0
"  has children and timings : yes" ^0
"  is it malformed : no; it is a valid trace" ^0
"  what it is missing : a parent that exists in another" ^0
"    trace, which nothing records" ^0
"  how it reads in the UI : a fast request" ^0
"  how the request it came from reads : a fast request" ^0
"    that ends at the handoff" ^0
"" ^0

# ---- why the trace count looks healthy ----

# Every handoff manufactures a trace. The daily trace count is therefore higher
# than the request count, and higher looks like more coverage.
"the counts" ^0
"  root spans a day : " + str(root_spans_per_day) ^0
"  of those, whole requests : " + str(traces_covering_a_whole_request) ^0
"  of those, orphaned handoffs : " + str(root_spans_that_are_orphaned_handoffs) ^0
"  handoffs per request : " + str(handoffs_per_request_that_do_not_propagate) ^0
"  so the count is inflated by : the exact thing that" ^0
"    breaks the traces" ^0
"  metrics that would separate them : " + str(metrics_on_whether_a_trace_covers_a_whole_request) ^0
"" ^0

# ---- what the error sampling promises ----

# Errors are sampled at a hundred percent so that the traces that matter are
# complete. An error raised inside the handed-off work forces sampling for its
# own trace, which is the orphan.
"an error in the background work" ^0
"  sampled at 100 percent : yes, as designed" ^0
"  the trace kept : the orphan" ^0
"  the trace of the request that caused it : sampled at" ^0
"    the head rate, like any other" ^0
"  are the two linked : no; that is what the parent was" ^0
"  so the guarantee delivers : a complete trace of the" ^0
"    failing fragment" ^0
"" ^0

# ---- null control ----

# The same instrumentation, with the executor wrapped so it captures the
# submitting context and restores it in the worker task.
0 => nc_root_spans_that_are_orphaned_handoffs
traces_covering_a_whole_request => nc_root_spans_per_day

"null control - the executor carries the context across" ^0
"  services emitting spans : " + str(services_emitting_spans) + ", unchanged" ^0
"  orphaned handoffs : " + str(nc_root_spans_that_are_orphaned_handoffs) ^0
"  root spans a day : " + str(nc_root_spans_per_day) + ", down from " + str(root_spans_per_day) ^0
"  the tracing did not get worse; the count fell because" ^0
"  it stopped counting halves of requests as requests" ^0
"" ^0

# ---- the rule ----

"what propagated trace context guarantees" ^0
"  a request keeps its trace across a service boundary :" ^0
"    exactly, over " + str(services_emitting_spans) + " services and " + str(hops_where_http_context_is_dropped) + " dropped hops" ^0
"  a trace covers a request : not addressed; the context" ^0
"    is carried by the thing that crosses the boundary the" ^0
"    instrumentation knows about" ^0
"" ^0
"context propagation is implemented once per kind of" ^0
"boundary, so it is complete for the kinds someone" ^0
"enumerated; a break produces a valid trace rather than an" ^0
"error, and valid traces are what the coverage metric counts" ^0
"" ^0

"All " + str(services_emitting_spans) + " services emit spans, context crosses every HTTP hop with " + str(hops_where_http_context_is_dropped) + " drops," ^0
"and errors are sampled at 100 percent so the traces that matter are complete." ^0
"The context lives in a task-local that a background executor does not inherit," ^0
"and each request hands off " + str(handoffs_per_request_that_do_not_propagate) + " times, so " + str(root_spans_that_are_orphaned_handoffs) + " of " + str(root_spans_per_day) + " root spans a day -" ^0
str(orphaned_per_myriad) + " per ten thousand - are valid traces of half a request, counted as traces." ^0
```

## Python (deterministic transpilation)

```python
services = 41
services_emitting_spans = 41
spans_per_day = 84000000
root_spans_per_day = 6400000
root_spans_that_are_orphaned_handoffs = 2900000
handoffs_per_request_that_do_not_propagate = 2
metrics_on_whether_a_trace_covers_a_whole_request = 0
hops_where_http_context_is_dropped = 0
services_not_instrumented = services - services_emitting_spans
traces_covering_a_whole_request = root_spans_per_day - root_spans_that_are_orphaned_handoffs
orphaned_per_myriad = int(root_spans_that_are_orphaned_handoffs * 10000 / root_spans_per_day)
print("services                        : " + str(services))
print("  emitting spans                : " + str(services_emitting_spans))
print("  not instrumented              : " + str(services_not_instrumented))
print("HTTP hops dropping context      : " + str(hops_where_http_context_is_dropped))
print("")
print("spans per day                   : " + str(spans_per_day))
print("root spans per day              : " + str(root_spans_per_day))
print("  covering a whole request      : " + str(traces_covering_a_whole_request))
print("  orphaned handoffs             : " + str(root_spans_that_are_orphaned_handoffs))
print("  share                         : " + str(orphaned_per_myriad) + " per ten thousand")
print("")
print("handoffs per request that do not propagate : " + str(handoffs_per_request_that_do_not_propagate))
print("metrics on whole-request coverage : " + str(metrics_on_whether_a_trace_covers_a_whole_request))
print("")
print("the instrumentation")
print("  services emitting spans : " + str(services_emitting_spans) + " of " + str(services))
print("  context propagated on outbound HTTP : every call")
print("  hops that drop it : " + str(hops_where_http_context_is_dropped))
print("  sampling : head-based, forced to 100 percent on errors")
print("  used to find real latency problems : yes")
print("  verdict : PROPAGATED")
print("")
print("  instrumenting all " + str(services) + " rather than the easy ones is the")
print("  work most teams stop short of")
print("")
print("the context")
print("  lives in : a task-local")
print("  crosses an HTTP call : yes, the client injects it")
print("  crosses a submit to a background executor : no; the")
print("    executor task is a new task with a new local")
print("  what the spans in that work do : start without a parent")
print("  what a span without a parent is : the root of a trace")
print("")
print("  the propagation is complete over the boundary it was")
print("  written for, and a process has more than one boundary")
print("")
print("one orphaned trace")
print("  has a root span : yes")
print("  has children and timings : yes")
print("  is it malformed : no; it is a valid trace")
print("  what it is missing : a parent that exists in another")
print("    trace, which nothing records")
print("  how it reads in the UI : a fast request")
print("  how the request it came from reads : a fast request")
print("    that ends at the handoff")
print("")
print("the counts")
print("  root spans a day : " + str(root_spans_per_day))
print("  of those, whole requests : " + str(traces_covering_a_whole_request))
print("  of those, orphaned handoffs : " + str(root_spans_that_are_orphaned_handoffs))
print("  handoffs per request : " + str(handoffs_per_request_that_do_not_propagate))
print("  so the count is inflated by : the exact thing that")
print("    breaks the traces")
print("  metrics that would separate them : " + str(metrics_on_whether_a_trace_covers_a_whole_request))
print("")
print("an error in the background work")
print("  sampled at 100 percent : yes, as designed")
print("  the trace kept : the orphan")
print("  the trace of the request that caused it : sampled at")
print("    the head rate, like any other")
print("  are the two linked : no; that is what the parent was")
print("  so the guarantee delivers : a complete trace of the")
print("    failing fragment")
print("")
nc_root_spans_that_are_orphaned_handoffs = 0
nc_root_spans_per_day = traces_covering_a_whole_request
print("null control - the executor carries the context across")
print("  services emitting spans : " + str(services_emitting_spans) + ", unchanged")
print("  orphaned handoffs : " + str(nc_root_spans_that_are_orphaned_handoffs))
print("  root spans a day : " + str(nc_root_spans_per_day) + ", down from " + str(root_spans_per_day))
print("  the tracing did not get worse; the count fell because")
print("  it stopped counting halves of requests as requests")
print("")
print("what propagated trace context guarantees")
print("  a request keeps its trace across a service boundary :")
print("    exactly, over " + str(services_emitting_spans) + " services and " + str(hops_where_http_context_is_dropped) + " dropped hops")
print("  a trace covers a request : not addressed; the context")
print("    is carried by the thing that crosses the boundary the")
print("    instrumentation knows about")
print("")
print("context propagation is implemented once per kind of")
print("boundary, so it is complete for the kinds someone")
print("enumerated; a break produces a valid trace rather than an")
print("error, and valid traces are what the coverage metric counts")
print("")
print("All " + str(services_emitting_spans) + " services emit spans, context crosses every HTTP hop with " + str(hops_where_http_context_is_dropped) + " drops,")
print("and errors are sampled at 100 percent so the traces that matter are complete.")
print("The context lives in a task-local that a background executor does not inherit,")
print("and each request hands off " + str(handoffs_per_request_that_do_not_propagate) + " times, so " + str(root_spans_that_are_orphaned_handoffs) + " of " + str(root_spans_per_day) + " root spans a day -")
print(str(orphaned_per_myriad) + " per ten thousand - are valid traces of half a request, counted as traces.")
```

## stdout (executed)

```text
services                        : 41
  emitting spans                : 41
  not instrumented              : 0
HTTP hops dropping context      : 0

spans per day                   : 84000000
root spans per day              : 6400000
  covering a whole request      : 3500000
  orphaned handoffs             : 2900000
  share                         : 4531 per ten thousand

handoffs per request that do not propagate : 2
metrics on whole-request coverage : 0

the instrumentation
  services emitting spans : 41 of 41
  context propagated on outbound HTTP : every call
  hops that drop it : 0
  sampling : head-based, forced to 100 percent on errors
  used to find real latency problems : yes
  verdict : PROPAGATED

  instrumenting all 41 rather than the easy ones is the
  work most teams stop short of

the context
  lives in : a task-local
  crosses an HTTP call : yes, the client injects it
  crosses a submit to a background executor : no; the
    executor task is a new task with a new local
  what the spans in that work do : start without a parent
  what a span without a parent is : the root of a trace

  the propagation is complete over the boundary it was
  written for, and a process has more than one boundary

one orphaned trace
  has a root span : yes
  has children and timings : yes
  is it malformed : no; it is a valid trace
  what it is missing : a parent that exists in another
    trace, which nothing records
  how it reads in the UI : a fast request
  how the request it came from reads : a fast request
    that ends at the handoff

the counts
  root spans a day : 6400000
  of those, whole requests : 3500000
  of those, orphaned handoffs : 2900000
  handoffs per request : 2
  so the count is inflated by : the exact thing that
    breaks the traces
  metrics that would separate them : 0

an error in the background work
  sampled at 100 percent : yes, as designed
  the trace kept : the orphan
  the trace of the request that caused it : sampled at
    the head rate, like any other
  are the two linked : no; that is what the parent was
  so the guarantee delivers : a complete trace of the
    failing fragment

null control - the executor carries the context across
  services emitting spans : 41, unchanged
  orphaned handoffs : 0
  root spans a day : 3500000, down from 6400000
  the tracing did not get worse; the count fell because
  it stopped counting halves of requests as requests

what propagated trace context guarantees
  a request keeps its trace across a service boundary :
    exactly, over 41 services and 0 dropped hops
  a trace covers a request : not addressed; the context
    is carried by the thing that crosses the boundary the
    instrumentation knows about

context propagation is implemented once per kind of
boundary, so it is complete for the kinds someone
enumerated; a break produces a valid trace rather than an
error, and valid traces are what the coverage metric counts

All 41 services emit spans, context crosses every HTTP hop with 0 drops,
and errors are sampled at 100 percent so the traces that matter are complete.
The context lives in a task-local that a background executor does not inherit,
and each request hands off 2 times, so 2900000 of 6400000 root spans a day -
4531 per ten thousand - are valid traces of half a request, counted as traces.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
