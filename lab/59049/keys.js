window.onkeydown = function(e) {
	e = e || window.event;
	if (can_move) {
		if (e.code == 'ArrowUp') {
			tilt(0);
			update();
		}
		if (e.code == 'ArrowRight') {
			tilt(1);
			update();
		}
		if (e.code == 'ArrowDown') {
			tilt(2);
			update();
		}
		if (e.code == 'ArrowLeft') {
			tilt(3);
			update();
		}
	}
}
