<!-- canonical: efficientnewlanguage.org/ai/examples/656-the-worker-restarted-and-the-poison-message-came-back | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 656 — The worker restarted and the poison message came back

`the_worker_restarted_and_the_poison_message_came_back.eml` - The supervisor restarted the worker twelve hundred times this hour and every restart succeeded. How much work was done is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The supervisor
# restarted the worker twelve hundred times this hour and every restart
# succeeded. How much work was done is computed below.
#
# The supervisor is correct and it is why this service survives. A worker that
# dies is replaced in three seconds, the replacement is healthy, and the same
# mechanism has absorbed a bad deploy, a memory leak and an upstream outage
# without anyone being paged. Its success rate this hour is a hundred percent.
#
# A restart returns the WORKER to a good state. It does not return the queue to
# one, and the message that killed the worker was never acked, so it is at the
# head of the queue when the replacement connects.
#
# One message has held the consumer for the whole hour. The supervisor reports
# twelve hundred successes and the backlog reports forty-two thousand.

3 => restart_seconds
3600 => seconds_in_the_hour
42000 => messages_per_hour_when_healthy
0 => failed_restarts
1 => poison_messages

int(seconds_in_the_hour / restart_seconds) => restarts_this_hour
# Every attempt reaches the same message first, so nothing behind it is touched.
0 => messages_processed_this_hour
messages_per_hour_when_healthy - messages_processed_this_hour => backlog_added_this_hour

"restart time, seconds     : " + str(restart_seconds) ^0
"restarts this hour        : " + str(restarts_this_hour) ^0
"failed restarts           : " + str(failed_restarts) ^0
"poison messages           : " + str(poison_messages) ^0
"" ^0
"messages processed        : " + str(messages_processed_this_hour) ^0
"throughput when healthy   : " + str(messages_per_hour_when_healthy) ^0
"backlog added this hour   : " + str(backlog_added_this_hour) ^0
"" ^0

# ---- what the supervisor verified ----

"the supervisor's report" ^0
"  restarts attempted : " + str(restarts_this_hour) ^0
"  restarts succeeded : " + str(restarts_this_hour) ^0
"  restarts failed    : " + str(failed_restarts) ^0
"  worker healthy after each : yes" ^0
"  verdict            : HEALTHY" ^0
"" ^0
"  every line is true and this mechanism has saved the" ^0
"  service three times this quarter" ^0
"" ^0

# ---- what a restart restores ----

"the two states" ^0
"  the worker  : fresh process, clean memory, restored" ^0
"  the queue   : the message that killed it is still at" ^0
"    the head, unacked, because the worker died before" ^0
"    acking and that is the correct thing to do" ^0
"" ^0
"  both halves are behaving as designed, and the design" ^0
"  loops" ^0
"" ^0

# ---- the shape of the loop ----

restarts_this_hour * restart_seconds => seconds_spent_restarting

"where the hour went" ^0
"  seconds spent restarting : " + str(seconds_spent_restarting) ^0
"  distinct messages attempted : " + str(poison_messages) ^0
"  attempts on that one message : " + str(restarts_this_hour) ^0
"" ^0
"  a retry budget would have caught this; there is one, and" ^0
"  it counts per worker, and each worker is new" ^0
"" ^0

# ---- why the alert did not fire ----

# The alert is on worker health, which is the thing the supervisor keeps true.
# Throughput has an alert too, on a threshold the queue crossed at minute four,
# routed to a channel the queue's owners read and the service's owners do not.
"the alerts" ^0
"  worker health : green, because it is repeatedly restored" ^0
"  restart rate  : no threshold; restarts are normal" ^0
"  throughput    : fired at minute four, to the queue team" ^0
"  the two teams  : each sees a system behaving correctly" ^0
"" ^0

# ---- null control ----

# The same supervisor, with the delivery count carried on the message rather
# than in the worker, and a limit that moves it aside.
5 => nc_attempts_before_the_message_is_set_aside
messages_per_hour_when_healthy => nc_messages_processed_this_hour
0 => nc_backlog_added

"null control - the attempt count travels with the message" ^0
"  restarts succeeded  : unchanged, the supervisor is fine" ^0
"  attempts on the poison message : " + str(nc_attempts_before_the_message_is_set_aside) ^0
"  messages processed  : " + str(nc_messages_processed_this_hour) ^0
"  backlog added       : " + str(nc_backlog_added) ^0
"  the worker did not get more robust; the counter moved" ^0
"  to the thing that survives the restart" ^0
"" ^0

# ---- the rule ----

"what a successful restart guarantees" ^0
"  the process is healthy again : exactly" ^0
"  progress resumes             : not addressed; the input" ^0
"    that caused the failure is still the next input, and" ^0
"    a fresh process meets it with a fresh counter" ^0
"" ^0
"any recovery that resets state must not reset the count of" ^0
"how often it has recovered; put that count where the failure" ^0
"lives, not where the recovery does" ^0
"" ^0

"The supervisor restarted the worker " + str(restarts_this_hour) + " times this hour with " + str(failed_restarts) + " failures and a" ^0
"healthy process every time, which is the same mechanism that saved the service" ^0
"three times this quarter. " + str(poison_messages) + " message was attempted, " + str(messages_processed_this_hour) + " were processed against a" ^0
"healthy " + str(messages_per_hour_when_healthy) + ", the backlog grew by " + str(backlog_added_this_hour) + ", and the retry budget did not fire" ^0
"because it counts per worker and every worker was new." ^0
```

## Python (deterministic transpilation)

```python
restart_seconds = 3
seconds_in_the_hour = 3600
messages_per_hour_when_healthy = 42000
failed_restarts = 0
poison_messages = 1
restarts_this_hour = int(seconds_in_the_hour / restart_seconds)
messages_processed_this_hour = 0
backlog_added_this_hour = messages_per_hour_when_healthy - messages_processed_this_hour
print("restart time, seconds     : " + str(restart_seconds))
print("restarts this hour        : " + str(restarts_this_hour))
print("failed restarts           : " + str(failed_restarts))
print("poison messages           : " + str(poison_messages))
print("")
print("messages processed        : " + str(messages_processed_this_hour))
print("throughput when healthy   : " + str(messages_per_hour_when_healthy))
print("backlog added this hour   : " + str(backlog_added_this_hour))
print("")
print("the supervisor's report")
print("  restarts attempted : " + str(restarts_this_hour))
print("  restarts succeeded : " + str(restarts_this_hour))
print("  restarts failed    : " + str(failed_restarts))
print("  worker healthy after each : yes")
print("  verdict            : HEALTHY")
print("")
print("  every line is true and this mechanism has saved the")
print("  service three times this quarter")
print("")
print("the two states")
print("  the worker  : fresh process, clean memory, restored")
print("  the queue   : the message that killed it is still at")
print("    the head, unacked, because the worker died before")
print("    acking and that is the correct thing to do")
print("")
print("  both halves are behaving as designed, and the design")
print("  loops")
print("")
seconds_spent_restarting = restarts_this_hour * restart_seconds
print("where the hour went")
print("  seconds spent restarting : " + str(seconds_spent_restarting))
print("  distinct messages attempted : " + str(poison_messages))
print("  attempts on that one message : " + str(restarts_this_hour))
print("")
print("  a retry budget would have caught this; there is one, and")
print("  it counts per worker, and each worker is new")
print("")
print("the alerts")
print("  worker health : green, because it is repeatedly restored")
print("  restart rate  : no threshold; restarts are normal")
print("  throughput    : fired at minute four, to the queue team")
print("  the two teams  : each sees a system behaving correctly")
print("")
nc_attempts_before_the_message_is_set_aside = 5
nc_messages_processed_this_hour = messages_per_hour_when_healthy
nc_backlog_added = 0
print("null control - the attempt count travels with the message")
print("  restarts succeeded  : unchanged, the supervisor is fine")
print("  attempts on the poison message : " + str(nc_attempts_before_the_message_is_set_aside))
print("  messages processed  : " + str(nc_messages_processed_this_hour))
print("  backlog added       : " + str(nc_backlog_added))
print("  the worker did not get more robust; the counter moved")
print("  to the thing that survives the restart")
print("")
print("what a successful restart guarantees")
print("  the process is healthy again : exactly")
print("  progress resumes             : not addressed; the input")
print("    that caused the failure is still the next input, and")
print("    a fresh process meets it with a fresh counter")
print("")
print("any recovery that resets state must not reset the count of")
print("how often it has recovered; put that count where the failure")
print("lives, not where the recovery does")
print("")
print("The supervisor restarted the worker " + str(restarts_this_hour) + " times this hour with " + str(failed_restarts) + " failures and a")
print("healthy process every time, which is the same mechanism that saved the service")
print("three times this quarter. " + str(poison_messages) + " message was attempted, " + str(messages_processed_this_hour) + " were processed against a")
print("healthy " + str(messages_per_hour_when_healthy) + ", the backlog grew by " + str(backlog_added_this_hour) + ", and the retry budget did not fire")
print("because it counts per worker and every worker was new.")
```

## stdout (executed)

```text
restart time, seconds     : 3
restarts this hour        : 1200
failed restarts           : 0
poison messages           : 1

messages processed        : 0
throughput when healthy   : 42000
backlog added this hour   : 42000

the supervisor's report
  restarts attempted : 1200
  restarts succeeded : 1200
  restarts failed    : 0
  worker healthy after each : yes
  verdict            : HEALTHY

  every line is true and this mechanism has saved the
  service three times this quarter

the two states
  the worker  : fresh process, clean memory, restored
  the queue   : the message that killed it is still at
    the head, unacked, because the worker died before
    acking and that is the correct thing to do

  both halves are behaving as designed, and the design
  loops

where the hour went
  seconds spent restarting : 3600
  distinct messages attempted : 1
  attempts on that one message : 1200

  a retry budget would have caught this; there is one, and
  it counts per worker, and each worker is new

the alerts
  worker health : green, because it is repeatedly restored
  restart rate  : no threshold; restarts are normal
  throughput    : fired at minute four, to the queue team
  the two teams  : each sees a system behaving correctly

null control - the attempt count travels with the message
  restarts succeeded  : unchanged, the supervisor is fine
  attempts on the poison message : 5
  messages processed  : 42000
  backlog added       : 0
  the worker did not get more robust; the counter moved
  to the thing that survives the restart

what a successful restart guarantees
  the process is healthy again : exactly
  progress resumes             : not addressed; the input
    that caused the failure is still the next input, and
    a fresh process meets it with a fresh counter

any recovery that resets state must not reset the count of
how often it has recovered; put that count where the failure
lives, not where the recovery does

The supervisor restarted the worker 1200 times this hour with 0 failures and a
healthy process every time, which is the same mechanism that saved the service
three times this quarter. 1 message was attempted, 0 were processed against a
healthy 42000, the backlog grew by 42000, and the retry budget did not fire
because it counts per worker and every worker was new.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
