<!-- canonical: efficientnewlanguage.org/ai/examples/568-the-deploy-was-atomic-and-the-config-was-not | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 568 — The deploy was atomic and the config was not

`the_deploy_was_atomic_and_the_config_was_not.eml` - Code is deployed blue-green, so every instance switches at once. Configuration is polled every 60 seconds. What runs during those 60 seconds is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Code is deployed
# blue-green, so every instance switches at once. Configuration is polled every
# 60 seconds. What runs during those 60 seconds is computed below.
#
# Both mechanisms are right and each was chosen against the failure the other
# does not have. Blue-green exists precisely so the fleet is never serving two
# versions at once: a half-deployed fleet is the thing that makes an incident
# unreproducible, and switching all 48 instances together removes it.
# Configuration is polled rather than pushed because a push to 48 instances is
# a fan-out that can partially fail, and a partial push leaves some instances
# permanently stale with nothing to correct them. A poll is self-healing: an
# instance that misses one poll gets the next.
#
# Atomic and eventually-consistent are both correct properties. They are
# different properties, and the code and the config are two halves of one
# behaviour.
#
# Every deploy opens a window in which new code reads old configuration. The
# window is not a failure of either mechanism; it is the difference between
# their convergence times.

48 => instances
60 => config_poll_seconds
800 => requests_per_second
12 => deploys_per_month

"instances                : " + str(instances) ^0
"code deploy              : blue-green, all instances at once" ^0
"config propagation       : poll every " + str(config_poll_seconds) + " seconds" ^0
"request rate             : " + str(requests_per_second) + " per second" ^0
"" ^0

# ---- the window ----

int(config_poll_seconds / 2) => mean_lag
config_poll_seconds => worst_lag

"convergence time" ^0
"  code   : 0 seconds, by construction" ^0
"  config : " + str(mean_lag) + " seconds on average, " + str(worst_lag) + " seconds worst case" ^0
"  window in which they disagree : up to " + str(worst_lag) + " seconds per deploy" ^0
"" ^0

worst_lag * requests_per_second => requests_per_deploy
requests_per_deploy * deploys_per_month => requests_per_month

"  requests served in that window, per deploy : " + str(requests_per_deploy) ^0
"  deploys per month                          : " + str(deploys_per_month) ^0
"  requests served with mismatched halves     : " + str(requests_per_month) + " per month" ^0
"" ^0

# ---- what an instance looks like during the window ----

"during the window, every instance is in the same state" ^0
"  code version   : new, on all " + str(instances) ^0
"  config version : old, on all " + str(instances) + " until each one polls" ^0
"  instances disagreeing with each other : 0" ^0
"  instances disagreeing with themselves : " + str(instances) ^0
"" ^0
"  blue-green delivered exactly what it promised: no two instances differ" ^0
"  the difference is inside each one" ^0
"" ^0

# ---- the poll makes it worse before it makes it better ----
#
# Instances poll on their own schedule, so they cross over at different
# moments. For the length of one poll interval the fleet is split, which is the
# state blue-green was adopted to eliminate.

"seconds after the deploy   instances on new config   fleet split" ^0
[0, 15, 30, 45, 60] => marks
for t in marks:
    int(instances * t / config_poll_seconds) => converged
    if converged == 0:
        "  " + str(t) + "                         " + str(converged) + "                        no, all old" ^0
    elif converged == instances:
        "  " + str(t) + "                        " + str(converged) + "                       no, all new" ^0
    else:
        "  " + str(t) + "                        " + str(converged) + "                       YES" ^0
"" ^0
"  the fleet is split for " + str(config_poll_seconds) + " seconds, in the half of the behaviour that" ^0
"  blue-green does not cover" ^0
"" ^0

# ---- the control ----
#
# Each mechanism, measured against its own convergence guarantee. Both converge
# and both are correct. Neither has ever failed to reach a consistent state.

"control - does either mechanism fail to converge" ^0
"  code    : all " + str(instances) + " instances on the new version, immediately" ^0
"  config  : all " + str(instances) + " instances on the new value within " + str(worst_lag) + " seconds" ^0
"  mechanisms that fail to converge : 0 of 2" ^0
"  and after " + str(worst_lag) + " seconds the fleet is fully consistent again" ^0
"" ^0
"  the inconsistency is not in either end state" ^0
"  it is in the interval, and neither mechanism has an interval in its spec" ^0
"" ^0

# ---- the null control ----
#
# The same two mechanisms on a deploy that does not change configuration. The
# window opens and nothing is inside it. The pairing costs exactly as much as
# the deploys that touch both halves, which is most of the time nothing.

0 => nc_config_changed

"null control - a deploy that changes no configuration" ^0
"  config values changed          : " + str(nc_config_changed) ^0
"  window length                  : " + str(worst_lag) + " seconds, unchanged" ^0
"  requests served in the window  : " + str(requests_per_deploy) ^0
"  requests that see a mismatch   : " + str(nc_config_changed) ^0
"  same deploy mechanism, same poll, same window" ^0
"  the window is always open and it only costs something when both halves" ^0
"  of one behaviour change together" ^0
"" ^0

# ---- what closes it ----

"three ways to close the window" ^0
"  poll faster        : window falls to the new interval, never to zero" ^0
"  push config first, wait one interval, then deploy code" ^0
"                     : window closes, at the cost of an ordering rule" ^0
"                       somebody has to remember" ^0
"  ship the config value INSIDE the artifact" ^0
"                     : window closes, because there is only one thing" ^0
"                       to switch and it switches atomically" ^0
"" ^0

# ---- the rule ----

"two mechanisms, each correct, that change one behaviour" ^0
"  is each one atomic or convergent   yes, that is what was reviewed" ^0
"  do they converge at the same rate  this is the question" ^0
"  and a difference in rate is a window, not a failure" ^0
"  so it appears in no error budget and on no dashboard" ^0
"" ^0
"a behaviour split across two delivery mechanisms is only as atomic as the" ^0
"slower one, and blue-green makes the faster one instantaneous, which widens" ^0
"the gap rather than closing it" ^0
"" ^0

"Blue-green exists so the fleet never serves two versions at once, and polling" ^0
"exists so a partial push cannot leave an instance permanently stale. Both are" ^0
"the right answer to the failure they were chosen for. Together they give every" ^0
"deploy a " + str(worst_lag) + "-second window in which all " + str(instances) + " instances run new code against old" ^0
"configuration - " + str(requests_per_deploy) + " requests each time, " + str(requests_per_month) + " a month, and a fleet that" ^0
"is split for exactly as long as the poll interval." ^0
```

## Python (deterministic transpilation)

```python
instances = 48
config_poll_seconds = 60
requests_per_second = 800
deploys_per_month = 12
print("instances                : " + str(instances))
print("code deploy              : blue-green, all instances at once")
print("config propagation       : poll every " + str(config_poll_seconds) + " seconds")
print("request rate             : " + str(requests_per_second) + " per second")
print("")
mean_lag = int(config_poll_seconds / 2)
worst_lag = config_poll_seconds
print("convergence time")
print("  code   : 0 seconds, by construction")
print("  config : " + str(mean_lag) + " seconds on average, " + str(worst_lag) + " seconds worst case")
print("  window in which they disagree : up to " + str(worst_lag) + " seconds per deploy")
print("")
requests_per_deploy = worst_lag * requests_per_second
requests_per_month = requests_per_deploy * deploys_per_month
print("  requests served in that window, per deploy : " + str(requests_per_deploy))
print("  deploys per month                          : " + str(deploys_per_month))
print("  requests served with mismatched halves     : " + str(requests_per_month) + " per month")
print("")
print("during the window, every instance is in the same state")
print("  code version   : new, on all " + str(instances))
print("  config version : old, on all " + str(instances) + " until each one polls")
print("  instances disagreeing with each other : 0")
print("  instances disagreeing with themselves : " + str(instances))
print("")
print("  blue-green delivered exactly what it promised: no two instances differ")
print("  the difference is inside each one")
print("")
print("seconds after the deploy   instances on new config   fleet split")
marks = [0, 15, 30, 45, 60]
for t in marks:
    converged = int(instances * t / config_poll_seconds)
    if converged == 0:
        print("  " + str(t) + "                         " + str(converged) + "                        no, all old")
    elif converged == instances:
        print("  " + str(t) + "                        " + str(converged) + "                       no, all new")
    else:
        print("  " + str(t) + "                        " + str(converged) + "                       YES")
print("")
print("  the fleet is split for " + str(config_poll_seconds) + " seconds, in the half of the behaviour that")
print("  blue-green does not cover")
print("")
print("control - does either mechanism fail to converge")
print("  code    : all " + str(instances) + " instances on the new version, immediately")
print("  config  : all " + str(instances) + " instances on the new value within " + str(worst_lag) + " seconds")
print("  mechanisms that fail to converge : 0 of 2")
print("  and after " + str(worst_lag) + " seconds the fleet is fully consistent again")
print("")
print("  the inconsistency is not in either end state")
print("  it is in the interval, and neither mechanism has an interval in its spec")
print("")
nc_config_changed = 0
print("null control - a deploy that changes no configuration")
print("  config values changed          : " + str(nc_config_changed))
print("  window length                  : " + str(worst_lag) + " seconds, unchanged")
print("  requests served in the window  : " + str(requests_per_deploy))
print("  requests that see a mismatch   : " + str(nc_config_changed))
print("  same deploy mechanism, same poll, same window")
print("  the window is always open and it only costs something when both halves")
print("  of one behaviour change together")
print("")
print("three ways to close the window")
print("  poll faster        : window falls to the new interval, never to zero")
print("  push config first, wait one interval, then deploy code")
print("                     : window closes, at the cost of an ordering rule")
print("                       somebody has to remember")
print("  ship the config value INSIDE the artifact")
print("                     : window closes, because there is only one thing")
print("                       to switch and it switches atomically")
print("")
print("two mechanisms, each correct, that change one behaviour")
print("  is each one atomic or convergent   yes, that is what was reviewed")
print("  do they converge at the same rate  this is the question")
print("  and a difference in rate is a window, not a failure")
print("  so it appears in no error budget and on no dashboard")
print("")
print("a behaviour split across two delivery mechanisms is only as atomic as the")
print("slower one, and blue-green makes the faster one instantaneous, which widens")
print("the gap rather than closing it")
print("")
print("Blue-green exists so the fleet never serves two versions at once, and polling")
print("exists so a partial push cannot leave an instance permanently stale. Both are")
print("the right answer to the failure they were chosen for. Together they give every")
print("deploy a " + str(worst_lag) + "-second window in which all " + str(instances) + " instances run new code against old")
print("configuration - " + str(requests_per_deploy) + " requests each time, " + str(requests_per_month) + " a month, and a fleet that")
print("is split for exactly as long as the poll interval.")
```

## stdout (executed)

```text
instances                : 48
code deploy              : blue-green, all instances at once
config propagation       : poll every 60 seconds
request rate             : 800 per second

convergence time
  code   : 0 seconds, by construction
  config : 30 seconds on average, 60 seconds worst case
  window in which they disagree : up to 60 seconds per deploy

  requests served in that window, per deploy : 48000
  deploys per month                          : 12
  requests served with mismatched halves     : 576000 per month

during the window, every instance is in the same state
  code version   : new, on all 48
  config version : old, on all 48 until each one polls
  instances disagreeing with each other : 0
  instances disagreeing with themselves : 48

  blue-green delivered exactly what it promised: no two instances differ
  the difference is inside each one

seconds after the deploy   instances on new config   fleet split
  0                         0                        no, all old
  15                        12                       YES
  30                        24                       YES
  45                        36                       YES
  60                        48                       no, all new

  the fleet is split for 60 seconds, in the half of the behaviour that
  blue-green does not cover

control - does either mechanism fail to converge
  code    : all 48 instances on the new version, immediately
  config  : all 48 instances on the new value within 60 seconds
  mechanisms that fail to converge : 0 of 2
  and after 60 seconds the fleet is fully consistent again

  the inconsistency is not in either end state
  it is in the interval, and neither mechanism has an interval in its spec

null control - a deploy that changes no configuration
  config values changed          : 0
  window length                  : 60 seconds, unchanged
  requests served in the window  : 48000
  requests that see a mismatch   : 0
  same deploy mechanism, same poll, same window
  the window is always open and it only costs something when both halves
  of one behaviour change together

three ways to close the window
  poll faster        : window falls to the new interval, never to zero
  push config first, wait one interval, then deploy code
                     : window closes, at the cost of an ordering rule
                       somebody has to remember
  ship the config value INSIDE the artifact
                     : window closes, because there is only one thing
                       to switch and it switches atomically

two mechanisms, each correct, that change one behaviour
  is each one atomic or convergent   yes, that is what was reviewed
  do they converge at the same rate  this is the question
  and a difference in rate is a window, not a failure
  so it appears in no error budget and on no dashboard

a behaviour split across two delivery mechanisms is only as atomic as the
slower one, and blue-green makes the faster one instantaneous, which widens
the gap rather than closing it

Blue-green exists so the fleet never serves two versions at once, and polling
exists so a partial push cannot leave an instance permanently stale. Both are
the right answer to the failure they were chosen for. Together they give every
deploy a 60-second window in which all 48 instances run new code against old
configuration - 48000 requests each time, 576000 a month, and a fleet that
is split for exactly as long as the poll interval.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
