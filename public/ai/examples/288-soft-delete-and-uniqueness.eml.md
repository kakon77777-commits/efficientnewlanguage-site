<!-- canonical: efficientnewlanguage.org/ai/examples/288-soft-delete-and-uniqueness | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 288 — Soft delete and uniqueness — the row is gone and the address is taken

`soft_delete_and_uniqueness.eml` runs sign-ups, deletions and re-sign-ups against four schemes and counts two errors separately: registrations **wrongly refused**, and duplicate **active** accounts wrongly allowed.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The account was
# deleted, and the address is still taken.
#
# A soft delete marks a row rather than removing it, so history survives and
# foreign keys keep resolving. Every constraint on the table, however, is still
# a constraint on ALL the rows - and a unique index on `email` does not know
# that `deleted_at IS NOT NULL` means "this row is not really here".
#
# The result is a rule that no longer says what it was written to say:
#
#     intended    at most one ACTIVE account per address
#     enforced    at most one account per address, ever
#
# Three repairs are common and each one gives something up:
#
#     partial index    unique among active rows only - correct, and it lets
#                      the same address exist twice in history
#     null the field   the deleted row keeps its identity and loses the
#                      address, so the audit trail is now wrong
#     compound key     unique on (email, deleted_at) - works until two
#                      deletions land in the same instant
#
# The measurement runs a sequence of sign-ups, deletions and re-sign-ups
# against all four schemes and counts two errors separately: registrations
# WRONGLY REFUSED, and duplicate ACTIVE accounts wrongly allowed. A scheme with
# zero of both is enforcing the intended rule; anything else is enforcing a
# different one.

def key_for(scheme, email, deleted_at):
    # The value the unique index actually compares. `nulled` is not listed
    # here on purpose: it does not change the key at all, it changes the ROW.
    # The first version of this file implemented nulling as a key
    # transformation, which made it look identical to the compound key and
    # kept the history it is supposed to destroy - the check for lost history
    # is what caught that the model was wrong rather than the scheme.
    if scheme == "partial":
        if deleted_at > 0:
            return ""
        return email
    if scheme == "compound":
        return email + "@" + str(deleted_at)
    return email

def run(scheme, ops):
    # rows are [email, deleted_at]; deleted_at 0 means active.
    [] => rows
    0 => refused
    0 => t
    for op in ops:
        t + 1 => t
        op[0] => kind
        op[1] => email
        if kind == "signup":
            key_for(scheme, email, 0) => k
            0 => clash
            for r in rows:
                if len(k) > 0 and key_for(scheme, r[0], r[1]) == k:
                    1 => clash
            if clash == 1:
                refused + 1 => refused
            else:
                rows + [[email, 0]] => rows
        else:
            [] => next_rows
            0 => done
            for r in rows:
                if done == 0 and r[0] == email and r[1] == 0:
                    1 => done
                    # Nulling overwrites the address on the row itself. That
                    # is what frees the key, and what loses the history.
                    r[0] => kept
                    if scheme == "nulled":
                        "" => kept
                    next_rows + [[kept, t]] => next_rows
                else:
                    next_rows + [r] => next_rows
            next_rows => rows
    return [rows, refused]

def active_dupes(rows):
    0 => dupes
    for i in [0:len(rows) - 1]:
        for j in [i + 1:len(rows) - 1]:
            if rows[i][1] == 0 and rows[j][1] == 0 and rows[i][0] == rows[j][0]:
                dupes + 1 => dupes
    return dupes

def history_intact(rows, email):
    # A deleted row must still carry the address it was deleted with, or the
    # audit trail cannot answer "who held this address".
    0 => c
    for r in rows:
        if r[1] > 0 and r[0] == email:
            c + 1 => c
    return c


["naive", "partial", "nulled", "compound"] => SCHEMES

[
    ["signup", "ana@x"],
    ["signup", "bo@x"],
    ["delete", "ana@x"],
    ["signup", "ana@x"],
    ["delete", "ana@x"],
    ["signup", "ana@x"],
    ["signup", "ana@x"]
] => ops

"scheme      wrongly refused   duplicate active   deleted rows keeping ana@x"^0
{} => res
for scheme in SCHEMES:
    run(scheme, ops) => r
    r[0] => rows
    r[1] => refused
    active_dupes(rows) => dupes
    history_intact(rows, "ana@x") => hist
    [refused, dupes, hist, len(rows)] => res[scheme]
    ("%-11s %-17d %-18d %d" % (scheme, refused, dupes, hist))^0

""^0
("operations: " + str(len(ops)))^0
"the intended rule: at most one ACTIVE account per address."^0
"the last two operations are a legitimate re-signup and a genuine duplicate,"^0
"so a correct scheme refuses exactly one of them."^0

# --------------------------------------- what each scheme actually enforces
""^0
"what the unique index compares, for ana@x:"^0
for scheme in SCHEMES:
    ("  %-11s active -> %-14s deleted at 3 -> %s" % (scheme, "'" + key_for(scheme, "ana@x", 0) + "'", "'" + key_for(scheme, "ana@x", 3) + "'"))^0

# ------------------------------------- where compound keys stop working
""^0
"two accounts deleted in the SAME instant, under the compound key:"^0
0 => collide
key_for("compound", "cy@x", 5) => k1
key_for("compound", "cy@x", 5) => k2
if k1 == k2:
    1 => collide
("  key for a row deleted at 5: '" + k1 + "'")^0
("  key for another row deleted at 5: '" + k2 + "'")^0
("  identical: " + str(collide == 1))^0
"...so under a unique index the SECOND DELETION is what fails, which is a"^0
"failure in the audit path rather than in the signup path."^0

# --------------------------------- the naive scheme looks fine until a delete
""^0
[["signup", "dee@x"], ["signup", "eli@x"], ["signup", "dee@x"]] => no_deletes
0 => same_on_clean
for scheme in SCHEMES:
    run(scheme, no_deletes) => r
    if r[1] == 1 and active_dupes(r[0]) == 0:
        same_on_clean + 1 => same_on_clean
("with no deletions anywhere, schemes behaving identically: " + str(same_on_clean) + "/" + str(len(SCHEMES)))^0
"...which is every test that does not delete something and try again."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The naive scheme must wrongly refuse a legitimate re-signup.
checked + 1 => checked
if res["naive"][0] > 1:
    passed + 1 => passed

# The partial index must refuse exactly the one genuine duplicate and nothing
# else - it is the scheme that enforces the intended rule.
checked + 1 => checked
if res["partial"][0] == 1 and res["partial"][1] == 0:
    passed + 1 => passed

# No scheme may permit two active accounts on one address. That is the part
# every scheme still gets right, and it is why the failure looks like an
# over-strict constraint rather than a broken one.
checked + 1 => checked
0 => no_dupes
for scheme in SCHEMES:
    if res[scheme][1] == 0:
        no_dupes + 1 => no_dupes
if no_dupes == len(SCHEMES):
    passed + 1 => passed

# Nulling the field must lose the address from history while the others keep
# it - the cost that is invisible until someone asks who held it.
checked + 1 => checked
if res["nulled"][2] == 0 and res["partial"][2] > 0:
    passed + 1 => passed

# Two rows deleted in the same instant must produce IDENTICAL compound keys.
# The compound scheme trades one collision for another and moves it to a path
# nobody tests.
checked + 1 => checked
if collide == 1:
    passed + 1 => passed

# And with no deletions at all, every scheme must behave identically.
checked + 1 => checked
if same_on_clean == len(SCHEMES):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The row is gone from the product and still present to the constraint." => verdict
else:
    "FAILED - a scheme did not behave as the checks describe." => verdict
verdict^0

""^0
"A soft delete changes what a row MEANS without changing what it IS, and" => n1
n1^0
"every constraint was written against what it is. So the deletion is a" => n2
n2^0
"decision made in the application and the uniqueness is a decision made in" => n3
n3^0
"the schema, and nothing forces them to be the same decision - which is" => n4
n4^0
"only visible after something is deleted and someone comes back." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def key_for(scheme, email, deleted_at):
    if scheme == "partial":
        if deleted_at > 0:
            return ""
        return email
    if scheme == "compound":
        return email + "@" + str(deleted_at)
    return email

def run(scheme, ops):
    rows = []
    refused = 0
    t = 0
    for op in ops:
        t = t + 1
        kind = op[0]
        email = op[1]
        if kind == "signup":
            k = key_for(scheme, email, 0)
            clash = 0
            for r in rows:
                if len(k) > 0 and key_for(scheme, r[0], r[1]) == k:
                    clash = 1
            if clash == 1:
                refused = refused + 1
            else:
                rows = rows + [[email, 0]]
        else:
            next_rows = []
            done = 0
            for r in rows:
                if done == 0 and r[0] == email and r[1] == 0:
                    done = 1
                    kept = r[0]
                    if scheme == "nulled":
                        kept = ""
                    next_rows = next_rows + [[kept, t]]
                else:
                    next_rows = next_rows + [r]
            rows = next_rows
    return [rows, refused]

def active_dupes(rows):
    dupes = 0
    for i in range(0, len(rows)):
        for j in range(i + 1, len(rows)):
            if rows[i][1] == 0 and rows[j][1] == 0 and rows[i][0] == rows[j][0]:
                dupes = dupes + 1
    return dupes

def history_intact(rows, email):
    c = 0
    for r in rows:
        if r[1] > 0 and r[0] == email:
            c = c + 1
    return c

SCHEMES = ["naive", "partial", "nulled", "compound"]
ops = [["signup", "ana@x"], ["signup", "bo@x"], ["delete", "ana@x"], ["signup", "ana@x"], ["delete", "ana@x"], ["signup", "ana@x"], ["signup", "ana@x"]]
print("scheme      wrongly refused   duplicate active   deleted rows keeping ana@x")
res = {}
for scheme in SCHEMES:
    r = run(scheme, ops)
    rows = r[0]
    refused = r[1]
    dupes = active_dupes(rows)
    hist = history_intact(rows, "ana@x")
    res[scheme] = [refused, dupes, hist, len(rows)]
    print("%-11s %-17d %-18d %d" % (scheme, refused, dupes, hist))
print("")
print("operations: " + str(len(ops)))
print("the intended rule: at most one ACTIVE account per address.")
print("the last two operations are a legitimate re-signup and a genuine duplicate,")
print("so a correct scheme refuses exactly one of them.")
print("")
print("what the unique index compares, for ana@x:")
for scheme in SCHEMES:
    print("  %-11s active -> %-14s deleted at 3 -> %s" % (scheme, "'" + key_for(scheme, "ana@x", 0) + "'", "'" + key_for(scheme, "ana@x", 3) + "'"))
print("")
print("two accounts deleted in the SAME instant, under the compound key:")
collide = 0
k1 = key_for("compound", "cy@x", 5)
k2 = key_for("compound", "cy@x", 5)
if k1 == k2:
    collide = 1
print("  key for a row deleted at 5: '" + k1 + "'")
print("  key for another row deleted at 5: '" + k2 + "'")
print("  identical: " + str(collide == 1))
print("...so under a unique index the SECOND DELETION is what fails, which is a")
print("failure in the audit path rather than in the signup path.")
print("")
no_deletes = [["signup", "dee@x"], ["signup", "eli@x"], ["signup", "dee@x"]]
same_on_clean = 0
for scheme in SCHEMES:
    r = run(scheme, no_deletes)
    if r[1] == 1 and active_dupes(r[0]) == 0:
        same_on_clean = same_on_clean + 1
print("with no deletions anywhere, schemes behaving identically: " + str(same_on_clean) + "/" + str(len(SCHEMES)))
print("...which is every test that does not delete something and try again.")
passed = 0
checked = 0
checked = checked + 1
if res["naive"][0] > 1:
    passed = passed + 1
checked = checked + 1
if res["partial"][0] == 1 and res["partial"][1] == 0:
    passed = passed + 1
checked = checked + 1
no_dupes = 0
for scheme in SCHEMES:
    if res[scheme][1] == 0:
        no_dupes = no_dupes + 1
if no_dupes == len(SCHEMES):
    passed = passed + 1
checked = checked + 1
if res["nulled"][2] == 0 and res["partial"][2] > 0:
    passed = passed + 1
checked = checked + 1
if collide == 1:
    passed = passed + 1
checked = checked + 1
if same_on_clean == len(SCHEMES):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The row is gone from the product and still present to the constraint."
else:
    verdict = "FAILED - a scheme did not behave as the checks describe."
print(verdict)
print("")
n1 = "A soft delete changes what a row MEANS without changing what it IS, and"
print(n1)
n2 = "every constraint was written against what it is. So the deletion is a"
print(n2)
n3 = "decision made in the application and the uniqueness is a decision made in"
print(n3)
n4 = "the schema, and nothing forces them to be the same decision - which is"
print(n4)
n5 = "only visible after something is deleted and someone comes back."
print(n5)
```

## stdout (executed)

```text
scheme      wrongly refused   duplicate active   deleted rows keeping ana@x
naive       3                 0                  1
partial     1                 0                  2
nulled      1                 0                  0
compound    1                 0                  2

operations: 7
the intended rule: at most one ACTIVE account per address.
the last two operations are a legitimate re-signup and a genuine duplicate,
so a correct scheme refuses exactly one of them.

what the unique index compares, for ana@x:
  naive       active -> 'ana@x'        deleted at 3 -> 'ana@x'
  partial     active -> 'ana@x'        deleted at 3 -> ''
  nulled      active -> 'ana@x'        deleted at 3 -> 'ana@x'
  compound    active -> 'ana@x@0'      deleted at 3 -> 'ana@x@3'

two accounts deleted in the SAME instant, under the compound key:
  key for a row deleted at 5: 'cy@x@5'
  key for another row deleted at 5: 'cy@x@5'
  identical: True
...so under a unique index the SECOND DELETION is what fails, which is a
failure in the audit path rather than in the signup path.

with no deletions anywhere, schemes behaving identically: 4/4
...which is every test that does not delete something and try again.

checks passed: 6/6
The row is gone from the product and still present to the constraint.

A soft delete changes what a row MEANS without changing what it IS, and
every constraint was written against what it is. So the deletion is a
decision made in the application and the uniqueness is a decision made in
the schema, and nothing forces them to be the same decision - which is
only visible after something is deleted and someone comes back.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
