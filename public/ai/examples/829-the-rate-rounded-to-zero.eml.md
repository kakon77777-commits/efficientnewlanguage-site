<!-- canonical: efficientnewlanguage.org/ai/examples/829-the-rate-rounded-to-zero | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 829 — The rate rounded to zero

`the_rate_rounded_to_zero.eml` - The error rate reads zero per ten thousand and the arithmetic that produced it is exact. What resolution that unit has, against how rare the errors are, is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The error rate
# reads zero per ten thousand and the arithmetic that produced it is exact. What
# resolution that unit has, against how rare the errors are, is computed below.
#
# The rate is computed honestly. It counts real failed requests, not a sample;
# the denominator is every request, not a subset; the division is integer and
# deterministic; and the figure is the same one the alert reads and the report
# prints.
#
# The unit is per ten thousand, and thirty-seven errors in nine hundred thousand
# requests is finer than one part in ten thousand.

37 => errors
900000 => requests
1 => alert_fires_at_per_myriad

int(errors * 10000 / requests) => error_rate_per_myriad
int(errors * 100000000 / requests) => error_rate_per_hundred_million
int(requests / errors) => one_error_every_n_requests
0 => alerts_that_fired

"errors                          : " + str(errors) ^0
"requests                        : " + str(requests) ^0
"error rate                      : " + str(error_rate_per_myriad) + " per ten thousand" ^0
"  at a finer scale              : " + str(error_rate_per_hundred_million) + " per hundred million" ^0
"  which is one error every      : " + str(one_error_every_n_requests) + " requests" ^0
"alert fires at                  : " + str(alert_fires_at_per_myriad) + " per ten thousand" ^0
"alerts that fired               : " + str(alerts_that_fired) ^0
"" ^0

# ---- what the rate verified ----

"the error rate" ^0
"  counts : real failed requests, not a sample" ^0
"  denominator : every request" ^0
"  division : integer, deterministic" ^0
"  same figure : alert reads it and the report prints it" ^0
"  errors miscounted : 0" ^0
"  verdict : ZERO PER TEN THOUSAND" ^0
"" ^0
"  one denominator over every request rather than a sampled" ^0
"  subset is the part done right here, and it is why the" ^0
"  rate is not a lucky window" ^0
"" ^0

# ---- what the unit cannot show ----

"the resolution of per-ten-thousand" ^0
"  one unit of it : one error in ten thousand requests" ^0
"  the actual rate : one error in " + str(one_error_every_n_requests) + " requests" ^0
"  finer than the unit by : about a factor of two and a" ^0
"    half" ^0
"  so int(errors * 10000 / requests) : truncates to 0" ^0
"  what 0 per ten thousand reads as : no errors" ^0
"" ^0

# ---- what zero is standing in for ----

"the errors behind the zero" ^0
"  errors that happened : " + str(errors) ^0
"  what the rate says happened : none" ^0
"  the same errors, per hundred million : " ^0
"    " + str(error_rate_per_hundred_million) ^0
"  is the arithmetic wrong : no; the truncation is exact" ^0
"  is zero the count : no; it is the count divided into a" ^0
"    unit too coarse to hold it" ^0
"" ^0

# ---- null control ----

# The same errors, reported at a resolution fine enough to represent them, and
# alerted on the raw count as well as the rate.
0 => nc_rate_per_myriad
4111 => nc_rate_per_hundred_million
1 => nc_alerts_when_the_count_is_watched

"null control - report a finer unit, alert on the count" ^0
"  rate per ten thousand : " + str(nc_rate_per_myriad) + ", unchanged" ^0
"  rate per hundred million : " + str(nc_rate_per_hundred_million) ^0
"  alerts when the raw count is watched : " ^0
"    " + str(nc_alerts_when_the_count_is_watched) ^0
"  no error and no request changed; the reported unit" ^0
"  stopped being coarser than the thing it reports" ^0
"" ^0

# ---- the rule ----

"what a zero error rate guarantees" ^0
"  errors divided into ten thousand parts rounds below one" ^0
"    part : exactly, real count over every request" ^0
"  there were no errors : not addressed; the rate is" ^0
"    int(errors * 10000 / requests) and " + str(errors) + " errors over " ^0
"    " + str(requests) + " truncates to 0 per ten thousand - the " + str(errors) + " errors" ^0
"    are real; at a finer scale it is " + str(error_rate_per_hundred_million) + " per hundred" ^0
"    million" ^0
"" ^0

"a rate is a count divided into a unit, and a unit coarser than the count rounds" ^0
"it to nothing; zero at ten thousand is not the absence of errors, it is the" ^0
"presence of fewer than the unit can name" ^0
"" ^0

"It counts real failures over every request with an exact integer division -" ^0
"zero per ten thousand. That unit is coarser than one error in " + str(one_error_every_n_requests) + " requests," ^0
"so " + str(errors) + " real errors truncate to 0 and fire " + str(alerts_that_fired) + " alerts, while the same errors" ^0
"are " + str(error_rate_per_hundred_million) + " per hundred million." ^0
```

## Python (deterministic transpilation)

```python
errors = 37
requests = 900000
alert_fires_at_per_myriad = 1
error_rate_per_myriad = int(errors * 10000 / requests)
error_rate_per_hundred_million = int(errors * 100000000 / requests)
one_error_every_n_requests = int(requests / errors)
alerts_that_fired = 0
print("errors                          : " + str(errors))
print("requests                        : " + str(requests))
print("error rate                      : " + str(error_rate_per_myriad) + " per ten thousand")
print("  at a finer scale              : " + str(error_rate_per_hundred_million) + " per hundred million")
print("  which is one error every      : " + str(one_error_every_n_requests) + " requests")
print("alert fires at                  : " + str(alert_fires_at_per_myriad) + " per ten thousand")
print("alerts that fired               : " + str(alerts_that_fired))
print("")
print("the error rate")
print("  counts : real failed requests, not a sample")
print("  denominator : every request")
print("  division : integer, deterministic")
print("  same figure : alert reads it and the report prints it")
print("  errors miscounted : 0")
print("  verdict : ZERO PER TEN THOUSAND")
print("")
print("  one denominator over every request rather than a sampled")
print("  subset is the part done right here, and it is why the")
print("  rate is not a lucky window")
print("")
print("the resolution of per-ten-thousand")
print("  one unit of it : one error in ten thousand requests")
print("  the actual rate : one error in " + str(one_error_every_n_requests) + " requests")
print("  finer than the unit by : about a factor of two and a")
print("    half")
print("  so int(errors * 10000 / requests) : truncates to 0")
print("  what 0 per ten thousand reads as : no errors")
print("")
print("the errors behind the zero")
print("  errors that happened : " + str(errors))
print("  what the rate says happened : none")
print("  the same errors, per hundred million : ")
print("    " + str(error_rate_per_hundred_million))
print("  is the arithmetic wrong : no; the truncation is exact")
print("  is zero the count : no; it is the count divided into a")
print("    unit too coarse to hold it")
print("")
nc_rate_per_myriad = 0
nc_rate_per_hundred_million = 4111
nc_alerts_when_the_count_is_watched = 1
print("null control - report a finer unit, alert on the count")
print("  rate per ten thousand : " + str(nc_rate_per_myriad) + ", unchanged")
print("  rate per hundred million : " + str(nc_rate_per_hundred_million))
print("  alerts when the raw count is watched : ")
print("    " + str(nc_alerts_when_the_count_is_watched))
print("  no error and no request changed; the reported unit")
print("  stopped being coarser than the thing it reports")
print("")
print("what a zero error rate guarantees")
print("  errors divided into ten thousand parts rounds below one")
print("    part : exactly, real count over every request")
print("  there were no errors : not addressed; the rate is")
print("    int(errors * 10000 / requests) and " + str(errors) + " errors over ")
print("    " + str(requests) + " truncates to 0 per ten thousand - the " + str(errors) + " errors")
print("    are real; at a finer scale it is " + str(error_rate_per_hundred_million) + " per hundred")
print("    million")
print("")
print("a rate is a count divided into a unit, and a unit coarser than the count rounds")
print("it to nothing; zero at ten thousand is not the absence of errors, it is the")
print("presence of fewer than the unit can name")
print("")
print("It counts real failures over every request with an exact integer division -")
print("zero per ten thousand. That unit is coarser than one error in " + str(one_error_every_n_requests) + " requests,")
print("so " + str(errors) + " real errors truncate to 0 and fire " + str(alerts_that_fired) + " alerts, while the same errors")
print("are " + str(error_rate_per_hundred_million) + " per hundred million.")
```

## stdout (executed)

```text
errors                          : 37
requests                        : 900000
error rate                      : 0 per ten thousand
  at a finer scale              : 4111 per hundred million
  which is one error every      : 24324 requests
alert fires at                  : 1 per ten thousand
alerts that fired               : 0

the error rate
  counts : real failed requests, not a sample
  denominator : every request
  division : integer, deterministic
  same figure : alert reads it and the report prints it
  errors miscounted : 0
  verdict : ZERO PER TEN THOUSAND

  one denominator over every request rather than a sampled
  subset is the part done right here, and it is why the
  rate is not a lucky window

the resolution of per-ten-thousand
  one unit of it : one error in ten thousand requests
  the actual rate : one error in 24324 requests
  finer than the unit by : about a factor of two and a
    half
  so int(errors * 10000 / requests) : truncates to 0
  what 0 per ten thousand reads as : no errors

the errors behind the zero
  errors that happened : 37
  what the rate says happened : none
  the same errors, per hundred million : 
    4111
  is the arithmetic wrong : no; the truncation is exact
  is zero the count : no; it is the count divided into a
    unit too coarse to hold it

null control - report a finer unit, alert on the count
  rate per ten thousand : 0, unchanged
  rate per hundred million : 4111
  alerts when the raw count is watched : 
    1
  no error and no request changed; the reported unit
  stopped being coarser than the thing it reports

what a zero error rate guarantees
  errors divided into ten thousand parts rounds below one
    part : exactly, real count over every request
  there were no errors : not addressed; the rate is
    int(errors * 10000 / requests) and 37 errors over 
    900000 truncates to 0 per ten thousand - the 37 errors
    are real; at a finer scale it is 4111 per hundred
    million

a rate is a count divided into a unit, and a unit coarser than the count rounds
it to nothing; zero at ten thousand is not the absence of errors, it is the
presence of fewer than the unit can name

It counts real failures over every request with an exact integer division -
zero per ten thousand. That unit is coarser than one error in 24324 requests,
so 37 real errors truncate to 0 and fire 0 alerts, while the same errors
are 4111 per hundred million.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
