const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),Store=require(path.join(root,'learning-store.js'));
const {lessons,page,home}=require('../scripts/travel-pages.cjs');
const keys=new Set(['table-talk-v2','table-talk-cafe-v1']);
assert.equal(lessons.length,8);assert.equal((home().match(/class="topic-card/g)||[]).length,10);
for(const d of lessons){
 const ctx=vm.createContext({lessonDefinition:d});vm.runInContext(fs.readFileSync(path.join(root,'travel-adapter.js'),'utf8'),ctx);
 const x=vm.runInContext('({topic,words,essentialWords,referenceWords,allTasks,coreExpressions,grammar,everydayExchanges})',ctx);
 assert(!keys.has(x.topic.storageKey));keys.add(x.topic.storageKey);
 assert.equal(x.essentialWords.length,10);assert.equal(x.referenceWords.length,2);
 assert.equal(x.grammar.length,3);assert.equal(x.everydayExchanges.length,6);assert.equal(x.allTasks.length,4);
 assert(x.words.every(w=>w.ipa&&w.example&&w.meaning));assert.equal(new Set(x.words.map(w=>w.id)).size,12);
 assert(x.coreExpressions.every(e=>e.cue&&e.answer&&x.topic.coreAudioExamples[e.id]));
 const state=Store.normalise(null,x.words,x.allTasks,x.coreExpressions,1000);state.drafts.understand=d.id+' answer';state.saved=[x.words[0].id];Store.rate(state,'task:understand',1,1000);
 const saved=Store.normalise(JSON.parse(JSON.stringify(state)),x.words,x.allTasks,x.coreExpressions,2000);
 assert.equal(saved.drafts.understand,d.id+' answer');assert.equal(saved.reviews['task:understand'].due,86401000);
 const h=page(d);assert(h.includes('travel-adapter.js'));assert(!h.includes('THE LITTLE TABLE'));
 const built=fs.readFileSync(path.join(root,'dist',d.id+'.html'),'utf8');
 assert(!built.includes('<script src='));new vm.Script([...built.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n;\n'));
}
console.log('PASS: 8 new lessons, 10 unique storage keys, all course sections, save/reload and built script parsing.');
