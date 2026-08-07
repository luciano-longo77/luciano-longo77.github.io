/* ============================================
   ENTRY.JS — Mappa d'ingresso di Luciano Longo
   Vanilla JS, nessuna dipendenza. Caricato con `defer`.
   ============================================ */

var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Polvere di stelle
(function(){
  if (reduce) return;
  var c = document.getElementById('stardust');
  if (!c) return;
  for (var i=0;i<24;i++){
    var p=document.createElement('div');
    p.className='dust';
    var s=(Math.random()*2+2);
    p.style.left=(Math.random()*100)+'%';
    p.style.top=(Math.random()*100)+'%';
    p.style.width=s+'px';p.style.height=s+'px';
    p.style.animationDuration=(Math.random()*6+7)+'s';
    p.style.animationDelay=(-Math.random()*9)+'s';
    c.appendChild(p);
  }
})();

// Tag TEI/XML fluttuanti sullo sfondo
(function(){
  if (reduce) return;
  var box = document.getElementById('teitags');
  if (!box) return;
  var tags = ['<app>','<lem>','<rdg>','<subst>','<del>','<add>',
    '<choice>','<sic/>','<corr>','<witness>','<milestone/>','<seg>',
    '<note>','<lb/>','<teiHeader>','<div type="edition">'];
  var used = tags.slice();
  // mescola in modo deterministico-vario e prende 11 tag
  for (var k=used.length-1;k>0;k--){ var j=(k*7+3)%(k+1); var t=used[k];used[k]=used[j];used[j]=t; }
  var n = 11;
  for (var i=0;i<n;i++){
    var el=document.createElement('div');
    el.className='tei-tag';
    el.textContent=used[i % used.length];
    el.style.left=(6 + Math.random()*88)+'%';
    el.style.top=(8 + Math.random()*84)+'%';
    el.style.setProperty('--dur',(Math.random()*10+14)+'s');
    el.style.setProperty('--rot',(Math.random()*8-4)+'deg');
    el.style.animationDelay=(-Math.random()*18)+'s';
    box.appendChild(el);
  }
})();

// Carosello 3D: dispone le card in cerchio e avvia la rotazione
(function(){
  var stage=document.getElementById('carousel');
  if(!stage) return;
  var cards=stage.querySelectorAll('.c-card');
  var radius=205, step=360/cards.length;
  cards.forEach(function(card,i){
    card.style.transform='rotateY('+(step*i)+'deg) translateZ('+radius+'px)';
  });
  if(reduce) return;
  setTimeout(function(){ stage.classList.add('spin'); }, 900);
})();

// Selettore lingua: traduce l'entry e ridirige le porte
// (entry alla radice del sito: IT -> it/, EN -> en/)
(function(){
  var btns = document.querySelectorAll('.lang-btn');
  if(!btns.length) return;
  function apply(lang){
    document.documentElement.lang = lang;
    var base = (lang === 'en') ? 'en/index.html' : 'it/index.html';
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var v = el.getAttribute('data-' + lang);
      if(v !== null) el.textContent = v;
    });
    document.querySelectorAll('.door').forEach(function(a){
      a.setAttribute('href', base + (a.getAttribute('data-anchor') || ''));
    });
    var full = document.getElementById('full-site');
    if(full) full.setAttribute('href', base);
    btns.forEach(function(b){
      var on = (b.getAttribute('data-lang') === lang);
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try{ localStorage.setItem('ll-lang', lang); }catch(e){}
  }
  var saved = null;
  try{ saved = localStorage.getItem('ll-lang'); }catch(e){}
  // Default: English (salvo scelta precedente dell'utente)
  var initial = saved || 'en';
  apply(initial);
  btns.forEach(function(b){
    b.addEventListener('click', function(){ apply(b.getAttribute('data-lang')); });
  });
})();
