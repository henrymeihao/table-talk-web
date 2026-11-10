(()=>{
 const root=document.querySelector('#cafe-play');if(!root)return;
 const e=value=>esc(value),model=CafePlay;
 state.cafePlay=model.normalise(state.cafePlay);
 let chooser=!state.cafePlay.current;
 const save=()=>{persist();const status=root.querySelector('.cafe-save');if(status)status.textContent=storageOK?'这次的回答已保存在当前浏览器':'当前无法保存，刷新后可能丢失'};
 const audio=text=>sentenceAudioMarkup(text);
 const translation=text=>`<details class="cafe-translation"><summary>看中文</summary><p>${e(text)}</p></details>`;
 function reference(t){return `<details class="cafe-reference"><summary>对照一种表达，看看怎么用</summary><p class="cafe-english" lang="en">${e(t.answer)}</p>${audio(t.answer)}<p>${e(t.note)}</p><p class="cafe-terms">${t.terms.map(e).join('　/　')}</p></details>`}
 function history(){const runs=state.cafePlay.runs.slice(-4).reverse();return `<section class="cafe-history" id="cafe-history"><h3>最近试过的交流</h3>${runs.length?runs.map(r=>`<p><b>${e(model.get(r.scenario).title)}</b> · ${['还需要练','借助提示完成','能独立表达'][r.score]}<br><span class="small">${new Date(r.at).toLocaleDateString('zh-CN')} · ${r.due<=Date.now()?'可以再试一次':'下次复习 '+dueLabel(r.due)}</span> <button class="text-control" data-cafe-start="${r.scenario}">再试一次 →</button></p>`).join(''):'<p class="small">完成三轮表达后记一次自评。浏览记录和点击次数不算练习成绩。</p>'}</section>`}
 function render(focus=false){
  const stop=document.querySelector('#speech-stop');if(stop&&!stop.disabled)stop.click();
  const p=state.cafePlay,s=p.current;
  if(chooser){
   root.innerHTML=`<div class="cafe-heading"><span class="eyebrow">AT THE COFFEE SHOP · 先选一件想做的事</span><h1>今天想聊点什么？</h1><p class="lead">不用先学完整段对话。从一个你想问的问题开始，试着把话接下去。</p></div>${s?`<button class="action-button cafe-resume" data-cafe-resume>继续上次：${e(model.get(s.scenario).title)} →</button>`:''}<div class="cafe-goals">${model.scenarios.map((d,i)=>`<button class="cafe-goal" data-cafe-start="${d.id}"><span class="eyebrow">0${i+1} / ${d.tag}</span><strong>${e(d.title)}</strong><span>${e(d.desc)}</span><span class="cafe-go">试着聊聊 ↗</span></button>`).join('')}</div><details class="cafe-own"><summary>我还有一个自己想问的问题</summary><label for="cafe-question">记下来，再选一个相近的目标练习（中文或英文都可以）</label><textarea id="cafe-question" maxlength="2000" placeholder="比如：想问问店员，他休息时会去附近哪里喝咖啡。">${e(p.question)}</textarea><p class="small">问题会随本次练习保存。这版使用预设回应，不会根据自由输入生成回答。</p></details><p class="small cafe-boundary">三轮表达即可结束。卡住时再看提示；下方的词汇和语法随时可以查。</p>${history()}`;
  }else{
   const d=model.get(s.scenario),route=d.routes.find(r=>r.id===s.route);
   const turns=[model.currentTurn({...s,answers:[]}),...(route?.turns||[])];
   let log='';
   s.answers.forEach((a,i)=>{const t=turns[i];log+=`<article class="cafe-round"><div class="cafe-bubble cafe-staff"><span class="speaker">BARISTA · ${i+1}</span><p class="cafe-english" lang="en">${e(t.en)}</p>${audio(t.en)}${translation(t.zh)}</div><div class="cafe-bubble cafe-you"><span class="speaker">你${/[\u4e00-\u9fff]/.test(a.text)?' · 写下的意思':''}</span><p class="cafe-answer">${e(a.text)}</p></div>${reference(t)}</article>`});
   let next='';
   if(s.answers.length===1&&!s.route){next=`<section class="cafe-next" id="cafe-next" tabindex="-1"><h3>你更想接着聊哪一个？</h3><div class="cafe-branches">${d.routes.map(r=>`<button class="cafe-branch" data-cafe-route="${r.id}"><strong>${e(r.label)}</strong><span>${e(r.desc)}</span></button>`).join('')}</div></section>`}
   else if(s.answers.length<3){const t=model.currentTurn(s);next=`<section class="cafe-next" id="cafe-next" tabindex="-1"><div class="cafe-bubble cafe-staff"><span class="speaker">BARISTA · ${s.answers.length+1}</span><p class="cafe-english" lang="en">${e(t.en)}</p>${audio(t.en)}${translation(t.zh)}</div><form id="cafe-form"><label for="cafe-reply">${e(t.cue)}</label><textarea id="cafe-reply" maxlength="2000" placeholder="先用自己的话试试；也可以先写中文。">${e(s.draft)}</textarea><details class="cafe-help" ${s.helped?'open':''}><summary>卡住了，给我一点提示</summary><p class="cafe-terms">${t.terms.map(e).join('<br>')}</p><p class="cafe-english" lang="en">${e(t.answer)}</p>${audio(t.answer)}<p>${e(t.note)}</p></details><div class="cafe-send"><button class="action-button" type="submit" ${!s.draft.trim()?'disabled':''}>说这句，继续 →</button><span class="small">预设情境，不自动判断回答对错</span></div></form></section>`}
   else{next=`<section class="cafe-finish" id="cafe-next" tabindex="-1"><span class="eyebrow">YOU KEPT IT GOING</span><h3>这次聊到了${e(route.label)}。</h3><p>回看自己的三句回答，需要时展开参考表达。下次在现场，你觉得自己能说到哪一步？</p><div class="cafe-ratings" aria-label="本次交流自评">${['还需要练','借助提示完成','能独立表达'].map((label,i)=>`<button data-cafe-score="${i}" aria-pressed="${s.score===i}">${label}</button>`).join('')}</div><p class="cafe-receipt" role="status">${s.score===null?'这是自己的判断，不是自动评分。':'已保存自评 · 下次复习 '+dueLabel(p.runs.find(r=>r.id===s.id)?.due||Date.now())}</p><div class="cafe-finish-actions"><button class="action-button secondary" data-cafe-replay>换种问法再来一次</button><button class="text-control" data-cafe-choose>换个目标 →</button></div></section>`}
   root.innerHTML=`<div class="cafe-session-heading"><button class="text-control" data-cafe-choose>← 选其他目标</button><span class="small">${Math.min(s.answers.length+1,3)} / 3 轮表达</span></div><h1 class="cafe-session-title">${e(d.title)}</h1>${s.custom?`<p class="cafe-personal"><b>我想问：</b>${e(s.custom)}</p>`:''}<p class="cafe-save small" role="status">回答自动保存在当前浏览器 · 随时可以离开</p><div class="cafe-log">${log}${next}</div><a class="cafe-reference-link" href="#cafe-reference">想查别的表达？打开词汇与语法参考 ↓</a>`;
  }
  if(focus){const target=root.querySelector('#cafe-next')||root;target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});if(target.hasAttribute('tabindex'))target.focus({preventScroll:true})}
 }
 root.addEventListener('input',event=>{const el=event.target;if(el.id==='cafe-question'){state.cafePlay.question=el.value;save()}if(el.id==='cafe-reply'){state.cafePlay.current.draft=el.value;root.querySelector('[type="submit"]').disabled=!el.value.trim();save()}});
 root.addEventListener('toggle',event=>{if(event.target.matches('.cafe-help')&&event.target.open){state.cafePlay.current.helped=true;save()}},true);
 root.addEventListener('submit',event=>{if(event.target.id!=='cafe-form')return;event.preventDefault();if(model.submit(state.cafePlay.current,root.querySelector('#cafe-reply').value)){save();render(true)}});
 root.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;const p=state.cafePlay;
  if(b.hasAttribute('data-cafe-start')){const previous=p.runs.filter(r=>r.scenario===b.dataset.cafeStart).length;p.current=model.start(b.dataset.cafeStart,p.question,previous%2);chooser=false;save();render(true)}
  else if(b.hasAttribute('data-cafe-resume')){chooser=false;render(true)}
  else if(b.hasAttribute('data-cafe-choose')){chooser=true;render();root.scrollIntoView({block:'start'})}
  else if(b.hasAttribute('data-cafe-route')){if(model.choose(p.current,b.dataset.cafeRoute)){save();render(true)}}
  else if(b.hasAttribute('data-cafe-score')){model.rate(p,Number(b.dataset.cafeScore));save();render(true)}
  else if(b.hasAttribute('data-cafe-replay')){p.current=model.start(p.current.scenario,p.current.custom,1-p.current.variant);save();render(true)}
 });
 function openReference(hash=location.hash){let id;try{id=decodeURIComponent(hash.slice(1))}catch{return}const target=document.getElementById(id||'top');if(target&&document.querySelector('#cafe-reference').contains(target)){document.querySelector('#cafe-reference').open=true;requestAnimationFrame(()=>target.scrollIntoView({block:'start'}))}}
 document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(link)openReference(link.getAttribute('href'))});
 window.addEventListener('hashchange',()=>openReference());render();openReference();save();
})();
