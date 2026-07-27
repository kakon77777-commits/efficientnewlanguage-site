<!-- canonical: efficientnewlanguage.org/ai/examples/122-rank-with-ties | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 122 — Ranking with ties

`rank_with_ties.eml` ranks a leaderboard containing two pairs of tied scores, under both standard conventions at once:

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Ranks a
# leaderboard where several players share a score, using the two standard
# conventions side by side:
#
#   COMPETITION ranking  1, 2, 2, 4  - tied players share the better rank
#                        and the next rank SKIPS. "Joint second, nobody
#                        third." This is how sports results are reported.
#
#   DENSE ranking        1, 2, 2, 3  - tied players share a rank and the
#                        next rank does NOT skip, so ranks stay
#                        consecutive. This is what you want when the rank
#                        is really a tier label.
#
# Neither is more correct; they answer different questions. A case that
# showed only one would make "the" ranking look like a settled matter, and
# a reader would have no way to tell which convention they were getting.
#
# Both are computed by counting rather than by walking a sorted list and
# tracking state: competition rank is 1 + how many scores are strictly
# greater, dense rank is 1 + how many DISTINCT scores are strictly
# greater. Counting makes ties fall out automatically, with no special
# case for "the previous score was the same".

def competition_rank(scores, index):
    scores[index] => target
    1 => rank
    for score in scores:
        if score > target:
            rank + 1 => rank
    return rank

def dense_rank(scores, index):
    scores[index] => target
    seen^+{}
    1 => rank
    for score in scores:
        if score > target:
            if not score in seen:
                True => seen[score]
                rank + 1 => rank
    return rank

names^+["Ada", "Grace", "Alan", "Edsger", "Barbara", "Donald"]
scores^+[95, 88, 88, 74, 74, 61]

"Leaderboard:" => header
header^0
"  player     score  competition  dense" => columns
columns^0

0 => i
while i < len(names):
    names[i] => name
    scores[i] => score
    competition_rank(scores, i) => comp
    dense_rank(scores, i) => dense
    "" => padded
    padded + name => padded
    while len(padded) < 11:
        padded + " " => padded
    "  " + padded + str(score) + "     " + str(comp) + "            " + str(dense) => line
    line^0
    i + 1 => i

"" => blank
blank^0
"Two players tied on 88 and two on 74." => note1
note1^0
"Competition ranking skips 3 and 5; dense ranking does not." => note2
note2^0
```

## Python (deterministic transpilation)

```python
def competition_rank(scores, index):
    target = scores[index]
    rank = 1
    for score in scores:
        if score > target:
            rank = rank + 1
    return rank

def dense_rank(scores, index):
    target = scores[index]
    seen = {}
    rank = 1
    for score in scores:
        if score > target:
            if not score in seen:
                seen[score] = True
                rank = rank + 1
    return rank

names = ["Ada", "Grace", "Alan", "Edsger", "Barbara", "Donald"]
scores = [95, 88, 88, 74, 74, 61]
header = "Leaderboard:"
print(header)
columns = "  player     score  competition  dense"
print(columns)
i = 0
while i < len(names):
    name = names[i]
    score = scores[i]
    comp = competition_rank(scores, i)
    dense = dense_rank(scores, i)
    padded = ""
    padded = padded + name
    while len(padded) < 11:
        padded = padded + " "
    line = "  " + padded + str(score) + "     " + str(comp) + "            " + str(dense)
    print(line)
    i = i + 1
blank = ""
print(blank)
note1 = "Two players tied on 88 and two on 74."
print(note1)
note2 = "Competition ranking skips 3 and 5; dense ranking does not."
print(note2)
```

## stdout (executed)

```text
Leaderboard:
  player     score  competition  dense
  Ada        95     1            1
  Grace      88     2            2
  Alan       88     2            2
  Edsger     74     4            3
  Barbara    74     4            3
  Donald     61     6            4

Two players tied on 88 and two on 74.
Competition ranking skips 3 and 5; dense ranking does not.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
