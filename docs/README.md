# 星躍衝刺 MVP

這是一個不需建置工具的靜態網頁遊戲，使用 HTML、CSS、JavaScript 製作。直接以靜態主機部署即可（例如 GitHub Pages、Cloudflare Pages、Netlify 或 Vercel）。

## MVP 目標

1. 以 30 秒點擊遊戲建立短、可重玩的核心循環。
2. 用每日最佳分數、分享與後續排行榜提高回訪。
3. 在不影響遊戲區的前提下預留一個可關閉的懸浮廣告位置。
4. 以活動卡與玩家俱樂部表單承接聯名、導購、抽獎與 CRM 名單。

## 技術架構

```
瀏覽器
├── index.html：介面與廣告／活動容器
├── assets/css/styles.css：行動優先樣式
└── assets/js/
    ├── config.js：活動內容、廣告 slot 與遊戲平衡設定
    └── app.js：遊戲迴圈、localStorage、事件追蹤介面
        ├── 廣告 SDK（未來接入）
        ├── 分析工具（GA4/PostHog 等）
        └── API／CRM（未來接入）
```

## 商業化接入順序

1. **廣告**：在 `config.js` 填入 `floating` 的廣告 slot ID，並把廣告平台提供的 SDK 初始化集中放在 `app.js`。廣告內容應填入 `#floating-ad`；關閉按鈕會記錄 `floating_ad_closed` 事件。請遵守各平台對懸浮廣告、年齡及同意管理的政策。
2. **活動與聯名**：以 `config.js` 的 `campaigns` 改變首頁內容；正式版將它改為 CMS/API 回傳資料與合法落地頁網址。
3. **會員／名單**：把表單 submit handler 改為送至自己的後端或 CRM，伺服器端驗證後才儲存；加入隱私權政策、行銷同意與退訂機制。
4. **資料與排名**：新增後端 API（例如 Cloudflare Workers + D1 或 Supabase）驗證分數、保存帳號與排行榜。不可直接信任前端分數。

## 上線前檢查

- 補上隱私權、Cookie 同意、使用條款與年齡／地區限制。
- 為所有活動連結提供真實條款與到期時間。
- 分別在 Android Chrome、iOS Safari 及桌面瀏覽器測試觸控、分享和廣告不載入情境。
- 使用分析工具將 `console.info` 的 `track` 函式替換為正式事件上報。

## 本機開啟

可直接開啟 `index.html` 預覽；分享 API、廣告及 CRM 串接上線前應在 HTTPS 環境測試。
