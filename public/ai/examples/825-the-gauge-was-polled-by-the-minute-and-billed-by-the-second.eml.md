<!-- canonical: efficientnewlanguage.org/ai/examples/825-the-gauge-was-polled-by-the-minute-and-billed-by-the-second | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 825 — The gauge was polled by the minute and billed by the second

`the_gauge_was_polled_by_the_minute_and_billed_by_the_second.eml` - The bandwidth monitor showed a comfortable peak under the alert threshold all month, and every sample it took was real. What resolution the monitor reads at, against what resolution the bill is computed at, is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The bandwidth
# monitor showed a comfortable peak under the alert threshold all month, and
# every sample it took was real. What resolution the monitor reads at, against
# what resolution the bill is computed at, is computed below.
#
# The monitor is honest. It reads a real interface counter, not an estimate;
# every sample is kept; the alert compares each sample to the threshold; and the
# monthly peak on the chart is the true maximum of those samples.
#
# The monitor polls once a minute, and the bill is computed on the per-second
# peak.

60 => monitor_poll_interval_seconds
1 => bill_measurement_interval_seconds
400 => monitored_peak_mbps
950 => billed_peak_mbps
800 => alert_threshold_mbps
5 => burst_duration_seconds

billed_peak_mbps - monitored_peak_mbps => gap_between_bill_and_monitor_mbps
billed_peak_mbps - alert_threshold_mbps => amount_the_billed_peak_is_over_threshold_mbps
int(monitor_poll_interval_seconds / bill_measurement_interval_seconds) => bill_samples_per_monitor_sample
0 => alerts_that_fired

"monitor poll interval           : " + str(monitor_poll_interval_seconds) + " seconds" ^0
"bill measurement interval       : " + str(bill_measurement_interval_seconds) + " second" ^0
"  bill samples per monitor sample : " + str(bill_samples_per_monitor_sample) ^0
"monitored peak                  : " + str(monitored_peak_mbps) + " mbps" ^0
"billed peak                     : " + str(billed_peak_mbps) + " mbps" ^0
"  gap                           : " + str(gap_between_bill_and_monitor_mbps) + " mbps" ^0
"alert threshold                 : " + str(alert_threshold_mbps) + " mbps" ^0
"  billed peak over it by        : " + str(amount_the_billed_peak_is_over_threshold_mbps) + " mbps" ^0
"burst duration                  : " + str(burst_duration_seconds) + " seconds" ^0
"alerts that fired               : " + str(alerts_that_fired) ^0
"" ^0

# ---- what the monitor verified ----

"the bandwidth monitor" ^0
"  reads : a real interface counter, not an estimate" ^0
"  samples kept : all of them" ^0
"  alert : each sample compared to the threshold" ^0
"  monthly peak : the true maximum of the samples" ^0
"  samples over the threshold : 0" ^0
"  verdict : UNDER THE THRESHOLD" ^0
"" ^0
"  the charted peak being the real max of real samples is" ^0
"  the part done right here, and it is why the monitor is" ^0
"  not smoothing the peak away by averaging" ^0
"" ^0

# ---- the two resolutions ----

"monitor and bill, side by side" ^0
"  the monitor reads : once every " + str(monitor_poll_interval_seconds) + " seconds" ^0
"  the bill reads : the peak over every " + str(bill_measurement_interval_seconds) + " second" ^0
"  a " + str(burst_duration_seconds) + "-second burst : is one data point to the bill and" ^0
"    invisible between the monitor's samples" ^0
"  the monitor's max : " + str(monitored_peak_mbps) + " mbps, a calm minute" ^0
"  the bill's max : " + str(billed_peak_mbps) + " mbps, the burst" ^0
"" ^0

# ---- what the bill charged ----

"the invoice, on the per-second peak" ^0
"  peak it billed : " + str(billed_peak_mbps) + " mbps" ^0
"  over the alert threshold by : " ^0
"    " + str(amount_the_billed_peak_is_over_threshold_mbps) + " mbps" ^0
"  what the monitor warned about it : nothing; its max was" ^0
"    " + str(monitored_peak_mbps) ^0
"  is any monitor sample wrong : no; each is a real reading" ^0
"  is the monitored peak the billed peak : no; they read" ^0
"    at different resolutions" ^0
"" ^0

# ---- null control ----

# The same traffic, with the monitor reading the counter's own per-second
# maximum since the last poll rather than an instantaneous value.
400 => nc_instantaneous_monitored_peak_mbps
950 => nc_max_since_last_read_peak_mbps
1 => nc_alerts_it_would_raise

"null control - monitor the per-second max since last read" ^0
"  instantaneous monitored peak : " ^0
"    " + str(nc_instantaneous_monitored_peak_mbps) + " mbps" ^0
"  max-since-last-read peak : " ^0
"    " + str(nc_max_since_last_read_peak_mbps) + " mbps" ^0
"  alerts it would raise : " + str(nc_alerts_it_would_raise) ^0
"  no byte and no poll interval changed; the monitor's" ^0
"  reading stopped being coarser than the bill's" ^0
"" ^0

# ---- the rule ----

"what a peak under the threshold guarantees" ^0
"  no monitor sample exceeded the threshold : exactly," ^0
"    real counter, every sample kept and checked" ^0
"  the bandwidth stayed under the threshold : not" ^0
"    addressed; billing is on the per-second peak and" ^0
"    monitoring polls per minute - a " + str(burst_duration_seconds) + "-second burst hit " ^0
"    " + str(billed_peak_mbps) + " (billed) while the per-minute max was " + str(monitored_peak_mbps) ^0
"    (monitored), under " + str(alert_threshold_mbps) ^0
"" ^0

"two instruments on one quantity at different resolutions do not measure the" ^0
"same thing; the peak is real at the bill's resolution and absent at the" ^0
"monitor's, and the money follows the finer one" ^0
"" ^0

"It reads a real counter, keeps every sample, and charts the true max - none" ^0
"over " + str(alert_threshold_mbps) + " mbps. It polls per minute while the bill is the per-second peak, so a" ^0
"" + str(burst_duration_seconds) + "-second burst billed at " + str(billed_peak_mbps) + " never showed above the monitored " + str(monitored_peak_mbps) + "," ^0
"a " + str(gap_between_bill_and_monitor_mbps) + " mbps gap, under " + str(alerts_that_fired) + " alerts." ^0
```

## Python (deterministic transpilation)

```python
monitor_poll_interval_seconds = 60
bill_measurement_interval_seconds = 1
monitored_peak_mbps = 400
billed_peak_mbps = 950
alert_threshold_mbps = 800
burst_duration_seconds = 5
gap_between_bill_and_monitor_mbps = billed_peak_mbps - monitored_peak_mbps
amount_the_billed_peak_is_over_threshold_mbps = billed_peak_mbps - alert_threshold_mbps
bill_samples_per_monitor_sample = int(monitor_poll_interval_seconds / bill_measurement_interval_seconds)
alerts_that_fired = 0
print("monitor poll interval           : " + str(monitor_poll_interval_seconds) + " seconds")
print("bill measurement interval       : " + str(bill_measurement_interval_seconds) + " second")
print("  bill samples per monitor sample : " + str(bill_samples_per_monitor_sample))
print("monitored peak                  : " + str(monitored_peak_mbps) + " mbps")
print("billed peak                     : " + str(billed_peak_mbps) + " mbps")
print("  gap                           : " + str(gap_between_bill_and_monitor_mbps) + " mbps")
print("alert threshold                 : " + str(alert_threshold_mbps) + " mbps")
print("  billed peak over it by        : " + str(amount_the_billed_peak_is_over_threshold_mbps) + " mbps")
print("burst duration                  : " + str(burst_duration_seconds) + " seconds")
print("alerts that fired               : " + str(alerts_that_fired))
print("")
print("the bandwidth monitor")
print("  reads : a real interface counter, not an estimate")
print("  samples kept : all of them")
print("  alert : each sample compared to the threshold")
print("  monthly peak : the true maximum of the samples")
print("  samples over the threshold : 0")
print("  verdict : UNDER THE THRESHOLD")
print("")
print("  the charted peak being the real max of real samples is")
print("  the part done right here, and it is why the monitor is")
print("  not smoothing the peak away by averaging")
print("")
print("monitor and bill, side by side")
print("  the monitor reads : once every " + str(monitor_poll_interval_seconds) + " seconds")
print("  the bill reads : the peak over every " + str(bill_measurement_interval_seconds) + " second")
print("  a " + str(burst_duration_seconds) + "-second burst : is one data point to the bill and")
print("    invisible between the monitor's samples")
print("  the monitor's max : " + str(monitored_peak_mbps) + " mbps, a calm minute")
print("  the bill's max : " + str(billed_peak_mbps) + " mbps, the burst")
print("")
print("the invoice, on the per-second peak")
print("  peak it billed : " + str(billed_peak_mbps) + " mbps")
print("  over the alert threshold by : ")
print("    " + str(amount_the_billed_peak_is_over_threshold_mbps) + " mbps")
print("  what the monitor warned about it : nothing; its max was")
print("    " + str(monitored_peak_mbps))
print("  is any monitor sample wrong : no; each is a real reading")
print("  is the monitored peak the billed peak : no; they read")
print("    at different resolutions")
print("")
nc_instantaneous_monitored_peak_mbps = 400
nc_max_since_last_read_peak_mbps = 950
nc_alerts_it_would_raise = 1
print("null control - monitor the per-second max since last read")
print("  instantaneous monitored peak : ")
print("    " + str(nc_instantaneous_monitored_peak_mbps) + " mbps")
print("  max-since-last-read peak : ")
print("    " + str(nc_max_since_last_read_peak_mbps) + " mbps")
print("  alerts it would raise : " + str(nc_alerts_it_would_raise))
print("  no byte and no poll interval changed; the monitor's")
print("  reading stopped being coarser than the bill's")
print("")
print("what a peak under the threshold guarantees")
print("  no monitor sample exceeded the threshold : exactly,")
print("    real counter, every sample kept and checked")
print("  the bandwidth stayed under the threshold : not")
print("    addressed; billing is on the per-second peak and")
print("    monitoring polls per minute - a " + str(burst_duration_seconds) + "-second burst hit ")
print("    " + str(billed_peak_mbps) + " (billed) while the per-minute max was " + str(monitored_peak_mbps))
print("    (monitored), under " + str(alert_threshold_mbps))
print("")
print("two instruments on one quantity at different resolutions do not measure the")
print("same thing; the peak is real at the bill's resolution and absent at the")
print("monitor's, and the money follows the finer one")
print("")
print("It reads a real counter, keeps every sample, and charts the true max - none")
print("over " + str(alert_threshold_mbps) + " mbps. It polls per minute while the bill is the per-second peak, so a")
print("" + str(burst_duration_seconds) + "-second burst billed at " + str(billed_peak_mbps) + " never showed above the monitored " + str(monitored_peak_mbps) + ",")
print("a " + str(gap_between_bill_and_monitor_mbps) + " mbps gap, under " + str(alerts_that_fired) + " alerts.")
```

## stdout (executed)

```text
monitor poll interval           : 60 seconds
bill measurement interval       : 1 second
  bill samples per monitor sample : 60
monitored peak                  : 400 mbps
billed peak                     : 950 mbps
  gap                           : 550 mbps
alert threshold                 : 800 mbps
  billed peak over it by        : 150 mbps
burst duration                  : 5 seconds
alerts that fired               : 0

the bandwidth monitor
  reads : a real interface counter, not an estimate
  samples kept : all of them
  alert : each sample compared to the threshold
  monthly peak : the true maximum of the samples
  samples over the threshold : 0
  verdict : UNDER THE THRESHOLD

  the charted peak being the real max of real samples is
  the part done right here, and it is why the monitor is
  not smoothing the peak away by averaging

monitor and bill, side by side
  the monitor reads : once every 60 seconds
  the bill reads : the peak over every 1 second
  a 5-second burst : is one data point to the bill and
    invisible between the monitor's samples
  the monitor's max : 400 mbps, a calm minute
  the bill's max : 950 mbps, the burst

the invoice, on the per-second peak
  peak it billed : 950 mbps
  over the alert threshold by : 
    150 mbps
  what the monitor warned about it : nothing; its max was
    400
  is any monitor sample wrong : no; each is a real reading
  is the monitored peak the billed peak : no; they read
    at different resolutions

null control - monitor the per-second max since last read
  instantaneous monitored peak : 
    400 mbps
  max-since-last-read peak : 
    950 mbps
  alerts it would raise : 1
  no byte and no poll interval changed; the monitor's
  reading stopped being coarser than the bill's

what a peak under the threshold guarantees
  no monitor sample exceeded the threshold : exactly,
    real counter, every sample kept and checked
  the bandwidth stayed under the threshold : not
    addressed; billing is on the per-second peak and
    monitoring polls per minute - a 5-second burst hit 
    950 (billed) while the per-minute max was 400
    (monitored), under 800

two instruments on one quantity at different resolutions do not measure the
same thing; the peak is real at the bill's resolution and absent at the
monitor's, and the money follows the finer one

It reads a real counter, keeps every sample, and charts the true max - none
over 800 mbps. It polls per minute while the bill is the per-second peak, so a
5-second burst billed at 950 never showed above the monitored 400,
a 550 mbps gap, under 0 alerts.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
