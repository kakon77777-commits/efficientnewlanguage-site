<!-- canonical: efficientnewlanguage.org/ai/examples/027-list-rotator | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 027 — List rotator

`list_rotator.eml` rotates two sample lists — a song playlist and a job queue — left and right by a given amount, using slice concatenation — one of a seven-case self-authored batch of list/collection utilities for the EML case corpus (see [`examples/list-statistics/`](../list-statistics/), [`examples/duplicate-remover/`](../duplicate-remover/), [`examples/matrix-transpose-manual/`](../matrix-transpose-manual/), [`examples/intersection-union-finder/`](../intersection-union-finder/), [`examples/second-largest-finder/`](../second-largest-finder/), and [`examples/shopping-cart-total/`](../shopping-cart-total/) for the other six).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Rotates a
# sample list left and right by a given amount using Python slice syntax and
# concatenation (`lst[a:b] + lst[c:d]`), for two different sample lists and
# rotation amounts.

playlist^+["Intro", "Verse1", "Chorus", "Verse2", "Bridge", "Outro"]
len(playlist) => n
shift^+2

(playlist[shift:n] + playlist[0:shift]) => rotated_left
(playlist[n - shift:n] + playlist[0:n - shift]) => rotated_right

"Playlist: " + str(playlist) => msg1
msg1^0
"Rotated left by " + str(shift) + ": " + str(rotated_left) => msg2
msg2^0
"Rotated right by " + str(shift) + ": " + str(rotated_right) => msg3
msg3^0

queue^+[101, 102, 103, 104, 105]
len(queue) => m
shift2^+3

(queue[shift2:m] + queue[0:shift2]) => queue_left
(queue[m - shift2:m] + queue[0:m - shift2]) => queue_right

"Queue: " + str(queue) => msg4
msg4^0
"Rotated left by " + str(shift2) + ": " + str(queue_left) => msg5
msg5^0
"Rotated right by " + str(shift2) + ": " + str(queue_right) => msg6
msg6^0
```

## Python (deterministic transpilation)

```python
playlist = ["Intro", "Verse1", "Chorus", "Verse2", "Bridge", "Outro"]
n = len(playlist)
shift = 2
rotated_left = playlist[shift:n] + playlist[0:shift]
rotated_right = playlist[n - shift:n] + playlist[0:n - shift]
msg1 = "Playlist: " + str(playlist)
print(msg1)
msg2 = "Rotated left by " + str(shift) + ": " + str(rotated_left)
print(msg2)
msg3 = "Rotated right by " + str(shift) + ": " + str(rotated_right)
print(msg3)
queue = [101, 102, 103, 104, 105]
m = len(queue)
shift2 = 3
queue_left = queue[shift2:m] + queue[0:shift2]
queue_right = queue[m - shift2:m] + queue[0:m - shift2]
msg4 = "Queue: " + str(queue)
print(msg4)
msg5 = "Rotated left by " + str(shift2) + ": " + str(queue_left)
print(msg5)
msg6 = "Rotated right by " + str(shift2) + ": " + str(queue_right)
print(msg6)
```

## stdout (executed)

```text
Playlist: ['Intro', 'Verse1', 'Chorus', 'Verse2', 'Bridge', 'Outro']
Rotated left by 2: ['Chorus', 'Verse2', 'Bridge', 'Outro', 'Intro', 'Verse1']
Rotated right by 2: ['Bridge', 'Outro', 'Intro', 'Verse1', 'Chorus', 'Verse2']
Queue: [101, 102, 103, 104, 105]
Rotated left by 3: [104, 105, 101, 102, 103]
Rotated right by 3: [103, 104, 105, 101, 102]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
