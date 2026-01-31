const stack = document.getElementById("stack");
const scoreEl = document.getElementById("score");
const overlay = document.getElementById("overlay");
const restartBtn = document.getElementById("restart");

let blocks = [];
let current;
let direction = 1;
let speed = 2;
let score = 0;
let playing = true;

const GAME_WIDTH = () => stack.clientWidth;
const BLOCK_HEIGHT = 28;

function createBlock(width, y) {
  const el = document.createElement("div");
  el.className = "block";
  el.style.width = width + "px";
  el.style.bottom = y + "px";
  stack.appendChild(el);
  return el;
}

function spawn() {
  const width = blocks.length ? blocks[blocks.length - 1].width : GAME_WIDTH() * 0.8;
  const y = blocks.length * BLOCK_HEIGHT;

  current = {
    el: createBlock(width, y),
    width,
    x: (GAME_WIDTH() - width) / 2
  };

  current.el.classList.add("moving");
}

function update() {
  if (!playing) return;

  current.x += speed * direction;
  if (current.x <= 0 || current.x + current.width >= GAME_WIDTH()) {
    direction *= -1;
  }

  current.el.style.left = current.x + "px";
  requestAnimationFrame(update);
}

function drop() {
  if (!playing) return;

  if (!blocks.length) {
    blocks.push({ ...current });
    score++;
    scoreEl.textContent = score;
    spawn();
    return;
  }

  const prev = blocks[blocks.length - 1];
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
  current.el.classList.remove("moving");

  blocks.push({ ...current });

  score++;
  scoreEl.textContent = score;
  speed += 0.15;

  spawn();
}

function end() {
  playing = false;
  overlay.classList.remove("hidden");
}

function reset() {
  stack.innerHTML = "";
  blocks = [];
  score = 0;
  speed = 2;
  direction = 1;
  playing = true;
  scoreEl.textContent = "0";
  overlay.classList.add("hidden");
  spawn();
  update();
}

document.addEventListener("click", drop);
document.addEventListener("keydown", e => {
  if (e.code === "Space") drop();
});

restartBtn.onclick = reset;

spawn();
update();
