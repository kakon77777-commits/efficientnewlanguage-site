<!-- canonical: efficientnewlanguage.org/ai/examples/410-the-lesson-was-filed-where-nobody-looks | ai_layer_version: 0.1.0 | updated: 2026-08-16 -->

# Example 410 — The lesson was filed where nobody looks - 3 of 7 places reach the person who needs it

`the_lesson_was_filed_where_nobody_looks.eml` scores each place a lesson can live by the same three properties and computes the reach rather than arguing it.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The document is
# correct, findable, and read by nobody at the moment it would help.
#
# Writing it down is the recommendation every postmortem ends with, and the
# document that follows is genuinely good: accurate, specific, and indexed.
# Someone searching for it will find it.
#
# Searching for it requires knowing it exists, and the people who hit this
# problem are by definition the ones who did not know. So the question is not
# whether the lesson was recorded - it was - but whether the recording is on
# the path anyone walks when the situation arises.
#
# Each place a lesson can live is scored by the same three properties, and the
# reach is computed from them rather than argued.

# [place, is it read at the moment of need, does it require knowing it exists, does it survive staff turnover]
[["a wiki page", 0, 1, 1], ["the postmortem document", 0, 1, 1], ["a team chat message", 0, 0, 0], ["onboarding training", 0, 1, 0], ["a comment at the call site", 1, 0, 1], ["a test that fails", 1, 0, 1], ["a lint rule", 1, 0, 1]] => places

def reaches(p):
    if p[1] == 0:
        return 0
    if p[2] == 1:
        return 0
    return 1

"places a lesson can be filed : " + str(len(places)) ^0
"" ^0

"place                        at the moment   needs prior knowledge   survives turnover   reaches" ^0
for p in places:
    "" => l
    if p[1] == 1:
        l + "yes" => l
    else:
        l + "no " => l
    "" => m
    if p[2] == 1:
        m + "yes" => m
    else:
        m + "no " => m
    "" => n
    if p[3] == 1:
        n + "yes" => n
    else:
        n + "no " => n
    "" => r
    if reaches(p) == 1:
        r + "YES" => r
    else:
        r + "no" => r
    "  " + p[0] + "   " + l + "   " + m + "   " + n + "   " + r ^0
"" ^0

0 => reaching
for p in places:
    reaching + reaches(p) => reaching
"  places that reach the person who needs it : " + str(reaching) + " of " + str(len(places)) ^0
"" ^0

# ---- what the ones that fail have in common ----

"the ones that do not reach" ^0
0 => not_at_moment
0 => needs_knowing
for p in places:
    if reaches(p) == 0:
        if p[1] == 0:
            not_at_moment + 1 => not_at_moment
        else:
            needs_knowing + 1 => needs_knowing
        "  " + p[0] ^0
"  not present at the moment of need : " + str(not_at_moment) ^0
"  present but require knowing to look : " + str(needs_knowing) ^0
"" ^0

# ---- the ones that reach, and what they have in common ----

"the ones that reach" ^0
for p in places:
    if reaches(p) == 1:
        "  " + p[0] ^0
"  all three are in the path of the work, not in a description of it" ^0
"" ^0

# ---- turnover ----
#
# Surviving turnover is a separate property from reaching. A chat message
# reaches nobody later AND does not survive; a wiki page survives and still
# does not reach.

0 => survive
0 => survive_and_reach
for p in places:
    survive + p[3] => survive
    if p[3] == 1:
        survive_and_reach + reaches(p) => survive_and_reach
"durability against reach" ^0
"  survive turnover        : " + str(survive) + " of " + str(len(places)) ^0
"  survive AND reach       : " + str(survive_and_reach) ^0
"  survive and do NOT reach: " + str(survive - survive_and_reach) ^0
if survive > survive_and_reach:
    "  a lesson can be permanent and still never arrive" ^0
"" ^0

# ---- the control: a reader who already knows the lesson exists ----
#
# For them every place works. The document is not badly written; it is
# addressed to someone who does not need it.

0 => informed_reach
for p in places:
    if p[1] == 1:
        informed_reach + 1 => informed_reach
    else:
        informed_reach + 1 => informed_reach
"control - a reader who already knows the lesson exists" ^0
"  places they can use : " + str(informed_reach) + " of " + str(len(places)) ^0
"  which is why the document passes review" ^0
"" ^0

"The lesson was recorded and the recording is correct. Whether it is on the" ^0
"path the next person walks is a property of the place, and the place is" ^0
"chosen by whoever writes the postmortem rather than by whoever needs it." ^0
```

## Python (deterministic transpilation)

```python
places = [["a wiki page", 0, 1, 1], ["the postmortem document", 0, 1, 1], ["a team chat message", 0, 0, 0], ["onboarding training", 0, 1, 0], ["a comment at the call site", 1, 0, 1], ["a test that fails", 1, 0, 1], ["a lint rule", 1, 0, 1]]

def reaches(p):
    if p[1] == 0:
        return 0
    if p[2] == 1:
        return 0
    return 1

print("places a lesson can be filed : " + str(len(places)))
print("")
print("place                        at the moment   needs prior knowledge   survives turnover   reaches")
for p in places:
    l = ""
    if p[1] == 1:
        l = l + "yes"
    else:
        l = l + "no "
    m = ""
    if p[2] == 1:
        m = m + "yes"
    else:
        m = m + "no "
    n = ""
    if p[3] == 1:
        n = n + "yes"
    else:
        n = n + "no "
    r = ""
    if reaches(p) == 1:
        r = r + "YES"
    else:
        r = r + "no"
    print("  " + p[0] + "   " + l + "   " + m + "   " + n + "   " + r)
print("")
reaching = 0
for p in places:
    reaching = reaching + reaches(p)
print("  places that reach the person who needs it : " + str(reaching) + " of " + str(len(places)))
print("")
print("the ones that do not reach")
not_at_moment = 0
needs_knowing = 0
for p in places:
    if reaches(p) == 0:
        if p[1] == 0:
            not_at_moment = not_at_moment + 1
        else:
            needs_knowing = needs_knowing + 1
        print("  " + p[0])
print("  not present at the moment of need : " + str(not_at_moment))
print("  present but require knowing to look : " + str(needs_knowing))
print("")
print("the ones that reach")
for p in places:
    if reaches(p) == 1:
        print("  " + p[0])
print("  all three are in the path of the work, not in a description of it")
print("")
survive = 0
survive_and_reach = 0
for p in places:
    survive = survive + p[3]
    if p[3] == 1:
        survive_and_reach = survive_and_reach + reaches(p)
print("durability against reach")
print("  survive turnover        : " + str(survive) + " of " + str(len(places)))
print("  survive AND reach       : " + str(survive_and_reach))
print("  survive and do NOT reach: " + str(survive - survive_and_reach))
if survive > survive_and_reach:
    print("  a lesson can be permanent and still never arrive")
print("")
informed_reach = 0
for p in places:
    if p[1] == 1:
        informed_reach = informed_reach + 1
    else:
        informed_reach = informed_reach + 1
print("control - a reader who already knows the lesson exists")
print("  places they can use : " + str(informed_reach) + " of " + str(len(places)))
print("  which is why the document passes review")
print("")
print("The lesson was recorded and the recording is correct. Whether it is on the")
print("path the next person walks is a property of the place, and the place is")
print("chosen by whoever writes the postmortem rather than by whoever needs it.")
```

## stdout (executed)

```text
places a lesson can be filed : 7

place                        at the moment   needs prior knowledge   survives turnover   reaches
  a wiki page   no    yes   yes   no
  the postmortem document   no    yes   yes   no
  a team chat message   no    no    no    no
  onboarding training   no    yes   no    no
  a comment at the call site   yes   no    yes   YES
  a test that fails   yes   no    yes   YES
  a lint rule   yes   no    yes   YES

  places that reach the person who needs it : 3 of 7

the ones that do not reach
  a wiki page
  the postmortem document
  a team chat message
  onboarding training
  not present at the moment of need : 4
  present but require knowing to look : 0

the ones that reach
  a comment at the call site
  a test that fails
  a lint rule
  all three are in the path of the work, not in a description of it

durability against reach
  survive turnover        : 5 of 7
  survive AND reach       : 3
  survive and do NOT reach: 2
  a lesson can be permanent and still never arrive

control - a reader who already knows the lesson exists
  places they can use : 7 of 7
  which is why the document passes review

The lesson was recorded and the recording is correct. Whether it is on the
path the next person walks is a property of the place, and the place is
chosen by whoever writes the postmortem rather than by whoever needs it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
