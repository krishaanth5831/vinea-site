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

| File          | What it holds                                              |
| ------------- | ---------------------------------------------------------- |
| `site.ts`     | Name, meta title and description, nav labels, footer links |
| `hero.ts`     | Heading, lead, calls to action, the honesty line           |
| `why.ts`      | The three beats told while the mark comes apart            |
| `question.ts` | The one question, and why the refusals matter              |
| `heard.ts`    | The refusals so far                                        |
| `talk.ts`     | The closing ask and its two buttons                        |
| `types.ts`    | The shape of all of the above                              |

Keep it short. The page is meant to be read in under a minute.

Editing a string in any of those files changes the page. TypeScript will
reject a missing or misshapen field at build time.

### The content rules are checked, not just trusted

The site carries no numbers at all — no figures, no percentages, no durations,
no years. After a build, `npm run audit:copy` reads the *rendered* HTML (so
anything hardcoded in JSX is caught too) and exits non-zero if a digit reaches
visible text. It checks `aria-label`, `alt` and `title` as well, since text a
screen reader speaks is text on the site. It also reports, for reading rather than failing, any use of
"one"/"two", load-bearing adjectives and traction phrases.

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

Black and white. Dark is the default; the switch in the header flips to light
and remembers it. Colours are tokens in `src/app/globals.css`, one block per
theme, and nothing else names a colour.

The page is one line. The mark comes apart and collapses to square one, a
thread falls from that square through every section, and the mark grows back
at the end.

- `Mark.tsx` is the Vinea diamond and wordmark as SVG, in `currentColor`.
  `src/app/icon.svg` is the same mark as the favicon.
- `Story.tsx` is the hero and the pivot on one sticky stage. The layout is
  chosen in CSS before paint (see `.story` in `globals.css`); without motion,
  JavaScript or a tall enough screen it is a plain stack.
- `Thread.tsx` is a length of the line that opens each later section.
- `Question.tsx` types the question out as the thread reaches it.
- `StackCards.tsx` and `Glyph.tsx` are the refusals and their drawings.
- `RebuildMark.tsx` grows the mark back out of square one.
- `SplitReveal.tsx` raises headings line by line; `Reveal.tsx` fades the rest.
  Both ship content visible and only hide what is still below the fold.
- `HeaderShell.tsx` hides the header while scrolling down and draws the
  progress hairline.
- `SmoothScroll.tsx` sets up Lenis and hands scroll updates to ScrollTrigger.
  Under reduced motion Lenis is never constructed at all.

Typeface credits are in [CREDITS.md](./CREDITS.md).

## Notes

Judgement calls made during the build, including one place where the brief
contradicted itself, are written up in [DECISIONS.md](./DECISIONS.md).
