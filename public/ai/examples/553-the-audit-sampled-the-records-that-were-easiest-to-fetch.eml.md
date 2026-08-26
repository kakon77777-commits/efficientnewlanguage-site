<!-- canonical: efficientnewlanguage.org/ai/examples/553-the-audit-sampled-the-records-that-were-easiest-to-fetch | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 553 — The audit sampled the records that were easiest to fetch

`the_audit_sampled_the_records_that_were_easiest_to_fetch.eml` - An audit sampled 500 of 50000 accounts and found a defect rate of 4 per thousand. What that rate is a rate of is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). An audit sampled
# 500 of 50000 accounts and found a defect rate of 4 per thousand. What that
# rate is a rate of is computed below.
#
# The sample size was chosen properly, from a table, for a stated confidence
# level, and 500 is genuinely enough for a population of 50000. The auditor
# checked that. The sampling query was written to be fast because the audit runs
# nightly and a full scan would lock the table during the batch window - a real
# operational constraint, raised by the DBA, and respected. The query reads from
# the account cache, which is what every other read path in the system uses.
#
# The cache holds accounts touched in the last 90 days. That is 12000 of the
# 50000. The other 38000 are dormant, and dormant is not a neutral property: an
# account is dormant because nobody has touched it, and nobody touching it is
# also why its address, its tax code and its consent flags were never migrated
# when the schema changed.
#
# The sample is unbiased with respect to everything except the one attribute
# that determines whether a record is in the frame at all - and that attribute
# is correlated with the defect.

50000 => accounts
12000 => active
500 => sample_size

accounts - active => dormant

# defects per thousand, by stratum
4 => rate_active
60 => rate_dormant

"accounts            : " + str(accounts) ^0
"  in cache, active  : " + str(active) ^0
"  dormant           : " + str(dormant) ^0
"sample size         : " + str(sample_size) + ", drawn from the cache" ^0
"" ^0

# ---- what the audit saw ----

int(sample_size * rate_active / 1000) => observed_defects
int(observed_defects * 1000 / sample_size) => observed_rate
int(accounts * observed_defects / sample_size) => extrapolated

"the audit" ^0
"  defects found in the sample : " + str(observed_defects) + " of " + str(sample_size) ^0
"  observed rate               : " + str(observed_rate) + " per thousand" ^0
"  extrapolated to " + str(accounts) + "    : " + str(extrapolated) + " defective accounts" ^0
"" ^0

# ---- what is there ----

int(active * rate_active / 1000) => defects_active
int(dormant * rate_dormant / 1000) => defects_dormant
defects_active + defects_dormant => defects_true

"stratum    accounts   rate per thousand   defects   in the sampling frame" ^0
"  active     " + str(active) + "        " + str(rate_active) + "                  " + str(defects_active) + "       yes" ^0
"  dormant    " + str(dormant) + "        " + str(rate_dormant) + "                 " + str(defects_dormant) + "     no" ^0
"  total      " + str(accounts) + "                            " + str(defects_true) ^0
"" ^0

"  audit reported : " + str(extrapolated) ^0
"  actually there : " + str(defects_true) ^0
"  understated by a factor of " + str(int(defects_true / extrapolated)) ^0
"" ^0

# ---- the rate was correct ----
#
# 4 per thousand is the true rate of the population the sample was drawn from.
# The sample is a good estimate of the cache. The report labelled it "accounts".

"the estimate, judged against the population it actually sampled" ^0
"  estimated rate in cache : " + str(observed_rate) + " per thousand" ^0
"  true rate in cache      : " + str(rate_active) + " per thousand" ^0
"  error                   : " + str(observed_rate - rate_active) + " per thousand" ^0
"  the sampling was correct; every step of it was correct" ^0
"" ^0
"  what was wrong is one word in the sentence that reported it" ^0
"  'we sampled accounts' should have read 'we sampled cached accounts'" ^0
"" ^0

# ---- why convenience is not neutral here ----
#
# A convenience sample is harmless when convenience is unrelated to the thing
# being measured. Here the mechanism that puts a record in the cache is the
# same mechanism that would have fixed it.

"the causal chain that makes the frame biased" ^0
"  an account is cached because it was touched recently" ^0
"  an account was migrated because someone touched it" ^0
"  so cached implies touched implies migrated implies not defective" ^0
"  the frame and the defect share a cause, which is the definition of a" ^0
"  biased frame, and no sample size fixes it" ^0
"" ^0
"  a larger sample from the same frame" ^0
5000 => bigger_sample
int(bigger_sample * rate_active / 1000) => bigger_defects
"    sample " + str(bigger_sample) + " instead of " + str(sample_size) + " : " + str(int(accounts * bigger_defects / bigger_sample)) + " extrapolated" ^0
"    ten times the work, the same wrong answer, with tighter confidence bounds" ^0
"" ^0

# ---- the control ----
#
# Draw the sample from the whole table instead of the cache, keeping every
# other choice identical - same size, same confidence level, same checks. This
# is the measurement that separates "the sample was too small" from "the sample
# came from the wrong place".

int(sample_size * active / accounts) => frame_active
sample_size - frame_active => frame_dormant
int(frame_active * rate_active / 1000) + int(frame_dormant * rate_dormant / 1000) => frame_defects

"control - the same sample size drawn from the whole table" ^0
"  sampled from active  : " + str(frame_active) ^0
"  sampled from dormant : " + str(frame_dormant) ^0
"  defects found        : " + str(frame_defects) ^0
"  extrapolated         : " + str(int(accounts * frame_defects / sample_size)) ^0
"  actually there       : " + str(defects_true) ^0
int(accounts * frame_defects / sample_size) => frame_extrapolated
"  cache-only frame was low by  : " + str(int((defects_true - extrapolated) * 100 / defects_true)) + " percent" ^0
"  whole-table frame is low by  : " + str(int((defects_true - frame_extrapolated) * 100 / defects_true)) + " percent" ^0
"  the same 500 records of effort, and the frame is the only thing that changed" ^0
"" ^0

# ---- the null control ----
#
# The same convenient frame, against a table where both strata have the same
# defect rate. The convenience sample is then unbiased, because convenience is
# no longer correlated with the defect. Sampling from the cache is not the
# defect on its own.

"null control - the same cache-only frame, uniform defect rate across strata" ^0
int(active * rate_active / 1000) + int(dormant * rate_active / 1000) => uniform_true
"  rate in both strata : " + str(rate_active) + " per thousand" ^0
"  extrapolated from cache sample : " + str(extrapolated) ^0
"  actually there                 : " + str(uniform_true) ^0
"  difference                     : " + str(uniform_true - extrapolated) ^0
"  the same query, the same frame, and now it is a fine estimate" ^0
"  so the rule is not 'do not sample from a cache'" ^0
"  it is 'a frame is biased exactly as far as belonging to it predicts the" ^0
"  answer'" ^0
"" ^0

# ---- the rule ----

"what a sample size protects against" ^0
"  random variation in the estimate      yes" ^0
"  a frame that excludes part of the population   no" ^0
"  a frame whose membership predicts the answer   no, and it makes it worse" ^0
"  the confidence interval is computed from the sample size" ^0
"  so a biased frame reports a tight interval around the wrong number" ^0
"" ^0

"500 of 50000 is a correct sample size, the confidence level was chosen from a" ^0
"table, and reading from the cache avoided locking the table during the batch" ^0
"window - which the DBA had asked for. The rate that came back, " + str(observed_rate) + " per" ^0
"thousand, is the true rate of cached accounts. " + str(defects_true) + " accounts are defective," ^0
"the audit reported " + str(extrapolated) + ", and " + str(defects_dormant) + " of the defects were in records the query" ^0
"was written never to read." ^0
```

## Python (deterministic transpilation)

```python
accounts = 50000
active = 12000
sample_size = 500
dormant = accounts - active
rate_active = 4
rate_dormant = 60
print("accounts            : " + str(accounts))
print("  in cache, active  : " + str(active))
print("  dormant           : " + str(dormant))
print("sample size         : " + str(sample_size) + ", drawn from the cache")
print("")
observed_defects = int(sample_size * rate_active / 1000)
observed_rate = int(observed_defects * 1000 / sample_size)
extrapolated = int(accounts * observed_defects / sample_size)
print("the audit")
print("  defects found in the sample : " + str(observed_defects) + " of " + str(sample_size))
print("  observed rate               : " + str(observed_rate) + " per thousand")
print("  extrapolated to " + str(accounts) + "    : " + str(extrapolated) + " defective accounts")
print("")
defects_active = int(active * rate_active / 1000)
defects_dormant = int(dormant * rate_dormant / 1000)
defects_true = defects_active + defects_dormant
print("stratum    accounts   rate per thousand   defects   in the sampling frame")
print("  active     " + str(active) + "        " + str(rate_active) + "                  " + str(defects_active) + "       yes")
print("  dormant    " + str(dormant) + "        " + str(rate_dormant) + "                 " + str(defects_dormant) + "     no")
print("  total      " + str(accounts) + "                            " + str(defects_true))
print("")
print("  audit reported : " + str(extrapolated))
print("  actually there : " + str(defects_true))
print("  understated by a factor of " + str(int(defects_true / extrapolated)))
print("")
print("the estimate, judged against the population it actually sampled")
print("  estimated rate in cache : " + str(observed_rate) + " per thousand")
print("  true rate in cache      : " + str(rate_active) + " per thousand")
print("  error                   : " + str(observed_rate - rate_active) + " per thousand")
print("  the sampling was correct; every step of it was correct")
print("")
print("  what was wrong is one word in the sentence that reported it")
print("  'we sampled accounts' should have read 'we sampled cached accounts'")
print("")
print("the causal chain that makes the frame biased")
print("  an account is cached because it was touched recently")
print("  an account was migrated because someone touched it")
print("  so cached implies touched implies migrated implies not defective")
print("  the frame and the defect share a cause, which is the definition of a")
print("  biased frame, and no sample size fixes it")
print("")
print("  a larger sample from the same frame")
bigger_sample = 5000
bigger_defects = int(bigger_sample * rate_active / 1000)
print("    sample " + str(bigger_sample) + " instead of " + str(sample_size) + " : " + str(int(accounts * bigger_defects / bigger_sample)) + " extrapolated")
print("    ten times the work, the same wrong answer, with tighter confidence bounds")
print("")
frame_active = int(sample_size * active / accounts)
frame_dormant = sample_size - frame_active
frame_defects = int(frame_active * rate_active / 1000) + int(frame_dormant * rate_dormant / 1000)
print("control - the same sample size drawn from the whole table")
print("  sampled from active  : " + str(frame_active))
print("  sampled from dormant : " + str(frame_dormant))
print("  defects found        : " + str(frame_defects))
print("  extrapolated         : " + str(int(accounts * frame_defects / sample_size)))
print("  actually there       : " + str(defects_true))
frame_extrapolated = int(accounts * frame_defects / sample_size)
print("  cache-only frame was low by  : " + str(int((defects_true - extrapolated) * 100 / defects_true)) + " percent")
print("  whole-table frame is low by  : " + str(int((defects_true - frame_extrapolated) * 100 / defects_true)) + " percent")
print("  the same 500 records of effort, and the frame is the only thing that changed")
print("")
print("null control - the same cache-only frame, uniform defect rate across strata")
uniform_true = int(active * rate_active / 1000) + int(dormant * rate_active / 1000)
print("  rate in both strata : " + str(rate_active) + " per thousand")
print("  extrapolated from cache sample : " + str(extrapolated))
print("  actually there                 : " + str(uniform_true))
print("  difference                     : " + str(uniform_true - extrapolated))
print("  the same query, the same frame, and now it is a fine estimate")
print("  so the rule is not 'do not sample from a cache'")
print("  it is 'a frame is biased exactly as far as belonging to it predicts the")
print("  answer'")
print("")
print("what a sample size protects against")
print("  random variation in the estimate      yes")
print("  a frame that excludes part of the population   no")
print("  a frame whose membership predicts the answer   no, and it makes it worse")
print("  the confidence interval is computed from the sample size")
print("  so a biased frame reports a tight interval around the wrong number")
print("")
print("500 of 50000 is a correct sample size, the confidence level was chosen from a")
print("table, and reading from the cache avoided locking the table during the batch")
print("window - which the DBA had asked for. The rate that came back, " + str(observed_rate) + " per")
print("thousand, is the true rate of cached accounts. " + str(defects_true) + " accounts are defective,")
print("the audit reported " + str(extrapolated) + ", and " + str(defects_dormant) + " of the defects were in records the query")
print("was written never to read.")
```

## stdout (executed)

```text
accounts            : 50000
  in cache, active  : 12000
  dormant           : 38000
sample size         : 500, drawn from the cache

the audit
  defects found in the sample : 2 of 500
  observed rate               : 4 per thousand
  extrapolated to 50000    : 200 defective accounts

stratum    accounts   rate per thousand   defects   in the sampling frame
  active     12000        4                  48       yes
  dormant    38000        60                 2280     no
  total      50000                            2328

  audit reported : 200
  actually there : 2328
  understated by a factor of 11

the estimate, judged against the population it actually sampled
  estimated rate in cache : 4 per thousand
  true rate in cache      : 4 per thousand
  error                   : 0 per thousand
  the sampling was correct; every step of it was correct

  what was wrong is one word in the sentence that reported it
  'we sampled accounts' should have read 'we sampled cached accounts'

the causal chain that makes the frame biased
  an account is cached because it was touched recently
  an account was migrated because someone touched it
  so cached implies touched implies migrated implies not defective
  the frame and the defect share a cause, which is the definition of a
  biased frame, and no sample size fixes it

  a larger sample from the same frame
    sample 5000 instead of 500 : 200 extrapolated
    ten times the work, the same wrong answer, with tighter confidence bounds

control - the same sample size drawn from the whole table
  sampled from active  : 120
  sampled from dormant : 380
  defects found        : 22
  extrapolated         : 2200
  actually there       : 2328
  cache-only frame was low by  : 91 percent
  whole-table frame is low by  : 5 percent
  the same 500 records of effort, and the frame is the only thing that changed

null control - the same cache-only frame, uniform defect rate across strata
  rate in both strata : 4 per thousand
  extrapolated from cache sample : 200
  actually there                 : 200
  difference                     : 0
  the same query, the same frame, and now it is a fine estimate
  so the rule is not 'do not sample from a cache'
  it is 'a frame is biased exactly as far as belonging to it predicts the
  answer'

what a sample size protects against
  random variation in the estimate      yes
  a frame that excludes part of the population   no
  a frame whose membership predicts the answer   no, and it makes it worse
  the confidence interval is computed from the sample size
  so a biased frame reports a tight interval around the wrong number

500 of 50000 is a correct sample size, the confidence level was chosen from a
table, and reading from the cache avoided locking the table during the batch
window - which the DBA had asked for. The rate that came back, 4 per
thousand, is the true rate of cached accounts. 2328 accounts are defective,
the audit reported 200, and 2280 of the defects were in records the query
was written never to read.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
