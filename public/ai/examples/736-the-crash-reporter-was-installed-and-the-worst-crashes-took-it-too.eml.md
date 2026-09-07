<!-- canonical: efficientnewlanguage.org/ai/examples/736-the-crash-reporter-was-installed-and-the-worst-crashes-took-it-too | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 736 — The crash reporter was installed and the worst crashes took it too

`the_crash_reporter_was_installed_and_the_worst_crashes_took_it_too.eml` - The crash reporter ships in every build, symbolicates, deduplicates by stack, and the top five crashes it ranked were found and fixed. What it can report is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The crash reporter
# ships in every build, symbolicates, deduplicates by stack, and the top five
# crashes it ranked were found and fixed. What it can report is computed below.
#
# The reporting is properly done. It is in every build rather than a debug one;
# reports are symbolicated so a stack is readable rather than a list of
# addresses; they are grouped by the frames that matter instead of by message,
# so one defect is one entry; the queue is uploaded on next launch so a crash
# without network still arrives; and the five entries at the top of the list
# were each a real defect and each was fixed.
#
# The reporter is code in the process that is crashing. It writes its report
# during the fault, so it reports the faults that leave it running long enough
# to write.
#
# Three termination kinds do not.

10000 => install_share_per_myriad
41000 => crashes_reported_per_day
96000 => abnormal_terminations_per_day_from_the_session_gap
5 => top_entries_fixed
3 => termination_kinds_that_take_the_reporter_with_them
0 => reports_arriving_from_those_kinds

abnormal_terminations_per_day_from_the_session_gap - crashes_reported_per_day => terminations_that_produce_no_report
int(crashes_reported_per_day * 10000 / abnormal_terminations_per_day_from_the_session_gap) => reported_per_myriad
int(terminations_that_produce_no_report * 10000 / abnormal_terminations_per_day_from_the_session_gap) => unreported_per_myriad

"install share                   : " + str(install_share_per_myriad) + " per ten thousand" ^0
"top entries fixed               : " + str(top_entries_fixed) ^0
"" ^0
"abnormal terminations per day   : " + str(abnormal_terminations_per_day_from_the_session_gap) ^0
"  reported by the reporter      : " + str(crashes_reported_per_day) ^0
"  producing no report           : " + str(terminations_that_produce_no_report) ^0
"  share reported                : " + str(reported_per_myriad) + " per ten thousand" ^0
"  share unreported              : " + str(unreported_per_myriad) + " per ten thousand" ^0
"" ^0
"termination kinds that take it with them : " + str(termination_kinds_that_take_the_reporter_with_them) ^0
"reports arriving from those kinds        : " + str(reports_arriving_from_those_kinds) ^0
"" ^0

# ---- what the reporter verified ----

"the crash reporting" ^0
"  builds it ships in : every one, not a debug build" ^0
"  stacks : symbolicated, so they are readable" ^0
"  grouping : by the frames that matter, so one defect is" ^0
"    one entry rather than one per message" ^0
"  a crash with no network : queued and uploaded on next" ^0
"    launch" ^0
"  top entries that were real defects : " + str(top_entries_fixed) + " of " + str(top_entries_fixed) ^0
"  verdict : REPORTS WHAT IT SEES" ^0
"" ^0
"  grouping by frames rather than by message is what makes" ^0
"  the ranking mean anything, and it is done right" ^0
"" ^0

# ---- where the reporter runs ----

"the reporter" ^0
"  runs in : the process that is faulting" ^0
"  writes when : during the fault, from a handler" ^0
"  what it needs : enough of the process left to run" ^0
"  an uncaught exception : leaves that, so it reports" ^0
"  a memory kill from outside : does not" ^0
"  a watchdog termination : does not" ^0
"  a fault below the runtime : does not" ^0
"" ^0
"  the instrument is inside the thing it measures, so the" ^0
"  failures it cannot survive are the ones it cannot count" ^0
"" ^0
# ---- the ranking is a ranking of survivors ----

# The top five were real and fixing them was right. They are the top five of the
# reports that arrived, and arriving is correlated with being the gentler kind
# of failure. A crash that takes the process down hard is under-represented in
# exactly the list used to decide what to fix next.
"the priority list" ^0
"  entries : ranked by report count" ^0
"  reports : " + str(crashes_reported_per_day) + " a day" ^0
"  terminations : " + str(abnormal_terminations_per_day_from_the_session_gap) + " a day" ^0
"  what the ranking orders : the survivable kinds" ^0
"  where the other " + str(terminations_that_produce_no_report) + " sit : below every entry," ^0
"    at zero, because zero is what they report" ^0
"  were the five worth fixing : yes, each was real" ^0
"" ^0

# ---- how the other number was obtained ----

# The termination count does not come from the client. It is a server-side
# count of sessions that stop sending without a clean close, which is a
# different instrument in a different process.
"the second measurement" ^0
"  where it runs : the server" ^0
"  what it counts : sessions that stop without a clean" ^0
"    close" ^0
"  does it depend on the client surviving : no" ^0
"  is it precise : less so; it cannot say which defect" ^0
"  is it independent : yes, and that is why it is the one" ^0
"    that can see the gap" ^0
"" ^0

# ---- what a hundred percent install means ----

"the install figure" ^0
"  share of builds carrying the reporter : " + str(install_share_per_myriad) ^0
"    per ten thousand" ^0
"  is that number right : yes" ^0
"  what it measures : deployment of the instrument" ^0
"  what a reader takes it for : coverage of the failures" ^0
"  share of terminations it reports : " + str(reported_per_myriad) + " per ten" ^0
"    thousand" ^0
"" ^0

# ---- null control ----

# The same reporter, plus an out-of-process watcher that records the process's
# last state and exit reason from outside, and reconciles against the server's
# session count.
abnormal_terminations_per_day_from_the_session_gap => nc_terminations_with_a_recorded_reason
0 => nc_terminations_that_produce_no_report

"null control - a watcher outside the process" ^0
"  install share : " + str(install_share_per_myriad) + " per ten thousand, unchanged" ^0
"  terminations with a recorded reason : " + str(nc_terminations_with_a_recorded_reason) ^0
"  terminations producing nothing : " + str(nc_terminations_that_produce_no_report) ^0
"  the reporter did not improve; a second instrument" ^0
"  appeared that does not share the failure" ^0
"" ^0

# ---- the rule ----

"what a crash reporter guarantees" ^0
"  the crashes it can observe are reported, grouped and" ^0
"    ranked : exactly, and fixing the top " + str(top_entries_fixed) + " was correct" ^0
"  the crashes are known : not addressed; the reporter is" ^0
"    a passenger, and the failures it cannot survive" ^0
"    contribute nothing to the count they belong in" ^0
"" ^0
"an instrument inside the system it measures has a blind spot" ^0
"shaped exactly like its own failure; the missing entries are" ^0
"not scattered but selected, and they are selected for being" ^0
"the most severe" ^0
"" ^0

"The reporter is in every build, symbolicates, groups by the frames that matter," ^0
"queues through an offline crash, and the " + str(top_entries_fixed) + " entries at the top of its ranking" ^0
"were each a real defect that was fixed. It runs inside the faulting process, so" ^0
"of " + str(abnormal_terminations_per_day_from_the_session_gap) + " abnormal terminations a day it reports " + str(crashes_reported_per_day) + " - " + str(reported_per_myriad) + " per ten" ^0
"thousand - and the " + str(terminations_that_produce_no_report) + " it cannot survive are the " + str(termination_kinds_that_take_the_reporter_with_them) + " hardest kinds." ^0
```

## Python (deterministic transpilation)

```python
install_share_per_myriad = 10000
crashes_reported_per_day = 41000
abnormal_terminations_per_day_from_the_session_gap = 96000
top_entries_fixed = 5
termination_kinds_that_take_the_reporter_with_them = 3
reports_arriving_from_those_kinds = 0
terminations_that_produce_no_report = abnormal_terminations_per_day_from_the_session_gap - crashes_reported_per_day
reported_per_myriad = int(crashes_reported_per_day * 10000 / abnormal_terminations_per_day_from_the_session_gap)
unreported_per_myriad = int(terminations_that_produce_no_report * 10000 / abnormal_terminations_per_day_from_the_session_gap)
print("install share                   : " + str(install_share_per_myriad) + " per ten thousand")
print("top entries fixed               : " + str(top_entries_fixed))
print("")
print("abnormal terminations per day   : " + str(abnormal_terminations_per_day_from_the_session_gap))
print("  reported by the reporter      : " + str(crashes_reported_per_day))
print("  producing no report           : " + str(terminations_that_produce_no_report))
print("  share reported                : " + str(reported_per_myriad) + " per ten thousand")
print("  share unreported              : " + str(unreported_per_myriad) + " per ten thousand")
print("")
print("termination kinds that take it with them : " + str(termination_kinds_that_take_the_reporter_with_them))
print("reports arriving from those kinds        : " + str(reports_arriving_from_those_kinds))
print("")
print("the crash reporting")
print("  builds it ships in : every one, not a debug build")
print("  stacks : symbolicated, so they are readable")
print("  grouping : by the frames that matter, so one defect is")
print("    one entry rather than one per message")
print("  a crash with no network : queued and uploaded on next")
print("    launch")
print("  top entries that were real defects : " + str(top_entries_fixed) + " of " + str(top_entries_fixed))
print("  verdict : REPORTS WHAT IT SEES")
print("")
print("  grouping by frames rather than by message is what makes")
print("  the ranking mean anything, and it is done right")
print("")
print("the reporter")
print("  runs in : the process that is faulting")
print("  writes when : during the fault, from a handler")
print("  what it needs : enough of the process left to run")
print("  an uncaught exception : leaves that, so it reports")
print("  a memory kill from outside : does not")
print("  a watchdog termination : does not")
print("  a fault below the runtime : does not")
print("")
print("  the instrument is inside the thing it measures, so the")
print("  failures it cannot survive are the ones it cannot count")
print("")
print("the priority list")
print("  entries : ranked by report count")
print("  reports : " + str(crashes_reported_per_day) + " a day")
print("  terminations : " + str(abnormal_terminations_per_day_from_the_session_gap) + " a day")
print("  what the ranking orders : the survivable kinds")
print("  where the other " + str(terminations_that_produce_no_report) + " sit : below every entry,")
print("    at zero, because zero is what they report")
print("  were the five worth fixing : yes, each was real")
print("")
print("the second measurement")
print("  where it runs : the server")
print("  what it counts : sessions that stop without a clean")
print("    close")
print("  does it depend on the client surviving : no")
print("  is it precise : less so; it cannot say which defect")
print("  is it independent : yes, and that is why it is the one")
print("    that can see the gap")
print("")
print("the install figure")
print("  share of builds carrying the reporter : " + str(install_share_per_myriad))
print("    per ten thousand")
print("  is that number right : yes")
print("  what it measures : deployment of the instrument")
print("  what a reader takes it for : coverage of the failures")
print("  share of terminations it reports : " + str(reported_per_myriad) + " per ten")
print("    thousand")
print("")
nc_terminations_with_a_recorded_reason = abnormal_terminations_per_day_from_the_session_gap
nc_terminations_that_produce_no_report = 0
print("null control - a watcher outside the process")
print("  install share : " + str(install_share_per_myriad) + " per ten thousand, unchanged")
print("  terminations with a recorded reason : " + str(nc_terminations_with_a_recorded_reason))
print("  terminations producing nothing : " + str(nc_terminations_that_produce_no_report))
print("  the reporter did not improve; a second instrument")
print("  appeared that does not share the failure")
print("")
print("what a crash reporter guarantees")
print("  the crashes it can observe are reported, grouped and")
print("    ranked : exactly, and fixing the top " + str(top_entries_fixed) + " was correct")
print("  the crashes are known : not addressed; the reporter is")
print("    a passenger, and the failures it cannot survive")
print("    contribute nothing to the count they belong in")
print("")
print("an instrument inside the system it measures has a blind spot")
print("shaped exactly like its own failure; the missing entries are")
print("not scattered but selected, and they are selected for being")
print("the most severe")
print("")
print("The reporter is in every build, symbolicates, groups by the frames that matter,")
print("queues through an offline crash, and the " + str(top_entries_fixed) + " entries at the top of its ranking")
print("were each a real defect that was fixed. It runs inside the faulting process, so")
print("of " + str(abnormal_terminations_per_day_from_the_session_gap) + " abnormal terminations a day it reports " + str(crashes_reported_per_day) + " - " + str(reported_per_myriad) + " per ten")
print("thousand - and the " + str(terminations_that_produce_no_report) + " it cannot survive are the " + str(termination_kinds_that_take_the_reporter_with_them) + " hardest kinds.")
```

## stdout (executed)

```text
install share                   : 10000 per ten thousand
top entries fixed               : 5

abnormal terminations per day   : 96000
  reported by the reporter      : 41000
  producing no report           : 55000
  share reported                : 4270 per ten thousand
  share unreported              : 5729 per ten thousand

termination kinds that take it with them : 3
reports arriving from those kinds        : 0

the crash reporting
  builds it ships in : every one, not a debug build
  stacks : symbolicated, so they are readable
  grouping : by the frames that matter, so one defect is
    one entry rather than one per message
  a crash with no network : queued and uploaded on next
    launch
  top entries that were real defects : 5 of 5
  verdict : REPORTS WHAT IT SEES

  grouping by frames rather than by message is what makes
  the ranking mean anything, and it is done right

the reporter
  runs in : the process that is faulting
  writes when : during the fault, from a handler
  what it needs : enough of the process left to run
  an uncaught exception : leaves that, so it reports
  a memory kill from outside : does not
  a watchdog termination : does not
  a fault below the runtime : does not

  the instrument is inside the thing it measures, so the
  failures it cannot survive are the ones it cannot count

the priority list
  entries : ranked by report count
  reports : 41000 a day
  terminations : 96000 a day
  what the ranking orders : the survivable kinds
  where the other 55000 sit : below every entry,
    at zero, because zero is what they report
  were the five worth fixing : yes, each was real

the second measurement
  where it runs : the server
  what it counts : sessions that stop without a clean
    close
  does it depend on the client surviving : no
  is it precise : less so; it cannot say which defect
  is it independent : yes, and that is why it is the one
    that can see the gap

the install figure
  share of builds carrying the reporter : 10000
    per ten thousand
  is that number right : yes
  what it measures : deployment of the instrument
  what a reader takes it for : coverage of the failures
  share of terminations it reports : 4270 per ten
    thousand

null control - a watcher outside the process
  install share : 10000 per ten thousand, unchanged
  terminations with a recorded reason : 96000
  terminations producing nothing : 0
  the reporter did not improve; a second instrument
  appeared that does not share the failure

what a crash reporter guarantees
  the crashes it can observe are reported, grouped and
    ranked : exactly, and fixing the top 5 was correct
  the crashes are known : not addressed; the reporter is
    a passenger, and the failures it cannot survive
    contribute nothing to the count they belong in

an instrument inside the system it measures has a blind spot
shaped exactly like its own failure; the missing entries are
not scattered but selected, and they are selected for being
the most severe

The reporter is in every build, symbolicates, groups by the frames that matter,
queues through an offline crash, and the 5 entries at the top of its ranking
were each a real defect that was fixed. It runs inside the faulting process, so
of 96000 abnormal terminations a day it reports 41000 - 4270 per ten
thousand - and the 55000 it cannot survive are the 3 hardest kinds.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
