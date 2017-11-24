var site = "https://timetableG3n.eu-gb.mybluemix.net";
var socket = io.connect();
var username = document.getElementById("username");
var password = document.getElementById("password");
function Validate(){
	socket.emit('credentials', {"username":username.value, "password": password.value});

}
socket.on('response', function(data) {
	if(data.type == "invalid"){
        alert(data.type);
	}
	else if(data.type == "admin")
		window.location.href= site+"/admin";
	else if(data.type === "student" || data.type === "instructor")
		window.location.href= site+"/myprofile";
});
document.getElementById("submit").addEventListener("click", Validate);
