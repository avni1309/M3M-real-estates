# M3M Real Estates — Website (concept build)

A 5-page, responsive real-estate website themed in the m3mrealestates.com
green + blue + navy brand palette, with scroll animations, enquiry pop-ups,
WhatsApp/email lead capture, image galleries with lightbox, and live maps.

## Pages
- `index.html` ........ Home
- `about.html` ........ About M3M (story, founders, portfolio, timeline)
- `trump-tower.html` .. M3M Trump Tower — Sector 94, Noida (4 & 5 BHK)
- `jewelcrest.html` ... M3M Jewelcrest Avenue (retail / commercial)
- `contact.html` ...... Enquiry + site-visit form, contact details, map

Open `index.html` in any browser to view the site. No server needed.

## Folders
- `css/style.css` ..... All styling + the brand colour variables (top of file)
- `js/main.js` ........ All interactions + the CONFIG block (numbers/email/logging)
- `asset/` ........... Drop your project photos here (see below)

---

## 1) Add your images
Save these files into the `asset/` folder with these EXACT names:

| Filename                      | Where it appears                                             |
|-------------------------------|-------------------------------------------------------------|
| `asset/ (already added)` | Trump Tower hero banner, overview box, full gallery; Home card |
| `asset/ (already added)`  | Jewelcrest hero banner + overview box                        |

- Recommended size: ~1920×1080 (landscape), under ~500 KB each for speed.
- If you prefer .png or .webp, rename the references in the HTML (search for the
  filename) or just ask and it can be switched.
- Until a file exists, that spot shows a clean navy gradient fallback — nothing breaks.

To add more gallery photos, open `trump-tower.html` / `jewelcrest.html`, find the
`gallery-grid` section, and set each tile's `<img src="images/your-photo.jpg">`.

---

## 2) Set your contact details (one place)
Open `js/main.js` and edit the `CONFIG` block at the top:

```js
const CONFIG = {
  whatsappPrimary: '919711537566',  // WhatsApp leads go here (91 = India)
  whatsappAlt:     '919654694700',
  email:  'dhingrasachin1985@gmail.com',          // <-- REPLACE with your real enquiry email
  formEndpoint: ''                  // optional, see step 3
};
```

Phone numbers also appear in the footer/contact page HTML if you want to change
those labels too (search for `9711537566`).

## 3) (Optional) Log every lead to a sheet/inbox
By default, submitting a form (a) opens a pre-filled WhatsApp chat and (b) opens
an email draft. To ALSO save leads automatically:

1. Create a free form endpoint at https://formspree.io (or a Google Apps Script
   web-app URL).
2. Paste that URL into `formEndpoint` in `js/main.js`.

Leave it blank to skip — WhatsApp + email still work.

---

## Go-live checklist
- [ ] Add `trump-tower-hero.jpg` (and `jewelcrest-hero.jpg`) to `asset/`
- [ ] Replace `dhingrasachin1985@gmail.com` with your real email in `js/main.js`
- [ ] (Optional) Add a `formEndpoint` to log leads
- [ ] Pin the exact map location on `contact.html` (edit the `q=` in the iframe)
- [ ] FACT-CHECK all project figures (e.g. Trump Tower ₹17 Cr, 4 & 5 BHK, twin
      towers; M3M 65+ projects / 3,000+ acres) with the developer / RERA before
      publishing. These are indicative, from public marketing material.
- [ ] Use only images you are licensed to use.

## Note
This is an independent concept/demo site, not the official M3M website. All
trademarks belong to their respective owners. A disclaimer is included in the footer.
