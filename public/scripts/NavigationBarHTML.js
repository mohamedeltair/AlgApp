document.write(
'<div class="leftCol" id="f">'+
  '<div class="NvBar">'+
    '<div class="ppContainer">'+
      '<img class="profilePic" src="images/pp.png" alt="User PP"/>'+
    '</div>'+
    '<div class="NvBtns">'+
      '<button class="NvBtn" href=""><span class="pTxt" id="pp">My Profile &nbsp;</span><span class="glyphicon glyphicon-user"></span></button>'+
      '<button class="NvBtn" href=""><span class="ttTxt" id="tt">Timetable &nbsp;</span><span class="glyphicon glyphicon-calendar"></span></button>'+
      '<button class="NvBtn" href=""><span class="loTxt" id="ll">Log Out &nbsp;</span><span class="glyphicon glyphicon-log-out"></span></button>'+
    '</div>'+
  '</div>'+
'</div>'
);
var p =document.getElementById("pp");
var t= document.getElementById("tt");
var l =document.getElementById("ll");
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