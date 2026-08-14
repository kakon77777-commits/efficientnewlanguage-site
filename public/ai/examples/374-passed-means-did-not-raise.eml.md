<!-- canonical: efficientnewlanguage.org/ai/examples/374-passed-means-did-not-raise | ai_layer_version: 0.1.0 | updated: 2026-08-14 -->

# Example 374 — Passed means did not raise — perfect on 2 of 4, blind on the other 2

`passed_means_did_not_raise.eml` runs four broken variants of the same function through a smoke test and a value test.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The test asks
# "does this run". The caller asks "is this the right number".
#
# A smoke test that only calls the function is the first test anybody writes and
# it is genuinely useful: it catches import errors, signature drift, and the
# whole class of failures where the code cannot execute at all. It is also the
# test most likely to survive untouched into a suite that people trust, because
# it never goes red for a silly reason.
#
# The question it answers is "did control reach the end". Which mutations that
# separates, and which it cannot, is measured here by running both kinds
# through both tests rather than argued from the shape of the assertion.

def discount(price, tier, variant):
    if variant == 0:
        if tier == "gold":
            return price - int(price * 20 / 100)
        return price - int(price * 5 / 100)
    elif variant == 1:
        if tier == "gold":
            return price - int(price * 2 / 100)
        return price - int(price * 5 / 100)
    elif variant == 2:
        if tier == "gold":
            return price - int(price * 20 / 100)
        return price
    elif variant == 3:
        if tier == "gold":
            raise ValueError("tier table missing")
        return price - int(price * 5 / 100)
    else:
        if tier == "gold":
            return int(price / 0)
        return price - int(price * 5 / 100)

["correct", "gold rate wrong", "standard rate dropped", "raises on gold", "divides by zero on gold"] => labels
[0, 1, 2, 3, 4] => variants
[[100, "gold"], [100, "standard"], [250, "gold"], [40, "standard"]] => inputs

# The reference is a separate expression of the rule, not a copy of variant 0.
def expected(price, tier):
    if tier == "gold":
        return int(price * 80 / 100)
    return int(price * 95 / 100)

def smoke_test(variant):
    for inp in inputs:
        try:
            discount(inp[0], inp[1], variant) => v
        except ValueError:
            return 1
        except ZeroDivisionError:
            return 1
    return 0

def value_test(variant):
    for inp in inputs:
        try:
            discount(inp[0], inp[1], variant) => v
        except ValueError:
            return 1
        except ZeroDivisionError:
            return 1
        if not (v == expected(inp[0], inp[1])):
            return 1
    return 0

# ---- the reference agrees with the correct implementation ----
#
# Without this the whole table could be an artifact of a wrong reference.

"reference check, on the correct variant" ^0
0 => agree
for inp in inputs:
    if discount(inp[0], inp[1], 0) == expected(inp[0], inp[1]):
        agree + 1 => agree
"  inputs where the two independent expressions agree : " + str(agree) + " of " + str(len(inputs)) ^0
"" ^0

# ---- both tests against every variant ----

"variant                     smoke   value" ^0
0 => smoke_caught
0 => value_caught
0 => broken
0 => idx
for v in variants:
    smoke_test(v) => s
    value_test(v) => t
    if v > 0:
        broken + 1 => broken
        smoke_caught + s => smoke_caught
        value_caught + t => value_caught
    if s == 1:
        "  " + labels[idx] + "  ... red" ^0
    else:
        if t == 1:
            "  " + labels[idx] + "  ... GREEN   red" ^0
        else:
            "  " + labels[idx] + "  ... green   green" ^0
    idx + 1 => idx
"" ^0

"broken variants   : " + str(broken) ^0
"  smoke test catches : " + str(smoke_caught) ^0
"  value test catches : " + str(value_caught) ^0
"" ^0

# ---- split by what kind of breakage it is ----

0 => crashy
0 => crashy_smoke
0 => quiet
0 => quiet_smoke
for v in variants:
    if v > 0:
        if smoke_test(v) == 1:
            crashy + 1 => crashy
            crashy_smoke + 1 => crashy_smoke
        else:
            quiet + 1 => quiet
            quiet_smoke + smoke_test(v) => quiet_smoke

"by kind of breakage" ^0
"  variants that cannot finish : " + str(crashy) + ", smoke catches " + str(crashy_smoke) ^0
"  variants that finish wrong  : " + str(quiet) + ", smoke catches " + str(quiet_smoke) ^0
"" ^0

if quiet_smoke == 0:
    if crashy_smoke == crashy:
        "The smoke test is perfect on one kind and blind on the other, and the" ^0
        "two kinds are not distinguishable from its output." ^0
"" ^0

"A green smoke test is a true statement about reachability. Read as a" ^0
"statement about correctness it covers " + str(quiet_smoke) + " of " + str(quiet) + " wrong answers." ^0
```

## Python (deterministic transpilation)

```python
def discount(price, tier, variant):
    if variant == 0:
        if tier == "gold":
            return price - int(price * 20 / 100)
        return price - int(price * 5 / 100)
    elif variant == 1:
        if tier == "gold":
            return price - int(price * 2 / 100)
        return price - int(price * 5 / 100)
    elif variant == 2:
        if tier == "gold":
            return price - int(price * 20 / 100)
        return price
    elif variant == 3:
        if tier == "gold":
            raise ValueError("tier table missing")
        return price - int(price * 5 / 100)
    else:
        if tier == "gold":
            return int(price / 0)
        return price - int(price * 5 / 100)

labels = ["correct", "gold rate wrong", "standard rate dropped", "raises on gold", "divides by zero on gold"]
variants = [0, 1, 2, 3, 4]
inputs = [[100, "gold"], [100, "standard"], [250, "gold"], [40, "standard"]]

def expected(price, tier):
    if tier == "gold":
        return int(price * 80 / 100)
    return int(price * 95 / 100)

def smoke_test(variant):
    for inp in inputs:
        try:
            v = discount(inp[0], inp[1], variant)
        except ValueError:
            return 1
        except ZeroDivisionError:
            return 1
    return 0

def value_test(variant):
    for inp in inputs:
        try:
            v = discount(inp[0], inp[1], variant)
        except ValueError:
            return 1
        except ZeroDivisionError:
            return 1
        if not v == expected(inp[0], inp[1]):
            return 1
    return 0

print("reference check, on the correct variant")
agree = 0
for inp in inputs:
    if discount(inp[0], inp[1], 0) == expected(inp[0], inp[1]):
        agree = agree + 1
print("  inputs where the two independent expressions agree : " + str(agree) + " of " + str(len(inputs)))
print("")
print("variant                     smoke   value")
smoke_caught = 0
value_caught = 0
broken = 0
idx = 0
for v in variants:
    s = smoke_test(v)
    t = value_test(v)
    if v > 0:
        broken = broken + 1
        smoke_caught = smoke_caught + s
        value_caught = value_caught + t
    if s == 1:
        print("  " + labels[idx] + "  ... red")
    elif t == 1:
        print("  " + labels[idx] + "  ... GREEN   red")
    else:
        print("  " + labels[idx] + "  ... green   green")
    idx = idx + 1
print("")
print("broken variants   : " + str(broken))
print("  smoke test catches : " + str(smoke_caught))
print("  value test catches : " + str(value_caught))
print("")
crashy = 0
crashy_smoke = 0
quiet = 0
quiet_smoke = 0
for v in variants:
    if v > 0:
        if smoke_test(v) == 1:
            crashy = crashy + 1
            crashy_smoke = crashy_smoke + 1
        else:
            quiet = quiet + 1
            quiet_smoke = quiet_smoke + smoke_test(v)
print("by kind of breakage")
print("  variants that cannot finish : " + str(crashy) + ", smoke catches " + str(crashy_smoke))
print("  variants that finish wrong  : " + str(quiet) + ", smoke catches " + str(quiet_smoke))
print("")
if quiet_smoke == 0:
    if crashy_smoke == crashy:
        print("The smoke test is perfect on one kind and blind on the other, and the")
        print("two kinds are not distinguishable from its output.")
print("")
print("A green smoke test is a true statement about reachability. Read as a")
print("statement about correctness it covers " + str(quiet_smoke) + " of " + str(quiet) + " wrong answers.")
```

## stdout (executed)

```text
reference check, on the correct variant
  inputs where the two independent expressions agree : 4 of 4

variant                     smoke   value
  correct  ... green   green
  gold rate wrong  ... GREEN   red
  standard rate dropped  ... GREEN   red
  raises on gold  ... red
  divides by zero on gold  ... red

broken variants   : 4
  smoke test catches : 2
  value test catches : 4

by kind of breakage
  variants that cannot finish : 2, smoke catches 2
  variants that finish wrong  : 2, smoke catches 0

The smoke test is perfect on one kind and blind on the other, and the
two kinds are not distinguishable from its output.

A green smoke test is a true statement about reachability. Read as a
statement about correctness it covers 0 of 2 wrong answers.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
