<!-- canonical: efficientnewlanguage.org/ai/examples/668-the-secret-was-in-a-vault-and-the-process-list-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 668 — The secret was in a vault and the process list was not

`the_secret_was_in_a_vault_and_the_process_list_was_not.eml` - No secret is in the source, the scanner proves it over forty-one thousand commits, and every one is fetched from a vault at boot. How many copies exist is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). No secret is in
# the source, the scanner proves it over forty-one thousand commits, and every
# one is fetched from a vault at boot. How many copies exist is computed below.
#
# The vault is used properly. Nothing is committed, nothing is baked into an
# image, access is per-service and audited, rotation is automated and has been
# exercised, and a secret scanner runs on every push and over the whole history.
# Zero findings is a real zero and it took a migration to get there.
#
# A vault controls where a secret is STORED and who may fetch it. After the
# fetch it is a string in a process, and what that process does with it is not
# something the vault can see.
#
# The service starts its worker as a child process and passes twelve of them as
# command-line arguments. Argv is world-readable on this platform.

47 => secrets_in_the_vault
0 => secrets_found_in_the_repository
41000 => commits_scanned
12 => secrets_passed_as_arguments
240 => hosts
400 => log_retention_days

secrets_passed_as_arguments * hosts => argv_copies_on_disk

"secrets in the vault         : " + str(secrets_in_the_vault) ^0
"found in the repository      : " + str(secrets_found_in_the_repository) ^0
"commits scanned              : " + str(commits_scanned) ^0
"" ^0
"passed as command arguments  : " + str(secrets_passed_as_arguments) ^0
"hosts                        : " + str(hosts) ^0
"copies visible in process lists : " + str(argv_copies_on_disk) ^0
"" ^0

# ---- what the vault and the scanner verified ----

"the controls that exist" ^0
"  committed to the repository : " + str(secrets_found_in_the_repository) ^0
"  baked into an image         : none" ^0
"  access                      : per service, audited" ^0
"  rotation                    : automated, exercised" ^0
"  scanner over full history   : " + str(commits_scanned) + " commits, clean" ^0
"  verdict                     : NOT IN THE SOURCE" ^0
"" ^0
"  this is a real posture and reaching it took a migration;" ^0
"  none of it is decorative" ^0
"" ^0

# ---- what happens after the fetch ----

"the life of one secret" ^0
"  fetched from the vault : in memory, correctly" ^0
"  passed to a child      : as argv" ^0
"  readable by            : any local user, via the process" ^0
"    list" ^0
"  captured by            : the monitoring agent, which" ^0
"    ships argv with every process sample" ^0
"  retained for, days     : " + str(log_retention_days) ^0
"" ^0
"  the vault's audit log records one fetch; the aggregator" ^0
"  records the value" ^0
"" ^0

int(secrets_passed_as_arguments * 10000 / secrets_in_the_vault) => exposed_per_myriad
"share of the vault's contents in a process list : " + str(exposed_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what rotation does about it ----

# Rotation is the control that is supposed to bound exposure. It bounds the
# window in which a leaked value is useful, and the aggregator holds every value
# the rotation has ever produced.
int(log_retention_days / 30) => rotations_inside_the_retention_window

"rotation against retention" ^0
"  rotation period, days   : 30" ^0
"  log retention, days     : " + str(log_retention_days) ^0
"  rotations inside the window : " + str(rotations_inside_the_retention_window) ^0
"  values a reader of the logs can see : all of them" ^0
"" ^0
"  rotating faster increases the number of distinct values" ^0
"  in the aggregator and shortens the life of each; it does" ^0
"  not remove the channel" ^0
"" ^0

# ---- null control ----

# The same vault, with the secret handed to the child on a pipe or in its
# environment-less spawn rather than on the command line.
0 => nc_argv_copies
secrets_in_the_vault => nc_secrets_only_in_memory

"null control - handed over a pipe instead of on argv" ^0
"  committed to the repository : " + str(secrets_found_in_the_repository) + ", unchanged" ^0
"  copies in process lists     : " + str(nc_argv_copies) ^0
"  secrets living only in memory : " + str(nc_secrets_only_in_memory) ^0
"  the vault did not become stronger; the value stopped" ^0
"  being written where the operating system publishes it" ^0
"" ^0

# ---- the rule ----

"what a vault guarantees" ^0
"  the secret is not at rest anywhere you did not put it : exactly" ^0
"  the secret is not readable                            : not" ^0
"    addressed; the vault's boundary ends at the fetch, and" ^0
"    every copy after that is the application's decision" ^0
"" ^0
"secret management is about custody and the leak is about" ^0
"handling; a scanner that searches the places you control" ^0
"cannot search the places the operating system creates" ^0
"" ^0

"No secret is in the source and the scanner's zero is real: " + str(commits_scanned) + " commits clean," ^0
"nothing in an image, per-service audited access, automated rotation. " + str(secrets_passed_as_arguments) + " of the" ^0
str(secrets_in_the_vault) + " - " + str(exposed_per_myriad) + " per ten thousand - are passed to a child on the command" ^0
"line, so " + str(argv_copies_on_disk) + " copies sit in process lists across " + str(hosts) + " hosts and every rotation" ^0
"since adds another to " + str(log_retention_days) + " days of monitoring data." ^0
```

## Python (deterministic transpilation)

```python
secrets_in_the_vault = 47
secrets_found_in_the_repository = 0
commits_scanned = 41000
secrets_passed_as_arguments = 12
hosts = 240
log_retention_days = 400
argv_copies_on_disk = secrets_passed_as_arguments * hosts
print("secrets in the vault         : " + str(secrets_in_the_vault))
print("found in the repository      : " + str(secrets_found_in_the_repository))
print("commits scanned              : " + str(commits_scanned))
print("")
print("passed as command arguments  : " + str(secrets_passed_as_arguments))
print("hosts                        : " + str(hosts))
print("copies visible in process lists : " + str(argv_copies_on_disk))
print("")
print("the controls that exist")
print("  committed to the repository : " + str(secrets_found_in_the_repository))
print("  baked into an image         : none")
print("  access                      : per service, audited")
print("  rotation                    : automated, exercised")
print("  scanner over full history   : " + str(commits_scanned) + " commits, clean")
print("  verdict                     : NOT IN THE SOURCE")
print("")
print("  this is a real posture and reaching it took a migration;")
print("  none of it is decorative")
print("")
print("the life of one secret")
print("  fetched from the vault : in memory, correctly")
print("  passed to a child      : as argv")
print("  readable by            : any local user, via the process")
print("    list")
print("  captured by            : the monitoring agent, which")
print("    ships argv with every process sample")
print("  retained for, days     : " + str(log_retention_days))
print("")
print("  the vault's audit log records one fetch; the aggregator")
print("  records the value")
print("")
exposed_per_myriad = int(secrets_passed_as_arguments * 10000 / secrets_in_the_vault)
print("share of the vault's contents in a process list : " + str(exposed_per_myriad) + " per ten thousand")
print("")
rotations_inside_the_retention_window = int(log_retention_days / 30)
print("rotation against retention")
print("  rotation period, days   : 30")
print("  log retention, days     : " + str(log_retention_days))
print("  rotations inside the window : " + str(rotations_inside_the_retention_window))
print("  values a reader of the logs can see : all of them")
print("")
print("  rotating faster increases the number of distinct values")
print("  in the aggregator and shortens the life of each; it does")
print("  not remove the channel")
print("")
nc_argv_copies = 0
nc_secrets_only_in_memory = secrets_in_the_vault
print("null control - handed over a pipe instead of on argv")
print("  committed to the repository : " + str(secrets_found_in_the_repository) + ", unchanged")
print("  copies in process lists     : " + str(nc_argv_copies))
print("  secrets living only in memory : " + str(nc_secrets_only_in_memory))
print("  the vault did not become stronger; the value stopped")
print("  being written where the operating system publishes it")
print("")
print("what a vault guarantees")
print("  the secret is not at rest anywhere you did not put it : exactly")
print("  the secret is not readable                            : not")
print("    addressed; the vault's boundary ends at the fetch, and")
print("    every copy after that is the application's decision")
print("")
print("secret management is about custody and the leak is about")
print("handling; a scanner that searches the places you control")
print("cannot search the places the operating system creates")
print("")
print("No secret is in the source and the scanner's zero is real: " + str(commits_scanned) + " commits clean,")
print("nothing in an image, per-service audited access, automated rotation. " + str(secrets_passed_as_arguments) + " of the")
print(str(secrets_in_the_vault) + " - " + str(exposed_per_myriad) + " per ten thousand - are passed to a child on the command")
print("line, so " + str(argv_copies_on_disk) + " copies sit in process lists across " + str(hosts) + " hosts and every rotation")
print("since adds another to " + str(log_retention_days) + " days of monitoring data.")
```

## stdout (executed)

```text
secrets in the vault         : 47
found in the repository      : 0
commits scanned              : 41000

passed as command arguments  : 12
hosts                        : 240
copies visible in process lists : 2880

the controls that exist
  committed to the repository : 0
  baked into an image         : none
  access                      : per service, audited
  rotation                    : automated, exercised
  scanner over full history   : 41000 commits, clean
  verdict                     : NOT IN THE SOURCE

  this is a real posture and reaching it took a migration;
  none of it is decorative

the life of one secret
  fetched from the vault : in memory, correctly
  passed to a child      : as argv
  readable by            : any local user, via the process
    list
  captured by            : the monitoring agent, which
    ships argv with every process sample
  retained for, days     : 400

  the vault's audit log records one fetch; the aggregator
  records the value

share of the vault's contents in a process list : 2553 per ten thousand

rotation against retention
  rotation period, days   : 30
  log retention, days     : 400
  rotations inside the window : 13
  values a reader of the logs can see : all of them

  rotating faster increases the number of distinct values
  in the aggregator and shortens the life of each; it does
  not remove the channel

null control - handed over a pipe instead of on argv
  committed to the repository : 0, unchanged
  copies in process lists     : 0
  secrets living only in memory : 47
  the vault did not become stronger; the value stopped
  being written where the operating system publishes it

what a vault guarantees
  the secret is not at rest anywhere you did not put it : exactly
  the secret is not readable                            : not
    addressed; the vault's boundary ends at the fetch, and
    every copy after that is the application's decision

secret management is about custody and the leak is about
handling; a scanner that searches the places you control
cannot search the places the operating system creates

No secret is in the source and the scanner's zero is real: 41000 commits clean,
nothing in an image, per-service audited access, automated rotation. 12 of the
47 - 2553 per ten thousand - are passed to a child on the command
line, so 2880 copies sit in process lists across 240 hosts and every rotation
since adds another to 400 days of monitoring data.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
