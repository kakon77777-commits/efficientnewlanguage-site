<!-- canonical: efficientnewlanguage.org/ai/examples/419-one-counterexample-retired-a-rule | ai_layer_version: 0.1.0 | updated: 2026-08-17 -->

# Example 419 — One counterexample retired a rule

`one_counterexample_retired_a_rule.eml` - A rule was removed after its visible failures. How often each policy is right is computed below; no figure is stated here, because a number in a comment is checked by nothing.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A rule was removed
# after its visible failures. How often each policy is right is computed below;
# no figure is stated here, because a number in a comment is checked by nothing.
#
# Removing it was not an overreaction in the moment. The failure was visible,
# expensive, and impossible to defend in the review - "the rule did this" is a
# complete answer to why it happened, and no equally short answer exists for
# the 47 times it quietly did the right thing.
#
# That asymmetry is the whole case. A rule's successes are invisible by
# construction: they are the incidents that did not happen. Its failures each
# come with a ticket.
#
# Both rules are run over the same 50 cases here, so the comparison is between
# two policies rather than between a policy and a memory.

# [case, should auto-approve, the rule's answer, the replacement's answer]
[["c1",1,1,1],["c2",1,1,1],["c3",1,1,0],["c4",0,0,0],["c5",1,1,1],["c6",1,1,0],["c7",0,0,0],["c8",1,1,1],["c9",1,1,1],["c10",0,1,0],
 ["c11",1,1,1],["c12",1,1,0],["c13",0,0,0],["c14",1,1,1],["c15",1,1,1],["c16",1,1,0],["c17",0,0,0],["c18",1,1,1],["c19",1,1,0],["c20",0,1,0],
 ["c21",1,1,1],["c22",1,1,0],["c23",0,0,0],["c24",1,1,1],["c25",1,1,1],["c26",1,1,0],["c27",0,0,0],["c28",1,1,1],["c29",1,1,0],["c30",0,1,0],
 ["c31",1,1,1],["c32",1,1,0],["c33",0,0,0],["c34",1,1,1],["c35",1,1,1],["c36",1,1,0],["c37",0,0,0],["c38",1,1,1],["c39",1,1,0],["c40",1,1,1],
 ["c41",1,1,1],["c42",1,1,0],["c43",0,0,0],["c44",1,1,1],["c45",1,1,1],["c46",1,1,0],["c47",0,0,0],["c48",1,1,1],["c49",1,1,0],["c50",1,1,1]] => cases

def correct(col):
    0 => c
    for x in cases:
        if x[col] == x[1]:
            c + 1 => c
    return c

def wrong(col):
    return len(cases) - correct(col)

"cases : " + str(len(cases)) ^0
"" ^0

"the rule that was removed" ^0
"  correct : " + str(correct(2)) + " of " + str(len(cases)) ^0
"  wrong   : " + str(wrong(2)) ^0
"" ^0
"what replaced it" ^0
"  correct : " + str(correct(3)) + " of " + str(len(cases)) ^0
"  wrong   : " + str(wrong(3)) ^0
"" ^0

if correct(3) < correct(2):
    "  the replacement is right " + str(correct(2) - correct(3)) + " times fewer" ^0
"" ^0

# ---- what each one gets wrong, by direction ----

def wrong_by(col, want):
    0 => c
    for x in cases:
        if x[1] == want:
            if not (x[col] == want):
                c + 1 => c
    return c

"errors by direction" ^0
"  old rule : approved " + str(wrong_by(2, 0)) + " that should not have been, blocked " + str(wrong_by(2, 1)) + " that should have been" ^0
"  new rule : approved " + str(wrong_by(3, 0)) + " that should not have been, blocked " + str(wrong_by(3, 1)) + " that should have been" ^0
"" ^0

# ---- why one kind of error is the one anybody sees ----
#
# A wrong approval produces an incident. A wrong block produces a person
# waiting, which produces nothing anyone files.

"visibility of each error kind" ^0
"  wrong approval : produces an incident with a ticket" ^0
"  wrong block    : produces a delay, and nothing is filed" ^0
"  old rule visible errors : " + str(wrong_by(2, 0)) ^0
"  new rule visible errors : " + str(wrong_by(3, 0)) ^0
"  old rule invisible errors : " + str(wrong_by(2, 1)) ^0
"  new rule invisible errors : " + str(wrong_by(3, 1)) ^0
"" ^0

if wrong_by(3, 0) < wrong_by(2, 0):
    if wrong_by(3, 1) > wrong_by(2, 1):
        "The replacement made the visible errors rarer and the invisible ones" ^0
        "commoner, and every number in the review was about the visible kind." ^0
"" ^0

# ---- what the review saw ----

"what was in the review" ^0
"  the failure : 1 case, described in detail" ^0
"  the rule's correct decisions : " + str(correct(2)) + ", none of them described" ^0
"  a correct auto-approval leaves no artifact to describe" ^0
"" ^0

# ---- the control: a rule that really is worse than nothing ----
#
# Removing a rule is not always wrong. Where it is worse than the replacement
# on the same cases, the removal is simply correct.

def bad_rule(x):
    return 1

0 => bad_correct
for x in cases:
    if bad_rule(x) == x[1]:
        bad_correct + 1 => bad_correct
"control - a rule that approves everything, i.e. no rule at all" ^0
"  correct : " + str(bad_correct) + " of " + str(len(cases)) ^0
"  the replacement : " + str(correct(3)) ^0
"  the removed rule : " + str(correct(2)) ^0
if bad_correct < correct(3):
    "  the replacement beats having no rule, so the removal cost only accuracy" ^0
else:
    "  THE REPLACEMENT IS WORSE THAN HAVING NO RULE AT ALL, by " + str(bad_correct - correct(3)) ^0
    "  and it is still preferred, because its errors are the invisible kind" ^0
"" ^0

"The rule's failures each came with a ticket and its successes came with" ^0
"nothing. A count of tickets is a count of one of those two." ^0
```

## Python (deterministic transpilation)

```python
cases = [["c1", 1, 1, 1], ["c2", 1, 1, 1], ["c3", 1, 1, 0], ["c4", 0, 0, 0], ["c5", 1, 1, 1], ["c6", 1, 1, 0], ["c7", 0, 0, 0], ["c8", 1, 1, 1], ["c9", 1, 1, 1], ["c10", 0, 1, 0], ["c11", 1, 1, 1], ["c12", 1, 1, 0], ["c13", 0, 0, 0], ["c14", 1, 1, 1], ["c15", 1, 1, 1], ["c16", 1, 1, 0], ["c17", 0, 0, 0], ["c18", 1, 1, 1], ["c19", 1, 1, 0], ["c20", 0, 1, 0], ["c21", 1, 1, 1], ["c22", 1, 1, 0], ["c23", 0, 0, 0], ["c24", 1, 1, 1], ["c25", 1, 1, 1], ["c26", 1, 1, 0], ["c27", 0, 0, 0], ["c28", 1, 1, 1], ["c29", 1, 1, 0], ["c30", 0, 1, 0], ["c31", 1, 1, 1], ["c32", 1, 1, 0], ["c33", 0, 0, 0], ["c34", 1, 1, 1], ["c35", 1, 1, 1], ["c36", 1, 1, 0], ["c37", 0, 0, 0], ["c38", 1, 1, 1], ["c39", 1, 1, 0], ["c40", 1, 1, 1], ["c41", 1, 1, 1], ["c42", 1, 1, 0], ["c43", 0, 0, 0], ["c44", 1, 1, 1], ["c45", 1, 1, 1], ["c46", 1, 1, 0], ["c47", 0, 0, 0], ["c48", 1, 1, 1], ["c49", 1, 1, 0], ["c50", 1, 1, 1]]

def correct(col):
    c = 0
    for x in cases:
        if x[col] == x[1]:
            c = c + 1
    return c

def wrong(col):
    return len(cases) - correct(col)

print("cases : " + str(len(cases)))
print("")
print("the rule that was removed")
print("  correct : " + str(correct(2)) + " of " + str(len(cases)))
print("  wrong   : " + str(wrong(2)))
print("")
print("what replaced it")
print("  correct : " + str(correct(3)) + " of " + str(len(cases)))
print("  wrong   : " + str(wrong(3)))
print("")
if correct(3) < correct(2):
    print("  the replacement is right " + str(correct(2) - correct(3)) + " times fewer")
print("")

def wrong_by(col, want):
    c = 0
    for x in cases:
        if x[1] == want:
            if not x[col] == want:
                c = c + 1
    return c

print("errors by direction")
print("  old rule : approved " + str(wrong_by(2, 0)) + " that should not have been, blocked " + str(wrong_by(2, 1)) + " that should have been")
print("  new rule : approved " + str(wrong_by(3, 0)) + " that should not have been, blocked " + str(wrong_by(3, 1)) + " that should have been")
print("")
print("visibility of each error kind")
print("  wrong approval : produces an incident with a ticket")
print("  wrong block    : produces a delay, and nothing is filed")
print("  old rule visible errors : " + str(wrong_by(2, 0)))
print("  new rule visible errors : " + str(wrong_by(3, 0)))
print("  old rule invisible errors : " + str(wrong_by(2, 1)))
print("  new rule invisible errors : " + str(wrong_by(3, 1)))
print("")
if wrong_by(3, 0) < wrong_by(2, 0):
    if wrong_by(3, 1) > wrong_by(2, 1):
        print("The replacement made the visible errors rarer and the invisible ones")
        print("commoner, and every number in the review was about the visible kind.")
print("")
print("what was in the review")
print("  the failure : 1 case, described in detail")
print("  the rule's correct decisions : " + str(correct(2)) + ", none of them described")
print("  a correct auto-approval leaves no artifact to describe")
print("")

def bad_rule(x):
    return 1

bad_correct = 0
for x in cases:
    if bad_rule(x) == x[1]:
        bad_correct = bad_correct + 1
print("control - a rule that approves everything, i.e. no rule at all")
print("  correct : " + str(bad_correct) + " of " + str(len(cases)))
print("  the replacement : " + str(correct(3)))
print("  the removed rule : " + str(correct(2)))
if bad_correct < correct(3):
    print("  the replacement beats having no rule, so the removal cost only accuracy")
else:
    print("  THE REPLACEMENT IS WORSE THAN HAVING NO RULE AT ALL, by " + str(bad_correct - correct(3)))
    print("  and it is still preferred, because its errors are the invisible kind")
print("")
print("The rule's failures each came with a ticket and its successes came with")
print("nothing. A count of tickets is a count of one of those two.")
```

## stdout (executed)

```text
cases : 50

the rule that was removed
  correct : 47 of 50
  wrong   : 3

what replaced it
  correct : 36 of 50
  wrong   : 14

  the replacement is right 11 times fewer

errors by direction
  old rule : approved 3 that should not have been, blocked 0 that should have been
  new rule : approved 0 that should not have been, blocked 14 that should have been

visibility of each error kind
  wrong approval : produces an incident with a ticket
  wrong block    : produces a delay, and nothing is filed
  old rule visible errors : 3
  new rule visible errors : 0
  old rule invisible errors : 0
  new rule invisible errors : 14

The replacement made the visible errors rarer and the invisible ones
commoner, and every number in the review was about the visible kind.

what was in the review
  the failure : 1 case, described in detail
  the rule's correct decisions : 47, none of them described
  a correct auto-approval leaves no artifact to describe

control - a rule that approves everything, i.e. no rule at all
  correct : 37 of 50
  the replacement : 36
  the removed rule : 47
  THE REPLACEMENT IS WORSE THAN HAVING NO RULE AT ALL, by 1
  and it is still preferred, because its errors are the invisible kind

The rule's failures each came with a ticket and its successes came with
nothing. A count of tickets is a count of one of those two.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
