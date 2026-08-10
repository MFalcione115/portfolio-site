# Portfolio site

Jekyll site built for GitHub Pages. Design concept: a "timeline" nav that
reads like an NLE track (clip blocks, timecodes, a scroll-driven playhead),
since the site is for a video editor. Dark screening-room palette — amber
(tungsten) + teal (scope) accents, not the default cream/terracotta or
near-black/acid-green look.

## Structure

```
_config.yml         site settings — title, description, email, social links
_layouts/default.html  the shared page shell: <head>, timeline nav, footer
index.html           the one-page site: hero, work, skills, about, contact
assets/css/main.scss  all styles + design tokens (colors/fonts as CSS vars in :root)
assets/js/main.js     scroll listener that drives the timeline playhead + active section
```

## Run locally

```bash
bundle install
bundle exec jekyll serve
```

Visit http://localhost:4000.

## Deploy on GitHub Pages

1. Push this repo to GitHub.
2. In the repo's Settings → Pages, set Source to "Deploy from a branch",
   branch `main`, folder `/ (root)`.
3. Your site will be live at `https://<username>.github.io/<repo-name>/`.
4. Update `url` and `baseurl` in `_config.yml` to match (baseurl is the
   `/<repo-name>` part if this isn't a `<username>.github.io` repo).

If you'd rather use a custom domain, add a `CNAME` file with the domain name
and point your DNS at GitHub Pages per their docs.

## Things to customize (marked `TODO` in the code)

- [ ] `_config.yml` — email, LinkedIn, Vimeo links
- [ ] `index.html` hero — swap the placeholder player for a real embedded
      reel (Vimeo iframe) or a real thumbnail image
- [ ] `index.html` work section — replace the four placeholder cards with
      real projects, thumbnails, and links
- [ ] Consider adding real project pages later if you want individual case
      studies rather than a single-page portfolio

## Notes for working with Claude Code

This is a plain Jekyll site — no build step beyond what `jekyll serve`/
`jekyll build` does natively on GitHub Pages, so Claude Code can edit any
file directly and you'll see changes with `bundle exec jekyll serve`.

- Design tokens (colors, fonts) live at the top of `assets/css/main.scss`
  in `:root` — change values there rather than hunting through the file.
- The timeline nav markup is in `_layouts/default.html`; its behavior is in
  `assets/js/main.js`.
- To add a new page, create a `.html` or `.md` file with
  `layout: default` in its front matter — it'll pick up the same nav/footer.
