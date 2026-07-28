<!-- canonical: efficientnewlanguage.org/ai/examples/125-arithmetic-series-sigma | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 125 — Arithmetic series (Σ)

`arithmetic_series_sigma.eml` sums arithmetic progressions with EML's summation operator, checking every result against a closed form.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Sums
# arithmetic progressions with EML's summation operator, checked against
# the closed forms that make such sums famous.
#
# Two shapes:
#   Σ(i, i in [1:n])                 -> n(n+1)/2, the Gauss sum
#   Σ(a + (i - 1) * d, i in [1:n])   -> n(2a + (n-1)d)/2, the general case
#
# The general form is the interesting one for EML: the summand is an
# expression in the index, not just the index, so the operator is carrying
# real work rather than standing in for a `range` sum. Its closed form
# also subsumes the first (a=1, d=1), which is why both are checked
# against the SAME general formula rather than two separate ones — a
# formula that only worked for the special case would go unnoticed if the
# special case had its own check.

def gauss(n):
    return int(n * (n + 1) / 2)

def series_total(a, d, n):
    return int(n * (2 * a + (n - 1) * d) / 2)

"Gauss sums, Sigma(i, i in [1:n]) against n(n+1)/2:" => header1
header1^0
0 => matches
sizes^+[1, 10, 100, 1000]
for n in sizes:
    Σ(i, i in [1:n]) => total
    gauss(n) => expected
    if total == expected:
        matches + 1 => matches
        "  n=" + str(n) + ": " + str(total) + " (agrees)" => line
    else:
        "  n=" + str(n) + ": " + str(total) + " (EXPECTED " + str(expected) + ")" => line
    line^0

"" => blank1
blank1^0
"General progressions, Sigma(a + (i-1)*d, i in [1:n]):" => header2
header2^0

cases^+[[1, 1, 10], [2, 3, 8], [5, 0 - 2, 6], [7, 4, 1], [0, 5, 20]]
for triple in cases:
    triple[0] => a
    triple[1] => d
    triple[2] => n
    Σ(a + (i - 1) * d, i in [1:n]) => total
    series_total(a, d, n) => expected
    "  a=" + str(a) + " d=" + str(d) + " n=" + str(n) + " -> " + str(total) => line
    if total == expected:
        matches + 1 => matches
        line + " (agrees)" => line
    else:
        line + " (EXPECTED " + str(expected) + ")" => line
    line^0

"" => blank2
blank2^0
str(matches) + " of " + str(len(sizes) + len(cases)) + " sums match their closed form" => summary
summary^0
"The a=1 d=1 row is the Gauss sum again, reached through the general formula." => note
note^0
```

## Python (deterministic transpilation)

```python
def gauss(n):
    return int(n * (n + 1) / 2)

def series_total(a, d, n):
    return int(n * (2 * a + (n - 1) * d) / 2)

header1 = "Gauss sums, Sigma(i, i in [1:n]) against n(n+1)/2:"
print(header1)
matches = 0
sizes = [1, 10, 100, 1000]
for n in sizes:
    total = sum(i for i in range(1, n+1))
    expected = gauss(n)
    if total == expected:
        matches = matches + 1
        line = "  n=" + str(n) + ": " + str(total) + " (agrees)"
    else:
        line = "  n=" + str(n) + ": " + str(total) + " (EXPECTED " + str(expected) + ")"
    print(line)
blank1 = ""
print(blank1)
header2 = "General progressions, Sigma(a + (i-1)*d, i in [1:n]):"
print(header2)
cases = [[1, 1, 10], [2, 3, 8], [5, 0 - 2, 6], [7, 4, 1], [0, 5, 20]]
for triple in cases:
    a = triple[0]
    d = triple[1]
    n = triple[2]
    total = sum(a + (i - 1) * d for i in range(1, n+1))
    expected = series_total(a, d, n)
    line = "  a=" + str(a) + " d=" + str(d) + " n=" + str(n) + " -> " + str(total)
    if total == expected:
        matches = matches + 1
        line = line + " (agrees)"
    else:
        line = line + " (EXPECTED " + str(expected) + ")"
    print(line)
blank2 = ""
print(blank2)
summary = str(matches) + " of " + str(len(sizes) + len(cases)) + " sums match their closed form"
print(summary)
note = "The a=1 d=1 row is the Gauss sum again, reached through the general formula."
print(note)
```

## stdout (executed)

```text
Gauss sums, Sigma(i, i in [1:n]) against n(n+1)/2:
  n=1: 1 (agrees)
  n=10: 55 (agrees)
  n=100: 5050 (agrees)
  n=1000: 500500 (agrees)

General progressions, Sigma(a + (i-1)*d, i in [1:n]):
  a=1 d=1 n=10 -> 55 (agrees)
  a=2 d=3 n=8 -> 100 (agrees)
  a=5 d=-2 n=6 -> 0 (agrees)
  a=7 d=4 n=1 -> 7 (agrees)
  a=0 d=5 n=20 -> 950 (agrees)

9 of 9 sums match their closed form
The a=1 d=1 row is the Gauss sum again, reached through the general formula.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:sum · eml:call · eml:return · eml:run:done
