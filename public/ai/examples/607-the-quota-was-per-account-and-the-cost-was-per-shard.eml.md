<!-- canonical: efficientnewlanguage.org/ai/examples/607-the-quota-was-per-account-and-the-cost-was-per-shard | ai_layer_version: 0.1.0 | updated: 2026-08-29 -->

# Example 607 — The quota was per account and the cost was per shard

`the_quota_was_per_account_and_the_cost_was_per_shard.eml` - A shared cluster limits each account to a thousand queries an hour. No account has ever exceeded it. What a query costs the cluster is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A shared cluster
# limits each account to a thousand queries an hour. No account has ever
# exceeded it. What a query costs the cluster is computed below.
#
# Counting queries per account is the right shape for a fairness limit and it
# was chosen for good reasons. It is the unit the customer understands, the
# unit the contract is written in, and the only unit that can be counted at the
# edge without asking the storage layer anything. A limit that needs a round
# trip to evaluate is a limit that fails when the thing it protects is already
# in trouble.
#
# A query is a request for an answer. The work is done by whichever shards hold
# the rows, and how many that is depends on the query, not on the account.
#
# The counter is exact. It counts a thing that is not the thing being spent.

1000 => quota_per_hour
200000 => cluster_shard_queries_per_hour
1 => fanout_narrow
64 => fanout_wide

"quota, per account per hour   : " + str(quota_per_hour) + " queries" ^0
"cluster capacity              : " + str(cluster_shard_queries_per_hour) + " shard-queries per hour" ^0
"" ^0

# ---- two accounts, both exactly at their limit ----

quota_per_hour * fanout_narrow => narrow_cost
quota_per_hour * fanout_wide => wide_cost
int(wide_cost / narrow_cost) => cost_ratio

"account   queries   fanout   shard-queries   quota used" ^0
"  A         " + str(quota_per_hour) + "      " + str(fanout_narrow) + "        " + str(narrow_cost) + "           100 percent" ^0
"  B         " + str(quota_per_hour) + "      " + str(fanout_wide) + "       " + str(wide_cost) + "          100 percent" ^0
"" ^0
"  identical quota consumption" ^0
"  cost ratio : " + str(cost_ratio) + " to 1" ^0
"" ^0

# ---- how many compliant accounts the cluster can hold ----

int(cluster_shard_queries_per_hour / narrow_cost) => narrow_accounts_supported
int(cluster_shard_queries_per_hour * 100 / wide_cost) => wide_accounts_hundredths

# In hundredths, because B's figure is 3.125 and a whole-number column would
# print 3. Dividing 200 by that 3 gives 66, next to a cost ratio of 64 in the
# same output, and the 2 is truncation rather than anything about the cluster.
# The ratio below is taken from the costs, which are exact, not from two
# rounded account counts.

"accounts the cluster can serve, all of them fully compliant" ^0
"  if every account looks like A : " + str(narrow_accounts_supported) ^0
"  if every account looks like B : " + str(int(wide_accounts_hundredths / 100)) + " point " + str(wide_accounts_hundredths % 100) ^0
"" ^0
"  the limit does not change between those two rows" ^0
"  the number of customers the cluster can hold changes by " + str(cost_ratio) + " times," ^0
"  which is the cost ratio, because the capacity is the same capacity" ^0
"" ^0

# ---- the point where the cluster saturates with zero violations ----

"accounts   fanout   shard-queries   capacity   violations" ^0
for a in [1:4]:
    a * wide_cost => used
    "  " + str(a) + "          " + str(fanout_wide) + "       " + str(used) + "          " + str(cluster_shard_queries_per_hour) + "     0" ^0
"" ^0
"  the violations column is the one the quota system reports" ^0
"  and it is correct at every row" ^0
"" ^0

# ---- what each party can see ----

"what the quota counter can observe" ^0
"  queries issued by an account : yes, exactly" ^0
"  shards each query touched    : no, that is decided downstream" ^0
"  cost of a query              : not represented in its unit" ^0
"" ^0
"what the storage layer can observe" ^0
"  shard-queries served         : yes, exactly" ^0
"  which account they belong to : yes" ^0
"  whether that account is over : it has no limit to compare against" ^0
"" ^0
"  both halves are measured, in two places, in two units," ^0
"  and no line anywhere divides one by the other" ^0
"" ^0

# ---- the control ----
#
# The quota system, against what it was asked to enforce. It was asked to stop
# any account exceeding a thousand queries an hour, and it has done so for
# every account without exception or bypass.

"control - is the quota system working" ^0
"  accounts over their query limit : 0" ^0
"  limit evaluations needing a round trip : 0" ^0
"  false rejections : 0" ^0
"  defects in the counter : 0" ^0
"" ^0
"  the counter is exact and cheap, which is why it was chosen" ^0
"" ^0

# ---- the null control ----
#
# The same limit, same counter, same accounts, in a cluster where every query
# touches one shard. Now one query is one unit of work, the quota unit and the
# cost unit are the same unit, and the counter is a cost limit.

"null control - the same quota where fanout is always " + str(fanout_narrow) ^0
"  account A cost : " + str(narrow_cost) + " shard-queries" ^0
"  account B cost : " + str(narrow_cost) + " shard-queries" ^0
"  ratio          : 1 to 1" ^0
"  accounts supported : " + str(narrow_accounts_supported) + ", exactly" ^0
"  same counter, same threshold, same enforcement" ^0
"  the limit became a cost limit without being edited" ^0
"" ^0

# ---- the rule ----

"a limit expressed in a unit that is not the scarce one" ^0
"  is enforceable         : yes, and cheaply" ^0
"  is fair between equals : yes, by its own unit" ^0
"  bounds the resource    : only if the two units are proportional" ^0
"  and nothing measures that proportion" ^0
"" ^0
"the missing number is not a threshold, it is a conversion:" ^0
"what one unit of the limit costs, and how much that varies" ^0
"" ^0

"The quota is exact, cheap to evaluate at the edge, and " + str(0) + " accounts have" ^0
"ever exceeded it. Two accounts both sitting at " + str(quota_per_hour) + " queries an hour spend" ^0
str(narrow_cost) + " and " + str(wide_cost) + " shard-queries respectively, a ratio of " + str(cost_ratio) + " to 1, so a cluster" ^0
"sized at " + str(cluster_shard_queries_per_hour) + " shard-queries holds " + str(narrow_accounts_supported) + " of the first kind and " + str(int(wide_accounts_hundredths / 100)) + " point " + str(wide_accounts_hundredths % 100) + " of the" ^0
"second, with the violation count reading 0 in both cases." ^0
```

## Python (deterministic transpilation)

```python
quota_per_hour = 1000
cluster_shard_queries_per_hour = 200000
fanout_narrow = 1
fanout_wide = 64
print("quota, per account per hour   : " + str(quota_per_hour) + " queries")
print("cluster capacity              : " + str(cluster_shard_queries_per_hour) + " shard-queries per hour")
print("")
narrow_cost = quota_per_hour * fanout_narrow
wide_cost = quota_per_hour * fanout_wide
cost_ratio = int(wide_cost / narrow_cost)
print("account   queries   fanout   shard-queries   quota used")
print("  A         " + str(quota_per_hour) + "      " + str(fanout_narrow) + "        " + str(narrow_cost) + "           100 percent")
print("  B         " + str(quota_per_hour) + "      " + str(fanout_wide) + "       " + str(wide_cost) + "          100 percent")
print("")
print("  identical quota consumption")
print("  cost ratio : " + str(cost_ratio) + " to 1")
print("")
narrow_accounts_supported = int(cluster_shard_queries_per_hour / narrow_cost)
wide_accounts_hundredths = int(cluster_shard_queries_per_hour * 100 / wide_cost)
print("accounts the cluster can serve, all of them fully compliant")
print("  if every account looks like A : " + str(narrow_accounts_supported))
print("  if every account looks like B : " + str(int(wide_accounts_hundredths / 100)) + " point " + str(wide_accounts_hundredths % 100))
print("")
print("  the limit does not change between those two rows")
print("  the number of customers the cluster can hold changes by " + str(cost_ratio) + " times,")
print("  which is the cost ratio, because the capacity is the same capacity")
print("")
print("accounts   fanout   shard-queries   capacity   violations")
for a in range(1, 5):
    used = a * wide_cost
    print("  " + str(a) + "          " + str(fanout_wide) + "       " + str(used) + "          " + str(cluster_shard_queries_per_hour) + "     0")
print("")
print("  the violations column is the one the quota system reports")
print("  and it is correct at every row")
print("")
print("what the quota counter can observe")
print("  queries issued by an account : yes, exactly")
print("  shards each query touched    : no, that is decided downstream")
print("  cost of a query              : not represented in its unit")
print("")
print("what the storage layer can observe")
print("  shard-queries served         : yes, exactly")
print("  which account they belong to : yes")
print("  whether that account is over : it has no limit to compare against")
print("")
print("  both halves are measured, in two places, in two units,")
print("  and no line anywhere divides one by the other")
print("")
print("control - is the quota system working")
print("  accounts over their query limit : 0")
print("  limit evaluations needing a round trip : 0")
print("  false rejections : 0")
print("  defects in the counter : 0")
print("")
print("  the counter is exact and cheap, which is why it was chosen")
print("")
print("null control - the same quota where fanout is always " + str(fanout_narrow))
print("  account A cost : " + str(narrow_cost) + " shard-queries")
print("  account B cost : " + str(narrow_cost) + " shard-queries")
print("  ratio          : 1 to 1")
print("  accounts supported : " + str(narrow_accounts_supported) + ", exactly")
print("  same counter, same threshold, same enforcement")
print("  the limit became a cost limit without being edited")
print("")
print("a limit expressed in a unit that is not the scarce one")
print("  is enforceable         : yes, and cheaply")
print("  is fair between equals : yes, by its own unit")
print("  bounds the resource    : only if the two units are proportional")
print("  and nothing measures that proportion")
print("")
print("the missing number is not a threshold, it is a conversion:")
print("what one unit of the limit costs, and how much that varies")
print("")
print("The quota is exact, cheap to evaluate at the edge, and " + str(0) + " accounts have")
print("ever exceeded it. Two accounts both sitting at " + str(quota_per_hour) + " queries an hour spend")
print(str(narrow_cost) + " and " + str(wide_cost) + " shard-queries respectively, a ratio of " + str(cost_ratio) + " to 1, so a cluster")
print("sized at " + str(cluster_shard_queries_per_hour) + " shard-queries holds " + str(narrow_accounts_supported) + " of the first kind and " + str(int(wide_accounts_hundredths / 100)) + " point " + str(wide_accounts_hundredths % 100) + " of the")
print("second, with the violation count reading 0 in both cases.")
```

## stdout (executed)

```text
quota, per account per hour   : 1000 queries
cluster capacity              : 200000 shard-queries per hour

account   queries   fanout   shard-queries   quota used
  A         1000      1        1000           100 percent
  B         1000      64       64000          100 percent

  identical quota consumption
  cost ratio : 64 to 1

accounts the cluster can serve, all of them fully compliant
  if every account looks like A : 200
  if every account looks like B : 3 point 12

  the limit does not change between those two rows
  the number of customers the cluster can hold changes by 64 times,
  which is the cost ratio, because the capacity is the same capacity

accounts   fanout   shard-queries   capacity   violations
  1          64       64000          200000     0
  2          64       128000          200000     0
  3          64       192000          200000     0
  4          64       256000          200000     0

  the violations column is the one the quota system reports
  and it is correct at every row

what the quota counter can observe
  queries issued by an account : yes, exactly
  shards each query touched    : no, that is decided downstream
  cost of a query              : not represented in its unit

what the storage layer can observe
  shard-queries served         : yes, exactly
  which account they belong to : yes
  whether that account is over : it has no limit to compare against

  both halves are measured, in two places, in two units,
  and no line anywhere divides one by the other

control - is the quota system working
  accounts over their query limit : 0
  limit evaluations needing a round trip : 0
  false rejections : 0
  defects in the counter : 0

  the counter is exact and cheap, which is why it was chosen

null control - the same quota where fanout is always 1
  account A cost : 1000 shard-queries
  account B cost : 1000 shard-queries
  ratio          : 1 to 1
  accounts supported : 200, exactly
  same counter, same threshold, same enforcement
  the limit became a cost limit without being edited

a limit expressed in a unit that is not the scarce one
  is enforceable         : yes, and cheaply
  is fair between equals : yes, by its own unit
  bounds the resource    : only if the two units are proportional
  and nothing measures that proportion

the missing number is not a threshold, it is a conversion:
what one unit of the limit costs, and how much that varies

The quota is exact, cheap to evaluate at the edge, and 0 accounts have
ever exceeded it. Two accounts both sitting at 1000 queries an hour spend
1000 and 64000 shard-queries respectively, a ratio of 64 to 1, so a cluster
sized at 200000 shard-queries holds 200 of the first kind and 3 point 12 of the
second, with the violation count reading 0 in both cases.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
