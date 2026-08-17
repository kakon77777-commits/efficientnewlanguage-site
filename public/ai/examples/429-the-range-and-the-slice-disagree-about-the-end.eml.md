<!-- canonical: efficientnewlanguage.org/ai/examples/429-the-range-and-the-slice-disagree-about-the-end | ai_layer_version: 0.1.0 | updated: 2026-08-17 -->

# Example 429 — The range and the slice disagree about the end

`the_range_and_the_slice_disagree_about_the_end.eml` - Two constructs in one language, both written [a:b], and they do not mean the same b.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two constructs in
# one language, both written [a:b], and they do not mean the same b.
#
# Neither choice is wrong. A for-range that includes its end reads the way a
# person says "one to ten". A slice that excludes its end makes lengths
# subtract cleanly and makes adjacent slices tile without overlap. Most
# languages pick one convention; this one has both, each where it is natural.
#
# The cost lands on code that uses them together, because the same bracket
# syntax carries two different promises about b. Every claim below is measured
# by running both constructs over the same bounds.

"abcdefgh" => s
len(s) => n

"string : " + s + ", length " + str(n) ^0
"" ^0

# ---- what each one does with the same pair of numbers ----

"for i in [2:5] visits" ^0
"" => visited
for i in [2:5]:
    visited + str(i) + " " => visited
"  " + visited ^0
0 => count
for i in [2:5]:
    count + 1 => count
"  values visited : " + str(count) ^0
"" ^0

"s[2:5] is" ^0
"  " + s[2:5] ^0
"  characters : " + str(len(s[2:5])) ^0
"" ^0

if count == len(s[2:5]) + 1:
    "  the range visits exactly one more index than the slice yields" ^0
"" ^0

# ---- the off-by-one this produces ----
#
# Walking a string by index with a for-range and slicing with the same bounds
# is the natural thing to write, and it reads one character short every time.

"walking the string with a for-range over indices" ^0
"" => walked
for i in [0:n - 1]:
    walked + s[i:i + 1] => walked
"  rebuilt : " + walked ^0
"  original : " + s ^0
if walked == s:
    "  identical - because s[i:i+1] takes one character and the range covers" ^0
    "  0 to n-1 inclusive, which is every index" ^0
"" ^0

"the same walk written with the slice bound reused as the range bound" ^0
"" => short
for i in [0:n]:
    short + s[i:i + 1] => short
"  rebuilt : " + short + "|" ^0
"  length : " + str(len(short)) ^0
if len(short) == n:
    "  index n yields the empty slice rather than an error, so the loop runs" ^0
    "  one extra time and appends nothing" ^0
"" ^0

# ---- the boundary values, one at a time ----

"slices at and past the end" ^0
"  s[" + str(n - 1) + ":" + str(n) + "] : '" + s[n - 1:n] + "'" ^0
"  s[" + str(n) + ":" + str(n) + "] : '" + s[n:n] + "'" ^0
"  s[" + str(n) + ":" + str(n + 2) + "] : '" + s[n:n + 2] + "'" ^0
"  past the end is empty, not an error" ^0
"" ^0

# ---- tiling ----
#
# The slice convention is the one that makes halves join back up.

3 => cut
"  s[0:" + str(cut) + "] + s[" + str(cut) + ":" + str(n) + "] : " + s[0:cut] + s[cut:n] ^0
if s[0:cut] + s[cut:n] == s:
    "  the two halves tile exactly, with the cut index appearing once" ^0
"" ^0

# ---- and the range convention is the one that counts ----

0 => days
for d in [1:7]:
    days + 1 => days
"  for d in [1:7] gives " + str(days) + " days, which is what a week is" ^0
"" ^0

# ---- the control: bounds where the two agree ----
#
# An empty range and an empty slice coincide, so a check on empty input cannot
# tell the two conventions apart.

0 => empty_visits
for i in [3:2]:
    empty_visits + 1 => empty_visits
"control - a backwards pair" ^0
"  for i in [3:2] visits : " + str(empty_visits) ^0
"  s[3:2] is : '" + s[3:2] + "'" ^0
if empty_visits == 0:
    if len(s[3:2]) == 0:
        "  both empty, so a test on this input distinguishes nothing" ^0
"" ^0

"Both conventions are the right one for their construct. They share a" ^0
"notation, so which promise [a:b] makes is decided by what is to the left of" ^0
"it." ^0
```

## Python (deterministic transpilation)

```python
s = "abcdefgh"
n = len(s)
print("string : " + s + ", length " + str(n))
print("")
print("for i in [2:5] visits")
visited = ""
for i in range(2, 6):
    visited = visited + str(i) + " "
print("  " + visited)
count = 0
for i in range(2, 6):
    count = count + 1
print("  values visited : " + str(count))
print("")
print("s[2:5] is")
print("  " + s[2:5])
print("  characters : " + str(len(s[2:5])))
print("")
if count == len(s[2:5]) + 1:
    print("  the range visits exactly one more index than the slice yields")
print("")
print("walking the string with a for-range over indices")
walked = ""
for i in range(0, n):
    walked = walked + s[i:i + 1]
print("  rebuilt : " + walked)
print("  original : " + s)
if walked == s:
    print("  identical - because s[i:i+1] takes one character and the range covers")
    print("  0 to n-1 inclusive, which is every index")
print("")
print("the same walk written with the slice bound reused as the range bound")
short = ""
for i in range(0, n+1):
    short = short + s[i:i + 1]
print("  rebuilt : " + short + "|")
print("  length : " + str(len(short)))
if len(short) == n:
    print("  index n yields the empty slice rather than an error, so the loop runs")
    print("  one extra time and appends nothing")
print("")
print("slices at and past the end")
print("  s[" + str(n - 1) + ":" + str(n) + "] : '" + s[n - 1:n] + "'")
print("  s[" + str(n) + ":" + str(n) + "] : '" + s[n:n] + "'")
print("  s[" + str(n) + ":" + str(n + 2) + "] : '" + s[n:n + 2] + "'")
print("  past the end is empty, not an error")
print("")
cut = 3
print("  s[0:" + str(cut) + "] + s[" + str(cut) + ":" + str(n) + "] : " + s[0:cut] + s[cut:n])
if s[0:cut] + s[cut:n] == s:
    print("  the two halves tile exactly, with the cut index appearing once")
print("")
days = 0
for d in range(1, 8):
    days = days + 1
print("  for d in [1:7] gives " + str(days) + " days, which is what a week is")
print("")
empty_visits = 0
for i in range(3, 3):
    empty_visits = empty_visits + 1
print("control - a backwards pair")
print("  for i in [3:2] visits : " + str(empty_visits))
print("  s[3:2] is : '" + s[3:2] + "'")
if empty_visits == 0:
    if len(s[3:2]) == 0:
        print("  both empty, so a test on this input distinguishes nothing")
print("")
print("Both conventions are the right one for their construct. They share a")
print("notation, so which promise [a:b] makes is decided by what is to the left of")
print("it.")
```

## stdout (executed)

```text
string : abcdefgh, length 8

for i in [2:5] visits
  2 3 4 5 
  values visited : 4

s[2:5] is
  cde
  characters : 3

  the range visits exactly one more index than the slice yields

walking the string with a for-range over indices
  rebuilt : abcdefgh
  original : abcdefgh
  identical - because s[i:i+1] takes one character and the range covers
  0 to n-1 inclusive, which is every index

the same walk written with the slice bound reused as the range bound
  rebuilt : abcdefgh|
  length : 8
  index n yields the empty slice rather than an error, so the loop runs
  one extra time and appends nothing

slices at and past the end
  s[7:8] : 'h'
  s[8:8] : ''
  s[8:10] : ''
  past the end is empty, not an error

  s[0:3] + s[3:8] : abcdefgh
  the two halves tile exactly, with the cut index appearing once

  for d in [1:7] gives 7 days, which is what a week is

control - a backwards pair
  for i in [3:2] visits : 0
  s[3:2] is : ''
  both empty, so a test on this input distinguishes nothing

Both conventions are the right one for their construct. They share a
notation, so which promise [a:b] makes is decided by what is to the left of
it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
