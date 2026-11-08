function sentenceAudioMarkup(text,label='听句子'){
 const plain=text.replace(/<[^>]*>/g,'').trim();
 const disabled=!(window.speechSynthesis&&window.SpeechSynthesisUtterance)?' disabled':'';
 return `<button class="say sentence-audio" data-speech="${esc(plain)}" aria-label="${label}：${esc(plain)}" aria-pressed="false"${disabled}><span aria-hidden="true">▶</span> ${label}</button>`;
}
function wordAudioMarkup(word){const ipa=word.ipa.startsWith('UK ')?`UK /${word.ipa.slice(3)}/`:`/${word.ipa}/`;const disabled=!(window.speechSynthesis&&window.SpeechSynthesisUtterance)?' disabled':'';return `<span class="ipa" lang="en">${ipa}</span><div class="word-audio"><button class="say" data-say="${word.id}" data-kind="word" aria-label="朗读词语：${word.text}" aria-pressed="false"${disabled}><span aria-hidden="true">▶</span> 词语</button><button class="say" data-say="${word.id}" data-kind="example" aria-label="朗读例句：${word.text}" aria-pressed="false"${disabled}><span aria-hidden="true">▶</span> 例句</button></div><a class="dictionary-link" href="https://dictionary.cambridge.org/pronunciation/english/${word.dictionary}" target="_blank" rel="noopener noreferrer">词典读音 ↗</a>`}
let speechCurrent=null;
function setupPronunciation(){
 const status=document.querySelector('#speech-status');
 const synth=window.speechSynthesis;
 const supported=!!(synth&&window.SpeechSynthesisUtterance);
 const controls=[...document.querySelectorAll('[data-say],[data-speech]')];
 const stop=document.querySelector('#speech-stop');
 const setStatus=text=>status.textContent=text;
 function reset(current){if(speechCurrent!==current)return;clearTimeout(current.timer);current.button.setAttribute('aria-pressed','false');current.button.classList.remove('speaking');speechCurrent=null;stop.disabled=true}
 function chooseVoice(lang='en-US'){const voices=synth.getVoices();return voices.find(v=>v.lang.toLowerCase()===lang.toLowerCase()&&v.localService)||voices.find(v=>v.lang.toLowerCase()===lang.toLowerCase())||voices.find(v=>/^en([-_]|$)/i.test(v.lang))}
 if(!supported){controls.forEach(b=>{b.disabled=true;b.title='此浏览器未提供语音朗读'});setStatus('此浏览器不支持朗读。音标仍可查看，也可以打开下方词典发音链接。');return}
 synth.getVoices();
 synth.addEventListener('voiceschanged',()=>{if(!speechCurrent){const voice=chooseVoice();if(voice)setStatus(`已就绪 · ${voice.name}（${voice.lang}）`)}});
 document.addEventListener('click',event=>{
  if(event.target.closest('#speech-stop')){if(speechCurrent)reset(speechCurrent);synth.cancel();setStatus('已停止朗读。');return}
  const button=event.target.closest('[data-say],[data-speech]');if(!button)return;
  const previous=speechCurrent;
  if(previous){reset(previous);synth.cancel();if(previous.button===button){setStatus('已停止。点击朗读按钮可以重新听。');return}}
  const entry=words.find(w=>w.id===button.dataset.say);
  const text=button.dataset.speech||(entry&&(button.dataset.kind==='example'?entry.example:entry.text));
  if(!text)return;
  const title=entry?entry.text:'英语句子';
  const utterance=new SpeechSynthesisUtterance(text);const preferred=entry?.ipa.startsWith('UK')&&button.dataset.kind==='word'?'en-GB':'en-US';const voice=chooseVoice(preferred);
  if(voice)utterance.voice=voice;
  utterance.lang=voice?voice.lang:preferred;
  utterance.rate=document.querySelector('#speech-slow').checked ? .72 : .92;
  const current={button,utterance,timer:null};speechCurrent=current;stop.disabled=false;
  button.setAttribute('aria-pressed','true');button.classList.add('speaking');
  setStatus(`准备朗读：${title}。再次点击可停止。`);
  utterance.onstart=()=>{if(speechCurrent!==current)return;clearTimeout(current.timer);setStatus(`正在朗读${button.dataset.speech?'句子':button.dataset.kind==='word'?'词语':'例句'}：${title}${voice?' · '+voice.lang:''}。再次点击可停止。`)};
  utterance.onend=()=>{if(speechCurrent!==current)return;reset(current);setStatus('朗读结束，可以重听或继续下一句。')};
  utterance.onerror=event=>{if(speechCurrent!==current)return;reset(current);setStatus(['interrupted','canceled'].includes(event.error)?'已停止朗读。':'暂时无法播放。请检查设备英语语音、音量或网络，也可以查看词典发音。')};
  current.timer=setTimeout(()=>{if(speechCurrent!==current)return;reset(current);synth.cancel();setStatus('语音未能启动。可以再试一次，或打开词典发音。')},12000);
  try{synth.speak(utterance)}catch{reset(current);setStatus('当前无法启动朗读。音标与词典发音仍可使用。')}
 });
 window.addEventListener('pagehide',()=>{if(speechCurrent)reset(speechCurrent);synth.cancel()});
}
