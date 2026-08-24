<!-- canonical: efficientnewlanguage.org/ai/examples/525-the-buffer-absorbed-the-signal-backpressure-needed | ai_layer_version: 0.1.0 | updated: 2026-08-24 -->

# Example 525 — The buffer absorbed the signal backpressure needed

`the_buffer_absorbed_the_signal_backpressure_needed.eml` - A queue has both a buffer to absorb bursts and backpressure to slow the producer. When each one engages is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A queue has both
# a buffer to absorb bursts and backpressure to slow the producer. When each
# one engages is computed below.
#
# Both are correct. The buffer was sized from a measured burst profile and it
# absorbs the twice-daily spike that used to drop messages. Backpressure was
# added because an unbounded producer once filled the disk. Each was a good
# change and neither team was guessing.
#
# Backpressure engages on observed lag. The buffer's entire purpose is to keep
# lag from being observed during a burst. So the buffer hides the signal for
# exactly as long as it has capacity, and backpressure engages only after the
# buffer is exhausted - which is the moment when slowing down helps least,
# because there is already a full buffer of work to drain.
#
# Depth and latency are computed per minute across one sustained overload.

# [minute, produced per second, consumed per second, buffer capacity]
[["t+0", 800, 1000, 60000], ["t+1", 1400, 1000, 60000], ["t+2", 1400, 1000, 60000], ["t+3", 1400, 1000, 60000], ["t+4", 1400, 1000, 60000], ["t+5", 1400, 1000, 60000], ["t+6", 1400, 1000, 60000]] => window

len(window) => n
55 => lag_threshold

"minute   produced/s   consumed/s   net/s   buffer depth   lag seconds   backpressure" ^0
0 => depth
0 => engaged_at
"" => engaged_min
for w in window:
    w[1] - w[2] => net
    depth + net * 60 => depth
    if depth < 0:
        0 => depth
    if depth > w[3]:
        w[3] => depth
    int(depth / w[2]) => lag
    "" => bp
    if lag > lag_threshold:
        "ON" => bp
        if engaged_min == "":
            w[0] => engaged_min
    else:
        "off" => bp
    "  " + w[0] + "     " + str(w[1]) + "         " + str(w[2]) + "         " + str(net) + "     " + str(depth) + "         " + str(lag) + "            " + bp ^0
"" ^0

"buffer capacity      : " + str(window[0][3]) + " messages" ^0
"backpressure engages : lag above " + str(lag_threshold) + " seconds" ^0
if not (engaged_min == ""):
    "first engaged at     : " + engaged_min ^0
else:
    "backpressure never engaged inside this window" ^0
"" ^0

# ---- how long the buffer hides the overload ----

window[1][1] - window[1][2] => surplus
int(window[0][3] / (surplus * 60)) => minutes_hidden
"how long the buffer conceals a sustained " + str(surplus) + "/s surplus" ^0
"  buffer capacity / surplus per minute : " + str(window[0][3]) + " / " + str(surplus * 60) ^0
"  minutes before the buffer is full    : " + str(minutes_hidden) ^0
"  during those minutes the observed lag rises from 0, so the signal is not" ^0
"  absent - it is present and below the threshold that acts on it" ^0
"" ^0

# ---- what backpressure can still do when it engages ----

"the state at the moment backpressure engages" ^0
"  buffer depth   : " + str(window[0][3]) + " messages" ^0
"  drain rate     : " + str(window[0][2]) + "/s" ^0
"  time to drain, with the producer stopped completely : " + str(int(window[0][3] / window[0][2])) + " seconds" ^0
"  the oldest message in the buffer is already that old" ^0
"  slowing the producer now removes future arrivals and does nothing about" ^0
"  the queue that is already there" ^0
"" ^0

# ---- the same overload with a smaller buffer ----

6000 => small
int(small / (surplus * 60)) => small_hidden
"the same producer against a " + str(small) + "-message buffer" ^0
"  minutes before full : " + str(small_hidden) ^0
"  drain time at engagement : " + str(int(small / window[0][2])) + " seconds" ^0
"  backpressure engages " + str(minutes_hidden - small_hidden) + " minutes earlier and with " + str(int(window[0][3] / window[0][2]) - int(small / window[0][2])) + " seconds" ^0
"  less accumulated work to clear" ^0
"  the smaller buffer drops more during the twice-daily burst, which is the" ^0
"  thing the large one was bought for" ^0
"" ^0

# ---- the two settings are one decision ----

"buffer size against how late backpressure can act" ^0
[6000, 20000, 60000, 120000] => sizes
for s in sizes:
    "  " + str(s) + " messages : hidden for " + str(int(s / (surplus * 60))) + " min, " + str(int(s / window[0][2])) + " s of work at engagement" ^0
"  the buffer is sized by the burst profile and the engagement delay is a" ^0
"  consequence nobody chose" ^0
"" ^0

# ---- what would engage on the right quantity ----

"a signal that a buffer cannot absorb" ^0
"  observed lag       : absorbed, by design, that is what the buffer is" ^0
"  buffer depth       : rises immediately, already recorded" ^0
"  arrival minus service rate : rises immediately, already recorded" ^0
"  controls reading either of the second two : 0" ^0
"  the rate difference is visible in the first minute of the overload and" ^0
"  the control waits for a quantity the buffer is built to suppress" ^0
"" ^0

# ---- the control: a burst the buffer was actually sized for ----
#
# Where the surplus is temporary, the buffer absorbs it, lag never rises and
# backpressure correctly never engages.

[["burst", 1800, 1000, 60000], ["after-1", 400, 1000, 60000], ["after-2", 400, 1000, 60000]] => burst
"control - a 60-second burst rather than a sustained overload" ^0
0 => bdepth
0 => bpeak
0 => bmax_lag
for b in burst:
    b[1] - b[2] => net
    bdepth + net * 60 => bdepth
    if bdepth < 0:
        0 => bdepth
    if bdepth > bpeak:
        bdepth => bpeak
    int(bdepth / b[2]) => blag
    if blag > bmax_lag:
        blag => bmax_lag
    "  " + b[0] + " : net " + str(net) + "/s, depth " + str(bdepth) + ", lag " + str(blag) + "s" ^0
"  peak depth " + str(bpeak) + " against capacity " + str(burst[0][3]) + ", which is " + str(int(bpeak * 100 / burst[0][3])) + "%" ^0
"  peak lag " + str(bmax_lag) + "s against the " + str(lag_threshold) + "s threshold" ^0
if bdepth == 0:
    "  and the queue returns to empty on its own" ^0
"  backpressure never engaged, and it was right not to" ^0
"  the same buffer, the same rule, and the difference is whether the" ^0
"  surplus ends on its own" ^0
"" ^0

"The buffer absorbs the burst it was measured for and backpressure stopped a" ^0
"disk from filling. Backpressure waits on lag and the buffer's job is to" ^0
"absorb lag, so the second control cannot act until the first has run out." ^0
```

## Python (deterministic transpilation)

```python
window = [["t+0", 800, 1000, 60000], ["t+1", 1400, 1000, 60000], ["t+2", 1400, 1000, 60000], ["t+3", 1400, 1000, 60000], ["t+4", 1400, 1000, 60000], ["t+5", 1400, 1000, 60000], ["t+6", 1400, 1000, 60000]]
n = len(window)
lag_threshold = 55
print("minute   produced/s   consumed/s   net/s   buffer depth   lag seconds   backpressure")
depth = 0
engaged_at = 0
engaged_min = ""
for w in window:
    net = w[1] - w[2]
    depth = depth + net * 60
    if depth < 0:
        depth = 0
    if depth > w[3]:
        depth = w[3]
    lag = int(depth / w[2])
    bp = ""
    if lag > lag_threshold:
        bp = "ON"
        if engaged_min == "":
            engaged_min = w[0]
    else:
        bp = "off"
    print("  " + w[0] + "     " + str(w[1]) + "         " + str(w[2]) + "         " + str(net) + "     " + str(depth) + "         " + str(lag) + "            " + bp)
print("")
print("buffer capacity      : " + str(window[0][3]) + " messages")
print("backpressure engages : lag above " + str(lag_threshold) + " seconds")
if not engaged_min == "":
    print("first engaged at     : " + engaged_min)
else:
    print("backpressure never engaged inside this window")
print("")
surplus = window[1][1] - window[1][2]
minutes_hidden = int(window[0][3] / (surplus * 60))
print("how long the buffer conceals a sustained " + str(surplus) + "/s surplus")
print("  buffer capacity / surplus per minute : " + str(window[0][3]) + " / " + str(surplus * 60))
print("  minutes before the buffer is full    : " + str(minutes_hidden))
print("  during those minutes the observed lag rises from 0, so the signal is not")
print("  absent - it is present and below the threshold that acts on it")
print("")
print("the state at the moment backpressure engages")
print("  buffer depth   : " + str(window[0][3]) + " messages")
print("  drain rate     : " + str(window[0][2]) + "/s")
print("  time to drain, with the producer stopped completely : " + str(int(window[0][3] / window[0][2])) + " seconds")
print("  the oldest message in the buffer is already that old")
print("  slowing the producer now removes future arrivals and does nothing about")
print("  the queue that is already there")
print("")
small = 6000
small_hidden = int(small / (surplus * 60))
print("the same producer against a " + str(small) + "-message buffer")
print("  minutes before full : " + str(small_hidden))
print("  drain time at engagement : " + str(int(small / window[0][2])) + " seconds")
print("  backpressure engages " + str(minutes_hidden - small_hidden) + " minutes earlier and with " + str(int(window[0][3] / window[0][2]) - int(small / window[0][2])) + " seconds")
print("  less accumulated work to clear")
print("  the smaller buffer drops more during the twice-daily burst, which is the")
print("  thing the large one was bought for")
print("")
print("buffer size against how late backpressure can act")
sizes = [6000, 20000, 60000, 120000]
for s in sizes:
    print("  " + str(s) + " messages : hidden for " + str(int(s / (surplus * 60))) + " min, " + str(int(s / window[0][2])) + " s of work at engagement")
print("  the buffer is sized by the burst profile and the engagement delay is a")
print("  consequence nobody chose")
print("")
print("a signal that a buffer cannot absorb")
print("  observed lag       : absorbed, by design, that is what the buffer is")
print("  buffer depth       : rises immediately, already recorded")
print("  arrival minus service rate : rises immediately, already recorded")
print("  controls reading either of the second two : 0")
print("  the rate difference is visible in the first minute of the overload and")
print("  the control waits for a quantity the buffer is built to suppress")
print("")
burst = [["burst", 1800, 1000, 60000], ["after-1", 400, 1000, 60000], ["after-2", 400, 1000, 60000]]
print("control - a 60-second burst rather than a sustained overload")
bdepth = 0
bpeak = 0
bmax_lag = 0
for b in burst:
    net = b[1] - b[2]
    bdepth = bdepth + net * 60
    if bdepth < 0:
        bdepth = 0
    if bdepth > bpeak:
        bpeak = bdepth
    blag = int(bdepth / b[2])
    if blag > bmax_lag:
        bmax_lag = blag
    print("  " + b[0] + " : net " + str(net) + "/s, depth " + str(bdepth) + ", lag " + str(blag) + "s")
print("  peak depth " + str(bpeak) + " against capacity " + str(burst[0][3]) + ", which is " + str(int(bpeak * 100 / burst[0][3])) + "%")
print("  peak lag " + str(bmax_lag) + "s against the " + str(lag_threshold) + "s threshold")
if bdepth == 0:
    print("  and the queue returns to empty on its own")
print("  backpressure never engaged, and it was right not to")
print("  the same buffer, the same rule, and the difference is whether the")
print("  surplus ends on its own")
print("")
print("The buffer absorbs the burst it was measured for and backpressure stopped a")
print("disk from filling. Backpressure waits on lag and the buffer's job is to")
print("absorb lag, so the second control cannot act until the first has run out.")
```

## stdout (executed)

```text
minute   produced/s   consumed/s   net/s   buffer depth   lag seconds   backpressure
  t+0     800         1000         -200     0         0            off
  t+1     1400         1000         400     24000         24            off
  t+2     1400         1000         400     48000         48            off
  t+3     1400         1000         400     60000         60            ON
  t+4     1400         1000         400     60000         60            ON
  t+5     1400         1000         400     60000         60            ON
  t+6     1400         1000         400     60000         60            ON

buffer capacity      : 60000 messages
backpressure engages : lag above 55 seconds
first engaged at     : t+3

how long the buffer conceals a sustained 400/s surplus
  buffer capacity / surplus per minute : 60000 / 24000
  minutes before the buffer is full    : 2
  during those minutes the observed lag rises from 0, so the signal is not
  absent - it is present and below the threshold that acts on it

the state at the moment backpressure engages
  buffer depth   : 60000 messages
  drain rate     : 1000/s
  time to drain, with the producer stopped completely : 60 seconds
  the oldest message in the buffer is already that old
  slowing the producer now removes future arrivals and does nothing about
  the queue that is already there

the same producer against a 6000-message buffer
  minutes before full : 0
  drain time at engagement : 6 seconds
  backpressure engages 2 minutes earlier and with 54 seconds
  less accumulated work to clear
  the smaller buffer drops more during the twice-daily burst, which is the
  thing the large one was bought for

buffer size against how late backpressure can act
  6000 messages : hidden for 0 min, 6 s of work at engagement
  20000 messages : hidden for 0 min, 20 s of work at engagement
  60000 messages : hidden for 2 min, 60 s of work at engagement
  120000 messages : hidden for 5 min, 120 s of work at engagement
  the buffer is sized by the burst profile and the engagement delay is a
  consequence nobody chose

a signal that a buffer cannot absorb
  observed lag       : absorbed, by design, that is what the buffer is
  buffer depth       : rises immediately, already recorded
  arrival minus service rate : rises immediately, already recorded
  controls reading either of the second two : 0
  the rate difference is visible in the first minute of the overload and
  the control waits for a quantity the buffer is built to suppress

control - a 60-second burst rather than a sustained overload
  burst : net 800/s, depth 48000, lag 48s
  after-1 : net -600/s, depth 12000, lag 12s
  after-2 : net -600/s, depth 0, lag 0s
  peak depth 48000 against capacity 60000, which is 80%
  peak lag 48s against the 55s threshold
  and the queue returns to empty on its own
  backpressure never engaged, and it was right not to
  the same buffer, the same rule, and the difference is whether the
  surplus ends on its own

The buffer absorbs the burst it was measured for and backpressure stopped a
disk from filling. Backpressure waits on lag and the buffer's job is to
absorb lag, so the second control cannot act until the first has run out.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
