async function loadConfig(){
  // Works even when opening index.html directly (file://)
  if(window.SITE_CONFIG) return window.SITE_CONFIG;

  // Fallback when served via http://
  const res = await fetch('./config.json', {cache:'no-store'});
  if(!res.ok) throw new Error('config.json not found');
  return await res.json();
}
function waLink(number, text){
  const msg = encodeURIComponent(text || 'Hallo!');
  // number must be digits only for wa.me
  const digits = (number || '').replace(/\D/g,'');
  return digits ? `https://wa.me/${digits}?text=${msg}` : '#';
}
function setText(id, value){
  const el = document.getElementById(id);
  if(el) el.textContent = value ?? '';
}
function setHref(id, href){
  const el = document.getElementById(id);
  if(el && href) el.setAttribute('href', href);
}
function renderHours(list){
  const root = document.getElementById('hoursList');
  root.innerHTML = '';
  (list || []).forEach(item => {
    const row = document.createElement('div');
    row.className = 'hour';
    row.innerHTML = `<div class="hour__day">${item.day}</div><div class="hour__time">${item.hours}</div>`;
    root.appendChild(row);
  });
}
function renderHighlights(list){
  const root = document.getElementById('highlightGrid');
  root.innerHTML = '';
  (list || []).forEach(h => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `<div class="card__title">${h.title}</div><div class="card__text">${h.text}</div><div class="card__bar"></div>`;
    root.appendChild(div);
  });
}
function renderStats(list){
  const root = document.getElementById('statsGrid');
  root.innerHTML = '';
  (list || []).forEach(s => {
    const div = document.createElement('div');
    div.className = 'stat';
    div.innerHTML = `<div class="stat__k">${s.label}</div><div class="stat__v">${s.value}</div>`;
    root.appendChild(div);
  });
}
function renderPrices(sections){
  const root = document.getElementById('priceGrid');
  root.innerHTML = '';
  (sections || []).forEach(sec => {
    const box = document.createElement('div');
    box.className = 'pricebox';
    box.innerHTML = `<div class="pricebox__title">${sec.title}</div>`;

    if(sec.type === 'table'){
      const cols = Array.isArray(sec.columns) ? sec.columns.filter(Boolean) : [];
      const wrap = document.createElement('div');
      wrap.className = 'tablewrap';
      const table = document.createElement('table');
      table.className = 'table';

      // Header
      const thead = document.createElement('thead');
      const ths = ['Leistung', ...cols].map(h => `<th>${h}</th>`).join('');
      thead.innerHTML = `<tr>${ths}</tr>`;
      table.appendChild(thead);

      // Body
      const tbody = document.createElement('tbody');
      (sec.items || []).forEach(it => {
        const tr = document.createElement('tr');
        const tds = [`<td>${it.name}</td>`];

        // Support up to 6 columns if ever needed
        const vals = [it.c1, it.c2, it.c3, it.c4, it.c5, it.c6];
        for(let i=0;i<cols.length;i++){
          tds.push(`<td>${vals[i] || ''}</td>`);
        }
        tr.innerHTML = tds.join('');
        tbody.appendChild(tr);
      });

      table.appendChild(tbody);
      wrap.appendChild(table);
      box.appendChild(wrap);
    } else {
      const list = document.createElement('div');
      list.className = 'pricelist';
      (sec.items || []).forEach(it => {
        const row = document.createElement('div');
        row.className = 'priceitem';
        row.innerHTML = `<div class="priceitem__name">${it.name}</div><div class="priceitem__price">${it.price || ''}</div>`;
        if(it.note){
          const note = document.createElement('div');
          note.className = 'priceitem__note';
          note.textContent = it.note;
          row.appendChild(note);
        }
        list.appendChild(row);
      });
      box.appendChild(list);
    }
    root.appendChild(box);
  });
}

function initials(name){
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] || '';
  const b = parts.length>1 ? parts[1][0] : (parts[0]?.[1] || '');
  return (a + b).toUpperCase();
}
function renderTeam(team){
  const root = document.getElementById('teamGrid');
  root.innerHTML = '';
  (team?.members || []).forEach(m => {
    const div = document.createElement('div');
    div.className = 'person';
    div.innerHTML = `
      <div class="person__avatar">${initials(m.name)}</div>
      <div class="person__name">${m.name}</div>
      <div class="person__role">${m.role || ''}</div>
    `;
    root.appendChild(div);
  });
}

function renderGallery(gallery){
  const root = document.getElementById('galleryGrid');
  if(!root) return;
  root.innerHTML = '';
  const imgs = gallery?.images || [];
  imgs.forEach(p => {
    const div = document.createElement('div');
    div.className = 'gimg';
    const img = document.createElement('img');
    img.src = p.src;
    img.alt = p.alt || '';
    div.appendChild(img);
    root.appendChild(div);
  });
}

function renderReviews(reviews){
  const root = document.getElementById('reviewsGrid');
  root.innerHTML = '';
  (reviews?.items || []).forEach(r => {
    const div = document.createElement('div');
    div.className = 'review';
    div.innerHTML = `
      <div class="review__head">
        <div class="review__name">${r.name}</div>
        <div class="review__date">${r.date}</div>
      </div>
      <div class="review__text">${r.text}</div>
    `;
    root.appendChild(div);
  });
}
function renderImpressum(legal){
  const root = document.getElementById('impressumBox');
  const hint = document.getElementById('legalHint');
  if(!root) return;
  const i = legal?.impressum || {};
  root.innerHTML = `
    <div><strong>${i.business || ''}</strong></div>
    <div>Inhaber: ${i.owner || ''}</div>
    <div>${i.address || ''}</div>
    <div>Telefon: ${i.phone || ''}</div>
    <div>E-Mail: ${i.email || ''}</div>
    ${i.vat ? `<div>USt-IdNr.: ${i.vat}</div>` : ''}
  `;
  if(hint) hint.textContent = legal?.disclaimer || '';
}

(async function init(){
  try{
    const c = await loadConfig();

    // Brand
    document.title = c.brand?.name || document.title;
    setText('brandName', c.brand?.name);
    setText('footerName', c.brand?.name);
    setText('brandTagline', c.brand?.tagline);

    const logoImg = document.getElementById('logoImg');
    if(logoImg && c.brand?.logoPath) logoImg.src = c.brand.logoPath;

    // Hero
    setText('heroHeadline', c.hero?.headline);
    setText('heroTitle', c.hero?.title);
    setText('heroSubtitle', c.hero?.subtitle);
    setText('heroMicro', c.ctaNote || '');

    // Contact
    setText('addrChip', c.contact?.address);
    setText('addrFull', c.contact?.address);
    setText('phoneChip', c.contact?.phone);
    setText('phoneFull', c.contact?.phone);
    setText('emailFull', c.contact?.email);

    setHref('phoneChip', `tel:${c.contact?.phone || ''}`);
    setHref('phoneFull', `tel:${c.contact?.phone || ''}`);
    setHref('emailFull', `mailto:${c.contact?.email || ''}`);

    // Buttons
    setHref('callBtn', `tel:${c.contact?.phone || ''}`);
    setText('calloutPhone', c.contact?.phone);
    setHref('calloutPhone', `tel:${c.contact?.phone || ''}`);

    setHref('callBtnPanel', `tel:${c.contact?.phone || ''}`);

    const wa = waLink(c.whatsapp?.number, c.whatsapp?.message);
    setHref('waBtnTop', wa);
    setHref('waBtnHero', wa);
    setHref('waBtnPanel', wa);
    setHref('waBtnBottom', wa);
    setHref('waFloat', wa);

    setHref('mapsBtnHero', c.contact?.mapsLink);
    setHref('mapsBtnBottom', c.contact?.mapsLink);

    // Hours
    renderHours(c.hours);
    setText('hoursChip', (c.stats?.find(s => s.label.toLowerCase().includes('öff'))?.value) || 'Mo–Sa 09–19');

    // Sections
    renderHighlights(c.highlights);
    renderStats(c.stats);
    renderPrices(c.prices);

    setText('teamTitle', c.team?.title || 'Team');
    renderTeam(c.team);

    if(c.gallery){
    setText('galleryTitle', c.gallery.title);
    setText('gallerySubtitle', c.gallery.subtitle);
    renderGallery(c.gallery);
    }

    setText('reviewsTitle', c.reviews?.title || 'Kundenstimmen');
    renderReviews(c.reviews);

    // Map
    const map = document.getElementById('mapFrame');
    if(map && c.contact?.mapEmbedUrl) map.src = c.contact.mapEmbedUrl;

    // Legal
    renderImpressum(c.legal);

    setText('year', new Date().getFullYear());
  }catch(e){
    console.error(e);
    alert('Fehler: config.json fehlt oder ist ungültig.');
  }
})();
