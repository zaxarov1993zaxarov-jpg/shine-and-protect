#!/usr/bin/env python3
"""Convert corrupted index.html (missing angle brackets) to valid HTML."""

import re
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "index.html"
OUT = ROOT / "index_fixed.html"

VOID = {"meta", "link", "img", "input", "br", "hr"}
BLOCK_CLOSE = {
    "html", "head", "body", "div", "section", "nav", "footer", "form", "ul", "ol",
    "li", "a", "button", "span", "p", "h1", "h2", "h3", "h4", "h5", "h6",
    "script", "select", "option", "label", "textarea", "strong", "i", "head", "body",
}


def fix_urls(s: str) -> str:
    subs = [
        (r"httpsshine-and-protect\.com", "https://shine-and-protect.com"),
        (r"httpsfonts\.googleapis\.com", "https://fonts.googleapis.com"),
        (r"httpsfonts\.gstatic\.com", "https://fonts.gstatic.com"),
        (r"httpscdn\.jsdelivr\.netnpm@fortawesomefontawesome-free@6\.4\.0cssall\.min\.css",
         "https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css"),
        (r"httpswww\.googletagmanager\.comgtagjsid=", "https://www.googletagmanager.com/gtag/js?id="),
        (r"httpsformspree\.iofmqezvbwb", "https://formspree.io/f/mqezvbwb"),
        (r"httpsstatic\.cloudflareinsights\.combeacon\.min\.jsv", "https://static.cloudflareinsights.com/beacon.min.js/v"),
        (r"httpswww\.facebook\.comshineandprotect", "https://www.facebook.com/shineandprotect"),
        (r"httpswww\.instagram\.comshineandprotect", "https://www.instagram.com/shineandprotect"),
        (r"httpsschema\.org", "https://schema.org"),
        (r"cssstyle\.css", "css/style.css"),
        (r"jsmain\.js", "js/main.js"),
        (r"imagesfavicon\.png", "images/favicon.png"),
        (r"imageslogo\.png", "images/logo.png"),
        (r"imagespackages", "images/packages/"),
        (r"imageswork", "images/work/"),
        (r"imagesabout", "images/about-"),
        (r"mailtoshineandprotectshop@gmail\.com", "mailto:shineandprotectshop@gmail.com"),
        (r"gtagjsid=", "gtag/js?id="),
        (r"imagepng", "image/png"),
        (r"applicationld\+json", "application/ld+json"),
        (r"httpsfonts\.googleapis\.comcss2family=Bebas\+Neue&family=Interwght@300;400;500;600;700;800&display=swap",
         "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap"),
    ]
    for pat, rep in subs:
        s = re.sub(pat, rep, s)
    return s


def quote_attrs(body: str) -> str:
    body = fix_urls(body)
    body = body.replace("property=ogtype", 'property="og:type"')
    body = body.replace("property=ogurl", 'property="og:url"')
    body = body.replace("property=ogtitle", 'property="og:title"')
    body = body.replace("property=ogdescription", 'property="og:description"')
    body = body.replace("property=ogimage", 'property="og:image"')
    body = body.replace("property=ogsite_name", 'property="og:site_name"')
    body = body.replace("property=oglocale", 'property="og:locale"')
    body = body.replace("property=twittercard", 'property="twitter:card"')
    body = body.replace("property=twitterurl", 'property="twitter:url"')
    body = body.replace("property=twittertitle", 'property="twitter:title"')
    body = body.replace("property=twitterdescription", 'property="twitter:description"')
    body = body.replace("property=twitterimage", 'property="twitter:image"')
    body = re.sub(
        r"(\b(?:name|content|href|src|rel|type|id|for|class|lang|async|defer|crossorigin|method|action|rows|placeholder|value|aria-label|data-aos|data-aos-delay|data-tab|data-cf-beacon|integrity|alt|required|selected|style))=([^\"\s][^\s]*(?=\s+\w[\w-]*=|\s*$)|[^\s]+)",
        r'\1="\2"',
        body,
    )
    body = re.sub(r'background-image url\(', 'background-image: url(', body)
    body = re.sub(r"font-size ", "font-size: ", body)
    body = re.sub(r"margin ", "margin: ", body)
    body = re.sub(r"padding ", "padding: ", body)
    body = re.sub(r"border-radius ", "border-radius: ", body)
    body = re.sub(r"border ", "border: ", body)
    body = re.sub(r"font-weight ", "font-weight: ", body)
    body = re.sub(r"color ", "color: ", body)
    body = re.sub(r"display ", "display: ", body)
    body = re.sub(r"text-decoration ", "text-decoration: ", body)
    body = re.sub(r"margin-top ", "margin-top: ", body)
    body = re.sub(r"margin-bottom ", "margin-bottom: ", body)
    body = re.sub(r"background var\(", "background: var(", body)
    return body


def fix_inline_content(s: str) -> str:
    s = fix_urls(s)
    s = re.sub(r"i class=([^\s]+)i", r'<i class="\1"></i>', s)
    s = re.sub(r"strong(.+?)strong", r"<strong>\1</strong>", s)
    s = re.sub(r"span class=([^\s]+)(.+?)span", r'<span class="\1">\2</span>', s)
    s = re.sub(r"span id=([^\s]+)(.+?)span", r'<span id="\1">\2</span>', s)
    s = re.sub(
        r"a href=([^\s]+)(?: style=([^;]+(?:;[^>]*)?))?\s*(.+?)a",
        lambda m: f'<a href="{m.group(1)}"' + (f' style="{m.group(2).strip()}"' if m.group(2) else "") + f">{fix_inline_content(m.group(3))}</a>",
        s,
    )
    s = s.replace("br", "<br>")
    return s


def convert_line(raw: str, ctx: dict) -> str:
    line = raw.rstrip("\n")
    indent = line[: len(line) - len(line.lstrip())]
    s = line.strip()
    if not s:
        return raw

    s = fix_urls(s)

    if s == "!DOCTYPE html":
        return indent + "<!DOCTYPE html>\n"
    if s.startswith("!--") and s.endswith("--"):
        return indent + "<!--" + s[3:-2] + "-->\n"
    if s == "html lang=en":
        return indent + '<html lang="en">\n'

    # JSON-LD block
    if ctx.get("in_json"):
        if s == "script":
            ctx["in_json"] = False
            return indent + "</script>\n"
        return indent + fix_json(s) + "\n"
    if s.startswith("script type=") and "ld+json" in s:
        ctx["in_json"] = True
        return indent + '<script type="application/ld+json">\n'

    # gtag inline script
    if ctx.get("in_gtag"):
        if s == "script":
            ctx["in_gtag"] = False
            return indent + "</script>\n"
        return raw  # keep JS as-is

    if s.startswith("script async"):
        return indent + "<" + quote_attrs(s) + "></script>\n"
    if s == "script" and ctx.get("expect_gtag_close"):
        ctx["expect_gtag_close"] = False
        ctx["in_gtag"] = False
        return indent + "</script>\n"
    if "window.dataLayer" in s:
        ctx["in_gtag"] = True
        ctx["expect_gtag_close"] = True
        return raw

    # Comments already handled

    # Wrapped content tags: titleXtitle, optionXoption, labelXlabel, pXp, hX...
    for tag in ["title", "option", "label"]:
        if s.startswith(tag) and s.endswith(tag) and len(s) > 2 * len(tag):
            inner = s[len(tag) : -len(tag)]
            return indent + f"<{tag}>{inner}</{tag}>\n"

    # li...li patterns
    if s.startswith("li") and s.endswith("li") and len(s) > 4:
        inner = s[2:-2]
        inner = fix_inline_content(inner)
        # li with nested a
        m = re.match(r'^a href=([^\s]+)(?: class=([^\s]+))?(.+?)a$', inner)
        if m:
            cls = f' class="{m.group(2)}"' if m.group(2) else ""
            return indent + f'<li><a href="{m.group(1)}"{cls}>{m.group(3)}</a></li>\n'
        return indent + f"<li>{inner}</li>\n"

    # a...a with optional i
    if s.startswith("a href=") and s.endswith("a"):
        inner_part = s[1:-1]  # strip outer a...a - actually full match
        m = re.match(r"^a href=([^\s]+)(?: class=([^\s]+))?(?:\s+(i class=([^\s]+)i))?\s*(.*?)a$", s)
        if m:
            cls = f' class="{m.group(2)}"' if m.group(2) else ""
            icon = f'<i class="{m.group(4)}"></i> ' if m.group(4) else ""
            return indent + f'<a href="{m.group(1)}"{cls}>{icon}{m.group(5)}</a>\n'

    # button submit
    if s.startswith("button type=") and s.endswith("button"):
        m = re.match(r"^button type=([^\s]+)(?: class=([^\s]+))?(?:\s+(i class=([^\s]+)i))?\s*(.+?)button$", s)
        if m:
            cls = f' class="{m.group(2)}"' if m.group(2) else ""
            icon = f'<i class="{m.group(4)}"></i> ' if m.group(4) else ""
            return indent + f'<button type="{m.group(1)}"{cls}>{icon}{m.group(5)}</button>\n'

    # h1/h2/h3 with content
    for h in ["h1", "h2", "h3", "h4", "h5", "h6"]:
        if s.startswith(h) and s.endswith(h) and len(s) > 2 * len(h):
            if f"{h} class=" in s:
                m = re.match(rf"^{h} class=([^\s]+)(?: data-aos=([^\s]+))?(?: data-aos-delay=([^\s]+))?\s*(.+?){h}$", s)
                if m:
                    attrs = f' class="{m.group(1)}"'
                    if m.group(2):
                        attrs += f' data-aos="{m.group(2)}"'
                    if m.group(3):
                        attrs += f' data-aos-delay="{m.group(3)}"'
                    inner = fix_inline_content(m.group(4))
                    return indent + f"<{h}{attrs}>{inner}</{h}>\n"
            inner = fix_inline_content(s[len(h) : -len(h)])
            return indent + f"<{h}>{inner}</{h}>\n"

    # p with content
    if s.startswith("p") and s.endswith("p") and len(s) > 2 and not s.startswith("partial") and not s.startswith("package"):
        inner = s[1:-1]
        if inner and not inner.startswith(" "):
            inner = fix_inline_content(inner)
            # p with style
            m = re.match(r"^style=([^>]+)\s*(.+)$", inner)
            if m:
                return indent + f'<p style="{m.group(1)}">{fix_inline_content(m.group(2))}</p>\n'
            return indent + f"<p>{inner}</p>\n"

    # standalone closing
    if s in BLOCK_CLOSE:
        return indent + f"</{s}>\n"

    # br
    if s == "br":
        return indent + "<br>\n"

    # opening tags with attributes
    if " " in s:
        tag, rest = s.split(" ", 1)
        quoted = quote_attrs(rest)
        if tag in VOID or tag == "img" or tag == "input":
            return indent + f"<{tag} {quoted}>\n"
        if tag == "script" and "src=" in rest:
            return indent + f"<{tag} {quoted}></script>\n"
        return indent + f"<{tag} {quoted}>\n"

    # simple opening
    if s == "head":
        return indent + "<head>\n"
    if s == "body":
        return indent + "<body>\n"
    if s == "script":
        return indent + "<script>\n"

    return indent + f"<{s}>\n"


def fix_json(s: str) -> str:
    s = fix_urls(s)
    s = re.sub(r"@(\w+)", r'"@\1"', s)
    # quote unquoted keys
    s = re.sub(r"(?<=[\{,\[]\s*)([A-Za-z_]\w*)(?=\s*:)", r'"\1"', s)
    s = re.sub(r"(?<=[\{,\[]\s*)(@\w+)(?=\s*:)", r'"\1"', s)
    # fix string values (simple)
    s = re.sub(
        r':\s*([A-Za-z][A-Za-z0-9 &\-\+\$,\./\(\)]+?)(?=\s*[,}\]])',
        lambda m: ': "' + m.group(1).strip() + '"',
        s,
    )
    # fix numbers that got quoted
    s = re.sub(r': "(\d+\.?\d*)"', r": \1", s)
    s = re.sub(r': "(\d{4})"', r": \1", s)
    s = re.sub(r': "0800"', r": \"0800\"", s)
    s = re.sub(r': "1700"', r": \"1700\"", s)
    s = re.sub(r': "0900"', r": \"0900\"", s)
    s = re.sub(r': "50000"', r": 50000", s)
    s = re.sub(r'""(@\w+)""', r'"\1"', s)
    return s


def main():
    lines = SRC.read_text(encoding="utf-8").splitlines(keepends=True)
    ctx = {}
    out = []
    for line in lines:
        out.append(convert_line(line, ctx))
    html = "".join(out)
    # fix duplicate script closes and cloudflare line
    html = html.replace(
        '<script defer src="https://static.cloudflareinsights.com/beacon.min.js/v',
        '<script defer src="https://static.cloudflareinsights.com/beacon.min.js/v',
    )
    OUT.write_text(html, encoding="utf-8")
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
