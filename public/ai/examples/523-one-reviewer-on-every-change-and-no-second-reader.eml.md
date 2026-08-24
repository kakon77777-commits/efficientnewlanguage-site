<!-- canonical: efficientnewlanguage.org/ai/examples/523-one-reviewer-on-every-change-and-no-second-reader | ai_layer_version: 0.1.0 | updated: 2026-08-24 -->

# Example 523 — One reviewer on every change and no second reader

`one_reviewer_on_every_change_and_no_second_reader.eml` - One engineer reviews every change to a module. What that does to how many people can read it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). One engineer
# reviews every change to a module. What that does to how many people can read
# it is computed below.
#
# His reviews are the best on the team. He catches real defects, he explains
# why, and the module has not had a production incident in two years. Routing
# changes to the person most likely to catch something is a sensible rule and
# it is producing exactly the outcome it promises.
#
# Reading code carefully is how anybody learns a module, and review is the only
# occasion on which most people read code they did not write. Routing every
# review to the person who already knows it removes the only mechanism by which
# a second person would come to know it. The rule optimises each review and
# spends the thing that would make the next one cheaper.
#
# Changes are counted by who reviewed them and what each reviewer accumulated.

# [quarter, changes to the module, reviewed by him, reviewed by others, others who have read it]
[["Q1", 40, 38, 2, 3], ["Q2", 44, 43, 1, 3], ["Q3", 39, 39, 0, 2], ["Q4", 47, 47, 0, 2], ["Q5", 52, 52, 0, 1], ["Q6", 49, 49, 0, 1]] => quarters

len(quarters) => n
quarters[0] => first
quarters[n - 1] => last

"quarter   changes   reviewed by him   by others   others who can read it" ^0
for q in quarters:
    "  " + q[0] + "        " + str(q[1]) + "        " + str(q[2]) + "                " + str(q[3]) + "           " + str(q[4]) ^0
"" ^0

0 => total
0 => his
for q in quarters:
    total + q[1] => total
    his + q[2] => his
"changes across the period : " + str(total) ^0
"he reviewed               : " + str(his) + ", " + str(int(his * 100 / total)) + "%" ^0
"anyone else reviewed      : " + str(total - his) ^0
"people who can read it    : " + str(first[4]) + " -> " + str(last[4]) ^0
"" ^0

# ---- the two curves ----

"review concentration against readership" ^0
for q in quarters:
    "  " + q[0] + " : " + str(int(q[2] * 100 / q[1])) + "% of reviews to him, " + str(q[4]) + " others can read it" ^0
"  concentration " + str(int(first[2] * 100 / first[1])) + "% -> " + str(int(last[2] * 100 / last[1])) + "%" ^0
"  readership " + str(first[4]) + " -> " + str(last[4]) ^0
"  the second number falls as the first rises, and the second number is not" ^0
"  on any dashboard" ^0
"" ^0

# ---- what a review is worth to the reviewer ----

3 => hours_to_read
"reading time accumulated, by person" ^0
"  him    : " + str(his * hours_to_read) + " hours across " + str(his) + " changes" ^0
"  others : " + str((total - his) * hours_to_read) + " hours across " + str(total - his) + " changes" ^0
"  ratio  : " + str(int(his / (total - his))) + " to 1" ^0
"  a review is the only time most people read code they did not write, so" ^0
"  this ratio is also the ratio of how much each side has learned" ^0
"" ^0

# ---- the rule and its result ----

"the routing rule: send it to whoever is most likely to catch something" ^0
"  defects caught by him per 100 reviews    : 14" ^0
"  defects caught by others per 100 reviews : 5" ^0
"  so on the evidence available at routing time, the rule is right every" ^0
"  single time it is applied" ^0
"  and the evidence is a measurement of the gap the rule is widening" ^0
"" ^0

# ---- the departure that is not modelled ----

"what happens when he is unavailable" ^0
"  people who could review a change today : " + str(last[4]) ^0
"  changes per quarter needing review     : " + str(last[1]) ^0
"  hours of reading that person would need to catch up : " + str(his * hours_to_read) ^0
"  the catch-up cost has grown every quarter and is not recorded anywhere" ^0
"" ^0

# ---- what a second reviewer would cost ----

"pairing a second reviewer onto a share of the changes" ^0
[10, 25, 50] => shares
for s in shares:
    int(last[1] * s / 100) => moved
    "  " + str(s) + "% of changes to a second reviewer : " + str(moved) + " changes a quarter, " + str(moved * hours_to_read) + " hours of reading" ^0
"  defects that would be missed, at the observed rates : " + str(int(last[1] * 25 * 9 / 10000)) + " a quarter at the 25% share" ^0
"  that is the cost, it is real, and it is the only one of these numbers" ^0
"  the routing rule can see" ^0
"" ^0

# ---- the control: a module with rotating review ----
#
# Where review rotates by policy, no single reviewer accumulates the whole
# context and the readership does not decay.

[["billing adapter", 46, 12, 5]] => rotated
for r in rotated:
    "control - " + r[0] + ", review rotates" ^0
    "  changes a quarter : " + str(r[1]) ^0
    "  most any one reviewer took : " + str(r[2]) + ", " + str(int(r[2] * 100 / r[1])) + "%" ^0
    "  people who can read it : " + str(r[3]) ^0
    "  its defect catch rate is lower per review than his, and the module has" ^0
    "  five people who could take it tomorrow" ^0
    "  the rotation costs catches and buys readers, and both are measured" ^0
"" ^0

"His reviews are the best on the team and the module has been incident-free" ^0
"for two years. Review is how a second person would learn it, and " + str(int(his * 100 / total)) + "% of" ^0
"them went to the person who already had." ^0
```

## Python (deterministic transpilation)

```python
quarters = [["Q1", 40, 38, 2, 3], ["Q2", 44, 43, 1, 3], ["Q3", 39, 39, 0, 2], ["Q4", 47, 47, 0, 2], ["Q5", 52, 52, 0, 1], ["Q6", 49, 49, 0, 1]]
n = len(quarters)
first = quarters[0]
last = quarters[n - 1]
print("quarter   changes   reviewed by him   by others   others who can read it")
for q in quarters:
    print("  " + q[0] + "        " + str(q[1]) + "        " + str(q[2]) + "                " + str(q[3]) + "           " + str(q[4]))
print("")
total = 0
his = 0
for q in quarters:
    total = total + q[1]
    his = his + q[2]
print("changes across the period : " + str(total))
print("he reviewed               : " + str(his) + ", " + str(int(his * 100 / total)) + "%")
print("anyone else reviewed      : " + str(total - his))
print("people who can read it    : " + str(first[4]) + " -> " + str(last[4]))
print("")
print("review concentration against readership")
for q in quarters:
    print("  " + q[0] + " : " + str(int(q[2] * 100 / q[1])) + "% of reviews to him, " + str(q[4]) + " others can read it")
print("  concentration " + str(int(first[2] * 100 / first[1])) + "% -> " + str(int(last[2] * 100 / last[1])) + "%")
print("  readership " + str(first[4]) + " -> " + str(last[4]))
print("  the second number falls as the first rises, and the second number is not")
print("  on any dashboard")
print("")
hours_to_read = 3
print("reading time accumulated, by person")
print("  him    : " + str(his * hours_to_read) + " hours across " + str(his) + " changes")
print("  others : " + str((total - his) * hours_to_read) + " hours across " + str(total - his) + " changes")
print("  ratio  : " + str(int(his / (total - his))) + " to 1")
print("  a review is the only time most people read code they did not write, so")
print("  this ratio is also the ratio of how much each side has learned")
print("")
print("the routing rule: send it to whoever is most likely to catch something")
print("  defects caught by him per 100 reviews    : 14")
print("  defects caught by others per 100 reviews : 5")
print("  so on the evidence available at routing time, the rule is right every")
print("  single time it is applied")
print("  and the evidence is a measurement of the gap the rule is widening")
print("")
print("what happens when he is unavailable")
print("  people who could review a change today : " + str(last[4]))
print("  changes per quarter needing review     : " + str(last[1]))
print("  hours of reading that person would need to catch up : " + str(his * hours_to_read))
print("  the catch-up cost has grown every quarter and is not recorded anywhere")
print("")
print("pairing a second reviewer onto a share of the changes")
shares = [10, 25, 50]
for s in shares:
    moved = int(last[1] * s / 100)
    print("  " + str(s) + "% of changes to a second reviewer : " + str(moved) + " changes a quarter, " + str(moved * hours_to_read) + " hours of reading")
print("  defects that would be missed, at the observed rates : " + str(int(last[1] * 25 * 9 / 10000)) + " a quarter at the 25% share")
print("  that is the cost, it is real, and it is the only one of these numbers")
print("  the routing rule can see")
print("")
rotated = [["billing adapter", 46, 12, 5]]
for r in rotated:
    print("control - " + r[0] + ", review rotates")
    print("  changes a quarter : " + str(r[1]))
    print("  most any one reviewer took : " + str(r[2]) + ", " + str(int(r[2] * 100 / r[1])) + "%")
    print("  people who can read it : " + str(r[3]))
    print("  its defect catch rate is lower per review than his, and the module has")
    print("  five people who could take it tomorrow")
    print("  the rotation costs catches and buys readers, and both are measured")
print("")
print("His reviews are the best on the team and the module has been incident-free")
print("for two years. Review is how a second person would learn it, and " + str(int(his * 100 / total)) + "% of")
print("them went to the person who already had.")
```

## stdout (executed)

```text
quarter   changes   reviewed by him   by others   others who can read it
  Q1        40        38                2           3
  Q2        44        43                1           3
  Q3        39        39                0           2
  Q4        47        47                0           2
  Q5        52        52                0           1
  Q6        49        49                0           1

changes across the period : 271
he reviewed               : 268, 98%
anyone else reviewed      : 3
people who can read it    : 3 -> 1

review concentration against readership
  Q1 : 95% of reviews to him, 3 others can read it
  Q2 : 97% of reviews to him, 3 others can read it
  Q3 : 100% of reviews to him, 2 others can read it
  Q4 : 100% of reviews to him, 2 others can read it
  Q5 : 100% of reviews to him, 1 others can read it
  Q6 : 100% of reviews to him, 1 others can read it
  concentration 95% -> 100%
  readership 3 -> 1
  the second number falls as the first rises, and the second number is not
  on any dashboard

reading time accumulated, by person
  him    : 804 hours across 268 changes
  others : 9 hours across 3 changes
  ratio  : 89 to 1
  a review is the only time most people read code they did not write, so
  this ratio is also the ratio of how much each side has learned

the routing rule: send it to whoever is most likely to catch something
  defects caught by him per 100 reviews    : 14
  defects caught by others per 100 reviews : 5
  so on the evidence available at routing time, the rule is right every
  single time it is applied
  and the evidence is a measurement of the gap the rule is widening

what happens when he is unavailable
  people who could review a change today : 1
  changes per quarter needing review     : 49
  hours of reading that person would need to catch up : 804
  the catch-up cost has grown every quarter and is not recorded anywhere

pairing a second reviewer onto a share of the changes
  10% of changes to a second reviewer : 4 changes a quarter, 12 hours of reading
  25% of changes to a second reviewer : 12 changes a quarter, 36 hours of reading
  50% of changes to a second reviewer : 24 changes a quarter, 72 hours of reading
  defects that would be missed, at the observed rates : 1 a quarter at the 25% share
  that is the cost, it is real, and it is the only one of these numbers
  the routing rule can see

control - billing adapter, review rotates
  changes a quarter : 46
  most any one reviewer took : 12, 26%
  people who can read it : 5
  its defect catch rate is lower per review than his, and the module has
  five people who could take it tomorrow
  the rotation costs catches and buys readers, and both are measured

His reviews are the best on the team and the module has been incident-free
for two years. Review is how a second person would learn it, and 98% of
them went to the person who already had.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
