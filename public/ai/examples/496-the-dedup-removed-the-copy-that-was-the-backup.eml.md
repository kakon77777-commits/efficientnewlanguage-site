<!-- canonical: efficientnewlanguage.org/ai/examples/496-the-dedup-removed-the-copy-that-was-the-backup | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 496 — The dedup removed the copy that was the backup

`the_dedup_removed_the_copy_that_was_the_backup.eml` - Duplicate storage was removed and 40% of the bill went with it. What each duplicate had been doing is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Duplicate storage
# was removed and 40% of the bill went with it. What each duplicate had been
# doing is computed below.
#
# Removing duplicates is right and the savings are real. The same records were
# stored in several places, nobody had designed that, it grew from three
# integrations written by three teams, and consolidating on one copy is the
# correct architecture. The bill really did fall.
#
# Some of those copies were being read. A copy that is read is not a duplicate
# in the sense the cleanup meant - it is a second source that somebody depends
# on, and whether a copy is one or the other is a fact about its readers rather
# than about its contents.
#
# Every copy is classified by who read it.

# [copy, GB, reads per month, reader, what the reader used it for]
[["primary", 400, 900000, "the app", "serving"], ["analytics mirror", 400, 12000, "the warehouse", "reporting"], ["backup snapshot", 400, 4, "the restore drill", "recovery"], ["legacy export", 400, 30, "the finance close", "reconciliation"], ["search shard", 400, 60000, "the search tier", "serving"]] => copies

len(copies) => n
0 => total_gb
0 => unread_gb
0 => read_copies
for c in copies:
    total_gb + c[1] => total_gb
    if c[2] == 0:
        unread_gb + c[1] => unread_gb
    else:
        read_copies + 1 => read_copies

"copies of the same records : " + str(n) + ", " + str(total_gb) + " GB" ^0
"copies with zero reads     : " + str(int(unread_gb / 400)) ^0
"copies with at least one reader : " + str(read_copies) ^0
"" ^0

"copy               GB    reads/month   reader             used for" ^0
for c in copies:
    "  " + c[0] + "   " + str(c[1]) + "   " + str(c[2]) + "        " + c[3] + "   " + c[4] ^0
"" ^0

# ---- what a read-count threshold would delete ----

1000 => threshold
0 => below
0 => below_gb
for c in copies:
    if c[2] < threshold:
        below + 1 => below
        below_gb + c[1] => below_gb
"a cleanup rule that deletes copies under " + str(threshold) + " reads a month" ^0
"  copies deleted : " + str(below) + ", " + str(below_gb) + " GB" ^0
"  which is " + str(int(below_gb * 100 / total_gb)) + "% of the storage" ^0
for c in copies:
    if c[2] < threshold:
        "  deleted : " + c[0] + " (" + str(c[2]) + " reads, used for " + c[4] + ")" ^0
"" ^0

# ---- what read frequency does and does not measure ----

"reads per month, and what the reader would do without the copy" ^0
for c in copies:
    "" => impact
    if c[4] == "recovery":
        "no restore is possible" => impact
    elif c[4] == "reconciliation":
        "the close cannot be signed" => impact
    elif c[4] == "reporting":
        "reports run against the serving store" => impact
    else:
        "the request fails" => impact
    "  " + c[0] + " : " + str(c[2]) + " reads, without it -> " + impact ^0
"  the two lowest read counts belong to the two whose absence is worst," ^0
"  because recovery and reconciliation are rare by design" ^0
"" ^0

# ---- the copies ranked two ways ----

"the two rankings" ^0
0 => least
"" => least_name
for c in copies:
    if least == 0:
        c[2] => least
        c[0] => least_name
    if c[2] < least:
        c[2] => least
        c[0] => least_name
"  fewest reads : " + least_name + " at " + str(least) + " a month" ^0
"  what it is   : the only thing that makes the other four restorable" ^0
"  a rule ordered on reads deletes it first" ^0
"" ^0

# ---- what a correct cleanup would key on ----

"what distinguishes a duplicate from a second source" ^0
"  identical contents : both" ^0
"  low read count     : both, often" ^0
"  has a named reader with a purpose : only the second" ^0
0 => named
for c in copies:
    if c[2] > 0:
        named + 1 => named
"  copies here with a named reader : " + str(named) + " of " + str(n) ^0
if named == n:
    "  all of them, so on this criterion the cleanup deletes nothing, which is" ^0
    "  the honest answer for this data set" ^0
"" ^0

# ---- what was actually duplicated ----

"where the redundancy really is" ^0
"  serving copies : " ^0
0 => serving
for c in copies:
    if c[4] == "serving":
        serving + 1 => serving
"    " + str(serving) + ", and they have different access patterns" ^0
"  the consolidation opportunity is between the two serving copies, which" ^0
"  are the two with the HIGHEST read counts and the ones a read-based rule" ^0
"  would keep" ^0
"" ^0

# ---- the control: a copy nothing reads ----
#
# Where a copy has no reader at all, read count and purpose agree, and
# deleting it is simply correct.

[["abandoned import", 400, 0, "nobody", "nothing"]] => dead
for c in dead:
    "control - " + c[0] + ", " + str(c[2]) + " reads, reader: " + c[3] ^0
    "  no reader, no purpose, " + str(c[1]) + " GB" ^0
    "  here the read count and the purpose point the same way, and this is" ^0
    "  the case the cleanup rule was written from" ^0
"" ^0

"Consolidating storage nobody designed is the right architecture and the" ^0
"saving is real. A read count measures how often a copy is needed, and" ^0
"recovery and reconciliation are rare on purpose." ^0
```

## Python (deterministic transpilation)

```python
copies = [["primary", 400, 900000, "the app", "serving"], ["analytics mirror", 400, 12000, "the warehouse", "reporting"], ["backup snapshot", 400, 4, "the restore drill", "recovery"], ["legacy export", 400, 30, "the finance close", "reconciliation"], ["search shard", 400, 60000, "the search tier", "serving"]]
n = len(copies)
total_gb = 0
unread_gb = 0
read_copies = 0
for c in copies:
    total_gb = total_gb + c[1]
    if c[2] == 0:
        unread_gb = unread_gb + c[1]
    else:
        read_copies = read_copies + 1
print("copies of the same records : " + str(n) + ", " + str(total_gb) + " GB")
print("copies with zero reads     : " + str(int(unread_gb / 400)))
print("copies with at least one reader : " + str(read_copies))
print("")
print("copy               GB    reads/month   reader             used for")
for c in copies:
    print("  " + c[0] + "   " + str(c[1]) + "   " + str(c[2]) + "        " + c[3] + "   " + c[4])
print("")
threshold = 1000
below = 0
below_gb = 0
for c in copies:
    if c[2] < threshold:
        below = below + 1
        below_gb = below_gb + c[1]
print("a cleanup rule that deletes copies under " + str(threshold) + " reads a month")
print("  copies deleted : " + str(below) + ", " + str(below_gb) + " GB")
print("  which is " + str(int(below_gb * 100 / total_gb)) + "% of the storage")
for c in copies:
    if c[2] < threshold:
        print("  deleted : " + c[0] + " (" + str(c[2]) + " reads, used for " + c[4] + ")")
print("")
print("reads per month, and what the reader would do without the copy")
for c in copies:
    impact = ""
    if c[4] == "recovery":
        impact = "no restore is possible"
    elif c[4] == "reconciliation":
        impact = "the close cannot be signed"
    elif c[4] == "reporting":
        impact = "reports run against the serving store"
    else:
        impact = "the request fails"
    print("  " + c[0] + " : " + str(c[2]) + " reads, without it -> " + impact)
print("  the two lowest read counts belong to the two whose absence is worst,")
print("  because recovery and reconciliation are rare by design")
print("")
print("the two rankings")
least = 0
least_name = ""
for c in copies:
    if least == 0:
        least = c[2]
        least_name = c[0]
    if c[2] < least:
        least = c[2]
        least_name = c[0]
print("  fewest reads : " + least_name + " at " + str(least) + " a month")
print("  what it is   : the only thing that makes the other four restorable")
print("  a rule ordered on reads deletes it first")
print("")
print("what distinguishes a duplicate from a second source")
print("  identical contents : both")
print("  low read count     : both, often")
print("  has a named reader with a purpose : only the second")
named = 0
for c in copies:
    if c[2] > 0:
        named = named + 1
print("  copies here with a named reader : " + str(named) + " of " + str(n))
if named == n:
    print("  all of them, so on this criterion the cleanup deletes nothing, which is")
    print("  the honest answer for this data set")
print("")
print("where the redundancy really is")
print("  serving copies : ")
serving = 0
for c in copies:
    if c[4] == "serving":
        serving = serving + 1
print("    " + str(serving) + ", and they have different access patterns")
print("  the consolidation opportunity is between the two serving copies, which")
print("  are the two with the HIGHEST read counts and the ones a read-based rule")
print("  would keep")
print("")
dead = [["abandoned import", 400, 0, "nobody", "nothing"]]
for c in dead:
    print("control - " + c[0] + ", " + str(c[2]) + " reads, reader: " + c[3])
    print("  no reader, no purpose, " + str(c[1]) + " GB")
    print("  here the read count and the purpose point the same way, and this is")
    print("  the case the cleanup rule was written from")
print("")
print("Consolidating storage nobody designed is the right architecture and the")
print("saving is real. A read count measures how often a copy is needed, and")
print("recovery and reconciliation are rare on purpose.")
```

## stdout (executed)

```text
copies of the same records : 5, 2000 GB
copies with zero reads     : 0
copies with at least one reader : 5

copy               GB    reads/month   reader             used for
  primary   400   900000        the app   serving
  analytics mirror   400   12000        the warehouse   reporting
  backup snapshot   400   4        the restore drill   recovery
  legacy export   400   30        the finance close   reconciliation
  search shard   400   60000        the search tier   serving

a cleanup rule that deletes copies under 1000 reads a month
  copies deleted : 2, 800 GB
  which is 40% of the storage
  deleted : backup snapshot (4 reads, used for recovery)
  deleted : legacy export (30 reads, used for reconciliation)

reads per month, and what the reader would do without the copy
  primary : 900000 reads, without it -> the request fails
  analytics mirror : 12000 reads, without it -> reports run against the serving store
  backup snapshot : 4 reads, without it -> no restore is possible
  legacy export : 30 reads, without it -> the close cannot be signed
  search shard : 60000 reads, without it -> the request fails
  the two lowest read counts belong to the two whose absence is worst,
  because recovery and reconciliation are rare by design

the two rankings
  fewest reads : backup snapshot at 4 a month
  what it is   : the only thing that makes the other four restorable
  a rule ordered on reads deletes it first

what distinguishes a duplicate from a second source
  identical contents : both
  low read count     : both, often
  has a named reader with a purpose : only the second
  copies here with a named reader : 5 of 5
  all of them, so on this criterion the cleanup deletes nothing, which is
  the honest answer for this data set

where the redundancy really is
  serving copies : 
    2, and they have different access patterns
  the consolidation opportunity is between the two serving copies, which
  are the two with the HIGHEST read counts and the ones a read-based rule
  would keep

control - abandoned import, 0 reads, reader: nobody
  no reader, no purpose, 400 GB
  here the read count and the purpose point the same way, and this is
  the case the cleanup rule was written from

Consolidating storage nobody designed is the right architecture and the
saving is real. A read count measures how often a copy is needed, and
recovery and reconciliation are rare on purpose.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
