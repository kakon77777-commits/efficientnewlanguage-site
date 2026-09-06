<!-- canonical: efficientnewlanguage.org/ai/examples/724-the-permission-was-inherited-and-the-link-bypassed-the-parent | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 724 — The permission was inherited and the link bypassed the parent

`the_permission_was_inherited_and_the_link_bypassed_the_parent.eml` - Access is decided server-side by walking to the parent folder, with no client-side hiding, and a red team found no way past it. What that walk decides is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Access is decided
# server-side by walking to the parent folder, with no client-side hiding, and
# a red team found no way past it. What that walk decides is computed below.
#
# The authorisation is built correctly. There is one service that answers every
# access question, so there is no second implementation to drift; the decision
# is made on the server and the client is never trusted to hide anything; the
# folder is walked on every request rather than cached into a token; and a
# red-team engagement spent two weeks on it and found zero ways past the folder
# check.
#
# The walk answers "may this principal reach this object THROUGH this folder".
# A share link names the object directly, so the link is not a request the walk
# is asked about; the link is itself the grant.
#
# Thirty-one thousand objects were moved into a restricted folder this year.

2400000 => objects
1 => authorisation_services
0 => client_side_hiding
0 => red_team_bypasses_of_the_folder_check
14 => red_team_days
31000 => objects_moved_into_a_restricted_folder_this_year
4100 => those_that_already_had_a_direct_link
0 => links_revoked_by_the_move
0 => reconciliations_between_folder_acl_and_object_grants

objects_moved_into_a_restricted_folder_this_year - those_that_already_had_a_direct_link => moves_with_no_pre_existing_link
int(those_that_already_had_a_direct_link * 10000 / objects_moved_into_a_restricted_folder_this_year) => carried_a_link_per_myriad

"objects                         : " + str(objects) ^0
"authorisation services          : " + str(authorisation_services) ^0
"client-side hiding              : " + str(client_side_hiding) ^0
"red team days                   : " + str(red_team_days) ^0
"  bypasses of the folder check  : " + str(red_team_bypasses_of_the_folder_check) ^0
"" ^0
"objects moved into a restricted folder : " + str(objects_moved_into_a_restricted_folder_this_year) ^0
"  with no pre-existing link     : " + str(moves_with_no_pre_existing_link) ^0
"  that already had a direct link: " + str(those_that_already_had_a_direct_link) ^0
"  share                         : " + str(carried_a_link_per_myriad) + " per ten thousand" ^0
"links revoked by the move       : " + str(links_revoked_by_the_move) ^0
"reconciliations between the two : " + str(reconciliations_between_folder_acl_and_object_grants) ^0
"" ^0

# ---- what the check verified ----

"the authorisation" ^0
"  implementations : " + str(authorisation_services) + ", so there is nothing to drift" ^0
"  decided where   : the server" ^0
"  client-side hiding relied on : " + str(client_side_hiding) ^0
"  folder walked per request or cached into a token :" ^0
"    walked, every time" ^0
"  red team : " + str(red_team_days) + " days, " + str(red_team_bypasses_of_the_folder_check) + " bypasses" ^0
"  verdict : ENFORCED" ^0
"" ^0
"  one implementation walked fresh on every request is the" ^0
"  design that makes a red-team zero mean something" ^0
"" ^0

# ---- what the walk is asked ----

"the question the walk answers" ^0
"  form : may this principal reach this object through" ^0
"    this folder" ^0
"  what it consults : the chain of parents" ^0
"  what a share link is : a row naming the object" ^0
"  does the link resolution walk the parents : no; there is" ^0
"    nothing to walk, the grant names the object" ^0
"  is that a bypass of the check : no; it is a different" ^0
"    question, answered correctly by a different table" ^0
"" ^0
"  the folder is the thing everybody reasons about and the" ^0
"  object has grants of its own that nothing compares to it" ^0
"" ^0
# ---- what a move means ----

# Moving a document into the restricted folder is the action a person takes to
# restrict it, and it does restrict it, for everyone arriving the way the
# person is picturing.
"the move" ^0
"  what the person intends : this is now restricted" ^0
"  what changes            : the parent, and therefore" ^0
"    every answer the walk gives" ^0
"  who loses access        : everyone reaching it by" ^0
"    browsing" ^0
"  who does not            : everyone holding a link" ^0
"  links revoked by the move : " + str(links_revoked_by_the_move) ^0
"  is the person told      : no; the move succeeded" ^0
"" ^0

# ---- why the red team found nothing ----

# The engagement was scoped to the check, and the check has no holes. A link
# held by someone who was legitimately given it is not an attack; it is the
# feature working, against a folder that did not exist when it was issued.
"the engagement" ^0
"  scope : can the folder check be defeated" ^0
"  answer: no, in " + str(red_team_days) + " days" ^0
"  what a valid link is : not a defeat of the check" ^0
"  who holds the links : people who were given them, at a" ^0
"    time when giving them was correct" ^0
"  what changed since : the folder, not the link" ^0
"" ^0

# ---- the two tables ----

"where access lives" ^0
"  the folder ACL      : consulted on every walk" ^0
"  the object grants   : consulted when a link resolves" ^0
"  a query joining them: " + str(reconciliations_between_folder_acl_and_object_grants) ^0
"  which one an admin reviews : the folder, in the UI" ^0
"  where the object grants appear in that UI : on the" ^0
"    object, one at a time" ^0
"  objects : " + str(objects) ^0
"" ^0

# ---- null control ----

# The same authorisation, with a move re-evaluating every direct grant on the
# object against the new parent and revoking the ones it would not allow.
those_that_already_had_a_direct_link => nc_links_revoked_by_the_move
0 => nc_objects_reachable_by_a_link_the_new_parent_forbids

"null control - a move re-evaluates the object's own grants" ^0
"  red team bypasses : " + str(red_team_bypasses_of_the_folder_check) + ", unchanged" ^0
"  links revoked by the move : " + str(nc_links_revoked_by_the_move) ^0
"  objects reachable by a link the parent forbids : " + str(nc_objects_reachable_by_a_link_the_new_parent_forbids) ^0
"  the check did not get stricter; the action a person" ^0
"  takes to restrict something started reaching the second" ^0
"  way in" ^0
"" ^0

# ---- the rule ----

"what an inherited permission guarantees" ^0
"  nobody reaches this object through this folder without" ^0
"    the right : exactly, on every request, one" ^0
"    implementation, red-teamed" ^0
"  nobody reaches this object            : not addressed;" ^0
"    inheritance is a statement about a path, and an" ^0
"    object can be named without walking one" ^0
"" ^0
"a permission model computed by traversal is exactly as" ^0
"complete as the set of ways to arrive; a direct reference" ^0
"is not an attack on the traversal, it is a second door that" ^0
"the traversal was never asked about" ^0
"" ^0

"Access is decided by " + str(authorisation_services) + " server-side service that walks the parents on every" ^0
"request with " + str(client_side_hiding) + " reliance on client-side hiding, and " + str(red_team_days) + " red-team days found" ^0
str(red_team_bypasses_of_the_folder_check) + " bypasses. A share link names the object instead of walking to it, so of" ^0
str(objects_moved_into_a_restricted_folder_this_year) + " objects moved into a restricted folder this year, " + str(those_that_already_had_a_direct_link) + " - " + str(carried_a_link_per_myriad) + " per ten" ^0
"thousand - carried a link the move did not touch, with " + str(links_revoked_by_the_move) + " revoked and" ^0
str(reconciliations_between_folder_acl_and_object_grants) + " queries anywhere that compare the two tables." ^0
```

## Python (deterministic transpilation)

```python
objects = 2400000
authorisation_services = 1
client_side_hiding = 0
red_team_bypasses_of_the_folder_check = 0
red_team_days = 14
objects_moved_into_a_restricted_folder_this_year = 31000
those_that_already_had_a_direct_link = 4100
links_revoked_by_the_move = 0
reconciliations_between_folder_acl_and_object_grants = 0
moves_with_no_pre_existing_link = objects_moved_into_a_restricted_folder_this_year - those_that_already_had_a_direct_link
carried_a_link_per_myriad = int(those_that_already_had_a_direct_link * 10000 / objects_moved_into_a_restricted_folder_this_year)
print("objects                         : " + str(objects))
print("authorisation services          : " + str(authorisation_services))
print("client-side hiding              : " + str(client_side_hiding))
print("red team days                   : " + str(red_team_days))
print("  bypasses of the folder check  : " + str(red_team_bypasses_of_the_folder_check))
print("")
print("objects moved into a restricted folder : " + str(objects_moved_into_a_restricted_folder_this_year))
print("  with no pre-existing link     : " + str(moves_with_no_pre_existing_link))
print("  that already had a direct link: " + str(those_that_already_had_a_direct_link))
print("  share                         : " + str(carried_a_link_per_myriad) + " per ten thousand")
print("links revoked by the move       : " + str(links_revoked_by_the_move))
print("reconciliations between the two : " + str(reconciliations_between_folder_acl_and_object_grants))
print("")
print("the authorisation")
print("  implementations : " + str(authorisation_services) + ", so there is nothing to drift")
print("  decided where   : the server")
print("  client-side hiding relied on : " + str(client_side_hiding))
print("  folder walked per request or cached into a token :")
print("    walked, every time")
print("  red team : " + str(red_team_days) + " days, " + str(red_team_bypasses_of_the_folder_check) + " bypasses")
print("  verdict : ENFORCED")
print("")
print("  one implementation walked fresh on every request is the")
print("  design that makes a red-team zero mean something")
print("")
print("the question the walk answers")
print("  form : may this principal reach this object through")
print("    this folder")
print("  what it consults : the chain of parents")
print("  what a share link is : a row naming the object")
print("  does the link resolution walk the parents : no; there is")
print("    nothing to walk, the grant names the object")
print("  is that a bypass of the check : no; it is a different")
print("    question, answered correctly by a different table")
print("")
print("  the folder is the thing everybody reasons about and the")
print("  object has grants of its own that nothing compares to it")
print("")
print("the move")
print("  what the person intends : this is now restricted")
print("  what changes            : the parent, and therefore")
print("    every answer the walk gives")
print("  who loses access        : everyone reaching it by")
print("    browsing")
print("  who does not            : everyone holding a link")
print("  links revoked by the move : " + str(links_revoked_by_the_move))
print("  is the person told      : no; the move succeeded")
print("")
print("the engagement")
print("  scope : can the folder check be defeated")
print("  answer: no, in " + str(red_team_days) + " days")
print("  what a valid link is : not a defeat of the check")
print("  who holds the links : people who were given them, at a")
print("    time when giving them was correct")
print("  what changed since : the folder, not the link")
print("")
print("where access lives")
print("  the folder ACL      : consulted on every walk")
print("  the object grants   : consulted when a link resolves")
print("  a query joining them: " + str(reconciliations_between_folder_acl_and_object_grants))
print("  which one an admin reviews : the folder, in the UI")
print("  where the object grants appear in that UI : on the")
print("    object, one at a time")
print("  objects : " + str(objects))
print("")
nc_links_revoked_by_the_move = those_that_already_had_a_direct_link
nc_objects_reachable_by_a_link_the_new_parent_forbids = 0
print("null control - a move re-evaluates the object's own grants")
print("  red team bypasses : " + str(red_team_bypasses_of_the_folder_check) + ", unchanged")
print("  links revoked by the move : " + str(nc_links_revoked_by_the_move))
print("  objects reachable by a link the parent forbids : " + str(nc_objects_reachable_by_a_link_the_new_parent_forbids))
print("  the check did not get stricter; the action a person")
print("  takes to restrict something started reaching the second")
print("  way in")
print("")
print("what an inherited permission guarantees")
print("  nobody reaches this object through this folder without")
print("    the right : exactly, on every request, one")
print("    implementation, red-teamed")
print("  nobody reaches this object            : not addressed;")
print("    inheritance is a statement about a path, and an")
print("    object can be named without walking one")
print("")
print("a permission model computed by traversal is exactly as")
print("complete as the set of ways to arrive; a direct reference")
print("is not an attack on the traversal, it is a second door that")
print("the traversal was never asked about")
print("")
print("Access is decided by " + str(authorisation_services) + " server-side service that walks the parents on every")
print("request with " + str(client_side_hiding) + " reliance on client-side hiding, and " + str(red_team_days) + " red-team days found")
print(str(red_team_bypasses_of_the_folder_check) + " bypasses. A share link names the object instead of walking to it, so of")
print(str(objects_moved_into_a_restricted_folder_this_year) + " objects moved into a restricted folder this year, " + str(those_that_already_had_a_direct_link) + " - " + str(carried_a_link_per_myriad) + " per ten")
print("thousand - carried a link the move did not touch, with " + str(links_revoked_by_the_move) + " revoked and")
print(str(reconciliations_between_folder_acl_and_object_grants) + " queries anywhere that compare the two tables.")
```

## stdout (executed)

```text
objects                         : 2400000
authorisation services          : 1
client-side hiding              : 0
red team days                   : 14
  bypasses of the folder check  : 0

objects moved into a restricted folder : 31000
  with no pre-existing link     : 26900
  that already had a direct link: 4100
  share                         : 1322 per ten thousand
links revoked by the move       : 0
reconciliations between the two : 0

the authorisation
  implementations : 1, so there is nothing to drift
  decided where   : the server
  client-side hiding relied on : 0
  folder walked per request or cached into a token :
    walked, every time
  red team : 14 days, 0 bypasses
  verdict : ENFORCED

  one implementation walked fresh on every request is the
  design that makes a red-team zero mean something

the question the walk answers
  form : may this principal reach this object through
    this folder
  what it consults : the chain of parents
  what a share link is : a row naming the object
  does the link resolution walk the parents : no; there is
    nothing to walk, the grant names the object
  is that a bypass of the check : no; it is a different
    question, answered correctly by a different table

  the folder is the thing everybody reasons about and the
  object has grants of its own that nothing compares to it

the move
  what the person intends : this is now restricted
  what changes            : the parent, and therefore
    every answer the walk gives
  who loses access        : everyone reaching it by
    browsing
  who does not            : everyone holding a link
  links revoked by the move : 0
  is the person told      : no; the move succeeded

the engagement
  scope : can the folder check be defeated
  answer: no, in 14 days
  what a valid link is : not a defeat of the check
  who holds the links : people who were given them, at a
    time when giving them was correct
  what changed since : the folder, not the link

where access lives
  the folder ACL      : consulted on every walk
  the object grants   : consulted when a link resolves
  a query joining them: 0
  which one an admin reviews : the folder, in the UI
  where the object grants appear in that UI : on the
    object, one at a time
  objects : 2400000

null control - a move re-evaluates the object's own grants
  red team bypasses : 0, unchanged
  links revoked by the move : 4100
  objects reachable by a link the parent forbids : 0
  the check did not get stricter; the action a person
  takes to restrict something started reaching the second
  way in

what an inherited permission guarantees
  nobody reaches this object through this folder without
    the right : exactly, on every request, one
    implementation, red-teamed
  nobody reaches this object            : not addressed;
    inheritance is a statement about a path, and an
    object can be named without walking one

a permission model computed by traversal is exactly as
complete as the set of ways to arrive; a direct reference
is not an attack on the traversal, it is a second door that
the traversal was never asked about

Access is decided by 1 server-side service that walks the parents on every
request with 0 reliance on client-side hiding, and 14 red-team days found
0 bypasses. A share link names the object instead of walking to it, so of
31000 objects moved into a restricted folder this year, 4100 - 1322 per ten
thousand - carried a link the move did not touch, with 0 revoked and
0 queries anywhere that compare the two tables.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
