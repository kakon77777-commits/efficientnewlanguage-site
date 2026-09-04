<!-- canonical: efficientnewlanguage.org/ai/examples/696-the-hash-was-salted-and-the-salt-was-constant | ai_layer_version: 0.1.0 | updated: 2026-09-04 -->

# Example 696 — The hash was salted and the salt was constant

`the_hash_was_salted_and_the_salt_was_constant.eml` - Passwords are salted and stretched with a tuned work factor, and no password is stored. How many users share a stored value is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Passwords are
# salted and stretched with a tuned work factor, and no password is stored. How
# many users share a stored value is computed below.
#
# The hashing is not naive. It is a memory-hard derivation rather than a bare
# digest, the work factor was measured against the login endpoint's budget and
# set to two hundred and forty milliseconds, the output is compared in constant
# time, and a plaintext password has never been written anywhere. Every review
# of this code has passed it.
#
# A salt's purpose is to make two identical passwords produce two different
# stored values, so that one precomputed table cannot serve the whole database.
# It does that by being DIFFERENT PER RECORD.
#
# This salt comes from the configuration file. There is one of it.

2400000 => users
1780000 => distinct_stored_values
1 => salts_in_use
240 => work_factor_ms
41000 => users_on_the_most_common_password
0 => plaintext_passwords_stored

users - distinct_stored_values => users_sharing_a_value_with_someone
int(users_sharing_a_value_with_someone * 10000 / users) => sharing_per_myriad

"users                        : " + str(users) ^0
"distinct stored values       : " + str(distinct_stored_values) ^0
"sharing a value with someone : " + str(users_sharing_a_value_with_someone) ^0
"share                        : " + str(sharing_per_myriad) + " per ten thousand" ^0
"" ^0
"salts in use                 : " + str(salts_in_use) ^0
"work factor, ms              : " + str(work_factor_ms) ^0
"plaintext passwords stored   : " + str(plaintext_passwords_stored) ^0
"" ^0

# ---- what the hashing verified ----

"the derivation" ^0
"  memory-hard rather than a bare digest : yes" ^0
"  work factor measured against the endpoint budget : yes" ^0
"  comparison in constant time : yes" ^0
"  plaintext written anywhere  : " + str(plaintext_passwords_stored) ^0
"  reviews passed              : all" ^0
"  verdict                     : PROPERLY HASHED" ^0
"" ^0
"  none of that is nominal; the work factor alone is worth" ^0
"  more than most deployments manage" ^0
"" ^0

# ---- what a salt is for ----

"the property a salt supplies" ^0
"  two identical passwords must store differently : that is" ^0
"    the whole of it" ^0
"  how it does that : by differing per record" ^0
"  salts here       : " + str(salts_in_use) + ", from the configuration" ^0
"  so two identical passwords store : identically" ^0
"" ^0
"  the salt is present, is long, is random, and was" ^0
"  generated once" ^0
"" ^0

# ---- what one salt costs ----

# A precomputed table has to be built for this salt, which is work. It is built
# once and then serves every account, which is the property the salt existed to
# remove.
"an attacker with the database" ^0
"  tables needed for a per-record salt : " + str(users) ^0
"  tables needed here                  : " + str(salts_in_use) ^0
"  accounts one table serves           : " + str(users) ^0
"  accounts confirmed by one guess     : " + str(users_on_the_most_common_password) ^0
"" ^0
"  the work factor still applies to each guess; what is" ^0
"  gone is having to spend it again for the next account" ^0
"" ^0

int(users_on_the_most_common_password * 10000 / users) => most_common_per_myriad
"users behind the most common stored value : " + str(most_common_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what a review sees ----

"reading the code" ^0
"  a salt is read      : yes" ^0
"  it is concatenated correctly : yes" ^0
"  it is long and random : yes" ^0
"  where it comes from : a configuration value" ^0
"  is that per record  : the line does not say, and the" ^0
"    name of the variable is `salt`" ^0
"" ^0

# ---- null control ----

# The same derivation, with the salt generated per record and stored beside the
# hash, which is what every reference implementation does.
users => nc_distinct_stored_values
0 => nc_users_sharing_a_value
users => nc_tables_needed

"null control - a salt generated per record" ^0
"  work factor, ms       : " + str(work_factor_ms) + ", unchanged" ^0
"  distinct stored values: " + str(nc_distinct_stored_values) ^0
"  sharing a value       : " + str(nc_users_sharing_a_value) ^0
"  tables an attacker needs : " + str(nc_tables_needed) ^0
"  the derivation did not get stronger; the salt started" ^0
"  varying, which is the only thing it was ever for" ^0
"" ^0

# ---- the rule ----

"what a salted hash guarantees" ^0
"  the stored value is not the password : exactly" ^0
"  two accounts with one password differ : not addressed" ^0
"    unless the salt varies, and a constant salt satisfies" ^0
"    every other property a salt is described as having" ^0
"" ^0
"a salt is defined by its variation, not by its presence;" ^0
"long, random and correctly concatenated are the properties a" ^0
"reader checks, and none of them is the one that matters" ^0
"" ^0

"The derivation is memory-hard, tuned to " + str(work_factor_ms) + " ms, compared in constant time, with" ^0
str(plaintext_passwords_stored) + " plaintext passwords stored anywhere. There is " + str(salts_in_use) + " salt, so " + str(users_sharing_a_value_with_someone) + " users -" ^0
str(sharing_per_myriad) + " per ten thousand - share a stored value with somebody, one precomputed" ^0
"table serves all " + str(users) + " accounts, and a single correct guess confirms " + str(users_on_the_most_common_password) ^0
"of them at once." ^0
```

## Python (deterministic transpilation)

```python
users = 2400000
distinct_stored_values = 1780000
salts_in_use = 1
work_factor_ms = 240
users_on_the_most_common_password = 41000
plaintext_passwords_stored = 0
users_sharing_a_value_with_someone = users - distinct_stored_values
sharing_per_myriad = int(users_sharing_a_value_with_someone * 10000 / users)
print("users                        : " + str(users))
print("distinct stored values       : " + str(distinct_stored_values))
print("sharing a value with someone : " + str(users_sharing_a_value_with_someone))
print("share                        : " + str(sharing_per_myriad) + " per ten thousand")
print("")
print("salts in use                 : " + str(salts_in_use))
print("work factor, ms              : " + str(work_factor_ms))
print("plaintext passwords stored   : " + str(plaintext_passwords_stored))
print("")
print("the derivation")
print("  memory-hard rather than a bare digest : yes")
print("  work factor measured against the endpoint budget : yes")
print("  comparison in constant time : yes")
print("  plaintext written anywhere  : " + str(plaintext_passwords_stored))
print("  reviews passed              : all")
print("  verdict                     : PROPERLY HASHED")
print("")
print("  none of that is nominal; the work factor alone is worth")
print("  more than most deployments manage")
print("")
print("the property a salt supplies")
print("  two identical passwords must store differently : that is")
print("    the whole of it")
print("  how it does that : by differing per record")
print("  salts here       : " + str(salts_in_use) + ", from the configuration")
print("  so two identical passwords store : identically")
print("")
print("  the salt is present, is long, is random, and was")
print("  generated once")
print("")
print("an attacker with the database")
print("  tables needed for a per-record salt : " + str(users))
print("  tables needed here                  : " + str(salts_in_use))
print("  accounts one table serves           : " + str(users))
print("  accounts confirmed by one guess     : " + str(users_on_the_most_common_password))
print("")
print("  the work factor still applies to each guess; what is")
print("  gone is having to spend it again for the next account")
print("")
most_common_per_myriad = int(users_on_the_most_common_password * 10000 / users)
print("users behind the most common stored value : " + str(most_common_per_myriad) + " per ten thousand")
print("")
print("reading the code")
print("  a salt is read      : yes")
print("  it is concatenated correctly : yes")
print("  it is long and random : yes")
print("  where it comes from : a configuration value")
print("  is that per record  : the line does not say, and the")
print("    name of the variable is `salt`")
print("")
nc_distinct_stored_values = users
nc_users_sharing_a_value = 0
nc_tables_needed = users
print("null control - a salt generated per record")
print("  work factor, ms       : " + str(work_factor_ms) + ", unchanged")
print("  distinct stored values: " + str(nc_distinct_stored_values))
print("  sharing a value       : " + str(nc_users_sharing_a_value))
print("  tables an attacker needs : " + str(nc_tables_needed))
print("  the derivation did not get stronger; the salt started")
print("  varying, which is the only thing it was ever for")
print("")
print("what a salted hash guarantees")
print("  the stored value is not the password : exactly")
print("  two accounts with one password differ : not addressed")
print("    unless the salt varies, and a constant salt satisfies")
print("    every other property a salt is described as having")
print("")
print("a salt is defined by its variation, not by its presence;")
print("long, random and correctly concatenated are the properties a")
print("reader checks, and none of them is the one that matters")
print("")
print("The derivation is memory-hard, tuned to " + str(work_factor_ms) + " ms, compared in constant time, with")
print(str(plaintext_passwords_stored) + " plaintext passwords stored anywhere. There is " + str(salts_in_use) + " salt, so " + str(users_sharing_a_value_with_someone) + " users -")
print(str(sharing_per_myriad) + " per ten thousand - share a stored value with somebody, one precomputed")
print("table serves all " + str(users) + " accounts, and a single correct guess confirms " + str(users_on_the_most_common_password))
print("of them at once.")
```

## stdout (executed)

```text
users                        : 2400000
distinct stored values       : 1780000
sharing a value with someone : 620000
share                        : 2583 per ten thousand

salts in use                 : 1
work factor, ms              : 240
plaintext passwords stored   : 0

the derivation
  memory-hard rather than a bare digest : yes
  work factor measured against the endpoint budget : yes
  comparison in constant time : yes
  plaintext written anywhere  : 0
  reviews passed              : all
  verdict                     : PROPERLY HASHED

  none of that is nominal; the work factor alone is worth
  more than most deployments manage

the property a salt supplies
  two identical passwords must store differently : that is
    the whole of it
  how it does that : by differing per record
  salts here       : 1, from the configuration
  so two identical passwords store : identically

  the salt is present, is long, is random, and was
  generated once

an attacker with the database
  tables needed for a per-record salt : 2400000
  tables needed here                  : 1
  accounts one table serves           : 2400000
  accounts confirmed by one guess     : 41000

  the work factor still applies to each guess; what is
  gone is having to spend it again for the next account

users behind the most common stored value : 170 per ten thousand

reading the code
  a salt is read      : yes
  it is concatenated correctly : yes
  it is long and random : yes
  where it comes from : a configuration value
  is that per record  : the line does not say, and the
    name of the variable is `salt`

null control - a salt generated per record
  work factor, ms       : 240, unchanged
  distinct stored values: 2400000
  sharing a value       : 0
  tables an attacker needs : 2400000
  the derivation did not get stronger; the salt started
  varying, which is the only thing it was ever for

what a salted hash guarantees
  the stored value is not the password : exactly
  two accounts with one password differ : not addressed
    unless the salt varies, and a constant salt satisfies
    every other property a salt is described as having

a salt is defined by its variation, not by its presence;
long, random and correctly concatenated are the properties a
reader checks, and none of them is the one that matters

The derivation is memory-hard, tuned to 240 ms, compared in constant time, with
0 plaintext passwords stored anywhere. There is 1 salt, so 620000 users -
2583 per ten thousand - share a stored value with somebody, one precomputed
table serves all 2400000 accounts, and a single correct guess confirms 41000
of them at once.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
