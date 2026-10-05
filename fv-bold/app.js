const variants=[["zipper","A","世界をひらくファスナー","白い面を開くと、鮮やかな別世界。","巨大なファスナーが白い面を開き、内側からコバルトの空間が現れる超現実的な写真表現。"],["thread","B","一本の糸がつくる道","複雑な道から、一本の選択へ。","無数の赤い糸が、一本の道へほどけていく刺繍アート。"],["cyanotype","C","青写真の透過アート","見慣れた道具を、見たことのない姿に。","時計の歯車・鍵・羽根を透かしたような、青写真の実験的なコラージュ。"],["kintsugi","D","金継ぎの白い大地","ひび割れを、輝くつながりに。","割れた白磁の陶板を金でつないだ、余白と質感が際立つ接写。"],["moire","E","うねる錯視の版画","止まった画面に、動きの気配。","細い縞模様が膨らみ、吸い込まれるようにうねるオプティカルアート。"]];
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
