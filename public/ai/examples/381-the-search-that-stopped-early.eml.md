<!-- canonical: efficientnewlanguage.org/ai/examples/381-the-search-that-stopped-early | ai_layer_version: 0.1.0 | updated: 2026-08-14 -->

# Example 381 — The search that stopped early — 7 of 11 records never examined, report unchanged

`the_search_that_stopped_early.eml` runs the same scanner over a stream it was written for and a stream that outgrew it.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A scan reports
# what it found, and it stopped before the end.
#
# The early exit was correct when it was written. Batches were written one per
# stream and the end-of-batch marker really was the last record, so continuing
# past it would have been reading uninitialised space. Later the writer began
# appending batches to the same stream. Nothing about the scanner changed, and
# nothing about the scanner is wrong in the world it was written for.
#
# What changed is where the marker sits. The scan still terminates, still
# returns, still prints a count, and the count is now a count of the first
# batch rather than of the stream.
#
# Both worlds are run through the same scanner. The one-batch stream is the
# control: there, the early exit and the full walk return the same number, so
# the scanner cannot be blamed for the number alone.

# [kind, status]
[["record", "ok"], ["record", "bad"], ["record", "ok"], ["record", "ok"], ["marker", "ok"]] => one_batch

[["record", "ok"], ["record", "bad"], ["record", "ok"], ["record", "ok"], ["marker", "ok"], ["record", "ok"], ["record", "bad"], ["record", "ok"], ["marker", "ok"], ["record", "bad"], ["record", "ok"]] => many_batches

def scan_early(stream):
    0 => bad
    for r in stream:
        if r[0] == "marker":
            return bad
        if r[1] == "bad":
            bad + 1 => bad
    return bad

def scan_full(stream):
    0 => bad
    for r in stream:
        if r[1] == "bad":
            bad + 1 => bad
    return bad

def examined_early(stream):
    0 => n
    for r in stream:
        if r[0] == "marker":
            return n
        n + 1 => n
    return n

# ---- the control: one batch, where the early exit costs nothing ----

"one-batch stream" ^0
"  records            : " + str(len(one_batch)) ^0
"  examined by early  : " + str(examined_early(one_batch)) ^0
"  early exit reports : " + str(scan_early(one_batch)) ^0
"  full walk reports  : " + str(scan_full(one_batch)) ^0
if scan_early(one_batch) == scan_full(one_batch):
    "  the two agree - the early exit is invisible here" ^0
"" ^0

# ---- the same scanner, a stream that grew ----

"appended stream" ^0
"  records            : " + str(len(many_batches)) ^0
"  examined by early  : " + str(examined_early(many_batches)) ^0
"  never examined     : " + str(len(many_batches) - examined_early(many_batches)) ^0
"  early exit reports : " + str(scan_early(many_batches)) ^0
"  full walk reports  : " + str(scan_full(many_batches)) ^0
"" ^0

scan_early(many_batches) => reported
scan_full(many_batches) => actual
"  missed             : " + str(actual - reported) ^0
"" ^0

# ---- where the missed ones are ----

0 => before_marker
0 => after_marker
0 => seen_marker
for r in many_batches:
    if r[0] == "marker":
        1 => seen_marker
    elif r[1] == "bad":
        if seen_marker == 1:
            after_marker + 1 => after_marker
        else:
            before_marker + 1 => before_marker

"bad records by position" ^0
"  before the first marker : " + str(before_marker) ^0
"  after it                : " + str(after_marker) ^0
if after_marker > 0:
    if reported == before_marker:
        "  the report is exactly the prefix, and says so nowhere" ^0
"" ^0

# ---- the shape of the report is the same in both worlds ----
#
# This is the part that survives review. A scan that returns 1 on a clean
# prefix and a scan that returns 1 on a stream holding 3 produce the same
# sentence, and the sentence is true about the prefix in both.

if scan_early(one_batch) == scan_early(many_batches):
    "The scanner returns " + str(reported) + " for both streams." ^0
    "One of those streams holds " + str(scan_full(one_batch)) + " bad records and the other holds " + str(actual) + "." ^0
"" ^0

"A search that stops has two results: what it found, and where it stopped." ^0
"Only the first one is returned." ^0
```

## Python (deterministic transpilation)

```python
one_batch = [["record", "ok"], ["record", "bad"], ["record", "ok"], ["record", "ok"], ["marker", "ok"]]
many_batches = [["record", "ok"], ["record", "bad"], ["record", "ok"], ["record", "ok"], ["marker", "ok"], ["record", "ok"], ["record", "bad"], ["record", "ok"], ["marker", "ok"], ["record", "bad"], ["record", "ok"]]

def scan_early(stream):
    bad = 0
    for r in stream:
        if r[0] == "marker":
            return bad
        if r[1] == "bad":
            bad = bad + 1
    return bad

def scan_full(stream):
    bad = 0
    for r in stream:
        if r[1] == "bad":
            bad = bad + 1
    return bad

def examined_early(stream):
    n = 0
    for r in stream:
        if r[0] == "marker":
            return n
        n = n + 1
    return n

print("one-batch stream")
print("  records            : " + str(len(one_batch)))
print("  examined by early  : " + str(examined_early(one_batch)))
print("  early exit reports : " + str(scan_early(one_batch)))
print("  full walk reports  : " + str(scan_full(one_batch)))
if scan_early(one_batch) == scan_full(one_batch):
    print("  the two agree - the early exit is invisible here")
print("")
print("appended stream")
print("  records            : " + str(len(many_batches)))
print("  examined by early  : " + str(examined_early(many_batches)))
print("  never examined     : " + str(len(many_batches) - examined_early(many_batches)))
print("  early exit reports : " + str(scan_early(many_batches)))
print("  full walk reports  : " + str(scan_full(many_batches)))
print("")
reported = scan_early(many_batches)
actual = scan_full(many_batches)
print("  missed             : " + str(actual - reported))
print("")
before_marker = 0
after_marker = 0
seen_marker = 0
for r in many_batches:
    if r[0] == "marker":
        seen_marker = 1
    elif r[1] == "bad":
        if seen_marker == 1:
            after_marker = after_marker + 1
        else:
            before_marker = before_marker + 1
print("bad records by position")
print("  before the first marker : " + str(before_marker))
print("  after it                : " + str(after_marker))
if after_marker > 0:
    if reported == before_marker:
        print("  the report is exactly the prefix, and says so nowhere")
print("")
if scan_early(one_batch) == scan_early(many_batches):
    print("The scanner returns " + str(reported) + " for both streams.")
    print("One of those streams holds " + str(scan_full(one_batch)) + " bad records and the other holds " + str(actual) + ".")
print("")
print("A search that stops has two results: what it found, and where it stopped.")
print("Only the first one is returned.")
```

## stdout (executed)

```text
one-batch stream
  records            : 5
  examined by early  : 4
  early exit reports : 1
  full walk reports  : 1
  the two agree - the early exit is invisible here

appended stream
  records            : 11
  examined by early  : 4
  never examined     : 7
  early exit reports : 1
  full walk reports  : 3

  missed             : 2

bad records by position
  before the first marker : 1
  after it                : 2
  the report is exactly the prefix, and says so nowhere

The scanner returns 1 for both streams.
One of those streams holds 1 bad records and the other holds 3.

A search that stops has two results: what it found, and where it stopped.
Only the first one is returned.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
