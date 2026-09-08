<!-- canonical: efficientnewlanguage.org/ai/examples/754-the-feedback-widget-was-on-the-page-that-helped | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 754 — The feedback widget was on the page that helped

`the_feedback_widget_was_on_the_page_that_helped.eml` - Every help article ends with "was this useful?", the responses are stored with the article and the query that led there, and 94 percent say yes. Who answers is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every help article
# ends with "was this useful?", the responses are stored with the article and
# the query that led there, and 94 percent say yes. Who answers is computed
# below.
#
# The instrument is well built. It is not a star rating nobody understands; it
# is one question with two answers, placed at the end of the article rather
# than in a modal; the response is stored with the article version and the
# search query that led there, so a regression is attributable; and the team
# reads it and has rewritten eleven articles because of it.
#
# The widget is at the BOTTOM of the article. Reaching it means having read to
# the end, and a reader who found the article irrelevant in the first paragraph
# closes the tab above it.
#
# Sixty-one percent of sessions leave before the widget is on screen.

10000 => a_whole_per_myriad
9400 => yes_share_per_myriad
100 => a_whole_percent
61 => sessions_leaving_before_the_widget_percent
480000 => article_sessions_per_month
11 => articles_rewritten_because_of_it
1 => questions_the_widget_asks
0 => responses_collected_from_a_session_that_left_early
0 => alerts_on_the_early_leave_rate

a_whole_percent - sessions_leaving_before_the_widget_percent => sessions_reaching_the_widget_percent
int(article_sessions_per_month * sessions_leaving_before_the_widget_percent / a_whole_percent) => sessions_that_never_saw_it
article_sessions_per_month - sessions_that_never_saw_it => sessions_that_could_answer
a_whole_per_myriad - yes_share_per_myriad => no_share_per_myriad

"yes share                       : " + str(yes_share_per_myriad) + " per ten thousand" ^0
"  no share                      : " + str(no_share_per_myriad) + " per ten thousand" ^0
"questions the widget asks       : " + str(questions_the_widget_asks) ^0
"articles rewritten because of it: " + str(articles_rewritten_because_of_it) ^0
"" ^0
"article sessions per month      : " + str(article_sessions_per_month) ^0
"  reaching the widget, percent  : " + str(sessions_reaching_the_widget_percent) ^0
"  able to answer                : " + str(sessions_that_could_answer) ^0
"  leaving before it, percent    : " + str(sessions_leaving_before_the_widget_percent) ^0
"  that never saw it             : " + str(sessions_that_never_saw_it) ^0
"" ^0
"responses from a session that left early : " + str(responses_collected_from_a_session_that_left_early) ^0
"alerts on the early-leave rate           : " + str(alerts_on_the_early_leave_rate) ^0
"" ^0

# ---- what the widget verified ----

"the instrument" ^0
"  what it asks : " + str(questions_the_widget_asks) + " question with two answers" ^0
"  what it is not : a star rating nobody can interpret" ^0
"  where it sits : at the end of the article, not in a" ^0
"    modal over it" ^0
"  what is stored with the answer : the article version" ^0
"    and the query that led there" ^0
"  so a regression is : attributable" ^0
"  articles rewritten because of it : " + str(articles_rewritten_because_of_it) ^0
"  verdict : A REAL SIGNAL" ^0
"" ^0
"  one question, at the end, stored with its context is" ^0
"  better than most feedback and this one is acted on" ^0
"" ^0

# ---- who can answer it ----

"the reachable population" ^0
"  where the widget is : below the article" ^0
"  what reaching it requires : reading to the end" ^0
"  a reader whose answer would be no : often stops in the" ^0
"    first paragraph" ^0
"  what that reader contributes : nothing" ^0
"  sessions in that state per month : " + str(sessions_that_never_saw_it) ^0
"  responses from them : " + str(responses_collected_from_a_session_that_left_early) ^0
"" ^0
"  the question is well posed and it is posed after the" ^0
"  event that decides the answer" ^0
"" ^0

# ---- placing it higher does not fix it ----

# Moving the widget above the article would collect answers from readers who
# have not read it, which measures something else. The placement is right; the
# population it can reach is a property of the placement, not a fault in it.
"moving it up" ^0
"  who would then answer : readers who have not read the" ^0
"    article" ^0
"  what that measures : the title" ^0
"  is the current placement wrong : no" ^0
"  is the reachable population narrower than the question" ^0
"    implies : yes" ^0
"  both of those are true at once" ^0
"" ^0

# ---- the number that would show it ----

"what the analytics already hold" ^0
"  scroll depth per session : recorded" ^0
"  time on page per session : recorded" ^0
"  sessions leaving above the widget : " + str(sessions_that_never_saw_it) ^0
"  is that number in the feedback report : no" ^0
"  alerts on it : " + str(alerts_on_the_early_leave_rate) ^0
"  what an article that fails everyone looks like : a high" ^0
"    yes share and a high early-leave rate" ^0
"" ^0

# ---- null control ----

# The same widget, with the yes share reported beside the share of sessions
# that reached it, and an alert when the second falls.
sessions_that_could_answer => nc_denominator_reported_beside_the_rate
1 => nc_alerts_on_the_early_leave_rate

"null control - report the reach beside the rate" ^0
"  yes share : " + str(yes_share_per_myriad) + " per ten thousand, unchanged" ^0
"  denominator reported beside it : " + str(nc_denominator_reported_beside_the_rate) ^0
"  alerts on the early-leave rate : " + str(nc_alerts_on_the_early_leave_rate) ^0
"  the widget did not move; the number it produces stopped" ^0
"  being readable without the population it came from" ^0
"" ^0

# ---- the rule ----

"what a high satisfaction rate guarantees" ^0
"  the people who answered were helped : exactly, and the" ^0
"    question is well posed" ^0
"  the article helps people : not addressed; answering" ^0
"    requires reaching the question, and reaching it" ^0
"    requires the outcome the question asks about" ^0
"" ^0
"an instrument placed after an outcome is answered only by" ^0
"the outcomes that reach it; the placement can be correct and" ^0
"the population still selected, and the selection runs in the" ^0
"direction that flatters" ^0
"" ^0

"The widget is one question with two answers, at the end of the article, stored" ^0
"with the version and the query, and it has driven " + str(articles_rewritten_because_of_it) + " rewrites - " + str(yes_share_per_myriad) + " per ten" ^0
"thousand say yes. Reaching it means reading to the end, so " + str(sessions_that_never_saw_it) + " of " + str(article_sessions_per_month) ^0
"sessions a month leave above it and contribute " + str(responses_collected_from_a_session_that_left_early) + " responses, under " + str(alerts_on_the_early_leave_rate) ^0
"alerts on the rate at which that happens." ^0
```

## Python (deterministic transpilation)

```python
a_whole_per_myriad = 10000
yes_share_per_myriad = 9400
a_whole_percent = 100
sessions_leaving_before_the_widget_percent = 61
article_sessions_per_month = 480000
articles_rewritten_because_of_it = 11
questions_the_widget_asks = 1
responses_collected_from_a_session_that_left_early = 0
alerts_on_the_early_leave_rate = 0
sessions_reaching_the_widget_percent = a_whole_percent - sessions_leaving_before_the_widget_percent
sessions_that_never_saw_it = int(article_sessions_per_month * sessions_leaving_before_the_widget_percent / a_whole_percent)
sessions_that_could_answer = article_sessions_per_month - sessions_that_never_saw_it
no_share_per_myriad = a_whole_per_myriad - yes_share_per_myriad
print("yes share                       : " + str(yes_share_per_myriad) + " per ten thousand")
print("  no share                      : " + str(no_share_per_myriad) + " per ten thousand")
print("questions the widget asks       : " + str(questions_the_widget_asks))
print("articles rewritten because of it: " + str(articles_rewritten_because_of_it))
print("")
print("article sessions per month      : " + str(article_sessions_per_month))
print("  reaching the widget, percent  : " + str(sessions_reaching_the_widget_percent))
print("  able to answer                : " + str(sessions_that_could_answer))
print("  leaving before it, percent    : " + str(sessions_leaving_before_the_widget_percent))
print("  that never saw it             : " + str(sessions_that_never_saw_it))
print("")
print("responses from a session that left early : " + str(responses_collected_from_a_session_that_left_early))
print("alerts on the early-leave rate           : " + str(alerts_on_the_early_leave_rate))
print("")
print("the instrument")
print("  what it asks : " + str(questions_the_widget_asks) + " question with two answers")
print("  what it is not : a star rating nobody can interpret")
print("  where it sits : at the end of the article, not in a")
print("    modal over it")
print("  what is stored with the answer : the article version")
print("    and the query that led there")
print("  so a regression is : attributable")
print("  articles rewritten because of it : " + str(articles_rewritten_because_of_it))
print("  verdict : A REAL SIGNAL")
print("")
print("  one question, at the end, stored with its context is")
print("  better than most feedback and this one is acted on")
print("")
print("the reachable population")
print("  where the widget is : below the article")
print("  what reaching it requires : reading to the end")
print("  a reader whose answer would be no : often stops in the")
print("    first paragraph")
print("  what that reader contributes : nothing")
print("  sessions in that state per month : " + str(sessions_that_never_saw_it))
print("  responses from them : " + str(responses_collected_from_a_session_that_left_early))
print("")
print("  the question is well posed and it is posed after the")
print("  event that decides the answer")
print("")
print("moving it up")
print("  who would then answer : readers who have not read the")
print("    article")
print("  what that measures : the title")
print("  is the current placement wrong : no")
print("  is the reachable population narrower than the question")
print("    implies : yes")
print("  both of those are true at once")
print("")
print("what the analytics already hold")
print("  scroll depth per session : recorded")
print("  time on page per session : recorded")
print("  sessions leaving above the widget : " + str(sessions_that_never_saw_it))
print("  is that number in the feedback report : no")
print("  alerts on it : " + str(alerts_on_the_early_leave_rate))
print("  what an article that fails everyone looks like : a high")
print("    yes share and a high early-leave rate")
print("")
nc_denominator_reported_beside_the_rate = sessions_that_could_answer
nc_alerts_on_the_early_leave_rate = 1
print("null control - report the reach beside the rate")
print("  yes share : " + str(yes_share_per_myriad) + " per ten thousand, unchanged")
print("  denominator reported beside it : " + str(nc_denominator_reported_beside_the_rate))
print("  alerts on the early-leave rate : " + str(nc_alerts_on_the_early_leave_rate))
print("  the widget did not move; the number it produces stopped")
print("  being readable without the population it came from")
print("")
print("what a high satisfaction rate guarantees")
print("  the people who answered were helped : exactly, and the")
print("    question is well posed")
print("  the article helps people : not addressed; answering")
print("    requires reaching the question, and reaching it")
print("    requires the outcome the question asks about")
print("")
print("an instrument placed after an outcome is answered only by")
print("the outcomes that reach it; the placement can be correct and")
print("the population still selected, and the selection runs in the")
print("direction that flatters")
print("")
print("The widget is one question with two answers, at the end of the article, stored")
print("with the version and the query, and it has driven " + str(articles_rewritten_because_of_it) + " rewrites - " + str(yes_share_per_myriad) + " per ten")
print("thousand say yes. Reaching it means reading to the end, so " + str(sessions_that_never_saw_it) + " of " + str(article_sessions_per_month))
print("sessions a month leave above it and contribute " + str(responses_collected_from_a_session_that_left_early) + " responses, under " + str(alerts_on_the_early_leave_rate))
print("alerts on the rate at which that happens.")
```

## stdout (executed)

```text
yes share                       : 9400 per ten thousand
  no share                      : 600 per ten thousand
questions the widget asks       : 1
articles rewritten because of it: 11

article sessions per month      : 480000
  reaching the widget, percent  : 39
  able to answer                : 187200
  leaving before it, percent    : 61
  that never saw it             : 292800

responses from a session that left early : 0
alerts on the early-leave rate           : 0

the instrument
  what it asks : 1 question with two answers
  what it is not : a star rating nobody can interpret
  where it sits : at the end of the article, not in a
    modal over it
  what is stored with the answer : the article version
    and the query that led there
  so a regression is : attributable
  articles rewritten because of it : 11
  verdict : A REAL SIGNAL

  one question, at the end, stored with its context is
  better than most feedback and this one is acted on

the reachable population
  where the widget is : below the article
  what reaching it requires : reading to the end
  a reader whose answer would be no : often stops in the
    first paragraph
  what that reader contributes : nothing
  sessions in that state per month : 292800
  responses from them : 0

  the question is well posed and it is posed after the
  event that decides the answer

moving it up
  who would then answer : readers who have not read the
    article
  what that measures : the title
  is the current placement wrong : no
  is the reachable population narrower than the question
    implies : yes
  both of those are true at once

what the analytics already hold
  scroll depth per session : recorded
  time on page per session : recorded
  sessions leaving above the widget : 292800
  is that number in the feedback report : no
  alerts on it : 0
  what an article that fails everyone looks like : a high
    yes share and a high early-leave rate

null control - report the reach beside the rate
  yes share : 9400 per ten thousand, unchanged
  denominator reported beside it : 187200
  alerts on the early-leave rate : 1
  the widget did not move; the number it produces stopped
  being readable without the population it came from

what a high satisfaction rate guarantees
  the people who answered were helped : exactly, and the
    question is well posed
  the article helps people : not addressed; answering
    requires reaching the question, and reaching it
    requires the outcome the question asks about

an instrument placed after an outcome is answered only by
the outcomes that reach it; the placement can be correct and
the population still selected, and the selection runs in the
direction that flatters

The widget is one question with two answers, at the end of the article, stored
with the version and the query, and it has driven 11 rewrites - 9400 per ten
thousand say yes. Reaching it means reading to the end, so 292800 of 480000
sessions a month leave above it and contribute 0 responses, under 0
alerts on the rate at which that happens.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
