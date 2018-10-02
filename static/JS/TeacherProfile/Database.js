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
	var global_database_json;

	//Fetch all relevant data for logged in user from our database using UID
	//this is the main function which will fetch the data from backend and then call the functions to craft the data into various places
	function FetchAllDataFromDatabase() {

		var ref = database.ref('USERS/' + Current_UID).once('value').then(function(snapshot) {

			//first remove the timetable if it exists and create it afresh
			if (document.getElementById('cdscheduleloading_ID')) {
				$('#cdscheduleloading_ID').remove();
			}

			CreateTimeTableHTML();

			tableData = snapshot.val();
			global_database_json = tableData;
			console.log(tableData);

			//Change the top name to user name
			document.getElementById("BlackBoardStudentName_ID").innerHTML = 'Teacher#34 ' + tableData['UserName'];
			document.title = tableData['UserName'] + ' - Profile';

			//now populate the stream config options section
			//so here we are going to have multi level FOR loops to propagate through our JSON structure
			//we need to loop through table data to find subjects/grades/ and batches in each one of them
			//this LoadandPopulateverything function will have multi level for loops with each loop finding things such as subject - grade - batches and so on
			LoadAndPopulateEverything(tableData);

			//this will craft the 24 hour clock timings for new batch timings add option box
			InjectTimingsIntoHTML();

			//now populate the timetable - this populates the timetable
			PopulateTimeTable(tableData);

			

			FadeOutLoadingFrame();

		}).then(function() {
			FormatTimeTable();
			//now call the function to attach events to all buttons
			AttachEventToAddStreamOptions();
			AttachEventToEachStudentClick();
			AttachEventToLectureClick();
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
			}

		}
	}


	function FillEachStreamBoxAndDropDownBox(timingArray, streamName, streamVacancy, streambox_ref, subject, classGrade, batchcolor) {

		//this will also fill the drop in box of add new stream timing stream name
		StreamNameSelectADDBOX_ID = document.getElementById('StreamNameSelectADDBOX_ID');

		OptText = streamName + ' | ' + subject + ' | ' + classGrade
		OptValue = classGrade + '/' + subject + '/Streams/' + streamName + '/';

		optionForAddBox = new Option(OptText, OptValue);
		optionForAddBox.setAttribute("class", "ADDTimingDropDOWN");
		StreamNameSelectADDBOX_ID.appendChild(optionForAddBox);

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





	function AttachEventToAddStreamOptions(){

		//Clicking the create new stream buttom tab
		$("#CreateNewStream_ID").click(function() {

			FadeInLoadingFrame();

			console.log('Add new stream clicked!');
	
			//first get all the input values nicely
	
			var e = document.getElementById("StreamSubjectSelect_ID");
			var ChosenSubject = e.options[e.selectedIndex].value; //e.g O LEVEL/Physics
	
			var ChosenStreamName = document.getElementById('StreamName_ID').value;
	
			var ChosenStreamColor = document.getElementById('StreamColor_ID').value;
			var ChosenStreamTotalSeats = document.getElementById('StreamTotalSeat_ID').value;
	
			CreateNewStream(ChosenSubject, ChosenStreamName, ChosenStreamColor, ChosenStreamTotalSeats);

			return false;
		});

		//Clicking the add new stream timing buttom tab
		$("#AddNewTiming_ID").click(function() {

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

			return false;
		});

		//attached delete events from the firebase database for each stream to be deleted when clicked
		$(".fa-trash-alt").click(function() {

			FadeInLoadingFrame();
			dataMain = String($(this).attr("data-main"));
			dataIndex = parseInt($(this).attr("data-main2"));

			console.log(dataMain);
			console.log(dataIndex);

			var tableToDeleteFromAddress = 'USERS/' + Current_UID + '/UserClass/' + dataMain;

			DeleteTableEntryByIndex(dataIndex, tableToDeleteFromAddress).then(ReloadBackEndData).then(function() {
				BoxAlert('Timing deleted successfully!');
			});

			return false;
		});

		//attached delete events from the firebase database for a full stream to be deleted when clicked
		$(".fa-trash").click(function() {

			BlurAnimate('.StreamConfigOptions');
			//$('.StreamConfigOptions').css('-webkit-filter', 'blur(5px)');

			dataMain = String($(this).attr("data-main"));

			CraftPopUpCheckBox('Are you sure? This will delete the entire stream with its database of students and everything.', dataMain);

			//click events for yes and no
			$("#YesButton_ID").click(function() {

				FadeInLoadingFrame();
	
				$('#StreamConfigOptions_ID')
	
				dataMain = String($(this).attr("data-main"));
	
				var tableToDeleteFromAddress = 'USERS/' + Current_UID + '/UserClass/' + dataMain;
	
				var ref = database.ref(tableToDeleteFromAddress);
	
				const promise = ref.remove();
	
				promise.then(ReloadBackEndData).then(function() {
					BoxAlert('Batch deleted successfully!');
					UnBlurAnimate('.StreamConfigOptions');
					//$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
					$('.DoubleCheckBox').remove();
					FadeOutLoadingFrame();
				});
	
				return false;
			});
	
			$("#NoButton_ID").click(function() {
				UnBlurAnimate('.StreamConfigOptions');
				$('.DoubleCheckBox').remove();
	
				return false;
			});

			return false;
		});

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
			BlurAnimate('.StreamConfigOptions');
			//$('.StreamConfigOptions').css('-webkit-filter', 'blur(5px)');

			//show and create the edit tab with datamain and datamain2 data embedded
			CraftEditOneStream(dataMain, dataIndex);

			//set the default values to the ones chosen before
			$('#InputChildDaySelect_ID').val(day);
			$('#InputChildStartTimeSelect_ID').val(sTime);
			$('#InputChildEndTimeSelect_ID').val(eTime);

			//click events for cancel and yes edit
			$(".CancelEdit").click(function() {
				//remove the editone stream window
				UnBlurAnimate('.StreamConfigOptions');
				//$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
				$('.EditOneStream').remove();
	
				return false;
			});

	
			$(".YesEdit").click(function() {
				//edit one stream
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
				var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + dataMain);
	
				var data = {
					[dataIndex]: newTiming
				}
	
				const promise = ref.update(data);
	
				promise.then(ReloadBackEndData).then(function() {
					BoxAlert('Timing has been changed successfully!');
					$('.EditOneStream').remove();
					UnBlurAnimate('.StreamConfigOptions');
					//$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
					FadeOutLoadingFrame();
				});
	
				return false;
			});

			return false;
		});

		//attached edit events from the firebase database for each stream to be edited when clicked
		$(".fa-pencil-alt").click(function() {

			console.log('Edit button clicked!');

			address = String($(this).attr("data-main"));
			streamName = $(this).attr("data-main2");
			streamVacancy = $(this).attr("data-main3").split('/')[1];
			streamColor = $(this).attr("data-main4");

			//blur the background
			BlurAnimate('.StreamConfigOptions');
			//$('.StreamConfigOptions').css('-webkit-filter', 'blur(5px)');

			//show and create the edit tab with datamain and datamain2 data embedded
			CraftEditFullStream(address, streamName, streamColor, streamVacancy);

			//setup click event if cancel is clicked
			$(".NoFullEdit").click(function() {
				//remove the editone stream window
				UnBlurAnimate('.StreamConfigOptions');
				//$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
				$('.EditFullStream').remove();
	
				return false;
			});

			//setup click eevnt if clicked yes on editing this full stream
			$(".YesFullEdit").click(function() {
				//edit full stream
				FadeInLoadingFrame();
	
				var snapshotJSON;
	
				//first get the data
				address = String($(this).attr("data-main"));
				streamName = $(this).attr("data-main2");
	
				var newName = document.getElementById("NewName_ID").value;
				var newColor = document.getElementById("NewColor_ID").value;
				var newSeats = document.getElementById("NewSeats_ID").value;
	
				if (newName == '') {
					newName = streamName;
				}
	
				//now lets first access the firebase database and keep a copy of the stream to be changed
				var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + streamName);
	
				const promise = ref.once('value', ReceivedData, errData).then(function() {
	
					//now we will delete this stream
					var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + streamName);
					ref.remove().then(function() {
						//now we need to reload the address with the new stream
						var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + address + newName);
	
						ref.update(snapshotJSON).then(ReloadBackEndData).then(function() {
							BoxAlert('Stream has been edited successfully!');
							$('.EditFullStream').remove();
							UnBlurAnimate('.StreamConfigOptions');
							//$('.StreamConfigOptions').css('-webkit-filter', 'blur(0px)');
							FadeOutLoadingFrame();
						});
					});
	
				});
	
	
				function ReceivedData(data) {
	
					tableData = data.val();
	
					//we need to change the color of the stream and seat cacpacity of tableData here
					if (newSeats != '') {
						tableData['TotalSeats'] = newSeats;
					}
	
					if (newColor != '') {
						tableData['StreamColor'] = newColor;
					}
	
					snapshotJSON = tableData;
	
				}
	
				function errData(err) {
					console.log('Error!');
					console.log(err);
				}
	
				return false;
			});

			return false;
		});


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

		//now recreate the streamboxes after fetching em all
		FetchAllDataFromDatabase();
	}





	//timetable database stuff

	function PopulateTimeTable(inputTable) {

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

					TimingsArray = $.map(TimingsJSON, function(el) {
						return el;
					});

					for (var q = 0; q < TimingsArray.length; q++) {

						CraftAndInjectTimeTable(TimingsArray[q], ThisLoopGrade, ThisLoopSubject, ThisLoopStreamName, ThisStreamColor);
					}
				}
			}
		}

	}

	function CraftAndInjectTimeTable(TimingString, Grade, Subject, StreamName, color) {

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


	//Log out event trigger
	document.getElementById("SignoutIcon2").addEventListener('click', e => {

		console.log('Logout cliked!');
		const auth = firebase.auth();

		//logout
		const promise = auth.signOut().then(function() {
			//send to front page
			console.log('Successfully logged out..');

		}, function(err) {
			console.log(err.code);
		});


	});


	//FIREBASE STUFF END
	function CraftTimingArray() {
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

	function InjectTimingsIntoHTML() {

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