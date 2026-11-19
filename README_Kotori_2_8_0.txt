Kotori 日本語學園 2.8.0 更新包
版本主題：World Map & Chapter System（學園世界地圖與章節系統）

更新內容
1. 學習地圖改為六個學習區域的世界地圖：五十音花園、單字森林、文法學院、對話咖啡店、漫畫圖書館及 JLPT 試煉塔。
2. 每個區域設有 3 個循序漸進章節，共 18 個章節節點。
3. 每個章節包含學習課程及挑戰節點；開啟兩個節點後可標記章節完成，解鎖該區域下一章。
4. 各區域的章節進度獨立保存；六個區域的第一章均可自由開始。
5. 進入學習內容、章節、測驗、漫畫及故事頁面時隱藏 LV／XP／金幣狀態列；首頁及世界地圖保留狀態列。
6. 保留原有課程頁面及所有 2.7.2 學習功能，2.8.0 暫不新增漫畫或角色內容。

資料保存
- localStorage 主鍵仍為 kotori-jp-v1。
- 新增 chapterCompleted、chapterVisited 等章節欄位，採用向後兼容方式。
- 保留 XP、金幣、收藏、錯題、60 個舊單字、智能複習及其他學習紀錄。
- Service Worker 快取更新為 kotori-academy-v28-0。

更新方式
1. 解壓縮 ZIP。
2. 開啟 kotori_pwa_project 資料夾。
3. 將資料夾內所有檔案及 icons 資料夾上傳至 GitHub Repository 根目錄並覆蓋同名檔案。
4. Commit changes，等待 GitHub Pages 綠色剔號。
5. 使用 Safari 開啟網站，然後重新開啟 iPhone 主畫面上的 Kotori。

注意
- 不要清除 Safari 網站資料或重設 App。
- 請先確認原有 XP、金幣及收藏仍然保留，再測試新地圖及章節系統。
