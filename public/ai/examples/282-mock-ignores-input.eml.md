<!-- canonical: efficientnewlanguage.org/ai/examples/282-mock-ignores-input | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 282 — A mock that ignores its input — the double agreed with every caller

`mock_ignores_input.eml` runs four deliberately broken callers against three test doubles and counts how many each one catches.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A stub that
# returns success, and four broken callers that pass.
#
# A test double stands in for a dependency. The cheapest one returns a fixed
# value regardless of what it was called with - and that is exactly the double
# most often written, because writing it requires knowing nothing about the
# contract.
#
# The consequence is that every test using it is testing the caller's code
# against a dependency with NO behaviour. Any bug in how the caller builds the
# call - wrong field, swapped arguments, missing filter, unescaped value -
# produces the same fixed answer, so the test passes. The double is not
# checking anything; it is agreeing.
#
# The measurement runs a set of deliberately broken callers against three
# doubles - always-succeed, records-the-call, and one that VALIDATES its
# arguments - and counts how many broken callers each one catches. The
# always-succeed double is also the one with the best-looking test: no setup,
# no assertions about the dependency, one line.

def charge(user, amount, currency, bug):
    # Builds the call to the payment dependency. `bug` injects one defect.
    user => u
    amount => a
    currency => c
    if bug == "swapped":
        amount => u
        user => a
    elif bug == "wrong-currency":
        "USD" => c
    elif bug == "cents":
        amount * 100 => a
    elif bug == "missing-user":
        "" => u
    return [u, a, c]

def double(kind, call):
    # Returns "ok" or a rejection. `call` is [user, amount, currency].
    if kind == "always-ok":
        return "ok"
    if kind == "records":
        # Records the call and still answers "ok" - the double most people
        # think is the strict one, because it lets you assert afterwards.
        return "ok"
    # Validating double: knows the contract the real dependency enforces.
    call[0] => u
    call[1] => a
    call[2] => c
    if len(str(u)) == 0:
        return "reject: empty user"
    # A user id is a string and an amount is not. Comparing str(x) == x is the
    # test for that with the ten builtins this language has - and it is the
    # check that has to come FIRST, because every check after it assumes the
    # arguments are in the right positions. The first version compared the
    # rendered values instead, which does not detect a swap, and then reached
    # a numeric comparison holding a string.
    if not (str(u) == u):
        return "reject: user is not an identifier"
    if str(a) == a:
        return "reject: amount is not a number"
    if not (c == "EUR"):
        return "reject: unsupported currency " + str(c)
    if a > 1000:
        return "reject: amount out of range"
    return "ok"

def catches(kind, bug):
    charge("u42", 250, "EUR", bug) => call
    if double(kind, call) == "ok":
        return 0
    return 1


["none", "swapped", "wrong-currency", "cents", "missing-user"] => BUGS
["always-ok", "records", "validating"] => DOUBLES

"double        caught   of   let through"^0
{} => res
for d in DOUBLES:
    0 => caught
    "" => through
    for b in BUGS:
        if not (b == "none"):
            if catches(d, b) == 1:
                caught + 1 => caught
            else:
                if len(through) > 0:
                    through + "," => through
                through + b => through
    len(BUGS) - 1 => n_bugs
    [caught, n_bugs] => res[d]
    if len(through) == 0:
        "-- none --" => through
    ("%-13s %-8d %-4d %s" % (d, caught, n_bugs, through))^0

""^0
("broken callers: " + str(len(BUGS) - 1))^0

# ------------------------- every double passes the correct caller
""^0
0 => clean
for d in DOUBLES:
    if catches(d, "none") == 0:
        clean + 1 => clean
("doubles that accept the CORRECT caller: " + str(clean) + "/" + str(len(DOUBLES)))^0
"...so no double is simply strict. They differ only on the broken ones."^0

# ------------------------------- what each rejection says
""^0
"what the validating double reports, per bug:"^0
for b in BUGS:
    if not (b == "none"):
        charge("u42", 250, "EUR", b) => call
        ("  %-16s %s" % (b, double("validating", call)))^0

# ------------------------- the always-ok double is the shortest test
""^0
"lines of setup each double needs:"^0
("  always-ok    1  (return \"ok\")")^0
("  records      2  (append, return \"ok\")")^0
("  validating   8  (the contract, written out)")^0
("caught per line of setup:")^0
("  always-ok    " + str(res["always-ok"][0]) + "/1")^0
("  validating   " + str(res["validating"][0]) + "/8")^0
"...the cheapest double is cheap because it encodes no contract, and the"^0
"contract is the entire thing a double is standing in for."^0

# ----------------------- recording the call does not help by itself
""^0
("`records` catches " + str(res["records"][0]) + " - the same as always-ok.")^0
"Recording makes an assertion POSSIBLE; it does not make one. A test that"^0
"records the call and asserts nothing about it is the always-ok double with"^0
"extra steps, and it reads as more rigorous."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The always-ok double must catch nothing.
checked + 1 => checked
if res["always-ok"][0] == 0:
    passed + 1 => passed

# Recording without asserting must catch exactly as much - nothing.
checked + 1 => checked
if res["records"][0] == res["always-ok"][0]:
    passed + 1 => passed

# The validating double must catch every broken caller.
checked + 1 => checked
if res["validating"][0] == res["validating"][1]:
    passed + 1 => passed

# Every double must accept the correct caller, so the difference between them
# is never visible on a passing test.
checked + 1 => checked
if clean == len(DOUBLES):
    passed + 1 => passed

# And there must be more than one broken caller, so catching zero is a
# property of the double rather than of a thin fixture.
checked + 1 => checked
if res["always-ok"][1] >= 4:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The double agreed with every caller, including the four that were wrong." => verdict
else:
    "FAILED - a double did not behave as the checks describe." => verdict
verdict^0

""^0
"A double replaces a dependency, and what a dependency mostly does is" => n1
n1^0
"REFUSE things. A double that only knows how to succeed has replaced the" => n2
n2^0
"half of the contract nobody was worried about and deleted the half that" => n3
n3^0
"catches mistakes - which is why a suite full of them turns green the" => n4
n4^0
"moment the caller is written, and stays green while it is wrong." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def charge(user, amount, currency, bug):
    u = user
    a = amount
    c = currency
    if bug == "swapped":
        u = amount
        a = user
    elif bug == "wrong-currency":
        c = "USD"
    elif bug == "cents":
        a = amount * 100
    elif bug == "missing-user":
        u = ""
    return [u, a, c]

def double(kind, call):
    if kind == "always-ok":
        return "ok"
    if kind == "records":
        return "ok"
    u = call[0]
    a = call[1]
    c = call[2]
    if len(str(u)) == 0:
        return "reject: empty user"
    if not str(u) == u:
        return "reject: user is not an identifier"
    if str(a) == a:
        return "reject: amount is not a number"
    if not c == "EUR":
        return "reject: unsupported currency " + str(c)
    if a > 1000:
        return "reject: amount out of range"
    return "ok"

def catches(kind, bug):
    call = charge("u42", 250, "EUR", bug)
    if double(kind, call) == "ok":
        return 0
    return 1

BUGS = ["none", "swapped", "wrong-currency", "cents", "missing-user"]
DOUBLES = ["always-ok", "records", "validating"]
print("double        caught   of   let through")
res = {}
for d in DOUBLES:
    caught = 0
    through = ""
    for b in BUGS:
        if not b == "none":
            if catches(d, b) == 1:
                caught = caught + 1
            else:
                if len(through) > 0:
                    through = through + ","
                through = through + b
    n_bugs = len(BUGS) - 1
    res[d] = [caught, n_bugs]
    if len(through) == 0:
        through = "-- none --"
    print("%-13s %-8d %-4d %s" % (d, caught, n_bugs, through))
print("")
print("broken callers: " + str(len(BUGS) - 1))
print("")
clean = 0
for d in DOUBLES:
    if catches(d, "none") == 0:
        clean = clean + 1
print("doubles that accept the CORRECT caller: " + str(clean) + "/" + str(len(DOUBLES)))
print("...so no double is simply strict. They differ only on the broken ones.")
print("")
print("what the validating double reports, per bug:")
for b in BUGS:
    if not b == "none":
        call = charge("u42", 250, "EUR", b)
        print("  %-16s %s" % (b, double("validating", call)))
print("")
print("lines of setup each double needs:")
print("  always-ok    1  (return \"ok\")")
print("  records      2  (append, return \"ok\")")
print("  validating   8  (the contract, written out)")
print("caught per line of setup:")
print("  always-ok    " + str(res["always-ok"][0]) + "/1")
print("  validating   " + str(res["validating"][0]) + "/8")
print("...the cheapest double is cheap because it encodes no contract, and the")
print("contract is the entire thing a double is standing in for.")
print("")
print("`records` catches " + str(res["records"][0]) + " - the same as always-ok.")
print("Recording makes an assertion POSSIBLE; it does not make one. A test that")
print("records the call and asserts nothing about it is the always-ok double with")
print("extra steps, and it reads as more rigorous.")
passed = 0
checked = 0
checked = checked + 1
if res["always-ok"][0] == 0:
    passed = passed + 1
checked = checked + 1
if res["records"][0] == res["always-ok"][0]:
    passed = passed + 1
checked = checked + 1
if res["validating"][0] == res["validating"][1]:
    passed = passed + 1
checked = checked + 1
if clean == len(DOUBLES):
    passed = passed + 1
checked = checked + 1
if res["always-ok"][1] >= 4:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The double agreed with every caller, including the four that were wrong."
else:
    verdict = "FAILED - a double did not behave as the checks describe."
print(verdict)
print("")
n1 = "A double replaces a dependency, and what a dependency mostly does is"
print(n1)
n2 = "REFUSE things. A double that only knows how to succeed has replaced the"
print(n2)
n3 = "half of the contract nobody was worried about and deleted the half that"
print(n3)
n4 = "catches mistakes - which is why a suite full of them turns green the"
print(n4)
n5 = "moment the caller is written, and stays green while it is wrong."
print(n5)
```

## stdout (executed)

```text
double        caught   of   let through
always-ok     0        4    swapped,wrong-currency,cents,missing-user
records       0        4    swapped,wrong-currency,cents,missing-user
validating    4        4    -- none --

broken callers: 4

doubles that accept the CORRECT caller: 3/3
...so no double is simply strict. They differ only on the broken ones.

what the validating double reports, per bug:
  swapped          reject: user is not an identifier
  wrong-currency   reject: unsupported currency USD
  cents            reject: amount out of range
  missing-user     reject: empty user

lines of setup each double needs:
  always-ok    1  (return "ok")
  records      2  (append, return "ok")
  validating   8  (the contract, written out)
caught per line of setup:
  always-ok    0/1
  validating   4/8
...the cheapest double is cheap because it encodes no contract, and the
contract is the entire thing a double is standing in for.

`records` catches 0 - the same as always-ok.
Recording makes an assertion POSSIBLE; it does not make one. A test that
records the call and asserts nothing about it is the always-ok double with
extra steps, and it reads as more rigorous.

checks passed: 5/5
The double agreed with every caller, including the four that were wrong.

A double replaces a dependency, and what a dependency mostly does is
REFUSE things. A double that only knows how to succeed has replaced the
half of the contract nobody was worried about and deleted the half that
catches mistakes - which is why a suite full of them turns green the
moment the caller is written, and stays green while it is wrong.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
