var start_btn = document.getElementById("start_btn");
var pause_btn = document.getElementById("pause_btn");
var resume_btn = document.getElementById("resume_btn");

function playsound(sound) {
	(new Audio("./" + sound)).play();
}

var key_pressed = {};
document.addEventListener("keyup", function(e) { key_pressed[e.keyCode] = false; });
document.addEventListener("keydown", function(e) { key_pressed[e.keyCode] = true; });

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let ball_x, ball_y, ball_w, ball_h, ball_dx, ball_dy, collide_p;
let p1_x, p1_y, p1_w, p1_h;
let p2_x, p2_y, p2_w, p2_h;

function init() {
	ball_x = 400; ball_y = 300; ball_w = 20; ball_h = 20; ball_dx = 2; ball_dy = 2;
	p1_x = 50; p1_y = 250; p1_w = 20; p1_h = 100;
	p2_x = 730; p2_y = 250; p2_w = 20; p2_h = 100;
}

function move_ball() {
	ball_x += ball_dx;
	ball_y += ball_dy;
	function collide_x(set_x = -1) {
		if (set_x != -1) ball_x = set_x;
		ball_dx = -ball_dx;
		playsound("collide.wav");
	}
	function collide_y(set_y = -1) {
		if (set_y != -1) ball_y = set_y;
		ball_dy = -ball_dy;
		playsound("collide.wav");
	}
	if (ball_x + ball_w > 800 || ball_x < 0) collide_x();
	if (ball_y + ball_h > 600 || ball_y < 0) collide_y();

	collide_p = false;
	if (ball_x < p1_x + p1_w && ball_x > p1_x && p1_y < ball_y + ball_h && ball_y < p1_y + p1_h) { collide_x(p1_x + p1_w); collide_p = true; }
	if (ball_x < p1_x && ball_x + ball_w > p1_x && p1_y < ball_y + ball_h && ball_y < p1_y + p1_h) { collide_x(p1_x - ball_w); collide_p = true; }
	if (ball_x < p2_x + p2_w && ball_x > p2_x && p2_y < ball_y + ball_h && ball_y < p2_y + p2_h) { collide_x(p2_x + p2_w); collide_p = true; }
	if (ball_x < p2_x && ball_x + ball_w > p2_x && p2_y < ball_y + ball_h && ball_y < p2_y + p2_h) { collide_x(p2_x - ball_w); collide_p = true; }
	
	if (collide_p) {
		if (key_pressed[83] || key_pressed[40]) ball_dy = 2;
		if (key_pressed[87] || key_pressed[38]) ball_dy = -2;
	}
}

function move_players() {
	if (key_pressed[83]) p1_y += 4;
	if (key_pressed[87]) p1_y -= 4;
	if (key_pressed[40]) p2_y += 4;
	if (key_pressed[38]) p2_y -= 4;
}

function draw() {
	ctx.clearRect(0, 0, 800, 600);
	ctx.fillStyle = "green";
	ctx.fillRect(0, 0, 800, 600);
	ctx.fillStyle = "limegreen";
	ctx.fillRect(ball_x, ball_y, ball_w, ball_h);
	ctx.fillStyle = "limegreen";
	ctx.fillRect(p1_x, p1_y, p1_w, p1_h);
	ctx.fillRect(p2_x, p2_y, p2_w, p2_h);
}

function frame() {
	move_ball();
	move_players()
	draw();
}

init();
frame();

function pause() {
	for (var i = 0; i < 1000; i++) {
		clearInterval(i);
	}
	pause_btn.disabled = true;
	resume_btn.disabled = false;
}

function resume() {
	setInterval(frame, 10);
	pause_btn.disabled = false;
	resume_btn.disabled = true;
}

function start() {
	init();
	pause();
	resume();
	start_btn.disabled = true;
	pause_btn.disabled = false;
	resume_btn.disabled = true;
}
