Kotori Japanese Academy 2.3（PWA）

本次新增：
- 每日學習路線：五十音、單字、文法、間隔複習、故事、漫畫六項任務
- 每項每日任務完成後可獲得 5 XP 和 2 金幣；同一天每項只計算一次
- 記憶補給站：可把不熟悉的假名／單字加入複習卡，安排明天或較後時間再複習
- 保留原有 localStorage 存檔識別碼，避免更新後 XP／金幣歸零
- Service Worker 快取名稱更新為 kotori-academy-v21

更新方法：
1. 解壓縮 ZIP。
2. 開啟 kotori_pwa_project 資料夾。
3. 將資料夾內所有檔案和 icons 資料夾上傳到原本 GitHub Repository 根目錄，覆蓋同名檔案。
4. Commit changes，等待 GitHub Pages 部署完成。
5. iPhone 連接網絡，關閉並重開 Kotori；若仍見舊版，先在 Safari 網站頁面重新整理一次，再開啟主畫面圖示。

注意：每日任務由使用者在完成練習後自行按完成；記憶補給站是簡易間隔複習功能。此版本仍屬個人化初期原型，非完整官方 JLPT 課程；尚未加入語音辨識、AI 對話及完整聽力音檔。

2.3 新增：五十音隨機測驗（平假名／片假名各自抽 10 題）；答對 7 題或以上，每日首次可獲 10 XP 及 3 金幣。原有 localStorage 儲存鍵保持不變，以保留舊進度。
