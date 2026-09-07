<!-- canonical: efficientnewlanguage.org/ai/examples/745-the-signature-was-verified-and-the-parser-ran-first | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 745 — The signature was verified and the parser ran first

`the_signature_was_verified_and_the_parser_ran_first.eml` - Every webhook verifies an HMAC with a constant-time compare, inside a replay window, against a rotated secret. Where in the request path that happens is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every webhook
# verifies an HMAC with a constant-time compare, inside a replay window, against
# a rotated secret. Where in the request path that happens is computed below.
#
# The verification itself is textbook. The comparison is constant time rather
# than a string equality, so it leaks nothing through timing; the signed payload
# includes a timestamp checked against a five minute window, so a captured
# request cannot be replayed tomorrow; the secret is rotated on a schedule with
# both keys accepted during the overlap; and every one of the two hundred
# fourteen endpoints does this rather than most of them.
#
# The handler runs after the framework has already deserialised the body into
# an object. The bytes reach a parser before they reach the check.
#
# Eighty-four thousand unsigned requests a day are rejected.

214 => webhook_endpoints
214 => endpoints_verifying_the_signature
1 => middlewares_that_parse_before_the_handler
0 => endpoints_where_verification_precedes_parsing
300 => replay_window_seconds
90 => secret_rotation_days
84000 => unsigned_requests_rejected_per_day
2 => parser_advisories_in_the_dependency_in_three_years

unsigned_requests_rejected_per_day => unsigned_request_bodies_parsed_per_day
int(endpoints_verifying_the_signature * 10000 / webhook_endpoints) => verifying_per_myriad
int(endpoints_where_verification_precedes_parsing * 10000 / webhook_endpoints) => verifying_first_per_myriad

"webhook endpoints               : " + str(webhook_endpoints) ^0
"  verifying the signature       : " + str(endpoints_verifying_the_signature) ^0
"  share                         : " + str(verifying_per_myriad) + " per ten thousand" ^0
"  verifying before parsing      : " + str(endpoints_where_verification_precedes_parsing) ^0
"  share                         : " + str(verifying_first_per_myriad) + " per ten thousand" ^0
"middlewares that parse first    : " + str(middlewares_that_parse_before_the_handler) ^0
"" ^0
"replay window, seconds          : " + str(replay_window_seconds) ^0
"secret rotation, days           : " + str(secret_rotation_days) ^0
"" ^0
"unsigned requests rejected daily: " + str(unsigned_requests_rejected_per_day) ^0
"  bodies parsed before rejection: " + str(unsigned_request_bodies_parsed_per_day) ^0
"parser advisories in three years: " + str(parser_advisories_in_the_dependency_in_three_years) ^0
"" ^0

# ---- what the verification verified ----

"the signature check" ^0
"  comparison : constant time, not string equality" ^0
"  signed payload includes a timestamp : yes" ^0
"  replay window : " + str(replay_window_seconds) + " seconds" ^0
"  secret rotation : every " + str(secret_rotation_days) + " days, both keys accepted" ^0
"    during the overlap" ^0
"  endpoints doing this : " + str(endpoints_verifying_the_signature) + " of " + str(webhook_endpoints) ^0
"  verdict : AUTHENTIC" ^0
"" ^0
"  a constant-time compare and a signed timestamp are the" ^0
"  two details most implementations miss, and both are here" ^0
"" ^0

# ---- where in the path it runs ----

"the order" ^0
"  bytes arrive : from anyone" ^0
"  the framework : deserialises the body into an object" ^0
"  the handler   : receives that object and verifies" ^0
"  what the parser was given : unverified bytes" ^0
"  endpoints where the check comes first : " ^0
"    " + str(endpoints_where_verification_precedes_parsing) ^0
"  is the check weaker for it : no; it is exactly as" ^0
"    strong, and it runs second" ^0
"" ^0
"  the guarantee is about who sent the bytes, and it is" ^0
"  established after something has already read them" ^0
"" ^0
# ---- what the parser is ----

# The parser is a dependency, it is fast, it is widely used, and it is the
# reason nobody thinks about it. It is also code that runs on input from anyone
# who can reach the endpoint, without a signature having been checked.
"the deserialiser" ^0
"  who wrote it : a dependency" ^0
"  is it well regarded : yes" ^0
"  what it processes : bytes from any sender" ^0
"  what has been established about the sender at that" ^0
"    point : nothing" ^0
"  advisories against it in three years : " ^0
"    " + str(parser_advisories_in_the_dependency_in_three_years) ^0
"  requests it parses that are then rejected : " ^0
"    " + str(unsigned_request_bodies_parsed_per_day) + " a day" ^0
"" ^0

# ---- the rejection is not the protection ----

"what the eighty-four thousand show" ^0
"  requests rejected daily : " + str(unsigned_requests_rejected_per_day) ^0
"  is the rejection correct : entirely" ^0
"  what it proves : the check works and is exercised" ^0
"  what happened before each rejection : the body was" ^0
"    deserialised" ^0
"  so the daily figure is also : the count of unverified" ^0
"    bodies handed to the parser" ^0
"  the same number, read from the other side" ^0
"" ^0

# ---- why the order is the way it is ----

# Nobody chose it. The framework parses the body so that the handler can be
# written against a typed object, which is the framework working as intended,
# and the signature check is application code, which by definition runs after.
"how the order arose" ^0
"  who decided it : the framework, by parsing before" ^0
"    dispatch" ^0
"  why : so a handler receives a typed object" ^0
"  is that a bad framework decision : no; it is the" ^0
"    ergonomics everyone wants" ^0
"  where application code can run : after dispatch" ^0
"  so a check written as application code : runs second," ^0
"    necessarily" ^0
"" ^0

# ---- null control ----

# The same check, moved into a middleware that reads the raw body, verifies, and
# only then hands it to the deserialiser.
webhook_endpoints => nc_endpoints_where_verification_precedes_parsing
0 => nc_unsigned_request_bodies_parsed_per_day

"null control - verification is a middleware over raw bytes" ^0
"  endpoints verifying : " + str(endpoints_verifying_the_signature) + ", unchanged" ^0
"  verifying before parsing : " + str(nc_endpoints_where_verification_precedes_parsing) ^0
"  unsigned bodies parsed : " + str(nc_unsigned_request_bodies_parsed_per_day) ^0
"  the signature check did not get stronger; it moved in" ^0
"  front of the first thing that reads the bytes" ^0
"" ^0

# ---- the rule ----

"what a verified signature guarantees" ^0
"  this body came from the holder of the secret, recently :" ^0
"    exactly, in constant time, within " + str(replay_window_seconds) + " seconds" ^0
"  only trusted input was processed : not addressed; the" ^0
"    guarantee is established at a point, and everything" ^0
"    upstream of that point ran on anything" ^0
"" ^0
"authentication defines a trust boundary, and a boundary is a" ^0
"place in a sequence; code that runs before it is outside it," ^0
"however strong the check is, and a framework that parses for" ^0
"convenience decides where that line falls" ^0
"" ^0

"The check is textbook: a constant-time compare, a signed timestamp inside a" ^0
str(replay_window_seconds) + " second window, a secret rotated every " + str(secret_rotation_days) + " days with an overlap, on all" ^0
str(endpoints_verifying_the_signature) + " of " + str(webhook_endpoints) + " endpoints - " + str(verifying_per_myriad) + " per ten thousand. It runs in the handler," ^0
"after " + str(middlewares_that_parse_before_the_handler) + " middleware has deserialised the body, so " + str(verifying_first_per_myriad) + " per ten thousand" ^0
"verify before parsing and " + str(unsigned_request_bodies_parsed_per_day) + " unverified bodies a day reach the parser." ^0
```

## Python (deterministic transpilation)

```python
webhook_endpoints = 214
endpoints_verifying_the_signature = 214
middlewares_that_parse_before_the_handler = 1
endpoints_where_verification_precedes_parsing = 0
replay_window_seconds = 300
secret_rotation_days = 90
unsigned_requests_rejected_per_day = 84000
parser_advisories_in_the_dependency_in_three_years = 2
unsigned_request_bodies_parsed_per_day = unsigned_requests_rejected_per_day
verifying_per_myriad = int(endpoints_verifying_the_signature * 10000 / webhook_endpoints)
verifying_first_per_myriad = int(endpoints_where_verification_precedes_parsing * 10000 / webhook_endpoints)
print("webhook endpoints               : " + str(webhook_endpoints))
print("  verifying the signature       : " + str(endpoints_verifying_the_signature))
print("  share                         : " + str(verifying_per_myriad) + " per ten thousand")
print("  verifying before parsing      : " + str(endpoints_where_verification_precedes_parsing))
print("  share                         : " + str(verifying_first_per_myriad) + " per ten thousand")
print("middlewares that parse first    : " + str(middlewares_that_parse_before_the_handler))
print("")
print("replay window, seconds          : " + str(replay_window_seconds))
print("secret rotation, days           : " + str(secret_rotation_days))
print("")
print("unsigned requests rejected daily: " + str(unsigned_requests_rejected_per_day))
print("  bodies parsed before rejection: " + str(unsigned_request_bodies_parsed_per_day))
print("parser advisories in three years: " + str(parser_advisories_in_the_dependency_in_three_years))
print("")
print("the signature check")
print("  comparison : constant time, not string equality")
print("  signed payload includes a timestamp : yes")
print("  replay window : " + str(replay_window_seconds) + " seconds")
print("  secret rotation : every " + str(secret_rotation_days) + " days, both keys accepted")
print("    during the overlap")
print("  endpoints doing this : " + str(endpoints_verifying_the_signature) + " of " + str(webhook_endpoints))
print("  verdict : AUTHENTIC")
print("")
print("  a constant-time compare and a signed timestamp are the")
print("  two details most implementations miss, and both are here")
print("")
print("the order")
print("  bytes arrive : from anyone")
print("  the framework : deserialises the body into an object")
print("  the handler   : receives that object and verifies")
print("  what the parser was given : unverified bytes")
print("  endpoints where the check comes first : ")
print("    " + str(endpoints_where_verification_precedes_parsing))
print("  is the check weaker for it : no; it is exactly as")
print("    strong, and it runs second")
print("")
print("  the guarantee is about who sent the bytes, and it is")
print("  established after something has already read them")
print("")
print("the deserialiser")
print("  who wrote it : a dependency")
print("  is it well regarded : yes")
print("  what it processes : bytes from any sender")
print("  what has been established about the sender at that")
print("    point : nothing")
print("  advisories against it in three years : ")
print("    " + str(parser_advisories_in_the_dependency_in_three_years))
print("  requests it parses that are then rejected : ")
print("    " + str(unsigned_request_bodies_parsed_per_day) + " a day")
print("")
print("what the eighty-four thousand show")
print("  requests rejected daily : " + str(unsigned_requests_rejected_per_day))
print("  is the rejection correct : entirely")
print("  what it proves : the check works and is exercised")
print("  what happened before each rejection : the body was")
print("    deserialised")
print("  so the daily figure is also : the count of unverified")
print("    bodies handed to the parser")
print("  the same number, read from the other side")
print("")
print("how the order arose")
print("  who decided it : the framework, by parsing before")
print("    dispatch")
print("  why : so a handler receives a typed object")
print("  is that a bad framework decision : no; it is the")
print("    ergonomics everyone wants")
print("  where application code can run : after dispatch")
print("  so a check written as application code : runs second,")
print("    necessarily")
print("")
nc_endpoints_where_verification_precedes_parsing = webhook_endpoints
nc_unsigned_request_bodies_parsed_per_day = 0
print("null control - verification is a middleware over raw bytes")
print("  endpoints verifying : " + str(endpoints_verifying_the_signature) + ", unchanged")
print("  verifying before parsing : " + str(nc_endpoints_where_verification_precedes_parsing))
print("  unsigned bodies parsed : " + str(nc_unsigned_request_bodies_parsed_per_day))
print("  the signature check did not get stronger; it moved in")
print("  front of the first thing that reads the bytes")
print("")
print("what a verified signature guarantees")
print("  this body came from the holder of the secret, recently :")
print("    exactly, in constant time, within " + str(replay_window_seconds) + " seconds")
print("  only trusted input was processed : not addressed; the")
print("    guarantee is established at a point, and everything")
print("    upstream of that point ran on anything")
print("")
print("authentication defines a trust boundary, and a boundary is a")
print("place in a sequence; code that runs before it is outside it,")
print("however strong the check is, and a framework that parses for")
print("convenience decides where that line falls")
print("")
print("The check is textbook: a constant-time compare, a signed timestamp inside a")
print(str(replay_window_seconds) + " second window, a secret rotated every " + str(secret_rotation_days) + " days with an overlap, on all")
print(str(endpoints_verifying_the_signature) + " of " + str(webhook_endpoints) + " endpoints - " + str(verifying_per_myriad) + " per ten thousand. It runs in the handler,")
print("after " + str(middlewares_that_parse_before_the_handler) + " middleware has deserialised the body, so " + str(verifying_first_per_myriad) + " per ten thousand")
print("verify before parsing and " + str(unsigned_request_bodies_parsed_per_day) + " unverified bodies a day reach the parser.")
```

## stdout (executed)

```text
webhook endpoints               : 214
  verifying the signature       : 214
  share                         : 10000 per ten thousand
  verifying before parsing      : 0
  share                         : 0 per ten thousand
middlewares that parse first    : 1

replay window, seconds          : 300
secret rotation, days           : 90

unsigned requests rejected daily: 84000
  bodies parsed before rejection: 84000
parser advisories in three years: 2

the signature check
  comparison : constant time, not string equality
  signed payload includes a timestamp : yes
  replay window : 300 seconds
  secret rotation : every 90 days, both keys accepted
    during the overlap
  endpoints doing this : 214 of 214
  verdict : AUTHENTIC

  a constant-time compare and a signed timestamp are the
  two details most implementations miss, and both are here

the order
  bytes arrive : from anyone
  the framework : deserialises the body into an object
  the handler   : receives that object and verifies
  what the parser was given : unverified bytes
  endpoints where the check comes first : 
    0
  is the check weaker for it : no; it is exactly as
    strong, and it runs second

  the guarantee is about who sent the bytes, and it is
  established after something has already read them

the deserialiser
  who wrote it : a dependency
  is it well regarded : yes
  what it processes : bytes from any sender
  what has been established about the sender at that
    point : nothing
  advisories against it in three years : 
    2
  requests it parses that are then rejected : 
    84000 a day

what the eighty-four thousand show
  requests rejected daily : 84000
  is the rejection correct : entirely
  what it proves : the check works and is exercised
  what happened before each rejection : the body was
    deserialised
  so the daily figure is also : the count of unverified
    bodies handed to the parser
  the same number, read from the other side

how the order arose
  who decided it : the framework, by parsing before
    dispatch
  why : so a handler receives a typed object
  is that a bad framework decision : no; it is the
    ergonomics everyone wants
  where application code can run : after dispatch
  so a check written as application code : runs second,
    necessarily

null control - verification is a middleware over raw bytes
  endpoints verifying : 214, unchanged
  verifying before parsing : 214
  unsigned bodies parsed : 0
  the signature check did not get stronger; it moved in
  front of the first thing that reads the bytes

what a verified signature guarantees
  this body came from the holder of the secret, recently :
    exactly, in constant time, within 300 seconds
  only trusted input was processed : not addressed; the
    guarantee is established at a point, and everything
    upstream of that point ran on anything

authentication defines a trust boundary, and a boundary is a
place in a sequence; code that runs before it is outside it,
however strong the check is, and a framework that parses for
convenience decides where that line falls

The check is textbook: a constant-time compare, a signed timestamp inside a
300 second window, a secret rotated every 90 days with an overlap, on all
214 of 214 endpoints - 10000 per ten thousand. It runs in the handler,
after 1 middleware has deserialised the body, so 0 per ten thousand
verify before parsing and 84000 unverified bodies a day reach the parser.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
