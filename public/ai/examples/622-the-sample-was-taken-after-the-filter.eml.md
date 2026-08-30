<!-- canonical: efficientnewlanguage.org/ai/examples/622-the-sample-was-taken-after-the-filter | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 622 — The sample was taken after the filter

`the_sample_was_taken_after_the_filter.eml` - A quality audit draws five hundred records at random from the processed table and finds a defect rate of two per thousand. What that table contains is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A quality audit
# draws five hundred records at random from the processed table and finds a
# defect rate of two per thousand. What that table contains is computed below.
#
# The sampling is correct and it was done properly. The draw is uniform, the
# sample size was chosen from the width of the interval the audit needed, the
# records were pulled without replacement, and nobody chose which ones. Within
# its frame the estimate is unbiased and the confidence interval is real.
#
# A sample estimates the population it is DRAWN FROM. The processed table is
# not the population the audit is reporting on; it is what survived ingestion,
# and ingestion drops what it cannot parse.
#
# The records that failed are the ones the question is about, and they were
# removed before the sampling frame existed.

240000 => submitted
800 => rejected_per_myriad
500 => sample_size
20 => defects_per_myriad_in_sample

int(submitted * rejected_per_myriad / 10000) => rejected_at_ingest
submitted - rejected_at_ingest => reached_the_table

"records submitted        : " + str(submitted) ^0
"rejected at ingestion    : " + str(rejected_at_ingest) ^0
"reached the table        : " + str(reached_the_table) ^0
"sample drawn from        : the table" ^0
"sample size              : " + str(sample_size) ^0
"" ^0

# ---- the audit's finding ----

"what the audit reports" ^0
"  defect rate in the sample : " + str(defects_per_myriad_in_sample) + " per ten thousand" ^0
"  drawn uniformly           : yes" ^0
"  chosen by a person        : no" ^0
"  replacement               : none" ^0
"  the estimate is unbiased for the table" ^0
"" ^0

# ---- what the table is ----

int(defects_per_myriad_in_sample * reached_the_table / 10000) => defects_in_table

"the frame the estimate describes" ^0
"  records in the table      : " + str(reached_the_table) ^0
"  estimated defects there   : " + str(defects_in_table) ^0
"  records NOT in the table  : " + str(rejected_at_ingest) ^0
"  defects among those       : " + str(rejected_at_ingest) + ", by definition" ^0
"" ^0
"  a record is in the second group BECAUSE it was malformed," ^0
"  so that group's defect rate is not estimated, it is known," ^0
"  and it is total" ^0
"" ^0

# ---- the rate over what was submitted ----

defects_in_table + rejected_at_ingest => defects_over_submitted
int(defects_over_submitted * 10000 / submitted) => true_rate_per_myriad

"defect rate, two frames" ^0
"  over the table     : " + str(defects_per_myriad_in_sample) + " per ten thousand" ^0
"  over what was sent : " + str(true_rate_per_myriad) + " per ten thousand" ^0
"  ratio              : " + str(int(true_rate_per_myriad / defects_per_myriad_in_sample)) + " times" ^0
"" ^0
"  both numbers are correct about their own denominator" ^0
"  the report names neither denominator" ^0
"" ^0

# ---- where the filter sits ----

"the pipeline, in order" ^0
"  1  records are submitted            " + str(submitted) ^0
"  2  ingestion parses and drops       " + str(rejected_at_ingest) + " removed" ^0
"  3  the table receives               " + str(reached_the_table) ^0
"  4  the audit samples                " + str(sample_size) + " from step 3" ^0
"" ^0
"  the audit is asking about step 1 and drawing from step 3" ^0
"  and steps 1 and 3 differ by exactly the records that failed" ^0
"" ^0

# ---- what a larger sample would do ----
#
# The obvious response to a surprising rate is more data. Every extra record
# comes from the same table.

5000 => bigger_sample

"a sample ten times larger" ^0
"  sample size           : " + str(bigger_sample) ^0
"  drawn from            : the table, still" ^0
"  interval width        : narrower" ^0
"  estimate              : " + str(defects_per_myriad_in_sample) + " per ten thousand, more precisely" ^0
"  rejected records included : 0" ^0
"" ^0
"  precision improves and the frame does not move" ^0
"" ^0

# ---- the control ----
#
# The sampling method, on its own terms. It is unbiased within its frame and it
# is the reason the number is trusted at all.

"control - is the sampling correct" ^0
"  selection bias within the table : none" ^0
"  sample size adequate            : yes, for the stated interval" ^0
"  records excluded by the sampler : 0" ^0
"  defects in the method           : 0" ^0
"" ^0
"  nothing about the draw needs fixing; what needs stating is" ^0
"  the sentence 'of the records that reached the table'" ^0
"" ^0

# ---- the null control ----
#
# The same method, same size, same auditor, drawing from the submission log
# instead of the table. The technique did not change; the frame became the one
# the question was about.

"null control - the same sample drawn from the submission log" ^0
"  frame              : " + str(submitted) + " submitted records" ^0
"  sample size        : " + str(sample_size) + ", unchanged" ^0
"  method             : unchanged" ^0
"  estimated rate     : " + str(true_rate_per_myriad) + " per ten thousand" ^0
"  the sampler did not improve; it was pointed at the population" ^0
"  the report was already describing" ^0
"" ^0

# ---- the rule ----

"what a sample is evidence about" ^0
"  the frame it was drawn from : exactly, and with an interval" ^0
"  the population upstream of a filter : nothing at all" ^0
"  and a filter that removes failures makes the two differ by" ^0
"  precisely the thing being measured" ^0
"" ^0
"the question to ask of any rate is not how many were sampled," ^0
"it is what had to happen to a record for it to be eligible" ^0
"" ^0

"The draw is uniform, unbiased and adequately sized, and " + str(defects_per_myriad_in_sample) + " per ten thousand is" ^0
"a correct estimate for the " + str(reached_the_table) + " records in the table. Ingestion dropped " + str(rejected_at_ingest) ^0
"records for being malformed, which is the defect the audit exists to count, so" ^0
"over the " + str(submitted) + " actually submitted the rate is " + str(true_rate_per_myriad) + " per ten thousand - " + str(int(true_rate_per_myriad / defects_per_myriad_in_sample)) + " times" ^0
"the reported one - and a larger sample moves the interval, not the frame." ^0
```

## Python (deterministic transpilation)

```python
submitted = 240000
rejected_per_myriad = 800
sample_size = 500
defects_per_myriad_in_sample = 20
rejected_at_ingest = int(submitted * rejected_per_myriad / 10000)
reached_the_table = submitted - rejected_at_ingest
print("records submitted        : " + str(submitted))
print("rejected at ingestion    : " + str(rejected_at_ingest))
print("reached the table        : " + str(reached_the_table))
print("sample drawn from        : the table")
print("sample size              : " + str(sample_size))
print("")
print("what the audit reports")
print("  defect rate in the sample : " + str(defects_per_myriad_in_sample) + " per ten thousand")
print("  drawn uniformly           : yes")
print("  chosen by a person        : no")
print("  replacement               : none")
print("  the estimate is unbiased for the table")
print("")
defects_in_table = int(defects_per_myriad_in_sample * reached_the_table / 10000)
print("the frame the estimate describes")
print("  records in the table      : " + str(reached_the_table))
print("  estimated defects there   : " + str(defects_in_table))
print("  records NOT in the table  : " + str(rejected_at_ingest))
print("  defects among those       : " + str(rejected_at_ingest) + ", by definition")
print("")
print("  a record is in the second group BECAUSE it was malformed,")
print("  so that group's defect rate is not estimated, it is known,")
print("  and it is total")
print("")
defects_over_submitted = defects_in_table + rejected_at_ingest
true_rate_per_myriad = int(defects_over_submitted * 10000 / submitted)
print("defect rate, two frames")
print("  over the table     : " + str(defects_per_myriad_in_sample) + " per ten thousand")
print("  over what was sent : " + str(true_rate_per_myriad) + " per ten thousand")
print("  ratio              : " + str(int(true_rate_per_myriad / defects_per_myriad_in_sample)) + " times")
print("")
print("  both numbers are correct about their own denominator")
print("  the report names neither denominator")
print("")
print("the pipeline, in order")
print("  1  records are submitted            " + str(submitted))
print("  2  ingestion parses and drops       " + str(rejected_at_ingest) + " removed")
print("  3  the table receives               " + str(reached_the_table))
print("  4  the audit samples                " + str(sample_size) + " from step 3")
print("")
print("  the audit is asking about step 1 and drawing from step 3")
print("  and steps 1 and 3 differ by exactly the records that failed")
print("")
bigger_sample = 5000
print("a sample ten times larger")
print("  sample size           : " + str(bigger_sample))
print("  drawn from            : the table, still")
print("  interval width        : narrower")
print("  estimate              : " + str(defects_per_myriad_in_sample) + " per ten thousand, more precisely")
print("  rejected records included : 0")
print("")
print("  precision improves and the frame does not move")
print("")
print("control - is the sampling correct")
print("  selection bias within the table : none")
print("  sample size adequate            : yes, for the stated interval")
print("  records excluded by the sampler : 0")
print("  defects in the method           : 0")
print("")
print("  nothing about the draw needs fixing; what needs stating is")
print("  the sentence 'of the records that reached the table'")
print("")
print("null control - the same sample drawn from the submission log")
print("  frame              : " + str(submitted) + " submitted records")
print("  sample size        : " + str(sample_size) + ", unchanged")
print("  method             : unchanged")
print("  estimated rate     : " + str(true_rate_per_myriad) + " per ten thousand")
print("  the sampler did not improve; it was pointed at the population")
print("  the report was already describing")
print("")
print("what a sample is evidence about")
print("  the frame it was drawn from : exactly, and with an interval")
print("  the population upstream of a filter : nothing at all")
print("  and a filter that removes failures makes the two differ by")
print("  precisely the thing being measured")
print("")
print("the question to ask of any rate is not how many were sampled,")
print("it is what had to happen to a record for it to be eligible")
print("")
print("The draw is uniform, unbiased and adequately sized, and " + str(defects_per_myriad_in_sample) + " per ten thousand is")
print("a correct estimate for the " + str(reached_the_table) + " records in the table. Ingestion dropped " + str(rejected_at_ingest))
print("records for being malformed, which is the defect the audit exists to count, so")
print("over the " + str(submitted) + " actually submitted the rate is " + str(true_rate_per_myriad) + " per ten thousand - " + str(int(true_rate_per_myriad / defects_per_myriad_in_sample)) + " times")
print("the reported one - and a larger sample moves the interval, not the frame.")
```

## stdout (executed)

```text
records submitted        : 240000
rejected at ingestion    : 19200
reached the table        : 220800
sample drawn from        : the table
sample size              : 500

what the audit reports
  defect rate in the sample : 20 per ten thousand
  drawn uniformly           : yes
  chosen by a person        : no
  replacement               : none
  the estimate is unbiased for the table

the frame the estimate describes
  records in the table      : 220800
  estimated defects there   : 441
  records NOT in the table  : 19200
  defects among those       : 19200, by definition

  a record is in the second group BECAUSE it was malformed,
  so that group's defect rate is not estimated, it is known,
  and it is total

defect rate, two frames
  over the table     : 20 per ten thousand
  over what was sent : 818 per ten thousand
  ratio              : 40 times

  both numbers are correct about their own denominator
  the report names neither denominator

the pipeline, in order
  1  records are submitted            240000
  2  ingestion parses and drops       19200 removed
  3  the table receives               220800
  4  the audit samples                500 from step 3

  the audit is asking about step 1 and drawing from step 3
  and steps 1 and 3 differ by exactly the records that failed

a sample ten times larger
  sample size           : 5000
  drawn from            : the table, still
  interval width        : narrower
  estimate              : 20 per ten thousand, more precisely
  rejected records included : 0

  precision improves and the frame does not move

control - is the sampling correct
  selection bias within the table : none
  sample size adequate            : yes, for the stated interval
  records excluded by the sampler : 0
  defects in the method           : 0

  nothing about the draw needs fixing; what needs stating is
  the sentence 'of the records that reached the table'

null control - the same sample drawn from the submission log
  frame              : 240000 submitted records
  sample size        : 500, unchanged
  method             : unchanged
  estimated rate     : 818 per ten thousand
  the sampler did not improve; it was pointed at the population
  the report was already describing

what a sample is evidence about
  the frame it was drawn from : exactly, and with an interval
  the population upstream of a filter : nothing at all
  and a filter that removes failures makes the two differ by
  precisely the thing being measured

the question to ask of any rate is not how many were sampled,
it is what had to happen to a record for it to be eligible

The draw is uniform, unbiased and adequately sized, and 20 per ten thousand is
a correct estimate for the 220800 records in the table. Ingestion dropped 19200
records for being malformed, which is the defect the audit exists to count, so
over the 240000 actually submitted the rate is 818 per ten thousand - 40 times
the reported one - and a larger sample moves the interval, not the frame.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
