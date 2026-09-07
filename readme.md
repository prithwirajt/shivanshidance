# 🌸 Sia's Arangetram Website — Guide

A single-page website celebrating **Shivanshi "Sia" Thakur's** Bharatanatyam Arangetram.
**April 24, 2027 · 4:00 PM · Fairview Library, Toronto.**

## 📁 Files
| File | What it's for |
|------|---------------|
| `index.html` | All the page content & structure |
| `styles.css` | Colours, fonts, layout (maroon & gold theme) |
| `script.js` | Countdown, RSVP form, guest list, search & language switching |
| `i18n.js` | **All English + Bengali (বাংলা) translations** |
| `images/` | Put all your photos here |

## 🌐 English / Bengali language toggle
- Click the **EN | বাং** button in the top navbar to switch the whole site instantly.
- The choice is remembered on the visitor's device (so returning guests keep their language).
- Bengali automatically uses beautiful Bengali-script fonts (Hind Siliguri + Baloo Da 2).

### ✏️ To refine any Bengali (or English) wording
Open **`i18n.js`**. Every line looks like:
```
event_food_h: { en: "Refreshments", bn: "আপ্যায়ন" },
```
Just edit the text inside the quotes — `en` for English, `bn` for Bengali.
You can safely keep HTML tags like `<strong>`, `<em>`, `<br />`. That's it!

## ▶️ How to view it
Just double-click `index.html` — it opens in any web browser. No setup needed.

## ✏️ How to refine it every day
Everything you can edit is marked in the code with a **✎ pencil note**. Common edits:

### 1. Add your photos (replacing placeholders)
- Drop photos into the `images/` folder.
- **Sia's portrait:** name it `sia-portrait.jpg`, then in `index.html` replace the
  `<div class="photo-placeholder portrait">…</div>` under *About Sia* with:
  `<img src="images/sia-portrait.jpg" alt="Sia" style="width:100%;border-radius:16px" />`
- Do the same for the Guru photo (`guru-sanjukta.jpg`) and gallery tiles.

### 2. Update the guest list (250+ names)
Open `script.js`, find `GUEST_LIST = [ … ]` near the top, and paste your real names.
The built-in **search box** and **live counter** work automatically.

### 3. After the event — add the YouTube recording
In `index.html`, find the *Gallery* section. Delete the `video-placeholder` block and
un-comment the `<iframe>` just below it, replacing `VIDEO_ID` with your YouTube video ID.

### 4. Make the RSVP form save responses for real
Right now RSVPs show a thank-you message and appear in the guest list on that device.
To collect them permanently, connect a free service (Formspree / Google Forms / Netlify Forms).
There's a ready-to-use `fetch()` snippet in `script.js` — just add your form ID.

## 🚀 Putting it online (free options)
- **Netlify Drop** — drag the whole folder onto app.netlify.com/drop → instant live link.
- **GitHub Pages** — upload the folder to a repo and enable Pages.
- **Cloudflare Pages / Vercel** — similar drag-and-drop deploys.

---
Made with ❤️ and devotion to dance. Ask anytime to refine or add features!
