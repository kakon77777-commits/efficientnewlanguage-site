<!-- canonical: efficientnewlanguage.org/ai/examples/245-whitespace-normalization-loss | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 245 — All three are idempotent; only one is lossless

`whitespace_normalization_loss.eml` compares trim, collapse and strip-all as normalizers, and checks the property each actually needs.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Trimming input,
# which is almost always right.
#
# Normalizing whitespace is the first thing every input handler does, and it
# is correct so often that the exceptions are never enumerated:
#
#     "  alice  "  ->  "alice"          right - the spaces were typing
#     "a  b"       ->  "a b"            usually right - collapsing runs
#     "  "         ->  ""               right, and now it is also EMPTY
#     " -- "       ->  "--"             wrong if the field is a fixed-width
#                                       column and the spaces were the data
#
# Three levels, increasingly aggressive, each correct for a different class of
# field:
#
#     trim       remove leading and trailing whitespace
#     collapse   trim, and reduce internal runs to one space
#     strip-all  remove every space, which is what a "normalize phone number"
#                or "compare ignoring spacing" routine does
#
# The measurement is the property a normalizer needs if it is used as a KEY:
# it must be idempotent, and it must not merge values that a person would
# call different. Both are checked over a generated set, and the two questions
# have different answers - `strip-all` is perfectly idempotent and merges
# things that are not the same.
#
# The distinction that carries the case: trimming is a lossless repair for
# accidental whitespace and a lossy transform for meaningful whitespace, and
# nothing in the string says which it is.

def is_space(ch):
    return ch == " " or ch == "\t"

def trim(s):
    0 => i
    while i < len(s) and is_space(s[i]):
        i + 1 => i
    len(s) => j
    while j > i and is_space(s[j - 1]):
        j - 1 => j
    return s[i:j]

def collapse(s):
    trim(s) => t
    "" => out
    0 => prev_space
    for ch in t:
        if is_space(ch):
            if prev_space == 0:
                out + " " => out
            1 => prev_space
        else:
            out + ch => out
            0 => prev_space
    return out

def strip_all(s):
    "" => out
    for ch in s:
        if not is_space(ch):
            out + ch => out
    return out

def apply(which, s):
    if which == "trim":
        return trim(s)
    elif which == "collapse":
        return collapse(s)
    return strip_all(s)


["  alice  ", "a  b", "  ", "", "a b", "ab", " -- ", "1 800 555", "1800555", "\ta\t"] => samples

"input           trim            collapse        strip-all"^0
for s in samples:
    ("%-15s %-15s %-15s %s" % ("'" + s + "'", "'" + trim(s) + "'", "'" + collapse(s) + "'", "'" + strip_all(s) + "'"))^0

# ------------------------------------------------------------- idempotence
# f(f(x)) == f(x). A normalizer used as a key must settle on the first pass,
# or two writes of the same value produce two keys.
0 => n
{} => idem
for which in ["trim", "collapse", "strip"]:
    0 => idem[which]
for s in samples:
    n + 1 => n
    for which in ["trim", "collapse", "strip"]:
        apply(which, s) => once
        if apply(which, once) == once:
            idem[which] + 1 => idem[which]

""^0
("samples:                 " + str(n))^0
for which in ["trim", "collapse", "strip"]:
    ("  " + which + " idempotent:      " + str(idem[which]) + "/" + str(n))^0

# ------------------------------------------------------ what each one merges
# Distinct inputs that normalize to one value. Some of those merges are the
# point; others are data loss. The count is the same either way, which is why
# the number alone cannot tell you whether the normalizer is safe.
{} => classes
for which in ["trim", "collapse", "strip"]:
    {} => seen
    for s in samples:
        apply(which, s) => k
        if k in seen:
            seen[k] + 1 => seen[k]
        else:
            1 => seen[k]
    len(seen) => classes[which]

""^0
("distinct values after normalizing (" + str(len(samples)) + " inputs):")^0
for which in ["trim", "collapse", "strip"]:
    ("  " + which + ": " + str(classes[which]))^0

""^0
"pairs that strip-all merges and trim does not:"^0
0 => strip_only_merges
for i in [0:len(samples) - 1]:
    for j in [0:len(samples) - 1]:
        if i < j:
            if strip_all(samples[i]) == strip_all(samples[j]):
                if not (trim(samples[i]) == trim(samples[j])):
                    strip_only_merges + 1 => strip_only_merges
                    if strip_only_merges <= 3:
                        ("  '" + samples[i] + "' and '" + samples[j] + "' -> '" + strip_all(samples[i]) + "'")^0

# ------------------------------------------------- whitespace-only input
# The case that turns a normalizer into a validator by accident. "  " is not
# empty and trim("  ") is - so a required-field check placed AFTER trimming
# rejects it and one placed BEFORE accepts it, and the two orderings are both
# common.
""^0
"a field containing only spaces:"^0
("  raw length:            " + str(len("  ")))^0
("  after trim:            " + str(len(trim("  "))))^0
("  present before trim:   " + str(len("  ") > 0))^0
("  present after trim:    " + str(len(trim("  ")) > 0))^0
"...same input, opposite verdicts, decided by where the trim happens."^0

# ------------------------------------------- when trimming is data loss
# A fixed-width record: the field boundaries ARE the spaces.
"alice     30  london    " => record
""^0
"a fixed-width record, trimmed as a whole:"^0
("  raw:     '" + record + "'  length " + str(len(record)))^0
("  trimmed: '" + trim(record) + "'  length " + str(len(trim(record))))^0
0 => fields_ok
if len(record) >= 24:
    trim(record[0:10]) => f1
    trim(record[10:14]) => f2
    trim(record[14:24]) => f3
    ("  fields from the RAW record: '" + f1 + "' '" + f2 + "' '" + f3 + "'")^0
    if f1 == "alice" and f2 == "30" and f3 == "london":
        1 => fields_ok
trim(record) => trimmed_record
0 => fields_from_trimmed_ok
if len(trimmed_record) >= 24:
    1 => fields_from_trimmed_ok
("  the trimmed record is " + str(len(trimmed_record)) + " chars, so the column offsets no longer land.")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# All three must be idempotent - that is the easy property, and it is the one
# people check.
checked + 1 => checked
if idem["trim"] == n and idem["collapse"] == n and idem["strip"] == n:
    passed + 1 => passed

# Aggressiveness must be ordered: strip-all merges at least as much as
# collapse, which merges at least as much as trim.
checked + 1 => checked
if classes["strip"] <= classes["collapse"] and classes["collapse"] <= classes["trim"]:
    passed + 1 => passed

# strip-all must merge something trim keeps apart, or the ordering above is
# vacuous.
checked + 1 => checked
if strip_only_merges > 0:
    passed + 1 => passed

# A whitespace-only field must flip its presence verdict across the trim.
checked + 1 => checked
if len("  ") > 0 and len(trim("  ")) == 0:
    passed + 1 => passed

# The fixed-width record must parse correctly from the raw string and must
# NOT survive being trimmed first.
checked + 1 => checked
if fields_ok == 1 and fields_from_trimmed_ok == 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "All three normalizers are idempotent, and only one of them is lossless." => verdict
else:
    "FAILED - a normalizer did not behave as the checks describe." => verdict
verdict^0

""^0
"Idempotence is the property that gets checked and it is not the property" => n1
n1^0
"that matters here - strip-all is perfectly idempotent and merges a phone" => n2
n2^0
"number with a different phone number. What decides whether a normalizer is" => n3
n3^0
"safe is whether the whitespace was accidental, and that is a fact about the" => n4
n4^0
"field, held by the person who designed it, not by the string." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def is_space(ch):
    return ch == " " or ch == "\t"

def trim(s):
    i = 0
    while i < len(s) and is_space(s[i]):
        i = i + 1
    j = len(s)
    while j > i and is_space(s[j - 1]):
        j = j - 1
    return s[i:j]

def collapse(s):
    t = trim(s)
    out = ""
    prev_space = 0
    for ch in t:
        if is_space(ch):
            if prev_space == 0:
                out = out + " "
            prev_space = 1
        else:
            out = out + ch
            prev_space = 0
    return out

def strip_all(s):
    out = ""
    for ch in s:
        if not is_space(ch):
            out = out + ch
    return out

def apply(which, s):
    if which == "trim":
        return trim(s)
    elif which == "collapse":
        return collapse(s)
    return strip_all(s)

samples = ["  alice  ", "a  b", "  ", "", "a b", "ab", " -- ", "1 800 555", "1800555", "\ta\t"]
print("input           trim            collapse        strip-all")
for s in samples:
    print("%-15s %-15s %-15s %s" % ("'" + s + "'", "'" + trim(s) + "'", "'" + collapse(s) + "'", "'" + strip_all(s) + "'"))
n = 0
idem = {}
for which in ["trim", "collapse", "strip"]:
    idem[which] = 0
for s in samples:
    n = n + 1
    for which in ["trim", "collapse", "strip"]:
        once = apply(which, s)
        if apply(which, once) == once:
            idem[which] = idem[which] + 1
print("")
print("samples:                 " + str(n))
for which in ["trim", "collapse", "strip"]:
    print("  " + which + " idempotent:      " + str(idem[which]) + "/" + str(n))
classes = {}
for which in ["trim", "collapse", "strip"]:
    seen = {}
    for s in samples:
        k = apply(which, s)
        if k in seen:
            seen[k] = seen[k] + 1
        else:
            seen[k] = 1
    classes[which] = len(seen)
print("")
print("distinct values after normalizing (" + str(len(samples)) + " inputs):")
for which in ["trim", "collapse", "strip"]:
    print("  " + which + ": " + str(classes[which]))
print("")
print("pairs that strip-all merges and trim does not:")
strip_only_merges = 0
for i in range(0, len(samples)):
    for j in range(0, len(samples)):
        if i < j:
            if strip_all(samples[i]) == strip_all(samples[j]):
                if not trim(samples[i]) == trim(samples[j]):
                    strip_only_merges = strip_only_merges + 1
                    if strip_only_merges <= 3:
                        print("  '" + samples[i] + "' and '" + samples[j] + "' -> '" + strip_all(samples[i]) + "'")
print("")
print("a field containing only spaces:")
print("  raw length:            " + str(len("  ")))
print("  after trim:            " + str(len(trim("  "))))
print("  present before trim:   " + str(len("  ") > 0))
print("  present after trim:    " + str(len(trim("  ")) > 0))
print("...same input, opposite verdicts, decided by where the trim happens.")
record = "alice     30  london    "
print("")
print("a fixed-width record, trimmed as a whole:")
print("  raw:     '" + record + "'  length " + str(len(record)))
print("  trimmed: '" + trim(record) + "'  length " + str(len(trim(record))))
fields_ok = 0
if len(record) >= 24:
    f1 = trim(record[0:10])
    f2 = trim(record[10:14])
    f3 = trim(record[14:24])
    print("  fields from the RAW record: '" + f1 + "' '" + f2 + "' '" + f3 + "'")
    if f1 == "alice" and f2 == "30" and f3 == "london":
        fields_ok = 1
trimmed_record = trim(record)
fields_from_trimmed_ok = 0
if len(trimmed_record) >= 24:
    fields_from_trimmed_ok = 1
print("  the trimmed record is " + str(len(trimmed_record)) + " chars, so the column offsets no longer land.")
passed = 0
checked = 0
checked = checked + 1
if idem["trim"] == n and idem["collapse"] == n and idem["strip"] == n:
    passed = passed + 1
checked = checked + 1
if classes["strip"] <= classes["collapse"] and classes["collapse"] <= classes["trim"]:
    passed = passed + 1
checked = checked + 1
if strip_only_merges > 0:
    passed = passed + 1
checked = checked + 1
if len("  ") > 0 and len(trim("  ")) == 0:
    passed = passed + 1
checked = checked + 1
if fields_ok == 1 and fields_from_trimmed_ok == 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "All three normalizers are idempotent, and only one of them is lossless."
else:
    verdict = "FAILED - a normalizer did not behave as the checks describe."
print(verdict)
print("")
n1 = "Idempotence is the property that gets checked and it is not the property"
print(n1)
n2 = "that matters here - strip-all is perfectly idempotent and merges a phone"
print(n2)
n3 = "number with a different phone number. What decides whether a normalizer is"
print(n3)
n4 = "safe is whether the whitespace was accidental, and that is a fact about the"
print(n4)
n5 = "field, held by the person who designed it, not by the string."
print(n5)
```

## stdout (executed)

```text
input           trim            collapse        strip-all
'  alice  '     'alice'         'alice'         'alice'
'a  b'          'a  b'          'a b'           'ab'
'  '            ''              ''              ''
''              ''              ''              ''
'a b'           'a b'           'a b'           'ab'
'ab'            'ab'            'ab'            'ab'
' -- '          '--'            '--'            '--'
'1 800 555'     '1 800 555'     '1 800 555'     '1800555'
'1800555'       '1800555'       '1800555'       '1800555'
'	a	'           'a'             'a'             'a'

samples:                 10
  trim idempotent:      10/10
  collapse idempotent:      10/10
  strip idempotent:      10/10

distinct values after normalizing (10 inputs):
  trim: 9
  collapse: 8
  strip: 6

pairs that strip-all merges and trim does not:
  'a  b' and 'a b' -> 'ab'
  'a  b' and 'ab' -> 'ab'
  'a b' and 'ab' -> 'ab'

a field containing only spaces:
  raw length:            2
  after trim:            0
  present before trim:   True
  present after trim:    False
...same input, opposite verdicts, decided by where the trim happens.

a fixed-width record, trimmed as a whole:
  raw:     'alice     30  london    '  length 24
  trimmed: 'alice     30  london'  length 20
  fields from the RAW record: 'alice' '30' 'london'
  the trimmed record is 20 chars, so the column offsets no longer land.

checks passed: 5/5
All three normalizers are idempotent, and only one of them is lossless.

Idempotence is the property that gets checked and it is not the property
that matters here - strip-all is perfectly idempotent and merges a phone
number with a different phone number. What decides whether a normalizer is
safe is whether the whitespace was accidental, and that is a fact about the
field, held by the person who designed it, not by the string.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
