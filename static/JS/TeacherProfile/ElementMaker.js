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


//this will craft the edit one stream
function CraftEditOneStream(address, index) {

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
function CraftEditFullStream(address, previousName, previousColor, previousSeats) {

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
	EditFullStreamInput.setAttribute("type", "number");
	EditFullStreamInput.setAttribute("min", "0");
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
function CraftPopUpCheckBox(inputText, datamain1) {

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

function CreateStreamBox(SubjectName, SubjectGrade) {

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

function CreateNewStream(subject, streamName, color, TotalSeats) {
	//IMPORTANT NOTE: HERE SUBJECT ACTUALLY HAS O LEVEL/PHYSICS IN IT OR LIKE THAT
	var CheckBoolean;

	var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + subject + '/Streams/');

	ref.once('value', ReceivedData, errData).then(function() {

		if (CheckBoolean == true) {
			BoxAlert('Batch name exists already in database..');
		} else if (CheckBoolean == false) {
			InjectNewStream().then(function() {
				BoxAlert('New Batch has been created successfully!');
				ReloadBackEndData();
				FadeOutLoadingFrame();
			});
		} else {
			console.log('CHECK BOOLEAN IS UNDEFINED');
		}

	});

	function ReceivedData(data) {

		tableData = data.val();

		//first need to check to see if the stream name already exists and if it does tell the user it does
		existingStreamNameArray = ReturnAsArrayChildOfTable(tableData);

		//this will return true if the stream name to be created already exists
		CheckBoolean = CheckIfElementExistsInArray(streamName, existingStreamNameArray);

	}

	function errData(err) {
		console.log('Error!');
		console.log(err);
	}

	function InjectNewStream() {
		//we are a go to create the new stream database table
		var tableaddress = 'USERS/' + Current_UID + '/UserClass/' + subject + '/Streams/' + streamName;
		var data = {
			StreamColor: color,
			TotalSeats: TotalSeats,
			FilledSeats: 0
		}

		const pr = InsertDataIntoTable(data, tableaddress);

		return pr
	}
}

function CreateNewTiming(StreamAddress, day, startTime, endTime) {
	//IMPORTANT NOTE: HERE SUBJECT ACTUALLY HAS O LEVEL/PHYSICS IN IT OR LIKE THAT

	var craftedTimings;
	var NumberOfTimingsCurrently;

	address = 'USERS/' + Current_UID + '/UserClass/' + StreamAddress + 'Timings/';

	var ref = database.ref(address);

	const promise = ref.once('value', ReceivedData, errData).then(function() {
		InsertNewTiming().then(function() {
			BoxAlert('New Batch timing has been created successfully!');
			ReloadBackEndData();
			FadeOutLoadingFrame();
		});
	});

	function ReceivedData(data) {
		//first find how many timings are there currently in this new stream timing update
		tableData = data.val();
		ThisStreamTiming = $.map(tableData, function(el) {
			return el;
		});

		NumberOfTimingsCurrently = String(ThisStreamTiming.length);

		craftedTimings = day + ' ' + startTime + ' - ' + endTime;

	}

	function errData(err) {
		console.log('Error!');
		console.log(err);
	}

	function InsertNewTiming() {
		//now insert new data into it
		var ref = database.ref('USERS/' + Current_UID + '/UserClass/' + StreamAddress + 'Timings/');

		var data = {
			[NumberOfTimingsCurrently]: craftedTimings
		}

		const pr = ref.update(data);
		return pr
	}


}



//create the batchbox
function CreateStudentBatchBox(streamName, subject, grade, SeatsFilled) {

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

//create the accepted students batch block to inject into it
function CreateAcceptedStudentBatchBox(inputStudentJSON, grade, subject, streamName, totSeats, fillSeats, lastPendingMonthData) {

	//AcceptedStudents -> UID -> StudentName, RollCall, Tution
	//first loop through the UID
	var key; //key is the UID
	for (key in inputStudentJSON) {
		CurrentStudent_UID = key;

		CurrentStudentName = inputStudentJSON[CurrentStudent_UID]['StudentName'];

		//need to find the last pending month payment
		TutionPaidJSON = inputStudentJSON[CurrentStudent_UID]['TutionPaid'];

		today = new Date().toISOString().slice(0, 10);
		currentYear = today.split('-')[0];
		MonthsArr = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		//now we can loop through the dates of tution paid and insert them into the respective arrays
		TutionMothYearArray = [];
		TutionPaidDayArray = [];

		var key; //where key is each year.month in the table 201805 and value is day
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
			monthArrIndex = LastPaidMonthIndex - 1;

			//but make sure to reset it back to 0 if we get 11 i.e december and also increase year by 1
			if (monthArrIndex == 11) {
				PendingMonth = MonthsArr[0];
				currentYear = parseInt(currentYear) + 1;

			} else {
				PendingMonth = MonthsArr[monthArrIndex + 1];
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

		//now create the html elements themselves
		OneStudentLineAccepted(CurrentStudentName, CurrentStudent_UID, grade, subject, streamName, totSeats, fillSeats, PendingMonthYear);

	}
}

//create the pending students batch block to inject into it
function CreatePendingStudentBatchBox(inputStudentJSON, grade, subject, streamName, totSeats, fillSeats) {

	//AcceptedStudents -> UID -> StudentName, RollCall, Tution
	//first loop through the UID
	var key; //key is the UID
	for (key in inputStudentJSON) {
		CurrentStudent_UID = key;

		CurrentStudentName = inputStudentJSON[CurrentStudent_UID]['StudentName'];

		//now create the html elements themselves
		OneStudentLinePending(CurrentStudentName, CurrentStudent_UID, grade, subject, streamName, totSeats, fillSeats);

	}
}

//create one student line for batchbox for accepted
function OneStudentLineAccepted(studentName_, UID, grade, subject, streamName, totSeats, fillSeats, pendingMonthYEAR) {

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
function OneStudentLinePending(studentName_, UID, grade, subject, streamName, totSeats, fillSeats) {

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


//create the roll cal box for student tab
function CreateRollCallBox(studentNameArr, studentUIDArr, streamName, subject, grade) {

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
function CreateStudentInfoBox(rollCallDateArr, rollCallAttendanceArr, _studentName, studentUID, streamName, subject, grade, currentTutionPendingMonth, TutionMothYearArray, TutionPaidDayArray) {


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
		OneAttendanceEntry.setAttribute('data-date', currentDate);
		OneAttendanceEntry.setAttribute('data-studentname', _studentName);

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

		var t = document.createTextNode(String(MonthsArr[parseInt(TutionMothYearArray[i].substr(4, 6)) - 1]) + ' ' + String(TutionMothYearArray[i].substr(0, 4)));
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


		if (i == 0) {
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




//create the canvas for barchart roll call js
function createCanvasChartJS() {

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

//chart js function for bar chart
function BarChartRollCallJS(ParentElement, ChildElement1) {

	PresentArr = [];
	AbsentArr = [];
	studentName = '';

	$(ParentElement).children(ChildElement1).each(function() {
		attendance = String($(this).attr("data-current"));

		if (attendance == 'Present') {
			PresentArr.push(attendance);
		} else {
			AbsentArr.push(attendance);
		}

		studentName = String($(this).attr("data-studentname"));
	});


	var ctx = document.getElementById("myChart").getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'bar',
		data: {
			labels: ["Classes Taken", "Present", "Absent"],
			datasets: [{
				label: 'Number of Classes',
				data: [PresentArr.length + AbsentArr.length, PresentArr.length, AbsentArr.length],
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
			title: {
				display: true,
				text: studentName + ' has been present on ' + String(((PresentArr.length / (PresentArr.length + AbsentArr.length)) * 100).toFixed(2)) + '% of classes'
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}
		}
	});
}

//chart js function for line chart for rollc all
function LineChartRollCallJS(ParentElement, ChildElement1) {

	ActualDateArray = [];
	DataSetARRAY = [];
	studentName = '';

	$(ParentElement).children(ChildElement1).each(function() {
		attendance = String($(this).attr("data-current"));

		if (attendance == 'Present') {
			DataSetARRAY.push(1);
		} else {
			DataSetARRAY.push(0);
		}

		dateOfAttendance = String($(this).attr("data-date"));
		ActualDateArray.push(dateOfAttendance);
		studentName = String($(this).attr("data-studentname"));
	});


	var ctx = document.getElementById("myChart").getContext('2d');
	var myLineChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: ActualDateArray,
			datasets: [{
				label: 'Attendance Boolean',
				data: DataSetARRAY,
			}]
		},
		options: {
			title: {
				display: true,
				text: '1 = Present | 0 = Absent || Attendance For ' + studentName + ' (Dips represent absent days)'
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}
		}
	});

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


function CreateResourceAddBox(subject, grade, address, maxindex) {

	var ResourceAddBox = document.createElement('div');
	ResourceAddBox.setAttribute('class', 'ResourceAddBox');

	//make the heading
	var ResourceAddBoxHeading = document.createElement('div');
	ResourceAddBoxHeading.setAttribute('class', 'ResourceAddBoxHeading');

	var t = document.createTextNode('Adding Resource for: ' + subject + '  |  ' + grade);
	ResourceAddBoxHeading.append(t);

	//add the heading to main
	ResourceAddBox.append(ResourceAddBoxHeading);

	//now make the info box
	var ResourceAddBoxInfo = document.createElement('div');
	ResourceAddBoxInfo.setAttribute('class', 'ResourceAddBoxInfo');

	var t = document.createTextNode('Resource Name is the name that is shown to your students while the Resource URL is the PDF link to map to it. It is recommended to upload the PDF file to Google Drive and then paste the shareable link here. Other similar PDF hosting sites may be used as well although Google Drive is highly recommended.');
	ResourceAddBoxInfo.append(t);

	ResourceAddBox.append(ResourceAddBoxInfo);


	//now make the inputs
	var ResourceName = document.createElement('input');
	ResourceName.setAttribute('class', 'ResourceName');
	ResourceName.setAttribute('name', 'ResourceName');
	ResourceName.setAttribute('id', 'ResourceName_ID');
	ResourceName.setAttribute('type', 'text');
	ResourceName.setAttribute('placeholder', 'Resource Name');

	ResourceAddBox.append(ResourceName);

	var ResourceURL = document.createElement('input');
	ResourceURL.setAttribute('class', 'ResourceURL');
	ResourceURL.setAttribute('name', 'ResourceURL');
	ResourceURL.setAttribute('id', 'ResourceURL_ID');
	ResourceURL.setAttribute('type', 'text');
	ResourceURL.setAttribute('placeholder', 'Resource URL');

	ResourceAddBox.append(ResourceURL);

	// var ResourceOrder = document.createElement('input');
	// ResourceOrder.setAttribute('class', 'ResourceOrder');
	// ResourceOrder.setAttribute('name', 'ResourceOrder');
	// ResourceOrder.setAttribute('id', 'ResourceOrder_ID');
	// ResourceOrder.setAttribute('type', 'number');
	// ResourceOrder.setAttribute('min', '0');
	// ResourceOrder.setAttribute('placeholder', '(Optional Order Number) Resources are ordered by ascending.');

	// ResourceAddBox.append(ResourceOrder);

	//add box
	var AddResourceSubmit = document.createElement('div');
	AddResourceSubmit.setAttribute('class', 'AddResourceSubmit');
	AddResourceSubmit.setAttribute('data-address', address);
	AddResourceSubmit.setAttribute('data-maxindex', maxindex);

	var t = document.createTextNode('Add');
	AddResourceSubmit.append(t);

	ResourceAddBox.append(AddResourceSubmit);

	var AddResourceCancel = document.createElement('div');
	AddResourceCancel.setAttribute('class', 'AddResourceCancel');

	var t = document.createTextNode('Cancel');
	AddResourceCancel.append(t);

	ResourceAddBox.append(AddResourceCancel);

	document.body.appendChild(ResourceAddBox);

	$('.ResourceAddBox').fadeIn('slow');

}

function CreateResourceEditBox(subject, grade, address, lecturename, lectureurl, indexNum) {

	var EditSingleResource = document.createElement('div');
	EditSingleResource.setAttribute('class', 'EditSingleResource');

	var EditSingleResourceHeading = document.createElement('span');
	EditSingleResourceHeading.setAttribute('class', 'EditSingleResourceHeading');

	var t = document.createTextNode('Editing for: ' + subject + ' | ' + grade);
	EditSingleResourceHeading.append(t);

	EditSingleResource.append(EditSingleResourceHeading);

	var NewResourceNameEdit = document.createElement('input');
	NewResourceNameEdit.setAttribute('class', 'NewResourceNameEdit');
	NewResourceNameEdit.setAttribute('name', 'NewResourceNameEdit');
	NewResourceNameEdit.setAttribute('id', 'NewResourceNameEdit_ID');
	NewResourceNameEdit.setAttribute('type', 'text');
	NewResourceNameEdit.setAttribute('placeholder', lecturename + ' (Leave empty to keep old)');

	EditSingleResource.append(NewResourceNameEdit);

	var NewResourceURLEdit = document.createElement('input');
	NewResourceURLEdit.setAttribute('class', 'NewResourceURLEdit');
	NewResourceURLEdit.setAttribute('name', 'NewResourceURLEdit');
	NewResourceURLEdit.setAttribute('id', 'NewResourceURLEdit_ID');
	NewResourceURLEdit.setAttribute('type', 'text');
	NewResourceURLEdit.setAttribute('placeholder', lectureurl + ' (Leave empty to keep old)');

	EditSingleResource.append(NewResourceURLEdit);

	var EditResourceSubmit = document.createElement('div');
	EditResourceSubmit.setAttribute('class', 'EditResourceSubmit');
	EditResourceSubmit.setAttribute('id', 'EditResourceSubmit_ID');
	EditResourceSubmit.setAttribute('data-address', address);
	EditResourceSubmit.setAttribute('data-index', indexNum);
	EditResourceSubmit.setAttribute('data-name', lecturename);
	EditResourceSubmit.setAttribute('data-url', lectureurl);

	var t = document.createTextNode('Edit');
	EditResourceSubmit.append(t);

	EditSingleResource.append(EditResourceSubmit);

	var EditResourceCancel = document.createElement('div');
	EditResourceCancel.setAttribute('class', 'EditResourceCancel');
	EditResourceCancel.setAttribute('id', 'EditResourceCancel_ID');

	var t = document.createTextNode('Cancel');
	EditResourceCancel.append(t);

	EditSingleResource.append(EditResourceCancel);

	document.body.appendChild(EditSingleResource);

	$('.EditSingleResource').fadeIn('slow');

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


//exam tab element creation stuff
function CreateOneQuestion(qNum, qName, qContent, qOpt1, qOpt2, qOpt3, qOpt4, correctIndex){

	OneQuestionBox = document.createElement('div');
	OneQuestionBox.setAttribute('class', 'OneQuestionBox');

	//Question heading e.g Question 1: Astrophysics
	questionHeading = document.createElement('span');
	questionHeading.setAttribute('style', 'margin-bottom:2%;width:100%; font-weight: bold; font-size: 1.3em; float: left;');

	t = document.createTextNode(`Question ${qNum}: ${qName}`);
	questionHeading.append(t);

	OneQuestionBox.append(questionHeading);

	//actual question
	questionContent = document.createElement('span');
	t = document.createTextNode(qContent);
	questionContent.append(t);

	OneQuestionBox.append(questionContent);

	//each of the options
	opt1 = document.createElement('span');
	opt1.setAttribute('style', 'width: 100%; float: left; font-weight: 600; margin-top: 2%;');
	innerText = (correctIndex == 1) ? qOpt1 + String(' (correct)') : qOpt1;
	t = document.createTextNode(innerText);
	opt1.append(t);
	OneQuestionBox.append(opt1);

	opt2 = document.createElement('span');
	opt2.setAttribute('style', 'width: 100%; float: left; font-weight: 600;');
	innerText = (correctIndex == 2) ? qOpt2 + String(' (correct)') : qOpt2;
	t = document.createTextNode(innerText)
	opt2.append(t);
	OneQuestionBox.append(opt2);

	opt3 = document.createElement('span');
	opt3.setAttribute('style', 'width: 100%; float: left; font-weight: 600;');
	innerText = (correctIndex == 3) ? qOpt3 + String(' (correct)') : qOpt3;
	t = document.createTextNode(innerText)
	opt3.append(t);
	OneQuestionBox.append(opt3);

	opt4 = document.createElement('span');
	opt4.setAttribute('style', 'width: 100%; float: left; font-weight: 600;');
	innerText = (correctIndex == 4) ? qOpt4 + String(' (correct)') : qOpt4;
	t = document.createTextNode(innerText)
	opt4.append(t);
	OneQuestionBox.append(opt4);

	document.getElementById('QuestionCont_ID').appendChild(OneQuestionBox);
}