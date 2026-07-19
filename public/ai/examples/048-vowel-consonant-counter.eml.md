<!-- canonical: efficientnewlanguage.org/ai/examples/048-vowel-consonant-counter | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 048 — Vowel/consonant counter

`vowel_consonant_counter.eml` counts vowels, consonants, and spaces in the sample sentence `"the quick brown fox jumps over the lazy dog"` and prints a small report.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Counts
# vowels, consonants, and spaces in a sample sentence using a loop and `in`
# membership tests against small literal string/set collections.

sentence^+"the quick brown fox jumps over the lazy dog"
vowels^+"aeiou"

vowel_count^+0
consonant_count^+0
space_count^+0

for ch in sentence:
    if ch == " ":
        space_count^+1
    elif ch in vowels:
        vowel_count^+1
    else:
        consonant_count^+1

"Sentence: " + sentence => line1
line1^0
"Vowels: " + str(vowel_count) => line2
line2^0
"Consonants: " + str(consonant_count) => line3
line3^0
"Spaces: " + str(space_count) => line4
line4^0
```

## Python (deterministic transpilation)

```python
sentence = "the quick brown fox jumps over the lazy dog"
vowels = "aeiou"
vowel_count = 0
consonant_count = 0
space_count = 0
for ch in sentence:
    if ch == " ":
        space_count += 1
    elif ch in vowels:
        vowel_count += 1
    else:
        consonant_count += 1
line1 = "Sentence: " + sentence
print(line1)
line2 = "Vowels: " + str(vowel_count)
print(line2)
line3 = "Consonants: " + str(consonant_count)
print(line3)
line4 = "Spaces: " + str(space_count)
print(line4)
```

## stdout (executed)

```text
Sentence: the quick brown fox jumps over the lazy dog
Vowels: 11
Consonants: 24
Spaces: 8
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:augment · eml:output · eml:run:done
