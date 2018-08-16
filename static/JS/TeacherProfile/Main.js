	







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

			var olevel_subject_array = [];
			var alevel_subject_array = [];

			tableData = data.val();
			console.log(tableData);

			//now break down table data into useful data starting with the classes

			OLevel_Subjects_JSON = tableData['UserClass']['O LEVEL'];
			ALevel_Subjects_JSON = tableData['UserClass']['A LEVEL'];

   			for(var k in OLevel_Subjects_JSON) olevel_subject_array.push(k);

   			for(var k in ALevel_Subjects_JSON) alevel_subject_array.push(k);

			console.log(olevel_subject_array);
			console.log(alevel_subject_array);

			//now we need to inject these classes into the appropriate places throughout the page

			var option_subject;
			var select_subject = document.getElementById('StreamSubjectSelect_ID');

			for (var i = 0; i < olevel_subject_array.length; i++) {

				currentWorking_Subject = String(olevel_subject_array[i]);

				displayText = currentWorking_Subject + ' (O Level)';
				displayValue = 'O LEVEL/' + currentWorking_Subject

				//var option = new Option(text, value);
				option_subject = new Option(displayText, displayValue);
				select_subject.appendChild( option_subject );

				//insert it into current streams 
				//create streambox element
				ThisStreamBox = CreateStreamBox(currentWorking_Subject, 'O Level');

				//Now get the stream timings to inject 
				AllStreamsJSON_of_ThisSubject = tableData['UserClass']['O LEVEL'][currentWorking_Subject]['Streams']

				//now iterate over this json to find timings of each stream
				var key;
				for (key in AllStreamsJSON_of_ThisSubject) {

					var SeatVacancy = 'Vacant Seats: ' + String(AllStreamsJSON_of_ThisSubject[key]['FilledSeats']) + '/' + String(AllStreamsJSON_of_ThisSubject[key]['TotalSeats']);

					var arr = AllStreamsJSON_of_ThisSubject[key]['Timings'];
					ThisStreamTiming = $.map(arr, function(el) { return el; });
					console.log(ThisStreamTiming);
					//now this timing needs to be injected as an html
					FillEachStreamBox(ThisStreamTiming, currentWorking_Subject, SeatVacancy, ThisStreamBox);
				}

			}

			for (var i = 0; i < alevel_subject_array.length; i++) {

				currentWorking_Subject = String(alevel_subject_array[i]);

				displayText = currentWorking_Subject + ' (A Level)';
				displayValue = 'A LEVEL/' + currentWorking_Subject

				//var option = new Option(text, value);
				option_subject = new Option(displayText, displayValue);
				select_subject.appendChild( option_subject );

				//insert it into current streams 
				//create streambox element
				ThisStreamBox = CreateStreamBox(currentWorking_Subject, 'A Level');

				//Now get the stream timings to inject 
				AllStreamsJSON_of_ThisSubject = tableData['UserClass']['A LEVEL'][currentWorking_Subject]['Streams']

				//now iterate over this json to find timings of each stream
				var key;
				for (key in AllStreamsJSON_of_ThisSubject) {

					var SeatVacancy = 'Vacant Seats: ' + String(AllStreamsJSON_of_ThisSubject[key]['FilledSeats']) + '/' + String(AllStreamsJSON_of_ThisSubject[key]['TotalSeats']);

					var arr = AllStreamsJSON_of_ThisSubject[key]['Timings'];
					ThisStreamTiming = $.map(arr, function(el) { return el; });
					console.log(ThisStreamTiming);
					//now this timing needs to be injected as an html
					FillEachStreamBox(ThisStreamTiming, currentWorking_Subject, SeatVacancy, ThisStreamBox);
				}

			}




			//Change the top name to user name
			document.getElementById("BlackBoardStudentName_ID").innerHTML = 'Teacher#34 ' + tableData['UserName'];
			document.title = tableData['UserName'] + ' - Profile';
		}

		function errData(err){
			console.log('Error!');
			console.log(err);
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

		function FillEachStreamBox(timingArray, streamName, streamVacancy, streambox_ref){

			EachStreamBox = document.createElement("div");
			EachStreamBox.setAttribute("class", "EachStreamBox");

			//create the stream title which will display stream name
			EachStreamTitle = document.createElement("div");
			EachStreamTitle.setAttribute("class", "EachStreamTitle");

			var t = document.createTextNode(streamName);
			EachStreamTitle.append(t);

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

	}

	//Add a realtime listener for state auth change
	  firebase.auth().onAuthStateChanged( firebaseUser => {
	  	if (firebaseUser){
	  		console.log('Logged In..')
	  		console.log(firebaseUser);
	  		Current_UID = firebaseUser.uid;
	  		FetchAllDataFromDatabase();
	  		FadeOutLoadingFrame();

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

	FadeOutLoadingFrame();