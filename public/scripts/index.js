var socket = io.connect();
socket.emit("start", {});

//socket.emit('generate', {});
socket.on("trivial", function(data) {
	alert(data.d);
});
socket.on("start", function(data) {
  var toSlots = {"lec":3, "sec":2, "lab":2};
  var subjects=["agile","formal","AI","HR","micro","networks"];
  var types = ["lec","sec","lab"];
  var instructors=["dr.ahmed","dr.haytham","dr.cherif salama","dr.ayman","dr sherif hammad","dr.islam"];
  var rooms = ["391", "350", "911", "921A"];

  var radios = {"subjects":0,"types":0,"instructors":0,"rooms":0};
  var special = document.getElementById("special");
  special.draggable = true;
  special.addEventListener("dragstart", dragstart);
  var bin = document.getElementById("bin");
  bin.addEventListener("dragover", dragover);
  bin.addEventListener("drop", bindrop);

  function getLimits(row, start, colSpan) {
    for(var i=start+1; i<slots.len; i++) {
      if(courses[row][i].name===courses[row][start].name &&
         courses[row][i].room===courses[row][start].room) {
        colSpan++;
      }
      else {
        break;
      }
    }
    for(var i=start-1; i>=0; i--) {
      if(courses[row][i].name===courses[row][start].name &&
         courses[row][i].room===courses[row][start].room) {
        start--;
        colSpan++;
      }
      else {
        break;
      }
    }
    return {"start":start, "colSpan":colSpan};
  }

  function bindrop(ev) {
    ev.preventDefault();
    var id = ev.dataTransfer.getData("text");
    if(id.substring(0,4)!="cell") {
      return;
    }
    var data = document.getElementById(id);
    var row = data.row, start = data.start, colSpan = 1;
    if(courses[row][start].name==="") {
      return;
    }
    var limits = getLimits(row, start, colSpan);
    start=limits.start;
    colSpan=limits.colSpan;
    for(var i=start; i<start+colSpan; i++){
      courses[row][i].name=courses[row][i].room = "";
    }
    reRow(row);
  }

  function dragstart(ev) {
    ev.dataTransfer.setData("text", ev.target.id);	
  }

  function radioClicked() {
    radios[this.name]=this.value;
    special.innerHTML = subjects[radios["subjects"]]+"-"+types[radios["types"]]+"-"+
    instructors[radios["instructors"]]+"-"+rooms[radios["rooms"]];
  }

  function makeList(id, array) {
    var list = document.getElementById(id);
    for(var i=0; i<array.length; i++) {
      var li = document.createElement("li");
      li.innerHTML=array[i];
      if(id==="types") {
        li.innerHTML += ": " + toSlots[array[i]] + " slots";
      }
      var space = document.createElement("div");
      space.className = "space";
      var input = document.createElement("input");
      input.type="radio";
      input.name = id;
      input.value=i;
      var br = document.createElement("br");
      li.appendChild(space);
      li.appendChild(input);
      list.appendChild(li);
      input.addEventListener("click", radioClicked);
      if(i===0)
        input.click();
    }
  }

  makeList("subjects", subjects);
  makeList("types", types);
  makeList("instructors", instructors);
  makeList("rooms", rooms);

  function modifyHelper(id) {
      var input, filter, ul, li, i;
      input = document.getElementById(id+"Input");
      filter = input.value.toUpperCase();
      ul = document.getElementById(id);
      li = ul.getElementsByTagName("li");
      for (i = 0; i < li.length; i++) {
          if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
              li[i].style.display = "";
          } else {
              li[i].style.display = "none";
          }
      }
  }

  function modifySubjects() {
    modifyHelper("subjects");
  }
  function modifyTypes() {
    modifyHelper("types");
  }
  function modifyInstructors() {
    modifyHelper("instructors");
  }
  function modifyRooms() {
    modifyHelper("rooms");
  }
  document.getElementById("subjectsInput").addEventListener("keyup", modifySubjects);
  document.getElementById("typesInput").addEventListener("keyup", modifyTypes);
  document.getElementById("instructorsInput").addEventListener("keyup", modifyInstructors);
  document.getElementById("roomsInput").addEventListener("keyup", modifyRooms);

    var courses = data.table;
    //console.log(courses);
    //alert(courses);
    var days = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'];
    var slots = {start:'08:00',duration:'1:00', len:12, count:15,breaks:[4,8,12],break_duration:'0:20'};

    function tableCreate() {
      var body = document.getElementById('tablediv');
      var tbl = document.createElement('table');

    tbl.style.zIndex='1';
    tbl.setAttribute("id","myTable");

    var thd = document.createElement('thead');
    var row = document.createElement('tr');
    thd.setAttribute("class","ant-table-thead");
    var head = document.createElement('th')
    head.setAttribute('rowspan',2);
    head.setAttribute('colspan',1);
      head.appendChild(document.createTextNode('Day'));
    var a = document.createElement('a');
    a.href="#";
    a.id="filter";
    var filter_icon = document.createElement('span');
    filter_icon.style.fontSize="10px";
    filter_icon.title="Filter days";
    filter_icon.className="glyphicon glyphicon-filter icon";
    a.addEventListener("click",filterDays);
    filter_icon.style.marginLeft='4px';
    a.appendChild(filter_icon);
    head.appendChild(a);
    row.appendChild(head);
    var start = slots.start,brk=0,end=undefined;
    for(var i=0;i<2;i++)
      {
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
    row = document.createElement('tr');
    }
    tbl.appendChild(thd);
    var tbd = document.createElement('tbody');
    for(var i=0;i<days.length;i++)
    {	brk=0;
      row = document.createElement('tr');
      row.setAttribute("id", i);
      for(var j=0;j<slots.count+1;j++)
      {	var td = document.createElement('td');
        if(j==0)
        {
          td.setAttribute("class","column2");
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
              td.start=j-1-brk;
              td.row = i;
              td.addEventListener("dragover", dragover);
              td.addEventListener("drop", drop);
              td.draggable = true;
              td.addEventListener("dragstart", dragstart);
              td.setAttribute("id", "cell"+td.row+","+td.start);
            }

        }
      }
      tbd.appendChild(row);
      row = document.createElement('tr');
    }
    tbl.appendChild(tbd);
    body.appendChild(tbl);
  }

  function dragover(ev) {
      ev.preventDefault();
  }
  function drop(ev) {
      ev.preventDefault();
      var id = ev.dataTransfer.getData("text");
      if(!(id==="special" || id.substring(0,4)==="cell")) {
        return;
      }
      var data = document.getElementById(id);
      var row = this.row, start = this.start, colSpan = 1, type = types[radios["types"]];
      if(courses[row][start].name!=="") {
        var limits = getLimits(row, start, colSpan);
        start= limits.start;
        colSpan = limits.colSpan;
      }
      if(data.id==="special") {
        if(start+toSlots[type]-1>=slots.len) {
          alert("Not enough slots!");
          return;
        }
        for(var i=start+colSpan; i<start+toSlots[type]; i++) {
          if(courses[row][i].name!=="") {
            alert("Slot(s) used by other session exist(s)!");
            return;
          }
        }
        for(var i=start+toSlots[type]; i<start+colSpan; i++) {
          courses[row][i].name = courses[row][i].room = "";
        }
        for(var i =start; i<start+toSlots[type]; i++) {
          courses[row][i].name =  subjects[radios["subjects"]]+"-"+types[radios["types"]]+"-"+
    instructors[radios["instructors"]];
          courses[row][i].room = rooms[radios["rooms"]];
        }
        reRow(row);
      }
      else if(data.id.substring(0,4)==="cell") {
        var row2 = data.row, start2 = data.start, colSpan2 = 1;
        if(courses[row2][start2].name!=="") { 
          var limits = getLimits(row2, start2, colSpan2);
          start2= limits.start;
          colSpan2 = limits.colSpan;
        }
        if(start+colSpan2-1>=slots.len || start2+colSpan-1>=slots.len) {
          alert("Not enough slots!");
          return;
        }
        for(var i=start+colSpan; i<start+colSpan2; i++) {
          if(courses[row][i].name!=="") {
            alert("Slot(s) used by other session exist(s)!");
            return;
          }
        }
        for(var i=start2+colSpan2; i<start2+colSpan; i++) {
          if(courses[row2][i].name!=="") {
            alert("Slot(s) used by other session exist(s)!");
            return;
          }
        }
        var name=courses[row][start].name, room =courses[row][start].room;
        var name2=courses[row2][start2].name, room2 =courses[row2][start2].room;
        for(var i=start+colSpan2; i<start+colSpan; i++) {
          courses[row][i].name = courses[row][i].room = "";
        }
        for(var i=start2+colSpan; i<start2+colSpan2; i++) {
          courses[row2][i].name = courses[row2][i].room = "";
        }
        for(var i=start; i<start+colSpan2; i++) {
          courses[row][i].name = name2;
          courses[row][i].room = room2;
        }
        for(var i=start2; i<start2+colSpan; i++) {
          courses[row2][i].name = name;
          courses[row2][i].room = room;
        }
        reRow(row);
        reRow(row2);
      }
  }

    function filterCreate()
  {
    var body = document.getElementById('tablediv');
      var menu = document.createElement('div');
    menu.style.position='absolute';

    var filterRect = document.getElementById('filter').getBoundingClientRect();
    console.log(filterRect.right+" "+filterRect.bottom);
    menu.style.left=filterRect.right+'px';
    menu.style.top=filterRect.bottom+'px';
    menu.style.zIndex='2';
    menu.id="myDropdown";
    menu.className="dropdown-content";
    for(var i=0;i<days.length;i++)
    {
      var item = document.createElement('a');
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.style.cursor="pointer";
      checkbox.id="chk"+i;
      var label = document.createElement('span');
      label.style.paddingLeft='12px';
      label.innerHTML=days[i];
      item.appendChild(checkbox);
      item.appendChild(label);
      menu.appendChild(item);
    }
    var btns = document.createElement('div');
    btns.style.borderTop='solid 1px';
    btns.setAttribute('class','ant-table-filter-dropdown-btns');
    var OK_btn = document.createElement('span');
    OK_btn.innerHTML="OK";
    OK_btn.className="ok";
    OK_btn.style.float='left';
    OK_btn.addEventListener('click',fdays);
    var Reset_btn = document.createElement('span');
    Reset_btn.innerHTML="Reset";
    Reset_btn.className="reset";
    Reset_btn.style.float='right';
    Reset_btn.addEventListener('click',rdays);
    btns.appendChild(OK_btn);
    btns.appendChild(Reset_btn);
    menu.appendChild(btns);
    body.appendChild(menu);
  }

    var input = document.getElementById("myInput");
    var inputcount=0,first=[];
    for(var i=0;i<days.length-1;i++)
      first.push(false);
  function searchTable() {
    var  filter, table, tr, td, i;
    var checked=[];
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
    for (i = 2; i < tr.length; i++) {
      checked.push(false);
    tds = tr[i].getElementsByTagName("td");
    var spans = 0;
    for(var l=1;l<tr[i].childNodes.length;l++){
      td = tds[l];
    var text = td.childNodes[0].innerHTML;
    if (td&&td.childNodes[0]&&text) {
      text = courses[i-2][spans].name;
      var roomtext = courses[i-2][spans].room;
      var index = text.toUpperCase().indexOf(filter);
      var roomindex = roomtext.toUpperCase().indexOf(filter);
      if (index > -1 || roomindex>-1) {
      if(i===2)z=false;
      if(z && i>2 && inputcount>=1 && !first[i-3])
      {
        var k=0,cnt=0;
        for(var j=0;j<tr[i].children.length;j++){
        if(k===slots.breaks[cnt]){
        var ntd = document.createElement("td");
        ntd.appendChild(document.createTextNode('break'));
        tr[i].insertBefore(ntd,tr[i].children[j]);
        if(spans+1>=slots.breaks[cnt])l++;
        cnt++;
        j++;
        k++;
        }
        k+=tr[i].children[j].colSpan;
        console.log(tr[i].children.length);
        }
        first[i-3]=true;
      }
      if(index>-1)
      {var innerHTML = text.substring(0,index) + "<span style='text-align: center;' class='highlight'>" + text.substring(index,index+inputcount) + "</span>" + text.substring(index + inputcount);
          td.childNodes[0].innerHTML = innerHTML;
      }
      else{
        td.childNodes[0].innerHTML = text;
      }
      if(roomindex>-1)
      {var innerHTML2 = roomtext.substring(0,roomindex) + "<span style='text-align: center;' class='highlight'>" + roomtext.substring(roomindex,roomindex+inputcount) + "</span>" + roomtext.substring(roomindex + inputcount);
          td.childNodes[2].innerHTML = innerHTML2;
      }
      else {
        td.childNodes[2].innerHTML = roomtext;
      }
      tr[i].style.display = "";
      checked[i]=true;
        }

      else {
      td.childNodes[0].innerHTML = text;
      if(!checked[i]){
          tr[i].style.display = "none";
        }
      }
    }
    else if(!checked[i]) tr[i].style.display = "none";

    if(td.innerHTML !== "b<br>r<br>e<br>a<br>k" && td.innerHTML !== "break")
    spans+=tds[l].colSpan;
      }
      if(input.value.length===0)
        tr[i].style.display = "";
    }
  }
  function removebreaks()
  {


    //console.log(inserted);
    for(var i=3;i<tr.length;i++){
        if(inserted[i])
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
          inserted[i]=false;
        }
    }
  }
  function insertbreaks(i)
  {
     var tr = document.getElementById("myTable").getElementsByTagName("tr");
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
        }
  }
  function fdays()
  {
    var tr = document.getElementById("myTable").getElementsByTagName("tr");
    var z=true;
    for(var i=0;i<days.length;i++)
    {
      var checkbox = document.getElementById("chk"+i);
      if(checkbox.checked)
      {
        if(i===0){z=false;removebreaks();}
        else if(z && !inserted[i+2]){
        insertbreaks(i+2);
        inserted[i+2]=true;
        }
        tr[i+2].style.display = "";
      }else
      {tr[i+2].style.display = "none";
      }
    }
  }
  function rdays()
  {
    var tr = document.getElementById("myTable").getElementsByTagName("tr");
    removebreaks();
    for(var i=0;i<days.length;i++)
    {
      var checkbox = document.getElementById("chk"+i);
      checkbox.checked = false;
      tr[i+2].style.display = "";
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

    function filterDays(event) {
      var filter = document.getElementById("myDropdown");
    console.log(event.clientX+" "+event.clientY);
    filter.style.left = event.clientX.offsetX+5+"px";
    filter.style.top = event.clientY.offsetY+5+"px";
    filter.classList.toggle("show");
  }


  window.onclick = function(event) {
    var divRect = document.getElementById('myDropdown').getBoundingClientRect();
    var b = (event.clientX >= divRect.left && event.clientX <= divRect.right &&
        event.clientY >= divRect.top && event.clientY <= divRect.bottom);
    if (!(event.target.matches('.icon'))&&!b) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
    tableCreate();
    document.getElementById("myInput").addEventListener("keyup", searchTable);
    var tr = document.getElementById("myTable").getElementsByTagName("tr");
    var inserted = [];
    for(var i=0;i<tr.length;i++)
      inserted.push(false);
    filterCreate();

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
          td.start=j-rs+1;
          td.row=i;
          td.addEventListener("dragover", dragover);
          td.addEventListener("drop", drop);
          td.draggable = true;
          td.addEventListener("dragstart", dragstart);
          td.setAttribute("id", "cell"+td.row+","+td.start);
          acc+=rs;
        }
      }
    }

    /*
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
        var aft = edited();
        //socket.emit("edit", aft);
        reRow(ind);
      }
    }

    var modify = document.getElementById("modify");
    modify.addEventListener("click", click);
  */
    document.getElementById("back").addEventListener("click", clickb);
    function clickb() {
      location.href = "https://timetableG3n.eu-gb.mybluemix.net/admin";
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

    window.addEventListener("unload", unload);

    function unload() {
      var finalVersion = edited();
      socket.emit("edit", finalVersion);
    }
  });