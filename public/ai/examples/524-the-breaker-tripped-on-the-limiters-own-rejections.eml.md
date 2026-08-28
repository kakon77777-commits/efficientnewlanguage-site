<!-- canonical: efficientnewlanguage.org/ai/examples/524-the-breaker-tripped-on-the-limiters-own-rejections | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 524 — The breaker tripped on the limiters own rejections

`the_breaker_tripped_on_the_limiters_own_rejections.eml` - A rate limiter and a circuit breaker both protect the same downstream service. What each one sees, and what the pair sees, are computed separately below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A rate limiter
# and a circuit breaker both protect the same downstream service. What each one
# sees, and what the pair sees, are computed separately below.
#
# Both are correct. The rate limiter keeps the downstream inside a contract it
# actually signed, and it has prevented three overload incidents. The circuit
# breaker stops a failing dependency from consuming every worker, and it has
# prevented two cascades. Either one alone is a good control, and the teams
# that added them added them for measured reasons.
#
# The breaker's input is the error rate. The limiter's output, when it rejects,
# is an error. So the limiter's own protective action is indistinguishable, at
# the breaker's input, from the downstream failing. The two are wired in
# series and one of them cannot tell the other's success from a fault.
#
# Requests are classified by what actually happened to them.

# [minute, offered requests, limiter cap, downstream real failures per 100 admitted]
[["t+0", 400, 500, 1], ["t+1", 900, 500, 1], ["t+2", 1400, 500, 1], ["t+3", 1600, 500, 1], ["t+4", 1500, 500, 1], ["t+5", 900, 500, 1]] => minutes

len(minutes) => n
50 => breaker_threshold

def admitted(offered, cap):
    if offered < cap:
        return offered
    return cap

"minute   offered   admitted   rejected by limiter   downstream failures   breaker sees" ^0
0 => trips
for m in minutes:
    admitted(m[1], m[2]) => adm
    m[1] - adm => rej
    int(adm * m[3] / 100) => real_fail
    int((rej + real_fail) * 100 / m[1]) => seen
    "" => verdict
    if seen >= breaker_threshold:
        "OPEN" => verdict
        trips + 1 => trips
    else:
        "closed" => verdict
    "  " + m[0] + "     " + str(m[1]) + "      " + str(adm) + "        " + str(rej) + "                  " + str(real_fail) + "                   " + str(seen) + "% " + verdict ^0
"" ^0

"breaker threshold : " + str(breaker_threshold) + "% error rate" ^0
"minutes the breaker opened : " + str(trips) + " of " + str(n) ^0
"" ^0

# ---- what the breaker was actually reacting to ----

0 => total_rej
0 => total_real
for m in minutes:
    admitted(m[1], m[2]) => adm
    total_rej + (m[1] - adm) => total_rej
    total_real + int(adm * m[3] / 100) => total_real
"across the window" ^0
"  errors from the limiter doing its job : " + str(total_rej) ^0
"  errors from the downstream failing    : " + str(total_real) ^0
"  the breaker counts both as one number : " + str(total_rej + total_real) ^0
if total_rej > total_real:
    "  " + str(int(total_rej * 100 / (total_rej + total_real))) + "% of what tripped the breaker was the other safeguard working" ^0
"" ^0

# ---- what happens after the breaker opens ----

"the state the pair reaches" ^0
"  breaker open  : no traffic reaches the downstream" ^0
"  limiter sees  : offered load unchanged, it is upstream of the breaker" ^0
"  downstream    : idle, and healthy, and receiving nothing" ^0
"  the breaker's close condition is a fall in the error rate, and the error" ^0
"  rate is now produced entirely by the limiter, which is not affected by" ^0
"  the breaker being open" ^0
"" ^0

# ---- how it recovers, and on what ----

"what would close the breaker" ^0
for m in minutes:
    if m[1] < m[2]:
        admitted(m[1], m[2]) => adm
        int((m[1] - adm + int(adm * m[3] / 100)) * 100 / m[1]) => seen
        "  " + m[0] + " : offered " + str(m[1]) + " under the cap " + str(m[2]) + ", error rate " + str(seen) + "%" ^0
"  so it closes when offered load falls below the cap, which is a property" ^0
"  of the callers rather than of the downstream's health" ^0
"" ^0

# ---- each safeguard alone ----

"the same six minutes with only the limiter" ^0
0 => lim_only_served
for m in minutes:
    lim_only_served + admitted(m[1], m[2]) => lim_only_served
"  requests served : " + str(lim_only_served) ^0
"  downstream load : never above " + str(minutes[0][2]) ^0
"" ^0
"the same six minutes with only the breaker" ^0
0 => brk_only_served
0 => brk_trips
for m in minutes:
    if m[3] >= breaker_threshold:
        brk_trips + 1 => brk_trips
    else:
        brk_only_served + m[1] => brk_only_served
"  requests served : " + str(brk_only_served) ^0
"  breaker trips   : " + str(brk_trips) + ", because the real failure rate is " + str(minutes[0][3]) + "%" ^0
"" ^0
0 => both_served
for m in minutes:
    admitted(m[1], m[2]) => adm
    int((m[1] - adm + int(adm * m[3] / 100)) * 100 / m[1]) => seen
    if seen < breaker_threshold:
        both_served + adm => both_served
"the two together" ^0
"  requests served : " + str(both_served) ^0
"  limiter alone   : " + str(lim_only_served) ^0
"  breaker alone   : " + str(brk_only_served) ^0
if both_served < lim_only_served:
    "  the pair serves " + str(lim_only_served - both_served) + " fewer than the weaker-looking single control" ^0
"" ^0

# ---- what would separate the two error kinds ----

"what the breaker would need" ^0
"  a rejection carries : HTTP 429, generated locally, downstream untouched" ^0
"  a real failure carries : HTTP 5xx, generated downstream" ^0
"  the two are distinguishable at the point the breaker samples" ^0
"  sites where the breaker's input filters on that distinction : 0" ^0
"  the information is present and the control does not read it" ^0
"" ^0

# ---- the control: a breaker that counts only downstream errors ----
#
# Where the breaker's input excludes locally generated rejections, each
# safeguard reacts only to what it is for.

"control - the same six minutes, breaker counting 5xx only" ^0
0 => fixed_served
0 => fixed_trips
for m in minutes:
    admitted(m[1], m[2]) => adm
    if m[3] >= breaker_threshold:
        fixed_trips + 1 => fixed_trips
    else:
        fixed_served + adm => fixed_served
"  breaker trips   : " + str(fixed_trips) ^0
"  requests served : " + str(fixed_served) ^0
"  against " + str(both_served) + " with the shared counter" ^0
if fixed_served > both_served:
    "  the same two controls, the same load, " + str(fixed_served - both_served) + " more requests served," ^0
    "  and the only change is which errors the breaker is allowed to see" ^0
"" ^0

"Both controls are correct and each has prevented real incidents. They are" ^0
"wired in series, and the first one's success looks exactly like the second" ^0
"one's fault at the point where the second one decides." ^0
```

## Python (deterministic transpilation)

```python
minutes = [["t+0", 400, 500, 1], ["t+1", 900, 500, 1], ["t+2", 1400, 500, 1], ["t+3", 1600, 500, 1], ["t+4", 1500, 500, 1], ["t+5", 900, 500, 1]]
n = len(minutes)
breaker_threshold = 50

def admitted(offered, cap):
    if offered < cap:
        return offered
    return cap

print("minute   offered   admitted   rejected by limiter   downstream failures   breaker sees")
trips = 0
for m in minutes:
    adm = admitted(m[1], m[2])
    rej = m[1] - adm
    real_fail = int(adm * m[3] / 100)
    seen = int((rej + real_fail) * 100 / m[1])
    verdict = ""
    if seen >= breaker_threshold:
        verdict = "OPEN"
        trips = trips + 1
    else:
        verdict = "closed"
    print("  " + m[0] + "     " + str(m[1]) + "      " + str(adm) + "        " + str(rej) + "                  " + str(real_fail) + "                   " + str(seen) + "% " + verdict)
print("")
print("breaker threshold : " + str(breaker_threshold) + "% error rate")
print("minutes the breaker opened : " + str(trips) + " of " + str(n))
print("")
total_rej = 0
total_real = 0
for m in minutes:
    adm = admitted(m[1], m[2])
    total_rej = total_rej + (m[1] - adm)
    total_real = total_real + int(adm * m[3] / 100)
print("across the window")
print("  errors from the limiter doing its job : " + str(total_rej))
print("  errors from the downstream failing    : " + str(total_real))
print("  the breaker counts both as one number : " + str(total_rej + total_real))
if total_rej > total_real:
    print("  " + str(int(total_rej * 100 / (total_rej + total_real))) + "% of what tripped the breaker was the other safeguard working")
print("")
print("the state the pair reaches")
print("  breaker open  : no traffic reaches the downstream")
print("  limiter sees  : offered load unchanged, it is upstream of the breaker")
print("  downstream    : idle, and healthy, and receiving nothing")
print("  the breaker's close condition is a fall in the error rate, and the error")
print("  rate is now produced entirely by the limiter, which is not affected by")
print("  the breaker being open")
print("")
print("what would close the breaker")
for m in minutes:
    if m[1] < m[2]:
        adm = admitted(m[1], m[2])
        seen = int((m[1] - adm + int(adm * m[3] / 100)) * 100 / m[1])
        print("  " + m[0] + " : offered " + str(m[1]) + " under the cap " + str(m[2]) + ", error rate " + str(seen) + "%")
print("  so it closes when offered load falls below the cap, which is a property")
print("  of the callers rather than of the downstream's health")
print("")
print("the same six minutes with only the limiter")
lim_only_served = 0
for m in minutes:
    lim_only_served = lim_only_served + admitted(m[1], m[2])
print("  requests served : " + str(lim_only_served))
print("  downstream load : never above " + str(minutes[0][2]))
print("")
print("the same six minutes with only the breaker")
brk_only_served = 0
brk_trips = 0
for m in minutes:
    if m[3] >= breaker_threshold:
        brk_trips = brk_trips + 1
    else:
        brk_only_served = brk_only_served + m[1]
print("  requests served : " + str(brk_only_served))
print("  breaker trips   : " + str(brk_trips) + ", because the real failure rate is " + str(minutes[0][3]) + "%")
print("")
both_served = 0
for m in minutes:
    adm = admitted(m[1], m[2])
    seen = int((m[1] - adm + int(adm * m[3] / 100)) * 100 / m[1])
    if seen < breaker_threshold:
        both_served = both_served + adm
print("the two together")
print("  requests served : " + str(both_served))
print("  limiter alone   : " + str(lim_only_served))
print("  breaker alone   : " + str(brk_only_served))
if both_served < lim_only_served:
    print("  the pair serves " + str(lim_only_served - both_served) + " fewer than the weaker-looking single control")
print("")
print("what the breaker would need")
print("  a rejection carries : HTTP 429, generated locally, downstream untouched")
print("  a real failure carries : HTTP 5xx, generated downstream")
print("  the two are distinguishable at the point the breaker samples")
print("  sites where the breaker's input filters on that distinction : 0")
print("  the information is present and the control does not read it")
print("")
print("control - the same six minutes, breaker counting 5xx only")
fixed_served = 0
fixed_trips = 0
for m in minutes:
    adm = admitted(m[1], m[2])
    if m[3] >= breaker_threshold:
        fixed_trips = fixed_trips + 1
    else:
        fixed_served = fixed_served + adm
print("  breaker trips   : " + str(fixed_trips))
print("  requests served : " + str(fixed_served))
print("  against " + str(both_served) + " with the shared counter")
if fixed_served > both_served:
    print("  the same two controls, the same load, " + str(fixed_served - both_served) + " more requests served,")
    print("  and the only change is which errors the breaker is allowed to see")
print("")
print("Both controls are correct and each has prevented real incidents. They are")
print("wired in series, and the first one's success looks exactly like the second")
print("one's fault at the point where the second one decides.")
```

## stdout (executed)

```text
minute   offered   admitted   rejected by limiter   downstream failures   breaker sees
  t+0     400      400        0                  4                   1% closed
  t+1     900      500        400                  5                   45% closed
  t+2     1400      500        900                  5                   64% OPEN
  t+3     1600      500        1100                  5                   69% OPEN
  t+4     1500      500        1000                  5                   67% OPEN
  t+5     900      500        400                  5                   45% closed

breaker threshold : 50% error rate
minutes the breaker opened : 3 of 6

across the window
  errors from the limiter doing its job : 3800
  errors from the downstream failing    : 29
  the breaker counts both as one number : 3829
  99% of what tripped the breaker was the other safeguard working

the state the pair reaches
  breaker open  : no traffic reaches the downstream
  limiter sees  : offered load unchanged, it is upstream of the breaker
  downstream    : idle, and healthy, and receiving nothing
  the breaker's close condition is a fall in the error rate, and the error
  rate is now produced entirely by the limiter, which is not affected by
  the breaker being open

what would close the breaker
  t+0 : offered 400 under the cap 500, error rate 1%
  so it closes when offered load falls below the cap, which is a property
  of the callers rather than of the downstream's health

the same six minutes with only the limiter
  requests served : 2900
  downstream load : never above 500

the same six minutes with only the breaker
  requests served : 6700
  breaker trips   : 0, because the real failure rate is 1%

the two together
  requests served : 1400
  limiter alone   : 2900
  breaker alone   : 6700
  the pair serves 1500 fewer than the weaker-looking single control

what the breaker would need
  a rejection carries : HTTP 429, generated locally, downstream untouched
  a real failure carries : HTTP 5xx, generated downstream
  the two are distinguishable at the point the breaker samples
  sites where the breaker's input filters on that distinction : 0
  the information is present and the control does not read it

control - the same six minutes, breaker counting 5xx only
  breaker trips   : 0
  requests served : 2900
  against 1400 with the shared counter
  the same two controls, the same load, 1500 more requests served,
  and the only change is which errors the breaker is allowed to see

Both controls are correct and each has prevented real incidents. They are
wired in series, and the first one's success looks exactly like the second
one's fault at the point where the second one decides.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
