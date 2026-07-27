<!-- canonical: efficientnewlanguage.org/ai/examples/113-histogram-builder | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 113 — Histogram builder

`histogram_builder.eml` buckets 20 scores into equal-width ranges and draws each bucket as a bar:

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Buckets a
# list of scores into equal-width ranges and draws each bucket as a bar.
#
# The subtle part is the top edge. A value exactly equal to the upper
# bound computes bucket index `count`, one past the last bucket, because
# the ranges are half-open everywhere except at the very end. Clamping
# that one value into the final bucket is what makes the highest possible
# score land somewhere instead of being dropped or crashing — and the
# sample data includes a 100 for exactly that reason.
#
# The bucket counts are checked against the input length at the end: every
# value must land in exactly one bucket, so the counts have to sum back to
# the number of scores. That catches both a dropped top edge and any
# double-counting, which "it drew some bars" would not.

def build_histogram(values, low, high, bucket_count):
    counts^+[]
    0 => i
    while i < bucket_count:
        counts + [0] => counts
        i + 1 => i
    (high - low) / bucket_count => width
    for value in values:
        int((value - low) / width) => index
        if index >= bucket_count:
            bucket_count - 1 => index
        if index < 0:
            0 => index
        counts[index] + 1 => counts[index]
    return counts

def bar(count):
    "" => rendered
    0 => i
    while i < count:
        rendered + "#" => rendered
        i + 1 => i
    return rendered

scores^+[100, 55, 72, 68, 91, 43, 77, 84, 62, 95,
         38, 71, 66, 89, 74, 58, 81, 93, 47, 70]

0 => low
100 => high
5 => buckets

build_histogram(scores, low, high, buckets) => counts

"Score distribution (" + str(len(scores)) + " scores, " + str(buckets) + " buckets):" => header
header^0

int((high - low) / buckets) => width
0 => b
while b < buckets:
    low + b * width => range_low
    range_low + width => range_high
    counts[b] => count
    str(range_low) + "-" + str(range_high) + ": " + bar(count) + " " + str(count) => line
    line^0
    b + 1 => b

0 => total
for count in counts:
    total + count => total

"" => blank
blank^0
if total == len(scores):
    "All " + str(total) + " scores landed in exactly one bucket" => check
else:
    "BUCKET COUNT MISMATCH: " + str(total) + " placed, " + str(len(scores)) + " given" => check
check^0
"(the 100 would fall outside without the top-edge clamp)" => note
note^0
```

## Python (deterministic transpilation)

```python
def build_histogram(values, low, high, bucket_count):
    counts = []
    i = 0
    while i < bucket_count:
        counts = counts + [0]
        i = i + 1
    width = (high - low) / bucket_count
    for value in values:
        index = int((value - low) / width)
        if index >= bucket_count:
            index = bucket_count - 1
        if index < 0:
            index = 0
        counts[index] = counts[index] + 1
    return counts

def bar(count):
    rendered = ""
    i = 0
    while i < count:
        rendered = rendered + "#"
        i = i + 1
    return rendered

scores = [100, 55, 72, 68, 91, 43, 77, 84, 62, 95, 38, 71, 66, 89, 74, 58, 81, 93, 47, 70]
low = 0
high = 100
buckets = 5
counts = build_histogram(scores, low, high, buckets)
header = "Score distribution (" + str(len(scores)) + " scores, " + str(buckets) + " buckets):"
print(header)
width = int((high - low) / buckets)
b = 0
while b < buckets:
    range_low = low + b * width
    range_high = range_low + width
    count = counts[b]
    line = str(range_low) + "-" + str(range_high) + ": " + bar(count) + " " + str(count)
    print(line)
    b = b + 1
total = 0
for count in counts:
    total = total + count
blank = ""
print(blank)
if total == len(scores):
    check = "All " + str(total) + " scores landed in exactly one bucket"
else:
    check = "BUCKET COUNT MISMATCH: " + str(total) + " placed, " + str(len(scores)) + " given"
print(check)
note = "(the 100 would fall outside without the top-edge clamp)"
print(note)
```

## stdout (executed)

```text
Score distribution (20 scores, 5 buckets):
0-20:  0
20-40: # 1
40-60: #### 4
60-80: ######## 8
80-100: ####### 7

All 20 scores landed in exactly one bucket
(the 100 would fall outside without the top-edge clamp)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
