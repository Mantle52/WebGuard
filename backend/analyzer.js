
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const urlModule = require('url');

const SAFE_HOSTS = ['localhost', '127.0.0.1'];


async function analyzeUrl(targetUrl) {
  const result = {
    url: targetUrl,
    ok: false,
    fetchError: null,
    headers: {},
    cookies: [],
    forms: [],
    issues: []
  };

  
  try {
    const parsed = urlModule.parse(targetUrl);
    if (!parsed.hostname || !SAFE_HOSTS.includes(parsed.hostname)) {
      result.fetchError = 'Only localhost/127.0.0.1 test pages are allowed in this demo';
      return result;
    }
  } catch (e) {
    result.fetchError = 'Invalid URL';
    return result;
  }

  try {
    const r = await fetch(targetUrl);
    result.ok = r.ok;
    
    const headers = {};
    r.headers.forEach((v, k) => { headers[k.toLowerCase()] = v; });
    result.headers = headers;

    
    if (!headers['strict-transport-security']) result.issues.push('Missing Strict-Transport-Security (HSTS)');
    if (!headers['content-security-policy']) result.issues.push('Missing Content-Security-Policy (CSP)');
    if (!headers['x-frame-options']) result.issues.push('Missing X-Frame-Options');
    if (!headers['x-content-type-options']) result.issues.push('Missing X-Content-Type-Options');

    
    const setCookie = r.headers.raw ? r.headers.raw()['set-cookie'] : null;
    if (setCookie && setCookie.length) {
      setCookie.forEach(sc => {
        result.cookies.push(sc);
        // naive checks
        if (!/HttpOnly/i.test(sc)) result.issues.push('Cookie missing HttpOnly attribute');
        if (!/Secure/i.test(sc)) result.issues.push('Cookie missing Secure attribute');
        if (!/SameSite/i.test(sc)) result.issues.push('Cookie missing SameSite attribute');
      });
    }

    const text = await r.text();
    const $ = cheerio.load(text);

    
    $('form').each((i, el) => {
      const form = $(el);
      const action = form.attr('action') || '';
      let hasCsrf = false;
      form.find('input').each((j, inp) => {
        const name = ($(inp).attr('name') || '').toLowerCase();
        if (name.includes('csrf') || name.includes('token')) hasCsrf = true;
      });
      result.forms.push({ action, hasCsrf });
      if (!hasCsrf) result.issues.push(`Form at action="${action}" has no CSRF token`);
    });

  } catch (err) {
    result.fetchError = String(err);
  }

  return result;
}

module.exports = { analyzeUrl };
