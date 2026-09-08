<!-- canonical: efficientnewlanguage.org/ai/examples/751-the-capacity-was-sold-in-seats-and-the-load-arrived-in-sessions | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 751 — The capacity was sold in seats and the load arrived in sessions

`the_capacity_was_sold_in_seats_and_the_load_arrived_in_sessions.eml` - Capacity is planned from seats sold, the model was fitted against two years of measured load, and it has predicted the last six months within four percent. What a seat is a proxy for is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Capacity is
# planned from seats sold, the model was fitted against two years of measured
# load, and it has predicted the last six months within four percent. What a
# seat is a proxy for is computed below.
#
# The planning model is properly built. It is not a spreadsheet of guesses: it
# was fitted against two years of measured load rather than assumed to be
# linear, it carries an explicit error bar, it is re-fitted quarterly against
# what actually happened, and over the last six months it predicted peak load
# within four percent. Capacity has been bought on it twice and both purchases
# were the right size.
#
# The input is SEATS SOLD. A seat is a person with a licence, and load arrives
# as concurrent sessions, which is people times devices times tabs.
#
# The mean seat opened 1.0 sessions two years ago and opens 2.7 now.

10 => sessions_per_seat_then_tenths
27 => sessions_per_seat_now_tenths
10 => tenths_per_whole
41000 => seats_sold
4 => prediction_error_percent
2 => years_the_model_was_fitted_over
2 => capacity_purchases_made_on_it
0 => inputs_to_the_model_measured_in_sessions
0 => alerts_on_sessions_per_seat

int(seats_sold * sessions_per_seat_then_tenths / tenths_per_whole) => sessions_the_model_was_fitted_on
int(seats_sold * sessions_per_seat_now_tenths / tenths_per_whole) => sessions_now
sessions_now - sessions_the_model_was_fitted_on => sessions_added_with_no_change_in_seats
int(sessions_per_seat_now_tenths * 100 / sessions_per_seat_then_tenths) => sessions_per_seat_now_as_percent

"seats sold                      : " + str(seats_sold) ^0
"prediction error, percent       : " + str(prediction_error_percent) ^0
"years the model was fitted over : " + str(years_the_model_was_fitted_over) ^0
"capacity purchases made on it   : " + str(capacity_purchases_made_on_it) ^0
"" ^0
"sessions per seat then, tenths  : " + str(sessions_per_seat_then_tenths) ^0
"sessions per seat now, tenths   : " + str(sessions_per_seat_now_tenths) ^0
"  as a percent of then          : " + str(sessions_per_seat_now_as_percent) ^0
"" ^0
"sessions at the fitted rate     : " + str(sessions_the_model_was_fitted_on) ^0
"sessions now                    : " + str(sessions_now) ^0
"  added with no change in seats : " + str(sessions_added_with_no_change_in_seats) ^0
"inputs measured in sessions     : " + str(inputs_to_the_model_measured_in_sessions) ^0
"alerts on sessions per seat     : " + str(alerts_on_sessions_per_seat) ^0
"" ^0

# ---- what the model verified ----

"the capacity model" ^0
"  fitted against : " + str(years_the_model_was_fitted_over) + " years of measured load, not assumed" ^0
"    to be linear" ^0
"  carries an error bar : yes, explicit" ^0
"  re-fitted : quarterly, against what happened" ^0
"  prediction error over six months : " + str(prediction_error_percent) + " percent" ^0
"  capacity purchases made on it : " + str(capacity_purchases_made_on_it) + ", both right-sized" ^0
"  verdict : ACCURATE" ^0
"" ^0
"  re-fitting quarterly against outcomes rather than" ^0
"  defending the original curve is the discipline that" ^0
"  makes this model trustworthy, and it is followed" ^0
"" ^0

# ---- what the input is ----

"the model's variable" ^0
"  what it takes : seats sold" ^0
"  what a seat is : a person with a licence" ^0
"  what load is : concurrent sessions" ^0
"  what relates them : people times devices times tabs" ^0
"  is that ratio in the model : as a fitted constant" ^0
"  inputs measured in sessions : " ^0
"    " + str(inputs_to_the_model_measured_in_sessions) ^0
"" ^0
"  the model is accurate about the quantity it was fitted" ^0
"  on and the conversion to the quantity that costs money" ^0
"  is a constant somebody measured once" ^0
"" ^0

# ---- the constant moved ----

# Two years ago a seat meant one session. Now it means two point seven, because
# the product shipped a phone client and people keep a tab open at home. Nobody
# changed the model; the world changed the coefficient it hard-codes.
"the coefficient" ^0
"  sessions per seat when fitted : " + str(sessions_per_seat_then_tenths) + " tenths" ^0
"  sessions per seat now         : " + str(sessions_per_seat_now_tenths) + " tenths" ^0
"  what changed : a phone client shipped and people leave" ^0
"    a tab open at home" ^0
"  did anyone edit the model : no" ^0
"  did the quarterly re-fit absorb it : yes, which is why" ^0
"    the predictions stayed good" ^0
"  alerts on the coefficient itself : " ^0
"    " + str(alerts_on_sessions_per_seat) ^0
"" ^0

# ---- why the accuracy is not the reassurance ----

"what the four percent means" ^0
"  what the model predicts : load, from seats" ^0
"  is that prediction good : yes, within " + str(prediction_error_percent) + " percent" ^0
"  what makes it good : quarterly re-fitting" ^0
"  what re-fitting does : moves the coefficient after the" ^0
"    load has already arrived" ^0
"  so the model is : accurate about the past quarter" ^0
"  what a sales forecast in seats implies about next year :" ^0
"    a number computed with today's coefficient" ^0
"" ^0

# ---- null control ----

# The same model, taking sessions as its input and seats as a driver of
# sessions, so the coefficient is a variable with its own trend and its own
# alert rather than a constant that re-fitting quietly absorbs.
1 => nc_inputs_to_the_model_measured_in_sessions
1 => nc_alerts_on_sessions_per_seat

"null control - sessions are an input, not a constant" ^0
"  prediction error : " + str(prediction_error_percent) + " percent, unchanged" ^0
"  inputs measured in sessions : " ^0
"    " + str(nc_inputs_to_the_model_measured_in_sessions) ^0
"  alerts on sessions per seat : " + str(nc_alerts_on_sessions_per_seat) ^0
"  the model did not get more accurate; the quantity that" ^0
"  had been moving under it became a thing with a trend" ^0
"" ^0

# ---- the rule ----

"what an accurate capacity model guarantees" ^0
"  load can be predicted from seats, today : exactly," ^0
"    within " + str(prediction_error_percent) + " percent, re-fitted quarterly" ^0
"  seats predict load : not addressed; the model converts" ^0
"    between two units by a coefficient it does not" ^0
"    measure, and re-fitting hides that the coefficient is" ^0
"    what moved" ^0
"" ^0
"a model stated in one unit and paid for in another is only" ^0
"as stable as the conversion between them; re-fitting keeps" ^0
"the predictions right and removes the evidence that the" ^0
"relationship changed, which is the thing a plan is about" ^0
"" ^0

"The model was fitted against " + str(years_the_model_was_fitted_over) + " years of measured load, carries an error bar," ^0
"is re-fitted quarterly, and predicted six months within " + str(prediction_error_percent) + " percent across " ^0
str(capacity_purchases_made_on_it) + " right-sized purchases. Its input is seats and the load is sessions, and a" ^0
"seat went from " + str(sessions_per_seat_then_tenths) + " to " + str(sessions_per_seat_now_tenths) + " tenths of a session - " + str(sessions_per_seat_now_as_percent) + " percent - so " ^0
str(seats_sold) + " seats now carry " + str(sessions_added_with_no_change_in_seats) + " more sessions under " + str(alerts_on_sessions_per_seat) + " alerts." ^0
```

## Python (deterministic transpilation)

```python
sessions_per_seat_then_tenths = 10
sessions_per_seat_now_tenths = 27
tenths_per_whole = 10
seats_sold = 41000
prediction_error_percent = 4
years_the_model_was_fitted_over = 2
capacity_purchases_made_on_it = 2
inputs_to_the_model_measured_in_sessions = 0
alerts_on_sessions_per_seat = 0
sessions_the_model_was_fitted_on = int(seats_sold * sessions_per_seat_then_tenths / tenths_per_whole)
sessions_now = int(seats_sold * sessions_per_seat_now_tenths / tenths_per_whole)
sessions_added_with_no_change_in_seats = sessions_now - sessions_the_model_was_fitted_on
sessions_per_seat_now_as_percent = int(sessions_per_seat_now_tenths * 100 / sessions_per_seat_then_tenths)
print("seats sold                      : " + str(seats_sold))
print("prediction error, percent       : " + str(prediction_error_percent))
print("years the model was fitted over : " + str(years_the_model_was_fitted_over))
print("capacity purchases made on it   : " + str(capacity_purchases_made_on_it))
print("")
print("sessions per seat then, tenths  : " + str(sessions_per_seat_then_tenths))
print("sessions per seat now, tenths   : " + str(sessions_per_seat_now_tenths))
print("  as a percent of then          : " + str(sessions_per_seat_now_as_percent))
print("")
print("sessions at the fitted rate     : " + str(sessions_the_model_was_fitted_on))
print("sessions now                    : " + str(sessions_now))
print("  added with no change in seats : " + str(sessions_added_with_no_change_in_seats))
print("inputs measured in sessions     : " + str(inputs_to_the_model_measured_in_sessions))
print("alerts on sessions per seat     : " + str(alerts_on_sessions_per_seat))
print("")
print("the capacity model")
print("  fitted against : " + str(years_the_model_was_fitted_over) + " years of measured load, not assumed")
print("    to be linear")
print("  carries an error bar : yes, explicit")
print("  re-fitted : quarterly, against what happened")
print("  prediction error over six months : " + str(prediction_error_percent) + " percent")
print("  capacity purchases made on it : " + str(capacity_purchases_made_on_it) + ", both right-sized")
print("  verdict : ACCURATE")
print("")
print("  re-fitting quarterly against outcomes rather than")
print("  defending the original curve is the discipline that")
print("  makes this model trustworthy, and it is followed")
print("")
print("the model's variable")
print("  what it takes : seats sold")
print("  what a seat is : a person with a licence")
print("  what load is : concurrent sessions")
print("  what relates them : people times devices times tabs")
print("  is that ratio in the model : as a fitted constant")
print("  inputs measured in sessions : ")
print("    " + str(inputs_to_the_model_measured_in_sessions))
print("")
print("  the model is accurate about the quantity it was fitted")
print("  on and the conversion to the quantity that costs money")
print("  is a constant somebody measured once")
print("")
print("the coefficient")
print("  sessions per seat when fitted : " + str(sessions_per_seat_then_tenths) + " tenths")
print("  sessions per seat now         : " + str(sessions_per_seat_now_tenths) + " tenths")
print("  what changed : a phone client shipped and people leave")
print("    a tab open at home")
print("  did anyone edit the model : no")
print("  did the quarterly re-fit absorb it : yes, which is why")
print("    the predictions stayed good")
print("  alerts on the coefficient itself : ")
print("    " + str(alerts_on_sessions_per_seat))
print("")
print("what the four percent means")
print("  what the model predicts : load, from seats")
print("  is that prediction good : yes, within " + str(prediction_error_percent) + " percent")
print("  what makes it good : quarterly re-fitting")
print("  what re-fitting does : moves the coefficient after the")
print("    load has already arrived")
print("  so the model is : accurate about the past quarter")
print("  what a sales forecast in seats implies about next year :")
print("    a number computed with today's coefficient")
print("")
nc_inputs_to_the_model_measured_in_sessions = 1
nc_alerts_on_sessions_per_seat = 1
print("null control - sessions are an input, not a constant")
print("  prediction error : " + str(prediction_error_percent) + " percent, unchanged")
print("  inputs measured in sessions : ")
print("    " + str(nc_inputs_to_the_model_measured_in_sessions))
print("  alerts on sessions per seat : " + str(nc_alerts_on_sessions_per_seat))
print("  the model did not get more accurate; the quantity that")
print("  had been moving under it became a thing with a trend")
print("")
print("what an accurate capacity model guarantees")
print("  load can be predicted from seats, today : exactly,")
print("    within " + str(prediction_error_percent) + " percent, re-fitted quarterly")
print("  seats predict load : not addressed; the model converts")
print("    between two units by a coefficient it does not")
print("    measure, and re-fitting hides that the coefficient is")
print("    what moved")
print("")
print("a model stated in one unit and paid for in another is only")
print("as stable as the conversion between them; re-fitting keeps")
print("the predictions right and removes the evidence that the")
print("relationship changed, which is the thing a plan is about")
print("")
print("The model was fitted against " + str(years_the_model_was_fitted_over) + " years of measured load, carries an error bar,")
print("is re-fitted quarterly, and predicted six months within " + str(prediction_error_percent) + " percent across ")
print(str(capacity_purchases_made_on_it) + " right-sized purchases. Its input is seats and the load is sessions, and a")
print("seat went from " + str(sessions_per_seat_then_tenths) + " to " + str(sessions_per_seat_now_tenths) + " tenths of a session - " + str(sessions_per_seat_now_as_percent) + " percent - so ")
print(str(seats_sold) + " seats now carry " + str(sessions_added_with_no_change_in_seats) + " more sessions under " + str(alerts_on_sessions_per_seat) + " alerts.")
```

## stdout (executed)

```text
seats sold                      : 41000
prediction error, percent       : 4
years the model was fitted over : 2
capacity purchases made on it   : 2

sessions per seat then, tenths  : 10
sessions per seat now, tenths   : 27
  as a percent of then          : 270

sessions at the fitted rate     : 41000
sessions now                    : 110700
  added with no change in seats : 69700
inputs measured in sessions     : 0
alerts on sessions per seat     : 0

the capacity model
  fitted against : 2 years of measured load, not assumed
    to be linear
  carries an error bar : yes, explicit
  re-fitted : quarterly, against what happened
  prediction error over six months : 4 percent
  capacity purchases made on it : 2, both right-sized
  verdict : ACCURATE

  re-fitting quarterly against outcomes rather than
  defending the original curve is the discipline that
  makes this model trustworthy, and it is followed

the model's variable
  what it takes : seats sold
  what a seat is : a person with a licence
  what load is : concurrent sessions
  what relates them : people times devices times tabs
  is that ratio in the model : as a fitted constant
  inputs measured in sessions : 
    0

  the model is accurate about the quantity it was fitted
  on and the conversion to the quantity that costs money
  is a constant somebody measured once

the coefficient
  sessions per seat when fitted : 10 tenths
  sessions per seat now         : 27 tenths
  what changed : a phone client shipped and people leave
    a tab open at home
  did anyone edit the model : no
  did the quarterly re-fit absorb it : yes, which is why
    the predictions stayed good
  alerts on the coefficient itself : 
    0

what the four percent means
  what the model predicts : load, from seats
  is that prediction good : yes, within 4 percent
  what makes it good : quarterly re-fitting
  what re-fitting does : moves the coefficient after the
    load has already arrived
  so the model is : accurate about the past quarter
  what a sales forecast in seats implies about next year :
    a number computed with today's coefficient

null control - sessions are an input, not a constant
  prediction error : 4 percent, unchanged
  inputs measured in sessions : 
    1
  alerts on sessions per seat : 1
  the model did not get more accurate; the quantity that
  had been moving under it became a thing with a trend

what an accurate capacity model guarantees
  load can be predicted from seats, today : exactly,
    within 4 percent, re-fitted quarterly
  seats predict load : not addressed; the model converts
    between two units by a coefficient it does not
    measure, and re-fitting hides that the coefficient is
    what moved

a model stated in one unit and paid for in another is only
as stable as the conversion between them; re-fitting keeps
the predictions right and removes the evidence that the
relationship changed, which is the thing a plan is about

The model was fitted against 2 years of measured load, carries an error bar,
is re-fitted quarterly, and predicted six months within 4 percent across 
2 right-sized purchases. Its input is seats and the load is sessions, and a
seat went from 10 to 27 tenths of a session - 270 percent - so 
41000 seats now carry 69700 more sessions under 0 alerts.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
