<!-- canonical: efficientnewlanguage.org/ai/examples/718-the-cache-was-keyed-on-the-url-and-the-header-varied-the-answer | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 718 — The cache was keyed on the url and the header varied the answer

`the_cache_was_keyed_on_the_url_and_the_header_varied_the_answer.eml` - The cache key is the full URL with query parameters sorted and allowlisted, the hit rate is ninety-four percent, and purges on deploy are verified. What the key omits is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The cache key is
# the full URL with query parameters sorted and allowlisted, the hit rate is
# ninety-four percent, and purges on deploy are verified. What the key omits is
# computed below.
#
# The cache key was designed rather than defaulted. Query parameters are sorted
# so two orderings of the same request share an entry; only six parameters are
# allowlisted, so tracking parameters cannot fragment the cache into millions
# of single-use entries; and the purge that runs on deploy is verified by
# refetching rather than assumed. The hit rate is ninety-four percent and the
# origin load reflects it.
#
# The key is built from the URL. Three request headers change the body the
# origin produces, none of them appears in the key, and the origin sets no
# Vary, so the first response to arrive is served to everyone.
#
# Two point one million responses a day depend on one of those headers.

84000000 => responses_per_day
78960000 => responses_served_from_cache
6 => query_parameters_allowlisted
1 => key_orderings_after_sorting
3 => headers_the_body_depends_on
0 => headers_in_the_cache_key
0 => vary_headers_set_by_the_origin
2100000 => responses_whose_body_depends_on_such_a_header
310000 => responses_served_a_body_built_for_another_header_value

int(responses_served_from_cache * 10000 / responses_per_day) => hit_rate_per_myriad
int(responses_served_a_body_built_for_another_header_value * 10000 / responses_per_day) => wrong_variant_per_myriad
responses_whose_body_depends_on_such_a_header - responses_served_a_body_built_for_another_header_value => header_dependent_responses_that_happened_to_match

"responses per day               : " + str(responses_per_day) ^0
"  served from cache             : " + str(responses_served_from_cache) ^0
"  hit rate                      : " + str(hit_rate_per_myriad) + " per ten thousand" ^0
"" ^0
"query parameters allowlisted    : " + str(query_parameters_allowlisted) ^0
"key orderings after sorting     : " + str(key_orderings_after_sorting) ^0
"headers the body depends on     : " + str(headers_the_body_depends_on) ^0
"  in the cache key              : " + str(headers_in_the_cache_key) ^0
"  declared by a Vary            : " + str(vary_headers_set_by_the_origin) ^0
"" ^0
"responses depending on such a header : " + str(responses_whose_body_depends_on_such_a_header) ^0
"  that happened to match        : " + str(header_dependent_responses_that_happened_to_match) ^0
"  built for another value       : " + str(responses_served_a_body_built_for_another_header_value) ^0
"  share of all responses        : " + str(wrong_variant_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the key design verified ----

"the cache key" ^0
"  query parameters : sorted, so one request has" ^0
"    " + str(key_orderings_after_sorting) + " key rather than one per ordering" ^0
"  parameters allowlisted : " + str(query_parameters_allowlisted) + ", so tracking parameters" ^0
"    cannot fragment the cache" ^0
"  purge on deploy : verified by refetching, not assumed" ^0
"  hit rate : " + str(hit_rate_per_myriad) + " per ten thousand" ^0
"  verdict : KEYED" ^0
"" ^0
"  an allowlist rather than a denylist is the choice that" ^0
"  keeps this hit rate, and it was made on purpose" ^0
"" ^0

# ---- what the key is built from ----

"the inputs to the key" ^0
"  the path            : in the key" ^0
"  allowlisted query   : in the key" ^0
"  everything else in the query : deliberately excluded," ^0
"    and correctly" ^0
"  the headers         : " + str(headers_in_the_cache_key) + " of " + str(headers_the_body_depends_on) + " that change the body" ^0
"  who would declare that dependency : the origin, with a" ^0
"    Vary header" ^0
"  Vary headers it sets : " + str(vary_headers_set_by_the_origin) ^0
"" ^0
"  the key is a complete description of the URL and the" ^0
"  response is not a function of the URL alone" ^0
"" ^0
# ---- why most of them look right ----

# The majority header value wins the race to populate each entry, and the
# majority of requests carry it, so most header-dependent responses match by
# coincidence. The coincidence rate is high enough that the wrong ones read as
# individual reports rather than a class.
"the ones that match" ^0
"  responses depending on a header : " + str(responses_whose_body_depends_on_such_a_header) ^0
"  of those, matching by coincidence : " + str(header_dependent_responses_that_happened_to_match) ^0
"  why : whichever value populated the entry is the" ^0
"    common one, and most requests carry it" ^0
"  what that makes the wrong ones look like : a handful of" ^0
"    unrelated reports" ^0
"  what they are : " + str(responses_served_a_body_built_for_another_header_value) + " a day" ^0
"" ^0

# ---- what a cache hit is a claim about ----

"one hit" ^0
"  the claim : this stored response is the response the" ^0
"    origin would produce for this request" ^0
"  what makes that true : the request and the stored one" ^0
"    agree on everything the origin reads" ^0
"  what the cache compares : the key" ^0
"  what the origin reads : the key, plus " + str(headers_the_body_depends_on) + " headers" ^0
"  who is supposed to close that gap : the origin, by" ^0
"    declaring Vary" ^0
"" ^0

# ---- why the hit rate cannot show it ----

"the hit rate" ^0
"  what it measures : entries found" ^0
"  what a wrong-variant response is : an entry found" ^0
"  so its effect on the rate : raises it" ^0
"  hit rate now : " + str(hit_rate_per_myriad) + " per ten thousand" ^0
"  a correctness metric on variants : none defined" ^0
"" ^0

# ---- null control ----

# The same key, with the origin declaring Vary on the three headers and the
# cache including them. Entries multiply and the hit rate falls; that fall is
# the cost of the answer being right.
headers_the_body_depends_on => nc_headers_in_the_cache_key
0 => nc_responses_served_a_body_built_for_another_header_value
8900 => nc_hit_rate_per_myriad

"null control - Vary is declared and the key includes it" ^0
"  headers in the key : " + str(nc_headers_in_the_cache_key) ^0
"  wrong-variant responses : " + str(nc_responses_served_a_body_built_for_another_header_value) ^0
"  hit rate : " + str(nc_hit_rate_per_myriad) + " per ten thousand, down from " + str(hit_rate_per_myriad) ^0
"  the cache did not get worse; the number went down" ^0
"  because it had been counting responses that were found" ^0
"  and wrong" ^0
"" ^0

# ---- the rule ----

"what a well-designed cache key guarantees" ^0
"  two requests with the same key get the same response :" ^0
"    exactly, and the key was designed so that the right" ^0
"    requests share one" ^0
"  a cached response is the right response : not" ^0
"    addressed; that holds when the key names everything" ^0
"    the answer depends on, which is a fact about the" ^0
"    origin, not about the key" ^0
"" ^0
"a cache is a memo table for a function, so its correctness" ^0
"is a claim about the function's arguments; a key that is" ^0
"carefully complete over the URL is complete over the URL" ^0
"" ^0

"The key is designed rather than defaulted: parameters sorted to " + str(key_orderings_after_sorting) + " ordering," ^0
"only " + str(query_parameters_allowlisted) + " allowlisted so tracking cannot fragment it, purges verified by" ^0
"refetching, and a " + str(hit_rate_per_myriad) + " per ten thousand hit rate. It is built from the URL while" ^0
str(headers_the_body_depends_on) + " headers change the body, with " + str(headers_in_the_cache_key) + " in the key and " + str(vary_headers_set_by_the_origin) + " Vary declared, so" ^0
str(responses_served_a_body_built_for_another_header_value) + " responses a day - " + str(wrong_variant_per_myriad) + " per ten thousand - are hits built for someone else." ^0
```

## Python (deterministic transpilation)

```python
responses_per_day = 84000000
responses_served_from_cache = 78960000
query_parameters_allowlisted = 6
key_orderings_after_sorting = 1
headers_the_body_depends_on = 3
headers_in_the_cache_key = 0
vary_headers_set_by_the_origin = 0
responses_whose_body_depends_on_such_a_header = 2100000
responses_served_a_body_built_for_another_header_value = 310000
hit_rate_per_myriad = int(responses_served_from_cache * 10000 / responses_per_day)
wrong_variant_per_myriad = int(responses_served_a_body_built_for_another_header_value * 10000 / responses_per_day)
header_dependent_responses_that_happened_to_match = responses_whose_body_depends_on_such_a_header - responses_served_a_body_built_for_another_header_value
print("responses per day               : " + str(responses_per_day))
print("  served from cache             : " + str(responses_served_from_cache))
print("  hit rate                      : " + str(hit_rate_per_myriad) + " per ten thousand")
print("")
print("query parameters allowlisted    : " + str(query_parameters_allowlisted))
print("key orderings after sorting     : " + str(key_orderings_after_sorting))
print("headers the body depends on     : " + str(headers_the_body_depends_on))
print("  in the cache key              : " + str(headers_in_the_cache_key))
print("  declared by a Vary            : " + str(vary_headers_set_by_the_origin))
print("")
print("responses depending on such a header : " + str(responses_whose_body_depends_on_such_a_header))
print("  that happened to match        : " + str(header_dependent_responses_that_happened_to_match))
print("  built for another value       : " + str(responses_served_a_body_built_for_another_header_value))
print("  share of all responses        : " + str(wrong_variant_per_myriad) + " per ten thousand")
print("")
print("the cache key")
print("  query parameters : sorted, so one request has")
print("    " + str(key_orderings_after_sorting) + " key rather than one per ordering")
print("  parameters allowlisted : " + str(query_parameters_allowlisted) + ", so tracking parameters")
print("    cannot fragment the cache")
print("  purge on deploy : verified by refetching, not assumed")
print("  hit rate : " + str(hit_rate_per_myriad) + " per ten thousand")
print("  verdict : KEYED")
print("")
print("  an allowlist rather than a denylist is the choice that")
print("  keeps this hit rate, and it was made on purpose")
print("")
print("the inputs to the key")
print("  the path            : in the key")
print("  allowlisted query   : in the key")
print("  everything else in the query : deliberately excluded,")
print("    and correctly")
print("  the headers         : " + str(headers_in_the_cache_key) + " of " + str(headers_the_body_depends_on) + " that change the body")
print("  who would declare that dependency : the origin, with a")
print("    Vary header")
print("  Vary headers it sets : " + str(vary_headers_set_by_the_origin))
print("")
print("  the key is a complete description of the URL and the")
print("  response is not a function of the URL alone")
print("")
print("the ones that match")
print("  responses depending on a header : " + str(responses_whose_body_depends_on_such_a_header))
print("  of those, matching by coincidence : " + str(header_dependent_responses_that_happened_to_match))
print("  why : whichever value populated the entry is the")
print("    common one, and most requests carry it")
print("  what that makes the wrong ones look like : a handful of")
print("    unrelated reports")
print("  what they are : " + str(responses_served_a_body_built_for_another_header_value) + " a day")
print("")
print("one hit")
print("  the claim : this stored response is the response the")
print("    origin would produce for this request")
print("  what makes that true : the request and the stored one")
print("    agree on everything the origin reads")
print("  what the cache compares : the key")
print("  what the origin reads : the key, plus " + str(headers_the_body_depends_on) + " headers")
print("  who is supposed to close that gap : the origin, by")
print("    declaring Vary")
print("")
print("the hit rate")
print("  what it measures : entries found")
print("  what a wrong-variant response is : an entry found")
print("  so its effect on the rate : raises it")
print("  hit rate now : " + str(hit_rate_per_myriad) + " per ten thousand")
print("  a correctness metric on variants : none defined")
print("")
nc_headers_in_the_cache_key = headers_the_body_depends_on
nc_responses_served_a_body_built_for_another_header_value = 0
nc_hit_rate_per_myriad = 8900
print("null control - Vary is declared and the key includes it")
print("  headers in the key : " + str(nc_headers_in_the_cache_key))
print("  wrong-variant responses : " + str(nc_responses_served_a_body_built_for_another_header_value))
print("  hit rate : " + str(nc_hit_rate_per_myriad) + " per ten thousand, down from " + str(hit_rate_per_myriad))
print("  the cache did not get worse; the number went down")
print("  because it had been counting responses that were found")
print("  and wrong")
print("")
print("what a well-designed cache key guarantees")
print("  two requests with the same key get the same response :")
print("    exactly, and the key was designed so that the right")
print("    requests share one")
print("  a cached response is the right response : not")
print("    addressed; that holds when the key names everything")
print("    the answer depends on, which is a fact about the")
print("    origin, not about the key")
print("")
print("a cache is a memo table for a function, so its correctness")
print("is a claim about the function's arguments; a key that is")
print("carefully complete over the URL is complete over the URL")
print("")
print("The key is designed rather than defaulted: parameters sorted to " + str(key_orderings_after_sorting) + " ordering,")
print("only " + str(query_parameters_allowlisted) + " allowlisted so tracking cannot fragment it, purges verified by")
print("refetching, and a " + str(hit_rate_per_myriad) + " per ten thousand hit rate. It is built from the URL while")
print(str(headers_the_body_depends_on) + " headers change the body, with " + str(headers_in_the_cache_key) + " in the key and " + str(vary_headers_set_by_the_origin) + " Vary declared, so")
print(str(responses_served_a_body_built_for_another_header_value) + " responses a day - " + str(wrong_variant_per_myriad) + " per ten thousand - are hits built for someone else.")
```

## stdout (executed)

```text
responses per day               : 84000000
  served from cache             : 78960000
  hit rate                      : 9400 per ten thousand

query parameters allowlisted    : 6
key orderings after sorting     : 1
headers the body depends on     : 3
  in the cache key              : 0
  declared by a Vary            : 0

responses depending on such a header : 2100000
  that happened to match        : 1790000
  built for another value       : 310000
  share of all responses        : 36 per ten thousand

the cache key
  query parameters : sorted, so one request has
    1 key rather than one per ordering
  parameters allowlisted : 6, so tracking parameters
    cannot fragment the cache
  purge on deploy : verified by refetching, not assumed
  hit rate : 9400 per ten thousand
  verdict : KEYED

  an allowlist rather than a denylist is the choice that
  keeps this hit rate, and it was made on purpose

the inputs to the key
  the path            : in the key
  allowlisted query   : in the key
  everything else in the query : deliberately excluded,
    and correctly
  the headers         : 0 of 3 that change the body
  who would declare that dependency : the origin, with a
    Vary header
  Vary headers it sets : 0

  the key is a complete description of the URL and the
  response is not a function of the URL alone

the ones that match
  responses depending on a header : 2100000
  of those, matching by coincidence : 1790000
  why : whichever value populated the entry is the
    common one, and most requests carry it
  what that makes the wrong ones look like : a handful of
    unrelated reports
  what they are : 310000 a day

one hit
  the claim : this stored response is the response the
    origin would produce for this request
  what makes that true : the request and the stored one
    agree on everything the origin reads
  what the cache compares : the key
  what the origin reads : the key, plus 3 headers
  who is supposed to close that gap : the origin, by
    declaring Vary

the hit rate
  what it measures : entries found
  what a wrong-variant response is : an entry found
  so its effect on the rate : raises it
  hit rate now : 9400 per ten thousand
  a correctness metric on variants : none defined

null control - Vary is declared and the key includes it
  headers in the key : 3
  wrong-variant responses : 0
  hit rate : 8900 per ten thousand, down from 9400
  the cache did not get worse; the number went down
  because it had been counting responses that were found
  and wrong

what a well-designed cache key guarantees
  two requests with the same key get the same response :
    exactly, and the key was designed so that the right
    requests share one
  a cached response is the right response : not
    addressed; that holds when the key names everything
    the answer depends on, which is a fact about the
    origin, not about the key

a cache is a memo table for a function, so its correctness
is a claim about the function's arguments; a key that is
carefully complete over the URL is complete over the URL

The key is designed rather than defaulted: parameters sorted to 1 ordering,
only 6 allowlisted so tracking cannot fragment it, purges verified by
refetching, and a 9400 per ten thousand hit rate. It is built from the URL while
3 headers change the body, with 0 in the key and 0 Vary declared, so
310000 responses a day - 36 per ten thousand - are hits built for someone else.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
