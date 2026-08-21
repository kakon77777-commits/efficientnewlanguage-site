<!-- canonical: efficientnewlanguage.org/ai/examples/484-the-name-outlived-the-thing-it-named | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 484 — The name outlived the thing it named

`the_name_outlived_the_thing_it_named.eml` - The product was renamed four years ago. Where the old name still is, and what it now means in each place, is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The product was
# renamed four years ago. Where the old name still is, and what it now means in
# each place, is computed below.
#
# Not renaming everything was right. A rename touches running code, stored data,
# external contracts and other people's integrations, and the cost of doing all
# of it at once is far larger than the cost of a stale identifier. Every team
# that decided to leave a name alone decided correctly.
#
# The word did not stop being used, though. It stayed in the places nobody
# migrated and it was also given to new things, so it now denotes more than one
# thing, and which one is meant depends on which file you are reading.
#
# Every occurrence is classified by what it denotes now.

# [place, what the old name denotes there, safe to rename, external]
[["the database table", "the original product", 1, 0], ["the API path", "the original product", 0, 1], ["the metrics prefix", "the original product", 0, 0], ["the internal package", "the original product", 1, 0], ["the new team's module", "a different subsystem", 1, 0], ["the config key", "the original product", 0, 1], ["the runbook title", "the whole company's old name", 1, 0], ["the error code prefix", "a different subsystem", 0, 1]] => places

len(places) => n

[] => meanings
for p in places:
    if not (p[1] in meanings):
        meanings + [p[1]] => meanings

"occurrences of the old name : " + str(n) ^0
"distinct things it now denotes : " + str(len(meanings)) ^0
for m in meanings:
    0 => c
    for p in places:
        if p[1] == m:
            c + 1 => c
    "  " + m + " : " + str(c) ^0
"" ^0

"place                    denotes                        renameable   external" ^0
0 => safe
0 => external
for p in places:
    "" => s
    if p[2] == 1:
        s + "yes" => s
        safe + 1 => safe
    else:
        s + "no " => s
    "" => e
    if p[3] == 1:
        e + "yes" => e
        external + 1 => external
    else:
        e + "no " => e
    "  " + p[0] + "   " + p[1] + "   " + s + "          " + e ^0
"" ^0

"safe to rename now : " + str(safe) + " of " + str(n) ^0
"visible outside the company : " + str(external) ^0
"" ^0

# ---- what a rename would achieve, honestly ----

0 => renamed_after
for p in places:
    if p[2] == 0:
        renamed_after + 1 => renamed_after
"renaming everything that is safe" ^0
"  occurrences removed : " + str(safe) ^0
"  occurrences remaining : " + str(renamed_after) ^0
if renamed_after > 0:
    "  the word still means more than one thing afterwards, because the ones" ^0
    "  that stay are the ones with external contracts" ^0
"" ^0

# ---- the cost that is being paid now ----
#
# Not the rename. The cost of the ambiguity is paid by every reader who has to
# work out which of the meanings is in force.

0 => ambiguous_pairs
for i in [0:n - 1]:
    for j in [0:n - 1]:
        if i < j:
            if not (places[i][1] == places[j][1]):
                ambiguous_pairs + 1 => ambiguous_pairs
"pairs of occurrences that mean different things : " + str(ambiguous_pairs) ^0
if ambiguous_pairs > 0:
    "  a reader who learns the word in one place and applies it in another is" ^0
    "  wrong for " + str(ambiguous_pairs) + " of the possible pairings" ^0
"" ^0

# ---- what would have prevented it ----

"what makes a stale name harmless" ^0
"  being stale        : harmless on its own, it is one dead word" ^0
"  being reused       : this is the part that costs" ^0
"  the new team gave the old word to a new subsystem, which is the decision" ^0
"  that turned a dead name into an ambiguous one" ^0
0 => reused
for p in places:
    if p[1] == "a different subsystem":
        reused + 1 => reused
"  occurrences that are reuse rather than residue : " + str(reused) ^0
"" ^0

# ---- the control: a name that was retired and not reused ----
#
# Where the old word is dead everywhere and given to nothing new, it costs a
# moment of confusion and denotes exactly one thing.

"control - an old codename that was never reassigned" ^0
"  occurrences : several, all denoting the same retired thing" ^0
"  distinct meanings : 1" ^0
"  a reader who learns it once is right everywhere, which is the property" ^0
"  the reused name gave up" ^0
"" ^0

"Leaving the name alone was cheaper than renaming and every team that chose" ^0
"it chose correctly. The word was then given to something else, and one word" ^0
"for two things is a different problem from an old word for an old thing." ^0
```

## Python (deterministic transpilation)

```python
places = [["the database table", "the original product", 1, 0], ["the API path", "the original product", 0, 1], ["the metrics prefix", "the original product", 0, 0], ["the internal package", "the original product", 1, 0], ["the new team's module", "a different subsystem", 1, 0], ["the config key", "the original product", 0, 1], ["the runbook title", "the whole company's old name", 1, 0], ["the error code prefix", "a different subsystem", 0, 1]]
n = len(places)
meanings = []
for p in places:
    if not p[1] in meanings:
        meanings = meanings + [p[1]]
print("occurrences of the old name : " + str(n))
print("distinct things it now denotes : " + str(len(meanings)))
for m in meanings:
    c = 0
    for p in places:
        if p[1] == m:
            c = c + 1
    print("  " + m + " : " + str(c))
print("")
print("place                    denotes                        renameable   external")
safe = 0
external = 0
for p in places:
    s = ""
    if p[2] == 1:
        s = s + "yes"
        safe = safe + 1
    else:
        s = s + "no "
    e = ""
    if p[3] == 1:
        e = e + "yes"
        external = external + 1
    else:
        e = e + "no "
    print("  " + p[0] + "   " + p[1] + "   " + s + "          " + e)
print("")
print("safe to rename now : " + str(safe) + " of " + str(n))
print("visible outside the company : " + str(external))
print("")
renamed_after = 0
for p in places:
    if p[2] == 0:
        renamed_after = renamed_after + 1
print("renaming everything that is safe")
print("  occurrences removed : " + str(safe))
print("  occurrences remaining : " + str(renamed_after))
if renamed_after > 0:
    print("  the word still means more than one thing afterwards, because the ones")
    print("  that stay are the ones with external contracts")
print("")
ambiguous_pairs = 0
for i in range(0, n):
    for j in range(0, n):
        if i < j:
            if not places[i][1] == places[j][1]:
                ambiguous_pairs = ambiguous_pairs + 1
print("pairs of occurrences that mean different things : " + str(ambiguous_pairs))
if ambiguous_pairs > 0:
    print("  a reader who learns the word in one place and applies it in another is")
    print("  wrong for " + str(ambiguous_pairs) + " of the possible pairings")
print("")
print("what makes a stale name harmless")
print("  being stale        : harmless on its own, it is one dead word")
print("  being reused       : this is the part that costs")
print("  the new team gave the old word to a new subsystem, which is the decision")
print("  that turned a dead name into an ambiguous one")
reused = 0
for p in places:
    if p[1] == "a different subsystem":
        reused = reused + 1
print("  occurrences that are reuse rather than residue : " + str(reused))
print("")
print("control - an old codename that was never reassigned")
print("  occurrences : several, all denoting the same retired thing")
print("  distinct meanings : 1")
print("  a reader who learns it once is right everywhere, which is the property")
print("  the reused name gave up")
print("")
print("Leaving the name alone was cheaper than renaming and every team that chose")
print("it chose correctly. The word was then given to something else, and one word")
print("for two things is a different problem from an old word for an old thing.")
```

## stdout (executed)

```text
occurrences of the old name : 8
distinct things it now denotes : 3
  the original product : 5
  a different subsystem : 2
  the whole company's old name : 1

place                    denotes                        renameable   external
  the database table   the original product   yes          no 
  the API path   the original product   no           yes
  the metrics prefix   the original product   no           no 
  the internal package   the original product   yes          no 
  the new team's module   a different subsystem   yes          no 
  the config key   the original product   no           yes
  the runbook title   the whole company's old name   yes          no 
  the error code prefix   a different subsystem   no           yes

safe to rename now : 4 of 8
visible outside the company : 3

renaming everything that is safe
  occurrences removed : 4
  occurrences remaining : 4
  the word still means more than one thing afterwards, because the ones
  that stay are the ones with external contracts

pairs of occurrences that mean different things : 17
  a reader who learns the word in one place and applies it in another is
  wrong for 17 of the possible pairings

what makes a stale name harmless
  being stale        : harmless on its own, it is one dead word
  being reused       : this is the part that costs
  the new team gave the old word to a new subsystem, which is the decision
  that turned a dead name into an ambiguous one
  occurrences that are reuse rather than residue : 2

control - an old codename that was never reassigned
  occurrences : several, all denoting the same retired thing
  distinct meanings : 1
  a reader who learns it once is right everywhere, which is the property
  the reused name gave up

Leaving the name alone was cheaper than renaming and every team that chose
it chose correctly. The word was then given to something else, and one word
for two things is a different problem from an old word for an old thing.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
