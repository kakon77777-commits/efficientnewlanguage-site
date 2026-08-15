<!-- canonical: efficientnewlanguage.org/ai/examples/400-the-threshold-was-set-after-seeing-the-result | ai_layer_version: 0.1.0 | updated: 2026-08-15 -->

# Example 400 — The threshold was set after seeing the result - excludes 3 of 10 where a fixed bar excluded 6

`the_threshold_was_set_after_seeing_the_result.eml` enumerates every bar anyone in the room could have defended and asks what the rule can still exclude once the choice is made afterwards.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The bar was "a
# clear improvement". It was decided what clear meant after the number arrived.
#
# Nobody lied and nobody moved a number. The team genuinely did not fix a
# threshold in advance, because fixing one in advance is hard: the right bar
# depends on the cost of shipping, the cost of not shipping, and what else is
# competing for the slot, and none of those were known in week one.
#
# So the bar was chosen in the room where the result was on the screen. Every
# bar that would have been reasonable is enumerated here, and the question
# asked is what the rule can still exclude once the choice is made afterwards.

# Candidate bars anyone in that room could have defended, in tenths of a point.
[5, 10, 15, 20, 25, 30, 40, 50] => bars

# Results a launch could have produced, in tenths.
[-20, -5, 3, 8, 12, 18, 22, 35, 44, 60] => possible

def passes(result, bar):
    if result >= bar:
        return 1
    return 0

def chosen_bar(result):
    for b in bars:
        if passes(result, b) == 1:
            return b
    return -1

def show(x):
    if x < 0:
        return "-" + str(int((0 - x) / 10)) + "." + str((0 - x) % 10)
    return str(int(x / 10)) + "." + str(x % 10)

"bars anyone could have defended : " ^0
"" => line
for b in bars:
    line + show(b) + "  " => line
"  " + line ^0
"" ^0

# ---- a bar fixed in advance ----

"if the bar had been fixed at " + show(20) + " beforehand" ^0
0 => pre_pass
for r in possible:
    pre_pass + passes(r, 20) => pre_pass
"  results that would ship : " + str(pre_pass) + " of " + str(len(possible)) ^0
"  results that would not  : " + str(len(possible) - pre_pass) ^0
"" ^0

# ---- the bar chosen afterwards, from the same list ----

"if the bar is chosen afterwards, from that same list" ^0
0 => post_pass
for r in possible:
    if chosen_bar(r) > 0:
        post_pass + 1 => post_pass
"  results that would ship : " + str(post_pass) + " of " + str(len(possible)) ^0
"" ^0
for r in possible:
    chosen_bar(r) => b
    if b > 0:
        "  result " + show(r) + " -> bar " + show(b) + " -> ship" ^0
    else:
        "  result " + show(r) + " -> no defensible bar clears it -> do not ship" ^0
"" ^0

# ---- what the rule can still exclude ----

len(possible) - post_pass => excluded_post
len(possible) - pre_pass => excluded_pre
"  a fixed bar excludes  : " + str(excluded_pre) + " of " + str(len(possible)) ^0
"  a chosen bar excludes : " + str(excluded_post) + " of " + str(len(possible)) ^0
if excluded_post < excluded_pre:
    "  the rule survived, and the set it can rule out shrank by " + str(excluded_pre - excluded_post) ^0
"" ^0

# ---- which results the after-the-fact rule still rejects ----

"the only results a chosen bar can reject" ^0
for r in possible:
    if chosen_bar(r) < 0:
        "  " + show(r) + "  - below the lowest bar anyone would defend" ^0
"  count : " + str(excluded_post) ^0
if excluded_post > 0:
    "  so the rule is not vacuous - it still stops the clearly bad ones" ^0
"" ^0

# ---- the control: a bar fixed in advance, tested on the same results ----
#
# The rule is not weak because it has a range of defensible values. It is weak
# because the value is picked after the thing it is meant to judge.

"control - every fixed bar, applied to the same results" ^0
for b in bars:
    0 => c
    for r in possible:
        c + passes(r, b) => c
    "  bar " + show(b) + " : ships " + str(c) + " of " + str(len(possible)) ^0
"" ^0
"  every one of those is a real rule that can fail" ^0
"  the chosen-afterwards version is the union of all of them" ^0
"" ^0

"A threshold picked after the result is still a threshold, still defensible," ^0
"and still able to reject something. What it can no longer do is reject the" ^0
"result it was picked for." ^0
```

## Python (deterministic transpilation)

```python
bars = [5, 10, 15, 20, 25, 30, 40, 50]
possible = [-20, -5, 3, 8, 12, 18, 22, 35, 44, 60]

def passes(result, bar):
    if result >= bar:
        return 1
    return 0

def chosen_bar(result):
    for b in bars:
        if passes(result, b) == 1:
            return b
    return -1

def show(x):
    if x < 0:
        return "-" + str(int((0 - x) / 10)) + "." + str((0 - x) % 10)
    return str(int(x / 10)) + "." + str(x % 10)

print("bars anyone could have defended : ")
line = ""
for b in bars:
    line = line + show(b) + "  "
print("  " + line)
print("")
print("if the bar had been fixed at " + show(20) + " beforehand")
pre_pass = 0
for r in possible:
    pre_pass = pre_pass + passes(r, 20)
print("  results that would ship : " + str(pre_pass) + " of " + str(len(possible)))
print("  results that would not  : " + str(len(possible) - pre_pass))
print("")
print("if the bar is chosen afterwards, from that same list")
post_pass = 0
for r in possible:
    if chosen_bar(r) > 0:
        post_pass = post_pass + 1
print("  results that would ship : " + str(post_pass) + " of " + str(len(possible)))
print("")
for r in possible:
    b = chosen_bar(r)
    if b > 0:
        print("  result " + show(r) + " -> bar " + show(b) + " -> ship")
    else:
        print("  result " + show(r) + " -> no defensible bar clears it -> do not ship")
print("")
excluded_post = len(possible) - post_pass
excluded_pre = len(possible) - pre_pass
print("  a fixed bar excludes  : " + str(excluded_pre) + " of " + str(len(possible)))
print("  a chosen bar excludes : " + str(excluded_post) + " of " + str(len(possible)))
if excluded_post < excluded_pre:
    print("  the rule survived, and the set it can rule out shrank by " + str(excluded_pre - excluded_post))
print("")
print("the only results a chosen bar can reject")
for r in possible:
    if chosen_bar(r) < 0:
        print("  " + show(r) + "  - below the lowest bar anyone would defend")
print("  count : " + str(excluded_post))
if excluded_post > 0:
    print("  so the rule is not vacuous - it still stops the clearly bad ones")
print("")
print("control - every fixed bar, applied to the same results")
for b in bars:
    c = 0
    for r in possible:
        c = c + passes(r, b)
    print("  bar " + show(b) + " : ships " + str(c) + " of " + str(len(possible)))
print("")
print("  every one of those is a real rule that can fail")
print("  the chosen-afterwards version is the union of all of them")
print("")
print("A threshold picked after the result is still a threshold, still defensible,")
print("and still able to reject something. What it can no longer do is reject the")
print("result it was picked for.")
```

## stdout (executed)

```text
bars anyone could have defended : 
  0.5  1.0  1.5  2.0  2.5  3.0  4.0  5.0  

if the bar had been fixed at 2.0 beforehand
  results that would ship : 4 of 10
  results that would not  : 6

if the bar is chosen afterwards, from that same list
  results that would ship : 7 of 10

  result -2.0 -> no defensible bar clears it -> do not ship
  result -0.5 -> no defensible bar clears it -> do not ship
  result 0.3 -> no defensible bar clears it -> do not ship
  result 0.8 -> bar 0.5 -> ship
  result 1.2 -> bar 0.5 -> ship
  result 1.8 -> bar 0.5 -> ship
  result 2.2 -> bar 0.5 -> ship
  result 3.5 -> bar 0.5 -> ship
  result 4.4 -> bar 0.5 -> ship
  result 6.0 -> bar 0.5 -> ship

  a fixed bar excludes  : 6 of 10
  a chosen bar excludes : 3 of 10
  the rule survived, and the set it can rule out shrank by 3

the only results a chosen bar can reject
  -2.0  - below the lowest bar anyone would defend
  -0.5  - below the lowest bar anyone would defend
  0.3  - below the lowest bar anyone would defend
  count : 3
  so the rule is not vacuous - it still stops the clearly bad ones

control - every fixed bar, applied to the same results
  bar 0.5 : ships 7 of 10
  bar 1.0 : ships 6 of 10
  bar 1.5 : ships 5 of 10
  bar 2.0 : ships 4 of 10
  bar 2.5 : ships 3 of 10
  bar 3.0 : ships 3 of 10
  bar 4.0 : ships 2 of 10
  bar 5.0 : ships 1 of 10

  every one of those is a real rule that can fail
  the chosen-afterwards version is the union of all of them

A threshold picked after the result is still a threshold, still defensible,
and still able to reject something. What it can no longer do is reject the
result it was picked for.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
