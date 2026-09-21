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

**Light only.** A neutral base plus a single accent was specified; a dark
theme was not. `color-scheme: light` is set so browsers do not tint form
controls. Adding a dark theme later means adding tokens, not restructuring.

**Instrument Serif for display, Inter for text**, both self-hosted through
`next/font`. One display face, one text face, as specified.

**Tailwind v4**, which is what `create-next-app` installs. There is no
`tailwind.config.js`; the tokens live in `@theme` in `src/app/globals.css`.

**Above-the-fold motion is CSS, not Framer Motion.** Framer Motion sets its
initial state after hydration, which left the hero heading at zero opacity and
delayed the largest contentful paint. Framer Motion still drives every
scroll-triggered reveal, which is where it earns its place.

**The reveal observer root extends far upward.** Reveals fire once, so a
reader who loads the page and flicks straight down could outrun hydration and
strand whole sections invisible. Anything already above the viewport now
reveals as soon as its observer attaches.

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
