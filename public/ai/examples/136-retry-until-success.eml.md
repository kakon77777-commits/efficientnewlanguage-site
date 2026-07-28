<!-- canonical: efficientnewlanguage.org/ai/examples/136-retry-until-success | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 136 — Retry loops

`retry_until_success.eml` uses exceptions for control flow rather than for reporting a crash.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The retry loop -
# exceptions used for control flow rather than for reporting a crash.
#
# Retry logic is notoriously easy to write slightly wrong, and every one of the
# classic mistakes is invisible on the happy path:
#
#   - retrying forever when the failure is permanent
#   - counting attempts off by one, so `max_attempts = 3` tries twice or four
#     times
#   - swallowing the final failure and returning a wrong answer as if it had
#     succeeded
#   - retrying an error that retrying cannot possibly fix
#
# So the failures here are DETERMINISTIC rather than random: `FlakyService`
# fails its first `fail_times` calls and then succeeds, and a counter records
# exactly how many attempts each run took. Every claim below is checked against
# that counter.
#
# The four scenarios are chosen to pin the boundaries, not to look impressive:
# a service that never fails (1 attempt), one that fails once (2), one that
# fails exactly as many times as the budget allows (3 - the last attempt is the
# one that works), and one that fails more often than the budget (all 3 spent,
# then a real failure that is re-raised rather than hidden).
#
# The last scenario is the one that matters. A retry loop that returns a
# default instead of re-raising would print a plausible number there, and the
# program would look like it worked.

class FlakyService:
    def __init__(self, fail_times):
        fail_times => self.fail_times
        0 => self.calls

    def fetch(self):
        self.calls + 1 => self.calls
        if self.calls <= self.fail_times:
            raise ValueError("temporary failure on call " + str(self.calls))
        return 42

def with_retry(service, max_attempts):
    0 => attempt
    while attempt < max_attempts:
        attempt + 1 => attempt
        try:
            service.fetch() => value
            return [value, attempt]
        except ValueError as e:
            if attempt == max_attempts:
                raise ValueError("gave up after " + str(attempt) + " attempts; last error: " + str(e))
    return [0, 0]

3 => budget
("Retry budget: " + str(budget) + " attempts")^0
""^0

scenarios^+[0, 1, 2, 3]
labels^+["never fails", "fails once", "fails twice (last attempt works)", "fails three times (budget exhausted)"]

0 => succeeded
0 => gave_up
0 => i
while i < len(scenarios):
    FlakyService(scenarios[i]) => svc
    try:
        with_retry(svc, budget) => outcome
        succeeded + 1 => succeeded
        ("  " + labels[i] + ":")^0
        ("    got " + str(outcome[0]) + " on attempt " + str(outcome[1]) + " (service saw " + str(svc.calls) + " calls)")^0
    except ValueError as e:
        gave_up + 1 => gave_up
        ("  " + labels[i] + ":")^0
        ("    " + str(e))^0
        ("    (service saw " + str(svc.calls) + " calls - the whole budget, no more)")^0
    i + 1 => i

""^0
("Succeeded: " + str(succeeded) + "   Gave up: " + str(gave_up))^0
"The attempt counts are 1, 2, 3 - the budget is spent exactly, never exceeded," => n1
n1^0
"and the exhausted case RAISES rather than returning a plausible-looking 0." => n2
n2^0
"That last distinction is the whole difference between a retry loop and a bug." => n3
n3^0
```

## Python (deterministic transpilation)

```python
class FlakyService:
    def __init__(self, fail_times):
        self.fail_times = fail_times
        self.calls = 0
    def fetch(self):
        self.calls = self.calls + 1
        if self.calls <= self.fail_times:
            raise ValueError("temporary failure on call " + str(self.calls))
        return 42

def with_retry(service, max_attempts):
    attempt = 0
    while attempt < max_attempts:
        attempt = attempt + 1
        try:
            value = service.fetch()
            return [value, attempt]
        except ValueError as e:
            if attempt == max_attempts:
                raise ValueError("gave up after " + str(attempt) + " attempts; last error: " + str(e))
    return [0, 0]

budget = 3
print("Retry budget: " + str(budget) + " attempts")
print("")
scenarios = [0, 1, 2, 3]
labels = ["never fails", "fails once", "fails twice (last attempt works)", "fails three times (budget exhausted)"]
succeeded = 0
gave_up = 0
i = 0
while i < len(scenarios):
    svc = FlakyService(scenarios[i])
    try:
        outcome = with_retry(svc, budget)
        succeeded = succeeded + 1
        print("  " + labels[i] + ":")
        print("    got " + str(outcome[0]) + " on attempt " + str(outcome[1]) + " (service saw " + str(svc.calls) + " calls)")
    except ValueError as e:
        gave_up = gave_up + 1
        print("  " + labels[i] + ":")
        print("    " + str(e))
        print("    (service saw " + str(svc.calls) + " calls - the whole budget, no more)")
    i = i + 1
print("")
print("Succeeded: " + str(succeeded) + "   Gave up: " + str(gave_up))
n1 = "The attempt counts are 1, 2, 3 - the budget is spent exactly, never exceeded,"
print(n1)
n2 = "and the exhausted case RAISES rather than returning a plausible-looking 0."
print(n2)
n3 = "That last distinction is the whole difference between a retry loop and a bug."
print(n3)
```

## stdout (executed)

```text
Retry budget: 3 attempts

  never fails:
    got 42 on attempt 1 (service saw 1 calls)
  fails once:
    got 42 on attempt 2 (service saw 2 calls)
  fails twice (last attempt works):
    got 42 on attempt 3 (service saw 3 calls)
  fails three times (budget exhausted):
    gave up after 3 attempts; last error: temporary failure on call 3
    (service saw 3 calls - the whole budget, no more)

Succeeded: 3   Gave up: 1
The attempt counts are 1, 2, 3 - the budget is spent exactly, never exceeded,
and the exhausted case RAISES rather than returning a plausible-looking 0.
That last distinction is the whole difference between a retry loop and a bug.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
