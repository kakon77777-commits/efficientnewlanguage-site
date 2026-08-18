<!-- canonical: efficientnewlanguage.org/ai/examples/438-the-fix-was-applied-to-the-input-instead | ai_layer_version: 0.1.0 | updated: 2026-08-18 -->

# Example 438 — The fix was applied to the input instead

`the_fix_was_applied_to_the_input_instead.eml` - The consumer belongs to another team, so the input is cleaned before it gets there. What that covers is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The consumer
# belongs to another team, so the input is cleaned before it gets there. What
# that covers is computed below.
#
# Cleaning at the edge was the right call. It shipped without a cross-team
# ticket, it fixed every shape that was actually breaking, and an edge that
# normalises its input is a reasonable design and not a workaround by itself.
#
# A sanitiser is a list of shapes somebody has seen. It handles those and
# passes everything else through unchanged, which is the same behaviour as
# having no sanitiser for exactly the inputs nobody has met yet. Meanwhile the
# consumer's own guard stops being reached for the handled shapes, so how it
# behaves is no longer being observed.
#
# Both defences are scored per shape against the same traffic.

# [shape, items per day, the sanitiser knows it, the consumer's guard handles it]
[["trailing whitespace", 900, 1, 1], ["empty string for a number", 420, 1, 1], ["null in a required field", 260, 1, 0], ["date as dd/mm/yyyy", 180, 1, 1], ["nested object where a scalar goes", 55, 0, 1], ["array with one element", 30, 0, 0], ["unicode digits", 12, 0, 0]] => shapes

len(shapes) => n

def items():
    0 => t
    for s in shapes:
        t + s[1] => t
    return t

"malformed shapes seen : " + str(n) ^0
"items a day           : " + str(items()) ^0
"" ^0

0 => known
0 => known_items
0 => unknown_items
for s in shapes:
    if s[2] == 1:
        known + 1 => known
        known_items + s[1] => known_items
    else:
        unknown_items + s[1] => unknown_items

"the sanitiser" ^0
"  shapes it knows : " + str(known) + " of " + str(n) ^0
"  items it fixes  : " + str(known_items) + " of " + str(items()) + ", which is " + str(int(known_items * 100 / items())) + "%" ^0
"  items it passes through unchanged : " + str(unknown_items) ^0
"" ^0

# ---- what reaches the consumer, and what happens there ----

0 => reaches_guarded
0 => reaches_unguarded
for s in shapes:
    if s[2] == 0:
        if s[3] == 1:
            reaches_guarded + s[1] => reaches_guarded
        else:
            reaches_unguarded + s[1] => reaches_unguarded

"of the items the sanitiser does not know" ^0
"  the consumer's own guard handles : " + str(reaches_guarded) ^0
"  nothing handles                  : " + str(reaches_unguarded) ^0
if reaches_unguarded > 0:
    "  so " + str(reaches_unguarded) + " items a day are defended by neither" ^0
"" ^0

"shape                              sanitiser   consumer guard" ^0
for s in shapes:
    "" => a
    if s[2] == 1:
        a + "yes" => a
    else:
        a + "no " => a
    "" => b
    if s[3] == 1:
        b + "yes" => b
    else:
        b + "no " => b
    "  " + s[0] + "   " + a + "         " + b ^0
"" ^0

# ---- what stopped being exercised ----
#
# The consumer's guard used to fire on every handled shape. It still exists,
# it is still correct as far as anyone knows, and nothing runs it any more.

0 => guard_before
0 => guard_after
for s in shapes:
    if s[3] == 1:
        guard_before + s[1] => guard_before
        if s[2] == 0:
            guard_after + s[1] => guard_after
"the consumer's guard, items reaching it per day" ^0
"  before the sanitiser : " + str(guard_before) ^0
"  after the sanitiser  : " + str(guard_after) ^0
if guard_after < guard_before:
    "  down " + str(guard_before - guard_after) + ", so " + str(int((guard_before - guard_after) * 100 / guard_before)) + "% of its evidence is gone" ^0
"  it has not changed and nobody knows whether it still works" ^0
"" ^0

# ---- a shape nobody has seen yet ----
#
# The next new shape is by definition not on the sanitiser's list, so the
# question is only what the consumer does with it, which is the question the
# sanitiser stopped answering.

"when a new malformed shape appears tomorrow" ^0
"  the sanitiser knows it : no, by definition" ^0
"  the defence that runs  : the consumer's guard" ^0
"  the last time that path ran on a shape it was written for : before the" ^0
"  sanitiser shipped" ^0
"" ^0

# ---- what fixing the consumer would have covered ----

0 => consumer_covers
for s in shapes:
    if s[3] == 1:
        consumer_covers + s[1] => consumer_covers
"the two defences compared on today's traffic" ^0
"  sanitiser alone : " + str(known_items) + " items" ^0
"  consumer alone  : " + str(consumer_covers) + " items" ^0
if known_items > consumer_covers:
    "  the sanitiser covers more of what is arriving now, by " + str(known_items - consumer_covers) ^0
else:
    "  the consumer covers more of what is arriving now, by " + str(consumer_covers - known_items) ^0
"  and only one of the two is reached by a shape neither has met" ^0
"" ^0

# ---- the control: a sanitiser that rejects what it does not know ----
#
# An allowlist has no pass-through case, so an unseen shape is a rejection
# rather than a delivery, and the unknown column is empty by construction.

0 => allow_rejected
for s in shapes:
    if s[2] == 0:
        allow_rejected + s[1] => allow_rejected
"control - the same sanitiser rejecting anything not on its list" ^0
"  items rejected at the edge : " + str(allow_rejected) ^0
"  items reaching the consumer malformed : 0" ^0
if allow_rejected == unknown_items:
    "  the same items, arriving as a refusal instead of as a surprise" ^0
"  it costs a rejection for every shape that was merely unusual" ^0
"" ^0

"The sanitiser fixed every shape that was breaking and shipped the same week." ^0
"What it handles is what somebody has already seen, and it made the defence" ^0
"behind it stop being watched." ^0
```

## Python (deterministic transpilation)

```python
shapes = [["trailing whitespace", 900, 1, 1], ["empty string for a number", 420, 1, 1], ["null in a required field", 260, 1, 0], ["date as dd/mm/yyyy", 180, 1, 1], ["nested object where a scalar goes", 55, 0, 1], ["array with one element", 30, 0, 0], ["unicode digits", 12, 0, 0]]
n = len(shapes)

def items():
    t = 0
    for s in shapes:
        t = t + s[1]
    return t

print("malformed shapes seen : " + str(n))
print("items a day           : " + str(items()))
print("")
known = 0
known_items = 0
unknown_items = 0
for s in shapes:
    if s[2] == 1:
        known = known + 1
        known_items = known_items + s[1]
    else:
        unknown_items = unknown_items + s[1]
print("the sanitiser")
print("  shapes it knows : " + str(known) + " of " + str(n))
print("  items it fixes  : " + str(known_items) + " of " + str(items()) + ", which is " + str(int(known_items * 100 / items())) + "%")
print("  items it passes through unchanged : " + str(unknown_items))
print("")
reaches_guarded = 0
reaches_unguarded = 0
for s in shapes:
    if s[2] == 0:
        if s[3] == 1:
            reaches_guarded = reaches_guarded + s[1]
        else:
            reaches_unguarded = reaches_unguarded + s[1]
print("of the items the sanitiser does not know")
print("  the consumer's own guard handles : " + str(reaches_guarded))
print("  nothing handles                  : " + str(reaches_unguarded))
if reaches_unguarded > 0:
    print("  so " + str(reaches_unguarded) + " items a day are defended by neither")
print("")
print("shape                              sanitiser   consumer guard")
for s in shapes:
    a = ""
    if s[2] == 1:
        a = a + "yes"
    else:
        a = a + "no "
    b = ""
    if s[3] == 1:
        b = b + "yes"
    else:
        b = b + "no "
    print("  " + s[0] + "   " + a + "         " + b)
print("")
guard_before = 0
guard_after = 0
for s in shapes:
    if s[3] == 1:
        guard_before = guard_before + s[1]
        if s[2] == 0:
            guard_after = guard_after + s[1]
print("the consumer's guard, items reaching it per day")
print("  before the sanitiser : " + str(guard_before))
print("  after the sanitiser  : " + str(guard_after))
if guard_after < guard_before:
    print("  down " + str(guard_before - guard_after) + ", so " + str(int((guard_before - guard_after) * 100 / guard_before)) + "% of its evidence is gone")
print("  it has not changed and nobody knows whether it still works")
print("")
print("when a new malformed shape appears tomorrow")
print("  the sanitiser knows it : no, by definition")
print("  the defence that runs  : the consumer's guard")
print("  the last time that path ran on a shape it was written for : before the")
print("  sanitiser shipped")
print("")
consumer_covers = 0
for s in shapes:
    if s[3] == 1:
        consumer_covers = consumer_covers + s[1]
print("the two defences compared on today's traffic")
print("  sanitiser alone : " + str(known_items) + " items")
print("  consumer alone  : " + str(consumer_covers) + " items")
if known_items > consumer_covers:
    print("  the sanitiser covers more of what is arriving now, by " + str(known_items - consumer_covers))
else:
    print("  the consumer covers more of what is arriving now, by " + str(consumer_covers - known_items))
print("  and only one of the two is reached by a shape neither has met")
print("")
allow_rejected = 0
for s in shapes:
    if s[2] == 0:
        allow_rejected = allow_rejected + s[1]
print("control - the same sanitiser rejecting anything not on its list")
print("  items rejected at the edge : " + str(allow_rejected))
print("  items reaching the consumer malformed : 0")
if allow_rejected == unknown_items:
    print("  the same items, arriving as a refusal instead of as a surprise")
print("  it costs a rejection for every shape that was merely unusual")
print("")
print("The sanitiser fixed every shape that was breaking and shipped the same week.")
print("What it handles is what somebody has already seen, and it made the defence")
print("behind it stop being watched.")
```

## stdout (executed)

```text
malformed shapes seen : 7
items a day           : 1857

the sanitiser
  shapes it knows : 4 of 7
  items it fixes  : 1760 of 1857, which is 94%
  items it passes through unchanged : 97

of the items the sanitiser does not know
  the consumer's own guard handles : 55
  nothing handles                  : 42
  so 42 items a day are defended by neither

shape                              sanitiser   consumer guard
  trailing whitespace   yes         yes
  empty string for a number   yes         yes
  null in a required field   yes         no 
  date as dd/mm/yyyy   yes         yes
  nested object where a scalar goes   no          yes
  array with one element   no          no 
  unicode digits   no          no 

the consumer's guard, items reaching it per day
  before the sanitiser : 1555
  after the sanitiser  : 55
  down 1500, so 96% of its evidence is gone
  it has not changed and nobody knows whether it still works

when a new malformed shape appears tomorrow
  the sanitiser knows it : no, by definition
  the defence that runs  : the consumer's guard
  the last time that path ran on a shape it was written for : before the
  sanitiser shipped

the two defences compared on today's traffic
  sanitiser alone : 1760 items
  consumer alone  : 1555 items
  the sanitiser covers more of what is arriving now, by 205
  and only one of the two is reached by a shape neither has met

control - the same sanitiser rejecting anything not on its list
  items rejected at the edge : 97
  items reaching the consumer malformed : 0
  the same items, arriving as a refusal instead of as a surprise
  it costs a rejection for every shape that was merely unusual

The sanitiser fixed every shape that was breaking and shipped the same week.
What it handles is what somebody has already seen, and it made the defence
behind it stop being watched.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
