<!-- canonical: efficientnewlanguage.org/ai/examples/795-the-dedup-hash-included-the-timestamp | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 795 — The dedup hash included the timestamp

`the_dedup_hash_included_the_timestamp.eml` - The event store deduplicates by content hash, and the hashing is correct. What the hash is taken over is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The event store
# deduplicates by content hash, and the hashing is correct. What the hash is
# taken over is computed below.
#
# The dedup is built carefully. The hash is a strong one; two records with the
# same bytes always get the same key; the key is the primary key, so a repeat is
# rejected at insert; and the store is exactly-once by construction on that key.
#
# The hash is taken over the whole record, and the record carries received_at.

4000000 => events_received
90000 => true_duplicates
200 => duplicates_removed

events_received - true_duplicates => distinct_events_by_payload
true_duplicates - duplicates_removed => duplicates_that_survived
events_received - duplicates_removed => events_stored
int(duplicates_removed * 10000 / true_duplicates) => dedup_effectiveness_per_myriad
int(duplicates_that_survived * 10000 / events_stored) => survivors_per_myriad_of_the_store

"events received                 : " + str(events_received) ^0
"true duplicates among them      : " + str(true_duplicates) ^0
"  removed by the dedup          : " + str(duplicates_removed) ^0
"  that survived                 : " + str(duplicates_that_survived) ^0
"distinct events by payload      : " + str(distinct_events_by_payload) ^0
"events stored                   : " + str(events_stored) ^0
"" ^0
"dedup effectiveness             : " + str(dedup_effectiveness_per_myriad) + " per ten thousand" ^0
"survivors in the store          : " + str(survivors_per_myriad_of_the_store) + " per ten thousand" ^0
"" ^0

# ---- what the dedup verified ----

"the content-hash dedup" ^0
"  hash : a strong one" ^0
"  same bytes : always the same key" ^0
"  the key : the primary key, repeats rejected at insert" ^0
"  guarantee on that key : exactly-once by construction" ^0
"  identical records that collided correctly : all of them" ^0
"  verdict : DEDUPLICATED" ^0
"" ^0
"  making the hash the primary key is the part done right" ^0
"  here, and it is why an exact byte-repeat cannot land" ^0
"  twice" ^0
"" ^0

# ---- what the hash is over ----

"the bytes the hash covers" ^0
"  what is included : the whole record" ^0
"  what the whole record carries : received_at, stamped on" ^0
"    arrival" ^0
"  so the same event sent twice : arrives at two instants" ^0
"    and hashes to two keys" ^0
"  what same-bytes means here : same payload AND same" ^0
"    receive time, which a resend never has" ^0
"  duplicates the key could catch : only exact-instant" ^0
"    collisions, " + str(duplicates_removed) + " of them" ^0
"" ^0

# ---- what a consumer counts ----

"the consumer reading the store" ^0
"  events it treats as distinct : " + str(events_stored) ^0
"  true duplicates hidden among them : " ^0
"    " + str(duplicates_that_survived) ^0
"  is the hash wrong : no; it is correct over the bytes it" ^0
"    was given" ^0
"  were those bytes the identity of the event : no; the" ^0
"    timestamp made every resend unique" ^0
"  dedup that actually happened : " ^0
"    " + str(dedup_effectiveness_per_myriad) + " per ten thousand of the duplicates" ^0
"" ^0

# ---- null control ----

# The same events, hashed over the payload and a stable event id only, with
# received_at excluded from the key.
200 => nc_removed_when_the_key_had_the_timestamp
90000 => nc_removed_when_the_key_is_the_payload
0 => nc_events_whose_payload_changed

"null control - hash the payload, not the arrival time" ^0
"  removed with timestamp in the key : " ^0
"    " + str(nc_removed_when_the_key_had_the_timestamp) ^0
"  removed with the payload as the key : " ^0
"    " + str(nc_removed_when_the_key_is_the_payload) ^0
"  events whose payload changed : " + str(nc_events_whose_payload_changed) ^0
"  no event and no hash function changed; the key stopped" ^0
"  covering the field that a resend always changes" ^0
"" ^0

# ---- the rule ----

"what a content-hash dedup guarantees" ^0
"  identical bytes are stored once : exactly, the hash is" ^0
"    the primary key and repeats are rejected at insert" ^0
"  each event is stored once : not addressed; the dedup key" ^0
"    hashes the whole record, and the record carries the" ^0
"    receive timestamp, so the same event arriving twice" ^0
"    gets two keys - " + str(duplicates_that_survived) + " of " + str(true_duplicates) + " duplicates survived" ^0
"" ^0

"a hash is an identity over the bytes it is given, and dedup wants identity over" ^0
"the event; a field that changes on every arrival belongs outside the key, or" ^0
"the key distinguishes exactly the copies it should merge" ^0
"" ^0

"The hash is strong and is the primary key, so identical bytes cannot land" ^0
"twice - correct on its inputs. It covers received_at, so a resend hashes anew:" ^0
"" + str(duplicates_that_survived) + " of " + str(true_duplicates) + " duplicates survived, and the dedup caught " + str(dedup_effectiveness_per_myriad) + " per ten" ^0
"thousand of what it was there to catch." ^0
```

## Python (deterministic transpilation)

```python
events_received = 4000000
true_duplicates = 90000
duplicates_removed = 200
distinct_events_by_payload = events_received - true_duplicates
duplicates_that_survived = true_duplicates - duplicates_removed
events_stored = events_received - duplicates_removed
dedup_effectiveness_per_myriad = int(duplicates_removed * 10000 / true_duplicates)
survivors_per_myriad_of_the_store = int(duplicates_that_survived * 10000 / events_stored)
print("events received                 : " + str(events_received))
print("true duplicates among them      : " + str(true_duplicates))
print("  removed by the dedup          : " + str(duplicates_removed))
print("  that survived                 : " + str(duplicates_that_survived))
print("distinct events by payload      : " + str(distinct_events_by_payload))
print("events stored                   : " + str(events_stored))
print("")
print("dedup effectiveness             : " + str(dedup_effectiveness_per_myriad) + " per ten thousand")
print("survivors in the store          : " + str(survivors_per_myriad_of_the_store) + " per ten thousand")
print("")
print("the content-hash dedup")
print("  hash : a strong one")
print("  same bytes : always the same key")
print("  the key : the primary key, repeats rejected at insert")
print("  guarantee on that key : exactly-once by construction")
print("  identical records that collided correctly : all of them")
print("  verdict : DEDUPLICATED")
print("")
print("  making the hash the primary key is the part done right")
print("  here, and it is why an exact byte-repeat cannot land")
print("  twice")
print("")
print("the bytes the hash covers")
print("  what is included : the whole record")
print("  what the whole record carries : received_at, stamped on")
print("    arrival")
print("  so the same event sent twice : arrives at two instants")
print("    and hashes to two keys")
print("  what same-bytes means here : same payload AND same")
print("    receive time, which a resend never has")
print("  duplicates the key could catch : only exact-instant")
print("    collisions, " + str(duplicates_removed) + " of them")
print("")
print("the consumer reading the store")
print("  events it treats as distinct : " + str(events_stored))
print("  true duplicates hidden among them : ")
print("    " + str(duplicates_that_survived))
print("  is the hash wrong : no; it is correct over the bytes it")
print("    was given")
print("  were those bytes the identity of the event : no; the")
print("    timestamp made every resend unique")
print("  dedup that actually happened : ")
print("    " + str(dedup_effectiveness_per_myriad) + " per ten thousand of the duplicates")
print("")
nc_removed_when_the_key_had_the_timestamp = 200
nc_removed_when_the_key_is_the_payload = 90000
nc_events_whose_payload_changed = 0
print("null control - hash the payload, not the arrival time")
print("  removed with timestamp in the key : ")
print("    " + str(nc_removed_when_the_key_had_the_timestamp))
print("  removed with the payload as the key : ")
print("    " + str(nc_removed_when_the_key_is_the_payload))
print("  events whose payload changed : " + str(nc_events_whose_payload_changed))
print("  no event and no hash function changed; the key stopped")
print("  covering the field that a resend always changes")
print("")
print("what a content-hash dedup guarantees")
print("  identical bytes are stored once : exactly, the hash is")
print("    the primary key and repeats are rejected at insert")
print("  each event is stored once : not addressed; the dedup key")
print("    hashes the whole record, and the record carries the")
print("    receive timestamp, so the same event arriving twice")
print("    gets two keys - " + str(duplicates_that_survived) + " of " + str(true_duplicates) + " duplicates survived")
print("")
print("a hash is an identity over the bytes it is given, and dedup wants identity over")
print("the event; a field that changes on every arrival belongs outside the key, or")
print("the key distinguishes exactly the copies it should merge")
print("")
print("The hash is strong and is the primary key, so identical bytes cannot land")
print("twice - correct on its inputs. It covers received_at, so a resend hashes anew:")
print("" + str(duplicates_that_survived) + " of " + str(true_duplicates) + " duplicates survived, and the dedup caught " + str(dedup_effectiveness_per_myriad) + " per ten")
print("thousand of what it was there to catch.")
```

## stdout (executed)

```text
events received                 : 4000000
true duplicates among them      : 90000
  removed by the dedup          : 200
  that survived                 : 89800
distinct events by payload      : 3910000
events stored                   : 3999800

dedup effectiveness             : 22 per ten thousand
survivors in the store          : 224 per ten thousand

the content-hash dedup
  hash : a strong one
  same bytes : always the same key
  the key : the primary key, repeats rejected at insert
  guarantee on that key : exactly-once by construction
  identical records that collided correctly : all of them
  verdict : DEDUPLICATED

  making the hash the primary key is the part done right
  here, and it is why an exact byte-repeat cannot land
  twice

the bytes the hash covers
  what is included : the whole record
  what the whole record carries : received_at, stamped on
    arrival
  so the same event sent twice : arrives at two instants
    and hashes to two keys
  what same-bytes means here : same payload AND same
    receive time, which a resend never has
  duplicates the key could catch : only exact-instant
    collisions, 200 of them

the consumer reading the store
  events it treats as distinct : 3999800
  true duplicates hidden among them : 
    89800
  is the hash wrong : no; it is correct over the bytes it
    was given
  were those bytes the identity of the event : no; the
    timestamp made every resend unique
  dedup that actually happened : 
    22 per ten thousand of the duplicates

null control - hash the payload, not the arrival time
  removed with timestamp in the key : 
    200
  removed with the payload as the key : 
    90000
  events whose payload changed : 0
  no event and no hash function changed; the key stopped
  covering the field that a resend always changes

what a content-hash dedup guarantees
  identical bytes are stored once : exactly, the hash is
    the primary key and repeats are rejected at insert
  each event is stored once : not addressed; the dedup key
    hashes the whole record, and the record carries the
    receive timestamp, so the same event arriving twice
    gets two keys - 89800 of 90000 duplicates survived

a hash is an identity over the bytes it is given, and dedup wants identity over
the event; a field that changes on every arrival belongs outside the key, or
the key distinguishes exactly the copies it should merge

The hash is strong and is the primary key, so identical bytes cannot land
twice - correct on its inputs. It covers received_at, so a resend hashes anew:
89800 of 90000 duplicates survived, and the dedup caught 22 per ten
thousand of what it was there to catch.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
