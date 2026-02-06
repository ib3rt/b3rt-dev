/**
 * Dynamic Articles Loader
 * Loads and displays relevant articles based on page context
 * 
 * Usage: Add <div id="dynamic-articles" data-category="journey"></div>
 * and include this script at the bottom of the page
 */

// Article Database - Add new articles here
const ARTICLES_DB = {
    // Journey/Personal Brand articles
    journey: [
        {
            title: "Genesis Day",
            icon: "🚀",
            date: "2026-02-04",
            category: "Genesis",
            excerpt: "7 intelligent systems launched in one night. The beginning of Life OS.",
            url: "/journey/2026-02-04-genesis-day.html"
        },
        {
            title: "The Transformation",
            icon: "🔄",
            date: "2026-02-04",
            category: "Journey",
            excerpt: "How building in public transformed the development process.",
            url: "/journey/2026-02-04-transformation.html"
        },
        {
            title: "Templates Published",
            icon: "📋",
            date: "2026-02-04",
            category: "Templates",
            excerpt: "Publishing the templates that power Life OS automation.",
            url: "/journey/2026-02-04-templates-published.html"
        }
    ],
    
    // AI/Tech articles
    tech: [
        {
            title: "AI Trends Report",
            icon: "🤖",
            date: "2026-02-05",
            category: "AI Trends",
            excerpt: "Key trends in AI: LLMs, voice interfaces, agents, and local models.",
            url: "/blog/ai-trends-report.html"
        },
        {
            title: "Build Your AI Powerhouse",
            icon: "🖥️",
            date: "2026-02-05",
            category: "Hardware",
            excerpt: "Self-hosted hardware that outperforms Mac Studio. Complete 4-week course.",
            url: "/hardware-workstation/"
        }
    ],
    
    // Business articles
    business: [
        {
            title: "Sparkling Solutions",
            icon: "✨",
            date: "2026-02-04",
            category: "Business",
            excerpt: "Airbnb cleaning business with secure calendar system.",
            url: "https://sparklingsolutions.biz"
        },
        {
            title: "BE Repaired",
            icon: "🛠️",
            date: "2026-02-04",
            category: "Business",
            excerpt: "Handyman services business with online booking.",
            url: "https://be-repaired.b3rt.dev"
        }
    ],
    
    // Default - all articles
    default: [
        {
            title: "Genesis Day",
            icon: "🚀",
            date: "2026-02-04",
            category: "Genesis",
            excerpt: "7 intelligent systems launched in one night. The beginning of Life OS.",
            url: "/journey/2026-02-04-genesis-day.html"
        },
        {
            title: "AI Trends Report",
            icon: "🤖",
            date: "2026-02-05",
            category: "AI Trends",
            excerpt: "Key trends in AI: LLMs, voice interfaces, agents, and local models.",
            url: "/blog/ai-trends-report.html"
        },
        {
            title: "Build Your AI Powerhouse",
            icon: "🖥️",
            date: "2026-02-05",
            category: "Hardware",
            excerpt: "Self-hosted hardware that outperforms Mac Studio. Complete 4-week course.",
            url: "/hardware-workstation/"
        },
        {
            title: "The Transformation",
            icon: "🔄",
            date: "2026-02-04",
            category: "Journey",
            excerpt: "How building in public transformed the development process.",
            url: "/journey/2026-02-04-transformation.html"
        }
    ]
};

// Render articles to a container
function renderArticles(containerId, category = 'default', limit = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const articles = ARTICLES_DB[category] || ARTICLES_DB['default'];
    const articlesToShow = articles.slice(0, limit);
    
    let html = `
        <div class="articles-container">
            <div class="articles-header">
                <h2>📚 Related Articles</h2>
                <p>Latest posts and updates</p>
            </div>
            <div class="articles-grid">
    `;
    
    articlesToShow.forEach(article => {
        html += `
            <article class="article-card" onclick="location.href='${article.url}'">
                <div class="article-icon">${article.icon}</div>
                <div class="article-meta">
                    <span class="tag">${article.category}</span>
                    <span class="tag">${article.date}</span>
                </div>
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <span class="read-more">Read More →</span>
            </article>
        `;
    });
    
    html += `
            </div>
            <div class="articles-footer">
                <a href="/journey/" class="btn btn-secondary">View All Articles →</a>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// Auto-load articles on pages with dynamic-articles container
document.addEventListener('DOMContentLoaded', function() {
    const containers = document.querySelectorAll('[data-category]');
    containers.forEach(container => {
        const category = container.dataset.category;
        const limit = container.dataset.limit || 4;
        renderArticles(container.id, category, limit);
    });
});

// Export for manual calls
window.loadArticles = renderArticles;
