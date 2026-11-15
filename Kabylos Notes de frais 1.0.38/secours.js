/* Kabylos Notes de frais : lecture de secours sur le téléphone (sans IA, gratuite), utilisée quand Claude ne répond pas */
(function () {
  const TESS = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
  let charge = null, worker = null;
  const script = src => new Promise((ok, ko) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => ko(new Error("chargement du lecteur de secours impossible")); document.head.appendChild(s); });
  async function moteur() {
    if (worker) return worker;
    if (!charge) charge = script(TESS);
    await charge;
    worker = await Tesseract.createWorker("fra");
    await worker.setParameters({ tessedit_pageseg_mode: "6", preserve_interword_spaces: "1" });
    return worker;
  }
  async function preparer(blob) { // agrandit les petites photos, en niveaux de gris
    const bmp = await createImageBitmap(blob); const f = bmp.width < 1400 ? Math.min(2.5, 1600 / bmp.width) : 1;
    const c = document.createElement("canvas"); c.width = Math.round(bmp.width * f); c.height = Math.round(bmp.height * f);
    const x = c.getContext("2d"); x.filter = "grayscale(1) contrast(1.3)"; x.drawImage(bmp, 0, 0, c.width, c.height); return c;
  }
  const r2 = v => Math.round(v * 100) / 100;
  const montants = s => (String(s).replace(/(\d)\s+(\d{3}[.,]\d{2})/g, "$1$2").match(/-?\d{1,6}[.,]\d{2}(?![\d%])/g) || []).map(x => +x.replace(",", "."));
  const TAUX = [20, 10, 5.5, 2.1];
  function analyser(texte) {
    const L = texte.split(/\n/).map(s => s.replace(/\s+/g, " ").trim()).filter(Boolean);
    const R = { type: /factur/i.test(texte) ? "facture" : /\bavoir\b/i.test(texte) && /montant\s+de\s+l.?avoir|avoir\s+n/i.test(texte) ? "avoir" : "ticket", nature: /factur/i.test(texte) ? "facture" : "ticket_caisse", fournisseur: null, date: null, numero: null, siret: null, tva_intra: null, ht: null, tva: null, ttc: null, lignes_tva: [], doutes: ["Lecture de secours (sans Claude) : vérifiez les montants"], secours: true };
    // fournisseur : première ligne avec au moins 3 lettres et peu de chiffres
    for (const l of L.slice(0, 6)) { const lettres = (l.match(/[A-Za-zÀ-ÿ]/g) || []).length, chiffres = (l.match(/\d/g) || []).length; if (lettres >= 3 && chiffres <= 2 && !/ticket|facture|bienvenue|merci|tel|t[ée]l[ée]phone|article|total|carte|caisse|r[èe]glement|taxe|montant/i.test(l)) { R.fournisseur = l.replace(/[^\wÀ-ÿ&' .-]/g, "").trim().slice(0, 40); break; } }
    // date
    for (const l of L) { const m = l.match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4}|\d{2})\b/); if (m) { let [, j, mo, a] = m; if (a.length === 2) a = "20" + a; if (+mo >= 1 && +mo <= 12 && +j >= 1 && +j <= 31 && +a >= 2015 && +a <= 2040) { R.date = `${a}-${String(mo).padStart(2, "0")}-${String(j).padStart(2, "0")}`; break; } } }
    if (!R.date) { const MO = { janv: 1, jan: 1, fevr: 2, fev: 2, "févr": 2, "fév": 2, mars: 3, avr: 4, mai: 5, juin: 6, juil: 7, aout: 8, "août": 8, sept: 9, sep: 9, oct: 10, nov: 11, dec: 12, "déc": 12 };
      for (const l of L) { const d = l.toLowerCase().match(/\b(\d{1,2})\s*(janv|jan|f[ée]vr?|mars|avr|mai|juin|juil|ao[uû]t|sept?|oct|nov|d[ée]c)[a-zéû]*\.?\s*(20\d\d)\b/); if (d) { const mo = MO[d[2]] || MO[d[2].normalize("NFD").replace(/[\u0300-\u036f]/g, "")]; if (mo) { R.date = `${d[3]}-${String(mo).padStart(2, "0")}-${String(d[1]).padStart(2, "0")}`; break; } } } }
    // SIRET / SIREN, TVA intracom
    const plat = texte.replace(/[ .]/g, "");
    let m = plat.match(/siret:?(\d{14})/i) || plat.match(/(?<!\d)(\d{14})(?!\d)/); if (m) R.siret = m[1]; else { m = plat.match(/(?:siren|rcs[a-z]*):?(\d{9})(?!\d)/i); if (m) R.siret = m[1]; }
    m = texte.replace(/\s/g, "").match(/FR[0-9A-Z]{2}\d{9}/i); if (m) R.tva_intra = m[0].toUpperCase();
    // numéro
    for (const l of L) { const n = l.match(/(?:facture|ticket|n°|n[o°º]\.?|num[ée]ro)\s*[:#]?\s*([A-Z0-9][A-Z0-9\/-]{2,})/i); if (n && /\d/.test(n[1])) { R.numero = n[1].slice(0, 30); break; } }
    // lignes de TVA : taux en %, puis montant TVA et base HT
    for (const l of L) { if (!/t\.?v\.?a|taxe/i.test(l) || /intra|n°\s*tva/i.test(l)) continue;
      const tx = (l.match(/(\d{1,2}(?:[.,]\d{1,2})?)\s*%/g) || []).map(x => +x.replace("%", "").replace(",", ".")).find(t => TAUX.includes(t));
      const vals = montants(l.replace(/\d{1,2}(?:[.,]\d{1,2})?\s*%/g, " ")); if (!tx || vals.length < 1) continue;
      let ht = null, tva = null;
      for (let i = 0; i < vals.length; i++) for (let k = 0; k < vals.length; k++) if (i !== k && Math.abs(vals[k] * tx / 100 - vals[i]) <= 0.03) { tva = vals[i]; ht = vals[k]; }
      if (tva === null) for (let i = 0; i < vals.length; i++) for (let k = 0; k < vals.length; k++) if (i !== k && Math.abs(vals[k] * tx / (100 + tx) - vals[i]) <= 0.03) { tva = vals[i]; ht = r2(vals[k] - vals[i]); }
      if (tva === null && vals.length === 1) tva = vals[0];
      if (tva !== null && !R.lignes_tva.some(x => x.taux === tx && x.tva === tva)) R.lignes_tva.push({ taux: tx, ht, tva }); }
    if (R.lignes_tva.length) { R.tva = r2(R.lignes_tva.reduce((s, x) => s + (x.tva || 0), 0)); R.ht = r2(R.lignes_tva.reduce((s, x) => s + (x.ht || 0), 0)); }
    if (R.lignes_tva.length && R.lignes_tva.some(x => x.ht === null)) R.ht = null;
    if (R.ht === null) for (const l of L) if (/total\s*h\.?\s*t|base\s*h\.?\s*t|montant\s*h\.?\s*t|sous.?total/i.test(l) && !/tva\s*\d/i.test(l)) { const v = montants(l); if (v.length) { R.ht = v[v.length - 1]; break; } }
    // total payé
    const exclu = /tva|taxe|h\.?t\b|hors|sous.?total|point|cumul|fid[ée]lit|rendu|remise|[ée]conomi/i;
    const fort = [], faible = [];
    for (const l of L) { if (exclu.test(l)) continue; const v = montants(l); if (!v.length) continue;
      if (/total\s*(ttc|[àa]\s*payer|net)|net\s*[àa]\s*payer|montant\s*(ttc|d[uû]|r[ée]gl)|\*{3,}|[*+x]{3,}\s*\d|\d\s*€?\s*[*+x]{3,}/i.test(l)) fort.push(Math.max(...v));
      else if (/total|carte|cb\b|visa|mastercard|esp[eè]ces|pay[ée]|r[ée]glement|euro/i.test(l)) faible.push(Math.max(...v)); }
    const euros = []; for (const l of L) { if (exclu.test(l)) continue; for (const x of l.matchAll(/(\d{1,6}[.,]\d{2})\s*(?:€|eur)/gi)) euros.push(+x[1].replace(",", ".")); }
    R.ttc = fort.length ? Math.max(...fort) : faible.length ? Math.max(...faible) : euros.length ? Math.max(...euros) : null;
    if (R.ttc !== null && R.tva !== null && (R.ht === null || Math.abs(R.ht + R.tva - R.ttc) > 0.03)) { if (R.ht !== null && Math.abs(R.ht + R.tva - R.ttc) > 0.03) R.doutes.push("HT + TVA ne tombe pas juste sur le TTC"); else R.ht = r2(R.ttc - R.tva); }
    if (R.ttc === null && R.ht !== null && R.tva !== null) R.ttc = r2(R.ht + R.tva);
    if (!R.lignes_tva.length) R.lignes_tva = null;
    return R;
  }
  window.KCSecours = {
    analyser,
    async lire(blobs) { const w = await moteur(); let texte = "";
      for (const b of blobs.slice(0, 3)) { if (!b || (b.type || "").includes("pdf")) continue; const c = await preparer(b); const { data } = await w.recognize(c); texte += data.text + "\n"; }
      if (!texte.trim()) throw new Error("rien de lisible"); const R = analyser(texte); R.texte = texte.slice(0, 4000); return R; }
  };
})();
