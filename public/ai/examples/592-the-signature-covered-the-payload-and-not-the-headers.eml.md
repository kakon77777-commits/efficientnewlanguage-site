<!-- canonical: efficientnewlanguage.org/ai/examples/592-the-signature-covered-the-payload-and-not-the-headers | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 592 — The signature covered the payload and not the headers

`the_signature_covered_the_payload_and_not_the_headers.eml` - Every incoming webhook is signed and every signature verifies. Which fields the signature actually covers is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every incoming
# webhook is signed and every signature verifies. Which fields the signature
# actually covers is computed below.
#
# Signing the body is the standard practice and it was implemented correctly.
# The HMAC uses a shared secret, a constant-time comparison, a per-partner key,
# and the verification runs before any parsing so a forged body cannot reach the
# decoder. Four things that are commonly done badly are all done right here, and
# the implementation has been reviewed twice.
#
# The signature is computed over the body because that is what the partner's
# library signs. Routing information travels in headers, because headers are
# what a gateway can read without buffering a request - which is a good reason,
# and it is why the fields ended up on that side of the line.
#
# A signature is a statement about exactly the bytes it covered. It says nothing
# whatsoever about bytes it did not, and "the request is authentic" is a
# sentence about the whole request.

4 => security_relevant_fields
1 => fields_covered_by_signature

"security-relevant fields in the request : " + str(security_relevant_fields) ^0
"fields the signature covers             : " + str(fields_covered_by_signature) ^0
"signature verification pass rate        : 100 percent" ^0
"" ^0

# ---- what each field decides ----

# [field, where it travels, signed, what it decides]
[["body", "body", 1, "what the transaction says"], ["X-Target-Account", "header", 0, "which account is credited"], ["X-Idempotency-Key", "header", 0, "whether it posts twice"], ["X-Timestamp", "header", 0, "how old a replay may be"]] => fields

"field                where     signed   decides" ^0
0 => signed_count
0 => unsigned_count
for f in fields:
    if f[2] == 1:
        signed_count + 1 => signed_count
        "  " + f[0] + "        " + f[1] + "     yes      " + f[3] ^0
    else:
        unsigned_count + 1 => unsigned_count
        "  " + f[0] + "    " + f[1] + "   no       " + f[3] ^0
"" ^0

"  signed   : " + str(signed_count) ^0
"  unsigned : " + str(unsigned_count) ^0
"  the field that decides where the money goes is in the second group" ^0
"" ^0

# ---- what a valid signature permits ----
#
# Take one genuine, correctly signed request. Everything the signature covers
# stays byte-identical, so it still verifies. Everything else may change.

"one captured request, replayed with headers changed" ^0
"  body                : unchanged, so the signature still verifies" ^0
"  signature check     : passes" ^0
"  X-Target-Account    : changed, and nothing detects it" ^0
"  X-Idempotency-Key   : changed, so the deduplicator sees a new operation" ^0
"  X-Timestamp         : changed, so the replay window resets" ^0
"" ^0
"  the request is authentic in exactly the sense the signature claims:" ^0
"  these bytes came from the partner" ^0
"  it was read as: this operation was authorised by the partner" ^0
"" ^0

# ---- how much of the decision surface is covered ----

int(fields_covered_by_signature * 100 / security_relevant_fields) => coverage_pct

"  coverage of the decision surface : " + str(coverage_pct) + " percent" ^0
"  coverage reported by the check   : 100 percent, of what it covers" ^0
"  both numbers are correct and they are about different denominators" ^0
"" ^0

# ---- the repeated posting ----
#
# With the idempotency key unsigned, one captured request can be posted n times
# with n distinct keys, and each one is a first-time operation as far as the
# deduplicator can tell.

50000 => amount_hundredths
6 => replays

"one captured payment, replayed with fresh idempotency keys" ^0
"  amount per posting : " + str(amount_hundredths) + " hundredths" ^0
"  replays            : " + str(replays) ^0
"  total posted       : " + str(amount_hundredths * replays) + " hundredths" ^0
"  duplicate detections : 0, every key is new" ^0
"  signature failures   : 0, the body never changed" ^0
"" ^0

# ---- the control ----
#
# The signature implementation. Constant-time comparison, per-partner key,
# verified before parsing, no timing leak, no length-extension exposure. Every
# property the review checked is present and correct.

"control - is the signature implementation itself sound" ^0
"  constant-time comparison    : yes" ^0
"  per-partner key             : yes" ^0
"  verified before parsing     : yes" ^0
"  forged bodies rejected      : yes, all of them" ^0
"  defects in the implementation : 0" ^0
"  the crypto is not the problem and never was" ^0
"" ^0
"  a review of the implementation asks 'is this HMAC correct'" ^0
"  the question that was needed is 'what is inside the HMAC'" ^0
"" ^0

# ---- the null control ----
#
# The same signature over a request where nothing security-relevant lives in a
# header. Coverage is complete, the same implementation is exactly sufficient,
# and no review would have found anything. The defect is the SPLIT between what
# decides and what is covered, not the signature.

4 => nc_relevant
4 => nc_covered

"null control - the same signature when every deciding field is in the body" ^0
"  security-relevant fields : " + str(nc_relevant) ^0
"  covered by the signature : " + str(nc_covered) ^0
"  coverage                 : " + str(int(nc_covered * 100 / nc_relevant)) + " percent" ^0
"  replay with changed headers : changes nothing that decides anything" ^0
"  same HMAC, same key, same code path" ^0
"  the strength of a signature is the same; its SCOPE is the whole finding" ^0
"" ^0

# ---- the rule ----

"reading a signature honestly" ^0
"  what it proves      these exact bytes came from the holder of the key" ^0
"  what it is read as  this request is authorised" ^0
"  the gap             every byte outside the covered range" ^0
"  and that range is decided by whichever library the partner uses" ^0
"" ^0
"the check is not 'does the signature verify'" ^0
"it is 'list the fields that change the outcome, and mark which are inside'" ^0
"a field that decides something and is not covered is the whole finding" ^0
"" ^0

"The HMAC is correct: constant-time comparison, per-partner key, verified before" ^0
"parsing, and it rejects every forged body. It covers " + str(fields_covered_by_signature) + " of the " + str(security_relevant_fields) + " fields that" ^0
"decide what the request does, which is " + str(coverage_pct) + " percent of the decision surface and" ^0
"100 percent of what it was asked to cover. The account the money reaches is" ^0
"in a header, and a header is outside the bytes the signature is a statement" ^0
"about." ^0
```

## Python (deterministic transpilation)

```python
security_relevant_fields = 4
fields_covered_by_signature = 1
print("security-relevant fields in the request : " + str(security_relevant_fields))
print("fields the signature covers             : " + str(fields_covered_by_signature))
print("signature verification pass rate        : 100 percent")
print("")
fields = [["body", "body", 1, "what the transaction says"], ["X-Target-Account", "header", 0, "which account is credited"], ["X-Idempotency-Key", "header", 0, "whether it posts twice"], ["X-Timestamp", "header", 0, "how old a replay may be"]]
print("field                where     signed   decides")
signed_count = 0
unsigned_count = 0
for f in fields:
    if f[2] == 1:
        signed_count = signed_count + 1
        print("  " + f[0] + "        " + f[1] + "     yes      " + f[3])
    else:
        unsigned_count = unsigned_count + 1
        print("  " + f[0] + "    " + f[1] + "   no       " + f[3])
print("")
print("  signed   : " + str(signed_count))
print("  unsigned : " + str(unsigned_count))
print("  the field that decides where the money goes is in the second group")
print("")
print("one captured request, replayed with headers changed")
print("  body                : unchanged, so the signature still verifies")
print("  signature check     : passes")
print("  X-Target-Account    : changed, and nothing detects it")
print("  X-Idempotency-Key   : changed, so the deduplicator sees a new operation")
print("  X-Timestamp         : changed, so the replay window resets")
print("")
print("  the request is authentic in exactly the sense the signature claims:")
print("  these bytes came from the partner")
print("  it was read as: this operation was authorised by the partner")
print("")
coverage_pct = int(fields_covered_by_signature * 100 / security_relevant_fields)
print("  coverage of the decision surface : " + str(coverage_pct) + " percent")
print("  coverage reported by the check   : 100 percent, of what it covers")
print("  both numbers are correct and they are about different denominators")
print("")
amount_hundredths = 50000
replays = 6
print("one captured payment, replayed with fresh idempotency keys")
print("  amount per posting : " + str(amount_hundredths) + " hundredths")
print("  replays            : " + str(replays))
print("  total posted       : " + str(amount_hundredths * replays) + " hundredths")
print("  duplicate detections : 0, every key is new")
print("  signature failures   : 0, the body never changed")
print("")
print("control - is the signature implementation itself sound")
print("  constant-time comparison    : yes")
print("  per-partner key             : yes")
print("  verified before parsing     : yes")
print("  forged bodies rejected      : yes, all of them")
print("  defects in the implementation : 0")
print("  the crypto is not the problem and never was")
print("")
print("  a review of the implementation asks 'is this HMAC correct'")
print("  the question that was needed is 'what is inside the HMAC'")
print("")
nc_relevant = 4
nc_covered = 4
print("null control - the same signature when every deciding field is in the body")
print("  security-relevant fields : " + str(nc_relevant))
print("  covered by the signature : " + str(nc_covered))
print("  coverage                 : " + str(int(nc_covered * 100 / nc_relevant)) + " percent")
print("  replay with changed headers : changes nothing that decides anything")
print("  same HMAC, same key, same code path")
print("  the strength of a signature is the same; its SCOPE is the whole finding")
print("")
print("reading a signature honestly")
print("  what it proves      these exact bytes came from the holder of the key")
print("  what it is read as  this request is authorised")
print("  the gap             every byte outside the covered range")
print("  and that range is decided by whichever library the partner uses")
print("")
print("the check is not 'does the signature verify'")
print("it is 'list the fields that change the outcome, and mark which are inside'")
print("a field that decides something and is not covered is the whole finding")
print("")
print("The HMAC is correct: constant-time comparison, per-partner key, verified before")
print("parsing, and it rejects every forged body. It covers " + str(fields_covered_by_signature) + " of the " + str(security_relevant_fields) + " fields that")
print("decide what the request does, which is " + str(coverage_pct) + " percent of the decision surface and")
print("100 percent of what it was asked to cover. The account the money reaches is")
print("in a header, and a header is outside the bytes the signature is a statement")
print("about.")
```

## stdout (executed)

```text
security-relevant fields in the request : 4
fields the signature covers             : 1
signature verification pass rate        : 100 percent

field                where     signed   decides
  body        body     yes      what the transaction says
  X-Target-Account    header   no       which account is credited
  X-Idempotency-Key    header   no       whether it posts twice
  X-Timestamp    header   no       how old a replay may be

  signed   : 1
  unsigned : 3
  the field that decides where the money goes is in the second group

one captured request, replayed with headers changed
  body                : unchanged, so the signature still verifies
  signature check     : passes
  X-Target-Account    : changed, and nothing detects it
  X-Idempotency-Key   : changed, so the deduplicator sees a new operation
  X-Timestamp         : changed, so the replay window resets

  the request is authentic in exactly the sense the signature claims:
  these bytes came from the partner
  it was read as: this operation was authorised by the partner

  coverage of the decision surface : 25 percent
  coverage reported by the check   : 100 percent, of what it covers
  both numbers are correct and they are about different denominators

one captured payment, replayed with fresh idempotency keys
  amount per posting : 50000 hundredths
  replays            : 6
  total posted       : 300000 hundredths
  duplicate detections : 0, every key is new
  signature failures   : 0, the body never changed

control - is the signature implementation itself sound
  constant-time comparison    : yes
  per-partner key             : yes
  verified before parsing     : yes
  forged bodies rejected      : yes, all of them
  defects in the implementation : 0
  the crypto is not the problem and never was

  a review of the implementation asks 'is this HMAC correct'
  the question that was needed is 'what is inside the HMAC'

null control - the same signature when every deciding field is in the body
  security-relevant fields : 4
  covered by the signature : 4
  coverage                 : 100 percent
  replay with changed headers : changes nothing that decides anything
  same HMAC, same key, same code path
  the strength of a signature is the same; its SCOPE is the whole finding

reading a signature honestly
  what it proves      these exact bytes came from the holder of the key
  what it is read as  this request is authorised
  the gap             every byte outside the covered range
  and that range is decided by whichever library the partner uses

the check is not 'does the signature verify'
it is 'list the fields that change the outcome, and mark which are inside'
a field that decides something and is not covered is the whole finding

The HMAC is correct: constant-time comparison, per-partner key, verified before
parsing, and it rejects every forged body. It covers 1 of the 4 fields that
decide what the request does, which is 25 percent of the decision surface and
100 percent of what it was asked to cover. The account the money reaches is
in a header, and a header is outside the bytes the signature is a statement
about.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
