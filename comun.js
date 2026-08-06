(function(){
  var bar=document.getElementById('bar');
  function fitBar(){
    if(!bar)return;
    document.body.style.paddingTop = window.innerWidth>=720 ? bar.offsetHeight+'px' : '0';
  }
  fitBar();
  window.addEventListener('resize',fitBar);
  if(document.fonts&&document.fonts.ready){document.fonts.ready.then(fitBar);}

  var prog=document.getElementById('prog');
  function onScroll(){
    if(!prog)return;
    var h=document.documentElement.scrollHeight-window.innerHeight;
    prog.style.width=(h>0?(window.scrollY/h)*100:0)+'%';
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
  },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv').forEach(function(el){io.observe(el);});

  // fotos de materiales que todavia no fueron cargadas: muestran un marco elegante en vez de romperse
  document.querySelectorAll('.gitem img').forEach(function(img){
    img.addEventListener('error',function(){
      var it=img.closest('.gitem');
      if(it){it.classList.add('vacio');}
      img.remove();
    });
  });

  // si una captura de testimonio todavia no esta subida, se oculta la seccion entera
  document.querySelectorAll('.tst .shot img').forEach(function(img){
    function ocultar(){var s=img.closest('section'); if(s){s.style.display='none';}}
    img.addEventListener('error',ocultar);
    if(img.complete&&img.naturalWidth===0){ocultar();}
  });

  // audio del hero: reproductor embebido, suena en la misma pagina
  var PLAY='<svg class="ic ic-fill" style="margin-left:3px"><use href="#i-play"/></svg>';
  var PAUSE='<svg class="ic" style="stroke-width:2.2"><use href="#i-pause"/></svg>';
  var box=document.getElementById('audiobox'),aud=document.getElementById('aud'),
      ico=document.getElementById('aico'),fill=document.getElementById('afill'),tlab=document.getElementById('atime');
  if(box&&aud){
    var dur=0;
    function mmss(s){s=Math.max(0,Math.floor(s||0));return Math.floor(s/60)+':'+('0'+(s%60)).slice(-2);}
    function label(){
      if(!tlab)return;
      if(aud.paused&&!aud.currentTime){tlab.textContent='Te lo grabé yo'+(dur?' · '+mmss(dur):'');}
      else{tlab.textContent=mmss(aud.currentTime)+(dur?' / '+mmss(dur):'');}
    }
    aud.addEventListener('loadedmetadata',function(){ if(isFinite(aud.duration)){dur=aud.duration;} label(); });
    aud.addEventListener('timeupdate',function(){ if(fill&&dur){fill.style.width=(aud.currentTime/dur*100)+'%';} label(); });
    aud.addEventListener('ended',function(){ ico.innerHTML=PLAY; aud.currentTime=0; if(fill){fill.style.width='0%';} label(); });
    aud.addEventListener('pause',function(){ico.innerHTML=PLAY;});
    aud.addEventListener('play',function(){ico.innerHTML=PAUSE;});
    aud.addEventListener('error',function(){box.style.display='none';});
    box.addEventListener('click',function(e){
      e.preventDefault();
      if(aud.paused){aud.play().catch(function(){box.style.display='none';});}
      else{aud.pause();}
    });
    var bar=box.querySelector('.abar');
    if(bar){
      bar.addEventListener('click',function(e){
        e.stopPropagation();
        if(!dur)return;
        var r=bar.getBoundingClientRect();
        aud.currentTime=Math.min(dur,Math.max(0,(e.clientX-r.left)/r.width*dur));
        if(aud.paused){aud.play().catch(function(){});}
      });
    }
    aud.load();
    setTimeout(function(){if(aud.networkState===aud.NETWORK_NO_SOURCE)box.style.display='none';},1500);
  }
})();
