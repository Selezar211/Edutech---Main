	//Author: Ekram
	//Whats the plan? The kind where we make it as we go along of course - the best kind 8)
	//If I had any idea how difficult and the wild ride this would eventually turn out to be I would honestly never have started. Good thing I didnt, buckle up for the spaghetti code ahead 8)


// Initialize Firebase
var config = {
    apiKey: "AIzaSyCBGF5jQfpK_yktdnUs8a80XPn0MLxSt9Y",
    authDomain: "edutech-2121.firebaseapp.com",
    databaseURL: "https://edutech-2121.firebaseio.com",
    projectId: "edutech-2121",
    storageBucket: "edutech-2121.appspot.com",
    messagingSenderId: "981500378332"
};

firebase.initializeApp(config);

var database = firebase.database();
var Current_UID;

//Fetch all relevant data for logged in user from our database using UID
//this is the main function which will fetch the data from backend and then call the functions to craft the data into various places
function FetchAllDataFromDatabase() {

    var ref = database.ref('USERS/' + Current_UID).once('value').then(function(snapshot) {

        //first remove the timetable if it exists and create it afresh
        if (document.getElementById('cdscheduleloading_ID')) {
            $('#cdscheduleloading_ID').remove();
        }

        CreateTimeTableHTML();

        tableData = snapshot.val();         //this is the full JSON from firebase database for this user
        console.log(tableData);

        //Change the top name to user name and change some stuff on the page to reflect the user
        document.getElementById("BlackBoardStudentName_ID").innerHTML = 'Teacher#34 ' + tableData['UserName'];
        document.getElementById("UID_Setting_ID").innerHTML = `Personal UID : ${Current_UID}`;
        document.title = tableData['UserName'] + ' - Profile';

        //now populate everything by looping through the obtained JSON and injecting it where it is needed
        //so here we are going to have multi level FOR loops to propagate through our JSON structure
        //we need to loop through table data to find subjects/grades/ and batches in each one of them
        //this LoadandPopulateverything function will have multi level for loops with each loop finding things such as subject - grade - batches and so on
        LoadAndPopulateEverything(tableData);

        //this will craft the 24 hour clock timings for new batch timings add option box
        InjectTimingsIntoHTML();

        //now populate the timetable - this populates the timetable
        PopulateTimeTable(tableData);

        FadeOutLoadingFrame();  //loading frame was ON by default and hence make it fadeout after everything is loaded

    }).then(function() {
        FormatTimeTable();
        //now call the functions to attach events to all buttons in all tabs
        AttachEventToAddStreamOptions();
        AttachEventToEachStudentClick();
        AttachEventToLectureClick();
        AttachEventToExamTab();
    });

}






//Functions

function LoadAndPopulateEverything(tableData_JSON) {

    //first find out how many subject grades there are..
    SubjectGrades = ReturnAsArrayChildOfTable(tableData_JSON['UserClass']);

    //now loop through the subject grades and use the names as the address prefix

    for (var x = 0; x < SubjectGrades.length; x++) {

        CurrentSubjectGrade = SubjectGrades[x];

        //this will return as a JSON all the childs of working subject grade
        //convert it into working array of subjects e.g ['Physics', 'Chemistry', 'Biology']
        CurrentGrade_SubjectArray = ReturnAsArrayChildOfTable(tableData_JSON['UserClass'][CurrentSubjectGrade]);

        LoopThroughSubjectsAndInjectThem(CurrentGrade_SubjectArray, CurrentSubjectGrade);
    }
}

function LoopThroughSubjectsAndInjectThem(inputSubjectArray, subjectGrade) {
    //inputSubjectArray = ['Physics', 'Chemistry'] e.g
    //subjectGrade = 'O LEVEL' e.g

    var option_subject;
    var select_subject = document.getElementById('StreamSubjectSelect_ID');

    for (var i = 0; i < inputSubjectArray.length; i++) {

        currentWorking_Subject = String(inputSubjectArray[i]);

        displayText = currentWorking_Subject + ' (' + subjectGrade + ')';
        displayValue = subjectGrade + '/' + currentWorking_Subject

        //var option = new Option(text, value);
        option_subject = new Option(displayText, displayValue);
        option_subject.setAttribute("class", "SubjectDropDOWN");
        select_subject.appendChild(option_subject);

        //insert it into current streams 
        //create streambox element
        ThisStreamBox = CreateStreamBox(currentWorking_Subject, subjectGrade);

        //Exam JSON of this subject
        Exam_JSON = tableData['UserClass'][subjectGrade][currentWorking_Subject]['Exams'];
        //now create the exam boxes for each subject in the exam tab
        createOneBatchExamCont(currentWorking_Subject, subjectGrade, Exam_JSON);

        //Now get the stream timings to inject 
        AllStreamsJSON_of_ThisSubject = tableData['UserClass'][subjectGrade][currentWorking_Subject]['Streams']

        //now iterate over this json to find timings of each stream
        var key; //key is the stream name
        for (key in AllStreamsJSON_of_ThisSubject) {

            var TotalSeats = AllStreamsJSON_of_ThisSubject[key]['TotalSeats'];
            var FilledSeats = AllStreamsJSON_of_ThisSubject[key]['FilledSeats'];

            var SeatVacancy = 'Seats Filled: ' + String(FilledSeats) + '/' + String(TotalSeats);
            var streamColor = AllStreamsJSON_of_ThisSubject[key]['StreamColor'];

            var arr = AllStreamsJSON_of_ThisSubject[key]['Timings'];
            ThisStreamTiming = $.map(arr, function(el) {
                return el;
            });

            //get the lecture resource json
            var ResourceJSON = AllStreamsJSON_of_ThisSubject[key]['Resources'];

            //need to loop through the resource json and get lecturename array and lecture links array

            //now this timing needs to be injected as an html
            FillEachStreamBoxAndDropDownBox(ThisStreamTiming, key, SeatVacancy, ThisStreamBox, currentWorking_Subject, subjectGrade, streamColor);

            //need to create the student tab batch boxes
            var AcceptedStudentJSON = AllStreamsJSON_of_ThisSubject[key]['AcceptedStudents'];
            var PendingStudentJSON = AllStreamsJSON_of_ThisSubject[key]['PendingStudents'];

            CreateStudentBatchBox(key, currentWorking_Subject, subjectGrade, SeatVacancy);
            CreateAcceptedStudentBatchBox(AcceptedStudentJSON, subjectGrade, currentWorking_Subject, key, TotalSeats, FilledSeats);
            CreatePendingStudentBatchBox(PendingStudentJSON, subjectGrade, currentWorking_Subject, key, TotalSeats, FilledSeats);

            //create the lecturetab stuff
            CreateLectureLinkBox(currentWorking_Subject, subjectGrade, key, ResourceJSON);

            //create the exam tab stuff
            
        }

    }
}






//this will remove all dependant data from the page and reload them from backend
function ReloadBackEndData() {

    //remove all inner streamboxes
    $('.StreamBox').remove();
    $('.SubjectDropDOWN').remove();
    $('.ADDTimingDropDOWN').remove();
    $('.single-event').remove();
    $('.BatchBox').remove();
    $('.StudentInfoCont').remove();
    $('.LectureLinksContainer').remove();
    $('.OneBatchExamCont').remove();

    //now recreate the streamboxes after fetching em all
    FetchAllDataFromDatabase();
}









//Add a realtime listener for state auth change
firebase.auth().onAuthStateChanged(firebaseUser => {
    if (firebaseUser) {
        console.log('Logged In..')
        Current_UID = firebaseUser.uid;
        FetchAllDataFromDatabase();

        $(".BlackBoard_MainInfo").fadeIn('slow');
        $(".BlackBoardName_Date_Cont").fadeIn('slow');

    } else {
        console.log('Not logged in..');
        //window.location.href = "http://www.edutechs.org";
        $(".BlackBoard_MainInfo").fadeIn('slow');
        $(".BlackBoardName_Date_Cont").fadeIn('slow');
    }
});


//FIREBASE STUFF END
