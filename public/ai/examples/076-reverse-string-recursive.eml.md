<!-- canonical: efficientnewlanguage.org/ai/examples/076-reverse-string-recursive | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 076 — Reverse string (recursive)

`reverse_string_recursive.eml` reverses five sample strings (`"hello"`, `"EML"`, `"a"`, `""`, `"racecar"`).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Reverses a
# string via genuine self-recursion (last character + recursive reverse of
# the rest, via slice syntax) — a deliberate contrast with the corpus's
# existing iterative examples/string-reverser/.

def reverse_string(s):
    len(s) => n
    if n <= 1:
        return s
    return s[n - 1] + reverse_string(s[0:n - 1])

words^+["hello", "EML", "a", "", "racecar"]

for word in words:
    reverse_string(word) => reversed_word
    "'" + word + "' -> '" + reversed_word + "'" => line
    line^0
```

## Python (deterministic transpilation)

```python
def reverse_string(s):
    n = len(s)
    if n <= 1:
        return s
    return s[n - 1] + reverse_string(s[0:n - 1])

words = ["hello", "EML", "a", "", "racecar"]
for word in words:
    reversed_word = reverse_string(word)
    line = "'" + word + "' -> '" + reversed_word + "'"
    print(line)
```

## stdout (executed)

```text
'hello' -> 'olleh'
'EML' -> 'LME'
'a' -> 'a'
'' -> ''
'racecar' -> 'racecar'
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
