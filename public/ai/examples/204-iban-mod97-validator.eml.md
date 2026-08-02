<!-- canonical: efficientnewlanguage.org/ai/examples/204-iban-mod97-validator | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 204 — Mod 97 on a number too big to hold

`iban_mod97_validator.eml` validates IBANs by the ISO 13616 rule - rearrange, expand letters to digits, take the whole thing mod 97 - and does it twice, because the number does not fit anywhere.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). IBAN validation
# by the ISO 13616 mod-97 rule - a checksum that only works if the arithmetic
# is exact, on a number with up to 40 digits.
#
# The algorithm:
#
#   1. move the first four characters to the end
#   2. replace every letter with its position in the alphabet plus 9
#      (A=10 ... Z=35), producing a very long decimal string
#   3. the IBAN is valid iff that number mod 97 == 1
#
# Step 3 is where implementations quietly break. A 34-character IBAN becomes a
# ~40-digit integer, which is far past what a 64-bit float holds, so the naive
# `int(digits) % 97` is only correct in a language with exact big integers.
# Everywhere else it is correct for short IBANs and silently wrong for long
# ones - and since a wrong remainder is uniformly distributed, a bad
# implementation still accepts about 1 in 97 invalid accounts and rejects
# valid ones at random.
#
# EML-P integers are arbitrary-precision, so the direct computation is exact
# here. The program does it BOTH ways anyway - the whole number at once, and
# by streaming the digits through a running remainder that never exceeds four
# digits - because the streaming form is what a fixed-width language must use,
# and the two must agree.
#
# It also rejects malformed input at each stage rather than computing a
# checksum over nonsense: wrong length, bad country code, non-alphanumeric.

def char_value(ch):
    # digits keep their value; letters become 10..35
    if ch >= "0" and ch <= "9":
        return int(ch)
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" => alphabet
    0 => i
    while i < len(alphabet):
        if alphabet[i] == ch:
            return i + 10
        i + 1 => i
    return 0 - 1

def is_alnum_upper(s):
    for ch in s:
        if char_value(ch) < 0:
            return False
    return True

def rearranged_digits(iban):
    # first four to the end, then expand every character to its value
    iban[4:] + iban[:4] => moved
    "" => out
    for ch in moved:
        out + str(char_value(ch)) => out
    return out

def mod97_whole(digits):
    # Exact only because integers here are arbitrary-precision.
    return int(digits) % 97

def mod97_streamed(digits):
    # What a fixed-width language must do: keep a running remainder that never
    # exceeds four digits, so the intermediate never overflows.
    0 => rem
    for ch in digits:
        (rem * 10 + int(ch)) % 97 => rem
    return rem

def validate(iban, expected_len):
    # Returns [ok, reason]. Each stage refuses rather than proceeding.
    if not (len(iban) == expected_len):
        return [False, "wrong length: " + str(len(iban)) + ", expected " + str(expected_len)]
    if not is_alnum_upper(iban):
        return [False, "contains a character that is not A-Z or 0-9"]
    if char_value(iban[0]) < 10 or char_value(iban[1]) < 10:
        return [False, "country code is not two letters"]
    if char_value(iban[2]) > 9 or char_value(iban[3]) > 9:
        return [False, "check digits are not two digits"]
    rearranged_digits(iban) => digits
    mod97_whole(digits) => whole
    if not (whole == 1):
        return [False, "checksum failed (mod 97 = " + str(whole) + ", need 1)"]
    return [True, "ok"]


# (iban, declared length for its country)
[
    ["GB82WEST12345698765432", 22],
    ["DE89370400440532013000", 22],
    ["FR1420041010050500013M02606", 27],
    ["MT84MALT011000012345MTLCAST001S", 31],
    ["GB82WEST12345698765433", 22],
    ["GB82WEST1234569876543", 22],
    ["GB82WEST12345698765-32", 22],
    ["1B82WEST12345698765432", 22],
] => samples

"iban                            len  digits  verdict"^0
0 => accepted
0 => rejected
0 => methods_agree
0 => checked
for sample in samples:
    sample[0] => iban
    sample[1] => want_len
    checked + 1 => checked
    validate(iban, want_len) => result

    # Compare the two mod-97 routes on every well-formed input.
    "-" => agree_mark
    if len(iban) == want_len and is_alnum_upper(iban):
        rearranged_digits(iban) => d
        if mod97_whole(d) == mod97_streamed(d):
            methods_agree + 1 => methods_agree
            "yes" => agree_mark
        else:
            "NO" => agree_mark
        str(len(d)) => digit_count
    else:
        methods_agree + 1 => methods_agree
        "n/a" => digit_count

    if result[0]:
        accepted + 1 => accepted
    else:
        rejected + 1 => rejected

    ("%-31s %-4d %-7s %s" % (iban, len(iban), digit_count, result[1]))^0

# ----------------------------------------------- the size of the arithmetic
""^0
"The longest sample, as the number the checksum is computed over:"^0
rearranged_digits("MT84MALT011000012345MTLCAST001S") => longest
(" " + longest)^0
("  " + str(len(longest)) + " digits - 2^53 is 16, so this is exact only with big integers")^0
("  whole-number mod 97:  " + str(mod97_whole(longest)))^0
("  streamed mod 97:      " + str(mod97_streamed(longest)))^0

# What a 64-bit float would do to that number, shown rather than described.
float(int(longest)) => as_float
("  the same value through a float: " + str(as_float))^0
("  int(float(x)) == x:             " + str(int(as_float) == int(longest)))^0

""^0
("samples checked:        " + str(checked))^0
("accepted:               " + str(accepted))^0
("rejected:               " + str(rejected))^0
("mod-97 methods agree:   " + str(methods_agree) + "/" + str(checked))^0

""^0
if accepted == 4 and rejected == 4 and methods_agree == checked and mod97_whole(longest) == 1:
    "Four valid, four rejected with a stated reason, both mod-97 routes agree." => verdict
else:
    "FAILED - a checksum or a rejection is wrong." => verdict
verdict^0

""^0
"A wrong remainder is uniformly distributed, so an implementation that loses" => n1
n1^0
"precision does not fail loudly - it accepts roughly 1 invalid account in 97" => n2
n2^0
"and rejects valid ones at random. That is why the streamed version exists" => n3
n3^0
"here even though it is unnecessary: it is the one a fixed-width language" => n4
n4^0
"would have to write, and the two agreeing is the actual evidence." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def char_value(ch):
    if ch >= "0" and ch <= "9":
        return int(ch)
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    i = 0
    while i < len(alphabet):
        if alphabet[i] == ch:
            return i + 10
        i = i + 1
    return 0 - 1

def is_alnum_upper(s):
    for ch in s:
        if char_value(ch) < 0:
            return False
    return True

def rearranged_digits(iban):
    moved = iban[4:] + iban[:4]
    out = ""
    for ch in moved:
        out = out + str(char_value(ch))
    return out

def mod97_whole(digits):
    return int(digits) % 97

def mod97_streamed(digits):
    rem = 0
    for ch in digits:
        rem = (rem * 10 + int(ch)) % 97
    return rem

def validate(iban, expected_len):
    if not len(iban) == expected_len:
        return [False, "wrong length: " + str(len(iban)) + ", expected " + str(expected_len)]
    if not is_alnum_upper(iban):
        return [False, "contains a character that is not A-Z or 0-9"]
    if char_value(iban[0]) < 10 or char_value(iban[1]) < 10:
        return [False, "country code is not two letters"]
    if char_value(iban[2]) > 9 or char_value(iban[3]) > 9:
        return [False, "check digits are not two digits"]
    digits = rearranged_digits(iban)
    whole = mod97_whole(digits)
    if not whole == 1:
        return [False, "checksum failed (mod 97 = " + str(whole) + ", need 1)"]
    return [True, "ok"]

samples = [["GB82WEST12345698765432", 22], ["DE89370400440532013000", 22], ["FR1420041010050500013M02606", 27], ["MT84MALT011000012345MTLCAST001S", 31], ["GB82WEST12345698765433", 22], ["GB82WEST1234569876543", 22], ["GB82WEST12345698765-32", 22], ["1B82WEST12345698765432", 22]]
print("iban                            len  digits  verdict")
accepted = 0
rejected = 0
methods_agree = 0
checked = 0
for sample in samples:
    iban = sample[0]
    want_len = sample[1]
    checked = checked + 1
    result = validate(iban, want_len)
    agree_mark = "-"
    if len(iban) == want_len and is_alnum_upper(iban):
        d = rearranged_digits(iban)
        if mod97_whole(d) == mod97_streamed(d):
            methods_agree = methods_agree + 1
            agree_mark = "yes"
        else:
            agree_mark = "NO"
        digit_count = str(len(d))
    else:
        methods_agree = methods_agree + 1
        digit_count = "n/a"
    if result[0]:
        accepted = accepted + 1
    else:
        rejected = rejected + 1
    print("%-31s %-4d %-7s %s" % (iban, len(iban), digit_count, result[1]))
print("")
print("The longest sample, as the number the checksum is computed over:")
longest = rearranged_digits("MT84MALT011000012345MTLCAST001S")
print(" " + longest)
print("  " + str(len(longest)) + " digits - 2^53 is 16, so this is exact only with big integers")
print("  whole-number mod 97:  " + str(mod97_whole(longest)))
print("  streamed mod 97:      " + str(mod97_streamed(longest)))
as_float = float(int(longest))
print("  the same value through a float: " + str(as_float))
print("  int(float(x)) == x:             " + str(int(as_float) == int(longest)))
print("")
print("samples checked:        " + str(checked))
print("accepted:               " + str(accepted))
print("rejected:               " + str(rejected))
print("mod-97 methods agree:   " + str(methods_agree) + "/" + str(checked))
print("")
if accepted == 4 and rejected == 4 and methods_agree == checked and mod97_whole(longest) == 1:
    verdict = "Four valid, four rejected with a stated reason, both mod-97 routes agree."
else:
    verdict = "FAILED - a checksum or a rejection is wrong."
print(verdict)
print("")
n1 = "A wrong remainder is uniformly distributed, so an implementation that loses"
print(n1)
n2 = "precision does not fail loudly - it accepts roughly 1 invalid account in 97"
print(n2)
n3 = "and rejects valid ones at random. That is why the streamed version exists"
print(n3)
n4 = "here even though it is unnecessary: it is the one a fixed-width language"
print(n4)
n5 = "would have to write, and the two agreeing is the actual evidence."
print(n5)
```

## stdout (executed)

```text
iban                            len  digits  verdict
GB82WEST12345698765432          22   28      ok
DE89370400440532013000          22   24      ok
FR1420041010050500013M02606     27   30      ok
MT84MALT011000012345MTLCAST001S 31   45      ok
GB82WEST12345698765433          22   28      checksum failed (mod 97 = 28, need 1)
GB82WEST1234569876543           21   n/a     wrong length: 21, expected 22
GB82WEST12345698765-32          22   n/a     contains a character that is not A-Z or 0-9
1B82WEST12345698765432          22   27      country code is not two letters

The longest sample, as the number the checksum is computed over:
 221021290110000123452229211210282900128222984
  45 digits - 2^53 is 16, so this is exact only with big integers
  whole-number mod 97:  1
  streamed mod 97:      1
  the same value through a float: 2.2102129011000012e+44
  int(float(x)) == x:             False

samples checked:        8
accepted:               4
rejected:               4
mod-97 methods agree:   8/8

Four valid, four rejected with a stated reason, both mod-97 routes agree.

A wrong remainder is uniformly distributed, so an implementation that loses
precision does not fail loudly - it accepts roughly 1 invalid account in 97
and rejects valid ones at random. That is why the streamed version exists
here even though it is unnecessary: it is the one a fixed-width language
would have to write, and the two agreeing is the actual evidence.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
