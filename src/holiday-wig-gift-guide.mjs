// Holiday wig & hair-care gift guide (money page). Product keys use the same "<partner>-<index>" convention as
// collections[].hero in content.mjs and point at data/partners.json -> store[partner][index]. Only priced store items.
export const holidayWig = {
  file: 'holiday-wig-gift-guide.html',
  path: '/holiday-wig-gift-guide.html',
  title: 'Holiday Wig & Hair Care Gift Guide 2026',
  short: 'Holiday gift guide',
  description: 'Holiday 2026 wig and hair care gift ideas from UNice, Zlike, Allove and Jumy Bee, grouped by budget, with tips on cap size, lace type and density.',
  published: '2026-11-02',
  modified: '2026-11-02',
  topKey: 'jumybee-8',
  topFor: 'a no-sizing gift for anyone with frizz-prone hair',
  quick: 'Our top gift: Jumy Bee After-Care Anti-Frizz Shampoo & Conditioner Set — best for a low-risk gift that needs no cap size, color or length.',
  top: [
    ['jumybee-8', 'Anyone with frizz-prone hair; no cap size or color to match'],
    ['unice-0', 'A wig wearer who likes a natural-looking body wave with invisible HD lace'],
    ['zlike-14', 'Someone who wants a layered bob with blonde highlights'],
  ],
  groups: [
    { h: 'Hair-care gifts under $50', note: 'Jumy Bee hair care. Nothing to size or color-match.', items: [['jumybee-8', 'Anyone who battles frizz'], ['jumybee-0', 'A hair-mask gift for dry, frizzy hair'], ['jumybee-4', 'Coarse or coily hair that needs smoothing'], ['jumybee-2', 'A small gift for dry or damaged hair']] },
    { h: 'Wigs from $50 to $150', note: 'Glueless and lace styles at friendlier prices. Prices are the listed prices in our data and can change.', items: [['unice-5', 'Someone who loves reddish-brown curls'], ['unice-7', 'A first-time wig wearer (the listing is aimed at beginners)'], ['zlike-14', 'Layered bob with blonde highlights'], ['allove-5', 'A brunette-with-blonde-highlights, loose body wave look'], ['unice-0', 'Natural-looking body wave with invisible HD lace']] },
    { h: 'Splurge wigs, $150 and up', note: 'Larger-ticket gifts. Best when you know the recipient’s style and cap size.', items: [['zlike-17', 'A sleek short bob with pre-cut transparent lace'], ['zlike-1', 'Ginger body wave with a side part'], ['allove-3', 'A 300% density ombre brown bob']] },
  ],
  seePrice: ['allove-613-blonde-straight-13x6-lace-front-glueless-30', 'zlike-wear-go-glueless-body-wave-pre-cut-5x5', 'unice-chestnut-brown-ombre-yaki-straight-invisi-drawstring'],
  chooseWig: `<h2>Choosing a wig as a gift</h2>
<p>A wig is personal, so a little preparation goes a long way. These three details matter most:</p>
<ul>
<li><strong>Cap size.</strong> Most wigs list an average cap size and many have adjustable straps, but head sizes vary. Check the size chart on the product page, and if you can, ask the recipient for their head circumference.</li>
<li><strong>Lace type.</strong> HD lace is the thinnest and blends with more skin tones; transparent lace is slightly thicker and tougher. See our <a href="/guides/hd-lace-vs-transparent-lace.html">HD vs transparent lace guide</a>.</li>
<li><strong>Density.</strong> About 150% looks light and natural, 180% is the popular full everyday look, and 250% or more is very full. See our <a href="/guides/wig-density-and-length-guide.html">density and length guide</a>.</li>
</ul>
<p><strong>Tip:</strong> if you are not sure about size, texture or color, ask the recipient for their measurements and preferences, or choose a hair-care gift or a retailer gift card if the retailer offers one. That avoids sizing problems entirely.</p>`,
  how: 'We picked items from the four partner stores in our data (UNice, Zlike, Allove and Jumy Bee) using each retailer’s own listings: product names, specs, descriptions and listed prices. We have not tested these products hands-on. We aim for a range of budgets, a mix of brands, and gifts that are easy to get right.',
  ship: 'Delivery times differ by retailer, destination and shipping method. Check each retailer’s own holiday shipping cut-off before you order, and read its return policy in case the size or style needs changing.',
  prices: 'Prices and availability are set by the brands and may change. We list no sale prices or promo codes: if a retailer runs a Black Friday or Cyber Monday offer, you will see it on the retailer’s own page.',
  faqs: [
    { q: 'What is the safest wig-related gift?', a: 'Hair-care products, such as a shampoo and conditioner set or a hair mask, are the lowest-risk choice because they need no cap size, color or length. A retailer gift card, if the retailer offers one, is another safe option.' },
    { q: 'Is it a good idea to give a wig as a surprise?', a: 'Only if you know the recipient’s preferences. Wigs depend on cap size, texture, color, length and lace type, so it helps to ask for these details or to gift a hair-care set instead.' },
    { q: 'What is the difference between HD lace and transparent lace?', a: 'HD lace is the thinnest and blends with more skin tones. Transparent lace is slightly thicker and more durable. Both are used for natural-looking hairlines.' },
    { q: 'Which wig density should I choose?', a: 'Around 150% looks light and natural, 180% is the popular full everyday look, and 250% or more is very full and suits long lengths and special occasions.' },
    { q: 'Do the prices on this page include Black Friday or Cyber Monday discounts?', a: 'No. The prices shown are the listed prices in our data as of November 2, 2026, and we do not list sale prices or promo codes. Check the retailer’s own page for the price you will pay.' },
    { q: 'Can a wig gift be returned?', a: 'It depends on the retailer. Policies often differ for worn or altered hair, so read the retailer’s return and exchange policy before you order.' },
  ],
};
