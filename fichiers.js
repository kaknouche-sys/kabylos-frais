/* Kabylos Notes de frais — enregistrer / partager un fichier (PDF de la note de frais, photos, pièces) sur iPhone, iPad et ordinateur */
(function () {
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const appli = window.matchMedia && matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const taille = n => n > 1048576 ? (n / 1048576).toFixed(1).replace(".", ",") + " Mo" : Math.max(1, Math.round(n / 1024)) + " Ko";
  function feuille(f) { const old = document.getElementById("ffeuille"); if (old) old.remove(); const u = URL.createObjectURL(f);
    const o = document.createElement("div"); o.id = "ffeuille"; o.className = "ffeuille";
    o.innerHTML = `<div class="ffb"><b class="ffn"></b><span class="fft">${taille(f.size)} · ${/pdf/.test(f.type) ? "PDF" : "image"}</span>
      ${navigator.share ? `<button type="button" class="btn primary" id="ffPart">📤 Enregistrer dans Fichiers ou envoyer</button>` : ""}
      <a class="btn" id="ffOuv" href="${u}" target="_blank" rel="noopener">👁 Ouvrir ${/pdf/.test(f.type) ? "le PDF" : "l'image"}</a>
      ${ios && appli ? "" : `<a class="btn" id="ffDl" href="${u}" download="">⬇ Télécharger</a>`}
      <button type="button" class="btn ghost" id="ffFer">Fermer</button>
      ${ios ? `<p class="ffa">Sur iPhone / iPad : touchez « Enregistrer dans Fichiers ou envoyer », puis « Enregistrer dans Fichiers » (ou Mail, Messages, WhatsApp…).</p>` : ""}</div>`;
    document.body.appendChild(o); o.querySelector(".ffn").textContent = f.name; const dl = o.querySelector("#ffDl"); if (dl) dl.setAttribute("download", f.name);
    const fermer = () => { o.remove(); setTimeout(() => URL.revokeObjectURL(u), 120000); };
    o.querySelector("#ffFer").onclick = fermer; o.addEventListener("click", e => { if (e.target === o) fermer(); });
    const p = o.querySelector("#ffPart"); if (p) p.onclick = async () => { try { await navigator.share({ files: [f], title: f.name }); fermer(); } catch (e) { if (!(e && e.name === "AbortError")) { try { await navigator.share({ url: u, title: f.name }); } catch (x) { } } } }; }
  async function partager(blob, nom) { const f = new File([blob], nom, { type: blob.type || (/\.pdf$/i.test(nom) ? "application/pdf" : "application/octet-stream") });
    let peut = false; try { peut = !!(navigator.canShare && navigator.canShare({ files: [f] })); } catch (e) { }
    if (peut && (ios || /Android/i.test(navigator.userAgent))) { try { await navigator.share({ files: [f], title: nom }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
    feuille(f); }
  window.kcPartager = partager;
  // photos et pièces (visionneuse)
  try { enregistrerFichier = (blob, nom) => partager(blob, nom); } catch (e) { }
  // PDF de la note de frais (jsPDF)
  try { const J = window.jspdf && window.jspdf.jsPDF; if (J && J.API) J.API.save = function (nom) { partager(this.output("blob"), nom || "document.pdf"); return this; }; } catch (e) { }
  const s = document.createElement("style"); s.textContent = ".ffeuille{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,.55);display:flex;align-items:flex-end;justify-content:center;padding:12px}.ffb{background:#fff;color:#222;border-radius:18px;padding:18px 16px calc(16px + env(safe-area-inset-bottom));width:100%;max-width:440px;display:grid;gap:10px;box-shadow:0 -6px 30px rgba(0,0,0,.3)}.ffb .btn{text-align:center;text-decoration:none;justify-content:center}.ffn{font-size:15px;word-break:break-word}.fft{font-size:12.5px;color:#777;margin-top:-6px}.ffa{margin:0;font-size:12.5px;color:#666}";
  document.head.appendChild(s);
})();
