<!-- canonical: efficientnewlanguage.org/ai/examples/552-the-alert-threshold-was-set-from-the-week-it-was-written | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 552 — The alert threshold was set from the week it was written

`the_alert_threshold_was_set_from_the_week_it_was_written.eml` - An alert fires when requests per second cross 2400. That number was chosen in month 0 as twice the busiest second of the week the alert was written. What it means in each later month is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). An alert fires
# when requests per second cross 2400. That number was chosen in month 0 as
# twice the busiest second of the week the alert was written. What it means in
# each later month is computed below.
#
# Twice the observed peak is a good rule and was chosen with care. It is not a
# guess: it comes from a real week of real traffic. It leaves genuine headroom
# rather than tripping on ordinary variation. It is a single number an on-call
# engineer can hold in their head. And it was written down with the reasoning
# attached, which is more than most thresholds get.
#
# The reasoning is a ratio. The threshold is a constant. Traffic compounds at
# about 4 percent a month, which nobody would call growth worth mentioning, and
# a constant does not compound. The gap closes on its own, with no decision,
# no deploy, and no line in any changelog.
#
# What makes this expensive is not the crossing. It is that the alert keeps
# working perfectly the whole way: it fires exactly when the rule says, and the
# rule stopped meaning what it was written to mean.

1200 => peak_at_writing
2400 => threshold
104 => growth_per_month_pct
30 => days_per_month

"month 0 peak: " + str(peak_at_writing) + " rps" ^0
"threshold set to twice that: " + str(threshold) + " rps" ^0
"traffic compounds at " + str(growth_per_month_pct - 100) + " percent per month" ^0
"" ^0

"month   daily peak   threshold   headroom   alerts that month" ^0
peak_at_writing => peak
0 => crossed_at
0 => false_alerts_total
for m in [1:36]:
    int(peak * growth_per_month_pct / 100) => peak
    if peak > threshold:
        days_per_month => fires
        false_alerts_total + days_per_month => false_alerts_total
        if crossed_at == 0:
            m => crossed_at
    else:
        0 => fires
    if m % 6 == 0:
        "  " + str(m) + "        " + str(peak) + "         " + str(threshold) + "        " + str(threshold - peak) + "        " + str(fires) ^0
"" ^0

"  the threshold was first exceeded by ordinary traffic in month " + str(crossed_at) ^0
"  false alerts since then: " + str(false_alerts_total) ^0
"  nothing was deployed in month " + str(crossed_at) + " and nothing broke" ^0
"" ^0

# ---- what the alert now distinguishes ----
#
# An alert is only useful if the world where it fires differs from the world
# where it does not. By month 36 it fires in both.

peak => peak_36
peak_36 * 3 => incident_rps

"month 36" ^0
"  ordinary daily peak : " + str(peak_36) + " rps -> alert fires" ^0
"  a real incident     : " + str(incident_rps) + " rps -> alert fires" ^0
"  the two are " + str(incident_rps - peak_36) + " rps apart and produce the same page" ^0
"" ^0
"  the alert is not broken; it fires exactly when the rule says" ^0
"  the rule is 'above 2400', and above 2400 is now where the service lives" ^0
"" ^0

# ---- the number that decayed ----
#
# Expressed as a multiple of current peak, the threshold falls every month
# without ever being edited.

"the threshold, expressed as the multiple it was written to be" ^0
peak_at_writing => p
for m in [0:36]:
    if m % 6 == 0:
        "  month " + str(m) + ": threshold is " + str(int(threshold * 100 / p)) + " hundredths of the current peak" ^0
    int(p * growth_per_month_pct / 100) => p
"  it was written to be 200 hundredths and was never changed" ^0
"" ^0

# ---- the control ----
#
# The same rule expressed as a ratio rather than a constant. It is the same
# intent, the same week of data, the same engineer. It tracks, because a ratio
# recomputed against current traffic cannot go stale by sitting still.

"control - the identical rule written as a ratio against LAST month's peak" ^0
"  it must do two separate things: stay quiet on growth, and still fire on a spike" ^0
peak_at_writing => rp
0 => ratio_false_alerts
0 => incidents_caught
0 => incidents_tried
for m in [1:36]:
    rp => last_month_peak
    last_month_peak * 2 => relative_threshold
    int(rp * growth_per_month_pct / 100) => rp
    if rp > relative_threshold:
        ratio_false_alerts + days_per_month => ratio_false_alerts
    rp * 3 => spike
    incidents_tried + 1 => incidents_tried
    if spike > relative_threshold:
        incidents_caught + 1 => incidents_caught
    if m % 12 == 0:
        "  month " + str(m) + ": peak " + str(rp) + ", threshold " + str(relative_threshold) + ", a 3x spike would be " + str(spike) ^0
"  rejection side: false alerts from ordinary growth over 36 months: " + str(ratio_false_alerts) ^0
"  acceptance side: 3x spikes detected: " + str(incidents_caught) + " of " + str(incidents_tried) ^0
"  constant threshold, false alerts over the same 36 months: " + str(false_alerts_total) ^0
"  a threshold that only ever stayed quiet would pass the first test and fail the second" ^0
"" ^0
"  same intent, same data, same week; one of them decays and one does not" ^0
"" ^0

# ---- the null control ----
#
# Flat traffic. The constant threshold never decays, because what decays it is
# growth and not the passage of time. A threshold is not stale because it is
# old.

"null control - the same constant threshold against flat traffic" ^0
peak_at_writing => fp
0 => flat_false_alerts
for m in [1:36]:
    if fp > threshold:
        flat_false_alerts + days_per_month => flat_false_alerts
"  peak after 36 months : " + str(fp) + " rps" ^0
"  false alerts         : " + str(flat_false_alerts) ^0
"  the threshold is the same age and is still correct" ^0
"  so the defect is not 'old threshold', it is 'constant compared against a" ^0
"  quantity that compounds'" ^0
"" ^0

# ---- the rule ----

"how a written-down number ages" ^0
"  an absolute number       decays at the rate the world grows" ^0
"  a ratio to a live value  does not decay" ^0
"  a ratio to a frozen value decays exactly like an absolute number" ^0
"  the reasoning was a ratio and only the result was stored" ^0
"" ^0

"Twice the observed peak was a defensible rule, taken from real traffic, with" ^0
"the reasoning written down beside it. The reasoning was a ratio and what got" ^0
"stored was " + str(threshold) + ". Ordinary traffic passed it in month " + str(crossed_at) + ", and by month 36" ^0
"the page for a normal Tuesday and the page for a " + str(incident_rps) + " rps incident are the" ^0
"same page. " + str(false_alerts_total) + " alerts fired, every one of them obeying the rule exactly." ^0
```

## Python (deterministic transpilation)

```python
peak_at_writing = 1200
threshold = 2400
growth_per_month_pct = 104
days_per_month = 30
print("month 0 peak: " + str(peak_at_writing) + " rps")
print("threshold set to twice that: " + str(threshold) + " rps")
print("traffic compounds at " + str(growth_per_month_pct - 100) + " percent per month")
print("")
print("month   daily peak   threshold   headroom   alerts that month")
peak = peak_at_writing
crossed_at = 0
false_alerts_total = 0
for m in range(1, 37):
    peak = int(peak * growth_per_month_pct / 100)
    if peak > threshold:
        fires = days_per_month
        false_alerts_total = false_alerts_total + days_per_month
        if crossed_at == 0:
            crossed_at = m
    else:
        fires = 0
    if m % 6 == 0:
        print("  " + str(m) + "        " + str(peak) + "         " + str(threshold) + "        " + str(threshold - peak) + "        " + str(fires))
print("")
print("  the threshold was first exceeded by ordinary traffic in month " + str(crossed_at))
print("  false alerts since then: " + str(false_alerts_total))
print("  nothing was deployed in month " + str(crossed_at) + " and nothing broke")
print("")
peak_36 = peak
incident_rps = peak_36 * 3
print("month 36")
print("  ordinary daily peak : " + str(peak_36) + " rps -> alert fires")
print("  a real incident     : " + str(incident_rps) + " rps -> alert fires")
print("  the two are " + str(incident_rps - peak_36) + " rps apart and produce the same page")
print("")
print("  the alert is not broken; it fires exactly when the rule says")
print("  the rule is 'above 2400', and above 2400 is now where the service lives")
print("")
print("the threshold, expressed as the multiple it was written to be")
p = peak_at_writing
for m in range(0, 37):
    if m % 6 == 0:
        print("  month " + str(m) + ": threshold is " + str(int(threshold * 100 / p)) + " hundredths of the current peak")
    p = int(p * growth_per_month_pct / 100)
print("  it was written to be 200 hundredths and was never changed")
print("")
print("control - the identical rule written as a ratio against LAST month's peak")
print("  it must do two separate things: stay quiet on growth, and still fire on a spike")
rp = peak_at_writing
ratio_false_alerts = 0
incidents_caught = 0
incidents_tried = 0
for m in range(1, 37):
    last_month_peak = rp
    relative_threshold = last_month_peak * 2
    rp = int(rp * growth_per_month_pct / 100)
    if rp > relative_threshold:
        ratio_false_alerts = ratio_false_alerts + days_per_month
    spike = rp * 3
    incidents_tried = incidents_tried + 1
    if spike > relative_threshold:
        incidents_caught = incidents_caught + 1
    if m % 12 == 0:
        print("  month " + str(m) + ": peak " + str(rp) + ", threshold " + str(relative_threshold) + ", a 3x spike would be " + str(spike))
print("  rejection side: false alerts from ordinary growth over 36 months: " + str(ratio_false_alerts))
print("  acceptance side: 3x spikes detected: " + str(incidents_caught) + " of " + str(incidents_tried))
print("  constant threshold, false alerts over the same 36 months: " + str(false_alerts_total))
print("  a threshold that only ever stayed quiet would pass the first test and fail the second")
print("")
print("  same intent, same data, same week; one of them decays and one does not")
print("")
print("null control - the same constant threshold against flat traffic")
fp = peak_at_writing
flat_false_alerts = 0
for m in range(1, 37):
    if fp > threshold:
        flat_false_alerts = flat_false_alerts + days_per_month
print("  peak after 36 months : " + str(fp) + " rps")
print("  false alerts         : " + str(flat_false_alerts))
print("  the threshold is the same age and is still correct")
print("  so the defect is not 'old threshold', it is 'constant compared against a")
print("  quantity that compounds'")
print("")
print("how a written-down number ages")
print("  an absolute number       decays at the rate the world grows")
print("  a ratio to a live value  does not decay")
print("  a ratio to a frozen value decays exactly like an absolute number")
print("  the reasoning was a ratio and only the result was stored")
print("")
print("Twice the observed peak was a defensible rule, taken from real traffic, with")
print("the reasoning written down beside it. The reasoning was a ratio and what got")
print("stored was " + str(threshold) + ". Ordinary traffic passed it in month " + str(crossed_at) + ", and by month 36")
print("the page for a normal Tuesday and the page for a " + str(incident_rps) + " rps incident are the")
print("same page. " + str(false_alerts_total) + " alerts fired, every one of them obeying the rule exactly.")
```

## stdout (executed)

```text
month 0 peak: 1200 rps
threshold set to twice that: 2400 rps
traffic compounds at 4 percent per month

month   daily peak   threshold   headroom   alerts that month
  6        1515         2400        885        0
  12        1914         2400        486        0
  18        2419         2400        -19        30
  24        3057         2400        -657        30
  30        3866         2400        -1466        30
  36        4888         2400        -2488        30

  the threshold was first exceeded by ordinary traffic in month 18
  false alerts since then: 570
  nothing was deployed in month 18 and nothing broke

month 36
  ordinary daily peak : 4888 rps -> alert fires
  a real incident     : 14664 rps -> alert fires
  the two are 9776 rps apart and produce the same page

  the alert is not broken; it fires exactly when the rule says
  the rule is 'above 2400', and above 2400 is now where the service lives

the threshold, expressed as the multiple it was written to be
  month 0: threshold is 200 hundredths of the current peak
  month 6: threshold is 158 hundredths of the current peak
  month 12: threshold is 125 hundredths of the current peak
  month 18: threshold is 99 hundredths of the current peak
  month 24: threshold is 78 hundredths of the current peak
  month 30: threshold is 62 hundredths of the current peak
  month 36: threshold is 49 hundredths of the current peak
  it was written to be 200 hundredths and was never changed

control - the identical rule written as a ratio against LAST month's peak
  it must do two separate things: stay quiet on growth, and still fire on a spike
  month 12: peak 1914, threshold 3682, a 3x spike would be 5742
  month 24: peak 3057, threshold 5880, a 3x spike would be 9171
  month 36: peak 4888, threshold 9400, a 3x spike would be 14664
  rejection side: false alerts from ordinary growth over 36 months: 0
  acceptance side: 3x spikes detected: 36 of 36
  constant threshold, false alerts over the same 36 months: 570
  a threshold that only ever stayed quiet would pass the first test and fail the second

  same intent, same data, same week; one of them decays and one does not

null control - the same constant threshold against flat traffic
  peak after 36 months : 1200 rps
  false alerts         : 0
  the threshold is the same age and is still correct
  so the defect is not 'old threshold', it is 'constant compared against a
  quantity that compounds'

how a written-down number ages
  an absolute number       decays at the rate the world grows
  a ratio to a live value  does not decay
  a ratio to a frozen value decays exactly like an absolute number
  the reasoning was a ratio and only the result was stored

Twice the observed peak was a defensible rule, taken from real traffic, with
the reasoning written down beside it. The reasoning was a ratio and what got
stored was 2400. Ordinary traffic passed it in month 18, and by month 36
the page for a normal Tuesday and the page for a 14664 rps incident are the
same page. 570 alerts fired, every one of them obeying the rule exactly.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
