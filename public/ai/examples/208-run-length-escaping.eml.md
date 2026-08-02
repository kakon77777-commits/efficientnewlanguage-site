<!-- canonical: efficientnewlanguage.org/ai/examples/208-run-length-escaping | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 208 — The fix that feels right and makes it worse

`run_length_escaping.eml` implements run-length encoding three ways, and the point is that the middle one - the obvious fix - is worse than the bug it was meant to repair.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Run-length
# encoding, and the ambiguity that every naive RLE has - including the fix
# that feels like it works and does not.
#
# The naive encoder writes a character followed by its count:
#
#     "aaabbc"  ->  "a3b2c1"
#
# and it is unambiguous right up until the input contains a digit:
#
#     "a3"      ->  "a1" + "31"  ->  "a131"
#     "a131"    decodes to "a" x 1, then "3" x 1, then "1"  ->  "a31"   WRONG
#
# The data got shorter and the decoder returned something plausible. That is
# the whole failure: RLE has no error state, so a broken codec does not raise,
# it silently returns different text.
#
# The obvious fix is to put the count FIRST - "3a2b1c" - on the theory that
# the parser then always knows where it is. That was this program's own first
# premise, and it is wrong, which is why it is still here:
#
#     "a3"  ->  "1a" + "13"  ->  "1a13"
#     decoding: count 1, character 'a'; then count 13, and the string ends
#
# Moving the count does not remove the ambiguity, it moves it - a digit in the
# data still runs together with the next count. A format needs an explicit
# boundary, not a convention:
#
#     delimited   "3:a2:b1:c" - the character is always exactly one position
#                 after the ':', so it can be a digit, a colon, anything
#
# The property that decides which of the three is a codec at all:
#
#     decode(encode(s)) == s     for EVERY s, including ones full of digits
#
# checked over 92 generated strings, not the eight in the demo. The result is
# worth stating up front: count-first round-trips fewer of them than the naive
# form does. The intuitive fix made things worse.

def encode_naive(s):
    "" => out
    0 => i
    while i < len(s):
        s[i] => ch
        1 => run
        while i + run < len(s) and s[i + run] == ch:
            run + 1 => run
        out + ch + str(run) => out
        i + run => i
    return out

def decode_naive(s):
    "" => out
    0 => i
    while i < len(s):
        s[i] => ch
        i + 1 => i
        "" => digits
        while i < len(s) and s[i] >= "0" and s[i] <= "9":
            digits + s[i] => digits
            i + 1 => i
        1 => n
        if len(digits) > 0:
            int(digits) => n
        out + ch * n => out
    return out

def encode_count_first(s):
    "" => out
    0 => i
    while i < len(s):
        s[i] => ch
        1 => run
        while i + run < len(s) and s[i + run] == ch:
            run + 1 => run
        out + str(run) + ch => out
        i + run => i
    return out

def decode_count_first(s):
    "" => out
    0 => i
    while i < len(s):
        "" => digits
        while i < len(s) and s[i] >= "0" and s[i] <= "9":
            digits + s[i] => digits
            i + 1 => i
        if len(digits) == 0:
            raise ValueError("expected a count at position " + str(i))
        if i >= len(s):
            raise ValueError("count with no character at position " + str(i))
        out + s[i] * int(digits) => out
        i + 1 => i
    return out

def encode_delimited(s):
    # count, separator, then exactly one character. Whatever follows the ':'
    # is data - digit, colon, anything.
    "" => out
    0 => i
    while i < len(s):
        s[i] => ch
        1 => run
        while i + run < len(s) and s[i + run] == ch:
            run + 1 => run
        out + str(run) + ":" + ch => out
        i + run => i
    return out

def decode_delimited(s):
    "" => out
    0 => i
    while i < len(s):
        "" => digits
        while i < len(s) and s[i] >= "0" and s[i] <= "9":
            digits + s[i] => digits
            i + 1 => i
        if len(digits) == 0:
            raise ValueError("expected a count at position " + str(i))
        if i >= len(s) or not (s[i] == ":"):
            raise ValueError("expected a separator after the count at position " + str(i))
        i + 1 => i
        if i >= len(s):
            raise ValueError("count and separator with no character")
        out + s[i] * int(digits) => out
        i + 1 => i
    return out


def brief(s):
    if len(s) <= 12:
        return s
    return s[:9] + "...(" + str(len(s)) + ")"

# "a13" rather than "a131": the naive decode of the latter is 1,113,111
# characters, which is the same failure at a size that makes the recorded
# execution trace unusable. The corruption is the point, not its magnitude.
["aaabbc", "", "x", "aaaaaaaaaaaa", "a3", "a13", "112233", "9"] => samples

"input          naive     back        cnt-first back        delimited     back"^0
0 => naive_ok
0 => cf_ok
0 => del_ok
for s in samples:
    encode_naive(s) => n_enc
    decode_naive(n_enc) => n_dec
    if n_dec == s:
        naive_ok + 1 => naive_ok

    encode_count_first(s) => c_enc
    "<raised>" => c_dec
    try:
        decode_count_first(c_enc) => c_dec
    except ValueError as e:
        "<raised>" => c_dec
    if c_dec == s:
        cf_ok + 1 => cf_ok

    encode_delimited(s) => d_enc
    decode_delimited(d_enc) => d_dec
    if d_dec == s:
        del_ok + 1 => del_ok

    # The naive decode of "a131" is 1,113,111 characters of 'a' - the
    # corruption is not subtle. Printing it whole would bury the table and
    # inflate the execution trace by megabytes, so the DISPLAY is capped.
    # The comparisons above use the full strings.
    ("%-14s %-9s %-11s %-9s %-11s %-13s %s" % (s, n_enc, brief(n_dec), c_enc, brief(c_dec), d_enc, brief(d_dec)))^0

# --------------------------------------------- round trip over many inputs
# A small alphabet that deliberately mixes letters and digits, since digits
# are the entire problem.
"ab19" => alphabet
[] => generated
for a in [0:3]:
    for b in [0:3]:
        for c in [0:3]:
            generated + [alphabet[a] + alphabet[b] + alphabet[c]] => generated
# plus pure runs, which is what RLE is actually for
for a in [0:3]:
    for n in [1:8]:
        generated + [alphabet[a] * n] => generated

0 => gen_naive_ok
0 => gen_cf_ok
0 => gen_del_ok
for s in generated:
    if decode_naive(encode_naive(s)) == s:
        gen_naive_ok + 1 => gen_naive_ok
    try:
        if decode_count_first(encode_count_first(s)) == s:
            gen_cf_ok + 1 => gen_cf_ok
    except ValueError as e:
        pass
    if decode_delimited(encode_delimited(s)) == s:
        gen_del_ok + 1 => gen_del_ok

""^0
("demo samples:                    " + str(len(samples)))^0
("  naive round-tripped:           " + str(naive_ok) + "/" + str(len(samples)))^0
("  count-first round-tripped:     " + str(cf_ok) + "/" + str(len(samples)))^0
("  delimited round-tripped:       " + str(del_ok) + "/" + str(len(samples)))^0
""^0
("generated strings:               " + str(len(generated)))^0
("  naive round-tripped:           " + str(gen_naive_ok) + "/" + str(len(generated)))^0
("  count-first round-tripped:     " + str(gen_cf_ok) + "/" + str(len(generated)))^0
("  delimited round-tripped:       " + str(gen_del_ok) + "/" + str(len(generated)))^0

len(generated) - gen_naive_ok => naive_broken
len(generated) - gen_cf_ok => cf_broken
""^0
("strings the naive form corrupts:            " + str(naive_broken))^0
("strings count-first corrupts or rejects:    " + str(cf_broken))^0

# A malformed encoding must be refused, not decoded into something.
""^0
"Malformed delimited input:"^0
0 => refused
for bad in ["a", "3", "12", "3a"]:
    try:
        decode_delimited(bad) => v
        ("  " + bad + " -> " + v + "  (SHOULD HAVE RAISED)")^0
    except ValueError as e:
        refused + 1 => refused
        ("  %-4s -> %s" % (bad, str(e)))^0

""^0
if gen_del_ok == len(generated) and refused == 4 and naive_broken > 0 and cf_broken > 0:
    "Only the delimited codec round-trips everything. Both others break on digits." => verdict
else:
    "FAILED - a codec lost data or accepted malformed input." => verdict
verdict^0

""^0
"Moving the count to the front FEELS like it fixes the ambiguity and does" => n1
n1^0
"not - it only changes where two numbers run together. That was this file's" => n2
n2^0
"own first premise, and the round trip over generated strings is what" => n3
n3^0
"disproved it. A format needs an explicit boundary, not a convention." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def encode_naive(s):
    out = ""
    i = 0
    while i < len(s):
        ch = s[i]
        run = 1
        while i + run < len(s) and s[i + run] == ch:
            run = run + 1
        out = out + ch + str(run)
        i = i + run
    return out

def decode_naive(s):
    out = ""
    i = 0
    while i < len(s):
        ch = s[i]
        i = i + 1
        digits = ""
        while i < len(s) and s[i] >= "0" and s[i] <= "9":
            digits = digits + s[i]
            i = i + 1
        n = 1
        if len(digits) > 0:
            n = int(digits)
        out = out + ch * n
    return out

def encode_count_first(s):
    out = ""
    i = 0
    while i < len(s):
        ch = s[i]
        run = 1
        while i + run < len(s) and s[i + run] == ch:
            run = run + 1
        out = out + str(run) + ch
        i = i + run
    return out

def decode_count_first(s):
    out = ""
    i = 0
    while i < len(s):
        digits = ""
        while i < len(s) and s[i] >= "0" and s[i] <= "9":
            digits = digits + s[i]
            i = i + 1
        if len(digits) == 0:
            raise ValueError("expected a count at position " + str(i))
        if i >= len(s):
            raise ValueError("count with no character at position " + str(i))
        out = out + s[i] * int(digits)
        i = i + 1
    return out

def encode_delimited(s):
    out = ""
    i = 0
    while i < len(s):
        ch = s[i]
        run = 1
        while i + run < len(s) and s[i + run] == ch:
            run = run + 1
        out = out + str(run) + ":" + ch
        i = i + run
    return out

def decode_delimited(s):
    out = ""
    i = 0
    while i < len(s):
        digits = ""
        while i < len(s) and s[i] >= "0" and s[i] <= "9":
            digits = digits + s[i]
            i = i + 1
        if len(digits) == 0:
            raise ValueError("expected a count at position " + str(i))
        if i >= len(s) or not s[i] == ":":
            raise ValueError("expected a separator after the count at position " + str(i))
        i = i + 1
        if i >= len(s):
            raise ValueError("count and separator with no character")
        out = out + s[i] * int(digits)
        i = i + 1
    return out

def brief(s):
    if len(s) <= 12:
        return s
    return s[:9] + "...(" + str(len(s)) + ")"

samples = ["aaabbc", "", "x", "aaaaaaaaaaaa", "a3", "a13", "112233", "9"]
print("input          naive     back        cnt-first back        delimited     back")
naive_ok = 0
cf_ok = 0
del_ok = 0
for s in samples:
    n_enc = encode_naive(s)
    n_dec = decode_naive(n_enc)
    if n_dec == s:
        naive_ok = naive_ok + 1
    c_enc = encode_count_first(s)
    c_dec = "<raised>"
    try:
        c_dec = decode_count_first(c_enc)
    except ValueError as e:
        c_dec = "<raised>"
    if c_dec == s:
        cf_ok = cf_ok + 1
    d_enc = encode_delimited(s)
    d_dec = decode_delimited(d_enc)
    if d_dec == s:
        del_ok = del_ok + 1
    print("%-14s %-9s %-11s %-9s %-11s %-13s %s" % (s, n_enc, brief(n_dec), c_enc, brief(c_dec), d_enc, brief(d_dec)))
alphabet = "ab19"
generated = []
for a in range(0, 4):
    for b in range(0, 4):
        for c in range(0, 4):
            generated = generated + [alphabet[a] + alphabet[b] + alphabet[c]]
for a in range(0, 4):
    for n in range(1, 9):
        generated = generated + [alphabet[a] * n]
gen_naive_ok = 0
gen_cf_ok = 0
gen_del_ok = 0
for s in generated:
    if decode_naive(encode_naive(s)) == s:
        gen_naive_ok = gen_naive_ok + 1
    try:
        if decode_count_first(encode_count_first(s)) == s:
            gen_cf_ok = gen_cf_ok + 1
    except ValueError as e:
        pass
    if decode_delimited(encode_delimited(s)) == s:
        gen_del_ok = gen_del_ok + 1
print("")
print("demo samples:                    " + str(len(samples)))
print("  naive round-tripped:           " + str(naive_ok) + "/" + str(len(samples)))
print("  count-first round-tripped:     " + str(cf_ok) + "/" + str(len(samples)))
print("  delimited round-tripped:       " + str(del_ok) + "/" + str(len(samples)))
print("")
print("generated strings:               " + str(len(generated)))
print("  naive round-tripped:           " + str(gen_naive_ok) + "/" + str(len(generated)))
print("  count-first round-tripped:     " + str(gen_cf_ok) + "/" + str(len(generated)))
print("  delimited round-tripped:       " + str(gen_del_ok) + "/" + str(len(generated)))
naive_broken = len(generated) - gen_naive_ok
cf_broken = len(generated) - gen_cf_ok
print("")
print("strings the naive form corrupts:            " + str(naive_broken))
print("strings count-first corrupts or rejects:    " + str(cf_broken))
print("")
print("Malformed delimited input:")
refused = 0
for bad in ["a", "3", "12", "3a"]:
    try:
        v = decode_delimited(bad)
        print("  " + bad + " -> " + v + "  (SHOULD HAVE RAISED)")
    except ValueError as e:
        refused = refused + 1
        print("  %-4s -> %s" % (bad, str(e)))
print("")
if gen_del_ok == len(generated) and refused == 4 and naive_broken > 0 and cf_broken > 0:
    verdict = "Only the delimited codec round-trips everything. Both others break on digits."
else:
    verdict = "FAILED - a codec lost data or accepted malformed input."
print(verdict)
print("")
n1 = "Moving the count to the front FEELS like it fixes the ambiguity and does"
print(n1)
n2 = "not - it only changes where two numbers run together. That was this file's"
print(n2)
n3 = "own first premise, and the round trip over generated strings is what"
print(n3)
n4 = "disproved it. A format needs an explicit boundary, not a convention."
print(n4)
```

## stdout (executed)

```text
input          naive     back        cnt-first back        delimited     back
aaabbc         a3b2c1    aaabbc      3a2b1c    aaabbc      3:a2:b1:c     aaabbc
                                                                         
x              x1        x           1x        x           1:x           x
aaaaaaaaaaaa   a12       aaaaaaaaaaaa 12a       aaaaaaaaaaaa 12:a          aaaaaaaaaaaa
a3             a131      aaaaaaaaa...(131) 1a13      <raised>    1:a1:3        a3
a13            a11131    aaaaaaaaa...(11131) 1a1113    <raised>    1:a1:11:3     a13
112233         122232    111111111...(22232) 212223    <raised>    2:12:22:3     112233
9              91        9           19        <raised>    1:9           9

demo samples:                    8
  naive round-tripped:           5/8
  count-first round-tripped:     4/8
  delimited round-tripped:       8/8

generated strings:               96
  naive round-tripped:           54/96
  count-first round-tripped:     24/96
  delimited round-tripped:       96/96

strings the naive form corrupts:            42
strings count-first corrupts or rejects:    72

Malformed delimited input:
  a    -> expected a count at position 0
  3    -> expected a separator after the count at position 1
  12   -> expected a separator after the count at position 2
  3a   -> expected a separator after the count at position 1

Only the delimited codec round-trips everything. Both others break on digits.

Moving the count to the front FEELS like it fixes the ambiguity and does
not - it only changes where two numbers run together. That was this file's
own first premise, and the round trip over generated strings is what
disproved it. A format needs an explicit boundary, not a convention.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
