from __future__ import annotations

import json
import os
import shutil
from datetime import datetime
from html import escape
from pathlib import Path
from zoneinfo import ZoneInfo


ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = ROOT / "seo-machine" / "queue" / "posts.json"
BLOG_INDEX_PATH = ROOT / "blog" / "index.html"
SITEMAP_PATH = ROOT / "sitemap.xml"

CARD_START = "<!-- AUTO-BLOG-CARDS:START -->"
CARD_END = "<!-- AUTO-BLOG-CARDS:END -->"
SITEMAP_START = "<!-- AUTO-SITEMAP:START -->"
SITEMAP_END = "<!-- AUTO-SITEMAP:END -->"
SITE_ORIGIN = "https://shotaiapp.com"


def today_in_timezone() -> str:
    tz_name = os.environ.get("TZ", "Asia/Kolkata")
    return datetime.now(ZoneInfo(tz_name)).date().isoformat()


def load_posts() -> list[dict]:
    with MANIFEST_PATH.open("r", encoding="utf-8") as handle:
        return json.load(handle)


def save_posts(posts: list[dict]) -> None:
    with MANIFEST_PATH.open("w", encoding="utf-8") as handle:
        json.dump(posts, handle, indent=2)
        handle.write("\n")


def replace_between_markers(content: str, start: str, end: str, replacement: str) -> str:
    start_idx = content.index(start) + len(start)
    end_idx = content.index(end)
    return content[:start_idx] + "\n" + replacement + "\n      " + content[end_idx:]


def render_blog_cards(posts: list[dict]) -> str:
    published = [post for post in posts if post["status"] == "published"]
    published = [
        post
        for _, post in sorted(
            enumerate(published),
            key=lambda item: (item[1]["publish_on"], -item[0]),
            reverse=True,
        )
    ]
    cards = []
    for post in published:
        cards.append(
            "        <article class=\"blog-card\">\n"
            f"          <p class=\"section-label\">{escape(post['category'])}</p>\n"
            f"          <h2><a href=\"/{escape(post['live_path'])}\">{escape(post['title'])}</a></h2>\n"
            f"          <p>{escape(post['description'])}</p>\n"
            "        </article>"
        )
    return "\n".join(cards)


def render_sitemap_urls(posts: list[dict]) -> str:
    published = sorted(
        (post for post in posts if post["status"] == "published"),
        key=lambda post: post["live_path"],
    )
    items = []
    for post in published:
        items.append(
            "  <url>\n"
            f"    <loc>{SITE_ORIGIN}/{escape(post['live_path'])}</loc>\n"
            "  </url>"
        )
    return "\n".join(items)


def publish_due_posts(posts: list[dict], today: str) -> list[str]:
    published_slugs = []
    for post in posts:
        if post["status"] != "queued":
            continue
        if post["publish_on"] > today:
            continue

        source_path = ROOT / post["source_path"]
        live_path = ROOT / post["live_path"]
        live_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source_path, live_path)
        post["status"] = "published"
        post["published_at"] = today
        published_slugs.append(post["slug"])
    return published_slugs


def update_blog_index(posts: list[dict]) -> None:
    content = BLOG_INDEX_PATH.read_text(encoding="utf-8")
    updated = replace_between_markers(content, CARD_START, CARD_END, render_blog_cards(posts))
    BLOG_INDEX_PATH.write_text(updated, encoding="utf-8")


def update_sitemap(posts: list[dict]) -> None:
    content = SITEMAP_PATH.read_text(encoding="utf-8")
    updated = replace_between_markers(content, SITEMAP_START, SITEMAP_END, render_sitemap_urls(posts))
    SITEMAP_PATH.write_text(updated, encoding="utf-8")


def main() -> None:
    posts = load_posts()
    today = today_in_timezone()
    published_slugs = publish_due_posts(posts, today)
    update_blog_index(posts)
    update_sitemap(posts)
    save_posts(posts)

    if published_slugs:
        print("Published:", ", ".join(published_slugs))
    else:
        print("No scheduled posts due on", today)


if __name__ == "__main__":
    main()
