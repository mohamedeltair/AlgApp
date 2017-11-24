var p =document.getElementById("pp2");
var t= document.getElementById("tt2");
var l =document.getElementById("ll2");
p.addEventListener('click', pf);
t.addEventListener('click', tf);
l.addEventListener('click', lf);

function lf() {
	window.location.href = "https://timetableg3n.eu-gb.mybluemix.net";
}


function pf() {
	window.location.href = "https://timetableg3n.eu-gb.mybluemix.net/myprofile";
}


function tf() {
	window.location.href = "https://timetableg3n.eu-gb.mybluemix.net/mytable";
}