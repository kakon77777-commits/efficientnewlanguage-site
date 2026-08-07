<!-- canonical: efficientnewlanguage.org/ai/examples/284-new-enum-value-fallthrough | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 284 — New enum value fallthrough — the else branch answers for a case it never saw

`new_enum_value_fallthrough.eml` asks four consumers the same question about every value in an old enum and then about a value added afterwards, and classifies each answer as right, silently wrong, or a loud failure.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A fifth status
# is added, and four services quietly decide it means "no".
#
# Adding a value to an enum is a compatible change to the producer and a
# semantic change to every consumer. The consumers do not fail; they take
# whatever branch they wrote for "anything else", and that branch was written
# when "anything else" was empty.
#
# The four ways a consumer handles an unknown value, all of them common:
#
#     if/elif/else        the else branch answers for a case it never saw
#     lookup with default the default answers, and the default is a guess
#     lookup, raise       fails loudly - the only one that reports anything
#     lookup, quarantine  routes it to a hold queue and keeps working
#
# The first two return a definite, wrong, unlogged answer. The third stops the
# request. The fourth is what the first two were trying to be, and it costs a
# queue.
#
# The measurement asks every consumer the same question - "should this order
# count as revenue?" - about every value in the OLD enum and then about a value
# added afterwards, and classifies each answer as right, silently wrong, or a
# loud failure. Correctness on the old values is measured too, because a
# consumer that is wrong on those is a different problem.

["pending", "paid", "shipped", "cancelled"] => OLD
["pending", "paid", "shipped", "cancelled", "chargeback"] => NEW

def truth(status):
    # Stated independently of any consumer: which statuses are revenue.
    if status == "paid":
        return "yes"
    if status == "shipped":
        return "yes"
    return "no"

def consumer(kind, status):
    # Returns "yes", "no", or "ERROR"/"HOLD".
    if kind == "if-else":
        if status == "paid":
            return "yes"
        elif status == "shipped":
            return "yes"
        else:
            return "no"
    if kind == "default":
        {} => table
        "yes" => table["paid"]
        "yes" => table["shipped"]
        "no" => table["pending"]
        "no" => table["cancelled"]
        if status in table:
            return table[status]
        return "no"
    if kind == "raise":
        {} => table
        "yes" => table["paid"]
        "yes" => table["shipped"]
        "no" => table["pending"]
        "no" => table["cancelled"]
        if status in table:
            return table[status]
        return "ERROR"
    {} => table
    "yes" => table["paid"]
    "yes" => table["shipped"]
    "no" => table["pending"]
    "no" => table["cancelled"]
    if status in table:
        return table[status]
    return "HOLD"


["if-else", "default", "raise", "quarantine"] => CONSUMERS

"consumer      old values right   on 'chargeback'   classification"^0
{} => res
for c in CONSUMERS:
    0 => right
    for s in OLD:
        if consumer(c, s) == truth(s):
            right + 1 => right
    consumer(c, "chargeback") => answer
    "silently wrong" => klass
    if answer == "ERROR":
        "loud failure" => klass
    elif answer == "HOLD":
        "held for review" => klass
    elif answer == truth("chargeback"):
        "right by luck" => klass
    [right, answer, klass] => res[c]
    ("%-13s %-18s %-17s %s" % (c, str(right) + "/" + str(len(OLD)), answer, klass))^0

""^0
("old enum: " + str(len(OLD)) + " values, new enum: " + str(len(NEW)) + " values")^0
("the added value is 'chargeback', and the truth about it is: " + truth("chargeback"))^0

# --------------------------- the added value that happens to be harmless
""^0
"...and 'chargeback' is NOT revenue, so two consumers guessed right."^0
0 => lucky
for c in CONSUMERS:
    if res[c][1] == truth("chargeback"):
        lucky + 1 => lucky
("consumers whose answer happens to match the truth: " + str(lucky) + "/" + str(len(CONSUMERS)))^0
"...the same code with a value that IS revenue:"^0
def truth2(status):
    if status == "paid":
        return "yes"
    if status == "shipped":
        return "yes"
    if status == "settled":
        return "yes"
    return "no"
0 => lucky2
for c in CONSUMERS:
    consumer(c, "settled") => a
    if a == truth2("settled"):
        lucky2 + 1 => lucky2
("  a new value 'settled' that IS revenue: consumers right: " + str(lucky2) + "/" + str(len(CONSUMERS)))^0
"...so the two guessing consumers were not careful, they were fortunate,"^0
"and the difference is a property of the NEXT value added."^0

# ------------------------- what a reviewer sees in each consumer
""^0
"how much of the defect is visible in the source:"^0
("  if-else     an else branch  - looks like a total function")^0
("  default     a default value - looks like a deliberate fallback")^0
("  raise       an explicit failure on an unknown key")^0
("  quarantine  an explicit hold on an unknown key")^0
"...the two that are wrong are the two that read as complete."^0

# ---------------------------------------- everyone agrees on the old values
""^0
0 => all_old
for c in CONSUMERS:
    if res[c][0] == len(OLD):
        all_old + 1 => all_old
("consumers correct on every OLD value: " + str(all_old) + "/" + str(len(CONSUMERS)))^0
"...so no test written before the change can distinguish them."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Every consumer must be correct on every old value. The difference between
# them is invisible until the enum grows.
checked + 1 => checked
if all_old == len(CONSUMERS):
    passed + 1 => passed

# Exactly the two that report nothing must return a definite answer to a
# question they cannot answer.
checked + 1 => checked
if res["if-else"][1] == "no" and res["default"][1] == "no":
    passed + 1 => passed

# And exactly the two that report something must not.
checked + 1 => checked
if res["raise"][1] == "ERROR" and res["quarantine"][1] == "HOLD":
    passed + 1 => passed

# On a value that IS revenue, strictly fewer consumers are right than on one
# that is not - so being right about 'chargeback' was luck, and the luck is
# a property of the next value rather than of the code.
checked + 1 => checked
if lucky2 < lucky:
    passed + 1 => passed

# And the truth function must actually disagree with the guessing consumers
# somewhere, or there is no defect to demonstrate.
checked + 1 => checked
if not (consumer("if-else", "settled") == truth2("settled")):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The else branch answers for every case that has not been invented yet." => verdict
else:
    "FAILED - a consumer did not behave as the checks describe." => verdict
verdict^0

""^0
"An else branch is a claim about values that do not exist yet, written by" => n1
n1^0
"someone who could not have seen them. It is the only kind of code whose" => n2
n2^0
"correctness is decided entirely after it is merged - and it reads as more" => n3
n3^0
"complete than the version that refuses, because refusing looks like a gap" => n4
n4^0
"and answering looks like coverage." => n5
n5^0
```

## Python (deterministic transpilation)

```python
OLD = ["pending", "paid", "shipped", "cancelled"]
NEW = ["pending", "paid", "shipped", "cancelled", "chargeback"]

def truth(status):
    if status == "paid":
        return "yes"
    if status == "shipped":
        return "yes"
    return "no"

def consumer(kind, status):
    if kind == "if-else":
        if status == "paid":
            return "yes"
        elif status == "shipped":
            return "yes"
        else:
            return "no"
    if kind == "default":
        table = {}
        table["paid"] = "yes"
        table["shipped"] = "yes"
        table["pending"] = "no"
        table["cancelled"] = "no"
        if status in table:
            return table[status]
        return "no"
    if kind == "raise":
        table = {}
        table["paid"] = "yes"
        table["shipped"] = "yes"
        table["pending"] = "no"
        table["cancelled"] = "no"
        if status in table:
            return table[status]
        return "ERROR"
    table = {}
    table["paid"] = "yes"
    table["shipped"] = "yes"
    table["pending"] = "no"
    table["cancelled"] = "no"
    if status in table:
        return table[status]
    return "HOLD"

CONSUMERS = ["if-else", "default", "raise", "quarantine"]
print("consumer      old values right   on 'chargeback'   classification")
res = {}
for c in CONSUMERS:
    right = 0
    for s in OLD:
        if consumer(c, s) == truth(s):
            right = right + 1
    answer = consumer(c, "chargeback")
    klass = "silently wrong"
    if answer == "ERROR":
        klass = "loud failure"
    elif answer == "HOLD":
        klass = "held for review"
    elif answer == truth("chargeback"):
        klass = "right by luck"
    res[c] = [right, answer, klass]
    print("%-13s %-18s %-17s %s" % (c, str(right) + "/" + str(len(OLD)), answer, klass))
print("")
print("old enum: " + str(len(OLD)) + " values, new enum: " + str(len(NEW)) + " values")
print("the added value is 'chargeback', and the truth about it is: " + truth("chargeback"))
print("")
print("...and 'chargeback' is NOT revenue, so two consumers guessed right.")
lucky = 0
for c in CONSUMERS:
    if res[c][1] == truth("chargeback"):
        lucky = lucky + 1
print("consumers whose answer happens to match the truth: " + str(lucky) + "/" + str(len(CONSUMERS)))
print("...the same code with a value that IS revenue:")

def truth2(status):
    if status == "paid":
        return "yes"
    if status == "shipped":
        return "yes"
    if status == "settled":
        return "yes"
    return "no"

lucky2 = 0
for c in CONSUMERS:
    a = consumer(c, "settled")
    if a == truth2("settled"):
        lucky2 = lucky2 + 1
print("  a new value 'settled' that IS revenue: consumers right: " + str(lucky2) + "/" + str(len(CONSUMERS)))
print("...so the two guessing consumers were not careful, they were fortunate,")
print("and the difference is a property of the NEXT value added.")
print("")
print("how much of the defect is visible in the source:")
print("  if-else     an else branch  - looks like a total function")
print("  default     a default value - looks like a deliberate fallback")
print("  raise       an explicit failure on an unknown key")
print("  quarantine  an explicit hold on an unknown key")
print("...the two that are wrong are the two that read as complete.")
print("")
all_old = 0
for c in CONSUMERS:
    if res[c][0] == len(OLD):
        all_old = all_old + 1
print("consumers correct on every OLD value: " + str(all_old) + "/" + str(len(CONSUMERS)))
print("...so no test written before the change can distinguish them.")
passed = 0
checked = 0
checked = checked + 1
if all_old == len(CONSUMERS):
    passed = passed + 1
checked = checked + 1
if res["if-else"][1] == "no" and res["default"][1] == "no":
    passed = passed + 1
checked = checked + 1
if res["raise"][1] == "ERROR" and res["quarantine"][1] == "HOLD":
    passed = passed + 1
checked = checked + 1
if lucky2 < lucky:
    passed = passed + 1
checked = checked + 1
if not consumer("if-else", "settled") == truth2("settled"):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The else branch answers for every case that has not been invented yet."
else:
    verdict = "FAILED - a consumer did not behave as the checks describe."
print(verdict)
print("")
n1 = "An else branch is a claim about values that do not exist yet, written by"
print(n1)
n2 = "someone who could not have seen them. It is the only kind of code whose"
print(n2)
n3 = "correctness is decided entirely after it is merged - and it reads as more"
print(n3)
n4 = "complete than the version that refuses, because refusing looks like a gap"
print(n4)
n5 = "and answering looks like coverage."
print(n5)
```

## stdout (executed)

```text
consumer      old values right   on 'chargeback'   classification
if-else       4/4                no                right by luck
default       4/4                no                right by luck
raise         4/4                ERROR             loud failure
quarantine    4/4                HOLD              held for review

old enum: 4 values, new enum: 5 values
the added value is 'chargeback', and the truth about it is: no

...and 'chargeback' is NOT revenue, so two consumers guessed right.
consumers whose answer happens to match the truth: 2/4
...the same code with a value that IS revenue:
  a new value 'settled' that IS revenue: consumers right: 0/4
...so the two guessing consumers were not careful, they were fortunate,
and the difference is a property of the NEXT value added.

how much of the defect is visible in the source:
  if-else     an else branch  - looks like a total function
  default     a default value - looks like a deliberate fallback
  raise       an explicit failure on an unknown key
  quarantine  an explicit hold on an unknown key
...the two that are wrong are the two that read as complete.

consumers correct on every OLD value: 4/4
...so no test written before the change can distinguish them.

checks passed: 5/5
The else branch answers for every case that has not been invented yet.

An else branch is a claim about values that do not exist yet, written by
someone who could not have seen them. It is the only kind of code whose
correctness is decided entirely after it is merged - and it reads as more
complete than the version that refuses, because refusing looks like a gap
and answering looks like coverage.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
