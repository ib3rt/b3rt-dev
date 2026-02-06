#!/usr/bin/env python3
"""Convert markdown articles to beautiful HTML"""

import re
from pathlib import Path

def convert_markdown_to_html(markdown_text):
    """Convert markdown to styled HTML"""
    html = markdown_text
    
    # Headers
    html = re.sub(r'^### (.+)$', r'<h3>\1</h3>', html, flags=re.MULTILINE)
    html = re.sub(r'^## (.+)$', r'<h2>\1</h2>', html, flags=re.MULTILINE)
    html = re.sub(r'^# (.+)$', r'<h1>\1</h1>', html, flags=re.MULTILINE)
    
    # Bold/italic
    html = re.sub(r'\*\*\*(.+?)\*\*\*', r'<em><strong>\1</strong></em>', html)
    html = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', html)
    html = re.sub(r'\*(.+?)\*', r'<em>\1</em>', html)
    
    # Code blocks
    html = re.sub(r'```(\w*)\n(.+?)```', r'<pre><code>\2</code></pre>', html, flags=re.DOTALL)
    html = re.sub(r'`(.+?)`', r'<code>\1</code>', html)
    
    # Links
    html = re.sub(r'\[(.+?)\]\((.+?)\)', r'<a href="\2">\1</a>', html)
    
    # Lists
    html = re.sub(r'^- (.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'^\d+\. (.+)$', r'<li>\1</li>', html, flags=re.MULTILINE)
    html = re.sub(r'(<li>.*</li>\n?)+', lambda m: f'<ul>\n{m.group(0)}</ul>\n', html)
    
    # Paragraphs
    lines = html.split('\n\n')
    html = ''
    for line in lines:
        line = line.strip()
        if line and not line.startswith('<') and line:
            html += f'<p>{line}</p>\n'
        else:
            html += line + '\n'
    
    return html

def create_article_html(title, content_html):
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} | b3rt.dev</title>
    <link rel="stylesheet" href="/design-system.css">
</head>
<body>
    <nav class="glass-nav">
        <div class="nav-container">
            <a href="/" class="nav-logo">🦞 b3rt</a>
            <div class="nav-links">
                <a href="/articles">Articles</a>
                <a href="/templates">Templates</a>
                <a href="/journey">Journey</a>
            </div>
        </div>
    </nav>

    <main class="container">
        <a href="/articles" class="back-link">← Back to Articles</a>
        
        <article class="article-content">
            <header class="article-header">
                <span class="article-category">Life OS</span>
                <h1 class="article-title">{title}</h1>
                <div class="article-meta">
                    <span>📖 10 min read</span>
                    <span>✍️ By b3rt</span>
                </div>
            </header>
            
            <div class="article-body">
{content_html}
            </div>
        </article>
    </main>

    <footer>
        <p>Built with ❤️ using Life OS</p>
    </footer>
</body>
</html>'''

# Process files
articles_dir = Path("content/articles")
for md_file in sorted(articles_dir.glob("*.md")):
    with open(md_file, 'r') as f:
        content = f.read()
    
    title_match = re.search(r'^# (.+)$', content, re.MULTILINE)
    title = title_match.group(1) if title_match else md_file.stem.replace('-', ' ').title()
    
    html_content = convert_markdown_to_html(content)
    full_html = create_article_html(title, html_content)
    
    html_file = md_file.with_suffix('.html')
    with open(html_file, 'w') as f:
        f.write(full_html)
    
    print(f"✓ {md_file.name} → {html_file.name}")

print("\n✅ All articles converted!")
