<!-- canonical: efficientnewlanguage.org/ai/examples/548-the-load-test-used-the-shape-production-never-has | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 548 — The load test used the shape production never has

`the_load_test_used_the_shape_production_never_has.eml` - The load test sends 8000 requests spread evenly over 8 shards. Production sends 8000 requests too. Which numbers the two runs agree on is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The load test
# sends 8000 requests spread evenly over 8 shards. Production sends 8000
# requests too. Which numbers the two runs agree on is computed below.
#
# An even spread is the right default for a load test and was chosen on
# purpose. It is reproducible, it needs no production data and so raises no
# privacy question, it isolates throughput from every other variable, and it
# gives a number that can be compared against last quarter's number. A test
# that replays real traffic is a test whose result changes when the traffic
# changes, which makes a regression and a customer indistinguishable.
#
# The shape does not affect a sum. Total requests, total bytes, total CPU
# seconds are the same whichever shard each request lands on, so every
# aggregate the test reports is exactly right. Saturation is not a sum. A
# system fails at its busiest component, and an even spread is precisely the
# arrangement that minimises the maximum while holding the total fixed.
#
# So the test is correct about every quantity it reports and silent about the
# one that decides whether the service stays up.

8000 => requests
8 => shards
1500 => shard_capacity

# [shard, share of traffic in production, percent]
[["s0", 40], ["s1", 20], ["s2", 13], ["s3", 10], ["s4", 7], ["s5", 5], ["s6", 3], ["s7", 2]] => prod_shape

int(requests / shards) => flat_per_shard

"requests: " + str(requests) + " over " + str(shards) + " shards, capacity " + str(shard_capacity) + " each" ^0
"" ^0

# ---- what each run puts on each shard ----

"shard   load test   production   capacity" ^0
0 => flat_over
0 => prod_over
0 => flat_total
0 => prod_total
0 => prod_max
for s in prod_shape:
    int(requests * s[1] / 100) => prod_load
    flat_total + flat_per_shard => flat_total
    prod_total + prod_load => prod_total
    if prod_load > prod_max:
        prod_load => prod_max
    if flat_per_shard > shard_capacity:
        flat_over + 1 => flat_over
    if prod_load > shard_capacity:
        prod_over + 1 => prod_over
    "  " + s[0] + "       " + str(flat_per_shard) + "        " + str(prod_load) + "         " + str(shard_capacity) ^0
"" ^0

"totals" ^0
"  load test total : " + str(flat_total) ^0
"  production total: " + str(prod_total) ^0
"  difference      : " + str(prod_total - flat_total) ^0
"" ^0

"maxima" ^0
"  load test busiest shard : " + str(flat_per_shard) ^0
"  production busiest shard: " + str(prod_max) ^0
"  ratio                   : " + str(int(prod_max * 10 / flat_per_shard)) + " tenths" ^0
"  shards over capacity, load test : " + str(flat_over) ^0
"  shards over capacity, production: " + str(prod_over) ^0
"  the run that reported zero saturated shards was arithmetically correct" ^0
"" ^0

# ---- the same shape, read as a cache ----
#
# Key popularity in buckets: what fraction of the key space, and what
# fraction of the traffic it receives. The cache holds 10 percent of keys.

100000 => key_space
10000 => cache_entries
int(cache_entries * 100 / key_space) => cache_pct

# [bucket, percent of key space, percent of production traffic]
[["hottest", 1, 52], ["warm", 9, 26], ["tail", 90, 22]] => buckets

"cache holds " + str(cache_entries) + " of " + str(key_space) + " keys, which is " + str(cache_pct) + " percent" ^0
"" ^0
"bucket     keyspace pct   production traffic pct   even-spread traffic pct" ^0
0 => cum_keys
0 => prod_hits
0 => flat_hits
for b in buckets:
    cum_keys + b[1] => cum_keys
    if cum_keys <= cache_pct:
        prod_hits + b[2] => prod_hits
        flat_hits + b[1] => flat_hits
    "  " + b[0] + "     " + str(b[1]) + "              " + str(b[2]) + "                       " + str(b[1]) ^0
"" ^0
"  hit rate, production shape : " + str(prod_hits) + " percent" ^0
"  hit rate, even spread      : " + str(flat_hits) + " percent" ^0
"  the even spread understates the cache by " + str(prod_hits - flat_hits) + " points" ^0
"" ^0

"so the one wrong shape moves two numbers in opposite directions" ^0
"  headroom : overstated, the busiest shard is " + str(prod_max - flat_per_shard) + " requests higher than tested" ^0
"  cache    : understated, the real hit rate is " + str(prod_hits - flat_hits) + " points better than tested" ^0
"  neither error is conservative, and they do not cancel, because they" ^0
"  land on different decisions: one sizes the fleet, the other sizes the cache" ^0
"" ^0

# ---- the rule ----

"which quantities an even spread gets right" ^0
"  a sum        : exact, the shape cannot move a total" ^0
"  a mean       : exact, it is a sum divided by a constant" ^0
"  a maximum    : wrong, and wrong in the optimistic direction by construction" ^0
"  a distinct count : wrong, an even spread touches the most keys possible" ^0
"  a percentile : wrong, it is a statement about a shape" ^0
"  the report contained four sums, two means and no maxima" ^0
"" ^0

# ---- the control ----
#
# Bytes transferred is a sum. If the load test were simply broken, this would
# disagree too. It does not, under either shape, which is what makes the run
# look trustworthy.

512 => bytes_per_request
"control - a quantity that is a sum" ^0
"  bytes, load test  : " + str(flat_total * bytes_per_request) ^0
"  bytes, production : " + str(prod_total * bytes_per_request) ^0
"  difference        : " + str((prod_total - flat_total) * bytes_per_request) ^0
"  the test is not broken and was never broken" ^0
"  it is exactly right about everything that adds up" ^0
"" ^0

"An even spread is reproducible, needs no production data and isolates" ^0
"throughput, which is why it was chosen. Holding the total fixed, it is also" ^0
"the arrangement that minimises the maximum: " + str(flat_over) + " shards over capacity in the" ^0
"test and " + str(prod_over) + " in production, from the same " + str(requests) + " requests." ^0
```

## Python (deterministic transpilation)

```python
requests = 8000
shards = 8
shard_capacity = 1500
prod_shape = [["s0", 40], ["s1", 20], ["s2", 13], ["s3", 10], ["s4", 7], ["s5", 5], ["s6", 3], ["s7", 2]]
flat_per_shard = int(requests / shards)
print("requests: " + str(requests) + " over " + str(shards) + " shards, capacity " + str(shard_capacity) + " each")
print("")
print("shard   load test   production   capacity")
flat_over = 0
prod_over = 0
flat_total = 0
prod_total = 0
prod_max = 0
for s in prod_shape:
    prod_load = int(requests * s[1] / 100)
    flat_total = flat_total + flat_per_shard
    prod_total = prod_total + prod_load
    if prod_load > prod_max:
        prod_max = prod_load
    if flat_per_shard > shard_capacity:
        flat_over = flat_over + 1
    if prod_load > shard_capacity:
        prod_over = prod_over + 1
    print("  " + s[0] + "       " + str(flat_per_shard) + "        " + str(prod_load) + "         " + str(shard_capacity))
print("")
print("totals")
print("  load test total : " + str(flat_total))
print("  production total: " + str(prod_total))
print("  difference      : " + str(prod_total - flat_total))
print("")
print("maxima")
print("  load test busiest shard : " + str(flat_per_shard))
print("  production busiest shard: " + str(prod_max))
print("  ratio                   : " + str(int(prod_max * 10 / flat_per_shard)) + " tenths")
print("  shards over capacity, load test : " + str(flat_over))
print("  shards over capacity, production: " + str(prod_over))
print("  the run that reported zero saturated shards was arithmetically correct")
print("")
key_space = 100000
cache_entries = 10000
cache_pct = int(cache_entries * 100 / key_space)
buckets = [["hottest", 1, 52], ["warm", 9, 26], ["tail", 90, 22]]
print("cache holds " + str(cache_entries) + " of " + str(key_space) + " keys, which is " + str(cache_pct) + " percent")
print("")
print("bucket     keyspace pct   production traffic pct   even-spread traffic pct")
cum_keys = 0
prod_hits = 0
flat_hits = 0
for b in buckets:
    cum_keys = cum_keys + b[1]
    if cum_keys <= cache_pct:
        prod_hits = prod_hits + b[2]
        flat_hits = flat_hits + b[1]
    print("  " + b[0] + "     " + str(b[1]) + "              " + str(b[2]) + "                       " + str(b[1]))
print("")
print("  hit rate, production shape : " + str(prod_hits) + " percent")
print("  hit rate, even spread      : " + str(flat_hits) + " percent")
print("  the even spread understates the cache by " + str(prod_hits - flat_hits) + " points")
print("")
print("so the one wrong shape moves two numbers in opposite directions")
print("  headroom : overstated, the busiest shard is " + str(prod_max - flat_per_shard) + " requests higher than tested")
print("  cache    : understated, the real hit rate is " + str(prod_hits - flat_hits) + " points better than tested")
print("  neither error is conservative, and they do not cancel, because they")
print("  land on different decisions: one sizes the fleet, the other sizes the cache")
print("")
print("which quantities an even spread gets right")
print("  a sum        : exact, the shape cannot move a total")
print("  a mean       : exact, it is a sum divided by a constant")
print("  a maximum    : wrong, and wrong in the optimistic direction by construction")
print("  a distinct count : wrong, an even spread touches the most keys possible")
print("  a percentile : wrong, it is a statement about a shape")
print("  the report contained four sums, two means and no maxima")
print("")
bytes_per_request = 512
print("control - a quantity that is a sum")
print("  bytes, load test  : " + str(flat_total * bytes_per_request))
print("  bytes, production : " + str(prod_total * bytes_per_request))
print("  difference        : " + str((prod_total - flat_total) * bytes_per_request))
print("  the test is not broken and was never broken")
print("  it is exactly right about everything that adds up")
print("")
print("An even spread is reproducible, needs no production data and isolates")
print("throughput, which is why it was chosen. Holding the total fixed, it is also")
print("the arrangement that minimises the maximum: " + str(flat_over) + " shards over capacity in the")
print("test and " + str(prod_over) + " in production, from the same " + str(requests) + " requests.")
```

## stdout (executed)

```text
requests: 8000 over 8 shards, capacity 1500 each

shard   load test   production   capacity
  s0       1000        3200         1500
  s1       1000        1600         1500
  s2       1000        1040         1500
  s3       1000        800         1500
  s4       1000        560         1500
  s5       1000        400         1500
  s6       1000        240         1500
  s7       1000        160         1500

totals
  load test total : 8000
  production total: 8000
  difference      : 0

maxima
  load test busiest shard : 1000
  production busiest shard: 3200
  ratio                   : 32 tenths
  shards over capacity, load test : 0
  shards over capacity, production: 2
  the run that reported zero saturated shards was arithmetically correct

cache holds 10000 of 100000 keys, which is 10 percent

bucket     keyspace pct   production traffic pct   even-spread traffic pct
  hottest     1              52                       1
  warm     9              26                       9
  tail     90              22                       90

  hit rate, production shape : 78 percent
  hit rate, even spread      : 10 percent
  the even spread understates the cache by 68 points

so the one wrong shape moves two numbers in opposite directions
  headroom : overstated, the busiest shard is 2200 requests higher than tested
  cache    : understated, the real hit rate is 68 points better than tested
  neither error is conservative, and they do not cancel, because they
  land on different decisions: one sizes the fleet, the other sizes the cache

which quantities an even spread gets right
  a sum        : exact, the shape cannot move a total
  a mean       : exact, it is a sum divided by a constant
  a maximum    : wrong, and wrong in the optimistic direction by construction
  a distinct count : wrong, an even spread touches the most keys possible
  a percentile : wrong, it is a statement about a shape
  the report contained four sums, two means and no maxima

control - a quantity that is a sum
  bytes, load test  : 4096000
  bytes, production : 4096000
  difference        : 0
  the test is not broken and was never broken
  it is exactly right about everything that adds up

An even spread is reproducible, needs no production data and isolates
throughput, which is why it was chosen. Holding the total fixed, it is also
the arrangement that minimises the maximum: 0 shards over capacity in the
test and 2 in production, from the same 8000 requests.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
