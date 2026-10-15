const RAW=`Жалпы ережелер|35
Жүргізушілердің жалпы міндеттері|23
Жаяу жүргіншілердің міндеттері|5
Жолаушылардың міндеттері|3
Ескерту белгілері|4
Басымдық белгілері|8
Тыйым салу белгілері|36
Нұсқау белгілері|16
Ақпараттық белгілер|34
Қызмет белгілері|2
Қосымша ақпарат белгілері (тақтайшалар)|14
Жол белгісі және оның сипаттамалары|40
Бағдаршам және реттеуші сигналдары (1-бөлім)|28
Бағдаршам және реттеуші сигналдары (2-бөлім)|29
Бағдаршам және реттеуші сигналдары (3-бөлім)|29
Арнайы сигналдарды қолдану|20
Авариялық сигнализация мен авариялық тоқтату белгісін қолдану|6
Маневр жасау (1-бөлім)|30
Маневр жасау (2-бөлім)|30
Маневр жасау (3-бөлім)|30
Көлік құралдарының жол бөлігіндегі орналасуы|29
Қозғалыс жылдамдығы|35
Басып озу, қарсы жол жүру|37
Тоқтату және тұрақ (1-бөлім)|28
Тоқтату және тұрақ (2-бөлім)|28
Тоқтату және тұрақ (3-бөлім)|27
Қиылыстардан өту (1-бөлім)|25
Қиылыстардан өту (2-бөлім)|25
Қиылыстардан өту (3-бөлім)|26
Қиылыстардан өту (4-бөлім)|25
Жаяу жүргіншілер өткелі және маршруттық көліктің аялдамалары|5
Темір жол арқылы қозғалыс|14
Автомагистральдар бойынша қозғалыс|15
Тұрғын аймақтарда қозғалыс|13
Маршруттық көлік құралдарының артықшылығы|30
Сыртқы жарық құралдары мен дыбыстық сигналдарды пайдалану|26
Механикалық көлік құралдарын сүйреу|14
Оқу жүрісі|6
Жолаушыларды тасымалдау|16
Жүк тасымалдау|37
Велосипедтер, мопедтер, арба және жануарларды айдаудың қосымша талаптары|27
Көлік құралдарын пайдалануға жіберудің негізгі ережелері|17
Әкімшілік жауапкершілік|7
Медицина (1-бөлім)|33
Медицина (2-бөлім)|32
ӨҚБҚ (1-бөлім)|30
ӨҚБҚ (2-бөлім)|30
ӨҚБҚ (3-бөлім)|31
Тірек-қимыл аппараты бұзылған адамдардың қозғалысын қамтамасыз ету|2
Жол белгілері|60
Маневр жасау|1
Тоқтату және тұрақ|1
Қиылыстардан өту|56
Бағдаршам және реттеуші сигналдары|1
Емтихан (40 кездейсоқ сұрақ)|40`;
const CATS=RAW.split("\n").map((s,i)=>{const [n,c]=s.split("|");return{id:i+1,name:n,total:+c}});
const GROUPS=[
 ["🚦 Общие положения",[1,2,3,4,43]],
 ["🪧 Дорожные знаки",[5,6,7,8,9,10,11,12,50]],
 ["🚥 Светофор и сигналы",[13,14,15,16,17,54]],
 ["↩️ Манёвры и скорость",[18,19,20,21,22,23,51]],
 ["🅿️ Остановка и стоянка",[24,25,26,52]],
 ["✖️ Перекрёстки",[27,28,29,30,31,53]],
 ["🛣️ Особые условия движения",[32,33,34,35,36,37,38,39,40,41]],
 ["🩺 Допуск, медицина, ӨҚБҚ",[42,44,45,46,47,48,49]],
 ["📝 Экзамен",[55]]
];
const KEY="pdd-progress-v1";
let S={target:90,exam:"",att:{}};
try{const r=localStorage.getItem(KEY);if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
let filter="all",open=null,query="";const shut=new Set();
const $=id=>document.getElementById(id);
const dayKey=d=>new Date(d).toISOString().slice(0,10);
const fmt=ts=>new Date(ts).toLocaleDateString("ru-RU",{day:"numeric",month:"short"});
let tt;function toast(m){const t=$("toast");t.textContent=m;t.classList.add("on");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("on"),2200)}

function info(c){
  const a=S.att[c.id]||[];
  if(!a.length)return{st:"none",p:0,last:null,n:0};
  const l=a[a.length-1],p=Math.round(l.c/c.total*100);
  return{st:p>=S.target?"done":"prog",p,last:l,n:a.length};
}
function renderStats(){
  const inf=CATS.map(info),done=inf.filter(x=>x.st==="done").length,st=inf.filter(x=>x.n);
  const pct=Math.round(done/CATS.length*100);
  $("pctAll").textContent=pct+"%";
  $("subAll").textContent=`Освоено ${done} из ${CATS.length} категорий`;
  $("ringFg").style.strokeDashoffset=326.7*(1-pct/100);
  $("laneFill").style.width=pct+"%";$("laneCar").style.left=pct+"%";
  $("stAvg").textContent=st.length?Math.round(st.reduce((s,x)=>s+x.p,0)/st.length)+"%":"—";
  const all=Object.values(S.att).flat();
  $("stAtt").textContent=all.length;
  const days=new Set(all.map(a=>dayKey(a.d)));let k=0,d=new Date();
  if(!days.has(dayKey(d)))d.setDate(d.getDate()-1);
  while(days.has(dayKey(d))){k++;d.setDate(d.getDate()-1)}
  $("stDays").textContent=k;
  const el=$("examLeft");
  if(S.exam){const n=Math.ceil((new Date(S.exam+"T00:00")-new Date().setHours(0,0,0,0))/864e5);
    el.textContent=n>0?`осталось ${n} дн.`:n===0?"экзамен сегодня, удачи!":"дата прошла"}else el.textContent="";
}
function renderWeak(){
  const w=CATS.map(c=>({c,i:info(c)})).filter(x=>x.i.st==="prog").sort((a,b)=>a.i.p-b.i.p).slice(0,3);
  $("weak").hidden=!w.length;
  $("weakList").innerHTML=w.map(x=>`<button data-jump="${x.c.id}"><span>${x.c.id}. ${x.c.name}</span><b>${x.i.p}%</b></button>`).join("");
}
function renderTabs(){
  const inf=CATS.map(info),n=s=>inf.filter(x=>x.st===s).length;
  const T=[["all","Все",CATS.length],["none","Не начато",n("none")],["prog","В процессе",n("prog")],["done","Освоено",n("done")]];
  $("tabs").innerHTML=T.map(t=>`<button class="tab" data-f="${t[0]}" aria-pressed="${filter===t[0]}">${t[1]} · ${t[2]}</button>`).join("");
}
function card(c){
  const i=info(c),a=(S.att[c.id]||[]).slice().reverse().slice(0,6);
  const sub=i.last?`${i.last.c} из ${c.total} · попыток: ${i.n}`:`${c.total} вопросов · не начато`;
  return`<div class="item ${i.st}${open===c.id?" open":""}" id="cat${c.id}">
  <button class="head" data-open="${c.id}" aria-expanded="${open===c.id}"><span class="no">${c.id}</span><span class="tx"><b>${c.name}</b><small>${sub}</small></span><span class="pct">${i.last?i.p+"%":"—"}</span></button>
  <div class="bar"><i style="width:${i.p}%"></i></div>
  <div class="panel"><div class="row"><label for="in${c.id}">Верных ответов из ${c.total}:</label><input type="number" id="in${c.id}" min="0" max="${c.total}" inputmode="numeric"><button class="btn" data-add="${c.id}">Сохранить</button></div>
  ${a.length?`<ul class="hist">${a.map(x=>`<li><span>${fmt(x.d)}</span><span><b>${x.c} из ${c.total}</b> · ${Math.round(x.c/c.total*100)}%</span></li>`).join("")}</ul><button class="btn ghost" style="margin-top:12px" data-undo="${c.id}">Удалить последнюю попытку</button>`:""}
  </div></div>`;
}
function renderList(){
  const q=query.trim().toLowerCase(),searching=q||filter!=="all";let html="";
  for(const [name,ids] of GROUPS){
    const all=ids.map(id=>CATS[id-1]);
    const rows=all.filter(c=>{const i=info(c);return(filter==="all"||i.st===filter)&&(!q||c.name.toLowerCase().includes(q)||String(c.id)===q)});
    if(!rows.length)continue;
    const done=all.filter(c=>info(c).st==="done").length,closed=!searching&&shut.has(name);
    html+=`<section class="group${closed?" shut":""}"><button class="ghead" data-g="${name}" aria-expanded="${!closed}"><h3>${name}</h3><small>${done} из ${all.length}</small><span class="gbar"><i style="width:${done/all.length*100}%"></i></span><span class="chev">▾</span></button><div class="grid">${rows.map(card).join("")}</div></section>`;
  }
  $("groups").innerHTML=html||'<div class="empty">Ничего не найдено. Смени фильтр или поиск.</div>';
}
function renderAll(){renderStats();renderWeak();renderTabs();renderList()}

$("groups").addEventListener("click",e=>{
  const g=e.target.closest("[data-g]"),o=e.target.closest("[data-open]"),ad=e.target.closest("[data-add]"),un=e.target.closest("[data-undo]");
  if(g){const n=g.dataset.g;shut.has(n)?shut.delete(n):shut.add(n);renderList()}
  if(o){const id=+o.dataset.open;open=open===id?null:id;renderList();if(open){const f=$("in"+id);f&&f.focus({preventScroll:true})}}
  if(ad){const id=+ad.dataset.add,c=CATS[id-1],f=$("in"+id),v=parseInt(f.value,10);
    if(isNaN(v)||v<0||v>c.total){f.style.borderColor="#d33";f.focus();toast(`Введи число от 0 до ${c.total}`);return}
    (S.att[id]=S.att[id]||[]).push({c:v,d:Date.now()});save();
    const p=Math.round(v/c.total*100);open=null;renderAll();
    toast(p>=S.target?`Освоено! ${v} из ${c.total} 🎉`:`Сохранено: ${p}%. Ещё немного!`)}
  if(un){const id=+un.dataset.undo;S.att[id].pop();if(!S.att[id].length)delete S.att[id];save();renderAll();toast("Попытка удалена")}
});
$("groups").addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.matches("input[type=number]")){const b=e.target.closest(".panel").querySelector("[data-add]");b&&b.click()}});
$("weak").addEventListener("click",e=>{const j=e.target.closest("[data-jump]");if(!j)return;
  open=+j.dataset.jump;filter="all";query="";$("q").value="";const n=GROUPS.find(g=>g[1].includes(open))[0];shut.delete(n);renderAll();
  const el=$("cat"+open);el.scrollIntoView({behavior:"smooth",block:"center"});$("in"+open).focus({preventScroll:true})});
$("tabs").addEventListener("click",e=>{const t=e.target.closest("[data-f]");if(t){filter=t.dataset.f;renderAll()}});
$("q").addEventListener("input",e=>{query=e.target.value;renderList()});
$("target").value=S.target;
$("target").addEventListener("change",e=>{let v=parseInt(e.target.value,10);if(isNaN(v))v=90;S.target=Math.min(100,Math.max(50,v));e.target.value=S.target;save();renderAll()});
$("examDate").value=S.exam;
$("examDate").addEventListener("change",e=>{S.exam=e.target.value;save();renderStats()});
$("theme").addEventListener("click",()=>{
  const r=document.documentElement,dark=r.dataset.theme?r.dataset.theme==="dark":matchMedia("(prefers-color-scheme:dark)").matches;
  r.dataset.theme=dark?"light":"dark";try{localStorage.setItem(KEY+"-theme",r.dataset.theme)}catch(e){}});
try{const t=localStorage.getItem(KEY+"-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}
$("reset").addEventListener("click",()=>{if(confirm("Удалить весь прогресс? Это нельзя отменить.")){S.att={};save();renderAll();toast("Прогресс сброшен")}});
$("exp").addEventListener("click",async()=>{
  const t=CATS.map(c=>{const i=info(c);return`${c.id}. ${c.name}: ${i.last?i.last.c+"/"+c.total+" ("+i.p+"%)":"не начато"}`}).join("\n");
  try{await navigator.clipboard.writeText(t);toast("Скопировано в буфер обмена")}catch(e){toast("Не удалось скопировать")}});
renderAll();
