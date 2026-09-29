// Guides, FAQs, collections and static pages for hairstyle.company
const slug = (s) => s.toLowerCase().replace(/&[a-z]+;/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const ids = (html) => html.replace(/<h2>([^<]+)<\/h2>/g, (_, t) => `<h2 id="${slug(t)}">${t}</h2>`);
const mins = (html) => Math.max(3, Math.round(html.replace(/<[^>]+>/g, ' ').split(/\s+/).length / 220));

export const collections = [
  { slug: 'glueless-wigs', title: 'Glueless Wigs', h1: 'Glueless wigs', intro: 'Wear-and-go wigs that stay put with elastic bands, drawstrings and combs, so no glue or tape is needed. Ideal for beginners and quick changes.', hero: 'unice-4' },
  { slug: 'hd-lace-wigs', title: 'HD Lace Wigs', h1: 'HD lace wigs', intro: 'Ultra-thin HD lace that melts into most skin tones for an undetectable hairline, even up close.', hero: 'unice-0' },
  { slug: 'lace-wigs', title: 'Lace Front & Lace Wigs', h1: 'Lace wigs', intro: 'Every lace style in one place: 4x4 and 5x5 closures, 7x5 glueless, 13x4 and 13x6 frontals, 360 and full lace.', hero: 'allove-5' },
  { slug: 'body-wave', title: 'Body Wave Wigs', h1: 'Body wave wigs', intro: 'Soft, S-shaped waves with natural volume. Body wave is one of the easiest textures to maintain day to day.', hero: 'unice-1' },
  { slug: 'curly-hair', title: 'Curly Wigs', h1: 'Curly wigs', intro: 'Kinky curly, Burmese curls, afro coils and bouncy ringlets, with defined texture and lived-in softness.', hero: 'unice-3' },
  { slug: 'straight-hair', title: 'Straight Wigs', h1: 'Straight wigs', intro: 'Silky, bone and yaki straight styles, sleek and polished for every day.', hero: 'unice-6' },
  { slug: 'deep-wave', title: 'Deep & Water Wave Wigs', h1: 'Deep & water wave wigs', intro: 'Romantic deep waves and water waves that hold their shape and look full from root to tip.', hero: 'unice-10' },
  { slug: 'bob-short-wigs', title: 'Bob & Short Wigs', h1: 'Bob & short wigs', intro: 'Pre-styled bobs, pixies and shoulder-length cuts. Lightweight, lower-maintenance and quick to wear.', hero: 'unice-2' },
  { slug: 'blonde-hair', title: 'Blonde Wigs', h1: 'Blonde wigs', intro: '613 platinum, honey blonde and butterscotch tones, from bold statement blonde to soft, sun-kissed shades.', hero: 'unice-15' },
  { slug: 'colored-hair', title: 'Colored & Highlight Wigs', h1: 'Colored & highlight wigs', intro: 'Balayage, ombre, ginger, reddish brown and money-piece highlights. Color without the salon chair.', hero: 'unice-14' },
  { slug: 'hair-care', title: 'Hair Care & Keratin Treatments', h1: 'Hair care', intro: 'Formaldehyde-free keratin smoothing, Japanese botox-style hair masks, after-care and styling tools.', hero: 'jumybee-4' },
];

const raw = [
  {
    slug: 'hd-lace-vs-transparent-lace',
    title: 'HD Lace vs Transparent Lace (and 4x4 vs 7x5 vs 13x4 vs 13x6)',
    short: 'HD vs transparent lace',
    category: 'Lace 101',
    img: 'unice-0',
    description: 'What HD, transparent and Swiss lace mean, how closure and frontal sizes compare, and which lace is best for beginners, parting and natural hairlines.',
    quick: '<strong>HD lace</strong> is the thinnest, most invisible lace and melts into most skin tones. <strong>Transparent lace</strong> is slightly thicker and more durable. For size, <strong>7x5 glueless</strong> is the easiest for beginners, while <strong>13x4 and 13x6 frontals</strong> give ear-to-ear hairlines and the most parting freedom.',
    body: `
<p>Lace is what makes a wig look like it's growing from your scalp. Two things matter: the <em>type</em> of lace (how thin and invisible it is) and the <em>size</em> of the lace area (how much of your hairline and parting space it covers).</p>
<h2>Lace types compared</h2>
<table><thead><tr><th>Lace</th><th>Look</th><th>Durability</th><th>Best for</th></tr></thead><tbody>
<tr><td><strong>HD lace</strong></td><td>Thinnest, most undetectable, melts on most skin tones</td><td>Delicate, so handle gently</td><td>Close-up, photo-ready hairlines</td></tr>
<tr><td><strong>Transparent lace</strong></td><td>Very natural on light to medium skin tones; may need tinting on deeper tones</td><td>More durable than HD</td><td>Everyday wear, first-time lace wearers</td></tr>
<tr><td><strong>Swiss / medium brown lace</strong></td><td>Visible up close without customising</td><td>Most durable</td><td>Budget buys, frequent wear</td></tr>
</tbody></table>
<h2>Lace sizes explained</h2>
<p>Sizes are width x depth in inches, measured across the front of the head and back from the hairline.</p>
<ul>
<li><strong>4x4 / 5x5 closure:</strong> a square of lace at the centre. Limited parting, but affordable and low-maintenance.</li>
<li><strong>7x5 / 7x6 glueless:</strong> a wider lace area with more parting space. Usually comes with pre-cut lace, bleached knots and an elastic band, making it the go-to beginner wig.</li>
<li><strong>13x4 frontal:</strong> lace runs ear to ear with 4 inches of depth. Allows side, middle and deep parts plus baby-hair styling.</li>
<li><strong>13x6 frontal:</strong> the same width with 6 inches of depth, for deeper parts and more versatile styling.</li>
<li><strong>360 and full lace:</strong> lace all the way round (360) or across the whole cap (full lace). High ponytails and updos, but more care needed.</li>
</ul>
<h2>Which should you choose?</h2>
<ul>
<li><strong>First wig or quick installs:</strong> 7x5 glueless with HD or transparent lace.</li>
<li><strong>Most natural hairline:</strong> 13x4 or 13x6 HD lace frontal.</li>
<li><strong>Updos and high ponytails:</strong> 360 or full lace.</li>
<li><strong>Lowest maintenance:</strong> 5x5 closure.</li>
</ul>
<div class="callout"><strong>Tip:</strong> "Pre-plucked" (a natural, thinned hairline) and "bleached knots" (lighter knots that are invisible at the part) save the most customisation time.</div>`,
    faqs: [
      { q: 'Is HD lace better than transparent lace?', a: 'HD lace is thinner and less visible, so it looks more natural up close, especially on camera. Transparent lace is a little thicker and more durable. Both look natural; HD needs gentler handling.' },
      { q: 'What does 13x4 mean on a wig?', a: 'It means the lace area is 13 inches wide (ear to ear) and 4 inches deep from the hairline, which gives you free parting across the front of the wig.' },
      { q: 'Which lace wig is best for beginners?', a: 'A 7x5 glueless wig with pre-cut lace, pre-plucked hairline and bleached knots. It goes on in minutes with an elastic band and needs no glue.' },
    ],
  },
  {
    slug: 'glueless-wigs-for-beginners',
    title: 'Glueless Wigs for Beginners: How to Choose and Wear One',
    short: 'Glueless wigs for beginners',
    category: 'How-to',
    img: 'unice-4',
    description: 'What makes a wig glueless, the features to look for, and a simple step-by-step way to put one on securely in minutes.',
    quick: 'A glueless wig stays on with an <strong>adjustable elastic band, drawstring and combs</strong> instead of adhesive. Look for <strong>pre-cut lace, pre-plucked hairline and bleached knots</strong>, then fit the cap, secure the band and set the hairline. It takes about 5 minutes with no glue.',
    body: `
<p>Glueless wigs have made human hair wigs far easier to wear. There's no adhesive, no skin prep and nothing to remove at night.</p>
<h2>Features to look for</h2>
<ul>
<li><strong>Pre-cut lace:</strong> the excess lace is already trimmed, so it's ready to wear.</li>
<li><strong>Pre-plucked hairline:</strong> a softer, more natural-looking front edge.</li>
<li><strong>Bleached knots:</strong> knots at the part are lightened so they don't show as dots.</li>
<li><strong>Elastic band and/or drawstring:</strong> tightens the cap for a secure, customised fit.</li>
<li><strong>Combs or clips:</strong> grip your hair or wig cap to prevent sliding.</li>
</ul>
<h2>How to put on a glueless wig</h2>
<ol>
<li>Flatten your hair into braids or a low bun and pull on a wig cap if you like.</li>
<li>Adjust the elastic band or drawstring so the wig feels snug but not tight.</li>
<li>Place the wig slightly above your natural hairline and pull it back over your head.</li>
<li>Secure the combs, then position the lace just in front of your hairline.</li>
<li>Press the lace down with a soft wrap or edge band for a few minutes, then style.</li>
</ol>
<h2>Getting the right fit</h2>
<p>Most wigs come in an average cap size of about 22.5 inches. Measure around your head from the front hairline, above your ears and around the nape. If you're between sizes, the adjustable band handles small differences.</p>
<div class="callout"><strong>Tip:</strong> Take the wig off before sleeping and store it on a stand to keep the lace and hairline in shape.</div>`,
    faqs: [
      { q: 'Do glueless wigs fall off?', a: 'Not when fitted properly. The elastic band, drawstring and combs hold the wig firmly for everyday activities. For extra grip, wear a silicone wig grip band underneath.' },
      { q: 'Can I use glue on a glueless wig?', a: 'You can, but you don\'t need to. Many people add a light hold spray only at the lace for a flatter melt.' },
      { q: 'How long does a glueless wig take to put on?', a: 'Usually 5 to 10 minutes once you\'re used to it, which is much faster than a traditional glued lace install.' },
    ],
  },
  {
    slug: 'wig-density-and-length-guide',
    title: 'Wig Density & Length Guide: 150% vs 180% vs 250%',
    short: 'Density & length guide',
    category: 'Buying guide',
    img: 'allove-4',
    description: 'How wig density percentages look in real life, how length is measured, and why curly wigs look shorter than straight ones.',
    quick: '<strong>150%</strong> looks natural and light, <strong>180%</strong> is the popular full everyday look, and <strong>250-300%</strong> is extra glam volume. Length is measured with the hair stretched straight, so <strong>curly and wavy wigs look several inches shorter</strong> than the stated length.',
    body: `
<p>Density and length are the two numbers that most change how a wig looks on you, and they're easy to get wrong when shopping online.</p>
<h2>Density at a glance</h2>
<table><thead><tr><th>Density</th><th>Look</th><th>Good for</th></tr></thead><tbody>
<tr><td>130-150%</td><td>Natural, lightweight, less bulk</td><td>Everyday, bobs, natural-look lovers</td></tr>
<tr><td>180%</td><td>Full and bouncy</td><td>The most popular all-rounder</td></tr>
<tr><td>200-250%</td><td>Very full, glam volume</td><td>Long lengths, special occasions</td></tr>
<tr><td>300%</td><td>Maximum volume</td><td>Statement looks and very long wigs</td></tr>
</tbody></table>
<p>Longer wigs need higher density to look full at the ends, so 26 inches and above often look best at 200% or more.</p>
<h2>How length is measured</h2>
<p>Wig length is measured from the crown to the ends <strong>with the hair pulled straight</strong>. Waves and curls shrink that length visually:</p>
<ul>
<li><strong>Straight / yaki:</strong> appears true to length.</li>
<li><strong>Body wave:</strong> appears about 1-2 inches shorter.</li>
<li><strong>Deep / water wave:</strong> appears about 2-4 inches shorter.</li>
<li><strong>Kinky curly / afro:</strong> can appear 4-6+ inches shorter.</li>
</ul>
<h2>Quick length reference (on an average height)</h2>
<ul>
<li><strong>10-12":</strong> chin to shoulder, bob territory</li>
<li><strong>14-16":</strong> shoulder to collarbone</li>
<li><strong>18-22":</strong> chest to mid-back</li>
<li><strong>24-30":</strong> waist and beyond</li>
</ul>`,
    faqs: [
      { q: 'Is 180% density too thick?', a: 'For most people, no. 180% is the most popular density because it looks full without being bulky. Choose 150% if you want a lighter, more natural finish.' },
      { q: 'Why does my curly wig look shorter?', a: 'Wig length is measured straight. Curls and waves spring up, so a curly wig can look several inches shorter than the length listed.' },
    ],
  },
  {
    slug: 'human-hair-wig-care',
    title: 'How to Care for a Human Hair Wig (So It Lasts)',
    short: 'Human hair wig care',
    category: 'Care',
    img: 'jumybee-0',
    description: 'A simple routine for washing, conditioning, detangling and storing human hair wigs, plus how to protect lace and reduce frizz.',
    quick: 'Wash every <strong>7-10 wears</strong> with sulfate-free shampoo, condition from mid-lengths to ends, <strong>detangle gently from the ends up</strong>, air-dry on a stand, use heat protectant before styling and store the wig on a stand or in a silk bag. With good care, human hair wigs can last a year or more.',
    body: `
<p>A human hair wig is real hair without your scalp's natural oils, so it needs a little extra moisture and gentle handling.</p>
<h2>Washing routine</h2>
<ol>
<li>Detangle with a wide-tooth comb, starting at the ends.</li>
<li>Rinse in lukewarm water, keeping the hair flowing downward.</li>
<li>Apply a sulfate-free shampoo and gently smooth it through. Don't rub or scrunch.</li>
<li>Condition from mid-lengths to ends, avoiding the lace and knots.</li>
<li>Blot with a towel and air-dry on a wig stand.</li>
</ol>
<h2>Deep conditioning and frizz control</h2>
<p>Every few weeks, use a moisturising or keratin hair mask on the lengths to restore softness and shine. Keep products away from the lace so the knots aren't loosened. Formaldehyde-free keratin treatments can also smooth frizz on your own natural hair; follow the product instructions carefully.</p>
<h2>Heat styling</h2>
<ul>
<li>Always use a heat protectant.</li>
<li>Keep tools at a moderate temperature and avoid repeated passes.</li>
<li>Colored and blonde wigs are more delicate, so use lower heat.</li>
</ul>
<h2>Storage</h2>
<p>Store your wig on a stand or mannequin head, or loosely braided in a silk or satin bag, away from direct sunlight and humidity.</p>
<div class="callout"><strong>Tip:</strong> A satin pillowcase or bonnet helps protect both your wig's ends and your natural hair underneath.</div>`,
    faqs: [
      { q: 'How often should I wash a human hair wig?', a: 'Every 7-10 wears, or sooner if you use a lot of product or live somewhere humid.' },
      { q: 'How long does a human hair wig last?', a: 'With regular, gentle care, a good-quality human hair wig often lasts a year or more. Heavy heat styling and frequent coloring shorten its lifespan.' },
    ],
  },
  {
    slug: 'best-wig-for-your-face-shape',
    title: 'How to Choose the Best Wig for Your Face Shape',
    short: 'Wigs for your face shape',
    category: 'Style',
    img: 'unice-2',
    description: 'Match wig length, parting and texture to round, oval, square, heart and long face shapes, with easy styling tips.',
    quick: '<strong>Round faces</strong> suit long layers and side parts; <strong>square faces</strong> soften with waves and curls; <strong>heart shapes</strong> suit chin-length bobs and volume at the jaw; <strong>oval faces</strong> can wear almost anything; <strong>long faces</strong> suit shoulder-length cuts, curtain bangs and width at the sides.',
    body: `
<p>The right cut, part and texture can balance your features, and it's easy to choose once you know your face shape.</p>
<h2>Find your face shape</h2>
<p>Pull your hair back and look straight into a mirror. Compare the width of your forehead, cheekbones and jaw, and the length of your face.</p>
<h2>Best wig styles by face shape</h2>
<table><thead><tr><th>Face shape</th><th>Try</th><th>Go easy on</th></tr></thead><tbody>
<tr><td>Round</td><td>Long layers, side part, body wave past the chin</td><td>Blunt chin-length bobs</td></tr>
<tr><td>Oval</td><td>Almost everything: pixies, bobs, long waves</td><td>Heavy bangs that hide your features</td></tr>
<tr><td>Square</td><td>Soft waves, curls, side-swept layers</td><td>Sharp, blunt cuts at the jaw</td></tr>
<tr><td>Heart</td><td>Chin-length bobs, volume at the jaw, curtain bangs</td><td>Lots of volume at the crown</td></tr>
<tr><td>Long</td><td>Shoulder-length cuts, bangs, width at the sides</td><td>Very long, sleek straight styles</td></tr>
</tbody></table>
<h2>Parting and color tips</h2>
<ul>
<li>A <strong>side part</strong> adds angles and softens roundness; a <strong>middle part</strong> suits oval and heart shapes.</li>
<li><strong>Face-framing highlights</strong> brighten your complexion.</li>
<li>If you want parting freedom, choose a 13x4 or 13x6 lace frontal.</li>
</ul>`,
    faqs: [
      { q: 'What wig suits a round face?', a: 'Longer styles past the chin, side parts and soft layers or body waves create length and angles that flatter a round face.' },
      { q: 'Are bob wigs flattering?', a: 'Bobs suit oval, heart and square face shapes especially well. Round faces often prefer a longer, angled bob.' },
    ],
  },
];

export const guides = raw.map((g) => { const body = ids(g.body); return { ...g, path: `/guides/${g.slug}.html`, body, readMins: mins(body + g.quick) }; });

export const homeFaqs = [
  { q: 'What is hairstyle.company?', a: 'hairstyle.company is an independent edit of human hair wigs and hair care from four official brand stores: UNice, Zlike, Allove Hair and Jumy Bee. We explain the specs in plain English and link you straight to the brand to buy.' },
  { q: 'What is the best wig for beginners?', a: 'A <strong>7x5 glueless wig</strong> with pre-cut HD lace, pre-plucked hairline and bleached knots. It goes on in minutes with an elastic band, with no glue. Read our <a href="/guides/glueless-wigs-for-beginners.html">beginner guide</a>.' },
  { q: 'HD lace or transparent lace?', a: 'HD lace is the thinnest and most invisible, great for close-ups. Transparent lace is slightly thicker and more durable. See <a href="/guides/hd-lace-vs-transparent-lace.html">HD vs transparent lace</a>.' },
  { q: 'What density should I choose?', a: '180% is the popular full, natural look. Choose 150% for lightweight everyday wear, or 250-300% for glam volume. See our <a href="/guides/wig-density-and-length-guide.html">density guide</a>.' },
  { q: 'Are these real human hair wigs?', a: 'The wigs we feature are listed by the brands as 100% human hair (many as virgin hair), so they can be washed, heat-styled and, in many cases, colored. Always check the individual listing.' },
  { q: 'Do you earn money from links?', a: 'Yes. We may earn a commission when you buy through our links, at no extra cost to you. It never changes the price. Read our <a href="/affiliate-disclosure.html">disclosure</a>.' },
];

export const pages = (site) => [
  {
    file: 'about.html', title: 'About', h1: 'About hairstyle.company', active: 'About',
    description: `${site.name} is an independent, curated edit of human hair wigs and hair care from official brand stores.`,
    body: `
<p class="lead">${site.name} makes it easier to find a wig you'll love. We gather the best of four official brand stores in one place and explain lace, density and texture in plain English.</p>
<h2>What we do</h2>
<p>We curate human hair wigs and hair-care essentials from <strong>UNice, Zlike, Allove Hair and Jumy Bee</strong>. Every product links directly to the brand's official store, where you buy, pay and get support. We don't sell or ship products ourselves.</p>
<h2>How we pick</h2>
<ul><li>Official brand stores only, for authenticity and warranty</li><li>Clear specs: lace type, density, length and cap</li><li>Beginner-friendly features like glueless caps and pre-plucked hairlines</li><li>A range of textures, lengths, colors and price points</li></ul>
<h2>How we make money</h2>
<p>Some links are affiliate links, so we may earn a commission at no extra cost to you. Read our <a href="/affiliate-disclosure.html">affiliate disclosure</a>.</p>
<h2>Contact</h2>
<p>Questions or partnership enquiries: <a href="mailto:${site.email}">${site.email}</a>.</p>`,
  },
  {
    file: 'affiliate-disclosure.html', title: 'Affiliate Disclosure', h1: 'Affiliate disclosure',
    description: `How ${site.name} earns money through affiliate links.`,
    body: `
<p>${site.name} participates in affiliate programmes, including the Awin network. When you click a brand link and make a purchase, we may earn a commission. <strong>This never increases your price.</strong></p>
<h2>Which links are affiliate links?</h2>
<p>Links to UNice, Zlike, Allove Hair and Jumy Bee (including "Shop" buttons, product cards and brand pages) are usually affiliate links and are marked <code>rel="sponsored"</code> for search engines.</p>
<h2>Prices</h2>
<p>Prices shown are starting prices listed by each brand when we last updated the site. Brands change prices and run promotions often, so always check the final price at checkout.</p>
<p>This disclosure follows the U.S. FTC's guidance on endorsements. Questions? Email <a href="mailto:${site.email}">${site.email}</a>.</p>`,
  },
  {
    file: 'privacy.html', title: 'Privacy Policy', h1: 'Privacy policy',
    description: `How ${site.name} handles your information.`,
    body: `
<p><em>Last updated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</em></p>
<h2>Information we collect</h2>
<p>You don't need an account to use this site. If you join our newsletter, we store your email address with our email provider only to send you the newsletter.</p>
<h2>Affiliate cookies</h2>
<p>When you click a brand link, the affiliate network (such as Awin) and the brand may set cookies to record the referral. Their own privacy policies apply.</p>
<h2>Your choices</h2>
<ul><li>Unsubscribe from any newsletter using the link in the email.</li><li>Block or clear cookies in your browser settings.</li><li>Email <a href="mailto:${site.email}">${site.email}</a> about your data.</li></ul>`,
  },
];
