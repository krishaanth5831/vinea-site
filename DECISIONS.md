# Decisions

Judgement calls made while building this, recorded so they can be argued with
later. Written during an autonomous build, so nothing here was confirmed first.

## Copy

**The brief contradicts itself about the grower ask, and rule one wins.**
The sections list asks for "an honest ask for 40 minutes of their real
problems". Hard content rule one bans every number on the site and names hours
explicitly. Rule one is labelled hard and stated absolutely, so the ask is
expressed qualitatively instead — "a short, bounded conversation". If the
intent was that a concrete duration is worth the exception, this is the one
line to change, in `src/content/contact.ts`.

**"One" is allowed where it means "a single".**
Rule one targets figures: digits, durations, currency, counts, percentages,
years. It is not read as banning the word one, since the brief's own sanctioned
phrasing is "one chassis in the aisle". Actual counts were removed — a contact
heading reading "Two different conversations" was cut for this reason, and
"the most tractable of the five" became "on this list".

**No numerals anywhere, including as decoration.**
No section numbering, no copyright year in the footer, no dates beyond the
bare word August. `npm run audit:copy` fails the build check if any digit
reaches the rendered page.

**Traction claims appear only as denials.**
The phrases "design partners" and "letters of intent" do appear, but only in
the list of what does not exist. The audit flags them for reading rather than
failing on them.

## Structure

*Superseded by the rebuilds below — the nav is now What went wrong, The
question, Refusals.*

**One page with anchors, and the nav labels map like this.**
The brief gives five nav labels and seven sections, so the mapping is fixed
here rather than drifting:

| Nav label           | Anchor                       |
| ------------------- | ---------------------------- |
| what we're building | `#what-that-points-to`       |
| for growers         | `#for-growers`               |
| for investors       | `#for-investors`             |
| about               | `#where-this-stands`         |
| book a call         | `mailto:` — no anchor        |

The method, the task map and the pushback carry the argument but are not in
the nav, because the brief fixed the labels. The method is reachable from the
hero's second call to action; the other two by scrolling.

**The grower objection is not a testimonial.**
It renders as prose in the page's own voice, with no name, company, photograph
or quotation styling, because the brief rules out presenting any grower as an
endorsement or design partner.

## Design

*Superseded by the pivot rebuild below — dark by default, light on request.*

**Light only.** A neutral base plus a single accent was specified; a dark
theme was not. `color-scheme: light` is set so browsers do not tint form
controls. Adding a dark theme later means adding tokens, not restructuring.

*Superseded by the pivot rebuild below — Geist throughout, and no photographs.*

**Instrument Serif for display, Inter for text**, both self-hosted through
`next/font`. One display face, one text face, as specified.

**Tailwind v4**, which is what `create-next-app` installs. There is no
`tailwind.config.js`; the tokens live in `@theme` in `src/app/globals.css`.

**Above-the-fold motion is CSS, not JavaScript.** A JavaScript animation
library sets its initial state after hydration, which left the hero heading at
zero opacity and delayed the largest contentful paint. GSAP drives everything
below the fold, which is where it earns its place.

**The reveal observer root extends far upward.** Reveals fire once, so a
reader who loads the page and flicks straight down could outrun hydration and
strand whole sections invisible. Anything already above the viewport now
reveals as soon as its observer attaches.

## The redesign

The first build of this site was a quiet editorial page. It was rebuilt as a
technical drawing, taking its structure from boat.dev and its content from the
glasshouse.

**GSAP and Lenis replaced Framer Motion** rather than joining it. Running two
animation libraries would be two ways to do one job, and the scroll-driven
work this design wanted is what GSAP's ScrollTrigger is for.

**`scroll-behavior: smooth` had to go.** Lenis owns scrolling now, and the two
fight when both are on — the same CSS rule is what made an earlier round of
scroll testing behave strangely. Same-page links are handed to Lenis instead.

*Superseded by the pivot rebuild below — Geist throughout, and no photographs.*

**Typefaces and photographs came from the first version of the site.** General
Sans and IBM Plex Mono were already chosen there and already licensed, and the
glasshouse photography was already graded. They are credited in CREDITS.md,
which landed in the same commit as the files.

*Superseded by the pivot rebuild below — Geist throughout, and no photographs.*

**Photographs are confined to the task map**, framed and captioned like plates
in a manual. Line art is the stronger idea here and photography is the
optional one; if the two had fought, the photographs would have gone.

**No pinned or hijacked scrolling.** A pinned horizontal sequence was the
obvious thing to build with ScrollTrigger and the thing most likely to break at
phone width. The scroll-driven motion that survived is a marker travelling a
rail beside the task list, which degrades to nothing on a phone and under
reduced motion.

**The content rules still bind.** boat.dev's most copyable components — the
price block, the comparison bars — are number-carriers, and this site carries
no numbers. They were not ported. `npm run audit:copy` still fails on any digit
reaching visible or spoken text.

## The pivot rebuild

The site was cut down and restyled to say one thing: Vinea is back at square
one, talking to growers about what hurts and what today's machines miss.

*Superseded by the second rebuild below — five parts, told in the founder's
words.*

**Four sections, roughly two hundred words.** Hero, why the pivot, what
growers say today's machines get wrong, and the ask. The method, the task
map, the platform, the pushback and the status sections were removed, along
with their components and content files. The grower findings reuse the real
pushback from the old objections section — cutting vine instead of stem,
fruit off the truss, slower than a person, single-job machines standing idle,
capital risk and who fixes it mid-row. Nothing new was invented.

**The "pivot language" audit rule was removed.** It was written for the first
brief, which wanted no mention of a pivot. The pivot is now the message.
Digits are still banned; "one" in "square one" is flagged for reading and is
intended.

*Superseded by the second rebuild below — the caveman styling was taken out.*

**Styled after getcaveman.dev, without its green.** Near-black ground, Geist
and Geist Mono, pill buttons with an icon chip, hairline and dashed rules,
a starfield and rays, a two-tone headline and a scrubbed grey-to-white
statement. Its illustrations, logo wall, statistics and wording were not
copied. The accent is left out entirely — black and white for now, and adding
one later is a single token in `globals.css`.

**Dark is the default unconditionally**, not taken from the OS preference,
because that is what was asked for. A saved choice of light is applied by an
inline script at the top of `<body>`, before anything paints, and
`suppressHydrationWarning` on `<html>` lets it stand. The switch picks its
icon in CSS from `data-theme`, so server and client markup never differ, and
opens the new theme as a circle through the View Transitions API where it
exists.

**The logo is the diamond pixel mark chosen in June 2026**, from the "Final
Logo" note in the old Vinea vault. It is redrawn as SVG in `Mark.tsx` so it
takes `currentColor` and flips with the theme. The A in the wordmark has no
crossbar and is drawn, not typed: Geist has no Greek, and a typed lambda would
be read aloud as "lambda".

**Geist Pixel is self-hosted, Latin subset only.** Through `next/font/google`
it builds with a warning, since Next has no fallback metrics for it.

*The scrubbed statement described here was removed in the second rebuild.*

**Hero motion is still CSS; GSAP takes everything decorative or below the
fold.** The mark above the hero assembles from GSAP, hidden beforehand by a
`js` class the inline script sets, so it never flashes complete first. The
statement scrubs a colour-mix variable, never opacity, so no word is ever
unreadable.

## The second rebuild

The first pivot version copied getcaveman.dev too closely and read as a set
of effects rather than one story. It was rebuilt around the founder's own
account of the pivot, and around material only Vinea has: the mark.

**The narrative is the founder's, in the first person.** Growers said yes to
the robot; it was politeness, not pain; so the pitching stopped. Every call
now turns on one question — what automation have you already been shown, and
why didn't you buy it? — and the refusals so far are the findings. "I", not
"we", because it is one person making the calls.

**One through-line instead of many effects.** The mark comes apart and
collapses into the empty cell at its own centre — square one. A thread falls
from that square through the question and the refusals, and at the ask the
mark grows back out of it. Section openers are lengths of that thread.

**Caveman's pieces were removed**: the pill buttons with an icon chip, the
centred hero on a starfield, the glow, the rays, the dashed columns, the
two-tone headlines, the grey-to-white scrub and the accordion. The "we are
here" square field went with them. Buttons are square-cornered like the
mark's cells, with a fill that rises on hover and an arrow drawn in cells.

**One sticky stage, done in CSS.** The hero and the pivot share a
`position: sticky` stage inside a tall section, not a ScrollTrigger pin:
pin-spacers arrive after hydration, which risks layout shift, and fight
Lenis. The tall layout is gated in CSS on `.js`, motion allowed and a screen
at least 600px tall; anywhere else the same markup is a plain, readable
stack. `STAGED` in `Story.tsx` repeats the gate and the two must agree.

**The refusals stack as sticky cards**, each with a small looping drawing in
the mark's cells: the cut landing on the vine, a person outrunning the
machine, one busy column in an idle year, a machine stalled mid-row.

**The question types itself out, without reflowing.** The travelling cursor
is absolutely positioned and moved with transforms, and the resting cursor
holds its place in the line from the start. An inline cursor that moved
between characters shifted the heading's lines and failed the layout-shift
gate.

**One motion vocabulary**: `expo.out` for anything entering, `none` for
anything scrubbed, lines rising out of masks for headings. Lenis is a little
heavier (`lerp` 0.085), and every trigger is measured again once web fonts
have loaded.

## Deployment

**Deployed through the Vercel MCP connection, not the Vercel CLI.** The CLI is
not installed, there is no `VERCEL_TOKEN`, and `vercel login` is interactive,
so it could not be used unattended. The authenticated MCP connection to the
team `krishaanth-ramaraj` was used instead.

**The live site was not touched.** `getvinea.nl` and `www.getvinea.nl` are
attached to a separate, pre-existing Vercel project called `vinea-website`,
with the apex redirecting to www on a 308. That project was read to confirm
this and otherwise left alone. This build deploys to a new project,
`vinea-site`, on its own `.vercel.app` URL. Pointing the domain here is a
manual step, written out in the README.

**`metadataBase` is `https://getvinea.nl`.** Canonical and Open Graph URLs
describe where the site is intended to live, not the preview host. Nothing
about this affects the preview deployment.

## Left open

**The LinkedIn URL in the footer is a guess.** It is built from the name and
has not been opened or verified. It is one line in `src/content/site.ts`.

**Lighthouse was not run as a full audit.** The instrumented metrics that the
brief actually names were measured directly in headless Chrome instead: layout
shift is zero at both 390px and 1440px, and the largest contentful paint lands
at the same moment as the first contentful paint. A scored Lighthouse run
against the deployed URL is still worth doing.

**No analytics, no CMS, no database, no auth**, as specified. Vercel's own
analytics are not enabled either, since that is a dashboard toggle.
