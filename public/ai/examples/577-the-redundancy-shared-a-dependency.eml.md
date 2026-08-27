<!-- canonical: efficientnewlanguage.org/ai/examples/577-the-redundancy-shared-a-dependency | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 577 — The redundancy shared a dependency

`the_redundancy_shared_a_dependency.eml` - The service runs in three availability zones. Each zone is measured at 99.9 percent. The availability the three of them actually provide is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The service runs
# in three availability zones. Each zone is measured at 99.9 percent. The
# availability the three of them actually provide is computed below.
#
# Three zones is the right architecture and the reasoning behind it is sound.
# Zones fail independently by design: separate power, separate cooling,
# separate network, and the provider contracts on exactly that independence.
# Three is the smallest number that survives one loss and still holds a
# quorum. The 99.9 per zone is not a marketing figure either - it was measured
# over a year of real operation.
#
# Independent failures multiply. Every zone fetches its TLS certificate from
# one internal certificate authority at startup and on renewal. That authority
# was never part of the availability calculation because it is not a zone; it
# is a small internal service that had never gone down.
#
# A product of independent terms is only as independent as its least
# independent term. Adding a fourth zone, or a tenth, moves the product term
# and leaves the shared term exactly where it is.

3 => zones
1 => per_zone_unavail_permille
5 => shared_unavail_permille
525600 => minutes_per_year

"zones                    : " + str(zones) ^0
"per-zone unavailability  : " + str(per_zone_unavail_permille) + " per mille, i.e. 99.9 percent" ^0
"shared CA unavailability : " + str(shared_unavail_permille) + " per ten thousand, i.e. 99.95 percent" ^0
"" ^0

# ---- the calculation that was done ----
#
# All three zones down at once, treating the zones as independent. Working in
# parts per thousand cubed keeps this exact in integers: 1/1000 cubed is
# 1 in 1000000000.

1000 => permille_base
permille_base * permille_base * permille_base => independent_denominator

"all three zones down at once, zones treated as independent" ^0
"  probability : 1 in " + str(independent_denominator) ^0
"  expected downtime from that cause : " + str(int(minutes_per_year * 60 / independent_denominator)) + " seconds per year" ^0
"  which rounds to zero on any dashboard" ^0
"" ^0

# ---- the term that was not in the calculation ----

int(minutes_per_year * shared_unavail_permille / 10000) => shared_minutes

"the certificate authority, which all three zones call" ^0
"  unavailability : " + str(shared_unavail_permille) + " per ten thousand" ^0
"  expected downtime : " + str(shared_minutes) + " minutes per year" ^0
"  during which all three zones are up and none of them can serve" ^0
"" ^0

"downtime attributable to" ^0
"  three zones failing together : less than 1 second per year" ^0
"  the one shared dependency    : " + str(shared_minutes) + " minutes per year" ^0
"  the second is larger than the first by a factor no dashboard shows," ^0
"  because the first was the only one that was ever computed" ^0
"" ^0

# ---- what another zone buys ----
#
# The independent term shrinks by a factor of 1000 per zone. The shared term
# does not move at all, and it is the whole of the answer.

"zones   independent term          shared term       total downtime/yr" ^0
for z in [1:6]:
    if z == 1:
        "  1     " + str(int(minutes_per_year * per_zone_unavail_permille / 1000)) + " min                 " + str(shared_minutes) + " min           " + str(int(minutes_per_year * per_zone_unavail_permille / 1000) + shared_minutes) + " min" ^0
    elif z == 2:
        "  2     " + str(int(minutes_per_year * 60 / (permille_base * permille_base))) + " sec                  " + str(shared_minutes) + " min           " + str(shared_minutes) + " min" ^0
    else:
        "  " + str(z) + "     under a second         " + str(shared_minutes) + " min           " + str(shared_minutes) + " min" ^0
"" ^0
"  from two zones onward the answer stops changing" ^0
"  every zone after the second costs money and buys nothing measurable" ^0
"" ^0

# ---- where the shared term hides ----
#
# It is not in the zone list, so it is not in the zone calculation. Every
# question the review asked was about zones.

"questions the design review asked" ^0
"  are the zones independent            yes, contractually" ^0
"  does the service survive one zone    yes, demonstrated" ^0
"  does it survive two zones            yes, demonstrated" ^0
"  is there anything all three call     not asked" ^0
"" ^0
"  the first three questions are about the term that was already negligible" ^0
"  the fourth is about the term that is the entire answer" ^0
"" ^0

# ---- the control ----
#
# The zones really are independent, and the measurement proving it is real: a
# zone loss was exercised and the service stayed up. That drill passes under
# both architectures, which is why it could not distinguish them.

"control - the zone-failure drill, which passed" ^0
"  zones killed in the drill : 1" ^0
"  service stayed up         : yes" ^0
"  zones killed             : 2" ^0
"  service stayed up         : yes" ^0
"  what the drill would show if the CA were also killed : not run" ^0
"  the drill exercises the independent term and is silent on the other" ^0
"  a drill that kills a zone cannot find a dependency shared BY zones" ^0
"" ^0

# ---- the null control ----
#
# The same three zones with a per-zone certificate cache that survives a CA
# outage. The shared term leaves the calculation and the independent term is
# once again the whole answer - which is what the design review believed it
# was measuring all along.

"null control - the same three zones, certificate cached per zone" ^0
"  shared dependency at request time : none" ^0
"  downtime from three zones failing : under a second per year" ^0
"  downtime from the CA              : 0 minutes, requests do not reach it" ^0
"  total                             : under a second per year" ^0
"  the architecture is unchanged; one call moved off the request path" ^0
"  so the finding is not 'three zones is wrong'" ^0
"  it is 'a product of independent terms is worth exactly as much as its" ^0
"  least independent term'" ^0
"" ^0

# ---- the rule ----

"how to find the term that is missing from an availability product" ^0
"  list the components               done, three zones" ^0
"  multiply their failure rates      done, and it is negligible" ^0
"  list what EVERY component calls   this is the missing step" ^0
"  a dependency shared by all N does not appear in any per-component review" ^0
"  and it is not reduced by raising N" ^0
"" ^0

"Zones fail independently by contract, three is the smallest number that holds" ^0
"a quorum after one loss, and the 99.9 was measured over a real year. The" ^0
"three-zone term contributes under a second of downtime a year. The one" ^0
"service all three call contributes " + str(shared_minutes) + " minutes, it was never in the" ^0
"calculation because it is not a zone, and a fourth zone would not have" ^0
"changed it by a single second." ^0
```

## Python (deterministic transpilation)

```python
zones = 3
per_zone_unavail_permille = 1
shared_unavail_permille = 5
minutes_per_year = 525600
print("zones                    : " + str(zones))
print("per-zone unavailability  : " + str(per_zone_unavail_permille) + " per mille, i.e. 99.9 percent")
print("shared CA unavailability : " + str(shared_unavail_permille) + " per ten thousand, i.e. 99.95 percent")
print("")
permille_base = 1000
independent_denominator = permille_base * permille_base * permille_base
print("all three zones down at once, zones treated as independent")
print("  probability : 1 in " + str(independent_denominator))
print("  expected downtime from that cause : " + str(int(minutes_per_year * 60 / independent_denominator)) + " seconds per year")
print("  which rounds to zero on any dashboard")
print("")
shared_minutes = int(minutes_per_year * shared_unavail_permille / 10000)
print("the certificate authority, which all three zones call")
print("  unavailability : " + str(shared_unavail_permille) + " per ten thousand")
print("  expected downtime : " + str(shared_minutes) + " minutes per year")
print("  during which all three zones are up and none of them can serve")
print("")
print("downtime attributable to")
print("  three zones failing together : less than 1 second per year")
print("  the one shared dependency    : " + str(shared_minutes) + " minutes per year")
print("  the second is larger than the first by a factor no dashboard shows,")
print("  because the first was the only one that was ever computed")
print("")
print("zones   independent term          shared term       total downtime/yr")
for z in range(1, 7):
    if z == 1:
        print("  1     " + str(int(minutes_per_year * per_zone_unavail_permille / 1000)) + " min                 " + str(shared_minutes) + " min           " + str(int(minutes_per_year * per_zone_unavail_permille / 1000) + shared_minutes) + " min")
    elif z == 2:
        print("  2     " + str(int(minutes_per_year * 60 / (permille_base * permille_base))) + " sec                  " + str(shared_minutes) + " min           " + str(shared_minutes) + " min")
    else:
        print("  " + str(z) + "     under a second         " + str(shared_minutes) + " min           " + str(shared_minutes) + " min")
print("")
print("  from two zones onward the answer stops changing")
print("  every zone after the second costs money and buys nothing measurable")
print("")
print("questions the design review asked")
print("  are the zones independent            yes, contractually")
print("  does the service survive one zone    yes, demonstrated")
print("  does it survive two zones            yes, demonstrated")
print("  is there anything all three call     not asked")
print("")
print("  the first three questions are about the term that was already negligible")
print("  the fourth is about the term that is the entire answer")
print("")
print("control - the zone-failure drill, which passed")
print("  zones killed in the drill : 1")
print("  service stayed up         : yes")
print("  zones killed             : 2")
print("  service stayed up         : yes")
print("  what the drill would show if the CA were also killed : not run")
print("  the drill exercises the independent term and is silent on the other")
print("  a drill that kills a zone cannot find a dependency shared BY zones")
print("")
print("null control - the same three zones, certificate cached per zone")
print("  shared dependency at request time : none")
print("  downtime from three zones failing : under a second per year")
print("  downtime from the CA              : 0 minutes, requests do not reach it")
print("  total                             : under a second per year")
print("  the architecture is unchanged; one call moved off the request path")
print("  so the finding is not 'three zones is wrong'")
print("  it is 'a product of independent terms is worth exactly as much as its")
print("  least independent term'")
print("")
print("how to find the term that is missing from an availability product")
print("  list the components               done, three zones")
print("  multiply their failure rates      done, and it is negligible")
print("  list what EVERY component calls   this is the missing step")
print("  a dependency shared by all N does not appear in any per-component review")
print("  and it is not reduced by raising N")
print("")
print("Zones fail independently by contract, three is the smallest number that holds")
print("a quorum after one loss, and the 99.9 was measured over a real year. The")
print("three-zone term contributes under a second of downtime a year. The one")
print("service all three call contributes " + str(shared_minutes) + " minutes, it was never in the")
print("calculation because it is not a zone, and a fourth zone would not have")
print("changed it by a single second.")
```

## stdout (executed)

```text
zones                    : 3
per-zone unavailability  : 1 per mille, i.e. 99.9 percent
shared CA unavailability : 5 per ten thousand, i.e. 99.95 percent

all three zones down at once, zones treated as independent
  probability : 1 in 1000000000
  expected downtime from that cause : 0 seconds per year
  which rounds to zero on any dashboard

the certificate authority, which all three zones call
  unavailability : 5 per ten thousand
  expected downtime : 262 minutes per year
  during which all three zones are up and none of them can serve

downtime attributable to
  three zones failing together : less than 1 second per year
  the one shared dependency    : 262 minutes per year
  the second is larger than the first by a factor no dashboard shows,
  because the first was the only one that was ever computed

zones   independent term          shared term       total downtime/yr
  1     525 min                 262 min           787 min
  2     31 sec                  262 min           262 min
  3     under a second         262 min           262 min
  4     under a second         262 min           262 min
  5     under a second         262 min           262 min
  6     under a second         262 min           262 min

  from two zones onward the answer stops changing
  every zone after the second costs money and buys nothing measurable

questions the design review asked
  are the zones independent            yes, contractually
  does the service survive one zone    yes, demonstrated
  does it survive two zones            yes, demonstrated
  is there anything all three call     not asked

  the first three questions are about the term that was already negligible
  the fourth is about the term that is the entire answer

control - the zone-failure drill, which passed
  zones killed in the drill : 1
  service stayed up         : yes
  zones killed             : 2
  service stayed up         : yes
  what the drill would show if the CA were also killed : not run
  the drill exercises the independent term and is silent on the other
  a drill that kills a zone cannot find a dependency shared BY zones

null control - the same three zones, certificate cached per zone
  shared dependency at request time : none
  downtime from three zones failing : under a second per year
  downtime from the CA              : 0 minutes, requests do not reach it
  total                             : under a second per year
  the architecture is unchanged; one call moved off the request path
  so the finding is not 'three zones is wrong'
  it is 'a product of independent terms is worth exactly as much as its
  least independent term'

how to find the term that is missing from an availability product
  list the components               done, three zones
  multiply their failure rates      done, and it is negligible
  list what EVERY component calls   this is the missing step
  a dependency shared by all N does not appear in any per-component review
  and it is not reduced by raising N

Zones fail independently by contract, three is the smallest number that holds
a quorum after one loss, and the 99.9 was measured over a real year. The
three-zone term contributes under a second of downtime a year. The one
service all three call contributes 262 minutes, it was never in the
calculation because it is not a zone, and a fourth zone would not have
changed it by a single second.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
