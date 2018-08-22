	
//Author: Ekram
//Whats the plan? The kind where we make it as we go along of course 8)



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
		ref.once('value', ReceivedData, errData).then(function(){
			FormatTimeTable();
		});

		//Functions for fetching data
		function ReceivedData(data){

			//first remove the timetable if it exists and create it afresh
			if (document.getElementById('cdscheduleloading_ID')){
				$('#cdscheduleloading_ID').remove();
			}

			CreateTimeTableHTML();

			tableData = data.val();
			global_database_json = tableData;
			console.log(tableData);

			//Change the top name to user name
			document.getElementById("BlackBoardStudentName_ID").innerHTML = 'Teacher#34 ' + tableData['UserName'];
			document.title = tableData['UserName'] + ' - Profile';

			//now populate the stream config options section
			LoadAndPopulateStreamConfigOptions(tableData);

			InjectTimingsIntoHTML();

			//now populate the timetable
			PopulateTimeTable(tableData);

			//now call the function to attach delete events to each delete and edit icon in each one stream
			SetupDeleteFullStreamEvent();
			SetupDeleteOneStreamEvent();
			SetupEditOneStreamEvent();
			SetupEditFullStreamEvent();

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

			var SeatVacancy = 'Seats Filled: ' + String(AllStreamsJSON_of_ThisSubject[key]['FilledSeats']) + '/' + String(AllStreamsJSON_of_ThisSubject[key]['TotalSeats']);
			var streamColor = AllStreamsJSON_of_ThisSubject[key]['StreamColor'];

			var arr = AllStreamsJSON_of_ThisSubject[key]['Timings'];
			ThisStreamTiming = $.map(arr, function(el) { return el; });

			//now this timing needs to be injected as an html
			FillEachStreamBoxAndDropDownBox(ThisStreamTiming, key, SeatVacancy, ThisStreamBox, currentWorking_Subject, subjectGrade, streamColor);
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

function FillEachStreamBoxAndDropDownBox(timingArray, streamName, streamVacancy, streambox_ref, subject, classGrade, batchcolor){

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
	metaData = classGrade + '/' + subject + '/' + 'Streams/' + streamName;
	DeleteFullStreamIcon.setAttribute("data-main", metaData);

	EachStreamTitle.append(DeleteFullStreamIcon);

	//create the edit icon
	EditFullStreamIcon = document.createElement("i");
	EditFullStreamIcon.setAttribute("id", "EditFullStreamIcon");
	EditFullStreamIcon.setAttribute("class", "fas fa-pencil-alt");
	metaData = classGrade + '/' + subject + '/' + 'Streams/';
	EditFullStreamIcon.setAttribute("data-main", metaData);
	EditFullStreamIcon.setAttribute("data-main2", streamName);
	EditFullStreamIcon.setAttribute("data-main3", streamVacancy);
	EditFullStreamIcon.setAttribute("data-main4", batchcolor);

	EachStreamTitle.append(EditFullStreamIcon);

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
		EditIcon.setAttribute("data-main", metaData);
		EditIcon.setAttribute("data-main2", metaDataIndex);
		EditIcon.setAttribute("data-itself", timingArray[i]);

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
	var CheckBoolean;

	var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  subject + '/Streams/');

	ref.once('value', ReceivedData, errData).then(function(){

		if (CheckBoolean==true){
			BoxAlert('Batch name exists already in database..');
		}

		else if (CheckBoolean==false){
			InjectNewStream().then(function(){
				BoxAlert('New Batch has been created successfully!');
				ReloadBackEndData();
				FadeOutLoadingFrame();
			});
		}

		else {
			console.log('CHECK BOOLEAN IS UNDEFINED');
		}

	});

	function ReceivedData(data){

		tableData = data.val();

		//first need to check to see if the stream name already exists and if it does tell the user it does
		existingStreamNameArray = ReturnAsArrayChildOfTable(tableData);

		//this will return true if the stream name to be created already exists
		CheckBoolean = CheckIfElementExistsInArray(streamName, existingStreamNameArray);

	}

	function errData(err){
		console.log('Error!');
		console.log(err);
	}

	function InjectNewStream(){
		//we are a go to create the new stream database table
		var tableaddress = 'USERS/' + Current_UID + '/UserClass/' +  subject + '/Streams/' + streamName;
		var data = {
			StreamColor: color,
			TotalSeats: TotalSeats,
			FilledSeats: 0
		}

		const pr = InsertDataIntoTable(data, tableaddress);

		return pr
	}
}

function CreateNewTiming(StreamAddress, day, startTime, endTime){
	//IMPORTANT NOTE: HERE SUBJECT ACTUALLY HAS O LEVEL/PHYSICS IN IT OR LIKE THAT

	var craftedTimings;
	var NumberOfTimingsCurrently;

	address = 'USERS/' + Current_UID + '/UserClass/' + StreamAddress + 'Timings/';

	var ref = database.ref(address);

	const promise = ref.once('value', ReceivedData, errData).then(function(){
		InsertNewTiming().then(function(){
			BoxAlert('New Batch timing has been created successfully!');
			ReloadBackEndData();
			FadeOutLoadingFrame();
		});
	});

	function ReceivedData(data){
		//first find how many timings are there currently in this new stream timing update
		tableData = data.val();
		ThisStreamTiming = $.map(tableData, function(el) { return el; });

		NumberOfTimingsCurrently = String(ThisStreamTiming.length);

		craftedTimings = day + ' ' + startTime + ' - ' + endTime;

	}

	function errData(err){
		console.log('Error!');
		console.log(err);
	}

	function InsertNewTiming(){
		//now insert new data into it
		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + StreamAddress + 'Timings/');

		var data = {
			[NumberOfTimingsCurrently]: craftedTimings
		}

		const pr = ref.update(data);
		return pr
	}


}

//attached delete events from the firebase database for a full stream to be deleted when clicked
function SetupDeleteFullStreamEvent(){
	//attached delete events from the firebase database for a full stream to be deleted when clicked
	$(".fa-trash").click(function() {

		$('.StreamConfigOptions').css('-webkit-filter', 'blur(5px)');

    	dataMain = String($(this).attr("data-main"));

    	CraftPopUpCheckBox('Are you sure? This will delete the entire stream with its database of students and everything.', dataMain);

    	AttachEventToOkPopUpBox();
    	// var tableToDeleteFromAddress = 'USERS/' + Current_UID + '/UserClass/' +  dataMain;

    	// var ref = database.ref(tableToDeleteFromAddress);

    	// const promise = ref.remove();

    	// promise.then(ReloadBackEndData).then(function(){
    	// 	BoxAlert('Batch deleted successfully!');
    	// });

    	return false;
    });
}

function AttachEventToOkPopUpBox(){
	$("#YesButton_ID").click(function() {

		FadeInLoadingFrame();

		$('#StreamConfigOptions_ID')

    	dataMain = String($(this).attr("data-main"));

    	var tableToDeleteFromAddress = 'USERS/' + Current_UID + '/UserClass/' +  dataMain;

    	var ref = database.ref(tableToDeleteFromAddress);

    	const promise = ref.remove();

    	promise.then(ReloadBackEndData).then(function(){
    		BoxAlert('Batch deleted successfully!');
    		$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
    		$('.DoubleCheckBox').remove();
    		FadeOutLoadingFrame();
    	});

    	return false;
    });

   	$("#NoButton_ID").click(function() {

   		$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
   		$('.DoubleCheckBox').remove();

    	return false;
    });
}

//attached delete events from the firebase database for each stream to be deleted when clicked
function SetupDeleteOneStreamEvent(){
	//attached delete events from the firebase database for each stream to be deleted when clicked
	$(".fa-trash-alt").click(function() {

		FadeInLoadingFrame();
    	dataMain = String($(this).attr("data-main"));
    	dataIndex = parseInt($(this).attr("data-main2"));

    	console.log(dataMain);
    	console.log(dataIndex);

    	var tableToDeleteFromAddress = 'USERS/' + Current_UID + '/UserClass/' +  dataMain;

    	DeleteTableEntryByIndex(dataIndex, tableToDeleteFromAddress).then(ReloadBackEndData).then(function(){
    		BoxAlert('Timing deleted successfully!');
    	});

    	return false;
    });
}

//attached edit events for each one stream
function SetupEditOneStreamEvent(){
	//attached edit events from the firebase database for each stream to be edited when clicked
	$(".fa-edit").click(function() {

    	dataMain = String($(this).attr("data-main"));
    	dataIndex = $(this).attr("data-main2");

    	dataItself = $(this).attr("data-itself");

    	arr = dataItself.split(' ');

    	day = arr[0];
    	sTime = arr[1];
    	eTime = arr[3];

    	//blur the background
    	$('.StreamConfigOptions').css('-webkit-filter', 'blur(5px)');

    	//show and create the edit tab with datamain and datamain2 data embedded
		CraftEditOneStream(dataMain, dataIndex);

		SetupRemoveEditOneStream();
		SetupClickEditOneStream();

		//set the default values to the ones chosen before
		$('#InputChildDaySelect_ID').val(day);
		$('#InputChildStartTimeSelect_ID').val(sTime);
		$('#InputChildEndTimeSelect_ID').val(eTime);

    	return false;
    });
}

//attached edit events for full stream
function SetupEditFullStreamEvent(){
	//attached edit events from the firebase database for each stream to be edited when clicked
	$(".fa-pencil-alt").click(function() {

		console.log('Edit button clicked!');

    	address = String($(this).attr("data-main"));
    	streamName = $(this).attr("data-main2");
    	streamVacancy = $(this).attr("data-main3").split('/')[1];
    	streamColor = $(this).attr("data-main4");

    	//blur the background
    	$('.StreamConfigOptions').css('-webkit-filter', 'blur(5px)');

    	//show and create the edit tab with datamain and datamain2 data embedded
		CraftEditFullStream(address, streamName, streamColor, streamVacancy);

		SetupRemoveEditFullStream();
		SetupClickEditFullStream();

    	return false;
    });
}

function SetupRemoveEditOneStream(){
	$(".CancelEdit").click(function() {

		//remove the editone stream window
		$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
		$('.EditOneStream').remove();

    	return false;
    });
}

function SetupRemoveEditFullStream(){
	$(".NoFullEdit").click(function() {

		//remove the editone stream window
		$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
		$('.EditFullStream').remove();

    	return false;
    });
}

function SetupClickEditOneStream(){
	$(".YesEdit").click(function() {

		FadeInLoadingFrame();

		//first get the data
    	dataMain = String($(this).attr("data-main"));
    	dataIndex = $(this).attr("data-main2");

		var e = document.getElementById("InputChildDaySelect_ID");
		var ChosenDay = e.options[e.selectedIndex].value; 

		var e = document.getElementById("InputChildStartTimeSelect_ID");
		var ChosenStartTime = e.options[e.selectedIndex].value;

		var e = document.getElementById("InputChildEndTimeSelect_ID");
		var ChosenEndTime = e.options[e.selectedIndex].value;


		//now lets access the firebase database and input the above data
		newTiming = ChosenDay + ' ' + ChosenStartTime + ' - ' + ChosenEndTime;
		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  dataMain);

		var data = {
			[dataIndex]: newTiming
		}

		const promise = ref.update(data);

		promise.then(ReloadBackEndData).then(function(){
			BoxAlert('Timing has been changed successfully!');
			$('.EditOneStream').remove();
			$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
			FadeOutLoadingFrame();
		});

    	return false;
    });
}

function SetupClickEditFullStream(){
	$(".YesFullEdit").click(function() {

		FadeInLoadingFrame();

		var snapshotJSON;

		//first get the data
    	address = String($(this).attr("data-main"));
    	streamName = $(this).attr("data-main2");

		var newName = document.getElementById("NewName_ID").value;
		var newColor = document.getElementById("NewColor_ID").value;
		var newSeats = document.getElementById("NewSeats_ID").value;

		if (newName==''){
			newName = streamName;
		}

		//now lets first access the firebase database and keep a copy of the stream to be changed
		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  address + streamName);

		const promise = ref.once('value', ReceivedData, errData).then(function(){

			//now we will delete this stream
			var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  address + streamName);
			ref.remove().then(function(){
				//now we need to reload the address with the new stream
				var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  address + newName);

				ref.update(snapshotJSON).then(ReloadBackEndData).then(function(){
					BoxAlert('Stream has been edited successfully!');
					$('.EditFullStream').remove();
					$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
					FadeOutLoadingFrame();
				});
			});

		});


		function ReceivedData(data){

			tableData = data.val();

			//we need to change the color of the stream and seat cacpacity of tableData here
			if (newSeats!=''){
				tableData['TotalSeats'] = newSeats;
			}
			
			if (newColor!=''){
				tableData['StreamColor'] = newColor;
			}
			
			snapshotJSON = tableData;

		}

		function errData(err){
			console.log('Error!');
			console.log(err);
		}

    	return false;
    });
}

//this will remove all dependant data from the page and reload them from backend
function ReloadBackEndData(){

	//remove all inner streamboxes
	$('.StreamBox').remove();
	$('.SubjectDropDOWN').remove();
	$('.ADDTimingDropDOWN').remove();
	$('.single-event').remove();

	//now recreate the streamboxes after fetching em all
	FetchAllDataFromDatabase();
}


//this will craft the edit one stream
function CraftEditOneStream(address, index){

	timingArr = CraftTimingArray();

	//MainStreamElement = document.getElementById('StreamConfigOptions_ID');

	var EditOneStream = document.createElement("div");
	EditOneStream.setAttribute("class", "EditOneStream");

		var inputCont = document.createElement("div");
		inputCont.setAttribute("class", "inputCont");

			var InputChild1 = document.createElement("div");
			InputChild1.setAttribute("class", "InputChild");

				var InputChildSelect = document.createElement("select");
				InputChildSelect.setAttribute("class", "InputChildSelect");
				InputChildSelect.setAttribute("id", "InputChildDaySelect_ID");

				var option = new Option('Sunday', 'Sunday');
				InputChildSelect.append(option);

				var option = new Option('Monday', 'Monday');
				InputChildSelect.append(option);

				var option = new Option('Tuesday', 'Tuesday');
				InputChildSelect.append(option);

				var option = new Option('Wednesday', 'Wednesday');
				InputChildSelect.append(option);

				var option = new Option('Thursday', 'Thursday');
				InputChildSelect.append(option);

				var option = new Option('Friday', 'Friday');
				InputChildSelect.append(option);

				var option = new Option('Saturday', 'Saturday');
				InputChildSelect.append(option);

				InputChild1.append(InputChildSelect);

				var dayLabel = document.createElement("label");
				dayLabel.setAttribute("class", "InputChildLabel");

				var t = document.createTextNode('Day');
				dayLabel.append(t);

				InputChild1.append(dayLabel);

				inputCont.append(InputChild1);

			var InputChild2 = document.createElement("div");
			InputChild2.setAttribute("class", "InputChild");

				var InputChild2Select = document.createElement("select");
				InputChild2Select.setAttribute("class", "InputChildSelect");
				InputChild2Select.setAttribute("id", "InputChildStartTimeSelect_ID");

				//loop through and inject the timing array as options
				for (var i = 0; i < timingArr.length; i++) {
					var myoption = new Option(timingArr[i], timingArr[i]);
					InputChild2Select.append(myoption);
				}

				InputChild2.append(InputChild2Select);

				var sTimeLabel = document.createElement("label");
				sTimeLabel.setAttribute("class", "InputChildLabel");

				var t = document.createTextNode('Start Time');
				sTimeLabel.append(t);

				InputChild2.append(sTimeLabel);

				inputCont.append(InputChild2);

			var InputChild3 = document.createElement("div");
			InputChild3.setAttribute("class", "InputChild");

				var InputChild3Select = document.createElement("select");
				InputChild3Select.setAttribute("class", "InputChildSelect");
				InputChild3Select.setAttribute("id", "InputChildEndTimeSelect_ID");

				//loop through and inject the timing array as options
				for (var i = 0; i < timingArr.length; i++) {
					var myoption = new Option(timingArr[i], timingArr[i]);
					InputChild3Select.append(myoption);
				}

				InputChild3.append(InputChild3Select);

				var eTimeLabel = document.createElement("label");
				eTimeLabel.setAttribute("class", "InputChildLabel");

				var t = document.createTextNode('End Time');
				eTimeLabel.append(t);

				InputChild3.append(eTimeLabel);		

				inputCont.append(InputChild3);	

	var YesEdit = document.createElement("div");
	YesEdit.setAttribute("class", "YesEdit");
	metaData = address;
	metaDataIndex = index;
	YesEdit.setAttribute("data-main", metaData);
	YesEdit.setAttribute("data-main2", metaDataIndex);

	var t = document.createTextNode('Edit');
	YesEdit.append(t);

	var CancelEdit = document.createElement("div");
	CancelEdit.setAttribute("class", "CancelEdit");
	var t = document.createTextNode('Cancel');
	CancelEdit.append(t);


	//now append everything to the main editonestream
	EditOneStream.append(inputCont);

	EditOneStream.append(YesEdit);

	EditOneStream.append(CancelEdit);

	document.body.appendChild(EditOneStream);

}

//this will craft the edit full stream pop up box
function CraftEditFullStream(address, previousName, previousColor, previousSeats){

	var EditFullStream = document.createElement("div");
	EditFullStream.setAttribute("class", "EditFullStream");

		var YesFullEdit = document.createElement("div");
		YesFullEdit.setAttribute("class", "YesFullEdit");
		YesFullEdit.setAttribute("data-main", address);
		YesFullEdit.setAttribute("data-main2", previousName);

		var t = document.createTextNode('Edit');
		YesFullEdit.append(t);


		var NoFullEdit = document.createElement("div");
		NoFullEdit.setAttribute("class", "NoFullEdit");

		var t = document.createTextNode('Cancel');
		NoFullEdit.append(t);


		var InputContFullStream = document.createElement("div");
		InputContFullStream.setAttribute("class", "InputContFullStream");

			//create the new batch name input
			var EditFullStreamInput = document.createElement("input");
			EditFullStreamInput.setAttribute("class", "EditFullStreamInput");
			EditFullStreamInput.setAttribute("id", "NewName_ID");
			EditFullStreamInput.setAttribute("type", "text");
			EditFullStreamInput.setAttribute("placeholder", "Current Name: " + previousName);
			EditFullStreamInput.setAttribute("name", "NewName_ID");

			InputContFullStream.append(EditFullStreamInput);

			//create the batch color input
			var EditFullStreamInput = document.createElement("input");
			EditFullStreamInput.setAttribute("class", "EditFullStreamInput");
			EditFullStreamInput.setAttribute("id", "NewColor_ID");
			EditFullStreamInput.setAttribute("type", "text");
			EditFullStreamInput.setAttribute("placeholder", "Current Color: " + previousColor);
			EditFullStreamInput.setAttribute("name", "NewColor_ID");

			InputContFullStream.append(EditFullStreamInput);

			//create the new batch total seats input
			var EditFullStreamInput = document.createElement("input");
			EditFullStreamInput.setAttribute("class", "EditFullStreamInput");
			EditFullStreamInput.setAttribute("id", "NewSeats_ID");
			EditFullStreamInput.setAttribute("type", "text");
			EditFullStreamInput.setAttribute("placeholder", "Current Total Seats: " + previousSeats);
			EditFullStreamInput.setAttribute("name", "NewSeats_ID");

			InputContFullStream.append(EditFullStreamInput);

			EditFullStream.append(InputContFullStream);
			EditFullStream.append(YesFullEdit);
			EditFullStream.append(NoFullEdit);

			//now enter it into the dom document
			document.body.appendChild(EditFullStream);

}

//create the double check pop up box
function CraftPopUpCheckBox(inputText, datamain1){

	var DoubleCheckBox = document.createElement('div');
	DoubleCheckBox.setAttribute("class", "DoubleCheckBox");

	var MainText = document.createElement('div');
	MainText.setAttribute("class", "MainText");

	var t = document.createTextNode(inputText);
	MainText.append(t);

	var YesButton = document.createElement('div');
	YesButton.setAttribute("class", "YesButton");
	YesButton.setAttribute("id", "YesButton_ID");
	YesButton.setAttribute("data-main", datamain1);
	var t = document.createTextNode('Yes');
	YesButton.append(t);

	var NoButton = document.createElement('div');
	NoButton.setAttribute("class", "NoButton");
	NoButton.setAttribute("id", "NoButton_ID");
	var t = document.createTextNode('No');
	NoButton.append(t);

	DoubleCheckBox.append(MainText);
	DoubleCheckBox.append(YesButton);
	DoubleCheckBox.append(NoButton);

	document.body.appendChild(DoubleCheckBox);
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














//timetable database stuff

function PopulateTimeTable(inputTable){

	//first find out how many subject grades there are..
	SubjectGrades = ReturnAsArrayChildOfTable(inputTable['UserClass']);

	//now loop through the subject grades and use the names as the address prefix

	for (var x = 0; x < SubjectGrades.length; x++) {

		CurrentSubjectGrade = SubjectGrades[x];

		//this will return as a JSON all the childs of working subject grade
		//convert it into working array of subjects e.g ['Physics', 'Chemistry', 'Biology']
		CurrentGrade_SubjectArray = ReturnAsArrayChildOfTable(inputTable['UserClass'][CurrentSubjectGrade]);

		for (var y = 0; y < CurrentGrade_SubjectArray.length; y++) {

			ThisGrade = CurrentSubjectGrade;
			ThisSubject = CurrentGrade_SubjectArray[y];

			//now that we have the grade and subject we need to find the number of streams each subject has

			StreamsArray = ReturnAsArrayChildOfTable(inputTable['UserClass'][ThisGrade][ThisSubject]['Streams']);

			//now we can loop through each stream
			for (var z = 0; z < StreamsArray.length; z++) { 

				ThisLoopGrade = ThisGrade;
				ThisLoopSubject = ThisSubject;
				ThisLoopStreamName = StreamsArray[z];
				ThisStreamColor = inputTable['UserClass'][ThisGrade][ThisSubject]['Streams'][ThisLoopStreamName]['StreamColor'];


				TimingsJSON = inputTable['UserClass'][ThisGrade][ThisSubject]['Streams'][ThisLoopStreamName]['Timings'];

				TimingsArray = $.map(TimingsJSON, function(el) { return el; });

				for (var q = 0; q < TimingsArray.length; q++) { 

					CraftAndInjectTimeTable(TimingsArray[q], ThisLoopGrade, ThisLoopSubject, ThisLoopStreamName, ThisStreamColor);
				}
			}
		}
	}

}

function CraftAndInjectTimeTable(TimingString, Grade, Subject, StreamName, color){

	SplitArray = TimingString.split(' ');

	Day = SplitArray[0];
	StartTime = SplitArray[1];
	EndTime = SplitArray[3];

	DayULString = Day + 'UL';

	//now we need to find the element in the page with this days name
	DayUL = document.getElementById(DayULString);

	//this is what the name and subject of the box in timetable will be
	var thisEvent = document.createElement("em");
	thisEvent.setAttribute("class", "event-name");

	var t = document.createTextNode(Grade);
	thisEvent.append(t);
	thisEvent.appendChild(document.createElement("br"));
	var t = document.createTextNode(Subject);
	thisEvent.append(t);
	thisEvent.appendChild(document.createElement("br"));
	var t = document.createTextNode(StreamName);
	thisEvent.append(t);


	var thisLink = document.createElement("a");
	thisLink.setAttribute("href", "");

	thisLink.append(thisEvent);

	//now make the LI class

	var thisLI = document.createElement("li");
	thisLI.setAttribute("class", "single-event");
	thisLI.setAttribute("data-start", StartTime);
	thisLI.setAttribute("data-end", EndTime);
	thisLI.setAttribute("data-content", 'event-abs-circuit');
	thisLI.setAttribute("data-event", StreamName);

	thisLI.style.background = color;

	thisLI.append(thisLink);

	DayUL.append(thisLI);


}






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

