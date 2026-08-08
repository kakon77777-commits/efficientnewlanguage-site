<!-- canonical: efficientnewlanguage.org/ai/examples/297-flag-outlives-its-evidence | ai_layer_version: 0.1.0 | updated: 2026-08-08 -->

# Example 297 — Flag outlives its evidence — the conclusion stayed and the link back was never stored

`flag_outlives_its_evidence.eml` starts from a stored flag set that is consistent with the evidence by construction, retracts two signals and adds one, then re-derives every flag and splits the disagreements by direction.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The flag was
# derived from evidence that has since been withdrawn, and there is no link
# from the flag back to the evidence.
#
# A risk flag, a suppression, a "requires manual review" bit: computed once
# from whatever the system knew, then stored, because the downstream code needs
# a boolean and not a rule engine. The evidence it was computed from is
# mutable - a chargeback gets reversed, a report gets retracted, a duplicate
# signal gets deleted during a cleanup. The flag has no idea.
#
# The part that makes it permanent is the absence of provenance. Nobody stored
# WHICH facts produced the flag, so there is no query that answers "which flags
# depended on this record" when the record goes away. Recomputation is
# possible in principle and there is nothing to recompute FROM - the rule is in
# the code, the inputs are gone, and the only surviving artifact is the answer.
#
# The measurement re-derives every flag from the evidence that exists now and
# compares against what is stored, splitting the disagreements by direction:
# flags that should have cleared, and flags that should have been raised.

def signals_for(account):
    [] => out
    for s in SIGNALS:
        if s[0] == account:
            out + [s] => out
    return out

def derive(account):
    # The rule, as it lives in the code: two or more active signals, or any
    # single signal of severity 3.
    0 => n
    for s in signals_for(account):
        n + 1 => n
        if s[2] >= 3:
            return 1
    if n >= 2:
        return 1
    return 0

def retract(sig_id):
    [] => out
    for s in SIGNALS:
        if not (s[1] == sig_id):
            out + [s] => out
    return out

def add_signal(sig):
    return SIGNALS + [sig]

# account, signal id, severity
[["a-1", "s-1", 3],
 ["a-2", "s-2", 1], ["a-2", "s-3", 1],
 ["a-3", "s-4", 2],
 ["a-4", "s-5", 1], ["a-4", "s-6", 2],
 ["a-5", "s-7", 1]] => SIGNALS

["a-1", "a-2", "a-3", "a-4", "a-5"] => ACCOUNTS

# What was stored when the flag was last computed. Derived from the signals
# above, so the starting state is consistent by construction rather than by
# my typing it - a stored flag that disagreed on day zero would be a
# different case.
[] => STORED
for a in ACCOUNTS:
    STORED + [[a, derive(a)]] => STORED

"initial state - stored flags equal the rule applied to the evidence"^0
0 => initial_mismatch
for row in STORED:
    if not (row[1] == derive(row[0])):
        initial_mismatch + 1 => initial_mismatch
("  mismatches at t0: " + str(initial_mismatch))^0

# Three ordinary events. Two retractions (a chargeback reversed, a duplicate
# report deleted in a cleanup) and one new signal.
retract("s-1") => SIGNALS
retract("s-2") => SIGNALS
add_signal(["a-5", "s-8", 2]) => SIGNALS

""^0
"after the evidence changed"^0
"account  stored  re-derived  disagreement"^0
"-------  ------  ----------  -------------------"^0

0 => stale_true
0 => stale_false
for row in STORED:
    row[0] => a
    row[1] => stored
    derive(a) => now
    if stored == now:
        "-" => note
    elif stored == 1:
        "flagged, no longer earns it" => note
        stale_true + 1 => stale_true
    else:
        "clear, now earns a flag" => note
        stale_false + 1 => stale_false
    ((a + "       ")[0:9] + (str(stored) + "       ")[0:8] + (str(now) + "           ")[0:12] + note)^0

""^0
("accounts: " + str(len(ACCOUNTS)))^0
("stale-true (flagged without current cause):  " + str(stale_true))^0
("stale-false (unflagged despite new cause):   " + str(stale_false))^0

""^0
"can the flag be traced back to what produced it?"^0

# The provenance question, asked of the data that exists. A stored flag is
# [account, value]. There is no third column, so there is no answer.
0 => with_provenance
for row in STORED:
    if len(row) > 2:
        with_provenance + 1 => with_provenance
("stored flags carrying the ids they were derived from: " + str(with_provenance) + " of " + str(len(STORED)))^0
"So 'which flags depended on s-1' has no query. The retraction of s-1 could"^0
"not have notified anything, because nothing recorded that it mattered."^0

""^0
"who is affected, and in which direction"^0
"  stale-true costs the account holder and generates a complaint"^0
"  stale-false costs the system and generates nothing"^0
0 => complaints
0 => silent
for row in STORED:
    derive(row[0]) => now
    if row[1] == 1:
        if now == 0:
            complaints + 1 => complaints
    if row[1] == 0:
        if now == 1:
            silent + 1 => silent
("  accounts that will complain: " + str(complaints))^0
("  accounts that will not:      " + str(silent))^0

""^0
"a recompute pass fixes it - and here is what triggers one"^0
[] => RECOMPUTED
for a in ACCOUNTS:
    RECOMPUTED + [[a, derive(a)]] => RECOMPUTED
0 => after_recompute
for row in RECOMPUTED:
    if not (row[1] == derive(row[0])):
        after_recompute + 1 => after_recompute
("mismatches after a full recompute: " + str(after_recompute))^0
"The pass is cheap and correct. Nothing schedules it, because the event that"^0
"should schedule it - a signal being retracted - is handled by code that"^0
"knows about signals and not about flags."^0

""^0
0 => checked
0 => passed

# The starting state must be consistent, so every later mismatch is caused by
# the evidence changing and not by a bad fixture.
checked + 1 => checked
if initial_mismatch == 0:
    passed + 1 => passed

# Retracting evidence must leave flags that no longer earn themselves.
checked + 1 => checked
if stale_true > 0:
    passed + 1 => passed

# And new evidence must leave accounts unflagged that now earn one, so the
# drift is not one-directional and "recompute only on raise" would not fix it.
checked + 1 => checked
if stale_false > 0:
    passed + 1 => passed

# No stored flag may carry provenance - that absence is the reason the
# retraction could not propagate.
checked + 1 => checked
if with_provenance == 0:
    passed + 1 => passed

# A full recompute must resolve everything, proving the rule is fine and only
# its scheduling is missing.
checked + 1 => checked
if after_recompute == 0:
    passed + 1 => passed

# At least one account must be unaffected, so a spot check finds nothing.
checked + 1 => checked
0 => unchanged
for row in STORED:
    if row[1] == derive(row[0]):
        unchanged + 1 => unchanged
if unchanged > 0:
    passed + 1 => passed

# The two directions must differ in who notices - measured as counts, since
# only the stale-true accounts have a party with a reason to report it.
checked + 1 => checked
if complaints == stale_true:
    if silent == stale_false:
        passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The evidence was withdrawn and the conclusion stayed, with no link between them." => verdict
else:
    "FAILED - the flags did not behave as the checks describe." => verdict
verdict^0

""^0
"Storing a derived boolean discards the derivation. That is the entire"^0
"trade - a boolean is small and fast and answers one question, and it"^0
"cannot answer 'why' or 'still?'. The retraction path was written by people"^0
"who knew everything about signals, and a signal has no way to find out"^0
"what was concluded from it."^0
```

## Python (deterministic transpilation)

```python
def signals_for(account):
    out = []
    for s in SIGNALS:
        if s[0] == account:
            out = out + [s]
    return out

def derive(account):
    n = 0
    for s in signals_for(account):
        n = n + 1
        if s[2] >= 3:
            return 1
    if n >= 2:
        return 1
    return 0

def retract(sig_id):
    out = []
    for s in SIGNALS:
        if not s[1] == sig_id:
            out = out + [s]
    return out

def add_signal(sig):
    return SIGNALS + [sig]

SIGNALS = [["a-1", "s-1", 3], ["a-2", "s-2", 1], ["a-2", "s-3", 1], ["a-3", "s-4", 2], ["a-4", "s-5", 1], ["a-4", "s-6", 2], ["a-5", "s-7", 1]]
ACCOUNTS = ["a-1", "a-2", "a-3", "a-4", "a-5"]
STORED = []
for a in ACCOUNTS:
    STORED = STORED + [[a, derive(a)]]
print("initial state - stored flags equal the rule applied to the evidence")
initial_mismatch = 0
for row in STORED:
    if not row[1] == derive(row[0]):
        initial_mismatch = initial_mismatch + 1
print("  mismatches at t0: " + str(initial_mismatch))
SIGNALS = retract("s-1")
SIGNALS = retract("s-2")
SIGNALS = add_signal(["a-5", "s-8", 2])
print("")
print("after the evidence changed")
print("account  stored  re-derived  disagreement")
print("-------  ------  ----------  -------------------")
stale_true = 0
stale_false = 0
for row in STORED:
    a = row[0]
    stored = row[1]
    now = derive(a)
    if stored == now:
        note = "-"
    elif stored == 1:
        note = "flagged, no longer earns it"
        stale_true = stale_true + 1
    else:
        note = "clear, now earns a flag"
        stale_false = stale_false + 1
    print((a + "       ")[0:9] + (str(stored) + "       ")[0:8] + (str(now) + "           ")[0:12] + note)
print("")
print("accounts: " + str(len(ACCOUNTS)))
print("stale-true (flagged without current cause):  " + str(stale_true))
print("stale-false (unflagged despite new cause):   " + str(stale_false))
print("")
print("can the flag be traced back to what produced it?")
with_provenance = 0
for row in STORED:
    if len(row) > 2:
        with_provenance = with_provenance + 1
print("stored flags carrying the ids they were derived from: " + str(with_provenance) + " of " + str(len(STORED)))
print("So 'which flags depended on s-1' has no query. The retraction of s-1 could")
print("not have notified anything, because nothing recorded that it mattered.")
print("")
print("who is affected, and in which direction")
print("  stale-true costs the account holder and generates a complaint")
print("  stale-false costs the system and generates nothing")
complaints = 0
silent = 0
for row in STORED:
    now = derive(row[0])
    if row[1] == 1:
        if now == 0:
            complaints = complaints + 1
    if row[1] == 0:
        if now == 1:
            silent = silent + 1
print("  accounts that will complain: " + str(complaints))
print("  accounts that will not:      " + str(silent))
print("")
print("a recompute pass fixes it - and here is what triggers one")
RECOMPUTED = []
for a in ACCOUNTS:
    RECOMPUTED = RECOMPUTED + [[a, derive(a)]]
after_recompute = 0
for row in RECOMPUTED:
    if not row[1] == derive(row[0]):
        after_recompute = after_recompute + 1
print("mismatches after a full recompute: " + str(after_recompute))
print("The pass is cheap and correct. Nothing schedules it, because the event that")
print("should schedule it - a signal being retracted - is handled by code that")
print("knows about signals and not about flags.")
print("")
checked = 0
passed = 0
checked = checked + 1
if initial_mismatch == 0:
    passed = passed + 1
checked = checked + 1
if stale_true > 0:
    passed = passed + 1
checked = checked + 1
if stale_false > 0:
    passed = passed + 1
checked = checked + 1
if with_provenance == 0:
    passed = passed + 1
checked = checked + 1
if after_recompute == 0:
    passed = passed + 1
checked = checked + 1
unchanged = 0
for row in STORED:
    if row[1] == derive(row[0]):
        unchanged = unchanged + 1
if unchanged > 0:
    passed = passed + 1
checked = checked + 1
if complaints == stale_true:
    if silent == stale_false:
        passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The evidence was withdrawn and the conclusion stayed, with no link between them."
else:
    verdict = "FAILED - the flags did not behave as the checks describe."
print(verdict)
print("")
print("Storing a derived boolean discards the derivation. That is the entire")
print("trade - a boolean is small and fast and answers one question, and it")
print("cannot answer 'why' or 'still?'. The retraction path was written by people")
print("who knew everything about signals, and a signal has no way to find out")
print("what was concluded from it.")
```

## stdout (executed)

```text
initial state - stored flags equal the rule applied to the evidence
  mismatches at t0: 0

after the evidence changed
account  stored  re-derived  disagreement
-------  ------  ----------  -------------------
a-1      1       0           flagged, no longer earns it
a-2      1       0           flagged, no longer earns it
a-3      0       0           -
a-4      1       1           -
a-5      0       1           clear, now earns a flag

accounts: 5
stale-true (flagged without current cause):  2
stale-false (unflagged despite new cause):   1

can the flag be traced back to what produced it?
stored flags carrying the ids they were derived from: 0 of 5
So 'which flags depended on s-1' has no query. The retraction of s-1 could
not have notified anything, because nothing recorded that it mattered.

who is affected, and in which direction
  stale-true costs the account holder and generates a complaint
  stale-false costs the system and generates nothing
  accounts that will complain: 2
  accounts that will not:      1

a recompute pass fixes it - and here is what triggers one
mismatches after a full recompute: 0
The pass is cheap and correct. Nothing schedules it, because the event that
should schedule it - a signal being retracted - is handled by code that
knows about signals and not about flags.

checks passed: 7/7
The evidence was withdrawn and the conclusion stayed, with no link between them.

Storing a derived boolean discards the derivation. That is the entire
trade - a boolean is small and fast and answers one question, and it
cannot answer 'why' or 'still?'. The retraction path was written by people
who knew everything about signals, and a signal has no way to find out
what was concluded from it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
