<!-- canonical: efficientnewlanguage.org/ai/examples/826-the-heartbeat-stopped-and-the-status-stayed-green | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 826 — The heartbeat stopped and the status stayed green

`the_heartbeat_stopped_and_the_status_stayed_green.eml` - The service status board has shown green for the whole shift, and every status it displayed was the one the service reported. What a stopped report displays as is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The service status
# board has shown green for the whole shift, and every status it displayed was
# the one the service reported. What a stopped report displays as is computed
# below.
#
# The health reporting is built carefully. The service pushes a heartbeat every
# ten seconds carrying its own self-check; the board shows the last status
# received; a status of anything but healthy turns the tile red; and the board
# is on the wall where everyone can see it.
#
# The board shows the LAST heartbeat's status, and a stopped heartbeat sends
# nothing to replace it.

10 => heartbeat_interval_seconds
47 => minutes_since_the_last_heartbeat
6 => heartbeats_expected_per_minute
0 => heartbeats_received_since
0 => tiles_that_turn_red_on_a_missing_heartbeat

minutes_since_the_last_heartbeat * heartbeats_expected_per_minute => heartbeats_expected_but_absent
minutes_since_the_last_heartbeat * 60 => seconds_the_status_has_been_stale

"heartbeat interval              : " + str(heartbeat_interval_seconds) + " seconds" ^0
"minutes since the last beat     : " + str(minutes_since_the_last_heartbeat) ^0
"  heartbeats expected since     : " + str(heartbeats_expected_but_absent) ^0
"  heartbeats received since     : " + str(heartbeats_received_since) ^0
"seconds the status has been stale : " + str(seconds_the_status_has_been_stale) ^0
"board status                    : green (last received)" ^0
"tiles that go red on absence    : " + str(tiles_that_turn_red_on_a_missing_heartbeat) ^0
"" ^0

# ---- what the board verified ----

"the status board" ^0
"  source : a heartbeat the service pushes every ten" ^0
"    seconds, carrying its own self-check" ^0
"  shows : the last status received" ^0
"  on a non-healthy status : the tile turns red" ^0
"  visibility : on the wall" ^0
"  non-healthy statuses received : 0" ^0
"  verdict : HEALTHY" ^0
"" ^0
"  turning red on a reported fault is the part done right" ^0
"  here, and it is why a sick service that still reports" ^0
"  would show red" ^0
"" ^0

# ---- what a stopped heartbeat displays as ----

"the beats that never arrived" ^0
"  expected in the last 47 minutes : " ^0
"    " + str(heartbeats_expected_but_absent) ^0
"  received : " + str(heartbeats_received_since) ^0
"  what the board does with no new status : keeps the" ^0
"    last one" ^0
"  what the last one was : green" ^0
"  so absence displays as : the last health, held" ^0
"    indefinitely" ^0
"" ^0

# ---- what the service was actually doing ----

"the service behind the green tile" ^0
"  state : dead for " + str(minutes_since_the_last_heartbeat) + " minutes" ^0
"  what a dead service reports : nothing" ^0
"  what nothing turns the tile : green, still" ^0
"  the transition to red on silence : never defined" ^0
"  is any displayed status wrong : no; each was really" ^0
"    reported, once" ^0
"  is the current display a current fact : no" ^0
"" ^0

# ---- null control ----

# The same board, with a tile that turns red when no heartbeat has arrived for
# more than three intervals.
0 => nc_red_tiles_when_absence_holds_green
1 => nc_red_tiles_when_absence_turns_red
282 => nc_missing_beats_it_would_notice

"null control - absence turns the tile red" ^0
"  red tiles, absence holds green : " ^0
"    " + str(nc_red_tiles_when_absence_holds_green) ^0
"  red tiles, absence turns red : " ^0
"    " + str(nc_red_tiles_when_absence_turns_red) ^0
"  missing beats it would notice : " ^0
"    " + str(nc_missing_beats_it_would_notice) ^0
"  no heartbeat changed; the board stopped treating no" ^0
"  news as good news" ^0
"" ^0

# ---- the rule ----

"what a green status board guarantees" ^0
"  the last status the service reported was healthy :" ^0
"    exactly, and a reported fault would turn it red" ^0
"  the service is healthy : not addressed; the board shows" ^0
"    the last heartbeat's status, and a stopped heartbeat is" ^0
"    absence, not health - " + str(heartbeats_expected_but_absent) + " expected beats, 0 received," ^0
"    still green" ^0
"" ^0

"a display of the last report is a fact about the past, and health is a fact" ^0
"about now; the two coincide only while the reports keep coming, and the moment" ^0
"they stop is the moment the display means the least" ^0
"" ^0

"The board shows the last pushed status and reddens on a reported fault - green" ^0
"all shift. It holds the last status when beats stop, so " + str(minutes_since_the_last_heartbeat) + " minutes of silence -" ^0
"" + str(heartbeats_expected_but_absent) + " expected beats, none received - display as green, under " + str(tiles_that_turn_red_on_a_missing_heartbeat) + " tiles that" ^0
"redden on absence." ^0
```

## Python (deterministic transpilation)

```python
heartbeat_interval_seconds = 10
minutes_since_the_last_heartbeat = 47
heartbeats_expected_per_minute = 6
heartbeats_received_since = 0
tiles_that_turn_red_on_a_missing_heartbeat = 0
heartbeats_expected_but_absent = minutes_since_the_last_heartbeat * heartbeats_expected_per_minute
seconds_the_status_has_been_stale = minutes_since_the_last_heartbeat * 60
print("heartbeat interval              : " + str(heartbeat_interval_seconds) + " seconds")
print("minutes since the last beat     : " + str(minutes_since_the_last_heartbeat))
print("  heartbeats expected since     : " + str(heartbeats_expected_but_absent))
print("  heartbeats received since     : " + str(heartbeats_received_since))
print("seconds the status has been stale : " + str(seconds_the_status_has_been_stale))
print("board status                    : green (last received)")
print("tiles that go red on absence    : " + str(tiles_that_turn_red_on_a_missing_heartbeat))
print("")
print("the status board")
print("  source : a heartbeat the service pushes every ten")
print("    seconds, carrying its own self-check")
print("  shows : the last status received")
print("  on a non-healthy status : the tile turns red")
print("  visibility : on the wall")
print("  non-healthy statuses received : 0")
print("  verdict : HEALTHY")
print("")
print("  turning red on a reported fault is the part done right")
print("  here, and it is why a sick service that still reports")
print("  would show red")
print("")
print("the beats that never arrived")
print("  expected in the last 47 minutes : ")
print("    " + str(heartbeats_expected_but_absent))
print("  received : " + str(heartbeats_received_since))
print("  what the board does with no new status : keeps the")
print("    last one")
print("  what the last one was : green")
print("  so absence displays as : the last health, held")
print("    indefinitely")
print("")
print("the service behind the green tile")
print("  state : dead for " + str(minutes_since_the_last_heartbeat) + " minutes")
print("  what a dead service reports : nothing")
print("  what nothing turns the tile : green, still")
print("  the transition to red on silence : never defined")
print("  is any displayed status wrong : no; each was really")
print("    reported, once")
print("  is the current display a current fact : no")
print("")
nc_red_tiles_when_absence_holds_green = 0
nc_red_tiles_when_absence_turns_red = 1
nc_missing_beats_it_would_notice = 282
print("null control - absence turns the tile red")
print("  red tiles, absence holds green : ")
print("    " + str(nc_red_tiles_when_absence_holds_green))
print("  red tiles, absence turns red : ")
print("    " + str(nc_red_tiles_when_absence_turns_red))
print("  missing beats it would notice : ")
print("    " + str(nc_missing_beats_it_would_notice))
print("  no heartbeat changed; the board stopped treating no")
print("  news as good news")
print("")
print("what a green status board guarantees")
print("  the last status the service reported was healthy :")
print("    exactly, and a reported fault would turn it red")
print("  the service is healthy : not addressed; the board shows")
print("    the last heartbeat's status, and a stopped heartbeat is")
print("    absence, not health - " + str(heartbeats_expected_but_absent) + " expected beats, 0 received,")
print("    still green")
print("")
print("a display of the last report is a fact about the past, and health is a fact")
print("about now; the two coincide only while the reports keep coming, and the moment")
print("they stop is the moment the display means the least")
print("")
print("The board shows the last pushed status and reddens on a reported fault - green")
print("all shift. It holds the last status when beats stop, so " + str(minutes_since_the_last_heartbeat) + " minutes of silence -")
print("" + str(heartbeats_expected_but_absent) + " expected beats, none received - display as green, under " + str(tiles_that_turn_red_on_a_missing_heartbeat) + " tiles that")
print("redden on absence.")
```

## stdout (executed)

```text
heartbeat interval              : 10 seconds
minutes since the last beat     : 47
  heartbeats expected since     : 282
  heartbeats received since     : 0
seconds the status has been stale : 2820
board status                    : green (last received)
tiles that go red on absence    : 0

the status board
  source : a heartbeat the service pushes every ten
    seconds, carrying its own self-check
  shows : the last status received
  on a non-healthy status : the tile turns red
  visibility : on the wall
  non-healthy statuses received : 0
  verdict : HEALTHY

  turning red on a reported fault is the part done right
  here, and it is why a sick service that still reports
  would show red

the beats that never arrived
  expected in the last 47 minutes : 
    282
  received : 0
  what the board does with no new status : keeps the
    last one
  what the last one was : green
  so absence displays as : the last health, held
    indefinitely

the service behind the green tile
  state : dead for 47 minutes
  what a dead service reports : nothing
  what nothing turns the tile : green, still
  the transition to red on silence : never defined
  is any displayed status wrong : no; each was really
    reported, once
  is the current display a current fact : no

null control - absence turns the tile red
  red tiles, absence holds green : 
    0
  red tiles, absence turns red : 
    1
  missing beats it would notice : 
    282
  no heartbeat changed; the board stopped treating no
  news as good news

what a green status board guarantees
  the last status the service reported was healthy :
    exactly, and a reported fault would turn it red
  the service is healthy : not addressed; the board shows
    the last heartbeat's status, and a stopped heartbeat is
    absence, not health - 282 expected beats, 0 received,
    still green

a display of the last report is a fact about the past, and health is a fact
about now; the two coincide only while the reports keep coming, and the moment
they stop is the moment the display means the least

The board shows the last pushed status and reddens on a reported fault - green
all shift. It holds the last status when beats stop, so 47 minutes of silence -
282 expected beats, none received - display as green, under 0 tiles that
redden on absence.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
