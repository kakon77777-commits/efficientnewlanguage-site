<!-- canonical: efficientnewlanguage.org/ai/examples/699-the-page-was-server-rendered-and-the-price-was-client-side | ai_layer_version: 0.1.0 | updated: 2026-09-04 -->

# Example 699 — The page was server rendered and the price was client side

`the_page_was_server_rendered_and_the_price_was_client_side.eml` - The page is rendered on the server and arrives complete, which the performance work measured and confirmed. Where the price comes from is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The page is
# rendered on the server and arrives complete, which the performance work
# measured and confirmed. Where the price comes from is computed below.
#
# The server rendering is real and it was worth doing. The document arrives with
# its content, first contentful paint fell from two point one seconds to four
# hundred milliseconds, the page is readable with scripting disabled, and a
# crawler that runs no JavaScript sees every product. The measurements are on
# real devices rather than a simulated fast one.
#
# One number on the page is not in that document. The price depends on the
# viewer's currency and their tier, so it is fetched after load and written into
# a placeholder — a decision made to keep the rendered page cacheable at the
# edge for everyone.
#
# The placeholder is rendered, cached, and shown for four hundred milliseconds
# before the real number replaces it.

400 => fcp_ms
2100 => fcp_before_ms
410 => price_fetch_ms
4200000 => page_views_per_day
0 => views_where_the_page_did_not_render

fcp_before_ms - fcp_ms => fcp_improvement_ms
page_views_per_day * price_fetch_ms => ms_a_day_showing_a_placeholder
int(ms_a_day_showing_a_placeholder / 1000 / 3600) => hours_a_day_showing_a_placeholder
int(price_fetch_ms * 10000 / (fcp_ms + price_fetch_ms)) => placeholder_share_per_myriad

"first contentful paint, before, ms : " + str(fcp_before_ms) ^0
"first contentful paint, after, ms  : " + str(fcp_ms) ^0
"improvement, ms                    : " + str(fcp_improvement_ms) ^0
"views where the page did not render: " + str(views_where_the_page_did_not_render) ^0
"" ^0
"price fetch, ms                    : " + str(price_fetch_ms) ^0
"page views per day                 : " + str(page_views_per_day) ^0
"hours a day showing a placeholder  : " + str(hours_a_day_showing_a_placeholder) ^0
"share of the visible time before the price : " + str(placeholder_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the rendering verified ----

"the server-rendered page" ^0
"  document arrives with its content : yes" ^0
"  readable with scripting disabled  : yes" ^0
"  a crawler running no JavaScript sees every product : yes" ^0
"  first contentful paint, ms        : " + str(fcp_ms) + ", from " + str(fcp_before_ms) ^0
"  measured on                       : real devices, not a" ^0
"    simulated fast one" ^0
"  verdict                           : SERVER RENDERED" ^0
"" ^0
"  the work was worth doing and the numbers are honest" ^0
"" ^0

# ---- what is not in the document ----

"the price" ^0
"  depends on   : the viewer's currency and tier" ^0
"  so it is     : fetched after load, into a placeholder" ^0
"  why          : to keep one rendered page cacheable at the" ^0
"    edge for every viewer" ^0
"  that reason  : correct, and the cache hit rate depends" ^0
"    on it" ^0
"" ^0
"  the page is complete except for the number the page is" ^0
"  about" ^0
"" ^0

# ---- what a metric sees ----

# First contentful paint fires when the placeholder paints. Every performance
# metric on the dashboard is measured against a document that is complete by
# their definitions and not by a shopper's.
"the metrics, against the placeholder" ^0
"  first contentful paint : fires at " + str(fcp_ms) + " ms" ^0
"  largest contentful paint : fires on the image, earlier" ^0
"    than the price" ^0
"  a metric that waits for the price : none defined" ^0
"  what the dashboards report : an improvement of " + str(fcp_improvement_ms) + " ms" ^0
"" ^0

# ---- what a crawler sees ----

# The crawler that reads every product reads the placeholder as the price. The
# structured data block is rendered server-side too, with the same placeholder
# in it.
"the crawler" ^0
"  products found        : all of them" ^0
"  price it reads        : the placeholder" ^0
"  structured data block : rendered server-side, same value" ^0
"  what a listing shows  : that value" ^0
"" ^0

# ---- null control ----

# The same rendering, with the price rendered server-side and the page varied
# on currency and tier at the edge instead of shared.
0 => nc_hours_a_day_showing_a_placeholder
fcp_ms => nc_time_until_the_price_is_visible_ms

"null control - the price rendered, the cache varied on currency and tier" ^0
"  first contentful paint, ms : " + str(fcp_ms) + ", unchanged" ^0
"  time until the price is visible, ms : " + str(nc_time_until_the_price_is_visible_ms) ^0
"  hours a day showing a placeholder   : " + str(nc_hours_a_day_showing_a_placeholder) ^0
"  the rendering did not change; the cache key grew and" ^0
"  the number the page is about arrived with the page" ^0
"" ^0

# ---- the rule ----

"what server rendering guarantees" ^0
"  the document arrives complete : exactly, for everything" ^0
"    in the document" ^0
"  the page is usable on arrival : not addressed; what was" ^0
"    left out was left out for a cache key, and the metric" ^0
"    that would notice is one nobody defines" ^0
"" ^0
"a rendering strategy is measured by when pixels appear and" ^0
"used to decide when a page is ready; the difference is" ^0
"whichever field could not be shared, which is usually the" ^0
"one the visit is for" ^0
"" ^0

"The server rendering is real and worth it: content in the document, readable" ^0
"without scripting, every product visible to a crawler, first paint from " + str(fcp_before_ms) ^0
"to " + str(fcp_ms) + " ms on real devices. The price is fetched afterwards to keep one page" ^0
"cacheable for everyone, so it arrives " + str(price_fetch_ms) + " ms later - " + str(placeholder_share_per_myriad) + " per ten thousand" ^0
"of the visible time - for " + str(hours_a_day_showing_a_placeholder) + " viewer-hours a day, and the crawler indexes the placeholder." ^0
```

## Python (deterministic transpilation)

```python
fcp_ms = 400
fcp_before_ms = 2100
price_fetch_ms = 410
page_views_per_day = 4200000
views_where_the_page_did_not_render = 0
fcp_improvement_ms = fcp_before_ms - fcp_ms
ms_a_day_showing_a_placeholder = page_views_per_day * price_fetch_ms
hours_a_day_showing_a_placeholder = int(ms_a_day_showing_a_placeholder / 1000 / 3600)
placeholder_share_per_myriad = int(price_fetch_ms * 10000 / (fcp_ms + price_fetch_ms))
print("first contentful paint, before, ms : " + str(fcp_before_ms))
print("first contentful paint, after, ms  : " + str(fcp_ms))
print("improvement, ms                    : " + str(fcp_improvement_ms))
print("views where the page did not render: " + str(views_where_the_page_did_not_render))
print("")
print("price fetch, ms                    : " + str(price_fetch_ms))
print("page views per day                 : " + str(page_views_per_day))
print("hours a day showing a placeholder  : " + str(hours_a_day_showing_a_placeholder))
print("share of the visible time before the price : " + str(placeholder_share_per_myriad) + " per ten thousand")
print("")
print("the server-rendered page")
print("  document arrives with its content : yes")
print("  readable with scripting disabled  : yes")
print("  a crawler running no JavaScript sees every product : yes")
print("  first contentful paint, ms        : " + str(fcp_ms) + ", from " + str(fcp_before_ms))
print("  measured on                       : real devices, not a")
print("    simulated fast one")
print("  verdict                           : SERVER RENDERED")
print("")
print("  the work was worth doing and the numbers are honest")
print("")
print("the price")
print("  depends on   : the viewer's currency and tier")
print("  so it is     : fetched after load, into a placeholder")
print("  why          : to keep one rendered page cacheable at the")
print("    edge for every viewer")
print("  that reason  : correct, and the cache hit rate depends")
print("    on it")
print("")
print("  the page is complete except for the number the page is")
print("  about")
print("")
print("the metrics, against the placeholder")
print("  first contentful paint : fires at " + str(fcp_ms) + " ms")
print("  largest contentful paint : fires on the image, earlier")
print("    than the price")
print("  a metric that waits for the price : none defined")
print("  what the dashboards report : an improvement of " + str(fcp_improvement_ms) + " ms")
print("")
print("the crawler")
print("  products found        : all of them")
print("  price it reads        : the placeholder")
print("  structured data block : rendered server-side, same value")
print("  what a listing shows  : that value")
print("")
nc_hours_a_day_showing_a_placeholder = 0
nc_time_until_the_price_is_visible_ms = fcp_ms
print("null control - the price rendered, the cache varied on currency and tier")
print("  first contentful paint, ms : " + str(fcp_ms) + ", unchanged")
print("  time until the price is visible, ms : " + str(nc_time_until_the_price_is_visible_ms))
print("  hours a day showing a placeholder   : " + str(nc_hours_a_day_showing_a_placeholder))
print("  the rendering did not change; the cache key grew and")
print("  the number the page is about arrived with the page")
print("")
print("what server rendering guarantees")
print("  the document arrives complete : exactly, for everything")
print("    in the document")
print("  the page is usable on arrival : not addressed; what was")
print("    left out was left out for a cache key, and the metric")
print("    that would notice is one nobody defines")
print("")
print("a rendering strategy is measured by when pixels appear and")
print("used to decide when a page is ready; the difference is")
print("whichever field could not be shared, which is usually the")
print("one the visit is for")
print("")
print("The server rendering is real and worth it: content in the document, readable")
print("without scripting, every product visible to a crawler, first paint from " + str(fcp_before_ms))
print("to " + str(fcp_ms) + " ms on real devices. The price is fetched afterwards to keep one page")
print("cacheable for everyone, so it arrives " + str(price_fetch_ms) + " ms later - " + str(placeholder_share_per_myriad) + " per ten thousand")
print("of the visible time - for " + str(hours_a_day_showing_a_placeholder) + " viewer-hours a day, and the crawler indexes the placeholder.")
```

## stdout (executed)

```text
first contentful paint, before, ms : 2100
first contentful paint, after, ms  : 400
improvement, ms                    : 1700
views where the page did not render: 0

price fetch, ms                    : 410
page views per day                 : 4200000
hours a day showing a placeholder  : 478
share of the visible time before the price : 5061 per ten thousand

the server-rendered page
  document arrives with its content : yes
  readable with scripting disabled  : yes
  a crawler running no JavaScript sees every product : yes
  first contentful paint, ms        : 400, from 2100
  measured on                       : real devices, not a
    simulated fast one
  verdict                           : SERVER RENDERED

  the work was worth doing and the numbers are honest

the price
  depends on   : the viewer's currency and tier
  so it is     : fetched after load, into a placeholder
  why          : to keep one rendered page cacheable at the
    edge for every viewer
  that reason  : correct, and the cache hit rate depends
    on it

  the page is complete except for the number the page is
  about

the metrics, against the placeholder
  first contentful paint : fires at 400 ms
  largest contentful paint : fires on the image, earlier
    than the price
  a metric that waits for the price : none defined
  what the dashboards report : an improvement of 1700 ms

the crawler
  products found        : all of them
  price it reads        : the placeholder
  structured data block : rendered server-side, same value
  what a listing shows  : that value

null control - the price rendered, the cache varied on currency and tier
  first contentful paint, ms : 400, unchanged
  time until the price is visible, ms : 400
  hours a day showing a placeholder   : 0
  the rendering did not change; the cache key grew and
  the number the page is about arrived with the page

what server rendering guarantees
  the document arrives complete : exactly, for everything
    in the document
  the page is usable on arrival : not addressed; what was
    left out was left out for a cache key, and the metric
    that would notice is one nobody defines

a rendering strategy is measured by when pixels appear and
used to decide when a page is ready; the difference is
whichever field could not be shared, which is usually the
one the visit is for

The server rendering is real and worth it: content in the document, readable
without scripting, every product visible to a crawler, first paint from 2100
to 400 ms on real devices. The price is fetched afterwards to keep one page
cacheable for everyone, so it arrives 410 ms later - 5061 per ten thousand
of the visible time - for 478 viewer-hours a day, and the crawler indexes the placeholder.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
