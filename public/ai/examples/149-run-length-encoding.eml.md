<!-- canonical: efficientnewlanguage.org/ai/examples/149-run-length-encoding | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 149 — A round-trip property that found a broken format

`run_length_encoding.eml` implements RLE and its inverse, and checks them against each other rather than against hand-written expected strings.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Run-length
# encoding, its inverse, and a round-trip property that caught a real flaw in
# the format while this case was being written.
#
# The property is the point. Rather than compare the encoder against
# hand-written expected strings - which only ever checks the inputs someone
# thought of - every input is encoded and then decoded, and the result must
# equal what went in. A decoder bug and an encoder bug both break it, and the
# only way to pass while being wrong is to be wrong in two exactly cancelling
# ways.
#
# WHAT IT FOUND. The first version of this file asserted, in a comment, that
# the format is unambiguous "because each count is followed by exactly one
# payload character". That is false, and the round-trip said so on the very
# first run: "a1a1a1" encodes to "1a111a111a11" and decodes to 111 a's. The
# decoder reads digits greedily, so the payload's own '1' is swallowed into the
# next count. No amount of re-reading the encoder would have shown that; the
# encoder is fine. The format is broken, for any input containing digits.
#
# The table below reports it rather than hiding it - one row says NO, and the
# summary says 8 of 9. A version of this case that quietly dropped the digit
# sample would have looked better and taught nothing.
#
# The other inputs are awkward on purpose: empty, single character, no repeats,
# all one character, a run of exactly 9 and a run of 10 (the digit boundary,
# where a decoder reading one digit of count truncates silently).

def encode(s):
    if len(s) == 0:
        return ""
    "" => out
    s[0:1] => current
    1 => count
    1 => i
    while i < len(s):
        s[i:i + 1] => ch
        if ch == current:
            count + 1 => count
        else:
            out + str(count) + current => out
            ch => current
            1 => count
        i + 1 => i
    return out + str(count) + current

def decode(s):
    "" => out
    "" => digits
    for ch in s:
        if ch >= "0" and ch <= "9":
            digits + ch => digits
        else:
            int(digits) => n
            out + ch * n => out
            "" => digits
    return out

samples^+["", "a", "abcdef", "aaaaaaaaaa", "aaabbbcccd",
          "wwwwwwwwwz", "wwwwwwwwwwz", "a1a1a1", "mississippi"]

"%-14s %-20s %5s %5s %8s" % ("INPUT", "ENCODED", "IN", "OUT", "ROUND") => header
header^0
("-" * 56)^0

0 => ok
0 => grew
0 => checked
for s in samples:
    encode(s) => e
    decode(e) => back
    checked + 1 => checked
    if back == s:
        ok + 1 => ok
        "yes" => verdict
    else:
        "NO" => verdict
    if len(e) > len(s):
        grew + 1 => grew
    ("%-14s %-20s %5d %5d %8s" % ("\"" + s + "\"", "\"" + e + "\"", len(s), len(e), verdict))^0

("-" * 56)^0
("round-trips intact: " + str(ok) + " of " + str(checked))^0
("inputs RLE made bigger: " + str(grew) + " of " + str(checked))^0

""^0
"The failure, in detail:" => h2
h2^0
"a1a1a1" => tricky
encode(tricky) => enc
decode(enc) => dec
("  input   \"" + tricky + "\"  (" + str(len(tricky)) + " chars)")^0
("  encoded \"" + enc + "\"")^0
("  decoded " + str(len(dec)) + " characters, all '" + dec[0:1] + "'")^0
"  Three separate things ran together into the count \"111\": the count 1" => n2
n2^0
"  for the '1'-run, the literal '1' itself, and the count 1 for the next" => n2b
n2b^0
"  'a'-run. That happens twice, giving 1 + 111 + 111 = 223, and the final" => n2c
n2c^0
"  \"11\" is dropped outright because the string ended on digits with no" => n2d
n2d^0
"  payload character to close them." => n2e
n2e^0
"  Fixing it needs a delimiter or an escape - a format change, not a" => n2f
n2f^0
"  decoder patch." => n2g
n2g^0

""^0
"The two-digit boundary, which the format DOES handle:" => h3
h3^0
("  9 w's  -> \"" + encode("wwwwwwwww") + "\"")^0
("  10 w's -> \"" + encode("wwwwwwwwww") + "\"")^0
"  A decoder reading a single digit of count would turn the second into one" => n3
n3^0
"  w followed by a literal '0'. The round-trip would catch that too." => n3b
n3b^0

""^0
"And the honest bit about compression:" => h4
h4^0
("  RLE made " + str(grew) + " of " + str(checked) + " inputs LONGER. On text without runs it")^0
"  costs a count per character and saves nothing." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def encode(s):
    if len(s) == 0:
        return ""
    out = ""
    current = s[0:1]
    count = 1
    i = 1
    while i < len(s):
        ch = s[i:i + 1]
        if ch == current:
            count = count + 1
        else:
            out = out + str(count) + current
            current = ch
            count = 1
        i = i + 1
    return out + str(count) + current

def decode(s):
    out = ""
    digits = ""
    for ch in s:
        if ch >= "0" and ch <= "9":
            digits = digits + ch
        else:
            n = int(digits)
            out = out + ch * n
            digits = ""
    return out

samples = ["", "a", "abcdef", "aaaaaaaaaa", "aaabbbcccd", "wwwwwwwwwz", "wwwwwwwwwwz", "a1a1a1", "mississippi"]
header = "%-14s %-20s %5s %5s %8s" % ("INPUT", "ENCODED", "IN", "OUT", "ROUND")
print(header)
print("-" * 56)
ok = 0
grew = 0
checked = 0
for s in samples:
    e = encode(s)
    back = decode(e)
    checked = checked + 1
    if back == s:
        ok = ok + 1
        verdict = "yes"
    else:
        verdict = "NO"
    if len(e) > len(s):
        grew = grew + 1
    print("%-14s %-20s %5d %5d %8s" % ("\"" + s + "\"", "\"" + e + "\"", len(s), len(e), verdict))
print("-" * 56)
print("round-trips intact: " + str(ok) + " of " + str(checked))
print("inputs RLE made bigger: " + str(grew) + " of " + str(checked))
print("")
h2 = "The failure, in detail:"
print(h2)
tricky = "a1a1a1"
enc = encode(tricky)
dec = decode(enc)
print("  input   \"" + tricky + "\"  (" + str(len(tricky)) + " chars)")
print("  encoded \"" + enc + "\"")
print("  decoded " + str(len(dec)) + " characters, all '" + dec[0:1] + "'")
n2 = "  Three separate things ran together into the count \"111\": the count 1"
print(n2)
n2b = "  for the '1'-run, the literal '1' itself, and the count 1 for the next"
print(n2b)
n2c = "  'a'-run. That happens twice, giving 1 + 111 + 111 = 223, and the final"
print(n2c)
n2d = "  \"11\" is dropped outright because the string ended on digits with no"
print(n2d)
n2e = "  payload character to close them."
print(n2e)
n2f = "  Fixing it needs a delimiter or an escape - a format change, not a"
print(n2f)
n2g = "  decoder patch."
print(n2g)
print("")
h3 = "The two-digit boundary, which the format DOES handle:"
print(h3)
print("  9 w's  -> \"" + encode("wwwwwwwww") + "\"")
print("  10 w's -> \"" + encode("wwwwwwwwww") + "\"")
n3 = "  A decoder reading a single digit of count would turn the second into one"
print(n3)
n3b = "  w followed by a literal '0'. The round-trip would catch that too."
print(n3b)
print("")
h4 = "And the honest bit about compression:"
print(h4)
print("  RLE made " + str(grew) + " of " + str(checked) + " inputs LONGER. On text without runs it")
n4 = "  costs a count per character and saves nothing."
print(n4)
```

## stdout (executed)

```text
INPUT          ENCODED                 IN   OUT    ROUND
--------------------------------------------------------
""             ""                       0     0      yes
"a"            "1a"                     1     2      yes
"abcdef"       "1a1b1c1d1e1f"           6    12      yes
"aaaaaaaaaa"   "10a"                   10     3      yes
"aaabbbcccd"   "3a3b3c1d"              10     8      yes
"wwwwwwwwwz"   "9w1z"                  10     4      yes
"wwwwwwwwwwz"  "10w1z"                 11     5      yes
"a1a1a1"       "1a111a111a11"           6    12       NO
"mississippi"  "1m1i2s1i2s1i2p1i"      11    16      yes
--------------------------------------------------------
round-trips intact: 8 of 9
inputs RLE made bigger: 4 of 9

The failure, in detail:
  input   "a1a1a1"  (6 chars)
  encoded "1a111a111a11"
  decoded 223 characters, all 'a'
  Three separate things ran together into the count "111": the count 1
  for the '1'-run, the literal '1' itself, and the count 1 for the next
  'a'-run. That happens twice, giving 1 + 111 + 111 = 223, and the final
  "11" is dropped outright because the string ended on digits with no
  payload character to close them.
  Fixing it needs a delimiter or an escape - a format change, not a
  decoder patch.

The two-digit boundary, which the format DOES handle:
  9 w's  -> "9w"
  10 w's -> "10w"
  A decoder reading a single digit of count would turn the second into one
  w followed by a literal '0'. The round-trip would catch that too.

And the honest bit about compression:
  RLE made 4 of 9 inputs LONGER. On text without runs it
  costs a count per character and saves nothing.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
