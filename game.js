const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
let keys = {};
let score = 0, lives = 3, level = 1;
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

// Mobile buttons
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const fireBtn = document.getElementById("fireBtn");
function btnPress(code, val) { keys[code] = val; }
leftBtn.onmousedown = () => btnPress("ArrowLeft", true);
leftBtn.onmouseup = () => btnPress("ArrowLeft", false);
rightBtn.onmousedown = () => btnPress("ArrowRight", true);
rightBtn.onmouseup = () => btnPress("ArrowRight", false);
fireBtn.onmousedown = () => btnPress("Space", true);
fireBtn.onmouseup = () => btnPress("Space", false);

class Player {
  constructor() { this.w=40; this.h=20; this.x=canvas.width/2-this.w/2; this.y=canvas.height-40; this.speed=5; }
  move(){ if(keys["ArrowLeft"]||keys["KeyA"]) this.x-=this.speed; if(keys["ArrowRight"]||keys["KeyD"]) this.x+=this.speed;
    this.x=Math.max(0,Math.min(canvas.width-this.w,this.x)); }
  draw(){ ctx.fillStyle="cyan"; ctx.fillRect(this.x,this.y,this.w,this.h); }
}
class Bullet { constructor(x,y){ this.x=x; this.y=y; this.w=4; this.h=10; this.speed=7; } update(){ this.y-=this.speed; } draw(){ ctx.fillStyle="yellow"; ctx.fillRect(this.x,this.y,this.w,this.h);}}
class Enemy { constructor(x,y){ this.x=x; this.y=y; this.w=30; this.h=20; this.alive=true; } draw(){ if(this.alive){ ctx.fillStyle="lime"; ctx.fillRect(this.x,this.y,this.w,this.h);} }}

let player = new Player();
let bullets=[];
let enemies=[];
let dir=1;
function createEnemies(){ enemies=[]; for(let r=0;r<3+level;r++){ for(let c=0;c<8;c++){ enemies.push(new Enemy(60*c+20,40*r+20)); } } }
createEnemies();

function update(){
  player.move();
  if(keys["Space"]){ if(bullets.length<5){ bullets.push(new Bullet(player.x+player.w/2,player.y)); } keys["Space"]=false; }
  bullets.forEach(b=>b.update());
  bullets=bullets.filter(b=>b.y>-10);
  let edge=false;
  enemies.forEach(e=>{ if(e.alive){ e.x+=dir; if(e.x<0||e.x+e.w>canvas.width) edge=true; } });
  if(edge){ dir*=-1; enemies.forEach(e=>e.y+=20); }
  bullets.forEach(b=>{ enemies.forEach(e=>{ if(e.alive && b.x<b.x+4 && b.x<e.x+e.w && b.x+4>e.x && b.y<e.y+e.h && b.y+10>e.y){ e.alive=false; b.y=-100; score+=10; } }); });
  if(enemies.every(e=>!e.alive)){ level++; createEnemies(); }
  if(enemies.some(e=>e.y+e.h>=player.y)){ lives--; if(lives<=0){ alert("ゲームオーバー！スコア:"+score); document.location.reload(); } else { level=1; score=0; lives=3; createEnemies(); } }
}
function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  player.draw();
  bullets.forEach(b=>b.draw());
  enemies.forEach(e=>e.draw());
  document.getElementById("score").textContent=score;
  document.getElementById("lives").textContent=lives;
  document.getElementById("level").textContent=level;
}
function loop(){ update(); draw(); requestAnimationFrame(loop); }
loop();