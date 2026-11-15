/* Kabylos Notes de frais — © 2026 Kamel Aknouche */
"use strict";
const C = window.KCM;
const $ = s => document.querySelector(s);
const nf = n => (Math.round((+n || 0) * 100) / 100).toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const eur = n => nf(n) + " €";
const num = v => { if (v === null || v === undefined || v === "") return null; if (typeof v === "number") return isNaN(v) ? null : Math.round(v * 100) / 100; const x = parseFloat(String(v).replace(/\s|€/g, "").replace(",", ".")); return isNaN(x) ? null : Math.round(x * 100) / 100; };
const r2 = n => Math.round((+n || 0) * 100) / 100;
const fd = d => d && String(d).length >= 10 ? `${String(d).slice(8, 10)}/${String(d).slice(5, 7)}/${String(d).slice(0, 4)}` : "";
const today = () => { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const normTxt = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); }));
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } };
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } };
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const moisLib = m => m === "tout" ? "tous les mois" : `${MOIS[+m.slice(5, 7) - 1]} ${m.slice(0, 4)}`;
const moisDecal = (m, k) => { if (m === "tout") m = new Date().toISOString().slice(0, 7); const d = new Date(+m.slice(0, 4), +m.slice(5, 7) - 1 + k, 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; };
function toast(m, ms = 2800) { const t = document.createElement("div"); t.className = "toast"; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), ms); }
const ICO = {
  scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M7 12h10"/></svg>',
  liste: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  avance: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9.5v5M18 9.5v5"/></svg>',
  admin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5 4 5.5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10v-6z"/><path d="m8.5 12 2.4 2.4 4.6-4.8"/></svg>',
  photo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5A2.5 2.5 0 0 1 5.5 6h1.8l1.4-2h6.6l1.4 2h1.8A2.5 2.5 0 0 1 21 8.5v9A2.5 2.5 0 0 1 18.5 20h-13A2.5 2.5 0 0 1 3 17.5z"/><circle cx="12" cy="13" r="3.8"/></svg>',
  galerie: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m21 16-5-5-9 9"/></svg>',
  km: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M6.5 17l1.6-5.2A2 2 0 0 1 10 10.4h4a2 2 0 0 1 1.9 1.4L17.5 17"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/><path d="M4 21h16"/></svg>',
  gauche: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>',
  droite: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>',
};
const STATUTS = { brouillon: ["mute", "Pas encore envoyée"], soumis: ["info", "En attente de validation"], valide: ["ok", "Validée"], refuse: ["bad", "Refusée"], importe: ["ok", "En comptabilité"], local: ["mute", "Sur le téléphone"] };

/* =================== 0. Connexion à la base =================== */
/* lien « mot de passe oublié » : repéré avant que Supabase ne lise l'adresse */
const RECUP = /type=recovery/.test(location.hash + location.search);
const ERR_LIEN = (() => { try { const h = new URLSearchParams(location.hash.slice(1) + "&" + location.search.slice(1)); return h.get("error_description") || ""; } catch (e) { return ""; } })();
const sb = supabase.createClient(C.SUPABASE_URL, C.SUPABASE_CLE, { auth: { persistSession: true, autoRefreshToken: true, storageKey: "kcm-session" } });
let session = null, moi = lsGet("kcm-moi", null), vue = "depenses", mois = today().slice(0, 7);
let depenses = [], avances = [], profils = [], tickets = [];
const enLigne = () => navigator.onLine !== false;

/* =================== 1. Mémoire du téléphone (fonctionne sans Internet) =================== */
const IDB = { b: null, async ouvrir() { if (this.b) return this.b; this.b = await new Promise((ok, ko) => { const r = indexedDB.open("kabylos-frais", 1); r.onupgradeneeded = () => r.result.createObjectStore("attente", { keyPath: "id" }); r.onsuccess = () => ok(r.result); r.onerror = () => ko(r.error); }); return this.b; },
  async faire(mode, f) { const b = await this.ouvrir(); return new Promise((ok, ko) => { const t = b.transaction("attente", mode); const r = f(t.objectStore("attente")); t.oncomplete = () => ok(r && r.result); t.onerror = () => ko(t.error); }); },
  mettre(x) { return this.faire("readwrite", s => s.put(x)); }, liste() { return this.faire("readonly", s => s.getAll()); }, retirer(id) { return this.faire("readwrite", s => s.delete(id)); } };
let attente = [];
async function chargerAttente() { try { attente = (await IDB.liste()) || []; } catch (e) { attente = []; } }

/* =================== 2. Écrans =================== */
function rendre() {
  const app = $("#app");
  if (!session) return rendreLogin();
  if (!moi || !moi.actif) return rendreAttente();
  const admin = moi.role === "admin";
  const tabs = [["depenses", "Dépenses", ICO.liste], ["scanner", "Scanner", ICO.scan], ["ajouter", "Ajouter", ICO.plus], ["avances", "Avances", ICO.avance], ...(admin ? [["admin", "Gestion", ICO.admin]] : [])];
  app.innerHTML = `<header class="bar"><img class="k" src="icons/icon-192.png" alt=""><div><h1>Notes de frais</h1><small>${esc(moi.nom || moi.email)} · v${esc(C.VERSION || "")}</small></div><span class="sp"></span><button type="button" class="decoBar" id="decoBar" title="Se déconnecter">Déconnexion</button><span class="net" id="net">${enLigne() ? (attente.length ? `${attente.length} en attente d'envoi` : "") : "Hors connexion"}</span></header>
    <main class="wrap" id="main"></main>
    <nav class="tabs">${tabs.map(([k, l, i]) => `<button type="button" data-tab="${k}" class="${k === "ajouter" ? "plus" : ""} ${vue === k ? "on" : ""}">${k === "ajouter" ? `<span class="rond">${i}</span>` : i}<span>${l}</span></button>`).join("")}</nav>`;
  if (!$("#net").textContent) $("#net").hidden = true;
  ({ depenses: vueDepenses, avances: vueAvances, admin: vueAdmin }[vue] || vueDepenses)();
}
document.addEventListener("click", e => { if (e.target.closest("#decoBar")) return deconnexion(); if (e.target.closest("#grosScan")) return scannerDirect(); const t = e.target.closest("[data-tab]"); if (!t) return; if (t.dataset.tab === "ajouter") return ouvrirAjout(); if (t.dataset.tab === "scanner") return scannerDirect(); vue = t.dataset.tab; rendre(); window.scrollTo(0, 0); });

function rendreLogin(mode = "connexion", msg = "") {
  const ins = mode === "inscription", oubli = mode === "oubli";
  $("#app").innerHTML = `<div class="login"><div class="logo"><img src="icons/icon-192.png" alt=""><div><h1>Notes de frais</h1><div class="note">${esc(C.SOCIETE)} · Kabylos</div></div></div>
    ${msg}
    <form id="fLog" class="card">
      <h2>${ins ? "Créer mon compte" : oubli ? "Mot de passe oublié" : "Se connecter"}</h2>
      ${ins ? `<div class="fld"><label for="lNom">Prénom et nom</label><input id="lNom" autocomplete="name" required></div>` : ""}
      <div class="fld"><label for="lMail">E-mail</label><input id="lMail" type="email" autocomplete="email" required value="${esc(lsGet("kcm-mail", ""))}"></div>
      ${oubli ? "" : `<div class="fld"><label for="lMdp">Mot de passe</label><input id="lMdp" type="password" autocomplete="${ins ? "new-password" : "current-password"}" minlength="8" required></div>`}
      <button class="btn primary" type="submit">${ins ? "Créer mon compte" : oubli ? "Recevoir un lien" : "Se connecter"}</button>
    </form>
    ${ins || oubli ? `<button class="lien" data-log="connexion">J'ai déjà un compte : me connecter</button>` : `<button class="lien" data-log="inscription">Première fois ? Créer mon compte</button><button class="lien" data-log="oubli">Mot de passe oublié</button>`}
    <p class="note">Installez l'appli : dans Safari, touchez Partager puis « Sur l'écran d'accueil ». Sur Android : menu ⋮ puis « Installer l'application ».</p></div>`;
  document.querySelectorAll("[data-log]").forEach(b => b.onclick = () => rendreLogin(b.dataset.log));
  $("#fLog").onsubmit = async e => { e.preventDefault(); const mail = $("#lMail").value.trim().toLowerCase(); lsSet("kcm-mail", mail); const b = e.target.querySelector("button"); b.disabled = true;
    try {
      if (oubli) { const { error } = await sb.auth.resetPasswordForEmail(mail, { redirectTo: location.origin + location.pathname }); if (error) throw error; return rendreLogin("connexion", `<div class="msg ok">Un lien pour choisir un nouveau mot de passe vient d'être envoyé à ${esc(mail)}.</div>`); }
      if (ins) { const { data, error } = await sb.auth.signUp({ email: mail, password: $("#lMdp").value, options: { data: { nom: $("#lNom").value.trim() }, emailRedirectTo: location.origin + location.pathname } }); if (error) throw error; if (data.user && Array.isArray(data.user.identities) && !data.user.identities.length) return rendreLogin("connexion", `<div class="msg bad">Un compte existe déjà avec l'adresse ${esc(mail)} : il ne faut pas en créer un nouveau. Tapez votre mot de passe ci-dessous et touchez « Se connecter ». Mot de passe oublié ? Touchez « Mot de passe oublié ».</div>`); if (!data.session) return rendreLogin("connexion", `<div class="msg ok">Compte créé. Ouvrez l'e-mail reçu à ${esc(mail)} et cliquez sur le lien de confirmation, puis connectez-vous.</div>`); }
      else { const { error } = await sb.auth.signInWithPassword({ email: mail, password: $("#lMdp").value }); if (error) throw error; }
    } catch (er) { const m = String(er.message || er); rendreLogin(mode, `<div class="msg bad">${/Invalid login/i.test(m) ? "E-mail ou mot de passe incorrect." : /confirm/i.test(m) ? "Confirmez d'abord votre adresse avec le lien reçu par e-mail." : /registered|exists/i.test(m) ? "Un compte existe déjà avec cette adresse : connectez-vous." : /Failed to fetch|network/i.test(m) ? "Pas de connexion Internet : réessayez quand le réseau revient." : esc(m)}</div>`); }
    finally { b.disabled = false; } };
}
function rendreAttente() {
  $("#app").innerHTML = `<div class="login"><div class="logo"><img src="icons/icon-192.png" alt=""><div><h1>Notes de frais</h1><div class="note">${esc(C.SOCIETE)}</div></div></div>
    <div class="card"><h2>Compte en attente d'activation</h2><p class="note">Votre compte (${esc((moi && moi.email) || (session && session.user.email) || "")}) est créé. L'administrateur doit maintenant l'activer. Vous recevrez l'accès dès que c'est fait : rouvrez simplement l'appli.</p>
    <div class="row2"><button class="btn" id="reessayer">Vérifier à nouveau</button><button class="btn ghost" id="deco">Se déconnecter</button></div></div></div>`;
  $("#reessayer").onclick = async () => { await chargerMoi(); rendre(); }; $("#deco").onclick = deconnexion;
}
async function deconnexion() { if (!confirm("Se déconnecter de l'appli Notes de frais sur ce téléphone ?")) return;
  try { await Promise.race([sb.auth.signOut({ scope: "local" }), new Promise(r => setTimeout(r, 4000))]); } catch (e) { }
  try { Object.keys(localStorage).filter(k => /^kcm-(session|cache-|moi)|^sb-/.test(k)).forEach(k => localStorage.removeItem(k)); } catch (e) { }
  session = null; moi = null; depenses = []; avances = []; profils = []; vue = "depenses"; rendre(); toast("Vous êtes déconnecté"); }

/* =================== 3. Données =================== */
async function chargerMoi() { if (!session) return; try { const { data, error } = await sb.from("profils").select("*").eq("id", session.user.id).single(); if (error) throw error; moi = data; lsSet("kcm-moi", moi); } catch (e) { /* hors connexion : on garde le profil en mémoire */ } }
async function chargerDonnees() {
  const cle = "kcm-cache-" + (session && session.user.id);
  const c = lsGet(cle, null); if (c) { depenses = c.depenses || []; avances = c.avances || []; profils = c.profils || []; }
  if (!enLigne() || !session) return majTickets();
  try {
    const admin = moi && moi.role === "admin";
    const [d, a, p] = await Promise.all([sb.from("depenses").select("*").order("date", { ascending: false }).limit(admin ? 3000 : 1000), sb.from("avances").select("*").order("date", { ascending: false }), admin ? sb.from("profils").select("*").order("nom") : Promise.resolve({ data: moi ? [moi] : [] })]);
    if (d.error) throw d.error; depenses = d.data || []; avances = a.data || []; profils = p.data || [];
    lsSet(cle, { depenses, avances, profils });
  } catch (e) { }
  majTickets();
}
function majTickets() { tickets = depenses.filter(d => !session || d.user_id === session.user.id).concat(attente.map(x => x.row)); }
const nomDe = id => { const p = profils.find(x => x.id === id) || (moi && moi.id === id ? moi : null); return p ? (p.nom || p.email) : "?"; };
function soldeDe(uid) { const av = avances.filter(a => a.user_id === uid).reduce((s, a) => s + (a.sens === "rendu" ? -1 : 1) * num(a.montant), 0);
  const dep = depenses.concat(attente.map(x => x.row)).filter(d => d.user_id === uid && persoDe(d) && d.statut !== "refuse").reduce((s, d) => s + (d.type === "avoir" ? -1 : 1) * (num(d.ttc) || 0), 0);
  return { avance: r2(av), depense: r2(dep), solde: r2(av - dep) }; }
const soldeTxt = s => Math.abs(s) < 0.005 ? `<span class="nul">Soldé</span>` : s > 0 ? `<span class="pos">${eur(s)} à justifier</span>` : `<span class="neg">${eur(-s)} à vous rembourser</span>`;

/* =================== 4. Envoi vers la base (et file d'attente hors connexion) =================== */
let envoiEnCours = false;
async function envoyer(it) {
  const uid = it.row.user_id; const photos = [...(it.row.photos || [])], originaux = [...(it.row.originaux || [])];
  for (let i = 0; i < (it.blobs || []).length; i++) { const b = it.blobs[i]; const ext = b.type === "application/pdf" ? "pdf" : "jpg"; const ch = `${uid}/${it.id}/p${i + 1}.${ext}`;
    const { error } = await sb.storage.from("pieces").upload(ch, b, { upsert: true, contentType: b.type || "image/jpeg" }); if (error) throw error; photos[i] = ch;
    if (it.origs && it.origs[i] && it.origs[i] !== b) { const co = `${uid}/${it.id}/o${i + 1}.jpg`; const r = await sb.storage.from("pieces").upload(co, it.origs[i], { upsert: true, contentType: "image/jpeg" }); if (!r.error) originaux[i] = co; } }
  const row = { ...it.row, photos, originaux, maj: new Date().toISOString() }; delete row._local;
  const { error } = await sb.from("depenses").upsert(row); if (error) throw error; return row; }
async function viderAttente() { if (envoiEnCours || !session || !enLigne()) return; envoiEnCours = true; let n = 0;
  try { await chargerAttente(); for (const it of attente) { try { await envoyer(it); await IDB.retirer(it.id); n++; } catch (e) { if (e && /row-level|permission|policy/i.test(String(e.message))) { toast("Envoi refusé : votre compte n'est peut-être plus actif"); } break; } }
    await chargerAttente(); if (n) { toast(`${n} dépense(s) envoyée(s)`); await chargerDonnees(); rendre(); } } finally { envoiEnCours = false; } }
addEventListener("online", () => { viderAttente(); const n = $("#net"); if (n) rendre(); });
addEventListener("offline", () => { const n = $("#net"); if (n) { n.hidden = false; n.textContent = "Hors connexion"; } });
setInterval(viderAttente, 30000);

/* =================== 5. Écran Dépenses =================== */
const urlCache = {};
async function urlPhoto(ch) { if (!ch) return ""; if (urlCache[ch] && urlCache[ch].t > Date.now()) return urlCache[ch].u; try { const { data } = await sb.storage.from("pieces").createSignedUrl(ch, 3600); if (data) { urlCache[ch] = { u: data.signedUrl, t: Date.now() + 3e6 }; return data.signedUrl; } } catch (e) { } return ""; }
async function remplirVignettes(racine) { for (const im of racine.querySelectorAll("img[data-ch]")) { const u = await urlPhoto(im.dataset.ch); if (u) im.src = u; } }
const vignette = d => d.type === "km" ? `<span class="th">KM</span>` : d._blobUrl ? `<img class="th" src="${d._blobUrl}" alt="">` : (d.photos || [])[0] ? (/\.pdf$/.test(d.photos[0]) ? `<span class="th">PDF</span>` : `<img class="th" data-ch="${esc(d.photos[0])}" alt="">`) : `<span class="th">—</span>`;
function ligneDep(d, avecNom) { const [c, l] = STATUTS[d._local ? "local" : d.statut] || STATUTS.soumis;
  return `<button type="button" class="item" data-dep="${esc(d.id)}">${vignette(d)}<span class="t"><b>${esc(d.type === "km" ? `Trajet ${((d.km || {}).depart || "")} → ${((d.km || {}).arrivee || "")}` : d.fournisseur || "Pièce à lire")}</b><span>${esc(fd(d.date))}${avecNom ? " · " + esc(nomDe(d.user_id)) : ""} · ${esc(d.categorie || (d.type === "km" ? "Indemnités km" : ""))}${d.dossier ? " · <b>" + esc(d.dossier) + "</b>" : ""}${d.paye_avec ? " · " + esc(d.paye_avec) : d.paye_par_societe ? " · carte société" : ""}</span>${d.statut === "refuse" && d.motif_refus ? `<span style="display:block;color:var(--accent)">Refusée : ${esc(d.motif_refus)}</span>` : ""}</span><span class="m">${d.ttc !== null && d.ttc !== undefined ? eur((d.type === "avoir" ? -1 : 1) * d.ttc) : "—"}<span class="pill ${c}">${l}</span></span></button>`; }
function vueDepenses() {
  if (filtreDossier && !mesDossiers().some(x => x[0] === filtreDossier)) filtreDossier = "";
  const uid = session.user.id; const loc = attente.filter(x => x.row.user_id === uid).map(x => ({ ...x.row, _local: true, _blobUrl: x.blobs && x.blobs[0] && x.blobs[0].type !== "application/pdf" ? (x._u || (x._u = URL.createObjectURL(x.blobs[0]))) : "" }));
  const L = loc.concat(depenses.filter(d => d.user_id === uid && !loc.some(l => l.id === d.id))).filter(d => (mois === "tout" || (d.date || "").slice(0, 7) === mois) && dansFiltre(d) && !masques().includes(d.id)).sort((a, b) => (b.date || "").localeCompare(a.date || "") || (b.cree || "").localeCompare(a.cree || ""));
  const tot = L.filter(d => !estAdmin(d)).reduce((s, d) => s + (d.type === "avoir" ? -1 : 1) * (num(d.ttc) || 0), 0), perso = L.filter(d => persoDe(d) && d.statut !== "refuse").reduce((s, d) => s + (d.type === "avoir" ? -1 : 1) * (num(d.ttc) || 0), 0); const S = soldeDe(uid);
  $("#main").innerHTML = `<button type="button" class="gros-scan" id="grosScan">${ICO.scan}<span><b>Scanner une facture ou un ticket</b><small>Bords détectés et photo prise toute seule</small></span></button><div class="mois"><button class="btn sm ghost" data-mois="-1" aria-label="Mois précédent">${ICO.gauche}</button><b>${moisLib(mois)}</b><button class="btn sm ghost" data-mois="1" aria-label="Mois suivant">${ICO.droite}</button><button class="btn sm ${mois === "tout" ? "primary" : "ghost"}" data-moistout="1">Tout</button></div>
    <div class="kpis"><div class="kpi"><div class="l">Dépenses du mois</div><div class="v">${eur(tot)}</div><div class="s">${L.length} pièce(s) · dont ${eur(perso)} avancés par vous</div></div><div class="kpi"><div class="l">Mon avance</div><div class="v" style="font-size:16px">${soldeTxt(S.solde)}</div><div class="s">reçu ${eur(S.avance)} · dépensé ${eur(S.depense)}</div></div></div>
    ${DOSSIERS.length ? `<div class="seg" id="filtreDos" style="margin:0 0 12px"><button type="button" data-fd="" class="${filtreDossier ? "" : "on"}">Tous</button>${mesDossiers().map(([n, l]) => `<button type="button" data-fd="${esc(n)}" class="${filtreDossier === n ? "on" : ""}">${esc(l)}</button>`).join("")}</div>` : ""}
    ${attente.length ? `<div class="msg info">${attente.length} dépense(s) gardée(s) sur ce téléphone : ${enLigne() ? "envoi en cours…" : "elles partiront dès que le réseau revient."}</div>` : ""}
    <section class="card"><h2>${filtreDossier ? esc(filtreDossier) : "Mes dépenses"} <span class="n">${L.length}</span></h2><div class="list" id="liste">${L.length ? L.map(d => ligneDep(d)).join("") : `<div class="empty">Aucune dépense en ${moisLib(mois)}. Touchez <b>+ Ajouter</b> pour photographier un ticket ou une facture.</div>`}</div></section>
    <section class="card"><h2>Ma note de frais</h2><p class="note">Le récapitulatif de ${moisLib(mois)} en PDF, avec le détail et le solde de votre avance.</p><button class="btn" id="pdfMoi">Télécharger la note de frais (PDF)</button></section>
    <button class="lien" id="deco">Se déconnecter</button>`;
  remplirVignettes($("#main"));
  $("#pdfMoi").onclick = () => mois === "tout" ? toast("Choisissez d'abord un mois avec ‹ ›") : noteDeFrais(uid, mois); $("#deco").onclick = deconnexion;
  const fd0 = $("#filtreDos"); if (fd0) fd0.onclick = e => { const b = e.target.closest("[data-fd]"); if (!b) return; filtreDossier = b.dataset.fd; lsSet("kcm-filtre-dossier", filtreDossier); vueDepenses(); };
}
document.addEventListener("click", e => { if (e.target.closest("[data-moistout]")) { mois = mois === "tout" ? new Date().toISOString().slice(0, 7) : "tout"; rendre(); return; } const m = e.target.closest("[data-mois]"); if (m) { mois = moisDecal(mois, +m.dataset.mois); rendre(); return; }
  const d = e.target.closest("[data-dep]"); if (d) ouvrirDepense(d.dataset.dep); });
function ouvrirDepense(id) { const loc = attente.find(x => x.id === id); const d = loc ? { ...loc.row, _local: true } : depenses.find(x => x.id === id); if (!d) return;
  if (d.type === "km") return ouvrirKm(d); ouvrirFicheExistante(d, loc); }

async function supprimerPersonne(id) { const p = profils.find(x => x.id === id); if (!p) return;
  const L = depenses.filter(d => d.user_id === id), nonRec = L.filter(d => d.statut !== "importe").length;
  if (!window.confirm(`Supprimer définitivement ${p.nom || p.email} (${p.email}) ?\n\nSon compte ne pourra plus se connecter.${L.length ? `\nSes ${L.length} dépense(s) et leurs photos seront aussi supprimées de l'appli${nonRec ? ` (dont ${nonRec} pas encore récupérée(s) sur l'ordinateur)` : ""}.` : ""}\nCe qui est déjà dans Kabylos Compta sur l'ordinateur est conservé.`)) return;
  if (nonRec && !window.confirm(`Attention : ${nonRec} dépense(s) de ${p.nom || p.email} ne sont pas encore sur l'ordinateur et seront perdues. Supprimer quand même ?`)) return;
  try { const { data, error } = await sb.functions.invoke("gerer-equipe", { body: { action: "supprimer", id } }); if (error) { let m = error.message; try { m = (await error.context.json()).erreur || m; } catch (x) { } throw new Error(m); } if (data && data.erreur) throw new Error(data.erreur);
    toast(`${p.nom || p.email} a été supprimé(e)`, 3500); await chargerDonnees(); vueAdmin(); } catch (e) { toast("Suppression impossible : " + (e.message || "erreur"), 5000); } }
// sélecteur de fichier rattaché à la page (sur iPhone, un sélecteur détaché peut ne jamais répondre)
function choisirFichiers(accept, multiple, cb) { const i = document.createElement("input"); i.type = "file"; i.accept = accept; if (multiple) i.multiple = true; i.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0"; document.body.appendChild(i);
  i.addEventListener("change", () => { const f = [...(i.files || [])]; i.remove(); if (f.length) cb(f); }); i.click(); }
function ajouterPersonne() {
  const s = document.createElement("div"); s.className = "sheet"; s.innerHTML = `<form class="in" id="fPers"><h2>Ajouter une personne</h2>
    <div class="fld"><label for="pNom">Prénom et nom (prénom en premier)</label><input id="pNom" required placeholder="ex. Stéphanie Pradel" autocomplete="off"></div>
    <div class="fld"><label for="pMail">Son e-mail</label><input id="pMail" type="email" required autocomplete="off" autocapitalize="off"></div>
    <div class="fld"><label for="pMdp">Mot de passe (8 caractères minimum, à lui donner)</label><input id="pMdp" type="text" minlength="8" required autocomplete="off" autocapitalize="off"></div>
    <div id="pMsg"></div><div class="row2"><button class="btn primary" type="submit">Créer le compte</button><button class="btn ghost" type="button" id="pAnn">Annuler</button></div></form>`;
  document.body.appendChild(s); s.querySelector("#pAnn").onclick = () => s.remove();
  s.querySelector("#fPers").onsubmit = async e => { e.preventDefault(); const b = e.target.querySelector("[type=submit]"); b.disabled = true; const m = s.querySelector("#pMsg");
    const nom = s.querySelector("#pNom").value.trim(), mail = s.querySelector("#pMail").value.trim().toLowerCase(), mdp = s.querySelector("#pMdp").value;
    try { const tmp = supabase.createClient(C.SUPABASE_URL, C.SUPABASE_CLE, { auth: { persistSession: false, autoRefreshToken: false, storageKey: "kcm-ajout-" + Date.now() } });
      const { data, error } = await tmp.auth.signUp({ email: mail, password: mdp, options: { data: { nom } } }); if (error) throw error;
      const id = data.user && data.user.id; if (!id || (Array.isArray(data.user.identities) && !data.user.identities.length)) throw new Error("Un compte existe déjà avec cette adresse : activez-le dans la liste.");
      try { await tmp.auth.signOut({ scope: "local" }); } catch (x) { }
      for (let i = 0; i < 5; i++) { const { data: up } = await sb.from("profils").update({ nom, actif: true }).eq("id", id).select(); if (up && up.length) break; await new Promise(r => setTimeout(r, 600)); }
      s.remove(); await chargerDonnees(); vueAdmin(); toast(`Compte de ${nom} créé et activé`, 3500);
      window.alert(`Compte créé et activé.\n\nÀ envoyer à ${nom} :\nAppli : ${location.origin + location.pathname}\nE-mail : ${mail}\nMot de passe : ${mdp}\n\nDans Safari : Partager › Sur l'écran d'accueil, puis « Se connecter ».`);
    } catch (er) { const t = String(er.message || er); m.innerHTML = `<div class="msg bad">${/registered|exists|existe/i.test(t) ? "Un compte existe déjà avec cette adresse : retrouvez-le dans la liste et touchez « Activer »." : /password|6 char|weak/i.test(t) ? "Mot de passe trop court ou trop simple : 8 caractères minimum." : /rate|limit/i.test(t) ? "Trop d'essais : attendez quelques minutes." : esc(t)}</div>`; b.disabled = false; } };
}

/* bouton « Scanner » de l'écran principal : caméra, bords de la feuille détectés, photo prise toute seule */
async function scannerDirect() { const f = await cameraScan(); if (f) prendre([f]); }
/* =================== 6. Ajouter : photo, galerie / PDF, kilomètres =================== */
function ouvrirAjout() {
  const s = document.createElement("div"); s.className = "sheet"; s.innerHTML = `<div class="in"><h2>Ajouter une dépense</h2><div class="choixAjout">
    <label>${ICO.photo}<span>Photo</span><input type="file" id="aPhoto" accept="image/*" capture="environment"></label>
    <label>${ICO.galerie}<span>Galerie, scan ou PDF</span><input type="file" id="aGal" accept="image/*,application/pdf" multiple></label>
    <button type="button" id="aKm">${ICO.km}<span>Kilomètres</span></button></div>
    <label class="btn ghost sm" style="display:flex;position:relative;overflow:hidden;width:100%;margin-bottom:8px">🖨 Scan du photocopieur HP (ouvre Fichiers)<input type="file" id="aCopieur" accept="application/pdf,.pdf" multiple style="position:absolute;inset:0;width:100%;height:100%;opacity:0;font-size:100px;cursor:pointer"></label><button type="button" class="btn ghost sm" id="aLive">📄 Scanner automatique (bords détectés, photo prise seule)</button><p class="note"><b>Photocopieur HP :</b> dans l'appli HP Smart, « Numériser » › « Imprimante », puis « Enregistrer dans Fichiers ». Ensuite touchez « Scan du photocopieur HP » et choisissez le fichier.</p><p class="note">Astuce : posez le ticket à plat sur une surface sombre, bien éclairé. Pour scanner, utilisez aussi « Scanner des documents » de l'iPhone (Notes ou Fichiers) puis « Galerie, scan ou PDF ».</p><button class="btn ghost" id="aFermer">Fermer</button></div>`;
  document.body.appendChild(s); const fermer = () => s.remove();
  s.onclick = e => { if (e.target === s) fermer(); }; $("#aFermer").onclick = fermer;
  $("#aPhoto").onchange = e => { const f = [...e.target.files]; fermer(); if (f.length) prendre(f); };
  $("#aLive").onclick = async () => { const f = await cameraScan(); fermer(); if (f) prendre([f]); };
  const appliEcran = (navigator.standalone === true) || (window.matchMedia && matchMedia("(display-mode: standalone)").matches);
  if (!appliEcran && !lsGet("kcm-camnative", false)) $("#aPhoto").parentNode.addEventListener("click", async e => { if (e.target.id === "aPhoto") return; e.preventDefault(); const f = await cameraScan(); fermer(); if (f) prendre([f]); });
  $("#aGal").onchange = e => { const f = [...e.target.files]; fermer(); if (f.length) prendre(f); };
  $("#aCopieur").onchange = e => { const f = [...e.target.files]; fermer(); if (f.length) prendre(f); };
  $("#aKm").onclick = () => { fermer(); ouvrirKm(null); };
}

/* =================== 7. Photo : qualité, recadrage, amélioration =================== */
async function chargerCanvas(file, max) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ko(new Error("Photo illisible : reprenez-la")); i.src = url; });
    const q = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas"); c.width = Math.max(1, Math.round(img.naturalWidth * q)); c.height = Math.max(1, Math.round(img.naturalHeight * q));
    const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(img, 0, 0, c.width, c.height);
    return { c, w0: img.naturalWidth, h0: img.naturalHeight };
  } finally { URL.revokeObjectURL(url); }
}
function gris(src, W) { const q = W / src.width; const w = Math.max(8, Math.round(src.width * q)), h = Math.max(8, Math.round(src.height * q)); const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.drawImage(src, 0, 0, w, h); const d = x.getImageData(0, 0, w, h).data; const g = new Uint8ClampedArray(w * h); for (let i = 0, j = 0; i < g.length; i++, j += 4) g[i] = (d[j] * 299 + d[j + 1] * 587 + d[j + 2] * 114) / 1000; return { g, w, h }; }
function mesurer({ g, w, h }) { let s = 0, s2 = 0, gl = 0; for (const v of g) { s += v; s2 += v * v; if (v >= 254) gl++; } const n = g.length, m = s / n;
  let l = 0, l2 = 0, k = 0; for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x; const v = 4 * g[i] - g[i - 1] - g[i + 1] - g[i - w] - g[i + w]; l += v; l2 += v * v; k++; }
  const lm = l / k; return { moy: m, ecart: Math.sqrt(Math.max(0, s2 / n - m * m)), nettete: l2 / k - lm * lm, reflet: gl / n }; }
function otsu(g) { const H = new Array(256).fill(0); g.forEach(v => H[v]++); const n = g.length; let sum = 0; for (let i = 0; i < 256; i++) sum += i * H[i]; let sB = 0, wB = 0, best = 0, t = 128; for (let i = 0; i < 256; i++) { wB += H[i]; if (!wB) continue; const wF = n - wB; if (!wF) break; sB += i * H[i]; const mB = sB / wB, mF = (sum - sB) / wF, v = wB * wF * (mB - mF) ** 2; if (v > best) { best = v; t = i; } } return t; }
function cadre({ g, w, h }) { // zone claire (le papier) plus claire que le fond
  const t = otsu(g); const plage = (n, f) => { const fr = []; for (let i = 0; i < n; i++) fr.push(f(i)); let bi = -1, bl = 0, ci = -1; for (let i = 0; i <= n; i++) { if (i < n && fr[i] > .3) { if (ci < 0) ci = i; } else if (ci >= 0) { if (i - ci > bl) { bl = i - ci; bi = ci; } ci = -1; } } return bi < 0 ? null : [bi, bi + bl - 1]; };
  const ry = plage(h, y => { let c = 0; for (let x = 0; x < w; x++) if (g[y * w + x] > t) c++; return c / w; }); const rx = plage(w, x => { let c = 0; for (let y = 0; y < h; y++) if (g[y * w + x] > t) c++; return c / h; });
  if (!ry || !rx) return null; const [y0, y1] = ry, [x0, x1] = rx; const aire = (x1 - x0 + 1) * (y1 - y0 + 1) / (w * h); if (aire < .12 || aire > .9) return null;
  let si = 0, ni = 0, so = 0, no = 0; for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) { const v = g[y * w + x]; if (x >= x0 && x <= x1 && y >= y0 && y <= y1) { si += v; ni++; } else { so += v; no++; } }
  if (!no || si / ni - so / no < 30) return null; const mx = (x1 - x0) * .03, my = (y1 - y0) * .03;
  return { x: Math.max(0, (x0 - mx) / w), y: Math.max(0, (y0 - my) / h), w: Math.min(1, (x1 - x0 + 2 * mx) / w), h: Math.min(1, (y1 - y0 + 2 * my) / h) }; }
function rogner(c, b) { const x = Math.round(b.x * c.width), y = Math.round(b.y * c.height), w = Math.min(c.width - x, Math.round(b.w * c.width)), h = Math.min(c.height - y, Math.round(b.h * c.height)); const o = document.createElement("canvas"); o.width = w; o.height = h; o.getContext("2d").drawImage(c, x, y, w, h, 0, 0, w, h); return o; }
function ameliorer(c) { const x = c.getContext("2d"); const im = x.getImageData(0, 0, c.width, c.height), d = im.data; const H = new Array(256).fill(0); for (let i = 0; i < d.length; i += 16) H[(d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000 | 0]++; const n = H.reduce((a, b) => a + b, 0); let a = 0, lo = 0, hi = 255; for (let i = 0; i < 256; i++) { a += H[i]; if (a > n * .01) { lo = i; break; } } a = 0; for (let i = 255; i >= 0; i--) { a += H[i]; if (a > n * .01) { hi = i; break; } }
  if (hi - lo > 215 || hi - lo < 40) return c; const k = 255 / (hi - lo); for (let i = 0; i < d.length; i += 4) { d[i] = (d[i] - lo) * k; d[i + 1] = (d[i + 1] - lo) * k; d[i + 2] = (d[i + 2] - lo) * k; } x.putImageData(im, 0, 0); return c; }
function tourner(c, deg) { if (!deg) return c; const o = document.createElement("canvas"); const d = ((deg % 360) + 360) % 360; o.width = d % 180 ? c.height : c.width; o.height = d % 180 ? c.width : c.height; const x = o.getContext("2d"); x.translate(o.width / 2, o.height / 2); x.rotate(d * Math.PI / 180); x.drawImage(c, -c.width / 2, -c.height / 2); return o; }
function empreinte(c) { const s = document.createElement("canvas"); s.width = 9; s.height = 8; s.getContext("2d").drawImage(c, 0, 0, 9, 8); const d = s.getContext("2d").getImageData(0, 0, 9, 8).data; let bits = ""; for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const i = (y * 9 + x) * 4, j = i + 4; bits += (d[i] + d[i + 1] + d[i + 2]) > (d[j] + d[j + 1] + d[j + 2]) ? "1" : "0"; } return bits; }
const distance = (a, b) => { if (!a || !b || a.length !== b.length) return 99; let n = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) n++; return n; };
const enBlob = c => new Promise(ok => c.toBlob(b => ok(b), "image/jpeg", 0.88));
async function traiterPhoto(file) {
  const { c, w0, h0 } = await chargerCanvas(file, 2400); const orig = await enBlob(c);
  const G = gris(c, 480); const q = mesurer(G); const sc = scanner(c, file && file._quad); const t = ameliorerCouleur(sc.plat);
  const pb = []; if (Math.min(w0, h0) < 450) pb.push(["warn", "Photo de petite taille : rapprochez-vous du ticket."]);
  if (q.moy < 65) pb.push(["bad", "Photo trop sombre : allumez la lumière ou le flash."]); if (q.ecart < 22) pb.push(["bad", "Photo sans contraste : le texte se distingue mal du fond."]);
  if (q.nettete < 35) pb.push(["bad", "Photo floue : tenez le téléphone immobile et touchez l'écran pour faire la mise au point."]); else if (q.nettete < 80) pb.push(["warn", "Photo un peu floue : si les chiffres sont difficiles à lire, reprenez-la."]);
  if (q.reflet > .2) pb.push(["warn", "Zone très claire (reflet ou surexposition) : si des chiffres sont effacés, reprenez la photo sans flash."]);
  return { canvas: t, blob: await enBlob(t), orig, url: "", hash: empreinte(t), recadre: sc.recadre, aplat: sc.aplat, plat: sc.plat, quad: sc.quad, mode: "couleur", pb };
}
/* =================== 7 bis. Scanner : trouve les 4 coins de la pièce, la remet à plat, la redresse et l'améliore =================== */
/* détection des bords de la feuille par les lignes droites (comme les applis de scan) */
function coinsBords(G) {
  const { g, w, h } = G; const n = w * h;
  // flou léger
  const f = new Float32Array(n), t = new Float32Array(n);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0, k = 0; for (let d = -2; d <= 2; d++) { const xx = x + d; if (xx >= 0 && xx < w) { s += g[y * w + xx]; k++; } } t[y * w + x] = s / k; }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { let s = 0, k = 0; for (let d = -2; d <= 2; d++) { const yy = y + d; if (yy >= 0 && yy < h) { s += t[yy * w + x]; k++; } } f[y * w + x] = s / k; }
  // gradient (Sobel)
  const gx = new Float32Array(n), gy = new Float32Array(n), mg = new Float32Array(n);
  for (let y = 1; y < h - 1; y++) for (let x = 1; x < w - 1; x++) { const i = y * w + x;
    const a = f[i - w - 1], b = f[i - w], c = f[i - w + 1], d = f[i - 1], e = f[i + 1], ff = f[i + w - 1], gg = f[i + w], hh = f[i + w + 1];
    const X = (c + 2 * e + hh) - (a + 2 * d + ff), Y = (ff + 2 * gg + hh) - (a + 2 * b + c); gx[i] = X; gy[i] = Y; mg[i] = Math.hypot(X, Y); }
  // seuil : les bords nets seulement
  const sm = []; for (let i = 0; i < n; i += 7) sm.push(mg[i]); sm.sort((a, b) => a - b); const thr = Math.max(28, sm[Math.floor(sm.length * .9)]);
  // amincissement (maximum local dans le sens du gradient)
  const E = new Uint8Array(n);
  for (let y = 2; y < h - 2; y++) for (let x = 2; x < w - 2; x++) { const i = y * w + x, m = mg[i]; if (m < thr) continue; const ux = gx[i] / m, uy = gy[i] / m;
    const j1 = Math.round(y + uy) * w + Math.round(x + ux), j2 = Math.round(y - uy) * w + Math.round(x - ux); if (m >= mg[j1] && m >= mg[j2]) E[i] = 1; }
  // transformée de Hough orientée
  const NT = 180, D = Math.ceil(Math.hypot(w, h)), NR = 2 * D + 1, A = new Float32Array(NT * NR), CO = new Float32Array(NT), SI = new Float32Array(NT);
  for (let k = 0; k < NT; k++) { CO[k] = Math.cos(k * Math.PI / NT); SI[k] = Math.sin(k * Math.PI / NT); }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const i = y * w + x; if (!E[i]) continue; let th = Math.atan2(gy[i], gx[i]); if (th < 0) th += Math.PI; if (th >= Math.PI) th -= Math.PI; const k0 = Math.round(th / Math.PI * NT);
    const wt = Math.min(1, mg[i] / (thr * 3)) + .5; for (let dk = -3; dk <= 3; dk++) { const k = (k0 + dk + NT) % NT; const r = Math.round(x * CO[k] + y * SI[k]) + D; A[k * NR + r] += wt; } }
  // pics
  const P = []; const A2 = A.slice();
  for (let it = 0; it < 28; it++) { let bi = 0, bv = 0; for (let i = 0; i < A2.length; i++) if (A2[i] > bv) { bv = A2[i]; bi = i; } if (bv < Math.min(w, h) * .12) break; const k = Math.floor(bi / NR), r = bi % NR - D; P.push({ k, r, v: bv });
    for (let dk = -6; dk <= 6; dk++) for (let dr = -10; dr <= 10; dr++) { let kk = k + dk, rr = r + dr; if (kk < 0) { kk += NT; rr = -rr; } if (kk >= NT) { kk -= NT; rr = -rr; } rr += D; if (rr >= 0 && rr < NR) A2[kk * NR + rr] = 0; } }
  // bords de l'image comme lignes possibles (feuille coupée par le cadre)
  const Hs = [], Vs = [];
  for (const p of P) { const deg = p.k * 180 / NT; (deg > 45 && deg < 135 ? Hs : Vs).push({ c: CO[p.k], s: SI[p.k], r: p.r, img: false }); }
  Hs.push({ c: 0, s: 1, r: 1, img: true }, { c: 0, s: 1, r: h - 2, img: true }); Vs.push({ c: 1, s: 0, r: 1, img: true }, { c: 1, s: 0, r: w - 2, img: true });
  const inter = (a, b) => { const det = a.c * b.s - a.s * b.c; if (Math.abs(det) < 1e-6) return null; return [(a.r * b.s - a.s * b.r) / det, (a.c * b.r - a.r * b.c) / det]; };
  const lum = (x, y) => { x = Math.max(0, Math.min(w - 1, Math.round(x))); y = Math.max(0, Math.min(h - 1, Math.round(y))); return f[y * w + x]; };
  // appui d'un côté : part des points du côté posés sur un vrai bord, gradient dans le bon sens (du fond vers la feuille)
  const cote = (p, q, cx, cy, img, Lin) => { if (img) { let m = 0; const N = 30; for (let k = 0; k < N; k++) { const u = (k + .5) / N; const x = p[0] + (q[0] - p[0]) * u, y = p[1] + (q[1] - p[1]) * u; m += lum(x + (cx - x) * .02, y + (cy - y) * .02); } m /= N; return { s: m >= Lin - 20 ? .45 : m >= Lin - 45 ? .25 : .05, d: 0, imgSide: true }; } const L = Math.hypot(q[0] - p[0], q[1] - p[1]); const N = Math.max(12, Math.min(60, Math.round(L / 4))); let nx = -(q[1] - p[1]) / L, ny = (q[0] - p[0]) / L; const mx = (p[0] + q[0]) / 2, my = (p[1] + q[1]) / 2; if ((cx - mx) * nx + (cy - my) * ny < 0) { nx = -nx; ny = -ny; } // n : vers l'intérieur
    let ok = 0, din = 0, dout = 0, nd = 0; for (let k = 0; k < N; k++) { const u = (k + .5) / N, x = p[0] + (q[0] - p[0]) * u, y = p[1] + (q[1] - p[1]) * u; let best = 0;
      for (let o = -2; o <= 2; o++) { const xx = Math.round(x + nx * o), yy = Math.round(y + ny * o); if (xx < 1 || yy < 1 || xx >= w - 1 || yy >= h - 1) continue; const i = yy * w + xx, m = mg[i]; if (m < thr * .6) continue; const cs = (gx[i] * nx + gy[i] * ny) / m; const v = cs > .8 ? 1 : cs < -.8 ? .45 : 0; if (v > best) best = v; }
      ok += best; const xi = x + nx * 6, yi = y + ny * 6, xo = x - nx * 6, yo = y - ny * 6; if (xo >= 0 && yo >= 0 && xo < w && yo < h) { din += lum(xi, yi); dout += lum(xo, yo); nd++; } }
    const dd = nd ? (din - dout) / nd : 0; return { s: ok / N * Math.max(.35, Math.min(1, (Math.abs(dd) + 4) / 28)), d: dd }; };
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const Hl = Hs.filter(l => !l.img).slice(0, 12).concat(Hs.filter(l => l.img)), Vl = Vs.filter(l => !l.img).slice(0, 12).concat(Vs.filter(l => l.img)); let best = null;
  for (let a = 0; a < Hl.length; a++) for (let b = a + 1; b < Hl.length; b++) for (let c = 0; c < Vl.length; c++) for (let d = c + 1; d < Vl.length; d++) {
    let T = Hl[a], B = Hl[b], Lf = Vl[c], R = Vl[d];
    const y0 = l => (l.r - l.c * w / 2) / l.s, x0 = l => (l.r - l.s * h / 2) / l.c; if (y0(T) > y0(B)) [T, B] = [B, T]; if (x0(Lf) > x0(R)) [Lf, R] = [R, Lf];
    if (T.img && B.img && Lf.img && R.img) continue;
    const Q = [inter(T, Lf), inter(T, R), inter(B, R), inter(B, Lf)]; if (Q.some(q => !q || q[0] < -w * .03 || q[1] < -h * .03 || q[0] > w * 1.03 || q[1] > h * 1.03)) continue;
    let conv = true; for (let i = 0; i < 4; i++) if (cr(Q[i], Q[(i + 1) % 4], Q[(i + 2) % 4]) <= 0) { conv = false; break; } if (!conv) continue;
    let area = 0; for (let i = 0; i < 4; i++) area += Q[i][0] * Q[(i + 1) % 4][1] - Q[(i + 1) % 4][0] * Q[i][1]; area = Math.abs(area) / 2 / n; if (area < .15) continue;
    let angOk = true; for (let i = 0; i < 4; i++) { const p = Q[(i + 3) % 4], o = Q[i], q = Q[(i + 1) % 4]; const v1 = [p[0] - o[0], p[1] - o[1]], v2 = [q[0] - o[0], q[1] - o[1]]; const cs = (v1[0] * v2[0] + v1[1] * v2[1]) / Math.hypot(...v1) / Math.hypot(...v2); if (Math.abs(cs) > .55) { angOk = false; break; } } if (!angOk) continue;
    const cx = Q.reduce((s, q) => s + q[0], 0) / 4, cy = Q.reduce((s, q) => s + q[1], 0) / 4;
    if ([T, R, B, Lf].filter(l => l.img).length > 2) continue;
    const vin = []; for (let a1 = 1; a1 < 8; a1++) for (let b1 = 1; b1 < 8; b1++) { const u = a1 / 8, v = b1 / 8; const x = (Q[0][0] * (1 - u) + Q[1][0] * u) * (1 - v) + (Q[3][0] * (1 - u) + Q[2][0] * u) * v, y = (Q[0][1] * (1 - u) + Q[1][1] * u) * (1 - v) + (Q[3][1] * (1 - u) + Q[2][1] * u) * v; vin.push(lum(x, y)); } vin.sort((x, y) => x - y); const Lin = vin[Math.floor(vin.length * .6)];
    const S = [cote(Q[0], Q[1], cx, cy, T.img, Lin), cote(Q[1], Q[2], cx, cy, R.img, Lin), cote(Q[2], Q[3], cx, cy, B.img, Lin), cote(Q[3], Q[0], cx, cy, Lf.img, Lin)];
    const ss = S.map(z => z.s); const mn = Math.min(...ss), mo = ss.reduce((x, y) => x + y, 0) / 4; if (mn < .22) continue;
    const dd = S.filter(z => !z.imgSide).map(z => z.d); const dm = dd.length ? dd.reduce((x, y) => x + y, 0) / dd.length : 20;
    const score = (mo + mn) / 2 * Math.pow(area, .6) * (dm > 4 ? 1 : dm > -4 ? .75 : .5);
    if (!best || score > best.score) best = { Q, score, mo, mn, area, dm, Ls: [T, R, B, Lf] }; }
  if (!best) return null;
  // affinage : chaque côté est recalé sur les points de bord voisins (moindres carrés)
  const aff = l => { if (l.img) return l; let sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, k = 0;
    for (let y = 2; y < h - 2; y++) for (let x = 2; x < w - 2; x++) { const i = y * w + x; if (!E[i]) continue; if (Math.abs(x * l.c + y * l.s - l.r) > 4) continue; const cs = Math.abs(gx[i] * l.c + gy[i] * l.s) / mg[i]; if (cs < .9) continue; sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y; k++; }
    if (k < 20) return l; const mx = sx / k, my = sy / k, a = sxx / k - mx * mx, b = sxy / k - mx * my, c = syy / k - my * my; const th = .5 * Math.atan2(2 * b, a - c); // direction de la ligne
    let nc = -Math.sin(th), ns = Math.cos(th); if (nc * l.c + ns * l.s < 0) { nc = -nc; ns = -ns; } return { c: nc, s: ns, r: mx * nc + my * ns, img: false }; };
  const [T, R, B, Lf] = best.Ls.map(aff); const Q = [inter(T, Lf), inter(T, R), inter(B, R), inter(B, Lf)];
  if (!Q.some(q => !q)) best.Q = Q.map(([x, y]) => [Math.max(0, Math.min(w, x)), Math.max(0, Math.min(h, y))]);
  return best; }
function coinsDocument(G) { // bords droits de la feuille d'abord (comme Scanner Mini), sinon zone claire
  let b = null; try { b = coinsBords(G); } catch (e) { }
  if (G.w > 400 || G.h > 400) try { const k = 360 / Math.max(G.w, G.h), w = Math.max(8, Math.round(G.w * k)), h = Math.max(8, Math.round(G.h * k)), g = new Uint8ClampedArray(w * h); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) g[y * w + x] = G.g[Math.min(G.h - 1, Math.round(y / k)) * G.w + Math.min(G.w - 1, Math.round(x / k))];
    const b2 = coinsBords({ g, w, h }); if (b2 && (!b || b2.score > b.score * 1.05)) b = { score: b2.score, Q: b2.Q.map(([x, y]) => [x / k, y / k]) }; } catch (e) { }
  if (b && b.score >= .27) return b.Q; return coinsSeuil(G); }
function coinsSeuil(G) { // renvoie [[x,y] haut-gauche, haut-droit, bas-droit, bas-gauche] (coordonnées de l'image réduite) ou null — essaie plusieurs seuils et garde le meilleur cadre
  const { g, w, h } = G; const t0 = otsu(g); let best = null;
  for (const t of [t0, t0 - 18, t0 + 18, t0 - 36, t0 + 36]) { if (t < 25 || t > 240) continue; let r = null; try { r = quadSeuil(g, w, h, t); } catch (e) { } if (r && (!best || r.score > best.score)) best = r; }
  return best ? best.Q : null; }
function morphoBin(m, w, h, r, dil) { // dilatation (dil) ou érosion d'un masque binaire, carré (2r+1)
  const a = new Uint8Array(w * h), o = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) { let c = 0; const b = y * w; for (let x = -r; x < w; x++) { const xa = x + r, xr = x - r - 1; if (xa < w) c += m[b + xa]; if (xr >= 0) c -= m[b + xr]; if (x >= 0) { const tot = Math.min(w - 1, x + r) - Math.max(0, x - r) + 1; a[b + x] = dil ? (c > 0 ? 1 : 0) : (c === tot ? 1 : 0); } } }
  for (let x = 0; x < w; x++) { let c = 0; for (let y = -r; y < h; y++) { const ya = y + r, yr = y - r - 1; if (ya < h) c += a[ya * w + x]; if (yr >= 0) c -= a[yr * w + x]; if (y >= 0) { const tot = Math.min(h - 1, y + r) - Math.max(0, y - r) + 1; o[y * w + x] = dil ? (c > 0 ? 1 : 0) : (c === tot ? 1 : 0); } } }
  return o; }
function quadSeuil(g, w, h, t) {
  const n = w * h; let m = new Uint8Array(n); for (let i = 0; i < n; i++) m[i] = g[i] > t ? 1 : 0;
  const r = Math.max(1, Math.round(Math.min(w, h) / 120)); m = morphoBin(morphoBin(m, w, h, r, false), w, h, r, true); // retire les petits points clairs
  m = morphoBin(morphoBin(m, w, h, r * 2, true), w, h, r * 2, false); // bouche les trous de l'écriture
  const lab = new Uint8Array(n), pile = new Int32Array(n); let bestS = -1, bestN = 0, id = 0, ids = new Int32Array(n);
  for (let s = 0; s < n; s++) { if (!m[s] || ids[s]) continue; id++; let sp = 0, k = 0; pile[sp++] = s; ids[s] = id;
    while (sp) { const i = pile[--sp]; k++; const x = i % w; if (x > 0 && m[i - 1] && !ids[i - 1]) { ids[i - 1] = id; pile[sp++] = i - 1; } if (x < w - 1 && m[i + 1] && !ids[i + 1]) { ids[i + 1] = id; pile[sp++] = i + 1; } if (i >= w && m[i - w] && !ids[i - w]) { ids[i - w] = id; pile[sp++] = i - w; } if (i < n - w && m[i + w] && !ids[i + w]) { ids[i + w] = id; pile[sp++] = i + w; } }
    if (k > bestN) { bestN = k; bestS = id; } }
  if (bestS < 0 || bestN / n < .07) return null;
  let si = 0, so = 0, no = 0; for (let i = 0; i < n; i++) { if (ids[i] === bestS) si += g[i]; else { so += g[i]; no++; } }
  const diff = no / n > .03 ? si / bestN - so / no : 60; if (diff < 14) return null;
  // contour : point le plus à gauche et le plus à droite de chaque ligne, puis enveloppe convexe
  const P = []; for (let y = 0; y < h; y++) { let a = -1, b = -1; for (let x = 0; x < w; x++) if (ids[y * w + x] === bestS) { if (a < 0) a = x; b = x; } if (a >= 0) { P.push([a, y]); if (b !== a) P.push([b + 1, y]); } }
  if (P.length < 6) return null; P.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const lo = [], up = [];
  for (const p of P) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = P.length - 1; i >= 0; i--) { const p = P[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  let H = lo.slice(0, -1).concat(up.slice(0, -1)); if (H.length < 4) return null;
  if (H.length > 48) { const k = H.length / 48; H = Array.from({ length: 48 }, (_, i) => H[Math.floor(i * k)]); }
  // le plus grand quadrilatère inscrit dans l'enveloppe = les 4 coins
  const N = H.length, tri = (a, b, c) => Math.abs(cr(H[a], H[b], H[c])) / 2; let bA = 0, Q = null;
  for (let i = 0; i < N; i++) for (let j = i + 2; j < N; j++) { let m1 = 0, k1 = -1, m2 = 0, k2 = -1; for (let k = i + 1; k < j; k++) { const v = tri(i, k, j); if (v > m1) { m1 = v; k1 = k; } } for (let k = j + 1; k < i + N; k++) { const kk = k % N; const v = tri(j, kk, i); if (v > m2) { m2 = v; k2 = kk; } }
    if (k1 >= 0 && k2 >= 0 && m1 + m2 > bA) { bA = m1 + m2; Q = [H[i], H[k1], H[j], H[k2]]; } }
  if (!Q || bA / n < .07) return null; const fit = bestN / bA; if (fit < .72) return null;
  const L = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]), mn = Math.min(w, h) * .12; for (let i = 0; i < 4; i++) if (L(Q[i], Q[(i + 1) % 4]) < mn) return null;
  const cx = Q.reduce((s, q) => s + q[0], 0) / 4, cy = Q.reduce((s, q) => s + q[1], 0) / 4; let R = [...Q].sort((a, b) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(b[1] - cy, b[0] - cx)); let i0 = 0; R.forEach((q, i) => { if (q[0] + q[1] < R[i0][0] + R[i0][1]) i0 = i; }); R = [0, 1, 2, 3].map(i => R[(i0 + i) % 4]);
  return { Q: R.map(([x, y]) => [cx + (x - cx) * .995, cy + (y - cy) * .995]), score: bA / n * Math.min(1, fit) * Math.min(1, diff / 50) }; }
function homographie(src, dst) { // matrice qui envoie dst[i] sur src[i]
  const A = [], B = []; for (let i = 0; i < 4; i++) { const [x, y] = dst[i], [u, v] = src[i]; A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.push(u); A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); B.push(v); }
  for (let c = 0; c < 8; c++) { let p = c; for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[p][c])) p = r; [A[c], A[p]] = [A[p], A[c]]; [B[c], B[p]] = [B[p], B[c]]; if (Math.abs(A[c][c]) < 1e-12) return null;
    for (let r = 0; r < 8; r++) { if (r === c) continue; const f = A[r][c] / A[c][c]; if (!f) continue; for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k]; B[r] -= f * B[c]; } }
  return B.map((b, i) => b / A[i][i]).concat(1); }
function remettreAPlat(c, Q) { // Q : 4 coins en pixels de c, dans l'ordre haut-gauche, haut-droit, bas-droit, bas-gauche
  const L = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]); let W = Math.max(L(Q[0], Q[1]), L(Q[3], Q[2])), H = Math.max(L(Q[0], Q[3]), L(Q[1], Q[2]));
  const k = Math.min(1, 2400 / Math.max(W, H)); W = Math.max(8, Math.round(W * k)); H = Math.max(8, Math.round(H * k));
  const M = homographie(Q, [[0, 0], [W, 0], [W, H], [0, H]]); if (!M) return null;
  const sw = c.width, sh = c.height; const S = c.getContext("2d").getImageData(0, 0, sw, sh).data;
  const o = document.createElement("canvas"); o.width = W; o.height = H; const ox = o.getContext("2d"); const out = ox.createImageData(W, H), D = out.data;
  for (let y = 0; y < H; y++) { const yy = y + .5; for (let x = 0; x < W; x++) { const xx = x + .5; const z = M[6] * xx + M[7] * yy + 1; let u = (M[0] * xx + M[1] * yy + M[2]) / z - .5, v = (M[3] * xx + M[4] * yy + M[5]) / z - .5;
      const j = (y * W + x) * 4; if (u < 0) u = 0; if (v < 0) v = 0; if (u > sw - 1) u = sw - 1; if (v > sh - 1) v = sh - 1;
      const x0 = u | 0, y0 = v | 0, x1 = Math.min(sw - 1, x0 + 1), y1 = Math.min(sh - 1, y0 + 1), fx = u - x0, fy = v - y0;
      const i00 = (y0 * sw + x0) * 4, i10 = (y0 * sw + x1) * 4, i01 = (y1 * sw + x0) * 4, i11 = (y1 * sw + x1) * 4;
      for (let ch = 0; ch < 3; ch++) { const t0 = S[i00 + ch] + (S[i10 + ch] - S[i00 + ch]) * fx, t1 = S[i01 + ch] + (S[i11 + ch] - S[i01 + ch]) * fx; D[j + ch] = t0 + (t1 - t0) * fy; } D[j + 3] = 255; } }
  ox.putImageData(out, 0, 0); return o; }
function scanner(c, Qvu) { // pièce photographiée → pièce à plat et droite ; renvoie { plat, quad, recadre, aplat } — Qvu : cadre vu à l'écran pendant le scan (0..1)
  const G = gris(c, 480); let t = null, recadre = false, aplat = false, quad = null;
  try { let Q = null; if (Qvu) { const cx = Qvu.reduce((s, q) => s + q[0], 0) / 4, cy = Qvu.reduce((s, q) => s + q[1], 0) / 4; Q = Qvu.map(([x, y]) => [Math.max(0, Math.min(1, cx + (x - cx) * 1.01)) * G.w, Math.max(0, Math.min(1, cy + (y - cy) * 1.01)) * G.h]); } else Q = coinsDocument(G); if (Q) { quad = Q.map(([x, y]) => [x / G.w, y / G.h]); t = remettreAPlat(c, quad.map(([x, y]) => [x * c.width, y * c.height])); if (t) recadre = aplat = true; } } catch (e) { t = null; }
  if (!t) { const b = cadre(G); t = b ? rogner(c, b) : c; recadre = !!b; if (b) quad = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.h], [b.x, b.y + b.h]]; }
  if (!Qvu || !aplat) try { const a = angleInclinaison(t); if (Math.abs(a) >= .3) { let r = tournerAngle(t, -a); const bx = cadre(gris(r, 480)); if (bx) r = rogner(r, bx); t = r; aplat = true; } } catch (e) { }
  if (t === c) { const o = document.createElement("canvas"); o.width = c.width; o.height = c.height; o.getContext("2d").drawImage(c, 0, 0); t = o; }
  return { plat: ameliorer(t), quad, recadre, aplat }; }
/* scan couleur : fond du papier rendu blanc et régulier (ombres retirées), couleurs gardées, texte plus net */
function ameliorerCouleur(c) { const w = c.width, h = c.height; const x0 = c.getContext("2d"); const d = x0.getImageData(0, 0, w, h).data;
  // 1. couleur du papier, zone par zone (clair dominant de chaque case)
  const B = Math.max(10, Math.round(Math.max(w, h) / 90)), gw = Math.ceil(w / B), gh = Math.ceil(h / B); const R = new Float32Array(gw * gh), G = new Float32Array(gw * gh), Bl = new Float32Array(gw * gh), Lm = new Float32Array(gw * gh);
  const hist = new Uint32Array(256);
  for (let by = 0; by < gh; by++) for (let bx = 0; bx < gw; bx++) { hist.fill(0); let k = 0; const xa = bx * B, ya = by * B, xb = Math.min(w, xa + B), yb = Math.min(h, ya + B);
    for (let y = ya; y < yb; y += 2) for (let x = xa; x < xb; x += 2) { const i = (y * w + x) * 4; hist[(d[i] * 77 + d[i + 1] * 150 + d[i + 2] * 29) >> 8]++; k++; }
    let a = 0, t = 255; for (let v = 255; v >= 0; v--) { a += hist[v]; if (a >= k * .12) { t = v; break; } } // les 12 % les plus clairs = le papier
    let r = 0, g = 0, b = 0, m = 0; for (let y = ya; y < yb; y += 2) for (let x = xa; x < xb; x += 2) { const i = (y * w + x) * 4; if (((d[i] * 77 + d[i + 1] * 150 + d[i + 2] * 29) >> 8) >= t) { r += d[i]; g += d[i + 1]; b += d[i + 2]; m++; } }
    const j = by * gw + bx; R[j] = r / m; G[j] = g / m; Bl[j] = b / m; Lm[j] = (R[j] * 77 + G[j] * 150 + Bl[j] * 29) / 256; }
  // 2. cases sombres isolées (logo, gros texte) : remplacées par la médiane des voisines
  const med = (A, j, bx, by) => { const v = []; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = bx + dx, yy = by + dy; if (xx >= 0 && yy >= 0 && xx < gw && yy < gh) v.push(A[yy * gw + xx]); } v.sort((p, q) => p - q); return v[v.length >> 1]; };
  for (let pass = 0; pass < 2; pass++) { const R2 = R.slice(), G2 = G.slice(), B2 = Bl.slice(), L2 = Lm.slice();
    for (let by = 0; by < gh; by++) for (let bx = 0; bx < gw; bx++) { const j = by * gw + bx; const ml = med(L2, j, bx, by); if (L2[j] < ml - 18) { R[j] = med(R2, j, bx, by); G[j] = med(G2, j, bx, by); Bl[j] = med(B2, j, bx, by); Lm[j] = ml; } } }
  // 3. fond lissé et agrandi
  const sm = document.createElement("canvas"); sm.width = gw; sm.height = gh; const sx = sm.getContext("2d"); const id = sx.createImageData(gw, gh);
  for (let j = 0; j < gw * gh; j++) { id.data[j * 4] = R[j]; id.data[j * 4 + 1] = G[j]; id.data[j * 4 + 2] = Bl[j]; id.data[j * 4 + 3] = 255; } sx.putImageData(id, 0, 0);
  const sm2 = document.createElement("canvas"); sm2.width = gw; sm2.height = gh; const s2 = sm2.getContext("2d"); s2.filter = "blur(1px)"; s2.drawImage(sm, 0, 0);
  const bg = document.createElement("canvas"); bg.width = w; bg.height = h; const bx_ = bg.getContext("2d"); bx_.imageSmoothingEnabled = true; bx_.imageSmoothingQuality = "high"; bx_.drawImage(sm2, 0, 0, gw, gh, -B / 2, -B / 2, gw * B, gh * B); const b = bx_.getImageData(0, 0, w, h).data;
  // 3 bis. fond fin qui suit le bord net des ombres : fermeture (max puis min) de la luminosité, rayon > épaisseur des lettres
  const fs = Math.min(1, 1200 / Math.max(w, h)), fw = Math.max(8, Math.round(w * fs)), fh = Math.max(8, Math.round(h * fs)); const fc = document.createElement("canvas"); fc.width = fw; fc.height = fh; const fx = fc.getContext("2d"); fx.drawImage(c, 0, 0, fw, fh); const fd = fx.getImageData(0, 0, fw, fh).data;
  let Lf = new Float32Array(fw * fh); for (let i = 0; i < fw * fh; i++) Lf[i] = (fd[i * 4] * 77 + fd[i * 4 + 1] * 150 + fd[i * 4 + 2] * 29) / 256;
  const rr = Math.max(3, Math.round(Math.max(fw, fh) / 140));
  const filt = (A, isMax) => { const T1 = new Float32Array(A.length), T2 = new Float32Array(A.length);
    for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) { let m = isMax ? 0 : 255; for (let k = Math.max(0, x - rr); k <= Math.min(fw - 1, x + rr); k++) { const v = A[y * fw + k]; if (isMax ? v > m : v < m) m = v; } T1[y * fw + x] = m; }
    for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) { let m = isMax ? 0 : 255; for (let k = Math.max(0, y - rr); k <= Math.min(fh - 1, y + rr); k++) { const v = T1[k * fw + x]; if (isMax ? v > m : v < m) m = v; } T2[y * fw + x] = m; } return T2; };
  Lf = filt(filt(Lf, true), false);
  const lc = document.createElement("canvas"); lc.width = fw; lc.height = fh; const lx = lc.getContext("2d"); const li = lx.createImageData(fw, fh); for (let i = 0; i < fw * fh; i++) { li.data[i * 4] = li.data[i * 4 + 1] = li.data[i * 4 + 2] = Lf[i]; li.data[i * 4 + 3] = 255; } lx.putImageData(li, 0, 0);
  const lc2 = document.createElement("canvas"); lc2.width = w; lc2.height = h; const l2 = lc2.getContext("2d"); l2.filter = "blur(" + Math.max(1, rr / 3 / fs).toFixed(1) + "px)"; l2.imageSmoothingEnabled = true; l2.drawImage(lc, 0, 0, w, h); const bf = l2.getImageData(0, 0, w, h).data;
  // 3 ter. balance des blancs globale (une seule correction pour toute la page : les couleurs restent naturelles)
  const ordre = [...Lm.keys()].sort((p, q) => Lm[q] - Lm[p]).slice(0, Math.max(1, Math.round(Lm.length * .4)));
  const moy = A => ordre.reduce((s, j) => s + A[j], 0) / ordre.length; const pr = moy(R), pg = moy(G), pb = moy(Bl), pl = (pr * 77 + pg * 150 + pb * 29) / 256;
  const TB = [pr, pg, pb].map(v => Math.max(.85, Math.min(1.18, pl / Math.max(20, v))));
  // 4. division par le fond + courbe douce (noirs un peu plus profonds, blanc propre)
  const T = new Uint8ClampedArray(256); for (let i = 0; i < 256; i++) { const v = Math.max(0, Math.min(1, (i / 255 - .05) / .80)); T[i] = 255 * Math.pow(v, 1.2); }
  const o = document.createElement("canvas"); o.width = w; o.height = h; const ox = o.getContext("2d"); const out = ox.createImageData(w, h), od = out.data;
  for (let i = 0; i < d.length; i += 4) { const lbk = (b[i] * 77 + b[i + 1] * 150 + b[i + 2] * 29) / 256; const lb = Math.max(bf[i], lbk * .6); const gain = Math.min(3, 255 / Math.max(30, lb));
    // la teinte de la lumière est retirée (fond blanc), sans exagérer
    for (let ch = 0; ch < 3; ch++) { const tint = TB[ch]; od[i + ch] = T[Math.min(255, Math.round(d[i + ch] * gain * tint))]; } od[i + 3] = 255; }
  ox.putImageData(out, 0, 0);
  // 5. netteté (masque flou)
  try { const bl = document.createElement("canvas"); bl.width = w; bl.height = h; const bc = bl.getContext("2d"); bc.filter = "blur(1.2px)"; bc.drawImage(o, 0, 0); const q = bc.getImageData(0, 0, w, h).data; const a = .55;
    for (let i = 0; i < od.length; i += 4) for (let ch = 0; ch < 3; ch++) { const v = od[i + ch] + a * (od[i + ch] - q[i + ch]); od[i + ch] = v; } ox.putImageData(out, 0, 0); } catch (e) { }
  return o; }
/* rendu de la page : « couleur » (factures), « nb » noir et blanc (tickets), « brut » (sans amélioration) */
/* =================== 7 ter. Scanner photo (comme Scanner Mini) : la caméra trouve la pièce en direct, déclenche seule quand c'est stable =================== */
function cameraScan() { return new Promise(async ok => {
  const o = document.createElement("div"); o.className = "cam";
  o.innerHTML = `<canvas class="camQ"></canvas><div class="camH" id="camH">Ouverture de la caméra…</div>
    <div class="camN" id="camN" hidden><p>La caméra intégrée ne s'affiche pas sur ce téléphone.</p><label class="camL">📷 Appareil photo de l'iPhone<input type="file" accept="image/*" capture="environment" id="camF"></label><p class="petit">Après la photo, vous placerez les 4 coins et la pièce sera remise à plat et améliorée, comme un scanner.</p></div>
    <div class="camB"><button type="button" class="camX" id="camX">Annuler</button><button type="button" class="camS" id="camS" aria-label="Prendre la photo"></button><button type="button" class="camA on" id="camA">Auto</button><button type="button" class="camT" id="camT" hidden>⚡</button><label class="camP" id="camP">📷<input type="file" accept="image/*" capture="environment"></label></div>`;
  const v = document.createElement("video"); v.muted = true; v.defaultMuted = true; v.playsInline = true; v.autoplay = true; v.setAttribute("playsinline", ""); v.setAttribute("webkit-playsinline", ""); v.setAttribute("muted", ""); v.setAttribute("autoplay", "");
  o.insertBefore(v, o.firstChild); document.body.appendChild(o);
  const cq = o.querySelector(".camQ"), cx = cq.getContext("2d"), H = o.querySelector("#camH"), N = o.querySelector("#camN");
  let st = null, fini = false, tm = 0, wd = 0, pause = false;
  const stop = () => { fini = true; clearTimeout(tm); clearTimeout(wd); try { st && st.getTracks().forEach(t => t.stop()); } catch (e) { } o.remove(); };
  o.querySelector("#camX").onclick = () => { stop(); ok(false); };
  o.querySelectorAll("input[type=file]").forEach(i => i.onchange = e => { const f = e.target.files && e.target.files[0]; if (!f) return; stop(); ok(f); });
  const secours = msg => { if (fini) return; pause = true; clearTimeout(tm); v.style.display = "none"; cq.style.display = "none"; N.hidden = false; if (msg) N.querySelector("p").textContent = msg; H.textContent = ""; o.querySelector("#camS").hidden = true; o.querySelector("#camA").hidden = true; o.querySelector("#camP").hidden = true; try { st && st.getTracks().forEach(t => t.stop()); } catch (e) { } };
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return secours("La caméra intégrée n'est pas disponible ici.");
  const essais = [{ facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } }, { facingMode: "environment" }, true];
  for (const c of essais) { try { st = await Promise.race([navigator.mediaDevices.getUserMedia({ video: c, audio: false }), new Promise((_, r) => setTimeout(() => r(new Error("delai")), 8000))]); break; } catch (e) { if (e && (e.name === "NotAllowedError" || e.name === "SecurityError" || e.message === "delai")) break; } }
  if (fini) { try { st && st.getTracks().forEach(t => t.stop()); } catch (e) { } return; }
  if (!st) return secours("L'accès à la caméra est refusé ou indisponible. Utilisez l'appareil photo de l'iPhone :");
  v.srcObject = st;
  await new Promise(r => { if (v.readyState >= 1) return r(); v.onloadedmetadata = () => r(); setTimeout(r, 1500); });
  try { await v.play(); } catch (e) { }
  H.textContent = "Cadrez la pièce, posée à plat sur un fond sombre";
  /* garde-fou : si l'image reste noire (bug de certains iPhone en mode application), on propose l'appareil photo natif */
  const noir = () => { try { if (!v.videoWidth) return true; const s = document.createElement("canvas"); s.width = 32; s.height = 32; const x = s.getContext("2d"); x.drawImage(v, 0, 0, 32, 32); const d = x.getImageData(0, 0, 32, 32).data; let m = 0; for (let i = 0; i < d.length; i += 4) m = Math.max(m, d[i], d[i + 1], d[i + 2]); return m < 12; } catch (e) { return false; } };
  let nNoir = 0; const verif = () => { if (fini) return; if (noir()) { if (++nNoir >= 3) return secours(); try { v.play(); } catch (e) { } } else nNoir = 0; if (nNoir || !v.videoWidth) wd = setTimeout(verif, 1000); }; wd = setTimeout(verif, 1500);
  const tr = st.getVideoTracks()[0]; let torche = false; try { const cap = tr.getCapabilities ? tr.getCapabilities() : {}; if (cap.torch) { const b = o.querySelector("#camT"); b.hidden = false; b.onclick = async () => { torche = !torche; try { await tr.applyConstraints({ advanced: [{ torch: torche }] }); b.classList.toggle("on", torche); } catch (e) { } }; } } catch (e) { }
  let auto = lsGet("kcm-camauto", true), Qp = null, stable = 0; const bA = o.querySelector("#camA"); bA.classList.toggle("on", auto); bA.textContent = auto ? "Auto" : "Manuel";
  bA.onclick = () => { auto = !auto; lsSet("kcm-camauto", auto); bA.classList.toggle("on", auto); bA.textContent = auto ? "Auto" : "Manuel"; stable = 0; };
  const zone = () => { const W = o.clientWidth, Hh = o.clientHeight, vw = v.videoWidth || 1, vh = v.videoHeight || 1, k = Math.min(W / vw, Hh / vh); return { x: (W - vw * k) / 2, y: (Hh - vh * k) / 2, w: vw * k, h: vh * k }; };
  const prendreVue = async () => { if (fini || !v.videoWidth) return; const c = document.createElement("canvas"); c.width = v.videoWidth; c.height = v.videoHeight; c.getContext("2d").drawImage(v, 0, 0);
    o.classList.add("flash"); const b = await new Promise(r => c.toBlob(r, "image/jpeg", 0.95)); const q = Qp && stable > 0 ? Qp.map(x => [...x]) : null; stop(); if (!b) return ok(false); const f = new File([b], "scan.jpg", { type: "image/jpeg" }); if (q) f._quad = q; ok(f); };
  o.querySelector("#camS").onclick = prendreVue;
  const boucle = () => { if (fini || pause) return;
    try { if (v.videoWidth) { const z = zone(); cq.width = o.clientWidth; cq.height = o.clientHeight; cx.clearRect(0, 0, cq.width, cq.height);
        const s = document.createElement("canvas"), k = 360 / Math.max(v.videoWidth, v.videoHeight); s.width = Math.round(v.videoWidth * k); s.height = Math.round(v.videoHeight * k); s.getContext("2d").drawImage(v, 0, 0, s.width, s.height);
        const G = gris(s, 360); let Q = null; try { Q = coinsDocument(G); } catch (e) { }
        if (Q) { Q = Q.map(([x, y]) => [x / G.w, y / G.h]); const bouge = Qp ? Math.max(...Q.map((q, i) => Math.hypot(q[0] - Qp[i][0], q[1] - Qp[i][1]))) : 1; stable = bouge < .02 ? stable + 1 : 0; Qp = Q;
          cx.fillStyle = "rgba(46,160,67,.22)"; cx.strokeStyle = stable > 2 ? "#2ea043" : "#f0b357"; cx.lineWidth = 4; cx.beginPath(); Q.forEach(([x, y], i) => { const px = z.x + x * z.w, py = z.y + y * z.h; i ? cx.lineTo(px, py) : cx.moveTo(px, py); }); cx.closePath(); cx.fill(); cx.stroke();
          H.textContent = auto ? (stable > 2 ? "Ne bougez plus…" : "Pièce trouvée : tenez le téléphone immobile") : "Pièce trouvée : touchez le bouton rond";
          if (auto && stable >= 5) return prendreVue(); }
        else { stable = 0; Qp = null; H.textContent = "Cadrez toute la pièce (fond plus foncé que le papier) — ou touchez le bouton rond"; } } } catch (e) { }
    tm = setTimeout(boucle, 220); };
  boucle();
}); }
async function choisirFiltre(m) { if (!cour || cour.existant) return; cour.modeManuel = true; for (const p of cour.pages) if (!p.pdf) await appliquerMode(p, m); dessinerPhoto();
  toast({ couleur: "Filtre couleur", gris: "Filtre niveaux de gris", nb: "Filtre noir et blanc (écriture renforcée)", brut: "Photo d'origine, sans retouche" }[m] || ""); }
async function appliquerMode(p, mode) { if (!p.plat) p.plat = p.canvas; let c = p.plat; try { c = mode === "nb" ? renforcer(p.plat) : mode === "couleur" ? ameliorerCouleur(p.plat) : mode === "gris" ? enGris(ameliorerCouleur(p.plat)) : p.plat; } catch (e) { c = p.plat; } p.mode = mode; await majPage(p, c); }
const modeType = () => "couleur"; // vrai scan couleur pour toutes les pièces (noir et blanc au choix dans le filtre)
function enGris(c) { const x = c.getContext("2d"), im = x.getImageData(0, 0, c.width, c.height), d = im.data; for (let i = 0; i < d.length; i += 4) { const g = (d[i] * 299 + d[i + 1] * 587 + d[i + 2] * 114) / 1000; d[i] = d[i + 1] = d[i + 2] = g; } x.putImageData(im, 0, 0); return c; }
async function appliquerType() { if (!cour || cour.existant || cour.modeManuel) return; const m = modeType(); let n = 0; for (const p of cour.pages) if (!p.pdf && p.plat && p.mode !== m) { await appliquerMode(p, m); n++; } if (n) dessinerPhoto(); }
async function ameliorerEcriture() { if (!cour || cour.existant) return; const P = cour.pages.filter(p => !p.pdf); if (!P.length) return toast("Un PDF ne s'améliore pas");
  const m = P.some(p => p.mode === "nb") ? "couleur" : "nb"; cour.modeManuel = true; for (const p of P) await appliquerMode(p, m); dessinerPhoto();
  toast(m === "nb" ? "Pièce en noir et blanc (écriture renforcée)" : "Pièce en couleur, améliorée"); }
async function redresser() { if (!cour || cour.existant) return; const P = cour.pages.filter(p => !p.pdf); if (!P.length) return toast("Un PDF ne se redresse pas");
  toast("Redressement…", 1200); let n = 0; for (const p of P) { const base = p.plat || p.canvas; const a = angleInclinaison(base); if (Math.abs(a) < 0.3) continue; let r = tournerAngle(base, -a); const bx = cadre(gris(r, 480)); if (bx) r = rogner(r, bx); p.plat = r; await appliquerMode(p, p.mode || "couleur"); n++; }
  if (!n) return toast("La photo est déjà droite : pour la remettre à plat, touchez « Coins »"); dessinerPhoto(); toast("Photo redressée : la pièce est relue"); lire(); }
/* ajuster soi-même les 4 coins de la pièce (comme un scanner) : la pièce est remise à plat et redressée d'après ces coins */
function ajusterCoins(k = 0, { nouveau } = {}) { return new Promise(async fin => {
  if (!cour || cour.existant) return fin(); const p = cour.pages[k]; if (!p || p.pdf) return fin();
  let src; try { src = (await chargerCanvas(p.orig || p.blob, 2400)).c; } catch (e) { return fin(); }
  const detecter = () => { const G = gris(src, 480); let q = null; try { q = coinsDocument(G); } catch (e) { } if (q) return q.map(([x, y]) => [x / G.w, y / G.h]); const b = cadre(G); const r = b || { x: .06, y: .06, w: .88, h: .88 }; return [[r.x, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h]]; };
  let Q = p.quad ? p.quad.map(a => [...a]) : detecter();
  const o = document.createElement("div"); o.className = "cut coins";
  o.innerHTML = `<div class="h"><b>Placez les 4 coins sur les bords de la pièce</b><button class="btn sm" id="cRot">⟳</button><button class="btn sm" id="cAuto">Auto</button><button class="btn sm" id="cTout">Tout</button><button class="btn sm" id="cAnn">${nouveau ? "Garder ainsi" : "Annuler"}</button><button class="btn sm primary" id="cOk">✓ Valider</button></div>
    <div class="z"><div class="zi"><img alt=""><svg viewBox="0 0 1000 1000" preserveAspectRatio="none"><polygon></polygon></svg>${[0, 1, 2, 3].map(i => `<i data-k="${i}"></i>`).join("")}</div></div><canvas class="loupe" width="130" height="130" hidden></canvas>
    <p class="vis-a">Faites glisser chaque rond jusqu'au coin de la pièce (la loupe aide à viser). « Valider » remet la pièce à plat et droite, même photographiée en biais.</p>`;
  document.body.appendChild(o); const zi = o.querySelector(".zi"), img = zi.querySelector("img"), poly = zi.querySelector("polygon"), H = [...zi.querySelectorAll("i")], lp = o.querySelector(".loupe"), lx = lp.getContext("2d");
  const dess = () => { poly.setAttribute("points", Q.map(([x, y]) => `${x * 1000},${y * 1000}`).join(" ")); H.forEach((h, i) => { h.style.left = Q[i][0] * 100 + "%"; h.style.top = Q[i][1] * 100 + "%"; }); };
  const montrer = () => { img.src = src.toDataURL("image/jpeg", 0.85); dess(); }; montrer();
  const loupe = (x, y) => { lp.hidden = false; const z = 3, s = 130 / z; lx.fillStyle = "#000"; lx.fillRect(0, 0, 130, 130); lx.drawImage(src, x * src.width - s / 2 * src.width / img.clientWidth, y * src.height - s / 2 * src.height / img.clientHeight, s * src.width / img.clientWidth, s * src.height / img.clientHeight, 0, 0, 130, 130); lx.strokeStyle = "#f0b357"; lx.lineWidth = 2; lx.beginPath(); lx.moveTo(65, 0); lx.lineTo(65, 130); lx.moveTo(0, 65); lx.lineTo(130, 65); lx.stroke(); };
  let g = null;
  const pt = e => { const t = e.touches ? (e.touches[0] || e.changedTouches[0]) : e; return { x: t.clientX, y: t.clientY }; };
  const debut = e => { const h = e.target.closest && e.target.closest("[data-k]"); if (!h) return; if (e.cancelable) e.preventDefault(); const q = pt(e); g = { k: +h.dataset.k, r: zi.getBoundingClientRect(), x: q.x, y: q.y, P0: [...Q[+h.dataset.k]] }; h.classList.add("on"); loupe(...Q[g.k]); };
  const bouge = e => { if (!g) return; if (e.cancelable) e.preventDefault(); const q = pt(e); Q[g.k] = [Math.max(0, Math.min(1, g.P0[0] + (q.x - g.x) / g.r.width)), Math.max(0, Math.min(1, g.P0[1] + (q.y - g.y) / g.r.height))]; dess(); loupe(...Q[g.k]); };
  const finD = () => { if (!g) return; H[g.k].classList.remove("on"); g = null; lp.hidden = true; };
  zi.addEventListener("touchstart", debut, { passive: false }); zi.addEventListener("mousedown", debut);
  o.addEventListener("touchmove", bouge, { passive: false }); o.addEventListener("mousemove", bouge);
  o.addEventListener("touchend", finD); o.addEventListener("touchcancel", finD); o.addEventListener("mouseup", finD);
  const fermer = () => { o.remove(); fin(); };
  o.querySelector("#cAnn").onclick = fermer;
  o.querySelector("#cAuto").onclick = () => { Q = detecter(); dess(); };
  o.querySelector("#cTout").onclick = () => { Q = [[0, 0], [1, 0], [1, 1], [0, 1]]; dess(); };
  o.querySelector("#cRot").onclick = () => { src = tourner(src, 90); Q = Q.map(([x, y]) => [1 - y, x]); Q = [Q[3], Q[0], Q[1], Q[2]]; montrer(); };
  o.querySelector("#cOk").onclick = async () => { const b = o.querySelector("#cOk"); b.disabled = true; b.textContent = "…";
    // remet les coins dans l'ordre haut-gauche, haut-droit, bas-droit, bas-gauche, même s'ils ont été croisés
    const cx = Q.reduce((s, q) => s + q[0], 0) / 4, cy = Q.reduce((s, q) => s + q[1], 0) / 4; let R = [...Q].sort((a, c) => Math.atan2(a[1] - cy, a[0] - cx) - Math.atan2(c[1] - cy, c[0] - cx)); let i0 = 0; R.forEach((q, i) => { if (q[0] + q[1] < R[i0][0] + R[i0][1]) i0 = i; }); R = [0, 1, 2, 3].map(i => R[(i0 + i) % 4]);
    let t = null; try { t = remettreAPlat(src, R.map(([x, y]) => [x * src.width, y * src.height])); } catch (e) { t = null; } if (!t) t = src;
    p.orig = await enBlob(src); if (p.origUrl) { URL.revokeObjectURL(p.origUrl); p.origUrl = ""; } p.quad = R; p.plat = ameliorer(t); p.recadre = p.aplat = true;
    await appliquerMode(p, p.mode || (nouveau ? "couleur" : modeType()));
    o.remove(); dessinerPhoto(); if (!nouveau) { toast("Pièce remise à plat : elle est relue"); lire(); } fin(); };
}); }



/* aperçu des PDF : les pages sont dessinées en images (pdf.js), pour les voir et les agrandir */
let pdfjsP = null;
function chargerPdfJs() { if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib); if (!pdfjsP) pdfjsP = new Promise((ok, ko) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"; s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"; ok(window.pdfjsLib); }; s.onerror = () => { pdfjsP = null; ko(new Error("aperçu PDF indisponible")); }; document.head.appendChild(s); }); return pdfjsP; }
async function pagesPdf(blob, max = 6) { const lib = await chargerPdfJs(); const doc = await lib.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise; const urls = [];
  for (let i = 1; i <= Math.min(doc.numPages, max); i++) { const pg = await doc.getPage(i); const v0 = pg.getViewport({ scale: 1 }); const v = pg.getViewport({ scale: 1600 / Math.max(v0.width, v0.height) }); const c = document.createElement("canvas"); c.width = Math.round(v.width); c.height = Math.round(v.height); const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height); await pg.render({ canvasContext: x, viewport: v }).promise; urls.push(c.toDataURL("image/jpeg", 0.85)); }
  return urls; }
async function traiterFichier(f) { if (f.type === "application/pdf" || /\.pdf$/i.test(f.name || "")) { if (f.size > 15e6) throw new Error("PDF trop lourd (15 Mo au maximum)"); const b = f.type ? f : new Blob([f], { type: "application/pdf" }); const o = { pdf: true, blob: b, orig: b, url: "", hash: "", recadre: false, pb: [], apercus: [] }; try { o.apercus = await Promise.race([pagesPdf(b), new Promise(r => setTimeout(() => r([]), 9000))]); } catch (e) { } return o; } return traiterPhoto(f); }

/* =================== 8. Fiche d'une dépense =================== */
let cour = null, lectureId = 0, ajoutPage = false, fileQueue = [];
const imagesMax = 5;
const autres = () => tickets.filter(t => !cour || t.id !== cour.id);
function choisirCategorie(c) { const n = normTxt(c); const L = C.CATEGORIES; const t = L.find(x => normTxt(x) === n) || L.find(x => n && (normTxt(x).includes(n) || n.includes(normTxt(x)))); if (t) $("#fCat").value = t; }
function montrerFiche(titre) {
  const m = $("#main"); m.innerHTML = ""; m.appendChild($("#tplFiche").content.cloneNode(true)); $("#ficheTitre").textContent = titre; window.scrollTo(0, 0);
  $("#fCat").innerHTML = `<option value="">— Choisir —</option>` + C.CATEGORIES.map(c => `<option>${esc(c)}</option>`).join("");
  $("#payeur").onclick = e => { const b = e.target.closest("[data-p]"); if (!b || !cour) return; cour.payeur = b.dataset.p; cour.societe = estSociete(b.dataset.p); if (b.dataset.p === "Virement") { const fp = $("#fPaie"); if (fp) fp.value = "virement"; } lsSet("kcm-payeur", b.dataset.p); dessinerPayeur(); };
  $("#reprendre").onclick = () => { if (!cour || cour.existant) return; choisirFichiers("image/*,application/pdf", false, f => { lectureId++; if (cour) cour.pages.forEach(p => p.url && URL.revokeObjectURL(p.url)); cour = null; prendre(f); }); };
  $("#ajPage").onclick = () => { if (!cour || cour.existant) return; if (cour.pages.length >= imagesMax) return toast(`${imagesMax} pages au maximum par pièce`); choisirFichiers("image/*,application/pdf", true, f => { ajoutPage = true; prendre(f); }); };
  $("#apercu").onclick = () => ouvrirVisionneuse(cour ? cour.vue || 0 : 0); $("#apercuPdf").onclick = () => ouvrirVisionneuse(cour ? cour.vue || 0 : 0);
  $("#pvPrec").onclick = e => { e.stopPropagation(); allerPage(-1); }; $("#pvSuiv").onclick = e => { e.stopPropagation(); allerPage(1); };
  $("#pages").onclick = e => { const x = e.target.closest("[data-suppg]"); if (x) { e.stopPropagation(); return supprimerPage(+x.dataset.suppg); } const t = e.target.closest("[data-pg]"); if (t && cour) { cour.vue = +t.dataset.pg; cour.voirOrig = false; dessinerPhoto(); } };
  { let sx = null; const pvz = $(".pv"); pvz.addEventListener("touchstart", e => { sx = e.touches.length === 1 ? e.touches[0].clientX : null; }, { passive: true }); pvz.addEventListener("touchend", e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) allerPage(dx < 0 ? 1 : -1); }); }
  $("#rogner").onclick = () => ajusterCoins(cour ? cour.vue || 0 : 0); if ($("#fType")) $("#fType").addEventListener("change", appliquerType); $("#redresser").onclick = redresser; $("#contraste").onchange = e => choisirFiltre(e.target.value);
  $("#voirOrig").onclick = () => { if (!cour || cour.existant) return; cour.voirOrig = !cour.voirOrig; dessinerPhoto(); };
  if ($("#decouper")) $("#decouper").onclick = () => { if (!cour || cour.existant) return; const p0 = cour.pages[0]; if (!p0 || p0.pdf) return toast("Le découpage marche sur une photo, pas sur un PDF"); decouper(p0); };
  $("#fiche").addEventListener("input", e => { if (!cour) return; const k = Object.keys(CHAMPS).find(k => CHAMPS[k][0] === "#" + e.target.id); if (k) (cour.conflits || []).filter(c => c.k === k).forEach(c => c.par = "vous"); if (e.target.id === "fDate") cour.dateOk = true; verifier(); });
  $("#fiche").addEventListener("change", () => { if (cour) verifier(); });
  $("#verif").addEventListener("click", e => { const b = e.target.closest("[data-conf]"); if (!b || !cour) return; const c = cour.conflits[+b.dataset.conf]; if (!c) return; const v = JSON.parse(b.dataset.v); pose(c.k, v); c.choisi = v; c.par = "vous"; if (c.k === "date") cour.dateOk = true; verifier(); });
  $("#annuler").onclick = () => { if (cour && cour.pages) cour.pages.forEach(p => p.url && URL.revokeObjectURL(p.url)); cour = null; lectureId++; fileQueue = []; rendre(); };
  $("#enregistrer").onclick = enregistrer;
}
const PAYE_AVEC = (window.KCM && KCM.PAYE_AVEC) || [];
const estSociete = p => p === "societe" || p === "Virement" || /^cabinet/i.test(p || "");
const payeAvec = p => !p || p === "moi" ? null : p === "societe" ? "Carte de la société" : p;
const prenomDe = p => { const n = String((p && (p.nom || (p.email || "").split("@")[0])) || "").trim().split(/[\s._-]+/)[0] || ""; return n ? n.charAt(0).toUpperCase() + n.slice(1).toLowerCase() : ""; };
// Chacun choisit entre son dossier « Cabinet » et son dossier « Perso » (ex. Cabinet Stéphanie / Stéphanie perso)
const ADMIN = "Administratif cabinet"; // papiers administratifs (impôts, URSSAF…) : pas une dépense, rangés à part dans Kabylos
const estAdmin = d => (d && d.dossier || "") === ADMIN;
const mesDossiers = () => { const n = prenomDe(moi); const L = n ? [["Cabinet " + n, "Cabinet"], [n + " perso", "Perso"]] : ((window.KCM && KCM.DOSSIERS) || []).map(x => [x, x]); return L.some(x => x[0] === ADMIN) ? L : L.concat([[ADMIN, "🏛 Administratif cabinet"]]); };
const DOSSIERS = { get length() { return mesDossiers().length; } };
let filtreDossier = lsGet("kcm-filtre-dossier", "");
const dansFiltre = d => !filtreDossier || (d.dossier || "") === filtreDossier;
const persoDe = d => !d.paye_par_societe && !d.paye_avec && !/perso/i.test(d.dossier || "") && !estAdmin(d);
function dessinerDossier() { const z = $("#dossier"); if (!z) return; const L = mesDossiers(); if (cour.dossier && !L.some(x => x[0] === cour.dossier)) L.push([cour.dossier, cour.dossier]); if (!z.children.length) z.innerHTML = L.map(([v, l]) => `<button type="button" data-ds="${esc(v)}">${esc(l)}</button>`).join("");
  z.querySelectorAll("[data-ds]").forEach(b => b.classList.toggle("on", b.dataset.ds === cour.dossier));
  z.onclick = e => { const b = e.target.closest("[data-ds]"); if (!b || !cour) return; cour.dossier = b.dataset.ds; lsSet("kcm-dossier", cour.dossier); dessinerDossier(); }; }
function dessinerPayeur() { const z = $("#payeur"); if (!z) return; const n = prenomDe(moi);
  const L = [["Virement", "Virement"], ["societe", "Carte<br>société"], ...(n ? [["Carte perso " + n, "Carte<br>perso"]] : PAYE_AVEC.map(x => [x, x])), ["Autre", "Autre"]];
  if (cour.payeur && !["moi", ...L.map(x => x[0])].includes(cour.payeur)) L.push([cour.payeur, cour.payeur]);
  if (!z.dataset.ok) { z.dataset.ok = "1"; z.className = "payeur"; z.innerHTML = `<button type="button" data-p="moi" class="pMoi">Mon argent / avance</button><div class="pLigne">${L.map(([v, l]) => `<button type="button" data-p="${esc(v)}">${esc(l).replace(/&lt;br&gt;/g, "<br>")}</button>`).join("")}</div>`; }
  const cur = cour.payeur || (cour.societe ? "societe" : "moi"); z.querySelectorAll("[data-p]").forEach(b => b.classList.toggle("on", b.dataset.p === cur)); }
async function prendre(files) { if (ajoutPage && cour) { ajoutPage = false; for (const f of files) await ajouterPage(f); return; } fileQueue.push(...files); if (!cour) suivant(); }
/* juste après le scan : la pièce scannée s'affiche, on la valide d'un geste (ou on ajuste les coins / on reprend) */
function validerScan(k) { return new Promise(fin => {
  const p = cour && cour.pages[k]; if (!p || p.pdf) return fin("ok");
  const o = document.createElement("div"); o.className = "cut valscan";
  o.innerHTML = `<div class="vz"><img alt="Pièce scannée" src="${p.url}"></div>
    <div class="vb"><button type="button" class="btn" id="vRep">↺ Reprendre</button><button type="button" class="btn" id="vCoins">◰ Coins</button><button type="button" class="btn primary vOk" id="vOk">✓ Valider</button></div>`;
  document.body.appendChild(o); const fini = r => { o.remove(); fin(r); };
  o.querySelector("#vOk").onclick = () => fini("ok"); o.querySelector("#vRep").onclick = () => fini("reprendre"); o.querySelector("#vCoins").onclick = () => fini("coins"); }); }
async function apresScan(k) { // renvoie false si la photo est à reprendre
  for (;;) { const r = await validerScan(k); if (r === "ok") return true; if (r === "reprendre") return false; await ajusterCoins(k, { nouveau: true }); } }
async function suivant() {
  const f = fileQueue.shift(); if (!f) return;
  try { toast("Scan de la pièce : mise à plat et amélioration…", 1500); const p = await traiterFichier(f); if (!p.pdf) p.url = URL.createObjectURL(p.blob);
    cour = { id: uuid(), pages: [p], dossier: (mesDossiers().some(x => x[0] === lsGet("kcm-dossier", "")) ? lsGet("kcm-dossier", "") : (mesDossiers()[0] || [""])[0]), payeur: lsGet("kcm-payeur", "moi"), societe: estSociete(lsGet("kcm-payeur", "moi")) }; montrerFiche("Nouvelle dépense"); ouvrirFiche();
    if (!p.pdf && !(await apresScan(0))) { const vu = !!f._quad; cour.pages.forEach(x => x.url && URL.revokeObjectURL(x.url)); cour = null; lectureId++; rendre(); if (vu) setTimeout(scannerDirect, 50); else toast("Photo annulée : reprenez-la"); return suivant(); }
    lire(); }
  catch (e) { toast(e.message || "Photo illisible"); suivant(); }
}
async function ajouterPage(f) { try { const p = await traiterFichier(f); if (!p.pdf) p.url = URL.createObjectURL(p.blob); cour.pages.push(p); cour.vue = cour.pages.length - 1; dessinerPhoto(); if (!p.pdf && !(await apresScan(cour.vue))) { cour.pages.pop(); cour.vue = cour.pages.length - 1; dessinerPhoto(); return toast("Page annulée"); } lire(); toast(`Page ${cour.pages.length} ajoutée : la pièce est relue en entier`); } catch (e) { toast(e.message || "Photo illisible"); } }
function pageVue() { if (!cour || !cour.pages.length) return null; cour.vue = Math.max(0, Math.min(cour.pages.length - 1, cour.vue || 0)); return cour.pages[cour.vue]; }
let pdfUrlPv = "";
function dessinerPhoto() { const pc = pageVue(); if (!pc) return; const p0 = cour.pages[0]; const n = cour.pages.length;
  $("#rogner").hidden = !!(cour.existant || pc.pdf); $("#redresser").hidden = $("#contraste").hidden = !!(cour.existant || cour.pages.every(p => p.pdf)); $("#contraste").value = (pc && pc.mode) || "couleur";
  if (cour.existant) { $("#apercuPdf").hidden = true; $("#apercu").hidden = false; $("#pages").innerHTML = ""; $("#qualite").innerHTML = ""; ["#reprendre", "#ajPage", "#voirOrig", "#pvPrec", "#pvSuiv", "#pvNum"].forEach(s => { const e = $(s); if (e) e.hidden = true; }); return; }
  const pdfImg = pc.pdf && pc.apercus && pc.apercus[0]; const ap = $("#apercu"), bx = $("#apercuPdf");
  bx.hidden = !pc.pdf || !!pdfImg; ap.hidden = !!pc.pdf && !pdfImg;
  if (pc.pdf && !pdfImg) { if (pdfUrlPv) URL.revokeObjectURL(pdfUrlPv); pdfUrlPv = URL.createObjectURL(pc.blob); bx.innerHTML = `<iframe src="${pdfUrlPv}" title="PDF" style="width:100%;height:100%;border:0;pointer-events:none;background:#fff"></iframe><span class="pdfTag">PDF · touchez pour ouvrir</span>`; }
  if (pdfImg) ap.src = pdfImg; if (!pc.pdf) ap.src = cour.voirOrig ? (pc.origUrl || (pc.origUrl = URL.createObjectURL(pc.orig))) : pc.url;
  $("#voirOrig").textContent = cour.voirOrig ? "Améliorée" : "Original"; $("#voirOrig").hidden = !!pc.pdf;
  $("#pvPrec").hidden = $("#pvSuiv").hidden = n < 2; $("#pvNum").hidden = n < 2; $("#pvNum").textContent = `Page ${cour.vue + 1} / ${n}`;
  $("#pages").innerHTML = n > 1 ? cour.pages.map((p, i) => `<div class="thp ${i === cour.vue ? "on" : ""}" data-pg="${i}">${p.pdf ? (p.apercus && p.apercus[0] ? `<img src="${p.apercus[0]}" alt="">` : `<b>PDF</b>`) : `<img src="${p.url}" alt="">`}<span class="nb">${i + 1}</span><button type="button" class="x" data-suppg="${i}" aria-label="Supprimer la page ${i + 1}">✕</button></div>`).join("") : "";
  const pb = cour.pages.flatMap((p, i) => p.pb.map(([c, t]) => [c, (n > 1 ? `Page ${i + 1} : ` : "") + t])); const nb = pb.filter(x => x[0] === "bad").length;
  $("#qualite").innerHTML = pc.pdf ? `<div class="qual ok"><span>✓ PDF reçu</span></div>` : pb.length ? `<div class="qual ${nb ? "bad" : "warn"}">${pb.map(x => `<span>${x[0] === "bad" ? "✕" : "!"} ${esc(x[1])}</span>`).join("")}</div>` : `<div class="qual ok"><span>✓ Pièce scannée${p0.aplat ? " : remise à plat, redressée" : p0.recadre ? " : recadrée" : ""}${{ nb: " · noir et blanc (ticket)", couleur: " · améliorée en couleur", gris: " · niveaux de gris", brut: " · photo d'origine" }[p0.mode] || ""}</span></div>`; }
function allerPage(d) { if (!cour || cour.pages.length < 2) return; cour.vue = (cour.vue + d + cour.pages.length) % cour.pages.length; cour.voirOrig = false; dessinerPhoto(); }
function supprimerPage(i) { if (!cour || cour.existant) return; const n = cour.pages.length; if (!window.confirm(n > 1 ? `Supprimer la page ${i + 1} sur ${n} ? Les autres pages sont gardées.` : "Supprimer cette photo ? La dépense en cours sera annulée.")) return;
  const [p] = cour.pages.splice(i, 1); if (p && p.url) URL.revokeObjectURL(p.url);
  if (!cour.pages.length) { lectureId++; cour = null; toast("Photo supprimée"); return rendre(); }
  if (cour.vue >= cour.pages.length) cour.vue = cour.pages.length - 1; dessinerPhoto(); toast(`Page supprimée : il reste ${cour.pages.length} page(s), la pièce est relue`); lire(); }
async function enregistrerFichier(blob, nom) { const f = new File([blob], nom, { type: blob.type || "application/octet-stream" });
  try { if (navigator.canShare && navigator.canShare({ files: [f] })) { await navigator.share({ files: [f], title: nom }); return; } } catch (e) { if (e && e.name === "AbortError") return; }
  const u = URL.createObjectURL(f); const a = document.createElement("a"); a.href = u; a.download = nom; a.target = "_blank"; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 60000); }
function ouvrirFiche() {
  $("#ficheN").textContent = fileQueue.length ? `· encore ${fileQueue.length} photo(s)` : "";
  Object.assign(cour, { dateOk: false, lignes: null, doutes: [], adresse: "", conflits: [], nature: "", lu: false, forcer: false });
  $("#fDate").value = today(); dessinerPhoto(); dessinerLignes(); verifier(); dessinerPayeur(); dessinerDossier(); }
async function ouvrirFicheExistante(d, loc) {
  const modifiable = d._local || ["brouillon", "soumis", "refuse"].includes(d.statut) || (moi.role === "admin" && d.statut !== "importe");
  cour = { id: d.id, existant: d, pages: [], dossier: d.dossier || "", societe: !!d.paye_par_societe, payeur: d.paye_avec && d.paye_avec !== "Carte de la société" ? d.paye_avec : (d.paye_par_societe ? "societe" : "moi"), dateOk: true, lignes: d.lignes || null, doutes: [], adresse: d.adresse || "", conflits: [], nature: d.nature || "", lu: true, local: loc || null };
  montrerFiche(d.user_id === session.user.id ? "Ma dépense" : "Dépense de " + nomDe(d.user_id));
  const v = { "#fFour": d.fournisseur, "#fDate": d.date, "#fType": d.type, "#fHt": d.ht === null ? "" : nf(d.ht), "#fTva": d.tva === null ? "" : nf(d.tva), "#fTtc": d.ttc === null ? "" : nf(d.ttc), "#fNum": d.numero, "#fClient": d.client, "#fSiret": d.siret, "#fTvaI": d.tva_intra, "#fPaie": d.paiement || "", "#fNote": d.note }; Object.entries(v).forEach(([k, x]) => { $(k).value = x ?? ""; });
  choisirCategorie(d.categorie || ""); $("#fAdrBox").hidden = !d.adresse; $("#fAdr").textContent = d.adresse || "";
  dessinerPhoto(); dessinerLignes(); dessinerPayeur(); dessinerDossier(); verifier();
  const [c, l] = STATUTS[d._local ? "local" : d.statut] || STATUTS.soumis; $("#lecture").innerHTML = `<span class="pill ${c}">${l}</span>${d.motif_refus && d.statut === "refuse" ? ` <span style="color:var(--accent)">${esc(d.motif_refus)}</span>` : ""}`;
  if (loc && loc.blobs && loc.blobs[0] && loc.blobs[0].type !== "application/pdf") $("#apercu").src = URL.createObjectURL(loc.blobs[0]); else if ((d.photos || [])[0]) { if (/\.pdf$/.test(d.photos[0])) { $("#apercu").hidden = true; $("#apercuPdf").hidden = false; try { const r = await fetch(await urlPhoto(d.photos[0])); const u = await pagesPdf(await r.blob(), 1); if (u[0] && cour && cour.id === d.id) { $("#apercu").src = u[0]; $("#apercu").hidden = false; $("#apercuPdf").hidden = true; } } catch (e) { } } else $("#apercu").src = await urlPhoto(d.photos[0]); }
  if ((d.photos || []).length) { const pv = $(".pv"); const a = document.createElement("button"); a.type = "button"; a.className = "btn sm"; a.textContent = d.photos.length > 1 ? `Voir les ${d.photos.length} pages` : "Voir en grand"; a.onclick = () => voirPieces(d); pv.appendChild(a); }
  if (!modifiable) { document.querySelectorAll("#fiche input,#fiche select").forEach(i => i.disabled = true); $("#payeur").style.pointerEvents = "none"; $("#dossier").style.pointerEvents = "none"; $("#enregistrer").hidden = true; $("#annuler").textContent = "Retour"; }
  else { $("#enregistrer").textContent = d.statut === "refuse" ? "Corriger et renvoyer" : "Enregistrer les modifications";
  }
  if (d.user_id === session.user.id || d._local) { const s = document.createElement("button"); s.type = "button"; s.className = "btn ghost"; s.style.color = "var(--accent)"; s.textContent = modifiable ? "Supprimer" : "Retirer du téléphone"; s.onclick = () => supprimerDepense(d); $("#fiche .row2").appendChild(s); }
}
async function voirPieces(d) { const s = document.createElement("div"); s.className = "sheet"; s.innerHTML = `<div class="in"><h2>${esc(d.fournisseur || "Pièce")}</h2><div id="vp" style="display:flex;flex-direction:column;gap:10px"><div class="read"><span class="spin"></span>Chargement…</div></div><button class="btn" id="vpF">Fermer</button></div>`; document.body.appendChild(s); s.querySelector("#vpF").onclick = () => s.remove(); s.onclick = e => { if (e.target === s) s.remove(); };
  const h = []; for (const ch of d.photos || []) { const u = await urlPhoto(ch); h.push(/\.pdf$/.test(ch) ? `<a class="btn" href="${esc(u)}" target="_blank" rel="noopener">Ouvrir le PDF</a>` : `<img class="photoGrande" src="${esc(u)}" alt="">`); } s.querySelector("#vp").innerHTML = h.join("") || `<div class="empty">Pas de photo.</div>`; }
const masques = () => lsGet("kcm-masques-" + (session && session.user.id), []);
async function supprimerDepense(d) { if (!d._local && !["brouillon", "soumis", "refuse"].includes(d.statut)) { if (!confirmer(`Retirer cette dépense${d.ttc ? " de " + eur(d.ttc) : ""} du téléphone ?\n\n${d.statut === "importe" ? "Elle est déjà dans Kabylos Compta sur l'ordinateur : elle y reste." : "Elle reste enregistrée et validée pour la comptabilité."}`)) return; lsSet("kcm-masques-" + session.user.id, [...masques(), d.id]); toast("Dépense retirée du téléphone"); cour = null; rendre(); return; }
  return supprimerDepense0(d); }
async function supprimerDepense0(d) { if (!confirmer(`Supprimer cette dépense${d.ttc ? " de " + eur(d.ttc) : ""} ?`)) return;
  try { if (d._local) { await IDB.retirer(d.id); await chargerAttente(); } else { const { error } = await sb.from("depenses").delete().eq("id", d.id); if (error) throw error; if ((d.photos || []).length) await sb.storage.from("pieces").remove([...(d.photos || []), ...(d.originaux || [])]); }
    toast("Dépense supprimée"); cour = null; await chargerDonnees(); rendre(); } catch (e) { toast("Suppression impossible : " + (e.message || "erreur")); } }
function confirmer(msg) { return window.confirm(msg); }

/* une feuille avec plusieurs tickets : tracer un rectangle autour de chacun */
/* =================== 8 ter. Redresser la photo et renforcer l'écriture =================== */
function angleInclinaison(c) { // cherche l'angle (-15° à +15°) qui aligne le mieux les lignes de texte
  const W = 360, q = W / Math.max(c.width, c.height), w = Math.max(40, Math.round(c.width * q)), h = Math.max(40, Math.round(c.height * q));
  const s = document.createElement("canvas"); s.width = w; s.height = h; const x = s.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); x.drawImage(c, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data; const g = new Uint8Array(w * h); for (let i = 0, j = 0; i < g.length; i++, j += 4) g[i] = (d[j] * 299 + d[j + 1] * 587 + d[j + 2] * 114) / 1000;
  const t = otsu(g); const pts = []; // seulement les traits d'écriture : petits segments sombres entourés de clair (pas les bords noirs)
  for (let y = 0; y < h; y++) { let x0 = -1; for (let xx = 0; xx <= w; xx++) { const sombre = xx < w && g[y * w + xx] < t; if (sombre && x0 < 0) x0 = xx; else if (!sombre && x0 >= 0) { if (x0 > 0 && xx < w && xx - x0 <= 8) for (let k = x0; k < xx; k++) pts.push(k - w / 2, y - h / 2); x0 = -1; } } }
  if (pts.length < 50) return 0;
  const score = a => { const r = a * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r); const H = new Float32Array(h * 2 + 4); for (let i = 0; i < pts.length; i += 2) { const yy = Math.round(-pts[i] * sn + pts[i + 1] * cs + h); if (yy >= 0 && yy < H.length) H[yy]++; } let v = 0; for (let i = 1; i < H.length; i++) { const e = H[i] - H[i - 1]; v += e * e; } return v; };
  let best = 0, bs = -1; for (let a = -15; a <= 15; a += 1) { const v = score(a); if (v > bs) { bs = v; best = a; } }
  for (let a = best - 1; a <= best + 1; a += 0.2) { const v = score(a); if (v > bs) { bs = v; best = a; } }
  return Math.round(best * 10) / 10; }
function tournerAngle(c, deg) { const r = deg * Math.PI / 180, cs = Math.abs(Math.cos(r)), sn = Math.abs(Math.sin(r)); const o = document.createElement("canvas"); o.width = Math.round(c.width * cs + c.height * sn); o.height = Math.round(c.width * sn + c.height * cs); const x = o.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, o.width, o.height); x.translate(o.width / 2, o.height / 2); x.rotate(r); x.drawImage(c, -c.width / 2, -c.height / 2); return o; }
function renforcer(c) { // noir et blanc net : fond blanc, écriture bien noire (à partir du scan couleur, sans taches)
  const o = ameliorerCouleur(c), x = o.getContext("2d"), im = x.getImageData(0, 0, o.width, o.height), d = im.data;
  const T = new Uint8ClampedArray(256); for (let i = 0; i < 256; i++) { const v = i / 255; T[i] = v > .86 ? 255 : 255 * Math.pow(Math.max(0, (v - .1) / .76), 1.5); }
  for (let i = 0; i < d.length; i += 4) { const g = T[(d[i] * 77 + d[i + 1] * 150 + d[i + 2] * 29) >> 8]; d[i] = d[i + 1] = d[i + 2] = g; } x.putImageData(im, 0, 0); return o; }
async function majPage(p, c) { p.canvas = c; p.blob = await enBlob(c); if (p.url) URL.revokeObjectURL(p.url); p.url = URL.createObjectURL(p.blob); p.hash = empreinte(c); cour.voirOrig = false; }


/* =================== 8 bis. Agrandir la photo, la rogner, la pivoter =================== */
function ouvrirVisionneuse(k = 0) {
  if (!cour) return; if (cour.existant) return voirPieces(cour.existant);
  const p = cour.pages[k]; if (!p) return; cour.vue = k; const srcs = p.pdf ? (p.apercus || []) : [p.url]; const pdfU = p.pdf && !srcs.length ? URL.createObjectURL(p.blob) : "";
  const o = document.createElement("div"); o.className = "cut vis"; let z = 1;
  o.innerHTML = `<div class="h"><b>${cour.pages.length > 1 ? `Page ${k + 1} / ${cour.pages.length}` : "Photo de la pièce"}</b>${cour.pages.length > 1 ? `<button class="btn sm" id="vPrec">‹</button><button class="btn sm" id="vSuiv">›</button>` : ""}<button class="btn sm" id="vMoins">−</button><button class="btn sm" id="vPlus">+</button>${p.pdf ? "" : `<button class="btn sm primary" id="vRog">✂ Rogner</button>`}<button class="btn sm" id="vEnr">⬇ Enregistrer</button><button class="btn sm" id="vSup">🗑 Supprimer</button><button class="btn sm" id="vFer">Fermer</button></div><div class="z" id="vZ"><div id="vPgs">${pdfU ? `<iframe src="${pdfU}" title="PDF" style="width:100%;height:calc(100vh - 150px);border:0;background:#fff"></iframe><img id="vImg" class="vImg" alt="" hidden>` : srcs.map((u, i) => `<img ${i ? "" : 'id="vImg"'} class="vImg" src="${u}" alt="">`).join("")}</div></div><p class="vis-a">Pincez ou touchez deux fois pour zoomer · « Rogner » pour enlever ce qu'il y a autour</p>`;
  document.body.appendChild(o); const im = o.querySelector("#vImg"), Z = o.querySelector("#vZ");
  const zoom = (nz, cx, cy) => { nz = Math.max(1, Math.min(5, nz)); const r = Z.getBoundingClientRect(); const fx = (Z.scrollLeft + (cx ?? r.width / 2)) / (im.offsetWidth || 1), fy = (Z.scrollTop + (cy ?? r.height / 2)) / (im.offsetHeight || 1); z = nz; o.querySelectorAll(".vImg").forEach(m => { m.style.width = z === 1 ? "" : (Z.clientWidth * z) + "px"; m.style.maxWidth = z === 1 ? "" : "none"; m.style.maxHeight = z === 1 ? "" : "none"; }); requestAnimationFrame(() => { Z.scrollLeft = fx * im.offsetWidth - (cx ?? r.width / 2); Z.scrollTop = fy * im.offsetHeight - (cy ?? r.height / 2); }); };
  o.querySelector("#vPlus").onclick = () => zoom(z * 1.5); o.querySelector("#vMoins").onclick = () => zoom(z / 1.5);
  let tap = 0; im.addEventListener("click", e => { const t = Date.now(); if (t - tap < 350) { const r = Z.getBoundingClientRect(); zoom(z > 1.2 ? 1 : 2.5, e.clientX - r.left, e.clientY - r.top); } tap = t; });
  let d0 = 0, z0 = 1; Z.addEventListener("touchstart", e => { if (e.touches.length === 2) { d0 = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); z0 = z; } }, { passive: true });
  Z.addEventListener("touchmove", e => { if (e.touches.length === 2 && d0) { e.preventDefault(); const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); const r = Z.getBoundingClientRect(); zoom(z0 * d / d0, (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left, (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top); } }, { passive: false });
  Z.addEventListener("touchend", () => { d0 = 0; });
  o.querySelector("#vFer").onclick = () => { o.remove(); dessinerPhoto(); }; o.querySelector("#vSup").onclick = () => { o.remove(); supprimerPage(k); };
  o.querySelector("#vEnr").onclick = () => enregistrerFichier(p.pdf ? p.blob : p.blob, `piece-${(cour && cour.id || "x").slice(0, 8)}-page${k + 1}.${p.pdf ? "pdf" : "jpg"}`); const vr = o.querySelector("#vRog"); if (vr) vr.onclick = () => { o.remove(); rognerPhoto(k); };
  const pr = o.querySelector("#vPrec"), su = o.querySelector("#vSuiv"); if (pr) pr.onclick = () => { o.remove(); ouvrirVisionneuse((k - 1 + cour.pages.length) % cour.pages.length); }; if (su) su.onclick = () => { o.remove(); ouvrirVisionneuse((k + 1) % cour.pages.length); };
}
async function rognerPhoto(k = 0) {
  if (!cour || cour.existant) return; const p = cour.pages[k]; if (!p) return; if (p.pdf) return toast("Un PDF ne se rogne pas : photographiez plutôt le document");
  let src = (await chargerCanvas(p.orig || p.blob, 2400)).c; let R;
  const auto = () => { const b = cadre(gris(src, 480)); R = b ? { ...b } : { x: .04, y: .04, w: .92, h: .92 }; };
  auto();
  const o = document.createElement("div"); o.className = "cut rog";
  o.innerHTML = `<div class="h"><b>Ajustez le cadre autour du ticket</b><button class="btn sm" id="rRot">⟳ Pivoter</button><button class="btn sm" id="rTout">Toute la photo</button><button class="btn sm" id="rAnn">Annuler</button><button class="btn sm primary" id="rOk">✓ Valider</button></div><div class="z"><div class="zi"><img alt=""><div class="cadre"><i data-c="nw"></i><i data-c="ne"></i><i data-c="sw"></i><i data-c="se"></i></div></div></div><p class="vis-a">Faites glisser les coins ronds (ou le cadre entier) pour ne garder que la pièce.</p>`;
  document.body.appendChild(o); const zi = o.querySelector(".zi"), img = zi.querySelector("img"), cd = zi.querySelector(".cadre");
  const montrer = () => { img.src = src.toDataURL("image/jpeg", 0.85); dess(); };
  const dess = () => Object.assign(cd.style, { left: R.x * 100 + "%", top: R.y * 100 + "%", width: R.w * 100 + "%", height: R.h * 100 + "%" });
  montrer(); let g = null; const MIN = .06;
  const pt = e => { const t = e.touches ? (e.touches[0] || e.changedTouches[0]) : e; return { x: t.clientX, y: t.clientY }; };
  const debut = e => { const c = e.target.closest && e.target.closest("[data-c]"); const inside = e.target === cd; if (!c && !inside) return; if (e.cancelable) e.preventDefault(); const q = pt(e); g = { c: c ? c.dataset.c : "move", r: zi.getBoundingClientRect(), x: q.x, y: q.y, R0: { ...R } }; };
  const bouge = e => { if (!g) return; if (e.cancelable) e.preventDefault(); const q = pt(e); const dx = (q.x - g.x) / g.r.width, dy = (q.y - g.y) / g.r.height, A = g.R0; let { x, y, w, h } = A;
    if (g.c === "move") { x = Math.max(0, Math.min(1 - w, A.x + dx)); y = Math.max(0, Math.min(1 - h, A.y + dy)); }
    else { let x1 = A.x, y1 = A.y, x2 = A.x + A.w, y2 = A.y + A.h; if (g.c.includes("w")) x1 = Math.max(0, Math.min(x2 - MIN, A.x + dx)); if (g.c.includes("e")) x2 = Math.min(1, Math.max(x1 + MIN, A.x + A.w + dx)); if (g.c.includes("n")) y1 = Math.max(0, Math.min(y2 - MIN, A.y + dy)); if (g.c.includes("s")) y2 = Math.min(1, Math.max(y1 + MIN, A.y + A.h + dy)); x = x1; y = y1; w = x2 - x1; h = y2 - y1; }
    R = { x, y, w, h }; dess(); };
  const fin = () => { g = null; };
  cd.addEventListener("touchstart", debut, { passive: false }); cd.addEventListener("mousedown", debut);
  o.addEventListener("touchmove", bouge, { passive: false }); o.addEventListener("mousemove", bouge);
  o.addEventListener("touchend", fin); o.addEventListener("touchcancel", fin); o.addEventListener("mouseup", fin);
  o.querySelector("#rAnn").onclick = () => o.remove();
  o.querySelector("#rTout").onclick = () => { R = { x: 0, y: 0, w: 1, h: 1 }; dess(); };
  o.querySelector("#rRot").onclick = () => { src = tourner(src, 90); R = { x: 1 - R.y - R.h, y: R.x, w: R.h, h: R.w }; montrer(); };
  o.querySelector("#rOk").onclick = async () => { const b = o.querySelector("#rOk"); b.disabled = true; b.textContent = "…";
    const c = rogner2(src, R); const t = ameliorer(c); p.orig = await enBlob(src); if (p.origUrl) { URL.revokeObjectURL(p.origUrl); p.origUrl = ""; }
    p.canvas = t; p.blob = await enBlob(t); if (p.url) URL.revokeObjectURL(p.url); p.url = URL.createObjectURL(p.blob); p.hash = empreinte(t); p.recadre = true; cour.voirOrig = false;
    o.remove(); dessinerPhoto(); toast("Photo rognée : la pièce est relue"); lire(); };
}
function rogner2(c, b) { const x = Math.round(b.x * c.width), y = Math.round(b.y * c.height), w = Math.max(1, Math.min(c.width - x, Math.round(b.w * c.width))), h = Math.max(1, Math.min(c.height - y, Math.round(b.h * c.height))); const o = document.createElement("canvas"); o.width = w; o.height = h; const g = o.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.drawImage(c, x, y, w, h, 0, 0, w, h); return o; }

function decouper(p0) {
  const src = p0.canvas; const url = src.toDataURL("image/jpeg", 0.9); const Z = [];
  const o = document.createElement("div"); o.className = "cut"; o.innerHTML = `<div class="h"><b>Tracez un rectangle autour de chaque ticket</b><button class="btn sm" id="cAnn">Annuler</button><button class="btn sm" id="cEff">Effacer</button><button class="btn sm primary" id="cOk" disabled>Valider</button></div><div class="z"><div class="zi"><img src="${url}" alt=""></div></div>`;
  document.body.appendChild(o); const zi = o.querySelector(".zi"); let d = null;
  const maj = () => { zi.querySelectorAll(".r").forEach(x => x.remove()); Z.forEach((z, i) => { const b = document.createElement("div"); b.className = "r"; Object.assign(b.style, { left: z.x * 100 + "%", top: z.y * 100 + "%", width: z.w * 100 + "%", height: z.h * 100 + "%" }); b.innerHTML = `<span>${i + 1}</span>`; zi.appendChild(b); }); const ok = o.querySelector("#cOk"); ok.disabled = !Z.length; ok.textContent = Z.length ? `Valider ${Z.length} ticket(s)` : "Valider"; };
  zi.addEventListener("pointerdown", e => { e.preventDefault(); zi.setPointerCapture(e.pointerId); const r = zi.getBoundingClientRect(); d = { r, x0: (e.clientX - r.left) / r.width, y0: (e.clientY - r.top) / r.height, b: document.createElement("div") }; d.b.className = "r"; zi.appendChild(d.b); });
  zi.addEventListener("pointermove", e => { if (!d) return; const x = Math.max(0, Math.min(1, (e.clientX - d.r.left) / d.r.width)), y = Math.max(0, Math.min(1, (e.clientY - d.r.top) / d.r.height)); Object.assign(d.b.style, { left: Math.min(x, d.x0) * 100 + "%", top: Math.min(y, d.y0) * 100 + "%", width: Math.abs(x - d.x0) * 100 + "%", height: Math.abs(y - d.y0) * 100 + "%" }); d.x1 = x; d.y1 = y; });
  zi.addEventListener("pointerup", () => { if (!d) return; const z = { x: Math.min(d.x0, d.x1 ?? d.x0), y: Math.min(d.y0, d.y1 ?? d.y0), w: Math.abs((d.x1 ?? d.x0) - d.x0), h: Math.abs((d.y1 ?? d.y0) - d.y0) }; d.b.remove(); d = null; if (z.w > 0.04 && z.h > 0.03) Z.push(z); maj(); });
  o.querySelector("#cAnn").onclick = () => o.remove(); o.querySelector("#cEff").onclick = () => { Z.length = 0; maj(); };
  o.querySelector("#cOk").onclick = async () => { const files = [];
    for (const z of Z) { const c = document.createElement("canvas"); c.width = Math.round(z.w * src.width); c.height = Math.round(z.h * src.height); const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(src, z.x * src.width, z.y * src.height, c.width, c.height, 0, 0, c.width, c.height); const b = await enBlob(c); files.push(new File([b], "ticket.jpg", { type: "image/jpeg" })); }
    o.remove(); lectureId++; cour.pages.forEach(p => p.url && URL.revokeObjectURL(p.url)); cour = null; fileQueue.unshift(...files); toast(`${files.length} ticket(s) : ils vont être lus l'un après l'autre`); suivant(); };
}

/* =================== 9. Lecture par Claude (via le serveur sécurisé) =================== */
const blobB64 = b => new Promise((ok, ko) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(",")[1]); r.onerror = ko; r.readAsDataURL(b); });
async function lecture(consigne, blobs, modele) { const images = []; for (const b of blobs) images.push({ type: b.type || "image/jpeg", data: await blobB64(b) });
  const { data, error } = await sb.functions.invoke("lire-piece", { body: { consigne, images, modele } });
  if (error) { let m = error.message; try { const j = await error.context.json(); m = j.erreur || m; } catch (e) { } throw new Error(m); }
  if (!data || !data.resultat) throw new Error((data && data.erreur) || "lecture impossible"); return data.resultat; }
const PROMPT_A = `Tu es un assistant comptable français. Voici la photo d'une pièce (ticket de caisse, facture, avoir…), éventuellement en plusieurs pages. Lis TOUT ce qui est imprimé et réponds UNIQUEMENT en JSON avec ces clés :
{"nature":"ticket_caisse"|"ticket_cb"|"facture"|"avoir"|"devis"|"bon_livraison"|"autre","type":"ticket"|"facture"|"avoir","fournisseur":nom commercial court (sans adresse),"adresse":adresse du fournisseur ou null,"siret":SIRET ou SIREN du fournisseur (chiffres seulement) ou null,"tva_intra":n° de TVA intracommunautaire du fournisseur ou null,"numero":n° de facture ou de ticket ou null,"date":"AAAA-MM-JJ" ou null,"client":nom et prénom ou société facturée (destinataire) ou null,"ht":total hors taxes (nombre) ou null,"tva":montant total de TVA (nombre, 0 si aucune TVA) ou null,"ttc":total payé TTC après remises (nombre) ou null,"lignes_tva":[{"taux":taux en %,"ht":nombre,"tva":nombre}] (une ligne PAR TAUX imprimé : les restaurants et boulangeries ont souvent 5,5 %, 10 % et 20 % sur le même ticket ; recopie chaque taux avec sa base HT et sa TVA ; si seule la TVA d'un taux est imprimée, mets ht à null ; [] si un seul taux),"paiement":"cb"|"especes"|"cheque"|"virement"|"prelevement"|null,"categorie":une de ces catégories : ${C.CATEGORIES.join(", ")},"orientation":0|90|180|270 (rotation horaire à appliquer à la première page pour que le texte soit droit),"lisible":true si les montants sont nettement lisibles sinon false,"doutes":[phrases courtes sur ce qui est incertain ou illisible]}
Recopie exactement les montants imprimés, n'invente rien, mets null pour ce qui n'apparaît pas.`;
const PROMPT_B = `Contrôle indépendant d'une pièce comptable française (photo, éventuellement plusieurs pages). Repère la ligne du total payé, la ligne de TVA et la ligne hors taxes, la date, le numéro de la pièce et l'identité du vendeur. Réponds UNIQUEMENT en JSON : {"fournisseur":texte ou null,"date":"AAAA-MM-JJ" ou null,"numero":texte ou null,"siret":chiffres ou null,"tva_intra":texte ou null,"ht":nombre ou null,"tva":nombre ou null,"ttc":nombre ou null}. Le TTC est le montant effectivement payé. Recopie les chiffres exactement, mets null si illisible, n'invente rien.`;
const TAUX_FR = [20, 10, 5.5, 2.1, 0];
const CHAMPS = { ttc: ["#fTtc", "Total TTC", "n"], tva: ["#fTva", "TVA", "n"], ht: ["#fHt", "Total HT", "n"], date: ["#fDate", "Date", "d"], numero: ["#fNum", "N° de pièce", "t"], siret: ["#fSiret", "SIRET", "s"], tva_intra: ["#fTvaI", "N° de TVA", "s"] };
const affV = (k, v) => v === null || v === undefined || v === "" ? "—" : CHAMPS[k][2] === "n" ? nf(v) + " €" : CHAMPS[k][2] === "d" ? fd(v) : String(v);
const pose = (k, v) => { const [id, , ty] = CHAMPS[k]; $(id).value = v === null || v === undefined ? "" : ty === "n" ? nf(v) : String(v); };
function nettoyer(r, k) { const v = r && r[k]; if (v === null || v === undefined || v === "") return null; const ty = CHAMPS[k][2];
  if (ty === "n") return num(v); if (ty === "d") return /^\d{4}-\d{2}-\d{2}$/.test(String(v)) ? String(v) : null; if (k === "siret") { const d = String(v).replace(/\D/g, ""); return d || null; } if (k === "tva_intra") return String(v).replace(/\s/g, "").toUpperCase() || null; return String(v).trim().slice(0, 40) || null; }
const memeV = (k, a, b) => { if (a === null || b === null) return true; const ty = CHAMPS[k][2]; if (ty === "n") return Math.abs(a - b) < 0.01; if (ty === "t") return String(a).replace(/\s/g, "").toUpperCase() === String(b).replace(/\s/g, "").toUpperCase(); return a === b; };
const coherent = (ht, tva, ttc) => ht !== null && tva !== null && ttc !== null && Math.abs(ht + tva - ttc) <= 0.02;
/* message clair quand Claude ne lit pas la pièce */
function raisonLecture(msg) { const m = String(msg || "");
  const d = m.match(/(\d{4}-\d{2}-\d{2})/); const dfr = d ? new Date(d[1] + "T12:00:00").toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }).replace(/^1 /, "1er ") : "";
  if (/^pause:/.test(m)) return { court: "Lecture Claude en pause", long: `Lecture Claude en pause jusqu'au ${dfr} (limite de dépense de la clé Claude atteinte). Pour relancer tout de suite : console.anthropic.com › Settings › Limits › augmenter la limite mensuelle, puis touchez « Relire avec Claude ».`, pause: "" };
  if (/usage limit|spend limit|regain access/i.test(m)) return { court: "Limite de dépense Claude atteinte", long: `Limite de dépense mensuelle de la clé Claude atteinte : la lecture par Claude reprendra toute seule le ${dfr || "1er du mois prochain"}. Pour la relancer tout de suite : console.anthropic.com › Settings › Limits › augmenter la limite mensuelle.`, pause: d ? d[1] : "" };
  if (/credit balance|insufficient|billing/i.test(m)) return { court: "Crédit Claude épuisé", long: "Crédit de la clé Claude épuisé : rechargez-le sur console.anthropic.com › Billing, puis touchez « Relire avec Claude »." };
  if (/overloaded|rate.?limit|429|529|too many/i.test(m)) return { court: "Claude est surchargé", long: "Claude est momentanément surchargé : réessayez dans une minute avec « Relire avec Claude »." };
  if (/x-api-key|authentication|invalid.*key|ANTHROPIC_API_KEY/i.test(m)) return { court: "Clé Claude refusée", long: "La clé Claude n'est pas valable : elle est à vérifier dans Supabase › Edge Functions › Secrets (ANTHROPIC_API_KEY)." };
  if (/failed to fetch|network|load failed|internet/i.test(m)) return { court: "Pas de connexion", long: "Pas de connexion avec le serveur de lecture : vérifiez Internet, puis touchez « Relire avec Claude »." };
  return { court: "Claude n'a pas pu lire la pièce", long: "Claude n'a pas pu lire la pièce pour l'instant" + (m ? " (" + m.slice(0, 100) + ")" : "") + "." }; }
const boutonRelire = () => `<div style="margin-top:8px"><button type="button" class="btn sm" id="relireClaude">↻ Relire avec Claude</button></div>`;
function brancherRelire() { const b = $("#relireClaude"); if (b) b.onclick = () => { try { localStorage.removeItem("kcm-claude-pause"); } catch (e) { } lire(); }; }
async function lire() {
  const el = $("#lecture"); const id = ++lectureId;
  if (!enLigne()) { el.className = "read"; el.innerHTML = `<span class="dot"></span>Hors connexion : remplissez ce que vous voyez, ou laissez vide. La pièce sera vérifiée au bureau.`; verifier(); return; }
  el.className = "read"; el.innerHTML = `<span class="spin"></span>Double lecture de la pièce…`;
  const imgs = cour.pages.slice(0, imagesMax).map(p => p.blob), origs = cour.pages.slice(0, imagesMax).map(p => p.orig);
  const pauseJusqua = (() => { try { return localStorage.getItem("kcm-claude-pause") || ""; } catch (e) { return ""; } })();
  const enPause = pauseJusqua && new Date().toISOString().slice(0, 10) < pauseJusqua;
  const [RA, RB] = enPause ? [{ status: "rejected", reason: new Error("pause:" + pauseJusqua) }, { status: "rejected", reason: null }] : await Promise.allSettled([lecture(PROMPT_A, imgs, "precis"), lecture(PROMPT_B, origs, "rapide")]);
  if (id !== lectureId || !cour) return;
  let A = RA.status === "fulfilled" && RA.value && typeof RA.value === "object" ? RA.value : null, B = RB.status === "fulfilled" && RB.value && typeof RB.value === "object" ? RB.value : null;
  cour.secours = "";
  if (!A && !B) { const e = RA.reason || RB.reason, msg = String((e && e.message) || "");
    if (/activ/.test(msg)) { el.className = "read"; el.innerHTML = `<span class="dot"></span>Lecture automatique refusée : compte non activé.`; verifier(); return; }
    const P = raisonLecture(msg); if (P.pause) { try { localStorage.setItem("kcm-claude-pause", P.pause); } catch (x) { } }
    el.className = "read"; el.innerHTML = `<span class="spin"></span>${esc(P.court)} : lecture de secours sur le téléphone…`;
    let S = null; if (window.KCSecours) { try { S = await KCSecours.lire(imgs); } catch (x) { console.warn("secours", x); } }
    if (id !== lectureId || !cour) return;
    if (!S || (S.ttc === null && !S.date)) { el.className = "read"; el.innerHTML = `<span class="dot"></span>${esc(P.long)}<br>La lecture de secours n'a rien trouvé : remplissez à la main (montant TTC, TVA, date).${boutonRelire()}`; brancherRelire(); verifier(); return; }
    A = S; cour.secours = P.long; }
  const base = A || B;
  if (["ticket", "facture", "avoir"].includes(base.type)) $("#fType").value = base.type; else if (B && !A) $("#fType").value = "ticket"; appliquerType();
  if (base.fournisseur) $("#fFour").value = String(base.fournisseur).slice(0, 60);
  if (A) { if (A.client) $("#fClient").value = String(A.client).slice(0, 80); if (A.paiement) $("#fPaie").value = A.paiement; if (A.categorie) choisirCategorie(A.categorie);
    cour.adresse = A.adresse || ""; $("#fAdrBox").hidden = !cour.adresse; $("#fAdr").textContent = cour.adresse; cour.nature = A.nature || "";
    cour.lignes = Array.isArray(A.lignes_tva) ? A.lignes_tva.map(l => ({ taux: num(l.taux), ht: num(l.ht), tva: num(l.tva) })).filter(l => l.taux !== null && (l.ht !== null || l.tva !== null)) : null; if (cour.lignes && !cour.lignes.length) cour.lignes = null;
    cour.doutes = (Array.isArray(A.doutes) ? A.doutes : []).filter(Boolean).slice(0, 5).map(String); cour.lisible = A.lisible !== false;
    const o = +A.orientation; if ([90, 180, 270].includes(o) && cour.pages.length === 1 && !cour.pages[0].pdf) { const p = cour.pages[0]; p.plat = tourner(p.plat || p.canvas, o); p.quad = null; await appliquerMode(p, p.mode || "couleur"); dessinerPhoto(); } }
  // comparaison des deux lectures
  const V = {}, conflits = [];
  for (const k of Object.keys(CHAMPS)) { const a = nettoyer(A, k), b = nettoyer(B, k); V[k] = a ?? b; if (A && B && a !== null && b !== null && !memeV(k, a, b)) conflits.push({ k, a, b, choisi: null, par: null }); }
  // résolution par le calcul : le jeu de montants où HT + TVA = TTC
  const cm = conflits.filter(c => ["ht", "tva", "ttc"].includes(c.k));
  if (cm.length) { const pick = src => ({ ht: nettoyer(src, "ht"), tva: nettoyer(src, "tva"), ttc: nettoyer(src, "ttc") }); const MA = pick(A), MB = pick(B); const okA = coherent(MA.ht, MA.tva, MA.ttc), okB = coherent(MB.ht, MB.tva, MB.ttc);
    if (okA !== okB) { const M = okA ? MA : MB; cm.forEach(c => { c.choisi = M[c.k]; c.par = "calcul"; V[c.k] = M[c.k]; }); } }
  // arbitrage par une troisième lecture pour ce qui reste en désaccord
  const reste = conflits.filter(c => !c.par);
  if (reste.length) { el.innerHTML = `<span class="spin"></span>Les deux lectures diffèrent : contrôle d'arbitrage…`;
    try { const q = `Deux lectures de cette pièce comptable française ne sont pas d'accord. Regarde très attentivement l'image et donne la valeur exacte imprimée pour chaque champ. Réponds UNIQUEMENT en JSON {${reste.map(c => `"${c.k}": ${CHAMPS[c.k][2] === "n" ? "nombre" : "texte"} ou null`).join(", ")}, "sur": true si tu es certain sinon false}.\n` + reste.map(c => `- ${CHAMPS[c.k][1]} (${c.k}) : lecture 1 = ${c.a}, lecture 2 = ${c.b}`).join("\n");
      const R = await lecture(q, imgs, "precis"); if (id !== lectureId || !cour) return;
      reste.forEach(c => { const v = nettoyer(R, c.k); if (v !== null && (memeV(c.k, v, c.a) || memeV(c.k, v, c.b))) { c.choisi = memeV(c.k, v, c.a) ? c.a : c.b; c.par = R && R.sur === false ? "arbitrage incertain" : "arbitrage"; V[c.k] = c.choisi; } else if (v !== null) { c.troisieme = v; } });
    } catch (e) { } }
  for (const k of Object.keys(CHAMPS)) if (V[k] !== null && V[k] !== undefined) pose(k, V[k]);
  if (V.date) cour.dateOk = true;
  if ($("#fHt").value === "" && num($("#fTtc").value) !== null && num($("#fTva").value) !== null) $("#fHt").value = nf(num($("#fTtc").value) - num($("#fTva").value));
  const conn = fournisseurConnu($("#fFour").value); if (conn) { if (conn.categorie) choisirCategorie(conn.categorie); }
  cour.conflits = conflits; cour.lu = true; cour.doubleLu = !!(A && B);
  if (cour.secours) { el.className = "read"; el.innerHTML = `<span class="dot"></span><b>Lue par la lecture de secours du téléphone</b> (sans Claude) : vérifiez le montant TTC, la TVA, la date et le fournisseur.<br><span style="opacity:.8">${esc(cour.secours)}</span>${boutonRelire()}`; brancherRelire(); }
  else { try { localStorage.removeItem("kcm-claude-pause"); } catch (x) { } el.className = "read ok"; el.innerHTML = `<span class="dot"></span>${A && B ? "Pièce lue deux fois et comparée" : "Pièce lue (une seule lecture a abouti)"} : vérification ci-dessous.`; }
  dessinerLignes(); verifier();
}
function dessinerLignes() { const L = cour && cour.lignes; $("#lignesTva").innerHTML = L && L.length ? `<label>Détail de la TVA</label><table class="lt"><thead><tr><th>Taux</th><th>HT</th><th>TVA</th><th>TTC</th></tr></thead><tbody>${L.map(l => `<tr><td>${l.taux === null ? "?" : nf(l.taux).replace(",00", "") + " %"}</td><td>${l.ht === null ? "—" : nf(l.ht)}</td><td>${l.tva === null ? "—" : nf(l.tva)}</td><td>${l.ht === null || l.tva === null ? "—" : nf(l.ht + l.tva)}</td></tr>`).join("")}</tbody></table>` : ""; }


/* =================== 10. Contrôles comptables =================== */
function siretOk(s) { s = String(s || "").replace(/\D/g, ""); if (s.length !== 9 && s.length !== 14) return null; if (s.startsWith("356000000")) return true; let t = 0; for (let i = 0; i < s.length; i++) { let d = +s[s.length - 1 - i]; if (i % 2 === 1) { d *= 2; if (d > 9) d -= 9; } t += d; } return t % 10 === 0; }
function tvaIOk(v, siret) { v = String(v || "").replace(/\s/g, "").toUpperCase(); if (!v) return null; const m = v.match(/^FR([0-9A-Z]{2})(\d{9})$/); if (!m) return /^[A-Z]{2}[0-9A-Z]{2,13}$/.test(v) ? "etranger" : false; if (!/^\d\d$/.test(m[1])) return true; const ok = +m[1] === (12 + 3 * (+m[2] % 97)) % 97; if (!ok) return false; const sr = String(siret || "").replace(/\D/g, ""); return sr.length >= 9 && sr.slice(0, 9) !== m[2] ? "autre" : true; }
function fournisseurConnu(f) { const n = normTxt(f); if (n.length < 3) return null; const L = tickets.filter(t => normTxt(t.fournisseur) === n).sort((a, b) => (b.cree || "").localeCompare(a.cree || "")); if (!L.length) return null; return { siret: (L.find(t => t.siret) || {}).siret || "", categorie: (L.find(t => t.categorie) || {}).categorie || "", n: L.length }; }
function verifier() { const box = $("#verif"); if (!cour) { box.innerHTML = ""; return; }
  const ht = num($("#fHt").value), tva = num($("#fTva").value), ttc = num($("#fTtc").value), type = $("#fType").value, date = $("#fDate").value, four = $("#fFour").value.trim(), numero = $("#fNum").value.trim(), siret = $("#fSiret").value.trim(), tvai = $("#fTvaI").value.trim(), client = $("#fClient").value.trim(), paie = $("#fPaie").value;
  const R = []; const ok = (t, x) => R.push(["ok", "✓", t, x]), warn = (t, x) => R.push(["warn", "!", t, x]), bad = (t, x) => R.push(["bad", "✕", t, x]);
  Object.values(CHAMPS).forEach(([id]) => $(id).classList.remove("conflit"));
  // double lecture
  (cour.conflits || []).forEach((c, i) => { const [id, lib] = CHAMPS[c.k]; const cur = c.k === "date" ? $(id).value : CHAMPS[c.k][2] === "n" ? num($(id).value) : $(id).value.trim();
    const ch = `<div class="choix">${[c.a, c.b, ...(c.troisieme !== undefined && !memeV(c.k, c.troisieme, c.a) && !memeV(c.k, c.troisieme, c.b) ? [c.troisieme] : [])].map(v => `<button type="button" data-conf="${i}" data-v="${esc(JSON.stringify(v))}" class="${cur !== null && memeV(c.k, cur, v) && cur !== "" ? "on" : ""}">${esc(affV(c.k, v))}</button>`).join("")}</div>`;
    if (c.par === "vous") ok(`${lib} confirmé par vous`);
    else if (c.par === "calcul" || c.par === "arbitrage") { warn(`${lib} : les deux lectures diffèrent (${affV(c.k, c.a)} / ${affV(c.k, c.b)}). ${affV(c.k, c.choisi)} retenu ${c.par === "calcul" ? "car les montants tombent juste" : "après une 3ᵉ lecture"}. Touchez la bonne valeur pour confirmer.`, ch); $(id).classList.add("conflit"); }
    else { bad(`${lib} : les lectures ne sont pas d'accord. Regardez la photo et touchez la bonne valeur.`, ch); $(id).classList.add("conflit"); } });
  if (cour.lu && cour.doubleLu && !(cour.conflits || []).length) ok("Double lecture concordante");
  if (cour.lu && cour.lisible === false) bad("Pièce peu lisible : reprenez la photo bien à plat, sans reflet, ou corrigez les montants.");
  const qb = cour.pages.some(p => p.pb.some(x => x[0] === "bad")); if (qb && !cour.lu) warn("Photo de qualité insuffisante : reprenez-la si possible.");
  // nature de la pièce
  if (cour.nature === "ticket_cb") warn("C'est le ticket de la carte bancaire : il ne détaille pas la TVA. Gardez aussi le ticket de caisse ou demandez une facture.");
  if (cour.nature === "devis") bad("C'est un devis : ce n'est pas une pièce comptable. Attendez la facture.");
  if (cour.nature === "bon_livraison") bad("C'est un bon de livraison : ce n'est pas une pièce comptable. Demandez la facture.");
  // montants
  if (ttc === null) bad("Total TTC manquant."); else if (ttc <= 0) bad("Total TTC nul ou négatif."); else if (ttc > 5000) warn(`Montant élevé (${nf(ttc)} €) : vérifiez qu'il n'y a pas un chiffre en trop.`);
  if (ttc !== null && tva !== null) { const h = ht ?? r2(ttc - tva); if (Math.abs(h + tva - ttc) <= 0.02) ok(`HT ${nf(h)} + TVA ${nf(tva)} = TTC ${nf(ttc)}`); else bad(`HT ${nf(h)} + TVA ${nf(tva)} ≠ TTC ${nf(ttc)} : un montant est faux.`);
    if (h > 0 && tva > 0 && (!cour.lignes || cour.lignes.length < 2)) { const t = tva / h * 100; const p = TAUX_FR.reduce((a, b) => Math.abs(b - t) < Math.abs(a - t) ? b : a, 20); if (Math.abs(t - p) <= 0.25) ok(`Taux de TVA cohérent : ${nf(p).replace(",00", "")} %`); else warn(`TVA à ${nf(t)} % : plusieurs taux sur la pièce, ou montant à vérifier.`); }
    if (tva > ttc * 0.2) bad("La TVA dépasse 20 % du TTC : impossible en France, un montant est mal lu."); }
  else if (ttc !== null && tva === null) warn("Montant de TVA non trouvé : indiquez-le (0 si la pièce n'en mentionne pas).");
  if (cour.lignes && cour.lignes.length) { const fausses = cour.lignes.filter(l => l.taux !== null && l.ht !== null && l.tva !== null && Math.abs(l.ht * l.taux / 100 - l.tva) > 0.05); const inval = cour.lignes.filter(l => l.taux !== null && !TAUX_FR.includes(l.taux));
    if (fausses.length) bad(`Détail de TVA incohérent au taux de ${fausses.map(l => nf(l.taux).replace(",00", "") + " %").join(", ")}.`); else ok(`Détail par taux vérifié (${cour.lignes.length} taux)`);
    if (inval.length) warn(`Taux inhabituel en France : ${inval.map(l => nf(l.taux) + " %").join(", ")}.`);
    if (tva !== null) { const s = r2(cour.lignes.reduce((a, l) => a + (l.tva || 0), 0)); if (Math.abs(s - tva) > 0.02) bad(`La somme des TVA par taux (${nf(s)}) ne fait pas la TVA totale (${nf(tva)}).`); }
    if (ttc !== null && cour.lignes.every(l => l.ht !== null && l.tva !== null)) { const s = r2(cour.lignes.reduce((a, l) => a + l.ht + l.tva, 0)); if (Math.abs(s - ttc) > 0.02) warn(`Le détail par taux (${nf(s)}) ne fait pas le TTC (${nf(ttc)}) : remise, pourboire ou montant sans TVA ?`); } }
  // date, identité
  if (!date) bad("Date manquante."); else { const j = (new Date(today()) - new Date(date)) / 864e5; if (j < -1) bad("Date dans le futur : vérifiez-la."); else if (j > 730) warn("Pièce de plus de deux ans : vérifiez la date."); else if (cour.dateOk) ok("Date : " + fd(date)); }
  if (!four) warn("Nom du fournisseur manquant.");
  const sv = siretOk(siret); if (siret) { if (sv) ok("SIRET valide"); else bad("SIRET invalide : un chiffre est mal lu."); }
  const tv = tvaIOk(tvai, siret); if (tvai) { if (tv === true) ok("N° de TVA du fournisseur valide"); else if (tv === "autre") warn("Le n° de TVA ne correspond pas au SIRET lu."); else if (tv === "etranger") ok("N° de TVA étranger"); else bad("N° de TVA invalide : un caractère est mal lu."); }
  const conn = fournisseurConnu(four); if (conn && conn.siret && siret && conn.siret.slice(0, 9) !== siret.replace(/\D/g, "").slice(0, 9)) warn(`SIRET différent de celui des pièces précédentes de ${four} : vérifiez-le.`);
  // règles comptables
  if (type === "facture" || type === "avoir") { const manque = []; if (!numero) manque.push("n° de facture"); if (!siret) manque.push("SIRET du fournisseur"); if (!client) manque.push("nom du client facturé"); if (tva && !tvai && ht > 150) manque.push("n° de TVA du fournisseur"); if (manque.length) warn("Mention obligatoire absente : " + manque.join(", ") + "."); else ok("Mentions obligatoires de la facture présentes"); }
  else if (ht !== null && ht > 150 && tva > 0) warn("Ticket de plus de 150 € HT : demandez une facture à votre nom pour pouvoir récupérer la TVA.");
  if (paie === "especes" && ttc !== null && ttc > 1000) warn("Paiement en espèces de plus de 1 000 € : interdit entre professionnels en France.");
  // doublons : même pièce ou même photo
  const h0 = cour.pages[0] && cour.pages[0].hash; const dblPhoto = h0 && autres().find(t => distance(t.hash, h0) <= 4);
  const dbl = dblPhoto || autres().find(t => (numero && t.numero && t.numero === numero && normTxt(t.fournisseur) === normTxt(four)) || (ttc !== null && t.ttc === ttc && t.date === date && four && normTxt(t.fournisseur) === normTxt(four)));
  if (dbl) bad(`${dblPhoto ? "Même photo" : "Doublon possible"} : ${dbl.fournisseur || "pièce"} de ${dbl.ttc !== null && dbl.ttc !== undefined ? nf(dbl.ttc) + " €" : "?"} du ${fd(dbl.date)} est déjà enregistré.`);
  (cour.doutes || []).forEach(d => warn("Lecture : " + d));
  const nb = R.filter(x => x[0] === "bad").length, nw = R.filter(x => x[0] === "warn").length;
  const tete = nb ? `<div class="vhead bad">✕ ${nb} erreur(s) à corriger</div>` : nw ? `<div class="vhead warn">! Pièce correcte, ${nw} point(s) à vérifier</div>` : R.length ? `<div class="vhead ok">✓ Pièce vérifiée</div>` : "";
  box.innerHTML = tete + R.sort((a, b) => ["bad", "warn", "ok"].indexOf(a[0]) - ["bad", "warn", "ok"].indexOf(b[0])).map(([c, i, t, x]) => `<div class="vl ${c}"><i>${i}</i><span>${esc(t)}</span></div>${x || ""}`).join("");
  cour.verif = { erreurs: nb, alertes: nw, double: !!cour.doubleLu, conflits: (cour.conflits || []).length, secours: !!cour.secours }; }


/* =================== 11. Enregistrement =================== */
function lireFiche() { return { type: $("#fType").value, nature: cour.nature || null, fournisseur: $("#fFour").value.trim() || null, adresse: cour.adresse || null, date: $("#fDate").value || today(), ht: num($("#fHt").value), tva: num($("#fTva").value), ttc: num($("#fTtc").value), lignes: cour.lignes || null, numero: $("#fNum").value.trim() || null, client: $("#fClient").value.trim() || null, siret: $("#fSiret").value.replace(/\D/g, "") || null, tva_intra: $("#fTvaI").value.replace(/\s/g, "").toUpperCase() || null, paiement: $("#fPaie").value || null, categorie: $("#fCat").value || null, note: $("#fNote").value.trim() || null, paye_par_societe: !!cour.societe, paye_avec: payeAvec(cour.payeur), dossier: cour.dossier || null, verif: cour.verif || null }; }
async function enregistrer() {
  if (!cour) return; verifier();
  if (cour.verif && cour.verif.erreurs && !cour.forcer) { cour.forcer = true; toast("Il reste des erreurs : corrigez-les, ou touchez à nouveau « Enregistrer » pour garder la pièce telle quelle", 4500); return; }
  const b = $("#enregistrer"); b.disabled = true; const t0 = b.textContent; b.textContent = "Enregistrement…";
  try {
    const f = lireFiche();
    if (cour.existant) { const d = cour.existant;
      if (d._local) { const it = cour.local; it.row = { ...it.row, ...f }; await IDB.mettre(it); await chargerAttente(); viderAttente(); }
      else { const ch = { ...f, maj: new Date().toISOString(), ...(d.statut === "refuse" ? { statut: "soumis", motif_refus: null } : {}) }; const { error } = await sb.from("depenses").update(ch).eq("id", d.id); if (error) throw error; }
      toast("Modifications enregistrées"); }
    else { const row = { id: cour.id, user_id: session.user.id, ...f, hash: (cour.pages[0] || {}).hash || null, statut: "soumis", photos: [], originaux: [], cree: new Date().toISOString() };
      const it = { id: cour.id, row, blobs: cour.pages.map(p => p.blob), origs: cour.pages.map(p => p.pdf ? null : p.orig) };
      await IDB.mettre(it); await chargerAttente();
      if (enLigne()) { try { await envoyer(it); await IDB.retirer(it.id); await chargerAttente(); toast("Dépense enregistrée et envoyée"); } catch (e) { toast("Dépense gardée sur le téléphone : elle partira dès que possible", 4000); } }
      else toast("Hors connexion : dépense gardée sur le téléphone, elle partira toute seule", 4000); }
    cour.pages.forEach(p => p.url && URL.revokeObjectURL(p.url)); cour = null;
    if (fileQueue.length) { suivant(); return; }
    vue = "depenses"; await chargerDonnees(); rendre();
  } catch (e) { toast("Enregistrement impossible : " + (e.message || "erreur"), 4500); }
  finally { const bb = $("#enregistrer"); if (bb) { bb.disabled = false; bb.textContent = t0; } }
}

/* =================== 12. Indemnités kilométriques =================== */
function ouvrirKm(d) {
  const k = (d && d.km) || {}; const modif = !d || d._local || ["soumis", "refuse", "brouillon"].includes(d.statut);
  $("#main").innerHTML = `<section class="card"><h2>Indemnités kilométriques</h2>
    <div class="grid"><div class="fld"><label for="kDate">Date</label><input id="kDate" type="date" value="${esc((d && d.date) || today())}"></div>
    <div class="fld"><label for="kCv">Puissance fiscale</label><select id="kCv">${[3, 4, 5, 6, 7].map(c => `<option value="${c}" ${(k.cv || (moi && moi.cv_fiscaux) || 5) == c ? "selected" : ""}>${c === 7 ? "7 CV et plus" : c + " CV"}</option>`).join("")}</select></div>
    <div class="fld full"><label for="kDep">Départ</label><input id="kDep" value="${esc(k.depart || "")}" placeholder="ex. Lyon, bureau"></div>
    <div class="fld full"><label for="kArr">Arrivée</label><input id="kArr" value="${esc(k.arrivee || "")}" placeholder="ex. Villefranche, client Durand"></div>
    <div class="fld"><label for="kKm">Kilomètres (aller)</label><input id="kKm" class="num" inputmode="decimal" value="${k.km ? nf(k.km) : ""}"></div>
    <div class="fld"><label for="kAR">Trajet</label><select id="kAR"><option value="1" ${k.aller_retour !== false ? "selected" : ""}>Aller-retour</option><option value="0" ${k.aller_retour === false ? "selected" : ""}>Aller simple</option></select></div>
    <div class="fld full"><label for="kMotif">Motif du déplacement</label><input id="kMotif" value="${esc(k.motif || (d && d.note) || "")}" placeholder="ex. rendez-vous client, expertise sinistre…"></div></div>
    <div class="kpi"><div class="l">Montant</div><div class="v" id="kTot">—</div><div class="s" id="kDet"></div></div>
    <p class="note">Barème kilométrique officiel pour les voitures (jusqu'à 5 000 km par an). Votre véhicule personnel uniquement.</p>
    <div class="row2"><button class="btn ghost" id="kAnn">${modif ? "Annuler" : "Retour"}</button>${modif ? `<button class="btn primary" id="kOk">Enregistrer</button>` : ""}</div></section>`;
  const calc = () => { const km = num($("#kKm").value) || 0, ar = $("#kAR").value === "1", cv = +$("#kCv").value; const t = C.BAREME_KM[cv] || C.BAREME_KM[5]; const tot = r2(km * (ar ? 2 : 1) * t); $("#kTot").textContent = eur(tot); $("#kDet").textContent = `${nf(km * (ar ? 2 : 1))} km × ${String(t).replace(".", ",")} €`; return { km, ar, cv, tot }; };
  $("#main").oninput = calc; $("#main").onchange = calc; calc();
  if (!modif) document.querySelectorAll("#main input,#main select").forEach(i => i.disabled = true);
  $("#kAnn").onclick = () => rendre();
  if (modif) $("#kOk").onclick = async () => { const c = calc(); if (!c.km) return toast("Indiquez le nombre de kilomètres"); if (!$("#kDep").value.trim() || !$("#kArr").value.trim()) return toast("Indiquez le départ et l'arrivée");
    const row = { type: "km", date: $("#kDate").value || today(), ttc: c.tot, ht: c.tot, tva: 0, categorie: "Indemnités kilométriques", fournisseur: "Indemnités kilométriques", note: $("#kMotif").value.trim() || null, km: { depart: $("#kDep").value.trim(), arrivee: $("#kArr").value.trim(), km: c.km, aller_retour: c.ar, cv: c.cv, motif: $("#kMotif").value.trim() }, paye_par_societe: false };
    try { if (d && !d._local) { const { error } = await sb.from("depenses").update({ ...row, ...(d.statut === "refuse" ? { statut: "soumis", motif_refus: null } : {}), maj: new Date().toISOString() }).eq("id", d.id); if (error) throw error; }
      else { const id = (d && d.id) || uuid(); const it = { id, row: { id, user_id: session.user.id, statut: "soumis", photos: [], originaux: [], cree: new Date().toISOString(), ...row }, blobs: [], origs: [] }; await IDB.mettre(it); await chargerAttente(); if (enLigne()) { try { await envoyer(it); await IDB.retirer(id); await chargerAttente(); } catch (e) { } } }
      if (moi && moi.cv_fiscaux !== c.cv && enLigne()) { try { await sb.from("profils").update({ cv_fiscaux: c.cv }).eq("id", moi.id); moi.cv_fiscaux = c.cv; lsSet("kcm-moi", moi); } catch (e) { } }
      toast("Trajet enregistré : " + eur(c.tot)); vue = "depenses"; await chargerDonnees(); rendre(); } catch (e) { toast("Enregistrement impossible : " + (e.message || "erreur")); } };
}

/* =================== 13. Avances =================== */
let avPers = null;
function vueAvances() {
  const admin = moi.role === "admin"; const actifs = profils.filter(p => p.actif); if (!avPers || (!admin && avPers !== moi.id)) avPers = moi.id;
  const uid = avPers; const S = soldeDe(uid);
  const lignes = [...avances.filter(a => a.user_id === uid).map(a => ({ date: a.date, lib: a.sens === "rendu" ? "Argent rendu" : a.sens === "complement" ? "Remboursement" : "Avance reçue", det: a.note || (a.mode === "especes" ? "Espèces" : a.mode === "virement" ? "Virement" : a.mode || ""), plus: a.sens === "rendu" ? 0 : num(a.montant), moins: a.sens === "rendu" ? num(a.montant) : 0, id: a.id })),
    ...depenses.concat(attente.map(x => x.row)).filter(d => d.user_id === uid && persoDe(d) && d.statut !== "refuse").map(d => ({ date: d.date, lib: d.type === "km" ? "Kilomètres" : d.categorie || "Dépense", det: d.fournisseur || "", plus: d.type === "avoir" ? num(d.ttc) : 0, moins: d.type === "avoir" ? 0 : (num(d.ttc) || 0) }))]
    .sort((a, b) => (a.date || "").localeCompare(b.date || "")); let s = 0; lignes.forEach(l => { s = r2(s + l.plus - l.moins); l.solde = s; });
  $("#main").innerHTML = `${admin ? `<div class="fld"><label for="avP">Personne</label><select id="avP">${actifs.map(p => `<option value="${p.id}" ${p.id === uid ? "selected" : ""}>${esc(p.nom || p.email)}</option>`).join("")}</select></div>` : ""}
    <section class="card"><h2>${uid === moi.id ? "Mon avance" : "Avance de " + esc(nomDe(uid))}</h2><div class="solde">${soldeTxt(S.solde)}</div><p class="note">Argent reçu : ${eur(S.avance)} · dépenses payées avec : ${eur(S.depense)}. Chaque ticket enregistré est déduit au fur et à mesure.</p>
    ${admin ? `<div class="row2"><button class="btn primary" data-av="avance">+ Avance versée</button><button class="btn" data-av="rendu">Argent rendu</button>${S.solde < -0.005 ? `<button class="btn" data-av="complement" data-m="${-S.solde}">Rembourser ${eur(-S.solde)}</button>` : ""}</div>` : ""}</section>
    <section class="card"><h2>Relevé</h2><div class="list">${lignes.length ? lignes.slice().reverse().map(l => `<div class="prow"><div class="t"><b>${esc(l.lib)}</b><span>${esc(fd(l.date))}${l.det ? " · " + esc(l.det) : ""}</span></div><div style="text-align:right;font-family:var(--f-num)">${l.plus ? `<span class="pos" style="color:var(--ok)">+${nf(l.plus)}</span>` : `−${nf(l.moins)}`}<div class="note">reste ${nf(l.solde)}</div></div>${admin && l.id ? `<button class="btn sm ghost" data-avsup="${l.id}">Supprimer</button>` : ""}</div>`).join("") : `<div class="empty">Aucune avance ni dépense pour l'instant.</div>`}</div></section>`;
  if (admin) { $("#avP").onchange = e => { avPers = e.target.value; vueAvances(); };
    document.querySelectorAll("[data-av]").forEach(b => b.onclick = () => saisirAvance(uid, b.dataset.av, b.dataset.m));
    document.querySelectorAll("[data-avsup]").forEach(b => b.onclick = async () => { if (!confirmer("Supprimer cette ligne d'avance ?")) return; const { error } = await sb.from("avances").delete().eq("id", b.dataset.avsup); if (error) return toast("Suppression impossible"); await chargerDonnees(); vueAvances(); }); }
}
function saisirAvance(uid, sens, m) {
  const s = document.createElement("div"); s.className = "sheet"; s.innerHTML = `<div class="in"><h2>${sens === "rendu" ? "Argent rendu par " : sens === "complement" ? "Remboursement à " : "Avance versée à "}${esc(nomDe(uid))}</h2>
    <div class="grid"><div class="fld"><label for="sDate">Date</label><input id="sDate" type="date" value="${today()}"></div><div class="fld"><label for="sMt">Montant (€)</label><input id="sMt" class="num" inputmode="decimal" value="${m ? nf(m) : ""}"></div>
    <div class="fld full"><label for="sMode">Mode</label><select id="sMode"><option value="especes">Espèces</option><option value="virement">Virement</option><option value="cheque">Chèque</option><option value="cb">Carte bancaire</option></select></div>
    <div class="fld full"><label for="sNote">Note</label><input id="sNote" placeholder="ex. déplacement Lyon"></div></div>
    <div class="row2"><button class="btn ghost" id="sAnn">Annuler</button><button class="btn primary" id="sOk">Enregistrer</button></div></div>`;
  document.body.appendChild(s); s.querySelector("#sAnn").onclick = () => s.remove();
  s.querySelector("#sOk").onclick = async () => { const mt = num(s.querySelector("#sMt").value); if (!(mt > 0)) return toast("Montant invalide");
    const { error } = await sb.from("avances").insert({ user_id: uid, date: s.querySelector("#sDate").value || today(), montant: mt, sens, mode: s.querySelector("#sMode").value, note: s.querySelector("#sNote").value.trim() || null });
    if (error) return toast("Enregistrement impossible : " + error.message); s.remove(); toast(eur(mt) + " enregistré"); await chargerDonnees(); vueAvances(); };
}

/* =================== 14. Gestion (administrateur) =================== */
let admOnglet = "valider";
function vueAdmin() {
  const aval = depenses.filter(d => d.statut === "soumis").sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const enAtt = profils.filter(p => !p.actif);
  $("#main").innerHTML = `<div class="seg" id="admT">${[["valider", `À valider${aval.length ? " · " + aval.length : ""}`], ["equipe", `Équipe${enAtt.length ? " · " + enAtt.length + " en attente" : ""}`], ["notes", "Notes de frais"]].map(([k, l]) => `<button type="button" data-adm="${k}" class="${admOnglet === k ? "on" : ""}">${l}</button>`).join("")}</div><div id="admC" style="display:flex;flex-direction:column;gap:14px"></div>`;
  document.querySelectorAll("[data-adm]").forEach(b => b.onclick = () => { admOnglet = b.dataset.adm; vueAdmin(); });
  const c = $("#admC");
  if (admOnglet === "valider") {
    const parP = {}; aval.forEach(d => (parP[d.user_id] = parP[d.user_id] || []).push(d));
    c.innerHTML = aval.length ? Object.entries(parP).map(([u, L]) => `<section class="card"><h2>${esc(nomDe(u))} <span class="n">${L.length} pièce(s) · ${eur(L.reduce((s, d) => s + (num(d.ttc) || 0), 0))}</span></h2>
      <div class="list">${L.map(d => `<div class="prow" data-v="${d.id}">${vignette(d).replace('class="th"', 'class="th" style="width:44px;height:56px;border-radius:7px;object-fit:cover"')}<div class="t"><b>${esc(d.type === "km" ? `${(d.km || {}).depart} → ${(d.km || {}).arrivee}` : d.fournisseur || "?")}</b><span>${esc(fd(d.date))} · ${esc(d.categorie || "")} · <b style="display:inline;font-family:var(--f-num)">${eur(d.ttc)}</b>${d.verif && d.verif.erreurs ? ` · <span style="color:var(--accent)">✕ ${d.verif.erreurs} erreur(s) au contrôle</span>` : d.verif && d.verif.alertes ? ` · <span style="color:var(--warn)">! à vérifier</span>` : ""}</span></div>
        <button class="btn sm ghost" data-ouvrir="${d.id}">Voir</button><button class="btn sm ok" data-val="${d.id}">Valider</button><button class="btn sm" data-ref="${d.id}">Refuser</button></div>`).join("")}</div>
      <button class="btn ok" data-valtout="${u}">Valider les ${L.length} pièces de ${esc(nomDe(u))}</button></section>`).join("") : `<section class="card"><div class="empty">Rien à valider pour l'instant.</div></section>`;
    remplirVignettes(c);
    c.onclick = async e => { const o = e.target.closest("[data-ouvrir]"); if (o) return ouvrirDepense(o.dataset.ouvrir);
      const v = e.target.closest("[data-val]"), r = e.target.closest("[data-ref]"), t = e.target.closest("[data-valtout]");
      if (v) await valider([v.dataset.val]); else if (t) { const ids = aval.filter(d => d.user_id === t.dataset.valtout).map(d => d.id); if (confirmer(`Valider les ${ids.length} pièces ?`)) await valider(ids); }
      else if (r) { const motif = window.prompt("Motif du refus (il sera affiché à la personne) :", "Pièce illisible, merci de la reprendre"); if (motif === null) return; const { error } = await sb.from("depenses").update({ statut: "refuse", motif_refus: motif || "Refusée", valide_par: moi.id, valide_le: new Date().toISOString() }).eq("id", r.dataset.ref); if (error) return toast("Impossible : " + error.message); toast("Dépense refusée"); await chargerDonnees(); vueAdmin(); } };
  }
  if (admOnglet === "equipe") {
    c.innerHTML = `<section class="card"><h2>Équipe <span class="n">${profils.length}</span></h2><button class="btn primary" id="addPers" style="margin-bottom:10px">+ Ajouter une personne</button><p class="note">Vous créez son compte ici (nom, e-mail, mot de passe), il est actif tout de suite : donnez-lui ensuite son e-mail et son mot de passe. Ou envoyez-lui le lien de l'appli : il crée son compte lui-même, puis vous l'activez ici.</p>
      <div class="list">${profils.map(p => `<div class="prow"><div class="t"><b>${esc(p.nom || "(sans nom)")}</b><span>${esc(p.email)} · ${p.role === "admin" ? "administrateur" : "membre"}</span></div>
        ${p.id === moi.id ? `<span class="pill ok">Vous</span>` : `<button class="btn sm ${p.actif ? "" : "ok"}" data-act="${p.id}" data-on="${p.actif ? 0 : 1}">${p.actif ? "Désactiver" : "Activer"}</button><button class="btn sm ghost" data-nom="${p.id}">Renommer</button><button class="btn sm ghost" data-role="${p.id}">${p.role === "admin" ? "Retirer admin" : "Rendre admin"}</button><button class="btn sm ghost" data-sup="${p.id}" style="color:var(--accent)">Supprimer</button>`}</div>`).join("")}</div>
      <button class="btn" id="copLien">Copier le lien de l'appli</button></section>`;
    $("#addPers").onclick = ajouterPersonne;
    $("#copLien").onclick = async () => { const u = location.origin + location.pathname; try { await navigator.clipboard.writeText(u); toast("Lien copié : envoyez-le par SMS ou e-mail"); } catch (e) { window.prompt("Lien de l'appli :", u); } };
    c.onclick = async e => { const sp = e.target.closest("[data-sup]"); if (sp) return supprimerPersonne(sp.dataset.sup); const a = e.target.closest("[data-act]"), n = e.target.closest("[data-nom]"), r = e.target.closest("[data-role]"); let ch = null, id = null;
      if (a) { id = a.dataset.act; ch = { actif: a.dataset.on === "1" }; }
      if (n) { id = n.dataset.nom; const p = profils.find(x => x.id === id); const v = window.prompt("Prénom et nom :", p.nom || ""); if (v === null) return; ch = { nom: v.trim() }; }
      if (r) { id = r.dataset.role; const p = profils.find(x => x.id === id); if (!confirmer(p.role === "admin" ? "Retirer les droits d'administrateur ?" : "Donner les droits d'administrateur (voir et valider toutes les dépenses) ?")) return; ch = { role: p.role === "admin" ? "membre" : "admin" }; }
      if (!ch) return; const { error } = await sb.from("profils").update(ch).eq("id", id); if (error) return toast("Impossible : " + error.message); toast("Enregistré"); await chargerDonnees(); vueAdmin(); };
  }
  if (admOnglet === "notes") { if (mois === "tout") mois = new Date().toISOString().slice(0, 7);
    c.innerHTML = `<section class="card"><h2>Notes de frais</h2><div class="mois"><button class="btn sm ghost" data-nm="-1">${ICO.gauche}</button><b>${moisLib(mois)}</b><button class="btn sm ghost" data-nm="1">${ICO.droite}</button></div>
      <div class="list">${profils.filter(p => p.actif).map(p => { const L = depenses.filter(d => d.user_id === p.id && (d.date || "").slice(0, 7) === mois && d.statut !== "refuse"); return `<div class="prow"><div class="t"><b>${esc(p.nom || p.email)}</b><span>${L.length} pièce(s) · ${eur(L.reduce((s, d) => s + (d.type === "avoir" ? -1 : 1) * (num(d.ttc) || 0), 0))} · avance : ${soldeTxt(soldeDe(p.id).solde)}</span></div><button class="btn sm" data-pdf="${p.id}" ${L.length ? "" : "disabled"}>PDF</button></div>`; }).join("")}</div></section>`;
    c.onclick = e => { const m = e.target.closest("[data-nm]"); if (m) { mois = moisDecal(mois, +m.dataset.nm); vueAdmin(); return; } const p = e.target.closest("[data-pdf]"); if (p) noteDeFrais(p.dataset.pdf, mois); };
  }
}
async function valider(ids) { const { error } = await sb.from("depenses").update({ statut: "valide", valide_par: moi.id, valide_le: new Date().toISOString(), motif_refus: null }).in("id", ids); if (error) return toast("Impossible : " + error.message); toast(ids.length > 1 ? `${ids.length} dépenses validées` : "Dépense validée"); await chargerDonnees(); vueAdmin(); }

/* =================== 15. Note de frais en PDF =================== */
function noteDeFrais(uid, m) {
  const { jsPDF } = window.jspdf; const doc = new jsPDF({ unit: "mm", format: "a4" }); const L = depenses.concat(attente.map(x => x.row)).filter(d => d.user_id === uid && (d.date || "").slice(0, 7) === m && d.statut !== "refuse" && dansFiltre(d)).sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const nom = nomDe(uid); let y = 18; doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(179, 18, 29); doc.text("Note de frais", 14, y); doc.setTextColor(0); doc.setFontSize(11); doc.text(`${C.SOCIETE}`, 196, y, { align: "right" });
  y += 8; doc.setFont("helvetica", "normal"); doc.text(`${nom} — ${moisLib(m)}${filtreDossier ? " — Dossier : " + filtreDossier : ""}`, 14, y); y += 10;
  const col = [14, 34, 86, 140, 160, 178]; doc.setFontSize(9); doc.setFont("helvetica", "bold"); ["Date", "Fournisseur / trajet", "Catégorie", "TVA", "TTC", "Payé par"].forEach((h, i) => doc.text(h, col[i] + (i === 3 || i === 4 ? 16 : 0), y, i === 3 || i === 4 ? { align: "right" } : undefined)); y += 2; doc.line(14, y, 196, y); y += 5; doc.setFont("helvetica", "normal");
  let tot = 0, tva = 0, perso = 0;
  L.forEach(d => { if (y > 275) { doc.addPage(); y = 18; } const sg = d.type === "avoir" ? -1 : 1; const ttc = sg * (num(d.ttc) || 0), tv = sg * (num(d.tva) || 0); tot += ttc; tva += tv; if (persoDe(d)) perso += ttc;
    const lib = d.type === "km" ? `${(d.km || {}).depart} → ${(d.km || {}).arrivee} (${nf(((d.km || {}).km || 0) * ((d.km || {}).aller_retour === false ? 1 : 2))} km)` : (d.fournisseur || "") + (d.numero ? " n° " + d.numero : "");
    doc.text(fd(d.date), col[0], y); doc.text(doc.splitTextToSize(lib, 50)[0], col[1], y); doc.text(doc.splitTextToSize(d.categorie || "", 52)[0], col[2], y); doc.text(nf(tv), col[3] + 16, y, { align: "right" }); doc.text(nf(ttc), col[4] + 16, y, { align: "right" }); doc.text(doc.splitTextToSize(d.paye_avec || (d.paye_par_societe ? "Société" : "Salarié"), 24)[0], col[5], y); y += 6; });
  y += 2; doc.line(14, y, 196, y); y += 6; doc.setFont("helvetica", "bold"); doc.text("Total", col[1], y); doc.text(nf(tva), col[3] + 16, y, { align: "right" }); doc.text(nf(tot), col[4] + 16, y, { align: "right" }); y += 10;
  const S = soldeDe(uid); doc.setFont("helvetica", "normal"); doc.setFontSize(10);
  [["Dépenses avancées par le salarié ce mois-ci", perso], ["Avances reçues (total)", S.avance], ["Dépenses payées avec l'avance (total)", S.depense]].forEach(([l, v]) => { doc.text(l, 14, y); doc.text(nf(v) + " €", 196, y, { align: "right" }); y += 6; });
  doc.setFont("helvetica", "bold"); doc.text(Math.abs(S.solde) < 0.005 ? "Solde : 0,00 € (soldé)" : S.solde > 0 ? `Reste à justifier : ${nf(S.solde)} €` : `À rembourser au salarié : ${nf(-S.solde)} €`, 14, y + 2); y += 18;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.text("Signature du salarié", 14, y); doc.text("Visa de la direction", 120, y);
  doc.setFontSize(7.5); doc.setTextColor(120); doc.text(`Édité le ${fd(today())} · Kabylos Notes de frais`, 14, 290);
  const fn = `Note de frais ${nom} ${m}.pdf`.replace(/[\\/:*?"<>|]+/g, "-"); try { doc.save(fn); } catch (e) { window.open(doc.output("bloburl"), "_blank"); }
}

/* choisir un nouveau mot de passe (après le lien reçu par e-mail) */
let mdpOuvert = false;
function nouveauMdp() { if (mdpOuvert) return; mdpOuvert = true;
  const s = document.createElement("div"); s.className = "sheet"; s.innerHTML = `<div class="in"><h2>Nouveau mot de passe</h2>
    <p class="note">Choisissez votre nouveau mot de passe (8 caractères minimum).</p>
    <form id="nmF"><input type="password" id="nm1" autocomplete="new-password" placeholder="Nouveau mot de passe" minlength="8" required style="width:100%;margin:6px 0;padding:12px;font-size:17px;border-radius:10px;border:1px solid var(--line)">
    <input type="password" id="nm2" autocomplete="new-password" placeholder="Retapez-le" minlength="8" required style="width:100%;margin:6px 0;padding:12px;font-size:17px;border-radius:10px;border:1px solid var(--line)">
    <div class="msg" id="nmM" hidden></div><button class="btn primary" type="submit" style="width:100%;margin-top:8px">Enregistrer le mot de passe</button></form>
    <button class="btn ghost" id="nmX" type="button" style="width:100%;margin-top:8px">Plus tard</button></div>`;
  document.body.appendChild(s); const M = s.querySelector("#nmM"); const msg = (t, ok) => { M.hidden = false; M.className = "msg " + (ok ? "ok" : "bad"); M.textContent = t; };
  const fin = () => { s.remove(); mdpOuvert = false; };
  s.querySelector("#nmX").onclick = fin;
  s.querySelector("#nmF").onsubmit = async e => { e.preventDefault(); const a = s.querySelector("#nm1").value, b = s.querySelector("#nm2").value;
    if (a.length < 8) return msg("8 caractères minimum");
    if (a !== b) return msg("Les deux mots de passe ne sont pas identiques");
    const bt = s.querySelector("button[type=submit]"); bt.disabled = true; bt.textContent = "Enregistrement…";
    const { error } = await sb.auth.updateUser({ password: a });
    if (error) { bt.disabled = false; bt.textContent = "Enregistrer le mot de passe"; return msg("Mot de passe non changé : " + error.message); }
    fin(); toast("Mot de passe changé ✓ Utilisez-le pour vous connecter", 5000); };
  setTimeout(() => { try { s.querySelector("#nm1").focus(); } catch (e) { } }, 300); }

/* =================== 16. Démarrage =================== */
async function demarrer() {
  await chargerAttente();
  const { data } = await sb.auth.getSession(); session = data.session;
  if (session) { await chargerMoi(); if (moi && moi.actif) await chargerDonnees(); }
  rendre(); viderAttente();
  if (RECUP || ERR_LIEN) try { history.replaceState(null, "", location.pathname); } catch (e) { }
  if (RECUP && session) nouveauMdp();
  else if (ERR_LIEN) toast("Lien non valable ou expiré : redemandez « Mot de passe oublié »", 6000);
  sb.auth.onAuthStateChange(async (ev, s) => { const avant = session && session.user.id; session = s;
    if (ev === "PASSWORD_RECOVERY") nouveauMdp();
    if (s && s.user.id !== avant) { await chargerMoi(); if (moi && moi.actif) await chargerDonnees(); rendre(); viderAttente(); }
    if (!s && avant) rendre(); });
}
/* mise à jour automatique : nouvelle version en ligne → caches vidés et appli rechargée */
async function verifierMaj() { try { const r = await fetch("config.js?v=" + Date.now(), { cache: "no-store" }); if (!r.ok) return; const m = (await r.text()).match(/VERSION:\s*"([^"]+)"/); if (!m || m[1] === C.VERSION) return;
  if (sessionStorage.getItem("kcm-maj") === m[1]) return; sessionStorage.setItem("kcm-maj", m[1]);
  try { const K = await caches.keys(); await Promise.all(K.map(k => caches.delete(k))); } catch (e) { } try { const R = await navigator.serviceWorker.getRegistrations(); await Promise.all(R.map(x => x.update())); } catch (e) { }
  location.reload(); } catch (e) { } }
setTimeout(verifierMaj, 1500); document.addEventListener("visibilitychange", () => { if (!document.hidden) verifierMaj(); });
if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => { }));
demarrer();
