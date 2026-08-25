<!-- canonical: efficientnewlanguage.org/ai/examples/547-the-limit-was-per-key-and-the-caller-chose-the-key | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 547 — The limit was per key and the caller chose the key

`the_limit_was_per_key_and_the_caller_chose_the_key.eml` - The rate limiter allows 100 requests a minute per client, and it has never allowed a bucket to exceed 100. What it allowed in total is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The rate limiter
# allows 100 requests a minute per client, and it has never allowed a bucket to
# exceed 100. What it allowed in total is computed below.
#
# Limiting per client rather than in total is the right design. A single global
# limit means one heavy caller starves everyone else, and that is the failure
# the per-key limiter was built to prevent. It prevents it. Every bucket is
# under its limit, on every minute, and that is not a rounding of the truth.
#
# The key comes from a header the caller sends, which is also reasonable on its
# face: it is the only identifier available before authentication runs, it lets
# one account separate its own workloads, and partners asked for exactly that
# so their batch jobs would not throttle their interactive traffic.
#
# A limit is only a limit if the thing being counted is outside the counted
# party's control. When the caller chooses the key, the caller chooses how many
# buckets to be, and the limiter enforces every one of them perfectly.

100 => per_key_limit
60 => bucket_ttl_minutes

# [client, distinct keys presented, requests sent per minute]
[["web app", 1, 90], ["mobile app", 1, 100], ["partner batch", 1, 340], ["indexing bot", 40, 4000]] => clients

def allowed_by_key(c):
    c[1] * per_key_limit => cap
    if c[2] < cap:
        return c[2]
    return cap

def allowed_by_account(c):
    if c[2] < per_key_limit:
        return c[2]
    return per_key_limit

("limit : %s requests per minute per key" % str(per_key_limit))^0
"key   : the X-Client-Id header, chosen by the caller" ^0
"" ^0

"client           keys   sent    allowed   rejected   buckets over limit" ^0
0 => sent_total
0 => allowed_total
0 => keys_total
for c in clients:
    allowed_by_key(c) => allowed
    sent_total + c[2] => sent_total
    allowed_total + allowed => allowed_total
    keys_total + c[1] => keys_total
    ("  %-16s %-6s %-7s %-9s %-10s %s" % (c[0], str(c[1]), str(c[2]), str(allowed), str(c[2] - allowed), "0"))^0
"" ^0

("  requests sent     : %s per minute" % str(sent_total))^0
("  requests allowed  : %s per minute" % str(allowed_total))^0
("  buckets over their limit : 0, on every minute since the limiter shipped" )^0
"" ^0

# ---- what one client took ----

clients[3] => bot
("the largest caller" )^0
("  keys presented        : %s" % str(bot[1]))^0
("  effective limit       : %s per minute" % str(bot[1] * per_key_limit))^0
("  times the stated limit : %s" % str(bot[1]))^0
("  share of all allowed traffic : %s percent" % str(int(allowed_by_key(bot) * 100 / allowed_total)))^0
"  it is one of four clients and it is not breaking any rule the limiter" ^0
"  is able to express" ^0
"" ^0

# ---- the control ----
#
# The same four clients, the same limiter, the same limit. The key is derived
# from the authenticated account instead of from the request.

0 => acct_allowed
for c in clients:
    acct_allowed + allowed_by_account(c) => acct_allowed

"control - the same limiter keyed on the authenticated account" ^0
"client           sent    allowed   rejected" ^0
for c in clients:
    allowed_by_account(c) => allowed
    ("  %-16s %-7s %-9s %s" % (c[0], str(c[2]), str(allowed), str(c[2] - allowed)))^0
("  requests allowed : %s, against %s" % (str(acct_allowed), str(allowed_total)))^0
("  difference       : %s per minute" % str(allowed_total - acct_allowed))^0
"  the limiter code is not edited, only where the key comes from" ^0
"" ^0

# ---- the control that made it invisible ----

"control - the three clients that present one key" ^0
0 => honest_sent
0 => honest_allowed
for c in clients:
    if c[1] == 1:
        honest_sent + c[2] => honest_sent
        honest_allowed + allowed_by_key(c) => honest_allowed
("  sent    : %s" % str(honest_sent))^0
("  allowed : %s" % str(honest_allowed))^0
("  the partner batch is throttled from %s to %s, correctly" % (str(clients[2][2]), str(allowed_by_key(clients[2]))))^0
"  the limiter is exactly right for every caller that does not rotate" ^0
"  which is every caller anyone tested it with" ^0
"" ^0

# ---- the second cost ----

bot[1] * bucket_ttl_minutes => live_buckets
"what the keys cost besides the limit" ^0
("  new keys per minute from one client : %s" % str(bot[1]))^0
("  bucket lifetime                     : %s minutes" % str(bucket_ttl_minutes))^0
("  live buckets from that client       : %s" % str(live_buckets))^0
("  live buckets from the other three   : %s" % str(len(clients) - 1))^0
"  the table is keyed by a value the caller invents, so its size is also" ^0
"  chosen by the caller" ^0
"" ^0

# ---- what the limiter can and cannot see ----

"what the limiter measures" ^0
"  requests per key      : correct, always" ^0
"  keys per account      : not measured, no such counter" ^0
"  requests per account  : not measured, the account is resolved later" ^0
"  the quantity the limit is meant to bound is the one with no counter" ^0
"" ^0

"Per-key limiting stops one caller starving the rest, and no bucket has ever" ^0
("exceeded %s. The key is a header the caller sends, so the caller chooses how" % str(per_key_limit))^0
("many buckets to be: %s keys buy %s requests a minute, and keying on the" % (str(bot[1]), str(allowed_by_key(bot))))^0
("account instead allows %s across all four clients rather than %s." % (str(acct_allowed), str(allowed_total)))^0
```

## Python (deterministic transpilation)

```python
per_key_limit = 100
bucket_ttl_minutes = 60
clients = [["web app", 1, 90], ["mobile app", 1, 100], ["partner batch", 1, 340], ["indexing bot", 40, 4000]]

def allowed_by_key(c):
    cap = c[1] * per_key_limit
    if c[2] < cap:
        return c[2]
    return cap

def allowed_by_account(c):
    if c[2] < per_key_limit:
        return c[2]
    return per_key_limit

print("limit : %s requests per minute per key" % str(per_key_limit))
print("key   : the X-Client-Id header, chosen by the caller")
print("")
print("client           keys   sent    allowed   rejected   buckets over limit")
sent_total = 0
allowed_total = 0
keys_total = 0
for c in clients:
    allowed = allowed_by_key(c)
    sent_total = sent_total + c[2]
    allowed_total = allowed_total + allowed
    keys_total = keys_total + c[1]
    print("  %-16s %-6s %-7s %-9s %-10s %s" % (c[0], str(c[1]), str(c[2]), str(allowed), str(c[2] - allowed), "0"))
print("")
print("  requests sent     : %s per minute" % str(sent_total))
print("  requests allowed  : %s per minute" % str(allowed_total))
print("  buckets over their limit : 0, on every minute since the limiter shipped")
print("")
bot = clients[3]
print("the largest caller")
print("  keys presented        : %s" % str(bot[1]))
print("  effective limit       : %s per minute" % str(bot[1] * per_key_limit))
print("  times the stated limit : %s" % str(bot[1]))
print("  share of all allowed traffic : %s percent" % str(int(allowed_by_key(bot) * 100 / allowed_total)))
print("  it is one of four clients and it is not breaking any rule the limiter")
print("  is able to express")
print("")
acct_allowed = 0
for c in clients:
    acct_allowed = acct_allowed + allowed_by_account(c)
print("control - the same limiter keyed on the authenticated account")
print("client           sent    allowed   rejected")
for c in clients:
    allowed = allowed_by_account(c)
    print("  %-16s %-7s %-9s %s" % (c[0], str(c[2]), str(allowed), str(c[2] - allowed)))
print("  requests allowed : %s, against %s" % (str(acct_allowed), str(allowed_total)))
print("  difference       : %s per minute" % str(allowed_total - acct_allowed))
print("  the limiter code is not edited, only where the key comes from")
print("")
print("control - the three clients that present one key")
honest_sent = 0
honest_allowed = 0
for c in clients:
    if c[1] == 1:
        honest_sent = honest_sent + c[2]
        honest_allowed = honest_allowed + allowed_by_key(c)
print("  sent    : %s" % str(honest_sent))
print("  allowed : %s" % str(honest_allowed))
print("  the partner batch is throttled from %s to %s, correctly" % (str(clients[2][2]), str(allowed_by_key(clients[2]))))
print("  the limiter is exactly right for every caller that does not rotate")
print("  which is every caller anyone tested it with")
print("")
live_buckets = bot[1] * bucket_ttl_minutes
print("what the keys cost besides the limit")
print("  new keys per minute from one client : %s" % str(bot[1]))
print("  bucket lifetime                     : %s minutes" % str(bucket_ttl_minutes))
print("  live buckets from that client       : %s" % str(live_buckets))
print("  live buckets from the other three   : %s" % str(len(clients) - 1))
print("  the table is keyed by a value the caller invents, so its size is also")
print("  chosen by the caller")
print("")
print("what the limiter measures")
print("  requests per key      : correct, always")
print("  keys per account      : not measured, no such counter")
print("  requests per account  : not measured, the account is resolved later")
print("  the quantity the limit is meant to bound is the one with no counter")
print("")
print("Per-key limiting stops one caller starving the rest, and no bucket has ever")
print("exceeded %s. The key is a header the caller sends, so the caller chooses how" % str(per_key_limit))
print("many buckets to be: %s keys buy %s requests a minute, and keying on the" % (str(bot[1]), str(allowed_by_key(bot))))
print("account instead allows %s across all four clients rather than %s." % (str(acct_allowed), str(allowed_total)))
```

## stdout (executed)

```text
limit : 100 requests per minute per key
key   : the X-Client-Id header, chosen by the caller

client           keys   sent    allowed   rejected   buckets over limit
  web app          1      90      90        0          0
  mobile app       1      100     100       0          0
  partner batch    1      340     100       240        0
  indexing bot     40     4000    4000      0          0

  requests sent     : 4530 per minute
  requests allowed  : 4290 per minute
  buckets over their limit : 0, on every minute since the limiter shipped

the largest caller
  keys presented        : 40
  effective limit       : 4000 per minute
  times the stated limit : 40
  share of all allowed traffic : 93 percent
  it is one of four clients and it is not breaking any rule the limiter
  is able to express

control - the same limiter keyed on the authenticated account
client           sent    allowed   rejected
  web app          90      90        0
  mobile app       100     100       0
  partner batch    340     100       240
  indexing bot     4000    100       3900
  requests allowed : 390, against 4290
  difference       : 3900 per minute
  the limiter code is not edited, only where the key comes from

control - the three clients that present one key
  sent    : 530
  allowed : 290
  the partner batch is throttled from 340 to 100, correctly
  the limiter is exactly right for every caller that does not rotate
  which is every caller anyone tested it with

what the keys cost besides the limit
  new keys per minute from one client : 40
  bucket lifetime                     : 60 minutes
  live buckets from that client       : 2400
  live buckets from the other three   : 3
  the table is keyed by a value the caller invents, so its size is also
  chosen by the caller

what the limiter measures
  requests per key      : correct, always
  keys per account      : not measured, no such counter
  requests per account  : not measured, the account is resolved later
  the quantity the limit is meant to bound is the one with no counter

Per-key limiting stops one caller starving the rest, and no bucket has ever
exceeded 100. The key is a header the caller sends, so the caller chooses how
many buckets to be: 40 keys buy 4000 requests a minute, and keying on the
account instead allows 390 across all four clients rather than 4290.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
