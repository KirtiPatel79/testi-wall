import { NextResponse } from "next/server";

const EMBED_STYLES = `
.tw-embed-root{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;width:100%}
.tw-grid{columns:min(280px,100%);column-gap:1.25rem}
.tw-grid .tw-card{break-inside:avoid;page-break-inside:avoid;margin-bottom:1.25rem}
.tw-list{display:flex;flex-direction:column;gap:1rem}
.tw-carousel{display:flex;flex-wrap:nowrap;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;scroll-behavior:smooth;padding:.5rem 0 1rem;min-width:0;-webkit-overflow-scrolling:touch}
.tw-carousel-viewport{overflow:hidden}
.tw-carousel-container{display:flex;margin-left:-1rem}
.tw-carousel-slide{flex:0 0 min(340px,85vw);min-width:0;padding-left:1rem}
.tw-carousel-slide .tw-card{width:100%}
.tw-carousel::-webkit-scrollbar{height:6px}
.tw-carousel::-webkit-scrollbar-track{background:rgba(0,0,0,.05);border-radius:3px}
.tw-carousel::-webkit-scrollbar-thumb{background:rgba(0,0,0,.2);border-radius:3px}
.tw-dark .tw-carousel::-webkit-scrollbar-track{background:rgba(255,255,255,.08)}
.tw-dark .tw-carousel::-webkit-scrollbar-thumb{background:rgba(255,255,255,.2)}
.tw-card{border-radius:12px;padding:1.25rem 1.5rem;background:#fff;color:#0f172a;border:1px solid #e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.06);transition:box-shadow .2s,transform .2s;position:relative;flex-shrink:0}
.tw-card:hover{box-shadow:0 4px 12px rgba(0,0,0,.08)}
.tw-carousel .tw-card{scroll-snap-align:start}
.tw-dark .tw-card{background:#1e293b;border-color:#334155;color:#e2e8f0;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.tw-dark .tw-card:hover{box-shadow:0 4px 12px rgba(0,0,0,.3)}
.tw-card-quote{font-size:2rem;line-height:1;opacity:.25;position:absolute;top:.75rem;left:1rem;font-family:Georgia,serif}
.tw-dark .tw-card-quote{opacity:.2}
.tw-text{font-size:15px;line-height:1.6;white-space:pre-wrap;margin:0;padding-left:1.5rem;color:#475569}
.tw-dark .tw-text{color:#94a3b8}
.tw-stars{display:flex;align-items:center;gap:2px;margin:.75rem 0;padding-left:1.5rem}
.tw-star{position:relative;display:inline-block;width:18px;height:18px;line-height:1}
.tw-star-empty{color:#cbd5e1}
.tw-star-fill{position:absolute;left:0;top:0;overflow:hidden;color:#f59e0b;white-space:nowrap}
.tw-dark .tw-star-empty{color:#475569}
.tw-dark .tw-star-fill{color:#fbbf24}
.tw-rating-value{font-size:13px;font-weight:600;color:#b45309;margin-left:6px}
.tw-dark .tw-rating-value{color:#fcd34d}
.tw-row{display:flex;gap:12px;align-items:center;margin-top:1rem;padding-top:1rem;border-top:1px solid #f1f5f9}
.tw-dark .tw-row{border-top-color:#334155}
.tw-photo{width:44px;height:44px;border-radius:9999px;object-fit:cover;flex-shrink:0}
.tw-avatar{width:44px;height:44px;border-radius:9999px;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:1rem;text-transform:uppercase;flex-shrink:0}
.tw-name{font-weight:600;font-size:15px;color:#0f172a}
.tw-dark .tw-name{color:#f1f5f9}
.tw-carousel-nav{position:absolute;top:50%;transform:translateY(-50%);z-index:10;width:36px;height:36px;border-radius:9999px;display:flex;align-items:center;justify-content:center;cursor:pointer;border:none;transition:opacity .2s}
.tw-carousel-nav:disabled{opacity:.3;cursor:default}
.tw-carousel-nav.prev{left:0}
.tw-carousel-nav.next{right:0}
.tw-carousel-nav.light{background:rgba(255,255,255,.95);color:#334155;box-shadow:0 2px 8px rgba(0,0,0,.15)}
.tw-carousel-nav.dark{background:rgba(30,41,59,.9);color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.3)}
.tw-carousel-wrap{position:relative;padding:0 44px}
`;

const EMBLA_CDN = "https://unpkg.com/embla-carousel@8/embla-carousel.umd.js";

const scriptContent = `(function(){
var script=document.currentScript;
if(!script)return;
var origin=new URL(script.src).origin;
var STYLES=${JSON.stringify(EMBED_STYLES)};
var EMBLA=${JSON.stringify(EMBLA_CDN)};

if(!document.getElementById('tw-embed-styles')){
  var s=document.createElement('style');
  s.id='tw-embed-styles';
  s.textContent=STYLES;
  document.head.appendChild(s);
}

function createCard(item,brandColor,showRating){
  var article=document.createElement('article');
  article.className='tw-card';
  var quote=document.createElement('span');
  quote.className='tw-card-quote';
  quote.textContent='\\"';
  article.appendChild(quote);
  var text=document.createElement('p');
  text.className='tw-text';
  text.textContent=(item.text||'').replace(/^["']|["']$/g,'').trim();
  article.appendChild(text);
  if(showRating&&typeof item.rating==='number'){
    var r=Math.max(1,Math.min(5,Number(item.rating)||0));
    var stars=document.createElement('div');
    stars.className='tw-stars';
    for(var i=0;i<5;i++){
      var fill=Math.max(0,Math.min(1,r-i))*100;
      var star=document.createElement('span');
      star.className='tw-star';
      var empty=document.createElement('span');
      empty.className='tw-star-empty';
      empty.textContent='★';
      var fillEl=document.createElement('span');
      fillEl.className='tw-star-fill';
      fillEl.style.width=fill+'%';
      fillEl.textContent='★';
      star.appendChild(empty);
      star.appendChild(fillEl);
      stars.appendChild(star);
    }
    var rv=document.createElement('span');
    rv.className='tw-rating-value';
    rv.textContent=r.toFixed(1);
    stars.appendChild(rv);
    article.appendChild(stars);
  }
  var row=document.createElement('div');
  row.className='tw-row';
  if(item.photoUrl){
    var img=document.createElement('img');
    img.className='tw-photo';
    img.src=item.photoUrl;
    img.alt=item.name||'Customer';
    img.loading='lazy';
    row.appendChild(img);
  }else{
    var av=document.createElement('div');
    av.className='tw-avatar';
    av.style.backgroundColor=brandColor;
    av.textContent=(item.name||'C').slice(0,1);
    row.appendChild(av);
  }
  var name=document.createElement('div');
  name.className='tw-name';
  name.textContent=item.name||'Customer';
  row.appendChild(name);
  article.appendChild(row);
  return article;
}

function matchHeight(container){
  if(!container)return;
  var cards=container.querySelectorAll('.tw-carousel-slide .tw-card');
  if(!cards.length)return;
  var maxH=0;
  for(var i=0;i<cards.length;i++){var h=cards[i].offsetHeight;if(h>maxH)maxH=h;}
  for(var j=0;j<cards.length;j++){cards[j].style.minHeight=maxH+'px';}
}

function loadEmbla(){
  return new Promise(function(resolve){
    if(typeof EmblaCarousel!=='undefined'){resolve(EmblaCarousel);return}
    var s=document.createElement('script');
    s.src=EMBLA;
    s.onload=function(){resolve(window.EmblaCarousel);};
    document.head.appendChild(s);
  });
}

function render(container,data,opts){
  var items=data.testimonials||[];
  var theme=opts.theme||(data.project&&data.project.theme)||'light';
  var raw=opts.layout||(data.project&&data.project.layout)||'grid';
  var layout=String(raw||'').toLowerCase()||'grid';
  var brandColor=(data.project&&data.project.brandColor)||'#0ea5e9';
  var showRating=opts.showRating!==false;
  var autoplay=typeof opts.autoplay==='boolean'?opts.autoplay:!!(data.project&&data.project.carouselAutoplay===true);
  var isDark=theme==='dark';
  container.className='tw-embed-root'+(isDark?' tw-dark':'');
  container.dataset.theme=theme;
  container.dataset.layout=layout;
  if(items.length===0){
    container.innerHTML='<p class="tw-text">No testimonials yet.</p>';
    return;
  }
  if(layout==='carousel'){
    var wrap=document.createElement('div');
    wrap.className='tw-carousel-wrap';
    var viewport=document.createElement('div');
    viewport.className='tw-carousel-viewport';
    var cont=document.createElement('div');
    cont.className='tw-carousel-container';
    items.forEach(function(item){
      var slide=document.createElement('div');
      slide.className='tw-carousel-slide';
      slide.appendChild(createCard(item,brandColor,showRating));
      cont.appendChild(slide);
    });
    viewport.appendChild(cont);
    wrap.appendChild(viewport);
    var prevBtn=document.createElement('button');
    prevBtn.className='tw-carousel-nav prev '+(isDark?'dark':'light');
    prevBtn.setAttribute('aria-label','Previous');
    prevBtn.innerHTML='‹';
    var nextBtn=document.createElement('button');
    nextBtn.className='tw-carousel-nav next '+(isDark?'dark':'light');
    nextBtn.setAttribute('aria-label','Next');
    nextBtn.innerHTML='›';
    wrap.appendChild(prevBtn);
    wrap.appendChild(nextBtn);
    container.appendChild(wrap);
    function runMatchHeight(){
      requestAnimationFrame(function(){matchHeight(container);});
    }
    runMatchHeight();
    setTimeout(runMatchHeight,150);
    loadEmbla().then(function(EmblaCarousel){
      var embla=EmblaCarousel(viewport,{align:'start',containScroll:'trimSnaps',loop:true});
      prevBtn.onclick=function(){embla.scrollPrev();};
      nextBtn.onclick=function(){embla.scrollNext();};
      function updateBtns(){prevBtn.disabled=!embla.canScrollPrev();nextBtn.disabled=!embla.canScrollNext();}
      var autoplayTimer=null;
      function stopAutoplay(){
        if(autoplayTimer){clearInterval(autoplayTimer);autoplayTimer=null;}
      }
      function startAutoplay(){
        stopAutoplay();
        if(!autoplay)return;
        autoplayTimer=setInterval(function(){embla.scrollNext();},3500);
      }
      embla.on('select',updateBtns);
      embla.on('init',function(){runMatchHeight();});
      embla.on('reInit',runMatchHeight);
      embla.on('pointerDown',stopAutoplay);
      embla.on('pointerUp',startAutoplay);
      wrap.addEventListener('mouseenter',stopAutoplay);
      wrap.addEventListener('mouseleave',startAutoplay);
      updateBtns();
      startAutoplay();
    });
  }else{
    var wrapper=document.createElement('div');
    wrapper.className=layout==='list'?'tw-list':'tw-grid';
    items.forEach(function(item){wrapper.appendChild(createCard(item,brandColor,showRating));});
    container.appendChild(wrapper);
  }
  if(data.schema){
    var schema=document.createElement('script');
    schema.type='application/ld+json';
    schema.text=JSON.stringify(data.schema);
    container.appendChild(schema);
  }
}

var targets=[];
document.querySelectorAll('[data-testimo-slug]').forEach(function(div){
  targets.push({
    el:div,
    project:div.getAttribute('data-testimo-slug'),
    theme:div.getAttribute('data-theme'),
    layout:div.getAttribute('data-widget'),
    limit:div.getAttribute('data-limit')||'6',
    showRating:(div.getAttribute('data-show-rating')||'true')==='true',
    autoplay:div.getAttribute('data-autoplay')===null?null:div.getAttribute('data-autoplay')==='true'
  });
});
if(script.getAttribute('data-project')){
  var root=document.createElement('section');
  root.className='tw-embed-root';
  script.parentNode.insertBefore(root,script.nextSibling);
  targets.push({
    el:root,
    project:script.getAttribute('data-project'),
    theme:script.getAttribute('data-theme'),
    layout:script.getAttribute('data-layout'),
    limit:script.getAttribute('data-limit')||'6',
    showRating:(script.getAttribute('data-show-rating')||'true')==='true',
    autoplay:script.getAttribute('data-autoplay')===null?null:script.getAttribute('data-autoplay')==='true'
  });
}
targets.forEach(function(t){
  if(!t.project)return;
  var ep=new URL(origin+'/api/public/projects/'+encodeURIComponent(t.project)+'/testimonials');
  ep.searchParams.set('limit',t.limit);
  ep.searchParams.set('includeSchema','true');
  if(t.layout)ep.searchParams.set('layout',t.layout);
  fetch(ep)
    .then(function(r){return r.json();})
    .then(function(d){
      render(t.el,d,{theme:t.theme,layout:t.layout,showRating:t.showRating,autoplay:t.autoplay});
    })
    .catch(function(){t.el.innerHTML='';});
});
})();`;

export async function GET() {
  return new NextResponse(scriptContent, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=600, s-maxage=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
