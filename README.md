# Evelyn Gutierrez Photography

Static portfolio site for `www.evelyngutierrez.com`.

## Local preview

```bash
npm install
npm start
```

Then open `http://localhost:3000` or the port shown by `serve`.

## Deployment options

### Option 1: Netlify
1. Create a GitHub repo and push this project.
2. Connect the repo to Netlify.
3. Set the build command to `npm run build` if you add a build step, or leave it blank.
4. Set the publish directory to `/`.
5. On Netlify, add a custom domain: `www.evelyngutierrez.com`.
6. Add a DNS record in your domain provider:
   - `CNAME www` -> `your-netlify-site.netlify.app`
   - optionally `ALIAS` or `A` records for root domain if you want `evelyngutierrez.com`.

### Option 2: Vercel
1. Create a GitHub repo and push this project.
2. Import the repo into Vercel.
3. Use no build command for static files and set the root directory to `/`.
4. Add the custom domain `www.evelyngutierrez.com` in Vercel.
5. Update your DNS:
   - `CNAME www` -> `cname.vercel-dns.com`

### Option 3: GitHub Pages
1. Create a GitHub repo and push this project.
2. In repo settings, enable GitHub Pages from the `main` branch.
3. Add the custom domain `www.evelyngutierrez.com` in GitHub Pages settings.
4. Update your DNS:
   - `CNAME www` -> `USERNAME.github.io`

## Notes

- The contact form uses FormSubmit.co and sends inquiry emails directly from the website.
- If you want the root domain to also work, set up DNS for `evelyngutierrez.com` and redirect to `www` or configure your host.
# evelyngutierrez
