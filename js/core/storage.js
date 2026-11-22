// Kotori 2.8.5 core storage layer.
// Keep the original key and additive migration defaults to preserve existing learning data.
const KEY='kotori-jp-v1';
let state=JSON.parse(localStorage.getItem(KEY)||'{"xp":0,"coins":0,"completed":[],"kanaIndex":0,"comicIndex":0,"storyDone":false}');
// Extend old saved progress safely; keep the original storage key so XP and coins remain intact.
state.reviewItems=Array.isArray(state.reviewItems)?state.reviewItems:[];
state.dailyDate=state.dailyDate||new Date().toLocaleDateString('en-CA');
state.dailyDone=Array.isArray(state.dailyDone)?state.dailyDone:[];
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
state.chapterRewards=state.chapterRewards&&typeof state.chapterRewards==='object'?state.chapterRewards:{};

function save(){localStorage.setItem(KEY,JSON.stringify(state));updateStats()}
