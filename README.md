# AGI Loading

A Vercel-ready interactive article site for field notes on harnesses,
meta-harnesses, and the software layer around model intelligence.

The page blends the Harness Series articles with a darker, game-like AGI
bootloader surface: loading animations, imported series cards, a local factory
map, and interactive article diagrams.

It imports the existing Harness Series article HTML from
`vishaltandale00/harnessseries-site` into `content/posts/`, then renders those
pieces alongside the new `The Primitive` article in one dynamic reader surface.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Metrics

The site tracks first-party view and click events through `/api/metrics` and
renders a query surface at `/metrics`.

For durable production storage, attach a Redis REST-compatible store such as
Upstash and set these Vercel environment variables:

```bash
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Without those variables, the API falls back to local in-memory storage for
smoke testing only.

Source attribution uses URL tags first, then the browser referrer host. For
LinkedIn messages, use a tagged link because private-message referrers are not
reliably exposed:

```text
https://agi-loading-akhil-field-notes.vercel.app/?src=linkedin_dm
```
