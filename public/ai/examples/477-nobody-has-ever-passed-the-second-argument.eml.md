<!-- canonical: efficientnewlanguage.org/ai/examples/477-nobody-has-ever-passed-the-second-argument | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 477 — Nobody has ever passed the second argument

`nobody_has_ever_passed_the_second_argument.eml` - The function takes an optional second argument. How many call sites pass it is computed below, and so is what it costs to keep.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The function takes
# an optional second argument. How many call sites pass it is computed below,
# and so is what it costs to keep.
#
# Adding the parameter was right. A caller genuinely might need to override the
# behaviour, adding it later would be a breaking change for anyone who had
# already written a positional call, and it is optional so no existing caller
# had to change. This is the standard advice and it was followed.
#
# A parameter nobody passes is a branch nobody runs, and unlike dead code it
# cannot be deleted by a linter, because it is reachable in principle and part
# of the published signature. It is carried by every change to the function.
#
# The call sites and the maintenance cost are counted separately.

# [parameter, call sites that pass it, call sites total, branches it adds, times it appeared in a review]
[["strict", 0, 47, 2, 6], ["encoding", 3, 47, 1, 1], ["timeout_ms", 12, 47, 1, 0], ["legacy_mode", 0, 47, 3, 9], ["on_error", 0, 47, 2, 4]] => params

len(params) => n
47 => call_sites

"parameters on the signature : " + str(n) ^0
"call sites : " + str(call_sites) ^0
"" ^0
"parameter      passed by   branches   review mentions" ^0
0 => never_passed
0 => dead_branches
0 => review_cost
for p in params:
    "  " + p[0] + "   " + str(p[1]) + " of " + str(p[2]) + "     " + str(p[3]) + "          " + str(p[4]) ^0
    if p[1] == 0:
        never_passed + 1 => never_passed
        dead_branches + p[3] => dead_branches
        review_cost + p[4] => review_cost
"" ^0

"parameters no call site has ever passed : " + str(never_passed) + " of " + str(n) ^0
if never_passed > 0:
    "  branches behind them : " + str(dead_branches) ^0
    "  times they came up in review anyway : " + str(review_cost) ^0
"" ^0

# ---- what the unpassed ones cost ----

0 => total_branches
for p in params:
    total_branches + p[3] => total_branches
"branches in the function : " + str(total_branches) ^0
if total_branches > 0:
    "  reachable from a real call site : " + str(total_branches - dead_branches) ^0
    "  reachable only in principle      : " + str(dead_branches) + ", which is " + str(int(dead_branches * 100 / total_branches)) + "%" ^0
"" ^0

"what a change to this function has to consider" ^0
"  behaviours a caller depends on : " + str(total_branches - dead_branches) ^0
"  behaviours that must be preserved anyway : " + str(dead_branches) ^0
"  the second group has no caller to break and cannot be shown to work" ^0
"" ^0

# ---- what is known about the unpassed branches ----

"evidence available for each kind of branch" ^0
"  passed by a call site : production traffic, every day" ^0
"  passed only by a test : whatever the test asserts" ^0
"  never passed at all   : the code reads correctly" ^0
"  the third is the same evidence the code had on the day it was written" ^0
"" ^0

# ---- the review cost, which is the visible one ----

0 => total_mentions
for p in params:
    total_mentions + p[4] => total_mentions
"review mentions across all parameters : " + str(total_mentions) ^0
if review_cost > 0:
    "  of those, about parameters nobody passes : " + str(review_cost) + ", which is " + str(int(review_cost * 100 / total_mentions)) + "%" ^0
    "  a reviewer has to reason about them because they are in the signature," ^0
    "  and no reviewer can check them against a caller" ^0
"" ^0

# ---- removing one ----

"removing a parameter no call site passes" ^0
"  callers that break : 0, by the count above" ^0
"  branches removed   : " + str(dead_branches) ^0
"  what stops it      : it is published, so removal is a breaking change to" ^0
"  an interface rather than to any caller" ^0
"  the parameter costs nothing to any caller and cannot be removed for the" ^0
"  sake of the callers it has none of" ^0
"" ^0

# ---- the control: a parameter that is used ----
#
# Where a parameter has call sites, its branches are exercised by traffic and
# the reasoning about them is anchored to something.

for p in params:
    if p[1] > 0:
        if p[1] > 10:
            "control - " + p[0] + ", passed by " + str(p[1]) + " of " + str(p[2]) + " call sites" ^0
            "  its branch runs in production, so a change to it is caught by the" ^0
            "  callers rather than by a reviewer imagining them" ^0
"" ^0

"The parameter was added for a real reason and adding it later would have" ^0
"broken callers. Nothing has passed it, so what is known about the code" ^0
"behind it is what was known the day it was written." ^0
```

## Python (deterministic transpilation)

```python
params = [["strict", 0, 47, 2, 6], ["encoding", 3, 47, 1, 1], ["timeout_ms", 12, 47, 1, 0], ["legacy_mode", 0, 47, 3, 9], ["on_error", 0, 47, 2, 4]]
n = len(params)
call_sites = 47
print("parameters on the signature : " + str(n))
print("call sites : " + str(call_sites))
print("")
print("parameter      passed by   branches   review mentions")
never_passed = 0
dead_branches = 0
review_cost = 0
for p in params:
    print("  " + p[0] + "   " + str(p[1]) + " of " + str(p[2]) + "     " + str(p[3]) + "          " + str(p[4]))
    if p[1] == 0:
        never_passed = never_passed + 1
        dead_branches = dead_branches + p[3]
        review_cost = review_cost + p[4]
print("")
print("parameters no call site has ever passed : " + str(never_passed) + " of " + str(n))
if never_passed > 0:
    print("  branches behind them : " + str(dead_branches))
    print("  times they came up in review anyway : " + str(review_cost))
print("")
total_branches = 0
for p in params:
    total_branches = total_branches + p[3]
print("branches in the function : " + str(total_branches))
if total_branches > 0:
    print("  reachable from a real call site : " + str(total_branches - dead_branches))
    print("  reachable only in principle      : " + str(dead_branches) + ", which is " + str(int(dead_branches * 100 / total_branches)) + "%")
print("")
print("what a change to this function has to consider")
print("  behaviours a caller depends on : " + str(total_branches - dead_branches))
print("  behaviours that must be preserved anyway : " + str(dead_branches))
print("  the second group has no caller to break and cannot be shown to work")
print("")
print("evidence available for each kind of branch")
print("  passed by a call site : production traffic, every day")
print("  passed only by a test : whatever the test asserts")
print("  never passed at all   : the code reads correctly")
print("  the third is the same evidence the code had on the day it was written")
print("")
total_mentions = 0
for p in params:
    total_mentions = total_mentions + p[4]
print("review mentions across all parameters : " + str(total_mentions))
if review_cost > 0:
    print("  of those, about parameters nobody passes : " + str(review_cost) + ", which is " + str(int(review_cost * 100 / total_mentions)) + "%")
    print("  a reviewer has to reason about them because they are in the signature,")
    print("  and no reviewer can check them against a caller")
print("")
print("removing a parameter no call site passes")
print("  callers that break : 0, by the count above")
print("  branches removed   : " + str(dead_branches))
print("  what stops it      : it is published, so removal is a breaking change to")
print("  an interface rather than to any caller")
print("  the parameter costs nothing to any caller and cannot be removed for the")
print("  sake of the callers it has none of")
print("")
for p in params:
    if p[1] > 0:
        if p[1] > 10:
            print("control - " + p[0] + ", passed by " + str(p[1]) + " of " + str(p[2]) + " call sites")
            print("  its branch runs in production, so a change to it is caught by the")
            print("  callers rather than by a reviewer imagining them")
print("")
print("The parameter was added for a real reason and adding it later would have")
print("broken callers. Nothing has passed it, so what is known about the code")
print("behind it is what was known the day it was written.")
```

## stdout (executed)

```text
parameters on the signature : 5
call sites : 47

parameter      passed by   branches   review mentions
  strict   0 of 47     2          6
  encoding   3 of 47     1          1
  timeout_ms   12 of 47     1          0
  legacy_mode   0 of 47     3          9
  on_error   0 of 47     2          4

parameters no call site has ever passed : 3 of 5
  branches behind them : 7
  times they came up in review anyway : 19

branches in the function : 9
  reachable from a real call site : 2
  reachable only in principle      : 7, which is 77%

what a change to this function has to consider
  behaviours a caller depends on : 2
  behaviours that must be preserved anyway : 7
  the second group has no caller to break and cannot be shown to work

evidence available for each kind of branch
  passed by a call site : production traffic, every day
  passed only by a test : whatever the test asserts
  never passed at all   : the code reads correctly
  the third is the same evidence the code had on the day it was written

review mentions across all parameters : 20
  of those, about parameters nobody passes : 19, which is 95%
  a reviewer has to reason about them because they are in the signature,
  and no reviewer can check them against a caller

removing a parameter no call site passes
  callers that break : 0, by the count above
  branches removed   : 7
  what stops it      : it is published, so removal is a breaking change to
  an interface rather than to any caller
  the parameter costs nothing to any caller and cannot be removed for the
  sake of the callers it has none of

control - timeout_ms, passed by 12 of 47 call sites
  its branch runs in production, so a change to it is caught by the
  callers rather than by a reviewer imagining them

The parameter was added for a real reason and adding it later would have
broken callers. Nothing has passed it, so what is known about the code
behind it is what was known the day it was written.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
