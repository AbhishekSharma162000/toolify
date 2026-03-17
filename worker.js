const BASE = 'https://toolzyo.shop';

const TOOLS = {
  '/': {
    title: 'Toolify — 60+ Free Online Tools | Finance, PDF, Text & Dev',
    desc: 'Free online calculators and tools for finance, PDF manipulation, text processing, and developer utilities. EMI calculator, BMI calculator, GST calculator, PDF merger, JSON formatter and 60+ more.',
    keys: 'free online tools, emi calculator, gst calculator, pdf merger, bmi calculator, json formatter, password generator, unit converter, toolify',
    id: null,
  },
  '/emi-calculator': {
    title: 'EMI Calculator — Monthly Loan EMI & Amortization Schedule | Toolify',
    desc: 'Calculate monthly EMI for home loan, car loan, or personal loan. Get full amortization schedule with principal and interest breakdown. Free online EMI calculator.',
    keys: 'emi calculator, monthly emi, home loan emi, car loan emi calculator, personal loan emi, amortization schedule, loan calculator india',
    id: 'emi',
  },
  '/home-loan-eligibility': {
    title: 'Home Loan Eligibility Calculator — Max Loan Amount | Toolify',
    desc: 'Find the maximum home loan amount you are eligible for based on income, existing EMIs, and expenses. Instant home loan eligibility check.',
    keys: 'home loan eligibility calculator, housing loan eligibility, how much home loan can i get, home loan amount calculator india',
    id: 'homeloan',
  },
  '/sip-calculator': {
    title: 'SIP Calculator — Mutual Fund Returns & Wealth Planner | Toolify',
    desc: 'Calculate SIP returns on your mutual fund investments. See how monthly investments grow over time. Plan your long-term wealth with SIP calculator.',
    keys: 'sip calculator, systematic investment plan calculator, mutual fund sip returns, monthly sip calculator, sip wealth calculator india',
    id: 'sip',
  },
  '/compound-interest-calculator': {
    title: 'Compound Interest Calculator — Investment Growth Over Time | Toolify',
    desc: 'Calculate compound interest and see how your money grows over time. Supports daily, monthly, quarterly, and annual compounding periods.',
    keys: 'compound interest calculator, compound interest formula, compound interest calculator india, investment growth calculator',
    id: 'compound',
  },
  '/fd-rd-calculator': {
    title: 'FD & RD Calculator — Fixed & Recurring Deposit Maturity | Toolify',
    desc: 'Calculate Fixed Deposit and Recurring Deposit maturity amounts with interest. Compare FD vs RD returns from different Indian banks.',
    keys: 'fd calculator, rd calculator, fixed deposit calculator, recurring deposit calculator, fd maturity calculator, rd maturity amount india',
    id: 'fd',
  },
  '/income-tax-calculator': {
    title: 'Income Tax Calculator FY 2024-25 — Old & New Regime | Toolify',
    desc: 'Calculate your income tax for FY 2024-25 under both old and new tax regimes. Compare tax liability and find which regime saves you more money.',
    keys: 'income tax calculator 2024-25, income tax calculator india, new tax regime calculator, old tax regime calculator, income tax slab 2024',
    id: 'tax',
  },
  '/salary-ctc-calculator': {
    title: 'Salary / CTC Breakup Calculator — Take-Home Salary | Toolify',
    desc: 'Calculate your take-home salary from CTC. Get complete salary breakup including basic pay, HRA, PF, income tax, and all deductions.',
    keys: 'salary calculator, ctc calculator, take home salary calculator, salary breakup calculator, in-hand salary calculator india, ctc to take home',
    id: 'salary',
  },
  '/gst-calculator': {
    title: 'GST Calculator — Add or Remove GST from Amount | Toolify',
    desc: 'Instantly add or remove GST from any amount. Calculate CGST, SGST, and IGST for 5%, 12%, 18%, and 28% GST rates. Free GST calculator India.',
    keys: 'gst calculator, gst calculation, add gst, remove gst, cgst sgst calculator, gst amount calculator india, gst tax calculator',
    id: 'gst',
  },
  '/gst-invoice-generator': {
    title: 'GST Invoice Generator — Create & Download PDF Invoice | Toolify',
    desc: 'Create professional GST invoices online and download as PDF. Add items, apply GST rates, and generate invoice numbers automatically. Free.',
    keys: 'gst invoice generator, gst invoice maker, create gst invoice online, free gst invoice generator india, gst bill generator pdf',
    id: 'invoice',
  },
  '/discount-calculator': {
    title: 'Discount Calculator — Final Price After Discount | Toolify',
    desc: 'Calculate the final price after discount. Find discount percentage, discount amount, and total savings from the original price instantly.',
    keys: 'discount calculator, percentage discount calculator, sale price calculator, how much discount, price after discount calculator',
    id: 'discount',
  },
  '/roi-calculator': {
    title: 'ROI Calculator — Return on Investment | Toolify',
    desc: 'Calculate ROI (Return on Investment) for any investment. Get percentage return, profit or loss, and annualized ROI instantly.',
    keys: 'roi calculator, return on investment calculator, investment return calculator, roi formula calculator, profit calculator',
    id: 'roi',
  },
  '/gratuity-calculator': {
    title: 'Gratuity Calculator — Calculate Gratuity as per Act | Toolify',
    desc: 'Calculate your gratuity amount as per the Payment of Gratuity Act. Know how much gratuity you are entitled to based on years of service.',
    keys: 'gratuity calculator, gratuity calculation formula, how to calculate gratuity, gratuity calculator india, gratuity act calculator',
    id: 'gratuity',
  },
  '/epf-pf-calculator': {
    title: 'EPF / PF Calculator — Provident Fund Maturity Amount | Toolify',
    desc: 'Calculate your EPF maturity amount and PF balance. Know your projected retirement corpus with Employee Provident Fund calculator.',
    keys: 'epf calculator, pf calculator, provident fund calculator, epf maturity calculator, employee provident fund calculator india',
    id: 'pf',
  },
  '/tds-calculator': {
    title: 'TDS Calculator — Tax Deducted at Source | Toolify',
    desc: 'Calculate TDS on salary, rent, interest, and professional fees. Know exact TDS rates and deduction amounts for FY 2024-25.',
    keys: 'tds calculator, tax deducted at source calculator, tds on salary calculator, tds rates, tds calculator india 2024',
    id: 'tds',
  },
  '/break-even-calculator': {
    title: 'Break-Even Calculator — When Does Your Business Profit? | Toolify',
    desc: 'Calculate your business break-even point. Find how many units you need to sell to cover all costs and start generating profit.',
    keys: 'break even calculator, break even analysis, break even point calculator, business break even calculator, profit calculator',
    id: 'breakeven',
  },
  '/freelance-rate-calculator': {
    title: 'Freelance Rate Calculator — What to Charge Per Hour | Toolify',
    desc: 'Calculate your freelance hourly rate based on desired income, expenses, and billable hours. Set the right rate for your freelance services.',
    keys: 'freelance rate calculator, hourly rate calculator, freelancer calculator, how much to charge as freelancer, freelance pricing calculator',
    id: 'freelance',
  },
  '/percentage-calculator': {
    title: 'Percentage Calculator — 3 Types of Percentage Math | Toolify',
    desc: 'Calculate percentages easily. Find what percentage X is of Y, calculate percentage increase or decrease, and find a percentage of a number.',
    keys: 'percentage calculator, percent calculator, how to calculate percentage, percentage increase calculator, percentage of a number',
    id: 'percent',
  },
  '/stamp-duty-calculator': {
    title: 'Stamp Duty Calculator — Property Registration Cost by State | Toolify',
    desc: 'Calculate stamp duty and registration charges for property purchase in any Indian state. Know the exact cost before buying property.',
    keys: 'stamp duty calculator, stamp duty calculator india, property registration charges, stamp duty on property, state wise stamp duty',
    id: 'stampduty',
  },
  '/rent-vs-buy-calculator': {
    title: 'Rent vs Buy Calculator — Should You Rent or Buy Home? | Toolify',
    desc: 'Compare the financial impact of renting vs buying a home. Make an informed decision based on rent amount, home price, and investment returns.',
    keys: 'rent vs buy calculator, rent or buy home calculator, should i rent or buy, rent vs buy comparison india, home buying vs renting',
    id: 'rentvsbuy',
  },
  '/calorie-calculator': {
    title: 'Calorie Calculator — Daily Calories & Macros | Toolify',
    desc: 'Calculate your daily calorie needs based on age, weight, height, and activity level. Get personalized macro targets for protein, carbs, and fat.',
    keys: 'calorie calculator, daily calorie calculator, tdee calculator, calories needed per day, macro calculator, calorie intake calculator',
    id: 'calorie',
  },
  '/bmi-calculator': {
    title: 'BMI Calculator — Body Mass Index & Healthy Weight Range | Toolify',
    desc: 'Calculate your BMI and find your healthy weight range. Understand if you are underweight, normal weight, overweight, or obese with health tips.',
    keys: 'bmi calculator, body mass index calculator, bmi chart, healthy bmi range, bmi calculator india, ideal weight calculator',
    id: 'bmi',
  },
  '/age-calculator': {
    title: 'Age Calculator — Exact Age in Years, Months & Days | Toolify',
    desc: 'Calculate your exact age in years, months, and days from date of birth. Find days until your next birthday and total days lived.',
    keys: 'age calculator, how old am i calculator, exact age calculator, age from date of birth, birthday calculator, days until birthday',
    id: 'age',
  },
  '/date-difference-calculator': {
    title: 'Date Difference Calculator — Days Between Two Dates | Toolify',
    desc: 'Calculate the number of days, weeks, months, and years between any two dates. Find working days, weekend count, and more.',
    keys: 'date difference calculator, days between dates calculator, how many days between dates, date calculator, days calculator',
    id: 'datediff',
  },
  '/tip-calculator': {
    title: 'Tip Calculator — Split Bill & Tip Among Friends | Toolify',
    desc: 'Calculate tip amount and split the restaurant bill among multiple people. Calculate tip percentage and per person share instantly.',
    keys: 'tip calculator, split bill calculator, restaurant tip calculator, how much to tip, bill splitter calculator',
    id: 'tip',
  },
  '/cgpa-calculator': {
    title: 'CGPA Calculator — CGPA to Percentage Converter | Toolify',
    desc: 'Convert CGPA to percentage and percentage to CGPA. Calculate your cumulative GPA from individual semester grades and subject credits.',
    keys: 'cgpa calculator, cgpa to percentage, percentage to cgpa converter, cgpa calculation, grade point average calculator india',
    id: 'cgpa',
  },
  '/resume-builder': {
    title: 'Free Resume Builder — 4 Templates, PDF Download | Toolify',
    desc: 'Create a professional resume online for free. Choose from Modern, Classic, Minimal, and Creative templates. Download as PDF instantly.',
    keys: 'resume builder, free resume maker, online resume builder, resume templates, professional resume builder, cv maker free download pdf',
    id: 'resume',
  },
  '/budget-planner': {
    title: 'Budget Planner — Monthly Income & Expense Tracker PDF | Toolify',
    desc: 'Plan your monthly budget online. Track income and expenses, set savings goals, and download a professional budget report as PDF.',
    keys: 'budget planner, monthly budget planner, income expense tracker, personal budget calculator, budget spreadsheet online free',
    id: 'budget',
  },
  '/business-proposal-generator': {
    title: 'Business Proposal Generator — Professional Proposal PDF | Toolify',
    desc: 'Create a professional business proposal online. Cover page, problem statement, solution, pricing, and terms. Download as PDF instantly.',
    keys: 'business proposal generator, proposal maker, business proposal template, create business proposal online, proposal pdf generator',
    id: 'proposal',
  },
  '/business-letterhead-generator': {
    title: 'Business Letterhead Generator — Branded Letterhead PDF | Toolify',
    desc: 'Create a professional business letterhead online. Add company logo, contact details, and brand colors. Download as PDF instantly.',
    keys: 'letterhead generator, business letterhead maker, company letterhead template, letterhead design online, letterhead pdf creator',
    id: 'letterhead',
  },
  '/word-counter': {
    title: 'Word Counter — Count Words, Characters & Reading Time | Toolify',
    desc: 'Count words, characters, sentences, paragraphs, and estimated reading time in your text. Free online word counter with real-time results.',
    keys: 'word counter, character counter, online word count, words in text, reading time calculator, sentence counter, paragraph counter',
    id: 'word',
  },
  '/case-converter': {
    title: 'Case Converter — UPPER, lower, camelCase & More | Toolify',
    desc: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case instantly online.',
    keys: 'case converter, text case converter, uppercase to lowercase, camelcase converter, snake case converter, kebab case converter, title case',
    id: 'case',
  },
  '/password-generator': {
    title: 'Password Generator — Strong Random Passwords | Toolify',
    desc: 'Generate strong, random passwords of any length. Choose letters, numbers, and special characters. Includes password strength indicator.',
    keys: 'password generator, strong password generator, random password generator, secure password creator, free password generator online',
    id: 'pass',
  },
  '/qr-code-generator': {
    title: 'QR Code Generator — Generate QR for URL, Text & Phone | Toolify',
    desc: 'Generate QR codes for URLs, text, phone numbers, and more. Download QR code as PNG image. Free online QR code maker, no signup.',
    keys: 'qr code generator, free qr code maker, qr code for url, generate qr code online, qr code creator, download qr code',
    id: 'qr',
  },
  '/color-converter': {
    title: 'Color Converter — HEX to RGB to HSL | Toolify',
    desc: 'Convert colors between HEX, RGB, and HSL formats instantly. Online color code converter for web designers and developers.',
    keys: 'color converter, hex to rgb converter, rgb to hex converter, hex to hsl, color code converter, css color converter',
    id: 'color',
  },
  '/css-gradient-generator': {
    title: 'CSS Gradient Generator — Linear Gradients with Live Preview | Toolify',
    desc: 'Generate CSS gradients online with live preview. Create linear and radial gradients with multiple color stops. Copy CSS code instantly.',
    keys: 'css gradient generator, gradient generator, linear gradient css, css gradient maker, background gradient generator, gradient color picker',
    id: 'gradient',
  },
  '/color-palette-generator': {
    title: 'Color Palette Generator — Create Color Schemes | Toolify',
    desc: 'Generate beautiful color palettes from a base color. Create monochrome, complementary, analogous, and tetradic color schemes for design.',
    keys: 'color palette generator, color scheme generator, complementary colors, analogous colors, color palette maker, color combinations',
    id: 'palette',
  },
  '/json-formatter': {
    title: 'JSON Formatter — Format, Validate & Minify JSON | Toolify',
    desc: 'Format and beautify JSON data online. Validate JSON syntax, minify JSON, and get human-readable indented output. Free JSON formatter.',
    keys: 'json formatter, json beautifier, json validator, format json online, json minifier, pretty print json, json parser online',
    id: 'json',
  },
  '/base64-encoder-decoder': {
    title: 'Base64 Encoder & Decoder — Encode/Decode Online | Toolify',
    desc: 'Encode text to Base64 and decode Base64 to text online. Supports UTF-8 encoding. Free Base64 encoder decoder tool.',
    keys: 'base64 encoder, base64 decoder, encode base64 online, decode base64 online, base64 converter, text to base64',
    id: 'base64',
  },
  '/url-encoder-decoder': {
    title: 'URL Encoder & Decoder — Percent Encoding Online | Toolify',
    desc: 'Encode and decode URL components online. Convert special characters to percent-encoded format and back. Free URL encoder decoder tool.',
    keys: 'url encoder, url decoder, url encode decode, percent encoding, url encoding online, encode url online free',
    id: 'url',
  },
  '/hash-generator': {
    title: 'Hash Generator — MD5, SHA1 & SHA256 | Toolify',
    desc: 'Generate MD5, SHA1, SHA256, and other cryptographic hashes from text online. Free hash generator for security and data verification.',
    keys: 'hash generator, md5 generator, sha256 generator, sha1 hash generator, text to hash, checksum generator online',
    id: 'hash',
  },
  '/regex-tester': {
    title: 'Regex Tester — Test Regular Expressions Live | Toolify',
    desc: 'Test regular expressions online with live match highlighting. Debug and validate regex patterns instantly. Supports all JavaScript regex flags.',
    keys: 'regex tester, regular expression tester, regex test online, regex checker, regex validator, test regex javascript',
    id: 'regex',
  },
  '/markdown-to-html': {
    title: 'Markdown to HTML Converter — Convert Markdown Online | Toolify',
    desc: 'Convert Markdown to HTML online instantly. Preview rendered output and copy the HTML code. Supports headings, lists, bold, italic, and links.',
    keys: 'markdown to html converter, markdown converter, md to html, markdown preview online, convert markdown online free',
    id: 'markdown',
  },
  '/image-compressor': {
    title: 'Image Compressor — Compress Images in Browser | Toolify',
    desc: 'Compress JPG and PNG images directly in your browser. Reduce image file size without uploading to any server. 100% private.',
    keys: 'image compressor, compress image online, reduce image size, jpg compressor, png compressor, image optimizer free',
    id: 'imgcompress',
  },
  '/unit-converter': {
    title: 'Unit Converter — Length, Weight, Temperature & Data | Toolify',
    desc: 'Convert units of length, weight, temperature, and data size online. Supports metric and imperial systems. Free unit converter tool.',
    keys: 'unit converter, length converter, weight converter, temperature converter, data converter, metric converter, online unit conversion',
    id: 'unit',
  },
  '/pdf-merge': {
    title: 'PDF Merge — Combine Multiple PDFs into One | Toolify',
    desc: 'Merge multiple PDF files into one document online. Drag and drop, arrange order, and combine PDFs for free. No file upload needed.',
    keys: 'merge pdf, combine pdf files, pdf merger online, join pdf files, merge pdf free, combine pdfs into one online',
    id: 'merge',
  },
  '/image-to-pdf': {
    title: 'Image to PDF Converter — Convert JPG/PNG to PDF | Toolify',
    desc: 'Convert JPG, PNG, and other images to PDF online. Combine multiple images into a single PDF document. Free image to PDF converter.',
    keys: 'image to pdf converter, jpg to pdf, png to pdf, convert image to pdf online free, multiple images to pdf',
    id: 'img2pdf',
  },
  '/pdf-split': {
    title: 'PDF Splitter — Extract Pages from PDF | Toolify',
    desc: 'Split a PDF file and extract specific pages online. Select page ranges and download as separate PDF files. Free PDF splitter tool.',
    keys: 'pdf splitter, split pdf, extract pages from pdf, pdf page extractor, split pdf online free, divide pdf',
    id: 'split',
  },
  '/word-to-pdf': {
    title: 'Word to PDF Converter — Convert .docx to PDF | Toolify',
    desc: 'Convert Word documents (.docx) to PDF format online. Free Word to PDF converter that works entirely in your browser. No data uploaded.',
    keys: 'word to pdf converter, docx to pdf, convert word to pdf online free, microsoft word to pdf, doc to pdf converter',
    id: 'word2pdf',
  },
  '/pdf-to-word': {
    title: 'PDF to Word Converter — Extract PDF Text as .docx | Toolify',
    desc: 'Convert PDF to Word document (.docx) online. Extract text from PDF and download as an editable Word file. Free PDF to Word converter.',
    keys: 'pdf to word converter, pdf to docx, convert pdf to word online free, extract text from pdf, pdf converter to word',
    id: 'pdf2word',
  },
};

function buildMeta(m) {
  const url = BASE + (m.id ? Object.keys(TOOLS).find(k => TOOLS[k].id === m.id) || '/' : '/');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: m.title.split('—')[0].trim(),
    description: m.desc,
    url,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return `<meta name="description" content="${esc(m.desc)}">
<meta name="keywords" content="${esc(m.keys)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(m.title)}">
<meta property="og:description" content="${esc(m.desc)}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="Toolify">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(m.title)}">
<meta name="twitter:description" content="${esc(m.desc)}">
<script type="application/ld+json">${JSON.stringify(schema)}<\/script>`;
}

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';
    const meta = TOOLS[path] || TOOLS[path + '/'] || null;

    // For tool/home pages, inject SEO meta tags into HTML
    if (meta || path === '/') {
      const m = meta || TOOLS['/'];
      const canonicalPath = path === '' ? '/' : path;
      const canonical = BASE + canonicalPath;

      try {
        // Fetch the index.html from static assets
        const assetRes = await env.ASSETS.fetch(new URL('/', request.url).toString());
        if (!assetRes.ok) return env.ASSETS.fetch(request);

        let html = await assetRes.text();

        // Inject title
        html = html.replace(
          '<title>Toolify — Free Online Tools</title>',
          `<title>${esc(m.title)}</title>`
        );

        // Inject SEO meta tags
        html = html.replace(
          '<!-- SEO_META_PLACEHOLDER -->',
          buildMeta(m)
        );

        // Inject canonical URL
        html = html.replace(
          '<link rel="canonical" href="https://toolzyo.shop/">',
          `<link rel="canonical" href="${canonical}">`
        );

        return new Response(html, {
          headers: {
            'Content-Type': 'text/html;charset=UTF-8',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      } catch (e) {
        return env.ASSETS.fetch(request);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
