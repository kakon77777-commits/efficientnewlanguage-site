<!-- canonical: efficientnewlanguage.org/ai/examples/756-the-key-was-rotated-and-the-old-key-was-still-required | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 756 — The key was rotated and the old key was still required

`the_key_was_rotated_and_the_old_key_was_still_required.eml` - Encryption keys rotate every ninety days, automatically, verified by a canary decrypt after each rotation, with no failed decrypts in eight rotations. What rotation changes is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Encryption keys
# rotate every ninety days, automatically, verified by a canary decrypt after
# each rotation, with no failed decrypts in eight rotations. What rotation
# changes is computed below.
#
# The rotation is properly automated. It is not a runbook someone runs when
# they remember; it is scheduled, it re-wraps every data key under the new key
# encryption key, a canary object is decrypted after each rotation before the
# rotation is declared done, the old key encryption key is retired only after
# that canary passes, and eight rotations have completed with no failed
# decrypts and no application involvement.
#
# Rotation changes the key that WRAPS the data keys. The ciphertext itself is
# not rewritten, so every object is still encrypted under the data key it was
# written with, and a data key that leaked before a rotation still opens them.
#
# Forty-one million objects have never been re-encrypted.

90 => rotation_period_days
8 => rotations_completed
0 => failed_decrypts
1 => canary_decrypts_per_rotation
41000000 => encrypted_objects
0 => objects_re_encrypted_under_a_new_data_key
0 => re_encryption_jobs_run
14 => estimated_days_to_re_encrypt_everything

rotations_completed * rotation_period_days => days_of_rotation_history
encrypted_objects - objects_re_encrypted_under_a_new_data_key => objects_a_pre_rotation_data_key_still_opens
int(objects_re_encrypted_under_a_new_data_key * 10000 / encrypted_objects) => re_encrypted_per_myriad

"rotation period, days           : " + str(rotation_period_days) ^0
"rotations completed             : " + str(rotations_completed) ^0
"  days of history               : " + str(days_of_rotation_history) ^0
"  canary decrypts per rotation  : " + str(canary_decrypts_per_rotation) ^0
"  failed decrypts               : " + str(failed_decrypts) ^0
"" ^0
"encrypted objects               : " + str(encrypted_objects) ^0
"  re-encrypted under a new data key : " + str(objects_re_encrypted_under_a_new_data_key) ^0
"  share                         : " + str(re_encrypted_per_myriad) + " per ten thousand" ^0
"  a pre-rotation data key still opens : " ^0
"    " + str(objects_a_pre_rotation_data_key_still_opens) ^0
"" ^0
"re-encryption jobs run          : " + str(re_encryption_jobs_run) ^0
"estimated days to re-encrypt everything : " + str(estimated_days_to_re_encrypt_everything) ^0
"" ^0

# ---- what rotation verified ----

"the rotation" ^0
"  scheduled or remembered : scheduled, every " + str(rotation_period_days) + " days" ^0
"  what it re-wraps : every data key, under the new key" ^0
"    encryption key" ^0
"  proof before it is declared done : a canary object is" ^0
"    decrypted, " + str(canary_decrypts_per_rotation) + " per rotation" ^0
"  when the old wrapping key is retired : only after that" ^0
"    canary passes" ^0
"  rotations completed : " + str(rotations_completed) + ", failed decrypts " + str(failed_decrypts) ^0
"  verdict : ROTATED" ^0
"" ^0
"  retiring the old key only after a real decrypt is the" ^0
"  step that turns this from a calendar entry into a" ^0
"  guarantee, and it is done every time" ^0
"" ^0

# ---- which key moved ----

"the two keys" ^0
"  the key encryption key : rotated, " + str(rotations_completed) + " times" ^0
"  the data key on each object : unchanged since the write" ^0
"  what the ciphertext is encrypted under : the data key" ^0
"  what rotation rewrites : the wrapping, not the object" ^0
"  objects rewritten : " + str(objects_re_encrypted_under_a_new_data_key) ^0
"  what a leaked data key from before a rotation opens : " ^0
"    " + str(objects_a_pre_rotation_data_key_still_opens) + " objects, still" ^0
"" ^0
"  the rotation is complete over the layer it names, and" ^0
"  the layer below it has not moved in " + str(days_of_rotation_history) + " days" ^0
"" ^0

# ---- what rotation is for ----

# Rotation bounds the window in which a compromised KEY ENCRYPTION KEY is
# useful, and it does that exactly. The thing people usually believe it bounds
# is the window in which a compromised object is readable, and no wrapping
# operation can affect that.
"the two windows" ^0
"  a compromised key encryption key is useful for : at" ^0
"    most " + str(rotation_period_days) + " days, which is what rotation buys" ^0
"  a compromised data key is useful for : the lifetime of" ^0
"    the objects it wrote" ^0
"  what shortens the second : re-encrypting the objects" ^0
"  re-encryption jobs run : " + str(re_encryption_jobs_run) ^0
"  estimated cost if run : " + str(estimated_days_to_re_encrypt_everything) + " days" ^0
"" ^0

# ---- what the canary proves ----

"the canary decrypt" ^0
"  what it reads : one object" ^0
"  what it proves : the new wrapping key can unwrap a data" ^0
"    key, and that data key still opens its object" ^0
"  is that the right check for the rotation : yes, exactly" ^0
"  does it say anything about the data key's age : no" ^0
"  the data key it exercised : the same one as last time" ^0
"" ^0

# ---- null control ----

# The same rotation, with a re-encryption pass that rewrites objects under a
# fresh data key on a schedule of its own.
1 => nc_re_encryption_jobs_run
encrypted_objects => nc_objects_re_encrypted
0 => nc_objects_a_pre_rotation_data_key_still_opens

"null control - the objects are rewritten too" ^0
"  rotation period : " + str(rotation_period_days) + " days, unchanged" ^0
"  re-encryption jobs : " + str(nc_re_encryption_jobs_run) ^0
"  objects re-encrypted : " + str(nc_objects_re_encrypted) ^0
"  objects a pre-rotation data key still opens : " ^0
"    " + str(nc_objects_a_pre_rotation_data_key_still_opens) ^0
"  the rotation did not become more frequent; the layer it" ^0
"  never touched acquired a rotation of its own" ^0
"" ^0

# ---- the rule ----

"what key rotation guarantees" ^0
"  a compromised wrapping key stops being useful within a" ^0
"    period : exactly, " + str(rotations_completed) + " times, proved by a real decrypt" ^0
"  old data stops being readable with old material : not" ^0
"    addressed; rotation rewrites the wrapping and the" ^0
"    ciphertext is not the wrapping" ^0
"" ^0
"a rotation bounds the exposure of the thing it rotates;" ^0
"where a key hierarchy has two layers and only the upper one" ^0
"turns, the guarantee is exact and the quantity people say it" ^0
"out loud about belongs to the layer that did not move" ^0
"" ^0

"Rotation is scheduled rather than remembered, re-wraps every data key, proves" ^0
"itself with a real decrypt before retiring the old key, and has completed " ^0
str(rotations_completed) + " times with " + str(failed_decrypts) + " failed decrypts. It rewrites the wrapping and not the" ^0
"ciphertext, so " + str(objects_re_encrypted_under_a_new_data_key) + " of " + str(encrypted_objects) + " objects have been re-encrypted - " ^0
str(re_encrypted_per_myriad) + " per ten thousand - across " + str(days_of_rotation_history) + " days and " + str(re_encryption_jobs_run) + " re-encryption jobs." ^0
```

## Python (deterministic transpilation)

```python
rotation_period_days = 90
rotations_completed = 8
failed_decrypts = 0
canary_decrypts_per_rotation = 1
encrypted_objects = 41000000
objects_re_encrypted_under_a_new_data_key = 0
re_encryption_jobs_run = 0
estimated_days_to_re_encrypt_everything = 14
days_of_rotation_history = rotations_completed * rotation_period_days
objects_a_pre_rotation_data_key_still_opens = encrypted_objects - objects_re_encrypted_under_a_new_data_key
re_encrypted_per_myriad = int(objects_re_encrypted_under_a_new_data_key * 10000 / encrypted_objects)
print("rotation period, days           : " + str(rotation_period_days))
print("rotations completed             : " + str(rotations_completed))
print("  days of history               : " + str(days_of_rotation_history))
print("  canary decrypts per rotation  : " + str(canary_decrypts_per_rotation))
print("  failed decrypts               : " + str(failed_decrypts))
print("")
print("encrypted objects               : " + str(encrypted_objects))
print("  re-encrypted under a new data key : " + str(objects_re_encrypted_under_a_new_data_key))
print("  share                         : " + str(re_encrypted_per_myriad) + " per ten thousand")
print("  a pre-rotation data key still opens : ")
print("    " + str(objects_a_pre_rotation_data_key_still_opens))
print("")
print("re-encryption jobs run          : " + str(re_encryption_jobs_run))
print("estimated days to re-encrypt everything : " + str(estimated_days_to_re_encrypt_everything))
print("")
print("the rotation")
print("  scheduled or remembered : scheduled, every " + str(rotation_period_days) + " days")
print("  what it re-wraps : every data key, under the new key")
print("    encryption key")
print("  proof before it is declared done : a canary object is")
print("    decrypted, " + str(canary_decrypts_per_rotation) + " per rotation")
print("  when the old wrapping key is retired : only after that")
print("    canary passes")
print("  rotations completed : " + str(rotations_completed) + ", failed decrypts " + str(failed_decrypts))
print("  verdict : ROTATED")
print("")
print("  retiring the old key only after a real decrypt is the")
print("  step that turns this from a calendar entry into a")
print("  guarantee, and it is done every time")
print("")
print("the two keys")
print("  the key encryption key : rotated, " + str(rotations_completed) + " times")
print("  the data key on each object : unchanged since the write")
print("  what the ciphertext is encrypted under : the data key")
print("  what rotation rewrites : the wrapping, not the object")
print("  objects rewritten : " + str(objects_re_encrypted_under_a_new_data_key))
print("  what a leaked data key from before a rotation opens : ")
print("    " + str(objects_a_pre_rotation_data_key_still_opens) + " objects, still")
print("")
print("  the rotation is complete over the layer it names, and")
print("  the layer below it has not moved in " + str(days_of_rotation_history) + " days")
print("")
print("the two windows")
print("  a compromised key encryption key is useful for : at")
print("    most " + str(rotation_period_days) + " days, which is what rotation buys")
print("  a compromised data key is useful for : the lifetime of")
print("    the objects it wrote")
print("  what shortens the second : re-encrypting the objects")
print("  re-encryption jobs run : " + str(re_encryption_jobs_run))
print("  estimated cost if run : " + str(estimated_days_to_re_encrypt_everything) + " days")
print("")
print("the canary decrypt")
print("  what it reads : one object")
print("  what it proves : the new wrapping key can unwrap a data")
print("    key, and that data key still opens its object")
print("  is that the right check for the rotation : yes, exactly")
print("  does it say anything about the data key's age : no")
print("  the data key it exercised : the same one as last time")
print("")
nc_re_encryption_jobs_run = 1
nc_objects_re_encrypted = encrypted_objects
nc_objects_a_pre_rotation_data_key_still_opens = 0
print("null control - the objects are rewritten too")
print("  rotation period : " + str(rotation_period_days) + " days, unchanged")
print("  re-encryption jobs : " + str(nc_re_encryption_jobs_run))
print("  objects re-encrypted : " + str(nc_objects_re_encrypted))
print("  objects a pre-rotation data key still opens : ")
print("    " + str(nc_objects_a_pre_rotation_data_key_still_opens))
print("  the rotation did not become more frequent; the layer it")
print("  never touched acquired a rotation of its own")
print("")
print("what key rotation guarantees")
print("  a compromised wrapping key stops being useful within a")
print("    period : exactly, " + str(rotations_completed) + " times, proved by a real decrypt")
print("  old data stops being readable with old material : not")
print("    addressed; rotation rewrites the wrapping and the")
print("    ciphertext is not the wrapping")
print("")
print("a rotation bounds the exposure of the thing it rotates;")
print("where a key hierarchy has two layers and only the upper one")
print("turns, the guarantee is exact and the quantity people say it")
print("out loud about belongs to the layer that did not move")
print("")
print("Rotation is scheduled rather than remembered, re-wraps every data key, proves")
print("itself with a real decrypt before retiring the old key, and has completed ")
print(str(rotations_completed) + " times with " + str(failed_decrypts) + " failed decrypts. It rewrites the wrapping and not the")
print("ciphertext, so " + str(objects_re_encrypted_under_a_new_data_key) + " of " + str(encrypted_objects) + " objects have been re-encrypted - ")
print(str(re_encrypted_per_myriad) + " per ten thousand - across " + str(days_of_rotation_history) + " days and " + str(re_encryption_jobs_run) + " re-encryption jobs.")
```

## stdout (executed)

```text
rotation period, days           : 90
rotations completed             : 8
  days of history               : 720
  canary decrypts per rotation  : 1
  failed decrypts               : 0

encrypted objects               : 41000000
  re-encrypted under a new data key : 0
  share                         : 0 per ten thousand
  a pre-rotation data key still opens : 
    41000000

re-encryption jobs run          : 0
estimated days to re-encrypt everything : 14

the rotation
  scheduled or remembered : scheduled, every 90 days
  what it re-wraps : every data key, under the new key
    encryption key
  proof before it is declared done : a canary object is
    decrypted, 1 per rotation
  when the old wrapping key is retired : only after that
    canary passes
  rotations completed : 8, failed decrypts 0
  verdict : ROTATED

  retiring the old key only after a real decrypt is the
  step that turns this from a calendar entry into a
  guarantee, and it is done every time

the two keys
  the key encryption key : rotated, 8 times
  the data key on each object : unchanged since the write
  what the ciphertext is encrypted under : the data key
  what rotation rewrites : the wrapping, not the object
  objects rewritten : 0
  what a leaked data key from before a rotation opens : 
    41000000 objects, still

  the rotation is complete over the layer it names, and
  the layer below it has not moved in 720 days

the two windows
  a compromised key encryption key is useful for : at
    most 90 days, which is what rotation buys
  a compromised data key is useful for : the lifetime of
    the objects it wrote
  what shortens the second : re-encrypting the objects
  re-encryption jobs run : 0
  estimated cost if run : 14 days

the canary decrypt
  what it reads : one object
  what it proves : the new wrapping key can unwrap a data
    key, and that data key still opens its object
  is that the right check for the rotation : yes, exactly
  does it say anything about the data key's age : no
  the data key it exercised : the same one as last time

null control - the objects are rewritten too
  rotation period : 90 days, unchanged
  re-encryption jobs : 1
  objects re-encrypted : 41000000
  objects a pre-rotation data key still opens : 
    0
  the rotation did not become more frequent; the layer it
  never touched acquired a rotation of its own

what key rotation guarantees
  a compromised wrapping key stops being useful within a
    period : exactly, 8 times, proved by a real decrypt
  old data stops being readable with old material : not
    addressed; rotation rewrites the wrapping and the
    ciphertext is not the wrapping

a rotation bounds the exposure of the thing it rotates;
where a key hierarchy has two layers and only the upper one
turns, the guarantee is exact and the quantity people say it
out loud about belongs to the layer that did not move

Rotation is scheduled rather than remembered, re-wraps every data key, proves
itself with a real decrypt before retiring the old key, and has completed 
8 times with 0 failed decrypts. It rewrites the wrapping and not the
ciphertext, so 0 of 41000000 objects have been re-encrypted - 
0 per ten thousand - across 720 days and 0 re-encryption jobs.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
