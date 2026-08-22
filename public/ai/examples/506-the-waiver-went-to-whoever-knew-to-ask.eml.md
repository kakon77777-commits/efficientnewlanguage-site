<!-- canonical: efficientnewlanguage.org/ai/examples/506-the-waiver-went-to-whoever-knew-to-ask | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 506 — The waiver went to whoever knew to ask

`the_waiver_went_to_whoever_knew_to_ask.eml` - The policy has an exception process. Which teams used it, and which teams qualified, are two different sets, computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The policy has an
# exception process. Which teams used it, and which teams qualified, are two
# different sets, computed below.
#
# Having an exception process is right. A rule with no escape hatch gets ignored
# or routed around, and a documented waiver with an owner and an expiry is far
# better than a quiet violation. Every waiver granted here was granted for a
# real reason by someone who checked.
#
# A waiver has to be asked for. Asking needs knowing the process exists, knowing
# your case qualifies, and being willing to spend the meeting - and none of
# those three is correlated with how badly the exception is needed.
#
# Both sets are computed from the same team list.

# [team, genuinely qualifies, knows the process exists, asked, granted]
[["platform", 1, 1, 1, 1], ["payments", 1, 1, 1, 1], ["search", 1, 1, 0, 0], ["mobile", 0, 1, 1, 0], ["data", 1, 0, 0, 0], ["billing ops", 1, 0, 0, 0], ["growth", 0, 1, 1, 1], ["support tools", 1, 0, 0, 0]] => teams

len(teams) => n
0 => qualifies
0 => knows
0 => asked
0 => granted
for t in teams:
    qualifies + t[1] => qualifies
    knows + t[2] => knows
    asked + t[3] => asked
    granted + t[4] => granted

"teams : " + str(n) ^0
"  genuinely qualify for an exception : " + str(qualifies) ^0
"  know the process exists            : " + str(knows) ^0
"  asked                              : " + str(asked) ^0
"  were granted one                   : " + str(granted) ^0
"" ^0

"team            qualifies   knows   asked   granted" ^0
for t in teams:
    "" => row
    for k in [1:4]:
        if t[k] == 1:
            row + "yes   " => row
        else:
            row + "no    " => row
    "  " + t[0] + "   " + row ^0
"" ^0

# ---- the two error kinds ----

0 => qualified_without
0 => granted_unqualified
for t in teams:
    if t[1] == 1:
        if t[4] == 0:
            qualified_without + 1 => qualified_without
    if t[1] == 0:
        if t[4] == 1:
            granted_unqualified + 1 => granted_unqualified

"teams that qualify and have no waiver : " + str(qualified_without) ^0
for t in teams:
    if t[1] == 1:
        if t[4] == 0:
            "" => why
            if t[2] == 0:
                "does not know the process exists" => why
            else:
                "knows, did not ask" => why
            "  " + t[0] + " : " + why ^0
"teams granted a waiver that do not qualify : " + str(granted_unqualified) ^0
"" ^0

# ---- where the filter is ----

0 => qualified_unaware
for t in teams:
    if t[1] == 1:
        if t[2] == 0:
            qualified_unaware + 1 => qualified_unaware
"of the " + str(qualifies) + " teams that qualify" ^0
"  do not know the process exists : " + str(qualified_unaware) ^0
if qualified_unaware > 0:
    "  for these the exception process has the same effect as not having one" ^0
"" ^0

0 => aware_asked
0 => aware_total
for t in teams:
    if t[2] == 1:
        aware_total + 1 => aware_total
        aware_asked + t[3] => aware_asked
"of the " + str(aware_total) + " teams that know about it" ^0
"  asked : " + str(aware_asked) ^0
if aware_total > 0:
    "  so knowing is " + str(int(aware_asked * 100 / aware_total)) + "% of the way to a waiver, and not knowing is 0%" ^0
"" ^0

# ---- what the granting record shows ----

"the record, as an approver would read it" ^0
"  waivers requested : " + str(asked) ^0
"  waivers granted   : " + str(granted) ^0
if asked > 0:
    "  approval rate     : " + str(int(granted * 100 / asked)) + "%" ^0
"  every decision in that record is defensible, and the record contains no" ^0
"  row for a team that never asked" ^0
"" ^0

# ---- what the teams without a waiver do instead ----

"what a qualifying team without a waiver does" ^0
"  comply at the real cost : possible, and it is the cost the exception exists to avoid" ^0
"  violate quietly         : possible, and it does not appear in the waiver record" ^0
"  neither shows up as an exception, so the policy's own metrics report" ^0
"  " + str(granted) + " exceptions against a true need of " + str(qualifies) ^0
"" ^0

# ---- what one change would do ----
#
# Not a better process. The process is fine. The eligible set is computable
# from data the policy owner already has, so the offer can be made rather than
# waited for.

"offering the waiver to every team that qualifies" ^0
"  teams contacted : " + str(qualifies) ^0
"  teams that would newly have one : " + str(qualified_without) ^0
"  work for the requesting teams : none, the direction of the ask reverses" ^0
"" ^0

# ---- the control: a process everybody is told about ----
#
# Where the exception is offered as part of the rule's announcement, knowing is
# not a filter and the waiver record is a record of need.

[["a", 1, 1, 1, 1], ["b", 0, 1, 0, 0], ["c", 1, 1, 1, 1]] => told
0 => t_qual
0 => t_gap
for t in told:
    t_qual + t[1] => t_qual
    if t[1] == 1:
        if t[4] == 0:
            t_gap + 1 => t_gap
"control - a policy that offered the exception in the same announcement" ^0
"  teams that qualify : " + str(t_qual) + ", qualifying teams without a waiver : " + str(t_gap) ^0
if t_gap == 0:
    "  none missing, because nobody had to discover the process" ^0
"" ^0

"Every waiver was granted for a real reason by someone who checked, and the" ^0
"process is better than a rule with no escape. It is opt-in, and opting in" ^0
"needs three things that having a real case does not." ^0
```

## Python (deterministic transpilation)

```python
teams = [["platform", 1, 1, 1, 1], ["payments", 1, 1, 1, 1], ["search", 1, 1, 0, 0], ["mobile", 0, 1, 1, 0], ["data", 1, 0, 0, 0], ["billing ops", 1, 0, 0, 0], ["growth", 0, 1, 1, 1], ["support tools", 1, 0, 0, 0]]
n = len(teams)
qualifies = 0
knows = 0
asked = 0
granted = 0
for t in teams:
    qualifies = qualifies + t[1]
    knows = knows + t[2]
    asked = asked + t[3]
    granted = granted + t[4]
print("teams : " + str(n))
print("  genuinely qualify for an exception : " + str(qualifies))
print("  know the process exists            : " + str(knows))
print("  asked                              : " + str(asked))
print("  were granted one                   : " + str(granted))
print("")
print("team            qualifies   knows   asked   granted")
for t in teams:
    row = ""
    for k in range(1, 5):
        if t[k] == 1:
            row = row + "yes   "
        else:
            row = row + "no    "
    print("  " + t[0] + "   " + row)
print("")
qualified_without = 0
granted_unqualified = 0
for t in teams:
    if t[1] == 1:
        if t[4] == 0:
            qualified_without = qualified_without + 1
    if t[1] == 0:
        if t[4] == 1:
            granted_unqualified = granted_unqualified + 1
print("teams that qualify and have no waiver : " + str(qualified_without))
for t in teams:
    if t[1] == 1:
        if t[4] == 0:
            why = ""
            if t[2] == 0:
                why = "does not know the process exists"
            else:
                why = "knows, did not ask"
            print("  " + t[0] + " : " + why)
print("teams granted a waiver that do not qualify : " + str(granted_unqualified))
print("")
qualified_unaware = 0
for t in teams:
    if t[1] == 1:
        if t[2] == 0:
            qualified_unaware = qualified_unaware + 1
print("of the " + str(qualifies) + " teams that qualify")
print("  do not know the process exists : " + str(qualified_unaware))
if qualified_unaware > 0:
    print("  for these the exception process has the same effect as not having one")
print("")
aware_asked = 0
aware_total = 0
for t in teams:
    if t[2] == 1:
        aware_total = aware_total + 1
        aware_asked = aware_asked + t[3]
print("of the " + str(aware_total) + " teams that know about it")
print("  asked : " + str(aware_asked))
if aware_total > 0:
    print("  so knowing is " + str(int(aware_asked * 100 / aware_total)) + "% of the way to a waiver, and not knowing is 0%")
print("")
print("the record, as an approver would read it")
print("  waivers requested : " + str(asked))
print("  waivers granted   : " + str(granted))
if asked > 0:
    print("  approval rate     : " + str(int(granted * 100 / asked)) + "%")
print("  every decision in that record is defensible, and the record contains no")
print("  row for a team that never asked")
print("")
print("what a qualifying team without a waiver does")
print("  comply at the real cost : possible, and it is the cost the exception exists to avoid")
print("  violate quietly         : possible, and it does not appear in the waiver record")
print("  neither shows up as an exception, so the policy's own metrics report")
print("  " + str(granted) + " exceptions against a true need of " + str(qualifies))
print("")
print("offering the waiver to every team that qualifies")
print("  teams contacted : " + str(qualifies))
print("  teams that would newly have one : " + str(qualified_without))
print("  work for the requesting teams : none, the direction of the ask reverses")
print("")
told = [["a", 1, 1, 1, 1], ["b", 0, 1, 0, 0], ["c", 1, 1, 1, 1]]
t_qual = 0
t_gap = 0
for t in told:
    t_qual = t_qual + t[1]
    if t[1] == 1:
        if t[4] == 0:
            t_gap = t_gap + 1
print("control - a policy that offered the exception in the same announcement")
print("  teams that qualify : " + str(t_qual) + ", qualifying teams without a waiver : " + str(t_gap))
if t_gap == 0:
    print("  none missing, because nobody had to discover the process")
print("")
print("Every waiver was granted for a real reason by someone who checked, and the")
print("process is better than a rule with no escape. It is opt-in, and opting in")
print("needs three things that having a real case does not.")
```

## stdout (executed)

```text
teams : 8
  genuinely qualify for an exception : 6
  know the process exists            : 5
  asked                              : 4
  were granted one                   : 3

team            qualifies   knows   asked   granted
  platform   yes   yes   yes   yes   
  payments   yes   yes   yes   yes   
  search   yes   yes   no    no    
  mobile   no    yes   yes   no    
  data   yes   no    no    no    
  billing ops   yes   no    no    no    
  growth   no    yes   yes   yes   
  support tools   yes   no    no    no    

teams that qualify and have no waiver : 4
  search : knows, did not ask
  data : does not know the process exists
  billing ops : does not know the process exists
  support tools : does not know the process exists
teams granted a waiver that do not qualify : 1

of the 6 teams that qualify
  do not know the process exists : 3
  for these the exception process has the same effect as not having one

of the 5 teams that know about it
  asked : 4
  so knowing is 80% of the way to a waiver, and not knowing is 0%

the record, as an approver would read it
  waivers requested : 4
  waivers granted   : 3
  approval rate     : 75%
  every decision in that record is defensible, and the record contains no
  row for a team that never asked

what a qualifying team without a waiver does
  comply at the real cost : possible, and it is the cost the exception exists to avoid
  violate quietly         : possible, and it does not appear in the waiver record
  neither shows up as an exception, so the policy's own metrics report
  3 exceptions against a true need of 6

offering the waiver to every team that qualifies
  teams contacted : 6
  teams that would newly have one : 4
  work for the requesting teams : none, the direction of the ask reverses

control - a policy that offered the exception in the same announcement
  teams that qualify : 2, qualifying teams without a waiver : 0
  none missing, because nobody had to discover the process

Every waiver was granted for a real reason by someone who checked, and the
process is better than a rule with no escape. It is opt-in, and opting in
needs three things that having a real case does not.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
