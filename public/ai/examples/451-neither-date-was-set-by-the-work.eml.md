<!-- canonical: efficientnewlanguage.org/ai/examples/451-neither-date-was-set-by-the-work | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 451 — Neither date was set by the work

`neither_date_was_set_by_the_work.eml` - Each team set its date from the other team's date. Where either date came from is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Each team set its
# date from the other team's date. Where either date came from is computed
# below.
#
# Aligning to the dependency is correct planning. A team that ships before the
# thing it integrates with is finished has shipped nothing, and a team that
# ships long after has wasted the gap. Reading the other side's date and
# planning against it is what coordination means.
#
# A date read from a plan is not evidence about work. When both sides do it,
# the pair holds two dates that agree with each other and neither of which was
# derived from an estimate, so the first contact with the work moves both.
#
# The work-derived dates are computed alongside so the gap is visible.

# weeks of real work remaining, per team
14 => work_a
9 => work_b
2 => integration_margin
0 => week

# each team's announced date, in weeks from now
16 => date_a
18 => date_b

"real work remaining : team A " + str(work_a) + " weeks, team B " + str(work_b) + " weeks" ^0
"announced dates     : team A week " + str(date_a) + ", team B week " + str(date_b) ^0
"integration margin  : " + str(integration_margin) + " weeks" ^0
"" ^0

"what each announced date was derived from" ^0
"  team A : team B's date " + str(date_b) + " minus the margin " + str(integration_margin) + " = " + str(date_b - integration_margin) ^0
"  team B : team A's date " + str(date_a) + " plus the margin " + str(integration_margin) + " = " + str(date_a + integration_margin) ^0
if date_a == date_b - integration_margin:
    if date_b == date_a + integration_margin:
        "  the pair is consistent, and each date's only support is the other" ^0
"" ^0

"what the work implies" ^0
"  team A : " + str(work_a) + " weeks of work, so week " + str(work_a) ^0
"  team B : " + str(work_b) + " weeks of work, so week " + str(work_b) ^0
"  the binding one is team A at week " + str(work_a) ^0
if date_a > work_a:
    "  the announced date for A is " + str(date_a - work_a) + " weeks later than its own work needs" ^0
if date_b > work_b + integration_margin:
    "  and B's is " + str(date_b - work_b - integration_margin) + " weeks later than B's work plus the margin" ^0
"" ^0

# ---- a discovery on team B ----
#
# Three weeks of work appear on the smaller side. Because each date is anchored
# to the other, the correction propagates in both directions.

3 => discovery
work_b + discovery => work_b2
"team B discovers " + str(discovery) + " more weeks of work, taking it to " + str(work_b2) ^0
"" ^0
"if each side re-derives from the other, one round at a time" ^0
date_a => a
date_b => b
0 => r
while r < 4:
    r + 1 => r
    b => old_b
    a + integration_margin => b
    if work_b2 + integration_margin > b:
        work_b2 + integration_margin => b
    b - integration_margin => a
    if work_a > a:
        work_a => a
    "  round " + str(r) + " : A week " + str(a) + ", B week " + str(b) ^0
"" ^0

if a == date_a:
    if b == date_b:
        "  neither date moved. " + str(discovery) + " weeks of work appeared and the pair is" ^0
        "  unchanged, because each date is supported by the other and the" ^0
        "  margin between them still holds" ^0
"" ^0
"where it comes to rest" ^0
"  team A : week " + str(a) + ", against " + str(work_a) + " weeks of work" ^0
"  team B : week " + str(b) + ", against " + str(work_b2) + " weeks of work plus " + str(integration_margin) ^0
if a > work_a:
    "  A is still " + str(a - work_a) + " weeks past what its own work needs, because it is" ^0
    "  anchored to B and B is anchored to the margin" ^0
"" ^0

# ---- what the same discovery costs if the dates come from the work ----

work_a => wa
work_b2 + integration_margin => wb
0 => joint
if wa > wb:
    wa => joint
else:
    wb => joint
"if both dates were derived from estimates and reconciled once" ^0
"  team A : week " + str(wa) + ", team B : week " + str(wb) ^0
"  the pair ships at week " + str(joint) ^0
if b > joint:
    "  against week " + str(b) + " under the mutual anchoring, a difference of " + str(b - joint) ^0
"" ^0

# ---- what the announced dates are evidence of ----

"what a reader can conclude from the two announced dates" ^0
"  that the teams agree : yes" ^0
"  that either date is achievable : nothing" ^0
"  the agreement was produced by copying, which is also what agreement" ^0
"  produced by evidence looks like from outside" ^0
"" ^0

# ---- the control: one side anchored to the work ----
#
# One team deriving from its own estimate is enough to give the pair a floor
# that a discovery moves by exactly the discovery.

work_a => ca
work_b2 + integration_margin => cb
0 => cjoint
if ca > cb:
    ca => cjoint
else:
    cb => cjoint
"control - team A dates from its own estimate, B aligns to A" ^0
"  before the discovery : A week " + str(work_a) + ", B week " + str(work_b + integration_margin) ^0
"  after                : A week " + str(ca) + ", B week " + str(cb) ^0
"  the discovery moved the pair by " + str(cb - work_b - integration_margin) + ", which is the discovery" ^0
"" ^0

"Planning against the dependency is what coordination is, and the two dates" ^0
"are consistent to the week. Consistency between two copies is not evidence" ^0
"about the work, and the work is what the dates are about." ^0
```

## Python (deterministic transpilation)

```python
work_a = 14
work_b = 9
integration_margin = 2
week = 0
date_a = 16
date_b = 18
print("real work remaining : team A " + str(work_a) + " weeks, team B " + str(work_b) + " weeks")
print("announced dates     : team A week " + str(date_a) + ", team B week " + str(date_b))
print("integration margin  : " + str(integration_margin) + " weeks")
print("")
print("what each announced date was derived from")
print("  team A : team B's date " + str(date_b) + " minus the margin " + str(integration_margin) + " = " + str(date_b - integration_margin))
print("  team B : team A's date " + str(date_a) + " plus the margin " + str(integration_margin) + " = " + str(date_a + integration_margin))
if date_a == date_b - integration_margin:
    if date_b == date_a + integration_margin:
        print("  the pair is consistent, and each date's only support is the other")
print("")
print("what the work implies")
print("  team A : " + str(work_a) + " weeks of work, so week " + str(work_a))
print("  team B : " + str(work_b) + " weeks of work, so week " + str(work_b))
print("  the binding one is team A at week " + str(work_a))
if date_a > work_a:
    print("  the announced date for A is " + str(date_a - work_a) + " weeks later than its own work needs")
if date_b > work_b + integration_margin:
    print("  and B's is " + str(date_b - work_b - integration_margin) + " weeks later than B's work plus the margin")
print("")
discovery = 3
work_b2 = work_b + discovery
print("team B discovers " + str(discovery) + " more weeks of work, taking it to " + str(work_b2))
print("")
print("if each side re-derives from the other, one round at a time")
a = date_a
b = date_b
r = 0
while r < 4:
    r = r + 1
    old_b = b
    b = a + integration_margin
    if work_b2 + integration_margin > b:
        b = work_b2 + integration_margin
    a = b - integration_margin
    if work_a > a:
        a = work_a
    print("  round " + str(r) + " : A week " + str(a) + ", B week " + str(b))
print("")
if a == date_a:
    if b == date_b:
        print("  neither date moved. " + str(discovery) + " weeks of work appeared and the pair is")
        print("  unchanged, because each date is supported by the other and the")
        print("  margin between them still holds")
print("")
print("where it comes to rest")
print("  team A : week " + str(a) + ", against " + str(work_a) + " weeks of work")
print("  team B : week " + str(b) + ", against " + str(work_b2) + " weeks of work plus " + str(integration_margin))
if a > work_a:
    print("  A is still " + str(a - work_a) + " weeks past what its own work needs, because it is")
    print("  anchored to B and B is anchored to the margin")
print("")
wa = work_a
wb = work_b2 + integration_margin
joint = 0
if wa > wb:
    joint = wa
else:
    joint = wb
print("if both dates were derived from estimates and reconciled once")
print("  team A : week " + str(wa) + ", team B : week " + str(wb))
print("  the pair ships at week " + str(joint))
if b > joint:
    print("  against week " + str(b) + " under the mutual anchoring, a difference of " + str(b - joint))
print("")
print("what a reader can conclude from the two announced dates")
print("  that the teams agree : yes")
print("  that either date is achievable : nothing")
print("  the agreement was produced by copying, which is also what agreement")
print("  produced by evidence looks like from outside")
print("")
ca = work_a
cb = work_b2 + integration_margin
cjoint = 0
if ca > cb:
    cjoint = ca
else:
    cjoint = cb
print("control - team A dates from its own estimate, B aligns to A")
print("  before the discovery : A week " + str(work_a) + ", B week " + str(work_b + integration_margin))
print("  after                : A week " + str(ca) + ", B week " + str(cb))
print("  the discovery moved the pair by " + str(cb - work_b - integration_margin) + ", which is the discovery")
print("")
print("Planning against the dependency is what coordination is, and the two dates")
print("are consistent to the week. Consistency between two copies is not evidence")
print("about the work, and the work is what the dates are about.")
```

## stdout (executed)

```text
real work remaining : team A 14 weeks, team B 9 weeks
announced dates     : team A week 16, team B week 18
integration margin  : 2 weeks

what each announced date was derived from
  team A : team B's date 18 minus the margin 2 = 16
  team B : team A's date 16 plus the margin 2 = 18
  the pair is consistent, and each date's only support is the other

what the work implies
  team A : 14 weeks of work, so week 14
  team B : 9 weeks of work, so week 9
  the binding one is team A at week 14
  the announced date for A is 2 weeks later than its own work needs
  and B's is 7 weeks later than B's work plus the margin

team B discovers 3 more weeks of work, taking it to 12

if each side re-derives from the other, one round at a time
  round 1 : A week 16, B week 18
  round 2 : A week 16, B week 18
  round 3 : A week 16, B week 18
  round 4 : A week 16, B week 18

  neither date moved. 3 weeks of work appeared and the pair is
  unchanged, because each date is supported by the other and the
  margin between them still holds

where it comes to rest
  team A : week 16, against 14 weeks of work
  team B : week 18, against 12 weeks of work plus 2
  A is still 2 weeks past what its own work needs, because it is
  anchored to B and B is anchored to the margin

if both dates were derived from estimates and reconciled once
  team A : week 14, team B : week 14
  the pair ships at week 14
  against week 18 under the mutual anchoring, a difference of 4

what a reader can conclude from the two announced dates
  that the teams agree : yes
  that either date is achievable : nothing
  the agreement was produced by copying, which is also what agreement
  produced by evidence looks like from outside

control - team A dates from its own estimate, B aligns to A
  before the discovery : A week 14, B week 11
  after                : A week 14, B week 14
  the discovery moved the pair by 3, which is the discovery

Planning against the dependency is what coordination is, and the two dates
are consistent to the week. Consistency between two copies is not evidence
about the work, and the work is what the dates are about.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
