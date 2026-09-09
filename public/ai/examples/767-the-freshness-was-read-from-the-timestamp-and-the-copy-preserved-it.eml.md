<!-- canonical: efficientnewlanguage.org/ai/examples/767-the-freshness-was-read-from-the-timestamp-and-the-copy-preserved-it | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 767 — The freshness was read from the timestamp and the copy preserved it

`the_freshness_was_read_from_the_timestamp_and_the_copy_preserved_it.eml` - Every feed in the data lake is watched for staleness against a six-hour SLA, the check runs every five minutes, and in twenty months it has caught thirty-one real outages. What the check reads is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every feed in the
# data lake is watched for staleness against a six-hour SLA, the check runs
# every five minutes, and in twenty months it has caught thirty-one real
# outages. What the check reads is computed below.
#
# The monitor is well built. It runs on its own schedule rather than inside the
# pipeline it watches, so a pipeline that stops entirely still gets noticed; the
# six-hour SLA was argued down from twenty-four with the teams who consume the
# data; every alert has a runbook and every alert has been actioned.
#
# It reads each file's modification time. The ingestion copies from the vendors
# with timestamps preserved, so that time is the vendor's write time, and the
# vendor's export job rewrites the file on every run whether or not anything in
# it changed.

1240 => feeds_monitored
214 => feeds_whose_export_rewrites_on_every_run
6 => staleness_sla_hours
12 => checks_per_hour
20 => months_the_monitor_has_run
31 => real_outages_caught
90 => days_observed
47 => feeds_that_repeated_yesterdays_content
41 => feeds_repeating_from_a_rewriting_vendor
0 => feeds_compared_by_content
0 => alerts_raised_for_repeated_content

feeds_monitored - feeds_whose_export_rewrites_on_every_run => feeds_whose_timestamp_moves_only_on_change
feeds_that_repeated_yesterdays_content - feeds_repeating_from_a_rewriting_vendor => feeds_the_monitor_saw_repeat
checks_per_hour * 24 => checks_per_feed_per_day
checks_per_feed_per_day * days_observed => checks_per_feed_observed
int(feeds_whose_export_rewrites_on_every_run * 10000 / feeds_monitored) => rewriting_share_per_myriad
int(feeds_the_monitor_saw_repeat * 10000 / feeds_that_repeated_yesterdays_content) => repeat_detection_per_myriad

"feeds monitored                 : " + str(feeds_monitored) ^0
"staleness SLA                   : " + str(staleness_sla_hours) + " hours" ^0
"checks per feed per day         : " + str(checks_per_feed_per_day) ^0
"months the monitor has run      : " + str(months_the_monitor_has_run) ^0
"real outages caught             : " + str(real_outages_caught) ^0
"" ^0
"days observed                   : " + str(days_observed) ^0
"feeds that repeated content     : " + str(feeds_that_repeated_yesterdays_content) ^0
"  from a rewriting vendor       : " + str(feeds_repeating_from_a_rewriting_vendor) ^0
"  the monitor saw               : " + str(feeds_the_monitor_saw_repeat) ^0
"  detection                     : " + str(repeat_detection_per_myriad) + " per ten thousand" ^0
"" ^0
"feeds whose export rewrites     : " + str(feeds_whose_export_rewrites_on_every_run) ^0
"  share of monitored            : " + str(rewriting_share_per_myriad) + " per ten thousand" ^0
"feeds compared by content       : " + str(feeds_compared_by_content) ^0
"alerts for repeated content     : " + str(alerts_raised_for_repeated_content) ^0
"" ^0

# ---- what the monitor verified ----

"the staleness monitor" ^0
"  runs : outside the pipeline it watches, so a pipeline" ^0
"    that stops entirely is still noticed" ^0
"  SLA : " + str(staleness_sla_hours) + " hours, argued down from 24 with the teams" ^0
"    that consume the data" ^0
"  cadence : " + str(checks_per_feed_per_day) + " checks per feed per day" ^0
"  every alert : has a runbook, and has been actioned" ^0
"  real outages caught in " + str(months_the_monitor_has_run) + " months : " + str(real_outages_caught) ^0
"  verdict : WATCHED" ^0
"" ^0
"  running it outside the pipeline is the part almost" ^0
"  nobody does, and it is why the " + str(real_outages_caught) + " are real" ^0
"" ^0

# ---- which object carries the answer ----

"two objects" ^0
"  what the monitor reads : the file's modification time" ^0
"  what the question is about : whether the contents are" ^0
"    today's" ^0
"  when they agree : whenever the timestamp moves only" ^0
"    because the content did" ^0
"  feeds where that holds : " + str(feeds_whose_timestamp_moves_only_on_change) ^0
"  feeds where it does not : " + str(feeds_whose_export_rewrites_on_every_run) + ", whose export" ^0
"    rewrites the file every run" ^0
"" ^0
"  the copy preserves the vendor's timestamp, so the" ^0
"  monitor reads a clock the vendor moves on a schedule" ^0
"  of its own" ^0
"" ^0

# ---- what a rewriting vendor looks like ----

"a feed that repeated yesterday's rows" ^0
"  did the file arrive : yes, on time" ^0
"  did the modification time move : yes, the export" ^0
"    rewrote it" ^0
"  was it inside the SLA : yes, by hours" ^0
"  did the monitor alert : no" ^0
"  did anything compare the bytes : no; " + str(feeds_compared_by_content) + " feeds are" ^0
"    compared by content" ^0
"" ^0

# ---- the detection that is left ----

"repeats over " + str(days_observed) + " days" ^0
"  feeds that served yesterday's content again : " + str(feeds_that_repeated_yesterdays_content) ^0
"  of those, from a rewriting vendor : " + str(feeds_repeating_from_a_rewriting_vendor) ^0
"  the monitor saw the rest : " + str(feeds_the_monitor_saw_repeat) + ", whose timestamp" ^0
"    stayed put and went past " + str(staleness_sla_hours) + " hours" ^0
"  detection : " + str(repeat_detection_per_myriad) + " per ten thousand" ^0
"" ^0
"  the " + str(feeds_the_monitor_saw_repeat) + " were caught by the timestamp failing to move," ^0
"  which is the monitor working exactly as specified" ^0
"" ^0

# ---- null control ----

# The same monitor, with a content hash stored per delivery and compared with
# the one before it.
feeds_monitored => nc_feeds_compared_by_content
41 => nc_alerts_raised_for_repeated_content
31 => nc_real_outages_caught

"null control - store a content hash, compare deliveries" ^0
"  real outages caught : " + str(nc_real_outages_caught) + ", unchanged" ^0
"  feeds compared by content : " + str(nc_feeds_compared_by_content) ^0
"  alerts for repeated content : " + str(nc_alerts_raised_for_repeated_content) ^0
"  the monitor did not get better at reading timestamps;" ^0
"  a second instrument was pointed at the object the" ^0
"  question was always about" ^0
"" ^0

# ---- the rule ----

"what a green staleness board guarantees" ^0
"  every feed has a file whose recorded modification time" ^0
"    is inside " + str(staleness_sla_hours) + " hours : exactly, " + str(checks_per_feed_per_day) + " times a day" ^0
"  every feed has current data : not addressed; the" ^0
"    timestamp is written by the vendor's export and the" ^0
"    copy preserves it" ^0
"" ^0
"an instrument that reads one object answers about that" ^0
"object; the reading is correct and the question was about" ^0
"the other one, and nothing here compares it" ^0
"" ^0

"The monitor runs outside the pipeline, checks " + str(checks_per_feed_per_day) + " times a day, and has" ^0
"caught " + str(real_outages_caught) + " real outages in " + str(months_the_monitor_has_run) + " months. It reads the modification time, which the" ^0
"copy preserves from a vendor export that rewrites the file every run, so of " + str(feeds_that_repeated_yesterdays_content) ^0
"feeds that served yesterday's content again it saw " + str(feeds_the_monitor_saw_repeat) + " - " + str(repeat_detection_per_myriad) + " per ten" ^0
"thousand - and " + str(feeds_compared_by_content) + " feeds are compared by content." ^0
```

## Python (deterministic transpilation)

```python
feeds_monitored = 1240
feeds_whose_export_rewrites_on_every_run = 214
staleness_sla_hours = 6
checks_per_hour = 12
months_the_monitor_has_run = 20
real_outages_caught = 31
days_observed = 90
feeds_that_repeated_yesterdays_content = 47
feeds_repeating_from_a_rewriting_vendor = 41
feeds_compared_by_content = 0
alerts_raised_for_repeated_content = 0
feeds_whose_timestamp_moves_only_on_change = feeds_monitored - feeds_whose_export_rewrites_on_every_run
feeds_the_monitor_saw_repeat = feeds_that_repeated_yesterdays_content - feeds_repeating_from_a_rewriting_vendor
checks_per_feed_per_day = checks_per_hour * 24
checks_per_feed_observed = checks_per_feed_per_day * days_observed
rewriting_share_per_myriad = int(feeds_whose_export_rewrites_on_every_run * 10000 / feeds_monitored)
repeat_detection_per_myriad = int(feeds_the_monitor_saw_repeat * 10000 / feeds_that_repeated_yesterdays_content)
print("feeds monitored                 : " + str(feeds_monitored))
print("staleness SLA                   : " + str(staleness_sla_hours) + " hours")
print("checks per feed per day         : " + str(checks_per_feed_per_day))
print("months the monitor has run      : " + str(months_the_monitor_has_run))
print("real outages caught             : " + str(real_outages_caught))
print("")
print("days observed                   : " + str(days_observed))
print("feeds that repeated content     : " + str(feeds_that_repeated_yesterdays_content))
print("  from a rewriting vendor       : " + str(feeds_repeating_from_a_rewriting_vendor))
print("  the monitor saw               : " + str(feeds_the_monitor_saw_repeat))
print("  detection                     : " + str(repeat_detection_per_myriad) + " per ten thousand")
print("")
print("feeds whose export rewrites     : " + str(feeds_whose_export_rewrites_on_every_run))
print("  share of monitored            : " + str(rewriting_share_per_myriad) + " per ten thousand")
print("feeds compared by content       : " + str(feeds_compared_by_content))
print("alerts for repeated content     : " + str(alerts_raised_for_repeated_content))
print("")
print("the staleness monitor")
print("  runs : outside the pipeline it watches, so a pipeline")
print("    that stops entirely is still noticed")
print("  SLA : " + str(staleness_sla_hours) + " hours, argued down from 24 with the teams")
print("    that consume the data")
print("  cadence : " + str(checks_per_feed_per_day) + " checks per feed per day")
print("  every alert : has a runbook, and has been actioned")
print("  real outages caught in " + str(months_the_monitor_has_run) + " months : " + str(real_outages_caught))
print("  verdict : WATCHED")
print("")
print("  running it outside the pipeline is the part almost")
print("  nobody does, and it is why the " + str(real_outages_caught) + " are real")
print("")
print("two objects")
print("  what the monitor reads : the file's modification time")
print("  what the question is about : whether the contents are")
print("    today's")
print("  when they agree : whenever the timestamp moves only")
print("    because the content did")
print("  feeds where that holds : " + str(feeds_whose_timestamp_moves_only_on_change))
print("  feeds where it does not : " + str(feeds_whose_export_rewrites_on_every_run) + ", whose export")
print("    rewrites the file every run")
print("")
print("  the copy preserves the vendor's timestamp, so the")
print("  monitor reads a clock the vendor moves on a schedule")
print("  of its own")
print("")
print("a feed that repeated yesterday's rows")
print("  did the file arrive : yes, on time")
print("  did the modification time move : yes, the export")
print("    rewrote it")
print("  was it inside the SLA : yes, by hours")
print("  did the monitor alert : no")
print("  did anything compare the bytes : no; " + str(feeds_compared_by_content) + " feeds are")
print("    compared by content")
print("")
print("repeats over " + str(days_observed) + " days")
print("  feeds that served yesterday's content again : " + str(feeds_that_repeated_yesterdays_content))
print("  of those, from a rewriting vendor : " + str(feeds_repeating_from_a_rewriting_vendor))
print("  the monitor saw the rest : " + str(feeds_the_monitor_saw_repeat) + ", whose timestamp")
print("    stayed put and went past " + str(staleness_sla_hours) + " hours")
print("  detection : " + str(repeat_detection_per_myriad) + " per ten thousand")
print("")
print("  the " + str(feeds_the_monitor_saw_repeat) + " were caught by the timestamp failing to move,")
print("  which is the monitor working exactly as specified")
print("")
nc_feeds_compared_by_content = feeds_monitored
nc_alerts_raised_for_repeated_content = 41
nc_real_outages_caught = 31
print("null control - store a content hash, compare deliveries")
print("  real outages caught : " + str(nc_real_outages_caught) + ", unchanged")
print("  feeds compared by content : " + str(nc_feeds_compared_by_content))
print("  alerts for repeated content : " + str(nc_alerts_raised_for_repeated_content))
print("  the monitor did not get better at reading timestamps;")
print("  a second instrument was pointed at the object the")
print("  question was always about")
print("")
print("what a green staleness board guarantees")
print("  every feed has a file whose recorded modification time")
print("    is inside " + str(staleness_sla_hours) + " hours : exactly, " + str(checks_per_feed_per_day) + " times a day")
print("  every feed has current data : not addressed; the")
print("    timestamp is written by the vendor's export and the")
print("    copy preserves it")
print("")
print("an instrument that reads one object answers about that")
print("object; the reading is correct and the question was about")
print("the other one, and nothing here compares it")
print("")
print("The monitor runs outside the pipeline, checks " + str(checks_per_feed_per_day) + " times a day, and has")
print("caught " + str(real_outages_caught) + " real outages in " + str(months_the_monitor_has_run) + " months. It reads the modification time, which the")
print("copy preserves from a vendor export that rewrites the file every run, so of " + str(feeds_that_repeated_yesterdays_content))
print("feeds that served yesterday's content again it saw " + str(feeds_the_monitor_saw_repeat) + " - " + str(repeat_detection_per_myriad) + " per ten")
print("thousand - and " + str(feeds_compared_by_content) + " feeds are compared by content.")
```

## stdout (executed)

```text
feeds monitored                 : 1240
staleness SLA                   : 6 hours
checks per feed per day         : 288
months the monitor has run      : 20
real outages caught             : 31

days observed                   : 90
feeds that repeated content     : 47
  from a rewriting vendor       : 41
  the monitor saw               : 6
  detection                     : 1276 per ten thousand

feeds whose export rewrites     : 214
  share of monitored            : 1725 per ten thousand
feeds compared by content       : 0
alerts for repeated content     : 0

the staleness monitor
  runs : outside the pipeline it watches, so a pipeline
    that stops entirely is still noticed
  SLA : 6 hours, argued down from 24 with the teams
    that consume the data
  cadence : 288 checks per feed per day
  every alert : has a runbook, and has been actioned
  real outages caught in 20 months : 31
  verdict : WATCHED

  running it outside the pipeline is the part almost
  nobody does, and it is why the 31 are real

two objects
  what the monitor reads : the file's modification time
  what the question is about : whether the contents are
    today's
  when they agree : whenever the timestamp moves only
    because the content did
  feeds where that holds : 1026
  feeds where it does not : 214, whose export
    rewrites the file every run

  the copy preserves the vendor's timestamp, so the
  monitor reads a clock the vendor moves on a schedule
  of its own

a feed that repeated yesterday's rows
  did the file arrive : yes, on time
  did the modification time move : yes, the export
    rewrote it
  was it inside the SLA : yes, by hours
  did the monitor alert : no
  did anything compare the bytes : no; 0 feeds are
    compared by content

repeats over 90 days
  feeds that served yesterday's content again : 47
  of those, from a rewriting vendor : 41
  the monitor saw the rest : 6, whose timestamp
    stayed put and went past 6 hours
  detection : 1276 per ten thousand

  the 6 were caught by the timestamp failing to move,
  which is the monitor working exactly as specified

null control - store a content hash, compare deliveries
  real outages caught : 31, unchanged
  feeds compared by content : 1240
  alerts for repeated content : 41
  the monitor did not get better at reading timestamps;
  a second instrument was pointed at the object the
  question was always about

what a green staleness board guarantees
  every feed has a file whose recorded modification time
    is inside 6 hours : exactly, 288 times a day
  every feed has current data : not addressed; the
    timestamp is written by the vendor's export and the
    copy preserves it

an instrument that reads one object answers about that
object; the reading is correct and the question was about
the other one, and nothing here compares it

The monitor runs outside the pipeline, checks 288 times a day, and has
caught 31 real outages in 20 months. It reads the modification time, which the
copy preserves from a vendor export that rewrites the file every run, so of 47
feeds that served yesterday's content again it saw 6 - 1276 per ten
thousand - and 0 feeds are compared by content.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
