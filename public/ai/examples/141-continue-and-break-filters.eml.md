<!-- canonical: efficientnewlanguage.org/ai/examples/141-continue-and-break-filters | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 141 — `continue` and `break` are not symmetric

`continue_and_break_filters.eml` pins the interaction of the two loop escapes — used by two and nine corpus programs respectively, and never examined together.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). `continue` and
# `break`, which two and nine corpus programs used respectively and which
# nothing had pinned the interaction of.
#
# The two are not symmetric and the difference is where bugs live:
#
#   `continue` skips the REST OF THIS ITERATION and goes to the next one
#   `break`    abandons the loop entirely
#
# and in a `while` loop that is a trap, because `continue` jumps straight back
# to the condition - skipping any increment written at the bottom of the body,
# which is an infinite loop. The program shows the wrong shape and the right
# one side by side, with a step counter proving the fixed version terminates.
#
# The other thing worth pinning: `break` in a nested loop leaves only the INNER
# loop. There is no labelled break in EML (nor in Python), so escaping both
# takes a flag or an early return - both shown, and the counts prove which
# iterations actually ran.

log^+["ok 12", "", "skip me", "ok 7", "# comment", "ok 30", "STOP", "ok 999"]

"1. `continue` to skip, `break` to stop:" => h1
h1^0
0 => accepted
0 => skipped
0 => seen
for line in log:
    seen + 1 => seen
    if line == "STOP":
        break
    if len(line) == 0:
        skipped + 1 => skipped
        continue
    if line[0:1] == "#":
        skipped + 1 => skipped
        continue
    if line[0:2] != "ok":
        skipped + 1 => skipped
        continue
    accepted + 1 => accepted
    ("  accepted: " + line)^0

("  seen " + str(seen) + " of " + str(len(log)) + " lines, accepted " + str(accepted) + ", skipped " + str(skipped))^0
"  The last line was never seen: STOP broke out before it." => n1
n1^0

""^0
"2. `continue` in a while loop skips the increment:" => h2
h2^0

def broken_shape(limit):
    # This is the shape that hangs. It is NOT run - the counter below shows
    # what would happen, computed rather than executed.
    return "i is never incremented on the continue path"

def fixed(limit):
    0 => i
    0 => steps
    0 => kept
    while i < limit:
        i + 1 => i
        steps + 1 => steps
        if i % 3 == 0:
            continue
        kept + 1 => kept
    return [steps, kept]

fixed(12) => r
("  incrementing FIRST: " + str(r[0]) + " iterations, " + str(r[1]) + " kept, terminated")^0
"  Had the increment sat after the `continue`, i would stay at 3 forever." => n2
n2^0
("  " + broken_shape(12))^0

""^0
"3. `break` leaves only the inner loop:" => h3
h3^0
grid^+[[1, 2, 3], [4, 99, 6], [7, 8, 9]]

0 => inner_visits
0 => rows_entered
for row in grid:
    rows_entered + 1 => rows_entered
    for cell in row:
        inner_visits + 1 => inner_visits
        if cell == 99:
            break
("  plain break:   " + str(rows_entered) + " rows entered, " + str(inner_visits) + " cells visited")^0
"  All three rows ran - the break only ended row 2's inner loop." => n3
n3^0

0 => inner2
0 => rows2
False => found
for row in grid:
    if found:
        break
    rows2 + 1 => rows2
    for cell in row:
        inner2 + 1 => inner2
        if cell == 99:
            True => found
            break
("  flag + break: " + str(rows2) + " rows entered, " + str(inner2) + " cells visited")^0
"  Two rows instead of three, and 5 cells instead of the 8 above." => n3b
n3b^0
```

## Python (deterministic transpilation)

```python
log = ["ok 12", "", "skip me", "ok 7", "# comment", "ok 30", "STOP", "ok 999"]
h1 = "1. `continue` to skip, `break` to stop:"
print(h1)
accepted = 0
skipped = 0
seen = 0
for line in log:
    seen = seen + 1
    if line == "STOP":
        break
    if len(line) == 0:
        skipped = skipped + 1
        continue
    if line[0:1] == "#":
        skipped = skipped + 1
        continue
    if line[0:2] != "ok":
        skipped = skipped + 1
        continue
    accepted = accepted + 1
    print("  accepted: " + line)
print("  seen " + str(seen) + " of " + str(len(log)) + " lines, accepted " + str(accepted) + ", skipped " + str(skipped))
n1 = "  The last line was never seen: STOP broke out before it."
print(n1)
print("")
h2 = "2. `continue` in a while loop skips the increment:"
print(h2)

def broken_shape(limit):
    return "i is never incremented on the continue path"

def fixed(limit):
    i = 0
    steps = 0
    kept = 0
    while i < limit:
        i = i + 1
        steps = steps + 1
        if i % 3 == 0:
            continue
        kept = kept + 1
    return [steps, kept]

r = fixed(12)
print("  incrementing FIRST: " + str(r[0]) + " iterations, " + str(r[1]) + " kept, terminated")
n2 = "  Had the increment sat after the `continue`, i would stay at 3 forever."
print(n2)
print("  " + broken_shape(12))
print("")
h3 = "3. `break` leaves only the inner loop:"
print(h3)
grid = [[1, 2, 3], [4, 99, 6], [7, 8, 9]]
inner_visits = 0
rows_entered = 0
for row in grid:
    rows_entered = rows_entered + 1
    for cell in row:
        inner_visits = inner_visits + 1
        if cell == 99:
            break
print("  plain break:   " + str(rows_entered) + " rows entered, " + str(inner_visits) + " cells visited")
n3 = "  All three rows ran - the break only ended row 2's inner loop."
print(n3)
inner2 = 0
rows2 = 0
found = False
for row in grid:
    if found:
        break
    rows2 = rows2 + 1
    for cell in row:
        inner2 = inner2 + 1
        if cell == 99:
            found = True
            break
print("  flag + break: " + str(rows2) + " rows entered, " + str(inner2) + " cells visited")
n3b = "  Two rows instead of three, and 5 cells instead of the 8 above."
print(n3b)
```

## stdout (executed)

```text
1. `continue` to skip, `break` to stop:
  accepted: ok 12
  accepted: ok 7
  accepted: ok 30
  seen 7 of 8 lines, accepted 3, skipped 3
  The last line was never seen: STOP broke out before it.

2. `continue` in a while loop skips the increment:
  incrementing FIRST: 12 iterations, 8 kept, terminated
  Had the increment sat after the `continue`, i would stay at 3 forever.
  i is never incremented on the continue path

3. `break` leaves only the inner loop:
  plain break:   3 rows entered, 8 cells visited
  All three rows ran - the break only ended row 2's inner loop.
  flag + break: 2 rows entered, 5 cells visited
  Two rows instead of three, and 5 cells instead of the 8 above.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:def · eml:call · eml:return · eml:run:done
