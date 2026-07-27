<!-- canonical: efficientnewlanguage.org/ai/examples/118-moving-average | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 118 — Moving average (sliding window)

`moving_average.eml` computes a moving average incrementally — the first window is summed once, and every window after it adds the entering value and subtracts the leaving one.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The moving
# average of a series over a sliding window, computed INCREMENTALLY: the
# first window is summed once, and every window after it adds the entering
# value and subtracts the leaving one.
#
# That is the whole point. Re-summing each window costs O(n*k); sliding
# the total costs O(n) no matter how wide the window is. The naive version
# is written out too, and the results compared, rather than the fast
# version simply being asserted correct.
#
# But the speed is not free, and the float series below SHOWS the price.
# A running total carries its rounding error forward: the fourth smoothed
# temperature comes out 22.399999999999995 where summing that window
# directly gives exactly 22.4. The two methods are algebraically identical
# and numerically are not, because floating-point addition is not
# associative and the sliding version adds in a different order.
#
# So the comparison uses a tolerance rather than `==` — not as caution,
# but because exact equality is the wrong claim. Incremental updates buy
# O(n) at the cost of accumulated drift; over a long enough series that
# drift is worth periodically correcting with a fresh sum.

def naive_moving_average(values, window):
    len(values) => n
    result^+[]
    0 => start
    while start + window <= n:
        0 => total
        0 => offset
        while offset < window:
            total + values[start + offset] => total
            offset + 1 => offset
        result + [total / window] => result
        start + 1 => start
    return result

def sliding_moving_average(values, window):
    len(values) => n
    result^+[]
    if window <= 0 or window > n:
        return result
    0 => total
    0 => i
    while i < window:
        total + values[i] => total
        i + 1 => i
    result + [total / window] => result
    window => i
    while i < n:
        total + values[i] - values[i - window] => total
        result + [total / window] => result
        i + 1 => i
    return result

def absolute(x):
    if x < 0:
        return 0 - x
    return x

readings^+[10, 20, 30, 40, 50, 60]
3 => window

sliding_moving_average(readings, window) => fast
naive_moving_average(readings, window) => slow

"Readings: " + str(readings) => msg1
msg1^0
"Window " + str(window) + " moving average: " + str(fast) => msg2
msg2^0

1 => agree
0 => i
while i < len(fast):
    absolute(fast[i] - slow[i]) => difference
    if difference > 0.0000001:
        0 => agree
    i + 1 => i

if agree == 1:
    "Sliding and re-summing agree on all " + str(len(fast)) + " windows" => msg3
else:
    "MISMATCH between sliding and re-summing" => msg3
msg3^0

"" => blank
blank^0
temperatures^+[18.5, 19.2, 21.7, 20.1, 22.8, 24.3, 23.9]
sliding_moving_average(temperatures, 3) => smoothed
"Temperatures: " + str(temperatures) => msg4
msg4^0
"Smoothed (window 3): " + str(smoothed) => msg5
msg5^0
"A window wider than the series returns nothing: " + str(sliding_moving_average(readings, 99)) => msg6
msg6^0
```

## Python (deterministic transpilation)

```python
def naive_moving_average(values, window):
    n = len(values)
    result = []
    start = 0
    while start + window <= n:
        total = 0
        offset = 0
        while offset < window:
            total = total + values[start + offset]
            offset = offset + 1
        result = result + [total / window]
        start = start + 1
    return result

def sliding_moving_average(values, window):
    n = len(values)
    result = []
    if window <= 0 or window > n:
        return result
    total = 0
    i = 0
    while i < window:
        total = total + values[i]
        i = i + 1
    result = result + [total / window]
    i = window
    while i < n:
        total = total + values[i] - values[i - window]
        result = result + [total / window]
        i = i + 1
    return result

def absolute(x):
    if x < 0:
        return 0 - x
    return x

readings = [10, 20, 30, 40, 50, 60]
window = 3
fast = sliding_moving_average(readings, window)
slow = naive_moving_average(readings, window)
msg1 = "Readings: " + str(readings)
print(msg1)
msg2 = "Window " + str(window) + " moving average: " + str(fast)
print(msg2)
agree = 1
i = 0
while i < len(fast):
    difference = absolute(fast[i] - slow[i])
    if difference > 0.0000001:
        agree = 0
    i = i + 1
if agree == 1:
    msg3 = "Sliding and re-summing agree on all " + str(len(fast)) + " windows"
else:
    msg3 = "MISMATCH between sliding and re-summing"
print(msg3)
blank = ""
print(blank)
temperatures = [18.5, 19.2, 21.7, 20.1, 22.8, 24.3, 23.9]
smoothed = sliding_moving_average(temperatures, 3)
msg4 = "Temperatures: " + str(temperatures)
print(msg4)
msg5 = "Smoothed (window 3): " + str(smoothed)
print(msg5)
msg6 = "A window wider than the series returns nothing: " + str(sliding_moving_average(readings, 99))
print(msg6)
```

## stdout (executed)

```text
Readings: [10, 20, 30, 40, 50, 60]
Window 3 moving average: [20.0, 30.0, 40.0, 50.0]
Sliding and re-summing agree on all 4 windows

Temperatures: [18.5, 19.2, 21.7, 20.1, 22.8, 24.3, 23.9]
Smoothed (window 3): [19.8, 20.333333333333332, 21.53333333333333, 22.399999999999995, 23.666666666666668]
A window wider than the series returns nothing: []
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
