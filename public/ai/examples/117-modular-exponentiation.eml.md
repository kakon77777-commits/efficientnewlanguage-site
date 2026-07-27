<!-- canonical: efficientnewlanguage.org/ai/examples/117-modular-exponentiation | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 117 — Modular exponentiation

`modular_exponentiation.eml` computes `base^exponent mod m` by repeated squaring — the operation underneath RSA and Diffie-Hellman.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Modular
# exponentiation by repeated squaring: instead of multiplying the base by
# itself N times, square it repeatedly and multiply in only the powers
# corresponding to the 1 bits of the exponent, reducing modulo m at every
# step. The operation underneath RSA and Diffie-Hellman.
#
# Two things are checked, and they are different claims:
#
#   CORRECTNESS  small cases are compared against `naive_pow`, which just
#                multiplies the base in a loop. That shares no operator
#                and no structure with repeated squaring, so agreement is
#                real evidence rather than the method checking itself.
#                (EML's `^` operator could not be used here: its exponent
#                must be a numeric LITERAL, so `base^exponent` with a
#                variable exponent does not parse. `n^0.5` in
#                examples/newton-sqrt/ works because 0.5 is literal.)
#
#   COST         the last section shows why the shortcut matters. Both
#                routes reach the same answer for 7^1000 mod 13, but the
#                direct route builds the full 7^1000 first — an integer
#                of 846 digits, printed below — while repeated squaring
#                never holds a value above modulus squared.
#
# EML's integers are arbitrary-precision, so the direct route genuinely
# works rather than overflowing. That is what makes the comparison honest:
# the difference here is cost, not correctness, and the case says so.

def naive_pow(base, exponent):
    1 => result
    0 => i
    while i < exponent:
        result * base => result
        i + 1 => i
    return result

def mod_pow(base, exponent, modulus):
    1 => result
    base % modulus => b
    exponent => e
    while e > 0:
        if e % 2 == 1:
            result * b % modulus => result
        int(e / 2) => e
        b * b % modulus => b
    return result

cases^+[[2, 10, 1000], [3, 5, 7], [5, 0, 13], [10, 3, 7], [2, 20, 1000000]]

"Checked against direct exponentiation:" => header
header^0
0 => matches
for triple in cases:
    triple[0] => base
    triple[1] => exponent
    triple[2] => modulus
    mod_pow(base, exponent, modulus) => fast
    naive_pow(base, exponent) % modulus => direct
    if fast == direct:
        matches + 1 => matches
        "  " + str(base) + "^" + str(exponent) + " mod " + str(modulus) + " = " + str(fast) + " (agrees)" => line
    else:
        "  " + str(base) + "^" + str(exponent) + " mod " + str(modulus) + " = " + str(fast) + " (DIRECT SAYS " + str(direct) + ")" => line
    line^0

str(matches) + " of " + str(len(cases)) + " agree with direct exponentiation" => summary
summary^0

"" => blank
blank^0
"Why the shortcut matters, for 7^1000 mod 13:" => header2
header2^0

mod_pow(7, 1000, 13) => fast_big
naive_pow(7, 1000) => huge
huge % 13 => direct_big

"  repeated squaring: " + str(fast_big) => line1
line1^0
"  direct:            " + str(direct_big) => line2
line2^0
len(str(huge)) => digit_count
"  but the direct route first builds an integer of " + str(digit_count) + " digits" => line3
line3^0
13 * 13 => ceiling
"  while repeated squaring never exceeds " + str(ceiling) + " (modulus squared)" => line4
line4^0
```

## Python (deterministic transpilation)

```python
def naive_pow(base, exponent):
    result = 1
    i = 0
    while i < exponent:
        result = result * base
        i = i + 1
    return result

def mod_pow(base, exponent, modulus):
    result = 1
    b = base % modulus
    e = exponent
    while e > 0:
        if e % 2 == 1:
            result = result * b % modulus
        e = int(e / 2)
        b = b * b % modulus
    return result

cases = [[2, 10, 1000], [3, 5, 7], [5, 0, 13], [10, 3, 7], [2, 20, 1000000]]
header = "Checked against direct exponentiation:"
print(header)
matches = 0
for triple in cases:
    base = triple[0]
    exponent = triple[1]
    modulus = triple[2]
    fast = mod_pow(base, exponent, modulus)
    direct = naive_pow(base, exponent) % modulus
    if fast == direct:
        matches = matches + 1
        line = "  " + str(base) + "^" + str(exponent) + " mod " + str(modulus) + " = " + str(fast) + " (agrees)"
    else:
        line = "  " + str(base) + "^" + str(exponent) + " mod " + str(modulus) + " = " + str(fast) + " (DIRECT SAYS " + str(direct) + ")"
    print(line)
summary = str(matches) + " of " + str(len(cases)) + " agree with direct exponentiation"
print(summary)
blank = ""
print(blank)
header2 = "Why the shortcut matters, for 7^1000 mod 13:"
print(header2)
fast_big = mod_pow(7, 1000, 13)
huge = naive_pow(7, 1000)
direct_big = huge % 13
line1 = "  repeated squaring: " + str(fast_big)
print(line1)
line2 = "  direct:            " + str(direct_big)
print(line2)
digit_count = len(str(huge))
line3 = "  but the direct route first builds an integer of " + str(digit_count) + " digits"
print(line3)
ceiling = 13 * 13
line4 = "  while repeated squaring never exceeds " + str(ceiling) + " (modulus squared)"
print(line4)
```

## stdout (executed)

```text
Checked against direct exponentiation:
  2^10 mod 1000 = 24 (agrees)
  3^5 mod 7 = 5 (agrees)
  5^0 mod 13 = 1 (agrees)
  10^3 mod 7 = 6 (agrees)
  2^20 mod 1000000 = 48576 (agrees)
5 of 5 agree with direct exponentiation

Why the shortcut matters, for 7^1000 mod 13:
  repeated squaring: 9
  direct:            9
  but the direct route first builds an integer of 846 digits
  while repeated squaring never exceeds 169 (modulus squared)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
