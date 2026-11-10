(() => {
  const host = document.getElementById("menu-host");
  const root = document.documentElement;
  if (!host) return;

  function createSettingsMenu() {
    const picker = document.createElement("div");
    picker.className = "settings-picker";

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "settings-trigger";
    trigger.setAttribute("aria-label", "Pengaturan tampilan");
    trigger.setAttribute("aria-haspopup", "menu");
    trigger.setAttribute("aria-expanded", "false");
    trigger.title = "Tampilan dan warna";
    trigger.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3a9 9 0 1 0 0 18h1.2a2.3 2.3 0 0 0 1.7-3.8 1.3 1.3 0 0 1 1-2.2H18a3 3 0 0 0 3-3c0-5-4-9-9-9Z"/><circle cx="7.5" cy="10" r="1"/><circle cx="11" cy="6.8" r="1"/><circle cx="15.5" cy="8" r="1"/><circle cx="7.5" cy="14" r="1"/></svg>';

    const menu = document.createElement("div");
    menu.className = "settings-menu appearance-menu";
    menu.setAttribute("role", "menu");
    menu.setAttribute("aria-label", "Tampilan dan warna");
    menu.tabIndex = -1;
    menu.hidden = true;

    const palettes = [
      {value:"blue",label:"Biru",strong:"#5B9BD5",row:"#DDEBF7",alternate:"#BDD7EE"},
      {value:"orange",label:"Jingga",strong:"#ED7D31",row:"#FCE4D6",alternate:"#F8CBAD"},
      {value:"gray",label:"Abu-abu",strong:"#A5A5A5",row:"#E7E6E6",alternate:"#D6DCE4"},
      {value:"yellow",label:"Kuning",strong:"#FFC000",row:"#FFF2CC",alternate:"#FFE699"},
      {value:"navy",label:"Biru tua",strong:"#4472C4",row:"#D9E2F3",alternate:"#B4C7E7"},
      {value:"green",label:"Hijau",strong:"#70AD47",row:"#E2F0D9",alternate:"#C6E0B4"}
    ];

    function setPalette(value,persist=true) {
      if (!palettes.some(item=>item.value===value)) return;
      root.dataset.palette=value;
      paletteGrid.querySelectorAll("[data-palette]").forEach(option=>
        option.setAttribute("aria-checked",String(option.dataset.palette===value)));
      if(persist) try {localStorage.setItem("ujian-harian-palette-style",value);} catch (_) {}
    }
    function makeBranch(label,submenuLabel) {
      const branch=document.createElement("div");
      branch.className="settings-branch";
      const branchTrigger=document.createElement("button");
      branchTrigger.type="button";
      branchTrigger.className="settings-item settings-branch-trigger";
      branchTrigger.setAttribute("role","menuitem");
      branchTrigger.setAttribute("aria-haspopup","menu");
      branchTrigger.setAttribute("aria-expanded","false");
      branchTrigger.innerHTML=`<span>${label}</span><span class="settings-chevron" aria-hidden="true">›</span>`;
      const submenu=document.createElement("div");
      submenu.className="settings-submenu";
      submenu.setAttribute("role","menu");
      submenu.setAttribute("aria-label",submenuLabel);
      branch.append(branchTrigger,submenu);
      branch.addEventListener("mouseenter",()=>branchTrigger.setAttribute("aria-expanded","true"));
      branch.addEventListener("mouseleave",()=>{
        if(!branch.contains(document.activeElement)) branchTrigger.setAttribute("aria-expanded","false");
      });
      branch.addEventListener("focusin",()=>branchTrigger.setAttribute("aria-expanded","true"));
      branch.addEventListener("focusout",event=>{
        if(!branch.contains(event.relatedTarget)) branchTrigger.setAttribute("aria-expanded","false");
      });
      return {branch,submenu};
    }

    const paletteBranch=makeBranch("Skema Warna","Pilih satu skema warna");
    paletteBranch.submenu.classList.add("palette-submenu");
    const paletteGrid=document.createElement("div");
    paletteGrid.className="palette-grid";
    palettes.forEach(palette=>{
      const option=document.createElement("button");
      option.type="button"; option.className="palette-option";
      option.dataset.palette=palette.value;
      option.setAttribute("role","menuitemradio");
      option.setAttribute("aria-label",palette.label);
      option.setAttribute("aria-checked","false");
      const preview=document.createElement("span");
      preview.className="palette-preview";
      preview.style.setProperty("--swatch-strong",palette.strong);
      preview.style.setProperty("--swatch-row",palette.row);
      preview.style.setProperty("--swatch-alt",palette.alternate);
      preview.innerHTML='<span class="palette-preview-head"></span><span class="palette-preview-row"></span><span class="palette-preview-row alternate"></span>';
      const label=document.createElement("span");
      label.className="palette-label"; label.textContent=palette.label;
      option.append(preview,label);
      option.addEventListener("click",()=>{setPalette(palette.value);closeMenu();trigger.focus();});
      paletteGrid.append(option);
    });
    paletteBranch.submenu.append(paletteGrid);

    const widthBranch=makeBranch("Lebar Area Isi","Atur lebar area isi");
    widthBranch.submenu.classList.add("width-submenu");
    const widthChoices=document.createElement("div");
    widthChoices.className="width-choice-list";
    const widthPresets=[
      {value:"standard",label:"Standar · 1120 px"},
      {value:"full",label:"Penuh · mengikuti layar"}
    ];
    function setContentWidth(value,persist=true) {
      if(value!=="standard"&&value!=="full") return false;
      root.style.setProperty("--focus-content-max-width",value==="full"?"100vw":"1120px");
      widthChoices.querySelectorAll("[data-content-width]").forEach(option=>
        option.setAttribute("aria-checked",String(option.dataset.contentWidth===value)));
      if(persist) try {localStorage.setItem("ujian-harian-content-width",value);} catch (_) {}
      return true;
    }
    widthPresets.forEach(preset=>{
      const option=document.createElement("button");
      option.type="button"; option.className="settings-item width-choice";
      option.dataset.contentWidth=preset.value;
      option.setAttribute("role","menuitemradio"); option.setAttribute("aria-checked","false");
      option.textContent=preset.label;
      option.addEventListener("click",()=>{setContentWidth(preset.value);closeMenu();trigger.focus();});
      widthChoices.append(option);
    });
    widthBranch.submenu.append(widthChoices);

    const separator=document.createElement("div");
    separator.className="settings-separator";
    separator.setAttribute("role","separator");
    const refreshOption=document.createElement("button");
    refreshOption.type="button"; refreshOption.className="settings-item settings-refresh-option";
    refreshOption.setAttribute("role","menuitem"); refreshOption.textContent="Refresh Halaman";
    refreshOption.addEventListener("click",()=>{
      closeMenu();
      const refreshUrl=new URL("./index.html",window.location.href);
      refreshUrl.searchParams.set("__refresh",String(Date.now()));
      window.location.assign(refreshUrl.href);
    });
    menu.append(paletteBranch.branch,widthBranch.branch,separator,refreshOption);

    function closeMenu() {
      menu.hidden=true;
      trigger.setAttribute("aria-expanded","false");
      menu.querySelectorAll(".settings-branch-trigger").forEach(item=>item.setAttribute("aria-expanded","false"));
    }
    trigger.addEventListener("click",()=>{
      menu.hidden=!menu.hidden;
      trigger.setAttribute("aria-expanded",String(!menu.hidden));
      if(!menu.hidden) menu.focus();
    });
    picker.append(trigger,menu);
    document.addEventListener("pointerdown",event=>{if(!picker.contains(event.target))closeMenu();});
    document.addEventListener("keydown",event=>{
      if(event.key==="Escape"&&!menu.hidden){closeMenu();trigger.focus();}
    });

    let selectedPalette="blue",selectedContentWidth="standard";
    try {
      const savedPalette=localStorage.getItem("ujian-harian-palette-style");
      const savedContentWidth=localStorage.getItem("ujian-harian-content-width");
      if(savedContentWidth==="full") selectedContentWidth="full";
      if(palettes.some(item=>item.value===savedPalette)) selectedPalette=savedPalette;
    } catch (_) {}
    setPalette(selectedPalette,false);
    setContentWidth(selectedContentWidth,false);
    return picker;
  }

  host.append(createSettingsMenu());
})();
