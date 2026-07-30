<!-- canonical: efficientnewlanguage.org/ai/examples/165-rgb-palette-blender | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 165 — Blending colours, one channel at a time

`rgb_palette_blender.eml` adds and scales `(r, g, b)` tuples with each channel clamped independently.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Colour blending
# with (r, g, b) tuples. Each channel is clamped independently, which is the
# whole reason a colour is a record of three values rather than one number.
#
# The clamp is where naive blending goes wrong: adding two bright colours
# overflows past 255, and without a clamp the result wraps or simply becomes
# meaningless. Printing the raw sum next to the clamped result makes the
# correction visible instead of invisible.

def clamp(v, low, high):
    if v < low:
        return low
    if v > high:
        return high
    return v

def add_channels(a, b):
    return (clamp(a[0] + b[0], 0, 255), clamp(a[1] + b[1], 0, 255), clamp(a[2] + b[2], 0, 255))

def scale(c, factor):
    return (clamp(int(c[0] * factor), 0, 255), clamp(int(c[1] * factor), 0, 255), clamp(int(c[2] * factor), 0, 255))

def brightness(c):
    return sum(c) / 3

(200, 60, 30) => warm
(20, 120, 220) => cool

("warm = " + str(warm) + "   brightness " + str(brightness(warm)))^0
("cool = " + str(cool) + "  brightness " + str(brightness(cool)))^0
""^0

add_channels(warm, cool) => blended
("blended        = " + str(blended))^0
("raw sums would be (" + str(warm[0] + cool[0]) + ", " + str(warm[1] + cool[1]) + ", " + str(warm[2] + cool[2]) + ") - the red channel needed clamping")^0
""^0

"factor  result" => header
header^0
"------  --------------" => rule
rule^0
for f in [0.25, 0.5, 1.0, 1.5]:
    scale(warm, f) => out
    str(f) => shown
    8 - len(shown) => pad
    if pad < 1:
        1 => pad
    (shown + " " * pad + str(out))^0

""^0
# Channel-wise questions use the tuple directly.
("Brightest channel of " + str(blended) + " is " + str(max(blended)))^0
("Darkest is " + str(min(blended)) + ", total ink " + str(sum(blended)))^0
("A colour always has " + str(len(blended)) + " channels - that is what makes it a tuple and not a list.")^0
```

## Python (deterministic transpilation)

```python
def clamp(v, low, high):
    if v < low:
        return low
    if v > high:
        return high
    return v

def add_channels(a, b):
    return (clamp(a[0] + b[0], 0, 255), clamp(a[1] + b[1], 0, 255), clamp(a[2] + b[2], 0, 255))

def scale(c, factor):
    return (clamp(int(c[0] * factor), 0, 255), clamp(int(c[1] * factor), 0, 255), clamp(int(c[2] * factor), 0, 255))

def brightness(c):
    return sum(c) / 3

warm = (200, 60, 30)
cool = (20, 120, 220)
print("warm = " + str(warm) + "   brightness " + str(brightness(warm)))
print("cool = " + str(cool) + "  brightness " + str(brightness(cool)))
print("")
blended = add_channels(warm, cool)
print("blended        = " + str(blended))
print("raw sums would be (" + str(warm[0] + cool[0]) + ", " + str(warm[1] + cool[1]) + ", " + str(warm[2] + cool[2]) + ") - the red channel needed clamping")
print("")
header = "factor  result"
print(header)
rule = "------  --------------"
print(rule)
for f in [0.25, 0.5, 1.0, 1.5]:
    out = scale(warm, f)
    shown = str(f)
    pad = 8 - len(shown)
    if pad < 1:
        pad = 1
    print(shown + " " * pad + str(out))
print("")
print("Brightest channel of " + str(blended) + " is " + str(max(blended)))
print("Darkest is " + str(min(blended)) + ", total ink " + str(sum(blended)))
print("A colour always has " + str(len(blended)) + " channels - that is what makes it a tuple and not a list.")
```

## stdout (executed)

```text
warm = (200, 60, 30)   brightness 96.66666666666667
cool = (20, 120, 220)  brightness 120.0

blended        = (220, 180, 250)
raw sums would be (220, 180, 250) - the red channel needed clamping

factor  result
------  --------------
0.25    (50, 15, 7)
0.5     (100, 30, 15)
1.0     (200, 60, 30)
1.5     (255, 90, 45)

Brightest channel of (220, 180, 250) is 250
Darkest is 180, total ink 650
A colour always has 3 channels - that is what makes it a tuple and not a list.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
