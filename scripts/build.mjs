#!/usr/bin/env node
/**
 * hairstyle.company static site builder (zero dependencies, Node 18+)
 *   node scripts/build.mjs
 * Reads data/partners.json, src/site.json, src/content.mjs, src/site.css, src/site.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const fitTitle = (t) => { if (t.length <= 65) return t; for (const sep of [' | ', ' — ', ' – ', ' - ']) { const i = t.lastIndexOf(sep); if (i > 29 && i <= 65) return t.slice(0, i); } return t; };
const fitDesc = (d) => { if (!d || d.length <= 165) return d; const c = d.slice(0, 158); return c.slice(0, c.lastIndexOf(' ')).replace(/[,;:\-— ]+$/, '') + '…'; };

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
const mark = `<svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="#5a2448"/><path d="M13 29c0-9 3-15 9-17 2.5-.8 5 .2 5 .2s-4 1.2-5.5 5.8C20 22.6 21 29 21 29" fill="none" stroke="#f3e2dd" stroke-width="2.2" stroke-linecap="round"/><path d="M19 29c0-6 2-10.5 6-12.5" fill="none" stroke="#c9857f" stroke-width="2.2" stroke-linecap="round"/></svg>`;

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
<title>${esc(fitTitle(title))}</title>
<meta name="description" content="${esc(fitDesc(description))}">
<link rel="canonical" href="${abs(canonical)}">
<meta name="robots" content="${noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1'}">
<meta name="theme-color" content="#5a2448">
<meta property="og:site_name" content="${site.name}"><meta property="og:type" content="${type}">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${abs(canonical)}"><meta property="og:image" content="${esc(og)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${esc(og)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://cdn.shopify.com" crossorigin><link rel="preconnect" href="https://ima.unice.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&display=swap" rel="stylesheet">
${preload}
<link rel="stylesheet" href="/assets/site.css?v=${V}">
<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': [orgSchema(), webSchema(), ...schema] })}</script>
</head>`;
}

function header(active = '') {
  return `<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header"><div class="container header-inner">
  <a class="brand" href="/" aria-label="${site.name} home">${mark}<span>hairstyle<i>.company</i></span></a>
  <button class="menu-btn" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu" data-menu-btn>${ic.menu}</button>
  <nav class="nav" id="site-nav" aria-label="Main">
    ${NAV.map(([h, t]) => `<a href="${h}"${active === t ? ' aria-current="page"' : ''}>${t}</a>`).join('\n    ')}
    <a class="btn btn-primary btn-sm" href="/#the-edit">Shop the Edit</a>
  </nav>
</div></header>`;
}

function newsletter() {
  const n = site.newsletter || {};
  return `<section class="section" id="newsletter" aria-labelledby="nl-t"><div class="container"><div class="newsletter">
  <div><span class="eyebrow" style="color:#e9b8a8">The Hair Letter</span><h2 id="nl-t">New drops, <em style="color:#f3c9bd">real</em> deals, zero spam.</h2><p>One email a month with new arrivals, brand sales and our latest how-tos.</p></div>
  <div>
    <form class="nl-form" action="${esc(n.action || 'mailto:' + site.email)}" method="${n.method || 'post'}" data-newsletter data-ajax data-fallback="${esc(site.email)}">${Object.entries(n.hidden || {}).map(([k, v]) => `<input type="hidden" name="${esc(k)}" value="${esc(v)}">`).join('')}
      <label class="sr-only" for="nl-email">Email address</label>
      <input id="nl-email" type="email" name="${esc(n.emailField || 'email')}" placeholder="you@example.com" autocomplete="email" required>
      <div class="hp" aria-hidden="true"><input type="text" name="botcheck" tabindex="-1" autocomplete="off"></div>
      <button class="btn btn-light" type="submit">${ic.mail} Subscribe</button>
    </form>
    <p class="nl-note">By subscribing you agree to our <a href="/privacy.html">privacy policy</a>. Unsubscribe anytime.</p>
    <p class="nl-msg" role="status" aria-live="polite"></p>
  </div>
</div></div></section>`;
}

function footer() {
  const soc = Object.entries(site.social || {}).filter(([k, v]) => socialIc[k] && v);
  return `<footer class="site-footer">
  <div class="container footer-top">
    <div class="footer-about"><a class="brand" href="/">${mark}<span>hairstyle<i>.company</i></span></a>
      <p style="margin-top:14px;max-width:40ch">${esc(site.description)}</p>
      <div class="social" aria-label="Follow us">${soc.map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener me" aria-label="${socialName[k]}">${socialIc[k]}</a>`).join('')}</div>
      <p class="footer-contact"><a href="mailto:${esc(site.email)}">${esc(site.email)}</a><a href="tel:${esc(site.phoneTel || '')}">${esc(site.phone || '')}</a></p>
    </div>
    <div><h3>Shop wigs</h3><ul>${collections.filter((c) => c.slug !== 'hair-care').slice(0, 7).map((c) => `<li><a href="/collections/${c.slug}.html">${esc(c.title)}</a></li>`).join('')}</ul></div>
    <div><h3>Brands & care</h3><ul>${data.partners.map((p) => `<li><a href="/brands/${p.id}.html">${esc(p.name)}</a></li>`).join('')}<li><a href="/collections/hair-care.html">Hair care</a></li></ul></div>
    <div><h3>Learn</h3><ul>${guides.slice(0, 4).map((g) => `<li><a href="${g.path}">${esc(g.short)}</a></li>`).join('')}<li><a href="/about.html">About</a></li><li><a href="/affiliate-disclosure.html">Affiliate disclosure</a></li><li><a href="/privacy.html">Privacy</a></li></ul></div>
  </div>
  <div class="container footer-bottom"><span>© <span data-year>${new Date().getFullYear()}</span> ${site.name}</span><p>All products are sold by official brand stores. As an affiliate partner we may earn a commission on purchases made through our links, at no extra cost to you. Prices are starting prices and may change.</p></div>
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
  const chips = p.kind === 'curated' ? [p.lace, p.density !== 'N/A' ? p.density : '', p.lengthLabel].filter(Boolean).slice(0, 3) : [p.category].filter(Boolean);
  return `<article class="card" data-brand="${p.partner}">
  <a class="card-media" href="${esc(href)}"${ext} tabindex="-1" aria-hidden="true"><img src="${esc(p.img)}" alt="${esc(p.name)}" width="400" height="500" loading="${eager ? 'eager' : 'lazy'}" decoding="async">${p.kind === 'curated' ? '<span class="pill">The Edit</span>' : ''}</a>
  <div class="card-body">
    <span class="card-brand">${esc(b.name)}</span>
    <h3><a href="${esc(href)}"${ext}>${esc(p.name)}</a></h3>
    <ul class="chips">${chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
    <div class="card-foot">${p.price ? `<span class="price"><small>From</small>${money(p.price)}</span>` : '<span class="price" style="font-size:.95rem">Official store</span>'}<a class="btn btn-primary btn-sm" href="${esc(p.url)}" target="_blank" rel="sponsored noopener" aria-label="Shop ${esc(p.name)} at ${esc(b.name)}">Shop</a></div>
  </div>
</article>`;
}
function carousel(items, label, id) {
  return `<div class="carousel" data-carousel>
  <div class="car-top"><div class="car-controls"><button class="car-btn" type="button" data-prev aria-label="Previous ${esc(label)}" aria-controls="${id}">${ic.left}</button><button class="car-btn" type="button" data-next aria-label="Next ${esc(label)}" aria-controls="${id}">${ic.right}</button></div></div>
  <div class="track" id="${id}" role="region" aria-roledescription="carousel" aria-label="${esc(label)}" tabindex="0">${items.join('')}</div>
  <div class="car-progress" aria-hidden="true"><span></span></div>
</div>`;
}
const guideCard = (g) => `<a class="post" href="${g.path}"><div class="post-media"><img src="${esc(ref(g.img))}" alt="" width="440" height="300" loading="lazy" decoding="async"></div><div class="post-body"><span class="post-meta">${esc(g.category)} · ${g.readMins} min</span><h3>${esc(g.title)}</h3><p>${esc(g.description)}</p></div></a>`;
const backLink = (l) => l.length > 1 ? `<a class="back-link" href="${l[l.length - 2][0]}" onclick="if(document.referrer&&document.referrer.indexOf(location.host)>-1&&history.length>1){history.back();return false}"><span aria-hidden="true">&larr;</span> Back</a>` : '';
const crumbs = (l) => backLink(l) + `<nav class="crumbs" aria-label="Breadcrumb"><ol>${l.map(([h, t], i) => `<li>${i < l.length - 1 ? `<a href="${h}">${esc(t)}</a>` : `<span aria-current="page">${esc(t)}</span>`}</li>`).join('')}</ol></nav>`;
const faqBlock = (f, h = 'Questions, answered') => `<div class="faq"><h2 class="center" style="margin-bottom:18px">${h}</h2>${f.map((x, i) => `<details${i === 0 ? ' open' : ''}><summary>${esc(x.q)}</summary><div class="answer"><p>${x.a}</p></div></details>`).join('')}</div>`;
const itemList = (name, items) => ({ '@type': 'ItemList', name, numberOfItems: items.length, itemListElement: items.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: p.kind === 'curated' ? abs(p.page) : p.productUrl })) });

// ---------- pages ----------
function home() {
  const h = [ref('unice-2'), ref('unice-4'), ref('unice-14')];
  const texTiles = ['body-wave', 'curly-hair', 'straight-hair', 'deep-wave', 'bob-short-wigs', 'blonde-hair'].map((s) => collections.find((c) => c.slug === s));
  const words = ['HD Lace', 'Glueless', 'Wear & Go', 'Pre-Plucked', 'Bleached Knots', '100% Human Hair', 'Keratin Care', 'Body Wave', 'Kinky Curly', 'Honey Blonde'];
  return head({
    title: 'hairstyle | Human Hair Wigs, Glueless & HD Lace, Curated',
    description: 'Shop a curated edit of glueless, HD lace and human hair wigs plus keratin hair care from UNice, Zlike, Allove Hair and Jumy Bee. Specs explained, official stores only.',
    canonical: '/', image: h[0],
    preload: `<link rel="preload" as="image" href="${esc(h[0])}" fetchpriority="high">`,
    schema: [itemList('The Edit: 12 curated wigs and hair care', curated), faqSchema(homeFaqs)],
  }) + header() + `
<main id="main">
<section class="hero"><div class="container hero-inner">
  <div>
    <span class="eyebrow">The curated hair edit · ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
    <h1>Hair that feels like <em>you</em>, only easier.</h1>
    <p class="lead">Glueless human hair wigs, melt-ready HD lace and salon-grade keratin care, hand-picked from four official brand stores and explained without the jargon.</p>
    <div class="hero-cta"><a class="btn btn-primary" href="#the-edit">Shop the Edit ${ic.arrow}</a><a class="btn btn-ghost" href="/guides/glueless-wigs-for-beginners.html">New to wigs? Start here</a></div>
    <ul class="stats"><li><b>${all.length}+</b><span>Styles</span></li><li><b>4</b><span>Official brands</span></li><li><b>100%</b><span>Human hair wigs</span></li></ul>
  </div>
  <div class="collage" aria-hidden="true">
    <figure class="c1"><img src="${esc(h[0])}" alt="" width="520" height="690" fetchpriority="high"></figure>
    <figure class="c2"><img src="${esc(h[1])}" alt="" width="380" height="500" loading="lazy"></figure>
    <figure class="c3"><img src="${esc(h[2])}" alt="" width="380" height="500" loading="lazy"></figure>
    <svg class="spin" viewBox="0 0 100 100"><defs><path id="circ" d="M50 50m-38 0a38 38 0 1 1 76 0a38 38 0 1 1-76 0"/></defs><circle cx="50" cy="50" r="30" fill="#fff"/><text><textPath href="#circ">Glueless · HD Lace · Wear & Go ·</textPath></text><path d="M44 50h12M50 44l6 6-6 6" stroke="#5a2448" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>
    <div class="tag"><small>Wear & go</small><strong>Pre-cut lace, pre-plucked, on in 5 minutes</strong></div>
  </div>
</div></section>

<div class="marquee" aria-hidden="true"><div class="marquee-track">${[...words, ...words].map((w) => `<span>${w}</span>`).join('')}</div></div>

<section class="section" aria-labelledby="tex-t"><div class="container">
  <div class="section-head"><div><span class="eyebrow">Shop by texture</span><h2 id="tex-t">Find your <em>texture</em></h2></div><a class="link-arrow" href="/collections/lace-wigs.html">All wigs ${ic.arrow}</a></div>
  <div class="textures">${texTiles.map((c) => `<a class="tex" href="/collections/${c.slug}.html"><img src="${esc(ref(c.hero))}" alt="" width="300" height="400" loading="lazy" decoding="async"><span>${esc(c.h1.replace(/ wigs$/i, ''))}<small>${byTag(c.slug).length} styles</small></span></a>`).join('')}</div>
</div></section>

<section class="section tint" id="the-edit" aria-labelledby="edit-t"><div class="container">
  <div class="section-head"><div><span class="eyebrow">The Edit</span><h2 id="edit-t">Twelve pieces we'd <em>actually</em> wear</h2><p>Our shortlist across four brands: specs checked, beginner-friendly features first.</p></div></div>
  ${carousel(curated.map((p, i) => card(p, { eager: i < 2 })), 'The Edit', 'car-edit')}
</div></section>

<section class="section" id="brands" aria-labelledby="brands-t"><div class="container">
  <div class="section-head"><div><span class="eyebrow">Shop by brand</span><h2 id="brands-t">Four official stores, <em>one</em> edit</h2></div><a class="link-arrow" href="/brands/">Compare brands ${ic.arrow}</a></div>
  ${data.partners.map((b) => `<div class="brand-band" id="brand-${b.id}">
    <div class="band-head"><div><h3>${esc(b.name)}</h3><p>${esc(b.tagline)}</p></div><div style="display:flex;gap:10px;flex-wrap:wrap"><a class="btn btn-ghost btn-sm" href="/brands/${b.id}.html">View all ${byBrand(b.id).length}</a><a class="btn btn-primary btn-sm" href="${esc(b.url)}" target="_blank" rel="sponsored noopener">Visit ${esc(b.name)} ${ic.ext}</a></div></div>
    ${carousel(mix(byBrand(b.id), 10).map((p) => card(p)), b.name, 'car-' + b.id)}
  </div>`).join('')}
</div></section>

<section class="section blush" aria-labelledby="lace-t"><div class="container split">
  <figure><img src="${esc(ref('unice-0'))}" alt="Close-up of a melted HD lace hairline on a body wave wig" width="560" height="700" loading="lazy" decoding="async"></figure>
  <div>
    <span class="eyebrow">Lace 101</span><h2 id="lace-t">Which lace is <em>right</em> for you?</h2>
    <p>Lace type decides how invisible your hairline looks; lace size decides how freely you can part and style.</p>
    <div class="table-wrap"><table class="compare"><thead><tr><th>Lace</th><th>Best for</th><th>Skill level</th></tr></thead><tbody>
      <tr><td><strong>7x5 glueless</strong></td><td>Quick, secure everyday wear</td><td>Beginner</td></tr>
      <tr><td><strong>5x5 closure</strong></td><td>Low maintenance, fixed parting</td><td>Beginner</td></tr>
      <tr><td><strong>13x4 frontal</strong></td><td>Ear-to-ear hairline, free parting</td><td>Intermediate</td></tr>
      <tr><td><strong>13x6 HD frontal</strong></td><td>Deep parts, most natural melt</td><td>Intermediate</td></tr>
      <tr><td><strong>360 / full lace</strong></td><td>High ponytails and updos</td><td>Advanced</td></tr>
    </tbody></table></div>
    <a class="btn btn-primary" href="/guides/hd-lace-vs-transparent-lace.html">Read the lace guide ${ic.arrow}</a>
  </div>
</div></section>

<section class="section" aria-labelledby="care-t"><div class="container">
  <div class="section-head"><div><span class="eyebrow">Hair care</span><h2 id="care-t">Smooth, <em>frizz-free</em> care</h2><p>Keratin smoothing and Japanese botox-style masks from Jumy Bee, plus the tools to keep every look fresh.</p></div><a class="link-arrow" href="/collections/hair-care.html">All hair care ${ic.arrow}</a></div>
  ${carousel(byTag('hair-care').map((p) => card(p)), 'Hair care', 'car-care')}
</div></section>

<section class="section tint" aria-labelledby="why-t"><div class="container">
  <div class="section-head"><div><span class="eyebrow">Why shop here</span><h2 id="why-t">Less guesswork, <em>better</em> hair days</h2></div></div>
  <div class="values">
    <div class="value"><span class="ic">${ic.shield}</span><h3>Official stores only</h3><p>Every link goes to the brand itself, for authentic hair and real warranties.</p></div>
    <div class="value"><span class="ic">${ic.sparkle}</span><h3>Specs, simplified</h3><p>Lace, density, length and cap explained in plain English.</p></div>
    <div class="value"><span class="ic">${ic.clock}</span><h3>Beginner-first</h3><p>Glueless, pre-plucked and pre-cut styles are always easy to find.</p></div>
    <div class="value"><span class="ic">${ic.leaf}</span><h3>Care that lasts</h3><p>Guides and treatments that keep hair soft, smooth and long-lasting.</p></div>
  </div>
</div></section>

<section class="section" aria-labelledby="guides-t"><div class="container">
  <div class="section-head"><div><span class="eyebrow">The journal</span><h2 id="guides-t">Wig guides & <em>how-tos</em></h2></div><a class="link-arrow" href="/guides/">All guides ${ic.arrow}</a></div>
  ${carousel(guides.map(guideCard), 'Guides', 'car-guides')}
</div></section>

<section class="section tint" aria-label="FAQ"><div class="container">${faqBlock(homeFaqs)}</div></section>
${newsletter()}
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
<header class="page-hero"><div class="container">${crumbs(list)}<span class="eyebrow">${items.length} styles</span><h1>${esc(c.h1)}</h1><p class="lead">${esc(c.intro)}</p>
  <ul class="pill-nav" aria-label="Collections">${collections.map((x) => `<li><a href="/collections/${x.slug}.html"${x.slug === c.slug ? ' aria-current="page"' : ''}>${esc(x.title.replace(/ Wigs$| & Keratin Treatments$/, ''))}</a></li>`).join('')}</ul>
</div></header>
<section class="section" style="padding-top:36px"><div class="container">
  ${brands.length > 1 ? `<div class="pill-nav" data-filter="grid" role="group" aria-label="Filter by brand" style="margin:0 0 14px"><button type="button" data-brand="all" aria-pressed="true">All brands</button>${brands.map((b) => `<button type="button" data-brand="${b}" aria-pressed="false">${esc(P[b].name)}</button>`).join('')}</div>` : ''}
  <h2 class="sr-only">${esc(c.title)} products</h2><p class="count" data-count>${items.length} styles</p>
  <div class="grid" id="grid">${items.map((p) => card(p)).join('')}</div>
</div></section>
<section class="section tint"><div class="container"><div class="section-head"><div><span class="eyebrow">Helpful reads</span><h2>Before you buy</h2></div></div>${carousel(related.map(guideCard), 'Guides', 'car-g')}</div></section>
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
<header class="page-hero"><div class="container">${crumbs(list)}<span class="eyebrow">Official store · ${esc(b.domain)}</span><h1>${esc(b.name)}</h1><p class="lead">${esc(b.tagline)} <strong>Known for:</strong> ${esc(b.known)}.</p>
  <div class="hero-cta" style="margin:24px 0 0"><a class="btn btn-primary" href="${esc(b.url)}" target="_blank" rel="sponsored noopener">Shop ${esc(b.name)} ${ic.ext}</a></div>
  <ul class="pill-nav">${Object.keys(cats).map((c) => `<li><a href="#${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}">${esc(c)} (${cats[c].length})</a></li>`).join('')}</ul>
</div></header>
${Object.entries(cats).map(([c, ps], i) => `<section class="section${i % 2 ? ' tint' : ''}" id="${c.toLowerCase().replace(/[^a-z0-9]+/g, '-')}" style="padding:48px 0"><div class="container"><div class="section-head" style="margin-bottom:8px"><div><h2 style="font-size:2rem">${esc(c)}</h2></div></div>${carousel(ps.map((p) => card(p)), c, `car-${b.id}-${i}`)}</div></section>`).join('')}
${newsletter()}
</main>` + footer();
}

function brandsIndex() {
  const list = [['/', 'Home'], ['/brands/', 'Brands']];
  return head({ title: `Wig Brands Compared: UNice vs Zlike vs Allove vs Jumy Bee | ${site.name}`, description: 'Compare UNice, Zlike, Allove Hair and Jumy Bee: what each brand is known for, signature lace and textures, and starting prices.', canonical: '/brands/', schema: [crumbSchema(list)] }) + header('Brands') + `
<main id="main">
<header class="page-hero"><div class="container">${crumbs(list)}<h1>Our <em>brands</em></h1><p class="lead">Four official stores, each with a different strength. Here's how they compare.</p></div></header>
<section class="section" style="padding-top:36px"><div class="container">
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
<div class="container" style="padding-top:26px">${crumbs(list)}</div>
<div class="container pdp">
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
<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">You may also like</span><h2>Similar <em>styles</em></h2></div></div>${carousel(similar.map((x) => card(x)), 'Similar styles', 'car-sim')}</div></section>
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
<header class="page-hero"><div class="container">${crumbs(list)}<span class="eyebrow">${esc(g.category)} · ${g.readMins} min read</span><h1>${esc(g.title)}</h1><p class="lead">${esc(g.description)}</p></div></header>
<div class="container article">
  <article class="prose"><div class="quick"><strong>Quick answer</strong><p>${g.quick}</p></div>${g.body}
    <section style="margin-top:40px">${faqBlock(g.faqs, 'FAQs').replace('class="center" ', '')}</section>
  </article>
  <aside><div class="aside"><h2 class="aside-h">On this page</h2><ol class="toc">${toc.map((m) => `<li><a href="#${m[1]}">${m[2]}</a></li>`).join('')}</ol><h2 class="aside-h" style="margin-top:20px">Shop the look</h2>${recs.map((p) => `<a class="mini" href="${esc(p.kind === 'curated' ? p.page : p.url)}"${p.kind === 'curated' ? '' : ' target="_blank" rel="sponsored noopener"'}><img src="${esc(p.img)}" alt="" width="58" height="70" loading="lazy"><span><small>${esc(P[p.partner].name)}</small>${esc(p.name.length > 60 ? p.name.slice(0, 57) + '…' : p.name)}</span></a>`).join('')}</div></aside>
</div>
<section class="section"><div class="container"><div class="section-head"><div><span class="eyebrow">Keep reading</span><h2>More <em>guides</em></h2></div></div>${carousel(guides.filter((x) => x !== g).map(guideCard), 'More guides', 'car-more')}</div></section>
${newsletter()}
</main>` + footer();
}

function guidesIndex() {
  const list = [['/', 'Home'], ['/guides/', 'Guides']];
  return head({ title: `Wig Guides: Lace, Glueless, Density & Care | ${site.name}`, description: 'Plain-English wig guides: HD vs transparent lace, glueless wigs for beginners, density and length, wig care and choosing a style for your face shape.', canonical: '/guides/', schema: [crumbSchema(list)] }) + header('Guides') + `
<main id="main"><header class="page-hero"><div class="container">${crumbs(list)}<h1>The <em>journal</em></h1><p class="lead">Everything you need to choose, wear and care for a wig, explained simply.</p></div></header>
<section class="section" style="padding-top:36px"><div class="container"><h2 class="sr-only">All guides</h2>${carousel(guides.map(guideCard), 'Guides', 'car-all')}</div></section>
<section class="section tint"><div class="container"><div class="section-head"><div><span class="eyebrow">Shop</span><h2>The <em>Edit</em></h2></div></div>${carousel(curated.map((p) => card(p)), 'The Edit', 'car-e')}</div></section>
${newsletter()}</main>` + footer();
}

function simple(pg) {
  const list = [['/', 'Home'], ['/' + pg.file, pg.h1]];
  return head({ title: `${pg.title} | ${site.name}`, description: pg.description, canonical: '/' + pg.file, schema: [crumbSchema(list)] }) + header(pg.active || '') + `
<main id="main"><header class="page-hero"><div class="container">${crumbs(list)}<h1>${esc(pg.h1)}</h1></div></header><div class="container"><div class="legal prose">${pg.body}</div></div>${newsletter()}</main>` + footer();
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
write('404.html', head({ title: `Page not found | ${site.name}`, description: 'Page not found.', canonical: '/404.html', noindex: true }) + header() + `<main id="main"><section class="section"><div class="container center" style="max-width:640px"><span class="eyebrow">404</span><h1>Let's find you <em>something better</em></h1><p class="lead" style="margin:0 auto 26px">That page has moved or doesn't exist.</p><ul class="pill-nav" style="justify-content:center"><li><a href="/">Home</a></li><li><a href="/#the-edit">The Edit</a></li><li><a href="/collections/glueless-wigs.html">Glueless wigs</a></li><li><a href="/guides/">Guides</a></li></ul></div></section></main>` + footer());

const urls = [['/', '1.0', 'daily'], ['/brands/', '0.8', 'weekly'], ['/guides/', '0.8', 'weekly'], ...collections.map((c) => [`/collections/${c.slug}.html`, '0.9', 'weekly']), ...data.partners.map((b) => [`/brands/${b.id}.html`, '0.8', 'weekly']), ...curated.map((p) => [p.page, '0.7', 'weekly']), ...guides.map((g) => [g.path, '0.7', 'monthly']), ...sp.map((pg) => ['/' + pg.file, '0.3', 'yearly'])];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(([u, pr, cf]) => `  <url><loc>${abs(u)}</loc><lastmod>${V}</lastmod><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`).join('\n')}\n</urlset>\n`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /*?utm_*\nDisallow: /*?fbclid=*\n\n# AI answer engines welcome\nUser-agent: GPTBot\nAllow: /\nUser-agent: OAI-SearchBot\nAllow: /\nUser-agent: ClaudeBot\nAllow: /\nUser-agent: Claude-SearchBot\nAllow: /\nUser-agent: PerplexityBot\nAllow: /\nUser-agent: Google-Extended\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
write('llms.txt', `# ${site.name}\n\n> ${site.description}\n\nIndependent affiliate edit; products are sold by the official brand stores.\n\n## Guides\n${guides.map((g) => `- [${g.title}](${abs(g.path)}): ${strip(g.quick)}`).join('\n')}\n\n## Collections\n${collections.map((c) => `- [${c.title}](${abs('/collections/' + c.slug + '.html')}): ${c.intro}`).join('\n')}\n\n## Brands\n${data.partners.map((b) => `- [${b.name}](${abs('/brands/' + b.id + '.html')}) (${b.domain}): ${b.tagline}`).join('\n')}\n`);
write('site.webmanifest', JSON.stringify({ name: site.name, short_name: 'hairstyle', start_url: '/', display: 'standalone', background_color: '#fbf7f3', theme_color: '#5a2448', icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }, { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }] }, null, 2));
write('favicon.svg', mark.replace('class="brand-mark" ', 'xmlns="http://www.w3.org/2000/svg" ').replace(' aria-hidden="true"', ''));
console.log(`Built: home, ${collections.length} collections, ${data.partners.length + 1} brand pages, ${curated.length} products, ${guides.length + 1} guides, ${sp.length} pages · ${all.length} products total`);
