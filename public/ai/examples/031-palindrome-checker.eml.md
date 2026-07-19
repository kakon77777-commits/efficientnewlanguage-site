<!-- canonical: efficientnewlanguage.org/ai/examples/031-palindrome-checker | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 031 — Palindrome checker

`palindrome_checker.eml` checks whether each of six sample words — `level`, `radar`, `python`, `deified`, `civic`, `transpiler` — reads the same forwards and backwards, printing a verdict for each one.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Checks whether
# each of several sample words/phrases is a palindrome. The native EML `[a:b]`
# range/slice grammar has no Python-style step form, so `s[::-1]` is not
# available (verified empirically); the reverse is instead built manually by
# walking the string back-to-front with a counted loop and concatenation.

candidates^+["level", "radar", "python", "deified", "civic", "transpiler"]

length^+0
reversed_word^+""

for word in candidates:
    len(word) => length
    "" => reversed_word
    for i in [0:length-1]:
        word[length - 1 - i] => ch
        reversed_word + ch => reversed_word
    if word == reversed_word:
        word^0(" -> palindrome\n")
    else:
        word^0(" -> not a palindrome\n")
```

## Python (deterministic transpilation)

```python
candidates = ["level", "radar", "python", "deified", "civic", "transpiler"]
length = 0
reversed_word = ""
for word in candidates:
    length = len(word)
    reversed_word = ""
    for i in range(0, length):
        ch = word[length - 1 - i]
        reversed_word = reversed_word + ch
    if word == reversed_word:
        print(word, end=" -> palindrome\n")
    else:
        print(word, end=" -> not a palindrome\n")
```

## stdout (executed)

```text
level -> palindrome
radar -> palindrome
python -> not a palindrome
deified -> palindrome
civic -> palindrome
transpiler -> not a palindrome
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
