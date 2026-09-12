<!-- canonical: efficientnewlanguage.org/ai/examples/817-the-shares-were-rounded-and-summed-to-101 | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 817 — The shares were rounded and summed to 101

`the_shares_were_rounded_and_summed_to_101.eml` - Three shares of a whole are each rounded to a correct whole percent, and each rounding is right. What they sum to is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three shares of a
# whole are each rounded to a correct whole percent, and each rounding is right.
# What they sum to is computed below.
#
# The rounding is done properly per share. Each true share is rounded half-up to
# the nearest whole percent; the same rule is used for all three; none is
# truncated; and each displayed percent is within half a point of its true share.
#
# The three true shares sum to exactly the whole.

3350 => share_a_per_myriad
3350 => share_b_per_myriad
3300 => share_c_per_myriad

share_a_per_myriad + share_b_per_myriad + share_c_per_myriad => true_total_per_myriad
int((share_a_per_myriad + 50) / 100) => share_a_percent
int((share_b_per_myriad + 50) / 100) => share_b_percent
int((share_c_per_myriad + 50) / 100) => share_c_percent
share_a_percent + share_b_percent + share_c_percent => rounded_shares_sum_percent
int(true_total_per_myriad / 100) => true_total_percent
rounded_shares_sum_percent - true_total_percent => the_excess_percent

"share A                         : " + str(share_a_per_myriad) + " per ten thousand" ^0
"share B                         : " + str(share_b_per_myriad) + " per ten thousand" ^0
"share C                         : " + str(share_c_per_myriad) + " per ten thousand" ^0
"true total                      : " + str(true_total_per_myriad) + " per ten thousand" ^0
"" ^0
"share A rounded                 : " + str(share_a_percent) + " percent" ^0
"share B rounded                 : " + str(share_b_percent) + " percent" ^0
"share C rounded                 : " + str(share_c_percent) + " percent" ^0
"rounded shares sum to           : " + str(rounded_shares_sum_percent) + " percent" ^0
"true total                      : " + str(true_total_percent) + " percent" ^0
"  the excess                    : " + str(the_excess_percent) + " percent" ^0
"" ^0

# ---- what the per-share rounding verified ----

"the per-share rounding" ^0
"  rule : round half-up to the nearest whole percent" ^0
"  applied to : all three, identically" ^0
"  truncation : none" ^0
"  each displayed percent : within half a point of its" ^0
"    share" ^0
"  shares off by more than half a point : 0" ^0
"  verdict : EACH SHARE CORRECT" ^0
"" ^0
"  holding half-up for every share is the part done right" ^0
"  here, and it is why no single percent is misrounded" ^0
"" ^0

# ---- what they sum to ----

"the sum of the rounded shares" ^0
"  what it should be : 100, the whole" ^0
"  what it is : " + str(rounded_shares_sum_percent) ^0
"  why : two shares at exactly 33.5 each round up" ^0
"  what rounding does to a sum : it does not preserve it;" ^0
"    the roundings do not cancel" ^0
"  the invariant broken : the parts add to the whole" ^0
"" ^0

# ---- what a reader of the breakdown sees ----

"the reader of the breakdown" ^0
"  the three percents shown : " + str(share_a_percent) + ", " + str(share_b_percent) + ", " + str(share_c_percent) ^0
"  their sum : " + str(rounded_shares_sum_percent) ^0
"  is any single share wrong : no; each is the correct" ^0
"    rounding of its value" ^0
"  is the breakdown consistent : no; it claims " + str(the_excess_percent) + " point" ^0
"    more than exists" ^0
"  where the extra point is : in no share, between them" ^0
"" ^0

# ---- null control ----

# The same shares, with the last one shown as the remainder after the others so
# the displayed parts sum to the whole by construction.
101 => nc_independent_rounding_sum_percent
100 => nc_largest_remainder_sum_percent
0 => nc_shares_whose_value_changed

"null control - show the last as the remainder" ^0
"  independent rounding sum : " + str(nc_independent_rounding_sum_percent) + " percent" ^0
"  largest-remainder sum : " + str(nc_largest_remainder_sum_percent) + " percent" ^0
"  shares whose value changed : " + str(nc_shares_whose_value_changed) ^0
"  no share's value changed; one figure became the whole" ^0
"  minus the others rather than an independent rounding" ^0
"" ^0

# ---- the rule ----

"what correctly rounded shares guarantee" ^0
"  each share is within half a point of its value : exactly," ^0
"    half-up, same rule, none truncated" ^0
"  the shares account for the whole : not addressed; each" ^0
"    share was rounded independently, and three that truly" ^0
"    sum to 100 round to " + str(share_a_percent) + "+" + str(share_b_percent) + "+" + str(share_c_percent) + " = " + str(rounded_shares_sum_percent) + "," ^0
"    because rounding does not preserve a sum" ^0
"" ^0

"rounding each part keeps each part honest and lets their total drift; the" ^0
"constraint that parts sum to a whole is a property of the set, and rounding" ^0
"them one at a time is blind to it" ^0
"" ^0

"Each share is rounded half-up, same rule, within half a point - none is wrong." ^0
"Two sit at exactly 33.5 and round up, so the parts sum to " + str(rounded_shares_sum_percent) + " where the whole" ^0
"is " + str(true_total_percent) + ": " + str(the_excess_percent) + " point that is in no share and breaks parts-sum-to-the-whole." ^0
```

## Python (deterministic transpilation)

```python
share_a_per_myriad = 3350
share_b_per_myriad = 3350
share_c_per_myriad = 3300
true_total_per_myriad = share_a_per_myriad + share_b_per_myriad + share_c_per_myriad
share_a_percent = int((share_a_per_myriad + 50) / 100)
share_b_percent = int((share_b_per_myriad + 50) / 100)
share_c_percent = int((share_c_per_myriad + 50) / 100)
rounded_shares_sum_percent = share_a_percent + share_b_percent + share_c_percent
true_total_percent = int(true_total_per_myriad / 100)
the_excess_percent = rounded_shares_sum_percent - true_total_percent
print("share A                         : " + str(share_a_per_myriad) + " per ten thousand")
print("share B                         : " + str(share_b_per_myriad) + " per ten thousand")
print("share C                         : " + str(share_c_per_myriad) + " per ten thousand")
print("true total                      : " + str(true_total_per_myriad) + " per ten thousand")
print("")
print("share A rounded                 : " + str(share_a_percent) + " percent")
print("share B rounded                 : " + str(share_b_percent) + " percent")
print("share C rounded                 : " + str(share_c_percent) + " percent")
print("rounded shares sum to           : " + str(rounded_shares_sum_percent) + " percent")
print("true total                      : " + str(true_total_percent) + " percent")
print("  the excess                    : " + str(the_excess_percent) + " percent")
print("")
print("the per-share rounding")
print("  rule : round half-up to the nearest whole percent")
print("  applied to : all three, identically")
print("  truncation : none")
print("  each displayed percent : within half a point of its")
print("    share")
print("  shares off by more than half a point : 0")
print("  verdict : EACH SHARE CORRECT")
print("")
print("  holding half-up for every share is the part done right")
print("  here, and it is why no single percent is misrounded")
print("")
print("the sum of the rounded shares")
print("  what it should be : 100, the whole")
print("  what it is : " + str(rounded_shares_sum_percent))
print("  why : two shares at exactly 33.5 each round up")
print("  what rounding does to a sum : it does not preserve it;")
print("    the roundings do not cancel")
print("  the invariant broken : the parts add to the whole")
print("")
print("the reader of the breakdown")
print("  the three percents shown : " + str(share_a_percent) + ", " + str(share_b_percent) + ", " + str(share_c_percent))
print("  their sum : " + str(rounded_shares_sum_percent))
print("  is any single share wrong : no; each is the correct")
print("    rounding of its value")
print("  is the breakdown consistent : no; it claims " + str(the_excess_percent) + " point")
print("    more than exists")
print("  where the extra point is : in no share, between them")
print("")
nc_independent_rounding_sum_percent = 101
nc_largest_remainder_sum_percent = 100
nc_shares_whose_value_changed = 0
print("null control - show the last as the remainder")
print("  independent rounding sum : " + str(nc_independent_rounding_sum_percent) + " percent")
print("  largest-remainder sum : " + str(nc_largest_remainder_sum_percent) + " percent")
print("  shares whose value changed : " + str(nc_shares_whose_value_changed))
print("  no share's value changed; one figure became the whole")
print("  minus the others rather than an independent rounding")
print("")
print("what correctly rounded shares guarantee")
print("  each share is within half a point of its value : exactly,")
print("    half-up, same rule, none truncated")
print("  the shares account for the whole : not addressed; each")
print("    share was rounded independently, and three that truly")
print("    sum to 100 round to " + str(share_a_percent) + "+" + str(share_b_percent) + "+" + str(share_c_percent) + " = " + str(rounded_shares_sum_percent) + ",")
print("    because rounding does not preserve a sum")
print("")
print("rounding each part keeps each part honest and lets their total drift; the")
print("constraint that parts sum to a whole is a property of the set, and rounding")
print("them one at a time is blind to it")
print("")
print("Each share is rounded half-up, same rule, within half a point - none is wrong.")
print("Two sit at exactly 33.5 and round up, so the parts sum to " + str(rounded_shares_sum_percent) + " where the whole")
print("is " + str(true_total_percent) + ": " + str(the_excess_percent) + " point that is in no share and breaks parts-sum-to-the-whole.")
```

## stdout (executed)

```text
share A                         : 3350 per ten thousand
share B                         : 3350 per ten thousand
share C                         : 3300 per ten thousand
true total                      : 10000 per ten thousand

share A rounded                 : 34 percent
share B rounded                 : 34 percent
share C rounded                 : 33 percent
rounded shares sum to           : 101 percent
true total                      : 100 percent
  the excess                    : 1 percent

the per-share rounding
  rule : round half-up to the nearest whole percent
  applied to : all three, identically
  truncation : none
  each displayed percent : within half a point of its
    share
  shares off by more than half a point : 0
  verdict : EACH SHARE CORRECT

  holding half-up for every share is the part done right
  here, and it is why no single percent is misrounded

the sum of the rounded shares
  what it should be : 100, the whole
  what it is : 101
  why : two shares at exactly 33.5 each round up
  what rounding does to a sum : it does not preserve it;
    the roundings do not cancel
  the invariant broken : the parts add to the whole

the reader of the breakdown
  the three percents shown : 34, 34, 33
  their sum : 101
  is any single share wrong : no; each is the correct
    rounding of its value
  is the breakdown consistent : no; it claims 1 point
    more than exists
  where the extra point is : in no share, between them

null control - show the last as the remainder
  independent rounding sum : 101 percent
  largest-remainder sum : 100 percent
  shares whose value changed : 0
  no share's value changed; one figure became the whole
  minus the others rather than an independent rounding

what correctly rounded shares guarantee
  each share is within half a point of its value : exactly,
    half-up, same rule, none truncated
  the shares account for the whole : not addressed; each
    share was rounded independently, and three that truly
    sum to 100 round to 34+34+33 = 101,
    because rounding does not preserve a sum

rounding each part keeps each part honest and lets their total drift; the
constraint that parts sum to a whole is a property of the set, and rounding
them one at a time is blind to it

Each share is rounded half-up, same rule, within half a point - none is wrong.
Two sit at exactly 33.5 and round up, so the parts sum to 101 where the whole
is 100: 1 point that is in no share and breaks parts-sum-to-the-whole.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
