(() => {
 const form=document.querySelector('#match-form'),results=document.querySelector('#match-results');
 const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const base='/osanai-factoring-select/';
 const feeLabels={all:'指定しない',fixed:'一律料率の会社',bounded:'料率の上限も公表している会社'};
 const feeField=document.createElement('fieldset');feeField.innerHTML='<legend>費用表示で候補を絞る（任意）</legend><label>比べたい費用表示<select name="fee" id="match-fee">'+Object.entries(feeLabels).map(([k,v])=>'<option value="'+k+'">'+v+'</option>').join('')+'</select></label><p class="doc-note">安さの順位ではありません。追加費用・対象条件は別途確認します。</p>';form.querySelector('[type=submit]').before(feeField);
 const feeMatches=(s,fee)=>fee==='all'||(fee==='fixed'?s.fee?.startsWith('一律'):s.fee?.startsWith('一律')||/〜[0-9]/.test(s.fee||''));
 function refinement(x){return `<section class="result-refinement"><h3>候補が多いときは、ここから絞り込む</h3><p>対象条件を追加し、費用表示の違いで比べる候補を減らせます。条件は自動的に仮定しません。</p><div>${[['first','初回かどうか'],['buyer','請求書の取引先'],['fee','費用の表示']].map(([key,label])=>`<label>${label}<select data-refine="${key}">${[...form.elements[key].options].map(o=>`<option value="${o.value}" ${o.value===x[key]?'selected':''}>${o.textContent}</option>`).join('')}</select></label>`).join('')}</div><p class="doc-note">費用表示で絞る操作は利用可否の判定ではありません。表示対象外の会社も下の欄で確認できます。</p></section>`;}

 const buyerLabels={unknown:'指定なし',corporate:'法人',sole:'個人事業主',individual:'個人（事業者ではない）',government:'官公庁'};
 function classify(s,x){
  if(s.id==='hso')return null;const d=s.detail,p=s.profile||{},upper=p.totalMax??d.amountMax,reasons=[],checks=[],excluded=[];
  if(d.amountMin!==null&&x.amount<d.amountMin)excluded.push(`公表下限${d.amountMin}万円未満です`);
  if(typeof upper==='number'&&x.amount>upper)excluded.push(`この窓口の公表上限${upper}万円を超えます`);
  if(x.first==='first'&&p.firstMax&&x.amount>p.firstMax)excluded.push(`初回上限${p.firstMax}万円を超えます`);
  if(x.channel==='line'&&s.channel!=='LINE完結')excluded.push('LINE完結の条件に一致しません');
  if(x.channel==='online'&&d.online!==true)excluded.push('オンライン完結を掲載情報から確認できません');
  if(x.deadline==='today'&&d.sameDay!==true)excluded.push('即日対応の公表を確認できません');
  if(x.buyer!=='unknown'){
   if(s.id==='olta'&&['sole','individual'].includes(x.buyer))excluded.push('選択した売掛先は公式に対象外と案内されています');
   else if((s.id==='betrading'&&x.buyer==='sole')||(s.id==='support'&&x.buyer==='individual'))excluded.push('選択した売掛先は公式に対象外と案内されています');
   else if(!p.buyerTypes?.includes(x.buyer))checks.push('売掛先の種類は公式窓口で確認が必要です');
   else reasons.push(`売掛先「${buyerLabels[x.buyer]}」は公表対象に含まれます`);
  }
  if(excluded.length)return {s,type:'excluded',excluded};
  if(d.amountMin===null||upper===null){checks.push('金額の公表下限または上限が揃っていません');reasons.push(`確認できた金額条件の範囲外ではありません（${x.amount}万円）`)}
  else reasons.push(`請求書${x.amount}万円は公表金額範囲内です`);
  if(x.first==='first'){if(p.firstMax)reasons.push(`初回上限${p.firstMax}万円以内です`);else checks.push('初回利用だけの上限は別途確認してください')}
  if(x.channel!=='all')reasons.push(x.channel==='line'?'LINE完結の公表と一致します':'オンライン対応の公表と一致します');
  if(x.deadline==='today')reasons.push('即日対応の公表があります。ただし本日の入金を保証しません');
  checks.push(p.requirement||s.note);
  if(p.invoice)checks.push(p.invoice);
  return {s,type:(d.amountMin===null||upper===null||(x.buyer!=='unknown'&&!p.buyerTypes?.includes(x.buyer))||(x.first==='first'&&!p.firstMax))?'check':'range',reasons,checks};
 }
 function resultCard(r){const s=r.s;return `<article class="match-card" data-match-service="${s.id}"><h3><a href="${base}company/${s.id}/">${esc(s.name)}</a></h3><h4>入力条件に合致した点</h4><ul class="match-reasons">${r.reasons.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><p><b>金額：</b>${esc(s.amount||'—')}<br><b>手数料：</b>${esc(s.fee||'数値非掲載')}<br><b>入金：</b>${esc(s.speed||'数値非掲載')}<br><b>手続き：</b>${esc(s.channel||'—')}</p><p class="match-conditions">${[s.amountNote,s.feeNote,s.speedNote].filter(Boolean).map(esc).join('<br>')}</p><details class="result-checks"><summary>申込前の追加確認を読む</summary><ul>${r.checks.map(t=>`<li>${esc(t)}</li>`).join('')}</ul></details><label class="result-pick"><input type="checkbox" data-result-compare="${s.id}">${esc(s.name)}を比較に追加</label><div class="action-row"><a class="site-button" href="${base}company/${s.id}/#eligibility">対象条件・出典を確認 →</a>${s.externalCta?`<a class="site-button official" href="${esc(s.outboundUrl||s.url)}" data-outbound="${s.id}" data-location="diagnosis" target="_blank" rel="${s.sponsored?'sponsored ':''}noopener noreferrer">${s.sponsored?'広告・PR｜':''}公式サイトで条件を確認 ↗</a>`:''}</div></article>`}
 function run({focus=true}={}){
  const x={amount:Number(form.elements.amount.value),deadline:form.elements.deadline.value,channel:form.elements.channel.value,first:form.elements.first.value,buyer:form.elements.buyer.value,fee:form.elements.fee.value};
  if(!form.checkValidity()||!Number.isFinite(x.amount)||x.amount<=0||!['flexible','today'].includes(x.deadline)||!['all','online','line'].includes(x.channel)||!['unknown','first'].includes(x.first)||!Object.hasOwn(buyerLabels,x.buyer)||!Object.hasOwn(feeLabels,x.fee)){document.querySelector('#match-error').hidden=false;document.querySelector('#match-error').textContent='金額と選択条件を確認してください。';return;}
  document.querySelector('#match-error').hidden=true;
  window.siteSession?.set('diagnosis',x);
  const currentURL=new URL(location.href);for(const key of Object.keys(x))currentURL.searchParams.delete(key);history.replaceState(null,'',currentURL);
  const prior=window.siteSession?.get('diagnosisPicks');
  const all=services.map(s=>classify(s,x)).filter(Boolean),range=all.filter(r=>r.type==='range'&&feeMatches(r.s,x.fee)),check=all.filter(r=>r.type==='check'&&feeMatches(r.s,x.fee)),excluded=all.filter(r=>r.type==='excluded'),feeHidden=all.filter(r=>r.type!=='excluded'&&!feeMatches(r.s,x.fee));
  const summary=`請求書 ${x.amount.toLocaleString('ja-JP')}万円 / ${x.deadline==='today'?'即日対応の公表あり':'日程指定なし'} / ${x.channel==='line'?'LINE完結':x.channel==='online'?'オンライン':'方法指定なし'} / ${x.first==='first'?'初回利用':'利用回数指定なし'} / 売掛先：${buyerLabels[x.buyer]} / 費用表示：${feeLabels[x.fee]}`;
  results.innerHTML=`<h2>公表条件との照合結果</h2><p>${esc(summary)}</p><p class="doc-note">審査結果ではありません。合致する条件があっても、取引履歴・請求書・営業時間などの追加確認が必要です。掲載順は優劣を表しません。</p>${refinement(x)}<div class="match-result-tools"><button type="button" class="site-button" id="share-match">条件付きURLをコピー</button><a href="#match-form" class="site-button">条件を変更する ↑</a></div><p class="doc-note">条件付きURLには入力金額・希望条件が含まれます。共有相手やURLを開いた際の配信事業者に伝わる場合があります。</p><p id="share-status" class="share-status" role="status"></p>${range.length+check.length?`<fieldset class="diagnosis-compare"><legend>結果から2〜3社を選んで比較</legend><p>各社のカードで2〜3社を選択してください。</p><button class="site-button" type="button" id="compare-results" disabled>選んだ会社を比較する</button><p class="doc-note" id="compare-result-count">会社を選択してください。</p></fieldset>`:''}<h3>公表された金額・選択条件を照合できた候補：${range.length}社</h3>${range.length?range.map(resultCard).join(''):'<p class="match-empty">選択したすべての項目を公表条件だけでは照合できる候補がありません。追加確認の候補、または条件を変更してご確認ください。</p>'}${check.length?`<h3>条件の追加確認が必要な候補：${check.length}社</h3><p class="doc-note">未確認の上限・対象条件は、利用できるものとして補完していません。</p>${check.map(resultCard).join('')}`:''}${feeHidden.length?`<details class="fee-hidden"><summary>費用表示の条件で非表示にした会社（${feeHidden.length}社）</summary><p>対象外の判定ではなく、選択した費用表示に一致しない会社です。</p><ul>${feeHidden.map(r=>`<li><a href="${base}company/${r.s.id}/">${esc(r.s.name)}</a>：${esc(r.s.fee||'単一料率は非掲載')}</li>`).join('')}</ul><button type="button" class="site-button" id="reset-fee">費用表示の絞り込みを解除</button></details>`:''}${excluded.length?`<details class="match-excluded"><summary>今回の候補から外れた会社と理由（${excluded.length}社）</summary><ul>${excluded.map(r=>`<li><a href="${base}company/${r.s.id}/">${esc(r.s.name)}</a>：${r.excluded.map(esc).join('。')}</li>`).join('')}</ul></details>`:''}<p class="doc-note">HSOは会社一覧に掲載していますが、この条件照合には含めていません。</p>`;
  document.querySelector('#share-match').addEventListener('click',async()=>{const url=new URL(location.pathname,location.origin);url.search=new URLSearchParams(x).toString();const status=document.querySelector('#share-status');try{await navigator.clipboard.writeText(url.href);status.textContent='条件を含むURLをコピーしました。共有相手に金額・希望条件が伝わります。';}catch{status.textContent='コピーできませんでした。次のリンクをコピーしてください：';const a=document.createElement('a');a.href=url.href;a.textContent=url.href;status.append(a);}window.trackSiteEvent?.('diagnosis_share',{});});
  results.querySelectorAll('[data-refine]').forEach(el=>el.addEventListener('change',()=>{const key=el.dataset.refine;form.elements[key].value=el.value;run({focus:false});results.querySelector('[data-refine='+key+']').focus();}));
  results.querySelector('#reset-fee')?.addEventListener('click',()=>{form.elements.fee.value='all';run();});
  results.insertAdjacentHTML('beforeend','<div class="result-selection-bar" id="result-selection-bar" hidden><span></span><button class="site-button solid" type="button" disabled>選んだ会社を比較 →</button></div>');
  document.querySelector('#result-selection-bar button').addEventListener('click',()=>document.querySelector('#compare-results').click());
  const picks=()=>[...results.querySelectorAll('[data-result-compare]:checked')].map(c=>c.dataset.resultCompare);
  results.querySelectorAll('[data-result-compare]').forEach(c=>c.addEventListener('change',()=>{window.siteSession?.set('diagnosisPicks',picks());const n=picks().length;document.querySelector('#compare-results').disabled=n<2;results.querySelectorAll('[data-result-compare]').forEach(el=>el.disabled=n>=3&&!el.checked);document.querySelector('#compare-result-count').textContent=n?`${n}社を選択中${n<2?'・あと1社選ぶと比較できます':''}`:'2〜3社を選択してください。';const bar=document.querySelector('#result-selection-bar');bar.hidden=n===0;bar.querySelector('span').textContent=`${n}社を選択中`;bar.querySelector('button').disabled=n<2}));
  if(Array.isArray(prior)){const keep=[...results.querySelectorAll('[data-result-compare]')].filter(c=>prior.includes(c.dataset.resultCompare)).slice(0,3);keep.forEach(c=>c.checked=true);if(keep.length)keep[0].dispatchEvent(new Event('change'));else window.siteSession?.set('diagnosisPicks',[]);}
  document.querySelector('#compare-results')?.addEventListener('click',()=>{const ids=picks();if(ids.length)location.href=base+'company/?compare='+ids.join(',')+'#compare'});
  window.trackSiteEvent?.('diagnosis_complete',{result_count:range.length,check_count:check.length});
  if(focus){results.focus();results.scrollIntoView({block:'start'});}
 }
 form.addEventListener('submit',e=>{e.preventDefault();run()});
 const reset=document.createElement('button');reset.type='button';reset.className='site-button';reset.textContent='診断の入力をクリア';form.append(reset);
 const saveNote=document.createElement('p');saveNote.className='doc-note';saveNote.textContent='金額と希望条件はこのタブで一時保存され、ページ移動後も再開できます。外部送信はしません。';form.append(saveNote);
 reset.addEventListener('click',()=>{form.reset();results.innerHTML='';document.querySelector('#match-error').hidden=true;window.siteSession?.remove('diagnosis');window.siteSession?.remove('diagnosisPicks');const url=new URL(location.href);for(const key of ['amount','deadline','channel','first','buyer','fee'])url.searchParams.delete(key);history.replaceState(null,'',url);form.elements.amount.focus();});
 let params=new URLSearchParams(location.search);
 if(!params.has('amount')){const saved=window.siteSession?.get('diagnosis');if(saved&&typeof saved==='object')params=new URLSearchParams(saved);}

 if(params.has('amount')){const amount=params.get('amount'),deadline=params.get('deadline')||'flexible',channel=params.get('channel')||'all',first=params.get('first')||'unknown',buyer=params.get('buyer')||'unknown',fee=params.get('fee')||'all';if(/^\d+(\.\d{1,2})?$/.test(amount)&&['flexible','today'].includes(deadline)&&['all','online','line'].includes(channel)&&['unknown','first'].includes(first)&&Object.hasOwn(buyerLabels,buyer)&&Object.hasOwn(feeLabels,fee)){Object.entries({amount,deadline,channel,first,buyer,fee}).forEach(([k,v])=>form.elements[k].value=v);run({focus:false});}}
})();
