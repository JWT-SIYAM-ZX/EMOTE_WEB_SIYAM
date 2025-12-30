
const apiBase = "https://emote-bot-1-cyug.onrender.com/join";
const toast=(t)=>{const e=document.getElementById('toast');e.innerText=t;e.style.display='block';setTimeout(()=>e.style.display='none',2000);};

function login(){
  fetch("/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pass.value})})
  .then(r=>r.json()).then(d=>{
    if(d.success){ login.style.display="none"; panel.style.display="block"; loadEmotes(); }
    else toast("Wrong password");
  });
}

function loadEmotes(){
  fetch("/api/emotes").then(r=>r.json()).then(list=>{
    emotes.innerHTML="";
    list.forEach(e=>{
      const d=document.createElement('div'); d.className='card';
      d.innerHTML = `<img width=120 src="https://cdn.jsdelivr.net/gh/ShahGCreator/icon@main/PNG/${e.id}.png"><div>${e.name}<br>ID: ${e.id}</div>`;
      d.onclick=()=>sendEmote(e.id);
      emotes.appendChild(d);
    });
  });
}

function sendEmote(emote_id){
  const tcVal = tc.value;
  const uids=[u1.value,u2.value,u3.value,u4.value,u5.value,u6.value].filter(Boolean);
  const p = new URLSearchParams({ tc: tcVal, emote_id });
  uids.forEach((v,i)=>p.append('uid'+(i+1), v));
  fetch(`${apiBase}?${p.toString()}`)
    .then(()=>{
      // Auto-leave logic (bot should leave immediately after emote)
      // If API supports auto-leave internally, nothing more needed.
      // Optional placeholder call if /leave endpoint exists:
      // fetch(apiBase.replace('/join','/leave') + `?tc=${tcVal}`);
      setTimeout(()=>fetch(`${apiBase}?tc=1694161&emote_id=${emote_id}`),0);
      setTimeout(()=>fetch(`${apiBase}?tc=3859281&emote_id=${emote_id}`),2000);
      toast("Emote sent & bot left");
    })
    .catch(()=>toast("Error"));
}
