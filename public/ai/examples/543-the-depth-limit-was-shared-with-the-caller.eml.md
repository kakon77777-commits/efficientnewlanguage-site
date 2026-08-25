<!-- canonical: efficientnewlanguage.org/ai/examples/543-the-depth-limit-was-shared-with-the-caller | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 543 — The depth limit was shared with the caller

`the_depth_limit_was_shared_with_the_caller.eml` - A recursive tree walker is documented as supporting trees up to 497 levels deep. The same record that passes in the test suite fails in the request handler. What changed between the two is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A recursive tree
# walker is documented as supporting trees up to 497 levels deep. The same
# record that passes in the test suite fails in the request handler. What
# changed between the two is computed below.
#
# Recursion is the right shape for a tree and the iterative rewrite is harder
# to read and easy to get wrong. The limit was measured rather than guessed:
# somebody built trees of increasing depth, found where it broke, wrote the
# number down, and put a guard in front of the walker that rejects anything
# deeper. That is more care than most such functions get.
#
# The measurement was taken from the test harness, where almost nothing is on
# the stack. A recursion limit counts frames for the whole process, not frames
# belonging to this function, so what the walker can survive depends on how
# deep the stack already was when it was called.
#
# That makes the documented number a property of a call site rather than of the
# function, which is not how a number in a docstring reads, and it means a
# change in an unrelated file can lower it without mentioning trees at all.

1000 => frame_limit
2 => frames_per_level
400 => record_depth

# [call site, frames already on the stack when the walker is entered]
[["unit test", 5], ["command line tool", 22], ["nightly batch job", 60], ["request handler", 340], ["request handler, tracing on", 388]] => sites

def supported_depth(base):
    return int((frame_limit - base) / frames_per_level)

def frames_needed(depth):
    return depth * frames_per_level

"the walker" ^0
("  recursion limit, process wide : %s frames" % str(frame_limit))^0
("  frames used per tree level    : %s" % str(frames_per_level))^0
("  documented maximum depth      : %s" % str(supported_depth(5)))^0
("  where that number was measured: unit test" )^0
"" ^0

# ---- the same record from every call site ----

("the record being walked is %s levels deep and needs %s frames" % (str(record_depth), str(frames_needed(record_depth))))^0
"" ^0
"call site                      stack before   supported depth   this record" ^0
0 => passing
0 => failing
for s in sites:
    supported_depth(s[1]) => cap
    "fails" => verdict
    if record_depth <= cap:
        "passes" => verdict
        passing + 1 => passing
    if record_depth > cap:
        failing + 1 => failing
    ("  %-30s %-14s %-17s %s" % (s[0], str(s[1]), str(cap), verdict))^0
"" ^0
("  call sites where it passes : %s" % str(passing))^0
("  call sites where it fails  : %s" % str(failing))^0
"  the record is byte for byte the same in every row" ^0
"" ^0

# ---- the control ----
#
# If the record were malformed, or the walker wrong, the test harness would
# say so. It is the row at the top of the table and it passes.

sites[0] => harness
"control - the same record, run from the test harness" ^0
("  stack before      : %s" % str(harness[1]))^0
("  supported depth   : %s" % str(supported_depth(harness[1])))^0
("  record depth      : %s" % str(record_depth))^0
("  result            : passes, with %s frames to spare" % str(frame_limit - harness[1] - frames_needed(record_depth)))^0
"  so the input is not the variable, and neither is the walker" ^0
"" ^0

# ---- what the tracing flag did ----
#
# Turning on tracing added middleware frames. The change touched no tree code
# and its description mentions no depth.

sites[3] => handler
sites[4] => traced
handler[1] => base_plain
traced[1] => base_traced

"a configuration flag, in another file, owned by another team" ^0
("  frames added by tracing        : %s" % str(base_traced - base_plain))^0
("  supported depth before         : %s" % str(supported_depth(base_plain)))^0
("  supported depth after          : %s" % str(supported_depth(base_traced)))^0
("  depth lost                     : %s" % str(supported_depth(base_plain) - supported_depth(base_traced)))^0
"  records between those two depths that now fail : every one of them" ^0
"  the flag's description does not contain the word depth, because the" ^0
"  flag has nothing to do with depth" ^0
"" ^0

# ---- what the guard checks ----

"the guard in front of the walker" ^0
("  it rejects trees deeper than   : %s" % str(supported_depth(5)))^0
("  it is correct at the call site : unit test" )^0
0 => guard_wrong
for s in sites:
    supported_depth(5) - supported_depth(s[1]) => window
    if window > 0:
        guard_wrong + 1 => guard_wrong
        ("  at %-28s it admits %s depths that fail" % (s[0], str(window)))^0
("  call sites where the guard admits records that will fail : %s of %s" % (str(guard_wrong), str(len(sites))))^0
"  a guard that holds a constant cannot describe a quantity that is shared" ^0
"" ^0

# ---- what the number would have to say ----

"three ways to write the limit down" ^0
"  a constant in a docstring : wrong everywhere except where it was measured" ^0
"  measured at import time   : wrong, import runs at a different stack depth" ^0
"  read at entry to the walk : correct, because that is when the answer exists" ^0
("  the third one gives %s at the unit test and %s in the traced handler" % (str(supported_depth(harness[1])), str(supported_depth(base_traced))))^0
"" ^0

"Recursion is the right shape for a tree and the limit was measured rather" ^0
"than guessed. A recursion limit counts the whole process, so the walker" ^0
("supports %s levels from the test harness and %s from the traced handler:" % (str(supported_depth(harness[1])), str(supported_depth(base_traced))))^0
("the same %s-level record passes at %s call sites and fails at %s." % (str(record_depth), str(passing), str(failing)))^0
```

## Python (deterministic transpilation)

```python
frame_limit = 1000
frames_per_level = 2
record_depth = 400
sites = [["unit test", 5], ["command line tool", 22], ["nightly batch job", 60], ["request handler", 340], ["request handler, tracing on", 388]]

def supported_depth(base):
    return int((frame_limit - base) / frames_per_level)

def frames_needed(depth):
    return depth * frames_per_level

print("the walker")
print("  recursion limit, process wide : %s frames" % str(frame_limit))
print("  frames used per tree level    : %s" % str(frames_per_level))
print("  documented maximum depth      : %s" % str(supported_depth(5)))
print("  where that number was measured: unit test")
print("")
print("the record being walked is %s levels deep and needs %s frames" % (str(record_depth), str(frames_needed(record_depth))))
print("")
print("call site                      stack before   supported depth   this record")
passing = 0
failing = 0
for s in sites:
    cap = supported_depth(s[1])
    verdict = "fails"
    if record_depth <= cap:
        verdict = "passes"
        passing = passing + 1
    if record_depth > cap:
        failing = failing + 1
    print("  %-30s %-14s %-17s %s" % (s[0], str(s[1]), str(cap), verdict))
print("")
print("  call sites where it passes : %s" % str(passing))
print("  call sites where it fails  : %s" % str(failing))
print("  the record is byte for byte the same in every row")
print("")
harness = sites[0]
print("control - the same record, run from the test harness")
print("  stack before      : %s" % str(harness[1]))
print("  supported depth   : %s" % str(supported_depth(harness[1])))
print("  record depth      : %s" % str(record_depth))
print("  result            : passes, with %s frames to spare" % str(frame_limit - harness[1] - frames_needed(record_depth)))
print("  so the input is not the variable, and neither is the walker")
print("")
handler = sites[3]
traced = sites[4]
base_plain = handler[1]
base_traced = traced[1]
print("a configuration flag, in another file, owned by another team")
print("  frames added by tracing        : %s" % str(base_traced - base_plain))
print("  supported depth before         : %s" % str(supported_depth(base_plain)))
print("  supported depth after          : %s" % str(supported_depth(base_traced)))
print("  depth lost                     : %s" % str(supported_depth(base_plain) - supported_depth(base_traced)))
print("  records between those two depths that now fail : every one of them")
print("  the flag's description does not contain the word depth, because the")
print("  flag has nothing to do with depth")
print("")
print("the guard in front of the walker")
print("  it rejects trees deeper than   : %s" % str(supported_depth(5)))
print("  it is correct at the call site : unit test")
guard_wrong = 0
for s in sites:
    window = supported_depth(5) - supported_depth(s[1])
    if window > 0:
        guard_wrong = guard_wrong + 1
        print("  at %-28s it admits %s depths that fail" % (s[0], str(window)))
print("  call sites where the guard admits records that will fail : %s of %s" % (str(guard_wrong), str(len(sites))))
print("  a guard that holds a constant cannot describe a quantity that is shared")
print("")
print("three ways to write the limit down")
print("  a constant in a docstring : wrong everywhere except where it was measured")
print("  measured at import time   : wrong, import runs at a different stack depth")
print("  read at entry to the walk : correct, because that is when the answer exists")
print("  the third one gives %s at the unit test and %s in the traced handler" % (str(supported_depth(harness[1])), str(supported_depth(base_traced))))
print("")
print("Recursion is the right shape for a tree and the limit was measured rather")
print("than guessed. A recursion limit counts the whole process, so the walker")
print("supports %s levels from the test harness and %s from the traced handler:" % (str(supported_depth(harness[1])), str(supported_depth(base_traced))))
print("the same %s-level record passes at %s call sites and fails at %s." % (str(record_depth), str(passing), str(failing)))
```

## stdout (executed)

```text
the walker
  recursion limit, process wide : 1000 frames
  frames used per tree level    : 2
  documented maximum depth      : 497
  where that number was measured: unit test

the record being walked is 400 levels deep and needs 800 frames

call site                      stack before   supported depth   this record
  unit test                      5              497               passes
  command line tool              22             489               passes
  nightly batch job              60             470               passes
  request handler                340            330               fails
  request handler, tracing on    388            306               fails

  call sites where it passes : 3
  call sites where it fails  : 2
  the record is byte for byte the same in every row

control - the same record, run from the test harness
  stack before      : 5
  supported depth   : 497
  record depth      : 400
  result            : passes, with 195 frames to spare
  so the input is not the variable, and neither is the walker

a configuration flag, in another file, owned by another team
  frames added by tracing        : 48
  supported depth before         : 330
  supported depth after          : 306
  depth lost                     : 24
  records between those two depths that now fail : every one of them
  the flag's description does not contain the word depth, because the
  flag has nothing to do with depth

the guard in front of the walker
  it rejects trees deeper than   : 497
  it is correct at the call site : unit test
  at command line tool            it admits 8 depths that fail
  at nightly batch job            it admits 27 depths that fail
  at request handler              it admits 167 depths that fail
  at request handler, tracing on  it admits 191 depths that fail
  call sites where the guard admits records that will fail : 4 of 5
  a guard that holds a constant cannot describe a quantity that is shared

three ways to write the limit down
  a constant in a docstring : wrong everywhere except where it was measured
  measured at import time   : wrong, import runs at a different stack depth
  read at entry to the walk : correct, because that is when the answer exists
  the third one gives 497 at the unit test and 306 in the traced handler

Recursion is the right shape for a tree and the limit was measured rather
than guessed. A recursion limit counts the whole process, so the walker
supports 497 levels from the test harness and 306 from the traced handler:
the same 400-level record passes at 3 call sites and fails at 2.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
