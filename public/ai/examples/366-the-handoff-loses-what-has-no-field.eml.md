<!-- canonical: efficientnewlanguage.org/ai/examples/366-the-handoff-loses-what-has-no-field | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 366 — The handoff loses what has no field — 4 of 6 decidable, and one new field bought 0

`the_handoff_loses_what_has_no_field.eml` runs each of the receiver's decisions twice: from the transmitted subset, and from everything the sender knew.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A handoff form
# with good fields, and the facts that have nowhere to go.
#
# The form is the reason the handoff works at all. Without it every report is a
# different shape and the receiver spends their time reconstructing rather than
# acting. The fields were chosen by people who had seen a lot of reports.
#
# They were also chosen before anyone knew which facts this particular report
# would need to carry. A fact with no field is not refused - it is simply not
# asked for, and the sender, filling in a form, does not notice omitting it.
#
# The program runs each decision twice: once from the transmitted subset and
# once from everything the sender knew. The gap is measured, not asserted.
#
# Nothing is declared. Which facts a decision needs is a property of the
# decision, and whether a fact has a field is a property of the form; both are
# read rather than assumed.

# [fact, has a field on the form]
[["the failing input", 1], ["the actual output", 1], ["the expected output", 1], ["the file and line", 1], ["the severity", 1], ["which other inputs were tried and passed", 0], ["how the sender chose those inputs", 0], ["which nearby cases the sender did not run", 0], ["how long the sender searched", 0], ["what the sender assumed the receiver already knew", 0]] => facts

# [decision, facts it needs]
[["reproduce it", ["the failing input"]], ["confirm it is wrong", ["the actual output", "the expected output"]], ["find the cause", ["the file and line", "the failing input"]], ["decide how wide the class is", ["which other inputs were tried and passed", "which nearby cases the sender did not run"]], ["decide whether to keep searching", ["how long the sender searched", "how the sender chose those inputs"]], ["schedule it", ["the severity"]]] => decisions

def has_field(name):
    for f in facts:
        if f[0] == name:
            return f[1]
    return 0

def transmitted(name):
    return has_field(name)

def decidable(needed, use_form):
    for n in needed:
        if use_form == 1:
            if transmitted(n) == 0:
                return 0
        else:
            0 => known
            for f in facts:
                if f[0] == n:
                    1 => known
            if known == 0:
                return 0
    return 1

# ---- what the form carries ----

0 => with_field
0 => without_field
for f in facts:
    if f[1] == 1:
        with_field + 1 => with_field
    else:
        without_field + 1 => without_field
"facts the sender knew : " + str(len(facts)) ^0
"  with a field on the form : " + str(with_field) ^0
"  with no field            : " + str(without_field) ^0
for f in facts:
    if f[1] == 0:
        "    " + f[0] ^0
"" ^0

# ---- what the receiver can decide ----

"decisions, from the form and from everything the sender knew" ^0
0 => ok_form
0 => ok_full
for d in decisions:
    decidable(d[1], 1) => a
    decidable(d[1], 0) => b
    if a == 1:
        ok_form + 1 => ok_form
    if b == 1:
        ok_full + 1 => ok_full
    if a == 1:
        "  " + d[0] + " : decidable from the form" ^0
    else:
        if b == 1:
            "  " + d[0] + " : NOT decidable from the form, decidable from what the sender knew" ^0
        else:
            "  " + d[0] + " : not decidable either way" ^0
"  decidable from the form               : " + str(ok_form) + " of " + str(len(decisions)) ^0
"  decidable from everything the sender knew : " + str(ok_full) + " of " + str(len(decisions)) ^0
"" ^0

# ---- which decisions the missing facts block ----

"decisions blocked purely by a missing field" ^0
0 => blocked
for d in decisions:
    if decidable(d[1], 1) == 0:
        if decidable(d[1], 0) == 1:
            blocked + 1 => blocked
            for n in d[1]:
                if has_field(n) == 0:
                    "  " + d[0] + " needs: " + n ^0
"  total: " + str(blocked) ^0
"" ^0

# ---- adding one field ----
#
# Adding a field is cheap. The constraint is that you can only add a field for
# something you already know you need, which is the same knowledge the missing
# field would have supplied.

def has_field_v2(name):
    if name == "which other inputs were tried and passed":
        return 1
    return has_field(name)

def decidable_v2(needed):
    for n in needed:
        if has_field_v2(n) == 0:
            return 0
    return 1

0 => ok_v2
for d in decisions:
    if decidable_v2(d[1]) == 1:
        ok_v2 + 1 => ok_v2
"after adding one field for the most obviously useful missing fact" ^0
"  decidable : " + str(ok_v2) + " of " + str(len(decisions)) ^0
"  gained    : " + str(ok_v2 - ok_form) ^0
"  still short of what the sender knew : " + str(ok_full - ok_v2) ^0
"" ^0

# ---- the shape of what is lost ----

"the facts with no field, described" ^0
0 => about_the_defect
0 => about_the_search
for f in facts:
    if f[1] == 0:
        if f[0] == "which other inputs were tried and passed":
            about_the_search + 1 => about_the_search
        else:
            if f[0] == "how the sender chose those inputs":
                about_the_search + 1 => about_the_search
            else:
                if f[0] == "which nearby cases the sender did not run":
                    about_the_search + 1 => about_the_search
                else:
                    if f[0] == "how long the sender searched":
                        about_the_search + 1 => about_the_search
                    else:
                        about_the_defect + 1 => about_the_defect
"  about the defect itself : " + str(about_the_defect) ^0
"  about the SEARCH        : " + str(about_the_search) ^0
if about_the_search > about_the_defect:
    "  the form carries the finding and drops the finding process" ^0
"" ^0

"A form is a claim about which facts will matter, made before the facts" ^0
"exist. It is usually right, and the cases where it is wrong are exactly the" ^0
"ones where the sender knew something the receiver needed." ^0
```

## Python (deterministic transpilation)

```python
facts = [["the failing input", 1], ["the actual output", 1], ["the expected output", 1], ["the file and line", 1], ["the severity", 1], ["which other inputs were tried and passed", 0], ["how the sender chose those inputs", 0], ["which nearby cases the sender did not run", 0], ["how long the sender searched", 0], ["what the sender assumed the receiver already knew", 0]]
decisions = [["reproduce it", ["the failing input"]], ["confirm it is wrong", ["the actual output", "the expected output"]], ["find the cause", ["the file and line", "the failing input"]], ["decide how wide the class is", ["which other inputs were tried and passed", "which nearby cases the sender did not run"]], ["decide whether to keep searching", ["how long the sender searched", "how the sender chose those inputs"]], ["schedule it", ["the severity"]]]

def has_field(name):
    for f in facts:
        if f[0] == name:
            return f[1]
    return 0

def transmitted(name):
    return has_field(name)

def decidable(needed, use_form):
    for n in needed:
        if use_form == 1:
            if transmitted(n) == 0:
                return 0
        else:
            known = 0
            for f in facts:
                if f[0] == n:
                    known = 1
            if known == 0:
                return 0
    return 1

with_field = 0
without_field = 0
for f in facts:
    if f[1] == 1:
        with_field = with_field + 1
    else:
        without_field = without_field + 1
print("facts the sender knew : " + str(len(facts)))
print("  with a field on the form : " + str(with_field))
print("  with no field            : " + str(without_field))
for f in facts:
    if f[1] == 0:
        print("    " + f[0])
print("")
print("decisions, from the form and from everything the sender knew")
ok_form = 0
ok_full = 0
for d in decisions:
    a = decidable(d[1], 1)
    b = decidable(d[1], 0)
    if a == 1:
        ok_form = ok_form + 1
    if b == 1:
        ok_full = ok_full + 1
    if a == 1:
        print("  " + d[0] + " : decidable from the form")
    elif b == 1:
        print("  " + d[0] + " : NOT decidable from the form, decidable from what the sender knew")
    else:
        print("  " + d[0] + " : not decidable either way")
print("  decidable from the form               : " + str(ok_form) + " of " + str(len(decisions)))
print("  decidable from everything the sender knew : " + str(ok_full) + " of " + str(len(decisions)))
print("")
print("decisions blocked purely by a missing field")
blocked = 0
for d in decisions:
    if decidable(d[1], 1) == 0:
        if decidable(d[1], 0) == 1:
            blocked = blocked + 1
            for n in d[1]:
                if has_field(n) == 0:
                    print("  " + d[0] + " needs: " + n)
print("  total: " + str(blocked))
print("")

def has_field_v2(name):
    if name == "which other inputs were tried and passed":
        return 1
    return has_field(name)

def decidable_v2(needed):
    for n in needed:
        if has_field_v2(n) == 0:
            return 0
    return 1

ok_v2 = 0
for d in decisions:
    if decidable_v2(d[1]) == 1:
        ok_v2 = ok_v2 + 1
print("after adding one field for the most obviously useful missing fact")
print("  decidable : " + str(ok_v2) + " of " + str(len(decisions)))
print("  gained    : " + str(ok_v2 - ok_form))
print("  still short of what the sender knew : " + str(ok_full - ok_v2))
print("")
print("the facts with no field, described")
about_the_defect = 0
about_the_search = 0
for f in facts:
    if f[1] == 0:
        if f[0] == "which other inputs were tried and passed":
            about_the_search = about_the_search + 1
        elif f[0] == "how the sender chose those inputs":
            about_the_search = about_the_search + 1
        elif f[0] == "which nearby cases the sender did not run":
            about_the_search = about_the_search + 1
        elif f[0] == "how long the sender searched":
            about_the_search = about_the_search + 1
        else:
            about_the_defect = about_the_defect + 1
print("  about the defect itself : " + str(about_the_defect))
print("  about the SEARCH        : " + str(about_the_search))
if about_the_search > about_the_defect:
    print("  the form carries the finding and drops the finding process")
print("")
print("A form is a claim about which facts will matter, made before the facts")
print("exist. It is usually right, and the cases where it is wrong are exactly the")
print("ones where the sender knew something the receiver needed.")
```

## stdout (executed)

```text
facts the sender knew : 10
  with a field on the form : 5
  with no field            : 5
    which other inputs were tried and passed
    how the sender chose those inputs
    which nearby cases the sender did not run
    how long the sender searched
    what the sender assumed the receiver already knew

decisions, from the form and from everything the sender knew
  reproduce it : decidable from the form
  confirm it is wrong : decidable from the form
  find the cause : decidable from the form
  decide how wide the class is : NOT decidable from the form, decidable from what the sender knew
  decide whether to keep searching : NOT decidable from the form, decidable from what the sender knew
  schedule it : decidable from the form
  decidable from the form               : 4 of 6
  decidable from everything the sender knew : 6 of 6

decisions blocked purely by a missing field
  decide how wide the class is needs: which other inputs were tried and passed
  decide how wide the class is needs: which nearby cases the sender did not run
  decide whether to keep searching needs: how long the sender searched
  decide whether to keep searching needs: how the sender chose those inputs
  total: 2

after adding one field for the most obviously useful missing fact
  decidable : 4 of 6
  gained    : 0
  still short of what the sender knew : 2

the facts with no field, described
  about the defect itself : 1
  about the SEARCH        : 4
  the form carries the finding and drops the finding process

A form is a claim about which facts will matter, made before the facts
exist. It is usually right, and the cases where it is wrong are exactly the
ones where the sender knew something the receiver needed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
