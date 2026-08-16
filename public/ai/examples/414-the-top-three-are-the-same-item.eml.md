<!-- canonical: efficientnewlanguage.org/ai/examples/414-the-top-three-are-the-same-item | ai_layer_version: 0.1.0 | updated: 2026-08-16 -->

# Example 414 — The top three are the same item - one cause spread across three strings outranks every entry

`the_top_three_are_the_same_item.eml` groups by the string the log carries and again by the cause the strings stand for.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three of the top
# five error messages are one error, spelled three ways.
#
# Grouping by the message string is the only grouping available - there is no
# error code, and the string is what the log carries. Every count is a correct
# count of that exact string.
#
# The strings differ because one of them interpolates a hostname, one was
# reworded in a release, and one comes from a retry path. Nothing about the
# grouping is careless; the key is simply finer than the thing it is standing
# in for.

# [message, count, underlying cause]
[["connect failed: db-1", 41, "db-pool"], ["timeout in handler", 33, "handler"], ["connection failed to db-1", 29, "db-pool"], ["parse error at line 3", 22, "parser"], ["connect failed (retry): db-1", 18, "db-pool"], ["disk full", 9, "disk"]] => rows

def total():
    0 => t
    for r in rows:
        t + r[1] => t
    return t

"the top errors, as displayed" ^0
for r in rows:
    "  " + str(r[1]) + "  " + r[0] ^0
"  total : " + str(total()) ^0
"" ^0

# ---- grouped by the cause the strings stand for ----

[] => causes
for r in rows:
    0 => have
    for c in causes:
        if c == r[2]:
            1 => have
    if have == 0:
        causes + [r[2]] => causes

"grouped by cause" ^0
0 => biggest
"" => biggest_name
for c in causes:
    0 => n
    0 => k
    for r in rows:
        if r[2] == c:
            n + r[1] => n
            k + 1 => k
    "  " + str(n) + "  " + c + "   (" + str(k) + " distinct strings)" ^0
    if n > biggest:
        n => biggest
        c => biggest_name
"" ^0

"  largest cause : " + biggest_name + " at " + str(biggest) + "  (" + str(int(biggest * 100 / total())) + "% of all errors)" ^0
"  largest single string : " + str(rows[0][1]) + "  (" + str(int(rows[0][1] * 100 / total())) + "%)" ^0
"" ^0

# ---- what a top-3 list says under each grouping ----

"the top three, by string" ^0
0 => shown
for r in rows:
    if shown < 3:
        "  " + r[0] ^0
        shown + 1 => shown
0 => top3_str
0 => shown2
for r in rows:
    if shown2 < 3:
        top3_str + r[1] => top3_str
        shown2 + 1 => shown2
"  they cover " + str(int(top3_str * 100 / total())) + "% of errors and " ^0
[] => top3_causes
0 => shown3
for r in rows:
    if shown3 < 3:
        0 => have
        for c in top3_causes:
            if c == r[2]:
                1 => have
        if have == 0:
            top3_causes + [r[2]] => top3_causes
        shown3 + 1 => shown3
"  " + str(len(top3_causes)) + " distinct causes" ^0
"" ^0

# ---- how the ranking changes ----

"where each cause would rank" ^0
"  by string, " + biggest_name + " does not appear as one entry at all" ^0
"  by cause, it is first, at " + str(int(biggest * 100 / total())) + "% - larger than any string in the list" ^0
"" ^0

# ---- the control: strings that map one-to-one onto causes ----

[["disk full", 9, "disk"], ["parse error at line 3", 22, "parser"], ["timeout in handler", 33, "handler"]] => clean
0 => ct
for r in clean:
    ct + r[1] => ct
0 => clean_causes
[] => seen
for r in clean:
    0 => have
    for c in seen:
        if c == r[2]:
            1 => have
    if have == 0:
        seen + [r[2]] => seen
"control - a log where each cause emits one string" ^0
"  strings : " + str(len(clean)) + ", causes : " + str(len(seen)) ^0
if len(clean) == len(seen):
    "  here the string ranking IS the cause ranking" ^0
"" ^0

"Every count is right about the string it counts. Whether the strings stand" ^0
"one-to-one for the things anyone cares about is a separate fact, and the" ^0
"ranking is read as though they do." ^0
```

## Python (deterministic transpilation)

```python
rows = [["connect failed: db-1", 41, "db-pool"], ["timeout in handler", 33, "handler"], ["connection failed to db-1", 29, "db-pool"], ["parse error at line 3", 22, "parser"], ["connect failed (retry): db-1", 18, "db-pool"], ["disk full", 9, "disk"]]

def total():
    t = 0
    for r in rows:
        t = t + r[1]
    return t

print("the top errors, as displayed")
for r in rows:
    print("  " + str(r[1]) + "  " + r[0])
print("  total : " + str(total()))
print("")
causes = []
for r in rows:
    have = 0
    for c in causes:
        if c == r[2]:
            have = 1
    if have == 0:
        causes = causes + [r[2]]
print("grouped by cause")
biggest = 0
biggest_name = ""
for c in causes:
    n = 0
    k = 0
    for r in rows:
        if r[2] == c:
            n = n + r[1]
            k = k + 1
    print("  " + str(n) + "  " + c + "   (" + str(k) + " distinct strings)")
    if n > biggest:
        biggest = n
        biggest_name = c
print("")
print("  largest cause : " + biggest_name + " at " + str(biggest) + "  (" + str(int(biggest * 100 / total())) + "% of all errors)")
print("  largest single string : " + str(rows[0][1]) + "  (" + str(int(rows[0][1] * 100 / total())) + "%)")
print("")
print("the top three, by string")
shown = 0
for r in rows:
    if shown < 3:
        print("  " + r[0])
        shown = shown + 1
top3_str = 0
shown2 = 0
for r in rows:
    if shown2 < 3:
        top3_str = top3_str + r[1]
        shown2 = shown2 + 1
print("  they cover " + str(int(top3_str * 100 / total())) + "% of errors and ")
top3_causes = []
shown3 = 0
for r in rows:
    if shown3 < 3:
        have = 0
        for c in top3_causes:
            if c == r[2]:
                have = 1
        if have == 0:
            top3_causes = top3_causes + [r[2]]
        shown3 = shown3 + 1
print("  " + str(len(top3_causes)) + " distinct causes")
print("")
print("where each cause would rank")
print("  by string, " + biggest_name + " does not appear as one entry at all")
print("  by cause, it is first, at " + str(int(biggest * 100 / total())) + "% - larger than any string in the list")
print("")
clean = [["disk full", 9, "disk"], ["parse error at line 3", 22, "parser"], ["timeout in handler", 33, "handler"]]
ct = 0
for r in clean:
    ct = ct + r[1]
clean_causes = 0
seen = []
for r in clean:
    have = 0
    for c in seen:
        if c == r[2]:
            have = 1
    if have == 0:
        seen = seen + [r[2]]
print("control - a log where each cause emits one string")
print("  strings : " + str(len(clean)) + ", causes : " + str(len(seen)))
if len(clean) == len(seen):
    print("  here the string ranking IS the cause ranking")
print("")
print("Every count is right about the string it counts. Whether the strings stand")
print("one-to-one for the things anyone cares about is a separate fact, and the")
print("ranking is read as though they do.")
```

## stdout (executed)

```text
the top errors, as displayed
  41  connect failed: db-1
  33  timeout in handler
  29  connection failed to db-1
  22  parse error at line 3
  18  connect failed (retry): db-1
  9  disk full
  total : 152

grouped by cause
  88  db-pool   (3 distinct strings)
  33  handler   (1 distinct strings)
  22  parser   (1 distinct strings)
  9  disk   (1 distinct strings)

  largest cause : db-pool at 88  (57% of all errors)
  largest single string : 41  (26%)

the top three, by string
  connect failed: db-1
  timeout in handler
  connection failed to db-1
  they cover 67% of errors and 
  2 distinct causes

where each cause would rank
  by string, db-pool does not appear as one entry at all
  by cause, it is first, at 57% - larger than any string in the list

control - a log where each cause emits one string
  strings : 3, causes : 3
  here the string ranking IS the cause ranking

Every count is right about the string it counts. Whether the strings stand
one-to-one for the things anyone cares about is a separate fact, and the
ranking is read as though they do.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
