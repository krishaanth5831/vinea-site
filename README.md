# Vinea site

The Vinea site: a home page, the pitch deck at `/deck`, and an ROI
calculator for growers at `/roi`, all built from static, typed content.

Next.js (App Router) with TypeScript, Tailwind v4, GSAP and Lenis, deployed on
Vercel. No CMS, no auth, no analytics. The one thing stored is an ROI
estimate a reader chooses to save, in a private Vercel Blob store.

**Live at <https://www.getvinea.nl>**, served by the Vercel project
`vinea-site`, which deploys from `main`. A push to `main` is a production
deploy to the live domain, so work happens on a branch and reaches `main`
by pull request.

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
npm run check:roi    # the ROI model's numbers add up
npm start            # serve the production build locally

# responsive, reveal and motion check against a running server
npm run check:responsive -- http://localhost:3000

# reprint public/vinea-deck.pdf from /deck, against a running server
npm run export:deck -- http://localhost:3000
```

To watch it: `npm run dev`, then open <http://localhost:3000/deck> and scroll,
or press the arrow keys, and <http://localhost:3000/roi> and move a slider.

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
| `deck.ts`     | The pitch deck, slide by slide, with sources and drawings  |
| `roi.ts`      | Every label, help line and source on the calculator        |
| `types.ts`    | The shape of all of the above                              |

The calculator's defaults and arithmetic are in `src/lib/roi.ts`, not in
`/content`, because the save route runs the same model on the server.

Keep it short. The page is meant to be read in under a minute.

Editing a string in any of those files changes the page. TypeScript will
reject a missing or misshapen field at build time.

### The content rules are checked, not just trusted

The site carries no numbers — no figures, no percentages, no durations,
no years — with one deliberate exception: the deck's slides and the ROI
calculator, where figures are the point. Those regions carry `data-numbers`
in the markup, and both checks cut them out before looking. Every other line
of every page, including the opening prose of `/deck` and `/roi`, is held to
the rule. After a build, `npm run audit:copy` reads the *rendered* HTML (so
anything hardcoded in JSX is caught too) and exits non-zero if a digit reaches
visible text. It checks `aria-label`, `alt` and `title` as well, since text a
screen reader speaks is text on the site. It also reports, for reading rather than failing, any use of
"one"/"two", load-bearing adjectives and traction phrases.

```bash
npm run build && npm run audit:copy
```

## ROI estimates: where they go and how to read them

A reader who presses **Save estimate** on `/roi` sends their inputs, and
any contact details they chose to give, to `POST /api/roi`. The route works
the result out again on the server and stores one JSON file per estimate
under `roi/` in a **private** Vercel Blob store connected to this project.
Private means no file has a public URL. No IP address, cookie or user agent
is kept; an email is only accepted with the consent box ticked.

**To read them:** open <https://www.getvinea.nl/api/roi/export> in a browser.
It asks for a password: any user name, and the value of `ROI_EXPORT_KEY` as
the password. You get a CSV with one row per estimate, every input
(including which modules were switched on), the result, and the contact
fields. Add `?format=json` for the raw records.

- Each row also has a `changed` column: the inputs the reader actually
  touched. Anything not listed there is still the calculator's default, and
  role, country, crop and heating pipes read `unanswered` until chosen.
- Locally `ROI_EXPORT_KEY` lives in `.env.local`, which git ignores. Without
  it, the export route answers 404.

**Setup still to do in the Vercel dashboard, before this reaches `main`.**
The API connection could not create the store (it returned 403), and
without a store a production save answers 503:

1. **Storage → Create → Blob.** Name it `vinea-roi-estimates`, access
   **Private**, region **Frankfurt (fra1)**. Connect it to `vinea-site` for
   **Production** and **Preview**. Its credentials then reach the functions
   on their own (`BLOB_STORE_ID` and OIDC); nothing to copy by hand.
2. **vinea-site → Settings → Environment Variables.** Add `ROI_EXPORT_KEY`,
   type **Sensitive**, for Production and Preview. Use the value from
   `.env.local`, or any long password of your own.
3. **Prove it on a preview:** save one estimate on the branch's preview URL,
   open `/api/roi/export` there, see the row, then delete that file in the
   store's browser.
- In `npm run dev`, without Blob credentials, saves go to
  `.data/roi-submissions.jsonl` instead, so local testing never writes to
  the live store. `next start` without credentials refuses to save.
- To delete someone's data on request: find their file in the Blob store in
  the Vercel dashboard (Storage → the store → Browser, folder `roi/`) and
  delete it.

## Pointing getvinea.nl at this project

*Done: both domains moved to `vinea-site` in October 2026. The steps are
kept for reference, and for undoing it.*

The domain used to serve a different, pre-existing Vercel project.

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

## The deck and the calculator

`/deck` is the pitch deck, "Vinea Pitch Deck v5 Send" from the vault, trimmed
for a public page (see DECISIONS.md). On a screen at least `64rem` wide and
`37.5rem` tall, with motion allowed, the slides are a sticky stack: each
holds while the next rises over it and the one beneath settles back. Each
slide's headline rises out of its masks, its text follows, and its drawing
assembles from the mark's cells. A rail on the right jumps between slides,
and the left and right arrow keys step through them. Everywhere else the
same markup is a plain run of full-bleed slides that reveal as they arrive.
The gate is in `.deck` CSS and `STAGED` in `deck/Deck.tsx`; keep them equal.

`public/vinea-deck.pdf` is printed from `/deck` by `npm run export:deck`, so
it always says what the page says. Reprint it after any change to `deck.ts`.

`/roi` follows the shape of eternal.ag's calculator, made for Vinea: the
greenhouse, then SPINE and the four modules as switches, each with its share
of crop hours and how much of the job robots take over, then the
assumptions. Every default is tagged as sourced (with a link), the reader's
estimate, or provisional. Vinea's cost is a share of the labour it replaces,
never a price. The summary stays in view beside the inputs; on a phone, a
bar at the foot of the screen carries the headline figure instead. The
model and its formulas are in `src/lib/roi.ts`, and `npm run check:roi`
proves that every total on the page adds up from its lines.

Moving between pages runs a cross-document view transition where the browser
supports one; the header stays put while the page beneath it changes.

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
