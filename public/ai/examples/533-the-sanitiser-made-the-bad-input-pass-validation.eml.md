<!-- canonical: efficientnewlanguage.org/ai/examples/533-the-sanitiser-made-the-bad-input-pass-validation | ai_layer_version: 0.1.0 | updated: 2026-08-24 -->

# Example 533 — The sanitiser made the bad input pass validation

`the_sanitiser_made_the_bad_input_pass_validation.eml` - A sanitiser and a validator both guard the same intake. What each rejects, and what the pair rejects, are computed separately below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A sanitiser and
# a validator both guard the same intake. What each rejects, and what the pair
# rejects, are computed separately below.
#
# Both are correct. The sanitiser exists because a supplier feed arrives with
# trailing whitespace, smart quotes and mixed line endings, and rejecting those
# outright meant a human retyping good data. The validator exists because a
# malformed record once reached the ledger. Each was added after a real
# incident and each does what it says.
#
# The sanitiser runs first, because you cannot validate a field you cannot
# parse. So every record the validator sees has already been repaired, and a
# record that was wrong in a way the sanitiser could repair arrives at the
# validator looking correct. The validator's rejection count is a measurement
# taken after the evidence has been cleaned up.
#
# Records are classified by what was wrong and by what each stage did.

# [defect, records per day, sanitiser repairs it, validator would reject it, repair is right]
[["trailing whitespace", 4100, "yes", "yes", "yes"], ["smart quotes", 900, "yes", "yes", "yes"], ["mixed line endings", 2200, "yes", "yes", "yes"], ["empty supplier code", 140, "yes", "yes", "no"], ["date as DD-MM not MM-DD", 60, "yes", "yes", "no"], ["negative quantity", 30, "no", "yes", "no"], ["unknown currency", 12, "no", "yes", "no"]] => defects

len(defects) => n

"defect                    per day   sanitiser   validator   repair correct" ^0
for d in defects:
    "  " + d[0] + "   " + str(d[1]) + "      " + d[2] + "         " + d[3] + "         " + d[4] ^0
"" ^0

0 => total
0 => repaired
0 => wrongly_repaired
0 => reaches_validator
for d in defects:
    total + d[1] => total
    if d[2] == "yes":
        repaired + d[1] => repaired
        if d[4] == "no":
            wrongly_repaired + d[1] => wrongly_repaired
    else:
        reaches_validator + d[1] => reaches_validator

"defective records a day        : " + str(total) ^0
"repaired before validation     : " + str(repaired) ^0
"still defective at validation  : " + str(reaches_validator) ^0
"validator rejections a day     : " + str(reaches_validator) ^0
"" ^0

# ---- what the validator's number means ----

"the validator's own report" ^0
"  rejections : " + str(reaches_validator) + " a day" ^0
"  which is " + str(int(reaches_validator * 10000 / total)) + " per 10000 of the defective records that arrived" ^0
"  (a percentage floors to zero here, so the unit is finer)" ^0
"  the other " + str(repaired) + " it never saw in a defective state" ^0
"  the validator is not failing to catch these, it is being handed clean" ^0
"  copies of them" ^0
"" ^0

# ---- the repairs that are not repairs ----

"repairs where the original value was not recoverable" ^0
for d in defects:
    if d[2] == "yes":
        if d[4] == "no":
            "  " + d[0] + " : " + str(d[1]) + " a day" ^0
"  total : " + str(wrongly_repaired) + " a day" ^0
"  these are the records where the sanitiser produced a well-formed value" ^0
"  that is not the value the supplier meant" ^0
"  validator rejections they cause : 0, because they are well formed" ^0
"" ^0

# ---- what each stage sees ----

"three counts that look like the same thing" ^0
"  records that arrived defective     : " + str(total) ^0
"  records the validator rejected     : " + str(reaches_validator) ^0
"  records that reached the ledger wrong : " + str(wrongly_repaired) ^0
"  the middle number is on the dashboard; the other two are not measured" ^0
"" ^0

# ---- ordering ----

0 => validator_first
for d in defects:
    if d[3] == "yes":
        validator_first + d[1] => validator_first
"the same two stages in the other order" ^0
"  validator first, on raw input : " + str(validator_first) + " rejections a day" ^0
"  sanitiser first, as deployed  : " + str(reaches_validator) + " rejections a day" ^0
"  ratio : " + str(int(validator_first / reaches_validator)) + " to 1" ^0
"  the same records, the same two rules, and the order decides how much" ^0
"  the second one is allowed to know" ^0
"" ^0

# ---- what a repair should have to do ----

"separating the two kinds of repair" ^0
0 => safe_repair
for d in defects:
    if d[2] == "yes":
        if d[4] == "yes":
            safe_repair + d[1] => safe_repair
"  repairs that cannot change meaning : " + str(safe_repair) + " a day" ^0
"    whitespace, quote style, line endings - the value is the same value" ^0
"  repairs that guess at meaning      : " + str(wrongly_repaired) + " a day" ^0
"    a missing supplier code and an ambiguous date are not typography" ^0
"  the sanitiser treats both as the same operation, and only the first kind" ^0
"  is one" ^0
"" ^0

# ---- the control: a defect the sanitiser cannot touch ----
#
# Where the sanitiser has no rule for a defect, the validator sees it as it
# arrived and the two controls are genuinely in series rather than in conflict.

for d in defects:
    if d[2] == "no":
        "control - " + d[0] + ", " + str(d[1]) + " a day" ^0
        "  sanitiser : no rule, passes through unchanged" ^0
        "  validator : rejects" ^0
        "  the record reaching the validator is the record the supplier sent," ^0
        "  so the rejection means what a rejection is supposed to mean" ^0
"" ^0

"Both stages were added after real incidents and both do what they say." ^0
"The sanitiser runs first because it must, so " + str(int(repaired * 100 / total)) + "% of the defects are" ^0
"already gone when the only stage that counts them starts counting." ^0
```

## Python (deterministic transpilation)

```python
defects = [["trailing whitespace", 4100, "yes", "yes", "yes"], ["smart quotes", 900, "yes", "yes", "yes"], ["mixed line endings", 2200, "yes", "yes", "yes"], ["empty supplier code", 140, "yes", "yes", "no"], ["date as DD-MM not MM-DD", 60, "yes", "yes", "no"], ["negative quantity", 30, "no", "yes", "no"], ["unknown currency", 12, "no", "yes", "no"]]
n = len(defects)
print("defect                    per day   sanitiser   validator   repair correct")
for d in defects:
    print("  " + d[0] + "   " + str(d[1]) + "      " + d[2] + "         " + d[3] + "         " + d[4])
print("")
total = 0
repaired = 0
wrongly_repaired = 0
reaches_validator = 0
for d in defects:
    total = total + d[1]
    if d[2] == "yes":
        repaired = repaired + d[1]
        if d[4] == "no":
            wrongly_repaired = wrongly_repaired + d[1]
    else:
        reaches_validator = reaches_validator + d[1]
print("defective records a day        : " + str(total))
print("repaired before validation     : " + str(repaired))
print("still defective at validation  : " + str(reaches_validator))
print("validator rejections a day     : " + str(reaches_validator))
print("")
print("the validator's own report")
print("  rejections : " + str(reaches_validator) + " a day")
print("  which is " + str(int(reaches_validator * 10000 / total)) + " per 10000 of the defective records that arrived")
print("  (a percentage floors to zero here, so the unit is finer)")
print("  the other " + str(repaired) + " it never saw in a defective state")
print("  the validator is not failing to catch these, it is being handed clean")
print("  copies of them")
print("")
print("repairs where the original value was not recoverable")
for d in defects:
    if d[2] == "yes":
        if d[4] == "no":
            print("  " + d[0] + " : " + str(d[1]) + " a day")
print("  total : " + str(wrongly_repaired) + " a day")
print("  these are the records where the sanitiser produced a well-formed value")
print("  that is not the value the supplier meant")
print("  validator rejections they cause : 0, because they are well formed")
print("")
print("three counts that look like the same thing")
print("  records that arrived defective     : " + str(total))
print("  records the validator rejected     : " + str(reaches_validator))
print("  records that reached the ledger wrong : " + str(wrongly_repaired))
print("  the middle number is on the dashboard; the other two are not measured")
print("")
validator_first = 0
for d in defects:
    if d[3] == "yes":
        validator_first = validator_first + d[1]
print("the same two stages in the other order")
print("  validator first, on raw input : " + str(validator_first) + " rejections a day")
print("  sanitiser first, as deployed  : " + str(reaches_validator) + " rejections a day")
print("  ratio : " + str(int(validator_first / reaches_validator)) + " to 1")
print("  the same records, the same two rules, and the order decides how much")
print("  the second one is allowed to know")
print("")
print("separating the two kinds of repair")
safe_repair = 0
for d in defects:
    if d[2] == "yes":
        if d[4] == "yes":
            safe_repair = safe_repair + d[1]
print("  repairs that cannot change meaning : " + str(safe_repair) + " a day")
print("    whitespace, quote style, line endings - the value is the same value")
print("  repairs that guess at meaning      : " + str(wrongly_repaired) + " a day")
print("    a missing supplier code and an ambiguous date are not typography")
print("  the sanitiser treats both as the same operation, and only the first kind")
print("  is one")
print("")
for d in defects:
    if d[2] == "no":
        print("control - " + d[0] + ", " + str(d[1]) + " a day")
        print("  sanitiser : no rule, passes through unchanged")
        print("  validator : rejects")
        print("  the record reaching the validator is the record the supplier sent,")
        print("  so the rejection means what a rejection is supposed to mean")
print("")
print("Both stages were added after real incidents and both do what they say.")
print("The sanitiser runs first because it must, so " + str(int(repaired * 100 / total)) + "% of the defects are")
print("already gone when the only stage that counts them starts counting.")
```

## stdout (executed)

```text
defect                    per day   sanitiser   validator   repair correct
  trailing whitespace   4100      yes         yes         yes
  smart quotes   900      yes         yes         yes
  mixed line endings   2200      yes         yes         yes
  empty supplier code   140      yes         yes         no
  date as DD-MM not MM-DD   60      yes         yes         no
  negative quantity   30      no         yes         no
  unknown currency   12      no         yes         no

defective records a day        : 7442
repaired before validation     : 7400
still defective at validation  : 42
validator rejections a day     : 42

the validator's own report
  rejections : 42 a day
  which is 56 per 10000 of the defective records that arrived
  (a percentage floors to zero here, so the unit is finer)
  the other 7400 it never saw in a defective state
  the validator is not failing to catch these, it is being handed clean
  copies of them

repairs where the original value was not recoverable
  empty supplier code : 140 a day
  date as DD-MM not MM-DD : 60 a day
  total : 200 a day
  these are the records where the sanitiser produced a well-formed value
  that is not the value the supplier meant
  validator rejections they cause : 0, because they are well formed

three counts that look like the same thing
  records that arrived defective     : 7442
  records the validator rejected     : 42
  records that reached the ledger wrong : 200
  the middle number is on the dashboard; the other two are not measured

the same two stages in the other order
  validator first, on raw input : 7442 rejections a day
  sanitiser first, as deployed  : 42 rejections a day
  ratio : 177 to 1
  the same records, the same two rules, and the order decides how much
  the second one is allowed to know

separating the two kinds of repair
  repairs that cannot change meaning : 7200 a day
    whitespace, quote style, line endings - the value is the same value
  repairs that guess at meaning      : 200 a day
    a missing supplier code and an ambiguous date are not typography
  the sanitiser treats both as the same operation, and only the first kind
  is one

control - negative quantity, 30 a day
  sanitiser : no rule, passes through unchanged
  validator : rejects
  the record reaching the validator is the record the supplier sent,
  so the rejection means what a rejection is supposed to mean
control - unknown currency, 12 a day
  sanitiser : no rule, passes through unchanged
  validator : rejects
  the record reaching the validator is the record the supplier sent,
  so the rejection means what a rejection is supposed to mean

Both stages were added after real incidents and both do what they say.
The sanitiser runs first because it must, so 99% of the defects are
already gone when the only stage that counts them starts counting.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
