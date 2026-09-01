<!-- canonical: efficientnewlanguage.org/ai/examples/646-the-disk-had-space-and-the-inodes-did-not | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 646 — The disk had space and the inodes did not

`the_disk_had_space_and_the_inodes_did_not.eml` - The volume is thirty-eight percent free and the capacity dashboard is correct. Why writes are failing is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The volume is
# thirty-eight percent free and the capacity dashboard is correct. Why writes
# are failing is computed below.
#
# The capacity monitoring is not neglected. It samples every thirty seconds, it
# alerts at eighty percent and pages at ninety, it has a forecast that would
# have raised this six weeks before the volume filled, and it caught a runaway
# log last month at seventy-three percent. The number it reports is right.
#
# A filesystem has two exhaustible resources and the dashboard watches one. Free
# bytes and free inodes are independent, and a workload of very small files
# consumes the second at a rate the first does not reveal.
#
# The cache writes one file per key. The files average ten kilobytes and there
# are a hundred and twenty-two million of them.

2000000000000 => capacity_bytes
1240000000000 => used_bytes
122000000 => inodes_total
122000000 => inodes_used
4100 => failing_writes_per_minute
0 => capacity_alerts_fired

capacity_bytes - used_bytes => free_bytes
int(free_bytes * 100 / capacity_bytes) => free_percent
inodes_total - inodes_used => free_inodes
int(used_bytes / inodes_used) => mean_file_bytes

"capacity, bytes      : " + str(capacity_bytes) ^0
"used, bytes          : " + str(used_bytes) ^0
"free, bytes          : " + str(free_bytes) ^0
"free, percent        : " + str(free_percent) ^0
"" ^0
"inodes total         : " + str(inodes_total) ^0
"inodes used          : " + str(inodes_used) ^0
"inodes free          : " + str(free_inodes) ^0
"mean file size, bytes: " + str(mean_file_bytes) ^0
"" ^0

# ---- what the dashboard verified ----

"the capacity monitor" ^0
"  sample interval, seconds : 30" ^0
"  warns at, percent used   : 80" ^0
"  pages at, percent used   : 90" ^0
"  currently used, percent  : " + str(100 - free_percent) ^0
"  forecast to full         : six weeks of headroom" ^0
"  alerts fired             : " + str(capacity_alerts_fired) ^0
"  verdict                  : HEALTHY" ^0
"" ^0
"  it caught a runaway log last month at 73 percent; this" ^0
"  is a working monitor reading a true number" ^0
"" ^0

# ---- what ran out ----

"the error the application sees" ^0
"  errno            : ENOSPC" ^0
"  message          : No space left on device" ^0
"  free bytes       : " + str(free_bytes) ^0
"  free inodes      : " + str(free_inodes) ^0
"  failing writes per minute : " + str(failing_writes_per_minute) ^0
"" ^0
"  the message names the resource the dashboard watches and" ^0
"  the kernel means the other one" ^0
"" ^0

# ---- why the size never gave it away ----

# Inode consumption is a function of the file COUNT. The mean size is the
# quotient of the two quantities and is not one of them; a workload can halve
# its bytes and double its inodes at the same time.
int(free_bytes * 10000 / capacity_bytes) => free_bytes_per_myriad
int(free_inodes * 10000 / inodes_total) => free_inodes_per_myriad

"the two resources, in the same unit" ^0
"  free bytes  : " + str(free_bytes_per_myriad) + " per ten thousand" ^0
"  free inodes : " + str(free_inodes_per_myriad) + " per ten thousand" ^0
"" ^0
"  neither number can be computed from the other; the mean" ^0
"  file size is their quotient and constrains neither" ^0
"" ^0

# ---- null control ----

# The same volume and the same workload, with the cache packing keys into
# fixed-size segment files instead of one file per key.
4096 => nc_keys_per_segment
int(inodes_used / nc_keys_per_segment) => nc_inodes_used
inodes_total - nc_inodes_used => nc_free_inodes
0 => nc_failing_writes_per_minute

"null control - one segment file per 4096 keys" ^0
"  free bytes, percent : " + str(free_percent) + ", unchanged" ^0
"  inodes used         : " + str(nc_inodes_used) ^0
"  inodes free         : " + str(nc_free_inodes) ^0
"  failing writes / min: " + str(nc_failing_writes_per_minute) ^0
"  the volume did not grow; the workload stopped spending" ^0
"  the resource nobody was counting" ^0
"" ^0

# ---- the rule ----

"what free space guarantees" ^0
"  bytes can still be written : exactly" ^0
"  a write will succeed        : not addressed; a write" ^0
"    needs a byte AND an entry, and a monitor that watches" ^0
"    one of two exhaustible resources is green until the" ^0
"    other one is gone" ^0
"" ^0
"'is there room' is two questions on any filesystem; the error" ^0
"message uses one word for both, which is why the dashboard" ^0
"and the kernel can each be right" ^0
"" ^0

"The volume is " + str(free_percent) + " percent free and the capacity monitor is right to be green:" ^0
"it samples every 30 seconds, warns at 80, forecasts six weeks of headroom and" ^0
"caught a runaway log last month. Writes fail ENOSPC " + str(failing_writes_per_minute) + " times a minute because" ^0
"the other exhaustible resource is at " + str(free_inodes) + " free of " + str(inodes_total) + " - " + str(free_inodes_per_myriad) + " per ten" ^0
"thousand against " + str(free_bytes_per_myriad) + " for bytes - spent by a cache averaging " + str(mean_file_bytes) + " bytes a file." ^0
```

## Python (deterministic transpilation)

```python
capacity_bytes = 2000000000000
used_bytes = 1240000000000
inodes_total = 122000000
inodes_used = 122000000
failing_writes_per_minute = 4100
capacity_alerts_fired = 0
free_bytes = capacity_bytes - used_bytes
free_percent = int(free_bytes * 100 / capacity_bytes)
free_inodes = inodes_total - inodes_used
mean_file_bytes = int(used_bytes / inodes_used)
print("capacity, bytes      : " + str(capacity_bytes))
print("used, bytes          : " + str(used_bytes))
print("free, bytes          : " + str(free_bytes))
print("free, percent        : " + str(free_percent))
print("")
print("inodes total         : " + str(inodes_total))
print("inodes used          : " + str(inodes_used))
print("inodes free          : " + str(free_inodes))
print("mean file size, bytes: " + str(mean_file_bytes))
print("")
print("the capacity monitor")
print("  sample interval, seconds : 30")
print("  warns at, percent used   : 80")
print("  pages at, percent used   : 90")
print("  currently used, percent  : " + str(100 - free_percent))
print("  forecast to full         : six weeks of headroom")
print("  alerts fired             : " + str(capacity_alerts_fired))
print("  verdict                  : HEALTHY")
print("")
print("  it caught a runaway log last month at 73 percent; this")
print("  is a working monitor reading a true number")
print("")
print("the error the application sees")
print("  errno            : ENOSPC")
print("  message          : No space left on device")
print("  free bytes       : " + str(free_bytes))
print("  free inodes      : " + str(free_inodes))
print("  failing writes per minute : " + str(failing_writes_per_minute))
print("")
print("  the message names the resource the dashboard watches and")
print("  the kernel means the other one")
print("")
free_bytes_per_myriad = int(free_bytes * 10000 / capacity_bytes)
free_inodes_per_myriad = int(free_inodes * 10000 / inodes_total)
print("the two resources, in the same unit")
print("  free bytes  : " + str(free_bytes_per_myriad) + " per ten thousand")
print("  free inodes : " + str(free_inodes_per_myriad) + " per ten thousand")
print("")
print("  neither number can be computed from the other; the mean")
print("  file size is their quotient and constrains neither")
print("")
nc_keys_per_segment = 4096
nc_inodes_used = int(inodes_used / nc_keys_per_segment)
nc_free_inodes = inodes_total - nc_inodes_used
nc_failing_writes_per_minute = 0
print("null control - one segment file per 4096 keys")
print("  free bytes, percent : " + str(free_percent) + ", unchanged")
print("  inodes used         : " + str(nc_inodes_used))
print("  inodes free         : " + str(nc_free_inodes))
print("  failing writes / min: " + str(nc_failing_writes_per_minute))
print("  the volume did not grow; the workload stopped spending")
print("  the resource nobody was counting")
print("")
print("what free space guarantees")
print("  bytes can still be written : exactly")
print("  a write will succeed        : not addressed; a write")
print("    needs a byte AND an entry, and a monitor that watches")
print("    one of two exhaustible resources is green until the")
print("    other one is gone")
print("")
print("'is there room' is two questions on any filesystem; the error")
print("message uses one word for both, which is why the dashboard")
print("and the kernel can each be right")
print("")
print("The volume is " + str(free_percent) + " percent free and the capacity monitor is right to be green:")
print("it samples every 30 seconds, warns at 80, forecasts six weeks of headroom and")
print("caught a runaway log last month. Writes fail ENOSPC " + str(failing_writes_per_minute) + " times a minute because")
print("the other exhaustible resource is at " + str(free_inodes) + " free of " + str(inodes_total) + " - " + str(free_inodes_per_myriad) + " per ten")
print("thousand against " + str(free_bytes_per_myriad) + " for bytes - spent by a cache averaging " + str(mean_file_bytes) + " bytes a file.")
```

## stdout (executed)

```text
capacity, bytes      : 2000000000000
used, bytes          : 1240000000000
free, bytes          : 760000000000
free, percent        : 38

inodes total         : 122000000
inodes used          : 122000000
inodes free          : 0
mean file size, bytes: 10163

the capacity monitor
  sample interval, seconds : 30
  warns at, percent used   : 80
  pages at, percent used   : 90
  currently used, percent  : 62
  forecast to full         : six weeks of headroom
  alerts fired             : 0
  verdict                  : HEALTHY

  it caught a runaway log last month at 73 percent; this
  is a working monitor reading a true number

the error the application sees
  errno            : ENOSPC
  message          : No space left on device
  free bytes       : 760000000000
  free inodes      : 0
  failing writes per minute : 4100

  the message names the resource the dashboard watches and
  the kernel means the other one

the two resources, in the same unit
  free bytes  : 3800 per ten thousand
  free inodes : 0 per ten thousand

  neither number can be computed from the other; the mean
  file size is their quotient and constrains neither

null control - one segment file per 4096 keys
  free bytes, percent : 38, unchanged
  inodes used         : 29785
  inodes free         : 121970215
  failing writes / min: 0
  the volume did not grow; the workload stopped spending
  the resource nobody was counting

what free space guarantees
  bytes can still be written : exactly
  a write will succeed        : not addressed; a write
    needs a byte AND an entry, and a monitor that watches
    one of two exhaustible resources is green until the
    other one is gone

'is there room' is two questions on any filesystem; the error
message uses one word for both, which is why the dashboard
and the kernel can each be right

The volume is 38 percent free and the capacity monitor is right to be green:
it samples every 30 seconds, warns at 80, forecasts six weeks of headroom and
caught a runaway log last month. Writes fail ENOSPC 4100 times a minute because
the other exhaustible resource is at 0 free of 122000000 - 0 per ten
thousand against 3800 for bytes - spent by a cache averaging 10163 bytes a file.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
