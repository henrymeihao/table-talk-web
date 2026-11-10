const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const Play=require('../cafe-play.js');
for(const scenario of Play.scenarios){
 for(const route of scenario.routes){
  const progress=Play.normalise(null);progress.current=Play.start(scenario.id,'我自己的问题',0,1000);
  const s=progress.current;
  assert.equal(Play.submit(s,'   '),false);assert.equal(s.answers.length,0);
  assert.equal(Play.choose(s,route.id),false);
  s.helped=true;assert(Play.submit(s,'A question of my own.'));assert(s.answers[0].hinted);
  assert.equal(Play.currentTurn(s),null,'A branch must be chosen before the next reply');
  assert.equal(Play.submit(s,'skip branch'),false);assert(Play.choose(s,route.id));
  assert.equal(Play.currentTurn(s).en,route.turns[0].en);
  s.draft='<img src=x onerror=alert(1)>';const restored=Play.normalise(JSON.parse(JSON.stringify(progress)));
  assert.equal(restored.current.draft,s.draft);assert.equal(restored.current.custom,'我自己的问题');
  assert(Play.submit(s,'My second answer.'));assert(Play.submit(s,'My final answer.'));
  assert.equal(Play.submit(s,'extra'),false);assert(Play.rate(progress,1,2000));assert.equal(progress.runs[0].due,86402000);
  assert(Play.rate(progress,2,3000));assert.equal(progress.runs.length,1,'Changing a rating updates the same session');assert.equal(progress.runs[0].due,259203000);
  assert.equal(Play.rate(progress,4),false);
  const replay=Play.start(scenario.id,'',1,4000);assert.notEqual(Play.currentTurn(replay).en,scenario.opening.en);
 }
}
const corrupted=Play.normalise({current:{scenario:'missing'},runs:[null,{scenario:'taste',score:7,at:0,due:0}],question:42});
const oral=Play.normalise(null);oral.current=Play.start('taste');
assert(Play.submit(oral.current,'','oral'),'An oral turn needs no typed answer');
assert.equal(oral.current.answers[0].text,'','Do not invent a transcript');
assert(Play.choose(oral.current,'local'));assert(Play.submit(oral.current,'','oral'));
const oralRestored=Play.normalise(JSON.parse(JSON.stringify(oral)));
assert.equal(oralRestored.current.answers.length,2);assert.equal(oralRestored.current.answers[0].mode,'oral');
assert(Play.submit(oralRestored.current,'','oral'));assert(Play.rate(oralRestored,1));
assert.equal(corrupted.current,null);assert.equal(corrupted.runs.length,0);assert.equal(corrupted.question,'');
const ctx=vm.createContext({});for(const file of ['cafe-play.js','cafe.js','learning-store.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),ctx);
const preserved=vm.runInContext(`LearningStore.normalise({drafts:{understand:'old answer'},saved:[],ratings:{understand:2},cafePlay:{current:{scenario:'taste',route:null,answers:[],draft:'unfinished',custom:'my question'}}},words,allTasks,coreExpressions)`,ctx);
assert.equal(preserved.drafts.understand,'old answer');assert.equal(preserved.ratings.understand,2);assert.equal(preserved.cafePlay.current.draft,'unfinished');
const built=fs.readFileSync(path.join(__dirname,'../dist/cafe.html'),'utf8');assert(built.includes('id="cafe-play"'));assert(built.includes('id="cafe-reference"'));assert(!built.includes('href="cafe-play.css"'));
new vm.Script([...built.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n;\n'));
console.log('PASS: all 8 cafe branches, own answers, draft restoration, rating deduplication, invalid data, legacy progress and built JS.');
