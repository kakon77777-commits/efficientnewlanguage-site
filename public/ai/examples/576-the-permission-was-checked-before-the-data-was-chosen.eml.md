<!-- canonical: efficientnewlanguage.org/ai/examples/576-the-permission-was-checked-before-the-data-was-chosen | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 576 — The permission was checked before the data was chosen

`the_permission_was_checked_before_the_data_was_chosen.eml` - A search returns the ten highest-scoring documents a user is allowed to see. The user reports that the page is nearly empty. How many results each ordering produces is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A search returns
# the ten highest-scoring documents a user is allowed to see. The user reports
# that the page is nearly empty. How many results each ordering produces is
# computed below.
#
# Filtering after the query is a deliberate and defensible design. The
# permission rule is not expressible in the search index: it depends on group
# membership, on a per-document ACL, and on a delegation table that lives in a
# different service. Pushing it into the index would mean replicating three
# sources of truth into the search cluster and reindexing every document
# whenever anyone changes teams. Applying it in the application layer keeps one
# copy of the rule, in the service that owns it, and it cannot go stale.
#
# The index returns the top ten by score. The application then removes the ones
# the user cannot see. The ten it removes from are the ten highest-scoring
# documents in the corpus, not the ten highest-scoring documents the user can
# see, and the second set is what was asked for.
#
# The two orderings agree only when the user can see everything.

10000 => documents
1200 => visible_to_user
10 => page_size

"documents in the corpus      : " + str(documents) ^0
"this user may see            : " + str(visible_to_user) + ", which is " + str(int(visible_to_user * 100 / documents)) + " percent" ^0
"page size                    : " + str(page_size) ^0
"" ^0

# ---- the ordering that ships ----

int(page_size * visible_to_user / documents) => returned_wrong

"rank, then filter" ^0
"  documents fetched by score : " + str(page_size) ^0
"  of those, visible to user  : " + str(returned_wrong) ^0
"  results on the page        : " + str(returned_wrong) ^0
"" ^0

# ---- the ordering that was asked for ----

"filter, then rank" ^0
"  documents in scope         : " + str(visible_to_user) ^0
"  taken by score             : " + str(page_size) ^0
"  results on the page        : " + str(page_size) ^0
"" ^0

"  same corpus, same scores, same permission rule" ^0
"  " + str(returned_wrong) + " results against " + str(page_size) ^0
"" ^0

# ---- how deep the wrong ordering must go ----
#
# To fill one page it must fetch until it has found page_size visible
# documents. In expectation that is page_size divided by the visible fraction.

int(page_size * documents / visible_to_user) => depth_needed

"to fill a single page of " + str(page_size) ^0
"  ranks that must be fetched : " + str(depth_needed) ^0
"  ranks actually fetched     : " + str(page_size) ^0
"  short by                   : " + str(depth_needed - page_size) + " ranks" ^0
"" ^0

# ---- what the pages look like ----

"page   ranks fetched   visible on it   running total" ^0
0 => running
for pg in [1:5]:
    pg * page_size => fetched
    int(fetched * visible_to_user / documents) => cumulative_visible
    cumulative_visible - running => on_this_page
    cumulative_visible => running
    "  " + str(pg) + "      " + str(fetched - page_size + 1) + " to " + str(fetched) + "         " + str(on_this_page) + "               " + str(running) ^0
"" ^0
"  after " + str(5 * page_size) + " ranks the user has seen " + str(running) + " of the " + str(page_size) + " they asked for" ^0
"" ^0

# ---- which results are lost ----
#
# The filter removes by permission, and permission is unrelated to score. So
# what survives is a UNIFORM sample of the global top ten - the rank-1 document
# is dropped with the same probability as the rank-10 one. The loss is not that
# the best results are removed; it is that the window was never the right
# window, and the best document this user can see is not in it.

"which documents the user does not get" ^0
"  removal is by permission, which is uncorrelated with score" ^0
"  so the rank-1 document is removed with the same " + str(100 - int(visible_to_user * 100 / documents)) + " percent chance as any" ^0
"  other, and the survivors are a uniform sample of the global top " + str(page_size) ^0
"  the user does not get the best " + str(returned_wrong) + " document they can see" ^0
"  they get whichever of the global top " + str(page_size) + " they happen to be allowed," ^0
"  and the best document they CAN see may be at rank " + str(depth_needed) + " or beyond" ^0
"  so the page is not 'the best " + str(returned_wrong) + " they can see'" ^0
"  it is 'whichever of the global top " + str(page_size) + " they can see', which is a" ^0
"  different and much smaller set" ^0
"" ^0

# ---- the control ----
#
# The permission rule itself. Under both orderings exactly the same documents
# are permitted and exactly the same are refused. Nothing leaks and nothing is
# wrongly allowed - the security property holds perfectly, which is why the
# security review passed and why nobody looked again.

"control - does either ordering leak a document" ^0
"  documents shown that the user may not see, rank-then-filter : 0" ^0
"  documents shown that the user may not see, filter-then-rank : 0" ^0
"  the two orderings are identical on the property that was reviewed" ^0
"  they differ only on the property nobody stated: completeness" ^0
"" ^0
"  a filter is correct if it removes exactly the right things" ^0
"  a filter applied at the wrong point is still correct by that definition" ^0
"" ^0

# ---- the null control ----
#
# The same code against a user who can see everything. Both orderings return
# ten. Every test written by a developer with full access is this case.

documents => admin_visible
int(page_size * admin_visible / documents) => admin_returned

"null control - the same code for a user who may see everything" ^0
"  visible to user      : " + str(admin_visible) + " of " + str(documents) ^0
"  rank-then-filter     : " + str(admin_returned) + " results" ^0
"  filter-then-rank     : " + str(page_size) + " results" ^0
"  difference           : " + str(page_size - admin_returned) ^0
"  identical output, and the developer account is this account" ^0
"" ^0

# ---- how the shortfall scales ----

"visible share   results on a page of " + str(page_size) ^0
[100, 50, 25, 12, 5, 1] => shares
for sh in shares:
    int(page_size * sh / 100) => got
    "  " + str(sh) + " percent          " + str(got) ^0
"" ^0
"  the page empties smoothly, so there is no threshold at which it breaks" ^0
"  the most restricted users see the fewest results and are the least likely" ^0
"  to be the ones testing it" ^0
"" ^0

"Keeping the permission rule in the service that owns it is right: the rule" ^0
"reads three sources that the search index does not hold, and pushing it into" ^0
"the index would mean reindexing every document whenever anyone changes teams." ^0
"Applying it after the ranking rather than before turns 'the best " + str(page_size) + " you can" ^0
"see' into 'whichever of the global best " + str(page_size) + " you can see', which for this user" ^0
"is " + str(returned_wrong) + " results, and filling one page would take " + str(depth_needed) + " ranks." ^0
```

## Python (deterministic transpilation)

```python
documents = 10000
visible_to_user = 1200
page_size = 10
print("documents in the corpus      : " + str(documents))
print("this user may see            : " + str(visible_to_user) + ", which is " + str(int(visible_to_user * 100 / documents)) + " percent")
print("page size                    : " + str(page_size))
print("")
returned_wrong = int(page_size * visible_to_user / documents)
print("rank, then filter")
print("  documents fetched by score : " + str(page_size))
print("  of those, visible to user  : " + str(returned_wrong))
print("  results on the page        : " + str(returned_wrong))
print("")
print("filter, then rank")
print("  documents in scope         : " + str(visible_to_user))
print("  taken by score             : " + str(page_size))
print("  results on the page        : " + str(page_size))
print("")
print("  same corpus, same scores, same permission rule")
print("  " + str(returned_wrong) + " results against " + str(page_size))
print("")
depth_needed = int(page_size * documents / visible_to_user)
print("to fill a single page of " + str(page_size))
print("  ranks that must be fetched : " + str(depth_needed))
print("  ranks actually fetched     : " + str(page_size))
print("  short by                   : " + str(depth_needed - page_size) + " ranks")
print("")
print("page   ranks fetched   visible on it   running total")
running = 0
for pg in range(1, 6):
    fetched = pg * page_size
    cumulative_visible = int(fetched * visible_to_user / documents)
    on_this_page = cumulative_visible - running
    running = cumulative_visible
    print("  " + str(pg) + "      " + str(fetched - page_size + 1) + " to " + str(fetched) + "         " + str(on_this_page) + "               " + str(running))
print("")
print("  after " + str(5 * page_size) + " ranks the user has seen " + str(running) + " of the " + str(page_size) + " they asked for")
print("")
print("which documents the user does not get")
print("  removal is by permission, which is uncorrelated with score")
print("  so the rank-1 document is removed with the same " + str(100 - int(visible_to_user * 100 / documents)) + " percent chance as any")
print("  other, and the survivors are a uniform sample of the global top " + str(page_size))
print("  the user does not get the best " + str(returned_wrong) + " document they can see")
print("  they get whichever of the global top " + str(page_size) + " they happen to be allowed,")
print("  and the best document they CAN see may be at rank " + str(depth_needed) + " or beyond")
print("  so the page is not 'the best " + str(returned_wrong) + " they can see'")
print("  it is 'whichever of the global top " + str(page_size) + " they can see', which is a")
print("  different and much smaller set")
print("")
print("control - does either ordering leak a document")
print("  documents shown that the user may not see, rank-then-filter : 0")
print("  documents shown that the user may not see, filter-then-rank : 0")
print("  the two orderings are identical on the property that was reviewed")
print("  they differ only on the property nobody stated: completeness")
print("")
print("  a filter is correct if it removes exactly the right things")
print("  a filter applied at the wrong point is still correct by that definition")
print("")
admin_visible = documents
admin_returned = int(page_size * admin_visible / documents)
print("null control - the same code for a user who may see everything")
print("  visible to user      : " + str(admin_visible) + " of " + str(documents))
print("  rank-then-filter     : " + str(admin_returned) + " results")
print("  filter-then-rank     : " + str(page_size) + " results")
print("  difference           : " + str(page_size - admin_returned))
print("  identical output, and the developer account is this account")
print("")
print("visible share   results on a page of " + str(page_size))
shares = [100, 50, 25, 12, 5, 1]
for sh in shares:
    got = int(page_size * sh / 100)
    print("  " + str(sh) + " percent          " + str(got))
print("")
print("  the page empties smoothly, so there is no threshold at which it breaks")
print("  the most restricted users see the fewest results and are the least likely")
print("  to be the ones testing it")
print("")
print("Keeping the permission rule in the service that owns it is right: the rule")
print("reads three sources that the search index does not hold, and pushing it into")
print("the index would mean reindexing every document whenever anyone changes teams.")
print("Applying it after the ranking rather than before turns 'the best " + str(page_size) + " you can")
print("see' into 'whichever of the global best " + str(page_size) + " you can see', which for this user")
print("is " + str(returned_wrong) + " results, and filling one page would take " + str(depth_needed) + " ranks.")
```

## stdout (executed)

```text
documents in the corpus      : 10000
this user may see            : 1200, which is 12 percent
page size                    : 10

rank, then filter
  documents fetched by score : 10
  of those, visible to user  : 1
  results on the page        : 1

filter, then rank
  documents in scope         : 1200
  taken by score             : 10
  results on the page        : 10

  same corpus, same scores, same permission rule
  1 results against 10

to fill a single page of 10
  ranks that must be fetched : 83
  ranks actually fetched     : 10
  short by                   : 73 ranks

page   ranks fetched   visible on it   running total
  1      1 to 10         1               1
  2      11 to 20         1               2
  3      21 to 30         1               3
  4      31 to 40         1               4
  5      41 to 50         2               6

  after 50 ranks the user has seen 6 of the 10 they asked for

which documents the user does not get
  removal is by permission, which is uncorrelated with score
  so the rank-1 document is removed with the same 88 percent chance as any
  other, and the survivors are a uniform sample of the global top 10
  the user does not get the best 1 document they can see
  they get whichever of the global top 10 they happen to be allowed,
  and the best document they CAN see may be at rank 83 or beyond
  so the page is not 'the best 1 they can see'
  it is 'whichever of the global top 10 they can see', which is a
  different and much smaller set

control - does either ordering leak a document
  documents shown that the user may not see, rank-then-filter : 0
  documents shown that the user may not see, filter-then-rank : 0
  the two orderings are identical on the property that was reviewed
  they differ only on the property nobody stated: completeness

  a filter is correct if it removes exactly the right things
  a filter applied at the wrong point is still correct by that definition

null control - the same code for a user who may see everything
  visible to user      : 10000 of 10000
  rank-then-filter     : 10 results
  filter-then-rank     : 10 results
  difference           : 0
  identical output, and the developer account is this account

visible share   results on a page of 10
  100 percent          10
  50 percent          5
  25 percent          2
  12 percent          1
  5 percent          0
  1 percent          0

  the page empties smoothly, so there is no threshold at which it breaks
  the most restricted users see the fewest results and are the least likely
  to be the ones testing it

Keeping the permission rule in the service that owns it is right: the rule
reads three sources that the search index does not hold, and pushing it into
the index would mean reindexing every document whenever anyone changes teams.
Applying it after the ranking rather than before turns 'the best 10 you can
see' into 'whichever of the global best 10 you can see', which for this user
is 1 results, and filling one page would take 83 ranks.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
