const stack = document.getElementById("stack");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const restartBtn = document.getElementById("restart");
const toggle = document.getElementById("toggle");
const root = document.documentElement;

const BLOCK_HEIGHT = 28;

let blocks = [];
let current = null;
let direction = 1;
let speed = 2;
let score = 0;
let playing = false;
let offsetY = 0;
let inputEnabled = false;

function gameWidth() {
  return stack.clientWidth;
}

function createBlock(width, y) {
  const el = document.createElement("div");
  el.className = "block";
  el.style.width = width + "px";
  el.style.left = (gameWidth() - width) / 2 + "px";
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
  if (!playing || !current) return;

  current.x += speed * direction;

  if (current.x <= 0 || current.x + current.width >= gameWidth()) {
    direction *= -1;
  }

  current.el.style.left = current.x + "px";

  requestAnimationFrame(update);
}

function drop() {
  if (!playing || !inputEnabled || overlay.classList.contains("hidden") === false) {
    return;
  }

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
  inputEnabled = false;
  overlay.classList.remove("hidden");
}

function reset() {
  stack.innerHTML = "";
  blocks = [];
  current = null;
  direction = 1;
  speed = 2;
  score = 0;
  offsetY = 0;

  scoreEl.textContent = "0";
  stack.style.transform = "translateY(0)";
  overlay.classList.add("hidden");

  playing = true;
  inputEnabled = false;

  spawn();
  update();

  // enable input only after first frame
  requestAnimationFrame(() => {
    inputEnabled = true;
  });
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

/* START GAME */
reset();
