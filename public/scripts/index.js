var socket = io.connect();
socket.emit("start", {});
socket.on("start", function(data) {
	var courses = data.table;
	var days = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'];
	var slots = {start:'08:00',duration:'1:00',count:15,breaks:[4,8,12],break_duration:'0:20'};

	function tableCreate() {
		var body = document.getElementById('tablediv');
		var tbl = document.createElement('table');
		tbl.setAttribute("id","myTable");
		
		var thd = document.createElement('thead');
		var row = document.createElement('tr');
		thd.setAttribute("class","ant-table-thead");
		var head = document.createElement('th')
		head.setAttribute('rowspan',2);
		head.setAttribute('colspan',1);
		head.appendChild(document.createTextNode('Day'));
		row.appendChild(head);
		var start = slots.start,brk=0,end=undefined;
		for(var i=0;i<2;i++)
			{
				if(i>0)
					row = document.createElement('tr');
				for(var j=0;j<slots.count;j++)
					{
					head = document.createElement('th')
					head.setAttribute('class','column1');
					head.setAttribute('colspan',1);
					if(i===0)
						head.appendChild(document.createTextNode(j+1));
					else{
						if(slots.breaks.length>brk && j+1===slots.breaks[brk])
							{
							end = calcTo(start,slots.break_duration);
							brk++;
							}
						else
							end = calcTo(start,slots.duration);
						head.appendChild(document.createTextNode(start+'-'+end));
						start = end;
						}
					row.appendChild(head);
					}
		thd.appendChild(row);
		}
		tbl.appendChild(thd);
		var tbd = document.createElement('tbody');
		tbl.appendChild(tbd);
		body.appendChild(tbl);
		for(var i=0;i<days.length;i++)
		{	
			row = document.createElement('tr');
			row.setAttribute("id", i);
			brk=0;
			for(var j=0;j<slots.count+1;j++)
			{	var td = document.createElement('td');
				if(j==0)
				{
					td.style.backgroundColor = 'rgb(156, 52, 104)';
					td.style.color = 'rgb(255, 255, 255)';
					td.style.textAlign = 'left';
					td.appendChild(document.createTextNode(days[i]));
					td.setAttribute("id", "st"+i);
					row.appendChild(td);
				}
				else{
					td.setAttribute("class","column1");
					if(slots.breaks.length>brk && j===slots.breaks[brk])
						{
							if(i===0)
							{
								td.setAttribute('rowspan',days.length);
								td.appendChild(document.createTextNode('b'));
								td.appendChild(document.createElement('br'));
								td.appendChild(document.createTextNode('r'));
								td.appendChild(document.createElement('br'));
								td.appendChild(document.createTextNode('e'));
								td.appendChild(document.createElement('br'));
								td.appendChild(document.createTextNode('a'));
								td.appendChild(document.createElement('br'));
								td.appendChild(document.createTextNode('k'));
								td.style.textAlign = 'center';
								td.setAttribute("colspan",arr[i][j-1]);
								row.appendChild(td);
							}
						brk++;
						}
					else{
						var namespan = document.createElement('span');
					var roomspan = document.createElement('span');
					td.style.position="relative";
					roomspan.style.color='red';
					roomspan.style.bottom = '0';
					roomspan.style.right = '0';
					roomspan.style.marginRight = '10px';
					roomspan.style.position = "absolute";
					roomspan.appendChild(document.createTextNode(courses[i][j-1-brk].room));
					namespan.style.textAlign = "center";
					namespan.appendChild(document.createTextNode(courses[i][j-1-brk].name));
					td.appendChild(namespan);
					td.appendChild(document.createElement('br'));
					td.appendChild(roomspan);
					td.style.textAlign = "center";
					td.setAttribute("colspan",arr[i][j-1]);
					if(arr[i][j-1]>0)
					row.appendChild(td);
						}
				
				}
			}
			tbd.appendChild(row);
		}
	}
	var input = document.getElementById("myInput");
	var inputcount=0,first=[];
	for(var i=0;i<days.length-1;i++)
		first.push(false);
function filterDays() {
  var  filter, table, tr, td, i;
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  if(input.value.length<inputcount)
  {
	  for(i=3;i<tr.length;i++)
	  {   if(first[i-3])
		  {
			  var k=0,cnt=0;
			  for(var j=0;j<tr[i].childNodes.length;j++)
			{
				if(k===slots.breaks[cnt])
				{
					tr[i].removeChild(tr[i].childNodes[j]);
					cnt++;
					k++;
				}
				k+=tr[i].childNodes[j].colSpan;
				
			}
		  first[i-3]=false; 
		}
	  }
  }
  inputcount = input.value.length;
  filter = input.value.toUpperCase();
  var z=true;
  for (i = 0; i < tr.length; i++) {
    tds = tr[i].getElementsByTagName("td");
    td = tds[0];
	if (td) {
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
		  
		if(i===2)z=false;
		if(z && i>2 && inputcount>=1 && !first[i-3])
		{	
			var k=0,cnt=0;
			for(var j=0;j<tr[i].children.length;j++){
			if(k===slots.breaks[cnt]){
			var ntd = document.createElement("td");
			ntd.appendChild(document.createTextNode('break'));
			tr[i].insertBefore(ntd,tr[i].children[j]);
			
			cnt++;
			j++;
			k++;
			}
			k+=tr[i].children[j].colSpan;
			console.log(tr[i].children.length);
			}
			first[i-3]=true;
		}
		tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}
	function calcTo(from,dur)
	{
		var minfrom = parseInt(from.slice(from.indexOf(':')+1));
		var mindur = parseInt(dur.slice(dur.indexOf(':')+1));
		var hourfrom = parseInt(from.slice(0,from.indexOf(':')));
		var hourdur = parseInt(dur.slice(0,dur.indexOf(':')));
		var summin=minfrom+mindur,sumhour=hourfrom+hourdur;
		if(summin > 59)
		{
		  summin = 60-summin;
		  sumhour = sumhour+1;
		}
		if(sumhour > 23)
		{
		  sumhour = 24 - sumhour;
		}
		return (sumhour<10?'0'+sumhour:sumhour)+":"+(summin<10?'0'+summin:summin);
	}
	function cols()
	{
	let count = [];
	for (let i in days)
	{
	  let name = courses[i][0].name,room = courses[i][0].room,cnt=1;
	  let arr =[];
	  if(name==='')arr.push(1);
	  let j=1;
	  let brk=0;
	  for(;j<slots.count;j++)
	  {

		if(slots.breaks.length>brk && j+1===slots.breaks[brk])
		{
		  brk++;
		  if(name!=='')
		  {

			  arr.push(cnt);
			  for(let k=j-cnt;k<j-1;k++)
			  arr.push(0);
			  cnt=1;
			  name='';
			  room='';
		  }
		  arr.push(1);
		}

		else if(name==='' && courses[i][j-brk].name==='')arr.push(1);
		else if(name===courses[i][j-brk].name && room === courses[i][j-brk].room && courses[i][j-brk].name!=='')
		cnt++;
		else if(name===''&&courses[i][j-brk].name!==''){
		name = courses[i][j-brk].name;
		room = courses[i][j-brk].room;
		}
		else {
		  arr.push(cnt);
		  for(let k=j-cnt;k<j-1;k++)
		  arr.push(0);
		  name =courses[i][j-brk].name;
		  room = courses[i][j-brk].room;
		  cnt=1;
		  if(name==='')arr.push(1);
		}
	  }
	  if(name!=='' && name===courses[i][j-brk-1].name)
	  {
		arr.push(cnt);
		for(let k=j-cnt;k<j-1;k++)
		arr.push(0);
	  }
	  count.push(arr);
	}
	return count;
	}


	var arr = cols();

	console.log(arr);
	tableCreate();
	document.getElementById("myInput").addEventListener("keyup", filterDays);

	var sub = ["", "Agile", "Microcontrollers", "HR", "AI", "Networks", "Formal"];

	function fill(sel, arr) {
		for(var i=0; i<arr.length; i++) {
			var option = document.createElement("option");
			option.text = arr[i];
			sel.add(option);
		}
	}
	var rooms = ['911','912','931','Emb. lab'];
	var ds =document.getElementById("day"), ss = document.getElementById("sub"), rs = document.getElementById("room"); 
	ss.addEventListener("change", change);
	rs.disabled = true;
	function change() {
		if(ss.selectedIndex===0)
			rs.disabled = true;
		else
			rs.disabled = false;
	}
	fill(ds, days);
	fill(ss, sub);
	fill(rs,rooms);
	var fs=document.getElementById("fs"), ls = document.getElementById("ls");
	for(var i=1; i<=slots.count;i++) {
		if(slots.breaks.indexOf(i) > -1)
			continue;
		fill(fs, [i]);
		fill(ls, [i]);
	}

	function reRow(i) {
		var row = document.getElementById(i);
		while(row.lastChild.getAttribute("id")!=="st"+i) {
			row.removeChild(row.lastChild); 
		}
		var acc = 0;
		for(var j=0; j<courses[i].length; j++) {
			//alert(i+", " + j + ": " + courses[i][j].name);
			var name = courses[i][j].name, room = courses[i][j].room;
			var td = document.createElement("td");
			td.setAttribute("class","column1");	
			if(i===0 && slots.breaks.indexOf(acc+1)>-1) {
				td.setAttribute('rowspan',days.length);
				td.appendChild(document.createTextNode('b'));
				td.appendChild(document.createElement('br'));
				td.appendChild(document.createTextNode('r'));
				td.appendChild(document.createElement('br'));
				td.appendChild(document.createTextNode('e'));
				td.appendChild(document.createElement('br'));
				td.appendChild(document.createTextNode('a'));
				td.appendChild(document.createElement('br'));
				td.appendChild(document.createTextNode('k'));
				td.style.textAlign = 'center';
				td.setAttribute("colspan", 1);
				row.appendChild(td);	
				acc++;
				j--;
			}
			else {
				if(slots.breaks.indexOf(acc+1)>-1) {
					acc++;
				}	
				var rs = 1, t=0;
				for(var k=j+1; k<courses[i].length; k++) {
					if(name!=="" && name===courses[i][k].name && room === courses[i][k].room && slots.breaks.indexOf(rs+acc+1)===-1) {
						rs++;
						t++;
						//alert(rs+"," + acc + ", " + k);
					}
					else
						break;
				}
				j += t;
				//alert(rs);
				var namespan = document.createElement('span');
					var roomspan = document.createElement('span');
					td.style.position="relative";
					roomspan.style.color='red';
					roomspan.style.bottom = '0';
					roomspan.style.right = '0';
					roomspan.style.marginRight = '10px';
					roomspan.style.position = "absolute";
					roomspan.appendChild(document.createTextNode(courses[i][j].room));
					namespan.style.textAlign = "center";
					namespan.appendChild(document.createTextNode(courses[i][j].name));
					td.appendChild(namespan);
					td.appendChild(document.createElement('br'));
					td.appendChild(roomspan);
					td.style.textAlign = "center";
				td.setAttribute("colspan", rs);
				row.appendChild(td);
				acc+=rs;
			}
		}
	}
	
	function edited() {
		var ret = "{ \"table\" : [ ";
		for(var i =0; i<days.length; i++) {
			ret += " [ ";
			for(var j=0; j<courses[i].length; j++) {
				ret += " { \"name\" : \"" + courses[i][j].name + "\" , \"room\" : \"" + courses[i][j].room + "\" } ";
				if(j!=courses[i].length - 1)
					ret += " , ";
			}
			ret += " ] ";
			if(i!=days.length-1)
				ret += " , ";
		}
		return (ret + " ] }");
	}
	
	function click() {
		var ifs =fs.selectedIndex, ils = ls.selectedIndex; 
		if(ifs > ils)
			alert("First slot can't be after last slot");
		else {
			var ind = ds.selectedIndex;
			var ssv = ss.value, rsv = rs.value;
			if(ssv==="")
				rsv="";
			for(var i=ifs; i<= ils; i++) {
				courses[ind][i].name = ssv;
				courses[ind][i].room = rsv;
			}
			/*
			for(var i=0; i< courses[ind].length; i++)
				alert(courses[ind][i].name);*/
			var aft = edited();
			socket.emit("edit", aft);
			reRow(ind);
		}
	}

	var modify = document.getElementById("modify");
	modify.addEventListener("click", click);

	document.getElementById("back").addEventListener("click", clickb);
	function clickb() {
		location.href = "https://timetableG3n.eu-gb.mybluemix.net/admin";
	}
});