<!-- canonical: efficientnewlanguage.org/ai/examples/157-char-frequency-table | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 157 — Counting with a dict, in first-appearance order

`char_frequency_table.eml` tallies the characters of a phrase and prints a bar chart.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Counting
# characters is the smallest honest use of a dict-as-accumulator, and it shows
# insertion order doing real work: the table comes out in FIRST-APPEARANCE
# order, which is often exactly what you want in a report and is impossible to
# get from a structure with unspecified ordering.
#
# The idiom below is the "check then insert" form rather than dict.setdefault
# or collections.Counter, neither of which EML-P models. That is not a
# workaround - it is the shape the language actually supports, and it makes
# the ordering guarantee visible in the source.

def tally(text):
    {} => counts
    for ch in text:
        if ch in counts:
            counts[ch] + 1 => counts[ch]
        else:
            1 => counts[ch]
    return counts

"mississippi river" => phrase
tally(phrase) => counts

("Text: " + repr(phrase))^0
("Length: " + str(len(phrase)) + " characters, " + str(len(counts)) + " distinct")^0
""^0

"char  count  bar" => header
header^0
"----  -----  ------------" => rule
rule^0
for ch in counts:
    counts[ch] => n
    repr(ch) => shown
    6 - len(shown) => pad
    if pad < 1:
        1 => pad
    (shown + " " * pad + str(n) + "      " + "#" * n)^0

""^0
# The most frequent character: found by walking, since max() over a dict would
# compare KEYS, not values.
"" => best_char
0 => best_count
for ch in counts:
    if counts[ch] > best_count:
        counts[ch] => best_count
        ch => best_char
("Most frequent: " + repr(best_char) + " (" + str(best_count) + " times)")^0

# A useful cross-check: the counts must add back up to the original length.
[] => all_counts
for ch in counts:
    all_counts + [counts[ch]] => all_counts
("Counts sum to " + str(sum(all_counts)) + ", text length is " + str(len(phrase)) + " -> " + str(sum(all_counts) == len(phrase)))^0

""^0
"The table is in first-appearance order, not alphabetical -" => n1
n1^0
"'m' leads because it opens the phrase, not because it sorts first." => n2
n2^0
```

## Python (deterministic transpilation)

```python
def tally(text):
    counts = {}
    for ch in text:
        if ch in counts:
            counts[ch] = counts[ch] + 1
        else:
            counts[ch] = 1
    return counts

phrase = "mississippi river"
counts = tally(phrase)
print("Text: " + repr(phrase))
print("Length: " + str(len(phrase)) + " characters, " + str(len(counts)) + " distinct")
print("")
header = "char  count  bar"
print(header)
rule = "----  -----  ------------"
print(rule)
for ch in counts:
    n = counts[ch]
    shown = repr(ch)
    pad = 6 - len(shown)
    if pad < 1:
        pad = 1
    print(shown + " " * pad + str(n) + "      " + "#" * n)
print("")
best_char = ""
best_count = 0
for ch in counts:
    if counts[ch] > best_count:
        best_count = counts[ch]
        best_char = ch
print("Most frequent: " + repr(best_char) + " (" + str(best_count) + " times)")
all_counts = []
for ch in counts:
    all_counts = all_counts + [counts[ch]]
print("Counts sum to " + str(sum(all_counts)) + ", text length is " + str(len(phrase)) + " -> " + str(sum(all_counts) == len(phrase)))
print("")
n1 = "The table is in first-appearance order, not alphabetical -"
print(n1)
n2 = "'m' leads because it opens the phrase, not because it sorts first."
print(n2)
```

## stdout (executed)

```text
Text: 'mississippi river'
Length: 17 characters, 8 distinct

char  count  bar
----  -----  ------------
'm'   1      #
'i'   5      #####
's'   4      ####
'p'   2      ##
' '   1      #
'r'   2      ##
'v'   1      #
'e'   1      #

Most frequent: 'i' (5 times)
Counts sum to 17, text length is 17 -> True

The table is in first-appearance order, not alphabetical -
'm' leads because it opens the phrase, not because it sorts first.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
