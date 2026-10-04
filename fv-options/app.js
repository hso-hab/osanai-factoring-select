const designs=['blue','green','coral'];
const tabs=[...document.querySelectorAll('[role="tab"]')];
function selectDesign(name,updateURL=false){
 if(!designs.includes(name))name='blue';
 document.body.dataset.design=name;
 tabs.forEach(tab=>{const active=tab.dataset.design===name;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=!active;});
 if(updateURL)history.replaceState(null,'','#'+name);
 document.title=({blue:'ブルー × 写真',green:'グリーン × イラスト',coral:'ネイビー × コーラル'}[name])+'｜FVデザイン比較';
}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectDesign(tab.dataset.design,true));tab.addEventListener('keydown',event=>{let target;if(event.key==='ArrowRight')target=(i+1)%tabs.length;if(event.key==='ArrowLeft')target=(i+tabs.length-1)%tabs.length;if(event.key==='Home')target=0;if(event.key==='End')target=tabs.length-1;if(target!==undefined){event.preventDefault();tabs[target].focus();selectDesign(tabs[target].dataset.design,true);}});});
window.addEventListener('hashchange',()=>selectDesign(location.hash.slice(1)));
selectDesign(location.hash.slice(1));
