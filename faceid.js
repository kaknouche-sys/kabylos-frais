/* Kabylos Notes de frais — ouvrir l'appli avec Face ID / Touch ID (verrou sur l'appareil) */
(function () {
  let dispo = false, cache = 0, controle = false;
  const uidLocal = () => { try { if (typeof session !== "undefined" && session && session.user) return session.user.id; const s = JSON.parse(localStorage.getItem("kcm-session") || "null"); return (s && (s.user || (s.currentSession || {}).user) || {}).id || ""; } catch (e) { return ""; } };
  const cle = () => { const u = uidLocal(); return u ? "kcm-faceid-" + u : ""; };
  const actif = () => { try { return !!(cle() && localStorage.getItem(cle())); } catch (e) { return false; } };
  const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const deb64u = s => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), c => c.charCodeAt(0));
  const msg = t => { try { toast(t); } catch (e) { } };
  const nomAff = () => { try { return (typeof moi !== "undefined" && moi && moi.nom) || (typeof session !== "undefined" && session && session.user.email) || ""; } catch (e) { return ""; } };
  async function activer() {
    try { const s = typeof session !== "undefined" ? session : null; if (!s) return false;
      const c = await navigator.credentials.create({ publicKey: { rp: { name: "Kabylos Notes de frais", id: location.hostname }, user: { id: crypto.getRandomValues(new Uint8Array(16)), name: s.user.email || "utilisateur", displayName: nomAff() || "Utilisateur" }, challenge: crypto.getRandomValues(new Uint8Array(32)), pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }], authenticatorSelection: { authenticatorAttachment: "platform", userVerification: "required", residentKey: "preferred" }, timeout: 60000, attestation: "none" } });
      localStorage.setItem(cle(), JSON.stringify({ id: b64u(c.rawId), le: new Date().toISOString() })); msg("Face ID activé : l'appli vous le demandera à chaque ouverture"); bouton(); const fc = document.getElementById("faceCarte"); if (fc) fc.remove(); return true;
    } catch (e) { msg(e && e.name === "NotAllowedError" ? "Face ID non activé (annulé)" : "Face ID impossible sur ce téléphone : " + (e.message || e.name || "erreur")); try { localStorage.setItem("kcm-faceid-err", (e && e.name || "") + " " + (e && e.message || "")); } catch (x) { } return false; } }
  async function verifier() { const k = JSON.parse(localStorage.getItem(cle()) || "null"); if (!k) return true;
    const a = await navigator.credentials.get({ publicKey: { challenge: crypto.getRandomValues(new Uint8Array(32)), rpId: location.hostname, allowCredentials: [{ type: "public-key", id: deb64u(k.id), transports: ["internal"] }], userVerification: "required", timeout: 60000 } }); return !!a; }
  function ouvrir() { const o = document.getElementById("verrou"); if (o) o.remove(); cache = 0; }
  function verrouiller() { if (!actif() || document.getElementById("verrou")) return; const o = document.createElement("div"); o.id = "verrou"; o.className = "verrou";
    o.innerHTML = `<div class="vbox"><img src="icons/icon-192.png" alt="" width="84" height="84"><h2>Notes de frais</h2><p id="vNom"></p><button type="button" class="btn primary" id="vOuvrir">🔒 Ouvrir avec Face ID</button><button type="button" class="btn ghost" id="vMdp">Utiliser mon mot de passe</button><p class="vErr" id="vErr"></p></div>`;
    (document.body || document.documentElement).appendChild(o); o.querySelector("#vNom").textContent = nomAff();
    const go = async auto => { const e = o.querySelector("#vErr"); e.textContent = ""; try { if (await verifier()) ouvrir(); } catch (er) { if (auto === true) return; e.textContent = er && er.name === "NotAllowedError" ? "Non reconnu ou annulé : touchez « Ouvrir avec Face ID » pour réessayer." : "Face ID indisponible : " + (er.message || er.name) + ". Utilisez votre mot de passe."; } };
    o.querySelector("#vOuvrir").onclick = () => go(false);
    o.querySelector("#vMdp").onclick = () => { const c = window.confirm; window.confirm = () => true; ouvrir(); try { deconnexion(); } finally { setTimeout(() => { window.confirm = c; }, 0); } };
    setTimeout(() => go(true), 350); }
  const peut = () => !!(window.PublicKeyCredential && navigator.credentials && window.isSecureContext);
  function bouton() { const d = document.getElementById("decoBar"); if (!d || !peut()) return; let b = document.getElementById("faceBar");
    if (!b) { b = document.createElement("button"); b.type = "button"; b.className = "decoBar"; b.id = "faceBar"; b.title = "Ouvrir l'appli avec Face ID / Touch ID"; b.onclick = async () => { if (actif()) { if (confirm("Désactiver Face ID pour ouvrir l'appli sur cet appareil ?")) { localStorage.removeItem(cle()); msg("Face ID désactivé"); bouton(); proposer(); } } else await activer(); }; d.before(b); }
    b.textContent = actif() ? "🔒 Face ID ✓" : "🔒 Face ID"; }
  /* carte « Activer Face ID » : un vrai bouton à toucher (iPhone : Face ID ne peut être lancé que par un geste) */
  function proposer() { const old = document.getElementById("faceCarte"); if (!peut() || actif() || typeof session === "undefined" || !session || typeof moi === "undefined" || !moi || !moi.actif) { if (old) old.remove(); return; }
    let plus = 0; try { plus = +localStorage.getItem("kcm-faceid-plustard-" + session.user.id) || 0; } catch (e) { } if (Date.now() - plus < 3 * 864e5 || old) return;
    const m = document.getElementById("main"); if (!m) return; const c = document.createElement("div"); c.id = "faceCarte"; c.className = "faceCarte";
    c.innerHTML = `<b>🔒 Ouvrir l'appli avec Face ID</b><span>Plus besoin du mot de passe : votre visage suffit pour ouvrir Notes de frais sur ce téléphone.</span><div class="fcB"><button type="button" class="btn primary" id="fcOui">Activer Face ID</button><button type="button" class="btn ghost" id="fcNon">Plus tard</button></div><small id="fcErr"></small>`;
    m.prepend(c);
    c.querySelector("#fcOui").onclick = async () => { const ok = await activer(); if (ok) c.remove(); else c.querySelector("#fcErr").textContent = dispo ? "Face ID n'a pas été activé. Réessayez, ou vérifiez Réglages › Face ID et code › « Remplissage automatique »." : "Ce téléphone ne propose pas Face ID pour les applis web (iOS 16 ou plus récent requis)."; };
    c.querySelector("#fcNon").onclick = () => { try { localStorage.setItem("kcm-faceid-plustard-" + session.user.id, String(Date.now())); } catch (e) { } c.remove(); }; }
  // dès l'ouverture : verrou si Face ID est activé pour la personne connectée
  const premier = () => { if (controle || !uidLocal()) return; controle = true; if (actif()) verrouiller(); };
  if (document.body) premier(); else document.addEventListener("DOMContentLoaded", premier);
  document.addEventListener("visibilitychange", () => { if (document.hidden) cache = Date.now(); else if (cache && Date.now() - cache > 60000) verrouiller(); });
  (async () => { try { dispo = !!(window.PublicKeyCredential && await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()); } catch (e) { dispo = false; }
    if (typeof rendre === "function") { const r0 = rendre; rendre = function () { const r = r0.apply(this, arguments); try { premier(); bouton(); setTimeout(proposer, 50); } catch (e) { } return r; }; }
    premier(); bouton(); proposer(); })();
})();
