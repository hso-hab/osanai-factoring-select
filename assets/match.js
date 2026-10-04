(() => {
 const form=document.querySelector('#match-form'),results=document.querySelector('#match-results');
 const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const base='/osanai-factoring-select/';
 function classify(s,amount,deadline,channel){
  const d=s.detail;if(s.id==='hso')return null;
  if(d.amountMin!==null&&amount<d.amountMin)return null;
  if(typeof d.amountMax==='number'&&amount>d.amountMax)return null;
  if(channel==='line'&&s.channel!=='LINE完結')return null;
  if(channel==='online'&&d.online!==true)return null;
  if(deadline==='today'&&d.sameDay!==true)return null;
  return d.amountMin===null||d.amountMax===null?'check':'range';
 }
 function resultCard(s){return `<article class="match-card"><h3><a href="${base}company/${s.id}/">${esc(s.name)}</a></h3><p class="match-reasons">比較する視点：${s.detail.fit.map(esc).join(' / ')}</p><p><b>金額：</b>${esc(s.amount||'—')}<br><b>手数料：</b>${esc(s.fee||'数値非掲載')}<br><b>入金：</b>${esc(s.speed||'数値非掲載')}<br><b>手続き：</b>${esc(s.channel||'—')}</p><p class="match-conditions">${[s.amountNote,s.feeNote,s.speedNote,s.note].filter(Boolean).map(esc).join('<br>')}</p><a class="site-button" href="${base}company/${s.id}/">対象条件・出典を確認 →</a>${s.externalCta?`<a class="site-button official" href="${esc(s.outboundUrl||s.url)}" data-outbound="${s.id}" data-location="diagnosis" target="_blank" rel="${s.sponsored?'sponsored ':''}noopener noreferrer">公式サイトで条件を確認 ↗</a>`:''}</article>`}
 function run({focus=true}={}){
  const amount=Number(form.elements.amount.value),deadline=form.elements.deadline.value,channel=form.elements.channel.value;
  if(!form.checkValidity()||!Number.isFinite(amount)||amount<=0||!['flexible','today'].includes(deadline)||!['all','online','line'].includes(channel)){document.querySelector('#match-error').hidden=false;document.querySelector('#match-error').textContent='金額と選択条件を確認してください。';return;}
  document.querySelector('#match-error').hidden=true;
  const range=[],check=[];for(const s of services){const type=classify(s,amount,deadline,channel);if(type==='range')range.push(s);if(type==='check')check.push(s);}
  const summary=`売却額 ${amount.toLocaleString('ja-JP')}万円 / ${deadline==='today'?'即日対応の公表あり':'日程指定なし'} / ${channel==='line'?'LINE完結':channel==='online'?'オンライン':'方法指定なし'}`;
  results.innerHTML=`<h2>公表条件との照合結果</h2><p>${esc(summary)}</p><p class="doc-note">審査結果ではありません。最短入金・取引先・事業条件などは、各社の詳細で確認してください。掲載順は優劣を表しません。</p><div class="match-result-tools"><button type="button" class="site-button" id="share-match">条件付きURLをコピー</button><a href="#match-form" class="site-button">条件を変更する ↑</a></div><p id="share-status" class="share-status" role="status"></p><h3>公表された金額範囲に含まれる候補：${range.length}社</h3>${range.length?range.map(resultCard).join(''):'<p class="match-empty">公表上下限まで確認できる候補がありません。下記の追加確認が必要な候補、または条件を変更してご確認ください。</p>'}${check.length?`<h3>金額条件の追加確認が必要な候補：${check.length}社</h3><p class="doc-note">公表下限または上限が揃っていないため、希望金額での利用を断定しません。</p>${check.map(resultCard).join('')}`:''}${!range.length&&!check.length?`<p class="match-empty">選択条件に対応する候補を掲載情報から確認できませんでした。<a href="${base}company/">全社一覧を見る</a></p>`:''}<p class="doc-note">HSOは会社一覧に掲載していますが、この条件照合には含めていません。</p>`;
  document.querySelector('#share-match').addEventListener('click',async()=>{const url=new URL(location.pathname,location.origin);url.search=new URLSearchParams({amount:String(amount),deadline,channel}).toString();const status=document.querySelector('#share-status');try{await navigator.clipboard.writeText(url.href);status.textContent='条件を含むURLをコピーしました。共有相手に金額・希望条件が伝わります。';}catch{status.textContent='コピーできませんでした。次のリンクをコピーしてください：';const a=document.createElement('a');a.href=url.href;a.textContent=url.href;status.append(a);}window.trackSiteEvent?.('diagnosis_share',{});});
  window.trackSiteEvent?.('diagnosis_complete',{result_count:range.length,check_count:check.length});
  if(focus){results.focus();results.scrollIntoView({block:'start'});}
 }
 form.addEventListener('submit',e=>{e.preventDefault();run()});
 const params=new URLSearchParams(location.search);
 if(params.has('amount')){const amount=params.get('amount'),deadline=params.get('deadline')||'flexible',channel=params.get('channel')||'all';if(/^\d+(\.\d{1,2})?$/.test(amount)&&['flexible','today'].includes(deadline)&&['all','online','line'].includes(channel)){form.elements.amount.value=amount;form.elements.deadline.value=deadline;form.elements.channel.value=channel;run({focus:false});}}
})();
