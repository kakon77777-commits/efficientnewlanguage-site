<!-- canonical: efficientnewlanguage.org/ai/examples/721-the-licence-was-checked-at-install-and-the-machine-was-cloned | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 721 — The licence was checked at install and the machine was cloned

`the_licence_was_checked_at_install_and_the_machine_was_cloned.eml` - The licence file is signed, verified against a public key at install, bound to a hardware fingerprint, and the installer refuses without a valid one. How many running machines verified it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The licence file
# is signed, verified against a public key at install, bound to a hardware
# fingerprint, and the installer refuses without a valid one. How many running
# machines verified it is computed below.
#
# The check is properly built. The licence is a signed document rather than a
# key that can be typed from a forum post; the signature is verified against a
# public key compiled into the installer rather than one fetched at runtime;
# expiry is enforced rather than warned about; and the installer exits without
# installing when verification fails. Forty licences, forty installs, forty
# signature verifications, none skipped.
#
# The check runs at INSTALL and records that it passed. The customer builds one
# machine image by running the installer once and the autoscaling group clones
# it, so the recorded result is copied along with everything else.
#
# Two thousand one hundred forty machines are running the software.

40 => licences_purchased
40 => installs_performed
0 => running_machines_that_verified
0 => installs_without_a_valid_licence
40 => signature_verifications_that_ran
2140 => machines_running_the_software
0 => fingerprint_checks_after_install
0 => runtime_verifications_of_the_signature
1 => times_the_installer_runs_per_machine_image

machines_running_the_software - running_machines_that_verified => machines_that_never_verified_anything
int(running_machines_that_verified * 10000 / machines_running_the_software) => verified_per_myriad

"licences purchased              : " + str(licences_purchased) ^0
"installs performed              : " + str(installs_performed) ^0
"  without a valid licence       : " + str(installs_without_a_valid_licence) ^0
"signature verifications that ran: " + str(signature_verifications_that_ran) ^0
"" ^0
"machines running the software   : " + str(machines_running_the_software) ^0
"  that verified                 : " + str(running_machines_that_verified) ^0
"  build machines that installed : " + str(installs_performed) + ", none of them in this fleet" ^0
"  that never verified anything  : " + str(machines_that_never_verified_anything) ^0
"  share verified                : " + str(verified_per_myriad) + " per ten thousand" ^0
"" ^0
"installer runs per machine image: " + str(times_the_installer_runs_per_machine_image) ^0
"fingerprint checks after install: " + str(fingerprint_checks_after_install) ^0
"runtime verifications           : " + str(runtime_verifications_of_the_signature) ^0
"" ^0

# ---- what the check verified ----

"the licence check" ^0
"  the licence is : a signed document, not a typed key" ^0
"  the public key comes from : the installer binary, not" ^0
"    a runtime fetch" ^0
"  expiry : enforced, not warned about" ^0
"  on failure : the installer exits without installing" ^0
"  verifications that ran : " + str(signature_verifications_that_ran) ^0
"  installs without a valid licence : " + str(installs_without_a_valid_licence) ^0
"  verdict : VERIFIED" ^0
"" ^0
"  a compiled-in public key and a hard refusal are the two" ^0
"  choices that make this hard to defeat, and both are made" ^0
"" ^0

# ---- what install time is ----

"the moment of the check" ^0
"  when it runs : once, while installing" ^0
"  what it writes : a record that it passed" ^0
"  where that record lives : the filesystem" ^0
"  what the customer does with that filesystem : bakes it" ^0
"    into a machine image" ^0
"  what the autoscaling group does with the image : clones" ^0
"    it, " + str(machines_running_the_software) + " times" ^0
"  what a clone re-checks : " + str(runtime_verifications_of_the_signature) ^0
"" ^0
"  the check is unforgeable and it is a statement about an" ^0
"  event, and the event happened once" ^0
"" ^0
# ---- nobody is cheating ----

# The customer is not evading anything. Baking an image and scaling it is the
# recommended way to run this software, it is in the vendor's own deployment
# guide, and the customer's platform team has never touched the licence file.
"the customer" ^0
"  bakes an image and scales it : yes" ^0
"  is that documented by the vendor : yes, as the" ^0
"    recommended deployment" ^0
"  has anyone modified the licence file : no" ^0
"  has anyone bypassed the installer : no" ^0
"  is the deployment within the agreement : that is a" ^0
"    question about the agreement, and the check does not" ^0
"    answer it either way" ^0
"" ^0

# ---- what the hardware fingerprint bound ----

# The fingerprint is read during install and compared to the licence. In an
# image build it is the fingerprint of the build machine, which is not any of
# the machines that later run the software.
"the fingerprint" ^0
"  read when : during install" ^0
"  read on which machine : the one building the image" ^0
"  compared to the licence : yes, and it matched" ^0
"  machines later running the software : " + str(machines_running_the_software) ^0
"  of those, machines whose fingerprint was ever read :" ^0
"    " + str(running_machines_that_verified) ^0
"  re-reads after install : " + str(fingerprint_checks_after_install) ^0
"" ^0

# ---- what the compliance report says ----

"the vendor's report" ^0
"  licences sold        : " + str(licences_purchased) ^0
"  installs recorded    : " + str(installs_performed) ^0
"  failed verifications : " + str(installs_without_a_valid_licence) ^0
"  what the report concludes : full compliance" ^0
"  what it counts        : installs" ^0
"  what the agreement is priced on : running instances" ^0
"  instances the report can see : " + str(running_machines_that_verified) + " of " + str(machines_running_the_software) ^0
"" ^0

# ---- null control ----

# The same signed licence, verified at process start against a fingerprint read
# at that moment, rather than a marker read from disk.
machines_running_the_software => nc_machines_that_verify
0 => nc_machines_that_never_verified

"null control - the check runs when the process starts" ^0
"  installs without a valid licence : " + str(installs_without_a_valid_licence) + ", unchanged" ^0
"  machines that verify : " + str(nc_machines_that_verify) ^0
"  machines that never verified : " + str(nc_machines_that_never_verified) ^0
"  the cryptography did not get stronger; the check moved" ^0
"  from an event that happens once to a state that" ^0
"  persists" ^0
"" ^0

# ---- the rule ----

"what an install-time licence check guarantees" ^0
"  this installation was authorised : exactly, with a" ^0
"    signature that cannot be forged and a refusal that" ^0
"    cannot be skipped" ^0
"  this software is running under a licence : not" ^0
"    addressed; the check is an event and running is a" ^0
"    state, and the filesystem carrying the result is" ^0
"    copyable" ^0
"" ^0
"a check performed once produces a fact about that moment," ^0
"which is then stored; storing it makes it duplicable, so the" ^0
"strength of the verification bounds forgery and says nothing" ^0
"about multiplicity" ^0
"" ^0

"The check is properly built: a signed licence, a public key compiled into the" ^0
"installer, expiry enforced, and a refusal to install on failure - " + str(signature_verifications_that_ran) ^0
"verifications, " + str(installs_without_a_valid_licence) + " installs without a valid licence. It runs once per image and" ^0
"the result is baked into the filesystem, so of " + str(machines_running_the_software) + " machines running the" ^0
"software " + str(machines_that_never_verified_anything) + " never verified anything - " + str(verified_per_myriad) + " per ten thousand did - with" ^0
str(fingerprint_checks_after_install) + " fingerprint re-reads and a compliance report that counts installs." ^0
```

## Python (deterministic transpilation)

```python
licences_purchased = 40
installs_performed = 40
running_machines_that_verified = 0
installs_without_a_valid_licence = 0
signature_verifications_that_ran = 40
machines_running_the_software = 2140
fingerprint_checks_after_install = 0
runtime_verifications_of_the_signature = 0
times_the_installer_runs_per_machine_image = 1
machines_that_never_verified_anything = machines_running_the_software - running_machines_that_verified
verified_per_myriad = int(running_machines_that_verified * 10000 / machines_running_the_software)
print("licences purchased              : " + str(licences_purchased))
print("installs performed              : " + str(installs_performed))
print("  without a valid licence       : " + str(installs_without_a_valid_licence))
print("signature verifications that ran: " + str(signature_verifications_that_ran))
print("")
print("machines running the software   : " + str(machines_running_the_software))
print("  that verified                 : " + str(running_machines_that_verified))
print("  build machines that installed : " + str(installs_performed) + ", none of them in this fleet")
print("  that never verified anything  : " + str(machines_that_never_verified_anything))
print("  share verified                : " + str(verified_per_myriad) + " per ten thousand")
print("")
print("installer runs per machine image: " + str(times_the_installer_runs_per_machine_image))
print("fingerprint checks after install: " + str(fingerprint_checks_after_install))
print("runtime verifications           : " + str(runtime_verifications_of_the_signature))
print("")
print("the licence check")
print("  the licence is : a signed document, not a typed key")
print("  the public key comes from : the installer binary, not")
print("    a runtime fetch")
print("  expiry : enforced, not warned about")
print("  on failure : the installer exits without installing")
print("  verifications that ran : " + str(signature_verifications_that_ran))
print("  installs without a valid licence : " + str(installs_without_a_valid_licence))
print("  verdict : VERIFIED")
print("")
print("  a compiled-in public key and a hard refusal are the two")
print("  choices that make this hard to defeat, and both are made")
print("")
print("the moment of the check")
print("  when it runs : once, while installing")
print("  what it writes : a record that it passed")
print("  where that record lives : the filesystem")
print("  what the customer does with that filesystem : bakes it")
print("    into a machine image")
print("  what the autoscaling group does with the image : clones")
print("    it, " + str(machines_running_the_software) + " times")
print("  what a clone re-checks : " + str(runtime_verifications_of_the_signature))
print("")
print("  the check is unforgeable and it is a statement about an")
print("  event, and the event happened once")
print("")
print("the customer")
print("  bakes an image and scales it : yes")
print("  is that documented by the vendor : yes, as the")
print("    recommended deployment")
print("  has anyone modified the licence file : no")
print("  has anyone bypassed the installer : no")
print("  is the deployment within the agreement : that is a")
print("    question about the agreement, and the check does not")
print("    answer it either way")
print("")
print("the fingerprint")
print("  read when : during install")
print("  read on which machine : the one building the image")
print("  compared to the licence : yes, and it matched")
print("  machines later running the software : " + str(machines_running_the_software))
print("  of those, machines whose fingerprint was ever read :")
print("    " + str(running_machines_that_verified))
print("  re-reads after install : " + str(fingerprint_checks_after_install))
print("")
print("the vendor's report")
print("  licences sold        : " + str(licences_purchased))
print("  installs recorded    : " + str(installs_performed))
print("  failed verifications : " + str(installs_without_a_valid_licence))
print("  what the report concludes : full compliance")
print("  what it counts        : installs")
print("  what the agreement is priced on : running instances")
print("  instances the report can see : " + str(running_machines_that_verified) + " of " + str(machines_running_the_software))
print("")
nc_machines_that_verify = machines_running_the_software
nc_machines_that_never_verified = 0
print("null control - the check runs when the process starts")
print("  installs without a valid licence : " + str(installs_without_a_valid_licence) + ", unchanged")
print("  machines that verify : " + str(nc_machines_that_verify))
print("  machines that never verified : " + str(nc_machines_that_never_verified))
print("  the cryptography did not get stronger; the check moved")
print("  from an event that happens once to a state that")
print("  persists")
print("")
print("what an install-time licence check guarantees")
print("  this installation was authorised : exactly, with a")
print("    signature that cannot be forged and a refusal that")
print("    cannot be skipped")
print("  this software is running under a licence : not")
print("    addressed; the check is an event and running is a")
print("    state, and the filesystem carrying the result is")
print("    copyable")
print("")
print("a check performed once produces a fact about that moment,")
print("which is then stored; storing it makes it duplicable, so the")
print("strength of the verification bounds forgery and says nothing")
print("about multiplicity")
print("")
print("The check is properly built: a signed licence, a public key compiled into the")
print("installer, expiry enforced, and a refusal to install on failure - " + str(signature_verifications_that_ran))
print("verifications, " + str(installs_without_a_valid_licence) + " installs without a valid licence. It runs once per image and")
print("the result is baked into the filesystem, so of " + str(machines_running_the_software) + " machines running the")
print("software " + str(machines_that_never_verified_anything) + " never verified anything - " + str(verified_per_myriad) + " per ten thousand did - with")
print(str(fingerprint_checks_after_install) + " fingerprint re-reads and a compliance report that counts installs.")
```

## stdout (executed)

```text
licences purchased              : 40
installs performed              : 40
  without a valid licence       : 0
signature verifications that ran: 40

machines running the software   : 2140
  that verified                 : 0
  build machines that installed : 40, none of them in this fleet
  that never verified anything  : 2140
  share verified                : 0 per ten thousand

installer runs per machine image: 1
fingerprint checks after install: 0
runtime verifications           : 0

the licence check
  the licence is : a signed document, not a typed key
  the public key comes from : the installer binary, not
    a runtime fetch
  expiry : enforced, not warned about
  on failure : the installer exits without installing
  verifications that ran : 40
  installs without a valid licence : 0
  verdict : VERIFIED

  a compiled-in public key and a hard refusal are the two
  choices that make this hard to defeat, and both are made

the moment of the check
  when it runs : once, while installing
  what it writes : a record that it passed
  where that record lives : the filesystem
  what the customer does with that filesystem : bakes it
    into a machine image
  what the autoscaling group does with the image : clones
    it, 2140 times
  what a clone re-checks : 0

  the check is unforgeable and it is a statement about an
  event, and the event happened once

the customer
  bakes an image and scales it : yes
  is that documented by the vendor : yes, as the
    recommended deployment
  has anyone modified the licence file : no
  has anyone bypassed the installer : no
  is the deployment within the agreement : that is a
    question about the agreement, and the check does not
    answer it either way

the fingerprint
  read when : during install
  read on which machine : the one building the image
  compared to the licence : yes, and it matched
  machines later running the software : 2140
  of those, machines whose fingerprint was ever read :
    0
  re-reads after install : 0

the vendor's report
  licences sold        : 40
  installs recorded    : 40
  failed verifications : 0
  what the report concludes : full compliance
  what it counts        : installs
  what the agreement is priced on : running instances
  instances the report can see : 0 of 2140

null control - the check runs when the process starts
  installs without a valid licence : 0, unchanged
  machines that verify : 2140
  machines that never verified : 0
  the cryptography did not get stronger; the check moved
  from an event that happens once to a state that
  persists

what an install-time licence check guarantees
  this installation was authorised : exactly, with a
    signature that cannot be forged and a refusal that
    cannot be skipped
  this software is running under a licence : not
    addressed; the check is an event and running is a
    state, and the filesystem carrying the result is
    copyable

a check performed once produces a fact about that moment,
which is then stored; storing it makes it duplicable, so the
strength of the verification bounds forgery and says nothing
about multiplicity

The check is properly built: a signed licence, a public key compiled into the
installer, expiry enforced, and a refusal to install on failure - 40
verifications, 0 installs without a valid licence. It runs once per image and
the result is baked into the filesystem, so of 2140 machines running the
software 2140 never verified anything - 0 per ten thousand did - with
0 fingerprint re-reads and a compliance report that counts installs.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
