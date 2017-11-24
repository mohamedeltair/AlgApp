var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser=require('cookie-parser'),
    logger = require('morgan'),
    path = require('path'),
    fs = require('fs'),
    http = require('http');



var app = express();

app.set('port', process.env.PORT || 3000);
var httpServer = http.createServer(app);

httpServer.listen(app.get('port'), '0.0.0.0',
    function() {
        console.log('Express server listening on port ' + app.get('port'));
    }
);

var io = require('socket.io');

var listener = io.listen(httpServer);

LoginStatus = false;

listener.sockets.on('connection',
    function(socket){
        socket.emit('connected', {"status": "connected"});
        socket.on('credentials', function(data) {
			var type = LOGIN(data);
			socket.emit('response', {"type" : type});
		});
		socket.on("start", function(data) {
			/*fs.readFile("./public/files/table.txt", 'utf8', function(err, data2) {
			  //if (err) socket.emit("start", err);
			  //var obj = JSON.parse(data2);
			  socket.emit("start", data2);
			});*/
			var obj = JSON.parse(fs.readFileSync('./public/files/table.txt', 'utf8'));
			socket.emit("start", obj);
		});
		socket.on("edit", function(data) {
			fs.unlinkSync("./public/files/table.txt");
			fs.writeFileSync('./public/files/table.txt', data);
		});
		socket.on("generate", function(data) {
			var classNames = JSON.parse(fs.readFileSync('./public/files/classNames.txt', 'utf8'));
			var courses = JSON.parse(fs.readFileSync('./public/files/courses.txt', 'utf8'));
			var instructors = JSON.parse(fs.readFileSync('./public/files/instructors.txt', 'utf8'));
			var students = JSON.parse(fs.readFileSync('./public/files/students.txt', 'utf8'));
			var sessions = JSON.parse(fs.readFileSync('./public/files/sessions.txt', 'utf8'));
			var rooms = JSON.parse(fs.readFileSync('./public/files/rooms.txt', 'utf8'));
			socket.emit("trivial", {"d":"hob"});
			var schedules = generate(classNames.classNames, courses.courses, instructors.instructors, students.students, sessions.sessions, rooms.rooms);
			/*fs.unlinkSync("./public/files/table.txt");
			fs.writeFileSync('./public/files/table.txt', {"schedules":schedules});
			socket.emit("start", {"schedules":schedules});*/
		});
    });
	
	function LOGIN(data){
		    var credentials = JSON.parse(fs.readFileSync('./public/files/credentials.txt', 'utf8'));
            var username = data.username;
            var password = data.password;
            for(var i=0; i<credentials.Credentials.length; i++){
				var object = credentials.Credentials[i];
				if(object.username == username && object.password == password){
                    //socket.emit('response', {"type": object.type});
                    LoginStatus = true;
					return object.type;
                }
			}
			return "invalid";
        
	}

var index = require('./routes/index');
var Login = require('./routes/Login');
var admin = require('./routes/admin');
var addCourse = require('./routes/addCourse');
var myprofile = require('./routes/myprofile');
var mytable = require('./routes/mytable');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));

app.use('/index', index);
app.use('/', Login);
app.use('/admin', admin);
app.use('/admin/addcourse',addCourse);
app.use('/myprofile', myprofile);
app.use('/mytable', mytable);

app.use(function(req, res, next) {
    var err = new Error("Not Found");
    err.status=404;
    next(err);
});

function generate(classNamesParam, coursesParam, instructorsParam, studentsParam, sessionsParam, roomsParam) {
	var roomMap = {
	  "Lecture": 6,
	  "Section": 3,
	  "Lab": 3
	};
	var numSections = roomMap.Lecture / roomMap.Section;
	var sectionsN = 0;
/*  
	function ClassName(ID, students, courses) {
	  this.ID = ID;
	  this.students = students;
	  this.courses = courses;
	}

	function Course(ID, className) {
	  this.ID = ID;
	  this.className = className;
	}

	function Session(ID,course, slots, instructor, section, type) {
	  this.ID = ID;
	  this.course = course;
	  this.slots = slots;
	  this.instructor = instructor;
	  this.section = section;
	  this.type = type;
	}//

	function User(name, userName, password) {
	  this.name = name;
	  this.userName = userName;
	  this.password = password;
	}

	function Instructor(name, userName, password, sessions, maxHours) {
	  User.call(this, name, userName, password);
	  this.sessions = sessions;
	  this.maxHours = maxHours;
	}//

	function Student(name, userName, password, preferredVacation) {
	  User.call(this, name, userName, password);
	  this.preferredVacation = preferredVacation;
	}//

	function Room(ID, type) {
	  this.ID = ID;
	  this.type = type;
	}//

	*/

	var days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

	var slots = {
	  start: '08:00',
	  duration: '1:45',
	  count: 15,
	  breaks: [4, 8, 12],
	  break_duration: '0:20'
	};

	function notFreeMapGenerator() {
	  var notFree = {};
	  for (var i = 0; i < days.length; i++) {
		notFree[i] = {};
		for (var j = 0; j < slots.count - slots.breaks.length; j++) {
		  notFree[i][j] = {};
		}
	  }
	  return notFree;
	}
	var notRoomFree = notFreeMapGenerator();
	var notInstructorFree = notFreeMapGenerator();
	var sections = [];
	var schedules = {};
	var classNames = classNamesParam;
	var courses = coursesParam;
	var sessions = sessionsParam;
	var rooms = roomsParam;
	var students = studentsParam;
	var instructors = instructorsParam;
	var sessionDay = new Array(sessions.length);
	//var accumulative = 0;
	
	for(var i=0; i<students.length; i++)
		sectionsN = sectionsN > students[i].section+ 1 ? sectionsN :students[i].section+ 1;
	
	/*
	for(var i =1; i<=classNames.length; i++) {
		var classInstance = classNames[i-1];
		var studentsPerClass = classInstance.students;
		var studentsNumber = studentsPerClass.length;
		var limit = Math.ceil(studentsNumber / roomMap.Section);
		var remainingStudents = studentsNumber;
		for(var j=1; j<=limit; j++) {
			var innerLimit = roomMap.Section < remainingStudents ? roomMap.Section : remainingStudents;
			for(var k=accumulative; k<innerLimit; k++) {
				studentsPerClass[k].section = j;
			}
			accumulative += innerLimit;
			remainingStudents -= roomMap.Section;
			if(remainingStudents<0){
				remainingStudents = 0;
			}			
		}
	}*/
	
	
	
	function initiateSchedule(obj) {
	  for (var i = 0; i < sectionsN; i++) {
		obj[i] = [];
		for (var j = 0; j < days.length; j++)
		  obj[i].push([]);
	  }
	}

	function allocator(section, day, startSlot, numSlots, room, session) {
	  for (var i = startSlot; i < startSlot+numSlots; i++) {
		schedules[section][day].push(session);
		if (session !== null) {
		  notRoomFree[day][i][room] = true;
		  notInstructorFree[day][i][session.instructor] = true;
		}
	  }
	}

	function checkRoomFree(day, startSlot, endSlot, type, instructor) {
	  for (var i = 0; i < rooms.length; i++) {
		if (rooms[i].type !== type) continue;
		var valid = true;
		for (var j = startSlot; j <= endSlot; j++) {
		  if (notRoomFree[day][j][i] || notInstructorFree[day][j][instructor]) {
			valid = false;
			break;
		  }
		}
		if (valid) return i;
	  }
	  return -1;
	}

	function checkSections(section, limit, lastSlot, day) {
	  for (var j = section; j < section + numSections - 1 && j < limit; j++) {
		if (schedules[j][day].length > lastSlot)
		  return false;
	  }
	  //append gaps for remaining sections
	  for (var j = section; j < section + numSections - 1 && j < limit; j++) {
		var lastSlotj = schedules[j][day].length;
		if (lastSlotj !== lastSlot)
		  allocator(j, day, lastSlotj, lastSlot - lastSlotj, null, null);
	  }
	  return true;
	}

	function shuffleArray(array) {
	  for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	  }
	}

	function evaluateGaps() {
	  var totalGaps = 0;
	  for (var i = 0; i < sectionsN; i++) {
		for (var j = 0; j < days.length; j++) {
		  var start = 1000000,
			end = -1;
		  for (var k = 0; k < slots.count - slots.breaks.length; k++) {
			if (schedules[i][j][k] !== null) {
			  start = k < start ? k : start;
			  end = k > end ? k : end;
			}
		  }
		  //check if day is vacation
		  if (end === -1)
			continue;
		  //calculate gaps
		  for (var k = start; k <= end; k++) {
			if (schedules[i][j][k] === null) {
			  totalGaps++;
			}
		  }
		}
	  }
	  return totalGaps;
	}

	function isDayFree(section, day) {
	  for (var i = 0; i < slots.count - slots.breaks.length; i++) {
		if (schedules[section][day][i] !== null) return false;
	  }
	  return true;
	}

	function evaluatePreferredVacation() {
	  var count = 0;
	  for (var i = 0; i < students.length; i++) {
		var preferredDay = students[i].preferredDay;
		if (isDayFree(students[i].section, preferredDay)) count++;
	  }
	  return count;
	}

	function evaluateMaxInstructorHours() {
	  var result = {},
		count = 0;
	  for (var i = 0; i < instructors.length; i++)
		result[instructors[i].userName] = new Array(days.length);
	  for (var i = 0; i < sessions.length; i++) {
		var instructor = sessions[i].instructor;
		var duration = slots.duration;
		var minDuration = parseInt(duration.slice(duration.indexOf(':') + 1)) / 60;
		var hourDuration = parseInt(duration.slice(0, duration.indexOf(':')));
		var hoursPerSlot = minDuration + hourDuration;
		var hours = sessions[i].slots * hoursPerSlot;
		var day = sessionDay[i];
		result[instructor][day] += hoursPerSlot;
	  }
	  for (var i = 0; i < instructors.length; i++) {
		var maxHours = instructors[i].maxHours;
		var satisfied
		for (var j = 0; j < days.length; j++) {
		  if (result[instructors[i].userName][j] <= maxHours) {
			count++;
		  }
		}
	  }
	  return count;
	}

	function cloneSchedules() {
	  var returned = {};
	  initiateSchedule(returned);
	  for (var i = 0; i < sectionsN; i++) {
		for (var j = 0; j < days.length; j++) {
		  for (var k = 0; k < slots.count - slots.breaks.length; k++) {
			returned[i][j].push(schedules[i][j][k]);
		  }
		}
	  }
	  return returned;
	}

	function finalize() {
	  var slotsNumber = slots.count - slots.breaks.length;
	  for (var i = 0; i < sectionsN; i++) {
		for (var j = 0; j < days.length; j++) {
		  if (schedules[i][j].length < slotsNumber) {
			allocator(i, j, schedules[i][j].length, slotsNumber - schedules[i][j].length, null, null);
		  }
		}
	  }
	}

	var bestSchedules = null,
	  bestValue = -1;

	function selectBestSchedule() {
	  var maxHoursPerDay = evaluateMaxInstructorHours();
	  var preferredVacations = evaluatePreferredVacation();
	  var totalGaps = evaluateGaps() * -1;
	  var value = (maxHoursPerDay + preferredVacations + totalGaps) / 3;
	  if (bestSchedules === null || bestValue < value) {
		bestValue = value;
		bestSchedules = cloneSchedules();
	  }
	}

	var constant = 10;
	for (var s = 0; s < constant; s++) {
	  //permutate sessions
	  shuffleArray(sessions);
	  var day = 0;
	  var vacationDays = [];
	  for (var i = 0; i < sectionsN; i++) {
		vacationDays.push(Math.floor(Math.random() * days.length));
	  }
	  initiateSchedule(schedules);
	  for (var i = 0; i < sessions.length; i++) {
		var session = sessions[i];
		var numslots = session.slots;
		var section = session.section;
		if (day === vacationDays[section]) {
		  day = (day + 1) % (days.length);
		  i--;
		  continue;
		}
		var instructor = session.instructor;
		var type = session.type;
		var lastSlot = schedules[section][day].length;
		var numStudents = classNames[courses[session.course].className].students.length;
		var limit = Math.ceil(numStudents / roomMap.Section);
		var canAssign = checkRoomFree(day, lastSlot, lastSlot + numslots, type);
		var randRoom = canAssign;
		var sessionParam = (canAssign!==-1) ? session : null;
		if (type === "Lecture") {
		  //assign lectures for all sections of group
		  var sectionsCheck = checkSections(section + 1, limit, lastSlot, day);
		  if (sectionsCheck) {
			//assign lecture to all sections of group
			for (var j = section; j < section + numSections && j < limit; j++) {
			  allocator(j, day, lastSlot, numslots, randRoom, sessionParam);
			}
			sessionDay[i] = day;
		  } else {
			//assign gap to first section in group
			allocator(section, day, lastSlot, 1, randRoom, null);
			i--;
		  }
		} else {
		  //assign individual section
		  allocator(section, day, lastSlot, numslots, randRoom, sessionParam);
		  if (sessionParam === null)
			i--;
		  else
			sessionDay[i] = day;
		}
		/*
		finalize();
		selectBestSchedule();
		day = (day + 1) % (days.length);
	  }
}*/}}
	//return bestSchedules;
	return null;
}
