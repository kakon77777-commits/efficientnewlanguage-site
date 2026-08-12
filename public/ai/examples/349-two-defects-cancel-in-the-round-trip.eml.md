<!-- canonical: efficientnewlanguage.org/ai/examples/349-two-defects-cancel-in-the-round-trip | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 349 — Two defects cancel in the round trip — and half a fix is worse than none

`two_defects_cancel_in_the_round_trip.eml` runs an encoder and a decoder that are both wrong, through the only test either of them has.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). An encoder and a
# decoder that are both wrong, and a round-trip test that has never failed.
#
# The wire protocol says a code is a count of 4-unit steps. Our encoder divides
# by 5 and our decoder multiplies by 5. Neither follows the protocol. Encode
# then decode returns exactly what went in, so the round-trip test - the only
# test either function has - passes, and has passed since the day both were
# written.
#
# The interesting part is not that it passes. It is the shape of the repair.
# There are four states: fix neither, fix the encoder, fix the decoder, fix
# both. TWO of them round-trip cleanly and TWO do not, and the two that do are
# "both wrong" and "both right". A partial rollout - the normal way a fix
# reaches production - lands in one of the failing states, so fixing half of
# this looks exactly like breaking it.
#
# Nothing below declares which states pass. Every error is computed by running
# the pair and comparing against the input.

def encode_ours(raw):
    return int(raw / 5)

def decode_ours(code):
    return code * 5

def encode_spec(raw):
    return int(raw / 4)

def decode_spec(code):
    return code * 4

def encode_with(which, raw):
    if which == "spec":
        return encode_spec(raw)
    return encode_ours(raw)

def decode_with(which, code):
    if which == "spec":
        return decode_spec(code)
    return decode_ours(code)

def distinct_count(xs):
    [] => seen
    0 => n
    for x in xs:
        if not (x in seen):
            seen + [x] => seen
            n + 1 => n
    return n

def round_trip_error(enc, dec, samples):
    0 => total
    for raw in samples:
        encode_with(enc, raw) => c
        decode_with(dec, c) => back
        total + abs(back - raw) => total
    return total

# Values the round-trip test uses. They are multiples of 20, which is a
# multiple of BOTH step sizes - a detail nobody chose on purpose.
[0, 20, 40, 60, 80, 100, 120] => aligned

# Values that arrive in production.
[0, 7, 13, 20, 33, 41, 58, 62, 77, 99, 104, 120] => mixed

["ours", "spec"] => choices

# ---- the four repair states, on the test's own fixture ----

"round-trip error on the test fixture (multiples of 20)" ^0
for enc in choices:
    for dec in choices:
        round_trip_error(enc, dec, aligned) => e
        "  encoder " + enc + " + decoder " + dec + " : " + str(e) ^0
"" ^0

# ---- the same four states, on production values ----

"round-trip error on production values" ^0
for enc in choices:
    for dec in choices:
        round_trip_error(enc, dec, mixed) => e
        "  encoder " + enc + " + decoder " + dec + " : " + str(e) ^0
"" ^0

# ---- how many states the fixture can tell apart ----

[] => fixture_results
[] => production_results
for enc in choices:
    for dec in choices:
        fixture_results + [round_trip_error(enc, dec, aligned)] => fixture_results
        production_results + [round_trip_error(enc, dec, mixed)] => production_results

"distinct outcomes the round-trip test can produce" ^0
"  on its own fixture   : " + str(distinct_count(fixture_results)) + " of " + str(len(fixture_results)) + " states" ^0
"  on production values : " + str(distinct_count(production_results)) + " of " + str(len(production_results)) + " states" ^0
"" ^0

0 => clean_on_fixture
for e in fixture_results:
    if e == 0:
        clean_on_fixture + 1 => clean_on_fixture
"  states that round-trip cleanly on the fixture: " + str(clean_on_fixture) ^0
"  (the all-wrong state and the all-right state are two of them)" ^0
"" ^0

# On production values the encoding is lossy in EVERY state - dividing by a
# step size throws away the remainder, and that is the encoding working as
# designed, not a defect. So the honest question is not "which state is zero"
# but whether the matched states and the mismatched ones even overlap.

[] => matched_errors
[] => mismatched_errors
for enc in choices:
    for dec in choices:
        round_trip_error(enc, dec, mixed) => e
        if enc == dec:
            matched_errors + [e] => matched_errors
        else:
            mismatched_errors + [e] => mismatched_errors

"matched pairs against mismatched pairs, on production values" ^0
"  worst error when encoder and decoder agree    : " + str(max(matched_errors)) ^0
"  best error when they disagree                 : " + str(min(mismatched_errors)) ^0
if max(matched_errors) < min(mismatched_errors):
    "  the two groups do not overlap, so agreeing matters more than being right" ^0
else:
    "  the two groups overlap" ^0
"" ^0

# ---- what leaves the machine ----

"the code on the wire, ours against the protocol" ^0
0 => same_code
0 => diff_code
[] => first_diff
for raw in mixed:
    encode_ours(raw) => a
    encode_spec(raw) => b
    if a == b:
        same_code + 1 => same_code
    else:
        diff_code + 1 => diff_code
        if len(first_diff) == 0:
            [raw, a, b] => first_diff
"  values where our code matches the protocol : " + str(same_code) ^0
"  values where it does not                   : " + str(diff_code) ^0
if len(first_diff) > 0:
    "  first disagreement: raw " + str(first_diff[0]) + " -> we send " + str(first_diff[1]) + ", protocol says " + str(first_diff[2]) ^0
"" ^0

# ---- anyone who follows the protocol ----

"a conforming partner decoding what we send" ^0
0 => partner_wrong
0 => partner_worst
for raw in mixed:
    decode_spec(encode_ours(raw)) => got
    abs(got - raw) => err
    if err > 0:
        partner_wrong + 1 => partner_wrong
    if err > partner_worst:
        err => partner_worst
"  values they read wrongly : " + str(partner_wrong) + " of " + str(len(mixed)) ^0
"  worst error              : " + str(partner_worst) ^0
"" ^0

"us decoding what a conforming partner sends" ^0
0 => we_wrong
0 => we_worst
for raw in mixed:
    decode_ours(encode_spec(raw)) => got
    abs(got - raw) => err
    if err > 0:
        we_wrong + 1 => we_wrong
    if err > we_worst:
        err => we_worst
"  values we read wrongly : " + str(we_wrong) + " of " + str(len(mixed)) ^0
"  worst error            : " + str(we_worst) ^0
"" ^0

"Both halves are wrong and the pair is exact, so the test that covers them" ^0
"both cannot see either. The failure is not in the round trip. It is at every" ^0
"edge where one half meets something that is not the other half." ^0
```

## Python (deterministic transpilation)

```python
def encode_ours(raw):
    return int(raw / 5)

def decode_ours(code):
    return code * 5

def encode_spec(raw):
    return int(raw / 4)

def decode_spec(code):
    return code * 4

def encode_with(which, raw):
    if which == "spec":
        return encode_spec(raw)
    return encode_ours(raw)

def decode_with(which, code):
    if which == "spec":
        return decode_spec(code)
    return decode_ours(code)

def distinct_count(xs):
    seen = []
    n = 0
    for x in xs:
        if not x in seen:
            seen = seen + [x]
            n = n + 1
    return n

def round_trip_error(enc, dec, samples):
    total = 0
    for raw in samples:
        c = encode_with(enc, raw)
        back = decode_with(dec, c)
        total = total + abs(back - raw)
    return total

aligned = [0, 20, 40, 60, 80, 100, 120]
mixed = [0, 7, 13, 20, 33, 41, 58, 62, 77, 99, 104, 120]
choices = ["ours", "spec"]
print("round-trip error on the test fixture (multiples of 20)")
for enc in choices:
    for dec in choices:
        e = round_trip_error(enc, dec, aligned)
        print("  encoder " + enc + " + decoder " + dec + " : " + str(e))
print("")
print("round-trip error on production values")
for enc in choices:
    for dec in choices:
        e = round_trip_error(enc, dec, mixed)
        print("  encoder " + enc + " + decoder " + dec + " : " + str(e))
print("")
fixture_results = []
production_results = []
for enc in choices:
    for dec in choices:
        fixture_results = fixture_results + [round_trip_error(enc, dec, aligned)]
        production_results = production_results + [round_trip_error(enc, dec, mixed)]
print("distinct outcomes the round-trip test can produce")
print("  on its own fixture   : " + str(distinct_count(fixture_results)) + " of " + str(len(fixture_results)) + " states")
print("  on production values : " + str(distinct_count(production_results)) + " of " + str(len(production_results)) + " states")
print("")
clean_on_fixture = 0
for e in fixture_results:
    if e == 0:
        clean_on_fixture = clean_on_fixture + 1
print("  states that round-trip cleanly on the fixture: " + str(clean_on_fixture))
print("  (the all-wrong state and the all-right state are two of them)")
print("")
matched_errors = []
mismatched_errors = []
for enc in choices:
    for dec in choices:
        e = round_trip_error(enc, dec, mixed)
        if enc == dec:
            matched_errors = matched_errors + [e]
        else:
            mismatched_errors = mismatched_errors + [e]
print("matched pairs against mismatched pairs, on production values")
print("  worst error when encoder and decoder agree    : " + str(max(matched_errors)))
print("  best error when they disagree                 : " + str(min(mismatched_errors)))
if max(matched_errors) < min(mismatched_errors):
    print("  the two groups do not overlap, so agreeing matters more than being right")
else:
    print("  the two groups overlap")
print("")
print("the code on the wire, ours against the protocol")
same_code = 0
diff_code = 0
first_diff = []
for raw in mixed:
    a = encode_ours(raw)
    b = encode_spec(raw)
    if a == b:
        same_code = same_code + 1
    else:
        diff_code = diff_code + 1
        if len(first_diff) == 0:
            first_diff = [raw, a, b]
print("  values where our code matches the protocol : " + str(same_code))
print("  values where it does not                   : " + str(diff_code))
if len(first_diff) > 0:
    print("  first disagreement: raw " + str(first_diff[0]) + " -> we send " + str(first_diff[1]) + ", protocol says " + str(first_diff[2]))
print("")
print("a conforming partner decoding what we send")
partner_wrong = 0
partner_worst = 0
for raw in mixed:
    got = decode_spec(encode_ours(raw))
    err = abs(got - raw)
    if err > 0:
        partner_wrong = partner_wrong + 1
    if err > partner_worst:
        partner_worst = err
print("  values they read wrongly : " + str(partner_wrong) + " of " + str(len(mixed)))
print("  worst error              : " + str(partner_worst))
print("")
print("us decoding what a conforming partner sends")
we_wrong = 0
we_worst = 0
for raw in mixed:
    got = decode_ours(encode_spec(raw))
    err = abs(got - raw)
    if err > 0:
        we_wrong = we_wrong + 1
    if err > we_worst:
        we_worst = err
print("  values we read wrongly : " + str(we_wrong) + " of " + str(len(mixed)))
print("  worst error            : " + str(we_worst))
print("")
print("Both halves are wrong and the pair is exact, so the test that covers them")
print("both cannot see either. The failure is not in the round trip. It is at every")
print("edge where one half meets something that is not the other half.")
```

## stdout (executed)

```text
round-trip error on the test fixture (multiples of 20)
  encoder ours + decoder ours : 0
  encoder ours + decoder spec : 84
  encoder spec + decoder ours : 105
  encoder spec + decoder spec : 0

round-trip error on production values
  encoder ours + decoder ours : 24
  encoder ours + decoder spec : 146
  encoder spec + decoder ours : 145
  encoder spec + decoder spec : 14

distinct outcomes the round-trip test can produce
  on its own fixture   : 3 of 4 states
  on production values : 4 of 4 states

  states that round-trip cleanly on the fixture: 2
  (the all-wrong state and the all-right state are two of them)

matched pairs against mismatched pairs, on production values
  worst error when encoder and decoder agree    : 24
  best error when they disagree                 : 145
  the two groups do not overlap, so agreeing matters more than being right

the code on the wire, ours against the protocol
  values where our code matches the protocol : 2
  values where it does not                   : 10
  first disagreement: raw 13 -> we send 2, protocol says 3

a conforming partner decoding what we send
  values they read wrongly : 11 of 12
  worst error              : 24

us decoding what a conforming partner sends
  values we read wrongly : 11 of 12
  worst error            : 30

Both halves are wrong and the pair is exact, so the test that covers them
both cannot see either. The failure is not in the round trip. It is at every
edge where one half meets something that is not the other half.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
