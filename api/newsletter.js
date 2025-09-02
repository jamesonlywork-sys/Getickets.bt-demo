
// /api/newsletter — record signup (optionally email owner)
export default async function handler(req, res){
  try{
    if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ ok:false, error:'Missing email' });
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.OWNER_EMAIL;
    if (apiKey && to){
      try{
        await fetch('https://api.resend.com/emails', {
          method:'POST',
          headers:{ 'Authorization':`Bearer ${apiKey}`, 'Content-Type':'application/json' },
          body: JSON.stringify({ from:'news@getickets.bt', to:[to], subject:'New newsletter signup', html:`<p>${email} subscribed.</p>` })
        });
      }catch(_){}
    }
    return res.status(200).json({ ok:true });
  } catch(e){
    return res.status(500).json({ ok:false, error:e?.message || 'Unknown error' });
  }
}
