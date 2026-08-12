<!-- canonical: efficientnewlanguage.org/ai/examples/339-repairing-in-the-wrong-order-loses-data | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 339 — Repairing in the wrong order loses data — a compensating pair cannot be fixed one side at a time

`repairing_in_the_wrong_order_loses_data.eml` runs four deployment sequences against a writer and a reader that agree on the wrong field name.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A writer and a
# reader that agree on the wrong field name, and four ways to fix them.
#
# The schema says the field is `amount`. Both sides say `amt`. Nothing has ever
# gone wrong, because the only reader of that field is the only writer of it.
# This is a compensating pair, and the thing about a compensating pair is that
# it cannot be repaired one side at a time.
#
# Repairs are deployed one side at a time. That is not a choice, it is how
# deployment works.
#
# Two costs are worth separating. Reads served wrongly during the window are
# recoverable - the window closes. Records WRITTEN during the window are
# persisted in a shape the finished system does not read, and no amount of
# waiting fixes those. The program measures both, for four sequences, and it
# does the final readability check with the finished system's reader rather
# than with whatever was running at the time.
#
# One more separation, and it is the one that decides whether any of this is a
# real comparison. Records that predate the migration are in the old shape in
# EVERY sequence - that is a backfill, planned before anyone started, and
# counting it makes all four look equally bad. The number that distinguishes a
# sequence is records written DURING the window and stranded by it. The first
# version of this program did not separate them, reported 0 of 4 clean, and the
# closing line claimed one sequence was clean. Both the merge and the claim are
# recorded here because the output is what corrected them.

def writer_fields(mode, state):
    if mode == "reader first":
        if state == 2:
            return ["amount"]
        return ["amt"]
    if mode == "writer first":
        if state == 0:
            return ["amt"]
        return ["amount"]
    if mode == "both at once":
        if state == 0:
            return ["amt"]
        return ["amount"]
    if state == 0:
        return ["amt"]
    if state == 1:
        return ["amount", "amt"]
    return ["amount"]

def reader_fields(mode, state):
    if mode == "reader first":
        if state == 0:
            return ["amt"]
        return ["amount"]
    if mode == "writer first":
        if state == 2:
            return ["amount"]
        return ["amt"]
    if mode == "both at once":
        if state == 0:
            return ["amt"]
        return ["amount"]
    if state == 0:
        return ["amt"]
    if state == 1:
        return ["amount", "amt"]
    return ["amount"]

def make_record(fields, value):
    [] => rec
    for f in fields:
        rec + [[f, value]] => rec
    return rec

def read_value(rec, fields):
    for f in fields:
        for kv in rec:
            if kv[0] == f:
                return kv[1]
    return 0 - 1

def state_at(i):
    if i < 4:
        return 0
    if i < 8:
        return 1
    return 2

["w", "r", "w", "r", "w", "r", "w", "r", "w", "r", "w", "r"] => ops
["reader first", "writer first", "both at once", "dual write then dual read"] => modes

# ---- run each sequence ----

"reads served, and records left unreadable, by repair sequence" ^0
[] => summary
for mode in modes:
    [] => store
    0 => reads_ok
    0 => reads_bad
    0 => reads_bad_new
    0 => i
    100 => next_value
    for op in ops:
        state_at(i) => st
        if op == "w":
            store + [[st, make_record(writer_fields(mode, st), next_value)]] => store
            next_value + 1 => next_value
        else:
            for entry in store:
                if read_value(entry[1], reader_fields(mode, st)) < 0:
                    reads_bad + 1 => reads_bad
                    if entry[0] > 0:
                        reads_bad_new + 1 => reads_bad_new
                else:
                    reads_ok + 1 => reads_ok
        i + 1 => i
    # the finished system, reading everything that was ever written
    reader_fields(mode, 2) => final_reader
    0 => stranded_pre
    0 => stranded_new
    0 => written_new
    for entry in store:
        if entry[0] > 0:
            written_new + 1 => written_new
        if read_value(entry[1], final_reader) < 0:
            if entry[0] > 0:
                stranded_new + 1 => stranded_new
            else:
                stranded_pre + 1 => stranded_pre
    "  " + mode ^0
    "    reads failed : " + str(reads_bad) + " total, " + str(reads_bad_new) + " of them on records written during the window" ^0
    "    written during the window : " + str(written_new) ^0
    "    stranded, written during the window : " + str(stranded_new) ^0
    "    stranded, predating the migration   : " + str(stranded_pre) ^0
    summary + [[mode, reads_bad, stranded_new, stranded_pre]] => summary
"" ^0

# ---- the backfill is the same in every sequence, so it decides nothing ----

[] => pre_counts
for s in summary:
    pre_counts + [s[3]] => pre_counts
"records predating the migration, stranded" ^0
"  smallest across the four sequences : " + str(min(pre_counts)) ^0
"  largest  across the four sequences : " + str(max(pre_counts)) ^0
if min(pre_counts) == max(pre_counts):
    "  identical in all four, so this cost belongs to the backfill, not the sequence" ^0
"" ^0

# ---- what the sequence actually decides ----

0 => strand_new
[] => strand_modes
0 => clean_new
[] => clean_modes
for s in summary:
    if s[2] > 0:
        strand_new + 1 => strand_new
        strand_modes + [s[0]] => strand_modes
    else:
        clean_new + 1 => clean_new
        clean_modes + [s[0]] => clean_modes

"sequences that strand records written during the window : " + str(strand_new) + " of " + str(len(modes)) ^0
for m in strand_modes:
    "  strands: " + m ^0
"sequences that do not : " + str(clean_new) ^0
for m in clean_modes:
    "  safe: " + m ^0
"" ^0

# ---- among the safe ones, the read cost still differs ----

[] => safe_reads
for s in summary:
    if s[2] == 0:
        safe_reads + [s[1]] => safe_reads
if len(safe_reads) > 0:
    "among the sequences that strand nothing new, failed reads range from " + str(min(safe_reads)) + " to " + str(max(safe_reads)) ^0
    0 => best
    [] => best_mode
    for s in summary:
        if s[2] == 0:
            if s[1] == min(safe_reads):
                if len(best_mode) == 0:
                    [s[0]] => best_mode
    if len(best_mode) > 0:
        "  fewest failed reads: " + best_mode[0] ^0
"" ^0

"All four pay the same backfill and all four lose reads, by amounts that" ^0
"differ. Only one of them ALSO strands records written during the window." ^0
"A failed read announces itself and then stops; a record written in the old" ^0
"shape is silent, survives the window, and is still there after the incident" ^0
"is closed. The sequence that pays least is the one that makes the system" ^0
"briefly hold BOTH field names at once - carrying the compensating pair on" ^0
"purpose, for exactly as long as it takes to get out of it." ^0
```

## Python (deterministic transpilation)

```python
def writer_fields(mode, state):
    if mode == "reader first":
        if state == 2:
            return ["amount"]
        return ["amt"]
    if mode == "writer first":
        if state == 0:
            return ["amt"]
        return ["amount"]
    if mode == "both at once":
        if state == 0:
            return ["amt"]
        return ["amount"]
    if state == 0:
        return ["amt"]
    if state == 1:
        return ["amount", "amt"]
    return ["amount"]

def reader_fields(mode, state):
    if mode == "reader first":
        if state == 0:
            return ["amt"]
        return ["amount"]
    if mode == "writer first":
        if state == 2:
            return ["amount"]
        return ["amt"]
    if mode == "both at once":
        if state == 0:
            return ["amt"]
        return ["amount"]
    if state == 0:
        return ["amt"]
    if state == 1:
        return ["amount", "amt"]
    return ["amount"]

def make_record(fields, value):
    rec = []
    for f in fields:
        rec = rec + [[f, value]]
    return rec

def read_value(rec, fields):
    for f in fields:
        for kv in rec:
            if kv[0] == f:
                return kv[1]
    return 0 - 1

def state_at(i):
    if i < 4:
        return 0
    if i < 8:
        return 1
    return 2

ops = ["w", "r", "w", "r", "w", "r", "w", "r", "w", "r", "w", "r"]
modes = ["reader first", "writer first", "both at once", "dual write then dual read"]
print("reads served, and records left unreadable, by repair sequence")
summary = []
for mode in modes:
    store = []
    reads_ok = 0
    reads_bad = 0
    reads_bad_new = 0
    i = 0
    next_value = 100
    for op in ops:
        st = state_at(i)
        if op == "w":
            store = store + [[st, make_record(writer_fields(mode, st), next_value)]]
            next_value = next_value + 1
        else:
            for entry in store:
                if read_value(entry[1], reader_fields(mode, st)) < 0:
                    reads_bad = reads_bad + 1
                    if entry[0] > 0:
                        reads_bad_new = reads_bad_new + 1
                else:
                    reads_ok = reads_ok + 1
        i = i + 1
    final_reader = reader_fields(mode, 2)
    stranded_pre = 0
    stranded_new = 0
    written_new = 0
    for entry in store:
        if entry[0] > 0:
            written_new = written_new + 1
        if read_value(entry[1], final_reader) < 0:
            if entry[0] > 0:
                stranded_new = stranded_new + 1
            else:
                stranded_pre = stranded_pre + 1
    print("  " + mode)
    print("    reads failed : " + str(reads_bad) + " total, " + str(reads_bad_new) + " of them on records written during the window")
    print("    written during the window : " + str(written_new))
    print("    stranded, written during the window : " + str(stranded_new))
    print("    stranded, predating the migration   : " + str(stranded_pre))
    summary = summary + [[mode, reads_bad, stranded_new, stranded_pre]]
print("")
pre_counts = []
for s in summary:
    pre_counts = pre_counts + [s[3]]
print("records predating the migration, stranded")
print("  smallest across the four sequences : " + str(min(pre_counts)))
print("  largest  across the four sequences : " + str(max(pre_counts)))
if min(pre_counts) == max(pre_counts):
    print("  identical in all four, so this cost belongs to the backfill, not the sequence")
print("")
strand_new = 0
strand_modes = []
clean_new = 0
clean_modes = []
for s in summary:
    if s[2] > 0:
        strand_new = strand_new + 1
        strand_modes = strand_modes + [s[0]]
    else:
        clean_new = clean_new + 1
        clean_modes = clean_modes + [s[0]]
print("sequences that strand records written during the window : " + str(strand_new) + " of " + str(len(modes)))
for m in strand_modes:
    print("  strands: " + m)
print("sequences that do not : " + str(clean_new))
for m in clean_modes:
    print("  safe: " + m)
print("")
safe_reads = []
for s in summary:
    if s[2] == 0:
        safe_reads = safe_reads + [s[1]]
if len(safe_reads) > 0:
    print("among the sequences that strand nothing new, failed reads range from " + str(min(safe_reads)) + " to " + str(max(safe_reads)))
    best = 0
    best_mode = []
    for s in summary:
        if s[2] == 0:
            if s[1] == min(safe_reads):
                if len(best_mode) == 0:
                    best_mode = [s[0]]
    if len(best_mode) > 0:
        print("  fewest failed reads: " + best_mode[0])
print("")
print("All four pay the same backfill and all four lose reads, by amounts that")
print("differ. Only one of them ALSO strands records written during the window.")
print("A failed read announces itself and then stops; a record written in the old")
print("shape is silent, survives the window, and is still there after the incident")
print("is closed. The sequence that pays least is the one that makes the system")
print("briefly hold BOTH field names at once - carrying the compensating pair on")
print("purpose, for exactly as long as it takes to get out of it.")
```

## stdout (executed)

```text
reads served, and records left unreadable, by repair sequence
  reader first
    reads failed : 15 total, 7 of them on records written during the window
    written during the window : 4
    stranded, written during the window : 2
    stranded, predating the migration   : 2
  writer first
    reads failed : 7 total, 3 of them on records written during the window
    written during the window : 4
    stranded, written during the window : 0
    stranded, predating the migration   : 2
  both at once
    reads failed : 8 total, 0 of them on records written during the window
    written during the window : 4
    stranded, written during the window : 0
    stranded, predating the migration   : 2
  dual write then dual read
    reads failed : 4 total, 0 of them on records written during the window
    written during the window : 4
    stranded, written during the window : 0
    stranded, predating the migration   : 2

records predating the migration, stranded
  smallest across the four sequences : 2
  largest  across the four sequences : 2
  identical in all four, so this cost belongs to the backfill, not the sequence

sequences that strand records written during the window : 1 of 4
  strands: reader first
sequences that do not : 3
  safe: writer first
  safe: both at once
  safe: dual write then dual read

among the sequences that strand nothing new, failed reads range from 4 to 8
  fewest failed reads: dual write then dual read

All four pay the same backfill and all four lose reads, by amounts that
differ. Only one of them ALSO strands records written during the window.
A failed read announces itself and then stops; a record written in the old
shape is silent, survives the window, and is still there after the incident
is closed. The sequence that pays least is the one that makes the system
briefly hold BOTH field names at once - carrying the compensating pair on
purpose, for exactly as long as it takes to get out of it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
