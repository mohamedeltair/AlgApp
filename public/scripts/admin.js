
var socket = io.connect();

var gen = document.getElementById("generate");
gen.addEventListener('click', click);
function click() {
	window.location.href = "https://timetableG3n.eu-gb.mybluemix.net/index";
}


