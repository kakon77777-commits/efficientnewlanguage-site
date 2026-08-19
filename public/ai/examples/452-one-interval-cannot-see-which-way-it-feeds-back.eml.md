<!-- canonical: efficientnewlanguage.org/ai/examples/452-one-interval-cannot-see-which-way-it-feeds-back | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 452 — One interval cannot see which way it feeds back

`one_interval_cannot_see_which_way_it_feeds_back.eml` - Two systems take the same shock and respond identically in the first interval. Which of them is amplifying is not in that interval, and is computed here.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two systems take
# the same shock and respond identically in the first interval. Which of them
# is amplifying is not in that interval, and is computed here.
#
# Reading the first interval is not a mistake. It is the only interval anybody
# has when the decision is due, the response in it is real, and its size is
# measured correctly. Waiting for a second one has a cost, sometimes a large
# one.
#
# What a single interval contains is the size of a response. Whether the next
# response will be larger or smaller is a fact about the sign of the loop, and
# a difference between two responses needs two of them to exist at all.
#
# Both systems are run from the same shock over the same intervals.

100 => normal
40 => shock
8 => intervals

# amplifying: each interval adds a quarter of the current excess again
# damping:    each interval removes a quarter of the current excess
def trace(sign):
    [] => out
    normal + shock => v
    0 => t
    while t < intervals:
        out + [v] => out
        int((v - normal) / 4) => delta
        if sign == 1:
            v + delta => v
        else:
            v - delta => v
        t + 1 => t
    return out

trace(1) => amp
trace(0) => damp

"both systems sit at " + str(normal) + " and take a shock of " + str(shock) ^0
"" ^0
"interval   amplifying   damping" ^0
for i in [0:intervals - 1]:
    "  " + str(i + 1) + "          " + str(amp[i]) + "          " + str(damp[i]) ^0
"" ^0

if amp[0] == damp[0]:
    "at interval 1 the two are identical at " + str(amp[0]) ^0
    "  a reader with one interval has the size of the response and nothing else" ^0
"" ^0

0 => first_diff
for i in [0:intervals - 1]:
    if first_diff == 0:
        if not (amp[i] == damp[i]):
            i + 1 => first_diff
if first_diff > 0:
    "they first differ at interval " + str(first_diff) + ", by " + str(amp[first_diff - 1] - damp[first_diff - 1]) ^0
"" ^0

"by interval " + str(intervals) ^0
"  amplifying : " + str(amp[intervals - 1]) + ", which is " + str(amp[intervals - 1] - normal) + " above rest" ^0
"  damping    : " + str(damp[intervals - 1]) + ", which is " + str(damp[intervals - 1] - normal) + " above rest" ^0
"" ^0

# ---- what the second interval buys that the first does not ----
#
# The sign of the loop is a property of the change between responses. One
# interval has no change in it, so no amount of care in reading it recovers
# the sign.

amp[1] - amp[0] => amp_step
damp[1] - damp[0] => damp_step
"the step from interval 1 to interval 2" ^0
"  amplifying : " + str(amp_step) ^0
"  damping    : " + str(damp_step) ^0
if amp_step > 0:
    if damp_step < 0:
        "  opposite signs, so two intervals separate them and one does not" ^0
"" ^0

# ---- what deciding at interval 1 costs under each ----

"adding capacity at interval 1 for the observed excess of " + str(shock) ^0
"  if the system is damping    : the excess is gone by interval " + str(intervals) + ", leaving" ^0
"    " + str(shock - damp[intervals - 1] + normal) + " of the added capacity idle" ^0
"  if the system is amplifying : the excess reaches " + str(amp[intervals - 1] - normal) + ", so the addition is" ^0
"    short by " + str(amp[intervals - 1] - normal - shock) ^0
"  the two errors are different sizes, so the cheaper guess is not the safer" ^0
"  one and the choice is not symmetric" ^0
"" ^0

# ---- the control: a shock with no loop at all ----
#
# A system that simply returns to rest in one step shows the same first
# interval again, and the same reader cannot tell it from either of the others.

normal + shock => flat_first
"control - a system that returns to " + str(normal) + " immediately after the shock" ^0
"  interval 1 : " + str(flat_first) + ", interval 2 : " + str(normal) ^0
if flat_first == amp[0]:
    if flat_first == damp[0]:
        "  interval 1 matches both of the others exactly" ^0
        "  three different systems, one first interval, and the decision is due" ^0
"" ^0

"The first interval is measured correctly and it is what there is. The sign" ^0
"of a loop lives in the difference between two responses, and one response" ^0
"has no difference in it." ^0
```

## Python (deterministic transpilation)

```python
normal = 100
shock = 40
intervals = 8

def trace(sign):
    out = []
    v = normal + shock
    t = 0
    while t < intervals:
        out = out + [v]
        delta = int((v - normal) / 4)
        if sign == 1:
            v = v + delta
        else:
            v = v - delta
        t = t + 1
    return out

amp = trace(1)
damp = trace(0)
print("both systems sit at " + str(normal) + " and take a shock of " + str(shock))
print("")
print("interval   amplifying   damping")
for i in range(0, intervals):
    print("  " + str(i + 1) + "          " + str(amp[i]) + "          " + str(damp[i]))
print("")
if amp[0] == damp[0]:
    print("at interval 1 the two are identical at " + str(amp[0]))
    print("  a reader with one interval has the size of the response and nothing else")
print("")
first_diff = 0
for i in range(0, intervals):
    if first_diff == 0:
        if not amp[i] == damp[i]:
            first_diff = i + 1
if first_diff > 0:
    print("they first differ at interval " + str(first_diff) + ", by " + str(amp[first_diff - 1] - damp[first_diff - 1]))
print("")
print("by interval " + str(intervals))
print("  amplifying : " + str(amp[intervals - 1]) + ", which is " + str(amp[intervals - 1] - normal) + " above rest")
print("  damping    : " + str(damp[intervals - 1]) + ", which is " + str(damp[intervals - 1] - normal) + " above rest")
print("")
amp_step = amp[1] - amp[0]
damp_step = damp[1] - damp[0]
print("the step from interval 1 to interval 2")
print("  amplifying : " + str(amp_step))
print("  damping    : " + str(damp_step))
if amp_step > 0:
    if damp_step < 0:
        print("  opposite signs, so two intervals separate them and one does not")
print("")
print("adding capacity at interval 1 for the observed excess of " + str(shock))
print("  if the system is damping    : the excess is gone by interval " + str(intervals) + ", leaving")
print("    " + str(shock - damp[intervals - 1] + normal) + " of the added capacity idle")
print("  if the system is amplifying : the excess reaches " + str(amp[intervals - 1] - normal) + ", so the addition is")
print("    short by " + str(amp[intervals - 1] - normal - shock))
print("  the two errors are different sizes, so the cheaper guess is not the safer")
print("  one and the choice is not symmetric")
print("")
flat_first = normal + shock
print("control - a system that returns to " + str(normal) + " immediately after the shock")
print("  interval 1 : " + str(flat_first) + ", interval 2 : " + str(normal))
if flat_first == amp[0]:
    if flat_first == damp[0]:
        print("  interval 1 matches both of the others exactly")
        print("  three different systems, one first interval, and the decision is due")
print("")
print("The first interval is measured correctly and it is what there is. The sign")
print("of a loop lives in the difference between two responses, and one response")
print("has no difference in it.")
```

## stdout (executed)

```text
both systems sit at 100 and take a shock of 40

interval   amplifying   damping
  1          140          140
  2          150          130
  3          162          123
  4          177          118
  5          196          114
  6          220          111
  7          250          109
  8          287          107

at interval 1 the two are identical at 140
  a reader with one interval has the size of the response and nothing else

they first differ at interval 2, by 20

by interval 8
  amplifying : 287, which is 187 above rest
  damping    : 107, which is 7 above rest

the step from interval 1 to interval 2
  amplifying : 10
  damping    : -10
  opposite signs, so two intervals separate them and one does not

adding capacity at interval 1 for the observed excess of 40
  if the system is damping    : the excess is gone by interval 8, leaving
    33 of the added capacity idle
  if the system is amplifying : the excess reaches 187, so the addition is
    short by 147
  the two errors are different sizes, so the cheaper guess is not the safer
  one and the choice is not symmetric

control - a system that returns to 100 immediately after the shock
  interval 1 : 140, interval 2 : 100
  interval 1 matches both of the others exactly
  three different systems, one first interval, and the decision is due

The first interval is measured correctly and it is what there is. The sign
of a loop lives in the difference between two responses, and one response
has no difference in it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
