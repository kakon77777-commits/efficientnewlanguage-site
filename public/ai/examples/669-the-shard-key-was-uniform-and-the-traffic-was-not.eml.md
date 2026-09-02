<!-- canonical: efficientnewlanguage.org/ai/examples/669-the-shard-key-was-uniform-and-the-traffic-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 669 — The shard key was uniform and the traffic was not

`the_shard_key_was_uniform_and_the_traffic_was_not.eml` - The shard key distributes forty million keys across sixty-four shards to within three parts in a thousand. What one shard serves is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The shard key
# distributes forty million keys across sixty-four shards to within three parts
# in a thousand. What one shard serves is computed below.
#
# The distribution test is real and it passes. Forty million keys were hashed,
# every shard's share was measured, and the largest deviation from even is three
# parts in a thousand. The hash was chosen after an earlier key produced a
# forty-percent imbalance, and the test exists because of that incident.
#
# Uniformity of KEYS is not uniformity of REQUESTS. Each key carries its own
# traffic, that traffic is heavy-tailed in every system that has customers of
# different sizes, and the placement function has no input for it.
#
# One key takes thirty-one percent of all requests.

40000000 => keys
64 => shards
30 => largest_key_deviation_per_myriad
180000 => requests_per_second
3100 => hottest_key_share_per_myriad

int(keys / shards) => keys_per_shard
int(requests_per_second / shards) => even_requests_per_shard
int(requests_per_second * hottest_key_share_per_myriad / 10000) => hottest_key_requests
requests_per_second - hottest_key_requests => remaining_requests
hottest_key_requests + int(remaining_requests / shards) => hot_shard_requests
int(hot_shard_requests / even_requests_per_shard) => hot_shard_times_even

"keys                        : " + str(keys) ^0
"shards                      : " + str(shards) ^0
"keys per shard              : " + str(keys_per_shard) ^0
"largest key deviation       : " + str(largest_key_deviation_per_myriad) + " per ten thousand" ^0
"" ^0
"requests per second         : " + str(requests_per_second) ^0
"an even shard would serve   : " + str(even_requests_per_shard) ^0
"the hottest key alone takes : " + str(hottest_key_requests) ^0
"the shard holding it serves : " + str(hot_shard_requests) ^0
"which is the even share times: " + str(hot_shard_times_even) ^0
"" ^0

# ---- what the distribution test verified ----

"the key distribution test" ^0
"  keys hashed          : " + str(keys) ^0
"  shards               : " + str(shards) ^0
"  largest deviation    : " + str(largest_key_deviation_per_myriad) + " per ten thousand" ^0
"  written after        : an earlier key with a 40 percent" ^0
"    imbalance" ^0
"  verdict              : UNIFORM" ^0
"" ^0
"  the test is not theatre; it caught a real problem once" ^0
"  and it would catch it again" ^0
"" ^0

# ---- what it counted ----

"the two populations" ^0
"  keys           : " + str(keys) + ", measured, uniform" ^0
"  requests       : " + str(requests_per_second) + " a second, not measured by this test" ^0
"  the placement function's inputs : the key" ^0
"  its inputs about traffic        : none" ^0
"" ^0
"  a hash cannot weight by a quantity it is not given, and" ^0
"  giving it one would make placement depend on load and" ^0
"  therefore move under it" ^0
"" ^0

# ---- the shape of the tail ----

# The hottest key is a single customer. Rebalancing moves it to another shard,
# which then becomes the hot one; splitting the key requires the application to
# have a second dimension to split on, and it does not.
"remedies, and what each does" ^0
"  rehash with a different seed : the hot key lands" ^0
"    somewhere else and that shard becomes hot" ^0
"  add shards                   : the even share falls," ^0
"    the hot key does not" ^0
"  split the key                : needs a second dimension" ^0
"    in the data, which is an application change" ^0
"" ^0

int(hottest_key_requests * 10000 / hot_shard_requests) => one_key_share_of_hot_shard
"the hot shard's load that is one key : " + str(one_key_share_of_hot_shard) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same hash and the same keys, with requests measured instead of keys.
int(hot_shard_requests * 10000 / even_requests_per_shard) => nc_measured_imbalance_per_myriad

"null control - measure the request distribution, not the key distribution" ^0
"  key deviation        : " + str(largest_key_deviation_per_myriad) + " per ten thousand, unchanged" ^0
"  request imbalance    : " + str(nc_measured_imbalance_per_myriad) + " per ten thousand of even" ^0
"  the sharding did not change; the test started counting" ^0
"  the quantity that arrives rather than the one that is" ^0
"  stored" ^0
"" ^0

# ---- the rule ----

"what a uniform shard key guarantees" ^0
"  keys are spread evenly     : exactly" ^0
"  load is spread evenly      : not addressed; load is a" ^0
"    property of each key and the hash is a function of" ^0
"    the key's name" ^0
"" ^0
"a distribution test measures what it enumerates; enumerate" ^0
"the keys and you learn about storage, enumerate the requests" ^0
"and you learn about the shard that falls over" ^0
"" ^0

"The key distribution is uniform to " + str(largest_key_deviation_per_myriad) + " parts in ten thousand across " + str(shards) ^0
"shards, measured over " + str(keys) + " keys by a test written after a real 40 percent" ^0
"imbalance. One key takes " + str(hottest_key_requests) + " of " + str(requests_per_second) + " requests a second, so its shard" ^0
"serves " + str(hot_shard_requests) + " against an even " + str(even_requests_per_shard) + " - " + str(hot_shard_times_even) + " times the share, " + str(one_key_share_of_hot_shard) ^0
"per ten thousand of it a single key - and the placement function was never told." ^0
```

## Python (deterministic transpilation)

```python
keys = 40000000
shards = 64
largest_key_deviation_per_myriad = 30
requests_per_second = 180000
hottest_key_share_per_myriad = 3100
keys_per_shard = int(keys / shards)
even_requests_per_shard = int(requests_per_second / shards)
hottest_key_requests = int(requests_per_second * hottest_key_share_per_myriad / 10000)
remaining_requests = requests_per_second - hottest_key_requests
hot_shard_requests = hottest_key_requests + int(remaining_requests / shards)
hot_shard_times_even = int(hot_shard_requests / even_requests_per_shard)
print("keys                        : " + str(keys))
print("shards                      : " + str(shards))
print("keys per shard              : " + str(keys_per_shard))
print("largest key deviation       : " + str(largest_key_deviation_per_myriad) + " per ten thousand")
print("")
print("requests per second         : " + str(requests_per_second))
print("an even shard would serve   : " + str(even_requests_per_shard))
print("the hottest key alone takes : " + str(hottest_key_requests))
print("the shard holding it serves : " + str(hot_shard_requests))
print("which is the even share times: " + str(hot_shard_times_even))
print("")
print("the key distribution test")
print("  keys hashed          : " + str(keys))
print("  shards               : " + str(shards))
print("  largest deviation    : " + str(largest_key_deviation_per_myriad) + " per ten thousand")
print("  written after        : an earlier key with a 40 percent")
print("    imbalance")
print("  verdict              : UNIFORM")
print("")
print("  the test is not theatre; it caught a real problem once")
print("  and it would catch it again")
print("")
print("the two populations")
print("  keys           : " + str(keys) + ", measured, uniform")
print("  requests       : " + str(requests_per_second) + " a second, not measured by this test")
print("  the placement function's inputs : the key")
print("  its inputs about traffic        : none")
print("")
print("  a hash cannot weight by a quantity it is not given, and")
print("  giving it one would make placement depend on load and")
print("  therefore move under it")
print("")
print("remedies, and what each does")
print("  rehash with a different seed : the hot key lands")
print("    somewhere else and that shard becomes hot")
print("  add shards                   : the even share falls,")
print("    the hot key does not")
print("  split the key                : needs a second dimension")
print("    in the data, which is an application change")
print("")
one_key_share_of_hot_shard = int(hottest_key_requests * 10000 / hot_shard_requests)
print("the hot shard's load that is one key : " + str(one_key_share_of_hot_shard) + " per ten thousand")
print("")
nc_measured_imbalance_per_myriad = int(hot_shard_requests * 10000 / even_requests_per_shard)
print("null control - measure the request distribution, not the key distribution")
print("  key deviation        : " + str(largest_key_deviation_per_myriad) + " per ten thousand, unchanged")
print("  request imbalance    : " + str(nc_measured_imbalance_per_myriad) + " per ten thousand of even")
print("  the sharding did not change; the test started counting")
print("  the quantity that arrives rather than the one that is")
print("  stored")
print("")
print("what a uniform shard key guarantees")
print("  keys are spread evenly     : exactly")
print("  load is spread evenly      : not addressed; load is a")
print("    property of each key and the hash is a function of")
print("    the key's name")
print("")
print("a distribution test measures what it enumerates; enumerate")
print("the keys and you learn about storage, enumerate the requests")
print("and you learn about the shard that falls over")
print("")
print("The key distribution is uniform to " + str(largest_key_deviation_per_myriad) + " parts in ten thousand across " + str(shards))
print("shards, measured over " + str(keys) + " keys by a test written after a real 40 percent")
print("imbalance. One key takes " + str(hottest_key_requests) + " of " + str(requests_per_second) + " requests a second, so its shard")
print("serves " + str(hot_shard_requests) + " against an even " + str(even_requests_per_shard) + " - " + str(hot_shard_times_even) + " times the share, " + str(one_key_share_of_hot_shard))
print("per ten thousand of it a single key - and the placement function was never told.")
```

## stdout (executed)

```text
keys                        : 40000000
shards                      : 64
keys per shard              : 625000
largest key deviation       : 30 per ten thousand

requests per second         : 180000
an even shard would serve   : 2812
the hottest key alone takes : 55800
the shard holding it serves : 57740
which is the even share times: 20

the key distribution test
  keys hashed          : 40000000
  shards               : 64
  largest deviation    : 30 per ten thousand
  written after        : an earlier key with a 40 percent
    imbalance
  verdict              : UNIFORM

  the test is not theatre; it caught a real problem once
  and it would catch it again

the two populations
  keys           : 40000000, measured, uniform
  requests       : 180000 a second, not measured by this test
  the placement function's inputs : the key
  its inputs about traffic        : none

  a hash cannot weight by a quantity it is not given, and
  giving it one would make placement depend on load and
  therefore move under it

remedies, and what each does
  rehash with a different seed : the hot key lands
    somewhere else and that shard becomes hot
  add shards                   : the even share falls,
    the hot key does not
  split the key                : needs a second dimension
    in the data, which is an application change

the hot shard's load that is one key : 9664 per ten thousand

null control - measure the request distribution, not the key distribution
  key deviation        : 30 per ten thousand, unchanged
  request imbalance    : 205334 per ten thousand of even
  the sharding did not change; the test started counting
  the quantity that arrives rather than the one that is
  stored

what a uniform shard key guarantees
  keys are spread evenly     : exactly
  load is spread evenly      : not addressed; load is a
    property of each key and the hash is a function of
    the key's name

a distribution test measures what it enumerates; enumerate
the keys and you learn about storage, enumerate the requests
and you learn about the shard that falls over

The key distribution is uniform to 30 parts in ten thousand across 64
shards, measured over 40000000 keys by a test written after a real 40 percent
imbalance. One key takes 55800 of 180000 requests a second, so its shard
serves 57740 against an even 2812 - 20 times the share, 9664
per ten thousand of it a single key - and the placement function was never told.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
