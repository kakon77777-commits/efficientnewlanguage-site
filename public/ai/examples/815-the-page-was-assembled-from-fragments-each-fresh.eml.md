<!-- canonical: efficientnewlanguage.org/ai/examples/815-the-page-was-assembled-from-fragments-each-fresh | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 815 — The page was assembled from fragments each fresh

`the_page_was_assembled_from_fragments_each_fresh.eml` - Every fragment on the page was within its cache TTL when it was read, and each freshness check is real. When the fragments were read relative to each other is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every fragment on
# the page was within its cache TTL when it was read, and each freshness check is
# real. When the fragments were read relative to each other is computed below.
#
# The caching is careful per fragment. Each fragment has a 30-second TTL; a
# fragment past its TTL is refetched, not served stale; the TTL is checked at the
# moment of read; and no fragment on the page had expired.
#
# The page is assembled over 40 seconds, so the first fragment is read 40 seconds
# before the last.

8 => fragments
30 => fragment_ttl_seconds
40 => seconds_to_assemble_the_page
20 => second_at_which_a_shared_total_changed
0 => fragments_served_past_ttl

fragments - fragments_served_past_ttl => fragments_within_ttl
seconds_to_assemble_the_page - fragment_ttl_seconds => seconds_the_page_span_exceeds_one_ttl
5 => fragments_read_before_the_change
fragments - fragments_read_before_the_change => fragments_read_after_the_change
1 => totals_on_the_page_that_never_coexisted

"fragments                       : " + str(fragments) ^0
"  each TTL                      : " + str(fragment_ttl_seconds) + " seconds" ^0
"  served past TTL               : " + str(fragments_served_past_ttl) ^0
"  within TTL                    : " + str(fragments_within_ttl) ^0
"seconds to assemble the page    : " + str(seconds_to_assemble_the_page) ^0
"  page span over one TTL by     : " + str(seconds_the_page_span_exceeds_one_ttl) + " seconds" ^0
"" ^0
"a shared total changed at second: " + str(second_at_which_a_shared_total_changed) ^0
"  fragments read before it      : " + str(fragments_read_before_the_change) ^0
"  fragments read after it       : " + str(fragments_read_after_the_change) ^0
"totals shown that never coexisted : " + str(totals_on_the_page_that_never_coexisted) ^0
"" ^0

# ---- what the per-fragment cache verified ----

"the per-fragment freshness" ^0
"  each fragment TTL : 30 seconds" ^0
"  past its TTL : refetched, never served stale" ^0
"  checked : at the moment of read" ^0
"  fragments expired on the page : " + str(fragments_served_past_ttl) ^0
"  fragments within TTL : " + str(fragments_within_ttl) ^0
"  verdict : EVERY FRAGMENT FRESH" ^0
"" ^0
"  checking the TTL at read time rather than trusting an" ^0
"  age stamp is the part done right here, and it is why no" ^0
"  fragment is stale" ^0
"" ^0

# ---- what freshness is not ----

"fresh but not simultaneous" ^0
"  each fragment : read within its 30-second window" ^0
"  the window the page spans : " + str(seconds_to_assemble_the_page) + " seconds" ^0
"  so two fragments both fresh : can still be read " ^0
"    " + str(seconds_to_assemble_the_page) + " seconds apart" ^0
"  a value that changed at second " + str(second_at_which_a_shared_total_changed) + " : is old in the" ^0
"    ones read before and new in the ones read after" ^0
"  what freshness bounds : age, not agreement" ^0
"" ^0

# ---- what the viewer sees ----

"the page the viewer gets" ^0
"  fragments showing the old total : " ^0
"    " + str(fragments_read_before_the_change) ^0
"  fragments showing the new total : " ^0
"    " + str(fragments_read_after_the_change) ^0
"  a state where both were true at once : never existed" ^0
"  is any fragment stale : no; each is inside its TTL" ^0
"  what the page is : a snapshot of no single instant" ^0
"" ^0

# ---- null control ----

# The same fragments, read at one instant against a single version stamp so the
# page is a consistent snapshot.
0 => nc_inconsistent_pages_when_snapshotted
1 => nc_inconsistent_pages_when_assembled_over_time
0 => nc_fragments_that_go_stale

"null control - read all fragments at one version" ^0
"  inconsistent pages, snapshotted : " ^0
"    " + str(nc_inconsistent_pages_when_snapshotted) ^0
"  inconsistent pages, assembled over time : " ^0
"    " + str(nc_inconsistent_pages_when_assembled_over_time) ^0
"  fragments that go stale : " + str(nc_fragments_that_go_stale) ^0
"  no TTL and no fragment changed; the reads stopped being" ^0
"  spread across a window in which the data moved" ^0
"" ^0

# ---- the rule ----

"what per-fragment freshness guarantees" ^0
"  each fragment is within its TTL when read : exactly, 30" ^0
"    seconds, refetched otherwise, checked at read" ^0
"  the page is a consistent snapshot : not addressed; each" ^0
"    fragment is within its 30s TTL, and freshness is not" ^0
"    simultaneity - " + str(fragments_read_before_the_change) + " fragments were read before a change and " ^0
"    " + str(fragments_read_after_the_change) + " after, so the page shows a mix that never coexisted" ^0
"" ^0

"freshness bounds how old each part is, and consistency asks that the parts be" ^0
"of one instant; a page assembled across a window longer than nothing can be" ^0
"all-fresh and still show a whole that never existed" ^0
"" ^0

"Each fragment is within its 30-second TTL, refetched otherwise, checked at read" ^0
"- none stale. The page takes " + str(seconds_to_assemble_the_page) + " seconds to assemble, longer than a TTL, so a" ^0
"total that changed at second " + str(second_at_which_a_shared_total_changed) + " is old in " + str(fragments_read_before_the_change) + " fragments and new in " + str(fragments_read_after_the_change) + "," ^0
"a snapshot of no instant under " + str(fragments_served_past_ttl) + " stale fragments." ^0
```

## Python (deterministic transpilation)

```python
fragments = 8
fragment_ttl_seconds = 30
seconds_to_assemble_the_page = 40
second_at_which_a_shared_total_changed = 20
fragments_served_past_ttl = 0
fragments_within_ttl = fragments - fragments_served_past_ttl
seconds_the_page_span_exceeds_one_ttl = seconds_to_assemble_the_page - fragment_ttl_seconds
fragments_read_before_the_change = 5
fragments_read_after_the_change = fragments - fragments_read_before_the_change
totals_on_the_page_that_never_coexisted = 1
print("fragments                       : " + str(fragments))
print("  each TTL                      : " + str(fragment_ttl_seconds) + " seconds")
print("  served past TTL               : " + str(fragments_served_past_ttl))
print("  within TTL                    : " + str(fragments_within_ttl))
print("seconds to assemble the page    : " + str(seconds_to_assemble_the_page))
print("  page span over one TTL by     : " + str(seconds_the_page_span_exceeds_one_ttl) + " seconds")
print("")
print("a shared total changed at second: " + str(second_at_which_a_shared_total_changed))
print("  fragments read before it      : " + str(fragments_read_before_the_change))
print("  fragments read after it       : " + str(fragments_read_after_the_change))
print("totals shown that never coexisted : " + str(totals_on_the_page_that_never_coexisted))
print("")
print("the per-fragment freshness")
print("  each fragment TTL : 30 seconds")
print("  past its TTL : refetched, never served stale")
print("  checked : at the moment of read")
print("  fragments expired on the page : " + str(fragments_served_past_ttl))
print("  fragments within TTL : " + str(fragments_within_ttl))
print("  verdict : EVERY FRAGMENT FRESH")
print("")
print("  checking the TTL at read time rather than trusting an")
print("  age stamp is the part done right here, and it is why no")
print("  fragment is stale")
print("")
print("fresh but not simultaneous")
print("  each fragment : read within its 30-second window")
print("  the window the page spans : " + str(seconds_to_assemble_the_page) + " seconds")
print("  so two fragments both fresh : can still be read ")
print("    " + str(seconds_to_assemble_the_page) + " seconds apart")
print("  a value that changed at second " + str(second_at_which_a_shared_total_changed) + " : is old in the")
print("    ones read before and new in the ones read after")
print("  what freshness bounds : age, not agreement")
print("")
print("the page the viewer gets")
print("  fragments showing the old total : ")
print("    " + str(fragments_read_before_the_change))
print("  fragments showing the new total : ")
print("    " + str(fragments_read_after_the_change))
print("  a state where both were true at once : never existed")
print("  is any fragment stale : no; each is inside its TTL")
print("  what the page is : a snapshot of no single instant")
print("")
nc_inconsistent_pages_when_snapshotted = 0
nc_inconsistent_pages_when_assembled_over_time = 1
nc_fragments_that_go_stale = 0
print("null control - read all fragments at one version")
print("  inconsistent pages, snapshotted : ")
print("    " + str(nc_inconsistent_pages_when_snapshotted))
print("  inconsistent pages, assembled over time : ")
print("    " + str(nc_inconsistent_pages_when_assembled_over_time))
print("  fragments that go stale : " + str(nc_fragments_that_go_stale))
print("  no TTL and no fragment changed; the reads stopped being")
print("  spread across a window in which the data moved")
print("")
print("what per-fragment freshness guarantees")
print("  each fragment is within its TTL when read : exactly, 30")
print("    seconds, refetched otherwise, checked at read")
print("  the page is a consistent snapshot : not addressed; each")
print("    fragment is within its 30s TTL, and freshness is not")
print("    simultaneity - " + str(fragments_read_before_the_change) + " fragments were read before a change and ")
print("    " + str(fragments_read_after_the_change) + " after, so the page shows a mix that never coexisted")
print("")
print("freshness bounds how old each part is, and consistency asks that the parts be")
print("of one instant; a page assembled across a window longer than nothing can be")
print("all-fresh and still show a whole that never existed")
print("")
print("Each fragment is within its 30-second TTL, refetched otherwise, checked at read")
print("- none stale. The page takes " + str(seconds_to_assemble_the_page) + " seconds to assemble, longer than a TTL, so a")
print("total that changed at second " + str(second_at_which_a_shared_total_changed) + " is old in " + str(fragments_read_before_the_change) + " fragments and new in " + str(fragments_read_after_the_change) + ",")
print("a snapshot of no instant under " + str(fragments_served_past_ttl) + " stale fragments.")
```

## stdout (executed)

```text
fragments                       : 8
  each TTL                      : 30 seconds
  served past TTL               : 0
  within TTL                    : 8
seconds to assemble the page    : 40
  page span over one TTL by     : 10 seconds

a shared total changed at second: 20
  fragments read before it      : 5
  fragments read after it       : 3
totals shown that never coexisted : 1

the per-fragment freshness
  each fragment TTL : 30 seconds
  past its TTL : refetched, never served stale
  checked : at the moment of read
  fragments expired on the page : 0
  fragments within TTL : 8
  verdict : EVERY FRAGMENT FRESH

  checking the TTL at read time rather than trusting an
  age stamp is the part done right here, and it is why no
  fragment is stale

fresh but not simultaneous
  each fragment : read within its 30-second window
  the window the page spans : 40 seconds
  so two fragments both fresh : can still be read 
    40 seconds apart
  a value that changed at second 20 : is old in the
    ones read before and new in the ones read after
  what freshness bounds : age, not agreement

the page the viewer gets
  fragments showing the old total : 
    5
  fragments showing the new total : 
    3
  a state where both were true at once : never existed
  is any fragment stale : no; each is inside its TTL
  what the page is : a snapshot of no single instant

null control - read all fragments at one version
  inconsistent pages, snapshotted : 
    0
  inconsistent pages, assembled over time : 
    1
  fragments that go stale : 0
  no TTL and no fragment changed; the reads stopped being
  spread across a window in which the data moved

what per-fragment freshness guarantees
  each fragment is within its TTL when read : exactly, 30
    seconds, refetched otherwise, checked at read
  the page is a consistent snapshot : not addressed; each
    fragment is within its 30s TTL, and freshness is not
    simultaneity - 5 fragments were read before a change and 
    3 after, so the page shows a mix that never coexisted

freshness bounds how old each part is, and consistency asks that the parts be
of one instant; a page assembled across a window longer than nothing can be
all-fresh and still show a whole that never existed

Each fragment is within its 30-second TTL, refetched otherwise, checked at read
- none stale. The page takes 40 seconds to assemble, longer than a TTL, so a
total that changed at second 20 is old in 5 fragments and new in 3,
a snapshot of no instant under 0 stale fragments.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
