(() => {
 const config=window.SITE_CONFIG||{},id=config.ga4MeasurementId,key='osanai-factoring-select:analytics-consent';
 const allowed=new Set(['official_click','detail_view','diagnosis_complete','diagnosis_share','compare_select','calculator_use']);
 let consent='denied',loaded=false;
 try{consent=localStorage.getItem(key)||'unset'}catch{}
 const path=location.pathname,cleanUrl=location.origin+path;
 const cleanReferrer=(()=>{try{const u=new URL(document.referrer);return u.origin+u.pathname}catch{return ''}})();
 window.siteEventLog=[];
 function gtag(){window.dataLayer=window.dataLayer||[];window.dataLayer.push(arguments)}
 function start(){
  if(!id||consent!=='granted')return;window['ga-disable-'+id]=false;
  if(loaded){gtag('consent','update',{analytics_storage:'granted'});return;}
  loaded=true;window.gtag=gtag;
  gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
  gtag('js',new Date());gtag('config',id,{send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,page_location:cleanUrl,page_referrer:cleanReferrer,cookie_path:config.basePath});
  const script=document.createElement('script');script.async=true;script.src='https://www.googletagmanager.com/gtag/js?id='+encodeURIComponent(id);document.head.append(script);
  gtag('event','page_view',{page_location:cleanUrl,page_referrer:cleanReferrer,page_title:document.title});
 }
 window.trackSiteEvent=(name,params={})=>{
  if(!allowed.has(name))return;
  const safe={page_path:path};
  if(['ad_card','comparison','diagnosis','detail','detail_sticky','directory','feature','other'].includes(params.link_location))safe.link_location=params.link_location;
  if(config.serviceIds?.includes(params.service_id))safe.service_id=params.service_id;
  for(const k of ['result_count','check_count'])if(Number.isInteger(params[k])&&params[k]>=0&&params[k]<=10)safe[k]=params[k];
  // In-memory diagnostics only; never transmitted without the configured ID and consent.
  window.siteEventLog.push({event:name,...safe});if(window.siteEventLog.length>30)window.siteEventLog.shift();
  if(id&&consent==='granted')gtag('event',name,{...safe,page_location:cleanUrl,page_referrer:cleanReferrer});
 };
 function reflect(){const el=document.querySelector('#consent-status');if(el)el.textContent=consent==='granted'?'アクセス解析：許可しています':'アクセス解析：許可していません';}
 function choose(value){
  consent=value;try{localStorage.setItem(key,value)}catch{}
  document.querySelector('.consent-notice')?.remove();
  if(value==='granted')start();else if(id){window['ga-disable-'+id]=true;if(loaded)gtag('consent','update',{analytics_storage:'denied'});for(const cookie of document.cookie.split(';')){const name=cookie.trim().split('=')[0];if(name==='_ga'||name==='_ga_'+id.slice(2))document.cookie=name+'=;Max-Age=0;Path='+config.basePath+';SameSite=Lax';}}
  reflect();
 }
 document.addEventListener('click',e=>{
  const control=e.target.closest('[data-consent]');if(control&&id)choose(control.dataset.consent);
  const out=e.target.closest('[data-outbound]');if(out)window.trackSiteEvent('official_click',{service_id:out.dataset.outbound,link_location:out.dataset.location||(out.closest('.ad-card')?'ad_card':out.closest('.feature-ad')?'feature':'other')});
 });
 document.addEventListener('change',e=>{if(e.target.matches('[data-compare]'))window.trackSiteEvent('compare_select',{service_id:e.target.dataset.compare});});
 let calcSent=false;document.querySelector('#calculator')?.addEventListener('input',()=>{if(!calcSent){window.trackSiteEvent('calculator_use');calcSent=true}});
 if(id&&consent==='unset'){const box=document.createElement('aside');box.className='consent-notice';box.setAttribute('aria-label','アクセス解析の選択');box.innerHTML=`<p>閲覧・ボタン操作をアクセス解析に利用してよいですか？診断の入力金額や自由記述は送りません。拒否しても全機能を利用できます。<a href="${config.basePath}privacy/">詳しい取扱い</a></p><button class="site-button" data-consent="denied">許可しない</button><button class="site-button solid" data-consent="granted">許可する</button>`;document.body.append(box);}
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){const menu=document.querySelector('.mobile-menu[open]');if(menu){menu.open=false;menu.querySelector('summary').focus();}}});
 document.querySelector('.mobile-menu')?.addEventListener('click',e=>{if(e.target.closest('a'))e.currentTarget.open=false});
 reflect();start();
 const serviceId=path.match(/\/company\/([a-z]+)\/$/)?.[1];if(serviceId)window.trackSiteEvent('detail_view',{service_id:serviceId});
})();
