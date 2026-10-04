(() => {
 const form=document.querySelector('#contact-draft');
 form.addEventListener('submit',e=>{e.preventDefault();const value='【'+document.querySelector('#contact-topic').value+'】\n対象ページ：'+document.querySelector('#contact-page').value+'\n\n'+document.querySelector('#contact-message').value;document.querySelector('#draft-text').value=value;document.querySelector('#draft-result').hidden=false;document.querySelector('#draft-status').textContent='下書きを作成しました。まだ送信されていません。';});
 document.querySelector('#copy-draft').addEventListener('click',async()=>{const text=document.querySelector('#draft-text');try{await navigator.clipboard.writeText(text.value);document.querySelector('#draft-status').textContent='コピーしました。まだ送信されていません。';}catch{text.focus();text.select();document.querySelector('#draft-status').textContent='文章を選択しました。コピーしてご利用ください。';}});
})();
