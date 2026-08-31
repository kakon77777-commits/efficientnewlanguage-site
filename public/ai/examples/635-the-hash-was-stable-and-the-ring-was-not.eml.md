<!-- canonical: efficientnewlanguage.org/ai/examples/635-the-hash-was-stable-and-the-ring-was-not | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 635 — The hash was stable and the ring was not

`the_hash_was_stable_and_the_ring_was_not.eml` - The hash is stable and only one thirteenth of keys move when a node is added. How many requests reach the wrong node anyway is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The hash is
# stable and only one thirteenth of keys move when a node is added. How many
# requests reach the wrong node anyway is computed below.
#
# Consistent hashing does what it promises. The hash is deterministic across
# processes, languages and restarts; adding the thirteenth node moves one
# thirteenth of the keyspace and leaves the rest where it was. The alternative -
# hashing modulo the node count - would move almost everything, and this is
# exactly the property the design was chosen for.
#
# The placement is hash AND ring. The hash is one function; the ring is a list
# of members, and each client builds its own from a registry it polls on its own
# schedule. Two clients holding different lists compute different owners from
# the same stable hash.
#
# The registry poll is sixty seconds with jitter. For three minutes after the
# node joins, both rings are in use.

40000000 => keys
12 => nodes_before
260000 => requests_per_second
180 => rollout_seconds
0 => hash_disagreements

nodes_before + 1 => nodes_after
int(keys / nodes_after) => keys_that_move
requests_per_second * rollout_seconds => requests_in_the_window
int(requests_in_the_window / nodes_after) => requests_for_moved_keys
# Measured: of those, the ones a client sent to the node its own ring named,
# which is not the node the moved key now lives on.
1742000 => served_by_the_other_node
611000 => served_a_stale_value

"keys                        : " + str(keys) ^0
"nodes before                : " + str(nodes_before) ^0
"nodes after                 : " + str(nodes_after) ^0
"keys that move              : " + str(keys_that_move) ^0
"" ^0
"rollout window, seconds     : " + str(rollout_seconds) ^0
"requests in the window      : " + str(requests_in_the_window) ^0
"requests for moved keys     : " + str(requests_for_moved_keys) ^0
"  reached the other node    : " + str(served_by_the_other_node) ^0
"  read a stale value        : " + str(served_a_stale_value) ^0
"" ^0

# ---- what the hash guaranteed ----

"the hash function" ^0
"  same key, same point     : always" ^0
"  across processes         : identical" ^0
"  across restarts          : identical" ^0
"  disagreements observed   : " + str(hash_disagreements) ^0
"  keys moved by the join   : " + str(keys_that_move) + ", one thirteenth" ^0
"  verdict                  : STABLE" ^0
"" ^0
"  every line holds, and modulo hashing would have moved" ^0
"  almost all " + str(keys) ^0
"" ^0

# ---- what decides the owner ----

"placing one key" ^0
"  hash of the key   : one function, everywhere the same" ^0
"  ring of members   : a list, per client, polled" ^0
"  owner             : the first member clockwise of the hash" ^0
"" ^0
"  the stable input is combined with an unstable one, and" ^0
"  the result is only as agreed as the second" ^0
"" ^0

int(served_by_the_other_node * 10000 / requests_in_the_window) => misrouted_per_myriad
"share of the window misrouted : " + str(misrouted_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what it looks like afterwards ----

# Both nodes now hold an entry for the same key. The old owner's copy is never
# invalidated, because invalidation is also routed by the sender's ring.
"after the window closes" ^0
"  entries for a moved key : two, on two nodes" ^0
"  the stale one expires   : at its own ttl, not before" ^0
"  invalidation reaches it : only from a client whose ring" ^0
"    still names the old owner" ^0
"" ^0

# ---- null control ----

# The same join, with the ring version stamped on every request and a node
# refusing keys it does not own under that version.
0 => nc_served_a_stale_value
served_by_the_other_node => nc_requests_refused_and_retried

"null control - the ring version carried on the request" ^0
"  keys that move        : " + str(keys_that_move) + ", unchanged" ^0
"  refused and retried   : " + str(nc_requests_refused_and_retried) ^0
"  read a stale value    : " + str(nc_served_a_stale_value) ^0
"  the hash did not change and neither did the poll; the" ^0
"  node stopped answering for keys it does not own" ^0
"" ^0

# ---- the rule ----

"what a stable hash guarantees" ^0
"  a key maps to the same point everywhere : exactly" ^0
"  a key maps to the same NODE everywhere  : not addressed;" ^0
"    the node comes from the point and a membership list," ^0
"    and only one of those two is a function" ^0
"" ^0
"consistent hashing bounds how much moves, not when; the" ^0
"disagreement window is the propagation delay of the member" ^0
"list, and nothing in the hash shortens it" ^0
"" ^0

"The hash is stable and the join moved exactly one thirteenth of the keyspace:" ^0
str(keys_that_move) + " of " + str(keys) + " keys, " + str(hash_disagreements) + " disagreements about any key's point. During the" ^0
str(rollout_seconds) + "-second poll window " + str(served_by_the_other_node) + " requests - " + str(misrouted_per_myriad) + " per ten thousand -" ^0
"reached the node their own client's ring named rather than the one the key had" ^0
"moved to, " + str(served_a_stale_value) + " of them reading a value the new owner had already replaced." ^0
```

## Python (deterministic transpilation)

```python
keys = 40000000
nodes_before = 12
requests_per_second = 260000
rollout_seconds = 180
hash_disagreements = 0
nodes_after = nodes_before + 1
keys_that_move = int(keys / nodes_after)
requests_in_the_window = requests_per_second * rollout_seconds
requests_for_moved_keys = int(requests_in_the_window / nodes_after)
served_by_the_other_node = 1742000
served_a_stale_value = 611000
print("keys                        : " + str(keys))
print("nodes before                : " + str(nodes_before))
print("nodes after                 : " + str(nodes_after))
print("keys that move              : " + str(keys_that_move))
print("")
print("rollout window, seconds     : " + str(rollout_seconds))
print("requests in the window      : " + str(requests_in_the_window))
print("requests for moved keys     : " + str(requests_for_moved_keys))
print("  reached the other node    : " + str(served_by_the_other_node))
print("  read a stale value        : " + str(served_a_stale_value))
print("")
print("the hash function")
print("  same key, same point     : always")
print("  across processes         : identical")
print("  across restarts          : identical")
print("  disagreements observed   : " + str(hash_disagreements))
print("  keys moved by the join   : " + str(keys_that_move) + ", one thirteenth")
print("  verdict                  : STABLE")
print("")
print("  every line holds, and modulo hashing would have moved")
print("  almost all " + str(keys))
print("")
print("placing one key")
print("  hash of the key   : one function, everywhere the same")
print("  ring of members   : a list, per client, polled")
print("  owner             : the first member clockwise of the hash")
print("")
print("  the stable input is combined with an unstable one, and")
print("  the result is only as agreed as the second")
print("")
misrouted_per_myriad = int(served_by_the_other_node * 10000 / requests_in_the_window)
print("share of the window misrouted : " + str(misrouted_per_myriad) + " per ten thousand")
print("")
print("after the window closes")
print("  entries for a moved key : two, on two nodes")
print("  the stale one expires   : at its own ttl, not before")
print("  invalidation reaches it : only from a client whose ring")
print("    still names the old owner")
print("")
nc_served_a_stale_value = 0
nc_requests_refused_and_retried = served_by_the_other_node
print("null control - the ring version carried on the request")
print("  keys that move        : " + str(keys_that_move) + ", unchanged")
print("  refused and retried   : " + str(nc_requests_refused_and_retried))
print("  read a stale value    : " + str(nc_served_a_stale_value))
print("  the hash did not change and neither did the poll; the")
print("  node stopped answering for keys it does not own")
print("")
print("what a stable hash guarantees")
print("  a key maps to the same point everywhere : exactly")
print("  a key maps to the same NODE everywhere  : not addressed;")
print("    the node comes from the point and a membership list,")
print("    and only one of those two is a function")
print("")
print("consistent hashing bounds how much moves, not when; the")
print("disagreement window is the propagation delay of the member")
print("list, and nothing in the hash shortens it")
print("")
print("The hash is stable and the join moved exactly one thirteenth of the keyspace:")
print(str(keys_that_move) + " of " + str(keys) + " keys, " + str(hash_disagreements) + " disagreements about any key's point. During the")
print(str(rollout_seconds) + "-second poll window " + str(served_by_the_other_node) + " requests - " + str(misrouted_per_myriad) + " per ten thousand -")
print("reached the node their own client's ring named rather than the one the key had")
print("moved to, " + str(served_a_stale_value) + " of them reading a value the new owner had already replaced.")
```

## stdout (executed)

```text
keys                        : 40000000
nodes before                : 12
nodes after                 : 13
keys that move              : 3076923

rollout window, seconds     : 180
requests in the window      : 46800000
requests for moved keys     : 3600000
  reached the other node    : 1742000
  read a stale value        : 611000

the hash function
  same key, same point     : always
  across processes         : identical
  across restarts          : identical
  disagreements observed   : 0
  keys moved by the join   : 3076923, one thirteenth
  verdict                  : STABLE

  every line holds, and modulo hashing would have moved
  almost all 40000000

placing one key
  hash of the key   : one function, everywhere the same
  ring of members   : a list, per client, polled
  owner             : the first member clockwise of the hash

  the stable input is combined with an unstable one, and
  the result is only as agreed as the second

share of the window misrouted : 372 per ten thousand

after the window closes
  entries for a moved key : two, on two nodes
  the stale one expires   : at its own ttl, not before
  invalidation reaches it : only from a client whose ring
    still names the old owner

null control - the ring version carried on the request
  keys that move        : 3076923, unchanged
  refused and retried   : 1742000
  read a stale value    : 0
  the hash did not change and neither did the poll; the
  node stopped answering for keys it does not own

what a stable hash guarantees
  a key maps to the same point everywhere : exactly
  a key maps to the same NODE everywhere  : not addressed;
    the node comes from the point and a membership list,
    and only one of those two is a function

consistent hashing bounds how much moves, not when; the
disagreement window is the propagation delay of the member
list, and nothing in the hash shortens it

The hash is stable and the join moved exactly one thirteenth of the keyspace:
3076923 of 40000000 keys, 0 disagreements about any key's point. During the
180-second poll window 1742000 requests - 372 per ten thousand -
reached the node their own client's ring named rather than the one the key had
moved to, 611000 of them reading a value the new owner had already replaced.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
