# Destion website starter

A responsive, static one-page website for the Destion journey-coordination concept.

## Files
- `index.html` — main website
- `styles.css` — responsive design
- `script.js` — mobile navigation and enquiry form
- `privacy.html` / `terms.html` — starter policy pages that need legal review

## Before publishing
1. Open `script.js` and replace `YOUR_EMAIL_ADDRESS` with a real, monitored business email.
2. Update the service area, contact details, service descriptions and any claims to match what Destion can actually deliver.
3. Review the privacy notice and terms with an India-qualified lawyer. The supplied pages are starter text, not legal advice.
4. Do not promise confirmed rides, companions, hospital appointments, insurance or emergency response unless those services are actually arranged and compliant.
5. The form currently opens the visitor's email app. It does not send data to a server. For a hosted enquiry form, connect a form provider or backend and publish an appropriate privacy notice.

## Preview locally
Open `index.html` in a browser.

## Deploy free on Cloudflare Pages
1. Create a Cloudflare account.
2. Create a GitHub repository and upload all files in this folder, or use Cloudflare Pages direct upload if available in your dashboard.
3. In Cloudflare, go to **Workers & Pages → Create → Pages** and connect the repository / upload the static files.
4. For a plain HTML site, use no build command and set the output directory to the folder containing `index.html` (for a repository root, use `/` or the dashboard's root setting).
5. Deploy. Cloudflare will assign a `*.pages.dev` address if the project name is available.
6. Test the site on mobile and desktop, and test the enquiry form after setting the email address.

## Brand notes
The website uses a dark navy, warm ivory and soft green palette with a calm, premium editorial style. The current copy positions Destion as a journey coordination service rather than claiming to be a transport operator or aggregator.
