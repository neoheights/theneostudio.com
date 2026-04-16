// ─────────────────────────────────────────────────────────────
//  Neo Studio — Auto Blog Generator
//  Uses Gemini 1.5 Flash (free tier) via Google AI Studio API
//  Run: node scripts/generate-blog.js
// ─────────────────────────────────────────────────────────────

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const KEYWORDS_PATH = path.join(__dirname, "keywords.json");
const OUTPUT_DIR = path.join(__dirname, "../blog-posts");

// ── 1. Pick next unused keyword ───────────────────────────────
const keywords = JSON.parse(fs.readFileSync(KEYWORDS_PATH, "utf8"));
const unusedIndex = keywords.findIndex((k) => !k.used);

if (unusedIndex === -1) {
  // All keywords used — reset and start over
  keywords.forEach((k) => (k.used = false));
  fs.writeFileSync(KEYWORDS_PATH, JSON.stringify(keywords, null, 2));
  console.log("All keywords used — reset complete. Re-run to generate.");
  process.exit(0);
}

const keyword = keywords[unusedIndex];
console.log(`Generating post for keyword: "${keyword.term}"`);

// ── 2. Call Gemini 1.5 Flash API ─────────────────────────────
const GEMINI_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_KEY) {
  console.error("Missing GEMINI_API_KEY environment variable.");
  process.exit(1);
}

const prompt = `You are a content writer for The Neo Studio, a premium luxury interior design studio based in Bangalore, India.

Write a high-quality, SEO-optimised blog post targeting the keyword: "${keyword.term}"

Return ONLY a valid JSON object — no markdown, no code fences, no extra text. The JSON must have exactly these fields:
{
  "title": "Engaging blog title with keyword",
  "slug": "url-safe-lowercase-slug",
  "metaDescription": "Under 155 characters. Compelling summary with keyword.",
  "readTime": "X min read",
  "category": "One of: Design Tips / Trends / Inspiration / Guides",
  "htmlContent": "Full article HTML using only <h2>, <p>, <ul>, <li>, <strong> tags. 600-800 words. Include keyword naturally 3-4 times. Write in an authoritative, warm luxury tone."
}`;

let rawResponse;
try {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  rawResponse = data.candidates[0].content.parts[0].text;
} catch (err) {
  console.error("API call failed:", err.message);
  process.exit(1);
}

// ── 3. Parse JSON (strip any accidental markdown fences) ──────
let post;
try {
  const cleaned = rawResponse
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  post = JSON.parse(cleaned);
} catch (err) {
  console.error("Failed to parse Gemini response as JSON:", err.message);
  console.error("Raw response was:\n", rawResponse);
  process.exit(1);
}

// ── 4. Build full HTML page ───────────────────────────────────
const today = new Date().toLocaleDateString("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${post.title} | The Neo Studio</title>
  <meta name="description" content="${post.metaDescription}" />
  <meta name="keywords" content="${keyword.term}, interior design, The Neo Studio, Bangalore" />

  <!-- Open Graph -->
  <meta property="og:title" content="${post.title}" />
  <meta property="og:description" content="${post.metaDescription}" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="The Neo Studio" />

  <!-- Canonical -->
  <link rel="canonical" href="https://theneostudio.com/blog-posts/${post.slug}.html" />

  <!-- Schema.org Article -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "${post.title}",
    "description": "${post.metaDescription}",
    "author": { "@type": "Organization", "name": "The Neo Studio" },
    "publisher": { "@type": "Organization", "name": "The Neo Studio" },
    "datePublished": "${new Date().toISOString().split("T")[0]}",
    "url": "https://theneostudio.com/blog-posts/${post.slug}.html"
  }
  </script>

  <!-- Site styles -->
  <link rel="stylesheet" href="../index.css" />
  <link rel="stylesheet" href="../style.css" />

  <style>
    .blog-post-hero {
      padding: 120px 24px 60px;
      max-width: 800px;
      margin: 0 auto;
    }
    .blog-post-category {
      font-size: 12px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      opacity: 0.5;
      margin-bottom: 16px;
    }
    .blog-post-title {
      font-size: clamp(28px, 5vw, 48px);
      font-weight: 300;
      line-height: 1.2;
      margin-bottom: 24px;
    }
    .blog-post-meta {
      font-size: 13px;
      opacity: 0.45;
      margin-bottom: 48px;
      display: flex;
      gap: 20px;
    }
    .blog-post-body {
      max-width: 720px;
      margin: 0 auto;
      padding: 0 24px 80px;
      font-size: 16px;
      line-height: 1.85;
    }
    .blog-post-body h2 {
      font-size: clamp(20px, 3vw, 26px);
      font-weight: 400;
      margin: 48px 0 16px;
    }
    .blog-post-body p { margin-bottom: 20px; opacity: 0.85; }
    .blog-post-body ul { padding-left: 20px; margin-bottom: 20px; }
    .blog-post-body li { margin-bottom: 8px; opacity: 0.85; }
    .blog-post-body strong { font-weight: 500; opacity: 1; }
    .back-link {
      display: inline-block;
      font-size: 13px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      opacity: 0.5;
      text-decoration: none;
      margin: 40px 24px 0;
      transition: opacity 0.2s;
    }
    .back-link:hover { opacity: 1; }
    .cta-strip {
      max-width: 720px;
      margin: 0 auto 80px;
      padding: 40px 24px;
      border-top: 1px solid rgba(255,255,255,0.1);
      text-align: center;
    }
    .cta-strip p { opacity: 0.6; margin-bottom: 20px; }
    .cta-btn {
      display: inline-block;
      padding: 12px 32px;
      border: 1px solid currentColor;
      font-size: 13px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      text-decoration: none;
      transition: all 0.2s;
    }
    .cta-btn:hover { background: currentColor; }
  </style>

  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-17EXSCS0R9"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-17EXSCS0R9');
  </script>
</head>
<body class="blog-page">

  <a href="../blog.html" class="back-link">← All articles</a>

  <div class="blog-post-hero">
    <p class="blog-post-category">${post.category}</p>
    <h1 class="blog-post-title">${post.title}</h1>
    <div class="blog-post-meta">
      <span>${today}</span>
      <span>${post.readTime}</span>
      <span>The Neo Studio</span>
    </div>
  </div>

  <article class="blog-post-body">
    ${post.htmlContent}
  </article>

  <div class="cta-strip">
    <p>Ready to transform your space? Let's talk.</p>
    <a href="../contact.html" class="cta-btn">Book a consultation</a>
  </div>

</body>
</html>`;

// ── 5. Write file ─────────────────────────────────────────────
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const outputPath = path.join(OUTPUT_DIR, `${post.slug}.html`);
fs.writeFileSync(outputPath, html, "utf8");
console.log(`✓ Blog post written: blog-posts/${post.slug}.html`);

// ── 6. Mark keyword as used ───────────────────────────────────
keywords[unusedIndex].used = true;
fs.writeFileSync(KEYWORDS_PATH, JSON.stringify(keywords, null, 2));
console.log(`✓ Keyword "${keyword.term}" marked as used`);

// ── 7. Export vars for GitHub Actions ─────────────────────────
const githubEnvFile = process.env.GITHUB_ENV;
if (githubEnvFile) {
  fs.appendFileSync(
    githubEnvFile,
    `BLOG_TITLE=${post.title}\nBLOG_SLUG=${post.slug}\nBLOG_KEYWORD=${keyword.term}\n`
  );
  console.log("✓ GitHub Actions env vars set");
}

console.log("\n─── Done ───────────────────────────────────────────────");
console.log(`Title    : ${post.title}`);
console.log(`Slug     : ${post.slug}`);
console.log(`Keyword  : ${keyword.term}`);
console.log(`File     : blog-posts/${post.slug}.html`);
