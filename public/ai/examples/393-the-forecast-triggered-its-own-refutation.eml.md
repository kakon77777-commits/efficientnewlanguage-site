<!-- canonical: efficientnewlanguage.org/ai/examples/393-the-forecast-triggered-its-own-refutation | ai_layer_version: 0.1.0 | updated: 2026-08-15 -->

# Example 393 — The forecast triggered its own refutation - 100% of the filed error was created by acting on it

`the_forecast_triggered_its_own_refutation.eml` computes the observed world, the world the forecast was about, and next year's correction.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The forecast said
# 900. Usage came in at 640. The forecast is filed as a 29% overestimate.
#
# The forecast was acted on, which is what forecasts are for. Acting meant
# provisioning, and provisioning included a per-tenant cap so the new capacity
# could not be consumed by one noisy tenant. The cap is the thing that held
# usage down.
#
# So the number the forecast is graded against was produced by a world the
# forecast itself created. The comparison is not wrong arithmetic - it is a
# comparison against the wrong world, and the right world is the one that was
# prevented.
#
# Here the counterfactual is computable because this is a model. In the real
# system it is not observable at all, which is the whole difficulty.

[["t1", 180], ["t2", 140], ["t3", 260], ["t4", 90], ["t5", 230]] => demand
120 => cap

def unconstrained():
    0 => t
    for d in demand:
        t + d[1] => t
    return t

def with_cap():
    0 => t
    for d in demand:
        if d[1] > cap:
            t + cap => t
        else:
            t + d[1] => t
    return t

900 => forecast

"the forecast, made before anything was provisioned" ^0
"  forecast : " + str(forecast) ^0
"" ^0

"what happened" ^0
"  observed usage : " + str(with_cap()) ^0
"  forecast error as filed : " + str(int((forecast - with_cap()) * 100 / forecast)) + "% over" ^0
"" ^0

"the world the forecast was about, which no longer exists" ^0
"  demand, uncapped : " + str(unconstrained()) ^0
"  forecast error against THAT : " + str(int((forecast - unconstrained()) * 100 / forecast)) + "% over" ^0
"" ^0

# ---- how much of the gap the action itself created ----

unconstrained() - with_cap() => suppressed
forecast - with_cap() => filed_error
"  gap between the two worlds : " + str(suppressed) ^0
"  filed error                : " + str(filed_error) ^0
"  share of the filed error created by acting on the forecast : " + str(int(suppressed * 100 / filed_error)) + "%" ^0
"" ^0

"per tenant" ^0
for d in demand:
    if d[1] > cap:
        "  " + d[0] + " : wanted " + str(d[1]) + ", got " + str(cap) + "  (-" + str(d[1] - cap) + ")" ^0
    else:
        "  " + d[0] + " : wanted " + str(d[1]) + ", got " + str(d[1]) ^0
0 => capped
for d in demand:
    if d[1] > cap:
        capped + 1 => capped
"  tenants at the cap : " + str(capped) + " of " + str(len(demand)) ^0
"" ^0

# ---- what happens next year ----
#
# The forecaster is told they overshoot, so they shade the next forecast down.
# The cap is still there, so the observation still agrees with them - and the
# error against real demand grows.

def shaded(f):
    return int(f * 75 / 100)

shaded(forecast) => f2
"next year, the forecaster shades down by a quarter" ^0
"  new forecast : " + str(f2) ^0
"  observed (cap still in place) : " + str(with_cap()) ^0
"  error as filed : " + str(int((f2 - with_cap()) * 100 / f2)) + "% over" ^0
"  error against uncapped demand : " + str(int((unconstrained() - f2) * 100 / unconstrained())) + "% UNDER" ^0
if f2 < unconstrained():
    "  the correction that looked right made it too small for the real world" ^0
"" ^0

# ---- the control: a forecast nobody acted on ----
#
# Without this the case reads as "forecasts cannot be graded". They can, when
# the grading world is not one the forecast produced.

def no_action_usage():
    return unconstrained()

"control - a forecast filed and not acted on" ^0
"  forecast : " + str(forecast) ^0
"  observed : " + str(no_action_usage()) ^0
"  error    : " + str(int((forecast - no_action_usage()) * 100 / forecast)) + "% over" ^0
"  here the observation and the forecast are about the same world" ^0
"" ^0

"A forecast that is acted on is graded against the world its own output made." ^0
"The gap is real, the arithmetic is right, and the thing being measured is not" ^0
"the thing that was predicted." ^0
```

## Python (deterministic transpilation)

```python
demand = [["t1", 180], ["t2", 140], ["t3", 260], ["t4", 90], ["t5", 230]]
cap = 120

def unconstrained():
    t = 0
    for d in demand:
        t = t + d[1]
    return t

def with_cap():
    t = 0
    for d in demand:
        if d[1] > cap:
            t = t + cap
        else:
            t = t + d[1]
    return t

forecast = 900
print("the forecast, made before anything was provisioned")
print("  forecast : " + str(forecast))
print("")
print("what happened")
print("  observed usage : " + str(with_cap()))
print("  forecast error as filed : " + str(int((forecast - with_cap()) * 100 / forecast)) + "% over")
print("")
print("the world the forecast was about, which no longer exists")
print("  demand, uncapped : " + str(unconstrained()))
print("  forecast error against THAT : " + str(int((forecast - unconstrained()) * 100 / forecast)) + "% over")
print("")
suppressed = unconstrained() - with_cap()
filed_error = forecast - with_cap()
print("  gap between the two worlds : " + str(suppressed))
print("  filed error                : " + str(filed_error))
print("  share of the filed error created by acting on the forecast : " + str(int(suppressed * 100 / filed_error)) + "%")
print("")
print("per tenant")
for d in demand:
    if d[1] > cap:
        print("  " + d[0] + " : wanted " + str(d[1]) + ", got " + str(cap) + "  (-" + str(d[1] - cap) + ")")
    else:
        print("  " + d[0] + " : wanted " + str(d[1]) + ", got " + str(d[1]))
capped = 0
for d in demand:
    if d[1] > cap:
        capped = capped + 1
print("  tenants at the cap : " + str(capped) + " of " + str(len(demand)))
print("")

def shaded(f):
    return int(f * 75 / 100)

f2 = shaded(forecast)
print("next year, the forecaster shades down by a quarter")
print("  new forecast : " + str(f2))
print("  observed (cap still in place) : " + str(with_cap()))
print("  error as filed : " + str(int((f2 - with_cap()) * 100 / f2)) + "% over")
print("  error against uncapped demand : " + str(int((unconstrained() - f2) * 100 / unconstrained())) + "% UNDER")
if f2 < unconstrained():
    print("  the correction that looked right made it too small for the real world")
print("")

def no_action_usage():
    return unconstrained()

print("control - a forecast filed and not acted on")
print("  forecast : " + str(forecast))
print("  observed : " + str(no_action_usage()))
print("  error    : " + str(int((forecast - no_action_usage()) * 100 / forecast)) + "% over")
print("  here the observation and the forecast are about the same world")
print("")
print("A forecast that is acted on is graded against the world its own output made.")
print("The gap is real, the arithmetic is right, and the thing being measured is not")
print("the thing that was predicted.")
```

## stdout (executed)

```text
the forecast, made before anything was provisioned
  forecast : 900

what happened
  observed usage : 570
  forecast error as filed : 36% over

the world the forecast was about, which no longer exists
  demand, uncapped : 900
  forecast error against THAT : 0% over

  gap between the two worlds : 330
  filed error                : 330
  share of the filed error created by acting on the forecast : 100%

per tenant
  t1 : wanted 180, got 120  (-60)
  t2 : wanted 140, got 120  (-20)
  t3 : wanted 260, got 120  (-140)
  t4 : wanted 90, got 90
  t5 : wanted 230, got 120  (-110)
  tenants at the cap : 4 of 5

next year, the forecaster shades down by a quarter
  new forecast : 675
  observed (cap still in place) : 570
  error as filed : 15% over
  error against uncapped demand : 25% UNDER
  the correction that looked right made it too small for the real world

control - a forecast filed and not acted on
  forecast : 900
  observed : 900
  error    : 0% over
  here the observation and the forecast are about the same world

A forecast that is acted on is graded against the world its own output made.
The gap is real, the arithmetic is right, and the thing being measured is not
the thing that was predicted.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
