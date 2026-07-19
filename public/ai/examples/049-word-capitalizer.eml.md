<!-- canonical: efficientnewlanguage.org/ai/examples/049-word-capitalizer | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 049 — Word capitalizer

`word_capitalizer.eml` title-cases the sample sentence `"the quick brown fox jumps over the lazy dog"` into `"The Quick Brown Fox Jumps Over The Lazy Dog"` without using a `.title()`/`.capitalize()` builtin.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Title-cases
# a sample sentence without any interpreter-deferred string method
# (`.split`/`.join`/`.upper` all genuinely defer to real Python in the
# browser interpreter — see this case's README) — split, uppercase, and
# rejoin are all done by hand: a manual scan builds the word list
# (`existing + [item] => existing`, the same growth idiom used by
# `simple-stack`/`prime-checker`), a 26-letter lookup table uppercases each
# word's first character, and a manual loop rejoins the words with single
# spaces. Keeps the whole program interpreter-computable.

sentence^+"the quick brown fox jumps over the lazy dog"
LOWER^+"abcdefghijklmnopqrstuvwxyz"
UPPER^+"ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def to_upper(ch):
    for idx in [0:25]:
        if LOWER[idx] == ch:
            return UPPER[idx]
    return ch

words^+[]
current^+""
for ch in sentence:
    if ch == " ":
        words + [current] => words
        "" => current
    else:
        current + ch => current
words + [current] => words

capitalized_words^+[]
for word in words:
    word[0] => first
    to_upper(first) => first_up
    word[1:] => rest
    first_up + rest => new_word
    capitalized_words + [new_word] => capitalized_words

title_cased^+""
is_first^+True
for word in capitalized_words:
    if is_first:
        title_cased + word => title_cased
        False => is_first
    else:
        title_cased + " " + word => title_cased

"Original:    " + sentence => line1
line1^0
"Capitalized: " + title_cased => line2
line2^0
```

## Python (deterministic transpilation)

```python
sentence = "the quick brown fox jumps over the lazy dog"
LOWER = "abcdefghijklmnopqrstuvwxyz"
UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def to_upper(ch):
    for idx in range(0, 26):
        if LOWER[idx] == ch:
            return UPPER[idx]
    return ch

words = []
current = ""
for ch in sentence:
    if ch == " ":
        words = words + [current]
        current = ""
    else:
        current = current + ch
words = words + [current]
capitalized_words = []
for word in words:
    first = word[0]
    first_up = to_upper(first)
    rest = word[1:]
    new_word = first_up + rest
    capitalized_words = capitalized_words + [new_word]
title_cased = ""
is_first = True
for word in capitalized_words:
    if is_first:
        title_cased = title_cased + word
        is_first = False
    else:
        title_cased = title_cased + " " + word
line1 = "Original:    " + sentence
print(line1)
line2 = "Capitalized: " + title_cased
print(line2)
```

## stdout (executed)

```text
Original:    the quick brown fox jumps over the lazy dog
Capitalized: The Quick Brown Fox Jumps Over The Lazy Dog
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
