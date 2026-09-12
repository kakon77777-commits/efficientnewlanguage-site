<!-- canonical: efficientnewlanguage.org/ai/examples/816-the-reconciliation-matched-the-ledger-to-its-own-export | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 816 — The reconciliation matched the ledger to its own export

`the_reconciliation_matched_the_ledger_to_its_own_export.eml` - The daily reconciliation has matched to the cent for the whole quarter, and the match is real. What the two sides of it are is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The daily
# reconciliation has matched to the cent for the whole quarter, and the match is
# real. What the two sides of it are is computed below.
#
# The reconciliation is run properly. It compares two totals, not one; it runs
# every day, unattended; a mismatch of a single cent halts settlement; and the
# result is logged with both figures.
#
# The second total is an export generated from the first.

4200 => accounts
88400000 => ledger_total_cents
88400000 => export_total_cents
0 => discrepancy_the_reconciliation_found
88815000 => bank_statement_total_cents
415000 => pending_transactions_excluded_from_both_cents

ledger_total_cents - export_total_cents => reconciliation_gap_cents
bank_statement_total_cents - ledger_total_cents => true_gap_against_the_bank_cents
int(true_gap_against_the_bank_cents * 10000 / bank_statement_total_cents) => true_gap_per_myriad
1 => independent_sources_in_the_comparison

"accounts                        : " + str(accounts) ^0
"ledger total                    : " + str(ledger_total_cents) + " cents" ^0
"export total                    : " + str(export_total_cents) + " cents" ^0
"  reconciliation gap            : " + str(reconciliation_gap_cents) + " cents" ^0
"  discrepancies found           : " + str(discrepancy_the_reconciliation_found) ^0
"" ^0
"bank statement total            : " + str(bank_statement_total_cents) + " cents" ^0
"  pending excluded from both    : " + str(pending_transactions_excluded_from_both_cents) + " cents" ^0
"  true gap against the bank     : " + str(true_gap_against_the_bank_cents) + " cents" ^0
"  as a share of the bank total  : " + str(true_gap_per_myriad) + " per ten thousand" ^0
"independent sources compared    : " + str(independent_sources_in_the_comparison) ^0
"" ^0

# ---- what the reconciliation verified ----

"the reconciliation" ^0
"  compares : two totals, not one" ^0
"  runs : every day, unattended" ^0
"  on a one-cent mismatch : halts settlement" ^0
"  logs : both figures" ^0
"  days it matched : all of them" ^0
"  verdict : RECONCILED" ^0
"" ^0
"  halting on a single cent is the part almost nobody" ^0
"  dares to wire up, and it is why a match here is trusted" ^0
"" ^0

# ---- what the two sides share ----

"the two totals" ^0
"  the first : the ledger" ^0
"  the second : an export generated from the ledger" ^0
"  what that makes the match : the ledger against itself" ^0
"  a row missing from the ledger : is missing from the" ^0
"    export too, so the two still agree" ^0
"  pending transactions in neither : " ^0
"    " + str(pending_transactions_excluded_from_both_cents) + " cents" ^0
"" ^0

# ---- what the bank shows ----

"the statement from the bank" ^0
"  its total : " + str(bank_statement_total_cents) + " cents" ^0
"  the reconciled total : " + str(ledger_total_cents) + " cents" ^0
"  the gap : " + str(true_gap_against_the_bank_cents) + " cents" ^0
"  what the daily match said about it : nothing; the bank" ^0
"    is not one of the two sides" ^0
"  where the gap lives : the pending class excluded from" ^0
"    the ledger and therefore from its export" ^0
"" ^0

# ---- null control ----

# The same reconciliation, with the second total taken from the bank feed
# instead of from an export of the ledger.
0 => nc_ledger_vs_export_gap_cents
415000 => nc_ledger_vs_bank_gap_cents
1 => nc_discrepancies_it_would_raise

"null control - reconcile against the bank, not an export" ^0
"  ledger vs its export : " + str(nc_ledger_vs_export_gap_cents) + " cents, unchanged" ^0
"  ledger vs the bank : " + str(nc_ledger_vs_bank_gap_cents) + " cents" ^0
"  discrepancies it would raise : " + str(nc_discrepancies_it_would_raise) ^0
"  no figure changed; the second source stopped being" ^0
"  derived from the first" ^0
"" ^0

# ---- the rule ----

"what a matched reconciliation guarantees" ^0
"  the two totals compared are equal : exactly, to the" ^0
"    cent, every day, settlement halted otherwise" ^0
"  the books are correct : not addressed; the export is" ^0
"    generated from the ledger, so the two agree by" ^0
"    construction, and " + str(pending_transactions_excluded_from_both_cents) + " cents excluded from both" ^0
"    is invisible to their comparison" ^0
"" ^0

"a comparison is evidence only between independent sources; two views of one" ^0
"source agree because they are one source, and the error they share is the one" ^0
"error the match can never surface" ^0
"" ^0

"It compares two totals daily and halts on a one-cent gap - matched all quarter." ^0
"The second total is an export of the ledger, so it is the ledger against itself:" ^0
"" + str(pending_transactions_excluded_from_both_cents) + " cents of pending sits in neither, and the bank shows a " + str(true_gap_against_the_bank_cents) + "-cent gap" ^0
"the match could not see, " + str(true_gap_per_myriad) + " per ten thousand, under " + str(independent_sources_in_the_comparison) + " independent source." ^0
```

## Python (deterministic transpilation)

```python
accounts = 4200
ledger_total_cents = 88400000
export_total_cents = 88400000
discrepancy_the_reconciliation_found = 0
bank_statement_total_cents = 88815000
pending_transactions_excluded_from_both_cents = 415000
reconciliation_gap_cents = ledger_total_cents - export_total_cents
true_gap_against_the_bank_cents = bank_statement_total_cents - ledger_total_cents
true_gap_per_myriad = int(true_gap_against_the_bank_cents * 10000 / bank_statement_total_cents)
independent_sources_in_the_comparison = 1
print("accounts                        : " + str(accounts))
print("ledger total                    : " + str(ledger_total_cents) + " cents")
print("export total                    : " + str(export_total_cents) + " cents")
print("  reconciliation gap            : " + str(reconciliation_gap_cents) + " cents")
print("  discrepancies found           : " + str(discrepancy_the_reconciliation_found))
print("")
print("bank statement total            : " + str(bank_statement_total_cents) + " cents")
print("  pending excluded from both    : " + str(pending_transactions_excluded_from_both_cents) + " cents")
print("  true gap against the bank     : " + str(true_gap_against_the_bank_cents) + " cents")
print("  as a share of the bank total  : " + str(true_gap_per_myriad) + " per ten thousand")
print("independent sources compared    : " + str(independent_sources_in_the_comparison))
print("")
print("the reconciliation")
print("  compares : two totals, not one")
print("  runs : every day, unattended")
print("  on a one-cent mismatch : halts settlement")
print("  logs : both figures")
print("  days it matched : all of them")
print("  verdict : RECONCILED")
print("")
print("  halting on a single cent is the part almost nobody")
print("  dares to wire up, and it is why a match here is trusted")
print("")
print("the two totals")
print("  the first : the ledger")
print("  the second : an export generated from the ledger")
print("  what that makes the match : the ledger against itself")
print("  a row missing from the ledger : is missing from the")
print("    export too, so the two still agree")
print("  pending transactions in neither : ")
print("    " + str(pending_transactions_excluded_from_both_cents) + " cents")
print("")
print("the statement from the bank")
print("  its total : " + str(bank_statement_total_cents) + " cents")
print("  the reconciled total : " + str(ledger_total_cents) + " cents")
print("  the gap : " + str(true_gap_against_the_bank_cents) + " cents")
print("  what the daily match said about it : nothing; the bank")
print("    is not one of the two sides")
print("  where the gap lives : the pending class excluded from")
print("    the ledger and therefore from its export")
print("")
nc_ledger_vs_export_gap_cents = 0
nc_ledger_vs_bank_gap_cents = 415000
nc_discrepancies_it_would_raise = 1
print("null control - reconcile against the bank, not an export")
print("  ledger vs its export : " + str(nc_ledger_vs_export_gap_cents) + " cents, unchanged")
print("  ledger vs the bank : " + str(nc_ledger_vs_bank_gap_cents) + " cents")
print("  discrepancies it would raise : " + str(nc_discrepancies_it_would_raise))
print("  no figure changed; the second source stopped being")
print("  derived from the first")
print("")
print("what a matched reconciliation guarantees")
print("  the two totals compared are equal : exactly, to the")
print("    cent, every day, settlement halted otherwise")
print("  the books are correct : not addressed; the export is")
print("    generated from the ledger, so the two agree by")
print("    construction, and " + str(pending_transactions_excluded_from_both_cents) + " cents excluded from both")
print("    is invisible to their comparison")
print("")
print("a comparison is evidence only between independent sources; two views of one")
print("source agree because they are one source, and the error they share is the one")
print("error the match can never surface")
print("")
print("It compares two totals daily and halts on a one-cent gap - matched all quarter.")
print("The second total is an export of the ledger, so it is the ledger against itself:")
print("" + str(pending_transactions_excluded_from_both_cents) + " cents of pending sits in neither, and the bank shows a " + str(true_gap_against_the_bank_cents) + "-cent gap")
print("the match could not see, " + str(true_gap_per_myriad) + " per ten thousand, under " + str(independent_sources_in_the_comparison) + " independent source.")
```

## stdout (executed)

```text
accounts                        : 4200
ledger total                    : 88400000 cents
export total                    : 88400000 cents
  reconciliation gap            : 0 cents
  discrepancies found           : 0

bank statement total            : 88815000 cents
  pending excluded from both    : 415000 cents
  true gap against the bank     : 415000 cents
  as a share of the bank total  : 46 per ten thousand
independent sources compared    : 1

the reconciliation
  compares : two totals, not one
  runs : every day, unattended
  on a one-cent mismatch : halts settlement
  logs : both figures
  days it matched : all of them
  verdict : RECONCILED

  halting on a single cent is the part almost nobody
  dares to wire up, and it is why a match here is trusted

the two totals
  the first : the ledger
  the second : an export generated from the ledger
  what that makes the match : the ledger against itself
  a row missing from the ledger : is missing from the
    export too, so the two still agree
  pending transactions in neither : 
    415000 cents

the statement from the bank
  its total : 88815000 cents
  the reconciled total : 88400000 cents
  the gap : 415000 cents
  what the daily match said about it : nothing; the bank
    is not one of the two sides
  where the gap lives : the pending class excluded from
    the ledger and therefore from its export

null control - reconcile against the bank, not an export
  ledger vs its export : 0 cents, unchanged
  ledger vs the bank : 415000 cents
  discrepancies it would raise : 1
  no figure changed; the second source stopped being
  derived from the first

what a matched reconciliation guarantees
  the two totals compared are equal : exactly, to the
    cent, every day, settlement halted otherwise
  the books are correct : not addressed; the export is
    generated from the ledger, so the two agree by
    construction, and 415000 cents excluded from both
    is invisible to their comparison

a comparison is evidence only between independent sources; two views of one
source agree because they are one source, and the error they share is the one
error the match can never surface

It compares two totals daily and halts on a one-cent gap - matched all quarter.
The second total is an export of the ledger, so it is the ledger against itself:
415000 cents of pending sits in neither, and the bank shows a 415000-cent gap
the match could not see, 46 per ten thousand, under 1 independent source.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
