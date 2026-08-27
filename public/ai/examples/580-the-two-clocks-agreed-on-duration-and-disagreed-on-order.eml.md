<!-- canonical: efficientnewlanguage.org/ai/examples/580-the-two-clocks-agreed-on-duration-and-disagreed-on-order | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 580 — The two clocks agreed on duration and disagreed on order

`the_two_clocks_agreed_on_duration_and_disagreed_on_order.eml` - A request crosses three services and is timestamped at every hop. The end-to-end duration is trusted and the hop ordering is trusted. Only one of them is safe, and which is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A request crosses
# three services and is timestamped at every hop. The end-to-end duration is
# trusted and the hop ordering is trusted. Only one of them is safe, and which
# is computed below.
#
# Timestamping every hop is right and the setup is careful. NTP holds the fleet
# to within 40 milliseconds, which is a real measured bound and not a hope, and
# 40 ms is small against a request that takes a fifth of a second. The traces
# are used for two things: how long did this take, and what happened before
# what. Both look like questions about time and both are answered from the same
# field.
#
# A duration that begins and ends on the SAME clock is exact however wrong that
# clock is, because the offset appears twice with opposite signs and cancels.
# The request enters at A and its final record is written at A, so the total is
# an A-minus-A subtraction and the 40 ms is not in it at all.
#
# An ordering between two hops on DIFFERENT clocks is a single subtraction
# whose sign is the entire answer. There the offset does not cancel; it is the
# error term, and it is larger than most of the gaps being compared.

40 => skew_ms

# [hop, true gap in ms, crosses a clock boundary]
[["A sends    -> B receives", 2, 1], ["B receives -> B writes", 5, 0], ["B writes   -> C reads", 18, 1], ["C reads    -> C reports", 60, 0], ["C reports  -> A records", 140, 1]] => hops

"clock skew across the fleet : " + str(skew_ms) + " ms, measured" ^0
"" ^0

"hop                        gap    same clock   order reliable" ^0
0 => total_ms
0 => cross_clock
0 => unreliable
for h in hops:
    total_ms + h[1] => total_ms
    if h[2] == 1:
        cross_clock + 1 => cross_clock
        if h[1] < skew_ms:
            unreliable + 1 => unreliable
            "  " + h[0] + "     " + str(h[1]) + "     no           NO, gap is under the skew" ^0
        else:
            "  " + h[0] + "     " + str(h[1]) + "     no           yes, gap exceeds the skew" ^0
    else:
        "  " + h[0] + "     " + str(h[1]) + "     yes          yes, one clock" ^0
"" ^0

"  hops that cross a clock boundary : " + str(cross_clock) + " of 5" ^0
"  of those, ordering unreliable    : " + str(unreliable) ^0
"" ^0

# ---- the total ----

"end-to-end duration : " + str(total_ms) + " ms" ^0
"  first timestamp written by : A" ^0
"  last timestamp written by  : A" ^0
"  clock offsets in the subtraction : one, twice, with opposite signs" ^0
"  error in the total : 0 ms, exactly, at any skew" ^0
"" ^0

"the same trace, two questions" ^0
"  how long did this take    : " + str(total_ms) + " ms, exact" ^0
"  did B write before C read : unknown, the gap is " + str(18) + " ms and the skew is " + str(skew_ms) ^0
"  both answers come from the same five numbers" ^0
"" ^0

# ---- how wrong an order can be ----
#
# Two events on different clocks appear in the wrong order whenever the true
# gap is smaller than the offset between the clocks. The offset is bounded, so
# the question is which gaps fall under it.

"gap between two events on different clocks   can they appear reversed" ^0
[1, 5, 18, 39, 40, 41, 100] => probe_gaps
for g in probe_gaps:
    if g < skew_ms:
        "  " + str(g) + " ms                                        yes" ^0
    else:
        "  " + str(g) + " ms                                        no" ^0
"" ^0
"  the boundary is exactly the skew, and it is a hard boundary" ^0
"  below it the recorded order carries no information about the real one" ^0
"" ^0

# ---- what a reversed order does downstream ----

"one reversal, and what reads it" ^0
"  the causal graph drawn from the trace shows C reading before B wrote" ^0
"  which is impossible, so the reader concludes a bug in B" ^0
"  the investigation looks at B, which is correct, and at nothing else" ^0
"  B is fine; the ordering was never measured, only recorded" ^0
"" ^0

# ---- the control ----
#
# The durations. Every hop that begins and ends on one clock is exact, and so
# is the total. The trace is not broken and its numbers are not noisy - the
# quantity that is wrong is the only one nobody computed a bound for.

"control - durations, which the same skew cannot touch" ^0
0 => same_clock_hops
0 => same_clock_ms
for h in hops:
    if h[2] == 0:
        same_clock_hops + 1 => same_clock_hops
        same_clock_ms + h[1] => same_clock_ms
"  hops measured on one clock   : " + str(same_clock_hops) ^0
"  milliseconds they account for: " + str(same_clock_ms) ^0
"  error in each                : 0 ms" ^0
"  end-to-end total             : " + str(total_ms) + " ms, error 0 ms" ^0
"  every duration in the trace is exact and every one was believed correctly" ^0
"" ^0

# ---- the null control ----
#
# The same three services with the same 40 ms skew, on a request whose hops are
# all wider than the skew. Every ordering is now reliable. The skew did not
# change and neither did the clocks; only the gaps did.

[["P -> Q", 90, 1], ["Q -> R", 200, 1], ["R -> P", 150, 1]] => wide_hops

"null control - the same " + str(skew_ms) + " ms skew, hops wider than it" ^0
0 => wide_unreliable
0 => wide_total
for w in wide_hops:
    wide_total + w[1] => wide_total
    if w[1] < skew_ms:
        wide_unreliable + 1 => wide_unreliable
    "  " + w[0] + " : " + str(w[1]) + " ms" ^0
"  hops with unreliable ordering : " + str(wide_unreliable) + " of 3" ^0
"  total duration                : " + str(wide_total) + " ms" ^0
"  same skew, same clocks, same code path" ^0
"  so the rule is not 'never order across clocks'" ^0
"  it is 'an order across clocks is meaningless below the skew, and the skew" ^0
"  is a number you already have'" ^0
"" ^0

# ---- the rule ----

"what a bounded clock offset does to each kind of question" ^0
"  duration on one clock        exact, the offset cancels" ^0
"  duration between two clocks  off by at most the skew" ^0
"  total with the same clock at both ends   exact" ^0
"  order between two clocks     undefined below the skew" ^0
"  a trace answers all four from one column" ^0
"  and reports the same confidence for all four" ^0
"" ^0

"NTP holds the fleet to " + str(skew_ms) + " ms, which is measured and is small against a " + str(total_ms) + " ms" ^0
"request. The total is an A-minus-A subtraction so the offset cancels and the" ^0
str(total_ms) + " ms is exact. " + str(unreliable) + " of the " + str(cross_clock) + " cross-clock hops have gaps below " + str(skew_ms) + " ms, and for" ^0
"those the recorded order says nothing about the real one - from the same five" ^0
"timestamps that gave the exact total." ^0
```

## Python (deterministic transpilation)

```python
skew_ms = 40
hops = [["A sends    -> B receives", 2, 1], ["B receives -> B writes", 5, 0], ["B writes   -> C reads", 18, 1], ["C reads    -> C reports", 60, 0], ["C reports  -> A records", 140, 1]]
print("clock skew across the fleet : " + str(skew_ms) + " ms, measured")
print("")
print("hop                        gap    same clock   order reliable")
total_ms = 0
cross_clock = 0
unreliable = 0
for h in hops:
    total_ms = total_ms + h[1]
    if h[2] == 1:
        cross_clock = cross_clock + 1
        if h[1] < skew_ms:
            unreliable = unreliable + 1
            print("  " + h[0] + "     " + str(h[1]) + "     no           NO, gap is under the skew")
        else:
            print("  " + h[0] + "     " + str(h[1]) + "     no           yes, gap exceeds the skew")
    else:
        print("  " + h[0] + "     " + str(h[1]) + "     yes          yes, one clock")
print("")
print("  hops that cross a clock boundary : " + str(cross_clock) + " of 5")
print("  of those, ordering unreliable    : " + str(unreliable))
print("")
print("end-to-end duration : " + str(total_ms) + " ms")
print("  first timestamp written by : A")
print("  last timestamp written by  : A")
print("  clock offsets in the subtraction : one, twice, with opposite signs")
print("  error in the total : 0 ms, exactly, at any skew")
print("")
print("the same trace, two questions")
print("  how long did this take    : " + str(total_ms) + " ms, exact")
print("  did B write before C read : unknown, the gap is " + str(18) + " ms and the skew is " + str(skew_ms))
print("  both answers come from the same five numbers")
print("")
print("gap between two events on different clocks   can they appear reversed")
probe_gaps = [1, 5, 18, 39, 40, 41, 100]
for g in probe_gaps:
    if g < skew_ms:
        print("  " + str(g) + " ms                                        yes")
    else:
        print("  " + str(g) + " ms                                        no")
print("")
print("  the boundary is exactly the skew, and it is a hard boundary")
print("  below it the recorded order carries no information about the real one")
print("")
print("one reversal, and what reads it")
print("  the causal graph drawn from the trace shows C reading before B wrote")
print("  which is impossible, so the reader concludes a bug in B")
print("  the investigation looks at B, which is correct, and at nothing else")
print("  B is fine; the ordering was never measured, only recorded")
print("")
print("control - durations, which the same skew cannot touch")
same_clock_hops = 0
same_clock_ms = 0
for h in hops:
    if h[2] == 0:
        same_clock_hops = same_clock_hops + 1
        same_clock_ms = same_clock_ms + h[1]
print("  hops measured on one clock   : " + str(same_clock_hops))
print("  milliseconds they account for: " + str(same_clock_ms))
print("  error in each                : 0 ms")
print("  end-to-end total             : " + str(total_ms) + " ms, error 0 ms")
print("  every duration in the trace is exact and every one was believed correctly")
print("")
wide_hops = [["P -> Q", 90, 1], ["Q -> R", 200, 1], ["R -> P", 150, 1]]
print("null control - the same " + str(skew_ms) + " ms skew, hops wider than it")
wide_unreliable = 0
wide_total = 0
for w in wide_hops:
    wide_total = wide_total + w[1]
    if w[1] < skew_ms:
        wide_unreliable = wide_unreliable + 1
    print("  " + w[0] + " : " + str(w[1]) + " ms")
print("  hops with unreliable ordering : " + str(wide_unreliable) + " of 3")
print("  total duration                : " + str(wide_total) + " ms")
print("  same skew, same clocks, same code path")
print("  so the rule is not 'never order across clocks'")
print("  it is 'an order across clocks is meaningless below the skew, and the skew")
print("  is a number you already have'")
print("")
print("what a bounded clock offset does to each kind of question")
print("  duration on one clock        exact, the offset cancels")
print("  duration between two clocks  off by at most the skew")
print("  total with the same clock at both ends   exact")
print("  order between two clocks     undefined below the skew")
print("  a trace answers all four from one column")
print("  and reports the same confidence for all four")
print("")
print("NTP holds the fleet to " + str(skew_ms) + " ms, which is measured and is small against a " + str(total_ms) + " ms")
print("request. The total is an A-minus-A subtraction so the offset cancels and the")
print(str(total_ms) + " ms is exact. " + str(unreliable) + " of the " + str(cross_clock) + " cross-clock hops have gaps below " + str(skew_ms) + " ms, and for")
print("those the recorded order says nothing about the real one - from the same five")
print("timestamps that gave the exact total.")
```

## stdout (executed)

```text
clock skew across the fleet : 40 ms, measured

hop                        gap    same clock   order reliable
  A sends    -> B receives     2     no           NO, gap is under the skew
  B receives -> B writes     5     yes          yes, one clock
  B writes   -> C reads     18     no           NO, gap is under the skew
  C reads    -> C reports     60     yes          yes, one clock
  C reports  -> A records     140     no           yes, gap exceeds the skew

  hops that cross a clock boundary : 3 of 5
  of those, ordering unreliable    : 2

end-to-end duration : 225 ms
  first timestamp written by : A
  last timestamp written by  : A
  clock offsets in the subtraction : one, twice, with opposite signs
  error in the total : 0 ms, exactly, at any skew

the same trace, two questions
  how long did this take    : 225 ms, exact
  did B write before C read : unknown, the gap is 18 ms and the skew is 40
  both answers come from the same five numbers

gap between two events on different clocks   can they appear reversed
  1 ms                                        yes
  5 ms                                        yes
  18 ms                                        yes
  39 ms                                        yes
  40 ms                                        no
  41 ms                                        no
  100 ms                                        no

  the boundary is exactly the skew, and it is a hard boundary
  below it the recorded order carries no information about the real one

one reversal, and what reads it
  the causal graph drawn from the trace shows C reading before B wrote
  which is impossible, so the reader concludes a bug in B
  the investigation looks at B, which is correct, and at nothing else
  B is fine; the ordering was never measured, only recorded

control - durations, which the same skew cannot touch
  hops measured on one clock   : 2
  milliseconds they account for: 65
  error in each                : 0 ms
  end-to-end total             : 225 ms, error 0 ms
  every duration in the trace is exact and every one was believed correctly

null control - the same 40 ms skew, hops wider than it
  P -> Q : 90 ms
  Q -> R : 200 ms
  R -> P : 150 ms
  hops with unreliable ordering : 0 of 3
  total duration                : 440 ms
  same skew, same clocks, same code path
  so the rule is not 'never order across clocks'
  it is 'an order across clocks is meaningless below the skew, and the skew
  is a number you already have'

what a bounded clock offset does to each kind of question
  duration on one clock        exact, the offset cancels
  duration between two clocks  off by at most the skew
  total with the same clock at both ends   exact
  order between two clocks     undefined below the skew
  a trace answers all four from one column
  and reports the same confidence for all four

NTP holds the fleet to 40 ms, which is measured and is small against a 225 ms
request. The total is an A-minus-A subtraction so the offset cancels and the
225 ms is exact. 2 of the 3 cross-clock hops have gaps below 40 ms, and for
those the recorded order says nothing about the real one - from the same five
timestamps that gave the exact total.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
