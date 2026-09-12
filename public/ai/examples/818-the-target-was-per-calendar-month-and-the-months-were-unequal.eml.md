<!-- canonical: efficientnewlanguage.org/ai/examples/818-the-target-was-per-calendar-month-and-the-months-were-unequal | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 818 — The target was per calendar month and the months were unequal

`the_target_was_per_calendar_month_and_the_months_were_unequal.eml` - The team hit its monthly target in July and missed it in February, and both counts are right. What the target is denominated in is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The team hit its
# monthly target in July and missed it in February, and both counts are right.
# What the target is denominated in is computed below.
#
# The target is measured honestly. It counts real completed units, not estimates;
# the same definition of a unit is used every month; nothing is pulled forward or
# pushed back across the boundary; and the month boundary is the calendar's.
#
# The target is a fixed number per calendar month, and the months are unequal.

300000 => target_per_calendar_month
10000 => steady_units_per_day
28 => days_in_february
31 => days_in_july

steady_units_per_day * days_in_february => february_total
steady_units_per_day * days_in_july => july_total
february_total - target_per_calendar_month => february_against_target
july_total - target_per_calendar_month => july_against_target
int(target_per_calendar_month / days_in_february) => daily_needed_in_february
int(target_per_calendar_month / days_in_july) => daily_needed_in_july

"target per calendar month       : " + str(target_per_calendar_month) ^0
"steady output per day           : " + str(steady_units_per_day) ^0
"" ^0
"february (28 days) total        : " + str(february_total) ^0
"  against target                : " + str(february_against_target) ^0
"july (31 days) total            : " + str(july_total) ^0
"  against target                : " + str(july_against_target) ^0
"" ^0
"daily rate needed in february   : " + str(daily_needed_in_february) ^0
"daily rate needed in july       : " + str(daily_needed_in_july) ^0
"" ^0

# ---- what the count verified ----

"the monthly count" ^0
"  counts : real completed units, not estimates" ^0
"  a unit : the same definition every month" ^0
"  pulled across the boundary : nothing" ^0
"  boundary : the calendar's" ^0
"  months counted correctly : both" ^0
"  verdict : MET IN JULY, MISSED IN FEBRUARY" ^0
"" ^0
"  refusing to pull units across the month boundary is the" ^0
"  part done right here, and it is why each month's count" ^0
"  is clean" ^0
"" ^0

# ---- what the target is denominated in ----

"the target per month" ^0
"  what it is : one fixed number, every month" ^0
"  what a month is : 28 to 31 days, not a fixed span" ^0
"  so the daily rate it demands : varies by " + str(daily_needed_in_february - daily_needed_in_july) ^0
"    between the shortest and longest month" ^0
"  a steady " + str(steady_units_per_day) + " a day : clears the bar in a long month" ^0
"  the same rate in february : falls short by " + str(0 - february_against_target) ^0
"" ^0

# ---- what the trend line shows ----

"the month-over-month report" ^0
"  july : " + str(july_total) + ", over target" ^0
"  february : " + str(february_total) + ", under target" ^0
"  the story it tells : the team slipped in february" ^0
"  what actually changed in the work : nothing; " + str(steady_units_per_day) + " a" ^0
"    day throughout" ^0
"  what changed : the number of days the target was spread" ^0
"    over" ^0
"" ^0

# ---- null control ----

# The same output, measured against a per-day target so the bar scales with the
# length of the month.
280000 => nc_february_total
280000 => nc_february_target_at_a_daily_rate
0 => nc_months_that_look_like_a_change

"null control - a per-day target, not a per-month one" ^0
"  february total : " + str(nc_february_total) ^0
"  february target at " + str(steady_units_per_day) + " a day : " + str(nc_february_target_at_a_daily_rate) ^0
"  months that look like a change : " ^0
"    " + str(nc_months_that_look_like_a_change) ^0
"  no unit and no count changed; the target stopped being a" ^0
"  fixed monthly number and started scaling with the days" ^0
"" ^0

# ---- the rule ----

"what a monthly target guarantees" ^0
"  the month's count reached the number : exactly, real" ^0
"    units, one definition, nothing shifted across the" ^0
"    boundary" ^0
"  the team's output changed month to month : not" ^0
"    addressed; the target is per calendar month and the" ^0
"    months are unequal, so a steady " + str(steady_units_per_day) + " a day misses a" ^0
"    28-day month and beats a 31-day one with the work" ^0
"    unchanged" ^0
"" ^0

"a rate compared to a fixed monthly number is compared to a moving bar, because" ^0
"a month is a variable amount of time; meeting it or missing it can be a fact" ^0
"about the calendar and none about the work" ^0
"" ^0

"Each month counts real units, one definition, nothing shifted - both counts are" ^0
"right. The target is a fixed " + str(target_per_calendar_month) + " per calendar month and the months are" ^0
"unequal, so a steady " + str(steady_units_per_day) + " a day beats july by " + str(july_against_target) + " and misses february by " ^0
"" + str(0 - february_against_target) + ", with " + str(nc_months_that_look_like_a_change) + " real change in the work." ^0
```

## Python (deterministic transpilation)

```python
target_per_calendar_month = 300000
steady_units_per_day = 10000
days_in_february = 28
days_in_july = 31
february_total = steady_units_per_day * days_in_february
july_total = steady_units_per_day * days_in_july
february_against_target = february_total - target_per_calendar_month
july_against_target = july_total - target_per_calendar_month
daily_needed_in_february = int(target_per_calendar_month / days_in_february)
daily_needed_in_july = int(target_per_calendar_month / days_in_july)
print("target per calendar month       : " + str(target_per_calendar_month))
print("steady output per day           : " + str(steady_units_per_day))
print("")
print("february (28 days) total        : " + str(february_total))
print("  against target                : " + str(february_against_target))
print("july (31 days) total            : " + str(july_total))
print("  against target                : " + str(july_against_target))
print("")
print("daily rate needed in february   : " + str(daily_needed_in_february))
print("daily rate needed in july       : " + str(daily_needed_in_july))
print("")
print("the monthly count")
print("  counts : real completed units, not estimates")
print("  a unit : the same definition every month")
print("  pulled across the boundary : nothing")
print("  boundary : the calendar's")
print("  months counted correctly : both")
print("  verdict : MET IN JULY, MISSED IN FEBRUARY")
print("")
print("  refusing to pull units across the month boundary is the")
print("  part done right here, and it is why each month's count")
print("  is clean")
print("")
print("the target per month")
print("  what it is : one fixed number, every month")
print("  what a month is : 28 to 31 days, not a fixed span")
print("  so the daily rate it demands : varies by " + str(daily_needed_in_february - daily_needed_in_july))
print("    between the shortest and longest month")
print("  a steady " + str(steady_units_per_day) + " a day : clears the bar in a long month")
print("  the same rate in february : falls short by " + str(0 - february_against_target))
print("")
print("the month-over-month report")
print("  july : " + str(july_total) + ", over target")
print("  february : " + str(february_total) + ", under target")
print("  the story it tells : the team slipped in february")
print("  what actually changed in the work : nothing; " + str(steady_units_per_day) + " a")
print("    day throughout")
print("  what changed : the number of days the target was spread")
print("    over")
print("")
nc_february_total = 280000
nc_february_target_at_a_daily_rate = 280000
nc_months_that_look_like_a_change = 0
print("null control - a per-day target, not a per-month one")
print("  february total : " + str(nc_february_total))
print("  february target at " + str(steady_units_per_day) + " a day : " + str(nc_february_target_at_a_daily_rate))
print("  months that look like a change : ")
print("    " + str(nc_months_that_look_like_a_change))
print("  no unit and no count changed; the target stopped being a")
print("  fixed monthly number and started scaling with the days")
print("")
print("what a monthly target guarantees")
print("  the month's count reached the number : exactly, real")
print("    units, one definition, nothing shifted across the")
print("    boundary")
print("  the team's output changed month to month : not")
print("    addressed; the target is per calendar month and the")
print("    months are unequal, so a steady " + str(steady_units_per_day) + " a day misses a")
print("    28-day month and beats a 31-day one with the work")
print("    unchanged")
print("")
print("a rate compared to a fixed monthly number is compared to a moving bar, because")
print("a month is a variable amount of time; meeting it or missing it can be a fact")
print("about the calendar and none about the work")
print("")
print("Each month counts real units, one definition, nothing shifted - both counts are")
print("right. The target is a fixed " + str(target_per_calendar_month) + " per calendar month and the months are")
print("unequal, so a steady " + str(steady_units_per_day) + " a day beats july by " + str(july_against_target) + " and misses february by ")
print("" + str(0 - february_against_target) + ", with " + str(nc_months_that_look_like_a_change) + " real change in the work.")
```

## stdout (executed)

```text
target per calendar month       : 300000
steady output per day           : 10000

february (28 days) total        : 280000
  against target                : -20000
july (31 days) total            : 310000
  against target                : 10000

daily rate needed in february   : 10714
daily rate needed in july       : 9677

the monthly count
  counts : real completed units, not estimates
  a unit : the same definition every month
  pulled across the boundary : nothing
  boundary : the calendar's
  months counted correctly : both
  verdict : MET IN JULY, MISSED IN FEBRUARY

  refusing to pull units across the month boundary is the
  part done right here, and it is why each month's count
  is clean

the target per month
  what it is : one fixed number, every month
  what a month is : 28 to 31 days, not a fixed span
  so the daily rate it demands : varies by 1037
    between the shortest and longest month
  a steady 10000 a day : clears the bar in a long month
  the same rate in february : falls short by 20000

the month-over-month report
  july : 310000, over target
  february : 280000, under target
  the story it tells : the team slipped in february
  what actually changed in the work : nothing; 10000 a
    day throughout
  what changed : the number of days the target was spread
    over

null control - a per-day target, not a per-month one
  february total : 280000
  february target at 10000 a day : 280000
  months that look like a change : 
    0
  no unit and no count changed; the target stopped being a
  fixed monthly number and started scaling with the days

what a monthly target guarantees
  the month's count reached the number : exactly, real
    units, one definition, nothing shifted across the
    boundary
  the team's output changed month to month : not
    addressed; the target is per calendar month and the
    months are unequal, so a steady 10000 a day misses a
    28-day month and beats a 31-day one with the work
    unchanged

a rate compared to a fixed monthly number is compared to a moving bar, because
a month is a variable amount of time; meeting it or missing it can be a fact
about the calendar and none about the work

Each month counts real units, one definition, nothing shifted - both counts are
right. The target is a fixed 300000 per calendar month and the months are
unequal, so a steady 10000 a day beats july by 10000 and misses february by 
20000, with 0 real change in the work.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
