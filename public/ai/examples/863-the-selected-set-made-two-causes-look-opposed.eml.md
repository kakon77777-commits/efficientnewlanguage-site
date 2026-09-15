<!-- canonical: efficientnewlanguage.org/ai/examples/863-the-selected-set-made-two-causes-look-opposed | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 863 — The selected set made two causes look opposed

`the_selected_set_made_two_causes_look_opposed.eml` - Among admitted students, academic and athletic scores are negatively related: the weaker a student is academically, the stronger athletically. The correlation is real and correctly computed. What the sample was conditioned on is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Among admitted
# students, academic and athletic scores are negatively related: the weaker a
# student is academically, the stronger athletically. The correlation is real and
# correctly computed. What the sample was conditioned on is computed below.
#
# The measurement is careful. It uses the real recorded scores, not estimates; it
# covers every admitted student; the conditional rates are honest counts; and the
# intent is exactly 'are the two abilities related'.
#
# Admission required being high in at least one of the two, so a low-academic
# admit must be high-athletic - the sample is conditioned on a common effect of
# both, and that manufactures the negative relation.

10000 => applicants
2500 => rejected_low_in_both
5000 => admitted_high_academic
2500 => of_those_high_athletic
2500 => admitted_low_academic
2500 => of_those_low_academic_high_athletic

applicants - rejected_low_in_both => admitted
int(of_those_high_athletic * 10000 / admitted_high_academic) => admitted_high_ath_given_high_ac
int(of_those_low_academic_high_athletic * 10000 / admitted_low_academic) => admitted_high_ath_given_low_ac
admitted_high_ath_given_low_ac - admitted_high_ath_given_high_ac => manufactured_gap_per_myriad

"applicants                      : " + str(applicants) ^0
"  rejected (low in both)        : " + str(rejected_low_in_both) ^0
"  admitted                      : " + str(admitted) ^0
"" ^0
"among admitted, high-athletic given high-academic : " + str(admitted_high_ath_given_high_ac) + " per myriad" ^0
"among admitted, high-athletic given low-academic  : " + str(admitted_high_ath_given_low_ac) + " per myriad" ^0
"manufactured gap                : " + str(manufactured_gap_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the measurement verified ----

"the correlation measurement" ^0
"  uses : the real recorded scores, not estimates" ^0
"  covers : every admitted student" ^0
"  rates : honest counts of high-athletic within each group" ^0
"  intent : are academic and athletic ability related" ^0
"  students omitted : 0" ^0
"  verdict : AMONG ADMITTED, LOWER ACADEMIC MEANS HIGHER ATHLETIC" ^0
"" ^0
"  computing the conditional rates from real counts over" ^0
"  every admitted student is the part done right here, and" ^0
"  it is why the negative relation in that sample is genuine" ^0
"" ^0

# ---- what the sample was conditioned on ----

"the set the rates were computed over" ^0
"  who is in it : admitted students only" ^0
"  the admission rule : high in academics OR athletics" ^0
"  what that rule is : a common effect of both abilities" ^0
"  a low-academic student who was admitted : must have been" ^0
"    high-athletic, or would have been rejected" ^0
"  so within the admitted : low academic forces high" ^0
"    athletic, a relation the rule created, not the abilities" ^0
"" ^0

# ---- what the caller concluded ----

"the conclusion drawn" ^0
"  claim : athletic training crowds out academics" ^0
"  gap among admitted : " + str(manufactured_gap_per_myriad) + " per myriad" ^0
"  gap in the full applicant pool : 0, the two are" ^0
"    independent" ^0
"  are the admitted rates wrong : no; they are exact" ^0
"  do the abilities oppose each other : no; conditioning on" ^0
"    admission, a collider, made independent traits look" ^0
"    opposed" ^0
"" ^0

# ---- null control ----

# The same scores, with the rates computed over the full applicant pool (not
# conditioned on admission), or within a single ability's admits.
5000 => nc_high_ath_given_high_ac_in_full_pool
5000 => nc_high_ath_given_low_ac_in_full_pool
0 => nc_gap_in_the_full_pool

"null control - measure the full applicant pool, not the admitted" ^0
"  high-athletic given high-academic, full pool : " + str(nc_high_ath_given_high_ac_in_full_pool) + " per myriad" ^0
"  high-athletic given low-academic, full pool  : " + str(nc_high_ath_given_low_ac_in_full_pool) + " per myriad" ^0
"  gap in the full pool : " + str(nc_gap_in_the_full_pool) ^0
"  no student and no score changed; the rates stopped being" ^0
"  taken over the common effect and started being taken over" ^0
"  everyone" ^0
"" ^0

# ---- the rule ----

"what a correlation over a selected sample guarantees" ^0
"  the relation within the sample is correctly computed :" ^0
"    exactly, real scores, every admit, honest rates" ^0
"  the two abilities are related in the world : not" ^0
"    addressed; admission requires high in one or the other," ^0
"    so conditioning on it forces a low-academic admit to be" ^0
"    high-athletic - a " + str(manufactured_gap_per_myriad) + "-per-myriad gap that is 0 in the pool" ^0
"" ^0

"selection on a common effect of two independent causes correlates them among the" ^0
"selected; requiring at least one to be high means whoever is low on one is high" ^0
"on the other, so the relation is a fact about the gate, not about the causes" ^0
"" ^0

"It computes honest conditional rates over every admitted student - the negative" ^0
"relation in that sample is real. But admission requires being high in one ability" ^0
"or the other, a collider, so a low-academic admit must be high-athletic; over the" ^0
"full pool the gap is " + str(nc_gap_in_the_full_pool) + ", and the whole " + str(manufactured_gap_per_myriad) + " per myriad is the selection." ^0
```

## Python (deterministic transpilation)

```python
applicants = 10000
rejected_low_in_both = 2500
admitted_high_academic = 5000
of_those_high_athletic = 2500
admitted_low_academic = 2500
of_those_low_academic_high_athletic = 2500
admitted = applicants - rejected_low_in_both
admitted_high_ath_given_high_ac = int(of_those_high_athletic * 10000 / admitted_high_academic)
admitted_high_ath_given_low_ac = int(of_those_low_academic_high_athletic * 10000 / admitted_low_academic)
manufactured_gap_per_myriad = admitted_high_ath_given_low_ac - admitted_high_ath_given_high_ac
print("applicants                      : " + str(applicants))
print("  rejected (low in both)        : " + str(rejected_low_in_both))
print("  admitted                      : " + str(admitted))
print("")
print("among admitted, high-athletic given high-academic : " + str(admitted_high_ath_given_high_ac) + " per myriad")
print("among admitted, high-athletic given low-academic  : " + str(admitted_high_ath_given_low_ac) + " per myriad")
print("manufactured gap                : " + str(manufactured_gap_per_myriad) + " per ten thousand")
print("")
print("the correlation measurement")
print("  uses : the real recorded scores, not estimates")
print("  covers : every admitted student")
print("  rates : honest counts of high-athletic within each group")
print("  intent : are academic and athletic ability related")
print("  students omitted : 0")
print("  verdict : AMONG ADMITTED, LOWER ACADEMIC MEANS HIGHER ATHLETIC")
print("")
print("  computing the conditional rates from real counts over")
print("  every admitted student is the part done right here, and")
print("  it is why the negative relation in that sample is genuine")
print("")
print("the set the rates were computed over")
print("  who is in it : admitted students only")
print("  the admission rule : high in academics OR athletics")
print("  what that rule is : a common effect of both abilities")
print("  a low-academic student who was admitted : must have been")
print("    high-athletic, or would have been rejected")
print("  so within the admitted : low academic forces high")
print("    athletic, a relation the rule created, not the abilities")
print("")
print("the conclusion drawn")
print("  claim : athletic training crowds out academics")
print("  gap among admitted : " + str(manufactured_gap_per_myriad) + " per myriad")
print("  gap in the full applicant pool : 0, the two are")
print("    independent")
print("  are the admitted rates wrong : no; they are exact")
print("  do the abilities oppose each other : no; conditioning on")
print("    admission, a collider, made independent traits look")
print("    opposed")
print("")
nc_high_ath_given_high_ac_in_full_pool = 5000
nc_high_ath_given_low_ac_in_full_pool = 5000
nc_gap_in_the_full_pool = 0
print("null control - measure the full applicant pool, not the admitted")
print("  high-athletic given high-academic, full pool : " + str(nc_high_ath_given_high_ac_in_full_pool) + " per myriad")
print("  high-athletic given low-academic, full pool  : " + str(nc_high_ath_given_low_ac_in_full_pool) + " per myriad")
print("  gap in the full pool : " + str(nc_gap_in_the_full_pool))
print("  no student and no score changed; the rates stopped being")
print("  taken over the common effect and started being taken over")
print("  everyone")
print("")
print("what a correlation over a selected sample guarantees")
print("  the relation within the sample is correctly computed :")
print("    exactly, real scores, every admit, honest rates")
print("  the two abilities are related in the world : not")
print("    addressed; admission requires high in one or the other,")
print("    so conditioning on it forces a low-academic admit to be")
print("    high-athletic - a " + str(manufactured_gap_per_myriad) + "-per-myriad gap that is 0 in the pool")
print("")
print("selection on a common effect of two independent causes correlates them among the")
print("selected; requiring at least one to be high means whoever is low on one is high")
print("on the other, so the relation is a fact about the gate, not about the causes")
print("")
print("It computes honest conditional rates over every admitted student - the negative")
print("relation in that sample is real. But admission requires being high in one ability")
print("or the other, a collider, so a low-academic admit must be high-athletic; over the")
print("full pool the gap is " + str(nc_gap_in_the_full_pool) + ", and the whole " + str(manufactured_gap_per_myriad) + " per myriad is the selection.")
```

## stdout (executed)

```text
applicants                      : 10000
  rejected (low in both)        : 2500
  admitted                      : 7500

among admitted, high-athletic given high-academic : 5000 per myriad
among admitted, high-athletic given low-academic  : 10000 per myriad
manufactured gap                : 5000 per ten thousand

the correlation measurement
  uses : the real recorded scores, not estimates
  covers : every admitted student
  rates : honest counts of high-athletic within each group
  intent : are academic and athletic ability related
  students omitted : 0
  verdict : AMONG ADMITTED, LOWER ACADEMIC MEANS HIGHER ATHLETIC

  computing the conditional rates from real counts over
  every admitted student is the part done right here, and
  it is why the negative relation in that sample is genuine

the set the rates were computed over
  who is in it : admitted students only
  the admission rule : high in academics OR athletics
  what that rule is : a common effect of both abilities
  a low-academic student who was admitted : must have been
    high-athletic, or would have been rejected
  so within the admitted : low academic forces high
    athletic, a relation the rule created, not the abilities

the conclusion drawn
  claim : athletic training crowds out academics
  gap among admitted : 5000 per myriad
  gap in the full applicant pool : 0, the two are
    independent
  are the admitted rates wrong : no; they are exact
  do the abilities oppose each other : no; conditioning on
    admission, a collider, made independent traits look
    opposed

null control - measure the full applicant pool, not the admitted
  high-athletic given high-academic, full pool : 5000 per myriad
  high-athletic given low-academic, full pool  : 5000 per myriad
  gap in the full pool : 0
  no student and no score changed; the rates stopped being
  taken over the common effect and started being taken over
  everyone

what a correlation over a selected sample guarantees
  the relation within the sample is correctly computed :
    exactly, real scores, every admit, honest rates
  the two abilities are related in the world : not
    addressed; admission requires high in one or the other,
    so conditioning on it forces a low-academic admit to be
    high-athletic - a 5000-per-myriad gap that is 0 in the pool

selection on a common effect of two independent causes correlates them among the
selected; requiring at least one to be high means whoever is low on one is high
on the other, so the relation is a fact about the gate, not about the causes

It computes honest conditional rates over every admitted student - the negative
relation in that sample is real. But admission requires being high in one ability
or the other, a collider, so a low-academic admit must be high-athletic; over the
full pool the gap is 0, and the whole 5000 per myriad is the selection.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
