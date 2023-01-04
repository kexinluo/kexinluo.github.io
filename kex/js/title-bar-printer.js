var sentences = ["在这里找到关于鑫语的一切", "循序渐进，深入浅出", ""];
const texts = document.querySelector('.printer-text');

var i = 0, j = 0;
var backwards = true;

setInterval(function() {
	if (backwards) texts.innerHTML = sentences[i].slice(0, ++ j);
	else texts.innerHTML = sentences[i].slice(0, j --);
	if (j == sentences[i].length + 10) backwards = false;
	else if (j < 0) {
		j = 0;
		backwards = true;
		i ++;
		if (i >= sentences.length) i = 0;
	}
}, 100);