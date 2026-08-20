<!-- canonical: efficientnewlanguage.org/ai/examples/473-the-test-was-shorter-than-the-wrap | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 473 — The test was shorter than the wrap

`the_test_was_shorter_than_the_wrap.eml` - The ordering check compares sequence numbers with a greater-than. How many messages that is correct for is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The ordering
# check compares sequence numbers with a greater-than. How many messages that
# is correct for is computed below.
#
# Comparing sequence numbers directly is the obvious implementation and it is
# right for every message the test suite sends. The numbers go up, later
# messages have bigger numbers, and a greater-than answers "is this newer" in
# one instruction with no state.
#
# The field is sixteen bits, so the numbers do not go up forever - they go up
# and then start again. From the message after that, later messages carry
# smaller numbers, and the comparison answers the opposite of the question.
#
# The message at which it turns over is computed rather than estimated, and the
# two rules are then evaluated at that message rather than by running to it.

65536 => field_size
7 => step
[100, 1000, 5000, 20000] => test_lengths

int(field_size / step) => wrap_at
"sequence field : " + str(field_size) + " values, incrementing by " + str(step) ^0
"messages before the counter passes the end of the field : " + str(wrap_at) ^0
"" ^0

def seq_of(message):
    message * step => raw
    raw - int(raw / field_size) * field_size => v
    return v

def newer_naive(a, b):
    if a > b:
        return 1
    return 0

def newer_modular(a, b):
    a - b => d
    if d < 0:
        d + field_size => d
    if d > 0:
        if d < int(field_size / 2):
            return 1
    return 0

# ---- the messages either side of the turn ----

"message   sequence   previous   naive says newer   modular says newer" ^0
for m in [wrap_at - 2:wrap_at + 2]:
    seq_of(m) => s
    seq_of(m - 1) => p
    "" => a
    if newer_naive(s, p) == 1:
        a + "yes" => a
    else:
        a + "NO " => a
    "" => b
    if newer_modular(s, p) == 1:
        b + "yes" => b
    else:
        b + "NO " => b
    "  " + str(m) + "     " + str(s) + "      " + str(p) + "      " + a + "                " + b ^0
"" ^0

# The turn is arithmetic: the first message whose raw count passes the end of
# the field. Computed, then verified against the rule at that message and the
# one before it.
wrap_at + 1 => first_wrong
0 => verified
if newer_naive(seq_of(first_wrong), seq_of(first_wrong - 1)) == 0:
    if newer_naive(seq_of(first_wrong - 1), seq_of(first_wrong - 2)) == 1:
        1 => verified
if verified == 1:
    "the naive rule first answers wrongly at message " + str(first_wrong) ^0
    "  (computed as " + str(wrap_at) + " + 1, then checked: the rule holds at " + str(first_wrong - 1) + " and fails here)" ^0
    seq_of(first_wrong - 1) => bp
    seq_of(first_wrong) => bs
    "  the sequence goes " + str(bp) + " to " + str(bs) + ": the later message carries the" ^0
    "  smaller number, by " + str(bp - bs) ^0
"" ^0

# ---- which test lengths reach it ----

0 => missed
for m in test_lengths:
    if m < first_wrong:
        missed + 1 => missed
"test lengths that stop before that message : " + str(missed) + " of " + str(len(test_lengths)) ^0
"" => list_missed
for m in test_lengths:
    if m < first_wrong:
        list_missed + str(m) + " " => list_missed
if missed > 0:
    "  " + list_missed ^0
    "  each of those suites passes, and each exercises the rule only on the" ^0
    "  stretch of its domain where it is correct" ^0
"" ^0

# ---- what the passing tests establish ----

"what a suite of " + str(test_lengths[1]) + " messages proves" ^0
"  the rule is right for the first " + str(test_lengths[1]) + " messages : yes" ^0
"  the rule is right                                : not asserted" ^0
int(first_wrong / test_lengths[1]) => factor
"  the suite would have to be about " + str(factor) + " times longer to reach the turn" ^0
"" ^0

# ---- the cost in the field ----

50 => messages_per_second
int(first_wrong / messages_per_second) => seconds_to_wrap
"at " + str(messages_per_second) + " messages a second" ^0
"  the turn arrives after " + str(seconds_to_wrap) + " seconds of traffic" ^0
if seconds_to_wrap < 3600:
    "  which is under an hour, so a peer reaches it on the first day and a" ^0
    "  suite that runs in seconds never does" ^0
"" ^0

# ---- the rule with no horizon ----

0 => naive_right
0 => modular_right
0 => checked
for m in [wrap_at - 4:wrap_at + 4]:
    checked + 1 => checked
    naive_right + newer_naive(seq_of(m), seq_of(m - 1)) => naive_right
    modular_right + newer_modular(seq_of(m), seq_of(m - 1)) => modular_right
"over the " + str(checked) + " messages spanning the turn" ^0
"  naive rule correct   : " + str(naive_right) ^0
"  modular rule correct : " + str(modular_right) ^0
if modular_right > naive_right:
    "  messages the modular rule gets right and the naive one does not : " + str(modular_right - naive_right) ^0
    "  it compares the distance rather than the values, and the distance" ^0
    "  does not wrap" ^0
"" ^0

# ---- the control: a field wide enough never to wrap ----
#
# Where the counter cannot reach the end of its field in the lifetime of the
# system, the naive rule is correct for every message that will ever be sent,
# and no test length can separate the two rules.

1000000000 => wide_field
int(wide_field / step) => wide_wrap
"control - the same rule on a much wider field" ^0
"  messages before the turn : " + str(wide_wrap) ^0
int(wide_wrap / messages_per_second) => wide_seconds
"  at " + str(messages_per_second) + " a second that is " + str(int(wide_seconds / 86400)) + " days of continuous traffic" ^0
if wide_wrap > first_wrong:
    "  the rule is then correct for every message a session will send, and" ^0
    "  the two rules are indistinguishable in practice" ^0
"" ^0

"The comparison is correct for every message the suite sends and for the" ^0
"first " + str(first_wrong - 1) + " a peer sends. The field ends, and the rule has no term" ^0
"for what happens after that." ^0
```

## Python (deterministic transpilation)

```python
field_size = 65536
step = 7
test_lengths = [100, 1000, 5000, 20000]
wrap_at = int(field_size / step)
print("sequence field : " + str(field_size) + " values, incrementing by " + str(step))
print("messages before the counter passes the end of the field : " + str(wrap_at))
print("")

def seq_of(message):
    raw = message * step
    v = raw - int(raw / field_size) * field_size
    return v

def newer_naive(a, b):
    if a > b:
        return 1
    return 0

def newer_modular(a, b):
    d = a - b
    if d < 0:
        d = d + field_size
    if d > 0:
        if d < int(field_size / 2):
            return 1
    return 0

print("message   sequence   previous   naive says newer   modular says newer")
for m in range(wrap_at - 2, wrap_at + 2+1):
    s = seq_of(m)
    p = seq_of(m - 1)
    a = ""
    if newer_naive(s, p) == 1:
        a = a + "yes"
    else:
        a = a + "NO "
    b = ""
    if newer_modular(s, p) == 1:
        b = b + "yes"
    else:
        b = b + "NO "
    print("  " + str(m) + "     " + str(s) + "      " + str(p) + "      " + a + "                " + b)
print("")
first_wrong = wrap_at + 1
verified = 0
if newer_naive(seq_of(first_wrong), seq_of(first_wrong - 1)) == 0:
    if newer_naive(seq_of(first_wrong - 1), seq_of(first_wrong - 2)) == 1:
        verified = 1
if verified == 1:
    print("the naive rule first answers wrongly at message " + str(first_wrong))
    print("  (computed as " + str(wrap_at) + " + 1, then checked: the rule holds at " + str(first_wrong - 1) + " and fails here)")
    bp = seq_of(first_wrong - 1)
    bs = seq_of(first_wrong)
    print("  the sequence goes " + str(bp) + " to " + str(bs) + ": the later message carries the")
    print("  smaller number, by " + str(bp - bs))
print("")
missed = 0
for m in test_lengths:
    if m < first_wrong:
        missed = missed + 1
print("test lengths that stop before that message : " + str(missed) + " of " + str(len(test_lengths)))
list_missed = ""
for m in test_lengths:
    if m < first_wrong:
        list_missed = list_missed + str(m) + " "
if missed > 0:
    print("  " + list_missed)
    print("  each of those suites passes, and each exercises the rule only on the")
    print("  stretch of its domain where it is correct")
print("")
print("what a suite of " + str(test_lengths[1]) + " messages proves")
print("  the rule is right for the first " + str(test_lengths[1]) + " messages : yes")
print("  the rule is right                                : not asserted")
factor = int(first_wrong / test_lengths[1])
print("  the suite would have to be about " + str(factor) + " times longer to reach the turn")
print("")
messages_per_second = 50
seconds_to_wrap = int(first_wrong / messages_per_second)
print("at " + str(messages_per_second) + " messages a second")
print("  the turn arrives after " + str(seconds_to_wrap) + " seconds of traffic")
if seconds_to_wrap < 3600:
    print("  which is under an hour, so a peer reaches it on the first day and a")
    print("  suite that runs in seconds never does")
print("")
naive_right = 0
modular_right = 0
checked = 0
for m in range(wrap_at - 4, wrap_at + 4+1):
    checked = checked + 1
    naive_right = naive_right + newer_naive(seq_of(m), seq_of(m - 1))
    modular_right = modular_right + newer_modular(seq_of(m), seq_of(m - 1))
print("over the " + str(checked) + " messages spanning the turn")
print("  naive rule correct   : " + str(naive_right))
print("  modular rule correct : " + str(modular_right))
if modular_right > naive_right:
    print("  messages the modular rule gets right and the naive one does not : " + str(modular_right - naive_right))
    print("  it compares the distance rather than the values, and the distance")
    print("  does not wrap")
print("")
wide_field = 1000000000
wide_wrap = int(wide_field / step)
print("control - the same rule on a much wider field")
print("  messages before the turn : " + str(wide_wrap))
wide_seconds = int(wide_wrap / messages_per_second)
print("  at " + str(messages_per_second) + " a second that is " + str(int(wide_seconds / 86400)) + " days of continuous traffic")
if wide_wrap > first_wrong:
    print("  the rule is then correct for every message a session will send, and")
    print("  the two rules are indistinguishable in practice")
print("")
print("The comparison is correct for every message the suite sends and for the")
print("first " + str(first_wrong - 1) + " a peer sends. The field ends, and the rule has no term")
print("for what happens after that.")
```

## stdout (executed)

```text
sequence field : 65536 values, incrementing by 7
messages before the counter passes the end of the field : 9362

message   sequence   previous   naive says newer   modular says newer
  9360     65520      65513      yes                yes
  9361     65527      65520      yes                yes
  9362     65534      65527      yes                yes
  9363     5      65534      NO                 yes
  9364     12      5      yes                yes

the naive rule first answers wrongly at message 9363
  (computed as 9362 + 1, then checked: the rule holds at 9362 and fails here)
  the sequence goes 65534 to 5: the later message carries the
  smaller number, by 65529

test lengths that stop before that message : 3 of 4
  100 1000 5000 
  each of those suites passes, and each exercises the rule only on the
  stretch of its domain where it is correct

what a suite of 1000 messages proves
  the rule is right for the first 1000 messages : yes
  the rule is right                                : not asserted
  the suite would have to be about 9 times longer to reach the turn

at 50 messages a second
  the turn arrives after 187 seconds of traffic
  which is under an hour, so a peer reaches it on the first day and a
  suite that runs in seconds never does

over the 9 messages spanning the turn
  naive rule correct   : 8
  modular rule correct : 9
  messages the modular rule gets right and the naive one does not : 1
  it compares the distance rather than the values, and the distance
  does not wrap

control - the same rule on a much wider field
  messages before the turn : 142857142
  at 50 a second that is 33 days of continuous traffic
  the rule is then correct for every message a session will send, and
  the two rules are indistinguishable in practice

The comparison is correct for every message the suite sends and for the
first 9362 a peer sends. The field ends, and the rule has no term
for what happens after that.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:def · eml:call · eml:return · eml:run:done
