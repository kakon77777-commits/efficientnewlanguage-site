<!-- canonical: efficientnewlanguage.org/ai/examples/571-the-flag-defaulted-differently-in-two-places | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 571 — The flag defaulted differently in two places

`the_flag_defaulted_differently_in_two_places.eml` - One feature flag, read by the server and by the browser. Each side has a default for when the flag service cannot be reached. What the two defaults do together is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). One feature flag,
# read by the server and by the browser. Each side has a default for when the
# flag service cannot be reached. What the two defaults do together is computed
# below.
#
# Both defaults were chosen deliberately and both are the safe choice in their
# own frame. The server defaults ON, because the new code path is now the
# tested one and the old branch has not run in production for a month; failing
# to a branch nobody exercises is how you turn an outage into two. The browser
# defaults OFF, because the old interface is the one that certainly renders,
# and a blank page is the worst thing a client can do. Each side reasoned about
# its own failure, correctly, and reached the opposite answer.
#
# A flag is not a property of a service. It is a property of a request that two
# services must agree on. Neither default is wrong; the pair is, and a pair has
# no owner.

999 => flag_service_availability_permille
525600 => minutes_per_year
6000 => requests_per_minute

"one flag, two readers, two defaults" ^0
"  server default : ON" ^0
"  browser default: OFF" ^0
"" ^0

# ---- the four combinations ----

"server   browser   agree   what the request does" ^0
"  ON       ON        yes    new format sent, new format parsed" ^0
"  OFF      OFF       yes    old format sent, old format parsed" ^0
"  ON       OFF       no     new format sent, old parser reads it" ^0
"  OFF      ON        no     old format sent, browser wants the new field" ^0
"" ^0

4 => combinations
2 => broken_combinations

"  combinations           : " + str(combinations) ^0
"  combinations that break: " + str(broken_combinations) ^0
"  two sides choosing independently land on a broken pair with probability " + str(int(broken_combinations * 100 / combinations)) + " percent" ^0
"  and this pair is one of the two" ^0
"" ^0

# ---- how often the defaults are consulted ----

minutes_per_year - int(minutes_per_year * flag_service_availability_permille / 1000) => unreachable_minutes
unreachable_minutes * requests_per_minute => mismatched_requests

"the flag service is measured at " + str(flag_service_availability_permille) + " per mille available" ^0
"  minutes per year it cannot be reached : " + str(unreachable_minutes) ^0
"  requests per minute                   : " + str(requests_per_minute) ^0
"  requests that fall back to the defaults: " + str(mismatched_requests) + " per year" ^0
"  of those, requests where the two sides disagree: " + str(mismatched_requests) ^0
"" ^0
"  the disagreement is not probabilistic" ^0
"  when the flag service is down, EVERY request takes the broken pair," ^0
"  because both defaults are constants" ^0
"" ^0

# ---- why each side tested green ----
#
# Each team tested its own fallback by making the flag service unreachable from
# its own side. Neither test could produce the mismatch, because the mismatch
# needs both sides to fall back at once.

"what each team tested" ^0
"  server team : flag service unreachable from the server" ^0
"                server falls back to ON, browser still reads the flag" ^0
"                browser gets ON, both sides ON, request works" ^0
"  browser team: flag service unreachable from the browser" ^0
"                browser falls back to OFF, server still reads the flag" ^0
"                server reads OFF, both sides OFF, request works" ^0
"" ^0
"  both fallback tests pass" ^0
"  the failure needs ONE outage visible to BOTH, which is the actual outage" ^0
"  and is the case neither test constructed" ^0
"" ^0

# ---- the control ----
#
# Each default, judged against the failure it was chosen for. Both are correct
# and would be chosen again.

"control - is either default wrong for its own failure mode" ^0
"  server ON  : avoids running a branch that has not executed in a month" ^0
"               correct, and the alternative is worse" ^0
"  browser OFF: avoids rendering an interface that may not have its data" ^0
"               correct, and the alternative is a blank page" ^0
"  defaults that are wrong on their own : 0 of 2" ^0
"" ^0
"  a review of either side approves it" ^0
"  there is no review whose scope is 'the pair'" ^0
"" ^0

# ---- the null control ----
#
# The same two readers with the same fallback mechanism and the SAME default.
# The flag service goes down exactly as often and nothing breaks, because the
# two sides agree on which way to be wrong.

"null control - the same outage, both sides defaulting OFF" ^0
"  server default : OFF" ^0
"  browser default: OFF" ^0
"  minutes per year unreachable   : " + str(unreachable_minutes) ^0
"  requests hitting the defaults  : " + str(mismatched_requests) ^0
"  requests that break            : 0" ^0
"  same outage, same duration, same fallback code" ^0
"  agreeing on the wrong answer costs nothing; disagreeing costs everything" ^0
"" ^0

# ---- the rule ----

"a flag read in more than one place" ^0
"  each reader needs a default            true" ^0
"  each default should be locally safe    true" ^0
"  the defaults must be the SAME value    this is the one nobody owns" ^0
"  because it is not a property of either reader" ^0
"" ^0
"the fix is not a better default on either side" ^0
"it is one default, written once, that both sides read" ^0
"" ^0

"Defaulting the server ON avoids falling into a branch that has not run in a" ^0
"month. Defaulting the browser OFF avoids rendering an interface without its" ^0
"data. Both are right about the failure each team considered. Together they are" ^0
"one of the " + str(broken_combinations) + " combinations of " + str(combinations) + " that cannot serve a request, and for the" ^0
str(unreachable_minutes) + " minutes a year the flag service is unreachable, every one of the" ^0
str(mismatched_requests) + " requests in that window takes it." ^0
```

## Python (deterministic transpilation)

```python
flag_service_availability_permille = 999
minutes_per_year = 525600
requests_per_minute = 6000
print("one flag, two readers, two defaults")
print("  server default : ON")
print("  browser default: OFF")
print("")
print("server   browser   agree   what the request does")
print("  ON       ON        yes    new format sent, new format parsed")
print("  OFF      OFF       yes    old format sent, old format parsed")
print("  ON       OFF       no     new format sent, old parser reads it")
print("  OFF      ON        no     old format sent, browser wants the new field")
print("")
combinations = 4
broken_combinations = 2
print("  combinations           : " + str(combinations))
print("  combinations that break: " + str(broken_combinations))
print("  two sides choosing independently land on a broken pair with probability " + str(int(broken_combinations * 100 / combinations)) + " percent")
print("  and this pair is one of the two")
print("")
unreachable_minutes = minutes_per_year - int(minutes_per_year * flag_service_availability_permille / 1000)
mismatched_requests = unreachable_minutes * requests_per_minute
print("the flag service is measured at " + str(flag_service_availability_permille) + " per mille available")
print("  minutes per year it cannot be reached : " + str(unreachable_minutes))
print("  requests per minute                   : " + str(requests_per_minute))
print("  requests that fall back to the defaults: " + str(mismatched_requests) + " per year")
print("  of those, requests where the two sides disagree: " + str(mismatched_requests))
print("")
print("  the disagreement is not probabilistic")
print("  when the flag service is down, EVERY request takes the broken pair,")
print("  because both defaults are constants")
print("")
print("what each team tested")
print("  server team : flag service unreachable from the server")
print("                server falls back to ON, browser still reads the flag")
print("                browser gets ON, both sides ON, request works")
print("  browser team: flag service unreachable from the browser")
print("                browser falls back to OFF, server still reads the flag")
print("                server reads OFF, both sides OFF, request works")
print("")
print("  both fallback tests pass")
print("  the failure needs ONE outage visible to BOTH, which is the actual outage")
print("  and is the case neither test constructed")
print("")
print("control - is either default wrong for its own failure mode")
print("  server ON  : avoids running a branch that has not executed in a month")
print("               correct, and the alternative is worse")
print("  browser OFF: avoids rendering an interface that may not have its data")
print("               correct, and the alternative is a blank page")
print("  defaults that are wrong on their own : 0 of 2")
print("")
print("  a review of either side approves it")
print("  there is no review whose scope is 'the pair'")
print("")
print("null control - the same outage, both sides defaulting OFF")
print("  server default : OFF")
print("  browser default: OFF")
print("  minutes per year unreachable   : " + str(unreachable_minutes))
print("  requests hitting the defaults  : " + str(mismatched_requests))
print("  requests that break            : 0")
print("  same outage, same duration, same fallback code")
print("  agreeing on the wrong answer costs nothing; disagreeing costs everything")
print("")
print("a flag read in more than one place")
print("  each reader needs a default            true")
print("  each default should be locally safe    true")
print("  the defaults must be the SAME value    this is the one nobody owns")
print("  because it is not a property of either reader")
print("")
print("the fix is not a better default on either side")
print("it is one default, written once, that both sides read")
print("")
print("Defaulting the server ON avoids falling into a branch that has not run in a")
print("month. Defaulting the browser OFF avoids rendering an interface without its")
print("data. Both are right about the failure each team considered. Together they are")
print("one of the " + str(broken_combinations) + " combinations of " + str(combinations) + " that cannot serve a request, and for the")
print(str(unreachable_minutes) + " minutes a year the flag service is unreachable, every one of the")
print(str(mismatched_requests) + " requests in that window takes it.")
```

## stdout (executed)

```text
one flag, two readers, two defaults
  server default : ON
  browser default: OFF

server   browser   agree   what the request does
  ON       ON        yes    new format sent, new format parsed
  OFF      OFF       yes    old format sent, old format parsed
  ON       OFF       no     new format sent, old parser reads it
  OFF      ON        no     old format sent, browser wants the new field

  combinations           : 4
  combinations that break: 2
  two sides choosing independently land on a broken pair with probability 50 percent
  and this pair is one of the two

the flag service is measured at 999 per mille available
  minutes per year it cannot be reached : 526
  requests per minute                   : 6000
  requests that fall back to the defaults: 3156000 per year
  of those, requests where the two sides disagree: 3156000

  the disagreement is not probabilistic
  when the flag service is down, EVERY request takes the broken pair,
  because both defaults are constants

what each team tested
  server team : flag service unreachable from the server
                server falls back to ON, browser still reads the flag
                browser gets ON, both sides ON, request works
  browser team: flag service unreachable from the browser
                browser falls back to OFF, server still reads the flag
                server reads OFF, both sides OFF, request works

  both fallback tests pass
  the failure needs ONE outage visible to BOTH, which is the actual outage
  and is the case neither test constructed

control - is either default wrong for its own failure mode
  server ON  : avoids running a branch that has not executed in a month
               correct, and the alternative is worse
  browser OFF: avoids rendering an interface that may not have its data
               correct, and the alternative is a blank page
  defaults that are wrong on their own : 0 of 2

  a review of either side approves it
  there is no review whose scope is 'the pair'

null control - the same outage, both sides defaulting OFF
  server default : OFF
  browser default: OFF
  minutes per year unreachable   : 526
  requests hitting the defaults  : 3156000
  requests that break            : 0
  same outage, same duration, same fallback code
  agreeing on the wrong answer costs nothing; disagreeing costs everything

a flag read in more than one place
  each reader needs a default            true
  each default should be locally safe    true
  the defaults must be the SAME value    this is the one nobody owns
  because it is not a property of either reader

the fix is not a better default on either side
it is one default, written once, that both sides read

Defaulting the server ON avoids falling into a branch that has not run in a
month. Defaulting the browser OFF avoids rendering an interface without its
data. Both are right about the failure each team considered. Together they are
one of the 2 combinations of 4 that cannot serve a request, and for the
526 minutes a year the flag service is unreachable, every one of the
3156000 requests in that window takes it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
