<!-- canonical: efficientnewlanguage.org/ai/examples/556-the-compression-helped-until-the-data-stopped-being-similar | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 556 — The compression helped until the data stopped being similar

`the_compression_helped_until_the_data_stopped_being_similar.eml` - The archive ingests 1000 GB a month, every month, and has done for a year. What it stores is computed below, along with the capacity forecast that was written in month 1.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The archive
# ingests 1000 GB a month, every month, and has done for a year. What it stores
# is computed below, along with the capacity forecast that was written in
# month 1.
#
# Forecasting from the measured compression ratio is the right method and was
# done carefully. The ratio was not assumed, it was measured over a full month
# of real traffic. It was re-measured in month 2 and month 3 and came back the
# same both times. Three consistent measurements is more diligence than most
# forecasts get, and the number that came out - 7.4 to 1 - was correct.
#
# A blended compression ratio is not an average of the ratios. It is a weighted
# harmonic mean, which is dominated by its worst term. A class that does not
# compress contributes its bytes at full size no matter how small its share of
# the input is, so it occupies a share of the OUTPUT far larger than its share
# of the input, from the very first day.
#
# In month 1 the incompressible class was 5 percent of what came in and 37
# percent of what was kept. Nobody looked at the second number.

1000 => raw_gb
5000 => capacity_gb

# [class, compression ratio to 1, percent of intake in month 1, percent in month 12]
[["logs", 20, 70, 40], ["json", 5, 25, 25], ["media", 1, 5, 35]] => classes

"intake is " + str(raw_gb) + " GB per month and has never changed" ^0
"" ^0

# ---- month 1, when the forecast was written ----

"month 1" ^0
"class    ratio   intake GB   share of intake   stored GB" ^0
0 => stored_m1
for c in classes:
    int(raw_gb * c[2] / 100) => intake
    int(intake / c[1]) => stored
    stored_m1 + stored => stored_m1
    "  " + c[0] + "     " + str(c[1]) + ":1     " + str(intake) + "           " + str(c[2]) + " pct          " + str(stored) ^0
"  total stored: " + str(stored_m1) + " GB" ^0
"  blended ratio: " + str(int(raw_gb * 100 / stored_m1)) + " hundredths to 1" ^0
"" ^0

# The number nobody printed: share of OUTPUT, not share of input.

"  the same month, read by share of what was KEPT" ^0
for c in classes:
    int(raw_gb * c[2] / 100) => intake
    int(intake / c[1]) => stored
    "    " + c[0] + " is " + str(c[2]) + " pct of intake and " + str(int(stored * 100 / stored_m1)) + " pct of storage" ^0
"" ^0

# ---- month 12 ----

"month 12, after the mix moved" ^0
"class    ratio   intake GB   share of intake   stored GB" ^0
0 => stored_m12
for c in classes:
    int(raw_gb * c[3] / 100) => intake
    int(intake / c[1]) => stored
    stored_m12 + stored => stored_m12
    "  " + c[0] + "     " + str(c[1]) + ":1     " + str(intake) + "           " + str(c[3]) + " pct          " + str(stored) ^0
"  total stored: " + str(stored_m12) + " GB" ^0
"  blended ratio: " + str(int(raw_gb * 100 / stored_m12)) + " hundredths to 1" ^0
"" ^0
"  the same month, read by share of what was KEPT" ^0
for c in classes:
    int(raw_gb * c[3] / 100) => intake
    int(intake / c[1]) => stored
    "    " + c[0] + " is " + str(c[3]) + " pct of intake and " + str(int(stored * 100 / stored_m12)) + " pct of storage" ^0
"" ^0

# ---- what moved and what did not ----

"intake  : " + str(raw_gb) + " GB in month 1 and " + str(raw_gb) + " GB in month 12, unchanged" ^0
"stored  : " + str(stored_m1) + " GB in month 1 and " + str(stored_m12) + " GB in month 12" ^0
"that is a factor of " + str(int(stored_m12 * 10 / stored_m1)) + " tenths, from an intake that did not move" ^0
"" ^0

int(capacity_gb / stored_m1) => months_forecast
int(capacity_gb / stored_m12) => months_actual

"capacity           : " + str(capacity_gb) + " GB" ^0
"forecast in month 1: " + str(months_forecast) + " months of headroom" ^0
"rate in month 12   : " + str(months_actual) + " months of headroom" ^0
"the forecast was arithmetic on a correctly measured number" ^0
"" ^0

# ---- why the worst class runs away with the output ----
#
# A class contributes intake times its share, divided by its ratio. Dividing by
# 1 does nothing. So the incompressible class enters the output at full size
# while every other class enters at a fraction, and the output share of the
# incompressible class exceeds its input share by exactly the blended ratio.

"the mechanism, stated as arithmetic" ^0
"  a class at ratio r contributes intake_share / r to the output" ^0
"  at r = 1 the division does nothing, so it contributes in full" ^0
"  every other class is divided down, so it contributes less than its share" ^0
"  therefore the r = 1 class always occupies MORE of the output than the input" ^0
"  the multiplier is the blended ratio itself" ^0
0 => m1_media_in
0 => m1_media_out
for c in classes:
    if c[1] == 1:
        c[2] => m1_media_in
        int(int(raw_gb * c[2] / 100) / c[1]) => m1_media_out
"  month 1: media was " + str(m1_media_in) + " pct of intake and " + str(int(m1_media_out * 100 / stored_m1)) + " pct of storage" ^0
"  the ratio between those two numbers is " + str(int(int(m1_media_out * 100 / stored_m1) * 100 / m1_media_in)) + " hundredths" ^0
"  the blended ratio in month 1 was " + str(int(raw_gb * 100 / stored_m1)) + " hundredths" ^0
"  they are the same number, and they are the same number by construction" ^0
"" ^0

# ---- the control ----
#
# If ingest had grown, storage growth would be unremarkable and the forecast
# would have been wrong for an ordinary reason. Ingest is flat to the byte in
# every month, which is what makes the mix the only remaining explanation.

"control - the quantity that did not change" ^0
0 => intake_m1
0 => intake_m12
for c in classes:
    intake_m1 + int(raw_gb * c[2] / 100) => intake_m1
    intake_m12 + int(raw_gb * c[3] / 100) => intake_m12
"  intake month 1  : " + str(intake_m1) + " GB" ^0
"  intake month 12 : " + str(intake_m12) + " GB" ^0
"  difference      : " + str(intake_m12 - intake_m1) + " GB" ^0
"  the ingest graph was flat for twelve months and was read as reassuring" ^0
"" ^0

# ---- the null control ----
#
# A mix change of the same magnitude, but between two classes that compress
# identically. 30 points of intake move from one to the other. Stored output
# moves by zero. So "the mix changed" is not the cause on its own - the cause
# is that the mix moved TOWARD the term that does not divide.

[["logs_a", 20, 70, 40], ["logs_b", 20, 25, 55], ["media", 1, 5, 5]] => same_ratio_mix

"null control - a 30 point mix shift between two equally compressible classes" ^0
0 => n_m1
0 => n_m12
for c in same_ratio_mix:
    n_m1 + int(int(raw_gb * c[2] / 100) / c[1]) => n_m1
    n_m12 + int(int(raw_gb * c[3] / 100) / c[1]) => n_m12
"  stored before : " + str(n_m1) + " GB" ^0
"  stored after  : " + str(n_m12) + " GB" ^0
"  difference    : " + str(n_m12 - n_m1) + " GB" ^0
"  30 points moved and the output did not, because both terms divide by 20" ^0
"" ^0

"The ratio was measured over a full month of real traffic and re-measured twice" ^0
"more, which is why nobody doubted it. It was a true statement about a mix, and" ^0
"it was read as a true statement about the archive. Intake never moved off" ^0
str(raw_gb) + " GB a month. Storage went from " + str(stored_m1) + " to " + str(stored_m12) + " GB a month, and the" ^0
"headroom went from " + str(months_forecast) + " months to " + str(months_actual) + "." ^0
```

## Python (deterministic transpilation)

```python
raw_gb = 1000
capacity_gb = 5000
classes = [["logs", 20, 70, 40], ["json", 5, 25, 25], ["media", 1, 5, 35]]
print("intake is " + str(raw_gb) + " GB per month and has never changed")
print("")
print("month 1")
print("class    ratio   intake GB   share of intake   stored GB")
stored_m1 = 0
for c in classes:
    intake = int(raw_gb * c[2] / 100)
    stored = int(intake / c[1])
    stored_m1 = stored_m1 + stored
    print("  " + c[0] + "     " + str(c[1]) + ":1     " + str(intake) + "           " + str(c[2]) + " pct          " + str(stored))
print("  total stored: " + str(stored_m1) + " GB")
print("  blended ratio: " + str(int(raw_gb * 100 / stored_m1)) + " hundredths to 1")
print("")
print("  the same month, read by share of what was KEPT")
for c in classes:
    intake = int(raw_gb * c[2] / 100)
    stored = int(intake / c[1])
    print("    " + c[0] + " is " + str(c[2]) + " pct of intake and " + str(int(stored * 100 / stored_m1)) + " pct of storage")
print("")
print("month 12, after the mix moved")
print("class    ratio   intake GB   share of intake   stored GB")
stored_m12 = 0
for c in classes:
    intake = int(raw_gb * c[3] / 100)
    stored = int(intake / c[1])
    stored_m12 = stored_m12 + stored
    print("  " + c[0] + "     " + str(c[1]) + ":1     " + str(intake) + "           " + str(c[3]) + " pct          " + str(stored))
print("  total stored: " + str(stored_m12) + " GB")
print("  blended ratio: " + str(int(raw_gb * 100 / stored_m12)) + " hundredths to 1")
print("")
print("  the same month, read by share of what was KEPT")
for c in classes:
    intake = int(raw_gb * c[3] / 100)
    stored = int(intake / c[1])
    print("    " + c[0] + " is " + str(c[3]) + " pct of intake and " + str(int(stored * 100 / stored_m12)) + " pct of storage")
print("")
print("intake  : " + str(raw_gb) + " GB in month 1 and " + str(raw_gb) + " GB in month 12, unchanged")
print("stored  : " + str(stored_m1) + " GB in month 1 and " + str(stored_m12) + " GB in month 12")
print("that is a factor of " + str(int(stored_m12 * 10 / stored_m1)) + " tenths, from an intake that did not move")
print("")
months_forecast = int(capacity_gb / stored_m1)
months_actual = int(capacity_gb / stored_m12)
print("capacity           : " + str(capacity_gb) + " GB")
print("forecast in month 1: " + str(months_forecast) + " months of headroom")
print("rate in month 12   : " + str(months_actual) + " months of headroom")
print("the forecast was arithmetic on a correctly measured number")
print("")
print("the mechanism, stated as arithmetic")
print("  a class at ratio r contributes intake_share / r to the output")
print("  at r = 1 the division does nothing, so it contributes in full")
print("  every other class is divided down, so it contributes less than its share")
print("  therefore the r = 1 class always occupies MORE of the output than the input")
print("  the multiplier is the blended ratio itself")
m1_media_in = 0
m1_media_out = 0
for c in classes:
    if c[1] == 1:
        m1_media_in = c[2]
        m1_media_out = int(int(raw_gb * c[2] / 100) / c[1])
print("  month 1: media was " + str(m1_media_in) + " pct of intake and " + str(int(m1_media_out * 100 / stored_m1)) + " pct of storage")
print("  the ratio between those two numbers is " + str(int(int(m1_media_out * 100 / stored_m1) * 100 / m1_media_in)) + " hundredths")
print("  the blended ratio in month 1 was " + str(int(raw_gb * 100 / stored_m1)) + " hundredths")
print("  they are the same number, and they are the same number by construction")
print("")
print("control - the quantity that did not change")
intake_m1 = 0
intake_m12 = 0
for c in classes:
    intake_m1 = intake_m1 + int(raw_gb * c[2] / 100)
    intake_m12 = intake_m12 + int(raw_gb * c[3] / 100)
print("  intake month 1  : " + str(intake_m1) + " GB")
print("  intake month 12 : " + str(intake_m12) + " GB")
print("  difference      : " + str(intake_m12 - intake_m1) + " GB")
print("  the ingest graph was flat for twelve months and was read as reassuring")
print("")
same_ratio_mix = [["logs_a", 20, 70, 40], ["logs_b", 20, 25, 55], ["media", 1, 5, 5]]
print("null control - a 30 point mix shift between two equally compressible classes")
n_m1 = 0
n_m12 = 0
for c in same_ratio_mix:
    n_m1 = n_m1 + int(int(raw_gb * c[2] / 100) / c[1])
    n_m12 = n_m12 + int(int(raw_gb * c[3] / 100) / c[1])
print("  stored before : " + str(n_m1) + " GB")
print("  stored after  : " + str(n_m12) + " GB")
print("  difference    : " + str(n_m12 - n_m1) + " GB")
print("  30 points moved and the output did not, because both terms divide by 20")
print("")
print("The ratio was measured over a full month of real traffic and re-measured twice")
print("more, which is why nobody doubted it. It was a true statement about a mix, and")
print("it was read as a true statement about the archive. Intake never moved off")
print(str(raw_gb) + " GB a month. Storage went from " + str(stored_m1) + " to " + str(stored_m12) + " GB a month, and the")
print("headroom went from " + str(months_forecast) + " months to " + str(months_actual) + ".")
```

## stdout (executed)

```text
intake is 1000 GB per month and has never changed

month 1
class    ratio   intake GB   share of intake   stored GB
  logs     20:1     700           70 pct          35
  json     5:1     250           25 pct          50
  media     1:1     50           5 pct          50
  total stored: 135 GB
  blended ratio: 740 hundredths to 1

  the same month, read by share of what was KEPT
    logs is 70 pct of intake and 25 pct of storage
    json is 25 pct of intake and 37 pct of storage
    media is 5 pct of intake and 37 pct of storage

month 12, after the mix moved
class    ratio   intake GB   share of intake   stored GB
  logs     20:1     400           40 pct          20
  json     5:1     250           25 pct          50
  media     1:1     350           35 pct          350
  total stored: 420 GB
  blended ratio: 238 hundredths to 1

  the same month, read by share of what was KEPT
    logs is 40 pct of intake and 4 pct of storage
    json is 25 pct of intake and 11 pct of storage
    media is 35 pct of intake and 83 pct of storage

intake  : 1000 GB in month 1 and 1000 GB in month 12, unchanged
stored  : 135 GB in month 1 and 420 GB in month 12
that is a factor of 31 tenths, from an intake that did not move

capacity           : 5000 GB
forecast in month 1: 37 months of headroom
rate in month 12   : 11 months of headroom
the forecast was arithmetic on a correctly measured number

the mechanism, stated as arithmetic
  a class at ratio r contributes intake_share / r to the output
  at r = 1 the division does nothing, so it contributes in full
  every other class is divided down, so it contributes less than its share
  therefore the r = 1 class always occupies MORE of the output than the input
  the multiplier is the blended ratio itself
  month 1: media was 5 pct of intake and 37 pct of storage
  the ratio between those two numbers is 740 hundredths
  the blended ratio in month 1 was 740 hundredths
  they are the same number, and they are the same number by construction

control - the quantity that did not change
  intake month 1  : 1000 GB
  intake month 12 : 1000 GB
  difference      : 0 GB
  the ingest graph was flat for twelve months and was read as reassuring

null control - a 30 point mix shift between two equally compressible classes
  stored before : 97 GB
  stored after  : 97 GB
  difference    : 0 GB
  30 points moved and the output did not, because both terms divide by 20

The ratio was measured over a full month of real traffic and re-measured twice
more, which is why nobody doubted it. It was a true statement about a mix, and
it was read as a true statement about the archive. Intake never moved off
1000 GB a month. Storage went from 135 to 420 GB a month, and the
headroom went from 37 months to 11.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
