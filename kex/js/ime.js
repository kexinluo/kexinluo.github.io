const output_area = document.getElementById('output-area');
const latinize_map = {"": "a", "": "uo", "": "oe", "": "i", "": "u", "": "ii", "": "oi", "": "o", "": "e", "": "ao", "": "ai", "": "ei", "": "ie", "": "iie", "": "iia", "": "b", "": "p", "": "m", "": "f", "": "d", "": "t", "": "n", "": "l", "": "g", "": "k", "": "h", "": "j", "": "q", "": "x", "": "z", "": "c", "": "s", "": "zh", "": "ch", "": "sh", "": "r", "": "y", "": "w", "": "v", "": "ss", "": "n", "": "ng", "": "r", " ": " ", "": "", "": ". ", "": ", ", "": "! ", "": "? "};
const unlatinize_map = {"a": "", "uo": "", "oe": "", "i": "", "u": "", "ii": "", "oi": "", "o": "", "e": "", "ao": "", "ai": "", "ei": "", "ie": "", "iie": "", "iia": "", "b": "", "p": "", "m": "", "f": "", "d": "", "t": "", "n": "", "l": "", "g": "", "k": "", "h": "", "j": "", "q": "", "x": "", "z": "", "c": "", "s": "", "zh": "", "ch": "", "sh": "", "r": "", "y": "", "w": "", "v": "", "ss": "", ".": "", ",": "", "!": "", "?": "", " ": " ", ". ": "", ", ": "", "! ": "", "? ": "", "an": "", "ar": "", "ang": "", "uon": "", "uor": "", "uong": "", "oen": "", "oer": "", "oeng": "", "in": "", "ir": "", "ing": "", "un": "", "ur": "", "ung": "", "iin": "", "iir": "", "iing": "", "oin": "", "oir": "", "oing": "", "on": "", "or": "", "ong": "", "en": "", "er": "", "eng": "", "aon": "", "aor": "", "aong": "", "ain": "", "air": "", "aing": "", "ein": "", "eir": "", "eing": "", "ien": "", "ier": "", "ieng": "", "iien": "", "iier": "", "iieng": "", "iian": "", "iiar": "", "iiang": ""};
const unlatinize_order = ["iiang", "iieng", "aing", "aong", "eing", "ieng", "iian", "iiar", "iien", "iier", "iing", "oeng", "oing", "uong", "ain", "air", "ang", "aon", "aor", "ein", "eir", "eng", "ien", "ier", "iia", "iie", "iin", "iir", "ing", "oen", "oer", "oin", "oir", "ong", "ung", "uon", "uor", "ai", "an", "ao", "ar", "ch", "ei", "en", "er", "ie", "ii", "in", "ir", "oe", "oi", "on", "or", "sh", "ss", "un", "uo", "ur", "zh", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ". ", ", ", "! ", "? ", ".", ",", "?", "!"];
const xin_vowel = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];

function latinize(s) {
	var output = "";
	for (var i = 0; i < xin_vowel.length; i++) {
		s = s.replaceAll(xin_vowel[i] + "", xin_vowel[i] + "-n");
		s = s.replaceAll(xin_vowel[i] + "", xin_vowel[i] + "-ng");
		s = s.replaceAll(xin_vowel[i] + "", xin_vowel[i] + "-r");
	}
	s = s.replaceAll("", "z-h");
	s = s.replaceAll("", "c-h");
	s = s.replaceAll("", "s-h");
	for (var i = 0; i < s.length; i ++) {
		if (latinize_map[s[i]] != undefined) output += latinize_map[s[i]];
		else output += s[i];
	}
	return output;
}

function unlatinize(s) {
	for (var i = 0; i < unlatinize_order.length; i ++) {
		s = s.replaceAll(unlatinize_order[i], unlatinize_map[unlatinize_order[i]]);
	}
	s = s.replaceAll("-", "");
	return s;
}

function latinize_input() {
	output_area.value = latinize(demo_ime.value);
}

function unlatinize_input() {
	output_area.value = unlatinize(demo_ime.value);
	output_area.setAttribute("rows", count(output_area.value, "\n") + 2);
}
