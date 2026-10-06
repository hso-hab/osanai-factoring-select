(() => {
 const calculator=document.querySelector('#calculator');if(!calculator)return;
 const section=document.createElement('section');section.className='quote-comparison';section.setAttribute('aria-labelledby','quote-heading');
 section.innerHTML=`<h3 id="quote-heading">手元の見積もりを比較する</h3><p>同じ請求書の額面で、提示された料率と追加費用を入力してください。各社の見積もり・審査結果を自動取得する機能ではありません。</p><button type="button" class="site-button" id="open-quotes" aria-expanded="false" aria-controls="quote-panel">見積もりを比べる</button><div id="quote-panel" hidden><p class="doc-note">上の「請求書の額面」を共通で使用します。会社名は任意です。入力内容は保存しません。</p><form id="quote-form" novalidate><div class="quote-grid">${['A','B','C'].map((letter,i)=>`<fieldset class="quote-card" data-quote="${i}"><legend>見積もり${letter}${i===2?'（任意）':''}</legend><label>会社名（任意）<input name="company${i}" maxlength="40" autocomplete="off" placeholder="会社名を入力"></label><label>提示された手数料率（%）<input name="rate${i}" type="number" min="0" max="100" step="0.1" inputmode="decimal" placeholder="例：10"></label><label>追加費用の合計（円）<input name="cost${i}" type="number" min="0" max="1000000000" step="1" inputmode="numeric" placeholder="なしの場合は0"></label><p class="quote-receipt">受取額 <output data-quote-output="${i}">—</output></p><p data-quote-note="${i}" class="doc-note">料率と追加費用を入力してください。</p></fieldset>`).join('')}</div><p id="quote-summary" role="status"></p><p class="doc-note">手数料の円未満は切り上げて計算します。実際の端数処理は見積書で確認してください。受取額だけで利用可否・契約条件の良し悪しを判断するものではありません。</p><button type="reset" class="site-button">見積もり入力をクリア</button></form></div>`;
 calculator.closest('.calculator-grid').after(section);
 const toggle=section.querySelector('#open-quotes'),panel=section.querySelector('#quote-panel'),form=section.querySelector('form');
 toggle.addEventListener('click',()=>{panel.hidden=!panel.hidden;toggle.setAttribute('aria-expanded',String(!panel.hidden));toggle.textContent=panel.hidden?'見積もりを比べる':'見積もり比較を閉じる';});
 function update(){
  const invoice=document.querySelector('#invoice'),validInvoice=invoice.value!==''&&invoice.validity.valid,amount=Number(invoice.value),values=[];
  for(let i=0;i<3;i++){
   const rate=form.elements['rate'+i],cost=form.elements['cost'+i],out=section.querySelector(`[data-quote-output="${i}"]`),note=section.querySelector(`[data-quote-note="${i}"]`);
   out.textContent='—';rate.removeAttribute('aria-invalid');cost.removeAttribute('aria-invalid');
   if(!validInvoice){note.textContent='上の請求書の額面を正しく入力してください。';continue;}
   if(rate.value===''||cost.value===''){note.textContent='料率と追加費用を入力してください。';continue;}
   if(!rate.validity.valid||!cost.validity.valid){note.textContent='料率は0〜100%（小数1桁まで）、追加費用は0円以上の整数で入力してください。';rate.setAttribute('aria-invalid',String(!rate.validity.valid));cost.setAttribute('aria-invalid',String(!cost.validity.valid));continue;}
   const fee=Math.ceil(amount*Math.round(Number(rate.value)*10)/1000),extra=Number(cost.value),receipt=amount-fee-extra;
   if(receipt<0){note.textContent='費用の合計が請求書の額面を超えています。';continue;}
   out.textContent=receipt.toLocaleString('ja-JP')+'円';note.textContent=`手数料 ${fee.toLocaleString('ja-JP')}円 ＋ 追加費用 ${extra.toLocaleString('ja-JP')}円`;
   values.push(receipt);
  }
  section.querySelector('#quote-summary').textContent=values.length>=2?`入力済み${values.length}件の受取額の差（最大−最小）：${(Math.max(...values)-Math.min(...values)).toLocaleString('ja-JP')}円`:'2件以上の有効な見積もりを入力すると、受取額の差を表示します。';
 }
 form.addEventListener('submit',e=>e.preventDefault());form.addEventListener('input',update);form.addEventListener('reset',()=>setTimeout(update,0));document.querySelector('#invoice').addEventListener('input',update);update();
})();
