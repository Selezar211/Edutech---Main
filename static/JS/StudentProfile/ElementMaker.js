
//timetable database stuff

function CreateTimeTableHTML() {
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
	//this will put the 24 hour timings beside the timetable

    timingsArray = CraftTimingArray();

    var myUL = document.getElementById("timingArray_ul_ID");

    for (var i = 0; i < timingsArray.length; i++) {

        //make the timings on the side of the timetable
        var myLI = document.createElement("li");
        var mySPAN = document.createElement("span");

        var t = document.createTextNode(timingsArray[i]);
        mySPAN.append(t);
        myLI.append(mySPAN);

        myUL.append(myLI);
    }
}



//create the message box for student tab
function CreateMessageBox(streamName, subject, grade) {

	address = grade + '/' + subject + '/Streams/' + streamName + '/';

	var MessageBatchBox = document.createElement('div');
	MessageBatchBox.setAttribute('class', 'MessageBatchBox');
	MessageBatchBox.setAttribute('id', 'MessageBatchBox_ID');

	var MessageBoxHeading = document.createElement('div');
	MessageBoxHeading.setAttribute('class', 'MessageBoxHeading');

	var t = document.createTextNode('Message To: ' + streamName + ' | ' + subject + ' | ' + grade)
	MessageBoxHeading.append(t);

	MessageBatchBox.append(MessageBoxHeading);

	var SendMessageInput = document.createElement('textarea');
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



function CreateLectureLinkBox(teacherName, subject, grade, ResourceJSON) {

	//first get the lecturename and lecture url arrays
	lectureNameArr = [];
	lectureURLArr = [];
	lectureIndexNumbers = [];
	MaxIndexNumber = 1000;

	var key;
	for (key in ResourceJSON) {

		ActualJSON = ResourceJSON[key];

		var key2;
		for (key2 in ActualJSON) {
			lectureNameArr.push(DecodeString(key2));
			lectureURLArr.push(DecodeString(ActualJSON[key2]));
		}

		lectureIndexNumbers.push(key);
		MaxIndexNumber = key;
	}



	var LectureLinksContainer = document.createElement('div');
	LectureLinksContainer.setAttribute('class', 'LectureLinksContainer');

	var LectureBoxHeading = document.createElement('div');
	LectureBoxHeading.setAttribute('class', 'LectureBoxHeading');

	var BoxHeadingText = document.createElement('span');

	var t = document.createTextNode(teacherName);
	BoxHeadingText.append(t);

	var AddResource = document.createElement('span');
	AddResource.setAttribute('class', 'AddResourceMod');

	var t = document.createTextNode(subject + ' | ' + grade);
	AddResource.append(t);

	LectureBoxHeading.append(BoxHeadingText);
	LectureBoxHeading.append(AddResource);

	LectureLinksContainer.append(LectureBoxHeading);

	//now loop through and make each lecture links
	for (i = 0; i < lectureNameArr.length; i++) {

		currentLectureName = lectureNameArr[i];
		currentLectureURL = DecodeString(lectureURLArr[i]);

		//now make the boxes
		var LectureLink = document.createElement('div');
		LectureLink.setAttribute('class', 'LectureLink');
		LectureLink.setAttribute('data-main', currentLectureURL);

		var LectureName = document.createElement('span');
		var t = document.createTextNode(currentLectureName);
		LectureName.append(t);

		LectureLink.append(LectureName);

		LectureLinksContainer.append(LectureLink);
	}

	document.getElementById('MainLectureTab_Cont_ID').appendChild(LectureLinksContainer);

}


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


//teacher tab stuff
function CreateTeacherBox(subject, grade, teacherName, email, streamArr, vacancyArr){

	//streamArr = ['Sunday 2:30PM - 4:30PM | Monday 5:00PM - 7:00PM | Thursday 8:00 - 9:30', 'Tuesday 1:30PM - 4:30PM | Monday 5:00PM - 7:00PM | Saturday 8:00 - 9:30', 'Friday 6:30PM - 7:30PM | Wednesday 5:00PM - 7:00PM | Thursday 8:00 - 9:30']
	TeacherBox = document.createElement('div');
	TeacherBox.setAttribute('class', 'TeacherBox');

	//heading
	TeacherBoxHeading = document.createElement('div');
	TeacherBoxHeading.setAttribute('class', 'TeacherBoxHeading');

	TeacherName = document.createElement('span');
	TeacherName.setAttribute('class', 'TeacherName');

	t = document.createTextNode(`${teacherName} - ${email}`);
	TeacherName.append(t);

	TeacherBoxHeading.append(TeacherName);

	TeacherGrade = document.createElement('span');
	TeacherGrade.setAttribute('class', 'TeacherGrade');

	t = document.createTextNode(grade);
	TeacherGrade.append(t);

	TeacherBoxHeading.append(TeacherGrade);

	TeacherSubject = document.createElement('span');
	TeacherSubject.setAttribute('class', 'TeacherSubject');

	t = document.createTextNode(subject);
	TeacherSubject.append(t);

	TeacherBoxHeading.append(TeacherSubject);
	TeacherBox.append(TeacherBoxHeading);

	for (let i=0; i<streamArr.length; i++){

		Stream_ = document.createElement('div');
		Stream_.setAttribute('class', 'Stream_');
		
		Timings = document.createElement('span');
		Timings.setAttribute('class', 'Timings');
		
		t = document.createTextNode(streamArr[i].slice(0,-2));
		batchNameFromString = streamArr[i].slice(0,-2).split(' ')[0];
		Timings.append(t);
		
		Stream_.append(Timings);
		
		SeatVacancy = document.createElement('span');
		SeatVacancy.setAttribute('class', 'SeatVacancy');
		
		SeatVacancyText = document.createElement('span');
		SeatVacancyText.setAttribute('class', 'SeatVacancyText');
		
		t = document.createTextNode(`Vacant Seats: ${vacancyArr[i]}  | `);
		SeatVacancyText.append(t);
		
		SeatVacancy.append(SeatVacancyText);
		
		userIconBool = true;

		print('                  ');
		print(`On stream: ${streamArr[i]}`);
		print(`User Icon Bool before starting on accepted loop:  ${userIconBool}`);
		//now first check to see if the class is in accepted or pending classes and if not then make the USER ICONS PLUS OR CROSS
		for (let i=0; i<AcceptedClasses.length; i++){

			currAcceptedStr = AcceptedClasses[i].split('|');

			teacherGrade = currAcceptedStr[1];
			teacherSubject = currAcceptedStr[2];
			teacherBatchname = currAcceptedStr[3];

			if ((subject==teacherSubject) && (grade==teacherGrade) && (batchNameFromString==teacherBatchname)){
				print(`Found a match for accepted class with ${subject}:${teacherSubject} and ${grade}:${teacherGrade} and ${batchNameFromString}:${teacherBatchname}`);	
				AcceptedSpanText = document.createElement('span');
				AcceptedSpanText.setAttribute('class', 'AcceptedSpanText');
		
				t = document.createTextNode('Accepted');
				AcceptedSpanText.append(t);
		
				SeatVacancy.append(AcceptedSpanText);

				userIconBool = false;
			}
		}
		//now we need to check if it is the pending classes

		for (let i=0; i<PendingClasses.length; i++){

			currPendingStr = PendingClasses[i].split('|');
			print(`On Batch ${batchNameFromString}`);

			pendingGrade = currPendingStr[1];
			pendingSubject = currPendingStr[2];
			pendingBatchname = currPendingStr[3];

			if ((subject==pendingSubject) && (grade==pendingGrade) && (batchNameFromString==pendingBatchname)){
				//make the pending span
				print(`Found a match for pending class with ${subject}:${pendingSubject} and ${grade}:${pendingGrade} and ${batchNameFromString}:${pendingBatchname}`);
				PendingSpanText = document.createElement('span');
				PendingSpanText.setAttribute('class', 'PendingSpanText');
		
				t = document.createTextNode('Pending');
				PendingSpanText.append(t);
		
				SeatVacancy.append(PendingSpanText);

				userIconBool = false;
			}
		}

		//now we can just make the user cross and plus icons since this is not in accepted or pending batch
		//icon
		print(`User icon bool before entering icon if loop ${userIconBool}`);
		if(userIconBool==true){
			SeatVacancyIcon = document.createElement('i');
			if (parseInt(vacancyArr[i])==0){
				SeatVacancyIcon.setAttribute('class', 'fas fa-user-times');
				SeatVacancyIcon.setAttribute('id', 'SeatVacancyIconCross');
			}
			else {
				SeatVacancyIcon.setAttribute('class', 'fas fa-user-plus');
				SeatVacancyIcon.setAttribute('id', 'SeatVacancyIcon');
				SeatVacancyIcon.setAttribute('data-subject', subject);
				SeatVacancyIcon.setAttribute('data-grade', grade);
				SeatVacancyIcon.setAttribute('data-batch', batchNameFromString);
			}
			SeatVacancy.append(SeatVacancyIcon);
		}
		else{
			print('Not Making user icon!');
		}


		Stream_.append(SeatVacancy);

		TeacherBox.append(Stream_);
	}

	document.getElementById('BoxesContainer_ID').appendChild(TeacherBox);

}


function CreateSignedUpClassesEntries(teacherName, batchName, subject, grade, teacherUID){

	signedUpClassEntry = document.createElement('div');
	signedUpClassEntry.setAttribute('class', 'signedUpClassEntry');

	signedUpText = document.createElement('span');
	signedUpText.setAttribute('class', 'signedUpText');

	signedUpTextln1 = document.createElement('span');
	signedUpTextln1.setAttribute('class', 'signedUpTextln1');

	t = document.createTextNode(`${teacherName} - ${batchName}`);
	signedUpTextln1.append(t);

	signedUpText.append(signedUpTextln1);

	signedUpTextln2 = document.createElement('span');
	signedUpTextln2.setAttribute('class', 'signedUpTextln2');

	t = document.createTextNode(`${subject} | ${grade}`);
	signedUpTextln2.append(t);

	signedUpText.append(signedUpTextln2);

	signedUpClassEntry.append(signedUpText);

	//now for the buttons
	dropOutButton = document.createElement('span');
	dropOutButton.setAttribute('class', 'dropOutButton');
	dropOutButton.setAttribute('data-grade', grade);
	dropOutButton.setAttribute('data-subject', subject);
	dropOutButton.setAttribute('data-teacherUID', teacherUID);
	dropOutButton.setAttribute('data-batchName', batchName);

	t = document.createTextNode(`Drop Out`);
	dropOutButton.append(t);

	MessageTeacherButton = document.createElement('span');
	MessageTeacherButton.setAttribute('class', 'MessageTeacherButton');

	t = document.createTextNode(`Message Teacher`);
	MessageTeacherButton.append(t);

	MessageStudentButton = document.createElement('span');
	MessageStudentButton.setAttribute('class', 'MessageStudentButton');

	t = document.createTextNode(`Message Class-Mates`);
	MessageStudentButton.append(t);

	signedUpClassEntry.append(dropOutButton);
	signedUpClassEntry.append(MessageTeacherButton);
	signedUpClassEntry.append(MessageStudentButton);

	document.getElementById('TeacherPersistentBoxSignedUp_ID').appendChild(signedUpClassEntry);
}

function CreateRequestedClassesEntries(teacherName, batchName, subject, grade, teacherUID){

	signedUpClassEntry = document.createElement('div');
	signedUpClassEntry.setAttribute('class', 'signedUpClassEntry');

	signedUpText = document.createElement('span');
	signedUpText.setAttribute('class', 'signedUpText');

	signedUpTextln1 = document.createElement('span');
	signedUpTextln1.setAttribute('class', 'signedUpTextln1');

	t = document.createTextNode(`${teacherName} - ${batchName}`);
	signedUpTextln1.append(t);

	signedUpText.append(signedUpTextln1);

	signedUpTextln2 = document.createElement('span');
	signedUpTextln2.setAttribute('class', 'signedUpTextln2');

	t = document.createTextNode(`${subject} | ${grade}`);
	signedUpTextln2.append(t);

	signedUpText.append(signedUpTextln2);

	signedUpClassEntry.append(signedUpText);

	//now for the buttons
	cancelPendingButton = document.createElement('span');
	cancelPendingButton.setAttribute('class', 'cancelPendingButton');

	t = document.createTextNode(`Cancel Request`);
	cancelPendingButton.append(t);

	signedUpClassEntry.append(cancelPendingButton);

	document.getElementById('TeacherPersistentBoxPending_ID').appendChild(signedUpClassEntry);
}