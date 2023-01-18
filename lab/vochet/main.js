const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
var cursor_x, cursor_y;
var grid_row, grid_col;
var chess_dir = 0;
var chess_stat = [
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
var chess_draw_dir = [
	[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
	[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
	[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
	[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
	[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
	[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
	[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
	[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
	[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
	[[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]]
];
var not_started = true;
var player = 0;
var player_name = ['紫色', '蓝色'];

canvas.addEventListener('mousemove', function() {
	getCursorPos();
	not_started = false;
});

canvas.addEventListener('mousewheel', function(e) {
	if (e.wheelDelta ==  120 || e.detail ==  3) chess_dir = (chess_dir + 3) % 4;
	if (e.wheelDelta == -120 || e.detail == -3) chess_dir = (chess_dir + 1) % 4;
});

canvas.addEventListener('mousedown', function(e) {
	place_chess(grid_row, grid_col, chess_dir);
	if (judge()) player_win(1 - player);
});

function refresh() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function getCursorPos() {
	var rect = canvas.getBoundingClientRect();
	cursor_x = event.clientX - rect.left * (canvas.width / rect.width) - 40;
	cursor_y = event.clientY - rect.top * (canvas.height / rect.height) - 40;
}

function draw_line(x1, y1, x2, y2) {
	ctx.beginPath();
	ctx.moveTo(x1 + 40, y1 + 40);
	ctx.lineTo(x2 + 40, y2 + 40);
	ctx.closePath();
	ctx.stroke();
}

function draw_rect(x1, y1, x2, y2) {
	ctx.fillRect(x1 + 40, y1 + 40, x2 - x1, y2 - y1);
	ctx.strokeRect(x1 + 40, y1 + 40, x2 - x1, y2 - y1);
}

function draw_board() {
	for (var i = 0; i < 9; i ++) {
		ctx.strokeStyle = 'rgba(181, 101, 200, 0.2)';
		draw_line(0, i * 80, 640, i * 80);
		draw_line(i * 80, 0, i * 80, 640);
	}
}

function pos2grid(x, y) {
	var r = Math.floor(y / 80) + 1;
	var c = Math.floor(x / 80) + 1;
	if (r < 1) r = 1;
	if (r > 8) r = 8;
	if (c < 1) c = 1;
	if (c > 8) c = 8;
	return [r, c];
}

function grid2pos(r, c) {
	var x = (c - 1) * 80;
	var y = (r - 1) * 80;
	return [x, y];
}

function draw_chess(r, c, dir) {
	var x, y; [x, y] = grid2pos(r, c);
	if      (dir == 0) draw_rect(x,      y - 80, x + 80,  y + 80 ); // up
	else if (dir == 1) draw_rect(x,      y,      x + 160, y + 80 ); // right
	else if (dir == 2) draw_rect(x,      y,      x + 80,  y + 160); // down
	else if (dir == 3) draw_rect(x - 80, y,      x + 80,  y + 80 ); // left
}

function illegal(r, c, dir) {
	var dirr = [[-1, 0], [0, 1], [1, 0], [0, -1]];
	var nr = r + dirr[dir][0];
	var nc = c + dirr[dir][1];
	return chess_stat[r][c] || chess_stat[nr][nc];
}

function draw_pre_chess(r, c, dir) {
	if (! illegal(r, c, dir)) {
		if (player == 0) {
			ctx.fillStyle = 'rgba(181, 101, 200, 0.1)';
			ctx.strokeStyle = 'rgba(181, 101, 200, 0.2)';
		} else {
			ctx.fillStyle = 'rgba(112, 153, 228, 0.1)';
			ctx.strokeStyle = 'rgba(112, 153, 228, 0.2)';
		}
		canvas.style.cursor = 'default';
	}
	else {
		ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
		ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
		canvas.style.cursor = 'not-allowed';
	}
	draw_chess(r, c, dir);
}

function draw_chesses() {
	for (var i = 1; i <= 8; i ++) {
		for (var j = 1; j <= 8; j ++) {
			if (chess_draw_dir[i][j][0]) {
				var chess_player = chess_draw_dir[i][j][1];
				if (chess_player == 0) {
					ctx.fillStyle = 'rgba(181, 101, 200, 0.2)';
					ctx.strokeStyle = 'rgba(181, 101, 200, 1)';
				} else {
					ctx.fillStyle = 'rgba(112, 153, 228, 0.2)';
					ctx.strokeStyle = 'rgba(112, 153, 228, 1)';
				}
				draw_chess(i, j, chess_draw_dir[i][j][0] - 1);
			}
		}
	}
}

function place_chess(r, c, dir) {
	if (illegal(r, c, dir)) return false;
	chess_stat[r][c] = 1;
	chess_draw_dir[r][c] = [dir + 1, player];
	var dirr = [[-1, 0], [0, 1], [1, 0], [0, -1]];
	var nr = r + dirr[dir][0];
	var nc = c + dirr[dir][1];
	chess_stat[nr][nc] = 1;
	player = 1 - player;
}

function judge() {
	for (var i = 1; i <= 8; i ++) {
		for (var j = 1; j <= 8; j ++) {
			for (var dir = 0; dir < 4; dir ++) {
				if (! illegal(i, j, dir)) return false;
			}
		}
	}
	return true;
}

function frame() {
	if (not_started) return ;
	refresh();
	draw_board();
	draw_chesses();
	[grid_row, grid_col] = pos2grid(cursor_x, cursor_y);
	draw_pre_chess(grid_row, grid_col, chess_dir);
}

setInterval(frame, 10);

function player_win(player) {
	var name = player_name[player];
	alert(name + '赢了！');
}
