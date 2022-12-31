var gongde = 0;
var gongde_speed = 0;
var prop = {};
var price = {"gunzi": 50, "daodejing": 200, "wtx": 10000};
var unlock = ["gunzi"];

var muyu = document.getElementById("muyu");
var gongde_counter = document.getElementById("gongde_counter");
var gongde_speed_counter = document.getElementById("gongde_speed_counter");

function playsound(sound) {
	(new Audio("./" + sound)).play();
}

function update() {
	gongde_counter.innerHTML = "汝积功德 " + gongde + "。";
	gongde_speed_counter.innerHTML = "秒可积 " + gongde_speed + " 功德。";
	var cards = document.getElementsByClassName("shop_card");
	for (var i = 0; i < cards.length; i ++) {
		var card = cards[i], thing = card.id.slice(10, card.id.length);
		var img = card.children[0], tip = card.children[1];
		if (! unlock.includes(thing) && gongde >= price[thing]) unlock.push(thing);
		if (unlock.includes(thing)) {
			card.style.border = "5px groove gold";
			tip.classList.remove("unlock");
			if (gongde >= price[thing]) img.style.filter = "saturate(1)", card.style.background = "yellow";
			else img.style.filter = "saturate(0.2)", card.style.background = "ghostwhite";
		}
		else {
			card.style.border = "5px groove #2f2f2f";
			tip.classList.add("unlock");
			img.style.filter = "brightness(0)", card.style.background = "#2f2f2f";
		}
	}
}

function jiagongde(x) {
	if (x == 0) return;
	gongde += x;
	playsound("muyu.wav");
	update();
}

function prop_effect(thing) {
	if (thing == 'gunzi') {
		gongde_speed += 1;
	} else if (thing == 'daodejing') {
		gongde_speed += 10;
	} else if (thing == 'wtx') {
		gongde = Math.floor(gongde * Math.sqrt(Math.sqrt(gongde_speed) + 1));
		gongde_speed = Math.floor(gongde_speed / 2);
	}
}

function buy(thing, amount, cost) {
	if (gongde < cost) return;
	gongde -= cost;
	prop[thing] += amount;
	for (var i = 1; i <= amount; i ++) {
		prop_effect(thing);
	}
	playsound("buy.mp3");
	update();
}

function shop_buy(thing) {
	buy(thing, 1, price[thing]);
}

function persec() {
	jiagongde(gongde_speed);
}

// 每秒执行一次
setInterval(persec, 1000);

var qiao_popup_list = ["功德 +1"], qiao_popup_list_index = 0;

muyu.addEventListener("mousedown", function(e) {
	var x = e.pageX, y = e.pageY, span = document.createElement("span");
	span.textContent = qiao_popup_list[qiao_popup_list_index];
	qiao_popup_list_index = (Math.floor(Math.random() * qiao_popup_list.length)) % qiao_popup_list.length;
	span.setAttribute("class", "gongde_popup");
	span.style.cssText = [
		"z-index: 0;",
		"position: absolute;",
		"-webkit-user-drag: none;",
		"-webkit-user-select: none;",
		"top: ", y - 40, "px;",
		"left: ", x + 20, "px;",
		"font-size: 30px;",
		"font-weight: bold"
	].join("");
	document.body.appendChild(span);
	animate_popup(span);
});

function animate_popup(el) {
	var i = 0, top = parseInt(el.style.top), id = setInterval(frame, 16.7), timetolive = 50;
	function frame() {
		if (i > timetolive) {
			clearInterval(id);
			el.parentNode.removeChild(el);
		} else {
			i += 3;
			el.style.top = top - i + "px";
			el.style.opacity = (timetolive - i) / timetolive;
		}
	}
}