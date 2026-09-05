<!-- canonical: efficientnewlanguage.org/ai/examples/711-the-sample-was-stratified-and-the-strata-were-stale | ai_layer_version: 0.1.0 | updated: 2026-09-05 -->

# Example 711 — The sample was stratified and the strata were stale

`the_sample_was_stratified_and_the_strata_were_stale.eml` - The quality sample is stratified with proportional allocation and weighted estimation, reviewed by a statistician. What the weights reconstruct is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The quality sample
# is stratified with proportional allocation and weighted estimation, reviewed
# by a statistician. What the weights reconstruct is computed below.
#
# The sampling design is the good kind. It is not a convenience sample of
# whoever answers; the population is partitioned into twelve strata by region
# and plan tier, allocation is proportional to stratum size, every estimate is
# weighted back to the population, and the whole design was reviewed by a
# statistician who checked the estimator and the variance calculation.
#
# The weights encode the stratum SIZES, and the sizes came from a snapshot of
# the population taken when the design was written. The design has not changed
# since, which is correct for a design and wrong for a measurement of a moving
# population.
#
# That snapshot is fourteen months old.

12 => strata
4800 => sampled_per_quarter
14 => months_since_the_population_snapshot
0 => refreshes_of_the_stratum_sizes_since_design
240000 => accounts_at_the_snapshot
412000 => accounts_now
74000 => self_serve_accounts_at_the_snapshot
214000 => self_serve_accounts_now
1 => statistician_reviews_of_the_design

int(self_serve_accounts_at_the_snapshot * 10000 / accounts_at_the_snapshot) => weight_in_use_per_myriad
int(self_serve_accounts_now * 10000 / accounts_now) => correct_weight_per_myriad
correct_weight_per_myriad - weight_in_use_per_myriad => weight_error_per_myriad
accounts_now - accounts_at_the_snapshot => accounts_added_since_the_snapshot

"strata                          : " + str(strata) ^0
"sampled per quarter             : " + str(sampled_per_quarter) ^0
"statistician reviews of the design : " + str(statistician_reviews_of_the_design) ^0
"months since the population snapshot : " + str(months_since_the_population_snapshot) ^0
"refreshes of the stratum sizes  : " + str(refreshes_of_the_stratum_sizes_since_design) ^0
"" ^0
"accounts at the snapshot        : " + str(accounts_at_the_snapshot) ^0
"accounts now                    : " + str(accounts_now) ^0
"  added since                   : " + str(accounts_added_since_the_snapshot) ^0
"" ^0
"self-serve share, weight in use : " + str(weight_in_use_per_myriad) + " per ten thousand" ^0
"self-serve share, actual now    : " + str(correct_weight_per_myriad) + " per ten thousand" ^0
"  error in the weight           : " + str(weight_error_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the design verified ----

"the sampling design" ^0
"  population partitioned into strata : " + str(strata) ^0
"  allocation : proportional to stratum size" ^0
"  estimates weighted back to the population : yes" ^0
"  estimator and variance reviewed : by a statistician" ^0
"  verdict : STRATIFIED" ^0
"" ^0
"  a stratified design beats a convenience sample by a wide" ^0
"  margin and this one is correctly specified" ^0
"" ^0

# ---- what the weights are a statement about ----

"one weight" ^0
"  what it encodes : the share of the population in this" ^0
"    stratum" ^0
"  where that share came from : a snapshot of the population" ^0
"  when that snapshot was taken : " + str(months_since_the_population_snapshot) + " months ago" ^0
"  what the estimate is therefore unbiased for : the" ^0
"    population as it was then" ^0
"  how often the design says to refresh it : the design is a" ^0
"    design; it says how to weight, not when to re-measure" ^0
"" ^0
"  the estimator is unbiased and the population it is" ^0
"  unbiased for is not the one being reported on" ^0
"" ^0

# ---- why every diagnostic is green ----

# Response rate per stratum, achieved allocation against target allocation,
# margin of error, design effect - all of them are computed against the strata
# as defined, so all of them are consistent and all of them are green.
"what the quarterly report can check" ^0
"  response rate per stratum : computed, healthy" ^0
"  achieved allocation vs target : matches" ^0
"  margin of error : computed from the design" ^0
"  design effect   : computed from the design" ^0
"  stratum sizes vs the current population : not computed" ^0
"  the check that would show it : one query against the" ^0
"    accounts table, which nothing runs" ^0
"" ^0

# ---- the direction of the error ----

# The tier that grew is under-weighted, so its experience is discounted by the
# same factor the design applies deliberately to a small stratum. The estimate
# is precise, and precise about a smaller company.
"the effect on one estimate" ^0
"  self-serve accounts then : " + str(self_serve_accounts_at_the_snapshot) ^0
"  self-serve accounts now  : " + str(self_serve_accounts_now) ^0
"  weight applied to them   : " + str(weight_in_use_per_myriad) + " per ten thousand" ^0
"  weight they should carry : " + str(correct_weight_per_myriad) + " per ten thousand" ^0
"  the estimate is : precise, and about the population of" ^0
"    " + str(months_since_the_population_snapshot) + " months ago" ^0
"" ^0

# ---- null control ----

# The same design, with stratum sizes recomputed from the accounts table before
# each quarter's allocation.
correct_weight_per_myriad => nc_weight_in_use_per_myriad
0 => nc_weight_error_per_myriad

"null control - stratum sizes recomputed each quarter" ^0
"  strata and allocation rule : unchanged" ^0
"  weight in use       : " + str(nc_weight_in_use_per_myriad) + " per ten thousand" ^0
"  error in the weight : " + str(nc_weight_error_per_myriad) + " per ten thousand" ^0
"  the design did not improve; the quantity it reads was" ^0
"  read again" ^0
"" ^0

# ---- the rule ----

"what a stratified sample guarantees" ^0
"  unbiased estimates for the population the weights" ^0
"    describe : exactly, and demonstrably" ^0
"  unbiased estimates for the current population : not" ^0
"    addressed; the weights are data, and this design has" ^0
"    no step that re-reads them" ^0
"" ^0
"a sampling design is a function of the population it was" ^0
"written against; reviewing the method proves the method and" ^0
"leaves the parameter unexamined, because a parameter is not" ^0
"part of a method" ^0
"" ^0

"The design is properly stratified - " + str(strata) + " strata, proportional allocation, weighted" ^0
"estimation, reviewed by a statistician - and every diagnostic it computes is" ^0
"green. Its weights come from a population snapshot " + str(months_since_the_population_snapshot) + " months old, refreshed" ^0
str(refreshes_of_the_stratum_sizes_since_design) + " times since, over which the account base went from " + str(accounts_at_the_snapshot) + " to " + str(accounts_now) + "," ^0
"so the self-serve stratum is weighted at " + str(weight_in_use_per_myriad) + " per ten thousand instead of" ^0
str(correct_weight_per_myriad) + " - an error of " + str(weight_error_per_myriad) + " per ten thousand in a quantity nothing recomputes." ^0
```

## Python (deterministic transpilation)

```python
strata = 12
sampled_per_quarter = 4800
months_since_the_population_snapshot = 14
refreshes_of_the_stratum_sizes_since_design = 0
accounts_at_the_snapshot = 240000
accounts_now = 412000
self_serve_accounts_at_the_snapshot = 74000
self_serve_accounts_now = 214000
statistician_reviews_of_the_design = 1
weight_in_use_per_myriad = int(self_serve_accounts_at_the_snapshot * 10000 / accounts_at_the_snapshot)
correct_weight_per_myriad = int(self_serve_accounts_now * 10000 / accounts_now)
weight_error_per_myriad = correct_weight_per_myriad - weight_in_use_per_myriad
accounts_added_since_the_snapshot = accounts_now - accounts_at_the_snapshot
print("strata                          : " + str(strata))
print("sampled per quarter             : " + str(sampled_per_quarter))
print("statistician reviews of the design : " + str(statistician_reviews_of_the_design))
print("months since the population snapshot : " + str(months_since_the_population_snapshot))
print("refreshes of the stratum sizes  : " + str(refreshes_of_the_stratum_sizes_since_design))
print("")
print("accounts at the snapshot        : " + str(accounts_at_the_snapshot))
print("accounts now                    : " + str(accounts_now))
print("  added since                   : " + str(accounts_added_since_the_snapshot))
print("")
print("self-serve share, weight in use : " + str(weight_in_use_per_myriad) + " per ten thousand")
print("self-serve share, actual now    : " + str(correct_weight_per_myriad) + " per ten thousand")
print("  error in the weight           : " + str(weight_error_per_myriad) + " per ten thousand")
print("")
print("the sampling design")
print("  population partitioned into strata : " + str(strata))
print("  allocation : proportional to stratum size")
print("  estimates weighted back to the population : yes")
print("  estimator and variance reviewed : by a statistician")
print("  verdict : STRATIFIED")
print("")
print("  a stratified design beats a convenience sample by a wide")
print("  margin and this one is correctly specified")
print("")
print("one weight")
print("  what it encodes : the share of the population in this")
print("    stratum")
print("  where that share came from : a snapshot of the population")
print("  when that snapshot was taken : " + str(months_since_the_population_snapshot) + " months ago")
print("  what the estimate is therefore unbiased for : the")
print("    population as it was then")
print("  how often the design says to refresh it : the design is a")
print("    design; it says how to weight, not when to re-measure")
print("")
print("  the estimator is unbiased and the population it is")
print("  unbiased for is not the one being reported on")
print("")
print("what the quarterly report can check")
print("  response rate per stratum : computed, healthy")
print("  achieved allocation vs target : matches")
print("  margin of error : computed from the design")
print("  design effect   : computed from the design")
print("  stratum sizes vs the current population : not computed")
print("  the check that would show it : one query against the")
print("    accounts table, which nothing runs")
print("")
print("the effect on one estimate")
print("  self-serve accounts then : " + str(self_serve_accounts_at_the_snapshot))
print("  self-serve accounts now  : " + str(self_serve_accounts_now))
print("  weight applied to them   : " + str(weight_in_use_per_myriad) + " per ten thousand")
print("  weight they should carry : " + str(correct_weight_per_myriad) + " per ten thousand")
print("  the estimate is : precise, and about the population of")
print("    " + str(months_since_the_population_snapshot) + " months ago")
print("")
nc_weight_in_use_per_myriad = correct_weight_per_myriad
nc_weight_error_per_myriad = 0
print("null control - stratum sizes recomputed each quarter")
print("  strata and allocation rule : unchanged")
print("  weight in use       : " + str(nc_weight_in_use_per_myriad) + " per ten thousand")
print("  error in the weight : " + str(nc_weight_error_per_myriad) + " per ten thousand")
print("  the design did not improve; the quantity it reads was")
print("  read again")
print("")
print("what a stratified sample guarantees")
print("  unbiased estimates for the population the weights")
print("    describe : exactly, and demonstrably")
print("  unbiased estimates for the current population : not")
print("    addressed; the weights are data, and this design has")
print("    no step that re-reads them")
print("")
print("a sampling design is a function of the population it was")
print("written against; reviewing the method proves the method and")
print("leaves the parameter unexamined, because a parameter is not")
print("part of a method")
print("")
print("The design is properly stratified - " + str(strata) + " strata, proportional allocation, weighted")
print("estimation, reviewed by a statistician - and every diagnostic it computes is")
print("green. Its weights come from a population snapshot " + str(months_since_the_population_snapshot) + " months old, refreshed")
print(str(refreshes_of_the_stratum_sizes_since_design) + " times since, over which the account base went from " + str(accounts_at_the_snapshot) + " to " + str(accounts_now) + ",")
print("so the self-serve stratum is weighted at " + str(weight_in_use_per_myriad) + " per ten thousand instead of")
print(str(correct_weight_per_myriad) + " - an error of " + str(weight_error_per_myriad) + " per ten thousand in a quantity nothing recomputes.")
```

## stdout (executed)

```text
strata                          : 12
sampled per quarter             : 4800
statistician reviews of the design : 1
months since the population snapshot : 14
refreshes of the stratum sizes  : 0

accounts at the snapshot        : 240000
accounts now                    : 412000
  added since                   : 172000

self-serve share, weight in use : 3083 per ten thousand
self-serve share, actual now    : 5194 per ten thousand
  error in the weight           : 2111 per ten thousand

the sampling design
  population partitioned into strata : 12
  allocation : proportional to stratum size
  estimates weighted back to the population : yes
  estimator and variance reviewed : by a statistician
  verdict : STRATIFIED

  a stratified design beats a convenience sample by a wide
  margin and this one is correctly specified

one weight
  what it encodes : the share of the population in this
    stratum
  where that share came from : a snapshot of the population
  when that snapshot was taken : 14 months ago
  what the estimate is therefore unbiased for : the
    population as it was then
  how often the design says to refresh it : the design is a
    design; it says how to weight, not when to re-measure

  the estimator is unbiased and the population it is
  unbiased for is not the one being reported on

what the quarterly report can check
  response rate per stratum : computed, healthy
  achieved allocation vs target : matches
  margin of error : computed from the design
  design effect   : computed from the design
  stratum sizes vs the current population : not computed
  the check that would show it : one query against the
    accounts table, which nothing runs

the effect on one estimate
  self-serve accounts then : 74000
  self-serve accounts now  : 214000
  weight applied to them   : 3083 per ten thousand
  weight they should carry : 5194 per ten thousand
  the estimate is : precise, and about the population of
    14 months ago

null control - stratum sizes recomputed each quarter
  strata and allocation rule : unchanged
  weight in use       : 5194 per ten thousand
  error in the weight : 0 per ten thousand
  the design did not improve; the quantity it reads was
  read again

what a stratified sample guarantees
  unbiased estimates for the population the weights
    describe : exactly, and demonstrably
  unbiased estimates for the current population : not
    addressed; the weights are data, and this design has
    no step that re-reads them

a sampling design is a function of the population it was
written against; reviewing the method proves the method and
leaves the parameter unexamined, because a parameter is not
part of a method

The design is properly stratified - 12 strata, proportional allocation, weighted
estimation, reviewed by a statistician - and every diagnostic it computes is
green. Its weights come from a population snapshot 14 months old, refreshed
0 times since, over which the account base went from 240000 to 412000,
so the self-serve stratum is weighted at 3083 per ten thousand instead of
5194 - an error of 2111 per ten thousand in a quantity nothing recomputes.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
