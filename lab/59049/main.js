let stage = new createjs.Stage('canvas');
const val_color = {
	1:    'rgb(238, 228, 218)',
	3:    'rgb(237, 224, 200)',
	9:    'rgb(242, 177, 121)',
	27:   'rgb(245, 149,  99)',
	81:   'rgb(246, 124,  95)',
	243:  'rgb(246,  94,  59)',
	729:  'crimson',
	2187:  'darkorchid',
	6561:  'indigo',
	19683: 'teal',
	59049: 'gold'
};
const color = {
	'text dark': 'rgb(119, 110, 101)',
	'text light': 'rgb(249, 246, 242)',
}
const dir_d = [[-1, 0], [0, 1], [1, 0], [0, -1]];
let board_size = 6, block_len = 133;
let can_move = true;

let board = new Array(board_size).fill(0).map(() => new Array(board_size).fill(undefined));

function rc2pos(row, col) {
	var x = col * block_len;
	var y = row * block_len;
	return [x + 20, y + 20];
}

class block {
	constructor(value, row, col) {
		this.value = value;
		this.row = row;
		this.col = col;

		var shape = new createjs.Shape(new createjs.Graphics()
			.beginFill(val_color[value]).drawRoundRect(0, 0, block_len - 20, block_len - 20, 10));
			[shape.x, shape.y] = [0, 0];

		var len = value.toString().length;
		var fontsize = block_len / 2 - [0, 0, 0, 10, 20, 30][len];
		var fontcolor = color['text ' + (value == 1 || value == 3 ? 'dark' : 'light')];
		var text = new createjs.Text(value, 'bold ' + fontsize + 'px Arial', fontcolor);
			[text.x, text.y] = [block_len / 2 - 10 - text.getBounds().width / 2, block_len / 2 - 5];
			text.textBaseline = 'middle';
		
		this.inner = new createjs.Container();
			[this.inner.x, this.inner.y] = rc2pos(row, col);
			this.inner.addChild(shape, text);
			this.inner.belong = this;

		stage.addChild(this.inner);
	}
	move(row, col) {
		var nx, ny; [nx, ny] = rc2pos(row, col);
		[this.row, this.col] = [row, col];
		createjs.Tween.get(this.inner).to({x: nx, y: ny}, 200, createjs.Ease.getPowInOut(2));
	}
}

createjs.Ticker.setFPS(60);
createjs.Ticker.addEventListener("tick", stage);

function addblock(value, row, col) {
	board[row][col] = new block(value, row, col);
	var child = stage.children.find(x => x.belong == board[row][col]);
	var ox = child.x, oy = child.y;
	board[row][col].inner.scaleX = 0;
	board[row][col].inner.scaleY = 0;
	board[row][col].inner.x = ox + block_len / 2 - 10;
	board[row][col].inner.y = oy + block_len / 2 - 10;
	createjs.Tween.get(child).to({
		scaleX: 1, scaleY: 1, x: ox, y: oy
	}, 100, createjs.Ease.getPowInOut(2));
}

function rand_of(arr, num = 1) {
	var a = arr.concat();
	var ret = [];
	while (ret.length < num) {
		var temp = (Math.random() * a.length) >> 0;
		ret.push(a.splice(temp, 1)[0]);
	}
	return ret;
}

function rand_int(l, r) {
	return Math.floor(Math.random() * (r - l + 1)) + l;
}

function rand_gen(num) {
	var spaces = [];
	for (var i = 0; i < board_size; i ++) {
		for (var j = 0; j < board_size; j ++) {
			if (board[i][j] == undefined) spaces.push([i, j]);
		}
	}
	// console.log(spaces);
	rand_of(spaces, num).forEach(pos => addblock(1, pos[0], pos[1]));
}

function init() {
	backdrop = new createjs.Container();
	backdrop.addChild(new createjs.Shape(new createjs.Graphics()
		.beginFill('rgb(187, 173, 160)').drawRoundRect(0, 0, board_size * block_len + 20, board_size * block_len + 20, 10)));
	for (var i = 0; i < board_size; i ++) {
		for (var j = 0; j < board_size; j ++) {
			[x, y] = rc2pos(i, j);
			backdrop.addChild(new createjs.Shape(new createjs.Graphics()
				.beginFill('rgb(205, 193, 180)').drawRoundRect(x, y, block_len - 20, block_len - 20, 10)));
		}
	}
	stage.addChild(backdrop);
	rand_gen(3);
}

function remove(row, col) {
	for (let i = 0; i < stage.children.length; i ++) {
		var x = stage.children[i].belong;
		if (x == undefined) continue;
		if (x.row == row && x.col == col) {
			var tx = x, ox = stage.children[i].x, oy = stage.children[i].y;
			setTimeout(() => {
				stage.removeChild(tx.belong);
				board[row][col] = undefined;
			}, 100);
			createjs.Tween.get(stage.children[i]).to({
				scaleX: 0, scaleY: 0, x: ox + block_len / 2 - 10, y: oy + block_len / 2 - 10
			}, 100, createjs.Ease.getPowInOut(2));
		}
	}
}

function check() {
	for (var i = 0; i < board_size; i ++) {
		for (var j = 0; j < board_size; j ++) {
			var now = board[i][j];
			if (now == undefined) continue;
			var die = [now];
			for (var d = 0; d < 4; d ++) {
				var nr = i + dir_d[d][0], nc = j + dir_d[d][1];
				if (nr < 0 || nr > board_size - 1 || nc < 0 || nc > board_size - 1) continue;
				if (board[nr][nc] != undefined && board[nr][nc].value == now.value)
					die.push(board[nr][nc]);
				if (die.length > 2) break;
			}
			// console.log(die);
			if (die.length > 2) {
				var Tvalue = now.value * 3, Ti = i, Tj = j;
				setTimeout(() => {
					addblock(Tvalue, Ti, Tj);
				}, 150);
				die.forEach(x => remove(x.row, x.col));
				return true;
			}
		}
	}
	return false;
}

function update_after() {
	can_move = false;
	var many_check = setInterval(() => {
		if (! check()) {
			can_move = true;
			clearInterval(many_check);
		}
	}, 160);
	rand_gen(3);
}

function update() {
	setTimeout(update_after, 300);
	for (var i = 0; i < board_size; i ++) {
		for (var j = 0; j < board_size; j ++) {
			if (board[i][j] != undefined) board[i][j].move(i, j);
		}
	}
}

function tilt(dir) {
	var di = [1, 1, -1, 1][dir], si = [0, 0, board_size - 1, 0][dir], ei = [board_size, board_size, -1, board_size][dir];
	var dj = [1, -1, 1, 1][dir], sj = [0, board_size - 1, 0, 0][dir], ej = [board_size, -1, board_size, board_size][dir];
	for (var i = si; i != ei; i += di) {
		for (var j = sj; j != ej; j += dj) {
			var r = i, c = j, nr = i + dir_d[dir][0], nc = j + dir_d[dir][1];
			if (nr < 0 || nr > board_size - 1 || nc < 0 || nc > board_size - 1 || board[i][j] == undefined || board[nr][nc] != undefined) continue;
			while (true) {
				[board[r][c], board[nr][nc]] = [board[nr][nc], board[r][c]];
				r = nr;
				c = nc;
				nr += dir_d[dir][0];
				nc += dir_d[dir][1];
				if (nr < 0 || nr > board_size - 1 || nc < 0 || nc > board_size - 1 || board[nr][nc] != undefined) break;
			}
		}
	}
}
