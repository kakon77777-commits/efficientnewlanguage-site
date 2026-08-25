<!-- canonical: efficientnewlanguage.org/ai/examples/545-the-hash-was-uniform-and-the-buckets-were-not | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 545 — The hash was uniform and the buckets were not

`the_hash_was_uniform_and_the_buckets_were_not.eml` - The hash was tested for uniformity and passed. The bucket occupancy in production is counted below, from the same hash.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The hash was
# tested for uniformity and passed. The bucket occupancy in production is
# counted below, from the same hash.
#
# Both decisions here are the standard ones. A power-of-two bucket count turns
# the modulo into a bit mask, which is one instruction instead of a division,
# and it is what every hash table in every standard library does. Testing the
# hash by feeding it random keys and checking that the buckets come out level
# is also right, and the test passes, and it would catch a genuinely bad hash.
#
# Uniformity is not a property of a hash function. It is a property of a hash
# function together with an input distribution, and the test supplies its own
# input. Random keys are the one distribution the allocator never produces.
#
# The order ids come from a legacy allocator that hands out blocks of eight, so
# every id is a multiple of eight apart from its neighbour. That input is
# perfectly uniform over its own domain - it is not skewed, no value is hotter
# than another, and no key repeats. It simply shares a factor with the bucket
# count, and a modulo cannot separate a value from a multiple of its divisor.

8 => stride
1000 => first_id
512 => id_count

# ids as the allocator produces them: first_id, first_id + 8, first_id + 16 ...
[first_id + stride * i for i in [0:511]] => ids

"ids            : " + str(len(ids)) + ", from " + str(ids[0]) + " to " + str(ids[len(ids) - 1]) ^0
"allocator step : " + str(stride) ^0
"distinct ids   : " + str(len(ids)) + ", no key repeats, no key is hotter than another" ^0
"" ^0

def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

def buckets_used(n):
    "|" => seen
    0 => used
    for k in ids:
        str(k % n) => slot
        if not ("|" + slot + "|" in seen):
            seen + slot + "|" => seen
            used + 1 => used
    return used

def busiest(n):
    0 => worst
    for b in [0:n - 1]:
        0 => here
        for k in ids:
            if k % n == b:
                here + 1 => here
        if here > worst:
            here => worst
    return worst

# ---- what each bucket count does with these keys ----

"buckets   gcd(step,buckets)   predicted used   counted used   busiest   even share" ^0
for n in [16, 32, 63, 64, 100, 101, 128]:
    gcd(stride, n) => g
    int(n / g) => predicted
    buckets_used(n) => counted
    busiest(n) => worst
    int(len(ids) / n) => fair
    ("  %-9s %-19s %-16s %-14s %-9s %s" % (str(n), str(g), str(predicted), str(counted), str(worst), str(fair)))^0
"" ^0

"  the predicted and the counted column are two different methods and agree" ^0
"  on every row: one divides by the common factor, the other bucket-counts" ^0
"  all " + str(len(ids)) + " keys" ^0
"" ^0

# ---- the deployed configuration ----

64 => deployed
gcd(stride, deployed) => g_dep
buckets_used(deployed) => used_dep
busiest(deployed) => worst_dep
int(len(ids) / deployed) => fair_dep

"the deployed configuration, " + str(deployed) + " buckets" ^0
("  buckets that receive a key      : %s of %s" % (str(used_dep), str(deployed)))^0
("  buckets that receive nothing    : %s" % str(deployed - used_dep))^0
("  keys in the busiest bucket      : %s" % str(worst_dep))^0
("  keys per bucket if spread even  : %s" % str(fair_dep))^0
("  the busiest bucket carries      : %sx its share" % str(int(worst_dep / fair_dep)))^0
"" ^0

# ---- the control ----
#
# The same hash, the same keys, the same code path. Only the bucket count
# changes, from a power of two to a prime, so that it shares no factor with
# the allocator's step.

101 => prime_buckets
"control - the same keys with " + str(prime_buckets) + " buckets" ^0
("  gcd(%s, %s) : %s" % (str(stride), str(prime_buckets), str(gcd(stride, prime_buckets))))^0
("  buckets used : %s of %s" % (str(buckets_used(prime_buckets)), str(prime_buckets)))^0
("  busiest      : %s against an even share of %s" % (str(busiest(prime_buckets)), str(int(len(ids) / prime_buckets))))^0
"  the hash function is not edited, so the hash function was not the fault" ^0
"" ^0

# ---- the control that the test ran ----
#
# Keys with a step of 1 stand in for the random keys the uniformity test uses.
# Against a step of 1, every bucket count shares no factor worth having.

"control - what the uniformity test measured" ^0
for s in [1, 3, 8]:
    gcd(s, deployed) => g2
    ("  step %-3s -> gcd %-3s -> %s of %s buckets used" % (str(s), str(g2), str(int(deployed / g2)), str(deployed)))^0
"  a step of 1 uses every bucket, which is what the test saw and reported" ^0
"  the test was correct about the input it was given" ^0
"" ^0

# ---- what would have caught it ----

"what each check can and cannot see" ^0
"  uniformity test with random keys : passes, and would fail a bad hash" ^0
"  uniformity test with real ids    : fails immediately, and was never run" ^0
"  a count of empty buckets in production : " + str(deployed - used_dep) + " of " + str(deployed) + ", no such metric" ^0
"  the bucket count was chosen for the mask, the step was chosen in 2014" ^0
"  and neither decision is wrong beside the other one on a page" ^0
"" ^0

"A power-of-two bucket count is a mask instead of a division and the hash" ^0
"passes a uniformity test on random keys. The allocator's step of " + str(stride) + " shares" ^0
"that factor: " + str(used_dep) + " of " + str(deployed) + " buckets hold every key, the busiest at " + str(int(worst_dep / fair_dep)) + "x its share," ^0
"and changing " + str(deployed) + " to " + str(prime_buckets) + " uses " + str(buckets_used(prime_buckets)) + " of them with the same hash." ^0
```

## Python (deterministic transpilation)

```python
stride = 8
first_id = 1000
id_count = 512
ids = [first_id + stride * i for i in range(0, 512)]
print("ids            : " + str(len(ids)) + ", from " + str(ids[0]) + " to " + str(ids[len(ids) - 1]))
print("allocator step : " + str(stride))
print("distinct ids   : " + str(len(ids)) + ", no key repeats, no key is hotter than another")
print("")

def gcd(a, b):
    if b == 0:
        return a
    return gcd(b, a % b)

def buckets_used(n):
    seen = "|"
    used = 0
    for k in ids:
        slot = str(k % n)
        if not "|" + slot + "|" in seen:
            seen = seen + slot + "|"
            used = used + 1
    return used

def busiest(n):
    worst = 0
    for b in range(0, n):
        here = 0
        for k in ids:
            if k % n == b:
                here = here + 1
        if here > worst:
            worst = here
    return worst

print("buckets   gcd(step,buckets)   predicted used   counted used   busiest   even share")
for n in [16, 32, 63, 64, 100, 101, 128]:
    g = gcd(stride, n)
    predicted = int(n / g)
    counted = buckets_used(n)
    worst = busiest(n)
    fair = int(len(ids) / n)
    print("  %-9s %-19s %-16s %-14s %-9s %s" % (str(n), str(g), str(predicted), str(counted), str(worst), str(fair)))
print("")
print("  the predicted and the counted column are two different methods and agree")
print("  on every row: one divides by the common factor, the other bucket-counts")
print("  all " + str(len(ids)) + " keys")
print("")
deployed = 64
g_dep = gcd(stride, deployed)
used_dep = buckets_used(deployed)
worst_dep = busiest(deployed)
fair_dep = int(len(ids) / deployed)
print("the deployed configuration, " + str(deployed) + " buckets")
print("  buckets that receive a key      : %s of %s" % (str(used_dep), str(deployed)))
print("  buckets that receive nothing    : %s" % str(deployed - used_dep))
print("  keys in the busiest bucket      : %s" % str(worst_dep))
print("  keys per bucket if spread even  : %s" % str(fair_dep))
print("  the busiest bucket carries      : %sx its share" % str(int(worst_dep / fair_dep)))
print("")
prime_buckets = 101
print("control - the same keys with " + str(prime_buckets) + " buckets")
print("  gcd(%s, %s) : %s" % (str(stride), str(prime_buckets), str(gcd(stride, prime_buckets))))
print("  buckets used : %s of %s" % (str(buckets_used(prime_buckets)), str(prime_buckets)))
print("  busiest      : %s against an even share of %s" % (str(busiest(prime_buckets)), str(int(len(ids) / prime_buckets))))
print("  the hash function is not edited, so the hash function was not the fault")
print("")
print("control - what the uniformity test measured")
for s in [1, 3, 8]:
    g2 = gcd(s, deployed)
    print("  step %-3s -> gcd %-3s -> %s of %s buckets used" % (str(s), str(g2), str(int(deployed / g2)), str(deployed)))
print("  a step of 1 uses every bucket, which is what the test saw and reported")
print("  the test was correct about the input it was given")
print("")
print("what each check can and cannot see")
print("  uniformity test with random keys : passes, and would fail a bad hash")
print("  uniformity test with real ids    : fails immediately, and was never run")
print("  a count of empty buckets in production : " + str(deployed - used_dep) + " of " + str(deployed) + ", no such metric")
print("  the bucket count was chosen for the mask, the step was chosen in 2014")
print("  and neither decision is wrong beside the other one on a page")
print("")
print("A power-of-two bucket count is a mask instead of a division and the hash")
print("passes a uniformity test on random keys. The allocator's step of " + str(stride) + " shares")
print("that factor: " + str(used_dep) + " of " + str(deployed) + " buckets hold every key, the busiest at " + str(int(worst_dep / fair_dep)) + "x its share,")
print("and changing " + str(deployed) + " to " + str(prime_buckets) + " uses " + str(buckets_used(prime_buckets)) + " of them with the same hash.")
```

## stdout (executed)

```text
ids            : 512, from 1000 to 5088
allocator step : 8
distinct ids   : 512, no key repeats, no key is hotter than another

buckets   gcd(step,buckets)   predicted used   counted used   busiest   even share
  16        8                   2                2              256       32
  32        8                   4                4              128       16
  63        1                   63               63             9         8
  64        8                   8                8              64        8
  100       4                   25               25             21        5
  101       1                   101              101            6         5
  128       8                   16               16             32        4

  the predicted and the counted column are two different methods and agree
  on every row: one divides by the common factor, the other bucket-counts
  all 512 keys

the deployed configuration, 64 buckets
  buckets that receive a key      : 8 of 64
  buckets that receive nothing    : 56
  keys in the busiest bucket      : 64
  keys per bucket if spread even  : 8
  the busiest bucket carries      : 8x its share

control - the same keys with 101 buckets
  gcd(8, 101) : 1
  buckets used : 101 of 101
  busiest      : 6 against an even share of 5
  the hash function is not edited, so the hash function was not the fault

control - what the uniformity test measured
  step 1   -> gcd 1   -> 64 of 64 buckets used
  step 3   -> gcd 1   -> 64 of 64 buckets used
  step 8   -> gcd 8   -> 8 of 64 buckets used
  a step of 1 uses every bucket, which is what the test saw and reported
  the test was correct about the input it was given

what each check can and cannot see
  uniformity test with random keys : passes, and would fail a bad hash
  uniformity test with real ids    : fails immediately, and was never run
  a count of empty buckets in production : 56 of 64, no such metric
  the bucket count was chosen for the mask, the step was chosen in 2014
  and neither decision is wrong beside the other one on a page

A power-of-two bucket count is a mask instead of a division and the hash
passes a uniformity test on random keys. The allocator's step of 8 shares
that factor: 8 of 64 buckets hold every key, the busiest at 8x its share,
and changing 64 to 101 uses 101 of them with the same hash.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:def · eml:call · eml:return · eml:run:done
