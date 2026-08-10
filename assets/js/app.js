(() => {
  const cfg = window.GAME_CONFIG;
  const $ = (id) => document.getElementById(id);
  const stage = $("game-stage"), message = $("stage-message"), start = $("start-button");
  const scoreEl = $("score"), comboEl = $("combo"), timeEl = $("time"), bestEl = $("best-score");
  const dialog = $("result-dialog");
  let running = false, score = 0, combo = 0, deadline = 0, lastHit = 0, spawnTimer, frame;
  let best = Number(localStorage.getItem("stardash-best") || 0); bestEl.textContent = best;

  function track(event, data = {}) { console.info("[analytics]", event, data); }
  function renderCampaigns() { $("campaign-grid").innerHTML = cfg.campaigns.map(c => `<article class="campaign"><div class="campaign__icon">${c.icon}</div><h3>${c.title}</h3><p>${c.text}</p><a href="${c.href}" data-event="campaign_click">${c.cta} →</a></article>`).join(""); }
  function resetGame() { score = combo = 0; scoreEl.textContent = "0"; comboEl.textContent = "×0"; timeEl.textContent = cfg.game.durationSeconds.toFixed(1); stage.querySelectorAll(".orb").forEach(x => x.remove()); }
  function spawnOrb() {
    if (!running) return;
    const orb = document.createElement("button"), rare = Math.random() < .13;
    const size = rare ? 62 : 48;
    orb.className = `orb${rare ? " orb--rare" : ""}`; orb.type = "button"; orb.setAttribute("aria-label", rare ? "稀有光球，點擊得 3 分" : "光球，點擊得 1 分");
    orb.style.width = orb.style.height = `${size}px`;
    orb.style.left = `${Math.random() * (stage.clientWidth - size)}px`;
    orb.style.top = `${Math.random() * (stage.clientHeight - size)}px`;
    const remove = setTimeout(() => orb.remove(), cfg.game.baseOrbLifetimeMs);
    orb.addEventListener("pointerdown", () => { clearTimeout(remove); if (!running) return; const now = performance.now(); combo = now - lastHit < 900 ? combo + 1 : 1; lastHit = now; const points = rare ? 3 : 1; score += points + Math.floor(combo / 10); scoreEl.textContent = score; comboEl.textContent = `×${combo}`; orb.remove(); track("orb_hit", { rare, score, combo }); }, { once: true });
    stage.append(orb);
  }
  function tick() { const left = Math.max(0, deadline - performance.now()); timeEl.textContent = (left / 1000).toFixed(1); if (left <= 0) return endGame(); frame = requestAnimationFrame(tick); }
  function startGame() { if (running) return; resetGame(); running = true; message.hidden = true; start.disabled = true; start.textContent = "挑戰中…"; deadline = performance.now() + cfg.game.durationSeconds * 1000; spawnOrb(); spawnTimer = setInterval(spawnOrb, cfg.game.spawnIntervalMs); tick(); track("game_start"); }
  function endGame() { running = false; clearInterval(spawnTimer); cancelAnimationFrame(frame); stage.querySelectorAll(".orb").forEach(x => x.remove()); start.disabled = false; start.textContent = "再次挑戰"; $("share-button").hidden = false; if (score > best) { best = score; localStorage.setItem("stardash-best", best); bestEl.textContent = best; } $("final-score").textContent = score; $("result-copy").textContent = score >= 35 ? "太耀眼了！把這局分享給朋友吧。" : "再試一次，連擊是突破高分的關鍵。"; dialog.showModal(); track("game_complete", { score, best }); }
  start.addEventListener("click", startGame); $("play-again").addEventListener("click", () => { dialog.close(); startGame(); }); $("dialog-close").addEventListener("click", () => dialog.close());
  $("share-button").addEventListener("click", async () => { const text = `我在星躍衝刺拿到 ${score} 分！你能超越我嗎？`; try { if (navigator.share) await navigator.share({ title: "星躍衝刺", text }); else await navigator.clipboard.writeText(text); track("share", { score }); } catch (_) {} });
  $("reward-button").addEventListener("click", () => { alert("這是獎勵式廣告的串接預留流程。正式版請在此呼叫廣告平台 SDK，並於驗證完成後發放獎勵。"); track("reward_ad_requested"); });
  $("signup-form").addEventListener("submit", e => { e.preventDefault(); const email = $("email"); const output = $("form-message"); if (!email.checkValidity()) { output.textContent = "請輸入有效的電子郵件。"; return; } output.textContent = "已登記！正式版可在此送往 CRM 或電子報服務。"; track("newsletter_signup", { emailDomain: email.value.split("@")[1] }); e.target.reset(); });
  $("sound-toggle").addEventListener("click", e => { const muted = e.currentTarget.getAttribute("aria-pressed") === "true"; e.currentTarget.setAttribute("aria-pressed", String(!muted)); e.currentTarget.textContent = muted ? "♬" : "♩"; });
  document.addEventListener("click", e => { if (e.target.matches("[data-event]")) track(e.target.dataset.event); }); renderCampaigns();
})();
