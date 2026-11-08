(()=>{
 const ids=[...document.querySelectorAll('.topic-card')].map(card=>card.getAttribute('href').replace('.html','')).filter(id=>/^[a-z][a-z0-9-]*$/.test(id));
 const keyFor=id=>id==='restaurant'?'table-talk-v2':id==='cafe'?'table-talk-cafe-v1':'table-talk-'+id+'-v1';
 const keys=ids.map(keyFor),labels={};
 for(const card of document.querySelectorAll('.topic-card')){const id=card.getAttribute('href').replace('.html','');labels[id]=card.querySelector('h3').textContent}
 const $=s=>document.querySelector(s),safeParse=s=>{try{return JSON.parse(s)}catch{return null}};
 const day=time=>{const d=new Date(time);return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-')};
 function read(){const data={};for(const key of keys){const value=safeParse(localStorage.getItem(key));if(value&&typeof value==='object'&&!Array.isArray(value))data[key]=value}return data}
 function render(){
  try{
   const data=read(),days=new Map(),recommend=[];
   for(const id of ids){const s=data[keyFor(id)]||{};const rated=Object.values(s.ratings||{}).filter(n=>[0,1,2].includes(n)).length;const due=Object.values(s.reviews||{}).filter(r=>r&&r.active!==false&&Number.isFinite(r.due)&&r.due<=Date.now()).length;
    const card=document.querySelector(`.topic-card[href="${id}.html"]`);let stat=card.querySelector('.topic-progress');if(!stat){stat=document.createElement('p');stat.className='topic-progress small';card.append(stat)}stat.textContent=`已自评 ${rated}/4 个任务 · ${due} 项到期`;
    if(due)recommend.push({id,due});
    for(const e of Array.isArray(s.history)?s.history:[]){if(!e||!Number.isFinite(e.at)||![0,1,2].includes(e.score))continue;const date=day(e.at);days.set(date,(days.get(date)||0)+1)}
   }
   const last=safeParse(localStorage.getItem('table-talk-last-visit'));
   const resume=$('#continue-learning');resume.replaceChildren();
   if(last&&ids.includes(last.topic)){
    const section=/^(top|scene|casual|patterns|essentials|practice|transfer|review|lexicon)$/.test(last.section)?last.section:'top';
    const a=document.createElement('a');a.href=last.topic+'.html#'+section;a.textContent='继续上次：'+labels[last.topic]+' →';resume.append(a);
   }else resume.textContent='选择一个场景开始，之后可从这里继续。';
   const history=$('#daily-progress');history.replaceChildren();
   for(const [date,count]of [...days].sort((a,b)=>b[0].localeCompare(a[0])).slice(0,7)){const row=document.createElement('p');row.className='small';row.textContent=date+' · 主动练习自评 '+count+' 次';history.append(row)}
   if(!history.childElementCount)history.textContent='练习记录会按日期累积，第二天进入不会自动清零。';
   const next=$('#next-practice');next.replaceChildren();
   for(const r of recommend.sort((a,b)=>b.due-a.due).slice(0,3)){const a=document.createElement('a');a.href=r.id+'.html#review';a.textContent=labels[r.id]+'：'+r.due+' 项到期 →';next.append(a)}
   if(!next.childElementCount)next.textContent='暂时没有到期内容，可以继续一个场景，或进入课程提前回忆。';
  }catch{$('#progress-message').textContent='当前浏览器无法读取本地记录，请检查浏览器存储设置。'}
 }
 $('#export-progress').addEventListener('click',()=>{
  try{const payload={format:'table-talk-progress',version:1,exportedAt:Date.now(),data:read(),lastVisit:safeParse(localStorage.getItem('table-talk-last-visit'))};const url=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='table-talk-progress-'+day(Date.now())+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);$('#progress-message').textContent='备份已下载到你的设备。文件包含练习回答，请自行保管。'}catch{$('#progress-message').textContent='备份未完成，请检查浏览器下载设置。'}
 });
 async function restoreText(text){
  try{
   if(text.length>5*1024*1024)throw Error('文件过大');
   const backup=JSON.parse(text);
   if(backup.format!=='table-talk-progress'||backup.version!==1||!backup.data||typeof backup.data!=='object')throw Error('不是有效的进度备份');
   const entries=Object.entries(backup.data).filter(([key,v])=>keys.includes(key)&&v&&typeof v==='object'&&!Array.isArray(v));
   if(!entries.length)throw Error('文件中没有可恢复的主题');
   if(!confirm('将用备份中的记录替换这 '+entries.length+' 个主题的当前记录，其他主题不变。建议先导出当前记录。继续恢复吗？'))return;
   const previous=entries.map(([key])=>[key,localStorage.getItem(key)]);
   try{for(const [key,value]of entries)localStorage.setItem(key,JSON.stringify(value))}catch(e){for(const [key,value]of previous){if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value)}throw e}
   if(backup.lastVisit&&ids.includes(backup.lastVisit.topic))localStorage.setItem('table-talk-last-visit',JSON.stringify(backup.lastVisit));
   $('#progress-message').textContent='已恢复进度；可以继续学习。';render();
  }catch(e){$('#progress-message').textContent='恢复未完成：'+e.message}
 }
 $('#import-progress').addEventListener('change',async event=>{
  const file=event.target.files[0];if(!file)return;
  try{if(file.size>5*1024*1024)throw Error('文件过大');await restoreText(await file.text())}
  catch{$('#progress-message').textContent='浏览器未能读取文件。可以用下方“粘贴备份内容”恢复。'}
  finally{event.target.value=''}
 });
 $('#restore-progress-text').addEventListener('click',()=>restoreText($('#backup-json').value));
 const search=document.querySelector('#topic-search');
 if(search)search.addEventListener('input',()=>{
  const query=search.value.trim().toLocaleLowerCase();let count=0;
  for(const card of document.querySelectorAll('.topic-card')){card.hidden=!card.textContent.toLocaleLowerCase().includes(query);if(!card.hidden)count++}
  for(const section of document.querySelectorAll('.topic-section'))section.hidden=![...section.querySelectorAll('.topic-card')].some(card=>!card.hidden);
  document.querySelector('#topic-search-status').textContent=query?'找到 '+count+' 个主题':'';
 });
 window.addEventListener('pageshow',render);document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});render();
})();
