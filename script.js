var audio = new Audio('s4_basic_tone.mp3');
var alarmArrays = []
var ID_COUNT = 0;
var checkAlarmFunctionsList = [];
var tid = setInterval(function () {
    if (document.readyState !== 'complete') return;
    clearInterval(tid);
    // do your work
    audio = new Audio('s4_basic_tone.mp3');
    audio.loop = true;
}, 100);

// console.log(audio.loop)
var timeInFuture = "00:00";
var today = new Date();
var timeNow = today.getHours() + ":" + parseInt(parseInt(today.getMinutes()) + 1);
timeInFuture = timeNow;
// var timeField = document.getElementById('timefield');
// timeField.value = timeInFuture;
var x;
var alreayOn = false;

// check if time is equal to alarm
function checktime(id) {
    if (!alreayOn) {
        alreayOn = true;
        var index;
        for (var i = 0; i < alarmArrays.length; i++) 
        {
            if(alarmArrays[i][5] == id)
            {
                index = i;
                break;
            }
        }
        //document.getElementById("time").innerHTML = alarmArrays[index][1] + ":" + alarmArrays[index][2];
        //timeInFuture = alarmArrays[i][1] + ":" + alarmArrays[i][2]; 
        checkAlarmFunctionsList[id] = setInterval(function () {
            today = new Date();
            mediNow = today.getHours() >= 12 ? "pm" : "am";
            // console.log(mediNow, alarmArrays[i][3])
            // console.log(today.getHours(), alarmArrays[i][1])
            // console.log(today.getMinutes(), alarmArrays[i][2])
            if (today.getHours()%12 == alarmArrays[index][1] && today.getMinutes() == alarmArrays[index][2]  && mediNow == alarmArrays[index][3]) {
                console.log("matched")
                audio.play();
                var alarms =  document.getElementsByClassName('id');
                console.log("alarms size: ",alarms.length)
                for(var i = 0;i < alarms.length;i++){
                    console.log(alarms[i].value , " = " , id)
                    if (alarms[i].value == id){
                        console.log("trueeee")
                        //alarms[i].parentNode.getElementsByTagName('button')[1].style.color = "red";
                        alarms[i].parentNode.getElementsByTagName('button')[1].classList.remove("hidden");
                        break;
                    }
                }
                //document.getElementById('dismiss').style.color = "red";
                // stop time checking function
                clearInterval(checkAlarmFunctionsList[id]);
                // stop sound after 30 sec
                setTimeout(function() {
                    stopAlarm(id);
                },30000);
            } else {
                console.log(".")
            }
        }, 1000);
    }
}

// optional: initialize at start of the program
//checktime();

// stop alarm
function stopAlarm(id) {
    console.log("called")
    if (!audio.paused) {
        audio.pause();
    }
    audio.currentTime = 0;
    var alarms =  document.getElementsByClassName('id');
    for(var i = 0;i < alarms.length;i++){
        console.log(alarms[i].value , " = " , id)
        if (alarms[i].value == id){
            console.log("trueeee")
            //alarms[i].parentNode.getElementsByTagName('button')[1].style.color = "red";
            alarms[i].parentNode.getElementsByTagName('button')[1].classList.add("hidden");
            break;
        }
    }
    //document.getElementById('dismiss').style.color = "black";
    if (checkAlarmFunctionsList[id]) {
        clearInterval(checkAlarmFunctionsList[id]);
        alreayOn = false;        
    }
    setTimeout(function() {
        checktime(id);
    },60000);
}

function stopAlarmFromButton(e) {
    var id = e.parentNode.getElementsByTagName('input')[0].value;
    if (!audio.paused) {
        audio.pause();
    }
    audio.currentTime = 0;
    //e.style.color = "black";
    e.classList.add("hidden");
    if (checkAlarmFunctionsList[id]) {
        clearInterval(checkAlarmFunctionsList[id]);
        alreayOn = false;
    }
    setTimeout(function() {
        checktime(id);
    },60000);
}

// update time 
function updateAlarm(e) 
{
    const id = e.parentNode.getElementsByTagName('input')[2].value;
    console.log('id',id)
    for (var i = 0; i < alarmArrays.length; i++) 
    {
        if(alarmArrays[i][5] == id)
        {
            var min =  parseInt(document.getElementById('upd-minutes').value);
            if(min < 0 || min > 59) 
            {
                document.getElementById('error').innerHTML = "Enter a valid Minute number";
                return;
            } else {
                document.getElementById('error').innerHTML = "";
                
            }
            // new title
            console.log("check pass")
            alarmArrays[i][0] = (document.getElementById('upd-alarmName').value);
            // new hour
            alarmArrays[i][1] = parseInt(document.getElementById('upd-hour').value);
            // new miniute
            alarmArrays[i][2] = parseInt(document.getElementById('upd-minutes').value)
            // new meridian
            alarmArrays[i][3] = (document.getElementById('upd-am_pm').value);
            // new days
            var selected = []
            for (var option of document.getElementById('upd-days').options)
            {
                if (option.selected) 
                {
                    selected.push(option.value.charAt(0).toUpperCase()+ option.value.substr(1));
                }
            }   
            alarmArrays[i][4] = selected;

            // update alarm template
            var alarms = document.getElementsByClassName('alarm');
            for(var j = 0 ; j < alarms.length; j++)
            {
                // found alarm template
                console.log("update")
                if(alarms[j].getElementsByClassName('id')[0].value == id)
                {
                    alarms[j].getElementsByClassName('alarmName')[0].innerHTML = alarmArrays[i][0];
                    alarms[j].getElementsByClassName('time')[0].innerHTML = alarmArrays[i][1] + ":"+ (alarmArrays[i][2] < 10? "0"+alarmArrays[i][2] : alarmArrays[i][2]);
                    alarms[j].getElementsByClassName('merid')[0].innerHTML = alarmArrays[i][3];
                    alarms[j].getElementsByClassName('days')[0].innerHTML = alarmArrays[i][4].join(', ')
                    // reset template                    
                    cancelAlarmUpdate();
                }
            }
            
            break;
        }
    }
}

function cancelAlarmUpdate()
{
    document.getElementById('update-alarm-temp').style.display = "none";
    document.getElementById('error').innerHTML = "";
    document.getElementById('upd-hour').selectedIndex = 0;
    document.getElementById('upd-minutes').value = "";
    document.getElementById('upd-am_pm').selectedIndex = 0
    document.getElementById('upd-days').selectedIndex  = -1 
    document.getElementById('upd-alarmName').value = "";
}

document.getElementById('update-alarm-temp').style.display = "none";
function showUpdateTemplate(e)
{
    // upd-id
    const id = e.parentNode.getElementsByTagName('input')[0].value;
    document.getElementById('update-alarm-temp').style.display = "block";
    document.getElementById('upd-id').value = id;
}

// toogle alarm holder visibility
document.getElementsByClassName('holder')[0].style.display = "none";
function toogleAlarmHolder() {
   if(document.getElementsByClassName('alarm-holders')[0].children.length == 0){
        document.getElementsByClassName('holder')[0].style.display = "none";   
   } else {
        document.getElementsByClassName('holder')[0].style.display = "block";
   }
}


// check if the new alarm will be a duplicate
function alarmCanBeAdded(newAlarm) 
{
    console.log("Size: ",alarmArrays.length)
    if(alarmArrays.length == 0) return true;
    var sameNameTime = false;
    var sameWeekDays = false;
    for (var i = 0; i < alarmArrays.length; i++) 
    {
        if((alarmArrays[i][0] === newAlarm[0]) && (alarmArrays[i][1] == newAlarm[1]) &&
            (alarmArrays[i][2] == newAlarm[2]) && (alarmArrays[i][3] === newAlarm[3]))
        { 
            sameNameTime = true;
            if(alarmArrays[i][4].length == 0 && newAlarm[4].length == 0) {
                return false;
            }
            
            var temp = true;
            var sameLength = false;
            if(alarmArrays[i][4].length == newAlarm[4].length) {
                sameLength = true;
                for(var j = 0; j < alarmArrays[i][4].length;j++)
                {
                    if(alarmArrays[i][4][j] !== newAlarm[4][j])
                    {
                        temp = false;
                        break;
                    }
                }
            }
            if(temp && sameLength)
            {
                sameWeekDays = true;
                break;
            }
        }
    }
    return !sameNameTime || !sameWeekDays;
}

// add alarm to array and holder
function addAlarm(){
    //console.log(document.getElementById('days').value)
    var min = parseInt(document.getElementById('minutes').value);
    var given_time = parseInt(document.getElementById('hour').value);
    var given_name = (document.getElementById('alarmName').value);
    var given_meridian = (document.getElementById('am_pm').value);
    var selected = [];
    var tempAlarm = [];
    if(min < 0 || min > 59) return;
    for (var option of document.getElementById('days').options)
    {
        if (option.selected) 
        {
            selected.push(option.value.charAt(0).toUpperCase()+ option.value.substr(1));
        }
    }    
    tempAlarm.push(given_name);
    tempAlarm.push(given_time);
    tempAlarm.push(min);
    tempAlarm.push(given_meridian);
    tempAlarm.push(selected);
    tempAlarm.push(ID_COUNT);
    console.log(alarmCanBeAdded(tempAlarm))
    if(alarmCanBeAdded(tempAlarm) == true)
    {
        alarmArrays.push(tempAlarm);
        //console.log(alarmArrays);
        
        var temp = document.getElementsByTagName("template")[0];
        var clon = temp.content.cloneNode(true);
        clon.querySelectorAll(".time")[0].innerHTML = given_time+":"+((min < 10)?"0"+min:min);;
        clon.querySelectorAll(".days")[0].innerHTML = selected.join(', ');
        clon.querySelectorAll(".alarmName")[0].innerHTML = given_name;
        clon.querySelectorAll(".merid")[0].innerHTML = " "+given_meridian;
        clon.querySelectorAll(".id")[0].value = ID_COUNT++;
        clon.querySelectorAll(".stop-btn")[0].classList.add("hidden");
        if(document.getElementsByClassName('alarm-holders').length >= 5){
            document.getElementsByClassName('alarm-holders')[0].classList.add("hide-overflow");
        } else {
            document.getElementsByClassName('alarm-holders')[0].classList.remove("hide-overflow");
        }
        document.getElementsByClassName('alarm-holders')[0].appendChild(clon);
        toogleAlarmHolder();
        // 
        checktime(ID_COUNT-1);
    }
}

// remove array from html and array and clear timer function  
function deleteAlarm(e) {
    var index;
    for (var i = 0; i < alarmArrays.length; i++) 
    {
        if(alarmArrays[i][5] == e.parentNode.getElementsByTagName('input')[0].value)
        {
            index = i;
            break;
        }
    }
    if(index != null){
        alarmArrays.splice(index,1);
        console.log("removed")
    }
    const id = e.parentNode.getElementsByTagName('input')[0].value;
    console.log(id);
    e.parentElement.remove();
    toogleAlarmHolder();
    stopAlarm(id);
    clearInterval(checkAlarmFunctionsList[id])
    checkAlarmFunctionsList.splice(id,1);
}




////////////////////////////// ripple stuff ///////////////////////////////////////

function createRipple(event) {
  const button = event.currentTarget;

  const circle = document.createElement("span");
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
  circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
  circle.classList.add("ripple");

  const ripple = button.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }

  button.appendChild(circle);
}

const buttons = document.getElementsByTagName("button");
for (const button of buttons) {
  button.addEventListener("click", createRipple);
}