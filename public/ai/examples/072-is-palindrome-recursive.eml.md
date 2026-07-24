<!-- canonical: efficientnewlanguage.org/ai/examples/072-is-palindrome-recursive | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 072 — Is palindrome (recursive)

`is_palindrome_recursive.eml` checks six sample strings (`"racecar"`, `"hello"`, `"level"`, `"python"`, `"a"`, `""`) for whether they read the same forwards and backwards.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Checks
# whether a string is a palindrome via genuine self-recursion (compare the
# outer characters, then recurse on the inner substring via slice syntax)
# — a deliberate contrast with the corpus's existing iterative
# examples/palindrome-checker/.

def is_palindrome(s):
    len(s) => n
    if n <= 1:
        return True
    if s[0] != s[n - 1]:
        return False
    return is_palindrome(s[1:n - 1])

words^+["racecar", "hello", "level", "python", "a", ""]

for word in words:
    is_palindrome(word) => result
    "'" + word + "' -> " + str(result) => line
    line^0
```

## Python (deterministic transpilation)

```python
def is_palindrome(s):
    n = len(s)
    if n <= 1:
        return True
    if s[0] != s[n - 1]:
        return False
    return is_palindrome(s[1:n - 1])

words = ["racecar", "hello", "level", "python", "a", ""]
for word in words:
    result = is_palindrome(word)
    line = "'" + word + "' -> " + str(result)
    print(line)
```

## stdout (executed)

```text
'racecar' -> True
'hello' -> False
'level' -> True
'python' -> False
'a' -> True
'' -> True
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
