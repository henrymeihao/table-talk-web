// A small branching rehearsal. No network, automatic grading or generated replies.
const CafePlay = (() => {
 const turn=(en,zh,cue,answer,terms,note)=>({en,zh,cue,answer,terms,note});
 const scenarios=[
  {id:'taste',tag:'TRY SOMETHING NEW',title:'今天不点老样子',desc:'描述自己的口味，请店员帮你选一杯。',opening:turn('What kind of coffee do you usually like?','你平时喜欢什么样的咖啡？','说说你喜欢的口味，再请对方推荐。','I like something smooth, not too bitter. What would you recommend?',['smooth · 顺滑的','bitter · 苦的','What would you recommend? · 你推荐什么？'],'something + 形容词可以描述想要的东西，不必先知道饮品名字。not too bitter 比直接说 not bitter 更留有余地。'),routes:[
   {id:'flavour',label:'继续问风味',desc:'想知道它喝起来是什么感觉。',turns:[turn('You might like our flat white. It’s smooth and quite strong.','你可能会喜欢我们的馥芮白，顺滑，咖啡味也比较浓。','问它和拿铁有什么区别。','How is it different from a latte?',['How is it different from…? · 和……有什么不同？','strong · 这里指咖啡味浓'],'strong 不一定等于苦，也不能直接判断咖啡因含量。可以追问具体的风味。'),turn('It has less milk, so the coffee flavour comes through more. Would you like to try it?','奶更少，所以咖啡味更明显。想试试吗？','决定试一杯，并补充一个自己的偏好。','I’ll try a small one, please. Could I have it with oat milk?',['I’ll try… · 我试试……','with oat milk · 用燕麦奶'],'先回应推荐，再补充偏好即可，不必把所有要求塞进第一句话。')]},
   {id:'local',label:'问当地人常点什么',desc:'从推荐继续聊这家店。',turns:[turn('Our regulars often go for the house blend.','我们的常客经常选店里的拼配。','问店员自己会选什么。','What would you go for?',['regulars · 常客','house blend · 店里的拼配','go for · 选'],'What would you go for? 比重复问 best 更像在征求对方个人意见。'),turn('Personally, I’d have it as a long black. Do you drink black coffee?','我自己会喝 long black。你喝黑咖啡吗？','按自己的习惯回答，再决定是否尝试。','Not usually, but I’d like to give it a try. A small one, please.',['not usually · 平时不太会','give it a try · 试一试'],'Not usually 可以诚实说明习惯，同时用 but 接住对方的推荐。')]}
  ]},
  {id:'menu',tag:'FOLLOW YOUR CURIOSITY',title:'这个名字是什么意思？',desc:'不认识菜单上的东西，就从好奇开始聊。',opening:turn('Have you decided, or would you like a hand with the menu?','决定好了吗，还是需要帮忙看菜单？','指着 flat white，问问它是什么。','Could you tell me what a flat white is?',['a hand · 帮忙','Could you tell me what … is? · 能说说……是什么吗？'],'Could you tell me 后是陈述语序 what a flat white is，不是 what is a flat white。'),routes:[
   {id:'name',label:'追问名字',desc:'它为什么叫 flat white？',turns:[turn('It’s an espresso drink with steamed milk and a thin layer of foam.','它是浓缩咖啡加蒸汽加热的奶，表面有一层薄奶泡。','问名字是不是和奶泡有关。','Does the name have something to do with the foam?',['steamed milk · 蒸汽加热的奶','foam · 奶泡','have something to do with · 与……有关'],'先接住对方提到的 foam，再追问名字，交流会比突然换话题更连贯。'),turn('Yes, “flat” refers to the thinner layer of foam. Have you tried one before?','对，flat 指的是比较薄的奶泡。你以前喝过吗？','说自己没喝过，再表示想试试。','No, this would be my first. I’d love to try one.',['my first · 我的第一次','I’d love to… · 我很想……'],'this would be my first 接住尚未发生的体验。也可以简单说 I haven’t tried one before。')]},
   {id:'compare',label:'问能不能调整',desc:'知道是什么后，再看看适不适合自己。',turns:[turn('It’s usually served hot. The coffee flavour is stronger than in a latte.','它一般是热饮，咖啡味比拿铁更明显。','你想喝冰的，问有没有相近的选择。','Is there something similar that I could have iced?',['similar · 相近的','have it iced · 做成冰的'],'Is there something similar…? 能在店里无法原样调整时，主动寻找替代选择。'),turn('An iced latte would be the closest option. We can make it with an extra shot.','最接近的是冰拿铁，可以多加一份浓缩。','选冰拿铁，但不额外加浓缩。','An iced latte sounds good. Just the regular amount of coffee, please.',['an extra shot · 额外一份浓缩','sounds good · 听起来不错'],'regular amount 把“按正常配方”说清楚，避免把 regular 误解成杯型。')]}
  ]},
  {id:'nearby',tag:'ASK SOMEONE LOCAL',title:'从一杯咖啡聊到附近',desc:'问一个当地人会去的地方，再接着追问。',opening:turn('Here’s your coffee. Are you visiting?','你的咖啡好了。你是来旅游的吗？','说自己来玩，想找附近值得逛的地方。','Yes, I’m visiting. Is there anywhere nearby you’d recommend?',['I’m visiting · 我来这里旅游','anywhere nearby · 附近有什么地方'],'nearby 把范围缩小，对方更容易给出具体建议。对方忙时，问一个简短问题即可。'),routes:[
   {id:'quiet',label:'想找安静的地方',desc:'散步、坐一会儿，不赶景点。',turns:[turn('There’s a riverside walk and a market. What are you in the mood for?','有河边步道和市集。你现在比较想做什么？','描述自己想慢慢走走，避开人群。','Somewhere quiet, ideally. I just feel like a walk.',['in the mood for · 现在想做……','ideally · 最好是','feel like a walk · 想散散步'],'Somewhere quiet 是自然的简短回答；不一定每次都要组织完整长句。'),turn('Try the path behind the library. It’s usually quieter.','可以试试图书馆后面的步道，通常比较安静。','问怎么走，并自然结束交流。','That sounds lovely. How do I get there from here? Thanks for the tip.',['How do I get there…? · 怎么去那里？','Thanks for the tip. · 谢谢你的建议'],'tip 在这里是建议，不是小费。问完路线后致谢，不必为了练口语强行延长聊天。')]},
   {id:'food',label:'想找本地人爱吃的',desc:'问吃的，也问对方自己的选择。',turns:[turn('The market is great for food. Are you after anything in particular?','市集很适合找吃的。你有特别想找的吗？','说想尝本地特色，请对方选一个推荐。','I’d like to try something local. What’s one thing I shouldn’t miss?',['be after · 想找、想要','something local · 本地特色','shouldn’t miss · 不该错过'],'问 one thing 比让对方列一串推荐更容易回答，也更适合短暂交流。'),turn('I’d try the savoury pies at the stall by the entrance.','我会试试入口旁那个摊位的咸派。','没听清位置，再确认一次。','Just to check, is that the stall right by the entrance?',['savoury · 咸味的','stall · 摊位','right by · 就在旁边'],'Just to check 把重复询问变成确认信息，right by 强调距离很近。')]}
  ]},
  {id:'stuck',tag:'KEEP THE CONVERSATION GOING',title:'没听懂，也能接下去',desc:'遇到快语速和陌生说法，练习让对方换种说法。',opening:turn('Would you like room for milk?','你想留点空间加奶吗？','你没听懂 room 的意思，请对方解释。','Sorry, what do you mean by “room for milk”?',['What do you mean by…? · ……是什么意思？','room · 这里指空间'],'room 在这里是不可数的“空间”，不是房间。直接指出不懂的词，比反复说 Sorry? 更明确。'),routes:[
   {id:'clarify',label:'确认自己理解对了',desc:'把听懂的意思复述一遍。',turns:[turn('I mean, should I leave some space at the top so you can add milk?','我是说，要在杯子上面留点空，让你自己加奶吗？','复述确认，再说不用加奶。','So you mean a little space at the top? No, thanks. I’ll have it black.',['So you mean…? · 所以你的意思是……？','have it black · 喝不加奶的咖啡'],'black 在咖啡语境里指不加奶，不代表已经说明了是否加糖。'),turn('Got it. Anything else for you?','明白了。还需要其他的吗？','表示就这些，再问在哪里取。','That’s everything, thanks. Where should I pick it up?',['That’s everything. · 就这些','pick it up · 取饮品'],'用一句回应结束点单，再问取餐地点，信息更清楚。')]},
   {id:'slow',label:'请对方慢一点',desc:'听懂意思以后，再处理新的追问。',turns:[turn('It just means leaving space for milk. For here or to go?','就是留点空间加奶。堂食还是外带？','请对方把最后的问题慢点说。','Could you say the last part a little more slowly, please?',['the last part · 最后那部分','a little more slowly · 再慢一点'],'指出 the last part，可以避免让对方把已经听懂的内容全部重说。'),turn('Of course. Are you having it here, or taking it away?','当然。你在这里喝，还是带走？','说自己在这里喝，并表示感谢。','For here, please. Thanks for slowing down.',['for here · 堂食','take it away · 外带','Thanks for… · 谢谢你……'],'For here 是足够自然的回答。Thanks for 后面接动名词 slowing，不用 to slow。')]}
  ]}
 ];
 const get=id=>scenarios.find(s=>s.id===id);
 const clean=s=>typeof s==='string'?s.slice(0,2000):'';
 function session(raw){
  if(!raw||!get(raw.scenario))return null;
  const s=get(raw.scenario),route=s.routes.find(r=>r.id===raw.route);
  const answers=[];
  for(const a of Array.isArray(raw.answers)?raw.answers.slice(0,3):[]){if(!a||(!clean(a.text).trim()&&a.mode!=='oral')||(answers.length&&!route))break;answers.push({text:a.mode==='oral'?'':clean(a.text),mode:a.mode==='oral'?'oral':'written',hinted:a.hinted===true})}
  return {id:clean(raw.id)||'restored',scenario:s.id,route:route?.id||null,answers,draft:clean(raw.draft),custom:clean(raw.custom),helped:raw.helped===true,variant:raw.variant===1?1:0,score:[0,1,2].includes(raw.score)&&answers.length===3?raw.score:null};
 }
 function normalise(raw){
  const source=raw&&typeof raw==='object'?raw:{};
  return {version:1,current:session(source.current),question:clean(source.question),runs:(Array.isArray(source.runs)?source.runs:[]).filter(r=>r&&get(r.scenario)&&[0,1,2].includes(r.score)&&Number.isFinite(r.at)&&r.at>=0&&Number.isFinite(r.due)&&r.due>=0).slice(-30).map(r=>({id:clean(r.id),scenario:r.scenario,score:r.score,at:r.at,due:r.due,custom:clean(r.custom)}))};
 }
 function start(id,question='',variant=0,now=Date.now()){
  if(!get(id))throw Error('Unknown scenario');
  return {id:now+'-'+id,scenario:id,route:null,answers:[],draft:'',custom:clean(question),helped:false,variant:variant===1?1:0,score:null};
 }
 const alternateOpenings={taste:['What sort of coffee are you in the mood for?','你现在想喝什么样的咖啡？'],menu:['Anything on the menu you’d like to know more about?','菜单上有什么你想多了解的吗？'],nearby:['Enjoy your coffee! Is this your first time in the area?','慢慢享用！你是第一次来这附近吗？'],stuck:['Shall I leave a little room for milk?','要不要留一点空间加奶？']};
 function currentTurn(s){const d=get(s.scenario);if(s.answers.length===0){const alt=alternateOpenings[s.scenario];return s.variant?{...d.opening,en:alt[0],zh:alt[1]}:d.opening}return s.route?d.routes.find(r=>r.id===s.route)?.turns[s.answers.length-1]:null}
 function submit(s,text,mode='written'){if(!currentTurn(s)||s.answers.length>=3||(!clean(text).trim()&&mode!=='oral'))return false;s.answers.push({text:mode==='oral'?'':clean(text).trim(),mode:mode==='oral'?'oral':'written',hinted:s.helped});s.draft='';s.helped=false;return true}
 function choose(s,id){if(s.answers.length!==1||s.route||!get(s.scenario).routes.some(r=>r.id===id))return false;s.route=id;return true}
 function rate(progress,score,now=Date.now()){
  const s=progress.current;if(!s||s.answers.length!==3||![0,1,2].includes(score))return false;
  s.score=score;const row={id:s.id,scenario:s.scenario,score,at:now,due:now+[600000,86400000,259200000][score],custom:s.custom};
  progress.runs=progress.runs.filter(r=>r.id!==s.id);progress.runs.push(row);progress.runs=progress.runs.slice(-30);return true;
 }
 return {scenarios,get,normalise,start,currentTurn,submit,choose,rate};
})();
if(typeof module!=='undefined')module.exports=CafePlay;
