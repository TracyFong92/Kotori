// Kotori 2.8.6 — Vocabulary Forest view layer.
// Uses shared data/state/helpers declared by content.js, storage.js and app.js.

function vocabForestCategoryFor(word){
 if(word.id&&word.id.startsWith('old:'))return '日常生活';
 const found=vocab25Cards.find(x=>x.jp===word.jp);
 return found?.category||'日常生活';
}
function vocabForestWords(category){
 return allKotoriWords().filter(w=>vocabForestCategoryFor(w)===category);
}
function renderVocabForest(m){
 const categories=['日常生活','動漫漫畫','JLPT N5'];
 const counts=Object.fromEntries(categories.map(c=>[c,vocabForestWords(c).length]));
 if(!categories.includes(vocabForestCategory))vocabForestCategory='日常生活';
 const active=vocabForestWords(vocabForestCategory);
 const due=active.filter(w=>{const x=smartStat(w);return x.dueAt>0&&x.dueAt<=Date.now();}).length;
 const weak=active.filter(w=>{const x=smartStat(w);return x.attempts>0&&x.streak===0;}).length;
 const practiced=active.filter(w=>smartStat(w).attempts>0).length;
 const mastered=active.filter(w=>{const x=smartStat(w);return x.streak>=3&&x.correct>=4;}).length;
 m.innerHTML=`<div class="eyebrow">VOCABULARY FOREST · VERSION 2.8.8</div><div class="h1">單字森林 🌳</div>
 <div class="panel" style="margin:8px 0 12px"><div class="forest-hero-top"><b>🐤 今日單字進度</b><span class="tag">${practiced}/${active.length} 已練習</span></div><div class="progress" style="margin:9px 0 6px"><i style="width:${active.length?practiced/active.length*100:0}%"></i></div><div class="muted">本分類有 ${due} 個到期複習、${weak} 個需要加強、${mastered} 個已熟練。</div></div>
 <div class="forest-sticky"><div class="muted" style="font-weight:800;color:var(--ink)">先選擇想學習的分類</div><div class="forest-categories">${categories.map(c=>`<button class="forest-category ${vocabForestCategory===c?'active':''}" ${counts[c]===0?'disabled':''} onclick="vocabForestCategory='${c}';render()">${c}<small>${counts[c]} 個單字</small></button>`).join('')}</div>
 <button class="forest-start" onclick="startSmartReview(false,vocabForestCategory)"><span class="action-icon">✨</span><span>智能複習＋測驗<small>${due?`${due} 個到期單字優先出題`:weak?`${weak} 個需要加強的單字優先出題`:'按記憶狀態安排本分類測驗'} · 約 10 題</small></span><span style="margin-left:auto;font-size:20px">›</span></button>
 <div class="forest-count">${vocabForestCategory} · ${active.length} 個單字 · ${practiced} 個已練習</div></div>
 ${active.length?active.map(w=>{const x=smartStat(w),newWord=vocab25Cards.find(z=>z.jp===w.jp),master=x.streak>=3&&x.correct>=4;return `<div class="word-card compact"><div class="word-top"><span class="tag">${vocabForestCategory}</span><span class="muted">${master?'🌟 已掌握':x.attempts?`答對 ${x.correct}/${x.attempts} 次`:'尚未練習'}</span></div><div class="jp">${w.jp}</div><div class="reading">${w.reading}</div><div class="muted" style="text-align:center">${w.meaning}</div><div class="word-buttons"><button class="speak-btn" onclick='speakJapanese(${JSON.stringify(w.jp)})' aria-label="播放單字發音">🔊</button>${newWord?`<button class="speak-btn" onclick='speakJapanese(${JSON.stringify(newWord.example)})' aria-label="播放例句發音">🗣️</button>`:''}<button class="speak-btn" onclick='addToReview("vocab",${JSON.stringify(w.jp)},${JSON.stringify(w.jp)},${JSON.stringify(w.reading)},${JSON.stringify(w.meaning)})' aria-label="加入複習">＋</button></div>${newWord?`<div class="word-example"><b>${newWord.example}</b><div class="reading">${newWord.exampleReading}</div><div class="muted">${newWord.exampleMeaning}</div></div>`:''}</div>`}).join(''):'<div class="panel muted">這個分類的單字尚未解鎖，完成前面的單字區域後便會開放。🌱</div>'}
 <div class="forest-tools"><button class="tool-link" style="width:100%" onclick="setPage('reviewPage')">🔖 我的收藏／釘選單字（${state.reviewItems.length}）</button><details><summary>更多學習工具及紀錄</summary><div class="tool-links"><button class="tool-link" onclick="setPage('smartMistakes')">🎯 錯題挑戰</button><button class="tool-link" onclick="setPage('smartReport')">📊 每日報告</button><button class="tool-link" onclick="setPage('vocab25Stats')">🌟 單字成長紀錄</button><button class="tool-link" onclick="setPage('vocabMistakes')">📝 舊版錯題紀錄（${state.vocabMistakes.length}）</button><button class="tool-link" onclick="setPage('reviewPage')">🧠 記憶補給站</button></div></details></div>`;
}
