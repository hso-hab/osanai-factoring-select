// Site-scoped, tab-session-only state. No network or cross-site storage.
(() => {
 const prefix='osanai-factoring-select:ux:v1:';
 window.siteSession={
  get(key){try{return JSON.parse(sessionStorage.getItem(prefix+key)||'null')}catch{return null}},
  set(key,value){try{sessionStorage.setItem(prefix+key,JSON.stringify(value))}catch{}},
  remove(key){try{sessionStorage.removeItem(prefix+key)}catch{}}
 };
})();
