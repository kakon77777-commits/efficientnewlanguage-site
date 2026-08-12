<!-- canonical: efficientnewlanguage.org/ai/examples/356-the-resolution-is-cited-in-the-next-dispute | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 356 — The resolution is cited in the next dispute — 5 decisions, 1 observation

`the_resolution_is_cited_in_the_next_dispute.eml` runs the same disputes under two policies and counts how often each one actually looked at evidence.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A decision that
# becomes the evidence for the next decision.
#
# The first dispute was resolved on thin evidence, which is not a scandal - it
# was the evidence available that day. What happens next is the case: the
# resolution is written down, and the next dispute of the same kind is settled
# by citing it rather than by looking again.
#
# The policy is not laziness either. Deciding the same question the same way
# twice is called consistency, and a system that re-litigates every settled
# question is unusable. The cost is specific: the evidence keeps improving and
# nobody ever reads it again.
#
# Nothing is declared. Both policies run over the same disputes, the truth is
# carried alongside, and the number of times each policy actually consulted
# evidence is counted.

def decide_on_evidence(d):
    # d = [kind, strength, truth]
    if d[1] >= 3:
        return d[2]
    return "deny"

def similar_index(history, kind):
    0 => i
    0 - 1 => found
    for h in history:
        if h[0] == kind:
            if found < 0:
                i => found
        i + 1 => i
    return found

[["refund", 1, "allow"], ["access", 4, "allow"], ["refund", 2, "allow"], ["quota", 5, "deny"], ["refund", 4, "allow"], ["access", 1, "allow"], ["refund", 5, "allow"], ["quota", 2, "deny"], ["refund", 5, "allow"], ["access", 5, "allow"]] => disputes

# ---- policy A: decide each dispute on its own evidence ----

0 => fresh_right
0 => fresh_reads
[] => fresh_log
for d in disputes:
    decide_on_evidence(d) => answer
    fresh_reads + 1 => fresh_reads
    if answer == d[2]:
        fresh_right + 1 => fresh_right
    fresh_log + [[d[0], answer]] => fresh_log

# ---- policy B: follow the earliest decision of the same kind ----

0 => prec_right
0 => prec_reads
0 => prec_cites
[] => history
for d in disputes:
    similar_index(history, d[0]) => prior
    if prior < 0:
        decide_on_evidence(d) => answer
        prec_reads + 1 => prec_reads
    else:
        history[prior][1] => answer
        prec_cites + 1 => prec_cites
    if answer == d[2]:
        prec_right + 1 => prec_right
    history + [[d[0], answer]] => history

"disputes resolved : " + str(len(disputes)) ^0
"" ^0
"decide on the evidence each time" ^0
"  correct              : " + str(fresh_right) + " of " + str(len(disputes)) ^0
"  evidence consulted   : " + str(fresh_reads) + " times" ^0
"" ^0
"follow the earliest decision of the same kind" ^0
"  correct              : " + str(prec_right) + " of " + str(len(disputes)) ^0
"  evidence consulted   : " + str(prec_reads) + " times" ^0
"  decided by citation  : " + str(prec_cites) + " times" ^0
"" ^0

# ---- the evidence that was never read ----

"strength of the evidence at each dispute, and whether it was read" ^0
[] => seen_kinds
0 => idx
0 => unread_strong
for d in disputes:
    0 => was_read
    if not (d[0] in seen_kinds):
        1 => was_read
        seen_kinds + [d[0]] => seen_kinds
    if was_read == 1:
        "  " + str(idx) + " " + d[0] + " strength " + str(d[1]) + " : read" ^0
    else:
        "  " + str(idx) + " " + d[0] + " strength " + str(d[1]) + " : not read" ^0
        if d[1] >= 3:
            unread_strong + 1 => unread_strong
    idx + 1 => idx
"  disputes carrying decisive evidence that was never read : " + str(unread_strong) ^0
"" ^0

# ---- what one kind's whole record rests on ----

"the refund line" ^0
0 => refund_count
0 => refund_first_strength
0 => refund_best_strength
0 => first_seen
for d in disputes:
    if d[0] == "refund":
        refund_count + 1 => refund_count
        if first_seen == 0:
            d[1] => refund_first_strength
            1 => first_seen
        if d[1] > refund_best_strength:
            d[1] => refund_best_strength
# How many observations the whole refund line rests on: count the refund
# disputes at which the precedent policy actually looked at evidence.
[] => kinds_read
0 => refund_observations
for d in disputes:
    if not (d[0] in kinds_read):
        kinds_read + [d[0]] => kinds_read
        if d[0] == "refund":
            refund_observations + 1 => refund_observations
"  decisions on this kind        : " + str(refund_count) ^0
"  evidence behind all of them   : strength " + str(refund_first_strength) ^0
"  best evidence ever available  : strength " + str(refund_best_strength) ^0
"  observations behind the line  : " + str(refund_observations) ^0
"" ^0

# ---- consistency, which the policy really does deliver ----

0 => fresh_flips
0 => prec_flips
[] => fseen
[] => pseen
0 => i
for d in disputes:
    similar_index(fseen, d[0]) => fp
    if fp >= 0:
        if fseen[fp][1] != fresh_log[i][1]:
            fresh_flips + 1 => fresh_flips
    fseen + [[d[0], fresh_log[i][1]]] => fseen
    similar_index(pseen, d[0]) => pp
    if pp >= 0:
        if pseen[pp][1] != history[i][1]:
            prec_flips + 1 => prec_flips
    pseen + [[d[0], history[i][1]]] => pseen
    i + 1 => i
"consistency: decisions of one kind that disagree with the earliest" ^0
"  evidence-each-time : " + str(fresh_flips) ^0
"  follow-precedent   : " + str(prec_flips) ^0
"  the policy delivers exactly what it promises" ^0
"" ^0

"A decision recorded next to the observation it came from can be reopened" ^0
"when the observation improves. A decision recorded on its own becomes the" ^0
"observation, and there is nothing left to improve." ^0
```

## Python (deterministic transpilation)

```python
def decide_on_evidence(d):
    if d[1] >= 3:
        return d[2]
    return "deny"

def similar_index(history, kind):
    i = 0
    found = 0 - 1
    for h in history:
        if h[0] == kind:
            if found < 0:
                found = i
        i = i + 1
    return found

disputes = [["refund", 1, "allow"], ["access", 4, "allow"], ["refund", 2, "allow"], ["quota", 5, "deny"], ["refund", 4, "allow"], ["access", 1, "allow"], ["refund", 5, "allow"], ["quota", 2, "deny"], ["refund", 5, "allow"], ["access", 5, "allow"]]
fresh_right = 0
fresh_reads = 0
fresh_log = []
for d in disputes:
    answer = decide_on_evidence(d)
    fresh_reads = fresh_reads + 1
    if answer == d[2]:
        fresh_right = fresh_right + 1
    fresh_log = fresh_log + [[d[0], answer]]
prec_right = 0
prec_reads = 0
prec_cites = 0
history = []
for d in disputes:
    prior = similar_index(history, d[0])
    if prior < 0:
        answer = decide_on_evidence(d)
        prec_reads = prec_reads + 1
    else:
        answer = history[prior][1]
        prec_cites = prec_cites + 1
    if answer == d[2]:
        prec_right = prec_right + 1
    history = history + [[d[0], answer]]
print("disputes resolved : " + str(len(disputes)))
print("")
print("decide on the evidence each time")
print("  correct              : " + str(fresh_right) + " of " + str(len(disputes)))
print("  evidence consulted   : " + str(fresh_reads) + " times")
print("")
print("follow the earliest decision of the same kind")
print("  correct              : " + str(prec_right) + " of " + str(len(disputes)))
print("  evidence consulted   : " + str(prec_reads) + " times")
print("  decided by citation  : " + str(prec_cites) + " times")
print("")
print("strength of the evidence at each dispute, and whether it was read")
seen_kinds = []
idx = 0
unread_strong = 0
for d in disputes:
    was_read = 0
    if not d[0] in seen_kinds:
        was_read = 1
        seen_kinds = seen_kinds + [d[0]]
    if was_read == 1:
        print("  " + str(idx) + " " + d[0] + " strength " + str(d[1]) + " : read")
    else:
        print("  " + str(idx) + " " + d[0] + " strength " + str(d[1]) + " : not read")
        if d[1] >= 3:
            unread_strong = unread_strong + 1
    idx = idx + 1
print("  disputes carrying decisive evidence that was never read : " + str(unread_strong))
print("")
print("the refund line")
refund_count = 0
refund_first_strength = 0
refund_best_strength = 0
first_seen = 0
for d in disputes:
    if d[0] == "refund":
        refund_count = refund_count + 1
        if first_seen == 0:
            refund_first_strength = d[1]
            first_seen = 1
        if d[1] > refund_best_strength:
            refund_best_strength = d[1]
kinds_read = []
refund_observations = 0
for d in disputes:
    if not d[0] in kinds_read:
        kinds_read = kinds_read + [d[0]]
        if d[0] == "refund":
            refund_observations = refund_observations + 1
print("  decisions on this kind        : " + str(refund_count))
print("  evidence behind all of them   : strength " + str(refund_first_strength))
print("  best evidence ever available  : strength " + str(refund_best_strength))
print("  observations behind the line  : " + str(refund_observations))
print("")
fresh_flips = 0
prec_flips = 0
fseen = []
pseen = []
i = 0
for d in disputes:
    fp = similar_index(fseen, d[0])
    if fp >= 0:
        if fseen[fp][1] != fresh_log[i][1]:
            fresh_flips = fresh_flips + 1
    fseen = fseen + [[d[0], fresh_log[i][1]]]
    pp = similar_index(pseen, d[0])
    if pp >= 0:
        if pseen[pp][1] != history[i][1]:
            prec_flips = prec_flips + 1
    pseen = pseen + [[d[0], history[i][1]]]
    i = i + 1
print("consistency: decisions of one kind that disagree with the earliest")
print("  evidence-each-time : " + str(fresh_flips))
print("  follow-precedent   : " + str(prec_flips))
print("  the policy delivers exactly what it promises")
print("")
print("A decision recorded next to the observation it came from can be reopened")
print("when the observation improves. A decision recorded on its own becomes the")
print("observation, and there is nothing left to improve.")
```

## stdout (executed)

```text
disputes resolved : 10

decide on the evidence each time
  correct              : 7 of 10
  evidence consulted   : 10 times

follow the earliest decision of the same kind
  correct              : 5 of 10
  evidence consulted   : 3 times
  decided by citation  : 7 times

strength of the evidence at each dispute, and whether it was read
  0 refund strength 1 : read
  1 access strength 4 : read
  2 refund strength 2 : not read
  3 quota strength 5 : read
  4 refund strength 4 : not read
  5 access strength 1 : not read
  6 refund strength 5 : not read
  7 quota strength 2 : not read
  8 refund strength 5 : not read
  9 access strength 5 : not read
  disputes carrying decisive evidence that was never read : 4

the refund line
  decisions on this kind        : 5
  evidence behind all of them   : strength 1
  best evidence ever available  : strength 5
  observations behind the line  : 1

consistency: decisions of one kind that disagree with the earliest
  evidence-each-time : 4
  follow-precedent   : 0
  the policy delivers exactly what it promises

A decision recorded next to the observation it came from can be reopened
when the observation improves. A decision recorded on its own becomes the
observation, and there is nothing left to improve.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
