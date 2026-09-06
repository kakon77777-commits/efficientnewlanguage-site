<!-- canonical: efficientnewlanguage.org/ai/examples/720-the-dashboard-was-real-time-and-the-pipeline-was-hourly | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 720 — The dashboard was real time and the pipeline was hourly

`the_dashboard_was_real_time_and_the_pipeline_was_hourly.eml` - The dashboard refreshes every five seconds over a push connection and shows when it last updated. What that timestamp is the age of is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The dashboard
# refreshes every five seconds over a push connection and shows when it last
# updated. What that timestamp is the age of is computed below.
#
# The page is genuinely live. It is not a screenshot and not a five-minute
# poll: a push connection delivers the new value, the query behind it returns
# in tens of milliseconds, and the page carries a visible last-updated
# timestamp rather than leaving the reader to guess. Somebody built that
# deliberately, and every part of it is true.
#
# The timestamp says when the PAGE refreshed. The table it reads is written by
# a batch that runs once an hour and takes fourteen minutes, so the freshest
# number the page can show was computed some time ago and the page has no way
# to say so.
#
# Four of the six alerts wired to this table have windows shorter than an hour.

5 => refresh_seconds
40 => query_to_pixel_ms
60 => pipeline_interval_minutes
14 => pipeline_runtime_minutes
60 => seconds_in_a_minute
1 => timestamps_shown_on_the_page
0 => timestamps_showing_when_the_data_was_produced
6 => alerts_wired_to_this_table
4 => alerts_whose_window_is_shorter_than_the_interval

pipeline_interval_minutes + pipeline_runtime_minutes => worst_case_data_age_minutes
worst_case_data_age_minutes * seconds_in_a_minute => worst_case_data_age_seconds
int(refresh_seconds * 10000 / worst_case_data_age_seconds) => displayed_age_per_myriad_of_actual
int(alerts_whose_window_is_shorter_than_the_interval * 10000 / alerts_wired_to_this_table) => alerts_below_the_interval_per_myriad

"refresh interval, seconds       : " + str(refresh_seconds) ^0
"query to pixel, ms              : " + str(query_to_pixel_ms) ^0
"timestamps shown on the page    : " + str(timestamps_shown_on_the_page) ^0
"  showing when data was produced: " + str(timestamps_showing_when_the_data_was_produced) ^0
"" ^0
"pipeline interval, minutes      : " + str(pipeline_interval_minutes) ^0
"pipeline runtime, minutes       : " + str(pipeline_runtime_minutes) ^0
"worst case data age, minutes    : " + str(worst_case_data_age_minutes) ^0
"  in seconds                    : " + str(worst_case_data_age_seconds) ^0
"  the displayed age is          : " + str(displayed_age_per_myriad_of_actual) + " per ten thousand of it" ^0
"" ^0
"alerts wired to this table      : " + str(alerts_wired_to_this_table) ^0
"  window shorter than the interval : " + str(alerts_whose_window_is_shorter_than_the_interval) ^0
"  share                         : " + str(alerts_below_the_interval_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the page verified ----

"the live page" ^0
"  transport : a push connection, not a poll" ^0
"  refresh interval, seconds : " + str(refresh_seconds) ^0
"  query to pixel, ms        : " + str(query_to_pixel_ms) ^0
"  does it show its own freshness : yes, a visible" ^0
"    timestamp rather than nothing" ^0
"  is that timestamp correct : exactly correct" ^0
"  verdict : LIVE" ^0
"" ^0
"  showing a last-updated time at all is more than most" ^0
"  dashboards do and the number in it is right" ^0
"" ^0

# ---- what it is the age of ----

"the timestamp" ^0
"  measures : the interval between now and the last refresh" ^0
"  what refreshed : the page" ^0
"  what did not refresh : the table, which the batch owns" ^0
"  when the batch last wrote : up to " + str(worst_case_data_age_minutes) + " minutes ago" ^0
"  a timestamp for that : " + str(timestamps_showing_when_the_data_was_produced) ^0
"  where the data would have to carry it : in the rows" ^0
"" ^0
"  the page is fresh with respect to the table and the" ^0
"  reader is asking about the world" ^0
"" ^0
# ---- the two intervals ----

# Both are real intervals and both are measured. One of them is the one the
# reader is deciding with, and it is the one nothing displays.
"the two clocks on this page" ^0
"  time since the page refreshed : " + str(refresh_seconds) + " seconds, displayed" ^0
"  time since the number was true : up to" ^0
"    " + str(worst_case_data_age_minutes) + " minutes, not displayed" ^0
"  ratio between them : the first is" ^0
"    " + str(displayed_age_per_myriad_of_actual) + " per ten thousand of the second" ^0
"  which one the reader is shown : the first" ^0
"  which one the reader is using : the second" ^0
"" ^0

# ---- what a stalled pipeline looks like ----

# If the batch stops entirely the page keeps refreshing, keeps succeeding, and
# keeps saying it updated seconds ago. The failure mode of the thing that feeds
# it is invisible in the thing that displays it.
"the batch stops" ^0
"  page refreshes : continue" ^0
"  query errors   : none, the table is still there" ^0
"  timestamp shown : still seconds old" ^0
"  values shown    : the last batch's, indefinitely" ^0
"  what would change on the page : nothing" ^0
"  what would have to change for it to show : a timestamp" ^0
"    carried by the data rather than by the request" ^0
"" ^0

# ---- the four alerts ----

"the alerts on this table" ^0
"  wired to it : " + str(alerts_wired_to_this_table) ^0
"  with a window shorter than the interval : " + str(alerts_whose_window_is_shorter_than_the_interval) ^0
"  what a window shorter than the interval means : the" ^0
"    condition is evaluated over a period the source" ^0
"    cannot have observed separately" ^0
"  are those alerts firing wrongly : no; they fire late" ^0
"    and correctly, on the batch that carries the change" ^0
"  what the page implies about their latency : seconds" ^0
"" ^0

# ---- null control ----

# The same page, showing the maximum event timestamp present in the rows rather
# than the time of the request that fetched them.
worst_case_data_age_minutes => nc_age_the_page_displays_minutes
timestamps_shown_on_the_page => nc_timestamps_showing_when_the_data_was_produced

"null control - the page shows the data's own timestamp" ^0
"  refresh interval : " + str(refresh_seconds) + " seconds, unchanged" ^0
"  timestamps showing when data was produced : " + str(nc_timestamps_showing_when_the_data_was_produced) ^0
"  age the page displays, minutes : up to " + str(nc_age_the_page_displays_minutes) ^0
"  the page did not get slower or faster; it started" ^0
"  reporting the age of the answer instead of the age of" ^0
"  the question" ^0
"" ^0

# ---- the rule ----

"what a live dashboard guarantees" ^0
"  what you see is what the table holds, now : exactly," ^0
"    within " + str(query_to_pixel_ms) + " ms, over a push connection" ^0
"  what you see is what is happening now     : not" ^0
"    addressed; the page is one hop from the reader and" ^0
"    the batch is the hop that carries the age" ^0
"" ^0
"freshness composes along a chain and a display can only" ^0
"measure its own link; a timestamp attached to the fetch is" ^0
"a property of the fetch, and the one a reader needs has to" ^0
"be produced where the value was" ^0
"" ^0

"The page is genuinely live: a push connection, " + str(query_to_pixel_ms) + " ms from query to pixel, and a" ^0
"visible last-updated timestamp that is exactly correct about the refresh. The" ^0
"table under it is written by a batch every " + str(pipeline_interval_minutes) + " minutes taking " + str(pipeline_runtime_minutes) + ", so the" ^0
"displayed age is " + str(displayed_age_per_myriad_of_actual) + " per ten thousand of the " + str(worst_case_data_age_minutes) + "-minute worst case, with" ^0
str(timestamps_showing_when_the_data_was_produced) + " timestamps for the data itself and " + str(alerts_whose_window_is_shorter_than_the_interval) + " of " + str(alerts_wired_to_this_table) + " alerts - " + str(alerts_below_the_interval_per_myriad) ^0
"per ten thousand - watching windows shorter than the interval that feeds them." ^0
```

## Python (deterministic transpilation)

```python
refresh_seconds = 5
query_to_pixel_ms = 40
pipeline_interval_minutes = 60
pipeline_runtime_minutes = 14
seconds_in_a_minute = 60
timestamps_shown_on_the_page = 1
timestamps_showing_when_the_data_was_produced = 0
alerts_wired_to_this_table = 6
alerts_whose_window_is_shorter_than_the_interval = 4
worst_case_data_age_minutes = pipeline_interval_minutes + pipeline_runtime_minutes
worst_case_data_age_seconds = worst_case_data_age_minutes * seconds_in_a_minute
displayed_age_per_myriad_of_actual = int(refresh_seconds * 10000 / worst_case_data_age_seconds)
alerts_below_the_interval_per_myriad = int(alerts_whose_window_is_shorter_than_the_interval * 10000 / alerts_wired_to_this_table)
print("refresh interval, seconds       : " + str(refresh_seconds))
print("query to pixel, ms              : " + str(query_to_pixel_ms))
print("timestamps shown on the page    : " + str(timestamps_shown_on_the_page))
print("  showing when data was produced: " + str(timestamps_showing_when_the_data_was_produced))
print("")
print("pipeline interval, minutes      : " + str(pipeline_interval_minutes))
print("pipeline runtime, minutes       : " + str(pipeline_runtime_minutes))
print("worst case data age, minutes    : " + str(worst_case_data_age_minutes))
print("  in seconds                    : " + str(worst_case_data_age_seconds))
print("  the displayed age is          : " + str(displayed_age_per_myriad_of_actual) + " per ten thousand of it")
print("")
print("alerts wired to this table      : " + str(alerts_wired_to_this_table))
print("  window shorter than the interval : " + str(alerts_whose_window_is_shorter_than_the_interval))
print("  share                         : " + str(alerts_below_the_interval_per_myriad) + " per ten thousand")
print("")
print("the live page")
print("  transport : a push connection, not a poll")
print("  refresh interval, seconds : " + str(refresh_seconds))
print("  query to pixel, ms        : " + str(query_to_pixel_ms))
print("  does it show its own freshness : yes, a visible")
print("    timestamp rather than nothing")
print("  is that timestamp correct : exactly correct")
print("  verdict : LIVE")
print("")
print("  showing a last-updated time at all is more than most")
print("  dashboards do and the number in it is right")
print("")
print("the timestamp")
print("  measures : the interval between now and the last refresh")
print("  what refreshed : the page")
print("  what did not refresh : the table, which the batch owns")
print("  when the batch last wrote : up to " + str(worst_case_data_age_minutes) + " minutes ago")
print("  a timestamp for that : " + str(timestamps_showing_when_the_data_was_produced))
print("  where the data would have to carry it : in the rows")
print("")
print("  the page is fresh with respect to the table and the")
print("  reader is asking about the world")
print("")
print("the two clocks on this page")
print("  time since the page refreshed : " + str(refresh_seconds) + " seconds, displayed")
print("  time since the number was true : up to")
print("    " + str(worst_case_data_age_minutes) + " minutes, not displayed")
print("  ratio between them : the first is")
print("    " + str(displayed_age_per_myriad_of_actual) + " per ten thousand of the second")
print("  which one the reader is shown : the first")
print("  which one the reader is using : the second")
print("")
print("the batch stops")
print("  page refreshes : continue")
print("  query errors   : none, the table is still there")
print("  timestamp shown : still seconds old")
print("  values shown    : the last batch's, indefinitely")
print("  what would change on the page : nothing")
print("  what would have to change for it to show : a timestamp")
print("    carried by the data rather than by the request")
print("")
print("the alerts on this table")
print("  wired to it : " + str(alerts_wired_to_this_table))
print("  with a window shorter than the interval : " + str(alerts_whose_window_is_shorter_than_the_interval))
print("  what a window shorter than the interval means : the")
print("    condition is evaluated over a period the source")
print("    cannot have observed separately")
print("  are those alerts firing wrongly : no; they fire late")
print("    and correctly, on the batch that carries the change")
print("  what the page implies about their latency : seconds")
print("")
nc_age_the_page_displays_minutes = worst_case_data_age_minutes
nc_timestamps_showing_when_the_data_was_produced = timestamps_shown_on_the_page
print("null control - the page shows the data's own timestamp")
print("  refresh interval : " + str(refresh_seconds) + " seconds, unchanged")
print("  timestamps showing when data was produced : " + str(nc_timestamps_showing_when_the_data_was_produced))
print("  age the page displays, minutes : up to " + str(nc_age_the_page_displays_minutes))
print("  the page did not get slower or faster; it started")
print("  reporting the age of the answer instead of the age of")
print("  the question")
print("")
print("what a live dashboard guarantees")
print("  what you see is what the table holds, now : exactly,")
print("    within " + str(query_to_pixel_ms) + " ms, over a push connection")
print("  what you see is what is happening now     : not")
print("    addressed; the page is one hop from the reader and")
print("    the batch is the hop that carries the age")
print("")
print("freshness composes along a chain and a display can only")
print("measure its own link; a timestamp attached to the fetch is")
print("a property of the fetch, and the one a reader needs has to")
print("be produced where the value was")
print("")
print("The page is genuinely live: a push connection, " + str(query_to_pixel_ms) + " ms from query to pixel, and a")
print("visible last-updated timestamp that is exactly correct about the refresh. The")
print("table under it is written by a batch every " + str(pipeline_interval_minutes) + " minutes taking " + str(pipeline_runtime_minutes) + ", so the")
print("displayed age is " + str(displayed_age_per_myriad_of_actual) + " per ten thousand of the " + str(worst_case_data_age_minutes) + "-minute worst case, with")
print(str(timestamps_showing_when_the_data_was_produced) + " timestamps for the data itself and " + str(alerts_whose_window_is_shorter_than_the_interval) + " of " + str(alerts_wired_to_this_table) + " alerts - " + str(alerts_below_the_interval_per_myriad))
print("per ten thousand - watching windows shorter than the interval that feeds them.")
```

## stdout (executed)

```text
refresh interval, seconds       : 5
query to pixel, ms              : 40
timestamps shown on the page    : 1
  showing when data was produced: 0

pipeline interval, minutes      : 60
pipeline runtime, minutes       : 14
worst case data age, minutes    : 74
  in seconds                    : 4440
  the displayed age is          : 11 per ten thousand of it

alerts wired to this table      : 6
  window shorter than the interval : 4
  share                         : 6666 per ten thousand

the live page
  transport : a push connection, not a poll
  refresh interval, seconds : 5
  query to pixel, ms        : 40
  does it show its own freshness : yes, a visible
    timestamp rather than nothing
  is that timestamp correct : exactly correct
  verdict : LIVE

  showing a last-updated time at all is more than most
  dashboards do and the number in it is right

the timestamp
  measures : the interval between now and the last refresh
  what refreshed : the page
  what did not refresh : the table, which the batch owns
  when the batch last wrote : up to 74 minutes ago
  a timestamp for that : 0
  where the data would have to carry it : in the rows

  the page is fresh with respect to the table and the
  reader is asking about the world

the two clocks on this page
  time since the page refreshed : 5 seconds, displayed
  time since the number was true : up to
    74 minutes, not displayed
  ratio between them : the first is
    11 per ten thousand of the second
  which one the reader is shown : the first
  which one the reader is using : the second

the batch stops
  page refreshes : continue
  query errors   : none, the table is still there
  timestamp shown : still seconds old
  values shown    : the last batch's, indefinitely
  what would change on the page : nothing
  what would have to change for it to show : a timestamp
    carried by the data rather than by the request

the alerts on this table
  wired to it : 6
  with a window shorter than the interval : 4
  what a window shorter than the interval means : the
    condition is evaluated over a period the source
    cannot have observed separately
  are those alerts firing wrongly : no; they fire late
    and correctly, on the batch that carries the change
  what the page implies about their latency : seconds

null control - the page shows the data's own timestamp
  refresh interval : 5 seconds, unchanged
  timestamps showing when data was produced : 1
  age the page displays, minutes : up to 74
  the page did not get slower or faster; it started
  reporting the age of the answer instead of the age of
  the question

what a live dashboard guarantees
  what you see is what the table holds, now : exactly,
    within 40 ms, over a push connection
  what you see is what is happening now     : not
    addressed; the page is one hop from the reader and
    the batch is the hop that carries the age

freshness composes along a chain and a display can only
measure its own link; a timestamp attached to the fetch is
a property of the fetch, and the one a reader needs has to
be produced where the value was

The page is genuinely live: a push connection, 40 ms from query to pixel, and a
visible last-updated timestamp that is exactly correct about the refresh. The
table under it is written by a batch every 60 minutes taking 14, so the
displayed age is 11 per ten thousand of the 74-minute worst case, with
0 timestamps for the data itself and 4 of 6 alerts - 6666
per ten thousand - watching windows shorter than the interval that feeds them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
