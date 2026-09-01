<!-- canonical: efficientnewlanguage.org/ai/examples/645-the-counter-reset-at-midnight-and-the-shift-crossed-it | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 645 — The counter reset at midnight and the shift crossed it

`the_counter_reset_at_midnight_and_the_shift_crossed_it.eml` - The daily counter resets at midnight, which is what a daily counter does. When the page fires is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The daily counter
# resets at midnight, which is what a daily counter does. When the page fires is
# computed below.
#
# The counter is correct. "Errors today" means errors since the start of the UTC
# day, it is documented that way, the reset is atomic, and the dashboard label
# says today. Nobody has ever mis-implemented it and there is no drift.
#
# The threshold on it is a statement about a RATE, written as a level, on a
# quantity that returns to zero at a moment nobody chose with an incident in
# mind. An incident that crosses that moment starts its accumulation again.
#
# The night shift runs 22:00 to 06:00. The reset sits two hours into it.

1850 => errors_per_hour
5000 => page_threshold
22 => shift_starts_hour
2 => hours_from_shift_start_to_midnight

# Without a reset, the threshold is crossed once the accumulation reaches it.
# Rounded UP: this is a time-to-reach, and truncating it names an hour at which
# the count is still below the threshold. int(5000/1850) is 2, and two hours
# gives 3700, which does not page.
int((page_threshold + errors_per_hour - 1) / errors_per_hour) => hours_to_threshold_uninterrupted
# With the reset, the count at midnight is discarded and accumulation restarts.
hours_from_shift_start_to_midnight * errors_per_hour => discarded_at_midnight
hours_to_threshold_uninterrupted => hours_after_midnight_to_threshold
hours_from_shift_start_to_midnight + hours_after_midnight_to_threshold => hours_from_shift_start_to_the_page

"errors per hour            : " + str(errors_per_hour) ^0
"page threshold             : " + str(page_threshold) ^0
"shift starts at hour       : " + str(shift_starts_hour) ^0
"" ^0
"hours to threshold, uninterrupted : " + str(hours_to_threshold_uninterrupted) ^0
"errors discarded at midnight      : " + str(discarded_at_midnight) ^0
"hours from shift start to the page: " + str(hours_from_shift_start_to_the_page) ^0
"" ^0

# ---- what the counter guarantees ----

"the counter" ^0
"  meaning        : errors since the start of the utc day" ^0
"  documented     : yes, in those words" ^0
"  reset          : atomic, at 00:00 utc" ^0
"  drift observed : none" ^0
"  label on the dashboard : errors today" ^0
"  verdict        : CORRECT" ^0
"" ^0
"  it is not lying and it is not misnamed; today is today" ^0
"" ^0

# ---- what the threshold means to a reader ----

"the alert as written" ^0
"  condition      : errors today is above " + str(page_threshold) ^0
"  what it is for : catching a sustained error rate" ^0
"  what it reads  : a level on a quantity that is reset" ^0
"  the two agree  : for any incident inside one day" ^0
"" ^0
"  the rule and the intent coincide most of the time, which" ^0
"  is why nobody has looked at it" ^0
"" ^0

# ---- the delay ----

hours_from_shift_start_to_the_page - hours_to_threshold_uninterrupted => hours_of_delay
hours_of_delay * errors_per_hour => extra_errors_during_the_delay
int(hours_of_delay * 10000 / hours_to_threshold_uninterrupted) => delay_per_myriad

"an incident starting at 22:00" ^0
"  would page at            : hour " + str(hours_to_threshold_uninterrupted) + " of the incident" ^0
"  pages at                 : hour " + str(hours_from_shift_start_to_the_page) ^0
"  delay, hours             : " + str(hours_of_delay) ^0
"  extra errors in the delay: " + str(extra_errors_during_the_delay) ^0
"  delay as a share of the intended time : " + str(delay_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the graph shows ----

# The counter halving at midnight looks exactly like a partial recovery, and the
# on-call engineer watching it has no reason to read it as an artifact.
"the graph at 00:00" ^0
"  value before  : " + str(discarded_at_midnight) ^0
"  value after   : 0" ^0
"  shape         : a vertical drop to zero" ^0
"  reads as      : the thing recovering" ^0
"  is            : the day changing" ^0
"" ^0

# ---- null control ----

# The same threshold on a sliding window of the same length instead of a
# calendar day.
0 => nc_hours_of_delay
hours_to_threshold_uninterrupted => nc_hours_from_shift_start_to_the_page

"null control - a sliding window instead of a calendar day" ^0
"  counter correctness : unchanged, both are correct" ^0
"  hours to the page   : " + str(nc_hours_from_shift_start_to_the_page) ^0
"  delay, hours        : " + str(nc_hours_of_delay) ^0
"  the counter did not become more accurate; the window" ^0
"  stopped having an edge in the middle of the night" ^0
"" ^0

# ---- the rule ----

"what a correct daily counter guarantees" ^0
"  the number is the count for this day : exactly" ^0
"  a threshold on it detects a rate     : not addressed;" ^0
"    the count is reset on a boundary chosen by the" ^0
"    calendar, and an incident does not know about it" ^0
"" ^0
"a level on a resetting quantity is a rate alarm with a blind" ^0
"spot the width of its own reset; the boundary is invisible" ^0
"because it is correct" ^0
"" ^0

"The counter is correct: errors since the start of the UTC day, documented," ^0
"atomic reset, no drift. At " + str(errors_per_hour) + " errors an hour the " + str(page_threshold) + " threshold is reached in" ^0
str(hours_to_threshold_uninterrupted) + " hours, but an incident starting at 22:00 has " + str(discarded_at_midnight) + " errors discarded at" ^0
"midnight and pages " + str(hours_of_delay) + " hours late - " + str(delay_per_myriad) + " per ten thousand of the intended" ^0
"time - after " + str(extra_errors_during_the_delay) + " more errors, on a graph whose drop to zero reads as recovery." ^0
```

## Python (deterministic transpilation)

```python
errors_per_hour = 1850
page_threshold = 5000
shift_starts_hour = 22
hours_from_shift_start_to_midnight = 2
hours_to_threshold_uninterrupted = int((page_threshold + errors_per_hour - 1) / errors_per_hour)
discarded_at_midnight = hours_from_shift_start_to_midnight * errors_per_hour
hours_after_midnight_to_threshold = hours_to_threshold_uninterrupted
hours_from_shift_start_to_the_page = hours_from_shift_start_to_midnight + hours_after_midnight_to_threshold
print("errors per hour            : " + str(errors_per_hour))
print("page threshold             : " + str(page_threshold))
print("shift starts at hour       : " + str(shift_starts_hour))
print("")
print("hours to threshold, uninterrupted : " + str(hours_to_threshold_uninterrupted))
print("errors discarded at midnight      : " + str(discarded_at_midnight))
print("hours from shift start to the page: " + str(hours_from_shift_start_to_the_page))
print("")
print("the counter")
print("  meaning        : errors since the start of the utc day")
print("  documented     : yes, in those words")
print("  reset          : atomic, at 00:00 utc")
print("  drift observed : none")
print("  label on the dashboard : errors today")
print("  verdict        : CORRECT")
print("")
print("  it is not lying and it is not misnamed; today is today")
print("")
print("the alert as written")
print("  condition      : errors today is above " + str(page_threshold))
print("  what it is for : catching a sustained error rate")
print("  what it reads  : a level on a quantity that is reset")
print("  the two agree  : for any incident inside one day")
print("")
print("  the rule and the intent coincide most of the time, which")
print("  is why nobody has looked at it")
print("")
hours_of_delay = hours_from_shift_start_to_the_page - hours_to_threshold_uninterrupted
extra_errors_during_the_delay = hours_of_delay * errors_per_hour
delay_per_myriad = int(hours_of_delay * 10000 / hours_to_threshold_uninterrupted)
print("an incident starting at 22:00")
print("  would page at            : hour " + str(hours_to_threshold_uninterrupted) + " of the incident")
print("  pages at                 : hour " + str(hours_from_shift_start_to_the_page))
print("  delay, hours             : " + str(hours_of_delay))
print("  extra errors in the delay: " + str(extra_errors_during_the_delay))
print("  delay as a share of the intended time : " + str(delay_per_myriad) + " per ten thousand")
print("")
print("the graph at 00:00")
print("  value before  : " + str(discarded_at_midnight))
print("  value after   : 0")
print("  shape         : a vertical drop to zero")
print("  reads as      : the thing recovering")
print("  is            : the day changing")
print("")
nc_hours_of_delay = 0
nc_hours_from_shift_start_to_the_page = hours_to_threshold_uninterrupted
print("null control - a sliding window instead of a calendar day")
print("  counter correctness : unchanged, both are correct")
print("  hours to the page   : " + str(nc_hours_from_shift_start_to_the_page))
print("  delay, hours        : " + str(nc_hours_of_delay))
print("  the counter did not become more accurate; the window")
print("  stopped having an edge in the middle of the night")
print("")
print("what a correct daily counter guarantees")
print("  the number is the count for this day : exactly")
print("  a threshold on it detects a rate     : not addressed;")
print("    the count is reset on a boundary chosen by the")
print("    calendar, and an incident does not know about it")
print("")
print("a level on a resetting quantity is a rate alarm with a blind")
print("spot the width of its own reset; the boundary is invisible")
print("because it is correct")
print("")
print("The counter is correct: errors since the start of the UTC day, documented,")
print("atomic reset, no drift. At " + str(errors_per_hour) + " errors an hour the " + str(page_threshold) + " threshold is reached in")
print(str(hours_to_threshold_uninterrupted) + " hours, but an incident starting at 22:00 has " + str(discarded_at_midnight) + " errors discarded at")
print("midnight and pages " + str(hours_of_delay) + " hours late - " + str(delay_per_myriad) + " per ten thousand of the intended")
print("time - after " + str(extra_errors_during_the_delay) + " more errors, on a graph whose drop to zero reads as recovery.")
```

## stdout (executed)

```text
errors per hour            : 1850
page threshold             : 5000
shift starts at hour       : 22

hours to threshold, uninterrupted : 3
errors discarded at midnight      : 3700
hours from shift start to the page: 5

the counter
  meaning        : errors since the start of the utc day
  documented     : yes, in those words
  reset          : atomic, at 00:00 utc
  drift observed : none
  label on the dashboard : errors today
  verdict        : CORRECT

  it is not lying and it is not misnamed; today is today

the alert as written
  condition      : errors today is above 5000
  what it is for : catching a sustained error rate
  what it reads  : a level on a quantity that is reset
  the two agree  : for any incident inside one day

  the rule and the intent coincide most of the time, which
  is why nobody has looked at it

an incident starting at 22:00
  would page at            : hour 3 of the incident
  pages at                 : hour 5
  delay, hours             : 2
  extra errors in the delay: 3700
  delay as a share of the intended time : 6666 per ten thousand

the graph at 00:00
  value before  : 3700
  value after   : 0
  shape         : a vertical drop to zero
  reads as      : the thing recovering
  is            : the day changing

null control - a sliding window instead of a calendar day
  counter correctness : unchanged, both are correct
  hours to the page   : 3
  delay, hours        : 0
  the counter did not become more accurate; the window
  stopped having an edge in the middle of the night

what a correct daily counter guarantees
  the number is the count for this day : exactly
  a threshold on it detects a rate     : not addressed;
    the count is reset on a boundary chosen by the
    calendar, and an incident does not know about it

a level on a resetting quantity is a rate alarm with a blind
spot the width of its own reset; the boundary is invisible
because it is correct

The counter is correct: errors since the start of the UTC day, documented,
atomic reset, no drift. At 1850 errors an hour the 5000 threshold is reached in
3 hours, but an incident starting at 22:00 has 3700 errors discarded at
midnight and pages 2 hours late - 6666 per ten thousand of the intended
time - after 3700 more errors, on a graph whose drop to zero reads as recovery.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
