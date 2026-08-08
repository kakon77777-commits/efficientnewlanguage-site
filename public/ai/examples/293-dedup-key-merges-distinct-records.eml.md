<!-- canonical: efficientnewlanguage.org/ai/examples/293-dedup-key-merges-distinct-records | ai_layer_version: 0.1.0 | updated: 2026-08-08 -->

# Example 293 — Dedup key merges distinct records — both curves rose, and one was being watched

`dedup_key_merges_distinct_records.eml` sweeps four key definitions from strict to loose over seven records carrying ground-truth entity ids, and scores each key on duplicates joined, strangers joined, and duplicates missed.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A dedup key is a
# hypothesis about identity, and it is stored as a fact.
#
# Deduplication is done by projecting each record to a key and grouping on it.
# The key is deliberately lossy - that is what makes it find the duplicates
# that an exact match misses. Every character dropped from the key finds more
# duplicates and merges more strangers, and only one of those two numbers is
# on anybody's dashboard.
#
# The measurement sweeps four key definitions from strict to loose, and scores
# each against ground truth carried on the records: how many real duplicates were
# joined, and how many DISTINCT entities were joined. It then computes the
# pigeonhole bound - distinct keys available versus distinct entities present -
# which decides how much of the damage was inevitable before any data arrived.

def key_of(rec, level):
    # rec is [entity, first, last, postcode, email]. `entity` is ground truth
    # and no key is allowed to look at it.
    rec[1] => first
    rec[2] => last
    rec[3] => post
    rec[4] => mail
    if level == 0:
        return first + "|" + last + "|" + post + "|" + mail
    if level == 1:
        return first + "|" + last + "|" + post
    if level == 2:
        return first[0:1] + "|" + last + "|" + post[0:3]
    return first[0:1] + "|" + last[0:4] + "|" + post[0:2]

# entity, first, last, postcode, email. Two records share an entity when they
# are the same person; the file does not know that, the checks do.
[["e1", "Jing", "Wu", "94110", "jw@example.com"],
 ["e1", "Jing", "Wu", "94110-2481", "jing.wu@example.com"],
 ["e2", "Jian", "Wu", "94112", "jian@example.com"],
 ["e3", "Ana", "Diaz", "10001", "ana@example.com"],
 ["e3", "Ana", "Diaz", "10001", "adiaz@example.com"],
 ["e4", "Ana", "Diaz", "10001", "ana.d@example.com"],
 ["e5", "Sam", "Roy", "60614", "sam@example.com"]] => ROWS

def distinct_keys(level):
    [] => ks
    for r in ROWS:
        key_of(r, level) => k
        0 => seen
        for x in ks:
            if x == k:
                1 => seen
        if seen == 0:
            ks + [k] => ks
    return len(ks)

def distinct_entities():
    [] => es
    for r in ROWS:
        0 => seen
        for x in es:
            if x == r[0]:
                1 => seen
        if seen == 0:
            es + [r[0]] => es
    return len(es)

def score(level):
    # Every pair of rows, scored against ground truth. Returns
    # [true_joins, false_joins, missed_joins].
    0 => tp
    0 => fp
    0 => fn
    0 => i
    while i < len(ROWS):
        i + 1 => j
        while j < len(ROWS):
            ROWS[i] => a
            ROWS[j] => b
            0 => same_key
            if key_of(a, level) == key_of(b, level):
                1 => same_key
            0 => same_entity
            if a[0] == b[0]:
                1 => same_entity
            if same_key == 1:
                if same_entity == 1:
                    tp + 1 => tp
                else:
                    fp + 1 => fp
            else:
                if same_entity == 1:
                    fn + 1 => fn
            j + 1 => j
        i + 1 => i
    return [tp, fp, fn]

"level  keys  duplicates-joined  strangers-joined  duplicates-missed"^0
"-----  ----  -----------------  ----------------  -----------------"^0
[] => rows_out
for level in [0, 1, 2, 3]:
    score(level) => s
    rows_out + [s] => rows_out
    ((str(level) + "      ")[0:7] + (str(distinct_keys(level)) + "     ")[0:6] + (str(s[0]) + "                   ")[0:19] + (str(s[1]) + "                  ")[0:18] + str(s[2]))^0

""^0
("distinct entities present: " + str(distinct_entities()))^0

""^0
"the monotone half"^0

# The number on the dashboard is "duplicates joined". Check whether it can
# ever go down as the key loosens - if it cannot, tuning the key is a
# one-way ratchet and the only feedback the operator gets is applause.
0 => dupes_ever_fell
0 => strangers_ever_fell
0 => level
while level < 3:
    if rows_out[level + 1][0] < rows_out[level][0]:
        dupes_ever_fell + 1 => dupes_ever_fell
    if rows_out[level + 1][1] < rows_out[level][1]:
        strangers_ever_fell + 1 => strangers_ever_fell
    level + 1 => level
("loosenings where duplicates-joined fell: " + str(dupes_ever_fell))^0
("loosenings where strangers-joined fell: " + str(strangers_ever_fell))^0

""^0
"the pigeonhole floor"^0

# Before any record is examined: if the key space the data actually occupies
# is smaller than the number of entities, some entities MUST share a key. This
# is not a data-quality problem and no amount of cleaning fixes it.
for level in [0, 1, 2, 3]:
    distinct_keys(level) => k
    distinct_entities() => e
    if k < e:
        e - k => forced
        ("level " + str(level) + ": " + str(k) + " keys for " + str(e) + " entities -> at least " + str(forced) + " entities forced to share")^0
    else:
        ("level " + str(level) + ": " + str(k) + " keys for " + str(e) + " entities -> no collision forced")^0

""^0
"who gets merged with whom at the loosest level"^0
0 => i
while i < len(ROWS):
    i + 1 => j
    while j < len(ROWS):
        ROWS[i] => a
        ROWS[j] => b
        if key_of(a, 3) == key_of(b, 3):
            if not (a[0] == b[0]):
                ("  " + a[1] + " " + a[2] + " (" + a[0] + ") + " + b[1] + " " + b[2] + " (" + b[0] + ")  key=" + key_of(a, 3))^0
        j + 1 => j
    i + 1 => i

""^0
0 => checked
0 => passed

# The strictest key must miss real duplicates - that is why anyone loosens it.
checked + 1 => checked
if rows_out[0][2] > 0:
    passed + 1 => passed

# The strictest key must also join no strangers, so looseness is the only
# thing introducing them.
checked + 1 => checked
if rows_out[0][1] == 0:
    passed + 1 => passed

# The loosest key must join strangers.
checked + 1 => checked
if rows_out[3][1] > 0:
    passed + 1 => passed

# Duplicates-joined must never fall as the key loosens. The visible metric is
# a ratchet, which is why tuning always looks like progress.
checked + 1 => checked
if dupes_ever_fell == 0:
    passed + 1 => passed

# Strangers-joined must never fall either. Both curves are monotone; only one
# is measured in production.
checked + 1 => checked
if strangers_ever_fell == 0:
    passed + 1 => passed

# Loosening must genuinely help - more duplicates found at level 3 than at 0 -
# or the case would just be arguing against a bad key.
checked + 1 => checked
if rows_out[3][0] > rows_out[0][0]:
    passed + 1 => passed

# And at some level the pigeonhole must bite: fewer keys than entities, so
# a merge is forced by the key's shape rather than by the data.
checked + 1 => checked
0 => forced_levels
for level in [0, 1, 2, 3]:
    if distinct_keys(level) < distinct_entities():
        forced_levels + 1 => forced_levels
if forced_levels > 0:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Both curves rose together, and only one of them was being watched." => verdict
else:
    "FAILED - the keys did not behave as the checks describe." => verdict
verdict^0

""^0
"A key is a claim that two records with the same projection are the same"^0
"thing. It is checkable - against ground truth, on a sample, once - and"^0
"almost never checked, because the output of a dedup job is a smaller file"^0
"and a smaller file is the thing that was wanted. The records that vanish"^0
"are not reported anywhere, and the ones that vanish wrongly are exactly"^0
"the ones who look most like somebody else."^0
```

## Python (deterministic transpilation)

```python
def key_of(rec, level):
    first = rec[1]
    last = rec[2]
    post = rec[3]
    mail = rec[4]
    if level == 0:
        return first + "|" + last + "|" + post + "|" + mail
    if level == 1:
        return first + "|" + last + "|" + post
    if level == 2:
        return first[0:1] + "|" + last + "|" + post[0:3]
    return first[0:1] + "|" + last[0:4] + "|" + post[0:2]

ROWS = [["e1", "Jing", "Wu", "94110", "jw@example.com"], ["e1", "Jing", "Wu", "94110-2481", "jing.wu@example.com"], ["e2", "Jian", "Wu", "94112", "jian@example.com"], ["e3", "Ana", "Diaz", "10001", "ana@example.com"], ["e3", "Ana", "Diaz", "10001", "adiaz@example.com"], ["e4", "Ana", "Diaz", "10001", "ana.d@example.com"], ["e5", "Sam", "Roy", "60614", "sam@example.com"]]

def distinct_keys(level):
    ks = []
    for r in ROWS:
        k = key_of(r, level)
        seen = 0
        for x in ks:
            if x == k:
                seen = 1
        if seen == 0:
            ks = ks + [k]
    return len(ks)

def distinct_entities():
    es = []
    for r in ROWS:
        seen = 0
        for x in es:
            if x == r[0]:
                seen = 1
        if seen == 0:
            es = es + [r[0]]
    return len(es)

def score(level):
    tp = 0
    fp = 0
    fn = 0
    i = 0
    while i < len(ROWS):
        j = i + 1
        while j < len(ROWS):
            a = ROWS[i]
            b = ROWS[j]
            same_key = 0
            if key_of(a, level) == key_of(b, level):
                same_key = 1
            same_entity = 0
            if a[0] == b[0]:
                same_entity = 1
            if same_key == 1:
                if same_entity == 1:
                    tp = tp + 1
                else:
                    fp = fp + 1
            elif same_entity == 1:
                fn = fn + 1
            j = j + 1
        i = i + 1
    return [tp, fp, fn]

print("level  keys  duplicates-joined  strangers-joined  duplicates-missed")
print("-----  ----  -----------------  ----------------  -----------------")
rows_out = []
for level in [0, 1, 2, 3]:
    s = score(level)
    rows_out = rows_out + [s]
    print((str(level) + "      ")[0:7] + (str(distinct_keys(level)) + "     ")[0:6] + (str(s[0]) + "                   ")[0:19] + (str(s[1]) + "                  ")[0:18] + str(s[2]))
print("")
print("distinct entities present: " + str(distinct_entities()))
print("")
print("the monotone half")
dupes_ever_fell = 0
strangers_ever_fell = 0
level = 0
while level < 3:
    if rows_out[level + 1][0] < rows_out[level][0]:
        dupes_ever_fell = dupes_ever_fell + 1
    if rows_out[level + 1][1] < rows_out[level][1]:
        strangers_ever_fell = strangers_ever_fell + 1
    level = level + 1
print("loosenings where duplicates-joined fell: " + str(dupes_ever_fell))
print("loosenings where strangers-joined fell: " + str(strangers_ever_fell))
print("")
print("the pigeonhole floor")
for level in [0, 1, 2, 3]:
    k = distinct_keys(level)
    e = distinct_entities()
    if k < e:
        forced = e - k
        print("level " + str(level) + ": " + str(k) + " keys for " + str(e) + " entities -> at least " + str(forced) + " entities forced to share")
    else:
        print("level " + str(level) + ": " + str(k) + " keys for " + str(e) + " entities -> no collision forced")
print("")
print("who gets merged with whom at the loosest level")
i = 0
while i < len(ROWS):
    j = i + 1
    while j < len(ROWS):
        a = ROWS[i]
        b = ROWS[j]
        if key_of(a, 3) == key_of(b, 3):
            if not a[0] == b[0]:
                print("  " + a[1] + " " + a[2] + " (" + a[0] + ") + " + b[1] + " " + b[2] + " (" + b[0] + ")  key=" + key_of(a, 3))
        j = j + 1
    i = i + 1
print("")
checked = 0
passed = 0
checked = checked + 1
if rows_out[0][2] > 0:
    passed = passed + 1
checked = checked + 1
if rows_out[0][1] == 0:
    passed = passed + 1
checked = checked + 1
if rows_out[3][1] > 0:
    passed = passed + 1
checked = checked + 1
if dupes_ever_fell == 0:
    passed = passed + 1
checked = checked + 1
if strangers_ever_fell == 0:
    passed = passed + 1
checked = checked + 1
if rows_out[3][0] > rows_out[0][0]:
    passed = passed + 1
checked = checked + 1
forced_levels = 0
for level in [0, 1, 2, 3]:
    if distinct_keys(level) < distinct_entities():
        forced_levels = forced_levels + 1
if forced_levels > 0:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Both curves rose together, and only one of them was being watched."
else:
    verdict = "FAILED - the keys did not behave as the checks describe."
print(verdict)
print("")
print("A key is a claim that two records with the same projection are the same")
print("thing. It is checkable - against ground truth, on a sample, once - and")
print("almost never checked, because the output of a dedup job is a smaller file")
print("and a smaller file is the thing that was wanted. The records that vanish")
print("are not reported anywhere, and the ones that vanish wrongly are exactly")
print("the ones who look most like somebody else.")
```

## stdout (executed)

```text
level  keys  duplicates-joined  strangers-joined  duplicates-missed
-----  ----  -----------------  ----------------  -----------------
0      7     0                  0                 2
1      5     1                  2                 1
2      3     2                  4                 0
3      3     2                  4                 0

distinct entities present: 5

the monotone half
loosenings where duplicates-joined fell: 0
loosenings where strangers-joined fell: 0

the pigeonhole floor
level 0: 7 keys for 5 entities -> no collision forced
level 1: 5 keys for 5 entities -> no collision forced
level 2: 3 keys for 5 entities -> at least 2 entities forced to share
level 3: 3 keys for 5 entities -> at least 2 entities forced to share

who gets merged with whom at the loosest level
  Jing Wu (e1) + Jian Wu (e2)  key=J|Wu|94
  Jing Wu (e1) + Jian Wu (e2)  key=J|Wu|94
  Ana Diaz (e3) + Ana Diaz (e4)  key=A|Diaz|10
  Ana Diaz (e3) + Ana Diaz (e4)  key=A|Diaz|10

checks passed: 7/7
Both curves rose together, and only one of them was being watched.

A key is a claim that two records with the same projection are the same
thing. It is checkable - against ground truth, on a sample, once - and
almost never checked, because the output of a dedup job is a smaller file
and a smaller file is the thing that was wanted. The records that vanish
are not reported anywhere, and the ones that vanish wrongly are exactly
the ones who look most like somebody else.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
