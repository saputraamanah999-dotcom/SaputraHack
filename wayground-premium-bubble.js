(function(){
if(document.getElementById('bh-panel'))return;
var d=document.createElement('div');
d.id='bh-panel';
d.style.cssText='position:fixed;top:10px;right:10px;width:260px;background:#111;border:2px solid #0f0;border-radius:10px;padding:10px;color:#0f0;font-family:arial;z-index:999999;box-shadow:0 0 20px #0f0;';
d.innerHTML='<div style="display:flex;justify-content:space-between;margin-bottom:8px;"><span style="color:#ff0;">🔥BOYHACK</span><span id="bh-close" style="background:#f00;color:#fff;padding:0 8px;border-radius:5px;cursor:pointer;">X</span></div><input id="bh-pin" type="text" placeholder="PIN" style="width:100%;margin-bottom:8px;padding:5px;background:#000;color:#0f0;border:1px solid #0f0;border-radius:5px;"><button id="bh-join" style="width:100%;margin-bottom:8px;padding:8px;background:#0f0;color:#000;border:none;border-radius:5px;">JOIN</button><div style="display:flex;gap:5px;margin-bottom:8px;"><button id="bh-scan" style="flex:1;padding:8px;background:#00f;color:#fff;border:none;border-radius:5px;">SCAN</button><button id="bh-highlight" style="flex:1;padding:8px;background:#0f0;color:#000;border:none;border-radius:5px;">HIGHLIGHT</button></div><div style="display:flex;gap:5px;margin-bottom:8px;"><button id="bh-auto" style="flex:1;padding:8px;background:#ff0;color:#000;border:none;border-radius:5px;">AUTO</button><button id="bh-stop" style="flex:1;padding:8px;background:#f44;color:#fff;border:none;border-radius:5px;">STOP</button></div><div style="background:#000;padding:5px;border-radius:5px;margin-bottom:8px;"><span>Delay: <span id="bh-delay-val">2s</span></span><input type="range" id="bh-delay" min="0" max="5" step="0.5" value="2" style="width:100%;"></div><div id="bh-result" style="background:#000;border:1px solid #333;border-radius:5px;padding:5px;max-height:150px;overflow-y:auto;font-size:11px;"></div><div style="margin-top:5px;font-size:10px;color:#888;text-align:center;">Soal:<span id="bh-count">0</span> Status:<span id="bh-status">SIAP</span></div>';
document.body.appendChild(d);

var s={soal:[],auto:null,delay:2000};

document.getElementById('bh-close').onclick=function(){if(s.auto)clearInterval(s.auto);d.remove();};

document.getElementById('bh-join').onclick=function(){
var pin=document.getElementById('bh-pin').value;
if(!pin)return;
document.querySelectorAll('input[type="text"]').forEach(i=>i.value=pin);
setTimeout(()=>{document.querySelectorAll('button').forEach(b=>{if(b.innerText.toLowerCase().includes('join'))b.click();});},500);
};

document.getElementById('bh-scan').onclick=function(){
document.getElementById('bh-status').innerText='SCAN...';
var h=[];
if(window._questions&&window._questions.length){
h=window._questions.map((q,i)=>({no:i+1,soal:q.text||'Soal '+(i+1),opsi:q.options||[],jawaban:q.answer||0}));
}else{
var q=document.querySelector('[data-testid="question-text"],.question');
if(q){
var o=document.querySelectorAll('[data-testid="option"],.option');
var ops=[];
o.forEach(o=>ops.push(o.innerText));
if(ops.length)h.push({no:1,soal:q.innerText,opsi:ops,jawaban:-1});
}}
s.soal=h;
document.getElementById('bh-count').innerText=h.length;
var html='';
h.forEach(q=>{
html+='<div style="margin-bottom:8px;border-bottom:1px solid #333;">';
html+='<div style="color:#ff0;">'+q.no+'. '+q.soal.substring(0,40)+'</div>';
q.opsi.forEach((opt,i)=>{
var b=(i===q.jawaban);
html+='<div style="margin-left:8px;color:'+(b?'#0f0':'#aaa')+';">';
html+=(b?'✅ ':'○ ')+String.fromCharCode(65+i)+'. '+opt.substring(0,30);
if(b)html+=' ⬅️';
html+='</div>';
});
html+='</div>';
});
document.getElementById('bh-result').innerHTML=html||'❌ Tidak ada soal';
document.getElementById('bh-status').innerText='READY';
};

document.getElementById('bh-highlight').onclick=function(){
s.soal.forEach(q=>{
if(q.jawaban>=0&&q.opsi[q.jawaban]){
document.querySelectorAll('[data-testid="option"],.option').forEach(el=>{
if(el.innerText.includes(q.opsi[q.jawaban].substring(0,15))){
el.style.border='3px solid #0f0';
el.style.boxShadow='0 0 10px #0f0';
}});
}});
alert('✅ Highlight!');
};

document.getElementById('bh-auto').onclick=function(){
if(!s.soal.length)return alert('Scan dulu!');
if(s.auto)clearInterval(s.auto);
document.getElementById('bh-status').innerText='AUTO';
s.auto=setInterval(()=>{
var qa=document.querySelector('[data-testid="question-text"],.question');
if(!qa)return;
var t=qa.innerText;
for(var i=0;i<s.soal.length;i++){
var q=s.soal[i];
if(t.includes(q.soal.substring(0,15))){
if(q.jawaban>=0){
var jawab=q.opsi[q.jawaban];
document.querySelectorAll('[data-testid="option"],.option').forEach(el=>{
if(el.innerText.includes(jawab.substring(0,15))){
setTimeout(()=>el.click(),s.delay);
}});
}
break;
}}
},3000);
};

document.getElementById('bh-stop').onclick=function(){
if(s.auto){clearInterval(s.auto);s.auto=null;}
document.getElementById('bh-status').innerText='STOP';
};

document.getElementById('bh-delay').oninput=function(e){
var v=parseFloat(e.target.value).toFixed(1);
document.getElementById('bh-delay-val').innerText=v+'s';
s.delay=v*1000;
};

console.log('✅ BOYHACK SIAP');
})();
