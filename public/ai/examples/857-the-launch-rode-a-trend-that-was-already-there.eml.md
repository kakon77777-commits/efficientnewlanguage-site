<!-- canonical: efficientnewlanguage.org/ai/examples/857-the-launch-rode-a-trend-that-was-already-there | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 857 — The launch rode a trend that was already there

`the_launch_rode_a_trend_that_was_already_there.eml` - A feature launched in November and conversions rose 20 percent. The counts are real and the before-and-after is honest. Whether the feature caused the rise is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A feature launched
# in November and conversions rose 20 percent. The counts are real and the
# before-and-after is honest. Whether the feature caused the rise is computed
# below.
#
# The measurement is careful. It counts real completed conversions, not
# estimates; it covers every session in the window; the rise is the honest
# after-minus-before; and the intent is exactly 'did the feature lift
# conversions'.
#
# November is the seasonal upswing, and a same-period segment that never got the
# feature rose almost as much - the pre/post comparison straddles a boundary the
# season had already crossed.

1000 => conversions_before
1200 => conversions_after
1000 => control_segment_before
1170 => control_segment_after

conversions_after - conversions_before => rise_claimed
control_segment_after - control_segment_before => rise_seasonal
rise_claimed - rise_seasonal => rise_from_the_feature
int(rise_seasonal * 10000 / rise_claimed) => seasonal_share_per_myriad

"conversions before (October)    : " + str(conversions_before) ^0
"conversions after (November)    : " + str(conversions_after) ^0
"control segment before          : " + str(control_segment_before) ^0
"control segment after           : " + str(control_segment_after) ^0
"" ^0
"rise claimed for the feature    : " + str(rise_claimed) ^0
"rise in the untouched control   : " + str(rise_seasonal) ^0
"left for the feature            : " + str(rise_from_the_feature) ^0
"seasonal share of the claim     : " + str(seasonal_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the measurement verified ----

"the conversion measurement" ^0
"  counts : real completed conversions, not estimates" ^0
"  covers : every session in the window" ^0
"  rise : the honest after minus before" ^0
"  intent : did the feature lift conversions" ^0
"  sessions omitted : 0" ^0
"  verdict : CONVERSIONS ROSE 200 AFTER LAUNCH" ^0
"" ^0
"  counting real conversions over every session is the part" ^0
"  done right here, and it is why the rise of 200 is a true" ^0
"  number about the post-launch window" ^0
"" ^0

# ---- what the trend already did ----

"the season the launch landed in" ^0
"  what November is : the holiday upswing, rising anyway" ^0
"  the untouched control, same window : rose from 1000 to" ^0
"    1170 with no feature" ^0
"  what pre/post compares : two windows on opposite sides of" ^0
"    that upswing" ^0
"  what it cannot separate : the feature from the calendar" ^0
"  so the rise it attributes : is the feature plus the" ^0
"    season, read as feature alone" ^0
"" ^0

# ---- what the caller concluded ----

"the conclusion drawn" ^0
"  feature lifted conversions by : " + str(rise_claimed) ^0
"  the concurrent control's rise, no feature : " + str(rise_seasonal) ^0
"  actually attributable to the feature : " + str(rise_from_the_feature) ^0
"  are the counts wrong : no; conversions really rose 200" ^0
"  is 200 the feature's effect : no; " + str(seasonal_share_per_myriad) + " per ten" ^0
"    thousand of it is the season" ^0
"" ^0

# ---- null control ----

# The same launch, measured as a difference-in-differences against the concurrent
# control (or against the prior year's same-window rise), not as raw pre/post.
200 => nc_rise_by_raw_pre_post
30 => nc_rise_by_difference_in_differences
170 => nc_seasonal_rise_the_control_removes

"null control - difference-in-differences vs a concurrent control" ^0
"  rise by raw pre/post : " + str(nc_rise_by_raw_pre_post) ^0
"  rise by difference-in-differences : " + str(nc_rise_by_difference_in_differences) ^0
"  seasonal rise the control removes : " + str(nc_seasonal_rise_the_control_removes) ^0
"  no session and no conversion changed; the rise stopped" ^0
"  being read across the season and started being read" ^0
"  against what the season did on its own" ^0
"" ^0

# ---- the rule ----

"what a pre/post conversion lift guarantees" ^0
"  conversions rose by the measured amount : exactly, real" ^0
"    counts, every session, honest subtraction" ^0
"  the feature caused the rise : not addressed; November is" ^0
"    the seasonal upswing and a concurrent untouched control" ^0
"    rose " + str(rise_seasonal) + " of the " + str(rise_claimed) + " on its own, so pre/post credits" ^0
"    the calendar to the feature" ^0
"" ^0

"a before-and-after across a moving trend measures the trend as well as the" ^0
"change; without a concurrent control the two are added together, and the season" ^0
"the launch happened to fall in is counted as though the launch had made it" ^0
"" ^0

"It counts real conversions over every session with an honest pre/post - the rise" ^0
"of 200 is true. But the launch fell on the November upswing, and a concurrent" ^0
"control with no feature rose " + str(rise_seasonal) + "; difference-in-differences leaves " + str(rise_from_the_feature) + " for" ^0
"the feature, " + str(seasonal_share_per_myriad) + " per ten thousand of the claim being the season." ^0
```

## Python (deterministic transpilation)

```python
conversions_before = 1000
conversions_after = 1200
control_segment_before = 1000
control_segment_after = 1170
rise_claimed = conversions_after - conversions_before
rise_seasonal = control_segment_after - control_segment_before
rise_from_the_feature = rise_claimed - rise_seasonal
seasonal_share_per_myriad = int(rise_seasonal * 10000 / rise_claimed)
print("conversions before (October)    : " + str(conversions_before))
print("conversions after (November)    : " + str(conversions_after))
print("control segment before          : " + str(control_segment_before))
print("control segment after           : " + str(control_segment_after))
print("")
print("rise claimed for the feature    : " + str(rise_claimed))
print("rise in the untouched control   : " + str(rise_seasonal))
print("left for the feature            : " + str(rise_from_the_feature))
print("seasonal share of the claim     : " + str(seasonal_share_per_myriad) + " per ten thousand")
print("")
print("the conversion measurement")
print("  counts : real completed conversions, not estimates")
print("  covers : every session in the window")
print("  rise : the honest after minus before")
print("  intent : did the feature lift conversions")
print("  sessions omitted : 0")
print("  verdict : CONVERSIONS ROSE 200 AFTER LAUNCH")
print("")
print("  counting real conversions over every session is the part")
print("  done right here, and it is why the rise of 200 is a true")
print("  number about the post-launch window")
print("")
print("the season the launch landed in")
print("  what November is : the holiday upswing, rising anyway")
print("  the untouched control, same window : rose from 1000 to")
print("    1170 with no feature")
print("  what pre/post compares : two windows on opposite sides of")
print("    that upswing")
print("  what it cannot separate : the feature from the calendar")
print("  so the rise it attributes : is the feature plus the")
print("    season, read as feature alone")
print("")
print("the conclusion drawn")
print("  feature lifted conversions by : " + str(rise_claimed))
print("  the concurrent control's rise, no feature : " + str(rise_seasonal))
print("  actually attributable to the feature : " + str(rise_from_the_feature))
print("  are the counts wrong : no; conversions really rose 200")
print("  is 200 the feature's effect : no; " + str(seasonal_share_per_myriad) + " per ten")
print("    thousand of it is the season")
print("")
nc_rise_by_raw_pre_post = 200
nc_rise_by_difference_in_differences = 30
nc_seasonal_rise_the_control_removes = 170
print("null control - difference-in-differences vs a concurrent control")
print("  rise by raw pre/post : " + str(nc_rise_by_raw_pre_post))
print("  rise by difference-in-differences : " + str(nc_rise_by_difference_in_differences))
print("  seasonal rise the control removes : " + str(nc_seasonal_rise_the_control_removes))
print("  no session and no conversion changed; the rise stopped")
print("  being read across the season and started being read")
print("  against what the season did on its own")
print("")
print("what a pre/post conversion lift guarantees")
print("  conversions rose by the measured amount : exactly, real")
print("    counts, every session, honest subtraction")
print("  the feature caused the rise : not addressed; November is")
print("    the seasonal upswing and a concurrent untouched control")
print("    rose " + str(rise_seasonal) + " of the " + str(rise_claimed) + " on its own, so pre/post credits")
print("    the calendar to the feature")
print("")
print("a before-and-after across a moving trend measures the trend as well as the")
print("change; without a concurrent control the two are added together, and the season")
print("the launch happened to fall in is counted as though the launch had made it")
print("")
print("It counts real conversions over every session with an honest pre/post - the rise")
print("of 200 is true. But the launch fell on the November upswing, and a concurrent")
print("control with no feature rose " + str(rise_seasonal) + "; difference-in-differences leaves " + str(rise_from_the_feature) + " for")
print("the feature, " + str(seasonal_share_per_myriad) + " per ten thousand of the claim being the season.")
```

## stdout (executed)

```text
conversions before (October)    : 1000
conversions after (November)    : 1200
control segment before          : 1000
control segment after           : 1170

rise claimed for the feature    : 200
rise in the untouched control   : 170
left for the feature            : 30
seasonal share of the claim     : 8500 per ten thousand

the conversion measurement
  counts : real completed conversions, not estimates
  covers : every session in the window
  rise : the honest after minus before
  intent : did the feature lift conversions
  sessions omitted : 0
  verdict : CONVERSIONS ROSE 200 AFTER LAUNCH

  counting real conversions over every session is the part
  done right here, and it is why the rise of 200 is a true
  number about the post-launch window

the season the launch landed in
  what November is : the holiday upswing, rising anyway
  the untouched control, same window : rose from 1000 to
    1170 with no feature
  what pre/post compares : two windows on opposite sides of
    that upswing
  what it cannot separate : the feature from the calendar
  so the rise it attributes : is the feature plus the
    season, read as feature alone

the conclusion drawn
  feature lifted conversions by : 200
  the concurrent control's rise, no feature : 170
  actually attributable to the feature : 30
  are the counts wrong : no; conversions really rose 200
  is 200 the feature's effect : no; 8500 per ten
    thousand of it is the season

null control - difference-in-differences vs a concurrent control
  rise by raw pre/post : 200
  rise by difference-in-differences : 30
  seasonal rise the control removes : 170
  no session and no conversion changed; the rise stopped
  being read across the season and started being read
  against what the season did on its own

what a pre/post conversion lift guarantees
  conversions rose by the measured amount : exactly, real
    counts, every session, honest subtraction
  the feature caused the rise : not addressed; November is
    the seasonal upswing and a concurrent untouched control
    rose 170 of the 200 on its own, so pre/post credits
    the calendar to the feature

a before-and-after across a moving trend measures the trend as well as the
change; without a concurrent control the two are added together, and the season
the launch happened to fall in is counted as though the launch had made it

It counts real conversions over every session with an honest pre/post - the rise
of 200 is true. But the launch fell on the November upswing, and a concurrent
control with no feature rose 170; difference-in-differences leaves 30 for
the feature, 8500 per ten thousand of the claim being the season.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
