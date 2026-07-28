<!-- canonical: efficientnewlanguage.org/ai/examples/134-harmonic-series-sigma | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 134 — Harmonic series (Σ)

`harmonic_series_sigma.eml` computes harmonic numbers `H(n) = Σ(1/i, i in [1:n])` — a summation over a **float** summand.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Harmonic
# numbers, H(n) = Sigma(1/i, i in [1:n]), computed with EML's summation
# operator over a FLOAT summand.
#
# The contrast with the corpus's other summation cases is the point. Those
# sums have closed forms, so the check is "does the sum equal the formula".
# The harmonic series has no elementary closed form, so correctness has to
# be established structurally instead: H(n) must equal H(n-1) + 1/n, for
# every n. That recurrence is checked below across a range, which pins the
# summation down without any external reference value to compare against.
#
# This case earned its keep on the first run: it FAILED, and the failure was a
# real interpreter bug. H(1000) came out ...343 from EML's interpreter and ...345
# from the transpiled Python, because CPython's sum() compensates for lost
# low-order bits (Neumaier summation, 3.12+) and the interpreter was folding with
# a plain +. Invisible until now - the 119 corpus programs before this one summed
# only integers, where EML's arbitrary-precision arithmetic makes both exact. See
# this case's README for the full account.
#
# The growth is the other reason this series is worth showing. H(n) grows
# without bound, but so slowly that quadrupling n adds well under 2. The
# printed table makes that visible: going from n=10 to n=1000 - a
# hundredfold increase - roughly doubles the total and no more.

def harmonic(n):
    Σ(1 / i, i in [1:n]) => total
    return total

def absolute(x):
    if x < 0:
        return 0 - x
    return x

"Harmonic numbers:" => header
header^0
sizes^+[1, 2, 4, 10, 100, 1000]
for n in sizes:
    harmonic(n) => value
    "  H(" + str(n) + ") = " + str(value) => line
    line^0

"" => blank1
blank1^0
"Recurrence check, H(n) == H(n-1) + 1/n:" => header2
header2^0

0 => checked
0 => agreed
for n in [2:40]:
    harmonic(n) => direct
    harmonic(n - 1) + 1 / n => stepwise
    checked + 1 => checked
    if absolute(direct - stepwise) < 0.000000001:
        agreed + 1 => agreed

"  " + str(agreed) + " of " + str(checked) + " values satisfy the recurrence" => result
result^0

"" => blank2
blank2^0
harmonic(10) => h10
harmonic(1000) => h1000
"H(10) = " + str(h10) + ", H(1000) = " + str(h1000) => growth
growth^0
"A hundredfold increase in n barely doubles the sum - the series diverges, very slowly." => note
note^0
```

## Python (deterministic transpilation)

```python
def harmonic(n):
    total = sum(1 / i for i in range(1, n+1))
    return total

def absolute(x):
    if x < 0:
        return 0 - x
    return x

header = "Harmonic numbers:"
print(header)
sizes = [1, 2, 4, 10, 100, 1000]
for n in sizes:
    value = harmonic(n)
    line = "  H(" + str(n) + ") = " + str(value)
    print(line)
blank1 = ""
print(blank1)
header2 = "Recurrence check, H(n) == H(n-1) + 1/n:"
print(header2)
checked = 0
agreed = 0
for n in range(2, 41):
    direct = harmonic(n)
    stepwise = harmonic(n - 1) + 1 / n
    checked = checked + 1
    if absolute(direct - stepwise) < 0.000000001:
        agreed = agreed + 1
result = "  " + str(agreed) + " of " + str(checked) + " values satisfy the recurrence"
print(result)
blank2 = ""
print(blank2)
h10 = harmonic(10)
h1000 = harmonic(1000)
growth = "H(10) = " + str(h10) + ", H(1000) = " + str(h1000)
print(growth)
note = "A hundredfold increase in n barely doubles the sum - the series diverges, very slowly."
print(note)
```

## stdout (executed)

```text
Harmonic numbers:
  H(1) = 1.0
  H(2) = 1.5
  H(4) = 2.0833333333333335
  H(10) = 2.9289682539682538
  H(100) = 5.187377517639621
  H(1000) = 7.485470860550345

Recurrence check, H(n) == H(n-1) + 1/n:
  39 of 39 values satisfy the recurrence

H(10) = 2.9289682539682538, H(1000) = 7.485470860550345
A hundredfold increase in n barely doubles the sum - the series diverges, very slowly.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:sum · eml:return · eml:run:done
