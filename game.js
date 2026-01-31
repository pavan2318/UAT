const stack = document.getElementById("stack");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const restartBtn = document.getElementById("restart");
const toggle = document.getElementById("toggle");
const root = document.documentElement;

const BLOCK_HEIGHT = 28;

let blocks;
let current;
let direction;
let speed;
let score;
let playing;
let offsetY;
let initialized;

function gameWidth() {
  return stack.clientWidth;
}

function createBlock(width, y) {
  const el = document.createElement("div");
  el.className = "block";
  el.style.width = width + "px";
  el.style.bottom = y + "px";
  stack.appendChild(el);
  return el;
}

function spawn() {
  const width = blocks.length ? blocks.at(-1).width : gameWidth() * 0.75;
  const y = blocks.length * BLOCK_HEIGHT;

  current = {
    el: createBlock(width, y),
    width,
    x: (gameWidth() - width) / 2
  };
}

function update() {
  if (!playing) return;

  current.x += speed * direction;

  if (current.x <= 0 || current.x + current.width >= gameWidth()) {
    direction *= -1;
  }

  current.el.style.left = current.x + "px";

  requestAnimationFrame(update);
}

function drop() {
  if (!playing || !initialized || !current) return;

  if (!blocks.length) {
    blocks.push({ ...current });
    score++;
    scoreEl.textContent = score;
    spawn();
    return;
  }

  const prev = blocks.at(-1);
  const overlap = Math.min(
    current.x + current.width,
    prev.x + prev.width
  ) - Math.max(current.x, prev.x);

  if (overlap <= 0) {
    end();
    return;
  }

  current.x = Math.max(current.x, prev.x);
  current.width = overlap;

  current.el.style.left = current.x + "px";
  current.el.style.width = current.width + "px";

  blocks.push({ ...current });

  score++;
  scoreEl.textContent = score;
  speed += 0.15;

  offsetY = Math.max(
    0,
    blocks.length * BLOCK_HEIGHT - stack.clientHeight / 2
  );

  stack.style.transform = `translateY(${-offsetY}px)`;

  spawn();
}

function end() {
  playing = false;
  overlay.classList.remove("hidden");
}

function reset() {
  stack.innerHTML = "";
  blocks = [];
  current = null;
  direction = 1;
  speed = 2;
  score = 0;
  playing = true;
  offsetY = 0;
  initialized = false;

  scoreEl.textContent = "0";
  stack.style.transform = "translateY(0)";
  overlay.classList.add("hidden");

  spawn();
  initialized = true;
  update();
}

/* INPUT */
document.addEventListener("click", drop);
document.addEventListener("keydown", e => {
  if (e.code === "Space") drop();
});

restartBtn.onclick = reset;

/* THEME */
root.setAttribute("data-theme", "light");
toggle.textContent = "Dark";

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  root.setAttribute("data-theme", "dark");
  toggle.textContent = "Light";
}

toggle.onclick = () => {
  const isDark = root.getAttribute("data-theme") === "dark";
  root.setAttribute("data-theme", isDark ? "light" : "dark");
  toggle.textContent = isDark ? "Dark" : "Light";
};

/* START */
reset();
