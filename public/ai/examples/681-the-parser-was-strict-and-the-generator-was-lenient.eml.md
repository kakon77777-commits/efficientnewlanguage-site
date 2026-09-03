<!-- canonical: efficientnewlanguage.org/ai/examples/681-the-parser-was-strict-and-the-generator-was-lenient | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 681 — The parser was strict and the generator was lenient

`the_parser_was_strict_and_the_generator_was_lenient.eml` - The parser rejects anything the specification does not require it to accept, deliberately. How many times that strictness has fired is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The parser rejects
# anything the specification does not require it to accept, deliberately. How
# many times that strictness has fired is computed below.
#
# The strictness was chosen and defended. Accepting near-misses is how a format
# acquires an undocumented dialect that later becomes mandatory, so this parser
# refuses: no trailing commas, no duplicate keys, no implicit coercion, and a
# clear error naming the byte offset. The decision is right and the team has
# turned down two requests to loosen it.
#
# Strictness on INPUT protects us from other people's output. The direction
# that decides whether other people can read US is the generator, and nothing
# argued about that one.
#
# Every file this parser sees comes from that generator.

2400000 => files_parsed_per_day
0 => rejections_per_day
5 => third_party_parsers_tested
3 => third_party_parsers_that_reject_our_output
1840 => external_consumers
2 => requests_to_loosen_the_parser_declined

third_party_parsers_tested - third_party_parsers_that_reject_our_output => third_party_parsers_that_accept
int(external_consumers * third_party_parsers_that_reject_our_output / third_party_parsers_tested) => consumers_likely_affected

"files parsed per day        : " + str(files_parsed_per_day) ^0
"rejections per day          : " + str(rejections_per_day) ^0
"" ^0
"third-party parsers tested  : " + str(third_party_parsers_tested) ^0
"  accept our output         : " + str(third_party_parsers_that_accept) ^0
"  reject our output         : " + str(third_party_parsers_that_reject_our_output) ^0
"external consumers          : " + str(external_consumers) ^0
"likely affected             : " + str(consumers_likely_affected) ^0
"" ^0

# ---- what the strict parser verified ----

"the parser" ^0
"  trailing commas    : rejected" ^0
"  duplicate keys     : rejected" ^0
"  implicit coercion  : rejected" ^0
"  error message      : names the byte offset" ^0
"  requests to loosen it, declined : " + str(requests_to_loosen_the_parser_declined) ^0
"  verdict            : STRICT" ^0
"" ^0
"  refusing near-misses is how a format avoids acquiring an" ^0
"  undocumented dialect, and that reasoning is sound" ^0
"" ^0

# ---- where its input comes from ----

"the population it guards" ^0
"  files parsed per day : " + str(files_parsed_per_day) ^0
"  produced by our own generator : all of them" ^0
"  produced by a third party     : none" ^0
"  rejections           : " + str(rejections_per_day) ^0
"" ^0
"  the strictness has never fired, which is consistent with" ^0
"  it working and with there being nothing for it to catch" ^0
"" ^0

int(third_party_parsers_that_reject_our_output * 10000 / third_party_parsers_tested) => rejecting_share_per_myriad
"share of tested parsers that reject us : " + str(rejecting_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the generator emits ----

# An optional construct the specification permits and most implementations do
# not support. Our own parser accepts it, which is the only reason nobody
# noticed: the round trip through our own tools is clean.
"the round trip" ^0
"  our generator to our parser : clean" ^0
"  our generator to theirs     : " + str(third_party_parsers_that_reject_our_output) + " of " + str(third_party_parsers_tested) + " refuse" ^0
"  the construct               : permitted by the spec," ^0
"    supported by few" ^0
"  who tested the second row before a customer did : nobody" ^0
"" ^0

# ---- null control ----

# The same parser, with the generator restricted to the intersection every
# tested implementation accepts.
third_party_parsers_tested => nc_parsers_that_accept
0 => nc_consumers_affected

"null control - the generator emits the common subset" ^0
"  parser strictness   : unchanged, still strict" ^0
"  parsers accepting our output : " + str(nc_parsers_that_accept) ^0
"  consumers affected  : " + str(nc_consumers_affected) ^0
"  the parser did not loosen; the generator stopped using" ^0
"  a permission nobody else implements" ^0
"" ^0

# ---- the rule ----

"what a strict parser guarantees" ^0
"  we do not accept malformed input : exactly" ^0
"  we do not emit unreadable output : not addressed, and" ^0
"    the two are different directions with different" ^0
"    counterparties" ^0
"" ^0
"be strict in what you accept and conservative in what you" ^0
"send is one sentence with two halves; a project can argue" ^0
"the first half for years while the second is whatever the" ^0
"library happened to do" ^0
"" ^0

"The parser is strict on every axis and the strictness was defended twice: no" ^0
"trailing commas, no duplicate keys, no coercion, errors naming the byte offset." ^0
"All " + str(files_parsed_per_day) + " files a day come from our own generator, so it has fired " + str(rejections_per_day) ^0
"times, while that generator emits a spec-permitted construct " + str(third_party_parsers_that_reject_our_output) + " of " + str(third_party_parsers_tested) + " other" ^0
"parsers refuse - " + str(rejecting_share_per_myriad) + " per ten thousand - reaching about " + str(consumers_likely_affected) + " external consumers." ^0
```

## Python (deterministic transpilation)

```python
files_parsed_per_day = 2400000
rejections_per_day = 0
third_party_parsers_tested = 5
third_party_parsers_that_reject_our_output = 3
external_consumers = 1840
requests_to_loosen_the_parser_declined = 2
third_party_parsers_that_accept = third_party_parsers_tested - third_party_parsers_that_reject_our_output
consumers_likely_affected = int(external_consumers * third_party_parsers_that_reject_our_output / third_party_parsers_tested)
print("files parsed per day        : " + str(files_parsed_per_day))
print("rejections per day          : " + str(rejections_per_day))
print("")
print("third-party parsers tested  : " + str(third_party_parsers_tested))
print("  accept our output         : " + str(third_party_parsers_that_accept))
print("  reject our output         : " + str(third_party_parsers_that_reject_our_output))
print("external consumers          : " + str(external_consumers))
print("likely affected             : " + str(consumers_likely_affected))
print("")
print("the parser")
print("  trailing commas    : rejected")
print("  duplicate keys     : rejected")
print("  implicit coercion  : rejected")
print("  error message      : names the byte offset")
print("  requests to loosen it, declined : " + str(requests_to_loosen_the_parser_declined))
print("  verdict            : STRICT")
print("")
print("  refusing near-misses is how a format avoids acquiring an")
print("  undocumented dialect, and that reasoning is sound")
print("")
print("the population it guards")
print("  files parsed per day : " + str(files_parsed_per_day))
print("  produced by our own generator : all of them")
print("  produced by a third party     : none")
print("  rejections           : " + str(rejections_per_day))
print("")
print("  the strictness has never fired, which is consistent with")
print("  it working and with there being nothing for it to catch")
print("")
rejecting_share_per_myriad = int(third_party_parsers_that_reject_our_output * 10000 / third_party_parsers_tested)
print("share of tested parsers that reject us : " + str(rejecting_share_per_myriad) + " per ten thousand")
print("")
print("the round trip")
print("  our generator to our parser : clean")
print("  our generator to theirs     : " + str(third_party_parsers_that_reject_our_output) + " of " + str(third_party_parsers_tested) + " refuse")
print("  the construct               : permitted by the spec,")
print("    supported by few")
print("  who tested the second row before a customer did : nobody")
print("")
nc_parsers_that_accept = third_party_parsers_tested
nc_consumers_affected = 0
print("null control - the generator emits the common subset")
print("  parser strictness   : unchanged, still strict")
print("  parsers accepting our output : " + str(nc_parsers_that_accept))
print("  consumers affected  : " + str(nc_consumers_affected))
print("  the parser did not loosen; the generator stopped using")
print("  a permission nobody else implements")
print("")
print("what a strict parser guarantees")
print("  we do not accept malformed input : exactly")
print("  we do not emit unreadable output : not addressed, and")
print("    the two are different directions with different")
print("    counterparties")
print("")
print("be strict in what you accept and conservative in what you")
print("send is one sentence with two halves; a project can argue")
print("the first half for years while the second is whatever the")
print("library happened to do")
print("")
print("The parser is strict on every axis and the strictness was defended twice: no")
print("trailing commas, no duplicate keys, no coercion, errors naming the byte offset.")
print("All " + str(files_parsed_per_day) + " files a day come from our own generator, so it has fired " + str(rejections_per_day))
print("times, while that generator emits a spec-permitted construct " + str(third_party_parsers_that_reject_our_output) + " of " + str(third_party_parsers_tested) + " other")
print("parsers refuse - " + str(rejecting_share_per_myriad) + " per ten thousand - reaching about " + str(consumers_likely_affected) + " external consumers.")
```

## stdout (executed)

```text
files parsed per day        : 2400000
rejections per day          : 0

third-party parsers tested  : 5
  accept our output         : 2
  reject our output         : 3
external consumers          : 1840
likely affected             : 1104

the parser
  trailing commas    : rejected
  duplicate keys     : rejected
  implicit coercion  : rejected
  error message      : names the byte offset
  requests to loosen it, declined : 2
  verdict            : STRICT

  refusing near-misses is how a format avoids acquiring an
  undocumented dialect, and that reasoning is sound

the population it guards
  files parsed per day : 2400000
  produced by our own generator : all of them
  produced by a third party     : none
  rejections           : 0

  the strictness has never fired, which is consistent with
  it working and with there being nothing for it to catch

share of tested parsers that reject us : 6000 per ten thousand

the round trip
  our generator to our parser : clean
  our generator to theirs     : 3 of 5 refuse
  the construct               : permitted by the spec,
    supported by few
  who tested the second row before a customer did : nobody

null control - the generator emits the common subset
  parser strictness   : unchanged, still strict
  parsers accepting our output : 5
  consumers affected  : 0
  the parser did not loosen; the generator stopped using
  a permission nobody else implements

what a strict parser guarantees
  we do not accept malformed input : exactly
  we do not emit unreadable output : not addressed, and
    the two are different directions with different
    counterparties

be strict in what you accept and conservative in what you
send is one sentence with two halves; a project can argue
the first half for years while the second is whatever the
library happened to do

The parser is strict on every axis and the strictness was defended twice: no
trailing commas, no duplicate keys, no coercion, errors naming the byte offset.
All 2400000 files a day come from our own generator, so it has fired 0
times, while that generator emits a spec-permitted construct 3 of 5 other
parsers refuse - 6000 per ten thousand - reaching about 1104 external consumers.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
