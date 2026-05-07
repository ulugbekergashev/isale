const { useState, useEffect, useRef } = React;
const { motion, useScroll, useTransform, useInView, AnimatePresence } = window.framerMotion || window.Motion || {};

const TG_LINK = "https://t.me/isale_marketing";
const goCTA = (e) => {
  if(e) e.preventDefault();
  const f = document.getElementById("form");
  if(f){
    const y = f.getBoundingClientRect().top + window.scrollY - 20;
    window.scrollTo({top:y, behavior:"smooth"});
  } else {
    window.open(TG_LINK, "_blank", "noopener");
  }
};
const goTG = (e) => { if(e) e.preventDefault(); window.open(TG_LINK, "_blank", "noopener"); };

// ---------- Error Boundary ----------
class ErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={hasError:false};}
  static getDerivedStateFromError(){return {hasError:true};}
  render(){
    if(this.state.hasError) return (
      <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0A0A0A",color:"#F5F5F0",fontFamily:"sans-serif",textAlign:"center",padding:"20px"}}>
        <div>
          <div style={{fontSize:"48px",marginBottom:"16px"}}>⚠</div>
          <h2 style={{fontSize:"24px",marginBottom:"8px"}}>Xatolik yuz berdi</h2>
          <p style={{color:"#9A9A92",marginBottom:"20px"}}>Sahifani yangilang yoki Telegram'ga yozing</p>
          <a href={TG_LINK} style={{color:"#D4FF3F"}}>@isale_marketing →</a>
        </div>
      </div>
    );
    return this.props.children;
  }
}

const REEL_COMMENTS = ["🔥","💯","🚀","❤️","👏","🙌","😍","💪","⚡","🎯"];

// ---------- helpers ----------
const Reveal = ({children, delay=0, y=40, className=""}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-10% 0px -10% 0px" });
  return (
    <motion.div
      ref={ref}
      initial={{opacity:0, y}}
      animate={inView?{opacity:1,y:0}:{}}
      transition={{duration:.7, ease:[0.22,1,0.36,1], delay}}
      className={className}
    >{children}</motion.div>
  );
};

const RevealLine = ({children, delay=0}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-10% 0px" });
  return (
    <span ref={ref} className="block overflow-hidden">
      <motion.span
        className="block"
        initial={{y:"110%"}}
        animate={inView?{y:0}:{}}
        transition={{duration:.85, ease:[0.22,1,0.36,1], delay}}
      >{children}</motion.span>
    </span>
  );
};

// ---------- Top nav ----------
const TopBar = () => (
  <header className="fixed top-0 inset-x-0 z-50" role="banner">
    <div className="px-5 md:px-10 pt-4 pb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {/* New Logo */}
        <div className="flex flex-col justify-center leading-none select-none">
          <div className="text-[20px] font-bold tracking-tight text-white">
            iSale
          </div>
          <div className="text-[6.5px] font-semibold tracking-[0.45em] text-[#D4FF3F] mt-1 ml-[2px]">
            MARKETING
          </div>
        </div>
        <span className="hidden md:inline text-[12px] mono uppercase tracking-[0.14em] text-[#5A5A52] ml-2">/ Direct Response Studio</span>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-[#9A9A92] text-[12px] mono uppercase tracking-[0.14em]" aria-label="Asosiy navigatsiya">
        <a href="#proof" className="hover:text-[#D4FF3F]">Natijalar</a>
        <a href="#offer" className="hover:text-[#D4FF3F]">Paket</a>
        <a href="#faq" className="hover:text-[#D4FF3F]">FAQ</a>
        <a onClick={goCTA} href={TG_LINK} className="px-3 py-1.5 bg-[#D4FF3F] text-black hover:translate-y-[-1px] transition" aria-label="Joy band qilish — formaga o'tish">Joy band qilish →</a>
      </nav>
    </div>
    <div className="glow-line" aria-hidden="true"></div>
  </header>
);

// ---------- 3D Phone / Instagram Reels Scene ----------
const PhoneScene = () => {
  const ref = useRef(null);
  const heartId = useRef(0);
  const commentId = useRef(0);
  const [tilt, setTilt] = useState({x:4, y:-10});
  const [likes, setLikes] = useState(14832);
  const [views, setViews] = useState(284700);
  const [hearts, setHearts] = useState([]);
  const [floatComments, setFloatComments] = useState([]);

  useEffect(()=>{
    const likeTimer = setInterval(()=>{
      setLikes(v => v + Math.floor(Math.random()*4+1));
      setViews(v => v + Math.floor(Math.random()*18+4));
      setHearts(h => {
        const nh = {id:heartId.current++, x:28+Math.random()*22, size:12+Math.random()*14, dur:1.2+Math.random()*.9};
        return [...h.slice(-8), nh];
      });
    }, 1300);
    const commentTimer = setInterval(()=>{
      setFloatComments(c => {
        const nc = {id:commentId.current++, emoji:REEL_COMMENTS[Math.floor(Math.random()*REEL_COMMENTS.length)], x:6+Math.random()*28, dur:1.8+Math.random()*.9};
        return [...c.slice(-6), nc];
      });
    }, 1700);
    return ()=>{ clearInterval(likeTimer); clearInterval(commentTimer); };
  }, []);

  const onMove = (e) => {
    if(!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left)/r.width - 0.5;
    const py = (e.clientY - r.top)/r.height - 0.5;
    setTilt({x: -py*14, y: px*20});
  };
  const onLeave = () => setTilt({x:4, y:-10});

  const PW = 270, PH = 532, DEPTH = 14;

  return (
    <div className="relative w-full max-w-[380px] mx-auto select-none" ref={ref}
      onMouseMove={onMove} onMouseLeave={onLeave} aria-hidden="true">

      {/* background glow */}
      <div style={{
        position:"absolute", inset:0, zIndex:-1, pointerEvents:"none",
        background:"radial-gradient(55% 55% at 52% 45%, rgba(212,255,63,.26) 0%, transparent 100%)",
        filter:"blur(44px)",
      }}/>

      {/* 3D scene viewport */}
      <div style={{perspective:"1300px", perspectiveOrigin:"50% 42%"}} className="flex justify-center py-8">
        <div style={{
          transform:`rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition:"transform .22s cubic-bezier(.22,1,.36,1)",
          transformStyle:"preserve-3d",
          position:"relative",
          width:`${PW}px`, height:`${PH}px`,
        }}>

          {/* ── FRONT FACE — phone body ── */}
          <div style={{
            position:"absolute", inset:0,
            borderRadius:"40px",
            background:"linear-gradient(160deg, #1e1e1c 0%, #080808 100%)",
            border:"1.5px solid rgba(255,255,255,.07)",
            boxShadow:"0 0 0 1px rgba(255,255,255,.03) inset, inset 0 1px 0 rgba(255,255,255,.07)",
          }}>
            {/* screen bezel */}
            <div style={{
              position:"absolute", inset:"12px",
              borderRadius:"30px", overflow:"hidden", background:"#080808",
            }}>
              {/* video background gradient */}
              <div style={{position:"absolute",inset:0,background:"linear-gradient(175deg,#0f1f03 0%,#050e01 45%,#020302 100%)"}}/>

              {/* scan-line texture */}
              <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.1) 3px,rgba(0,0,0,.1) 4px)",pointerEvents:"none",zIndex:2}}/>

              {/* ambient light glow */}
              <div style={{position:"absolute",top:"8%",left:"12%",width:"170px",height:"170px",borderRadius:"50%",background:"radial-gradient(circle,rgba(212,255,63,.09) 0%,transparent 70%)",zIndex:1}}/>
              <div style={{position:"absolute",bottom:"25%",right:"20%",width:"100px",height:"100px",borderRadius:"50%",background:"radial-gradient(circle,rgba(212,255,63,.06) 0%,transparent 70%)",zIndex:1}}/>

              {/* ── status bar ── */}
              <div style={{position:"absolute",top:0,left:0,right:0,padding:"14px 16px 0",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:"10px",color:"rgba(255,255,255,.75)",fontFamily:"JetBrains Mono,monospace",zIndex:10}}>
                <span>9:41</span>
                <div style={{display:"flex",gap:"5px",alignItems:"center"}}>
                  <svg width="15" height="10" viewBox="0 0 16 10" fill="white" opacity=".8">
                    <rect x="0" y="6" width="3" height="4" rx=".5"/>
                    <rect x="4.5" y="4" width="3" height="6" rx=".5"/>
                    <rect x="9" y="2" width="3" height="8" rx=".5"/>
                    <rect x="13.5" y="0" width="2.5" height="10" rx=".5"/>
                  </svg>
                  <svg width="22" height="11" viewBox="0 0 22 11" fill="none" opacity=".8">
                    <rect x=".5" y=".5" width="18" height="10" rx="2.5" stroke="white" strokeWidth="1"/>
                    <rect x="19.5" y="3" width="2" height="5" rx="1" fill="white"/>
                    <rect x="2" y="2" width="13" height="7" rx="1.5" fill="white"/>
                  </svg>
                </div>
              </div>

              {/* ── Reels header ── */}
              <div style={{position:"absolute",top:"26px",left:"16px",right:"16px",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10,paddingTop:"4px"}}>
                <span style={{color:"white",fontSize:"16px",fontWeight:700,fontFamily:"sans-serif",letterSpacing:"-0.02em"}}>Reels</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>

              {/* ── view count ── */}
              <div style={{position:"absolute",top:"60px",left:"12px",display:"flex",alignItems:"center",gap:"4px",zIndex:10}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="2" strokeLinecap="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3" fill="rgba(255,255,255,.6)" stroke="none"/>
                </svg>
                <span style={{color:"rgba(255,255,255,.6)",fontSize:"10px",fontFamily:"JetBrains Mono,monospace"}}>{views.toLocaleString()}</span>
              </div>

              {/* ── flying emoji comments (left) ── */}
              {floatComments.map(c=>(
                <div key={c.id} style={{
                  position:"absolute", left:`${c.x}px`, bottom:"165px",
                  fontSize:"18px", zIndex:15, pointerEvents:"none",
                  animation:`comment-float ${c.dur}s ease-out forwards`,
                }}>{c.emoji}</div>
              ))}

              {/* ── right action buttons ── */}
              <div style={{position:"absolute",right:"10px",bottom:"108px",display:"flex",flexDirection:"column",alignItems:"center",gap:"15px",zIndex:10}}>
                {/* profile avatar */}
                <div style={{width:"34px",height:"34px",borderRadius:"50%",border:"2px solid white",background:"linear-gradient(135deg,#D4FF3F 0%,#6E8A1E 100%)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:"bold",color:"#0a0a0a",flexShrink:0}}>A</div>

                {/* heart + animated count */}
                <div style={{textAlign:"center",position:"relative"}}>
                  <div style={{fontSize:"24px",lineHeight:1,filter:"drop-shadow(0 0 10px rgba(255,50,50,.85))"}}>❤️</div>
                  <div style={{color:"white",fontSize:"10px",marginTop:"3px",fontFamily:"sans-serif",fontWeight:700}}>{likes.toLocaleString()}</div>
                  {hearts.map(h=>(
                    <div key={h.id} style={{
                      position:"absolute", bottom:"100%", right:`${h.x}%`,
                      fontSize:`${h.size}px`,
                      animation:`heart-float ${h.dur}s ease-out forwards`,
                      pointerEvents:"none", zIndex:20,
                    }}>❤️</div>
                  ))}
                </div>

                {/* comment */}
                <div style={{textAlign:"center"}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="white" opacity=".9">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <div style={{color:"white",fontSize:"10px",marginTop:"3px",fontFamily:"sans-serif",fontWeight:700}}>1.2K</div>
                </div>

                {/* share */}
                <div style={{textAlign:"center"}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity=".9">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="none"/>
                  </svg>
                  <div style={{color:"white",fontSize:"10px",marginTop:"3px",fontFamily:"sans-serif",fontWeight:700}}>843</div>
                </div>

                {/* spinning audio disc */}
                <div style={{width:"32px",height:"32px",borderRadius:"50%",background:"linear-gradient(135deg,#D4FF3F 30%,#6E8A1E 100%)",border:"2px solid rgba(255,255,255,.2)",animation:"disc-spin 4s linear infinite",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <div style={{width:"9px",height:"9px",borderRadius:"50%",background:"#080808"}}/>
                </div>
              </div>

              {/* ── bottom caption ── */}
              <div style={{
                position:"absolute", bottom:0, left:0, right:0,
                padding:"52px 12px 18px",
                background:"linear-gradient(0deg,rgba(0,0,0,.92) 0%,transparent 100%)",
                zIndex:10,
              }}>
                <div style={{display:"flex",alignItems:"center",gap:"5px",marginBottom:"4px"}}>
                  <span style={{color:"white",fontSize:"12px",fontWeight:700,fontFamily:"sans-serif"}}>@dr.aziz.nevrolog</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#D4FF3F">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div style={{color:"rgba(255,255,255,.82)",fontSize:"11px",fontFamily:"sans-serif",lineHeight:1.4}}>
                  1 oyda +10,000 obunachi 🚀 <span style={{color:"#D4FF3F"}}>#instagram</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"5px",marginTop:"7px"}}>
                  <div style={{width:"16px",height:"16px",borderRadius:"50%",background:"linear-gradient(135deg,#D4FF3F,#6E8A1E)",animation:"disc-spin 4s linear infinite",flexShrink:0}}/>
                  <span style={{color:"rgba(255,255,255,.55)",fontSize:"10px",fontFamily:"sans-serif",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>Original audio · Isale beat</span>
                </div>
              </div>

              {/* progress bar */}
              <div style={{position:"absolute",bottom:"5px",left:"12px",right:"12px",height:"2px",background:"rgba(255,255,255,.15)",borderRadius:"1px",zIndex:11}}>
                <div style={{height:"100%",width:"62%",background:"rgba(255,255,255,.8)",borderRadius:"1px"}}/>
              </div>
            </div>

            {/* dynamic island / notch */}
            <div style={{position:"absolute",top:"14px",left:"50%",transform:"translateX(-50%)",width:"88px",height:"26px",background:"#000",borderRadius:"13px",zIndex:20}}/>
          </div>

          {/* ── RIGHT SIDE FACE ── */}
          <div style={{
            position:"absolute", top:"12px", left:`${PW}px`, bottom:"12px",
            width:`${DEPTH}px`,
            background:"linear-gradient(90deg, #252521, #111110)",
            borderRadius:"0 5px 5px 0",
            transformOrigin:"left center",
            transform:"rotateY(90deg)",
            boxShadow:"inset -2px 0 6px rgba(0,0,0,.6)",
          }}/>

          {/* ── BOTTOM FACE ── */}
          <div style={{
            position:"absolute", top:`${PH}px`, left:"12px", right:"12px",
            height:`${DEPTH}px`,
            background:"linear-gradient(180deg, #1a1a16, #0a0a08)",
            borderRadius:"0 0 5px 5px",
            transformOrigin:"top center",
            transform:"rotateX(-90deg)",
          }}/>
        </div>
      </div>

      {/* floating metric badges */}
      <div className="badge-float" style={{top:"8%",left:"0%"}}>
        <div className="mono text-[10px] uppercase tracking-[0.18em] text-[#5A5A52]">+24h</div>
        <div className="text-base font-semibold accent-text">+842 obunachi</div>
      </div>
      <div className="badge-float b2" style={{bottom:"14%",right:"0%"}}>
        <div className="mono text-[10px] uppercase tracking-[0.18em] text-[#5A5A52]">Engagement</div>
        <div className="text-base font-semibold">8.4%</div>
      </div>
      <div className="badge-float" style={{top:"44%",left:"0%",animationDelay:"-3s"}}>
        <div className="mono text-[10px] uppercase tracking-[0.18em] text-[#5A5A52]">Hook rate</div>
        <div className="text-base font-semibold">62%</div>
      </div>
    </div>
  );
};

// ---------- Live activity card ----------
const LiveCard = () => {
  const [t, setT] = useState(3);
  useEffect(()=>{ const id=setInterval(()=>setT(v=>v+1), 60000); return ()=>clearInterval(id); },[]);
  return (
    <div className="relative w-full max-w-[380px]">
      <div className="absolute -top-3 left-4 mono text-[10px] uppercase tracking-[0.18em] text-[#D4FF3F] live-pill px-2 py-1 rounded-full flex items-center gap-2">
        <span className="dot"></span> Oxirgi natija
      </div>
      <div className="bg-[#0F0F0D] border border-[#1F1F1B] rounded-2xl p-5 pt-7">
        <div className="flex items-start justify-between">
          <div>
            <div className="mono text-[11px] uppercase tracking-[0.15em] text-[#5A5A52]">Mijoz</div>
            <div className="text-xl font-semibold mt-1">@dr.aziz.nevrolog</div>
            <div className="text-[12px] text-[#9A9A92] mt-1">Nevropatolog · Toshkent</div>
          </div>
          <div className="text-right">
            <div className="mono text-[10px] text-[#5A5A52] uppercase">{t} kun oldin</div>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div>
            <div className="mono text-[10px] text-[#5A5A52] uppercase">Davr</div>
            <div className="text-base font-semibold mt-1">1 oy</div>
          </div>
          <div>
            <div className="mono text-[10px] text-[#5A5A52] uppercase">O'sish</div>
            <div className="text-base font-semibold mt-1 accent-text">+10,000</div>
          </div>
          <div>
            <div className="mono text-[10px] text-[#5A5A52] uppercase">ROI</div>
            <div className="text-base font-semibold mt-1">5.8×</div>
          </div>
        </div>
        <div className="mt-4 h-12 relative">
          <svg viewBox="0 0 300 48" className="w-full h-full">
            <defs>
              <linearGradient id="lg" x1="0" x2="1">
                <stop offset="0" stopColor="#D4FF3F" stopOpacity="0"/>
                <stop offset="1" stopColor="#D4FF3F"/>
              </linearGradient>
            </defs>
            <path d="M0,40 C40,38 60,34 90,30 C120,26 140,22 170,16 C200,10 230,8 300,4"
                  fill="none" stroke="url(#lg)" strokeWidth="2"/>
            <circle cx="300" cy="4" r="3" fill="#D4FF3F"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

// ---------- HERO ----------
const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-14 pb-2 px-5 md:px-10 overflow-hidden">
      <div className="halo" style={{left:"-200px",top:"15%"}} aria-hidden="true"></div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto">


        <div className="grid grid-cols-12 gap-6 lg:gap-10 items-center">
          <div className="col-span-12 lg:col-span-7 order-2 lg:order-1">
            <h1 className="display display-tight text-[42px] sm:text-[54px] md:text-[70px] lg:text-[84px] xl:text-[96px] leading-[0.82]">
              <RevealLine>Instagramda</RevealLine>
              <RevealLine delay={.08}>
                <span className="relative">
                  <span className="relative z-10 text-[#D4FF3F]">50,000 obunachi.</span>
                </span>
              </RevealLine>
              <RevealLine delay={.16}><span className="text-[#9A9A92]">Kafolat bilan.</span></RevealLine>
              <RevealLine delay={.24}>4 oyda<span className="accent-text">.</span></RevealLine>
            </h1>

            <Reveal delay={.3}>
              <div className="mt-4 md:mt-6 max-w-lg">
                <p className="text-base md:text-xl text-[#C8C8BE] leading-tight">
                  Har oy minimum <span className="text-[#F5F5F0]">5,000 obunachi to'plashga kafolat</span> beramiz.
                  <span className="block mt-1 text-[#D4FF3F] font-semibold">Kafolatimiz yopilmaguncha pul olinmaydi!</span>
                </p>
              </div>
            </Reveal>

            <Reveal delay={.4}>
              <div className="mt-6 md:mt-8 flex flex-wrap items-center gap-5">
                <a onClick={goCTA} href={TG_LINK} className="btn-primary inline-flex items-center gap-3 px-6 py-4 rounded-xl text-base md:text-lg font-semibold">
                  Bepul strategiya olish
                  <Arrow/>
                </a>
              </div>
            </Reveal>
          </div>

          <div className="col-span-12 lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
            <Reveal delay={.3} className="w-full max-w-[280px] md:max-w-[360px] lg:max-w-[420px]">
              <PhoneScene/>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M2 7.5L5.5 11L12 3.5" stroke="#D4FF3F" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const Arrow = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true"><path d="M4 11H18M18 11L12 5M18 11L12 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);

// ---------- Marquee divider ----------
const Marquee = ({items, accent=false}) => (
  <div className={`overflow-hidden border-y hairline ${accent?'bg-[#D4FF3F] text-black':'bg-[#0A0A0A] text-[#F5F5F0]'}`} aria-hidden="true">
    <div className="marquee py-5">
      {[...items, ...items, ...items].map((it,i)=>(
        <span key={i} className={`text-2xl md:text-4xl display tracking-tight ${accent?'':'text-[#F5F5F0]'}`}>
          {it} <span className={accent?'text-black/40 mx-6':'text-[#3A3A32] mx-6'}>✦</span>
        </span>
      ))}
    </div>
  </div>
);

// ---------- PROBLEM ----------
const Problem = () => {
  const pains = [
    "Har kuni video qilaman — 200 ta ko'rish ham olmayman",
    "SMM agentliklar ko'p pul oladi, natija — nol",
    "Reklama beraman, obunachi keladi-yu, ketib qoladi",
  ];
  return (
    <section className="relative px-5 md:px-10 min-h-screen flex flex-col justify-center py-12">
      <div className="grid grid-cols-12 gap-6 items-center max-w-[1400px] mx-auto w-full">
        <div className="col-span-12 md:col-span-5">
          <div className="mono text-[10px] uppercase tracking-[0.18em] text-[#5A5A52] mb-4">(02) Muammo</div>
          <h2 className="display text-[48px] md:text-[64px] lg:text-[80px] leading-[0.9]">Tanish<br/>holatmi?</h2>
          <p className="mt-6 text-lg text-[#9A9A92] max-w-sm leading-relaxed">
            Ko'pchilik "kontent" chiqarish bilan ovora, lekin natija faqat tasodifga bog'liq.
          </p>
        </div>

        <div className="col-span-12 md:col-span-7 grid gap-3">
          {pains.map((p,i)=>(
            <Reveal delay={i*0.08} key={i}>
              <div className="border hairline bg-[#0E0E0C] p-5 md:p-8 flex items-start gap-5 group hover:border-[#D4FF3F]/40 transition">
                <div className="mono text-[10px] text-[#5A5A52] tracking-[0.18em] uppercase mt-2 shrink-0">0{i+1}</div>
                <p className="text-lg md:text-xl lg:text-2xl leading-tight max-w-3xl">
                  <span className="line-through decoration-[#FF5C2A] decoration-[2px] opacity-60 group-hover:opacity-100 transition">{p}</span>
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal>
        <div className="mt-12 md:mt-16 text-center">
          <p className="display text-[32px] md:text-[56px] lg:text-[72px] leading-[0.9]">
            Chunki sizga <span className="text-[#5A5A52]">"kontent" emas —</span><br/>
            <span className="relative inline-block mt-3">
              <span className="relative z-10 text-[#D4FF3F]">TIZIM</span>
              <span aria-hidden className="absolute inset-x-0 bottom-2 h-3 bg-[#D4FF3F]/20 -z-0"></span>
            </span> kerak.
          </p>
        </div>
      </Reveal>
    </section>
  );
};

// ---------- SOLUTION ----------
const Solution = () => {
  const steps = [
    {n:"01", t:"STRATEGIYA", d:"Sizning nichengizni o'rganamiz. Auditoriya, raqobatchi, kontent yo'nalishi.", tag:"Hafta 1"},
    {n:"02", t:"SENARIY",   d:"Professional ssenarist har kun virusbop video uchun matn yozadi.", tag:"Hafta 2 →"},
    {n:"03", t:"MONTAJ",    d:"Professional montajchi — hook'i kuchli, retention'i yuqori videolar.", tag:"Doimiy"},
    {n:"04", t:"KAFOLAT",   d:"Har oy 5,000 obunachi. Yopilmasa — bepul ishlaymiz.", tag:"Oxirigacha", accent:true},
  ];
  return (
    <section id="solution" className="relative px-5 md:px-10 min-h-screen flex flex-col justify-center py-16 border-t hairline">
      <div className="max-w-[1400px] mx-auto w-full">
        <div className="grid grid-cols-12 gap-6 mb-12">
          <div className="col-span-12 md:col-span-6">
            <div className="mono text-[10px] uppercase tracking-[0.18em] text-[#5A5A52] mb-4">(03) Yechim</div>
            <h2 className="display text-[48px] md:text-[64px] lg:text-[80px] leading-[0.9]">Bizning tizim — <br/><span className="accent-text">4 qadam</span></h2>
          </div>
          <div className="col-span-12 md:col-span-6 md:pt-12">
            <p className="text-lg md:text-xl text-[#9A9A92] max-w-md leading-relaxed">
              Yakka frilanser emas, operator stanok kabi ishlovchi <span className="text-[#F5F5F0]">studiya</span>.
            </p>
          </div>
        </div>

        <div className="relative">
          {steps.map((s,i)=>(
            <Reveal key={s.n} delay={i*0.05}>
              <div className="grid grid-cols-12 gap-6 items-start py-6 md:py-8 border-t hairline group hover:bg-[#D4FF3F]/[0.02] transition">
                <div className="col-span-12 md:col-span-2">
                  <div className={`mono text-[10px] tracking-[0.18em] uppercase ${s.accent?'text-[#D4FF3F]':'text-[#5A5A52]'}`}>{s.tag}</div>
                </div>
                <div className="col-span-3 md:col-span-3">
                  <div className={`display ${s.accent?'accent-text':'num-outline'} leading-none`} style={{fontSize:"clamp(60px,8vw,120px)"}}>
                    {s.n}
                  </div>
                </div>
                <div className="col-span-9 md:col-span-7">
                  <div className="display text-2xl md:text-4xl lg:text-5xl tracking-tight">{s.t}</div>
                  <p className="mt-3 text-base md:text-xl text-[#C8C8BE] max-w-xl leading-snug">{s.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------- PROOF ----------
const Proof = () => {
  const stats = [
    {v:"500M+", k:"Organik ko'rishlar"},
    {v:"1.7M+", k:"Obunachilar"},
    {v:"4 yil", k:"Bozorda tajriba"},
    {v:"100%",  k:"Natija kafolati"},
  ];
  return (
    <section id="proof" className="relative px-5 md:px-10 min-h-screen flex flex-col justify-center py-12 border-t hairline overflow-hidden">
      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        <div className="grid grid-cols-12 gap-6 mb-8">
          <div className="col-span-12">
            <div className="mono text-[10px] uppercase tracking-[0.18em] text-[#5A5A52] mb-4">(04) Natijalar</div>
            <h2 className="display text-[44px] md:text-[60px] lg:text-[72px] leading-[0.9]">
              4 yilda <span className="accent-text">500 million</span> ko'rishlar,<br/>
              va 1.7 million obunachi.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1F1F1B] border hairline mb-12">
          {stats.map((s,i)=>(
            <Reveal delay={i*0.06} key={i}>
              <div className="bg-[#0A0A0A] p-5 md:p-8 text-center h-full flex flex-col justify-center">
                <div className="display tracking-tight text-[#D4FF3F]" style={{fontSize:"clamp(36px,6vw,84px)"}}>{s.v}</div>
                <div className="mono text-[10px] uppercase tracking-[0.18em] text-[#9A9A92] mt-2">{s.k}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="flex justify-center">
            <a onClick={goCTA} href={TG_LINK} className="btn-primary inline-flex items-center gap-3 px-8 py-4 rounded-xl text-lg font-semibold">
              Mening natijam shu yerda paydo bo'lsin <Arrow/>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

// ---------- Video Tile Component ----------
const VideoTile = ({ src, title, client, year, category, span = '', large = false }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  return (
    <div 
      className={`reel-card group ${span} block relative overflow-hidden bg-black border hairline rounded-2xl cursor-pointer`}
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'opacity-100' : 'opacity-60 group-hover:opacity-80 group-hover:scale-105'}`}
      />
      
      {/* Overlay container, hides when playing */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100 group-hover:bg-black/20'}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40"/>
        
        {/* Status indicators */}
        <div className="absolute top-4 left-4 flex items-center gap-2 z-20">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] animate-pulse" />
          <span className="mono text-[9px] uppercase tracking-wider text-white/70">{category}</span>
        </div>
        <div className="absolute top-4 right-4 font-mono text-[9px] text-white/40 z-20">
          {year}
        </div>

        {/* Play Button */}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-16 h-16 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white backdrop-blur-md group-hover:scale-110 group-hover:bg-[#D4FF3F] group-hover:text-black group-hover:border-[#D4FF3F] transition-all duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>

        {/* Info */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 transition-transform duration-500 group-hover:translate-y-[-4px]">
          <div className="mono text-[10px] uppercase tracking-[0.22em] text-[#D4FF3F] mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {client}
          </div>
          <div className={`display ${large ? 'text-3xl md:text-5xl' : 'text-xl md:text-3xl'} leading-[0.9] text-white tracking-tight`}>
            {title}
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Review Video Player ----------
const ReviewVideo = ({ src }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) videoRef.current.play();
      else videoRef.current.pause();
    }
  };

  return (
    <div
      className="w-full aspect-[9/16] bg-black border hairline relative overflow-hidden group/vid cursor-pointer rounded-xl"
      onClick={togglePlay}
    >
      <video
        ref={videoRef}
        src={src}
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={`w-full h-full object-cover transition-all duration-700 ${isPlaying ? 'opacity-100' : 'opacity-60 group-hover/vid:opacity-80 group-hover/vid:scale-105'}`}
      />
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40"/>
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="w-16 h-16 rounded-full bg-black/40 border border-white/20 flex items-center justify-center text-white backdrop-blur-md group-hover/vid:scale-110 group-hover/vid:bg-[#D4FF3F] group-hover/vid:text-black group-hover/vid:border-[#D4FF3F] transition-all duration-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none z-10">
          <div className="w-1.5 h-1.5 rounded-full bg-[#D4FF3F] animate-pulse" />
          <span className="mono text-[9px] uppercase tracking-wider text-white/70">Reels</span>
        </div>
      </div>
    </div>
  );
};

// ---------- TESTIMONIALS ----------
const Testimonials = () => {
  const clients = [
    { handle:"profmedservice",    label:"Prof Med Service",    n:"50,000", mo:"4 oy", cat:"Tibbiyot" },
    { handle:"urolog_saidislom",  label:"Urolog Saidislom",   n:"50,000", mo:"3 oy", cat:"Tibbiyot" },
    { handle:"urolog_jahongir",   label:"Urolog Jahongir",    n:"120,000",mo:"5 oy", cat:"Tibbiyot" },
    { handle:"centralmanclinic",  label:"Central Man Clinic", n:"37,000", mo:"4 oy", cat:"Tibbiyot" },
    { handle:"openshop_uz",       label:"Open Shop UZ",       n:"40,000", mo:"3 oy", cat:"E-commerce" },
    { handle:"dr.aziz.nevrolog",  label:"Dr. Aziz Nevrolog",  n:"10,000", mo:"1 oy", cat:"Tibbiyot" },
    { handle:"umurtqa.markazi",   label:"Umurtqa Markazi",    n:"15,000", mo:"2 oy", cat:"Tibbiyot" },
    { handle:"ginekolog.dildora", label:"Ginekolog Dildora",  n:"27,000", mo:"3 oy", cat:"Tibbiyot" },
  ];

  const reviews = [
    {
      name: "Jahongir To'raxonov",
      handle: "urolog_jahongir",
      result: "120,000 obunachi — 5 oyda",
      cat: "Tibbiyot",
      initials: "JT",
      video: "Jahongirr.mp4",
      text: "Isale.Marketing bilan hamkorlik qilgandan so'ng akkauntim butunlay o'zgardi. Har kuni professional video, har kuni o'sish. 5 oy ichida 120 ming obunachi — bu real natija.",
    },
    {
      name: "Dildora Nuriddinovna",
      handle: "ginekolog.dildora",
      result: "27,000 obunachi — 3 oyda",
      cat: "Tibbiyot",
      initials: "DN",
      video: "on(mrt1.4).mp4",
      text: "Avval ijtimoiy tarmoqqa umid qilmagan edim. Isale jamoasi mening brendimni to'liq qayta qurdi. Endi har oyda yangi bemorlar faqat Instagram orqali kelmoqda.",
    },
    {
      name: "Bobur Mamadaliyev",
      handle: "centralmanclinic",
      result: "37,000 obunachi — 4 oyda",
      cat: "Klinika",
      initials: "BM",
      video: "ren1.mov",
      text: "Kafolat berib ishlashadi — bu eng muhimi. Natija bo'lmasa to'lov yo'q. Biz 4 oy ichida 37 ming obunachiga yetdik va klinikaga tashrif buyuruvchilar soni ikki barobarga oshdi.",
    },
  ];

  return (
    <section id="testimonials" className="border-t hairline overflow-hidden">

      {/* Results scroll strip */}
      <div className="border-b hairline px-8 md:px-14 py-10 bg-[#0A0A08]">
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-[#5A5A52] mb-6">(03) Biz bilan ishlaganlar</div>
        <div className="flex flex-wrap gap-3">
          {clients.map((c,i) => (
            <a
              key={i}
              href={`https://instagram.com/${c.handle}`}
              target="_blank" rel="noopener noreferrer"
              className="group flex items-center gap-3 border hairline bg-[#0E0E0C] px-4 py-3 hover:border-[#D4FF3F]/40 hover:bg-[#0F1206] transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4FF3F]/30 to-[#D4FF3F]/10 border border-[#D4FF3F]/20 flex items-center justify-center mono text-[10px] font-bold text-[#D4FF3F] shrink-0">
                {c.label.charAt(0)}
              </div>
              <div>
                <div className="mono text-[10px] text-[#5A5A52] uppercase tracking-[0.12em]">@{c.handle}</div>
                <div className="font-semibold text-[#F5F5F0] text-sm mt-0.5">
                  <span className="accent-text">{c.n}</span>
                  <span className="text-[#9A9A92]"> / {c.mo}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <div className="px-8 md:px-14 py-16 bg-[#0C0C0A]">
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-[#5A5A52] mb-10">Mijozlar nima deydi</div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((r, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="border hairline bg-[#0E0E0C] p-6 flex flex-col gap-5 hover:border-[#D4FF3F]/30 transition-all duration-300 h-full">

                {/* video */}
                <ReviewVideo src={r.video} />

                {/* quote */}
                <p className="text-sm md:text-base text-[#C8C8BE] leading-relaxed flex-1">
                  "{r.text}"
                </p>

                {/* author */}
                <div className="flex items-center gap-3 pt-5 mt-auto">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4FF3F] to-[#6E8A1E] flex items-center justify-center text-black text-base font-bold">
                      {r.initials}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0C0C0A] border hairline rounded-full flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#D4FF3F"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[#F5F5F0] text-sm truncate">{r.name}</div>
                    <div className="mono text-[10px] uppercase tracking-wider text-[#5A5A52] truncate">@{r.handle}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="mono text-[10px] font-bold text-[#D4FF3F] px-2 py-1 bg-[#D4FF3F]/10 border border-[#D4FF3F]/20 rounded">
                      {r.result.split('—')[0]}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

    </section>
  );
};

// ---------- GUARANTEE ----------
const Guarantee = () => (
  <section className="relative">
    <div className="bg-[#D4FF3F] text-black px-5 md:px-10 py-24 md:py-36 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{backgroundImage:"radial-gradient(#000 1px, transparent 1px)",backgroundSize:"24px 24px"}} aria-hidden="true"></div>
      <div className="relative grid grid-cols-12 gap-6 items-end">
        <div className="col-span-12 md:col-span-7">
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-black/60">(05) Kafolat</div>
          <h2 className="display tracking-tight mt-6" style={{fontSize:"clamp(96px,18vw,320px)",lineHeight:.85}}>
            Kafolat<span className="text-black/30">.</span>
          </h2>
        </div>
        <div className="col-span-12 md:col-span-5">
          <p className="text-2xl md:text-3xl leading-tight font-semibold">
            Har oy 5,000 organik obunachi yetkazib bermasak —
            <span className="bg-black text-[#D4FF3F] px-2"> KEYINGI OYI BEPUL </span>
            ishlaymiz.
          </p>
          <p className="mt-6 text-lg md:text-xl text-black/70">
            Kafolat yopilmaguncha to'lov olinmaydi! Biz natija uchun mas'ulmiz.
          </p>
          <p className="mt-3 text-lg md:text-xl text-black/70">
            <span className="font-semibold text-black">Garant yopilguncha 50 tagacha video</span> chiqaramiz. Har kuni video chiqishi kafolatlanadi.
          </p>
        </div>
      </div>

      {/* three confirmations */}
      <div className="relative mt-16 grid grid-cols-1 md:grid-cols-3 gap-px bg-black/15 border border-black/15">
        {[
          ["01","Yozma shartnoma","Barcha shartlar va kafolatlar yozma kelishuv bilan rasmiylashtiriladi."],
          ["02","Natija kafolati","Belgilangan maqsadga yetmasak — keyingi oy bepul ishlaymiz."],
          ["03","0 ta shikoyat","4 yilda — bironta noroziligi bo'lmagan."],
        ].map(([n,t,d],i)=>(
          <div key={i} className="bg-[#D4FF3F] p-6 md:p-8">
            <div className="mono text-[11px] uppercase tracking-[0.18em] text-black/60">{n}</div>
            <div className="display text-2xl md:text-3xl mt-3">{t}</div>
            <div className="text-base md:text-lg text-black/70 mt-2">{d}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ---------- OFFER ----------
const Offer = () => {
  const includes = [
    "Oyiga 30+ professional video",
    "Virusbop ssenariy (har kun)",
    "Professional montaj + subtitr",
    "Obunachi o'sishi (kafolat bilan)",
    "Haftalik tahlil va hisobot",
    "24/7 Telegram aloqa",
    "Oylik strategiya yangilanishi",
    "Natija bo'lmasa — keyingi oy bepul",
  ];
  return (
    <section id="offer" className="relative min-h-screen flex flex-col justify-center border-t hairline overflow-hidden">

      <div className="grid grid-cols-1 lg:grid-cols-2 h-full min-h-screen">

        {/* LEFT — dark price panel */}
        <div className="relative bg-[#0A0A0A] px-8 md:px-14 flex flex-col justify-center py-16 border-r hairline">
          <div className="halo" style={{left:"-300px", top:"30%"}} aria-hidden="true"></div>
          <div className="relative z-10 max-w-lg">

            <div className="mono text-[10px] uppercase tracking-[0.2em] text-[#5A5A52] mb-8">(06) Paket</div>

            <h2 className="display text-[52px] md:text-[64px] leading-[0.88]">
              Nimani<br/><span className="accent-text">olasiz?</span>
            </h2>

            {/* price */}
            <div className="mt-10 flex items-end gap-4">
              <div className="display leading-none" style={{fontSize:"clamp(72px,11vw,130px)", letterSpacing:"-0.06em"}}>
                $1,500
              </div>
              <div className="mb-3">
                <div className="mono text-[11px] text-[#5A5A52] tracking-[0.2em]">USD / OY</div>
                <div className="mono text-[10px] text-[#3A3A32] tracking-[0.15em] mt-1">MIN. 4 OY</div>
              </div>
            </div>

            <div className="mt-8 h-px bg-gradient-to-r from-[#D4FF3F]/40 via-[#D4FF3F]/10 to-transparent"></div>

            {/* comparison */}
            <div className="mt-8 space-y-3">
              {[
                {t:"Yakka SMM mutaxassis", p:"$800–1,200 / oy", ok:false},
                {t:"Agentlik",            p:"$2,000–5,000 / oy", ok:false},
                {t:"Isale.Marketing",     p:"$1,500 / oy",       ok:true},
              ].map((r,i)=>(
                <div key={i} className={`flex items-center justify-between py-3 px-4 ${r.ok ? 'bg-[#D4FF3F]/10 border border-[#D4FF3F]/30' : 'border border-[#1A1A16]'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`text-lg ${r.ok ? '✓' : ''}`}>
                      {r.ok
                        ? <span className="text-[#D4FF3F]">✓</span>
                        : <span className="text-[#3A3A32]">✗</span>
                      }
                    </span>
                    <span className={`text-sm font-medium ${r.ok ? 'text-[#F5F5F0]' : 'text-[#5A5A52]'}`}>{r.t}</span>
                  </div>
                  <span className={`mono text-[11px] ${r.ok ? 'accent-text' : 'text-[#3A3A32]'}`}>{r.p}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-10">
              <a onClick={goCTA} href={TG_LINK}
                className="btn-primary w-full flex items-center justify-center gap-3 py-5 rounded-xl text-lg font-semibold">
                Joyni band qilish <Arrow/>
              </a>
              </div>
            </div>
          </div>

        {/* RIGHT — accent feature panel */}
        <div className="bg-[#D4FF3F] px-8 md:px-14 flex flex-col justify-center py-16">
          <div className="max-w-lg">

            <div className="mono text-[10px] uppercase tracking-[0.2em] text-black/50 mb-8">Paket ichida nima bor</div>

            <div className="space-y-0">
              {includes.map((it, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className="flex items-center gap-5 py-4 border-b border-black/10 group">
                    <div className="display text-[32px] leading-none text-black/20 shrink-0 w-10 text-right">
                      {String(i+1).padStart(2,'0')}
                    </div>
                    <div className="flex-1 text-base md:text-lg font-semibold text-black leading-tight">{it}</div>
                    <svg className="shrink-0 opacity-0 group-hover:opacity-100 transition" width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="black" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-10 bg-black text-[#D4FF3F] px-6 py-5 flex items-center justify-between">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.18em] text-[#D4FF3F]/60 mb-1">Kafolat</div>
                <div className="display text-2xl leading-tight">Natija bo'lmasa —<br/>keyingi oy bepul</div>
              </div>
              <div className="display text-5xl accent-text">★</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

// ---------- URGENCY ----------
const Urgency = () => {
  const items = [
    {n:"01", t:"Faqat 4 ta joy / oy", d:"Sifatni saqlash uchun. Hozir 1 ta joy bo'sh."},
    {n:"02", t:"5,000 obunachi / kechikkan oy", d:"Har kechikkan oy — raqobatchingizning 5,000 obunachisi. O'sha siz olishi mumkin bo'lgan obunachi."},
    {n:"03", t:"Algoritm har 3 oyda o'zgaradi", d:"Bugungi strategiya 6 oydan keyin ishlamasligi mumkin. Biz hozirgini bilamiz."},
  ];
  return (
    <section className="relative px-5 md:px-10 py-24 md:py-36 border-t hairline">
      <div className="grid grid-cols-12 gap-6 mb-12">
        <div className="col-span-12 md:col-span-7">
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-[#5A5A52]">(07) Urgency</div>
          <h2 className="display h-big mt-6">
            Nega <span className="line-through decoration-[#FF5C2A] decoration-[6px]">keyingi oy</span><br/>
            <span className="accent-text">hozir?</span>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#1F1F1B] border hairline">
        {items.map((it,i)=>(
          <Reveal key={it.n} delay={i*0.08}>
            <div className="bg-[#0A0A0A] p-7 md:p-10 h-full flex flex-col">
              <div className="num-outline" style={{fontSize:"clamp(72px,8vw,140px)"}}>{it.n}</div>
              <div className="display text-2xl md:text-3xl mt-4 leading-tight">{it.t}</div>
              <p className="text-base md:text-lg text-[#9A9A92] mt-4 leading-snug">{it.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

// ---------- FINAL CTA ----------
const FinalCTA = () => (
  <section className="relative px-5 md:px-10 min-h-screen flex flex-col justify-center border-t hairline overflow-hidden">
    <div className="halo" style={{right:"-300px",top:"30%"}} aria-hidden="true"></div>
    <div className="halo" style={{left:"-300px",bottom:"-200px"}} aria-hidden="true"></div>

    <div className="text-center max-w-5xl mx-auto relative w-full">
      <div className="mono text-[10px] uppercase tracking-[0.18em] text-[#5A5A52] mb-8">(08) Yakuniy zarba</div>
      <h2 className="display text-[48px] md:text-[80px] lg:text-[110px] display-tight leading-[0.85]">
        <RevealLine>30 daqiqa suhbat.</RevealLine>
        <RevealLine delay={.08}><span className="accent-text">5,000 obunachi.</span></RevealLine>
        <RevealLine delay={.16}>Yoki pul qaytariladi.</RevealLine>
      </h2>

      <Reveal delay={.5}>
        <div className="mt-12 flex flex-col items-center gap-6">
          <a onClick={goCTA} href={TG_LINK}
            className="btn-primary inline-flex items-center gap-4 px-8 py-5 rounded-xl text-xl md:text-2xl font-semibold"
            aria-label="Bepul strategiya sessiyasini band qilish — formaga o'tish">
            Bepul strategiya sessiyasini band qilish <Arrow/>
          </a>
          <div className="mono text-[11px] md:text-[12px] uppercase tracking-[0.18em] text-[#9A9A92] leading-relaxed">
            Telegram'da yozing → <a href={TG_LINK} className="accent-text ulink">@isale_marketing</a><br/>
            Yoki to'g'ridan-to'g'ri qo'ng'iroq qiling
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

// ---------- FAQ ----------
const FAQ = () => {
  const items = [
    {
      q: "5,000 obunachi kafolatlanganini qanday isbotlaysiz?",
      a: "Yozma shartnoma orqali. Agar belgilangan miqsorga yeta olmasak — keyingi oy xizmat bepul davom etadi. 4 yil faoliyatda birorta mijozdan shikoyat bo'lmagan."
    },
    {
      q: "Mening sohamda ishlaydimi?",
      a: "Tibbiyot, biznes, e-commerce, ta'lim, beauty — barchada natija ko'rsatganmiz. Bepul strategiya sessiyasida sohangizni birgalikda baholaymiz."
    },
    {
      q: "Qancha vaqt ichida natija ko'raman?",
      a: "Aksariyat mijozlarimiz birinchi oyda sezilarli o'sish ko'radi. Eng tez natija — 1 oyda 10,000+ obunachi. O'rtacha — oyiga 5,000+."
    },
    {
      q: "To'lov qanday amalga oshiriladi?",
      a: "To'lov oldindan amalga oshiriladi. Biroq kafolatimiz aniq — natija yopilmasa, keyingi oy xizmat bepul davom etadi. Barcha shartlar yozma shartnomada."
    },
    {
      q: "Mening videolarimda yuzim ko'rinishi kerakmi?",
      a: "Yo'q. Yuzsiz formatlarda ham 8 dan ortiq mijozimizda muvaffaqiyatli ishlatganmiz. Kontent formati siz bilan birgalikda tanlanadi."
    },
    {
      q: "Agar kafolat yopilmasa — keyin nima bo'ladi?",
      a: "Hech narsa kutmaysiz. Keyingi oy avtomatik ravishda bepul davom etamiz — maqsadga yetguncha. Bu bizning mas'uliyatimiz."
    },
  ];

  const [open, setOpen] = React.useState(null);

  return (
    <section id="faq" className="relative border-t hairline overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">

        {/* LEFT sticky label */}
        <div className="lg:col-span-4 px-8 md:px-14 py-16 border-r hairline bg-[#0A0A08] flex flex-col justify-between">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-[#5A5A52] mb-10">(09) FAQ</div>
            <h2 className="display text-[52px] md:text-[64px] leading-[0.88]">
              Savol<br/>bormi<span className="accent-text">?</span><br/>
              <span className="text-[#5A5A52]">Mana</span><br/>javoblar.
            </h2>
            <p className="mt-6 text-base text-[#9A9A92] leading-relaxed max-w-xs">
              Qo'shimcha savollaringiz bo'lsa — biz bilan to'g'ridan-to'g'ri bog'laning.
            </p>
          </div>

          <div className="mt-12">
            <a href={TG_LINK} onClick={goCTA}
              className="btn-primary inline-flex items-center gap-3 px-6 py-4 rounded-xl text-base font-semibold">
              Savolni Telegramda yuboring <Arrow/>
            </a>
          </div>
        </div>

        {/* RIGHT accordion */}
        <div className="lg:col-span-8 px-8 md:px-14 py-16 flex flex-col justify-center">
          <div className="max-w-2xl w-full">
            {items.map((item, i) => (
              <div key={i} className="border-b hairline">
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full py-6 flex items-center gap-5 text-left group"
                  aria-expanded={open === i}
                >
                  <span className="mono text-[11px] tracking-[0.2em] uppercase text-[#3A3A32] shrink-0 w-7 group-hover:text-[#D4FF3F] transition-colors">
                    {String(i+1).padStart(2,'0')}
                  </span>
                  <span className="flex-1 text-lg md:text-2xl font-semibold text-[#F5F5F0] leading-tight group-hover:text-[#D4FF3F] transition-colors">
                    {item.q}
                  </span>
                  <span className={`shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${open === i ? 'bg-[#D4FF3F] border-[#D4FF3F] text-black rotate-45' : 'hairline text-[#5A5A52] group-hover:border-[#D4FF3F]'}`}>
                    <svg width="14" height="14" viewBox="0 0 14 14">
                      <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </span>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: open === i ? 'auto' : 0, opacity: open === i ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="pb-6 pl-12 text-base md:text-lg text-[#9A9A92] leading-relaxed">
                    {item.a}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

// ---------- FOOTER ----------
const Footer = () => (
  <footer className="relative px-5 md:px-10 pt-20 pb-10 border-t hairline" role="contentinfo">
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 md:col-span-6">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-[#5A5A52]">Aloqa</div>
        <ul className="mt-6 space-y-3 text-lg md:text-xl">
          <li>
            <a href="mailto:isalemarketinguz@gmail.com" className="ulink hover:text-[#D4FF3F]">
              isalemarketinguz@gmail.com
            </a>
          </li>
          <li>
            <a href="https://instagram.com/isale.marketing" target="_blank" rel="noopener noreferrer" className="ulink hover:text-[#D4FF3F]">
              Instagram → @isale.marketing
            </a>
          </li>
          <li>
            <a href={TG_LINK} target="_blank" rel="noopener noreferrer" className="ulink hover:text-[#D4FF3F]">
              Telegram → @isale_marketing
            </a>
          </li>
        </ul>
      </div>
      <div className="col-span-12 md:col-span-6">
        <div className="mono text-[11px] uppercase tracking-[0.18em] text-[#5A5A52]">Joylashuv</div>
        <div className="mt-6 text-lg md:text-xl">Toshkent, O'zbekiston</div>
        <div className="text-[#9A9A92] mt-1">UTC+5 · Mon–Sat 09:00 — 21:00</div>
      </div>
    </div>

    <div className="mt-16 md:mt-24 overflow-hidden flex flex-col" aria-hidden="true">
      <div className="display tracking-tighter leading-none font-bold text-white" style={{fontSize:"clamp(100px, 25vw, 400px)", marginLeft:"-1vw"}}>
        iSale
      </div>
      <div className="font-semibold text-[#D4FF3F] leading-none" style={{fontSize:"clamp(24px, 6vw, 100px)", letterSpacing:"0.45em", marginLeft:"1vw", marginTop:"1vw"}}>
        MARKETING
      </div>
    </div>

    <div className="mt-10 pt-6 border-t hairline flex flex-wrap items-center justify-between gap-3 mono text-[11px] uppercase tracking-[0.16em] text-[#5A5A52]">
      <span>© 2026 · Isale.Marketing · Tashkent</span>
      <span className="flex items-center gap-2"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4FF3F]" aria-hidden="true"></span> Sotuvchi landing — direct response</span>
    </div>
  </footer>
);

// ---------- Sticky bottom CTA ----------
const StickyCTA = () => {
  const [show, setShow] = useState(false);
  useEffect(()=>{
    const onScroll = () => {
      const h = window.innerHeight;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - h;
      setShow(y > h*0.6 && y < max - h*0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, {passive:true});
    return ()=>window.removeEventListener("scroll", onScroll);
  },[]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{y:120}} animate={{y:0}} exit={{y:120}}
          transition={{type:"spring",stiffness:260,damping:30}}
          className="md:hidden fixed bottom-0 inset-x-0 z-50 px-3 pb-3"
        >
          <a onClick={goCTA} href={TG_LINK}
            className="btn-primary flex items-center justify-between gap-3 px-5 py-4 rounded-2xl text-base font-semibold shadow-2xl"
            aria-label="Bepul strategiya olish — formaga o'tish">
            <span>Bepul strategiya olish</span>
            <Arrow/>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ---------- CTA Form ----------
const EMPTY_FORM = {name:"", phone:"", insta:"", niche:"", budget:"", goal:""};

const CTAForm = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(()=>{
    try {
      const saved = localStorage.getItem("isale_form_v1");
      return saved ? {...EMPTY_FORM, ...JSON.parse(saved)} : EMPTY_FORM;
    } catch { return EMPTY_FORM; }
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const niches = ["Tibbiyot / klinika","E-commerce / do'kon","Restoran / kafe","Ta'lim / kurs","Beauty / salon","Boshqa"];
  const budgets = ["$1,500 (standart)","$3,000+ (premium)","Hali aniqmas"];
  const goals = ["+5,000 / oy","+10,000 / oy","+25,000+ / oy","Patsient / mijoz oqimi"];

  const set = (k,v) => setData(d=>({...d,[k]:v}));

  useEffect(()=>{
    if(!sent){
      try { localStorage.setItem("isale_form_v1", JSON.stringify(data)); } catch {}
    }
  }, [data, sent]);

  const validatePhone = (p) => /^[\+]?[\d\s\-\(\)]{7,}$/.test(p.trim());
  const validateName  = (n) => n.trim().length >= 2;

  const canNext = (
    (step===0 && validateName(data.name) && validatePhone(data.phone)) ||
    (step===1 && data.niche) ||
    (step===2 && data.budget && data.goal)
  );

  const submit = () => {
    if(submitting || !canNext) return;
    setSubmitting(true);
    setSent(true);
    try { localStorage.removeItem("isale_form_v1"); } catch {}
    setTimeout(()=>{ window.open(TG_LINK,"_blank","noopener"); }, 800);
  };

  return (
    <section id="form" className="relative min-h-screen flex flex-col justify-center border-t hairline overflow-hidden">
      <div className="halo" style={{left:"30%", top:"20%", width:"900px", height:"900px", opacity:.4}} aria-hidden="true"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">

        {/* LEFT — context */}
        <div className="relative px-8 md:px-14 flex flex-col justify-center py-16 border-r hairline bg-[#0A0A08] overflow-hidden">

          {/* decorative glow */}
          <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#D4FF3F]/[0.06] blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 max-w-lg">

            <div className="inline-flex items-center gap-2 border border-[#D4FF3F]/30 bg-[#D4FF3F]/5 px-4 py-2 rounded-full mb-10">
              <span className="pulse-dot inline-block w-2 h-2 rounded-full bg-[#D4FF3F]"></span>
              <span className="mono text-[10px] uppercase tracking-[0.2em] text-[#D4FF3F]">Bepul konsultatsiya</span>
            </div>

            {/* Strong headline */}
            <h2 className="display text-[44px] md:text-[54px] lg:text-[64px] leading-[0.88]">
              Hoziroq
              ma'lumotlaringizni
              qoldiring<span className="accent-text">.</span>
            </h2>

            <div className="mt-8 h-px bg-gradient-to-r from-[#D4FF3F]/50 via-[#D4FF3F]/10 to-transparent w-3/4"></div>

            {/* Value proposition */}
            <div className="mt-8 space-y-4">
              <p className="text-xl md:text-2xl font-semibold text-[#F5F5F0] leading-snug">
                Shaxsiy brendingiz uchun
                <span className="accent-text"> bepul strategiyaga</span> ega bo'ling.
              </p>
              <p className="text-base text-[#9A9A92] leading-relaxed">
                Bizga mos bo'lsangiz — hamkorlikni taklif qilamiz.<br/>
                Mos bo'lmasangiz ham — strategiya sizniki.
              </p>
            </div>

            {/* urgency placeholder removed per user request */}



          </div>
        </div>


        {/* RIGHT — form */}
        <div className="px-8 md:px-14 flex flex-col justify-center py-16 bg-[#0C0C0A]">
          <Reveal className="w-full max-w-lg mx-auto">
            <div className="relative">

              {/* step indicator */}
              <div className="flex items-center gap-3 mb-10">
                {[0,1,2].map(i=>(
                  <React.Fragment key={i}>
                    <div className={`flex items-center gap-2 ${i <= step ? 'text-[#F5F5F0]' : 'text-[#3A3A32]'} transition-colors`}>
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center mono text-[11px] transition-all ${
                        i < step ? 'bg-[#D4FF3F] border-[#D4FF3F] text-black' :
                        i === step ? 'border-[#D4FF3F] text-[#D4FF3F]' :
                        'border-[#2A2A24]'
                      }`}>
                        {i < step ? '✓' : i+1}
                      </div>
                      {!sent && <span className="mono text-[9px] uppercase tracking-[0.14em] hidden sm:inline">
                        {['Aloqa','Soha','Maqsad'][i]}
                      </span>}
                    </div>
                    {i < 2 && <div className={`flex-1 h-px transition-all ${i < step ? 'bg-[#D4FF3F]' : 'bg-[#1F1F1B]'}`}></div>}
                  </React.Fragment>
                ))}
              </div>

              {/* card */}
              <div className="bg-[#0E0E0C] border hairline p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4FF3F]/40 to-transparent"></div>

                <div className="flex items-center justify-between mb-8">
                  <div className="mono text-[11px] uppercase tracking-[0.18em] text-[#5A5A52]">
                    {sent ? "Yuborildi ✓" : `Qadam ${step+1} / 3`}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="pulse-dot inline-block w-1.5 h-1.5 rounded-full bg-[#D4FF3F]"></span>
                    <span className="mono text-[10px] uppercase tracking-[0.14em] text-[#D4FF3F]">1 ta joy bo'sh</span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div key="ok" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}} className="py-12 text-center">
                      <div className="text-5xl mb-4">✅</div>
                      <div className="display text-3xl md:text-4xl">Rahmat, {data.name||"—"}!</div>
                      <p className="mt-4 text-[#9A9A92]">Telegram'ga yo'naltiramiz...</p>
                      <div className="mt-6 inline-flex items-center gap-2 mono text-[11px] uppercase tracking-[0.18em] text-[#D4FF3F]">
                        <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="40 60"/></svg>
                        Yuklanmoqda
                      </div>
                    </motion.div>
                  ) : step===0 ? (
                    <motion.div key="s0" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-5">
                      <div>
                        <label className="field-label mb-2 block" htmlFor="field-name">Ismingiz</label>
                        <input
                          id="field-name"
                          className="field"
                          placeholder="Aziz Karimov"
                          value={data.name}
                          onChange={e=>set("name",e.target.value)}
                          autoComplete="name"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="field-label mb-2 block" htmlFor="field-phone">Telefon raqam</label>
                          <input
                            id="field-phone"
                            className="field"
                            placeholder="+998 90 123 45 67"
                            type="tel"
                            inputMode="tel"
                            value={data.phone}
                            onChange={e=>set("phone",e.target.value)}
                            autoComplete="tel"
                          />
                        </div>
                        <div>
                          <label className="field-label mb-2 block" htmlFor="field-insta">Instagram (ixtiyoriy)</label>
                          <input
                            id="field-insta"
                            className="field"
                            placeholder="@yourhandle"
                            value={data.insta}
                            onChange={e=>set("insta",e.target.value)}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ) : step===1 ? (
                    <motion.div key="s1" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}>
                      <div className="field-label mb-4">Sohangiz qaysi?</div>
                      <div className="flex flex-wrap gap-2" role="group" aria-label="Soha tanlash">
                        {niches.map(n=>(
                          <button
                            key={n} type="button"
                            onClick={()=>set("niche",n)}
                            className={`chip ${data.niche===n?"on":""}`}
                            aria-pressed={data.niche===n}
                          >{n}</button>
                        ))}
                      </div>
                      <div className="mt-6">
                        <label className="field-label mb-2 block" htmlFor="field-desc">Qisqacha (ixtiyoriy)</label>
                        <textarea
                          id="field-desc"
                          className="field min-h-[100px]"
                          placeholder="Akkauntingiz, mahsulotingiz, hozirgi muammo..."
                        />
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="s2" initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}} className="space-y-6">
                      <div>
                        <div className="field-label mb-3">Maqsad</div>
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Maqsad tanlash">
                          {goals.map(g=>(
                            <button
                              key={g} type="button"
                              onClick={()=>set("goal",g)}
                              className={`chip ${data.goal===g?"on":""}`}
                              aria-pressed={data.goal===g}
                            >{g}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="field-label mb-3">Byudjet</div>
                        <div className="flex flex-wrap gap-2" role="group" aria-label="Byudjet tanlash">
                          {budgets.map(b=>(
                            <button
                              key={b} type="button"
                              onClick={()=>set("budget",b)}
                              className={`chip ${data.budget===b?"on":""}`}
                              aria-pressed={data.budget===b}
                            >{b}</button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {!sent && (
                  <div className="mt-8 flex items-center justify-between gap-4">
                    <button type="button" onClick={()=>setStep(s=>Math.max(0,s-1))}
                      disabled={step===0}
                      aria-label="Oldingi qadam"
                      className={`btn-ghost px-5 py-3 rounded-xl text-sm ${step===0?"opacity-20 cursor-not-allowed":""}`}>
                      ← Orqaga
                    </button>
                    {step<2 ? (
                      <button type="button" onClick={()=>canNext && setStep(s=>s+1)}
                        disabled={!canNext}
                        aria-label="Keyingi qadam"
                        className={`btn-primary inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-semibold transition-all ${!canNext?"opacity-30 cursor-not-allowed":"hover:scale-[1.02]"}`}>
                        Keyingisi <Arrow/>
                      </button>
                    ) : (
                      <button type="button" onClick={submit}
                        disabled={!canNext || submitting}
                        aria-label="Formani yuborish"
                        className={`btn-primary inline-flex items-center gap-2 px-7 py-4 rounded-xl text-base font-semibold transition-all ${(!canNext||submitting)?"opacity-30 cursor-not-allowed":"hover:scale-[1.02]"}`}>
                        Yuborish <Arrow/>
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
          </Reveal>
        </div>

      </div>
    </section>
  );

};

// ---------- Animated counter strip ----------
const useCount = (target, dur=2000, run=true) => {
  const [n, setN] = useState(0);
  useEffect(()=>{
    if(!run) return;
    let raf, t0;
    const step = (t)=>{
      if(!t0) t0=t;
      const p = Math.min(1, (t-t0)/dur);
      const eased = 1-Math.pow(1-p,3);
      setN(Math.round(target*eased));
      if(p<1) raf=requestAnimationFrame(step);
    };
    raf=requestAnimationFrame(step);
    return ()=>cancelAnimationFrame(raf);
  },[target,dur,run]);
  return n;
};
const fmt = (n) => n.toLocaleString("en-US");

const CounterStrip = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-20% 0px" });
  const a = useCount(1700000, 2500, inView);
  const b = useCount(500, 2200, inView);
  const c = useCount(8, 1500, inView);
  const d = useCount(0, 1200, inView);
  return (
    <section ref={ref} className="relative px-5 md:px-10 py-20 md:py-28 border-t hairline overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" aria-hidden="true">
        <div className="stamp whitespace-nowrap" style={{fontSize:"clamp(180px,28vw,520px)"}}>RAQAMLAR</div>
      </div>
      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="display tracking-tight shimmer" style={{fontSize:"clamp(40px,6vw,90px)"}}>{fmt(a)}+</div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-[#9A9A92] mt-2">Olib kelingan obunachi</div>
        </div>
        <div>
          <div className="display tracking-tight shimmer" style={{fontSize:"clamp(40px,6vw,90px)"}}>{b}M+</div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-[#9A9A92] mt-2">Organik ko'rishlar</div>
        </div>
        <div>
          <div className="display tracking-tight shimmer" style={{fontSize:"clamp(40px,6vw,90px)"}}>{c}+</div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-[#9A9A92] mt-2">Aktiv mijoz</div>
        </div>
        <div>
          <div className="display tracking-tight shimmer" style={{fontSize:"clamp(40px,6vw,90px)"}}>{d}</div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-[#9A9A92] mt-2">Shikoyatlar (4 yil)</div>
        </div>
      </div>
    </section>
  );
};

// ---------- App ----------
function App(){
  return (
    <main className="relative">
      <TopBar/>
      <Hero/>
      <Problem/>
      <Solution/>
      <CounterStrip/>

      <Proof/>
      <Testimonials/>
      <Guarantee/>
      <Offer/>
      <Urgency/>
      <FinalCTA/>
      <CTAForm/>
      <FAQ/>
      <Footer/>
      <StickyCTA/>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <ErrorBoundary><App/></ErrorBoundary>
);
