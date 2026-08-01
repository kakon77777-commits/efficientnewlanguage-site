<!-- canonical: efficientnewlanguage.org/ai/examples/190-long-division-exact | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 190 — Exact integer division, by hand

`long_division_exact.eml` implements exact integer division digit by digit, **because EML-P has no `//` operator**.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Exact integer
# division, implemented by hand, because EML-P has no `//` operator.
#
# This is a real limit of the language, measured rather than assumed:
#
#   `a // b`            E_PARSE: Unexpected token SLASH
#   `int(a / b)`        goes through a 64-bit float, so on a 30-digit numerator
#                       it returns a number that is close and wrong
#   `a % b`             works exactly, at any size
#
# Concretely, for a = 123456789012345678901234567890 and b = 7:
#
#   int(a / b)  ->  17636684144620810497096155136     (float route)
#   exact       ->  17636684144620811271604938270     (this program)
#
# Both are 29 digits. Both start 1763668414462081. They differ from the
# seventeenth digit on, which is exactly where a double runs out of mantissa,
# and no amount of eyeballing the output would catch it.
#
# The fix is the algorithm every schoolchild learns: long division, digit by
# digit, carrying a remainder that is always smaller than the divisor and
# therefore always small enough to be exact. `%` and `*` at full precision are
# all it needs.
#
# The check is the one that division has to satisfy by definition:
#
#     q * b + r == a     and     0 <= r < b

def long_divide(a, b):
    # Digit-by-digit long division on the decimal rendering of `a`. The running
    # remainder never reaches `b`, so `remainder * 10 + digit` stays small no
    # matter how large `a` is - that is what keeps this exact.
    str(a) => digits
    "" => quotient
    0 => remainder
    for ch in digits:
        int(ch) => d
        remainder * 10 + d => current
        0 => q
        while current >= b:
            current - b => current
            q + 1 => q
        current => remainder
        # Skip leading zeros so the quotient renders like a number.
        if not (quotient == "" and q == 0):
            quotient + str(q) => quotient
    if quotient == "":
        "0" => quotient
    return [int(quotient), remainder]


123456789012345678901234567890 => a
7 => b

("dividend: " + str(a))^0
("divisor:  " + str(b))^0
""^0

long_divide(a, b) => result
result[0] => q
result[1] => r

("exact quotient:  " + str(q))^0
("exact remainder: " + str(r))^0

int(a / b) => float_route
("via int(a / b):  " + str(float_route))^0
("the two differ:  " + str(not (q == float_route)))^0

""^0
"Where they part company:"^0
str(q) => qs
str(float_route) => fs
0 => shared
while shared < len(qs) and shared < len(fs) and qs[shared] == fs[shared]:
    shared + 1 => shared
("  identical for the first " + str(shared) + " digits of " + str(len(qs)))^0
("  exact:       " + qs)^0
("  float route: " + fs)^0

# ------------------------------------------------------ the defining identity
""^0
"Checking q * b + r == a and 0 <= r < b, over many divisors:"^0
[2, 3, 7, 11, 13, 97, 1000, 65537] => divisors
0 => ok
0 => checked
for d in divisors:
    checked + 1 => checked
    long_divide(a, d) => res
    res[0] * d + res[1] => rebuilt
    if rebuilt == a and res[1] >= 0 and res[1] < d:
        ok + 1 => ok
    ("  a / " + str(d) + " -> remainder " + str(res[1]) + ", rebuilds: " + str(rebuilt == a))^0

# Small numbers too, where the float route happens to agree - a division
# routine that is only correct on big inputs is not a division routine.
0 => small_ok
0 => small_checked
for x in [0:60]:
    for y in [1:9]:
        small_checked + 1 => small_checked
        long_divide(x, y) => res
        if res[0] == int(x / y) and res[1] == x % y:
            small_ok + 1 => small_ok

""^0
("identity holds:        " + str(ok) + "/" + str(checked))^0
("agrees on small pairs: " + str(small_ok) + "/" + str(small_checked))^0

""^0
if ok == checked and small_ok == small_checked:
    "Exact integer division, built from % and * alone." => verdict
else:
    "FAILED - the long division is wrong somewhere." => verdict
verdict^0

""^0
"EML-P has `%` at full precision but no `//`, so the exact quotient of two" => n1
n1^0
"large integers is not reachable by any single operator. That gap is worth" => n2
n2^0
"stating plainly: `int(a / b)` looks like integer division and is not." => n3
n3^0
```

## Python (deterministic transpilation)

```python
def long_divide(a, b):
    digits = str(a)
    quotient = ""
    remainder = 0
    for ch in digits:
        d = int(ch)
        current = remainder * 10 + d
        q = 0
        while current >= b:
            current = current - b
            q = q + 1
        remainder = current
        if not (quotient == "" and q == 0):
            quotient = quotient + str(q)
    if quotient == "":
        quotient = "0"
    return [int(quotient), remainder]

a = 123456789012345678901234567890
b = 7
print("dividend: " + str(a))
print("divisor:  " + str(b))
print("")
result = long_divide(a, b)
q = result[0]
r = result[1]
print("exact quotient:  " + str(q))
print("exact remainder: " + str(r))
float_route = int(a / b)
print("via int(a / b):  " + str(float_route))
print("the two differ:  " + str(not q == float_route))
print("")
print("Where they part company:")
qs = str(q)
fs = str(float_route)
shared = 0
while shared < len(qs) and shared < len(fs) and qs[shared] == fs[shared]:
    shared = shared + 1
print("  identical for the first " + str(shared) + " digits of " + str(len(qs)))
print("  exact:       " + qs)
print("  float route: " + fs)
print("")
print("Checking q * b + r == a and 0 <= r < b, over many divisors:")
divisors = [2, 3, 7, 11, 13, 97, 1000, 65537]
ok = 0
checked = 0
for d in divisors:
    checked = checked + 1
    res = long_divide(a, d)
    rebuilt = res[0] * d + res[1]
    if rebuilt == a and res[1] >= 0 and res[1] < d:
        ok = ok + 1
    print("  a / " + str(d) + " -> remainder " + str(res[1]) + ", rebuilds: " + str(rebuilt == a))
small_ok = 0
small_checked = 0
for x in range(0, 61):
    for y in range(1, 10):
        small_checked = small_checked + 1
        res = long_divide(x, y)
        if res[0] == int(x / y) and res[1] == x % y:
            small_ok = small_ok + 1
print("")
print("identity holds:        " + str(ok) + "/" + str(checked))
print("agrees on small pairs: " + str(small_ok) + "/" + str(small_checked))
print("")
if ok == checked and small_ok == small_checked:
    verdict = "Exact integer division, built from % and * alone."
else:
    verdict = "FAILED - the long division is wrong somewhere."
print(verdict)
print("")
n1 = "EML-P has `%` at full precision but no `//`, so the exact quotient of two"
print(n1)
n2 = "large integers is not reachable by any single operator. That gap is worth"
print(n2)
n3 = "stating plainly: `int(a / b)` looks like integer division and is not."
print(n3)
```

## stdout (executed)

```text
dividend: 123456789012345678901234567890
divisor:  7

exact quotient:  17636684144620811271604938270
exact remainder: 0
via int(a / b):  17636684144620810497096155136
the two differ:  True

Where they part company:
  identical for the first 16 digits of 29
  exact:       17636684144620811271604938270
  float route: 17636684144620810497096155136

Checking q * b + r == a and 0 <= r < b, over many divisors:
  a / 2 -> remainder 0, rebuilds: True
  a / 3 -> remainder 0, rebuilds: True
  a / 7 -> remainder 0, rebuilds: True
  a / 11 -> remainder 7, rebuilds: True
  a / 13 -> remainder 0, rebuilds: True
  a / 97 -> remainder 52, rebuilds: True
  a / 1000 -> remainder 890, rebuilds: True
  a / 65537 -> remainder 23325, rebuilds: True

identity holds:        8/8
agrees on small pairs: 549/549

Exact integer division, built from % and * alone.

EML-P has `%` at full precision but no `//`, so the exact quotient of two
large integers is not reachable by any single operator. That gap is worth
stating plainly: `int(a / b)` looks like integer division and is not.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
