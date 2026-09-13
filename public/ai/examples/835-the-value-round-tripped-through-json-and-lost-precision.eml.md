<!-- canonical: efficientnewlanguage.org/ai/examples/835-the-value-round-tripped-through-json-and-lost-precision | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 835 — The value round tripped through json and lost precision

`the_value_round_tripped_through_json_and_lost_precision.eml` - The account ids survived every hop of the pipeline unchanged, and each hop's check passed. What format carries them between hops is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The account ids
# survived every hop of the pipeline unchanged, and each hop's check passed. What
# format carries them between hops is computed below.
#
# The pipeline is careful with ids. Each hop verifies the id it received is
# well-formed; ids are never truncated or reformatted deliberately; the transport
# is logged; and a mismatch between hops raises an error. Same id in, same id out
# is the contract.
#
# Between two hops the id is a JSON number, and JSON numbers are parsed as
# float64, which is exact only up to 2^53.

5000000 => ids_processed
4200 => ids_above_two_to_the_53
4200 => ids_that_came_back_changed
0 => hops_that_deliberately_reformatted_an_id

ids_processed - ids_above_two_to_the_53 => ids_within_float_range
int(ids_that_came_back_changed * 10000 / ids_processed) => corrupted_share_per_myriad

"ids processed                   : " + str(ids_processed) ^0
"  within float range            : " + str(ids_within_float_range) ^0
"  above 2^53                    : " + str(ids_above_two_to_the_53) ^0
"  came back changed             : " + str(ids_that_came_back_changed) ^0
"hops that reformatted on purpose: " + str(hops_that_deliberately_reformatted_an_id) ^0
"corrupted share                 : " + str(corrupted_share_per_myriad) + " per ten thousand" ^0
"" ^0
"one id, through the JSON hop" ^0
"  in  : 9007199254740993" ^0
"  out : 9007199254740992" ^0
"  changed by : 1, silently" ^0
"" ^0

# ---- what each hop verified ----

"the per-hop check" ^0
"  verifies : the id received is well-formed" ^0
"  truncation or reformatting : none, deliberately" ^0
"  transport : logged" ^0
"  on a mismatch between hops : raises an error" ^0
"  deliberate id changes : " + str(hops_that_deliberately_reformatted_an_id) ^0
"  verdict : IDS INTACT" ^0
"" ^0
"  raising on a mismatch between hops is the part done" ^0
"  right here, and it is why a dropped or garbled id would" ^0
"  be caught" ^0
"" ^0

# ---- what the format cannot hold ----

"the JSON number between the hops" ^0
"  how the id crosses : as a JSON number" ^0
"  how the next hop parses it : as float64" ^0
"  what float64 represents exactly : integers up to 2^53" ^0
"  an id above that : rounds to the nearest representable" ^0
"    value" ^0
"  9007199254740993 becomes : 9007199254740992" ^0
"  did any hop reformat it : no; the format did" ^0
"" ^0

# ---- why no mismatch fired ----

"the check that did not catch it" ^0
"  what it compares : the id at one hop to the id at the" ^0
"    next" ^0
"  both hops in JSON : both already rounded, so both agree" ^0
"  what agreement means here : the corruption is upstream" ^0
"    of both, in the format they share" ^0
"  ids above 2^53 that came back wrong : " ^0
"    " + str(ids_that_came_back_changed) ^0
"  is the id well-formed at each hop : yes; wrong, but" ^0
"    well-formed" ^0
"" ^0

# ---- null control ----

# The same ids, carried between hops as strings so the transport preserves every
# digit.
4200 => nc_ids_above_two_to_the_53
0 => nc_ids_changed_when_carried_as_strings
4200 => nc_ids_now_preserved

"null control - carry the id as a string" ^0
"  ids above 2^53 : " + str(nc_ids_above_two_to_the_53) + ", unchanged in count" ^0
"  ids changed when carried as strings : " ^0
"    " + str(nc_ids_changed_when_carried_as_strings) ^0
"  ids now preserved : " + str(nc_ids_now_preserved) ^0
"  no id and no hop changed; the number that cannot hold" ^0
"  them stopped being the thing that carries them" ^0
"" ^0

# ---- the rule ----

"what same-id-in-same-id-out guarantees" ^0
"  each hop received a well-formed id and passed it on :" ^0
"    exactly, no deliberate reformatting, mismatches raised" ^0
"  the id survives the round trip : not addressed; between" ^0
"    two hops it is a JSON number parsed as float64, and" ^0
"    " + str(ids_that_came_back_changed) + " ids above 2^53 came back changed - silently," ^0
"    because the format cannot represent them" ^0
"" ^0

"a value survives a pipeline only in a format that can hold it, and a check" ^0
"between two hops that share a lossy format compares two already-damaged copies;" ^0
"the loss is invisible precisely because it is common to both sides" ^0
"" ^0

"Each hop verifies a well-formed id and raises on a mismatch - ids intact by" ^0
"every check. Between two hops the id is a JSON float64, exact only to 2^53, so" ^0
"" + str(ids_that_came_back_changed) + " ids above it came back changed, " + str(corrupted_share_per_myriad) + " per ten thousand, under " ^0
"" + str(hops_that_deliberately_reformatted_an_id) + " deliberate reformats." ^0
```

## Python (deterministic transpilation)

```python
ids_processed = 5000000
ids_above_two_to_the_53 = 4200
ids_that_came_back_changed = 4200
hops_that_deliberately_reformatted_an_id = 0
ids_within_float_range = ids_processed - ids_above_two_to_the_53
corrupted_share_per_myriad = int(ids_that_came_back_changed * 10000 / ids_processed)
print("ids processed                   : " + str(ids_processed))
print("  within float range            : " + str(ids_within_float_range))
print("  above 2^53                    : " + str(ids_above_two_to_the_53))
print("  came back changed             : " + str(ids_that_came_back_changed))
print("hops that reformatted on purpose: " + str(hops_that_deliberately_reformatted_an_id))
print("corrupted share                 : " + str(corrupted_share_per_myriad) + " per ten thousand")
print("")
print("one id, through the JSON hop")
print("  in  : 9007199254740993")
print("  out : 9007199254740992")
print("  changed by : 1, silently")
print("")
print("the per-hop check")
print("  verifies : the id received is well-formed")
print("  truncation or reformatting : none, deliberately")
print("  transport : logged")
print("  on a mismatch between hops : raises an error")
print("  deliberate id changes : " + str(hops_that_deliberately_reformatted_an_id))
print("  verdict : IDS INTACT")
print("")
print("  raising on a mismatch between hops is the part done")
print("  right here, and it is why a dropped or garbled id would")
print("  be caught")
print("")
print("the JSON number between the hops")
print("  how the id crosses : as a JSON number")
print("  how the next hop parses it : as float64")
print("  what float64 represents exactly : integers up to 2^53")
print("  an id above that : rounds to the nearest representable")
print("    value")
print("  9007199254740993 becomes : 9007199254740992")
print("  did any hop reformat it : no; the format did")
print("")
print("the check that did not catch it")
print("  what it compares : the id at one hop to the id at the")
print("    next")
print("  both hops in JSON : both already rounded, so both agree")
print("  what agreement means here : the corruption is upstream")
print("    of both, in the format they share")
print("  ids above 2^53 that came back wrong : ")
print("    " + str(ids_that_came_back_changed))
print("  is the id well-formed at each hop : yes; wrong, but")
print("    well-formed")
print("")
nc_ids_above_two_to_the_53 = 4200
nc_ids_changed_when_carried_as_strings = 0
nc_ids_now_preserved = 4200
print("null control - carry the id as a string")
print("  ids above 2^53 : " + str(nc_ids_above_two_to_the_53) + ", unchanged in count")
print("  ids changed when carried as strings : ")
print("    " + str(nc_ids_changed_when_carried_as_strings))
print("  ids now preserved : " + str(nc_ids_now_preserved))
print("  no id and no hop changed; the number that cannot hold")
print("  them stopped being the thing that carries them")
print("")
print("what same-id-in-same-id-out guarantees")
print("  each hop received a well-formed id and passed it on :")
print("    exactly, no deliberate reformatting, mismatches raised")
print("  the id survives the round trip : not addressed; between")
print("    two hops it is a JSON number parsed as float64, and")
print("    " + str(ids_that_came_back_changed) + " ids above 2^53 came back changed - silently,")
print("    because the format cannot represent them")
print("")
print("a value survives a pipeline only in a format that can hold it, and a check")
print("between two hops that share a lossy format compares two already-damaged copies;")
print("the loss is invisible precisely because it is common to both sides")
print("")
print("Each hop verifies a well-formed id and raises on a mismatch - ids intact by")
print("every check. Between two hops the id is a JSON float64, exact only to 2^53, so")
print("" + str(ids_that_came_back_changed) + " ids above it came back changed, " + str(corrupted_share_per_myriad) + " per ten thousand, under ")
print("" + str(hops_that_deliberately_reformatted_an_id) + " deliberate reformats.")
```

## stdout (executed)

```text
ids processed                   : 5000000
  within float range            : 4995800
  above 2^53                    : 4200
  came back changed             : 4200
hops that reformatted on purpose: 0
corrupted share                 : 8 per ten thousand

one id, through the JSON hop
  in  : 9007199254740993
  out : 9007199254740992
  changed by : 1, silently

the per-hop check
  verifies : the id received is well-formed
  truncation or reformatting : none, deliberately
  transport : logged
  on a mismatch between hops : raises an error
  deliberate id changes : 0
  verdict : IDS INTACT

  raising on a mismatch between hops is the part done
  right here, and it is why a dropped or garbled id would
  be caught

the JSON number between the hops
  how the id crosses : as a JSON number
  how the next hop parses it : as float64
  what float64 represents exactly : integers up to 2^53
  an id above that : rounds to the nearest representable
    value
  9007199254740993 becomes : 9007199254740992
  did any hop reformat it : no; the format did

the check that did not catch it
  what it compares : the id at one hop to the id at the
    next
  both hops in JSON : both already rounded, so both agree
  what agreement means here : the corruption is upstream
    of both, in the format they share
  ids above 2^53 that came back wrong : 
    4200
  is the id well-formed at each hop : yes; wrong, but
    well-formed

null control - carry the id as a string
  ids above 2^53 : 4200, unchanged in count
  ids changed when carried as strings : 
    0
  ids now preserved : 4200
  no id and no hop changed; the number that cannot hold
  them stopped being the thing that carries them

what same-id-in-same-id-out guarantees
  each hop received a well-formed id and passed it on :
    exactly, no deliberate reformatting, mismatches raised
  the id survives the round trip : not addressed; between
    two hops it is a JSON number parsed as float64, and
    4200 ids above 2^53 came back changed - silently,
    because the format cannot represent them

a value survives a pipeline only in a format that can hold it, and a check
between two hops that share a lossy format compares two already-damaged copies;
the loss is invisible precisely because it is common to both sides

Each hop verifies a well-formed id and raises on a mismatch - ids intact by
every check. Between two hops the id is a JSON float64, exact only to 2^53, so
4200 ids above it came back changed, 8 per ten thousand, under 
0 deliberate reformats.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
