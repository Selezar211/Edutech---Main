	







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
	var global_database_json;

//Fetch all relevant data for logged in user from our database using UID
	function FetchAllDataFromDatabase(){
		var ref = database.ref('USERS/' + Current_UID);
		ref.once('value', ReceivedData, errData);

		//Functions for fetching data
		function ReceivedData(data){

			tableData = data.val();
			global_database_json = tableData;
			console.log(tableData);

			//Change the top name to user name
			document.getElementById("BlackBoardStudentName_ID").innerHTML = 'Teacher#34 ' + tableData['UserName'];
			document.title = tableData['UserName'] + ' - Profile';

			//how populate the stream config options section
			LoadAndPopulateStreamConfigOptions(tableData);

			//now call the function to attach delete events to each delete icon in each one stream
			SetupDeleteOneStreamEvent();
			FadeOutLoadingFrame();
		}

		function errData(err){
			console.log('Error!');
			console.log(err);
		}

	}


function LoadAndPopulateStreamConfigOptions(tableData_JSON){

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
			FillEachStreamBoxAndDropDownBox(ThisStreamTiming, key, SeatVacancy, ThisStreamBox, currentWorking_Subject, subjectGrade);
		}

	}
}


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

function FillEachStreamBoxAndDropDownBox(timingArray, streamName, streamVacancy, streambox_ref, subject, classGrade){

	//this will also fill the drop in box of add new stream timing stream name
	StreamNameSelectADDBOX_ID = document.getElementById('StreamNameSelectADDBOX_ID');

	OptText = streamName + ' | ' + subject + ' | ' + classGrade
	OptValue = classGrade + '/' + subject + '/Streams/' + streamName + '/';

	optionForAddBox = new Option(OptText, OptValue);
	optionForAddBox.setAttribute("class", "ADDTimingDropDOWN");
	StreamNameSelectADDBOX_ID.appendChild( optionForAddBox );

	//now do the actual fill each stream box

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



//Clicking the create new stream buttom tab
document.getElementById("CreateNewStream_ID").addEventListener('click', e => {

	FadeInLoadingFrame();

	console.log('Add new stream clicked!');

	//first get all the input values nicely

	var e = document.getElementById("StreamSubjectSelect_ID");
	var ChosenSubject = e.options[e.selectedIndex].value; //e.g O LEVEL/Physics

	var ChosenStreamName = document.getElementById('StreamName_ID').value;

	var ChosenStreamColor = document.getElementById('StreamColor_ID').value;
	var ChosenStreamTotalSeats = document.getElementById('StreamTotalSeat_ID').value;

	CreateNewStream(ChosenSubject, ChosenStreamName, ChosenStreamColor, ChosenStreamTotalSeats);

	//remove all inner streamboxes
	//$('.StreamBox').remove();
	//$('.SubjectDropDOWN').remove();

	//now recreate the streamboxes after fetching em all
	//FetchAllDataFromDatabase();

	FadeOutLoadingFrame();

});

//Clicking the add new stream timing buttom tab
document.getElementById("AddNewTiming_ID").addEventListener('click', e => {

	FadeInLoadingFrame();

	console.log('Add new timing clicked!');

	//first get all the input values nicely

	var e = document.getElementById("StreamNameSelectADDBOX_ID");
	var ChosenStreamAddress = e.options[e.selectedIndex].value; //e.g O LEVEL/Physics

	var e = document.getElementById("StreamDaySelect_ID");
	var ChosenDay = e.options[e.selectedIndex].value;

	var e = document.getElementById("StreamStartTime_ID");
	var ChosenStartTime = e.options[e.selectedIndex].value;

	var e = document.getElementById("StreamEndTime_ID");
	var ChosenEndTime = e.options[e.selectedIndex].value;

	CreateNewTiming(ChosenStreamAddress, ChosenDay, ChosenStartTime, ChosenEndTime);

});



function CreateNewStream(subject, streamName, color, TotalSeats){
	//IMPORTANT NOTE: HERE SUBJECT ACTUALLY HAS O LEVEL/PHYSICS IN IT OR LIKE THAT
	var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  subject + '/Streams/');

	ref.once('value', ReceivedData, errData);

	function ReceivedData(data){

		tableData = data.val();

		//first need to check to see if the stream name already exists and if it does tell the user it does
		existingStreamNameArray = ReturnAsArrayChildOfTable(tableData);

		//this will return true if the stream name to be created already exists
		CheckBoolean = CheckIfElementExistsInArray(streamName, existingStreamNameArray);

		if (CheckBoolean==true){
			alert('Stream Name chosen to create new stream already exists! Please choose a new one to stop from overwriting the old one..');
		}

		else {
			//we are a go to create the new stream database table
			var tableaddress = 'USERS/' + Current_UID + '/UserClass/' +  subject + '/Streams/' + streamName;
			var data = {
				StreamColor: color,
				TotalSeats: TotalSeats,
				FilledSeats: 0
			}

			InsertDataIntoTable(data, tableaddress);

			alert('New Stream has been created successfully!');

		}

	}

	function errData(err){
		console.log('Error!');
		console.log(err);
	}
}

function CreateNewTiming(StreamAddress, day, startTime, endTime){
	//IMPORTANT NOTE: HERE SUBJECT ACTUALLY HAS O LEVEL/PHYSICS IN IT OR LIKE THAT
	address = 'USERS/' + Current_UID + '/UserClass/' + StreamAddress + 'Timings/';
	console.log(address);
	var ref = database.ref(address);

	ref.once('value', ReceivedData, errData);

	function ReceivedData(data){
		//first find how many timings are there currently in this new stream timing update
		tableData = data.val();
		ThisStreamTiming = $.map(tableData, function(el) { return el; });

		console.log(ThisStreamTiming);

		var NumberOfTimingsCurrently = String(ThisStreamTiming.length);

		console.log(NumberOfTimingsCurrently);

		craftedTimings = day + ' ' + startTime + ' - ' + endTime

		console.log(craftedTimings);

		//now insert new data into it
		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + StreamAddress + 'Timings/');

		var data = {
			[NumberOfTimingsCurrently]: craftedTimings
		}

		ref.update(data);

		alert('Successfully created new stream timing!');

	}

	function errData(err){
		console.log('Error!');
		console.log(err);
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


//Add a realtime listener for state auth change
firebase.auth().onAuthStateChanged( firebaseUser => {
	if (firebaseUser){
		console.log('Logged In..')
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


















//FIREBASE STUFF END
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




//Calling the main function
	InjectTimingsIntoHTML()
	
