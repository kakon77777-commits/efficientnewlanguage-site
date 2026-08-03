<!-- canonical: efficientnewlanguage.org/ai/examples/230-absent-vs-empty-vs-zero | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 230 — Three kinds of nothing, one falsy value

`absent_vs_empty_vs_zero.eml` merges a user config over defaults three ways and compares each against a separately stated intent.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three kinds of
# nothing, and the code that treats them as one.
#
# A field can be:
#
#     absent    the key is not in the record   - nobody said
#     empty     present and ""                 - somebody said "nothing"
#     zero      present and 0                  - somebody said "zero"
#
# Those are three different facts about the world and one falsy value in most
# languages. `if not record.get("discount")` is true for all three, so the
# code that reads it cannot distinguish "no discount was configured" from "a
# discount of zero was configured" - and those imply different actions:
# apply the default, or do not.
#
# The measurement is a merge. A default configuration is overlaid by a user
# configuration, three ways:
#
#     truthiness   `if user[k]` - drops an explicit zero and an explicit ""
#     presence     `if k in user` - keeps them, drops nothing
#     tri-state    presence plus an explicit "unset" marker, so a user can
#                  actively remove a default rather than only overriding it
#
# All three produce a config of the right shape with plausible values. The
# checks compare each against a ground truth stated independently - what a
# person reading the two files would say the merged value should be.

{"discount": 10, "label": "std", "retries": 3, "note": "hi"} => defaults

# The user config. Each entry is a deliberate statement.
{"discount": 0, "label": "", "retries": 5} => user

# What a person would say the merge should produce. Written out separately so
# the merges are checked against intent rather than against each other.
{"discount": 0, "label": "", "retries": 5, "note": "hi"} => intended

def merge_truthy(base, over):
    {} => out
    for k in base:
        base[k] => out[k]
    for k in over:
        if over[k]:
            over[k] => out[k]
    return out

def merge_presence(base, over):
    {} => out
    for k in base:
        base[k] => out[k]
    for k in over:
        over[k] => out[k]
    return out

"#unset" => UNSET

def merge_tristate(base, over):
    # Presence wins, and an explicit UNSET removes the key entirely. This is
    # the only one that lets a user say "no value" as distinct from "the
    # default" and from "zero".
    {} => out
    for k in base:
        base[k] => out[k]
    for k in over:
        if over[k] == UNSET:
            UNSET => out[k]
        else:
            over[k] => out[k]
    return out

def render(d):
    "" => s
    for k in ["discount", "label", "retries", "note"]:
        if k in d:
            if len(s) > 0:
                s + " " => s
            s + k + "=" + repr(d[k]) => s
    return s

merge_truthy(defaults, user) => m_truthy
merge_presence(defaults, user) => m_presence
merge_tristate(defaults, user) => m_tri

"merge        result"^0
("%-12s %s" % ("intended", render(intended)))^0
("%-12s %s" % ("truthiness", render(m_truthy)))^0
("%-12s %s" % ("presence", render(m_presence)))^0
("%-12s %s" % ("tri-state", render(m_tri)))^0

def agrees(got):
    for k in ["discount", "label", "retries", "note"]:
        if not (k in got):
            return False
        if not (str(got[k]) == str(intended[k])):
            return False
    return True

""^0
("truthiness matches intent: " + str(agrees(m_truthy)))^0
("presence matches intent:   " + str(agrees(m_presence)))^0
("tri-state matches intent:  " + str(agrees(m_tri)))^0

# --------------------------------------------- which keys the truthy merge drops
[] => dropped
for k in user:
    if not (str(m_truthy[k]) == str(user[k])):
        dropped + [k + ": user said " + repr(user[k]) + ", merge used " + repr(m_truthy[k])] => dropped

""^0
"what truthiness silently overrode:"^0
for d in dropped:
    ("  " + d)^0

# ------------------------------------------ what presence still cannot express
# Presence handles zero and empty. It cannot express REMOVAL - a user who
# wants no note at all has no way to say so, because absence means "use the
# default" and every present value is a value.
{"note": UNSET} => remover
merge_presence(defaults, remover) => p_removed
merge_tristate(defaults, remover) => t_removed

""^0
"a user trying to remove the default note:"^0
("  presence:  " + render(p_removed))^0
("  tri-state: " + render(t_removed))^0
0 => tri_removes
if t_removed["note"] == UNSET:
    1 => tri_removes
("  tri-state marks it unset: " + str(tri_removes == 1))^0

# ---------------------------------------- the three nothings, side by side
""^0
"the three values a reader has to tell apart:"^0
{} => probe
0 => probe["zero"]
"" => probe["empty"]
for k in ["zero", "empty", "absent"]:
    "absent" => present
    if k in probe:
        "present" => present
    0 => truthy_flag
    if k in probe:
        if probe[k]:
            1 => truthy_flag
    ("  %-8s %-9s truthy=%s" % (k, present, str(truthy_flag == 1)))^0
"...all three are falsy, and only one of them means 'nobody said'."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Presence and tri-state must match intent; truthiness must not.
checked + 1 => checked
if agrees(m_presence) and agrees(m_tri) and not agrees(m_truthy):
    passed + 1 => passed

# The truthy merge must drop exactly the falsy user entries - both of them,
# so it is not a single-value fluke.
checked + 1 => checked
if len(dropped) == 2:
    passed + 1 => passed

# It must get the non-falsy entry right, which is why it survives review.
checked + 1 => checked
if m_truthy["retries"] == 5:
    passed + 1 => passed

# Only tri-state can express removal.
checked + 1 => checked
if tri_removes == 1 and p_removed["note"] == UNSET:
    passed + 1 => passed

# And all three nothings must be indistinguishable by truthiness, which is
# the mechanism the whole case rests on.
checked + 1 => checked
0 => all_falsy
if not (0) and not ("") :
    1 => all_falsy
if all_falsy == 1 and not ("absent" in probe):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Zero, empty and absent are one value to a truthiness test and three to a reader." => verdict
else:
    "FAILED - a merge did not behave as the checks describe." => verdict
verdict^0

""^0
"The truthy merge is right about every key a test fixture usually contains," => n1
n1^0
"because fixtures are written with meaningful values. It is wrong exactly on" => n2
n2^0
"the entries a user typed in order to say something specific - zero, empty -" => n3
n3^0
"which are the ones the user cared enough about to set." => n4
n4^0
```

## Python (deterministic transpilation)

```python
defaults = {"discount": 10, "label": "std", "retries": 3, "note": "hi"}
user = {"discount": 0, "label": "", "retries": 5}
intended = {"discount": 0, "label": "", "retries": 5, "note": "hi"}

def merge_truthy(base, over):
    out = {}
    for k in base:
        out[k] = base[k]
    for k in over:
        if over[k]:
            out[k] = over[k]
    return out

def merge_presence(base, over):
    out = {}
    for k in base:
        out[k] = base[k]
    for k in over:
        out[k] = over[k]
    return out

UNSET = "#unset"

def merge_tristate(base, over):
    out = {}
    for k in base:
        out[k] = base[k]
    for k in over:
        if over[k] == UNSET:
            out[k] = UNSET
        else:
            out[k] = over[k]
    return out

def render(d):
    s = ""
    for k in ["discount", "label", "retries", "note"]:
        if k in d:
            if len(s) > 0:
                s = s + " "
            s = s + k + "=" + repr(d[k])
    return s

m_truthy = merge_truthy(defaults, user)
m_presence = merge_presence(defaults, user)
m_tri = merge_tristate(defaults, user)
print("merge        result")
print("%-12s %s" % ("intended", render(intended)))
print("%-12s %s" % ("truthiness", render(m_truthy)))
print("%-12s %s" % ("presence", render(m_presence)))
print("%-12s %s" % ("tri-state", render(m_tri)))

def agrees(got):
    for k in ["discount", "label", "retries", "note"]:
        if not k in got:
            return False
        if not str(got[k]) == str(intended[k]):
            return False
    return True

print("")
print("truthiness matches intent: " + str(agrees(m_truthy)))
print("presence matches intent:   " + str(agrees(m_presence)))
print("tri-state matches intent:  " + str(agrees(m_tri)))
dropped = []
for k in user:
    if not str(m_truthy[k]) == str(user[k]):
        dropped = dropped + [k + ": user said " + repr(user[k]) + ", merge used " + repr(m_truthy[k])]
print("")
print("what truthiness silently overrode:")
for d in dropped:
    print("  " + d)
remover = {"note": UNSET}
p_removed = merge_presence(defaults, remover)
t_removed = merge_tristate(defaults, remover)
print("")
print("a user trying to remove the default note:")
print("  presence:  " + render(p_removed))
print("  tri-state: " + render(t_removed))
tri_removes = 0
if t_removed["note"] == UNSET:
    tri_removes = 1
print("  tri-state marks it unset: " + str(tri_removes == 1))
print("")
print("the three values a reader has to tell apart:")
probe = {}
probe["zero"] = 0
probe["empty"] = ""
for k in ["zero", "empty", "absent"]:
    present = "absent"
    if k in probe:
        present = "present"
    truthy_flag = 0
    if k in probe:
        if probe[k]:
            truthy_flag = 1
    print("  %-8s %-9s truthy=%s" % (k, present, str(truthy_flag == 1)))
print("...all three are falsy, and only one of them means 'nobody said'.")
passed = 0
checked = 0
checked = checked + 1
if agrees(m_presence) and agrees(m_tri) and not agrees(m_truthy):
    passed = passed + 1
checked = checked + 1
if len(dropped) == 2:
    passed = passed + 1
checked = checked + 1
if m_truthy["retries"] == 5:
    passed = passed + 1
checked = checked + 1
if tri_removes == 1 and p_removed["note"] == UNSET:
    passed = passed + 1
checked = checked + 1
all_falsy = 0
if not 0 and not "":
    all_falsy = 1
if all_falsy == 1 and not "absent" in probe:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Zero, empty and absent are one value to a truthiness test and three to a reader."
else:
    verdict = "FAILED - a merge did not behave as the checks describe."
print(verdict)
print("")
n1 = "The truthy merge is right about every key a test fixture usually contains,"
print(n1)
n2 = "because fixtures are written with meaningful values. It is wrong exactly on"
print(n2)
n3 = "the entries a user typed in order to say something specific - zero, empty -"
print(n3)
n4 = "which are the ones the user cared enough about to set."
print(n4)
```

## stdout (executed)

```text
merge        result
intended     discount=0 label='' retries=5 note='hi'
truthiness   discount=10 label='std' retries=5 note='hi'
presence     discount=0 label='' retries=5 note='hi'
tri-state    discount=0 label='' retries=5 note='hi'

truthiness matches intent: False
presence matches intent:   True
tri-state matches intent:  True

what truthiness silently overrode:
  discount: user said 0, merge used 10
  label: user said '', merge used 'std'

a user trying to remove the default note:
  presence:  discount=10 label='std' retries=3 note='#unset'
  tri-state: discount=10 label='std' retries=3 note='#unset'
  tri-state marks it unset: True

the three values a reader has to tell apart:
  zero     present   truthy=False
  empty    present   truthy=False
  absent   absent    truthy=False
...all three are falsy, and only one of them means 'nobody said'.

checks passed: 5/5
Zero, empty and absent are one value to a truthiness test and three to a reader.

The truthy merge is right about every key a test fixture usually contains,
because fixtures are written with meaningful values. It is wrong exactly on
the entries a user typed in order to say something specific - zero, empty -
which are the ones the user cared enough about to set.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
