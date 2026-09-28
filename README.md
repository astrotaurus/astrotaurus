# AstroTaurus website

A single-page, responsive static website ready for GitHub Pages. Open `index.html` to preview it locally. The site has no ChatGPT branding, subscription, or required build step.

## Before accepting orders

Edit `config.js` with four real values:

- `intakeEndpoint`: a form endpoint that accepts a JSON `POST` and sends you the submitted birth information. A Formspree form endpoint is one option. Create the form in your own account and verify delivery with a test submission. Since these are personal details, review the form service's privacy settings and retention.
- `birthChartPaymentUrl`: the hosted PayPal payment link for the $15 birth chart reading.
- `compatibilityPaymentUrl`: the hosted PayPal payment link for the $25 compatibility reading.
- `contactEmail`: an address for customer questions. If omitted, the contact link is hidden.

Do not enter account passwords or secret API keys in `config.js`. It is a public file. The website sends the details first, then opens the corresponding hosted checkout. Match the customer's payment to their intake by email and reading type in your accounts. If a link is missing, the order form displays “Ordering is not open yet” and does not submit anything. This prevents a partial order from appearing successful.

The site does not process payment or store card information. It does not automatically verify payment, email a confirmation, or send the final reading. Handle those in your form and payment accounts until you add an integrated order system. The 3–4 day estimate starts after both payment and complete birth details arrive. Update the wording if your delivery practice changes.

## Publish with GitHub Pages

1. Create a public GitHub repository named `astrotaurus` in your account.
2. Upload **the contents** of this folder (`index.html`, `styles.css`, `script.js`, `config.js`, and `assets`) to the repository's root.
3. In repository **Settings → Pages**, select **Deploy from a branch**, branch **main**, folder **/(root)**, then save.
4. Your free URL will normally be `https://YOUR-USERNAME.github.io/astrotaurus/`. Check the actual Pages URL shown by GitHub.
5. On the published site, test both reading forms with your own details. Confirm that the submission arrives and that each checkout goes to the correct amount. Test on a phone too.

The preview card in the “A look inside” section is a clearly labeled format illustration. Replace it with real redacted sample pages later if you want to show actual reading content.
