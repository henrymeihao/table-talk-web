const LearningStore=(()=>{
 const intervals=[10*60*1000,24*60*60*1000,3*24*60*60*1000];
 const validScore=n=>Number.isInteger(n)&&n>=0&&n<=2;
 const sections=['top','scene','casual','patterns','essentials','practice','transfer','review','lexicon'];
 function record(state,key,score,now=Date.now()){
  if(!validScore(score))throw new Error('Invalid history score');
  state.history.push({key,score,at:now});state.updatedAt=now;
 }
 function enroll(state,key,now=Date.now()){
  if(state.reviews[key])state.reviews[key].active=true;
  else state.reviews[key]={due:now,score:null,count:0,active:true,last:null};
 }
 function rate(state,key,score,now=Date.now()){
  if(!validScore(score))throw new Error('Invalid review score');
  const previous=state.reviews[key];
  state.reviews[key]={due:now+intervals[score],score,count:(previous?.count||0)+1,active:true,last:now};
 }
 function due(state,now=Date.now()){
  return Object.entries(state.reviews).filter(([,r])=>r.active&&r.due<=now).sort((a,b)=>a[1].due-b[1].due).map(([key])=>key);
 }
 function normalise(raw,words,tasks,expressions,now=Date.now()){
  const source=raw&&typeof raw==='object'?raw:{};
  const state={schema:4,drafts:{},ratings:{},saved:[],reviews:{},history:[],lastSection:'top',updatedAt:null};
  if(typeof CafePlay!=='undefined')state.cafePlay=CafePlay.normalise(source.cafePlay);
  const taskIds=new Set(tasks.map(t=>t.id));
  const validKeys=new Set([...words.map(w=>'word:'+w.id),...tasks.map(t=>'task:'+t.id),...expressions.map(e=>'expr:'+e.id)]);
  state.lastSection=sections.includes(source.lastSection)?source.lastSection:'top';
  state.updatedAt=Number.isFinite(source.updatedAt)?source.updatedAt:null;
  state.history=(Array.isArray(source.history)?source.history:[]).filter(e=>e&&validKeys.has(e.key)&&validScore(e.score)&&Number.isFinite(e.at)&&e.at>=0).map(e=>({key:e.key,score:e.score,at:e.at}));
  for(const [id,value]of Object.entries(source.drafts||{}))if(taskIds.has(id)&&typeof value==='string')state.drafts[id]=value;
  for(const [id,value]of Object.entries(source.ratings||{}))if(taskIds.has(id)&&validScore(value))state.ratings[id]=value;
  // A grouped bookmark represented both words. Preserve both when separating it.
  const saved=new Set(Array.isArray(source.saved)?source.saved:[]);
  state.saved=words.filter(w=>saved.has(w.id)||saved.has(w.legacy)).map(w=>w.id);
  for(const [key,r]of Object.entries(source.reviews||{})){
   if(!validKeys.has(key)||!r||!Number.isFinite(r.due)||r.due<0||!(r.score===null||validScore(r.score)))continue;
   state.reviews[key]={due:r.due,score:r.score,count:Number.isInteger(r.count)&&r.count>=0?r.count:0,active:r.active!==false,last:Number.isFinite(r.last)?r.last:null};
  }
  for(const id of state.saved)enroll(state,'word:'+id,now);
  for(const [id,score]of Object.entries(state.ratings))if(!state.reviews['task:'+id])rate(state,'task:'+id,score,now);
  return state;
 }
 return {intervals,normalise,enroll,rate,due,record,sections};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=LearningStore;
