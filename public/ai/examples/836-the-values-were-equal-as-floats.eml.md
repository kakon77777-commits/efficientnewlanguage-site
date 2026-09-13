<!-- canonical: efficientnewlanguage.org/ai/examples/836-the-values-were-equal-as-floats | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 836 — The values were equal as floats

`the_values_were_equal_as_floats.eml` - The reconciliation passed on every pair it compared, and each comparison ran without error. What the comparison treats as equal is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The reconciliation
# passed on every pair it compared, and each comparison ran without error. What
# the comparison treats as equal is computed below.
#
# The reconciliation is careful. It compares the two sides pair by pair, not in
# aggregate; it runs on every pair, no sampling; a difference is meant to fail
# the pair and halt; and the pairs it passed it really did evaluate as equal.
#
# The comparison is == on floating-point dollars, and cents below the float's
# precision at that magnitude round away before the compare.

90000 => pairs_compared
37 => pairs_that_differ_by_a_cent
37 => pairs_equal_as_floats
0 => pairs_the_reconciliation_failed

pairs_equal_as_floats => hidden_discrepancies
hidden_discrepancies => discrepancy_cents_total
int(pairs_that_differ_by_a_cent * 10000 / pairs_compared) => hidden_share_per_myriad

"pairs compared                  : " + str(pairs_compared) ^0
"  that truly differ by a cent   : " + str(pairs_that_differ_by_a_cent) ^0
"  equal as floats               : " + str(pairs_equal_as_floats) ^0
"  the reconciliation failed     : " + str(pairs_the_reconciliation_failed) ^0
"hidden discrepancies            : " + str(hidden_discrepancies) ^0
"discrepancy total               : " + str(discrepancy_cents_total) + " cents" ^0
"hidden share                    : " + str(hidden_share_per_myriad) + " per ten thousand" ^0
"" ^0
"one pair, in cents and as floats" ^0
"  side A : 100000000001 cents" ^0
"  side B : 100000000000 cents" ^0
"  differ by : 1 cent" ^0
"  as float dollars : both nearest the same value, so ==" ^0
"" ^0

# ---- what the reconciliation verified ----

"the reconciliation" ^0
"  compares : pair by pair, not in aggregate" ^0
"  coverage : every pair, no sampling" ^0
"  on a difference : fails the pair and halts" ^0
"  pairs it passed : evaluated equal, genuinely" ^0
"  pairs it failed : " + str(pairs_the_reconciliation_failed) ^0
"  verdict : RECONCILED" ^0
"" ^0
"  comparing pair by pair rather than netting the totals is" ^0
"  the part done right here, and it is why offsetting errors" ^0
"  cannot hide" ^0
"" ^0

# ---- what equal means here ----

"the comparison itself" ^0
"  operator : == on floating-point dollars" ^0
"  what a float holds at ten-figure magnitudes : not every" ^0
"    cent" ^0
"  a one-cent difference there : rounds to the same" ^0
"    representable value" ^0
"  so the two sides : are equal as floats, unequal as cents" ^0
"  pairs this hid : " + str(pairs_equal_as_floats) ^0
"" ^0

# ---- what the cent-level truth is ----

"the same pairs, in integer cents" ^0
"  pairs that differ by a cent : " + str(pairs_that_differ_by_a_cent) ^0
"  what the reconciliation said about them : equal" ^0
"  cents unaccounted for : " + str(discrepancy_cents_total) ^0
"  is the comparison wrong : no; as floats they are equal" ^0
"  are they equal : no; as cents they differ" ^0
"" ^0

# ---- null control ----

# The same pairs, compared as integer cents rather than as floating-point
# dollars.
0 => nc_hidden_when_compared_as_cents
37 => nc_pairs_the_cent_compare_fails
37 => nc_cents_it_would_surface

"null control - compare integer cents" ^0
"  hidden discrepancies, cent compare : " ^0
"    " + str(nc_hidden_when_compared_as_cents) ^0
"  pairs the cent compare fails : " + str(nc_pairs_the_cent_compare_fails) ^0
"  cents it would surface : " + str(nc_cents_it_would_surface) ^0
"  no amount changed; the comparison stopped rounding the" ^0
"  cents away before it looked" ^0
"" ^0

# ---- the rule ----

"what a passed reconciliation guarantees" ^0
"  every compared pair evaluated equal : exactly, pair by" ^0
"    pair, no sampling, halt on a difference" ^0
"  equal amounts reconcile : not addressed; the comparison" ^0
"    is == on floats and cents beyond the float's precision" ^0
"    vanish - " + str(pairs_equal_as_floats) + " pairs compared equal while differing by a" ^0
"    cent, hiding " + str(discrepancy_cents_total) + " cents" ^0
"" ^0

"equality is only as fine as the type it is tested in, and a float at a large" ^0
"magnitude cannot hold a cent; two amounts a cent apart are the same number to" ^0
"it, and the reconciliation asks it, not the ledger" ^0
"" ^0

"It compares pair by pair with no sampling and halts on a difference - every" ^0
"pair equal. The compare is == on float dollars, which cannot hold a cent at ten" ^0
"figures, so " + str(pairs_equal_as_floats) + " pairs a cent apart read as equal, " + str(discrepancy_cents_total) + " cents hidden, " ^0
"" + str(hidden_share_per_myriad) + " per ten thousand of the pairs, under " + str(pairs_the_reconciliation_failed) + " failures." ^0
```

## Python (deterministic transpilation)

```python
pairs_compared = 90000
pairs_that_differ_by_a_cent = 37
pairs_equal_as_floats = 37
pairs_the_reconciliation_failed = 0
hidden_discrepancies = pairs_equal_as_floats
discrepancy_cents_total = hidden_discrepancies
hidden_share_per_myriad = int(pairs_that_differ_by_a_cent * 10000 / pairs_compared)
print("pairs compared                  : " + str(pairs_compared))
print("  that truly differ by a cent   : " + str(pairs_that_differ_by_a_cent))
print("  equal as floats               : " + str(pairs_equal_as_floats))
print("  the reconciliation failed     : " + str(pairs_the_reconciliation_failed))
print("hidden discrepancies            : " + str(hidden_discrepancies))
print("discrepancy total               : " + str(discrepancy_cents_total) + " cents")
print("hidden share                    : " + str(hidden_share_per_myriad) + " per ten thousand")
print("")
print("one pair, in cents and as floats")
print("  side A : 100000000001 cents")
print("  side B : 100000000000 cents")
print("  differ by : 1 cent")
print("  as float dollars : both nearest the same value, so ==")
print("")
print("the reconciliation")
print("  compares : pair by pair, not in aggregate")
print("  coverage : every pair, no sampling")
print("  on a difference : fails the pair and halts")
print("  pairs it passed : evaluated equal, genuinely")
print("  pairs it failed : " + str(pairs_the_reconciliation_failed))
print("  verdict : RECONCILED")
print("")
print("  comparing pair by pair rather than netting the totals is")
print("  the part done right here, and it is why offsetting errors")
print("  cannot hide")
print("")
print("the comparison itself")
print("  operator : == on floating-point dollars")
print("  what a float holds at ten-figure magnitudes : not every")
print("    cent")
print("  a one-cent difference there : rounds to the same")
print("    representable value")
print("  so the two sides : are equal as floats, unequal as cents")
print("  pairs this hid : " + str(pairs_equal_as_floats))
print("")
print("the same pairs, in integer cents")
print("  pairs that differ by a cent : " + str(pairs_that_differ_by_a_cent))
print("  what the reconciliation said about them : equal")
print("  cents unaccounted for : " + str(discrepancy_cents_total))
print("  is the comparison wrong : no; as floats they are equal")
print("  are they equal : no; as cents they differ")
print("")
nc_hidden_when_compared_as_cents = 0
nc_pairs_the_cent_compare_fails = 37
nc_cents_it_would_surface = 37
print("null control - compare integer cents")
print("  hidden discrepancies, cent compare : ")
print("    " + str(nc_hidden_when_compared_as_cents))
print("  pairs the cent compare fails : " + str(nc_pairs_the_cent_compare_fails))
print("  cents it would surface : " + str(nc_cents_it_would_surface))
print("  no amount changed; the comparison stopped rounding the")
print("  cents away before it looked")
print("")
print("what a passed reconciliation guarantees")
print("  every compared pair evaluated equal : exactly, pair by")
print("    pair, no sampling, halt on a difference")
print("  equal amounts reconcile : not addressed; the comparison")
print("    is == on floats and cents beyond the float's precision")
print("    vanish - " + str(pairs_equal_as_floats) + " pairs compared equal while differing by a")
print("    cent, hiding " + str(discrepancy_cents_total) + " cents")
print("")
print("equality is only as fine as the type it is tested in, and a float at a large")
print("magnitude cannot hold a cent; two amounts a cent apart are the same number to")
print("it, and the reconciliation asks it, not the ledger")
print("")
print("It compares pair by pair with no sampling and halts on a difference - every")
print("pair equal. The compare is == on float dollars, which cannot hold a cent at ten")
print("figures, so " + str(pairs_equal_as_floats) + " pairs a cent apart read as equal, " + str(discrepancy_cents_total) + " cents hidden, ")
print("" + str(hidden_share_per_myriad) + " per ten thousand of the pairs, under " + str(pairs_the_reconciliation_failed) + " failures.")
```

## stdout (executed)

```text
pairs compared                  : 90000
  that truly differ by a cent   : 37
  equal as floats               : 37
  the reconciliation failed     : 0
hidden discrepancies            : 37
discrepancy total               : 37 cents
hidden share                    : 4 per ten thousand

one pair, in cents and as floats
  side A : 100000000001 cents
  side B : 100000000000 cents
  differ by : 1 cent
  as float dollars : both nearest the same value, so ==

the reconciliation
  compares : pair by pair, not in aggregate
  coverage : every pair, no sampling
  on a difference : fails the pair and halts
  pairs it passed : evaluated equal, genuinely
  pairs it failed : 0
  verdict : RECONCILED

  comparing pair by pair rather than netting the totals is
  the part done right here, and it is why offsetting errors
  cannot hide

the comparison itself
  operator : == on floating-point dollars
  what a float holds at ten-figure magnitudes : not every
    cent
  a one-cent difference there : rounds to the same
    representable value
  so the two sides : are equal as floats, unequal as cents
  pairs this hid : 37

the same pairs, in integer cents
  pairs that differ by a cent : 37
  what the reconciliation said about them : equal
  cents unaccounted for : 37
  is the comparison wrong : no; as floats they are equal
  are they equal : no; as cents they differ

null control - compare integer cents
  hidden discrepancies, cent compare : 
    0
  pairs the cent compare fails : 37
  cents it would surface : 37
  no amount changed; the comparison stopped rounding the
  cents away before it looked

what a passed reconciliation guarantees
  every compared pair evaluated equal : exactly, pair by
    pair, no sampling, halt on a difference
  equal amounts reconcile : not addressed; the comparison
    is == on floats and cents beyond the float's precision
    vanish - 37 pairs compared equal while differing by a
    cent, hiding 37 cents

equality is only as fine as the type it is tested in, and a float at a large
magnitude cannot hold a cent; two amounts a cent apart are the same number to
it, and the reconciliation asks it, not the ledger

It compares pair by pair with no sampling and halts on a difference - every
pair equal. The compare is == on float dollars, which cannot hold a cent at ten
figures, so 37 pairs a cent apart read as equal, 37 cents hidden, 
4 per ten thousand of the pairs, under 0 failures.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
