<!-- canonical: efficientnewlanguage.org/ai/examples/195-retry-with-backoff-ledger | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 195 — Retry with backoff, and the ledger that audits it

`retry_with_backoff_ledger.eml` implements exponential-backoff retry and then proves the retry loop did not lie about what it did.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Retry with
# exponential backoff, wrapped in the accounting that proves the retry loop
# did not lie about what it did.
#
# Retry code is nested by nature: a `try` inside a `while` inside a `def`, with
# a `finally` that has to run on the successful path, the retryable-failure
# path, the give-up path, and the non-retryable path. Four exits, and the one
# everybody tests is the first.
#
# The classic bugs, all of which leave the program running and the output
# plausible:
#
#   - a `return` from inside the try skips the attempt counter
#   - the backoff is computed but the sleep total never accumulates
#   - a non-retryable error is retried anyway, wasting the whole budget
#   - the give-up path forgets to re-raise, so the caller sees success
#
# So the operation records every attempt in a ledger, and the checks compare
# the ledger against the outcome rather than trusting either alone.

class Ledger:
    0 => attempts
    0 => successes
    0 => failures
    0 => backoff_total

    def __init__(self):
        [] => self.log
        0 => self.attempts
        0 => self.successes
        0 => self.failures
        0 => self.backoff_total

    def record(self, entry):
        self.log + [entry] => self.log


def flaky(name, fail_times, state, fatal):
    # A callable that fails `fail_times` times and then succeeds - unless
    # `fatal` is true, in which case it raises something that must not be
    # retried at all.
    state[0] + 1 => state[0]
    if fatal:
        raise TypeError(name + ": not retryable")
    if state[0] <= fail_times:
        raise ValueError(name + ": transient failure " + str(state[0]))
    return name + ": ok on attempt " + str(state[0])


def with_retry(ledger, name, fail_times, fatal, budget):
    0 => attempt
    1 => delay
    "" => outcome
    while attempt < budget:
        attempt + 1 => attempt
        ledger.attempts + 1 => ledger.attempts
        [0] => unused
        try:
            flaky(name, fail_times, [attempt - 1], fatal) => result
            ledger.successes + 1 => ledger.successes
            ledger.record(name + " attempt " + str(attempt) + ": success")
            return result
        except TypeError as e:
            # Not retryable. The finally below still runs; the loop does not.
            ledger.failures + 1 => ledger.failures
            ledger.record(name + " attempt " + str(attempt) + ": fatal, no retry")
            raise
        except ValueError as e:
            ledger.failures + 1 => ledger.failures
            if attempt < budget:
                ledger.backoff_total + delay => ledger.backoff_total
                ledger.record(name + " attempt " + str(attempt) + ": retry after " + str(delay) + "s")
                delay * 2 => delay
            else:
                ledger.record(name + " attempt " + str(attempt) + ": budget exhausted")
        finally:
            ledger.record("  (finally ran for attempt " + str(attempt) + ")")
    raise ValueError(name + ": gave up after " + str(budget) + " attempts")


Ledger() => ledger
4 => budget

# (name, transient failures before success, fatal?)
[
    ["alpha", 0, False],
    ["bravo", 2, False],
    ["charlie", 9, False],
    ["delta", 0, True],
] => jobs

"Running four jobs with a budget of 4 attempts each:"^0
0 => succeeded
0 => gave_up
0 => refused
for job in jobs:
    try:
        with_retry(ledger, job[0], job[1], job[2], budget) => result
        succeeded + 1 => succeeded
        ("  " + result)^0
    except TypeError as e:
        refused + 1 => refused
        ("  " + str(e))^0
    except ValueError as e:
        gave_up + 1 => gave_up
        ("  " + str(e))^0

""^0
"Ledger:"^0
for entry in ledger.log:
    ("  " + entry)^0

# ------------------------------------------------------------------- checks
# alpha: 1 attempt. bravo: 3 (fails twice). charlie: 4 (budget). delta: 1.
1 + 3 + 4 + 1 => expected_attempts
# backoff only between retries: bravo waits 1+2 = 3, charlie waits 1+2+4 = 7.
3 + 7 => expected_backoff
# every attempt must have left a "finally ran" line
0 => finally_lines
for entry in ledger.log:
    if entry[0:12] == "  (finally r":
        finally_lines + 1 => finally_lines

""^0
("attempts:        " + str(ledger.attempts) + "  (expected " + str(expected_attempts) + ")")^0
("successes:       " + str(ledger.successes))^0
("failures:        " + str(ledger.failures))^0
("finally ran:     " + str(finally_lines) + " times")^0
("backoff seconds: " + str(ledger.backoff_total) + "  (expected " + str(expected_backoff) + ")")^0
("succeeded / gave up / refused: " + str(succeeded) + " / " + str(gave_up) + " / " + str(refused))^0

""^0
if ledger.attempts == expected_attempts and finally_lines == ledger.attempts and ledger.backoff_total == expected_backoff and succeeded == 2 and gave_up == 1 and refused == 1:
    "Every attempt counted, every finally ran, and delta was never retried." => verdict
else:
    "FAILED - the retry loop and its ledger disagree." => verdict
verdict^0

""^0
"`finally ran` equalling `attempts` is the load-bearing check. Two of the" => n1
n1^0
"four jobs leave the try body by `return` or by `raise`, and an" => n2
n2^0
"implementation that runs finally only on the fall-through path still" => n3
n3^0
"produces this exact output apart from that one number." => n4
n4^0
```

## Python (deterministic transpilation)

```python
class Ledger:
    attempts = 0
    successes = 0
    failures = 0
    backoff_total = 0
    def __init__(self):
        self.log = []
        self.attempts = 0
        self.successes = 0
        self.failures = 0
        self.backoff_total = 0
    def record(self, entry):
        self.log = self.log + [entry]

def flaky(name, fail_times, state, fatal):
    state[0] = state[0] + 1
    if fatal:
        raise TypeError(name + ": not retryable")
    if state[0] <= fail_times:
        raise ValueError(name + ": transient failure " + str(state[0]))
    return name + ": ok on attempt " + str(state[0])

def with_retry(ledger, name, fail_times, fatal, budget):
    attempt = 0
    delay = 1
    outcome = ""
    while attempt < budget:
        attempt = attempt + 1
        ledger.attempts = ledger.attempts + 1
        unused = [0]
        try:
            result = flaky(name, fail_times, [attempt - 1], fatal)
            ledger.successes = ledger.successes + 1
            ledger.record(name + " attempt " + str(attempt) + ": success")
            return result
        except TypeError as e:
            ledger.failures = ledger.failures + 1
            ledger.record(name + " attempt " + str(attempt) + ": fatal, no retry")
            raise
        except ValueError as e:
            ledger.failures = ledger.failures + 1
            if attempt < budget:
                ledger.backoff_total = ledger.backoff_total + delay
                ledger.record(name + " attempt " + str(attempt) + ": retry after " + str(delay) + "s")
                delay = delay * 2
            else:
                ledger.record(name + " attempt " + str(attempt) + ": budget exhausted")
        finally:
            ledger.record("  (finally ran for attempt " + str(attempt) + ")")
    raise ValueError(name + ": gave up after " + str(budget) + " attempts")

ledger = Ledger()
budget = 4
jobs = [["alpha", 0, False], ["bravo", 2, False], ["charlie", 9, False], ["delta", 0, True]]
print("Running four jobs with a budget of 4 attempts each:")
succeeded = 0
gave_up = 0
refused = 0
for job in jobs:
    try:
        result = with_retry(ledger, job[0], job[1], job[2], budget)
        succeeded = succeeded + 1
        print("  " + result)
    except TypeError as e:
        refused = refused + 1
        print("  " + str(e))
    except ValueError as e:
        gave_up = gave_up + 1
        print("  " + str(e))
print("")
print("Ledger:")
for entry in ledger.log:
    print("  " + entry)
expected_attempts = 1 + 3 + 4 + 1
expected_backoff = 3 + 7
finally_lines = 0
for entry in ledger.log:
    if entry[0:12] == "  (finally r":
        finally_lines = finally_lines + 1
print("")
print("attempts:        " + str(ledger.attempts) + "  (expected " + str(expected_attempts) + ")")
print("successes:       " + str(ledger.successes))
print("failures:        " + str(ledger.failures))
print("finally ran:     " + str(finally_lines) + " times")
print("backoff seconds: " + str(ledger.backoff_total) + "  (expected " + str(expected_backoff) + ")")
print("succeeded / gave up / refused: " + str(succeeded) + " / " + str(gave_up) + " / " + str(refused))
print("")
if ledger.attempts == expected_attempts and finally_lines == ledger.attempts and ledger.backoff_total == expected_backoff and succeeded == 2 and gave_up == 1 and refused == 1:
    verdict = "Every attempt counted, every finally ran, and delta was never retried."
else:
    verdict = "FAILED - the retry loop and its ledger disagree."
print(verdict)
print("")
n1 = "`finally ran` equalling `attempts` is the load-bearing check. Two of the"
print(n1)
n2 = "four jobs leave the try body by `return` or by `raise`, and an"
print(n2)
n3 = "implementation that runs finally only on the fall-through path still"
print(n3)
n4 = "produces this exact output apart from that one number."
print(n4)
```

## stdout (executed)

```text
Running four jobs with a budget of 4 attempts each:
  alpha: ok on attempt 1
  bravo: ok on attempt 3
  charlie: gave up after 4 attempts
  delta: not retryable

Ledger:
  alpha attempt 1: success
    (finally ran for attempt 1)
  bravo attempt 1: retry after 1s
    (finally ran for attempt 1)
  bravo attempt 2: retry after 2s
    (finally ran for attempt 2)
  bravo attempt 3: success
    (finally ran for attempt 3)
  charlie attempt 1: retry after 1s
    (finally ran for attempt 1)
  charlie attempt 2: retry after 2s
    (finally ran for attempt 2)
  charlie attempt 3: retry after 4s
    (finally ran for attempt 3)
  charlie attempt 4: budget exhausted
    (finally ran for attempt 4)
  delta attempt 1: fatal, no retry
    (finally ran for attempt 1)

attempts:        9  (expected 9)
successes:       2
failures:        7
finally ran:     9 times
backoff seconds: 10  (expected 10)
succeeded / gave up / refused: 2 / 1 / 1

Every attempt counted, every finally ran, and delta was never retried.

`finally ran` equalling `attempts` is the load-bearing check. Two of the
four jobs leave the try body by `return` or by `raise`, and an
implementation that runs finally only on the fall-through path still
produces this exact output apart from that one number.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:classdef · eml:def · eml:call · eml:return · eml:output · eml:run:done
