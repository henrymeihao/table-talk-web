const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const Store=require(path.join(root,'learning-store.js'));
function lesson(files){const ctx=vm.createContext({});for(const file of files)vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);return vm.runInContext('({topic,words,essentialWords,referenceWords,allTasks,coreExpressions,dialogue,everydayExchanges,grammar,taskExpressionMap})',ctx)}
const restaurant=lesson(['restaurant-config.js','lesson.js','lexicon.js']),cafe=lesson(['cafe.js']);
assert.notEqual(restaurant.topic.storageKey,cafe.topic.storageKey);
assert.equal(restaurant.topic.storageKey,'table-talk-v2');
for(const data of [restaurant,cafe]){
 assert.equal(data.allTasks.length,4);assert.equal(data.coreExpressions.length,6);
 assert(data.essentialWords.every(Boolean));
 assert.equal(new Set(data.words.map(w=>w.id)).size,data.words.length);
 assert.equal(data.essentialWords.length+data.referenceWords.length,data.words.length);
 assert(data.coreExpressions.every(e=>data.topic.coreAudioExamples[e.id]));
 const state=Store.normalise(null,data.words,data.allTasks,data.coreExpressions,1000);
 assert.equal(Object.keys(state.reviews).length,0,'Words are not automatically enrolled');
 state.drafts.understand=data.topic.id+' answer';state.saved.push(data.essentialWords[0].id);
 Store.rate(state,'task:understand',1,1000);
 const again=Store.normalise(JSON.parse(JSON.stringify(state)),data.words,data.allTasks,data.coreExpressions,2000);
 assert.equal(again.drafts.understand,data.topic.id+' answer');
 assert.equal(again.reviews['task:understand'].due,86401000);
 assert(again.saved.includes(data.essentialWords[0].id));
}
assert.equal(cafe.essentialWords.length,12);assert.equal(cafe.referenceWords.length,10);
assert.equal(cafe.dialogue.length,14);assert.equal(cafe.everydayExchanges.length,6);assert.equal(cafe.grammar.length,5);
assert(cafe.allTasks.some(t=>t.id==='transfer-tea'));
console.log('PASS: independent topic storage, no automatic word enrollment, real-catalog save/reload, coffee transfer content and complete pronunciation examples.');
