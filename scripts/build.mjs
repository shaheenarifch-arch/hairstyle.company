#!/usr/bin/env node
/**
 * hairstyle.company static site builder (zero dependencies, Node 18+)
 *   node scripts/build.mjs
 * Reads data/partners.json, src/site.json, src/content.mjs, src/site.css, src/site.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const write = (p, s) => { const f = path.join(ROOT, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, s); };
const site = JSON.parse(read('src/site.json'));
const data = JSON.parse(read('data/partners.json'));
const { collections, guides, homeFaqs, pages } = await import(pathToFileURL(path.join(ROOT, 'src/content.mjs')).href);
const V = new Date().toISOString().slice(0, 10);

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => site.url + (p.startsWith('/') ? p : '/' + p);
const strip = (h) => String(h).replace(/<[^>]+>/g, '');
const money = (v) => (v == null ? '' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: v % 1 ? 2 : 0 }).format(v));
const P = Object.fromEntries(data.partners.map((p) => [p.id, p]));

// ---------- products ----------
const curated = data.curated.map((p) => ({ ...p, kind: 'curated', img: p.imageHi || p.image, page: `/products/${p.id}.html` }));
const curatedImgs = new Set(data.curated.map((p) => p.imageHi).filter(Boolean));
const store = Object.values(data.store).flat().filter((p) => !curatedImgs.has(p.image)).map((p) => ({ ...p, kind: 'store', img: p.image }));
const all = [...curated, ...store];
const ref = (key) => { const [pid, i] = key.split('-'); return data.store[pid]?.[+i]?.image; };
const byTag = (t) => all.filter((p) => p.tags.includes(t));
const byBrand = (id) => all.filter((p) => p.partner === id);
function mix(items, n) { const g = {}; for (const it of items) (g[it.partner + (it.category || '')] ||= []).push(it); const L = Object.values(g), out = []; for (let i = 0; out.length < n && L.some((l) => l[i]); i++) for (const l of L) if (l[i] && out.length < n) out.push(l[i]); return out; }
function mixBrands(items, n) { const g = {}; for (const it of items) (g[it.partner] ||= []).push(it); const L = Object.values(g), out = []; for (let i = 0; out.length < n && L.some((l) => l[i]); i++) for (const l of L) if (l[i] && out.length < n) out.push(l[i]); return out; }

// ---------- icons ----------
const I = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ic = {
  left: I('<path d="m15 18-6-6 6-6"/>'), right: I('<path d="m9 18 6-6-6-6"/>'), arrow: I('<path d="M5 12h14M12 5l7 7-7 7"/>'),
  ext: I('<path d="M7 17 17 7M8 7h9v9"/>'), menu: I('<path d="M4 7h16M4 12h16M4 17h16"/>'), up: I('<path d="m18 15-6-6-6 6"/>'),
  mail: I('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
  leaf: I('<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>'),
  sparkle: I('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>'),
  shield: I('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  clock: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
};
const socialIc = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.7 5.7 0 1 0 4.9 5.7V9.1a7.4 7.4 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6z"/></svg>',
  pinterest: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12c0 4.4 2.7 8.2 6.6 9.8-.1-.8-.2-2.1 0-3l1.2-5.2s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.6 0 1-.6 2.4-.9 3.7-.3 1.1.6 2 1.7 2 2 0 3.5-2.1 3.5-5.2 0-2.7-1.9-4.6-4.7-4.6-3.2 0-5.1 2.4-5.1 4.9 0 1 .4 2 .9 2.6.1.1.1.2.1.3l-.3 1.3c-.1.2-.2.3-.4.2-1.5-.7-2.4-2.8-2.4-4.5 0-3.7 2.7-7.1 7.7-7.1 4 0 7.2 2.9 7.2 6.7 0 4-2.5 7.2-6 7.2-1.2 0-2.3-.6-2.7-1.3l-.7 2.8c-.3 1-1 2.3-1.5 3.1 1.1.3 2.3.5 3.5.5 5.8 0 10.5-4.7 10.5-10.5S17.8 1.5 12 1.5z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1c.4-1.6.5-4.8.5-4.8s0-3.2-.5-4.8zM9.7 15V9l5.9 3z"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.5V6.6c0-.9.6-1.1 1-1.1h2.6V1.6L14 1.5c-4 0-4.9 3-4.9 4.9v2.1H6.5v4h2.6V22.5H14V12.5h3.3l.4-4z"/></svg>',
};
const socialName = { instagram: 'Instagram', tiktok: 'TikTok', pinterest: 'Pinterest', youtube: 'YouTube', facebook: 'Facebook' };
const mark = `<svg class="brand-mark" width="34" height="34" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="11" fill="#2563eb"/><path d="M13 29c0-9 3-15 9-17 2.5-.8 5 .2 5 .2s-4 1.2-5.5 5.8C20 22.6 21 29 21 29" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/><path d="M19 29c0-6 2-10.5 6-12.5" fill="none" stroke="#bfdbfe" stroke-width="2.2" stroke-linecap="round"/></svg>`;

// ---------- layout ----------
const NAV = [['/collections/glueless-wigs.html', 'Wigs'], ['/collections/hair-care.html', 'Hair Care'], ['/brands/', 'Brands'], ['/guides/', 'Guides'], ['/about.html', 'About']];
const orgSchema = () => ({ '@type': 'Organization', '@id': site.url + '/#org', name: site.name, url: site.url + '/', logo: abs('/apple-touch-icon.png'), email: site.email });
const webSchema = () => ({ '@type': 'WebSite', '@id': site.url + '/#website', url: site.url + '/', name: site.name, description: site.description, publisher: { '@id': site.url + '/#org' }, inLanguage: 'en-US' });
const crumbSchema = (l) => ({ '@type': 'BreadcrumbList', itemListElement: l.map(([h, t], i) => ({ '@type': 'ListItem', position: i + 1, name: t, item: abs(h) })) });
const faqSchema = (f) => ({ '@type': 'FAQPage', mainEntity: f.map((x) => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: strip(x.a) } })) });

function head({ title, description, canonical, image, schema = [], preload = '', type = 'website', noindex = false }) {
  const og = image || ref('unice-2') || abs('/images/og.jpg');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${abs(canonical)}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
<meta name="theme-color" content="#2563eb">
<meta property="og:site_name" content="${site.name}"><meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(canonical)}"><meta property="og:image" content="${esc(og)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(og)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://cdn.shopify.com" crossorigin><link rel="preconnect" href="https://ima.unice.com" crossorigin>
${preload}
<link rel="stylesheet" href="/assets/site.css?v=${V}">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [orgSchema(), webSchema(), ...schema] })}</script>
</head>`;
}

function header(active = '') {
  return `<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="wrap header-inner">
  <a class="logo" href="/" aria-label="${site.name} home">${mark}<span>hairstyle<i>.company</i></span></a>
  <nav class="nav" id="site-nav" aria-label="Main">
    ${NAV.map(([h, t]) => `<a href="${h}"${active === t ? ' aria-current="page"' : ''}>${t}</a>`).join('\n    ')}
  </nav>
  <div class="search-box" data-search>
    <label class="sr-only" for="site-search">Search wigs and hair care</label>
    <input class="search" id="site-search" type="search" placeholder="Search wigs & care" autocomplete="off" aria-controls="search-results" aria-expanded="false">
    <div class="search-results" id="search-results" role="listbox" hidden></div>
  </div>
  <button class="menu" type="button" aria-controls="site-nav" aria-expanded="false" data-menu-btn>Menu</button>
</div></header>`;
}

function newsletter() {
  const n = site.newsletter || {};
  return `<section class="wrap" id="newsletter" aria-labelledby="nl-t"><div class="newsletter">
  <div><p class="eyebrow">The Hair Letter</p><h2 id="nl-t">New drops, real deals, zero spam.</h2><p>One email a month with new arrivals, brand sales and our latest how-tos.</p></div>
  <div class="nl-side">
    <form class="nl-form" action="${esc(n.action || 'mailto:' + site.email)}" method="${n.method || 'post'}" data-newsletter data-fallback="${esc(site.email)}"${n.action ? ' target="_blank"' : ''}>
      <label class="sr-only" for="nl-email">Email address</label>
      <input id="nl-email" type="email" name="${esc(n.emailField || 'email')}" placeholder="you@example.com" autocomplete="email" required>
      <div class="hp" aria-hidden="true"><input type="text" name="website" tabindex="-1" autocomplete="off"></div>
      <button type="submit">Subscribe</button>
    </form>
    <p class="nl-note">By subscribing you agree to our <a href="/privacy.html">privacy policy</a>. Unsubscribe anytime.</p>
    <p class="nl-msg" role="status" aria-live="polite"></p>
  </div>
</div></section>`;
}

function footer() {
  const soc = Object.entries(site.social || {}).filter(([k, v]) => socialIc[k] && v);
  const col = (h, links) => `<div class="footer-col"><h2>${h}</h2>${links.map(([u, t]) => `<a href="${u}">${esc(t)}</a>`).join('')}</div>`;
  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand"><a class="logo" href="/">${mark}<strong>hairstyle<i>.company</i></strong></a>
      <p>${esc(site.description)}</p>
      <div class="fcontact"><a href="mailto:${esc(site.email)}">${ic.mail} ${esc(site.email)}</a></div>
      <div class="socials" aria-label="Follow us">${soc.map(([k, v]) => `<a class="soc" href="${esc(v)}" target="_blank" rel="noopener me" aria-label="${socialName[k]}">${socialIc[k]}</a>`).join('')}</div>
    </div>
    ${col('Shop wigs', collections.filter((c) => c.slug !== 'hair-care').slice(0, 7).map((c) => [`/collections/${c.slug}.html`, c.title]))}
    ${col('Brands & care', [...data.partners.map((p) => [`/brands/${p.id}.html`, p.name]), ['/collections/hair-care.html', 'Hair care']])}
    ${col('Learn', guides.slice(0, 5).map((g) => [g.path, g.short]))}
    ${col('Company', [['/about.html', 'About'], ['/affiliate-disclosure.html', 'Affiliate disclosure'], ['/privacy.html', 'Privacy'], [`mailto:${site.email}`, 'Contact'], ['/sitemap.xml', 'Sitemap']])}
  </div>
  <div class="wrap footer-bottom"><p>© <span data-year>${new Date().getFullYear()}</span> ${site.name}. All rights reserved.</p><p>All products are sold by official brand stores. As an affiliate partner we may earn a commission on purchases made through our links, at no extra cost to you. Prices are starting prices and may change.</p></div>
</footer>
<button class="to-top" type="button" aria-label="Back to top" data-top>${ic.up}</button>
<script src="/assets/site.js?v=${V}" defer></script>
</body>
</html>
`;
}

// ---------- components ----------
function card(p, { eager = false } = {}) {
  const b = P[p.partner];
  const href = p.kind === 'curated' ? p.page : p.url;
  const ext = p.kind === 'curated' ? '' : ' target="_blank" rel="sponsored noopener"';
  const badge = p.kind === 'curated' ? 'The Edit' : (p.category || '');
  return `<article class="card" data-brand="${p.partner}">
  <a class="card-img" href="${esc(href)}"${ext} tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.name)}" width="400" height="470" loading="${eager ? 'eager' : 'lazy'}" decoding="async">${badge ? `<span class="badge">${esc(badge)}</span>` : ''}<span class="view">View ↗</span></a>
  <div class="card-copy">
    <p class="card-partner">${esc(b.name)}</p>
    <h3><a href="${esc(href)}"${ext}>${esc(p.name)}</a></h3>
    <div><span class="price">${p.price ? `<small>From</small> ${money(p.price)}` : '<span class="muted">Official store</span>'}</span><a class="go" href="${esc(p.url)}" target="_blank" rel="sponsored noopener" aria-label="Shop ${esc(p.name)} at ${esc(b.name)}">↗</a></div>
  </div>
</article>`;
}
function carousel(items, label, id) {
  return `<div class="railbox" data-carousel>
  <button class="arrow prev" type="button" data-prev aria-label="Previous ${esc(label)}" aria-controls="${id}">‹</button>
  <div class="rail track" id="${id}" role="region" aria-roledescription="carousel" aria-label="${esc(label)}" tabindex="0">${items.join('')}</div>
  <button class="arrow next" type="button" data-next aria-label="Next ${esc(label)}" aria-controls="${id}">›</button>
</div>`;
}
const collection = ({ id, eyebrow, title, text, more, items, label, cls = '' }) => `<section class="collection${cls ? ' ' + cls : ''}" id="${id}" aria-labelledby="${id}-t">
  <div class="section-head"><div><p class="eyebrow">${esc(eyebrow)}</p><h2 id="${id}-t">${esc(title)}</h2>${text ? `<p>${text}</p>` : ''}</div>${more ? `<a href="${esc(more[0])}"${/^https?:/.test(more[0]) ? ' target="_blank" rel="sponsored noopener"' : ''}>${esc(more[1])}</a>` : ''}</div>
  ${carousel(items, label || title, 'car-' + id)}
</section>`;
const story = (tone, eyebrow, title, text, cta = '') => `<section class="story story-${tone}"><div><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2><p>${text}</p>${cta ? `<div class="actions">${cta}</div>` : ''}</div></section>`;
const guideCard = (g) => `<article class="card post"><a class="card-img" href="${g.path}" tabindex="-1" aria-hidden="true"><img src="${esc(ref(g.img))}" alt="" width="440" height="300" loading="lazy" decoding="async"><span class="badge">Guide</span></a><div class="card-copy"><p class="card-partner">${esc(g.category)} · ${g.readMins} min read</p><h3><a href="${g.path}">${esc(g.title)}</a></h3><p class="post-desc">${esc(g.description)}</p><div><span class="price muted">Read guide</span><a class="go" href="${g.path}" aria-label="Read ${esc(g.title)}">→</a></div></div></article>`;
const crumbs = (l) => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${l.map(([h, t], i) => `<li>${i < l.length - 1 ? `<a href="${h}">${esc(t)}</a>` : `<span aria-current="page">${esc(t)}</span>`}</li>`).join('')}</ol></nav>`;
const faqBlock = (f, h = 'Questions, answered') => `<div class="faq"><h2 class="center" style="margin-bottom:18px">${h}</h2>${f.map((x, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(x.q)}</summary><div class="answer"><p>${x.a}</p></div></details>`).join('')}</div>`;
const itemList = (name, items) => ({ '@type': 'ItemList', name, numberOfItems: items.length, itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: p.kind === 'curated' ? abs(p.page) : p.productUrl })) });

// ---------- pages ----------
function home() {
  const h = [ref('unice-2'), ref('unice-4'), ref('unice-14')];
  const texTiles = ['body-wave', 'curly-hair', 'straight-hair', 'deep-wave', 'bob-short-wigs', 'blonde-hair'].map((s) => collections.find((c) => c.slug === s));
  const texBlurb = { 'body-wave': 'Soft, bouncy S-waves', 'curly-hair': 'Kinky, water and Burmese curls', 'straight-hair': 'Sleek silky and yaki', 'deep-wave': 'Defined, voluminous waves', 'bob-short-wigs': 'Short, chic and easy', 'blonde-hair': '613, honey and highlights' };
  const prices = all.map((p) => p.price).filter(Boolean);
  const from = prices.length ? money(Math.min(...prices)) : '';
  const stories = {
    unice: ['living', 'Beginner favourite', 'Glueless, on in five minutes.', 'UNice’s Bye-Bye Slip and pre-cut HD lace wigs are made for the easiest install, with no glue needed.'],
    zlike: ['lav', 'Volume & trend', 'Big hair, bold colour.', 'Zlike goes up to 300% density with pre-styled cuts, boho braids and statement colours.'],
    allove: ['sand', 'Long & full', 'Frontals made for length.', 'Allove’s 13x4 and 13x6 HD frontals come in 30"+ lengths and salon balayage shades.'],
    jumybee: ['sage', 'Hair care', 'Smooth, frizz-free care.', 'Keratin smoothing and Japanese botox-style masks from Jumy Bee, for soft, shiny natural hair.'],
  };
  const feature = (tone, pic, label, eyebrow, title, href, cta) => `<div class="feature ${tone}"><a class="feature-pic" href="${href}" tabindex="-1" aria-hidden="true"><img src="${esc(pic)}" alt="" width="400" height="500" decoding="async"><span>${esc(label)}</span></a><div><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2></div><a href="${href}">${esc(cta)}</a></div>`;
  return head({
    title: 'hairstyle | Human Hair Wigs, Glueless & HD Lace, Curated',
    description: 'Shop a curated edit of glueless, HD lace and human hair wigs plus keratin hair care from UNice, Zlike, Allove Hair and Jumy Bee. Specs explained, official stores only.',
    canonical: '/', image: h[0],
    preload: `<link rel="preload" as="image" href="${esc(h[0])}" fetchpriority="high">`,
    schema: [itemList('The Edit: 12 curated wigs and hair care', curated), faqSchema(homeFaqs)],
  }) + header() + `
<main id="main" class="wrap">
<section class="hero" aria-label="Featured">
  <div class="hero-main hero-lit">
    <div class="hero-copy">
      <p class="eyebrow">New · The curated hair edit</p>
      <h1>Hair That Feels Like You, Only Easier</h1>
      <p>Glueless human hair wigs, melt-ready HD lace and salon-grade keratin care, hand-picked from four official brand stores and explained without the jargon.</p>
      <ul class="hero-points"><li>Glueless & wear-and-go</li><li>100% human hair</li><li>Official stores only</li></ul>
      <div class="actions"><a class="btn" href="#the-edit">Shop the Edit${from ? ` from ${from}` : ''}</a><a class="btn alt" href="/guides/glueless-wigs-for-beginners.html">New to wigs? Start here</a></div>
      <p class="hero-note">Prices and availability are set by the brand and may change.</p>
    </div>
    <a class="hero-product" href="/collections/glueless-wigs.html"><img src="${esc(h[0])}" alt="Model wearing a glueless body wave human hair wig" width="700" height="875" fetchpriority="high" decoding="async"><span class="hero-tag"><b>Glueless HD lace wigs</b>Pre-cut, pre-plucked, on in 5 min</span></a>
  </div>
  <div class="side">
    ${feature('lav', h[1], 'Curly · UNice', 'Every texture', 'Curls with meaning.', '/collections/curly-hair.html', 'Explore curly wigs')}
    ${feature('sand', h[2], 'Keratin care · Jumy Bee', 'Care that lasts', 'Smooth from root to tip.', '/collections/hair-care.html', 'Explore hair care')}
  </div>
</section>

<section class="rooms" aria-labelledby="tex-t">
  <div class="title"><p class="eyebrow">Find your texture</p><h2 id="tex-t">Shop by Texture</h2><p>Start with the texture you love, then compare styles from four official brands.</p></div>
  <div class="room-grid">${texTiles.map((c) => `<a class="room" href="/collections/${c.slug}.html"><span class="room-pic"><img src="${esc(ref(c.hero))}" alt="" width="120" height="150" loading="lazy" decoding="async"></span><h3>${esc(c.h1.replace(/ wigs$/i, ''))}</h3><p>${esc(texBlurb[c.slug] || '')} · ${byTag(c.slug).length} styles</p></a>`).join('')}</div>
</section>

${collection({ id: 'the-edit', cls: 'band-sky', eyebrow: 'The Edit', title: 'Twelve Pieces We’d Actually Wear', text: 'Our shortlist across four brands: specs checked, beginner-friendly features first.', more: ['/collections/lace-wigs.html', 'Explore all'], items: curated.map((p, i) => card(p, { eager: i < 2 })), label: 'The Edit' })}

${data.partners.map((b) => `${stories[b.id] ? story(stories[b.id][0], stories[b.id][1], stories[b.id][2], stories[b.id][3], `<a class="btn" href="/brands/${b.id}.html">Shop all ${byBrand(b.id).length} ${esc(b.name)} picks</a><a class="btn alt" href="${esc(b.url)}" target="_blank" rel="sponsored noopener">Visit ${esc(b.domain)}</a>`) : ''}
${collection({ id: 'brand-' + b.id, eyebrow: b.id === 'jumybee' ? 'Hair care' : 'Shop by brand', title: b.name, text: esc(b.tagline), more: [`/brands/${b.id}.html`, 'Explore all'], items: mix(byBrand(b.id), 12).map((p) => card(p)), label: b.name })}`).join('\n')}

<section class="story story-sky lace" aria-labelledby="lace-t">
  <div>
    <p class="eyebrow">Lace 101</p><h2 id="lace-t">Which lace is right for you?</h2>
    <p>Lace type decides how invisible your hairline looks; lace size decides how freely you can part and style.</p>
    <div class="table-wrap"><table class="compare"><thead><tr><th>Lace</th><th>Best for</th><th>Skill level</th></tr></thead><tbody>
      <tr><td><strong>7x5 glueless</strong></td><td>Quick, secure everyday wear</td><td>Beginner</td></tr>
      <tr><td><strong>5x5 closure</strong></td><td>Low maintenance, fixed parting</td><td>Beginner</td></tr>
      <tr><td><strong>13x4 frontal</strong></td><td>Ear-to-ear hairline, free parting</td><td>Intermediate</td></tr>
      <tr><td><strong>13x6 HD frontal</strong></td><td>Deep parts, most natural melt</td><td>Intermediate</td></tr>
      <tr><td><strong>360 / full lace</strong></td><td>High ponytails and updos</td><td>Advanced</td></tr>
    </tbody></table></div>
    <div class="actions"><a class="btn" href="/guides/hd-lace-vs-transparent-lace.html">Read the lace guide</a></div>
  </div>
</section>

<section class="collection band-warm" id="why" aria-labelledby="why-t">
  <div class="section-head"><div><p class="eyebrow">Why shop here</p><h2 id="why-t">Less Guesswork, Better Hair Days</h2></div></div>
  ${carousel([
    [ic.shield, 'Official stores only', 'Every link goes to the brand itself, for authentic hair and real warranties.'],
    [ic.sparkle, 'Specs, simplified', 'Lace, density, length and cap explained in plain English.'],
    [ic.clock, 'Beginner-first', 'Glueless, pre-plucked and pre-cut styles are always easy to find.'],
    [ic.leaf, 'Care that lasts', 'Guides and treatments that keep hair soft, smooth and long-lasting.'],
  ].map(([i, t, d], n) => `<div class="prop tone-${['coral', 'sky', 'sage', 'lav'][n]}"><span class="room-ic">${i}</span><h3>${t}</h3><p>${d}</p></div>`), 'Why shop here', 'car-why')}
</section>

${collection({ id: 'guides', eyebrow: 'The journal', title: 'Wig Guides & How-Tos', text: 'Everything you need to choose, wear and care for a wig.', more: ['/guides/', 'Explore all'], items: guides.map(guideCard), label: 'Guides' })}

${newsletter()}

<section class="faq" aria-labelledby="faq-t">
  <div class="title"><p class="eyebrow">Good to know</p><h2 id="faq-t">Questions, Answered</h2></div>
  <div class="faq-grid">${homeFaqs.map((f) => `<details><summary>${esc(f.q)}</summary><p>${f.a}</p></details>`).join('')}</div>
</section>
</main>` + footer();
}

function collectionPage(c) {
  const items = mixBrands(byTag(c.slug), 999);
  const brands = [...new Set(items.map((p) => p.partner))];
  const list = [['/', 'Home'], ['/collections/lace-wigs.html', 'Wigs'], [`/collections/${c.slug}.html`, c.title]];
  const prices = items.map((p) => p.price).filter(Boolean);
  const description = `${c.intro} Shop ${items.length} ${c.title.toLowerCase()} from ${brands.map((b) => P[b].name).join(', ')}${prices.length ? `, from ${money(Math.min(...prices))}` : ''}.`;
  const related = guides.filter((g) => (c.slug === 'hair-care' ? g.slug === 'human-hair-wig-care' : g.slug !== 'human-hair-wig-care')).slice(0, 3);
  return head({ title: `${c.title} | Shop ${items.length} Styles | ${site.name}`, description, canonical: `/collections/${c.slug}.html`, image: ref(c.hero), schema: [crumbSchema(list), itemList(c.title, items)] }) + header(c.slug === 'hair-care' ? 'Hair Care' : 'Wigs') + `
<main id="main">
<header class="page-hero"><div class="wrap">${crumbs(list)}<span class="eyebrow">${items.length} styles</span><h1>${esc(c.h1)}</h1><p class="lead">${esc(c.intro)}</p>
  <ul class="pill-nav" aria-label="Collections">${collections.map((x) => `<li><a href="/collections/${x.slug}.html"${x.slug === c.slug ? ' aria-current="page"' : ''}>${esc(x.title.replace(/ Wigs$| & Keratin Treatments$/, ''))}</a></li>`).join('')}</ul>
</div></header>
<section class="section" style="padding-top:36px"><div class="wrap">
  ${brands.length > 1 ? `<div class="pill-nav" data-filter="grid" role="group" aria-label="Filter by brand" style="margin:0 0 14px"><button type="button" data-brand="all" aria-pressed="true">All brands</button>${brands.map((b) => `<button type="button" data-brand="${b}" aria-pressed="false">${esc(P[b].name)}</button>`).join('')}</div>` : ''}
  <p class="count" data-count>${items.length} styles</p>
  <div class="grid" id="grid">${items.map((p) => card(p)).join('')}</div>
</div></section>
<section class="section tint"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Helpful reads</span><h2>Before you buy</h2></div></div>${carousel(related.map(guideCard), 'Guides', 'car-g')}</div></section>
${newsletter()}
</main>` + footer();
}

function brandPage(b) {
  const items = byBrand(b.id);
  const cats = {};
  for (const p of items) (cats[p.kind === 'curated' ? 'In The Edit' : p.category] ||= []).push(p);
  const list = [['/', 'Home'], ['/brands/', 'Brands'], [`/brands/${b.id}.html`, b.name]];
  const prices = items.map((p) => p.price).filter(Boolean);
  return head({ title: `${b.name} Wigs & Hair: ${items.length} Picks & Prices | ${site.name}`, description: `${b.tagline} Browse ${items.length} ${b.name} picks${prices.length ? ` from ${money(Math.min(...prices))}` : ''}, with links to the official ${b.domain} store.`, canonical: `/brands/${b.id}.html`, image: items[0]?.img, schema: [crumbSchema(list), itemList(b.name, items)] }) + header('Brands') + `
<main id="main">
<header class="page-hero"><div class="wrap">${crumbs(list)}<span class="eyebrow">Official store · ${esc(b.domain)}</span><h1>${esc(b.name)}</h1><p class="lead">${esc(b.tagline)} <strong>Known for:</strong> ${esc(b.known)}.</p>
  <div class="hero-cta" style="margin:24px 0 0"><a class="btn btn-primary" href="${esc(b.url)}" target="_blank" rel="sponsored noopener">Shop ${esc(b.name)} ${ic.ext}</a></div>
  <ul class="pill-nav">${Object.keys(cats).map((c) => `<li><a href="#${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">${esc(c)} (${cats[c].length})</a></li>`).join('')}</ul>
</div></header>
${Object.entries(cats).map(([c, ps], i) => `<section class="section${i % 2 ? ' tint' : ''}" id="${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" style="padding:48px 0"><div class="wrap"><div class="section-head" style="margin-bottom:8px"><div><h2 style="font-size:2rem">${esc(c)}</h2></div></div>${carousel(ps.map((p) => card(p)), c, `car-${b.id}-${i}`)}</div></section>`).join('')}
${newsletter()}
</main>` + footer();
}

function brandsIndex() {
  const list = [['/', 'Home'], ['/brands/', 'Brands']];
  return head({ title: `Wig Brands Compared: UNice vs Zlike vs Allove vs Jumy Bee | ${site.name}`, description: 'Compare UNice, Zlike, Allove Hair and Jumy Bee: what each brand is known for, signature lace and textures, and starting prices.', canonical: '/brands/', schema: [crumbSchema(list)] }) + header('Brands') + `
<main id="main">
<header class="page-hero"><div class="wrap">${crumbs(list)}<h1>Our <em>brands</em></h1><p class="lead">Four official stores, each with a different strength. Here's how they compare.</p></div></header>
<section class="section" style="padding-top:36px"><div class="wrap">
  <div class="brands">${data.partners.map((b) => { const ps = byBrand(b.id).map((p) => p.price).filter(Boolean); return `<a class="brand-card" href="/brands/${b.id}.html"><span class="wm">${esc(b.name)}</span><p>${esc(b.tagline)}</p><span class="meta">${byBrand(b.id).length} picks${ps.length ? ` · from ${money(Math.min(...ps))}` : ''}</span></a>`; }).join('')}</div>
  <div class="table-wrap" style="margin-top:40px"><table class="compare"><thead><tr><th>Brand</th><th>Known for</th><th>Best if you want</th></tr></thead><tbody>
    <tr><td><strong>UNice</strong></td><td>Bye-Bye Slip & Bye-Bye Knots glueless 7x5 wigs, HD lace</td><td>The easiest beginner install</td></tr>
    <tr><td><strong>Zlike</strong></td><td>250-300% density, pre-styled cuts, boho braids, bold colors</td><td>Volume and trend-led styles</td></tr>
    <tr><td><strong>Allove Hair</strong></td><td>13x4/13x6 HD frontals, 30"+ lengths, balayage</td><td>Long, full, frontal looks</td></tr>
    <tr><td><strong>Jumy Bee</strong></td><td>Formaldehyde-free keratin & botox-style masks</td><td>Smooth, frizz-free natural hair</td></tr>
  </tbody></table></div>
</div></section>
${newsletter()}
</main>` + footer();
}

function productPage(p) {
  const b = P[p.partner];
  const list = [['/', 'Home'], [`/brands/${b.id}.html`, b.name], [p.page, p.name]];
  const col = collections.find((c) => p.tags.includes(c.slug)) || collections[0];
  const similar = mixBrands(all.filter((x) => x !== p && x.tags.some((t) => p.tags.includes(t) && t !== 'lace-wigs')), 12);
  const faqs = [
    { q: p.partner === 'jumybee' ? 'How often should I use it?' : 'Is this wig beginner friendly?', a: p.partner === 'jumybee' ? 'Follow the directions on the pack. Masks are typically used weekly or every few washes, and keratin treatments last several weeks. Do a strand test first.' : /glueless|wear|go|pre-cut|drawstring/i.test(p.name + p.lace + p.description) ? 'Yes. It has beginner-friendly features such as a glueless or wear-and-go design and pre-cut or pre-plucked lace, so it can be worn without adhesive.' : 'It suits most wearers. If it\'s your first lace wig, compare it with our <a href="/collections/glueless-wigs.html">glueless picks</a>.' },
    { q: 'Where can I buy it?', a: `It's sold by ${b.name} on its official store, ${b.domain}. Use the Shop button to see today's price, colors and lengths.` },
  ];
  const productSchema = { '@type': 'Product', name: p.name, image: [p.img.startsWith('http') ? p.img : abs(p.img)], description: p.description, brand: { '@type': 'Brand', name: b.name }, category: p.category, url: abs(p.page) };
  return head({ title: `${p.name} | ${site.name}`, description: `${p.description} ${p.lace !== 'N/A' ? p.lace + '. ' : ''}${p.density !== 'N/A' ? p.density + ' density. ' : ''}Shop at ${b.name}.`.slice(0, 300), canonical: p.page, image: p.img.startsWith('http') ? p.img : abs(p.img), type: 'product', schema: [crumbSchema(list), productSchema, faqSchema(faqs)] }) + header('Wigs') + `
<main id="main">
<div class="wrap" style="padding-top:26px">${crumbs(list)}</div>
<div class="wrap pdp">
  <div class="pdp-media"><img src="${esc(p.img)}" alt="${esc(p.name)}" width="600" height="750" fetchpriority="high"></div>
  <div>
    <span class="eyebrow">${esc(b.name)} · ${esc(p.category)}</span>
    <h1>${esc(p.name)}</h1>
    <p class="lead" style="color:var(--ink-2)">${esc(p.description)}</p>
    <dl class="spec">
      <div><dt>Texture</dt><dd>${esc(p.texture)}</dd></div>
      <div><dt>${p.partner === 'jumybee' ? 'Size' : 'Length'}</dt><dd>${esc(p.lengthLabel)}</dd></div>
      <div><dt>${p.partner === 'jumybee' ? 'Formula' : 'Lace'}</dt><dd>${esc(p.lace)}</dd></div>
      <div><dt>${p.partner === 'jumybee' ? 'Best for' : 'Density'}</dt><dd>${esc(p.partner === 'jumybee' ? p.bestFor : p.density)}</dd></div>
    </dl>
    <ul class="ticks">${(p.features || []).map((f) => `<li>${esc(f)}</li>`).join('')}${p.partner !== 'jumybee' ? `<li>Best for: ${esc(p.bestFor)}</li>` : ''}</ul>
    <div style="display:flex;gap:12px;flex-wrap:wrap"><a class="btn btn-primary" href="${esc(p.url)}" target="_blank" rel="sponsored noopener">Shop at ${esc(b.name)} ${ic.ext}</a><a class="btn btn-ghost" href="/collections/${col.slug}.html">More ${esc(col.title.toLowerCase())}</a></div>
    <p class="note">Sold and shipped by ${esc(b.name)} (${esc(b.domain)}). Colors, lengths and prices are shown on the official store. We may earn a commission at no extra cost to you.</p>
    <div class="faq" style="margin-top:26px">${faqs.map((f) => `<details><summary style="font-size:1.1rem">${esc(f.q)}</summary><div class="answer"><p>${f.a}</p></div></details>`).join('')}</div>
  </div>
</div>
<section class="section"><div class="wrap"><div class="section-head"><div><span class="eyebrow">You may also like</span><h2>Similar <em>styles</em></h2></div></div>${carousel(similar.map((x) => card(x)), 'Similar styles', 'car-sim')}</div></section>
${newsletter()}
</main>` + footer();
}

function guidePage(g) {
  const list = [['/', 'Home'], ['/guides/', 'Guides'], [g.path, g.short]];
  const toc = [...g.body.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g)];
  const recs = g.slug === 'human-hair-wig-care' ? byTag('hair-care').slice(0, 4) : curated.filter((p) => p.partner !== 'jumybee').slice(0, 4);
  const art = { '@type': 'Article', headline: g.title, description: g.description, image: ref(g.img), datePublished: data.updated, dateModified: data.updated, author: { '@type': 'Organization', name: `${site.name} editors` }, publisher: { '@id': site.url + '/#org' }, mainEntityOfPage: abs(g.path) };
  return head({ title: `${g.title} | ${site.name}`, description: g.description, canonical: g.path, image: ref(g.img), type: 'article', schema: [crumbSchema(list), art, faqSchema(g.faqs)] }) + header('Guides') + `
<main id="main">
<header class="page-hero"><div class="wrap">${crumbs(list)}<span class="eyebrow">${esc(g.category)} · ${g.readMins} min read</span><h1>${esc(g.title)}</h1><p class="lead">${esc(g.description)}</p></div></header>
<div class="wrap article">
  <article class="prose"><div class="quick"><strong>Quick answer</strong><p>${g.quick}</p></div>${g.body}
    <section style="margin-top:40px">${faqBlock(g.faqs, 'FAQs').replace('class="center" ', '')}</section>
  </article>
  <aside><div class="aside"><h4>On this page</h4><ol class="toc">${toc.map((m) => `<li><a href="#${m[1]}">${m[2]}</a></li>`).join('')}</ol><h4 style="margin-top:20px">Shop the look</h4>${recs.map((p) => `<a class="mini" href="${esc(p.kind === 'curated' ? p.page : p.url)}"${p.kind === 'curated' ? '' : ' target="_blank" rel="sponsored noopener"'}><img src="${esc(p.img)}" alt="" width="58" height="70" loading="lazy"><span><small>${esc(P[p.partner].name)}</small>${esc(p.name.length > 60 ? p.name.slice(0, 57) + '…' : p.name)}</span></a>`).join('')}</div></aside>
</div>
<section class="section"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Keep reading</span><h2>More <em>guides</em></h2></div></div>${carousel(guides.filter((x) => x !== g).map(guideCard), 'More guides', 'car-more')}</div></section>
${newsletter()}
</main>` + footer();
}

function guidesIndex() {
  const list = [['/', 'Home'], ['/guides/', 'Guides']];
  return head({ title: `Wig Guides: Lace, Glueless, Density & Care | ${site.name}`, description: 'Plain-English wig guides: HD vs transparent lace, glueless wigs for beginners, density and length, wig care and choosing a style for your face shape.', canonical: '/guides/', schema: [crumbSchema(list)] }) + header('Guides') + `
<main id="main"><header class="page-hero"><div class="wrap">${crumbs(list)}<h1>The <em>journal</em></h1><p class="lead">Everything you need to choose, wear and care for a wig, explained simply.</p></div></header>
<section class="section" style="padding-top:36px"><div class="wrap">${carousel(guides.map(guideCard), 'Guides', 'car-all')}</div></section>
<section class="section tint"><div class="wrap"><div class="section-head"><div><span class="eyebrow">Shop</span><h2>The <em>Edit</em></h2></div></div>${carousel(curated.map((p) => card(p)), 'The Edit', 'car-e')}</div></section>
${newsletter()}</main>` + footer();
}

function simple(pg) {
  const list = [['/', 'Home'], ['/' + pg.file, pg.h1]];
  return head({ title: `${pg.title} | ${site.name}`, description: pg.description, canonical: '/' + pg.file, schema: [crumbSchema(list)] }) + header(pg.active || '') + `
<main id="main"><header class="page-hero"><div class="wrap">${crumbs(list)}<h1>${esc(pg.h1)}</h1></div></header><div class="wrap"><div class="legal prose">${pg.body}</div></div>${newsletter()}</main>` + footer();
}

// ---------- write ----------
fs.mkdirSync(path.join(ROOT, 'assets'), { recursive: true });
fs.copyFileSync(path.join(ROOT, 'src/site.css'), path.join(ROOT, 'assets/site.css'));
fs.copyFileSync(path.join(ROOT, 'src/site.js'), path.join(ROOT, 'assets/site.js'));
write('index.html', home());
for (const c of collections) write(`collections/${c.slug}.html`, collectionPage(c));
write('brands/index.html', brandsIndex());
for (const b of data.partners) write(`brands/${b.id}.html`, brandPage(b));
for (const p of curated) write(`products/${p.id}.html`, productPage(p));
write('guides/index.html', guidesIndex());
for (const g of guides) write(`guides/${g.slug}.html`, guidePage(g));
const sp = pages(site); for (const pg of sp) write(pg.file, simple(pg));
write('404.html', head({ title: `Page not found | ${site.name}`, description: 'Page not found.', canonical: '/404.html', noindex: true }) + header() + `<main id="main"><section class="section"><div class="wrap center" style="max-width:640px"><span class="eyebrow">404</span><h1>Let's find you <em>something better</em></h1><p class="lead" style="margin:0 auto 26px">That page has moved or doesn't exist.</p><ul class="pill-nav" style="justify-content:center"><li><a href="/">Home</a></li><li><a href="/#the-edit">The Edit</a></li><li><a href="/collections/glueless-wigs.html">Glueless wigs</a></li><li><a href="/guides/">Guides</a></li></ul></div></section></main>` + footer());

const searchIndex = [
  ...guides.map((g) => ({ t: g.title, s: 'Guide', u: g.path, k: `${g.category} ${g.description}`, i: ref(g.img) || '' })),
  ...collections.map((c) => ({ t: c.title, s: 'Collection', u: `/collections/${c.slug}.html`, k: c.intro, i: ref(c.hero) || '' })),
  ...data.partners.map((b) => ({ t: `${b.name} (all picks)`, s: 'Brand', u: `/brands/${b.id}.html`, k: b.tagline, i: '' })),
  ...all.map((p) => ({ t: p.name, s: `${P[p.partner].name}${p.price ? ' · ' + money(p.price) : ''}`, u: p.kind === 'curated' ? p.page : p.url, k: `${p.category || ''} ${(p.tags || []).join(' ')}`, i: p.img })),
];
write('search.json', JSON.stringify(searchIndex));
const urls = [['/', '1.0', 'daily'], ['/brands/', '0.8', 'weekly'], ['/guides/', '0.8', 'weekly'], ...collections.map((c) => [`/collections/${c.slug}.html`, '0.9', 'weekly']), ...data.partners.map((b) => [`/brands/${b.id}.html`, '0.8', 'weekly']), ...curated.map((p) => [p.page, '0.7', 'weekly']), ...guides.map((g) => [g.path, '0.7', 'monthly']), ...sp.map((pg) => ['/' + pg.file, '0.3', 'yearly'])];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, pr, cf]) => `  <url><loc>${abs(u)}</loc><lastmod>${V}</lastmod><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /*?utm_*\nDisallow: /*?fbclid=*\n\n# AI answer engines welcome\nUser-agent: GPTBot\nAllow: /\nUser-agent: OAI-SearchBot\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUser-agent: Claude-SearchBot\nAllow: /\nUser-agent: PerplexityBot\nAllow: /\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
write('llms.txt', `# ${site.name}\n\n> ${site.description}\n\nIndependent affiliate edit; products are sold by the official brand stores.\n\n## Guides\n${guides.map((g) => `- [${g.title}](${abs(g.path)}): ${strip(g.quick)}`).join('\n')}\n\n## Collections\n${collections.map((c) => `- [${c.title}](${abs('/collections/' + c.slug + '.html')}): ${c.intro}`).join('\n')}\n\n## Brands\n${data.partners.map((b) => `- [${b.name}](${abs('/brands/' + b.id + '.html')}) (${b.domain}): ${b.tagline}`).join('\n')}\n`);
write('site.webmanifest', JSON.stringify({ name: site.name, short_name: 'hairstyle', start_url: '/', display: 'standalone', background_color: '#ffffff', theme_color: '#2563eb', icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }, { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }] }, null, 2));
write('favicon.svg', mark.replace('class="brand-mark" ', 'xmlns="http://www.w3.org/2000/svg" ').replace(' aria-hidden="true"', ''));
console.log(`Built: home, ${collections.length} collections, ${data.partners.length + 1} brand pages, ${curated.length} products, ${guides.length + 1} guides, ${sp.length} pages · ${all.length} products total`);
