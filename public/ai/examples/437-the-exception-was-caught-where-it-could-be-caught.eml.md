<!-- canonical: efficientnewlanguage.org/ai/examples/437-the-exception-was-caught-where-it-could-be-caught | ai_layer_version: 0.1.0 | updated: 2026-08-18 -->

# Example 437 — The exception was caught where it could be caught

`the_exception_was_caught_where_it_could_be_caught.eml` - The handler sits at the top of the request, because that is the function this team owns. How many of the failures it catches it can answer correctly is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The handler sits
# at the top of the request, because that is the function this team owns. How
# many of the failures it catches it can answer correctly is computed below.
#
# Catching at the boundary is standard and it is right. It guarantees no
# failure escapes as a stack trace to a user, it is one place to maintain
# instead of forty, and it is the only layer where a team that owns the entry
# point can put a handler at all without editing somebody else's file.
#
# By the time an exception reaches the boundary it has lost the thing that
# distinguishes it. Six causes arrive as one type, so one response is chosen
# for all six, and a response is either right for a cause or it is not.
#
# Each cause is scored against the single available response.

# [cause, occurrences, retrying helps, retrying makes it worse, what it needs]
[["network reset", 340, 1, 0, "retry"], ["downstream 500", 210, 1, 0, "retry"], ["malformed payload", 95, 0, 1, "reject and tell the sender"], ["quota exceeded", 60, 0, 1, "back off, then retry"], ["auth token expired", 45, 0, 0, "re-authenticate, then retry"], ["mapper defect", 18, 0, 0, "a code change"]] => causes

len(causes) => n

def occurrences():
    0 => t
    for c in causes:
        t + c[1] => t
    return t

"distinct causes : " + str(n) ^0
"failures a week : " + str(occurrences()) ^0
"the boundary handler does one thing : log it and retry three times" ^0
"" ^0

0 => helped
0 => worsened
0 => neither
0 => helped_calls
0 => worsened_calls
0 => neither_calls
for c in causes:
    if c[2] == 1:
        helped + 1 => helped
        helped_calls + c[1] => helped_calls
    elif c[3] == 1:
        worsened + 1 => worsened
        worsened_calls + c[1] => worsened_calls
    else:
        neither + 1 => neither
        neither_calls + c[1] => neither_calls

"what the one response does to each cause" ^0
"  it is the right answer for   : " + str(helped) + " causes, " + str(helped_calls) + " failures" ^0
"  it makes things worse for    : " + str(worsened) + " causes, " + str(worsened_calls) + " failures" ^0
"  it changes nothing for       : " + str(neither) + " causes, " + str(neither_calls) + " failures" ^0
if helped_calls > occurrences() - helped_calls:
    "  by volume the single response is right more often than not" ^0
else:
    "  by volume the single response is wrong more often than not" ^0
"" ^0

"cause                what it needs" ^0
for c in causes:
    "  " + c[0] + "   " + c[4] ^0
0 => distinct_needs
[] => seen_needs
for c in causes:
    if not (c[4] in seen_needs):
        seen_needs + [c[4]] => seen_needs
        distinct_needs + 1 => distinct_needs
"  distinct responses required : " + str(distinct_needs) ^0
"  responses the boundary can choose between : 1" ^0
"" ^0

# ---- what retrying costs where it is the wrong answer ----

3 => attempts
"retrying three times, on the causes it does not help" ^0
"  extra calls a week : " + str((worsened_calls + neither_calls) * (attempts - 1)) ^0
"  none of them can succeed, because nothing between attempts changes" ^0
if worsened_calls > 0:
    "  and " + str(worsened_calls * attempts) + " of the attempts land on a system already refusing them" ^0
"" ^0

# ---- what is knowable at each layer ----
#
# The information is not missing from the program. It is missing from the
# frame where the handler is.

"how many of the six a handler can tell apart" ^0
"  at the call site : " + str(n) + ", the cause is the thing that was raised" ^0
"  at the boundary  : 1, every one arrives as the same wrapped type" ^0
if n > 1:
    "  so the boundary is choosing without the field it would choose on" ^0
"" ^0

# ---- what one distinguishing field would buy ----

"if the raised error carried its cause to the boundary" ^0
"  causes the boundary could route : " + str(n) + ", by construction of the field" ^0
"  responses it could then pick    : " + str(distinct_needs) ^0
"  handlers to write               : " + str(distinct_needs) + ", still all in the one function this team owns" ^0
"  the boundary is the right place; it was the wrong amount of information" ^0
"" ^0

# ---- the control: a layer where one response fits everything ----
#
# A nightly import skips any row it cannot read and continues. Every cause has
# the same correct answer there, so collapsing them loses nothing.

[["bad encoding", 12], ["short row", 30], ["unknown column", 5]] => import_causes
0 => ic
0 => ic_calls
for c in import_causes:
    ic + 1 => ic
    ic_calls + c[1] => ic_calls
"control - a nightly import whose answer is always skip the row" ^0
"  causes : " + str(ic) + ", rows : " + str(ic_calls) + ", distinct responses needed : 1" ^0
"  here one handler for every cause is not a loss, because the causes differ" ^0
"  in nothing the response depends on" ^0
"" ^0

"The boundary is the correct place for a handler and the team that owns it" ^0
"owns nothing further in. What arrives there is one type, and picking one" ^0
"response is what one type leaves available." ^0
```

## Python (deterministic transpilation)

```python
causes = [["network reset", 340, 1, 0, "retry"], ["downstream 500", 210, 1, 0, "retry"], ["malformed payload", 95, 0, 1, "reject and tell the sender"], ["quota exceeded", 60, 0, 1, "back off, then retry"], ["auth token expired", 45, 0, 0, "re-authenticate, then retry"], ["mapper defect", 18, 0, 0, "a code change"]]
n = len(causes)

def occurrences():
    t = 0
    for c in causes:
        t = t + c[1]
    return t

print("distinct causes : " + str(n))
print("failures a week : " + str(occurrences()))
print("the boundary handler does one thing : log it and retry three times")
print("")
helped = 0
worsened = 0
neither = 0
helped_calls = 0
worsened_calls = 0
neither_calls = 0
for c in causes:
    if c[2] == 1:
        helped = helped + 1
        helped_calls = helped_calls + c[1]
    elif c[3] == 1:
        worsened = worsened + 1
        worsened_calls = worsened_calls + c[1]
    else:
        neither = neither + 1
        neither_calls = neither_calls + c[1]
print("what the one response does to each cause")
print("  it is the right answer for   : " + str(helped) + " causes, " + str(helped_calls) + " failures")
print("  it makes things worse for    : " + str(worsened) + " causes, " + str(worsened_calls) + " failures")
print("  it changes nothing for       : " + str(neither) + " causes, " + str(neither_calls) + " failures")
if helped_calls > occurrences() - helped_calls:
    print("  by volume the single response is right more often than not")
else:
    print("  by volume the single response is wrong more often than not")
print("")
print("cause                what it needs")
for c in causes:
    print("  " + c[0] + "   " + c[4])
distinct_needs = 0
seen_needs = []
for c in causes:
    if not c[4] in seen_needs:
        seen_needs = seen_needs + [c[4]]
        distinct_needs = distinct_needs + 1
print("  distinct responses required : " + str(distinct_needs))
print("  responses the boundary can choose between : 1")
print("")
attempts = 3
print("retrying three times, on the causes it does not help")
print("  extra calls a week : " + str((worsened_calls + neither_calls) * (attempts - 1)))
print("  none of them can succeed, because nothing between attempts changes")
if worsened_calls > 0:
    print("  and " + str(worsened_calls * attempts) + " of the attempts land on a system already refusing them")
print("")
print("how many of the six a handler can tell apart")
print("  at the call site : " + str(n) + ", the cause is the thing that was raised")
print("  at the boundary  : 1, every one arrives as the same wrapped type")
if n > 1:
    print("  so the boundary is choosing without the field it would choose on")
print("")
print("if the raised error carried its cause to the boundary")
print("  causes the boundary could route : " + str(n) + ", by construction of the field")
print("  responses it could then pick    : " + str(distinct_needs))
print("  handlers to write               : " + str(distinct_needs) + ", still all in the one function this team owns")
print("  the boundary is the right place; it was the wrong amount of information")
print("")
import_causes = [["bad encoding", 12], ["short row", 30], ["unknown column", 5]]
ic = 0
ic_calls = 0
for c in import_causes:
    ic = ic + 1
    ic_calls = ic_calls + c[1]
print("control - a nightly import whose answer is always skip the row")
print("  causes : " + str(ic) + ", rows : " + str(ic_calls) + ", distinct responses needed : 1")
print("  here one handler for every cause is not a loss, because the causes differ")
print("  in nothing the response depends on")
print("")
print("The boundary is the correct place for a handler and the team that owns it")
print("owns nothing further in. What arrives there is one type, and picking one")
print("response is what one type leaves available.")
```

## stdout (executed)

```text
distinct causes : 6
failures a week : 768
the boundary handler does one thing : log it and retry three times

what the one response does to each cause
  it is the right answer for   : 2 causes, 550 failures
  it makes things worse for    : 2 causes, 155 failures
  it changes nothing for       : 2 causes, 63 failures
  by volume the single response is right more often than not

cause                what it needs
  network reset   retry
  downstream 500   retry
  malformed payload   reject and tell the sender
  quota exceeded   back off, then retry
  auth token expired   re-authenticate, then retry
  mapper defect   a code change
  distinct responses required : 5
  responses the boundary can choose between : 1

retrying three times, on the causes it does not help
  extra calls a week : 436
  none of them can succeed, because nothing between attempts changes
  and 465 of the attempts land on a system already refusing them

how many of the six a handler can tell apart
  at the call site : 6, the cause is the thing that was raised
  at the boundary  : 1, every one arrives as the same wrapped type
  so the boundary is choosing without the field it would choose on

if the raised error carried its cause to the boundary
  causes the boundary could route : 6, by construction of the field
  responses it could then pick    : 5
  handlers to write               : 5, still all in the one function this team owns
  the boundary is the right place; it was the wrong amount of information

control - a nightly import whose answer is always skip the row
  causes : 3, rows : 47, distinct responses needed : 1
  here one handler for every cause is not a loss, because the causes differ
  in nothing the response depends on

The boundary is the correct place for a handler and the team that owns it
owns nothing further in. What arrives there is one type, and picking one
response is what one type leaves available.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
