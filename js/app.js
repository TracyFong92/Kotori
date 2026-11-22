const KEY='kotori-jp-v1';
let state=JSON.parse(localStorage.getItem(KEY)||'{"xp":0,"coins":0,"completed":[],"kanaIndex":0,"comicIndex":0,"storyDone":false}');
// Extend old saved progress safely; keep the original storage key so XP and coins remain intact.
state.reviewItems=Array.isArray(state.reviewItems)?state.reviewItems:[];
state.dailyDate=state.dailyDate||new Date().toLocaleDateString('en-CA');
state.dailyDone=Array.isArray(state.dailyDone)?state.dailyDone:[];
state.dailyChapterMissionDate=typeof state.dailyChapterMissionDate==='string'?state.dailyChapterMissionDate:'';
state.reviewIndex=Number.isInteger(state.reviewIndex)?state.reviewIndex:0;
state.vocabMistakes=Array.isArray(state.vocabMistakes)?state.vocabMistakes:[];
state.vocabStage=Math.max(1,Math.min(3,Number(state.vocabStage)||1));
state.vocab25Stage=Math.max(1,Math.min(3,Number(state.vocab25Stage)||1));
state.vocab25Stats=state.vocab25Stats&&typeof state.vocab25Stats==='object'?state.vocab25Stats:{};
state.vocab25Mistakes=Array.isArray(state.vocab25Mistakes)?state.vocab25Mistakes:[];
state.smartReview=state.smartReview&&typeof state.smartReview==='object'?state.smartReview:{};
state.smartReviewLog=Array.isArray(state.smartReviewLog)?state.smartReviewLog:[];
state.smartReviewRewardDate=state.smartReviewRewardDate||'';
state.adaptiveLevel=Number.isInteger(state.adaptiveLevel)?Math.max(1,Math.min(4,state.adaptiveLevel)):1;
// 2.8.3 chapter data is additive; never replace existing learning records.
state.chapterCompleted=Array.isArray(state.chapterCompleted)?state.chapterCompleted:[];
state.chapterVisited=state.chapterVisited&&typeof state.chapterVisited==='object'?state.chapterVisited:{};
state.selectedArea=typeof state.selectedArea==='string'?state.selectedArea:'kana';
state.currentChapter=Number.isInteger(state.currentChapter)?state.currentChapter:0;
state.chapterReturnKey=typeof state.chapterReturnKey==='string'?state.chapterReturnKey:'';
let page='home',previousPage='home',dailyTaskFlow=false,qIndex=0,selected='',answered=false,showHint=true,storyChoice=0,kanaMode='hiragana',reviewRevealed=false,kanaActivity='choose',kanaSelected=null,vocabForestCategory='日常生活';
let kanaQuiz={items:[],index:0,selected:-1,answered:false,score:0,finished:false};
let vocabQuiz={items:[],index:0,selected:-1,answered:false,score:0,finished:false,wrong:[]};
let vocab25Quiz={mode:'listen',items:[],index:0,selected:-1,answered:false,score:0,finished:false,wrong:[]};
let chapterQuiz={items:[],index:0,selected:-1,answered:false,score:0,finished:false,wrong:[],key:''};
state.chapterRewards=state.chapterRewards&&typeof state.chapterRewards==='object'?state.chapterRewards:{};
function localDayKey(){const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function ensureDaily(){const today=localDayKey();if(state.dailyDate!==today){state.dailyDate=today;state.dailyDone=[];save()}}
function markDaily(id){ensureDaily();if(!state.dailyDone.includes(id)){state.dailyDone.push(id);state.xp+=5;state.coins+=2;save()}setPage('home')}
function openDailyTask(p){dailyTaskFlow=true;setPage(p)}
function addToReview(type,key,front,reading,meaning){
 const id=type+':'+key; const found=state.reviewItems.find(x=>x.id===id);
 if(found){found.dueAt=Date.now();found.front=front;found.reading=reading;found.meaning=meaning;}
 else state.reviewItems.push({id,type,front,reading,meaning,dueAt:Date.now(),interval:1,reps:0});
 save();alert('已加入記憶補給站！下次可以在「記憶補給站」集中複習。');
}
function toggleKanaBookmark(mode,kana,reading,meaning){const main=document.getElementById('main'),top=main?main.scrollTop:0;const id='kana:'+mode+':'+kana;const i=state.reviewItems.findIndex(x=>x.id===id);if(i>=0)state.reviewItems.splice(i,1);else state.reviewItems.push({id,type:'kana',front:kana,reading,meaning,dueAt:Date.now(),interval:1,reps:0});save();render();const next=document.getElementById('main');if(next)next.scrollTop=top}
function selectKanaSquare(kana){const main=document.getElementById('main'),top=main?main.scrollTop:0;kanaSelected=kana;speakJapanese(kana);render();const next=document.getElementById('main');if(next)next.scrollTop=top}
function reviewDue(){return state.reviewItems.filter(x=>x.dueAt<=Date.now())}
function revealReview(){reviewRevealed=true;renderReview(document.getElementById('main'))}
function reviewMark(id,known){const item=state.reviewItems.find(x=>x.id===id);if(!item)return;item.reps=(item.reps||0)+1;item.interval=known?Math.min(30,Math.max(3,(item.interval||1)*2)):1;item.dueAt=Date.now()+item.interval*86400000;reviewRevealed=false;save();renderReview(document.getElementById('main'))}
function removePinnedItem(id){state.reviewItems=state.reviewItems.filter(x=>x.id!==id);save();renderReview(document.getElementById('main'));}
function renderReview(m){
 const due=reviewDue(); const all=state.reviewItems.length;
 const pinned=state.reviewItems.map(item=>`<div class="pinned-item"><div class="pin-text"><b>${item.front}</b><small>${item.reading||''}${item.meaning?' · '+item.meaning:''}</small></div><button class="pin-remove" onclick='removePinnedItem(${JSON.stringify(item.id)})'>移除</button></div>`).join('');
 if(!due.length){m.innerHTML=`<div class="eyebrow">SAVED WORDS · SPACED REVIEW</div><div class="h1">我的收藏／釘選內容 🔖</div><div class="panel"><div style="font-size:34px;text-align:center">🌱</div><b>你已收藏 ${all} 張卡片</b><div class="muted">你在五十音花園按下書籤，或在單字卡按下加入複習後，內容就會保存在這裏。到期的卡片會自動安排複習。</div></div><div class="section-title">已收藏的假名及單字</div>${all?pinned:'<div class="panel muted">目前還沒有收藏內容。到五十音花園按假名卡右上角的書籤，或在單字卡按「加入複習」。</div>'}<button class="btn secondary" onclick="setPage('vocabPage')">返回單字森林</button><button class="btn secondary" onclick="setPage('kanaPage')">前往五十音花園</button>`;return;}
 const idx=Math.min(state.reviewIndex,due.length-1),item=due[idx];
 reviewRevealed=false;
 m.innerHTML=`<div class="eyebrow">SPACED REVIEW · ${idx+1} / ${due.length}</div><div class="h1">記憶補給站 🧠</div><div class="muted">先看日文卡片，在心中回想讀音和意思，再揭曉答案。</div><div class="panel" style="text-align:center"><div class="jp">${item.front}</div>${reviewRevealed?`<div class="reading">${item.reading||''}</div><div class="muted">${item.meaning||''}</div>`:'<div class="muted">先想一想，再按下方按鈕揭曉答案</div>'}</div><div class="muted">目前有 ${all} 張收藏卡；今日到期 ${due.length} 張。</div>${reviewRevealed?`<button class="btn secondary" onclick="reviewMark('${item.id}',false)">還不熟悉 · 明天再複習</button><button class="btn" onclick="reviewMark('${item.id}',true)">已經記得 · 延後複習</button>`:`<button class="btn" onclick="revealReview()">顯示答案</button>`}<div class="section-title">全部已收藏內容</div><div class="pinned-list">${pinned}</div><button class="btn secondary" onclick="markDaily('review')">完成今日複習任務 +5 XP</button><button class="btn secondary" onclick="setPage('vocabPage')">返回單字森林</button>`;
}
function save(){localStorage.setItem(KEY,JSON.stringify(state));updateStats()}
function updateStats(){const level=1+Math.floor(state.xp/100),within=state.xp%100;document.getElementById('coins').textContent=state.coins;document.getElementById('level').textContent='Lv.'+level;const cur=document.getElementById('xpCurrent'),goal=document.getElementById('xpGoal'),fill=document.getElementById('xpFill');if(cur)cur.textContent=within;if(goal)goal.textContent='100';if(fill)fill.style.width=within+'%'}
function addReward(id,xp=10,coins=3){if(!state.completed.includes(id)){state.completed.push(id);state.xp+=xp;state.coins+=coins;save()}}
function isQuizPage(p){return ['lesson','kanaQuiz','vocabQuiz','vocab25Quiz','smartReview','chapterQuiz'].includes(p);}
function pageBackTarget(p){if(dailyTaskFlow&&p!=='home'&&p!=='map')return 'home';if(p==='chapter')return 'area';if(p==='area')return 'map';if(p==='chapterQuiz')return areaById(state.selectedArea).lessonPage;if(state.chapterReturnKey&&!['map','home','area','chapter'].includes(p))return 'chapter';if(p==='kanaQuiz')return 'kanaPage';if(['vocabQuiz','vocab25Quiz','smartReview'].includes(p))return 'vocabPage';return previousPage&&previousPage!==p?previousPage:'home'}
function setPage(p){if(['kanaQuiz','vocabQuiz'].includes(page)&&p!==page&&state.chapterChallengeActive&&p!=='chapter')state.chapterChallengeActive='';if(['map','home','area'].includes(p)){state.chapterReturnKey='';if(p!=='chapter')state.chapterChallengeActive='';save()}if(p!==page)previousPage=page;page=p;if(p==='home')dailyTaskFlow=false;document.body.classList.toggle('quiz-mode',isQuizPage(p));document.body.classList.toggle('study-focus',!['home','map'].includes(p));const active=['area','chapter'].includes(p)?'map':p;document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===active));render()}
function chapterKey(areaId,index){return areaId+':'+index}
function areaById(id){return learningAreas.find(a=>a.id===id)||learningAreas[0]}
function areaDoneCount(areaId){return [0,1,2].filter(i=>state.chapterCompleted.includes(chapterKey(areaId,i))).length}
function openArea(areaId){state.selectedArea=areaId;save();setPage('area')}
function openChapter(index){const a=areaById(state.selectedArea);if(index>0&&!state.chapterCompleted.includes(chapterKey(a.id,index-1)))return;state.currentChapter=index;const key=chapterKey(a.id,index);state.chapterReturnKey=key;state.chapterChallengeActive=key;state.chapterVisited[key]=state.chapterVisited[key]||{};state.chapterVisited[key].lesson=true;if(a.id==='kana'){kanaActivity='choose';kanaSelected=null;}save();setPage(a.lessonPage)}
function openChapterActivity(kind){const a=areaById(state.selectedArea),idx=state.currentChapter,key=chapterKey(a.id,idx);state.chapterReturnKey=key;state.chapterChallengeActive=key;state.chapterVisited[key]=state.chapterVisited[key]||{};if(kind==='lesson'){state.chapterVisited[key].lesson=true;save();if(a.id==='kana')kanaActivity='choose';setPage(a.lessonPage);return;}startChapterQuiz()}
function completeActiveChapterChallenge(){const key=state.chapterChallengeActive;if(!key)return;state.chapterVisited[key]=state.chapterVisited[key]||{};state.chapterVisited[key].challenge=true;if(!state.chapterCompleted.includes(key))state.chapterCompleted.push(key);state.dailyChapterMissionDate=localDayKey();state.chapterChallengeActive='';save()}
function completeChapter(){const a=areaById(state.selectedArea),idx=state.currentChapter,key=chapterKey(a.id,idx),seen=state.chapterVisited[key]||{};if(!seen.lesson||!seen.challenge)return;if(!state.chapterCompleted.includes(key))state.chapterCompleted.push(key);state.dailyChapterMissionDate=localDayKey();state.chapterReturnKey='';state.chapterChallengeActive='';save();setPage('area')}
function renderArea(m){const a=areaById(state.selectedArea),done=areaDoneCount(a.id),next=a.chapters.findIndex((c,i)=>!state.chapterCompleted.includes(chapterKey(a.id,i)));m.innerHTML=`<div class="eyebrow">LEARNING REGION · ${a.en.toUpperCase()}</div><div class="area-hero"><div class="area-icon">${a.icon}</div><h2>${a.name}</h2><div class="muted">${a.desc}</div><div class="progress" style="margin-top:12px"><i style="width:${done/3*100}%"></i></div><div class="muted" style="margin-top:6px">已完成 ${done} / 3 個章節</div></div><div class="section-title">章節旅程 · Chapters</div>${a.chapters.map((c,i)=>{const isDone=state.chapterCompleted.includes(chapterKey(a.id,i)),unlocked=i===0||state.chapterCompleted.includes(chapterKey(a.id,i-1)),active=!isDone&&unlocked;return `<button class="chapter-card ${isDone?'done':''}" ${unlocked?`onclick="openChapter(${i})"`:'disabled'}><span class="chapter-number">${isDone?'✓':String(i+1).padStart(2,'0')}</span><span class="chapter-info"><b>${c[0]}</b><small>${c[1]}</small></span><span class="chapter-state">${isDone?'已完成':active?'開始 ›':'🔒 未解鎖'}</span></button>`}).join('')}<div class="muted" style="margin:12px 2px">完成上一章的課程與挑戰，即可解鎖下一章。每個區域的學習進度會分開保存。</div>`}


function chapterQuestionPool(){
 const area=areaById(state.selectedArea),idx=state.currentChapter;
 let pool=[];
 if(area.id==='grammar'){
  const cards=grammarCards;
  cards.forEach(c=>{pool.push({prompt:c[0],sub:'選出句型的意思',correct:c[2],why:c[3]});pool.push({prompt:c[1],sub:'這句日文的意思是？',correct:c[2],why:c[3]});});
 }else if(area.id==='conversation'){
  const phrases=[['こんにちは','你好／午安'],['よろしくお願いします','請多多指教'],['はい、そうです','是的，沒錯'],['いいえ、違います','不，不是'],['わたしは学生です','我是學生'],['友達','朋友'],['先生','老師'],['学校','學校'],['好き','喜歡'],['ありがとう','謝謝']];
  pool=phrases.map(x=>({prompt:x[0],sub:'選出最合適的中文意思',correct:x[1],why:'留意日常對話中的常用表達。'}));
 }else if(area.id==='manga'){
  pool=comics.concat([['わたしはミカです。','我是 Mika。','わたしは…です 是自我介紹句型。'],['日本語は難しいですか？','日文很難嗎？','ですか 用於禮貌提問。'],['わたしは学生です。','我是學生。','学生（がくせい）是學生。'],['わたしは先生じゃありません。','我不是老師。','じゃありません 是禮貌否定。'],['学校へ行きます。','去學校。','学校（がっこう）是學校。'],['友達','朋友','友達（ともだち）是朋友。'],['先生','老師','先生（せんせい）是老師。']]).map(x=>({prompt:x[0],sub:'選出這句話的意思',correct:x[1],why:x[2]}));
 }else if(area.id==='jlpt'){
  pool=vocabCards.map(w=>({prompt:w[0],sub:'選出正確的中文意思',correct:w[2],why:w[0]+'（'+w[1]+'）＝'+w[2]}));
  grammarCards.forEach(c=>pool.push({prompt:c[1],sub:'選出句子的意思',correct:c[2],why:c[3]}));
 }else{
  let words=vocabCards.slice(idx*10,idx*10+10);if(words.length<5)words=vocabCards.slice(0,10);
  pool=words.map(w=>({prompt:w[0],sub:'選出正確的中文意思',correct:w[2],why:w[0]+'（'+w[1]+'）＝'+w[2]}));
 }
 return pool;
}
function startChapterQuiz(){
 const pool=chapterQuestionPool();if(!pool.length){alert('這個章節的測驗內容正在準備中。');return;}
 const all=chapterQuestionPool(),selected=shuffleArray(all).slice(0,Math.min(10,all.length));
 chapterQuiz={items:selected.map(q=>{const choices=areaById(state.selectedArea).id==='grammar'?grammarCards.map(x=>x[2]):areaById(state.selectedArea).id==='conversation'?['你好／午安','請多多指教','是的，沒錯','不，不是','我是學生','朋友','老師','學校','喜歡','謝謝']:areaById(state.selectedArea).id==='manga'?comics.map(x=>x[1]).concat(['我是 Mika。','日文很難嗎？','我是學生。','我不是老師。','去學校。','朋友','老師']):areaById(state.selectedArea).id==='jlpt'?vocabCards.map(x=>x[2]).concat(grammarCards.map(x=>x[2])):vocabCards.map(x=>x[2]);const opts=shuffleArray([q.correct,...shuffleArray(choices.filter(x=>x!==q.correct)).slice(0,3)]);return {...q,opts,answer:opts.indexOf(q.correct)};}),index:0,selected:-1,answered:false,score:0,finished:false,wrong:[],key:state.chapterReturnKey};
 setPage('chapterQuiz');
}
function answerChapterQuiz(i){if(chapterQuiz.answered)return;chapterQuiz.selected=i;chapterQuiz.answered=true;if(i===chapterQuiz.items[chapterQuiz.index].answer)chapterQuiz.score++;else chapterQuiz.wrong.push(chapterQuiz.items[chapterQuiz.index]);render();}
function nextChapterQuiz(){chapterQuiz.index++;chapterQuiz.selected=-1;chapterQuiz.answered=false;if(chapterQuiz.index>=chapterQuiz.items.length)finishChapterQuiz();else render();}
function finishChapterQuiz(){chapterQuiz.finished=true;const pass=chapterQuiz.score>=Math.ceil(chapterQuiz.items.length*.7);if(pass){completeActiveChapterChallenge();if(!state.chapterRewards[chapterQuiz.key]){state.xp+=10;state.coins+=3;state.chapterRewards[chapterQuiz.key]=true;}}save();render();}
function renderChapterQuiz(m){
 const pass=chapterQuiz.score>=Math.ceil(chapterQuiz.items.length*.7);
 if(chapterQuiz.finished){m.innerHTML=`<div class="eyebrow">CHAPTER CHALLENGE · RESULT</div><div class="h1">${pass?'本章完成！🌸':'再試一次吧！🌱'}</div><div class="panel" style="text-align:center"><div style="font-size:48px">${pass?'🏆':'🌱'}</div><div class="jp" style="font-size:36px">${chapterQuiz.score} / ${chapterQuiz.items.length}</div><b>${pass?'よくできました！做得很好！':'未達到 7 成正確率'}</b><div class="muted">${pass?'本章已自動完成，下一章已解鎖。':`還差 ${Math.ceil(chapterQuiz.items.length*.7)-chapterQuiz.score} 題便可通過。`}</div></div>${pass?'<div class="feedback">🎉 獲得 +10 XP 及 +3 金幣！</div>':`<button class="btn" onclick="startChapterQuiz()">重新挑戰</button>`}<button class="btn secondary" onclick="setPage('area')">返回章節地圖</button>`;return;}
 const q=chapterQuiz.items[chapterQuiz.index];m.innerHTML=`<div class="quiz-shell"><div class="eyebrow">CHAPTER CHALLENGE</div><div class="h1">${areaById(state.selectedArea).challenge} 🎯</div><div class="quiz-topline"><span>第 ${chapterQuiz.index+1} / ${chapterQuiz.items.length} 題</span><span>答對 ${chapterQuiz.score} 題</span></div><div class="progress"><i style="width:${chapterQuiz.index/chapterQuiz.items.length*100}%"></i></div><div class="panel" style="text-align:center;padding:22px"><div class="muted">${q.sub}</div><div class="jp" style="font-size:30px;margin:16px 0">${q.prompt}</div></div><div class="choices">${q.opts.map((o,i)=>`<button class="choice ${chapterQuiz.answered&&i===q.answer?'correct':''} ${chapterQuiz.answered&&i===chapterQuiz.selected&&i!==q.answer?'wrong':''}" ${chapterQuiz.answered?'disabled':''} onclick="answerChapterQuiz(${i})">${'ABCD'[i]}. ${o}</button>`).join('')}</div>${chapterQuiz.answered?`<div class="feedback ${chapterQuiz.selected===q.answer?'':'bad'}">${chapterQuiz.selected===q.answer?'🎉 正確！':'再記住這個內容！'}<br>${q.why}</div><button class="btn" onclick="nextChapterQuiz()">${chapterQuiz.index===chapterQuiz.items.length-1?'查看結果':'下一題 →'}</button>`:''}</div>`;
}
function renderChapter(m){const a=areaById(state.selectedArea),i=state.currentChapter,c=a.chapters[i],key=chapterKey(a.id,i),seen=state.chapterVisited[key]||{},done=state.chapterCompleted.includes(key);const challengeLabel=a.challenge;m.innerHTML=`<div class="eyebrow">${a.en.toUpperCase()} · CHAPTER ${i+1}</div><div class="h1">${c[0]}</div><div class="muted">${c[1]}。完成課程內容及挑戰後，可以解鎖下一章。</div><div class="panel"><div style="font-size:32px;text-align:center">${a.icon}</div><b>${a.name}</b><div class="muted">本章包含一個學習課程和一個練習挑戰。</div></div><div class="section-title">本章學習節點</div><button class="chapter-node" onclick="openChapterActivity('lesson')"><span class="node-icon">📖</span><span class="node-copy"><b>學習課程</b><small>${a.id==='kana'?'認讀假名及發音':a.id==='vocab'?'學習常用單字及例句':a.id==='grammar'?'閱讀句型、例句及解釋':a.id==='conversation'?'進行情境日語對話':a.id==='manga'?'閱讀日語短篇內容':'查看 JLPT 學習範圍'}</small></span><span class="tag">${seen.lesson?'已完成':'開始'}</span></button><button class="chapter-node" onclick="openChapterActivity('challenge')"><span class="node-icon">🎯</span><span class="node-copy"><b>${challengeLabel}</b><small>完成一項應用或挑戰活動</small></span><span class="tag">${seen.challenge?'已通過':'開始'}</span></button><div class="chapter-complete"><b>${done?'✓ 本章已完成':'完成條件'}</b><div class="muted">${seen.lesson&&seen.challenge?'✓ 課程及挑戰均已完成，可以解鎖下一章。':'① 先開啟課程；② 再完成挑戰（五十音測驗需答對至少 7/10）；③ 返回此頁按下完成。'}</div><button class="btn" ${seen.lesson&&seen.challenge&&!done?'':'disabled'} onclick="completeChapter()">${done?'已完成':'完成本章並解鎖下一章'}</button></div>`}

function getResumeChapter(){
 // Prefer a chapter the learner has already opened and not completed.
 for(const area of learningAreas){
  for(let index=0;index<area.chapters.length;index++){
   const key=chapterKey(area.id,index),visited=state.chapterVisited[key];
   if(visited&&!state.chapterCompleted.includes(key))return {area,index,key,isResume:true};
  }
 }
 // If no unfinished chapter has been recorded yet, offer the first unlocked chapter.
 // This is a display/navigation fallback and does not alter saved learning data.
 for(const area of learningAreas){
  for(let index=0;index<area.chapters.length;index++){
   const key=chapterKey(area.id,index);
   const unlocked=index===0||state.chapterCompleted.includes(chapterKey(area.id,index-1));
   if(unlocked&&!state.chapterCompleted.includes(key))return {area,index,key,isResume:false};
  }
 }
 return null;
}
function render(){
 const m=document.getElementById('main');
 if(page==='home'){
 ensureDaily();
 const missionDone=state.dailyChapterMissionDate===localDayKey(),pct=missionDone?100:0,dueSmart=smartDueWords().length,resume=getResumeChapter();
 m.innerHTML=`<div class="eyebrow">YOUR DAILY ADVENTURE</div><div class="h1">おかえりなさい！🌸</div>
 <div class="panel welcome" style="padding:14px 16px"><div class="bird">🐤</div><div><b>Kotori 說：</b><div class="muted">今日も一緒に日本語を勉強しよう！</div></div></div>
 <div class="panel" style="padding:14px 16px;margin:12px 0"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><b>今日進度</b><span class="tag">${pct}%</span></div>
 <div class="progress" style="margin:10px 0 7px"><i style="width:${pct}%"></i></div><div class="muted">${missionDone?'今日章節任務已完成':'今日目標：完成一個學習章節'}</div></div>
 ${resume?`<div class="panel resume-card" style="padding:14px 16px;margin:12px 0"><div class="resume-heading"><b>${resume.isResume?'繼續上次學習 📖':'開始學習 📖'}</b><span class="tag">${resume.isResume?'進行中':'推薦課程'}</span></div><div class="resume-title">${resume.area.icon} ${resume.area.name} · ${resume.area.chapters[resume.index][0]}</div><div class="muted">${resume.isResume?'接續你已開始的章節，完成課程與挑戰即可解鎖下一章。':'還沒有未完成的章節，從這個已解鎖課程開始吧！'}</div><button class="btn" style="margin-top:12px" onclick="state.selectedArea='${resume.area.id}';openChapter(${resume.index})">${resume.isResume?'繼續學習':'開始學習'} →</button></div>`:''}
 <div class="panel" style="padding:14px 16px;margin:12px 0"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><b>智能複習 🧠</b><span class="tag">獨立學習</span></div><div class="muted" style="margin-top:6px">${dueSmart?`目前有 ${dueSmart} 個單字需要複習`:'依照你的記憶狀態安排單字'}</div><button class="btn" style="margin-top:12px" onclick="startSmartReview(false)">開始智能複習 · 約 10 題</button></div>
 <div class="panel mission-card" style="padding:14px 16px;margin:12px 0"><div style="display:flex;align-items:center;justify-content:space-between;gap:10px"><b>今日任務 🎯</b><span class="tag">${missionDone?'已完成':'完成 1 個章節'}</span></div><div style="font-weight:700;margin-top:10px">${missionDone?'今日任務完成！明天再來迎接新挑戰。':resume?`${resume.area.icon} ${resume.area.name} · ${resume.area.chapters[resume.index][0]}`:'所有章節都已完成！'}</div><div class="muted" style="margin-top:6px">${missionDone?'你今天已完成一個學習章節，做得很好！':resume?'完成課程及挑戰，即可完成今日任務。':'你已完成目前所有章節，繼續複習也很棒。'}</div>${!missionDone&&resume?`<button class="btn" style="margin-top:12px" onclick="state.selectedArea='${resume.area.id}';openChapter(${resume.index})">開始今日任務 →</button>`:''}<div class="progress" style="margin-top:12px"><i style="width:${missionDone?100:0}%"></i></div><div class="muted" style="margin-top:6px">${missionDone?'1 / 1 個章節完成':'0 / 1 個章節完成'}</div></div>
 <div class="panel" style="padding:14px 16px"><b>記憶補給站</b><div class="muted">收藏 ${state.reviewItems.length} 張卡 · 到期 ${reviewDue().length} 張</div><button class="btn secondary" onclick="setPage('reviewPage')">查看收藏複習 →</button></div>
`;
 }
 else if(page==='map'){
 const totalDone=learningAreas.reduce((n,a)=>n+areaDoneCount(a.id),0);
 m.innerHTML=`<div class="eyebrow">KOTORI ACADEMY WORLD</div><div class="h1">學園世界地圖 🗺️</div><div class="world-intro"><div class="world-title">你的日語旅程，從這裏開始</div><div class="muted">探索六個學習區域，完成章節課程，逐步開啟新的學習路線。</div><div class="progress" style="margin-top:12px"><i style="width:${totalDone/18*100}%"></i></div><div class="muted" style="margin-top:6px">已完成 ${totalDone} / 18 個章節</div></div><div class="world-grid">${learningAreas.map(a=>{const done=areaDoneCount(a.id),next=a.chapters.findIndex((c,i)=>!state.chapterCompleted.includes(chapterKey(a.id,i)));return `<button class="world-card ${a.tone}" onclick="openArea('${a.id}')"><span class="world-icon">${a.icon}</span><strong>${a.name}</strong><small>${a.en}</small><span class="world-focus">${a.desc}</span><div class="world-progress"><i style="width:${done/3*100}%"></i></div><span class="world-count">${done}/3 章 · ${next<0?'全部完成':next===0?'尚未開始':'第 '+(next+1)+' 章待解鎖'}　›</span></button>`}).join('')}</div><div class="muted" style="text-align:center;margin:14px 0 4px">每個區域都有自己的章節進度，完成前一章即可解鎖下一章。🌱</div>`;
 }
 else if(page==='area')renderArea(m);
 else if(page==='chapter')renderChapter(m);
 else if(page==='lesson')renderLesson(m);
 else if(page==='kanaQuiz')renderKanaQuiz(m);
 else if(page==='chapterQuiz')renderChapterQuiz(m);
 else if(page==='kanaPage'){
 const list=kanaMode==='hiragana'?hiragana:katakana;
 if(kanaActivity==='choose'){
  m.innerHTML=`<div class="eyebrow">KANA GARDEN</div><div class="h1">五十音花園 🌷</div><div class="muted">你可以先瀏覽假名，亦可以直接開始測驗。無須逐個假名完成。</div><div class="kana-mode-grid"><button class="kana-mode-card" onclick="kanaActivity='study';kanaSelected=null;render()"><span>📖</span><b>學習</b><small>以五格一行的方式瀏覽全部假名</small></button><button class="kana-mode-card" onclick="kanaActivity='test';startKanaQuiz()"><span>✏️</span><b>測驗</b><small>直接開始 10 題隨機挑戰</small></button></div><div class="choices"><button class="choice ${kanaMode==='hiragana'?'selected':''}" onclick="kanaMode='hiragana';render()">平假名 ひらがな</button><button class="choice ${kanaMode==='katakana'?'selected':''}" onclick="kanaMode='katakana';render()">片假名 カタカナ</button></div><button class="btn secondary" onclick="setPage('map')">返回學習地圖</button>`;
 }else{
  const selected=list.find(x=>x[0]===kanaSelected);
  m.innerHTML=`<div class="eyebrow">KANA GARDEN · ${kanaMode==='hiragana'?'HIRAGANA':'KATAKANA'}</div><div class="h1">${kanaMode==='hiragana'?'平假名':'片假名'} 🌷</div><div class="choices" style="grid-template-columns:1fr 1fr"><button class="choice ${kanaMode==='hiragana'?'selected':''}" onclick="kanaMode='hiragana';kanaSelected=null;render()">平假名</button><button class="choice ${kanaMode==='katakana'?'selected':''}" onclick="kanaMode='katakana';kanaSelected=null;render()">片假名</button></div>
  <div class="kana-grid">${list.map(x=>`<button class="kana-square ${kanaSelected===x[0]?'active':''}" onclick='selectKanaSquare("${x[0]}")'><span>${x[0]}</span><small>${x[1]}</small></button>`).join('')}</div>
  ${selected?`<div class="kana-detail"><div class="kana-detail-main"><b>${selected[0]}</b><span>${selected[1]}</span></div><div class="muted">例子：${selected[2]}</div><div class="kana-detail-actions"><button class="btn" onclick='speakJapanese("${selected[0]}")'>🔊 重播發音</button><button class="btn secondary" onclick='toggleKanaBookmark("${kanaMode}","${selected[0]}","${selected[1]}","${selected[2]}")'>${state.reviewItems.some(x=>x.id==='kana:'+kanaMode+':'+selected[0])?'✓ 已收藏':'＋ 收藏'}</button></div></div>`:'<div class="muted" style="text-align:center;margin:10px 0">點擊任何假名方格，即時聆聽發音。</div>'}
  <button class="btn" onclick="kanaActivity='choose';kanaSelected=null;render()">返回學習／測驗選擇</button><button class="btn secondary" onclick="setPage('map')">返回學習地圖</button>`;
 }
 }
 else if(page==='vocabPage')renderVocabForest(m);
 else if(page==='vocabQuiz')renderVocabQuiz(m);
 else if(page==='vocabMistakes')renderVocabMistakes(m);
 else if(page==='vocab25Quiz')renderVocab25Quiz(m);
 else if(page==='vocab25Stats')renderVocab25Stats(m);
 else if(page==='smartReview')renderSmartReview(m);
 else if(page==='smartReport')renderSmartReport(m);
 else if(page==='smartMistakes')renderSmartMistakes(m);
 else if(page==='grammarPage')renderGrammar(m);
 else if(page==='reviewPage'){renderReview(m);}
 else if(page==='kanjiPage')m.innerHTML=`<div class="eyebrow">KANJI GARDEN</div><div class="h1">漢字小徑 🖌️</div><div class="muted">先從常見、容易在生活中遇到的漢字開始。留意讀音和詞語，不用一次記住全部。</div>${[['日','にち／ひ','日、星期'],['月','げつ／つき','月、月份'],['人','ひと／じん','人、日本人'],['山','やま','山、富士山'],['水','みず','水、水曜日'],['火','ひ／か','火、火曜日'],['木','き／もく','樹木、木曜日'],['本','ほん','書、日本']].map(x=>`<div class="tile"><span class="emoji">${x[0]}</span><span><strong>${x[1]}</strong><small>${x[2]}</small></span></div>`).join('')}<div class="muted">提示：同一漢字在不同詞語中可能有不同讀音。</div>`;

 else if(page==='story')m.innerHTML=`
 <div class="eyebrow">CHAPTER 01 · はじめての出会い</div><div class="h1">初めての出会い 🌸</div>
 <div class="panel"><div style="font-size:52px;text-align:center">👧🏻 🌸 🐤</div><div class="muted">Kotori 小鎮・學校門口</div><div class="jp" style="font-size:23px">こんにちは！</div><b>Mika：</b><div class="muted">你好！你是新來的學生嗎？</div><hr style="border:0;border-top:1px solid var(--line);margin:14px 0"><b>請選擇你的回答：</b>
 <div class="choices">${[['はい、そうです。','是的，沒錯。'],['いいえ、違います。','不，不是。']].map((a,i)=>`<button class="choice ${storyChoice===i+1?'selected':''}" onclick="storyChoice=${i+1};render()"><b>${a[0]}</b><div class="muted">${a[1]}</div></button>`).join('')}</div>
 ${storyChoice?'<div class="feedback">Mika：そうなんですね！<br>原來如此！你已經開始用日文回答問題了。</div>':''}</div>
 <button class="btn" ${storyChoice?'':'disabled'} onclick="state.storyDone=true;addReward('story',10,3);markDaily('story')">完成對話 +10 XP</button>`;
 else if(page==='comic')m.innerHTML=`
 <div class="eyebrow">MANGA LIBRARY</div><div class="h1">漫畫閱讀室 📚</div><span class="tag">初級原創短篇</span>
 <div class="panel"><b>第 1 話：はじめまして！</b><div class="comicline"><div style="font-size:30px">👧🏻 🌸 👧🏻</div><div class="muted">Mika 在學校門口遇見新朋友。</div></div><div class="jp" style="font-size:22px">${comics[state.comicIndex][0]}</div><div class="muted">${comics[state.comicIndex][1]}</div><hr style="border:0;border-top:1px solid var(--line)"><div class="muted">💡 ${comics[state.comicIndex][2]}</div></div>
 <button class="btn secondary" onclick="state.comicIndex=(state.comicIndex-1+comics.length)%comics.length;save();render()">上一句</button><button class="btn" onclick="state.comicIndex=(state.comicIndex+1)%comics.length;save();render()">下一句 →</button><button class="btn secondary" onclick="markDaily('comic')">完成今日漫畫任務 +5 XP</button>`;
 else if(page==='jlpt')m.innerHTML=`
 <div class="eyebrow">JLPT TRAINING</div><div class="h1">JLPT 試煉塔 🏰</div>
 <div class="panel"><span class="tag">目前建議起點</span><div class="jp">N5</div><b>初級基礎</b><div class="muted">五十音、基本助詞、常用動詞、簡單句子、基礎閱讀及聽力。</div></div>
 <div class="panel"><span class="tag" style="background:#f1eaf2;color:#886c8e">下一階段</span><div class="jp">N4</div><b>初中級</b><div class="muted">動詞變化、較複雜句型、日常閱讀及聽力理解。</div></div>
 <div class="muted">正式課程會按 JLPT 能力範圍編排，並以練習結果決定何時進階。</div>`;
 else if(page==='profile')m.innerHTML=`
 <div class="eyebrow">MY JOURNEY</div><div class="h1">我的學習紀錄 🌸</div>
 <div class="statgrid"><div class="statbox"><strong>${state.xp}</strong><span class="muted">累積 XP</span></div><div class="statbox"><strong>${state.coins}</strong><span class="muted">金幣</span></div><div class="statbox"><strong>${state.completed.length}</strong><span class="muted">完成任務</span></div><div class="statbox"><strong>25 分</strong><span class="muted">每日目標</span></div></div>
 <div class="section-title">今日學習</div><div class="panel muted">已完成 ${state.dailyDone.length} / ${dailyTasks.length} 項每日任務<br>記憶補給站：${state.reviewItems.length} 張收藏卡</div><div class="section-title">你的學習設定</div><div class="panel muted">五十音：大部分認得，持續複習<br>學習模式：遊戲＋故事情節<br>目標：日常溝通、漫畫、動漫、JLPT、聽力及發音<br>漢字：逐步減少中文提示</div>
 <button class="btn secondary" onclick="if(confirm('確定要清除這部裝置上的學習紀錄嗎？')){localStorage.removeItem(KEY);location.reload()}">重設學習紀錄</button>`;
 if(state.chapterReturnKey && page===areaById(state.selectedArea).lessonPage && page!=='kanaPage'){m.insertAdjacentHTML('beforeend',`<div class="chapter-study-cta"><div class="muted">完成本章內容後，直接進入章節測驗；答對 7 成或以上便會自動解鎖下一章。</div><button class="btn" onclick="startChapterQuiz()">完成學習・開始測驗 →</button></div>`);}
 if(page!=='home'&&page!=='map'){const backTarget=pageBackTarget(page);m.insertAdjacentHTML('afterbegin',`<button class="page-back" aria-label="返回" onclick="setPage('${backTarget}')">‹</button>`);}
 pairNavigationButtons(m);
 document.body.classList.toggle('quiz-mode',isQuizPage(page));
 document.body.classList.toggle('study-focus',!['home','map'].includes(page));
 updateStats();
}

function pairNavigationButtons(container){
 const children=Array.from(container.children);
 for(let i=0;i<children.length-1;i++){
  const a=children[i],b=children[i+1];
  if(a.tagName==='BUTTON'&&b.tagName==='BUTTON'&&/(上一句|上一個|上一頁|上一題)/.test(a.textContent)&&/(下一句|下一個|下一頁|下一題)/.test(b.textContent)){
   const wrap=document.createElement('div');wrap.className='nav-pair';a.parentNode.insertBefore(wrap,a);wrap.appendChild(a);wrap.appendChild(b);children.splice(i,2,wrap);
  }
 }
}
function shuffleArray(arr){const a=[...arr];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function startKanaQuiz(){
 const pool=kanaMode==='hiragana'?hiragana:katakana;
 const chosen=shuffleArray(pool).slice(0,10);
 kanaQuiz={items:chosen.map(item=>{const distractors=shuffleArray(pool.filter(x=>x[1]!==item[1])).map(x=>x[1]);const opts=shuffleArray([item[1],...distractors.slice(0,3)]);return {kana:item[0],reading:item[1],example:item[2],opts,answer:opts.indexOf(item[1])};}),index:0,selected:-1,answered:false,score:0,finished:false};
 setPage('kanaQuiz');
}
function answerKanaQuiz(i){if(kanaQuiz.answered)return;kanaQuiz.selected=i;kanaQuiz.answered=true;if(i===kanaQuiz.items[kanaQuiz.index].answer)kanaQuiz.score++;render();}
function nextKanaQuiz(){kanaQuiz.index++;kanaQuiz.selected=-1;kanaQuiz.answered=false;if(kanaQuiz.index>=kanaQuiz.items.length){finishKanaQuiz();}else render();}
function finishKanaQuiz(){
 kanaQuiz.finished=true;
 if(kanaQuiz.score>=7)completeActiveChapterChallenge();
 const today=localDayKey();
 if(kanaQuiz.score>=7 && state.kanaQuizRewardDate!==today){state.xp+=10;state.coins+=3;state.kanaQuizRewardDate=today;kanaQuiz.rewarded=true;}
 else {kanaQuiz.rewarded=false;}
 save();
 if(!state.chapterReturnKey){markDaily('kana');return;}
 render();
}
function renderKanaQuiz(m){
 if(kanaQuiz.finished){const pass=kanaQuiz.score>=7,chapterDone=!!(state.chapterReturnKey&&state.chapterCompleted.includes(state.chapterReturnKey)); m.innerHTML=`<div class="eyebrow">KANA GARDEN · QUIZ RESULT</div><div class="h1">${chapterDone?'第一章完成！🌸':'測驗完成！🌸'}</div><div class="panel" style="text-align:center"><div style="font-size:48px">${pass?'🏆':'🌱'}</div><div class="jp" style="font-size:36px">${kanaQuiz.score} / 10</div><b>${pass?'よくできました！做得很好！':'もう一度頑張ろう！再試一次吧！'}</b><div class="muted">${chapterDone?'你已完成本章，下一章已自動解鎖！':pass?'基礎掌握得不錯，可以繼續練習。':'答對至少 7 題即可通過，重溫後再試一次。'}</div></div>${kanaQuiz.rewarded?'<div class="feedback">🎉 今日首次達到 7 題或以上，獲得 +10 XP 及 +3 金幣！</div>':state.kanaQuizRewardDate===localDayKey()&&pass?'<div class="muted">今日的測驗獎勵已領取。</div>':''}${chapterDone?'<button class="btn" onclick="setPage(\'area\')">繼續旅程 →</button>':`<button class="btn" onclick="startKanaQuiz()">${pass?'再測一次':'重新挑戰'}</button>`}<button class="btn secondary" onclick="setPage(\'kanaPage\')">返回五十音花園</button><button class="btn secondary" onclick="setPage(\'map\')">返回學習地圖</button>`;return;}
 const q=kanaQuiz.items[kanaQuiz.index];
 m.innerHTML=`<div class="eyebrow">KANA GARDEN · ${kanaMode==='hiragana'?'HIRAGANA':'KATAKANA'} QUIZ</div><div class="h1">五十音測驗 🎯</div><div class="muted">選出這個假名正確的羅馬拼音。測驗共 10 題，不會顯示提示。</div><div class="muted" style="margin:10px 0 6px">題目 ${kanaQuiz.index+1} / 10　·　答對 ${kanaQuiz.score} 題</div><div class="progress"><i style="width:${kanaQuiz.index/10*100}%"></i></div><div class="panel" style="text-align:center;padding:25px"><div class="muted">這個假名怎樣讀？</div><div class="jp" style="font-size:76px;margin:18px 0">${q.kana}</div></div><div class="choices">${q.opts.map((o,i)=>`<button class="choice ${kanaQuiz.answered&&i===q.answer?'correct':''} ${kanaQuiz.answered&&i===kanaQuiz.selected&&i!==q.answer?'wrong':''}" ${kanaQuiz.answered?'disabled':''} onclick="answerKanaQuiz(${i})">${'ABCD'[i]}. ${o}</button>`).join('')}</div>${kanaQuiz.answered?`<div class="feedback ${kanaQuiz.selected===q.answer?'':'bad'}"><b>${kanaQuiz.selected===q.answer?'🎉 正確！':'再記住這個讀音！'}</b><br>${q.kana} 讀作 ${q.reading}。例子：${q.example}</div><button class="btn" onclick="nextKanaQuiz()">${kanaQuiz.index===9?'查看測驗結果':'下一題 →'}</button>`:''}<button class="btn secondary" onclick="if(confirm('確定要離開測驗嗎？今次進度不會計分。'))setPage('kanaPage')">離開測驗</button>`;
}
function renderCards(m,title,eyebrow,cards,label){
 const i=(state.vocabIndex||0)%cards.length, c=cards[i];
 m.innerHTML=`<div class="eyebrow">${eyebrow}</div><div class="h1">${title}</div><div class="muted">先看日文和讀音，再試著想起中文意思。完成一輪後可以重複複習。</div><div class="panel" style="text-align:center"><div class="jp">${c[0]}</div><div class="reading">${c[1]}</div><div class="muted">${c[2]}</div></div><div class="muted" style="text-align:center">${i+1} / ${cards.length}</div><button class="btn secondary" onclick="state.vocabIndex=(state.vocabIndex||0)-1+${cards.length};state.vocabIndex%= ${cards.length};save();render()">← 上一個</button><button class="btn" onclick="state.vocabIndex=((state.vocabIndex||0)+1)%${cards.length};save();render()">下一個 →</button><button class="btn secondary" onclick='addToReview("vocab","${c[0]}","${c[0]}","${c[1]}","${c[2]}")'>這個單字不熟悉 · 加入複習</button><button class="btn secondary" onclick="markDaily('vocab')">完成今日單字任務 +5 XP</button><button class="btn secondary" onclick="setPage('map')">返回學習地圖</button>`;
}

function speakJapanese(text){
 if(!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)){
   alert('你的瀏覽器暫時未支援日文語音播放，請使用 iPhone Safari 或更新瀏覽器。');
   return;
 }
 const utterance=new SpeechSynthesisUtterance(String(text||''));
 utterance.lang='ja-JP';
 utterance.rate=0.88;
 utterance.pitch=1;
 const voices=window.speechSynthesis.getVoices();
 const japaneseVoice=voices.find(v=>/^ja([_-]|$)/i.test(v.lang)) || voices.find(v=>/japanese/i.test(v.name));
 if(japaneseVoice) utterance.voice=japaneseVoice;
 window.speechSynthesis.cancel();
 window.speechSynthesis.resume();
 window.speechSynthesis.speak(utterance);
}

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
 m.innerHTML=`<div class="eyebrow">VOCABULARY FOREST · VERSION 2.9.1</div><div class="h1">單字森林 🌳</div>
 <div class="panel" style="margin:8px 0 12px"><div class="forest-hero-top"><b>🐤 今日單字進度</b><span class="tag">${practiced}/${active.length} 已練習</span></div><div class="progress" style="margin:9px 0 6px"><i style="width:${active.length?practiced/active.length*100:0}%"></i></div><div class="muted">本分類有 ${due} 個到期複習、${weak} 個需要加強、${mastered} 個已熟練。</div></div>
 <div class="forest-sticky"><div class="muted" style="font-weight:800;color:var(--ink)">先選擇想學習的分類</div><div class="forest-categories">${categories.map(c=>`<button class="forest-category ${vocabForestCategory===c?'active':''}" ${counts[c]===0?'disabled':''} onclick="vocabForestCategory='${c}';render()">${c}<small>${counts[c]} 個單字</small></button>`).join('')}</div>
 <button class="forest-start" onclick="startSmartReview(false,vocabForestCategory)"><span class="action-icon">✨</span><span>智能複習＋測驗<small>${due?`${due} 個到期單字優先出題`:weak?`${weak} 個需要加強的單字優先出題`:'按記憶狀態安排本分類測驗'} · 約 10 題</small></span><span style="margin-left:auto;font-size:20px">›</span></button>
 <div class="forest-count">${vocabForestCategory} · ${active.length} 個單字 · ${practiced} 個已練習</div></div>
 ${active.length?active.map(w=>{const x=smartStat(w),newWord=vocab25Cards.find(z=>z.jp===w.jp),master=x.streak>=3&&x.correct>=4;return `<div class="word-card compact"><div class="word-top"><span class="tag">${vocabForestCategory}</span><span class="muted">${master?'🌟 已掌握':x.attempts?`答對 ${x.correct}/${x.attempts} 次`:'尚未練習'}</span></div><div class="jp">${w.jp}</div><div class="reading">${w.reading}</div><div class="muted" style="text-align:center">${w.meaning}</div><div class="word-buttons"><button class="speak-btn" onclick='speakJapanese(${JSON.stringify(w.jp)})' aria-label="播放單字發音">🔊</button>${newWord?`<button class="speak-btn" onclick='speakJapanese(${JSON.stringify(newWord.example)})' aria-label="播放例句發音">🗣️</button>`:''}<button class="speak-btn" onclick='addToReview("vocab",${JSON.stringify(w.jp)},${JSON.stringify(w.jp)},${JSON.stringify(w.reading)},${JSON.stringify(w.meaning)})' aria-label="加入複習">＋</button></div>${newWord?`<div class="word-example"><b>${newWord.example}</b><div class="reading">${newWord.exampleReading}</div><div class="muted">${newWord.exampleMeaning}</div></div>`:''}</div>`}).join(''):'<div class="panel muted">這個分類的單字尚未解鎖，完成前面的單字區域後便會開放。🌱</div>'}
 <div class="forest-tools"><button class="tool-link" style="width:100%" onclick="setPage('reviewPage')">🔖 我的收藏／釘選單字（${state.reviewItems.length}）</button><details><summary>更多學習工具及紀錄</summary><div class="tool-links"><button class="tool-link" onclick="setPage('smartMistakes')">🎯 錯題挑戰</button><button class="tool-link" onclick="setPage('smartReport')">📊 每日報告</button><button class="tool-link" onclick="setPage('vocab25Stats')">🌟 單字成長紀錄</button><button class="tool-link" onclick="setPage('vocabMistakes')">📝 舊版錯題紀錄（${state.vocabMistakes.length}）</button><button class="tool-link" onclick="setPage('reviewPage')">🧠 記憶補給站</button></div></details></div>`;
}
function startVocab25Quiz(mode){
 const start=(state.vocab25Stage-1)*10;const pool=vocab25Cards.slice(start,state.vocab25Stage*10);
 const chosen=shuffleArray(pool).slice(0,10);
 vocab25Quiz={mode,items:chosen.map((word,i)=>{
  const others=shuffleArray(pool.filter(x=>x.jp!==word.jp)).slice(0,3);
  const correct=mode==='listen'?word.jp:word.exampleMeaning;
  const distractors=others.map(x=>mode==='listen'?x.jp:x.exampleMeaning);
  const opts=shuffleArray([correct,...distractors]);
  return {word,opts,answer:opts.indexOf(correct)};
 }),index:0,selected:-1,answered:false,score:0,finished:false,wrong:[]};
 setPage('vocab25Quiz');
}
function answerVocab25Quiz(i){
 if(vocab25Quiz.answered)return;
 const q=vocab25Quiz.items[vocab25Quiz.index];vocab25Quiz.selected=i;vocab25Quiz.answered=true;
 const st=state.vocab25Stats[q.word.jp]||(state.vocab25Stats[q.word.jp]={correct:0,attempts:0});st.attempts++;
 if(i===q.answer){vocab25Quiz.score++;st.correct++;state.vocab25Mistakes=state.vocab25Mistakes.filter(x=>x!==q.word.jp);}
 else {vocab25Quiz.wrong.push(q.word);if(!state.vocab25Mistakes.includes(q.word.jp))state.vocab25Mistakes.push(q.word.jp);}
 save();render();
}
function nextVocab25Quiz(){vocab25Quiz.index++;vocab25Quiz.selected=-1;vocab25Quiz.answered=false;if(vocab25Quiz.index>=vocab25Quiz.items.length)finishVocab25Quiz();else render();}
function finishVocab25Quiz(){
 vocab25Quiz.finished=true;
 if(vocab25Quiz.score>=8&&state.vocab25Stage<3){state.vocab25Stage++;vocab25Quiz.unlocked=true;}
 const today=localDayKey(),rewardKey=vocab25Quiz.mode==='listen'?'vocab25ListenRewardDate':'vocab25SentenceRewardDate';
 if(vocab25Quiz.score>=7&&state[rewardKey]!==today){state.xp+=5;state.coins+=2;state[rewardKey]=today;vocab25Quiz.rewarded=true;}else vocab25Quiz.rewarded=false;
 save();render();
}
function renderVocab25Quiz(m){
 if(vocab25Quiz.finished){const pass=vocab25Quiz.score>=7;m.innerHTML=`<div class="eyebrow">KOTORI 2.5 · RESULT</div><div class="h1">${vocab25Quiz.mode==='listen'?'聽力':'例句理解'}測驗完成！🌸</div><div class="panel" style="text-align:center"><div style="font-size:46px">${pass?'🏆':'🌱'}</div><div class="jp">${vocab25Quiz.score} / 10</div><b>${pass?'よくできました！做得很好！':'もう一度頑張ろう！再試一次吧！'}</b><div class="muted">答對 ${vocab25Quiz.score} 題；答錯 ${vocab25Quiz.wrong.length} 題。</div></div>${vocab25Quiz.unlocked?'<div class="feedback">🎉 成功解鎖下一個單字區域！</div>':''}${vocab25Quiz.rewarded?'<div class="feedback">🎁 首次達到 7/10，獲得 +5 XP 及 +2 金幣！</div>':'<div class="muted">答對 7 題或以上可領取每日首次獎勵（每種測驗每日一次）。</div>'}<button class="btn" onclick="setPage('vocabPage')">返回單字森林</button>`;return;}
 const q=vocab25Quiz.items[vocab25Quiz.index],listen=vocab25Quiz.mode==='listen';
 m.innerHTML=`<div class="quiz-shell"><div class="eyebrow">KOTORI 2.9.1 · CHALLENGE</div><div class="h1">${listen?'聆聽挑戰 🎧':'句子挑戰 📖'}</div><div class="quiz-topline"><span>第 ${vocab25Quiz.index+1} / 10 題</span><span>答對 ${vocab25Quiz.score} 題</span></div><div class="progress"><i style="width:${vocab25Quiz.index/10*100}%"></i></div><div class="panel" style="text-align:center;padding:22px">${listen?`<div class="muted">按喇叭聆聽日語，再選出聽到的單字</div><button class="speak-btn" style="width:58px;height:58px;font-size:25px;margin:16px" onclick="speakJapanese(vocab25Quiz.items[vocab25Quiz.index].word.jp)">🔊</button>`:`<div class="muted">請選出以下日文句子的正確意思</div><div class="jp" style="font-size:24px">${q.word.example}</div><div class="reading">${q.word.exampleReading}</div>`}</div><div class="choices">${q.opts.map((o,i)=>`<button class="choice ${vocab25Quiz.answered&&i===q.answer?'correct':''} ${vocab25Quiz.answered&&i===vocab25Quiz.selected&&i!==q.answer?'wrong':''}" ${vocab25Quiz.answered?'disabled':''} onclick="answerVocab25Quiz(${i})">${'ABCD'[i]}. ${o}</button>`).join('')}</div>${vocab25Quiz.answered?`<div class="feedback ${vocab25Quiz.selected===q.answer?'':'bad'}"><b>${vocab25Quiz.selected===q.answer?'🎉 正確！':'再記住這個單字！'}</b><br>${q.word.jp}（${q.word.reading}）＝${q.word.meaning}<br>${q.word.example}<br>${q.word.exampleMeaning}</div><button class="btn" onclick="nextVocab25Quiz()">${vocab25Quiz.index===9?'查看測驗結果':'下一題 →'}</button>`:''}</div>`;
}
function renderVocab25Stats(m){
 const entries=vocab25Cards.map(w=>({word:w,stat:state.vocab25Stats[w.jp]||{correct:0,attempts:0}}));
 const mastered=entries.filter(x=>x.stat.correct>=3).length,attempted=entries.filter(x=>x.stat.attempts>0).length,correct=entries.reduce((n,x)=>n+x.stat.correct,0),attempts=entries.reduce((n,x)=>n+x.stat.attempts,0),accuracy=attempts?Math.round(correct/attempts*100):0;
 m.innerHTML=`<div class="eyebrow">KOTORI 2.5 · PROGRESS</div><div class="h1">單字成長紀錄 📊</div><div class="statgrid"><div class="statbox"><strong>${attempted}/30</strong><span class="muted">已練習單字</span></div><div class="statbox"><strong>${mastered}/30</strong><span class="muted">已掌握單字</span></div><div class="statbox"><strong>${attempts}</strong><span class="muted">總答題次數</span></div><div class="statbox"><strong>${accuracy}%</strong><span class="muted">答題正確率</span></div><div class="statbox"><strong>${state.vocab25Mistakes.length}</strong><span class="muted">待複習單字</span></div></div><div class="panel"><b>掌握標準</b><div class="muted">同一個單字累積答對 3 次，便會標記為「已掌握」。答題紀錄會保存在這部裝置上。</div><div class="progress"><i style="width:${mastered/30*100}%"></i></div><div class="muted">目前掌握 ${mastered} / 30 個</div></div><div class="section-title">需要再複習的單字</div>${state.vocab25Mistakes.length?state.vocab25Mistakes.map(w=>{const c=vocab25Cards.find(x=>x.jp===w);return c?`<div class="tile"><span style="flex:1"><strong>${c.jp}</strong><small>${c.reading} · ${c.meaning}</small></span><button class="speak-btn" onclick="speakJapanese('${c.jp}')">🔊</button></div>`:''}).join(''):'<div class="muted">目前沒有待複習單字，做得好！</div>'}<div class="section-title">單字紀錄</div>${entries.map(x=>`<div class="tile"><span style="flex:1"><strong>${x.word.jp}　<small>${x.word.reading}</small></strong><small>${x.word.meaning} · 答對 ${x.stat.correct} / ${x.stat.attempts} 次</small></span><span class="tag">${x.stat.correct>=3?'已掌握':'學習中'}</span></div>`).join('')}<button class="btn secondary" onclick="setPage('vocabPage')">返回單字森林</button>`;
}

function startVocabQuiz(mistakesOnly){
 let pool=mistakesOnly?state.vocabMistakes.map(x=>x.word):vocabCards.slice(0,state.vocabStage*10);
 pool=pool.filter(Boolean);
 if(!pool.length){alert('目前沒有錯題，先完成單字測驗吧！');return;}
 const chosen=shuffleArray(pool).slice(0,10);
 vocabQuiz={items:chosen.map((word,i)=>{
   const direction=i%2===0?'jpToZh':'zhToJp';
   const correct=direction==='jpToZh'?word[2]:word[0];
   const distractors=shuffleArray(vocabCards.filter(x=>x[0]!==word[0])).slice(0,3).map(x=>direction==='jpToZh'?x[2]:x[0]);
   const opts=shuffleArray([correct,...distractors]);
   return {word,direction,opts,answer:opts.indexOf(correct)};
 }),index:0,selected:-1,answered:false,score:0,finished:false,wrong:[],mistakesOnly};
 setPage('vocabQuiz');
}
function answerVocabQuiz(i){
 if(vocabQuiz.answered)return;
 const q=vocabQuiz.items[vocabQuiz.index];vocabQuiz.selected=i;vocabQuiz.answered=true;
 if(i===q.answer){
  vocabQuiz.score++;
  state.vocabMistakes=state.vocabMistakes.filter(x=>x.word[0]!==q.word[0]);
  save();
 }else{
  if(!vocabQuiz.wrong.some(x=>x[0]===q.word[0]))vocabQuiz.wrong.push(q.word);
  if(!state.vocabMistakes.some(x=>x.word[0]===q.word[0]))state.vocabMistakes.push({word:q.word,missedAt:Date.now()});
  save();
 }
 render();
}
function nextVocabQuiz(){vocabQuiz.index++;vocabQuiz.selected=-1;vocabQuiz.answered=false;if(vocabQuiz.index>=vocabQuiz.items.length)finishVocabQuiz();else render();}
function finishVocabQuiz(){
 vocabQuiz.finished=true;
 if(vocabQuiz.score>=7)completeActiveChapterChallenge();
 if(!vocabQuiz.mistakesOnly && vocabQuiz.score>=8 && state.vocabStage<3){state.vocabStage++;vocabQuiz.unlocked=true;}
 const today=localDayKey();
 if(vocabQuiz.score>=7 && state.vocabQuizRewardDate!==today){state.xp+=10;state.coins+=3;state.vocabQuizRewardDate=today;vocabQuiz.rewarded=true;}
 else vocabQuiz.rewarded=false;
 save();if(!vocabQuiz.mistakesOnly&&!state.chapterReturnKey){markDaily('vocab');return;}render();
}
function renderVocabQuiz(m){
 if(vocabQuiz.finished){
  const pass=vocabQuiz.score>=7;
  m.innerHTML=`<div class="eyebrow">VOCABULARY FOREST · RESULT</div><div class="h1">單字測驗完成！🌸</div><div class="panel" style="text-align:center"><div style="font-size:48px">${pass?'🏆':'🌱'}</div><div class="jp" style="font-size:36px">${vocabQuiz.score} / ${vocabQuiz.items.length}</div><b>${pass?'よくできました！做得很好！':'もう一度頑張ろう！再試一次吧！'}</b><div class="muted">${vocabQuiz.wrong.length?`今次有 ${vocabQuiz.wrong.length} 個單字答錯，已自動加入錯題。`:'今次沒有新錯題，太好了！'}</div></div>
  ${vocabQuiz.unlocked?'<div class="feedback">🎉 成功解鎖下一區！可以學習更多 N5 單字。</div>':''}
  ${vocabQuiz.rewarded?'<div class="feedback">🎁 今日首次達到 7 題或以上，獲得 +10 XP 及 +3 金幣！</div>':state.vocabQuizRewardDate===localDayKey()&&pass?'<div class="muted">今日測驗獎勵已領取，仍可繼續練習。</div>':'<div class="muted">答對 7 題或以上可獲每日首次獎勵：10 XP + 3 金幣。</div>'}
  <button class="btn" onclick="startVocabQuiz(false)">再測一次</button><button class="btn secondary" onclick="setPage('vocabMistakes')">重溫錯題（${state.vocabMistakes.length}）</button><button class="btn secondary" onclick="setPage('vocabPage')">返回單字森林</button>`;
  return;
 }
 const q=vocabQuiz.items[vocabQuiz.index],prompt=q.direction==='jpToZh'?q.word[0]:q.word[2],sub=q.direction==='jpToZh'?q.word[1]:'請選出對應的日文單字';
 m.innerHTML=`<div class="eyebrow">VOCABULARY FOREST · N5 QUIZ</div><div class="h1">單字小挑戰 🎯</div><div class="muted">題目 ${vocabQuiz.index+1} / ${vocabQuiz.items.length}　·　答對 ${vocabQuiz.score} 題</div><div class="progress"><i style="width:${vocabQuiz.index/vocabQuiz.items.length*100}%"></i></div><div class="panel" style="text-align:center;padding:24px"><div class="muted">${q.direction==='jpToZh'?'這個日文是甚麼意思？':'哪一個日文單字符合以下意思？'}</div><div class="jp" style="font-size:38px;margin:15px 0">${prompt}</div><div class="reading">${sub}</div></div><div class="choices">${q.opts.map((o,i)=>`<button class="choice ${vocabQuiz.answered&&i===q.answer?'correct':''} ${vocabQuiz.answered&&i===vocabQuiz.selected&&i!==q.answer?'wrong':''}" ${vocabQuiz.answered?'disabled':''} onclick="answerVocabQuiz(${i})">${'ABCD'[i]}. ${o}</button>`).join('')}</div>
 ${vocabQuiz.answered?`<div class="feedback ${vocabQuiz.selected===q.answer?'':'bad'}"><b>${vocabQuiz.selected===q.answer?'🎉 正確！':'再記住這個單字！'}</b><br>${q.word[0]}（${q.word[1]}）＝${q.word[2]}</div><button class="btn" onclick="nextVocabQuiz()">${vocabQuiz.index===vocabQuiz.items.length-1?'查看測驗結果':'下一題 →'}</button>`:''}
 <button class="btn secondary" onclick="if(confirm('確定離開測驗？今次不會結算獎勵。'))setPage('vocabPage')">離開測驗</button>`;
}
function renderVocabMistakes(m){
 const items=state.vocabMistakes;
 m.innerHTML=`<div class="eyebrow">VOCABULARY REVIEW</div><div class="h1">錯題重溫 📖</div><div class="muted">測驗答錯的單字會自動保存在這裏。之後在測驗中答對，就會自動移除。</div>
 ${items.length?items.map(x=>`<div class="tile"><span class="emoji">🔖</span><span><strong>${x.word[0]}</strong><small>${x.word[1]} · ${x.word[2]}</small></span></div>`).join(''):'<div class="panel"><div style="font-size:36px;text-align:center">🌸</div><b>目前沒有錯題！</b><div class="muted">完成單字測驗後，答錯的單字會自動出現在這裏。</div></div>'}
 ${items.length?'<button class="btn" onclick="startVocabQuiz(true)">開始錯題測驗</button>':''}<button class="btn secondary" onclick="setPage('vocabPage')">返回單字森林</button>`;
}
// Kotori 2.6 Smart Review: combines the original 30 cards and the 30 cards added in 2.5.
function allKotoriWords(){
 const old=vocabCards.map((w,i)=>({id:'old:'+i,jp:w[0],reading:w[1],meaning:w[2],example:'',exampleReading:'',exampleMeaning:''}));
 const fresh=vocab25Cards.map(w=>({id:'new:'+w.jp,jp:w.jp,reading:w.reading,meaning:w.meaning,example:w.example,exampleReading:w.exampleReading,exampleMeaning:w.exampleMeaning}));
 return old.concat(fresh);
}
function smartStat(word){
 const x=state.smartReview[word.id]||(state.smartReview[word.id]={attempts:0,correct:0,streak:0,interval:0,dueAt:0,lastAt:0,level:1});
 // 2.8.9 adds review signals safely; existing learner records remain intact.
 x.attempts=Number(x.attempts)||0;x.correct=Number(x.correct)||0;x.streak=Number(x.streak)||0;
 x.interval=Number(x.interval)||0;x.dueAt=Number(x.dueAt)||0;x.lastAt=Number(x.lastAt)||0;
 x.wrongCount=Number(x.wrongCount)||0;x.wrongStreak=Number(x.wrongStreak)||0;
 x.lastWrongAt=Number(x.lastWrongAt)||0;x.lastCorrectAt=Number(x.lastCorrectAt)||0;
 return x;
}
function smartAccuracy(x){return x.attempts?x.correct/x.attempts:0;}
function smartDueWords(){const now=Date.now();return allKotoriWords().filter(w=>{const x=smartStat(w);return x.dueAt>0&&x.dueAt<=now;});}
function smartPriority(word,now=Date.now()){
 const x=smartStat(word),acc=smartAccuracy(x),hoursSince=x.lastAt?Math.max(0,(now-x.lastAt)/3600000):9999;
 const overdue=x.dueAt>0&&x.dueAt<=now?Math.min(36,(now-x.dueAt)/3600000+1):0;
 const recentError=x.lastWrongAt?Math.max(0,1-(now-x.lastWrongAt)/(7*86400000)):0;
 const repeated=Math.min(5,x.wrongStreak||0)*2.4+Math.min(8,x.wrongCount||0)*.45;
 const weak=x.attempts?Math.max(0,1-acc)*8:2.2;
 const newWord=x.attempts===0?3.2:0;
 const mastery=x.streak>=3&&acc>=.85?-2.5:0;
 const justSeen=hoursSince<1?4:hoursSince<4?1.5:0;
 return overdue+recentError*9+repeated+weak+newWord+mastery-justSeen;
}
function smartRecord(word,correct,mode){
 const x=smartStat(word),now=Date.now();x.attempts++;x.lastAt=now;
 if(correct){
  x.correct++;x.streak++;x.wrongStreak=0;x.lastCorrectAt=now;
  // Stable recall gradually earns longer intervals (up to 30 days).
  x.interval=x.streak===1?1:x.streak===2?3:x.streak===3?7:x.streak===4?14:30;
  x.level=Math.min(4,Math.max(x.level,Math.min(4,1+x.streak)));
 }else{
  x.streak=0;x.wrongCount++;x.wrongStreak=Math.min(12,(x.wrongStreak||0)+1);x.lastWrongAt=now;
  x.interval=0;x.level=Math.max(1,x.level-1);
 }
 // Repeated misses return sooner, while a correct answer uses its growing interval.
 x.dueAt=now+(correct?x.interval*86400000:(x.wrongStreak>=2?30:120)*60*1000);
 state.smartReviewLog.push({id:word.id,correct:!!correct,mode:mode||'review',at:now});
 if(state.smartReviewLog.length>500)state.smartReviewLog=state.smartReviewLog.slice(-500);
 const recent=state.smartReviewLog.slice(-20);const rate=recent.length?recent.filter(a=>a.correct).length/recent.length:0.7;
 if(recent.length>=5&&state.smartReviewLog.length%5===0){if(rate>=.85)state.adaptiveLevel=Math.min(4,state.adaptiveLevel+1);else if(rate<.60)state.adaptiveLevel=Math.max(1,state.adaptiveLevel-1);}
 save();
}
let smartQuiz={items:[],index:0,selected:-1,answered:false,score:0,finished:false,mode:'review'};
function startSmartReview(mistakesOnly=false,categoryFilter=''){
 const allWords=allKotoriWords();const words=categoryFilter?vocabForestWords(categoryFilter):allWords;const now=Date.now();
 let pool=mistakesOnly?words.filter(w=>{const x=smartStat(w);return x.attempts>0&&(x.wrongStreak>0||x.streak===0||smartAccuracy(x)<.6);}):words.filter(w=>{const x=smartStat(w);return (x.dueAt>0&&x.dueAt<=now)||x.attempts===0||x.streak<3||smartAccuracy(x)<.75;});
 if(!pool.length&&!mistakesOnly)pool=words.filter(w=>smartStat(w).attempts===0);
 if(!pool.length)pool=words.filter(w=>smartStat(w).streak<3);
 if(!pool.length){alert(categoryFilter?`「${categoryFilter}」目前沒有需要複習的單字。`:'太好了！目前 60 個單字都已達到熟練標準。');return;}
 pool=pool.slice().sort((a,b)=>smartPriority(b,now)-smartPriority(a,now));
 // Pick from the strongest priority band with a small shuffle to keep sessions varied.
 const topBand=pool.slice(0,Math.min(pool.length,20));
 const chosen=shuffleArray(topBand).slice(0,Math.min(10,topBand.length));
 // Standard sessions reserve up to two slots for general practice, not only urgent cards.
 if(!mistakesOnly&&chosen.length>=5){
  const chosenIds=new Set(chosen.map(w=>w.id));
  const general=shuffleArray(words.filter(w=>{const x=smartStat(w);return !chosenIds.has(w.id)&&(!x.lastAt||(now-x.lastAt)>=3*86400000)&&!(x.dueAt>0&&x.dueAt<=now);})).slice(0,2);
  chosen.splice(Math.max(0,chosen.length-general.length),general.length,...general);
 }
 smartQuiz={items:chosen.map(w=>{
  const x=smartStat(w),acc=smartAccuracy(x);let mode=state.adaptiveLevel;
  if(x.attempts>=3&&acc<.6)mode=1;else if(x.attempts>=3&&acc>=.85)mode=Math.min(4,Math.max(mode,3));
  const all=words.filter(o=>o.id!==w.id);let correct,opts;
  if(mode===1){correct=w.meaning;opts=shuffleArray([correct,...shuffleArray(all.filter(o=>o.meaning!==correct)).slice(0,3).map(o=>o.meaning)]);}
  else if(mode===2){correct=w.jp;opts=shuffleArray([correct,...shuffleArray(all.filter(o=>o.jp!==correct)).slice(0,3).map(o=>o.jp)]);}
  else if(mode===3){correct=w.jp;opts=shuffleArray([correct,...shuffleArray(all.filter(o=>o.jp!==correct)).slice(0,3).map(o=>o.jp)]);}
  else{correct=w.exampleMeaning||w.meaning;opts=shuffleArray([correct,...shuffleArray(all.filter(o=>(o.exampleMeaning||o.meaning)!==correct)).slice(0,3).map(o=>o.exampleMeaning||o.meaning)]);}
  return {word:w,mode,opts,answer:opts.indexOf(correct)};
 }),index:0,selected:-1,answered:false,score:0,finished:false,mode:mistakesOnly?'mistakes':'review',category:categoryFilter};
 setPage('smartReview');
}
function answerSmartReview(i){if(smartQuiz.answered)return;const q=smartQuiz.items[smartQuiz.index];smartQuiz.selected=i;smartQuiz.answered=true;const ok=i===q.answer;if(ok)smartQuiz.score++;smartRecord(q.word,ok,'level'+q.mode);render();}
function nextSmartReview(){smartQuiz.index++;smartQuiz.selected=-1;smartQuiz.answered=false;if(smartQuiz.index>=smartQuiz.items.length){smartQuiz.finished=true;const today=localDayKey();if(smartQuiz.score>=Math.ceil(smartQuiz.items.length*.7)&&state.smartReviewRewardDate!==today){state.xp+=5;state.coins+=2;state.smartReviewRewardDate=today;smartQuiz.rewarded=true;save();}else smartQuiz.rewarded=false;render();}else render();}
function renderSmartReview(m){
 if(smartQuiz.finished){m.innerHTML=`<div class="eyebrow">KOTORI 2.6 · SMART REVIEW</div><div class="h1">智能複習完成！✨</div><div class="panel" style="text-align:center"><div style="font-size:46px">${smartQuiz.score>=7?'🏆':'🌱'}</div><div class="jp">${smartQuiz.score} / ${smartQuiz.items.length}</div><b>${smartQuiz.score>=7?'よくできました！做得很好！':'再練習一次就會更熟悉！'}</b><div class="muted">每個單字的熟練度及下次複習時間已更新。${smartQuiz.category?`本次完成「${smartQuiz.category}」分類。`:""}</div></div>${smartQuiz.rewarded?'<div class="feedback">🎁 獲得 +5 XP 及 +2 金幣！</div>':''}<button class="btn" onclick="startSmartReview(false,smartQuiz.category||'')">再做一輪智能複習</button><button class="btn secondary" onclick="setPage('smartReport')">查看學習報告</button><button class="btn secondary" onclick="vocabForestCategory=smartQuiz.category||vocabForestCategory;setPage('vocabPage')">返回單字森林</button>`;return;}
 if(!smartQuiz.items.length){const due=smartDueWords().length,all=allKotoriWords(),fresh=all.filter(w=>smartStat(w).attempts===0).length;m.innerHTML=`<div class="eyebrow">KOTORI 2.6 · SMART REVIEW</div><div class="h1">智能複習室 🧠</div><div class="panel"><b>今天的記憶狀態</b><div class="statgrid"><div class="statbox"><strong>${due}</strong><span class="muted">到期複習</span></div><div class="statbox"><strong>${fresh}</strong><span class="muted">尚未練習</span></div></div><div class="muted">系統會優先安排到期及較不熟悉的單字，並按近期表現調整題型。</div></div><button class="btn" onclick="startSmartReview(false)">開始智能複習</button><button class="btn secondary" onclick="startSmartReview(true)">只練習需要加強的單字</button><button class="btn secondary" onclick="setPage('smartReport')">查看 60 個單字的熟練度</button><button class="btn secondary" onclick="setPage('vocabPage')">返回單字森林</button>`;return;}
 const q=smartQuiz.items[smartQuiz.index],prompt=q.mode===1?q.word.jp:q.mode===2?q.word.meaning:q.mode===3?'請聽讀音並選出單字':(q.word.example||q.word.jp);
 m.innerHTML=`<div class="eyebrow">SMART REVIEW · ${smartQuiz.index+1} / ${smartQuiz.items.length}</div><div class="h1">智能複習 🧠</div><div class="muted">目前自動難度：Level ${q.mode}　·　答對 ${smartQuiz.score} 題</div><div class="progress"><i style="width:${smartQuiz.index/smartQuiz.items.length*100}%"></i></div><div class="panel" style="text-align:center;padding:22px"><div class="muted">${q.mode===1?'這個日文單字是甚麼意思？':q.mode===2?'請選出對應的日文單字':q.mode===3?'聆聽讀音，再選出單字':'選出正確的中文意思'}</div>${q.mode===3?`<button class="speak-btn" style="width:58px;height:58px;font-size:25px;margin:14px" onclick="speakJapanese(smartQuiz.items[smartQuiz.index].word.jp)">🔊</button>`:`<div class="jp" style="font-size:${q.mode===4?'23':'32'}px;margin:15px 0">${prompt}</div>${q.mode===4?`<div class="reading">${q.word.exampleReading||q.word.reading}</div>`:''}`}</div><div class="choices">${q.opts.map((o,i)=>`<button class="choice ${smartQuiz.answered&&i===q.answer?'correct':''} ${smartQuiz.answered&&i===smartQuiz.selected&&i!==q.answer?'wrong':''}" ${smartQuiz.answered?'disabled':''} onclick="answerSmartReview(${i})">${'ABCD'[i]}. ${o}</button>`).join('')}</div>${smartQuiz.answered?`<div class="feedback ${smartQuiz.selected===q.answer?'':'bad'}"><b>${smartQuiz.selected===q.answer?'🎉 正確！':'再記住這個單字！'}</b><br>${q.word.jp}（${q.word.reading}）＝${q.word.meaning}${q.word.example?`<br>${q.word.example}<br>${q.word.exampleMeaning}`:''}</div><button class="btn" onclick="nextSmartReview()">${smartQuiz.index===smartQuiz.items.length-1?'查看結果':'下一題 →'}</button>`:''}`;
}
function renderSmartReport(m){
 const words=allKotoriWords(),stats=words.map(w=>({w,x:smartStat(w)})),mastered=stats.filter(a=>a.x.streak>=3&&a.x.correct>=4).length,learning=stats.filter(a=>a.x.attempts>0&&!(a.x.streak>=3&&a.x.correct>=4)).length,unseen=60-mastered-learning,due=smartDueWords().length,attempts=stats.reduce((n,a)=>n+a.x.attempts,0),correct=stats.reduce((n,a)=>n+a.x.correct,0),accuracy=attempts?Math.round(correct/attempts*100):0,today=localDayKey(),todayLog=state.smartReviewLog.filter(x=>{const d=new Date(x.at);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')===today;}),todayCorrect=todayLog.filter(x=>x.correct).length,todayRate=todayLog.length?Math.round(todayCorrect/todayLog.length*100):0;
 const mastery=w=>{const x=smartStat(w);return x.streak>=3&&x.correct>=4?'熟練':x.attempts?'學習中':'初學'};
 m.innerHTML=`<div class="eyebrow">KOTORI 2.6 · DAILY REPORT</div><div class="h1">學習報告室 📊</div><div class="panel"><b>60 個單字總覽</b><div class="statgrid"><div class="statbox"><strong>${mastered}/60</strong><span class="muted">熟練</span></div><div class="statbox"><strong>${learning}</strong><span class="muted">學習中</span></div><div class="statbox"><strong>${unseen}</strong><span class="muted">初學</span></div><div class="statbox"><strong>${due}</strong><span class="muted">到期複習</span></div><div class="statbox"><strong>${accuracy}%</strong><span class="muted">累積正確率</span></div><div class="statbox"><strong>${todayRate}%</strong><span class="muted">今日正確率</span></div></div><div class="progress"><i style="width:${mastered/60*100}%"></i></div><div class="muted">已熟練 ${mastered} / 60 個單字 · 自動難度 Level ${state.adaptiveLevel}</div></div><div class="section-title">今日學習紀錄</div><div class="panel"><b>${todayLog.length} 次作答</b><div class="muted">答對 ${todayCorrect} 次 · 答錯 ${todayLog.length-todayCorrect} 次</div><div class="muted">累積作答 ${attempts} 次 · 累積答對 ${correct} 次</div></div><div class="section-title">單字熟練度</div>${stats.map(a=>`<div class="tile"><span style="flex:1"><strong>${a.w.jp} <small>${a.w.reading}</small></strong><small>${a.w.meaning} · 答對 ${a.x.correct}/${a.x.attempts} 次</small></span><span class="tag">${mastery(a.w)}</span></div>`).join('')}<button class="btn" onclick="startSmartReview(false)">開始智能複習</button><button class="btn secondary" onclick="setPage('smartMistakes')">查看需要加強的單字</button><button class="btn secondary" onclick="setPage('vocabPage')">返回單字森林</button>`;
}
function renderSmartMistakes(m){
 const words=allKotoriWords().filter(w=>{const x=smartStat(w);return x.attempts>0&&(x.streak===0||smartAccuracy(x)<.6);});
 m.innerHTML=`<div class="eyebrow">KOTORI 2.6 · MISTAKE CHALLENGE</div><div class="h1">錯題挑戰室 🎯</div><div class="muted">這裏會顯示近期答錯或正確率較低的單字。之後答得穩定，便會自動離開加強清單。</div>${words.length?words.map(w=>{const x=smartStat(w);return `<div class="tile"><span style="flex:1"><strong>${w.jp}</strong><small>${w.reading} · ${w.meaning} · 正確率 ${Math.round(smartAccuracy(x)*100)}%</small></span><button class="speak-btn" onclick="speakJapanese('${w.jp}')">🔊</button></div>`}).join(''):'<div class="panel"><b>目前沒有需要加強的單字！🌸</b><div class="muted">完成智能複習後，系統會自動更新這份清單。</div></div>'}<button class="btn" ${words.length?'':'disabled'} onclick="startSmartReview(true)">開始錯題挑戰</button><button class="btn secondary" onclick="setPage('smartReport')">查看學習報告</button><button class="btn secondary" onclick="setPage('vocabPage')">返回單字森林</button>`;
}

function renderGrammar(m){
 const i=(state.grammarIndex||0)%grammarCards.length,c=grammarCards[i],done=state.dailyDone.includes('grammar');
 const pattern=c[0].replace(/じゃありません|場所|時間|Vます|です|[ABN]|は|を|で|に/g,t=>{const cls=['A','B','N','場所','時間'].includes(t)?'noun':(['は','を','で','に'].includes(t)?'particle':'ending');return `<span class=\"grammar-token ${cls}\">${t}</span>`});
 m.innerHTML=`<div class=\"eyebrow\">GRAMMAR ACADEMY · N5</div><div class=\"h1\">文法學院 🏫</div><div class=\"panel\" style=\"padding:16px 14px\"><span class=\"tag\">句型 ${i+1} / ${grammarCards.length}</span><div class=\"grammar-pattern-box\"><div class=\"eyebrow\">句型結構</div><div class=\"jp grammar-pattern\">${pattern}</div><div class=\"grammar-legend\"><span class=\"tag\" style=\"background:#f8dce8;color:#a34f76\">名詞／代詞</span><span class=\"tag\" style=\"background:#dceee0;color:#477a58\">助詞</span><span class=\"tag\" style=\"background:#e8e0f4;color:#705b9a\">句尾／動詞</span></div></div><div class=\"muted\">${c[3]}</div><div class=\"grammar-example\"><div class=\"eyebrow\">例句・實際用法</div><div class=\"jp\">${c[1]}</div><div class=\"muted\">${c[2]}</div></div></div><div class=\"grammar-nav\"><button class=\"btn secondary\" onclick=\"state.grammarIndex=((state.grammarIndex||0)-1+${grammarCards.length})%${grammarCards.length};save();render()\">← 上一句</button><button class=\"btn\" onclick=\"state.grammarIndex=((state.grammarIndex||0)+1)%${grammarCards.length};save();render()\">下一句 →</button></div><button class=\"btn secondary\" ${done?'disabled':''} onclick=\"markDaily('grammar')\">${done?'已完成':'完成'}</button>`;
}
function renderLesson(m){
 const q=questions[qIndex];
 if(qIndex>=questions.length){m.innerHTML=`<div style="text-align:center;padding:35px 5px"><div style="font-size:55px">🏆</div><div class="h1">課堂完成！</div><div class="jp">よくできました！</div><div class="muted">做得很好！你完成了今天的日文小挑戰。</div><div class="panel"><b>獲得獎勵</b><div class="jp">+${questions.length*10} XP</div></div><button class="btn" onclick="setPage('map')">返回學習地圖</button></div>`;return}
 m.innerHTML=`<div class="eyebrow">DAILY LESSON · N5</div><div class="h1">日常日文小課堂</div><div class="muted">題目 ${qIndex+1} / ${questions.length}</div><div class="progress"><i style="width:${qIndex/questions.length*100}%"></i></div>
 <div class="panel"><div class="jp">${q.jp}</div>${showHint?`<div class="reading">${q.reading}</div><div class="muted" style="text-align:center;margin-top:5px">${q.meaning}</div>`:''}<button class="btn secondary" onclick="showHint=!showHint;render()"> ${showHint?'隱藏':'顯示'} 假名及中文提示</button></div>
 <b>選擇正確的意思：</b><div class="choices">${q.opts.map((o,i)=>`<button class="choice ${selected===String(i)?(answered?(i===q.answer?'correct':'wrong'):'selected'):''}" ${answered?'disabled':''} onclick="selected='${i}';render()">${'ABCD'[i]}. ${o}</button>`).join('')}</div>
 ${answered?`<div class="feedback ${Number(selected)===q.answer?'':'bad'}"><b>${Number(selected)===q.answer?'🎉 正解！':'再記一次吧！'}</b><br>${q.why}</div><button class="btn" onclick="if(Number(selected)===q.answer){state.xp+=10;state.coins+=3;save()}qIndex++;selected='';answered=false;render()">${qIndex===questions.length-1?'完成課堂':'下一題 →'}</button>`:`<button class="btn" ${selected===''?'disabled':''} onclick="answered=true;render()">確認答案</button>`}`;
}
document.querySelectorAll('.nav button').forEach(b=>b.addEventListener('click',()=>setPage(b.dataset.page)));
ensureDaily();updateStats();render();
