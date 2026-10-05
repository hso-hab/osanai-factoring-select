const variants=[["desk","A","仕事道具の写真","仕事の空気感を、背景に。","パソコン・ノート・コーヒーを俯瞰で撮ったような写真。日常の仕事に近い、自然体の印象です。"],["nature","B","自然の風景","空と緑で、開放感を。","朝の光が差す丘と小道。人工物を使わず、余白と広がりでゆとりを感じる方向です。"],["glass","C","ガラスの3Dアート","透明感と、洗練された立体感。","曲線的なガラスのオブジェ。写真や風景とは違う、現代的な抽象表現です。"],["illustration","D","手描きイラスト","手描きの温もりで、親しみやすく。","仕事道具・植物・猫を色鉛筆風に描いたイラスト。柔らかな線と紙の質感を生かしています。"],["paper","E","紙の切り絵","紙の重なりと、やさしい奥行き。","葉っぱと白い鳥のペーパークラフト。切り紙の影と重なりで、さりげない立体感を出しています。"]];
const buttons=[...document.querySelectorAll('[data-design].candidate')];
function select(id,updateHash=true){
 const row=variants.find(v=>v[0]===id)||variants[0];
 document.body.dataset.design=row[0];
 buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.design===row[0])));
 document.querySelector('#selection-title').textContent=row[1]+' · '+row[2];
 document.querySelector('#design-label').textContent=row[0].toUpperCase();
 document.querySelector('#design-title').textContent=row[3];
 document.querySelector('#design-description').textContent=row[4];
 document.querySelector('#background-link').href='assets/'+row[0]+'.jpg';
 document.querySelector('#raw-image').src='assets/'+row[0]+'.jpg';
 document.querySelector('#raw-image').alt=row[2]+'の背景画像';
 document.querySelector('#raw-link').href='assets/'+row[0]+'.jpg';
 if(updateHash)history.replaceState(null,'','#'+row[0]);
}
buttons.forEach((b,i)=>{
 b.addEventListener('click',()=>select(b.dataset.design));
 b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%5;else if(e.key==='ArrowLeft')next=(i+4)%5;else if(e.key==='Home')next=0;else if(e.key==='End')next=4;else return;e.preventDefault();buttons[next].focus();select(buttons[next].dataset.design);});
});
addEventListener('hashchange',()=>select(location.hash.slice(1),false));
select(location.hash.slice(1),false);
