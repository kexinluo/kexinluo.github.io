const demo_ime = document.getElementById('demo-ime');

function getCursorPos(pTextArea) {
	var cursurPosition = -1;
	if (pTextArea.selectionStart >= 0) cursurPosition = pTextArea.selectionStart;  // 非IE
	else {  // IE
		var range = document.selection.createRange();
		range.moveStart("character", - pTextArea.value.length);
		cursurPosition = range.text.length;
	}
	return cursurPosition;
}

function setCursorPos(pTextArea, pos)
{
	if (pTextArea.setSelectionRange) {  // 非IE
		pTextArea.focus();
		pTextArea.setSelectionRange(pos, pos);
	} else if (pTextArea.createTextRange) {  // IE
		var range = pTextArea.createTextRange();
		range.collapse(true);
		range.moveEnd("character", pos);
		range.moveStart("character", pos);
		range.select();
	} 
}

function demo_ime_add_char(c) {
	var cursurPosition = getCursorPos(demo_ime);
	var first_part = demo_ime.value.slice(0, cursurPosition);
	var second_part = demo_ime.value.slice(cursurPosition, demo_ime.value.length);
	if (c == -1) {
		demo_ime.value = demo_ime.value.slice(0, cursurPosition - 1) + second_part;
		setCursorPos(demo_ime, cursurPosition - 1);
	} else if (c == 0) {
		demo_ime.value = "";
	} else {
		demo_ime.value = first_part + String.fromCharCode(c) + second_part;
		setCursorPos(demo_ime, cursurPosition + 1);
	}
}

var sound_playing = 0;

function playsound(sound) {
	if (sound_playing != 0) sound_playing.load();
	sound_playing = new Audio(sound);
	sound_playing.play();
}

var spk_tags = document.getElementsByTagName("spk");

for (var i = 0; i < spk_tags.length; i ++) {
	var spk_tag = spk_tags[i];
	var spk_src = spk_tag.getAttribute("src");
	spk_tag.setAttribute("onclick", "playsound('" + spk_src + "')");
}

function count(s, k) {
	return s.split(k).length - 1;
}
