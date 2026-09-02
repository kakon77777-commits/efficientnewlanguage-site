<!-- canonical: efficientnewlanguage.org/ai/examples/670-the-token-was-refreshed-early-and-the-refresh-needed-the-old-one | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 670 — The token was refreshed early and the refresh needed the old one

`the_token_was_refreshed_early_and_the_refresh_needed_the_old_one.eml` - The client refreshes five minutes before expiry, which is the right pattern. What happens on a client whose clock is wrong is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The client
# refreshes five minutes before expiry, which is the right pattern. What happens
# on a client whose clock is wrong is computed below.
#
# The refresh logic is correct. It does not wait for a rejection, it renews on a
# margin, the margin was chosen to cover a slow network and a retry, and the
# renewal is idempotent so two in flight do no harm. On a machine whose clock is
# right, this never produces a failed call.
#
# The margin is measured against the CLIENT's clock and the expiry is decided by
# the server's. A client that believes it is five minutes early is early by five
# minutes minus its own error, and that quantity can be negative.
#
# Two thousand one hundred and forty clients are more than five minutes fast.

3600 => token_lifetime_seconds
300 => refresh_margin_seconds
340 => skew_of_an_affected_client_seconds
18400 => clients
2140 => clients_skewed_beyond_the_margin
60 => retry_attempts_per_minute
0 => refresh_logic_defects

skew_of_an_affected_client_seconds - refresh_margin_seconds => seconds_late_when_it_refreshes
clients - clients_skewed_beyond_the_margin => clients_unaffected
clients_skewed_beyond_the_margin * retry_attempts_per_minute => rejected_refreshes_per_minute

"token lifetime, seconds       : " + str(token_lifetime_seconds) ^0
"refresh margin, seconds       : " + str(refresh_margin_seconds) ^0
"skew of an affected client, s : " + str(skew_of_an_affected_client_seconds) ^0
"it refreshes late by, seconds : " + str(seconds_late_when_it_refreshes) ^0
"" ^0
"clients                       : " + str(clients) ^0
"  within the margin           : " + str(clients_unaffected) ^0
"  skewed beyond it            : " + str(clients_skewed_beyond_the_margin) ^0
"rejected refreshes per minute : " + str(rejected_refreshes_per_minute) ^0
"" ^0

# ---- what the refresh logic verified ----

"the refresh implementation" ^0
"  renews on a margin rather than on rejection : yes" ^0
"  margin covers a slow network and a retry    : yes" ^0
"  two renewals in flight are harmless         : yes" ^0
"  defects found in review                     : " + str(refresh_logic_defects) ^0
"  failed calls on a correct clock             : none" ^0
"  verdict           : CORRECT" ^0
"" ^0
"  this is the pattern the documentation recommends and it" ^0
"  is implemented faithfully" ^0
"" ^0

# ---- whose clock decides what ----

"the two clocks" ^0
"  when the token expires   : the server's clock" ^0
"  when the client renews   : the client's clock, minus" ^0
"    the margin" ^0
"  the effective margin     : " + str(refresh_margin_seconds) + " minus the client's error" ^0
"  the client's error is known to it : no" ^0
"" ^0
"  a margin against an unknown offset is a margin only" ^0
"  while the offset is smaller than it" ^0
"" ^0

int(clients_skewed_beyond_the_margin * 10000 / clients) => affected_per_myriad
"share of clients past the margin : " + str(affected_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- the loop ----

# The refresh call is authenticated with the access token it is replacing. Once
# that token has expired the refresh is rejected, and the rejection is what the
# client's error handler responds to by refreshing.
"one affected client, in order" ^0
"  1. believes it has " + str(refresh_margin_seconds) + " seconds left" ^0
"  2. actually expired " + str(seconds_late_when_it_refreshes) + " seconds ago" ^0
"  3. sends a refresh, authenticated with the expired token" ^0
"  4. rejected" ^0
"  5. the error handler responds by refreshing" ^0
"  the loop exits when : the clock is corrected, or a" ^0
"    person restarts it" ^0
"" ^0

# ---- null control ----

# The same margin, with the client renewing against the expiry the server
# stated rather than against its own clock plus a lifetime.
0 => nc_clients_skewed_beyond_the_margin
0 => nc_rejected_refreshes_per_minute

"null control - renew on the server's stated expiry" ^0
"  refresh logic defects : " + str(refresh_logic_defects) + ", unchanged" ^0
"  clients past the margin : " + str(nc_clients_skewed_beyond_the_margin) ^0
"  rejected refreshes per minute : " + str(nc_rejected_refreshes_per_minute) ^0
"  the margin did not grow; the quantity it is subtracted" ^0
"  from stopped being the client's own reading" ^0
"" ^0

# ---- the rule ----

"what refreshing on a margin guarantees" ^0
"  the token is renewed before it expires : exactly, on a" ^0
"    clock that agrees with the server's" ^0
"  the token is renewed before it expires : not addressed" ^0
"    otherwise, and the client cannot tell which case it" ^0
"    is in" ^0
"" ^0
"a safety margin absorbs a delay you can measure; against an" ^0
"unmeasured offset it is a threshold, and the credential that" ^0
"authorises the renewal is the one that has expired" ^0
"" ^0

"The refresh logic is correct and review found " + str(refresh_logic_defects) + " defects: it renews on a" ^0
str(refresh_margin_seconds) + " second margin rather than on rejection, the margin covers a slow network," ^0
"and concurrent renewals are harmless. " + str(clients_skewed_beyond_the_margin) + " of " + str(clients) + " clients - " + str(affected_per_myriad) + " per ten" ^0
"thousand - run more than that fast, so they refresh " + str(seconds_late_when_it_refreshes) + " seconds after expiry using" ^0
"the expired token, and " + str(rejected_refreshes_per_minute) + " rejections a minute feed the handler that retries." ^0
```

## Python (deterministic transpilation)

```python
token_lifetime_seconds = 3600
refresh_margin_seconds = 300
skew_of_an_affected_client_seconds = 340
clients = 18400
clients_skewed_beyond_the_margin = 2140
retry_attempts_per_minute = 60
refresh_logic_defects = 0
seconds_late_when_it_refreshes = skew_of_an_affected_client_seconds - refresh_margin_seconds
clients_unaffected = clients - clients_skewed_beyond_the_margin
rejected_refreshes_per_minute = clients_skewed_beyond_the_margin * retry_attempts_per_minute
print("token lifetime, seconds       : " + str(token_lifetime_seconds))
print("refresh margin, seconds       : " + str(refresh_margin_seconds))
print("skew of an affected client, s : " + str(skew_of_an_affected_client_seconds))
print("it refreshes late by, seconds : " + str(seconds_late_when_it_refreshes))
print("")
print("clients                       : " + str(clients))
print("  within the margin           : " + str(clients_unaffected))
print("  skewed beyond it            : " + str(clients_skewed_beyond_the_margin))
print("rejected refreshes per minute : " + str(rejected_refreshes_per_minute))
print("")
print("the refresh implementation")
print("  renews on a margin rather than on rejection : yes")
print("  margin covers a slow network and a retry    : yes")
print("  two renewals in flight are harmless         : yes")
print("  defects found in review                     : " + str(refresh_logic_defects))
print("  failed calls on a correct clock             : none")
print("  verdict           : CORRECT")
print("")
print("  this is the pattern the documentation recommends and it")
print("  is implemented faithfully")
print("")
print("the two clocks")
print("  when the token expires   : the server's clock")
print("  when the client renews   : the client's clock, minus")
print("    the margin")
print("  the effective margin     : " + str(refresh_margin_seconds) + " minus the client's error")
print("  the client's error is known to it : no")
print("")
print("  a margin against an unknown offset is a margin only")
print("  while the offset is smaller than it")
print("")
affected_per_myriad = int(clients_skewed_beyond_the_margin * 10000 / clients)
print("share of clients past the margin : " + str(affected_per_myriad) + " per ten thousand")
print("")
print("one affected client, in order")
print("  1. believes it has " + str(refresh_margin_seconds) + " seconds left")
print("  2. actually expired " + str(seconds_late_when_it_refreshes) + " seconds ago")
print("  3. sends a refresh, authenticated with the expired token")
print("  4. rejected")
print("  5. the error handler responds by refreshing")
print("  the loop exits when : the clock is corrected, or a")
print("    person restarts it")
print("")
nc_clients_skewed_beyond_the_margin = 0
nc_rejected_refreshes_per_minute = 0
print("null control - renew on the server's stated expiry")
print("  refresh logic defects : " + str(refresh_logic_defects) + ", unchanged")
print("  clients past the margin : " + str(nc_clients_skewed_beyond_the_margin))
print("  rejected refreshes per minute : " + str(nc_rejected_refreshes_per_minute))
print("  the margin did not grow; the quantity it is subtracted")
print("  from stopped being the client's own reading")
print("")
print("what refreshing on a margin guarantees")
print("  the token is renewed before it expires : exactly, on a")
print("    clock that agrees with the server's")
print("  the token is renewed before it expires : not addressed")
print("    otherwise, and the client cannot tell which case it")
print("    is in")
print("")
print("a safety margin absorbs a delay you can measure; against an")
print("unmeasured offset it is a threshold, and the credential that")
print("authorises the renewal is the one that has expired")
print("")
print("The refresh logic is correct and review found " + str(refresh_logic_defects) + " defects: it renews on a")
print(str(refresh_margin_seconds) + " second margin rather than on rejection, the margin covers a slow network,")
print("and concurrent renewals are harmless. " + str(clients_skewed_beyond_the_margin) + " of " + str(clients) + " clients - " + str(affected_per_myriad) + " per ten")
print("thousand - run more than that fast, so they refresh " + str(seconds_late_when_it_refreshes) + " seconds after expiry using")
print("the expired token, and " + str(rejected_refreshes_per_minute) + " rejections a minute feed the handler that retries.")
```

## stdout (executed)

```text
token lifetime, seconds       : 3600
refresh margin, seconds       : 300
skew of an affected client, s : 340
it refreshes late by, seconds : 40

clients                       : 18400
  within the margin           : 16260
  skewed beyond it            : 2140
rejected refreshes per minute : 128400

the refresh implementation
  renews on a margin rather than on rejection : yes
  margin covers a slow network and a retry    : yes
  two renewals in flight are harmless         : yes
  defects found in review                     : 0
  failed calls on a correct clock             : none
  verdict           : CORRECT

  this is the pattern the documentation recommends and it
  is implemented faithfully

the two clocks
  when the token expires   : the server's clock
  when the client renews   : the client's clock, minus
    the margin
  the effective margin     : 300 minus the client's error
  the client's error is known to it : no

  a margin against an unknown offset is a margin only
  while the offset is smaller than it

share of clients past the margin : 1163 per ten thousand

one affected client, in order
  1. believes it has 300 seconds left
  2. actually expired 40 seconds ago
  3. sends a refresh, authenticated with the expired token
  4. rejected
  5. the error handler responds by refreshing
  the loop exits when : the clock is corrected, or a
    person restarts it

null control - renew on the server's stated expiry
  refresh logic defects : 0, unchanged
  clients past the margin : 0
  rejected refreshes per minute : 0
  the margin did not grow; the quantity it is subtracted
  from stopped being the client's own reading

what refreshing on a margin guarantees
  the token is renewed before it expires : exactly, on a
    clock that agrees with the server's
  the token is renewed before it expires : not addressed
    otherwise, and the client cannot tell which case it
    is in

a safety margin absorbs a delay you can measure; against an
unmeasured offset it is a threshold, and the credential that
authorises the renewal is the one that has expired

The refresh logic is correct and review found 0 defects: it renews on a
300 second margin rather than on rejection, the margin covers a slow network,
and concurrent renewals are harmless. 2140 of 18400 clients - 1163 per ten
thousand - run more than that fast, so they refresh 40 seconds after expiry using
the expired token, and 128400 rejections a minute feed the handler that retries.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
