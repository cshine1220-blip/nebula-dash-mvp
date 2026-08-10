/* 集中管理可替換的商業與內容設定；正式上線時由 CMS 或 API 提供。 */
window.GAME_CONFIG = {
  game: { durationSeconds: 30, baseOrbLifetimeMs: 1050, spawnIntervalMs: 620 },
  campaigns: [
    { icon: "🎁", title: "新手星光禮", text: "完成首次挑戰，取得會員活動入口。", cta: "查看活動", href: "#" },
    { icon: "🏆", title: "每週排行榜", text: "累積高分，參加品牌合作抽獎。", cta: "排行榜即將開放", href: "#" },
    { icon: "✨", title: "限定合作企劃", text: "此卡可替換為商品、聯名或導購活動。", cta: "探索企劃", href: "#" }
  ],
  ads: {
    // 整合廣告平台時，在此保留 slot ID；前端由廣告供應商 SDK 填入對應 data-ad-slot。
    enabled: false,
    slots: { top: "", reward: "" }
  }
};
