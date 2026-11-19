# Kotori Japanese Academy — PWA 初期專案

這個資料夾保留原本的 Kotori HTML 學習介面，並加入 PWA 所需的基本檔案：

- `index.html`：原有互動式學習原型
- `manifest.webmanifest`：App 名稱、圖示及主畫面顯示設定
- `sw.js`：Service Worker，負責快取核心檔案及基本離線開啟
- `icons/`：主畫面圖示

## 重要：如何在 iPhone 安裝

單靠本機 HTML 檔案不能完成 PWA 安裝。必須先把整個資料夾部署到支援 HTTPS 的網站。

部署後：
1. 用 iPhone Safari 開啟網站網址。
2. 點 Safari 的分享按鈕。
3. 選擇「加入主畫面」。
4. 確認名稱後加入。

## 注意事項

- 這是 PWA 技術骨架／初期版本，不代表已經部署到公開網址。
- Service Worker 只會在 HTTPS（或 localhost）環境註冊。
- 原型現有的 XP、金幣及學習狀態仍使用瀏覽器 localStorage；不同瀏覽器或清除網站資料可能影響紀錄。
- 本版本沒有加入雲端同步、登入、AI 對話或語音辨識。
