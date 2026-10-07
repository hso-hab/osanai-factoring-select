window.robotTopics=[{"id":"speed","words":["今日","即日","急ぎ","最短","何分","何時間","入金","いつ","早い","速い","土日","休日","祝日","週末"],"answer":"QuQuMoは必要書類が揃った場合の申込から最短2時間、TRUSTLYNEは審査完了後最短30分を案内しています。そのまま数字だけで速さを順位付けすることはできません。\n\nlabolの24時間365日は、審査完了分の振込対応です。審査そのものが24時間365日行われるという意味ではありません。受付時間、審査時間、振込対応を分けて確認しましょう。\n\n必要な書類がすべて揃った時点で、希望する日までの対応を相談しましょう。最短時間だけで支払い予定を決めず、審査・契約・振込それぞれの進行状況を確認してください。","links":[["入金時間の見方","guide/speed/"],["土日祝の確認事項","guide/weekends/"]]},{"id":"fees","words":["手数料","料率","費用","安い","高い","いくら","受取","金利","コスト","料金"],"answer":"見積もりは、対象の請求書と希望する売却額を揃えて比べます。「1%〜」は下限の表示であり、その料率が自分にも適用されるという意味ではありません。\n\n手数料と追加費用を差し引いた受取額は、このサイトの計算機で確認できます。実際の見積もりは各社の公式窓口で確認してください。","links":[["手数料と受取額の見方","guide/fees/"],["受取額を計算する","#receipt-calculator"]]},{"id":"documents","words":["書類","必要","通帳","身分証","確定申告","本人確認","請求書だけ"],"answer":"QuQuMoは請求書と通帳を案内しています。ペイトナーは請求書・口座入出金明細・初回の顔写真付き身分証を案内しています。同じ書類だけで全社に申し込めるとは限りません。\n\n書類は各社の公式な申込先に提出してください。この比較サイトでは請求書や本人確認書類を受け付けていません。対象外の債権や売掛先の条件も、申込前に確認することが大切です。","links":[["必要書類の確認","guide/documents/"]]},{"id":"contracts","words":["2社","3社","二社","三社","契約","通知","承諾","取引先に","売掛先に","バレ","ばれ","連絡され"],"answer":"2社間は利用者とファクタリング会社、3社間は売掛先も加わる方式です。日本中小企業金融サポート機構は両方式を案内し、売掛先に連絡せず進めたい場合の選択肢として2社間を紹介しています。\n\n取引先への連絡、債権譲渡登記、契約後に必要な対応は別の確認事項です。方式名だけで「絶対に知られない」と判断せず、実際の契約条項を確認してください。\n\n買取代金、総費用、精算日、売掛先が支払わない場合の扱いを確認します。買戻しや自己資金での支払いを求める条件などに不安があれば、契約前に弁護士などの専門家へ相談してください。","links":[["契約方式と条件","guide/contracts/"]]},{"id":"match","words":["おすすめ","オススメ","選び","選ぶ","選べ","比較","合う","探す","探し","少額","個人事業","フリーランス","いくらから","万円","初回"],"answer":"金額・希望する入金時期・手続き方法から、公表条件と照合する「条件診断」を使えます。氏名・連絡先は不要です。\n\n診断は審査や利用可否を判定するものではありません。候補が出たら、必要書類や費用を各社の公式情報で確認できます。","links":[["条件診断を開く","match/"],["会社一覧で比較する","company/"]]},{"id":"safety","words":["絶対","必ず","保証","通る","通り","審査","ブラック","危険","安全","違法","借金","給料","給与"],"answer":"このサイトの掲載や条件診断は、審査通過・利用可否・入金を保証するものではありません。個別の審査結果は回答できません。\n\n契約前には総費用、売掛先が支払わない場合の負担や買戻し条件を確認してください。詳しい確認事項と金融庁の案内は、次のページにまとめています。","links":[["利用前の注意点・相談先","guide/safety/"]]},{"id":"basics","words":["ファクタリング","仕組み","しくみ","何です","なに","初めて","はじめて"],"answer":"事業で発生した売掛債権を売却し、支払期日より前に資金を受け取る仕組みです。受取額は売却額から手数料等を差し引いた額になります。\n\n対象の請求書を確認し、見積もりを依頼します。提示された総費用・受取額・契約条件を確認したうえで契約を判断してください。比較サイトの掲載は審査通過や入金の保証ではありません。","links":[["仕組みと利用前の確認","guide/basics/"]]}];
(() => {
  const button = document.querySelector('.mascot-play');
  if (!button) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const hint = document.querySelector('.mascot-hint'), status = document.querySelector('#mascot-status');
  button.disabled = false; hint.hidden = false;
  const flyer = document.createElement('button'); flyer.type = 'button';
  flyer.className = 'roaming-mascot'; flyer.setAttribute('aria-label', 'ナビロボに質問する'); flyer.setAttribute('aria-haspopup', 'dialog'); flyer.setAttribute('aria-controls', 'robot-chat');
  button.setAttribute('aria-haspopup', 'dialog'); button.setAttribute('aria-controls', 'robot-chat');
  flyer.append(button.querySelector('svg').cloneNode(true));
  const speech = document.createElement('span'); speech.className = 'robot-speech';
  speech.textContent = 'わからないことがあれば、お助けロボがサポートするよ！';
  const speechHint = document.createElement('small'); speechHint.textContent = 'タップして質問してね';
  speech.append(speechHint); flyer.append(speech);
  const dock = document.createElement('div'); dock.className = 'mascot-dock'; dock.setAttribute('role', 'group'); dock.setAttribute('aria-label', 'ナビロボの表示');
  const pause = document.createElement('button'), hide = document.createElement('button');
  pause.type = hide.type = 'button'; hide.textContent = '隠す'; hide.setAttribute('aria-label', 'ナビロボを隠す');
  dock.append(pause, hide); document.body.append(flyer, dock); document.body.classList.add('has-roaming-mascot');
  let paused = false, hidden = false, editing = false, flight = null, route = 0, scrollTimer, greetingTimer, readingTimer;
  let hovering = false, focused = false, chatOpen = false;
  let limits, initialized = false, x = 0, y = 0;
  const blockers = [...document.querySelectorAll('#tray, .result-selection-bar, .mobile-official, .consent-notice')];
  const canFly = () => !paused && !hidden && !editing && !hovering && !focused && !chatOpen && !document.hidden && !preference.matches && !!flyer.animate;
  const stopFlight = () => {
    if (flight) {
      // Freeze at the current position, not at the destination of an interrupted flight.
      const matrix = new DOMMatrixReadOnly(getComputedStyle(flyer).transform);
      x = matrix.m41; y = matrix.m42;
      flight.onfinish = null; flight.cancel(); flight = null;
      flyer.style.transform = `translate(${x}px, ${y}px)`;
    }
    flyer.classList.remove('is-flying');
  };
  const measure = () => {
    const small = innerWidth <= 760, size = parseFloat(getComputedStyle(flyer).width), height = parseFloat(getComputedStyle(flyer).height);
    let inset = small ? 8 : 12;
    for (const blocker of blockers) {
      if (blocker.hidden || getComputedStyle(blocker).display === 'none') continue;
      const rect = blocker.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom >= innerHeight - 12 && rect.height > 0) inset = Math.max(inset, innerHeight - rect.top + 10);
    }
    dock.style.bottom = `${inset}px`;
    // Reserve the control dock and bottom CTA region; keep the flight below the header.
    const bottom = Math.max(90, innerHeight - inset - 58 - height - 14);
    limits = {left: 6, right: Math.max(6, innerWidth - size - 6), top: Math.min(bottom, Math.max(90 + speech.offsetHeight + 12, innerHeight * .26)), bottom};
    if (!initialized) {x = limits.right; y = limits.bottom; initialized = true;}
    x = Math.max(limits.left, Math.min(limits.right, x)); y = Math.max(limits.top, Math.min(limits.bottom, y));
    flyer.style.transform = `translate(${x}px, ${y}px)`;
  };
  const destination = () => {
    const {left, right, top, bottom} = limits;
    const stops = [[right, top], [right, bottom], [left, bottom], [left, top], [left, bottom], [right, bottom]];
    for (let i = 0; i < stops.length; i += 1) {
      const next = stops[route++ % stops.length];
      if (Math.hypot(next[0] - x, next[1] - y) > 20) return next;
    }
    return stops[0];
  };
  const fly = (target = destination()) => {
    if (!canFly()) return;
    stopFlight();
    const [tx, ty] = target, distance = Math.hypot(tx - x, ty - y);
    const duration = Math.min(40000, Math.max(7800, distance * 33));
    const lean = tx > x ? 2 : tx < x ? -2 : 0;
    flyer.classList.add('is-flying');
    flight = flyer.animate([
      {transform: `translate(${x}px, ${y}px) rotate(0deg)`},
      {transform: `translate(${(x + tx) / 2}px, ${(y + ty) / 2}px) rotate(${lean}deg)`, offset: .5},
      {transform: `translate(${tx}px, ${ty}px) rotate(0deg)`}
    ], {duration, easing: 'cubic-bezier(.4, 0, .2, 1)', fill: 'forwards'});
    flight.onfinish = () => {
      x = tx; y = ty; flyer.style.transform = `translate(${x}px, ${y}px)`;
      const done = flight; flight = null; done.onfinish = null; done.cancel();
      if (canFly()) fly();
    };
  };
  const sync = () => {
    if (!canFly()) stopFlight();
    flyer.hidden = hidden || editing || chatOpen || document.hidden;
    dock.hidden = editing || chatOpen;
    pause.textContent = preference.matches ? '静止表示' : paused ? '動きを再開' : '動きを止める';
    pause.disabled = hidden || preference.matches || !flyer.animate;
    pause.setAttribute('aria-pressed', String(paused));
    hide.textContent = hidden ? '表示' : '隠す'; hide.setAttribute('aria-label', hidden ? 'ナビロボを表示する' : 'ナビロボを隠す');
    if (canFly() && !flight) fly();
  };
  const stopGreeting = () => {clearTimeout(greetingTimer); button.classList.remove('is-greeting');};
  const greet = () => {
    if (document.hidden || paused || hidden || chatOpen) return;
    if (!preference.matches) {stopGreeting(); button.classList.add('is-greeting'); greetingTimer = setTimeout(stopGreeting, 2400);}
  };
  // Chat handlers below replace the earlier recall action.
  pause.addEventListener('click', () => {paused = !paused; stopGreeting(); sync();});
  hide.addEventListener('click', () => {hidden = !hidden; stopGreeting(); sync();});
  const reflow = () => {stopFlight(); measure(); sync();};
  let resizeFrame = 0;
  const scheduleReflow = () => {if (!resizeFrame) resizeFrame = requestAnimationFrame(() => {resizeFrame = 0; reflow();});};
  addEventListener('resize', scheduleReflow, {passive:true});
  for (const blocker of blockers) {
    new MutationObserver(scheduleReflow).observe(blocker, {attributes:true, attributeFilter:['hidden','class','style']});
    if (window.ResizeObserver) new ResizeObserver(scheduleReflow).observe(blocker);
  }
  // Change course after scrolling settles; scrolling itself is never intercepted.
  addEventListener('scroll', () => {
    if (innerWidth <= 760) {
      flyer.classList.add('is-reading');
      clearTimeout(readingTimer);
      readingTimer = setTimeout(() => flyer.classList.remove('is-reading'), 1600);
    }
    clearTimeout(scrollTimer); scrollTimer = setTimeout(() => {if (canFly()) reflow();}, 240);
  }, {passive:true});
  const updateEditing = () => {
    const next = !!document.activeElement?.matches('input, select, textarea, [contenteditable="true"]');
    if (next !== editing) {editing = next; sync();}
  };
  document.addEventListener('focusin', updateEditing);
  document.addEventListener('focusout', () => setTimeout(updateEditing, 0));
  preference.addEventListener('change', () => {stopGreeting(); sync();});
  document.addEventListener('visibilitychange', () => {if (document.hidden) stopGreeting(); sync();});
  if (window.IntersectionObserver) {
    const intro = new IntersectionObserver(entries => {if (entries.some(e => e.isIntersecting)) {greet(); intro.disconnect();}}, {threshold:.65}); intro.observe(button);
  }
  const dialog = document.createElement('dialog');
  dialog.id = 'robot-chat'; dialog.className = 'robot-chat'; dialog.setAttribute('aria-labelledby', 'robot-chat-title');
  dialog.innerHTML = `<header class="robot-chat-header"><div><p>SELECT / NAVIGATOR</p><h2 id="robot-chat-title">ナビロボに質問</h2></div><button class="robot-chat-close" type="button" aria-label="質問パネルを閉じる">×</button></header>
    <p class="robot-chat-note">サイトの掲載情報をもとにご案内します。自由会話AIではありません。</p>
    <div class="robot-chat-log" role="log" aria-live="polite" aria-label="質問と回答"><div class="robot-message robot-answer"><p>何を知りたいですか？会社名や気になる条件を入力するか、下の質問を選んでください。</p></div></div>
    <div class="robot-chat-suggestions" aria-label="質問の例"><button type="button">手数料の見方は？</button><button type="button">必要な書類は？</button><button type="button">今日中に入金できる？</button><button type="button">自分に合う会社を探したい</button></div>
    <form class="robot-chat-form"><label class="sr-only" for="robot-question">質問を入力</label><input id="robot-question" name="question" type="text" maxlength="300" required autocomplete="off" placeholder="例：ペイトナーの手数料は？"><button type="submit">質問する</button></form><p class="robot-chat-privacy">質問は保存・送信されません。掲載範囲外の内容には回答できません。</p>`;
  document.body.append(dialog);
  const input = dialog.querySelector('input'), form = dialog.querySelector('form'), log = dialog.querySelector('.robot-chat-log');
  let opener = button;
  const openChat = event => {
    if (dialog.open) return;
    clearTimeout(readingTimer); flyer.classList.remove('is-reading');
    opener = event.currentTarget; chatOpen = true; stopGreeting(); stopFlight(); sync();
    document.documentElement.classList.add('robot-chat-open'); dialog.showModal(); input.focus({preventScroll:true});
  };
  button.addEventListener('click', openChat); flyer.addEventListener('click', openChat);
  flyer.addEventListener('pointerenter', event => {if (event.pointerType === 'mouse') {hovering = true; sync();}});
  flyer.addEventListener('pointerleave', () => {hovering = false; sync();});
  flyer.addEventListener('focus', () => {focused = true; sync();});
  flyer.addEventListener('blur', () => {focused = false; sync();});
  flyer.addEventListener('pointerdown', stopFlight);
  // Tapping cancels flight before opening; a cancelled touch may resume normally.
  flyer.addEventListener('pointercancel', sync);
  dialog.querySelector('.robot-chat-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target.closest('.robot-message a')) {dialog.close(); return;}
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('robot-chat-open'); chatOpen = false; editing = false; hovering = false; sync();
    if (opener.isConnected && !opener.hidden) opener.focus({preventScroll:true});
  });
  const normal = value => value.normalize('NFKC').toLowerCase().replace(/\s/g, '');
  const answerFor = question => {
    const q = normal(question), topics = window.robotTopics || [];
    const safety = topics.find(t => t.id === 'safety' && t.words.some(w => q.includes(normal(w))));
    if (safety) return safety;
    if (/^(こんにちは|こんばんは|おはよう|ありがとう|やあ|hello|hi)[！!。]*$/.test(q)) return {answer:'こんにちは！手数料・書類・入金時間など、気になることを聞いてください。会社名を入れると、その会社の掲載情報をご案内できます。',links:[]};
    if (/あなた|aiです|aiなの|人工知能|何ができ|誰|だれ/.test(q)) return {answer:'このサイトに掲載されている情報を照合する案内機能です。自由に会話するAIではありません。手数料・必要書類・入金時間・会社情報や、比較の使い方をご案内します。',links:[['会社一覧を見る','company/']]};
    const aliases = {trustlyne:['トラストライン','trustline'],ququmo:['ククモ'],paytner:['ペイトナー'],labol:['ラボル'],paytoday:['ペイトゥデイ'],olta:['オルタ'],betrading:['ビートレーディング'],support:['サポート機構'],accel:['アクセルファクター']};
    const all = typeof services !== 'undefined' ? services : [];
    const companies = all.filter(s => [s.name,s.id,...(aliases[s.id]||[])].some(name => q.includes(normal(name))));
    const feeAsked = /手数料|料率|費用|受取|金利|コスト|料金|安い|高い/.test(q);
    const amountAsked = /いくらから|何円から|何万円から|最低額|最低利用|最低買取|買取額|利用額|請求書の金額|初回.*(?:上限|限度|いくら|金額|何万)|(?:上限|下限|限度額)/.test(q) && (!feeAsked || /初回|利用額|買取額|いくらから|何円から|何万円から/.test(q));
    const firstAsked = amountAsked && /初回|初めて|はじめて/.test(q);
    const topicIds = ['fees','documents','speed','contracts'].filter(id => {
      if (id === 'fees') return feeAsked;
      return topics.find(t => t.id === id)?.words.some(w => q.includes(normal(w)));
    });
    // Amount questions must not be captured by the generic fee keyword "いくら".
    if (amountAsked) topicIds.unshift('amount');
    if (companies.length) {
      const companyAnswer = company => {
        const sections = topicIds.map(id => {
          if (id === 'fees') return `公表手数料：${company.fee || '単一の料率は掲載していません。'}\n${company.feeNote || ''}\n${company.note || ''}`;
          if (id === 'amount') {
            const first = company.profile?.firstMax;
            const lines = [`買取金額：${company.amount || '具体的な金額条件は掲載していません。'}`, company.amountNote || ''];
            if (firstAsked) lines.unshift(Number.isFinite(first) ? `公表の初回上限：${first}万円` : '初回専用の上限額は掲載情報から確認できません。一般の買取範囲が初回にも適用されるとは限らないため、公式窓口で確認してください。');
            else if (Number.isFinite(first)) lines.push(`初回上限：${first}万円`);
            if (company.profile?.requirement) lines.push(company.profile.requirement);
            lines.push('買取可否・実際の利用枠は審査や契約条件によります。');
            return lines.filter(Boolean).join('\n');
          }
          if (id === 'documents') return company.detail?.docs?.length ? '必要書類として掲載している内容：\n・'+company.detail.docs.join('\n・')+'\n\n追加書類や提出形式は公式窓口で確認してください。' : '必要書類の具体的な条件は、このサイトには掲載していません。';
          if (id === 'speed') return `${company.speed || '入金時間の具体的な条件は掲載していません。'}\n${company.speedNote || ''}\n\n最短時間は条件付きの目安であり、希望日の入金を保証するものではありません。`;
          return `契約方式：${company.profile?.contract || '掲載していません。'}\n通知・承諾：${company.profile?.notice || '掲載していません。'}\n契約条項は公式窓口で確認してください。`;
        });
        if (!sections.length) sections.push(`${company.description}\n${company.amount ? '買取金額：'+company.amount : ''}\n${company.note || ''}`);
        return `${company.name}の掲載情報\n${sections.join('\n\n')}\n基本情報の確認日：${company.checkedAt}（追加項目の確認日は詳細・出典に記載）`;
      };
      const links = companies.map(company => [`${company.name}の詳細・出典`,'company/'+company.id+'/#sources']);
      if (companies.length > 1) links.unshift(['この会社を比較表で見る','company/?compare='+companies.map(s=>s.id).join(',')+'#compare']);
      return {answer:companies.map(companyAnswer).join('\n\n────────\n\n'),links};
    }
    if (amountAsked) {
      if (firstAsked) return {answer:'初回の上限額は会社ごとに異なります。会社名と「初回上限」を入力すると、その会社の掲載条件をご案内します。条件診断でも初回利用を指定できます。',links:[['初回利用の確認事項','guide/first-use/'],['初回条件を指定して診断する','match/?first=first']]};
      return {answer:'公表されている買取金額は会社ごとに異なります。掲載例は次のとおりです。\n\n'+all.filter(s=>s.amount).map(s=>`${s.name}：${s.amount}${s.amountNote?'（'+s.amountNote+'）':''}`).join('\n')+'\n\n下限・上限が未確認の項目を、制限なしとは扱いません。買取可否・初回の利用枠は別途確認が必要です。会社名を添えると対象の条件をご案内します。',links:[['金額条件を比較する','compare/amount/'],['初回利用の確認事項','guide/first-use/']]};
    }
    const topic = topics.find(t => topicIds.includes(t.id)) || topics.find(t => t.words.some(w => q.includes(normal(w))));
    if (topic) return topic;
    return {answer:'その質問に答えられる内容は、掲載情報から見つかりませんでした。手数料・書類・入金時間などの言葉や、会社名を添えて聞いてみてください。個別の審査結果・契約条件は各社の公式窓口で確認が必要です。',links:[['会社一覧・公式窓口の案内','company/'],['条件診断を使う','match/']]};
  };
  const append = (text, type, response) => {
    const entry = document.createElement('div'); entry.className = 'robot-message '+type;
    const p = document.createElement('p'); p.textContent = text; entry.append(p);
    for (const [label, href] of response?.links || []) {
      const a = document.createElement('a'); a.textContent = label+' →'; a.href = (window.SITE_CONFIG?.basePath || '/')+href; entry.append(a);
    }
    if (response?.checkedAt) {const date = document.createElement('small'); date.textContent = '掲載情報の確認日：'+response.checkedAt; entry.append(date);}
    log.append(entry); while (log.children.length > 30) log.firstElementChild.remove();
    log.scrollTop = log.scrollHeight;
  };
  form.addEventListener('submit', event => {
    event.preventDefault(); const question = input.value.trim(); if (!question) {input.focus(); return;}
    append(question, 'robot-question'); const response = answerFor(question); append(response.answer, 'robot-answer', response); input.value = ''; input.focus({preventScroll:true});
  });
  dialog.querySelectorAll('.robot-chat-suggestions button').forEach(chip => chip.addEventListener('click', () => {input.value = chip.textContent; form.requestSubmit();}));
  measure(); sync();
})();
