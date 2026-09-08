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

## RSVP — activation still requires the event details

The previous form only saved names in each guest’s browser and showed a false confirmation. It has been removed, along with guest-list rendering. No RSVP personal data is collected in the pending state.

`site-config.js` contains an empty `eventbriteUrl`. Once the organizer provides and verifies the actual HTTPS Eventbrite event URL, set that value. The page then reveals the Eventbrite registration link. It never displays a submission-success message when someone merely opens that link. Until then it honestly says registration is not open.

Before enabling registration:

1. Create or identify the correct event in the organizer’s Eventbrite account, matching the confirmed date, address and schedule. Set ticket capacity and order limits with the organizer.
2. Capture name and email in the Eventbrite order form. Use ticket quantity as attendee count, with one ticket per person attending.
3. Add an optional text question for wishes, notes and dietary needs. Verify whether it is collected per order or per attendee.
4. Configure organizer order notifications to the organizer’s selected email and verify delivery. No organizer email has been provided yet.
5. Decide how declines will be recorded. Do not create a ticket order for a person who is not attending. Eventbrite registration alone has not been verified to capture accept/decline responses. A separate organizer-approved reply form/service may be required.
6. Test a registration with consent: verify saved name, email, quantity, notes, attendee confirmation and organizer receipt. Test cancellation/decline using the agreed reply method.
7. Activate the link only when the appropriate flow works. Never expose account tokens in HTML, JavaScript or GitHub.

This release does NOT claim live Eventbrite registration, saved responses, organizer email delivery or decline capture. Those require the event link and organizer-side setup.

References:
- https://www.eventbrite.com/help/en-us/articles/347218/how-to-sell-eventbrite-tickets-on-your-website-through-an-embedded-checkout/
- https://www.eventbrite.com/help/en-us/articles/228823/how-to-create-custom-questions-for-attendees/

## Publishing

Push changes to `main`; GitHub Pages publishes them to https://shivanshi.ca/.
Update asset query versions after changes and verify both languages after a reload.
Use the previous GitHub commit if a rollback is needed; do not force-push shared history.


## Home screen installation
Share https://shivanshi.ca/#install. Android supports a browser install prompt when available; iPhone shows Safari Add to Home Screen instructions. English and Bengali supported. The worker caches only the offline notice so event information stays fresh. Device installation requires physical-device verification.

Guru image updated from the supplied Guru pic.png, converted to WebP without cropping. Browser favicon and header dancer use Twemoji graphics by Twitter and contributors, licensed CC BY 4.0: https://github.com/jdecked/twemoji and https://creativecommons.org/licenses/by/4.0/.

## Blessings wall — collection not yet enabled

The page reads reviewed, permission-approved messages from blessings.json. It currently contains no messages. Never put unreviewed messages, contact details, or consent records in this public JSON. Publish only first name and message after obtaining consent; remove a published item on request.

Before enabling SITE_CONFIG.blessingsFormUrl, the organizer must choose and configure a secure submission service with spam protection, private storage, moderation and consent to public display. Test a real authorized submission and organizer retrieval first. Only then set the approved HTTPS form URL. The site never claims clicking this link saves or publishes a message. GitHub Pages does not process form submissions.

## Privacy-friendly analytics — activation pending

analytics.js supports Cloudflare Web Analytics without cookies and respects Do Not Track and Global Privacy Control before loading the beacon. It is OFF by default; no analytics requests are sent with a blank site token. An organizer-owned Cloudflare Web Analytics site must be set up for shivanshi.ca. Supply its public beacon token in SITE_CONFIG.analyticsToken (never an API secret), then test an authorized visit and confirm it appears in the dashboard. The feature is not operational until that token and dashboard check are complete.

Setup reference: https://developers.cloudflare.com/web-analytics/get-started/

## September 8 site improvements

Each numbered task was committed independently. Canonical URL, Open Graph metadata, event JSON-LD, .ics/Google calendar links, image navigation, mobile focus, lazy Bengali fonts/translations, skip link, off-screen rendering and before/after gallery tabs are implemented. Gold highlights use different shades for dark and light surfaces to preserve contrast.

Pending: organizer-approved blessings submission/moderation service; Cloudflare Web Analytics public site token and dashboard verification. Social URL placeholders are intentionally empty until real profile links are supplied.

Checks: JavaScript syntax; English/Bengali key coverage; unique HTML IDs and anchor targets; event timestamps and calendar CRLF; image dimensions; numeric colour contrast; disabled/Do Not Track/Global Privacy Control analytics behavior. No physical-phone or browser UI test was performed.
