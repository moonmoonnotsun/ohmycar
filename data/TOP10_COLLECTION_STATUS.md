# Top-10 deep collection — status (2026-09-22)

**Gate:** stop here until you confirm expanding beyond these 10 chassis.

## What landed in the app data path

| Layer | Status |
|-------|--------|
| Sourced pains | 22 rows (unchanged set) |
| Pains with PLN bands | **22** (all pains; Takata free + 21 workshop bands) |
| Still null PLN | — (all 22 pains have PLN bands) |
| Buy year medians | expanded from public CarDossier tables |
| Fuel-split API samples | 5 (unchanged; demo limit hit) |
| Job quote files | `data/warehouse/repair_costs/jobs/*.json` (**15**) |
| NHTSA badge×year samples | `campaigns/nhtsa_top10_model_year_hits.json` |
| UOKiK | existing crawl (unchanged this pass) |

## Buy coverage by chassis (public asking medians)

- **e90**: years with median = 2009, 2010, 2011, 2012, 2013; gaps needing API = 2005, 2006, 2007, 2008
- **f30**: years with median = 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019; gaps needing API = none
- **e46**: years with median = none; gaps needing API = 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006
- **e60**: years with median = 2009, 2010; gaps needing API = 2003, 2004, 2005, 2006, 2007, 2008
- **f10**: years with median = 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017; gaps needing API = none
- **e39**: years with median = none; gaps needing API = 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003
- **e87**: years with median = 2009, 2010, 2011, 2012, 2013; gaps needing API = 2004, 2005, 2006, 2007, 2008
- **f20**: years with median = 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019; gaps needing API = none
- **e70**: years with median = 2009, 2010, 2011, 2012, 2013; gaps needing API = 2007, 2008
- **e83**: years with median = 2009, 2010; gaps needing API = 2003, 2004, 2005, 2006, 2007, 2008

## Repair PLN method (honest)

Bands are **published workshop / ASO / specialist quotes** with source URLs — not invented, and **not** yet Autodoc line-item BOMs (Cloudflare blocks scrapes). Confidence tag: `workshop_published_band`.

Headline examples:
- **N47 chain**: independent 3 800–5 500 (AutoKult) · specialist 6 500–8 500 (ADM) · ASO od 7 499 (Smorawiński)
- **N20 chain**: independent 1 500–3 000 · ASO od 5 999 · kit parts 1 375 (rozrzad.pl)
- **Water pump**: independent 800–1 500
- **Subframe**: localized weld 2 000–5 000 (AutoTechnik)
- **Transfer case ATC700**: regen path ~4 000–7 000 · OE new ~15–22k

## Hard blockers before “100% complete”

1. **CarDossier API key** — public HTML has **no years before ~2009**, so E46/E39 and early E90/E60/E87/E70/E83 listing medians stay N/A until API.
2. **Autodoc / Inter Cars** — need manual or authenticated pulls for SKU-level parts (partsReality score bucket).
3. Your **confirmation** to leave top10 and collect the rest of the catalog.

## Confirm to unlock

Reply **go beyond top10** (or similar) after you spot-check UI on a few variants (e.g. E90 320d N47, F30 320i N20, E46 M54, E70 xDrive).
