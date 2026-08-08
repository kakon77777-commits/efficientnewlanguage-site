<!-- canonical: efficientnewlanguage.org/ai/examples/298-inherited-permission-after-move | ai_layer_version: 0.1.0 | updated: 2026-08-08 -->

# Example 298 — Inherited permission after move — the cache refreshes on write, and a move is not a write

`inherited_permission_after_move.eml` moves four documents between folders and compares, for every (user, action) pair, the grants cached on the document against the grants its current folder actually gives.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Permission is
# inherited from the folder, cached on the document, and the document moves.
#
# Inherited permissions are expensive to resolve on every read - the walk goes
# up the tree and the tree is in another table - so the resolved answer gets
# stored on the document. That is a cache, and like every cache it needs an
# invalidation rule. The rule that gets written is "recompute on write",
# because writing is when the document is in hand.
#
# Moving a document is not a write to the document. It is a write to its
# PARENT link, and in most schemas it is one column in one row somewhere else.
# So the operation that changes what a document inherits is the one operation
# that does not pass through the place the cache is refreshed.
#
# The consequence has a direction. A document moved from an open folder to a
# restricted one keeps the open grants: the cache is stale toward MORE access,
# and the move that produced it is the move an archivist makes when tidying
# something sensitive away. The measurement classifies every disagreement by
# direction rather than counting them.

def folder_grants(folder):
    # Who may do what, by folder. A grant is [user, action].
    if folder == "public":
        return [["ann", "read"], ["ann", "write"], ["bob", "read"], ["cho", "read"], ["dee", "read"]]
    if folder == "team":
        return [["ann", "read"], ["ann", "write"], ["bob", "read"], ["bob", "write"]]
    if folder == "restricted":
        return [["ann", "read"]]
    if folder == "legal":
        return [["cho", "read"], ["cho", "write"]]
    return []

def granted(folder, user, action):
    for g in folder_grants(folder):
        if g[0] == user:
            if g[1] == action:
                return 1
    return 0

def cached_allows(doc, user, action):
    # Model A: read the grants frozen onto the document.
    # doc is [id, folder_now, folder_when_cached].
    return granted(doc[2], user, action)

def live_allows(doc, user, action):
    # Model B: resolve through the document's current parent.
    return granted(doc[1], user, action)

def move(doc, dest):
    # A move writes the parent link. It does not touch the document, so the
    # cache refresh - which lives on the document write path - never runs.
    return [doc[0], dest, doc[2]]

def write_doc(doc):
    # An ordinary edit. This is where the cache is refreshed, which is why
    # the documents with the stalest permissions are the ones nobody edits.
    return [doc[0], doc[1], doc[1]]

["ann", "bob", "cho", "dee"] => USERS
["read", "write"] => ACTIONS

# id, starting folder, and where it is moved to. Two of the four are the
# tidying-away direction: something open being filed somewhere closed.
[["d1", "public", "restricted"],
 ["d2", "team", "legal"],
 ["d3", "restricted", "public"],
 ["d4", "legal", "team"]] => PLAN

"doc  from        to          disagreements  over-permissive  under"^0
"---- ----------- ----------- -------------  ---------------  -----"^0

0 => total_over
0 => total_under
0 => pairs
[] => moved_docs
for p in PLAN:
    [p[0], p[1], p[1]] => doc
    move(doc, p[2]) => doc
    moved_docs + [doc] => moved_docs
    0 => over
    0 => under
    for u in USERS:
        for a in ACTIONS:
            cached_allows(doc, u, a) => c
            live_allows(doc, u, a) => l
            pairs + 1 => pairs
            if c == 1:
                if l == 0:
                    over + 1 => over
                    total_over + 1 => total_over
            if c == 0:
                if l == 1:
                    under + 1 => under
                    total_under + 1 => total_under
    ((p[0] + "     ")[0:5] + (p[1] + "            ")[0:12] + (p[2] + "            ")[0:12] + (str(over + under) + "              ")[0:15] + (str(over) + "                 ")[0:17] + str(under))^0

""^0
("(user, action) pairs compared: " + str(pairs))^0
("cache grants access the folder does not: " + str(total_over))^0
("cache withholds access the folder grants: " + str(total_under))^0

""^0
"who is affected, by name"^0
for u in USERS:
    0 => over_u
    for doc in moved_docs:
        for a in ACTIONS:
            if cached_allows(doc, u, a) == 1:
                if live_allows(doc, u, a) == 0:
                    over_u + 1 => over_u
    ((u + "     ")[0:5] + " holds " + str(over_u) + " grants the current folder does not give")^0

""^0
"the refresh, and what it is conditioned on"^0

# Writing the document reconciles it. So the stale set is exactly the set of
# documents nobody has edited since the move - which is what an archive IS.
0 => after_write_over
for doc in moved_docs:
    write_doc(doc) => fresh
    for u in USERS:
        for a in ACTIONS:
            if cached_allows(fresh, u, a) == 1:
                if live_allows(fresh, u, a) == 0:
                    after_write_over + 1 => after_write_over
("over-permissive grants remaining after one edit to each document: " + str(after_write_over))^0

""^0
"the direction the moves point"^0

# Whether the stale cache is dangerous depends on which way the document
# moved, and that is a property of what people use moves FOR. Score each
# move by whether it narrowed or widened access, computed from the two
# folders' grant sets rather than from the folder names.
for p in PLAN:
    len(folder_grants(p[1])) => before
    len(folder_grants(p[2])) => after
    if before > after:
        "narrowing" => direction
    elif after > before:
        "widening " => direction
    else:
        "sideways " => direction
    ((p[0] + "   ")[0:3] + " " + direction + " (" + str(before) + " grants -> " + str(after) + ")")^0

""^0
0 => checked
0 => passed

# The cache must grant access the current folder does not.
checked + 1 => checked
if total_over > 0:
    passed + 1 => passed

# More than one user must be affected, so this is a property of the model
# rather than of one crafted grant.
checked + 1 => checked
0 => affected_users
for u in USERS:
    0 => over_u
    for doc in moved_docs:
        for a in ACTIONS:
            if cached_allows(doc, u, a) == 1:
                if live_allows(doc, u, a) == 0:
                    over_u + 1 => over_u
    if over_u > 0:
        affected_users + 1 => affected_users
if affected_users >= 2:
    passed + 1 => passed

# Editing every document must clear the whole over-permissive set - proving
# the refresh rule works and that the only defect is which operations reach
# it.
checked + 1 => checked
if after_write_over == 0:
    passed + 1 => passed

# The live model must never disagree with itself: resolving twice gives the
# same answer, so the comparison above is between a cache and a fixed truth.
checked + 1 => checked
0 => unstable
for doc in moved_docs:
    for u in USERS:
        for a in ACTIONS:
            if not (live_allows(doc, u, a) == live_allows(doc, u, a)):
                unstable + 1 => unstable
if unstable == 0:
    passed + 1 => passed

# Both directions of staleness must appear in the data. A case showing only
# the dangerous one would be picking its examples; the point is that the
# same mechanism produces both and only one of them generates a complaint.
checked + 1 => checked
if total_over > 0:
    if total_under > 0:
        passed + 1 => passed

# And the narrowing moves must be the ones producing over-permissive grants.
# Computed from grant-set sizes, not from the folder names.
checked + 1 => checked
0 => over_from_narrowing
0 => over_from_widening
for p in PLAN:
    [p[0], p[1], p[1]] => d0
    move(d0, p[2]) => d
    0 => over
    for u in USERS:
        for a in ACTIONS:
            if cached_allows(d, u, a) == 1:
                if live_allows(d, u, a) == 0:
                    over + 1 => over
    if len(folder_grants(p[1])) > len(folder_grants(p[2])):
        over_from_narrowing + over => over_from_narrowing
    else:
        over_from_widening + over => over_from_widening
if over_from_narrowing > over_from_widening:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The documents that were tidied away kept the grants of the folder they left." => verdict
else:
    "FAILED - the models did not behave as the checks describe." => verdict
verdict^0

""^0
"The cache is refreshed when the document is written, and the operation"^0
"that invalidates it does not write the document - it writes the link."^0
"Every part of that sentence was chosen by someone who was right about"^0
"their own part. What nobody owned was the question of which operations"^0
"change an inherited answer, and a move is the only one that changes it"^0
"without touching the thing that holds it."^0
```

## Python (deterministic transpilation)

```python
def folder_grants(folder):
    if folder == "public":
        return [["ann", "read"], ["ann", "write"], ["bob", "read"], ["cho", "read"], ["dee", "read"]]
    if folder == "team":
        return [["ann", "read"], ["ann", "write"], ["bob", "read"], ["bob", "write"]]
    if folder == "restricted":
        return [["ann", "read"]]
    if folder == "legal":
        return [["cho", "read"], ["cho", "write"]]
    return []

def granted(folder, user, action):
    for g in folder_grants(folder):
        if g[0] == user:
            if g[1] == action:
                return 1
    return 0

def cached_allows(doc, user, action):
    return granted(doc[2], user, action)

def live_allows(doc, user, action):
    return granted(doc[1], user, action)

def move(doc, dest):
    return [doc[0], dest, doc[2]]

def write_doc(doc):
    return [doc[0], doc[1], doc[1]]

USERS = ["ann", "bob", "cho", "dee"]
ACTIONS = ["read", "write"]
PLAN = [["d1", "public", "restricted"], ["d2", "team", "legal"], ["d3", "restricted", "public"], ["d4", "legal", "team"]]
print("doc  from        to          disagreements  over-permissive  under")
print("---- ----------- ----------- -------------  ---------------  -----")
total_over = 0
total_under = 0
pairs = 0
moved_docs = []
for p in PLAN:
    doc = [p[0], p[1], p[1]]
    doc = move(doc, p[2])
    moved_docs = moved_docs + [doc]
    over = 0
    under = 0
    for u in USERS:
        for a in ACTIONS:
            c = cached_allows(doc, u, a)
            l = live_allows(doc, u, a)
            pairs = pairs + 1
            if c == 1:
                if l == 0:
                    over = over + 1
                    total_over = total_over + 1
            if c == 0:
                if l == 1:
                    under = under + 1
                    total_under = total_under + 1
    print((p[0] + "     ")[0:5] + (p[1] + "            ")[0:12] + (p[2] + "            ")[0:12] + (str(over + under) + "              ")[0:15] + (str(over) + "                 ")[0:17] + str(under))
print("")
print("(user, action) pairs compared: " + str(pairs))
print("cache grants access the folder does not: " + str(total_over))
print("cache withholds access the folder grants: " + str(total_under))
print("")
print("who is affected, by name")
for u in USERS:
    over_u = 0
    for doc in moved_docs:
        for a in ACTIONS:
            if cached_allows(doc, u, a) == 1:
                if live_allows(doc, u, a) == 0:
                    over_u = over_u + 1
    print((u + "     ")[0:5] + " holds " + str(over_u) + " grants the current folder does not give")
print("")
print("the refresh, and what it is conditioned on")
after_write_over = 0
for doc in moved_docs:
    fresh = write_doc(doc)
    for u in USERS:
        for a in ACTIONS:
            if cached_allows(fresh, u, a) == 1:
                if live_allows(fresh, u, a) == 0:
                    after_write_over = after_write_over + 1
print("over-permissive grants remaining after one edit to each document: " + str(after_write_over))
print("")
print("the direction the moves point")
for p in PLAN:
    before = len(folder_grants(p[1]))
    after = len(folder_grants(p[2]))
    if before > after:
        direction = "narrowing"
    elif after > before:
        direction = "widening "
    else:
        direction = "sideways "
    print((p[0] + "   ")[0:3] + " " + direction + " (" + str(before) + " grants -> " + str(after) + ")")
print("")
checked = 0
passed = 0
checked = checked + 1
if total_over > 0:
    passed = passed + 1
checked = checked + 1
affected_users = 0
for u in USERS:
    over_u = 0
    for doc in moved_docs:
        for a in ACTIONS:
            if cached_allows(doc, u, a) == 1:
                if live_allows(doc, u, a) == 0:
                    over_u = over_u + 1
    if over_u > 0:
        affected_users = affected_users + 1
if affected_users >= 2:
    passed = passed + 1
checked = checked + 1
if after_write_over == 0:
    passed = passed + 1
checked = checked + 1
unstable = 0
for doc in moved_docs:
    for u in USERS:
        for a in ACTIONS:
            if not live_allows(doc, u, a) == live_allows(doc, u, a):
                unstable = unstable + 1
if unstable == 0:
    passed = passed + 1
checked = checked + 1
if total_over > 0:
    if total_under > 0:
        passed = passed + 1
checked = checked + 1
over_from_narrowing = 0
over_from_widening = 0
for p in PLAN:
    d0 = [p[0], p[1], p[1]]
    d = move(d0, p[2])
    over = 0
    for u in USERS:
        for a in ACTIONS:
            if cached_allows(d, u, a) == 1:
                if live_allows(d, u, a) == 0:
                    over = over + 1
    if len(folder_grants(p[1])) > len(folder_grants(p[2])):
        over_from_narrowing = over_from_narrowing + over
    else:
        over_from_widening = over_from_widening + over
if over_from_narrowing > over_from_widening:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The documents that were tidied away kept the grants of the folder they left."
else:
    verdict = "FAILED - the models did not behave as the checks describe."
print(verdict)
print("")
print("The cache is refreshed when the document is written, and the operation")
print("that invalidates it does not write the document - it writes the link.")
print("Every part of that sentence was chosen by someone who was right about")
print("their own part. What nobody owned was the question of which operations")
print("change an inherited answer, and a move is the only one that changes it")
print("without touching the thing that holds it.")
```

## stdout (executed)

```text
doc  from        to          disagreements  over-permissive  under
---- ----------- ----------- -------------  ---------------  -----
d1   public      restricted  4              4                0
d2   team        legal       6              4                2
d3   restricted  public      4              0                4
d4   legal       team        6              2                4

(user, action) pairs compared: 32
cache grants access the folder does not: 10
cache withholds access the folder grants: 10

who is affected, by name
ann   holds 3 grants the current folder does not give
bob   holds 3 grants the current folder does not give
cho   holds 3 grants the current folder does not give
dee   holds 1 grants the current folder does not give

the refresh, and what it is conditioned on
over-permissive grants remaining after one edit to each document: 0

the direction the moves point
d1  narrowing (5 grants -> 1)
d2  narrowing (4 grants -> 2)
d3  widening  (1 grants -> 5)
d4  widening  (2 grants -> 4)

checks passed: 6/6
The documents that were tidied away kept the grants of the folder they left.

The cache is refreshed when the document is written, and the operation
that invalidates it does not write the document - it writes the link.
Every part of that sentence was chosen by someone who was right about
their own part. What nobody owned was the question of which operations
change an inherited answer, and a move is the only one that changes it
without touching the thing that holds it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
