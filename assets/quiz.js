// トリセツ占い研究所 共通診断エンジン（window.QUIZ の設定を読みこむ）
(function(){
const C=window.QUIZ, $=id=>document.getElementById(id);
const IMG=p=>"../assets/img/"+p+".webp";
let i=0, ans=[];
function stars(){const s=$("stars");for(let n=0;n<70;n++){const e=document.createElement("i");e.style.left=Math.random()*100+"%";e.style.top=Math.random()*100+"%";e.style.animationDelay=(Math.random()*3)+"s";if(Math.random()<.2){e.style.width=e.style.height="3px";e.style.background="#e8c46e"}s.appendChild(e);}}
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.toggle("on",s.id===id));window.scrollTo({top:0,behavior:"smooth"});}
function render(){
 const [q,opts]=C.Q[i];
 $("qno").textContent=`Q${i+1} / ${C.Q.length}`;
 $("pbar").style.width=(i/C.Q.length*100)+"%";
 $("qt").textContent=q;
 $("noxsay").textContent=C.NOX[i]||"";
 $("back").hidden=i===0;
 const box=$("opts"); box.innerHTML="";
 [0,1,2,3].sort((a,b)=>((a*3+i*3)%4)-((b*3+i*3)%4)).forEach(k=>{
  const [t,label]=opts[k];const b=document.createElement("button");b.className="opt";b.textContent=label;
  if(ans[i]===t)b.classList.add("picked");
  b.onclick=()=>{b.classList.add("picked");ans[i]=t;setTimeout(()=>{if(i<C.Q.length-1){i++;render();}else{finish();}},180);};
  box.appendChild(b);});
}
function finish(){$("pbar").style.width="100%";show("s-load");setTimeout(result,1500);}
function result(){
 const sc={A:0,B:0,C:0,D:0}; ans.forEach(a=>sc[a]++);
 const max=Math.max(...Object.values(sc)), k=Object.keys(sc).filter(x=>sc[x]===max);
 const type=k.length===1?k[0]:(k.includes(ans[ans.length-1])?ans[ans.length-1]:k[0]);
 const t=C.T[type];
 $("rk").textContent=type;$("rname").textContent=t.name;$("rsub").textContent=t.sub;
 $("rimg").src=IMG(t.img);$("rimg").alt=t.name;$("rdesc").textContent=t.desc;
 $("rfeat").innerHTML=t.feat.map(x=>`<li>${x}</li>`).join("");
 $("rtipsh").textContent=C.tipsTitle;
 $("rtips").innerHTML=t.tips.map(x=>`<li>${x}</li>`).join("");
 $("rmatch").innerHTML=t.match.map(x=>`<li>${x}</li>`).join("");
 $("rwho").textContent=t.who;$("rsay").textContent=t.say;
 $("rscores").innerHTML=Object.keys(C.T).map(x=>{const p=Math.round(sc[x]/C.Q.length*100);return `<div class="row"><span>${x} ${C.T[x].name}</span><div class="bar"><b style="width:${p}%"></b></div><em>${p}%</em></div>`}).join("");
 $("sharetext").value=`${C.title}の結果は…\n「${t.name}（${t.sub.replace("通称：","")}）」でした！\n${location.origin+location.pathname}\n#トリセツ診断 @torisetsu_uranai_lab`;
 show("s-res");
}
document.addEventListener("DOMContentLoaded",()=>{
 stars();
 $("start").onclick=()=>{i=0;ans=[];render();show("s-q");};
 $("back").onclick=()=>{if(i>0){i--;render();}};
 $("retry").onclick=()=>show("s-top");
 $("copy").onclick=async()=>{const ta=$("sharetext");try{await navigator.clipboard.writeText(ta.value);$("copy").textContent="コピーしました！";}catch(e){ta.select();$("copy").textContent="選択しました（長押しでコピー）";}setTimeout(()=>$("copy").textContent="結果の文章をコピー",2000);};
});
})();
