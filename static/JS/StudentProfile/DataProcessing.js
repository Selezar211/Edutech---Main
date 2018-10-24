


function FlattenReceivedJSONToFindUpcomingClass(inputJSON) {

    subjectArray = [];
    dayArray = [];
    timeStartArray = [];
    timeEndArray = [];

    workingSubjectString = '';
    //print(inputJSON);

    let key;
    for (key in inputJSON) {

        currentGrade = key;
        // print(currentGrade);

        let key2;
        for (key2 in inputJSON[currentGrade]) {

            currentSubject = key2;
            //print(currentSubject);

            let key3;
            for (key3 in inputJSON[currentGrade][currentSubject]['Streams']) {

                currentBatch = key3;
                //print(currentBatch);

                //now make the subject array
                workingSubjectString = currentBatch + '|' + currentSubject + '|' + currentGrade;
                subjectArray.push(workingSubjectString);
                workingSubjectString = '';

                //now need to make the timing arrays
                oneDayArr = [];
                oneStartTimeArr = [];
                oneEndTimeArr = [];
                let key4;
                for (key4 in inputJSON[currentGrade][currentSubject]['Streams'][currentBatch]['Timings']) {

                    currentFullTiming = inputJSON[currentGrade][currentSubject]['Streams'][currentBatch]['Timings'][key4];
                    //print(currentFullTiming);

                    //now we can split this full timing into the components that we need
                    splitTiming = currentFullTiming.split(' ');
                    thisDay = splitTiming[0];
                    thisStartingTime = splitTiming[1];
                    thisEndingTime = splitTiming[3];

                    //now we can push this timing into their respective arrays
                    oneDayArr.push(thisDay);
                    oneStartTimeArr.push(thisStartingTime);
                    oneEndTimeArr.push(thisEndingTime);
                }

                dayArray.push(oneDayArr);
                timeStartArray.push(oneStartTimeArr);
                timeEndArray.push(oneEndTimeArr);

            }

        }
    }

    outputArr = [];

    outputArr.push(subjectArray);
    outputArr.push(dayArray);
    outputArr.push(timeStartArray);
    outputArr.push(timeEndArray);

    return (outputArr);
}

function ReturnUpcomingClass(subjectArray, dayArray, timeStartArray) {

    // subjectArray = [ 'Batchone|Physics|O LEVEL' , 'BatchTwo|Chemistry|A LEVEL'];
    // dayArray = [ ['Sunday' , 'Monday', 'Sunday'] , ['Friday' , 'Monday' , 'Sunday'] ];
    // timeStartArray = [ ['3:00' , '5:00' , '6:00'], ['1:00' , '24:00' , '15:00'] ];
    //Return upcoming class
    todayIndex = getCurrentDay();
    weekDayArr = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday' , 'Friday', 'Saturday'];

    let d = new Date();
    let curr_hour = d.getHours();
    let curr_minute = d.getMinutes();

    fullCurrentTimingInt = parseInt(String(curr_hour) + String(curr_minute));

    upcomingSubject = 'Kick back and relax!';
    upcomingTime = 'All done for today';

    indexNumsTobeDeleted = [];

    dayIncrementer = 0;
    today = weekDayArr[(todayIndex + dayIncrementer)];
    //loop through the given timings and get rid of timings which are not today
    for (let i = 0; i < subjectArray.length; i++) {

        oneDayArray = dayArray[i];

        //now delete the timings which are not today
        for (let y = 0; y < oneDayArray.length; y++) {

            if (oneDayArray[y] != today) {

                indexNumsTobeDeleted.push(y);
            }
        }
        //now loop through and delete the entries which are not today
        for (var z = indexNumsTobeDeleted.length - 1; z >= 0; z--) {
            dayArray[i].splice(indexNumsTobeDeleted[z], 1);
            timeStartArray[i].splice(indexNumsTobeDeleted[z], 1);
        }

        indexNumsTobeDeleted = [];
    }

    //now we can access the time start array and make everything in accendning order::
    jsonKey = {};
    ascTimings = [];
    for (let q = 0; q < timeStartArray.length; q++) {

        //this is for one subject
        workingSubject = subjectArray[q];
        print(workingSubject)

        for (let w = 0; w < timeStartArray[q].length; w++) {

            //convert the timing to integer -> 5:00 -> 500
            lol = timeStartArray[q][w].split(':');

            fullString = parseInt(lol[0] + lol[1]);

            ascTimings.push(fullString);
            jsonKey[fullString] = workingSubject
        }
    }

    //sort the timings ascending order
    ascTimings.sort(function (a, b) { return a - b });

    print(ascTimings);
    print(jsonKey);

    //now loop through it to find the next closest time

    for (let s = 0; s < ascTimings.length; s++) {

        if (fullCurrentTimingInt < ascTimings[s]) {
            upcomingTime = ascTimings[s];

            upcomingSubject = jsonKey[upcomingTime];
            upcomingSubject = upcomingSubject.split('|').join(' - ');
            break;
        }
    }

    print(upcomingTime);
    print(upcomingSubject);

    //now do the condition for checking if an actual upcoming subject was found, if not then redo with next day as the argument

    output = [];

    output.push(upcomingTime);
    output.push(upcomingSubject);

    return output;
}

function SetHomeTabStuff(tableData){
    //Change the top name to user name and change some stuff on the page to reflect the user
    document.getElementById("BlackBoardStudentName_ID").innerHTML = `Welcome back ${tableData['UserName']}!`;
    document.getElementById("UID_Setting_ID").innerHTML = `Personal UID : ${Current_UID}`;
    document.title = tableData['UserName'] + ' - Profile';

    //pass in the full timing data to update upcoming class
    UpdateUpcomingClass(tableData);
    SetTodaysDate();
}

function UpdateUpcomingClass(tableData){
    //this function will update the upcoming class in the home tab
    receivedOutput = FlattenReceivedJSONToFindUpcomingClass(tableData['UserClass']);
    received_ = ReturnUpcomingClass(receivedOutput[0], receivedOutput[1], receivedOutput[2]);
    document.getElementById('NextClassInfo').innerHTML = `${received_[1]} || ${received_[0]}`;
}

function SetTodaysDate(){
    monthArr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var today = new Date();
    var dd = today.getDate();
    var mm = monthArr[today.getMonth()];
    var yyyy = today.getFullYear();

    //now set it in the home tab
    document.getElementById('BlackBoardDate_ID').innerHTML = `${dd} ${mm} ${yyyy}`;
}

function SetupPendingClasses(inputJSON){

    loopJSON = inputJSON['PendingClass'];

    let key;
    for (key in loopJSON){

        loopGrade = loopJSON[key]['Grade'];
        loopTeacherUID = loopJSON[key]['TeacherUID'];
        loopSubject = loopJSON[key]['Subject'];
        loopBatch = loopJSON[key]['BatchName'];
        loopTeacherName = loopJSON[key]['TeacherName'];

        PendingClasses.push(`${loopTeacherUID}|${loopGrade}|${loopSubject}|${loopBatch}`);

        CreateRequestedClassesEntries(loopTeacherName, loopBatch, loopSubject, loopGrade, loopTeacherUID);
        AttachEventsPendingClasses();
    }

}

function SetupAcceptedClasses(inputJSON){

    loopJSON = inputJSON['UserClass'];

    let key;
    for (key in loopJSON){

        thisLoopGrade = loopJSON[key]['Grade'];
        thisLoopSubject = loopJSON[key]['Subject'];
        thisLoopTeacherName = loopJSON[key]['TeacherName'];
        thisLoopTeacherUID = loopJSON[key]['TeacherUID'];
        thisLoopBatch = loopJSON[key]['BatchName'];

        AcceptedClasses.push(`${thisLoopTeacherUID}|${thisLoopGrade}|${thisLoopSubject}|${thisLoopBatch}`);

        CreateSignedUpClassesEntries(thisLoopTeacherName, thisLoopBatch, thisLoopSubject, thisLoopGrade, thisLoopTeacherUID);

        //now make a lecture tab for each of these
        address = 'USERS/' + thisLoopTeacherUID + '/UserClass/' + thisLoopGrade + '/' + thisLoopSubject + '/Resources/';
        var ref = database.ref(address).once('value').then(function (snapshot) {

            resourceFullJSON = snapshot.val();

            //call the lecture link creator box
            CreateLectureLinkBox(resourceFullJSON);
            AttachEventToLectureClick();
        });
    }
}


function PopulateTimeTable(inputJSON) {

    //first find the classes to get the timings from
    loopJSON = inputJSON['UserClass'];

    //now loop through this
    let key;
    for (key in loopJSON){

        thisLoopGrade = loopJSON[key]['Grade'];
        thisLoopSubject = loopJSON[key]['Subject'];
        thisLoopTeacherName = loopJSON[key]['TeacherName'];
        thisLoopTeacherUID = loopJSON[key]['TeacherUID'];
        thisLoopBatch = loopJSON[key]['BatchName'];

        //now need to access this teachers database and read this batches timing
        var ref = database.ref('USERS/' + thisLoopTeacherUID + '/UserClass/' + thisLoopGrade + '/' + thisLoopSubject + '/Streams/' + thisLoopBatch).once('value').then(function (snapshot) {

            innerData = snapshot.val();

            timingColor = innerData['StreamColor'];

            timingJSON = innerData['Timings'];

            //teacherName = innerData['TeacherName'];
            //teacherUID = innerData['TeacherUID'];
            teacherSubject = innerData['Subject'];
            batch = innerData['BatchName'];
            Grade = innerData['Grade'];

            let key;
            for (key in timingJSON){
                timing = timingJSON[key];    //the timing is in the foramt:  Monday 9:00 - 12:00  

                //now we can call our time table entry creator function with these values
                CraftAndInjectTimeTable(timing, Grade, teacherSubject, batch, timingColor);
            }
        }).then(function(){
            FormatTimeTable();
        });
    }
}