<!-- canonical: efficientnewlanguage.org/ai/examples/657-the-backup-was-encrypted-and-the-key-was-in-the-backup | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 657 — The backup was encrypted and the key was in the backup

`the_backup_was_encrypted_and_the_key_was_in_the_backup.eml` - Every backup is encrypted at rest and the restore drill passes quarterly. What an archive contains is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every backup is
# encrypted at rest and the restore drill passes quarterly. What an archive
# contains is computed below.
#
# The encryption is correct. A modern authenticated cipher, keys in a managed
# service with per-role access, no key ever written to the repository, and a
# restore drill four times a year that has never needed a manual step. Ninety
# archives, all encrypted, none with a weak or reused key.
#
# The archive is a full filesystem snapshot of the application host. That host
# must start unattended after a reboot, so the key material it needs is on its
# own disk — which is inside the thing being snapshotted.
#
# The backup is encrypted with a key the backup contains.

90 => backups_retained
90 => backups_encrypted
4 => restore_drills_per_year
0 => drills_needing_a_manual_step
3 => offsite_copies
1 => key_material_files_per_backup

backups_retained * key_material_files_per_backup => key_copies_in_the_archives
backups_retained * offsite_copies => archive_copies_offsite

"backups retained            : " + str(backups_retained) ^0
"encrypted                   : " + str(backups_encrypted) ^0
"offsite copies of each      : " + str(offsite_copies) ^0
"archive copies offsite      : " + str(archive_copies_offsite) ^0
"key material files per backup : " + str(key_material_files_per_backup) ^0
"copies of the key in the archives : " + str(key_copies_in_the_archives) ^0
"" ^0

# ---- what the encryption verified ----

"the encryption posture" ^0
"  cipher              : authenticated, modern" ^0
"  key storage         : managed service, per-role access" ^0
"  keys in the repository : none" ^0
"  weak or reused keys : none" ^0
"  archives encrypted  : " + str(backups_encrypted) + " of " + str(backups_retained) ^0
"  verdict             : ENCRYPTED AT REST" ^0
"" ^0
"  none of that is nominal; the key service is real and the" ^0
"  access controls on it are enforced" ^0
"" ^0

# ---- what the restore drill verified ----

"the quarterly restore drill" ^0
"  drills per year       : " + str(restore_drills_per_year) ^0
"  needing a manual step : " + str(drills_needing_a_manual_step) ^0
"  what it proves        : the archive is complete and the" ^0
"    restore procedure works unattended" ^0
"" ^0
"  the second half of that is the finding: unattended means" ^0
"  the key was available without a person, and the drill" ^0
"  runs on a host restored from the archive" ^0
"" ^0

# ---- what an archive is sufficient for ----

"an attacker holding one archive" ^0
"  ciphertext           : present" ^0
"  key material         : present, on the same disk image" ^0
"  additional access needed : none" ^0
"  the key service is consulted : not during a restore from" ^0
"    this image, which is why the drill needs no operator" ^0
"" ^0

int(key_copies_in_the_archives * 10000 / backups_retained) => key_per_backup_myriad
"key copies per archive : " + str(key_per_backup_myriad) + " per ten thousand, which is one each" ^0
"" ^0

# ---- why the audit passed ----

# The audit asks two questions and both have correct answers. It does not ask
# whether the two artifacts travel together, because they are managed by
# different teams and appear in different inventories.
"the audit's questions" ^0
"  are backups encrypted        : yes, " + str(backups_encrypted) + " of " + str(backups_retained) ^0
"  are keys held outside the data : yes, in the key service" ^0
"  do the archives contain a copy of the key : not asked" ^0
"  who would ask it : nobody owns both inventories" ^0
"" ^0

# ---- null control ----

# The same archives, excluding the key material path from the snapshot and
# supplying the key at restore time from the key service.
0 => nc_key_copies_in_the_archives
1 => nc_drills_needing_a_key_fetch

"null control - the key path excluded from the snapshot" ^0
"  archives encrypted      : " + str(backups_encrypted) + ", unchanged" ^0
"  copies of the key in the archives : " + str(nc_key_copies_in_the_archives) ^0
"  drills needing a key fetch : " + str(nc_drills_needing_a_key_fetch) ^0
"  the cipher did not change; the restore stopped being" ^0
"  able to proceed from the archive alone" ^0
"" ^0

# ---- the rule ----

"what encryption at rest guarantees" ^0
"  the data is unreadable without the key : exactly" ^0
"  the data is unreadable to whoever holds it : not" ^0
"    addressed; that depends on where the key is, and a" ^0
"    full-host snapshot is a question about scope rather" ^0
"    than about cryptography" ^0
"" ^0
"encryption separates the data from the key; a backup that" ^0
"restores unattended has un-separated them, and the property" ^0
"that proves it is the one the drill is designed to show" ^0
"" ^0

"All " + str(backups_retained) + " archives are encrypted with a modern authenticated cipher, keys in a" ^0
"managed service, none in the repository, and " + str(restore_drills_per_year) + " drills a year pass with" ^0
str(drills_needing_a_manual_step) + " manual steps. Each archive is a full host snapshot, so each contains the" ^0
"key material that decrypts it - " + str(key_copies_in_the_archives) + " copies across the retained set and" ^0
str(archive_copies_offsite) + " offsite - and the unattended restore is the demonstration." ^0
```

## Python (deterministic transpilation)

```python
backups_retained = 90
backups_encrypted = 90
restore_drills_per_year = 4
drills_needing_a_manual_step = 0
offsite_copies = 3
key_material_files_per_backup = 1
key_copies_in_the_archives = backups_retained * key_material_files_per_backup
archive_copies_offsite = backups_retained * offsite_copies
print("backups retained            : " + str(backups_retained))
print("encrypted                   : " + str(backups_encrypted))
print("offsite copies of each      : " + str(offsite_copies))
print("archive copies offsite      : " + str(archive_copies_offsite))
print("key material files per backup : " + str(key_material_files_per_backup))
print("copies of the key in the archives : " + str(key_copies_in_the_archives))
print("")
print("the encryption posture")
print("  cipher              : authenticated, modern")
print("  key storage         : managed service, per-role access")
print("  keys in the repository : none")
print("  weak or reused keys : none")
print("  archives encrypted  : " + str(backups_encrypted) + " of " + str(backups_retained))
print("  verdict             : ENCRYPTED AT REST")
print("")
print("  none of that is nominal; the key service is real and the")
print("  access controls on it are enforced")
print("")
print("the quarterly restore drill")
print("  drills per year       : " + str(restore_drills_per_year))
print("  needing a manual step : " + str(drills_needing_a_manual_step))
print("  what it proves        : the archive is complete and the")
print("    restore procedure works unattended")
print("")
print("  the second half of that is the finding: unattended means")
print("  the key was available without a person, and the drill")
print("  runs on a host restored from the archive")
print("")
print("an attacker holding one archive")
print("  ciphertext           : present")
print("  key material         : present, on the same disk image")
print("  additional access needed : none")
print("  the key service is consulted : not during a restore from")
print("    this image, which is why the drill needs no operator")
print("")
key_per_backup_myriad = int(key_copies_in_the_archives * 10000 / backups_retained)
print("key copies per archive : " + str(key_per_backup_myriad) + " per ten thousand, which is one each")
print("")
print("the audit's questions")
print("  are backups encrypted        : yes, " + str(backups_encrypted) + " of " + str(backups_retained))
print("  are keys held outside the data : yes, in the key service")
print("  do the archives contain a copy of the key : not asked")
print("  who would ask it : nobody owns both inventories")
print("")
nc_key_copies_in_the_archives = 0
nc_drills_needing_a_key_fetch = 1
print("null control - the key path excluded from the snapshot")
print("  archives encrypted      : " + str(backups_encrypted) + ", unchanged")
print("  copies of the key in the archives : " + str(nc_key_copies_in_the_archives))
print("  drills needing a key fetch : " + str(nc_drills_needing_a_key_fetch))
print("  the cipher did not change; the restore stopped being")
print("  able to proceed from the archive alone")
print("")
print("what encryption at rest guarantees")
print("  the data is unreadable without the key : exactly")
print("  the data is unreadable to whoever holds it : not")
print("    addressed; that depends on where the key is, and a")
print("    full-host snapshot is a question about scope rather")
print("    than about cryptography")
print("")
print("encryption separates the data from the key; a backup that")
print("restores unattended has un-separated them, and the property")
print("that proves it is the one the drill is designed to show")
print("")
print("All " + str(backups_retained) + " archives are encrypted with a modern authenticated cipher, keys in a")
print("managed service, none in the repository, and " + str(restore_drills_per_year) + " drills a year pass with")
print(str(drills_needing_a_manual_step) + " manual steps. Each archive is a full host snapshot, so each contains the")
print("key material that decrypts it - " + str(key_copies_in_the_archives) + " copies across the retained set and")
print(str(archive_copies_offsite) + " offsite - and the unattended restore is the demonstration.")
```

## stdout (executed)

```text
backups retained            : 90
encrypted                   : 90
offsite copies of each      : 3
archive copies offsite      : 270
key material files per backup : 1
copies of the key in the archives : 90

the encryption posture
  cipher              : authenticated, modern
  key storage         : managed service, per-role access
  keys in the repository : none
  weak or reused keys : none
  archives encrypted  : 90 of 90
  verdict             : ENCRYPTED AT REST

  none of that is nominal; the key service is real and the
  access controls on it are enforced

the quarterly restore drill
  drills per year       : 4
  needing a manual step : 0
  what it proves        : the archive is complete and the
    restore procedure works unattended

  the second half of that is the finding: unattended means
  the key was available without a person, and the drill
  runs on a host restored from the archive

an attacker holding one archive
  ciphertext           : present
  key material         : present, on the same disk image
  additional access needed : none
  the key service is consulted : not during a restore from
    this image, which is why the drill needs no operator

key copies per archive : 10000 per ten thousand, which is one each

the audit's questions
  are backups encrypted        : yes, 90 of 90
  are keys held outside the data : yes, in the key service
  do the archives contain a copy of the key : not asked
  who would ask it : nobody owns both inventories

null control - the key path excluded from the snapshot
  archives encrypted      : 90, unchanged
  copies of the key in the archives : 0
  drills needing a key fetch : 1
  the cipher did not change; the restore stopped being
  able to proceed from the archive alone

what encryption at rest guarantees
  the data is unreadable without the key : exactly
  the data is unreadable to whoever holds it : not
    addressed; that depends on where the key is, and a
    full-host snapshot is a question about scope rather
    than about cryptography

encryption separates the data from the key; a backup that
restores unattended has un-separated them, and the property
that proves it is the one the drill is designed to show

All 90 archives are encrypted with a modern authenticated cipher, keys in a
managed service, none in the repository, and 4 drills a year pass with
0 manual steps. Each archive is a full host snapshot, so each contains the
key material that decrypts it - 90 copies across the retained set and
270 offsite - and the unattended restore is the demonstration.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
