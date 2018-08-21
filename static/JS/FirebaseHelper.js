

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

}




















