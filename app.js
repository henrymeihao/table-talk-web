const $=selector=>document.querySelector(selector);
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY=topic.storageKey;
let storageOK=true,raw=null;
try{raw=JSON.parse(localStorage.getItem(KEY))}catch{storageOK=false}
const state=LearningStore.normalise(raw,words,allTasks,coreExpressions);
for(const task of tasks)if(state.ratings[task.id]!==undefined){
 for(const id of taskExpressionMap[task.id]||[]){
  if(!state.reviews['expr:'+id])LearningStore.rate(state,'expr:'+id,state.ratings[task.id]);
 }
}
let reviewSession=[];
function persist(){
 try{localStorage.setItem(KEY,JSON.stringify(state));localStorage.setItem('table-talk-last-visit',JSON.stringify({topic:topic.id,section:state.lastSection,at:Date.now()}))}catch{storageOK=false}
 $('#save-status').textContent=storageOK?'回答、收藏与复习安排已自动保存':'当前无法保存；离开页面后记录可能丢失';
}
function dueLabel(time){return new Date(time).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}
function ratingsMarkup(id,review=false){
 const key=review?'data-review-rate':'data-rate';
 const current=review?undefined:state.ratings[id];
 return `<div class="ratings" aria-label="${review?'回忆情况':'任务自评'}">${['还不会','有提示能说','能独立表达'].map((label,n)=>`<button ${key}="${id}" data-value="${n}" aria-pressed="${current===n}">${label}</button>`).join('')}</div>`;
}
function taskMarkup(t,i){return `<article class="task" id="task-${t.id}"><span class="eyebrow">${t.id===transferTask.id?'TRANSFER':'TASK 0'+(i+1)}</span><h3>${t.name}</h3><p>${t.goal}</p><label for="draft-${t.id}">你的回答（也可以先口头说一遍）</label><textarea id="draft-${t.id}" data-draft="${t.id}" placeholder="先试着组织自己的表达…">${esc(state.drafts[t.id]||'')}</textarea><p class="criteria">检查：${t.checks}</p>${ratingsMarkup(t.id)}<a class="answer-link" href="#answer-${t.id}">参考表达在下方 ↓</a></article>`}
function answerMarkup(t,i){return `<article class="answer" id="answer-${t.id}"><h4>${t.id===transferTask.id?'迁移任务':String(i+1).padStart(2,'0')} / ${t.name}</h4><p class="en" lang="en">${esc(t.answer).replace(/\n/g,'<br>')}</p>${sentenceAudioMarkup(t.answer,'听参考表达')}<p>${t.why}</p><p class="alternatives">另一种说法 / 进一步应对：${t.alternative}</p><a href="#task-${t.id}" class="answer-link">回到这一题，记录自评 ↑</a></article>`}
$('#dialogue-audio').innerHTML=sentenceAudioMarkup(dialogue.map(([,en])=>en).join(' '),'听整段对话');
$('#dialogue').innerHTML=dialogue.map(([who,en,zh])=>`<div class="line"><span class="speaker">${who}</span><div><p class="en" lang="en">${en}</p>${sentenceAudioMarkup(en)}<p class="zh">${zh}</p></div></div>`).join('');
const coreAudioExamples=topic.coreAudioExamples;
$('#core-expressions').innerHTML=coreExpressions.map(e=>`<article class="core-expression"><span class="badge">这次先会用</span><h3 lang="en">${e.en}</h3><p><strong>${e.zh}</strong></p><p>${e.why}</p><p class="core-audio-example" lang="en">${coreAudioExamples[e.id]}</p>${sentenceAudioMarkup(coreAudioExamples[e.id],'听完整例句')}</article>`).join('');
$('#grammar').innerHTML=grammar.map((g,i)=>`<article class="pattern" id="pattern-${i}"><div class="pattern-head"><span>${g.n}</span><h3>${g.title}</h3></div><div class="formula" lang="en">${g.formula}</div><p>${g.body}</p><div class="examples">${g.examples.map(([en,zh])=>`<p lang="en">${en}<small lang="zh-CN">${zh}</small></p>${sentenceAudioMarkup(en)}`).join('')}</div><div class="mistake"><strong>留意区别 / 常见误用</strong><p>${g.error}</p></div></article>`).join('');
$('#choice-context').innerHTML=contextChoices.map(c=>`<article class="choice-card"><h3>${c.title}</h3><div class="choice-pair"><p lang="en">${c.a}</p>${sentenceAudioMarkup(c.a)}<p lang="en">${c.b}</p>${sentenceAudioMarkup(c.b)}</div><p>${c.why}</p><p class="small">${c.next}</p></article>`).join('');
function wordMarkup(w){return `<article class="word" id="vocab-${w.id}" data-word-id="${w.id}"><div><h4 lang="en">${w.text}</h4><span class="pos">${w.kind}</span>${wordAudioMarkup(w)}</div><div class="word-body"><p class="meaning">${w.meaning}</p><p class="example" lang="en">${w.example}</p><p class="usage">${w.note}</p></div><button class="star" data-save="${w.id}" aria-pressed="${state.saved.includes(w.id)}" aria-label="${state.saved.includes(w.id)?'取消收藏':'收藏'}：${w.text}">${state.saved.includes(w.id)?'★':'☆'}</button></article>`}
$('#essential-words').innerHTML=essentialWords.map(wordMarkup).join('');
$('#word-count').textContent=`${referenceWords.length} 个扩展词条 · 按需打开`;
$('#words').innerHTML=lexiconGroups.map((group,gi)=>referenceWords.some(w=>w.group===gi)?`<section class="word-group"><h3>${group.name}<span>${referenceWords.filter(w=>w.group===gi).length} 个</span></h3><p class="small">按需查阅 · 不要求背完</p>${referenceWords.filter(w=>w.group===gi).map(wordMarkup).join('')}</section>`:'').join('');
$('#everyday-exchanges').innerHTML=everydayExchanges.map((e,i)=>`<article class="exchange"><span class="eyebrow">EXCHANGE 0${i+1}</span><h3>${e.title}</h3><div class="exchange-pair"><div><span class="speaker">听到这句</span><p lang="en">${e.heard}</p>${sentenceAudioMarkup(e.heard)}<small>${e.meaning}</small></div><div><span class="speaker">可以这样接</span><p lang="en">${e.reply}</p>${sentenceAudioMarkup(e.reply)}<small>${e.zh}</small></div></div><p>${e.why}</p><p class="small">${e.use}</p></article>`).join('');
$('#idioms').innerHTML=idioms.filter(([en])=>!['I’m torn between…','I’ll go with…','That works for me.'].includes(en)).map(([en,tag,meaning,example,note])=>`<article class="idiom"><div class="idiom-head"><h3 lang="en">${en}</h3><span class="badge">兴趣扩展 · ${tag}</span></div><p>${meaning}</p><p class="en" lang="en">${example}</p>${sentenceAudioMarkup(example)}<p class="small">${note}</p></article>`).join('');
$('#tasks').innerHTML=tasks.map(taskMarkup).join('');
$('#answers').innerHTML=tasks.map(answerMarkup).join('');
$('#transfer-task').innerHTML=taskMarkup(transferTask,3);
$('#transfer-answer').innerHTML=answerMarkup(transferTask,3);
function renderSaved(){
 const saved=state.saved.map(id=>words.find(w=>w.id===id)).filter(Boolean);
 $('#saved').innerHTML=saved.length?saved.map(w=>`<div class="saved-row"><div><b lang="en">${w.text}</b><p>${w.meaning}</p><p class="usage" lang="en">${w.example}</p><small>${state.reviews['word:'+w.id]?.score===null?'待首次回忆':state.reviews['word:'+w.id]?'下次 '+dueLabel(state.reviews['word:'+w.id].due):''}</small></div><button class="star" data-save="${w.id}" aria-pressed="true" aria-label="取消收藏：${w.text}">★</button></div>`).join(''):'<p class="review-note">收藏一个词，它就会加入回忆练习。每个词分别保存，不会连带收藏同组的其他词。</p>';
}
function renderSummary(){
 const counts=[0,0,0];allTasks.forEach(t=>{if([0,1,2].includes(state.ratings[t.id]))counts[state.ratings[t.id]]++});
 const rated=counts.reduce((a,b)=>a+b,0);
 $('#summary').innerHTML=`<div class="stats"><div class="stat"><b>${counts[2]}</b><span>能独立表达</span></div><div class="stat"><b>${counts[1]}</b><span>有提示能说</span></div><div class="stat"><b>${counts[0]}</b><span>还需要练习</span></div></div><p class="review-note">已自评 ${rated} / ${allTasks.length} 个任务（含 1 个迁移任务）。这是自评记录，不会自动判定你的答案。</p>`;
 const weak=allTasks.filter(t=>state.ratings[t.id]!==2);
 $('#weak').innerHTML=weak.length?weak.map(t=>`<div class="weak-row"><a href="#task-${t.id}">${t.name} ↗</a><span>${state.ratings[t.id]===undefined?'尚未自评':state.ratings[t.id]===0?'先重读讲解，再试着说':'遮住参考表达，再说一次'}</span></div>`).join(''):'<p class="review-note">这一轮都能独立表达。下次从到期复习进入另一个情境，再试一次。</p>';
 renderPracticeHistory();
 const due=LearningStore.due(state);
 const active=Object.entries(state.reviews).filter(([,r])=>r.active);
 const future=active.filter(([,r])=>r.due>Date.now()).map(([,r])=>r.due).sort((a,b)=>a-b);
 $('#due-count').textContent=due.length;
 $('#review-next').textContent=due.length?`${due.length} 项可以复习，每轮最多 5 项。`:future.length?`暂时没有到期内容。下一次：${dueLabel(future[0])}；也可以提前练习。`:'先完成任务自评、收藏词语，或把 6 个核心表达加入复习。';
 $('#start-due').disabled=!due.length;
 $('#start-early').disabled=!active.length;
 const enrolled=coreExpressions.filter(e=>state.reviews['expr:'+e.id]?.active).length;
 $('#enroll-core').textContent=enrolled===6?'6 个核心表达已加入复习':`把核心表达加入复习（已加入 ${enrolled}/6）`;
 $('#enroll-core').disabled=enrolled===6;
}
function catalogItem(key){
 const [kind,id]=key.split(':');
 if(kind==='word'){
  const w=words.find(w=>w.id===id);if(!w)return null;
  return {type:'词语回忆',prompt:`在这个场景中，怎样说“${w.meaning}”？`,answer:w.text,note:w.example,source:essentialTerms.includes(w.text)?'#vocab-'+w.id:'#lexicon'};
 }
 if(kind==='expr'){
  const e=coreExpressions.find(e=>e.id===id);if(!e)return null;
  return {type:topic.reviewLabel,prompt:e.cue,answer:e.answer,note:e.why,source:'#patterns'};
 }
 const t=allTasks.find(t=>t.id===id);if(!t)return null;
 return {type:'任务回忆',prompt:t.goal,answer:t.answer,note:'检查：'+t.checks,source:'#task-'+t.id};
}
function startReview(early=false){
 const now=Date.now();
 const keys=early?Object.entries(state.reviews).filter(([,r])=>r.active).sort((a,b)=>a[1].due-b[1].due).map(([key])=>key):LearningStore.due(state,now);
 reviewSession=keys.filter(key=>catalogItem(key)).slice(0,5);
 if(!reviewSession.length){renderSummary();return}
 $('#review-session').innerHTML=`<div class="session-header"><div><h3>先回忆，再对照</h3><p class="small">${early?'提前复习':'本轮到期复习'} · ${reviewSession.length} 项。先试着说出来；下方可一次显示全部参考。</p></div><label class="slow-option"><input type="checkbox" id="reveal-review"> 显示本轮参考</label></div>${reviewSession.map((key,i)=>{const item=catalogItem(key);return `<article class="recall-card" id="recall-${i}"><span class="eyebrow">0${i+1} / ${item.type}</span><h4>${item.prompt}</h4><div class="recall-answer" hidden><p class="en" lang="en">${esc(item.answer).replace(/\n/g,'<br>')}</p><p class="small">${item.note}</p><a class="answer-link" href="${item.source}">回看原来的讲解 ↗</a></div>${ratingsMarkup(key,true)}<p class="rating-receipt" aria-live="polite"></p></article>`}).join('')}<button class="action-button" id="end-review">结束本轮，更新复习列表</button>`;
 $('#review-session').scrollIntoView({behavior:'smooth',block:'start'});
}
function scheduleTask(id,score){
 state.ratings[id]=score;
 LearningStore.rate(state,'task:'+id,score);
 for(const expressionId of taskExpressionMap[id]||[]){
  const key='expr:'+expressionId;
  // Task self-assessment enrolls the corresponding expression; later reviews
  // remain independent instead of being overwritten by a different task.
  if(!state.reviews[key])LearningStore.rate(state,key,score);
 }
}
function filterWords(){
 const query=$('#word-search').value.trim().toLocaleLowerCase();let count=0;
 for(const el of document.querySelectorAll('#words .word')){
  const w=words.find(w=>w.id===el.dataset.wordId);
  el.hidden=![w.text,w.meaning,w.example,w.note].join(' ').toLocaleLowerCase().includes(query);
  if(!el.hidden)count++;
 }
 for(const el of document.querySelectorAll('.word-group'))el.hidden=![...el.querySelectorAll('.word')].some(w=>!w.hidden);
 $('#no-words').hidden=count>0;
 if(query)$('#reference-vocabulary').open=true;
 $('#word-count').textContent=query?`找到 ${count} / ${referenceWords.length} 个扩展词条`:`${referenceWords.length} 个扩展词条 · 按需打开`;
}
document.addEventListener('input',event=>{
 const el=event.target;
 if(el.dataset.draft){state.drafts[el.dataset.draft]=el.value;persist()}
 if(el.id==='word-search')filterWords();
});
document.addEventListener('change',event=>{
 if(event.target.id==='reveal-review')for(const el of document.querySelectorAll('.recall-answer'))el.hidden=!event.target.checked;
});
document.addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.dataset.rate){
  const id=button.dataset.rate;const n=Number(button.dataset.value);
  scheduleTask(id,n);LearningStore.record(state,'task:'+id,n);
  for(const b of document.querySelectorAll(`[data-rate="${id}"]`))b.setAttribute('aria-pressed',String(b===button));
  persist();renderSummary();
 }
 if(button.dataset.save){
  const id=button.dataset.save;const selected=!state.saved.includes(id);
  if(selected){state.saved.push(id);LearningStore.enroll(state,'word:'+id)}
  else{state.saved=state.saved.filter(value=>value!==id);if(state.reviews['word:'+id])state.reviews['word:'+id].active=false}
  const word=words.find(w=>w.id===id);
  for(const b of document.querySelectorAll(`[data-save="${id}"]`)){
   b.setAttribute('aria-pressed',String(selected));b.textContent=selected?'★':'☆';b.setAttribute('aria-label',`${selected?'取消收藏':'收藏'}：${word.text}`);
  }
  persist();renderSaved();renderSummary();
 }
 if(button.id==='enroll-core'){
  for(const e of coreExpressions)LearningStore.enroll(state,'expr:'+e.id);
  persist();renderSummary();
 }
 if(button.id==='start-due')startReview();
 if(button.id==='start-early')startReview(true);
 if(button.dataset.reviewRate){
  const key=button.dataset.reviewRate;if(!reviewSession.includes(key))return;
  const score=Number(button.dataset.value);
  LearningStore.rate(state,key,score);LearningStore.record(state,key,score);
  if(key.startsWith('task:')){
   const id=key.slice(5);state.ratings[id]=score;
   for(const b of document.querySelectorAll(`[data-rate="${id}"]`))b.setAttribute('aria-pressed',String(Number(b.dataset.value)===score));
  }
  for(const b of document.querySelectorAll(`[data-review-rate="${key}"]`))b.setAttribute('aria-pressed',String(b===button));
  button.closest('.recall-card').querySelector('.rating-receipt').textContent='已保存 · 下次复习 '+dueLabel(state.reviews[key].due);
  persist();renderSummary();renderSaved();
 }
 if(button.id==='end-review'){
  reviewSession=[];$('#review-session').innerHTML='<p class="review-note">本轮已结束。已自评的项目会按新时间安排；没有自评的项目仍留在原来的复习列表。</p>';renderSummary();
 }
});
let ticking=false;
window.addEventListener('scroll',()=>{
 if(ticking)return;ticking=true;
 requestAnimationFrame(()=>{const max=document.documentElement.scrollHeight-window.innerHeight;$('#reading-progress').style.width=(max>0?window.scrollY/max*100:0)+'%';ticking=false});
},{passive:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderSummary()});
setInterval(renderSummary,60000);
renderSaved();renderSummary();persist();setupPronunciation();

function localDay(time){const d=new Date(time);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')}
function renderPracticeHistory(){
 let box=$('#practice-history');if(!box){box=document.createElement('div');box.id='practice-history';$('#summary').after(box)}
 const days=new Map();
 for(const event of state.history){const day=localDay(event.at);if(!days.has(day))days.set(day,{count:0,independent:0});const row=days.get(day);row.count++;if(event.score===2)row.independent++}
 const list=[...days.entries()].sort((a,b)=>b[0].localeCompare(a[0])).slice(0,7);
 box.innerHTML='<h3>最近的练习记录</h3>'+(list.length?list.map(([day,r])=>`<p class="small">${day} · 自评 ${r.count} 次，其中 ${r.independent} 次选择“能独立表达”</p>`).join(''):'<p class="small">从这次更新后开始按日期记录主动练习。原有回答、收藏与复习日期继续保留。</p>');
}
const sectionLabels={scene:'场景对话',casual:'实用接话',patterns:'表达与语法',essentials:'必要词块',practice:'输出练习',transfer:'迁移练习',review:'复习',lexicon:'扩展词库'};
if(state.lastSection!=='top'){
 const resume=document.createElement('p');resume.className='resume-note';resume.innerHTML=`上次看到“${sectionLabels[state.lastSection]}”。<a href="#${state.lastSection}">继续上次的位置 →</a>`;$('.audio-global').before(resume);
}
let positionTimer;
function savePosition(){
 let current='top';for(const id of LearningStore.sections.slice(1)){const el=$('#'+id);if(el&&el.getClientRects().length&&!el.closest('details:not([open])')&&el.getBoundingClientRect().top<=window.innerHeight*.4)current=id}
 state.lastSection=current;persist();
}
window.addEventListener('scroll',()=>{clearTimeout(positionTimer);positionTimer=setTimeout(savePosition,500)},{passive:true});
window.addEventListener('pagehide',()=>{clearTimeout(positionTimer);savePosition()});
document.addEventListener('visibilitychange',()=>{if(document.hidden)savePosition()});
