<!-- canonical: efficientnewlanguage.org/ai/examples/464-the-default-swallowed-a-real-zero | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 464 — The default swallowed a real zero

`the_default_swallowed_a_real_zero.eml` - A missing setting falls back to the default. How many settings that are present also fall back is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A missing setting
# falls back to the default. How many settings that are present also fall back
# is computed below.
#
# Defaulting when a field is absent is right and every configuration system
# does it. Callers should not have to write out every key, a sensible default
# is better than an error for an optional setting, and the rule is one line.
#
# The test asks whether the value is empty, not whether it was supplied. Zero,
# the empty string and the empty list are all values somebody may have chosen
# deliberately, and each of them is empty. The rule cannot distinguish "not
# given" from "given as nothing", and one of those wants the default.
#
# Every setting is run through both rules.

# [key, supplied at all, value, the default]
[["retries", 1, 0, 3], ["timeout_s", 1, 30, 30], ["prefix", 1, 0, 0], ["batch_size", 0, 0, 50], ["rate_limit", 1, 0, 100], ["tag", 1, 0, 0], ["workers", 1, 8, 4], ["debug", 0, 0, 0]] => settings

len(settings) => n

# empty means absent
def by_emptiness(s):
    if s[2] == 0:
        return s[3]
    return s[2]

# presence is a separate fact from the value
def by_presence(s):
    if s[1] == 0:
        return s[3]
    return s[2]

"settings : " + str(n) ^0
"" ^0
"key           supplied   value   by emptiness   by presence" ^0
0 => differ
for s in settings:
    "" => sup
    if s[1] == 1:
        sup + "yes" => sup
    else:
        sup + "no " => sup
    by_emptiness(s) => a
    by_presence(s) => b
    if not (a == b):
        differ + 1 => differ
    "  " + s[0] + "      " + sup + "        " + str(s[2]) + "       " + str(a) + "             " + str(b) ^0
"" ^0

"settings the two rules disagree about : " + str(differ) + " of " + str(n) ^0
if differ > 0:
    "  each of those was supplied as 0 and is being read as the default" ^0
"" ^0

# ---- which of the disagreements matter ----

0 => harmful
for s in settings:
    if s[1] == 1:
        if s[2] == 0:
            if not (s[3] == 0):
                harmful + 1 => harmful
"supplied as 0 with a non-zero default : " + str(harmful) ^0
for s in settings:
    if s[1] == 1:
        if s[2] == 0:
            if not (s[3] == 0):
                "  " + s[0] + " : asked for 0, will run at " + str(s[3]) ^0
"" ^0

0 => harmless
for s in settings:
    if s[1] == 1:
        if s[2] == 0:
            if s[3] == 0:
                harmless + 1 => harmless
"supplied as 0 where the default is also 0 : " + str(harmless) ^0
if harmless > 0:
    "  the rule is wrong about these too, and nothing observable follows" ^0
    "  from it, so they will not appear in any bug report" ^0
"" ^0

# ---- what asking for zero means ----

"what each of the disagreeing settings was asking for" ^0
"  retries 0    : do not retry, which is a real policy" ^0
"  rate_limit 0 : unlimited or disabled, depending on the system" ^0
for s2 in settings:
    if s2[0] == "retries":
        "  retries has a default of " + str(s2[3]) + ", so a caller asking for none gets " + str(s2[3]) ^0
"" ^0

# ---- what the fix costs ----
#
# Not a redesign. The presence flag already exists in the parsed input; the
# rule is reading the value instead of it.

"the two tests, side by side" ^0
"  value is empty  : one comparison against the value" ^0
"  key is absent   : one lookup in the same parsed object" ^0
"  both are one line and only one of them answers the question asked" ^0
"" ^0

# ---- the control: a setting whose zero is meaningless ----
#
# Where zero is not a value anybody would choose, the two rules agree on
# every input and the distinction cannot be observed.

[["page_size", 1, 25, 25], ["page_size_missing", 0, 0, 25]] => sane
0 => s_differ
for s in sane:
    if not (by_emptiness(s) == by_presence(s)):
        s_differ + 1 => s_differ
"control - a setting where 0 is not a choice anybody makes" ^0
"  disagreements : " + str(s_differ) + " of " + str(len(sane)) ^0
if s_differ == 0:
    "  the two rules agree everywhere here, so this setting cannot show the" ^0
    "  difference between absent and zero" ^0
"" ^0

"Defaulting an absent setting is correct and the rule is one line. It tests" ^0
"the value where the question is about the key, and zero is a value somebody" ^0
"typed." ^0
```

## Python (deterministic transpilation)

```python
settings = [["retries", 1, 0, 3], ["timeout_s", 1, 30, 30], ["prefix", 1, 0, 0], ["batch_size", 0, 0, 50], ["rate_limit", 1, 0, 100], ["tag", 1, 0, 0], ["workers", 1, 8, 4], ["debug", 0, 0, 0]]
n = len(settings)

def by_emptiness(s):
    if s[2] == 0:
        return s[3]
    return s[2]

def by_presence(s):
    if s[1] == 0:
        return s[3]
    return s[2]

print("settings : " + str(n))
print("")
print("key           supplied   value   by emptiness   by presence")
differ = 0
for s in settings:
    sup = ""
    if s[1] == 1:
        sup = sup + "yes"
    else:
        sup = sup + "no "
    a = by_emptiness(s)
    b = by_presence(s)
    if not a == b:
        differ = differ + 1
    print("  " + s[0] + "      " + sup + "        " + str(s[2]) + "       " + str(a) + "             " + str(b))
print("")
print("settings the two rules disagree about : " + str(differ) + " of " + str(n))
if differ > 0:
    print("  each of those was supplied as 0 and is being read as the default")
print("")
harmful = 0
for s in settings:
    if s[1] == 1:
        if s[2] == 0:
            if not s[3] == 0:
                harmful = harmful + 1
print("supplied as 0 with a non-zero default : " + str(harmful))
for s in settings:
    if s[1] == 1:
        if s[2] == 0:
            if not s[3] == 0:
                print("  " + s[0] + " : asked for 0, will run at " + str(s[3]))
print("")
harmless = 0
for s in settings:
    if s[1] == 1:
        if s[2] == 0:
            if s[3] == 0:
                harmless = harmless + 1
print("supplied as 0 where the default is also 0 : " + str(harmless))
if harmless > 0:
    print("  the rule is wrong about these too, and nothing observable follows")
    print("  from it, so they will not appear in any bug report")
print("")
print("what each of the disagreeing settings was asking for")
print("  retries 0    : do not retry, which is a real policy")
print("  rate_limit 0 : unlimited or disabled, depending on the system")
for s2 in settings:
    if s2[0] == "retries":
        print("  retries has a default of " + str(s2[3]) + ", so a caller asking for none gets " + str(s2[3]))
print("")
print("the two tests, side by side")
print("  value is empty  : one comparison against the value")
print("  key is absent   : one lookup in the same parsed object")
print("  both are one line and only one of them answers the question asked")
print("")
sane = [["page_size", 1, 25, 25], ["page_size_missing", 0, 0, 25]]
s_differ = 0
for s in sane:
    if not by_emptiness(s) == by_presence(s):
        s_differ = s_differ + 1
print("control - a setting where 0 is not a choice anybody makes")
print("  disagreements : " + str(s_differ) + " of " + str(len(sane)))
if s_differ == 0:
    print("  the two rules agree everywhere here, so this setting cannot show the")
    print("  difference between absent and zero")
print("")
print("Defaulting an absent setting is correct and the rule is one line. It tests")
print("the value where the question is about the key, and zero is a value somebody")
print("typed.")
```

## stdout (executed)

```text
settings : 8

key           supplied   value   by emptiness   by presence
  retries      yes        0       3             0
  timeout_s      yes        30       30             30
  prefix      yes        0       0             0
  batch_size      no         0       50             50
  rate_limit      yes        0       100             0
  tag      yes        0       0             0
  workers      yes        8       8             8
  debug      no         0       0             0

settings the two rules disagree about : 2 of 8
  each of those was supplied as 0 and is being read as the default

supplied as 0 with a non-zero default : 2
  retries : asked for 0, will run at 3
  rate_limit : asked for 0, will run at 100

supplied as 0 where the default is also 0 : 2
  the rule is wrong about these too, and nothing observable follows
  from it, so they will not appear in any bug report

what each of the disagreeing settings was asking for
  retries 0    : do not retry, which is a real policy
  rate_limit 0 : unlimited or disabled, depending on the system
  retries has a default of 3, so a caller asking for none gets 3

the two tests, side by side
  value is empty  : one comparison against the value
  key is absent   : one lookup in the same parsed object
  both are one line and only one of them answers the question asked

control - a setting where 0 is not a choice anybody makes
  disagreements : 0 of 2
  the two rules agree everywhere here, so this setting cannot show the
  difference between absent and zero

Defaulting an absent setting is correct and the rule is one line. It tests
the value where the question is about the key, and zero is a value somebody
typed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
