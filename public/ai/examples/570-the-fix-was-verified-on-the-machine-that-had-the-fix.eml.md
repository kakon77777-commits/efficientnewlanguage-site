<!-- canonical: efficientnewlanguage.org/ai/examples/570-the-fix-was-verified-on-the-machine-that-had-the-fix | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 570 — The fix was verified on the machine that had the fix

`the_fix_was_verified_on_the_machine_that_had_the_fix.eml` - A bug reproduces on 4 of 12 hosts. The fix was deployed to one host, verified there, and rolled out. What that verification could and could not have shown is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A bug reproduces
# on 4 of 12 hosts. The fix was deployed to one host, verified there, and
# rolled out. What that verification could and could not have shown is computed
# below.
#
# Verifying on one host before touching the other eleven is correct and it is
# the whole point of a canary. It bounds the blast radius, it is reversible in
# one step, and it produces a real observation from real traffic rather than
# from a synthetic reproduction. The engineer who did it followed the runbook
# exactly, and the runbook is a good runbook.
#
# The bug depends on a host-local condition - a disk above 80 percent, which is
# true on 4 of the 12. The canary was host-07, chosen because it is the one
# with the console already open. Nobody checked whether host-07 was one of the
# four, because the list of four did not exist yet: producing it is what the
# investigation was going to do next.
#
# A check is evidence only if it could have come out the other way. On a host
# where the bug does not occur, "no bug after the fix" is what happens whether
# the fix works, does nothing, or makes things worse.

12 => hosts
4 => affected_hosts

hosts - affected_hosts => unaffected_hosts

"hosts in the fleet        : " + str(hosts) ^0
"hosts where it reproduces : " + str(affected_hosts) ^0
"canary chosen             : 1, at random with respect to that list" ^0
"" ^0

"probability the canary was an affected host : " + str(int(affected_hosts * 100 / hosts)) + " percent" ^0
"probability it was not                      : " + str(int(unaffected_hosts * 100 / hosts)) + " percent" ^0
"" ^0

# ---- what each outcome would have meant ----
#
# A green canary is consistent with every hypothesis on an unaffected host, and
# with only one on an affected host. That difference is the entire value of the
# check.

"if the canary WAS an affected host" ^0
"  fix works    -> no bug   observed" ^0
"  fix does nothing -> bug  not observed" ^0
"  the two predictions differ, so green rules one out" ^0
"" ^0
"if the canary was NOT an affected host" ^0
"  fix works    -> no bug   observed" ^0
"  fix does nothing -> no bug  observed" ^0
"  the two predictions agree, so green rules out nothing" ^0
"" ^0
"  the same green tick, and in one case it is proof and in the other it is" ^0
"  the only thing that could have happened" ^0
"" ^0

# ---- the check that was actually available and free ----
#
# Whether the bug had EVER been seen on host-07 before the fix. That single
# question converts the canary from undefined to decisive, and the data to
# answer it was already in the logs.

"the missing precondition" ^0
"  did the bug occur on this host BEFORE the fix" ^0
"  if yes : green afterwards is a real observation" ^0
"  if no  : green afterwards is not an observation at all" ^0
"  cost of asking : one log query against data already retained" ^0
"" ^0

# ---- how many hosts a canary needs to be worth running ----
#
# To be confident of landing on at least one affected host. The probability of
# missing on every one of n hosts is (unaffected/hosts) to the n.

# In percent, the running product truncates at every step and the error
# accumulates upward: it reports 95 percent at seven canaries where the exact
# answer is eight. Parts per million is fine enough that eight steps of
# truncation do not move the answer.

"canaries   chance of hitting at least one affected host" ^0
1000000 => miss_ppm
0 => first_95
0 => one_canary_permille
for n in [1:9]:
    miss_ppm * unaffected_hosts => raw
    int(raw / hosts) => miss_ppm
    1000000 - miss_ppm => hit_ppm
    int(hit_ppm / 1000) => hit_permille
    if n == 1:
        hit_permille => one_canary_permille
    if first_95 == 0:
        if hit_permille >= 950:
            n => first_95
    "  " + str(n) + "          " + str(hit_permille) + " per mille" ^0
"" ^0
"  one canary reaches " + str(one_canary_permille) + " per mille" ^0
"  reaching 950 per mille takes " + str(first_95) + " of the " + str(hosts) + ", which is not a canary any more" ^0
"  choosing 1 host that is KNOWN affected reaches 100 percent" ^0
"" ^0

# ---- the rollout ----
#
# The fix went to all twelve. Whether it worked is still unknown, and the
# canary is now spent: every host has the fix, so there is no host left on
# which the bug could be observed to still occur.

"after the rollout" ^0
"  hosts with the fix                 : " + str(hosts) ^0
"  hosts on which the bug could still be observed : 0" ^0
"  hosts remaining to test the fix against : 0" ^0
"  the fleet is now a single sample of size one, and it has no control" ^0
"" ^0

# ---- the control ----
#
# The canary procedure itself is sound and every other property it checks is
# real. It did bound the blast radius, it was reversible, and it did catch
# whether the fix crashed on startup. Those are genuine and they are what the
# runbook was written for.

"control - what the canary DID establish" ^0
"  the fix deploys without error      : yes, observed" ^0
"  the process stays up               : yes, observed" ^0
"  latency did not regress            : yes, measured" ^0
"  blast radius bounded to 1 host     : yes, by construction" ^0
"  the bug is fixed                   : not established" ^0
"  four of five, and the fifth is the one the change was for" ^0
"" ^0

# ---- the null control ----
#
# The same procedure on a bug that reproduces everywhere. Any host is an
# affected host, the canary cannot miss, and the runbook is exactly right. The
# defect is not the canary; it is a canary on a fleet where the condition is
# not uniform.

hosts => uniform_affected

"null control - the same canary against a bug that reproduces on every host" ^0
"  hosts where it reproduces : " + str(uniform_affected) + " of " + str(hosts) ^0
"  chance the canary is affected : " + str(int(uniform_affected * 100 / hosts)) + " percent" ^0
"  green after the fix is decisive : yes" ^0
"  same runbook, same engineer, same one host" ^0
"  the procedure is unchanged and now it proves what it claims" ^0
"" ^0

# ---- the rule ----

"what makes a single-host check worth its cost" ^0
"  the host must be able to exhibit the failure" ^0
"  and it must be KNOWN to have exhibited it" ^0
"  otherwise the check has one possible outcome" ^0
"  a check with one possible outcome has no failure mode to report" ^0
"  and it will be green on the day the fix is wrong" ^0
"" ^0

"Canarying one host bounds the blast radius, keeps the rollback to one step and" ^0
"produces an observation from real traffic - all of which happened. It also" ^0
"reached a host that was one of the four with probability " + str(int(affected_hosts * 100 / hosts)) + " percent. On the" ^0
"other " + str(int(unaffected_hosts * 100 / hosts)) + " percent of draws, 'no bug after the fix' is what the host was going" ^0
"to report under every hypothesis, including the one where the fix does" ^0
"nothing at all." ^0
```

## Python (deterministic transpilation)

```python
hosts = 12
affected_hosts = 4
unaffected_hosts = hosts - affected_hosts
print("hosts in the fleet        : " + str(hosts))
print("hosts where it reproduces : " + str(affected_hosts))
print("canary chosen             : 1, at random with respect to that list")
print("")
print("probability the canary was an affected host : " + str(int(affected_hosts * 100 / hosts)) + " percent")
print("probability it was not                      : " + str(int(unaffected_hosts * 100 / hosts)) + " percent")
print("")
print("if the canary WAS an affected host")
print("  fix works    -> no bug   observed")
print("  fix does nothing -> bug  not observed")
print("  the two predictions differ, so green rules one out")
print("")
print("if the canary was NOT an affected host")
print("  fix works    -> no bug   observed")
print("  fix does nothing -> no bug  observed")
print("  the two predictions agree, so green rules out nothing")
print("")
print("  the same green tick, and in one case it is proof and in the other it is")
print("  the only thing that could have happened")
print("")
print("the missing precondition")
print("  did the bug occur on this host BEFORE the fix")
print("  if yes : green afterwards is a real observation")
print("  if no  : green afterwards is not an observation at all")
print("  cost of asking : one log query against data already retained")
print("")
print("canaries   chance of hitting at least one affected host")
miss_ppm = 1000000
first_95 = 0
one_canary_permille = 0
for n in range(1, 10):
    raw = miss_ppm * unaffected_hosts
    miss_ppm = int(raw / hosts)
    hit_ppm = 1000000 - miss_ppm
    hit_permille = int(hit_ppm / 1000)
    if n == 1:
        one_canary_permille = hit_permille
    if first_95 == 0:
        if hit_permille >= 950:
            first_95 = n
    print("  " + str(n) + "          " + str(hit_permille) + " per mille")
print("")
print("  one canary reaches " + str(one_canary_permille) + " per mille")
print("  reaching 950 per mille takes " + str(first_95) + " of the " + str(hosts) + ", which is not a canary any more")
print("  choosing 1 host that is KNOWN affected reaches 100 percent")
print("")
print("after the rollout")
print("  hosts with the fix                 : " + str(hosts))
print("  hosts on which the bug could still be observed : 0")
print("  hosts remaining to test the fix against : 0")
print("  the fleet is now a single sample of size one, and it has no control")
print("")
print("control - what the canary DID establish")
print("  the fix deploys without error      : yes, observed")
print("  the process stays up               : yes, observed")
print("  latency did not regress            : yes, measured")
print("  blast radius bounded to 1 host     : yes, by construction")
print("  the bug is fixed                   : not established")
print("  four of five, and the fifth is the one the change was for")
print("")
uniform_affected = hosts
print("null control - the same canary against a bug that reproduces on every host")
print("  hosts where it reproduces : " + str(uniform_affected) + " of " + str(hosts))
print("  chance the canary is affected : " + str(int(uniform_affected * 100 / hosts)) + " percent")
print("  green after the fix is decisive : yes")
print("  same runbook, same engineer, same one host")
print("  the procedure is unchanged and now it proves what it claims")
print("")
print("what makes a single-host check worth its cost")
print("  the host must be able to exhibit the failure")
print("  and it must be KNOWN to have exhibited it")
print("  otherwise the check has one possible outcome")
print("  a check with one possible outcome has no failure mode to report")
print("  and it will be green on the day the fix is wrong")
print("")
print("Canarying one host bounds the blast radius, keeps the rollback to one step and")
print("produces an observation from real traffic - all of which happened. It also")
print("reached a host that was one of the four with probability " + str(int(affected_hosts * 100 / hosts)) + " percent. On the")
print("other " + str(int(unaffected_hosts * 100 / hosts)) + " percent of draws, 'no bug after the fix' is what the host was going")
print("to report under every hypothesis, including the one where the fix does")
print("nothing at all.")
```

## stdout (executed)

```text
hosts in the fleet        : 12
hosts where it reproduces : 4
canary chosen             : 1, at random with respect to that list

probability the canary was an affected host : 33 percent
probability it was not                      : 66 percent

if the canary WAS an affected host
  fix works    -> no bug   observed
  fix does nothing -> bug  not observed
  the two predictions differ, so green rules one out

if the canary was NOT an affected host
  fix works    -> no bug   observed
  fix does nothing -> no bug  observed
  the two predictions agree, so green rules out nothing

  the same green tick, and in one case it is proof and in the other it is
  the only thing that could have happened

the missing precondition
  did the bug occur on this host BEFORE the fix
  if yes : green afterwards is a real observation
  if no  : green afterwards is not an observation at all
  cost of asking : one log query against data already retained

canaries   chance of hitting at least one affected host
  1          333 per mille
  2          555 per mille
  3          703 per mille
  4          802 per mille
  5          868 per mille
  6          912 per mille
  7          941 per mille
  8          960 per mille
  9          973 per mille

  one canary reaches 333 per mille
  reaching 950 per mille takes 8 of the 12, which is not a canary any more
  choosing 1 host that is KNOWN affected reaches 100 percent

after the rollout
  hosts with the fix                 : 12
  hosts on which the bug could still be observed : 0
  hosts remaining to test the fix against : 0
  the fleet is now a single sample of size one, and it has no control

control - what the canary DID establish
  the fix deploys without error      : yes, observed
  the process stays up               : yes, observed
  latency did not regress            : yes, measured
  blast radius bounded to 1 host     : yes, by construction
  the bug is fixed                   : not established
  four of five, and the fifth is the one the change was for

null control - the same canary against a bug that reproduces on every host
  hosts where it reproduces : 12 of 12
  chance the canary is affected : 100 percent
  green after the fix is decisive : yes
  same runbook, same engineer, same one host
  the procedure is unchanged and now it proves what it claims

what makes a single-host check worth its cost
  the host must be able to exhibit the failure
  and it must be KNOWN to have exhibited it
  otherwise the check has one possible outcome
  a check with one possible outcome has no failure mode to report
  and it will be green on the day the fix is wrong

Canarying one host bounds the blast radius, keeps the rollback to one step and
produces an observation from real traffic - all of which happened. It also
reached a host that was one of the four with probability 33 percent. On the
other 66 percent of draws, 'no bug after the fix' is what the host was going
to report under every hypothesis, including the one where the fix does
nothing at all.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
