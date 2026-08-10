<!-- canonical: efficientnewlanguage.org/ai/examples/331-returns-a-copy-second-caller-assumed-in-place | ai_layer_version: 0.1.0 | updated: 2026-08-10 -->

# Example 331 — Returns a copy, the second caller assumed in place — the call site is identical

`returns_a_copy_second_caller_assumed_in_place.eml` calls one cleaning helper two ways over the same input and reports what each caller ends up holding.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A helper that
# returns a cleaned copy, and a second caller that assumed it cleaned in place.
#
# The helper's signature does not say which it is. Its tests do not either -
# they check the RETURN VALUE, which is correct and which passes whether or not
# the argument was also modified. The only place the distinction is recorded is
# the call site, and the two call sites disagree.
#
# Caller A wrote `clean(rows) => rows` and gets clean data. Caller B wrote
# `clean(rows)` on a line of its own, the way you call something that works in
# place, and gets its original data - with no error, no warning, and a helper
# that ran and did its job.
#
# `=>` binds a name to a value, so both callers hold a real list either way.
# Nothing about the binding tells them whether the list they hold is the one
# the helper worked on. That question is not answerable from the call site,
# which is why it gets answered by habit.
#
# The measurement runs both call styles over the same input and reports what
# each caller ends up holding, plus whether the helper's own tests could have
# distinguished them.

def clean(rows):
    [] => out
    for r in rows:
        if r < 0:
            out + [0] => out
        else:
            out + [r] => out
    return out

def clean_in_place(rows):
    for i in [0:len(rows) - 1]:
        if rows[i] < 0:
            0 => rows[i]
    return rows

def negatives_left(rows):
    0 => n
    for r in rows:
        if r < 0:
            n + 1 => n
    return n

[4, 0 - 2, 7, 0 - 9, 1] => source

# caller A: uses the return value
[4, 0 - 2, 7, 0 - 9, 1] => a_rows
clean(a_rows) => a_rows

# caller B: calls it the way you call something that works in place
[4, 0 - 2, 7, 0 - 9, 1] => b_rows
clean(b_rows)

"the same helper, two call styles, same input" ^0
"  source                       : " + repr(source) ^0
"  caller A (uses return value) : " + repr(a_rows) + "  negatives left " + str(negatives_left(a_rows)) ^0
"  caller B (assumed in place)  : " + repr(b_rows) + "  negatives left " + str(negatives_left(b_rows)) ^0
"" ^0

# ---- the helper's own tests ----

"the helper's own fixtures, which check the return value" ^0
[[[0 - 1], [0]], [[3], [3]], [[0 - 5, 2], [0, 2]], [[], []]] => fixtures
0 => failing
for f in fixtures:
    clean(f[0]) => got
    if repr(got) != repr(f[1]):
        failing + 1 => failing
"  fixtures failing: " + str(failing) + " of " + str(len(fixtures)) ^0
"" ^0

"could those fixtures have caught caller B's mistake?" ^0
0 => fixtures_that_notice
for f in fixtures:
    [] => arg
    for v in f[0]:
        arg + [v] => arg
    clean(arg)
    if repr(arg) != repr(f[0]):
        fixtures_that_notice + 1 => fixtures_that_notice
"  fixtures whose ARGUMENT changed after the call: " + str(fixtures_that_notice) + " of " + str(len(fixtures)) ^0
"  a return-value test cannot see the difference, because there is none to see" ^0
"" ^0

# ---- the in-place version, for contrast ----

[4, 0 - 2, 7, 0 - 9, 1] => c_rows
clean_in_place(c_rows)
"an in-place helper called the same way caller B called the copying one" ^0
"  after clean_in_place(c_rows) : " + repr(c_rows) + "  negatives left " + str(negatives_left(c_rows)) ^0
"" ^0
"Both helpers pass a return-value test. Both are called with one line. Only" ^0
"one of them leaves the caller's data clean, and the call site is identical." ^0
```

## Python (deterministic transpilation)

```python
def clean(rows):
    out = []
    for r in rows:
        if r < 0:
            out = out + [0]
        else:
            out = out + [r]
    return out

def clean_in_place(rows):
    for i in range(0, len(rows)):
        if rows[i] < 0:
            rows[i] = 0
    return rows

def negatives_left(rows):
    n = 0
    for r in rows:
        if r < 0:
            n = n + 1
    return n

source = [4, 0 - 2, 7, 0 - 9, 1]
a_rows = [4, 0 - 2, 7, 0 - 9, 1]
a_rows = clean(a_rows)
b_rows = [4, 0 - 2, 7, 0 - 9, 1]
clean(b_rows)
print("the same helper, two call styles, same input")
print("  source                       : " + repr(source))
print("  caller A (uses return value) : " + repr(a_rows) + "  negatives left " + str(negatives_left(a_rows)))
print("  caller B (assumed in place)  : " + repr(b_rows) + "  negatives left " + str(negatives_left(b_rows)))
print("")
print("the helper's own fixtures, which check the return value")
fixtures = [[[0 - 1], [0]], [[3], [3]], [[0 - 5, 2], [0, 2]], [[], []]]
failing = 0
for f in fixtures:
    got = clean(f[0])
    if repr(got) != repr(f[1]):
        failing = failing + 1
print("  fixtures failing: " + str(failing) + " of " + str(len(fixtures)))
print("")
print("could those fixtures have caught caller B's mistake?")
fixtures_that_notice = 0
for f in fixtures:
    arg = []
    for v in f[0]:
        arg = arg + [v]
    clean(arg)
    if repr(arg) != repr(f[0]):
        fixtures_that_notice = fixtures_that_notice + 1
print("  fixtures whose ARGUMENT changed after the call: " + str(fixtures_that_notice) + " of " + str(len(fixtures)))
print("  a return-value test cannot see the difference, because there is none to see")
print("")
c_rows = [4, 0 - 2, 7, 0 - 9, 1]
clean_in_place(c_rows)
print("an in-place helper called the same way caller B called the copying one")
print("  after clean_in_place(c_rows) : " + repr(c_rows) + "  negatives left " + str(negatives_left(c_rows)))
print("")
print("Both helpers pass a return-value test. Both are called with one line. Only")
print("one of them leaves the caller's data clean, and the call site is identical.")
```

## stdout (executed)

```text
the same helper, two call styles, same input
  source                       : [4, -2, 7, -9, 1]
  caller A (uses return value) : [4, 0, 7, 0, 1]  negatives left 0
  caller B (assumed in place)  : [4, -2, 7, -9, 1]  negatives left 2

the helper's own fixtures, which check the return value
  fixtures failing: 0 of 4

could those fixtures have caught caller B's mistake?
  fixtures whose ARGUMENT changed after the call: 0 of 4
  a return-value test cannot see the difference, because there is none to see

an in-place helper called the same way caller B called the copying one
  after clean_in_place(c_rows) : [4, 0, 7, 0, 1]  negatives left 0

Both helpers pass a return-value test. Both are called with one line. Only
one of them leaves the caller's data clean, and the call site is identical.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
