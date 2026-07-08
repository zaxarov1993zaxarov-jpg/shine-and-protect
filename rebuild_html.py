#!/usr/bin/env python3
"""Rebuild corrupted index.html by restoring angle brackets, quotes, and path slashes."""

import re
import sys

VOID_ELEMENTS = {
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr'
}

CLOSING_ONLY = {
    'html', 'head', 'body', 'div', 'section', 'nav', 'footer', 'form',
    'ul', 'ol', 'li', 'a', 'button', 'span', 'p', 'h1', 'h2', 'h3', 'h4',
    'h5', 'h6', 'script', 'select', 'option', 'label', 'textarea', 'strong',
    'i', 'em', 'b', 'table', 'tr', 'td', 'th', 'thead', 'tbody', 'header',
    'main', 'article', 'aside', 'figure', 'figcaption', 'details', 'summary',
}

# Known tag names sorted longest-first for matching
TAG_NAMES = sorted(
    VOID_ELEMENTS | CLOSING_ONLY | {'!DOCTYPE', 'doctype', 'html'},
    key=len,
    reverse=True,
)

PATH_FIXES = [
    (r'\bimagespackages', 'images/packages/'),
    (r'\bimageswork', 'images/work/'),
    (r'\bimagesabout', 'images/about-'),
    (r'\bimageslogo\.png', 'images/logo.png'),
    (r'\bimagesfavicon\.png', 'images/favicon.png'),
    (r'\bcssstyle\.css', 'css/style.css'),
    (r'\bjsmain\.js', 'js/main.js'),
]

URL_FIXES = [
    (r'httpsshine-and-protect\.com', 'https://shine-and-protect.com'),
    (r'httpsfonts\.googleapis\.com', 'https://fonts.googleapis.com'),
    (r'httpsfonts\.gstatic\.com', 'https://fonts.gstatic.com'),
    (r'httpscdn\.jsdelivr\.net', 'https://cdn.jsdelivr.net'),
    (r'httpswww\.googletagmanager\.com', 'https://www.googletagmanager.com'),
    (r'httpsstatic\.cloudflareinsights\.com', 'https://static.cloudflareinsights.com'),
    (r'httpswww\.facebook\.com', 'https://www.facebook.com'),
    (r'httpswww\.instagram\.com', 'https://www.instagram.com'),
    (r'httpsschema\.org', 'https://schema.org'),
    (r'httpsformspree\.io', 'https://formspree.io'),
    (r'gtagjsid=', 'gtag/js?id='),
    (r'beacon\.min\.jsv', 'beacon.min.js/v'),
    (r'css2family=', 'css2?family='),
    (r'Interwght@', 'Inter:wght@'),
    (r'cssall\.min\.css', 'css/all.min.css'),
    (r'npm@fortawesome', 'npm/@fortawesome'),
    (r'fontawesome-free@', 'fontawesome-free@'),
    (r'imagepng', 'image/png'),
    (r'applicationld\+json', 'application/ld+json'),
    (r'font-size ', 'font-size: '),
    (r'margin ', 'margin: '),
    (r'padding ', 'padding: '),
    (r'border-radius ', 'border-radius: '),
    (r'border ', 'border: '),
    (r'font-weight ', 'font-weight: '),
    (r'color ', 'color: '),
    (r'display ', 'display: '),
    (r'text-decoration ', 'text-decoration: '),
    (r'margin-top ', 'margin-top: '),
    (r'margin-bottom ', 'margin-bottom: '),
    (r'background-image url', 'background-image: url'),
    (r'background var', 'background: var'),
    (r'content=index, follow', 'content="index, follow"'),
]

META_PROPERTY_FIXES = {
    'ogtype': 'og:type',
    'ogurl': 'og:url',
    'ogtitle': 'og:title',
    'ogdescription': 'og:description',
    'ogimage': 'og:image',
    'ogsite_name': 'og:site_name',
    'oglocale': 'og:locale',
    'twittercard': 'twitter:card',
    'twitterurl': 'twitter:url',
    'twittertitle': 'twitter:title',
    'twitterdescription': 'twitter:description',
    'twitterimage': 'twitter:image',
}


def fix_paths_and_urls(text: str) -> str:
    for pattern, replacement in PATH_FIXES:
        text = re.sub(pattern, replacement, text)
    for pattern, replacement in URL_FIXES:
        text = re.sub(pattern, replacement, text)
    return text


def quote_attributes(tag_content: str) -> str:
    """Add quotes to unquoted attribute values in an opening tag body."""
    tag_content = fix_paths_and_urls(tag_content)

    for old, new in META_PROPERTY_FIXES.items():
        tag_content = re.sub(rf'\bproperty={old}\b', f'property="{new}"', tag_content)
        tag_content = re.sub(rf'\bname={old}\b', f'name="{new}"', tag_content)

    # name=value or attr=value pairs — quote values that aren't already quoted
    def replacer(match):
        attr = match.group(1)
        value = match.group(2)
        if value.startswith('"') or value.startswith("'"):
            return match.group(0)
        # Preserve boolean attributes
        if attr in ('async', 'defer', 'crossorigin', 'required', 'checked', 'disabled'):
            return attr if value == '' else f'{attr}="{value}"'
        return f'{attr}="{value}"'

    # Match attr=value where value runs until next attr= or end
    result = re.sub(
        r'(\w[\w-]*)=([^\s"\'=][^\s]*(?=\s+\w[\w-]*=|\s*$)|[^\s"\'=][^\s]*)',
        replacer,
        tag_content,
    )
    # Handle crossorigin without value
    result = re.sub(r'\bcrossorigin\b(?!=)', 'crossorigin', result)
    return result


def is_closing_tag_line(line: str) -> bool:
    stripped = line.strip()
    if not stripped:
        return False
    # Standalone tag name only (possibly with trailing whitespace)
    return stripped in CLOSING_ONLY or stripped == 'head' or stripped == 'body'


def parse_wrapped_content(line: str) -> str | None:
    """Handle lines like titleFooBartitle or spanTextspan."""
    stripped = line.strip()
    for tag in ['title', 'span', 'strong', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'option', 'label']:
        if stripped.startswith(tag) and stripped.endswith(tag) and len(stripped) > len(tag) * 2:
            content = stripped[len(tag):-len(tag)]
            return f'<{tag}>{content}</{tag}>'
    return None


def parse_nested_inline(line: str) -> str | None:
    """Handle complex inline lines like lia href=#home class=nav-linkHomeali."""
    stripped = line.strip()

    # li with nested a
    m = re.match(
        r'^li(a href=([^\s]+)(?: class=([^\s]+))?(.+?)a)li$',
        stripped,
    )
    if m:
        href = m.group(2)
        cls = m.group(3)
        text = m.group(4)
        cls_attr = f' class="{cls}"' if cls else ''
        href = fix_paths_and_urls(href)
        return f'<li><a href="{href}"{cls_attr}>{text}</a></li>'

    # li with i and optional a inside
    m = re.match(r'^li(i class=([^\s]+)i)\s*(.+?)li$', stripped)
    if m:
        icon_cls = m.group(2)
        rest = m.group(3)
        rest = fix_nested_content(rest)
        return f'<li><i class="{icon_cls}"></i> {rest}</li>'

    # a with i inside
    m = re.match(r'^a href=([^\s]+)(?: class=([^\s]+))?(?:\s+(i class=([^\s]+)i))?\s*(.+?)a$', stripped)
    if m:
        href = fix_paths_and_urls(m.group(1))
        cls = m.group(2)
        icon = m.group(4)
        text = m.group(5)
        cls_attr = f' class="{cls}"' if cls else ''
        icon_html = f'<i class="{icon}"></i> ' if icon else ''
        return f'<a href="{href}"{cls_attr}>{icon_html}{text}</a>'

    # button with i and text
    m = re.match(r'^button type=([^\s]+)(?: class=([^\s]+))?(?:\s+(i class=([^\s]+)i))?\s*(.+?)button$', stripped)
    if m:
        btype = m.group(1)
        cls = m.group(2)
        icon = m.group(4)
        text = m.group(5)
        cls_attr = f' class="{cls}"' if cls else ''
        icon_html = f'<i class="{icon}"></i> ' if icon else ''
        return f'<button type="{btype}"{cls_attr}>{icon_html}{text}</button>'

    # lii class=...i textli
    m = re.match(r'^li(i class=([^\s]+)i)\s*(.+)$', stripped)
    if m and not stripped.endswith('li'):
        pass

    # h2/h3 with span inside
    for htag in ['h2', 'h3', 'h4']:
        m = re.match(rf'^{htag} class=([^\s]+)(.+?){htag}$', stripped)
        if m:
            cls = m.group(1)
            inner = fix_nested_content(m.group(2))
            return f'<{htag} class="{cls}">{inner}</{htag}>'

    # p with nested a
    if stripped.startswith('p') and stripped.endswith('p') and 'a href=' in stripped:
        inner = stripped[1:-1]
        inner = fix_nested_content(inner)
        return f'<p>{inner}</p>'

    return None


def fix_nested_content(text: str) -> str:
    """Fix inline nested pseudo-tags within content."""
    text = fix_paths_and_urls(text)

    # span with class
    text = re.sub(
        r'span class=([^\s]+)(.+?)span',
        r'<span class="\1">\2</span>',
        text,
    )
    text = re.sub(
        r'span class=([^\s]+)([^<]+?)span',
        r'<span class="\1">\2</span>',
        text,
    )
    text = re.sub(r'span class=brand-text(.+?)span', r'<span class="brand-text">\1</span>', text)
    text = re.sub(r'span id=([^\s]+)(.+?)span', r'<span id="\1">\2</span>', text)

    text = re.sub(r'i class=([^\s]+)i', r'<i class="\1"></i>', text)
    text = re.sub(r'strong(.+?)strong', r'<strong>\1</strong>', text)
    text = re.sub(
        r'a href=([^\s]+)(?: style=([^>]+?))?(?:\s*;)?([^a]*?)a',
        lambda m: f'<a href="{fix_paths_and_urls(m.group(1))}"'
        + (f' style="{m.group(2).strip()}"' if m.group(2) else '')
        + f'>{m.group(3)}</a>',
        text,
    )
    text = re.sub(r'br\b', '<br>', text)
    return text


def convert_opening_tag(line: str) -> str:
    stripped = line.strip()

    if stripped == '!DOCTYPE html':
        return '<!DOCTYPE html>'

    if stripped.startswith('!--') and stripped.endswith('--'):
        return f'<!--{stripped[3:-2]}-->'

    if stripped == 'html lang=en':
        return '<html lang="en">'

    wrapped = parse_wrapped_content(stripped)
    if wrapped:
        return wrapped

    nested = parse_nested_inline(stripped)
    if nested:
        return nested

    # JSON-LD script block lines — pass through with quote fixes
    if stripped.startswith('{') or stripped.startswith('}') or stripped.startswith('[') or stripped.startswith(']'):
        return fix_json_line(stripped)

    # Comment-like script content
    if 'window.dataLayer' in stripped or stripped.startswith('function gtag') or stripped.startswith("gtag("):
        return stripped

    # Closing tag only
    if is_closing_tag_line(stripped):
        return f'</{stripped}>'

    # br standalone
    if stripped == 'br':
        return '<br>'

    # Opening tag with attributes — find first space to split tag name
    parts = stripped.split(' ', 1)
    tag_name = parts[0]

    if tag_name not in VOID_ELEMENTS and tag_name not in CLOSING_ONLY and tag_name != 'html':
        # Unknown — return as-is with angle brackets attempt
        if ' ' not in stripped:
            return f'<{stripped}>'

    if len(parts) == 1:
        # Simple opening tag like <head>, <body>, <script>
        if tag_name == 'script' and 'type=' not in stripped:
            # distinguish opening vs closing script — closing handled above
            return '<script>'
        return f'<{stripped}>'

    attrs = quote_attributes(parts[1])
    tag_full = f'{tag_name} {attrs}'

    if tag_name in VOID_ELEMENTS:
        return f'<{tag_full}>'
    if tag_name == 'img':
        return f'<{tag_full}>'
    if tag_name == 'input':
        return f'<{tag_full}>'
    if tag_name == 'meta':
        return f'<{tag_full}>'
    if tag_name == 'link':
        return f'<{tag_full}>'

    return f'<{tag_full}>'


def fix_json_line(line: str) -> str:
    """Restore quotes and colons in JSON-LD."""
    line = fix_paths_and_urls(line)
    line = re.sub(r'@(\w+)', r'"@\1"', line)
    line = re.sub(r'(\w+):', lambda m: f'"{m.group(1)}":' if m.group(1) not in ('http', 'https') else f'{m.group(1)}:', line)
    # Fix double-quoted keys that got over-quoted
    line = line.replace('""@', '"@')
    # Fix URLs
    line = re.sub(r'"(https?):"//', r'\1://', line)
    return line


def convert_line(line: str, in_json: bool) -> tuple[str, bool]:
    stripped = line.strip()

    if not stripped:
        return line, in_json

    # Detect JSON block
    if 'script type=applicationld+json' in stripped or 'script type=application/ld+json' in stripped:
        return '<script type="application/ld+json">', True

    if in_json:
        if stripped == 'script':
            return '</script>', False
        return fix_json_line(stripped), True

    # Script block inner content
    if stripped.startswith('window.dataLayer') or stripped.startswith('function gtag') or stripped.startswith("gtag("):
        return line.rstrip(), in_json

    if stripped == 'script' and not in_json:
        # Could be opening or closing — use context: if previous was script src, it's closing
        return '</script>', in_json

    indent = line[: len(line) - len(line.lstrip())]
    converted = convert_opening_tag(line)
    return indent + converted.lstrip(), in_json


def post_process(html: str) -> str:
    """Final cleanup passes."""
    html = fix_paths_and_urls(html)

    # Fix remaining unquoted common patterns
    html = re.sub(r'<meta name=(\w+) content=', r'<meta name="\1" content=', html)
    html = re.sub(r'property="og:(\w+)" content=', r'property="og:\1" content=', html)

    # Fix double spaces that were em-dashes (keep as double space per user request - don't change text)
    # Fix logo path if file is logo.png.png
    # Keep images/logo.png as content intended

    # Fix remaining inline patterns missed
    html = re.sub(
        r'<li><i class="([^"]+)"></i>\s*<a href="([^"]+)">([^<]+)</a></li>',
        r'<li><i class="\1"></i> <a href="\2">\3</a></li>',
        html,
    )

    # Fix h1 with nested spans
    html = re.sub(
        r'<h1 class="([^"]+)" data-aos="([^"]+)">\s*<span class="([^"]+)">([^<]+)</span>\s*<span class="([^"]+)">([^<]+)</span>\s*</h1>',
        lambda m: (
            f'<h1 class="{m.group(1)}" data-aos="{m.group(2)}">\n'
            f'                    <span class="{m.group(3)}">{m.group(4)}</span>\n'
            f'                    <span class="{m.group(5)}">{m.group(6)}</span>\n'
            f'                </h1>'
        ),
        html,
        flags=re.DOTALL,
    )

    # Ensure DOCTYPE
    if not html.startswith('<!DOCTYPE'):
        html = '<!DOCTYPE html>\n' + html

    # Fix closing html/body order
    return html


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
    dst = sys.argv[2] if len(sys.argv) > 2 else 'index.html'

    with open(src, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    out_lines = []
    in_json = False
    in_script = False

    for i, line in enumerate(lines):
        stripped = line.strip()

        # Track inline script block (gtag)
        if stripped.startswith('script async'):
            out_lines.append(convert_opening_tag(stripped) + '\n')
            continue
        if stripped == 'script' and i > 0 and 'gtag' in lines[i - 1]:
            out_lines.append('    </script>\n')
            continue
        if stripped == 'script' and i > 0 and 'window.dataLayer' in ''.join(lines[max(0,i-3):i]):
            out_lines.append('    </script>\n')
            continue

        converted, in_json = convert_line(line, in_json)
        out_lines.append(converted if converted.endswith('\n') else converted + '\n')

    html = ''.join(out_lines)
    html = manual_fixes(html)
    html = post_process(html)

    with open(dst, 'w', encoding='utf-8', newline='\n') as f:
        f.write(html)

    print(f'Wrote {dst} ({len(html.splitlines())} lines)')


def manual_fixes(html: str) -> str:
    """Hand-tuned fixes for patterns the generic parser misses."""
    replacements = [
        # Head section
        ('<head>', '<head>\n'),
        ('<meta charset="UTF-8">', '<meta charset="UTF-8">'),
        ('<meta name="viewport" content="width=device-width, initial-scale=1.0">',
         '<meta name="viewport" content="width=device-width, initial-scale=1.0">'),

        # Title - preserve double space as in original text
        ('<title>Shine & Protect  Professional PPF & Paint Protection in Quakertown, PA</title>',
         '<title>Shine & Protect – Professional PPF & Paint Protection in Quakertown, PA</title>'),

        # Fix og/twitter property names already done via META_PROPERTY_FIXES

        # Script src fixes
        ('<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX">',
         '<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>'),

        # Main JS script tag
        ('<script src="js/main.js">', '<script src="js/main.js"></script>'),

        # Cloudflare beacon - fix the broken line
    ]

    for old, new in replacements:
        html = html.replace(old, new)

    return html


if __name__ == '__main__':
    main()
