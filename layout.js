(async function () {
  const base = [["index.html", "الرئيسية"], ["how.html", "كيف نعمل"], ["about.html", "من نحن"], ["contact.html", "اتصل بنا"]];
  const cur = location.pathname.split("/").pop() || "index.html";
  const hdr = document.getElementById("hdr");
  hdr.innerHTML = '<a class="brand" href="index.html"><img src="logo.svg" alt=""><span><b></b><small></small></span></a><nav></nav>';
  hdr.querySelector("b").textContent = SITE.name;
  hdr.querySelector("small").textContent = SITE.slogan;
  const nav = hdr.querySelector("nav");
  function link(h, t, on) {
    const a = document.createElement("a");
    a.href = h; a.textContent = t;
    if (on) a.className = "on";
    nav.appendChild(a);
  }
  base.forEach(([h, t]) => link(h, t, cur === h));
  document.getElementById("ftr").textContent = "© " + new Date().getFullYear() + " " + SITE.name;
  try {
    const r = await fetch(SITE.supa + "/rest/v1/pages?select=slug,title,external_url,is_paid&published=eq.true&show_in_menu=eq.true&order=sort", { headers: { apikey: SITE.key } });
    if (r.ok) (await r.json()).forEach(p => link(p.external_url || "page.html?s=" + encodeURIComponent(p.slug), p.title + (p.is_paid ? " ★" : ""), false));
  } catch (e) {}
})();
