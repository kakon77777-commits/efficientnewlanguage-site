<!-- canonical: efficientnewlanguage.org/ai/examples/510-silence-was-recorded-as-assent | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 510 — Silence was recorded as assent

`silence_was_recorded_as_assent.eml` - A proposal process counts a non-response as approval. What the approvals mean is computed below by separating the votes that were cast from the votes that were assumed.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A proposal
# process counts a non-response as approval. What the approvals mean is
# computed below by separating the votes that were cast from the votes that
# were assumed.
#
# The rule is reasonable and it was adopted for a reason. Before it, one
# unreturned review blocked a proposal for weeks, reviewers went on holiday,
# and the queue was measured in months rather than days. Treating silence as
# assent unblocked the process and the throughput improvement was immediate
# and real.
#
# A recorded approval now has two possible origins: somebody read the proposal
# and agreed, or the window closed. The record does not distinguish them, and
# the proportion of each is not fixed - it moves with how much time reviewers
# have, which is not a property of the proposal.
#
# The two origins are counted separately below.

# [proposal, reviewers, explicit yes, explicit no, silent, days open]
[["retention policy", 9, 2, 0, 7, 5], ["index rebuild", 9, 6, 1, 2, 14], ["auth migration", 9, 3, 0, 6, 5], ["log schema", 9, 1, 0, 8, 3], ["vendor swap", 9, 7, 2, 0, 21], ["cache eviction", 9, 2, 0, 7, 5]] => proposals

len(proposals) => n

"proposal            reviewers   yes   no   silent   days open   recorded as" ^0
for p in proposals:
    "" => outcome
    if p[3] > 0:
        "blocked" => outcome
    else:
        "approved" => outcome
    "  " + p[0] + "   " + str(p[1]) + "          " + str(p[2]) + "     " + str(p[3]) + "    " + str(p[4]) + "        " + str(p[5]) + "          " + outcome ^0
"" ^0

0 => total_reviewers
0 => total_yes
0 => total_no
0 => total_silent
for p in proposals:
    total_reviewers + p[1] => total_reviewers
    total_yes + p[2] => total_yes
    total_no + p[3] => total_no
    total_silent + p[4] => total_silent

"across " + str(n) + " proposals" ^0
"  reviewer slots     : " + str(total_reviewers) ^0
"  explicit yes       : " + str(total_yes) + ", " + str(int(total_yes * 100 / total_reviewers)) + "%" ^0
"  explicit no        : " + str(total_no) + ", " + str(int(total_no * 100 / total_reviewers)) + "%" ^0
"  silent             : " + str(total_silent) + ", " + str(int(total_silent * 100 / total_reviewers)) + "%" ^0
"  recorded approvals : " + str(total_yes + total_silent) + ", " + str(int((total_yes + total_silent) * 100 / total_reviewers)) + "%" ^0
"" ^0

# ---- what the approval rate is made of ----

"the recorded approval rate, split by where it came from" ^0
"  from somebody agreeing : " + str(int(total_yes * 100 / (total_yes + total_silent))) + "%" ^0
"  from the window closing: " + str(100 - int(total_yes * 100 / (total_yes + total_silent))) + "%" ^0
if total_silent > total_yes:
    "  most of the approval in this record was never given by anybody" ^0
"" ^0

# ---- the window is the variable ----

"days open against the share of explicit responses" ^0
for p in proposals:
    "  " + p[0] + " : " + str(p[5]) + " days, " + str(int((p[2] + p[3]) * 100 / p[1])) + "% responded" ^0
0 => longest
"" => long_name
for p in proposals:
    if p[5] > longest:
        p[5] => longest
        p[0] => long_name
0 => shortest
"" => short_name
for p in proposals:
    if shortest == 0:
        p[5] => shortest
        p[0] => short_name
    if p[5] < shortest:
        p[5] => shortest
        p[0] => short_name
for p in proposals:
    if p[0] == long_name:
        "  longest window  : " + p[0] + ", " + str(p[5]) + " days, " + str(int((p[2] + p[3]) * 100 / p[1])) + "% responded" ^0
    if p[0] == short_name:
        "  shortest window : " + p[0] + ", " + str(p[5]) + " days, " + str(int((p[2] + p[3]) * 100 / p[1])) + "% responded" ^0
"  response is a function of the window, and the window is set by whoever" ^0
"  is in a hurry" ^0
"" ^0

# ---- which proposals attracted a no ----

"the proposals that were blocked" ^0
0 => blocked
for p in proposals:
    if p[3] > 0:
        blocked + 1 => blocked
        "  " + p[0] + " : " + str(p[5]) + " days open, " + str(p[2] + p[3]) + " of " + str(p[1]) + " responded" ^0
"  blocked : " + str(blocked) + " of " + str(n) ^0
"  every one of them had a window long enough for somebody to read it" ^0
0 => short_blocked
for p in proposals:
    if p[5] < 7:
        if p[3] > 0:
            short_blocked + 1 => short_blocked
"  proposals under a week that drew a no : " + str(short_blocked) ^0
"" ^0

# ---- what the same proposals look like under the old rule ----

"the same six under a rule that requires an explicit majority" ^0
0 => would_pass
for p in proposals:
    if p[2] * 2 > p[1]:
        if p[3] == 0:
            would_pass + 1 => would_pass
0 => passed_now
for p in proposals:
    if p[3] == 0:
        passed_now + 1 => passed_now
"  approved under the current rule : " + str(passed_now) + " of " + str(n) ^0
"  approved under an explicit majority : " + str(would_pass) + " of " + str(n) ^0
"  the difference is " + str(passed_now - would_pass) + " proposals that nobody voted against and" ^0
"  that fewer than half the reviewers answered on at all" ^0
"" ^0

# ---- the control: a proposal that got a full response ----
#
# Where every reviewer answered, the record and the reading are the same
# thing, and the approval means what it says.

for p in proposals:
    if p[4] == 0:
        "control - " + p[0] + ", " + str(p[5]) + " days open" ^0
        "  responded : " + str(p[2] + p[3]) + " of " + str(p[1]) + ", silent : " + str(p[4]) ^0
        "  yes " + str(p[2]) + ", no " + str(p[3]) ^0
        "  here the outcome came from " + str(p[2] + p[3]) + " people who read it, and the rule" ^0
        "  about silence never had to be applied" ^0
"" ^0

"Counting silence as assent fixed a queue that really was measured in months." ^0
"It also made an approval and an unread proposal produce the same record, and" ^0
str(100 - int(total_yes * 100 / (total_yes + total_silent))) + "% of the approvals here are the second kind." ^0
```

## Python (deterministic transpilation)

```python
proposals = [["retention policy", 9, 2, 0, 7, 5], ["index rebuild", 9, 6, 1, 2, 14], ["auth migration", 9, 3, 0, 6, 5], ["log schema", 9, 1, 0, 8, 3], ["vendor swap", 9, 7, 2, 0, 21], ["cache eviction", 9, 2, 0, 7, 5]]
n = len(proposals)
print("proposal            reviewers   yes   no   silent   days open   recorded as")
for p in proposals:
    outcome = ""
    if p[3] > 0:
        outcome = "blocked"
    else:
        outcome = "approved"
    print("  " + p[0] + "   " + str(p[1]) + "          " + str(p[2]) + "     " + str(p[3]) + "    " + str(p[4]) + "        " + str(p[5]) + "          " + outcome)
print("")
total_reviewers = 0
total_yes = 0
total_no = 0
total_silent = 0
for p in proposals:
    total_reviewers = total_reviewers + p[1]
    total_yes = total_yes + p[2]
    total_no = total_no + p[3]
    total_silent = total_silent + p[4]
print("across " + str(n) + " proposals")
print("  reviewer slots     : " + str(total_reviewers))
print("  explicit yes       : " + str(total_yes) + ", " + str(int(total_yes * 100 / total_reviewers)) + "%")
print("  explicit no        : " + str(total_no) + ", " + str(int(total_no * 100 / total_reviewers)) + "%")
print("  silent             : " + str(total_silent) + ", " + str(int(total_silent * 100 / total_reviewers)) + "%")
print("  recorded approvals : " + str(total_yes + total_silent) + ", " + str(int((total_yes + total_silent) * 100 / total_reviewers)) + "%")
print("")
print("the recorded approval rate, split by where it came from")
print("  from somebody agreeing : " + str(int(total_yes * 100 / (total_yes + total_silent))) + "%")
print("  from the window closing: " + str(100 - int(total_yes * 100 / (total_yes + total_silent))) + "%")
if total_silent > total_yes:
    print("  most of the approval in this record was never given by anybody")
print("")
print("days open against the share of explicit responses")
for p in proposals:
    print("  " + p[0] + " : " + str(p[5]) + " days, " + str(int((p[2] + p[3]) * 100 / p[1])) + "% responded")
longest = 0
long_name = ""
for p in proposals:
    if p[5] > longest:
        longest = p[5]
        long_name = p[0]
shortest = 0
short_name = ""
for p in proposals:
    if shortest == 0:
        shortest = p[5]
        short_name = p[0]
    if p[5] < shortest:
        shortest = p[5]
        short_name = p[0]
for p in proposals:
    if p[0] == long_name:
        print("  longest window  : " + p[0] + ", " + str(p[5]) + " days, " + str(int((p[2] + p[3]) * 100 / p[1])) + "% responded")
    if p[0] == short_name:
        print("  shortest window : " + p[0] + ", " + str(p[5]) + " days, " + str(int((p[2] + p[3]) * 100 / p[1])) + "% responded")
print("  response is a function of the window, and the window is set by whoever")
print("  is in a hurry")
print("")
print("the proposals that were blocked")
blocked = 0
for p in proposals:
    if p[3] > 0:
        blocked = blocked + 1
        print("  " + p[0] + " : " + str(p[5]) + " days open, " + str(p[2] + p[3]) + " of " + str(p[1]) + " responded")
print("  blocked : " + str(blocked) + " of " + str(n))
print("  every one of them had a window long enough for somebody to read it")
short_blocked = 0
for p in proposals:
    if p[5] < 7:
        if p[3] > 0:
            short_blocked = short_blocked + 1
print("  proposals under a week that drew a no : " + str(short_blocked))
print("")
print("the same six under a rule that requires an explicit majority")
would_pass = 0
for p in proposals:
    if p[2] * 2 > p[1]:
        if p[3] == 0:
            would_pass = would_pass + 1
passed_now = 0
for p in proposals:
    if p[3] == 0:
        passed_now = passed_now + 1
print("  approved under the current rule : " + str(passed_now) + " of " + str(n))
print("  approved under an explicit majority : " + str(would_pass) + " of " + str(n))
print("  the difference is " + str(passed_now - would_pass) + " proposals that nobody voted against and")
print("  that fewer than half the reviewers answered on at all")
print("")
for p in proposals:
    if p[4] == 0:
        print("control - " + p[0] + ", " + str(p[5]) + " days open")
        print("  responded : " + str(p[2] + p[3]) + " of " + str(p[1]) + ", silent : " + str(p[4]))
        print("  yes " + str(p[2]) + ", no " + str(p[3]))
        print("  here the outcome came from " + str(p[2] + p[3]) + " people who read it, and the rule")
        print("  about silence never had to be applied")
print("")
print("Counting silence as assent fixed a queue that really was measured in months.")
print("It also made an approval and an unread proposal produce the same record, and")
print(str(100 - int(total_yes * 100 / (total_yes + total_silent))) + "% of the approvals here are the second kind.")
```

## stdout (executed)

```text
proposal            reviewers   yes   no   silent   days open   recorded as
  retention policy   9          2     0    7        5          approved
  index rebuild   9          6     1    2        14          blocked
  auth migration   9          3     0    6        5          approved
  log schema   9          1     0    8        3          approved
  vendor swap   9          7     2    0        21          blocked
  cache eviction   9          2     0    7        5          approved

across 6 proposals
  reviewer slots     : 54
  explicit yes       : 21, 38%
  explicit no        : 3, 5%
  silent             : 30, 55%
  recorded approvals : 51, 94%

the recorded approval rate, split by where it came from
  from somebody agreeing : 41%
  from the window closing: 59%
  most of the approval in this record was never given by anybody

days open against the share of explicit responses
  retention policy : 5 days, 22% responded
  index rebuild : 14 days, 77% responded
  auth migration : 5 days, 33% responded
  log schema : 3 days, 11% responded
  vendor swap : 21 days, 100% responded
  cache eviction : 5 days, 22% responded
  shortest window : log schema, 3 days, 11% responded
  longest window  : vendor swap, 21 days, 100% responded
  response is a function of the window, and the window is set by whoever
  is in a hurry

the proposals that were blocked
  index rebuild : 14 days open, 7 of 9 responded
  vendor swap : 21 days open, 9 of 9 responded
  blocked : 2 of 6
  every one of them had a window long enough for somebody to read it
  proposals under a week that drew a no : 0

the same six under a rule that requires an explicit majority
  approved under the current rule : 4 of 6
  approved under an explicit majority : 0 of 6
  the difference is 4 proposals that nobody voted against and
  that fewer than half the reviewers answered on at all

control - vendor swap, 21 days open
  responded : 9 of 9, silent : 0
  yes 7, no 2
  here the outcome came from 9 people who read it, and the rule
  about silence never had to be applied

Counting silence as assent fixed a queue that really was measured in months.
It also made an approval and an unread proposal produce the same record, and
59% of the approvals here are the second kind.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
