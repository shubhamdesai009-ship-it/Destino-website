# Destino website starter

A responsive, static one-page website for the Destino journey-coordination concept.

## Files
- `index.html` — main website
- `styles.css` — responsive design
- `script.js` — mobile navigation and enquiry form
- `privacy.html` / `terms.html` — starter policy pages that need legal review

## Before publishing
1. The displayed contact email is set to `shubham.desai009@gmail.com`.
2. The contact form is configured to submit to `https://formspree.io/f/xpppjkev`. The intended recipient inbox is `shubham.desai009@gmail.com`.
3. In your Formspree account, confirm that this form endpoint is configured for `shubham.desai009@gmail.com` and that the recipient email has been verified. The website code cannot change the recipient setting inside Formspree.
4. Submit a test enquiry after deploying and confirm it arrives in the inbox (also check Spam).
2. Update the service area, contact details, service descriptions and any claims to match what Destino can actually deliver.
3. Review the privacy notice and terms with an India-qualified lawyer. The supplied pages are starter text, not legal advice.
4. Do not promise confirmed rides, companions, hospital appointments, insurance or emergency response unless those services are actually arranged and compliant.
5. The form uses Formspree once the endpoint ID is configured. Formspree must be configured to deliver submissions to the verified recipient inbox.

## Preview locally
Open `index.html` in a browser.

## Deploy free on Cloudflare Pages
1. Create a Cloudflare account.
2. Create a GitHub repository and upload all files in this folder, or use Cloudflare Pages direct upload if available in your dashboard.
3. In Cloudflare, go to **Workers & Pages → Create → Pages** and connect the repository / upload the static files.
4. For a plain HTML site, use no build command and set the output directory to the folder containing `index.html` (for a repository root, use `/` or the dashboard's root setting).
5. Deploy. Cloudflare will assign a `*.pages.dev` address if the project name is available.
5. Test the site on mobile and desktop, then submit a test enquiry and confirm it arrives at the recipient inbox.

## Brand notes
The website uses a dark navy, warm ivory and soft green palette with a calm, premium editorial style. The current copy positions Destino as a journey coordination service rather than claiming to be a transport operator or aggregator.


## Contact options
- Website enquiries are submitted through Formspree at `https://formspree.io/f/xpppjkev`.
- The intended enquiry inbox and direct email contact are `shubham.desai009@gmail.com`.
- The website includes a direct email link (`mailto:`) and a WhatsApp contact link for `+91 7709082055`.
- Direct email links open the visitor's configured email app; the enquiry form continues to use Formspree.
