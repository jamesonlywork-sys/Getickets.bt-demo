
// /api/contact — send contact form to OWNER_EMAIL via Resend
export default async function handler(req, res){
  try{
    if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ ok:false, error:'Missing fields' });
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.OWNER_EMAIL;
    if (!apiKey || !to) return res.status(200).json({ ok:true, info:'Email disabled (missing RESEND_API_KEY or OWNER_EMAIL).'});
    const payload = { from:'site@getickets.bt', to:[to], subject:`Contact: ${name}`, html:`<p>From: ${name} &lt;${email}&gt;</p><p>${message}</p>` };
    const r = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{ 'Authorization':`Bearer ${apiKey}`, 'Content-Type':'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    return res.status(200).json({ ok:true, data });
  } catch(e){
    return res.status(500).json({ ok:false, error:e?.message || 'Unknown error' });
  }
}
