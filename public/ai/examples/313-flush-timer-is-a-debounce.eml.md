<!-- canonical: efficientnewlanguage.org/ai/examples/313-flush-timer-is-a-debounce | ai_layer_version: 0.1.0 | updated: 2026-08-09 -->

# Example 313 — Flush timer is a debounce — the latency guarantee held while the system was idle

`flush_timer_is_a_debounce.eml` replays three arrival streams through two buffer implementations and reports the worst latency any record actually experienced, against the bound the timer is supposed to provide.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The timer was
# added to bound how long a record waits, and it is reset by arrivals, so under
# load it bounds nothing.
#
# A buffer flushes on either of two rules: when it holds N records, or when T
# ticks have passed. The second rule exists so that a slow trickle does not sit
# in the buffer forever - it is the latency guarantee, and everyone reads it as
# "no record waits more than T".
#
# The implementation resets the timer when a record ARRIVES rather than when
# the buffer was last flushed. That is a debounce: it fires T ticks after
# things go QUIET. Written down, the two are obviously different. In code they
# differ by which line the reset sits on, and both versions pass the test that
# sends three records and waits.
#
# Under a continuous stream whose gaps are shorter than T, the quiet never
# comes, so the timer never fires and the only rule left is the size rule. The
# guarantee holds exactly when the system is idle, and evaporates exactly when
# it is busy.
#
# The measurement replays arrival streams through both implementations and
# reports the WORST latency any record actually experienced, against the bound
# T is supposed to provide.

def simulate(arrivals, size_limit, t, debounce):
    # arrivals is a list of tick numbers. Returns [flushes, worst_latency,
    # flushed_count]. `debounce` selects which event resets the timer.
    [] => buffer
    [] => flush_log
    0 => worst
    0 => flushed
    0 => timer_base
    0 => idx
    1 => tick
    240 => horizon
    while tick <= horizon:
        # arrivals at this tick
        0 => arrived
        while idx < len(arrivals):
            if arrivals[idx] == tick:
                buffer + [tick] => buffer
                1 => arrived
                idx + 1 => idx
            else:
                idx => idx
                tick => tick
                idx + 0 => idx
                break
        if arrived == 1:
            if debounce == 1:
                tick => timer_base

        # flush rules
        0 => fire
        if len(buffer) >= size_limit:
            1 => fire
        if len(buffer) > 0:
            if tick - timer_base >= t:
                1 => fire
        if fire == 1:
            for a in buffer:
                tick - a => lat
                if lat > worst:
                    lat => worst
                flushed + 1 => flushed
            flush_log + [len(buffer)] => flush_log
            [] => buffer
            tick => timer_base
        tick + 1 => tick
    return [flush_log, worst, flushed]

def stream(gap, n, start):
    [] => out
    0 => i
    while i < n:
        out + [start + i * gap] => out
        i + 1 => i
    return out

5 => SIZE
10 => T

"stream                       impl       flushes  worst latency  bound T"^0
"---------------------------  ---------  -------  -------------  -------"^0

{} => results
for spec in [["idle trickle (gap 20)", 20, 6],
             ["steady stream (gap 4)", 4, 40],
             ["slow stream  (gap 9)", 9, 20]]:
    stream(spec[1], spec[2], 5) => arr
    for impl in ["deadline", "debounce"]:
        0 => d
        if impl == "debounce":
            1 => d
        simulate(arr, SIZE, T, d) => r
        [r[1], len(r[0]), r[2]] => results[spec[0] + "/" + impl]
        ((spec[0] + "                             ")[0:29] + (impl + "           ")[0:11] + (str(len(r[0])) + "         ")[0:9] + (str(r[1]) + "               ")[0:15] + str(T))^0

""^0
("size limit: " + str(SIZE) + ", timer: " + str(T) + " ticks")^0

""^0
"where the two implementations differ"^0
for name in ["idle trickle (gap 20)", "steady stream (gap 4)", "slow stream  (gap 9)"]:
    results[name + "/deadline"] => a
    results[name + "/debounce"] => b
    if a[0] == b[0]:
        "same worst latency" => note
    else:
        "debounce is worse by " + str(b[0] - a[0]) => note
    ((name + "                             ")[0:29] + note)^0

""^0
"the arrival gap that decides it"^0

# The debounce fires only when a gap of at least T appears. Sweep the gap and
# read out whether the timer ever fired at all - derived from the flush sizes,
# since a timer flush is the only way a flush smaller than the size limit
# happens.
for gap in [4, 8, 9, 10, 11, 15]:
    stream(gap, 20, 5) => arr
    simulate(arr, SIZE, T, 1) => r
    0 => small_flushes
    for f in r[0]:
        if f < SIZE:
            small_flushes + 1 => small_flushes
    ("gap " + (str(gap) + "   ")[0:4] + " flushes: " + (str(len(r[0])) + "   ")[0:4] + " below the size limit: " + (str(small_flushes) + "   ")[0:4] + " worst latency: " + str(r[1]))^0

""^0
0 => checked
0 => passed

# On an idle trickle BOTH must stay within the bound. This is the test
# everybody writes - send a few records slowly, assert none waits longer than
# T - and it passes for both implementations, which is why the difference
# never surfaces.
#
# The first version of this check asserted the two implementations produce the
# SAME worst latency on an idle stream. Measured: 5 and 10. They never agree,
# even when idle, because the debounce measures from the last ARRIVAL and the
# deadline from the last FLUSH, and the flush came first. Equality was the
# wrong claim; staying inside the bound is the one that matters and the one
# that holds.
checked + 1 => checked
if results["idle trickle (gap 20)/deadline"][0] <= T:
    if results["idle trickle (gap 20)/debounce"][0] <= T:
        passed + 1 => passed

# The deadline implementation must honour its bound on every stream.
checked + 1 => checked
0 => deadline_breaches
for name in ["idle trickle (gap 20)", "steady stream (gap 4)", "slow stream  (gap 9)"]:
    if results[name + "/deadline"][0] > T:
        deadline_breaches + 1 => deadline_breaches
if deadline_breaches == 0:
    passed + 1 => passed

# The debounce must breach it on at least one stream.
checked + 1 => checked
0 => debounce_breaches
for name in ["idle trickle (gap 20)", "steady stream (gap 4)", "slow stream  (gap 9)"]:
    if results[name + "/debounce"][0] > T:
        debounce_breaches + 1 => debounce_breaches
if debounce_breaches > 0:
    passed + 1 => passed

# It must breach it on the SLOW stream specifically - a fast stream is saved by
# the size rule, so the damage lands where the load is light enough that
# nobody is looking.
checked + 1 => checked
if results["slow stream  (gap 9)/debounce"][0] > T:
    passed + 1 => passed

# Both must flush everything they were given; the difference is when, not
# whether.
checked + 1 => checked
0 => lost
for name in ["idle trickle (gap 20)", "steady stream (gap 4)", "slow stream  (gap 9)"]:
    if not (results[name + "/deadline"][2] == results[name + "/debounce"][2]):
        lost + 1 => lost
if lost == 0:
    passed + 1 => passed

# And the debounce must never fire its timer when the gap is below T - the
# mechanism, read off the flush sizes rather than asserted.
checked + 1 => checked
stream(9, 20, 5) => arr9
simulate(arr9, SIZE, T, 1) => r9
0 => small9
for f in r9[0]:
    if f < SIZE:
        small9 + 1 => small9
stream(15, 20, 5) => arr15
simulate(arr15, SIZE, T, 1) => r15
0 => small15
for f in r15[0]:
    if f < SIZE:
        small15 + 1 => small15
if small9 == 0:
    if small15 > 0:
        passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The latency guarantee held while the system was idle." => verdict
else:
    "FAILED - the buffers did not behave as the checks describe." => verdict
verdict^0

""^0
"'Flush after T ticks' and 'flush T ticks after the last arrival' differ by"^0
"which event resets the clock, and the second one is what you get if you put"^0
"the reset next to the code that handles an arrival - which is where an"^0
"arrival handler naturally lives. The guarantee is then conditional on"^0
"idleness, and it is stated unconditionally in the design doc."^0
```

## Python (deterministic transpilation)

```python
def simulate(arrivals, size_limit, t, debounce):
    buffer = []
    flush_log = []
    worst = 0
    flushed = 0
    timer_base = 0
    idx = 0
    tick = 1
    horizon = 240
    while tick <= horizon:
        arrived = 0
        while idx < len(arrivals):
            if arrivals[idx] == tick:
                buffer = buffer + [tick]
                arrived = 1
                idx = idx + 1
            else:
                idx = idx
                tick = tick
                idx = idx + 0
                break
        if arrived == 1:
            if debounce == 1:
                timer_base = tick
        fire = 0
        if len(buffer) >= size_limit:
            fire = 1
        if len(buffer) > 0:
            if tick - timer_base >= t:
                fire = 1
        if fire == 1:
            for a in buffer:
                lat = tick - a
                if lat > worst:
                    worst = lat
                flushed = flushed + 1
            flush_log = flush_log + [len(buffer)]
            buffer = []
            timer_base = tick
        tick = tick + 1
    return [flush_log, worst, flushed]

def stream(gap, n, start):
    out = []
    i = 0
    while i < n:
        out = out + [start + i * gap]
        i = i + 1
    return out

SIZE = 5
T = 10
print("stream                       impl       flushes  worst latency  bound T")
print("---------------------------  ---------  -------  -------------  -------")
results = {}
for spec in [["idle trickle (gap 20)", 20, 6], ["steady stream (gap 4)", 4, 40], ["slow stream  (gap 9)", 9, 20]]:
    arr = stream(spec[1], spec[2], 5)
    for impl in ["deadline", "debounce"]:
        d = 0
        if impl == "debounce":
            d = 1
        r = simulate(arr, SIZE, T, d)
        results[spec[0] + "/" + impl] = [r[1], len(r[0]), r[2]]
        print((spec[0] + "                             ")[0:29] + (impl + "           ")[0:11] + (str(len(r[0])) + "         ")[0:9] + (str(r[1]) + "               ")[0:15] + str(T))
print("")
print("size limit: " + str(SIZE) + ", timer: " + str(T) + " ticks")
print("")
print("where the two implementations differ")
for name in ["idle trickle (gap 20)", "steady stream (gap 4)", "slow stream  (gap 9)"]:
    a = results[name + "/deadline"]
    b = results[name + "/debounce"]
    if a[0] == b[0]:
        note = "same worst latency"
    else:
        note = "debounce is worse by " + str(b[0] - a[0])
    print((name + "                             ")[0:29] + note)
print("")
print("the arrival gap that decides it")
for gap in [4, 8, 9, 10, 11, 15]:
    arr = stream(gap, 20, 5)
    r = simulate(arr, SIZE, T, 1)
    small_flushes = 0
    for f in r[0]:
        if f < SIZE:
            small_flushes = small_flushes + 1
    print("gap " + (str(gap) + "   ")[0:4] + " flushes: " + (str(len(r[0])) + "   ")[0:4] + " below the size limit: " + (str(small_flushes) + "   ")[0:4] + " worst latency: " + str(r[1]))
print("")
checked = 0
passed = 0
checked = checked + 1
if results["idle trickle (gap 20)/deadline"][0] <= T:
    if results["idle trickle (gap 20)/debounce"][0] <= T:
        passed = passed + 1
checked = checked + 1
deadline_breaches = 0
for name in ["idle trickle (gap 20)", "steady stream (gap 4)", "slow stream  (gap 9)"]:
    if results[name + "/deadline"][0] > T:
        deadline_breaches = deadline_breaches + 1
if deadline_breaches == 0:
    passed = passed + 1
checked = checked + 1
debounce_breaches = 0
for name in ["idle trickle (gap 20)", "steady stream (gap 4)", "slow stream  (gap 9)"]:
    if results[name + "/debounce"][0] > T:
        debounce_breaches = debounce_breaches + 1
if debounce_breaches > 0:
    passed = passed + 1
checked = checked + 1
if results["slow stream  (gap 9)/debounce"][0] > T:
    passed = passed + 1
checked = checked + 1
lost = 0
for name in ["idle trickle (gap 20)", "steady stream (gap 4)", "slow stream  (gap 9)"]:
    if not results[name + "/deadline"][2] == results[name + "/debounce"][2]:
        lost = lost + 1
if lost == 0:
    passed = passed + 1
checked = checked + 1
arr9 = stream(9, 20, 5)
r9 = simulate(arr9, SIZE, T, 1)
small9 = 0
for f in r9[0]:
    if f < SIZE:
        small9 = small9 + 1
arr15 = stream(15, 20, 5)
r15 = simulate(arr15, SIZE, T, 1)
small15 = 0
for f in r15[0]:
    if f < SIZE:
        small15 = small15 + 1
if small9 == 0:
    if small15 > 0:
        passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The latency guarantee held while the system was idle."
else:
    verdict = "FAILED - the buffers did not behave as the checks describe."
print(verdict)
print("")
print("'Flush after T ticks' and 'flush T ticks after the last arrival' differ by")
print("which event resets the clock, and the second one is what you get if you put")
print("the reset next to the code that handles an arrival - which is where an")
print("arrival handler naturally lives. The guarantee is then conditional on")
print("idleness, and it is stated unconditionally in the design doc.")
```

## stdout (executed)

```text
stream                       impl       flushes  worst latency  bound T
---------------------------  ---------  -------  -------------  -------
idle trickle (gap 20)        deadline   6        5              10
idle trickle (gap 20)        debounce   6        10             10
steady stream (gap 4)        deadline   17       9              10
steady stream (gap 4)        debounce   8        16             10
slow stream  (gap 9)         deadline   18       9              10
slow stream  (gap 9)         debounce   4        36             10

size limit: 5, timer: 10 ticks

where the two implementations differ
idle trickle (gap 20)        debounce is worse by 5
steady stream (gap 4)        debounce is worse by 7
slow stream  (gap 9)         debounce is worse by 27

the arrival gap that decides it
gap 4    flushes: 4    below the size limit: 0    worst latency: 16
gap 8    flushes: 4    below the size limit: 0    worst latency: 32
gap 9    flushes: 4    below the size limit: 0    worst latency: 36
gap 10   flushes: 4    below the size limit: 0    worst latency: 40
gap 11   flushes: 20   below the size limit: 20   worst latency: 10
gap 15   flushes: 16   below the size limit: 16   worst latency: 10

checks passed: 6/6
The latency guarantee held while the system was idle.

'Flush after T ticks' and 'flush T ticks after the last arrival' differ by
which event resets the clock, and the second one is what you get if you put
the reset next to the code that handles an arrival - which is where an
arrival handler naturally lives. The guarantee is then conditional on
idleness, and it is stated unconditionally in the design doc.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
