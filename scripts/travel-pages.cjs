const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const lessons=JSON.parse(fs.readFileSync(path.join(root,'content/travel.json'),'utf8'));
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const chapter=(id,num,title,desc,body)=>`<section id="${id}" class="chapter"><div class="chapter-head"><span>${num} / TRAVEL NOTES</span><span>短期旅游 · 实用表达</span></div><h2>${title}</h2><p class="desc">${desc}</p>${body}</section>`;
function page(d){
 const base=fs.readFileSync(path.join(root,'restaurant.html'),'utf8');
 let h=base.replace(/<title>.*?<\/title>/,'<title>Table Talk · '+esc(d.title)+'</title>');
 h=h.replace(/<script src="restaurant-config.js" defer><\/script><script src="lesson.js" defer><\/script><script src="lexicon.js" defer><\/script>/,'<script>'+`const lessonDefinition=${JSON.stringify(d).replace(/</g,'\\u003c')};`+'</script><script src="travel-adapter.js" defer></script>');
 h=h.replace(/<div class="topic-switch">.*?<\/div>/,'<div class="topic-switch"><a href="index.html">全部场景</a><span>'+esc(d.title)+'</span></div>');
 h=h.replace(/<aside>[\s\S]*?<\/aside>/,`<aside><span class="eyebrow">SHORT TRIP / ${d.id.toUpperCase()}</span><h2>${esc(d.title)}</h2><p>一节可以顺着读完的场景课。</p><nav aria-label="本节目录">${[['scene','01 场景对话'],['casual','02 听懂、接得上'],['patterns','03 表达怎么选'],['essentials','04 必要词块 · 10 个'],['practice','05 自己表达'],['transfer','06 换个情境'],['review','07 隔天复习'],['lexicon','08 扩展查词']].map(([id,label])=>`<a href="#${id}">${label}</a>`).join('')}</nav><div class="side-note">先把具体需求说清楚，再练习处理变化。词表按需收藏，记录单独保存。</div><p id="save-status" class="small" role="status"></p></aside>`);
 h=h.replace(/<section class="intro">[\s\S]*?<\/section>/,`<section class="intro"><span class="eyebrow">EVERYDAY ENGLISH / SHORT TRIPS</span><h1>${esc(d.en)}</h1><p class="lead">${esc(d.intro)}</p><div class="meta"><span>6 组实用接话</span><span>10 个必要词块</span><span>句子与词汇均可朗读</span></div><div class="insight"><b>这次要处理的事情</b><p>${esc(d.context)}</p></div></section>`);
 if(d.notice)h=h.replace('</section>',`<p class="small activity-note">${esc(d.notice)}</p></section>`);
 const pieces={
 scene:chapter('scene','01','See how it unfolds.','先读六段现场交流，再听整段或逐句重听。','<div id="dialogue-audio"></div><div id="dialogue"></div>'),
 casual:chapter('casual','02','Know what to say next.','听清对方问的是什么，选一句能继续交流的回应。','<div id="everyday-exchanges"></div><details class="reference-fold"><summary>再认识一个日常表达</summary><div id="idioms"></div></details>'),
 patterns:chapter('patterns','03','Understand the moving parts.','每个表达都配完整例句。遇到相近说法，先想清楚你要确认哪一件事。','<div id="core-expressions"></div><h3 class="subheading">相近表达怎么选</h3><div id="choice-context"></div><h3 class="subheading" id="grammar-depth">按需深入：3 组用法讲解</h3><div id="grammar"></div>'),
 essentials:chapter('essentials','04','A small working vocabulary.','主线只放 10 个词块，保留音标、词语与例句朗读。想练哪个再收藏哪个。','<div id="essential-words"></div>'),
 practice:chapter('practice','05','Your turn.','三个任务可以写，也可以先口头回答，做完再往下对照。','<div id="tasks"></div><div class="answer-divider"><h3>先完成，再对照参考表达。</h3></div><div id="answers"></div>'),
 transfer:chapter('transfer','06','New place. Same skills.','换一个地点或一组条件，自己组织表达。','<div id="transfer-task"></div><div class="answer-divider"><h3>先试着说，再看参考。</h3></div><div id="transfer-answer"></div>'),
 lexicon:chapter('lexicon','08','Look it up when needed.',`另有 ${d.words.length-10} 个扩展词留作查阅，不要求一次背完。`,'<span id="word-count" class="small"></span><label class="search-label" for="word-search">查找扩展词</label><input id="word-search" type="search" placeholder="输入中文或英文" autocomplete="off"><details id="reference-vocabulary" class="reference-fold"><summary>展开扩展词库</summary><div id="words"></div></details><p id="no-words" hidden>没有找到匹配词语。</p>')};
 for(const [id,html]of Object.entries(pieces))h=h.replace(new RegExp('<section id="'+id+'" class="chapter">[\\s\\S]*?</section>'),html);
 // The section matcher above is intentionally simple: template sections contain no nested section elements.
 h=h.replace('含 1 个新菜单迁移任务','含 1 个迁移任务').replace('核心表达会换到咖啡店情境，不只是再看原句。','核心表达会换一个地点或条件再用，不只是再看原句。');
 h=h.replace(/<footer>[\s\S]*?<\/footer>/,`<footer><b>TABLE TALK / ${esc(d.title)}</b><p>例句、行程和服务情境均为自编练习。不同地区、店家和运营方的实际安排需现场确认。</p><a href="index.html">回到全部场景 →</a><p class="creator-credit">Created by <a href="https://github.com/henrymeihao" target="_blank" rel="noopener noreferrer">henrymeihao</a> · TABLE TALK</p></footer>`);
 return h;
}
function home(){
 let h=fs.readFileSync(path.join(root,'index.html'),'utf8');
 h=h.replace(/\d+ 个(?:生活|旅游)主题/,(lessons.length+2)+' 个旅游主题');
 const old=[...h.matchAll(/<a class="topic-card[^"\n]*"[^>]*>[\s\S]*?<\/a>/g)].map(m=>m[0]);
 const groups=['吃喝','住宿','交通','游玩购物','活动'];
 const slug=['food','stay','transport','visits','activities'];
 const catalog=groups.map((group,i)=>{
  const list=lessons.filter(d=>d.group===group);
  const cards=(i===0?old.join(''):'')+list.map(d=>`<a class="topic-card" href="${d.id}.html"><span class="eyebrow">SHORT TRIP / ${d.id.toUpperCase()}</span><h2>${esc(d.en)}</h2><h3>${esc(d.title)}</h3><p>${esc(d.intro)}</p><div class="meta"><span>6 组接话</span><span>10 个必要词块 + ${d.words.length-10} 个扩展词</span><span>4 个任务</span></div><strong>进入主题 →</strong></a>`).join('');
  return `<section class="topic-section" id="topics-${slug[i]}"><h2 class="topic-group-title">${group}<span>${list.length+(i===0?2:0)} 个主题</span></h2><div class="topic-grid">${cards}</div></section>`;
 }).join('');
 const tools=`<div class="catalog-tools"><label for="topic-search">找一个场景</label><input id="topic-search" type="search" placeholder="试试：机场、脚蹼、滑雪、咖啡" autocomplete="off"><p id="topic-search-status" class="small" role="status"></p><nav class="topic-filters" aria-label="主题分类">${groups.map((g,i)=>`<a href="#topics-${slug[i]}">${g}</a>`).join('')}</nav></div>`;
 h=h.replace(/<div class="topic-grid">[\s\S]*?<\/div><div class="home-method">/,tools+catalog+'<div class="home-method">');
 h=h.replace('从餐厅到咖啡店，把已经学过的表达再用一次。','从点单到出行与活动，把已经学过的表达再用一次。');
 return h;
}
module.exports={lessons,page,home};
