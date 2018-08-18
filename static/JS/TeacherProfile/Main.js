	







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
	function FetchAllDataFromDatabase(){
		var ref = database.ref('USERS/' + Current_UID);
		console.log('Fetching data from database with UID ' + Current_UID);
		ref.once('value', ReceivedData, errData);


		//Functions for fetching data
		function ReceivedData(data){

			tableData = data.val();
			console.log(tableData);

			//Change the top name to user name
			document.getElementById("BlackBoardStudentName_ID").innerHTML = 'Teacher#34 ' + tableData['UserName'];
			document.title = tableData['UserName'] + ' - Profile';

			//first find out how many subject grades there are..
			SubjectGrades = ReturnAsArrayChildOfTable(tableData['UserClass']);

			console.log(SubjectGrades);


			//now loop through the subject grades and use the names as the address prefix

			for (var x = 0; x < SubjectGrades.length; x++) {

				CurrentSubjectGrade = SubjectGrades[x];

				//this will return as a JSON all the childs of working subject grade
				//convert it into working array of subjects e.g ['Physics', 'Chemistry', 'Biology']
				CurrentGrade_SubjectArray = ReturnAsArrayChildOfTable(tableData['UserClass'][CurrentSubjectGrade]);

				LoopThroughSubjectsAndInjectThem(CurrentGrade_SubjectArray, CurrentSubjectGrade);
			}


			//now call the function to attach delete events to each delete icon in each one stream
			SetupDeleteOneStreamEvent();
			FadeOutLoadingFrame();

		}

		function errData(err){
			console.log('Error!');
			console.log(err);
		}

	}

	//Add a realtime listener for state auth change
	  firebase.auth().onAuthStateChanged( firebaseUser => {
	  	if (firebaseUser){
	  		console.log('Logged In..')
	  		console.log(firebaseUser);
	  		Current_UID = firebaseUser.uid;
	  		FetchAllDataFromDatabase();

	  		$(".BlackBoard_MainInfo").fadeIn('slow');
	  		$(".BlackBoardName_Date_Cont").fadeIn('slow');

	  	}
	  	else{
	  		console.log('Not logged in..');
	  		//window.location.href = "http://www.edutechs.org";
	  		$(".BlackBoard_MainInfo").fadeIn('slow');
	  		$(".BlackBoardName_Date_Cont").fadeIn('slow');
	  	}
	  });

//Log out event trigger
	document.getElementById("SignoutIcon2").addEventListener('click', e => {

		console.log('Logout cliked!');
	  	const auth = firebase.auth();

	  	//logout
	  	const promise = auth.signOut().then(function(){
	  		//send to front page
	  		console.log('Successfully logged out..');

	  		},function(err){
	  		console.log(err.code);
	  	});


	  });

//Home icon click event
	document.getElementById("HomeIcon").addEventListener('click', e => {

		console.log('Home clicked!');

		//fadeout all current stuff
		$(".MainTeacherTab_Cont").fadeOut('fast');
		$(".MainTimeTableCont").fadeOut('fast');
		$(".MainVideoPlayer_Cont").fadeOut('fast');
		$(".MainLectureTab_Cont").fadeOut('fast');

		$(".Blackboard_container").css('background-color', 'rgb(10,14,17)');
		$(".BlackBoard").css('background-color', 'rgb(10,14,17)');
		$(".NotificationOpenButton").css('background-color', 'rgb(10,14,17)');

		$("#ExclaimIcon").css('color', 'white');
		$("#SignoutIcon2").css('color', 'white');

		
		$(".BlackBoard_MainInfo").delay(200).fadeIn('slow');
		$(".BlackBoardName_Date_Cont").delay(200).fadeIn('slow');

	  });

//Timetable icon click event
	document.getElementById("TableIcon").addEventListener('click', e => {

		console.log('Timetable clicked!');

		$(".MainTeacherTab_Cont").fadeOut('fast');
		$(".MainVideoPlayer_Cont").fadeOut('fast');
		$(".MainLectureTab_Cont").fadeOut('fast');

		//fadeout all current stuff
		$(".BlackBoard_MainInfo").fadeOut('fast');
		$(".BlackBoardName_Date_Cont").fadeOut('fast');

		$(".Blackboard_container").css('background-color', 'rgba(0,0,0,0)');
		$(".BlackBoard").css('background-color', 'rgba(0,0,0,0)');
		$(".NotificationOpenButton").css('background-color', 'rgba(0,0,0,0)');

		$("#ExclaimIcon").css('color', 'black');
		$("#SignoutIcon2").css('color', 'black');

		$(".MainTimeTableCont").fadeIn('slow');


	  });

	//open config options tab
	document.getElementById("SetStreamsButtonID").addEventListener('click', e => {
		$('.StreamConfigOptions').fadeIn('slow');
	});


	//close config options tab
	document.getElementById("StreamConfigCloseIcon").addEventListener('click', e => {
		$('.StreamConfigOptions').fadeOut('slow');
	});



function CreateStreamBox(SubjectName, SubjectGrade){

		//subjectName could be physics e.g
		//SubjectGrade right now is o level or alevel

		//create streambox element
		var StreamBox = document.createElement("div");
		StreamBox.setAttribute("class", "StreamBox");

		var ThisStreamSubject = document.createElement("div");
		ThisStreamSubject.setAttribute("class", "ThisStreamSubject");

		var t = document.createTextNode(SubjectName + ' | ' + SubjectGrade);
		ThisStreamSubject.append(t);

		StreamBox.append(ThisStreamSubject);
		document.getElementById('StreamConfigOptions_ID').append(StreamBox);

		return StreamBox
}

function FillEachStreamBox(timingArray, streamName, streamVacancy, streambox_ref, subject, classGrade){

	EachStreamBox = document.createElement("div");
	EachStreamBox.setAttribute("class", "EachStreamBox");

	//create the stream title which will display stream name
	EachStreamTitle = document.createElement("div");
	EachStreamTitle.setAttribute("class", "EachStreamTitle");

	var t = document.createTextNode(streamName);
	EachStreamTitle.append(t);

	//create the delete full stream
	DeleteFullStreamIcon = document.createElement("i");
	DeleteFullStreamIcon.setAttribute("id", "DeleteFullStream");
	DeleteFullStreamIcon.setAttribute("class", "fas fa-trash");

	EachStreamTitle.append(DeleteFullStreamIcon);

	//create the stream seat vacancy display
	SeatVacancyStream = document.createElement("span");
	SeatVacancyStream.setAttribute("class", "SeatVacancyStream");

	var t = document.createTextNode(streamVacancy);
	SeatVacancyStream.append(t);

	EachStreamTitle.append(SeatVacancyStream);

	EachStreamBox.append(EachStreamTitle);

	//now loop through given timings array and make a html element for each..	
	for (var i = 0; i < timingArray.length; i++) {
		EachStreamTiming = document.createElement("div");
		EachStreamTiming.setAttribute("class", "EachStreamTiming");

		StreamTimingSpan = document.createElement("span");
		var t = document.createTextNode(timingArray[i]);
		StreamTimingSpan.append(t);

		EachStreamTiming.append(StreamTimingSpan);

		//now make the delete icon and edit icon
		DeleteIcon = document.createElement("i");
		DeleteIcon.setAttribute("id", "DeleteStream");
		DeleteIcon.setAttribute("class", "fas fa-trash-alt");
		metaData = classGrade + '/' + subject + '/' + 'Streams/' + streamName + '/Timings/';
		metaDataIndex = String(i);
		DeleteIcon.setAttribute("data-main", metaData);
		DeleteIcon.setAttribute("data-main2", metaDataIndex);


		EachStreamTiming.append(DeleteIcon);

		//now for the edit icon
		EditIcon = document.createElement("i");
		EditIcon.setAttribute("id", "EditStreamIcon");
		EditIcon.setAttribute("class", "fas fa-edit");

		EachStreamTiming.append(EditIcon);

		//now we need to append it to the parent divs
		EachStreamBox.append(EachStreamTiming);
		//there we go all done, now lets hope to god it works :)
	}

	//now add it to the godfather permanent element
	streambox_ref.append(EachStreamBox);
}

//Video icon click event
	document.getElementById("VidIcon").addEventListener('click', e => {

		console.log('Video icon clicked!');

		$(".MainTeacherTab_Cont").fadeOut('fast');
		$(".MainTimeTableCont").fadeOut('fast');
		$(".MainTimeTableCont").fadeOut('fast');
		$(".MainLectureTab_Cont").fadeOut('fast');

		$(".Blackboard_container").css('background-color', 'rgb(0,0,0)');
		$(".BlackBoard").css('background-color', 'rgb(10,14,17)');
		$(".NotificationOpenButton").css('background-color', 'rgb(0,0,0)');

		//fadeout all current stuff
		$(".BlackBoard_MainInfo").fadeOut('fast');
		$(".BlackBoardName_Date_Cont").fadeOut('fast');

		$(".MainVideoPlayer_Cont").fadeIn('slow');


	  });

//Lecture icon click event
	document.getElementById("Lecticn").addEventListener('click', e => {

		console.log('lecture clicked!');

		//fadeout all current stuff
		$(".BlackBoard_MainInfo").fadeOut('fast');
		$(".BlackBoardName_Date_Cont").fadeOut('fast');
		$(".MainVideoPlayer_Cont").fadeOut('fast');
		$(".MainTeacherTab_Cont").fadeOut('fast');

		$(".Blackboard_container").css('background-color', 'rgba(0,0,0,0)');
		$(".BlackBoard").css('background-color', 'rgba(0,0,0,0)');
		$(".NotificationOpenButton").css('background-color', 'rgba(0,0,0,0)');

		$("#ExclaimIcon").css('color', 'black');
		$("#SignoutIcon2").css('color', 'black');

		$(".MainLectureTab_Cont").fadeIn('slow');


	  });

//Teacher icon click event
	document.getElementById("TeacherIcon").addEventListener('click', e => {

		console.log('teacher clicked!');

		//fadeout all current stuff
		$(".BlackBoard_MainInfo").fadeOut('fast');
		$(".BlackBoardName_Date_Cont").fadeOut('fast');
		$(".MainVideoPlayer_Cont").fadeOut('fast');
		$(".MainLectureTab_Cont").fadeOut('fast');

		$(".Blackboard_container").css('background-color', 'rgba(0,0,0,0)');
		$(".BlackBoard").css('background-color', 'rgba(0,0,0,0)');
		$(".NotificationOpenButton").css('background-color', 'rgba(0,0,0,0)');

		$("#ExclaimIcon").css('color', 'black');
		$("#SignoutIcon2").css('color', 'black');

		$(".MainTeacherTab_Cont").fadeIn('slow');


	  });


var IsNotificationTabOpen = false;
// Clicking the notification icon
document.getElementById("ExclaimIcon").addEventListener('click', e => {
	console.log('Notif cliked!');

	if (IsNotificationTabOpen){
		CloseNotificationTab();
	}
	else{
		OpenNotificationTab();
	}
});

//Clicking the close notif tab
document.getElementById("CloseNotif").addEventListener('click', e => {
	CloseNotificationTab();
});


function OpenNotificationTab(){
	$(".Blackboard_container").css('width', '65%');
	$(".NotificationMainCont").css('width', '33%');
	$(".InnerNotifMain").fadeIn('fast');
	$(".NotificationBox_Cont").fadeIn('slow');
	IsNotificationTabOpen = true;
}

function CloseNotificationTab(){
	$(".NotificationBox_Cont").fadeOut('fast');
	$(".InnerNotifMain").fadeOut('fast');
	$(".Blackboard_container").css('width', '98%');
	$(".NotificationMainCont").css('width', '0%');
	IsNotificationTabOpen = false;
}


function FadeOutLoadingFrame(){
	$(".LoadingContainer").fadeOut('slow');
}

function FadeInLoadingFrame(){
	$(".LoadingContainer").fadeIn('fast');
}

//Clicking the add new stream buttom tab
document.getElementById("AddNewStream_ID").addEventListener('click', e => {

	FadeInLoadingFrame();

	console.log('Add new stream clicked!');

	//first get all the input values nicely

	var e = document.getElementById("StreamSubjectSelect_ID");
	var ChosenSubject = e.options[e.selectedIndex].value;

	var ChosenStreamName = document.getElementById('StreamName_ID').value;

	var e = document.getElementById("StreamDaySelect_ID");
	var ChosenDay = e.options[e.selectedIndex].value;

	var e = document.getElementById("StreamStartTime_ID");
	var ChosenStartTime = e.options[e.selectedIndex].value;

	var e = document.getElementById("StreamEndTime_ID");
	var ChosenEndTime = e.options[e.selectedIndex].value;

	var ChosenStreamColor = document.getElementById('StreamColor_ID').value;
	var ChosenStreamTotalSeats = document.getElementById('StreamTotalSeat_ID').value;

	UpdateFireBaseStreamsTableOneStream(ChosenSubject, ChosenStreamName, ChosenDay, ChosenStartTime, ChosenEndTime, ChosenStreamColor, ChosenStreamTotalSeats);

	//remove all inner streamboxes
	//$('.StreamBox').remove();
	//$('.SubjectDropDOWN').remove();

	//now recreate the streamboxes after fetching em all
	//FetchAllDataFromDatabase();

	FadeOutLoadingFrame();

});

function UpdateFireBaseStreamsTableOneStream(subject, streamName, day, startTime, endTime, color, totalseats){
	//IMPORTANT NOTE: HERE SUBJECT ACTUALLY HAS O LEVEL/PHYSICS IN IT OR LIKE THAT
	var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  subject + '/Streams/' + streamName + '/Timings/');

	ref.once('value', ReceivedData, errData);

	function ReceivedData(data){
		//first find how many timings are there currently in this new stream timing update
		tableData = data.val();
		ThisStreamTiming = $.map(tableData, function(el) { return el; });

		var NumberOfTimingsCurrently = String(ThisStreamTiming.length);

		craftedTimings = day + ' ' + startTime + ' - ' + endTime

		//now insert new data into it
		var tableaddress = 'USERS/' + Current_UID + '/UserClass/' +  subject + '/Streams/' + streamName + '/Timings/';
		var data = {
			[NumberOfTimingsCurrently]: craftedTimings
		}

		InsertDataIntoTable(data, tableaddress);

		//now insert seat vacancy and stream color data
		var address = 'USERS/' + Current_UID + '/UserClass/' +  subject + '/Streams/' + streamName + '/';
		var data = {
			StreamColor : color,
			TotalSeats: totalseats
		}

		InsertDataIntoTable(data, address);

		console.log('Successfully updated data..');

	}

	function errData(err){
		console.log('Error!');
		console.log(err);
	}


}


function CraftTimingArray(){
	//this function will return an array containing the timings from 7AM to 10PM in 30min intervals

	var Crafted_Timings = [];

	for (var i = 7; i < 25; i++) {
		var currentTIming = String(i) + ':00';

		Crafted_Timings.push(currentTIming);

		var currentTIming = String(i) + ':30';

		Crafted_Timings.push(currentTIming);
	}

	return Crafted_Timings

}

function InjectTimingsIntoHTML(){

	timingsArray = CraftTimingArray();

	var myUL = document.getElementById("timingArray_ul_ID");

	var startTime = document.getElementById("StreamStartTime_ID");
	var endTime = document.getElementById("StreamEndTime_ID");

	for (var i = 0; i < timingsArray.length; i++) {

		//make the timings on the side of the timetable
		var myLI = document.createElement("li");
		var mySPAN = document.createElement("span");

		var t = document.createTextNode(timingsArray[i]);
		mySPAN.append(t);
		myLI.append(mySPAN);

		myUL.append(myLI);

		//now inject it into stream config add options
		var myoption = new Option(timingsArray[i], timingsArray[i]);
		startTime.append(myoption);

		var myoption = new Option(timingsArray[i], timingsArray[i]);
		endTime.append(myoption);
	}

}

function SetupDeleteOneStreamEvent(){
	//attached delete events from the firebase database for each stream to be deleted when clicked
	$(".fa-trash-alt").click(function() {

		FadeInLoadingFrame();
    	dataMain = String($(this).attr("data-main"));
    	dataIndex = parseInt($(this).attr("data-main2"));

    	console.log(dataMain);
    	console.log(dataIndex);

    	var tableToDeleteFromAddress = 'USERS/' + Current_UID + '/UserClass/' +  dataMain;

    	DeleteTableEntryByIndex(dataIndex, tableToDeleteFromAddress);

    	return false;
    });
}

function LoopThroughSubjectsAndInjectThem(inputSubjectArray, subjectGrade){
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
		select_subject.appendChild( option_subject );

		//insert it into current streams 
		//create streambox element
		ThisStreamBox = CreateStreamBox(currentWorking_Subject, subjectGrade);

		//Now get the stream timings to inject 
		AllStreamsJSON_of_ThisSubject = tableData['UserClass'][subjectGrade][currentWorking_Subject]['Streams']

		//now iterate over this json to find timings of each stream
		var key;
		for (key in AllStreamsJSON_of_ThisSubject) {

			var SeatVacancy = 'Vacant Seats: ' + String(AllStreamsJSON_of_ThisSubject[key]['FilledSeats']) + '/' + String(AllStreamsJSON_of_ThisSubject[key]['TotalSeats']);

			var arr = AllStreamsJSON_of_ThisSubject[key]['Timings'];
			ThisStreamTiming = $.map(arr, function(el) { return el; });

			//now this timing needs to be injected as an html
			FillEachStreamBox(ThisStreamTiming, key, SeatVacancy, ThisStreamBox, currentWorking_Subject, subjectGrade);
		}

	}
}


//main jquery run time functions
$(document).ready(function(){

    $("#SignoutIcon2").hover(function(){
        $(".SignOutText").css("display", "block");
        }, function(){
        $(".SignOutText").css("display", "none");
    });

    $("#ExclaimIcon").hover(function(){
        $(".NotificationText").css("display", "block");
        }, function(){
        $(".NotificationText").css("display", "none");
    });

	$(".LectureLink").click(function() {

    	PDF_LINK = String($(this).attr("data-main")) + '#zoom=100';

    	$("#Iframe_PDF").attr('src', PDF_LINK);

    	console.log(PDF_LINK);

    	$(".LoadingContainer").fadeIn('slow');
    	$(".PDF_VIEWER").fadeIn("slow");
    	$("#PDFCLOSE_ICON").fadeIn("slow");

    });

	$("#PDFCLOSE_ICON").click(function() {

		$("#PDFCLOSE_ICON").fadeOut("fast");
    	$(".PDF_VIEWER").fadeOut("fast");
    	$(".LoadingContainer").fadeOut('slow');

    });

});

//Calling the main function
	InjectTimingsIntoHTML()
	
