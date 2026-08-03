<!-- canonical: efficientnewlanguage.org/ai/examples/225-partial-parse-accepted | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 225 — The parser that reads as far as it understands

`partial_parse_accepted.eml` compares two parsers for the same grammar, differing by one check: whether the whole input was consumed.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A parser that
# reads as much as it understands and says nothing about the rest.
#
# Every hand-written parser has to decide what to do when it stops. The two
# choices look almost identical in code:
#
#     return the value                       accepts a PREFIX
#     return the value if the input is done  accepts the whole input
#
# One extra check. Without it, "12abc" parses to 12, "1,2,3" as a single
# number parses to 1, and "true;DROP" parses to true. Every one of those is a
# successful parse returning a well-formed value, and the discarded tail is
# where the meaning was.
#
# This is not a hypothetical class of bug: it is how int("12abc") differs from
# a hand-rolled digit loop, how a config line "timeout=30s" becomes 30, and
# how an allow-list check on a prefix can be defeated by a suffix.
#
# Two parsers for the same tiny grammar - an integer, or a comma-separated
# list of integers - and the property that separates them:
#
#     parse(s) succeeds  =>  every character of s was consumed
#
# swept over generated inputs, with the count of characters silently dropped
# reported alongside, because "it parsed" is not the interesting number.

def is_digit(ch):
    return ch >= "0" and ch <= "9"

def parse_int_prefix(s):
    # Reads digits and stops. Returns [value, consumed].
    0 => i
    0 => v
    while i < len(s) and is_digit(s[i]):
        v * 10 + int(s[i]) => v
        i + 1 => i
    if i == 0:
        raise ValueError("expected a digit at position 0")
    return [v, i]

def parse_int_total(s):
    parse_int_prefix(s) => r
    if not (r[1] == len(s)):
        raise ValueError("trailing input at position " + str(r[1]) + ": " + s[r[1]:])
    return r[0]

def parse_list_prefix(s):
    # Comma-separated integers, stopping wherever it stops.
    [] => out
    0 => i
    while True:
        parse_int_prefix(s[i:]) => r
        out + [r[0]] => out
        i + r[1] => i
        if i < len(s) and s[i] == ",":
            i + 1 => i
        else:
            break
    return [out, i]

def parse_list_total(s):
    parse_list_prefix(s) => r
    if not (r[1] == len(s)):
        raise ValueError("trailing input at position " + str(r[1]) + ": " + s[r[1]:])
    return r[0]


["12", "12abc", "1,2,3", "1,2,3;rm", "007", "", "abc", "1,", "9999x"] => inputs

"input        prefix-int   total-int          prefix-list      total-list"^0
for s in inputs:
    "raise" => a
    try:
        str(parse_int_prefix(s)[0]) => a
    except ValueError as e:
        "raise" => a
    "raise" => b
    try:
        str(parse_int_total(s)) => b
    except ValueError as e:
        "raise" => b
    "raise" => c
    try:
        str(parse_list_prefix(s)[0]) => c
    except ValueError as e:
        "raise" => c
    "raise" => d
    try:
        str(parse_list_total(s)) => d
    except ValueError as e:
        "raise" => d
    ("%-12s %-12s %-18s %-16s %s" % ("'" + s + "'", a, b, c, d))^0

# ------------------------------------------------------ how much was dropped
0 => accepted_prefix
0 => accepted_total
0 => chars_dropped
[] => silent
for s in inputs:
    try:
        parse_int_prefix(s) => r
        accepted_prefix + 1 => accepted_prefix
        len(s) - r[1] => dropped
        chars_dropped + dropped => chars_dropped
        if dropped > 0:
            if len(silent) < 4:
                silent + ["'" + s + "' -> " + str(r[0]) + ", dropped '" + s[r[1]:] + "'"] => silent
    except ValueError as e:
        pass
    try:
        parse_int_total(s) => v
        accepted_total + 1 => accepted_total
    except ValueError as e:
        pass

""^0
("inputs:                       " + str(len(inputs)))^0
("  prefix parser accepted:     " + str(accepted_prefix))^0
("  total parser accepted:      " + str(accepted_total))^0
("  characters silently dropped:" + str(chars_dropped))^0
""^0
"what the prefix parser threw away:"^0
for w in silent:
    ("  " + w)^0

# -------------------------------------------------- generated sweep
# Every string of length 1..3 over digits and two separators. The property is
# checked as an implication, not as an equality of accept counts: a total
# parser may accept fewer inputs, and every input it accepts must be fully
# consumed.
"1,;" => alphabet
[] => generated
for a in alphabet:
    generated + [a] => generated
for a in alphabet:
    for b in alphabet:
        generated + [a + b] => generated
for a in alphabet:
    for b in alphabet:
        for c in alphabet:
            generated + [a + b + c] => generated

0 => n
0 => p_accept
0 => t_accept
0 => p_full
0 => t_full
for s in generated:
    n + 1 => n
    try:
        parse_list_prefix(s) => r
        p_accept + 1 => p_accept
        if r[1] == len(s):
            p_full + 1 => p_full
    except ValueError as e:
        pass
    try:
        parse_list_total(s) => v
        t_accept + 1 => t_accept
        t_full + 1 => t_full
    except ValueError as e:
        pass

""^0
("generated strings:            " + str(n))^0
("  prefix parser accepted:     " + str(p_accept) + ", of which fully consumed " + str(p_full))^0
("  total parser accepted:      " + str(t_accept) + ", of which fully consumed " + str(t_full))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Everything the total parser accepts was fully consumed. This is the property.
checked + 1 => checked
if t_accept == t_full:
    passed + 1 => passed

# The prefix parser must accept things it did not fully consume, or there is
# nothing being demonstrated.
checked + 1 => checked
if p_accept > p_full:
    passed + 1 => passed

# The total parser must be strictly more conservative, and not empty - a
# parser that refuses everything also never drops a character.
checked + 1 => checked
if t_accept < p_accept and t_accept > 0:
    passed + 1 => passed

# The two must AGREE on every input the total parser accepts. The extra check
# must reject, never change an answer.
checked + 1 => checked
0 => disagreements
for s in generated:
    try:
        parse_list_total(s) => tv
        parse_list_prefix(s) => pr
        if not (str(tv) == str(pr[0])):
            disagreements + 1 => disagreements
    except ValueError as e:
        pass
if disagreements == 0:
    passed + 1 => passed

# And the specific injection-shaped case must be refused rather than truncated.
checked + 1 => checked
0 => refused
try:
    parse_int_total("1,2,3;rm") => v
except ValueError as e:
    1 => refused
if refused == 1 and parse_int_prefix("1,2,3;rm")[0] == 1:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The extra check only ever rejects; it never changes an accepted answer." => verdict
else:
    "FAILED - a parser did not behave as the checks describe." => verdict
verdict^0

""^0
"The two parsers agree on every input both accept, which is why swapping one" => n1
n1^0
"for the other never shows up as a changed result in a test - it shows up as" => n2
n2^0
"inputs that used to work and now raise. That is the correct outcome and it" => n3
n3^0
"reads like a regression, which is the real reason the check gets left out." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def is_digit(ch):
    return ch >= "0" and ch <= "9"

def parse_int_prefix(s):
    i = 0
    v = 0
    while i < len(s) and is_digit(s[i]):
        v = v * 10 + int(s[i])
        i = i + 1
    if i == 0:
        raise ValueError("expected a digit at position 0")
    return [v, i]

def parse_int_total(s):
    r = parse_int_prefix(s)
    if not r[1] == len(s):
        raise ValueError("trailing input at position " + str(r[1]) + ": " + s[r[1]:])
    return r[0]

def parse_list_prefix(s):
    out = []
    i = 0
    while True:
        r = parse_int_prefix(s[i:])
        out = out + [r[0]]
        i = i + r[1]
        if i < len(s) and s[i] == ",":
            i = i + 1
        else:
            break
    return [out, i]

def parse_list_total(s):
    r = parse_list_prefix(s)
    if not r[1] == len(s):
        raise ValueError("trailing input at position " + str(r[1]) + ": " + s[r[1]:])
    return r[0]

inputs = ["12", "12abc", "1,2,3", "1,2,3;rm", "007", "", "abc", "1,", "9999x"]
print("input        prefix-int   total-int          prefix-list      total-list")
for s in inputs:
    a = "raise"
    try:
        a = str(parse_int_prefix(s)[0])
    except ValueError as e:
        a = "raise"
    b = "raise"
    try:
        b = str(parse_int_total(s))
    except ValueError as e:
        b = "raise"
    c = "raise"
    try:
        c = str(parse_list_prefix(s)[0])
    except ValueError as e:
        c = "raise"
    d = "raise"
    try:
        d = str(parse_list_total(s))
    except ValueError as e:
        d = "raise"
    print("%-12s %-12s %-18s %-16s %s" % ("'" + s + "'", a, b, c, d))
accepted_prefix = 0
accepted_total = 0
chars_dropped = 0
silent = []
for s in inputs:
    try:
        r = parse_int_prefix(s)
        accepted_prefix = accepted_prefix + 1
        dropped = len(s) - r[1]
        chars_dropped = chars_dropped + dropped
        if dropped > 0:
            if len(silent) < 4:
                silent = silent + ["'" + s + "' -> " + str(r[0]) + ", dropped '" + s[r[1]:] + "'"]
    except ValueError as e:
        pass
    try:
        v = parse_int_total(s)
        accepted_total = accepted_total + 1
    except ValueError as e:
        pass
print("")
print("inputs:                       " + str(len(inputs)))
print("  prefix parser accepted:     " + str(accepted_prefix))
print("  total parser accepted:      " + str(accepted_total))
print("  characters silently dropped:" + str(chars_dropped))
print("")
print("what the prefix parser threw away:")
for w in silent:
    print("  " + w)
alphabet = "1,;"
generated = []
for a in alphabet:
    generated = generated + [a]
for a in alphabet:
    for b in alphabet:
        generated = generated + [a + b]
for a in alphabet:
    for b in alphabet:
        for c in alphabet:
            generated = generated + [a + b + c]
n = 0
p_accept = 0
t_accept = 0
p_full = 0
t_full = 0
for s in generated:
    n = n + 1
    try:
        r = parse_list_prefix(s)
        p_accept = p_accept + 1
        if r[1] == len(s):
            p_full = p_full + 1
    except ValueError as e:
        pass
    try:
        v = parse_list_total(s)
        t_accept = t_accept + 1
        t_full = t_full + 1
    except ValueError as e:
        pass
print("")
print("generated strings:            " + str(n))
print("  prefix parser accepted:     " + str(p_accept) + ", of which fully consumed " + str(p_full))
print("  total parser accepted:      " + str(t_accept) + ", of which fully consumed " + str(t_full))
passed = 0
checked = 0
checked = checked + 1
if t_accept == t_full:
    passed = passed + 1
checked = checked + 1
if p_accept > p_full:
    passed = passed + 1
checked = checked + 1
if t_accept < p_accept and t_accept > 0:
    passed = passed + 1
checked = checked + 1
disagreements = 0
for s in generated:
    try:
        tv = parse_list_total(s)
        pr = parse_list_prefix(s)
        if not str(tv) == str(pr[0]):
            disagreements = disagreements + 1
    except ValueError as e:
        pass
if disagreements == 0:
    passed = passed + 1
checked = checked + 1
refused = 0
try:
    v = parse_int_total("1,2,3;rm")
except ValueError as e:
    refused = 1
if refused == 1 and parse_int_prefix("1,2,3;rm")[0] == 1:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The extra check only ever rejects; it never changes an accepted answer."
else:
    verdict = "FAILED - a parser did not behave as the checks describe."
print(verdict)
print("")
n1 = "The two parsers agree on every input both accept, which is why swapping one"
print(n1)
n2 = "for the other never shows up as a changed result in a test - it shows up as"
print(n2)
n3 = "inputs that used to work and now raise. That is the correct outcome and it"
print(n3)
n4 = "reads like a regression, which is the real reason the check gets left out."
print(n4)
```

## stdout (executed)

```text
input        prefix-int   total-int          prefix-list      total-list
'12'         12           12                 [12]             [12]
'12abc'      12           raise              [12]             raise
'1,2,3'      1            raise              [1, 2, 3]        [1, 2, 3]
'1,2,3;rm'   1            raise              [1, 2, 3]        raise
'007'        7            7                  [7]              [7]
''           raise        raise              raise            raise
'abc'        raise        raise              raise            raise
'1,'         1            raise              raise            raise
'9999x'      9999         raise              [9999]           raise

inputs:                       9
  prefix parser accepted:     7
  total parser accepted:      2
  characters silently dropped:16

what the prefix parser threw away:
  '12abc' -> 12, dropped 'abc'
  '1,2,3' -> 1, dropped ',2,3'
  '1,2,3;rm' -> 1, dropped ',2,3;rm'
  '1,' -> 1, dropped ','

generated strings:            39
  prefix parser accepted:     9, of which fully consumed 4
  total parser accepted:      4, of which fully consumed 4

checks passed: 5/5
The extra check only ever rejects; it never changes an accepted answer.

The two parsers agree on every input both accept, which is why swapping one
for the other never shows up as a changed result in a test - it shows up as
inputs that used to work and now raise. That is the correct outcome and it
reads like a regression, which is the real reason the check gets left out.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
