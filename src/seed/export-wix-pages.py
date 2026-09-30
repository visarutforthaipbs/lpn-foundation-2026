"""Export visible Wix page copy to a local JSON snapshot for CMS migration.

Run: python3 src/seed/export-wix-pages.py
Only public, editorial pages are included. Wix blog posts use migrate-blog.ts.
"""

from __future__ import annotations

import json
import re
import urllib.request
from html.parser import HTMLParser
from pathlib import Path


BASE = "https://www.lpnfoundation.org"
PAGES = {
    "home": "/",
    "about": "/about",
    "team": "/team",
    "services": "/services-1",
    "projects": "/projects",
    "ghost-fleet": "/ghost-fleet",
    "news": "/news",
    "contact": "/contact",
    "donate": "/donate",
    "events": "/events-page",
}
OUTPUT = Path("src/seed/wix-pages.snapshot.json")


class WixTextParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, str]] = []
        self.skip = 0
        self.active: dict | None = None
        self.sections: list[dict] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        element_id = attributes.get("id") or ""
        if tag in {"script", "style", "noscript"}:
            self.skip += 1
        in_chrome = any(
            item_id.startswith("SITE_HEADER") or item_id.startswith("SITE_FOOTER")
            for _, item_id in self.stack
        )
        if (
            tag == "div"
            and "wixui-rich-text" in (attributes.get("class") or "").split()
            and not in_chrome
            and self.active is None
        ):
            self.active = {"id": element_id, "depth": len(self.stack), "parts": [], "links": []}
        if self.active and tag in {"p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "br"}:
            self.active["parts"].append("\n")
        if self.active and tag == "a" and attributes.get("href"):
            self.active["links"].append(attributes["href"])
        if tag not in {"br", "img", "meta", "link", "input", "source", "hr", "wbr"}:
            self.stack.append((tag, element_id))

    def handle_endtag(self, tag: str) -> None:
        if tag in {"script", "style", "noscript"}:
            self.skip = max(0, self.skip - 1)
        if self.active and tag in {"p", "h1", "h2", "h3", "h4", "h5", "h6", "li"}:
            self.active["parts"].append("\n")
        if self.stack:
            popped = self.stack.pop()
            if self.active and len(self.stack) == self.active["depth"] and popped[1] == self.active["id"]:
                lines = [re.sub(r"\s+", " ", line).strip() for line in "".join(self.active["parts"]).splitlines()]
                text = "\n".join(line for line in lines if line)
                if text:
                    self.sections.append({"id": self.active["id"], "text": text, "links": list(dict.fromkeys(self.active["links"]))})
                self.active = None

    def handle_data(self, data: str) -> None:
        if self.active and not self.skip:
            self.active["parts"].append(data)


def export_page(slug: str, path: str) -> dict:
    url = BASE + path
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(request, timeout=30) as response:
        html = response.read().decode("utf-8", "replace")
    parser = WixTextParser()
    parser.feed(html)
    media = sorted(set(re.findall(r"https://static\.wixstatic\.com/media/[^\s\"'<>]+", html)))
    return {"slug": slug, "sourceUrl": url, "sections": parser.sections, "mediaUrls": media}


def main() -> None:
    OUTPUT.parent.mkdir(exist_ok=True)
    pages = [export_page(slug, path) for slug, path in PAGES.items()]
    OUTPUT.write_text(json.dumps(pages, ensure_ascii=False, indent=2) + "\n")
    for page in pages:
        print(page["slug"], len(page["sections"]), "text sections", len(page["mediaUrls"]), "media URLs")
    print("Saved", OUTPUT)


if __name__ == "__main__":
    main()
