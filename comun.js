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

  // audio del hero
  var PLAY='<svg class="ic ic-fill" style="width:15px;height:15px;margin-left:2px"><use href="#i-play"/></svg>';
  var PAUSE='<svg class="ic" style="width:15px;height:15px;stroke-width:2"><use href="#i-pause"/></svg>';
  var box=document.getElementById('audiobox'),aud=document.getElementById('aud'),ico=document.getElementById('aico');
  if(box&&aud){
    aud.addEventListener('error',function(){box.style.display='none';});
    box.addEventListener('click',function(){
      if(aud.paused){aud.play().then(function(){ico.innerHTML=PAUSE;}).catch(function(){box.style.display='none';});}
      else{aud.pause();ico.innerHTML=PLAY;}
    });
    aud.addEventListener('ended',function(){ico.innerHTML=PLAY;});
    aud.load();
    setTimeout(function(){if(aud.networkState===aud.NETWORK_NO_SOURCE)box.style.display='none';},1200);
  }
})();
