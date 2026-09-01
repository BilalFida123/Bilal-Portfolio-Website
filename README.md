# Muhammad Bilal Fida — Portfolio

A clean, static HTML/CSS/JS portfolio website. No build step, no framework,
no external libraries — ready to deploy as-is.

## ⚠️ One step before contact form works

The contact form uses [Web3Forms](https://web3forms.com) (free, no backend
needed) to actually deliver messages to your inbox. To activate it:

1. Go to https://web3forms.com and enter your email — it instantly gives
   you a free **Access Key** (no account/signup required).
2. Open `index.html`, find this line near the contact form:
   `<input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY"/>`
3. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with the key you were given.
4. Save, commit, push — Vercel redeploys automatically.

Until you do this, the form will show a message asking you to connect it,
instead of silently failing.

## Before going fully live

Once you know your final domain (custom domain or the `.vercel.app` one
Vercel assigns), update these 3 files — search and replace
`bilal-fida-portfolio.vercel.app` with your real domain:

- `index.html` (canonical link, Open Graph tags, Twitter tags, JSON-LD)
- `robots.txt`
- `sitemap.xml`

## Folder structure

```
portfolio/
├── index.html
├── 404.html               (custom not-found page)
├── robots.txt
├── sitemap.xml
└── assets/
    ├── css/main.css
    ├── js/main.js          (theme toggle, drawer, carousel, contact form)
    ├── img/                (logos incl. WebP versions, favicons, photos)
    ├── fonts/               (self-hosted Inter + Space Grotesk)
    ├── site.webmanifest
    └── bilal-fida-resume.pdf
```

## Deploy: GitHub → Vercel

1. Create a new **empty** GitHub repository (don't initialize with a
   README — you already have one).
2. From this folder, run:
   ```
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
3. Go to https://vercel.com → **Add New Project** → **Import** your GitHub repo.
4. Framework preset: **Other** (it's static — no build command needed).
   Root directory: leave as `/` (this folder should be the repo root).
5. Click **Deploy**. Vercel gives you a live `https://<something>.vercel.app`
   URL within about a minute.
6. Every future `git push` to `main` auto-redeploys.

Optional: attach a custom domain for free under
**Project → Settings → Domains** once you have one — then update the 3
files listed above to match it.
