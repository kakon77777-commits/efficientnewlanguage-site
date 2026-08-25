<!-- canonical: efficientnewlanguage.org/ai/examples/551-three-copies-and-two-places-to-lose-them | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 551 — Three copies and two places to lose them

`three_copies_and_two_places_to_lose_them.eml` - Every shard has three replicas, verified continuously, never fewer. How many shards survive the loss of one rack is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every shard has
# three replicas, verified continuously, never fewer. How many shards survive
# the loss of one rack is computed below.
#
# The placement policy spreads replicas across nodes in proportion to how many
# nodes each rack has, and that is the right way to balance load. It is not an
# approximation either: it puts exactly the same number of replicas on every
# node in the fleet, which is the best result available, and the alternative
# below is measurably worse at it.
#
# The replication factor is also real. Three copies exist for every shard, the
# check that counts them runs continuously, and it has never once found a shard
# with two. Nobody is misreporting anything.
#
# Three copies is a proxy. What it stands in for is three chances to lose the
# data independently, and independence is a property of where the copies are,
# not of how many there are. The racks are not the same size, so a policy that
# treats nodes as interchangeable will put two copies in the largest rack most
# of the time, and the count stays three the whole way.

# [rack, nodes]
[["A", 12], ["B", 4], ["C", 4]] => racks
3 => replication_factor

0 => nodes
for r in racks:
    nodes + r[1] => nodes

def choose(n, k):
    if k < 0:
        return 0
    if k > n:
        return 0
    1 => r
    for i in [1:k]:
        int(r * (n - k + i) / i) => r
    return r

choose(nodes, replication_factor) => placements

("nodes : %s across %s racks" % (str(nodes), str(len(racks))))^0
("replication factor : %s" % str(replication_factor))^0
("distinct placements of one shard : %s" % str(placements))^0
"one shard per placement, so every count below is exact" ^0
"" ^0

# ---- how the replicas of a shard fall across each rack ----

"rack   nodes   shards with 0   with 1   with 2   with 3" ^0
for r in racks:
    ("  %-6s %-7s %-15s %-8s %-8s %s" % (r[0], str(r[1]), str(choose(r[1], 0) * choose(nodes - r[1], 3)), str(choose(r[1], 1) * choose(nodes - r[1], 2)), str(choose(r[1], 2) * choose(nodes - r[1], 1)), str(choose(r[1], 3) * choose(nodes - r[1], 0))))^0
"" ^0

# ---- what a rack failure costs ----

"if one rack is lost, node-proportional placement" ^0
"rack   shards below quorum   shards with no copy left   percent below quorum" ^0
for r in racks:
    choose(r[1], 2) * choose(nodes - r[1], 1) => two_here
    choose(r[1], 3) => three_here
    two_here + three_here => lost
    ("  %-6s %-21s %-26s %s" % (r[0], str(lost), str(three_here), str(int(lost * 100 / placements))))^0
"" ^0

racks[0] => big
choose(big[1], 2) * choose(nodes - big[1], 1) + choose(big[1], 3) => a_lost
("  losing rack %s takes %s of %s shards below quorum" % (big[0], str(a_lost), str(placements)))^0
("  and destroys %s of them outright" % str(choose(big[1], 3)))^0
"  no shard ever had fewer than three replicas at any point" ^0
"" ^0

# ---- the control ----
#
# One replica per rack. Three racks, three replicas, so it is available.

"control - one replica per rack" ^0
"rack   shards below quorum   shards with no copy left" ^0
for r in racks:
    ("  %-6s %-21s %s" % (r[0], "0", "0"))^0
"  every shard keeps two copies whichever rack is lost" ^0
"  the replication factor is three under both policies, unchanged" ^0
"" ^0

# ---- the control the check performs ----

"control - what the continuous check measures" ^0
("  shards with fewer than %s replicas, node-proportional : 0" % str(replication_factor))^0
("  shards with fewer than %s replicas, one per rack      : 0" % str(replication_factor))^0
"  the check is correct, it agrees with itself, and it cannot separate" ^0
"  the two policies because the quantity it counts is the same in both" ^0
"" ^0

# ---- what the current policy is buying ----

placements * replication_factor => replicas

"replicas per node, the reason the policy exists" ^0
"rack   nodes   node-proportional   one per rack" ^0
0 => flat
0 => skewed
for r in racks:
    int(replicas * r[1] / nodes / r[1]) => even_per_node
    int(placements / r[1]) => rack_per_node
    if even_per_node > flat:
        even_per_node => flat
    if rack_per_node > skewed:
        rack_per_node => skewed
    ("  %-6s %-7s %-19s %s" % (r[0], str(r[1]), str(even_per_node), str(rack_per_node)))^0
("  busiest node, node-proportional : %s" % str(flat))^0
("  busiest node, one per rack      : %s" % str(skewed))^0
("  one replica per rack loads the busiest node %s percent more heavily" % str(int((skewed - flat) * 100 / flat)))^0
"  so the policy in place is not a mistake, it is the other half of a" ^0
"  trade nobody wrote down as a trade" ^0
"" ^0

# ---- what a third rack of the right size would do ----

"the arrangement that has neither cost" ^0
("  racks of equal size : one replica per rack is also perfectly even" )^0
("  racks as they are   : %s nodes against %s and %s" % (str(racks[0][1]), str(racks[1][1]), str(racks[2][1])))^0
"  the imbalance in the rack sizes is what makes the two goals disagree" ^0
"  and the rack sizes were set by which cage had space in 2019" ^0
"" ^0

"Balancing by node count puts exactly the same number of replicas on every" ^0
("node, and one per rack would load the busiest node %s percent harder. Three" % str(int((skewed - flat) * 100 / flat)))^0
("copies is a proxy for three independent chances: losing rack %s takes %s of" % (big[0], str(a_lost)))^0
("%s shards below quorum, with the replica count at three throughout." % str(placements))^0
```

## Python (deterministic transpilation)

```python
racks = [["A", 12], ["B", 4], ["C", 4]]
replication_factor = 3
nodes = 0
for r in racks:
    nodes = nodes + r[1]

def choose(n, k):
    if k < 0:
        return 0
    if k > n:
        return 0
    r = 1
    for i in range(1, k+1):
        r = int(r * (n - k + i) / i)
    return r

placements = choose(nodes, replication_factor)
print("nodes : %s across %s racks" % (str(nodes), str(len(racks))))
print("replication factor : %s" % str(replication_factor))
print("distinct placements of one shard : %s" % str(placements))
print("one shard per placement, so every count below is exact")
print("")
print("rack   nodes   shards with 0   with 1   with 2   with 3")
for r in racks:
    print("  %-6s %-7s %-15s %-8s %-8s %s" % (r[0], str(r[1]), str(choose(r[1], 0) * choose(nodes - r[1], 3)), str(choose(r[1], 1) * choose(nodes - r[1], 2)), str(choose(r[1], 2) * choose(nodes - r[1], 1)), str(choose(r[1], 3) * choose(nodes - r[1], 0))))
print("")
print("if one rack is lost, node-proportional placement")
print("rack   shards below quorum   shards with no copy left   percent below quorum")
for r in racks:
    two_here = choose(r[1], 2) * choose(nodes - r[1], 1)
    three_here = choose(r[1], 3)
    lost = two_here + three_here
    print("  %-6s %-21s %-26s %s" % (r[0], str(lost), str(three_here), str(int(lost * 100 / placements))))
print("")
big = racks[0]
a_lost = choose(big[1], 2) * choose(nodes - big[1], 1) + choose(big[1], 3)
print("  losing rack %s takes %s of %s shards below quorum" % (big[0], str(a_lost), str(placements)))
print("  and destroys %s of them outright" % str(choose(big[1], 3)))
print("  no shard ever had fewer than three replicas at any point")
print("")
print("control - one replica per rack")
print("rack   shards below quorum   shards with no copy left")
for r in racks:
    print("  %-6s %-21s %s" % (r[0], "0", "0"))
print("  every shard keeps two copies whichever rack is lost")
print("  the replication factor is three under both policies, unchanged")
print("")
print("control - what the continuous check measures")
print("  shards with fewer than %s replicas, node-proportional : 0" % str(replication_factor))
print("  shards with fewer than %s replicas, one per rack      : 0" % str(replication_factor))
print("  the check is correct, it agrees with itself, and it cannot separate")
print("  the two policies because the quantity it counts is the same in both")
print("")
replicas = placements * replication_factor
print("replicas per node, the reason the policy exists")
print("rack   nodes   node-proportional   one per rack")
flat = 0
skewed = 0
for r in racks:
    even_per_node = int(replicas * r[1] / nodes / r[1])
    rack_per_node = int(placements / r[1])
    if even_per_node > flat:
        flat = even_per_node
    if rack_per_node > skewed:
        skewed = rack_per_node
    print("  %-6s %-7s %-19s %s" % (r[0], str(r[1]), str(even_per_node), str(rack_per_node)))
print("  busiest node, node-proportional : %s" % str(flat))
print("  busiest node, one per rack      : %s" % str(skewed))
print("  one replica per rack loads the busiest node %s percent more heavily" % str(int((skewed - flat) * 100 / flat)))
print("  so the policy in place is not a mistake, it is the other half of a")
print("  trade nobody wrote down as a trade")
print("")
print("the arrangement that has neither cost")
print("  racks of equal size : one replica per rack is also perfectly even")
print("  racks as they are   : %s nodes against %s and %s" % (str(racks[0][1]), str(racks[1][1]), str(racks[2][1])))
print("  the imbalance in the rack sizes is what makes the two goals disagree")
print("  and the rack sizes were set by which cage had space in 2019")
print("")
print("Balancing by node count puts exactly the same number of replicas on every")
print("node, and one per rack would load the busiest node %s percent harder. Three" % str(int((skewed - flat) * 100 / flat)))
print("copies is a proxy for three independent chances: losing rack %s takes %s of" % (big[0], str(a_lost)))
print("%s shards below quorum, with the replica count at three throughout." % str(placements))
```

## stdout (executed)

```text
nodes : 20 across 3 racks
replication factor : 3
distinct placements of one shard : 1140
one shard per placement, so every count below is exact

rack   nodes   shards with 0   with 1   with 2   with 3
  A      12      56              336      528      220
  B      4       560             480      96       4
  C      4       560             480      96       4

if one rack is lost, node-proportional placement
rack   shards below quorum   shards with no copy left   percent below quorum
  A      748                   220                        65
  B      100                   4                          8
  C      100                   4                          8

  losing rack A takes 748 of 1140 shards below quorum
  and destroys 220 of them outright
  no shard ever had fewer than three replicas at any point

control - one replica per rack
rack   shards below quorum   shards with no copy left
  A      0                     0
  B      0                     0
  C      0                     0
  every shard keeps two copies whichever rack is lost
  the replication factor is three under both policies, unchanged

control - what the continuous check measures
  shards with fewer than 3 replicas, node-proportional : 0
  shards with fewer than 3 replicas, one per rack      : 0
  the check is correct, it agrees with itself, and it cannot separate
  the two policies because the quantity it counts is the same in both

replicas per node, the reason the policy exists
rack   nodes   node-proportional   one per rack
  A      12      171                 95
  B      4       171                 285
  C      4       171                 285
  busiest node, node-proportional : 171
  busiest node, one per rack      : 285
  one replica per rack loads the busiest node 66 percent more heavily
  so the policy in place is not a mistake, it is the other half of a
  trade nobody wrote down as a trade

the arrangement that has neither cost
  racks of equal size : one replica per rack is also perfectly even
  racks as they are   : 12 nodes against 4 and 4
  the imbalance in the rack sizes is what makes the two goals disagree
  and the rack sizes were set by which cage had space in 2019

Balancing by node count puts exactly the same number of replicas on every
node, and one per rack would load the busiest node 66 percent harder. Three
copies is a proxy for three independent chances: losing rack A takes 748 of
1140 shards below quorum, with the replica count at three throughout.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
