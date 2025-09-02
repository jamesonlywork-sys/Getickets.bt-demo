
# Getickets.bt — LIVE Demo (Vercel Ready)

**Includes**
- Orange/white Booking.com‑style UI
- `events.json` → dynamic listings
- Booking → QR e‑ticket + `/success` (emails via Resend)
- `/checkin` → validate & mark used (localStorage demo)
- Contact + Newsletter serverless functions
- Vercel routing with `vercel.json`

**Deploy**
1) Push these files to a GitHub repo.  
2) On Vercel → New Project → Import from GitHub → Deploy.  
3) In Project Settings → Environment Variables, add:  
   - `RESEND_API_KEY` (from resend.com)  
   - `OWNER_EMAIL` (your inbox)  
4) Redeploy.

**Edit events**: change `events.json`.

**Note**: Demo only — no real payments, no central DB.
