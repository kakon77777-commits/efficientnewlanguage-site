<!-- canonical: efficientnewlanguage.org/ai/examples/206-longest-palindromic-run | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 206 — Longest palindrome: an off-by-one that produces a longer answer

`longest_palindromic_run.eml` finds the longest palindromic substring by expanding around every centre, and never trusts what it extracts.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Longest
# palindromic substring, by expanding around every centre - and the centres
# are where the slice bounds have to be exactly right.
#
# Expand-around-centre is the standard O(n^2) solution, and its whole
# difficulty is bookkeeping:
#
#   - there are 2n-1 centres, not n: every character, and every gap BETWEEN
#     two characters (for even-length palindromes)
#   - the expansion stops when the bounds leave the string, and the last valid
#     window is one step BACK from where the loop stopped
#   - extracting that window is a slice, and if the bounds are off by one the
#     result is still a substring, still prints, and is simply not the answer
#
# The off-by-one at the end is the classic one. After `while left >= 0 and
# right < n and s[left] == s[right]`, the loop exits with `left` one too far
# left and `right` one too far right, so the answer is `s[left + 1:right]` —
# and `s[left:right + 1]` is the same length plus two, made of characters that
# were never checked. Both are valid slices. Only one is a palindrome.
#
# So the program never trusts the extraction. Every candidate it finds is
# re-verified as a palindrome from scratch, and the final answer is checked
# against a brute-force scan over every substring — an O(n^3) second opinion
# that cannot share a bug with the O(n^2) method.

def is_palindrome(s):
    0 => i
    len(s) - 1 => j
    while i < j:
        if not (s[i] == s[j]):
            return False
        i + 1 => i
        j - 1 => j
    return True

def expand(s, left, right):
    # Grow outward while the bounds are valid and the characters match, then
    # step back once. The `+ 1` and the bare `right` are the off-by-one.
    len(s) => n
    left => l
    right => r
    while l >= 0 and r < n and s[l] == s[r]:
        l - 1 => l
        r + 1 => r
    return s[l + 1:r]

def longest_by_expansion(s):
    len(s) => n
    if n == 0:
        return ""
    "" => best
    for i in [0:n - 1]:
        # odd-length centre: the character itself
        expand(s, i, i) => odd
        if len(odd) > len(best):
            odd => best
        # even-length centre: the gap after it
        expand(s, i, i + 1) => even
        if len(even) > len(best):
            even => best
    return best

def longest_by_brute_force(s):
    # Every substring, checked. Deliberately the dumbest possible method, so
    # it cannot share an error with the one above.
    len(s) => n
    "" => best
    for i in [0:n - 1]:
        for j in [i:n - 1]:
            s[i:j + 1] => sub
            if len(sub) > len(best) and is_palindrome(sub):
                sub => best
    return best


[
    "babad",
    "cbbd",
    "a",
    "",
    "abacabad",
    "forgeeksskeegfor",
    "abcdefg",
    "aaaa",
] => samples

"input              expansion          brute force        agree  palindrome"^0
0 => agree
0 => verified
0 => checked
for s in samples:
    checked + 1 => checked
    longest_by_expansion(s) => fast
    longest_by_brute_force(s) => slow

    # The two methods must agree on LENGTH. They may pick different equal-length
    # palindromes, which is not an error - so length is the honest comparison.
    len(fast) == len(slow) => same_length
    if same_length:
        agree + 1 => agree
    if is_palindrome(fast):
        verified + 1 => verified

    ("%-18s %-18s %-18s %-6s %s" % ('"' + s + '"', '"' + fast + '"', '"' + slow + '"', str(same_length), str(is_palindrome(fast))))^0

# ------------------------------------------------- what the off-by-one gives
""^0
"The off-by-one, shown directly on \"forgeeksskeegfor\":"^0
"forgeeksskeegfor" => demo
# The correct expansion around the centre gap at index 7|8.
expand(demo, 7, 8) => correct
("  correct    s[l+1:r]     = " + '"' + correct + '"' + "  palindrome: " + str(is_palindrome(correct)))^0
# The same expansion with the bounds one step wider - a valid slice, not a
# palindrome, and two characters longer so it would WIN the comparison.
len(demo) => dn
7 => l2
8 => r2
while l2 >= 0 and r2 < dn and demo[l2] == demo[r2]:
    l2 - 1 => l2
    r2 + 1 => r2
demo[l2:r2 + 1] => wrong
("  off-by-one s[l:r+1]     = " + '"' + wrong + '"' + "  palindrome: " + str(is_palindrome(wrong)))^0
("  the wrong one is longer: " + str(len(wrong) > len(correct)))^0

# ------------------------------------------------------------------- checks
""^0
("samples checked:                 " + str(checked))^0
("two methods agree on length:     " + str(agree) + "/" + str(checked))^0
("expansion result IS a palindrome: " + str(verified) + "/" + str(checked))^0

""^0
if agree == checked and verified == checked and len(wrong) > len(correct) and not is_palindrome(wrong):
    "Both methods agree, and every answer was re-verified as a palindrome." => verdict
else:
    "FAILED - the expansion returned something that is not the answer." => verdict
verdict^0

""^0
"An off-by-one at the end of an expansion produces a LONGER string, so it" => n1
n1^0
"wins the max comparison and becomes the answer. That is why the check here" => n2
n2^0
"is not 'did it find something long' but 'is what it found actually a" => n3
n3^0
"palindrome' - re-verified from scratch, on every single candidate." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def is_palindrome(s):
    i = 0
    j = len(s) - 1
    while i < j:
        if not s[i] == s[j]:
            return False
        i = i + 1
        j = j - 1
    return True

def expand(s, left, right):
    n = len(s)
    l = left
    r = right
    while l >= 0 and r < n and s[l] == s[r]:
        l = l - 1
        r = r + 1
    return s[l + 1:r]

def longest_by_expansion(s):
    n = len(s)
    if n == 0:
        return ""
    best = ""
    for i in range(0, n):
        odd = expand(s, i, i)
        if len(odd) > len(best):
            best = odd
        even = expand(s, i, i + 1)
        if len(even) > len(best):
            best = even
    return best

def longest_by_brute_force(s):
    n = len(s)
    best = ""
    for i in range(0, n):
        for j in range(i, n):
            sub = s[i:j + 1]
            if len(sub) > len(best) and is_palindrome(sub):
                best = sub
    return best

samples = ["babad", "cbbd", "a", "", "abacabad", "forgeeksskeegfor", "abcdefg", "aaaa"]
print("input              expansion          brute force        agree  palindrome")
agree = 0
verified = 0
checked = 0
for s in samples:
    checked = checked + 1
    fast = longest_by_expansion(s)
    slow = longest_by_brute_force(s)
    same_length = len(fast) == len(slow)
    if same_length:
        agree = agree + 1
    if is_palindrome(fast):
        verified = verified + 1
    print("%-18s %-18s %-18s %-6s %s" % ("\"" + s + "\"", "\"" + fast + "\"", "\"" + slow + "\"", str(same_length), str(is_palindrome(fast))))
print("")
print("The off-by-one, shown directly on \"forgeeksskeegfor\":")
demo = "forgeeksskeegfor"
correct = expand(demo, 7, 8)
print("  correct    s[l+1:r]     = " + "\"" + correct + "\"" + "  palindrome: " + str(is_palindrome(correct)))
dn = len(demo)
l2 = 7
r2 = 8
while l2 >= 0 and r2 < dn and demo[l2] == demo[r2]:
    l2 = l2 - 1
    r2 = r2 + 1
wrong = demo[l2:r2 + 1]
print("  off-by-one s[l:r+1]     = " + "\"" + wrong + "\"" + "  palindrome: " + str(is_palindrome(wrong)))
print("  the wrong one is longer: " + str(len(wrong) > len(correct)))
print("")
print("samples checked:                 " + str(checked))
print("two methods agree on length:     " + str(agree) + "/" + str(checked))
print("expansion result IS a palindrome: " + str(verified) + "/" + str(checked))
print("")
if agree == checked and verified == checked and len(wrong) > len(correct) and not is_palindrome(wrong):
    verdict = "Both methods agree, and every answer was re-verified as a palindrome."
else:
    verdict = "FAILED - the expansion returned something that is not the answer."
print(verdict)
print("")
n1 = "An off-by-one at the end of an expansion produces a LONGER string, so it"
print(n1)
n2 = "wins the max comparison and becomes the answer. That is why the check here"
print(n2)
n3 = "is not 'did it find something long' but 'is what it found actually a"
print(n3)
n4 = "palindrome' - re-verified from scratch, on every single candidate."
print(n4)
```

## stdout (executed)

```text
input              expansion          brute force        agree  palindrome
"babad"            "bab"              "bab"              True   True
"cbbd"             "bb"               "bb"               True   True
"a"                "a"                "a"                True   True
""                 ""                 ""                 True   True
"abacabad"         "abacaba"          "abacaba"          True   True
"forgeeksskeegfor" "geeksskeeg"       "geeksskeeg"       True   True
"abcdefg"          "a"                "a"                True   True
"aaaa"             "aaaa"             "aaaa"             True   True

The off-by-one, shown directly on "forgeeksskeegfor":
  correct    s[l+1:r]     = "geeksskeeg"  palindrome: True
  off-by-one s[l:r+1]     = "rgeeksskeegf"  palindrome: False
  the wrong one is longer: True

samples checked:                 8
two methods agree on length:     8/8
expansion result IS a palindrome: 8/8

Both methods agree, and every answer was re-verified as a palindrome.

An off-by-one at the end of an expansion produces a LONGER string, so it
wins the max comparison and becomes the answer. That is why the check here
is not 'did it find something long' but 'is what it found actually a
palindrome' - re-verified from scratch, on every single candidate.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
