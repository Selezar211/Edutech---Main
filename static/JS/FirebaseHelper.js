

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

	$(".OneStudentLine").click(function() {
		console.log('clicked whole student!');

    	return false;
    });

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
		$('.MainContent').css('-webkit-filter', 'blur(30px');
		CreateMessageBox(streamName, subject, grade);

		//now need to attach click events to send message and cancel message buttons
	    //for clicking cancel message
	   	$(".CancelMessage").click(function() {
			console.log('clicked message cancel!');
			$('.MainContent').css('-webkit-filter', 'blur(0px');
			$('.MessageBatchBox').remove();
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
				$('.MessageBatchBox').remove();
				$('.MainContent').css('-webkit-filter', 'blur(0px');
				BoxAlert('Message Sent')

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
		    //for clicking cancel message
		   	$(".CancelRollCall").click(function() {

				$('.RollCallCont').remove();
				$('.MainContent').css('-webkit-filter', 'blur(0px');
		    	return false;
		    }); 

			FadeOutLoadingFrame();
		});

		function ReceivedData(data){
			tableData = data.val();

			$('.MainContent').css('-webkit-filter', 'blur(30px');

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
		var t = document.createTextNode('Pending');
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
function OneStudentLineAccepted(studentName_, UID, grade, subject, streamName, totSeats, fillSeats){

	address = grade + '/' + subject + '/Streams/' + streamName + '/'; 

	var OneStudentLine = document.createElement('div');
	OneStudentLine.setAttribute('class', 'OneStudentLine');
	OneStudentLine.setAttribute('data-UID', UID);
	OneStudentLine.setAttribute('data-address', address);

		var StudentName = document.createElement('span');
		StudentName.setAttribute('class', 'StudentName');

		var t = document.createTextNode(studentName_);
		StudentName.append(t);

		OneStudentLine.append(StudentName);

		var _delete = document.createElement('i');
		_delete.setAttribute('class', 'fas fa-user-minus');
		_delete.setAttribute('id', 'BanIcon');
		_delete.setAttribute('data-UID', UID);
		_delete.setAttribute('data-address', address);
		_delete.setAttribute('data-name', studentName_);
		_delete.setAttribute('data-totalseats', totSeats);
		_delete.setAttribute('data-fillseats', fillSeats);

		OneStudentLine.append(_delete);

		document.getElementById(grade.split(' ').join('') + subject + 'AcceptedBox_ID').appendChild(OneStudentLine);
}


//create one student line for batchbox for pending
function OneStudentLinePending(studentName_, UID, grade, subject, streamName, totSeats, fillSeats){

	address = grade + '/' + subject + '/Streams/' + streamName + '/'; 

	var OneStudentLine = document.createElement('div');
	OneStudentLine.setAttribute('class', 'OneStudentLine');
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

		var t = document.createTextNode('Submit');
		SubmitRollCall.append(t);

		RollCallHeading.append(CancelRollCall);
		RollCallHeading.append(SubmitRollCall);

		RollCallCont.append(RollCallHeading);

		for (var i = 0; i < studentNameArr.length; i++) {
			//loop through and create elements for each studentName

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
			RollCall_CBOX.setAttribute('value', studentNameArr[i]);
			RollCall_CBOX.setAttribute('data-address', address);

			RollCallCont.append(CBOX_LABEL);
			RollCallCont.append(RollCall_CBOX);
		}

		document.body.appendChild(RollCallCont);

}





