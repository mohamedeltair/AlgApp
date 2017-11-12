var site = "https://timetableG3n.eu-gb.mybluemix.net";
var socket = io.connect();
var username = document.getElementById("username");
var password = document.getElementById("password");
function Validate(){
	socket.emit('credentials', {"username":username.value, "password": password.value});

}
socket.on('response', function(data) {
	alert(data.status);
	if(data.status == "valid")
		window.location.href= site+"/admin";
});
document.getElementById("submit").addEventListener("click", Validate);
