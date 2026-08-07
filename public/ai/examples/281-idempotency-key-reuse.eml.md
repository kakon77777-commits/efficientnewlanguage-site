<!-- canonical: efficientnewlanguage.org/ai/examples/281-idempotency-key-reuse | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 281 — Idempotency key reuse — the key says retry and the body says otherwise

`idempotency_key_reuse.eml` runs a request log containing genuine retries, key reuse with a changed body, and unrelated requests through three policies, and counts three outcomes separately.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The same
# idempotency key with a different body, which is not a retry.
#
# An idempotency key makes a retry safe: send the same request twice, the
# second one returns the first one's result instead of doing the work again.
# The whole mechanism rests on an assumption that is never checked -
#
#     same key  =>  same request
#
# - and clients break it constantly. A key generated once per checkout session
# and reused after the user edits the cart. A key derived from an order id
# while the amount changes. A key reused after a client-side retry that also
# rebuilt the payload. In every case the server is handed one key and two
# different requests, and it has to decide what that means.
#
# Three policies, all shipped by real systems:
#
#     replay      return the stored result - fast, and the caller receives
#                 the answer to a question it did not ask
#     reject      409 on a body mismatch - correct, and it requires storing
#                 the request as well as the response
#     execute     treat a different body as a different request - safe for
#                 the caller and abandons idempotency entirely
#
# The measurement runs a request log containing genuine retries, key reuse
# with a changed body, and unrelated requests, and counts three outcomes
# separately: work done twice, a caller told the wrong amount, and a genuine
# retry that was NOT suppressed. No policy scores zero on all three.

def run(policy, reqs):
    # Returns [charges, wrong_answers, retries_missed, rejects].
    {} => stored_body
    {} => stored_result
    0 => charges
    0 => wrong
    0 => missed
    0 => rejects
    for r in reqs:
        r[0] => key
        r[1] => amount
        r[2] => kind
        if key in stored_body:
            stored_body[key] => prev
            if prev == amount:
                # A genuine retry under any policy: replay the stored result.
                if not (stored_result[key] == amount):
                    wrong + 1 => wrong
            else:
                if policy == "replay":
                    # The caller asked about `amount` and is told about `prev`.
                    wrong + 1 => wrong
                elif policy == "reject":
                    rejects + 1 => rejects
                else:
                    charges + 1 => charges
                    amount => stored_body[key]
                    amount => stored_result[key]
        else:
            charges + 1 => charges
            amount => stored_body[key]
            amount => stored_result[key]
            if kind == "retry":
                missed + 1 => missed
    return [charges, wrong, missed, rejects]


# key, amount, what the request actually is.
[
    ["k1", 100, "new"],
    ["k1", 100, "retry"],
    ["k2", 250, "new"],
    ["k2", 250, "retry"],
    ["k2", 400, "reused-key-changed-body"],
    ["k3", 90, "new"],
    ["k1", 100, "retry"],
    ["k4", 500, "new"]
] => reqs

0 => genuine_new
0 => genuine_retry
0 => reused
for r in reqs:
    if r[2] == "new":
        genuine_new + 1 => genuine_new
    elif r[2] == "retry":
        genuine_retry + 1 => genuine_retry
    else:
        reused + 1 => reused

"policy    charges   wrong answers   retries not suppressed   rejected"^0
{} => res
for policy in ["replay", "reject", "execute"]:
    run(policy, reqs) => r
    r => res[policy]
    ("%-9s %-9d %-15d %-24d %d" % (policy, r[0], r[1], r[2], r[3]))^0

""^0
("requests: " + str(len(reqs)) + " (" + str(genuine_new) + " new, " + str(genuine_retry) + " genuine retries, " + str(reused) + " key reused with a changed body)")^0
("distinct real operations, so the correct charge count is: " + str(genuine_new + reused))^0

# ------------------------------ what each policy gets wrong, named
""^0
"the cost each policy pays:"^0
for policy in ["replay", "reject", "execute"]:
    res[policy] => r
    "" => cost
    if r[1] > 0:
        "answers a question the caller did not ask" => cost
    elif r[3] > 0:
        "needs the REQUEST stored, not just the response" => cost
    else:
        "charges twice for one key - idempotency abandoned" => cost
    ("  %-9s %s" % (policy, cost))^0

# ----------------------- every policy is identical on well-behaved traffic
""^0
[
    ["a1", 100, "new"],
    ["a1", 100, "retry"],
    ["a2", 250, "new"],
    ["a2", 250, "retry"],
    ["a3", 90, "new"]
] => clean
{} => clean_res
for policy in ["replay", "reject", "execute"]:
    run(policy, clean) => r
    1 => clean_res[str(r[0]) + "/" + str(r[1]) + "/" + str(r[2]) + "/" + str(r[3])]
("with no key ever reused for a different body, distinct behaviours: " + str(len(clean_res)))^0
"...which is every client that generates a key correctly, and every test."^0

# ------------------------ the amount the caller is told, under replay
""^0
"a caller sending 400 on a key that already carries 250:"^0
("  replay tells it:  250   (the stored result)")^0
("  reject tells it:  an error")^0
("  execute tells it: 400   (and charges again)")^0
"...only one of those three is a lie, and it is the fast one."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Replay must return a wrong answer at least once - that is its cost.
checked + 1 => checked
if res["replay"][1] > 0:
    passed + 1 => passed

# Reject must return no wrong answers and must reject at least once.
checked + 1 => checked
if res["reject"][1] == 0 and res["reject"][3] > 0:
    passed + 1 => passed

# Execute must charge more than the others - it does the work every time the
# body differs, which is exactly what idempotency was for.
checked + 1 => checked
if res["execute"][0] > res["replay"][0] and res["execute"][0] > res["reject"][0]:
    passed + 1 => passed

# No policy may fail to suppress a genuine retry. That is the part they all
# get right, and it is why the mechanism looks like it is working.
checked + 1 => checked
0 => suppressed
for policy in ["replay", "reject", "execute"]:
    if res[policy][2] == 0:
        suppressed + 1 => suppressed
if suppressed == 3:
    passed + 1 => passed

# And on traffic where no key is ever reused with a different body, all three
# policies must be indistinguishable.
checked + 1 => checked
if len(clean_res) == 1:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The key says it is a retry and the body says it is not." => verdict
else:
    "FAILED - a policy did not behave as the checks describe." => verdict
verdict^0

""^0
"An idempotency key is a claim by the client that two requests are the" => n1
n1^0
"same request, and the server can either believe it or check it. Believing" => n2
n2^0
"it is cheaper and turns a client bug into a wrong answer with a 200 next" => n3
n3^0
"to it. Checking it means storing the request, which is the cost nobody" => n4
n4^0
"budgets for when they add the header." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def run(policy, reqs):
    stored_body = {}
    stored_result = {}
    charges = 0
    wrong = 0
    missed = 0
    rejects = 0
    for r in reqs:
        key = r[0]
        amount = r[1]
        kind = r[2]
        if key in stored_body:
            prev = stored_body[key]
            if prev == amount:
                if not stored_result[key] == amount:
                    wrong = wrong + 1
            elif policy == "replay":
                wrong = wrong + 1
            elif policy == "reject":
                rejects = rejects + 1
            else:
                charges = charges + 1
                stored_body[key] = amount
                stored_result[key] = amount
        else:
            charges = charges + 1
            stored_body[key] = amount
            stored_result[key] = amount
            if kind == "retry":
                missed = missed + 1
    return [charges, wrong, missed, rejects]

reqs = [["k1", 100, "new"], ["k1", 100, "retry"], ["k2", 250, "new"], ["k2", 250, "retry"], ["k2", 400, "reused-key-changed-body"], ["k3", 90, "new"], ["k1", 100, "retry"], ["k4", 500, "new"]]
genuine_new = 0
genuine_retry = 0
reused = 0
for r in reqs:
    if r[2] == "new":
        genuine_new = genuine_new + 1
    elif r[2] == "retry":
        genuine_retry = genuine_retry + 1
    else:
        reused = reused + 1
print("policy    charges   wrong answers   retries not suppressed   rejected")
res = {}
for policy in ["replay", "reject", "execute"]:
    r = run(policy, reqs)
    res[policy] = r
    print("%-9s %-9d %-15d %-24d %d" % (policy, r[0], r[1], r[2], r[3]))
print("")
print("requests: " + str(len(reqs)) + " (" + str(genuine_new) + " new, " + str(genuine_retry) + " genuine retries, " + str(reused) + " key reused with a changed body)")
print("distinct real operations, so the correct charge count is: " + str(genuine_new + reused))
print("")
print("the cost each policy pays:")
for policy in ["replay", "reject", "execute"]:
    r = res[policy]
    cost = ""
    if r[1] > 0:
        cost = "answers a question the caller did not ask"
    elif r[3] > 0:
        cost = "needs the REQUEST stored, not just the response"
    else:
        cost = "charges twice for one key - idempotency abandoned"
    print("  %-9s %s" % (policy, cost))
print("")
clean = [["a1", 100, "new"], ["a1", 100, "retry"], ["a2", 250, "new"], ["a2", 250, "retry"], ["a3", 90, "new"]]
clean_res = {}
for policy in ["replay", "reject", "execute"]:
    r = run(policy, clean)
    clean_res[str(r[0]) + "/" + str(r[1]) + "/" + str(r[2]) + "/" + str(r[3])] = 1
print("with no key ever reused for a different body, distinct behaviours: " + str(len(clean_res)))
print("...which is every client that generates a key correctly, and every test.")
print("")
print("a caller sending 400 on a key that already carries 250:")
print("  replay tells it:  250   (the stored result)")
print("  reject tells it:  an error")
print("  execute tells it: 400   (and charges again)")
print("...only one of those three is a lie, and it is the fast one.")
passed = 0
checked = 0
checked = checked + 1
if res["replay"][1] > 0:
    passed = passed + 1
checked = checked + 1
if res["reject"][1] == 0 and res["reject"][3] > 0:
    passed = passed + 1
checked = checked + 1
if res["execute"][0] > res["replay"][0] and res["execute"][0] > res["reject"][0]:
    passed = passed + 1
checked = checked + 1
suppressed = 0
for policy in ["replay", "reject", "execute"]:
    if res[policy][2] == 0:
        suppressed = suppressed + 1
if suppressed == 3:
    passed = passed + 1
checked = checked + 1
if len(clean_res) == 1:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The key says it is a retry and the body says it is not."
else:
    verdict = "FAILED - a policy did not behave as the checks describe."
print(verdict)
print("")
n1 = "An idempotency key is a claim by the client that two requests are the"
print(n1)
n2 = "same request, and the server can either believe it or check it. Believing"
print(n2)
n3 = "it is cheaper and turns a client bug into a wrong answer with a 200 next"
print(n3)
n4 = "to it. Checking it means storing the request, which is the cost nobody"
print(n4)
n5 = "budgets for when they add the header."
print(n5)
```

## stdout (executed)

```text
policy    charges   wrong answers   retries not suppressed   rejected
replay    4         1               0                        0
reject    4         0               0                        1
execute   5         0               0                        0

requests: 8 (4 new, 3 genuine retries, 1 key reused with a changed body)
distinct real operations, so the correct charge count is: 5

the cost each policy pays:
  replay    answers a question the caller did not ask
  reject    needs the REQUEST stored, not just the response
  execute   charges twice for one key - idempotency abandoned

with no key ever reused for a different body, distinct behaviours: 1
...which is every client that generates a key correctly, and every test.

a caller sending 400 on a key that already carries 250:
  replay tells it:  250   (the stored result)
  reject tells it:  an error
  execute tells it: 400   (and charges again)
...only one of those three is a lie, and it is the fast one.

checks passed: 5/5
The key says it is a retry and the body says it is not.

An idempotency key is a claim by the client that two requests are the
same request, and the server can either believe it or check it. Believing
it is cheaper and turns a client bug into a wrong answer with a 200 next
to it. Checking it means storing the request, which is the cost nobody
budgets for when they add the header.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
