// Renders public/og.png (1200x630) from local HTML. No network, hex colours only.
import { chromium } from '@playwright/test';

const html = `<!doctype html><html><body style="margin:0;width:1200px;height:630px;background:#070b10;color:#e6eaee;font-family:Consolas,monospace;display:flex;align-items:center">
<div style="margin:0 80px;border:2px solid #2b8f86;background:#0d131a;width:100%">
<div style="padding:16px 24px;border-bottom:1px solid #1d2731;color:#7d8a97;font-size:22px">gen0ne@zrh:~</div>
<div style="padding:40px 48px 48px">
<div style="font-size:30px"><span style="color:#4fe3d1">$</span> whoami</div>
<div style="font-size:56px;font-weight:700;margin:14px 0"><span style="color:#4fe3d1">&gt;</span> Nicolás Damián Sadofschi</div>
<div style="font-size:30px;color:#9aa6b2"><span style="color:#4fe3d1">&gt;</span> Senior Firewall Engineer · Zurich</div>
<div style="font-size:30px;color:#9aa6b2;margin-top:8px"><span style="color:#4fe3d1">&gt;</span> OSCP+ · network security · things I build</div>
<div style="font-size:26px;color:#4fe3d1;margin-top:36px">nicodamian.com</div>
</div></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.screenshot({ path: 'public/og.png' });
await browser.close();
console.log('public/og.png written');
