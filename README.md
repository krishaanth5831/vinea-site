# Vinea site

The Vinea site: a single page built from static, typed content.

Next.js (App Router) with TypeScript, Tailwind v4, GSAP and Lenis, deployed on
Vercel. No CMS, no database, no auth, no analytics.

**Live at <https://vinea-site.vercel.app>** — a preview URL on its own Vercel
project. `getvinea.nl` still points at the previous site and has not been
touched; moving it here is a manual step, written out below.

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

Other commands:

```bash
npm run build        # production build; must finish with no warnings
npm run lint         # ESLint; must finish silent
npm run audit:copy   # content-rule check, run after a build
npm start            # serve the production build locally

# responsive, reveal and motion check against a running server
npm run check:responsive -- http://localhost:3000
```

`check:responsive` drives headless Chrome at phone and desktop width and
asserts four things that source review does not catch: no element left
invisible after a full scroll (including when scrolling starts before
hydration), no horizontal overflow, no layout shift, and no digits in visible
or screen-reader text. It needs a Chrome binary and skips cleanly without one.

## Where the copy lives

**All prose is in `src/content/`.** Components read from it and never inline
their own sentences, so text can be changed in one place without touching JSX.

| File            | What it holds                                              |
| --------------- | ---------------------------------------------------------- |
| `site.ts`       | Name, meta title and description, nav labels, footer links |
| `hero.ts`       | Heading, lead, the honesty note, the two calls to action   |
| `method.ts`     | How we work: the steps, what is asked, heard and discarded |
| `tasks.ts`      | The candidate jobs, and what has been ruled out and why    |
| `platform.ts`   | What that points to, and the note on cost                  |
| `objections.ts` | The grower objection, what can be answered, the blockers   |
| `status.ts`     | Where the project stands; what exists and what does not    |
| `contact.ts`    | The grower and investor lanes                              |
| `types.ts`      | The shape of all of the above                              |

Editing a string in any of those files changes the page. TypeScript will
reject a missing or misshapen field at build time.

### The content rules are checked, not just trusted

The site carries no numbers at all — no figures, no percentages, no durations,
no years. After a build, `npm run audit:copy` reads the *rendered* HTML (so
anything hardcoded in JSX is caught too) and exits non-zero if a digit reaches
visible text. It checks `aria-label`, `alt` and `title` as well, since text a
screen reader speaks is text on the site. It also reports, for reading rather than failing, any use of
"one"/"two", pivot language, load-bearing adjectives and traction phrases.

```bash
npm run build && npm run audit:copy
```

## Pointing getvinea.nl at this project

**This is deliberately not done.** The domain currently serves a different,
pre-existing Vercel project and nothing here has touched it or its DNS.

Current state, for reference:

- Project **`vinea-website`** holds both `getvinea.nl` and `www.getvinea.nl`
- `getvinea.nl` redirects to `www.getvinea.nl` with a 308
- This repo deploys to the separate project **`vinea-site`**

Both projects are in the same Vercel team, so the domain moves between them
without any DNS change — the nameserver and record setup stays exactly as it
is. The steps, in order:

1. Open <https://vinea-site.vercel.app> and confirm you are happy with it.
2. In the Vercel dashboard, go to **`vinea-website` → Settings → Domains**.
   Remove `www.getvinea.nl`, then remove `getvinea.nl`. Removing the www one
   first avoids leaving the apex redirecting to a domain that is no longer
   attached to anything.
3. Go to **`vinea-site` → Settings → Domains**. Add `www.getvinea.nl` first
   and let it verify.
4. Then add `getvinea.nl`, and set it to **redirect to `www.getvinea.nl`** with
   status **308**, which is how it is configured today.
5. Check both `https://getvinea.nl` and `https://www.getvinea.nl`. The apex
   should 308 to www, and www should serve this site.

Certificates are issued automatically once each domain verifies. There is a
short window between step 2 and step 4 where the domain resolves to nothing;
doing it in one sitting keeps that to a minute or so.

To undo, do the same in reverse — the old project is untouched and its
deployments are all still there.

`metadataBase` in `src/app/layout.tsx` is already set to `https://getvinea.nl`,
so canonical and Open Graph URLs are correct the moment the domain moves. No
code change is needed as part of the switch.

## How the page is drawn

The site is a technical drawing: near-white ground, hairline rules, one signal
colour, and plates with registration marks at their corners.

- `MachineSchematic.tsx` is the side elevation in the hero, annotated with the
  parts the argument rests on. It ships complete and is only ever *undrawn*
  from JavaScript, so it is never a blank frame.
- `ToolHead.tsx` draws the tool for each candidate job.
- `CropField.tsx` is the monospace field behind the hero — each glyph a plant.
- `Reveal.tsx` wraps GSAP ScrollTrigger. Content ships visible and is hidden
  before paint, so a reveal that never runs cannot strand it.
- `SmoothScroll.tsx` sets up Lenis and hands scroll updates to ScrollTrigger.
  Under reduced motion Lenis is never constructed at all.

Photograph and typeface credits are in [CREDITS.md](./CREDITS.md).

## Notes

Judgement calls made during the build, including one place where the brief
contradicted itself, are written up in [DECISIONS.md](./DECISIONS.md).
