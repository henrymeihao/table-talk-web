const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const path=require('node:path');
const events={},status={textContent:''},stop={disabled:true},slow={checked:false};
let calls=[],cancelled=0;
function button(dataset){return {dataset,attributes:{},classList:{add(){},remove(){}},setAttribute(k,v){this.attributes[k]=v}}}
const sentence=button({speech:'Could we have another minute, please?'});
const word=button({say:'w-side',kind:'word'});
const example=button({say:'w-side',kind:'example'});
const context=vm.createContext({
 words:[{id:'w-side',text:'side',example:'Does it come with a side?',ipa:'saɪd'}],
 esc:s=>s.replace(/&/g,'&amp;').replace(/"/g,'&quot;'),
 setTimeout:()=>1,clearTimeout(){},SpeechSynthesisUtterance:function(text){this.text=text},
 document:{querySelector:s=>({'#speech-status':status,'#speech-stop':stop,'#speech-slow':slow}[s]),querySelectorAll:()=>[sentence,word,example],addEventListener:(name,fn)=>events[name]=fn},
 window:{SpeechSynthesisUtterance:true,speechSynthesis:{getVoices:()=>[{lang:'en-US',name:'Test voice',localService:true}],addEventListener(){},speak:u=>calls.push(u),cancel:()=>cancelled++},addEventListener(){}}
});
vm.runInContext(fs.readFileSync(path.join(__dirname,'../pronunciation.js'),'utf8'),context);
vm.runInContext('setupPronunciation()',context);
function click(b){events.click({target:{closest:s=>s==='#speech-stop'?(b===stop?stop:null):b}})}
click(sentence);assert.equal(calls.at(-1).text,sentence.dataset.speech);assert.equal(calls.at(-1).rate,.92);
assert.equal(sentence.attributes['aria-pressed'],'true');assert.equal(stop.disabled,false);
const stale=calls.at(-1);
slow.checked=true;click(word);assert.equal(calls.at(-1).text,'side');assert.equal(calls.at(-1).rate,.72);assert.equal(sentence.attributes['aria-pressed'],'false');
stale.onend();assert.equal(word.attributes['aria-pressed'],'true');
click(word);assert.equal(word.attributes['aria-pressed'],'false');assert.equal(stop.disabled,true);
click(example);assert.equal(calls.at(-1).text,'Does it come with a side?');
click(stop);assert.equal(stop.disabled,true);assert(cancelled>=3);
assert(vm.runInContext('sentenceAudioMarkup(\'<mark>Hello</mark> "there"\')',context).includes('data-speech="Hello &quot;there&quot;"'));
console.log('PASS: sentence, word and example text; slow speed; switching; repeat-to-stop; stale event isolation; stop control; safe markup.');
