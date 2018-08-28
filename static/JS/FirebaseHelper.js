

function DeleteTableEntryByIndex(InputIndex, TableAddress){
	//this function will delete a table entry by the index value e.g 0,1,2
	//var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  dataMain);

	var ref = database.ref(TableAddress);

	var nonDeletedStreams = [];

	const promise = ref.once('value', ReceivedData, errData).then(DeleteStreamFromDatabase);

	//Functions for fetching data
	function ReceivedData(data){

		tableData = data.val();
		var arr = $.map(tableData, function(el) { return el; });


		for (var i = 0; i < arr.length; i++) {

			if (i!=parseInt(InputIndex)){
				console.log('copying non deleted streams..');
				nonDeletedStreams.push(arr[i]);
			}

		}
		console.log(nonDeletedStreams);
	}

	function errData(err){
		console.log('Error!');
		console.log(err);
	}

	function DeleteStreamFromDatabase(){

  		var database = firebase.database();
  		var ref = database.ref(TableAddress);
  		ref.remove();
  		console.log('timing has been removed');

  		JSONarray = {...nonDeletedStreams};

		var database = firebase.database();
		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  dataMain);

		ref.update(JSONarray);

	}  

	return promise 	
}


function InsertDataIntoTable(InputJSONdata, tableAddress){
	//this will insert the JSON data into the tableAddress
	var ref = database.ref(tableAddress);

	const promise = ref.update(InputJSONdata);

	return promise
}

function AlertIfEmptyInput(element_ID, alertText){
	lol = document.getElementById('StreamName_ID').value;

	if (!lol){
		alert(alertText);
	}
}


function ReturnAsArrayChildOfTable(InputTableJSON){
	//this function will return as a child all the members of queried table as an array

	OutputArr = new Array();

	for(var k in InputTableJSON) OutputArr.push(k);

	return OutputArr
}

function CheckIfElementExistsInArray(element, InputArr){

	var CheckBoolean = false;

	for (var i = 0; i < InputArr.length; i++) {

		if (element==InputArr[i]){
			CheckBoolean = true;
			break
		}
	}

	return CheckBoolean
}


function CheckIfThisTableExists(tableAddress){
	//will return true if the given table exists and false if not

	var ExistsOrNot;

	var ref = database.ref(tableAddress);

	ref.once('value', ReceivedData, errData);

	//Functions for fetching data
	function ReceivedData(data){
		tableData = data.val();

		if (tableData){
			ExistsOrNot = true;
		}
		else {
			ExistsOrNot = false;
		}

	}

	function errData(err){
		console.log('Error!');
		console.log(err);
	}

	return ExistsOrNot

}


function BoxAlert(AlertText){
	document.getElementById('AlertText_ID').innerHTML = AlertText;
	$('.BoxAlert').fadeIn('fast');
}


function getScheduleTimestamp(time) {
	//accepts hh:mm format - convert hh:mm to timestamp
	time = time.replace(/ /g,'');
	var timeArray = time.split(':');
	var timeStamp = parseInt(timeArray[0])*60 + parseInt(timeArray[1]);
	return timeStamp;
}


function RewriteKeyName(oldName, newName, address){

		var snapshotJSON;
		//now lets first access the firebase database and keep a copy of the stream to be changed
		var ref = database.ref(address + oldName);

		const promise = ref.once('value', ReceivedData, errData).then(function(){

			//now we will delete this stream
			var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  address + oldName);
			ref.remove().then(function(){
				//now we need to reload the address with the new stream
				var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  address + newName);

				ref.update(snapshotJSON);

			});
		});

		function ReceivedData(data){

			tableData = data.val();

			snapshotJSON = tableData;

		}

		function errData(err){
			console.log('Error!');
			console.log(err);
		}
}


function CreateTimeTableHTML(){
//this will completely the base form of the timetable from scratch

	var cdscheduleloading = document.createElement('div');
	cdscheduleloading.setAttribute('class', 'cd-schedule loading');
	cdscheduleloading.setAttribute('id', 'cdscheduleloading_ID');

	var timeline = document.createElement('div');
	timeline.setAttribute('class', 'timeline');
	timeline.setAttribute('id', 'timeline_ID');

	var timingArray = document.createElement('ul');
	timingArray.setAttribute('id', 'timingArray_ul_ID');
	timeline.append(timingArray);

	cdscheduleloading.append(timeline);

	//create class events
	var events_ = document.createElement('div');
	events_.setAttribute('class', 'events');

		var eventUL = document.createElement('ul');

			//create one li for each day starting with sunday
			var eventLI = document.createElement('li');
			eventLI.setAttribute('class', 'events-group');

				var topInfo = document.createElement('div');
				topInfo.setAttribute('class', 'top-info');

					var topInfoSpan = document.createElement('span');
					var t = document.createTextNode('Sunday');
					topInfoSpan.append(t);
					topInfo.append(topInfoSpan);

					eventLI.append(topInfo);

				var Li_UL = document.createElement('ul');
				Li_UL.setAttribute('id', 'SundayUL');

				eventLI.append(Li_UL);

				eventUL.append(eventLI);

			//for monday
			var eventLI = document.createElement('li');
			eventLI.setAttribute('class', 'events-group');

				var topInfo = document.createElement('div');
				topInfo.setAttribute('class', 'top-info');

					var topInfoSpan = document.createElement('span');
					var t = document.createTextNode('Monday');
					topInfoSpan.append(t);
					topInfo.append(topInfoSpan);

					eventLI.append(topInfo);

				var Li_UL = document.createElement('ul');
				Li_UL.setAttribute('id', 'MondayUL');

				eventLI.append(Li_UL);

				eventUL.append(eventLI);


			//for Tuesday
			var eventLI = document.createElement('li');
			eventLI.setAttribute('class', 'events-group');

				var topInfo = document.createElement('div');
				topInfo.setAttribute('class', 'top-info');

					var topInfoSpan = document.createElement('span');
					var t = document.createTextNode('Tuesday');
					topInfoSpan.append(t);
					topInfo.append(topInfoSpan);

					eventLI.append(topInfo);

				var Li_UL = document.createElement('ul');
				Li_UL.setAttribute('id', 'TuesdayUL');

				eventLI.append(Li_UL);

				eventUL.append(eventLI);

			//for Wednesday
			var eventLI = document.createElement('li');
			eventLI.setAttribute('class', 'events-group');

				var topInfo = document.createElement('div');
				topInfo.setAttribute('class', 'top-info');

					var topInfoSpan = document.createElement('span');
					var t = document.createTextNode('Wednesday');
					topInfoSpan.append(t);
					topInfo.append(topInfoSpan);

					eventLI.append(topInfo);

				var Li_UL = document.createElement('ul');
				Li_UL.setAttribute('id', 'WednesdayUL');

				eventLI.append(Li_UL);

				eventUL.append(eventLI);

			//for thursday
			var eventLI = document.createElement('li');
			eventLI.setAttribute('class', 'events-group');

				var topInfo = document.createElement('div');
				topInfo.setAttribute('class', 'top-info');

					var topInfoSpan = document.createElement('span');
					var t = document.createTextNode('Thursday');
					topInfoSpan.append(t);
					topInfo.append(topInfoSpan);

					eventLI.append(topInfo);

				var Li_UL = document.createElement('ul');
				Li_UL.setAttribute('id', 'ThursdayUL');

				eventLI.append(Li_UL);

				eventUL.append(eventLI);

			//for friday
			var eventLI = document.createElement('li');
			eventLI.setAttribute('class', 'events-group');

				var topInfo = document.createElement('div');
				topInfo.setAttribute('class', 'top-info');

					var topInfoSpan = document.createElement('span');
					var t = document.createTextNode('Friday');
					topInfoSpan.append(t);
					topInfo.append(topInfoSpan);

					eventLI.append(topInfo);

				var Li_UL = document.createElement('ul');
				Li_UL.setAttribute('id', 'FridayUL');

				eventLI.append(Li_UL);

				eventUL.append(eventLI);

		//for saturday
			var eventLI = document.createElement('li');
			eventLI.setAttribute('class', 'events-group');

				var topInfo = document.createElement('div');
				topInfo.setAttribute('class', 'top-info');

					var topInfoSpan = document.createElement('span');
					var t = document.createTextNode('Saturday');
					topInfoSpan.append(t);
					topInfo.append(topInfoSpan);

					eventLI.append(topInfo);

				var Li_UL = document.createElement('ul');
				Li_UL.setAttribute('id', 'SaturdayUL');

				eventLI.append(Li_UL);

				eventUL.append(eventLI);

	events_.append(eventUL);

	cdscheduleloading.append(events_);

	//now create the modal stuff

	var eventmodal = document.createElement('div');
	eventmodal.setAttribute('class', 'event-modal');

		var _header = document.createElement('header');
		_header.setAttribute('class', 'header');

			var content = document.createElement('div');
			content.setAttribute('class', 'content');

				var eventdate = document.createElement('span');
				eventdate.setAttribute('class', 'event-date');

				var eventname = document.createElement('h3');
				eventname.setAttribute('class', 'event-name');

				content.append(eventdate);
				content.append(eventname);

				_header.append(content);

		var headerbg = document.createElement('div');
		headerbg.setAttribute('class', 'header-bg');

		_header.append(headerbg);

		eventmodal.append(_header);


	var _body = document.createElement('div');
	_body.setAttribute('class', 'body');

		var eventinfo = document.createElement('div');
		eventinfo.setAttribute('class', 'event-info');

		var bodybg = document.createElement('div');
		bodybg.setAttribute('class', 'body-bg');

		_body.append(eventinfo);
		_body.append(bodybg);

		eventmodal.append(_body);


	var link_ = document.createElement('a');
	link_.setAttribute('class', 'close');
	link_.setAttribute('href', '');

	var t = document.createTextNode('Close');
	link_.append(t);

	eventmodal.append(link_);

	cdscheduleloading.append(eventmodal);


	//coverlayer
	var coverlayer = document.createElement('div');
	coverlayer.setAttribute('class', 'cover-layer');

	cdscheduleloading.append(coverlayer);

	document.getElementById('MainTimeTableCont_ID').appendChild(cdscheduleloading);

}


//attach event to clicking on each student in student tab
function AttachEventToEachStudentClick(){

	//for accepting pending students
    $(".fa-user-check").click(function() {
		console.log('clicked user pending accept!');

		FadeInLoadingFrame();

		//delete this entry from the table
		UID = String($(this).attr("data-UID"));

		Address = String($(this).attr("data-address"));

		studentName_ = String($(this).attr("data-name"));

		TotalSeats = parseInt($(this).attr("data-totalseats"));

		FilledSeats = parseInt($(this).attr("data-fillseats"));

		//now first check to see if the batch is filled, if it is then do nothing, otherwise add in this dude
		if (FilledSeats<TotalSeats) {
			//add in this dude
			//access the firebase database and remove this entry

			var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address + 'PendingStudents/' + UID);

			ref.remove().then(function(){

				//now need to put this in the accepted box
				var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address + 'AcceptedStudents/'+ UID);

				var data = {
					StudentName: studentName_
				}

				ref.update(data).then(function(){
					//now need to increment the seat filled by 1
					var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address);

					newFilledSeats = FilledSeats + 1;

					var data = {
						FilledSeats: newFilledSeats
					}

					ref.update(data).then(ReloadBackEndData).then(function(){
						BoxAlert('User accepted successfully!');
	    				FadeOutLoadingFrame();
					});

				});

			});
		}

		else {

			BoxAlert('Cannot add to full Batch!');

		}

    	return false;
    }); 


    //for dismissing pending students
   	$(".fa-user-times").click(function() {
		console.log('clicked user dismiss!');
		FadeInLoadingFrame();

		//delete this entry from the table
		UID = String($(this).attr("data-UID"));

		Address = String($(this).attr("data-address"));

		//access the firebase database and remove this entry

		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address + 'PendingStudents/' + UID);

		ref.remove().then(ReloadBackEndData).then(function(){
    		BoxAlert('User dismissed successfully!');
    		FadeOutLoadingFrame();
    	});

    	return false;
    }); 

    //for dismissing pending students in bulk
   	$(".DismissAll").click(function() {
		console.log('clicked user dismiss in bulk!');
		FadeInLoadingFrame();

		//delete this entry from the table
		UID = String($(this).attr("data-UID"));

		Address = String($(this).attr("data-address"));

		//access the firebase database and remove this entry

		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address + 'PendingStudents/');

		ref.remove().then(ReloadBackEndData).then(function(){
    		BoxAlert('All pending dismissed successfully!');
    		FadeOutLoadingFrame();
    	});

    	return false;
    }); 

    //for deleting accepted students
   	$(".fa-user-minus").click(function() {
		console.log('clicked user delete!');
		FadeInLoadingFrame();

		//delete this entry from the table
		UID = String($(this).attr("data-UID"));

		Address = String($(this).attr("data-address"));

		studentName_ = String($(this).attr("data-name"));

		TotalSeats = parseInt($(this).attr("data-totalseats"));

		FilledSeats = parseInt($(this).attr("data-fillseats"));

		//access the firebase database and remove this entry

		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address + 'AcceptedStudents/' + UID);

		ref.remove().then(function(){
			//now need to decrease filled seats by 1
			var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address);

			newFilledSeats = FilledSeats - 1;

			var data = {
				FilledSeats: newFilledSeats
			}

			ref.update(data).then(ReloadBackEndData).then(function(){
				BoxAlert('User deleted successfully!');
				FadeOutLoadingFrame();
			});

		});

    	return false;
    }); 


    //for clicking on the send message button in accpeted heading
   	$(".MessageIcon").click(function() {
		console.log('MessageIcon Clicked');

		streamName = String($(this).attr("data-streamName"));
		subject = String($(this).attr("data-subject"));
		grade = String($(this).attr("data-grade"));

		//now need to create the message batch box
		BlurAnimate('.MainContent');
		//$('.MainContent').css('-webkit-filter', 'blur(30px');
		CreateMessageBox(streamName, subject, grade);

		//now need to attach click events to send message and cancel message buttons
	    //for clicking cancel message
	   	$(".CancelMessage").click(function() {
			console.log('clicked message cancel!');
			UnBlurAnimate('.MainContent');
			//$('.MainContent').css('-webkit-filter', 'blur(0px');
			$('.MessageBatchBox').fadeOut('fast', function(){
				$('.MessageBatchBox').remove();
			})
	    	return false;
	    }); 

	    //for clicking send message
	   	$(".SendMessage").click(function() {
			console.log('clicked message send!');
			
			Address = String($(this).attr("data-address"));

			ActualMessage = document.getElementById('SendMessageInput_ID').value;

			//now insert this into firebase database
			var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address + 'GlobalMessage/');

			var d = new Date();
			d.toUTCString();

			var data = {
				[d]: ActualMessage
			}

			ref.update(data).then(function(){
				UnBlurAnimate('.MainContent');
				//$('.MainContent').css('-webkit-filter', 'blur(0px');
				BoxAlert('Message Sent');
				$('.MessageBatchBox').fadeOut('fast', function(){
					$('.MessageBatchBox').remove();
				})
			});

	    	return false;
	    }); 


    	return false;
    }); 

    //for clicking on roll call
   	$(".RollCallIcon").click(function() {
		console.log('clicked roll call icon!');

		FadeInLoadingFrame();

		streamName = String($(this).attr("data-streamName"));

		subject = String($(this).attr("data-subject"));

		grade = String($(this).attr("data-grade"));

		address = grade + '/' + subject + '/Streams/' + streamName + '/';

		studentNamesArr = [];
		studentUIDArr = [];

		//first we need to access the database and pull the names of accepted students and UID
		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  address + 'AcceptedStudents/');

		ref.once('value', ReceivedData, errData).then(function(){

			//now that we have have the student names and UID array we can craft the roll call box..

			CreateRollCallBox(studentNamesArr, studentUIDArr, streamName, subject, grade);

			//now need to attach click events to submit and cancel roll calls
		    //for clicking cancel roll call
		   	$(".CancelRollCall").click(function() {

		   		FadeOutANDRemove('fast', '.RollCallCont');
				UnBlurAnimate('.MainContent');
				//$('.MainContent').css('-webkit-filter', 'blur(0px');
		    	return false;
		    }); 

		    //for clicking submit roll call
		   	$(".SubmitRollCall").click(function() {

		   		FadeInLoadingFrame();

		   		console.log('Submit roll call clicked!');

		   		address = String($(this).attr("data-address"));

		   		//first get all the checked boxes
		   		var CheckBox_CHECKED = $('.RollCall_CBOX:checked').map(function() {
	    				return $(this).val();
				}).get();

		   		//then get all the unchecked box
		   		var CheckBox_UNCHECKED = $('.RollCall_CBOX:not(:checked)').map(function() {
	    				return $(this).val();
				}).get();

				console.log(CheckBox_CHECKED);
				console.log(CheckBox_UNCHECKED);

		   		//now insert this into class attendance tab
		   		today = new Date().toISOString().slice(0, 10);

		   		for (var i = 0; i < CheckBox_CHECKED.length ; i++) {
		   			//loop through and update each students roll call for present
		   			var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  address + 'AcceptedStudents/' + String(CheckBox_CHECKED[i]) + '/ClassAttendance/');

		   			var data = {
		   				[today]: 'Present'
		   			}

		   			ref.update(data);

		   		}


		   		for (var i = 0; i < CheckBox_UNCHECKED.length ; i++) {
		   			//loop through and update each students roll call for present
		   			var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  address + 'AcceptedStudents/' + String(CheckBox_UNCHECKED[i]) + '/ClassAttendance/');

		   			var data = {
		   				[today]: 'Absent'
		   			}

		   			ref.update(data);
		   		}

		   		FadeOutANDRemove('fast', '.RollCallCont');
				UnBlurAnimate('.MainContent');
				//$('.MainContent').css('-webkit-filter', 'blur(0px');
   				FadeOutLoadingFrame();
   				BoxAlert('Roll calls updated: ' + String(today) );

		    	return false;
		    }); 

			FadeOutLoadingFrame();
		});


		function ReceivedData(data){
			tableData = data.val();

			BlurAnimate('.MainContent');
			//$('.MainContent').css('-webkit-filter', 'blur(30px');

			//now we can loop through them and fill the student name and UID arrays
			var key;
			for (key in tableData) {
				CurrentStudentUID = key;

				CurrentStudentName = tableData[key]['StudentName'];

				studentNamesArr.push(CurrentStudentName);
				studentUIDArr.push(CurrentStudentUID);
			}

		}

		function errData(err){
			console.log('Error!');
			console.log(err);
		}


    	return false;
    }); 

    //for clicking on each student in accepted row
   	$(".OneStudentLine").click(function(e) {
		console.log('clicked user one student line!');
		FadeInLoadingFrame();

		UID = String($(this).attr("data-uid"));

		Address = String($(this).attr("data-address"));
		streamName = String($(this).attr("data-streamName"));
		grade = String($(this).attr("data-grade"));
		subject = String($(this).attr("data-subject"));
		studentname = String($(this).attr("data-studentName"));

		today = new Date().toISOString().slice(0, 10);
		currentYear = today.split('-')[0];
		MonthsArr = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


		//access the firebase database and extract all the necessary info
		//first we gotta get the roll call arrays from the firebase database
		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address + 'AcceptedStudents/' + UID + '/').once('value').then(function(snapshot) {
  			var myData = snapshot.val();

  			console.log(myData);

			rollCallDateArray_ = [];
			rollCallAttendanceArr_ = [];

			TutionMothYearArray = [];
			TutionPaidDayArray = [];

  			//separate the obtained json into the three parts - rollcall, tution, exam

  			//get the roll call stuff
			ClassAttendanceJSON = myData['ClassAttendance'];

			//now we can loop through them and fill the roll call date and attendance arrays
			var key;	//where key is each data in the table
			for (key in ClassAttendanceJSON) {
				CurrentDate = key;

				CurrentAttendance = ClassAttendanceJSON[key];

				rollCallDateArray_.push(CurrentDate);
				rollCallAttendanceArr_.push(CurrentAttendance);
			}

			//get the tution paid stuff
			TutionPaidJSON = myData['TutionPaid'];

			//now we can loop through the dates of tution paid and insert them into the respective arrays
			var key;	//where key is each year.month in the table 201805 and value is day
			for (key in TutionPaidJSON) {
				MonthYear = key;

				Day_ = TutionPaidJSON[key];

				TutionMothYearArray.push(MonthYear);
				TutionPaidDayArray.push(Day_);
			}

			//if needed to reverse the date and month arrays
			newTutionMothYearArray = TutionMothYearArray.reverse();
			newTutionPaidDayArray = TutionPaidDayArray.reverse();


			//now that we have our all input arrays we can call the function to craft them
			//first we need to find the pending month based on the last paid month and add 1 to it
			//if a last paid month exists then make the current one the next one of last paid
			if (newTutionMothYearArray[0]) {
				LastPaidMonthIndex = parseInt(newTutionMothYearArray[0].substring(4, 6));
				monthArrIndex = LastPaidMonthIndex-1;

				//but make sure to reset it back to 0 if we get 11 i.e december and also increase year by 1
				if (monthArrIndex==11){
					PendingMonth = MonthsArr[0];
					currentYear = parseInt(currentYear) + 1;

				}
				else{
					PendingMonth = MonthsArr[monthArrIndex+1];
				}

				PendingMonthYear = PendingMonth + ' ' + currentYear;
			}
			//otherwise just set the pending month to the actual current month
			else {
				//set pending month to current month
				now_ = new Date().toISOString().slice(0, 10);
				thisYear = now_.split('-')[0];
				thisMonth = MonthsArr[parseInt(now_.split('-')[1]) - 1];
				PendingMonthYear = thisMonth + ' ' + thisYear;
			}

			FadeOutLoadingFrame();
			BlurAnimate('.MainContent');

			CreateStudentInfoBox(rollCallDateArray_, rollCallAttendanceArr_, studentname, UID, streamName, subject, grade, PendingMonthYear, newTutionMothYearArray, newTutionPaidDayArray);

			//now attach click events to this newly made student info box
		   	$("#StudentInfoContCloseIcon").click(function() {
		   		FadeOutANDRemove('fast', '.StudentInfoCont');
				UnBlurAnimate('.MainContent');
		    	return false;
		    }); 

		   	$(".TutionAcceptButton").click(function() {
		   		//accept the tution and update the database
		   		FadeInLoadingFrame();

		   		now_ = new Date().toISOString().slice(0, 10);

				UID = String($(this).attr("data-uid"));

				Address = String($(this).attr("data-address"));

				studentName = String($(this).attr("data-studentname"));

				//crafted value needs to be of the form 201809 or year.month without the dot

				innerValue = String($(this).attr("data-value"));

				//inner value is of the form Jul 2018 e.g

				year_ = innerValue.split(' ')[1];

				findIndexMonth = parseInt(MatchAndFindIndex(MonthsArr, innerValue.split(' ')[0])) + 1;

				formattedFindIndexMonth = (findIndexMonth).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

				craftedValue = String(year_) + String(formattedFindIndexMonth);

				var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address + 'AcceptedStudents/' + UID + '/TutionPaid/');

				var data = {
					[craftedValue]:now_
				};

				ref.update(data).then(ReloadBackEndData).then(function(){
					BoxAlert('Payment Month: ' + innerValue + ' accepted for ' + String(studentName));
					FadeOutLoadingFrame();
					UnBlurAnimate('.MainContent');
				})

		    	return false;
		    }); 

		   	//attach events to deleting last paid entry
		   	$(".fa-eraser").click(function() {

		   		FadeInLoadingFrame();

				UID = String($(this).attr("data-uid"));

				Address = String($(this).attr("data-address"));

				studentName = String($(this).attr("data-studentname"));

				key_ = String($(this).attr("data-value"));

				var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address + 'AcceptedStudents/' + UID + '/TutionPaid/' + String(key_) + '/');

				ref.remove().then(ReloadBackEndData).then(function(){
					BoxAlert('Last Paid Month deleted for ' + String(studentName));
					FadeOutLoadingFrame();
					UnBlurAnimate('.MainContent');
				});

		    	return false;
		    }); 

		   	//attach event to flip the attendance of clicked on entry
		   	$(".fa-exchange-alt").click(function() {

		   		FadeInLoadingFrame();

				UID = String($(this).attr("data-uid"));

				Address = String($(this).attr("data-address"));

				key_ = String($(this).attr("data-key"));

				studentName = String($(this).attr("data-studentname"));

				currentAttendance = String($(this).attr("data-current"));

				finalVal = '';

				var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address + 'AcceptedStudents/' + UID + '/ClassAttendance/');

				if (currentAttendance=='Present'){

					finalVal = 'Absent'; 
				}
				else if (currentAttendance=='Absent'){
					finalVal = 'Present';
				}
				else {
					console.log('Problem in flipping present or absent!')
				}

				var data = {
					[key_]:finalVal
				};

				ref.update(data).then(ReloadBackEndData).then(function(){
					BoxAlert('Date: ' + key_ + ' flipped to ' + finalVal + ' for ' + studentName);
					FadeOutLoadingFrame();
					UnBlurAnimate('.MainContent');
				});

		    	return false;
		    }); 

		   	//clicking on plot bar chart of roll calls
		   	$(".PlotRollCallHistogram").click(function() {

		   		createCanvasChartJS();
		   		BarChartRollCallJS('.OneAttendanceEntryCont', '.OneAttendanceEntry');

		   		//attach close event for this
			   	$("#CloseChart").click(function() {
			   		$('.MegaCanvasCont').fadeOut('slow', function(){
			   			$('.MegaCanvasCont').remove();
			   		});
			    	return false;
			    }); 

		    	return false;
		    }); 
  
		});

    	return false;
   	}); 

    //shortcut tution accept button
   	$(".ShortcutTutionAccept").click(function() {
   		console.log('Shortcut button clicked!');
   		//accept the tution and update the database
   		FadeInLoadingFrame();

   		now_ = new Date().toISOString().slice(0, 10);

		UID = String($(this).attr("data-uid"));

		Address = String($(this).attr("data-address"));

		studentName = String($(this).attr("data-studentname"));

		//crafted value needs to be of the form 201809 or year.month without the dot

		innerValue = String($(this).attr("data-value"));

		//inner value is of the form Jul 2018 e.g

		year_ = innerValue.split(' ')[1];

		findIndexMonth = parseInt(MatchAndFindIndex(MonthsArr, innerValue.split(' ')[0])) + 1;

		formattedFindIndexMonth = (findIndexMonth).toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});

		craftedValue = String(year_) + String(formattedFindIndexMonth);

		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' +  Address + 'AcceptedStudents/' + UID + '/TutionPaid/');

		var data = {
			[craftedValue]:now_
		};

		ref.update(data).then(ReloadBackEndData).then(function(){
			BoxAlert('Payment Month: ' + innerValue + ' accepted for ' + String(studentName));
			FadeOutLoadingFrame();
			UnBlurAnimate('.MainContent');
		})

    	return false;
    }); 

}



//create the batchbox
function CreateStudentBatchBox(streamName, subject, grade, SeatsFilled){

	address = grade + '/' + subject + '/Streams/' + streamName + '/';

	var BatchBox = document.createElement('div');
	BatchBox.setAttribute('class', 'BatchBox');
	BatchBox.setAttribute('id', 'BatchBox_ID');

		//the heading part

		var BatchBoxHeading = document.createElement('div');
		BatchBoxHeading.setAttribute('class', 'BatchBoxHeading');

			var BatchName = document.createElement('span');
			BatchName.setAttribute('class', 'BatchName');

			var t = document.createTextNode(streamName + ' |');
			BatchName.append(t);

			var BatchFillRate = document.createElement('span');
			BatchFillRate.setAttribute('class', 'BatchFillRate');

			var t = document.createTextNode(SeatsFilled);
			BatchFillRate.append(t);

			var BatchGrade = document.createElement('span');
			BatchGrade.setAttribute('class', 'BatchGrade');

			var t = document.createTextNode(grade);
			BatchGrade.append(t);

			var BatchSubject = document.createElement('span');
			BatchSubject.setAttribute('class', 'BatchSubject');

			var t = document.createTextNode(subject);
			BatchSubject.append(t);

			BatchBoxHeading.append(BatchName);
			BatchBoxHeading.append(BatchFillRate);
			BatchBoxHeading.append(BatchGrade);
			BatchBoxHeading.append(BatchSubject);

			BatchBox.append(BatchBoxHeading);

		//the accepted box

		var AcceptedBox = document.createElement('div');
		AcceptedBox.setAttribute('class', 'AcceptedBox');
		AcceptedBox.setAttribute('id', grade.split(' ').join('') + subject + 'AcceptedBox_ID');

		var AcceptedBoxHeading = document.createElement('div');
		AcceptedBoxHeading.setAttribute('class', 'AcceptedBoxHeading');

		var s = document.createElement('span');
		var t = document.createTextNode('Accepted');
		s.append(t);

		AcceptedBoxHeading.append(s);

		var RollCallIcon = document.createElement('span');
		RollCallIcon.setAttribute('class', 'RollCallIcon');
		RollCallIcon.setAttribute('data-streamName', streamName);
		RollCallIcon.setAttribute('data-subject', subject);
		RollCallIcon.setAttribute('data-grade', grade);
		var t = document.createTextNode('Roll Call');
		RollCallIcon.append(t);

		AcceptedBoxHeading.append(RollCallIcon);

		var MessageIcon = document.createElement('span');
		MessageIcon.setAttribute('class', 'MessageIcon');
		MessageIcon.setAttribute('data-streamName', streamName);
		MessageIcon.setAttribute('data-subject', subject);
		MessageIcon.setAttribute('data-grade', grade);
		var t = document.createTextNode('Message');
		MessageIcon.append(t);

		AcceptedBoxHeading.append(MessageIcon);	

		AcceptedBox.append(AcceptedBoxHeading);

		BatchBox.append(AcceptedBox);

		//create the pending box
		var PendingBox = document.createElement('div');
		PendingBox.setAttribute('class', 'PendingBox');
		PendingBox.setAttribute('id', grade.split(' ').join('') + subject + 'PendingBox_ID');

		var PendingBoxHeading = document.createElement('div');
		PendingBoxHeading.setAttribute('class', 'PendingBoxHeading');

		var s = document.createElement('span');
		var t = document.createTextNode('Requested');
		s.append(t);

		PendingBoxHeading.append(s);

		var DismissAll = document.createElement('span');
		DismissAll.setAttribute('class', 'DismissAll');
		DismissAll.setAttribute('data-address', address);
		var t = document.createTextNode('Dismiss All');
		DismissAll.append(t);

		PendingBoxHeading.append(DismissAll);

		PendingBox.append(PendingBoxHeading);

		BatchBox.append(PendingBox);

		document.getElementById('BoxesContainer_ID').appendChild(BatchBox);
}

//create one student line for batchbox for accepted
function OneStudentLineAccepted(studentName_, UID, grade, subject, streamName, totSeats, fillSeats, pendingMonthYEAR){

	address = grade + '/' + subject + '/Streams/' + streamName + '/'; 

	var OneStudentLine = document.createElement('div');
	OneStudentLine.setAttribute('class', 'OneStudentLine');
	OneStudentLine.setAttribute('data-UID', UID);
	OneStudentLine.setAttribute('data-studentName', studentName_);
	OneStudentLine.setAttribute('data-address', address);
	OneStudentLine.setAttribute('data-streamName', streamName);
	OneStudentLine.setAttribute('data-grade', grade);
	OneStudentLine.setAttribute('data-subject', subject);

		var StudentName = document.createElement('span');
		StudentName.setAttribute('class', 'StudentName');

		var t = document.createTextNode(studentName_);
		StudentName.append(t);

		OneStudentLine.append(StudentName);

		var ShortcutTutionAccept = document.createElement('div');
		ShortcutTutionAccept.setAttribute('class', 'ShortcutTutionAccept');
		ShortcutTutionAccept.setAttribute('id', 'ShortcutTutionAccept_ID');
		ShortcutTutionAccept.setAttribute('data-UID', UID);
		ShortcutTutionAccept.setAttribute('data-studentname', studentName_);
		ShortcutTutionAccept.setAttribute('data-address', address);
		ShortcutTutionAccept.setAttribute('data-value', pendingMonthYEAR);

		var t = document.createTextNode('Pending Pay: ' + String(pendingMonthYEAR));
		ShortcutTutionAccept.append(t);

		var _delete = document.createElement('i');
		_delete.setAttribute('class', 'fas fa-user-minus');
		_delete.setAttribute('id', 'BanIcon');
		_delete.setAttribute('data-UID', UID);
		_delete.setAttribute('data-address', address);
		_delete.setAttribute('data-name', studentName_);
		_delete.setAttribute('data-totalseats', totSeats);
		_delete.setAttribute('data-fillseats', fillSeats);

		OneStudentLine.append(_delete);
		OneStudentLine.append(ShortcutTutionAccept);

		document.getElementById(grade.split(' ').join('') + subject + 'AcceptedBox_ID').appendChild(OneStudentLine);
}


//create one student line for batchbox for pending
function OneStudentLinePending(studentName_, UID, grade, subject, streamName, totSeats, fillSeats){

	address = grade + '/' + subject + '/Streams/' + streamName + '/'; 

	var OneStudentLine = document.createElement('div');
	OneStudentLine.setAttribute('class', 'OneStudentLinePending');
	OneStudentLine.setAttribute('data-UID', UID);
	OneStudentLine.setAttribute('data-address', address);

		var StudentName = document.createElement('span');
		StudentName.setAttribute('class', 'StudentName');

		var t = document.createTextNode(studentName_);
		StudentName.append(t);

		OneStudentLine.append(StudentName);

		var _delete = document.createElement('i');
		_delete.setAttribute('class', 'fas fa-user-times');
		_delete.setAttribute('id', 'BanIcon');
		_delete.setAttribute('data-UID', UID);
		_delete.setAttribute('data-address', address);

		OneStudentLine.append(_delete);

		var _add = document.createElement('i');
		_add.setAttribute('class', 'fas fa-user-check');
		_add.setAttribute('id', 'Addicon');
		_add.setAttribute('data-UID', UID);
		_add.setAttribute('data-address', address);
		_add.setAttribute('data-name', studentName_);
		_add.setAttribute('data-totalseats', totSeats);
		_add.setAttribute('data-fillseats', fillSeats);


		OneStudentLine.append(_add);

		document.getElementById(grade.split(' ').join('') + subject + 'PendingBox_ID').appendChild(OneStudentLine);
}


//create the message box for student tab
function CreateMessageBox(streamName, subject, grade){

	address = grade + '/' + subject + '/Streams/' + streamName + '/';

	var MessageBatchBox = document.createElement('div');
	MessageBatchBox.setAttribute('class', 'MessageBatchBox');
	MessageBatchBox.setAttribute('id', 'MessageBatchBox_ID');

	var MessageBoxHeading = document.createElement('div');
	MessageBoxHeading.setAttribute('class', 'MessageBoxHeading');

	var t = document.createTextNode('Message To: ' + streamName + ' | ' + subject + ' | ' + grade)
	MessageBoxHeading.append(t);

	MessageBatchBox.append(MessageBoxHeading);

	var SendMessageInput = 	document.createElement('textarea');
	SendMessageInput.setAttribute('class', 'SendMessageInput');
	SendMessageInput.setAttribute('id', 'SendMessageInput_ID');
	SendMessageInput.setAttribute('name', 'SendMessageInput');
	SendMessageInput.setAttribute('placeholder', 'Please enter your message. The text window can be resized for longer messages..');

	var SendMessage = document.createElement('div');
	SendMessage.setAttribute('class', 'SendMessage');
	SendMessage.setAttribute('id', 'SendMessage_ID');
	SendMessage.setAttribute('data-address', address);

	var t = document.createTextNode('Send');
	SendMessage.append(t);

	var CancelMessage = document.createElement('div');
	CancelMessage.setAttribute('class', 'CancelMessage');
	CancelMessage.setAttribute('id', 'CancelMessage_ID');

	var t = document.createTextNode('Cancel');
	CancelMessage.append(t);

	MessageBatchBox.append(SendMessageInput);
	MessageBatchBox.append(SendMessage);
	MessageBatchBox.append(CancelMessage);

	document.body.appendChild(MessageBatchBox);

}


//create the roll cal box for student tab
function CreateRollCallBox(studentNameArr, studentUIDArr, streamName, subject, grade){

	address = grade + '/' + subject + '/Streams/' + streamName + '/';

	var RollCallCont = document.createElement('div');
	RollCallCont.setAttribute('class', 'RollCallCont');

		var RollCallHeading = document.createElement('div');
		RollCallHeading.setAttribute('class', 'RollCallHeading');

		var heading1 = document.createElement('span');
		var t = document.createTextNode('Roll Call: ' + streamName + ' | ' + subject + ' | ' + grade);
		heading1.append(t);

		RollCallHeading.append(heading1);

		var CancelRollCall = document.createElement('span');
		CancelRollCall.setAttribute('class', 'CancelRollCall');

		var t = document.createTextNode('Cancel');
		CancelRollCall.append(t);

		var SubmitRollCall = document.createElement('span');
		SubmitRollCall.setAttribute('class', 'SubmitRollCall');
		SubmitRollCall.setAttribute('data-address', address);

		var t = document.createTextNode('Submit');
		SubmitRollCall.append(t);

		RollCallHeading.append(CancelRollCall);
		RollCallHeading.append(SubmitRollCall);

		RollCallCont.append(RollCallHeading);

		for (var i = 0; i < studentNameArr.length; i++) {
			//loop through and create elements for each studentName

			var LineCont = document.createElement('div');
			LineCont.setAttribute('class', 'LineCont');

			//CBOX LABEL
			var CBOX_LABEL = document.createElement('label');
			CBOX_LABEL.setAttribute('class', 'CBOX_LABEL');
			CBOX_LABEL.setAttribute('for', studentNameArr[i].split(' ').join('') + '_ID');

			var t = document.createTextNode(studentNameArr[i]);
			CBOX_LABEL.append(t);

			//checkbox
			var RollCall_CBOX = document.createElement('input');
			RollCall_CBOX.setAttribute('class', 'RollCall_CBOX');
			RollCall_CBOX.setAttribute('type', 'checkbox');
			RollCall_CBOX.setAttribute('id', studentNameArr[i].split(' ').join('') + '_ID');
			RollCall_CBOX.setAttribute('name', studentNameArr[i]);
			RollCall_CBOX.setAttribute('value', studentUIDArr[i]);
			

			LineCont.append(CBOX_LABEL);
			LineCont.append(RollCall_CBOX);

			RollCallCont.append(LineCont);
		}

		document.body.appendChild(RollCallCont);

}


//create the student Info box
function CreateStudentInfoBox(rollCallDateArr, rollCallAttendanceArr, _studentName, studentUID, streamName, subject, grade, currentTutionPendingMonth, TutionMothYearArray, TutionPaidDayArray){


	address = grade + '/' + subject + '/Streams/' + streamName + '/';
	MonthsArr = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	var StudentInfoCont = document.createElement('div');
	StudentInfoCont.setAttribute('class', 'StudentInfoCont');

		//close icon part
		var StudentInfoContCloseIcon = document.createElement('div');
		StudentInfoContCloseIcon.setAttribute('class', 'far fa-times-circle');
		StudentInfoContCloseIcon.setAttribute('id', 'StudentInfoContCloseIcon');

		StudentInfoCont.append(StudentInfoContCloseIcon);

		//the heading part
		var StudentInfoTopBox = document.createElement('div');
		StudentInfoTopBox.setAttribute('class', 'StudentInfoTopBox');

			//student name
			var StudentNameRollCall = document.createElement('div');
			StudentNameRollCall.setAttribute('class', 'StudentNameRollCall');

			var t = document.createTextNode(_studentName);
			StudentNameRollCall.append(t);

			StudentInfoTopBox.append(StudentNameRollCall);

			//student UID
			var StudentIDRollCall = document.createElement('div');
			StudentIDRollCall.setAttribute('class', 'StudentIDRollCall');

			var t = document.createTextNode('#' + studentUID);
			StudentIDRollCall.append(t);

			StudentInfoTopBox.append(StudentIDRollCall);

			//Message box
			var StudentMessageRollCall = document.createElement('div');
			StudentMessageRollCall.setAttribute('class', 'StudentMessageRollCall');
			StudentMessageRollCall.setAttribute('data-address', address);
			StudentMessageRollCall.setAttribute('data-studentname', _studentName);
			StudentMessageRollCall.setAttribute('data-studentuid', studentUID);

			var t = document.createTextNode('Message');
			StudentMessageRollCall.append(t);

			StudentInfoTopBox.append(StudentMessageRollCall);

			StudentInfoCont.append(StudentInfoTopBox);


			//now work on the roll call column
			var StudentInfoRollCallCont = document.createElement('div');
			StudentInfoRollCallCont.setAttribute('class', 'StudentInfoRollCallCont');

				//the roll call heading
				var StudentInfoRollCallHeading = document.createElement('div');
				StudentInfoRollCallHeading.setAttribute('class', 'StudentInfoRollCallHeading');	

				var t = document.createTextNode('Roll Call');
				StudentInfoRollCallHeading.append(t);

				StudentInfoRollCallCont.append(StudentInfoRollCallHeading);

				//the roll call action tab
				var StudentInfoRollCallAction = document.createElement('div');
				StudentInfoRollCallAction.setAttribute('class', 'StudentInfoRollCallAction');

					var RollCallGraphHeading = document.createElement('span');
					RollCallGraphHeading.setAttribute('class', 'RollCallGraphHeading');	

					var t = document.createTextNode('Visualise:');
					RollCallGraphHeading.append(t);

					var PlotRollCallHistogram = document.createElement('span');
					PlotRollCallHistogram.setAttribute('class', 'PlotRollCallHistogram');	
					PlotRollCallHistogram.setAttribute('data-address', address);
					PlotRollCallHistogram.setAttribute('data-uid', studentUID);

					var t = document.createTextNode('Bar Chart');
					PlotRollCallHistogram.append(t);

					var PlotRollCallGraph = document.createElement('span');
					PlotRollCallGraph.setAttribute('class', 'PlotRollCallGraph');	
					PlotRollCallGraph.setAttribute('data-address', address);
					PlotRollCallGraph.setAttribute('data-uid', studentUID);

					var t = document.createTextNode('Line Chart');
					PlotRollCallGraph.append(t);

					StudentInfoRollCallAction.append(RollCallGraphHeading);
					StudentInfoRollCallAction.append(PlotRollCallHistogram);
					StudentInfoRollCallAction.append(PlotRollCallGraph);	

					StudentInfoRollCallCont.append(StudentInfoRollCallAction);


				var OneAttendanceEntryCont = document.createElement('div');
				OneAttendanceEntryCont.setAttribute('class', 'OneAttendanceEntryCont');

				//now loop through and make each attendance entry
				for (var i = 0; i < rollCallDateArr.length; i++) {

					currentDate = rollCallDateArr[i];
					currentAttendance = rollCallAttendanceArr[i];

					var OneAttendanceEntry = document.createElement('div');
					OneAttendanceEntry.setAttribute('class', 'OneAttendanceEntry');
					OneAttendanceEntry.setAttribute('data-current', currentAttendance);

						//the date
						var RollCallDate = document.createElement('span');
						RollCallDate.setAttribute('class', 'RollCallDate');

						var t = document.createTextNode(currentDate);
						RollCallDate.append(t);

						//the attendance
						var RollCallResult = document.createElement('span');
						RollCallResult.setAttribute('class', 'RollCallResult');

						var t = document.createTextNode(currentAttendance);
						RollCallResult.append(t);

						//the flip icon
						var exchange = document.createElement('i');
						exchange.setAttribute('class', 'fas fa-exchange-alt');	
						exchange.setAttribute('data-address', address);
						exchange.setAttribute('data-UID', studentUID);
						exchange.setAttribute('data-key', currentDate);
						exchange.setAttribute('data-current', currentAttendance);
						exchange.setAttribute('data-studentname', _studentName);			

						OneAttendanceEntry.append(RollCallDate);
						OneAttendanceEntry.append(RollCallResult);
						OneAttendanceEntry.append(exchange);

						OneAttendanceEntryCont.append(OneAttendanceEntry);
				}

				StudentInfoRollCallCont.append(OneAttendanceEntryCont);

				StudentInfoCont.append(StudentInfoRollCallCont);

			//now work on the tution column
			var StudentInfoTutionCont = document.createElement('div');
			StudentInfoTutionCont.setAttribute('class', 'StudentInfoTutionCont');

				//the tution heading
				var StudentInfoTutionHeading = document.createElement('div');
				StudentInfoTutionHeading.setAttribute('class', 'StudentInfoTutionHeading');	

				var t = document.createTextNode('Tution');
				StudentInfoTutionHeading.append(t);

				StudentInfoTutionCont.append(StudentInfoTutionHeading);	

				//the tution action tab
				var StudentInfoTutionAction = document.createElement('div');
				StudentInfoTutionAction.setAttribute('class', 'StudentInfoTutionAction');

					var PendingHeading = document.createElement('span');
					PendingHeading.setAttribute('class', 'PendingHeading');	

					var t = document.createTextNode('Pending:');
					PendingHeading.append(t);

					var PendingMonth = document.createElement('span');
					PendingMonth.setAttribute('class', 'PendingMonth');	

					var t = document.createTextNode(currentTutionPendingMonth);
					PendingMonth.append(t);

					var TutionAcceptButton = document.createElement('span');
					TutionAcceptButton.setAttribute('class', 'TutionAcceptButton');	
					TutionAcceptButton.setAttribute('data-studentname', _studentName);
					TutionAcceptButton.setAttribute('data-value', currentTutionPendingMonth);
					TutionAcceptButton.setAttribute('data-address', address);
					TutionAcceptButton.setAttribute('data-uid', studentUID);

					var t = document.createTextNode('Accept');
					TutionAcceptButton.append(t);

					StudentInfoTutionAction.append(PendingHeading);
					StudentInfoTutionAction.append(PendingMonth);	
					StudentInfoTutionAction.append(TutionAcceptButton);	

					StudentInfoTutionCont.append(StudentInfoTutionAction);

				//now we need to loop through and make each entry inside the tution column for paid stuff
				for (var i = 0; i < TutionMothYearArray.length; i++) {

					var OneTutionEntry = document.createElement('div');
					OneTutionEntry.setAttribute('class', 'OneTutionEntry');

						var TutionDate = document.createElement('span');
						TutionDate.setAttribute('class', 'TutionDate');	

						var t = document.createTextNode(String(MonthsArr[parseInt(TutionMothYearArray[i].substr(4,6))-1]) + ' ' + String(TutionMothYearArray[i].substr(0,4)));
						TutionDate.append(t);	

						var TutionResult = document.createElement('span');
						TutionResult.setAttribute('class', 'TutionResult');	

						var t = document.createTextNode('PAID');
						TutionResult.append(t);

						var PaidDate = document.createElement('span');
						PaidDate.setAttribute('class', 'PaidDate');	

						var t = document.createTextNode(TutionPaidDayArray[i]);
						PaidDate.append(t);

						OneTutionEntry.append(TutionDate);
						OneTutionEntry.append(TutionResult);
						OneTutionEntry.append(PaidDate);


						if (i==0){
							//make the delete eraser icon for this element
							var DeleteLastPaidEntry = document.createElement('span');
							DeleteLastPaidEntry.setAttribute('class', 'fas fa-eraser');
							DeleteLastPaidEntry.setAttribute('data-address', address);
							DeleteLastPaidEntry.setAttribute('data-UID', studentUID);
							DeleteLastPaidEntry.setAttribute('data-studentname', _studentName);	
							DeleteLastPaidEntry.setAttribute('data-value', TutionMothYearArray[i]);
							DeleteLastPaidEntry.setAttribute('id', 'DeleteLastPaidEntry');	

							OneTutionEntry.append(DeleteLastPaidEntry);
						}

						StudentInfoTutionCont.append(OneTutionEntry);

				}

				StudentInfoCont.append(StudentInfoTutionCont);

		//now work on the exam tab
		var StudentInfoExamCont = document.createElement('div');
		StudentInfoExamCont.setAttribute('class', 'StudentInfoExamCont');	

			var StudentInfoExamHeading = document.createElement('div');
			StudentInfoExamHeading.setAttribute('class', 'StudentInfoExamHeading');		

			var t = document.createTextNode('Exam');
			StudentInfoExamHeading.append(t);

			StudentInfoExamCont.append(StudentInfoExamHeading);




			StudentInfoCont.append(StudentInfoExamCont);


	document.body.appendChild(StudentInfoCont);

	$('.StudentInfoCont').fadeIn('slow');
}


function MatchAndFindIndex(inputArr, inputToMatch){

	index_ = null;

	for (var i = 0; i < inputArr.length; i++) {

		if (inputArr[i]==inputToMatch){

			index_ = i;
			break;
		}

	}

	return index_
}

function BlurAnimate(blurElement){

	tweenBlur(blurElement, 0, 30);
}



function UnBlurAnimate(unblurElement){
	tweenUnBlur(unblurElement, 30, 0);
}



// Generic function to tween blur radius
function tweenBlur(ele, startRadius, endRadius) {

    $({blurRadius: startRadius}).animate({blurRadius: endRadius}, {
        duration: 500,
        easing: 'swing', // or "linear"
                         // use jQuery UI or Easing plugin for more options
        step: function() {
            setBlur(ele, this.blurRadius);
        },
        complete: function() {
            // Final callback to set the target blur radius
            // jQuery might not reach the end value
            setBlur(ele, endRadius);
       }
   });
}

// Generic function to tween blur radius
function tweenUnBlur(ele, startRadius, endRadius) {

    $({blurRadius: startRadius}).animate({blurRadius: endRadius}, {
        duration: 500,
        easing: 'swing', // or "linear"
                         // use jQuery UI or Easing plugin for more options
        step: function() {
            setBlur(ele, this.blurRadius);
        },
        complete: function() {
            // Final callback to set the target blur radius
            // jQuery might not reach the end value
            setBlur(ele, endRadius);

			$(ele).css({
			  "-webkit-filter": "blur(0)",
			  "filter": "blur(0)"
			});	
       }
   });
}


function setBlur(ele, radius) {
    $(ele).css({
       "-webkit-filter": "blur("+radius+"px)",
        "filter": "blur("+radius+"px)"
   });
}

//create the canvas for barchart roll call js
function createCanvasChartJS(){

	var MegaCanvasCont = document.createElement('div');
	MegaCanvasCont.setAttribute('class', 'MegaCanvasCont');

		var ChartTopInfoCont = document.createElement('div');
		ChartTopInfoCont.setAttribute('class', 'ChartTopInfoCont');

			var CloseChart = document.createElement('i');
			CloseChart.setAttribute('class', 'fas fa-backspace');
			CloseChart.setAttribute('id', 'CloseChart');

			ChartTopInfoCont.append(CloseChart);

			MegaCanvasCont.append(ChartTopInfoCont);

		//now make the actual canvas
		var CanvasCont = document.createElement('div');
		CanvasCont.setAttribute('class', 'CanvasCont');

			var myChart = document.createElement('canvas');
			myChart.setAttribute('id', 'myChart');

			CanvasCont.append(myChart);

			MegaCanvasCont.append(CanvasCont);

		var ChartBotInfoCont = document.createElement('div');
		ChartBotInfoCont.setAttribute('class', 'ChartBotInfoCont');

		MegaCanvasCont.append(ChartBotInfoCont);

		document.body.appendChild(MegaCanvasCont);

		$('.MegaCanvasCont').fadeIn('slow');
}

//chart js function
function BarChartRollCallJS(ParentElement, ChildElement1){

	PresentArr = [];
	AbsentArr = [];

	$(ParentElement).children(ChildElement1).each(function () {
		attendance = String($(this).attr("data-current"));

		if (attendance=='Present'){
			PresentArr.push(attendance);
		}
		else{
			AbsentArr.push(attendance);
		}
	});


	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart(ctx, {
	    type: 'bar',
	    data: {
	        labels: ["Classes Taken", "Present", "Absent"],
	        datasets: [{
	            label: 'Number of Classes',
	            data: [PresentArr.length+AbsentArr.length, PresentArr.length, AbsentArr.length],
	            backgroundColor: [
	                'rgba(255, 99, 132, 0.2)',
	                'rgba(54, 162, 235, 0.2)',
	                'rgba(255, 206, 86, 0.2)'
	            ],
	            borderColor: [
	                'rgba(255,99,132,1)',
	                'rgba(54, 162, 235, 1)',
	                'rgba(255, 206, 86, 1)'
	            ],
	            borderWidth: 1
	        }]
	    },
	    options: {
	        scales: {
	            yAxes: [{
	                ticks: {
	                    beginAtZero:true
	                }
	            }]
	        }
	    }
	});
}


function FadeOutANDRemove(speed, element_){

	$(element_).fadeOut(speed, function(){
		$(element_).remove();
	})
}


















