const selected=new Set();
let tableView='overview';
const state={purpose:'all',business:'all',search:'',sort:'default'};
const $=selector=>document.querySelector(selector);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const metricDefs=[['fee','公表手数料','feeNote'],['speed','入金の目安','speedNote'],['amount','買取可能額','amountNote']];
function metricList(s){return metricDefs.filter(([key])=>s[key]).map(([key,label,note])=>`<div><dt>${label}</dt><dd>${esc(s[key])}${s[note]?`<small>${esc(s[note])}</small>`:''}</dd></div>`).join('');}
function sourceList(s){return s.sources.map((url)=>`<li><a href="${url}" target="_blank" rel="noopener noreferrer">${esc(s.name)} 公式情報 — ${esc(new URL(url).pathname==='/'?'トップページ':new URL(url).pathname.includes('pricing')?'料金ページ':'サービス案内')} ↗</a></li>`).join('');}
function siteImage(s,compact=false){return s.image?`<figure class="site-preview ${compact?'compact':''}"><img src="/osanai-factoring-select/${esc(s.image.src)}" width="${s.image.width}" height="${s.image.height}" alt="${esc(s.name)}の公式サイト上部" loading="lazy" decoding="async"><figcaption><span>公式サイト上部</span><a href="${esc(s.image.url)}" target="_blank" rel="noopener noreferrer">画像出典 ↗</a><time datetime="${s.image.capturedAt}">${s.image.capturedAt} 取得</time></figcaption></figure>`:'';}
function legacyCard(s){
 const metrics=metricList(s);
 return `<article class="service-card ${s.id==='hso'?'featured':''}" id="service-${s.id}" style="--company-color:${s.color}"><div class="card-label"><span>${esc(s.tag)}</span></div><div class="card-main"><div class="company-head"><span class="company-icon" aria-hidden="true">${esc(s.mark)}</span><div><h3>${esc(s.name)}</h3><p class="kana">${esc(s.kana)}</p></div><span class="audience">${esc(s.audience)}</span></div>${siteImage(s)}<div class="service-summary">${metrics?`<dl class="metrics count-${metricDefs.filter(([k])=>s[k]).length}">${metrics}</dl>`:`<ul class="verified-facts">${s.facts.map(f=>`<li><span>✓</span>${esc(f)}</li>`).join('')}</ul>`}<p class="card-description">${esc(s.description)}</p>${s.id==='hso'?'<p class="placement-note">広告・PR｜運営元の自社サービス</p>':''}</div><div class="card-footer"><label class="compare-check"><input type="checkbox" data-compare="${s.id}" ${selected.has(s.id)?'checked':''} aria-label="${esc(s.name)}を比較に追加">比較に追加</label><div class="card-actions"><button class="button secondary" data-detail="${s.id}">紹介・掲載情報 <span>＋</span></button>${s.externalCta?`<a class="button primary" href="${s.outboundUrl||s.url}" data-outbound="${s.id}" target="_blank" rel="${s.sponsored?'sponsored noopener noreferrer':'noopener noreferrer'}" aria-label="${esc(s.name)}の公式サイトを新しいタブで開く">公式サイト <span>↗</span></a>`:''}</div></div><details class="source-details"><summary>出典・確認日 <span>＋</span></summary><ul>${sourceList(s)}</ul><p>確認日：${esc(s.checkedAt)}</p></details></div></article>`;
}
function officialLink(s,location){return s.externalCta?`<a class="site-button official" href="${esc(s.outboundUrl||s.url)}" data-outbound="${s.id}" data-location="${location}" target="_blank" rel="${s.sponsored?'sponsored ':''}noopener noreferrer" aria-label="${esc(s.name)}の公式サイトで条件を確認（新しいタブ）">公式サイトで確認 ↗</a>`:'';}
function card(s){
 return `<article class="service-card directory-card" id="service-${s.id}"><div class="directory-head"><img src="/osanai-factoring-select/${esc(s.image.src)}" width="1280" height="600" alt="${esc(s.name)}公式サイト" loading="lazy"><div><h3><a href="/osanai-factoring-select/company/${s.id}/">${esc(s.name)}</a></h3><p>${esc(s.audience)}</p></div></div><p>${esc(s.description)}</p>${s.id==='hso'?'<p class="placement-note">広告・PR｜運営元の自社サービス</p>':`<dl class="metrics">${metricList(s)}</dl>`}<p class="directory-note">${esc(s.note)}</p><div class="directory-actions"><label class="compare-check"><input type="checkbox" data-compare="${s.id}" ${selected.has(s.id)?'checked':''}>比較に追加</label><a class="text-link" href="/osanai-factoring-select/company/${s.id}/">詳細・出典を見る →</a>${officialLink(s,"directory")}</div></article>`;
}
function adValue(value){return esc(value).replace(/(\d+(?:[.,]\d+)?(?:万円|時間|分|%|円|万))/g,'<span class="metric-unit">$1</span>');}
function spotlight(s){
 const summaries={
  hso:'個人事業主・フリーランス向けの請求書ファクタリング。',
  trustlyne:'請求書の提出から手続きまで、LINEで進められます。',
  paytner:'少額の請求書に対応。個人の取引先への請求書も対象。',
  ququmo:'請求書と通帳を中心に申請。法人・個人事業主に対応。',
  paytoday:'手数料の下限・上限を公表。フリーランスにも対応。',
  olta:'請求書の全額だけでなく、一部の買取にも対応。',
  labol:'Webから申し込みできる、請求書買取サービス。',
  betrading:'個人事業主・フリーランス・法人の資金調達に対応。',
  support:'個人事業主も相談可能。申込から契約まで非対面で対応。',
  accel:'利用額・契約方式別の料率表を公開。個人事業主も対象。'
 };
 return `<article class="spotlight ad-card compact-company" data-ad-service="${s.id}"><a class="compact-company-main" href="/osanai-factoring-select/company/${s.id}/"><img src="/osanai-factoring-select/${esc(s.image.src)}" width="80" height="54" alt="${esc(s.name)}の公式サイト上部" loading="lazy" decoding="async"><div class="compact-company-copy"><p class="compact-company-kicker">${s.id==='hso'?'広告・PR｜自社サービス':esc(s.channel||s.audience)}</p><h4>${esc(s.name)}</h4><p class="compact-company-summary">${esc(summaries[s.id]||s.description)}</p></div></a><div class="compact-company-footer"><a href="/osanai-factoring-select/company/${s.id}/#sources" class="compact-company-source">詳細・出典 <span>↗</span></a>${s.externalCta?`<a class="compact-company-official" href="${esc(s.outboundUrl||s.url)}" data-outbound="${s.id}" target="_blank" rel="${s.sponsored?'sponsored ':''}noopener noreferrer" aria-label="${esc(s.name)}の公式サイトを新しいタブで開く">公式サイト ↗</a>`:''}</div></article>`;
}
function adGroups(items){
 const groups=[
  {id:'individual',icon:'◎',en:'FOR FREELANCERS',title:'個人・フリーランス向け',accent:'green',ids:['hso','trustlyne','paytner'],description:'対象事業者を確認して、働き方に合うサービスを比較。',note:'広告・PR｜HSOは運営元の自社サービスです。'},
  {id:'fees',icon:'%',en:'FEE & COST',title:'手数料の条件を見比べる',accent:'orange',ids:['ququmo','paytoday','olta'],description:'下限の数字だけでなく、公表範囲や追加費用の条件まで比較。',note:'公表料率を掲載したサービスの例です。安さの順位ではありません。'},
  {id:'small',icon:'¥',en:'SMALL INVOICES',title:'少額からの利用を考える',accent:'blue',ids:['labol','betrading','support'],description:'利用したい金額から、申請下限や対象窓口の条件を確認。',note:'公表下限が3万円以下、または下限設定なしのサービスの例です。'},
  {id:'online',icon:'↗',en:'ONLINE PROCESS',title:'オンラインで手続きを進める',accent:'green',ids:['accel','ququmo','olta'],description:'来店せずに進めたい方へ。各社の手続きと必要条件を見比べる。',note:'公式にオンライン完結と案内しているサービスの例です。'}
 ];
 return groups.map(g=>`<section class="ad-category accent-${g.accent}" id="category-${g.id}" aria-labelledby="heading-${g.id}"><div class="ad-category-heading"><div class="ad-category-symbol" aria-hidden="true">${g.icon}</div><div><p>${g.en}</p><h3 id="heading-${g.id}">${g.title}</h3></div></div><p class="ad-category-description">${g.description}</p><p class="ad-disclaimer">${g.note}</p><div class="ad-grid">${g.ids.map(id=>spotlight(items.find(s=>s.id===id))).join('')}</div><div class="compact-category-footer"><a href="#compare">全10社の条件を比較する →</a></div></section>`).join('');
}
function featurePair(items){
 return items.slice(0,2).map(s=>`<article class="feature-ad" data-feature-service="${s.id}"><div class="feature-ad-kicker">${s.id==='hso'?'広告・PR｜運営元のサービス':'個人事業主・フリーランス向け'}</div>${siteImage(s,true)}<div class="feature-ad-copy"><p class="eyebrow">${s.id==='hso'?'HSO FACTORING':'TRUSTLYNE'}</p><h3>${esc(s.name)}</h3><p>${esc(s.description)}</p>${s.id==='hso'?`<ul>${s.facts.map(f=>`<li>✓ ${esc(f)}</li>`).join('')}</ul>`:`<h4>LINEで進める手続き</h4><ul>${(s.detail?.flow||[]).map(f=>`<li>✓ ${esc(f)}</li>`).join('')}</ul><p class="doc-note">${esc(s.speed)}。${esc(s.speedNote)}。</p>`}<div class="feature-ad-actions"><a class="feature-detail" href="/osanai-factoring-select/company/${s.id}/">サービスを詳しく見る →</a>${s.externalCta?`<a href="${esc(s.outboundUrl||s.url)}" data-outbound="${s.id}" target="_blank" rel="${s.sponsored?'sponsored noopener noreferrer':'noopener noreferrer'}">公式サイトへ ↗</a>`:''}</div><small>確認：${esc(s.checkedAt)} · 詳細に公式出典を掲載</small></div></article>`).join('');
}
function purposeGuide(items){
 const groups=[
  {title:'個人向けのサービスを探す',symbol:'◎',purpose:'specialist',ids:['hso','trustlyne','paytner'],field:'audience',note:null,link:'個人・フリーランス中心で絞る'},
  {title:'少額からの利用を考える',symbol:'¥',purpose:'small',ids:['trustlyne','labol','paytner'],field:'amount',note:'amountNote',link:'公表下限3万円以下で絞る'},
  {title:'手数料の条件を見比べる',symbol:'%',purpose:'fee',ids:['ququmo','paytoday','olta'],field:'fee',note:'feeNote',link:'公表の下限料率順で見る'},
  {title:'LINEで手続きを進めたい',symbol:'↗',purpose:'line',ids:['trustlyne'],field:'channel',note:null,link:'LINE完結のサービスを見る'}
 ];
 return groups.map(g=>`<article class="purpose-guide-card"><h3><span aria-hidden="true">${g.symbol}</span>${g.title}</h3><ul>${g.ids.map(id=>{const s=items.find(s=>s.id===id);return `<li><button data-detail="${s.id}"><b>${esc(s.name)}${s.id==='hso'?'<small class="own-pr">自社PR</small>':''}</b><span>${esc(s[g.field])}${g.note&&s[g.note]?`<small>${esc(s[g.note])}</small>`:''}</span><i aria-hidden="true">↗</i></button></li>`}).join('')}</ul>${g.purpose==='line'?'<p class="purpose-context">対応サービスを確認してから、詳しい条件と出典へ。LINEの受付時間と審査・振込の時間は区別して確認しましょう。</p>':''}<button class="purpose-guide-more" data-jump-purpose="${g.purpose}">${g.link}<span>→</span></button></article>`).join('');
}
function render(){
 if(!$('#service-list'))return;
 const query=state.search.normalize('NFKC').toLowerCase().trim();
 let visible=services.filter(s=>(state.business!=='specialist'||s.specialist)&&(!query||(s.name+' '+s.kana).normalize('NFKC').toLowerCase().includes(query))&&(state.purpose!=='small'||s.min!==null&&s.min<=3)&&(state.purpose!=='line'||s.channel==='LINE完結'));
 if(state.sort==='fee')visible=visible.filter(s=>s.feeMin!==null).sort((a,b)=>a.feeMin-b.feeMin);
 if(state.sort==='name')visible.sort((a,b)=>a.name.localeCompare(b.name,'ja'));
 $('#service-list').innerHTML=visible.map(s=>card(s)).join('');
 $('#empty').hidden=visible.length!==0;
 $('#result-count').textContent=`${visible.length}件のサービス / 全${services.length}社`;
 $('#list-heading').textContent=state.sort==='fee'?'公表手数料の下限で比較。':'各社の条件を、詳しく比較。';
 $('#listing-note').textContent=state.sort==='fee'?'公表下限を掲載しているサービスを料率順に表示しています。適用条件が異なるため、実際の見積総額やサービス全体の優劣を示すものではありません。':'確認できた条件のみを掲載しています。各社の対象条件・追加費用・入金時間の起点もあわせて比較してください。';
 document.querySelectorAll('[data-purpose]').forEach(b=>{const active=b.dataset.purpose===state.purpose;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 $('#sort').value=state.sort;$('#business').value=state.business;$('#search').value=state.search;
}
function tableMetric(s,key,note){return s[key]?`<span class="${key==='fee'?'fee-cell':''}">${esc(s[key])}</span>${s[note]?`<small>${esc(s[note])}</small>`:''}`:'<span aria-label="数値非掲載">—</span>';}
function renderComparison(){
 if(!$('#comparison-table'))return;
 const items=selected.size?services.filter(s=>selected.has(s.id)):services;
 const rows=metricDefs.map(([key,label,note])=>[label,s=>tableMetric(s,key,note)]).concat([['対象事業者',s=>esc(s.audience)],['手続き',s=>s.channel?esc(s.channel):'<span aria-label="情報非掲載">—</span>'],['掲載区分',s=>esc(s.placement)],['公式サイトで確認',s=>officialLink(s,'comparison')||'公式申込リンク非掲載'],['出典・詳細',s=>`<a class="text-link" href="/osanai-factoring-select/company/${s.id}/#sources">掲載情報を見る →</a><small>確認：${esc(s.checkedAt)}</small>`]]);
 const table=$('#comparison-table');table.classList.toggle('overview-table',tableView==='overview');
 document.querySelectorAll('[data-table-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tableView===tableView)));
 if(tableView==='overview'){
  table.innerHTML=`<caption class="sr-only">ファクタリング会社の条件一覧</caption><thead><tr><th scope="col">サービス名</th><th scope="col">公表手数料</th><th scope="col">入金の目安</th><th scope="col">買取可能額</th><th scope="col">手続き・掲載情報</th></tr></thead><tbody>${items.map(s=>`<tr><th scope="row"><a class="table-name" href="/osanai-factoring-select/company/${s.id}/">${esc(s.name)} ↗</a>${s.id==='hso'?'<small>広告・PR｜自社サービス</small>':''}</th>${metricDefs.map(([key,label,note])=>`<td data-label="${label}">${tableMetric(s,key,note)}</td>`).join('')}<td data-label="手続き・詳細">${esc(s.channel||s.audience)}<a class="text-link" href="/osanai-factoring-select/company/${s.id}/#sources">条件・出典を見る →</a><small>確認：${esc(s.checkedAt)}</small>${officialLink(s,"comparison")}</td></tr>`).join('')}</tbody>`;
 }else{
 $('#comparison-table').innerHTML=`<caption class="sr-only">ファクタリング会社の条件比較</caption><thead><tr><th scope="col">比較項目</th>${items.map(s=>`<th scope="col"><a class="table-name" href="/osanai-factoring-select/company/${s.id}/">${esc(s.name)} <span>↗</span></a></th>`).join('')}</tr></thead><tbody>${rows.map(([label,fn])=>`<tr><th scope="row">${label}</th>${items.map(s=>`<td>${fn(s)}</td>`).join('')}</tr>`).join('')}</tbody>`;
 }
 $('#comparison-status').textContent=selected.size?`選択した${items.length}社を表示：${items.map(s=>s.name).join(' / ')}`:`全${services.length}社を表示しています。「比較に追加」で選んだ会社だけに絞れます。`;
 if($('#tray')){$('#tray').hidden=selected.size===0;$('#selected-count').textContent=selected.size;}
}
function resetFilters(){Object.assign(state,{purpose:'all',business:'all',search:'',sort:'default'});render();}
function clearSelection(){selected.clear();document.querySelectorAll('[data-compare]').forEach(c=>c.checked=false);renderComparison();}
function applyPurpose(purpose,business='all'){
 Object.assign(state,{purpose:purpose==='specialist'?'all':purpose,business:purpose==='specialist'?'specialist':business,search:'',sort:purpose==='fee'?'fee':'default'});render();$('#services')?.scrollIntoView({block:'start'});
}
let detailTrigger;
function showDetail(id,trigger){
 const s=services.find(x=>x.id===id);if(!s)return;detailTrigger=trigger;
 const facts=metricDefs.filter(([k])=>s[k]).map(([k,label,note])=>`<dt>${label}</dt><dd>${esc(s[k])}${s[note]?`<small>${esc(s[note])}</small>`:''}</dd>`).join('');
 $('#detail-content').innerHTML=`<p class="detail-kicker">SERVICE DETAILS</p><h2 class="detail-title" id="detail-title">${esc(s.name)}</h2>${siteImage(s)}<p>${esc(s.description)}</p><dl>${facts}<dt>対象事業者</dt><dd>${esc(s.audience)}</dd>${s.channel?`<dt>手続き</dt><dd>${esc(s.channel)}</dd>`:''}</dl>${s.note?`<p>${esc(s.note)}</p>`:''}${s.externalCta?`<a class="button primary" href="${s.outboundUrl||s.url}" data-outbound="${s.id}" target="_blank" rel="${s.sponsored?'sponsored noopener noreferrer':'noopener noreferrer'}">公式サイトで条件を見る ↗</a>`:''}${s.id==='hso'?'<p class="placement-note">広告・PR｜運営元の自社サービス</p>':''}<div class="detail-sources"><h3>出典・確認日</h3><ul>${sourceList(s)}</ul><p class="small">確認日：${esc(s.checkedAt)}。公式に記載された最短時間等は条件付きの目安です。</p></div>`;
 $('#detail-dialog').showModal();
}
function calculate(){
 if(!$('#calculator'))return;
 const invoice=$('#invoice'),rate=$('#rate'),cost=$('#cost');
 const valid=[invoice,rate,cost].every(i=>i.value!==''&&i.validity.valid);
 let error='';
 if(!valid)error='額面は1円以上の整数、手数料率は0〜100%、その他費用は0円以上の整数で入力してください。';
 const amount=Number(invoice.value),percent=Number(rate.value),extra=Number(cost.value);
 const fee=Math.ceil(amount*Math.round(percent*10)/1000);const receipt=amount-fee-extra;
 if(valid&&receipt<0)error='手数料とその他の費用の合計が、請求書の額面を超えています。';
 $('#calc-error').hidden=!error;$('#calc-error').textContent=error;
 if(error){$('#receipt').textContent='—';$('#calc-breakdown').textContent='入力条件を確認してください。';return;}
 $('#receipt').innerHTML=`${receipt.toLocaleString('ja-JP')}<small>円</small>`;
 $('#calc-breakdown').textContent=`手数料 ${fee.toLocaleString('ja-JP')}円 ＋ その他の費用 ${extra.toLocaleString('ja-JP')}円`;
}
if(typeof document!=='undefined'){
 document.addEventListener('click',event=>{
  const view=event.target.closest('[data-table-view]');if(view){tableView=view.dataset.tableView;renderComparison();}
  const purpose=event.target.closest('[data-purpose]');if(purpose){state.purpose=purpose.dataset.purpose;state.sort=state.purpose==='fee'?'fee':'default';render();}
  const jump=event.target.closest('[data-jump-purpose]');if(jump)applyPurpose(jump.dataset.jumpPurpose);
  const detail=event.target.closest('[data-detail]');if(detail)showDetail(detail.dataset.detail,detail);
 });
 document.addEventListener('change',event=>{const id=event.target.dataset.compare;if(id){event.target.checked?selected.add(id):selected.delete(id);document.querySelectorAll('[data-compare]').forEach(c=>c.checked=selected.has(c.dataset.compare));if(selected.size)tableView='side';renderComparison();}});
 $('#business')?.addEventListener('change',e=>{state.business=e.target.value;render();});
 $('#sort')?.addEventListener('change',e=>{state.sort=e.target.value;if(state.purpose==='fee'&&state.sort!=='fee')state.purpose='all';render();});
 $('#search')?.addEventListener('input',e=>{state.search=e.target.value;render();});
 $('#reset')?.addEventListener('click',resetFilters);$('#empty-reset')?.addEventListener('click',resetFilters);
 $('#show-all')?.addEventListener('click',clearSelection);$('#clear-selection')?.addEventListener('click',clearSelection);
 $('.dialog-close')?.addEventListener('click',()=>$('#detail-dialog').close());
 $('#detail-dialog')?.addEventListener('close',()=>detailTrigger?.focus());
 $('#detail-dialog')?.addEventListener('click',e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.currentTarget.close();}});
 $('#quick-finder')?.addEventListener('submit',e=>{e.preventDefault();applyPurpose($('#quick-purpose').value,$('#quick-range').value);});
 $('#calculator')?.addEventListener('submit',e=>e.preventDefault());$('#calculator')?.addEventListener('input',calculate);
 render();renderComparison();calculate();
}
