
// /api/email-ticket — send ticket email via Resend
export default async function handler(req, res){
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });
    const { id, event, name, email, qty } = req.body || {};
    if (!id || !event || !email) return res.status(400).json({ ok:false, error:'Missing fields' });
    const apiKey = process.env.RESEND_API_KEY;
    const toOwner = process.env.OWNER_EMAIL;
    if (!apiKey) return res.status(200).json({ ok:true, info:'RESEND_API_KEY not set; skipping email (demo).' });
    const payload = {
      from:'tickets@getickets.bt',
      to:[email],
      subject:`Your Getickets.bt ticket (${id})`,
      html:`<h2>🎟️ Getickets.bt</h2>
            <p>Thanks ${name||''}!</p>
            <p><b>Event:</b> ${event}<br/><b>Ticket ID:</b> ${id}<br/><b>Qty:</b> ${qty||1}</p>
            <p>Check-in: https://YOUR_DOMAIN/checkin</p>`
    };
    const r = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${apiKey}`, 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    if (toOwner){
      try{
        await fetch('https://api.resend.com/emails', {
          method:'POST',
          headers:{ 'Authorization':`Bearer ${apiKey}`, 'Content-Type':'application/json' },
          body: JSON.stringify({ from:'tickets@getickets.bt', to:[toOwner], subject:`New ticket: ${id}`, html:`<p>${name} booked ${qty||1} for ${event}. Email: ${email}</p>` })
        });
      }catch(_){}
    }
    return res.status(200).json({ ok:true, data });
  } catch (e) {
    return res.status(500).json({ ok:false, error: e?.message || 'Unknown error' });
  }
}
