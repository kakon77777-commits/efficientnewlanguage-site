<!-- canonical: efficientnewlanguage.org/ai/examples/655-the-two-nodes-agreed-and-both-were-behind | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 655 — The two nodes agreed and both were behind

`the_two_nodes_agreed_and_both_were_behind.eml` - Every read is confirmed by two replicas that agree, and they do agree. How old the answer is is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every read is
# confirmed by two replicas that agree, and they do agree. How old the answer is
# is computed below.
#
# The quorum is correctly implemented. A read is not returned until two of the
# three replicas have answered with the same value; a disagreement is detected,
# logged and retried against the third; and a deliberate corruption drill on one
# replica was caught on the first read. Two out of three is a real check and it
# is doing real work.
#
# Agreement is a statement about two ANSWERS. It says the two replicas hold the
# same bytes. It does not say when either of them last heard from the leader,
# and two replicas behind by the same amount agree perfectly.
#
# The client asks the two fastest. The current replica is the slow one, because
# applying the write stream is what makes it slow.

3 => replicas
2 => quorum
41 => replica_a_lag_seconds
43 => replica_b_lag_seconds
0 => replica_c_lag_seconds
12 => fast_replica_p99_ms
180 => current_replica_p99_ms
3400 => writes_per_second
26000 => reads_per_second
0 => quorum_disagreements

# The client's policy is "the two fastest", and the two fastest are the two that
# are not applying the backlog.
replica_a_lag_seconds => lag_of_the_answer_seconds
lag_of_the_answer_seconds * writes_per_second => writes_the_quorum_cannot_see

"replicas                     : " + str(replicas) ^0
"quorum                       : " + str(quorum) ^0
"replica A lag, seconds       : " + str(replica_a_lag_seconds) ^0
"replica B lag, seconds       : " + str(replica_b_lag_seconds) ^0
"replica C lag, seconds       : " + str(replica_c_lag_seconds) ^0
"" ^0
"p99 of A and B, ms           : " + str(fast_replica_p99_ms) ^0
"p99 of C, ms                 : " + str(current_replica_p99_ms) ^0
"writes the quorum cannot see : " + str(writes_the_quorum_cannot_see) ^0
"" ^0

# ---- what the quorum verified ----

"the quorum check" ^0
"  replicas that must agree : " + str(quorum) ^0
"  disagreements this week  : " + str(quorum_disagreements) ^0
"  corruption drill on one replica : caught on the first read" ^0
"  reads served per second  : " + str(reads_per_second) ^0
"  verdict                  : CONSISTENT" ^0
"" ^0
"  the drill is why this is trusted, and it found the" ^0
"  corruption immediately" ^0
"" ^0

# ---- which two answered ----

"choosing the two" ^0
"  policy            : the two fastest to respond" ^0
"  A and B, p99 ms   : " + str(fast_replica_p99_ms) ^0
"  C, p99 ms         : " + str(current_replica_p99_ms) ^0
"  why C is slow     : it is applying the write stream" ^0
"  how often C is in the quorum : never" ^0
"" ^0
"  the policy selects for the property that is anti-" ^0
"  correlated with freshness, and it does so every time" ^0
"" ^0

int(current_replica_p99_ms / fast_replica_p99_ms) => how_much_slower_current_is
"the current replica is " + str(how_much_slower_current_is) + " times slower, which is why it is excluded" ^0
"" ^0

# ---- what a reader concludes ----

# Two independent sources agreeing is the strongest evidence most systems can
# offer, and here the independence is in the storage and not in the clock.
"the evidence the reader has" ^0
"  independent replicas agreeing : " + str(quorum) ^0
"  what that rules out           : one replica corrupted," ^0
"    one replica rolled back, one disk lying" ^0
"  what it does not rule out     : both replicas being" ^0
"    " + str(lag_of_the_answer_seconds) + " seconds old, which is exactly what they are" ^0
"" ^0

# ---- null control ----

# The same quorum, with the replica's lag returned alongside its answer and the
# read refused above a threshold.
5 => nc_max_lag_seconds
nc_max_lag_seconds * writes_per_second => nc_writes_the_quorum_cannot_see

"null control - each answer carries its lag, bounded at 5 s" ^0
"  quorum disagreements    : " + str(quorum_disagreements) + ", unchanged" ^0
"  max lag accepted, seconds : " + str(nc_max_lag_seconds) ^0
"  writes the quorum cannot see : " + str(nc_writes_the_quorum_cannot_see) ^0
"  the replicas did not become more consistent; the answer" ^0
"  started carrying the one fact the comparison omits" ^0
"" ^0

# ---- the rule ----

"what an agreeing quorum guarantees" ^0
"  these replicas hold the same value : exactly" ^0
"  the value is current                : not addressed;" ^0
"    agreement is a comparison between replicas and" ^0
"    currency is a comparison with the leader" ^0
"" ^0
"two sources agreeing is strong evidence against corruption" ^0
"and no evidence at all about age; when the selection policy" ^0
"prefers the idle replicas, it is evidence against currency" ^0
"" ^0

"The quorum agrees on every read and the check is real: " + str(quorum_disagreements) + " disagreements this" ^0
"week and a corruption drill caught on the first read. The two that answer are" ^0
"the two fastest, which are the two not applying the write stream - " + str(how_much_slower_current_is) + " times" ^0
"faster than the current replica - so the agreed answer is " + str(lag_of_the_answer_seconds) + " seconds old and" ^0
str(writes_the_quorum_cannot_see) + " writes are invisible to a read that two independent replicas confirmed." ^0
```

## Python (deterministic transpilation)

```python
replicas = 3
quorum = 2
replica_a_lag_seconds = 41
replica_b_lag_seconds = 43
replica_c_lag_seconds = 0
fast_replica_p99_ms = 12
current_replica_p99_ms = 180
writes_per_second = 3400
reads_per_second = 26000
quorum_disagreements = 0
lag_of_the_answer_seconds = replica_a_lag_seconds
writes_the_quorum_cannot_see = lag_of_the_answer_seconds * writes_per_second
print("replicas                     : " + str(replicas))
print("quorum                       : " + str(quorum))
print("replica A lag, seconds       : " + str(replica_a_lag_seconds))
print("replica B lag, seconds       : " + str(replica_b_lag_seconds))
print("replica C lag, seconds       : " + str(replica_c_lag_seconds))
print("")
print("p99 of A and B, ms           : " + str(fast_replica_p99_ms))
print("p99 of C, ms                 : " + str(current_replica_p99_ms))
print("writes the quorum cannot see : " + str(writes_the_quorum_cannot_see))
print("")
print("the quorum check")
print("  replicas that must agree : " + str(quorum))
print("  disagreements this week  : " + str(quorum_disagreements))
print("  corruption drill on one replica : caught on the first read")
print("  reads served per second  : " + str(reads_per_second))
print("  verdict                  : CONSISTENT")
print("")
print("  the drill is why this is trusted, and it found the")
print("  corruption immediately")
print("")
print("choosing the two")
print("  policy            : the two fastest to respond")
print("  A and B, p99 ms   : " + str(fast_replica_p99_ms))
print("  C, p99 ms         : " + str(current_replica_p99_ms))
print("  why C is slow     : it is applying the write stream")
print("  how often C is in the quorum : never")
print("")
print("  the policy selects for the property that is anti-")
print("  correlated with freshness, and it does so every time")
print("")
how_much_slower_current_is = int(current_replica_p99_ms / fast_replica_p99_ms)
print("the current replica is " + str(how_much_slower_current_is) + " times slower, which is why it is excluded")
print("")
print("the evidence the reader has")
print("  independent replicas agreeing : " + str(quorum))
print("  what that rules out           : one replica corrupted,")
print("    one replica rolled back, one disk lying")
print("  what it does not rule out     : both replicas being")
print("    " + str(lag_of_the_answer_seconds) + " seconds old, which is exactly what they are")
print("")
nc_max_lag_seconds = 5
nc_writes_the_quorum_cannot_see = nc_max_lag_seconds * writes_per_second
print("null control - each answer carries its lag, bounded at 5 s")
print("  quorum disagreements    : " + str(quorum_disagreements) + ", unchanged")
print("  max lag accepted, seconds : " + str(nc_max_lag_seconds))
print("  writes the quorum cannot see : " + str(nc_writes_the_quorum_cannot_see))
print("  the replicas did not become more consistent; the answer")
print("  started carrying the one fact the comparison omits")
print("")
print("what an agreeing quorum guarantees")
print("  these replicas hold the same value : exactly")
print("  the value is current                : not addressed;")
print("    agreement is a comparison between replicas and")
print("    currency is a comparison with the leader")
print("")
print("two sources agreeing is strong evidence against corruption")
print("and no evidence at all about age; when the selection policy")
print("prefers the idle replicas, it is evidence against currency")
print("")
print("The quorum agrees on every read and the check is real: " + str(quorum_disagreements) + " disagreements this")
print("week and a corruption drill caught on the first read. The two that answer are")
print("the two fastest, which are the two not applying the write stream - " + str(how_much_slower_current_is) + " times")
print("faster than the current replica - so the agreed answer is " + str(lag_of_the_answer_seconds) + " seconds old and")
print(str(writes_the_quorum_cannot_see) + " writes are invisible to a read that two independent replicas confirmed.")
```

## stdout (executed)

```text
replicas                     : 3
quorum                       : 2
replica A lag, seconds       : 41
replica B lag, seconds       : 43
replica C lag, seconds       : 0

p99 of A and B, ms           : 12
p99 of C, ms                 : 180
writes the quorum cannot see : 139400

the quorum check
  replicas that must agree : 2
  disagreements this week  : 0
  corruption drill on one replica : caught on the first read
  reads served per second  : 26000
  verdict                  : CONSISTENT

  the drill is why this is trusted, and it found the
  corruption immediately

choosing the two
  policy            : the two fastest to respond
  A and B, p99 ms   : 12
  C, p99 ms         : 180
  why C is slow     : it is applying the write stream
  how often C is in the quorum : never

  the policy selects for the property that is anti-
  correlated with freshness, and it does so every time

the current replica is 15 times slower, which is why it is excluded

the evidence the reader has
  independent replicas agreeing : 2
  what that rules out           : one replica corrupted,
    one replica rolled back, one disk lying
  what it does not rule out     : both replicas being
    41 seconds old, which is exactly what they are

null control - each answer carries its lag, bounded at 5 s
  quorum disagreements    : 0, unchanged
  max lag accepted, seconds : 5
  writes the quorum cannot see : 17000
  the replicas did not become more consistent; the answer
  started carrying the one fact the comparison omits

what an agreeing quorum guarantees
  these replicas hold the same value : exactly
  the value is current                : not addressed;
    agreement is a comparison between replicas and
    currency is a comparison with the leader

two sources agreeing is strong evidence against corruption
and no evidence at all about age; when the selection policy
prefers the idle replicas, it is evidence against currency

The quorum agrees on every read and the check is real: 0 disagreements this
week and a corruption drill caught on the first read. The two that answer are
the two fastest, which are the two not applying the write stream - 15 times
faster than the current replica - so the agreed answer is 41 seconds old and
139400 writes are invisible to a read that two independent replicas confirmed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
