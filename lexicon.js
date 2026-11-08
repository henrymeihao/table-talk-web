// Each row is one independently pronounceable, savable and reviewable meaning.
// Final field preserves the legacy grouped bookmark's source ID for migration.
const lexiconGroups=[
{name:'食材与菜品',note:'遇到能认出 · 不要求一次背完',rows:[
['sea bass','海鲈鱼','Is the sea bass grilled?','鱼类 bass 读 /bæs/，低音 bass 读 /beɪs/。','siː bæs','0-0'],
['lamb shank','羊小腿','How is the lamb shank cooked?','shank 指腿的下段；不要和整条 leg of lamb 混同。','læm ʃæŋk','0-1'],
['scallops','扇贝（肉）','I’d like the seared scallops.','单数 scallop；菜单上常用复数。与 mussels 比较辨认。','ˈskɑːləps','0-2'],
['mussels','贻贝','Are the mussels served in a sauce?','单数 mussel；不是 oysters（牡蛎）。','ˈmʌsəlz','0-3'],
['oysters','牡蛎；生蚝','Are the oysters served raw?','raw 是生的；oysters 本身不说明生吃还是熟食。','ˈɔɪstərz','0-3'],
['chickpeas','鹰嘴豆','Does the salad contain chickpeas?','常见于沙拉和炖菜；不是鸡肉。','ˈtʃɪkpiːz','0-4'],
['lentils','扁豆','Is the lentil soup made with vegetable stock?','作名词修饰 soup 时通常用单数 lentil。','ˈlentəlz','0-4'],
['aubergine','茄子（英式词）','I’d like the roasted aubergine.','与美式 eggplant 指同一种常见蔬菜；此处音标标注英式读法。','UK ˈəʊbəʒiːn','0-5'],
['eggplant','茄子（美式词）','Is the eggplant roasted or fried?','与 aubergine 比较；名字带 egg，不表示含鸡蛋。','ˈeɡplænt','0-5'],
['fennel','茴香；此菜单指茴香球茎','Could I have the fish without the fennel?','fennel seeds 是茴香籽；bulb 是球茎。','ˈfenəl','0-6'],
['capers','腌渍刺山柑花蕾','Could you leave out the capers?','常带酸咸味；单数 caper。','ˈkeɪpərz','0-7'],
['risotto','意式烩饭','Is the mushroom risotto vegetarian?','菜名本身不能说明是否含肉高汤或乳制品。','rɪˈzɑːtoʊ','0-8'],
['gnocchi','意式小团子','What sauce comes with the gnocchi?','常用土豆等制作；注意开头的 /nj/。合成读音可与词典录音对照。','ˈnjɑːki','0-9']
]},
{name:'烹饪方式与口感',note:'遇到能认出 · 比较时各自有自己的词条',rows:[
['grilled','烤架或明火等烤制的','Is the fish grilled?','与 roasted 比较；都可译为“烤”，做法有别。','ɡrɪld','1-0'],
['roasted','烘烤、烤制的','Could I have roasted vegetables?','菜单常见 roasted vegetables；区别于 pan-seared。','ˈroʊstɪd','1-0'],
['pan-seared','平底锅高温煎出表面焦色的','Are the scallops pan-seared?','强调处理表面；不说明内部熟度。','ˌpæn ˈsɪrd','1-1'],
['braised','加少量液体、加盖慢炖的','The braised lamb is tender.','与 roasted 的干热烤制比较。','breɪzd','1-2'],
['poached','在热水等液体中轻煮的','I’d like poached eggs on toast.','poached eggs 常指水波蛋。','poʊtʃt','1-3'],
['battered','裹面糊的','Is the fish battered?','batter 是面糊；与 breaded 的面包屑区分。','ˈbætərd','1-4'],
['breaded','裹面包屑的','I’ll have the breaded chicken.','描述外层做法，不是“配面包”。','ˈbredɪd','1-4'],
['crispy','酥脆的','The skin is crispy.','常描述表层；与 crunchy 用法有重叠。','ˈkrɪspi','1-5'],
['crunchy','咬起来脆响的','I like crunchy vegetables.','可形容生脆蔬菜、坚果等。','ˈkrʌntʃi','1-5'],
['tender','嫩、容易咀嚼的','Is the lamb tender?','在这里是食物口感，不是性格温柔。','ˈtendər','1-6'],
['chewy','有嚼劲的','The bread is a little chewy.','可以是特点，也可能是抱怨难嚼；看语境。','ˈtʃuːi','1-6'],
['tangy','明显酸爽的','The dressing is tangy.','不是 spicy（辣的）。','ˈtæŋi','1-7'],
['rich','味道浓厚、油脂感足的','The sauce is quite rich.','此义不表示食物价格贵。','rɪtʃ','1-7'],
['bland','味道寡淡的','It’s a little bland. Could we have some salt?','常带负面评价；a little 可以缓和语气。','blænd','1-8'],
['greasy','油腻的','The fries are too greasy for me.','这里表达自己的口味感受。','ˈɡriːsi','1-8'],
['medium rare','牛排等三分熟、中心偏红的熟度','I’d like my steak medium rare, please.','常用在 How would you like your steak? 的回答里；熟度叫法与具体呈现会因餐厅而异。','ˌmiːdiəm ˈrer','new-medium-rare'],
['rare','牛排等偏生的熟度','I’d like my steak rare.','点牛排的熟度词；不要按日常“罕见”理解。','rer','1-9'],
['medium','牛排等中等熟度的','I’d like my steak medium, please.','medium-rare 介于 rare 与 medium 之间。','ˈmiːdiəm','1-9'],
['well-done','牛排等全熟的','I’d like it well-done.','在这里是熟度；不同于夸人做得好时的 Well done!','ˌwel ˈdʌn','1-9']
]},
{name:'配料、饮品与调整',note:'按需要学会用 · 提出请求时可直接替换关键词',rows:[
['side','随主菜搭配的一份配菜','Does it come with a side?','a side 是一份配菜；on the side 则表示另放，两个用法要分清。','saɪd','new-side'],
['stock','高汤；此处为汤底','Is it made with vegetable stock?','与 broth 日常用法有重叠，具体成分要追问。','stɑːk','2-0'],
['broth','汤；清汤','Could I have a bowl of chicken broth?','此处是食物义；名字本身不保证某种配方。','brɔːθ','2-0'],
['dairy','乳制品','Does the sauce contain dairy?','是类别名；dairy-free 不等于完全没有动物成分。','ˈderi','2-1'],
['cream','奶油；稀奶油','Could you leave out the cream?','这里是食品成分，不是护肤霜。','kriːm','2-1'],
['dressing','沙拉汁','Could I have the dressing on the side?','常与 salad 连用；另放时仍会提供。','ˈdresɪŋ','2-2'],
['gravy','常随肉类等供应的肉汁酱','Could I have extra gravy?','可配烤肉或土豆；与沙拉 dressing 区分。','ˈɡreɪvi','2-2'],
['a wedge','一角；楔形块','Could I have a wedge of lemon?','搭配 a wedge of…；与薄片 a slice 比较。','ə wedʒ','2-3'],
['a slice','一片','Could I have a slice of bread?','搭配 a slice of…；不是 a whole loaf（一整条）。','ə slaɪs','2-3'],
['still water','不含气的水','Still water for me, please.','此处 still 不表示“仍然”；与 sparkling water 比较。','stɪl ˈwɔːtər','2-4'],
['sparkling water','气泡水','Could we have sparkling water?','描述含气与否，不说明瓶装或收费。','ˈspɑːrklɪŋ ˈwɔːtər','2-4'],
['tap water','自来水','Do you serve tap water?','供水方式和收费依餐厅、地区而异。','tæp ˈwɔːtər','2-5'],
['bottled water','瓶装水','A bottle of still water, please.','bottled 指包装；可再确认 still 或 sparkling。','ˈbɑːtəld ˈwɔːtər','2-5'],
['decaf','脱咖啡因的咖啡等','Could I have a decaf coffee?','decaffeinated 的缩略形式。','ˈdiːkæf','2-6'],
['substitute','替换（动词）','Could I substitute vegetables for the potatoes?','substitute A for B：想要的 A 在前。','ˈsʌbstɪtuːt','2-7'],
['substitution','替换（名词）','Are substitutions possible?','提出具体要求后也可问是否收取额外费用。','ˌsʌbstɪˈtuːʃən','2-7'],
['portion','一份；份量','Is one portion enough for two?','a large portion 表示一份的量很大。','ˈpɔːrʃən','2-8'],
['serving','一次食用或供应的量','How many servings are in this dish?','常用于描述可供几人或几份。','ˈsɜːrvɪŋ','2-8'],
['extra charge','额外收费','Is there an extra charge for that?','extra 是额外的；free of charge 才是免费。','ˈekstrə tʃɑːrdʒ','2-9']
]},
{name:'菜单栏目与用餐收尾',note:'遇到能认出 · 地区用法写在对应词下',rows:[
['starter','前菜（常见英式词）','Could we share a starter?','与美式 appetizer 对照。','ˈstɑːrtər','3-0'],
['appetizer','开胃菜；前菜（常见美式词）','We’ll share an appetizer.','不是 entrée 在美式菜单里的通常含义。','ˈæpətaɪzər','3-0'],
['main course','主菜','I’d like the fish as my main course.','英式菜单也常简写 main。','ˌmeɪn ˈkɔːrs','3-1'],
['entrée','主菜（美式菜单义）','Which entrées come with a side?','英式正式用餐也可指主菜前的一道菜；此条学习美式主菜义。','ˈɑːntreɪ','3-1'],
['à la carte','单点；按菜点选','Can we order à la carte?','通常按菜计价，与 set menu 比较。','ˌɑː lə ˈkɑːrt','3-2'],
['set menu','规定组合与选择范围的套餐菜单','What’s included in the set menu?','通常有固定菜数和价格，未必完全不能选菜。','ˌset ˈmenjuː','3-2'],
['special','当日或特别供应的菜','What are today’s specials?','常用复数 specials；不自动表示打折。','ˈspeʃəl','3-3'],
['sold out','售罄','Sorry, the sea bass is sold out.','指卖完，不是还在准备中。','ˌsoʊld ˈaʊt','3-4'],
['available','仍有供应的','Is the sea bass still available?','可以用来确认菜品有没有。','əˈveɪləbəl','3-4'],
['leftovers','剩下的食物','Could I take the leftovers home?','常用复数；也可说 the rest。','ˈleftoʊvərz','3-5'],
['to-go box','外带餐盒（美式常用）','Could I get a to-go box?','说打包剩菜时可用；不是必须另下一份外卖订单。','tə ˈɡoʊ bɑːks','3-5'],
['bill','餐费账单（常见英式词）','Could we have the bill, please?','与美式 check 对照。','bɪl','3-6'],
['check','餐费账单（常见美式词）','Could we get the check, please?','此处不是“检查”的动词义。','tʃek','3-6'],
['service charge','服务费','Is a service charge included?','不等同于 tip；included 表示已计入。','ˈsɜːrvɪs tʃɑːrdʒ','3-7'],
['tip','小费','Is the tip included in the total?','收费规则依当地和餐厅而异，可以直接询问。','tɪp','3-7']
]}];
const wordId=text=>'w-'+text.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const words=lexiconGroups.flatMap((group,gi)=>group.rows.map(row=>({id:wordId(row[0]),text:row[0],meaning:row[1],example:row[2],note:row[3],ipa:row[4],legacy:row[5],group:gi,kind:gi===1?'adj. / 做法与口感':row[0]==='substitute'?'v.':row[0]==='available'?'adj.':'词语 / 词块',dictionary:row[0].replace(/^a /,'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ /g,'-')})));
const coreExpressions=[
{id:'order',en:'I’d like… / Could I have…?',zh:'点菜，并礼貌地提出请求',why:'I’d like… 陈述自己的选择；Could I have…? 把想得到的东西说成请求。',cue:'在咖啡店，你想要一杯不加糖的拿铁。',answer:'Could I have a latte without sugar, please?'},
{id:'ingredients',en:'Does it contain…? / Is it made with…?',zh:'问清成分和制作材料',why:'contain 直接问有没有某成分；made with 把问题放在制作时用了什么。',cue:'在咖啡店，你想问一种汤是否用了鸡高汤。',answer:'Is this soup made with chicken stock?'},
{id:'included',en:'Does it come with…?',zh:'确认随菜附带什么',why:'附带不等于包含在价格中。若关心收费，再问 Is that included in the price?',cue:'在咖啡店，你点了一份三明治，想确认是否配沙拉。',answer:'Does the sandwich come with a salad?'},
{id:'omit',en:'Could you leave out…?',zh:'请对方省去某个配料',why:'Could you…? 强调请对方做一个动作。换成 Could I have it without…? 也能表达想要的成品。',cue:'在咖啡店，你点三明治，想请对方不放芥末酱。',answer:'Could you leave out the mustard, please?'},
{id:'side',en:'Could I have… on the side?',zh:'把酱汁等分开放，自己控制用量',why:'另放仍然要；without 才是不带这份配料或酱汁。',cue:'在咖啡店，你要沙拉，但想把沙拉汁单独放。',answer:'Could I have the dressing on the side?'},
{id:'swap',en:'Could I have A instead of B?',zh:'用想要的东西替换原来的东西',why:'想要的 A 在前，原来的 B 在后。句子方向固定，换词就能迁移。',cue:'在咖啡店，你想把普通牛奶换成燕麦奶。',answer:'Could I have oat milk instead of regular milk?'}
];
const contextChoices=[
{title:'我想要什么，还是请你做什么？',a:'Could I have the salad without onions?',b:'Could you leave out the onions?',why:'两句都能表达不要洋葱。前一句以我想得到的菜为中心，后一句直接请求对方调整做法。不是一个“正确”、一个“错误”。',next:'如果配料已经拌好，两种请求都可能无法实现。接着问：Is there another salad without onions?'},
{title:'问附带的东西，还是问制作原料？',a:'Does the fish come with rice?',b:'Is the sauce made with cream?',why:'rice 是随菜上的配菜，cream 是做进酱汁的原料。问 come with 不能代替问 contain 或 made with。',next:'come with 也不总能回答“有没有包含在标价中”。关心价格时说：Is the rice included in the price?'},
{title:'完全不要，还是分开放？',a:'Could I have it without the dressing?',b:'Could I have the dressing on the side?',why:'前一句不需要沙拉汁，后一句仍要沙拉汁，只是放在另一个容器里。看自己的实际需求选。',next:'不想要洋葱，却说 onions on the side，对方可能会另端一份洋葱过来。'},
{title:'对方已经说明没有了，如何继续？',a:'Is the sea bass still available?',b:'What would you recommend instead?',why:'第一句是尚不确定时确认库存；已经听到 sold out，就用第二句寻找替代，而不是重复确认相同的问题。',next:'再补一句 I’d prefer something that isn’t spicy，能让推荐更贴合自己的需求。'}
];
const transferTask={id:'transfer-soup',name:'换一家店：一碗没有奶油的汤',goal:'你想点烤番茄汤，但不想要奶油。先问能否去掉；服务员告诉你，奶油已经混进汤里。请推荐另一款不含乳制品的汤，再确认烤甜椒汤是否合适；如果可以，就点小碗，并问是否配面包。',checks:'尝试去掉奶油；听到不能调整后寻找替代；确认新汤是否含乳制品；选择小碗；询问面包。',answer:'Could I have the roasted tomato soup without cream?\nI see. What would you recommend instead? I’d like a soup that doesn’t contain dairy.\nIs the roasted pepper soup dairy-free? If it is, I’ll have a small bowl, please. Does it come with bread?',why:'新菜单变了，但问原料、请求省去、寻找替代和确认配菜的功能没变。不要仅凭菜单没写奶制品，就认定一定没有；把确认说出来。',alternative:'不必使用 dairy-free：Does the roasted pepper soup contain any dairy? 也能问清楚。',refs:'choice-context'};
const allTasks=[...tasks,transferTask];
const taskExpressionMap={understand:['ingredients','included'],customise:['order','omit','side','swap'],resolve:['order'], 'transfer-soup':['ingredients','omit','included']};

const essentialTerms=['side','dressing','dairy','cream','still water','sparkling water','medium rare','sold out','extra charge','bill','check','service charge','tip','portion'];
const essentialWords=essentialTerms.map(text=>words.find(w=>w.text===text));
const referenceWords=words.filter(w=>!essentialTerms.includes(w.text));
