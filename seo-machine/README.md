# SEO Machine for Shot AI

This folder adapts the workflow from the `seomachine` repository to a static site.

## Command map

`/research-serp [keyword]`
: Output stored in `seo-machine/research/serp-*.md`

`/research-gaps`
: Output stored in `seo-machine/research/gaps.md`

`/research-trending`
: Output stored in `seo-machine/research/trending.md`

`/research-performance`
: Output stored in `seo-machine/research/performance.md`

`/research-topics`
: Output stored in `seo-machine/research/topics.md`

`/write [topic]`
: Draft stored in `seo-machine/drafts/`

`/rewrite [topic]`
: Rewrite notes stored in `seo-machine/rewrites/`

`/optimize [file]`
: Optimization brief stored in `seo-machine/optimizations/`

`/publish-draft [file]`
: Published record stored in `seo-machine/published/`

## Implemented for this repo

- Homepage SEO overhaul: `index.html`
- Blog hub: `blog/index.html`
- New publishable article: `blog/ai-swing-analysis-app.html`
- High-value tennis answer posts:
  - `blog/how-to-start-playing-tennis-without-a-coach.html`
  - `blog/beginner-tennis-technique-and-injury-prevention.html`
- Golf buyer-intent article:
  - `blog/best-golf-training-aids-to-fix-your-swing.html`
- Scheduled golf queue:
  - `scheduled-posts/blog/best-golf-training-aids-for-a-slice.html`
  - `scheduled-posts/blog/best-golf-practice-equipment-for-home.html`
  - `scheduled-posts/blog/should-beginners-buy-golf-training-aids-or-lessons-first.html`
  - `scheduled-posts/blog/best-phone-setup-to-record-your-golf-swing.html`
  - `scheduled-posts/blog/how-to-use-video-feedback-with-golf-drills.html`
- Queue manifest:
  - `seo-machine/queue/posts.json`
- Scheduler:
  - `.github/workflows/publish-scheduled-posts.yml`
  - `scripts/publish_scheduled_posts.py`
- Crawl files: `robots.txt`, `sitemap.xml`
- Research and writing assets for the first topic cluster
