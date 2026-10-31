# Sia’s Arangetram — editor guide

## Confirmed event details

- Saturday, April 24, 2027, Toronto local time.
- 4:00–4:30 PM: guest arrival, welcome and refreshments.
- 4:30–7:30 PM: Arangetram including a 30-minute intermission.
- Intermission start: TBA; do not invent a start time.
- 8:00 PM onwards: vegetarian dinner.
- Fairview Library Theatre, 35 Fairview Mall Drive, Toronto, ON M2J 4S4.
- Musicians, special guest, final repertoire and parking guidance: TBA.
- Address source: https://tpl.ca/locations/fv/

## Editing

Page structure and English fallback: `index.html`.
English and Bengali copy: `i18n.js`. Update both, as JavaScript replaces the fallback text.
Layout: `styles.css`. Interactions and countdown: `script.js`.
Keep the existing hero photo and mobile photograph-above-text layout.
No guest directory, sample names, attendee counts or public editor notes.
Use visitor-facing “Coming soon” cards for future media. Do not show developer instructions.

## Images

- `images/hero-sia.webp`: current hero, converted from the approved PNG with the full frame preserved.
- `images/sia-portrait.jpeg`: supplied Sia_1.jpeg, unchanged.
- `images/sia-dance-2.jpeg` through `sia-dance-4.jpeg`: supplied portraits, unchanged.
- `images/guru-sanjukta-20260908.webp`: the supplied Guru photograph, with its full frame preserved.
- Photos use natural proportions so faces, hands and feet are not cropped.
- New rehearsal/event photos and the recording are pending; no invented media.

## RSVP — Evite

`site-config.js` points `rsvpUrl` to https://evite.me/s9N9E7t89p for the verified Sia Arangetram invitation. Evite stores attendance and adult/child counts privately. Yes and No are enabled; Maybe is disabled. A link click is never presented as a completed RSVP. Guests must submit their reply on Evite and check their total party size, including themselves.

Evite has its own RSVP controls; this integration does not claim a custom conditional dropdown or automatic synchronization of Evite-native comments. The invitation links to the shared website blessings form. Do not create a second attendance database.

Organizer notification delivery to all requested addresses has not been verified. Do not claim email delivery based on a saved RSVP or stored blessing alone.

## Publishing

Push changes to `main`; GitHub Pages publishes them to https://shivanshi.ca/.
Update asset query versions after changes and verify both languages after a reload.
Use the previous GitHub commit if a rollback is needed; do not force-push shared history.


## Home screen installation
Share https://shivanshi.ca/#install. Android supports a browser install prompt when available; iPhone shows Safari Add to Home Screen instructions. English and Bengali supported. The worker caches only the offline notice so event information stays fresh. Device installation requires physical-device verification.

Guru image updated from the supplied Guru pic.png, converted to WebP without cropping. Browser favicon and header dancer use Twemoji graphics by Twitter and contributors, licensed CC BY 4.0: https://github.com/jdecked/twemoji and https://creativecommons.org/licenses/by/4.0/.

## Blessings wall — shared service

Both the website form and the Evite “Send a blessing” link use the same service at https://sia-blessings.toastybug.chatgpt.site. `SITE_CONFIG.blessingsApiOrigin` configures the website API origin. GitHub Pages remains the main website host. `blessings.json` is no longer read by the page.

Submission: name plus 1–200 words, optional consent to public display. The server enforces limits and stores all notes privately in D1. Unchecked consent creates a private note. Checked consent creates a pending note; it appears on the public wall only after approval. No raw HTML from guests is rendered. Honeypot, expiring challenge, size limits and rate limits reduce spam.

Family review: https://sia-blessings.toastybug.chatgpt.site/admin. Sign in with ChatGPT using one of the three organizer email accounts configured in the service. The server checks authenticated identity for every admin operation. The public API exposes only names, messages and submission timestamps of approved, consented notes. Private and pending notes are never stored in the public GitHub repository. Approval can be reversed using Hide; private notes cannot be approved.

The review dashboard is shared organizer access, not email notification delivery. Email notifications require a separate verified mail integration.

Service source and migrations are maintained in the Sites project `appgprj_6ae52d83ed1c819187049c3e93a4e2d6`. Do not modify applied migrations or put guest records in source files. Empty guestbook is intentional; do not seed invented guest blessings.

## Privacy-friendly analytics — activation pending

analytics.js supports Cloudflare Web Analytics without cookies and respects Do Not Track and Global Privacy Control before loading the beacon. It is OFF by default; no analytics requests are sent with a blank site token. An organizer-owned Cloudflare Web Analytics site must be set up for shivanshi.ca. Supply its public beacon token in SITE_CONFIG.analyticsToken (never an API secret), then test an authorized visit and confirm it appears in the dashboard. The feature is not operational until that token and dashboard check are complete.

Setup reference: https://developers.cloudflare.com/web-analytics/get-started/

## September 8 site improvements

Each numbered task was committed independently. Canonical URL, Open Graph metadata, event JSON-LD, .ics/Google calendar links, image navigation, mobile focus, lazy Bengali fonts/translations, skip link, off-screen rendering and before/after gallery tabs are implemented. Gold highlights use different shades for dark and light surfaces to preserve contrast.

Pending: Cloudflare Web Analytics public site token and dashboard verification. Social URL placeholders are intentionally empty until real profile links are supplied.

Checks: JavaScript syntax; English/Bengali key coverage; unique HTML IDs and anchor targets; event timestamps and calendar CRLF; image dimensions; numeric colour contrast; disabled/Do Not Track/Global Privacy Control analytics behavior. No physical-phone or browser UI test was performed.

