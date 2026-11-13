/* =====================================================================
 *  Shared foreground for every TV screen.
 *
 *   ┌───────────────────────────────────────────────────────────┐
 *   │ POWERED BY mariaDB │  ← customer logos slide left          │  (small banner)
 *   ├──────────────────── brand colour line ────────────────────┤
 *   │                                                    16:42  │
 *   │      mariaDB presents / (Wikipedia globe) Challenge       │
 *   │      … takes turns with short statements …                │
 *   │                                                           │
 *   │                     03 : 12 : 45                          │
 *   └───────────────────────────────────────────────────────────┘
 *
 *  Needs brand.js in <head>. Each page draws only its own background, then loads:
 *    <script src="screen.js" data-theme="dark|light"></script>
 * ===================================================================== */
(() => {
/* ================= EDIT ME ================= */
const CONFIG = {
  revealAt: "19:30",                  // local time of the challenge reveal (24h)
  presents: "presents",               // shown after the MariaDB logo
  countdownLabel: "Reveal in",
  liveText: "The challenge is live.",
  // Statements that take turns with the Challenge title in the middle of the screen.
  // [grey setup line, white punchline]. Every "MariaDB" is drawn as the MariaDB logo.
  statements: [
    ["The world runs on", "MariaDB."],
    ["Your blog?", "MariaDB runs it."],
    ["Ever asked Wikipedia?", "MariaDB gave you the answer."],
    ["Fixed a typo on Wikipedia?", "MariaDB saved it."],
    ["Every Wikipedia article you've read", "was stored in MariaDB."],
    ["Open data, open source.", "Wikipedia runs on MariaDB."],
    ["Want to build with Wikipedia data?", "Start with MariaDB."],
    ["Banking with DBS?", "MariaDB is part of it."],
    ["Deutsche Bank trusts", "MariaDB."],
    ["Samsung SDS halved its database costs", "with MariaDB."],
    ["Nokia's telecom infrastructure?", "Containerized MariaDB."],
    ["30 million Virgin Media O2 users.", "Served by MariaDB."],
    ["Tracking a flight on Flightradar24?", "MariaDB is tracking it too."],
    ["Your favourite open source app?", "Good chance it speaks MariaDB."],
    ["Your online shopping cart?", "Good chance it lives in MariaDB."],
    ["Running Linux?", "MariaDB is one install away."],
    ["Made by the people who made MySQL.", "MariaDB."],
    ["Named after the founder's daughter, Maria.", "MariaDB."],
    ["Open source since 2009.", "MariaDB."],
    ["Free as in freedom.", "MariaDB."],
    ["Know SQL?", "You already know MariaDB."],
    ["Coming from MySQL?", "MariaDB feels like home."],
    ["Leaving Oracle?", "MariaDB has a seat for you."],
    ["Need vector search for AI?", "It's built into MariaDB."],
    ["Building an AI agent?", "Give it memory with MariaDB."],
    ["Billions of rows?", "MariaDB doesn't blink."],
    ["Need it always on?", "MariaDB Galera Cluster."],
    ["Your hackathon idea?", "MariaDB can store it."],
    ["Questions about the challenge?", "Ask the MariaDB team."],
    ["Open source. Open knowledge.", "MariaDB × Wikipedia."],
  ],
  heroSeconds: 12,        // how long the Challenge title stays before the next statement
  statementSeconds: 6,    // how long each statement stays
};
/* =========================================== */

const B = window.BRAND, C = B.colors;
const me = document.currentScript;
const base = me ? me.src.replace(/[^/]*$/, '') : '';
const light = me && me.dataset.theme === 'light';
const T = light
  ? { ink:C.black, ink2:'rgba(12,12,13,.6)', ink3:'rgba(12,12,13,.36)', line:'rgba(12,12,13,.1)', bar:'rgba(255,255,255,.7)', logo:'rgba(12,12,13,.55)' }
  : { ink:'#ffffff', ink2:'rgba(255,255,255,.62)', ink3:'rgba(255,255,255,.34)', line:'rgba(255,255,255,.1)', bar:'rgba(0,0,0,.55)', logo:'rgba(255,255,255,.55)' };

/* fonts from the mariadb.com design: Figtree (headings), Geist (text, numbers), Geist Mono (labels) */
const fonts = document.createElement('link');
fonts.rel = 'stylesheet';
fonts.href = 'https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Geist:wght@200;300;400;500&family=Geist+Mono:wght@400;500&display=swap';
document.head.appendChild(fonts);

const FONT_H = `"Figtree", -apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif`;
const FONT_B = `"Geist", -apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif`;
const FONT_M = `"Geist Mono", ui-monospace, "SF Mono", Menlo, monospace`;

const css = `
[hidden]{display:none !important}
body.sc-idle{cursor:none}
.sc{position:fixed;inset:0;z-index:40;pointer-events:none;color:${T.ink};font-family:${FONT_B};-webkit-font-smoothing:antialiased}

/* banner: small and quiet */
.sc-bar{position:absolute;top:0;left:0;right:0;height:4.6vmin;display:flex;align-items:center;background:${T.bar};
  -webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px)}
.sc-bar::after{content:"";position:absolute;left:0;right:0;bottom:0;height:.22vmin;
  background:linear-gradient(90deg, ${C.cyan} 0 20%, ${C.yellow} 20% 40%, ${C.ultraviolet} 40% 60%, ${C.green} 60% 80%, ${C.flare} 80% 100%);opacity:.85}
.sc-pb{flex:none;display:flex;align-items:center;gap:1.1vmin;padding:0 2.4vmin 0 3vmin}
.sc-pb small{font-family:${FONT_M};font-size:1.05vmin;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:${T.ink3}}
.sc-pb svg{height:1.9vmin;width:auto;fill:${T.ink}}
.sc-div{flex:none;width:1px;height:2.2vmin;background:${T.line}}
.sc-scroll{flex:1;min-width:0;height:100%;overflow:hidden;display:flex;align-items:center;
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 12%,#000 96%,transparent);
          mask-image:linear-gradient(90deg,transparent 0,#000 12%,#000 96%,transparent)}
.sc-track{display:flex;align-items:center;flex:none;will-change:transform;animation:sc-scroll var(--dur,60s) linear infinite}
.sc-item{display:inline-flex;align-items:center;gap:.8vmin;padding:0 2.6vmin;white-space:nowrap;color:${T.logo};
  font-family:${FONT_H};font-size:1.5vmin;font-weight:600;letter-spacing:-.01em}
.sc-item svg{height:1.8vmin;width:auto;fill:currentColor;flex:none}
.sc-item.wm svg{height:1.25vmin}
.sc-item.tx{font-weight:700;letter-spacing:-.02em;font-size:1.6vmin}
@keyframes sc-scroll{to{transform:translateX(-50%)}}

/* clock: just the time */
.sc-clock{position:absolute;top:7vmin;right:3vmin;font-size:2.2vmin;font-weight:300;letter-spacing:.01em;
  font-variant-numeric:tabular-nums;color:${T.ink2}}

/* hero */
.sc-main{position:absolute;top:4.6vmin;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center}
.sc-hero{flex:1;align-self:stretch;position:relative}
.sc-slide{position:absolute;inset:3vmin 0 0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;
  opacity:0;transform:translateY(1.2vmin);transition:opacity .7s ease, transform 0s linear .7s}
.sc-slide.on{opacity:1;transform:none;transition:opacity 1.1s ease .8s, transform 1.5s cubic-bezier(.2,.8,.2,1) .8s}
.sc-stmt .a{font-family:${FONT_H};font-size:6.4vmin;font-weight:500;letter-spacing:-.03em;line-height:1.1;color:${T.ink2}}
.sc-stmt .a,.sc-stmt .b{white-space:nowrap}   /* exactly two rows: setup + punchline */
.sc-stmt .b{margin-top:1.4vmin;font-family:${FONT_H};font-size:8.6vmin;font-weight:600;letter-spacing:-.04em;line-height:1.1}
.sc-logo{display:inline-block;letter-spacing:0;white-space:nowrap}
.sc-logo svg{display:inline-block;height:.96em;width:auto;fill:currentColor;vertical-align:-.16em}
.sc-stmt .b .sc-logo{margin:0 .06em}
.sc-presents{display:flex;align-items:center;gap:1.4vmin;font-family:${FONT_H};font-size:3.4vmin;font-weight:400;
  letter-spacing:-.01em;color:${T.ink2}}
.sc-presents svg{height:4vmin;width:auto;fill:${T.ink};margin-bottom:.3vmin}
.sc-title{margin-top:4vmin;display:flex;align-items:center;gap:3.6vmin}
.sc-wiki{display:flex;flex-direction:column;align-items:center;gap:1.2vmin}
.sc-wiki img{width:16vmin;height:auto;display:block}
.sc-wiki svg{height:2.1vmin;width:calc(2.1vmin * 500 / 85);fill:${T.ink}}
.sc-title h1{font-family:${FONT_H};font-size:14vmin;font-weight:600;letter-spacing:-.045em;line-height:1;padding-bottom:3.3vmin}

/* countdown: label + digits only */
.sc-cd{padding-bottom:7vmin;min-height:21vmin;display:flex;flex-direction:column;align-items:center;justify-content:flex-end}
.sc-cd-label{display:flex;align-items:center;gap:.9vmin;font-family:${FONT_M};font-size:1.4vmin;font-weight:400;
  letter-spacing:.06em;text-transform:uppercase;color:${T.ink3}}
.sc-cd-label::before{content:"";width:.9vmin;height:.9vmin;background:${C.flare}}
.sc-digits{margin-top:1.2vmin;font-size:10vmin;font-weight:200;line-height:1;letter-spacing:-.02em;
  font-variant-numeric:tabular-nums;transition:color 1.2s}
.sc-digits span{color:${T.ink3};margin:0 .6vmin}
.sc-cd.final .sc-digits{color:${light ? C.ultraviolet : C.uvLight}}
.sc-live{display:none;font-family:${FONT_H};font-size:6vmin;font-weight:600;letter-spacing:-.03em}
.sc-cd.done .sc-cd-label,.sc-cd.done .sc-digits{display:none}
.sc-cd.done .sc-live{display:block}

/* one-time entrance */
.sc-in{opacity:0;transform:translateY(1.4vmin);animation:sc-in 1.4s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes sc-in{to{opacity:1;transform:none}}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

const item = l => l.text
  ? `<span class="sc-item tx">${l.name}</span>`
  : l.wordmark
    ? `<span class="sc-item wm"><svg viewBox="${l.vb}" role="img" aria-label="${l.name}"><path d="${l.d}"/></svg></span>`
    : `<span class="sc-item"><svg viewBox="${l.vb}" aria-hidden="true"><path d="${l.d}"/></svg>${l.name}</span>`;
const items = B.bannerLogos.map(item).join('');
const wordmark = `<svg viewBox="357.71336 784.65111 500 85" role="img" aria-label="Wikipedia">${B.wikiWordmark.map(d => `<path d="${d}"/>`).join('')}</svg>`;

const withLogo = s => s.replace(/MariaDB/g, `<span class="sc-logo">${B.svgLockup()}</span>`);

const root = document.createElement('div');
root.className = 'sc';
root.innerHTML = `
  <div class="sc-bar">
    <div class="sc-pb"><small>Powered by</small>${B.svgLockup()}</div>
    <div class="sc-div"></div>
    <div class="sc-scroll"><div class="sc-track">${items}${items}</div></div>
  </div>
  <div class="sc-clock"></div>
  <main class="sc-main">
    <div class="sc-hero">
      <div class="sc-slide on">
        <div class="sc-presents sc-in" style="animation-delay:.2s">${B.svgLockup()}${CONFIG.presents}</div>
        <div class="sc-title sc-in" style="animation-delay:.45s">
          <div class="sc-wiki"><img src="${base}assets/wikipedia-globe.svg" alt="">${wordmark}</div>
          <h1>Challenge</h1>
        </div>
      </div>
      ${CONFIG.statements.map(([a, b]) => `<div class="sc-slide sc-stmt"><div class="a">${withLogo(a)}</div><div class="b">${withLogo(b)}</div></div>`).join('')}
    </div>
    <div class="sc-cd sc-in" style="animation-delay:.8s">
      <div class="sc-cd-label">${CONFIG.countdownLabel}</div>
      <div class="sc-digits"><b>00</b><span>:</span><b>00</b><span>:</span><b>00</b></div>
      <div class="sc-live">${CONFIG.liveText}</div>
    </div>
  </main>`;
document.body.appendChild(root);

/* banner speed: calm and constant on any screen size */
const track = root.querySelector('.sc-track');
const setSpeed = () => {
  const half = track.scrollWidth / 2, u = Math.min(innerWidth, innerHeight) / 1080;
  track.style.setProperty('--dur', Math.max(20, half / (36 * u)) + 's');
};
setSpeed(); addEventListener('resize', setSpeed);
if(document.fonts) document.fonts.ready.then(setSpeed);

/* keep every statement on two rows: shrink a row that is wider than the screen allows */
const fitRows = () => {
  const max = innerWidth * .88;
  root.querySelectorAll('.sc-stmt .a, .sc-stmt .b').forEach(el => {
    el.style.fontSize = '';
    const w = el.scrollWidth;
    if(w > max) el.style.fontSize = (parseFloat(getComputedStyle(el).fontSize) * max / w) + 'px';
  });
};
fitRows(); addEventListener('resize', fitRows);
if(document.fonts) document.fonts.ready.then(fitRows);

/* middle: Challenge title, then a statement, then the title again, … (fade out, then fade in) */
const slides = [...root.querySelectorAll('.sc-slide')];
const order = CONFIG.statements.flatMap((_, i) => [0, i + 1]);
let step = 0;
function nextSlide(){
  const cur = order[step % order.length];
  slides.forEach((el, i) => el.classList.toggle('on', i === cur));
  step++;
  setTimeout(nextSlide, (cur === 0 ? CONFIG.heroSeconds : CONFIG.statementSeconds) * 1000);
}
if(order.length) nextSlide();

/* clock */
const clk = root.querySelector('.sc-clock');
const tick = () => clk.textContent = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
tick(); setInterval(tick, 1000);

/* countdown: runs until revealAt, then stops and stays on the "live" message */
const cd = root.querySelector('.sc-cd');
const [H, M, S] = cd.querySelectorAll('.sc-digits b');
const [rh, rm] = CONFIG.revealAt.split(':').map(Number);
const target = new Date(); target.setHours(rh, rm, 0, 0);
const pad = n => String(n).padStart(2, '0');
let timer = null;
function update(){
  const left = Math.ceil((target - Date.now()) / 1000);
  if(left <= 0){
    if(timer) clearInterval(timer);
    cd.classList.remove('final'); cd.classList.add('done');
    return true;
  }
  H.textContent = pad(Math.floor(left / 3600));
  M.textContent = pad(Math.floor(left % 3600 / 60));
  S.textContent = pad(left % 60);
  cd.classList.toggle('final', left <= 60);
  return false;
}
if(!update()) timer = setInterval(update, 250);

/* fullscreen (F or double-click) + hide the cursor when idle */
const toggleFs = () => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen();
addEventListener('keydown', e => { if(e.key === 'f' || e.key === 'F') toggleFs(); });
addEventListener('dblclick', toggleFs);
let idleT;
addEventListener('mousemove', () => {
  document.body.classList.remove('sc-idle');
  clearTimeout(idleT); idleT = setTimeout(() => document.body.classList.add('sc-idle'), 2000);
});
document.body.classList.add('sc-idle');
})();
