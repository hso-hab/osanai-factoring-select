const variants=[["aqua", "A", "ブルー × アクア", "参考イメージに近い、明るい街並み。", "青からアクアへ広がるグラデーションと白い都市の線画。参考画像の印象を重視した案です。"], ["emerald", "B", "エメラルド", "今のグリーンを、もっと印象的に。", "深いグリーンから翡翠色へ。現在のサイトの色味とつながる、穏やかな水辺の街並みです。"], ["navy", "C", "ネイビー × ブルー", "落ち着きと、はっきりしたコントラスト。", "濃紺の空に青白いビルの線画。白い見出しと人物写真が際立つ、引き締まった案です。"], ["mint", "D", "ライトミント", "明るさと、やさしい読み心地。", "淡いミントにグリーンの線画。濃い文字色を使い、白いページへ自然につながる案です。"], ["teal", "E", "ティール × 立体街並み", "奥行きのある、都会的な印象。", "青緑のグラデーションと俯瞰の街並み。細い線の重なりで、背景に奥行きを加える案です。"]];
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
 if(updateHash)history.replaceState(null,'','#'+row[0]);
}
buttons.forEach((b,i)=>{
 b.addEventListener('click',()=>select(b.dataset.design));
 b.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(i+1)%5;else if(e.key==='ArrowLeft')next=(i+4)%5;else if(e.key==='Home')next=0;else if(e.key==='End')next=4;else return;e.preventDefault();buttons[next].focus();select(buttons[next].dataset.design);});
});
addEventListener('hashchange',()=>select(location.hash.slice(1),false));
select(location.hash.slice(1),false);
