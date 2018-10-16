
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

                TimingsArray = $.map(TimingsJSON, function (el) {
                    return el;
                });

                for (var q = 0; q < TimingsArray.length; q++) {

                    CraftAndInjectTimeTable(TimingsArray[q], ThisLoopGrade, ThisLoopSubject, ThisLoopStreamName, ThisStreamColor);
                }
            }
        }
    }

}

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



function CreateLectureLinkBox(subject, grade, streamName, ResourceJSON) {

	address = grade + '/' + subject + '/Streams/' + streamName + '/';

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

	var t = document.createTextNode(subject + ' | ' + grade);
	BoxHeadingText.append(t);

	var AddResource = document.createElement('span');
	AddResource.setAttribute('class', 'AddResource');
	AddResource.setAttribute('data-subject', subject);
	AddResource.setAttribute('data-grade', grade);
	AddResource.setAttribute('data-address', address);
	AddResource.setAttribute('data-maxindex', MaxIndexNumber);

	var t = document.createTextNode('Add New Resource');
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

		var penSquare = document.createElement('i');
		penSquare.setAttribute('class', 'fas fa-pencil-ruler');
		penSquare.setAttribute('id', 'penSquare');
		penSquare.setAttribute('data-index', lectureIndexNumbers[i]);
		penSquare.setAttribute('data-address', address);
		penSquare.setAttribute('data-name', currentLectureName);
		penSquare.setAttribute('data-url', currentLectureURL);
		penSquare.setAttribute('data-subject', subject);
		penSquare.setAttribute('data-grade', grade);

		LectureLink.append(penSquare);

		var minusSquare = document.createElement('i');
		minusSquare.setAttribute('class', 'far fa-calendar-times');
		minusSquare.setAttribute('id', 'minusSquare');
		minusSquare.setAttribute('data-index', lectureIndexNumbers[i]);
		minusSquare.setAttribute('data-address', address);

		LectureLink.append(minusSquare);

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
function CreateTeacherBox(subject, grade, teacherName, streamArr, vacancyArr){

	TeacherBox = document.createElement('div');
	TeacherBox.setAttribute('class', 'TeacherBox');

	//heading
	TeacherBoxHeading = document.createElement('div');
	TeacherBoxHeading.setAttribute('class', 'TeacherBoxHeading');

	TeacherName = document.createElement('span');
	TeacherName.setAttribute('class', 'TeacherName');

	t = document.createTextNode(teacherName);
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

		t = document.createTextNode(streamArr[i]);
		Timings.append(t);

		Stream_.append(Timings);

		SeatVacancy = document.createElement('span');
		SeatVacancy.setAttribute('class', 'SeatVacancy');

		t = document.createTextNode(`Vacant Seats: ${vacancyArr[i]} |&nbsp`);
		SeatVacancy.append(t);

		//icon
		SeatVacancyIcon = document.createElement('i');
		if (parseInt(vacancyArr[i])==0){
			SeatVacancyIcon.setAttribute('class', 'fas fa-user-times');
		}
		else {
			SeatVacancyIcon.setAttribute('class', 'fas fa-user-plus');
		}
		SeatVacancyIcon.setAttribute('id', 'SeatVacancyIcon');

		SeatVacancy.append(SeatVacancyIcon);

		Stream_.append(SeatVacancy);

		TeacherBox.append(Stream_);
	}

	document.getElementById('BoxesContainer_ID').appendChild(TeacherBox);

}
