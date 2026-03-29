const {createApp,ref,computed}=Vue;
const _vapp=createApp({setup(){

  // ── HELPERS ──
  const fmt=n=>Number(n).toLocaleString('en-IN');
  const fmtS=n=>n>=1e7?'₹'+(n/1e7).toFixed(1)+'Cr':n>=1e5?'₹'+(n/1e5).toFixed(1)+'L':'₹'+fmt(n);
  const cp=v=>navigator.clipboard.writeText(String(v));
  const fmtB=b=>b>1048576?(b/1048576).toFixed(1)+' MB':b>1024?(b/1024).toFixed(1)+' KB':Math.round(b)+' B';

  // ── THEME ──
  const dark=ref(true);
  const applyTheme=()=>document.body.className=dark.value?'dark':'light';
  applyTheme();
  const toggleTheme=()=>{dark.value=!dark.value;applyTheme();};

  // ── ROUTING ──
  const _ID_TO_URL={
    emi:'/emi-calculator',homeloan:'/home-loan-eligibility',
    sip:'/sip-calculator',compound:'/compound-interest-calculator',
    fd:'/fd-rd-calculator',tax:'/income-tax-calculator',
    salary:'/salary-ctc-calculator',gst:'/gst-calculator',
    invoice:'/gst-invoice-generator',discount:'/discount-calculator',
    roi:'/roi-calculator',gratuity:'/gratuity-calculator',
    pf:'/epf-pf-calculator',tds:'/tds-calculator',
    breakeven:'/break-even-calculator',freelance:'/freelance-rate-calculator',
    percent:'/percentage-calculator',stampduty:'/stamp-duty-calculator',
    rentvsbuy:'/rent-vs-buy-calculator',calorie:'/calorie-calculator',
    bmi:'/bmi-calculator',age:'/age-calculator',
    datediff:'/date-difference-calculator',tip:'/tip-calculator',
    cgpa:'/cgpa-calculator',resume:'/resume-builder',
    budget:'/budget-planner',proposal:'/business-proposal-generator',
    letterhead:'/business-letterhead-generator',word:'/word-counter',
    'case':'/case-converter','pass':'/password-generator',
    qr:'/qr-code-generator',color:'/color-converter',
    gradient:'/css-gradient-generator',palette:'/color-palette-generator',
    json:'/json-formatter',base64:'/base64-encoder-decoder',
    url:'/url-encoder-decoder',hash:'/hash-generator',
    regex:'/regex-tester',markdown:'/markdown-to-html',
    imgcompress:'/image-compressor',unit:'/unit-converter',
    merge:'/pdf-merge',img2pdf:'/image-to-pdf',split:'/pdf-split',
    word2pdf:'/word-to-pdf',pdf2word:'/pdf-to-word',
    imgresize:'/image-resizer',imgcrop:'/image-cropper',
    imgpixel:'/pixel-art-maker',passport:'/passport-photo',
    imgrotate:'/image-rotate',imgconvert:'/image-converter',
    imgocr:'/image-ocr',
    pdfwatermark:'/pdf-watermark',pdfpagenum:'/pdf-page-numbers',pdfrotatepgs:'/pdf-rotate-pages',
    pdfedit:'/pdf-editor',wordedit:'/word-editor',
    rank:'/rank-calculator',
    cacalc:'/ca-calculator',
    pdfcompress:'/pdf-compressor',
    pagebuilder:'/landing-page-builder'
  };
  const toolUrl=id=>_ID_TO_URL[id]||'/';
  const page=ref(window.INITIAL_PAGE||'home'),search=ref(''),activeCat=ref('All');
  const cats=['All','Finance','Real Estate','Health & Fitness','Career & Templates','Text & Dev','Converters','PDF Tools','Image Tools'];

  const allTools=[
    {id:'emi',       icon:'🏦',name:'EMI Calculator',          desc:'Monthly EMI & amortization',          color:'rgba(124,111,255,.2)',cat:'Finance',             popular:true},
    {id:'homeloan',  icon:'🏠',name:'Home Loan Eligibility',   desc:'Max loan you can get',                color:'rgba(94,240,200,.15)', cat:'Finance',             hot:true},
    {id:'sip',       icon:'📈',name:'SIP Planner',             desc:'Mutual fund returns & wealth',        color:'rgba(94,240,200,.15)', cat:'Finance',             popular:true},
    {id:'compound',  icon:'💰',name:'Compound Interest',       desc:'How money grows over time',           color:'rgba(255,183,77,.18)', cat:'Finance',             popular:true},
    {id:'fd',        icon:'🏧',name:'FD / RD Calculator',      desc:'Fixed & recurring deposit',           color:'rgba(255,183,77,.18)', cat:'Finance'},
    {id:'tax',       icon:'💹',name:'Income Tax',              desc:'India FY 2024-25',                    color:'rgba(94,240,200,.15)', cat:'Finance',             popular:true},
    {id:'salary',    icon:'💼',name:'Salary / CTC Breakup',    desc:'CTC to take-home',                   color:'rgba(124,111,255,.2)', cat:'Finance',             hot:true},
    {id:'gst',       icon:'🧾',name:'GST Calculator',          desc:'Add or remove GST',                  color:'rgba(255,183,77,.18)', cat:'Finance',             popular:true},
    {id:'invoice',   icon:'📃',name:'GST Invoice Generator',   desc:'Create & download PDF invoices',      color:'rgba(255,100,100,.18)',cat:'Finance',             hot:true},
    {id:'discount',  icon:'🏷️',name:'Discount Calculator',    desc:'Final price after discount',         color:'rgba(255,100,100,.18)',cat:'Finance'},
    {id:'roi',       icon:'📊',name:'ROI Calculator',          desc:'Return on investment',                color:'rgba(94,240,200,.15)', cat:'Finance'},
    {id:'gratuity',  icon:'🎁',name:'Gratuity Calculator',     desc:'As per Gratuity Act',                color:'rgba(124,111,255,.2)', cat:'Finance',             hot:true},
    {id:'pf',        icon:'🏦',name:'EPF / PF Calculator',     desc:'PF maturity amount',                 color:'rgba(94,240,200,.15)', cat:'Finance'},
    {id:'tds',       icon:'📋',name:'TDS Calculator',          desc:'Tax deducted at source',             color:'rgba(255,183,77,.18)', cat:'Finance',             hot:true},
    {id:'cacalc',    icon:'🧮',name:'CA Suite',               desc:'Tax planner · Investments · P&L · Net Worth', color:'rgba(94,240,200,.2)', cat:'Finance',       hot:true},
    {id:'breakeven', icon:'📉',name:'Break-Even Calculator',   desc:'When does your business profit?',    color:'rgba(255,100,100,.18)',cat:'Finance'},
    {id:'freelance', icon:'💻',name:'Freelance Rate Calc',     desc:'What to charge per hour',            color:'rgba(124,111,255,.2)', cat:'Finance',             hot:true},
    {id:'percent',   icon:'📐',name:'Percentage Calculator',   desc:'3 types of percentage math',         color:'rgba(255,183,77,.18)', cat:'Finance',             popular:true},
    {id:'stampduty', icon:'🏢',name:'Stamp Duty Calculator',   desc:'Property registration cost',         color:'rgba(255,100,100,.18)',cat:'Real Estate',         hot:true},
    {id:'rentvsbuy', icon:'🏡',name:'Rent vs Buy',             desc:'Should you rent or buy?',            color:'rgba(94,240,200,.15)', cat:'Real Estate',         hot:true},
    {id:'calorie',   icon:'🔥',name:'Calorie Calculator',      desc:'Daily calories + macros',            color:'rgba(255,100,100,.18)',cat:'Health & Fitness',    popular:true},
    {id:'bmi',       icon:'⚖️',name:'BMI Calculator',          desc:'Body mass index + health range',     color:'rgba(255,183,77,.18)', cat:'Health & Fitness',    popular:true},
    {id:'age',       icon:'🎂',name:'Age Calculator',          desc:'Exact age in years, months & days',  color:'rgba(124,111,255,.2)', cat:'Health & Fitness'},
    {id:'datediff',  icon:'📅',name:'Date Difference',         desc:'Days & weeks between dates',         color:'rgba(94,240,200,.15)', cat:'Health & Fitness'},
    {id:'tip',       icon:'🍽️',name:'Tip Calculator',         desc:'Split bill & tip',                   color:'rgba(255,183,77,.18)', cat:'Health & Fitness'},
    {id:'cgpa',      icon:'🎓',name:'CGPA Calculator',         desc:'CGPA ↔ Percentage',                 color:'rgba(124,111,255,.2)', cat:'Health & Fitness',    popular:true},
    {id:'resume',    icon:'📄',name:'Resume Builder',          desc:'Fill → Choose template → PDF',       color:'rgba(124,111,255,.2)', cat:'Career & Templates',  hot:true},
    {id:'budget',    icon:'💰',name:'Budget Planner',          desc:'Income & expense tracker → PDF',     color:'rgba(94,240,200,.15)', cat:'Career & Templates',  hot:true},
    {id:'proposal',  icon:'📋',name:'Business Proposal',       desc:'Professional proposal → PDF',        color:'rgba(255,183,77,.18)', cat:'Career & Templates',  hot:true},
    {id:'letterhead',icon:'✉️',name:'Business Letterhead',     desc:'Branded letterhead → PDF',           color:'rgba(255,100,100,.18)',cat:'Career & Templates',  hot:true},
    {id:'invoice',   icon:'📃',name:'GST Invoice',             desc:'Invoice generator → PDF',            color:'rgba(124,111,255,.2)', cat:'Career & Templates',  popular:true},
    {id:'word',      icon:'📝',name:'Word Counter',            desc:'Words, chars & reading time',        color:'rgba(94,240,200,.15)', cat:'Text & Dev',           popular:true},
    {id:'case',      icon:'🔡',name:'Case Converter',          desc:'UPPER, lower, camelCase & more',     color:'rgba(255,183,77,.18)', cat:'Text & Dev'},
    {id:'pass',      icon:'🔐',name:'Password Generator',      desc:'Strong random passwords',            color:'rgba(124,111,255,.2)', cat:'Text & Dev',           popular:true},
    {id:'qr',        icon:'📱',name:'QR Code Generator',       desc:'QR for URL, text, phone',            color:'rgba(94,240,200,.15)', cat:'Text & Dev',           popular:true},
    {id:'color',     icon:'🎨',name:'Color Converter',         desc:'HEX ↔ RGB ↔ HSL',                   color:'rgba(255,100,100,.18)',cat:'Text & Dev'},
    {id:'gradient',  icon:'🌈',name:'Gradient Generator',      desc:'CSS gradients with live preview',    color:'rgba(124,111,255,.2)', cat:'Text & Dev',           hot:true},
    {id:'palette',   icon:'🎭',name:'Color Palette',           desc:'Generate palettes from base color',  color:'rgba(94,240,200,.15)', cat:'Text & Dev'},
    {id:'json',      icon:'📋',name:'JSON Formatter',          desc:'Format, validate & minify JSON',     color:'rgba(255,183,77,.18)', cat:'Text & Dev',           hot:true},
    {id:'base64',    icon:'🔒',name:'Base64 Encoder',          desc:'Encode / decode Base64',             color:'rgba(124,111,255,.2)', cat:'Text & Dev',           popular:true},
    {id:'url',       icon:'🔗',name:'URL Encoder',             desc:'Encode / decode URL components',     color:'rgba(94,240,200,.15)', cat:'Text & Dev'},
    {id:'hash',      icon:'🔑',name:'Hash Generator',          desc:'Generate hashes from text',          color:'rgba(255,100,100,.18)',cat:'Text & Dev'},
    {id:'regex',     icon:'🔍',name:'Regex Tester',            desc:'Test regex with live matching',      color:'rgba(255,183,77,.18)', cat:'Text & Dev',           hot:true},
    {id:'markdown',  icon:'✍️',name:'Markdown to HTML',        desc:'Convert markdown instantly',         color:'rgba(124,111,255,.2)', cat:'Text & Dev'},
    {id:'imgcompress',icon:'🗜️',name:'Image Compressor',      desc:'Compress images in browser',         color:'rgba(94,240,200,.15)', cat:'Text & Dev',           hot:true},
    {id:'unit',      icon:'📏',name:'Unit Converter',          desc:'Length, weight, temp & data',        color:'rgba(94,240,200,.15)', cat:'Converters'},
    {id:'merge',     icon:'🔗',name:'Merge PDF',               desc:'Combine PDFs into one',              color:'rgba(255,100,100,.18)',cat:'PDF Tools',            popular:true},
    {id:'img2pdf',   icon:'🖼️',name:'Image to PDF',            desc:'Convert JPG/PNG to PDF',             color:'rgba(124,111,255,.2)', cat:'PDF Tools',            popular:true},
    {id:'split',     icon:'✂️',name:'Split PDF',               desc:'Extract pages from PDF',             color:'rgba(94,240,200,.15)', cat:'PDF Tools'},
    {id:'word2pdf',  icon:'📄',name:'Word to PDF',             desc:'Convert .docx to PDF',               color:'rgba(255,183,77,.18)', cat:'PDF Tools',            hot:true},
    {id:'pdf2word',  icon:'📝',name:'PDF to Word',             desc:'Extract PDF text as .docx',          color:'rgba(124,111,255,.2)', cat:'PDF Tools',            hot:true},
    {id:'imgresize', icon:'↔️', name:'Image Resizer',         desc:'Resize to any width & height',       color:'rgba(124,111,255,.2)', cat:'Image Tools',          hot:true},
    {id:'imgcrop',   icon:'✂️', name:'Image Cropper',         desc:'Crop with presets or custom size',   color:'rgba(94,240,200,.15)', cat:'Image Tools',          hot:true},
    {id:'imgpixel',  icon:'🎮', name:'Pixel Art Maker',       desc:'Pixelate images for retro look',     color:'rgba(255,183,77,.18)', cat:'Image Tools'},
    {id:'passport',  icon:'🪪', name:'Passport Photo',        desc:'Standard passport size maker',       color:'rgba(255,100,100,.18)',cat:'Image Tools',          popular:true},
    {id:'imgrotate', icon:'🔄', name:'Rotate & Flip',         desc:'Rotate 90°/180° or flip image',      color:'rgba(94,240,200,.15)', cat:'Image Tools'},
    {id:'imgconvert',icon:'🔀', name:'Image Converter',       desc:'Convert JPG ↔ PNG ↔ WebP',          color:'rgba(124,111,255,.2)', cat:'Image Tools'},
    {id:'imgocr',    icon:'🔍', name:'Image to Text (OCR)',  desc:'Extract text from any image',        color:'rgba(255,183,77,.18)', cat:'Image Tools',          hot:true},
    {id:'pdfwatermark',icon:'💧',name:'PDF Watermark',       desc:'Stamp text watermark on every page', color:'rgba(94,240,200,.15)', cat:'PDF Tools'},
    {id:'pdfpagenum', icon:'🔢',name:'PDF Page Numbers',     desc:'Add page numbers to your PDF',       color:'rgba(255,183,77,.18)', cat:'PDF Tools'},
    {id:'pdfrotatepgs',icon:'🔁',name:'Rotate PDF Pages',   desc:'Rotate all or specific pages',       color:'rgba(124,111,255,.2)', cat:'PDF Tools'},
    {id:'pdfedit',     icon:'✏️',name:'PDF Editor',         desc:'View & annotate PDF with text',      color:'rgba(255,100,100,.18)',cat:'PDF Tools',            hot:true},
    {id:'pdfcompress', icon:'📦',name:'PDF Compressor',     desc:'Reduce PDF size — up to 80% smaller', color:'rgba(94,240,200,.15)', cat:'PDF Tools',            hot:true},
    {id:'wordedit',    icon:'📝',name:'Word Editor',         desc:'Edit .docx files in your browser',   color:'rgba(94,240,200,.15)', cat:'PDF Tools',            hot:true},
    {id:'rank',        icon:'🏆',name:'Rank Calculator',      desc:'Score & rank predictor for govt exams',color:'rgba(255,183,77,.18)',cat:'Career & Templates',   hot:true},
    {id:'pagebuilder', icon:'🚀',name:'Landing Page Builder',  desc:'Drag-and-drop sections, templates, download HTML',color:'rgba(124,111,255,.2)',cat:'Career & Templates',hot:true},
  ];

  const filteredTools=computed(()=>allTools.filter(t=>
    (activeCat.value==='All'||t.cat===activeCat.value)&&
    (!search.value||t.name.toLowerCase().includes(search.value.toLowerCase())||t.desc.toLowerCase().includes(search.value.toLowerCase()))
  ));
  const sectionOrder=['Finance','Real Estate','Health & Fitness','Career & Templates','Text & Dev','Converters','PDF Tools','Image Tools'];
  const visibleSections=computed(()=>{
    const m={};
    filteredTools.value.forEach(t=>{if(!m[t.cat])m[t.cat]=[];m[t.cat].push(t);});
    return sectionOrder.filter(c=>m[c]).map(c=>({label:c,tools:m[c]}));
  });
  const goHome=()=>{page.value='home';history.pushState({},'','/');window.scrollTo(0,0);};
  const open=id=>{page.value=id;history.pushState({id},'',toolUrl(id));window.scrollTo(0,0);};
  window.addEventListener('popstate',()=>{page.value=window._URL_TO_ID[location.pathname]||'home';});
  window.addEventListener('resize',()=>{try{if(pdfed.value.loaded)pdfedUpdateScale();}catch(e){}});
  const pdfTitle=computed(()=>({merge:'🔗 Merge PDF',img2pdf:'🖼️ Image to PDF',split:'✂️ Split PDF',word2pdf:'📄 Word to PDF',pdf2word:'📝 PDF to Word'}[page.value]||''));

  // ── TEMPLATES ──
  const templates=[
    {id:'resume',    icon:'📄',name:'Resume Builder',        desc:'4 templates, live preview, PDF download',     includes:'Download PDF instantly',action:'resume'},
    {id:'invoice',   icon:'🧾',name:'GST Invoice Generator', desc:'Professional invoice with GST breakdown',      includes:'Download PDF instantly',action:'invoice'},
    {id:'budget',    icon:'💰',name:'Monthly Budget Planner',desc:'Income, expenses, goal tracker with charts',   includes:'Download PDF instantly',action:'budget'},
    {id:'proposal',  icon:'📋',name:'Business Proposal',     desc:'Cover, problem, solution, pricing, terms',     includes:'Download PDF instantly',action:'proposal'},
    {id:'letterhead',icon:'✉️',name:'Business Letterhead',   desc:'Branded letterhead with your color & logo',    includes:'Download PDF instantly',action:'letterhead'},
  ];
  const resumeTemplates=[
    {id:'modern', icon:'💎',name:'Modern',   desc:'Purple accents'},
    {id:'classic',icon:'📜',name:'Classic',  desc:'Traditional'},
    {id:'minimal',icon:'⬜',name:'Minimal',  desc:'Clean & simple'},
    {id:'creative',icon:'🎨',name:'Creative',desc:'Bold & colorful'},
  ];

  // ── RESUME HELPERS ──
  const fmtDesc=t=>{
    if(!t)return'';
    return t
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
      .replace(/\*(.+?)\*/g,'<em>$1</em>')
      .split('\n')
      .map(l=>l.startsWith('• ')?'<li>'+l.slice(2)+'</li>':'<span>'+l+'</span><br>')
      .join('')
      .replace(/(<li>.*<\/li>)+/g,m=>'<ul style="margin:0;padding-left:16px">'+m+'</ul>');
  };
  const fmtAt=(pre,suf='')=>{
    const el=document.activeElement;
    if(!el||el.tagName!=='TEXTAREA')return;
    const s=el.selectionStart,e=el.selectionEnd,v=el.value;
    const sel=v.slice(s,e);
    const rep=pre+sel+suf;
    el.setRangeText(rep,s,e,'select');
    el.dispatchEvent(new Event('input'));
  };

  // ── RESUME ──
  const rv=ref({template:'modern',name:'',title:'',email:'',phone:'',location:'',linkedin:'',summary:'',experience:[{title:'',company:'',duration:'',location:'',desc:''}],education:[{degree:'',school:'',year:'',grade:''}],skills:'',certs:'',languages:''});
  const downloadResume=async()=>{
    const{PDFDocument,StandardFonts,rgb}=PDFLib;
    const doc=await PDFDocument.create();
    const font=await doc.embedFont(StandardFonts.Helvetica);
    const bold=await doc.embedFont(StandardFonts.HelveticaBold);
    const pw=595,ph=842,mg=48,rm=pw-48;let y=ph-48;let pg=doc.addPage([pw,ph]);
    const txt=(text,x,yy,size,f,col)=>pg.drawText(String(text||'').slice(0,100),{x,y:yy,size,font:f||font,color:col||rgb(0.1,0.1,0.1)});
    const line2=y2=>pg.drawLine({start:{x:mg,y:y2},end:{x:rm,y:y2},thickness:0.5,color:rgb(0.7,0.7,0.7)});
    const chkPg=(n=20)=>{if(y<mg+n){pg=doc.addPage([pw,ph]);y=ph-mg;}};
    const wrap=t=>{const ws=String(t||'').split(' ');const ls=[];let cur='';for(const w of ws){const test=cur?cur+' '+w:w;if(font.widthOfTextAtSize(test,10)<=rm-mg){cur=test;}else{if(cur)ls.push(cur);cur=w;}}if(cur)ls.push(cur);return ls.length?ls:[''];};
    const sec=title=>{chkPg(30);y-=10;txt(title,mg,y,11,bold,rgb(0.48,0.44,1));y-=4;line2(y);y-=14;};
    pg.drawRectangle({x:0,y:ph-75,width:pw,height:75,color:rgb(0.48,0.44,1)});
    txt(rv.value.name||'Your Name',mg,ph-38,20,bold,rgb(1,1,1));
    txt(rv.value.title||'',mg,ph-58,12,font,rgb(0.9,0.9,1));
    txt([rv.value.email,rv.value.phone,rv.value.location].filter(Boolean).join('  |  '),mg,ph-70,9,font,rgb(0.85,0.85,1));
    y=ph-90;
    if(rv.value.summary){sec('SUMMARY');wrap(rv.value.summary).forEach(l=>{chkPg();txt(l,mg,y,10);y-=14;});}
    if(rv.value.experience.some(e=>e.title)){sec('EXPERIENCE');rv.value.experience.filter(e=>e.title).forEach(e=>{chkPg(40);txt(e.title+(e.company?' @ '+e.company:''),mg,y,11,bold);y-=14;txt((e.duration||'')+(e.location?' · '+e.location:''),mg,y,9,font,rgb(0.5,0.5,0.5));y-=12;if(e.desc){wrap(e.desc).forEach(l=>{chkPg();txt(l,mg+8,y,10);y-=13;});}y-=6;});}
    if(rv.value.education.some(e=>e.degree)){sec('EDUCATION');rv.value.education.filter(e=>e.degree).forEach(e=>{chkPg(30);txt(e.degree,mg,y,11,bold);y-=13;txt((e.school||'')+(e.year?' · '+e.year:'')+(e.grade?' · '+e.grade:''),mg,y,9,font,rgb(0.5,0.5,0.5));y-=16;});}
    if(rv.value.skills){sec('SKILLS');wrap(rv.value.skills).forEach(l=>{chkPg();txt(l,mg,y,10);y-=14;});}
    if(rv.value.certs){sec('CERTIFICATIONS');rv.value.certs.split('\n').forEach(l=>{chkPg();txt('• '+l,mg,y,10);y-=14;});}
    if(rv.value.languages){sec('LANGUAGES');txt(rv.value.languages,mg,y,10);}
    const bytes=await doc.save();
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));a.download=(rv.value.name||'resume')+'.pdf';a.click();
  };

  // ── BUDGET PLANNER ──
  const bgt=ref({name:'',month:'',goal:10000,income:[{label:'Salary',amount:50000},{label:'Freelance',amount:10000}],expenses:[{label:'Rent',amount:15000},{label:'Food',amount:6000},{label:'Transport',amount:3000},{label:'Utilities',amount:2000},{label:'Entertainment',amount:2000}]});
  const bgtTotalIncome=computed(()=>bgt.value.income.reduce((s,i)=>s+(i.amount||0),0));
  const bgtTotalExpense=computed(()=>bgt.value.expenses.reduce((s,i)=>s+(i.amount||0),0));
  const bgtSavings=computed(()=>bgtTotalIncome.value-bgtTotalExpense.value);
  const downloadBudget=async()=>{
    const{PDFDocument,StandardFonts,rgb}=PDFLib;
    const doc=await PDFDocument.create();
    const pg=doc.addPage([595,842]);
    const font=await doc.embedFont(StandardFonts.Helvetica);
    const bold=await doc.embedFont(StandardFonts.HelveticaBold);
    const{width:w,height:h}=pg.getSize();
    const lm=48,rm=w-48;let y=h-48;
    pg.drawRectangle({x:0,y:h-80,width:w,height:80,color:rgb(0.48,0.44,1)});
    pg.drawText('MONTHLY BUDGET PLANNER',{x:lm,y:h-42,size:18,font:bold,color:rgb(1,1,1)});
    pg.drawText((bgt.value.name||'')+(bgt.value.month?' · '+bgt.value.month:''),{x:lm,y:h-62,size:11,font,color:rgb(0.9,0.9,0.9)});
    y=h-100;
    const boxes=[['Total Income','₹'+fmt(bgtTotalIncome.value),rgb(0.05,0.59,0.41)],['Total Expenses','₹'+fmt(bgtTotalExpense.value),rgb(0.9,0.2,0.2)],['Net Savings','₹'+fmt(bgtSavings.value),bgtSavings.value>=0?rgb(0.3,0.6,1):rgb(0.9,0.2,0.2)]];
    const bw=(rm-lm)/3-8;
    boxes.forEach(([label,val,col],i)=>{const x=lm+i*(rm-lm)/3+4;pg.drawRectangle({x,y:y-44,width:bw,height:44,color:col,borderRadius:6});pg.drawText(label,{x:x+8,y:y-16,size:9,font,color:rgb(1,1,1)});pg.drawText(val,{x:x+8,y:y-34,size:14,font:bold,color:rgb(1,1,1)});});
    y-=60;
    pg.drawText('INCOME',{x:lm,y,size:11,font:bold,color:rgb(0.3,0.6,0.2)});y-=4;
    pg.drawLine({start:{x:lm,y},end:{x:rm,y},thickness:0.5,color:rgb(0.3,0.6,0.2)});y-=14;
    bgt.value.income.filter(i=>i.label&&i.amount).forEach(item=>{pg.drawText(item.label,{x:lm,y,size:10,font,color:rgb(0.1,0.1,0.1)});pg.drawText('₹'+fmt(item.amount),{x:rm-70,y,size:10,font:bold,color:rgb(0.05,0.59,0.41)});y-=16;});
    pg.drawText('Total',{x:lm,y,size:10,font:bold});pg.drawText('₹'+fmt(bgtTotalIncome.value),{x:rm-70,y,size:11,font:bold,color:rgb(0.05,0.59,0.41)});
    y-=24;
    pg.drawText('EXPENSES',{x:lm,y,size:11,font:bold,color:rgb(0.9,0.2,0.2)});y-=4;
    pg.drawLine({start:{x:lm,y},end:{x:rm,y},thickness:0.5,color:rgb(0.9,0.2,0.2)});y-=14;
    bgt.value.expenses.filter(i=>i.label&&i.amount).forEach(item=>{pg.drawText(item.label,{x:lm,y,size:10,font,color:rgb(0.1,0.1,0.1)});pg.drawText('₹'+fmt(item.amount),{x:rm-70,y,size:10,font:bold,color:rgb(0.8,0.1,0.1)});const barW=Math.round((item.amount/Math.max(bgtTotalExpense.value,1))*180);pg.drawRectangle({x:lm+120,y:y-2,width:barW,height:10,color:rgb(0.9,0.2,0.2),opacity:0.3});y-=16;});
    pg.drawText('Total',{x:lm,y,size:10,font:bold});pg.drawText('₹'+fmt(bgtTotalExpense.value),{x:rm-70,y,size:11,font:bold,color:rgb(0.8,0.1,0.1)});
    y-=24;
    pg.drawRectangle({x:lm,y:y-28,width:rm-lm,height:28,color:bgtSavings.value>=0?rgb(0.9,0.97,0.9):rgb(0.97,0.9,0.9)});
    pg.drawText('NET SAVINGS',{x:lm+8,y:y-14,size:11,font:bold,color:rgb(0.2,0.2,0.2)});
    pg.drawText('₹'+fmt(bgtSavings.value),{x:rm-90,y:y-14,size:13,font:bold,color:bgtSavings.value>=0?rgb(0.05,0.59,0.41):rgb(0.9,0.2,0.2)});
    pg.drawText('Generated by Toolify',{x:lm,y:36,size:9,font,color:rgb(0.7,0.7,0.7)});
    const bytes=await doc.save();
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));a.download='budget-planner.pdf';a.click();
  };

  // ── BUSINESS PROPOSAL ──
  const prop=ref({company:'',client:'',yourName:'',clientName:'',date:new Date().toISOString().split('T')[0],validTill:'',title:'',summary:'',problem:'',solution:'',timeline:'',terms:'50% advance required to begin. Balance due on delivery.',items:[{desc:'',price:0}]});
  const propTotal=computed(()=>prop.value.items.reduce((s,i)=>s+(i.price||0),0));
  const downloadProposal=async()=>{
    const{PDFDocument,StandardFonts,rgb}=PDFLib;
    const doc=await PDFDocument.create();
    const font=await doc.embedFont(StandardFonts.Helvetica);
    const bold=await doc.embedFont(StandardFonts.HelveticaBold);
    const pw2=595,ph=842,mg=48,rm=pw2-48;
    let pg=doc.addPage([pw2,ph]);let y=ph-48;
    const chk=()=>{if(y<mg+20){pg=doc.addPage([pw2,ph]);y=ph-mg;}};
    const wrap=text=>{const ws=String(text||'').split(' ');const ls=[];let cur='';for(const w of ws){const t=cur?cur+' '+w:w;if(font.widthOfTextAtSize(t,10)<=rm-mg){cur=t;}else{if(cur)ls.push(cur);cur=w;}}if(cur)ls.push(cur);return ls.length?ls:[''];};
    const para=text=>{wrap(text).forEach(l=>{chk();pg.drawText(l,{x:mg,y,size:10,font,color:rgb(0.15,0.15,0.15)});y-=14;});y-=4;};
    const sec=title=>{if(y<mg+40){pg=doc.addPage([pw2,ph]);y=ph-mg;}y-=10;pg.drawText(title,{x:mg,y,size:11,font:bold,color:rgb(0.48,0.44,1)});y-=4;pg.drawLine({start:{x:mg,y},end:{x:rm,y},thickness:0.5,color:rgb(0.48,0.44,1)});y-=14;};
    pg.drawRectangle({x:0,y:ph-120,width:pw2,height:120,color:rgb(0.48,0.44,1)});
    pg.drawText('BUSINESS PROPOSAL',{x:mg,y:ph-52,size:20,font:bold,color:rgb(1,1,1)});
    pg.drawText(prop.value.title||'Project Proposal',{x:mg,y:ph-76,size:13,font,color:rgb(0.9,0.9,1)});
    pg.drawText('By: '+(prop.value.company||'Your Company')+'   For: '+(prop.value.client||'Client'),{x:mg,y:ph-96,size:10,font,color:rgb(0.8,0.8,0.9)});
    pg.drawText('Date: '+prop.value.date+'   Valid: '+prop.value.validTill,{x:mg,y:ph-110,size:9,font,color:rgb(0.8,0.8,0.9)});
    y=ph-140;
    if(prop.value.summary){sec('EXECUTIVE SUMMARY');para(prop.value.summary);}
    if(prop.value.problem){sec('PROBLEM STATEMENT');para(prop.value.problem);}
    if(prop.value.solution){sec('PROPOSED SOLUTION');para(prop.value.solution);}
    if(prop.value.items.some(i=>i.desc)){
      sec('DELIVERABLES & PRICING');
      pg.drawRectangle({x:mg,y:y-16,width:rm-mg,height:18,color:rgb(0.95,0.95,0.97)});
      pg.drawText('Deliverable',{x:mg+6,y:y-4,size:10,font:bold,color:rgb(0.2,0.2,0.2)});
      pg.drawText('Price',{x:rm-55,y:y-4,size:10,font:bold,color:rgb(0.2,0.2,0.2)});
      y-=20;
      prop.value.items.filter(i=>i.desc).forEach((item,idx)=>{chk();if(idx%2===1)pg.drawRectangle({x:mg,y:y-12,width:rm-mg,height:16,color:rgb(0.98,0.98,0.99)});pg.drawText(item.desc,{x:mg+6,y,size:10,font,color:rgb(0.15,0.15,0.15)});pg.drawText('Rs.'+fmt(item.price||0),{x:rm-60,y,size:10,font:bold,color:rgb(0.15,0.15,0.15)});y-=18;});
      chk(24);pg.drawRectangle({x:rm-120,y:y-16,width:120,height:20,color:rgb(0.48,0.44,1)});
      pg.drawText('TOTAL: Rs.'+fmt(propTotal.value),{x:rm-114,y:y-4,size:11,font:bold,color:rgb(1,1,1)});y-=24;
    }
    if(prop.value.timeline){sec('TIMELINE');para(prop.value.timeline);}
    if(prop.value.terms){sec('TERMS & CONDITIONS');para(prop.value.terms);}
    y-=10;chk(60);
    pg.drawText('Authorised Signatory',{x:mg,y,size:10,font:bold});
    pg.drawText(prop.value.yourName||'',{x:mg,y:y-16,size:10,font,color:rgb(0.3,0.3,0.3)});
    pg.drawText(prop.value.company||'',{x:mg,y:y-30,size:9,font,color:rgb(0.5,0.5,0.5)});
    pg.drawText('Generated by Toolify',{x:mg,y:36,size:9,font,color:rgb(0.7,0.7,0.7)});
    const bytes=await doc.save();
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));a.download='proposal.pdf';a.click();
  };

  // ── LETTERHEAD ──
  const lh=ref({company:'',tagline:'',phone:'',email:'',website:'',address:'',gstin:'',cin:'',color:'#7c6fff',date:new Date().toISOString().split('T')[0],ref:'',to:'',subject:'',body:'Dear Sir/Madam,\n\nWith reference to the above subject...\n\nWe hope to hear from you soon.',closing:'Yours sincerely,',signer:'',designation:''});
  const downloadLetterhead=async()=>{
    const{PDFDocument,StandardFonts,rgb}=PDFLib;
    const doc=await PDFDocument.create();
    const pg=doc.addPage([595,842]);
    const font=await doc.embedFont(StandardFonts.Helvetica);
    const bold=await doc.embedFont(StandardFonts.HelveticaBold);
    const{width:w,height:h}=pg.getSize();
    const lm2=48,rm=w-48;let y=h-48;
    const hr=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(lh.value.color||'#7c6fff');
    const col=hr?rgb(parseInt(hr[1],16)/255,parseInt(hr[2],16)/255,parseInt(hr[3],16)/255):rgb(0.48,0.44,1);
    pg.drawRectangle({x:0,y:h-90,width:w,height:90,color:col});
    pg.drawText(lh.value.company||'Company Name',{x:lm2,y:h-46,size:20,font:bold,color:rgb(1,1,1)});
    pg.drawText(lh.value.tagline||'',{x:lm2,y:h-66,size:10,font,color:rgb(0.9,0.9,0.9)});
    const contacts=[lh.value.phone&&'Ph: '+lh.value.phone,lh.value.email&&'Email: '+lh.value.email,lh.value.website&&lh.value.website].filter(Boolean).join('   |   ');
    if(contacts)pg.drawText(contacts,{x:lm2,y:h-83,size:8,font,color:rgb(0.9,0.9,0.9)});
    y=h-110;
    pg.drawText('Date: '+(lh.value.date||''),{x:lm2,y,size:10,font,color:rgb(0.3,0.3,0.3)});
    if(lh.value.ref)pg.drawText('Ref: '+lh.value.ref,{x:rm-80,y,size:10,font,color:rgb(0.3,0.3,0.3)});
    y-=20;
    if(lh.value.to){lh.value.to.split('\n').forEach(line=>{pg.drawText(line,{x:lm2,y,size:10,font,color:rgb(0.1,0.1,0.1)});y-=14;});}
    y-=6;
    if(lh.value.subject){pg.drawText('Sub: '+lh.value.subject,{x:lm2,y,size:10,font:bold,color:rgb(0.1,0.1,0.1)});y-=20;}
    const wrapL=text=>{const ws=String(text||'').split(' ');const ls=[];let cur='';for(const wrd of ws){const t=cur?cur+' '+wrd:wrd;if(font.widthOfTextAtSize(t,10)<=rm-lm2){cur=t;}else{if(cur)ls.push(cur);cur=wrd;}}if(cur)ls.push(cur);return ls.length?ls:[''];};
    lh.value.body.split('\n').forEach(line=>{if(!line.trim()){y-=8;return;}wrapL(line).forEach(l=>{pg.drawText(l,{x:lm2,y,size:10,font,color:rgb(0.1,0.1,0.1)});y-=14;});});
    y-=20;
    pg.drawText(lh.value.closing||'Yours sincerely,',{x:lm2,y,size:10,font,color:rgb(0.1,0.1,0.1)});y-=40;
    pg.drawText(lh.value.signer||'Authorised Signatory',{x:lm2,y,size:11,font:bold,color:rgb(0.1,0.1,0.1)});y-=14;
    pg.drawText(lh.value.designation||'',{x:lm2,y,size:10,font,color:rgb(0.3,0.3,0.3)});y-=12;
    pg.drawText(lh.value.company||'',{x:lm2,y,size:10,font,color:rgb(0.3,0.3,0.3)});
    pg.drawRectangle({x:0,y:0,width:w,height:36,color:col});
    pg.drawText(((lh.value.address||'Address')+(lh.value.gstin?' | GSTIN: '+lh.value.gstin:'')).slice(0,90),{x:lm2,y:14,size:8,font,color:rgb(1,1,1)});
    const bytes=await doc.save();
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));a.download='letterhead.pdf';a.click();
  };

  // ── FINANCE TOOLS ──
  const emi=ref({p:500000,r:8.5,n:60,res:null,showAll:false});
  const calcEmi=()=>{const r=emi.value.r/100/12,n=emi.value.n,p=emi.value.p;const e=p*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1),total=e*n;const sched=[];let bal=p;for(let i=1;i<=n;i++){const int=bal*r,prin=e-int;bal=Math.max(0,bal-prin);sched.push({m:i,emi:Math.round(e),prin:Math.round(prin),int:Math.round(int),bal:Math.round(bal)});}emi.value.res={emi:e.toFixed(2),total:total.toFixed(2),interest:(total-p).toFixed(2),schedule:sched};emi.value.showAll=false;};
  const hl=ref({income:80000,existing:0,rate:8.5,years:20,res:null});
  const calcHl=()=>{const maxEmi=Math.round((hl.value.income-hl.value.existing)*0.5);const r=hl.value.rate/100/12,n=hl.value.years*12;const eligible=Math.round(maxEmi*(Math.pow(1+r,n)-1)/r/Math.pow(1+r,n));const emiOnMax=Math.round(eligible*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1));hl.value.res={eligible,maxEmi,emi:emiOnMax,totalInterest:emiOnMax*n-eligible,foir:Math.round((emiOnMax+hl.value.existing)/hl.value.income*100)};};
  const sip=ref({m:5000,r:12,y:10,res:null});
  const calcSip=()=>{const r=sip.value.r/100/12,n=sip.value.y*12,m=sip.value.m;const total=Math.round(m*(Math.pow(1+r,n)-1)/r*(1+r)),inv=m*n,ret=total-inv;sip.value.res={inv,ret,total,mul:(total/inv).toFixed(2)};};
  const ci=ref({p:100000,r:10,t:5,n:4,res:null});
  const calcCi=()=>{const amount=Math.round(ci.value.p*Math.pow(1+ci.value.r/100/ci.value.n,ci.value.n*ci.value.t));const interest=amount-ci.value.p,si=Math.round(ci.value.p*ci.value.r/100*ci.value.t);ci.value.res={amount,interest,si,extra:interest-si};};
  const fd=ref({type:'fd',amount:100000,rate:7,years:3,compound:4,res:null});
  const calcFd=()=>{let maturity,principal;if(fd.value.type==='fd'){principal=fd.value.amount;maturity=Math.round(fd.value.amount*Math.pow(1+fd.value.rate/100/fd.value.compound,fd.value.compound*fd.value.years));}else{principal=fd.value.amount*fd.value.years*12;const r=fd.value.rate/100/12,n=fd.value.years*12;maturity=Math.round(fd.value.amount*(Math.pow(1+r,n+1)-(1+r))/r);}fd.value.res={maturity,principal,interest:maturity-principal};};
  const tax=ref({income:1200000,regime:'new',ded:150000,hra:0,res:null});
  const calcTax=()=>{let taxable=tax.value.income,slabs=[];if(tax.value.regime==='old'){taxable-=Math.min(tax.value.ded,150000);taxable-=tax.value.hra;taxable-=50000;taxable=Math.max(0,taxable);}else taxable=Math.max(0,taxable-75000);const s=tax.value.regime==='new'?[[300000,0],[300000,.05],[300000,.1],[300000,.15],[300000,.2],[Infinity,.3]]:[[250000,0],[250000,.05],[500000,.2],[Infinity,.3]];let t=0,rem=taxable;for(const[lim,rate]of s){const chunk=Math.min(rem,lim);t+=chunk*rate;rem-=chunk;if(chunk*rate>0)slabs.push({l:'@ '+rate*100+'%',t:Math.round(chunk*rate)});if(rem<=0)break;}tax.value.res={taxable,tax:Math.round(t*1.04),slabs};};
  const sal=ref({ctc:1200000,basicPct:40,hraPct:50,res:null});
  const calcSal=()=>{const basic=Math.round(sal.value.ctc*sal.value.basicPct/100);const hra=Math.round(basic*sal.value.hraPct/100);const pf=Math.round(Math.min(basic,180000)*.12);const gross=sal.value.ctc-pf;const special=Math.max(0,gross-basic-hra);let taxable=Math.max(0,gross-75000),taxAmt=0,rem=taxable;for(const[lim,rate]of[[300000,0],[300000,.05],[300000,.1],[300000,.15],[300000,.2],[Infinity,.3]]){const c=Math.min(rem,lim);taxAmt+=c*rate;rem-=c;if(rem<=0)break;}taxAmt=Math.round(taxAmt*1.04);sal.value.res={basic,hra,special,gross,pf:pf*2,epf:pf,tax:taxAmt,takeHomeAnnual:gross-pf-taxAmt,takeHome:Math.round((gross-pf-taxAmt)/12)};};
  const gst=ref({amount:1000,rate:18,mode:'add'});
  const gstBase=computed(()=>gst.value.mode==='add'?gst.value.amount:+(gst.value.amount/(1+gst.value.rate/100)).toFixed(2));
  const gstAmt=computed(()=>+(gstBase.value*gst.value.rate/100).toFixed(2));
  const gstTotal=computed(()=>+(gstBase.value+gstAmt.value).toFixed(2));
  const inv=ref({from:'',to:'',num:'INV-001',date:new Date().toISOString().split('T')[0],gstin:'',gstRate:18,items:[{desc:'Service Charge',qty:1,rate:5000}]});
  const invSubtotal=computed(()=>inv.value.items.reduce((s,i)=>s+(i.qty||0)*(i.rate||0),0));
  const invGst=computed(()=>Math.round(invSubtotal.value*inv.value.gstRate/100));
  const invTotal=computed(()=>invSubtotal.value+invGst.value);
  const genInvoicePdf=async()=>{const{PDFDocument,rgb,StandardFonts}=PDFLib;const doc=await PDFDocument.create();const pg=doc.addPage([595,842]);const font=await doc.embedFont(StandardFonts.Helvetica);const bold=await doc.embedFont(StandardFonts.HelveticaBold);const{width:w,height:h}=pg.getSize();const lm=50,rm=w-50;let y=h-50;pg.drawRectangle({x:0,y:h-80,width:w,height:80,color:rgb(0.48,0.44,1)});pg.drawText('INVOICE',{x:lm,y:h-52,size:26,font:bold,color:rgb(1,1,1)});pg.drawText(inv.value.num||'INV-001',{x:rm-100,y:h-45,size:13,font,color:rgb(1,1,1)});pg.drawText('Date: '+inv.value.date,{x:rm-100,y:h-63,size:10,font,color:rgb(0.9,0.9,0.9)});y=h-100;pg.drawText('FROM',{x:lm,y,size:9,font,color:rgb(0.5,0.5,0.5)});pg.drawText('TO',{x:300,y,size:9,font,color:rgb(0.5,0.5,0.5)});y-=16;pg.drawText(inv.value.from||'Your Business',{x:lm,y,size:12,font:bold,color:rgb(0.1,0.1,0.1)});pg.drawText(inv.value.to||'Client',{x:300,y,size:12,font:bold,color:rgb(0.1,0.1,0.1)});y-=20;pg.drawRectangle({x:lm,y:y-4,width:rm-lm,height:22,color:rgb(0.95,0.95,0.97)});['Description','Qty','Rate','Amount'].forEach((t,i)=>pg.drawText(t,{x:[lm+6,370,420,490][i],y:y+4,size:10,font:bold,color:rgb(0.2,0.2,0.2)}));y-=24;inv.value.items.forEach((item,i)=>{const amt=(item.qty||0)*(item.rate||0);if(i%2===1)pg.drawRectangle({x:lm,y:y-4,width:rm-lm,height:20,color:rgb(0.98,0.98,0.99)});pg.drawText((item.desc||'Item').slice(0,40),{x:lm+6,y:y+2,size:10,font,color:rgb(0.15,0.15,0.15)});pg.drawText(String(item.qty||0),{x:376,y:y+2,size:10,font,color:rgb(0.15,0.15,0.15)});pg.drawText(fmt(item.rate||0),{x:416,y:y+2,size:10,font,color:rgb(0.15,0.15,0.15)});pg.drawText('Rs.'+fmt(amt),{x:480,y:y+2,size:10,font,color:rgb(0.15,0.15,0.15)});y-=22;});y-=10;pg.drawLine({start:{x:lm,y},end:{x:rm,y},thickness:0.5,color:rgb(0.8,0.8,0.8)});y-=16;pg.drawText('Subtotal:',{x:400,y,size:10,font,color:rgb(0.4,0.4,0.4)});pg.drawText('Rs.'+fmt(invSubtotal.value),{x:480,y,size:10,font});y-=16;pg.drawText('GST ('+inv.value.gstRate+'%):',{x:400,y,size:10,font,color:rgb(0.4,0.4,0.4)});pg.drawText('Rs.'+fmt(invGst.value),{x:480,y,size:10,font});y-=20;pg.drawRectangle({x:390,y:y-6,width:rm-390,height:24,color:rgb(0.48,0.44,1)});pg.drawText('TOTAL:',{x:396,y:y+2,size:11,font:bold,color:rgb(1,1,1)});pg.drawText('Rs.'+fmt(invTotal.value),{x:460,y:y+2,size:11,font:bold,color:rgb(1,1,1)});pg.drawText('Thank you!',{x:lm,y:50,size:10,font,color:rgb(0.5,0.5,0.5)});const bytes=await doc.save();const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));a.download=(inv.value.num||'invoice')+'.pdf';a.click();};
  const disc=ref({price:1000,pct:20});
  const roi=ref({cost:100000,gain:150000,years:2});
  const grat=ref({basic:50000,years:10});
  const pf=ref({basic:30000,empPct:12,emrPct:12,rate:8.25,years:30});
  const pfMaturity=computed(()=>{if(!pf.value.basic||!pf.value.years)return 0;const monthly=Math.round(pf.value.basic*(pf.value.empPct+pf.value.emrPct)/100);const r=pf.value.rate/100/12,n=pf.value.years*12;return Math.round(monthly*(Math.pow(1+r,n)-1)/r*(1+r));});
  const tds=ref({type:'194j',amount:100000});
  const tdsRateMap={salary:10,'194c':1,'194j':10,'194i':10,'194a':10};
  const tdsRate=computed(()=>tdsRateMap[tds.value.type]||10);
  const tdsAmt=computed(()=>Math.round(tds.value.amount*tdsRate.value/100));
  const be=ref({fixed:50000,variable:200,price:500});
  const fl=ref({income:1200000,hours:6,days:220,expenses:60000,tax:20});
  const sdStates=[{name:'Maharashtra',duty:6,reg:1},{name:'Delhi',duty:6,reg:1},{name:'Karnataka',duty:5,reg:1},{name:'Tamil Nadu',duty:7,reg:1},{name:'Gujarat',duty:4.9,reg:1},{name:'Rajasthan',duty:6,reg:1},{name:'UP',duty:7,reg:1},{name:'West Bengal',duty:6,reg:1}];
  const sd=ref({value:5000000,state:'Maharashtra',gender:'male'});
  const sdCalc=computed(()=>{const s=sdStates.find(x=>x.name===sd.value.state)||sdStates[0];let dutyPct=s.duty;if(sd.value.gender==='female'&&sd.value.state==='Maharashtra')dutyPct=5;const duty=Math.round(sd.value.value*dutyPct/100);const reg=Math.round(sd.value.value*s.reg/100);return{duty,reg,total:duty+reg,pct:(dutyPct+s.reg).toFixed(1)};});
  const rvb=ref({rent:25000,rentInc:5,price:8000000,down:20,rate:8.5,years:10,res:null});
  const calcRvb=()=>{const downAmt=Math.round(rvb.value.price*rvb.value.down/100);const loan=rvb.value.price-downAmt;const r=rvb.value.rate/100/12,n=rvb.value.years*12;const emiAmt=loan*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1);const totalBuy=Math.round(emiAmt*n+downAmt);let totalRent=0,rent=rvb.value.rent;for(let i=0;i<rvb.value.years;i++){totalRent+=rent*12;rent=Math.round(rent*(1+rvb.value.rentInc/100));}rvb.value.res={totalRent:Math.round(totalRent),totalBuy,downAmt,verdict:totalRent<totalBuy?'RENT':'BUY'};};

  // ── HEALTH ──
  const cal=ref({age:25,gender:'male',weight:70,height:175,activity:'1.55',res:null});
  const calcCal=()=>{const v=cal.value,bmr=v.gender==='male'?10*v.weight+6.25*v.height-5*v.age+5:10*v.weight+6.25*v.height-5*v.age-161;const maintain=Math.round(bmr*parseFloat(v.activity));cal.value.res={bmr:Math.round(bmr),maintain,lose:maintain-500,gain:maintain+500,protein:Math.round(v.weight*2),carbs:Math.round(maintain*.45/4),fat:Math.round(maintain*.25/9)};};
  const bmi=ref({w:70,h:175,res:null});
  const bmiZones=[{l:'Underweight',c:'#3b82f6',f:1},{l:'Normal',c:'#22c55e',f:1.5},{l:'Overweight',c:'#f59e0b',f:1},{l:'Obese',c:'#ef4444',f:1.5}];
  const calcBmi=()=>{const h=bmi.value.h/100,val=(bmi.value.w/(h*h)).toFixed(1);const[,label,color]=[[18.5,'Underweight','#3b82f6'],[25,'Normal','#22c55e'],[30,'Overweight','#f59e0b'],[Infinity,'Obese','#ef4444']].find(([t])=>val<t);bmi.value.res={val,label,color};};
  const age=ref({dob:'',on:new Date().toISOString().split('T')[0],res:null});
  const calcAge=()=>{const d=new Date(age.value.dob),o=new Date(age.value.on);let y=o.getFullYear()-d.getFullYear(),m=o.getMonth()-d.getMonth(),da=o.getDate()-d.getDate();if(da<0){m--;da+=new Date(o.getFullYear(),o.getMonth(),0).getDate();}if(m<0){y--;m+=12;}const td=Math.floor((o-d)/86400000);const nb=new Date(o.getFullYear(),d.getMonth(),d.getDate());if(nb<=o)nb.setFullYear(nb.getFullYear()+1);age.value.res={y,m,d:da,tm:y*12+m,td,th:td*24,nb:Math.ceil((nb-o)/86400000)};};
  const dd=ref({from:'',to:''});
  const ddRes=computed(()=>{if(!dd.value.from||!dd.value.to)return{days:0,weeks:0,months:0,workdays:0};const a=new Date(dd.value.from),b=new Date(dd.value.to);const days=Math.abs(Math.floor((b-a)/86400000));let wd=0;const s=new Date(Math.min(a,b)),e=new Date(Math.max(a,b));for(let i=new Date(s);i<=e;i.setDate(i.getDate()+1)){const d=i.getDay();if(d!==0&&d!==6)wd++;}return{days,weeks:(days/7).toFixed(1),months:(days/30.44).toFixed(1),workdays:wd};});
  const tip=ref({bill:1000,pct:10,split:2});
  const cgpa=ref({val:'',pct:''});
  const pc=ref({a:{x:'',y:''},b:{x:'',y:''},c:{x:'',y:''}});

  // ── TEXT & DEV ──
  const wc=ref({text:''});
  const wcS=computed(()=>{const t=wc.value.text,words=t.trim()?t.trim().split(/\s+/).length:0;return{words,chars:t.length,noSpace:t.replace(/\s/g,'').length,sentences:t.split(/[.!?]+/).filter(s=>s.trim()).length,para:t.split(/\n\s*\n/).filter(p=>p.trim()).length||(words?1:0),read:Math.max(1,Math.round(words/200))};});
  const cc=ref({input:'',mode:'upper',copied:false});
  const caseModes=[{k:'upper',l:'UPPER'},{k:'lower',l:'lower'},{k:'title',l:'Title'},{k:'sentence',l:'Sentence'},{k:'camel',l:'camelCase'},{k:'snake',l:'snake_case'},{k:'kebab',l:'kebab-case'}];
  const caseResult=computed(()=>{const t=cc.value.input;if(cc.value.mode==='upper')return t.toUpperCase();if(cc.value.mode==='lower')return t.toLowerCase();if(cc.value.mode==='title')return t.replace(/\b\w/g,c=>c.toUpperCase());if(cc.value.mode==='sentence')return t.charAt(0).toUpperCase()+t.slice(1).toLowerCase();if(cc.value.mode==='camel')return t.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g,(_,c)=>c.toUpperCase());if(cc.value.mode==='snake')return t.toLowerCase().replace(/\s+/g,'_');return t.toLowerCase().replace(/\s+/g,'-');});
  const copyCR=()=>{cp(caseResult.value);cc.value.copied=true;setTimeout(()=>cc.value.copied=false,1500);};
  const pw=ref({val:'',len:16,upper:true,lower:true,nums:true,sym:true,copied:false});
  const genPw=()=>{let c='';if(pw.value.upper)c+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';if(pw.value.lower)c+='abcdefghijklmnopqrstuvwxyz';if(pw.value.nums)c+='0123456789';if(pw.value.sym)c+='!@#$%^&*()_+-=[]{}|;:,.<>?';if(!c)c='abcdefghijklmnopqrstuvwxyz';pw.value.val=Array.from({length:pw.value.len},()=>c[Math.floor(Math.random()*c.length)]).join('');};
  const pwStr=computed(()=>{const v=pw.value.val;if(!v)return{color:'#2a2a38',label:'—'};const s=[/[a-z]/,/[A-Z]/,/[0-9]/,/[^a-zA-Z0-9]/].filter(r=>r.test(v)).length+(v.length>=12?1:0)+(v.length>=20?1:0);return s<=2?{color:'#ef4444',label:'Weak'}:s<=4?{color:'#f59e0b',label:'Medium'}:{color:'#22c55e',label:'Strong'};});
  const copyPw=()=>{cp(pw.value.val);pw.value.copied=true;setTimeout(()=>pw.value.copied=false,1500);};
  const qr=ref({text:'',size:200,format:'png'});
  const qrUrl=computed(()=>`https://api.qrserver.com/v1/create-qr-code/?size=${qr.value.size}x${qr.value.size}&data=${encodeURIComponent(qr.value.text)}&format=${qr.value.format}`);
  const clr=ref({hex:'#7c6fff'});
  const h2r=h=>{const r=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h);return r?{r:parseInt(r[1],16),g:parseInt(r[2],16),b:parseInt(r[3],16)}:{r:0,g:0,b:0};};
  const clrRgb=computed(()=>{const{r,g,b}=h2r(clr.value.hex);return`rgb(${r}, ${g}, ${b})`;});
  const clrHsl=computed(()=>{let{r,g,b}=h2r(clr.value.hex);r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h,s,l=(mx+mn)/2;if(mx===mn){h=s=0;}else{const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h/=6;}return`hsl(${Math.round(h*360)}, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;});
  const grad=ref({c1:'#7c6fff',c2:'#5ef0c8',dir:'to right',type:'linear'});
  const gradientCss=computed(()=>grad.value.type==='linear'?`linear-gradient(${grad.value.dir}, ${grad.value.c1}, ${grad.value.c2})`:`radial-gradient(circle, ${grad.value.c1}, ${grad.value.c2})`);
  const pal=ref({base:'#7c6fff',type:'mono'});
  const hexToHsl=hex=>{let{r,g,b}=h2r(hex);r/=255;g/=255;b/=255;const mx=Math.max(r,g,b),mn=Math.min(r,g,b);let h=0,s=0,l=(mx+mn)/2;if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);h=mx===r?(g-b)/d+(g<b?6:0):mx===g?(b-r)/d+2:(r-g)/d+4;h/=6;}return[Math.round(h*360),Math.round(s*100),Math.round(l*100)];};
  const hslToHex=(h,s,l)=>{s/=100;l/=100;const a=s*Math.min(l,1-l);const f=n=>{const k=(n+h/30)%12;const color=l-a*Math.max(Math.min(k-3,9-k,1),-1);return Math.round(255*color).toString(16).padStart(2,'0');};return`#${f(0)}${f(8)}${f(4)}`;};
  const palColors=computed(()=>{const[h,s,l]=hexToHsl(pal.value.base);if(pal.value.type==='mono')return[-20,-10,0,10,20].map(d=>hslToHex(h,s,Math.max(10,Math.min(90,l+d))));if(pal.value.type==='comp')return[0,30,60,180,210].map(d=>hslToHex((h+d)%360,s,l));if(pal.value.type==='ana')return[-30,-15,0,15,30].map(d=>hslToHex((h+d+360)%360,s,l));return[0,120,240,60,180].map(d=>hslToHex((h+d)%360,s,l));});
  const jf=ref({input:'',mode:'format',out:'',err:'',valid:null});
  const processJson=()=>{jf.value.err='';jf.value.out='';jf.value.valid=null;try{const p=JSON.parse(jf.value.input);if(jf.value.mode==='format')jf.value.out=JSON.stringify(p,null,2);else if(jf.value.mode==='minify')jf.value.out=JSON.stringify(p);else jf.value.valid=true;}catch(e){jf.value.err='Invalid JSON: '+e.message;}};
  const b64=ref({input:'',mode:'encode',out:'',err:''});
  const processB64=()=>{b64.value.err='';b64.value.out='';try{if(b64.value.mode==='encode')b64.value.out=btoa(unescape(encodeURIComponent(b64.value.input)));else b64.value.out=decodeURIComponent(escape(atob(b64.value.input)));}catch(e){b64.value.err='Error: '+e.message;}};
  const ue=ref({input:'',mode:'encode'});
  const ueResult=computed(()=>{try{return ue.value.mode==='encode'?encodeURIComponent(ue.value.input):decodeURIComponent(ue.value.input);}catch{return'Invalid';}});
  const hsh=ref({input:''});
  const sHash=(s,seed=0)=>{let h=seed;for(let i=0;i<s.length;i++){h=Math.imul(31,h)+s.charCodeAt(i)|0;}return(h>>>0).toString(16).padStart(8,'0');};
  const hashResults=computed(()=>{if(!hsh.value.input)return[];const s=hsh.value.input;const h1=Array.from({length:8},(_,i)=>sHash(s,i*1337)).join('');const h2=Array.from({length:16},(_,i)=>sHash(s+i,i*7919)).join('');return[{label:'MD5-style (32)',val:h1},{label:'SHA1-style (40)',val:h2.slice(0,40)},{label:'SHA256-style (64)',val:(h2+h1+h2).slice(0,64)}];});
  const rx=ref({pattern:'',flags:'gi',text:''});
  const rxMatches=computed(()=>{if(!rx.value.pattern||!rx.value.text)return[];try{return[...rx.value.text.matchAll(new RegExp(rx.value.pattern,rx.value.flags))].map(m=>m[0]);}catch{return[];}});
  const rxErr=computed(()=>{if(!rx.value.pattern)return'';try{new RegExp(rx.value.pattern,rx.value.flags);return'';}catch(e){return e.message;}});
  const md=ref({input:'# Hello\n\n**Bold** and *italic*\n\n- Item 1\n- Item 2'});
  const mdHtml=computed(()=>{let t=md.value.input;t=t.replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/`(.+?)`/g,'<code>$1</code>').replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2">$1</a>').replace(/^- (.+)$/gm,'<li>$1</li>').replace(/(<li>.*<\/li>\n?)+/g,'<ul>$&</ul>').replace(/\n\n/g,'</p><p>');return'<p>'+t+'</p>';});
  const ic=ref({original:null,compressed:null,origSize:'',newSize:'',saved:0,quality:80,w:0,h:0});
  const loadImg=file=>{if(!file)return;const r=new FileReader();r.onload=e=>{ic.value.original=e.target.result;ic.value.origSize=fmtB(file.size);const img=new Image();img.onload=()=>{ic.value.w=img.width;ic.value.h=img.height;compressImg();};img.src=e.target.result;};r.readAsDataURL(file);};
  const compressImg=()=>{if(!ic.value.original)return;const img=new Image();img.onload=()=>{const canvas=document.querySelector('canvas');if(!canvas)return;canvas.width=img.width;canvas.height=img.height;canvas.getContext('2d').drawImage(img,0,0);const out=canvas.toDataURL('image/jpeg',ic.value.quality/100);ic.value.compressed=out;const ol=ic.value.original.length*.75,nl=out.length*.75;ic.value.newSize=fmtB(nl);ic.value.saved=Math.max(0,Math.round((1-nl/ol)*100));};img.src=ic.value.original;};

  // ── IMAGE TOOLS ──
  const loadImgSrc=src=>new Promise(res=>{const i=new Image();i.onload=()=>res(i);i.src=src;});
  const extFromFmt=fmt=>(fmt==='image/png'?'.png':fmt==='image/webp'?'.webp':'.jpg');
  const dlCanvas=(canvas,fmt,quality,name)=>{const a=document.createElement('a');a.href=canvas.toDataURL(fmt,quality/100);a.download=name+extFromFmt(fmt);a.click();};

  // Image Resizer
  const ir=ref({src:null,origW:0,origH:0,w:0,h:0,lock:true,fmt:'image/jpeg'});
  const irLoad=file=>{if(!file)return;const r=new FileReader();r.onload=e=>{const img=new Image();img.onload=()=>{ir.value={src:e.target.result,origW:img.width,origH:img.height,w:img.width,h:img.height,lock:true,fmt:'image/jpeg'};};img.src=e.target.result;};r.readAsDataURL(file);};
  const irAspect=changed=>{if(!ir.value.lock||!ir.value.origW)return;const ratio=ir.value.origW/ir.value.origH;if(changed==='w')ir.value.h=Math.round(ir.value.w/ratio);else ir.value.w=Math.round(ir.value.h*ratio);};
  const irProcess=async()=>{const v=ir.value;if(!v.src)return;const img=await loadImgSrc(v.src);const c=document.createElement('canvas');c.width=v.w;c.height=v.h;c.getContext('2d').drawImage(img,0,0,v.w,v.h);dlCanvas(c,v.fmt,92,'resized');};

  // Image Cropper
  const cropPresets=[{l:'Square 1:1',r:1},{l:'4:3',r:4/3},{l:'16:9',r:16/9},{l:'3:4',r:3/4}];
  const icrop=ref({src:null,imgW:0,imgH:0,x:0,y:0,w:0,h:0,fmt:'image/jpeg'});
  const cropLoad=file=>{if(!file)return;const r=new FileReader();r.onload=e=>{const img=new Image();img.onload=()=>{icrop.value={src:e.target.result,imgW:img.width,imgH:img.height,x:0,y:0,w:img.width,h:img.height,fmt:'image/jpeg'};};img.src=e.target.result;};r.readAsDataURL(file);};
  const applyCropPreset=p=>{const{imgW,imgH}=icrop.value;let w=imgW,h=Math.round(w/p.r);if(h>imgH){h=imgH;w=Math.round(h*p.r);}icrop.value.w=w;icrop.value.h=h;icrop.value.x=Math.round((imgW-w)/2);icrop.value.y=Math.round((imgH-h)/2);};
  const cropProcess=async()=>{const v=icrop.value;if(!v.src)return;const img=await loadImgSrc(v.src);const c=document.createElement('canvas');c.width=v.w;c.height=v.h;c.getContext('2d').drawImage(img,v.x,v.y,v.w,v.h,0,0,v.w,v.h);dlCanvas(c,v.fmt,92,'cropped');};

  // Pixel Art Maker
  const ipixel=ref({src:null,size:16});
  const pixelLoad=file=>{if(!file)return;const r=new FileReader();r.onload=e=>{ipixel.value={src:e.target.result,size:16};Vue.nextTick(pixelProcess);};r.readAsDataURL(file);};
  const pixelProcess=async()=>{const v=ipixel.value;if(!v.src)return;const canvas=document.getElementById('pixel-canvas');if(!canvas)return;const img=await loadImgSrc(v.src);const w=img.width,h=img.height,s=v.size;canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=false;const tmp=document.createElement('canvas');tmp.width=Math.ceil(w/s);tmp.height=Math.ceil(h/s);tmp.getContext('2d').drawImage(img,0,0,tmp.width,tmp.height);ctx.drawImage(tmp,0,0,tmp.width,tmp.height,0,0,w,h);};
  const pixelDownload=()=>{const c=document.getElementById('pixel-canvas');if(c)dlCanvas(c,'image/png',100,'pixel-art');};

  // Passport Photo Maker
  const ppPresets={india:{w:413,h:531},us:{w:600,h:600},china:{w:390,h:567},square:{w:300,h:300}};
  const ipassport=ref({src:null,preset:'india',bg:'#ffffff'});
  const ppLoad=file=>{if(!file)return;const r=new FileReader();r.onload=e=>{ipassport.value={src:e.target.result,preset:'india',bg:'#ffffff'};Vue.nextTick(ppPreview);};r.readAsDataURL(file);};
  const ppPreview=async()=>{const v=ipassport.value;if(!v.src)return;const canvas=document.getElementById('pp-canvas');if(!canvas)return;const{w,h}=ppPresets[v.preset]||ppPresets.india;canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.fillStyle=v.bg;ctx.fillRect(0,0,w,h);const img=await loadImgSrc(v.src);const scale=Math.max(w/img.width,h/img.height);const sw=img.width*scale,sh=img.height*scale;ctx.drawImage(img,(w-sw)/2,(h-sh)/2,sw,sh);};
  const ppProcess=async()=>{await ppPreview();const c=document.getElementById('pp-canvas');if(c)dlCanvas(c,'image/jpeg',95,'passport-photo');};

  // Image Rotate & Flip
  const irotate=ref({src:null,fmt:'image/jpeg',angle:0,flipH:false,flipV:false});
  const rotLoad=file=>{if(!file)return;const r=new FileReader();r.onload=e=>{irotate.value={src:e.target.result,fmt:'image/jpeg',angle:0,flipH:false,flipV:false};Vue.nextTick(rotRender);};r.readAsDataURL(file);};
  const rotRender=async()=>{const v=irotate.value;if(!v.src)return;const canvas=document.getElementById('rot-canvas');if(!canvas)return;const img=await loadImgSrc(v.src);const deg=(v.angle%360+360)%360,rad=deg*Math.PI/180;const ow=img.width,oh=img.height;const sw=(deg===90||deg===270)?oh:ow,sh=(deg===90||deg===270)?ow:oh;canvas.width=sw;canvas.height=sh;const ctx=canvas.getContext('2d');ctx.save();ctx.translate(sw/2,sh/2);ctx.rotate(rad);ctx.scale(v.flipH?-1:1,v.flipV?-1:1);ctx.drawImage(img,-ow/2,-oh/2);ctx.restore();};
  const rotApply=op=>{const v=irotate.value;if(op==='r90')v.angle=(v.angle+90)%360;else if(op==='l90')v.angle=(v.angle+270)%360;else if(op==='r180')v.angle=(v.angle+180)%360;else if(op==='fh')v.flipH=!v.flipH;else if(op==='fv')v.flipV=!v.flipV;Vue.nextTick(rotRender);};
  const rotDownload=()=>{const c=document.getElementById('rot-canvas');if(c)dlCanvas(c,irotate.value.fmt,92,'rotated');};

  // Image Converter
  const iconvert=ref({src:null,origName:'',origSize:'',fmt:'image/jpeg',quality:90});
  const convLoad=file=>{if(!file)return;iconvert.value.origName=file.name;iconvert.value.origSize=fmtB(file.size);const r=new FileReader();r.onload=e=>{iconvert.value.src=e.target.result;};r.readAsDataURL(file);};
  const convProcess=async()=>{const v=iconvert.value;if(!v.src)return;const img=await loadImgSrc(v.src);const c=document.createElement('canvas');c.width=img.width;c.height=img.height;c.getContext('2d').drawImage(img,0,0);dlCanvas(c,v.fmt,v.quality,'converted');};

  // Image OCR (Tesseract.js)
  const ocr=ref({src:null,lang:'eng',loading:false,progress:'',text:'',err:''});
  const ocrLoad=file=>{if(!file)return;const r=new FileReader();r.onload=e=>{ocr.value.src=e.target.result;ocr.value.text='';ocr.value.err='';};r.readAsDataURL(file);};
  const runOcr=async()=>{ocr.value.loading=true;ocr.value.err='';ocr.value.text='';ocr.value.progress='Loading...';try{const result=await Tesseract.recognize(ocr.value.src,ocr.value.lang,{logger:m=>{if(m.status)ocr.value.progress=m.status+(m.progress?' '+Math.round(m.progress*100)+'%':'');}});ocr.value.text=result.data.text;}catch(e){ocr.value.err='Error: '+e.message;}ocr.value.loading=false;};
  const downloadOcrText=()=>{const a=document.createElement('a');a.href='data:text/plain;charset=utf-8,'+encodeURIComponent(ocr.value.text);a.download='extracted-text.txt';a.click();};

  // ── PDF LIVE EDITOR ──
  // PDF.js objects use private class fields that break inside Vue Proxy — store outside ref
  let _pdfDoc=null,_pdfAllItems={};
  const PDFJS_WORKER='https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
  const pdfed=ref({loaded:false,file:null,pageNum:1,totalPages:0,items:[],canvasW:0,canvasH:0,overlayScale:1,selectedIdx:-1,loading:false,err:'',done:false});
  const pdfedModifiedCount=computed(()=>{let n=0;for(const items of Object.values(_pdfAllItems))for(const it of items)if(it.editStr!==null)n++;return n;});
  const pdfedReset=()=>{_pdfDoc=null;_pdfAllItems={};Object.assign(pdfed.value,{loaded:false,file:null,pageNum:1,totalPages:0,items:[],canvasW:0,canvasH:0,overlayScale:1,selectedIdx:-1,loading:false,err:'',done:false});};
  const pdfedExtractAll=async()=>{_pdfAllItems={};for(let p=1;p<=pdfed.value.totalPages;p++){const pg=await _pdfDoc.getPage(p);const vp=pg.getViewport({scale:1.5});const tc=await pg.getTextContent();_pdfAllItems[p]=tc.items.filter(it=>it.str&&it.str.trim()).map(it=>{const[xPx,yPx]=vp.convertToViewportPoint(it.transform[4],it.transform[5]);const fs=Math.max(Math.abs(it.transform[0])*1.5,6);return{origStr:it.str,editStr:null,xPx,yPx:yPx-fs,fontSize:fs,width:Math.max((it.width||0)*1.5,8),pdfX:it.transform[4],pdfY:it.transform[5],pdfFontSize:Math.abs(it.transform[0])||10,pdfWidth:it.width||0,bold:false,italic:false,color:'#000000',sizeOvr:null};});}};
  const pdfedUpdateScale=()=>requestAnimationFrame(()=>{const c=document.getElementById('pdfed-canvas');if(c&&pdfed.value.canvasW)pdfed.value.overlayScale=c.clientWidth/pdfed.value.canvasW;});
  const pdfedLoad=async file=>{if(!file||file.type!=='application/pdf')return;pdfed.value.err='';pdfed.value.loading=true;_pdfDoc=null;_pdfAllItems={};pdfed.value.loaded=false;try{pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;_pdfDoc=await pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;pdfed.value.file=file;pdfed.value.totalPages=_pdfDoc.numPages;pdfed.value.pageNum=1;await pdfedExtractAll();pdfed.value.loaded=true;await Vue.nextTick();await pdfedRender();}catch(e){pdfed.value.err='Error: '+e.message;}pdfed.value.loading=false;};
  // Draw all edited items directly onto the canvas — no overlay divs needed
  const pdfedRenderEdits=()=>{const c=document.getElementById('pdfed-canvas');if(!c)return;const ctx=c.getContext('2d');ctx.save();for(const item of(pdfed.value.items||[])){if(item.editStr===null)continue;const fs=(item.sizeOvr||item.pdfFontSize)*1.5;const wt=item.bold?'bold':'normal',st=item.italic?'italic':'normal';ctx.font=`${st} ${wt} ${fs}px Helvetica,Arial,sans-serif`;const tw=ctx.measureText(item.editStr).width;ctx.fillStyle='#ffffff';ctx.fillRect(item.xPx-2,item.yPx-2,Math.max(item.width,tw)+8,fs+8);ctx.fillStyle=item.color||'#000000';ctx.textBaseline='top';ctx.fillText(item.editStr,item.xPx,item.yPx);}ctx.restore();};
  const pdfedRender=async()=>{const c=document.getElementById('pdfed-canvas');if(!c||!_pdfDoc)return;try{const pg=await _pdfDoc.getPage(pdfed.value.pageNum);const vp=pg.getViewport({scale:1.5});pdfed.value.canvasW=vp.width;pdfed.value.canvasH=vp.height;c.width=vp.width;c.height=vp.height;const ctx=c.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,c.width,c.height);await pg.render({canvasContext:ctx,viewport:vp}).promise;pdfed.value.items=_pdfAllItems[pdfed.value.pageNum]||[];pdfedUpdateScale();pdfedRenderEdits();}catch(e){pdfed.value.err='Render error: '+e.message;}};
  const pdfedChangePage=async d=>{pdfed.value.pageNum+=d;pdfed.value.selectedIdx=-1;await pdfedRender();};
  // Select a text item — loads it into the edit panel
  const pdfedSelect=(i)=>{pdfed.value.selectedIdx=i;};
  // Live update from textarea input — redraws edits on canvas without full re-render
  const pdfedTextInput=(val)=>{const i=pdfed.value.selectedIdx;if(i<0)return;pdfed.value.items[i].editStr=val===pdfed.value.items[i].origStr?null:val;pdfedRenderEdits();};
  // Apply button — triggers clean full re-render with current edits baked in
  const pdfedApplyEdit=async()=>{await pdfedRender();};
  // Reset selected item back to original
  const pdfedResetItem=async()=>{const i=pdfed.value.selectedIdx;if(i<0)return;const it=pdfed.value.items[i];it.editStr=null;it.bold=false;it.italic=false;it.color='#000000';it.sizeOvr=null;await pdfedRender();};
  const pdfedToggleFmt=type=>{const i=pdfed.value.selectedIdx;if(i<0)return;const it=pdfed.value.items[i];it[type]=!it[type];if(it.editStr===null)it.editStr=it.origStr;pdfedRenderEdits();};
  const pdfedSetSize=size=>{const i=pdfed.value.selectedIdx;if(i<0||!size)return;const it=pdfed.value.items[i];it.sizeOvr=size;if(it.editStr===null)it.editStr=it.origStr;pdfedRenderEdits();};
  const pdfedSetColor=color=>{const i=pdfed.value.selectedIdx;if(i<0)return;const it=pdfed.value.items[i];it.color=color;if(it.editStr===null)it.editStr=it.origStr;pdfedRenderEdits();};
  const pdfedSave=async()=>{if(!pdfed.value.file)return;pdfed.value.done=false;pdfed.value.err='';try{const{PDFDocument,StandardFonts,rgb}=PDFLib;const doc=await PDFDocument.load(await pdfed.value.file.arrayBuffer());const fNormal=await doc.embedFont(StandardFonts.Helvetica);const fBold=await doc.embedFont(StandardFonts.HelveticaBold);const fItalic=await doc.embedFont(StandardFonts.HelveticaOblique);const fBoldItalic=await doc.embedFont(StandardFonts.HelveticaBoldOblique);const pages=doc.getPages();for(const[ps,items]of Object.entries(_pdfAllItems)){const pg=pages[+ps-1];if(!pg)continue;for(const it of items){if(it.editStr===null)continue;const font=it.bold&&it.italic?fBoldItalic:it.bold?fBold:it.italic?fItalic:fNormal;const sz=it.sizeOvr||it.pdfFontSize;const c=hexToRgb(it.color||'#000000');pg.drawRectangle({x:it.pdfX-1,y:it.pdfY-sz*0.3,width:Math.max(it.pdfWidth,font.widthOfTextAtSize(it.editStr,sz))+4,height:sz*1.5,color:rgb(1,1,1)});pg.drawText(it.editStr,{x:it.pdfX,y:it.pdfY,size:sz,font,color:rgb(c.r,c.g,c.b)});}}dlPdf(await doc.save(),'edited.pdf');pdfed.value.done=true;}catch(e){pdfed.value.err='Save error: '+e.message;}};

  // ── WORD EDITOR ──
  const we=ref({html:null,file:null,loading:false,err:'',done:false,dirty:false});
  const weLoad=async file=>{if(!file)return;we.value.loading=true;we.value.err='';we.value.done=false;try{const buf=await file.arrayBuffer();const result=await mammoth.convertToHtml({arrayBuffer:buf});we.value.html=result.value;we.value.file=file;we.value.dirty=false;await Vue.nextTick();const el=document.getElementById('word-editor');if(el)el.innerHTML=result.value;}catch(e){we.value.err='Error: '+e.message;}we.value.loading=false;};
  const weNew=async()=>{we.value.html='';we.value.file=null;we.value.dirty=false;await Vue.nextTick();const el=document.getElementById('word-editor');if(el){el.innerHTML='<p>Start typing your document here…</p>';el.focus();}};
  const weExec=(cmd,val)=>{document.execCommand(cmd,false,val||null);document.getElementById('word-editor')?.focus();};
  const weExportDocx=()=>{const el=document.getElementById('word-editor');if(!el)return;const text=el.innerText||'';const enc=new TextEncoder();const docxml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${text.split('\n').map(l=>`<w:p><w:r><w:t xml:space="preserve">${escXml(l)}</w:t></w:r></w:p>`).join('')}</w:body></w:document>`;const relsxml=`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;const wRels=`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`;const ct=`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;const zipBytes=buildZip([{name:'[Content_Types].xml',data:enc.encode(ct)},{name:'_rels/.rels',data:enc.encode(relsxml)},{name:'word/document.xml',data:enc.encode(docxml)},{name:'word/_rels/document.xml.rels',data:enc.encode(wRels)}]);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([zipBytes],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}));a.download=(we.value.file?.name?.replace(/\.docx$/i,'')||'document')+'.docx';a.click();we.value.done=true;we.value.dirty=false;};
  const weExportPdf=async()=>{try{const el=document.getElementById('word-editor');if(!el)return;const text=el.innerText||'';const{PDFDocument,StandardFonts,rgb}=PDFLib;const doc=await PDFDocument.create();const font=await doc.embedFont(StandardFonts.Helvetica);const bold2=await doc.embedFont(StandardFonts.HelveticaBold);const pw2=595,ph=842,mg=60,lh=18,fs=12,maxW=pw2-mg*2;const wrap=txt=>{if(!txt.trim())return[''];const ws=txt.split(' ');const ls=[];let cur='';for(const w of ws){const t=cur?cur+' '+w:w;if(font.widthOfTextAtSize(t,fs)<=maxW)cur=t;else{if(cur)ls.push(cur);cur=w;}}if(cur)ls.push(cur);return ls;};let pg=doc.addPage([pw2,ph]);let y=ph-mg;for(const raw of text.split('\n')){const lines=wrap(raw);for(const line of lines){if(y<mg+lh){pg=doc.addPage([pw2,ph]);y=ph-mg;}if(line.trim())pg.drawText(line,{x:mg,y,size:fs,font,color:rgb(0.1,0.1,0.1)});y-=line.trim()?lh:10;}}dlPdf(await doc.save(),(we.value.file?.name?.replace(/\.docx$/i,'')||'document')+'.pdf');we.value.done=true;}catch(e){we.value.err='Error: '+e.message;}};

  // ── NEW PDF TOOLS ──
  const hexToRgb=hex=>{const r=parseInt(hex.slice(1,3),16)/255,g=parseInt(hex.slice(3,5),16)/255,b=parseInt(hex.slice(5,7),16)/255;return{r,g,b};};

  // PDF Watermark
  const wm=ref({file:null,text:'CONFIDENTIAL',opacity:0.25,size:48,angle:45,color:'#cccccc',loading:false,err:'',done:false});
  const wmLoad=file=>{if(!file||file.type!=='application/pdf')return;wm.value.file=file;wm.value.done=false;wm.value.err='';};
  const addWatermark=async()=>{wm.value.loading=true;wm.value.err='';wm.value.done=false;try{const{PDFDocument,StandardFonts,rgb,degrees}=PDFLib;const doc=await PDFDocument.load(await wm.value.file.arrayBuffer());const font=await doc.embedFont(StandardFonts.HelveticaBold);const c=hexToRgb(wm.value.color);for(const page of doc.getPages()){const{width,height}=page.getSize();const tw=font.widthOfTextAtSize(wm.value.text,wm.value.size);page.drawText(wm.value.text,{x:width/2-tw/2,y:height/2-wm.value.size/2,size:wm.value.size,font,color:rgb(c.r,c.g,c.b),opacity:wm.value.opacity,rotate:degrees(wm.value.angle)});}dlPdf(await doc.save(),'watermarked.pdf');wm.value.done=true;}catch(e){wm.value.err='Error: '+e.message;}wm.value.loading=false;};

  // PDF Page Numbers
  const pn=ref({file:null,position:'bottom-center',startNum:1,loading:false,err:'',done:false});
  const pnLoad=file=>{if(!file||file.type!=='application/pdf')return;pn.value.file=file;pn.value.done=false;pn.value.err='';};
  const addPageNums=async()=>{pn.value.loading=true;pn.value.err='';pn.value.done=false;try{const{PDFDocument,StandardFonts,rgb}=PDFLib;const doc=await PDFDocument.load(await pn.value.file.arrayBuffer());const font=await doc.embedFont(StandardFonts.Helvetica);const pages=doc.getPages(),total=pages.length,fs=10;pages.forEach((page,i)=>{const{width,height}=page.getSize();const num=pn.value.startNum+i;const text=num+' / '+(total+pn.value.startNum-1);const tw=font.widthOfTextAtSize(text,fs);let x,y;if(pn.value.position==='bottom-center'){x=(width-tw)/2;y=18;}else if(pn.value.position==='bottom-right'){x=width-tw-30;y=18;}else if(pn.value.position==='bottom-left'){x=30;y=18;}else{x=(width-tw)/2;y=height-28;}page.drawText(text,{x,y,size:fs,font,color:rgb(0.4,0.4,0.4)});});dlPdf(await doc.save(),'numbered.pdf');pn.value.done=true;}catch(e){pn.value.err='Error: '+e.message;}pn.value.loading=false;};

  // PDF Rotate Pages
  const prt=ref({file:null,angle:90,pages:'all',loading:false,err:'',done:false});
  const prtLoad=file=>{if(!file||file.type!=='application/pdf')return;prt.value.file=file;prt.value.done=false;prt.value.err='';};
  const rotatePdfPages=async()=>{prt.value.loading=true;prt.value.err='';prt.value.done=false;try{const{PDFDocument,degrees}=PDFLib;const doc=await PDFDocument.load(await prt.value.file.arrayBuffer());const pages=doc.getPages();let indices=[];if(prt.value.pages==='all'){indices=pages.map((_,i)=>i);}else{prt.value.pages.split(',').forEach(part=>{const m=part.trim().match(/^(\d+)-(\d+)$/);if(m){for(let j=+m[1]-1;j<=+m[2]-1;j++)if(j>=0&&j<pages.length)indices.push(j);}else{const n=+part.trim()-1;if(n>=0&&n<pages.length)indices.push(n);}});}indices.forEach(i=>{const cur=pages[i].getRotation().angle;pages[i].setRotation(degrees((cur+prt.value.angle)%360));});dlPdf(await doc.save(),'rotated.pdf');prt.value.done=true;}catch(e){prt.value.err='Error: '+e.message;}prt.value.loading=false;};

  // ── UNIT CONVERTER ──
  const unitConvs=[
    {id:'len', icon:'📏',label:'Length',     type:'factor',units:[{k:'mm',l:'mm',m:0.001},{k:'cm',l:'cm',m:0.01},{k:'m',l:'Meter',m:1},{k:'km',l:'km',m:1000},{k:'in',l:'Inch',m:0.0254},{k:'ft',l:'Foot',m:0.3048},{k:'mi',l:'Mile',m:1609.344}]},
    {id:'wt',  icon:'⚖️',label:'Weight',     type:'factor',units:[{k:'g',l:'Gram',m:0.001},{k:'kg',l:'kg',m:1},{k:'t',l:'Ton',m:1000},{k:'oz',l:'Ounce',m:0.0283495},{k:'lb',l:'Pound',m:0.453592}]},
    {id:'data',icon:'💾',label:'Data Size',  type:'factor',units:[{k:'KB',l:'KB',m:1024},{k:'MB',l:'MB',m:1048576},{k:'GB',l:'GB',m:1073741824},{k:'TB',l:'TB',m:1099511627776}]},
    {id:'temp',icon:'🌡️',label:'Temperature',type:'temp',  units:[{k:'C',l:'Celsius'},{k:'F',l:'Fahrenheit'},{k:'K',l:'Kelvin'}]},
  ];
  const uc=ref({len:{val:1,from:'m',to:'ft'},wt:{val:1,from:'kg',to:'lb'},data:{val:1,from:'GB',to:'MB'},temp:{val:100,from:'C',to:'F'}});
  const doConvert=(conv,st)=>{if(conv.type==='factor'){const f=conv.units.find(u=>u.k===st.from),t=conv.units.find(u=>u.k===st.to);return+(st.val*f.m/t.m).toFixed(6);}const v=st.val,f=st.from,to=st.to;let c=f==='C'?v:f==='F'?(v-32)*5/9:v-273.15;return+(to==='C'?c:to==='F'?c*9/5+32:c+273.15).toFixed(2);};

  // ── PDF TOOLS ──
  const pdf=ref({merge:{files:[],loading:false,err:'',done:false,over:false},img:{files:[],loading:false,err:'',done:false,over:false},split:{file:null,from:1,to:5,loading:false,err:'',done:false,over:false}});
  const addPdfs=(fl,k)=>{for(const f of fl)if(f.type==='application/pdf')pdf.value[k].files.push(f);};
  const addImgs=fl=>{for(const f of fl)if(f.type.startsWith('image/'))pdf.value.img.files.push(f);};
  const dlPdf=(bytes,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));a.download=name;a.click();};
  const mergePdfs=async()=>{const m=pdf.value.merge;m.loading=true;m.err='';m.done=false;try{const{PDFDocument}=PDFLib,mg=await PDFDocument.create();for(const f of m.files){const s=await PDFDocument.load(await f.arrayBuffer());(await mg.copyPages(s,s.getPageIndices())).forEach(p=>mg.addPage(p));}dlPdf(await mg.save(),'merged.pdf');m.done=true;}catch(e){m.err='Error: '+e.message;}m.loading=false;};
  const imgToPdf=async()=>{const im=pdf.value.img;im.loading=true;im.err='';im.done=false;try{const{PDFDocument}=PDFLib,doc=await PDFDocument.create();for(const f of im.files){const buf=await f.arrayBuffer(),ext=f.name.split('.').pop().toLowerCase(),img=ext==='png'?await doc.embedPng(buf):await doc.embedJpg(buf);doc.addPage([img.width,img.height]).drawImage(img,{x:0,y:0,width:img.width,height:img.height});}dlPdf(await doc.save(),'images.pdf');im.done=true;}catch(e){im.err='Error: '+e.message;}im.loading=false;};
  const splitPdf=async()=>{const s=pdf.value.split;s.loading=true;s.err='';s.done=false;try{const{PDFDocument}=PDFLib,src=await PDFDocument.load(await s.file.arrayBuffer()),total=src.getPageCount(),from=Math.max(1,s.from)-1,to=Math.min(s.to||total,total),out=await PDFDocument.create();(await out.copyPages(src,Array.from({length:to-from},(_,i)=>from+i))).forEach(p=>out.addPage(p));dlPdf(await out.save(),'split.pdf');s.done=true;}catch(e){s.err='Error: '+e.message;}s.loading=false;};
  const w2p=ref({file:null,over:false,loading:false,err:'',done:false,preview:''});
  const extractDocxText=async buf=>{const str=Array.from(new Uint8Array(buf),b=>String.fromCharCode(b)).join('');const paras=[...str.matchAll(/<w:p[ >][\s\S]*?<\/w:p>/g)];if(paras.length)return paras.map(m=>[...m[0].matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)].map(r=>r[1]).join('')).filter(l=>l.trim()).join('\n');const runs=[...str.matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g)];return runs.length?runs.map(m=>m[1]).join(' '):str.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim()||'[No text]';};
  const loadDocx=async file=>{if(!file)return;w2p.value.file=file;w2p.value.done=false;w2p.value.err='';w2p.value.preview='';try{const text=await extractDocxText(await file.arrayBuffer());w2p.value.preview=text.slice(0,400)+(text.length>400?'..':'');}catch(e){w2p.value.err='Error: '+e.message;}};
  const convertW2P=async()=>{w2p.value.loading=true;w2p.value.err='';w2p.value.done=false;try{const text=await extractDocxText(await w2p.value.file.arrayBuffer());const{PDFDocument,StandardFonts,rgb}=PDFLib;const doc=await PDFDocument.create();const font=await doc.embedFont(StandardFonts.Helvetica);const bold2=await doc.embedFont(StandardFonts.HelveticaBold);const pw2=595,ph=842,mg=50,lh=16,fs=11,maxW=pw2-mg*2;const wrap=txt=>{const ws=txt.split(' ');const ls=[];let cur='';for(const w of ws){const test=cur?cur+' '+w:w;if(font.widthOfTextAtSize(test,fs)<=maxW){cur=test;}else{if(cur)ls.push(cur);cur=w;}}if(cur)ls.push(cur);return ls.length?ls:[''];};const allLines=[];text.split('\n').forEach(l=>{if(!l.trim()){allLines.push({t:'',blank:true});return;}wrap(l).forEach(wl=>allLines.push({t:wl,blank:false}));});let pg=doc.addPage([pw2,ph]);pg.drawRectangle({x:0,y:ph-50,width:pw2,height:50,color:rgb(0.48,0.44,1)});pg.drawText(w2p.value.file.name.replace('.docx','').slice(0,50),{x:mg,y:ph-32,size:14,font:bold2,color:rgb(1,1,1)});let y=ph-70;for(const line of allLines){if(y<mg+lh){pg=doc.addPage([pw2,ph]);y=ph-mg;}if(!line.blank)pg.drawText(line.t,{x:mg,y,size:fs,font,color:rgb(0.1,0.1,0.1)});y-=line.blank?8:lh;}const bytes=await doc.save();const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));a.download=w2p.value.file.name.replace(/\.docx$/i,'')+'.pdf';a.click();w2p.value.done=true;}catch(e){w2p.value.err='Error: '+e.message;}w2p.value.loading=false;};
  const p2w=ref({file:null,over:false,loading:false,err:'',done:false,info:null});
  const loadPdfForWord=async file=>{if(!file||file.type!=='application/pdf')return;p2w.value.file=file;p2w.value.done=false;p2w.value.err='';const size=fmtB(file.size);try{const{PDFDocument}=PDFLib;const doc=await PDFDocument.load(await file.arrayBuffer());p2w.value.info={pages:doc.getPageCount(),size};}catch(e){p2w.value.err='Error: '+e.message;}};
  const escXml=s=>String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  const buildZip=files2=>{const enc=new TextEncoder();let offset=0;const parts=[],cd=[];const u32=n=>{const b=new Uint8Array(4);new DataView(b.buffer).setUint32(0,n,true);return b;};const u16=n=>{const b=new Uint8Array(2);new DataView(b.buffer).setUint16(0,n,true);return b;};const crc32=data=>{let c=0xFFFFFFFF;const t=[];for(let i=0;i<256;i++){let x=i;for(let j=0;j<8;j++)x=x&1?(0xEDB88320^(x>>>1)):(x>>>1);t[i]=x;}for(let i=0;i<data.length;i++)c=t[(c^data[i])&0xFF]^(c>>>8);return(c^0xFFFFFFFF)>>>0;};files2.forEach(({name,data})=>{const nb=enc.encode(name),crc=crc32(data);const lh2=new Uint8Array([0x50,0x4B,0x03,0x04,20,0,0,0,0,0,0,0,0,0,...u32(crc),...u32(data.length),...u32(data.length),...u16(nb.length),0,0,...nb]);cd.push({nb,crc,size:data.length,offset});parts.push(lh2,data);offset+=lh2.length+data.length;});const cdStart=offset;cd.forEach(({nb,crc,size,offset:off})=>{const r=new Uint8Array([0x50,0x4B,0x01,0x02,20,0,20,0,0,0,0,0,0,0,0,0,...u32(crc),...u32(size),...u32(size),...u16(nb.length),0,0,0,0,0,0,0,0,0,0,...u32(off),...nb]);parts.push(r);offset+=r.length;});const eocd=new Uint8Array([0x50,0x4B,0x05,0x06,0,0,0,0,...u16(cd.length),...u16(cd.length),...u32(offset-cdStart),...u32(cdStart),0,0]);parts.push(eocd);const total=parts.reduce((s,p)=>s+p.length,0);const out=new Uint8Array(total);let pos=0;parts.forEach(p=>{out.set(p,pos);pos+=p.length;});return out;};
  // ── RANK CALCULATOR ──
  const RANK_EXAMS={
    'SSC CGL':{totalQ:200,sections:[{name:'General Intelligence & Reasoning',q:25,m:2,n:0.5},{name:'General Awareness',q:25,m:2,n:0.5},{name:'Quantitative Aptitude',q:25,m:2,n:0.5},{name:'English Comprehension',q:25,m:2,n:0.5}],totalCandidates:3000000,avgScore:110,stdDev:28,cutoff:{UR:145,OBC:135,EWS:140,SC:122,ST:115},vacancies:7500},
    'SSC CHSL':{totalQ:100,sections:[{name:'General Intelligence',q:25,m:2,n:0.5},{name:'General Awareness',q:25,m:2,n:0.5},{name:'Quantitative Aptitude',q:25,m:2,n:0.5},{name:'English Language',q:25,m:2,n:0.5}],totalCandidates:2500000,avgScore:115,stdDev:25,cutoff:{UR:140,OBC:130,EWS:135,SC:115,ST:108},vacancies:4500},
    'SSC MTS':{totalQ:90,sections:[{name:'Numerical & Mathematical Ability',q:20,m:1,n:0},{name:'Reasoning & Problem Solving',q:20,m:1,n:0},{name:'General Awareness',q:25,m:1,n:0},{name:'English & Comprehension',q:25,m:1,n:0}],totalCandidates:4000000,avgScore:55,stdDev:15,cutoff:{UR:70,OBC:63,EWS:67,SC:55,ST:48},vacancies:12000},
    'IBPS PO':{totalQ:100,sections:[{name:'Reasoning Ability',q:35,m:1,n:0.25},{name:'English Language',q:30,m:1,n:0.25},{name:'Quantitative Aptitude',q:35,m:1,n:0.25}],totalCandidates:1500000,avgScore:40,stdDev:12,cutoff:{UR:47,OBC:43,EWS:45,SC:40,ST:37},vacancies:4000},
    'IBPS Clerk':{totalQ:100,sections:[{name:'Reasoning Ability',q:35,m:1,n:0.25},{name:'English Language',q:30,m:1,n:0.25},{name:'Numerical Ability',q:35,m:1,n:0.25}],totalCandidates:2000000,avgScore:43,stdDev:12,cutoff:{UR:50,OBC:46,EWS:48,SC:42,ST:38},vacancies:6000},
    'SBI PO':{totalQ:115,sections:[{name:'Reasoning & Computer Aptitude',q:45,m:1,n:0.25},{name:'Data Analysis & Interpretation',q:35,m:1,n:0.25},{name:'English Language',q:35,m:1,n:0.25}],totalCandidates:1200000,avgScore:45,stdDev:13,cutoff:{UR:52,OBC:48,EWS:50,SC:43,ST:40},vacancies:2000},
    'SBI Clerk':{totalQ:100,sections:[{name:'General/Financial Awareness',q:50,m:1,n:0.25},{name:'General English',q:40,m:1,n:0.25},{name:'Quantitative Aptitude',q:50,m:1,n:0.25},{name:'Reasoning Ability & Computer Aptitude',q:60,m:1,n:0.25}],totalCandidates:2500000,avgScore:55,stdDev:15,cutoff:{UR:65,OBC:60,EWS:63,SC:54,ST:49},vacancies:8000},
    'RRB NTPC':{totalQ:100,sections:[{name:'Mathematics',q:30,m:1,n:0.33},{name:'General Intelligence & Reasoning',q:30,m:1,n:0.33},{name:'General Awareness',q:40,m:1,n:0.33}],totalCandidates:10000000,avgScore:55,stdDev:18,cutoff:{UR:75,OBC:68,EWS:72,SC:62,ST:57},vacancies:35000},
    'RRB Group D':{totalQ:100,sections:[{name:'Mathematics',q:25,m:1,n:0.33},{name:'General Intelligence & Reasoning',q:30,m:1,n:0.33},{name:'General Science',q:25,m:1,n:0.33},{name:'General Awareness & Current Affairs',q:20,m:1,n:0.33}],totalCandidates:12000000,avgScore:50,stdDev:16,cutoff:{UR:70,OBC:63,EWS:67,SC:57,ST:52},vacancies:103769},
    'CTET':{totalQ:150,sections:[{name:'Child Development & Pedagogy',q:30,m:1,n:0},{name:'Language I',q:30,m:1,n:0},{name:'Language II',q:30,m:1,n:0},{name:'Mathematics',q:30,m:1,n:0},{name:'Environmental Studies',q:30,m:1,n:0}],totalCandidates:3000000,avgScore:90,stdDev:20,cutoff:{UR:90,OBC:82,EWS:82,SC:82,ST:82},vacancies:500000},
    'UPSC CAPF':{totalQ:125,sections:[{name:'General Ability & Intelligence',q:125,m:2,n:0.67}],totalCandidates:400000,avgScore:150,stdDev:40,cutoff:{UR:185,OBC:172,EWS:180,SC:155,ST:145},vacancies:322},
  };
  const rank=ref({exam:'SSC CGL',category:'UR',sections:[],res:null,mode:'count',akUrl:'',akText:'',userAns:'',akFetching:false,akMsg:'',showCmp:false});
  rank.value.sections=RANK_EXAMS['SSC CGL'].sections.map(s=>({...s,correct:0,wrong:0}));
  const rankSetExam=name=>{
    const ed=RANK_EXAMS[name];if(!ed)return;
    rank.value.exam=name;rank.value.sections=ed.sections.map(s=>({...s,correct:0,wrong:0}));rank.value.res=null;rank.value.akMsg='';
  };
  const parseAK=text=>{
    if(!text)return[];
    const ans=[null];
    // Try "1. A", "1-A", "1)A", "Q1:A" numbered patterns
    const numbered=[...text.matchAll(/(?:q(?:ues(?:tion)?)?\s*)?(\d+)\s*[.):\-]\s*([a-dA-D])\b/gi)];
    if(numbered.length>=5){numbered.forEach(m=>{ans[parseInt(m[1])]=m[2].toUpperCase();});return ans;}
    // Try "1 A" space-paired
    const paired=[...text.matchAll(/\b(\d+)\s+([A-D])\b/gi)];
    if(paired.length>=5){paired.forEach(m=>{ans[parseInt(m[1])]=m[2].toUpperCase();});return ans;}
    // Try plain "ABCDDCBA..."
    const plain=text.replace(/\s+/g,'').replace(/[^abcdABCD]/gi,'').toUpperCase();
    if(plain.length>=5){for(let i=0;i<plain.length;i++)ans[i+1]=plain[i];return ans;}
    // Try space-separated "A B C D..."
    const spaced=text.trim().split(/\s+/).filter(x=>/^[ABCD]$/i.test(x));
    if(spaced.length>=5){spaced.forEach((a,i)=>{ans[i+1]=a.toUpperCase();});return ans;}
    return ans;
  };
  const rankFetchAK=async()=>{
    if(!rank.value.akUrl.trim()){rank.value.akMsg='⚠ Enter a URL first';return;}
    rank.value.akFetching=true;rank.value.akMsg='';
    try{
      const res=await fetch('https://api.allorigins.win/raw?url='+encodeURIComponent(rank.value.akUrl.trim()));
      if(!res.ok)throw new Error('HTTP '+res.status);
      const html=await res.text();
      const stripped=html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<script[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
      rank.value.akText=stripped.slice(0,30000);
      const parsed=parseAK(rank.value.akText);
      const cnt=parsed.filter(Boolean).length;
      if(cnt<5)throw new Error('Auto-parse found only '+cnt+' answers. Please paste the answer key text manually below.');
      rank.value.akMsg='✓ Fetched & parsed '+cnt+' answers from URL';
    }catch(e){rank.value.akMsg='⚠ '+( e.message||'Fetch failed. Paste the answer key text manually.');}
    rank.value.akFetching=false;
  };
  const normalCDF=z=>{const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p2=0.3275911;const sign=z<0?-1:1;const az=Math.abs(z);const t=1/(1+p2*az);const y=1-((((a5*t+a4)*t+a3)*t+a2)*t+a1)*t*Math.exp(-az*az);return 0.5*(1+sign*y);};
  const calcRank=()=>{
    const ed=RANK_EXAMS[rank.value.exam];if(!ed)return;
    let comparison=null;
    if(rank.value.mode==='compare'){
      const ak=parseAK(rank.value.akText);const ua=parseAK(rank.value.userAns);
      const akCnt=ak.filter(Boolean).length,uaCnt=ua.filter(Boolean).length;
      if(akCnt<5){rank.value.akMsg='⚠ Answer key not parsed. Add URL or paste key below.';return;}
      if(uaCnt<5){rank.value.akMsg='⚠ Enter your answers in the "Your Answers" field.';return;}
      comparison=[];let qOff=1;
      rank.value.sections=rank.value.sections.map(sec=>{
        let correct=0,wrong=0;
        for(let q=qOff;q<qOff+sec.q;q++){
          const akA=ak[q]||null,uaA=ua[q]||null;
          let res2='skip';
          if(uaA){if(akA&&uaA===akA){correct++;res2='correct';}else if(akA){wrong++;res2='wrong';}else res2='undef';}
          comparison.push({q,ak:akA||'?',ua:uaA||'–',res:res2});
        }
        qOff+=sec.q;return{...sec,correct,wrong};
      });
    }
    let totalCorrect=0,totalWrong=0,totalScore=0;
    const secRes=rank.value.sections.map(s=>{
      const c=Math.max(0,s.correct||0),w=Math.max(0,s.wrong||0);
      const u=Math.max(0,s.q-c-w);const sc=+(c*s.m-w*s.n).toFixed(2);
      totalCorrect+=c;totalWrong+=w;totalScore+=sc;
      return{name:s.name,q:s.q,correct:c,wrong:w,unattempted:u,score:sc};
    });
    const totalQ=rank.value.sections.reduce((s,x)=>s+x.q,0);
    const totalUnattempted=totalQ-totalCorrect-totalWrong;
    const accuracy=totalCorrect+totalWrong>0?Math.round(totalCorrect/(totalCorrect+totalWrong)*100):0;
    totalScore=+totalScore.toFixed(2);
    const z=(totalScore-ed.avgScore)/ed.stdDev;
    const pctile=Math.min(99.9,Math.max(0.1,+(normalCDF(z)*100).toFixed(1)));
    const above=1-pctile/100;
    const rankMin=Math.max(1,Math.round(above*ed.totalCandidates*0.85));
    const rankMax=Math.max(rankMin+100,Math.round(above*ed.totalCandidates*1.15));
    const cat=rank.value.category;
    const userCutoff=ed.cutoff[cat]||ed.cutoff.UR;
    let selectionChance='Low';
    if(totalScore>=userCutoff*1.08)selectionChance='High';
    else if(totalScore>=userCutoff*0.93)selectionChance='Moderate';
    rank.value.res={score:totalScore,totalCorrect,totalWrong,totalUnattempted,totalQ,accuracy,secRes,pctile,rankMin,rankMax,cutoff:ed.cutoff,userCutoff,selectionChance,vacancies:ed.vacancies,comparison};
  };

  // ── PDF COMPRESSOR ──
  const pdfcomp=ref({file:null,over:false,loading:false,err:'',done:false,mode:'standard',quality:75,dpi:96,origSize:0,newSize:0,savings:0,progress:''});
  const pdfcompLoad=file=>{if(!file||file.type!=='application/pdf')return;pdfcomp.value.file=file;pdfcomp.value.origSize=file.size;pdfcomp.value.done=false;pdfcomp.value.err='';pdfcomp.value.progress='';};
  const compressPdf=async()=>{
    const s=pdfcomp.value;s.loading=true;s.err='';s.done=false;s.progress='Loading PDF…';
    try{
      const buf=await s.file.arrayBuffer();const{PDFDocument}=PDFLib;
      if(s.mode==='standard'){
        s.progress='Re-compressing…';
        const doc=await PDFDocument.load(buf,{ignoreEncryption:true});
        const out=await doc.save({useObjectStreams:true});
        s.newSize=out.byteLength;s.savings=Math.round((1-s.newSize/s.origSize)*100);
        dlPdf(out,'compressed_'+s.file.name);s.done=true;
      }else{
        pdfjsLib.GlobalWorkerOptions.workerSrc=PDFJS_WORKER;
        const src=await pdfjsLib.getDocument({data:new Uint8Array(buf)}).promise;
        const n=src.numPages;const scale=s.dpi/96;
        const newDoc=await PDFDocument.create();
        for(let i=1;i<=n;i++){
          s.progress=`Rendering page ${i} / ${n}…`;
          const pg=await src.getPage(i);const vp=pg.getViewport({scale});
          const cv=document.createElement('canvas');cv.width=vp.width;cv.height=vp.height;
          await pg.render({canvasContext:cv.getContext('2d'),viewport:vp}).promise;
          const b64=cv.toDataURL('image/jpeg',s.quality/100).split(',')[1];
          const imgBytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
          const img=await newDoc.embedJpg(imgBytes);
          newDoc.addPage([vp.width,vp.height]).drawImage(img,{x:0,y:0,width:vp.width,height:vp.height});
        }
        s.progress='Saving…';
        const out=await newDoc.save({useObjectStreams:true});
        s.newSize=out.byteLength;s.savings=Math.round((1-s.newSize/s.origSize)*100);
        dlPdf(out,'compressed_'+s.file.name);s.done=true;
      }
    }catch(e){s.err='Error: '+e.message;}
    s.loading=false;s.progress='';
  };

  // ── CA SUITE ──
  const ca=ref({
    tab:'tax',
    tax:{income:null,source:'salary',hra:0,c80:0,nps80:0,med80Self:0,med80Parent:0,seniorParent:false,don80g:0,hlInt:0,edu80e:0,tta:0,res:null},
    inv:{monthly:null,expenses:null,risk:'moderate',projYears:10,res:null},
    pl:{revenues:[{label:'Product Sales',amt:0},{label:'Service Income',amt:0}],cogs:0,expenses:[{label:'Rent',amt:0},{label:'Salaries',amt:0},{label:'Marketing',amt:0}],otherIncome:0,depreciation:0,res:null},
    nw:{cash:0,bank:0,stocks:0,mf:0,fd:0,ppf:0,property:0,gold:0,otherAsset:0,homeloan:0,carloan:0,personal:0,creditcard:0,otherLiab:0,res:null}
  });

  const calcCaTax=()=>{
    const t=ca.value.tax;
    const inc=t.income||0;
    const newStd=t.source==='salary'?75000:0;
    const newTI=Math.max(0,inc-newStd);
    const newSlabs=[[0,300000,0,'₹0–₹3L'],[300000,700000,5,'₹3L–₹7L'],[700000,1000000,10,'₹7L–₹10L'],[1000000,1200000,15,'₹10L–₹12L'],[1200000,1500000,20,'₹12L–₹15L'],[1500000,Infinity,30,'Above ₹15L']];
    const oldSlabs=[[0,250000,0,'₹0–₹2.5L'],[250000,500000,5,'₹2.5L–₹5L'],[500000,1000000,20,'₹5L–₹10L'],[1000000,Infinity,30,'Above ₹10L']];
    const calcSlabs=(ti,slabs)=>{let tax=0;const bd=[];for(const[from,to,rate,lbl]of slabs){if(ti<=from)break;const taxable=Math.min(ti,to===Infinity?ti:to)-from;const t2=Math.round(taxable*rate/100);bd.push({l:lbl+` (${rate}%)`,t:t2});tax+=t2;}return{tax,bd};};
    const applyRebateCess=(tax,ti,isNew)=>{const rebate=isNew?(ti<=700000?tax:0):Math.min(tax,ti<=500000?12500:0);const taxAfter=Math.max(0,tax-rebate);const sur=ti>5e7?Math.round(taxAfter*.37):ti>2e7?Math.round(taxAfter*.25):ti>1e7?Math.round(taxAfter*.15):ti>5e6?Math.round(taxAfter*.1):0;const cess=Math.round((taxAfter+sur)*.04);return{taxAfter,rebate,sur,cess,total:taxAfter+sur+cess};};
    const{tax:nRaw,bd:nBD}=calcSlabs(newTI,newSlabs);
    const{taxAfter:nTA,rebate:nReb,sur:nSur,cess:nCess,total:newTotal}=applyRebateCess(nRaw,newTI,true);
    const stdDed=t.source==='salary'?50000:0;
    const c80=Math.min(150000,t.c80||0);const nps80=Math.min(50000,t.nps80||0);
    const med80S=Math.min(25000,t.med80Self||0);const med80P=Math.min(t.seniorParent?50000:25000,t.med80Parent||0);
    const don=Math.round((t.don80g||0)*.5);const hl=Math.min(200000,t.hlInt||0);
    const edu=t.edu80e||0;const tta=Math.min(10000,t.tta||0);const hra=t.hra||0;
    const totalDeds=stdDed+hra+c80+nps80+med80S+med80P+don+hl+edu+tta;
    const oldTI=Math.max(0,inc-totalDeds);
    const{tax:oRaw,bd:oBD}=calcSlabs(oldTI,oldSlabs);
    const{taxAfter:oTA,rebate:oReb,sur:oSur,cess:oCess,total:oldTotal}=applyRebateCess(oRaw,oldTI,false);
    const better=newTotal<=oldTotal?'new':'old';
    const saving=Math.abs(oldTotal-newTotal);
    const deds=[{l:'Standard Deduction',v:stdDed},{l:'HRA Exemption',v:hra},{l:'80C – PPF/ELSS/LIC/FD',v:c80},{l:'80CCD(1B) – NPS',v:nps80},{l:'80D – Self + Family',v:med80S},{l:'80D – Parents',v:med80P},{l:'80G – Donations (50%)',v:don},{l:'24(b) – Home Loan Interest',v:hl},{l:'80E – Education Loan',v:edu},{l:'80TTA – Savings Interest',v:tta}].filter(d=>d.v>0);
    ca.value.tax.res={inc,new:{taxable:newTI,stdDed:newStd,rawTax:nRaw,rebate:nReb,sur:nSur,cess:nCess,total:newTotal,bd:nBD,inHand:Math.round((inc-newTotal)/12)},old:{taxable:oldTI,totalDeds,rawTax:oRaw,rebate:oReb,sur:oSur,cess:oCess,total:oldTotal,bd:oBD,deds,inHand:Math.round((inc-oldTotal)/12)},better,saving};
  };

  const sipFV=(p,rateAnnual,years)=>{if(!p||!rateAnnual||!years)return 0;const r=rateAnnual/100/12;const n=years*12;return Math.round(p*((Math.pow(1+r,n)-1)/r)*(1+r));};
  const caPortfolioFV=(years)=>{if(!ca.value.inv.res)return{corpus:0,invested:0,profit:0,pct:0,mult:0,blended:0};const alloc=ca.value.inv.res.alloc;const corpus=alloc.reduce((s,a)=>s+sipFV(a.amt,a.rate,years),0);const invested=(ca.value.inv.res.investable||0)*12*years;const profit=corpus-invested;const pct=invested?+((profit/invested)*100).toFixed(1):0;const mult=invested?+((corpus/invested).toFixed(2)):0;const blended=+(alloc.reduce((s,a)=>s+a.rate*a.pct,0)/100).toFixed(1);return{corpus,invested,profit,pct,mult,blended};};

  const calcCaInvest=()=>{
    const inv=ca.value.inv;
    const monthly=inv.monthly||0;const expenses=inv.expenses||0;
    const investable=Math.max(0,monthly-expenses);
    const emFund=expenses*6;
    const risk=inv.risk;
    const alloc=risk==='conservative'?[
      {name:'Liquid Fund / FD',pct:20,type:'safe',rate:5.5,desc:'Emergency corpus — Parag Parikh Liquid, HDFC Liquid Fund'},
      {name:'Debt Mutual Fund',pct:30,type:'debt',rate:7.5,desc:'ICICI Pru Short Term, Kotak Corporate Bond MF'},
      {name:'PPF',pct:20,type:'debt',rate:7.1,desc:'Guaranteed 7.1% p.a. tax-free — 80C benefit'},
      {name:'Large Cap Equity MF',pct:20,type:'equity',rate:12,desc:'Mirae Asset Large Cap, Axis Bluechip Fund'},
      {name:'Gold ETF / SGB',pct:10,type:'gold',rate:9,desc:'Nippon India Gold ETF, Sovereign Gold Bond'},
    ]:risk==='moderate'?[
      {name:'Liquid Fund (Emergency)',pct:10,type:'safe',rate:5.5,desc:'HDFC Liquid, Axis Liquid Fund'},
      {name:'PPF + NPS Tier-1',pct:20,type:'debt',rate:7.5,desc:'PPF 7.1% tax-free + NPS extra ₹50K deduction (80CCD 1B)'},
      {name:'Large Cap Equity MF',pct:20,type:'equity',rate:12,desc:'Mirae Asset Large Cap, Canara Robeco Bluechip'},
      {name:'Flexi / Multi Cap MF',pct:25,type:'equity',rate:13,desc:'Parag Parikh Flexi Cap, HDFC Flexi Cap Fund'},
      {name:'Mid Cap MF',pct:15,type:'equity',rate:15,desc:'Nippon India Mid Cap, Kotak Mid Cap Fund'},
      {name:'Gold ETF / SGB',pct:10,type:'gold',rate:9,desc:'SBI Gold ETF, Sovereign Gold Bond (2.5% p.a. + price gain)'},
    ]:[
      {name:'PPF + NPS Tier-1',pct:15,type:'debt',rate:7.5,desc:'NPS Tier-1 tax benefit u/s 80CCD(1B) + PPF 7.1%'},
      {name:'Large Cap / Index MF',pct:20,type:'equity',rate:12,desc:'UTI Nifty 50 Index, HDFC Nifty 50 Index Fund'},
      {name:'Flexi / Multi Cap MF',pct:20,type:'equity',rate:13,desc:'Parag Parikh Flexi Cap, Quant Flexi Cap Fund'},
      {name:'Mid Cap MF',pct:20,type:'equity',rate:15,desc:'Nippon India Mid Cap, SBI Mid Cap Fund'},
      {name:'Small Cap MF',pct:15,type:'equity',rate:17,desc:'Nippon India Small Cap, Quant Small Cap Fund'},
      {name:'Direct Equity',pct:5,type:'equity',rate:14,desc:'Quality bluechip stocks for long-term wealth creation'},
      {name:'Gold ETF / SGB',pct:5,type:'gold',rate:9,desc:'Hedge against inflation & currency risk'},
    ];
    const allocWithAmt=alloc.map(a=>({...a,amt:Math.round(investable*a.pct/100)}));
    const taxSaving=[
      {name:'PPF',limit:'₹1.5L (80C)',ret:'7.1% tax-free',lock:'15 yrs',note:'Best for conservative investors'},
      {name:'ELSS MF',limit:'₹1.5L (80C)',ret:'12–15% (market)',lock:'3 yrs',note:'Shortest lock-in under 80C'},
      {name:'NPS Tier-1',limit:'₹50K (80CCD 1B)',ret:'9–12%',lock:'Till 60',note:'Extra ₹50K beyond 80C limit'},
      {name:'Health Insurance',limit:'₹25K–50K (80D)',ret:'Protection',lock:'Annual',note:'₹50K if parents are senior citizens'},
      {name:'5yr Tax Saver FD',limit:'₹1.5L (80C)',ret:'6.5–7%',lock:'5 yrs',note:'Guaranteed returns, low risk'},
      {name:'Sukanya Samriddhi',limit:'₹1.5L (80C)',ret:'8.2% tax-free',lock:'21 yrs',note:'Only for girl child'},
      {name:'Home Loan Principal',limit:'₹1.5L (80C)',ret:'Asset creation',lock:'—',note:'Interest also u/s 24(b) max ₹2L'},
      {name:'SGB (Sovereign Gold Bond)',limit:'No cap',ret:'2.5% + gold gain',lock:'8 yrs',note:'Capital gains tax-free at maturity'},
    ];
    ca.value.inv.res={monthly,expenses,investable,emFund,alloc:allocWithAmt,taxSaving};
  };

  const calcCaPL=()=>{
    const pl=ca.value.pl;
    const rev=pl.revenues.reduce((s,r)=>s+(r.amt||0),0)+(pl.otherIncome||0);
    const cogs=pl.cogs||0;const gross=rev-cogs;
    const gm=rev?+((gross/rev)*100).toFixed(1):0;
    const opex=pl.expenses.reduce((s,e)=>s+(e.amt||0),0);
    const ebitda=gross-opex;const dep=pl.depreciation||0;const ebit=ebitda-dep;
    const nm=rev?+((ebit/rev)*100).toFixed(1):0;
    ca.value.pl.res={rev,cogs,gross,gm,opex,ebitda,dep,ebit,nm};
  };

  const calcCaNW=()=>{
    const nw=ca.value.nw;
    const aTotal=(nw.cash||0)+(nw.bank||0)+(nw.stocks||0)+(nw.mf||0)+(nw.fd||0)+(nw.ppf||0)+(nw.property||0)+(nw.gold||0)+(nw.otherAsset||0);
    const lTotal=(nw.homeloan||0)+(nw.carloan||0)+(nw.personal||0)+(nw.creditcard||0)+(nw.otherLiab||0);
    const netWorth=aTotal-lTotal;const dtr=aTotal?+((lTotal/aTotal)*100).toFixed(1):0;
    ca.value.nw.res={aTotal,lTotal,netWorth,dtr};
  };

  const convertP2W=async()=>{p2w.value.loading=true;p2w.value.err='';p2w.value.done=false;try{const srcBuf=await p2w.value.file.arrayBuffer();const raw=new TextDecoder('latin1').decode(new Uint8Array(srcBuf));const btBlocks=[...raw.matchAll(/BT[\s\S]*?ET/g)];let extracted='';btBlocks.forEach(b=>{[...b[0].matchAll(/\(([^)]*)\)\s*T[jJ]/g)].forEach(m=>extracted+=m[1].replace(/\\n/g,'\n').replace(/\\\(/g,'(').replace(/\\\)/g,')')+' ');[...b[0].matchAll(/\[([^\]]*)\]\s*TJ/g)].forEach(m=>[...m[1].matchAll(/\(([^)]*)\)/g)].forEach(p=>extracted+=p[1]+' '));extracted+='\n';});extracted=extracted.trim()||'[No readable text found]';const enc=new TextEncoder();const docxml=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${escXml(p2w.value.file.name)}</w:t></w:r></w:p>${extracted.split('\n').map(l=>`<w:p><w:r><w:t xml:space="preserve">${escXml(l.trim())}</w:t></w:r></w:p>`).join('')}</w:body></w:document>`;const relsxml=`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`;const wRels=`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"></Relationships>`;const ct=`<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`;const zipBytes=buildZip([{name:'[Content_Types].xml',data:enc.encode(ct)},{name:'_rels/.rels',data:enc.encode(relsxml)},{name:'word/document.xml',data:enc.encode(docxml)},{name:'word/_rels/document.xml.rels',data:enc.encode(wRels)}]);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([zipBytes],{type:'application/vnd.openxmlformats-officedocument.wordprocessingml.document'}));a.download=p2w.value.file.name.replace(/\.pdf$/i,'')+'.docx';a.click();p2w.value.done=true;}catch(e){p2w.value.err='Error: '+e.message;}p2w.value.loading=false;};

  // ── LANDING PAGE BUILDER (vanilla JS — see lc-templates.js + lc-builder.js) ──

  return{
    fmt,fmtS,fmtB,cp,dark,toggleTheme,
    page,search,activeCat,cats,filteredTools,visibleSections,goHome,open,toolUrl,pdfTitle,
    fmtDesc,fmtAt,templates,resumeTemplates,rv,downloadResume,
    bgt,bgtTotalIncome,bgtTotalExpense,bgtSavings,downloadBudget,
    prop,propTotal,downloadProposal,
    lh,downloadLetterhead,
    emi,calcEmi,hl,calcHl,sip,calcSip,ci,calcCi,fd,calcFd,
    tax,calcTax,sal,calcSal,gst,gstBase,gstAmt,gstTotal,
    inv,invSubtotal,invGst,invTotal,genInvoicePdf,
    disc,roi,grat,pf,pfMaturity,tds,tdsRate,tdsAmt,be,fl,
    sdStates,sd,sdCalc,rvb,calcRvb,
    cal,calcCal,bmi,bmiZones,calcBmi,age,calcAge,dd,ddRes,tip,cgpa,pc,
    wc,wcS,cc,caseModes,caseResult,copyCR,
    pw,genPw,pwStr,copyPw,qr,qrUrl,
    clr,clrRgb,clrHsl,grad,gradientCss,pal,palColors,
    jf,processJson,b64,processB64,ue,ueResult,hsh,hashResults,
    rx,rxMatches,rxErr,md,mdHtml,ic,loadImg,compressImg,
    ir,irLoad,irAspect,irProcess,
    icrop,cropLoad,cropPresets,applyCropPreset,cropProcess,
    ipixel,pixelLoad,pixelProcess,pixelDownload,
    ipassport,ppLoad,ppPreview,ppProcess,
    irotate,rotLoad,rotApply,rotDownload,
    iconvert,convLoad,convProcess,
    ocr,ocrLoad,runOcr,downloadOcrText,
    pdfed,pdfedModifiedCount,pdfedLoad,pdfedReset,pdfedChangePage,pdfedSelect,pdfedTextInput,pdfedApplyEdit,pdfedResetItem,pdfedToggleFmt,pdfedSetSize,pdfedSetColor,pdfedSave,
    we,weLoad,weNew,weExec,weExportDocx,weExportPdf,
    uc,unitConvs,doConvert,
    wm,wmLoad,addWatermark,
    pn,pnLoad,addPageNums,
    prt,prtLoad,rotatePdfPages,
    pdf,addPdfs,addImgs,mergePdfs,imgToPdf,splitPdf,
    w2p,loadDocx,convertW2P,p2w,loadPdfForWord,convertP2W,
    rank,rankSetExam,RANK_EXAMS,parseAK,rankFetchAK,calcRank,
    pdfcomp,pdfcompLoad,compressPdf,
    ca,calcCaTax,calcCaInvest,calcCaPL,calcCaNW,sipFV,caPortfolioFV,
  };
}});
// v-init-text: sets innerText once on mount; only resets if binding value actually changes
// Used for contenteditable divs so Vue's reactivity doesn't clobber user typing
_vapp.directive('init-text',{
  mounted(el,b){el.innerText=b.value;},
  updated(el,b){if(b.value!==b.oldValue)el.innerText=b.value;}
});
_vapp.mount('#app');
