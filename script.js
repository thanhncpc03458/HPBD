const config = window.BIRTHDAY_CONFIG;
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const defaultRecipient = "người đặc biệt của bạn";
const recipientInput = $("#recipient-input");
const nameGate = $("#name-gate");
const gateForm = $("#gate-form");
const gateName = $("#gate-name");
const gateError = $("#gate-error");
const birthdayApp = $("#birthday-app");
const updateRecipient = (recipient) => {
  const name = recipient.trim() || defaultRecipient;
  $$("[data-recipient]").forEach((el) => (el.textContent = name));
  document.title = `${name === defaultRecipient ? "Một vũ trụ nhỏ" : `Dành cho ${name}`} · Chúc mừng sinh nhật`;
};
recipientInput.value = config.recipient === defaultRecipient ? "" : config.recipient;
updateRecipient(config.recipient);
recipientInput.addEventListener("input", (event) => updateRecipient(event.target.value));
document.body.classList.add("gate-locked");
gateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = gateName.value.trim();
  if (!name) {
    gateError.classList.add("show");
    gateName.focus();
    return;
  }
  gateError.classList.remove("show");
  recipientInput.value = name;
  updateRecipient(name);
  birthdayApp.setAttribute("aria-hidden", "false");
  nameGate.classList.add("hidden");
  document.body.classList.remove("gate-locked");
  $("#open-surprise").focus();
});
gateName.addEventListener("input", () => gateError.classList.remove("show"));
$$("[data-sender]").forEach((el) => (el.textContent = config.sender));
$$("[data-date]").forEach((el) => (el.textContent = config.birthday));

const typewriter = $("#typewriter");
let typeIndex = 0;
const typeLetter = () => {
  if (typeIndex < config.letter.length) {
    typewriter.textContent += config.letter[typeIndex++];
    window.setTimeout(typeLetter, config.letter[typeIndex - 1] === "." ? 240 : 22);
  }
};

const gallery = $("#gallery");
config.memories.forEach((memory, index) => {
  const item = document.createElement("button");
  item.className = `polaroid polaroid-${index + 1}`;
  item.innerHTML = `<span class="photo-frame"><img src="${memory.image}" alt="${memory.caption}" loading="lazy" /></span><span class="caption">${memory.caption}</span>`;
  item.addEventListener("click", () => {
    $("#lightbox-image").src = memory.image;
    $("#lightbox-image").alt = memory.caption;
    $("#lightbox-caption").textContent = memory.caption;
    $("#lightbox").classList.add("open");
  });
  gallery.appendChild(item);
});
const wishes = $("#wishes-grid");
config.wishes.forEach((wish, index) => {
  const card = document.createElement("button");
  card.className = "wish-card";
  card.innerHTML = `<span class="wish-front"><b>0${index + 1}</b><span>✦</span><small>chạm để khám phá</small></span><span class="wish-back">${wish}</span>`;
  card.addEventListener("click", () => card.classList.toggle("flipped"));
  wishes.appendChild(card);
});

const audio = $("#background-audio");
const musicToggle = $("#music-toggle");
if (config.music) audio.src = config.music;
musicToggle.addEventListener("click", () => {
  if (!config.music) {
    $("#toast").textContent = "Hãy thêm đường dẫn nhạc trong config.js để bật âm thanh.";
    $("#toast").classList.add("show");
    setTimeout(() => $("#toast").classList.remove("show"), 2800);
    return;
  }
  if (audio.paused) { audio.play(); musicToggle.classList.add("playing"); musicToggle.querySelector("span:last-child").textContent = "Bật nhạc"; }
  else { audio.pause(); musicToggle.classList.remove("playing"); musicToggle.querySelector("span:last-child").textContent = "Tắt nhạc"; }
});

const canvas = $("#starfield"), ctx = canvas.getContext("2d");
let stars = [];
const resizeCanvas = () => { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); stars = Array.from({ length: Math.min(150, Math.floor(innerWidth / 8)) }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, r: Math.random() * 1.4 + .2, a: Math.random(), s: Math.random() * .008 + .002 })); };
const paintStars = () => { ctx.clearRect(0, 0, innerWidth, innerHeight); stars.forEach((star) => { star.a += star.s; const alpha = .3 + Math.abs(Math.sin(star.a)) * .7; ctx.fillStyle = `rgba(255,235,194,${alpha})`; ctx.beginPath(); ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2); ctx.fill(); }); requestAnimationFrame(paintStars); };
addEventListener("resize", resizeCanvas); resizeCanvas(); paintStars();

$("#open-surprise").addEventListener("click", () => $("#magic").scrollIntoView({ behavior: "smooth" }));
$("#gift-box").addEventListener("click", () => {
  $("#gift-box").classList.add("opened"); $("#magic-message").classList.add("visible");
  burst($("#gift-box").getBoundingClientRect().left + 70, $("#gift-box").getBoundingClientRect().top + 40);
});
$$("[data-candle]").forEach((candle) => candle.addEventListener("click", () => {
  candle.classList.add("blown"); if ($$("[data-candle].blown").length === 3) { $("#candle-hint").textContent = "Điều ước của bạn đang bay đến những vì sao ✦"; $("#final-message").classList.add("visible"); burst(innerWidth / 2, innerHeight / 2); }
}));

const burst = (x, y) => {
  for (let i = 0; i < 22; i++) {
    const particle = document.createElement("i"); particle.className = "burst-particle"; particle.style.left = `${x}px`; particle.style.top = `${y}px`; particle.style.setProperty("--x", `${(Math.random() - .5) * 260}px`); particle.style.setProperty("--y", `${(Math.random() - .5) * 260}px`); particle.style.background = i % 2 ? "#f5c980" : "#f08fa5"; document.body.appendChild(particle); setTimeout(() => particle.remove(), 1100);
  }
};

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add("in-view");
  if (entry.target.id === "letter" && !typewriter.textContent) setTimeout(typeLetter, 700);
}), { threshold: .22 });
$$(".scene").forEach((scene) => observer.observe(scene));
const sections = $$(".scene"), navDots = $$(".chapter-nav a");
addEventListener("scroll", () => { const current = sections.reduce((active, section) => window.scrollY >= section.offsetTop - innerHeight * .42 ? section.id : active, sections[0].id); navDots.forEach((dot) => dot.classList.toggle("active", dot.hash === `#${current}`)); });
$("#lightbox-close").addEventListener("click", () => $("#lightbox").classList.remove("open"));
$("#lightbox").addEventListener("click", (event) => { if (event.target.id === "lightbox") $("#lightbox").classList.remove("open"); });
addEventListener("pointermove", (event) => { const glow = $(".cursor-glow"); glow.style.transform = `translate(${event.clientX - 160}px, ${event.clientY - 160}px)`; });
