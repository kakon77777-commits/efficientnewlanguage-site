<!-- canonical: efficientnewlanguage.org/ai/examples/680-the-log-had-the-request-id-and-the-worker-did-not | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 680 — The log had the request id and the worker did not

`the_log_had_the_request_id_and_the_worker_did_not.eml` - Every log line in the request path carries a correlation id and tracing across four services works. What share of the work is traceable is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every log line in
# the request path carries a correlation id and tracing across four services
# works. What share of the work is traceable is computed below.
#
# The correlation is properly built. The id is generated at the edge, propagated
# in a header, put into a context that every logger reads without being asked,
# and it survives four service hops. Pasting one id into the log search returns
# the whole request, in order, across all four. It was a real piece of work and
# it pays for itself weekly.
#
# It propagates along the CALL. The asynchronous half is not a call: the handler
# enqueues a job with the payload it needs, and the enqueue was written against
# a job schema that has fields for the work and none for the context.
#
# Sixty-one percent of the processing time is in that worker.

4200000 => requests_per_day
7 => log_lines_per_request_in_the_service
11 => log_lines_per_request_in_the_worker
6100 => worker_share_of_processing_time_per_myriad
4 => services_the_id_survives

log_lines_per_request_in_the_service + log_lines_per_request_in_the_worker => log_lines_per_request
int(log_lines_per_request_in_the_worker * 10000 / log_lines_per_request) => untraceable_per_myriad
requests_per_day * log_lines_per_request_in_the_worker => untraceable_lines_per_day

"requests per day               : " + str(requests_per_day) ^0
"services the id survives       : " + str(services_the_id_survives) ^0
"" ^0
"log lines per request, service : " + str(log_lines_per_request_in_the_service) ^0
"log lines per request, worker  : " + str(log_lines_per_request_in_the_worker) ^0
"share with no correlation id   : " + str(untraceable_per_myriad) + " per ten thousand" ^0
"untraceable lines per day      : " + str(untraceable_lines_per_day) ^0
"worker share of processing time: " + str(worker_share_of_processing_time_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the correlation gives ----

"the request path" ^0
"  id generated at    : the edge" ^0
"  propagated in      : a header" ^0
"  read by every logger : yes, from context, without being" ^0
"    asked" ^0
"  services it survives : " + str(services_the_id_survives) ^0
"  one id pasted into search returns : the whole request," ^0
"    in order, across all four" ^0
"  verdict            : CORRELATED" ^0
"" ^0
"  this pays for itself weekly and nobody should undo it" ^0
"" ^0

# ---- where it stops ----

"the enqueue" ^0
"  what the job carries : the payload the work needs" ^0
"  fields for context   : none in the job schema" ^0
"  a header to propagate: there is no request to put one on" ^0
"  the worker's logger  : reads a context that is empty" ^0
"    because this process did not handle a request" ^0
"" ^0
"  nothing was dropped; the mechanism is a call-scoped one" ^0
"  and this is not a call" ^0
"" ^0

# ---- what an investigation can and cannot do ----

# The failure being investigated is in the worker. The request that caused it
# is findable only by matching on the payload, which is not indexed and is not
# unique.
"investigating a worker failure" ^0
"  the worker's own lines    : present, complete, timestamped" ^0
"  which request caused it   : not recorded" ^0
"  matching on the payload   : possible, unindexed, and not" ^0
"    unique" ^0
"  the service's lines for that request : present, and not" ^0
"    linkable to these" ^0
"" ^0

# ---- null control ----

# The same correlation, with the id added to the job schema and read into the
# worker's context at dequeue.
0 => nc_untraceable_lines_per_day
log_lines_per_request => nc_traceable_lines_per_request

"null control - the id carried in the job" ^0
"  services the id survives : " + str(services_the_id_survives) + ", unchanged" ^0
"  traceable lines per request : " + str(nc_traceable_lines_per_request) ^0
"  untraceable lines per day   : " + str(nc_untraceable_lines_per_day) ^0
"  the propagation did not improve; the job schema gained" ^0
"  a field for the thing that was already being propagated" ^0
"  everywhere else" ^0
"" ^0

# ---- the rule ----

"what request correlation guarantees" ^0
"  everything on the call path shares an id : exactly" ^0
"  everything caused by the request does    : not addressed;" ^0
"    the mechanism is scoped to a call, and the work that" ^0
"    was moved off the call to make it fast is precisely" ^0
"    what leaves that scope" ^0
"" ^0
"context propagation follows the shape of the control flow;" ^0
"the moment work becomes asynchronous it needs the context as" ^0
"data, and a job schema written for the work has no field" ^0
"for it" ^0
"" ^0

"Correlation works across all " + str(services_the_id_survives) + " services and one id returns the whole request in" ^0
"order, which is real and earns its keep. The worker is reached by an enqueue" ^0
"rather than a call, so its " + str(log_lines_per_request_in_the_worker) + " lines a request carry no id - " + str(untraceable_per_myriad) + " per ten" ^0
"thousand of the lines and " + str(untraceable_lines_per_day) + " a day - covering the " + str(worker_share_of_processing_time_per_myriad) + " per ten thousand" ^0
"of processing time where the failures being investigated actually happen." ^0
```

## Python (deterministic transpilation)

```python
requests_per_day = 4200000
log_lines_per_request_in_the_service = 7
log_lines_per_request_in_the_worker = 11
worker_share_of_processing_time_per_myriad = 6100
services_the_id_survives = 4
log_lines_per_request = log_lines_per_request_in_the_service + log_lines_per_request_in_the_worker
untraceable_per_myriad = int(log_lines_per_request_in_the_worker * 10000 / log_lines_per_request)
untraceable_lines_per_day = requests_per_day * log_lines_per_request_in_the_worker
print("requests per day               : " + str(requests_per_day))
print("services the id survives       : " + str(services_the_id_survives))
print("")
print("log lines per request, service : " + str(log_lines_per_request_in_the_service))
print("log lines per request, worker  : " + str(log_lines_per_request_in_the_worker))
print("share with no correlation id   : " + str(untraceable_per_myriad) + " per ten thousand")
print("untraceable lines per day      : " + str(untraceable_lines_per_day))
print("worker share of processing time: " + str(worker_share_of_processing_time_per_myriad) + " per ten thousand")
print("")
print("the request path")
print("  id generated at    : the edge")
print("  propagated in      : a header")
print("  read by every logger : yes, from context, without being")
print("    asked")
print("  services it survives : " + str(services_the_id_survives))
print("  one id pasted into search returns : the whole request,")
print("    in order, across all four")
print("  verdict            : CORRELATED")
print("")
print("  this pays for itself weekly and nobody should undo it")
print("")
print("the enqueue")
print("  what the job carries : the payload the work needs")
print("  fields for context   : none in the job schema")
print("  a header to propagate: there is no request to put one on")
print("  the worker's logger  : reads a context that is empty")
print("    because this process did not handle a request")
print("")
print("  nothing was dropped; the mechanism is a call-scoped one")
print("  and this is not a call")
print("")
print("investigating a worker failure")
print("  the worker's own lines    : present, complete, timestamped")
print("  which request caused it   : not recorded")
print("  matching on the payload   : possible, unindexed, and not")
print("    unique")
print("  the service's lines for that request : present, and not")
print("    linkable to these")
print("")
nc_untraceable_lines_per_day = 0
nc_traceable_lines_per_request = log_lines_per_request
print("null control - the id carried in the job")
print("  services the id survives : " + str(services_the_id_survives) + ", unchanged")
print("  traceable lines per request : " + str(nc_traceable_lines_per_request))
print("  untraceable lines per day   : " + str(nc_untraceable_lines_per_day))
print("  the propagation did not improve; the job schema gained")
print("  a field for the thing that was already being propagated")
print("  everywhere else")
print("")
print("what request correlation guarantees")
print("  everything on the call path shares an id : exactly")
print("  everything caused by the request does    : not addressed;")
print("    the mechanism is scoped to a call, and the work that")
print("    was moved off the call to make it fast is precisely")
print("    what leaves that scope")
print("")
print("context propagation follows the shape of the control flow;")
print("the moment work becomes asynchronous it needs the context as")
print("data, and a job schema written for the work has no field")
print("for it")
print("")
print("Correlation works across all " + str(services_the_id_survives) + " services and one id returns the whole request in")
print("order, which is real and earns its keep. The worker is reached by an enqueue")
print("rather than a call, so its " + str(log_lines_per_request_in_the_worker) + " lines a request carry no id - " + str(untraceable_per_myriad) + " per ten")
print("thousand of the lines and " + str(untraceable_lines_per_day) + " a day - covering the " + str(worker_share_of_processing_time_per_myriad) + " per ten thousand")
print("of processing time where the failures being investigated actually happen.")
```

## stdout (executed)

```text
requests per day               : 4200000
services the id survives       : 4

log lines per request, service : 7
log lines per request, worker  : 11
share with no correlation id   : 6111 per ten thousand
untraceable lines per day      : 46200000
worker share of processing time: 6100 per ten thousand

the request path
  id generated at    : the edge
  propagated in      : a header
  read by every logger : yes, from context, without being
    asked
  services it survives : 4
  one id pasted into search returns : the whole request,
    in order, across all four
  verdict            : CORRELATED

  this pays for itself weekly and nobody should undo it

the enqueue
  what the job carries : the payload the work needs
  fields for context   : none in the job schema
  a header to propagate: there is no request to put one on
  the worker's logger  : reads a context that is empty
    because this process did not handle a request

  nothing was dropped; the mechanism is a call-scoped one
  and this is not a call

investigating a worker failure
  the worker's own lines    : present, complete, timestamped
  which request caused it   : not recorded
  matching on the payload   : possible, unindexed, and not
    unique
  the service's lines for that request : present, and not
    linkable to these

null control - the id carried in the job
  services the id survives : 4, unchanged
  traceable lines per request : 18
  untraceable lines per day   : 0
  the propagation did not improve; the job schema gained
  a field for the thing that was already being propagated
  everywhere else

what request correlation guarantees
  everything on the call path shares an id : exactly
  everything caused by the request does    : not addressed;
    the mechanism is scoped to a call, and the work that
    was moved off the call to make it fast is precisely
    what leaves that scope

context propagation follows the shape of the control flow;
the moment work becomes asynchronous it needs the context as
data, and a job schema written for the work has no field
for it

Correlation works across all 4 services and one id returns the whole request in
order, which is real and earns its keep. The worker is reached by an enqueue
rather than a call, so its 11 lines a request carry no id - 6111 per ten
thousand of the lines and 46200000 a day - covering the 6100 per ten thousand
of processing time where the failures being investigated actually happen.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
