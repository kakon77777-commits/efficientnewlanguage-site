<!-- canonical: efficientnewlanguage.org/ai/examples/573-the-log-was-sampled-and-the-rare-event-was-the-point | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 573 — The log was sampled and the rare event was the point

`the_log_was_sampled_and_the_rare_event_was_the_point.eml` - Request logging was sampled at 1 percent to bring the bill down. What each class of event looks like afterwards is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Request logging
# was sampled at 1 percent to bring the bill down. What each class of event
# looks like afterwards is computed below.
#
# Sampling was the right call and it was done properly. The bill was real, the
# 1 percent was chosen so the error-rate estimate would still be accurate to
# three decimal places, and that claim was checked rather than assumed. The
# alternative on the table was cutting retention from 30 days to 3, which
# would have removed whole incidents instead of thinning them. Sampling keeps
# every day and thins every day equally, which is the fairer of the two.
#
# A uniform sample multiplies every count by the same factor. The counts are
# not uniform: routine events are hundreds of thousands a day and the ones
# worth investigating are a handful. Multiplying a handful by one hundredth
# does not thin it, it removes it.
#
# What a sample preserves is a RATE. What an investigation needs is an
# INSTANCE, and specifically several instances close enough together to
# compare. Those are different things and only the first survives division.

10000000 => requests_per_day
1 => sample_pct
3 => instances_needed_for_a_pattern

"requests per day : " + str(requests_per_day) ^0
"sampled at       : " + str(sample_pct) + " percent" ^0
"a pattern needs  : " + str(instances_needed_for_a_pattern) + " instances to compare" ^0
"" ^0

# [class, occurrences per day]
[["routine", 200000], ["common error", 2000], ["uncommon", 200], ["rare", 20], ["very rare", 2]] => classes

"class          per day   sampled/day   days to " + str(instances_needed_for_a_pattern) + " sampled instances" ^0
for c in classes:
    int(c[1] * sample_pct / 100) => sampled
    if sampled > 0:
        int(instances_needed_for_a_pattern / sampled) => days
        "  " + c[0] + "     " + str(c[1]) + "        " + str(sampled) + "            " + str(days) ^0
    else:
        int(instances_needed_for_a_pattern * 100 / (c[1] * sample_pct)) => days
        "  " + c[0] + "     " + str(c[1]) + "        under 1          " + str(days) ^0
"" ^0

"without sampling, the same column" ^0
for c in classes:
    if c[1] >= instances_needed_for_a_pattern:
        int(instances_needed_for_a_pattern * 24 / c[1]) => hours
        "  " + c[0] + "     " + str(c[1]) + " per day -> " + str(hours) + " hours" ^0
    else:
        "  " + c[0] + "     " + str(c[1]) + " per day -> " + str(int(instances_needed_for_a_pattern / c[1])) + " days" ^0
"" ^0

# ---- the cost is not uniform even though the sampling is ----

# Waits are computed in MINUTES, not hours. In hours the "rare" row truncates
# 3.6 to 3 and the ratio of two truncated integers reads 120x for a sampling
# rate that is exactly 100x. The unit has to be several units wide against the
# smallest real quantity or truncation eats the shape.
#
# The multiplier is also taken from the sampling rate itself rather than
# divided out of the two columns. It IS 100 over the sample percent, by
# construction; deriving it from the columns only reintroduces their rounding.

int(100 / sample_pct) => multiplier

"the sampling is uniform; what it costs is not" ^0
"class          unsampled wait   sampled wait     multiplier" ^0
for c in classes:
    int(instances_needed_for_a_pattern * 1440 / c[1]) => raw_min
    raw_min * multiplier => sampled_min
    "  " + c[0] + "     " + str(raw_min) + " min          " + str(sampled_min) + " min       " + str(multiplier) + "x" ^0
"" ^0
"  the multiplier is " + str(multiplier) + " in every row, because it is 100 over the sample percent" ^0
"  the consequence is nothing in the first rows and total in the last," ^0
"  because the rows differ by five orders of magnitude and the sample" ^0
"  does not" ^0
"" ^0

# ---- the control ----
#
# The reason the 1 percent was defensible: it estimates the error RATE almost
# exactly. That claim was checked before the change and it is still true. It
# is the right claim about the wrong quantity.

int(requests_per_day * sample_pct / 100) => sampled_requests
2000 => common_per_day
int(common_per_day * sample_pct / 100) => common_sampled

"control - the error rate, which sampling estimates correctly" ^0
"  true rate     : " + str(common_per_day) + " in " + str(requests_per_day) + " = " + str(int(common_per_day * 1000000 / requests_per_day)) + " per million" ^0
"  sampled rate  : " + str(common_sampled) + " in " + str(sampled_requests) + " = " + str(int(common_sampled * 1000000 / sampled_requests)) + " per million" ^0
"  difference    : " + str(int(common_per_day * 1000000 / requests_per_day) - int(common_sampled * 1000000 / sampled_requests)) + " per million" ^0
"  the estimate is exact, and it was exact for every class" ^0
"" ^0
"  a rate is a ratio and division does not disturb a ratio" ^0
"  an instance is a thing and division removes 99 of every 100 of them" ^0
"  the pre-change check measured the first" ^0
"" ^0

# ---- what a rate cannot answer ----

"questions the sampled log can and cannot answer" ^0
"  how often does this happen           yes, to three decimals" ^0
"  is it getting worse                  yes, the trend survives" ^0
"  which customers are affected         no, 99 of 100 are not in the sample" ^0
"  what did the failing requests share  no, that needs the instances" ^0
"  show me three to compare             no, for anything under 300 a day" ^0
"" ^0

# ---- the null control ----
#
# The same 1 percent, against a population where every class is common. Every
# row keeps enough instances to investigate, and the saving is free. The
# defect is not sampling; it is a uniform sample over counts that span five
# orders of magnitude.

[["a", 90000], ["b", 80000], ["c", 70000], ["d", 60000]] => flat_classes

"null control - the same 1 percent over classes of similar size" ^0
0 => flat_ok
0 => flat_rows
for f in flat_classes:
    int(f[1] * sample_pct / 100) => s
    flat_rows + 1 => flat_rows
    if s >= instances_needed_for_a_pattern:
        flat_ok + 1 => flat_ok
    "  class " + f[0] + ": " + str(f[1]) + " per day -> " + str(s) + " sampled" ^0
"  classes with enough sampled instances : " + str(flat_ok) + " of " + str(flat_rows) ^0
"  same sampling rate, same code, and it costs nothing here" ^0
"" ^0

# ---- what would have kept both ----

"keeping the bill and the instances at the same time" ^0
"  sample the routine class at 1 percent" ^0
"  keep everything that errored" ^0
"  errors are " + str(int((2000 + 200 + 20 + 2) * 1000000 / requests_per_day)) + " per million of traffic, so keeping all of them costs" ^0
"  " + str(int((2000 + 200 + 20 + 2) * 100 / requests_per_day)) + " percent of the unsampled bill" ^0
"  the saving was never coming from the rows worth keeping" ^0
"" ^0

"Sampling kept all 30 days instead of cutting retention to 3, and the 1 percent" ^0
"was chosen so the error-rate estimate stayed accurate - which it did, exactly." ^0
"A rate is a ratio and survives division. An investigation needs instances, and" ^0
"a class at 20 a day goes from " + str(int(instances_needed_for_a_pattern * 24 / 20)) + " hours to " + str(int(instances_needed_for_a_pattern * 100 / 20)) + " days. The multiplier was" ^0
"100 in every row, and the rows span five orders of magnitude." ^0
```

## Python (deterministic transpilation)

```python
requests_per_day = 10000000
sample_pct = 1
instances_needed_for_a_pattern = 3
print("requests per day : " + str(requests_per_day))
print("sampled at       : " + str(sample_pct) + " percent")
print("a pattern needs  : " + str(instances_needed_for_a_pattern) + " instances to compare")
print("")
classes = [["routine", 200000], ["common error", 2000], ["uncommon", 200], ["rare", 20], ["very rare", 2]]
print("class          per day   sampled/day   days to " + str(instances_needed_for_a_pattern) + " sampled instances")
for c in classes:
    sampled = int(c[1] * sample_pct / 100)
    if sampled > 0:
        days = int(instances_needed_for_a_pattern / sampled)
        print("  " + c[0] + "     " + str(c[1]) + "        " + str(sampled) + "            " + str(days))
    else:
        days = int(instances_needed_for_a_pattern * 100 / (c[1] * sample_pct))
        print("  " + c[0] + "     " + str(c[1]) + "        under 1          " + str(days))
print("")
print("without sampling, the same column")
for c in classes:
    if c[1] >= instances_needed_for_a_pattern:
        hours = int(instances_needed_for_a_pattern * 24 / c[1])
        print("  " + c[0] + "     " + str(c[1]) + " per day -> " + str(hours) + " hours")
    else:
        print("  " + c[0] + "     " + str(c[1]) + " per day -> " + str(int(instances_needed_for_a_pattern / c[1])) + " days")
print("")
multiplier = int(100 / sample_pct)
print("the sampling is uniform; what it costs is not")
print("class          unsampled wait   sampled wait     multiplier")
for c in classes:
    raw_min = int(instances_needed_for_a_pattern * 1440 / c[1])
    sampled_min = raw_min * multiplier
    print("  " + c[0] + "     " + str(raw_min) + " min          " + str(sampled_min) + " min       " + str(multiplier) + "x")
print("")
print("  the multiplier is " + str(multiplier) + " in every row, because it is 100 over the sample percent")
print("  the consequence is nothing in the first rows and total in the last,")
print("  because the rows differ by five orders of magnitude and the sample")
print("  does not")
print("")
sampled_requests = int(requests_per_day * sample_pct / 100)
common_per_day = 2000
common_sampled = int(common_per_day * sample_pct / 100)
print("control - the error rate, which sampling estimates correctly")
print("  true rate     : " + str(common_per_day) + " in " + str(requests_per_day) + " = " + str(int(common_per_day * 1000000 / requests_per_day)) + " per million")
print("  sampled rate  : " + str(common_sampled) + " in " + str(sampled_requests) + " = " + str(int(common_sampled * 1000000 / sampled_requests)) + " per million")
print("  difference    : " + str(int(common_per_day * 1000000 / requests_per_day) - int(common_sampled * 1000000 / sampled_requests)) + " per million")
print("  the estimate is exact, and it was exact for every class")
print("")
print("  a rate is a ratio and division does not disturb a ratio")
print("  an instance is a thing and division removes 99 of every 100 of them")
print("  the pre-change check measured the first")
print("")
print("questions the sampled log can and cannot answer")
print("  how often does this happen           yes, to three decimals")
print("  is it getting worse                  yes, the trend survives")
print("  which customers are affected         no, 99 of 100 are not in the sample")
print("  what did the failing requests share  no, that needs the instances")
print("  show me three to compare             no, for anything under 300 a day")
print("")
flat_classes = [["a", 90000], ["b", 80000], ["c", 70000], ["d", 60000]]
print("null control - the same 1 percent over classes of similar size")
flat_ok = 0
flat_rows = 0
for f in flat_classes:
    s = int(f[1] * sample_pct / 100)
    flat_rows = flat_rows + 1
    if s >= instances_needed_for_a_pattern:
        flat_ok = flat_ok + 1
    print("  class " + f[0] + ": " + str(f[1]) + " per day -> " + str(s) + " sampled")
print("  classes with enough sampled instances : " + str(flat_ok) + " of " + str(flat_rows))
print("  same sampling rate, same code, and it costs nothing here")
print("")
print("keeping the bill and the instances at the same time")
print("  sample the routine class at 1 percent")
print("  keep everything that errored")
print("  errors are " + str(int((2000 + 200 + 20 + 2) * 1000000 / requests_per_day)) + " per million of traffic, so keeping all of them costs")
print("  " + str(int((2000 + 200 + 20 + 2) * 100 / requests_per_day)) + " percent of the unsampled bill")
print("  the saving was never coming from the rows worth keeping")
print("")
print("Sampling kept all 30 days instead of cutting retention to 3, and the 1 percent")
print("was chosen so the error-rate estimate stayed accurate - which it did, exactly.")
print("A rate is a ratio and survives division. An investigation needs instances, and")
print("a class at 20 a day goes from " + str(int(instances_needed_for_a_pattern * 24 / 20)) + " hours to " + str(int(instances_needed_for_a_pattern * 100 / 20)) + " days. The multiplier was")
print("100 in every row, and the rows span five orders of magnitude.")
```

## stdout (executed)

```text
requests per day : 10000000
sampled at       : 1 percent
a pattern needs  : 3 instances to compare

class          per day   sampled/day   days to 3 sampled instances
  routine     200000        2000            0
  common error     2000        20            0
  uncommon     200        2            1
  rare     20        under 1          15
  very rare     2        under 1          150

without sampling, the same column
  routine     200000 per day -> 0 hours
  common error     2000 per day -> 0 hours
  uncommon     200 per day -> 0 hours
  rare     20 per day -> 3 hours
  very rare     2 per day -> 1 days

the sampling is uniform; what it costs is not
class          unsampled wait   sampled wait     multiplier
  routine     0 min          0 min       100x
  common error     2 min          200 min       100x
  uncommon     21 min          2100 min       100x
  rare     216 min          21600 min       100x
  very rare     2160 min          216000 min       100x

  the multiplier is 100 in every row, because it is 100 over the sample percent
  the consequence is nothing in the first rows and total in the last,
  because the rows differ by five orders of magnitude and the sample
  does not

control - the error rate, which sampling estimates correctly
  true rate     : 2000 in 10000000 = 200 per million
  sampled rate  : 20 in 100000 = 200 per million
  difference    : 0 per million
  the estimate is exact, and it was exact for every class

  a rate is a ratio and division does not disturb a ratio
  an instance is a thing and division removes 99 of every 100 of them
  the pre-change check measured the first

questions the sampled log can and cannot answer
  how often does this happen           yes, to three decimals
  is it getting worse                  yes, the trend survives
  which customers are affected         no, 99 of 100 are not in the sample
  what did the failing requests share  no, that needs the instances
  show me three to compare             no, for anything under 300 a day

null control - the same 1 percent over classes of similar size
  class a: 90000 per day -> 900 sampled
  class b: 80000 per day -> 800 sampled
  class c: 70000 per day -> 700 sampled
  class d: 60000 per day -> 600 sampled
  classes with enough sampled instances : 4 of 4
  same sampling rate, same code, and it costs nothing here

keeping the bill and the instances at the same time
  sample the routine class at 1 percent
  keep everything that errored
  errors are 222 per million of traffic, so keeping all of them costs
  0 percent of the unsampled bill
  the saving was never coming from the rows worth keeping

Sampling kept all 30 days instead of cutting retention to 3, and the 1 percent
was chosen so the error-rate estimate stayed accurate - which it did, exactly.
A rate is a ratio and survives division. An investigation needs instances, and
a class at 20 a day goes from 3 hours to 15 days. The multiplier was
100 in every row, and the rows span five orders of magnitude.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
