
// Getickets.bt LIVE demo logic
(function(){
  const KEY = 'getickets_tickets_v1';
  function load(){ try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch(_){ return []; } }
  function save(arr){ localStorage.setItem(KEY, JSON.stringify(arr)); }
  function genId(){ return 'GETK-' + Math.random().toString(36).slice(2,10).toUpperCase(); }
  function add(t){ const a = load(); a.push(t); save(a); }
  function get(id){ return load().find(t => t.id.toUpperCase() === (id||'').toUpperCase()); }
  function update(id, patch){ const a = load(); const i = a.findIndex(t => t.id.toUpperCase() === id.toUpperCase()); if(i>=0){ a[i] = Object.assign({}, a[i], patch); save(a); return a[i]; } return null; }
  function toast(msg){ const el = document.getElementById('toast'); if(!el) return; el.textContent = msg; el.style.display='block'; setTimeout(()=> el.style.display='none', 1600); }

  async function loadEvents(){
    try {
      const res = await fetch('/events.json'); const events = await res.json();
      const grid = document.getElementById('grid');
      if (grid){
        grid.innerHTML='';
        events.forEach(ev => {
          const card = document.createElement('article'); card.className='card';
          card.innerHTML = '<img src="'+ev.image+'" alt="'+ev.title+'"/>' +
            '<div class="pad"><h3>'+ev.title+'</h3>' +
            '<div class="meta">'+ev.city+' • '+(new Date(ev.date).toDateString())+'</div>' +
            '<div class="price">'+ev.price+'</div>' +
            '<div class="row"><button class="btn" onclick="location.href=\'/book?event='+encodeURIComponent(ev.title)+'\'">Book</button></div>' +
            '</div>';
          grid.appendChild(card);
        });
      }
      const sel = document.getElementById('event');
      if (sel){ sel.innerHTML=''; events.forEach(ev => { const o=document.createElement('option'); o.value=ev.title; o.textContent=ev.title; sel.appendChild(o); });
        const p = new URLSearchParams(location.search); const pre = p.get('event'); if (pre){ sel.value = pre; }
      }
    } catch(e){ console.error(e); }
  }

  window.gt = {
    search: function(){
      const q = (document.getElementById('q')?.value || '').toLowerCase();
      const c = (document.getElementById('c')?.value || '').toLowerCase();
      const d = document.getElementById('d')?.value || '';
      const cards = Array.from(document.querySelectorAll('#grid .card'));
      const dStr = d ? new Date(d).toDateString().toLowerCase() : '';
      cards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const meta = card.querySelector('.meta')?.textContent.toLowerCase() || '';
        const show = (!q || title.includes(q) || meta.includes(q)) &&
                     (!c || title.includes(c) || meta.includes(c)) &&
                     (!d || meta.includes(dStr));
        card.style.display = show ? '' : 'none';
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function(){
    loadEvents();

    const form = document.getElementById('bookingForm');
    if (form){
      form.addEventListener('submit', function(e){
        e.preventDefault();
        const eventName = document.getElementById('event').value;
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const qty = parseInt(document.getElementById('qty').value || '1', 10);
        const id = genId();
        add({ id, event:eventName, name, email, qty, used:false, createdAt:new Date().toISOString() });
        toast('Ticket created');
        const qs = new URLSearchParams({ id, event:eventName, name, qty:String(qty), email });
        location.href = '/success?' + qs.toString();
      });
    }

    const checkForm = document.getElementById('checkForm');
    const markBtn = document.getElementById('markUsed');
    if (checkForm){
      checkForm.addEventListener('submit', function(e){
        e.preventDefault();
        const id = document.getElementById('ticketId').value.trim();
        const t = get(id);
        const res = document.getElementById('result');
        res.style.display = 'block';
        document.getElementById('rId').textContent = id || '—';
        if (!t){
          document.getElementById('rEvent').textContent = '—';
          document.getElementById('rName').textContent = '—';
          document.getElementById('rQty').textContent = '—';
          document.getElementById('rStatus').innerHTML = '<span style="color:#b91c1c;font-weight:700">Invalid</span>';
          return;
        }
        document.getElementById('rEvent').textContent = t.event;
        document.getElementById('rName').textContent = t.name;
        document.getElementById('rQty').textContent = String(t.qty);
        document.getElementById('rStatus').innerHTML = t.used ? '<span style="color:#92400e;font-weight:700">Used</span>' : '<span style="color:#065f46;font-weight:700">Valid</span>';
      });

      if (markBtn){
        markBtn.addEventListener('click', function(){
          const id = document.getElementById('ticketId').value.trim();
          const t = get(id);
          if (!t){ alert('Ticket not found. Validate first.'); return; }
          update(id, { used:true, usedAt:new Date().toISOString() });
          alert('Ticket '+id+' marked as used.');
          document.getElementById('rStatus').innerHTML = '<span style="color:#92400e;font-weight:700">Used</span>';
        });
      }
    }
  });
})();
