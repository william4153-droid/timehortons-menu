const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const required = ["SUPABASE_SERVICE_ROLE_KEY","RESEND_API_KEY","NEWSLETTER_FROM"];
if (!supabaseUrl) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL (or SUPABASE_URL)");
for (const key of required) if (!process.env[key]) throw new Error(`Missing ${key}`);
const subject = process.argv[2]; const htmlFile = process.argv[3];
if (!subject || !htmlFile) throw new Error('Usage: npm run newsletter -- "Subject" ./newsletter.html');
const { readFile } = await import('node:fs/promises'); const html = await readFile(htmlFile,'utf8');
const subRes = await fetch(`${supabaseUrl}/rest/v1/subscribers?active=eq.true&select=email`,{headers:{apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`}});
if(!subRes.ok) throw new Error('Could not load subscribers');
const subscribers = await subRes.json();
for (const subscriber of subscribers) {
  const response = await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:process.env.NEWSLETTER_FROM,to:[subscriber.email],subject,html})});
  if(!response.ok) console.error('Failed:',subscriber.email,await response.text()); else console.log('Sent:',subscriber.email);
}
