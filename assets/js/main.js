// ====== Optional links (set to "" to hide buttons) ======
const LINKS = {
  paper: "",   // e.g., "https://arxiv.org/abs/xxxx.xxxxx" or "assets/paper.pdf"
  code:  "",   // e.g., "https://github.com/yourname/yourrepo"
  dataset: "", // e.g., dataset landing page
};

// ====== Demo config: one row per ID, 6 videos each ======
const DEMOS = {
  ids: ["ID1", "ID2", "ID3", "ID4", "ID5"],
  files: ["1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4", "6.mp4"],
  root: "assets/videos",
  mutedByDefault: true,
};

function $(id){ return document.getElementById(id); }

// Mobile nav toggle
(function(){
  const btn = $("navToggle");
  const nav = $("mobileNav");
  if(!btn || !nav) return;
  btn.addEventListener("click", ()=>{
    nav.style.display = (nav.style.display === "block") ? "none" : "block";
  });
})();

// Buttons visibility
(function(){
  const row = $("btnRow");
  const bPaper = $("btnPaper");
  const bCode = $("btnCode");
  const bDataset = $("btnDataset");

  const setBtn = (btn, url) => {
    if(!url){
      btn.style.display = "none";
      return;
    }
    btn.href = url;
  };

  setBtn(bPaper, LINKS.paper);
  setBtn(bCode, LINKS.code);
  setBtn(bDataset, LINKS.dataset);

  const allHidden = [bPaper, bCode, bDataset].every(b => b.style.display === "none");
  if(allHidden) row.style.display = "none";
})();

// Year
$("year").textContent = new Date().getFullYear();

// Build demo rows
(function(){
  const host = $("demoList");
  if(!host) return;

  const videoPath = (id, fn) => `${DEMOS.root}/${id}/${fn}`;

  // helper: pause others when one plays (reduces CPU/audio chaos)
  const allVideos = [];
  const attachSoloPlay = (v) => {
    v.addEventListener("play", ()=>{
      allVideos.forEach(x => { if(x !== v) x.pause(); });
    });
    allVideos.push(v);
  };

  DEMOS.ids.forEach(id=>{
    const row = document.createElement("div");
    row.className = "demo-row";

    const head = document.createElement("div");
    head.className = "demo-row-head";
    head.innerHTML = `<b>${id}</b><span>6 videos</span>`;

    const actions = document.createElement("div");
    actions.className = "demo-row-actions";

    const openFolder = document.createElement("a");
    openFolder.className = "small-chip";
    openFolder.textContent = "Open folder";
    openFolder.href = `${DEMOS.root}/${id}/`;
    openFolder.target = "_blank";
    openFolder.rel = "noreferrer";
    actions.appendChild(openFolder);

    head.appendChild(actions);

    const strip = document.createElement("div");
    strip.className = "demo-strip";

    DEMOS.files.forEach((fn, idx)=>{
      const tile = document.createElement("div");
      tile.className = "vtile";

      const meta = document.createElement("div");
      meta.className = "vtile-meta";
      meta.innerHTML = `<b>V${idx+1}</b><span>${fn}</span>`;

      const v = document.createElement("video");
      v.controls = true;
      v.playsInline = true;
      v.preload = "metadata";
      v.muted = DEMOS.mutedByDefault;
      v.src = videoPath(id, fn);

      attachSoloPlay(v);

      tile.appendChild(meta);
      tile.appendChild(v);
      strip.appendChild(tile);
    });

    row.appendChild(head);
    row.appendChild(strip);
    host.appendChild(row);
  });
})();

// BibTeX modal
(function(){
  const modal = $("bibtexModal");
  const openBtn = $("btnBibtex");
  const closeBtn = $("bibtexClose");
  const closeBtn2 = $("closeBibtex2");
  const copyBtn = $("copyBibtex");
  const textEl = $("bibtexText");

  if(!modal || !openBtn) return;

  openBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    modal.showModal();
  });
  closeBtn.addEventListener("click", ()=>modal.close());
  closeBtn2.addEventListener("click", ()=>modal.close());
  copyBtn.addEventListener("click", async ()=>{
    try{
      await navigator.clipboard.writeText(textEl.textContent);
      alert("Copied.");
    }catch{
      alert("Copy failed. Please copy manually.");
    }
  });

  modal.addEventListener("click", (e)=>{
    const rect = modal.getBoundingClientRect();
    const inside = rect.top<=e.clientY && e.clientY<=rect.bottom && rect.left<=e.clientX && e.clientX<=rect.right;
    if(!inside) modal.close();
  });
})();
