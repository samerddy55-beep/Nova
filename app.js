let history = [];
const chat = document.getElementById("chat");
function tpl(t) { document.getElementById("q").value = t; }
function resetChat() { history = []; chat.innerHTML = ""; }
function add(role, text) {
  const d = document.createElement("div");
  d.className = "msg " + role;
  d.textContent = text;
  chat.appendChild(d);
  chat.scrollTop = chat.scrollHeight;
  return d;
}
function go() {
  const q = document.getElementById("q");
  const t = q.value.trim();
  if (!t) return;
  q.value = "";
  send(t);
}
async function send(text) {
  add("user", text);
  history.push({ role: "user", content: text });
  const out = add("bot", "...");
  let full = "";
  try {
    const r = await fetch(SITE.ai, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-12) })
    });
    if (!r.ok) {
      out.textContent = "تعذر الرد (خطأ " + r.status + "). انتظر دقيقة وحاول مرة ثانية.";
      history.pop();
      return;
    }
    const reader = r.body.getReader(), dec = new TextDecoder();
    let buf = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop();
      for (const l of lines) {
        if (!l.startsWith("data: ")) continue;
        const p = l.slice(6).trim();
        if (p === "[DONE]") continue;
        try {
          full += JSON.parse(p).choices[0].delta.content || "";
          out.textContent = full;
          chat.scrollTop = chat.scrollHeight;
        } catch (e) {}
      }
    }
    history.push({ role: "assistant", content: full });
  } catch (e) {
    out.textContent = "تعذر الاتصال. تأكد من الإنترنت وحاول مرة ثانية.";
    history.pop();
  }
}
