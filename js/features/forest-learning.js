// Kotori 2.8.8 — Smart-review progress and result feedback.
// Shared vocabulary/state helpers are provided by content.js and app.js.
function smartRecord(word,correct,mode){
 const x=smartStat(word);x.attempts++;x.lastAt=Date.now();
 if(correct){x.correct++;x.streak++;x.interval=x.streak===1?1:x.streak===2?3:x.streak===3?7:14;x.level=Math.min(4,Math.max(x.level,Math.min(4,1+x.streak)));}
 else{x.streak=0;x.interval=0;x.level=Math.max(1,x.level-1);}
 x.dueAt=Date.now()+(correct?x.interval*86400000:2*60*60*1000);
 state.smartReviewLog.push({id:word.id,correct:!!correct,mode:mode||'review',at:Date.now()});
 if(state.smartReviewLog.length>500)state.smartReviewLog=state.smartReviewLog.slice(-500);
 const recent=state.smartReviewLog.slice(-20);const rate=recent.length?recent.filter(a=>a.correct).length/recent.length:0.7;
 if(recent.length>=5&&state.smartReviewLog.length%5===0){if(rate>=.85)state.adaptiveLevel=Math.min(4,state.adaptiveLevel+1);else if(rate<.60)state.adaptiveLevel=Math.max(1,state.adaptiveLevel-1);}
 save();
}
let smartQuiz={items:[],index:0,selected:-1,answered:false,score:0,finished:false,mode:'review',wrongItems:[]};
function startSmartReview(mistakesOnly=false,categoryFilter=''){
 const allWords=allKotoriWords();const words=categoryFilter?vocabForestWords(categoryFilter):allWords;let pool=mistakesOnly?words.filter(w=>{const x=smartStat(w);return x.streak===0&&x.attempts>0;}):words.filter(w=>{const x=smartStat(w);return (x.dueAt>0&&x.dueAt<=Date.now())||x.attempts===0||x.streak<3;});
 if(!pool.length&&!mistakesOnly)pool=words.filter(w=>smartStat(w).attempts===0);
 if(!pool.length)pool=words.filter(w=>smartStat(w).streak<3);
 if(!pool.length){alert(categoryFilter?`「${categoryFilter}」目前沒有需要複習的單字。`:'太好了！目前 60 個單字都已達到熟練標準。');return;}
 pool.sort((a,b)=>{const x=smartStat(a),y=smartStat(b),now=Date.now();const xr=x.dueAt>0&&x.dueAt<=now?0:x.attempts?1:2;const yr=y.dueAt>0&&y.dueAt<=now?0:y.attempts?1:2;return xr-yr||(smartAccuracy(x)-smartAccuracy(y))||(x.dueAt||0)-(y.dueAt||0);});
 const chosen=shuffleArray(pool.slice(0,Math.min(pool.length,20))).slice(0,10);
 smartQuiz={items:chosen.map(w=>{
  const x=smartStat(w),acc=smartAccuracy(x);let mode=state.adaptiveLevel;
  if(x.attempts>=3&&acc<.6)mode=1;else if(x.attempts>=3&&acc>=.85)mode=Math.min(4,Math.max(mode,3));
  const all=words.filter(o=>o.id!==w.id);let correct,opts;
  if(mode===1){correct=w.meaning;opts=shuffleArray([correct,...shuffleArray(all.filter(o=>o.meaning!==correct)).slice(0,3).map(o=>o.meaning)]);}
  else if(mode===2){correct=w.jp;opts=shuffleArray([correct,...shuffleArray(all.filter(o=>o.jp!==correct)).slice(0,3).map(o=>o.jp)]);}
  else if(mode===3){correct=w.jp;opts=shuffleArray([correct,...shuffleArray(all.filter(o=>o.jp!==correct)).slice(0,3).map(o=>o.jp)]);}
  else{correct=w.exampleMeaning||w.meaning;opts=shuffleArray([correct,...shuffleArray(all.filter(o=>(o.exampleMeaning||o.meaning)!==correct)).slice(0,3).map(o=>o.exampleMeaning||o.meaning)]);}
  return {word:w,mode,opts,answer:opts.indexOf(correct)};
 }),index:0,selected:-1,answered:false,score:0,finished:false,mode:mistakesOnly?'mistakes':'review',category:categoryFilter,wrongItems:[]};
 setPage('smartReview');
}
function answerSmartReview(i){if(smartQuiz.answered)return;const q=smartQuiz.items[smartQuiz.index];smartQuiz.selected=i;smartQuiz.answered=true;const ok=i===q.answer;if(ok)smartQuiz.score++;else smartQuiz.wrongItems.push(q.word);smartRecord(q.word,ok,'level'+q.mode);render();}
function nextSmartReview(){smartQuiz.index++;smartQuiz.selected=-1;smartQuiz.answered=false;if(smartQuiz.index>=smartQuiz.items.length){smartQuiz.finished=true;const today=localDayKey();if(smartQuiz.score>=Math.ceil(smartQuiz.items.length*.7)&&state.smartReviewRewardDate!==today){state.xp+=5;state.coins+=2;state.smartReviewRewardDate=today;smartQuiz.rewarded=true;save();}else smartQuiz.rewarded=false;render();}else render();}
function renderSmartReview(m){
 if(smartQuiz.finished){
  const total=smartQuiz.items.length,rate=total?Math.round(smartQuiz.score/total*100):0;
  const wrong=smartQuiz.wrongItems||[];
  const wrongMarkup=wrong.length?`<div class="section-title">本次需要加強的單字</div>${wrong.map(w=>`<div class="tile"><span style="flex:1"><strong>${w.jp} <small>${w.reading}</small></strong><small>${w.meaning}${w.example?` · ${w.example}`:''}</small></span><button class="speak-btn" onclick="speakJapanese('${w.jp}','${w.reading}')">🔊</button></div>`).join('')}`:'<div class="feedback">本次沒有錯題，太棒了！🌸</div>';
  m.innerHTML=`<div class="eyebrow">SMART REVIEW · RESULT</div><div class="h1">智能複習完成！✨</div><div class="panel" style="text-align:center"><div style="font-size:46px">${rate>=70?'🏆':'🌱'}</div><div class="jp">${smartQuiz.score} / ${total}</div><b>${rate>=70?'よくできました！做得很好！':'再練習一次就會更熟悉！'}</b><div class="progress"><i style="width:${rate}%"></i></div><div class="statgrid"><div class="statbox"><strong>${rate}%</strong><span class="muted">本次正確率</span></div><div class="statbox"><strong>${wrong.length}</strong><span class="muted">需要加強</span></div></div><div class="muted">本次單字的熟練度及下次複習時間已更新。${smartQuiz.category?`本次完成「${smartQuiz.category}」分類。`:""}</div></div>${smartQuiz.rewarded?'<div class="feedback">🎁 獲得 +5 XP 及 +2 金幣！</div>':''}${wrongMarkup}<button class="btn" onclick="startSmartReview(false,smartQuiz.category||'')">再做一輪智能複習</button><button class="btn secondary" onclick="setPage('smartReport')">查看學習報告</button><button class="btn secondary" onclick="vocabForestCategory=smartQuiz.category||vocabForestCategory;setPage('vocabPage')">返回單字森林</button>`;return;
 }
 if(!smartQuiz.items.length){const due=smartDueWords().length,all=allKotoriWords(),fresh=all.filter(w=>smartStat(w).attempts===0).length;m.innerHTML=`<div class="eyebrow">KOTORI 2.8.8 · SMART REVIEW</div><div class="h1">智能複習室 🧠</div><div class="panel"><b>今天的記憶狀態</b><div class="statgrid"><div class="statbox"><strong>${due}</strong><span class="muted">到期複習</span></div><div class="statbox"><strong>${fresh}</strong><span class="muted">尚未練習</span></div></div><div class="muted">系統會優先安排到期及較不熟悉的單字，並按近期表現調整題型。</div></div><button class="btn" onclick="startSmartReview(false)">開始智能複習</button><button class="btn secondary" onclick="startSmartReview(true)">只練習需要加強的單字</button><button class="btn secondary" onclick="setPage('smartReport')">查看 60 個單字的熟練度</button><button class="btn secondary" onclick="setPage('vocabPage')">返回單字森林</button>`;return;}
 const q=smartQuiz.items[smartQuiz.index],prompt=q.mode===1?q.word.jp:q.mode===2?q.word.meaning:q.mode===3?'請聽讀音並選出單字':(q.word.example||q.word.jp);
 m.innerHTML=`<div class="eyebrow">SMART REVIEW · ${smartQuiz.index+1} / ${smartQuiz.items.length}</div><div class="h1">智能複習 🧠</div><div class="muted">第 ${smartQuiz.index+1} 題，共 ${smartQuiz.items.length} 題　·　目前答對 ${smartQuiz.score} 題</div><div class="progress"><i style="width:${(smartQuiz.index+1)/smartQuiz.items.length*100}%"></i></div><div class="panel" style="text-align:center;padding:22px"><div class="muted">${q.mode===1?'這個日文單字是甚麼意思？':q.mode===2?'請選出對應的日文單字':q.mode===3?'聆聽讀音，再選出單字':'選出正確的中文意思'}</div>${q.mode===3?`<button class="speak-btn" style="width:58px;height:58px;font-size:25px;margin:14px" onclick="speakJapanese(smartQuiz.items[smartQuiz.index].word.jp,smartQuiz.items[smartQuiz.index].word.reading)">🔊</button>`:`<div class="jp" style="font-size:${q.mode===4?'23':'32'}px;margin:15px 0">${prompt}</div>${q.mode===4?`<div class="reading">${q.word.exampleReading||q.word.reading}</div>`:''}`}</div><div class="choices">${q.opts.map((o,i)=>`<button class="choice ${smartQuiz.answered&&i===q.answer?'correct':''} ${smartQuiz.answered&&i===smartQuiz.selected&&i!==q.answer?'wrong':''}" ${smartQuiz.answered?'disabled':''} onclick="answerSmartReview(${i})">${'ABCD'[i]}. ${o}</button>`).join('')}</div>${smartQuiz.answered?`<div class="feedback ${smartQuiz.selected===q.answer?'':'bad'}"><b>${smartQuiz.selected===q.answer?'🎉 正確！':'再記住這個單字！'}</b><br>${q.word.jp}（${q.word.reading}）＝${q.word.meaning}${q.word.example?`<br>${q.word.example}<br>${q.word.exampleMeaning}`:''}</div><button class="btn" onclick="nextSmartReview()">${smartQuiz.index===smartQuiz.items.length-1?'查看結果':'下一題 →'}</button>`:''}`;
}
