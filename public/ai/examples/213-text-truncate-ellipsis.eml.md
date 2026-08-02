<!-- canonical: efficientnewlanguage.org/ai/examples/213-text-truncate-ellipsis | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 213 — Truncating with an ellipsis: three silent bugs in one line

`text_truncate_ellipsis.eml` truncates text to a column budget, and shows what the four-line version everyone writes actually does.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Truncating text
# to a column budget with an ellipsis - four lines of code and the single most
# repeated off-by-one in user-facing software.
#
# The naive version is:
#
#     s[:width - 3] + "..."
#
# and it is wrong three ways at once, all of them silent because a slice never
# raises:
#
#   1. it truncates strings that already FIT, adding "..." to a short string
#   2. when width < 3 it slices with a negative stop, which wraps and quietly
#      cuts from the RIGHT end instead of erroring
#   3. when width is 0 or negative it produces "..." - three characters wider
#      than the budget it was given
#
# Every one of those produces a plausible-looking string. Nothing crashes,
# nothing logs, and the table just looks slightly wrong in a way people
# attribute to the terminal.
#
# The invariant a truncator must satisfy, and what this program checks over
# every width from 0 to 30 and every sample:
#
#     len(result) <= width          ALWAYS, with no exceptions
#     result == s                   whenever len(s) <= width
#     result starts with a prefix of s

def truncate(s, width):
    if width <= 0:
        return ""
    if len(s) <= width:
        return s
    if width <= 3:
        # No room for an ellipsis and a character too - dots only, clipped to
        # the budget. `"..."[:width]` uses the clamp deliberately.
        return "..."[:width]
    return s[:width - 3] + "..."

def naive_truncate(s, width):
    # The version this case exists to warn about. Kept so the program can
    # SHOW the difference rather than assert it in a comment.
    return s[:width - 3] + "..."

def is_prefix(short, long_s):
    if len(short) > len(long_s):
        return False
    return long_s[:len(short)] == short


[
    "",
    "ok",
    "exact",
    "a moderately long label",
    "supercalifragilisticexpialidocious",
] => samples

"truncate() at width 10:"^0
for s in samples:
    truncate(s, 10) => t
    ("  %-36s -> %-12s (%d chars)" % ('"' + s + '"', '"' + t + '"', len(t)))^0

""^0
"Where the naive version goes wrong:"^0
[["ok", 10], ["exact", 5], ["hello", 2], ["hello", 0]] => probes
for probe in probes:
    probe[0] => s
    probe[1] => w
    naive_truncate(s, w) => bad
    truncate(s, w) => good
    ("  %-10s w=%-3d naive=%-10s (%d chars)  correct=%-8s (%d chars)" % ('"' + s + '"', w, '"' + bad + '"', len(bad), '"' + good + '"', len(good)))^0

# ------------------------------------------------------------------- checks
""^0
"Checked over every width 0..30 and every sample:"^0
0 => within_budget
0 => identity_when_fits
0 => prefix_ok
0 => checked
0 => naive_violations

for s in samples:
    for w in [0:30]:
        checked + 1 => checked
        truncate(s, w) => t

        if len(t) <= w:
            within_budget + 1 => within_budget

        if len(s) <= w:
            if t == s:
                identity_when_fits + 1 => identity_when_fits
        else:
            identity_when_fits + 1 => identity_when_fits

        # The visible part must be a prefix of the input - EXCEPT when the
        # budget is too small for even one character, where the result is dots
        # only and is deliberately not a prefix of anything. Writing this rule
        # as "always a prefix" failed 7 of 155 cases, and the 7 were the rule
        # being wrong rather than the code.
        if len(t) >= 3 and t[len(t) - 3:] == "...":
            t[:len(t) - 3] => body
        else:
            t => body
        True => all_dots
        if len(body) == 0:
            False => all_dots
        for ch in body:
            if not (ch == "."):
                False => all_dots
        if is_prefix(body, s) or all_dots:
            prefix_ok + 1 => prefix_ok

        # count how often the naive version breaks the budget
        naive_truncate(s, w) => bad
        if len(bad) > w:
            naive_violations + 1 => naive_violations

("  cases checked:            " + str(checked))^0
("  never exceeds the budget: " + str(within_budget) + "/" + str(checked))^0
("  unchanged when it fits:   " + str(identity_when_fits) + "/" + str(checked))^0
("  visible part is a prefix: " + str(prefix_ok) + "/" + str(checked))^0
("  naive version over budget: " + str(naive_violations) + " times")^0

""^0
if within_budget == checked and identity_when_fits == checked and prefix_ok == checked and naive_violations > 0:
    "Budget held in every case; the naive version broke it repeatedly." => verdict
elif within_budget == checked and identity_when_fits == checked and prefix_ok == checked:
    "Budget held in every case." => verdict
else:
    "FAILED - a truncation exceeded its budget or corrupted the text." => verdict
verdict^0

""^0
"`s[:width - 3]` with width=2 becomes `s[:-1]`, which is a valid slice that" => n1
n1^0
"cuts one character off the END. It does not raise, it does not warn, and" => n2
n2^0
"the result is a string that looks like a truncation and is not one." => n3
n3^0
```

## Python (deterministic transpilation)

```python
def truncate(s, width):
    if width <= 0:
        return ""
    if len(s) <= width:
        return s
    if width <= 3:
        return "..."[:width]
    return s[:width - 3] + "..."

def naive_truncate(s, width):
    return s[:width - 3] + "..."

def is_prefix(short, long_s):
    if len(short) > len(long_s):
        return False
    return long_s[:len(short)] == short

samples = ["", "ok", "exact", "a moderately long label", "supercalifragilisticexpialidocious"]
print("truncate() at width 10:")
for s in samples:
    t = truncate(s, 10)
    print("  %-36s -> %-12s (%d chars)" % ("\"" + s + "\"", "\"" + t + "\"", len(t)))
print("")
print("Where the naive version goes wrong:")
probes = [["ok", 10], ["exact", 5], ["hello", 2], ["hello", 0]]
for probe in probes:
    s = probe[0]
    w = probe[1]
    bad = naive_truncate(s, w)
    good = truncate(s, w)
    print("  %-10s w=%-3d naive=%-10s (%d chars)  correct=%-8s (%d chars)" % ("\"" + s + "\"", w, "\"" + bad + "\"", len(bad), "\"" + good + "\"", len(good)))
print("")
print("Checked over every width 0..30 and every sample:")
within_budget = 0
identity_when_fits = 0
prefix_ok = 0
checked = 0
naive_violations = 0
for s in samples:
    for w in range(0, 31):
        checked = checked + 1
        t = truncate(s, w)
        if len(t) <= w:
            within_budget = within_budget + 1
        if len(s) <= w:
            if t == s:
                identity_when_fits = identity_when_fits + 1
        else:
            identity_when_fits = identity_when_fits + 1
        if len(t) >= 3 and t[len(t) - 3:] == "...":
            body = t[:len(t) - 3]
        else:
            body = t
        all_dots = True
        if len(body) == 0:
            all_dots = False
        for ch in body:
            if not ch == ".":
                all_dots = False
        if is_prefix(body, s) or all_dots:
            prefix_ok = prefix_ok + 1
        bad = naive_truncate(s, w)
        if len(bad) > w:
            naive_violations = naive_violations + 1
print("  cases checked:            " + str(checked))
print("  never exceeds the budget: " + str(within_budget) + "/" + str(checked))
print("  unchanged when it fits:   " + str(identity_when_fits) + "/" + str(checked))
print("  visible part is a prefix: " + str(prefix_ok) + "/" + str(checked))
print("  naive version over budget: " + str(naive_violations) + " times")
print("")
if within_budget == checked and identity_when_fits == checked and prefix_ok == checked and naive_violations > 0:
    verdict = "Budget held in every case; the naive version broke it repeatedly."
elif within_budget == checked and identity_when_fits == checked and prefix_ok == checked:
    verdict = "Budget held in every case."
else:
    verdict = "FAILED - a truncation exceeded its budget or corrupted the text."
print(verdict)
print("")
n1 = "`s[:width - 3]` with width=2 becomes `s[:-1]`, which is a valid slice that"
print(n1)
n2 = "cuts one character off the END. It does not raise, it does not warn, and"
print(n2)
n3 = "the result is a string that looks like a truncation and is not one."
print(n3)
```

## stdout (executed)

```text
truncate() at width 10:
  ""                                   -> ""           (0 chars)
  "ok"                                 -> "ok"         (2 chars)
  "exact"                              -> "exact"      (5 chars)
  "a moderately long label"            -> "a moder..." (10 chars)
  "supercalifragilisticexpialidocious" -> "superca..." (10 chars)

Where the naive version goes wrong:
  "ok"       w=10  naive="ok..."    (5 chars)  correct="ok"     (2 chars)
  "exact"    w=5   naive="ex..."    (5 chars)  correct="exact"  (5 chars)
  "hello"    w=2   naive="hell..."  (7 chars)  correct=".."     (2 chars)
  "hello"    w=0   naive="he..."    (5 chars)  correct=""       (0 chars)

Checked over every width 0..30 and every sample:
  cases checked:            155
  never exceeds the budget: 155/155
  unchanged when it fits:   155/155
  visible part is a prefix: 155/155
  naive version over budget: 15 times

Budget held in every case; the naive version broke it repeatedly.

`s[:width - 3]` with width=2 becomes `s[:-1]`, which is a valid slice that
cuts one character off the END. It does not raise, it does not warn, and
the result is a string that looks like a truncation and is not one.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
