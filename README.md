# OhMyCar

Poland-first used BMW briefing. Not VIN history. Not ChatGPT.

Pick a chassis (E90). See every engine + year with reliability 0–100, typical faults, PLN to fix, where to buy the car, and where to buy parts.

**Live:** [https://moonmoonnotsun.github.io/ohmycar/](https://moonmoonnotsun.github.io/ohmycar/)

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (defaults to `/en`).

GitHub Pages is a static export of the same app (`output: "export"`). Chat answers stay in the browser; there is no server API.

## v0 defaults

- BMW only. 100 chassis as catalog cards. E90 (and E91/E92/E93 drivetrain) fully scored first.
- Scores are **hypotheses** until a Poland BMW specialist signs them. Unsigned chassis get no fake 73.
- Buy price is **not** mixed into 0–100.
- No API keys. Listings and parts are deep links (OTOMOTO, mobile.de, Autodoc, Inter Cars).
- No live AI ingest. Seeded TypeScript data. RAG chat later, only on signed pages.
