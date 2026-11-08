const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..'),dist=path.join(root,'dist');
fs.mkdirSync(dist,{recursive:true});
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const travel=require('./travel-pages.cjs');
const pages={'index.html':travel.home(),'restaurant.html':fs.readFileSync(path.join(root,'restaurant.html'),'utf8'),'cafe.html':fs.readFileSync(path.join(root,'cafe.html'),'utf8')};
for(const d of travel.lessons)pages[d.id+'.html']=travel.page(d);
for(const [page,source]of Object.entries(pages)){
 let html=source;
 html=html.replace('<link rel="stylesheet" href="style.css">','<style>'+css+'</style>');
 const scripts=[...html.matchAll(/<script src="([^"]+)" defer><\/script>/g)].map(m=>m[1]);
 const js=scripts.map(name=>fs.readFileSync(path.join(root,name),'utf8')).join('\n;\n');
 if(/<\/script/i.test(js))throw Error('Unsafe inline closing tag');
 html=html.replace(/<script src="[^"]+" defer><\/script>/g,'');
 if(js)html=html.replace('</body>','<script>'+js+'</script></body>');
 fs.writeFileSync(path.join(dist,page),html);
}
fs.copyFileSync(path.join(dist,'restaurant.html'),path.join(dist,'table-talk.html'));
console.log('Built home and '+(travel.lessons.length+2)+' travel topics in dist/.');
