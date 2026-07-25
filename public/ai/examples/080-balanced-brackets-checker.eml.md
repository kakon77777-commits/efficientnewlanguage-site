<!-- canonical: efficientnewlanguage.org/ai/examples/080-balanced-brackets-checker | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 080 — Balanced brackets checker

`balanced_brackets_checker.eml` checks seven sample strings for correctly nested and matched brackets, covering the mismatched (`"(]"`), unclosed (`"((("`), closer-before-opener (`")("`), and empty (`""`) edge cases as well as the well-formed ones.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Checks
# whether a string's brackets are correctly nested and matched, using a
# list as a stack — push on an opener, pop-and-compare on a closer. An
# application of the data structure the corpus's examples/simple-stack/
# defines in isolation. Popping is `stack[0:depth - 1] => stack` (slice
# rebuild), since EML has no `.pop()`.

def is_balanced(text):
    stack^+[]
    openers^+{"(": True, "[": True, "{": True}
    pairs^+{")": "(", "]": "[", "}": "{"}
    0 => i
    len(text) => n
    while i < n:
        text[i] => ch
        if ch in openers:
            stack + [ch] => stack
        elif ch in pairs:
            len(stack) => depth
            if depth == 0:
                return False
            stack[depth - 1] => top
            if top != pairs[ch]:
                return False
            stack[0:depth - 1] => stack
        i + 1 => i
    return len(stack) == 0

samples^+["(a[b]{c})", "{[()]}", "(]", "(((", ")(", "", "a(b)c[d]"]

for sample in samples:
    is_balanced(sample) => ok
    "'" + sample + "' -> " + str(ok) => line
    line^0
```

## Python (deterministic transpilation)

```python
def is_balanced(text):
    stack = []
    openers = {"(": True, "[": True, "{": True}
    pairs = {")": "(", "]": "[", "}": "{"}
    i = 0
    n = len(text)
    while i < n:
        ch = text[i]
        if ch in openers:
            stack = stack + [ch]
        elif ch in pairs:
            depth = len(stack)
            if depth == 0:
                return False
            top = stack[depth - 1]
            if top != pairs[ch]:
                return False
            stack = stack[0:depth - 1]
        i = i + 1
    return len(stack) == 0

samples = ["(a[b]{c})", "{[()]}", "(]", "(((", ")(", "", "a(b)c[d]"]
for sample in samples:
    ok = is_balanced(sample)
    line = "'" + sample + "' -> " + str(ok)
    print(line)
```

## stdout (executed)

```text
'(a[b]{c})' -> True
'{[()]}' -> True
'(]' -> False
'(((' -> False
')(' -> False
'' -> True
'a(b)c[d]' -> True
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
